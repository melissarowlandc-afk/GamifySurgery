import type { RoomDefinition } from "@gamify-surgery/balance-config";

import {
  areDoorThresholdsProofNavigable,
  getDoorCells,
  getRoomContainingPoint,
  validateFacilityAccess,
  validateDoorPlacement,
} from "./doors";
import {
  findDeterministicFacilityPath,
  getOccupiedTiles,
  getRoomCareAnchor,
  getRoomNavigationAnchor,
  getRoomNavigableTiles,
  getRoomStandingWaitingAnchors,
  getRoomWaitingAnchors,
  getRotatedFootprint,
  isInsideFacility,
  isRoomDoorThresholdProofNavigable,
  roomsOverlap,
  validateFacilityConnectivity,
} from "./spatial";
import type {
  CardinalDirection,
  DomainContext,
  DoorState,
  FrozenPatientTravel,
  GameState,
  GridPoint,
  PlacedRoom,
} from "./types";

const RECOVERY_DEFINITION_ID = "room.periop_recovery";
const HALLWAY_DEFINITION_ID = "room.hallway";
const LEGACY_RECOVERY_WIDTH = 4;
const LEGACY_RECOVERY_HEIGHT = 3;
const APPROVED_RECTANGULAR_ROOM_IDS = new Set([
  "room.examination",
  "room.waiting",
  "room.phlebotomy",
  "room.endoscopy",
  "room.glp1_telehealth_suite",
]);
const APPROVED_FIXED_SQUARE_ROOM_IDS = new Set([
  "room.hallway",
  "room.bathroom",
  "room.xray",
  "room.minor_procedure",
  "room.ultrasound",
  "room.ct",
  "room.evs_closet",
  "room.periop_recovery",
  "room.training",
  "room.coffee_kiosk",
]);
const APPROVED_ROOM_IDS = new Set([
  "room.front_desk", "room.hallway", "room.examination", "room.waiting",
  "room.bathroom", "room.xray", "room.minor_procedure", "room.ultrasound",
  "room.ct", "room.phlebotomy", "room.evs_closet", "room.endoscopy",
  "room.periop_recovery", "room.training", "room.coffee_kiosk",
  "room.glp1_telehealth_suite",
]);
const STEPS: ReadonlyArray<GridPoint> = [
  { x: 0, y: -1 },
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: -1, y: 0 },
];

interface LegacyRecoveryPlacement {
  room: PlacedRoom;
  width: number;
  height: number;
}

interface DoorPort {
  door: DoorState;
  outside: GridPoint;
  existing: boolean;
}

function cloneState(state: GameState): GameState {
  return JSON.parse(JSON.stringify(state)) as GameState;
}

function pointKey(point: GridPoint): string {
  return `${point.x},${point.y}`;
}

function samePoint(left: GridPoint, right: GridPoint): boolean {
  return left.x === right.x && left.y === right.y;
}

function containsPoint(
  placement: Pick<PlacedRoom, "x" | "y">,
  width: number,
  height: number,
  point: GridPoint,
): boolean {
  return (
    point.x >= placement.x &&
    point.x < placement.x + width &&
    point.y >= placement.y &&
    point.y < placement.y + height
  );
}

function legacyPlacement(room: PlacedRoom): LegacyRecoveryPlacement {
  const rotated = room.orientation === 90 || room.orientation === 270;
  return {
    room: { ...room },
    width: rotated ? LEGACY_RECOVERY_HEIGHT : LEGACY_RECOVERY_WIDTH,
    height: rotated ? LEGACY_RECOVERY_WIDTH : LEGACY_RECOVERY_HEIGHT,
  };
}

function legacyContainingRecovery(
  point: GridPoint,
  placements: readonly LegacyRecoveryPlacement[],
): LegacyRecoveryPlacement | null {
  return (
    placements.find((placement) =>
      containsPoint(placement.room, placement.width, placement.height, point),
    ) ?? null
  );
}

function getDefinitionLookup(context: DomainContext) {
  const definitions = new Map(
    context.balanceRelease.facility.roomDefinitions.map((definition) => [
      definition.id,
      definition,
    ]),
  );
  return (definitionId: string): RoomDefinition | null =>
    definitions.get(definitionId) ?? null;
}

function oldDoorCells(
  door: DoorState,
  placement: LegacyRecoveryPlacement,
): { inside: GridPoint; outside: GridPoint } | null {
  const wallLength =
    door.side === "north" || door.side === "south"
      ? placement.width
      : placement.height;
  if (door.offset < 0 || door.offset >= wallLength) return null;
  const inside =
    door.side === "north"
      ? { x: placement.room.x + door.offset, y: placement.room.y }
      : door.side === "south"
        ? {
            x: placement.room.x + door.offset,
            y: placement.room.y + placement.height - 1,
          }
        : door.side === "west"
          ? { x: placement.room.x, y: placement.room.y + door.offset }
          : {
              x: placement.room.x + placement.width - 1,
              y: placement.room.y + door.offset,
            };
  const step =
    door.side === "north"
      ? STEPS[0]!
      : door.side === "east"
        ? STEPS[1]!
        : door.side === "south"
          ? STEPS[2]!
          : STEPS[3]!;
  return {
    inside,
    outside: { x: inside.x + step.x, y: inside.y + step.y },
  };
}

function doorFromThreshold(
  id: string,
  room: PlacedRoom,
  definition: RoomDefinition,
  inside: GridPoint,
  outside: GridPoint,
): DoorState | null {
  const size = getRotatedFootprint(definition, room.orientation);
  let side: CardinalDirection;
  let offset: number;
  if (outside.y === inside.y - 1 && inside.y === room.y) {
    side = "north";
    offset = inside.x - room.x;
  } else if (
    outside.x === inside.x + 1 &&
    inside.x === room.x + size.width - 1
  ) {
    side = "east";
    offset = inside.y - room.y;
  } else if (
    outside.y === inside.y + 1 &&
    inside.y === room.y + size.height - 1
  ) {
    side = "south";
    offset = inside.x - room.x;
  } else if (outside.x === inside.x - 1 && inside.x === room.x) {
    side = "west";
    offset = inside.y - room.y;
  } else {
    return null;
  }
  return { id, roomId: room.id, side, offset, exterior: false };
}

function physicalDoorKey(
  door: DoorState,
  rooms: readonly PlacedRoom[],
  definitionFor: (definitionId: string) => RoomDefinition | null,
): string | null {
  const room = rooms.find((candidate) => candidate.id === door.roomId);
  const definition = room ? definitionFor(room.roomDefinitionId) : null;
  const cells = room && definition ? getDoorCells(door, room, definition) : null;
  return cells
    ? [pointKey(cells.inside), pointKey(cells.outside)].sort().join("|")
    : null;
}

function occupiedClinicalTiles(
  rooms: readonly PlacedRoom[],
  definitionFor: (definitionId: string) => RoomDefinition | null,
): Set<string> {
  const occupied = new Set<string>();
  for (const room of rooms) {
    const definition = definitionFor(room.roomDefinitionId);
    if (!definition || definition.kind === "hallway") continue;
    for (const point of getOccupiedTiles(room, definition)) {
      occupied.add(pointKey(point));
    }
  }
  return occupied;
}

function shortestPath(
  starts: readonly GridPoint[],
  goals: ReadonlySet<string>,
  blocked: ReadonlySet<string>,
  gridWidth: number,
  gridHeight: number,
): GridPoint[] {
  const orderedStarts = [...starts].sort(
    (left, right) => left.y - right.y || left.x - right.x,
  );
  const queue: GridPoint[] = [];
  const parent = new Map<string, string | null>();
  for (const start of orderedStarts) {
    const key = pointKey(start);
    if (
      start.x < 0 ||
      start.y < 0 ||
      start.x >= gridWidth ||
      start.y >= gridHeight ||
      blocked.has(key) ||
      parent.has(key)
    ) {
      continue;
    }
    parent.set(key, null);
    queue.push(start);
  }
  for (let head = 0; head < queue.length; head += 1) {
    const current = queue[head]!;
    const currentKey = pointKey(current);
    if (goals.has(currentKey)) {
      const reversed: GridPoint[] = [];
      let cursor: string | null = currentKey;
      while (cursor !== null) {
        const [x, y] = cursor.split(",").map(Number);
        reversed.push({ x: x!, y: y! });
        cursor = parent.get(cursor) ?? null;
      }
      return reversed.reverse();
    }
    for (const step of STEPS) {
      const next = { x: current.x + step.x, y: current.y + step.y };
      const key = pointKey(next);
      if (
        next.x >= 0 &&
        next.y >= 0 &&
        next.x < gridWidth &&
        next.y < gridHeight &&
        !blocked.has(key) &&
        !parent.has(key)
      ) {
        parent.set(key, currentKey);
        queue.push(next);
      }
    }
  }
  return [];
}

function roomDoorPorts(
  room: PlacedRoom,
  definition: RoomDefinition,
  rooms: readonly PlacedRoom[],
  doors: readonly DoorState[],
  definitionFor: (definitionId: string) => RoomDefinition | null,
  gridWidth: number,
  gridHeight: number,
  protectedIds: ReadonlySet<string>,
  idPrefix: string,
): DoorPort[] {
  const size = getRotatedFootprint(definition, room.orientation);
  const ports: DoorPort[] = [];
  const sides: CardinalDirection[] = ["north", "east", "south", "west"];
  for (const side of sides) {
    const length = side === "north" || side === "south" ? size.width : size.height;
    for (let offset = 0; offset < length; offset += 1) {
      const existing = doors.find(
        (door) =>
          door.roomId === room.id &&
          door.side === side &&
          door.offset === offset &&
          !door.exterior,
      );
      const door: DoorState =
        existing ?? {
          id: `${idPrefix}.${side}.${offset}`,
          roomId: room.id,
          side,
          offset,
          exterior: false,
        };
      const cells = getDoorCells(door, room, definition);
      if (!cells) continue;
      const candidateDoors = existing ? doors : [...doors, door];
      const validation = validateDoorPlacement(
        door,
        rooms,
        candidateDoors,
        definitionFor,
        gridWidth,
        gridHeight,
        protectedIds,
      );
      // A free outside tile becomes valid as soon as the migration places its hallway.
      const outsideInsideOther = getRoomContainingPoint(
        cells.outside,
        rooms,
        definitionFor,
        room.id,
      );
      if (
        cells.outside.x < 0 ||
        cells.outside.y < 0 ||
        cells.outside.x >= gridWidth ||
        cells.outside.y >= gridHeight ||
        (outsideInsideOther &&
          definitionFor(outsideInsideOther.roomDefinitionId)?.kind !== "hallway")
      ) {
        continue;
      }
      if (existing && !validation.valid) continue;
      ports.push({ door, outside: cells.outside, existing: Boolean(existing) });
    }
  }
  return ports;
}

function addPathToNetwork(network: Set<string>, path: readonly GridPoint[]): void {
  for (const point of path) network.add(pointKey(point));
}

function routeTouchesLegacyRecovery(
  path: readonly GridPoint[],
  legacy: readonly LegacyRecoveryPlacement[],
): boolean {
  return path.some((point) => legacyContainingRecovery(point, legacy) !== null);
}

function uniqueId(base: string, usedIds: Set<string>): string {
  let id = base;
  let suffix = 2;
  while (usedIds.has(id)) {
    id = `${base}.${suffix}`;
    suffix += 1;
  }
  usedIds.add(id);
  return id;
}

function migrateOneRecoveryRoom(
  state: GameState,
  legacy: LegacyRecoveryPlacement,
  reservedLegacyPlacements: readonly LegacyRecoveryPlacement[],
  context: DomainContext,
  definitionFor: (definitionId: string) => RoomDefinition | null,
): { relocated: boolean; addedHallwayRoomIds: string[] } {
  const recoveryDefinition = definitionFor(RECOVERY_DEFINITION_ID);
  const hallwayDefinition = definitionFor(HALLWAY_DEFINITION_ID);
  if (!recoveryDefinition || !hallwayDefinition) {
    throw new Error("Approved Recovery migration requires Recovery and hallway definitions.");
  }
  const facility = context.balanceRelease.facility;
  const protectedIds = new Set(facility.protectedRoomDefinitionIds);
  const withoutRecovery = state.rooms.filter((room) => room.id !== legacy.room.id);
  const origins: GridPoint[] = [];
  for (let y = 0; y <= facility.gridHeight - recoveryDefinition.height; y += 1) {
    for (let x = 0; x <= facility.gridWidth - recoveryDefinition.width; x += 1) {
      origins.push({ x, y });
    }
  }
  origins.sort(
    (left, right) =>
      Math.abs(left.x - legacy.room.x) + Math.abs(left.y - legacy.room.y) -
        (Math.abs(right.x - legacy.room.x) + Math.abs(right.y - legacy.room.y)) ||
      left.y - right.y ||
      left.x - right.x,
  );

  const recoveryOwnedDoors = state.doors.filter(
    (door) => door.roomId === legacy.room.id,
  );
  const unrelatedDoors = state.doors.filter(
    (door) => door.roomId !== legacy.room.id,
  );
  const reconnectDoors: DoorState[] = [];
  const requiredTerminals: GridPoint[] = [];

  for (const door of unrelatedDoors) {
    const owner = state.rooms.find((room) => room.id === door.roomId);
    const definition = owner ? definitionFor(owner.roomDefinitionId) : null;
    const cells = owner && definition ? getDoorCells(door, owner, definition) : null;
    if (cells && containsPoint(legacy.room, legacy.width, legacy.height, cells.outside)) {
      requiredTerminals.push(cells.outside);
    }
  }
  for (const door of recoveryOwnedDoors) {
    const cells = oldDoorCells(door, legacy);
    if (!cells) continue;
    requiredTerminals.push(cells.inside);
    const adjacent = getRoomContainingPoint(
      cells.outside,
      withoutRecovery,
      definitionFor,
    );
    const adjacentDefinition = adjacent
      ? definitionFor(adjacent.roomDefinitionId)
      : null;
    if (adjacent && adjacentDefinition && adjacentDefinition.kind !== "hallway") {
      const reverse = doorFromThreshold(
        `door.migration.reconnect.${door.id}`,
        adjacent,
        adjacentDefinition,
        cells.outside,
        cells.inside,
      );
      if (reverse) reconnectDoors.push(reverse);
    }
  }

  const protectedRooms = withoutRecovery
    .filter((room) => protectedIds.has(room.roomDefinitionId))
    .sort((left, right) => left.id.localeCompare(right.id));
  if (protectedRooms.length === 0) {
    throw new Error("Approved Recovery migration could not find the Front Desk.");
  }

  for (const origin of origins) {
    const candidate: PlacedRoom = {
      ...legacy.room,
      x: origin.x,
      y: origin.y,
      orientation: 0,
      doorSide: null,
    };
    if (
      !isInsideFacility(candidate, recoveryDefinition, facility.gridWidth, facility.gridHeight) ||
      reservedLegacyPlacements.some((reserved) =>
        candidate.x < reserved.room.x + reserved.width &&
        candidate.x + recoveryDefinition.width > reserved.room.x &&
        candidate.y < reserved.room.y + reserved.height &&
        candidate.y + recoveryDefinition.height > reserved.room.y,
      ) ||
      withoutRecovery.some((room) => {
        const definition = definitionFor(room.roomDefinitionId);
        return definition ? roomsOverlap(candidate, recoveryDefinition, room, definition) : true;
      })
    ) {
      continue;
    }
    const candidateRooms = [...withoutRecovery, candidate];
    const baseDoors = [...unrelatedDoors, ...reconnectDoors];
    const blocked = occupiedClinicalTiles(candidateRooms, definitionFor);
    for (const reserved of reservedLegacyPlacements) {
      for (let y = reserved.room.y; y < reserved.room.y + reserved.height; y += 1) {
        for (let x = reserved.room.x; x < reserved.room.x + reserved.width; x += 1) {
          blocked.add(pointKey({ x, y }));
        }
      }
    }
    const recoveryPorts = roomDoorPorts(
      candidate,
      recoveryDefinition,
      candidateRooms,
      baseDoors,
      definitionFor,
      facility.gridWidth,
      facility.gridHeight,
      protectedIds,
      `door.migration.recovery.${candidate.id}`,
    );
    if (recoveryPorts.length === 0) continue;

    const sourcePorts = protectedRooms.flatMap((room) => {
      const definition = definitionFor(room.roomDefinitionId);
      return definition
        ? roomDoorPorts(
            room,
            definition,
            candidateRooms,
            baseDoors,
            definitionFor,
            facility.gridWidth,
            facility.gridHeight,
            protectedIds,
            `door.migration.source.${room.id}`,
          )
        : [];
    });
    if (sourcePorts.length === 0) continue;
    const recoveryGoals = new Set(recoveryPorts.map((port) => pointKey(port.outside)));
    const trunk = shortestPath(
      sourcePorts.map((port) => port.outside),
      recoveryGoals,
      blocked,
      facility.gridWidth,
      facility.gridHeight,
    );
    if (trunk.length === 0) continue;
    const source = sourcePorts.find((port) => samePoint(port.outside, trunk[0]!));
    const recoveryPort = recoveryPorts.find((port) =>
      samePoint(port.outside, trunk.at(-1)!),
    );
    if (!source || !recoveryPort) continue;

    const network = new Set<string>();
    addPathToNetwork(network, trunk);
    let branchesValid = true;
    for (const terminal of [...requiredTerminals].sort(
      (left, right) => left.y - right.y || left.x - right.x,
    )) {
      if (blocked.has(pointKey(terminal))) continue;
      const branch = shortestPath(
        [...network].map((key) => {
          const [x, y] = key.split(",").map(Number);
          return { x: x!, y: y! };
        }),
        new Set([pointKey(terminal)]),
        blocked,
        facility.gridWidth,
        facility.gridHeight,
      );
      if (branch.length === 0) {
        branchesValid = false;
        break;
      }
      addPathToNetwork(network, branch);
    }
    if (!branchesValid) continue;

    const usedRoomIds = new Set(candidateRooms.map((room) => room.id));
    const existingHallwayKeys = new Set(
      withoutRecovery.flatMap((room) => {
        const definition = definitionFor(room.roomDefinitionId);
        return definition?.kind === "hallway"
          ? getOccupiedTiles(room, definition).map(pointKey)
          : [];
      }),
    );
    const newHallways = [...network]
      .filter((key) => !existingHallwayKeys.has(key))
      .sort((left, right) => {
        const [lx, ly] = left.split(",").map(Number);
        const [rx, ry] = right.split(",").map(Number);
        return ly! - ry! || lx! - rx!;
      })
      .map((key) => {
        const [x, y] = key.split(",").map(Number);
        return {
          id: uniqueId(`room.migration.hall.${candidate.id}.${x}.${y}`, usedRoomIds),
          roomDefinitionId: hallwayDefinition.id,
          x: x!,
          y: y!,
          orientation: 0 as const,
          doorSide: null,
          upgradeLevel: 1 as const,
          cleanliness: 100,
        } satisfies PlacedRoom;
      });
    const finalRooms = [...candidateRooms, ...newHallways];
    const usedDoorIds = new Set(baseDoors.map((door) => door.id));
    const finalRecoveryDoor = {
      ...recoveryPort.door,
      id: recoveryOwnedDoors[0]?.id ?? recoveryPort.door.id,
    };
    if (usedDoorIds.has(finalRecoveryDoor.id)) {
      finalRecoveryDoor.id = uniqueId(finalRecoveryDoor.id, usedDoorIds);
    }
    const finalDoors = [
      ...baseDoors,
      ...(source.existing ? [] : [source.door]),
      finalRecoveryDoor,
    ];
    const physicalKeys = new Set<string>();
    let valid = true;
    for (const door of finalDoors) {
      const key = physicalDoorKey(door, finalRooms, definitionFor);
      if (!key || physicalKeys.has(key)) {
        valid = false;
        break;
      }
      physicalKeys.add(key);
      if (
        !validateDoorPlacement(
          door,
          finalRooms,
          finalDoors,
          definitionFor,
          facility.gridWidth,
          facility.gridHeight,
          protectedIds,
        ).valid
      ) {
        valid = false;
        break;
      }
    }
    const access = valid
      ? validateFacilityAccess(
          finalRooms,
          finalDoors,
          definitionFor,
          facility.gridWidth,
          facility.gridHeight,
          protectedIds,
        )
      : null;
    const connectivity = valid
      ? validateFacilityConnectivity(finalRooms, definitionFor, protectedIds)
      : null;
    const front = protectedRooms[0]!;
    const frontDefinition = definitionFor(front.roomDefinitionId)!;
    const functionalRoute = valid
      ? findDeterministicFacilityPath(
          getRoomNavigationAnchor(front, frontDefinition),
          getRoomNavigationAnchor(candidate, recoveryDefinition),
          finalRooms,
          finalDoors,
          definitionFor,
        )
      : [];
    if (!valid || !access?.valid || !connectivity?.connected || functionalRoute.length === 0) {
      continue;
    }
    state.rooms = finalRooms;
    state.doors = finalDoors;
    return {
      relocated: candidate.x !== legacy.room.x || candidate.y !== legacy.room.y,
      addedHallwayRoomIds: newHallways.map((room) => room.id),
    };
  }
  throw new Error(
    `Approved Recovery migration could not place and reconnect ${legacy.room.id}; the saved facility was left unchanged.`,
  );
}

function reprojectStateReferences(
  state: GameState,
  legacyPlacements: readonly LegacyRecoveryPlacement[],
  context: DomainContext,
  definitionFor: (definitionId: string) => RoomDefinition | null,
): void {
  const recoveryById = new Map(
    state.rooms
      .filter((room) => room.roomDefinitionId === RECOVERY_DEFINITION_ID)
      .map((room) => [room.id, room]),
  );
  const mapPoint = (
    point: GridPoint,
    semantic: "primary" | "staff" | "waiting" | "litter" = "primary",
  ): GridPoint => {
    const legacy = legacyContainingRecovery(point, legacyPlacements);
    if (!legacy) return { ...point };
    const room = recoveryById.get(legacy.room.id);
    const definition = room ? definitionFor(room.roomDefinitionId) : null;
    if (!room || !definition) return { ...point };
    if (semantic === "staff") return getRoomNavigationAnchor(room, definition, "staff");
    if (semantic === "waiting") {
      const anchors = getRoomWaitingAnchors(room, definition);
      if (anchors.length > 0) return { ...anchors[0]! };
    }
    if (semantic === "litter") {
      const localX = point.x - legacy.room.x;
      const localY = point.y - legacy.room.y;
      const target = {
        x: room.x + Math.round((localX / Math.max(1, legacy.width - 1)) * (definition.width - 1)),
        y: room.y + Math.round((localY / Math.max(1, legacy.height - 1)) * (definition.height - 1)),
      };
      return [...getRoomNavigableTiles(room, definition, state.doors, state.rooms, definitionFor)].sort(
        (left, right) =>
          Math.abs(left.x - target.x) + Math.abs(left.y - target.y) -
            (Math.abs(right.x - target.x) + Math.abs(right.y - target.y)) ||
          left.y - right.y ||
          left.x - right.x,
      )[0] ?? getRoomNavigationAnchor(room, definition);
    }
    return getRoomNavigationAnchor(room, definition);
  };
  const route = (start: GridPoint, destination: GridPoint): GridPoint[] => {
    const path = findDeterministicFacilityPath(
      start,
      destination,
      state.rooms,
      state.doors,
      definitionFor,
    );
    if (path.length === 0) {
      throw new Error("Approved Recovery migration could not reproject an active route.");
    }
    return path;
  };
  const reroute = (
    path: GridPoint[],
    pathIndex: number,
    location: GridPoint,
    semantic: "primary" | "staff" = "primary",
  ): { path: GridPoint[]; pathIndex: number; location: GridPoint } => {
    const current = mapPoint(path[pathIndex] ?? location, semantic);
    const destination = mapPoint(path.at(-1) ?? location, semantic);
    const nextPath = route(current, destination);
    return { path: nextPath, pathIndex: 0, location: { ...nextPath[0]! } };
  };
  const migrateFrozenTravel = (travel: FrozenPatientTravel | null): void => {
    if (!travel) return;
    if (
      !recoveryById.has(travel.originRoomInstanceId) &&
      !recoveryById.has(travel.destinationRoomInstanceId) &&
      !routeTouchesLegacyRecovery(travel.outboundPath, legacyPlacements) &&
      !routeTouchesLegacyRecovery(travel.returnPath, legacyPlacements)
    ) {
      return;
    }
    const origin = state.rooms.find((room) => room.id === travel.originRoomInstanceId);
    const destination = state.rooms.find(
      (room) => room.id === travel.destinationRoomInstanceId,
    );
    const originDefinition = origin ? definitionFor(origin.roomDefinitionId) : null;
    const destinationDefinition = destination
      ? definitionFor(destination.roomDefinitionId)
      : null;
    if (!origin || !destination || !originDefinition || !destinationDefinition) {
      throw new Error("Approved Recovery migration found an invalid frozen room reference.");
    }
    const outbound = route(
      getRoomNavigationAnchor(origin, originDefinition),
      getRoomNavigationAnchor(destination, destinationDefinition),
    );
    travel.outboundPath = outbound;
    travel.returnPath = [...outbound].reverse().map((point) => ({ ...point }));
    travel.tilesPerTick = context.balanceRelease.facility.characterTravelTilesPerTick;
  };

  for (const encounter of Object.values(state.encounters)) {
    if (encounter.patientLocation) {
      encounter.patientLocation = mapPoint(encounter.patientLocation);
    }
    if (encounter.waitingDestination) {
      encounter.waitingDestination.location = mapPoint(
        encounter.waitingDestination.location,
        recoveryById.has(encounter.waitingDestination.roomInstanceId ?? "")
          ? "waiting"
          : "primary",
      );
    }
    if (
      encounter.patientMovement &&
      (recoveryById.has(encounter.patientMovement.destinationRoomInstanceId ?? "") ||
        routeTouchesLegacyRecovery(encounter.patientMovement.path, legacyPlacements))
    ) {
      const movement = encounter.patientMovement;
      const start = encounter.patientLocation ?? movement.path[movement.pathIndex]!;
      const destinationRoom = recoveryById.get(movement.destinationRoomInstanceId ?? "");
      const destinationDefinition = destinationRoom
        ? definitionFor(destinationRoom.roomDefinitionId)
        : null;
      const destination =
        destinationRoom && destinationDefinition
          ? getRoomNavigationAnchor(destinationRoom, destinationDefinition)
          : mapPoint(movement.path.at(-1) ?? start);
      movement.path = route(mapPoint(start), destination);
      movement.pathIndex = 0;
      encounter.patientLocation = { ...movement.path[0]! };
    }
    migrateFrozenTravel(encounter.pendingResult?.patientTravel ?? null);
    // Completed step results are immutable history. Their frozen travel may
    // name a room that was legitimately demolished after the result returned.
  }

  for (const employee of state.employees) {
    const relevant =
      recoveryById.has(employee.homeRoomInstanceId ?? "") ||
      legacyContainingRecovery(employee.location, legacyPlacements) !== null ||
      routeTouchesLegacyRecovery(employee.path.slice(employee.pathIndex), legacyPlacements);
    if (!relevant) continue;
    const migrated = reroute(employee.path, employee.pathIndex, employee.location, "staff");
    employee.path = migrated.path;
    employee.pathIndex = migrated.pathIndex;
    employee.location = migrated.location;
  }
  const founder = state.environment.founderActivity;
  if (
    legacyContainingRecovery(state.environment.founderLocation, legacyPlacements) ||
    (founder && routeTouchesLegacyRecovery(founder.path.slice(founder.pathIndex), legacyPlacements))
  ) {
    if (founder) {
      const migrated = reroute(
        founder.path,
        founder.pathIndex,
        state.environment.founderLocation,
        "staff",
      );
      founder.path = migrated.path;
      founder.pathIndex = 0;
      state.environment.founderLocation = migrated.location;
    } else {
      state.environment.founderLocation = mapPoint(
        state.environment.founderLocation,
        "staff",
      );
    }
  }
  for (const litter of state.environment.litterItems) {
    if (recoveryById.has(litter.roomId)) {
      litter.location = mapPoint(litter.location, "litter");
    }
  }

  const migrateMobileRoute = <T extends { location: GridPoint | null; path: GridPoint[]; pathIndex: number }>(
    actor: T,
  ): void => {
    if (
      actor.location &&
      (legacyContainingRecovery(actor.location, legacyPlacements) ||
        routeTouchesLegacyRecovery(actor.path.slice(actor.pathIndex), legacyPlacements))
    ) {
      const migrated = reroute(actor.path, actor.pathIndex, actor.location);
      actor.path = migrated.path;
      actor.pathIndex = 0;
      actor.location = migrated.location;
    }
  };
  for (const operation of state.serviceOperations) migrateMobileRoute(operation);
  for (const operation of state.retailOperations) migrateMobileRoute(operation);
  for (const actor of state.retailExternalActors) migrateMobileRoute(actor);
}

/**
 * Converts legacy 4x3 Recovery placements to the approved fixed 6x6 room.
 * The input is never mutated; a failed placement leaves deserialization atomic.
 */
export function migrateApprovedRoomGeometry(
  input: GameState,
  context: DomainContext,
): GameState {
  const legacyPlacements = input.rooms
    .filter((room) => room.roomDefinitionId === RECOVERY_DEFINITION_ID)
    .sort((left, right) => left.id.localeCompare(right.id))
    .map(legacyPlacement);
  const next = cloneState(input);
  if (legacyPlacements.length === 0) {
    next.schemaVersion = 8;
    return next;
  }
  const definitionFor = getDefinitionLookup(context);
  const relocatedRecoveryRoomIds: string[] = [];
  const addedHallwayRoomIds: string[] = [];
  for (let index = 0; index < legacyPlacements.length; index += 1) {
    const legacy = legacyPlacements[index]!;
    const deferredPlacements = legacyPlacements.slice(index + 1);
    const deferredIds = new Set(deferredPlacements.map((placement) => placement.room.id));
    const deferredRooms = next.rooms.filter((room) => deferredIds.has(room.id));
    const deferredDoors = next.doors.filter((door) => deferredIds.has(door.roomId));
    next.rooms = next.rooms.filter((room) => !deferredIds.has(room.id));
    next.doors = next.doors.filter((door) => !deferredIds.has(door.roomId));
    const result = migrateOneRecoveryRoom(
      next,
      legacy,
      deferredPlacements,
      context,
      definitionFor,
    );
    next.rooms.push(...deferredRooms);
    next.doors.push(...deferredDoors);
    if (result.relocated) relocatedRecoveryRoomIds.push(legacy.room.id);
    addedHallwayRoomIds.push(...result.addedHallwayRoomIds);
  }
  reprojectStateReferences(next, legacyPlacements, context, definitionFor);
  next.schemaVersion = 8;
  next.approvedRoomGeometryMigration = {
    version: "approved-room-geometry.v1",
    relocatedRecoveryRoomIds,
    addedHallwayRoomIds,
  };
  return next;
}

/**
 * The approved vertical proofs are counterclockwise domain orientation 270.
 * Legacy 90 placements have the same bounding box, so their absolute door
 * records remain valid while active routes are projected onto the approved
 * fixture mask. Schema-8 development saves are normalized on every load so
 * this remains idempotent without rerunning Recovery expansion.
 */
export function normalizeApprovedRoomOrientations(
  input: GameState,
  context: DomainContext,
): GameState {
  const orientationTargets = new Map<string, 0 | 270>();
  for (const room of input.rooms) {
    if (
      room.roomDefinitionId === "room.front_desk" &&
      (room.orientation === 90 || room.orientation === 270)
    ) {
      throw new Error(
        `Approved navigation migration cannot preserve legacy Front Desk orientation ${room.orientation} without changing its 5x4 footprint.`,
      );
    }
    if (room.roomDefinitionId === "room.front_desk" && room.orientation === 180) {
      orientationTargets.set(room.id, 0);
      continue;
    }
    if (
      APPROVED_RECTANGULAR_ROOM_IDS.has(room.roomDefinitionId) &&
      (room.orientation === 90 || room.orientation === 180)
    ) {
      orientationTargets.set(room.id, room.orientation === 90 ? 270 : 0);
    } else if (
      APPROVED_FIXED_SQUARE_ROOM_IDS.has(room.roomDefinitionId) &&
      room.orientation !== 0
    ) {
      orientationTargets.set(room.id, 0);
    }
  }
  const needsNavigationMigration =
    input.approvedRoomNavigationMigration?.version !==
    "approved-room-navigation.v1";
  if (orientationTargets.size === 0 && !needsNavigationMigration) return input;
  const affectedIds = new Set(
    input.rooms
      .filter((room) => APPROVED_ROOM_IDS.has(room.roomDefinitionId))
      .map((room) => room.id),
  );

  const next = cloneState(input);
  for (const room of next.rooms) {
    const target = orientationTargets.get(room.id);
    if (target !== undefined) room.orientation = target;
  }
  const definitionFor = getDefinitionLookup(context);
  if (needsNavigationMigration || orientationTargets.size > 0) {
    const facility = context.balanceRelease.facility;
    const hallwayDefinition = definitionFor(HALLWAY_DEFINITION_ID);
    if (!hallwayDefinition) throw new Error("Approved navigation migration requires hallway geometry.");
    const protectedIds = new Set(facility.protectedRoomDefinitionIds);
    const usedRoomIds = new Set(next.rooms.map((room) => room.id));
    const usedDoorIds = new Set(next.doors.map((door) => door.id));
    const isProofValid = (door: DoorState): boolean => {
      return areDoorThresholdsProofNavigable(
        door,
        next.rooms,
        next.doors,
        definitionFor,
      );
    };
    const addConnection = (
      room: PlacedRoom,
      doorId: string,
      preferred: GridPoint,
    ): void => {
      const definition = definitionFor(room.roomDefinitionId);
      if (!definition) throw new Error("Approved navigation migration found an unknown room.");
      const size = getRotatedFootprint(definition, room.orientation);
      const candidates: Array<{ door: DoorState; outside: GridPoint; distance: number }> = [];
      for (const side of ["north", "east", "south", "west"] as const) {
        const length = side === "north" || side === "south" ? size.width : size.height;
        for (let offset = 0; offset < length; offset += 1) {
          const door = { id: doorId, roomId: room.id, side, offset, exterior: false } satisfies DoorState;
          const cells = getDoorCells(door, room, definition);
          if (!cells || !isRoomDoorThresholdProofNavigable(
            door,
            room,
            definition,
            [...next.doors.filter((candidate) => candidate.id !== doorId), door],
            next.rooms,
            definitionFor,
          )) continue;
          if (
            cells.outside.x < 0 || cells.outside.y < 0 ||
            cells.outside.x >= facility.gridWidth || cells.outside.y >= facility.gridHeight
          ) continue;
          const outsideOwner = getRoomContainingPoint(cells.outside, next.rooms, definitionFor, room.id);
          if (outsideOwner && definitionFor(outsideOwner.roomDefinitionId)?.kind !== "hallway") continue;
          candidates.push({
            door,
            outside: cells.outside,
            distance: Math.abs(cells.inside.x - preferred.x) + Math.abs(cells.inside.y - preferred.y),
          });
        }
      }
      candidates.sort((left, right) =>
        left.distance - right.distance ||
        left.outside.y - right.outside.y || left.outside.x - right.outside.x ||
        left.door.side.localeCompare(right.door.side) || left.door.offset - right.door.offset,
      );
      const blocked = occupiedClinicalTiles(next.rooms, definitionFor);
      const hallwayKeys = new Set(
        next.rooms.flatMap((candidate) => {
          const candidateDefinition = definitionFor(candidate.roomDefinitionId);
          return candidateDefinition?.kind === "hallway"
            ? getOccupiedTiles(candidate, candidateDefinition).map(pointKey)
            : [];
        }),
      );
      for (const candidate of candidates) {
        const path = shortestPath(
          [candidate.outside],
          hallwayKeys,
          blocked,
          facility.gridWidth,
          facility.gridHeight,
        );
        if (path.length === 0) continue;
        next.doors = [
          ...next.doors.filter((door) => door.id !== doorId),
          candidate.door,
        ];
        for (const point of path) {
          const key = pointKey(point);
          if (hallwayKeys.has(key)) continue;
          const hall: PlacedRoom = {
            id: uniqueId(`room.migration.hall.door.${room.id}.${point.x}.${point.y}`, usedRoomIds),
            roomDefinitionId: hallwayDefinition.id,
            x: point.x,
            y: point.y,
            orientation: 0,
            doorSide: null,
            upgradeLevel: 1,
            cleanliness: 100,
          };
          next.rooms.push(hall);
          hallwayKeys.add(key);
        }
        return;
      }
      throw new Error(`Approved navigation migration could not reconnect door ${doorId}.`);
    };
    const trySharedBoundary = (
      room: PlacedRoom,
      adjacent: PlacedRoom,
      doorId: string,
      preferred: GridPoint,
    ): boolean => {
      const definition = definitionFor(room.roomDefinitionId);
      if (!definition) return false;
      const size = getRotatedFootprint(definition, room.orientation);
      const candidates: Array<{ door: DoorState; distance: number }> = [];
      for (const side of ["north", "east", "south", "west"] as const) {
        const length = side === "north" || side === "south" ? size.width : size.height;
        for (let offset = 0; offset < length; offset += 1) {
          const door = { id: doorId, roomId: room.id, side, offset, exterior: false } satisfies DoorState;
          const cells = getDoorCells(door, room, definition);
          if (!cells) continue;
          const outsideOwner = getRoomContainingPoint(cells.outside, next.rooms, definitionFor, room.id);
          if (outsideOwner?.id !== adjacent.id) continue;
          const effectiveDoors = [...next.doors.filter((candidate) => candidate.id !== doorId), door];
          const key = physicalDoorKey(door, next.rooms, definitionFor);
          if (
            !key ||
            effectiveDoors.some((candidate) =>
              candidate.id !== doorId && physicalDoorKey(candidate, next.rooms, definitionFor) === key,
            ) ||
            !areDoorThresholdsProofNavigable(
              door,
              next.rooms,
              effectiveDoors,
              definitionFor,
            )
          ) continue;
          candidates.push({
            door,
            distance: Math.abs(cells.inside.x - preferred.x) + Math.abs(cells.inside.y - preferred.y),
          });
        }
      }
      candidates.sort((left, right) =>
        left.distance - right.distance ||
        left.door.side.localeCompare(right.door.side) ||
        left.door.offset - right.door.offset,
      );
      const replacement = candidates[0]?.door;
      if (!replacement) return false;
      next.doors = [...next.doors.filter((door) => door.id !== doorId), replacement];
      return true;
    };
    const relocateExteriorEntrance = (door: DoorState): void => {
      const room = next.rooms.find((candidate) => candidate.id === door.roomId);
      const definition = room ? definitionFor(room.roomDefinitionId) : null;
      const previous = room && definition ? getDoorCells(door, room, definition) : null;
      if (!room || !definition || !previous) {
        throw new Error(`Approved navigation migration found invalid exterior door ${door.id}.`);
      }
      const size = getRotatedFootprint(definition, room.orientation);
      const candidates: DoorState[] = [];
      for (let offset = 0; offset < size.width; offset += 1) {
        const candidate = {
          ...door,
          side: "south" as const,
          offset,
          exterior: true,
        };
        const cells = getDoorCells(candidate, room, definition);
        if (
          cells?.outside.y === facility.gridHeight &&
          isRoomDoorThresholdProofNavigable(
            candidate,
            room,
            definition,
            [...next.doors.filter((existing) => existing.id !== door.id), candidate],
            next.rooms,
            definitionFor,
          )
        ) candidates.push(candidate);
      }
      candidates.sort((left, right) => {
        const leftCells = getDoorCells(left, room, definition)!;
        const rightCells = getDoorCells(right, room, definition)!;
        return (
          Math.abs(leftCells.inside.x - previous.inside.x) -
            Math.abs(rightCells.inside.x - previous.inside.x) ||
          left.offset - right.offset
        );
      });
      const replacement = candidates[0];
      if (!replacement) {
        throw new Error(`Approved navigation migration could not relocate exterior door ${door.id}.`);
      }
      next.doors = [
        ...next.doors.filter((existing) => existing.id !== door.id),
        replacement,
      ];
    };
    for (const door of [...next.doors]) {
      if (isProofValid(door)) continue;
      if (door.exterior) {
        relocateExteriorEntrance(door);
        continue;
      }
      const recordedOwner = next.rooms.find((room) => room.id === door.roomId);
      const recordedDefinition = recordedOwner ? definitionFor(recordedOwner.roomDefinitionId) : null;
      const cells = recordedOwner && recordedDefinition
        ? getDoorCells(door, recordedOwner, recordedDefinition)
        : null;
      if (!recordedOwner || !cells) throw new Error(`Approved navigation migration found invalid door ${door.id}.`);
      const touches = next.rooms.filter((room) => {
        const definition = definitionFor(room.roomDefinitionId);
        return Boolean(definition && getOccupiedTiles(room, definition).some((point) =>
          samePoint(point, cells.inside) || samePoint(point, cells.outside),
        ));
      });
      const owner = definitionFor(recordedOwner.roomDefinitionId)?.kind === "hallway"
        ? touches.find((room) => definitionFor(room.roomDefinitionId)?.kind !== "hallway")
        : recordedOwner;
      if (!owner) throw new Error(`Approved navigation migration found no clinical owner for door ${door.id}.`);
      const preferred = touches.some((room) => room.id === owner.id && getOccupiedTiles(
        room,
        definitionFor(room.roomDefinitionId)!,
      ).some((point) => samePoint(point, cells.inside)))
        ? cells.inside
        : cells.outside;
      const adjacent = touches.find((room) => room.id !== owner.id) ?? null;
      const adjacentIsClinical = Boolean(
        adjacent && definitionFor(adjacent.roomDefinitionId)?.kind !== "hallway",
      );
      if (adjacent && adjacentIsClinical && trySharedBoundary(owner, adjacent, door.id, preferred)) {
        continue;
      }
      addConnection(owner, door.id, preferred);
      if (adjacent && adjacentIsClinical) {
        addConnection(
          adjacent,
          uniqueId(`door.migration.reconnect.${door.id}`, usedDoorIds),
          cells.outside,
        );
      }
    }
    const access = validateFacilityAccess(
      next.rooms,
      next.doors,
      definitionFor,
      facility.gridWidth,
      facility.gridHeight,
      protectedIds,
    );
    if (!access.valid) {
      throw new Error(`Approved navigation migration could not preserve access: ${access.reason}`);
    }
  }
  const affectedRooms = next.rooms.filter((room) => affectedIds.has(room.id));
  const containingAffectedRoom = (point: GridPoint): PlacedRoom | null =>
    affectedRooms.find((room) => {
      const definition = definitionFor(room.roomDefinitionId);
      return definition
        ? getOccupiedTiles(room, definition).some((tile) => samePoint(tile, point))
        : false;
    }) ?? null;
  const touchesAffected = (path: readonly GridPoint[]): boolean =>
    path.some((point) => containingAffectedRoom(point) !== null);
  const isInsideFacilityRoom = (point: GridPoint): boolean =>
    next.rooms.some((room) => {
      const definition = definitionFor(room.roomDefinitionId);
      return definition
        ? getOccupiedTiles(room, definition).some((tile) => samePoint(tile, point))
        : false;
    });
  const nearestNavigable = (point: GridPoint): GridPoint => {
    const room = containingAffectedRoom(point);
    const definition = room ? definitionFor(room.roomDefinitionId) : null;
    if (!room || !definition) return { ...point };
    const navigable = getRoomNavigableTiles(room, definition, next.doors, next.rooms, definitionFor);
    return (
      navigable.find((candidate) => samePoint(candidate, point)) ??
      [...navigable].sort(
        (left, right) =>
          Math.abs(left.x - point.x) + Math.abs(left.y - point.y) -
            (Math.abs(right.x - point.x) + Math.abs(right.y - point.y)) ||
          left.y - right.y ||
          left.x - right.x,
      )[0] ??
      getRoomNavigationAnchor(room, definition)
    );
  };
  const route = (start: GridPoint, goal: GridPoint): GridPoint[] => {
    const path = findDeterministicFacilityPath(
      nearestNavigable(start),
      goal,
      next.rooms,
      next.doors,
      definitionFor,
    );
    if (path.length === 0) {
      throw new Error(
        `Approved room orientation migration could not preserve an active route from ${start.x},${start.y} to ${goal.x},${goal.y}.`,
      );
    }
    return path;
  };
  const routeWithExternalTail = (
    start: GridPoint,
    goal: GridPoint,
    remaining: readonly GridPoint[],
  ): GridPoint[] => {
    if (isInsideFacilityRoom(goal)) return route(start, goal);
    let lastFacilityIndex = -1;
    for (let index = remaining.length - 1; index >= 0; index -= 1) {
      if (isInsideFacilityRoom(remaining[index]!)) {
        lastFacilityIndex = index;
        break;
      }
    }
    if (lastFacilityIndex < 0) {
      throw new Error(
        "Approved room orientation migration could not preserve an external route without a facility threshold.",
      );
    }
    const facilityPrefix = route(start, remaining[lastFacilityIndex]!);
    return [
      ...facilityPrefix,
      ...remaining.slice(lastFacilityIndex + 1).map((point) => ({ ...point })),
    ];
  };
  const roomAnchor = (
    roomId: string,
    kind: "primary" | "staff" | "waiting" | "patient" = "primary",
  ): GridPoint | null => {
    const room = next.rooms.find((candidate) => candidate.id === roomId);
    const definition = room ? definitionFor(room.roomDefinitionId) : null;
    if (!room || !definition) return null;
    if (kind === "staff") return getRoomNavigationAnchor(room, definition, "staff");
    if (kind === "patient") {
      return getRoomCareAnchor(room, definition, "patient");
    }
    if (kind === "waiting") {
      return getRoomWaitingAnchors(room, definition)[0] ?? getRoomNavigationAnchor(room, definition);
    }
    return getRoomNavigationAnchor(room, definition);
  };
  const migrateFrozenTravel = (travel: FrozenPatientTravel | null): void => {
    if (
      !travel ||
      (!affectedIds.has(travel.originRoomInstanceId) &&
        !affectedIds.has(travel.destinationRoomInstanceId) &&
        !touchesAffected(travel.outboundPath) &&
        !touchesAffected(travel.returnPath))
    ) return;
    const origin = roomAnchor(travel.originRoomInstanceId);
    const destination = roomAnchor(travel.destinationRoomInstanceId);
    if (!origin || !destination) {
      throw new Error("Approved room orientation migration found an invalid frozen room reference.");
    }
    travel.outboundPath = route(origin, destination);
    travel.returnPath = [...travel.outboundPath].reverse().map((point) => ({ ...point }));
  };

  const occupiedWaitingDestinations = new Set(
    Object.values(next.encounters)
      .map((encounter) => encounter.waitingDestination)
      .filter((destination) =>
        destination && !affectedIds.has(destination.roomInstanceId ?? ""),
      )
      .map((destination) => pointKey(destination!.location)),
  );
  for (const encounter of Object.values(next.encounters)) {
    const previousWaiting = encounter.waitingDestination
      ? { ...encounter.waitingDestination, location: { ...encounter.waitingDestination.location } }
      : null;
    const stationaryAtWaiting = Boolean(
      previousWaiting &&
      encounter.patientLocation &&
      !encounter.patientMovement &&
      samePoint(previousWaiting.location, encounter.patientLocation),
    );
    if (encounter.waitingDestination && affectedIds.has(encounter.waitingDestination.roomInstanceId ?? "")) {
      const room = next.rooms.find((candidate) => candidate.id === encounter.waitingDestination!.roomInstanceId);
      const definition = room ? definitionFor(room.roomDefinitionId) : null;
      if (room && definition && encounter.waitingDestination.kind !== "public_wander") {
        const explicitStandingAnchors = getRoomStandingWaitingAnchors(room, definition);
        const standing = new Set(explicitStandingAnchors.map(pointKey));
        const anchors = getRoomWaitingAnchors(room, definition);
        const chairKeys = new Set(
          anchors.filter((point) => !standing.has(pointKey(point))).map(pointKey),
        );
        const standingCandidates = explicitStandingAnchors.length > 0
          ? explicitStandingAnchors
          : getRoomNavigableTiles(room, definition, next.doors, next.rooms, definitionFor)
              .filter((point) => !chairKeys.has(pointKey(point)));
        const candidates = encounter.waitingDestination.kind === "standing"
          ? standingCandidates
          : anchors.filter((point) => !standing.has(pointKey(point)));
        const current = candidates.find((point) =>
          samePoint(point, encounter.waitingDestination!.location) &&
          !occupiedWaitingDestinations.has(pointKey(point)),
        );
        const replacement = current ?? candidates.find(
          (point) => !occupiedWaitingDestinations.has(pointKey(point)),
        );
        if (!replacement) {
          throw new Error(`Approved navigation migration could not preserve a waiting destination in ${room.id}.`);
        }
        encounter.waitingDestination.location = { ...replacement };
        encounter.waitingDestination.kind = encounter.waitingDestination.kind === "standing"
          ? "standing"
          : "chair";
      } else {
        encounter.waitingDestination.location = nearestNavigable(
          encounter.waitingDestination.location,
        );
      }
      occupiedWaitingDestinations.add(pointKey(encounter.waitingDestination.location));
    }
    if (stationaryAtWaiting && encounter.waitingDestination) {
      encounter.patientLocation = { ...encounter.waitingDestination.location };
    } else if (encounter.patientLocation) {
      encounter.patientLocation = nearestNavigable(encounter.patientLocation);
    }
    if (
      encounter.patientMovement &&
      (affectedIds.has(encounter.patientMovement.destinationRoomInstanceId ?? "") ||
        touchesAffected(encounter.patientMovement.path))
    ) {
      const movement = encounter.patientMovement;
      const start = encounter.patientLocation ?? movement.path[movement.pathIndex] ?? movement.path[0];
      const waitingGoal = movement.kind === "walking_to_waiting" &&
        encounter.waitingDestination &&
        encounter.waitingDestination.roomInstanceId === movement.destinationRoomInstanceId
        ? encounter.waitingDestination.location
        : null;
      const goal = waitingGoal ?? (movement.destinationRoomInstanceId
        ? roomAnchor(movement.destinationRoomInstanceId, "patient")
        : nearestNavigable(movement.path.at(-1) ?? start!));
      if (start && goal) {
        const remaining = movement.path.slice(movement.pathIndex);
        const entryIndex = isInsideFacilityRoom(start)
          ? -1
          : remaining.findIndex(isInsideFacilityRoom);
        movement.path = entryIndex >= 0
          ? [
              ...remaining.slice(0, entryIndex),
              ...route(remaining[entryIndex]!, goal),
            ]
          : routeWithExternalTail(start, goal, remaining);
        movement.pathIndex = 0;
        encounter.patientLocation = { ...movement.path[0]! };
      }
    }
    migrateFrozenTravel(encounter.pendingResult?.patientTravel ?? null);
    // Completed step results are immutable history. Their frozen travel may
    // name a room that was legitimately demolished after the result returned.
  }

  const migrateActor = (
    actor: { location: GridPoint | null; path: GridPoint[]; pathIndex: number },
    goal: GridPoint | null = null,
  ): void => {
    if (!actor.location || (!containingAffectedRoom(actor.location) && !touchesAffected(actor.path.slice(actor.pathIndex)))) return;
    const destination = goal ?? nearestNavigable(actor.path.at(-1) ?? actor.location);
    const remaining = actor.path.slice(actor.pathIndex);
    const entryIndex = isInsideFacilityRoom(actor.location)
      ? -1
      : remaining.findIndex(isInsideFacilityRoom);
    actor.path = entryIndex >= 0
      ? [
          ...remaining.slice(0, entryIndex),
          ...route(remaining[entryIndex]!, destination),
        ]
      : routeWithExternalTail(actor.location, destination, remaining);
    actor.pathIndex = 0;
    actor.location = { ...actor.path[0]! };
  };
  for (const employee of next.employees) {
    migrateActor(
      employee,
      affectedIds.has(employee.homeRoomInstanceId ?? "")
        ? roomAnchor(employee.homeRoomInstanceId!, "staff")
        : null,
    );
  }
  const founder = next.environment.founderActivity;
  if (founder) {
    const actor = {
      location: next.environment.founderLocation,
      path: founder.path,
      pathIndex: founder.pathIndex,
    };
    migrateActor(actor);
    founder.path = actor.path;
    founder.pathIndex = actor.pathIndex;
    next.environment.founderLocation = actor.location!;
  } else {
    next.environment.founderLocation = nearestNavigable(next.environment.founderLocation);
  }
  for (const litter of next.environment.litterItems) {
    if (affectedIds.has(litter.roomId)) litter.location = nearestNavigable(litter.location);
  }
  for (const operation of next.serviceOperations) migrateActor(operation);
  for (const operation of next.retailOperations) migrateActor(operation);
  for (const actor of next.retailExternalActors) migrateActor(actor);

  next.approvedRoomNavigationMigration = {
    version: "approved-room-navigation.v1",
  };

  return next;
}
