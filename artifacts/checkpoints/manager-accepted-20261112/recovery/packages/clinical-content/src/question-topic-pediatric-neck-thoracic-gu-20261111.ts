/** Explicit-import topic authoring sidecar. Only current packet proposals are executable.
 * Reviewed v1 inputs and unkeyed parked attempts remain research history.
 * The manager owns acceptance and release registration.
 */
import { z } from "zod";
import packet from "../../../docs/research/question-topic-pediatric-neck-thoracic-gu-20261111.json";
import ledger from "../../../docs/research/sources-question-topic-pediatric-neck-thoracic-gu-20261111.json";
import type { ClinicalSource, EvidenceClaim, QuestionVariant } from "./pilot-schema";
import {
  answerChoiceTimingRegistryEntrySchema, caseExhibitSchema, decisionNodeSchema,
  syntheticClinicalCaseSchema, testedConceptSchema, validateSyntheticClinicalRelease,
  type SyntheticClinicalCase,
} from "./schema";

export const PEDIATRIC_NTG_TOPIC_SLUG = "pediatric-neck-thoracic-gu";
export const PEDIATRIC_NTG_TOPIC_PACKET = packet;
export const PEDIATRIC_NTG_TOPIC_DRAFT = {
  contentVersion: "clinical.question-topic-pediatric-neck-thoracic-gu.2026-11-11.v2",
  reviewStatus: "needs_clinician_review", aiAssistedDrafting: true, lastClinicianReview: null,
} as const;
const authored = {
  contentVersion: z.enum([
    "clinical.question-topic-pediatric-neck-thoracic-gu.2026-11-11.v1",
    PEDIATRIC_NTG_TOPIC_DRAFT.contentVersion,
  ]),
  reviewStatus: z.literal("needs_clinician_review"), aiAssistedDrafting: z.literal(true),
  lastClinicianReview: z.null(),
};
const sourceSchema = z.object({
  ...authored, id: z.string().startsWith("source.pediatric-neck-thoracic-gu."),
  title: z.string().min(1), completeCitation: z.string().min(1), organizationOrJournal: z.string().min(1),
  authors: z.array(z.string()).min(1), publicationYear: z.number().int().nullable(),
  doi: z.string().nullable(), pmid: z.string().nullable(), officialUrl: z.url(), accessedOn: z.string().min(10),
  sourceClass: z.enum(["government_guidance", "professional_society_guideline", "narrative_review", "observational_study"]),
  licenseLabel: z.string().min(1),
  reuseStatus: z.enum(["public_domain_conditions_apply", "copyrighted_targeted_verification_only", "cc_by_4_0", "cc_by_nc_4_0_restricted"]),
  reuseNotes: z.string().min(1), authorityAssessment: z.string().min(1),
  usageRole: z.literal("evidence"), evidenceClaimIds: z.array(z.string()).min(1),
}).passthrough();
const claimSchema = z.object({
  ...authored, id: z.string().startsWith("claim.pediatric-neck-thoracic-gu."), statement: z.string().min(1),
  sourceIds: z.array(z.string()).min(1),
  evidenceCategory: z.enum(["definition", "anatomy", "epidemiology", "presentation", "evaluation", "management", "disposition", "safety_boundary"]),
  certainty: z.enum(["high", "moderate", "low", "conflicting"]), limitation: z.string().nullable(),
  applicablePopulation: z.string().min(1), lastCheckedOn: z.string().min(10),
}).passthrough();
const questionSchema = z.object({
  ...authored, id: z.string().min(1), conceptId: z.string().min(1), stem: z.string().min(1),
  exhibit: caseExhibitSchema,
  answerChoices: z.array(z.object({
    id: z.string().min(1), label: z.string().min(1), isCorrect: z.boolean(),
    rationale: z.string().min(1), distractorRationale: z.string().nullable(),
  })).min(3).max(4),
  explanation: z.string().min(1), supportingEvidenceClaimIds: z.array(z.string()).min(1),
});
export const PEDIATRIC_NTG_TOPIC_SOURCES: ClinicalSource[] = ledger.sources.map(s => sourceSchema.parse(s));
export const PEDIATRIC_NTG_TOPIC_CLAIMS: EvidenceClaim[] = ledger.claims.map(c => claimSchema.parse(c));
export const PEDIATRIC_NTG_TOPIC_PROPOSED_NODES = packet.nodes;
export const PEDIATRIC_NTG_TOPIC_CASE_COMPOSITIONS = packet.cases;
export const PEDIATRIC_NTG_TOPIC_QUESTIONS: QuestionVariant[] =
  packet.proposals.map(p => questionSchema.parse(p.after.question));
export const PEDIATRIC_NTG_TOPIC_DECISION_NODES =
  packet.proposals.map(p => decisionNodeSchema.parse(p.after.currentNode));
export const PEDIATRIC_NTG_TOPIC_AUTHORING_CONCEPTS = packet.concepts;
export const PEDIATRIC_NTG_TOPIC_TESTED_CONCEPTS =
  packet.concepts.map(c => testedConceptSchema.parse({
    id: c.id, displayName: c.displayName, learningObjective: c.learningObjective,
    earliestFacilityStage: c.earliestFacilityStage, conceptType: c.conceptType,
  }));
const seenCases = new Set<string>();
export const PEDIATRIC_NTG_TOPIC_CASES: SyntheticClinicalCase[] = packet.proposals.flatMap(p => {
  const c = p.after.clinicalCase;
  if (seenCases.has(c.id)) return [];
  seenCases.add(c.id);
  return [syntheticClinicalCaseSchema.parse(c)];
});
export const PEDIATRIC_NTG_TOPIC_FAMILY_CONTEXTS = packet.familyContexts;
export const PEDIATRIC_NTG_TOPIC_CASE_REVIEWS = packet.caseReviews;
export const PEDIATRIC_NTG_TOPIC_TIMING_ENTRIES =
  packet.timingEntries.map(entry => answerChoiceTimingRegistryEntrySchema.parse(entry));
export const PEDIATRIC_NTG_TOPIC_ORDER_PROPOSALS = packet.orderProposals;
export const PEDIATRIC_NTG_TOPIC_SALVAGE = packet.salvage;
export const PEDIATRIC_NTG_TOPIC_SALVAGE_PROPOSALS = packet.salvageProposals;
const salvageIds = new Set(packet.salvageProposals.map(s => s.questionVariantId));
export const PEDIATRIC_NTG_TOPIC_SALVAGE_CASES = PEDIATRIC_NTG_TOPIC_CASES.filter(c =>
  c.decisionNodes.some(n => salvageIds.has(n.questionVariantId)));
export const PEDIATRIC_NTG_TOPIC_SALVAGE_QUESTIONS = PEDIATRIC_NTG_TOPIC_QUESTIONS.filter(q => salvageIds.has(q.id));
export const PEDIATRIC_NTG_TOPIC_SALVAGE_NODES = PEDIATRIC_NTG_TOPIC_DECISION_NODES.filter(n => salvageIds.has(n.questionVariantId));
export const PEDIATRIC_NTG_TOPIC_SALVAGE_TIMING_ENTRIES = PEDIATRIC_NTG_TOPIC_TIMING_ENTRIES.filter(t => salvageIds.has(t.questionVariantId));
export const PEDIATRIC_NTG_TOPIC_SALVAGE_FAMILY_CONTEXTS = packet.salvageProposals.map(s => s.familyContext);
export const PEDIATRIC_NTG_TOPIC_OUTSIDE_RECORD_TIMING = packet.salvageProposals.map(s => s.before.timing);
export const PEDIATRIC_NTG_TOPIC_OUTSIDE_RECORD_ORDER_PROPOSALS = packet.salvageProposals.flatMap(s => s.before.orders);
export const PEDIATRIC_NTG_TOPIC_SOURCE_LINKS = ledger.sources.map(s => ({
  sourceId: s.id, label: s.title, href: s.officialUrl, target: "_blank" as const,
  rel: "noopener noreferrer" as const, referrerPolicy: "no-referrer" as const,
}));
export const PEDIATRIC_NTG_TOPIC_REVIEW_RESPONSES = packet.independentReviewFollowup.itemResponses;
export const PEDIATRIC_NTG_TOPIC_PRESERVED_REVIEW_INPUTS = packet.independentReviewFollowup.reviewInput;
export const PEDIATRIC_NTG_TOPIC_PARKED_ITEMS =
  PEDIATRIC_NTG_TOPIC_REVIEW_RESPONSES.filter(r => r.status === "parked");
export const PEDIATRIC_NTG_TOPIC_AUTHOR_CHECKS = packet.nodes.map(n => ({
  contentVersion: n.contentVersion, reviewStatus: n.reviewStatus,
  questionVariantId: n.questionVariantId, ...n.authorGate, reasoningSteps: n.reasoningSteps,
  closestCredibleError: n.closestCredibleError, decidingObservation: n.decidingObservation,
  counterfactual: n.counterfactual, deletionTest: n.deletionTest,
  authority: "Author self-check only; no new independent PASS or clinical approval",
}));
export const PEDIATRIC_NTG_TOPIC_PREVIEW_RELEASE = validateSyntheticClinicalRelease({
  id: "clinical.synthetic.prototype.v1", schemaVersion: 1, publicationStatus: "synthetic_unapproved_prototype",
  disclaimer: "Synthetic topic preview; not clinically approved. Six latest editorial PASS nodes have presentation and runtime metadata salvage; seven other drafts remain outside this salvage. New clinic wrappers need review. Tests do not grant clinical approval or manager acceptance.",
  concepts: PEDIATRIC_NTG_TOPIC_TESTED_CONCEPTS, cases: PEDIATRIC_NTG_TOPIC_CASES,
});
export const PEDIATRIC_NTG_TOPIC_MANIFEST = {
  ...PEDIATRIC_NTG_TOPIC_DRAFT, topicSlug: PEDIATRIC_NTG_TOPIC_SLUG,
  cases: PEDIATRIC_NTG_TOPIC_CASES.length, nodes: PEDIATRIC_NTG_TOPIC_PROPOSED_NODES.length,
  reusedConcepts: packet.concepts.filter(c => c.identityDisposition === "reuse_unchanged_objective").length,
  newMeanings: packet.concepts.filter(c => c.identityDisposition === "new_meaning_version").length,
  newConcepts: packet.concepts.filter(c => c.identityDisposition === "new_objective").length,
  status: "salvage", salvageNodes: 6, salvageCases: 6,
  latestIndependentPass: 6, otherAuthoringDrafts: 7,
  historicalReview1: { passPreserved: 7, revisedAwaitingReview: 6, parked: 7 },
  independentPass: false, managerAccepted: false, clinicalApproval: false,
  reviewOrderNotice: "key shown first for review only", integration: "explicit-import authoring sidecar only",
} as const;
