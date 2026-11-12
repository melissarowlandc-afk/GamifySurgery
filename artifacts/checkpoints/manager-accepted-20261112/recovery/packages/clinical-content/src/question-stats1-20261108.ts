import type {SyntheticClinicalCase, AnswerChoiceTimingRegistryEntry} from "./schema";
import {validateSyntheticClinicalRelease} from "./schema";
import {QUESTION_STATS1_DEFINITIONS} from "./question-stats1-20261108-data";
import {QUESTION_STATS1_RETAINED_INPUT} from "./question-stats1-retained-input-20261108";
import {QUESTION_STATS1_CLAIMS, QUESTION_STATS1_SOURCES} from "./question-stats1-evidence-20261108";

export const QUESTION_STATS1_SOURCE_VIEW_NAME="stats1-round1" as const;
export const QUESTION_STATS1_REVISIONS=QUESTION_STATS1_DEFINITIONS;
export const QUESTION_STATS1_QUESTIONS=QUESTION_STATS1_REVISIONS.map(r=>r.question);
const draft={contentVersion:"question-authoring.2026-11-08.stats1-r1",reviewStatus:"needs_clinician_review",aiAssistedDrafting:true,lastClinicianReview:null} as const;
export const QUESTION_STATS1_CASES:SyntheticClinicalCase[]=QUESTION_STATS1_REVISIONS.map(r=>{
 const old=QUESTION_STATS1_RETAINED_INPUT.cases.find(cs=>cs.id===r.caseId)!;
 // Old clinical stories/profiles are retained in the input view, not mixed into
 // the new single-skill methods display. Participant and eligibility stay exact.
 const {patientPresentationRevision:_oldRevision,selectedInstantiationProfileId:_selection,...base}=old;
 const q=r.question,ids=new Set(QUESTION_STATS1_CLAIMS.filter(c=>q.supportingEvidenceClaimIds.includes(c.id)).flatMap(c=>c.sourceIds));
 const sourceLabels=QUESTION_STATS1_SOURCES.filter(s=>ids.has(s.id)).map(s=>s.title);
 const choices=q.answerChoices.map(a=>({id:a.id,label:a.label,isCorrect:a.isCorrect,rationale:a.rationale??a.distractorRationale??q.explanation,serviceRequest:null}));
 return {...base,displayName:"Statistics practice",patientDisplayName:r.patientName,chiefComplaint:"Study data",presentation:r.presentation,
  patientPresentationVariantId:"presentation.stats1."+r.auditId.toLowerCase()+".20261108.v1",
  approvedInstantiationProfiles:[{id:"profile.stats1."+r.auditId.toLowerCase()+".20261108.v1",
   ...(r.demographics?{prototypeDemographics:r.demographics}:{}),chiefComplaint:"Study data",presentation:r.presentation}],
  decisionNodes:[{id:r.nodeId,questionVariantId:q.id,primaryConceptId:q.conceptId,stem:q.stem,exhibit:q.exhibit,
   answerChoices:choices,shuffleAnswers:true,explanation:q.explanation,teachingPoint:q.explanation,sourceLabels,resultGateAfter:null,
   terminalDispositions:choices.filter(a=>!a.isCorrect).map(a=>({answerChoiceId:a.id,kind:"no_terminal_outcome" as const,
    consequenceNarrative:"Review the statistical method before continuing.",clinicalRationale:a.rationale,sourceLabels})),
  }],sourceLabels,learningSummary:q.explanation};
});
/** Explicit authoring projection only. No default, manifest, runtime gate or
 * frozen encounter uses this function. Refuse drift from the exact intake. */
export function applyQuestionStats1Revisions(cases:readonly SyntheticClinicalCase[]):SyntheticClinicalCase[]{
 for(const original of QUESTION_STATS1_RETAINED_INPUT.cases){
  if(JSON.stringify(cases.find(cs=>cs.id===original.id))!==JSON.stringify(original))throw Error("Stats1 retained input changed: "+original.id);
 }
 return cases.map(cs=>QUESTION_STATS1_CASES.find(candidate=>candidate.id===cs.id)??cs);
}
export const QUESTION_STATS1_SOURCE_RELEASE=validateSyntheticClinicalRelease({
 ...QUESTION_STATS1_RETAINED_INPUT,id:"clinical.stats1-retained-source.20261108.v1",cases:applyQuestionStats1Revisions(QUESTION_STATS1_RETAINED_INPUT.cases),
});
/** Statistical procedures are analysis choices, not patient testing orders. */
export const QUESTION_STATS1_TIMING_ENTRIES:AnswerChoiceTimingRegistryEntry[]=QUESTION_STATS1_REVISIONS.map(r=>({
 caseId:r.caseId,nodeId:r.nodeId,questionVariantId:r.questionVariantId,classification:{kind:"no_test"},
}));
export const QUESTION_STATS1_STATEMENT_MAPPINGS=QUESTION_STATS1_REVISIONS.map(r=>({...draft,caseId:r.caseId,questionVariantId:r.questionVariantId,
 fields:["presentation","exhibit","stem","answerChoices.rationale","explanation"],evidenceClaimIds:r.question.supportingEvidenceClaimIds,
 construction:"Every displayed study count, rate, interval, calibration difference, design and assumption is an original constructed exercise, not empirical clinical performance or a treatment recommendation.",
 identity:"Unchanged stable concept; older exact questions, cases, timing and FSRS cards remain retained. No default acceptance."}));
export const QUESTION_STATS1_CASE_REVIEWS=QUESTION_STATS1_REVISIONS.map(r=>({...draft,id:"review.stats1."+r.auditId.toLowerCase()+".20261108",caseId:r.caseId,
 educationalTier:1,earliestFacilityStage:QUESTION_STATS1_RETAINED_INPUT.cases.find(cs=>cs.id===r.caseId)!.earliestFacilityStage,
 evidenceClaimIds:r.question.supportingEvidenceClaimIds,educationalIntent:r.educationalIntent}));
export {QUESTION_STATS1_AUTHORING_CONCEPTS} from "./question-stats1-20261108-data";
export {QUESTION_STATS1_CLAIMS,QUESTION_STATS1_SOURCES,QUESTION_STATS1_BASIS_CLAIMS,QUESTION_STATS1_SOURCE_LINKS} from "./question-stats1-evidence-20261108";
export {QUESTION_STATS1_RETAINED_INPUT,QUESTION_STATS1_RETAINED_TIMINGS} from "./question-stats1-retained-input-20261108";
