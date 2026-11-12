import { describe, expect, it } from "vitest";
import { PROTOTYPE_BALANCE_RELEASE, getEmployeeTrainingCost, getEmployeeTrainingLevelBenefit, getEmployeeTrainingPercent, getServiceIncomeLine } from "./index";

describe("Level 4 APP role and option-B budget", () => {
  it("offers one provider role at the rebased scale without substituting other roles", () => {
    const role = PROTOTYPE_BALANCE_RELEASE.facility.staffRoleDefinitions.find((row) => row.id === "staff.app")!;
    expect(role).toMatchObject({ unlockFacilityLevel: 4, hiringCost: 690, salaryPerExpenseInterval: 30,
      minimumSalaryPerExpenseInterval: 22, maximumSalaryPerExpenseInterval: 54, salaryAdjustmentStep: 2,
      moralePerSalaryStep: 5, baseMorale: 75, workloadLimitContribution: 0, capabilityIds: ["capability.staff.app"] });
    expect(role.requiredAnyRoomDefinitionIds).toEqual(["room.examination", "room.minor_procedure", "room.pediatric_examination", "room.wound_ostomy"]);
    const exam = PROTOTYPE_BALANCE_RELEASE.facility.roomDefinitions.find((row) => row.id === "room.examination")!;
    const service = getServiceIncomeLine("income.app_consult")!;
    const gross = service.fee * 60 / service.operation!.arrivalCadenceMinutes!;
    expect(gross).toBeCloseTo(53.333333);
    expect(gross - role.salaryPerExpenseInterval - exam.upkeepPerExpenseInterval).toBeCloseTo(21.333333);
    expect(PROTOTYPE_BALANCE_RELEASE.emergencyGlp1.payment).toBe(50);
    expect(PROTOTYPE_BALANCE_RELEASE.facility.maximumPlayableLevel).toBe(5);
  });

  it("prices four 10-percent revenue tiers with an APP metric independent of GLP-1", () => {
    expect([2, 3, 4, 5].map((level) => getEmployeeTrainingCost("staff.app", level))).toEqual([150, 300, 540, 840]);
    expect(([1, 2, 3, 4, 5] as const).map((level) => getEmployeeTrainingPercent("staff.app", level))).toEqual([0, 10, 20, 30, 40]);
    expect(getEmployeeTrainingLevelBenefit("staff.app", 3)).toMatchObject({ metric: "app_appointment_revenue",
      totalDescription: "Increases APP appointment revenue 20%; routine APP work takes 20% less time", incrementalDescription: "Increases APP appointment revenue another 10%; routine APP work takes another 10% less time",
      consultFee: null, consultFeeIncrease: null });
  });
});
