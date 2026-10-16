import { deterministicInteger, RANDOM_STREAMS } from "./randomness";
import { getRoomDefinition, isRoomOperationalForFacilityWork } from "./selectors";
import { findDeterministicFacilityPath, getRoomNavigationAnchor, getRotatedFootprint } from "./spatial";
import { findCareAwareFacilityPath, protectedCareRoomAtPoint } from "./care-room-access";
import type {
  DomainContext,
  GameState,
  GridPoint,
  PatientAmenityTripState,
  ServiceOperationState,
} from "./types";
import { findRouteFromDisplacedLocationToPoint } from "./displaced-routing";
import { LEVEL_FIVE_SUPPORT_TUNING } from "@gamify-surgery/balance-config";
import { findLevelFiveSupportExitPath, findLevelFiveSupportPath, getGardenSatisfactionPoints, getLevelFiveSupportExitDoorId, getLevelFiveSupportRoomAt } from "./level-five-support";

type AmenityActorKind = PatientAmenityTripState["actorKind"];

function samePoint(left: GridPoint | null | undefined, right: GridPoint | null | undefined): boolean {
  return Boolean(left && right && left.x === right.x && left.y === right.y);
}

function samePath(left: readonly GridPoint[], right: readonly GridPoint[]): boolean {
  return left.length === right.length && left.every((point, index) => samePoint(point, right[index]));
}

function actorKey(kind: AmenityActorKind, id: string): string {
  return `${kind}:${id}`;
}

function actorLocation(state: GameState, kind: AmenityActorKind, id: string): GridPoint | null {
  if (kind === "encounter") return state.encounters[id]?.patientLocation ?? null;
  return state.serviceOperations.find((operation) => operation.id === id && operation.actorKind === "visitor")?.location ?? null;
}

function setActorLocation(state: GameState, trip: PatientAmenityTripState, location: GridPoint): void {
  if (trip.actorKind === "encounter") {
    const encounter = state.encounters[trip.actorId];
    if (!encounter) return;
    encounter.patientLocation = { ...location };
    for (const operation of state.serviceOperations) {
      if (operation.actorKind === "encounter" && operation.actorId === trip.actorId &&
        operation.status !== "completed" && operation.status !== "cancelled") {
        operation.location = { ...location };
      }
    }
    return;
  }
  const operation = state.serviceOperations.find((candidate) =>
    candidate.id === trip.actorId && candidate.actorKind === "visitor",
  );
  if (operation) operation.location = { ...location };
}

function operationPhase(operation: ServiceOperationState) {
  return operation.frozenOperationPhases?.[operation.phaseIndex];
}

function operationAllowsBathroom(operation: ServiceOperationState): boolean {
  if (operation.status === "waiting_for_resources") return true;
  if (operation.periopBedFlowVersion !== 1) return false;
  const phase = operationPhase(operation);
  if (operation.status === "in_service") {
    return operation.phaseIndex === 0 && phase?.roomStationId === "periop_preparation";
  }
  return operation.status === "waiting_for_next_phase" && operation.phaseIndex === 0;
}

function activeOperationForActor(
  state: GameState,
  kind: AmenityActorKind,
  id: string,
): ServiceOperationState | null {
  return state.serviceOperations.find((operation) =>
    operation.status !== "completed" && operation.status !== "cancelled" &&
    (kind === "encounter"
      ? operation.actorKind === "encounter" && operation.actorId === id
      : operation.actorKind === "visitor" && operation.id === id),
  ) ?? null;
}

function hasActiveRetailMovement(state: GameState, kind: AmenityActorKind, id: string): boolean {
  const retailKind = kind === "encounter" ? "encounter" : "service_visitor";
  return state.retailOperations.some((operation) =>
    operation.actorKind === retailKind && operation.actorId === id &&
    operation.status !== "completed" && operation.status !== "cancelled" && operation.status !== "abandoned",
  );
}

function actorEligible(state: GameState, kind: AmenityActorKind, id: string): boolean {
  if (Object.values(state.pediatricFamilies ?? {}).some(family => family.child.kind === kind && family.child.id === id)) return false;
  if (hasActiveRetailMovement(state, kind, id)) return false;
  const location = actorLocation(state, kind, id);
  if (!location) return false;
  if (kind === "encounter") {
    const encounter = state.encounters[id];
    if (!encounter || encounter.checkInStatus !== "checked_in" || encounter.patientMovement !== null ||
      state.openChartEncounterId === id) return false;
  } else {
    const visitor = state.serviceOperations.find((candidate) => candidate.id === id && candidate.actorKind === "visitor");
    if (!visitor || visitor.pathIndex < visitor.path.length - 1) return false;
  }
  const operation = activeOperationForActor(state, kind, id);
  if (operation) return operationAllowsBathroom(operation);
  if (kind === "service_visitor") return false;
  const encounter = state.encounters[id];
  if (!encounter) return false;
  if (encounter.lifecycle === "waiting_unopened" || encounter.lifecycle === "active_action_required") return true;
  if (encounter.lifecycle !== "active_pending_result" || !encounter.pendingResult) return false;
  const pending = encounter.pendingResult;
  if (pending.resourceQueue?.status === "waiting_for_resources") return true;
  if (pending.localServiceOperation) return pending.localServiceOperation.status === "external_processing";
  return pending.externalProcessingOnly === true && pending.patientTravel === null && pending.offsiteTravel === null;
}

export function getReachablePatientBathroomRoomIds(
  state: GameState,
  kind: AmenityActorKind,
  id: string,
  context: DomainContext,
  departureServiceOperationId?: string,
): string[] {
  const start = actorLocation(state, kind, id);
  const departure = departureServiceOperationId ? activeOperationForActor(state, kind, id) : null;
  const validDeparture = Boolean(departure && departure.id === departureServiceOperationId && departure.periopBedFlowVersion === 1 &&
    departure.status === "discharging" && !departure.periopBedReservation && departure.departureItinerary?.status === "pending" &&
    (departure.actorKind === "visitor" || state.encounters[id]?.lifecycle === "resolved"));
  if (!start || (departureServiceOperationId ? !validDeparture : !actorEligible(state, kind, id))) return [];
  return [...state.rooms]
    .filter((room) => room.roomDefinitionId === "room.bathroom" && isRoomOperationalForFacilityWork(state, room.id, context))
    .sort((left, right) => left.id.localeCompare(right.id))
    .flatMap((room) => {
      if (founderOccupiesBathroom(state, room.id) || state.patientAmenityTrips?.some((trip) => trip.bathroomRoomInstanceId === room.id)) return [];
      const definition = getRoomDefinition(room.roomDefinitionId, context);
      if (!definition) return [];
      return route(state, context, start, getRoomNavigationAnchor(room, definition)).length > 0 ? [room.id] : [];
    });
}

function founderOccupiesBathroom(state: GameState, roomId: string): boolean {
  const activity = state.environment.founderActivity;
  if (activity?.kind !== "visit_bathroom") return false;
  const room = state.rooms.find((candidate) => candidate.id === roomId);
  const endpoint = activity.path.at(-1);
  if (!room || !endpoint) return false;
  const definition = getRoomDefinition(room.roomDefinitionId);
  if (!definition) return false;
  const footprint = getRotatedFootprint(definition, room.orientation);
  return endpoint.x >= room.x && endpoint.x < room.x + footprint.width &&
    endpoint.y >= room.y && endpoint.y < room.y + footprint.height;
}

function route(
  state: GameState,
  context: DomainContext,
  start: GridPoint,
  end: GridPoint,
  allowedProtectedRoomInstanceIds: ReadonlySet<string> = new Set(),
): GridPoint[] {
  const ordinary = findCareAwareFacilityPath(state, context, start, end, allowedProtectedRoomInstanceIds);
  return ordinary.length > 0
    ? ordinary
    : findRouteFromDisplacedLocationToPoint(state, context, start, end, allowedProtectedRoomInstanceIds);
}

function nextOpportunityTick(state: GameState, context: DomainContext, key: string): number {
  const config = context.balanceRelease.environment;
  return state.facilityTick + config.idleActionMinimumMinutes + deterministicInteger(
    state.campaignSeed,
    RANDOM_STREAMS.environment,
    `patient-amenity:${key}:next:${state.facilityTick}`,
    config.idleActionMaximumMinutes - config.idleActionMinimumMinutes + 1,
  );
}

function dwellMinutes(state: GameState, context: DomainContext, key: string): number {
  const config = context.balanceRelease.environment;
  return config.idleActionMinimumMinutes + deterministicInteger(
    state.campaignSeed,
    RANDOM_STREAMS.environment,
    `patient-amenity:${key}:dwell:${state.facilityTick}`,
    config.idleActionMaximumMinutes - config.idleActionMinimumMinutes + 1,
  );
}

export function getPatientAmenityTrip(
  state: GameState,
  kind: AmenityActorKind,
  id: string,
): PatientAmenityTripState | null {
  return state.patientAmenityTrips?.find((trip) => trip.actorKind === kind && trip.actorId === id) ?? null;
}

export function hasActivePatientAmenityTrip(
  state: GameState,
  kind: AmenityActorKind,
  id: string,
): boolean {
  return getPatientAmenityTrip(state, kind, id) !== null;
}

export function tryStartPatientBathroomTrip(
  state: GameState,
  kind: AmenityActorKind,
  id: string,
  context: DomainContext,
  options?: { purpose: "departure"; linkedServiceOperationId: string; returnTarget: GridPoint },
): boolean {
  state.patientAmenityTrips ??= [];
  state.patientAmenityNextOpportunityTicks ??= {};
  state.patientAmenityTripSequence ??= 0;
  if (getPatientAmenityTrip(state, kind, id) || (!options && !actorEligible(state, kind, id))) return false;
  const start = actorLocation(state, kind, id);
  if (!start) return false;
  for (const roomId of getReachablePatientBathroomRoomIds(state, kind, id, context, options?.linkedServiceOperationId)) {
    const room = state.rooms.find((candidate) => candidate.id === roomId)!;
    const definition = getRoomDefinition(room.roomDefinitionId, context);
    if (!definition) continue;
    const target = getRoomNavigationAnchor(room, definition);
    const outbound = route(state, context, start, target);
    if (outbound.length === 0) continue;
    const key = actorKey(kind, id);
    state.patientAmenityTrips.push({
      version: "patient-amenity-trip.v1",
      id: `patient-amenity-trip.${state.patientAmenityTripSequence++}`,
      actorKind: kind,
      actorId: id,
      amenityKind: "bathroom",
      bathroomRoomInstanceId: room.id,
      status: "walking_to_amenity",
      startedAtFacilityTick: state.facilityTick,
      dwellEndsAtFacilityTick: null,
      returnRequested: false,
      returnTarget: { ...(options?.returnTarget ?? start) },
      path: outbound.map((point) => ({ ...point })),
      pathIndex: 0,
      lastMovedAtFacilityTick: state.facilityTick,
      ...(options ? { purpose: options.purpose, linkedServiceOperationId: options.linkedServiceOperationId } : {}),
    });
    state.patientAmenityNextOpportunityTicks[key] = nextOpportunityTick(state, context, key);
    return true;
  }
  return false;
}

/** Optional adult comfort, using the same movement/preemption ownership as bathrooms. */
export function tryStartPatientGardenRest(state: GameState, kind: AmenityActorKind, id: string, context: DomainContext): boolean {
  if (state.facilityLevel < 5 || getPatientAmenityTrip(state, kind, id) || !actorEligible(state, kind, id)) return false;
  const encounter = kind === "encounter" ? state.encounters[id] : null;
  const visitor = kind === "service_visitor" ? state.serviceOperations.find(operation => operation.id === id) : null;
  if (encounter?.gardenVisitBenefit || visitor?.gardenVisitBenefit || encounter?.frozenCase.pediatricProfile ||
    visitor?.clinicVisit && visitor.clinicVisit.demographics.ageYears < 18) return false;
  // Preparation/recovery is accepted care, even when a bathroom exception exists.
  const operation = activeOperationForActor(state, kind, id);
  if (operation && operation.status !== "waiting_for_resources") return false;
  const start = actorLocation(state, kind, id);
  if (!start) return false;
  for (const room of state.rooms.filter(room => room.roomDefinitionId === "room.indoor_garden" && isRoomOperationalForFacilityWork(state, room.id, context)).sort((a, b) => a.id.localeCompare(b.id))) {
    for (const seatId of ["leftSeat", "rightSeat"] as const) {
      if (state.patientAmenityTrips?.some(trip => trip.amenityKind === "garden" && trip.gardenRoomInstanceId === room.id && trip.gardenSeatId === seatId && trip.status !== "returning")) continue;
      const outbound = findLevelFiveSupportPath(state, room, seatId, start, context);
      if (!outbound) continue;
      state.patientAmenityTrips ??= [];
      state.patientAmenityTripSequence ??= 0;
      state.patientAmenityTrips.push({ version: "patient-amenity-trip.v1", id: `patient-amenity-trip.${state.patientAmenityTripSequence++}`,
        actorKind: kind, actorId: id, amenityKind: "garden", gardenRoomInstanceId: room.id, gardenSeatId: seatId,
        gardenUpgradeLevel: room.upgradeLevel, gardenSatisfactionPoints: getGardenSatisfactionPoints(room.upgradeLevel),
        gardenRestMinutes: LEVEL_FIVE_SUPPORT_TUNING.gardenRestMinutes, supportDoorId: outbound.doorId,
        status: "walking_to_amenity", startedAtFacilityTick: state.facilityTick, dwellEndsAtFacilityTick: null,
        returnRequested: false, returnTarget: { ...start }, path: outbound.path, pathIndex: 0, lastMovedAtFacilityTick: state.facilityTick });
      return true;
    }
  }
  return false;
}

export function requestPatientAmenityReturn(
  state: GameState,
  kind: AmenityActorKind,
  id: string,
  context: DomainContext,
): boolean {
  const trip = getPatientAmenityTrip(state, kind, id);
  if (!trip) return false;
  trip.returnRequested = true;
  if (trip.status === "returning" && !(trip.amenityKind === "garden" && trip.returnBlocked)) return true;
  const current = actorLocation(state, kind, id);
  if (!current) return true;
  const authorizedReturnRoom = protectedCareRoomAtPoint(state, context, trip.returnTarget);
  const encounter = kind === "encounter" ? state.encounters[id] : null;
  const serviceOperation = kind === "service_visitor"
    ? state.serviceOperations.find((operation) => operation.id === id)
    : null;
  const serviceRoomIds = new Set([
    ...(serviceOperation?.reservedRoomInstanceIds ?? []),
    ...(serviceOperation?.transitionHeldRoomInstanceIds ?? []),
    ...(serviceOperation?.periopBedReservation
      ? [serviceOperation.periopBedReservation.roomInstanceId]
      : []),
  ]);
  const allowedReturnRooms = authorizedReturnRoom &&
    ((encounter &&
      [encounter.assignedRoomInstanceId, encounter.queuedCareRoomInstanceId,
        encounter.patientMovement?.destinationRoomInstanceId].includes(authorizedReturnRoom.id)) ||
      serviceRoomIds.has(authorizedReturnRoom.id))
    ? new Set([authorizedReturnRoom.id])
    : new Set<string>();
  const garden = trip.amenityKind === "garden" ? state.rooms.find(room => room.id === trip.gardenRoomInstanceId) : null;
  const gardenExit = garden ? findLevelFiveSupportExitPath(state, garden, current, trip.returnTarget, context, allowedReturnRooms) : [];
  const soldGardenEscape = trip.amenityKind === "garden" && !garden && trip.returnBlocked ? trip.path.slice(0, Math.floor(trip.pathIndex) + 1).reverse() : [];
  const escapedReturn = soldGardenEscape.length ? route(state, context, soldGardenEscape.at(-1)!, trip.returnTarget, allowedReturnRooms) : [];
  const insideNativeGarden = garden && getLevelFiveSupportRoomAt(state, current)?.id === garden.id &&
    current.x >= garden.x && current.x < garden.x + 4 && current.y >= garden.y && current.y < garden.y + 4;
  const returnPath = gardenExit.length ? gardenExit : soldGardenEscape.length && escapedReturn.length ? [...soldGardenEscape, ...escapedReturn] :
    insideNativeGarden ? [] : route(state, context, current, trip.returnTarget, allowedReturnRooms);
  if (returnPath.length === 0) {
    if (trip.amenityKind === "garden") { trip.status = "returning"; trip.returnBlocked = true; trip.dwellEndsAtFacilityTick = null; }
    return true;
  }
  trip.status = "returning";
  trip.path = returnPath.map((point) => ({ ...point }));
  trip.pathIndex = 0;
  trip.lastMovedAtFacilityTick = state.facilityTick;
  trip.dwellEndsAtFacilityTick = null;
  if (trip.amenityKind === "garden") {
    delete trip.returnBlocked;
    if (garden) trip.supportDoorId = getLevelFiveSupportExitDoorId(state, garden, returnPath) ?? trip.supportDoorId;
  }
  return true;
}

/**
 * Re-points a patient's ordinary bathroom return walk at a newly freed waiting
 * chair (owner rule, 2026-10-07: do not return to a standing spot when a chair
 * is free). Departure trips keep their service-owned target.
 */
export function redirectPatientAmenityReturn(
  state: GameState,
  encounterId: string,
  target: GridPoint,
  context: DomainContext,
): boolean {
  const trip = getPatientAmenityTrip(state, "encounter", encounterId);
  if (!trip || trip.status !== "returning" || trip.purpose) return false;
  const current = actorLocation(state, "encounter", encounterId);
  if (!current) return false;
  const path = route(state, context, current, target);
  if (path.length === 0) return false;
  trip.returnTarget = { ...target };
  trip.path = path.map((point) => ({ ...point }));
  trip.pathIndex = 0;
  trip.lastMovedAtFacilityTick = state.facilityTick;
  return true;
}

function advanceTrip(state: GameState, trip: PatientAmenityTripState, context: DomainContext): boolean {
  if (trip.amenityKind === "garden") return advanceGardenRest(state, trip, context);
  const current = actorLocation(state, trip.actorKind, trip.actorId);
  if (!current) return false;
  const operation = activeOperationForActor(state, trip.actorKind, trip.actorId);
  if (operation && !operationAllowsBathroom(operation) && !(trip.purpose === "departure" &&
    trip.linkedServiceOperationId === operation.id && operation.periopBedFlowVersion === 1 &&
    !operation.periopBedReservation && operation.status === "discharging" && operation.departureItinerary?.status === "bathroom")) return false;
  if (!operation && (trip.actorKind === "service_visitor" ||
    !["waiting_unopened", "active_action_required", "active_pending_result"].includes(state.encounters[trip.actorId]?.lifecycle ?? ""))) return false;
  const bathroom = state.rooms.find((room) => room.id === trip.bathroomRoomInstanceId);
  if (!bathroom || bathroom.roomDefinitionId !== "room.bathroom" ||
    !isRoomOperationalForFacilityWork(state, bathroom.id, context)) {
    if (trip.status !== "returning") requestPatientAmenityReturn(state, trip.actorKind, trip.actorId, context);
    if (trip.status !== "returning" || trip.path.length === 0) return false;
  }
  if (!bathroom && trip.status !== "returning") return false;
  if (trip.returnRequested && trip.status !== "returning") {
    requestPatientAmenityReturn(state, trip.actorKind, trip.actorId, context);
  }
  if (trip.status === "using_amenity") {
    if (trip.dwellEndsAtFacilityTick !== null && state.facilityTick >= trip.dwellEndsAtFacilityTick) {
      requestPatientAmenityReturn(state, trip.actorKind, trip.actorId, context);
    }
    return true;
  }
  let destination: GridPoint | null = trip.returnTarget;
  if (trip.status !== "returning") {
    if (!bathroom) return false;
    const definition = getRoomDefinition(bathroom.roomDefinitionId, context);
    destination = definition ? getRoomNavigationAnchor(bathroom, definition) : null;
  }
  if (!destination) return false;
  const authorizedDestinationRoom = protectedCareRoomAtPoint(state, context, destination);
  const encounter = trip.actorKind === "encounter" ? state.encounters[trip.actorId] : null;
  const serviceOperation = trip.actorKind === "service_visitor"
    ? state.serviceOperations.find((operation) => operation.id === trip.actorId)
    : null;
  const serviceRoomIds = new Set([
    ...(serviceOperation?.reservedRoomInstanceIds ?? []),
    ...(serviceOperation?.transitionHeldRoomInstanceIds ?? []),
    ...(serviceOperation?.periopBedReservation
      ? [serviceOperation.periopBedReservation.roomInstanceId]
      : []),
  ]);
  const allowedDestinationRooms = authorizedDestinationRoom &&
    ((encounter &&
      [encounter.assignedRoomInstanceId, encounter.queuedCareRoomInstanceId,
        encounter.patientMovement?.destinationRoomInstanceId].includes(authorizedDestinationRoom.id)) ||
      serviceRoomIds.has(authorizedDestinationRoom.id))
    ? new Set([authorizedDestinationRoom.id])
    : new Set<string>();
  const currentRoute = route(state, context, current, destination, allowedDestinationRooms);
  if (currentRoute.length === 0 && !samePoint(current, destination)) return false;
  const savedRemaining = trip.path.slice(Math.floor(trip.pathIndex));
  if (currentRoute.length > 0 && !samePath(currentRoute, savedRemaining)) {
    trip.path = currentRoute.map((point) => ({ ...point }));
    trip.pathIndex = 0;
  }
  if (trip.path.length === 0 || trip.pathIndex >= trip.path.length - 1) {
    if (trip.status === "walking_to_amenity") {
      trip.status = "using_amenity";
      trip.dwellEndsAtFacilityTick = state.facilityTick + dwellMinutes(state, context, actorKey(trip.actorKind, trip.actorId));
      return true;
    }
    return false;
  }
  const elapsed = Math.max(1, state.facilityTick - trip.lastMovedAtFacilityTick);
  trip.pathIndex = Math.min(
    trip.path.length - 1,
    trip.pathIndex + elapsed * context.balanceRelease.facility.characterTravelTilesPerTick,
  );
  trip.lastMovedAtFacilityTick = state.facilityTick;
  const location = trip.path[Math.floor(trip.pathIndex)];
  if (location) setActorLocation(state, trip, location);
  if (trip.pathIndex < trip.path.length - 1) return true;
  if (trip.status === "walking_to_amenity") {
    trip.status = "using_amenity";
    trip.dwellEndsAtFacilityTick = state.facilityTick + dwellMinutes(state, context, actorKey(trip.actorKind, trip.actorId));
    trip.path = location ? [{ ...location }] : [];
    trip.pathIndex = 0;
    return true;
  }
  setActorLocation(state, trip, trip.returnTarget);
  return false;
}

function advanceGardenRest(state: GameState, trip: Extract<PatientAmenityTripState, { amenityKind: "garden" }>, context: DomainContext): boolean {
  const current = actorLocation(state, trip.actorKind, trip.actorId);
  const encounter = trip.actorKind === "encounter" ? state.encounters[trip.actorId] : null;
  const visitor = trip.actorKind === "service_visitor" ? state.serviceOperations.find(operation => operation.id === trip.actorId) : null;
  if (!current || encounter && !["waiting_unopened", "active_action_required", "active_pending_result"].includes(encounter.lifecycle) ||
    visitor && ["completed", "cancelled"].includes(visitor.status)) return false;
  const room = state.rooms.find(room => room.id === trip.gardenRoomInstanceId);
  const operational = room && isRoomOperationalForFacilityWork(state, room.id, context) && state.doors.some(door => door.id === trip.supportDoorId && door.roomId === room.id);
  const operation = activeOperationForActor(state, trip.actorKind, trip.actorId);
  if ((!operational || state.openChartEncounterId === trip.actorId || operation && operation.status !== "waiting_for_resources") && trip.status !== "returning") trip.returnRequested = true;
  if (trip.status === "returning" && room && getLevelFiveSupportRoomAt(state, current)?.id === room.id &&
    !state.doors.some(door => door.id === trip.supportDoorId && door.roomId === room.id)) trip.returnBlocked = true;
  if (trip.returnRequested && (trip.status !== "returning" || trip.returnBlocked)) {
    requestPatientAmenityReturn(state, trip.actorKind, trip.actorId, context);
    if (trip.returnBlocked) return true;
  }
  if (trip.status === "using_amenity") {
    if (trip.dwellEndsAtFacilityTick !== null && state.facilityTick >= trip.dwellEndsAtFacilityTick) {
      const actor = encounter ?? visitor;
      if (actor && !actor.gardenVisitBenefit) {
        actor.gardenVisitBenefit = { version: "garden-visit-benefit.v1", roomInstanceId: trip.gardenRoomInstanceId,
          upgradeLevel: trip.gardenUpgradeLevel, seatId: trip.gardenSeatId, points: trip.gardenSatisfactionPoints, completedAtFacilityTick: state.facilityTick };
        if (encounter) encounter.patientSatisfaction = Math.max(0, Math.min(100, encounter.patientSatisfaction + trip.gardenSatisfactionPoints));
      }
      requestPatientAmenityReturn(state, trip.actorKind, trip.actorId, context);
    }
    return true;
  }
  const elapsed = Math.max(1, state.facilityTick - trip.lastMovedAtFacilityTick);
  trip.pathIndex = Math.min(trip.path.length - 1, trip.pathIndex + elapsed * context.balanceRelease.facility.characterTravelTilesPerTick);
  trip.lastMovedAtFacilityTick = state.facilityTick;
  const location = trip.path[Math.floor(trip.pathIndex)];
  if (location) setActorLocation(state, trip, location);
  if (trip.pathIndex < trip.path.length - 1) return true;
  if (trip.status === "returning") return false;
  trip.status = "using_amenity";
  trip.dwellEndsAtFacilityTick = state.facilityTick + trip.gardenRestMinutes;
  return true;
}

/** Capture real exit routes while the room/doors still exist. No use award on sale. */
export function interruptGardenRestsForRoomSale(state: GameState, roomId: string, context: DomainContext): void {
  for (const trip of state.patientAmenityTrips ?? []) {
    if (trip.amenityKind === "garden" && trip.gardenRoomInstanceId === roomId && trip.status !== "returning") requestPatientAmenityReturn(state, trip.actorKind, trip.actorId, context);
  }
}

export function advancePatientAmenityTrips(state: GameState, context: DomainContext): void {
  state.patientAmenityTrips ??= [];
  state.patientAmenityNextOpportunityTicks ??= {};
  state.patientAmenityTripSequence ??= 0;
  state.patientAmenityTrips = state.patientAmenityTrips.filter((trip) => advanceTrip(state, trip, context));

  // A resolved patient who has left the map, or a finished visitor operation,
  // can never become eligible again. Skip that campaign history each minute.
  const actors: Array<{ kind: AmenityActorKind; id: string }> = [
    ...Object.keys(state.encounters)
      .filter((id) => state.encounters[id]!.lifecycle !== "resolved" || state.encounters[id]!.patientLocation !== null)
      .sort()
      .map((id) => ({ kind: "encounter" as const, id })),
    ...state.serviceOperations
      .filter((operation) => operation.actorKind === "visitor" && operation.status !== "completed" && operation.status !== "cancelled")
      .sort((left, right) => left.id.localeCompare(right.id))
      .map((operation) => ({ kind: "service_visitor" as const, id: operation.id })),
  ];
  for (const actor of actors) {
    const key = actorKey(actor.kind, actor.id);
    const due = state.patientAmenityNextOpportunityTicks[key];
    if (due === undefined) {
      state.patientAmenityNextOpportunityTicks[key] = nextOpportunityTick(state, context, key);
      continue;
    }
    if (due > state.facilityTick || getPatientAmenityTrip(state, actor.kind, actor.id)) continue;
    state.patientAmenityNextOpportunityTicks[key] = nextOpportunityTick(state, context, key);
    if (tryStartPatientGardenRest(state, actor.kind, actor.id, context)) continue;
    const roll = deterministicInteger(
      state.campaignSeed,
      RANDOM_STREAMS.environment,
      `patient-amenity:${key}:roll:${state.facilityTick}`,
      100,
    );
    if (roll < context.balanceRelease.environment.idleActionChancePercent) {
      tryStartPatientBathroomTrip(state, actor.kind, actor.id, context);
    }
  }
}
