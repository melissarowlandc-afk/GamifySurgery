import { describe, expect, it } from "vitest";
import {
  createInitialGameState,
  deserializeGameState,
  normalizePixelAppearance,
  roleStyleForStaffDefinition,
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
  it("maps and round-trips every Level 2 staff visual identity", () => {
    const roles = [
      ["staff.periop_nurse", "periop_nurse"],
      ["staff.endoscopy_nurse", "endoscopy_nurse"],
      ["staff.endoscopist", "endoscopist"],
      ["staff.phlebotomist", "phlebotomist"],
      ["staff.evs_worker", "evs_worker"],
      ["staff.glp1_np", "glp1_np"],
    ] as const;
    for (const [definitionId, roleStyle] of roles) {
      expect(roleStyleForStaffDefinition(definitionId)).toBe(roleStyle);
      const state = createInitialGameState();
      state.employees.push({
        id: `employee.${roleStyle}`,
        staffRoleDefinitionId: definitionId,
        displayName: roleStyle,
        appearance: normalizePixelAppearance(FOUNDER.appearance, roleStyle),
        hiredAtFacilityTick: 0,
        salaryPerExpenseInterval: 0,
        morale: 50,
        trainingLevel: 1,
        homeRoomInstanceId: null,
        location: { x: 0, y: 0 },
        path: [], pathIndex: 0, lastMovedAtFacilityTick: 0,
        lastPraisedAtFacilityTick: null, nextIdleActionAtFacilityTick: 0,
        facilityTask: null,
      });
      const restored = deserializeGameState(serializeGameState(state));
      expect(restored.employees.at(-1)?.appearance.roleStyle).toBe(roleStyle);
    }
  });

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
    // The chart-facing presentation family remains female while the rendered
    // authored identity keeps one coherent head/body skin/neck pair.
    expect(appearance.bodyVariant).toBe(12);
    expect(appearance.patientIdentityId).toMatch(/^patient\.adult\.\d{3}$/);
  });
});
