import type {AnswerChoiceTimingRegistryEntry, SyntheticClinicalCase} from "./schema";
import {validateSyntheticClinicalRelease} from "./schema";
import {QUESTION_FLAGS5_ROUND2_DATA as data} from "./question-flags5-round2-data-20261116";
import {
  QUESTION_FLAGS5_SOURCE_RELEASE as round1,
  QUESTION_FLAGS5_RETAINED_INPUT as original,
} from "./question-flags5-20261116";

/** Explicit-import authoring view. This module does not register or admit a
 * candidate to default play, and does not modify frozen encounter definitions. */
export const QUESTION_FLAGS5_ROUND2_SOURCE_VIEW_NAME = "flags5-round2" as const;
export const QUESTION_FLAGS5_ROUND2_REVISIONS = data.metadata;
export const QUESTION_FLAGS5_ROUND2_QUESTIONS = data.metadata.map(r => r.question);
export const QUESTION_FLAGS5_ROUND2_CLAIMS = data.claims;
export const QUESTION_FLAGS5_ROUND2_BASIS_CLAIMS = data.basisClaims;
export const QUESTION_FLAGS5_ROUND2_SOURCES = data.sources;
export const QUESTION_FLAGS5_ROUND2_STATEMENT_MAPPINGS = data.fieldMappings;
export const QUESTION_FLAGS5_ROUND2_NEW_CONCEPTS = data.newConcepts;
export const QUESTION_FLAGS5_ROUND2_FROZEN_PASSES = data.frozenPasses;
export const QUESTION_FLAGS5_ROUND2_FROZEN_FILES = data.frozenRoundOneFiles;
export const QUESTION_FLAGS5_ROUND2_SAFETY_EXCEPTION = data.safetyRecognitionException;
export const QUESTION_FLAGS5_ROUND2_CALF_HOLD = data.unresolvedCalf;
export const QUESTION_FLAGS5_ROUND2_ADDITIONAL_RETAINED_QUESTIONS = data.additionalRetainedQuestions;

const retainedConcepts = [...new Map([
  ...original.concepts,
  ...data.concepts.filter(c => data.additionalRetainedCases.some(cs =>
    cs.decisionNodes.some(n => n.primaryConceptId === c.id))),
].map(c => [c.id, c])).values()];
export const QUESTION_FLAGS5_ROUND2_RETAINED_INPUT = validateSyntheticClinicalRelease({
  ...original, id: "clinical.flags5-r2-retained.20261116.v1",
  concepts: retainedConcepts,
  cases: [...original.cases, ...data.additionalRetainedCases],
});
export const QUESTION_FLAGS5_ROUND2_SOURCE_RELEASE = validateSyntheticClinicalRelease({
  ...round1, id: "clinical.flags5-source.20261116.r2",
  concepts: data.concepts, cases: data.cases,
});
export const QUESTION_FLAGS5_ROUND2_CASES = QUESTION_FLAGS5_ROUND2_SOURCE_RELEASE.cases;
export const QUESTION_FLAGS5_ROUND2_TIMING_ENTRIES: AnswerChoiceTimingRegistryEntry[] =
  JSON.parse(JSON.stringify(data.timingEntries));
export const QUESTION_FLAGS5_ROUND2_CANDIDATE_TEST_ORDER_RECORDS =
  QUESTION_FLAGS5_ROUND2_TIMING_ENTRIES.flatMap(t => t.classification.kind !== "test_choices" ? [] :
    t.classification.choices.flatMap(c => c.timing.kind !== "test" ? [] : [{
      caseId: t.caseId, nodeId: t.nodeId, questionVariantId: t.questionVariantId,
      choiceId: c.choiceId, choiceLabel: c.choiceLabel, timingProfileId: c.timing.timingProfileId,
      disposition: {kind: "not_executed" as const, reason: "future_planned" as const},
    }]),
  );
export const QUESTION_FLAGS5_ROUND2_SOURCE_LINKS = data.sources.map(s => ({
  sourceId: s.id, href: s.officialUrl, target: "_blank" as const,
  rel: "noopener noreferrer", referrerPolicy: "no-referrer" as const,
}));

/** The guard binds actual live intake definitions, not the earlier drafts.
 * Existing frozen saves continue to carry those original bytes and meanings. */
export function applyQuestionFlags5Round2Revisions(cases: readonly SyntheticClinicalCase[]): SyntheticClinicalCase[] {
  for (const old of QUESTION_FLAGS5_ROUND2_RETAINED_INPUT.cases) {
    if (JSON.stringify(cases.find(c => c.id === old.id)) !== JSON.stringify(old)) {
      throw new Error("Flags5 round2 input changed: " + old.id);
    }
  }
  return cases.map(cs => QUESTION_FLAGS5_ROUND2_CASES.find(c => c.id === cs.id) ?? cs);
}

// Retained question/claim metadata supplies exact PASS versions and visible
// unrelated siblings to the advisory linter, without changing their definitions.
export {
  QUESTION_FLAGS5_QUESTIONS, QUESTION_FLAGS5_RETAINED_QUESTIONS,
  QUESTION_FLAGS5_CLAIMS, QUESTION_FLAGS5_BASIS_CLAIMS, QUESTION_FLAGS5_NEW_CONCEPTS,
} from "./question-flags5-20261116";
