import type { SyntheticClinicalCase, TestedConcept } from "./schema";
import { applyQuestionQualityRevisions } from "./question-quality-pilot-20261028";
import type { QuestionQualityR7Revision, QuestionQualityR7ConceptVersion } from "./question-quality-adversarial-r7-20261102";
import { QUESTION_FLAG_DEFINITIONS, QUESTION_FLAG_CONCEPT_VERSIONS } from "./question-flags-20261104-data";

export interface QuestionFlagRevision extends QuestionQualityR7Revision {
  flagReview: {
    flagIds: string[];
    reviewedOn: string;
    whatChanged: string;
    scopeDecision?: string;
    sourceDecision?: string;
    sourceVerificationHold?: string;
    retirementProposal?: string;
    status: "awaiting_independent_and_clinician_review";
  };
}
export interface QuestionFlagConceptVersion extends QuestionQualityR7ConceptVersion {}
export const QUESTION_FLAG_REVISIONS: readonly QuestionFlagRevision[] = QUESTION_FLAG_DEFINITIONS;
export const QUESTION_FLAG_QUESTIONS = QUESTION_FLAG_REVISIONS.map(r => r.question);
export const QUESTION_FLAG_AUTHORING_CONCEPTS: readonly QuestionFlagConceptVersion[] = QUESTION_FLAG_CONCEPT_VERSIONS;
export const QUESTION_FLAG_TESTED_CONCEPTS: TestedConcept[] = QUESTION_FLAG_AUTHORING_CONCEPTS.map(
  ({id, displayName, learningObjective, earliestFacilityStage, conceptType}) => ({id, displayName, learningObjective, earliestFacilityStage, conceptType}),
);

/** Fresh-case projections only: no saved encounter, archived question, choice
 * order, selector, review event or evidence binding is rewritten. */
export function applyQuestionFlagRevisions(cases: SyntheticClinicalCase[]): SyntheticClinicalCase[] {
  for (const r of QUESTION_FLAG_REVISIONS) {
    const n=cases.find(c=>c.id===r.caseId)?.decisionNodes.find(n=>n.id===r.nodeId);
    if (!n || n.primaryConceptId!==r.clinicalBinding.previousConceptId ||
      JSON.stringify(n.resultGateAfter)!==JSON.stringify(r.clinicalBinding.previousResultGate))
      throw new Error("Question flag clinical binding changed: "+r.id);
  }
  return applyQuestionQualityRevisions(cases, QUESTION_FLAG_REVISIONS).map(cs=>{
    const revisions=QUESTION_FLAG_REVISIONS.filter(r=>r.caseId===cs.id);
    if(!revisions.length)return cs;
    const nodes=cs.decisionNodes.map(n=>{
      const r=revisions.find(r=>r.nodeId===n.id);
      return r?{...n,primaryConceptId:r.clinicalBinding.nextConceptId}:n;
    });
    return {...cs,decisionNodes:nodes,learningSummary:nodes.map(n=>n.explanation).join(" ")};
  });
}
