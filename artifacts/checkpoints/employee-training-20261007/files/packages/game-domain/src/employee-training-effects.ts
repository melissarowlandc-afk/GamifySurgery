import { EMPLOYEE_TRAINING_ROLES, getEmployeeTrainingPercent } from "@gamify-surgery/balance-config";
import type { GameState, ServiceOperationState } from "./types";

export type EmployeeTrainingCategoryPercents = Record<string, number>;

/** Category skill includes hired staff temporarily away; departing identities are excluded. */
export function getEmployeeRoleTrainingPercent(state: GameState, staffRoleDefinitionId: string): number {
  const employees = state.employees.filter((employee) => employee.staffRoleDefinitionId === staffRoleDefinitionId);
  return employees.length ? employees.reduce((sum, employee) => sum + getEmployeeTrainingPercent(staffRoleDefinitionId, employee.trainingLevel), 0) / employees.length : 0;
}

export function snapshotEmployeeTrainingCategories(state: GameState): EmployeeTrainingCategoryPercents {
  return Object.fromEntries(EMPLOYEE_TRAINING_ROLES.map((role) => [role.staffRoleDefinitionId, getEmployeeRoleTrainingPercent(state, role.staffRoleDefinitionId)]));
}

/** Only positive work is rounded; travel/zero-work markers remain independent. */
export function getEmployeeTrainingWorkMinutes(baselineMinutes: number, percent: number): number {
  if (baselineMinutes === 0) return 0;
  const effective = baselineMinutes * (1 - percent / 100);
  return Math.max(1, Math.ceil(effective - Number.EPSILON * Math.max(1, Math.abs(effective)) * 4));
}

export function getEmployeeTrainingMoney(baseline: number, percent: number, direction: "increase" | "decrease"): number {
  return Math.round(baseline * (1 + (direction === "increase" ? percent : -percent) / 100) * 100) / 100;
}

export interface EmployeeTrainingWork {
  kind?: string;
  roomDefinitionId: string | null;
  roomStationId?: string | null;
  staffRoleDefinitionIds: readonly string[];
}

/** Staff-controlled editorial work only; recovery and equipment-only work keep baseline. */
export function getEmployeeTrainingWorkPercent(categories: EmployeeTrainingCategoryPercents, work: EmployeeTrainingWork, providerRoleDefinitionId: string | null): number {
  const percent = (role: string) => categories[role] ?? 0;
  if (work.kind === "recovery" || work.roomStationId === "periop_recovery") return 0;
  if (work.kind === "preparation" || work.roomStationId === "periop_preparation") return work.staffRoleDefinitionIds.includes("staff.periop_nurse") ? percent("staff.periop_nurse") : 0;
  if (work.roomDefinitionId === "room.endoscopy" && work.staffRoleDefinitionIds.includes("staff.endoscopy_nurse")) return (percent("staff.endoscopy_nurse") + (providerRoleDefinitionId === "staff.endoscopist" ? percent("staff.endoscopist") : 0)) / 2;
  if (work.roomDefinitionId === "room.ambulatory_or" && work.staffRoleDefinitionIds.includes("staff.or_nurse")) return (percent("staff.or_nurse") + (providerRoleDefinitionId === "staff.surgeon" ? percent("staff.surgeon") : 0)) / 2;
  if (work.staffRoleDefinitionIds.includes("staff.imaging_technician")) return percent("staff.imaging_technician");
  if (work.staffRoleDefinitionIds.includes("staff.phlebotomist")) return percent("staff.phlebotomist");
  if (work.staffRoleDefinitionIds.includes("staff.laboratory_technician")) return percent("staff.laboratory_technician");
  if (work.staffRoleDefinitionIds.includes("staff.radiologist")) return percent("staff.radiologist");
  return 0;
}

export function getServiceOperationTrainingMinutes(state: GameState, operation: ServiceOperationState, phaseIndex: number, provider: ServiceOperationState["providerReservation"]): number {
  const phase = operation.frozenOperationPhases![phaseIndex]!;
  const timing = operation.trainingTiming;
  const accepted = timing?.phases[phaseIndex];
  if (!timing || !accepted || accepted.boundPercent !== null || operation.diagnosticPhaseWork || operation.diagnosticPhysicalWork) return phase.durationMinutes;
  const providerRole = provider?.kind === "employee" ? state.employees.find((employee) => employee.id === provider.employeeId)?.staffRoleDefinitionId ?? null : null;
  return getEmployeeTrainingWorkMinutes(accepted.baselineMinutes, getEmployeeTrainingWorkPercent(timing.categoryPercents, phase, providerRole));
}

/** Successful first reservation selects a frozen alternative exactly once. */
export function bindServiceOperationTraining(state: GameState, operation: ServiceOperationState, phaseIndexes: readonly number[]): void {
  if (!operation.trainingTiming || operation.diagnosticPhaseWork || operation.diagnosticPhysicalWork) return;
  const provider = operation.providerReservation;
  const providerRole = provider?.kind === "employee" ? state.employees.find((employee) => employee.id === provider.employeeId)?.staffRoleDefinitionId ?? null : null;
  for (const index of phaseIndexes) {
    const accepted = operation.trainingTiming.phases[index]!;
    if (accepted.boundPercent !== null) continue;
    const phase = operation.frozenOperationPhases![index]!;
    accepted.boundPercent = getEmployeeTrainingWorkPercent(operation.trainingTiming.categoryPercents, phase, providerRole);
    phase.durationMinutes = getEmployeeTrainingWorkMinutes(accepted.baselineMinutes, accepted.boundPercent);
  }
}

export function normalizeServiceOperationTraining(value: unknown, phases: NonNullable<ServiceOperationState["frozenOperationPhases"]>): ServiceOperationState["trainingTiming"] {
  if (value === undefined) return undefined;
  const invalid = () => { throw new Error("The saved employee training timing is invalid."); };
  if (!value || typeof value !== "object") return invalid();
  const raw = value as Record<string, unknown>;
  if (raw.version !== "employee-training-timing.v1" || !raw.categoryPercents || typeof raw.categoryPercents !== "object" ||
    !Array.isArray(raw.phases) || raw.phases.length !== phases.length || phases.length === 0) return invalid();
  const categories = raw.categoryPercents as EmployeeTrainingCategoryPercents;
  if (Object.keys(categories).length !== EMPLOYEE_TRAINING_ROLES.length || EMPLOYEE_TRAINING_ROLES.some((role) =>
    !Number.isFinite(categories[role.staffRoleDefinitionId]) || categories[role.staffRoleDefinitionId]! < 0 || categories[role.staffRoleDefinitionId]! > role.percentPerLevel * 4)) return invalid();
  const accepted = raw.phases.map((entry: unknown, index: number) => {
    if (!entry || typeof entry !== "object") return invalid();
    const timing = entry as Record<string, unknown>;
    const phase = phases[index]!;
    if (timing.phaseId !== phase.id || typeof timing.baselineMinutes !== "number" || !Number.isSafeInteger(timing.baselineMinutes) || timing.baselineMinutes < 1 ||
      (timing.boundPercent !== null && (typeof timing.boundPercent !== "number" || !Number.isFinite(timing.boundPercent)))) return invalid();
    const boundPercent = timing.boundPercent as number | null;
    const alternatives = [null, ...(phase.providerRoleDefinitionIds ?? [])].map((role) => getEmployeeTrainingWorkPercent(categories, phase, role));
    if (boundPercent !== null && !alternatives.includes(boundPercent) ||
      phase.durationMinutes !== (boundPercent === null ? timing.baselineMinutes : getEmployeeTrainingWorkMinutes(timing.baselineMinutes, boundPercent))) return invalid();
    return { phaseId: phase.id, baselineMinutes: timing.baselineMinutes, boundPercent };
  });
  return { version: "employee-training-timing.v1", categoryPercents: { ...categories }, phases: accepted };
}
