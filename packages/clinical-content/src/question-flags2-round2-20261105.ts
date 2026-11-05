import type { AnswerChoiceTimingRegistryEntry, SyntheticClinicalCase, SyntheticClinicalRelease, TestedConcept } from "./schema";
import { validateSyntheticClinicalRelease } from "./schema";
import { applyQuestionBankBatch2aRevisions } from "./question-bank-batch2a-20261104";
import { questionQualityTimingRevisions } from "./question-quality-pilot-20261028";
import { QUESTION_FLAGS2_ROUND2_DEFINITIONS, QUESTION_FLAGS2_ROUND2_CONCEPT_VERSIONS } from "./question-flags2-round2-20261105-data";
import { QUESTION_FLAGS2_ROUND2_RETAINED_INPUT, QUESTION_FLAGS2_ROUND2_RETAINED_TIMINGS } from "./question-flags2-round2-retained-input-20261105";

export const QUESTION_FLAGS2_ROUND2_REVISIONS = QUESTION_FLAGS2_ROUND2_DEFINITIONS;
export const QUESTION_FLAGS2_ROUND2_QUESTIONS = QUESTION_FLAGS2_ROUND2_REVISIONS.map(r => r.question);
export const QUESTION_FLAGS2_ROUND2_AUTHORING_CONCEPTS = QUESTION_FLAGS2_ROUND2_CONCEPT_VERSIONS;
export const QUESTION_FLAGS2_ROUND2_TESTED_CONCEPTS: TestedConcept[] = QUESTION_FLAGS2_ROUND2_AUTHORING_CONCEPTS.map(
  ({id, displayName, learningObjective, earliestFacilityStage, conceptType}) => ({id, displayName, learningObjective, earliestFacilityStage, conceptType}),
);
export const QUESTION_FLAGS2_ROUND2_SOURCE_VIEW_NAME = "flags2-round2" as const;

export function applyQuestionFlags2Round2Revisions(cases: SyntheticClinicalCase[]): SyntheticClinicalCase[] {
  return applyQuestionBankBatch2aRevisions(cases, QUESTION_FLAGS2_ROUND2_REVISIONS);
}

/** Independent retained drafts: no live projection, acceptance or historical-card mutation. */
export function createQuestionFlags2Round2SourceView(release: SyntheticClinicalRelease): SyntheticClinicalRelease {
  const existing = new Set(release.concepts.map(c => c.id));
  return {...release, concepts: [...release.concepts, ...QUESTION_FLAGS2_ROUND2_TESTED_CONCEPTS.filter(c => !existing.has(c.id))],
    cases: applyQuestionFlags2Round2Revisions(release.cases)};
}
export const QUESTION_FLAGS2_ROUND2_SOURCE_RELEASE = validateSyntheticClinicalRelease(createQuestionFlags2Round2SourceView(QUESTION_FLAGS2_ROUND2_RETAINED_INPUT));
export function questionFlags2Round2TimingRevisions(entries: AnswerChoiceTimingRegistryEntry[]): AnswerChoiceTimingRegistryEntry[] {
  return questionQualityTimingRevisions(entries, QUESTION_FLAGS2_ROUND2_REVISIONS);
}
export const QUESTION_FLAGS2_ROUND2_TIMING_ENTRIES = questionFlags2Round2TimingRevisions(QUESTION_FLAGS2_ROUND2_RETAINED_TIMINGS);

export { QUESTION_FLAGS2_ROUND2_CLAIMS } from "./question-flags2-round2-evidence-20261105";
export { QUESTION_FLAGS2_ROUND2_RETAINED_INPUT, QUESTION_FLAGS2_ROUND2_RETAINED_TIMINGS, QUESTION_FLAGS2_ROUND2_CANDIDATE_TEST_ORDER_RECORDS } from "./question-flags2-round2-retained-input-20261105";
