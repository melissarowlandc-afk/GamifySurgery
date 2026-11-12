import type { CardinalDirection } from "@gamify-surgery/game-domain";
import type { FacilityRoomView, FacilityViewModel } from "../../facility/types";
import type { DoorSection, MobileBuildActions } from "./types";

/** One key per physical one-tile wall section, including reciprocal room walls. */
export function wallSectionKey(room: FacilityRoomView, side: CardinalDirection, offset: number): string {
  return side === "north" ? `h:${room.tileX + offset}:${room.tileY}` : side === "south"
    ? `h:${room.tileX + offset}:${room.tileY + room.height}` : side === "west"
      ? `v:${room.tileX}:${room.tileY + offset}` : `v:${room.tileX + room.width}:${room.tileY + offset}`;
}

export function phoneDoorSections(model: FacilityViewModel, actions: Pick<MobileBuildActions, "previewDoor">): DoorSection[] {
  const sections = new Map<string, DoorSection>();
  // Prefer the actual owner of an opening, even on its reciprocal room wall.
  for (const door of model.doors ?? []) {
    const room = model.rooms.find(candidate => candidate.instanceId === door.roomInstanceId);
    if (!room) continue;
    const request = { kind: "remove" as const, doorId: door.instanceId };
    const id = wallSectionKey(room, door.side, door.offset);
    sections.set(id, { id, roomId: room.instanceId, side: door.side, offset: door.offset, request,
      validation: actions.previewDoor(request) });
  }
  const rooms = [...model.rooms].sort((a, b) => Number(b.instanceId === model.selectedRoomInstanceId) - Number(a.instanceId === model.selectedRoomInstanceId));
  for (const room of rooms) {
    if (room.kind === "hallway" || room.definitionId === "room.hallway") continue;
    for (const side of ["north", "east", "south", "west"] as const) {
      const length = side === "north" || side === "south" ? room.width : room.height;
      for (let offset = 0; offset < length; offset += 1) {
        const id = wallSectionKey(room, side, offset);
        if (sections.has(id)) continue;
        const request = { kind: "add" as const, roomId: room.instanceId, side, offset };
        sections.set(id, { id, roomId: room.instanceId, side, offset, request, validation: actions.previewDoor(request) });
      }
    }
  }
  return [...sections.values()];
}
