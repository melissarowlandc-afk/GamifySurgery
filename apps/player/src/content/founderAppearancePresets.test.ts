import { describe, expect, it } from "vitest";
import {
  createFounderAppearance,
  createUnifiedFounderAppearance,
  FOUNDER_BODY_PRESETS,
  FOUNDER_HEAD_PRESETS,
  FOUNDER_IDENTITY_PRESETS,
} from "./founderAppearancePresets";

describe("founder appearance presets", () => {
  it("provides 10 classic, 10 female, and 10 non-human choices for both parts", () => {
    expect(FOUNDER_HEAD_PRESETS).toHaveLength(30);
    expect(FOUNDER_BODY_PRESETS).toHaveLength(30);

    for (const presets of [
      FOUNDER_HEAD_PRESETS,
      FOUNDER_BODY_PRESETS,
    ]) {
      expect(
        presets.filter((preset) => preset.group === "classic"),
      ).toHaveLength(10);
      expect(
        presets.filter((preset) => preset.group === "female"),
      ).toHaveLength(10);
      expect(
        presets.filter((preset) => preset.group === "non-human"),
      ).toHaveLength(10);
      expect(new Set(presets.map((preset) => preset.id)).size).toBe(30);
      expect(new Set(presets.map((preset) => preset.label)).size).toBe(
        30,
      );
    }
  });

  it("keeps the original stable IDs and exposes cat and penguin options", () => {
    expect(
      FOUNDER_HEAD_PRESETS.slice(0, 10).map((preset) => preset.id),
    ).toEqual(
      Array.from(
        { length: 10 },
        (_, index) => `head.${String(index + 1).padStart(2, "0")}`,
      ),
    );
    expect(
      FOUNDER_BODY_PRESETS.slice(0, 10).map((preset) => preset.id),
    ).toEqual(
      Array.from(
        { length: 10 },
        (_, index) => `body.${String(index + 1).padStart(2, "0")}`,
      ),
    );

    for (const requiredLabel of ["Cat", "Penguin"]) {
      expect(
        FOUNDER_HEAD_PRESETS.some(
          (preset) =>
            preset.group === "non-human" &&
            preset.label === requiredLabel,
        ),
      ).toBe(true);
      expect(
        FOUNDER_BODY_PRESETS.some(
          (preset) =>
            preset.group === "non-human" &&
            preset.label === requiredLabel,
        ),
      ).toBe(true);
    }
  });

  it("gives every choice a unique descriptive name instead of a numbered placeholder", () => {
    for (const presets of [
      FOUNDER_HEAD_PRESETS,
      FOUNDER_BODY_PRESETS,
    ]) {
      expect(
        presets.every(
          (preset) =>
            preset.label.trim().length > 0 &&
            !/^(?:classic|head|body)\s*\d+$/i.test(preset.label),
        ),
      ).toBe(true);
      expect(new Set(presets.map((preset) => preset.label)).size).toBe(
        presets.length,
      );
    }
  });

  it("uses neutral human-head labels while keeping the saved appearance data intact", () => {
    const forbiddenColorWords = /\b(?:black|brown|red|blond|blonde|gray|grey)\b/i;
    const humanHeads = FOUNDER_HEAD_PRESETS.filter(
      (preset) => preset.group !== "non-human",
    );
    expect(humanHeads.every((preset) => !forbiddenColorWords.test(preset.label))).toBe(true);
    expect(new Set(humanHeads.map((preset) => preset.label)).size).toBe(humanHeads.length);
  });

  it("retains the legacy mix-and-match compatibility helper without changing stable variants", () => {
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
        expect(appearance.headVariant).toBe(
          FOUNDER_HEAD_PRESETS[headIndex]!.headVariant,
        );
        expect(appearance.bodyVariant).toBe(
          FOUNDER_BODY_PRESETS[bodyIndex]!.bodyVariant,
        );
        expect(appearance.roleStyle).toBe("founder");
      }
    }
  });

  it("exposes exactly 30 coherent creator identities with paired stable fields", () => {
    expect(FOUNDER_IDENTITY_PRESETS).toHaveLength(30);
    for (let index = 0; index < FOUNDER_IDENTITY_PRESETS.length; index += 1) {
      const identity = FOUNDER_IDENTITY_PRESETS[index]!;
      const appearance = createUnifiedFounderAppearance(index);
      expect(identity.head.headVariant).toBe(identity.body.bodyVariant);
      expect(appearance.headVariant).toBe(appearance.bodyVariant);
      expect(identity.head.id).toBe(`head.${String(index + 1).padStart(2, "0")}`);
      expect(identity.body.id).toBe(`body.${String(index + 1).padStart(2, "0")}`);
    }
  });
});
