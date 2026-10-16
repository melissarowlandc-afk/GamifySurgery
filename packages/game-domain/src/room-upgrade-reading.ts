import { getRoomUpgradeDurationMultiplier } from "@gamify-surgery/balance-config";
import type { DiagnosticOrderPhase, DiagnosticOrderPlan, GameState, RoomUpgradeLevel, RoomUpgradeReadingWork, ServiceOperationState } from "./types";

const copy = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;
const id = (value: unknown): value is string => typeof value === "string" && value.length > 0;
const integer = (value: unknown): value is number => typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
export interface ReadingQueueKey { readyAtTick: number; acceptedAtTick: number; orderId: string; phaseId: string; operationId: string }
export const compareReadingQueueKeys = (a: ReadingQueueKey, b: ReadingQueueKey): number =>
  a.readyAtTick - b.readyAtTick || a.acceptedAtTick - b.acceptedAtTick || a.orderId.localeCompare(b.orderId) ||
  a.phaseId.localeCompare(b.phaseId) || a.operationId.localeCompare(b.operationId);
export function readingOperationQueueKey(operation: ServiceOperationState): ReadingQueueKey {
  const work = operation.diagnosticPhaseWork!;
  return { readyAtTick: work.readingUpgradeWork?.readyAtTick ?? operation.createdAtFacilityTick,
    acceptedAtTick: work.readingUpgradeWork?.acceptedAtTick ?? operation.createdAtFacilityTick,
    orderId: work.orderId, phaseId: work.phaseId, operationId: operation.id };
}
export const compareReadingOperations = (a: ServiceOperationState, b: ServiceOperationState): number =>
  compareReadingQueueKeys(readingOperationQueueKey(a), readingOperationQueueKey(b));
export const isReadingWorkMinute = (value: unknown): value is number => typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= Number.MAX_SAFE_INTEGER;
/** Tolerance only for subtraction/addition of absolute work clocks. */
export const readingMinutesEqual = (a: number, b: number, absoluteTick = 0): boolean =>
  Math.abs(a - b) <= Math.max(1e-9, Number.EPSILON * Math.max(Math.abs(a), Math.abs(b), absoluteTick) * 4);

/** Independent raw factors, with a minimum only on new full work. */
export function getReadingUpgradeMinutes(employeeReductionPercent: number, upgradeLevel: number): number {
  return getReadingWorkMinutes(5, employeeReductionPercent, upgradeLevel);
}

/** Outside and center studies use the same independent time factors. */
export function getReadingWorkMinutes(baselineMinutes: number, employeeReductionPercent: number, upgradeLevel: number): number {
  return Math.max(1, baselineMinutes * (1 - employeeReductionPercent / 100) * getRoomUpgradeDurationMultiplier("room.reading", upgradeLevel, "reading_duration_reduction_percent"));
}

export function createReadingUpgradeWork(state: GameState, employeeReductionPercent: number, roomInstanceId: string): RoomUpgradeReadingWork {
  return { version: "room-upgrade-reading.v1", baselineMinutes: 5, employeeReductionPercent,
    acceptedAtTick: state.facilityTick, executionEnabledAtTick: null, readyAtTick: null,
    acceptedRooms: state.rooms.filter((room) => room.roomDefinitionId === "room.reading").sort((a, b) => a.id.localeCompare(b.id))
      .map((room) => ({ roomInstanceId: room.id, upgradeLevel: room.upgradeLevel })),
    quotedRoomInstanceId: roomInstanceId, boundRoomInstanceId: null, boundUpgradeLevel: null, durationMinutes: null };
}

export function getReadingAcceptedLevel(work: RoomUpgradeReadingWork, roomInstanceId: string): RoomUpgradeLevel {
  return work.acceptedRooms.find((room) => room.roomInstanceId === roomInstanceId)?.upgradeLevel ?? 1;
}

export function quoteReadingUpgradeWork(work: RoomUpgradeReadingWork, roomInstanceId: string): number {
  return work.durationMinutes ?? getReadingUpgradeMinutes(work.employeeReductionPercent, getReadingAcceptedLevel(work, roomInstanceId));
}

export function bindReadingUpgradeWork(work: RoomUpgradeReadingWork, roomInstanceId: string): number {
  if (work.durationMinutes === null) {
    work.boundRoomInstanceId = work.quotedRoomInstanceId = roomInstanceId;
    work.boundUpgradeLevel = getReadingAcceptedLevel(work, roomInstanceId);
    work.durationMinutes = getReadingUpgradeMinutes(work.employeeReductionPercent, work.boundUpgradeLevel);
  }
  return work.durationMinutes;
}

export function enableReadingPhase(plan: DiagnosticOrderPlan, phase: DiagnosticOrderPhase, tick: number): void {
  const work = phase.readingUpgradeWork;
  if (!work) return;
  work.executionEnabledAtTick ??= tick;
  if (phase.dependsOn.every((dependency) => plan.phases.some((entry) => entry.id === dependency && entry.status === "completed" && entry.completedAtTick !== null))) {
    work.readyAtTick = Math.max(work.acceptedAtTick, work.executionEnabledAtTick,
      ...phase.dependsOn.map((dependency) => plan.phases.find((entry) => entry.id === dependency)!.completedAtTick!));
  }
}

/** Absence is legacy. Malformed opt-in fields must fail, never disappear. */
export function normalizeReadingUpgradeWork(value: unknown): RoomUpgradeReadingWork | null {
  if (value === undefined) return null;
  const fail = (): never => { throw new Error("The saved Reading upgrade work is invalid."); };
  if (typeof value !== "object" || value === null || Array.isArray(value)) return fail();
  const raw = value as Record<string, unknown>;
  if (Object.keys(raw).some((key) => !["version", "baselineMinutes", "employeeReductionPercent", "acceptedAtTick", "executionEnabledAtTick", "readyAtTick", "acceptedRooms", "quotedRoomInstanceId", "boundRoomInstanceId", "boundUpgradeLevel", "durationMinutes"].includes(key)) ||
    raw.version !== "room-upgrade-reading.v1" || raw.baselineMinutes !== 5 ||
    typeof raw.employeeReductionPercent !== "number" || !Number.isFinite(raw.employeeReductionPercent) || raw.employeeReductionPercent < 0 || raw.employeeReductionPercent > 40 ||
    !integer(raw.acceptedAtTick) || !(raw.executionEnabledAtTick === null || integer(raw.executionEnabledAtTick) && raw.executionEnabledAtTick >= raw.acceptedAtTick) ||
    !(raw.readyAtTick === null || isReadingWorkMinute(raw.readyAtTick) && raw.executionEnabledAtTick !== null && raw.readyAtTick >= (raw.executionEnabledAtTick as number)) ||
    !id(raw.quotedRoomInstanceId) || !Array.isArray(raw.acceptedRooms) || !raw.acceptedRooms.every((room) =>
      typeof room === "object" && room !== null && !Array.isArray(room) && Object.keys(room).every((key) => ["roomInstanceId", "upgradeLevel"].includes(key)) &&
      id(room.roomInstanceId) && Number.isSafeInteger(room.upgradeLevel) && room.upgradeLevel >= 1 && room.upgradeLevel <= 5) ||
    new Set(raw.acceptedRooms.map((room) => room.roomInstanceId)).size !== raw.acceptedRooms.length) return fail();
  const work = raw as unknown as RoomUpgradeReadingWork;
  if (work.boundRoomInstanceId === null) {
    if (work.boundUpgradeLevel !== null || work.durationMinutes !== null) return fail();
  } else if (!id(work.boundRoomInstanceId) || work.quotedRoomInstanceId !== work.boundRoomInstanceId ||
    work.boundUpgradeLevel !== getReadingAcceptedLevel(work, work.boundRoomInstanceId) || work.readyAtTick === null ||
    !isReadingWorkMinute(work.durationMinutes) || work.durationMinutes !== getReadingUpgradeMinutes(work.employeeReductionPercent, work.boundUpgradeLevel)) return fail();
  return copy(work);
}

/** Checks readiness against actual plan witnesses, including pre-enactment absence. */
export function isReadingPlanWorkValid(plan: DiagnosticOrderPlan): boolean {
  return plan.phases.every((phase) => {
    const work = phase.readingUpgradeWork;
    if (!work) return true;
    if (phase.kind !== "interpretation" || phase.mode !== "local" || phase.patientPresent || phase.requirement?.roomDefinitionId !== "room.reading" ||
      work.acceptedAtTick !== plan.createdAtTick) return false;
    const dependencies = phase.dependsOn.map((dependency) => plan.phases.find((entry) => entry.id === dependency)!);
    const ready = work.executionEnabledAtTick !== null && dependencies.every((dependency) => dependency.status === "completed" && dependency.completedAtTick !== null)
      ? Math.max(work.acceptedAtTick, work.executionEnabledAtTick, ...dependencies.map((dependency) => dependency.completedAtTick!)) : null;
    return work.readyAtTick === ready && (phase.startedAtTick === null || ready !== null && phase.startedAtTick >= ready && work.durationMinutes !== null) &&
      phase.durationMinutes === quoteReadingUpgradeWork(work, work.quotedRoomInstanceId) &&
      (work.durationMinutes !== null || phase.remainingMinutes === phase.durationMinutes);
  });
}
