import { describe, expect, it } from "vitest";
import {
  PROTOTYPE_DOMAIN_CONTEXT,
  createInitialGameState,
  deserializeGameState,
  gameReducer,
  getCurrentQuestion,
  serializeGameState,
  type GameState,
} from "../src";

const CONTEXT = PROTOTYPE_DOMAIN_CONTEXT;
const TERMINAL_CASE = CONTEXT.clinicalRelease.cases.find(
  (clinicalCase) =>
    clinicalCase.earliestFacilityStage <= 1 &&
    clinicalCase.requiredCapabilityIds.length === 0 &&
    clinicalCase.decisionNodes.length === 1 &&
    clinicalCase.decisionNodes[0]!.answerChoices.some((choice) => choice.isCorrect) &&
    clinicalCase.decisionNodes[0]!.answerChoices.some((choice) => !choice.isCorrect),
)!;

let sequence = 0;

function tick(state: GameState, label: string): GameState {
  return gameReducer(
    state,
    { type: "ADVANCE_TICK", operationId: `${label}.${sequence++}` },
    CONTEXT,
  );
}

function terminalApproachState(): GameState {
  let state = createInitialGameState(CONTEXT, {
    campaignId: `campaign.answered-chart.${sequence++}`,
    campaignSeed: "answered-chart-action-recovery",
    createdAtRealMs: 0,
  });
  state.facilityLevel = 1;
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  state.rooms = state.rooms.filter(
    (room) => room.id !== "room.instance.starter_examination",
  );
  state.doors = state.doors.filter(
    (door) => door.roomId !== "room.instance.starter_examination",
  );
  state.rooms.push(
    {
      id: "room.test.waiting",
      roomDefinitionId: "room.waiting",
      x: 29,
      y: 28,
      orientation: 0,
      doorSide: null,
      upgradeLevel: 1,
      cleanliness: 100,
    },
    {
      id: "room.test.examination",
      roomDefinitionId: "room.examination",
      x: 34,
      y: 26,
      orientation: 0,
      doorSide: null,
      upgradeLevel: 1,
      cleanliness: 100,
    },
  );
  state.doors.push(
    {
      id: "door.test.waiting",
      roomId: "room.test.waiting",
      side: "east",
      offset: 1,
      exterior: false,
    },
    {
      id: "door.test.examination",
      roomId: "room.test.examination",
      side: "south",
      offset: 1,
      exterior: false,
    },
  );
  state = gameReducer(
    state,
    {
      type: "ADMIT_PATIENT",
      operationId: "answered-chart.admit",
      encounterId: "answered-chart-patient",
      caseId: TERMINAL_CASE.id,
      patientDisplayName: "Answered Chart Patient",
      arrivalClass: "routine",
    },
    CONTEXT,
  );
  for (let minute = 0; minute < 200; minute += 1) {
    const encounter = state.encounters["answered-chart-patient"]!;
    if (
      encounter.lifecycle === "waiting_unopened" &&
      encounter.checkInStatus === "checked_in" &&
      encounter.patientMovement === null
    ) {
      break;
    }
    state = tick(state, "answered-chart.arrival");
  }
  state = gameReducer(
    state,
    {
      type: "OPEN_CHART",
      operationId: "answered-chart.open",
      encounterId: "answered-chart-patient",
    },
    CONTEXT,
  );
  expect(
    state.encounters["answered-chart-patient"]!.patientMovement,
  ).toMatchObject({ kind: "walking_to_care" });
  const encounter = state.encounters["answered-chart-patient"]!;
  expect(getCurrentQuestion(state, encounter.id, CONTEXT)).not.toBeNull();
  return state;
}

function answerFinal(state: GameState, correct: boolean): GameState {
  const question = getCurrentQuestion(
    state,
    "answered-chart-patient",
    CONTEXT,
  )!;
  const choice = question.node.answerChoices.find(
    (candidate) => candidate.isCorrect === correct,
  )!;
  return gameReducer(
    state,
    {
      type: "SUBMIT_ANSWER",
      operationId: `answered-chart.answer.${correct}`,
      encounterId: "answered-chart-patient",
      decisionNodeId: question.node.id,
      answerChoiceId: choice.id,
      reviewedAtMs: correct ? 1_000 : 2_000,
    },
    CONTEXT,
  );
}

describe("answered chart action recovery", () => {
  it.each([true, false])(
    "keeps %s terminal feedback actionable when the exam-room approach finishes",
    (correct) => {
      let state = answerFinal(terminalApproachState(), correct);
      const encounter = state.encounters["answered-chart-patient"]!;
      const conceptId = encounter.frozenCase.decisionNodes[0]!.primaryConceptId;
      const settlementId = encounter.settlementId;
      const cashAfterAnswer = state.cashCents;

      expect(encounter).toMatchObject({
        lifecycle: "resolved_summary_available",
        resolutionReason: "completed",
        steps: [{ status: "completed" }],
      });
      expect(encounter.patientMovement?.kind).toBe("walking_to_care");
      expect(state.learningHistories[conceptId]?.reviews).toHaveLength(1);
      expect(state.settlements.filter((item) => item.id === settlementId)).toHaveLength(1);

      for (let minute = 0; minute < 100; minute += 1) {
        if (state.encounters[encounter.id]!.patientMovement === null) break;
        state = tick(state, "answered-chart.finish-approach");
        expect(state.encounters[encounter.id]!.lifecycle).toBe(
          "resolved_summary_available",
        );
      }
      const arrived = state.encounters[encounter.id]!;
      expect(arrived.lifecycle).toBe("resolved_summary_available");
      expect(arrived.patientMovement).toBeNull();
      expect(arrived.terminalFeedback?.acknowledged).toBe(correct);
      expect(state.learningHistories[conceptId]?.reviews).toHaveLength(1);
      expect(state.settlements.filter((item) => item.id === settlementId)).toHaveLength(1);
      expect(state.cashCents).toBe(cashAfterAnswer);

      state = deserializeGameState(serializeGameState(state), CONTEXT);
      expect(state.encounters[encounter.id]!.lifecycle).toBe(
        "resolved_summary_available",
      );
      if (!correct) {
        state = gameReducer(
          state,
          {
            type: "ACKNOWLEDGE_TERMINAL_FEEDBACK",
            operationId: "answered-chart.dismiss",
            encounterId: encounter.id,
          },
          CONTEXT,
        );
      }
      state = gameReducer(
        state,
        {
          type: "CLOSE_CHART",
          operationId: "answered-chart.close",
          encounterId: encounter.id,
        },
        CONTEXT,
      );
      expect(state.encounters[encounter.id]!.lifecycle).toBe("resolved");
      expect(state.learningHistories[conceptId]?.reviews).toHaveLength(1);
      expect(state.settlements.filter((item) => item.id === settlementId)).toHaveLength(1);
      expect(state.cashCents).toBe(cashAfterAnswer);
    },
  );

  it.each([true, false])(
    "repairs only the persisted %s completed-terminal lifecycle signature",
    (correct) => {
    const completed = answerFinal(terminalApproachState(), correct);
    const encounterId = "answered-chart-patient";
    const settlementId = completed.encounters[encounterId]!.settlementId;
    const reviewCount = Object.values(completed.learningHistories).reduce(
      (total, history) => total + history.reviews.length,
      0,
    );
    completed.encounters[encounterId]!.lifecycle = "active_action_required";
    completed.encounters[encounterId]!.idleWaitingSinceTick =
      completed.facilityTick;
    completed.encounters[encounterId]!.feedAttentionKind = "clinical_decision";
    completed.encounters[encounterId]!.feedAttentionStartedAtTick =
      completed.facilityTick;

    const restored = deserializeGameState(serializeGameState(completed), CONTEXT);
    expect(restored.encounters[encounterId]).toMatchObject({
      lifecycle: "resolved_summary_available",
      idleWaitingSinceTick: null,
      feedAttentionKind: null,
      feedAttentionStartedAtTick: null,
      settlementId,
      terminalFeedback: { acknowledged: correct },
    });
    expect(
      Object.values(restored.learningHistories).reduce(
        (total, history) => total + history.reviews.length,
        0,
      ),
    ).toBe(reviewCount);
    expect(restored.settlements.filter((item) => item.id === settlementId)).toHaveLength(1);

    const pending = JSON.parse(serializeGameState(completed)) as GameState;
    pending.encounters[encounterId]!.lifecycle = "active_pending_result";
    pending.encounters[encounterId]!.steps[0]!.status = "result_pending";
    expect(
      deserializeGameState(JSON.stringify(pending), CONTEXT).encounters[
        encounterId
      ]!.lifecycle,
    ).toBe("active_pending_result");

    const walkout = JSON.parse(serializeGameState(completed)) as GameState;
    walkout.encounters[encounterId]!.lifecycle = "resolved";
    walkout.encounters[encounterId]!.resolutionReason = "walkout";
    walkout.encounters[encounterId]!.terminalFeedback = null;
    expect(
      deserializeGameState(JSON.stringify(walkout), CONTEXT).encounters[
        encounterId
      ],
    ).toMatchObject({ lifecycle: "resolved", resolutionReason: "walkout" });
  });
});
