import type { SyntheticClinicalCase } from "./schema";
import { applyQuestionQualityRevisions, type QuestionQualityRevision } from "./question-quality-pilot-20261028";
import { QUESTION_QUALITY_ADVERSARIAL_R3_DEFINITIONS } from "./question-quality-adversarial-r3-20261102-data";

/** Only the 56 returned identities advance. Seventeen independent PASS versions remain exact. */
export const QUESTION_QUALITY_ADVERSARIAL_R3_REVISIONS: readonly QuestionQualityRevision[] = QUESTION_QUALITY_ADVERSARIAL_R3_DEFINITIONS;
export const QUESTION_QUALITY_ADVERSARIAL_R3_QUESTIONS = QUESTION_QUALITY_ADVERSARIAL_R3_REVISIONS.map(r => r.question);
export function applyQuestionQualityAdversarialR3Revisions(cases: SyntheticClinicalCase[]): SyntheticClinicalCase[] {
  return applyQuestionQualityRevisions(cases, QUESTION_QUALITY_ADVERSARIAL_R3_REVISIONS);
}
export { QUESTION_QUALITY_ADVERSARIAL_R3_CLAIMS, QUESTION_QUALITY_ADVERSARIAL_R3_SOURCES } from "./question-quality-adversarial-r3-evidence-20261102";
