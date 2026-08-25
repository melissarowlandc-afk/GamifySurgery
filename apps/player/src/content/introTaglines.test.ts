import { describe, expect, it } from "vitest";
import {
  INTRO_TAGLINES,
  LAST_INTRO_TAGLINE_SESSION_KEY,
  PRIOR_AUTHORIZATION_TAGLINE,
  readLastIntroTagline,
  selectIntroTagline,
  writeLastIntroTagline,
  type IntroTaglineStorage,
} from "./introTaglines";

const APPROVED_TAGLINES = [
  "Saves a bird in the hand.",
  "Saves $400.",
  "Saves two in the bush.",
  "Saves room for dessert.",
  "Saves daylight in participating states.",
  "Saves a penny for your thoughts.",
  "Saves the elephant in the waiting room.",
  "Saves the chicken before it crosses.",
  "Saves the backup banana.",
  "Saves one medium-sized Tuesday.",
  "Saves the princess, eventually.",
  "Saves absolutely nothing.",
  "Saves nine business days.",
  "Saves nine, pending prior authorization.",
  "Saves four out of five dentists.",
  "Saves the world after sign-out.",
  "Saves one clean pair of scrubs.",
  "Saves the good trauma shears.",
  "Saves a turkey sandwich for night shift.",
  "Saves a parking spot in the next county.",
  "Saves paper by printing twice.",
  "Saves a perfectly good clipboard.",
  "Saves a little treat for later.",
  "Saves the decaf for administration.",
  "Saves nine sandwiches. Mayo extra.",
  "Saves the mystery Tupperware.",
  "Saves the Oxford comma, reluctantly.",
  "Saves the appendix for the appendix.",
  "Saves the spleen on alternating Tuesdays.",
  "Saves nine hours of mandatory modules.",
  "Saves the operating room schedule, in theory.",
  "Saves one extremely local pigeon.",
] as const;

describe("intro tagline content", () => {
  it("contains the complete, unique, nonempty approved collection", () => {
    expect(INTRO_TAGLINES).toEqual(APPROVED_TAGLINES);
    expect(new Set(INTRO_TAGLINES).size).toBe(INTRO_TAGLINES.length);
    expect(
      INTRO_TAGLINES.every((tagline) => tagline.trim().length > 0),
    ).toBe(true);
  });

  it("only selects taglines from the approved collection", () => {
    for (let sample = 0; sample < 1_000; sample += 1) {
      const selected = selectIntroTagline(
        null,
        () => sample / 1_000,
      );
      expect(INTRO_TAGLINES).toContain(selected);
    }
  });

  it("excludes the immediately preceding line whenever alternatives exist", () => {
    for (const previous of INTRO_TAGLINES) {
      for (const roll of [0, 0.05, 0.1, 0.5, 0.999_999]) {
        expect(selectIntroTagline(previous, () => roll)).not.toBe(
          previous,
        );
      }
    }
  });

  it("gives the prior-authorization line a ten-percent branch", () => {
    expect(selectIntroTagline(null, () => 0)).toBe(
      PRIOR_AUTHORIZATION_TAGLINE,
    );
    expect(selectIntroTagline(null, () => 0.099_999)).toBe(
      PRIOR_AUTHORIZATION_TAGLINE,
    );
    expect(selectIntroTagline(null, () => 0.1)).not.toBe(
      PRIOR_AUTHORIZATION_TAGLINE,
    );
    expect(
      selectIntroTagline(PRIOR_AUTHORIZATION_TAGLINE, () => 0),
    ).not.toBe(PRIOR_AUTHORIZATION_TAGLINE);
  });

  it("reads and writes the last displayed line without failing when storage is unavailable", () => {
    const values = new Map<string, string>();
    const storage: IntroTaglineStorage = {
      getItem: (key) => values.get(key) ?? null,
      setItem: (key, value) => values.set(key, value),
    };
    const selected = INTRO_TAGLINES[8];

    expect(writeLastIntroTagline(selected, storage)).toBe(true);
    expect(values.get(LAST_INTRO_TAGLINE_SESSION_KEY)).toBe(selected);
    expect(readLastIntroTagline(storage)).toBe(selected);

    const unavailableStorage: IntroTaglineStorage = {
      getItem: () => {
        throw new Error("storage unavailable");
      },
      setItem: () => {
        throw new Error("storage unavailable");
      },
    };
    expect(readLastIntroTagline(unavailableStorage)).toBeNull();
    expect(writeLastIntroTagline(selected, unavailableStorage)).toBe(
      false,
    );
    expect(() =>
      selectIntroTagline(readLastIntroTagline(unavailableStorage)),
    ).not.toThrow();
  });

  it("ignores a stale unapproved value from session storage", () => {
    const storage: IntroTaglineStorage = {
      getItem: () => "An old unapproved tagline.",
      setItem: () => undefined,
    };

    expect(readLastIntroTagline(storage)).toBeNull();
  });
});
