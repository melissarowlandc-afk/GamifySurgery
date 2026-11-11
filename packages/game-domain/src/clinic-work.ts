import { FOUNDER_CONSULT_POLICY } from "@gamify-surgery/balance-config";
import type { GameState, ServiceOperationState } from "./types";

/** New routine visits bind actual staff/room skill once. Old frozen visits do not opt in. */
export function bindRoutineClinicWork(state: GameState, operation: ServiceOperationState): void {
  const quote = operation.clinicWork;
  if (!quote || quote.binding || operation.providerReservation?.kind !== "employee") return;
  const providerId = operation.providerReservation.employeeId;
  const provider = state.employees.find(employee => employee.id === providerId);
  const room = state.rooms.find(room => operation.reservedRoomInstanceIds.includes(room.id));
  const phase = operation.frozenOperationPhases?.[0];
  if (!provider || !room || !phase) return;
  const trainingReductionPercent = (provider.trainingLevel - 1) * FOUNDER_CONSULT_POLICY.clinicTrainingReductionPercentPerLevel;
  const roomReductionPercent = (room.upgradeLevel - 1) * FOUNDER_CONSULT_POLICY.clinicRoomReductionPercentPerLevel;
  const durationMinutes = Math.max(1, Math.ceil(quote.baselineMinutes * (1 - trainingReductionPercent / 100) * (1 - roomReductionPercent / 100) - 1e-9));
  quote.binding = { providerEmployeeId: provider.id, trainingLevel: provider.trainingLevel, trainingReductionPercent,
    roomInstanceId: room.id, roomUpgradeLevel: room.upgradeLevel, roomReductionPercent, durationMinutes };
  phase.durationMinutes = durationMinutes;
}

/** Validate accepted arithmetic, not today's policy, so balance updates preserve saves. */
export function normalizeRoutineClinicWork(value: unknown, operation: Record<string, unknown>, phases: NonNullable<ServiceOperationState["frozenOperationPhases"]>): ServiceOperationState["clinicWork"] {
  if (value === undefined) return undefined;
  const invalid = (): never => { throw new Error("The saved routine clinic work is invalid."); };
  const record = (raw: unknown): raw is Record<string, unknown> => Boolean(raw && typeof raw === "object" && !Array.isArray(raw));
  const keys = (raw: Record<string, unknown>, allowed: string[]) => Object.keys(raw).every(key => allowed.includes(key));
  const positive = (raw: unknown): raw is number => typeof raw === "number" && Number.isSafeInteger(raw) && raw > 0;
  if (!record(value) || !keys(value, ["version", "baselineMinutes", "binding"]) || value.version !== "clinic-work.v1" || !positive(value.baselineMinutes) ||
      !operation.clinicVisit || operation.trainingTiming !== undefined || phases.length !== 1 ||
      !["income.app_consult", "income.pediatric_consult", "income.wound_care", "income.ostomy_support"].includes(String(operation.incomeLineId))) return invalid();
  if (value.binding === null) {
    if (phases[0]!.durationMinutes !== value.baselineMinutes) return invalid();
    return { version: "clinic-work.v1", baselineMinutes: value.baselineMinutes, binding: null };
  }
  const b = value.binding;
  if (!record(b) || !keys(b, ["providerEmployeeId", "trainingLevel", "trainingReductionPercent", "roomInstanceId", "roomUpgradeLevel", "roomReductionPercent", "durationMinutes"]) ||
      typeof b.providerEmployeeId !== "string" || !b.providerEmployeeId || typeof b.roomInstanceId !== "string" || !b.roomInstanceId ||
      !positive(b.trainingLevel) || b.trainingLevel > 5 || !positive(b.roomUpgradeLevel) || b.roomUpgradeLevel > 5 ||
      typeof b.trainingReductionPercent !== "number" || !Number.isFinite(b.trainingReductionPercent) || b.trainingReductionPercent < 0 || b.trainingReductionPercent >= 100 ||
      typeof b.roomReductionPercent !== "number" || !Number.isFinite(b.roomReductionPercent) || b.roomReductionPercent < 0 || b.roomReductionPercent >= 100 ||
      b.durationMinutes !== Math.max(1, Math.ceil(value.baselineMinutes * (1 - b.trainingReductionPercent / 100) * (1 - b.roomReductionPercent / 100) - 1e-9)) ||
      b.durationMinutes !== phases[0]!.durationMinutes) return invalid();
  return { version: "clinic-work.v1", baselineMinutes: value.baselineMinutes,
    binding: { ...b } as unknown as NonNullable<NonNullable<ServiceOperationState["clinicWork"]>["binding"]> };
}
