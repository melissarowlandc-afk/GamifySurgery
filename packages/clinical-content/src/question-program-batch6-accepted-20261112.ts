import type {AnswerChoiceTimingRegistryEntry, SyntheticClinicalRelease} from "./schema";
import {QUESTION_SHIP_MANIFEST} from "./question-ship-manifest";
import {PROGRAM_BATCH6_ROWS,PROGRAM_BATCH6_VIEWS,PROGRAM_BATCH6_TIMINGS,PROGRAM_BATCH6_ORDERS,PROGRAM_BATCH6_FAMILY_CONTEXTS} from "./question-program-batch6-accepted-data-20261112";
import {PEDIATRIC_CLINIC_FAMILY_CONTEXTS as originalFamilies} from "./development-batch/2026-10-08-pediatric-clinic/pediatric-clinic-batch";
export const QUESTION_PROGRAM_BATCH6_ACCEPTED_ROWS = PROGRAM_BATCH6_ROWS;
export const QUESTION_PROGRAM_BATCH6_ACCEPTED_SOURCE_VIEWS = PROGRAM_BATCH6_VIEWS;
export const QUESTION_PROGRAM_BATCH6_ACCEPTED_CASES = Object.values(PROGRAM_BATCH6_VIEWS).flatMap(view => view.cases);
function accepted(questionId: string) {
  const row = PROGRAM_BATCH6_ROWS.find(candidate => candidate.questionVariantId === questionId);
  return !!row && QUESTION_SHIP_MANIFEST.accepted.some(candidate =>
    candidate.acceptanceId === row.acceptanceId && candidate.caseId === row.caseId && candidate.nodeId === row.nodeId &&
    candidate.questionVariantId === row.questionVariantId && candidate.conceptId === row.conceptId && candidate.sourceView === row.sourceView);
}
export function withAcceptedQuestionProgramBatch6Concepts(release: SyntheticClinicalRelease): SyntheticClinicalRelease {
  const known = new Set(release.concepts.map(concept => concept.id));
  const additions = Object.values(PROGRAM_BATCH6_VIEWS).flatMap(view => view.concepts).filter(concept => {
    if (known.has(concept.id) || !PROGRAM_BATCH6_ROWS.some(row => row.conceptId === concept.id && accepted(row.questionVariantId))) return false;
    known.add(concept.id);
    return true;
  });
  return {...release, concepts:[...release.concepts, ...additions]};
}
// Manager decision 2026-11-12: outside-record testing choices retain runtime
// estimates. This preview-only overlay leaves the reviewed source archive intact.
const runtimeWaitRecords = [
  {
    "caseId": "case.pediatric-neck-thoracic-gu.20261111.node-sample-salvage.v1",
    "nodeId": "node.pediatric-neck-thoracic-gu.20261111.node-sample",
    "questionVariantId": "question.pediatric-neck-thoracic-gu.20261111.node-sample.v1",
    "choiceId": "choice.pediatric-neck-thoracic-gu.20261111.node-sample.excision",
    "choiceLabel": "Excisional biopsy of the cervical node",
    "timingProfileId": "timing.test.biopsy",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.pediatric-neck-thoracic-gu.20261111.node-sample-salvage.v1",
    "nodeId": "node.pediatric-neck-thoracic-gu.20261111.node-sample",
    "questionVariantId": "question.pediatric-neck-thoracic-gu.20261111.node-sample.v1",
    "choiceId": "choice.pediatric-neck-thoracic-gu.20261111.node-sample.fna",
    "choiceLabel": "Repeat fine-needle aspiration of the cervical node",
    "timingProfileId": "timing.test.biopsy",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.pediatric-neck-thoracic-gu.20261111.mediastinal-biopsy-salvage.v1",
    "nodeId": "node.pediatric-neck-thoracic-gu.20261111.mediastinal-biopsy",
    "questionVariantId": "question.pediatric-neck-thoracic-gu.20261111.mediastinal-biopsy.v1",
    "choiceId": "choice.pediatric-neck-thoracic-gu.20261111.mediastinal-biopsy.peripheral",
    "choiceLabel": "Cervical-node excision with local anesthesia",
    "timingProfileId": "timing.test.biopsy",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.pediatric-neck-thoracic-gu.20261111.mediastinal-biopsy-salvage.v1",
    "nodeId": "node.pediatric-neck-thoracic-gu.20261111.mediastinal-biopsy",
    "questionVariantId": "question.pediatric-neck-thoracic-gu.20261111.mediastinal-biopsy.v1",
    "choiceId": "choice.pediatric-neck-thoracic-gu.20261111.mediastinal-biopsy.thoracoscopy",
    "choiceLabel": "Mediastinal thoracoscopy with general anesthesia",
    "timingProfileId": "timing.test.biopsy",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.pediatric-neck-thoracic-gu.20261111.mediastinal-biopsy-salvage.v1",
    "nodeId": "node.pediatric-neck-thoracic-gu.20261111.mediastinal-biopsy",
    "questionVariantId": "question.pediatric-neck-thoracic-gu.20261111.mediastinal-biopsy.v1",
    "choiceId": "choice.pediatric-neck-thoracic-gu.20261111.mediastinal-biopsy.core",
    "choiceLabel": "Mediastinal core biopsy with deep sedation",
    "timingProfileId": "timing.test.biopsy",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.pediatric-neck-thoracic-gu.20261111.dsd-assessment-salvage.v1",
    "nodeId": "node.pediatric-neck-thoracic-gu.20261111.dsd-assessment.v2",
    "questionVariantId": "question.pediatric-neck-thoracic-gu.20261111.dsd-assessment.v2",
    "choiceId": "choice.pediatric-neck-thoracic-gu.20261111.dsd-assessment.v2.17ohp",
    "choiceLabel": "Baseline serum 17-hydroxyprogesterone",
    "timingProfileId": "timing.test.advanced_diagnostic",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.pediatric-neck-thoracic-gu.20261111.dsd-assessment-salvage.v1",
    "nodeId": "node.pediatric-neck-thoracic-gu.20261111.dsd-assessment.v2",
    "questionVariantId": "question.pediatric-neck-thoracic-gu.20261111.dsd-assessment.v2",
    "choiceId": "choice.pediatric-neck-thoracic-gu.20261111.dsd-assessment.v2.amh",
    "choiceLabel": "Baseline serum anti-Mullerian hormone",
    "timingProfileId": "timing.test.advanced_diagnostic",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  },
  {
    "caseId": "case.pediatric-neck-thoracic-gu.20261111.dsd-assessment-salvage.v1",
    "nodeId": "node.pediatric-neck-thoracic-gu.20261111.dsd-assessment.v2",
    "questionVariantId": "question.pediatric-neck-thoracic-gu.20261111.dsd-assessment.v2",
    "choiceId": "choice.pediatric-neck-thoracic-gu.20261111.dsd-assessment.v2.stimulated",
    "choiceLabel": "Cosyntropin-stimulated adrenal steroid profile",
    "timingProfileId": "timing.test.combined_diagnostic",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    }
  }
] as const;
export const QUESTION_PROGRAM_BATCH6_ACCEPTED_TEST_ORDER_RECORDS = [...PROGRAM_BATCH6_ORDERS, ...runtimeWaitRecords]
  .filter(row => accepted(row.questionVariantId));
export const QUESTION_PROGRAM_BATCH6_ACCEPTED_TIMING_ENTRIES: AnswerChoiceTimingRegistryEntry[] = PROGRAM_BATCH6_TIMINGS
  .filter(row => accepted(row.questionVariantId)).map(entry => {
    const planned = QUESTION_PROGRAM_BATCH6_ACCEPTED_TEST_ORDER_RECORDS.filter(row =>
      row.caseId === entry.caseId && row.nodeId === entry.nodeId && row.questionVariantId === entry.questionVariantId);
    if (!planned.length) return entry;
    const node = QUESTION_PROGRAM_BATCH6_ACCEPTED_CASES.find(cs => cs.id === entry.caseId)?.decisionNodes.find(node =>
      node.id === entry.nodeId && node.questionVariantId === entry.questionVariantId);
    if (!node) throw new Error("Batch 6 runtime wait metadata requires its exact accepted node.");
    return {...entry, classification: {kind: "test_choices", choices: node.answerChoices.map(choice => {
      const binding = planned.find(row => row.choiceId === choice.id && row.choiceLabel === choice.label);
      return {choiceId: choice.id, choiceLabel: choice.label, timing: binding
        ? {kind: "test", timingProfileId: binding.timingProfileId} : {kind: "no_test"}};
    })}};
  });
export const QUESTION_PROGRAM_BATCH6_ACCEPTED_FAMILY_CONTEXTS = PROGRAM_BATCH6_FAMILY_CONTEXTS.filter(row => accepted(row.questionVariantId));
export const QUESTION_PROGRAM_BATCH6_RUNTIME_FAMILY_CONTEXTS = [...originalFamilies,...QUESTION_PROGRAM_BATCH6_ACCEPTED_FAMILY_CONTEXTS];
export {PROGRAM_BATCH6_QUESTIONS as QUESTION_PROGRAM_BATCH6_ACCEPTED_QUESTIONS,
  PROGRAM_BATCH6_AUTHORED_CONCEPTS as QUESTION_PROGRAM_BATCH6_AUTHORED_CONCEPTS,
  PROGRAM_BATCH6_REPLACEMENTS as QUESTION_PROGRAM_BATCH6_REPLACEMENTS,
  PROGRAM_BATCH6_CONSOLIDATIONS as QUESTION_PROGRAM_BATCH6_CONSOLIDATIONS,
  PROGRAM_BATCH6_RETIRED_CASES as QUESTION_PROGRAM_BATCH6_RETAINED_CASES,
  PROGRAM_BATCH6_CLAIMS as QUESTION_PROGRAM_BATCH6_CLAIMS,PROGRAM_BATCH6_SOURCES as QUESTION_PROGRAM_BATCH6_SOURCES,
  PROGRAM_BATCH6_FROZEN as QUESTION_PROGRAM_BATCH6_FROZEN_PRESERVATION,
  PROGRAM_BATCH6_LENGTH_RESIDUALS as QUESTION_PROGRAM_BATCH6_LENGTH_RESIDUALS} from "./question-program-batch6-accepted-data-20261112";
