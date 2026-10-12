import { getDoorCells } from "./doors";
import { APPROVED_PEDIATRIC_SUPPORT_ROUTES } from "@gamify-surgery/balance-config";
import { findDeterministicFacilityPath, getOccupiedTiles, getRoomNavigationAnchor } from "./spatial";
import { findCareAwareFacilityPath } from "./care-room-access";
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
  return findRouteFromDisplacedLocationToPoint(state, context, start, goal, new Set([room.id]));
}

export function findRouteFromDisplacedLocationToPoint(
  state: GameState,
  context: DomainContext,
  start: GridPoint,
  goal: GridPoint,
  allowedProtectedRoomInstanceIds: ReadonlySet<string> = new Set(),
): GridPoint[] {
  // A native pediatric furniture endpoint is fractional. Leave via its exact
  // approved approach before returning to the integer facility graph. This
  // also serves APP training, return-home and dismissal paths.
  if (!Number.isInteger(start.x) || !Number.isInteger(start.y)) {
    const room = state.rooms.find(row => {
      const def = definition(context, row.roomDefinitionId);
      return def && row.orientation === 0 && start.x + .5 >= row.x && start.x + .5 < row.x + def.width &&
        start.y + .5 >= row.y && start.y + .5 < row.y + def.height;
    });
    const nativeRoutes = room && (APPROVED_PEDIATRIC_SUPPORT_ROUTES as Record<string, Array<{ doorSegment: string; walkingPath: number[][] }>>)[room.roomDefinitionId];
    if (!room || !nativeRoutes) return [];
    for (const door of state.doors.filter(row => row.roomId === room.id && !row.exterior)) {
      const cells = getDoorCells(door, room, definition(context, room.roomDefinitionId)!);
      if (!cells) continue;
      const doorSegment = `${{ north: "N", east: "E", south: "S", west: "W" }[door.side]}${["east", "west"].includes(door.side) ? String.fromCharCode(65 + door.offset) : door.offset + 1}`;
      for (const route of nativeRoutes.filter(row => row.doorSegment === doorSegment)) {
        const points = route.walkingPath.map(point => ({ x: room.x + point[0]! - .5, y: room.y + point[1]! - .5 }));
        const index = points.findIndex(point => Math.abs(point.x - start.x) < .00001 && Math.abs(point.y - start.y) < .00001);
        if (index < 0) continue;
        const tail = findRouteFromDisplacedLocationToPoint(state, context, cells.outside, goal, allowedProtectedRoomInstanceIds);
        if (tail.length) return [...points.slice(0, index + 1).reverse(), ...tail];
      }
    }
    return [];
  }
  const ordinary = findCareAwareFacilityPath(state, context, start, goal, allowedProtectedRoomInstanceIds);
  if (ordinary.length > 0) return ordinary;
  const publicEntrance = entrance(state, context);
  if (!publicEntrance) return [];
  const exposed = grassPath(state, context, start, publicEntrance.outside);
  if (exposed.length === 0) return [];
  const internal = findCareAwareFacilityPath(state, context, publicEntrance.inside, goal, allowedProtectedRoomInstanceIds);
  return internal.length > 0 ? [...exposed, publicEntrance.inside, ...internal.slice(1)] : [];
}

export function findRouteFromDisplacedLocationOffscreen(
  state: GameState,
  context: DomainContext,
  start: GridPoint,
): GridPoint[] {
  const publicEntrance = entrance(state, context);
  if (!publicEntrance) return [];
  // An actor already on the street row, or beyond either map edge, is still
  // arriving or leaving. It walks along the sidewalk to the nearer edge
  // instead of first returning to the front door.
  const { gridWidth, gridHeight } = context.balanceRelease.facility;
  if (start.y >= gridHeight || start.x < 0 || start.x >= gridWidth) {
    const streetEndX = start.x < gridWidth / 2 ? -2 : gridWidth + 1;
    const toStreet = [{ ...start }];
    while (toStreet.at(-1)!.y !== publicEntrance.outside.y) {
      const last = toStreet.at(-1)!;
      toStreet.push({ x: last.x, y: last.y + Math.sign(publicEntrance.outside.y - last.y) });
    }
    return [...toStreet, ...sidewalkPath(toStreet.at(-1)!, streetEndX).slice(1)];
  }
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
  const ordinary = !Number.isInteger(start.x) || !Number.isInteger(start.y)
    ? findRouteFromDisplacedLocationToPoint(state, context, start, publicEntrance.inside)
    : findDeterministicFacilityPath(
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
