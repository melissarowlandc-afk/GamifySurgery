import type { RoomDefinition } from "@gamify-surgery/balance-config";
import type {
  CardinalDirection,
  GridPoint,
  PlacedRoom,
  RoomOrientation,
} from "./types";

const CARDINAL_STEPS: ReadonlyArray<GridPoint> = [
  { x: 0, y: -1 },
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: -1, y: 0 },
];

function pointKey(point: GridPoint): string {
  return `${point.x},${point.y}`;
}

function parsePointKey(key: string): GridPoint {
  const [x, y] = key.split(",").map(Number);
  return { x: x!, y: y! };
}

export function rotateDirection(
  direction: CardinalDirection,
  orientation: RoomOrientation,
): CardinalDirection {
  const directions: CardinalDirection[] = [
    "north",
    "east",
    "south",
    "west",
  ];
  const start = directions.indexOf(direction);
  const turns = orientation / 90;
  return directions[(start + turns) % directions.length]!;
}

export function getRotatedFootprint(
  definition: Pick<RoomDefinition, "width" | "height">,
  orientation: RoomOrientation,
): { width: number; height: number } {
  return orientation === 90 || orientation === 270
    ? { width: definition.height, height: definition.width }
    : { width: definition.width, height: definition.height };
}

export function getRoomDoorCell(
  room: PlacedRoom,
  definition: RoomDefinition,
): GridPoint | null {
  if (room.doorSide === null || definition.kind === "hallway") {
    return null;
  }
  const { width, height } = getRotatedFootprint(
    definition,
    room.orientation,
  );
  if (room.doorSide === "north") {
    return { x: room.x + Math.floor((width - 1) / 2), y: room.y };
  }
  if (room.doorSide === "south") {
    return {
      x: room.x + Math.floor((width - 1) / 2),
      y: room.y + height - 1,
    };
  }
  if (room.doorSide === "west") {
    return { x: room.x, y: room.y + Math.floor((height - 1) / 2) };
  }
  return {
    x: room.x + width - 1,
    y: room.y + Math.floor((height - 1) / 2),
  };
}

export function getRoomDoorApproachCell(
  room: PlacedRoom,
  definition: RoomDefinition,
): GridPoint | null {
  const door = getRoomDoorCell(room, definition);
  if (!door || room.doorSide === null) {
    return null;
  }
  const offset =
    room.doorSide === "north"
      ? { x: 0, y: -1 }
      : room.doorSide === "east"
        ? { x: 1, y: 0 }
        : room.doorSide === "south"
          ? { x: 0, y: 1 }
          : { x: -1, y: 0 };
  return { x: door.x + offset.x, y: door.y + offset.y };
}

export function getRoomCenter(
  room: PlacedRoom,
  definition: RoomDefinition,
): GridPoint {
  const { width, height } = getRotatedFootprint(
    definition,
    room.orientation,
  );
  return {
    x: room.x + Math.floor((width - 1) / 2),
    y: room.y + Math.floor((height - 1) / 2),
  };
}

export function getOccupiedTiles(
  room: PlacedRoom,
  definition: RoomDefinition,
): GridPoint[] {
  const { width, height } = getRotatedFootprint(
    definition,
    room.orientation,
  );
  const points: GridPoint[] = [];
  for (let y = room.y; y < room.y + height; y += 1) {
    for (let x = room.x; x < room.x + width; x += 1) {
      points.push({ x, y });
    }
  }
  return points;
}

export function roomsOverlap(
  left: PlacedRoom,
  leftDefinition: RoomDefinition,
  right: PlacedRoom,
  rightDefinition: RoomDefinition,
): boolean {
  const leftSize = getRotatedFootprint(leftDefinition, left.orientation);
  const rightSize = getRotatedFootprint(rightDefinition, right.orientation);
  return (
    left.x < right.x + rightSize.width &&
    left.x + leftSize.width > right.x &&
    left.y < right.y + rightSize.height &&
    left.y + leftSize.height > right.y
  );
}

export function isInsideFacility(
  room: PlacedRoom,
  definition: RoomDefinition,
  width: number,
  height: number,
): boolean {
  const footprint = getRotatedFootprint(definition, room.orientation);
  return (
    room.x >= 0 &&
    room.y >= 0 &&
    room.x + footprint.width <= width &&
    room.y + footprint.height <= height
  );
}

function hallwayTileKeys(
  rooms: readonly PlacedRoom[],
  getDefinition: (definitionId: string) => RoomDefinition | null,
): Set<string> {
  const keys = new Set<string>();
  for (const room of rooms) {
    const definition = getDefinition(room.roomDefinitionId);
    if (definition?.kind !== "hallway") {
      continue;
    }
    for (const tile of getOccupiedTiles(room, definition)) {
      keys.add(pointKey(tile));
    }
  }
  return keys;
}

export function getHallwayTileKeys(
  rooms: readonly PlacedRoom[],
  getDefinition: (definitionId: string) => RoomDefinition | null,
): Set<string> {
  return hallwayTileKeys(rooms, getDefinition);
}

function floodConnectedTiles(
  allowed: ReadonlySet<string>,
  starts: readonly GridPoint[],
): Set<string> {
  const visited = new Set<string>();
  const queue: GridPoint[] = [];
  for (const start of starts) {
    const key = pointKey(start);
    if (allowed.has(key) && !visited.has(key)) {
      visited.add(key);
      queue.push(start);
    }
  }
  while (queue.length > 0) {
    const current = queue.shift()!;
    for (const step of CARDINAL_STEPS) {
      const next = { x: current.x + step.x, y: current.y + step.y };
      const key = pointKey(next);
      if (allowed.has(key) && !visited.has(key)) {
        visited.add(key);
        queue.push(next);
      }
    }
  }
  return visited;
}

export interface FacilityConnectivityResult {
  connected: boolean;
  disconnectedRoomIds: string[];
  disconnectedHallwayTiles: GridPoint[];
}

export function validateFacilityConnectivity(
  rooms: readonly PlacedRoom[],
  getDefinition: (definitionId: string) => RoomDefinition | null,
  protectedRoomDefinitionIds: ReadonlySet<string>,
): FacilityConnectivityResult {
  const hallwayKeys = hallwayTileKeys(rooms, getDefinition);
  const protectedDoorApproaches = rooms.flatMap((room) => {
    const definition = getDefinition(room.roomDefinitionId);
    if (
      !definition ||
      !protectedRoomDefinitionIds.has(room.roomDefinitionId)
    ) {
      return [];
    }
    const approach = getRoomDoorApproachCell(room, definition);
    return approach ? [approach] : [];
  });
  const connectedHallways = floodConnectedTiles(
    hallwayKeys,
    protectedDoorApproaches,
  );
  const disconnectedRoomIds: string[] = [];

  for (const room of rooms) {
    const definition = getDefinition(room.roomDefinitionId);
    if (
      !definition ||
      definition.kind === "hallway" ||
      protectedRoomDefinitionIds.has(room.roomDefinitionId)
    ) {
      continue;
    }
    const approach = getRoomDoorApproachCell(room, definition);
    if (!approach || !connectedHallways.has(pointKey(approach))) {
      disconnectedRoomIds.push(room.id);
    }
  }

  const disconnectedHallwayTiles = [...hallwayKeys]
    .filter((key) => !connectedHallways.has(key))
    .map(parsePointKey);
  return {
    connected:
      disconnectedRoomIds.length === 0 &&
      disconnectedHallwayTiles.length === 0,
    disconnectedRoomIds,
    disconnectedHallwayTiles,
  };
}

export function findDeterministicPath(
  start: GridPoint,
  goal: GridPoint,
  walkableTiles: ReadonlySet<string>,
): GridPoint[] {
  const startKey = pointKey(start);
  const goalKey = pointKey(goal);
  if (!walkableTiles.has(startKey) || !walkableTiles.has(goalKey)) {
    return [];
  }
  const queue: GridPoint[] = [start];
  const parent = new Map<string, string | null>([[startKey, null]]);
  while (queue.length > 0) {
    const current = queue.shift()!;
    const currentKey = pointKey(current);
    if (currentKey === goalKey) {
      const reversed: GridPoint[] = [];
      let cursor: string | null = currentKey;
      while (cursor !== null) {
        reversed.push(parsePointKey(cursor));
        cursor = parent.get(cursor) ?? null;
      }
      return reversed.reverse();
    }
    for (const step of CARDINAL_STEPS) {
      const next = { x: current.x + step.x, y: current.y + step.y };
      const nextKey = pointKey(next);
      if (walkableTiles.has(nextKey) && !parent.has(nextKey)) {
        parent.set(nextKey, currentKey);
        queue.push(next);
      }
    }
  }
  return [];
}

function appendWithoutDuplicate(
  target: GridPoint[],
  points: readonly GridPoint[],
): void {
  for (const point of points) {
    const previous = target.at(-1);
    if (!previous || previous.x !== point.x || previous.y !== point.y) {
      target.push({ ...point });
    }
  }
}

function findOpenGridPath(start: GridPoint, goal: GridPoint): GridPoint[] {
  const path: GridPoint[] = [{ ...start }];
  let cursor = { ...start };
  while (cursor.x !== goal.x) {
    cursor = {
      x: cursor.x + Math.sign(goal.x - cursor.x),
      y: cursor.y,
    };
    path.push(cursor);
  }
  while (cursor.y !== goal.y) {
    cursor = {
      x: cursor.x,
      y: cursor.y + Math.sign(goal.y - cursor.y),
    };
    path.push(cursor);
  }
  return path;
}

/**
 * Finds a stable door-to-hallway route between two room instances.
 *
 * Room interiors are traversed only between their center and explicit door;
 * the portion between door approaches is restricted to placed hallway tiles.
 */
export function findDeterministicRoomPath(
  origin: PlacedRoom,
  destination: PlacedRoom,
  getDefinition: (definitionId: string) => RoomDefinition | null,
  rooms: readonly PlacedRoom[],
): GridPoint[] {
  const originDefinition = getDefinition(origin.roomDefinitionId);
  const destinationDefinition = getDefinition(
    destination.roomDefinitionId,
  );
  if (!originDefinition || !destinationDefinition) {
    return [];
  }
  if (origin.id === destination.id) {
    return [getRoomCenter(origin, originDefinition)];
  }
  const originDoor = getRoomDoorCell(origin, originDefinition);
  const originApproach = getRoomDoorApproachCell(origin, originDefinition);
  const destinationDoor = getRoomDoorCell(
    destination,
    destinationDefinition,
  );
  const destinationApproach = getRoomDoorApproachCell(
    destination,
    destinationDefinition,
  );
  if (
    !originDoor ||
    !originApproach ||
    !destinationDoor ||
    !destinationApproach
  ) {
    return [];
  }
  const hallwayPath = findDeterministicPath(
    originApproach,
    destinationApproach,
    hallwayTileKeys(rooms, getDefinition),
  );
  if (hallwayPath.length === 0) {
    return [];
  }
  const path: GridPoint[] = [];
  appendWithoutDuplicate(
    path,
    findOpenGridPath(
      getRoomCenter(origin, originDefinition),
      originDoor,
    ),
  );
  appendWithoutDuplicate(path, hallwayPath);
  appendWithoutDuplicate(
    path,
    findOpenGridPath(
      destinationDoor,
      getRoomCenter(destination, destinationDefinition),
    ),
  );
  return path;
}

export function getFacilityWalkableTileKeys(
  rooms: readonly PlacedRoom[],
  getDefinition: (definitionId: string) => RoomDefinition | null,
): Set<string> {
  const walkable = hallwayTileKeys(rooms, getDefinition);
  for (const room of rooms) {
    const definition = getDefinition(room.roomDefinitionId);
    if (!definition || definition.kind === "hallway") {
      continue;
    }
    for (const point of getOccupiedTiles(room, definition)) {
      walkable.add(pointKey(point));
    }
    const approach = getRoomDoorApproachCell(room, definition);
    if (approach) {
      walkable.add(pointKey(approach));
    }
  }
  return walkable;
}
