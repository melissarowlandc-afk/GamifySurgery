import {QUESTION_NEW_N3_ROUND3_TIMING_ENTRIES} from "@gamify-surgery/clinical-content";
import type {ExactTestChoiceOrderRecord} from "./test-choice-orders";
/** Only placeholder estimates for external tests; no service execution is added. */
export const QUESTION_NEW_N3_ROUND3_TEST_ORDER_RECORDS:ExactTestChoiceOrderRecord[]=QUESTION_NEW_N3_ROUND3_TIMING_ENTRIES.flatMap(t=>
  t.classification.kind==="test_choices"?t.classification.choices.flatMap(c=>c.timing.kind==="test"?[{
    caseId:t.caseId,nodeId:t.nodeId,questionVariantId:t.questionVariantId,choiceId:c.choiceId,choiceLabel:c.choiceLabel,
    timingProfileId:c.timing.timingProfileId,disposition:{kind:"not_executed" as const,reason:"external_only" as const},
  }]:[]):[]);
