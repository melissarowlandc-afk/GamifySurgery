import { APPROVED_LEVEL4_SUPPORT_NAVIGATION, APPROVED_LEVEL5_SUPPORT_ROUTES } from "@gamify-surgery/balance-config";
import { findCareAwareFacilityPath } from "./care-room-access";
import { PROTOTYPE_DOMAIN_CONTEXT } from "./context";
import { getDiagnosticOrderPlans } from "./diagnostic-timing";
import { findRouteFromDisplacedLocationToPoint } from "./displaced-routing";
import { getDoorCells } from "./doors";
import { facilityDefinitionReader } from "./facilityNavigation";
import { giftContactAtLocation, giftContactPath, giftNativeExitPath } from "./gift-retail";
import { findLevelFiveSupportExitPath, findLevelFiveSupportPath, getLevelFiveSupportExitDoorId,
  getLevelFiveSupportRoomAt, getLevelFiveSupportTarget } from "./level-five-support";
import { pathToPediatricSupport, pediatricSupportLocation, planPediatricPair } from "./pediatric-family";
import { getFacilityAccessValidation, getRoomDefinition } from "./selectors";
import { getOccupiedTiles, reachableFacilityRooms } from "./spatial";
import type { DoorState, DomainContext, GameState, GridPoint, PendingResult, PlacedRoom } from "./types";

type DoorCells = NonNullable<ReturnType<typeof getDoorCells>>;
type Room = { room: PlacedRoom; hallway: boolean };
type RouteCursor = { path: GridPoint[]; pathIndex: number };
const same = (a: GridPoint | undefined, b: GridPoint | undefined) => !!a && !!b && a.x === b.x && a.y === b.y;
const tileKey = ({ x, y }: GridPoint) => `${Math.round(x)},${Math.round(y)}`;
const roomPair = (a: Room, b: Room) => JSON.stringify([a.room.id, b.room.id].sort());

function publicEntrance(state: GameState, context: DomainContext): DoorCells | null {
  const door = state.doors.find(row => row.exterior);
  const room = door && state.rooms.find(row => row.id === door.roomId);
  const definition = room && getRoomDefinition(room.roomDefinitionId, context);
  return door && room && definition ? getDoorCells(door, room, definition) : null;
}

// Native furniture routes use fractional knots on either side of the same
// wall. Test the intersection with the opening, including ordinary tile steps.
function crossesOpening(from: GridPoint, to: GridPoint, { inside, outside }: DoorCells): boolean {
  const across = inside.x === outside.x ? "y" : "x";
  const along = across === "x" ? "y" : "x";
  if (from[across] === to[across]) return false;
  const t = ((inside[across] + outside[across]) / 2 - from[across]) / (to[across] - from[across]);
  return t >= 0 && t <= 1 && Math.abs(from[along] + t * (to[along] - from[along]) - inside[along]) <= .5;
}

function doorGeometry(state: GameState, context: DomainContext, removed?: DoorState) {
  const tiles = new Map<string, Room>();
  for (const room of state.rooms) {
    const definition = getRoomDefinition(room.roomDefinitionId, context);
    if (!definition) continue;
    const owner = { room, hallway: definition.kind === "hallway" };
    for (const tile of getOccupiedTiles(room, definition)) tiles.set(tileKey(tile), owner);
  }
  const cellsFor = (door: DoorState) => {
    const room = state.rooms.find(row => row.id === door.roomId);
    const definition = room && getRoomDefinition(room.roomDefinitionId, context);
    return definition ? getDoorCells(door, room!, definition) : null;
  };
  const openings = new Map<string, DoorCells[]>();
  for (const door of state.doors) {
    if (door.exterior) continue;
    const cells = cellsFor(door);
    const inside = cells && tiles.get(tileKey(cells.inside)), outside = cells && tiles.get(tileKey(cells.outside));
    if (!cells || !inside || !outside) continue;
    const key = roomPair(inside, outside);
    const existing = openings.get(key);
    if (existing) existing.push(cells);
    else openings.set(key, [cells]);
  }
  const closed = removed && cellsFor(removed);
  const roomAt = (point: GridPoint) => tiles.get(tileKey(point));
  function blockedRoom(path: readonly GridPoint[], index: number, at?: GridPoint | null, onlyRemoved = false): PlacedRoom | undefined {
    let from = at ?? path[index];
    for (let i = index + 1; from && i < path.length; i++) {
      const to = path[i]!;
      const a = roomAt(from), b = roomAt(to);
      if (a && b && a !== b && !(a.hallway && b.hallway) &&
        (!onlyRemoved || closed && crossesOpening(from, to, closed)) &&
        !openings.get(roomPair(a, b))?.some(cells => crossesOpening(from!, to, cells))) {
        return (b.hallway ? a : b).room;
      }
      from = to;
    }
    return undefined;
  }
  function doorUsedBy(roomId: string, path: readonly GridPoint[]) {
    return state.doors.find(door => {
      if (door.roomId !== roomId) return false;
      const cells = cellsFor(door);
      return cells && path.some((to, index) => index > 0 && crossesOpening(path[index - 1]!, to, cells));
    })?.id;
  }
  return { roomAt, blockedRoom, doorUsedBy };
}

/** The quoted work clock can move later if a detour needs more travel time. */
export function deferPendingForTravelDelay(pending: PendingResult, delay: number, thresholdTick: number): void {
  if (delay <= 0) return;
  pending.dueTick += delay;
  pending.durationTicks += delay;
  pending.timingPhases = pending.timingPhases?.map(phase => phase.startsAtTick >= thresholdTick
    ? { ...phase, startsAtTick: phase.startsAtTick + delay, endsAtTick: phase.endsAtTick + delay }
    : phase);
  const onsite = pending.onsiteReturn;
  if (onsite?.serviceCompletedAtTick != null && onsite.serviceCompletedAtTick >= thresholdTick) {
    onsite.serviceCompletedAtTick += delay;
  }
}

/** A door edit owns its command clone. Failed replans retain their original
 * endpoints and cursors while paused, so a later edit or a reload can retry
 * without a second copy of the itinerary or a persisted remodel flag. */
export function reconcileDoorRoutes(state: GameState, context: DomainContext, repair: boolean, removed?: DoorState): string[] {
  const live = doorGeometry(state, context, removed);
  const blockedByEdit = (path: readonly GridPoint[], index: number, at?: GridPoint | null) =>
    live.blockedRoom(path, index, at, removed !== undefined);
  const blockedRooms = new Set<string>();
  const doorIds = new Set(state.doors.map(door => door.id));

  function replan(remaining: GridPoint[]): GridPoint[] {
    // Keep the original public entrance and any offscreen lead-in/lead-out.
    // A door edit cannot change the visitor's frozen sidewalk destination.
    const first = remaining.findIndex(point => live.roomAt(point));
    let last = remaining.length - 1;
    while (last > first && !live.roomAt(remaining[last]!)) last--;
    if (first < 0 || last <= first) return [];
    const from = remaining[first]!, to = remaining[last]!;
    const fromRoom = live.roomAt(from)?.room, toRoom = live.roomAt(to)?.room;
    const allowed = new Set(remaining.flatMap(point => {
      const room = live.roomAt(point)?.room;
      return room ? [room.id] : [];
    }));
    const ordinary = (start: GridPoint, goal: GridPoint) => findCareAwareFacilityPath(state, context, start, goal, allowed);
    const start = (goal: GridPoint) => {
      const native = getLevelFiveSupportRoomAt(state, from);
      if (fromRoom?.roomDefinitionId === "room.gift_shop") {
        return giftNativeExitPath(state, fromRoom, from, outside => ordinary(outside, goal));
      }
      if (native) return findLevelFiveSupportExitPath(state, native, from, goal, context, allowed);
      return Number.isInteger(from.x) && Number.isInteger(from.y) ? ordinary(from, goal)
        : findRouteFromDisplacedLocationToPoint(state, context, from, goal, allowed);
    };
    let path: GridPoint[] = [];
    if (toRoom) {
      const gift = toRoom.roomDefinitionId === "room.gift_shop" && giftContactAtLocation(toRoom, to);
      const support = APPROVED_LEVEL5_SUPPORT_ROUTES[toRoom.roomDefinitionId as keyof typeof APPROVED_LEVEL5_SUPPORT_ROUTES]
        ?.find(row => same(getLevelFiveSupportTarget(toRoom, row.targetId) ?? undefined, to));
      const pediatric = APPROVED_LEVEL4_SUPPORT_NAVIGATION[toRoom.roomDefinitionId]
        ?.find(row => same(pediatricSupportLocation(toRoom, row.id) ?? undefined, to));
      if (gift) path = giftContactPath(state, toRoom, gift, from, start)?.path ?? [];
      else if (support) path = findLevelFiveSupportPath(state, toRoom, support.targetId, from, context)?.path ?? [];
      else if (pediatric) path = pathToPediatricSupport(state, context, from, toRoom, pediatric.id);
    }
    if (!path.length) path = start(to);
    if (!path.length && (!Number.isInteger(to.x) || !Number.isInteger(to.y))) {
      path = findRouteFromDisplacedLocationToPoint(state, context, to, from, allowed).reverse();
    }
    return same(path[0], from) && same(path.at(-1), to) && !live.blockedRoom(path, 0)
      ? [...remaining.slice(0, first), ...path, ...remaining.slice(last + 1)] : [];
  }

  function continuation(path: readonly GridPoint[], index: number, at?: GridPoint | null): GridPoint[] | undefined {
    const room = blockedByEdit(path, index, at);
    if (!room) return undefined;
    const start = at ?? path[index];
    const route = repair && start ? replan([start, ...path.slice(index + 1)]) : [];
    if (!route.length) { blockedRooms.add(room.id); return undefined; }
    return route;
  }

  function move(cursor: RouteCursor | null | undefined, at?: GridPoint | null) {
    if (!cursor) return;
    const path = continuation(cursor.path, Math.floor(cursor.pathIndex), at);
    if (path) { cursor.path = path; cursor.pathIndex = 0; }
  }

  // Child, parent, and their two-lane plan form a single movement. Do not
  // route one projection independently if the other cannot use the same door.
  const paired = new Set<RouteCursor>();
  for (const family of Object.values(state.pediatricFamilies ?? {})) {
    const movement = family.movement;
    if (!movement || family.phase === "departed" || family.procedureFlow) continue;
    const child = family.child.kind === "encounter" ? state.encounters[family.child.id]?.patientMovement
      : state.serviceOperations.find(row => row.id === family.child.id);
    const parent = state.retailExternalActors.find(row => row.id === family.parentActorId);
    if (!child || !parent || child.pathIndex >= child.path.length - 1) continue;
    paired.add(child); paired.add(parent);
    const barrier = blockedByEdit(movement.childPath, movement.pathIndex) ??
      blockedByEdit(movement.parentPath, movement.pathIndex);
    if (!barrier) {
      if (repair) movement.doorIds = movement.doorIds.filter(id => doorIds.has(id));
      continue;
    }
    const goal = movement.childPath.at(-1);
    const reservation = same(family.reservation?.childLocation, goal) ? family.reservation : null;
    const plan = repair && planPediatricPair(state, context, family, reservation, goal, true);
    if (!plan || !same(goal, plan.movement.childPath.at(-1)) ||
      !same(movement.parentPath.at(-1), plan.movement.parentPath.at(-1)) ||
      !same(movement.childPath[movement.pathIndex], plan.movement.childPath[0]) ||
      !same(parent.location ?? undefined, plan.movement.parentPath[0]) ||
      live.blockedRoom(plan.movement.childPath, 0) || live.blockedRoom(plan.movement.parentPath, 0)) {
      blockedRooms.add(barrier.id);
      continue;
    }
    family.movement = { ...plan.movement, lastMovedAtFacilityTick: movement.lastMovedAtFacilityTick };
    child.path = plan.movement.childPath; child.pathIndex = 0;
    parent.path = plan.movement.parentPath; parent.pathIndex = 0;
  }

  function frozenLeg(path: GridPoint[], startsAt: number, tilesPerTick: number): GridPoint[] | undefined {
    const cursor = Math.min(path.length - 1, Math.max(0, state.facilityTick - startsAt) * tilesPerTick);
    const route = continuation(path, cursor);
    return route && [...path.slice(0, cursor), ...route];
  }

  for (const encounter of Object.values(state.encounters)) {
    if (encounter.patientMovement && !paired.has(encounter.patientMovement)) move(encounter.patientMovement, encounter.patientLocation);
    const pending = encounter.pendingResult;
    if (pending?.deliveredAtTick === null) {
      const onsite = pending.patientTravel;
      const offsite = pending.offsiteTravel;
      const travel = onsite ?? offsite;
      if (travel) {
        const speed = travel.tilesPerTick;
        const outbound = state.facilityTick < travel.outboundArrivalTick && frozenLeg(travel.outboundPath, travel.outboundStartTick, speed);
        if (outbound) {
          const oldArrival = travel.outboundArrivalTick;
          const delay = Math.max(0, travel.outboundStartTick + Math.ceil((outbound.length - 1) / speed) - oldArrival);
          travel.outboundPath = outbound;
          travel.outboundArrivalTick += delay;
          if (onsite) onsite.serviceCompletionTick += delay;
          if (offsite) offsite.returnStartTick += delay;
          travel.returnArrivalTick += delay;
          deferPendingForTravelDelay(pending, delay, oldArrival);
        }
        const returnStart = onsite?.serviceCompletionTick ?? offsite!.returnStartTick;
        const returning = state.facilityTick < travel.returnArrivalTick && frozenLeg(travel.returnPath, returnStart, speed);
        if (returning) {
          travel.returnPath = returning;
          const arrival = returnStart + Math.ceil((returning.length - 1) / speed);
          const delay = Math.max(0, arrival - travel.returnArrivalTick);
          travel.returnArrivalTick += delay;
          pending.dueTick += delay;
          pending.durationTicks += delay;
        }
        const step = encounter.steps[pending.originatingNodeIndex];
        if ((outbound || returning) && step?.result?.operationId === pending.operationId) step.result = structuredClone(pending);
      }
    }
    const interrupted = encounter.testOnlyContinuation?.saleInterruptedOffsite;
    if (interrupted) {
      const path = continuation(interrupted.returnPath, 0);
      if (path) interrupted.returnPath = path;
    }
  }

  for (const plan of getDiagnosticOrderPlans(state)) for (const phase of plan.phases) {
    // Active movement already has a live cursor. Its forecast may contain
    // crossings the actor finished before the remodel began.
    if (phase.status !== "queued" && phase.status !== "pending") continue;
    const route = continuation(phase.forecast.patientPath, 0);
    if (route) phase.forecast.patientPath = route;
    const founder = continuation(phase.forecast.founderPath, 0);
    if (founder) phase.forecast.founderPath = founder;
    for (const employee of phase.forecast.employeePaths) {
      const path = continuation(employee.path, 0);
      if (path) employee.path = path;
    }
  }

  for (const employee of [...state.employees, ...(state.departingEmployees ?? [])]) {
    move(employee, employee.location);
    const task = employee.facilityTask;
    if (!task?.supportDoorId || doorIds.has(task.supportDoorId)) continue;
    const roomId = task.kind === "daily_management_round" ? employee.homeRoomInstanceId : task.targetId;
    const room = state.rooms.find(row => row.id === roomId);
    if (!room) continue;
    const seat = task.kind === "daily_management_round" ? "executiveChair" : task.seatId;
    if (!seat) continue;
    const publicStart = publicEntrance(state, context)?.inside;
    const doorId = live.doorUsedBy(room.id, employee.path.slice(employee.pathIndex)) ??
      (publicStart && findLevelFiveSupportPath(state, room, seat, publicStart, context)?.doorId);
    if (!doorId) blockedRooms.add(room.id);
    else if (repair) task.supportDoorId = doorId;
  }
  for (const operation of state.serviceOperations) {
    if (operation.status !== "completed" && operation.status !== "cancelled" && !paired.has(operation)) move(operation, operation.location);
  }
  for (const actor of state.retailExternalActors) if (actor.lifecycle !== "departed" && !paired.has(actor)) move(actor, actor.location);
  for (const operation of state.retailOperations) {
    if (["completed", "cancelled", "abandoned"].includes(operation.status)) continue;
    move(operation, operation.location);
    const checkout = operation.giftCheckout;
    if (!repair || !checkout || doorIds.has(checkout.doorId)) continue;
    const shop = state.rooms.find(room => room.id === operation.outletRoomInstanceId);
    const doorId = shop && live.doorUsedBy(shop.id, operation.path);
    if (doorId) checkout.doorId = doorId;
  }
  for (const trip of state.patientAmenityTrips ?? []) {
    move(trip);
    if (trip.amenityKind !== "garden" || doorIds.has(trip.supportDoorId)) continue;
    const room = state.rooms.find(row => row.id === trip.gardenRoomInstanceId);
    if (!room) continue;
    const cursor = Math.floor(trip.pathIndex), current = trip.path[cursor];
    if (trip.status === "returning" && current && getLevelFiveSupportRoomAt(state, current)?.id !== room.id) continue;
    const remaining = trip.path.slice(cursor);
    const goalRoom = live.roomAt(trip.returnTarget)?.room.id;
    const returnOrigin = trip.status === "returning" ? current : trip.path.at(-1);
    const doorId = live.doorUsedBy(room.id, remaining) ?? (returnOrigin && getLevelFiveSupportExitDoorId(state, room,
      findLevelFiveSupportExitPath(state, room, returnOrigin, trip.returnTarget, context, new Set(goalRoom ? [goalRoom] : []))));
    if (!doorId) blockedRooms.add(room.id);
    else if (repair) trip.supportDoorId = doorId;
  }
  move(state.environment.founderActivity, state.environment.founderLocation);
  // Suspended activities are replanned by the existing consult resume path.
  // Inspectors use their own clearance graph and revalidate on the command.
  return [...blockedRooms];
}

/** Keep the room-access diagnostics used by Build. A room-level connection
 * can still leave a specific accepted furniture contact or paired route cut. */
export function doorEditedWhilePaused(state: GameState): boolean {
  return state.paused && state.events.some(event => event.type === "door_removed" && event.facilityTick === state.facilityTick);
}

export function getBuildExitAccessValidation(state: GameState, context: DomainContext = PROTOTYPE_DOMAIN_CONTEXT) {
  const access = getFacilityAccessValidation(state, context);
  if (!access.valid) return access;
  const cells = publicEntrance(state, context);
  const reached = cells && reachableFacilityRooms(cells.inside, state.rooms, state.doors, facilityDefinitionReader(context));
  const floorIssues = reached ? state.rooms.filter(room => !reached.has(room.id)).map(room => room.id) : [];
  const routeIssues = reconcileDoorRoutes(state, context, false);
  const roomIds = [...new Set([...floorIssues, ...routeIssues])];
  if (!roomIds.length) return access;
  const issues = roomIds.map(id => {
    const room = state.rooms.find(row => row.id === id)!;
    const name = getRoomDefinition(room.roomDefinitionId, context)?.displayName ?? room.id;
    return floorIssues.includes(id)
      ? `${name} needs a reachable door. Connect its walkable floor to the Front Desk.`
      : `${name} needs a reachable door for an existing journey. Restore the opening or add another door that reaches the reserved destination.`;
  });
  return { valid: false, issues, reason: issues[0]!, unreachableRoomIds: roomIds };
}
