import type { CardinalDirection } from "@gamify-surgery/game-domain";

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

function destinationPoint(room: DoorPresentationRoom, side: CardinalDirection, offset: number): { x: number; y: number } {
  switch (side) {
    case "north": return { x: room.tileX + offset, y: room.tileY - 1 };
    case "east": return { x: room.tileX + room.width, y: room.tileY + offset };
    case "south": return { x: room.tileX + offset, y: room.tileY + room.height };
    case "west": return { x: room.tileX - 1, y: room.tileY + offset };
  }
}

/** Finds the actual room or hallway immediately beyond a rendered door slot. */
export function getDoorPresentationDestination(
  door: DoorPresentationDoor,
  rooms: readonly DoorPresentationRoom[],
): string | undefined {
  const source = rooms.find((room) => room.instanceId === door.roomInstanceId);
  if (!source || door.exterior) return undefined;
  const point = destinationPoint(source, door.side, door.offset);
  return rooms.find((room) =>
    room.instanceId !== source.instanceId &&
    point.x >= room.tileX && point.x < room.tileX + room.width &&
    point.y >= room.tileY && point.y < room.tileY + room.height,
  )?.instanceId;
}

function oppositeSide(side: CardinalDirection): CardinalDirection {
  switch (side) {
    case "north": return "south";
    case "east": return "west";
    case "south": return "north";
    case "west": return "east";
  }
}

/**
 * Returns every wall tile that is visibly open for this room. Persisted doors
 * own their source slot, while a door landing in this room removes the exact
 * reciprocal target-wall slot too. This is renderer-only: door records and
 * domain legality remain unchanged.
 */
export function getDoorPresentationOpenings(
  room: DoorPresentationRoom,
  doors: readonly DoorPresentationDoor[],
  rooms: readonly DoorPresentationRoom[],
): readonly DoorPresentationOpening[] {
  const openings = new Map<string, DoorPresentationOpening>();
  const add = (side: CardinalDirection, offset: number) => {
    openings.set(`${side}:${offset}`, { side, offset });
  };
  for (const door of doors) {
    if (door.roomInstanceId === room.instanceId) {
      add(door.side, door.offset);
      continue;
    }
    if (door.exterior || getDoorPresentationDestination(door, rooms) !== room.instanceId) continue;
    const source = rooms.find((candidate) => candidate.instanceId === door.roomInstanceId);
    if (!source) continue;
    const point = destinationPoint(source, door.side, door.offset);
    const side = oppositeSide(door.side);
    add(side, side === "north" || side === "south"
      ? point.x - room.tileX
      : point.y - room.tileY);
  }
  return [...openings.values()];
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
