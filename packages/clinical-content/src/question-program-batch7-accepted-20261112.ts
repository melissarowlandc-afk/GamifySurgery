import type {SyntheticClinicalRelease} from "./schema";
import {QUESTION_SHIP_MANIFEST} from "./question-ship-manifest";
import {PROGRAM_BATCH7_ROWS,PROGRAM_BATCH7_VIEWS,PROGRAM_BATCH7_TIMINGS,PROGRAM_BATCH7_ORDERS,PROGRAM_BATCH7_REVIEWED_QUESTIONS,PROGRAM_BATCH7_CLINICAL_CONFIRMATIONS} from "./question-program-batch7-accepted-data-20261112";
export const QUESTION_PROGRAM_BATCH7_ACCEPTED_ROWS = PROGRAM_BATCH7_ROWS;
export const QUESTION_PROGRAM_BATCH7_ACCEPTED_SOURCE_VIEWS = PROGRAM_BATCH7_VIEWS;
export const QUESTION_PROGRAM_BATCH7_ACCEPTED_CASES = Object.values(PROGRAM_BATCH7_VIEWS).flatMap(view=>view.cases);
function accepted(id:string) {const r=PROGRAM_BATCH7_ROWS.find(r=>r.questionVariantId===id);return !!r && QUESTION_SHIP_MANIFEST.accepted.some(a=>a.acceptanceId===r.acceptanceId&&a.caseId===r.caseId&&a.nodeId===r.nodeId&&a.questionVariantId===r.questionVariantId&&a.conceptId===r.conceptId&&a.sourceView===r.sourceView);}
export function withAcceptedQuestionProgramBatch7Concepts(release:SyntheticClinicalRelease):SyntheticClinicalRelease {
  const known=new Set(release.concepts.map(c=>c.id));const additions=Object.values(PROGRAM_BATCH7_VIEWS).flatMap(v=>v.concepts).filter(c=>{
    if(known.has(c.id)||!PROGRAM_BATCH7_ROWS.some(r=>r.conceptId===c.id&&accepted(r.questionVariantId)))return false;known.add(c.id);return true;
  });return {...release,concepts:[...release.concepts,...additions]};
}
export const QUESTION_PROGRAM_BATCH7_ACCEPTED_TIMING_ENTRIES = PROGRAM_BATCH7_TIMINGS.filter(r=>accepted(r.questionVariantId));
export const QUESTION_PROGRAM_BATCH7_ACCEPTED_TEST_ORDER_RECORDS = PROGRAM_BATCH7_ORDERS.filter(r=>accepted(r.questionVariantId));
/** Existing AuthoredClinicalRecord fields record version-specific clinical review.
 * Key-only records remain needs_clinician_review; no concept/claim/profile is approved. */
export const QUESTION_PROGRAM_BATCH7_CLINICALLY_APPROVED_QUESTIONS = PROGRAM_BATCH7_REVIEWED_QUESTIONS.filter(q=>q.reviewStatus==="clinically_approved");
export const QUESTION_PROGRAM_BATCH7_KEY_CONFIRMED_QUESTIONS = PROGRAM_BATCH7_REVIEWED_QUESTIONS.filter(q=>q.reviewStatus==="needs_clinician_review");
export const QUESTION_PROGRAM_BATCH7_CLINICAL_CONFIRMATIONS = PROGRAM_BATCH7_CLINICAL_CONFIRMATIONS;
export function questionProgramBatch7ClinicalReview(questionVariantId:string) {
  return PROGRAM_BATCH7_REVIEWED_QUESTIONS.find(q=>q.id===questionVariantId) ?? null;
}
export {PROGRAM_BATCH7_QUESTIONS as QUESTION_PROGRAM_BATCH7_ACCEPTED_QUESTIONS,
  PROGRAM_BATCH7_AUTHORED_CONCEPTS as QUESTION_PROGRAM_BATCH7_AUTHORED_CONCEPTS,
  PROGRAM_BATCH7_RETIRED_CASES as QUESTION_PROGRAM_BATCH7_RETAINED_CASES,
  PROGRAM_BATCH7_RETIREMENTS as QUESTION_PROGRAM_BATCH7_RETIREMENTS,
  PROGRAM_BATCH7_CLAIMS as QUESTION_PROGRAM_BATCH7_CLAIMS,PROGRAM_BATCH7_SOURCES as QUESTION_PROGRAM_BATCH7_SOURCES,
  PROGRAM_BATCH7_FROZEN as QUESTION_PROGRAM_BATCH7_FROZEN_PRESERVATION} from "./question-program-batch7-accepted-data-20261112";
export {PROGRAM_BATCH7_LENGTH_RESIDUALS as QUESTION_PROGRAM_BATCH7_LENGTH_RESIDUALS} from "./question-program-batch7-accepted-data-20261112";
