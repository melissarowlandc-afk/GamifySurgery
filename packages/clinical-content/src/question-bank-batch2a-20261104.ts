import type { SyntheticClinicalCase, TestedConcept } from "./schema";
import type { QuestionQualityR7Revision, QuestionQualityR7ConceptVersion } from "./question-quality-adversarial-r7-20261102";
import { applyQuestionQualityRevisions } from "./question-quality-pilot-20261028";
import { QUESTION_BANK_BATCH2A_DEFINITIONS, QUESTION_BANK_BATCH2A_CONCEPT_VERSIONS } from "./question-bank-batch2a-20261104-data";

export interface QuestionBankBatch2aRevision extends QuestionQualityR7Revision {
  ownerProgramReview: { ownerItemId: string; reviewedOn: string; whatChanged: string; status: "awaiting_independent_and_clinician_review" };
}
export const QUESTION_BANK_BATCH2A_REVISIONS: readonly QuestionBankBatch2aRevision[] = QUESTION_BANK_BATCH2A_DEFINITIONS;
export const QUESTION_BANK_BATCH2A_QUESTIONS = QUESTION_BANK_BATCH2A_REVISIONS.map(r=>r.question);
export const QUESTION_BANK_BATCH2A_AUTHORING_CONCEPTS: readonly QuestionQualityR7ConceptVersion[] = QUESTION_BANK_BATCH2A_CONCEPT_VERSIONS;
export const QUESTION_BANK_BATCH2A_TESTED_CONCEPTS: TestedConcept[] = QUESTION_BANK_BATCH2A_AUTHORING_CONCEPTS.map(
  ({id,displayName,learningObjective,earliestFacilityStage,conceptType})=>({id,displayName,learningObjective,earliestFacilityStage,conceptType}),
);

/** Versioned fresh-case projections; saved/frozen cases and old cards stay intact. */
export function applyQuestionBankBatch2aRevisions(cases:SyntheticClinicalCase[],definitions=QUESTION_BANK_BATCH2A_REVISIONS):SyntheticClinicalCase[]{
  for(const r of definitions){
    const n=cases.find(c=>c.id===r.caseId)?.decisionNodes.find(n=>n.id===r.nodeId);
    if(!n||n.primaryConceptId!==r.clinicalBinding.previousConceptId||
      (n.answerChoices.find(c=>c.isCorrect)?.serviceRequest?.serviceId??null)!==r.clinicalBinding.previousKeyServiceId||
      JSON.stringify(n.resultGateAfter)!==JSON.stringify(r.clinicalBinding.previousResultGate))
      throw new Error("Question-bank batch-2a clinical binding changed: "+r.id);
  }
  const staged=cases.map(cs=>({...cs,decisionNodes:cs.decisionNodes.map(n=>{
    const r=definitions.find(r=>r.caseId===cs.id&&r.nodeId===n.id);
    if(!r)return n;
    return {...n,answerChoices:n.answerChoices.map(c=>c.isCorrect?{...c,serviceRequest:r.clinicalBinding.nextKeyServiceId===null?null:{serviceId:r.clinicalBinding.nextKeyServiceId}}:c)};
  })}));
  return applyQuestionQualityRevisions(staged,definitions).map(cs=>{
    const rr=definitions.filter(r=>r.caseId===cs.id);if(!rr.length)return cs;
    const nodes=cs.decisionNodes.map(n=>{
      const r=rr.find(r=>r.nodeId===n.id);
      return r?{...n,primaryConceptId:r.clinicalBinding.nextConceptId,resultGateAfter:r.clinicalBinding.nextResultGate}:n;
    });
    return {...cs,decisionNodes:nodes,learningSummary:nodes.map(n=>n.explanation).join(" ")};
  });
}
