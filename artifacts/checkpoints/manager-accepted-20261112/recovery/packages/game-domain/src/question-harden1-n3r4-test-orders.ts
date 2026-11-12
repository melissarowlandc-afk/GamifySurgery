import {QUESTION_HARDEN1_N3R4_ACCEPTED_TIMING_ENTRIES} from "@gamify-surgery/clinical-content";
import type {ExactTestChoiceOrderRecord} from "./test-choice-orders";
/** Exact accepted investigation estimates; all are external-only. */
export const QUESTION_HARDEN1_N3R4_TEST_ORDER_RECORDS:ExactTestChoiceOrderRecord[]=QUESTION_HARDEN1_N3R4_ACCEPTED_TIMING_ENTRIES.flatMap(t=>
 t.classification.kind==="test_choices"?t.classification.choices.flatMap(c=>c.timing.kind==="test"?[{
  caseId:t.caseId,nodeId:t.nodeId,questionVariantId:t.questionVariantId,choiceId:c.choiceId,choiceLabel:c.choiceLabel,
  timingProfileId:c.timing.timingProfileId,disposition:{kind:"not_executed" as const,reason:"external_only" as const},
 }]:[]):[]);
