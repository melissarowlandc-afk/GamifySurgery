import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import {
  getCharacterPresentationMetrics,
  getAuthoredCharacterPresentationMetrics,
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
    expect(source).toContain("private registerCharacterAtlasFrames(");
    expect(source).toContain("texture.setFilter(Phaser.Textures.FilterMode.LINEAR);");
  });
});
