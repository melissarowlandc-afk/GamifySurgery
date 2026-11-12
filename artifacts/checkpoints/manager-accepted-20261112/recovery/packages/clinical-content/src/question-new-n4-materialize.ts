import type {EvidenceClaim,QuestionVariant} from "./pilot-schema";
import type {SyntheticClinicalCase,TestedConcept,AnswerChoiceTimingRegistryEntry} from "./schema";
import {QUESTION_NEW_N4_DRAFT as draft,type N4Item} from "./question-new-n4-types";

/** Pure candidate construction. No import of default/catalog barrels and no
 * production registry mutation; accepted integration cannot create that cycle. */
export function materializeN4Item(item:N4Item,claims:EvidenceClaim[],sourceTitles:string[]) {
 const caseId=`case.n4.${item.slug}.v1`,nodeId=`node.n4.${item.slug}.v1`,questionId=`question.n4.${item.slug}.v1`;
 const text=(s:string)=>s.split(item.name).join("{patientName}");
 const mapped=item.basisClaimIds.map(id=>{
  const claim=claims.find(c=>c.id===id);
  if(!claim)throw new Error(`N4 draft missing evidence claim ${id}`);
  return claim.id;
 });
 const q:QuestionVariant={...draft,id:questionId,conceptId:item.conceptId,stem:text(item.task),exhibit:item.exhibit,
  answerChoices:item.choices.map((c,index)=>({id:`choice.n4.${item.slug}.${c.id}`,label:c.label,isCorrect:index===0,
   rationale:c.rationale,distractorRationale:index?c.rationale:null})),explanation:item.explanation,supportingEvidenceClaimIds:mapped};
 const pediatric=item.group==="pediatric"?{version:"pediatric-patient-profile.v1" as const,requiresParent:true as const,clinicalScope:"outpatient" as const}:undefined;
 const demographics={ageYears:item.age,sexLabel:item.sex};
 const cs:SyntheticClinicalCase={id:caseId,displayName:item.complaint,patientDisplayName:item.name,
  patientPresentationVariantId:`presentation.n4.${item.slug}.v1`,prototypeDemographics:demographics,
  chiefComplaint:item.complaint,presentation:text(item.presentation),...(pediatric?{pediatricProfile:pediatric}:{}),
  approvedInstantiationProfiles:[{id:`profile.n4.${item.slug}.v1`,prototypeDemographics:demographics,
   chiefComplaint:item.complaint,presentation:text(item.presentation),...(pediatric?{pediatricProfile:pediatric}:{})}],
  releasePointId:item.group==="intra_op"?"release.l3.ambulatory":item.group==="intra_endoscopy"?"release.l2.endoscopy":
   item.group==="pediatric"?"release.l4.pediatrics":"release.l4.wound-ostomy",
  tutorialEligible:false,routineEligible:true,earliestFacilityStage:item.stage,
  requiredClinicalSetting:item.group==="intra_op"?"ambulatory_surgery":item.group==="intra_endoscopy"?"endoscopy":"clinic",
  requiredCapabilityIds:item.group==="intra_op"?["capability.ambulatory_or","capability.staff.or_nurse","capability.periop_recovery"]:
   item.group==="intra_endoscopy"?["capability.endoscopy","capability.periop_recovery"]:
   item.group==="pediatric"?["capability.pediatric_examination"]:["capability.wound_ostomy_clinic"],
  rewardTierId:"reward.clinic_basic",sourceLabels:sourceTitles,learningSummary:q.explanation,
  decisionNodes:[{id:nodeId,questionVariantId:q.id,primaryConceptId:q.conceptId,stem:q.stem,exhibit:q.exhibit,
   answerChoices:q.answerChoices.map(c=>({id:c.id,label:c.label,isCorrect:c.isCorrect,rationale:c.rationale!,serviceRequest:null})),
   shuffleAnswers:true,explanation:q.explanation,sourceLabels:sourceTitles,resultGateAfter:null,
   terminalDispositions:q.answerChoices.filter(c=>!c.isCorrect).map(c=>({answerChoiceId:c.id,kind:"no_terminal_outcome" as const,
    consequenceNarrative:"Review the findings and care decision before continuing; no patient outcome is simulated.",
    clinicalRationale:c.rationale!,sourceLabels:sourceTitles}))}],
 };
 const timing:AnswerChoiceTimingRegistryEntry={caseId,nodeId,questionVariantId:q.id,
  classification:item.choices.some(c=>c.timingProfileId)?{kind:"test_choices",choices:q.answerChoices.map((c,index)=>({
   choiceId:c.id,choiceLabel:c.label,timing:item.choices[index]!.timingProfileId?
    {kind:"test" as const,timingProfileId:item.choices[index]!.timingProfileId!}:{kind:"no_test" as const},
  }))}:{kind:"no_test"}};
 const concept:TestedConcept={id:item.conceptId,displayName:item.complaint,learningObjective:item.objective,
  earliestFacilityStage:item.stage,conceptType:item.conceptType};
 return {clinicalCase:cs,question:q,timing,concept};
}
