import type { AnswerChoiceTimingRegistryEntry, SyntheticClinicalCase, SyntheticClinicalRelease, TestedConcept } from "./schema";
import { applyQuestionBankBatch2aRevisions } from "./question-bank-batch2a-20261104";
import { questionQualityTimingRevisions } from "./question-quality-pilot-20261028";
import { QUESTION_FLAGS2_DEFINITIONS, QUESTION_FLAGS2_CONCEPT_VERSIONS } from "./question-flags2-20261105-data";
import { validateSyntheticClinicalRelease } from "./schema";
import { QUESTION_FLAGS2_RETAINED_INPUT, QUESTION_FLAGS2_RETAINED_TIMING_INPUTS } from "./question-flags2-retained-input-20261105";

export const QUESTION_FLAGS2_REVISIONS = QUESTION_FLAGS2_DEFINITIONS;
export const QUESTION_FLAGS2_QUESTIONS = QUESTION_FLAGS2_REVISIONS.map(r => r.question);
export const QUESTION_FLAGS2_AUTHORING_CONCEPTS = QUESTION_FLAGS2_CONCEPT_VERSIONS;
export const QUESTION_FLAGS2_TESTED_CONCEPTS: TestedConcept[] = QUESTION_FLAGS2_AUTHORING_CONCEPTS.map(
  ({id, displayName, learningObjective, earliestFacilityStage, conceptType}) => ({id, displayName, learningObjective, earliestFacilityStage, conceptType}),
);
export const QUESTION_FLAGS2_SOURCE_VIEW_NAME = "flags2-round1" as const;

/** Only fresh candidate projections: source tuples, old definitions and saves are retained. */
export function applyQuestionFlags2Revisions(cases: SyntheticClinicalCase[]): SyntheticClinicalCase[] {
  return applyQuestionBankBatch2aRevisions(cases, QUESTION_FLAGS2_REVISIONS);
}

/** Manager registers this view on acceptance; this factory never admits a node. */
export function createQuestionFlags2SourceView(release: SyntheticClinicalRelease): SyntheticClinicalRelease {
  const existing = new Set(release.concepts.map(c => c.id));
  return {...release,
    concepts: [...release.concepts, ...QUESTION_FLAGS2_TESTED_CONCEPTS.filter(c => !existing.has(c.id))],
    cases: applyQuestionFlags2Revisions(release.cases),
  };
}

/** Exact estimates for the retained candidate view; no duration appears in authored prose. */
export function questionFlags2TimingRevisions(entries: AnswerChoiceTimingRegistryEntry[]): AnswerChoiceTimingRegistryEntry[] {
  return questionQualityTimingRevisions(entries, QUESTION_FLAGS2_REVISIONS);
}

/** A scoped, self-contained retained view: no import of the live projection and
 * no automatic publication, selector registration or acceptance. Manager may
 * register this exact view as `flags2-round1` after reviewing exact tuples. */
export const QUESTION_FLAGS2_ROUND1_SOURCE_RELEASE = validateSyntheticClinicalRelease(
  createQuestionFlags2SourceView(QUESTION_FLAGS2_RETAINED_INPUT),
);
export const QUESTION_FLAGS2_TIMING_ENTRIES = questionFlags2TimingRevisions(QUESTION_FLAGS2_RETAINED_TIMING_INPUTS);

export { QUESTION_FLAGS2_CLAIMS } from "./question-flags2-evidence-20261105";
export { QUESTION_FLAGS2_RETAINED_INPUT, QUESTION_FLAGS2_RETAINED_TIMING_INPUTS, QUESTION_FLAGS2_CANDIDATE_TEST_ORDER_RECORDS } from "./question-flags2-retained-input-20261105";
