import { describe, expect, it } from "vitest";
import {
  ROOM_TOUCHUPS,
  TOUCHUP_TILE_PIXELS,
  getTouchupCorridorDecor,
  getTouchupCorridorRunnerPrimitives,
  getTouchupLighting,
  getTouchupTintTopAt,
  isTouchupImagingDimRoom,
  rotateTouchupSegment,
} from "./roomTouchups";
import { isRoomVisualDoorSlotClear } from "./roomVisualLayout";
import { getApprovedRoomPresentation } from "./approvedRoomPresentation";

const shell = { tilePixels: 120, rearWallHeightPixels: 90, lowNorthHeightPixels: 29, sideCapWidthPixels: 14, southHeightPixels: 29 };
const none = new Set<string>();

describe("room touch-ups", () => {
  it("dims imaging rooms only while a scan is in progress, and never CT", () => {
    expect(isTouchupImagingDimRoom("room.xray")).toBe(true);
    expect(isTouchupImagingDimRoom("room.ultrasound")).toBe(true);
    expect(isTouchupImagingDimRoom("room.ct")).toBe(false);
    expect(getTouchupLighting("room.xray", [3, 3], shell, none, none, false)).toBeUndefined();
    expect(getTouchupLighting("room.xray", [3, 3], shell, none, none, true)).toBeDefined();
    expect(getTouchupLighting("room.ct", [4, 4], shell, none, none, true)).toBeUndefined();
    // Warm and cool tints are always on.
    expect(getTouchupLighting("room.staff_break", [4, 4], shell, none, none, false)).toBeDefined();
  });

  it("tints from the north wall's real height down to the top of the south wall", () => {
    const lighting = getTouchupLighting("room.xray", [3, 3], shell, none, new Set(["N2"]), true)!;
    const bottom = 3 * TOUCHUP_TILE_PIXELS - 6;
    for (const region of lighting.regions) expect(region.y + region.height).toBeCloseTo(bottom);
    expect(lighting.segmentTops).toEqual([-99, -29, -99]);
    expect(getTouchupTintTopAt(lighting, 1.5)).toBe(-29);
  });

  it("keeps every new item off the walls", () => {
    for (const [definitionId, touchup] of Object.entries(ROOM_TOUCHUPS)) {
      const width = definitionId === "room.front_desk" ? 5 : undefined;
      for (const item of touchup.decor ?? []) {
        expect(item.x - item.widthTiles / 2, `${definitionId} ${item.id}`).toBeGreaterThanOrEqual(.06);
        if (width) expect(item.x + item.widthTiles / 2).toBeLessThanOrEqual(width - .06);
      }
    }
  });

  it("maps base-frame wall segments into the 270-degree view", () => {
    expect(rotateTouchupSegment("N1", 3)).toBe("WC");
    expect(rotateTouchupSegment("S3", 3)).toBe("EA");
    expect(rotateTouchupSegment("WA", 3)).toBe("S1");
    expect(rotateTouchupSegment("EB", 3)).toBe("N2");
  });

  it("offers a door on every wall segment of every approved room (owner rule)", () => {
    const ids = [...Object.keys(ROOM_TOUCHUPS), "room.reading"].filter((id) => id !== "room.front_desk");
    for (const definitionId of ids) {
      const footprint = getApprovedRoomPresentation(definitionId)?.orientations[0]?.footprint ?? (definitionId === "room.reading" ? [4, 4] : undefined);
      expect(footprint, definitionId).toBeDefined();
      const [width, height] = footprint!;
      for (const side of ["north", "south", "east", "west"] as const) {
        const length = side === "north" || side === "south" ? width : height;
        for (let offset = 0; offset < length; offset += 1) {
          expect(isRoomVisualDoorSlotClear({ definitionId, orientation: 0, width, height, side, offset }), `${definitionId} ${side} ${offset}`).toBe(true);
        }
      }
    }
  });
});

describe("hallway decor", () => {
  // A one-tile-wide corridor along y = 0 from x = 0..20 with rooms both sides.
  const corridor = (x: number, y: number) => y === 0 && x >= 0 && x <= 20;
  const closed = { north: false, west: false, east: false };

  it("places floor decor against a room-backed north edge but hangs art only on tall walls", () => {
    const backed = Array.from({ length: 19 }, (_, i) => getTouchupCorridorDecor({ x: i + 1, y: 0 }, corridor, { north: "backed", west: false, east: false }, closed)).flat();
    expect(backed.length).toBeGreaterThan(0);
    expect(backed.every((item) => item.kind === "floor")).toBe(true);
    expect(backed.some((item) => item.sprite === "corridor-bench")).toBe(true);
    const tall = Array.from({ length: 19 }, (_, i) => getTouchupCorridorDecor({ x: i + 1, y: 0 }, corridor, { north: "tall", west: false, east: false }, closed)).flat();
    expect(tall.some((item) => item.kind === "wall")).toBe(true);
  });

  it("keeps doorways, corridor ends and open edges clear", () => {
    const at = (x: number, walls: Parameters<typeof getTouchupCorridorDecor>[2], openings = closed) => getTouchupCorridorDecor({ x, y: 0 }, corridor, walls, openings);
    const benchX = 8; // rhythm slot 0
    expect(at(benchX, { north: "backed", west: false, east: false }).length).toBeGreaterThan(0);
    expect(at(benchX, { north: "backed", west: false, east: false }, { ...closed, north: true })).toEqual([]);
    expect(at(benchX, { north: null, west: false, east: false })).toEqual([]);
    expect(at(0, { north: "backed", west: true, east: false })).toEqual([]);
  });

  it("puts side-wall plants in vertical corridors on both sides", () => {
    const vertical = (x: number, y: number) => x === 0 && y >= 0 && y <= 40;
    const items = Array.from({ length: 39 }, (_, i) => getTouchupCorridorDecor({ x: 0, y: i + 1 }, vertical, { north: null, west: true, east: true }, closed)).flat();
    expect(items.some((item) => item.x < .5)).toBe(true);
    expect(items.some((item) => item.x > .5)).toBe(true);
    expect(items.every((item) => item.sprite.startsWith("plant-"))).toBe(true);
  });

  it("lays 4-tile runner rugs with gaps along straight runs, keyed to absolute position", () => {
    const rugged = Array.from({ length: 21 }, (_, x) => getTouchupCorridorRunnerPrimitives({ x, y: 0 }, corridor).length > 0);
    // Slots 1-4 of every 7 tiles; tile 0 is the corridor end.
    expect(rugged.map((on) => (on ? "#" : ".")).join("")).toBe(".####...####...####..");
    const piece = getTouchupCorridorRunnerPrimitives({ x: 2, y: 0 }, corridor);
    expect(piece.every((p) => p.x >= 0 && p.x + p.width <= TOUCHUP_TILE_PIXELS)).toBe(true);
    // Rugs stay in the middle band, clear of wall-side decor bases.
    expect(Math.min(...piece.map((p) => p.y))).toBeGreaterThanOrEqual(TOUCHUP_TILE_PIXELS * .34);
  });

  it("skips junctions, two-wide areas and one-tile scraps", () => {
    const wide = (x: number, y: number) => (y === 0 || y === 1) && x >= 0 && x <= 20;
    expect(getTouchupCorridorRunnerPrimitives({ x: 2, y: 0 }, wide)).toEqual([]);
    const scrap = (x: number, y: number) => y === 0 && x >= 4 && x <= 9; // slot 4 alone at x = 4
    expect(getTouchupCorridorRunnerPrimitives({ x: 4, y: 0 }, scrap)).toEqual([]);
  });
});
