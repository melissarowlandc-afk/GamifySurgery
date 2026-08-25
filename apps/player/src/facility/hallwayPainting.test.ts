import { describe, expect, it } from "vitest";
import { rasterizeGridLine } from "./hallwayPainting";

describe("rasterizeGridLine", () => {
  it("fills every horizontal square crossed by a fast drag", () => {
    expect(
      rasterizeGridLine({ x: 2, y: 4 }, { x: 6, y: 4 }),
    ).toEqual([
      { x: 2, y: 4 },
      { x: 3, y: 4 },
      { x: 4, y: 4 },
      { x: 5, y: 4 },
      { x: 6, y: 4 },
    ]);
  });

  it("fills vertical and diagonal drags without repeating a square", () => {
    const vertical = rasterizeGridLine({ x: 3, y: 5 }, { x: 3, y: 2 });
    const diagonal = rasterizeGridLine({ x: 1, y: 1 }, { x: 4, y: 3 });

    expect(vertical).toEqual([
      { x: 3, y: 5 },
      { x: 3, y: 4 },
      { x: 3, y: 3 },
      { x: 3, y: 2 },
    ]);
    expect(new Set(diagonal.map(({ x, y }) => `${x}:${y}`)).size).toBe(
      diagonal.length,
    );
    diagonal.slice(1).forEach((point, index) => {
      const previous = diagonal[index]!;
      expect(
        Math.abs(point.x - previous.x) + Math.abs(point.y - previous.y),
      ).toBe(1);
    });
    expect(diagonal.at(0)).toEqual({ x: 1, y: 1 });
    expect(diagonal.at(-1)).toEqual({ x: 4, y: 3 });
  });
});
