import type {QuestionVariant} from "./pilot-schema";
import {validateSyntheticClinicalRelease,type AnswerChoiceTimingRegistryEntry,type SyntheticClinicalCase} from "./schema";
import {QUESTION_CATALOG_RELEASE} from "./synthetic-content";
import {QUESTION_NEW_N3_ROUND2_ITEMS as oldItems,QUESTION_NEW_N3_ROUND2_CASES as oldCases,
 QUESTION_NEW_N3_ROUND2_AUTHORING_CONCEPTS as oldConcepts} from "./question-new-n3-round2-20261105";
import {QUESTION_NEW_N3_ROUND3_CASES as thirdCases} from "./question-new-n3-round3-20261105";
import {QUESTION_NEW_N3_ROUND4_DRAFT as draft} from "./question-new-n3-round4-types";
import {QUESTION_NEW_N3_ROUND4_DEFINITIONS as definitions} from "./question-new-n3-round4-candidates";
import {QUESTION_NEW_N3_ROUND4_CLAIMS as claims,QUESTION_NEW_N3_ROUND4_CLAIM_PROVENANCE as provenance,
 QUESTION_NEW_N3_ROUND4_SOURCES as sources} from "./question-new-n3-round4-evidence-20261110";
export {QUESTION_NEW_N3_ROUND4_DEFINITIONS} from "./question-new-n3-round4-candidates";
export * from "./question-new-n3-round4-evidence-20261110";

const priorIndex=(slug:string)=>oldItems.findIndex(i=>i.slug===slug);
const previousCase=(slug:string)=>definitions.find(r=>r.slug===slug)!.previousReviewId.endsWith(".v3")?
 thirdCases.find(cs=>cs.id===`case.n3.${slug}.v1`)!:oldCases[priorIndex(slug)]!;
const template=(text:string,name:string)=>text.split(name).join("{patientName}");
const claimIds=(basisIds:readonly string[])=>basisIds.map(id=>provenance.find(p=>p.inheritedClaimId===id)!.claimId);
const sourceLabels=(ids:readonly string[])=>{const used=new Set(claims.filter(c=>ids.includes(c.id)).flatMap(c=>c.sourceIds));return sources.filter(s=>used.has(s.id)).map(s=>s.title);};

export const QUESTION_NEW_N3_ROUND4_ITEMS=definitions.map(r=>({...oldItems[priorIndex(r.slug)]!,...r.patch,slug:r.slug,
 displayName:r.patch.complaint,existingClaimIds:r.basisClaimIds,interpret:r.reasoning.interpret,apply:r.reasoning.decision,
 closestError:r.reasoning.closestError,decider:r.reasoning.decider,counterfactual:r.reasoning.counterfactual,cueAttack:r.reasoning.cueAttack,
 novelty:r.conceptReason,
}));
export const QUESTION_NEW_N3_ROUND4_QUESTIONS:QuestionVariant[]=definitions.map((r,index)=>{
 const i=QUESTION_NEW_N3_ROUND4_ITEMS[index]!;
 return {...draft,id:`question.n3.${r.slug}.v4`,conceptId:r.conceptId,stem:template(i.stem,i.patientName),exhibit:i.exhibit,
  answerChoices:i.choices.map((a,j)=>({id:`choice.n3r4.${r.slug}.${a.id}`,label:a.label,isCorrect:j===0,rationale:a.rationale,distractorRationale:j?a.rationale:null})),
  explanation:i.explanation,supportingEvidenceClaimIds:claimIds(r.basisClaimIds)};
});
export const QUESTION_NEW_N3_ROUND4_CASES:SyntheticClinicalCase[]=definitions.map((r,index)=>{
 const old=previousCase(r.slug),i=QUESTION_NEW_N3_ROUND4_ITEMS[index]!,q=QUESTION_NEW_N3_ROUND4_QUESTIONS[index]!;
 const demographics={ageYears:i.age,sexLabel:i.sex},presentation=template(i.presentation,i.patientName),labels=sourceLabels(q.supportingEvidenceClaimIds);
 return {...old,displayName:i.complaint,patientDisplayName:i.patientName,prototypeDemographics:demographics,presentation,chiefComplaint:i.complaint,
  patientPresentationVariantId:`presentation.n3.${r.slug}.v4`,
  approvedInstantiationProfiles:[{id:`profile.n3.${r.slug}.v4`,prototypeDemographics:demographics,chiefComplaint:i.complaint,presentation}],
  sourceLabels:labels,learningSummary:q.explanation,
  decisionNodes:[{...old.decisionNodes[0]!,questionVariantId:q.id,primaryConceptId:q.conceptId,stem:q.stem,exhibit:q.exhibit!,
   answerChoices:q.answerChoices.map(a=>({id:a.id,label:a.label,isCorrect:a.isCorrect,rationale:a.rationale!,serviceRequest:null})),
   shuffleAnswers:true,explanation:q.explanation,sourceLabels:labels,resultGateAfter:null,
   terminalDispositions:q.answerChoices.filter(a=>!a.isCorrect).map(a=>({answerChoiceId:a.id,kind:"no_terminal_outcome" as const,
    consequenceNarrative:"Review the findings and decision before continuing; no patient outcome is simulated.",clinicalRationale:a.rationale!,sourceLabels:labels})),
  }],
 };
});
export const QUESTION_NEW_N3_ROUND4_AUTHORING_CONCEPTS=definitions.map((r,index)=>({
 ...oldConcepts[priorIndex(r.slug)]!,...draft,id:r.conceptId,conceptType:r.patch.conceptType,learningObjective:r.patch.learningObjective,
 previousConceptId:r.previousConceptId,conceptMeaning:r.conceptMeaning,conceptVersionReason:r.conceptReason,
 evidenceClaimIds:QUESTION_NEW_N3_ROUND4_QUESTIONS[index]!.supportingEvidenceClaimIds,
 historyMigration:"None. Same meaning retains its identity; established-meaning reuse attaches to that existing card without moving a different construct's history.",
}));
/** Retained exact old nodes for audits and frozen encounters, not live admission. */
export const QUESTION_NEW_N3_ROUND4_RETAINED_CASES=definitions.map(r=>previousCase(r.slug));

/** Direct import is required. This five-case preview is not registered in the
 * default projection or barrel. Shared release identity keeps existing domain
 * campaign fixtures compatible; the object and export distinguish the stage. */
export const QUESTION_NEW_N3_ROUND4_SOURCE_RELEASE=validateSyntheticClinicalRelease({
 ...QUESTION_CATALOG_RELEASE,
 concepts:QUESTION_CATALOG_RELEASE.concepts.filter(c=>definitions.some(r=>r.conceptId===c.id)),
 cases:QUESTION_NEW_N3_ROUND4_CASES,
});
export const QUESTION_NEW_N3_ROUND4_TIMING_ENTRIES:AnswerChoiceTimingRegistryEntry[]=definitions.map((r,index)=>{
 const cs=QUESTION_NEW_N3_ROUND4_CASES[index]!,n=cs.decisionNodes[0]!;
 return {caseId:cs.id,nodeId:n.id,questionVariantId:n.questionVariantId,
  classification:r.patch.choices.some(a=>a.timingProfileId)?{kind:"test_choices",choices:n.answerChoices.map((a,j)=>({
   choiceId:a.id,choiceLabel:a.label,timing:r.patch.choices[j]!.timingProfileId?{kind:"test",timingProfileId:r.patch.choices[j]!.timingProfileId!}:{kind:"no_test"},
  }))}:{kind:"no_test"}};
});
/** Exact external-only preview bindings supplied for later manager integration.
 * They are not installed into a production registry by this authoring module. */
export const QUESTION_NEW_N3_ROUND4_CANDIDATE_TEST_ORDER_RECORDS=QUESTION_NEW_N3_ROUND4_TIMING_ENTRIES.flatMap(t=>t.classification.kind==="test_choices"?
 t.classification.choices.flatMap(a=>a.timing.kind==="test"?[{caseId:t.caseId,nodeId:t.nodeId,questionVariantId:t.questionVariantId,
  choiceId:a.choiceId,choiceLabel:a.choiceLabel,timingProfileId:a.timing.timingProfileId,disposition:{kind:"not_executed" as const,reason:"external_only" as const}}]:[]):[]);
export const QUESTION_NEW_N3_ROUND4_CASE_REVIEWS=definitions.map((r,index)=>({...draft,id:`review.n3.${r.slug}.v4`,
 caseId:QUESTION_NEW_N3_ROUND4_CASES[index]!.id,educationalTier:1 as const,acuity:QUESTION_NEW_N3_ROUND4_ITEMS[index]!.acuity,
 earliestFacilityStage:QUESTION_NEW_N3_ROUND4_ITEMS[index]!.level,evidenceClaimIds:QUESTION_NEW_N3_ROUND4_QUESTIONS[index]!.supportingEvidenceClaimIds,
}));
export const QUESTION_NEW_N3_ROUND4_SELF_CHECKS=definitions.map((r,index)=>({
 reviewId:`review.n3.${r.slug}.v4`,kind:"manual_author_self_check",checkedOn:"2026-11-10",independent:false,clinicalApproval:false,
 authorVerdict:"AUTHOR_REVISION_PENDING_INDEPENDENT_REVIEW_NOT_PASS",rubric:"question-authoring.2026-11-08.v15",
 prospectiveTriage:"docs/research/question-new-n3-round4-triage-20261110.md",reviewResponse:r.reasoning.reviewResponse,
 coverTheKey:{attack:r.reasoning.cueAttack,dimensions:["wording overlap","length/specificity","convergence","eliminating negatives","teaching sentences","named missing actions","alone","generic/individualized","availability","broadest coverage"]},
 sameDecisionStage:{task:r.patch.stem,manualAudit:r.reasoning.stageAudit},
 reasoningSteps:{interpret:r.reasoning.interpret,decision:r.reasoning.decision,closestError:r.reasoning.closestError,decider:r.reasoning.decider},
 dataAblation:{withoutDecidingData:r.reasoning.ablation,counterfactual:r.reasoning.counterfactual,
  alternativeChoiceId:`choice.n3r4.${r.slug}.${r.reasoning.counterfactualChoiceId}`,empiricalExperiment:false},
 residentDifficulty:{prediction:"moderate application intended; unmeasured author hypothesis",remainingConcern:r.reasoning.remainingRisk},
 singleBestAnswer:{key:QUESTION_NEW_N3_ROUND4_QUESTIONS[index]!.answerChoices[0]!.label,reason:r.reasoning.decider,
  keyClaimIds:claimIds(r.keyBasisClaimIds),heldKeyClaims:[] as string[],clinicalRankingStillRequiresReview:true},
 competentErrors:r.patch.choices.slice(1).map(a=>({choiceId:`choice.n3r4.${r.slug}.${a.id}`,misreading:a.plausibleMisreading,
  inThisCase:a.rationale,correctUnder:a.correctUnder})),
 statisticsOwnerException:false,
}));
export const QUESTION_NEW_N3_ROUND4_STATEMENT_MAPPINGS=definitions.map((r,index)=>{
 const q=QUESTION_NEW_N3_ROUND4_QUESTIONS[index]!;
 return {...draft,caseId:QUESTION_NEW_N3_ROUND4_CASES[index]!.id,questionVariantId:q.id,evidenceClaimIds:q.supportingEvidenceClaimIds,
  fields:[
   {field:"presentation and exhibit",kind:"constructed observations",claimIds:q.supportingEvidenceClaimIds,
    boundary:"Original fictional anatomy, contacts, examination, values, susceptibility report and chronology. Not empirical observations, universal thresholds, drug regimens, or a continuous FEES recording."},
   {field:"stem, key, explanation and rationales",kind:"recorded fact plus bounded authored application",claimIds:q.supportingEvidenceClaimIds,
    boundary:r.reasoning.decider+" "+r.reasoning.remainingRisk},
   ...r.patch.choices.map((a,j)=>({field:`answerChoices[${j}]`,kind:j===0?"proposed keyed application":"proposed competing plan, not a source-endorsed universal indication",
    claimIds:q.supportingEvidenceClaimIds,boundary:a.rationale})),
  ],
  atomicFacts:q.supportingEvidenceClaimIds.map(id=>{const c=claims.find(c=>c.id===id)!;return {claimId:id,statement:c.statement,limitation:c.limitation};}),
  sourceReuse:"Original medical authority, rights, source access and fact-check dates retained. No new retrieval, threshold, medication dose or unsupported universal procedure hierarchy.",
 };
});
export const QUESTION_NEW_N3_ROUND4_BATCH_RECORD={...draft,id:"batch.question-new-n3.2026-11-10.round4",
 candidateVariants:5,fromRound3Returns:1,fromParked32:4,clinicalDecisionHolds:13,dropProposals:17,
 independentlyPassed:false,managerAdmittedToLive:false,defaultProjectionChanged:false,globalTimingChanged:false,
 newConceptVersions:0,establishedConceptReuses:2,freshConceptSupplyClaim:false,clinicalSignoff:"Melissa Rowland",
 previewScope:"Direct-import unapproved stage. Isolated developer preview supplies its six existing-profile test estimates; manager installs exact accepted bindings after independent review.",
} as const;
