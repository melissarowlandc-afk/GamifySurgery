import type { SyntheticClinicalCase, SyntheticClinicalRelease, TestedConcept } from "./schema";
import type { QuestionBankBatch2aRevision } from "./question-bank-batch2a-20261104";
import type { QuestionFlagConceptVersion } from "./question-flags-20261104";
import { applyQuestionBankBatch2aRevisions } from "./question-bank-batch2a-20261104";
import { QUESTION_BANK_BATCH2B_ROUND2_DEFINITIONS, QUESTION_BANK_BATCH2B_ROUND2_CONCEPT_VERSIONS } from "./question-bank-batch2b-round2-20261104-data";
import { QUESTION_SHIP_MANIFEST } from "./question-ship-manifest";

export const QUESTION_BANK_BATCH2B_ROUND2_REVISIONS: readonly QuestionBankBatch2aRevision[] = QUESTION_BANK_BATCH2B_ROUND2_DEFINITIONS;
export const QUESTION_BANK_BATCH2B_ROUND2_QUESTIONS = QUESTION_BANK_BATCH2B_ROUND2_REVISIONS.map(r => r.question);
export const QUESTION_BANK_BATCH2B_ROUND2_AUTHORING_CONCEPTS: readonly QuestionFlagConceptVersion[] = QUESTION_BANK_BATCH2B_ROUND2_CONCEPT_VERSIONS;
export const QUESTION_BANK_BATCH2B_ROUND2_TESTED_CONCEPTS: TestedConcept[] = QUESTION_BANK_BATCH2B_ROUND2_AUTHORING_CONCEPTS.map(
  ({id, displayName, learningObjective, earliestFacilityStage, conceptType}) => ({id, displayName, learningObjective, earliestFacilityStage, conceptType}),
);

/** Candidate source view only. The ship manifest, never this helper, authorizes live nodes. */
export function applyQuestionBankBatch2bRound2Revisions(cases: SyntheticClinicalCase[]): SyntheticClinicalCase[] {
  return applyQuestionBankBatch2aRevisions(cases, QUESTION_BANK_BATCH2B_ROUND2_REVISIONS);
}

/** Retain historical cards; no selector, frozen encounter or save mutation. */
export function createQuestionBankBatch2bRound2SourceView(release: SyntheticClinicalRelease): SyntheticClinicalRelease {
  return {...release,
    concepts: [...release.concepts, ...QUESTION_BANK_BATCH2B_ROUND2_TESTED_CONCEPTS],
    cases: applyQuestionBankBatch2bRound2Revisions(release.cases),
  };
}

/** Review candidates do not create live FSRS cards before exact acceptance. */
export function withAcceptedQuestionBankBatch2bRound2Concepts(release: SyntheticClinicalRelease): SyntheticClinicalRelease {
  const accepted = new Set(QUESTION_SHIP_MANIFEST.accepted.filter(row => row.sourceView === "batch2b-round2" &&
    QUESTION_BANK_BATCH2B_ROUND2_REVISIONS.some(r => r.caseId === row.caseId && r.nodeId === row.nodeId &&
      r.questionVariantId === row.questionVariantId && r.question.conceptId === row.conceptId)).map(row => row.conceptId));
  const existing = new Set(release.concepts.map(c => c.id));
  const additions = QUESTION_BANK_BATCH2B_ROUND2_TESTED_CONCEPTS.filter(c => accepted.has(c.id) && !existing.has(c.id));
  return additions.length ? {...release, concepts: [...release.concepts, ...additions]} : release;
}

export { QUESTION_BANK_BATCH2B_ROUND2_CLAIMS } from "./question-bank-batch2b-round2-evidence-20261104";
