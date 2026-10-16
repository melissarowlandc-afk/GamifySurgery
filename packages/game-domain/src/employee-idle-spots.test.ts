import { describe, expect, it } from "vitest";
import { getEmployeeIdleSpots, getPlacedRoomIdleSpotAt } from "./employee-idle-spots";
import { getRoomDefinition } from "./selectors";
import { getRoomNavigableTiles } from "./spatial";
import type { PlacedRoom } from "./types";

const STAFFED_ROOMS = [
  "room.periop_recovery", "room.ultrasound", "room.xray", "room.ct", "room.endoscopy", "room.phlebotomy",
  "room.surgeon_office", "room.ambulatory_or", "room.laboratory", "room.pharmacy", "room.maintenance_workshop",
];

const placed = (roomDefinitionId: string, orientation: 0 | 270): PlacedRoom =>
  ({ id: "room.test", roomDefinitionId, x: 10, y: 20, orientation } as PlacedRoom);

describe("employee idle spots", () => {
  it("puts every chair and workstation on a walkable tile of its room", () => {
    for (const roomDefinitionId of STAFFED_ROOMS) {
      const definition = getRoomDefinition(roomDefinitionId)!;
      for (const orientation of [0, 270] as const) {
        const room = placed(roomDefinitionId, orientation);
        const walkable = getRoomNavigableTiles(room, definition);
        const spots = getEmployeeIdleSpots(roomDefinitionId, orientation);
        expect(new Set(spots.map((spot) => `${spot.tile.x},${spot.tile.y}`)).size).toBe(spots.length);
        for (const spot of spots) {
          expect(walkable, `${roomDefinitionId}:${orientation}:${spot.id}`)
            .toContainEqual({ x: room.x + spot.tile.x, y: room.y + spot.tile.y });
        }
      }
    }
  });

  it("finds a spot only on its own tile and only for authored orientations", () => {
    const recovery = placed("room.periop_recovery", 0);
    expect(getPlacedRoomIdleSpotAt(recovery, { x: 12, y: 22 })?.id).toBe("recovery:stool-1");
    expect(getPlacedRoomIdleSpotAt(recovery, { x: 12, y: 21 })).toBeUndefined();
    expect(getEmployeeIdleSpots("room.endoscopy", 90)).toEqual([]);
    expect(getEmployeeIdleSpots("room.evs_closet", 0)).toEqual([]);
  });
});
