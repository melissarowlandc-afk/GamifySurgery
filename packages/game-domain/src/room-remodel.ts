import { APPROVED_LEVEL4_SUPPORT_NAVIGATION, APPROVED_LEVEL5_SUPPORT_ROUTES, APPROVED_PEDIATRIC_SUPPORT_ROUTES, APPROVED_ROOM_NAVIGATION_CONTRACTS } from "@gamify-surgery/balance-config";
import { getRoomDefinition } from "./selectors";
import { getRoomNavigableTiles, getRoomNavigationAnchor, getRotatedFootprint, isInsideFacility, roomsOverlap, rotateDirection, rotateRoomLocalPoint } from "./spatial";
import { findRouteFromDisplacedLocationOffscreen, findRouteFromDisplacedLocationToPoint, findRouteFromDisplacedLocationToRoom } from "./displaced-routing";
import { commitPediatricPairPlan, planPediatricPair } from "./pediatric-family";
import { requestPatientAmenityReturn } from "./patient-amenities";
import { cancelRetailTripsForActor } from "./retail-operations";
import { reconcileServiceOperationFlow } from "./service-operations";
import { findLevelFiveSupportPath, findLevelFiveSupportExitPath, getLevelFiveSupportRoomAt, getLevelFiveSupportTarget } from "./level-five-support";
import { getDoorCells } from "./doors";
import type { DiagnosticOrderPlan, DomainContext, GameState, GridPoint, PlacedRoom, RoomRemodelStep } from "./types";

export interface RemodelValidation {
  valid: boolean;
  reason: string | null;
  invalidRoomIds: string[];
}

export const ROOM_REMODEL_FOUNDER_RETURN = "system.room-remodel.return";
/** Retry only a remodel-created return. Ordinary legacy clock paths are kept
 * byte-identical; a disconnected native doorway can reopen after another edit. */
export function remodelFounderReturnPath(state: GameState, context: DomainContext): GridPoint[] {
  const frontDesk = state.rooms.find(room => room.roomDefinitionId === "room.front_desk");
  const definition = frontDesk && getRoomDefinition(frontDesk.roomDefinitionId, context);
  if (!frontDesk || !definition) return [];
  const start = state.environment.founderLocation, native = getLevelFiveSupportRoomAt(state, start);
  return native ? findLevelFiveSupportExitPath(state, native, start, getRoomNavigationAnchor(frontDesk, definition, "staff"), context)
    : findRouteFromDisplacedLocationToRoom(state, context, start, frontDesk.id);
}

const same = (a: GridPoint, b: GridPoint) => a.x === b.x && a.y === b.y;
const changed = (room: PlacedRoom, step: RoomRemodelStep) => room.x !== step.x || room.y !== step.y || room.orientation !== step.orientation;
const finished = (status: string) => status === "completed" || status === "cancelled";
function inside(point: GridPoint | null | undefined, room: PlacedRoom, context: DomainContext): boolean {
  const definition = getRoomDefinition(room.roomDefinitionId, context);
  if (!point || !definition) return false;
  const size = getRotatedFootprint(definition, room.orientation);
  // GridPoint is a tile-origin coordinate; native contacts may be fractional
  // (the Executive chair is slightly north of y=0). Ownership follows its
  // tile centre, as the existing native pediatric/inspection navigation does.
  return point.x + .5 >= room.x && point.x + .5 < room.x + size.width && point.y + .5 >= room.y && point.y + .5 < room.y + size.height;
}

function activeDiagnostic(plan: DiagnosticOrderPlan | undefined, room: PlacedRoom, context: DomainContext): boolean {
  return plan?.phases.some(phase => phase.status === "active" && (phase.resource?.roomInstanceId === room.id ||
    ((phase.kind === "patient_departure" || phase.kind === "patient_return") &&
      (inside(phase.forecast?.patientPath?.[0], room, context) || inside(phase.forecast?.patientPath?.at(-1), room, context))))) ?? false;
}

/** Assignment, an idle occupant and an intersecting ordinary route are not work.
 * Frozen patient/test journeys and concrete live service reservations are work.
 * Keep this separate from the conservative door-removal guard. */
export function roomHasActiveRemodelWork(state: GameState, room: PlacedRoom, context: DomainContext): boolean {
  for (const encounter of Object.values(state.encounters)) {
    if (encounter.lifecycle === "active_action_required" && encounter.assignedRoomInstanceId === room.id) return true;
    const pending = encounter.pendingResult;
    if (pending?.deliveredAtTick === null) {
      const travel = pending.patientTravel;
      if (travel && (travel.originRoomInstanceId === room.id || travel.destinationRoomInstanceId === room.id) &&
          state.facilityTick < travel.returnArrivalTick) return true;
      if (pending.patientRemainsOnsite && encounter.assignedRoomInstanceId === room.id && state.facilityTick < pending.dueTick) return true;
      const offsite = pending.offsiteTravel;
      if (offsite && ((state.facilityTick >= offsite.outboundStartTick && state.facilityTick < offsite.outboundArrivalTick &&
          inside(offsite.outboundPath[0], room, context)) ||
        (state.facilityTick >= offsite.returnStartTick && state.facilityTick < offsite.returnArrivalTick &&
          inside(offsite.returnPath.at(-1), room, context)))) return true;
    }
    if (activeDiagnostic(pending?.diagnosticTiming, room, context) || activeDiagnostic(encounter.terminalTestOrder?.diagnosticTiming, room, context) || activeDiagnostic(encounter.testOnlyContinuation?.diagnosticTiming, room, context) ||
        activeDiagnostic(encounter.stagedResultOrder?.diagnosticTiming, room, context) ||
        encounter.stagedResultOrder?.components.some(component => activeDiagnostic(component.diagnosticTiming, room, context))) return true;
  }
  return state.serviceOperations.some(operation => !finished(operation.status) &&
    (activeDiagnostic(operation.diagnosticTiming, room, context) ||
      (operation.status !== "leaving" && (operation.reservedRoomInstanceIds.includes(room.id) || operation.transitionHeldRoomInstanceIds?.includes(room.id) ||
        operation.periopBedReservation?.roomInstanceId === room.id ||
        (["in_service", "walking_to_service", "walking_between_phases", "discharging"].includes(operation.status) && inside(operation.location, room, context))))));
}

/** Final-layout validation is shared by the reducer and the paused UI preview.
 * Invalid drafts remain editable (including the intermediate overlap in a swap). */
export function validateRoomRemodelPlan(state: GameState, steps: readonly RoomRemodelStep[], context: DomainContext): RemodelValidation {
  const invalid = new Set<string>();
  let reason: string | null = null;
  const reject = (id: string, message: string) => { invalid.add(id); reason ??= message; };
  if (!Array.isArray(steps) || steps.length === 0 || steps.length > state.rooms.length) {
    return { valid: false, reason: "Choose rooms to remodel.", invalidRoomIds: [] };
  }
  const byId = new Map<string, RoomRemodelStep>();
  for (const step of steps) {
    // Commands can outlive a rebase or originate in a restored journal. Reject
    // stale/malformed input before reading a missing definition or orientation.
    if (!step || typeof step.roomId !== "string") {
      reason ??= "Choose a valid room to remodel."; continue;
    }
    if (byId.has(step.roomId)) reject(step.roomId, "Choose each room only once in a remodel plan.");
    byId.set(step.roomId, step);
    const room = state.rooms.find(candidate => candidate.id === step.roomId);
    const definition = room ? getRoomDefinition(room.roomDefinitionId, context) : null;
    if (!room || !definition) { reject(step.roomId, "That room is no longer available."); continue; }
    if (!Number.isSafeInteger(step.x) || !Number.isSafeInteger(step.y) || ![0, 90, 180, 270].includes(step.orientation)) {
      reject(room.id, "Choose a valid grid location and orientation."); continue;
    }
    const approved = APPROVED_ROOM_NAVIGATION_CONTRACTS[room.roomDefinitionId]?.allowedOrientations;
    if (step.orientation !== room.orientation && approved && !approved.some(orientation => orientation === step.orientation))
      reject(room.id, "Choose an approved furniture orientation for this room.");
    if (changed(room, step) && context.balanceRelease.facility.protectedRoomDefinitionIds.includes(room.roomDefinitionId))
      reject(room.id, "The Front Desk and public entrance remain anchored to the sidewalk.");
    if (changed(room, step) && roomHasActiveRemodelWork(state, room, context))
      reject(room.id, "Wait for every character and reserved route to clear this room before moving it.");
    const { gridWidth, gridHeight } = context.balanceRelease.facility;
    if (!isInsideFacility({ ...room, ...step }, definition, gridWidth, gridHeight))
      reject(room.id, "The room does not fit inside the facility.");
  }
  const finalRooms = state.rooms.map(room => {
    const step = byId.get(room.id);
    return step ? { ...room, x: step.x, y: step.y, orientation: step.orientation } : room;
  });
  for (let i = 0; i < finalRooms.length; i++) {
    const room = finalRooms[i]!, definition = getRoomDefinition(room.roomDefinitionId, context);
    if (!definition) continue;
    for (let j = i + 1; j < finalRooms.length; j++) {
      const other = finalRooms[j]!, otherDefinition = getRoomDefinition(other.roomDefinitionId, context);
      if (otherDefinition && roomsOverlap(room, definition, other, otherDefinition)) {
        reject(room.id, "The room overlaps an existing room.");
        reject(other.id, "The room overlaps an existing room.");
      }
    }
  }
  return { valid: reason === null, reason, invalidRoomIds: [...invalid].sort() };
}

/** Mutates a command-owned clone only, after complete validation. Each point is
 * transformed from the ORIGINAL layout, never through another room in a swap. */
export function applyRoomRemodel(state: GameState, steps: readonly RoomRemodelStep[], context: DomainContext): GameState {
  const transforms = steps.flatMap(step => {
    const before = state.rooms.find(room => room.id === step.roomId);
    const definition = before && getRoomDefinition(before.roomDefinitionId, context);
    return before && definition && changed(before, step) ? [{ before: { ...before }, after: { ...before, x: step.x, y: step.y, orientation: step.orientation }, definition }] : [];
  }).sort((a, b) => a.before.id < b.before.id ? -1 : a.before.id > b.before.id ? 1 : 0);
  for (const { before, after } of transforms) {
    Object.assign(state.rooms.find(room => room.id === before.id)!, after);
    const turn = ((after.orientation - before.orientation + 360) % 360) as PlacedRoom["orientation"];
    for (const door of state.doors.filter(door => door.roomId === before.id)) door.side = rotateDirection(door.side, turn);
    after.doorSide = state.doors.find(door => door.roomId === before.id && !door.exterior)?.side ?? null;
    state.rooms.find(room => room.id === before.id)!.doorSide = after.doorSide;
  }
  const memo = new Map<string, GridPoint>();
  const nativeCarries = new Map<string, GridPoint>();
  for (const { before, after } of transforms) if (before.orientation === after.orientation) {
    const remember = (from: GridPoint, to: GridPoint) => {
      const key = `${before.id}:${from.x}:${from.y}`;
      if (!nativeCarries.has(key)) nativeCarries.set(key, to);
    };
    const supportRoutes = APPROVED_LEVEL5_SUPPORT_ROUTES[before.roomDefinitionId as keyof typeof APPROVED_LEVEL5_SUPPORT_ROUTES] ?? [];
    const contacts = new Set<string>();
    for (const route of supportRoutes) if (!contacts.has(route.targetId)) {
      contacts.add(route.targetId); const p = route.logicalPath.at(-1)!;
      remember({ x: before.x + p[0]!, y: before.y + p[1]! }, { x: after.x + p[0]!, y: after.y + p[1]! });
    }
    for (const route of supportRoutes)
      for (const p of route.logicalPath) remember({ x: before.x + p[0]!, y: before.y + p[1]! }, { x: after.x + p[0]!, y: after.y + p[1]! });
    // Use the exact authored knots/arithmetic, rather than subtracting large
    // world coordinates and introducing a different fractional seat identity.
    const support = APPROVED_LEVEL4_SUPPORT_NAVIGATION[before.roomDefinitionId] ?? [];
    const points = support.map(row => [row.standingApproach.x, row.standingApproach.y]);
    points.push(...support.flatMap(row => row.approachPath.map(point => [point.x, point.y])));
    points.push(...((APPROVED_PEDIATRIC_SUPPORT_ROUTES as Record<string, Array<{ walkingPath: number[][] }>>)[before.roomDefinitionId]?.flatMap(route => route.walkingPath) ?? []));
    for (const p of points) remember({ x: before.x + p[0]! - .5, y: before.y + p[1]! - .5 }, { x: after.x + p[0]! - .5, y: after.y + p[1]! - .5 });
  }
  const carry = (point: GridPoint): GridPoint => {
    const transform = transforms.find(({ before }) => inside(point, before, context));
    if (!transform) return { ...point };
    const { before, after, definition } = transform;
    const key = `${before.id}:${point.x}:${point.y}`;
    const cached = memo.get(key); if (cached) return { ...cached };
    const local = { x: point.x - before.x, y: point.y - before.y };
    const oldSize = getRotatedFootprint(definition, before.orientation);
    const turn = ((after.orientation - before.orientation + 360) % 360) as PlacedRoom["orientation"];
    const rotated = rotateRoomLocalPoint(local, oldSize, turn);
    const desired = { x: after.x + rotated.x, y: after.y + rotated.y };
    // A translation preserves the room's exact valid contacts, including native
    // fractional furniture/paired-family positions. A walking-tile snap would
    // unseat them and interrupt their existing activity on the next tick.
    if (turn === 0) { const result = nativeCarries.get(key) ?? desired; memo.set(key, result); return { ...result }; }
    const tiles = getRoomNavigableTiles(after, definition, state.doors, state.rooms, id => getRoomDefinition(id, context));
    // Stable nearest tile, then y/x. No random stream or device clock involved.
    const result = tiles.sort((a, b) => Math.abs(a.x - desired.x) + Math.abs(a.y - desired.y) -
      Math.abs(b.x - desired.x) - Math.abs(b.y - desired.y) || a.y - b.y || a.x - b.x)[0] ?? getRoomNavigationAnchor(after, definition);
    memo.set(key, result); return { ...result };
  };
  const touched = (path: readonly GridPoint[]) => path.some(point => transforms.some(({ before, after }) => inside(point, before, context) || inside(point, after, context)));
  const nativeContacts = state.rooms.flatMap(room => [...new Set((APPROVED_LEVEL5_SUPPORT_ROUTES[room.roomDefinitionId as keyof typeof APPROVED_LEVEL5_SUPPORT_ROUTES] ?? []).map(row => row.targetId))]
    .flatMap(id => { const point = getLevelFiveSupportTarget(room, id); return point ? [{ room, id, point }] : []; }));
  const doorOutside = (room: PlacedRoom) => {
    const definition = getRoomDefinition(room.roomDefinitionId, context);
    return definition ? state.doors.filter(door => door.roomId === room.id).sort((a, b) => a.id < b.id ? -1 : a.id > b.id ? 1 : 0)
      .flatMap(door => { const cells = getDoorCells(door, room, definition); return cells ? [cells.outside] : []; }) : [];
  };
  const route = (start: GridPoint, goal: GridPoint): GridPoint[] => {
    if (same(start, goal)) return [{ ...start }];
    const allowed = new Set(state.rooms.filter(room => inside(start, room, context) || inside(goal, room, context)).map(room => room.id));
    const nativeStart = getLevelFiveSupportRoomAt(state, start), nativeGoal = nativeContacts.find(row => same(row.point, goal));
    if (nativeGoal) {
      if (nativeStart) for (const outside of doorOutside(nativeGoal.room)) {
        const exit = findLevelFiveSupportExitPath(state, nativeStart, start, outside, context, allowed);
        const entry = exit.length && findLevelFiveSupportPath(state, nativeGoal.room, nativeGoal.id, exit.at(-1)!, context);
        if (entry) return [...exit, ...entry.path.slice(1)];
      }
      return findLevelFiveSupportPath(state, nativeGoal.room, nativeGoal.id, start, context)?.path ?? [];
    }
    if (goal.x < 0 || goal.x >= context.balanceRelease.facility.gridWidth) {
      if (nativeStart) {
        const frontDesk = state.rooms.find(room => state.doors.some(door => door.roomId === room.id && door.exterior));
        for (const outside of frontDesk ? doorOutside(frontDesk) : []) {
          const exit = findLevelFiveSupportExitPath(state, nativeStart, start, outside, context);
          const tail = exit.length ? findRouteFromDisplacedLocationOffscreen(state, context, outside) : [];
          if (tail.length) return [...exit, ...tail.slice(1)];
        }
      }
      return findRouteFromDisplacedLocationOffscreen(state, context, start);
    }
    if (nativeStart) return findLevelFiveSupportExitPath(state, nativeStart, start, goal, context, allowed);
    return findRouteFromDisplacedLocationToPoint(state, context, start, goal, allowed);
  };
  const repair = (movement: { path: GridPoint[]; pathIndex: number; lastMovedAtFacilityTick: number }, oldLocation: GridPoint | null): boolean => {
    if (!oldLocation) return true;
    const remaining = movement.path.slice(movement.pathIndex), start = carry(oldLocation), oldGoal = remaining.at(-1);
    if (!oldGoal || (!touched(remaining) && same(start, oldLocation))) return true;
    // The room carries an already-legal internal journey with its furniture.
    // Preserve its exact fine-grid knots instead of routing via a coarse graph.
    if (transforms.some(({ before, after }) => before.orientation === after.orientation && inside(oldLocation, before, context) && remaining.every(point => inside(point, before, context)))) {
      movement.path = remaining.map(carry); movement.pathIndex = 0; movement.lastMovedAtFacilityTick = state.facilityTick; return true;
    }
    const path = route(start, carry(oldGoal));
    movement.path = path; movement.pathIndex = 0; movement.lastMovedAtFacilityTick = state.facilityTick;
    return path.length > 0;
  };
  // Carry ALL current actors before planning any path (paired children/parents
  // and visitor projections must see the same final layout and positions).
  const oldPatients = new Map(Object.values(state.encounters).map(row => [row.id, row.patientLocation]));
  const oldStaff = new Map([...state.employees, ...(state.departingEmployees ?? [])].map(row => [row.id, row.location]));
  const oldServices = new Map(state.serviceOperations.map(row => [row.id, row.location]));
  const oldActors = new Map(state.retailExternalActors.map(row => [row.id, row.location]));
  const oldRetail = new Map(state.retailOperations.map(row => [row.id, row.location]));
  const inspectors = state.levelFive?.inspectionPresentation.actors ?? [];
  const oldInspectors = new Map(inspectors.map(row => [row.id, row.location]));
  const oldFounder = state.environment.founderLocation;
  for (const row of Object.values(state.encounters)) {
    if (row.patientLocation) row.patientLocation = carry(row.patientLocation);
    if (row.waitingDestination) row.waitingDestination.location = carry(row.waitingDestination.location);
    const pending = row.pendingResult;
    if (pending?.deliveredAtTick === null && pending.patientTravel) {
      const travel = pending.patientTravel;
      pending.patientTravel = { ...travel, outboundPath: travel.outboundPath.map(carry), returnPath: travel.returnPath.map(carry) };
      // Repair a FUTURE return leg now too. The existing reducer reconciler
      // handles the current physical leg (including disconnected-door waits).
      const from = pending.patientTravel.returnPath[0], to = pending.patientTravel.returnPath.at(-1);
      if (state.facilityTick < travel.serviceCompletionTick && from && to && touched(travel.returnPath)) {
        const path = route(from, to);
        if (path.length) {
          pending.patientTravel.returnPath = path;
          const arrival = Math.max(travel.returnArrivalTick, travel.serviceCompletionTick + Math.ceil((path.length - 1) / Math.max(1, travel.tilesPerTick)));
          pending.patientTravel.returnArrivalTick = arrival;
          pending.dueTick += arrival - travel.returnArrivalTick; pending.durationTicks += arrival - travel.returnArrivalTick;
        }
      }
    }
  }
  for (const row of [...state.employees, ...(state.departingEmployees ?? [])]) row.location = carry(row.location);
  for (const row of state.serviceOperations) if (row.location) row.location = carry(row.location);
  for (const row of state.retailExternalActors) {
    if (row.location) row.location = carry(row.location);
    if (row.procedureCompanion?.waitingReservation) row.procedureCompanion.waitingReservation.location = carry(row.procedureCompanion.waitingReservation.location);
  }
  for (const row of state.retailOperations) {
    row.location = carry(row.location);
    if (row.returnLocation) row.returnLocation = carry(row.returnLocation);
  }
  for (const family of Object.values(state.pediatricFamilies ?? {})) {
    if (family.reservation) {
      family.reservation.childLocation = carry(family.reservation.childLocation);
      family.reservation.parentLocation = carry(family.reservation.parentLocation);
    }
    if (family.procedureFlow?.parentCheckpoint) family.procedureFlow.parentCheckpoint.location = carry(family.procedureFlow.parentCheckpoint.location);
  }
  state.environment.founderLocation = carry(oldFounder);
  for (const actor of inspectors) actor.location = carry(actor.location);
  for (const litter of state.environment.litterItems) litter.location = carry(litter.location);
  for (const row of [...state.employees, ...(state.departingEmployees ?? [])]) {
    if (!repair(row, oldStaff.get(row.id) ?? null)) {
      row.path = []; row.pathIndex = 0;
      // Existing idle/home planner retries; do not perform a stranded support job.
      if (row.facilityTask && !["perform_service", "perform_imaging", "periop_attention", "cover_periop"].includes(row.facilityTask.kind)) row.facilityTask = null;
      row.nextIdleActionAtFacilityTick = state.facilityTick;
    }
  }
  for (const row of Object.values(state.encounters)) {
    // The reducer's existing frozen-itinerary reconciler repairs these once
    // after every room/actor has its final position, retaining accepted timing.
    if (row.pendingResult?.deliveredAtTick === null && row.pendingResult.patientTravel) continue;
    if (row.patientMovement && !repair(row.patientMovement, oldPatients.get(row.id) ?? null)) {
      row.patientMovement = null; row.waitingDestination = null;
      row.nextIdleActionAtFacilityTick = state.facilityTick;
      // The legacy tick would otherwise restart the invalid cached departure.
      // Its existing ensureLegacyOffsiteTravel planner retries after access
      // returns, preserving the frozen result/service data and minimum clock.
      const pending = row.pendingResult;
      if (pending?.deliveredAtTick === null && !pending.diagnosticTiming && pending.offsiteTravel &&
          pending.offsiteReturnStartedAtTick === null) pending.offsiteTravel = null;
    }
  }
  for (const row of state.serviceOperations) if (!finished(row.status) && !repair(row, oldServices.get(row.id) ?? null)) {
    row.path = []; row.pathIndex = 0; row.resourceWaitReason = "Waiting for a reachable door.";
  }
  for (const row of state.retailExternalActors) if (row.lifecycle !== "departed" && !repair(row, oldActors.get(row.id) ?? null)) {
    row.path = []; row.pathIndex = 0; row.movementWaitReason = "Waiting for a reachable door.";
  }
  for (const row of state.retailOperations) if (!["completed", "cancelled", "abandoned"].includes(row.status) && !repair(row, oldRetail.get(row.id) ?? null)) {
    row.path = []; row.pathIndex = 0; row.resourceWaitReason = "Waiting for a reachable door.";
    cancelRetailTripsForActor(state, row.actorKind, row.actorId, row.resourceWaitReason);
  }
  for (const trip of state.patientAmenityTrips ?? []) {
    const old = trip.path[trip.pathIndex] ?? null;
    trip.returnTarget = carry(trip.returnTarget);
    if (!repair(trip, old)) requestPatientAmenityReturn(state, trip.actorKind, trip.actorId, context);
  }
  const activity = state.environment.founderActivity;
  if (activity && !repair(activity, oldFounder)) {
    state.environment.founderActivity = { ...activity, kind: "return_to_front_desk", targetId: ROOM_REMODEL_FOUNDER_RETURN, path: [], pathIndex: 0, workMinutesRemaining: 0 };
  }
  if (state.environment.suspendedFounderActivity && !repair(state.environment.suspendedFounderActivity, oldFounder)) state.environment.suspendedFounderActivity = null;
  for (const actor of inspectors) if (!repair(actor, oldInspectors.get(actor.id) ?? null)) {
    // Cosmetic fine-grid navigation owns its own clearance graph. Its existing
    // tick watchdog chooses another safe route; never leave a stale walk live.
    actor.phase = "stationary"; actor.path = [{ ...actor.location }]; actor.pathIndex = 0;
    actor.observingUntilFacilityTick = state.facilityTick;
  }
  for (const family of Object.values(state.pediatricFamilies ?? {})) {
    const movement = family.movement;
    if (!movement || !touched([...movement.childPath, ...movement.parentPath])) continue;
    const goal = movement.childPath.at(-1);
    if (!goal) { family.movement = undefined; continue; }
    const plan = planPediatricPair(state, context, family, family.reservation, carry(goal));
    const child = family.child.kind === "encounter" ? state.encounters[family.child.id]?.patientMovement : state.serviceOperations.find(row => row.id === family.child.id);
    const parent = state.retailExternalActors.find(row => row.id === family.parentActorId);
    if (plan) {
      const path = commitPediatricPairPlan(family, plan);
      if (child) { child.path = path; child.pathIndex = 0; child.lastMovedAtFacilityTick = state.facilityTick; }
      if (parent) { parent.path = plan.movement.parentPath; parent.pathIndex = 0; parent.lastMovedAtFacilityTick = state.facilityTick; }
    } else {
      family.movement = undefined;
      if (family.child.kind === "encounter") {
        const encounter = state.encounters[family.child.id];
        if (encounter) encounter.patientMovement = null;
      } else if (child) { child.path = []; child.pathIndex = 0; }
      if (parent) { parent.path = []; parent.pathIndex = 0; parent.movementWaitReason = "Waiting for a reachable door."; }
    }
  }
  reconcileServiceOperationFlow(state, context);
  // Reconciliation needs a before-image of the current travel clocks only,
  // not a second clone of FSRS, frozen cases or the whole campaign history.
  const original = { ...state, encounters: { ...state.encounters } };
  for (const row of Object.values(state.encounters)) if (row.pendingResult?.patientTravel) {
    original.encounters[row.id] = { ...row, pendingResult: { ...row.pendingResult, patientTravel: { ...row.pendingResult.patientTravel } } };
  }
  return original;
}
