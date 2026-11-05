import type {QuestionVariant} from "./pilot-schema";
import type {AnswerChoiceTimingRegistryEntry,SyntheticClinicalCase,SyntheticClinicalRelease,TestedConcept} from "./schema";
import {QUESTION_SHIP_MANIFEST,type QuestionShipManifest} from "./question-ship-manifest";
import {QUESTION_NEW_N3_ITEMS as oldItems,QUESTION_NEW_N3_QUESTIONS as oldQuestions,QUESTION_NEW_N3_CASES as oldCases,
  QUESTION_NEW_N3_AUTHORING_CONCEPTS as oldConcepts,QUESTION_NEW_N3_CASE_REVIEWS as oldReviews,
  QUESTION_NEW_N3_SELF_CHECKS as oldChecks,QUESTION_NEW_N3_STATEMENT_MAPPINGS as oldMappings,
  QUESTION_NEW_N3_TIMING_ENTRIES as oldTiming} from "./question-new-n3-20261105";
import {QUESTION_NEW_N3_ROUND2_LEVEL3_NUTRITION} from "./question-new-n3-round2-level3-nutrition";
import {QUESTION_NEW_N3_ROUND2_LEVEL3_SPECIALTY} from "./question-new-n3-round2-level3-specialty";
import {QUESTION_NEW_N3_ROUND2_LEVEL4_ONCOLOGY} from "./question-new-n3-round2-level4-oncology";
import {QUESTION_NEW_N3_ROUND2_LEVEL4_FOREGUT} from "./question-new-n3-round2-level4-foregut";
import {QUESTION_NEW_N3_ROUND2_LEVEL4_CRITICAL} from "./question-new-n3-round2-level4-critical";
import {QUESTION_NEW_N3_ROUND2_DRAFT as draft} from "./question-new-n3-round2-types";
import {QUESTION_NEW_N3_ROUND2_CLAIMS as claims,QUESTION_NEW_N3_ROUND2_CLAIM_PROVENANCE as provenance,
  QUESTION_NEW_N3_ROUND2_SOURCES as sources} from "./question-new-n3-round2-evidence-20261105";
export * from "./question-new-n3-round2-evidence-20261105";

export const QUESTION_NEW_N3_ROUND2_REVISIONS=[...QUESTION_NEW_N3_ROUND2_LEVEL3_NUTRITION,...QUESTION_NEW_N3_ROUND2_LEVEL3_SPECIALTY,
  ...QUESTION_NEW_N3_ROUND2_LEVEL4_ONCOLOGY,...QUESTION_NEW_N3_ROUND2_LEVEL4_FOREGUT,...QUESTION_NEW_N3_ROUND2_LEVEL4_CRITICAL];
const revisions=new Map(QUESTION_NEW_N3_ROUND2_REVISIONS.map(r=>[r.slug,r]));
export const QUESTION_NEW_N3_ROUND2_FROZEN_PASS_IDS=["review.n3.pleural-source-versus-systemic-response.v1"] as const;
export const QUESTION_NEW_N3_ROUND2_ITEMS=oldItems.map(i=>revisions.get(i.slug)?.item??i);
const template=(s:string,name:string)=>s.split(name).join("{patientName}");
const claimIds=(ids:readonly string[])=>ids.map(id=>{
  const p=provenance.find(p=>p.inheritedClaimId===id);
  if(!p)throw new Error(`Missing N3 round-two authoring evidence mapping: ${id}`);
  return p.claimId;
});
const sourceLabels=(ids:readonly string[])=>{
  const used=new Set(claims.filter(c=>ids.includes(c.id)).flatMap(c=>c.sourceIds));
  return sources.filter(s=>used.has(s.id)).map(s=>s.title);
};
export const QUESTION_NEW_N3_ROUND2_QUESTIONS:QuestionVariant[]=QUESTION_NEW_N3_ROUND2_ITEMS.map((i,index)=>{
  const revision=revisions.get(i.slug);if(!revision)return oldQuestions[index]!;
  return {...draft,id:`question.n3.${i.slug}.v2`,conceptId:revision.conceptId,stem:template(i.stem,i.patientName),exhibit:i.exhibit,
    answerChoices:i.choices.map((c,j)=>({id:`choice.n3r2.${i.slug}.${c.id}`,label:c.label,isCorrect:j===0,rationale:c.rationale,distractorRationale:j?c.rationale:null})),
    explanation:i.explanation,supportingEvidenceClaimIds:claimIds(i.existingClaimIds)};
});
export const QUESTION_NEW_N3_ROUND2_CASES:SyntheticClinicalCase[]=QUESTION_NEW_N3_ROUND2_ITEMS.map((i,index)=>{
  const old=oldCases[index]!;if(!revisions.has(i.slug))return old;
  const q=QUESTION_NEW_N3_ROUND2_QUESTIONS[index]!,labels=sourceLabels(q.supportingEvidenceClaimIds);
  const demographics={ageYears:i.age,sexLabel:i.sex},presentation=template(i.presentation,i.patientName);
  return {...old,patientDisplayName:i.patientName,prototypeDemographics:demographics,chiefComplaint:i.complaint,presentation,
    patientPresentationVariantId:`presentation.n3.${i.slug}.v2`,sourceLabels:labels,
    approvedInstantiationProfiles:[{id:`profile.n3.${i.slug}.v2`,prototypeDemographics:demographics,chiefComplaint:i.complaint,presentation}],
    decisionNodes:[{...old.decisionNodes[0]!,questionVariantId:q.id,primaryConceptId:q.conceptId,stem:q.stem,exhibit:q.exhibit!,
      answerChoices:q.answerChoices.map(c=>({id:c.id,label:c.label,isCorrect:c.isCorrect,rationale:c.rationale!,serviceRequest:null})),
      explanation:q.explanation,sourceLabels:labels,shuffleAnswers:true,resultGateAfter:null,
      terminalDispositions:q.answerChoices.filter(c=>!c.isCorrect).map(c=>({answerChoiceId:c.id,kind:"no_terminal_outcome" as const,
        consequenceNarrative:"This draft ends with interpretation feedback; no patient outcome is simulated.",clinicalRationale:c.rationale!,sourceLabels:labels}))}],
    learningSummary:q.explanation};
});
export const QUESTION_NEW_N3_ROUND2_AUTHORING_CONCEPTS=QUESTION_NEW_N3_ROUND2_ITEMS.map((i,index)=>{
  const r=revisions.get(i.slug);if(!r)return oldConcepts[index]!;
  return {...oldConcepts[index]!,...draft,id:r.conceptId,displayName:i.displayName,learningObjective:i.learningObjective,conceptType:i.conceptType,
    evidenceClaimIds:claimIds(i.existingClaimIds),previousConceptId:r.previousConceptId,conceptMeaning:r.conceptMeaning,conceptVersionReason:r.conceptVersionReason,
    novelty:r.conceptMeaning==="same"?i.novelty:r.conceptVersionReason,
    identityBasis:r.conceptMeaning==="existing_concept"?"reuse_established_construct":"revised_construct_pending_independent_overlap_review",
    historyMigration:"None. Retain previous card definitions and histories; a materially changed meaning has a separate identity, and a duplicate uses the established concept."};
});
export const QUESTION_NEW_N3_ROUND2_NEW_CONCEPT_VERSIONS:TestedConcept[]=QUESTION_NEW_N3_ROUND2_REVISIONS.filter(r=>r.conceptMeaning==="new_version").map(r=>({
  id:r.conceptId,displayName:r.item.displayName,learningObjective:r.item.learningObjective,conceptType:r.item.conceptType,earliestFacilityStage:r.item.level,
}));
export const QUESTION_NEW_N3_ROUND2_REVIEW_TIMING:AnswerChoiceTimingRegistryEntry[]=QUESTION_NEW_N3_ROUND2_ITEMS.map((i,index)=>{
  if(!revisions.has(i.slug))return oldTiming[index]!;
  const cs=QUESTION_NEW_N3_ROUND2_CASES[index]!,n=cs.decisionNodes[0]!;
  return {caseId:cs.id,nodeId:n.id,questionVariantId:n.questionVariantId,classification:i.choices.some(c=>c.timingProfileId)?{
    kind:"test_choices",choices:n.answerChoices.map((c,j)=>({choiceId:c.id,choiceLabel:c.label,timing:i.choices[j]!.timingProfileId?
      {kind:"test",timingProfileId:i.choices[j]!.timingProfileId!}:{kind:"no_test"}})),
  }:{kind:"no_test"}};
});
export const QUESTION_NEW_N3_ROUND2_TIMING_ENTRIES=QUESTION_NEW_N3_ROUND2_REVIEW_TIMING.filter(t=>t.questionVariantId.endsWith(".v2"));
export const QUESTION_NEW_N3_ROUND2_CASE_REVIEWS=QUESTION_NEW_N3_ROUND2_ITEMS.map((i,index)=>revisions.has(i.slug)?{
  ...draft,id:`review.n3.${i.slug}.v2`,caseId:QUESTION_NEW_N3_ROUND2_CASES[index]!.id,educationalTier:1 as const,acuity:i.acuity,
  earliestFacilityStage:i.level,evidenceClaimIds:QUESTION_NEW_N3_ROUND2_QUESTIONS[index]!.supportingEvidenceClaimIds,
}:oldReviews[index]!);
export const QUESTION_NEW_N3_ROUND2_SELF_CHECKS=QUESTION_NEW_N3_ROUND2_ITEMS.map((i,index)=>{
  const r=revisions.get(i.slug);if(!r)return oldChecks[index]!;
  const q=QUESTION_NEW_N3_ROUND2_QUESTIONS[index]!;
  return {reviewId:`review.n3.${i.slug}.v2`,kind:"manual_author_self_check" as const,checkedOn:"2026-11-05",independent:false,clinicalApproval:false,
    calibration:"docs/research/question-new-n3-round2-calibration-20261105.md",
    authorVerdict:"REPAIRED_FOR_INDEPENDENT_CHALLENGE_NOT_A_PASS",
    coverTheKey:{assessment:"author_attack_recorded_not_independent_pass",attack:i.cueAttack,strongestShortcut:r.attack.strongestShortcut,repair:r.attack.repair,
      dimensions:["wording overlap","length/specificity","convergence","eliminating negatives","teaching sentences","alone","generic/individualized","availability cues"]},
    sameDecisionStageAndCategory:{assessment:"author_comparison_pending_independent_review",category:i.decisionCategory},
    twoStep:{assessment:"author_chain_pending_independent_challenge",interpretFindings:i.interpret,consequentialDecision:i.apply,
      closestError:i.closestError,decisiveObservation:i.decider,counterfactual:i.counterfactual},
    residentDifficulty:{assessment:"uncalibrated_author_prediction_not_measurement",audience:"PGY-2/3",prediction:i.predictedDifficulty,
      reason:i.closestError,residualConcern:r.attack.residualConcern},
    singleDefensibleBestAnswer:{assessment:"author_ranking_pending_independent_and_clinical_review",reason:i.decider,heldKeyClaims:[] as string[],contextBoundaries:i.counterfactual},
    calibratedRejectionTests:{
      visibleRecordShortcut:{test:"Could the key be selected before interpreting the clinical data?",attack:r.attack.strongestShortcut,repair:r.attack.repair},
      competentResidentDistractors:r.item.choices.slice(1).map(c=>({choiceId:`choice.n3r2.${i.slug}.${c.id}`,temptation:c.plausibleMisreading,
        mistakenInference:c.rationale,bestUnder:c.correctUnder})),
      concreteAction:{key:q.answerChoices[0]!.label,category:i.decisionCategory,genericSpecialistReferralKey:false},
      dataAblation:{removedFinding:r.attack.removedFinding,withoutIt:r.attack.withoutIt,alternativeFinding:r.attack.alternativeFinding,
        thenBestChoiceId:`choice.n3r2.${i.slug}.${r.attack.thenBestChoiceId}`,notAnEmpiricalExperiment:true},
      fairDifficulty:{unsuppliedInterpretation:i.interpret,consequence:i.apply,closestRivalDiscriminator:i.decider,remainingConcern:r.attack.residualConcern,
        verdict:"author_hypothesis_pending_independent_review"},
    },
    options:r.item.choices.map((c,j)=>({choiceId:`choice.n3r2.${i.slug}.${c.id}`,isKey:j===0,plausibleMisreading:c.plausibleMisreading,
      correctUnder:c.correctUnder,inThisCase:c.rationale})),
  };
});
export const QUESTION_NEW_N3_ROUND2_STATEMENT_MAPPINGS=QUESTION_NEW_N3_ROUND2_ITEMS.map((i,index)=>{
  if(!revisions.has(i.slug))return oldMappings[index]!;
  const cs=QUESTION_NEW_N3_ROUND2_CASES[index]!,q=QUESTION_NEW_N3_ROUND2_QUESTIONS[index]!;
  return {...draft,caseId:cs.id,questionVariantId:q.id,fields:["presentation","decisionNodes[0].stem","decisionNodes[0].exhibit","decisionNodes[0].explanation","learningSummary",
    ...q.answerChoices.flatMap((_,j)=>[`decisionNodes[0].answerChoices[${j}].label`,`decisionNodes[0].answerChoices[${j}].rationale`])],
    evidenceClaimIds:q.supportingEvidenceClaimIds,
    atomicFacts:q.supportingEvidenceClaimIds.map(id=>({claimId:id,statement:claims.find(c=>c.id===id)!.statement})),
    applicationBoundary:"Case observations are constructed. Source-backed facts are the named unchanged atomic claims; case-specific inference and ranking are author judgments awaiting independent and clinical review, not newly verified universal treatment rules.",
    constructedDataBasis:"Original finite fictional patient observations, laboratory intervals, chronology and acquisition records. No new event probabilities, universal diagnostic/management cutoffs, medication doses or service durations."};
});
export const QUESTION_NEW_N3_ROUND2_SOURCE_LINKS=sources.filter(s=>s.officialUrl).map(s=>({...draft,
  id:`link.n3r2.${s.id.replace(/^source\./,"")}`,sourceId:s.id,label:s.title,href:s.officialUrl!,target:"_blank",rel:"noopener noreferrer",referrerPolicy:"no-referrer",
}));
/** Fresh catalog projection only. Historical or unknown inputs are left intact. */
export function applyQuestionNewN3Round2Revisions(cases:readonly SyntheticClinicalCase[]):SyntheticClinicalCase[]{
  const replacement=new Map(QUESTION_NEW_N3_ROUND2_CASES.filter(cs=>cs.decisionNodes[0]!.questionVariantId.endsWith(".v2")).map(cs=>[cs.id,cs]));
  const previous=new Map(oldCases.map(cs=>[cs.id,cs.decisionNodes[0]!.questionVariantId]));
  return cases.map(cs=>replacement.has(cs.id)&&cs.decisionNodes[0]?.questionVariantId===previous.get(cs.id)?replacement.get(cs.id)!:cs);
}
/** The sole shipping boundary remains default release projection; no save/admission checks. */
export function withAcceptedQuestionNewN3Round2Concepts(catalog:SyntheticClinicalRelease,priorConcepts:readonly TestedConcept[],manifest:QuestionShipManifest=QUESTION_SHIP_MANIFEST):SyntheticClinicalRelease{
  const n3Cases=new Map(catalog.cases.filter(cs=>cs.id.startsWith("case.n3.")).map(cs=>[cs.id,cs]));
  const accepted=new Set(manifest.accepted.filter(row=>n3Cases.get(row.caseId)?.decisionNodes.some(n=>
    n.id===row.nodeId&&n.questionVariantId===row.questionVariantId&&n.primaryConceptId===row.conceptId)).map(row=>row.conceptId));
  const existing=new Set(priorConcepts.map(c=>c.id));
  return {...catalog,concepts:[...priorConcepts,...catalog.concepts.filter(c=>accepted.has(c.id)&&!existing.has(c.id))]};
}
export const QUESTION_NEW_N3_ROUND2_BATCH_MANIFEST={...draft,id:"batch.question-new-n3.2026-11-05.round2",caseCount:40,revisedVariants:39,frozenPass:1,
  newConceptVersions:QUESTION_NEW_N3_ROUND2_NEW_CONCEPT_VERSIONS.length,existingConceptReuses:QUESTION_NEW_N3_ROUND2_REVISIONS.filter(r=>r.conceptMeaning==="existing_concept").length,
  freshSupplyClaim:false,level3:16,level4:24,educationalTier:1,editorialAcceptance:false,clinicalApproval:false,managerAdmittedToLive:false,
  publicReleaseAuthorized:false,executableOrdersAdded:false,keySourceHolds:[] as string[],
  selfCheckStatus:"Calibrated author rejection tests and unresolved concerns recorded for every revision; no independent difficulty or PASS asserted.",
  sourceScope:"Recorded offline facts and original access/check dates; no retrieval, new source currentness assertion, copied prose or new universal treatment cutoff.",
  clinicalSignoff:"Melissa Rowland; all revised versions need clinician review.",
} as const;
