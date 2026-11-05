import type { QuestionVariant } from "./pilot-schema";
import type { AnswerChoiceTimingRegistryEntry, SyntheticClinicalCase, TestedConcept } from "./schema";
import { QUESTION_NEW_N2_PERIOPERATIVE } from "./question-new-n2-perioperative";
import { QUESTION_NEW_N2_ABDOMINAL } from "./question-new-n2-abdominal";
import { QUESTION_NEW_N2_SPECIALTY } from "./question-new-n2-specialty";
import { QUESTION_NEW_N2_RESEARCH } from "./question-new-n2-research";
import { QUESTION_NEW_N2_CLAIMS, QUESTION_NEW_N2_CLAIM_PROVENANCE, QUESTION_NEW_N2_SOURCES } from "./question-new-n2-evidence-20261104";
import { QUESTION_NEW_N2_DRAFT, QUESTION_NEW_N2_VERSION } from "./question-new-n2-types";

export const QUESTION_NEW_N2_ITEMS = [...QUESTION_NEW_N2_PERIOPERATIVE, ...QUESTION_NEW_N2_ABDOMINAL, ...QUESTION_NEW_N2_SPECIALTY, ...QUESTION_NEW_N2_RESEARCH];
export { QUESTION_NEW_N2_CLAIMS, QUESTION_NEW_N2_CLAIM_PROVENANCE, QUESTION_NEW_N2_SOURCES };
const patientTemplate = (text: string, name: string) => text.split(name).join("{patientName}");
function claimsFor(ids: readonly string[]): string[] {
  return ids.map(id => {
    const record = QUESTION_NEW_N2_CLAIM_PROVENANCE.find(p => p.inheritedClaimId === id);
    if (!record) throw new Error(`N2 has no recorded evidence mapping for ${id}`);
    return record.claimId;
  });
}
export const QUESTION_NEW_N2_AUTHORING_CONCEPTS = QUESTION_NEW_N2_ITEMS.map(item => ({
  ...QUESTION_NEW_N2_DRAFT, id: item.conceptId, displayName: item.displayName, learningObjective: item.learningObjective,
  conceptType: item.conceptType, earliestFacilityStage: item.level, educationalTier: item.educationalTier,
  acuity: item.acuity, requiredCapabilityIds: [] as string[], evidenceClaimIds: claimsFor(item.existingClaimIds),
  identityBasis: item.identityBasis, nearestExistingConceptIds: item.nearestExistingConceptIds, novelty: item.novelty,
  constructReviewStatus: "pending_independent_novelty_and_overlap_review" as const,
}));
export const QUESTION_NEW_N2_TESTED_CONCEPTS: TestedConcept[] = QUESTION_NEW_N2_AUTHORING_CONCEPTS.map(c => ({
  id: c.id, displayName: c.displayName, learningObjective: c.learningObjective, conceptType: c.conceptType, earliestFacilityStage: c.earliestFacilityStage,
}));
export const QUESTION_NEW_N2_QUESTIONS: QuestionVariant[] = QUESTION_NEW_N2_ITEMS.map(item => ({
  ...QUESTION_NEW_N2_DRAFT, id: `question.n2.${item.slug}.v1`, conceptId: item.conceptId,
  stem: patientTemplate(item.stem, item.patientName),
  answerChoices: item.choices.map((choice, index) => ({ id: `choice.n2.${item.slug}.${choice.id}`,
    label: choice.label, isCorrect: index === 0, rationale: choice.rationale, distractorRationale: index === 0 ? null : choice.rationale })),
  explanation: item.explanation, ...(item.exhibit ? { exhibit: item.exhibit } : {}), supportingEvidenceClaimIds: claimsFor(item.existingClaimIds),
}));
export const QUESTION_NEW_N2_CASES: SyntheticClinicalCase[] = QUESTION_NEW_N2_ITEMS.map((item, i) => {
  const question = QUESTION_NEW_N2_QUESTIONS[i]!;
  const sourceIds = [...new Set(QUESTION_NEW_N2_CLAIMS.filter(c => question.supportingEvidenceClaimIds.includes(c.id)).flatMap(c => c.sourceIds))];
  const sourceLabels = sourceIds.map(id => QUESTION_NEW_N2_SOURCES.find(s => s.id === id)!.title);
  const demographics = {ageYears:item.age, sexLabel:item.sex};
  const presentation = patientTemplate(item.presentation, item.patientName);
  return {
    id:`case.n2.${item.slug}.v1`,displayName:item.displayName,
    patientPresentationVariantId:`presentation.n2.${item.slug}.v1`,releasePointId:"release.l3.ambulatory_or_qi",
    patientDisplayName:item.patientName,prototypeDemographics:demographics,chiefComplaint:item.complaint,presentation,
    approvedInstantiationProfiles:[{id:`profile.n2.${item.slug}.v1`,prototypeDemographics:demographics,chiefComplaint:item.complaint,presentation}],
    tutorialEligible:false,routineEligible:true,earliestFacilityStage:item.level,requiredClinicalSetting:"clinic",requiredCapabilityIds:[],rewardTierId:"reward.clinic_basic",sourceLabels,
    decisionNodes:[{id:`node.n2.${item.slug}.v1`,questionVariantId:question.id,primaryConceptId:item.conceptId,stem:question.stem,
      answerChoices:question.answerChoices.map(c=>({id:c.id,label:c.label,isCorrect:c.isCorrect,rationale:c.rationale!,serviceRequest:null})),
      shuffleAnswers:true,explanation:question.explanation,...(item.exhibit?{exhibit:item.exhibit}:{}),sourceLabels,resultGateAfter:null,
      terminalDispositions:question.answerChoices.filter(c=>!c.isCorrect).map(c=>({answerChoiceId:c.id,kind:"no_terminal_outcome" as const,
        consequenceNarrative:"This draft ends with feedback on the selected interpretation or plan; no clinical outcome is simulated.",clinicalRationale:c.rationale!,sourceLabels})),
    }],learningSummary:question.explanation,
  };
});
export const QUESTION_NEW_N2_TIMING_ENTRIES: AnswerChoiceTimingRegistryEntry[] = QUESTION_NEW_N2_CASES.map((clinicalCase,i) => {
  const node=clinicalCase.decisionNodes[0]!,item=QUESTION_NEW_N2_ITEMS[i]!;
  return {caseId:clinicalCase.id,nodeId:node.id,questionVariantId:node.questionVariantId,
    classification:item.choices.some(c=>c.timingProfileId)?{kind:"test_choices",choices:node.answerChoices.map((choice,j)=>({choiceId:choice.id,choiceLabel:choice.label,
      timing:item.choices[j]!.timingProfileId?{kind:"test",timingProfileId:item.choices[j]!.timingProfileId!}:{kind:"no_test"}}))}:{kind:"no_test"}};
});
export const QUESTION_NEW_N2_CASE_REVIEWS = QUESTION_NEW_N2_CASES.map((clinicalCase,i) => ({
  ...QUESTION_NEW_N2_DRAFT,id:`review.n2.${QUESTION_NEW_N2_ITEMS[i]!.slug}.v1`,caseId:clinicalCase.id,
  educationalTier:1 as const,acuity:QUESTION_NEW_N2_ITEMS[i]!.acuity,earliestFacilityStage:clinicalCase.earliestFacilityStage,
  evidenceClaimIds:QUESTION_NEW_N2_QUESTIONS[i]!.supportingEvidenceClaimIds,
}));
export const QUESTION_NEW_N2_STATEMENT_MAPPINGS = QUESTION_NEW_N2_CASES.map((clinicalCase,i) => ({
  ...QUESTION_NEW_N2_DRAFT,caseId:clinicalCase.id,questionVariantId:clinicalCase.decisionNodes[0]!.questionVariantId,
  fields:["presentation","decisionNodes[0].stem","decisionNodes[0].exhibit","decisionNodes[0].explanation","learningSummary",
    ...clinicalCase.decisionNodes[0]!.answerChoices.flatMap((_,j)=>[`decisionNodes[0].answerChoices[${j}].label`,`decisionNodes[0].answerChoices[${j}].rationale`])],
  evidenceClaimIds:QUESTION_NEW_N2_QUESTIONS[i]!.supportingEvidenceClaimIds,
  constructedDataBasis:"Finite fictional observations/datasets for application; not empirical probabilities, demographic disease weights, guideline thresholds or actual service durations.",
}));
export const QUESTION_NEW_N2_SOURCE_LINKS = QUESTION_NEW_N2_SOURCES.filter(s=>s.officialUrl).map(s=>({
  ...QUESTION_NEW_N2_DRAFT,id:`link.n2.${s.id.replace(/^source\./,"")}`,sourceId:s.id,label:s.title,href:s.officialUrl!,target:"_blank",rel:"noopener noreferrer",referrerPolicy:"no-referrer",
}));
export const QUESTION_NEW_N2_BATCH_MANIFEST = {
  ...QUESTION_NEW_N2_DRAFT,id:"batch.question-new-n2.2026-11-04",contentVersion:QUESTION_NEW_N2_VERSION,
  conceptCount:QUESTION_NEW_N2_TESTED_CONCEPTS.length,caseCount:QUESTION_NEW_N2_CASES.length,variantCount:QUESTION_NEW_N2_QUESTIONS.length,
  newDecisionIdentityCount:QUESTION_NEW_N2_TESTED_CONCEPTS.length,preservedPreviouslyUnadmittedIdentityCount:0,
  assemblyAuthorization:"Owner accepts N0/N1 for independent review and explicitly requests a separate N2 draft batch and append. No N1 question version is revised.",
  requiredFacilityStages:[3,4],requiredClinicalSetting:"clinic",requiredCapabilityIds:[] as string[],
  executionScope:"clinic_decisions_and_outside_hospital_record_review",serviceContracts:[] as string[],executableOrdersAdded:false,
  educationalIntent:"application_pending_independent_difficulty_novelty_and_clinical_review",
  clinicalApproval:false,pipelinePassed:false,publicReleaseAuthorized:false,
  sourceVerification:"Offline reuse of recorded claims and source receipts with actual prior check/access dates retained. Five explicit mathematical mappings derive from those definitions. No new source retrieval or freshness claim.",
  reviewLimitations:[
    "Every proposed construct boundary needs independent deduplication against its listed nearest objectives; new IDs are author proposals, not proof of new clinical meaning.",
    "Several care-transition and applicability-boundary questions may require harder alternatives or consolidation after independent review; no measured difficulty claim.",
    "No author self-check is an independent PASS, manager acceptance or Melissa Rowland clinical approval.",
    "Single-source and offline-currentness limits remain explicit; repeated IDs for one publication are not independent corroboration.",
    "Clinic/outside-record decisions do not install hospital services, executable orders or result gates. Testing estimates use existing placeholder profiles.",
  ],
} as const;
