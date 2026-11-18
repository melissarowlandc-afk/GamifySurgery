import { getRoomDefinition, isRoomOperationalForFacilityWork } from "./selectors";
import { getRoomNavigableTiles } from "./spatial";
import { pathServiceVisitorFromCurrentLocation, pathServiceVisitorToOffscreenEndpoint } from "./service-operations";
import { getPeriopWorkingSpace, periopPointKey, periopSupportPathIndex, periopVisitorClaims, routeFromPeriopSupport, routePeriopSupport } from "./periop-working-space";
import type { DomainContext, GameState, GridPoint, PediatricFamilyState } from "./types";

const same = (a: GridPoint | null | undefined, b: GridPoint | null | undefined) => Boolean(a && b && a.x === b.x && a.y === b.y);

/** Parents remain at the reserved preparation/recovery place for consent and
 * updates. They never acquire an adult companion's amenity or retail policy. */
export function reconcilePediatricProcedureFamily(state: GameState, context: DomainContext, family: PediatricFamilyState, repairingTick = false): void {
  const flow = family.procedureFlow!;
  const operation = state.serviceOperations.find(op => op.id === flow.serviceOperationId);
  const checkpointRoomId = flow.parentCheckpoint?.roomInstanceId ?? operation?.periopBedReservation?.roomInstanceId;
  const parent = state.retailExternalActors.find(actor => actor.id === family.parentActorId);
  const encounter = family.child.kind === "encounter" ? state.encounters[family.child.id] : undefined;
  const childLocation = encounter?.patientLocation ?? operation?.location;
  if (!parent) return;
  delete family.movement;
  family.reservation = null;
  const openPatient = Boolean(encounter && encounter.resolutionReason === null);
  const leaving = !operation || !openPatient && ["leaving", "discharging", "completed", "cancelled"].includes(operation.status) ||
    encounter?.patientMovement?.kind.startsWith("leaving") || !childLocation;
  let target: GridPoint | undefined;
  let checkpointPath: GridPoint[] | undefined;
  let roomIds = new Set<string>();
  if (leaving) {
    flow.phase = "departing"; family.phase = "departing"; parent.lifecycle = "departing";
    target = operation?.visitorTravel?.offscreenEndpoint;
    flow.parentCheckpoint = null;
  } else {
    const bed = operation!.periopBedReservation;
    if (!bed && openPatient && operation!.status === "cancelled") {
      // A cancelled source keeps the frozen chart and its parent onsite. The
      // ordinary encounter route can finish care without a second operation.
      flow.phase = state.openChartEncounterId === encounter!.id ? "update" : "waiting";
      family.phase = "in_care"; parent.lifecycle = "onsite";
      const retainedSpace = flow.parentCheckpoint && getPeriopWorkingSpace(state, flow.parentCheckpoint.roomInstanceId, context);
      if (!state.rooms.some(room => room.id === flow.parentCheckpoint?.roomInstanceId) || retainedSpace &&
        (!retainedSpace.supportKeys.has(periopPointKey(flow.parentCheckpoint!.location)) || periopVisitorClaims(state, parent.id).has(periopPointKey(flow.parentCheckpoint!.location)))) {
        flow.parentCheckpoint = null;
        const rooms = state.rooms.filter(room => ["room.periop_recovery", "room.waiting", "room.pediatric_waiting", "room.pediatric_examination"].includes(room.roomDefinitionId) &&
          isRoomOperationalForFacilityWork(state, room.id, context));
        for (const room of rooms) {
          const definition = getRoomDefinition(room.roomDefinitionId, context)!;
          const space = getPeriopWorkingSpace(state, room.id, context), occupied = periopVisitorClaims(state, parent.id);
          const point = (space ? [...space.supportPoints, ...space.seatSupports] : getRoomNavigableTiles(room, definition, state.doors, state.rooms, id => getRoomDefinition(id, context)))
            .find(point => {
              if (!parent.location || occupied.has(periopPointKey(point))) return false;
              const path = routePeriopSupport(state, room.id, parent.location, point, context,
                (start, target) => pathServiceVisitorFromCurrentLocation(state, context, start, target, new Set([room.id])));
              if (!path.length) return false; checkpointPath = path; return true;
            });
          if (point) {flow.parentCheckpoint = {roomInstanceId: room.id, location: {...point}}; break;}
        }
      }
      target = flow.parentCheckpoint?.location;
      roomIds = new Set(flow.parentCheckpoint ? [flow.parentCheckpoint.roomInstanceId] : []);
    } else if (!bed) {
      // Reuse the frozen sidewalk/public arrival route; indoor navigation alone
      // cannot reach actors that are still outside the clinic grid.
      flow.phase = "arriving"; family.phase = "arriving"; parent.lifecycle = "arriving";
      parent.path = operation!.path.map(point => ({...point})); parent.pathIndex = operation!.pathIndex;
      parent.location = childLocation ? {...childLocation} : null;
      parent.lastMovedAtFacilityTick = state.facilityTick; parent.movementWaitReason = null;
      return;
    } else {
    const room = bed && state.rooms.find(room => room.id === bed.roomInstanceId);
    const definition = room && getRoomDefinition(room.roomDefinitionId, context);
    if (room && definition) {
      roomIds = new Set([room.id]);
      const space = getPeriopWorkingSpace(state, room.id, context), occupied = periopVisitorClaims(state, parent.id);
      const retained = flow.parentCheckpoint;
      if (retained?.roomInstanceId !== room.id || !space?.supportKeys.has(periopPointKey(retained.location)) || occupied.has(periopPointKey(retained.location))) {
        const ordered = (points: readonly GridPoint[]) => points.filter(point => Math.max(Math.abs(point.x - bed!.endpoint.x), Math.abs(point.y - bed!.endpoint.y)) > 1 && !occupied.has(periopPointKey(point)))
          .sort((a, b) => Math.abs(a.x - bed!.endpoint.x) + Math.abs(a.y - bed!.endpoint.y) - Math.abs(b.x - bed!.endpoint.x) - Math.abs(b.y - bed!.endpoint.y) || a.y - b.y || a.x - b.x);
        // Preserve the standing-checkpoint policy; a free approved chair is a
        // safe capacity fallback when every standing support is claimed.
        const points = [...ordered(space?.supportPoints ?? []), ...ordered(space?.seatSupports ?? [])];
        const reachable = points.find(point => {
          const path = parent.location && routePeriopSupport(state, room.id, parent.location, point, context,
            (start, target) => pathServiceVisitorFromCurrentLocation(state, context, start, target, roomIds));
          if (!path?.length) return false;
          checkpointPath = path; return true;
        });
        flow.parentCheckpoint = reachable ? {roomInstanceId: room.id, location: {...reachable}} : null;
        if (!reachable) {
          parent.path = parent.location ? [{ ...parent.location }] : []; parent.pathIndex = 0;
          parent.movementWaitReason = "Waiting for a free, reachable parent checkpoint";
        }
      }
      target = flow.parentCheckpoint?.location;
    }
    const phase = operation!.frozenOperationPhases?.[operation!.phaseIndex];
    flow.phase = !bed ? "arriving" : phase?.roomDefinitionId === "room.periop_recovery"
      ? operation!.phaseIndex === 0 ? "consent" : "recovery"
      : encounter && state.openChartEncounterId === encounter.id && encounter.consult?.closedAtFacilityTick === null ? "update" : "waiting";
    family.phase = !bed ? "arriving" : "in_care";
    parent.lifecycle = !bed ? "arriving" : "onsite";
    // Arrival/waiting-room travel shares the public child route until a real
    // preparation bed supplies the parent's permanent onsite checkpoint.
    if (!bed) target = childLocation ?? undefined;
    }
  }
  if (!parent.location || !target) {
    if (leaving && !childLocation) {flow.phase = "departed"; family.phase = "departed"; parent.lifecycle = "departed"; parent.location = null; parent.path = []; parent.pathIndex = 0;}
    return;
  }
  if (!same(parent.path.at(-1), target) || !same(parent.path[parent.pathIndex], parent.location)) {
    const path = checkpointPath ?? (leaving ? checkpointRoomId
      ? routeFromPeriopSupport(state, checkpointRoomId, parent.location, context, start => pathServiceVisitorToOffscreenEndpoint(state, context, start, target!))
      : pathServiceVisitorToOffscreenEndpoint(state, context, parent.location, target)
      : flow.parentCheckpoint ? routePeriopSupport(state, flow.parentCheckpoint.roomInstanceId, parent.location, target, context,
        (start, goal) => pathServiceVisitorFromCurrentLocation(state, context, start, goal, roomIds))
      : pathServiceVisitorFromCurrentLocation(state, context, parent.location, target, roomIds));
    if (!path.length) {parent.movementWaitReason = "Waiting for a connected parent checkpoint"; return;}
    parent.path = path; parent.pathIndex = 0;
    // A repair may use this tick's ordinary travel budget, never bank old idle
    // time or move again during the later same-tick family reconciliation.
    parent.lastMovedAtFacilityTick = repairingTick && parent.lastMovedAtFacilityTick < state.facilityTick ? state.facilityTick - 1 : state.facilityTick;
  }
  if (repairingTick) parent.lastMovedAtFacilityTick = Math.max(parent.lastMovedAtFacilityTick, state.facilityTick - 1);
  if (state.facilityTick > parent.lastMovedAtFacilityTick) {
    const steps = (state.facilityTick - parent.lastMovedAtFacilityTick) * context.balanceRelease.facility.characterTravelTilesPerTick;
    parent.pathIndex = flow.parentCheckpoint ? periopSupportPathIndex(state, flow.parentCheckpoint.roomInstanceId, parent.path, parent.pathIndex, steps, context)
      : Math.min(parent.path.length - 1, parent.pathIndex + steps);
    parent.location = {...parent.path[parent.pathIndex]!}; parent.lastMovedAtFacilityTick = state.facilityTick;
  }
  parent.movementWaitReason = null;
  if (leaving && same(parent.location, target)) {
    flow.phase = "departed"; family.phase = "departed"; parent.lifecycle = "departed"; parent.location = null; parent.path = []; parent.pathIndex = 0;
  }
}

/** Tick-only recovery before nurse dispatch; snapshot normalization never calls
 * this. Healthy families keep their existing reconciliation timing. */
export function repairPediatricPeriopWorkingSpace(state: GameState, context: DomainContext): void {
  for (const family of Object.values(state.pediatricFamilies ?? {})) {
    const flow = family.procedureFlow;
    if (!flow) continue;
    const parent = state.retailExternalActors.find(actor => actor.id === family.parentActorId && actor.lifecycle !== "departed");
    const operation = state.serviceOperations.find(operation => operation.id === flow.serviceOperationId);
    const roomId = flow.parentCheckpoint?.roomInstanceId ?? operation?.periopBedReservation?.roomInstanceId;
    const space = roomId && getPeriopWorkingSpace(state, roomId, context);
    if (parent && space && [parent.location, parent.path.at(-1), flow.parentCheckpoint?.location].some(point => point && space.workingKeys.has(periopPointKey(point)))) {
      reconcilePediatricProcedureFamily(state, context, family, true);
    }
  }
}

export function pediatricProcedureParentReady(state: GameState, family: PediatricFamilyState): boolean {
  const parent = state.retailExternalActors.find(actor => actor.id === family.parentActorId);
  return Boolean(family.procedureFlow?.parentCheckpoint && parent && same(parent.location, family.procedureFlow.parentCheckpoint.location));
}
