import type { RoomDefinition } from "@gamify-surgery/balance-config";
import type {
  CardinalDirection,
  DoorState,
  GridPoint,
  PlacedRoom,
} from "./types";
import { getOccupiedTiles, getRotatedFootprint } from "./spatial";

const CARDINAL_OFFSET: Record<CardinalDirection, GridPoint> = {
  north: { x: 0, y: -1 },
  east: { x: 1, y: 0 },
  south: { x: 0, y: 1 },
  west: { x: -1, y: 0 },
};

function pointKey(point: GridPoint): string {
  return `${point.x},${point.y}`;
}

function roomNode(roomId: string): string {
  return `room:${roomId}`;
}

function connect(
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

function getWallLength(
  room: PlacedRoom,
  definition: RoomDefinition,
  side: CardinalDirection,
): number {
  const footprint = getRotatedFootprint(definition, room.orientation);
  return side === "north" || side === "south"
    ? footprint.width
    : footprint.height;
}

export function getDoorCells(
  door: DoorState,
  room: PlacedRoom,
  definition: RoomDefinition,
): { inside: GridPoint; outside: GridPoint } | null {
  const footprint = getRotatedFootprint(definition, room.orientation);
  const wallLength = getWallLength(room, definition, door.side);
  if (
    !Number.isSafeInteger(door.offset) ||
    door.offset < 0 ||
    door.offset >= wallLength
  ) {
    return null;
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
  const direction = CARDINAL_OFFSET[door.side];
  return {
    inside,
    outside: {
      x: inside.x + direction.x,
      y: inside.y + direction.y,
    },
  };
}

export function getDefaultDoorOffset(
  room: PlacedRoom,
  definition: RoomDefinition,
  side: CardinalDirection,
): number {
  return Math.floor((getWallLength(room, definition, side) - 1) / 2);
}

export function getRoomContainingPoint(
  point: GridPoint,
  rooms: readonly PlacedRoom[],
  getDefinition: (definitionId: string) => RoomDefinition | null,
  exceptRoomId?: string,
): PlacedRoom | null {
  for (const room of rooms) {
    if (room.id === exceptRoomId) {
      continue;
    }
    const definition = getDefinition(room.roomDefinitionId);
    if (
      definition &&
      getOccupiedTiles(room, definition).some(
        (tile) => tile.x === point.x && tile.y === point.y,
      )
    ) {
      return room;
    }
  }
  return null;
}

function physicalDoorKey(cells: {
  inside: GridPoint;
  outside: GridPoint;
}): string {
  return [pointKey(cells.inside), pointKey(cells.outside)]
    .sort()
    .join("|");
}

export interface DoorPlacementValidation {
  valid: boolean;
  reason: string | null;
  adjacentRoomId: string | null;
}

export function validateDoorPlacement(
  door: DoorState,
  rooms: readonly PlacedRoom[],
  doors: readonly DoorState[],
  getDefinition: (definitionId: string) => RoomDefinition | null,
  gridWidth: number,
  gridHeight: number,
  protectedRoomDefinitionIds: ReadonlySet<string>,
): DoorPlacementValidation {
  const room = rooms.find((candidate) => candidate.id === door.roomId);
  const definition = room
    ? getDefinition(room.roomDefinitionId)
    : null;
  if (!room || !definition || definition.kind === "hallway") {
    return {
      valid: false,
      reason: "Select a clinical room wall for this door.",
      adjacentRoomId: null,
    };
  }
  const cells = getDoorCells(door, room, definition);
  if (!cells) {
    return {
      valid: false,
      reason: "That door position is not on a valid wall segment.",
      adjacentRoomId: null,
    };
  }
  const duplicateKey = physicalDoorKey(cells);
  const duplicatesExistingDoor = doors.some((candidate) => {
    if (candidate.id === door.id) {
      return false;
    }
    const candidateRoom = rooms.find(
      (placed) => placed.id === candidate.roomId,
    );
    const candidateDefinition = candidateRoom
      ? getDefinition(candidateRoom.roomDefinitionId)
      : null;
    const candidateCells =
      candidateRoom && candidateDefinition
        ? getDoorCells(candidate, candidateRoom, candidateDefinition)
        : null;
    return (
      candidateCells !== null &&
      physicalDoorKey(candidateCells) === duplicateKey
    );
  });
  if (duplicatesExistingDoor) {
    return {
      valid: false,
      reason: "A door already occupies that wall segment.",
      adjacentRoomId: null,
    };
  }

  const outsideFacility =
    cells.outside.x < 0 ||
    cells.outside.y < 0 ||
    cells.outside.x >= gridWidth ||
    cells.outside.y >= gridHeight;
  if (door.exterior) {
    const validPublicEntrance =
      protectedRoomDefinitionIds.has(room.roomDefinitionId) &&
      door.side === "south" &&
      cells.outside.y === gridHeight;
    return {
      valid: validPublicEntrance,
      reason: validPublicEntrance
        ? null
        : "The exterior entrance must open south from the Front Desk to the sidewalk.",
      adjacentRoomId: null,
    };
  }
  if (outsideFacility) {
    return {
      valid: false,
      reason: "Only the designated Front Desk entrance may open outside.",
      adjacentRoomId: null,
    };
  }
  const adjacentRoom = getRoomContainingPoint(
    cells.outside,
    rooms,
    getDefinition,
    room.id,
  );
  if (!adjacentRoom) {
    return {
      valid: false,
      reason: "A door must connect two adjacent traversable spaces.",
      adjacentRoomId: null,
    };
  }
  return {
    valid: true,
    reason: null,
    adjacentRoomId: adjacentRoom.id,
  };
}

export interface FacilityAccessValidation {
  valid: boolean;
  reason: string | null;
  issues: string[];
  unreachableRoomIds: string[];
}

export function validateFacilityAccess(
  rooms: readonly PlacedRoom[],
  doors: readonly DoorState[],
  getDefinition: (definitionId: string) => RoomDefinition | null,
  gridWidth: number,
  gridHeight: number,
  protectedRoomDefinitionIds: ReadonlySet<string>,
): FacilityAccessValidation {
  const issues: string[] = [];
  const adjacency = new Map<string, Set<string>>();
  for (const room of rooms) {
    adjacency.set(roomNode(room.id), new Set());
  }

  const validExteriorRoomIds = new Set<string>();
  const doorConnections = new Map<
    string,
    Array<{ door: DoorState; adjacentRoomId: string | null }>
  >();
  for (const door of doors) {
    const validation = validateDoorPlacement(
      door,
      rooms,
      doors,
      getDefinition,
      gridWidth,
      gridHeight,
      protectedRoomDefinitionIds,
    );
    if (!validation.valid) {
      issues.push(validation.reason ?? "A door is invalid.");
      continue;
    }
    const connections = doorConnections.get(door.roomId) ?? [];
    connections.push({
      door,
      adjacentRoomId: validation.adjacentRoomId,
    });
    doorConnections.set(door.roomId, connections);
    if (door.exterior) {
      validExteriorRoomIds.add(door.roomId);
    } else if (validation.adjacentRoomId) {
      connect(
        adjacency,
        roomNode(door.roomId),
        roomNode(validation.adjacentRoomId),
      );
      const reverse = doorConnections.get(validation.adjacentRoomId) ?? [];
      reverse.push({
        door,
        adjacentRoomId: door.roomId,
      });
      doorConnections.set(validation.adjacentRoomId, reverse);
    }
  }

  // Adjacent hallway pieces are one uninterrupted circulation space.
  const hallways = rooms.filter(
    (room) => getDefinition(room.roomDefinitionId)?.kind === "hallway",
  );
  for (let leftIndex = 0; leftIndex < hallways.length; leftIndex += 1) {
    const left = hallways[leftIndex]!;
    const leftDefinition = getDefinition(left.roomDefinitionId)!;
    const leftTiles = new Set(
      getOccupiedTiles(left, leftDefinition).map(pointKey),
    );
    for (
      let rightIndex = leftIndex + 1;
      rightIndex < hallways.length;
      rightIndex += 1
    ) {
      const right = hallways[rightIndex]!;
      const rightDefinition = getDefinition(right.roomDefinitionId)!;
      const touches = getOccupiedTiles(right, rightDefinition).some(
        (tile) =>
          Object.values(CARDINAL_OFFSET).some((step) =>
            leftTiles.has(
              pointKey({ x: tile.x + step.x, y: tile.y + step.y }),
            ),
          ),
      );
      if (touches) {
        connect(adjacency, roomNode(left.id), roomNode(right.id));
      }
    }
  }

  const starts = rooms
    .filter(
      (room) =>
        protectedRoomDefinitionIds.has(room.roomDefinitionId) &&
        validExteriorRoomIds.has(room.id),
    )
    .map((room) => roomNode(room.id));
  if (starts.length === 0) {
    issues.push("Front Desk requires its exterior entrance.");
  }
  const visited = new Set<string>(starts);
  const queue = [...starts];
  while (queue.length > 0) {
    const current = queue.shift()!;
    for (const neighbor of adjacency.get(current) ?? []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }

  const unreachableRoomIds = rooms
    .filter(
      (room) =>
        !protectedRoomDefinitionIds.has(room.roomDefinitionId) &&
        !visited.has(roomNode(room.id)),
    )
    .map((room) => room.id);
  for (const roomId of unreachableRoomIds) {
    const room = rooms.find((candidate) => candidate.id === roomId)!;
    const displayName =
      getDefinition(room.roomDefinitionId)?.displayName ??
      room.roomDefinitionId;
    issues.push(`${displayName} needs a reachable door.`);
  }

  const imagingRoomIds = new Set([
    "room.xray",
    "room.ultrasound",
    "room.ct",
    "room.mri",
  ]);
  for (const room of rooms.filter((candidate) =>
    imagingRoomIds.has(candidate.roomDefinitionId),
  )) {
    const displayName =
      getDefinition(room.roomDefinitionId)?.displayName ??
      room.roomDefinitionId;
    const connections = doorConnections.get(room.id) ?? [];
    const controlConnections = connections.filter(({ adjacentRoomId }) => {
      const adjacent = rooms.find(
        (candidate) => candidate.id === adjacentRoomId,
      );
      const adjacentDefinition = adjacent
        ? getDefinition(adjacent.roomDefinitionId)
        : null;
      return adjacentDefinition?.capabilityIds.includes(
        "capability.imaging_control",
      );
    });
    const patientConnections = connections.filter(
      ({ adjacentRoomId }) =>
        adjacentRoomId !== null &&
        !controlConnections.some(
          (control) => control.adjacentRoomId === adjacentRoomId,
        ),
    );
    if (patientConnections.length === 0) {
      issues.push(`${displayName} requires a patient-facing door.`);
    }
    if (controlConnections.length === 0) {
      issues.push(
        `${displayName} must share a wall and internal door with an Imaging Control Room.`,
      );
    }
  }

  const uniqueIssues = [...new Set(issues)];
  return {
    valid: uniqueIssues.length === 0,
    reason: uniqueIssues[0] ?? null,
    issues: uniqueIssues,
    unreachableRoomIds,
  };
}
