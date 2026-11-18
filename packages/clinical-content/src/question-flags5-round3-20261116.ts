import {validateSyntheticClinicalRelease, type AnswerChoiceTimingRegistryEntry} from "./schema";
import {QUESTION_FLAGS5_ROUND2_SOURCE_RELEASE as parent} from "./question-flags5-round2-20261116";
import {QUESTION_FLAGS5_ROUND3_DATA as data} from "./question-flags5-round3-data-20261116";

/** Final authoring round; admission requires the manager's exact PASS list. */
export const QUESTION_FLAGS5_ROUND3_SOURCE_VIEW_NAME = "flags5-round3" as const;
export const QUESTION_FLAGS5_ROUND3_SOURCE_RELEASE = validateSyntheticClinicalRelease({
  ...parent, id:"clinical.flags5-source.20261116.r3", cases:data.cases, concepts:data.concepts,
});
export const QUESTION_FLAGS5_ROUND3_REVISIONS = data.metadata;
export const QUESTION_FLAGS5_ROUND3_QUESTIONS = data.metadata.map(row=>row.question);
export const QUESTION_FLAGS5_ROUND3_CLAIMS = data.claims;
export const QUESTION_FLAGS5_ROUND3_BASIS_CLAIMS = data.basisClaims;
export const QUESTION_FLAGS5_ROUND3_SOURCES = data.sources;
export const QUESTION_FLAGS5_ROUND3_STATEMENT_MAPPINGS = data.fieldMappings;
export const QUESTION_FLAGS5_ROUND3_PARKED = data.parked;
/** Prepared authority tuples only. No registration, timing installation or
 * shipping occurs until the manager supplies this round's exact PASS list. */
export const QUESTION_FLAGS5_ROUND3_PROPOSED_ACCEPTANCE_ROWS = data.metadata.map(r=>({
  acceptanceId:r.questionVariantId,caseId:r.caseId,nodeId:r.nodeId,
  questionVariantId:r.questionVariantId,conceptId:r.question.conceptId,
  sourceView:QUESTION_FLAGS5_ROUND3_SOURCE_VIEW_NAME,decision:"docs/execplans/question-flags5-20261116.md",
}));
export const QUESTION_FLAGS5_ROUND3_TIMING_ENTRIES:AnswerChoiceTimingRegistryEntry[] = JSON.parse(JSON.stringify(data.timingEntries));
export const QUESTION_FLAGS5_ROUND3_CANDIDATE_TEST_ORDER_RECORDS = QUESTION_FLAGS5_ROUND3_TIMING_ENTRIES.flatMap(t=>
  t.classification.kind !== "test_choices" ? [] : t.classification.choices.flatMap(c=>c.timing.kind !== "test" ? [] : [{
    caseId:t.caseId,nodeId:t.nodeId,questionVariantId:t.questionVariantId,choiceId:c.choiceId,choiceLabel:c.choiceLabel,
    timingProfileId:c.timing.timingProfileId,disposition:{kind:"not_executed" as const,reason:"future_planned" as const},
  }]));
