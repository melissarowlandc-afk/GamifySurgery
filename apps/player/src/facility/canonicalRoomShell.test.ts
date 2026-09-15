import { describe, expect, it } from "vitest";
import {
  CANONICAL_ENCLOSED_ROOM_DEFINITION_IDS,
  getCanonicalHallwayEdgeComponents,
  getCanonicalNorthWallDecorFragments,
  getCanonicalRoomShellLayout,
  isCanonicalNorthWallDecorFullySupported,
  isCanonicalEnclosedRoomDefinition,
} from "./canonicalRoomShell";
import { getFrontDeskV5Projection } from "./frontDeskV5Architecture";

describe("canonical room shell", () => {
  const floor = { x: 10, y: 20, width: 300, height: 200 };

  it("uses the same absolute wall construction at one map zoom for real room footprints", () => {
    const deskFloor = getFrontDeskV5Projection({ x: 0, y: 0, width: 320, height: 256 }).floorBounds;
    const frontDesk = getCanonicalRoomShellLayout(deskFloor, { width: 5, height: 4 });
    const horizontalExam = getCanonicalRoomShellLayout({ x: 0, y: 0, width: 192, height: 128 }, { width: 3, height: 2 });
    const verticalExam = getCanonicalRoomShellLayout({ x: 0, y: 0, width: 128, height: 192 }, { width: 2, height: 3 });
    for (const examination of [horizontalExam, verticalExam]) {
      expect(examination.geometry.northHeight).toBeCloseTo(frontDesk.geometry.northHeight, 8);
      expect(examination.geometry.sideWidth).toBeCloseTo(frontDesk.geometry.sideWidth, 8);
      expect(examination.geometry.frontHeight).toBeCloseTo(frontDesk.geometry.frontHeight, 8);
      expect(examination.components.find((component) => component.key === "north-wall-0")!.bounds.height)
        .toBeCloseTo(frontDesk.components.find((component) => component.key === "north-wall-0")!.bounds.height, 8);
    }
  });

  it("halves the prior Front Desk 27% foreground height and records foreground occlusion", () => {
    const deskFloor = getFrontDeskV5Projection({ x: 0, y: 0, width: 320, height: 256 }).floorBounds;
    const layout = getCanonicalRoomShellLayout(deskFloor, { width: 5, height: 4 });
    expect(layout.geometry.frontHeight).toBeCloseTo(deskFloor.width / 5 * 0.4411764705882353, 8);
    expect(layout.components.filter((component) => component.layer === "front-occluder")).toHaveLength(1);
  });

  it("keeps every wall closed without live doors and cuts only live slots", () => {
    const closed = getCanonicalRoomShellLayout(floor, { width: 3, height: 2 });
    expect(closed.northWallFaceRuns).toEqual([{ start: 0, length: 300 }]);
    expect(closed.components.filter((component) => component.side === "west" && component.layer === "base")).toHaveLength(1);
    const opened = getCanonicalRoomShellLayout(floor, { width: 3, height: 2 }, [{ side: "north", offset: 1 }, { side: "south", offset: 2 }, { side: "west", offset: 1 }, { side: "east", offset: 0 }]);
    expect(opened.northWallFaceRuns).toHaveLength(2);
    expect(opened.components.filter((component) => component.side === "south" && component.layer === "base")).toHaveLength(1);
    expect(opened.components.filter((component) => component.side === "west" && component.layer === "base")).toHaveLength(1);
    expect(opened.components.filter((component) => component.side === "east" && component.layer === "base")).toHaveLength(1);
  });

  it("keeps first and last side-door apertures aligned to their floor slots", () => {
    const layout = getCanonicalRoomShellLayout({ x: 10, y: 20, width: 192, height: 128 }, { width: 3, height: 2 }, [
      { side: "west", offset: 0 }, { side: "east", offset: 1 },
    ]);
    const westFloorRun = layout.components.find((component) => component.key === "west-return-0")!;
    const eastFloorRun = layout.components.find((component) => component.key === "east-return-0")!;
    expect(westFloorRun.frameId).toBe("westCap");
    expect(eastFloorRun.frameId).toBe("eastCap");
    expect(westFloorRun.bounds.y).toBe(84);
    expect(eastFloorRun.bounds.y).toBe(20 - layout.geometry.northHeight);
    expect(layout.components.some((component) => component.key.endsWith("-return-top") || component.key.endsWith("-return-bottom"))).toBe(false);
    const sideComponents = layout.components.filter((component) => (component.side === "west" || component.side === "east") && component.layer === "base");
    expect(sideComponents.every((component) => component.bounds.y >= 20 - layout.geometry.northHeight && component.bounds.y + component.bounds.height <= 148)).toBe(true);
  });

  it("carries a skin identity without allowing it to alter shell structure", () => {
    const olive = getCanonicalRoomShellLayout(floor, { width: 3, height: 2 }, [], false, { id: "exam-olive" });
    expect(olive.components.every((component) => component.skinId === "exam-olive")).toBe(true);
    const cream = getCanonicalRoomShellLayout(floor, { width: 3, height: 2 }, [], false, { id: "waiting-cream" });
    expect(olive.components.map((component) => component.bounds)).toEqual(cream.components.map((component) => component.bounds));
  });

  it("enumerates every enclosed Level 0-2 room without classifying the hallway", () => {
    expect(CANONICAL_ENCLOSED_ROOM_DEFINITION_IDS).toEqual([
      "room.waiting", "room.bathroom", "room.xray", "room.imaging_control",
      "room.minor_procedure", "room.ultrasound", "room.ct", "room.phlebotomy",
      "room.evs_closet", "room.endoscopy", "room.periop_recovery", "room.training",
      "room.coffee_kiosk", "room.glp1_telehealth_suite",
    ]);
    expect(isCanonicalEnclosedRoomDefinition("room.hallway")).toBe(false);
  });

  it("keeps common 64px-tile geometry across ordinary and rotated footprints", () => {
    const layouts = [
      getCanonicalRoomShellLayout({ x: 0, y: 0, width: 128, height: 128 }, { width: 2, height: 2 }),
      getCanonicalRoomShellLayout({ x: 0, y: 0, width: 192, height: 192 }, { width: 3, height: 3 }),
      getCanonicalRoomShellLayout({ x: 0, y: 0, width: 256, height: 256 }, { width: 4, height: 4 }),
      getCanonicalRoomShellLayout({ x: 0, y: 0, width: 192, height: 128 }, { width: 3, height: 2 }),
      getCanonicalRoomShellLayout({ x: 0, y: 0, width: 128, height: 192 }, { width: 2, height: 3 }),
    ];
    const first = layouts[0]!;
    for (const layout of layouts.slice(1)) {
      expect(layout.geometry.northHeight).toBe(first.geometry.northHeight);
      expect(layout.geometry.sideWidth).toBe(first.geometry.sideWidth);
      expect(layout.geometry.frontHeight).toBe(first.geometry.frontHeight);
    }
  });

  it("does not use adjacency as an opening and subtracts complete first and last live tiles", () => {
    const closed = getCanonicalRoomShellLayout({ x: 0, y: 0, width: 192, height: 128 }, { width: 3, height: 2 });
    const opened = getCanonicalRoomShellLayout(
      { x: 0, y: 0, width: 192, height: 128 },
      { width: 3, height: 2 },
      [{ side: "north", offset: 0 }, { side: "north", offset: 2 }],
    );
    expect(closed.northWallFaceRuns).toEqual([{ start: 0, length: 192 }]);
    expect(opened.northWallFaceRuns).toEqual([{ start: 64, length: 64 }]);
  });

  it("subtracts one complete tile on every wall and merges adjacent door tiles into one cutout", () => {
    const allSides = getCanonicalRoomShellLayout(
      { x: 10, y: 20, width: 192, height: 128 },
      { width: 3, height: 2 },
      [
        { side: "north", offset: 0 }, { side: "south", offset: 2 },
        { side: "west", offset: 1 }, { side: "east", offset: 0 },
      ],
    );
    expect(allSides.northWallFaceRuns).toEqual([{ start: 64, length: 128 }]);
    expect(allSides.components.filter((component) => component.side === "south" && component.layer === "base")
      .map((component) => component.bounds)).toEqual([{ x: 10, y: allSides.geometry.frontTop, width: 128, height: allSides.geometry.frontHeight }]);
    expect(allSides.components.filter((component) => component.side === "west" && component.layer === "base")
      .map((component) => component.bounds)).toEqual([{ x: 10 - allSides.geometry.sideWidth / 2, y: 20, width: allSides.geometry.sideWidth, height: 64 }]);
    expect(allSides.components.filter((component) => component.side === "east" && component.layer === "base")
      .map((component) => component.bounds)).toEqual([{ x: 202 - allSides.geometry.sideWidth / 2, y: 84, width: allSides.geometry.sideWidth, height: 64 }]);

    const adjacent = getCanonicalRoomShellLayout(
      { x: 0, y: 0, width: 192, height: 128 },
      { width: 3, height: 2 },
      [{ side: "north", offset: 0 }, { side: "north", offset: 1 }],
    );
    expect(adjacent.northWallFaceRuns).toEqual([{ start: 128, length: 64 }]);
  });

  it("turns backed north tiles into in-footprint short front-wall segments without making an opening", () => {
    const layout = getCanonicalRoomShellLayout(
      { x: 10, y: 100, width: 192, height: 128 },
      { width: 3, height: 2 },
      [],
      false,
      undefined,
      [{ offset: 1, length: 1 }],
    );
    const tall = layout.components.filter((component) => component.key.startsWith("north-wall-") && component.layer === "base");
    const short = layout.components.filter((component) => component.key.startsWith("north-short-") && component.layer === "base");
    expect(tall.map((component) => component.bounds)).toEqual([
      { x: 10, y: 28.888888888888886, width: 64, height: 71.11111111111111 },
      { x: 138, y: 28.888888888888886, width: 64, height: 71.11111111111111 },
    ]);
    expect(short).toHaveLength(1);
    expect(short[0]).toMatchObject({ frameId: "frontEast", layer: "base", side: "north" });
    expect(short[0]!.bounds).toEqual({ x: 74, y: 100, width: 64, height: layout.geometry.shortNorthHeight });
    expect(layout.northWallFaceRuns).toEqual([
      { start: 0, length: 64 }, { start: 128, length: 64 },
    ]);
    expect(layout.components.some((component) => component.key.startsWith("north-short-") && component.layer === "structural-occluder")).toBe(false);
  });

  it("preserves a live north-door gap inside a backed short segment", () => {
    const layout = getCanonicalRoomShellLayout(
      { x: 0, y: 100, width: 192, height: 128 },
      { width: 3, height: 2 },
      [{ side: "north", offset: 1 }],
      false,
      undefined,
      [{ offset: 0, length: 3 }],
    );
    const short = layout.components.filter((component) => component.key.startsWith("north-short-") && component.layer === "base");
    expect(layout.components.some((component) => component.key.startsWith("north-wall-") && component.layer === "base")).toBe(false);
    expect(short).toHaveLength(2);
    expect(short[0]!.bounds.x + short[0]!.bounds.width).toBeCloseTo(64, 8);
    expect(short[1]!.bounds.x).toBeCloseTo(128, 8);
    expect(layout.northWallFaceRuns).toEqual([]);
  });

  it("keeps base north and south metadata while adding doorway-aware structural occlusion", () => {
    const layout = getCanonicalRoomShellLayout({ x: 10, y: 20, width: 192, height: 128 }, { width: 3, height: 2 });
    const horizontal = layout.components
      .filter((component) => (component.side === "north" || component.side === "south") && component.layer !== "structural-occluder")
      .map(({ key, frameId, bounds, layer }) => ({ key, frameId, bounds, layer }));
    expect(horizontal).toEqual([
      { key: "north-wall-0", frameId: "northWall", bounds: { x: 10, y: -51.111111111111114, width: 192, height: 71.11111111111111 }, layer: "base" },
      { key: "front-0-base", frameId: "frontWest", bounds: { x: 10, y: 119.76470588235294, width: 192, height: 28.23529411764706 }, layer: "base" },
      { key: "front-0-occluder", frameId: "frontWest", bounds: { x: 10, y: 119.76470588235294, width: 192, height: 28.23529411764706 }, layer: "front-occluder" },
    ]);
    const sides = layout.components.filter((component) => (component.side === "west" || component.side === "east") && component.layer === "base");
    expect(sides).toHaveLength(2);
    expect(sides.map((component) => component.frameId)).toEqual(["westCap", "eastCap"]);
    expect(sides.every((component) => component.bounds.width === 9.6 && component.bounds.y === 20 - layout.geometry.northHeight && component.bounds.height === 128 + layout.geometry.northHeight)).toBe(true);
  });

  it("centers optional shared side runs on the precise global tile border", () => {
    const layout = getCanonicalRoomShellLayout(
      { x: 64, y: 128, width: 128, height: 128 }, { width: 2, height: 2 }, [], false, undefined, [],
      [], { west: [], east: [{ start: 0, length: 64 }] },
    );
    const east = layout.components.find((component) => component.key === "east-return-0")!;
    expect(east.bounds.x).toBeCloseTo(192 - layout.geometry.sideWidth / 2, 8);
    expect(east.bounds.height).toBe(64 + layout.geometry.northHeight);
    expect(layout.components.some((component) => component.side === "west")).toBe(false);
  });

  it("clips generic north-wall decor to remaining live-door-subtracted wall intervals", () => {
    const layout = getCanonicalRoomShellLayout(
      { x: 0, y: 100, width: 192, height: 128 },
      { width: 3, height: 2 },
      [{ side: "north", offset: 1 }],
    );
    const fragments = getCanonicalNorthWallDecorFragments(
      layout,
      { x: 0, y: 100, width: 192, height: 128 },
      { x: 45, y: 20, width: 102, height: 100 },
    );
    expect(fragments).toHaveLength(2);
    expect(fragments[0]!.x + fragments[0]!.width).toBeLessThanOrEqual(64);
    expect(fragments[1]!.x).toBeGreaterThanOrEqual(128);
  });

  it("never clips north-wall decor onto backed short segments", () => {
    const layout = getCanonicalRoomShellLayout(
      { x: 0, y: 100, width: 192, height: 128 },
      { width: 3, height: 2 },
      [],
      false,
      undefined,
      [{ offset: 0, length: 3 }],
    );
    expect(getCanonicalNorthWallDecorFragments(
      layout,
      { x: 0, y: 100, width: 192, height: 128 },
      { x: 0, y: 20, width: 192, height: 100 },
    )).toEqual([]);
  });

  it("requires independent decor to fit one surviving tall wall interval", () => {
    const floor = { x: 0, y: 100, width: 320, height: 200 };
    const fullyBacked = getCanonicalRoomShellLayout(
      floor, { width: 5, height: 4 }, [], false, undefined,
      [{ offset: 0, length: 5 }],
    );
    expect(isCanonicalNorthWallDecorFullySupported(
      fullyBacked, floor, { x: 48, y: 50, width: 40, height: 30 },
    )).toBe(false);

    const partial = getCanonicalRoomShellLayout(
      floor, { width: 5, height: 4 }, [], false, undefined,
      [{ offset: 2, length: 1 }],
    );
    expect(isCanonicalNorthWallDecorFullySupported(
      partial, floor, { x: 12, y: 50, width: 40, height: 30 },
    )).toBe(true);
    expect(isCanonicalNorthWallDecorFullySupported(
      partial, floor, { x: 110, y: 50, width: 40, height: 30 },
    )).toBe(false);

    const door = getCanonicalRoomShellLayout(
      floor, { width: 5, height: 4 }, [{ side: "north", offset: 1 }], false,
    );
    expect(isCanonicalNorthWallDecorFullySupported(
      door, floor, { x: 70, y: 50, width: 50, height: 30 },
    )).toBe(false);
  });

  it("uses exact canonical dimensions for exposed hallway strips and omits internal edges", () => {
    const floor = { x: 0, y: 100, width: 64, height: 64 };
    const enclosed = getCanonicalRoomShellLayout(floor, { width: 1, height: 1 }, [], false);
    const hallway = getCanonicalHallwayEdgeComponents(floor, { width: 1, height: 1 }, {
      north: [{ start: 0, length: 64 }], east: [{ start: 0, length: 64 }],
      south: [{ start: 0, length: 64 }], west: [],
    });
    expect(hallway.find((component) => component.side === "north")!.bounds.height)
      .toBe(enclosed.geometry.northHeight);
    expect(hallway.find((component) => component.side === "east")!.bounds.width)
      .toBe(enclosed.geometry.sideWidth);
    expect(hallway.find((component) => component.side === "east" && component.layer === "base")!.bounds)
      .toEqual({ x: 64 - enclosed.geometry.sideWidth / 2, y: 100 - enclosed.geometry.northHeight, width: enclosed.geometry.sideWidth, height: 64 + enclosed.geometry.northHeight });
    expect(hallway.find((component) => component.side === "east")!.frameId).toBe("eastCap");
    expect(hallway.find((component) => component.layer === "front-occluder")!.bounds.height)
      .toBe(enclosed.geometry.frontHeight);
    expect(hallway.some((component) => component.side === "west")).toBe(false);
  });

  it("centers hallway caps and supports a door-subtracted short north owner", () => {
    const floor = { x: 64, y: 64, width: 128, height: 64 };
    const enclosed = getCanonicalRoomShellLayout(floor, { width: 2, height: 1 }, [], false);
    const hallway = getCanonicalHallwayEdgeComponents(
      floor, { width: 2, height: 1 },
      { north: [], east: [], south: [], west: [] },
      undefined,
      [{ start: 0, length: 64 }],
      { west: [], east: [{ start: 64, length: 64 }] },
    );
    const short = hallway.find((component) => component.key === "hallway-north-short-0")!;
    const east = hallway.find((component) => component.key === "hallway-east-0")!;
    expect(short.bounds.height).toBe(64 * 0.18);
    expect(short.bounds.height).toBeLessThan(enclosed.geometry.frontHeight);
    expect(short.bounds.height).toBeLessThan(enclosed.geometry.northHeight);
    expect(east.bounds.x + east.bounds.width / 2).toBe(192);
    expect(east.bounds.y).toBe(floor.y + 64);
    expect(east.bounds.height).toBe(64);
    const backedWest = getCanonicalHallwayEdgeComponents(
      floor, { width: 2, height: 1 },
      { north: [], east: [], south: [], west: [] }, undefined,
      [{ start: 0, length: 64 }], { west: [{ start: 0, length: 64 }], east: [] },
    ).find((component) => component.key === "hallway-west-0")!;
    expect(backedWest.bounds).toMatchObject({ y: floor.y, height: 64 });
  });

  it("keeps Front Desk and both Examination footprints on the identical tall-corner cap contract", () => {
    const layouts = [
      getCanonicalRoomShellLayout({ x: 0, y: 100, width: 320, height: 256 }, { width: 5, height: 4 }),
      getCanonicalRoomShellLayout({ x: 0, y: 100, width: 192, height: 128 }, { width: 3, height: 2 }),
      getCanonicalRoomShellLayout({ x: 0, y: 100, width: 128, height: 192 }, { width: 2, height: 3 }),
    ];
    for (const layout of layouts) {
      for (const [key, frame] of [["west-return-0", "westCap"], ["east-return-0", "eastCap"]] as const) {
        const side = layout.components.find((component) => component.key === key && component.layer === "base")!;
        expect(side.frameId).toBe(frame);
        expect(side.bounds.width).toBe(layout.geometry.sideWidth);
        expect(side.bounds.y).toBe(100 - layout.geometry.northHeight);
        expect(side.bounds.height).toBe(layout.geometry.sideHeight + layout.geometry.northHeight);
      }
    }
    expect(layouts.map((layout) => layout.geometry.sideWidth)).toEqual([9.6, 9.6, 9.6]);
  });

  it("limits structural copies to sides and retains south as the only front occluder", () => {
    const layout = getCanonicalRoomShellLayout({ x: 0, y: 100, width: 192, height: 128 }, { width: 3, height: 2 });
    const structuralSides = layout.components.filter((component) => component.layer === "structural-occluder");
    expect(structuralSides.map((component) => component.side).sort()).toEqual(["east", "west"]);
    expect(layout.components.filter((component) => component.side === "north" && component.layer === "structural-occluder")).toEqual([]);
    expect(layout.components.filter((component) => component.side === "south" && component.layer === "structural-occluder")).toEqual([]);
    expect(layout.components.filter((component) => component.side === "south" && component.layer === "front-occluder")).toHaveLength(1);
  });

  it("duplicates each doorway-subtracted side run at structural depth", () => {
    const layout = getCanonicalRoomShellLayout(
      { x: 0, y: 100, width: 192, height: 128 },
      { width: 3, height: 2 },
      [
        { side: "north", offset: 1 }, { side: "south", offset: 1 },
        { side: "west", offset: 0 }, { side: "east", offset: 1 },
      ],
      false,
      undefined,
      [{ offset: 2, length: 1 }],
    );
    const baseWalls = layout.components.filter(
      (component) => component.layer === "base" && (component.side === "west" || component.side === "east"),
    );
    const occluders = layout.components.filter((component) => component.layer === "structural-occluder");
    expect(occluders).toHaveLength(baseWalls.length);
    for (const base of baseWalls) {
      expect(occluders).toContainEqual(expect.objectContaining({
        frameId: base.frameId,
        bounds: base.bounds,
        side: base.side,
      }));
    }
    expect(occluders.every((component) => component.side === "west" || component.side === "east")).toBe(true);
    expect(occluders.filter((component) => component.side === "north")).toEqual([]);
    expect(occluders.filter((component) => component.side === "south")).toEqual([]);
  });

  it("leaves backed and north-door corners without shoulders", () => {
    const floor = { x: 0, y: 100, width: 192, height: 128 };
    const westBacked = getCanonicalRoomShellLayout(floor, { width: 3, height: 2 }, [], false, undefined, [{ offset: 0, length: 1 }]);
    const eastBacked = getCanonicalRoomShellLayout(floor, { width: 3, height: 2 }, [], false, undefined, [{ offset: 2, length: 1 }]);
    for (const [layout, unextended] of [[westBacked, "west-return-0"], [eastBacked, "east-return-0"]] as const) {
      expect(layout.components.find((c) => c.key === unextended && c.layer === "base")!.bounds).toMatchObject({ y: 100, height: 128 });
    }
    const doors = getCanonicalRoomShellLayout(floor, { width: 3, height: 2 }, [{ side: "north", offset: 0 }, { side: "north", offset: 2 }]);
    for (const key of ["west-return-0", "east-return-0"]) expect(doors.components.find((c) => c.key === key && c.layer === "base")!.bounds).toMatchObject({ y: 100, height: 128 });
    const sideDoors = getCanonicalRoomShellLayout(floor, { width: 3, height: 2 }, [{ side: "west", offset: 0 }, { side: "east", offset: 0 }]);
    for (const key of ["west-return-0", "east-return-0"]) expect(sideDoors.components.find((c) => c.key === key && c.layer === "base")!.bounds).toMatchObject({ y: 164 });
  });
});
