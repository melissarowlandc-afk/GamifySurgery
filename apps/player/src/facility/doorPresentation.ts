import type { CardinalDirection, GridPoint } from "@gamify-surgery/game-domain";

/** Renderer/view-model shape only; domain door legality remains authoritative. */
export interface DoorPresentationRoom {
  instanceId: string;
  tileX: number;
  tileY: number;
  width: number;
  height: number;
}

export interface DoorPresentationDoor {
  instanceId: string;
  roomInstanceId: string;
  side: CardinalDirection;
  offset: number;
  exterior?: boolean;
  connectionValid?: boolean;
  adjacentRoomInstanceId?: string | null;
}

export interface DoorPresentationRun {
  startOffset: number;
  endOffset: number;
  destinationRoomInstanceId: string;
}

export interface DoorPresentationOpening {
  side: CardinalDirection;
  offset: number;
}

export interface DoorPresentationIndex {
  readonly roomIndices: ReadonlyMap<string, number>;
  readonly connected: readonly boolean[];
  openingsFor(roomId: string): readonly DoorPresentationOpening[];
}

const noOpenings: readonly DoorPresentationOpening[] = [];
type FindAdjacentRoom = (point: GridPoint, sourceId: string) => DoorPresentationRoom | undefined;

function destinationPoint(room: DoorPresentationRoom, side: CardinalDirection, offset: number): GridPoint {
  switch (side) {
    case "north": return { x: room.tileX + offset, y: room.tileY - 1 };
    case "east": return { x: room.tileX + room.width, y: room.tileY + offset };
    case "south": return { x: room.tileX + offset, y: room.tileY + room.height };
    case "west": return { x: room.tileX - 1, y: room.tileY + offset };
  }
}

function findRoomAtPoint(rooms: readonly DoorPresentationRoom[], point: GridPoint, sourceId: string): DoorPresentationRoom | undefined {
  return rooms.find((room) =>
    room.instanceId !== sourceId &&
    point.x >= room.tileX && point.x < room.tileX + room.width &&
    point.y >= room.tileY && point.y < room.tileY + room.height,
  );
}

function isDoorSlotInBounds(door: DoorPresentationDoor, room: DoorPresentationRoom): boolean {
  const length = door.side === "north" || door.side === "south" ? room.width : room.height;
  return Number.isSafeInteger(door.offset) && door.offset >= 0 && door.offset < length;
}

/** null is the public entrance. Undefined is a closed slot. */
function resolveDoor(
  door: DoorPresentationDoor,
  source: DoorPresentationRoom | undefined,
  findAdjacent: FindAdjacentRoom,
): { point: GridPoint; destination: DoorPresentationRoom } | null | undefined {
  if (!source || door.connectionValid === false || !isDoorSlotInBounds(door, source)) return undefined;
  if (door.exterior) return door.side === "south" ? null : undefined;
  const point = destinationPoint(source, door.side, door.offset);
  const destination = findAdjacent(point, source.instanceId);
  // Missing metadata permits legacy geometry lookup. Explicit null closes the door.
  const expected = door.adjacentRoomInstanceId;
  if (!destination || expected !== undefined && expected !== destination.instanceId) return undefined;
  return { point, destination };
}

/** Finds the actual room or hallway immediately beyond a rendered door slot. */
export function getDoorPresentationDestination(
  door: DoorPresentationDoor,
  rooms: readonly DoorPresentationRoom[],
): string | undefined {
  return resolveDoor(door, rooms.find(room => room.instanceId === door.roomInstanceId),
    (point, sourceId) => findRoomAtPoint(rooms, point, sourceId))?.destination.instanceId;
}

export function isDoorPresentationConnected(door: DoorPresentationDoor, rooms: readonly DoorPresentationRoom[]): boolean {
  const resolved = resolveDoor(door, rooms.find(room => room.instanceId === door.roomInstanceId),
    (point, sourceId) => findRoomAtPoint(rooms, point, sourceId));
  return resolved === null || Boolean(resolved?.destination.instanceId);
}

function oppositeSide(side: CardinalDirection): CardinalDirection {
  switch (side) {
    case "north": return "south";
    case "east": return "west";
    case "south": return "north";
    case "west": return "east";
  }
}

/** One pass over room tiles, then one resolution per saved door. */
export function buildDoorPresentationIndex(
  rooms: readonly DoorPresentationRoom[],
  doors: readonly DoorPresentationDoor[],
): DoorPresentationIndex {
  const roomIndices = new Map<string, number>();
  const tiles = new Map<string, [DoorPresentationRoom, DoorPresentationRoom?]>();
  let integerFootprints = true;
  for (const [index, room] of rooms.entries()) {
    const { instanceId, tileX, tileY, width, height } = room;
    if (!roomIndices.has(instanceId)) roomIndices.set(instanceId, index);
    if (doors.length === 0) continue;
    const right = tileX + width, bottom = tileY + height;
    if (!Number.isSafeInteger(tileX) || !Number.isSafeInteger(tileY) ||
        !Number.isSafeInteger(right) || !Number.isSafeInteger(bottom)) {
      integerFootprints = false;
      continue;
    }
    for (let y = tileY; y < bottom; y++) {
      for (let x = tileX; x < right; x++) {
        const key = `${x},${y}`;
        const occupied = tiles.get(key);
        if (!occupied) tiles.set(key, [room]);
        // Preserve first-match order, including when a legacy row shares the
        // source ID and is skipped by the destination lookup.
        else if (!occupied[1] && occupied[0].instanceId !== instanceId) occupied[1] = room;
      }
    }
  }
  const findAdjacent: FindAdjacentRoom = integerFootprints ? (point, sourceId) => {
    const occupied = tiles.get(`${point.x},${point.y}`);
    return occupied?.[0].instanceId === sourceId ? occupied[1] : occupied?.[0];
  } : (point, sourceId) => findRoomAtPoint(rooms, point, sourceId);

  const slotsByRoom = new Map<string, Map<string, DoorPresentationOpening>>();
  const addOpening = (id: string, side: CardinalDirection, offset: number) => {
    let openings = slotsByRoom.get(id);
    if (!openings) slotsByRoom.set(id, openings = new Map());
    openings.set(`${side}:${offset}`, { side, offset });
  };
  const connected = doors.map(door => {
    const source = rooms[roomIndices.get(door.roomInstanceId) ?? -1];
    const resolved = resolveDoor(door, source, findAdjacent);
    if (resolved !== null && !resolved?.destination.instanceId) return false;
    addOpening(door.roomInstanceId, door.side, door.offset);
    if (resolved) {
      const { point, destination } = resolved;
      const side = oppositeSide(door.side);
      addOpening(destination.instanceId, side, side === "north" || side === "south"
        ? point.x - destination.tileX
        : point.y - destination.tileY);
    }
    return true;
  });
  const openings = new Map([...slotsByRoom].map(([id, slots]) => [id, [...slots.values()]]));
  return { roomIndices, connected, openingsFor: id => openings.get(id) ?? noOpenings };
}

export function getDoorPresentationOpenings(
  room: DoorPresentationRoom,
  doors: readonly DoorPresentationDoor[],
  rooms: readonly DoorPresentationRoom[],
): readonly DoorPresentationOpening[] {
  return buildDoorPresentationIndex(rooms, doors).openingsFor(room.instanceId);
}

/**
 * Consecutive apertures become one wide opening only when they lead from the
 * same source wall into the same resolved adjacent room or hallway instance.
 */
export function getDoorPresentationRun(
  door: DoorPresentationDoor,
  doors: readonly DoorPresentationDoor[],
  rooms: readonly DoorPresentationRoom[],
): DoorPresentationRun | undefined {
  const destinationRoomInstanceId = getDoorPresentationDestination(door, rooms);
  if (!destinationRoomInstanceId) return undefined;
  const offsets = new Set(doors
    .filter((candidate) =>
      !candidate.exterior &&
      candidate.roomInstanceId === door.roomInstanceId &&
      candidate.side === door.side &&
      getDoorPresentationDestination(candidate, rooms) === destinationRoomInstanceId,
    )
    .map((candidate) => candidate.offset));
  let startOffset = door.offset;
  let endOffset = door.offset;
  while (offsets.has(startOffset - 1)) startOffset -= 1;
  while (offsets.has(endOffset + 1)) endOffset += 1;
  return { startOffset, endOffset, destinationRoomInstanceId };
}
