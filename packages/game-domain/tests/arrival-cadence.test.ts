import { describe, expect, it } from "vitest";
import {
  PROTOTYPE_DOMAIN_CONTEXT, SECOND_TUTORIAL_ENCOUNTER_ID, TUTORIAL_ENCOUNTER_ID,
  createInitialGameState, deserializeGameState, gameReducer, serializeGameState,
  type DomainContext, type GameState,
} from "../src";
import { deterministicInteger, RANDOM_STREAMS } from "../src/randomness";

const legacyContext = structuredClone(PROTOTYPE_DOMAIN_CONTEXT);
delete legacyContext.balanceRelease.arrivals.levelOneRoutineCadence;

function minute(state: GameState, context = PROTOTYPE_DOMAIN_CONTEXT): GameState {
  return gameReducer(state, { type: "ADVANCE_TICK", operationId: `pace.minute.${state.facilityTick}` }, context);
}

function routineState(level: GameState["facilityLevel"], seed: string, context = PROTOTYPE_DOMAIN_CONTEXT): GameState {
  let state = createInitialGameState(context, { campaignSeed: seed, createdAtRealMs: 0 });
  state.encounters[TUTORIAL_ENCOUNTER_ID]!.lifecycle = "resolved";
  state.encounters[TUTORIAL_ENCOUNTER_ID]!.resolutionReason = "completed";
  state = minute(state, context); // The native second protected admission.
  state.encounters[SECOND_TUTORIAL_ENCOUNTER_ID]!.lifecycle = "resolved";
  state.encounters[SECOND_TUTORIAL_ENCOUNTER_ID]!.resolutionReason = "completed";
  state.facilityLevel = level;
  state.clinicalXp = 0; // Keep Level 0 recovery eligible.
  state.routineArrivalSequence = 7;
  state.nextRoutineArrivalTick = state.facilityTick + 1;
  state.serviceAppointmentsEnabled = false;
  return state;
}

function expectedInterval(state: GameState, base: number, variation: number, context: DomainContext): number {
  const offset = deterministicInteger(state.campaignSeed, RANDOM_STREAMS.routineArrivalTiming,
    `arrival.${state.routineArrivalSequence}.v1`, variation * 2 + 1) - variation;
  const advertising = context.balanceRelease.advertising.levels.find(tier => tier.level === state.advertisingLevel)!;
  return Math.max(1, Math.round((base + offset) * advertising.arrivalIntervalMultiplierPercent / 100));
}

describe("stage-scoped routine arrival scheduling", () => {
  it.each([0, 1, 2, 3, 4, 5] as const)("samples only Level 1 at 50 +/-12 (level %s)", (level) => {
    for (const advertising of [0, 3]) {
      for (const seed of ["pace.scope.a", "pace.scope.b", "pace.scope.c"]) {
        const state = routineState(level, seed);
        state.advertisingLevel = advertising;
        const next = minute(state);
        expect(next.routineArrivalSequence).toBe(state.routineArrivalSequence + 1);
        const base = level === 1 ? 50 : 60;
        const variation = level === 1 ? 12 : 15;
        expect(next.nextRoutineArrivalTick - next.facilityTick).toBe(expectedInterval(next, base, variation, PROTOTYPE_DOMAIN_CONTEXT));
        const legacy = minute(state, legacyContext);
        expect(legacy.nextRoutineArrivalTick - legacy.facilityTick).toBe(expectedInterval(legacy, 60, 15, legacyContext));
        if (level !== 1) expect(next.nextRoutineArrivalTick).toBe(legacy.nextRoutineArrivalTick);
      }
    }
  });

  it("reads the override from balance rather than hardcoding the approved values", () => {
    const context = structuredClone(PROTOTYPE_DOMAIN_CONTEXT);
    context.balanceRelease.arrivals.levelOneRoutineCadence = { baseIntervalMinutes: 31, variationMinutes: 0 };
    const next = minute(routineState(1, "pace.config", context), context);
    expect(next.routineArrivalSequence).toBe(8);
    expect(next.nextRoutineArrivalTick - next.facilityTick).toBe(31);
  });

  it("keeps the initial deadline and protected admissions independent of the override", () => {
    const options = { campaignSeed: "pace.first", createdAtRealMs: 0 };
    const current = createInitialGameState(PROTOTYPE_DOMAIN_CONTEXT, options);
    const legacy = createInitialGameState(legacyContext, options);
    expect(current.nextRoutineArrivalTick).toBe(legacy.nextRoutineArrivalTick);
    expect(current.nextRoutineArrivalTick).toBeGreaterThanOrEqual(35);
    expect(current.nextRoutineArrivalTick).toBeLessThanOrEqual(75);
    expect(current.encounters).toEqual(legacy.encounters);
    for (const state of [current, legacy]) {
      state.encounters[TUTORIAL_ENCOUNTER_ID]!.lifecycle = "resolved";
      state.encounters[TUTORIAL_ENCOUNTER_ID]!.resolutionReason = "completed";
    }
    expect(minute(current).encounters).toEqual(minute(legacy, legacyContext).encounters);
  });

  it("loads an existing Level 1 deadline unchanged, then samples the new cadence without changing frozen visits", () => {
    const old = routineState(1, "pace.saved", legacyContext);
    old.nextRoutineArrivalTick = old.facilityTick + 5;
    const restored = deserializeGameState(serializeGameState(old));
    const frozen = Object.fromEntries(Object.values(old.encounters).map(encounter => [encounter.id, encounter.frozenCase]));
    expect(restored.nextRoutineArrivalTick).toBe(old.nextRoutineArrivalTick);
    expect(restored.routineArrivalSequence).toBe(old.routineArrivalSequence);
    let next = restored;
    while (next.facilityTick < old.nextRoutineArrivalTick - 1) {
      next = minute(next);
      expect(next.nextRoutineArrivalTick).toBe(old.nextRoutineArrivalTick);
      expect(next.routineArrivalSequence).toBe(old.routineArrivalSequence);
    }
    next = minute(next);
    expect(next.routineArrivalSequence).toBe(old.routineArrivalSequence + 1);
    expect(next.nextRoutineArrivalTick - next.facilityTick).toBe(expectedInterval(next, 50, 12, PROTOTYPE_DOMAIN_CONTEXT));
    for (const [id, clinicalCase] of Object.entries(frozen)) expect(next.encounters[id]!.frozenCase).toEqual(clinicalCase);
  });

  it("preserves a sampled Level 1 wait when entering Level 2, then returns to the shared cadence", () => {
    let state = minute(routineState(1, "pace.level-two"));
    const deadline = state.nextRoutineArrivalTick;
    // LEVEL_UP preserves the pending deadline; isolate subsequent scheduling
    // from the separately tested construction/XP gate.
    state.facilityLevel = 2;
    for (const encounter of Object.values(state.encounters)) {
      encounter.lifecycle = "resolved";
      encounter.resolutionReason = "completed";
    }
    while (state.facilityTick < deadline - 1) {
      state = minute(state);
      expect(state.nextRoutineArrivalTick).toBe(deadline);
    }
    const next = minute(state);
    expect(next.routineArrivalSequence).toBe(state.routineArrivalSequence + 1);
    expect(next.nextRoutineArrivalTick - next.facilityTick).toBe(expectedInterval(next, 60, 15, PROTOTYPE_DOMAIN_CONTEXT));
  });
});
