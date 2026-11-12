import type { SyntheticClinicalCase, TestedConcept } from "./schema";
import type { QuestionBankBatch2aRevision } from "./question-bank-batch2a-20261104";
import type { QuestionFlagConceptVersion } from "./question-flags-20261104";
import { applyQuestionBankBatch2aRevisions } from "./question-bank-batch2a-20261104";
import { QUESTION_BANK_BATCH2A_ROUND3_DEFINITIONS, QUESTION_BANK_BATCH2A_ROUND3_CONCEPT_VERSIONS } from "./question-bank-batch2a-round3-20261104-data";

export const QUESTION_BANK_BATCH2A_ROUND3_REVISIONS: readonly QuestionBankBatch2aRevision[] = QUESTION_BANK_BATCH2A_ROUND3_DEFINITIONS;
export const QUESTION_BANK_BATCH2A_ROUND3_QUESTIONS = QUESTION_BANK_BATCH2A_ROUND3_REVISIONS.map(r=>r.question);
export const QUESTION_BANK_BATCH2A_ROUND3_AUTHORING_CONCEPTS: readonly QuestionFlagConceptVersion[] = QUESTION_BANK_BATCH2A_ROUND3_CONCEPT_VERSIONS;
export const QUESTION_BANK_BATCH2A_ROUND3_TESTED_CONCEPTS: TestedConcept[] = QUESTION_BANK_BATCH2A_ROUND3_AUTHORING_CONCEPTS.map(
  ({id,displayName,learningObjective,earliestFacilityStage,conceptType})=>({id,displayName,learningObjective,earliestFacilityStage,conceptType}),
);
/** Additive fresh-case projection; frozen encounters and all older cards persist. */
export function applyQuestionBankBatch2aRound3Revisions(cases:SyntheticClinicalCase[]):SyntheticClinicalCase[]{
  return applyQuestionBankBatch2aRevisions(cases,QUESTION_BANK_BATCH2A_ROUND3_REVISIONS);
}
