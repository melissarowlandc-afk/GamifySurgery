import { describe, expect, it } from "vitest";
import { BOARD_EXPANSION_CASES } from "@gamify-surgery/clinical-content";
import { createInitialGameState, createPatientPixelAppearance, deserializeGameState, gameReducer, getCurrentQuestion, serializeGameState, type GameState } from "../src";

function prepared(seed: string): GameState {
  const state = createInitialGameState(undefined, { campaignId: `campaign.board.${seed}`, campaignSeed: seed, createdAtRealMs: 0 });
  state.facilityLevel = 1;
  state.encounters = {};
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  return state;
}
function ready(state: GameState, encounterId: string, prefix: string): GameState {
  let next = state;
  for (let attempt = 0; attempt < 1_000; attempt += 1) {
    if (getCurrentQuestion(next, encounterId)) return next;
    const encounter = next.encounters[encounterId]!;
    next = encounter.lifecycle === "waiting_unopened" && encounter.patientMovement === null
      ? gameReducer(next, { type: "OPEN_CHART", operationId: `${prefix}.open.${attempt}`, encounterId })
      : gameReducer(next, { type: "ADVANCE_TICK", operationId: `${prefix}.tick.${attempt}` });
  }
  throw new Error(`${encounterId} did not become ready`);
}
function correct(state: GameState, encounterId: string, operationId: string, reviewedAtMs: number): GameState {
  const question = getCurrentQuestion(state, encounterId)!;
  return gameReducer(state, { type: "SUBMIT_ANSWER", operationId, encounterId, decisionNodeId: question.node.id, answerChoiceId: question.node.answerChoices.find((choice) => choice.isCorrect)!.id, reviewedAtMs });
}
function ack(state: GameState, encounterId: string, operationId: string): GameState {
  const encounter = state.encounters[encounterId]!;
  return gameReducer(state, { type: "ACKNOWLEDGE_DECISION_FEEDBACK", operationId, encounterId, decisionNodeId: encounter.steps[encounter.currentNodeIndex]!.decisionNodeId });
}

describe("September 11 board-expansion production flows", () => {
  it.each(BOARD_EXPANSION_CASES.map((clinicalCase, index) => [index, clinicalCase] as const))("runs case %s through its real gate with one review per concept", (index, clinicalCase) => {
      const encounterId = `encounter.board.${index}`;
      let state = prepared(`all-${index}`);
      state = gameReducer(state, { type: "ADMIT_PATIENT", operationId: `board.${index}.admit`, encounterId, caseId: clinicalCase.id, patientDisplayName: `Board Patient ${index}`, arrivalClass: "routine" });
      expect(state.operationReceipts[`board.${index}.admit`]?.status).toBe("applied");
      state = ready(state, encounterId, `board.${index}.first`);
      const first = getCurrentQuestion(state, encounterId)!;
      expect(first.node.primaryConceptId).toBe(clinicalCase.decisionNodes[0]!.primaryConceptId);
      state = correct(state, encounterId, `board.${index}.first.answer`, index + 1);
      expect(state.encounters[encounterId]!.steps[0]!.status).toBe("feedback_pending");
      state = ack(state, encounterId, `board.${index}.first.ack`);
      const pending = state.encounters[encounterId]!.pendingResult!;
      expect(pending).toMatchObject({ resultTypeId: clinicalCase.decisionNodes[0]!.resultGateAfter!.resultTypeId });
      expect(pending.dueTick).toBeGreaterThan(state.facilityTick);
      while (state.facilityTick < pending.dueTick) {
        expect(getCurrentQuestion(state, encounterId)).toBeNull();
        expect(state.encounters[encounterId]!.deliveredResultNarratives).toEqual([]);
        state = gameReducer(state, { type: "ADVANCE_TICK", operationId: `board.${index}.wait.${state.facilityTick}` });
      }
      state = ready(state, encounterId, `board.${index}.second`);
      expect(state.encounters[encounterId]!.deliveredResultNarratives).toContain(clinicalCase.decisionNodes[0]!.resultGateAfter!.resultNarrative);
      const second = getCurrentQuestion(state, encounterId)!;
      expect(second.node.primaryConceptId).toBe(clinicalCase.decisionNodes[1]!.primaryConceptId);
      state = correct(state, encounterId, `board.${index}.second.answer`, index + 10_000);
      expect(state.encounters[encounterId]!).toMatchObject({ lifecycle: "resolved_summary_available", resolutionReason: "completed" });
      expect(state.encounters[encounterId]!.pendingResult).toMatchObject({ deliveredAtTick: expect.any(Number) });
      expect(state.encounters[encounterId]!.pendingResult!.dueTick).toBeLessThanOrEqual(state.encounters[encounterId]!.pendingResult!.deliveredAtTick!);
      expect(getCurrentQuestion(state, encounterId)).toBeNull();
      expect(state.learningHistories[first.node.primaryConceptId]?.reviews).toHaveLength(1);
      expect(state.learningHistories[second.node.primaryConceptId]?.reviews).toHaveLength(1);
  });

  it("corrects forward after a wrong answer and preserves the pending frozen encounter across reload", () => {
    const clinicalCase = BOARD_EXPANSION_CASES[0]!;
    const encounterId = "encounter.board.persistence";
    let state = prepared("persistence");
    state = gameReducer(state, { type: "ADMIT_PATIENT", operationId: "board.persist.admit", encounterId, caseId: clinicalCase.id, patientDisplayName: "Persistent Patient", arrivalClass: "routine" });
    const frozen = state.encounters[encounterId]!.frozenCase;
    const appearance = state.encounters[encounterId]!.patientAppearance;
    expect(appearance).toEqual(createPatientPixelAppearance(state.campaignSeed, encounterId, frozen.prototypeDemographics!));
    state = ready(state, encounterId, "board.persist");
    const question = getCurrentQuestion(state, encounterId)!;
    const wrong = question.node.answerChoices.find((choice) => !choice.isCorrect)!;
    state = gameReducer(state, { type: "SUBMIT_ANSWER", operationId: "board.persist.answer", encounterId, decisionNodeId: question.node.id, answerChoiceId: wrong.id, reviewedAtMs: 99 });
    expect(state.encounters[encounterId]!.steps[0]!.answer).toMatchObject({ correct: false, correctedForward: true, ratingIntent: "Again" });
    state = ack(state, encounterId, "board.persist.ack");
    const pending = state.encounters[encounterId]!.pendingResult!;
    const restored = deserializeGameState(serializeGameState(state));
    expect(restored.encounters[encounterId]!.pendingResult).toEqual(pending);
    expect(restored.encounters[encounterId]!.frozenCase).toEqual(frozen);
    expect(restored.encounters[encounterId]!.patientAppearance).toEqual(appearance);
    expect(restored.encounters[encounterId]!.patientDisplayName).toBe("Persistent Patient");
  });
});
