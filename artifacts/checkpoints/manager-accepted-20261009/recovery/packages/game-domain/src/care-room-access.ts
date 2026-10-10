import { getRoomDefinition } from "./selectors";
import { findDeterministicFacilityPath, getOccupiedTiles } from "./spatial";
import type { DomainContext, GameState, GridPoint, PlacedRoom } from "./types";

const PROTECTED_CARE_ROOM_DEFINITION_IDS = new Set([
  "room.examination",
  "room.pediatric_examination",
  "room.wound_ostomy",
  "room.minor_procedure",
  "room.endoscopy",
  "room.ambulatory_or",
  "room.xray",
  "room.ultrasound",
  "room.ct",
  "room.mri",
  "room.phlebotomy",
  "room.glp1_telehealth_suite",
  "room.periop_recovery",
]);

export function isProtectedCareRoomDefinitionId(definitionId: string): boolean {
  return PROTECTED_CARE_ROOM_DEFINITION_IDS.has(definitionId);
}

export function isProtectedCareRoom(room: PlacedRoom): boolean {
  return isProtectedCareRoomDefinitionId(room.roomDefinitionId);
}

export function protectedCareRoomAtPoint(
  state: GameState,
  context: DomainContext,
  point: GridPoint,
): PlacedRoom | null {
  return state.rooms.find((room) => {
    if (!isProtectedCareRoom(room)) return false;
    const definition = getRoomDefinition(room.roomDefinitionId, context);
    return Boolean(definition && getOccupiedTiles(room, definition).some(
      (tile) => tile.x === point.x && tile.y === point.y,
    ));
  }) ?? null;
}

export function findCareAwareFacilityPath(
  state: GameState,
  context: DomainContext,
  start: GridPoint,
  goal: GridPoint,
  allowedProtectedRoomInstanceIds: ReadonlySet<string> = new Set(),
): GridPoint[] {
  const goalRoom = protectedCareRoomAtPoint(state, context, goal);
  if (goalRoom && !allowedProtectedRoomInstanceIds.has(goalRoom.id) &&
      (start.x !== goal.x || start.y !== goal.y)) {
    return [];
  }
  const blocked = new Set(
    state.rooms
      .filter((room) => isProtectedCareRoom(room) && !allowedProtectedRoomInstanceIds.has(room.id))
      .map((room) => room.id),
  );
  return findDeterministicFacilityPath(
    start,
    goal,
    state.rooms,
    state.doors,
    (definitionId) => getRoomDefinition(definitionId, context),
    { blockedRoomInstanceIds: blocked },
  );
}

export function pathEntersUnauthorizedProtectedRoom(
  state: GameState,
  context: DomainContext,
  path: readonly GridPoint[],
  pathIndex: number,
  allowedProtectedRoomInstanceIds: ReadonlySet<string> = new Set(),
): boolean {
  const startRoom = path[pathIndex]
    ? protectedCareRoomAtPoint(state, context, path[pathIndex]!)
    : null;
  const goalRoom = path.at(-1)
    ? protectedCareRoomAtPoint(state, context, path.at(-1)!)
    : null;
  if (goalRoom && !allowedProtectedRoomInstanceIds.has(goalRoom.id)) return true;
  return path.slice(pathIndex + 1).some((point) => {
    const room = protectedCareRoomAtPoint(state, context, point);
    return Boolean(
      room &&
      room.id !== startRoom?.id &&
      !allowedProtectedRoomInstanceIds.has(room.id),
    );
  });
}
