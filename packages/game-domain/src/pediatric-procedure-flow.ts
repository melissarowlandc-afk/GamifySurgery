import { getRoomDefinition, isRoomOperationalForFacilityWork } from "./selectors";
import { getRoomNavigableTiles, getRoomCareStations } from "./spatial";
import { pathServiceVisitorFromCurrentLocation, pathServiceVisitorToOffscreenEndpoint } from "./service-operations";
import type { DomainContext, GameState, GridPoint, PediatricFamilyState } from "./types";

const same = (a: GridPoint | null | undefined, b: GridPoint | null | undefined) => Boolean(a && b && a.x === b.x && a.y === b.y);

/** Parents remain at the reserved preparation/recovery place for consent and
 * updates. They never acquire an adult companion's amenity or retail policy. */
export function reconcilePediatricProcedureFamily(state: GameState, context: DomainContext, family: PediatricFamilyState): void {
  const flow = family.procedureFlow!;
  const operation = state.serviceOperations.find(op => op.id === flow.serviceOperationId);
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
      if (!state.rooms.some(room => room.id === flow.parentCheckpoint?.roomInstanceId)) {
        flow.parentCheckpoint = null;
        const rooms = state.rooms.filter(room => ["room.periop_recovery", "room.waiting", "room.pediatric_waiting", "room.pediatric_examination"].includes(room.roomDefinitionId) &&
          isRoomOperationalForFacilityWork(state, room.id, context));
        for (const room of rooms) {
          const definition = getRoomDefinition(room.roomDefinitionId, context)!;
          const point = getRoomNavigableTiles(room, definition, state.doors, state.rooms, id => getRoomDefinition(id, context))
            .find(point => parent.location && pathServiceVisitorFromCurrentLocation(state, context, parent.location, point, new Set([room.id])).length);
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
      if (flow.parentCheckpoint?.roomInstanceId !== room.id) {
        const occupied = new Set(state.retailExternalActors.filter(a => a.id !== parent.id && a.location).map(a => `${a.location!.x},${a.location!.y}`));
        for (const other of Object.values(state.pediatricFamilies ?? {})) if (other.id !== family.id && other.procedureFlow?.parentCheckpoint) {
          const point = other.procedureFlow.parentCheckpoint.location; occupied.add(`${point.x},${point.y}`);
        }
        for (const station of getRoomCareStations(room, definition, state.doors, state.rooms, id => getRoomDefinition(id, context))) {
          const point = station.patientAnchor; occupied.add(`${point.x},${point.y}`);
        }
        const points = getRoomNavigableTiles(room, definition, state.doors, state.rooms, id => getRoomDefinition(id, context))
          .filter(point => Math.max(Math.abs(point.x - bed!.endpoint.x), Math.abs(point.y - bed!.endpoint.y)) > 1 && !occupied.has(`${point.x},${point.y}`))
          .sort((a, b) => Math.abs(a.x - bed!.endpoint.x) + Math.abs(a.y - bed!.endpoint.y) - Math.abs(b.x - bed!.endpoint.x) - Math.abs(b.y - bed!.endpoint.y) || a.y - b.y || a.x - b.x);
        const reachable = points.find(point => parent.location && pathServiceVisitorFromCurrentLocation(state, context, parent.location, point, roomIds).length);
        flow.parentCheckpoint = reachable ? {roomInstanceId: room.id, location: {...reachable}} : null;
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
    const path = leaving ? pathServiceVisitorToOffscreenEndpoint(state, context, parent.location, target)
      : pathServiceVisitorFromCurrentLocation(state, context, parent.location, target, roomIds);
    if (!path.length) {parent.movementWaitReason = "Waiting for a connected parent checkpoint"; return;}
    parent.path = path; parent.pathIndex = 0; parent.lastMovedAtFacilityTick = state.facilityTick;
  }
  if (state.facilityTick > parent.lastMovedAtFacilityTick) {
    parent.pathIndex = Math.min(parent.path.length - 1, parent.pathIndex +
      (state.facilityTick - parent.lastMovedAtFacilityTick) * context.balanceRelease.facility.characterTravelTilesPerTick);
    parent.location = {...parent.path[parent.pathIndex]!}; parent.lastMovedAtFacilityTick = state.facilityTick;
  }
  parent.movementWaitReason = null;
  if (leaving && same(parent.location, target)) {
    flow.phase = "departed"; family.phase = "departed"; parent.lifecycle = "departed"; parent.location = null; parent.path = []; parent.pathIndex = 0;
  }
}

export function pediatricProcedureParentReady(state: GameState, family: PediatricFamilyState): boolean {
  const parent = state.retailExternalActors.find(actor => actor.id === family.parentActorId);
  return Boolean(family.procedureFlow?.parentCheckpoint && parent && same(parent.location, family.procedureFlow.parentCheckpoint.location));
}
