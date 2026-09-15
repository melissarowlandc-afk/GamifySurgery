import { describe, expect, it } from "vitest";

import { getEnvironmentTileLogicalPhase } from "./environmentTilePhase";

describe("getEnvironmentTileLogicalPhase", () => {
  it("keeps a fixed logical material phase when the camera moves its rendered origin", () => {
    const beforePan = getEnvironmentTileLogicalPhase(184, 256, 40, 64, 0.5);
    const afterPan = getEnvironmentTileLogicalPhase(232, 219, 88, 27, 0.5);

    expect(beforePan).toEqual({ x: 288, y: 384 });
    expect(afterPan).toEqual(beforePan);
  });

  it("uses Phaser's positive TileSprite sample phase with scale-aware rounding", () => {
    expect(getEnvironmentTileLogicalPhase(112.26, 206.74, 10, 6, 0.5)).toEqual({
      x: 205,
      y: 401,
    });
    expect(getEnvironmentTileLogicalPhase(110, 206, 10, 6, 0.01)).toEqual({
      x: 5000,
      y: 10000,
    });
  });

  it("retains one coherent world phase across distinct adjacent logical rectangles", () => {
    const leftRoom = getEnvironmentTileLogicalPhase(100, 80, 20, 20, 0.5);
    const rightRoom = getEnvironmentTileLogicalPhase(124, 80, 20, 20, 0.5);
    const northWallFragment = getEnvironmentTileLogicalPhase(100, 56, 20, 20, 0.5);
    const width = 24;
    const height = 24;
    const scale = 0.5;

    // Canvas TileSprite samples at `local / scale + phase`; adjacent edges
    // therefore sample the same source coordinate at their shared seam.
    expect(width / scale + leftRoom.x).toBe(rightRoom.x);
    expect(rightRoom.y).toBe(leftRoom.y);
    expect(northWallFragment.x).toBe(leftRoom.x);
    expect(northWallFragment.y + height / scale).toBe(leftRoom.y);
  });
});
