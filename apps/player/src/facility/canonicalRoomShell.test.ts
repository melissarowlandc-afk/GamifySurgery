import { describe, expect, it } from "vitest";
import {
  CANONICAL_ENCLOSED_ROOM_DEFINITION_IDS,
  getCanonicalHallwayEdgeComponents,
  getCanonicalNorthWallDecorFragments,
  getCanonicalRoomShellLayout,
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
    expect(layout.geometry.frontHeight).toBe(deskFloor.height * 0.27 / 2);
    expect(layout.components.filter((component) => component.layer === "front-occluder")).toHaveLength(1);
  });

  it("keeps every wall closed without live doors and cuts only live slots", () => {
    const closed = getCanonicalRoomShellLayout(floor, { width: 3, height: 2 });
    expect(closed.northWallFaceRuns).toEqual([{ start: 0, length: 300 }]);
    expect(closed.components.filter((component) => component.side === "west" && component.layer === "base")).toHaveLength(3);
    const opened = getCanonicalRoomShellLayout(floor, { width: 3, height: 2 }, [{ side: "north", offset: 1 }, { side: "south", offset: 2 }, { side: "west", offset: 1 }, { side: "east", offset: 0 }]);
    expect(opened.northWallFaceRuns).toHaveLength(2);
    expect(opened.components.filter((component) => component.side === "south" && component.layer === "base")).toHaveLength(2);
    expect(opened.components.filter((component) => component.side === "west" && component.layer === "base")).toHaveLength(4);
    expect(opened.components.filter((component) => component.side === "east" && component.layer === "base")).toHaveLength(4);
  });

  it("keeps first and last side-door apertures aligned to their floor slots", () => {
    const layout = getCanonicalRoomShellLayout({ x: 10, y: 20, width: 192, height: 128 }, { width: 3, height: 2 }, [
      { side: "west", offset: 0 }, { side: "east", offset: 1 },
    ]);
    const westFloorRun = layout.components.find((component) => component.key === "west-return-1")!;
    const eastFloorRun = layout.components.find((component) => component.key === "east-return-0")!;
    expect(westFloorRun.bounds.y).toBeCloseTo(20 + 0.84 * 64, 8);
    expect(eastFloorRun.bounds.y).toBe(20);
    expect(layout.components.find((component) => component.key === "west-return-top")!.bounds.y)
      .toBeLessThan(20);
    expect(layout.components.find((component) => component.key === "east-return-bottom")!.bounds.y)
      .toBe(148);
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

  it("does not use adjacency as an opening and cuts exact first and last live slots", () => {
    const closed = getCanonicalRoomShellLayout({ x: 0, y: 0, width: 192, height: 128 }, { width: 3, height: 2 });
    const opened = getCanonicalRoomShellLayout(
      { x: 0, y: 0, width: 192, height: 128 },
      { width: 3, height: 2 },
      [{ side: "north", offset: 0 }, { side: "north", offset: 2 }],
    );
    expect(closed.northWallFaceRuns).toEqual([{ start: 0, length: 192 }]);
    expect(opened.northWallFaceRuns).toHaveLength(3);
    expect(opened.northWallFaceRuns[0]!.length).toBeCloseTo(10.24, 8);
    expect(opened.northWallFaceRuns[1]!.start).toBeCloseTo(53.76, 8);
    expect(opened.northWallFaceRuns[1]!.length).toBeCloseTo(84.48, 8);
    expect(opened.northWallFaceRuns[2]!.start).toBeCloseTo(181.76, 8);
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
    expect(fragments[0]!.x + fragments[0]!.width).toBeLessThanOrEqual(72.24);
    expect(fragments[1]!.x).toBeGreaterThanOrEqual(119.76);
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
    expect(hallway.find((component) => component.layer === "front-occluder")!.bounds.height)
      .toBe(enclosed.geometry.frontHeight);
    expect(hallway.some((component) => component.side === "west")).toBe(false);
  });
});
