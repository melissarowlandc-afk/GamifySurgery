import type { SyntheticClinicalCase, TestedConcept } from "./schema";
import type { QuestionBankBatch2aRevision } from "./question-bank-batch2a-20261104";
import type { QuestionFlagConceptVersion } from "./question-flags-20261104";
import { applyQuestionBankBatch2aRevisions } from "./question-bank-batch2a-20261104";
import { QUESTION_BANK_BATCH2A_ROUND2_DEFINITIONS, QUESTION_BANK_BATCH2A_ROUND2_CONCEPT_VERSIONS } from "./question-bank-batch2a-round2-20261104-data";

export const QUESTION_BANK_BATCH2A_ROUND2_REVISIONS: readonly QuestionBankBatch2aRevision[] = QUESTION_BANK_BATCH2A_ROUND2_DEFINITIONS;
export const QUESTION_BANK_BATCH2A_ROUND2_QUESTIONS = QUESTION_BANK_BATCH2A_ROUND2_REVISIONS.map(r => r.question);
export const QUESTION_BANK_BATCH2A_ROUND2_AUTHORING_CONCEPTS: readonly QuestionFlagConceptVersion[] = QUESTION_BANK_BATCH2A_ROUND2_CONCEPT_VERSIONS;
export const QUESTION_BANK_BATCH2A_ROUND2_TESTED_CONCEPTS: TestedConcept[] = QUESTION_BANK_BATCH2A_ROUND2_AUTHORING_CONCEPTS.map(
  ({id,displayName,learningObjective,earliestFacilityStage,conceptType}) => ({id,displayName,learningObjective,earliestFacilityStage,conceptType}),
);
/** Project fresh variants only. Saved encounters retain their exact definitions. */
export function applyQuestionBankBatch2aRound2Revisions(cases:SyntheticClinicalCase[]):SyntheticClinicalCase[]{
  return applyQuestionBankBatch2aRevisions(cases,QUESTION_BANK_BATCH2A_ROUND2_REVISIONS);
}
