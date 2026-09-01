import { describe, expect, it } from "vitest";
import { getCanonicalRoomShellLayout } from "./canonicalRoomShell";
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
  });
});
