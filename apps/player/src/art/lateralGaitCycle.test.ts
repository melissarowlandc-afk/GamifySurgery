import { describe, expect, it } from "vitest";
import { selectCharacterWalkingPose } from "./lateralGaitCycle";

describe("lateral character gait cycle", () => {
  it.each(["west", "east"])("uses the same four-beat profile cycle for %s travel", () => {
    expect(Array.from({ length: 8 }, (_, step) =>
      selectCharacterWalkingPose(true, "side", step),
    )).toEqual([
      "walk-a", "walk-neutral", "walk-b", "walk-neutral",
      "walk-a", "walk-neutral", "walk-b", "walk-neutral",
    ]);
  });

  it("freezes into idle when a character is not moving", () => {
    expect(selectCharacterWalkingPose(false, "side", 0)).toBe("idle");
    expect(selectCharacterWalkingPose(false, "front", 3)).toBe("idle");
  });

  it("preserves the approved front and back two-stride cadence", () => {
    for (const direction of ["front", "back"] as const) {
      expect(Array.from({ length: 6 }, (_, step) =>
        selectCharacterWalkingPose(true, direction, step),
      )).toEqual(["walk-a", "walk-b", "walk-a", "walk-b", "walk-a", "walk-b"]);
    }
  });
});
