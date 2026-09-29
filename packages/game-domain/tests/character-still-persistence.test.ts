import { describe, expect, it } from "vitest";
import {
  createInitialGameState,
  createPixelAppearance,
  deserializeGameState,
  normalizePixelAppearance,
  serializeGameState,
  withExplicitAdditionalAvatarStill,
} from "../src";

describe("character still persistence", () => {
  it("preserves valid unknown still IDs without changing clinical identity or case data", () => {
    const state = createInitialGameState(undefined, { campaignId: "still-persistence", campaignSeed: "still-persistence", createdAtRealMs: 0 });
    const encounter = Object.values(state.encounters)[0]!;
    const caseBefore = JSON.stringify(encounter.frozenCase);
    const patientIdentityBefore = encounter.patientAppearance.patientIdentityId;
    encounter.patientAppearance.stillId = "future.patient-art.v2";
    const restored = deserializeGameState(serializeGameState(state));
    const reloaded = restored.encounters[encounter.id]!;
    expect(reloaded.patientAppearance.stillId).toBe("future.patient-art.v2");
    expect(reloaded.patientAppearance.patientIdentityId).toBe(patientIdentityBefore);
    expect(JSON.stringify(reloaded.frozenCase)).toBe(caseBefore);
  });

  it("rejects empty or overlong IDs and deterministically restores a compatible still", () => {
    for (const invalid of ["   ", "x".repeat(129)]) {
      const state = createInitialGameState(undefined, { campaignId: `invalid-${invalid.length}`, campaignSeed: "invalid-still", createdAtRealMs: 0 });
      const encounter = Object.values(state.encounters)[0]!;
      encounter.patientAppearance.stillId = invalid;
      const restored = deserializeGameState(serializeGameState(state));
      const stillId = restored.encounters[encounter.id]!.patientAppearance.stillId;
      expect(stillId).toBeDefined();
      expect(stillId).not.toBe(invalid);
      expect(stillId!.length).toBeLessThanOrEqual(128);
    }
  });

  it("round-trips staff still identity and migrates a missing staff still deterministically", () => {
    const state = createInitialGameState(undefined, { campaignId: "staff-still", campaignSeed: "staff-still", createdAtRealMs: 0 });
    const location = { ...state.environment.founderLocation };
    state.employees.push({
      id: "employee.still-test", staffRoleDefinitionId: "staff.receptionist", displayName: "Still Test",
      appearance: createPixelAppearance(state.campaignSeed, "staff", "employee.still-test", "receptionist"),
      hiredAtFacilityTick: 0, salaryPerExpenseInterval: 0, morale: 100, trainingLevel: 1,
      homeRoomInstanceId: null, location, path: [location], pathIndex: 0, lastMovedAtFacilityTick: 0,
      lastPraisedAtFacilityTick: null, nextIdleActionAtFacilityTick: 100,
    });
    const selected = state.employees[0]!.appearance.stillId;
    expect(selected).toBeDefined();
    expect(deserializeGameState(serializeGameState(state)).employees[0]!.appearance.stillId).toBe(selected);
    delete state.employees[0]!.appearance.stillId;
    const migrated = deserializeGameState(serializeGameState(state)).employees[0]!.appearance.stillId;
    expect(migrated).toBe(selected);
  });

  it("persists exact founder mappings and explicit-only avatar choices", () => {
    const founderAppearance = normalizePixelAppearance({
      version: "pixel-avatar.v1", bodyShape: "average", hairStyle: "short", hairShade: 1,
      faceStyle: "round", outfitStyle: "plain", outfitShade: 1, accessory: "none",
      headVariant: 29, bodyVariant: 29, roleStyle: "founder",
    }, "founder");
    const state = createInitialGameState(undefined, {
      campaignId: "founder-still", campaignSeed: "founder-still", createdAtRealMs: 0,
      founder: { displayName: "Founder", headId: "head.30", bodyId: "body.30", appearance: founderAppearance },
    });
    const restored = deserializeGameState(serializeGameState(state));
    expect(restored.founder.appearance.stillId).toBe("founder.30");
    restored.founder.appearance = withExplicitAdditionalAvatarStill(restored.founder.appearance, "retained.gray-braid");
    expect(deserializeGameState(serializeGameState(restored)).founder.appearance.stillId).toBe("retained.gray-braid");
  });

  it("projects a legacy mismatched founder pair onto its saved head identity without mutating either saved variant", () => {
    const state = createInitialGameState(undefined, {
      campaignId: "legacy-founder-still", campaignSeed: "legacy-founder-still", createdAtRealMs: 0,
      founder: {
        displayName: "Legacy Founder", headId: "head.12", bodyId: "body.04",
        appearance: normalizePixelAppearance({
          version: "pixel-avatar.v1", bodyShape: "tall", hairStyle: "short", hairShade: 2,
          faceStyle: "square", outfitStyle: "coat", outfitShade: 2, accessory: "glasses",
          headVariant: 11, bodyVariant: 3, roleStyle: "founder",
        }, "founder"),
      },
    });
    expect(state.founder.appearance.stillId).toBe("founder.12");
    delete state.founder.appearance.stillId;
    const restored = deserializeGameState(serializeGameState(state));
    expect(restored.founder).toMatchObject({ headId: "head.12", bodyId: "body.04" });
    expect(restored.founder.appearance).toMatchObject({ headVariant: 11, bodyVariant: 3, stillId: "founder.12" });
  });
});
