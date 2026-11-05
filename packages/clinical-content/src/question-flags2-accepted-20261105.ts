import type { SyntheticClinicalRelease } from "./schema";
import { QUESTION_SHIP_MANIFEST } from "./question-ship-manifest";
import { QUESTION_FLAGS2_REVISIONS, QUESTION_FLAGS2_ROUND1_SOURCE_RELEASE, QUESTION_FLAGS2_TIMING_ENTRIES } from "./question-flags2-20261105";

// The manager accepts the exact independently passed G06 only. A draft source
// view and its other question/concept/timing definitions do not grant admission.
const g06 = QUESTION_FLAGS2_REVISIONS.find(r => r.auditId === "G06")!;
const accepted = QUESTION_SHIP_MANIFEST.accepted.some(row => row.acceptanceId === "G06" &&
  row.caseId === g06.caseId && row.nodeId === g06.nodeId &&
  row.questionVariantId === g06.questionVariantId && row.conceptId === g06.question.conceptId &&
  row.sourceView === "flags2-round1");

export function withAcceptedQuestionFlags2Concepts(release: SyntheticClinicalRelease): SyntheticClinicalRelease {
  if (!accepted || release.concepts.some(c => c.id === g06.question.conceptId)) return release;
  const concept = QUESTION_FLAGS2_ROUND1_SOURCE_RELEASE.concepts.find(c => c.id === g06.question.conceptId)!;
  return {...release, concepts: [...release.concepts, concept]};
}

/** One exact no-test row; all earlier timing/order archives stay intact. */
export const QUESTION_FLAGS2_ACCEPTED_TIMING_ENTRIES = accepted
  ? QUESTION_FLAGS2_TIMING_ENTRIES.filter(t => t.caseId === g06.caseId && t.nodeId === g06.nodeId && t.questionVariantId === g06.questionVariantId)
  : [];
