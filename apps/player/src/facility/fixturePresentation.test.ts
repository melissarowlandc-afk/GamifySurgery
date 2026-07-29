import { describe, expect, it } from "vitest";
import { getFixturePresentationSize } from "./fixturePresentation";

describe("fixture presentation sizing", () => {
  it("scales proportionally with the map instead of snapping to integer sprite scales", () => {
    const atFullSize = getFixturePresentationSize(20, 10, 50, 25);
    const atHalfSize = getFixturePresentationSize(20, 10, 25, 12.5);
    expect(atFullSize).toEqual({ width: 50, height: 25 });
    expect(atHalfSize).toEqual({ width: 25, height: 13 });
  });

  it("preserves aspect ratio inside the available rectangle", () => {
    expect(getFixturePresentationSize(16, 8, 30, 30)).toEqual({
      width: 30,
      height: 15,
    });
  });
});
