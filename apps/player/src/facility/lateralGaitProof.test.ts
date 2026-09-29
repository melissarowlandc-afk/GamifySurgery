import { describe, expect, it } from "vitest";
import { createUnifiedFounderAppearance } from "../content/founderAppearancePresets";
import { traceLateralGaitRoute } from "./lateralGaitProof";

describe("static lateral movement proof", () => {
  it("glides one west still and one east still through every route phase", () => {
    const frames = traceLateralGaitRoute(createUnifiedFounderAppearance(0));
    expect(frames.map((frame) => `${frame.travel}:${frame.pose}`)).toEqual([
      "west:walk-neutral", "west:walk-neutral", "west:walk-neutral",
      "east:walk-neutral", "east:walk-neutral", "east:walk-neutral",
    ]);
    expect(new Set(frames.filter((frame) => frame.travel === "west").map((frame) => frame.atlasId)).size).toBe(1);
    expect(new Set(frames.filter((frame) => frame.travel === "east").map((frame) => frame.atlasId)).size).toBe(1);
    expect(frames.every((frame) => frame.flipX === false)).toBe(true);
    expect(frames[0]!.atlasId).not.toBe(frames[3]!.atlasId);
  });

  it("shows distinct authored lateral steps only for the opted-in Blue Glasses identity", () => {
    const blue = { ...createUnifiedFounderAppearance(0), stillId: "patient.adult.039" };
    const frames = traceLateralGaitRoute(blue);
    expect(new Set(frames.filter((frame) => frame.travel === "west").map((frame) => frame.atlasId)).size).toBe(3);
    expect(new Set(frames.filter((frame) => frame.travel === "east").map((frame) => frame.atlasId)).size).toBe(3);
    expect(frames.map((frame) => frame.walkFrame)).toEqual([0, 1, 2, 0, 1, 2]);
    expect(frames.every((frame) => frame.flipX === false)).toBe(true);
  });
});
