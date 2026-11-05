import type { SyntheticClinicalCase, TestedConcept } from "./schema";
import type { QuestionFlagRevision, QuestionFlagConceptVersion } from "./question-flags-20261104";
import { applyQuestionQualityRevisions } from "./question-quality-pilot-20261028";
import { QUESTION_FLAG_ROUND2_DEFINITIONS, QUESTION_FLAG_ROUND2_CONCEPT_VERSIONS } from "./question-flags-round2-20261104-data";

export const QUESTION_FLAG_ROUND2_REVISIONS: readonly QuestionFlagRevision[] = QUESTION_FLAG_ROUND2_DEFINITIONS;
export const QUESTION_FLAG_ROUND2_QUESTIONS = QUESTION_FLAG_ROUND2_REVISIONS.map(r=>r.question);
export const QUESTION_FLAG_ROUND2_AUTHORING_CONCEPTS: readonly QuestionFlagConceptVersion[] = QUESTION_FLAG_ROUND2_CONCEPT_VERSIONS;
export const QUESTION_FLAG_ROUND2_TESTED_CONCEPTS: TestedConcept[] = QUESTION_FLAG_ROUND2_AUTHORING_CONCEPTS.map(
  ({id,displayName,learningObjective,earliestFacilityStage,conceptType})=>({id,displayName,learningObjective,earliestFacilityStage,conceptType}),
);

/** Fresh projections only. Historical questions, encounters and review events
 * remain untouched; a new construct never adopts an earlier card history. */
export function applyQuestionFlagRound2Revisions(cases:SyntheticClinicalCase[]):SyntheticClinicalCase[]{
  for(const r of QUESTION_FLAG_ROUND2_REVISIONS){
    const n=cases.find(c=>c.id===r.caseId)?.decisionNodes.find(n=>n.id===r.nodeId);
    if(!n||n.primaryConceptId!==r.clinicalBinding.previousConceptId||
      JSON.stringify(n.resultGateAfter)!==JSON.stringify(r.clinicalBinding.previousResultGate))
      throw new Error("Question flag round-two clinical binding changed: "+r.id);
  }
  return applyQuestionQualityRevisions(cases,QUESTION_FLAG_ROUND2_REVISIONS).map(cs=>{
    const rr=QUESTION_FLAG_ROUND2_REVISIONS.filter(r=>r.caseId===cs.id);if(!rr.length)return cs;
    const decisionNodes=cs.decisionNodes.map(n=>{const r=rr.find(r=>r.nodeId===n.id);return r?{...n,primaryConceptId:r.clinicalBinding.nextConceptId}:n;});
    return {...cs,decisionNodes,learningSummary:decisionNodes.map(n=>n.explanation).join(" ")};
  });
}
