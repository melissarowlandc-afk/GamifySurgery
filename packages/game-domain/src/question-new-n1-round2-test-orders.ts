import { QUESTION_NEW_N1_ROUND2_TIMING_ENTRIES } from "@gamify-surgery/clinical-content";
import type { ExactTestChoiceOrderRecord } from "./test-choice-orders";

/** Exact draft estimates, including distractors; no added executable medical service. */
export const QUESTION_NEW_N1_ROUND2_TEST_ORDER_RECORDS: ExactTestChoiceOrderRecord[] = QUESTION_NEW_N1_ROUND2_TIMING_ENTRIES.flatMap(entry =>
  entry.classification.kind === "test_choices" ? entry.classification.choices.flatMap(choice =>
    choice.timing.kind === "test" ? [{ caseId: entry.caseId, nodeId: entry.nodeId,
      questionVariantId: entry.questionVariantId, choiceId: choice.choiceId, choiceLabel: choice.choiceLabel,
      timingProfileId: choice.timing.timingProfileId, disposition: { kind: "not_executed" as const, reason: "external_only" as const } }] : []) : []);
