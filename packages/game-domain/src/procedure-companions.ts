import { getServiceIncomeLine } from "@gamify-surgery/balance-config";
import { getDoorCells } from "./doors";
import { deterministicInteger, RANDOM_STREAMS } from "./randomness";
import { getRoomDefinition, isRoomOperationalForFacilityWork } from "./selectors";
import { getOccupiedTiles, getRoomCareStations, getRoomCompanionSeats, getRoomNavigableTiles, getRoomNavigationAnchor, getRoomSharedStaffAnchor } from "./spatial";
import type { DomainContext, GameState, GridPoint, ProcedureCompanionState, RetailExternalActorState, ServiceOperationState } from "./types";

type CompanionRoute = (start: GridPoint, target: GridPoint, periopRoomId: string | null) => GridPoint[];
type WaitingReservation = NonNullable<ProcedureCompanionState["waitingReservation"]>;
const pointKey = (point: GridPoint) => `${point.x},${point.y}`;
const samePoint = (left: GridPoint, right: GridPoint) => left.x === right.x && left.y === right.y;
const distance = (left: GridPoint, right: GridPoint) => Math.abs(left.x - right.x) + Math.abs(left.y - right.y);

// These are amenity identities, not invented rooms. Only installed,
// operational, reachable instances participate. Future garden/shop rooms can
// use this seam once their room definitions and approved layouts exist.
const PROCEDURE_COMPANION_AMENITY_ROOM_IDS = new Set([
  "room.bathroom", "room.coffee_kiosk", "room.vending", "room.garden", "room.healing_garden", "room.gift_shop",
]);

export function createProcedureCompanionState(): ProcedureCompanionState {
  return {
    version: "procedure-companion.v1", phase: "waiting_in_periop", periopRoomInstanceId: null,
    waitingReservation: null, amenityDecisionPhaseIndex: null,
    amenityRoomInstanceId: null, amenityDwellEndsAtFacilityTick: null,
  };
}

/** Optional save field. Linked legacy procedure companions are adopted after
 * all operations/actors have been restored, without moving them on load. */
export function normalizeProcedureCompanionState(value: unknown): ProcedureCompanionState | undefined {
  if (!value || typeof value !== "object") return undefined;
  const raw = value as Record<string, unknown>;
  const phases: ReadonlyArray<ProcedureCompanionState["phase"]> = ["waiting_in_periop", "walking_to_amenity", "using_amenity", "returning_to_periop", "leaving_with_patient"];
  if (raw.version !== "procedure-companion.v1" || !phases.includes(raw.phase as ProcedureCompanionState["phase"])) return undefined;
  const reservation = raw.waitingReservation && typeof raw.waitingReservation === "object" ? raw.waitingReservation as Record<string, unknown> : null;
  const point = reservation?.location && typeof reservation.location === "object" ? reservation.location as Record<string, unknown> : null;
  return {
    version: "procedure-companion.v1", phase: raw.phase as ProcedureCompanionState["phase"],
    periopRoomInstanceId: typeof raw.periopRoomInstanceId === "string" ? raw.periopRoomInstanceId : null,
    waitingReservation: reservation && typeof reservation.roomInstanceId === "string" &&
      (reservation.kind === "chair" || reservation.kind === "standing") && point &&
      typeof point.x === "number" && Number.isSafeInteger(point.x) && typeof point.y === "number" && Number.isSafeInteger(point.y)
      ? { roomInstanceId: reservation.roomInstanceId, location: { x: point.x, y: point.y }, kind: reservation.kind, seatId: typeof reservation.seatId === "string" ? reservation.seatId : null }
      : null,
    amenityDecisionPhaseIndex: typeof raw.amenityDecisionPhaseIndex === "number" && Number.isSafeInteger(raw.amenityDecisionPhaseIndex) && raw.amenityDecisionPhaseIndex >= 0 ? raw.amenityDecisionPhaseIndex : null,
    amenityRoomInstanceId: typeof raw.amenityRoomInstanceId === "string" ? raw.amenityRoomInstanceId : null,
    amenityDwellEndsAtFacilityTick: typeof raw.amenityDwellEndsAtFacilityTick === "number" && Number.isSafeInteger(raw.amenityDwellEndsAtFacilityTick) && raw.amenityDwellEndsAtFacilityTick >= 0 ? raw.amenityDwellEndsAtFacilityTick : null,
  };
}

/** Repair dangling optional-trip locks and adopt old procedure companions.
 * Other visit kinds retain their own companion policies. */
export function reconcileProcedureCompanions(state: GameState): void {
  for (const actor of state.retailExternalActors) {
    if (actor.lifecycle === "departed") continue;
    if (actor.activeRetailOperationId && !state.retailOperations.some((trip) => trip.id === actor.activeRetailOperationId &&
        trip.actorId === actor.id && trip.actorKind === actor.kind && !["completed", "cancelled", "abandoned"].includes(trip.status))) {
      actor.activeRetailOperationId = null;
    }
    actor.activeRetailOperationId ??= state.retailOperations.find((trip) => trip.actorId === actor.id && trip.actorKind === actor.kind &&
      !["completed", "cancelled", "abandoned"].includes(trip.status))?.id ?? null;
    if (actor.kind !== "companion") continue;
    const operation = state.serviceOperations.find((op) => op.id === actor.linkedServiceOperationId) ??
      state.serviceOperations.find((op) => op.actorKind === "encounter" && op.actorId === actor.linkedEncounterId &&
        op.periopBedFlowVersion === 1 && !["completed", "cancelled"].includes(op.status));
    if (operation?.periopBedFlowVersion !== 1 || actor.procedureCompanion) continue;
    actor.linkedServiceOperationId = operation.id;
    actor.procedureCompanion = createProcedureCompanionState();
    actor.procedureCompanion.periopRoomInstanceId = operation.periopBedReservation?.roomInstanceId ??
      operation.reservedRoomInstanceIds.find((id) => state.rooms.some((room) => room.id === id && room.roomDefinitionId === "room.periop_recovery")) ?? null;
  }
}

function occupiedPoints(state: GameState, actorId: string): Set<string> {
  const points: Array<GridPoint | null | undefined> = [state.environment.founderLocation, state.environment.founderActivity?.path.at(-1)];
  for (const encounter of Object.values(state.encounters)) points.push(encounter.patientLocation, encounter.patientMovement?.path.at(-1), encounter.waitingDestination?.location);
  for (const employee of state.employees) points.push(employee.location, employee.path.at(-1));
  for (const operation of state.serviceOperations) if (operation.status !== "completed" && operation.status !== "cancelled") points.push(operation.location, operation.path.at(-1));
  for (const actor of state.retailExternalActors) if (actor.id !== actorId && actor.lifecycle !== "departed") {
    points.push(actor.location, actor.path.at(-1), actor.procedureCompanion?.waitingReservation?.location);
  }
  for (const trip of state.retailOperations) if (!["completed", "cancelled", "abandoned"].includes(trip.status)) points.push(trip.location, trip.path.at(-1));
  return new Set(points.filter((point): point is GridPoint => Boolean(point)).map(pointKey));
}

export function planProcedureCompanionWait(
  state: GameState,
  context: DomainContext,
  actor: RetailExternalActorState,
  operation: ServiceOperationState,
  route: CompanionRoute,
): { reservation: WaitingReservation; path: GridPoint[] } | null {
  if (!actor.location || !actor.procedureCompanion) return null;
  const flow = actor.procedureCompanion;
  const roomId = operation.periopBedReservation?.roomInstanceId ??
    operation.reservedRoomInstanceIds.find((id) => state.rooms.some((room) => room.id === id && room.roomDefinitionId === "room.periop_recovery")) ??
    flow.periopRoomInstanceId;
  const room = state.rooms.find((candidate) => candidate.id === roomId && candidate.roomDefinitionId === "room.periop_recovery");
  const definition = room ? getRoomDefinition(room.roomDefinitionId, context) : null;
  if (!room || !definition || !isRoomOperationalForFacilityWork(state, room.id, context)) return null;
  flow.periopRoomInstanceId = room.id;
  const occupied = occupiedPoints(state, actor.id);
  const excluded = new Set([
    ...getRoomCareStations(room, definition, state.doors, state.rooms, (id) => getRoomDefinition(id, context)).map((station) => pointKey(station.patientAnchor)),
    pointKey(getRoomNavigationAnchor(room, definition, "staff")),
    pointKey(getRoomSharedStaffAnchor(room, definition)),
    ...state.doors.filter((door) => door.roomId === room.id).flatMap((door) => {
      const cells = getDoorCells(door, room, definition);
      return cells ? [pointKey(cells.inside)] : [];
    }),
  ]);
  const patient = operation.periopBedReservation?.endpoint ?? operation.location ?? getRoomNavigationAnchor(room, definition);
  const seats = getRoomCompanionSeats(room, definition, state.doors, state.rooms, (id) => getRoomDefinition(id, context));
  const retained = flow.waitingReservation;
  const availableSeats = seats.filter((seat) => !occupied.has(pointKey(seat.anchor)))
    .sort((left, right) => Number(right.id === retained?.seatId) - Number(left.id === retained?.seatId) ||
      distance(left.anchor, patient) - distance(right.anchor, patient) || left.id.localeCompare(right.id));
  // A seated companion keeps its claim; a standing companion retries every
  // tick and claims the closest reachable free chair as soon as one opens.
  for (const seat of availableSeats) {
    const path = route(actor.location, seat.anchor, room.id);
    if (path.length) return { reservation: { roomInstanceId: room.id, location: { ...seat.anchor }, kind: "chair", seatId: seat.id }, path };
  }
  const seatKeys = new Set(seats.map((seat) => pointKey(seat.anchor)));
  const candidates = getRoomNavigableTiles(room, definition, state.doors, state.rooms, (id) => getRoomDefinition(id, context))
    .filter((point) => !occupied.has(pointKey(point)) && !excluded.has(pointKey(point)) && !seatKeys.has(pointKey(point)))
    .sort((left, right) => distance(left, patient) - distance(right, patient) || left.y - right.y || left.x - right.x);
  if (retained?.roomInstanceId === room.id && candidates.some((point) => samePoint(point, retained.location))) {
    const path = route(actor.location, retained.location, room.id);
    if (path.length) return { reservation: retained, path };
  }
  for (const location of candidates) {
    const path = route(actor.location, location, room.id);
    if (path.length) return { reservation: { roomInstanceId: room.id, location: { ...location }, kind: "standing", seatId: null }, path };
  }
  return null;
}

function walk(state: GameState, context: DomainContext, actor: RetailExternalActorState, path: GridPoint[], createdThisTick: boolean): boolean {
  if (!path.length) return false;
  const elapsed = Math.max(1, state.facilityTick - actor.lastMovedAtFacilityTick);
  actor.path = path.map((point) => ({ ...point }));
  actor.pathIndex = Math.min(path.length - 1, createdThisTick ? 0 : elapsed * context.balanceRelease.facility.characterTravelTilesPerTick);
  actor.location = { ...path[actor.pathIndex]! };
  actor.lastMovedAtFacilityTick = state.facilityTick;
  if (actor.pathIndex === actor.path.length - 1) actor.lifecycle = "onsite";
  return actor.pathIndex === actor.path.length - 1;
}

function duringProcedure(operation: ServiceOperationState): boolean {
  const phase = (operation.frozenOperationPhases ?? getServiceIncomeLine(operation.incomeLineId)?.operation?.phases)?.[operation.phaseIndex];
  return operation.status === "in_service" && (phase?.roomDefinitionId === "room.endoscopy" || phase?.roomDefinitionId === "room.ambulatory_or");
}

function chooseAmenity(state: GameState, context: DomainContext, actor: RetailExternalActorState, route: CompanionRoute): { roomId: string; path: GridPoint[] } | null {
  if (!actor.location || !actor.procedureCompanion) return null;
  const occupied = occupiedPoints(state, actor.id);
  const rooms = state.rooms.filter((room) => PROCEDURE_COMPANION_AMENITY_ROOM_IDS.has(room.roomDefinitionId) &&
    isRoomOperationalForFacilityWork(state, room.id, context)).sort((left, right) => left.id.localeCompare(right.id));
  const offset = rooms.length ? deterministicInteger(state.campaignSeed, RANDOM_STREAMS.environment, `companion:${actor.id}:amenity-choice:${actor.procedureCompanion.amenityDecisionPhaseIndex}`, rooms.length) : 0;
  for (let index = 0; index < rooms.length; index += 1) {
    const room = rooms[(offset + index) % rooms.length]!;
    const definition = getRoomDefinition(room.roomDefinitionId, context);
    if (!definition) continue;
    if (room.roomDefinitionId === "room.bathroom" && (state.patientAmenityTrips?.some((trip) => trip.bathroomRoomInstanceId === room.id) ||
      state.retailExternalActors.some((candidate) => candidate.id !== actor.id && candidate.procedureCompanion?.amenityRoomInstanceId === room.id) ||
      state.environment.founderActivity?.kind === "visit_bathroom" && state.environment.founderActivity.targetId?.startsWith(`${room.id}.`))) continue;
    const target = getRoomNavigationAnchor(room, definition);
    if (occupied.has(pointKey(target))) continue;
    const path = route(actor.location, target, actor.procedureCompanion.periopRoomInstanceId);
    // An excursion must have a legal way back as well as a way out.
    const home = actor.procedureCompanion.waitingReservation?.location;
    if (path.length && home && route(target, home, actor.procedureCompanion.periopRoomInstanceId).length) return { roomId: room.id, path };
  }
  return null;
}

/** Owns movement for new and adopted procedure companions. */
export function advanceProcedureCompanion(
  state: GameState,
  context: DomainContext,
  actor: RetailExternalActorState,
  operation: ServiceOperationState,
  createdThisTick: boolean,
  route: CompanionRoute,
  exitRoute: (start: GridPoint) => GridPoint[],
): boolean {
  const flow = actor.procedureCompanion;
  if (!flow || !actor.location) return false;
  const patient = operation.actorKind === "encounter" ? state.encounters[operation.actorId]?.patientLocation ?? null : operation.location;
  const home = state.rooms.find((room) => room.id === flow.periopRoomInstanceId);
  const homeDefinition = home ? getRoomDefinition(home.roomDefinitionId, context) : null;
  const patientInPeriop = Boolean(patient && home && homeDefinition && getOccupiedTiles(home, homeDefinition).some((point) => samePoint(point, patient)));
  const discharge = ["discharging", "leaving", "completed", "cancelled"].includes(operation.status);
  const terminalVisit = operation.status === "completed" || operation.status === "cancelled";
  if (flow.phase === "leaving_with_patient" || discharge && (!patientInPeriop || terminalVisit)) {
    flow.phase = "leaving_with_patient";
    flow.waitingReservation = null;
    flow.amenityRoomInstanceId = null;
    flow.amenityDwellEndsAtFacilityTick = null;
    // A finished/cancelled visit can retain a filed chart's stationary location.
    // Follow a genuinely departing patient; otherwise finish our own exit walk.
    const departingPatient = operation.actorKind === "encounter"
      ? Boolean(state.encounters[operation.actorId]?.patientMovement?.kind === "leaving_after_resolution") : operation.status === "leaving";
    const followPatient = patient && (!terminalVisit || departingPatient);
    const path = followPatient ? route(actor.location, patient, flow.periopRoomInstanceId) : exitRoute(actor.location);
    actor.movementWaitReason = path.length ? null : "Waiting for a connected exit route";
    if (path.length) walk(state, context, actor, path, createdThisTick);
    else actor.lastMovedAtFacilityTick = state.facilityTick;
    actor.lifecycle = "departing";
    const { gridWidth, gridHeight } = context.balanceRelease.facility;
    // A walking companion disappears only at its off-map endpoint. A patient
    // can finish first without deleting or teleporting the trailing companion.
    if ((!followPatient && path.length > 0 && actor.pathIndex === actor.path.length - 1) ||
      (actor.location && (actor.location.x < 0 || actor.location.x >= gridWidth) && actor.location.y >= gridHeight)) {
      actor.lifecycle = "departed";
      actor.location = null;
      actor.path = [];
      actor.pathIndex = 0;
    }
    return true;
  }

  const procedure = duringProcedure(operation);
  const onExcursion = flow.phase === "walking_to_amenity" || flow.phase === "using_amenity";
  if (onExcursion) {
    const amenity = state.rooms.find((room) => room.id === flow.amenityRoomInstanceId);
    const definition = amenity ? getRoomDefinition(amenity.roomDefinitionId, context) : null;
    if (!procedure || !amenity || !definition || !isRoomOperationalForFacilityWork(state, amenity.id, context) ||
      flow.phase === "using_amenity" && state.facilityTick >= (flow.amenityDwellEndsAtFacilityTick ?? state.facilityTick)) {
      flow.phase = "returning_to_periop";
      flow.amenityRoomInstanceId = null;
      flow.amenityDwellEndsAtFacilityTick = null;
      actor.lastMovedAtFacilityTick = state.facilityTick;
    } else if (flow.phase === "walking_to_amenity") {
      const path = route(actor.location, getRoomNavigationAnchor(amenity, definition), flow.periopRoomInstanceId);
      if (!path.length) { flow.phase = "returning_to_periop"; flow.amenityRoomInstanceId = null; }
      else if (walk(state, context, actor, path, createdThisTick)) {
        flow.phase = "using_amenity";
        const config = context.balanceRelease.environment;
        // Reuse the existing editorial idle cadence, not a clinical duration.
        flow.amenityDwellEndsAtFacilityTick = state.facilityTick + config.idleActionMinimumMinutes + deterministicInteger(
          state.campaignSeed, RANDOM_STREAMS.environment, `companion:${actor.id}:amenity-dwell:${operation.phaseIndex}`,
          config.idleActionMaximumMinutes - config.idleActionMinimumMinutes + 1,
        );
      }
      return true;
    } else {
      // Idle dwell does not bank travel time for an instant return walk.
      actor.lastMovedAtFacilityTick = state.facilityTick;
      return true;
    }
  }

  const plan = planProcedureCompanionWait(state, context, actor, operation, route);
  if (!plan) {
    actor.movementWaitReason = flow.periopRoomInstanceId ? "Waiting for a free, reachable companion seat" : null;
    actor.lastMovedAtFacilityTick = state.facilityTick;
    return flow.periopRoomInstanceId !== null;
  }
  actor.movementWaitReason = null;
  flow.waitingReservation = plan.reservation;
  const arrived = walk(state, context, actor, plan.path, createdThisTick);
  if (!arrived) return true;
  flow.phase = "waiting_in_periop";
  if (procedure && flow.amenityDecisionPhaseIndex !== operation.phaseIndex && !createdThisTick) {
    flow.amenityDecisionPhaseIndex = operation.phaseIndex;
    const roll = deterministicInteger(state.campaignSeed, RANDOM_STREAMS.environment, `companion:${actor.id}:${operation.id}:procedure:${operation.phaseIndex}:amenity-roll`, 100);
    if (roll < context.balanceRelease.environment.idleActionChancePercent) {
      const excursion = chooseAmenity(state, context, actor, route);
      if (excursion) {
        flow.phase = "walking_to_amenity";
        flow.amenityRoomInstanceId = excursion.roomId;
        flow.waitingReservation = null;
        actor.path = excursion.path;
        actor.pathIndex = 0;
        actor.lastMovedAtFacilityTick = state.facilityTick;
      }
    }
  }
  return true;
}
