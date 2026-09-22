import { describe, expect, it } from "vitest";
import {
  captureCharacterMotionPresentation,
  replayCharacterMotionPresentation,
  resolveCharacterMotionPresentation,
  stationaryFloorDirection,
} from "./characterMotionPresentation";

const viewport = { originX: 20, originY: 30, tileSize: 40 };
const candidate = {
  centerX: 100,
  baseY: 190,
  direction: "side" as const,
  pose: "walk-a" as const,
  rightFacing: true,
  displayScale: 1,
  appearance: { id: "original" },
};

describe("character motion presentation", () => {
  it("reprojects a frozen normalized anchor when the camera layout changes", () => {
    const snapshot = captureCharacterMotionPresentation(candidate, viewport, "bitmap");

    expect(replayCharacterMotionPresentation(snapshot, {
      originX: 50,
      originY: 90,
      tileSize: 80,
    })).toMatchObject({
      centerX: 210,
      baseY: 410,
      direction: "side",
      pose: "walk-a",
      rightFacing: true,
      representation: "bitmap",
    });
  });

  it("keeps the rendered frame when paused inputs change or reorder", () => {
    const snapshot = captureCharacterMotionPresentation(candidate, viewport, "procedural");
    const refreshedCandidate = {
      ...candidate,
      centerX: 900,
      baseY: 600,
      direction: "back" as const,
      pose: "idle" as const,
      rightFacing: false,
      appearance: { id: "replacement" },
    };

    expect(resolveCharacterMotionPresentation(snapshot, refreshedCandidate, viewport)).toMatchObject({
      centerX: 100,
      baseY: 190,
      direction: "side",
      pose: "walk-a",
      rightFacing: true,
      appearance: { id: "original" },
      representation: "procedural",
    });
    expect(resolveCharacterMotionPresentation(undefined, refreshedCandidate, viewport)).toEqual(
      refreshedCandidate,
    );
  });

  it("faces a stationary floor character south while retaining furniture and moving directions", () => {
    expect(stationaryFloorDirection(false, "back", false)).toBe("front");
    expect(stationaryFloorDirection(true, "side", false)).toBe("side");
    expect(stationaryFloorDirection(false, "side", true)).toBe("side");
  });
});
