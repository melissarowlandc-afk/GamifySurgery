import type { GridPoint, PlacedRoom } from "./types";

/**
 * Where an idle employee can settle inside their assigned room, besides
 * standing on an ordinary floor tile. "seat" is a chair or stool; a
 * "workstation" is a computer, screen or bench the employee faces. Tiles are
 * room-local for the authored orientation, so a rotated room lists its own
 * tiles rather than rotating the base ones (its furniture art differs).
 *
 * Presentation draws the pose for each spot id; the id is shared with
 * `apps/player/src/facility/staffIdleSupports.ts`.
 */
export type EmployeeIdleSpotKind = "seat" | "workstation";

export interface EmployeeIdleSpot {
  readonly id: string;
  readonly kind: EmployeeIdleSpotKind;
  readonly tile: GridPoint;
}

type AuthoredOrientation = 0 | 270;

const spot = (id: string, kind: EmployeeIdleSpotKind, x: number, y: number): EmployeeIdleSpot => ({ id, kind, tile: { x, y } });

const EMPLOYEE_IDLE_SPOTS: Readonly<Record<string, Partial<Record<AuthoredOrientation, readonly EmployeeIdleSpot[]>>>> = {
  "room.periop_recovery": { 0: [spot("recovery:stool-1", "seat", 2, 2), spot("recovery:stool-2", "seat", 3, 2)] },
  "room.ultrasound": { 0: [spot("ultrasound:stool", "seat", 2, 2), spot("ultrasound:console", "workstation", 0, 2)] },
  "room.xray": { 0: [spot("xray:console", "workstation", 2, 1)] },
  "room.ct": { 0: [spot("ct:console", "workstation", 3, 2)] },
  "room.endoscopy": {
    0: [spot("endoscopy:stool", "seat", 3, 1), spot("endoscopy:tower", "workstation", 2, 0)],
    270: [spot("endoscopy:stool", "seat", 2, 0), spot("endoscopy:tower", "workstation", 1, 0)],
  },
  "room.phlebotomy": {
    0: [spot("phlebotomy:stool", "seat", 1, 1)],
    270: [spot("phlebotomy:stool", "seat", 1, 1)],
  },
  "room.surgeon_office": { 0: [spot("surgeon-office:desk", "seat", 1, 0)] },
  "room.ambulatory_or": { 0: [spot("ambulatory-or:workstation", "workstation", 0, 0)] },
  "room.laboratory": { 0: [spot("laboratory:bench", "workstation", 1, 2)] },
  "room.pharmacy": { 0: [spot("pharmacy:computer", "workstation", 2, 0)] },
  "room.maintenance_workshop": { 0: [spot("maintenance:bench", "workstation", 1, 2)] },
};

/** Room-local idle spots authored for this room's orientation (none for others). */
export function getEmployeeIdleSpots(
  roomDefinitionId: string,
  orientation: number,
): readonly EmployeeIdleSpot[] {
  if (orientation !== 0 && orientation !== 270) return [];
  return EMPLOYEE_IDLE_SPOTS[roomDefinitionId]?.[orientation] ?? [];
}

/** The idle spots of a placed room, in facility tiles. */
export function getPlacedRoomIdleSpots(room: PlacedRoom): readonly EmployeeIdleSpot[] {
  return getEmployeeIdleSpots(room.roomDefinitionId, room.orientation).map((candidate) => ({
    ...candidate,
    tile: { x: room.x + candidate.tile.x, y: room.y + candidate.tile.y },
  }));
}

/** The idle spot whose tile is `location` in this placed room, if any. */
export function getPlacedRoomIdleSpotAt(
  room: PlacedRoom,
  location: GridPoint | undefined,
): EmployeeIdleSpot | undefined {
  if (!location) return undefined;
  return getPlacedRoomIdleSpots(room).find((candidate) =>
    candidate.tile.x === location.x && candidate.tile.y === location.y);
}
