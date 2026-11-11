import {validateSyntheticClinicalRelease,type SyntheticClinicalCase,type TestedConcept} from "./schema";
import type {QuestionVariant} from "./pilot-schema";
import {QUESTION_NEW_N4_ROUND2_DRAFT as draft,type N4R2Item} from "./question-new-n4-round2-types";
import {materializeN4R2Item} from "./question-new-n4-round2-materialize";
import {QUESTION_NEW_N4_ROUND2_REVISIONS as revised} from "./question-new-n4-round2-revisions";
import {QUESTION_NEW_N4_ROUND2_ADDITIONAL as additional} from "./question-new-n4-round2-additional";
import {QUESTION_NEW_N4_ROUND2_REUSED_CONCEPTS as reused} from "./question-new-n4-round2-reference-bindings";
import {QUESTION_NEW_N4_ROUND2_CLAIMS as claims,QUESTION_NEW_N4_ROUND2_CLAIM_PROVENANCE as provenance,QUESTION_NEW_N4_ROUND2_SOURCES as sources} from "./question-new-n4-round2-evidence";
import {QUESTION_NEW_N4_ITEMS as priorItems,QUESTION_NEW_N4_CASES as priorCases,QUESTION_NEW_N4_QUESTIONS as priorQuestions,
 QUESTION_NEW_N4_TIMING_ENTRIES as priorTiming,QUESTION_NEW_N4_CATALOG_RELEASE as priorCatalog} from "./question-new-n4-20261110";
export * from "./question-new-n4-round2-evidence";
export * from "./question-new-n4-round2-dispositions";
export {QUESTION_NEW_N4_ROUND2_FAMILY_BINDINGS} from "./question-new-n4-round2-reference-bindings";

export const QUESTION_NEW_N4_ROUND2_FROZEN_SLUGS=["cholecystectomy-neck-plane-bailout","colonic-wall-pattern-after-mucosal-biopsy","venous-ulcer-contralateral-pressure-trap","incisional-pocket-above-retained-mesh"];
const frozenItems:N4R2Item[]=priorItems.filter(i=>QUESTION_NEW_N4_ROUND2_FROZEN_SLUGS.includes(i.slug)).map(i=>({...i,version:1,priorReviewId:`review.n4.${i.slug}.v1`,slot:"R1:"+i.slug}));
export const QUESTION_NEW_N4_ROUND2_NEW_ITEMS:N4R2Item[]=[...revised,...additional];
export const QUESTION_NEW_N4_ROUND2_ITEMS:N4R2Item[]=[...frozenItems,...QUESTION_NEW_N4_ROUND2_NEW_ITEMS];
const aliased=(ids:string[])=>ids.map(id=>claims.some(c=>c.id===id)?id:provenance.find(p=>p.inheritedClaimId===id)?.claimId??id);
const compiled=QUESTION_NEW_N4_ROUND2_NEW_ITEMS.map(i=>{
 const ids=aliased(i.basisClaimIds),used=new Set(claims.filter(c=>ids.includes(c.id)).flatMap(c=>c.sourceIds));
 return materializeN4R2Item({...i,basisClaimIds:ids},claims,sources.filter(s=>used.has(s.id)).map(s=>s.title));
});
const frozen=QUESTION_NEW_N4_ROUND2_FROZEN_SLUGS.map(slug=>{
 const clinicalCase=priorCases.find(c=>c.id===`case.n4.${slug}.v1`)!;
 return {clinicalCase,question:priorQuestions.find(q=>q.id===clinicalCase.decisionNodes[0]!.questionVariantId)!,
  timing:priorTiming.find(t=>t.caseId===clinicalCase.id)!,concept:priorCatalog.concepts.find(c=>c.id===clinicalCase.decisionNodes[0]!.primaryConceptId)!};
});
// Align the metadata to the exact four unchanged prior objects, not a rebuilt view.
const frozenOrdered=frozenItems.map(i=>frozen.find(f=>f.clinicalCase.id===`case.n4.${i.slug}.v1`)!);
const all=[...frozenOrdered,...compiled];
export const QUESTION_NEW_N4_ROUND2_CASES:SyntheticClinicalCase[]=all.map(c=>c.clinicalCase);
export const QUESTION_NEW_N4_ROUND2_QUESTIONS:QuestionVariant[]=all.map(c=>c.question);
export const QUESTION_NEW_N4_ROUND2_TIMING_ENTRIES=all.map(c=>c.timing);
export const QUESTION_NEW_N4_ROUND2_CONCEPTS:TestedConcept[]=[...new Map(all.map(c=>[c.concept.id,reused.find(r=>r.id===c.concept.id)??c.concept])).values()];
export const QUESTION_NEW_N4_ROUND2_AUTHORING_CONCEPTS=QUESTION_NEW_N4_ROUND2_CONCEPTS.map(c=>({...c,...draft,
 conceptRelation:QUESTION_NEW_N4_ROUND2_ITEMS.find(i=>i.conceptId===c.id)!.conceptRelation,
 evidenceClaimIds:[...new Set(QUESTION_NEW_N4_ROUND2_QUESTIONS.filter(q=>q.conceptId===c.id).flatMap(q=>q.supportingEvidenceClaimIds))],
 historyMigration:"None. Existing meanings retain their identities. A materially different meaning receives a distinct concept ID; old encounters and histories are untouched."}));
/** Direct-import developer stage. No barrel import, manifest mutation, live
 * registry mutation or production-side registration. */
export const QUESTION_NEW_N4_ROUND2_SOURCE_RELEASE=validateSyntheticClinicalRelease({
 id:"clinical.synthetic.prototype.v1",schemaVersion:1,publicationStatus:"synthetic_unapproved_prototype",
 disclaimer:"Synthetic N4 round-2 authoring preview, not clinically approved. All new content needs clinician review by Melissa Rowland. Author checks are not independent acceptance.",
 concepts:QUESTION_NEW_N4_ROUND2_CONCEPTS,cases:QUESTION_NEW_N4_ROUND2_CASES,
});
export const QUESTION_NEW_N4_ROUND2_CATALOG_RELEASE=validateSyntheticClinicalRelease({...QUESTION_NEW_N4_ROUND2_SOURCE_RELEASE,
 concepts:[...new Map([...priorCatalog.concepts,...QUESTION_NEW_N4_ROUND2_CONCEPTS].map(c=>[c.id,c])).values()],
 cases:[...priorCatalog.cases,...compiled.map(c=>c.clinicalCase)],
});
export const QUESTION_NEW_N4_ROUND2_CANDIDATE_TEST_ORDER_RECORDS=QUESTION_NEW_N4_ROUND2_TIMING_ENTRIES.flatMap(t=>t.classification.kind==="test_choices"?
 t.classification.choices.flatMap(c=>c.timing.kind==="test"?[{caseId:t.caseId,nodeId:t.nodeId,questionVariantId:t.questionVariantId,choiceId:c.choiceId,choiceLabel:c.choiceLabel,timingProfileId:c.timing.timingProfileId,disposition:{kind:"not_executed" as const,reason:"future_planned" as const}}]:[]):[]);
export const QUESTION_NEW_N4_ROUND2_CASE_REVIEWS=QUESTION_NEW_N4_ROUND2_ITEMS.map((i,index)=>({...draft,id:`review.n4.${i.slug}.v${i.version}`,
 caseId:QUESTION_NEW_N4_ROUND2_CASES[index]!.id,group:i.group,phase:i.phase,educationalTier:i.tier,acuity:i.acuity,earliestFacilityStage:i.stage,
 evidenceClaimIds:QUESTION_NEW_N4_ROUND2_QUESTIONS[index]!.supportingEvidenceClaimIds,
 frozen:QUESTION_NEW_N4_ROUND2_FROZEN_SLUGS.includes(i.slug),priorReviewId:i.priorReviewId,
}));
export const QUESTION_NEW_N4_ROUND2_SELF_CHECKS=QUESTION_NEW_N4_ROUND2_ITEMS.map(i=>({
 reviewId:`review.n4.${i.slug}.v${i.version}`,kind:"manual_author_self_check",checkedOn:"2026-11-10",independent:false,clinicalApproval:false,
 authorVerdict:QUESTION_NEW_N4_ROUND2_FROZEN_SLUGS.includes(i.slug)?"FROZEN_PRIOR_INDEPENDENT_PASS":"DRAFT_FOR_INDEPENDENT_REVIEW_NOT_PASS",
 rubric:"question-authoring.2026-11-08.v15",
 coverTheKey:{attack:i.reasoning.cueAttack,dimensions:["wording overlap","length and specificity","component convergence","eliminating negatives","teaching sentences","named missing actions","alone","generic/individualized","availability","broadest coverage"]},
 sameStage:{task:i.task,audit:i.reasoning.stageAudit},
 reasoning:{interpret:i.reasoning.stepA,decision:i.reasoning.stepB,closestCompetitor:i.reasoning.closestCompetitor,decidingObservation:i.reasoning.decider},
 ablation:{withoutDecider:i.reasoning.ablation,counterfactual:i.reasoning.counterfactual,counterfactualChoiceId:QUESTION_NEW_N4_ROUND2_FROZEN_SLUGS.includes(i.slug)?`choice.n4.${i.slug}.${i.reasoning.counterfactualChoiceId}`:`choice.n4.${i.slug}.v${i.version}.${i.reasoning.counterfactualChoiceId}`,empiricalExperiment:false},
 residentDifficulty:{prediction:i.reasoning.difficulty,remainingConcern:i.reasoning.remainingRisk,measured:false},
 singleBest:{key:i.choices[0].label,keyClaimIds:aliased(i.keyBasisClaimIds),heldKeyClaims:[] as string[],clinicalRankingRequiresReview:true},
 competitorAudit:i.choices.slice(1).map(c=>({choiceId:`choice.n4.${i.slug}.v${i.version}.${c.id}`,competentError:c.competentError,whyNotHere:c.rationale,correctUnder:c.correctUnder})),statisticsException:false,
}));
export const QUESTION_NEW_N4_ROUND2_STATEMENT_MAPPINGS=QUESTION_NEW_N4_ROUND2_ITEMS.map((i,index)=>({...draft,
 caseId:QUESTION_NEW_N4_ROUND2_CASES[index]!.id,questionVariantId:QUESTION_NEW_N4_ROUND2_QUESTIONS[index]!.id,
 evidenceClaimIds:QUESTION_NEW_N4_ROUND2_QUESTIONS[index]!.supportingEvidenceClaimIds,
 observations:{kind:"Original constructed fictional observations",fields:["presentation","exhibit"],limitation:"No synthetic number is a new threshold, probability, treatment dose or demographic weight. Source-linked numeric rules appear only where directly supported."},
 teaching:{fields:["task","answer choices","rationales","explanation"],keyClaimIds:aliased(i.keyBasisClaimIds),application:i.reasoning.decider,clinicalBoundary:i.reasoning.remainingRisk},
 sourceReuse:QUESTION_NEW_N4_ROUND2_FROZEN_SLUGS.includes(i.slug)?"Frozen original claims and provenance; no refreshed verification date":"Inherited claim aliases retain dates; new claims have direct targeted source verification, separate authority/rights and stated limitations.",
}));
