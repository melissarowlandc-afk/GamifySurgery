import { describe, expect, it } from "vitest";
import { PROTOTYPE_BALANCE_RELEASE } from "./prototype-balance";
import { APPROVED_LEVEL5_ROOM_NAVIGATION_CONTRACTS, APPROVED_LEVEL5_SUPPORT_NAVIGATION } from "./approved-level5-room-layouts";
import { getRoomUpgradeAmount, getRoomUpgradeCost, getRoomUpgradeDefinition, getRoomUpgradeRevenueMultiplier } from "./room-upgrades";

const expected = [
  ["room.founder_office", 3, 3, 1200, [300, 500, 750, 1000]],
  ["room.executive_office", 3, 2, 2000, [500, 750, 1100, 1500]],
  ["room.gift_shop", 3, 3, 800, [200, 300, 450, 600]],
  ["room.indoor_garden", 4, 4, 800, [200, 300, 450, 600]],
  ["room.staff_gym", 4, 4, 1000, [250, 375, 550, 750]],
] as const;

describe("M2 Level 5 base catalog", () => {
  it.each(expected)("registers %s's approved size, price, cap and implemented support ladder", (id, width, height, cost, prices) => {
    const room = PROTOTYPE_BALANCE_RELEASE.facility.roomDefinitions.find(room => room.id === id)!;
    expect(room).toMatchObject({ width, height, constructionCost: cost, unlockFacilityLevel: 5, buildable: true,
      maximumInstances: 1, upkeepPerExpenseInterval: 1, upkeepPerUpgradeLevel: 0, maximumUpgradeLevel: 5,
      satisfactionOnBuild: 0, workloadLimitContribution: 0, workloadLimitContributionPerUpgradeLevel: 0,
      serviceDurationReductionPercentPerUpgradeLevel: 0, requiredRoomDefinitionIds: ["room.front_desk"],
      capabilityIds: id === "room.gift_shop" ? ["capability.gift_shop"] : [], upgradeCosts: [...prices] });
    expect(getRoomUpgradeDefinition(id)).toMatchObject({ status: "current", upgradeCosts: [...prices], appearanceChanges: id === "room.founder_office" });
    for (const tier of [1, 2, 3, 4, 5]) {
      expect(getRoomUpgradeCost(id, tier)).toBe(tier === 1 ? null : prices[tier - 2]);
      expect(getRoomUpgradeAmount(id, tier)).toBe((id === "room.gift_shop" ? 6 : id === "room.executive_office" ? 5 : 2) * (tier - 1));
      expect(getRoomUpgradeRevenueMultiplier(id, tier)).toBe(id === "room.gift_shop" ? 1 + .06 * (tier - 1) : 1);
    }
    const nav = APPROVED_LEVEL5_ROOM_NAVIGATION_CONTRACTS[id]!;
    expect([nav.width, nav.height, nav.allowedOrientations]).toEqual([width, height, [0]]);
    expect(nav.waitingAnchors).toEqual([]);
    expect(APPROVED_LEVEL5_SUPPORT_NAVIGATION[id]!.length).toBeGreaterThan(0);
    expect(nav.staffAnchor !== null).toBe(id === "room.executive_office");
  });
  it("opens ordinary cap 5 while keeping Executive hiring locked to 5", () => {
    expect(PROTOTYPE_BALANCE_RELEASE.facility.maximumPlayableLevel).toBe(5);
    expect(PROTOTYPE_BALANCE_RELEASE.facility.stageDefinitions.map(s => s.level)).toEqual([0, 1, 2, 3, 4, 5]);
    expect(PROTOTYPE_BALANCE_RELEASE.facility.stageDefinitions.at(-1)!.nextFacilityLevel).toBeNull();
    expect(PROTOTYPE_BALANCE_RELEASE.facility.staffRoleDefinitions.find(s => s.id === "staff.executive")?.unlockFacilityLevel).toBe(5);
    const rooms = PROTOTYPE_BALANCE_RELEASE.facility.roomDefinitions.filter(r => r.unlockFacilityLevel === 5);
    expect(rooms.reduce((sum, r) => sum + r.constructionCost, 0)).toBe(5800);
    expect(rooms.reduce((sum, r) => sum + r.upkeepPerExpenseInterval, 0)).toBe(5);
  });
});
