import { describe, expect, it } from "vitest";
import {
  RANDOM_STREAMS,
  createPatientDisplayName,
  createPatientPixelAppearance,
  createDeterministicRandom,
  deterministicShuffle,
} from "../src";

describe("versioned deterministic randomness", () => {
  it("matches the frozen xoshiro128** vector for one named purpose", () => {
    const random = createDeterministicRandom(
      "seed-alpha",
      RANDOM_STREAMS.answerOrder,
      "encounter.1|node.1",
    );
    expect([
      random.nextUint32(),
      random.nextUint32(),
      random.nextUint32(),
      random.nextUint32(),
    ]).toEqual([1_949_625_546, 351_526_024, 2_563_490_871, 4_022_942_870]);
  });

  it("keeps streams and purposes independent and reproduces exact shuffles", () => {
    const source = ["a", "b", "c", "d"] as const;
    const first = deterministicShuffle(
      source,
      "seed-alpha",
      RANDOM_STREAMS.answerOrder,
      "encounter.1|node.1",
    );
    const replay = deterministicShuffle(
      source,
      "seed-alpha",
      RANDOM_STREAMS.answerOrder,
      "encounter.1|node.1",
    );
    const otherPurpose = deterministicShuffle(
      source,
      "seed-alpha",
      RANDOM_STREAMS.answerOrder,
      "encounter.2|node.1",
    );
    const otherStream = deterministicShuffle(
      source,
      "seed-alpha",
      RANDOM_STREAMS.patientAppearance,
      "encounter.1|node.1",
    );

    expect(source).toEqual(["a", "b", "c", "d"]);
    expect(first).toEqual(["a", "d", "b", "c"]);
    expect(replay).toEqual(first);
    expect(otherPurpose).not.toEqual(first);
    expect(otherStream).not.toEqual(first);
  });

  it("returns unbiased-range integers inside their requested bounds", () => {
    const random = createDeterministicRandom(
      "seed-range",
      RANDOM_STREAMS.answerOrder,
      "integer-range",
    );
    const draws = Array.from({ length: 1_000 }, () => random.integer(7));
    expect(draws.every((draw) => draw >= 0 && draw < 7)).toBe(true);
    expect(new Set(draws).size).toBe(7);
  });

  it("freezes varied patient identities in an independent named stream", () => {
    const first = createPatientDisplayName("campaign-seed", "encounter.1");
    const replay = createPatientDisplayName("campaign-seed", "encounter.1");
    const second = createPatientDisplayName("campaign-seed", "encounter.2");

    expect(first).toBe(replay);
    expect(second).not.toBe(first);
    expect(first).toMatch(/^[A-Z][a-z]+ [A-Z][a-z]+$/);
  });

  it("uses chart-compatible names and avatar families for specified patient sex", () => {
    const feminineName = createPatientDisplayName(
      "campaign-seed",
      "encounter.sex-match",
      "Female",
    );
    const masculineName = createPatientDisplayName(
      "campaign-seed",
      "encounter.sex-match",
      "Male",
    );
    expect(feminineName).toMatch(
      /^(Amelia|Ava|Chloe|Elena|Grace|Hannah|Isabella|Julia|Leah|Lily|Maya|Natalie|Nora|Olivia|Sophia|Zoe) /,
    );
    expect(masculineName).toMatch(
      /^(Adam|Benjamin|Caleb|Daniel|Elijah|Ethan|Henry|Isaac|James|Liam|Lucas|Mateo|Noah|Oliver|Samuel|Theo) /,
    );
    expect(feminineName).not.toBe(masculineName);

    const feminineAppearance = createPatientPixelAppearance(
      "campaign-seed",
      "encounter.sex-match",
      "Female",
    );
    const masculineAppearance = createPatientPixelAppearance(
      "campaign-seed",
      "encounter.sex-match",
      "Male",
    );
    expect(feminineAppearance.headVariant).toBeGreaterThanOrEqual(10);
    expect(feminineAppearance.headVariant).toBeLessThan(20);
    expect(feminineAppearance.bodyVariant).toBeGreaterThanOrEqual(10);
    expect(feminineAppearance.bodyVariant).toBeLessThan(20);
    expect(masculineAppearance.headVariant).toBeGreaterThanOrEqual(0);
    expect(masculineAppearance.headVariant).toBeLessThan(10);
    expect(masculineAppearance.bodyVariant).toBeGreaterThanOrEqual(0);
    expect(masculineAppearance.bodyVariant).toBeLessThan(10);
  });

  it("keeps an unspecified patient within one coherent human avatar family", () => {
    const appearance = createPatientPixelAppearance(
      "campaign-seed",
      "encounter.unspecified",
      "Not specified",
    );
    const headFamily = Math.floor((appearance.headVariant ?? 0) / 10);
    const bodyFamily = Math.floor((appearance.bodyVariant ?? 0) / 10);
    expect(headFamily).toBe(bodyFamily);
    expect(headFamily).toBeLessThan(2);
  });
});
