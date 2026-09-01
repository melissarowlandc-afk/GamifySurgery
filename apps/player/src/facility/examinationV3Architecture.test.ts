import { describe, expect, it } from "vitest";
import { getExaminationV3ForegroundGeometry, getExaminationV3WallRuns } from "./examinationV3Architecture";

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
    expect(runs.north).toEqual([{ offset: 0, length: 1.16 }, { offset: 1.84, length: 1.16 }]);
    expect(runs.east).toHaveLength(1);
    expect(runs.east[0]!.offset).toBeCloseTo(0.84, 8);
    expect(runs.east[0]!.length).toBeCloseTo(1.16, 8);
    expect(runs.south).toEqual([{ offset: 0, length: 2.16 }]);
    // The trailing 0.16-pixel-equivalent sliver is intentionally discarded.
    expect(runs.west).toEqual([{ offset: 0, length: 1.16 }]);
  });

  it("uses a shallow foreground lip rather than a room-height slab", () => {
    const geometry = getExaminationV3ForegroundGeometry(64);
    expect(geometry.height).toBe(64 * (5 / 1.53) * 0.27 / 2);
    expect(geometry.inset).toBeLessThan(geometry.height);
  });
});
