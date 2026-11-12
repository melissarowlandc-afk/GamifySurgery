import type {QuestionVariant} from "./pilot-schema";
import type {AnswerChoiceTimingRegistryEntry,SyntheticClinicalCase,TestedConcept} from "./schema";
import {QUESTION_NEW_N3_ROUND2_ITEMS as priorItems,QUESTION_NEW_N3_ROUND2_QUESTIONS as oldQuestions,
  QUESTION_NEW_N3_ROUND2_CASES as oldCases,QUESTION_NEW_N3_ROUND2_AUTHORING_CONCEPTS as oldConcepts,
  QUESTION_NEW_N3_ROUND2_CASE_REVIEWS as oldReviews,QUESTION_NEW_N3_ROUND2_SELF_CHECKS as oldChecks,
  QUESTION_NEW_N3_ROUND2_STATEMENT_MAPPINGS as oldMappings,QUESTION_NEW_N3_ROUND2_REVIEW_TIMING as oldTiming} from "./question-new-n3-round2-20261105";
import {QUESTION_NEW_N3_ROUND3_DRAFT as draft} from "./question-new-n3-round3-types";
import {QUESTION_NEW_N3_ROUND3_REVISIONS} from "./question-new-n3-round3-candidates";
import {QUESTION_NEW_N3_ROUND3_CLAIMS as claims,QUESTION_NEW_N3_ROUND3_CLAIM_PROVENANCE as provenance,
  QUESTION_NEW_N3_ROUND3_SOURCES as sources} from "./question-new-n3-round3-evidence-20261105";
export * from "./question-new-n3-round3-evidence-20261105";
export {QUESTION_NEW_N3_ROUND3_REVISIONS};
export const QUESTION_NEW_N3_ROUND3_FROZEN_PASS_IDS=[
  "review.n3.bilateral-carotid-symptom-attribution.v2",
  "review.n3.postsplenectomy-nodule-function-before-targeting.v2",
  "review.n3.dysphagia-biopsy-territory-after-negative-endoscopy.v2",
  "review.n3.tumor-screen-versus-family-test-sequence.v2",
  "review.n3.gastric-lymphoma-new-large-cell-process.v2",
] as const;
const revisions=new Map(QUESTION_NEW_N3_ROUND3_REVISIONS.map(r=>[r.slug,r]));
const frozenSlugs=new Set<string>(QUESTION_NEW_N3_ROUND3_FROZEN_PASS_IDS.map(id=>id.replace(/^review\.n3\./,"").replace(/\.v2$/,"")));
const priorIndex=(slug:string)=>priorItems.findIndex(i=>i.slug===slug);
export const QUESTION_NEW_N3_ROUND3_ITEMS=priorItems.filter(i=>revisions.has(i.slug)||frozenSlugs.has(i.slug)).map(i=>revisions.get(i.slug)?.item??i);
/** Historical catalog drafts stay intact; these IDs are excluded from this final-round submission. */
export const QUESTION_NEW_N3_ROUND3_PARKED_CASE_IDS=priorItems.filter(i=>!QUESTION_NEW_N3_ROUND3_ITEMS.some(j=>j.slug===i.slug)).map(i=>oldCases[priorIndex(i.slug)]!.id);
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
export const QUESTION_NEW_N3_ROUND3_QUESTIONS:QuestionVariant[]=QUESTION_NEW_N3_ROUND3_ITEMS.map((i,index)=>{
  const revision=revisions.get(i.slug);if(!revision)return oldQuestions[priorIndex(i.slug)]!;
  return {...draft,id:`question.n3.${i.slug}.v3`,conceptId:revision.conceptId,stem:template(i.stem,i.patientName),exhibit:i.exhibit,
    answerChoices:i.choices.map((c,j)=>({id:`choice.n3r3.${i.slug}.${c.id}`,label:c.label,isCorrect:j===0,rationale:c.rationale,distractorRationale:j?c.rationale:null})),
    explanation:i.explanation,supportingEvidenceClaimIds:claimIds(i.existingClaimIds)};
});
export const QUESTION_NEW_N3_ROUND3_CASES:SyntheticClinicalCase[]=QUESTION_NEW_N3_ROUND3_ITEMS.map((i,index)=>{
  const old=oldCases[priorIndex(i.slug)]!;if(!revisions.has(i.slug))return old;
  const q=QUESTION_NEW_N3_ROUND3_QUESTIONS[index]!,labels=sourceLabels(q.supportingEvidenceClaimIds);
  const demographics={ageYears:i.age,sexLabel:i.sex},presentation=template(i.presentation,i.patientName);
  return {...old,patientDisplayName:i.patientName,prototypeDemographics:demographics,chiefComplaint:i.complaint,presentation,
    patientPresentationVariantId:`presentation.n3.${i.slug}.v3`,sourceLabels:labels,
    approvedInstantiationProfiles:[{id:`profile.n3.${i.slug}.v3`,prototypeDemographics:demographics,chiefComplaint:i.complaint,presentation}],
    decisionNodes:[{...old.decisionNodes[0]!,questionVariantId:q.id,primaryConceptId:q.conceptId,stem:q.stem,exhibit:q.exhibit!,
      answerChoices:q.answerChoices.map(c=>({id:c.id,label:c.label,isCorrect:c.isCorrect,rationale:c.rationale!,serviceRequest:null})),
      explanation:q.explanation,sourceLabels:labels,shuffleAnswers:true,resultGateAfter:null,
      terminalDispositions:q.answerChoices.filter(c=>!c.isCorrect).map(c=>({answerChoiceId:c.id,kind:"no_terminal_outcome" as const,
        consequenceNarrative:"This draft ends with interpretation feedback; no patient outcome is simulated.",clinicalRationale:c.rationale!,sourceLabels:labels}))}],
    learningSummary:q.explanation};
});
export const QUESTION_NEW_N3_ROUND3_AUTHORING_CONCEPTS=QUESTION_NEW_N3_ROUND3_ITEMS.map((i,index)=>{
  const r=revisions.get(i.slug);if(!r)return oldConcepts[priorIndex(i.slug)]!;
  return {...oldConcepts[priorIndex(i.slug)]!,...draft,id:r.conceptId,displayName:i.displayName,learningObjective:i.learningObjective,conceptType:i.conceptType,
    evidenceClaimIds:claimIds(i.existingClaimIds),previousConceptId:r.previousConceptId,conceptMeaning:r.conceptMeaning,conceptVersionReason:r.conceptVersionReason,
    novelty:r.conceptMeaning==="same"?i.novelty:r.conceptVersionReason,
    identityBasis:"revised_construct_pending_independent_overlap_review",
    historyMigration:"None. Retain previous card definitions and histories; a materially changed meaning has a separate identity, and a duplicate uses the established concept."};
});
export const QUESTION_NEW_N3_ROUND3_NEW_CONCEPT_VERSIONS:TestedConcept[]=QUESTION_NEW_N3_ROUND3_REVISIONS.filter(r=>r.conceptMeaning==="new_version").map(r=>({
  id:r.conceptId,displayName:r.item.displayName,learningObjective:r.item.learningObjective,conceptType:r.item.conceptType,earliestFacilityStage:r.item.level,
}));
export const QUESTION_NEW_N3_ROUND3_REVIEW_TIMING:AnswerChoiceTimingRegistryEntry[]=QUESTION_NEW_N3_ROUND3_ITEMS.map((i,index)=>{
  if(!revisions.has(i.slug))return oldTiming[priorIndex(i.slug)]!;
  const cs=QUESTION_NEW_N3_ROUND3_CASES[index]!,n=cs.decisionNodes[0]!;
  return {caseId:cs.id,nodeId:n.id,questionVariantId:n.questionVariantId,classification:i.choices.some(c=>c.timingProfileId)?{
    kind:"test_choices",choices:n.answerChoices.map((c,j)=>({choiceId:c.id,choiceLabel:c.label,timing:i.choices[j]!.timingProfileId?
      {kind:"test",timingProfileId:i.choices[j]!.timingProfileId!}:{kind:"no_test"}})),
  }:{kind:"no_test"}};
});
export const QUESTION_NEW_N3_ROUND3_TIMING_ENTRIES=QUESTION_NEW_N3_ROUND3_REVIEW_TIMING.filter(t=>t.questionVariantId.endsWith(".v3"));
export const QUESTION_NEW_N3_ROUND3_CASE_REVIEWS=QUESTION_NEW_N3_ROUND3_ITEMS.map((i,index)=>revisions.has(i.slug)?{
  ...draft,id:`review.n3.${i.slug}.v3`,caseId:QUESTION_NEW_N3_ROUND3_CASES[index]!.id,educationalTier:1 as const,acuity:i.acuity,
  earliestFacilityStage:i.level,evidenceClaimIds:QUESTION_NEW_N3_ROUND3_QUESTIONS[index]!.supportingEvidenceClaimIds,
}:oldReviews[priorIndex(i.slug)]!);
export const QUESTION_NEW_N3_ROUND3_SELF_CHECKS=QUESTION_NEW_N3_ROUND3_ITEMS.map((i,index)=>{
  const r=revisions.get(i.slug);if(!r)return oldChecks[priorIndex(i.slug)]!;
  const q=QUESTION_NEW_N3_ROUND3_QUESTIONS[index]!;
  return {reviewId:`review.n3.${i.slug}.v3`,kind:"manual_author_self_check" as const,checkedOn:"2026-11-05",independent:false,clinicalApproval:false,
    calibration:"docs/research/question-new-n3-round3-planning-20261105.md",
    preAuthorPlan:"docs/research/question-new-n3-round3-planning-20261105.md",
    namedMissingActionAudit:{assessment:"No named missing action or advertised missing field",test:i.cueAttack},
    authorVerdict:"AUTHOR_REVISION_PENDING_INDEPENDENT_REVIEW_NOT_PASS",
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
      competentResidentDistractors:r.item.choices.slice(1).map(c=>({choiceId:`choice.n3r3.${i.slug}.${c.id}`,temptation:c.plausibleMisreading,
        mistakenInference:c.rationale,bestUnder:c.correctUnder})),
      concreteAction:{key:q.answerChoices[0]!.label,category:i.decisionCategory,genericSpecialistReferralKey:false},
      dataAblation:{removedFinding:r.attack.removedFinding,withoutIt:r.attack.withoutIt,alternativeFinding:r.attack.alternativeFinding,
        thenBestChoiceId:`choice.n3r3.${i.slug}.${r.attack.thenBestChoiceId}`,notAnEmpiricalExperiment:true},
      fairDifficulty:{unsuppliedInterpretation:i.interpret,consequence:i.apply,closestRivalDiscriminator:i.decider,remainingConcern:r.attack.residualConcern,
        verdict:"author_hypothesis_pending_independent_review"},
    },
    options:r.item.choices.map((c,j)=>({choiceId:`choice.n3r3.${i.slug}.${c.id}`,isKey:j===0,plausibleMisreading:c.plausibleMisreading,
      correctUnder:c.correctUnder,inThisCase:c.rationale})),
  };
});
export const QUESTION_NEW_N3_ROUND3_STATEMENT_MAPPINGS=QUESTION_NEW_N3_ROUND3_ITEMS.map((i,index)=>{
  if(!revisions.has(i.slug))return oldMappings[priorIndex(i.slug)]!;
  const cs=QUESTION_NEW_N3_ROUND3_CASES[index]!,q=QUESTION_NEW_N3_ROUND3_QUESTIONS[index]!;
  return {...draft,caseId:cs.id,questionVariantId:q.id,fields:["presentation","decisionNodes[0].stem","decisionNodes[0].exhibit","decisionNodes[0].explanation","learningSummary",
    ...q.answerChoices.flatMap((_,j)=>[`decisionNodes[0].answerChoices[${j}].label`,`decisionNodes[0].answerChoices[${j}].rationale`])],
    evidenceClaimIds:q.supportingEvidenceClaimIds,
    atomicFacts:q.supportingEvidenceClaimIds.map(id=>({claimId:id,statement:claims.find(c=>c.id===id)!.statement})),
    applicationBoundary:"Case observations are constructed. Source-backed facts are the named unchanged atomic claims; case-specific inference and ranking are author judgments awaiting independent and clinical review, not newly verified universal treatment rules.",
    constructedDataBasis:"Original finite fictional patient observations, laboratory intervals, chronology and acquisition records. No new event probabilities, universal diagnostic/management cutoffs, medication doses or service durations."};
});
/** Explicit candidate projection only; no default release integration or player checks. */
export function applyQuestionNewN3Round3Revisions(cases:readonly SyntheticClinicalCase[]):SyntheticClinicalCase[]{
  const replacement=new Map(QUESTION_NEW_N3_ROUND3_CASES.filter(cs=>cs.decisionNodes[0]!.questionVariantId.endsWith(".v3")).map(cs=>[cs.id,cs]));
  const previous=new Map(oldCases.map(cs=>[cs.id,cs.decisionNodes[0]!.questionVariantId]));
  return cases.map(cs=>replacement.has(cs.id)&&cs.decisionNodes[0]?.questionVariantId===previous.get(cs.id)?replacement.get(cs.id)!:cs);
}
export const QUESTION_NEW_N3_ROUND3_BATCH_MANIFEST={...draft,id:"batch.question-new-n3.2026-11-05.round3",caseCount:8,revisedVariants:3,frozenPass:5,
  parkedReturnedDrafts:32,newConceptVersions:QUESTION_NEW_N3_ROUND3_NEW_CONCEPT_VERSIONS.length,
  level3:3,level4:5,editorialAcceptance:false,clinicalApproval:false,managerAdmittedToLive:false,publicReleaseAuthorized:false,
  freshSupplyClaim:false,keySourceHolds:[] as string[],executableOrdersAdded:false,
  clinicalSignoff:"Melissa Rowland; independent editorial PASS does not confer clinical approval.",
  sourceScope:"Exact recorded atomic facts and original access/check dates; no retrieval, new universal rule or technical treatment hierarchy.",
  selfCheckStatus:"Prospective chains, counterfactuals and cue attacks recorded. Author prediction remains uncalibrated and is not PASS.",
} as const;
