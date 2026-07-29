import { describe, expect, it } from "vitest";
import {
  getCharacterPresentationMetrics,
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
});
