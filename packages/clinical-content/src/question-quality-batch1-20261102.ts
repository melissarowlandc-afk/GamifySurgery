import type { SyntheticClinicalCase } from "./schema";
import { applyQuestionQualityRevisions, type QuestionQualityRevision } from "./question-quality-pilot-20261028";
import { QUESTION_QUALITY_BATCH1_DEFINITIONS } from "./question-quality-batch1-20261102-data";

/** LOCAL DRAFTS ONLY: 40 proposed tasks plus versioned visible-context nodes. */
export const QUESTION_QUALITY_BATCH1_REVISIONS: readonly QuestionQualityRevision[] = QUESTION_QUALITY_BATCH1_DEFINITIONS;
export const QUESTION_QUALITY_BATCH1_QUESTIONS = QUESTION_QUALITY_BATCH1_REVISIONS.map(r => r.question);

/** Fresh assembly only. Frozen encounters and historical source batches stay intact. */
export function applyQuestionQualityBatch1Revisions(cases: SyntheticClinicalCase[]): SyntheticClinicalCase[] {
  return applyQuestionQualityRevisions(cases, QUESTION_QUALITY_BATCH1_REVISIONS);
}
