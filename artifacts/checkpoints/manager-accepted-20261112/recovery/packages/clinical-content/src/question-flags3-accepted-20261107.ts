import type {SyntheticClinicalCase, SyntheticClinicalRelease} from "./schema";
import {validateSyntheticClinicalRelease} from "./schema";
import {QUESTION_SHIP_MANIFEST} from "./question-ship-manifest";
import {
 QUESTION_FLAGS3_SOURCE_RELEASE, QUESTION_FLAGS3_REVISIONS, QUESTION_FLAGS3_NEW_TESTED_CONCEPTS,
 QUESTION_FLAGS3_TIMING_ENTRIES, QUESTION_FLAGS3_CANDIDATE_TEST_ORDER_RECORDS,
 QUESTION_FLAGS3_STATEMENT_MAPPINGS,
} from "./question-flags3-20261107";

/** Retain the reviewed round-one source unchanged. Only this explicitly named
 * acceptance view contains the manager's self-contained management repair. */
export const QUESTION_FLAGS3_ACCEPTED_SOURCE_VIEW_NAME = "flags3-accepted" as const;
export const QUESTION_FLAGS3_MANAGEMENT_VARIANT_ID = "question.inguinal-hernia.symptomatic-elective-repair.v3.r12";
export const QUESTION_FLAGS3_MANAGEMENT_UPDATE = "Ultrasound classification: femoral hernia. {patientName} now completes his usual caregiving lifts. The groin bulge disappears when he lies down. The groin is nontender, the abdomen is soft and not distended, and he reports no vomiting.";
const groinCaseId = "case.inguinal-hernia.caregiving-strain";
const oldManagement = QUESTION_FLAGS3_REVISIONS.find(r => r.auditId === "F3-03")!;
export const QUESTION_FLAGS3_ACCEPTED_REVISIONS = QUESTION_FLAGS3_REVISIONS.map(r => r.auditId !== "F3-03" ? r : {
 ...r, questionVariantId: QUESTION_FLAGS3_MANAGEMENT_VARIANT_ID,
 currentUpdate: QUESTION_FLAGS3_MANAGEMENT_UPDATE,
 question: {...r.question, id: QUESTION_FLAGS3_MANAGEMENT_VARIANT_ID, contentVersion: "question-authoring.2026-11-07.flags3-r2"},
 conceptVersionReason: "Same femoral repair-priority objective. Make the established classification visible in this node's own context; move functional detail here from the type display. No changed management rule or FSRS migration.",
});
export const QUESTION_FLAGS3_ACCEPTED_QUESTIONS = QUESTION_FLAGS3_ACCEPTED_REVISIONS.map(r => r.question);
export const QUESTION_FLAGS3_ACCEPTED_STATEMENT_MAPPINGS = QUESTION_FLAGS3_STATEMENT_MAPPINGS.map(mapping =>
 mapping.questionVariantId !== oldManagement.questionVariantId ? mapping : {
  ...mapping, contentVersion: "question-authoring.2026-11-07.flags3-r2",
  questionVariantId: QUESTION_FLAGS3_MANAGEMENT_VARIANT_ID,
  evidenceClaimIds: [...mapping.evidenceClaimIds, "claim.flags3.20261107.groin-compartment"],
  preservedContext: "The established classification is visible only in the management update, after the exact raw-anatomy type decision. The existing compartment claim supports that carried-forward diagnosis; the repair/acuity claims are unchanged.",
 });
export const QUESTION_FLAGS3_ACCEPTED_CASES: SyntheticClinicalCase[] = QUESTION_FLAGS3_SOURCE_RELEASE.cases.map(cs => {
 if(cs.id !== groinCaseId) return cs;
 const presentation = "{patientName}, a 59-year-old man, returns to the surgery clinic with an intermittent right groin bulge.";
 return {...cs, presentation, patientPresentationVariantId: "presentation.flags3.inguinal-hernia.caregiving-strain.20261107.v2",
  approvedInstantiationProfiles: cs.approvedInstantiationProfiles!.map(p => ({...p,
   id: "profile.flags3.inguinal-hernia.caregiving-strain.20261107.v2", presentation})),
  decisionNodes: cs.decisionNodes.map(n => n.questionVariantId !== oldManagement.questionVariantId ? n : {
   ...n, questionVariantId: QUESTION_FLAGS3_MANAGEMENT_VARIANT_ID, currentUpdate: QUESTION_FLAGS3_MANAGEMENT_UPDATE,
  }),
 };
});
export const QUESTION_FLAGS3_ACCEPTED_SOURCE_RELEASE = validateSyntheticClinicalRelease({
 ...QUESTION_FLAGS3_SOURCE_RELEASE, id: "clinical.flags3-accepted-source.20261107.v2", cases: QUESTION_FLAGS3_ACCEPTED_CASES,
});

const accepted = QUESTION_FLAGS3_ACCEPTED_REVISIONS.filter(r => QUESTION_SHIP_MANIFEST.accepted.some(a =>
 a.acceptanceId === r.auditId && a.caseId === r.caseId && a.nodeId === r.nodeId &&
 a.questionVariantId === r.questionVariantId && a.conceptId === r.question.conceptId &&
 a.sourceView === QUESTION_FLAGS3_ACCEPTED_SOURCE_VIEW_NAME));
/** Only an exact accepted new objective is registered. Historical concepts and
 * cards remain intact; editorial acceptance grants no clinical approval. */
export function withAcceptedQuestionFlags3Concepts(release: SyntheticClinicalRelease): SyntheticClinicalRelease {
 const ids = new Set(release.concepts.map(c => c.id));
 const extra = QUESTION_FLAGS3_NEW_TESTED_CONCEPTS.filter(c => !ids.has(c.id) && accepted.some(r => r.question.conceptId === c.id));
 return extra.length ? {...release, concepts: [...release.concepts, ...extra]} : release;
}
export const QUESTION_FLAGS3_ACCEPTED_TIMING_ENTRIES = QUESTION_FLAGS3_TIMING_ENTRIES.map(t =>
 t.questionVariantId === oldManagement.questionVariantId ? {...t, questionVariantId: QUESTION_FLAGS3_MANAGEMENT_VARIANT_ID} : t,
).filter(t => accepted.some(r => r.caseId === t.caseId && r.nodeId === t.nodeId && r.questionVariantId === t.questionVariantId));
export const QUESTION_FLAGS3_ACCEPTED_TEST_ORDER_RECORDS = QUESTION_FLAGS3_CANDIDATE_TEST_ORDER_RECORDS.filter(t =>
 accepted.some(r => r.caseId === t.caseId && r.nodeId === t.nodeId && r.questionVariantId === t.questionVariantId),
).map(t => ({...t, disposition: {kind: "not_executed" as const, reason: "future_planned" as const}}));
