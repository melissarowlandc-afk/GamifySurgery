import type {SyntheticClinicalRelease} from "./schema";
import {QUESTION_SHIP_MANIFEST} from "./question-ship-manifest";
import {QUESTION_PROGRAM_BATCH6_RUNTIME_FAMILY_CONTEXTS} from "./question-program-batch6-accepted-20261112";
import {PROGRAM_BATCH9_ROWS, PROGRAM_BATCH9_VIEWS, PROGRAM_BATCH9_TIMINGS, PROGRAM_BATCH9_ORDERS,
  PROGRAM_BATCH9_FAMILIES} from "./question-program-batch9-accepted-data-20261112";

function accepted(id:string):boolean {
  const row=PROGRAM_BATCH9_ROWS.find(r=>r.questionVariantId===id);
  return !!row&&QUESTION_SHIP_MANIFEST.accepted.some(r=>r.acceptanceId===row.acceptanceId&&r.caseId===row.caseId&&
    r.nodeId===row.nodeId&&r.questionVariantId===row.questionVariantId&&r.conceptId===row.conceptId&&r.sourceView===row.sourceView);
}
export const QUESTION_PROGRAM_BATCH9_ACCEPTED_ROWS=PROGRAM_BATCH9_ROWS;
export const QUESTION_PROGRAM_BATCH9_ACCEPTED_SOURCE_VIEWS=PROGRAM_BATCH9_VIEWS;
export const QUESTION_PROGRAM_BATCH9_ACCEPTED_CASES=Object.values(PROGRAM_BATCH9_VIEWS).flatMap(v=>v.cases);
export const QUESTION_PROGRAM_BATCH9_ACCEPTED_TIMING_ENTRIES=PROGRAM_BATCH9_TIMINGS.filter(t=>accepted(t.questionVariantId));
export const QUESTION_PROGRAM_BATCH9_ACCEPTED_TEST_ORDER_RECORDS=PROGRAM_BATCH9_ORDERS.filter(t=>accepted(t.questionVariantId));
export const QUESTION_PROGRAM_BATCH9_ACCEPTED_FAMILY_CONTEXTS=PROGRAM_BATCH9_FAMILIES.filter(f=>
  PROGRAM_BATCH9_ROWS.some(r=>r.caseId===f.caseId&&accepted(r.questionVariantId)));
export const QUESTION_PROGRAM_BATCH9_RUNTIME_FAMILY_CONTEXTS=[...QUESTION_PROGRAM_BATCH6_RUNTIME_FAMILY_CONTEXTS,
  ...QUESTION_PROGRAM_BATCH9_ACCEPTED_FAMILY_CONTEXTS];

/** The manifest remains the only acceptance authority; existing FSRS meanings
 * and their order are unchanged. Live admission belongs exclusively to ENG-I01. */
export function withAcceptedQuestionProgramBatch9Concepts(release:SyntheticClinicalRelease):SyntheticClinicalRelease {
  const concepts=[...release.concepts];
  for(const view of Object.values(PROGRAM_BATCH9_VIEWS))for(const c of view.concepts)
    if(!concepts.some(p=>p.id===c.id)&&PROGRAM_BATCH9_ROWS.some(r=>r.conceptId===c.id&&accepted(r.questionVariantId)))concepts.push(c);
  return {...release,concepts};
}
export {PROGRAM_BATCH9_QUESTIONS as QUESTION_PROGRAM_BATCH9_ACCEPTED_QUESTIONS,
  PROGRAM_BATCH9_AUTHORED_CONCEPTS as QUESTION_PROGRAM_BATCH9_AUTHORED_CONCEPTS,
  PROGRAM_BATCH9_FROZEN as QUESTION_PROGRAM_BATCH9_FROZEN_PRESERVATION,
  PROGRAM_BATCH9_CORRECTIONS as QUESTION_PROGRAM_BATCH9_PRESENTATION_CORRECTIONS,
  PROGRAM_BATCH9_CLAIMS as QUESTION_PROGRAM_BATCH9_CLAIMS,
  PROGRAM_BATCH9_SOURCES as QUESTION_PROGRAM_BATCH9_SOURCES} from "./question-program-batch9-accepted-data-20261112";
