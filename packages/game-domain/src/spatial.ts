import type { RoomDefinition } from "@gamify-surgery/balance-config";
import type {
  CardinalDirection,
  DoorState,
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

function roomNodeKey(roomId: string): string {
  return `room:${roomId}`;
}

function hallwayNodeKey(point: GridPoint | string): string {
  return `hallway:${typeof point === "string" ? point : pointKey(point)}`;
}

function connectNodes(
  adjacency: Map<string, Set<string>>,
  left: string,
  right: string,
): void {
  const leftNeighbors = adjacency.get(left) ?? new Set<string>();
  const rightNeighbors = adjacency.get(right) ?? new Set<string>();
  leftNeighbors.add(right);
  rightNeighbors.add(left);
  adjacency.set(left, leftNeighbors);
  adjacency.set(right, rightNeighbors);
}

function floodConnectedNodes(
  adjacency: ReadonlyMap<string, ReadonlySet<string>>,
  starts: readonly string[],
): Set<string> {
  const visited = new Set<string>();
  const queue: string[] = [];
  for (const start of starts) {
    if (adjacency.has(start) && !visited.has(start)) {
      visited.add(start);
      queue.push(start);
    }
  }
  while (queue.length > 0) {
    const current = queue.shift()!;
    for (const next of adjacency.get(current) ?? []) {
      if (!visited.has(next)) {
        visited.add(next);
        queue.push(next);
      }
    }
  }
  return visited;
}

function pointIsInsideRoom(
  point: GridPoint,
  room: PlacedRoom,
  definition: RoomDefinition,
): boolean {
  const { width, height } = getRotatedFootprint(
    definition,
    room.orientation,
  );
  return (
    point.x >= room.x &&
    point.x < room.x + width &&
    point.y >= room.y &&
    point.y < room.y + height
  );
}

/**
 * Placement-time entrance rule.
 *
 * Existing rooms may remain reachable through an entrance cut by a newer
 * neighboring room or hallway. A newly placed clinical room, however, must
 * use its own visible, rotated door to join the existing facility. Keeping
 * this separate from whole-facility validation makes rotation meaningful
 * without making later remodeling unnecessarily brittle.
 */
export function isPlacementAttachedThroughOwnEntrance(
  candidate: PlacedRoom,
  candidateDefinition: RoomDefinition,
  existingRooms: readonly PlacedRoom[],
  getDefinition: (definitionId: string) => RoomDefinition | null,
): boolean {
  if (candidateDefinition.kind !== "hallway") {
    const approach = getRoomDoorApproachCell(candidate, candidateDefinition);
    if (!approach) {
      return false;
    }
    return existingRooms.some((room) => {
      const definition = getDefinition(room.roomDefinitionId);
      if (!definition) {
        return false;
      }
      return definition.kind === "hallway"
        ? getOccupiedTiles(room, definition).some(
            (tile) => pointKey(tile) === pointKey(approach),
          )
        : pointIsInsideRoom(approach, room, definition);
    });
  }

  const existingHallways = hallwayTileKeys(existingRooms, getDefinition);
  const existingClinicalRooms = existingRooms.flatMap((room) => {
    const definition = getDefinition(room.roomDefinitionId);
    return definition && definition.kind !== "hallway"
      ? [{ room, definition }]
      : [];
  });
  return getOccupiedTiles(candidate, candidateDefinition).some((tile) =>
    CARDINAL_STEPS.some((step) => {
      const neighbor = { x: tile.x + step.x, y: tile.y + step.y };
      return (
        existingHallways.has(pointKey(neighbor)) ||
        existingClinicalRooms.some(({ room, definition }) =>
          pointIsInsideRoom(neighbor, room, definition),
        )
      );
    }),
  );
}

/**
 * A placed room owns one author-controlled, rotatable door. That door may
 * open into an adjacent room without requiring the host room to spend its own
 * door on the same threshold. This lets an existing room accept several
 * future connections while every newly placed room still has an explicit,
 * visible entrance.
 */
function roomsConnectDirectly(
  left: PlacedRoom,
  leftDefinition: RoomDefinition,
  right: PlacedRoom,
  rightDefinition: RoomDefinition,
): boolean {
  const leftApproach = getRoomDoorApproachCell(left, leftDefinition);
  const rightApproach = getRoomDoorApproachCell(right, rightDefinition);
  return (
    (leftApproach !== null &&
      pointIsInsideRoom(leftApproach, right, rightDefinition)) ||
    (rightApproach !== null &&
      pointIsInsideRoom(rightApproach, left, leftDefinition))
  );
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
  const adjacency = new Map<string, Set<string>>();
  for (const hallwayKey of hallwayKeys) {
    const hallwayNode = hallwayNodeKey(hallwayKey);
    adjacency.set(hallwayNode, adjacency.get(hallwayNode) ?? new Set());
    const hallwayPoint = parsePointKey(hallwayKey);
    for (const step of CARDINAL_STEPS) {
      const neighbor = {
        x: hallwayPoint.x + step.x,
        y: hallwayPoint.y + step.y,
      };
      if (hallwayKeys.has(pointKey(neighbor))) {
        connectNodes(adjacency, hallwayNode, hallwayNodeKey(neighbor));
      }
    }
  }

  const doorRooms = rooms.flatMap((room) => {
    const definition = getDefinition(room.roomDefinitionId);
    if (!definition || definition.kind === "hallway") {
      return [];
    }
    const node = roomNodeKey(room.id);
    adjacency.set(node, adjacency.get(node) ?? new Set());
    const approach = getRoomDoorApproachCell(room, definition);
    if (approach && hallwayKeys.has(pointKey(approach))) {
      connectNodes(adjacency, node, hallwayNodeKey(approach));
    }
    // A hallway placed against a room cuts an inbound threshold at that
    // shared wall. This keeps hallways useful after rooms have already been
    // connected directly and permits later branching/remodeling.
    for (const tile of getOccupiedTiles(room, definition)) {
      for (const step of CARDINAL_STEPS) {
        const neighborKey = pointKey({
          x: tile.x + step.x,
          y: tile.y + step.y,
        });
        if (hallwayKeys.has(neighborKey)) {
          connectNodes(adjacency, node, hallwayNodeKey(neighborKey));
        }
      }
    }
    return [{ room, definition }];
  });

  for (let leftIndex = 0; leftIndex < doorRooms.length; leftIndex += 1) {
    const left = doorRooms[leftIndex]!;
    for (
      let rightIndex = leftIndex + 1;
      rightIndex < doorRooms.length;
      rightIndex += 1
    ) {
      const right = doorRooms[rightIndex]!;
      if (
        roomsConnectDirectly(
          left.room,
          left.definition,
          right.room,
          right.definition,
        )
      ) {
        connectNodes(
          adjacency,
          roomNodeKey(left.room.id),
          roomNodeKey(right.room.id),
        );
      }
    }
  }

  const connectedNodes = floodConnectedNodes(
    adjacency,
    doorRooms
      .filter(({ room }) =>
        protectedRoomDefinitionIds.has(room.roomDefinitionId),
      )
      .map(({ room }) => roomNodeKey(room.id)),
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
    if (!connectedNodes.has(roomNodeKey(room.id))) {
      disconnectedRoomIds.push(room.id);
    }
  }

  const disconnectedHallwayTiles = [...hallwayKeys]
    .filter((key) => !connectedNodes.has(hallwayNodeKey(key)))
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

function tileAdjacencyForFacility(
  rooms: readonly PlacedRoom[],
  getDefinition: (definitionId: string) => RoomDefinition | null,
  doors: readonly DoorState[] = [],
): Map<string, Set<string>> {
  const adjacency = new Map<string, Set<string>>();
  const roomTiles = new Map<
    string,
    { room: PlacedRoom; definition: RoomDefinition }
  >();
  const hallways = new Set<string>();

  for (const room of rooms) {
    const definition = getDefinition(room.roomDefinitionId);
    if (!definition) {
      continue;
    }
    for (const tile of getOccupiedTiles(room, definition)) {
      const key = pointKey(tile);
      adjacency.set(key, adjacency.get(key) ?? new Set());
      if (definition.kind === "hallway") {
        hallways.add(key);
      } else {
        roomTiles.set(key, { room, definition });
      }
    }
  }

  // Every tile within the same room is traversable. Hallway tiles connect to
  // one another. Legacy layouts without explicit doors retain their old
  // inbound-threshold behavior until persistence migrates them.
  for (const [key, owner] of roomTiles) {
    const point = parsePointKey(key);
    for (const step of CARDINAL_STEPS) {
      const neighborKey = pointKey({
        x: point.x + step.x,
        y: point.y + step.y,
      });
      if (roomTiles.get(neighborKey)?.room.id === owner.room.id) {
        connectNodes(adjacency, key, neighborKey);
      }
    }
  }
  for (const key of hallways) {
    const point = parsePointKey(key);
    for (const step of CARDINAL_STEPS) {
      const neighborKey = pointKey({
        x: point.x + step.x,
        y: point.y + step.y,
      });
      if (hallways.has(neighborKey)) {
        connectNodes(adjacency, key, neighborKey);
      } else if (doors.length === 0 && roomTiles.has(neighborKey)) {
        connectNodes(adjacency, key, neighborKey);
      }
    }
  }

  if (doors.length > 0) {
    for (const door of doors) {
      if (door.exterior) {
        continue;
      }
      const room = rooms.find((candidate) => candidate.id === door.roomId);
      const definition = room
        ? getDefinition(room.roomDefinitionId)
        : null;
      if (!room || !definition || definition.kind === "hallway") {
        continue;
      }
      const footprint = getRotatedFootprint(
        definition,
        room.orientation,
      );
      const wallLength =
        door.side === "north" || door.side === "south"
          ? footprint.width
          : footprint.height;
      if (door.offset < 0 || door.offset >= wallLength) {
        continue;
      }
      const inside =
        door.side === "north"
          ? { x: room.x + door.offset, y: room.y }
          : door.side === "south"
            ? {
                x: room.x + door.offset,
                y: room.y + footprint.height - 1,
              }
            : door.side === "west"
              ? { x: room.x, y: room.y + door.offset }
              : {
                  x: room.x + footprint.width - 1,
                  y: room.y + door.offset,
                };
      const step =
        door.side === "north"
          ? { x: 0, y: -1 }
          : door.side === "east"
            ? { x: 1, y: 0 }
            : door.side === "south"
              ? { x: 0, y: 1 }
              : { x: -1, y: 0 };
      const outside = {
        x: inside.x + step.x,
        y: inside.y + step.y,
      };
      const insideKey = pointKey(inside);
      const outsideKey = pointKey(outside);
      if (adjacency.has(insideKey) && adjacency.has(outsideKey)) {
        connectNodes(adjacency, insideKey, outsideKey);
      }
    }
  } else {
    // Embedded-door compatibility for historical fixtures and old tests.
    for (const room of rooms) {
      const definition = getDefinition(room.roomDefinitionId);
      if (!definition || definition.kind === "hallway") {
        continue;
      }
      const door = getRoomDoorCell(room, definition);
      const approach = getRoomDoorApproachCell(room, definition);
      if (!door || !approach) {
        continue;
      }
      const approachKey = pointKey(approach);
      if (hallways.has(approachKey) || roomTiles.has(approachKey)) {
        connectNodes(adjacency, pointKey(door), approachKey);
      }
    }
  }

  return adjacency;
}

function findDeterministicAdjacencyPath(
  start: GridPoint,
  goal: GridPoint,
  adjacency: ReadonlyMap<string, ReadonlySet<string>>,
): GridPoint[] {
  const startKey = pointKey(start);
  const goalKey = pointKey(goal);
  if (!adjacency.has(startKey) || !adjacency.has(goalKey)) {
    return [];
  }
  const queue: GridPoint[] = [{ ...start }];
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
    const neighbors = adjacency.get(currentKey);
    for (const step of CARDINAL_STEPS) {
      const next = {
        x: current.x + step.x,
        y: current.y + step.y,
      };
      const nextKey = pointKey(next);
      if (neighbors?.has(nextKey) && !parent.has(nextKey)) {
        parent.set(nextKey, currentKey);
        queue.push(next);
      }
    }
  }
  return [];
}

export function findDeterministicFacilityPath(
  start: GridPoint,
  goal: GridPoint,
  rooms: readonly PlacedRoom[],
  doors: readonly DoorState[],
  getDefinition: (definitionId: string) => RoomDefinition | null,
): GridPoint[] {
  return findDeterministicAdjacencyPath(
    start,
    goal,
    tileAdjacencyForFacility(rooms, getDefinition, doors),
  );
}

/**
 * Finds a stable route between two room instances.
 *
 * Room interiors, room-owned thresholds, and hallways form one deterministic
 * tile graph. A route may therefore cross intermediate rooms or hallways, but
 * it can never pass through an arbitrary wall.
 */
export function findDeterministicRoomPath(
  origin: PlacedRoom,
  destination: PlacedRoom,
  getDefinition: (definitionId: string) => RoomDefinition | null,
  rooms: readonly PlacedRoom[],
  protectedRoomDefinitionIds: ReadonlySet<string> = new Set([
    origin.roomDefinitionId,
  ]),
  doors: readonly DoorState[] = [],
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
  if (
    doors.length === 0 &&
    !validateFacilityConnectivity(
      rooms,
      getDefinition,
      protectedRoomDefinitionIds,
    ).connected
  ) {
    return [];
  }
  return findDeterministicAdjacencyPath(
    getRoomCenter(origin, originDefinition),
    getRoomCenter(destination, destinationDefinition),
    tileAdjacencyForFacility(rooms, getDefinition, doors),
  );
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
