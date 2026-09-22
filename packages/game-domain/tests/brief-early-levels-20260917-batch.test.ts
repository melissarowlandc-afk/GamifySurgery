import { describe, expect, it } from "vitest";
import { BRIEF_EARLY_LEVELS_20260917_CASES } from "@gamify-surgery/clinical-content";
import {
  createInitialGameState,
  deserializeGameState,
  gameReducer,
  getCurrentQuestion,
  serializeGameState,
  type GameState,
} from "../src";

function prepared(seed: string, level: 0 | 1 | 2): GameState {
  const state = createInitialGameState(undefined, {
    campaignId: `campaign.brief-sept17.${seed}`,
    campaignSeed: seed,
    createdAtRealMs: 0,
  });
  state.facilityLevel = level;
  state.encounters = {};
  state.openChartEncounterId = null;
  state.attendedEncounterId = null;
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  state.rooms.push({
    id: "room.brief-sept17.examination",
    roomDefinitionId: "room.examination",
    x: 34,
    y: 26,
    orientation: 0,
    doorSide: "south",
    upgradeLevel: 1,
    cleanliness: 100,
  });
  state.doors.push({
    id: "door.brief-sept17.examination",
    roomId: "room.brief-sept17.examination",
    side: "south",
    offset: 1,
    exterior: false,
  });
  return state;
}

function ready(
  state: GameState,
  encounterId: string,
  operationPrefix: string,
): GameState {
  let next = state;
  for (let attempt = 0; attempt < 1500; attempt += 1) {
    if (getCurrentQuestion(next, encounterId)) {
      return next;
    }
    const encounter = next.encounters[encounterId];
    if (!encounter) {
      throw new Error(`${encounterId} disappeared before becoming ready`);
    }
    next =
      encounter.lifecycle === "waiting_unopened" &&
      encounter.patientMovement === null
        ? gameReducer(next, {
            type: "OPEN_CHART",
            operationId: `${operationPrefix}.open.${attempt}`,
            encounterId,
          })
        : gameReducer(next, {
            type: "ADVANCE_TICK",
            operationId: `${operationPrefix}.tick.${attempt}`,
          });
  }
  throw new Error(`${encounterId} did not become ready`);
}

function submit(
  state: GameState,
  encounterId: string,
  correct: boolean,
  operationId: string,
  reviewedAtMs: number,
): GameState {
  const question = getCurrentQuestion(state, encounterId);
  if (!question) {
    throw new Error(`${encounterId} has no current question`);
  }
  const choice = question.node.answerChoices.find(
    (item) => item.isCorrect === correct,
  );
  if (!choice) {
    throw new Error(
      `${question.node.id} has no ${correct ? "correct" : "incorrect"} choice`,
    );
  }
  return gameReducer(state, {
    type: "SUBMIT_ANSWER",
    operationId,
    encounterId,
    decisionNodeId: question.node.id,
    answerChoiceId: choice.id,
    reviewedAtMs,
  });
}

function acknowledge(
  state: GameState,
  encounterId: string,
  operationId: string,
): GameState {
  const encounter = state.encounters[encounterId];
  if (!encounter) {
    throw new Error(`${encounterId} is unavailable for feedback acknowledgement`);
  }
  const step = encounter.steps[encounter.currentNodeIndex];
  if (!step) {
    throw new Error(`${encounterId} has no current decision step`);
  }
  return gameReducer(state, {
    type: "ACKNOWLEDGE_DECISION_FEEDBACK",
    operationId,
    encounterId,
    decisionNodeId: step.decisionNodeId,
  });
}

function advanceUntilResult(
  state: GameState,
  encounterId: string,
  operationPrefix: string,
): GameState {
  let next = state;
  const pending = next.encounters[encounterId]?.pendingResult;
  if (!pending) {
    throw new Error(`${encounterId} did not schedule a result`);
  }
  while (next.facilityTick < pending.dueTick) {
    expect(getCurrentQuestion(next, encounterId)).toBeNull();
    expect(next.encounters[encounterId]?.deliveredResultNarratives).toEqual([]);
    next = gameReducer(next, {
      type: "ADVANCE_TICK",
      operationId: `${operationPrefix}.${next.facilityTick}`,
    });
  }
  return next;
}

describe("September 17 brief early-level production flows", () => {
  it("contains the expected single-step and gated case mix", () => {
    const gated = BRIEF_EARLY_LEVELS_20260917_CASES.filter(
      (clinicalCase) => clinicalCase.decisionNodes.length === 2,
    );
    const single = BRIEF_EARLY_LEVELS_20260917_CASES.filter(
      (clinicalCase) => clinicalCase.decisionNodes.length === 1,
    );
    expect(BRIEF_EARLY_LEVELS_20260917_CASES).toHaveLength(48);
    expect(gated).toHaveLength(32);
    expect(single).toHaveLength(16);
    expect(
      gated.every(
        (clinicalCase) =>
          clinicalCase.decisionNodes[0]?.resultGateAfter !== null,
      ),
    ).toBe(true);
  });

  it.each(
    BRIEF_EARLY_LEVELS_20260917_CASES.map(
      (clinicalCase, index) => [index, clinicalCase] as const,
    ),
  )(
    "runs case %s through every authored node with one FSRS review",
    (index, clinicalCase) => {
      const encounterId = `encounter.brief-sept17.${index}`;
      const prefix = `brief-sept17.${index}`;
      let state = prepared(
        `all-${index}`,
        clinicalCase.earliestFacilityStage,
      );
      state = gameReducer(state, {
        type: "ADMIT_PATIENT",
        operationId: `${prefix}.admit`,
        encounterId,
        caseId: clinicalCase.id,
        patientDisplayName: `Brief Patient ${index}`,
        arrivalClass: "routine",
      });
      expect(state.operationReceipts[`${prefix}.admit`]?.status).toBe("applied");

      state = ready(state, encounterId, `${prefix}.first`);
      const first = getCurrentQuestion(state, encounterId);
      expect(first?.node.id).toBe(clinicalCase.decisionNodes[0]?.id);
      state = submit(
        state,
        encounterId,
        true,
        `${prefix}.first.answer`,
        index + 1,
      );
      expect(
        state.learningHistories[first!.node.primaryConceptId]?.reviews,
      ).toHaveLength(1);

      if (clinicalCase.decisionNodes.length === 1) {
        expect(state.encounters[encounterId]).toMatchObject({
          lifecycle: "resolved_summary_available",
          resolutionReason: "completed",
          pendingResult: null,
        });
        return;
      }

      state = acknowledge(
        state,
        encounterId,
        `${prefix}.first.acknowledge`,
      );
      const gate = clinicalCase.decisionNodes[0]!.resultGateAfter;
      expect(gate).not.toBeNull();
      const pending = state.encounters[encounterId]?.pendingResult;
      expect(pending).toMatchObject({ resultTypeId: gate!.resultTypeId });
      expect(pending!.dueTick).toBeGreaterThan(state.facilityTick);

      state = advanceUntilResult(state, encounterId, `${prefix}.wait`);
      state = ready(state, encounterId, `${prefix}.second`);
      expect(
        state.encounters[encounterId]?.deliveredResultNarratives,
      ).toContain(gate!.resultNarrative);

      const second = getCurrentQuestion(state, encounterId);
      expect(second?.node.id).toBe(clinicalCase.decisionNodes[1]?.id);
      state = submit(
        state,
        encounterId,
        true,
        `${prefix}.second.answer`,
        index + 10_000,
      );
      expect(state.encounters[encounterId]).toMatchObject({
        lifecycle: "resolved_summary_available",
        resolutionReason: "completed",
      });
      expect(
        state.encounters[encounterId]?.pendingResult?.deliveredAtTick,
      ).toBe(pending!.dueTick);
      expect(
        state.learningHistories[second!.node.primaryConceptId]?.reviews,
      ).toHaveLength(1);
    },
  );

  it("rejects a case before its authored facility stage", () => {
    const clinicalCase = BRIEF_EARLY_LEVELS_20260917_CASES.find(
      (item) => item.earliestFacilityStage === 2,
    );
    if (!clinicalCase) {
      throw new Error("Expected at least one Level 2 case");
    }
    const state = gameReducer(prepared("stage-rejection", 0), {
      type: "ADMIT_PATIENT",
      operationId: "brief-sept17.stage.reject",
      encounterId: "encounter.brief-sept17.stage",
      caseId: clinicalCase.id,
      patientDisplayName: "Stage Patient",
      arrivalClass: "routine",
    });
    expect(state.operationReceipts["brief-sept17.stage.reject"]).toMatchObject({
      status: "rejected",
    });
    expect(state.encounters["encounter.brief-sept17.stage"]).toBeUndefined();
  });

  it("preserves corrected-forward gated state and finishes after reload", () => {
    const clinicalCase = BRIEF_EARLY_LEVELS_20260917_CASES.find(
      (item) =>
        item.decisionNodes.length === 2 &&
        item.decisionNodes[0]?.resultGateAfter !== null,
    );
    if (!clinicalCase) {
      throw new Error("Expected at least one gated case");
    }

    const encounterId = "encounter.brief-sept17.persist";
    let state = prepared(
      "corrected-forward-persistence",
      clinicalCase.earliestFacilityStage,
    );
    state = gameReducer(state, {
      type: "ADMIT_PATIENT",
      operationId: "brief-sept17.persist.admit",
      encounterId,
      caseId: clinicalCase.id,
      patientDisplayName: "Persistent Patient",
      arrivalClass: "routine",
    });
    state = ready(state, encounterId, "brief-sept17.persist.first");

    const first = getCurrentQuestion(state, encounterId);
    if (!first) {
      throw new Error("Expected the first persisted question");
    }
    const choiceOrder = first.node.answerChoices.map((choice) => choice.id);
    state = submit(
      state,
      encounterId,
      false,
      "brief-sept17.persist.wrong-answer",
      99,
    );
    expect(state.encounters[encounterId]?.steps[0]?.answer).toMatchObject({
      correct: false,
      correctedForward: true,
      ratingIntent: "Again",
    });
    expect(
      state.learningHistories[first.node.primaryConceptId]?.reviews,
    ).toHaveLength(1);

    state = acknowledge(
      state,
      encounterId,
      "brief-sept17.persist.acknowledge",
    );
    const pending = state.encounters[encounterId]?.pendingResult;
    if (!pending) {
      throw new Error("Expected corrected-forward answer to schedule a result");
    }

    let restored = deserializeGameState(serializeGameState(state));
    expect(restored.encounters[encounterId]?.pendingResult).toEqual(pending);
    expect(restored.encounters[encounterId]?.pendingResult?.dueTick).toBe(
      pending.dueTick,
    );
    expect(restored.encounters[encounterId]?.patientDisplayName).toBe(
      "Persistent Patient",
    );
    expect(restored.encounters[encounterId]?.frozenCase).toEqual(
      state.encounters[encounterId]?.frozenCase,
    );
    expect(
      restored.encounters[
        encounterId
      ]?.frozenCase.decisionNodes[0]?.answerChoices.map((choice) => choice.id),
    ).toEqual(choiceOrder);
    expect(
      restored.learningHistories[first.node.primaryConceptId]?.reviews,
    ).toHaveLength(1);

    restored = advanceUntilResult(
      restored,
      encounterId,
      "brief-sept17.persist.wait",
    );
    restored = ready(
      restored,
      encounterId,
      "brief-sept17.persist.second",
    );
    const gate = clinicalCase.decisionNodes[0]!.resultGateAfter!;
    expect(
      restored.encounters[encounterId]?.deliveredResultNarratives,
    ).toContain(gate.resultNarrative);

    const second = getCurrentQuestion(restored, encounterId);
    if (!second) {
      throw new Error("Expected the second persisted question");
    }
    expect(second.node.id).toBe(clinicalCase.decisionNodes[1]?.id);
    restored = submit(
      restored,
      encounterId,
      true,
      "brief-sept17.persist.second.answer",
      10_099,
    );
    expect(restored.encounters[encounterId]).toMatchObject({
      lifecycle: "resolved_summary_available",
      resolutionReason: "completed",
    });
    expect(
      restored.encounters[encounterId]?.pendingResult?.deliveredAtTick,
    ).toBe(pending.dueTick);
    expect(
      restored.learningHistories[second.node.primaryConceptId]?.reviews,
    ).toHaveLength(1);
    expect(
      restored.learningHistories[first.node.primaryConceptId]?.reviews,
    ).toHaveLength(1);
  });
});
