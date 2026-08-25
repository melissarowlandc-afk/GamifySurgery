import type { PixelAppearanceDescriptor } from "@gamify-surgery/game-domain";
import { describe, expect, it } from "vitest";
import {
  characterAppearanceSignature,
  getCharacterPixelFrame,
  getCharacterPortraitFrame,
  resolveCharacterAppearance,
} from "./characterArt";
import {
  createFounderAppearance,
  FOUNDER_BODY_PRESETS,
  FOUNDER_HEAD_PRESETS,
} from "../content/founderAppearancePresets";
import type { PixelCell, PixelFrame } from "./pixelArt";

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

function frameSignature(
  frame: PixelFrame,
  include: (cell: PixelCell) => boolean = () => true,
): string {
  return frame.cells
    .filter(include)
    .map((cell) => `${cell.x},${cell.y},${cell.color}`)
    .join("|");
}

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
    const seated = getCharacterPixelFrame(APPEARANCE, {
      direction: "front",
      pose: "seated",
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
    expect(seated).not.toEqual(front);
    expect(seated.width).toBe(front.width);
    expect(seated.height).toBe(front.height);
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

  it("renders all 900 founder head and body combinations", () => {
    for (
      let headIndex = 0;
      headIndex < FOUNDER_HEAD_PRESETS.length;
      headIndex += 1
    ) {
      for (
        let bodyIndex = 0;
        bodyIndex < FOUNDER_BODY_PRESETS.length;
        bodyIndex += 1
      ) {
        const appearance = createFounderAppearance(
          headIndex,
          bodyIndex,
        );
        const mapFrame = getCharacterPixelFrame(appearance, {
          direction: "front",
          pose: "idle",
        });
        const portrait = getCharacterPortraitFrame(appearance);

        expect(mapFrame.cells.length).toBeGreaterThan(80);
        expect(portrait.cells.length).toBeGreaterThan(150);
      }
    }
  });

  it("gives every founder head and body option distinct canonical art", () => {
    const headPortraits = FOUNDER_HEAD_PRESETS.map((_, headIndex) =>
      frameSignature(
        getCharacterPortraitFrame(
          createFounderAppearance(headIndex, 0),
        ),
      ),
    );
    const bodySprites = FOUNDER_BODY_PRESETS.map((_, bodyIndex) =>
      frameSignature(
        getCharacterPixelFrame(
          createFounderAppearance(0, bodyIndex),
          { direction: "front", pose: "idle" },
        ),
      ),
    );

    expect(new Set(headPortraits).size).toBe(
      FOUNDER_HEAD_PRESETS.length,
    );
    expect(new Set(bodySprites).size).toBe(
      FOUNDER_BODY_PRESETS.length,
    );
  });

  it("preserves classic portrait components in mixed classic and expanded pairs", () => {
    for (let headIndex = 0; headIndex < 10; headIndex += 1) {
      const classicPair = getCharacterPortraitFrame(
        createFounderAppearance(headIndex, 0),
      );
      const expandedBodyPair = getCharacterPortraitFrame(
        createFounderAppearance(headIndex, 10),
      );

      expect(
        frameSignature(expandedBodyPair, (cell) => cell.y < 28),
      ).toBe(frameSignature(classicPair, (cell) => cell.y < 28));
    }

    for (let bodyIndex = 0; bodyIndex < 10; bodyIndex += 1) {
      const classicPair = getCharacterPortraitFrame(
        createFounderAppearance(0, bodyIndex),
      );
      const expandedHeadPair = getCharacterPortraitFrame(
        createFounderAppearance(10, bodyIndex),
      );

      expect(
        frameSignature(expandedHeadPair, (cell) => cell.y >= 33),
      ).toBe(frameSignature(classicPair, (cell) => cell.y >= 33));
    }
  });

  it("keeps the fitted blazer and cardigan distinct from the side and back", () => {
    for (const direction of ["side", "back"] as const) {
      for (const pose of ["idle", "walk-a", "walk-b"] as const) {
        const fittedBlazer = getCharacterPixelFrame(
          createFounderAppearance(0, 10),
          { direction, pose },
        );
        const cardigan = getCharacterPixelFrame(
          createFounderAppearance(0, 12),
          { direction, pose },
        );

        expect(frameSignature(fittedBlazer)).not.toBe(
          frameSignature(cardigan),
        );
      }
    }
  });

  it("animates the penguin body while walking toward the camera", () => {
    const appearance = createFounderAppearance(21, 21);
    const idle = getCharacterPixelFrame(appearance, {
      direction: "front",
      pose: "idle",
    });
    const walkA = getCharacterPixelFrame(appearance, {
      direction: "front",
      pose: "walk-a",
    });
    const walkB = getCharacterPixelFrame(appearance, {
      direction: "front",
      pose: "walk-b",
    });

    expect(frameSignature(walkA)).not.toBe(frameSignature(idle));
    expect(frameSignature(walkB)).not.toBe(frameSignature(idle));
    expect(frameSignature(walkA)).not.toBe(frameSignature(walkB));
  });

  it.each([
    ["female", 10],
    ["cat", 20],
    ["penguin", 21],
    ["robot", 28],
    ["axolotl", 29],
  ] as const)(
    "keeps the %s identity recognizable in every direction and pose",
    (_label, variantIndex) => {
      const appearance = createFounderAppearance(
        variantIndex,
        variantIndex,
      );
      const front = getCharacterPixelFrame(appearance, {
        direction: "front",
        pose: "idle",
      });
      const side = getCharacterPixelFrame(appearance, {
        direction: "side",
        pose: "walk-a",
      });
      const back = getCharacterPixelFrame(appearance, {
        direction: "back",
        pose: "idle",
      });
      const jump = getCharacterPixelFrame(appearance, {
        direction: "front",
        pose: "star-jump",
      });
      const portrait = getCharacterPortraitFrame(appearance);

      expect(side).not.toEqual(front);
      expect(back).not.toEqual(front);
      expect(jump).not.toEqual(front);
      expect(portrait.width).toBeGreaterThan(front.width);
      expect(characterAppearanceSignature(appearance)).toContain(
        `:${variantIndex}:`,
      );
    },
  );
});
