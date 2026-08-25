import { describe, expect, it } from "vitest";
import {
  createInitialGameState,
  deserializeGameState,
  normalizePixelAppearance,
  serializeGameState,
  type FounderIdentity,
} from "../src";

const FOUNDER: FounderIdentity = {
  displayName: "Dr. Rowan Vale",
  headId: "head.test",
  bodyId: "body.test",
  appearance: {
    version: "pixel-avatar.v1",
    bodyShape: "tall",
    hairStyle: "curly",
    hairShade: 2,
    faceStyle: "long",
    outfitStyle: "coat",
    outfitShade: 1,
    accessory: "glasses",
  },
};

describe("campaign founder persistence", () => {
  it("stores the selected founder in the self-contained campaign save", () => {
    const expectedFounder = {
      ...FOUNDER,
      appearance: normalizePixelAppearance(
        FOUNDER.appearance,
        "founder",
      ),
    };
    const state = createInitialGameState(undefined, {
      campaignId: "campaign.founder.test",
      campaignSeed: "founder-test-seed",
      createdAtRealMs: 123,
      founder: FOUNDER,
    });

    expect(state.schemaVersion).toBe(6);
    expect(state.founder).toEqual(expectedFounder);

    const restored = deserializeGameState(serializeGameState(state));
    expect(restored.founder).toEqual(expectedFounder);
    expect(restored.learningHistories).toEqual(state.learningHistories);
  });

  it("migrates an existing version 3 campaign with a stable founder fallback", () => {
    const existing = createInitialGameState(undefined, {
      campaignId: "campaign.founder.legacy",
      campaignSeed: "legacy-founder-seed",
      createdAtRealMs: 123,
    });
    const legacy = JSON.parse(serializeGameState(existing)) as Record<
      string,
      unknown
    >;
    legacy.schemaVersion = 3;
    delete legacy.founder;

    const firstRestore = deserializeGameState(JSON.stringify(legacy));
    const replayedRestore = deserializeGameState(JSON.stringify(legacy));

    expect(firstRestore.schemaVersion).toBe(6);
    expect(firstRestore.founder.displayName).toBe("Founder");
    expect(firstRestore.founder).toEqual(replayedRestore.founder);
  });

  it("round-trips explicit high-index founder variants without changing legacy fallbacks", () => {
    const expandedFounder: FounderIdentity = {
      ...FOUNDER,
      headId: "head.30",
      bodyId: "body.30",
      appearance: {
        ...FOUNDER.appearance,
        headVariant: 29,
        bodyVariant: 29,
      },
    };
    const state = createInitialGameState(undefined, {
      campaignId: "campaign.founder.expanded",
      campaignSeed: "founder-expanded-seed",
      createdAtRealMs: 456,
      founder: expandedFounder,
    });

    const restored = deserializeGameState(serializeGameState(state));
    expect(restored.founder).toEqual(state.founder);
    expect(restored.founder.headId).toBe("head.30");
    expect(restored.founder.bodyId).toBe("body.30");
    expect(restored.founder.appearance.headVariant).toBe(29);
    expect(restored.founder.appearance.bodyVariant).toBe(29);

    const legacyAppearance = normalizePixelAppearance(
      FOUNDER.appearance,
      "founder",
    );
    expect(legacyAppearance.headVariant).toBeLessThanOrEqual(9);
    expect(legacyAppearance.bodyVariant).toBeLessThanOrEqual(9);
  });

  it("corrects a saved patient avatar family to match frozen chart demographics", () => {
    const state = createInitialGameState(undefined, {
      campaignId: "campaign.patient-sex-migration",
      campaignSeed: "patient-sex-migration-seed",
      createdAtRealMs: 789,
    });
    const encounter = state.encounters["encounter.synthetic.tutorial"]!;
    encounter.frozenCase.prototypeDemographics = {
      ageYears: 40,
      sexLabel: "Female",
    };
    encounter.patientAppearance = {
      ...encounter.patientAppearance,
      headVariant: 2,
      bodyVariant: 5,
    };

    const restored = deserializeGameState(serializeGameState(state));
    const appearance =
      restored.encounters["encounter.synthetic.tutorial"]!
        .patientAppearance;
    expect(appearance.headVariant).toBe(12);
    expect(appearance.bodyVariant).toBe(15);
  });
});
