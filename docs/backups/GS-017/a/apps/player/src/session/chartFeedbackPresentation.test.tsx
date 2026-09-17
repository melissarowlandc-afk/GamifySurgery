import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import {
  createInitialGameState,
  gameReducer,
  getCurrentQuestion,
  type GameState,
} from "@gamify-surgery/game-domain";
import { ChartPanel } from "../ui/ChartPanel";
import { createPrototypePlayerView } from "./viewModels";

function preparedState(): GameState {
  const state = createInitialGameState(undefined, {
    campaignId: "campaign.chart-feedback",
    campaignSeed: "chart-feedback",
    createdAtRealMs: 0,
  });
  state.facilityLevel = 2;
  state.encounters = {};
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  state.rooms.push({ id: "room.chart-feedback.examination", roomDefinitionId: "room.examination", x: 34, y: 26, orientation: 0, doorSide: "south", upgradeLevel: 1, cleanliness: 100 });
  state.doors.push({ id: "door.chart-feedback.examination", roomId: "room.chart-feedback.examination", side: "south", offset: 1, exterior: false });
  return state;
}

function advanceUntilQuestion(
  state: GameState,
  encounterId: string,
  operationPrefix: string,
): GameState {
  let next = state;
  for (let attempt = 0; attempt < 700; attempt += 1) {
    if (getCurrentQuestion(next, encounterId)) return next;
    const encounter = next.encounters[encounterId]!;
    next = encounter.lifecycle === "waiting_unopened" && encounter.patientMovement === null
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
  throw new Error("Encounter did not reach a decision.");
}

describe("chart decision feedback", () => {
  it("withholds the key before submission and keeps returned findings only in the next current update", () => {
    const encounterId = "encounter.chart-feedback";
    let state = gameReducer(preparedState(), {
      type: "ADMIT_PATIENT",
      operationId: "chart-feedback.admit",
      encounterId,
      caseId: "case.celiac.chronic-diarrhea",
      patientDisplayName: "Chart Feedback Patient",
      arrivalClass: "routine",
    });
    state.encounters[encounterId]!.frozenCase.decisionNodes[1]!.currentUpdate = undefined;
    state = advanceUntilQuestion(state, encounterId, "chart-feedback.first");

    const firstQuestion = getCurrentQuestion(state, encounterId)!;
    const correctLabel = firstQuestion.node.answerChoices.find(
      (choice) => choice.isCorrect,
    )!.label;
    const wrongChoice = firstQuestion.node.answerChoices.find(
      (choice) => !choice.isCorrect,
    )!;
    let chart = createPrototypePlayerView(state, encounterId, false, null).chart!;
    const beforeAnswer = chart.decisionSteps!.find((step) => step.current)!;
    expect(beforeAnswer.feedbackBody).toBeUndefined();
    expect(beforeAnswer.collapsedResultLabel).toBeUndefined();

    state = gameReducer(state, {
      type: "SUBMIT_ANSWER",
      operationId: "chart-feedback.submit-wrong",
      encounterId,
      decisionNodeId: firstQuestion.node.id,
      answerChoiceId: wrongChoice.id,
      reviewedAtMs: 1,
    });
    chart = createPrototypePlayerView(state, encounterId, false, null).chart!;
    const feedbackStep = chart.decisionSteps!.find((step) =>
      step.id === firstQuestion.node.id,
    )!;
    expect(feedbackStep.feedbackBody).toContain(`Correct answer: ${correctLabel}.`);

    state = gameReducer(state, {
      type: "ACKNOWLEDGE_DECISION_FEEDBACK",
      operationId: "chart-feedback.acknowledge",
      encounterId,
      decisionNodeId: firstQuestion.node.id,
    });
    state = advanceUntilQuestion(state, encounterId, "chart-feedback.result");
    for (let attempt = 0; attempt < 50; attempt += 1) {
      const currentChart = createPrototypePlayerView(
        state,
        encounterId,
        false,
        null,
      ).chart;
      if (currentChart?.decisionSteps?.some((step) => step.current)) break;
      state = gameReducer(state, {
        type: "ADVANCE_TICK",
        operationId: `chart-feedback.current.${attempt}`,
      });
    }
    chart = createPrototypePlayerView(state, encounterId, false, null).chart!;

    const completed = chart.decisionSteps!.find((step) => step.complete)!;
    const current = chart.decisionSteps!.find((step) => step.current)!;
    const deliveredNarrative = state.encounters[encounterId]!
      .deliveredResultNarratives[0]!;
    expect(completed.collapsedResultLabel).toContain(wrongChoice.label);
    expect(completed.collapsedResultLabel).not.toContain(deliveredNarrative);
    expect(completed.resultBody).toBeUndefined();
    expect(completed.feedbackBody).toContain(`Correct answer: ${correctLabel}.`);
    expect(current.currentUpdate).toBe(deliveredNarrative);

    const markup = renderToStaticMarkup(
      <ChartPanel
        chart={chart}
        onClose={vi.fn()}
        onSubmitAnswer={vi.fn()}
        onFlagQuestion={vi.fn()}
        onAcknowledgeTerminalFeedback={vi.fn()}
        onToggleSummary={vi.fn()}
        onFileChart={vi.fn()}
      />,
    );
    expect(markup).toContain(`Correct answer: ${correctLabel}.`);
    expect(markup.match(new RegExp(deliveredNarrative, "g"))).toHaveLength(1);
  });
});
