import type { SyntheticClinicalCase, TestedConcept } from "./schema";
import type { QuestionBankBatch2aRevision } from "./question-bank-batch2a-20261104";
import type { QuestionFlagConceptVersion } from "./question-flags-20261104";
import { applyQuestionBankBatch2aRevisions } from "./question-bank-batch2a-20261104";
import { QUESTION_BANK_BATCH2B_DEFINITIONS, QUESTION_BANK_BATCH2B_CONCEPT_VERSIONS } from "./question-bank-batch2b-20261104-data";

export const QUESTION_BANK_BATCH2B_REVISIONS: readonly QuestionBankBatch2aRevision[] = QUESTION_BANK_BATCH2B_DEFINITIONS;
export const QUESTION_BANK_BATCH2B_QUESTIONS = QUESTION_BANK_BATCH2B_REVISIONS.map(r => r.question);
export const QUESTION_BANK_BATCH2B_AUTHORING_CONCEPTS: readonly QuestionFlagConceptVersion[] = QUESTION_BANK_BATCH2B_CONCEPT_VERSIONS;
export const QUESTION_BANK_BATCH2B_TESTED_CONCEPTS: TestedConcept[] = QUESTION_BANK_BATCH2B_AUTHORING_CONCEPTS.map(
  ({id, displayName, learningObjective, earliestFacilityStage, conceptType}) => ({id, displayName, learningObjective, earliestFacilityStage, conceptType}),
);

/** Only fresh assembled variants change. All old question/gate/order records remain. */
export function applyQuestionBankBatch2bRevisions(cases: SyntheticClinicalCase[]): SyntheticClinicalCase[] {
  return applyQuestionBankBatch2aRevisions(cases, QUESTION_BANK_BATCH2B_REVISIONS);
}

export { QUESTION_BANK_BATCH2B_CLAIMS } from "./question-bank-batch2b-evidence-20261104";
