import { describe, expect, it } from "vitest";
import { APPROVED_PROCEDURE_STAFF_SPOTS, APPROVED_ROOM_NAVIGATION_CONTRACTS } from "./approved-room-layouts";

describe("approved procedure bedside staffing", () => {
  it.each(["room.endoscopy", "room.ambulatory_or"])("keeps every %s standing spot clear of furniture on opposite sides", (roomId) => {
    const layout = APPROVED_ROOM_NAVIGATION_CONTRACTS[roomId]!;
    const spots = APPROVED_PROCEDURE_STAFF_SPOTS[roomId]!;
    const table = layout.solidFixtures[0]!.footprint;
    const middle = table.left + table.width / 2;
    const providers = spots.filter((spot) => spot.actor === "provider");
    const nurses = spots.filter((spot) => spot.actor === "nurse");
    for (const spot of spots) {
      expect(layout.solidFixtures.some((fixture) => fixture.blockedTiles.some((point) => point.x === spot.anchor.x && point.y === spot.anchor.y))).toBe(false);
      expect(spot.anchor.x).toBeGreaterThanOrEqual(0); expect(spot.anchor.x).toBeLessThan(layout.width);
      expect(spot.anchor.y).toBeGreaterThanOrEqual(0); expect(spot.anchor.y).toBeLessThan(layout.height);
      expect(layout.solidFixtures.some(({ footprint }) => spot.ground.x >= footprint.left && spot.ground.x <= footprint.left + footprint.width &&
        spot.ground.y >= footprint.top && spot.ground.y <= footprint.top + footprint.height)).toBe(false);
      expect(spot.facing).toBe(spot.ground.x < middle ? "east" : "west");
    }
    for (const provider of providers) for (const nurse of nurses) expect((provider.ground.x - middle) * (nurse.ground.x - middle)).toBeLessThan(0);
  });
});
