import { describe, expect, it } from "vitest";
import { deserializeGameState, gameReducer, getFacilityProgressionStatus, serializeGameState, type GameState } from "../src";
import { progressionMetricGuidance } from "../src/guidance-progression";
import { createLevelFourAlmostQaState } from "../../../tests/fixtures/level-four-progression";
import { createLevelFiveStateQaContext, createLevelFiveStateQaState } from "../../../tests/fixtures/level-five-state";
import { setLevelFiveQaCompletedEncounters, setLevelFiveQaPatientSatisfaction } from "../../../tests/fixtures/level-five-progression";

const context = createLevelFiveStateQaContext();
const currentPolicy = () => ({version: "late-progression.v2" as const, preservedClinicalXpGoal: null,
  preservedCompletedEncounterGoal: null});
const oldPolicy = () => ({version: "late-progression.v1" as const, preservedClinicalXpGoal: null});
const load = (state: GameState) => deserializeGameState(serializeGameState(state), context);
const goal = (state: GameState, id: string) => getFacilityProgressionStatus(state, context).requirements.find(row => row.id === id)!;
function levelFive(completed: number) {
  const state = createLevelFiveStateQaState("eligible", context);
  state.levelFive!.progress.inspectionUnlocked = null;
  state.levelFive!.inspection.status = "locked";
  state.clinicalXp = 100; // Volume can be earned before the independent XP goal.
  state.lateProgression = currentPolicy();
  setLevelFiveQaPatientSatisfaction(state, context, 95);
  setLevelFiveQaCompletedEncounters(state, completed);
  return state;
}

describe("round-two late progression save protection", () => {
  it.each([[789, 870, false], [790, 790, true], [869, 790, true]])(
    "loads a prior Level 4 campaign at %i XP with required %i and earned=%s", (xp, required, met) => {
      const state = createLevelFourAlmostQaState(context);
      state.clinicalXp = xp;
      state.lateProgression = oldPolicy();
      const restored = load(state);
      expect(goal(restored, "progression.clinical_xp")).toMatchObject({required, met});
      for (const key of ["facilityLevel", "cashCents", "clinicalXp", "rooms", "encounters", "learningHistories", "settlements", "levelFourCompletion"] as const)
        expect(restored[key], key).toEqual(state[key]);
      expect(load(restored).lateProgression).toEqual(restored.lateProgression);
    },
  );

  it("does not gain the old XP credit by crossing 790 after the policy update", () => {
    let state = createLevelFourAlmostQaState(context);
    state.clinicalXp = 789;
    state.lateProgression = oldPolicy();
    state = load(state);
    state.clinicalXp = 790;
    state = load(state);
    expect(goal(state, "progression.clinical_xp")).toMatchObject({required: 870, met: false});
    state.clinicalXp = 870;
    expect(goal(load(state), "progression.clinical_xp").met).toBe(true);
  });

  it.each([[329, 390, false], [330, 330, true], [389, 330, true]])(
    "retains a prior Level 5 volume threshold at %i visits", (count, required, met) => {
      let state = levelFive(count);
      state.lateProgression = oldPolicy();
      const frozen = structuredClone([state.encounters, state.learningHistories, state.levelFive!.progress]);
      for (let i = 0; i < 3; i++) {
        state = load(state);
        const satisfaction = goal(state, "progression.satisfaction");
        expect(satisfaction).toMatchObject({met, current: 95, required: 91});
        expect(satisfaction.label).toContain(`after ${required} completed encounters`);
        if (met) expect(progressionMetricGuidance(state, satisfaction, context)).not.toContain("Complete 60 more");
        state = gameReducer(state, {type: "SET_PAUSED", paused: true, operationId: `round2.old.${i}`}, context);
        expect([state.encounters, state.learningHistories, state.levelFive!.progress]).toEqual(frozen);
      }
    },
  );

  it("uses 390 for current campaigns and does not acquire 330 credit on reload", () => {
    let state = levelFive(329);
    state.lateProgression = oldPolicy();
    state = load(state);
    setLevelFiveQaCompletedEncounters(state, 330);
    state = load(state);
    const satisfaction = goal(state, "progression.satisfaction");
    expect(satisfaction.met).toBe(false);
    expect(satisfaction.label).toContain("after 390 completed encounters");
    expect(progressionMetricGuidance(state, satisfaction, context)).toContain("Complete 60 more encounters");
    setLevelFiveQaCompletedEncounters(state, 389);
    expect(goal(load(state), "progression.satisfaction").met).toBe(false);
    setLevelFiveQaCompletedEncounters(state, 390);
    expect(goal(load(state), "progression.satisfaction").met).toBe(true);
  });

  it("retains a legacy inspection unlock without presenting an unearned 390-visit requirement", () => {
    const state = createLevelFiveStateQaState("eligible", context);
    state.levelFive!.progress.inspectionUnlocked!.clinicalXp = 2000;
    setLevelFiveQaCompletedEncounters(state, 2);
    delete state.lateProgression;
    const restored = load(state);
    expect(restored.levelFive!.progress).toEqual(state.levelFive!.progress);
    expect(goal(restored, "progression.satisfaction").label).toBe("Recent patient satisfaction above 90%");
    expect(goal(restored, "progression.satisfaction").met).toBe(true);
  });

  it.each([
    {version: "late-progression.v2", preservedClinicalXpGoal: null},
    {version: "late-progression.v2", preservedClinicalXpGoal: null, preservedCompletedEncounterGoal: {facilityLevel: 5, minimumCompletedEncounters: 329}},
    {version: "late-progression.v2", preservedClinicalXpGoal: null, preservedCompletedEncounterGoal: {facilityLevel: 5, minimumCompletedEncounters: 0}},
    {version: "late-progression.v2", preservedClinicalXpGoal: {facilityLevel: 4, minimumClinicalXp: 791}, preservedCompletedEncounterGoal: null},
    {version: "late-progression.v2", preservedClinicalXpGoal: null, preservedCompletedEncounterGoal: null, extra: true},
  ])("rejects malformed or arbitrary earned-goal credit: %j", policy => {
    const raw = JSON.parse(serializeGameState(levelFive(330)));
    raw.lateProgression = policy;
    expect(() => deserializeGameState(JSON.stringify(raw), context)).toThrow("late progression policy");
  });
});
