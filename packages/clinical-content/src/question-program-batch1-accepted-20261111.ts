import type {SyntheticClinicalRelease} from "./schema";
import {QUESTION_SHIP_MANIFEST} from "./question-ship-manifest";
import {PROGRAM_BATCH1_ROWS,PROGRAM_BATCH1_VIEWS,PROGRAM_BATCH1_QUESTIONS,PROGRAM_BATCH1_TIMINGS,PROGRAM_BATCH1_ORDERS} from "./question-program-batch1-accepted-data-20261111";
export const QUESTION_PROGRAM_BATCH1_ACCEPTED_ROWS=PROGRAM_BATCH1_ROWS;
export const QUESTION_PROGRAM_BATCH1_ACCEPTED_SOURCE_VIEWS=PROGRAM_BATCH1_VIEWS;
export const QUESTION_PROGRAM_BATCH1_ACCEPTED_CASES=Object.values(PROGRAM_BATCH1_VIEWS).flatMap(v=>v.cases);
export const QUESTION_PROGRAM_BATCH1_ACCEPTED_QUESTIONS=PROGRAM_BATCH1_QUESTIONS;
const accepted=(id:string)=>PROGRAM_BATCH1_ROWS.some(r=>r.questionVariantId===id&&QUESTION_SHIP_MANIFEST.accepted.some(a=>a.acceptanceId===r.acceptanceId&&a.caseId===r.caseId&&a.nodeId===r.nodeId&&a.questionVariantId===r.questionVariantId&&a.conceptId===r.conceptId&&a.sourceView===r.sourceView));
export function withAcceptedQuestionProgramBatch1Concepts(release:SyntheticClinicalRelease):SyntheticClinicalRelease{
 const ids=new Set(release.concepts.map(c=>c.id));const add=Object.values(PROGRAM_BATCH1_VIEWS).flatMap(v=>v.concepts).filter(c=>{
  if(ids.has(c.id)||!PROGRAM_BATCH1_ROWS.some(r=>r.conceptId===c.id&&accepted(r.questionVariantId)))return false;ids.add(c.id);return true;
 });return {...release,concepts:[...release.concepts,...add]};
}
export const QUESTION_PROGRAM_BATCH1_ACCEPTED_TIMING_ENTRIES=PROGRAM_BATCH1_TIMINGS.filter(t=>accepted(t.questionVariantId));
/** Accepted-only diagnostic metadata for the runtime owner; not installed here. */
export const QUESTION_PROGRAM_BATCH1_ACCEPTED_TEST_ORDER_RECORDS=PROGRAM_BATCH1_ORDERS.filter(t=>accepted(t.questionVariantId));
export {PROGRAM_BATCH1_REPLACEMENTS as QUESTION_PROGRAM_BATCH1_REPLACEMENTS,PROGRAM_BATCH1_RETIRED_CASES as QUESTION_PROGRAM_BATCH1_RETAINED_CASES,
 PROGRAM_BATCH1_CLAIMS as QUESTION_PROGRAM_BATCH1_CLAIMS,PROGRAM_BATCH1_SOURCES as QUESTION_PROGRAM_BATCH1_SOURCES,
 PROGRAM_BATCH1_FROZEN as QUESTION_PROGRAM_BATCH1_FROZEN_PRESERVATION,PROGRAM_BATCH1_LENGTH_RESIDUALS as QUESTION_PROGRAM_BATCH1_LENGTH_RESIDUALS} from "./question-program-batch1-accepted-data-20261111";
