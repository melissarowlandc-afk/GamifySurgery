import type {AnswerChoiceTimingRegistryEntry,DecisionNode,SyntheticClinicalCase} from "./schema";
import {validateSyntheticClinicalRelease} from "./schema";
import {QUESTION_FLAGS4_DEFINITIONS,QUESTION_FLAGS4_HEADER as header} from "./question-flags4-20261108-data";
import {QUESTION_FLAGS4_RETAINED_INPUT,QUESTION_FLAGS4_RETAINED_TIMINGS} from "./question-flags4-retained-input-20261108";
import {QUESTION_FLAGS4_CLAIMS,QUESTION_FLAGS4_SOURCES} from "./question-flags4-evidence-20261108";

/** Direct-import authoring view only. No barrel, default release or acceptance. */
export const QUESTION_FLAGS4_SOURCE_VIEW_NAME="flags4-round1" as const;
export const QUESTION_FLAGS4_REVISIONS=QUESTION_FLAGS4_DEFINITIONS;
export const QUESTION_FLAGS4_QUESTIONS=QUESTION_FLAGS4_REVISIONS.map(r=>r.question);
const draft={contentVersion:"question-authoring.2026-11-08.flags4-r1",reviewStatus:"needs_clinician_review",aiAssistedDrafting:true,lastClinicianReview:null} as const;
const sourceLabels=QUESTION_FLAGS4_SOURCES.map(s=>s.title);
const revision=QUESTION_FLAGS4_REVISIONS[0]!;
const q=revision.question;
const choices=q.answerChoices.map(a=>({id:a.id,label:a.label,isCorrect:a.isCorrect,rationale:a.rationale!,serviceRequest:null}));
const node:DecisionNode={
 id:revision.nodeId,questionVariantId:q.id,primaryConceptId:q.conceptId,stem:q.stem,currentUpdate:revision.currentUpdate,
 answerChoices:choices,shuffleAnswers:true,explanation:q.explanation,teachingPoint:q.explanation,sourceLabels,resultGateAfter:null,
 terminalDispositions:choices.filter(a=>!a.isCorrect).map(a=>({answerChoiceId:a.id,kind:"no_terminal_outcome" as const,
  consequenceNarrative:"Review the phosphate-handling mechanism before continuing.",clinicalRationale:a.rationale,sourceLabels})),
};
const original=QUESTION_FLAGS4_RETAINED_INPUT.cases[0]!;
const {patientPresentationRevision:_oldRevision,selectedInstantiationProfileId:_oldSelection,...base}=original;
const demographics={ageYears:header.age,sexLabel:header.sex};
const presentationId="presentation.flags4.nutrition.metabolic-transition.20261108";
export const QUESTION_FLAGS4_CASES:SyntheticClinicalCase[]=[{
 ...base,patientDisplayName:header.patientName,patientPresentationVariantId:presentationId,
 prototypeDemographics:demographics,chiefComplaint:header.complaint,presentation:header.presentation,
 approvedInstantiationProfiles:[{id:"profile.flags4.nutrition.metabolic-transition.20261108",prototypeDemographics:demographics,
  prototypeVitalSigns:original.prototypeVitalSigns,chiefComplaint:header.complaint,presentation:header.presentation}],
 decisionNodes:[node],sourceLabels,learningSummary:q.explanation,
}];

/** Exact retained-input guard for authoring composition, never a gameplay gate. */
export function applyQuestionFlags4Revisions(cases:readonly SyntheticClinicalCase[]):SyntheticClinicalCase[]{
 for(const old of QUESTION_FLAGS4_RETAINED_INPUT.cases){
  if(JSON.stringify(cases.find(cs=>cs.id===old.id))!==JSON.stringify(old))throw Error("Flags4 retained input changed: "+old.id);
 }
 return cases.map(cs=>QUESTION_FLAGS4_CASES.find(candidate=>candidate.id===cs.id)??cs);
}
export const QUESTION_FLAGS4_SOURCE_RELEASE=validateSyntheticClinicalRelease({
 ...QUESTION_FLAGS4_RETAINED_INPUT,id:"clinical.flags4-retained-source.20261108.v1",
 cases:applyQuestionFlags4Revisions(QUESTION_FLAGS4_RETAINED_INPUT.cases),
});
export const QUESTION_FLAGS4_TIMING_ENTRIES:AnswerChoiceTimingRegistryEntry[]=[{
 caseId:original.id,nodeId:node.id,questionVariantId:node.questionVariantId,classification:{kind:"no_test"},
}];
export const QUESTION_FLAGS4_CANDIDATE_TEST_ORDER_RECORDS=[];
export const QUESTION_FLAGS4_CASE_REVIEWS=[{
 ...draft,id:"review.flags4.nutrition.metabolic-transition.20261108",caseId:original.id,educationalTier:0,acuity:"routine",
 earliestFacilityStage:original.earliestFacilityStage,evidenceClaimIds:q.supportingEvidenceClaimIds,
}];
export const QUESTION_FLAGS4_STATEMENT_MAPPINGS=[{
 ...draft,caseId:original.id,questionVariantId:q.id,
 fields:[
  {field:"presentation / currentUpdate",claimIds:[QUESTION_FLAGS4_CLAIMS[0]!.id],kind:"constructed qualitative observations",limitation:"Fictional adult course, not a diagnostic threshold, quantified feeding interval or proof of the exclusive cause."},
  {field:"stem / keyed option / keyed rationale",claimIds:[QUESTION_FLAGS4_CLAIMS[0]!.id],kind:"recorded physiology application",limitation:"Asks for the link to carbohydrate feeding, not the cause of every low phosphate result."},
  {field:"distractor labels / rationales",claimIds:[QUESTION_FLAGS4_CLAIMS[0]!.id],kind:"alternative process hypotheses",limitation:"Loss and reduced entry are contrasted with intracellular redistribution. No renal or intestinal disorder or its diagnostic criteria is asserted."},
  {field:"explanation sentence 1",claimIds:[QUESTION_FLAGS4_CLAIMS[0]!.id,QUESTION_FLAGS4_CLAIMS[1]!.id],kind:"recorded physiology synthesis",limitation:"Qualitative mechanism; no management recommendation."},
  {field:"explanation sentence 2",claimIds:[QUESTION_FLAGS4_CLAIMS[0]!.id],kind:"process comparison",limitation:"Different locations of phosphate handling, not additional diseases diagnosed in the case."},
  {field:"explanation sentence 3",claimIds:[QUESTION_FLAGS4_CLAIMS[2]!.id],kind:"diagnostic boundary",limitation:"Does not introduce a refeeding syndrome definition or diagnostic algorithm."},
 ],
 evidenceClaimIds:q.supportingEvidenceClaimIds,
 demographicBasis:"Canonical 31-year-old female profile and vitals retained; name is fictional. The preview fixes one consistent named profile; no sex-specific risk is inferred.",
}];
export const QUESTION_FLAGS4_SOURCE_LINKS=QUESTION_FLAGS4_SOURCES.map(s=>({
 ...draft,id:"link.flags4."+s.id.replace(/^source\./,""),sourceId:s.id,label:s.title,href:s.officialUrl!,
 target:"_blank",rel:"noopener noreferrer",referrerPolicy:"no-referrer",
}));
export {QUESTION_FLAGS4_CLAIMS,QUESTION_FLAGS4_BASIS_CLAIMS,QUESTION_FLAGS4_SOURCES,QUESTION_FLAGS4_CLAIM_PROVENANCE} from "./question-flags4-evidence-20261108";
export {QUESTION_FLAGS4_RETAINED_INPUT,QUESTION_FLAGS4_RETAINED_TIMINGS} from "./question-flags4-retained-input-20261108";
