import { describe, expect, it } from "vitest";
import { getApprovedRoomNavigation, APPROVED_LEVEL4_SUPPORT_NAVIGATION } from "./index";
import { PROTOTYPE_BALANCE_RELEASE } from "./prototype-balance";
import { getServiceIncomeLine } from "./service-income-catalog";
import { getCurrentRoomUpgradeDefinition, getRoomUpgradeDurationMultiplier, getRoomUpgradePoints,
  getRoomUpgradeRevenueMultiplier, ROOM_UPGRADE_CATALOG } from "./room-upgrades";

const expected = [
  ["room.mri", 4, 4, 2400, 8, 1, 1, 0, [600, 900, 1300, 1800]],
  ["room.pediatric_waiting", 4, 4, 600, 1, 0, 2, 0, [150, 225, 325, 450]],
  ["room.pediatric_examination", 3, 3, 600, 2, 0, 4, 1, [150, 225, 325, 450]],
  ["room.wound_ostomy", 3, 3, 1000, 2, 1, 2, 1, [250, 375, 550, 750]],
] as const;
const room = (id: string) => PROTOTYPE_BALANCE_RELEASE.facility.roomDefinitions.find((definition) => definition.id === id)!;

describe("M3 room definitions and option B upkeep", () => {
  it.each(expected)("registers %s with the approved layout and accepted purchase prices", (id, width, height, cost, upkeep, tierUpkeep, cap, workload, prices) => {
    expect(room(id)).toMatchObject({ width, height, constructionCost: cost, upkeepPerExpenseInterval: upkeep,
      upkeepPerUpgradeLevel: tierUpkeep, maximumInstances: cap, workloadLimitContribution: workload,
      buildable: true, unlockFacilityLevel: 4, satisfactionOnBuild: 0, maximumUpgradeLevel: 5,
      requiredRoomDefinitionIds: ["room.front_desk"], upgradeCosts: [...prices],
      workloadLimitContributionPerUpgradeLevel: 0, serviceDurationReductionPercentPerUpgradeLevel: 0 });
    expect(room(id).navigation).toEqual(getApprovedRoomNavigation(id));
    expect(getCurrentRoomUpgradeDefinition(id)?.upgradeCosts).toEqual([...prices]);
  });

  it("makes ordinary Level 4 reachable with APP unlocked at 4, and MRI's cap equal to every other imaging type", () => {
    expect(PROTOTYPE_BALANCE_RELEASE.facility.maximumPlayableLevel).toBe(4);
    expect(PROTOTYPE_BALANCE_RELEASE.facility.stageDefinitions.map((stage) => stage.level)).toEqual([0, 1, 2, 3, 4]);
    expect(PROTOTYPE_BALANCE_RELEASE.facility.stageDefinitions.at(-1)?.nextFacilityLevel).toBeNull();
    expect(PROTOTYPE_BALANCE_RELEASE.facility.staffRoleDefinitions.find((role) => role.id === "staff.app")?.unlockFacilityLevel).toBe(4);
    for (const id of ["room.ultrasound", "room.xray", "room.ct"]) expect(room("room.mri").maximumInstances).toBe(room(id).maximumInstances);
    expect(APPROVED_LEVEL4_SUPPORT_NAVIGATION["room.pediatric_waiting"]).toHaveLength(9);
    expect(room("room.pediatric_waiting").navigation?.waitingAnchors).toEqual([]);
  });

  it("has baseline and incremental headroom without requiring upgrades or monetizing waiting", () => {
    const technician = PROTOTYPE_BALANCE_RELEASE.facility.staffRoleDefinitions.find((role) => role.id === "staff.imaging_technician")!.salaryPerExpenseInterval;
    const mri = getServiceIncomeLine("income.mri")!;
    const mriGross = mri.fee * 60 / mri.operation!.arrivalCadenceMinutes!;
    expect(mriGross - technician - room("room.mri").upkeepPerExpenseInterval).toBe(34);
    expect(mriGross * .06 - room("room.mri").upkeepPerUpgradeLevel).toBeCloseTo(2.6);
    // Budget the as-yet unimplemented APP at even the original $40 candidate.
    // Pediatric demand is the plan's 90-minute candidate, not a shipped stream.
    expect(getServiceIncomeLine("income.pediatric_consult")!.fee * 60 / 90 - 40 - room("room.pediatric_examination").upkeepPerExpenseInterval - room("room.pediatric_waiting").upkeepPerExpenseInterval).toBeCloseTo(10 + 1 / 3);
    const woundGross = ["income.wound_care", "income.ostomy_support"].reduce((gross, id) => {
      const line = getServiceIncomeLine(id)!;
      return gross + line.fee * 60 / line.operation!.arrivalCadenceMinutes!;
    }, 0);
    expect(woundGross - 40 - room("room.wound_ostomy").upkeepPerExpenseInterval).toBe(3);
    expect(woundGross * .06 - room("room.wound_ostomy").upkeepPerUpgradeLevel).toBeCloseTo(1.7);
  });

  it("activates only the accepted revenue/comfort effects, with no scan speed or new seats", () => {
    for (const id of ["room.mri", "room.wound_ostomy"]) {
      expect([1, 2, 3, 4, 5].map((level) => getRoomUpgradeRevenueMultiplier(id, level))).toEqual([1, 1.06, 1.12, 1.18, 1.24]);
      expect(getRoomUpgradeDurationMultiplier(id, 5, "reading_duration_reduction_percent")).toBe(1);
    }
    for (const [id, kind] of [["room.pediatric_waiting", "waiting_satisfaction_points"], ["room.pediatric_examination", "examination_satisfaction_points"]] as const) {
      expect([1, 2, 3, 4, 5].map((level) => getRoomUpgradePoints(id, level, kind))).toEqual([0, 2, 4, 6, 8]);
      expect(room(id).upkeepPerUpgradeLevel).toBe(0);
    }
    expect(ROOM_UPGRADE_CATALOG.filter((entry) => entry.status === "future").map((entry) => entry.roomDefinitionId)).toEqual([
      "room.founder_office", "room.executive_office", "room.gift_shop", "room.indoor_garden", "room.staff_gym",
    ]);
  });
});
