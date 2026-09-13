import { describe, expect, it } from "vitest";
import {
  PATIENT_LIBRARY_CASE_WORDING_REVISIONS,
  PATIENT_LIBRARY_NODE_STEM_REVISIONS,
} from "@gamify-surgery/clinical-content";
import {
  createInitialGameState,
  gameReducer,
  serializeGameState,
} from "@gamify-surgery/game-domain";
import { createPrototypePlayerView } from "./viewModels";

function chartFor(caseId: string) {
  let state = createInitialGameState();
  state.facilityLevel = 2;
  state.encounters = {};
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  state = gameReducer(state, {
    type: "ADMIT_PATIENT",
    operationId: `presentation.${caseId}.admit`,
    encounterId: "encounter.presentation",
    caseId,
    patientDisplayName: "Presentation Patient",
    arrivalClass: "routine",
  });
  const encounter = state.encounters["encounter.presentation"]!;
  encounter.lifecycle = "active_action_required";
  encounter.patientMovement = null;
  encounter.patientLocation = { ...state.environment.founderLocation };
  encounter.steps[0]!.status = "action_required";
  return { state, encounter, chart: createPrototypePlayerView(state, encounter.id, false, null).chart! };
}

describe("answer-choice timing presentation", () => {
  it("uses one neutral label for all tests and an explicit no-test label on mixed nodes", () => {
    const { chart } = chartFor("case.fhh.suggestive-results-confirmation");
    const choices = chart.decisionSteps!.find((step) => step.current)!.answerChoices;
    expect(choices.find((choice) => choice.id === "suspect_fhh_genetic_testing")).toMatchObject({
      etaLabel: "3 hours",
      detailLabel: "Estimated test wait (game time)",
    });
    const noTests = choices.filter((choice) => choice.id !== "suspect_fhh_genetic_testing");
    expect(noTests.every((choice) => choice.etaLabel === "No test wait")).toBe(true);
    expect(noTests.every((choice) => choice.detailLabel === undefined)).toBe(true);
  });

  it("shows no timing labels on diagnosis-only nodes", () => {
    const { state, encounter } = chartFor("case.achalasia.water-and-solids");
    encounter.currentNodeIndex = 1;
    encounter.steps[0]!.status = "completed";
    encounter.steps[1]!.status = "action_required";
    const chart = createPrototypePlayerView(state, encounter.id, false, null).chart!;
    expect(chart.answerChoices.every((choice) => !choice.etaLabel && !choice.detailLabel)).toBe(true);
  });

  it("normalizes old pilonidal pre-answer prose without mutating the frozen save", () => {
    const { state, encounter } = chartFor("case.pilonidal-disease.recurrent-drainage");
    encounter.frozenCase.presentation =
      "Presentation Patient has intermittent natal-cleft drainage and tenderness between episodes.";
    encounter.frozenCase.chiefComplaint = "My natal cleft keeps draining.";
    encounter.frozenCase.decisionNodes[0]!.stem =
      "Which diagnosis explains Presentation Patient's recurrent natal-cleft finding?";
    const serializedBefore = JSON.stringify(encounter.frozenCase);
    const chart = createPrototypePlayerView(state, encounter.id, false, null).chart!;
    expect(`${chart.chiefComplaint} ${chart.presentation} ${chart.questionPrompt}`).not.toMatch(/natal[- ]cleft/i);
    expect(`${chart.chiefComplaint} ${chart.presentation} ${chart.questionPrompt}`).toContain(
      "groove between the buttocks near the tailbone",
    );
    expect(chart.presentation).toBe(
      "Presentation Patient has intermittent drainage and tenderness in the upper groove between the buttocks near the tailbone between episodes.",
    );
    expect(chart.questionPrompt).toBe(
      "Which diagnosis explains Presentation Patient's recurrent drainage near the tailbone?",
    );
    expect(JSON.stringify(encounter.frozenCase)).toBe(serializedBefore);
  });

  it("displays exact known frozen wording repairs without changing saved case data", () => {
    const caseRevision = PATIENT_LIBRARY_CASE_WORDING_REVISIONS.find(
      (candidate) => candidate.caseId === "case.fhh.evaluation-to-confirmed-management",
    )!;
    const { state, encounter } = chartFor(caseRevision.caseId);
    encounter.frozenCase.chiefComplaint = caseRevision.sourceChiefComplaint!;
    encounter.frozenCase.presentation = caseRevision.sourcePresentation;
    const before = serializeGameState(state);
    const chart = createPrototypePlayerView(state, encounter.id, false, null).chart!;
    expect(chart.chiefComplaint).toBe(caseRevision.revisedChiefComplaint);
    expect(chart.presentation).toContain(encounter.patientDisplayName);
    expect(chart.presentation).not.toBe(caseRevision.sourcePresentation);
    expect(serializeGameState(state)).toBe(before);

    const stemRevision = PATIENT_LIBRARY_NODE_STEM_REVISIONS.find(
      (candidate) => candidate.caseId === "case.anal-hsil.hpv.3b",
    )!;
    const hsil = chartFor(stemRevision.caseId);
    hsil.encounter.frozenCase.decisionNodes[0]!.stem = stemRevision.sourceStem;
    const hsilChart = createPrototypePlayerView(hsil.state, hsil.encounter.id, false, null).chart!;
    expect(hsilChart.questionPrompt).toBe(stemRevision.revisedStem);
    expect(hsilChart.questionPrompt).toMatch(/\?$/);
    expect(hsilChart.questionPrompt).not.toBe("Which answer is appropriate?");
  });
});
