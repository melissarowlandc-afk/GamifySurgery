import type { PixelAppearanceDescriptor } from "@gamify-surgery/game-domain";
import { describe, expect, it } from "vitest";
import {
  characterAppearanceSignature,
  CHARACTER_PORTRAIT_HEIGHT,
  CHARACTER_PORTRAIT_WIDTH,
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
    expect(portraitSource.width).toBe(CHARACTER_PORTRAIT_WIDTH);
    expect(portraitSource.height).toBe(CHARACTER_PORTRAIT_HEIGHT);
    expect(portraitSource.cells.length).toBeGreaterThan(900);
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

  it("keeps close-up portrait detail native, bounded, and tied to the same descriptor", () => {
    const portrait = getCharacterPortraitFrame(APPEARANCE);
    const alternate = getCharacterPortraitFrame({
      ...APPEARANCE,
      headVariant: 12,
      bodyVariant: 16,
      hairStyle: "curly",
      outfitStyle: "coat",
    });

    expect(portrait.cells.every((cell) => cell.x >= 0 && cell.x < portrait.width)).toBe(true);
    expect(portrait.cells.every((cell) => cell.y >= 0 && cell.y < portrait.height)).toBe(true);
    expect(frameSignature(portrait)).not.toBe(frameSignature(alternate));
    expect(portrait.cells.length).toBeGreaterThan(
      getCharacterPixelFrame(APPEARANCE).cells.length * 3,
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

  it("gives each Level 2 staff role a distinct deterministic uniform", () => {
    const roles = [
      "periop_nurse",
      "endoscopy_nurse",
      "endoscopist",
      "phlebotomist",
      "evs_worker",
      "glp1_np",
    ] as const;
    const signatures = roles.map((roleStyle) =>
      frameSignature(
        getCharacterPixelFrame({ ...APPEARANCE, roleStyle }, {
          direction: "front",
          pose: "idle",
        }),
      ),
    );

    expect(new Set(signatures).size).toBe(roles.length);
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
  }, 10_000);

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

  it("keeps mixed classic and expanded portrait pairs bounded and distinct", () => {
    for (let headIndex = 0; headIndex < 10; headIndex += 1) {
      const classicPair = getCharacterPortraitFrame(
        createFounderAppearance(headIndex, 0),
      );
      const expandedBodyPair = getCharacterPortraitFrame(
        createFounderAppearance(headIndex, 10),
      );

      expect(expandedBodyPair.width).toBe(CHARACTER_PORTRAIT_WIDTH);
      expect(expandedBodyPair.height).toBe(CHARACTER_PORTRAIT_HEIGHT);
      expect(frameSignature(expandedBodyPair)).not.toBe(frameSignature(classicPair));
    }

    for (let bodyIndex = 0; bodyIndex < 10; bodyIndex += 1) {
      const classicPair = getCharacterPortraitFrame(
        createFounderAppearance(0, bodyIndex),
      );
      const expandedHeadPair = getCharacterPortraitFrame(
        createFounderAppearance(10, bodyIndex),
      );

      expect(expandedHeadPair.width).toBe(CHARACTER_PORTRAIT_WIDTH);
      expect(expandedHeadPair.height).toBe(CHARACTER_PORTRAIT_HEIGHT);
      expect(frameSignature(expandedHeadPair)).not.toBe(frameSignature(classicPair));
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

  it("keeps the procedural lateral neutral frame at idle geometry", () => {
    for (const direction of ["front", "side", "back"] as const) {
      const idle = getCharacterPixelFrame(APPEARANCE, { direction, pose: "idle" });
      const neutral = getCharacterPixelFrame(APPEARANCE, {
        direction,
        pose: "walk-neutral",
      });
      expect(frameSignature(neutral)).toBe(frameSignature(idle));
    }
  });

  it("keeps authored working and interaction poses distinct, bounded, and map-sized", () => {
    for (const direction of ["front", "side", "back"] as const) {
      const idle = getCharacterPixelFrame(APPEARANCE, {
        direction,
        pose: "idle",
      });
      const working = getCharacterPixelFrame(APPEARANCE, {
        direction,
        pose: "working",
      });
      const interaction = getCharacterPixelFrame(APPEARANCE, {
        direction,
        pose: "interaction",
      });

      expect(frameSignature(working)).not.toBe(frameSignature(idle));
      expect(frameSignature(interaction)).not.toBe(frameSignature(idle));
      expect(working.width).toBe(idle.width);
      expect(working.height).toBe(idle.height);
      expect(interaction.width).toBe(idle.width);
      expect(interaction.height).toBe(idle.height);
      for (const frame of [working, interaction]) {
        frame.cells.forEach((cell) => {
          expect(cell.x).toBeGreaterThanOrEqual(0);
          expect(cell.y).toBeGreaterThanOrEqual(0);
          expect(cell.x).toBeLessThan(frame.width);
          expect(cell.y).toBeLessThan(frame.height);
        });
      }
    }
  });

  it("retains 30 mix-and-match presets with inclusive human hair and coat variety", () => {
    expect(FOUNDER_HEAD_PRESETS).toHaveLength(30);
    expect(FOUNDER_BODY_PRESETS).toHaveLength(30);
    expect(FOUNDER_HEAD_PRESETS.filter((preset) => preset.group === "classic")).toHaveLength(10);
    expect(FOUNDER_HEAD_PRESETS.filter((preset) => preset.group === "female")).toHaveLength(10);
    expect(FOUNDER_HEAD_PRESETS.filter((preset) => preset.group === "non-human")).toHaveLength(10);
    for (const group of ["classic", "female"] as const) {
      const shadeValues = FOUNDER_HEAD_PRESETS
        .filter((preset) => preset.group === group)
        .map((preset) => preset.hairShade);
      for (const requiredShade of [0, 1, 2, 3]) {
        expect(shadeValues).toContain(requiredShade);
      }
      expect(
        FOUNDER_BODY_PRESETS.filter(
          (preset) => preset.group === group && preset.outfitStyle === "coat",
        ),
      ).toHaveLength(3);
    }
    expect(FOUNDER_HEAD_PRESETS.map((preset) => preset.label)).toContain("Cat");
    expect(FOUNDER_HEAD_PRESETS.map((preset) => preset.label)).toContain("Penguin");
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
