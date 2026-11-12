import type {AnswerChoiceTimingRegistryEntry,DecisionNode,SyntheticClinicalCase,SyntheticClinicalRelease,TestedConcept} from "./schema";
import {validateSyntheticClinicalRelease} from "./schema";
import {QUESTION_FLAGS3_DEFINITIONS,QUESTION_FLAGS3_HEADERS,QUESTION_FLAGS3_AUTHORING_CONCEPTS} from "./question-flags3-20261107-data";
import {QUESTION_FLAGS3_RETAINED_INPUT,QUESTION_FLAGS3_RETAINED_TIMINGS} from "./question-flags3-retained-input-20261107";
import {QUESTION_FLAGS3_CLAIMS,QUESTION_FLAGS3_SOURCES} from "./question-flags3-evidence-20261107";

export const QUESTION_FLAGS3_SOURCE_VIEW_NAME="flags3-round1" as const;
export const QUESTION_FLAGS3_REVISIONS=QUESTION_FLAGS3_DEFINITIONS;
export const QUESTION_FLAGS3_QUESTIONS=QUESTION_FLAGS3_REVISIONS.map(r=>r.question);
export const QUESTION_FLAGS3_NEW_TESTED_CONCEPTS:TestedConcept[]=QUESTION_FLAGS3_AUTHORING_CONCEPTS.filter(c=>c.conceptMeaning!=="same").map(
 ({id,displayName,learningObjective,earliestFacilityStage,conceptType})=>({id,displayName,learningObjective,earliestFacilityStage,conceptType}),
);
const draft={contentVersion:"question-authoring.2026-11-07.flags3-r1",reviewStatus:"needs_clinician_review",aiAssistedDrafting:true,lastClinicianReview:null} as const;
const labels=(ids:string[])=>{const used=new Set(QUESTION_FLAGS3_CLAIMS.filter(c=>ids.includes(c.id)).flatMap(c=>c.sourceIds));return QUESTION_FLAGS3_SOURCES.filter(s=>used.has(s.id)).map(s=>s.title);};
const nodeFor=(id:string):DecisionNode=>{
 const r=QUESTION_FLAGS3_REVISIONS.find(r=>r.auditId===id)!,q=r.question,sourceLabels=labels(q.supportingEvidenceClaimIds);
 const choices=q.answerChoices.map(a=>({id:a.id,label:a.label,isCorrect:a.isCorrect,rationale:a.rationale??a.distractorRationale??q.explanation,serviceRequest:null}));
 return {id:r.nodeId,questionVariantId:q.id,primaryConceptId:q.conceptId,stem:q.stem,
  ...(r.currentUpdate?{currentUpdate:r.currentUpdate}:{}),...(q.exhibit?{exhibit:q.exhibit}:{}),answerChoices:choices,shuffleAnswers:true,
  explanation:q.explanation,teachingPoint:q.explanation,sourceLabels,resultGateAfter:null,
  terminalDispositions:(id==="F3-03-type"?[]:choices.filter(a=>!a.isCorrect)).map(a=>({answerChoiceId:a.id,kind:"no_terminal_outcome" as const,
   consequenceNarrative:"Review the interpretation before continuing.",clinicalRationale:a.rationale,sourceLabels})),
 };
};
export const QUESTION_FLAGS3_CASES:SyntheticClinicalCase[]=QUESTION_FLAGS3_HEADERS.map(h=>{
 const old=QUESTION_FLAGS3_RETAINED_INPUT.cases.find(c=>c.id===h.caseId)!;
 const {patientPresentationRevision:_oldRevision,selectedInstantiationProfileId:_selection,...base}=old;
 const nodes=h.caseId===QUESTION_FLAGS3_REVISIONS.find(r=>r.auditId==="F3-01")!.caseId?[nodeFor("F3-01")]:
  h.caseId===QUESTION_FLAGS3_REVISIONS.find(r=>r.auditId==="F3-02")!.caseId?[old.decisionNodes[0]!,nodeFor("F3-02")]:
  [nodeFor("F3-03-type"),nodeFor("F3-03")];
 const demographics={ageYears:h.age,sexLabel:h.sex};
 return {...base,patientDisplayName:h.patientName,prototypeDemographics:demographics,chiefComplaint:h.complaint,presentation:h.presentation,
  patientPresentationVariantId:"presentation.flags3."+h.caseId.replace(/^case\./,"")+".20261107",
  approvedInstantiationProfiles:[{id:"profile.flags3."+h.caseId.replace(/^case\./,"")+".20261107",prototypeDemographics:demographics,chiefComplaint:h.complaint,presentation:h.presentation}],
  decisionNodes:nodes,sourceLabels:[...new Set(nodes.flatMap(n=>n.sourceLabels))],learningSummary:nodes.map(n=>n.explanation).join(" ")};
});
/** Authoring-only exact input guard; never called by the default projection or
 * any player/save/admission path. No captured existing case is overwritten. */
export function applyQuestionFlags3Revisions(cases:readonly SyntheticClinicalCase[]):SyntheticClinicalCase[]{
 for(const old of QUESTION_FLAGS3_RETAINED_INPUT.cases){
  if(JSON.stringify(cases.find(c=>c.id===old.id))!==JSON.stringify(old))throw Error("Flags3 retained input changed: "+old.id);
 }
 return cases.map(cs=>QUESTION_FLAGS3_CASES.find(c=>c.id===cs.id)??cs);
}
export const QUESTION_FLAGS3_SOURCE_RELEASE=validateSyntheticClinicalRelease({
 ...QUESTION_FLAGS3_RETAINED_INPUT,id:"clinical.flags3-retained-source.20261107.v1",
 concepts:[...QUESTION_FLAGS3_RETAINED_INPUT.concepts,...QUESTION_FLAGS3_NEW_TESTED_CONCEPTS],
 cases:applyQuestionFlags3Revisions(QUESTION_FLAGS3_RETAINED_INPUT.cases),
});
export const QUESTION_FLAGS3_TIMING_ENTRIES:AnswerChoiceTimingRegistryEntry[]=QUESTION_FLAGS3_CASES.flatMap(cs=>cs.decisionNodes.map(n=>{
 const r=QUESTION_FLAGS3_REVISIONS.find(r=>r.questionVariantId===n.questionVariantId);
 if(!r)return QUESTION_FLAGS3_RETAINED_TIMINGS.find(t=>t.caseId===cs.id&&t.nodeId===n.id&&t.questionVariantId===n.questionVariantId)!;
 if(r.auditId!=="F3-02")return {caseId:cs.id,nodeId:n.id,questionVariantId:n.questionVariantId,classification:{kind:"no_test" as const}};
 const old=QUESTION_FLAGS3_RETAINED_TIMINGS.find(t=>t.caseId===cs.id&&t.nodeId===n.id)!;
 if(old.classification.kind!=="test_choices")throw Error("Missing retained dysphagia choice estimates");
 const timings=old.classification.choices;
 return {caseId:cs.id,nodeId:n.id,questionVariantId:n.questionVariantId,classification:{kind:"test_choices" as const,
  choices:n.answerChoices.map((c,j)=>({choiceId:c.id,choiceLabel:c.label,timing:timings[j]!.timing}))}};
}));
export const QUESTION_FLAGS3_CANDIDATE_TEST_ORDER_RECORDS=QUESTION_FLAGS3_TIMING_ENTRIES.flatMap(t=>{
 if(!QUESTION_FLAGS3_REVISIONS.some(r=>r.questionVariantId===t.questionVariantId)||t.classification.kind!=="test_choices")return [];
 return t.classification.choices.flatMap(c=>c.timing.kind==="test"?[{caseId:t.caseId,nodeId:t.nodeId,questionVariantId:t.questionVariantId,
  choiceId:c.choiceId,choiceLabel:c.choiceLabel,timingProfileId:c.timing.timingProfileId,disposition:{kind:"not_executed",reason:"future_planned"}}]:[]);
});
export const QUESTION_FLAGS3_CASE_REVIEWS=QUESTION_FLAGS3_CASES.map(cs=>({...draft,id:"review.flags3."+cs.id.replace(/^case\./,"")+".20261107",
 caseId:cs.id,educationalTier:1,acuity:"routine",earliestFacilityStage:cs.earliestFacilityStage,evidenceClaimIds:[...new Set(
  QUESTION_FLAGS3_REVISIONS.filter(r=>r.caseId===cs.id).flatMap(r=>r.question.supportingEvidenceClaimIds))]}));
export const QUESTION_FLAGS3_STATEMENT_MAPPINGS=QUESTION_FLAGS3_REVISIONS.map(r=>({...draft,caseId:r.caseId,questionVariantId:r.questionVariantId,
 fields:["presentation","currentUpdate","exhibit","stem","answerChoices.label","answerChoices.rationale","explanation"],
 evidenceClaimIds:r.question.supportingEvidenceClaimIds,constructedObservations:"Finite fictional patient findings and audit counts. They are not empirical test performance, risk estimates or universal cutoffs.",
 preservedContext:r.auditId==="F3-02"?"The existing first acquisition node, its feedback and result gate remain byte-exact; its original claims/timing/order bindings remain authoritative.":null}));
export const QUESTION_FLAGS3_SOURCE_LINKS=QUESTION_FLAGS3_SOURCES.filter(s=>s.officialUrl).map(s=>({...draft,id:"link.flags3."+s.id.replace(/^source\./,""),
 sourceId:s.id,label:s.title,href:s.officialUrl!,target:"_blank",rel:"noopener noreferrer",referrerPolicy:"no-referrer"}));
export {QUESTION_FLAGS3_AUTHORING_CONCEPTS} from "./question-flags3-20261107-data";
export {QUESTION_FLAGS3_CLAIMS,QUESTION_FLAGS3_SOURCES,QUESTION_FLAGS3_BASIS_CLAIMS,QUESTION_FLAGS3_CLAIM_PROVENANCE} from "./question-flags3-evidence-20261107";
export {QUESTION_FLAGS3_RETAINED_INPUT,QUESTION_FLAGS3_RETAINED_TIMINGS} from "./question-flags3-retained-input-20261107";
