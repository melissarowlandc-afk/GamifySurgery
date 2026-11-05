import type { QuestionVariant } from "./pilot-schema";
import type { AnswerChoiceTimingRegistryEntry, SyntheticClinicalCase, SyntheticClinicalRelease, TestedConcept } from "./schema";
import { QUESTION_SHIP_MANIFEST, type QuestionShipManifest } from "./question-ship-manifest";
import { QUESTION_NEW_N3_LEVEL3 } from "./question-new-n3-level3";
import { QUESTION_NEW_N3_LEVEL4 } from "./question-new-n3-level4";
import { QUESTION_NEW_N3_CLAIMS, QUESTION_NEW_N3_CLAIM_PROVENANCE, QUESTION_NEW_N3_SOURCES } from "./question-new-n3-evidence-20261105";
import { QUESTION_NEW_N3_DRAFT, QUESTION_NEW_N3_VERSION } from "./question-new-n3-types";

export const QUESTION_NEW_N3_ITEMS = [...QUESTION_NEW_N3_LEVEL3, ...QUESTION_NEW_N3_LEVEL4];
export { QUESTION_NEW_N3_CLAIMS, QUESTION_NEW_N3_CLAIM_PROVENANCE, QUESTION_NEW_N3_SOURCES };
const template = (text: string, name: string) => text.split(name).join("{patientName}");
const conceptId = (slug: string) => `concept.n3.${slug}`;
const evidenceIds = (ids: readonly string[]) => ids.map(id => {
  const row = QUESTION_NEW_N3_CLAIM_PROVENANCE.find(p => p.inheritedClaimId === id);
  if (!row) throw new Error(`Missing N3 authoring evidence mapping: ${id}`);
  return row.claimId;
});
export const QUESTION_NEW_N3_AUTHORING_CONCEPTS = QUESTION_NEW_N3_ITEMS.map(i => ({
  ...QUESTION_NEW_N3_DRAFT,id:conceptId(i.slug),displayName:i.displayName,learningObjective:i.learningObjective,
  conceptType:i.conceptType,earliestFacilityStage:i.level,educationalTier:1 as const,acuity:i.acuity,
  requiredCapabilityIds:[] as string[],evidenceClaimIds:evidenceIds(i.existingClaimIds),
  identityBasis:"new_integrated_decision_construct" as const,nearestExistingConceptIds:i.nearestExistingConceptIds,novelty:i.novelty,
  constructReviewStatus:"pending_independent_novelty_and_overlap_review" as const,
}));
export const QUESTION_NEW_N3_TESTED_CONCEPTS: TestedConcept[] = QUESTION_NEW_N3_AUTHORING_CONCEPTS.map(i => ({
  id:i.id,displayName:i.displayName,learningObjective:i.learningObjective,conceptType:i.conceptType,earliestFacilityStage:i.earliestFacilityStage,
}));
export const QUESTION_NEW_N3_QUESTIONS: QuestionVariant[] = QUESTION_NEW_N3_ITEMS.map(i => ({
  ...QUESTION_NEW_N3_DRAFT,id:`question.n3.${i.slug}.v1`,conceptId:conceptId(i.slug),stem:template(i.stem,i.patientName),
  answerChoices:i.choices.map((c,j)=>({id:`choice.n3.${i.slug}.${c.id}`,label:c.label,isCorrect:j===0,rationale:c.rationale,distractorRationale:j?c.rationale:null})),
  explanation:i.explanation,exhibit:i.exhibit,supportingEvidenceClaimIds:evidenceIds(i.existingClaimIds),
}));
export const QUESTION_NEW_N3_CASES: SyntheticClinicalCase[] = QUESTION_NEW_N3_ITEMS.map((i,index)=>{
  const q=QUESTION_NEW_N3_QUESTIONS[index]!;
  const ids=new Set(QUESTION_NEW_N3_CLAIMS.filter(c=>q.supportingEvidenceClaimIds.includes(c.id)).flatMap(c=>c.sourceIds));
  const sourceLabels=QUESTION_NEW_N3_SOURCES.filter(s=>ids.has(s.id)).map(s=>s.title);
  const demographics={ageYears:i.age,sexLabel:i.sex},presentation=template(i.presentation,i.patientName);
  return {id:`case.n3.${i.slug}.v1`,displayName:i.displayName,patientPresentationVariantId:`presentation.n3.${i.slug}.v1`,
    releasePointId:"release.l3.ambulatory_or_qi",patientDisplayName:i.patientName,prototypeDemographics:demographics,
    chiefComplaint:i.complaint,presentation,approvedInstantiationProfiles:[{id:`profile.n3.${i.slug}.v1`,prototypeDemographics:demographics,chiefComplaint:i.complaint,presentation}],
    tutorialEligible:false,routineEligible:true,earliestFacilityStage:i.level,requiredClinicalSetting:"clinic",requiredCapabilityIds:[],rewardTierId:"reward.clinic_basic",sourceLabels,
    decisionNodes:[{id:`node.n3.${i.slug}.v1`,questionVariantId:q.id,primaryConceptId:q.conceptId,stem:q.stem,
      answerChoices:q.answerChoices.map(c=>({id:c.id,label:c.label,isCorrect:c.isCorrect,rationale:c.rationale!,serviceRequest:null})),
      shuffleAnswers:true,explanation:q.explanation,exhibit:i.exhibit,sourceLabels,resultGateAfter:null,
      terminalDispositions:q.answerChoices.filter(c=>!c.isCorrect).map(c=>({answerChoiceId:c.id,kind:"no_terminal_outcome" as const,
        consequenceNarrative:"This teaching draft ends with interpretation feedback; no patient outcome is simulated.",clinicalRationale:c.rationale!,sourceLabels})),
    }],learningSummary:q.explanation};
});
export const QUESTION_NEW_N3_TIMING_ENTRIES: AnswerChoiceTimingRegistryEntry[] = QUESTION_NEW_N3_CASES.map((cs,index)=>{
  const i=QUESTION_NEW_N3_ITEMS[index]!,n=cs.decisionNodes[0]!;
  return {caseId:cs.id,nodeId:n.id,questionVariantId:n.questionVariantId,classification:i.choices.some(c=>c.timingProfileId)?{
    kind:"test_choices",choices:n.answerChoices.map((c,j)=>({choiceId:c.id,choiceLabel:c.label,timing:i.choices[j]!.timingProfileId?
      {kind:"test",timingProfileId:i.choices[j]!.timingProfileId!}:{kind:"no_test"}})),
  }:{kind:"no_test"}};
});
export const QUESTION_NEW_N3_CASE_REVIEWS=QUESTION_NEW_N3_CASES.map((cs,index)=>({
  ...QUESTION_NEW_N3_DRAFT,id:`review.n3.${QUESTION_NEW_N3_ITEMS[index]!.slug}.v1`,caseId:cs.id,
  educationalTier:1 as const,acuity:QUESTION_NEW_N3_ITEMS[index]!.acuity,earliestFacilityStage:cs.earliestFacilityStage,
  evidenceClaimIds:QUESTION_NEW_N3_QUESTIONS[index]!.supportingEvidenceClaimIds,
}));
export const QUESTION_NEW_N3_SELF_CHECKS=QUESTION_NEW_N3_ITEMS.map(i=>({
  reviewId:`review.n3.${i.slug}.v1`,kind:"manual_author_self_check" as const,checkedOn:"2026-11-05",independent:false,clinicalApproval:false,
  coverTheKey:{assessment:"author_checked_pending_independent_attack",attack:i.cueAttack,
    dimensions:["wording overlap","length/specificity","convergence","eliminating negatives","teaching sentences","alone","generic/individualized","availability cues"]},
  sameDecisionStageAndCategory:{assessment:"author_checked_pending_independent_review",category:i.decisionCategory},
  twoStep:{assessment:"author_checked_pending_independent_review",interpretFindings:i.interpret,consequentialDecision:i.apply,
    closestError:i.closestError,decisiveObservation:i.decider,counterfactual:i.counterfactual},
  residentDifficulty:{assessment:"prediction_not_measurement",audience:"PGY-2/3",prediction:i.predictedDifficulty,
    reason:`The proposed challenge is ${i.closestError.charAt(0).toLowerCase()+i.closestError.slice(1)} The decision turns on: ${i.decider}`},
  singleDefensibleBestAnswer:{assessment:"author_ranking_pending_independent_and_clinical_review",reason:i.decider,
    heldKeyClaims:[] as string[],contextBoundaries:i.counterfactual},
  options:i.choices.map((c,index)=>({choiceId:`choice.n3.${i.slug}.${c.id}`,isKey:index===0,correctUnder:c.correctUnder,
    inThisCase:c.rationale})),
}));
export const QUESTION_NEW_N3_STATEMENT_MAPPINGS=QUESTION_NEW_N3_CASES.map((cs,index)=>({
  ...QUESTION_NEW_N3_DRAFT,caseId:cs.id,questionVariantId:cs.decisionNodes[0]!.questionVariantId,
  fields:["presentation","decisionNodes[0].stem","decisionNodes[0].exhibit","decisionNodes[0].explanation","learningSummary",
    ...cs.decisionNodes[0]!.answerChoices.flatMap((_,j)=>[`decisionNodes[0].answerChoices[${j}].label`,`decisionNodes[0].answerChoices[${j}].rationale`])],
  evidenceClaimIds:QUESTION_NEW_N3_QUESTIONS[index]!.supportingEvidenceClaimIds,
  constructedDataBasis:"Original finite fictional records, measurements and chronology; not empirical event rates, demographic selection weights, new guideline cutoffs, medication doses or service durations.",
}));
export const QUESTION_NEW_N3_SOURCE_LINKS=QUESTION_NEW_N3_SOURCES.filter(s=>s.officialUrl).map(s=>({
  ...QUESTION_NEW_N3_DRAFT,id:`link.n3.${s.id.replace(/^source\./,"")}`,sourceId:s.id,label:s.title,href:s.officialUrl!,target:"_blank",rel:"noopener noreferrer",referrerPolicy:"no-referrer",
}));

/** Used only while building the default content projection. Existing registered
 * meanings are retained; proposed N3 meanings enter it only with an exact tuple.
 * This is never an admission, save-reopen or encounter-completion check. */
export function withAcceptedQuestionNewN3Concepts(
  catalog:SyntheticClinicalRelease, priorConcepts:readonly TestedConcept[], manifest:QuestionShipManifest=QUESTION_SHIP_MANIFEST,
):SyntheticClinicalRelease {
  const accepted=new Set(manifest.accepted.filter(row=>QUESTION_NEW_N3_CASES.some(cs=>cs.id===row.caseId&&cs.decisionNodes.some(n=>
    n.id===row.nodeId&&n.questionVariantId===row.questionVariantId&&n.primaryConceptId===row.conceptId))).map(row=>row.conceptId));
  const existing=new Set(priorConcepts.map(c=>c.id));
  return {...catalog,concepts:[...priorConcepts,...QUESTION_NEW_N3_TESTED_CONCEPTS.filter(c=>accepted.has(c.id)&&!existing.has(c.id))]};
}
export const QUESTION_NEW_N3_BATCH_MANIFEST={
  ...QUESTION_NEW_N3_DRAFT,id:"batch.question-new-n3.2026-11-05",contentVersion:QUESTION_NEW_N3_VERSION,
  conceptCount:40,variantCount:40,caseCount:40,level3:16,level4:24,educationalTier:1,
  editorialAcceptance:false,clinicalApproval:false,managerAdmittedToLive:false,publicReleaseAuthorized:false,
  intendedAudience:"PGY-2/3 ABSITE application practice",constructReviewStatus:"pending_independent_novelty_overlap_and_difficulty_review",
  executionScope:"clinic_decisions_and_outside_hospital_record_review",requiredCapabilityIds:[] as string[],executableOrdersAdded:false,
  evidenceBasis:"Offline reuse of recorded permitted source metadata and unchanged atomic factual syntheses. Original source/check dates retained; no source retrieved or currentness newly verified.",
  keySourceHolds:[] as string[],limitations:[
    "Proposed integrated decision identities require independent comparison with the listed existing objectives; merge into a variant of an existing concept if the new clinical meaning is not sustained.",
    "Same-author rubric checks and qualitative difficulty predictions do not substitute for independent review or Melissa Rowland clinical sign-off.",
    "Single-publication management limitations and older sources remain explicit in the evidence ledger. Duplicate records for one publication are not independent corroboration.",
    "No hospital service is installed in a Level 3/4 clinic. Testing estimates use existing placeholders and all new test-order records are external-only.",
  ],
} as const;
