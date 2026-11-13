import { describe, expect, it } from "vitest";
import {
  deserializeGameState, gameReducer, getClinicSatisfaction, getCompletedEncounterCount,
  getCurrentQuestion, getDisplayedClinicSatisfaction, getFacilityProgressionStatus,
  serializeGameState, type GameState,
} from "../src";
import { progressionMetricGuidance } from "../src/guidance-progression";
import { createLevelFiveStateQaContext, createLevelFiveStateQaState } from "../../../tests/fixtures/level-five-state";
import { LEVEL_FIVE_GOALS_QA_ENCOUNTER_ID, setLevelFiveQaCompletedEncounters,
  setLevelFiveQaPatientSatisfaction } from "../../../tests/fixtures/level-five-progression";

const context = createLevelFiveStateQaContext();
const satisfactionGoal = (state: GameState) => getFacilityProgressionStatus(state, context).requirements
  .find(requirement => requirement.id === "progression.satisfaction")!;
const acknowledge = (state: GameState, operationId = "pacing.goals") =>
  gameReducer(state, { type: "SET_PAUSED", paused: state.paused, operationId }, context);
function ready(rating = 95, completed = 390) {
  const state = createLevelFiveStateQaState("pre-goal", context);
  state.clinicalXp = 2300;
  setLevelFiveQaPatientSatisfaction(state, context, rating);
  setLevelFiveQaCompletedEncounters(state, completed);
  return state;
}

describe("content-robust established satisfaction goal", () => {
  it.each([[389, false], [390, true], [391, true]])("uses %i completed encounters as the volume boundary", (count, met) => {
    const state = ready(95, count);
    expect(getCompletedEncounterCount(state)).toBe(count);
    const goal = satisfactionGoal(state);
    expect(goal).toMatchObject({ current: 95, required: 91, met });
    expect(goal.label).toContain("after 390 completed encounters");
    expect(getFacilityProgressionStatus(state, context).requirements.map(requirement => requirement.id)).toEqual([
      "progression.clinical_xp", "progression.satisfaction", "progression.staff_morale",
    ]);
    if (!met) expect(progressionMetricGuidance(state, goal, context)).toContain("Complete 1 more encounter");
    expect(Boolean(acknowledge(state).levelFive!.progress.inspectionUnlocked)).toBe(met);
  });

  it.each([[90, false], [91, true]])("requires a patient rating above90 with %i", (rating, met) => {
    const state = ready(rating);
    expect(satisfactionGoal(state)).toMatchObject({ current: rating, met });
    expect(Boolean(acknowledge(state).levelFive!.progress.inspectionUnlocked)).toBe(met);
  });

  it("keeps the live HUD pressure and freezes the earned goal percentage through reload", () => {
    const state = ready(93);
    state.environment.waterCoolerFillPercent = 0;
    for (const room of state.rooms) room.cleanliness = 40;
    const hud = getDisplayedClinicSatisfaction(state, context);
    expect(hud).toBeLessThanOrEqual(90);
    expect(getClinicSatisfaction(state, context)).toBe(93);
    expect(satisfactionGoal(state)).toMatchObject({ current: 93, met: true });
    const frozen = structuredClone(state.encounters);
    const earned = acknowledge(state);
    expect(earned.levelFive!.progress.inspectionUnlocked).toMatchObject({ clinicalXp: 2300, displayedSatisfaction: 93 });
    expect(getDisplayedClinicSatisfaction(earned, context)).toBe(hud);
    const loaded = deserializeGameState(serializeGameState(earned), context);
    expect(loaded.levelFive!.progress).toEqual(earned.levelFive!.progress);
    expect(loaded.encounters).toEqual(frozen);
  });

  it("requires a real ended rating alongside the completion counter", () => {
    const state = ready();
    state.encounters = {};
    state.retiredEncounterSummary!.recentEndedSatisfaction = [];
    expect(satisfactionGoal(state).met).toBe(false);
    expect(acknowledge(state).levelFive!.progress.inspectionUnlocked).toBeNull();
  });

  it("uses the same established record when the eligible case pool grows or is reordered", () => {
    const state = ready(94);
    const smaller = { ...context, clinicalRelease: { ...context.clinicalRelease,
      cases: context.clinicalRelease.cases.slice(0, Math.floor(context.clinicalRelease.cases.length / 2)) } };
    const reordered = { ...context, clinicalRelease: { ...context.clinicalRelease,
      cases: [...context.clinicalRelease.cases].reverse() } };
    expect(smaller.clinicalRelease.cases.length).toBeLessThan(context.clinicalRelease.cases.length);
    expect(getFacilityProgressionStatus(state, smaller).requirements)
      .toEqual(getFacilityProgressionStatus(state, context).requirements);
    expect(getFacilityProgressionStatus(state, reordered).requirements)
      .toEqual(getFacilityProgressionStatus(state, context).requirements);
  });

  it("preserves a prior earned unlock with fewer than330 encounters and legacy XP credit", () => {
    let state = createLevelFiveStateQaState("eligible", context);
    setLevelFiveQaCompletedEncounters(state, 2);
    state.levelFive!.progress.inspectionUnlocked!.clinicalXp = 2000;
    state.clinicalXp = 0;
    delete state.lateProgression;
    const earned = structuredClone(state.levelFive!.progress.inspectionUnlocked);
    for (let i = 0; i < 3; i++) {
      state = deserializeGameState(serializeGameState(state), context);
      state = acknowledge(state, `pacing.legacy.${i}`);
      expect(state.levelFive!.progress.inspectionUnlocked).toEqual(earned);
      expect(getCompletedEncounterCount(state)).toBe(2);
      expect(getFacilityProgressionStatus(state, context).requirements.find(goal => goal.id === "progression.clinical_xp"))
        .toMatchObject({ required: 2000, met: true });
      expect(satisfactionGoal(state).met).toBe(true);
    }
  });

  it("qualifies a loaded locked campaign on its next command with its earned legacy XP goal", () => {
    const state = ready(93);
    state.clinicalXp = 2000;
    delete state.lateProgression;
    const frozen = structuredClone(state.encounters);
    const loaded = deserializeGameState(serializeGameState(state), context);
    expect(loaded.levelFive!.progress.inspectionUnlocked).toBeNull();
    const earned = acknowledge(loaded);
    expect(earned.levelFive!.progress.inspectionUnlocked).toMatchObject({ clinicalXp: 2000, displayedSatisfaction: 93 });
    expect(earned.encounters).toEqual(frozen);
    expect(earned.learningHistories).toEqual(loaded.learningHistories);
  });

  it("earns the volume boundary on a normal scored encounter completion without another XP goal change", () => {
    let state = createLevelFiveStateQaState("goals", context);
    setLevelFiveQaCompletedEncounters(state, 389);
    state.clinicalXp = 2300;
    state.paused = false;
    state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
    state.serviceAppointmentsEnabled = false;
    const id = LEVEL_FIVE_GOALS_QA_ENCOUNTER_ID;
    for (let i = 0; i < 160 && state.encounters[id]!.checkInStatus !== "checked_in"; i++) {
      state = gameReducer(state, { type: "ADVANCE_TICK", operationId: `pacing.arrival.${i}` }, context);
    }
    state = gameReducer(state, { type: "OPEN_CHART", encounterId: id, operationId: "pacing.open" }, context);
    expect(state.operationReceipts["pacing.open"]?.status).toBe("applied");
    for (let i = 0; i < 160 && state.encounters[id]!.patientMovement; i++) {
      state = gameReducer(state, { type: "ADVANCE_TICK", operationId: `pacing.care.${i}` }, context);
    }
    const question = getCurrentQuestion(state, id, context)!;
    expect(state.levelFive!.progress.inspectionUnlocked).toBeNull();
    const command = { type: "SUBMIT_ANSWER" as const, encounterId: id, decisionNodeId: question.node.id,
      answerChoiceId: question.node.answerChoices.find(choice => choice.isCorrect)!.id, operationId: "pacing.answer" };
    const first = gameReducer(state, command, context);
    expect(first.operationReceipts[command.operationId]?.status).toBe("applied");
    expect(getCompletedEncounterCount(first)).toBe(390);
    expect(first.clinicalXp - state.clinicalXp).toBe(10);
    expect(first.levelFive!.progress.inspectionUnlocked).toMatchObject({ clinicalXp: 2310 });
    expect(serializeGameState(gameReducer(state, command, context))).toBe(serializeGameState(first));
    expect(gameReducer(first, command, context)).toBe(first);
  });
});
