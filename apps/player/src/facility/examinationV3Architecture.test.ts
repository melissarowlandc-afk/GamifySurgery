import { describe, expect, it } from "vitest";
import { getExaminationV3ArchitectureComponents, getExaminationV3ForegroundGeometry, getExaminationV3WallRuns } from "./examinationV3Architecture";

describe("Examination v3 architecture", () => {
  it("keeps all walls continuous without a live door regardless of adjacency", () => {
    expect(getExaminationV3WallRuns(3, 2, [])).toEqual({
      north: [{ offset: 0, length: 3 }], south: [{ offset: 0, length: 3 }],
      east: [{ offset: 0, length: 2 }], west: [{ offset: 0, length: 2 }],
    });
  });

  it("subtracts only the exact live door slot on each wall", () => {
    const runs = getExaminationV3WallRuns(3, 2, [
      { side: "north", offset: 1 }, { side: "east", offset: 0 },
      { side: "south", offset: 2 }, { side: "west", offset: 1 },
    ]);
    expect(runs.north).toEqual([{ offset: 0, length: 1 }, { offset: 2, length: 1 }]);
    expect(runs.east).toHaveLength(1);
    expect(runs.east[0]!.offset).toBe(1);
    expect(runs.east[0]!.length).toBe(1);
    expect(runs.south).toEqual([{ offset: 0, length: 2 }]);
    expect(runs.west).toEqual([{ offset: 0, length: 1 }]);
  });

  it("uses a shallow foreground lip rather than a room-height slab", () => {
    const geometry = getExaminationV3ForegroundGeometry(64);
    expect(geometry.height).toBe(64 * (5 / 1.53) * 0.27 / 2);
    expect(geometry.inset).toBeLessThan(geometry.height);
  });

  it("passes backed north runs to the shared short-wall grammar", () => {
    const components = getExaminationV3ArchitectureComponents(
      { x: 0, y: 100, width: 192, height: 128 },
      { width: 3, height: 2 },
      [],
      [{ offset: 0, length: 2 }],
    );
    const short = components.filter((component) => component.key.startsWith("north-short-"));
    expect(short).toHaveLength(1);
    expect(short[0]).toMatchObject({ frameId: "frontWest", layer: "base", side: "north" });
    expect(short[0]!.bounds.y).toBe(100);
    expect(components.filter((component) => component.key.startsWith("north-wall-"))).toHaveLength(1);
  });

  it("uses canonical cap width and tall-corner continuation in both orientations", () => {
    const horizontal = getExaminationV3ArchitectureComponents(
      { x: 0, y: 100, width: 192, height: 128 }, { width: 3, height: 2 }, [],
    );
    const vertical = getExaminationV3ArchitectureComponents(
      { x: 0, y: 100, width: 128, height: 192 }, { width: 2, height: 3 }, [],
    );
    for (const components of [horizontal, vertical]) {
      const west = components.find((component) => component.key === "west-return-0" && component.layer === "base")!;
      const east = components.find((component) => component.key === "east-return-0" && component.layer === "base")!;
      expect(west.frameId).toBe("westCap");
      expect(east.frameId).toBe("eastCap");
      const northHeight = components.find((component) => component.key === "north-wall-0")!.bounds.height;
      for (const side of [west, east]) {
        expect(side.bounds.width).toBe(9.6);
        expect(side.bounds.y).toBe(100 - northHeight);
        expect(side.bounds.height).toBe((components === horizontal ? 128 : 192) + northHeight);
      }
    }
    expect(horizontal.find((component) => component.key === "west-return-0")!.bounds.width)
      .toBe(vertical.find((component) => component.key === "west-return-0")!.bounds.width);
  });

  it("faithfully leaves a backed or corner-door side unextended", () => {
    const backed = getExaminationV3ArchitectureComponents(
      { x: 0, y: 100, width: 192, height: 128 }, { width: 3, height: 2 }, [],
      [{ offset: 0, length: 1 }],
    );
    expect(backed.find((component) => component.key === "west-return-0" && component.layer === "base")!.bounds.y).toBe(100);
    const door = getExaminationV3ArchitectureComponents(
      { x: 0, y: 100, width: 192, height: 128 }, { width: 3, height: 2 }, [{ side: "north", offset: 2 }],
    );
    expect(door.find((component) => component.key === "east-return-0" && component.layer === "base")!.bounds.y).toBe(100);
  });
});
