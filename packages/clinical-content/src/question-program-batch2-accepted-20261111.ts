import type {SyntheticClinicalRelease} from "./schema";
import {QUESTION_SHIP_MANIFEST} from "./question-ship-manifest";
import {PROGRAM_BATCH2_ROWS,PROGRAM_BATCH2_VIEWS,PROGRAM_BATCH2_TIMINGS,PROGRAM_BATCH2_ORDERS} from "./question-program-batch2-accepted-data-20261111";
export const QUESTION_PROGRAM_BATCH2_ACCEPTED_ROWS = PROGRAM_BATCH2_ROWS;
export const QUESTION_PROGRAM_BATCH2_ACCEPTED_SOURCE_VIEWS = PROGRAM_BATCH2_VIEWS;
export const QUESTION_PROGRAM_BATCH2_ACCEPTED_CASES = Object.values(PROGRAM_BATCH2_VIEWS).flatMap(view => view.cases);
function accepted(questionId: string) {
  const row = PROGRAM_BATCH2_ROWS.find(candidate => candidate.questionVariantId === questionId);
  return !!row && QUESTION_SHIP_MANIFEST.accepted.some(candidate =>
    candidate.acceptanceId === row.acceptanceId && candidate.caseId === row.caseId && candidate.nodeId === row.nodeId &&
    candidate.questionVariantId === row.questionVariantId && candidate.conceptId === row.conceptId && candidate.sourceView === row.sourceView);
}
export function withAcceptedQuestionProgramBatch2Concepts(release: SyntheticClinicalRelease): SyntheticClinicalRelease {
  const known = new Set(release.concepts.map(concept => concept.id));
  const additions = Object.values(PROGRAM_BATCH2_VIEWS).flatMap(view => view.concepts).filter(concept => {
    if (known.has(concept.id) || !PROGRAM_BATCH2_ROWS.some(row => row.conceptId === concept.id && accepted(row.questionVariantId))) return false;
    known.add(concept.id);
    return true;
  });
  return {...release, concepts:[...release.concepts, ...additions]};
}
export const QUESTION_PROGRAM_BATCH2_ACCEPTED_TIMING_ENTRIES = PROGRAM_BATCH2_TIMINGS.filter(row => accepted(row.questionVariantId));
export const QUESTION_PROGRAM_BATCH2_ACCEPTED_TEST_ORDER_RECORDS = PROGRAM_BATCH2_ORDERS.filter(row => accepted(row.questionVariantId));
export {PROGRAM_BATCH2_QUESTIONS as QUESTION_PROGRAM_BATCH2_ACCEPTED_QUESTIONS,
  PROGRAM_BATCH2_AUTHORED_CONCEPTS as QUESTION_PROGRAM_BATCH2_AUTHORED_CONCEPTS,
  PROGRAM_BATCH2_REPLACEMENTS as QUESTION_PROGRAM_BATCH2_REPLACEMENTS,
  PROGRAM_BATCH2_CONSOLIDATIONS as QUESTION_PROGRAM_BATCH2_CONSOLIDATIONS,
  PROGRAM_BATCH2_RETIRED_CASES as QUESTION_PROGRAM_BATCH2_RETAINED_CASES,
  PROGRAM_BATCH2_CLAIMS as QUESTION_PROGRAM_BATCH2_CLAIMS,PROGRAM_BATCH2_SOURCES as QUESTION_PROGRAM_BATCH2_SOURCES,
  PROGRAM_BATCH2_FROZEN as QUESTION_PROGRAM_BATCH2_FROZEN_PRESERVATION,
  PROGRAM_BATCH2_LENGTH_RESIDUALS as QUESTION_PROGRAM_BATCH2_LENGTH_RESIDUALS} from "./question-program-batch2-accepted-data-20261111";
