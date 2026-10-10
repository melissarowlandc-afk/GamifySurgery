import type { DomainContext, GameState } from "./types";

/** Independent of the save schema: new hires already use the rebased scale. */
export const ECONOMY_SALARY_VERSION = "room-economy-b.v1" as const;

const PRE_OPTION_B_SALARY_BASES: Readonly<Record<string, number>> = {
  "staff.receptionist": 18,
  "staff.imaging_technician": 26,
  "staff.periop_nurse": 34,
  "staff.endoscopy_nurse": 36,
  "staff.endoscopist": 60,
  "staff.phlebotomist": 28,
  "staff.evs_worker": 24,
  "staff.glp1_np": 40,
  "staff.laboratory_technician": 36,
  "staff.surgeon": 90,
  "staff.or_nurse": 44,
  "staff.pharmacist": 42,
  "staff.repair_person": 30,
  "staff.radiologist": 26,
};

export function normalizeSavedSalary(
  savedSalary: unknown,
  roleId: string,
  savedVersion: unknown,
  context: DomainContext,
): number {
  const role = context.balanceRelease.facility.staffRoleDefinitions.find(
    (candidate) => candidate.id === roleId,
  );
  if (!role) return 0;
  // A missing/invalid salary has no negotiated offset to carry forward.
  if (typeof savedSalary !== "number" || !Number.isFinite(savedSalary)) {
    return role.salaryPerExpenseInterval;
  }
  const oldBase = PRE_OPTION_B_SALARY_BASES[roleId];
  const salary = savedVersion === ECONOMY_SALARY_VERSION || oldBase === undefined
    ? savedSalary
    : role.salaryPerExpenseInterval + (savedSalary - oldBase);
  return Math.max(role.minimumSalaryPerExpenseInterval,
    Math.min(role.maximumSalaryPerExpenseInterval, salary));
}

export function validateSavedSalaryVersion(value: unknown): GameState["salaryEconomyVersion"] {
  if (value !== undefined && value !== ECONOMY_SALARY_VERSION) {
    throw new Error("The saved campaign uses an unsupported salary economy version.");
  }
  return ECONOMY_SALARY_VERSION;
}
