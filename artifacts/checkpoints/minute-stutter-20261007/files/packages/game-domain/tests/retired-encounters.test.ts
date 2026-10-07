import { describe, expect, it } from "vitest";
import {
  RETAINED_RETIRED_ENCOUNTER_LIMIT,
  TUTORIAL_ENCOUNTER_ID,
  createInitialGameState,
  createPatientPixelAppearance,
  deserializeGameState,
  gameReducer,
  getClinicSatisfaction,
  getCompletedEncounterCount,
  getFacilityProgressionStatus,
  getPatientAppearanceSelectionContext,
  retireDepartedEncounters,
  serializeGameState,
  type EncounterState,
  type GameState,
} from "../src";

/** Campaign with `count` finished, departed, non-tutorial patients. */
function campaignWithFinishedPatients(count: number): GameState {
  const state = createInitialGameState();
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  state.environment.nextAmbientPedestrianTick = Number.MAX_SAFE_INTEGER;
  state.environment.nextLitterSpawnTick = Number.MAX_SAFE_INTEGER;
  const template = state.encounters[TUTORIAL_ENCOUNTER_ID]!;
  for (let index = 1; index <= count; index += 1) {
    const encounter = JSON.parse(JSON.stringify(template)) as EncounterState;
    encounter.id = `encounter.retired-fixture.${String(index).padStart(3, "0")}`;
    encounter.arrivalClass = "routine";
    encounter.lifecycle = "resolved";
    encounter.resolutionReason = index % 4 === 0 ? "walkout" : "completed";
    // Several share a resolution tick so id tie-breaking is exercised.
    encounter.resolvedAtFacilityTick = Math.floor(index / 2);
    encounter.finalPatientSatisfaction = (index * 37) % 101;
    encounter.waiting.arrivedAtTick = index;
    encounter.patientMovement = null;
    encounter.patientLocation = null;
    encounter.pendingResult = null;
    encounter.patientAppearance = createPatientPixelAppearance(
      state.campaignSeed,
      encounter.id,
      { sexLabel: index % 3 === 0 ? "Male" : "Female", ageYears: 30 + (index % 30) },
    );
    state.encounters[encounter.id] = encounter;
  }
  return state;
}

/** Each still's position among distinct stills ordered by most recent use. */
function lastUseOrder(stillIds: readonly string[]): string[] {
  const lastUse = new Map<string, number>();
  stillIds.forEach((stillId, index) => lastUse.set(stillId, index));
  return [...lastUse.entries()]
    .sort((left, right) => left[1] - right[1])
    .map(([stillId]) => stillId);
}

function ruleResults(state: GameState) {
  const progression = getFacilityProgressionStatus(state);
  return {
    completed: getCompletedEncounterCount(state),
    satisfaction: getClinicSatisfaction(state),
    requirements: progression.requirements,
    stillRotation: lastUseOrder(
      getPatientAppearanceSelectionContext(state).recentlyUsedStillIds,
    ),
  };
}

describe("retired encounters", () => {
  it("keeps campaign rules identical while dropping older finished patients", () => {
    const state = campaignWithFinishedPatients(60);
    const before = ruleResults(state);

    retireDepartedEncounters(state);

    const retained = Object.values(state.encounters).filter(
      (encounter) => encounter.arrivalClass !== "tutorial",
    );
    expect(retained).toHaveLength(RETAINED_RETIRED_ENCOUNTER_LIMIT);
    expect(state.encounters[TUTORIAL_ENCOUNTER_ID]).toBeDefined();
    expect(state.retiredEncounterSummary).toMatchObject({
      retiredCount: 60 - RETAINED_RETIRED_ENCOUNTER_LIMIT,
      ordinaryEncounterCompleted: true,
    });
    // The newest resolutions are the ones kept in full.
    const oldestRetainedTick = Math.min(
      ...retained.map((encounter) => encounter.resolvedAtFacilityTick ?? 0),
    );
    expect(oldestRetainedTick).toBeGreaterThanOrEqual(
      Math.floor((60 - RETAINED_RETIRED_ENCOUNTER_LIMIT) / 2),
    );
    expect(ruleResults(state)).toEqual(before);
  });

  it("stays equivalent across repeated retirement passes and a save round trip", () => {
    const state = campaignWithFinishedPatients(25);
    retireDepartedEncounters(state);
    const firstPass = ruleResults(state);
    // New finished patients arrive later and retire in a second pass.
    const more = campaignWithFinishedPatients(70);
    for (const encounter of Object.values(more.encounters)) {
      if (encounter.arrivalClass === "tutorial") continue;
      const id = encounter.id.replace("retired-fixture", "retired-fixture-later");
      state.encounters[id] = {
        ...encounter,
        id,
        resolvedAtFacilityTick: 1_000 + (encounter.resolvedAtFacilityTick ?? 0),
        waiting: { ...encounter.waiting, arrivedAtTick: 1_000 + encounter.waiting.arrivedAtTick },
      };
    }
    const beforeSecondPass = ruleResults(state);
    expect(beforeSecondPass).not.toEqual(firstPass);
    retireDepartedEncounters(state);
    expect(ruleResults(state)).toEqual(beforeSecondPass);

    const restored = deserializeGameState(serializeGameState(state));
    expect(restored.retiredEncounterSummary).toEqual(state.retiredEncounterSummary);
    // Loading re-derives these hand-built fixture appearances from their
    // cloned tutorial demographics, so compare the summary-driven rules only.
    const { stillRotation: _restoredStills, ...restoredRules } = ruleResults(restored);
    const { stillRotation: _expectedStills, ...expectedRules } = beforeSecondPass;
    expect(restoredRules).toEqual(expectedRules);
  });

  it("never retires a finished patient that live records still reference", () => {
    const state = campaignWithFinishedPatients(30);
    const opened = "encounter.retired-fixture.001";
    const companion = "encounter.retired-fixture.002";
    const onMap = "encounter.retired-fixture.003";
    state.openChartEncounterId = opened;
    state.retailExternalActors.push({
      id: "retail.companion.fixture",
      kind: "companion",
      displayName: "Companion",
      appearance: state.encounters[companion]!.patientAppearance,
      linkedServiceOperationId: null,
      linkedEncounterId: companion,
      lifecycle: "onsite",
      location: { x: 1, y: 1 },
      path: [],
      pathIndex: 0,
      lastMovedAtFacilityTick: 0,
      activeRetailOperationId: null,
    });
    state.encounters[onMap]!.patientLocation = { x: 2, y: 2 };

    retireDepartedEncounters(state);

    expect(state.encounters[opened]).toBeDefined();
    expect(state.encounters[companion]).toBeDefined();
    expect(state.encounters[onMap]).toBeDefined();
  });

  it("retires finished patients whose test result was delivered, but not undelivered ones", () => {
    const state = campaignWithFinishedPatients(30);
    const result = {
      operationId: "fixture.result",
      deliveredAtTick: 3,
    } as unknown as NonNullable<EncounterState["pendingResult"]>;
    const delivered = "encounter.retired-fixture.001";
    const undelivered = "encounter.retired-fixture.002";
    state.encounters[delivered]!.pendingResult = { ...result };
    state.encounters[undelivered]!.pendingResult = { ...result, deliveredAtTick: null };

    retireDepartedEncounters(state);

    expect(state.encounters[delivered]).toBeUndefined();
    expect(state.encounters[undelivered]).toBeDefined();
  });

  it("bounds live encounter history during an ordinary running campaign", () => {
    let state = campaignWithFinishedPatients(40);
    state = gameReducer(state, { type: "ADVANCE_TICK", operationId: "retire.tick" });
    expect(Object.keys(state.encounters).length).toBeLessThanOrEqual(
      RETAINED_RETIRED_ENCOUNTER_LIMIT + 2,
    );
    expect(state.retiredEncounterSummary?.retiredCount).toBe(
      40 - RETAINED_RETIRED_ENCOUNTER_LIMIT,
    );
  });
});
