import type {SyntheticClinicalRelease} from "./schema";
import {QUESTION_SHIP_MANIFEST} from "./question-ship-manifest";
import {QUESTION_FLAGS2_ROUND3_REVISIONS,QUESTION_FLAGS2_ROUND3_SOURCE_RELEASE,
  QUESTION_FLAGS2_ROUND3_TIMING_ENTRIES,QUESTION_FLAGS2_ROUND3_CANDIDATE_TEST_ORDER_RECORDS} from "./question-flags2-round3-20261105";

const accepted=QUESTION_FLAGS2_ROUND3_REVISIONS.filter(r=>
  QUESTION_SHIP_MANIFEST.accepted.some(a=>a.acceptanceId===r.auditId&&a.caseId===r.caseId&&a.nodeId===r.nodeId&&
    a.questionVariantId===r.questionVariantId&&a.conceptId===r.question.conceptId&&a.sourceView==="flags2-round3")&&
  QUESTION_SHIP_MANIFEST.replacements.some(a=>a.replaces===r.caseId&&a.with===r.questionVariantId));

/** Register the two accepted changed meanings, retaining every historical card.
 * Editorial acceptance does not change needs_clinician_review. */
export function withAcceptedQuestionFlags2WholeCaseConcepts(release:SyntheticClinicalRelease):SyntheticClinicalRelease {
  const ids=new Set(release.concepts.map(c=>c.id));
  const extra=accepted.flatMap(r=>QUESTION_FLAGS2_ROUND3_SOURCE_RELEASE.concepts.filter(c=>c.id===r.question.conceptId&&!ids.has(c.id)));
  return extra.length?{...release,concepts:[...release.concepts,...extra]}:release;
}
export const QUESTION_FLAGS2_WHOLE_CASE_TIMING_ENTRIES=QUESTION_FLAGS2_ROUND3_TIMING_ENTRIES.filter(t=>
  accepted.some(r=>r.caseId===t.caseId&&r.nodeId===t.nodeId&&r.questionVariantId===t.questionVariantId));
/** Preview-only future-planned requests; no new service execution is added. */
export const QUESTION_FLAGS2_WHOLE_CASE_TEST_ORDER_RECORDS=QUESTION_FLAGS2_ROUND3_CANDIDATE_TEST_ORDER_RECORDS.filter(t=>
  accepted.some(r=>r.caseId===t.caseId&&r.nodeId===t.nodeId&&r.questionVariantId===t.questionVariantId));
