import { getRoomUpgradePoints } from "@gamify-surgery/balance-config";
import { isProtectedCareRoom } from "./care-room-access";
import { getRoomDefinition } from "./selectors";
import { getRotatedFootprint } from "./spatial";
import type {
  DomainContext, EncounterState, GameState, GridPoint, PlacedRoom,
  RoomUpgradeExperience, RoomUpgradeExperienceWitness, RoomUpgradeRecoveryQuote, ServiceOperationState,
} from "./types";

type RecoveryPhase = { id: string; roomDefinitionId: string | null; roomStationId?: string | null };

const recoveryPhase = (phase: RecoveryPhase): boolean => phase.roomDefinitionId === "room.periop_recovery" &&
  (phase.roomStationId === "periop_recovery" || phase.roomStationId == null &&
    phase.id !== "periop_preparation" && phase.id !== "preparation");

function insideRoom(point: GridPoint | null, room: PlacedRoom, context: DomainContext): boolean {
  const definition = getRoomDefinition(room.roomDefinitionId, context);
  if (!point || !definition) return false;
  const footprint = getRotatedFootprint(definition, room.orientation);
  return point.x >= room.x && point.x < room.x + footprint.width &&
    point.y >= room.y && point.y < room.y + footprint.height;
}

function experience(encounter: EncounterState): RoomUpgradeExperience {
  return encounter.roomUpgradeExperience ??= { version: "room-upgrade-experience.v1" };
}

function addPoints(encounter: EncounterState, points: number): void {
  encounter.patientSatisfaction = Math.max(0, Math.min(100, encounter.patientSatisfaction + points));
  // Late actual care changes the score, never the already-applied settlement.
  if (encounter.finalPatientSatisfaction !== null) encounter.finalPatientSatisfaction = encounter.patientSatisfaction;
}

/** Observed idle use, rather than an arrival reservation or a walking pass-through. */
export function observeWaitingRoomExperience(state: GameState, encounter: EncounterState, context: DomainContext): void {
  if (encounter.roomUpgradeExperience?.waiting ||
    !["waiting_unopened", "active_action_required"].includes(encounter.lifecycle) ||
    encounter.idleWaitingSinceTick === null || encounter.idleWaitingSinceTick >= state.facilityTick ||
    state.openChartEncounterId === encounter.id ||
    encounter.patientMovement !== null && encounter.patientMovement.kind !== "idle_within_room") return;
  const room = state.rooms.find((candidate) => (candidate.roomDefinitionId === "room.waiting" ||
    candidate.roomDefinitionId === "room.pediatric_waiting" && encounter.frozenCase.pediatricProfile !== undefined) &&
    insideRoom(encounter.patientLocation, candidate, context));
  if (!room) return;
  experience(encounter).waiting = {
    roomInstanceId: room.id, points: getRoomUpgradePoints(room.roomDefinitionId, room.upgradeLevel, "waiting_satisfaction_points"),
    boundAtFacilityTick: state.facilityTick, appliedAtFacilityTick: null,
  };
}

/** Called after the first physical care action, or immediately before the final score. */
export function completeWaitingRoomExperience(encounter: EncounterState, tick: number): void {
  const witness = encounter.roomUpgradeExperience?.waiting;
  if (!witness || witness.appliedAtFacilityTick !== null) return;
  addPoints(encounter, witness.points);
  witness.appliedAtFacilityTick = tick;
}

/** Chart availability and room reservations do not demonstrate a performed examination. */
export function getPhysicallyAttendedCareRoom(state: GameState, encounter: EncounterState, context: DomainContext): PlacedRoom | null {
  const attendance = state.environment.founderActivity;
  if (attendance?.kind !== "attend_encounter" || attendance.targetId !== encounter.id ||
    attendance.pathIndex < attendance.path.length - 1 ||
    encounter.patientMovement !== null && encounter.patientMovement.kind !== "idle_within_room") return null;
  return state.rooms.find((room) => isProtectedCareRoom(room) &&
    insideRoom(encounter.patientLocation, room, context) && insideRoom(state.environment.founderLocation, room, context)) ?? null;
}

/** Bind and award on the first accepted, physically attended decision, including zero/capped awards. */
export function completeExaminationRoomExperience(encounter: EncounterState, room: PlacedRoom, tick: number): void {
  if ((room.roomDefinitionId !== "room.examination" && room.roomDefinitionId !== "room.pediatric_examination") ||
    room.roomDefinitionId === "room.pediatric_examination" && encounter.frozenCase.pediatricProfile === undefined ||
    encounter.roomUpgradeExperience?.examination) return;
  const points = getRoomUpgradePoints(room.roomDefinitionId, room.upgradeLevel, "examination_satisfaction_points");
  experience(encounter).examination = { roomInstanceId: room.id, points, boundAtFacilityTick: tick, appliedAtFacilityTick: tick };
  addPoints(encounter, points);
}

/** Frozen at original acceptance; later copies and purchases cannot backdate comfort. */
export function createRoomUpgradeRecoveryQuote(state: Pick<GameState, "rooms">, phases: readonly RecoveryPhase[]): RoomUpgradeRecoveryQuote | undefined {
  const phase = phases.find(recoveryPhase);
  if (!phase) return undefined;
  return {
    version: "room-upgrade-recovery.v1", phaseId: phase.id,
    candidates: state.rooms.filter((room) => room.roomDefinitionId === "room.periop_recovery")
      .sort((left, right) => left.id.localeCompare(right.id))
      .map((room) => ({ roomInstanceId: room.id,
        points: getRoomUpgradePoints(room.roomDefinitionId, room.upgradeLevel, "recovery_satisfaction_points") })),
    boundRoom: null,
  };
}

/** Diagnostic factories transform phase IDs; remap the already-frozen quote by Recovery semantics. */
export function cloneRoomUpgradeRecoveryQuote(quote: RoomUpgradeRecoveryQuote | undefined, phases?: readonly RecoveryPhase[]): RoomUpgradeRecoveryQuote | undefined {
  if (!quote) return undefined;
  const phase = phases?.find(recoveryPhase);
  if (phases && !phase) throw new Error("The accepted recovery quote has no physical Recovery phase.");
  return { ...quote, phaseId: phase?.id ?? quote.phaseId,
    candidates: quote.candidates.map((room) => ({ ...room })), boundRoom: quote.boundRoom ? { ...quote.boundRoom } : null };
}

/** Only actual Recovery start binds; a prep bed or future reservation cannot do so. */
export function bindServiceOperationRecoveryExperience(state: GameState, operation: ServiceOperationState): void {
  const quote = operation.roomUpgradeRecovery;
  const phase = operation.frozenOperationPhases?.[operation.phaseIndex];
  if (!quote || quote.boundRoom || !phase || phase.id !== quote.phaseId || !recoveryPhase(phase) ||
    operation.actorKind !== "encounter" || operation.diagnosticPhaseWork) return;
  const roomId = operation.diagnosticPhysicalWork?.phaseBindings[operation.phaseIndex]?.resource?.roomInstanceId ??
    operation.reservedRoomInstanceIds.find((id) => state.rooms.some((room) => room.id === id && room.roomDefinitionId === "room.periop_recovery"));
  if (!roomId) return;
  quote.boundRoom = { roomInstanceId: roomId, points: quote.candidates.find((room) => room.roomInstanceId === roomId)?.points ?? 0 };
}

/** Recovery completion can follow terminal settlement; money, XP and reviews remain untouched. */
export function completeServiceOperationRecoveryExperience(state: GameState, operation: ServiceOperationState): void {
  const quote = operation.roomUpgradeRecovery;
  if (!quote?.boundRoom || operation.frozenOperationPhases?.[operation.phaseIndex]?.id !== quote.phaseId ||
    operation.actorKind !== "encounter" || operation.diagnosticPhaseWork) return;
  const encounter = state.encounters[operation.actorId];
  if (!encounter || encounter.roomUpgradeExperience?.recovery) return;
  experience(encounter).recovery = { operationId: operation.id, roomInstanceId: quote.boundRoom.roomInstanceId,
    points: quote.boundRoom.points, boundAtFacilityTick: operation.phaseStartedAtFacilityTick ?? state.facilityTick,
    appliedAtFacilityTick: state.facilityTick };
  addPoints(encounter, quote.boundRoom.points);
}

const record = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null && !Array.isArray(value);
const id = (value: unknown): value is string => typeof value === "string" && value.length > 0;
const keys = (value: Record<string, unknown>, allowed: readonly string[]): boolean => Object.keys(value).every((key) => allowed.includes(key));
const points = (value: unknown): value is number => typeof value === "number" && Number.isInteger(value) && value >= 0 && value <= 8 && value % 2 === 0;
const tick = (value: unknown): value is number => typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
const invalid = (): never => { throw new Error("The saved room upgrade experience contract is invalid."); };

/** Strict opt-in parsing. Absence never creates a quote for legacy queued or active work. */
export function normalizeRoomUpgradeRecoveryQuote(value: unknown, phases?: readonly RecoveryPhase[]): RoomUpgradeRecoveryQuote | undefined {
  if (value === undefined) return undefined;
  if (!record(value) || !keys(value, ["version", "phaseId", "candidates", "boundRoom"]) ||
    value.version !== "room-upgrade-recovery.v1" || !id(value.phaseId) || !Array.isArray(value.candidates) ||
    phases !== undefined && !phases.some((phase) => phase.id === value.phaseId && recoveryPhase(phase))) return invalid();
  const seen = new Set<string>();
  const candidates = value.candidates.map((room: unknown) => {
    if (!record(room) || !keys(room, ["roomInstanceId", "points"]) || !id(room.roomInstanceId) || !points(room.points) || seen.has(room.roomInstanceId)) return invalid();
    seen.add(room.roomInstanceId);
    return { roomInstanceId: room.roomInstanceId, points: room.points };
  });
  const bound = value.boundRoom;
  if (bound !== null && (!record(bound) || !keys(bound, ["roomInstanceId", "points"]) || !id(bound.roomInstanceId) ||
    bound.points !== (candidates.find((room) => room.roomInstanceId === bound.roomInstanceId)?.points ?? 0))) return invalid();
  return { version: "room-upgrade-recovery.v1", phaseId: value.phaseId, candidates,
    boundRoom: bound === null ? null : { roomInstanceId: (bound as Record<string, unknown>).roomInstanceId as string, points: (bound as Record<string, unknown>).points as number } };
}

export function isRoomUpgradeRecoveryQuoteValid(value: unknown, phases?: readonly RecoveryPhase[]): boolean {
  try { normalizeRoomUpgradeRecoveryQuote(value, phases); return true; } catch { return false; }
}

export function normalizeRoomUpgradeExperience(value: unknown, facilityTick: number): RoomUpgradeExperience | undefined {
  if (value === undefined) return undefined;
  if (!record(value) || !keys(value, ["version", "waiting", "examination", "recovery"]) || value.version !== "room-upgrade-experience.v1") return invalid();
  const witness = (raw: unknown, recovery = false): RoomUpgradeExperienceWitness | undefined => {
    if (raw === undefined) return undefined;
    if (!record(raw) || !keys(raw, ["roomInstanceId", "points", "boundAtFacilityTick", "appliedAtFacilityTick", ...(recovery ? ["operationId"] : [])]) ||
      !id(raw.roomInstanceId) || !points(raw.points) || !tick(raw.boundAtFacilityTick) || raw.boundAtFacilityTick > facilityTick ||
      raw.appliedAtFacilityTick !== null && (!tick(raw.appliedAtFacilityTick) || raw.appliedAtFacilityTick < raw.boundAtFacilityTick || raw.appliedAtFacilityTick > facilityTick) ||
      recovery && (!id(raw.operationId) || raw.appliedAtFacilityTick === null)) return invalid();
    return { roomInstanceId: raw.roomInstanceId, points: raw.points, boundAtFacilityTick: raw.boundAtFacilityTick,
      appliedAtFacilityTick: raw.appliedAtFacilityTick as number | null, ...(recovery ? { operationId: raw.operationId as string } : {}) };
  };
  const waiting = witness(value.waiting);
  const examination = witness(value.examination);
  if (examination?.appliedAtFacilityTick === null) return invalid();
  const recovery = witness(value.recovery, true) as RoomUpgradeExperience["recovery"];
  return { version: "room-upgrade-experience.v1", ...(waiting ? { waiting } : {}),
    ...(examination ? { examination } : {}), ...(recovery ? { recovery } : {}) };
}
