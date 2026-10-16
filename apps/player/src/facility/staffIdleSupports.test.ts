import { describe, expect, it } from "vitest";
import { getEmployeeIdleSpots } from "@gamify-surgery/game-domain";

import { APPROVED_ROOM_PRESENTATIONS } from "./approvedRoomPresentation";
import { resolveStaffIdleSupports } from "./staffIdleSupports";

describe("idle staff supports", () => {
  it("draws a pose for exactly the idle spots the game rules can choose", () => {
    let spotCount = 0;
    for (const { roomDefinitionId } of APPROVED_ROOM_PRESENTATIONS) {
      for (const orientation of [0, 270] as const) {
        const spots = getEmployeeIdleSpots(roomDefinitionId, orientation);
        const supports = resolveStaffIdleSupports(roomDefinitionId, orientation);
        expect(supports.map((support) => support.id).sort(), `${roomDefinitionId}:${orientation}`)
          .toEqual(spots.map((spot) => spot.id).sort());
        for (const spot of spots) {
          const support = supports.find((candidate) => candidate.id === spot.id)!;
          expect(support.role).toBe("staff-idle");
          // The walker arrives at the tile's floor point (x + .5, y + .72).
          // Workstations are a small sidestep from it; chairs sit within
          // about half a tile so sitting down reads as one step.
          const dx = Math.abs(support.ground.x - (spot.tile.x + .5));
          const dy = Math.abs(support.ground.y - (spot.tile.y + .72));
          if (support.pose === "standing") {
            expect(spot.kind, spot.id).toBe("workstation");
            expect(dx, spot.id).toBeLessThanOrEqual(.3);
            expect(dy, spot.id).toBeLessThanOrEqual(.45);
          } else {
            expect(dx, spot.id).toBeLessThanOrEqual(.5);
            expect(dy, spot.id).toBeLessThanOrEqual(.6);
          }
          spotCount += 1;
        }
      }
    }
    expect(spotCount).toBe(17);
  });
});
