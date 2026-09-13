import { describe, expect, it } from "vitest";
import {
  createInitialGameState,
  deserializeGameState,
  patientRosterEntryById,
  serializeGameState,
} from "../src";

interface SerializedEncounter {
  frozenCase: {
    decisionNodes: unknown;
    prototypeDemographics?: unknown;
  };
  patientDisplayName: string;
  patientAppearance: {
    patientIdentityId?: string;
  };
}

describe("legacy patient identity persistence", () => {
  it("retains saved names, completes missing demographics, repairs incompatible art, and remains stable across reloads", () => {
    const state = createInitialGameState(undefined, {
      campaignId: "campaign.identity-reload",
      campaignSeed: "identity-reload",
      createdAtRealMs: 0,
    });
    const encounter = Object.values(state.encounters)[0]!;
    const serialized = JSON.parse(serializeGameState(state)) as {
      encounters: Record<string, SerializedEncounter>;
    };
    const savedEncounter = serialized.encounters[encounter.id]!;
    const sourceNodes = JSON.stringify(savedEncounter.frozenCase.decisionNodes);
    delete savedEncounter.frozenCase.prototypeDemographics;
    savedEncounter.patientDisplayName = "Saved Identity Name";
    savedEncounter.patientAppearance.patientIdentityId = "patient.adult.001";
    const restored = deserializeGameState(JSON.stringify(serialized));
    const restoredEncounter = restored.encounters[encounter.id]!;
    expect(restoredEncounter.patientDisplayName).toBe("Saved Identity Name");
    expect(restoredEncounter.frozenCase.prototypeDemographics).toEqual({
      ageYears: 24,
      sexLabel: "Female",
    });
    expect(patientRosterEntryById(restoredEncounter.patientAppearance.patientIdentityId)).toMatchObject({
      compatibleSexLabel: "Female",
      ageBand: "young_adult",
    });
    expect(JSON.stringify(restoredEncounter.frozenCase.decisionNodes)).toBe(sourceNodes);
    const reloaded = deserializeGameState(serializeGameState(restored));
    expect(reloaded.encounters[encounter.id]!.frozenCase.prototypeDemographics).toEqual(
      restoredEncounter.frozenCase.prototypeDemographics,
    );
    expect(reloaded.encounters[encounter.id]!.patientAppearance).toEqual(
      restoredEncounter.patientAppearance,
    );
  });
});
