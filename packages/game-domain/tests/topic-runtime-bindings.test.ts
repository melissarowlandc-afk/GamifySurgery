import * as clinical from "@gamify-surgery/clinical-content";
import type { SyntheticClinicalCase } from "@gamify-surgery/clinical-content";
import { describe, expect, it } from "vitest";
import {
  PROTOTYPE_DOMAIN_CONTEXT, createInitialGameState, deserializeGameState, gameReducer,
  getAnswerChoiceServicePreview, getDiagnosticOrderPlans, serializeGameState,
  type EncounterState,
} from "../src";
import { getDiagnosticChoicePlanning } from "../src/diagnostic-order-requests";
import { EXACT_TEST_CHOICE_ORDER_RECORDS, getExactTestChoiceOrderRecord, type ExactTestChoiceOrderRecord } from "../src/test-choice-orders";

const batches = [
  [1, 15, clinical.QUESTION_PROGRAM_BATCH1_ACCEPTED_TEST_ORDER_RECORDS],
  [2, 33, clinical.QUESTION_PROGRAM_BATCH2_ACCEPTED_TEST_ORDER_RECORDS],
  [3, 209, clinical.QUESTION_PROGRAM_BATCH3_ACCEPTED_TEST_ORDER_RECORDS],
  [4, 292, clinical.QUESTION_PROGRAM_BATCH4_ACCEPTED_TEST_ORDER_RECORDS],
  [5, 24, clinical.QUESTION_PROGRAM_BATCH5_ACCEPTED_TEST_ORDER_RECORDS],
] as const;
const keyOf = (record: Pick<ExactTestChoiceOrderRecord, "caseId" | "nodeId" | "questionVariantId" | "choiceId">) =>
  `${record.caseId}|${record.nodeId}|${record.questionVariantId}|${record.choiceId}`;
const records = new Map(EXACT_TEST_CHOICE_ORDER_RECORDS.map(record => [keyOf(record), record]));
const timings = new Map(clinical.ANSWER_CHOICE_TIMING_REGISTRY.map(entry =>
  [`${entry.caseId}|${entry.nodeId}|${entry.questionVariantId}`, entry]));

function ready(clinicalCase: SyntheticClinicalCase, index: number) {
  const state = createInitialGameState();
  const encounter = Object.values(state.encounters)[0]!;
  Object.assign(encounter, {
    frozenCase: structuredClone(clinicalCase), arrivalClass: "routine", lifecycle: "active_action_required",
    currentNodeIndex: index, patientMovement: null, checkInStatus: "checked_in", firstOpenedAtTick: 0,
    terminalFeedback: null, pendingResult: null, consult: undefined,
  } satisfies Partial<EncounterState>);
  encounter.steps = clinicalCase.decisionNodes.map((node, i) => ({
    nodeIndex: i, decisionNodeId: node.id, questionVariantId: node.questionVariantId,
    primaryConceptId: node.primaryConceptId, status: i < index ? "completed" : i === index ? "action_required" : "locked",
    answer: null, result: null,
  }));
  state.facilityLevel = 5;
  state.encounters = { [encounter.id]: encounter };
  state.openChartEncounterId = encounter.id;
  state.attendedEncounterId = null;
  state.serviceAppointmentsEnabled = false;
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  return { state, encounter, node: encounter.frozenCase.decisionNodes[index]! };
}

describe("accepted topic runtime diagnostic bindings", () => {
  it.each(batches)("installs batch %i's %i exact accepted records", (_batch, count, accepted) => {
    expect(accepted).toHaveLength(count);
    for (const record of accepted) {
      expect(records.get(keyOf(record)), keyOf(record)).toEqual(record);
      expect(record.disposition).toEqual({ kind: "not_executed", reason: "future_planned" });
    }
    expect(records.size).toBe(EXACT_TEST_CHOICE_ORDER_RECORDS.length);
  });

  it("requires every exported acceptance batch, including future batches, to install all its exact bindings", () => {
    const exported = Object.entries(clinical).filter(([name]) => /^QUESTION_PROGRAM_BATCH\d+_ACCEPTED_TEST_ORDER_RECORDS$/.test(name));
    expect(exported.length).toBeGreaterThanOrEqual(batches.length);
    for (const [name, value] of exported) {
      expect(Array.isArray(value), name).toBe(true);
      for (const record of value as readonly ExactTestChoiceOrderRecord[]) {
        expect(records.get(keyOf(record)), `${name}: ${keyOf(record)}`).toEqual(record);
      }
    }
  });

  it("binds every default-release testing choice to exact timing metadata and a finite runtime estimate, including distractors", () => {
    let tested = 0;
    let distractors = 0;
    for (const clinicalCase of PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases) {
      for (const [index, originalNode] of clinicalCase.decisionNodes.entries()) {
        const entry = timings.get(`${clinicalCase.id}|${originalNode.id}|${originalNode.questionVariantId}`);
        expect(entry, `${clinicalCase.id}/${originalNode.id} needs an explicit timing classification`).toBeDefined();
        if (entry!.classification.kind !== "test_choices") continue;
        const { state, encounter, node } = ready(clinicalCase, index);
        const before = serializeGameState(state);
        expect(entry!.classification.choices.map(choice => [choice.choiceId, choice.choiceLabel]).sort())
          .toEqual(node.answerChoices.map(choice => [choice.id, choice.label]).sort());
        for (const binding of entry!.classification.choices) {
          if (binding.timing.kind !== "test") continue;
          const timingProfileId = binding.timing.timingProfileId;
          const profile = PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.answerChoiceTimingProfiles.filter(p => p.id === timingProfileId);
          expect(profile, `${node.id}/${binding.choiceId} needs one existing runtime profile`).toHaveLength(1);
          expect(profile[0]!.durationTicks).toBeGreaterThan(0);
          const preview = getAnswerChoiceServicePreview(state, encounter.id, binding.choiceId);
          expect(preview, `${node.id}/${binding.choiceId}`).toMatchObject({ kind: "test", timingProfileId });
          expect(Number.isFinite(preview?.durationTicks)).toBe(true);
          expect(preview?.durationTicks).toBeGreaterThan(0);
          if (!node.answerChoices.find(choice => choice.id === binding.choiceId)!.isCorrect) {
            expect(getDiagnosticChoicePlanning(state, encounter, node, binding.choiceId)?.executionAllowed).toBe(false);
            distractors++;
          }
          tested++;
        }
        expect(serializeGameState(state)).toBe(before);
      }
    }
    expect(tested).toBeGreaterThan(0);
    expect(distractors).toBeGreaterThan(0);
  });

  it.each(batches)("keeps batch %i's %i reviewed plans preview-only through answer/enactment and reload", (_batch, _count, accepted) => {
    for (const record of accepted) {
      const clinicalCase = PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.find(c => c.id === record.caseId)!;
      const index = clinicalCase.decisionNodes.findIndex(n => n.id === record.nodeId && n.questionVariantId === record.questionVariantId);
      const { state, encounter, node } = ready(clinicalCase, index);
      expect(getExactTestChoiceOrderRecord(encounter, node, record.choiceId)).toEqual(record);
      expect(getDiagnosticChoicePlanning(state, encounter, node, record.choiceId)).toMatchObject({ executionAllowed: false });
      let next = gameReducer(state, { type: "SUBMIT_ANSWER", operationId: "topic.binding.answer", encounterId: encounter.id,
        decisionNodeId: node.id, answerChoiceId: record.choiceId });
      expect(next.operationReceipts["topic.binding.answer"]?.status, keyOf(record)).toBe("applied");
      if (next.encounters[encounter.id]!.steps[index]!.status === "feedback_pending") {
        next = gameReducer(next, { type: "ACKNOWLEDGE_DECISION_FEEDBACK", operationId: "topic.binding.enact",
          encounterId: encounter.id, decisionNodeId: node.id });
        expect(next.operationReceipts["topic.binding.enact"]?.status, keyOf(record)).toBe("applied");
      }
      expect(next.serviceOperations).toEqual(state.serviceOperations);
      expect(getDiagnosticOrderPlans(next)).toEqual([]);
      expect(next.encounters[encounter.id]!.pendingResult).toBeNull();
      expect(next.encounters[encounter.id]!.terminalTestOrder ?? null).toBeNull();
      const restored = deserializeGameState(serializeGameState(next));
      expect(restored.encounters[encounter.id]!.frozenCase).toEqual(next.encounters[encounter.id]!.frozenCase);
      expect(getExactTestChoiceOrderRecord(restored.encounters[encounter.id]!, node, record.choiceId)).toEqual(record);
      expect(getDiagnosticOrderPlans(restored)).toEqual([]);
    }
  });
});
