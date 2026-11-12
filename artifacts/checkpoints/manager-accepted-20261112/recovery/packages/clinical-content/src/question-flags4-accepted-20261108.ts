import type {AnswerChoiceTimingRegistryEntry,SyntheticClinicalCase} from "./schema";
import {validateSyntheticClinicalRelease} from "./schema";
import {QUESTION_SHIP_MANIFEST} from "./question-ship-manifest";
import {
 QUESTION_FLAGS4_SOURCE_RELEASE,QUESTION_FLAGS4_REVISIONS,QUESTION_FLAGS4_CASE_REVIEWS,QUESTION_FLAGS4_STATEMENT_MAPPINGS,
} from "./question-flags4-20261108";

/** Manager acceptance of the owner-note resolution. The original reviewed
 * view remains immutable. Deleting the redundant update changes no task,
 * option, explanation, claim or clinical meaning; version the exact context. */
export const QUESTION_FLAGS4_ACCEPTED_SOURCE_VIEW_NAME="flags4-accepted" as const;
export const QUESTION_FLAGS4_ACCEPTED_VARIANT_ID="question.gs028f.nutrition.refeeding-insulin-phosphate-shift.v3.r2";
const version="question-authoring.2026-11-08.flags4-r2";
export const QUESTION_FLAGS4_ACCEPTED_REVISIONS=QUESTION_FLAGS4_REVISIONS.map(r=>({
 ...r,questionVariantId:QUESTION_FLAGS4_ACCEPTED_VARIANT_ID,currentUpdate:undefined,
 question:{...r.question,id:QUESTION_FLAGS4_ACCEPTED_VARIANT_ID,contentVersion:version},
 conceptVersionReason:"Unchanged carbohydrate/insulin-associated phosphate-uptake objective. Delete only the Current update already restated in the complete task; no new clinical fact or FSRS migration.",
}));
export const QUESTION_FLAGS4_ACCEPTED_QUESTIONS=QUESTION_FLAGS4_ACCEPTED_REVISIONS.map(r=>r.question);
export const QUESTION_FLAGS4_ACCEPTED_CASES:SyntheticClinicalCase[]=QUESTION_FLAGS4_SOURCE_RELEASE.cases.map(cs=>({
 ...cs,decisionNodes:cs.decisionNodes.map(n=>{
  const {currentUpdate:_redundantUpdate,...retained}=n;
  return {...retained,questionVariantId:QUESTION_FLAGS4_ACCEPTED_VARIANT_ID};
 }),
}));
export const QUESTION_FLAGS4_ACCEPTED_SOURCE_RELEASE=validateSyntheticClinicalRelease({
 ...QUESTION_FLAGS4_SOURCE_RELEASE,id:"clinical.flags4-accepted-source.20261108.v2",cases:QUESTION_FLAGS4_ACCEPTED_CASES,
});
const accepted=QUESTION_FLAGS4_ACCEPTED_REVISIONS.filter(r=>QUESTION_SHIP_MANIFEST.accepted.some(a=>
 a.acceptanceId===r.auditId&&a.caseId===r.caseId&&a.nodeId===r.nodeId&&a.questionVariantId===r.questionVariantId&&
 a.conceptId===r.question.conceptId&&a.sourceView===QUESTION_FLAGS4_ACCEPTED_SOURCE_VIEW_NAME));
export const QUESTION_FLAGS4_ACCEPTED_TIMING_ENTRIES:AnswerChoiceTimingRegistryEntry[]=accepted.map(r=>({
 caseId:r.caseId,nodeId:r.nodeId,questionVariantId:r.questionVariantId,classification:{kind:"no_test"},
}));
export const QUESTION_FLAGS4_ACCEPTED_CASE_REVIEWS=QUESTION_FLAGS4_CASE_REVIEWS.map(r=>({...r,contentVersion:version}));
export const QUESTION_FLAGS4_ACCEPTED_STATEMENT_MAPPINGS=QUESTION_FLAGS4_STATEMENT_MAPPINGS.map(m=>({
 ...m,contentVersion:version,questionVariantId:QUESTION_FLAGS4_ACCEPTED_VARIANT_ID,
 fields:m.fields.map(f=>f.field==="presentation / currentUpdate"?{...f,field:"presentation / complete task"}:f),
 sourceView:QUESTION_FLAGS4_ACCEPTED_SOURCE_VIEW_NAME,managerDecision:"docs/research/question-flags4-manager-decision-20261108.md",
 identity:"Same stable concept; exact legacy v3 and all frozen question/choice orders remain archived. Editorial acceptance grants no clinical approval.",
}));
