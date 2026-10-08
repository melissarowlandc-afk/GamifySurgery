import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import {
  createInitialGameState,
  gameReducer,
  getCurrentQuestion,
  PROTOTYPE_DOMAIN_CONTEXT,
  type EmployeeDiscussionState,
  type GameState,
} from "@gamify-surgery/game-domain";
import { ChartPanel } from "../ui/ChartPanel";
import { employeeDiscussionChartView } from "../ui/EmployeeDiscussionPanel";
import type { ChartView } from "../ui/types";
import { createPrototypePlayerView, employeeDiscussionView } from "./viewModels";

const render = (chart: ChartView) => renderToStaticMarkup(<ChartPanel chart={chart}
  onClose={vi.fn()} onSubmitAnswer={vi.fn()} onFlagQuestion={vi.fn()}
  onAcknowledgeTerminalFeedback={vi.fn()} onToggleSummary={vi.fn()} onFileChart={vi.fn()}
/>);

function preparedPatientState(): GameState {
  const state = createInitialGameState(undefined, { campaignId: "campaign.chart-structured", campaignSeed: "chart-structured", createdAtRealMs: 0 });
  state.facilityLevel = 2;
  state.encounters = {};
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  state.rooms.push({ id: "room.chart-structured.exam", roomDefinitionId: "room.examination", x: 34, y: 26, orientation: 0, doorSide: "south", upgradeLevel: 1, cleanliness: 100 });
  state.doors.push({ id: "door.chart-structured.exam", roomId: "room.chart-structured.exam", side: "south", offset: 1, exterior: false });
  return state;
}

function openPatientDecision(state: GameState, encounterId: string): GameState {
  let next = state;
  for (let attempt = 0; attempt < 700; attempt += 1) {
    if (getCurrentQuestion(next, encounterId)) return next;
    const encounter = next.encounters[encounterId]!;
    next = encounter.lifecycle === "waiting_unopened" && encounter.patientMovement === null
      ? gameReducer(next, { type: "OPEN_CHART", operationId: `structured.open.${attempt}`, encounterId })
      : gameReducer(next, { type: "ADVANCE_TICK", operationId: `structured.tick.${attempt}` });
  }
  throw new Error("Structured chart patient did not reach a decision.");
}

describe("frozen patient structured-field projection", () => {
  it.each([false, true])("preserves GS-028 feedback and legacy-save behavior (legacy=%s)", (legacy) => {
    const clinicalCase = PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.find((candidate) =>
      candidate.id.startsWith("case.gs028se.") && !candidate.participant && candidate.decisionNodes[0]?.exhibit?.kind === "table",
    )!;
    expect(clinicalCase).toBeDefined();
    const encounterId = "encounter.chart-structured";
    let state = gameReducer(preparedPatientState(), {
      type: "ADMIT_PATIENT", operationId: "structured.admit", encounterId, caseId: clinicalCase.id,
      patientDisplayName: "QA Patient", arrivalClass: "routine",
    });
    const frozenNode = state.encounters[encounterId]!.frozenCase.decisionNodes[0]!;
    if (legacy) {
      delete frozenNode.exhibit;
      delete frozenNode.teachingPoint;
      for (const choice of frozenNode.answerChoices) delete choice.rationale;
    }
    state = openPatientDecision(state, encounterId);
    const node = getCurrentQuestion(state, encounterId)!.node;
    const chartBefore = createPrototypePlayerView(state, encounterId, false, null).chart!;
    const before = chartBefore.decisionSteps!.find((step) => step.current)!;
    expect(before.exhibit).toEqual(node.exhibit);
    expect(before.teachingPoint).toBeUndefined();
    expect(before.answerChoices.every((choice) => choice.rationale === undefined && choice.revealedCorrect === undefined)).toBe(true);
    expect(render(chartBefore)).not.toContain("Why not your pick");

    const wrong = node.answerChoices.find((choice) => !choice.isCorrect)!;
    state = gameReducer(state, {
      type: "SUBMIT_ANSWER", operationId: "structured.answer", encounterId,
      decisionNodeId: node.id, answerChoiceId: wrong.id, reviewedAtMs: 1,
    });
    const chartAfter = createPrototypePlayerView(state, encounterId, false, null).chart!;
    const after = chartAfter.decisionSteps!.find((step) => step.id === node.id)!;
    expect(after.teachingPoint).toBe(node.teachingPoint);
    expect(after.exhibit).toEqual(node.exhibit);
    expect(after.answerChoices.find((choice) => choice.selected)?.rationale).toBe(wrong.rationale);
    const html = render(chartAfter);
    if (legacy) {
      expect(html).toContain(node.explanation);
      expect(html).not.toContain("Teaching dataset");
      expect(html).not.toContain("Why not your pick");
    } else {
      expect(html).toContain("Teaching dataset");
      expect(html).toContain("Why not your pick");
      expect(html.indexOf(node.teachingPoint!)).toBeLessThan(html.indexOf(wrong.rationale!));
    }
  });
});

describe("frozen team discussion structured-field projection", () => {
  it.each(["table", "keyValue", "abstract", "legacy"] as const)("projects %s discussions without exposing feedback before submission", (kind) => {
    const state = createInitialGameState();
    const frozenCase = structuredClone(PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.find((candidate) =>
      candidate.id.startsWith("case.gs028se.") && candidate.participant?.kind === "employee_discussion" && candidate.decisionNodes[0]?.exhibit?.kind === (kind === "legacy" ? "table" : kind),
    )!);
    expect(frozenCase).toBeDefined();
    const node = frozenCase.decisionNodes[0]!;
    if (kind === "legacy") {
      delete node.exhibit;
      delete node.teachingPoint;
      for (const choice of node.answerChoices) delete choice.rationale;
    }
    const discussion: EmployeeDiscussionState = {
      id: "discussion.structured", employeeId: "employee.structured", employeeDisplayName: "QA Colleague",
      employeeAppearance: state.founder.appearance, clinicalReleaseId: "test", frozenCase,
      lifecycle: "active_action_required", createdAtFacilityTick: 0, firstOpenedAtTick: 0,
      resolvedAtFacilityTick: null, cancellationReason: null, currentNodeIndex: 0, answers: [], steps: [],
    };
    state.employeeDiscussions = { [discussion.id]: discussion };
    state.openEmployeeDiscussionId = discussion.id;
    const before = employeeDiscussionView(state)!;
    expect(before.exhibit).toEqual(node.exhibit);
    expect(before.teachingPoint).toBeUndefined();
    expect(before.choices?.every((choice) => choice.rationale === undefined && choice.revealedCorrect === undefined)).toBe(true);

    const wrong = node.answerChoices.find((choice) => !choice.isCorrect)!;
    discussion.answers.push({
      decisionNodeId: node.id, primaryConceptId: node.primaryConceptId, answerChoiceId: wrong.id,
      correct: false, ratingIntent: "Again", answeredAtFacilityTick: 1, explanation: node.explanation, correctedForward: false,
    });
    discussion.lifecycle = "feedback_pending";
    const after = employeeDiscussionView(state)!;
    expect(after.teachingPoint).toBe(node.teachingPoint);
    expect(after.choices?.find((choice) => choice.selected)?.rationale).toBe(wrong.rationale);
    const html = render(employeeDiscussionChartView(after));
    if (kind === "legacy") {
      expect(html).toContain(node.explanation);
      expect(html).not.toContain("Teaching dataset");
      expect(html).not.toContain("Why not your pick");
    } else {
      expect(html).toContain("Teaching dataset");
      expect(html).toContain("Why not your pick");
    }
  });
});
