import type {SyntheticClinicalRelease} from "./schema";
import {QUESTION_SHIP_MANIFEST} from "./question-ship-manifest";
import {QUESTION_PROGRAM_BATCH9_RUNTIME_FAMILY_CONTEXTS} from "./question-program-batch9-accepted-20261112";
import {
  PROGRAM_BATCH10_ROWS, PROGRAM_BATCH10_VIEWS, PROGRAM_BATCH10_TIMINGS,
  PROGRAM_BATCH10_ORDERS, PROGRAM_BATCH10_FAMILIES,
} from "./question-program-batch10-accepted-data-20261113";

function accepted(questionVariantId:string):boolean {
  const row = PROGRAM_BATCH10_ROWS.find(candidate => candidate.questionVariantId === questionVariantId);
  return !!row && QUESTION_SHIP_MANIFEST.accepted.some(candidate =>
    candidate.acceptanceId === row.acceptanceId && candidate.caseId === row.caseId &&
    candidate.nodeId === row.nodeId && candidate.questionVariantId === row.questionVariantId &&
    candidate.conceptId === row.conceptId && candidate.sourceView === row.sourceView);
}

export const QUESTION_PROGRAM_BATCH10_ACCEPTED_ROWS = PROGRAM_BATCH10_ROWS;
export const QUESTION_PROGRAM_BATCH10_ACCEPTED_SOURCE_VIEWS = PROGRAM_BATCH10_VIEWS;
export const QUESTION_PROGRAM_BATCH10_ACCEPTED_CASES = Object.values(PROGRAM_BATCH10_VIEWS).flatMap(view => view.cases);
export const QUESTION_PROGRAM_BATCH10_ACCEPTED_TIMING_ENTRIES = PROGRAM_BATCH10_TIMINGS.filter(row => accepted(row.questionVariantId));
export const QUESTION_PROGRAM_BATCH10_ACCEPTED_TEST_ORDER_RECORDS = PROGRAM_BATCH10_ORDERS.filter(row => accepted(row.questionVariantId));
export const QUESTION_PROGRAM_BATCH10_ACCEPTED_FAMILY_CONTEXTS = PROGRAM_BATCH10_FAMILIES.filter(family =>
  PROGRAM_BATCH10_ROWS.some(row => row.caseId === family.caseId && accepted(row.questionVariantId)));
export const QUESTION_PROGRAM_BATCH10_RUNTIME_FAMILY_CONTEXTS = [
  ...QUESTION_PROGRAM_BATCH9_RUNTIME_FAMILY_CONTEXTS,
  ...QUESTION_PROGRAM_BATCH10_ACCEPTED_FAMILY_CONTEXTS,
];

/** Preserve existing FSRS meanings and their order. The projector is the sole
 * acceptance authority. ENG-I01 owns live procedure admission. */
export function withAcceptedQuestionProgramBatch10Concepts(release:SyntheticClinicalRelease):SyntheticClinicalRelease {
  const concepts = [...release.concepts];
  for (const view of Object.values(PROGRAM_BATCH10_VIEWS)) {
    for (const concept of view.concepts) {
      const selected = PROGRAM_BATCH10_ROWS.some(row => row.conceptId === concept.id && accepted(row.questionVariantId));
      if (selected && !concepts.some(existing => existing.id === concept.id)) concepts.push(concept);
    }
  }
  return {...release, concepts};
}

export {
  PROGRAM_BATCH10_QUESTIONS as QUESTION_PROGRAM_BATCH10_ACCEPTED_QUESTIONS,
  PROGRAM_BATCH10_AUTHORED_CONCEPTS as QUESTION_PROGRAM_BATCH10_AUTHORED_CONCEPTS,
  PROGRAM_BATCH10_FROZEN as QUESTION_PROGRAM_BATCH10_FROZEN_PRESERVATION,
  PROGRAM_BATCH10_CORRECTIONS as QUESTION_PROGRAM_BATCH10_PRESENTATION_CORRECTIONS,
  PROGRAM_BATCH10_CLAIMS as QUESTION_PROGRAM_BATCH10_CLAIMS,
  PROGRAM_BATCH10_SOURCES as QUESTION_PROGRAM_BATCH10_SOURCES,
} from "./question-program-batch10-accepted-data-20261113";
