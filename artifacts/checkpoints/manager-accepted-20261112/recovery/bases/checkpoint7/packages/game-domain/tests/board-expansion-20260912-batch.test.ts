import { describe, expect, it } from "vitest";
import { BOARD_EXPANSION_20260912_CASES } from "@gamify-surgery/clinical-content";
import {
  createInitialGameState,
  createPatientPixelAppearance,
  deserializeGameState,
  gameReducer,
  getCurrentQuestion,
  serializeGameState,
  type GameState,
} from "../src";

function prepared(seed: string): GameState {
  const state = createInitialGameState(undefined, {
    campaignId: `campaign.board.20260912.${seed}`,
    campaignSeed: seed,
    createdAtRealMs: 0,
  });
  state.facilityLevel = 1;
  state.encounters = {};
  state.openChartEncounterId = null;
  state.attendedEncounterId = null;
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  return state;
}

function ready(state: GameState, encounterId: string, prefix: string): GameState {
  let next = state;
  for (let attempt = 0; attempt < 1_500; attempt += 1) {
    if (getCurrentQuestion(next, encounterId)) return next;
    const encounter = next.encounters[encounterId]!;
    next = encounter.lifecycle === "waiting_unopened" && encounter.patientMovement === null
      ? gameReducer(next, { type: "OPEN_CHART", operationId: `${prefix}.open.${attempt}`, encounterId })
      : gameReducer(next, { type: "ADVANCE_TICK", operationId: `${prefix}.tick.${attempt}` });
  }
  throw new Error(`${encounterId} did not become ready`);
}

function submit(state: GameState, encounterId: string, correct: boolean, operationId: string, reviewedAtMs: number): GameState {
  const question = getCurrentQuestion(state, encounterId)!;
  const choice = question.node.answerChoices.find((item) => item.isCorrect === correct)!;
  return gameReducer(state, {
    type: "SUBMIT_ANSWER",
    operationId,
    encounterId,
    decisionNodeId: question.node.id,
    answerChoiceId: choice.id,
    reviewedAtMs,
  });
}

function acknowledge(state: GameState, encounterId: string, operationId: string): GameState {
  const encounter = state.encounters[encounterId]!;
  return gameReducer(state, {
    type: "ACKNOWLEDGE_DECISION_FEEDBACK",
    operationId,
    encounterId,
    decisionNodeId: encounter.steps[encounter.currentNodeIndex]!.decisionNodeId,
  });
}

describe("September 12 board-expansion production flows", () => {
  it.each(BOARD_EXPANSION_20260912_CASES.map((clinicalCase, index) => [index, clinicalCase] as const))(
    "runs case %s through its real gate with one review per concept",
    (index, clinicalCase) => {
      const encounterId = `encounter.board.20260912.${index}`;
      let state = prepared(`all-${index}`);
      state = gameReducer(state, {
        type: "ADMIT_PATIENT",
        operationId: `board.20260912.${index}.admit`,
        encounterId,
        caseId: clinicalCase.id,
        patientDisplayName: `Board Patient ${index}`,
        arrivalClass: "routine",
      });
      expect(state.operationReceipts[`board.20260912.${index}.admit`]?.status).toBe("applied");
      state = ready(state, encounterId, `board.20260912.${index}.first`);
      const first = getCurrentQuestion(state, encounterId)!;
      expect(first.node.primaryConceptId).toBe(clinicalCase.decisionNodes[0]!.primaryConceptId);
      state = submit(state, encounterId, true, `board.20260912.${index}.first.answer`, index + 1);
      expect(state.encounters[encounterId]!.steps[0]!.status).toBe("feedback_pending");
      state = acknowledge(state, encounterId, `board.20260912.${index}.first.ack`);
      const pending = state.encounters[encounterId]!.pendingResult!;
      expect(pending).toMatchObject({ resultTypeId: clinicalCase.decisionNodes[0]!.resultGateAfter!.resultTypeId });
      expect(pending.dueTick).toBeGreaterThan(state.facilityTick);
      while (state.facilityTick < pending.dueTick) {
        expect(getCurrentQuestion(state, encounterId)).toBeNull();
        expect(state.encounters[encounterId]!.deliveredResultNarratives).toEqual([]);
        state = gameReducer(state, { type: "ADVANCE_TICK", operationId: `board.20260912.${index}.wait.${state.facilityTick}` });
      }
      state = ready(state, encounterId, `board.20260912.${index}.second`);
      expect(state.encounters[encounterId]!.deliveredResultNarratives).toContain(clinicalCase.decisionNodes[0]!.resultGateAfter!.resultNarrative);
      const second = getCurrentQuestion(state, encounterId)!;
      expect(second.node.primaryConceptId).toBe(clinicalCase.decisionNodes[1]!.primaryConceptId);
      state = submit(state, encounterId, true, `board.20260912.${index}.second.answer`, index + 10_000);
      expect(state.encounters[encounterId]!).toMatchObject({ lifecycle: "resolved_summary_available", resolutionReason: "completed" });
      expect(state.encounters[encounterId]!.pendingResult).toMatchObject({ deliveredAtTick: expect.any(Number) });
      expect(state.learningHistories[first.node.primaryConceptId]?.reviews).toHaveLength(1);
      expect(state.learningHistories[second.node.primaryConceptId]?.reviews).toHaveLength(1);
    },
  );

  it("corrects forward after a wrong answer and preserves pending state, identity, order, and FSRS review through reload", () => {
    const clinicalCase = BOARD_EXPANSION_20260912_CASES[0]!;
    const encounterId = "encounter.board.20260912.persistence";
    let state = prepared("persistence");
    state = gameReducer(state, {
      type: "ADMIT_PATIENT",
      operationId: "board.20260912.persist.admit",
      encounterId,
      caseId: clinicalCase.id,
      patientDisplayName: "Persistent Patient",
      arrivalClass: "routine",
    });
    const frozen = state.encounters[encounterId]!.frozenCase;
    const appearance = state.encounters[encounterId]!.patientAppearance;
    expect(appearance).toEqual(createPatientPixelAppearance(state.campaignSeed, encounterId, frozen.prototypeDemographics!));
    state = ready(state, encounterId, "board.20260912.persist");
    const first = getCurrentQuestion(state, encounterId)!;
    const frozenOrder = first.node.answerChoices.map((choice) => choice.id);
    state = submit(state, encounterId, false, "board.20260912.persist.answer", 99);
    expect(state.encounters[encounterId]!.steps[0]!.answer).toMatchObject({ correct: false, correctedForward: true, ratingIntent: "Again" });
    expect(state.learningHistories[first.node.primaryConceptId]?.reviews).toHaveLength(1);
    state = acknowledge(state, encounterId, "board.20260912.persist.ack");
    const pending = state.encounters[encounterId]!.pendingResult!;
    expect(pending.resultTypeId).toBe(clinicalCase.decisionNodes[0]!.resultGateAfter!.resultTypeId);
    expect(pending.dueTick).toBeGreaterThan(state.facilityTick);
    const restored = deserializeGameState(serializeGameState(state));
    expect(restored.encounters[encounterId]!.pendingResult).toEqual(pending);
    expect(restored.encounters[encounterId]!.frozenCase).toEqual(frozen);
    expect(restored.encounters[encounterId]!.patientAppearance).toEqual(appearance);
    expect(restored.encounters[encounterId]!.patientDisplayName).toBe("Persistent Patient");
    expect(restored.encounters[encounterId]!.frozenCase.decisionNodes[0]!.answerChoices.map((choice) => choice.id)).toEqual(frozenOrder);
    expect(restored.learningHistories[first.node.primaryConceptId]?.reviews).toHaveLength(1);
  });
});
