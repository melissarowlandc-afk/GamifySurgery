import { describe, expect, it } from "vitest";
import { PROTOTYPE_BALANCE_RELEASE } from "./prototype-balance";
import { getExecutiveTrainingEffects, getExecutiveOfficeDuration } from "./level-five-executive";
import { getEmployeeTrainingCost } from "./employee-training";
import { APPROVED_LEVEL5_SUPPORT_ROUTES } from "./index";

describe("M4 approved Executive contracts", () => {
  it("keeps the optional hire on option B pay with one Level 5 desk and no workload", () => {
    const role = PROTOTYPE_BALANCE_RELEASE.facility.staffRoleDefinitions.find(role => role.id === "staff.executive")!;
    expect(role).toMatchObject({ unlockFacilityLevel: 5, hiringCost: 600, salaryPerExpenseInterval: 45,
      minimumSalaryPerExpenseInterval: 35, maximumSalaryPerExpenseInterval: 65, salaryAdjustmentStep: 2,
      baseMorale: 75, moralePerSalaryStep: 5, maximumEmployees: 1, workloadLimitContribution: 0,
      requiredRoomDefinitionIds: ["room.executive_office"], capabilityIds: [] });
    expect(PROTOTYPE_BALANCE_RELEASE.facility.maximumPlayableLevel).toBe(5);
    expect([2, 3, 4, 5].map(level => getEmployeeTrainingCost(role.id, level))).toEqual([100, 200, 300, 400]);
  });
  it("uses every mild tier once and ceils the office/independent paperwork quotes once", () => {
    expect([1, 2, 3, 4, 5].map(getExecutiveTrainingEffects)).toEqual([1, 1.25, 1.5, 1.75, 2].map(m => ({
      staffMoralePoints: m, visitorSatisfactionPoints: m, inspectionPreparationReductionPercent: 5 * m, supplierReductionPercent: m,
    })));
    expect([1, 2, 3, 4, 5].map(getExecutiveOfficeDuration)).toEqual([
      { rawMinutes: 30, minutes: 30 }, { rawMinutes: 28.5, minutes: 29 }, { rawMinutes: 27, minutes: 27 },
      { rawMinutes: 25.5, minutes: 26 }, { rawMinutes: 24, minutes: 24 },
    ]);
  });
  it("binds all ten approved desk routes including retained N2/S2 chair approaches", () => {
    const routes = APPROVED_LEVEL5_SUPPORT_ROUTES["room.executive_office"];
    expect(routes.map(route => route.doorSegment).sort()).toEqual(["N1", "N2", "N3", "S1", "S2", "S3", "WA", "WB", "EA", "EB"].sort());
    for (const route of routes) {
      expect(route.targetId).toBe("executiveChair");
      expect(route.logicalPath.at(-1)).toEqual([0.35, -0.04999999999999999]);
      expect(route.seatingTransition).toBe("static-contact-after-walking");
    }
  });
});
