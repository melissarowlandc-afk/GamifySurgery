import { describe, expect, it } from "vitest";
import {
  FACILITY_DEPTH_BUILD_OVERLAY,
  FACILITY_DEPTH_FLOOR_INTERACTION,
  FACILITY_DEPTH_LOCATOR,
  FACILITY_DEPTH_UI,
  getFacilitySceneDepth,
} from "./renderDepth";

describe("facility render depth", () => {
  it("places a character after every fixture on the same baseline", () => {
    const lastFixture = getFacilitySceneDepth(120, "fixture", 63);
    const firstCharacter = getFacilitySceneDepth(120, "character", 0);

    expect(firstCharacter).toBeGreaterThan(lastFixture);
  });

  it("uses the floor-contact baseline as the primary order", () => {
    const behindDesk = getFacilitySceneDepth(119, "character", 63);
    const desk = getFacilitySceneDepth(120, "fixture", 0);
    const inFrontOfDesk = getFacilitySceneDepth(
      121,
      "character",
      0,
    );

    expect(behindDesk).toBeLessThan(desk);
    expect(inFrontOfDesk).toBeGreaterThan(desk);
  });

  it("provides deterministic, bounded ordering within one kind", () => {
    expect(getFacilitySceneDepth(80, "fixture", 4)).toBe(
      getFacilitySceneDepth(80, "fixture", 4),
    );
    expect(getFacilitySceneDepth(80, "fixture", -10)).toBe(
      getFacilitySceneDepth(80, "fixture", 0),
    );
    expect(getFacilitySceneDepth(80, "character", 1000)).toBe(
      getFacilitySceneDepth(80, "character", 63),
    );
  });

  it("keeps locator and build UI in explicit foreground bands", () => {
    const ordinarySceneObject = getFacilitySceneDepth(
      2_000,
      "character",
      63,
    );

    expect(FACILITY_DEPTH_LOCATOR).toBeGreaterThan(
      ordinarySceneObject,
    );
    expect(FACILITY_DEPTH_BUILD_OVERLAY).toBeGreaterThan(
      FACILITY_DEPTH_LOCATOR,
    );
    expect(FACILITY_DEPTH_UI).toBeGreaterThan(
      FACILITY_DEPTH_BUILD_OVERLAY,
    );
  });

  it("keeps small floor interactions above ordinary scene objects but below overlays", () => {
    const frontmostOrdinaryObject = getFacilitySceneDepth(
      2_000,
      "character",
      63,
    );

    expect(FACILITY_DEPTH_FLOOR_INTERACTION).toBeGreaterThan(
      frontmostOrdinaryObject,
    );
    expect(FACILITY_DEPTH_LOCATOR).toBeGreaterThan(
      FACILITY_DEPTH_FLOOR_INTERACTION,
    );
    expect(FACILITY_DEPTH_BUILD_OVERLAY).toBeGreaterThan(
      FACILITY_DEPTH_FLOOR_INTERACTION,
    );
  });

  it("falls back safely for non-finite renderer input", () => {
    expect(getFacilitySceneDepth(Number.NaN, "fixture")).toBe(
      getFacilitySceneDepth(0, "fixture"),
    );
    expect(
      getFacilitySceneDepth(12, "character", Number.POSITIVE_INFINITY),
    ).toBe(getFacilitySceneDepth(12, "character", 0));
  });
});
