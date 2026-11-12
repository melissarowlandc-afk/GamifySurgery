import {validateSyntheticClinicalRelease,type SyntheticClinicalCase,type DecisionNode,type AnswerChoiceTimingRegistryEntry} from "./schema";
import {QUESTION_HARDEN1_SOURCE_RELEASE} from "./question-harden1-20261110";
import {QUESTION_HARDEN1_RETAINED_INPUT} from "./question-harden1-retained-input-20261110";
import {QUESTION_HARDEN1_ROUND2_QUESTION as q,QUESTION_HARDEN1_ROUND2_CONCEPT as concept,QUESTION_HARDEN1_ROUND2_DEFINITION as def,QUESTION_HARDEN1_ROUND2_SOURCES as sources} from "./question-harden1-round2-20261110-data";
/** Direct-import preview only. No barrel, manifest, catalog or default insertion. */
export const QUESTION_HARDEN1_ROUND2_SOURCE_VIEW_NAME="harden1-round2" as const;
const original=QUESTION_HARDEN1_RETAINED_INPUT.cases[0]!;
const {selectedInstantiationProfileId:_selection,patientPresentationRevision:_revision,...base}=original;
const sourceLabels=sources.map(s=>s.title);
const answerChoices=q.answerChoices.map(a=>({id:a.id,label:a.label,isCorrect:a.isCorrect,rationale:a.rationale!,serviceRequest:null}));
const node:DecisionNode={id:def.nodeId,questionVariantId:q.id,primaryConceptId:q.conceptId,stem:q.stem,exhibit:q.exhibit!,
 answerChoices,shuffleAnswers:true,explanation:q.explanation,teachingPoint:q.explanation,sourceLabels,resultGateAfter:null,
 terminalDispositions:answerChoices.filter(a=>!a.isCorrect).map(a=>({answerChoiceId:a.id,kind:"no_terminal_outcome" as const,
 consequenceNarrative:"Review the marked compartment and its observation boundary.",clinicalRationale:a.rationale,sourceLabels}))};
const prototypeDemographics={ageYears:def.header.age,sexLabel:def.header.sex};
export const QUESTION_HARDEN1_ROUND2_CASES:SyntheticClinicalCase[]=[{...base,id:def.caseId,displayName:concept.displayName,
 patientDisplayName:def.header.patientName,prototypeDemographics,chiefComplaint:def.header.complaint,presentation:def.header.presentation,
 patientPresentationVariantId:"presentation.harden1r2.20261110.groin",tutorialEligible:false,
 approvedInstantiationProfiles:[{id:"profile.harden1r2.20261110.groin",prototypeDemographics,prototypeVitalSigns:original.prototypeVitalSigns,chiefComplaint:def.header.complaint,presentation:def.header.presentation}],
 decisionNodes:[node],sourceLabels,learningSummary:q.explanation}];
export const QUESTION_HARDEN1_ROUND2_SOURCE_RELEASE=validateSyntheticClinicalRelease({...QUESTION_HARDEN1_SOURCE_RELEASE,
 id:"clinical.harden1-retained-source.20261110.r2",concepts:[...QUESTION_HARDEN1_SOURCE_RELEASE.concepts,{id:concept.id,displayName:concept.displayName,
 learningObjective:concept.learningObjective,earliestFacilityStage:concept.earliestFacilityStage,conceptType:concept.conceptType}],cases:QUESTION_HARDEN1_ROUND2_CASES});
export const QUESTION_HARDEN1_ROUND2_TIMING_ENTRIES:AnswerChoiceTimingRegistryEntry[]=[{caseId:def.caseId,nodeId:def.nodeId,questionVariantId:q.id,classification:{kind:"no_test"}}];
export const QUESTION_HARDEN1_ROUND2_REVIEWS=[{contentVersion:q.contentVersion,reviewStatus:q.reviewStatus,aiAssistedDrafting:true,lastClinicianReview:null,
 id:"review.harden1r2.groin",caseId:def.caseId,educationalTier:1,acuity:"routine",earliestFacilityStage:1,evidenceClaimIds:q.supportingEvidenceClaimIds}];
export const QUESTION_HARDEN1_ROUND2_SOURCE_LINKS=sources.map(s=>({sourceId:s.id,label:s.title,href:s.officialUrl!,target:"_blank",rel:"noopener noreferrer",referrerPolicy:"no-referrer"}));
export {QUESTION_HARDEN1_ROUND2_QUESTION,QUESTION_HARDEN1_ROUND2_CONCEPT,QUESTION_HARDEN1_ROUND2_DEFINITION,
 QUESTION_HARDEN1_ROUND2_CLAIMS,QUESTION_HARDEN1_ROUND2_BASIS_CLAIMS,QUESTION_HARDEN1_ROUND2_SOURCES} from "./question-harden1-round2-20261110-data";
