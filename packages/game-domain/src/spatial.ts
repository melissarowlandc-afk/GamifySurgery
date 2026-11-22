import type { RoomDefinition } from "@gamify-surgery/balance-config";
import { createFacilityNavigationCache, facilityRouteGraphBuildObserver, NavigationByteCache } from "./facilityNavigation";
export { withFacilityNavigationScope } from "./facilityNavigation";
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

function physicalDoorKey(inside: GridPoint, outside: GridPoint): string {
  return [pointKey(inside), pointKey(outside)].sort().join("|");
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

/**
 * Rotates a definition-local tile into the placed room's local orientation.
 * Navigation metadata stays definition-relative so room rotation moves its
 * fixed furniture masks and task anchors together.
 */
export function rotateRoomLocalPoint(
  point: GridPoint,
  definition: Pick<RoomDefinition, "width" | "height">,
  orientation: RoomOrientation,
): GridPoint {
  if (orientation === 90) {
    return {
      x: definition.height - 1 - point.y,
      y: point.x,
    };
  }
  if (orientation === 180) {
    return {
      x: definition.width - 1 - point.x,
      y: definition.height - 1 - point.y,
    };
  }
  if (orientation === 270) {
    return {
      x: point.y,
      y: definition.width - 1 - point.x,
    };
  }
  return { ...point };
}

function roomLocalToGlobal(
  room: PlacedRoom,
  definition: RoomDefinition,
  point: GridPoint,
): GridPoint {
  const rotated = rotateRoomLocalPoint(
    point,
    definition,
    room.orientation,
  );
  return {
    x: room.x + rotated.x,
    y: room.y + rotated.y,
  };
}

export function getRoomNavigationAnchor(
  room: PlacedRoom,
  definition: RoomDefinition,
  kind: "primary" | "staff" = "primary",
): GridPoint {
  const configured =
    kind === "staff"
      ? definition.navigation?.staffAnchor
      : definition.navigation?.primaryAnchor;
  return configured
    ? roomLocalToGlobal(room, definition, configured)
    : getRoomCenter(room, definition);
}

export function getRoomCareAnchor(
  room: PlacedRoom,
  definition: RoomDefinition,
  kind: "patient" | "clinician",
): GridPoint {
  const configured =
    kind === "patient"
      ? definition.navigation?.patientCareAnchor
      : definition.navigation?.clinicianCareAnchor;
  return configured
    ? roomLocalToGlobal(room, definition, configured)
    : getRoomNavigationAnchor(room, definition, kind === "clinician" ? "staff" : "primary");
}

export interface RoomCareStation {
  id: string;
  kind: "periop_bed";
  patientAnchor: GridPoint;
  facing: CardinalDirection;
}

function hasPlacedPhysicalDoor(key: string, doors: readonly DoorState[], rooms: readonly PlacedRoom[],
  getDefinition: (id: string) => RoomDefinition | null): boolean {
  return doors.some(door => {
    const room = rooms.find(candidate => candidate.id === door.roomId);
    const definition = room && getDefinition(room.roomDefinitionId);
    const cells = room && definition && getDoorCellsForSpatial(door, room, definition);
    return Boolean(cells && physicalDoorKey(cells.inside, cells.outside) === key);
  });
}

function roomFixtureHiddenByDoor(
  room: PlacedRoom,
  definition: RoomDefinition,
  fixtureId: string,
  doors: readonly DoorState[],
  rooms: readonly PlacedRoom[],
  getDefinition: (definitionId: string) => RoomDefinition | null,
  hasPhysicalDoor?: (key: string) => boolean,
): boolean {
  const owner = definition.navigation?.dynamicBlockers?.find(
    (candidate) => candidate.fixtureId === fixtureId,
  );
  if (!owner) return false;
  // A room-only read can see only its own doors. It doesn't need to cache
  // the fixture data or compile a facility layout for that partial geometry.
  const layout = !hasPhysicalDoor && rooms.length > 1 && rooms.includes(room) && getDefinition(room.roomDefinitionId) === definition
    ? getNavigationLayout(rooms, doors, getDefinition) : null;
  let hidden = layout?.hiddenFixtures.get(room.id);
  if (hidden?.has(fixtureId)) return hidden.get(fixtureId)!;
  const result = owner.doorSlots.some((slot) => {
    const localInside = slot.side === "north"
      ? { x: slot.offset, y: 0 }
      : slot.side === "south"
        ? { x: slot.offset, y: definition.height - 1 }
        : slot.side === "west"
          ? { x: 0, y: slot.offset }
          : { x: definition.width - 1, y: slot.offset };
    const inside = roomLocalToGlobal(room, definition, localInside);
    const side = rotateDirection(slot.side, room.orientation);
    const step = side === "north" ? { x: 0, y: -1 }
      : side === "east" ? { x: 1, y: 0 }
        : side === "south" ? { x: 0, y: 1 }
          : { x: -1, y: 0 };
    const expected = physicalDoorKey(inside, { x: inside.x + step.x, y: inside.y + step.y });
    if (hasPhysicalDoor) return hasPhysicalDoor(expected);
    if (layout) return layout.physicalDoors.has(expected);
    return hasPlacedPhysicalDoor(expected, doors, rooms, getDefinition);
  });
  if (layout) {
    if (!hidden) { hidden = new Map(); layout.hiddenFixtures.set(room.id, hidden); }
    hidden.set(fixtureId, result);
  }
  return result;
}

export function getRoomCareStations(
  room: PlacedRoom,
  definition: RoomDefinition,
  doors: readonly DoorState[] = [],
  rooms: readonly PlacedRoom[] = [room],
  getDefinition: (definitionId: string) => RoomDefinition | null = (definitionId) =>
    definitionId === definition.id ? definition : null,
): RoomCareStation[] {
  // Door-owned fixtures are geometry, independent of staffing/operational state.
  // Alternate supplied room/definition objects retain the direct reader path.
  if (rooms.length > 1 && rooms.includes(room) && getDefinition(room.roomDefinitionId) === definition) {
    const layout = getNavigationLayout(rooms, doors, getDefinition);
    let stations = layout.careStations.get(room.id);
    if (!stations) { stations = computeRoomCareStations(room, definition, doors, rooms, getDefinition); layout.careStations.set(room.id, stations); }
    return stations.map(station => ({ ...station, patientAnchor: { ...station.patientAnchor } }));
  }
  return computeRoomCareStations(room, definition, doors, rooms, getDefinition);
}
function computeRoomCareStations(room: PlacedRoom, definition: RoomDefinition, doors: readonly DoorState[], rooms: readonly PlacedRoom[], getDefinition: (id: string) => RoomDefinition | null): RoomCareStation[] {
  return (definition.navigation?.careStations ?? []).flatMap((station) =>
    roomFixtureHiddenByDoor(room, definition, station.id, doors, rooms, getDefinition)
      ? []
      : [{
          id: station.id,
          kind: station.kind,
          patientAnchor: roomLocalToGlobal(room, definition, station.patientAnchor),
          facing: rotateDirection(station.facing, room.orientation),
        }],
  );
}

export function getRoomSharedStaffAnchor(
  room: PlacedRoom,
  definition: RoomDefinition,
): GridPoint {
  const configured = definition.navigation?.sharedStaffAnchor;
  return configured
    ? roomLocalToGlobal(room, definition, configured)
    : getRoomNavigationAnchor(room, definition, "staff");
}

export interface RoomCompanionSeat {
  id: string;
  kind: "armchair";
  anchor: GridPoint;
  facing: CardinalDirection;
}

/** Door-owned seats disappear on either side of the same physical opening. */
export function getRoomCompanionSeats(
  room: PlacedRoom,
  definition: RoomDefinition,
  doors: readonly DoorState[] = [],
  rooms: readonly PlacedRoom[] = [room],
  getDefinition: (definitionId: string) => RoomDefinition | null = (definitionId) =>
    definitionId === definition.id ? definition : null,
): RoomCompanionSeat[] {
  return (definition.navigation?.companionSeats ?? []).flatMap((seat) =>
    roomFixtureHiddenByDoor(room, definition, seat.id, doors, rooms, getDefinition)
      ? []
      : [{ id: seat.id, kind: seat.kind, anchor: roomLocalToGlobal(room, definition, seat.anchor), facing: rotateDirection(seat.facing, room.orientation) }],
  );
}

export function getRoomWaitingAnchors(
  room: PlacedRoom,
  definition: RoomDefinition,
): GridPoint[] {
  return (definition.navigation?.waitingAnchors ?? []).map((point) =>
    roomLocalToGlobal(room, definition, point),
  );
}

export function getRoomStandingWaitingAnchors(
  room: PlacedRoom,
  definition: RoomDefinition,
): GridPoint[] {
  return (definition.navigation?.standingWaitingAnchors ?? []).map((point) =>
    roomLocalToGlobal(room, definition, point),
  );
}

function getRoomBlockedTileKeys(
  room: PlacedRoom,
  definition: RoomDefinition,
  doors: readonly DoorState[] = [],
  rooms: readonly PlacedRoom[] = [room],
  getDefinition: (definitionId: string) => RoomDefinition | null = (definitionId) =>
    definitionId === definition.id ? definition : null,
  hasPhysicalDoor?: (key: string) => boolean,
): Set<string> {
  const blocked = new Set(
    (definition.navigation?.blockedTiles ?? []).map((point) =>
      pointKey(roomLocalToGlobal(room, definition, point)),
    ),
  );
  const dynamic = definition.navigation?.dynamicBlockers ?? [];
  const hiddenByFixture = new Map<string, boolean>();
  for (const owner of dynamic) hiddenByFixture.set(
    owner.fixtureId,
    roomFixtureHiddenByDoor(room, definition, owner.fixtureId, doors, rooms, getDefinition, hasPhysicalDoor),
  );
  const ownersByTile = new Map<string, string[]>();
  for (const owner of dynamic) {
    for (const point of owner.tiles) {
      const key = pointKey(roomLocalToGlobal(room, definition, point));
      ownersByTile.set(key, [...(ownersByTile.get(key) ?? []), owner.fixtureId]);
    }
  }
  for (const [key, owners] of ownersByTile) {
    if (owners.every((fixtureId) => hiddenByFixture.get(fixtureId))) blocked.delete(key);
  }
  return blocked;
}

/**
 * Checks the proof-authored fixture mask at one physical threshold. This does
 * not apply the coarse-grid doorway exception used by pathfinding: a door may
 * clear a blocker only when that blocker explicitly owns the matching slot.
 */
export function isRoomDoorThresholdProofNavigable(
  door: DoorState,
  room: PlacedRoom,
  definition: RoomDefinition,
  doors: readonly DoorState[],
  rooms: readonly PlacedRoom[],
  getDefinition: (definitionId: string) => RoomDefinition | null,
  hasPhysicalDoor?: (key: string) => boolean,
): boolean {
  const cells = getDoorCellsForSpatial(door, room, definition);
  if (!cells) return false;
  const matchesSlot = (slot: { side: CardinalDirection; offset: number }): boolean => {
    const localInside =
      slot.side === "north"
        ? { x: slot.offset, y: 0 }
        : slot.side === "south"
          ? { x: slot.offset, y: definition.height - 1 }
          : slot.side === "west"
            ? { x: 0, y: slot.offset }
            : { x: definition.width - 1, y: slot.offset };
    const inside = roomLocalToGlobal(room, definition, localInside);
    const side = rotateDirection(slot.side, room.orientation);
    const step =
      side === "north" ? { x: 0, y: -1 }
        : side === "east" ? { x: 1, y: 0 }
          : side === "south" ? { x: 0, y: 1 }
            : { x: -1, y: 0 };
    return physicalDoorKey(cells.inside, cells.outside) === physicalDoorKey(inside, {
      x: inside.x + step.x,
      y: inside.y + step.y,
    });
  };
  const allowed = definition.navigation?.allowedDoorSlots;
  if (allowed && !allowed.some(matchesSlot)) return false;
  const atThreshold = (local: GridPoint) => pointKey(roomLocalToGlobal(room, definition, local)) === pointKey(cells.inside);
  const navigation = definition.navigation;
  if (!navigation?.blockedTiles?.some(atThreshold) || navigation.doorThresholdExceptions?.some(matchesSlot)) return true;
  // Door validation supplies a different hypothetical door list for each
  // threshold. Resolve just the fixture(s) that can block this tile.
  const owners = navigation.dynamicBlockers?.filter(owner => owner.tiles.some(atThreshold)) ?? [];
  const lookup = hasPhysicalDoor ?? ((key: string) => hasPlacedPhysicalDoor(key, doors, rooms, getDefinition));
  return owners.length > 0 && owners.every(owner => roomFixtureHiddenByDoor(room, definition, owner.fixtureId, doors, rooms, getDefinition, lookup));
}

function getRoomEndpointOnlyTileKeys(
  room: PlacedRoom,
  definition: RoomDefinition,
): Set<string> {
  return new Set(
    (definition.navigation?.endpointOnlyTiles ?? []).map((point) =>
      pointKey(roomLocalToGlobal(room, definition, point)),
    ),
  );
}

export function getRoomNavigableTiles(
  room: PlacedRoom,
  definition: RoomDefinition,
  doors: readonly DoorState[] = [],
  rooms: readonly PlacedRoom[] = [room],
  getDefinition: (definitionId: string) => RoomDefinition | null = (definitionId) =>
    definitionId === definition.id ? definition : null,
): GridPoint[] {
  const blocked = getRoomBlockedTileKeys(
    room,
    definition,
    doors,
    rooms,
    getDefinition,
  );
  const forcedOpen = new Set<string>();
  for (const door of doors) {
    if (door.roomId !== room.id) {
      continue;
    }
    const cells = getDoorCellsForSpatial(door, room, definition);
    if (cells) {
      forcedOpen.add(pointKey(cells.inside));
    }
  }
  return getOccupiedTiles(room, definition).filter((point) => {
    const key = pointKey(point);
    return !blocked.has(key) || forcedOpen.has(key);
  });
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

export function getDoorCellsForSpatial(
  door: DoorState,
  room: PlacedRoom,
  definition: RoomDefinition,
): { inside: GridPoint; outside: GridPoint } | null {
  const footprint = getRotatedFootprint(definition, room.orientation);
  const wallLength =
    door.side === "north" || door.side === "south"
      ? footprint.width
      : footprint.height;
  if (door.offset < 0 || door.offset >= wallLength) {
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
  const step =
    door.side === "north"
      ? { x: 0, y: -1 }
      : door.side === "east"
        ? { x: 1, y: 0 }
        : door.side === "south"
          ? { x: 0, y: 1 }
          : { x: -1, y: 0 };
  return {
    inside,
    outside: {
      x: inside.x + step.x,
      y: inside.y + step.y,
    },
  };
}

type RouteLink = { to: number; approach?: number; roomOwner?: number };
type RouteSteps = ReadonlyMap<number, readonly number[]>;
type NavigationTopology = {
  hallway: Uint8Array;
  owners: Uint32Array;
  endpointOwners: Map<number, number>;
  neighbors: Uint32Array;
  links: Map<number, RouteLink[]>;
  waitingDoors: Map<number, number[][]>;
  legacy: boolean;
  offsets: Uint32Array;
  steps: Uint32Array;
  // All searches are synchronous and never call the definition reader.
  queue: Uint32Array;
  parent: Uint32Array;
};

type NavigationLayout = {
  id: number;
  estimatedBytes: number;
  physicalDoors: Set<string>;
  hiddenFixtures: Map<string, Map<string, boolean>>;
  careStations: Map<string, RoomCareStation[]>;
  ids: Map<string, number>;
  keys: string[];
  points: GridPoint[];
  roomsAt: (number | number[] | undefined)[];
  roomTiles: Map<string, number[]>;
  topology?: NavigationTopology;
};

// Global budgets across layouts. Cached routes hold tile IDs, never point
// objects or a reference to an evicted layout. Each layout reserves space for
// its lazy topology and fixture data when admitted.
const navigationLayout = createFacilityNavigationCache<NavigationLayout>({
  maxBytes: 2 * 1024 * 1024,
  estimateBytes: layout => layout.estimatedBytes,
});
const routes = new NavigationByteCache<Uint32Array>(1536 * 1024);
const endpointChanges = new NavigationByteCache<RouteSteps>(256 * 1024);
const blockedMasks = new NavigationByteCache<{ id: number; tiles: Uint8Array }>(256 * 1024);
let nextLayoutId = 0;
let nextMaskId = 0;

function getNavigationLayout(rooms: readonly PlacedRoom[], doors: readonly DoorState[], getDefinition: (id: string) => RoomDefinition | null): NavigationLayout {
  return navigationLayout(rooms, doors, getDefinition, () => {
    const ids = new Map<string, number>(), keys = [""], points: GridPoint[] = [{ x: 0, y: 0 }];
    const roomsAt: NavigationLayout["roomsAt"] = [], roomTiles = new Map<string, number[]>();
    const physicalDoors = new Set<string>(), byId = new Map<string, PlacedRoom>();
    const addTile = (point: GridPoint): number => {
      const key = pointKey(point), prior = ids.get(key);
      if (prior !== undefined) return prior;
      const id = keys.length;
      keys.push(key); points.push(parsePointKey(key)); ids.set(key, id);
      return id;
    };
    let estimatedBytes = 1024 + rooms.length * 384 + doors.length * 576;
    rooms.forEach((room, index) => {
      if (!byId.has(room.id)) byId.set(room.id, room);
      const definition = getDefinition(room.roomDefinitionId);
      if (!definition) return;
      const tiles = getOccupiedTiles(room, definition).map(addTile);
      roomTiles.set(room.id, tiles);
      for (const tile of tiles) {
        const previous = roomsAt[tile];
        if (Array.isArray(previous)) previous.push(index);
        else roomsAt[tile] = previous === undefined ? index : [previous, index];
      }
      if (!doors.length) {
        const legacyThreshold = getRoomDoorCell(room, definition);
        if (legacyThreshold) addTile(legacyThreshold);
      }
      estimatedBytes += tiles.length * 16 + (definition.navigation?.dynamicBlockers?.length ?? 0) * 128 +
        (definition.navigation?.careStations?.length ?? 0) * 256;
    });
    for (const door of doors) {
      const room = byId.get(door.roomId), definition = room ? getDefinition(room.roomDefinitionId) : null;
      const cells = room && definition ? getDoorCellsForSpatial(door, room, definition) : null;
      if (cells) physicalDoors.add(physicalDoorKey(cells.inside, cells.outside));
    }
    return { id: ++nextLayoutId, estimatedBytes: estimatedBytes + keys.length * 224, physicalDoors,
      hiddenFixtures: new Map(), careStations: new Map(), ids, keys, points, roomsAt, roomTiles };
  });
}

function occupant(layout: NavigationLayout, tile: number): number | undefined {
  const indices = layout.roomsAt[tile];
  return Array.isArray(indices) ? indices[0] : indices;
}

/** One base layout read for an ordered batch of door previews. */
export function prepareDoorThresholdOccupants(rooms: readonly PlacedRoom[], doors: readonly DoorState[], getDefinition: (id: string) => RoomDefinition | null) {
  const layout = getNavigationLayout(rooms, doors, getDefinition);
  return (point: GridPoint): readonly number[] => {
    const indices = layout.roomsAt[layout.ids.get(pointKey(point)) ?? 0];
    return Array.isArray(indices) ? indices : indices === undefined ? [] : [indices];
  };
}

/** Geometry index; return the current state's room, never a retained room record. */
export function getFacilityRoomAtPoint(point: GridPoint, rooms: readonly PlacedRoom[], doors: readonly DoorState[], getDefinition: (id: string) => RoomDefinition | null, accepts: (room: PlacedRoom) => boolean): PlacedRoom | null {
  const layout = getNavigationLayout(rooms, doors, getDefinition);
  const indices = layout.roomsAt[layout.ids.get(pointKey(point)) ?? 0];
  if (!Array.isArray(indices)) return indices === undefined || !accepts(rooms[indices]!) ? null : rooms[indices]!;
  for (const index of indices) if (accepts(rooms[index]!)) return rooms[index]!;
  return null;
}

function walkOwner(graph: NavigationTopology, tile: number, opened?: ReadonlySet<number>): number {
  return (opened?.has(tile) ? graph.endpointOwners.get(tile) : undefined) ?? graph.owners[tile]!;
}

function hasFloor(graph: NavigationTopology, tile: number, opened?: ReadonlySet<number>): boolean {
  return Boolean(graph.hallway[tile] || walkOwner(graph, tile, opened));
}

function keyOrder(layout: NavigationLayout, a: number, b: number): number {
  const left = layout.keys[a]!, right = layout.keys[b]!;
  return left < right ? -1 : Number(left !== right);
}

function orderSteps(layout: NavigationLayout, graph: NavigationTopology, tile: number, choices: readonly number[]): number[] {
  const cardinal: number[] = [], extra = new Set(choices);
  for (let slot = tile * 4; slot < tile * 4 + 4; slot++) {
    const next = graph.neighbors[slot]!;
    if (extra.delete(next)) cardinal.push(next);
  }
  return cardinal.concat([...extra].sort((a, b) => keyOrder(layout, a, b)));
}

function stepsFromFloor(layout: NavigationLayout, graph: NavigationTopology, tile: number, opened?: ReadonlySet<number>): number[] {
  const steps: number[] = [];
  const owner = walkOwner(graph, tile, opened), hall = graph.hallway[tile];
  if (owner || hall) for (let slot = tile * 4; slot < tile * 4 + 4; slot++) {
    const next = graph.neighbors[slot]!;
    if (!next) continue;
    const nextOwner = walkOwner(graph, next, opened), nextHall = graph.hallway[next];
    if (owner && owner === nextOwner || hall && nextHall || graph.legacy && (hall && nextOwner || nextHall && owner)) steps.push(next);
  }
  const links = graph.links.get(tile);
  if (!links) return steps;
  for (const link of links) {
    if (link.approach !== undefined && !hasFloor(graph, link.approach, opened)) continue;
    if (link.roomOwner !== undefined && (owner !== link.roomOwner || walkOwner(graph, link.to, opened) !== owner)) continue;
    steps.push(link.to);
  }
  return orderSteps(layout, graph, tile, steps);
}

function navigationTopology(layout: NavigationLayout, rooms: readonly PlacedRoom[], doors: readonly DoorState[],
  getDefinition: (id: string) => RoomDefinition | null): NavigationTopology {
  if (layout.topology) return layout.topology;
  const size = layout.keys.length;
  const graph: NavigationTopology = {
    hallway: new Uint8Array(size), owners: new Uint32Array(size), endpointOwners: new Map(),
    neighbors: new Uint32Array(size * 4), links: new Map(), waitingDoors: new Map(), legacy: doors.length === 0,
    offsets: new Uint32Array(size + 1), steps: new Uint32Array(0),
    queue: new Uint32Array(size), parent: new Uint32Array(size),
  };
  const tileId = (point: GridPoint) => layout.ids.get(pointKey(point)) ?? 0;
  const byId = new Map<string, PlacedRoom>(), roomOwners = new Map<string, number>();
  const forcedOpen = new Set<number>(), contacts = new Set<number>();
  const doorEdges: { inside: number; outside: number; connects: boolean }[] = [];
  for (const room of rooms) if (!byId.has(room.id)) {
    byId.set(room.id, room); roomOwners.set(room.id, byId.size);
  }
  for (const door of doors) {
    const room = byId.get(door.roomId), definition = room && getDefinition(room.roomDefinitionId);
    const cells = room && definition && getDoorCellsForSpatial(door, room, definition);
    if (!cells) continue;
    const inside = tileId(cells.inside), outside = tileId(cells.outside);
    forcedOpen.add(inside); forcedOpen.add(outside);
    doorEdges.push({ inside, outside, connects: !door.exterior && definition.kind !== "hallway" });
  }
  const anyOwners = new Uint32Array(size);
  const hasPhysicalDoor = (key: string) => layout.physicalDoors.has(key);
  for (const room of rooms) {
    const definition = getDefinition(room.roomDefinitionId);
    if (!definition) continue;
    for (const key of getRoomEndpointOnlyTileKeys(room, definition)) {
      const id = layout.ids.get(key);
      if (id !== undefined) contacts.add(id);
    }
    const hallway = definition.kind === "hallway";
    const blocked = hallway ? null : getRoomBlockedTileKeys(room, definition, doors, rooms, getDefinition, hasPhysicalDoor);
    for (const point of getOccupiedTiles(room, definition)) {
      const tile = tileId(point);
      if (hallway) graph.hallway[tile] = 1;
      else {
        const owner = roomOwners.get(room.id)!;
        anyOwners[tile] = owner;
        if (!blocked!.has(layout.keys[tile]!) || forcedOpen.has(tile)) graph.owners[tile] = owner;
      }
    }
  }
  for (const tile of contacts) graph.endpointOwners.set(tile, anyOwners[tile]!);
  const link = (left: number, right: number, rule: Omit<RouteLink, "to"> = {}) => {
    if (!left || !right) return;
    for (const [from, to] of [[left, right], [right, left]]) {
      const adjacent = graph.links.get(from!) ?? [];
      adjacent.push({ to: to!, ...rule }); graph.links.set(from!, adjacent);
    }
  };
  for (const { inside, outside, connects } of doorEdges) if (connects) link(inside, outside);
  for (const room of rooms) {
    const definition = getDefinition(room.roomDefinitionId);
    if (!definition) continue;
    const owner = roomOwners.get(room.id)!;
    if (graph.legacy) {
      const inside = getRoomDoorCell(room, definition), approach = getRoomDoorApproachCell(room, definition);
      if (inside && approach) link(tileId(inside), tileId(approach), { approach: tileId(approach) });
    } else if (room.roomDefinitionId === "room.periop_recovery" && definition.navigation?.companionSeats?.length) {
      // Retain the approved diagonal aisle from a forced-open corner.
      const { width, height } = getRotatedFootprint(definition, room.orientation);
      for (const x of [0, width - 1]) for (const y of [0, height - 1]) {
        const corner = tileId({ x: room.x + x, y: room.y + y });
        if (forcedOpen.has(corner)) link(corner, tileId({ x: room.x + x + (x === 0 ? 1 : -1), y: room.y + y + (y === 0 ? 1 : -1) }), { roomOwner: owner });
      }
    } else if (room.roomDefinitionId === "room.waiting") {
      const thresholds = doors.filter(door => !door.exterior && door.roomId === room.id).flatMap(door => {
        const cells = getDoorCellsForSpatial(door, room, definition);
        return cells ? [tileId(cells.inside)] : [];
      });
      if (thresholds.length) {
        const groups = graph.waitingDoors.get(owner) ?? [];
        groups.push(thresholds); graph.waitingDoors.set(owner, groups);
      }
    }
  }
  const allSteps: number[] = [];
  for (let tile = 1; tile < size; tile++) {
    const point = layout.points[tile]!;
    CARDINAL_STEPS.forEach((step, slot) => { graph.neighbors[tile * 4 + slot] = tileId({ x: point.x + step.x, y: point.y + step.y }); });
    graph.offsets[tile] = allSteps.length;
    allSteps.push(...stepsFromFloor(layout, graph, tile));
  }
  graph.offsets[size] = allSteps.length;
  graph.steps = Uint32Array.from(allSteps);
  facilityRouteGraphBuildObserver?.("[]");
  layout.topology = graph;
  return graph;
}

function waitingComponent(graph: NavigationTopology, start: number, owner: number, opened: ReadonlySet<number>, changes: RouteSteps): Set<number> {
  const component = new Set<number>();
  if (walkOwner(graph, start, opened) !== owner) return component;
  const queue = [start];
  component.add(start);
  for (const tile of queue) {
    for (const next of changes.get(tile) ?? graph.steps.subarray(graph.offsets[tile], graph.offsets[tile + 1])) {
      if (walkOwner(graph, next, opened) !== owner || component.has(next)) continue;
      component.add(next); queue.push(next);
    }
  }
  return component;
}

function addWaitingBridges(layout: NavigationLayout, graph: NavigationTopology, opened: ReadonlySet<number>, changes: Map<number, readonly number[]>): void {
  const owners = new Set([...opened].map(tile => walkOwner(graph, tile, opened)));
  const comparePoints = (a: number, b: number) => layout.points[a]!.y - layout.points[b]!.y || layout.points[a]!.x - layout.points[b]!.x;
  for (const owner of owners) for (const thresholds of graph.waitingDoors.get(owner) ?? []) {
    const doors = new Set<number>();
    for (const door of thresholds) for (const tile of waitingComponent(graph, door, owner, opened, changes)) doors.add(tile);
    for (const endpoint of opened) {
      if (walkOwner(graph, endpoint, opened) !== owner) continue;
      const component = [...waitingComponent(graph, endpoint, owner, opened, changes)];
      if (component.some(tile => doors.has(tile))) continue;
      // Pick the first diagonal in the original (left y/x, right y/x) order.
      const orderedDoors = [...doors].sort(comparePoints);
      for (const left of component.sort(comparePoints)) {
        const point = layout.points[left]!;
        const right = orderedDoors.find(tile => Math.abs(point.x - layout.points[tile]!.x) === 1 && Math.abs(point.y - layout.points[tile]!.y) === 1);
        if (right === undefined) continue;
        for (const [from, to] of [[left, right], [right, left]] as const) {
          const current = changes.get(from) ?? graph.steps.subarray(graph.offsets[from], graph.offsets[from + 1]);
          changes.set(from, orderSteps(layout, graph, from, [...current, to]));
        }
        break;
      }
    }
  }
}

function endpointOverlay(layout: NavigationLayout, graph: NavigationTopology, start: number, goal: number): RouteSteps | undefined {
  const tiles = [start, goal].filter(tile => {
    const owner = graph.endpointOwners.get(tile);
    return owner !== undefined && (owner !== graph.owners[tile] || graph.waitingDoors.has(owner));
  });
  if (tiles.length === 0) return undefined;
  const opened = new Set(tiles.sort((a, b) => keyOrder(layout, a, b)));
  const key = `${layout.id}:${[...opened].join(",")}`;
  const cached = endpointChanges.get(key);
  if (cached) return cached;
  const affected = new Set<number>();
  for (const tile of opened) if (graph.endpointOwners.get(tile) !== graph.owners[tile]) {
    affected.add(tile);
    for (let slot = tile * 4; slot < tile * 4 + 4; slot++) {
      const next = graph.neighbors[slot]!;
      if (next) affected.add(next);
    }
    for (const link of graph.links.get(tile) ?? []) affected.add(link.to);
  }
  const changes = new Map<number, readonly number[]>();
  for (const tile of affected) changes.set(tile, stepsFromFloor(layout, graph, tile, opened));
  addWaitingBridges(layout, graph, opened, changes);
  // The start/goal may be newly opened but isolated. An empty entry can
  // therefore still denote a legal endpoint, as opposed to an absent tile.
  endpointChanges.set(key, changes, 64 + [...changes.values()].reduce((bytes, steps) => bytes + 128 + steps.length * 8, 0));
  return changes;
}

/** Opening-only preparation. The compact topology stays private. */
export function prepareFacilityPathfinding(rooms: readonly PlacedRoom[], doors: readonly DoorState[], getDefinition: (id: string) => RoomDefinition | null): void {
  navigationTopology(getNavigationLayout(rooms, doors, getDefinition), rooms, doors, getDefinition);
}

/** Connected floor, including occupied thresholds, for the Build exit check. */
export function reachableFacilityRooms(start: GridPoint, rooms: readonly PlacedRoom[], doors: readonly DoorState[],
  getDefinition: (id: string) => RoomDefinition | null): Set<string> {
  const layout = getNavigationLayout(rooms, doors, getDefinition);
  const graph = navigationTopology(layout, rooms, doors, getDefinition);
  const origin = layout.ids.get(pointKey(start));
  const reached = new Set<string>();
  if (origin === undefined) return reached;
  const visited = new Set([origin]), queue = [origin];
  for (const tile of queue) {
    const index = occupant(layout, tile);
    const roomId = index !== undefined ? rooms[index]?.id : undefined;
    if (roomId) reached.add(roomId);
    for (let i = graph.offsets[tile]!; i < graph.offsets[tile + 1]!; i++) {
      const next = graph.steps[i]!;
      if (!visited.has(next)) { visited.add(next); queue.push(next); }
    }
  }
  return reached;
}

function routeMask(layout: NavigationLayout, blockedIds: readonly string[]) {
  if (blockedIds.length === 0) return undefined;
  const key = `${layout.id}:${JSON.stringify(blockedIds)}`;
  const cached = blockedMasks.get(key);
  if (cached) return cached;
  const tiles = new Uint8Array(layout.keys.length);
  for (const id of blockedIds) for (const tile of layout.roomTiles.get(id) ?? []) tiles[tile] = 1;
  const mask = { id: ++nextMaskId, tiles };
  blockedMasks.set(key, mask, tiles.byteLength + 96);
  return mask;
}

function findRoute(graph: NavigationTopology, start: number, goal: number, blocked: Uint8Array | undefined,
  changes: RouteSteps | undefined, displaced: readonly number[] | undefined): Uint32Array {
  const { parent, queue, offsets, steps } = graph;
  parent.fill(0); parent[start] = start; queue[0] = start;
  let tail = 1;
  for (let head = 0; head < tail; head++) {
    const tile = queue[head]!;
    if (tile === goal) {
      let size = 1;
      for (let cursor = goal; cursor !== start; cursor = parent[cursor]!) size++;
      const path = new Uint32Array(size);
      for (let cursor = goal; size; cursor = parent[cursor]!) path[--size] = cursor;
      return path;
    }
    const local = (tile === start ? displaced : undefined) ?? changes?.get(tile);
    const neighbors = local ?? steps;
    for (let i = local ? 0 : offsets[tile]!; i < (local?.length ?? offsets[tile + 1]!); i++) {
      const next = neighbors[i]!;
      if (parent[next] || blocked?.[next]) continue;
      parent[next] = tile; queue[tail++] = next;
    }
  }
  return EMPTY_ROUTE;
}

const EMPTY_ROUTE = new Uint32Array(0);

export function findDeterministicFacilityPath(
  start: GridPoint,
  goal: GridPoint,
  rooms: readonly PlacedRoom[],
  doors: readonly DoorState[],
  getDefinition: (id: string) => RoomDefinition | null,
  options: { blockedRoomInstanceIds?: ReadonlySet<string> } = {},
): GridPoint[] {
  const layout = getNavigationLayout(rooms, doors, getDefinition);
  const from = layout.ids.get(pointKey(start)), to = layout.ids.get(pointKey(goal));
  if (from === undefined || to === undefined) return [];
  const startIndex = occupant(layout, from);
  const startRoomId = startIndex !== undefined ? rooms[startIndex]?.id : undefined;
  const blockedIds = [...(options.blockedRoomInstanceIds ?? [])].filter(id => id !== startRoomId && layout.roomTiles.has(id)).sort();
  const mask = routeMask(layout, blockedIds);
  const routeKey = `${layout.id}:${from}:${to}:${mask?.id ?? 0}`;
  const cached = routes.get(routeKey);
  if (cached) return Array.from(cached, tile => ({ ...layout.points[tile]! }));

  const graph = navigationTopology(layout, rooms, doors, getDefinition);
  const changes = endpointOverlay(layout, graph, from, to);
  const walkable = (tile: number) => !mask?.tiles[tile] && (hasFloor(graph, tile) ||
    Boolean(graph.endpointOwners.get(tile) && (tile === from || tile === to)) ||
    Boolean(changes?.get(tile)?.length ?? (graph.offsets[tile]! < graph.offsets[tile + 1]!)));
  let displaced: number[] | undefined;
  if (!walkable(from) && startRoomId) {
    // v6 origins on newly blocked fixtures may walk out, never teleport.
    const occupied = layout.roomTiles.get(startRoomId) ?? [];
    displaced = [...graph.neighbors.subarray(from * 4, from * 4 + 4)].filter(tile => tile && occupied.includes(tile) && walkable(tile));
  }
  const result = (displaced || walkable(from)) && (from === to && displaced || walkable(to))
    ? findRoute(graph, from, to, mask?.tiles, changes, displaced) : EMPTY_ROUTE;
  routes.set(routeKey, result, 64 + result.byteLength);
  return Array.from(result, tile => ({ ...layout.points[tile]! }));
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
    return [getRoomNavigationAnchor(origin, originDefinition)];
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
  return findDeterministicFacilityPath(
    getRoomNavigationAnchor(origin, originDefinition),
    getRoomNavigationAnchor(destination, destinationDefinition),
    rooms,
    doors,
    getDefinition,
  );
}

export function getFacilityWalkableTileKeys(
  rooms: readonly PlacedRoom[],
  getDefinition: (definitionId: string) => RoomDefinition | null,
  doors: readonly DoorState[] = [],
): Set<string> {
  const walkable = hallwayTileKeys(rooms, getDefinition);
  for (const room of rooms) {
    const definition = getDefinition(room.roomDefinitionId);
    if (!definition || definition.kind === "hallway") {
      continue;
    }
    for (const point of getRoomNavigableTiles(
      room,
      definition,
      doors,
    )) {
      walkable.add(pointKey(point));
    }
    const approach = getRoomDoorApproachCell(room, definition);
    if (approach) {
      walkable.add(pointKey(approach));
    }
  }
  return walkable;
}
