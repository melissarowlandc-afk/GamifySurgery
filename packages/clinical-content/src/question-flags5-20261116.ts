import type {AnswerChoiceTimingRegistryEntry, SyntheticClinicalCase} from "./schema";
import {validateSyntheticClinicalRelease} from "./schema";
import {QUESTION_FLAGS5_DATA as data} from "./question-flags5-data-20261116";
import {QUESTION_FLAGS5_RETAINED_INPUT} from "./question-flags5-retained-20261116";

/** Explicit-import authoring view. Manager-run independent review precedes
 * manifest admission; importing this module never changes the default release. */
export const QUESTION_FLAGS5_SOURCE_VIEW_NAME = "flags5-round1" as const;
export const QUESTION_FLAGS5_REVISIONS = data.revisions;
export const QUESTION_FLAGS5_QUESTIONS = data.revisions.map(r => r.question);
export const QUESTION_FLAGS5_CLAIMS = data.applicationClaims;
export const QUESTION_FLAGS5_NEW_CONCEPTS = data.newConcepts;
export const QUESTION_FLAGS5_SOURCES = data.sources;
export const QUESTION_FLAGS5_STATEMENT_MAPPINGS = data.fieldMappings;
export const QUESTION_FLAGS5_SOURCE_RELEASE = validateSyntheticClinicalRelease(data.release);
export const QUESTION_FLAGS5_CASES = QUESTION_FLAGS5_SOURCE_RELEASE.cases;
export const QUESTION_FLAGS5_TIMING_ENTRIES: AnswerChoiceTimingRegistryEntry[] =
  JSON.parse(JSON.stringify(data.timings));
/** Exact-label estimates and nonexecuted order proposals for later acceptance.
 * Existing executed result gates remain on the cloned cases. No global timing
 * registry, service implementation or manifest is changed by these proposals. */
export const QUESTION_FLAGS5_CANDIDATE_TEST_ORDER_RECORDS =
  QUESTION_FLAGS5_TIMING_ENTRIES.flatMap(t => {
    if (!QUESTION_FLAGS5_REVISIONS.some(r => r.questionVariantId === t.questionVariantId)
        || t.classification.kind !== "test_choices") return [];
    return t.classification.choices.flatMap(c => c.timing.kind === "test" ? [{
      caseId: t.caseId, nodeId: t.nodeId, questionVariantId: t.questionVariantId,
      choiceId: c.choiceId, choiceLabel: c.choiceLabel,
      timingProfileId: c.timing.timingProfileId,
      disposition: {kind: "not_executed" as const, reason: "future_planned" as const},
    }] : []);
  });
export const QUESTION_FLAGS5_SOURCE_LINKS = data.sources.map(s => ({
  sourceId: s.id, href: s.officialUrl, target: "_blank" as const,
  rel: "noopener noreferrer", referrerPolicy: "no-referrer" as const,
}));

/** Exact authoring composition guard. Frozen encounters retain their original
 * case bytes and concept IDs; there is no gameplay acceptance check here. */
export function applyQuestionFlags5Revisions(cases: readonly SyntheticClinicalCase[]): SyntheticClinicalCase[] {
  for (const old of QUESTION_FLAGS5_RETAINED_INPUT.cases) {
    if (JSON.stringify(cases.find(c => c.id === old.id)) !== JSON.stringify(old)) {
      throw new Error("Flags5 input changed: " + old.id);
    }
  }
  return cases.map(c => QUESTION_FLAGS5_CASES.find(candidate => candidate.id === c.id) ?? c);
}

export {QUESTION_FLAGS5_RETAINED_INPUT, QUESTION_FLAGS5_RETAINED_QUESTIONS,
  QUESTION_FLAGS5_BASIS_CLAIMS} from "./question-flags5-retained-20261116";
