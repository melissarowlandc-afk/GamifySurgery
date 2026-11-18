import { getDoorCells } from "./doors";
import { createFacilityNavigationCache, facilityDefinitionReader } from "./facilityNavigation";
import { getRoomDefinition } from "./selectors";
import { getRoomCareStations, getRoomCompanionSeats, getRoomNavigableTiles, getRoomNavigationAnchor, getRoomSharedStaffAnchor, getRotatedFootprint, rotateRoomLocalPoint } from "./spatial";
import type { DomainContext, GameState, GridPoint } from "./types";

export const periopPointKey = (point: GridPoint) => `${point.x},${point.y}`;
interface WorkingSpace {
  navigable: readonly GridPoint[];
  contacts: ReadonlySet<string>;
  beds: ReadonlyMap<string, readonly GridPoint[]>;
  workingKeys: ReadonlySet<string>;
  supportPoints: readonly GridPoint[];
  seatSupports: readonly GridPoint[];
  supportKeys: ReadonlySet<string>;
  paths: Map<string, readonly GridPoint[]>;
  nodes: ReadonlyMap<string, GridPoint>;
  edges: ReadonlyMap<string, ReadonlySet<string>>;
  approaches: ReadonlyMap<string, readonly GridPoint[]>;
}
const layouts = createFacilityNavigationCache<{ thresholds: Set<string>; rooms: Map<string, WorkingSpace> }>();

function bedside(points: readonly GridPoint[], contacts: ReadonlySet<string>, bed: GridPoint): GridPoint[] {
  return points.filter(point => Math.max(Math.abs(point.x - bed.x), Math.abs(point.y - bed.y)) === 1 && !contacts.has(periopPointKey(point)))
    .sort((a, b) => Math.abs(a.x - bed.x) + Math.abs(a.y - bed.y) - Math.abs(b.x - bed.x) - Math.abs(b.y - bed.y) || a.y - b.y || a.x - b.x);
}

/** Geometry only, bounded by the existing room/door/definition cache. Occupancy
 * never enters this cache, and callers cannot mutate its points or key sets. */
export function getPeriopWorkingSpace(state: GameState, roomId: string, context: DomainContext): WorkingSpace | null {
  const reader = facilityDefinitionReader(context);
  const layout = layouts(state.rooms, state.doors, reader, () => {
    const rooms = new Map(state.rooms.map(room => [room.id, room]));
    const thresholds = new Set<string>();
    for (const door of state.doors) {
      const room = rooms.get(door.roomId), definition = room && reader(room.roomDefinitionId);
      const cells = room && definition && getDoorCells(door, room, definition);
      if (cells) { thresholds.add(periopPointKey(cells.inside)); thresholds.add(periopPointKey(cells.outside)); }
    }
    return { thresholds, rooms: new Map() };
  });
  const known = layout.rooms.get(roomId);
  if (known) return known;
  const room = state.rooms.find(room => room.id === roomId);
  const definition = room && getRoomDefinition(room.roomDefinitionId, context);
  if (!room || !definition || room.roomDefinitionId !== "room.periop_recovery") return null;
  const stations = getRoomCareStations(room, definition, state.doors, state.rooms, reader);
  const navigable = getRoomNavigableTiles(room, definition, state.doors, state.rooms, reader);
  const patientKeys = stations.map(station => periopPointKey(station.patientAnchor));
  const contacts = new Set([...patientKeys, ...layout.thresholds, ...(definition.navigation?.endpointOnlyTiles ?? []).map(point => {
    const local = rotateRoomLocalPoint(point, definition, room.orientation);
    return periopPointKey({ x: room.x + local.x, y: room.y + local.y });
  })]);
  const beds = new Map(stations.map(station => [periopPointKey(station.patientAnchor), bedside(navigable, contacts, station.patientAnchor)]));
  const workingKeys = new Set([...beds.values()].flatMap(points => points.map(periopPointKey)));
  const excluded = new Set([...patientKeys, ...layout.thresholds, periopPointKey(getRoomNavigationAnchor(room, definition, "staff")), periopPointKey(getRoomSharedStaffAnchor(room, definition))]);
  const supportPoints = navigable.filter(point => !excluded.has(periopPointKey(point)) && !workingKeys.has(periopPointKey(point)));
  const seatSupports = getRoomCompanionSeats(room, definition, state.doors, state.rooms, reader).map(seat => seat.anchor)
    .filter(point => !excluded.has(periopPointKey(point)) && !workingKeys.has(periopPointKey(point)));
  const nodes = new Map(navigable.map(point => [periopPointKey(point), point])), edges = new Map<string, Set<string>>();
  const connect = (a: GridPoint, b: GridPoint) => {
    const ak = periopPointKey(a), bk = periopPointKey(b);
    nodes.set(ak, a); nodes.set(bk, b);
    const from = edges.get(ak) ?? new Set<string>(), to = edges.get(bk) ?? new Set<string>();
    from.add(bk); to.add(ak); edges.set(ak, from); edges.set(bk, to);
  };
  for (const point of navigable) for (const step of [{ x: 0, y: -1 }, { x: -1, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }]) {
    const next = nodes.get(periopPointKey({ x: point.x + step.x, y: point.y + step.y }));
    if (next) connect(point, next);
  }
  // spatial.ts already recognizes the clear diagonal behind each paired
  // peri-op corner armchair for corner-door access. Use that same in-room
  // approach for a support behind the chairs too. Split it into unit-distance
  // half-steps so ordinary path-index travel never banks or skips distance.
  const seats = new Set((definition.navigation?.companionSeats ?? []).map(seat => {
    const local = rotateRoomLocalPoint(seat.anchor, definition, room.orientation);
    return periopPointKey({ x: room.x + local.x, y: room.y + local.y });
  }));
  const approaches = new Map<string, readonly GridPoint[]>();
  const size = getRotatedFootprint(definition, room.orientation);
  for (const x of [0, size.width - 1]) for (const y of [0, size.height - 1]) {
    const corner = { x: room.x + x, y: room.y + y }, dx = x === 0 ? 1 : -1, dy = y === 0 ? 1 : -1;
    const inside = { x: corner.x + dx, y: corner.y + dy };
    if (nodes.has(periopPointKey(corner)) && nodes.has(periopPointKey(inside)) &&
      seats.has(periopPointKey({ x: corner.x + dx, y: corner.y })) && seats.has(periopPointKey({ x: corner.x, y: corner.y + dy }))) {
      const middle = { x: corner.x + dx / 2, y: corner.y + dy / 2 };
      connect(corner, middle); connect(middle, inside);
      approaches.set(periopPointKey(corner), [inside, middle, corner]);
    }
  }
  const space = { navigable, contacts, beds, workingKeys, supportPoints, seatSupports, supportKeys: new Set([...supportPoints, ...seatSupports].map(periopPointKey)), nodes, edges, approaches, paths: new Map<string, readonly GridPoint[]>() };
  layout.rooms.set(roomId, space);
  return space;
}

/** An arriving actor uses its existing doorway/sidewalk route to the corner's
 * clear aisle, then the same bounded support approach used by onsite actors. */
export function routePeriopSupport(state: GameState, roomId: string, start: GridPoint, target: GridPoint, context: DomainContext,
  route: (start: GridPoint, target: GridPoint) => GridPoint[]): GridPoint[] {
  const local = findPeriopSupportPath(state, roomId, start, target, context);
  if (local.length) return local;
  const direct = routeFromPeriopSupport(state, roomId, start, context, point => route(point, target));
  if (direct.length) return direct;
  const approach = getPeriopWorkingSpace(state, roomId, context)?.approaches.get(periopPointKey(target));
  if (!approach) return [];
  const prefix = route(start, approach[0]!);
  return prefix.length ? [...prefix, ...approach.slice(1).map(point => ({ ...point }))] : [];
}

/** Leave a corner support through the same authored clearance used on arrival.
 * The original route still owns doors, sidewalks and the off-map endpoint. */
export function routeFromPeriopSupport(state: GameState, roomId: string, start: GridPoint, context: DomainContext,
  route: (start: GridPoint) => GridPoint[]): GridPoint[] {
  const direct = route(start);
  if (direct.length) return direct;
  const approach = [...getPeriopWorkingSpace(state, roomId, context)?.approaches.values() ?? []]
    .find(points => points.slice(1).some(point => periopPointKey(point) === periopPointKey(start)));
  if (!approach) return [];
  const prefix = findPeriopSupportPath(state, roomId, start, approach[0]!, context);
  const tail = route(approach[0]!);
  return prefix.length && tail.length ? [...prefix, ...tail.slice(1)] : [];
}

/** Yield spare travel budget before a nursing aisle when possible. A run of
 * bedside tiles must still permit through-travel, rather than freeze arrival. */
export function periopSupportPathIndex(state: GameState, roomId: string, path: readonly GridPoint[], index: number, steps: number, context: DomainContext): number {
  const furthest = Math.min(path.length - 1, index + steps);
  let next = furthest;
  const working = getPeriopWorkingSpace(state, roomId, context)?.workingKeys;
  while (next > index && working?.has(periopPointKey(path[next]!))) next--;
  return next > index ? next : furthest;
}

/** At most the room's authored nodes and four corner approaches. No facility
 * search, wall crossing or newly walkable furniture tile is introduced. */
export function findPeriopSupportPath(state: GameState, roomId: string, start: GridPoint, target: GridPoint, context: DomainContext): GridPoint[] {
  const space = getPeriopWorkingSpace(state, roomId, context);
  const from = periopPointKey(start), goal = periopPointKey(target);
  if (!space?.nodes.has(from) || !space.nodes.has(goal)) return [];
  const key = `${from}>${goal}`, cached = space.paths.get(key);
  if (cached) return cached.map(point => ({ ...point }));
  const queue = [from], prior = new Map<string, string | null>([[from, null]]);
  for (let index = 0; index < queue.length; index++) {
    const current = queue[index]!;
    if (current === goal) {
      const path: GridPoint[] = []; let cursor: string | null = current;
      while (cursor !== null) { path.push({ ...space.nodes.get(cursor)! }); cursor = prior.get(cursor) ?? null; }
      path.reverse(); space.paths.set(key, path); return path.map(point => ({ ...point }));
    }
    for (const next of space.edges.get(current) ?? []) if (!prior.has(next)) { prior.set(next, current); queue.push(next); }
  }
  space.paths.set(key, []); return [];
}

/** Return independent points, preserving the existing authored bedside order. */
export function getPeriopBedWorkingPoints(state: GameState, roomId: string, endpoint: GridPoint, context: DomainContext): GridPoint[] {
  const space = getPeriopWorkingSpace(state, roomId, context);
  return space ? (space.beds.get(periopPointKey(endpoint)) ?? bedside(space.navigable, space.contacts, endpoint)).map(point => ({ ...point })) : [];
}

/** Current positions and accepted destinations remain claims while an actor is
 * walking. Include retained family checkpoints, even before their route starts. */
export function periopVisitorClaims(state: GameState, actorId: string): Set<string> {
  const points: Array<GridPoint | null | undefined> = [state.environment.founderLocation, state.environment.founderActivity?.path.at(-1)];
  for (const encounter of Object.values(state.encounters)) points.push(encounter.patientLocation, encounter.patientMovement?.path.at(-1), encounter.waitingDestination?.location);
  for (const employee of state.employees) points.push(employee.location, employee.path.at(-1));
  for (const operation of state.serviceOperations) if (operation.status !== "completed" && operation.status !== "cancelled") points.push(operation.location, operation.path.at(-1));
  for (const actor of state.retailExternalActors) if (actor.id !== actorId && actor.lifecycle !== "departed") points.push(actor.location, actor.path.at(-1), actor.procedureCompanion?.waitingReservation?.location);
  for (const family of Object.values(state.pediatricFamilies ?? {})) if (family.parentActorId !== actorId && family.procedureFlow?.parentCheckpoint &&
    state.retailExternalActors.some(actor => actor.id === family.parentActorId && actor.lifecycle !== "departed")) points.push(family.procedureFlow.parentCheckpoint.location);
  for (const trip of state.retailOperations) if (!["completed", "cancelled", "abandoned"].includes(trip.status)) points.push(trip.location, trip.path.at(-1));
  return new Set(points.filter((point): point is GridPoint => Boolean(point)).map(periopPointKey));
}
