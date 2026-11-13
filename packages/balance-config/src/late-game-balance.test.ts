import { describe, expect, it } from "vitest";
import before from "../../../tests/fixtures/late-game-costs-before-20261111.json";
import { PROTOTYPE_BALANCE_RELEASE as balance } from "./prototype-balance";
import { EMPLOYEE_TRAINING_ROLES } from "./employee-training";
import { getRoomUpgradeDefinition } from "./room-upgrades";

describe("November11 editorial late-game purchase curves", () => {
  it("preserves early builds, low tiers, running costs and rewards with explicit late progression goals", () => {
    expect(balance.clinicalSettlement).toEqual(before.clinicalSettlement);
    expect(balance.facility.stageDefinitions).toEqual(before.progression.map(stage => ({
      ...stage, minimumClinicalXp: ({ 3: 550, 4: 870, 5: 2300 } as Record<number, number>)[stage.level] ?? stage.minimumClinicalXp,
      minimumCompletedEncounters: stage.level === 5 ? 390 : stage.minimumCompletedEncounters,
    })));
    for (const room of balance.facility.roomDefinitions) {
      const old = before.rooms[room.id as keyof typeof before.rooms];
      expect(room.upkeepPerExpenseInterval, room.id).toBe(old.upkeep);
      expect(room.upkeepPerUpgradeLevel, room.id).toBe(old.tierUpkeep);
      if (old.unlock < 4) expect(room.constructionCost, room.id).toBe(old.construction);
      expect(room.upgradeCosts.slice(0, 2), room.id).toEqual(old.upgrades.slice(0, 2));
      const benefit = getRoomUpgradeDefinition(room.id)!;
      expect({ kind: benefit.effectKind, points: benefit.amountPerUpgrade, status: benefit.status }, room.id)
        .toEqual(before.upgradeBenefits[room.id as keyof typeof before.upgradeBenefits]);
    }
    for (const staff of balance.facility.staffRoleDefinitions) {
      const old = before.hiring[staff.id as keyof typeof before.hiring];
      expect(staff.salaryPerExpenseInterval, staff.id).toBe(old.salary);
      if (old.unlock < 4) expect(staff.hiringCost, staff.id).toBe(old.cost);
    }
  });

  it("makes tier4 and5 progressively dearer while retaining every valid four-step ladder", () => {
    for (const room of balance.facility.roomDefinitions) {
      const old = before.rooms[room.id as keyof typeof before.rooms];
      if (getRoomUpgradeDefinition(room.id)?.status !== "current" || old.upgrades.length !== 4) continue;
      const prices = room.upgradeCosts;
      expect(prices, room.id).toEqual([old.upgrades[0], old.upgrades[1],
        Math.round(old.upgrades[2]! * 1.2 / 5) * 5, Math.round(old.upgrades[3]! * 1.4 / 5) * 5]);
      expect(prices.every(Number.isSafeInteger), room.id).toBe(true);
      expect(prices.every((price, index) => index === 0 || price > prices[index - 1]!), room.id).toBe(true);
      expect(prices[3]! / old.upgrades[3]!, room.id).toBeGreaterThan(prices[2]! / old.upgrades[2]!);
    }
    for (const staff of EMPLOYEE_TRAINING_ROLES) {
      const old = before.training[staff.staffRoleDefinitionId as keyof typeof before.training];
      expect(staff.levelPrices, staff.staffRoleDefinitionId).toEqual([old[0], old[1], Math.round(old[2]! * 1.2), Math.round(old[3]! * 1.4)]);
    }
  });

  it("adds modest late construction and hire premiums without inflating earlier purchases", () => {
    for (const room of balance.facility.roomDefinitions) {
      const old = before.rooms[room.id as keyof typeof before.rooms];
      if (old.unlock < 4) continue;
      const roundOne = Math.round(old.construction * (old.unlock === 4 ? 1.15 : 1.2));
      expect(room.constructionCost, room.id).toBe(Math.round(roundOne * 1.1 / 10) * 10);
      expect(room.constructionCost, room.id).toBeLessThanOrEqual(roundOne * 1.25);
    }
    expect(balance.facility.staffRoleDefinitions.find(r => r.id === "staff.app")!.hiringCost).toBe(690);
    expect(balance.facility.staffRoleDefinitions.find(r => r.id === "staff.executive")!.hiringCost).toBe(720);
    const minimumSpecialtySetup = ["room.pediatric_waiting", "room.pediatric_examination", "room.wound_ostomy"]
      .reduce((sum, id) => sum + balance.facility.roomDefinitions.find(r => r.id === id)!.constructionCost, 0) + 2 * 690;
    expect(minimumSpecialtySetup).toBe(4170);
  });
});
