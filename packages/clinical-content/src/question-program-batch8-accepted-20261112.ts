import type {AnswerChoiceTimingRegistryEntry, SyntheticClinicalRelease} from "./schema";
import {QUESTION_SHIP_MANIFEST} from "./question-ship-manifest";
import {
  PROGRAM_BATCH8_ROWS, PROGRAM_BATCH8_VIEWS, PROGRAM_BATCH8_TIMINGS, PROGRAM_BATCH8_ORDERS,
  PROGRAM_BATCH8_RETAINED_TIMINGS, PROGRAM_BATCH8_RETAINED_CONCEPTS,
} from "./question-program-batch8-accepted-data-20261112";

export const QUESTION_PROGRAM_BATCH8_ACCEPTED_ROWS=PROGRAM_BATCH8_ROWS;
export const QUESTION_PROGRAM_BATCH8_ACCEPTED_SOURCE_VIEWS=PROGRAM_BATCH8_VIEWS;
export const QUESTION_PROGRAM_BATCH8_ACCEPTED_CASES=Object.values(PROGRAM_BATCH8_VIEWS).flatMap(v=>v.cases);
function accepted(id:string){const r=PROGRAM_BATCH8_ROWS.find(r=>r.questionVariantId===id);
  return !!r&&QUESTION_SHIP_MANIFEST.accepted.some(a=>a.acceptanceId===r.acceptanceId&&a.caseId===r.caseId&&
    a.nodeId===r.nodeId&&a.questionVariantId===r.questionVariantId&&a.conceptId===r.conceptId&&a.sourceView===r.sourceView);}

/** Keep published concept records/history while adding only exact accepted new IDs. */
export function withAcceptedQuestionProgramBatch8Concepts(release:SyntheticClinicalRelease):SyntheticClinicalRelease{
  const concepts=[...release.concepts];
  for(const {index,entry}of PROGRAM_BATCH8_RETAINED_CONCEPTS)
    if(!concepts.some(c=>c.id===entry.id))concepts.splice(index,0,entry);
  for(const c of Object.values(PROGRAM_BATCH8_VIEWS).flatMap(v=>v.concepts))
    if(!concepts.some(p=>p.id===c.id)&&PROGRAM_BATCH8_ROWS.some(r=>r.conceptId===c.id&&accepted(r.questionVariantId)))concepts.push(c);
  return {...release,concepts};
}

/** Withdrawing a fresh authority row must not withdraw its frozen wait tuple.
 * Reinsert only the five captured historical tuples at their original offsets.
 * All other rows, including later appends, are retained as supplied. */
export function restoreQuestionProgramBatch8HistoricalTimings(registry:AnswerChoiceTimingRegistryEntry[]):void{
  for(const {index,entry}of PROGRAM_BATCH8_RETAINED_TIMINGS){
    const matches=registry.filter(t=>t.caseId===entry.caseId&&t.nodeId===entry.nodeId&&t.questionVariantId===entry.questionVariantId);
    if(!matches.length)registry.splice(index,0,entry);
    else if(matches.length!==1||JSON.stringify(matches[0])!==JSON.stringify(entry))
      throw new Error("Conflicting frozen batch8 predecessor timing: "+entry.questionVariantId);
  }
}
export const QUESTION_PROGRAM_BATCH8_ACCEPTED_TIMING_ENTRIES=PROGRAM_BATCH8_TIMINGS.filter(t=>accepted(t.questionVariantId));
export const QUESTION_PROGRAM_BATCH8_ACCEPTED_TEST_ORDER_RECORDS=PROGRAM_BATCH8_ORDERS.filter(t=>accepted(t.questionVariantId));
export {PROGRAM_BATCH8_QUESTIONS as QUESTION_PROGRAM_BATCH8_ACCEPTED_QUESTIONS,
  PROGRAM_BATCH8_AUTHORED_CONCEPTS as QUESTION_PROGRAM_BATCH8_AUTHORED_CONCEPTS,
  PROGRAM_BATCH8_RETAINED_CASES as QUESTION_PROGRAM_BATCH8_RETAINED_CASES,
  PROGRAM_BATCH8_RETAINED_ORDERS as QUESTION_PROGRAM_BATCH8_RETAINED_TEST_ORDER_RECORDS,
  PROGRAM_BATCH8_REPLACED_ROWS as QUESTION_PROGRAM_BATCH8_WITHDRAWN_ROWS,
  PROGRAM_BATCH8_RETIREMENTS as QUESTION_PROGRAM_BATCH8_RETIREMENTS,
  PROGRAM_BATCH8_DIRECTIONS as QUESTION_PROGRAM_BATCH8_OWNER_DIRECTIONS,
  PROGRAM_BATCH8_FROZEN as QUESTION_PROGRAM_BATCH8_FROZEN_PRESERVATION,
  PROGRAM_BATCH8_CLAIMS as QUESTION_PROGRAM_BATCH8_CLAIMS,
  PROGRAM_BATCH8_SOURCES as QUESTION_PROGRAM_BATCH8_SOURCES} from "./question-program-batch8-accepted-data-20261112";
