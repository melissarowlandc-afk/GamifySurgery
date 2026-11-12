import {
  getRoomDefinition, PROTOTYPE_DOMAIN_CONTEXT, validateDoorPlacement, type GameState,
} from "@gamify-surgery/game-domain";
import type { FacilityDoorView } from "../facility/types";

let previousLayout: { key: string; doors: FacilityDoorView[] } | undefined;

/** Keep every saved record available for repair; only legal thresholds cut walls. */
export function createFacilityDoorViews(state: GameState): FacilityDoorView[] {
  // Layout-only cache, like domain access validation. A tick or cash change must
  // not rerun every threshold proof. Geometry/door changes and Undo replace it.
  const key = JSON.stringify([state.rooms.map(room => [room.id, room.roomDefinitionId,
    room.x, room.y, room.orientation]), state.doors]);
  if (previousLayout?.key === key) return previousLayout.doors.map(door => ({ ...door }));
  const facility = PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility;
  const protectedIds = new Set(facility.protectedRoomDefinitionIds);
  const doors = state.doors.map(door => {
    const validation = validateDoorPlacement(door, state.rooms, state.doors, getRoomDefinition,
      facility.gridWidth, facility.gridHeight, protectedIds);
    return {
      instanceId: door.id, roomInstanceId: door.roomId, side: door.side,
      offset: door.offset, exterior: door.exterior,
      connectionValid: validation.valid && (door.exterior || validation.adjacentRoomId !== null),
      adjacentRoomInstanceId: validation.adjacentRoomId,
      ...(validation.valid ? {} : { blockedReason: validation.reason ?? "This door does not connect." }),
    };
  });
  previousLayout = { key, doors };
  return doors.map(door => ({ ...door }));
}
