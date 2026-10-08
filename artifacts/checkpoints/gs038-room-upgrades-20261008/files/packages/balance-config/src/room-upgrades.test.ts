import { describe, expect, it } from "vitest";
import { getEmployeeTrainingPercent } from "./employee-training";
import { PROTOTYPE_BALANCE_RELEASE } from "./prototype-balance";
import {
  ROOM_UPGRADE_CATALOG,
  getCurrentRoomUpgradeDefinition,
  getRoomUpgradeAmount,
  getRoomUpgradeCleanlinessDecayMultiplier,
  getRoomUpgradeCost,
  getRoomUpgradeDefinition,
  getRoomUpgradeDurationMultiplier,
  getRoomUpgradeLevelBenefit,
  getRoomUpgradePerPurchaseLabel,
  getRoomUpgradePoints,
  getRoomUpgradePurchaseCount,
  getRoomUpgradeRevenueMultiplier,
} from "./room-upgrades";

const approvedPrices: Readonly<Record<string, readonly number[]>> = {
  "room.examination": [90, 140, 210, 300],
  "room.waiting": [110, 170, 250, 360],
  "room.bathroom": [70, 110, 170, 250],
  "room.minor_procedure": [220, 330, 480, 680],
  "room.ultrasound": [240, 360, 525, 715],
  "room.xray": [190, 280, 400, 560],
  "room.ct": [400, 600, 880, 1200],
  "room.phlebotomy": [140, 210, 305, 415],
  "room.evs_closet": [120, 180, 260, 360],
  "room.endoscopy": [365, 545, 800, 1090],
  "room.periop_recovery": [225, 340, 495, 675],
  "room.training": [165, 245, 360, 490],
  "room.coffee_kiosk": [125, 190, 275, 375],
  "room.glp1_telehealth_suite": [300, 450, 660, 900],
  "room.ambulatory_or": [600, 900, 1320, 1800],
  "room.laboratory": [450, 675, 990, 1350],
  "room.pharmacy": [300, 450, 660, 900],
  "room.maintenance_workshop": [200, 300, 440, 600],
  "room.staff_break": [225, 340, 495, 675],
  "room.surgeon_office": [175, 265, 385, 525],
  "room.vending": [115, 170, 250, 340],
  "room.reading": [450, 675, 990, 1350],
  "room.mri": [600, 900, 1300, 1800],
  "room.pediatric_waiting": [150, 225, 325, 450],
  "room.pediatric_examination": [150, 225, 325, 450],
  "room.wound_ostomy": [250, 375, 550, 750],
  "room.founder_office": [300, 500, 750, 1000],
  "room.executive_office": [500, 750, 1100, 1500],
  "room.gift_shop": [200, 300, 450, 600],
  "room.indoor_garden": [200, 300, 450, 600],
  "room.staff_gym": [250, 375, 550, 750],
};

describe("approved room-upgrade catalog", () => {
  it("covers all 25 current/legacy definitions and nine inactive future rows exactly once", () => {
    const ids = ROOM_UPGRADE_CATALOG.map((definition) => definition.roomDefinitionId);
    expect(ids).toHaveLength(34);
    expect(new Set(ids).size).toBe(ids.length);
    expect(
      ROOM_UPGRADE_CATALOG.filter((definition) => definition.status !== "future")
        .map((definition) => definition.roomDefinitionId).sort(),
    ).toEqual(PROTOTYPE_BALANCE_RELEASE.facility.roomDefinitions.map((definition) => definition.id).sort());
    expect(ROOM_UPGRADE_CATALOG.filter((definition) => definition.status === "current" && definition.upgradeCosts.length === 4)).toHaveLength(22);
    expect(ROOM_UPGRADE_CATALOG.filter((definition) => definition.status === "future")).toHaveLength(9);
    expect(ids).not.toContain("room.call_room");
  });

  it("retains every accepted four-purchase price sequence and agrees with current balance prices", () => {
    for (const [id, prices] of Object.entries(approvedPrices)) {
      const definition = getRoomUpgradeDefinition(id)!;
      expect(definition.upgradeCosts, id).toEqual(prices);
      if (definition.status === "current") {
        expect([2, 3, 4, 5].map((level) => getRoomUpgradeCost(id, level)), id).toEqual(prices);
        const currentRoom = PROTOTYPE_BALANCE_RELEASE.facility.roomDefinitions.find((room) => room.id === id)!;
        expect(currentRoom.upgradeCosts, id).toEqual(prices);
        expect(currentRoom.maximumUpgradeLevel, id).toBe(5);
      }
    }
  });

  it("rejects invalid purchases and keeps unbuilt or retired room metadata inactive", () => {
    const currentIds = new Set(PROTOTYPE_BALANCE_RELEASE.facility.roomDefinitions.map((room) => room.id));
    for (const definition of ROOM_UPGRADE_CATALOG.filter((entry) => entry.status !== "current")) {
      if (definition.status === "future") expect(currentIds.has(definition.roomDefinitionId)).toBe(false);
      expect(getCurrentRoomUpgradeDefinition(definition.roomDefinitionId)).toBeNull();
      expect(getRoomUpgradeCost(definition.roomDefinitionId, 2)).toBeNull();
      expect(getRoomUpgradeAmount(definition.roomDefinitionId, 5)).toBe(0);
      expect(getRoomUpgradeRevenueMultiplier(definition.roomDefinitionId, 5)).toBe(1);
      expect(getRoomUpgradeDurationMultiplier(definition.roomDefinitionId, 5, "administration_duration_reduction_percent")).toBe(1);
      expect(getRoomUpgradePoints(definition.roomDefinitionId, 5, "founder_office_morale_points")).toBe(0);
    }
    for (const id of ["room.front_desk", "room.hallway", "room.unknown", "constructor", "__proto__"]) {
      expect(getRoomUpgradeCost(id, 2)).toBeNull();
      expect(getRoomUpgradeAmount(id, 5)).toBe(0);
    }
    for (const invalidLevel of [0, 1, 2.5, 6, NaN, Infinity, -Infinity]) {
      expect(getRoomUpgradeCost("room.examination", invalidLevel)).toBeNull();
    }
    expect(getRoomUpgradeDefinition("room.unknown")).toBeNull();
  });

  it("preserves historical Imaging Control investment without offering it new purchases or bonuses", () => {
    const legacy = PROTOTYPE_BALANCE_RELEASE.facility.roomDefinitions.find((room) => room.id === "room.imaging_control")!;
    expect(legacy.maximumUpgradeLevel).toBe(5);
    expect(legacy.upgradeCosts).toEqual([90, 140, 210, 300]);
    expect(getRoomUpgradeDefinition(legacy.id)).toMatchObject({ status: "retired", effectKind: "none", upgradeCosts: [] });
    expect(getRoomUpgradeLevelBenefit(legacy.id, 5)?.totalDescription).toBe("No upgrades");
  });

  it("replaces arbitrary tier workload/speed while retaining base workload and Reading economics", () => {
    for (const definition of PROTOTYPE_BALANCE_RELEASE.facility.roomDefinitions) {
      expect(definition.workloadLimitContributionPerUpgradeLevel, definition.id).toBe(0);
      expect(definition.serviceDurationReductionPercentPerUpgradeLevel, definition.id).toBe(0);
    }
    expect(PROTOTYPE_BALANCE_RELEASE.facility.roomDefinitions.find((room) => room.id === "room.examination")?.workloadLimitContribution).toBe(2);
    expect(PROTOTYPE_BALANCE_RELEASE.facility.roomDefinitions.find((room) => room.id === "room.reading")).toMatchObject({
      constructionCost: 1800, upkeepPerExpenseInterval: 24, upkeepPerUpgradeLevel: 0,
      maximumInstances: 4, width: 4, height: 4,
    });
  });

  it("records the future Founder's Office as the sole appearance exception", () => {
    expect(ROOM_UPGRADE_CATALOG.filter((definition) => definition.appearanceChanges).map((definition) => definition.roomDefinitionId)).toEqual(["room.founder_office"]);
    expect(getRoomUpgradeDefinition("room.founder_office")?.status).toBe("future");
    expect(getRoomUpgradePerPurchaseLabel("room.founder_office")).toBe("+2 staff morale points; improved office appearance");
    expect(getRoomUpgradeLevelBenefit("room.executive_office", 5)?.totalDescription).toBe("Administrative work takes 20% less time");
  });
});

describe("room-upgrade numeric and label helpers", () => {
  it("adds each purchase against the baseline and bounds malformed levels", () => {
    expect([0, 1, 2, 3, 4, 5, 6, 100].map(getRoomUpgradePurchaseCount)).toEqual([0, 0, 1, 2, 3, 4, 4, 4]);
    expect([NaN, Infinity, -Infinity].map(getRoomUpgradePurchaseCount)).toEqual([0, 0, 0]);
    expect(getRoomUpgradePurchaseCount(2.9)).toBe(1);
    expect([1, 2, 3, 4, 5].map((level) => getRoomUpgradeAmount("room.ct", level))).toEqual([0, 6, 12, 18, 24]);
    expect([1, 2, 3, 4, 5].map((level) => getRoomUpgradeRevenueMultiplier("room.ct", level))).toEqual([1, 1.06, 1.12, 1.18, 1.24]);
    expect(getRoomUpgradeRevenueMultiplier("room.reading", 5)).toBe(1);
    expect(getRoomUpgradeRevenueMultiplier("room.ct", 100)).toBe(1.24);
  });

  it("retains 4.5/4/3.5/3-minute reads and scopes room timing to its own work", () => {
    expect([2, 3, 4, 5].map((level) => 5 * getRoomUpgradeDurationMultiplier("room.reading", level, "reading_duration_reduction_percent"))).toEqual([4.5, 4, 3.5, 3]);
    expect(getRoomUpgradeDurationMultiplier("room.reading", 5, "repair_duration_reduction_percent")).toBe(1);
    expect(getRoomUpgradeDurationMultiplier("room.ct", 5, "reading_duration_reduction_percent")).toBe(1);
    expect(getRoomUpgradeDurationMultiplier("room.training", 5, "training_duration_reduction_percent")).toBe(0.6);
    expect(getRoomUpgradeDurationMultiplier("room.evs_closet", 5, "cleaning_duration_reduction_percent")).toBe(0.6);
    expect(getRoomUpgradeDurationMultiplier("room.maintenance_workshop", 5, "repair_duration_reduction_percent")).toBe(0.6);
    expect(getRoomUpgradeDurationMultiplier("room.surgeon_office", 5, "quality_review_duration_reduction_percent")).toBe(0.6);
  });

  it("composes independent employee and room duration reductions multiplicatively", () => {
    const trainedRadiologistMultiplier = 1 - getEmployeeTrainingPercent("staff.radiologist", 5) / 100;
    const readingRoomMultiplier = getRoomUpgradeDurationMultiplier("room.reading", 5, "reading_duration_reduction_percent");
    const duration = 5 * readingRoomMultiplier * trainedRadiologistMultiplier;
    expect(duration).toBeCloseTo(1.8);
    expect(duration).toBeGreaterThan(0);
    expect(duration).not.toBe(5 * (1 - 0.4 - 0.4));
  });

  it("keeps cleanliness decay separate from cleaning duration and satisfaction/morale witnesses", () => {
    expect(getRoomUpgradeCleanlinessDecayMultiplier("room.bathroom", 5)).toBe(0.6);
    expect(getRoomUpgradeCleanlinessDecayMultiplier("room.evs_closet", 5)).toBe(1);
    expect(getRoomUpgradeDurationMultiplier("room.bathroom", 5, "cleaning_duration_reduction_percent")).toBe(1);
    expect(getRoomUpgradePoints("room.examination", 5, "examination_satisfaction_points")).toBe(8);
    expect(getRoomUpgradePoints("room.examination", 5, "waiting_satisfaction_points")).toBe(0);
    expect(getRoomUpgradePoints("room.waiting", 5, "waiting_satisfaction_points")).toBe(8);
    expect(getRoomUpgradePoints("room.periop_recovery", 5, "recovery_satisfaction_points")).toBe(8);
    expect(getRoomUpgradePoints("room.coffee_kiosk", 5, "daily_coffee_morale_points")).toBe(4);
    expect(getRoomUpgradePoints("room.staff_break", 5, "break_morale_points")).toBe(8);
    expect(getRoomUpgradePoints("room.ct", 5, "examination_satisfaction_points")).toBe(0);
  });

  it("describes the total tier benefit separately from a single additional purchase", () => {
    expect(getRoomUpgradePerPurchaseLabel("room.examination")).toBe("+2 satisfaction points after examination");
    expect(getRoomUpgradeLevelBenefit("room.examination", 1)).toMatchObject({ totalAmount: 0, incrementalAmount: 0, totalDescription: "Baseline" });
    expect(getRoomUpgradeLevelBenefit("room.examination", 5)).toMatchObject({
      totalAmount: 8, incrementalAmount: 2,
      totalDescription: "+8 satisfaction points after examination",
      incrementalDescription: "+2 satisfaction points after examination",
    });
    expect(getRoomUpgradeLevelBenefit("room.reading", 5)).toMatchObject({
      totalAmount: 40, incrementalAmount: 10,
      totalDescription: "Scan reading takes 40% less time",
      incrementalDescription: "Scan reading takes 10% less time",
    });
    expect(getRoomUpgradePerPurchaseLabel("room.coffee_kiosk")).toBe("+1 staff morale point from daily coffee");
    expect(getRoomUpgradeLevelBenefit("room.coffee_kiosk", 5)?.totalDescription).toBe("+4 staff morale points from daily coffee");
    expect(getRoomUpgradePerPurchaseLabel("room.laboratory")).toBe("+6% paid laboratory-processing revenue");
    expect(getRoomUpgradePerPurchaseLabel("room.front_desk")).toBe("No upgrades");
    expect(getRoomUpgradeLevelBenefit("room.unknown", 2)).toBeNull();
    expect(getRoomUpgradePerPurchaseLabel("room.unknown")).toBeNull();
  });
});
