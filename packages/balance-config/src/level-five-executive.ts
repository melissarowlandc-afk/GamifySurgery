/** Owner-approved editorial management values, independent of clinical work. */
export const EXECUTIVE_ROLE_DEFINITION = {
  id: "staff.executive", displayName: "Executive", unlockFacilityLevel: 5,
  hiringCost: 600, salaryPerExpenseInterval: 45,
  minimumSalaryPerExpenseInterval: 35, maximumSalaryPerExpenseInterval: 65,
  salaryAdjustmentStep: 2, moralePerSalaryStep: 5, baseMorale: 75,
  maximumEmployees: 1, maximumTrainingLevel: 5, workloadLimitContribution: 0,
  requiredRoomDefinitionIds: ["room.executive_office"], capabilityIds: [],
} as const;

export const EXECUTIVE_TUNING = { roundMinutes: 30, preparationMinutes: 60 } as const;

export function getExecutiveTrainingEffects(level: number) {
  const strength = 1 + 0.25 * (Math.max(1, Math.min(5, level)) - 1);
  return {
    staffMoralePoints: strength, visitorSatisfactionPoints: strength,
    inspectionPreparationReductionPercent: 5 * strength,
    supplierReductionPercent: strength,
  };
}

export function getExecutiveOfficeDuration(level: number) {
  const rawMinutes = EXECUTIVE_TUNING.roundMinutes * (1 - 0.05 * (Math.max(1, Math.min(5, level)) - 1));
  return { rawMinutes, minutes: Math.ceil(rawMinutes) };
}
