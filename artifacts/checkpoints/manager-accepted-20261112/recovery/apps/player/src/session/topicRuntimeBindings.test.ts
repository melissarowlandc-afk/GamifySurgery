import {
  QUESTION_PROGRAM_BATCH1_ACCEPTED_TEST_ORDER_RECORDS,
  QUESTION_PROGRAM_BATCH2_ACCEPTED_TEST_ORDER_RECORDS,
  QUESTION_PROGRAM_BATCH3_ACCEPTED_TEST_ORDER_RECORDS,
  QUESTION_PROGRAM_BATCH4_ACCEPTED_TEST_ORDER_RECORDS,
  QUESTION_PROGRAM_BATCH5_ACCEPTED_TEST_ORDER_RECORDS,
  QUESTION_PROGRAM_BATCH6_ACCEPTED_TEST_ORDER_RECORDS,
  PEDIATRIC_CLINIC_FAMILY_CONTEXTS,
} from "@gamify-surgery/clinical-content";
import {
  PROTOTYPE_DOMAIN_CONTEXT, createInitialGameState, getAnswerChoiceServicePreview, serializeGameState,
  createPatientPixelAppearance, createPediatricFamily,
} from "@gamify-surgery/game-domain";
import { describe, expect, it } from "vitest";
import { createPrototypePlayerView } from "./viewModels";

const batches = [
  [1, QUESTION_PROGRAM_BATCH1_ACCEPTED_TEST_ORDER_RECORDS],
  [2, QUESTION_PROGRAM_BATCH2_ACCEPTED_TEST_ORDER_RECORDS],
  [3, QUESTION_PROGRAM_BATCH3_ACCEPTED_TEST_ORDER_RECORDS],
  [4, QUESTION_PROGRAM_BATCH4_ACCEPTED_TEST_ORDER_RECORDS],
  [5, QUESTION_PROGRAM_BATCH5_ACCEPTED_TEST_ORDER_RECORDS],
  [6, QUESTION_PROGRAM_BATCH6_ACCEPTED_TEST_ORDER_RECORDS],
] as const;

describe("accepted topic testing-choice wait labels", () => {
  it.each(batches)("shows a runtime estimate for every batch %i testing option, including distractors", (_batch, bindings) => {
    const nodes = new Map(bindings.map(record => [`${record.caseId}|${record.nodeId}|${record.questionVariantId}`, record]));
    let tested = 0;
    let wrongTests = 0;
    for (const record of nodes.values()) {
      const state = createInitialGameState();
      const encounter = Object.values(state.encounters)[0]!;
      const clinicalCase = PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.find(c => c.id === record.caseId)!;
      const index = clinicalCase.decisionNodes.findIndex(n => n.id === record.nodeId && n.questionVariantId === record.questionVariantId);
      encounter.frozenCase = structuredClone(clinicalCase);
      encounter.arrivalClass = "routine";
      encounter.lifecycle = "active_action_required";
      encounter.currentNodeIndex = index;
      encounter.patientMovement = null;
      encounter.checkInStatus = "checked_in";
      encounter.terminalFeedback = null;
      encounter.steps = clinicalCase.decisionNodes.map((node, i) => ({
        nodeIndex: i, decisionNodeId: node.id, questionVariantId: node.questionVariantId,
        primaryConceptId: node.primaryConceptId, status: i < index ? "completed" : i === index ? "action_required" : "locked",
        answer: null, result: null,
      }));
      state.facilityLevel = 5;
      state.encounters = { [encounter.id]: encounter };
      if (clinicalCase.pediatricProfile) {
        const family = PEDIATRIC_CLINIC_FAMILY_CONTEXTS.find(row => row.caseId === clinicalCase.id);
        encounter.patientAppearance = createPatientPixelAppearance(state.campaignSeed, encounter.id, clinicalCase.prototypeDemographics);
        if (family) encounter.patientAppearance.stillId = family.childStillId;
        createPediatricFamily(state, encounter, "encounter", family ? {displayName: family.parentName,
          sexLabel: family.parentRelationship === "mother" ? "Female" : "Male"} : undefined);
      }
      state.openChartEncounterId = encounter.id;
      const before = serializeGameState(state);
      const chart = createPrototypePlayerView(state, encounter.id, false, null).chart!;
      for (const binding of bindings.filter(candidate => candidate.caseId === record.caseId && candidate.nodeId === record.nodeId && candidate.questionVariantId === record.questionVariantId)) {
        const choice = chart.answerChoices.find(candidate => candidate.id === binding.choiceId);
        const preview = getAnswerChoiceServicePreview(state, encounter.id, binding.choiceId)!;
        expect(preview, binding.choiceId).toMatchObject({ kind: "test", timingProfileId: binding.timingProfileId });
        expect(preview.durationTicks).toBeGreaterThan(0);
        expect(choice?.etaLabel, binding.choiceId).toMatch(/\d/);
        expect(choice?.detailLabel, binding.choiceId).toContain("game time");
        if (!encounter.frozenCase.decisionNodes[index]!.answerChoices.find(candidate => candidate.id === binding.choiceId)!.isCorrect) wrongTests++;
        tested++;
      }
      expect(serializeGameState(state)).toBe(before);
    }
    expect(tested).toBe(bindings.length);
    expect(wrongTests).toBeGreaterThan(0);
  });
});
