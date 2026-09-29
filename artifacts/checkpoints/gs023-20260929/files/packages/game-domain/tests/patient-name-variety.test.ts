import { describe, expect, it } from "vitest";
import {
  createInitialGameState,
  createPatientDisplayName,
  deserializeGameState,
  gameReducer,
  serializeGameState,
} from "../src";

function lastName(displayName: string): string {
  return displayName.split(" ").at(-1)!;
}

describe("patient name variety", () => {
  it("offers varied deterministic names without changing the named identity stream", () => {
    const generated = Array.from(
      { length: 384 },
      (_, index) => createPatientDisplayName(`campaign.${index}`, `actor.${index}`),
    );
    expect(new Set(generated).size).toBeGreaterThan(300);
    expect(new Set(generated.map(lastName)).size).toBeGreaterThanOrEqual(80);
    expect(
      createPatientDisplayName("campaign.replay", "actor.replay", "Female"),
    ).toBe(
      createPatientDisplayName("campaign.replay", "actor.replay", "Female"),
    );
  });

  it("deterministically avoids an active full-name and surname collision", () => {
    const campaignSeed = "campaign.active-collision";
    const actorId = "visitor.active-collision";
    const activeName = createPatientDisplayName(campaignSeed, actorId);
    const replacement = createPatientDisplayName(
      campaignSeed,
      actorId,
      undefined,
      [activeName, "Already Here Stone"],
    );

    expect(replacement).not.toBe(activeName);
    expect(lastName(replacement)).not.toBe(lastName(activeName));
    expect(lastName(replacement)).not.toBe("Stone");
    expect(
      createPatientDisplayName(campaignSeed, actorId, undefined, [activeName, "Already Here Stone"]),
    ).toBe(replacement);
  });

  it("falls back to a fresh full name after every surname is actively reserved", () => {
    const reservedBySurname = new Map<string, string>();
    for (let index = 0; index < 5_000 && reservedBySurname.size < 96; index += 1) {
      const generated = createPatientDisplayName(`campaign.surname.${index}`, `actor.${index}`);
      reservedBySurname.set(lastName(generated), `Already Here ${lastName(generated)}`);
    }
    expect(reservedBySurname.size).toBe(96);

    const reserved = [...reservedBySurname.values()];
    const replacement = createPatientDisplayName(
      "campaign.all-surnames-reserved",
      "actor.all-surnames-reserved",
      undefined,
      reserved,
    );
    expect(reserved).not.toContain(replacement);
    expect(reservedBySurname.has(lastName(replacement))).toBe(true);
    expect(replacement).toBe(
      createPatientDisplayName(
        "campaign.all-surnames-reserved",
        "actor.all-surnames-reserved",
        undefined,
        reserved,
      ),
    );
  });

  it("uses the active-name exclusion when an automatically admitted patient would collide", () => {
    const options = {
      campaignId: "campaign.names.admission",
      campaignSeed: "names.admission",
      createdAtRealMs: 0,
    };
    const source = createInitialGameState(undefined, options);
    const current = Object.values(source.encounters)[0]!;
    const command = {
      type: "ADMIT_PATIENT" as const,
      operationId: "names.admission",
      encounterId: "encounter.names.admission",
      caseId: current.frozenCase.id,
      // Runtime accepts automatic arrivals without an authored display name.
      patientDisplayName: undefined as never,
      arrivalClass: "routine" as const,
    };
    const withoutActivePatient = createInitialGameState(undefined, options);
    withoutActivePatient.encounters = {};
    const expectedWithoutExclusion = gameReducer(withoutActivePatient, command)
      .encounters[command.encounterId]!.patientDisplayName;

    current.patientDisplayName = expectedWithoutExclusion;
    const admitted = gameReducer(source, command);
    const generatedName = admitted.encounters[command.encounterId]!.patientDisplayName;

    expect(admitted.operationReceipts[command.operationId]?.status).toBe("applied");
    expect(generatedName).not.toBe(expectedWithoutExclusion);
    expect(lastName(generatedName)).not.toBe(lastName(expectedWithoutExclusion));
  });

  it("preserves frozen saved patient names through reload", () => {
    const state = createInitialGameState(undefined, {
      campaignId: "campaign.names.persistence",
      campaignSeed: "names.persistence",
      createdAtRealMs: 0,
    });
    const encounter = Object.values(state.encounters)[0]!;
    const savedName = encounter.patientDisplayName;
    const restored = deserializeGameState(serializeGameState(state));

    expect(restored.encounters[encounter.id]!.patientDisplayName).toBe(savedName);
  });
});
