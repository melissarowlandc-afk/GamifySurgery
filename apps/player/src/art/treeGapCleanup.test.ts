import { describe, expect, it } from "vitest";

import {
  cleanTreeFrameWhiteGaps,
  isUnintendedTreeGapPixel,
} from "./treeGapCleanup";

describe("tree gap cleanup", () => {
  it("only classifies opaque near-neutral white as a tree background gap", () => {
    expect(isUnintendedTreeGapPixel({ red: 255, green: 255, blue: 255, alpha: 255 })).toBe(true);
    expect(isUnintendedTreeGapPixel({ red: 255, green: 243, blue: 118, alpha: 255 })).toBe(false);
    expect(isUnintendedTreeGapPixel({ red: 245, green: 245, blue: 245, alpha: 255 })).toBe(false);
    expect(isUnintendedTreeGapPixel({ red: 255, green: 255, blue: 255, alpha: 0 })).toBe(false);
  });

  it("cleans only supplied tree-frame pixels and preserves atlas geometry", () => {
    const width = 4;
    const data = new Uint8ClampedArray(width * 3 * 4);
    const set = (x: number, y: number, rgba: readonly number[]) => data.set(rgba, (y * width + x) * 4);
    set(1, 1, [255, 255, 255, 255]);
    set(2, 1, [255, 243, 118, 255]);
    set(1, 2, [255, 255, 255, 255]);
    const cleared = cleanTreeFrameWhiteGaps(data, width, [{ sourceRect: { x: 1, y: 1, width: 2, height: 1 } }]);
    expect(cleared).toBe(1);
    expect(data[(1 * width + 1) * 4 + 3]).toBe(0);
    expect(data[(1 * width + 2) * 4 + 3]).toBe(255);
    expect(data[(2 * width + 1) * 4 + 3]).toBe(255);
    expect(data).toHaveLength(width * 3 * 4);
  });
});
