import type {AnswerChoiceTimingRegistryEntry,DecisionNode,SyntheticClinicalCase,SyntheticClinicalRelease} from "./schema";
import {validateSyntheticClinicalRelease} from "./schema";
import {QUESTION_HARDEN1_DEFINITIONS} from "./question-harden1-20261110-data";
import {QUESTION_HARDEN1_RETAINED_INPUT} from "./question-harden1-retained-input-20261110";
import {QUESTION_HARDEN1_SOURCES} from "./question-harden1-evidence-20261110";

/** Direct-import authoring preview. No barrel, default registry or acceptance. */
export const QUESTION_HARDEN1_SOURCE_VIEW_NAME="harden1-round1" as const;
export const QUESTION_HARDEN1_REVISIONS=QUESTION_HARDEN1_DEFINITIONS;
export const QUESTION_HARDEN1_QUESTIONS=QUESTION_HARDEN1_DEFINITIONS.map(r=>r.question);
export const QUESTION_HARDEN1_CONCEPTS=QUESTION_HARDEN1_DEFINITIONS.map(r=>r.concept);
const draft={contentVersion:"question-authoring.2026-11-10.harden1-r1",reviewStatus:"needs_clinician_review",aiAssistedDrafting:true,lastClinicianReview:null} as const;
export const QUESTION_HARDEN1_CASES:SyntheticClinicalCase[]=QUESTION_HARDEN1_DEFINITIONS.map((r,i)=>{
 const original=QUESTION_HARDEN1_RETAINED_INPUT.cases[i]!;
 const {selectedInstantiationProfileId:_selection,patientPresentationRevision:_revision,...base}=original;
 const q=r.question;
 const sourceLabels=QUESTION_HARDEN1_SOURCES.filter(s=>s.evidenceClaimIds.some(id=>q.supportingEvidenceClaimIds.includes(id))).map(s=>s.title);
 const choices=q.answerChoices.map(a=>({id:a.id,label:a.label,isCorrect:a.isCorrect,rationale:a.rationale!,serviceRequest:null}));
 const node:DecisionNode={id:r.nodeId,questionVariantId:q.id,primaryConceptId:q.conceptId,stem:q.stem,
  ...(r.currentUpdate?{currentUpdate:r.currentUpdate}:{}),...(q.exhibit?{exhibit:q.exhibit}:{}),answerChoices:choices,
  shuffleAnswers:true,explanation:q.explanation,teachingPoint:q.explanation,sourceLabels,resultGateAfter:null,
  terminalDispositions:choices.filter(a=>!a.isCorrect).map(a=>({answerChoiceId:a.id,kind:"no_terminal_outcome" as const,
   consequenceNarrative:"Review the interpretation and its consequence before continuing.",clinicalRationale:a.rationale,sourceLabels})),
 };
 const demographics={ageYears:r.header.age,sexLabel:r.header.sex};
 return {...base,id:r.caseId,displayName:r.concept.displayName,patientDisplayName:r.header.patientName,
  patientPresentationVariantId:"presentation.harden1.20261110."+(i===0?"groin":"phosphate"),prototypeDemographics:demographics,
  chiefComplaint:r.header.complaint,presentation:r.header.presentation,
  approvedInstantiationProfiles:[{id:"profile.harden1.20261110."+(i===0?"groin":"phosphate"),prototypeDemographics:demographics,
   prototypeVitalSigns:original.prototypeVitalSigns,chiefComplaint:r.header.complaint,presentation:r.header.presentation}],
  tutorialEligible:false,decisionNodes:[node],sourceLabels,learningSummary:q.explanation};
});
const tested=(concept:SyntheticClinicalRelease["concepts"][number])=>({id:concept.id,displayName:concept.displayName,learningObjective:concept.learningObjective,
 earliestFacilityStage:concept.earliestFacilityStage,conceptType:concept.conceptType});
export const QUESTION_HARDEN1_SOURCE_RELEASE=validateSyntheticClinicalRelease({
 ...QUESTION_HARDEN1_RETAINED_INPUT,id:"clinical.harden1-retained-source.20261110.v1",
 concepts:[...QUESTION_HARDEN1_RETAINED_INPUT.concepts,...QUESTION_HARDEN1_CONCEPTS.map(tested)],cases:QUESTION_HARDEN1_CASES,
});
export const QUESTION_HARDEN1_TIMING_ENTRIES:AnswerChoiceTimingRegistryEntry[]=QUESTION_HARDEN1_CASES.map(cs=>({
 caseId:cs.id,nodeId:cs.decisionNodes[0]!.id,questionVariantId:cs.decisionNodes[0]!.questionVariantId,classification:{kind:"no_test"},
}));
export const QUESTION_HARDEN1_CANDIDATE_TEST_ORDER_RECORDS=[];
export const QUESTION_HARDEN1_CASE_REVIEWS=QUESTION_HARDEN1_DEFINITIONS.map(r=>({...draft,id:"review.harden1."+r.auditId.toLowerCase(),
 caseId:r.caseId,educationalTier:r.educationalTier,acuity:r.acuity,earliestFacilityStage:r.concept.earliestFacilityStage,
 evidenceClaimIds:r.question.supportingEvidenceClaimIds}));
export const QUESTION_HARDEN1_SOURCE_LINKS=QUESTION_HARDEN1_SOURCES.map(s=>({...draft,id:"link.harden1."+s.id.replace(/^source\./,""),
 sourceId:s.id,label:s.title,href:s.officialUrl!,target:"_blank",rel:"noopener noreferrer",referrerPolicy:"no-referrer"}));
export {QUESTION_HARDEN1_STATEMENT_MAPPINGS} from "./question-harden1-20261110-data";
export {QUESTION_HARDEN1_CLAIMS,QUESTION_HARDEN1_BASIS_CLAIMS,QUESTION_HARDEN1_SOURCES} from "./question-harden1-evidence-20261110";
export {QUESTION_HARDEN1_RETAINED_INPUT,QUESTION_HARDEN1_RETAINED_TIMINGS} from "./question-harden1-retained-input-20261110";
