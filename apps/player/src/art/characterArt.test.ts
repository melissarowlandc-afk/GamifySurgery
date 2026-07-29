import type { PixelAppearanceDescriptor } from "@gamify-surgery/game-domain";
import { describe, expect, it } from "vitest";
import {
  characterAppearanceSignature,
  getCharacterPixelFrame,
  getCharacterPortraitFrame,
  resolveCharacterAppearance,
} from "./characterArt";

const APPEARANCE: PixelAppearanceDescriptor = {
  version: "pixel-avatar.v1",
  bodyShape: "average",
  hairStyle: "curly",
  skinTone: 2,
  hairShade: 1,
  faceStyle: "round",
  outfitStyle: "coat",
  outfitShade: 2,
  accessory: "glasses",
  headVariant: 7,
  bodyVariant: 4,
  roleStyle: "founder",
};

describe("canonical character pixel art", () => {
  it("renders every representation from one stable appearance identity", () => {
    const front = getCharacterPixelFrame(APPEARANCE, {
      direction: "front",
      pose: "idle",
    });
    const portraitSource = getCharacterPortraitFrame(APPEARANCE);
    const side = getCharacterPixelFrame(APPEARANCE, {
      direction: "side",
      pose: "walk-a",
    });
    const back = getCharacterPixelFrame(APPEARANCE, {
      direction: "back",
      pose: "idle",
    });
    const jump = getCharacterPixelFrame(APPEARANCE, {
      direction: "front",
      pose: "star-jump",
    });

    expect(front.width).toBe(24);
    expect(front.height).toBe(36);
    expect(front.cells.length).toBeGreaterThan(210);
    expect(portraitSource.width).toBe(38);
    expect(portraitSource.height).toBe(42);
    expect(portraitSource.cells.length).toBeGreaterThan(front.cells.length);
    expect(portraitSource).not.toEqual(front);
    expect(side).not.toEqual(front);
    expect(back).not.toEqual(front);
    expect(jump).not.toEqual(front);
    expect(characterAppearanceSignature(APPEARANCE)).toBe(
      characterAppearanceSignature(resolveCharacterAppearance(APPEARANCE)),
    );
  });

  it("normalizes a legacy appearance deterministically without rerolling", () => {
    const legacy = {
      ...APPEARANCE,
      skinTone: undefined,
      headVariant: undefined,
      bodyVariant: undefined,
      roleStyle: undefined,
    };

    expect(resolveCharacterAppearance(legacy)).toEqual(
      resolveCharacterAppearance(legacy),
    );
    expect(
      characterAppearanceSignature(resolveCharacterAppearance(legacy)),
    ).not.toContain("undefined");
  });
});
