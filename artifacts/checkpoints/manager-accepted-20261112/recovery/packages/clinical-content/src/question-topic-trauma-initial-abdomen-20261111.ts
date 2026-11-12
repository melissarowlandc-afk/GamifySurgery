/**
 * Explicit-import, unapproved clinic chart-review sidecar.
 * Outside-hospital decisions are educational record review in the existing clinic.
 * Importing this module installs nothing in the default release or registries.
 */
import { z } from "zod";
import packet from "../../../docs/research/question-topic-trauma-initial-abdomen-20261111.json";
import ledger from "../../../docs/research/sources-question-topic-trauma-initial-abdomen-20261111.json";
import type { ClinicalSource, EvidenceClaim, QuestionVariant } from "./pilot-schema";
import {
  answerChoiceTimingRegistryEntrySchema, caseExhibitSchema, decisionNodeSchema,
  syntheticClinicalCaseSchema, testedConceptSchema, validateSyntheticClinicalRelease,
  type AnswerChoiceTimingRegistryEntry, type DecisionNode,
  type SyntheticClinicalCase, type TestedConcept,
} from "./schema";

export const QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_PACKET = packet;
export const QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_DRAFT = {
  contentVersion: "clinical.question-topic-trauma-initial-abdomen.2026-11-11.v2",
  reviewStatus: "needs_clinician_review",
  aiAssistedDrafting: true,
  lastClinicianReview: null,
} as const;

const authoredFields = {
  contentVersion: z.string().regex(/^clinical\.question-topic-trauma-initial-abdomen\.2026-11-11\.v[12]$/),
  reviewStatus: z.literal("needs_clinician_review"),
  aiAssistedDrafting: z.literal(true),
  lastClinicianReview: z.null(),
};
const sourceSchema = z.object({
  ...authoredFields,
  id: z.string().startsWith("source.trauma-initial-abdomen."),
  title: z.string().min(1),
  completeCitation: z.string().min(1),
  organizationOrJournal: z.string().min(1),
  authors: z.array(z.string().min(1)).min(1),
  publicationYear: z.number().int(),
  doi: z.string().nullable(),
  pmid: z.string().nullable(),
  officialUrl: z.url(),
  accessedOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  sourceClass: z.enum(["peer_reviewed_guideline", "professional_society_guideline", "narrative_review"]),
  licenseLabel: z.string().min(1),
  licenseUrl: z.url().nullable(),
  termsUrl: z.url(),
  reuseStatus: z.enum(["cc_by_4_0", "cc_by_3_0", "copyrighted_targeted_verification_only"]),
  reuseNotes: z.string().min(1),
  authorityAssessment: z.string().min(1),
  usageRole: z.enum(["evidence", "cross_check", "both"]),
  accessMethod: z.string().min(1),
  verificationSections: z.array(z.string().min(1)).min(1),
  evidenceClaimIds: z.array(z.string()).min(1),
}).strict();

/** A truthful CC BY 3.0 value is local to this uninstalled authoring sidecar. */
export type TraumaTopicSource = Omit<ClinicalSource, "reuseStatus"> & {
  reuseStatus: ClinicalSource["reuseStatus"] | "cc_by_3_0";
  licenseUrl: string | null;
  termsUrl: string;
  accessMethod: string;
  verificationSections: string[];
};
export const QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_SOURCES: TraumaTopicSource[] =
  ledger.sources.map(source => sourceSchema.parse(source));

const claimSchema = z.object({
  ...authoredFields,
  id: z.string().startsWith("claim.trauma-initial-abdomen."),
  statement: z.string().min(1),
  sourceIds: z.array(z.string()).min(1),
  evidenceCategory: z.enum(["definition", "anatomy", "epidemiology", "presentation", "evaluation", "management", "disposition", "safety_boundary"]),
  certainty: z.enum(["high", "moderate", "low", "conflicting"]),
  limitation: z.string().nullable(),
  applicablePopulation: z.string().min(1),
  lastCheckedOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
}).strict();
export const QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_CLAIMS: EvidenceClaim[] =
  ledger.claims.map(claim => claimSchema.parse(claim));

const sourcesById = new Map(QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_SOURCES.map(s => [s.id, s]));
const claimsById = new Map(QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_CLAIMS.map(c => [c.id, c]));
function sourceLabels(claimIds: readonly string[]): string[] {
  return [...new Set(claimIds.flatMap(id => {
    const claim = claimsById.get(id);
    if (!claim) throw new Error(`Trauma draft has no evidence claim: ${id}`);
    return claim.sourceIds.map(sourceId => {
      const source = sourcesById.get(sourceId);
      if (!source) throw new Error(`Trauma claim has no source: ${sourceId}`);
      return source.title;
    });
  }))];
}


type DraftNode = (typeof packet.nodes)[number];
const activeRows = packet.nodes.filter(n => n.itemStatus !== "parked");
const activeIds = new Set(activeRows.map(n => n.questionVariantId));

/** The catalog retains failed attempts; only QUESTIONS is offered for admission. */
export const QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_ALL_QUESTIONS: QuestionVariant[] = packet.nodes.map(n => ({
  contentVersion: n.contentVersion,
  reviewStatus: "needs_clinician_review",
  aiAssistedDrafting: true,
  lastClinicianReview: null,
  id: n.questionVariantId,
  conceptId: n.conceptId,
  stem: n.task,
  ...(n.exhibit ? { exhibit: caseExhibitSchema.parse(n.exhibit) } : {}),
  answerChoices: n.choices.map(c => ({
    id: c.id, label: c.label, isCorrect: c.id === n.keyChoiceId,
    rationale: c.rationale,
    distractorRationale: c.id === n.keyChoiceId ? null : c.rationale,
  })),
  explanation: n.explanation,
  supportingEvidenceClaimIds: [...n.evidenceClaimIds],
}));
export const QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_QUESTIONS =
  QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_ALL_QUESTIONS.filter(q => activeIds.has(q.id));

function compileNode(n: DraftNode): DecisionNode {
  const cs = packet.cases.find(c => c.id === n.caseId);
  if (!cs) throw new Error("Missing clinic case: " + n.caseId);
  const final = cs.nodeIds.at(-1) === n.id;
  return decisionNodeSchema.parse({
    id: n.id, questionVariantId: n.questionVariantId, primaryConceptId: n.conceptId,
    ...(n.currentUpdate ? { currentUpdate: n.currentUpdate } : {}),
    stem: n.task,
    ...(n.exhibit ? { exhibit: n.exhibit } : {}),
    answerChoices: n.choices.map(c => ({
      id: c.id, label: c.label, isCorrect: c.id === n.keyChoiceId,
      rationale: c.rationale, serviceRequest: null,
    })),
    shuffleAnswers: true,
    explanation: n.explanation,
    sourceLabels: sourceLabels(n.evidenceClaimIds),
    resultGateAfter: null,
    terminalDispositions: final ? n.choices.filter(c => c.id !== n.keyChoiceId).map(c => ({
      answerChoiceId: c.id, kind: "no_terminal_outcome",
      consequenceNarrative: "This clinic exercise reviews an outside-hospital decision; no acute treatment or patient outcome is simulated.",
      clinicalRationale: c.rationale,
      sourceLabels: sourceLabels(c.evidenceClaimIds),
    })) : [],
  });
}
export const QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_DECISION_NODES: DecisionNode[] = activeRows.map(compileNode);
const nodesById = new Map(QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_DECISION_NODES.map(n => [n.id, n]));

/**
 * Normal existing-schema clinic cases. The schema's legacy field name
 * approvedInstantiationProfiles is a finite-profile representation; the packet
 * and release remain explicitly unapproved pending named clinical sign-off.
 */
export const QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_CASES: SyntheticClinicalCase[] =
  packet.cases.map(c => syntheticClinicalCaseSchema.parse({
    id: c.id, displayName: c.displayName,
    patientPresentationVariantId: c.patientPresentationVariantId,
    patientDisplayName: c.patientDisplayName,
    prototypeDemographics: c.prototypeDemographics,
    chiefComplaint: c.chiefComplaint,
    presentation: c.presentation,
    approvedInstantiationProfiles: c.finiteProfiles.map(p => ({
      id: p.id, prototypeDemographics: p.prototypeDemographics,
      chiefComplaint: p.chiefComplaint, presentation: p.presentation,
    })),
    tutorialEligible: false, routineEligible: true, earliestFacilityStage: 0,
    requiredClinicalSetting: "clinic", requiredCapabilityIds: ["capability.examination"],
    rewardTierId: "reward.clinic_basic",
    sourceLabels: sourceLabels(activeRows.filter(n => n.caseId === c.id).flatMap(n => n.evidenceClaimIds)),
    decisionNodes: c.nodeIds.map(id => {
      const node = nodesById.get(id);
      if (!node) throw new Error("Missing active clinic node: " + id);
      return node;
    }),
    learningSummary: c.learningSummary,
  }));

export const QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_CONCEPT_PROPOSALS = packet.concepts;
export const QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_TESTED_CONCEPTS: TestedConcept[] =
  packet.concepts.filter(c => c.active).map(c => testedConceptSchema.parse({
    id: c.id, displayName: c.displayName, learningObjective: c.learningObjective,
    conceptType: c.conceptType, earliestFacilityStage: 0,
  }));

/** Explicit, schema-validated preview input. Never appended to the default release. */
export const QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_SOURCE_RELEASE = validateSyntheticClinicalRelease({
  id: "clinical.synthetic.prototype.v1",
  schemaVersion: 1,
  publicationStatus: "synthetic_unapproved_prototype",
  disclaimer: "Synthetic clinic chart-review drafts for software testing; not clinically approved and not medical guidance.",
  concepts: QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_TESTED_CONCEPTS,
  cases: QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_CASES,
});

export const QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_AUTHOR_CHECKS = packet.nodes.map(n => ({
  questionVariantId: n.questionVariantId, itemStatus: n.itemStatus, ...n.authorGate,
}));
export const QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_REVIEW_RESPONSES = packet.reviewRound2.responses;
export const QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_RETAINED_REVIEWED = packet.reviewedSnapshot;

export const QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_TIMING_ENTRIES: AnswerChoiceTimingRegistryEntry[] =
  packet.timingProposals.map(t => answerChoiceTimingRegistryEntrySchema.parse(t));
export const QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_RETAINED_TIMING_ENTRIES: AnswerChoiceTimingRegistryEntry[] =
  packet.reviewedSnapshot.timingProposals.map(t => answerChoiceTimingRegistryEntrySchema.parse(t));
export const QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_TEST_ORDER_PROPOSALS =
  QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_TIMING_ENTRIES.flatMap(t => t.classification.kind === "test_choices"
    ? t.classification.choices.flatMap(c => c.timing.kind === "test" ? [{
      caseId: t.caseId, nodeId: t.nodeId, questionVariantId: t.questionVariantId,
      choiceId: c.choiceId, choiceLabel: c.choiceLabel, timingProfileId: c.timing.timingProfileId,
      disposition: { kind: "not_executed" as const, reason: "future_planned" as const },
    }] : []) : []);

export const QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_SOURCE_LINKS =
  QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_SOURCES.map(s => ({
    sourceId: s.id, href: s.officialUrl!, label: s.completeCitation,
    target: "_blank" as const, rel: "noopener noreferrer" as const,
    referrerPolicy: "no-referrer" as const,
  }));

/** Hospital acuity and resources are record facts, separate from clinic admission. */
export const QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_CLINIC_CASE_BINDINGS = packet.cases.map(c => ({
  caseId: c.id, orderedNodeIds: c.nodeIds, parkedNodeIds: c.parkedNodeIds,
  clinicSetting: "clinic" as const, clinicPatientAcuity: c.patientAcuity,
  requiredCapabilityIds: c.requiredCapabilityIds, facilityProgressionLevel: 0,
  educationalTier: c.educationalTier, admission: c.runtimeAdmission,
  outsideRecordInitialAcuity: c.outsideRecordInitialAcuity,
  hospitalDecisionPoints: activeRows.filter(n => n.caseId === c.id).map(n => ({
    nodeId: n.id, clinicalPhase: n.clinicalPhase, patientAcuity: n.patientAcuity,
  })),
  continuationPolicy: "Outside-hospital record chronology; no test, treatment or elapsed hospital interval is executed in clinic.",
}));

/** Explicit reviewer context; prior feedback separate, no future or parked data. */
export function traumaTopicReviewContext(questionVariantId: string) {
  const n = activeRows.find(row => row.questionVariantId === questionVariantId);
  if (!n) throw new Error("Unknown active trauma review question: " + questionVariantId);
  const cs = packet.cases.find(c => c.id === n.caseId)!;
  const earlier = activeRows.filter(row => row.caseId === n.caseId && row.sequenceIndex < n.sequenceIndex);
  const display = (s: string) => s.replaceAll("{patientName}", cs.patientDisplayName);
  return {
    caseId: cs.id, questionVariantId,
    patientName: cs.patientDisplayName, demographics: cs.prototypeDemographics,
    chiefComplaint: cs.chiefComplaint, presentation: display(cs.presentation),
    priorObservations: earlier.map(row => ({
      nodeId: row.id,
      ...(row.currentUpdate ? { currentUpdate: display(row.currentUpdate) } : {}),
      exhibit: row.exhibit,
    })),
    currentUpdate: n.currentUpdate ? display(n.currentUpdate) : null,
    exhibit: n.exhibit, task: display(n.task),
    priorFeedback: earlier.map(row => ({
      questionVariantId: row.questionVariantId, explanation: row.explanation,
      possibleChosenAnswerRationales: row.choices.map(c => ({ choiceId: c.id, rationale: c.rationale })),
    })),
    sequenceLimitation: n.authorGate.wholeVisibleSequence,
  };
}

/** Reviewer-only extraction of skipped PASS nodes; no default admission. */
const salvageCaseIds = new Set(packet.salvage.caseIds);
const salvageQuestionIds = new Set(packet.salvage.questionVariantIds);
export const QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_SALVAGE_REVIEW_REQUESTS = packet.salvage.reviewQueue;
export const QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_SALVAGE_CASES =
  QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_CASES.filter(c => salvageCaseIds.has(c.id));
export const QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_SALVAGE_QUESTIONS =
  QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_QUESTIONS.filter(q => salvageQuestionIds.has(q.id));
export const QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_SALVAGE_TIMING_ENTRIES =
  QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_TIMING_ENTRIES.filter(t => salvageQuestionIds.has(t.questionVariantId));
export const QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_SALVAGE_SOURCE_RELEASE = validateSyntheticClinicalRelease({
  id: "clinical.synthetic.prototype.v1",
  schemaVersion: 1,
  publicationStatus: "synthetic_unapproved_prototype",
  disclaimer: "Synthetic standalone clinic chart-review salvage drafts; not clinically approved and not medical guidance.",
  concepts: QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_TESTED_CONCEPTS.filter(c =>
    QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_SALVAGE_QUESTIONS.some(q => q.conceptId === c.id)),
  cases: QUESTION_TOPIC_TRAUMA_INITIAL_ABDOMEN_SALVAGE_CASES,
});
