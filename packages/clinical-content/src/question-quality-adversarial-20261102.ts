import type { SyntheticClinicalCase } from "./schema";
import { applyQuestionQualityRevisions, QUESTION_QUALITY_REVISIONS, type QuestionQualityRevision } from "./question-quality-pilot-20261028";
import { QUESTION_QUALITY_BATCH1_REVISIONS } from "./question-quality-batch1-20261102";
import { QUESTION_QUALITY_ADVERSARIAL_DEFINITIONS } from "./question-quality-adversarial-20261102-data";
import { QUESTION_QUALITY_ADVERSARIAL_R3_REVISIONS } from "./question-quality-adversarial-r3-20261102";
import { QUESTION_QUALITY_ADVERSARIAL_R4_REVISIONS } from "./question-quality-adversarial-r4-20261102";
import { QUESTION_QUALITY_ADVERSARIAL_R5_REVISIONS } from "./question-quality-adversarial-r5-20261102";
import { QUESTION_QUALITY_ADVERSARIAL_R6_REVISIONS } from "./question-quality-adversarial-r6-20261102";
import { QUESTION_QUALITY_ADVERSARIAL_R7_REVISIONS } from "./question-quality-adversarial-r7-20261102";

/** Local versions awaiting independent re-review and manager acceptance. */
export const QUESTION_QUALITY_ADVERSARIAL_REVISIONS: readonly QuestionQualityRevision[] = QUESTION_QUALITY_ADVERSARIAL_DEFINITIONS;
export const QUESTION_QUALITY_ADVERSARIAL_QUESTIONS = QUESTION_QUALITY_ADVERSARIAL_REVISIONS.map(r => r.question);
export const QUESTION_QUALITY_PRE_ADVERSARIAL_R4_REVISIONS = [...new Map(
  [...QUESTION_QUALITY_REVISIONS, ...QUESTION_QUALITY_BATCH1_REVISIONS, ...QUESTION_QUALITY_ADVERSARIAL_REVISIONS, ...QUESTION_QUALITY_ADVERSARIAL_R3_REVISIONS].map(r => [r.auditId, r]),
).values()];
export const QUESTION_QUALITY_PRE_ADVERSARIAL_R5_REVISIONS = [...new Map(
  [...QUESTION_QUALITY_PRE_ADVERSARIAL_R4_REVISIONS, ...QUESTION_QUALITY_ADVERSARIAL_R4_REVISIONS].map(r => [r.auditId, r]),
).values()];
export const QUESTION_QUALITY_PRE_ADVERSARIAL_R6_REVISIONS = [...new Map(
  [...QUESTION_QUALITY_PRE_ADVERSARIAL_R5_REVISIONS, ...QUESTION_QUALITY_ADVERSARIAL_R5_REVISIONS].map(r => [r.auditId, r]),
).values()];
export const QUESTION_QUALITY_PRE_ADVERSARIAL_R7_REVISIONS = [...new Map(
  [...QUESTION_QUALITY_PRE_ADVERSARIAL_R6_REVISIONS, ...QUESTION_QUALITY_ADVERSARIAL_R6_REVISIONS].map(r => [r.auditId, r]),
).values()];
export const QUESTION_QUALITY_CURRENT_REVISIONS = [...new Map(
  [...QUESTION_QUALITY_PRE_ADVERSARIAL_R7_REVISIONS, ...QUESTION_QUALITY_ADVERSARIAL_R7_REVISIONS].map(r => [r.auditId, r]),
).values()];
export function applyQuestionQualityAdversarialRevisions(cases: SyntheticClinicalCase[]): SyntheticClinicalCase[] {
  return applyQuestionQualityRevisions(cases, QUESTION_QUALITY_ADVERSARIAL_REVISIONS);
}
export { QUESTION_QUALITY_ADVERSARIAL_CLAIMS, QUESTION_QUALITY_ADVERSARIAL_SOURCES } from "./question-quality-adversarial-evidence-20261102";
