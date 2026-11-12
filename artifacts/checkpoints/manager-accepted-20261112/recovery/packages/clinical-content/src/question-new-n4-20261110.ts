import type {QuestionVariant} from "./pilot-schema";
import {validateSyntheticClinicalRelease,type SyntheticClinicalCase,type TestedConcept,type AnswerChoiceTimingRegistryEntry} from "./schema";
import {QUESTION_NEW_N4_DRAFT as draft,type N4Item} from "./question-new-n4-types";
import {materializeN4Item} from "./question-new-n4-materialize";
import {QUESTION_NEW_N4_INTRA_OP as operationItems} from "./question-new-n4-intra-op";
import {QUESTION_NEW_N4_ENDOSCOPY as endoscopyItems} from "./question-new-n4-endoscopy";
import {QUESTION_NEW_N4_WOUND_OSTOMY as woundItems} from "./question-new-n4-wound-ostomy";
import {QUESTION_NEW_N4_PEDIATRIC as pediatricItems} from "./question-new-n4-pediatric";
import {QUESTION_NEW_N4_REUSED_CONCEPTS as reused} from "./question-new-n4-reference-bindings";
import {QUESTION_NEW_N4_SELF_CHECK_PARKS as parks} from "./question-new-n4-self-check-parks";
import {QUESTION_NEW_N4_CLAIMS as claims,QUESTION_NEW_N4_CLAIM_PROVENANCE as provenance,
 QUESTION_NEW_N4_SOURCES as sources} from "./question-new-n4-evidence-20261110";
export * from "./question-new-n4-evidence-20261110";
export {QUESTION_NEW_N4_FAMILY_BINDINGS} from "./question-new-n4-reference-bindings";
export {QUESTION_NEW_N4_SELF_CHECK_PARKS} from "./question-new-n4-self-check-parks";

/** Existing placeholder profiles, never fixed waits in authored prose. Current
 * treatment steps do not order the same operation again. Tissue acquisition,
 * new diagnostic panels and future diagnostic plans get explicit estimates. */
const previewProfiles:Record<string,Record<string,string>>={
 "melanoma-depth-before-flap-and-sentinel-node":{node_first:"timing.test.biopsy_staging",flap_first:"timing.test.biopsy_staging",ultrasound:"timing.test.ultrasound"},
 "dcis-gland-removal-and-sentinel-sequence":{sentinel:"timing.test.biopsy_staging",dissect:"timing.test.biopsy_staging"},
 "colonic-wall-pattern-after-mucosal-biopsy":{biopsy:"timing.test.biopsy"},
 "esophageal-sample-territory-during-egd":{esophagus:"timing.test.esophageal_multilevel_biopsy",junction:"timing.test.biopsy",stomach:"timing.test.biopsy"},
 "duodenal-sampling-despite-normal-view":{duodenum:"timing.test.biopsy",gastric:"timing.test.biopsy"},
 "barrett-pathology-reclassification-before-treatment":{surveillance:"timing.test.biopsy"},
 "ileostomy-losses-versus-primary-muscle-complaint":{renal:"timing.test.basic_labs",muscle:"timing.test.basic_labs",inflammatory:"timing.test.basic_labs"},
};
export const QUESTION_NEW_N4_RAW_DRAFT_ITEMS:N4Item[]=[...operationItems,...endoscopyItems,...woundItems,...pediatricItems].map(i=>({...i,
 choices:i.choices.map(c=>({...c,...(previewProfiles[i.slug]?.[c.id]?{timingProfileId:previewProfiles[i.slug]![c.id]}:{})})) as N4Item["choices"],
}));
export const QUESTION_NEW_N4_ITEMS=QUESTION_NEW_N4_RAW_DRAFT_ITEMS.filter(i=>!parks.some(p=>p.slug===i.slug));
const aliased=(ids:string[])=>ids.map(id=>{const p=provenance.find(p=>p.inheritedClaimId===id);if(!p)throw Error(`N4 draft missing mapping ${id}`);return p.claimId;});
const allCompiled=QUESTION_NEW_N4_RAW_DRAFT_ITEMS.map(i=>{
 const used=new Set(claims.filter(c=>aliased(i.basisClaimIds).includes(c.id)).flatMap(c=>c.sourceIds));
 return materializeN4Item({...i,basisClaimIds:aliased(i.basisClaimIds)},claims,sources.filter(s=>used.has(s.id)).map(s=>s.title));
});
const compiled=allCompiled.filter(c=>!parks.some(p=>c.clinicalCase.id===`case.n4.${p.slug}.v1`));
export const QUESTION_NEW_N4_CATALOG_CASES=allCompiled.map(c=>c.clinicalCase);
export const QUESTION_NEW_N4_CATALOG_QUESTIONS=allCompiled.map(c=>c.question);
export const QUESTION_NEW_N4_CASES:SyntheticClinicalCase[]=compiled.map(c=>c.clinicalCase);
export const QUESTION_NEW_N4_QUESTIONS:QuestionVariant[]=compiled.map(c=>c.question);
export const QUESTION_NEW_N4_TIMING_ENTRIES:AnswerChoiceTimingRegistryEntry[]=compiled.map(c=>c.timing);
export const QUESTION_NEW_N4_CONCEPTS:TestedConcept[]=[...new Map(compiled.map(c=>[
 c.concept.id,reused.find(r=>r.id===c.concept.id)??c.concept,
])).values()];
export const QUESTION_NEW_N4_AUTHORING_CONCEPTS=QUESTION_NEW_N4_CONCEPTS.map(c=>({...c,...draft,
 conceptRelation:QUESTION_NEW_N4_ITEMS.find(i=>i.conceptId===c.id)!.conceptRelation,
 evidenceClaimIds:[...new Set(QUESTION_NEW_N4_QUESTIONS.filter(q=>q.conceptId===c.id).flatMap(q=>q.supportingEvidenceClaimIds))],
 historyMigration:"None. Existing meanings retain their stable identity; a genuinely new meaning uses a distinct concept ID.",
}));

/** Explicit direct-import candidate stage. No default/catalog/manifest import
 * and no installation side effect. Shared release identity preserves the
 * existing balance pin in an explicitly supplied developer context. */
export const QUESTION_NEW_N4_SOURCE_RELEASE=validateSyntheticClinicalRelease({
 id:"clinical.synthetic.prototype.v1",schemaVersion:1,publicationStatus:"synthetic_unapproved_prototype",
 disclaimer:"Synthetic N4 authoring preview, not clinically approved. Explicit candidate stage only; Melissa Rowland is clinical sign-off.",
 concepts:QUESTION_NEW_N4_CONCEPTS,cases:QUESTION_NEW_N4_CASES,
});
export const QUESTION_NEW_N4_CATALOG_RELEASE=validateSyntheticClinicalRelease({
 ...QUESTION_NEW_N4_SOURCE_RELEASE,
 concepts:[...new Map(allCompiled.map(c=>[c.concept.id,reused.find(r=>r.id===c.concept.id)??c.concept])).values()],
 cases:QUESTION_NEW_N4_CATALOG_CASES,
});
export const QUESTION_NEW_N4_CANDIDATE_TEST_ORDER_RECORDS=QUESTION_NEW_N4_TIMING_ENTRIES.flatMap(t=>t.classification.kind==="test_choices"?
 t.classification.choices.flatMap(c=>c.timing.kind==="test"?[{caseId:t.caseId,nodeId:t.nodeId,questionVariantId:t.questionVariantId,
  choiceId:c.choiceId,choiceLabel:c.choiceLabel,timingProfileId:c.timing.timingProfileId,
  disposition:{kind:"not_executed" as const,reason:"future_planned" as const}}]:[]):[]);
export const QUESTION_NEW_N4_CASE_REVIEWS=QUESTION_NEW_N4_ITEMS.map((i,index)=>({...draft,id:`review.n4.${i.slug}.v1`,
 caseId:QUESTION_NEW_N4_CASES[index]!.id,educationalTier:i.tier,acuity:i.acuity,earliestFacilityStage:i.stage,
 group:i.group,phase:i.phase,evidenceClaimIds:QUESTION_NEW_N4_QUESTIONS[index]!.supportingEvidenceClaimIds,
}));
export const QUESTION_NEW_N4_SELF_CHECKS=QUESTION_NEW_N4_ITEMS.map(i=>({
 reviewId:`review.n4.${i.slug}.v1`,kind:"manual_author_self_check",checkedOn:"2026-11-10",independent:false,clinicalApproval:false,
 authorVerdict:"DRAFT_FOR_INDEPENDENT_REVIEW_NOT_PASS",rubric:"question-authoring.2026-11-08.v15",
 coverTheKey:{attack:i.reasoning.cueAttack,dimensions:["wording overlap","length/specificity","component convergence","eliminating negatives","teaching sentences","named missing actions","alone","generic/individualized","availability","broadest coverage"]},
 sameStage:{task:i.task,audit:i.reasoning.stageAudit},
 reasoning:{interpret:i.reasoning.stepA,decision:i.reasoning.stepB,closestCompetitor:i.reasoning.closestCompetitor,decidingObservation:i.reasoning.decider},
 ablation:{withoutDecider:i.reasoning.ablation,counterfactual:i.reasoning.counterfactual,
  counterfactualChoiceId:`choice.n4.${i.slug}.${i.reasoning.counterfactualChoiceId}`,empiricalExperiment:false},
 residentDifficulty:{prediction:i.reasoning.difficulty,remainingConcern:i.reasoning.remainingRisk,measured:false},
 singleBest:{key:i.choices[0].label,keyClaimIds:aliased(i.keyBasisClaimIds),heldKeyClaims:[] as string[],clinicalRankingRequiresReview:true},
 competitorAudit:i.choices.slice(1).map(c=>({choiceId:`choice.n4.${i.slug}.${c.id}`,competentError:c.competentError,whyNotHere:c.rationale,correctUnder:c.correctUnder})),
 statisticsException:false,
}));
export const QUESTION_NEW_N4_STATEMENT_MAPPINGS=QUESTION_NEW_N4_ITEMS.map((i,index)=>({...draft,
 caseId:QUESTION_NEW_N4_CASES[index]!.id,questionVariantId:QUESTION_NEW_N4_QUESTIONS[index]!.id,
 evidenceClaimIds:aliased(i.basisClaimIds),
 observations:{kind:"original constructed patient/operative observations",fields:["presentation","exhibit"],
  limitation:"Fictional observed values, anatomy and chronology; not new thresholds, empirical performance, demographic weights or procedural technique evidence."},
 teaching:{fields:["task","options","explanation","choice rationales"],keyClaimIds:aliased(i.keyBasisClaimIds),
  application:i.reasoning.decider,clinicalBoundary:i.reasoning.remainingRisk},
 sourceReuse:"Recorded atomic synthesis and original authority/rights/access/check metadata, with no fresh retrieval or verification-date advancement.",
}));
