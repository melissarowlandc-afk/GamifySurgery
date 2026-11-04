import type { AuthoredClinicalRecord } from "./pilot-schema";
import type { SyntheticClinicalCase, TestedConcept } from "./schema";
import { applyQuestionQualityRevisions, type QuestionQualityRevision } from "./question-quality-pilot-20261028";
import { QUESTION_QUALITY_ADVERSARIAL_R7_DEFINITIONS, QUESTION_QUALITY_ADVERSARIAL_R7_CONCEPT_VERSIONS } from "./question-quality-adversarial-r7-20261102-data";

type Node = SyntheticClinicalCase["decisionNodes"][number];
export interface QuestionQualityR7ConceptVersion extends TestedConcept, AuthoredClinicalRecord {
  previousConceptId: string;
  versioningReason: string;
  revisedItemIds: string[];
  educationalTier: 0 | 1;
  evidenceClaimIds: string[];
}
export interface QuestionQualityR7Revision extends QuestionQualityRevision {
  clinicalBinding: {
    previousConceptId: string;
    nextConceptId: string;
    previousKeyServiceId: string | null;
    nextKeyServiceId: string | null;
    previousResultGate: Node["resultGateAfter"];
    nextResultGate: Node["resultGateAfter"];
    reason: string;
  };
}
export const QUESTION_QUALITY_ADVERSARIAL_R7_REVISIONS: readonly QuestionQualityR7Revision[] = QUESTION_QUALITY_ADVERSARIAL_R7_DEFINITIONS;
export const QUESTION_QUALITY_ADVERSARIAL_R7_QUESTIONS = QUESTION_QUALITY_ADVERSARIAL_R7_REVISIONS.map(r => r.question);
export const QUESTION_QUALITY_ADVERSARIAL_R7_AUTHORING_CONCEPTS: readonly QuestionQualityR7ConceptVersion[] = QUESTION_QUALITY_ADVERSARIAL_R7_CONCEPT_VERSIONS;
export const QUESTION_QUALITY_ADVERSARIAL_R7_TESTED_CONCEPTS: TestedConcept[] = QUESTION_QUALITY_ADVERSARIAL_R7_AUTHORING_CONCEPTS.map(
  ({id, displayName, learningObjective, earliestFacilityStage, conceptType}) => ({id, displayName, learningObjective, earliestFacilityStage, conceptType}),
);

/** Explicit new-version projections; no saved case, old concept or queue rule is mutated. */
export function applyQuestionQualityAdversarialR7Revisions(cases: SyntheticClinicalCase[]): SyntheticClinicalCase[] {
  const definitions = QUESTION_QUALITY_ADVERSARIAL_R7_REVISIONS;
  const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
  const staged = cases.map(cs => ({...cs, decisionNodes: cs.decisionNodes.map(node => {
    const r = definitions.find(r => r.caseId === cs.id && r.nodeId === node.id);
    if (!r) return node;
    const b = r.clinicalBinding, key = node.answerChoices.find(c => c.isCorrect)!;
    if (node.primaryConceptId !== b.previousConceptId || (key.serviceRequest?.serviceId ?? null) !== b.previousKeyServiceId ||
        !same(node.resultGateAfter, b.previousResultGate)) throw new Error("Clinical version source binding changed: " + r.id);
    if (r.question.conceptId !== b.nextConceptId) throw new Error("Clinical concept projection changed: " + r.id);
    // The shared helper's wording-only guard sees the deliberately projected
    // keyed service. The full before/after contract above records this change.
    return {...node, answerChoices: node.answerChoices.map(c => c.isCorrect ? {
      ...c, serviceRequest: b.nextKeyServiceId === null ? null : {serviceId: b.nextKeyServiceId},
    } : c)};
  })}));
  return applyQuestionQualityRevisions(staged, definitions).map(cs => ({...cs,
    ...(definitions.some(r => r.caseId === cs.id) ? {learningSummary: cs.decisionNodes.map(n => n.explanation).join(" ")} : {}),
    decisionNodes: cs.decisionNodes.map(node => {
    const r = definitions.find(r => r.caseId === cs.id && r.nodeId === node.id);
    return r ? {...node, primaryConceptId: r.clinicalBinding.nextConceptId, resultGateAfter: r.clinicalBinding.nextResultGate} : node;
  })}));
}

export { QUESTION_QUALITY_ADVERSARIAL_R7_CLAIMS, QUESTION_QUALITY_ADVERSARIAL_R7_SOURCES } from "./question-quality-adversarial-r7-evidence-20261102";
