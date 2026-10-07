import type { RoomOrientation } from "@gamify-surgery/game-domain";

import {
  resolveApprovedRoomActorSupports,
  type ApprovedActorSupport,
} from "./approvedRoomPresentation";

/**
 * Poses for the idle spots in `packages/game-domain/src/employee-idle-spots.ts`
 * (same ids). Chairs that already seat a clinician reuse that approved seat;
 * new seats and workstations are measured from the room art. A workstation
 * stays within a small sidestep of the walker's floor point (tile x + .5,
 * y + .72) and turns them to face the screen.
 */
type Facing = ApprovedActorSupport["facing"];

const standing = (id: string, facing: Facing, x: number, y: number): ApprovedActorSupport => ({
  id, role: "staff-idle", pose: "standing", facing,
  seat: { x, y }, ground: { x, y }, fixtureGround: { x, y },
});

const seated = (
  id: string,
  facing: Facing,
  seat: Readonly<{ x: number; y: number }>,
  ground: Readonly<{ x: number; y: number }>,
): ApprovedActorSupport => ({ id, role: "staff-idle", pose: "seated", facing, seat, ground, fixtureGround: ground });

/** Re-roles an existing approved clinician seat or post as an idle spot. */
const reuse = (id: string, definitionId: string, orientation: RoomOrientation, supportId: string): ApprovedActorSupport[] => {
  const source = resolveApprovedRoomActorSupports(definitionId, orientation).find((candidate) => candidate.id === supportId);
  return source ? [{ ...source, id, role: "staff-idle" }] : [];
};

// Desk and machine spots stand just south of the furniture's floor line so
// the walker draws in front of it, not behind it.
const AUTHORED: Readonly<Record<string, Partial<Record<0 | 270, () => readonly ApprovedActorSupport[]>>>> = {
  "room.periop_recovery": {
    // Nurse-station stools face the camera behind the station monitors.
    0: () => [
      seated("recovery:stool-1", "south", { x: 2.5, y: 1.67 }, { x: 2.5, y: 2.2 }),
      seated("recovery:stool-2", "south", { x: 3.5, y: 1.67 }, { x: 3.5, y: 2.2 }),
    ],
  },
  "room.ultrasound": {
    0: () => [
      ...reuse("ultrasound:stool", "room.ultrasound", 0, "stool:clinician"),
      standing("ultrasound:console", "north", .75, 2.72),
    ],
  },
  "room.xray": { 0: () => [standing("xray:console", "north", 2.45, 1.95)] },
  "room.ct": { 0: () => [standing("ct:console", "north", 3.35, 2.4)] },
  "room.endoscopy": {
    // The rolling stool is the owner-approved touch-up at (3.0, 2.06); in the
    // east layout the touch-up transform moves it to (2.06, 1.0).
    0: () => [
      seated("endoscopy:stool", "west", { x: 3.0, y: 1.67 }, { x: 3.0, y: 2.06 }),
      standing("endoscopy:tower", "north", 2.6, .95),
    ],
    270: () => [
      seated("endoscopy:stool", "south", { x: 2.06, y: .61 }, { x: 2.06, y: 1.0 }),
      standing("endoscopy:tower", "west", 1.5, 1.12),
    ],
  },
  "room.phlebotomy": {
    0: () => reuse("phlebotomy:stool", "room.phlebotomy", 0, "stool:clinician"),
    270: () => reuse("phlebotomy:stool", "room.phlebotomy", 270, "stool:clinician"),
  },
  "room.surgeon_office": { 0: () => reuse("surgeon-office:desk", "room.surgeon_office", 0, "surgeon") },
  "room.ambulatory_or": { 0: () => [standing("ambulatory-or:workstation", "north", .4, .72)] },
  "room.laboratory": { 0: () => reuse("laboratory:bench", "room.laboratory", 0, "technician") },
  "room.pharmacy": { 0: () => [standing("pharmacy:computer", "north", 2.55, .72)] },
  "room.maintenance_workshop": { 0: () => reuse("maintenance:bench", "room.maintenance_workshop", 0, "repairPerson") },
};

export function resolveStaffIdleSupports(
  definitionId: string,
  orientation: RoomOrientation,
): readonly ApprovedActorSupport[] {
  if (orientation !== 0 && orientation !== 270) return [];
  return AUTHORED[definitionId]?.[orientation]?.() ?? [];
}
