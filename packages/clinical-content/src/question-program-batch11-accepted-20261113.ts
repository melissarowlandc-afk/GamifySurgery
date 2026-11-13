import type {SyntheticClinicalRelease} from "./schema";
import {QUESTION_SHIP_MANIFEST} from "./question-ship-manifest";

import {
  PROGRAM_BATCH11_ROWS, PROGRAM_BATCH11_VIEWS, PROGRAM_BATCH11_TIMINGS,
  PROGRAM_BATCH11_ORDERS,
} from "./question-program-batch11-accepted-data-20261113";

function accepted(questionVariantId:string):boolean {
  const row = PROGRAM_BATCH11_ROWS.find(candidate => candidate.questionVariantId === questionVariantId);
  return !!row && QUESTION_SHIP_MANIFEST.accepted.some(candidate =>
    candidate.acceptanceId === row.acceptanceId && candidate.caseId === row.caseId &&
    candidate.nodeId === row.nodeId && candidate.questionVariantId === row.questionVariantId &&
    candidate.conceptId === row.conceptId && candidate.sourceView === row.sourceView);
}

export const QUESTION_PROGRAM_BATCH11_ACCEPTED_ROWS = PROGRAM_BATCH11_ROWS;
export const QUESTION_PROGRAM_BATCH11_ACCEPTED_SOURCE_VIEWS = PROGRAM_BATCH11_VIEWS;
export const QUESTION_PROGRAM_BATCH11_ACCEPTED_CASES = Object.values(PROGRAM_BATCH11_VIEWS).flatMap(view => view.cases);
export const QUESTION_PROGRAM_BATCH11_ACCEPTED_TIMING_ENTRIES = PROGRAM_BATCH11_TIMINGS.filter(row => accepted(row.questionVariantId));
export const QUESTION_PROGRAM_BATCH11_ACCEPTED_TEST_ORDER_RECORDS = PROGRAM_BATCH11_ORDERS.filter(row => accepted(row.questionVariantId));
/** Preserve existing FSRS meanings and their order. The projector is the sole
 * acceptance authority. ENG-I01 owns live procedure admission. */
export function withAcceptedQuestionProgramBatch11Concepts(release:SyntheticClinicalRelease):SyntheticClinicalRelease {
  const concepts = [...release.concepts];
  for (const view of Object.values(PROGRAM_BATCH11_VIEWS)) {
    for (const concept of view.concepts) {
      const selected = PROGRAM_BATCH11_ROWS.some(row => row.conceptId === concept.id && accepted(row.questionVariantId));
      if (selected && !concepts.some(existing => existing.id === concept.id)) concepts.push(concept);
    }
  }
  return {...release, concepts};
}

export {
  PROGRAM_BATCH11_QUESTIONS as QUESTION_PROGRAM_BATCH11_ACCEPTED_QUESTIONS,
  PROGRAM_BATCH11_AUTHORED_CONCEPTS as QUESTION_PROGRAM_BATCH11_AUTHORED_CONCEPTS,
  PROGRAM_BATCH11_FROZEN as QUESTION_PROGRAM_BATCH11_FROZEN_PRESERVATION,
  PROGRAM_BATCH11_CORRECTIONS as QUESTION_PROGRAM_BATCH11_PRESENTATION_CORRECTIONS,
  PROGRAM_BATCH11_CLAIMS as QUESTION_PROGRAM_BATCH11_CLAIMS,
  PROGRAM_BATCH11_SOURCES as QUESTION_PROGRAM_BATCH11_SOURCES,
} from "./question-program-batch11-accepted-data-20261113";
