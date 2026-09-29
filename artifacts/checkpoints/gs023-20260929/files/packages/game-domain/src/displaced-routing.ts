import { getDoorCells } from "./doors";
import { findDeterministicFacilityPath, getOccupiedTiles, getRoomNavigationAnchor } from "./spatial";
import type { DomainContext, GameState, GridPoint } from "./types";

const STEPS = [{ x: 0, y: -1 }, { x: -1, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }] as const;
const key = (point: GridPoint) => `${point.x},${point.y}`;

function definition(context: DomainContext, id: string) {
  return context.balanceRelease.facility.roomDefinitions.find((candidate) => candidate.id === id) ?? null;
}

function entrance(state: GameState, context: DomainContext) {
  const door = state.doors.find((candidate) => candidate.exterior);
  const room = door ? state.rooms.find((candidate) => candidate.id === door.roomId) : null;
  const roomDefinition = room ? definition(context, room.roomDefinitionId) : null;
  const cells = door && room && roomDefinition ? getDoorCells(door, room, roomDefinition) : null;
  return cells ? { inside: cells.inside, outside: cells.outside } : null;
}

function grassPath(state: GameState, context: DomainContext, start: GridPoint, goal: GridPoint): GridPoint[] {
  const occupied = new Set(state.rooms.flatMap((room) => {
    const roomDefinition = definition(context, room.roomDefinitionId);
    return roomDefinition ? getOccupiedTiles(room, roomDefinition).map(key) : [];
  }));
  if (occupied.has(key(start))) return [];
  const minX = 0;
  const maxX = context.balanceRelease.facility.gridWidth - 1;
  const minY = 0;
  const maxY = context.balanceRelease.facility.gridHeight;
  const queue: GridPoint[] = [{ ...start }];
  const parent = new Map<string, string | null>([[key(start), null]]);
  const points = new Map<string, GridPoint>([[key(start), { ...start }]]);
  for (let index = 0; index < queue.length; index += 1) {
    const current = queue[index]!;
    if (current.x === goal.x && current.y === goal.y) {
      const path: GridPoint[] = [];
      let cursor: string | null = key(current);
      while (cursor) {
        path.push({ ...points.get(cursor)! });
        cursor = parent.get(cursor) ?? null;
      }
      return path.reverse();
    }
    for (const step of STEPS) {
      const next = { x: current.x + step.x, y: current.y + step.y };
      const nextKey = key(next);
      if (next.x < minX || next.x > maxX || next.y < minY || next.y > maxY ||
        occupied.has(nextKey) || parent.has(nextKey)) continue;
      parent.set(nextKey, key(current));
      points.set(nextKey, next);
      queue.push(next);
    }
  }
  return [];
}

function sidewalkPath(start: GridPoint, endX: number): GridPoint[] {
  const path = [{ ...start }];
  let x = start.x;
  while (x !== endX) {
    x += Math.sign(endX - x);
    path.push({ x, y: start.y });
  }
  return path;
}

export function findRouteFromDisplacedLocationToRoom(
  state: GameState,
  context: DomainContext,
  start: GridPoint,
  roomId: string,
): GridPoint[] {
  const room = state.rooms.find((candidate) => candidate.id === roomId);
  const roomDefinition = room ? definition(context, room.roomDefinitionId) : null;
  if (!room || !roomDefinition) return [];
  const goal = getRoomNavigationAnchor(room, roomDefinition, "staff");
  const ordinary = findDeterministicFacilityPath(start, goal, state.rooms, state.doors, (id) => definition(context, id));
  if (ordinary.length > 0) return ordinary;
  const publicEntrance = entrance(state, context);
  if (!publicEntrance) return [];
  const exposed = grassPath(state, context, start, publicEntrance.outside);
  if (exposed.length === 0) return [];
  const internal = findDeterministicFacilityPath(publicEntrance.inside, goal, state.rooms, state.doors, (id) => definition(context, id));
  return internal.length > 0 ? [...exposed, publicEntrance.inside, ...internal.slice(1)] : [];
}

export function findRouteFromDisplacedLocationToPoint(
  state: GameState,
  context: DomainContext,
  start: GridPoint,
  goal: GridPoint,
): GridPoint[] {
  const ordinary = findDeterministicFacilityPath(start, goal, state.rooms, state.doors, (id) => definition(context, id));
  if (ordinary.length > 0) return ordinary;
  const publicEntrance = entrance(state, context);
  if (!publicEntrance) return [];
  const exposed = grassPath(state, context, start, publicEntrance.outside);
  if (exposed.length === 0) return [];
  const internal = findDeterministicFacilityPath(publicEntrance.inside, goal, state.rooms, state.doors, (id) => definition(context, id));
  return internal.length > 0 ? [...exposed, publicEntrance.inside, ...internal.slice(1)] : [];
}

export function findRouteFromDisplacedLocationOffscreen(
  state: GameState,
  context: DomainContext,
  start: GridPoint,
): GridPoint[] {
  const publicEntrance = entrance(state, context);
  if (!publicEntrance) return [];
  const toSidewalk = findRouteFromDisplacedLocationToPublicEntrance(state, context, start);
  if (toSidewalk.length === 0) return [];
  const endX = start.x < context.balanceRelease.facility.gridWidth / 2
    ? -2
    : context.balanceRelease.facility.gridWidth + 1;
  return [...toSidewalk, ...sidewalkPath(publicEntrance.outside, endX).slice(1)];
}

export function findRouteFromDisplacedLocationToPublicEntrance(
  state: GameState,
  context: DomainContext,
  start: GridPoint,
): GridPoint[] {
  const publicEntrance = entrance(state, context);
  if (!publicEntrance) return [];
  const ordinary = findDeterministicFacilityPath(
    start,
    publicEntrance.inside,
    state.rooms,
    state.doors,
    (id) => definition(context, id),
  );
  return ordinary.length > 0
    ? [...ordinary, publicEntrance.outside]
    : grassPath(state, context, start, publicEntrance.outside);
}
