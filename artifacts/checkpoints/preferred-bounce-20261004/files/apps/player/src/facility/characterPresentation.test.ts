import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import {
  alignCharacterStillSeatToWorld,
  CHARACTER_STEP_BOUNCE_HEIGHT,
  CHARACTER_STEP_BOUNCE_HERTZ,
  CHARACTER_STEP_SWAY_DEGREES,
  CHARACTER_STEP_SWAY_HERTZ,
  CHARACTER_STOP_SETTLE_MILLISECONDS,
  CHARACTER_STILL_WIDTH_IN_TILES,
  getCharacterStillPresentationMetrics,
  getCharacterPresentationMetrics,
  getAuthoredCharacterPresentationMetrics,
  getCharacterStepBounceLift,
  getCharacterStepMotion,
  MAP_CHARACTER_REFERENCE_HEIGHT,
  MAP_CHARACTER_REFERENCE_TILE_SIZE,
} from "./characterPresentation";

describe("facility character presentation", () => {
  it("renders the 24x36 canonical map frame at a crisp 3:2 size", () => {
    expect(MAP_CHARACTER_REFERENCE_TILE_SIZE).toBe(52);
    expect(MAP_CHARACTER_REFERENCE_HEIGHT).toBe(54);
    expect(
      getCharacterPresentationMetrics(
        { width: 24, height: 36 },
        52,
      ),
    ).toEqual({ width: 36, height: 54 });
  });

  it("scales deterministically with the facility camera", () => {
    expect(
      getCharacterPresentationMetrics(
        { width: 24, height: 36 },
        104,
      ),
    ).toEqual({ width: 72, height: 108 });
  });

  it("reduces characters with the map at overview zoom", () => {
    expect(
      getCharacterPresentationMetrics(
        { width: 24, height: 36 },
        5,
      ),
    ).toEqual({ width: 4, height: 6 });
  });

  it("keeps authored founder, patient, and v3 frames on exact integer aspect ratios", () => {
    for (const frame of [{ width: 128, height: 192 }, { width: 160, height: 240 }]) {
      const metrics = getAuthoredCharacterPresentationMetrics(frame, 52);
      expect(metrics).toEqual({ width: 70, height: 105 });
      expect(Number.isInteger(metrics.width)).toBe(true);
      expect(Number.isInteger(metrics.height)).toBe(true);
      expect(metrics.width * 3).toBe(metrics.height * 2);
    }
  });

  it("scales authored bitmap frames without fractional stretching", () => {
    for (const [tileSize, displayScale, expected] of [
      [5, 1, { width: 8, height: 12 }],
      [52, 0.5, { width: 36, height: 54 }],
      [52, 1.25, { width: 88, height: 132 }],
      [104, 1, { width: 140, height: 210 }],
    ] as const) {
      const metrics = getAuthoredCharacterPresentationMetrics(
        { width: 128, height: 192 },
        tileSize,
        displayScale,
      );
      expect(metrics).toEqual(expected);
      expect(metrics.width * 3).toBe(metrics.height * 2);
    }
  });

  it("sanitizes invalid authored frame and camera inputs to positive integer metrics", () => {
    const metrics = getAuthoredCharacterPresentationMetrics(
      { width: Number.NaN, height: -4 },
      Number.NaN,
      0,
    );
    expect(metrics).toEqual({ width: 1, height: 1 });
  });

  it("limits linear sampling to the character-atlas registration loop", () => {
    const source = readFileSync(new URL("./FacilityScene.ts", import.meta.url), "utf8");
    expect(source).toContain("private ensureCharacterStill(");
    expect(source).toContain("setFilter(Phaser.Textures.FilterMode.LINEAR)");
  });

  it("uses one 160x320 scale whose floor span matches the previous canonical frame", () => {
    const metrics = getCharacterStillPresentationMetrics(52);
    expect(metrics.height).toBe(metrics.width * 2);
    expect(CHARACTER_STILL_WIDTH_IN_TILES).toBeCloseTo(1.06424, 4);
    expect(Math.abs(metrics.height * (287 / 320) - 52 * 1.35 * (181 / 128))).toBeLessThan(1);
  });

  it("places the authored seat contact on the furniture plane without changing scale", () => {
    const metrics = getCharacterStillPresentationMetrics(52);
    const floorBase = alignCharacterStillSeatToWorld(200, 287, 221.153, metrics.height);
    expect(floorBase).toBeCloseTo(200 + (287 - 221.153) * (metrics.height / 320), 8);
    expect(getCharacterStillPresentationMetrics(52)).toEqual(metrics);
  });

  it("uses grounded seven-pixel cosine arcs at two hertz only while moving", () => {
    expect(CHARACTER_STEP_BOUNCE_HEIGHT).toBe(7);
    expect(CHARACTER_STEP_BOUNCE_HERTZ).toBe(2);
    expect(getCharacterStepBounceLift(0, "walk-neutral")).toBe(0);
    expect(getCharacterStepBounceLift(250, "walk-neutral")).toBeCloseTo(7, 10);
    expect(getCharacterStepBounceLift(500, "walk-neutral")).toBeCloseTo(0, 10);
    expect(getCharacterStepBounceLift(750, "walk-a")).toBeCloseTo(7, 10);
    expect(getCharacterStepBounceLift(125, "idle")).toBe(0);
    expect(getCharacterStepBounceLift(125, "seated")).toBe(0);
    expect(getCharacterStepBounceLift(125, "exam-table")).toBe(0);
  });

  it("uses one-hertz sway only for north and south travel", () => {
    expect(CHARACTER_STEP_SWAY_DEGREES).toBe(1.5);
    expect(CHARACTER_STEP_SWAY_HERTZ).toBe(1);
    expect(CHARACTER_STOP_SETTLE_MILLISECONDS).toBe(120);
    expect(getCharacterStepMotion(250, "walk-neutral", "front")).toEqual({ lift: 7, angle: 1.5 });
    expect(getCharacterStepMotion(750, "walk-neutral", "back")).toEqual({ lift: 7, angle: -1.5 });
    expect(getCharacterStepMotion(250, "walk-neutral", "side")).toEqual({ lift: 7, angle: 0 });
    expect(getCharacterStepMotion(250, "seated", "front")).toEqual({ lift: 0, angle: 0 });
  });
});
