import { describe, expect, it } from "vitest";
import {
  PATIENT_CHARACTER_STILLS,
  PROTOTYPE_DOMAIN_CONTEXT,
  advanceAmbientPedestrians,
  characterStillCatalogEntryById,
  createInitialGameState,
  createPatientPixelAppearance,
  createPixelAppearance,
  deserializeGameState,
  getPatientAppearanceSelectionContext,
  normalizePatientAppearanceForSex,
  patientRosterEntryById,
  patientStillEligibleEntries,
  selectNewPatientStillId,
  serializeGameState,
} from "../src";

describe("new-patient appearance rotation", () => {
  const profile = { sexLabel: "Male" as const, ageYears: 38 };

  it("uses each compatible unoccupied still before a concurrent duplicate", () => {
    const occupiedStillIds = new Set<string>();
    const eligibleCount = patientStillEligibleEntries(
      profile.sexLabel,
      profile.ageYears,
    ).length;

    for (let index = 0; index < eligibleCount; index += 1) {
      const stillId = selectNewPatientStillId(
        "rotation-seed",
        `encounter.${index}`,
        profile,
        { occupiedStillIds, recentlyUsedStillIds: [] },
      );
      expect(stillId).toBeDefined();
      expect(occupiedStillIds.has(stillId!)).toBe(false);
      occupiedStillIds.add(stillId!);
    }

    expect(occupiedStillIds.size).toBe(eligibleCount);
  });

  it("prefers never-used then least-recently-used compatible stills", () => {
    const eligible = patientStillEligibleEntries(
      profile.sexLabel,
      profile.ageYears,
    ).map((entry) => entry.stillId);
    const neverUsed = eligible.at(-1)!;
    expect(
      selectNewPatientStillId("rotation-seed", "new", profile, {
        occupiedStillIds: new Set(),
        recentlyUsedStillIds: eligible.slice(0, -1),
      }),
    ).toBe(neverUsed);

    expect(
      selectNewPatientStillId("rotation-seed", "lru", profile, {
        occupiedStillIds: new Set(),
        recentlyUsedStillIds: eligible,
      }),
    ).toBe(eligible[0]);
  });

  it("falls back deterministically to the LRU still when the pool is exhausted", () => {
    const eligible = patientStillEligibleEntries(
      profile.sexLabel,
      profile.ageYears,
    ).map((entry) => entry.stillId);
    const context = {
      occupiedStillIds: new Set(eligible),
      recentlyUsedStillIds: eligible,
    };
    const first = selectNewPatientStillId(
      "rotation-seed",
      "exhausted",
      profile,
      context,
    );
    const second = selectNewPatientStillId(
      "rotation-seed",
      "exhausted",
      profile,
      context,
    );
    expect(first).toBe(eligible[0]);
    expect(second).toBe(first);
  });

  it("keeps the selected still and roster identity compatible with the frozen profile", () => {
    for (let index = 0; index < PATIENT_CHARACTER_STILLS.length; index += 1) {
      const appearance = createPatientPixelAppearance(
        "identity-seed",
        `encounter.${index}`,
        profile,
      );
      const still = characterStillCatalogEntryById(appearance.stillId);
      const identity = patientRosterEntryById(appearance.patientIdentityId);
      expect(still).toMatchObject({
        category: "patient",
        compatibleSexLabel: "Male",
        ageBand: "adult",
      });
      expect(identity).toMatchObject({
        compatibleSexLabel: "Male",
        ageBand: "adult",
      });
    }
  });

  it("pairs unspecified-profile public stills with the still's visual sex and age band", () => {
    const seenPublicStillIds = new Set<string>();
    for (let index = 0; index < 2_000; index += 1) {
      const appearance = createPatientPixelAppearance(
        "unspecified-public-identity",
        `unspecified.${index}`,
      );
      const still = characterStillCatalogEntryById(appearance.stillId);
      if (still?.category !== "patient" || still.sourceCohort !== "gs022-public20") {
        continue;
      }
      seenPublicStillIds.add(still.stillId);
      expect(patientRosterEntryById(appearance.patientIdentityId)).toMatchObject({
        compatibleSexLabel: still.compatibleSexLabel,
        ageBand: still.ageBand,
      });
    }
    expect(seenPublicStillIds.size).toBe(20);
  });

  it("aggregates external reservations and applies them at an ambient creation seam", () => {
    const state = createInitialGameState(undefined, {
      campaignId: "campaign.external-appearance-reservations",
      campaignSeed: "external-appearance-reservations",
      createdAtRealMs: 0,
    });
    state.encounters = {};
    const allStillIds = patientStillEligibleEntries(undefined, undefined).map(
      (entry) => entry.stillId,
    );
    const remainingStillId = allStillIds.at(-1)!;
    const appearanceFor = (stillId: (typeof allStillIds)[number]) => ({
      ...createPixelAppearance("external-reservations", "patient", stillId, "patient"),
      stillId,
    });
    state.environment.ambientPedestrians = [{
      id: "ambient-existing",
      appearance: appearanceFor(allStillIds[0]!),
      path: Array.from({ length: 20 }, (_, x) => ({ x, y: 0 })),
      pathIndex: 0,
      lastMovedAtFacilityTick: state.facilityTick,
    }];
    state.serviceOperations = [{
      id: "service-visitor-existing",
      incomeLineId: "test.external-reservation",
      catalogVersion: 1,
      actorKind: "visitor",
      actorId: "service-visitor-existing",
      displayName: "Service Visitor",
      appearance: appearanceFor(allStillIds[1]!),
      status: "arriving",
      createdAtFacilityTick: state.facilityTick,
      waitDeadlineFacilityTick: state.facilityTick + 60,
      startedAtFacilityTick: null,
      completedAtFacilityTick: null,
      cancelledAtFacilityTick: null,
      quoteFee: 0,
      phaseIndex: 0,
      phaseStartedAtFacilityTick: null,
      phaseEndsAtFacilityTick: null,
      reservedRoomInstanceIds: [],
      reservedEmployeeIds: [],
      providerReservation: null,
      location: { x: 0, y: 0 },
      path: [],
      pathIndex: 0,
      lastMovedAtFacilityTick: state.facilityTick,
      cancellationReason: null,
    }];
    state.retailExternalActors = allStillIds.slice(2, -1).map((stillId, index) => ({
      id: `retail-external.${index}`,
      kind: "retail_visitor" as const,
      displayName: `Retail Visitor ${index}`,
      appearance: appearanceFor(stillId),
      linkedServiceOperationId: null,
      linkedEncounterId: null,
      lifecycle: "onsite" as const,
      location: { x: index, y: 0 },
      path: [],
      pathIndex: 0,
      lastMovedAtFacilityTick: state.facilityTick,
      activeRetailOperationId: null,
    }));

    const context = getPatientAppearanceSelectionContext(state);
    expect(context.occupiedStillIds.size).toBe(allStillIds.length - 1);
    expect(context.occupiedStillIds.has(remainingStillId)).toBe(false);

    state.environment.nextAmbientPedestrianTick = state.facilityTick;
    advanceAmbientPedestrians(state, PROTOTYPE_DOMAIN_CONTEXT);
    expect(state.environment.ambientPedestrians.at(-1)?.appearance.stillId).toBe(
      remainingStillId,
    );
  });

  it("does not reroll a saved or unknown future still during normalization", () => {
    const saved = createPatientPixelAppearance(
      "save-seed",
      "encounter.saved",
      profile,
    );
    expect(
      normalizePatientAppearanceForSex(saved, "Male", 38, "reload-key")
        .stillId,
    ).toBe(saved.stillId);

    const unknownFuture = {
      ...createPixelAppearance("save-seed", "patient", "future", "patient"),
      stillId: "patient.future.001" as const,
    };
    expect(
      normalizePatientAppearanceForSex(
        unknownFuture,
        "Male",
        38,
        "reload-key",
      ).stillId,
    ).toBe("patient.future.001");
  });

  it("preserves the initial encounter's frozen case and appearance across reload", () => {
    const state = createInitialGameState(undefined, {
      campaignId: "campaign.appearance-rotation",
      campaignSeed: "appearance-rotation",
      createdAtRealMs: 0,
    });
    const encounter = Object.values(state.encounters)[0]!;
    const frozenCaseBefore = JSON.stringify(encounter.frozenCase);
    const appearanceBefore = encounter.patientAppearance;

    const restored = deserializeGameState(serializeGameState(state));
    const restoredEncounter = restored.encounters[encounter.id]!;
    expect(JSON.stringify(restoredEncounter.frozenCase)).toBe(frozenCaseBefore);
    expect(restoredEncounter.patientAppearance).toEqual(appearanceBefore);
  });

  it("keeps under-18 authored-still selection ineligible", () => {
    expect(
      selectNewPatientStillId("child-seed", "child", {
        sexLabel: "Female",
        ageYears: 12,
      }),
    ).toBeUndefined();
  });
});
