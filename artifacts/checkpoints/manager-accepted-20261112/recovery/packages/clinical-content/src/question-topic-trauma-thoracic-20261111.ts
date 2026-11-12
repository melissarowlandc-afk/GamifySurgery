/** Explicit-import authoring sidecar. It registers nothing in the shipped bank. */
import { z } from "zod";
import packet from "../../../docs/research/question-topic-trauma-thoracic-20261111.json";
import ledger from "../../../docs/research/sources-question-topic-trauma-thoracic-20261111.json";
import type { ClinicalSource, EvidenceClaim, QuestionVariant } from "./pilot-schema";
import {
  answerChoiceTimingRegistryEntrySchema,
  caseExhibitSchema,
  decisionNodeSchema,
  syntheticClinicalCaseSchema,
  testedConceptSchema,
  type AnswerChoiceTimingRegistryEntry,
  type DecisionNode,
  type SyntheticClinicalCase,
} from "./schema";

export const QUESTION_TOPIC_TRAUMA_THORACIC_PACKET = packet;
export const QUESTION_TOPIC_TRAUMA_THORACIC_DRAFT = {
  contentVersion: "clinical.question-topic-trauma-thoracic.2026-11-11.v2",
  reviewStatus: "needs_clinician_review",
  aiAssistedDrafting: true,
  lastClinicianReview: null,
} as const;
const authored = {
  contentVersion: z.enum([
    "clinical.question-topic-trauma-thoracic.2026-11-11.v1",
    "clinical.question-topic-trauma-thoracic.2026-11-11.v2",
  ]),
  reviewStatus: z.literal("needs_clinician_review"),
  aiAssistedDrafting: z.literal(true),
  lastClinicianReview: z.null(),
};
const sourceSchema = z.object({
  ...authored,
  id: z.string().startsWith("source.trauma-thoracic."),
  title: z.string().min(1), completeCitation: z.string().min(1),
  organizationOrJournal: z.string().min(1), authors: z.array(z.string()).min(1),
  publicationYear: z.number().int(), doi: z.string().nullable(), pmid: z.string().nullable(),
  officialUrl: z.url(), accessedOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  sourceClass: z.enum(["professional_society_guideline", "narrative_review", "government_guidance"]),
  licenseLabel: z.string().min(1),
  reuseStatus: z.enum(["copyrighted_targeted_verification_only", "cc_by_4_0", "public_domain_conditions_apply"]),
  reuseNotes: z.string().min(1), authorityAssessment: z.string().min(1),
  usageRole: z.enum(["evidence", "cross_check", "both"]),
  evidenceClaimIds: z.array(z.string()).min(1),
}).passthrough();
const claimSchema = z.object({
  ...authored,
  id: z.string().startsWith("claim.trauma-thoracic."), statement: z.string().min(1),
  sourceIds: z.array(z.string()).min(1),
  evidenceCategory: z.enum(["definition", "anatomy", "epidemiology", "presentation", "evaluation", "management", "disposition", "safety_boundary"]),
  certainty: z.enum(["high", "moderate", "low", "conflicting"]),
  limitation: z.string().nullable(), applicablePopulation: z.string().min(1),
  lastCheckedOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
}).passthrough();

export const QUESTION_TOPIC_TRAUMA_THORACIC_SOURCES: ClinicalSource[] = ledger.sources.map(s => sourceSchema.parse(s));
export const QUESTION_TOPIC_TRAUMA_THORACIC_CLAIMS: EvidenceClaim[] = ledger.claims.map(c => claimSchema.parse(c));
const sourceById = new Map(QUESTION_TOPIC_TRAUMA_THORACIC_SOURCES.map(s => [s.id, s]));
const claimById = new Map(QUESTION_TOPIC_TRAUMA_THORACIC_CLAIMS.map(c => [c.id, c]));
const activeNodes = packet.nodes.filter(n => n.revisionStatus !== "parked");
const activeNodeIds = new Set(activeNodes.map(n => n.id));
const activeCases = packet.cases.map(c => ({
  ...c,
  nodeIds: c.nodeIds.filter(id => activeNodeIds.has(id)),
})).filter(c => c.nodeIds.length > 0);
const activeConceptIds = new Set(activeNodes.map(n => n.conceptId));

function authoringMetadata(row: { contentVersion: string }) {
  return { ...QUESTION_TOPIC_TRAUMA_THORACIC_DRAFT, contentVersion: row.contentVersion };
}
function sourceLabels(ids: readonly string[]): string[] {
  return [...new Set(ids.flatMap(id => {
    const claim = claimById.get(id);
    if (!claim) throw new Error(`Unknown thoracic-topic claim ${id}`);
    return claim.sourceIds.map(sourceId => {
      const source = sourceById.get(sourceId);
      if (!source) throw new Error(`Unknown thoracic-topic source ${sourceId}`);
      return source.title;
    });
  }))];
}
const caseForNode = (id: string) => {
  const clinicalCase = activeCases.find(c => c.nodeIds.includes(id));
  if (!clinicalCase) throw new Error(`Thoracic node has no clinic review case: ${id}`);
  return clinicalCase;
};
/** Finite age/sex profiles stay fixed; generated names replace every patient name. */
function template(text: string, name: string): string {
  const first = name.split(" ")[0]!;
  return text.split(name).join("{patientName}").replace(new RegExp(`\\b${first}\\b`, "g"), "{patientName}");
}
function templatedExhibit(exhibit: unknown, name: string) {
  const parsed = caseExhibitSchema.parse(exhibit);
  if (parsed.kind !== "keyValue") throw new Error("Thoracic sidecar only authors original record exhibits");
  return { ...parsed, items: parsed.items.map(item => ({ ...item, value: template(item.value, name) })) };
}

export const QUESTION_TOPIC_TRAUMA_THORACIC_QUESTIONS: QuestionVariant[] = activeNodes.map(n => {
  const clinicalCase = caseForNode(n.id);
  return {
    ...authoringMetadata(n),
    id: n.questionVariantId, conceptId: n.conceptId,
    stem: template(n.task, clinicalCase.patientDisplayName),
    ...(n.exhibit ? { exhibit: templatedExhibit(n.exhibit, clinicalCase.patientDisplayName) } : {}),
    answerChoices: n.choices.map(c => ({
      id: c.id, label: c.label, isCorrect: c.id === n.keyChoiceId,
      rationale: c.rationale, distractorRationale: c.id === n.keyChoiceId ? null : c.rationale,
    })),
    explanation: template(n.explanation, clinicalCase.patientDisplayName),
    supportingEvidenceClaimIds: [...n.evidenceClaimIds],
  };
});
export const QUESTION_TOPIC_TRAUMA_THORACIC_DECISION_NODES: DecisionNode[] = activeNodes.map((n, i) => {
  const q = QUESTION_TOPIC_TRAUMA_THORACIC_QUESTIONS[i]!;
  const clinicalCase = caseForNode(n.id);
  const labels = sourceLabels(n.evidenceClaimIds);
  return decisionNodeSchema.parse({
    id: n.id, questionVariantId: q.id, primaryConceptId: q.conceptId,
    currentUpdate: template(n.currentUpdate, clinicalCase.patientDisplayName),
    stem: q.stem, ...(q.exhibit ? { exhibit: q.exhibit } : {}),
    answerChoices: q.answerChoices.map(c => ({
      id: c.id, label: c.label, isCorrect: c.isCorrect, rationale: c.rationale!, serviceRequest: null,
    })),
    shuffleAnswers: true, explanation: q.explanation,
    sourceLabels: labels, resultGateAfter: null,
    terminalDispositions: clinicalCase.nodeIds.at(-1) === n.id ? q.answerChoices.filter(c => !c.isCorrect).map(c => ({
      answerChoiceId: c.id, kind: "no_terminal_outcome",
      consequenceNarrative: "This clinic chart review ends with feedback; no hospital intervention or patient outcome is simulated.",
      clinicalRationale: c.rationale!, sourceLabels: labels,
    })) : [],
  });
});
const nodeById = new Map(QUESTION_TOPIC_TRAUMA_THORACIC_DECISION_NODES.map(n => [n.id, n]));
export const QUESTION_TOPIC_TRAUMA_THORACIC_CASES: SyntheticClinicalCase[] = activeCases.map(c => {
  const presentation = template(c.presentation, c.patientDisplayName);
  const nodes = c.nodeIds.map(id => {
    const node = nodeById.get(id);
    if (!node) throw new Error(`Unknown thoracic case node ${id}`);
    return node;
  });
  return syntheticClinicalCaseSchema.parse({
    id: c.id, displayName: c.displayName, patientPresentationVariantId: c.patientPresentationVariantId,
    patientDisplayName: c.patientDisplayName, prototypeDemographics: c.prototypeDemographics,
    chiefComplaint: c.chiefComplaint, presentation,
    approvedInstantiationProfiles: [{
      id: c.profileId, prototypeDemographics: c.prototypeDemographics,
      chiefComplaint: c.chiefComplaint, presentation,
    }],
    tutorialEligible: false, routineEligible: true, earliestFacilityStage: c.earliestFacilityStage,
    requiredClinicalSetting: "clinic", requiredCapabilityIds: [], rewardTierId: c.rewardTierId,
    sourceLabels: [...new Set(nodes.flatMap(n => n.sourceLabels))], decisionNodes: nodes,
    learningSummary: nodes.map(n => n.explanation).join(" "),
  });
});
export const QUESTION_TOPIC_TRAUMA_THORACIC_AUTHORING_CONCEPTS = packet.concepts.filter(c => activeConceptIds.has(c.id));
export const QUESTION_TOPIC_TRAUMA_THORACIC_TESTED_CONCEPTS = QUESTION_TOPIC_TRAUMA_THORACIC_AUTHORING_CONCEPTS.map(c => testedConceptSchema.parse({
  id: c.id, displayName: c.displayName, learningObjective: c.learningObjective,
  conceptType: c.conceptType, earliestFacilityStage: c.earliestFacilityStage,
}));
export const QUESTION_TOPIC_TRAUMA_THORACIC_CASE_REVIEWS = activeCases.map(c => ({
  ...authoringMetadata(c), caseId: c.id, educationalTier: c.educationalTier,
  acuity: c.acuity, historicalAcuity: c.historicalAcuity,
  earliestFacilityStage: c.earliestFacilityStage, requiredCapabilityIds: c.requiredCapabilityIds,
  executionScope: c.executionScope, sequenceReview: c.sequenceReview,
}));
export const QUESTION_TOPIC_TRAUMA_THORACIC_TIMING_ENTRIES: AnswerChoiceTimingRegistryEntry[] = activeNodes.map(n =>
  answerChoiceTimingRegistryEntrySchema.parse({
    caseId: caseForNode(n.id).id, nodeId: n.id, questionVariantId: n.questionVariantId,
    classification: n.choices.some(c => c.timingProfileId) ? {
      kind: "test_choices", choices: n.choices.map(c => ({
        choiceId: c.id, choiceLabel: c.label,
        timing: c.timingProfileId ? { kind: "test", timingProfileId: c.timingProfileId } : { kind: "no_test" },
      })),
    } : { kind: "no_test" },
  }));
export const QUESTION_TOPIC_TRAUMA_THORACIC_SOURCE_LINKS = QUESTION_TOPIC_TRAUMA_THORACIC_SOURCES.map(s => ({
  ...QUESTION_TOPIC_TRAUMA_THORACIC_DRAFT,
  id: `link.trauma-thoracic.${s.id.slice("source.trauma-thoracic.".length)}`,
  sourceId: s.id, label: s.title, href: s.officialUrl!,
  target: "_blank", rel: "noopener noreferrer", referrerPolicy: "no-referrer",
}));
export const QUESTION_TOPIC_TRAUMA_THORACIC_STATEMENT_MAPPINGS = ledger.statementMappings;
export const QUESTION_TOPIC_TRAUMA_THORACIC_AUTHOR_CHECKS = activeNodes.map(n => ({
  questionVariantId: n.questionVariantId, ...n.authorGate,
}));
export const QUESTION_TOPIC_TRAUMA_THORACIC_AUDIT = packet.audit;
export const QUESTION_TOPIC_TRAUMA_THORACIC_ORDER_PROPOSALS = packet.orderProposals;
export const QUESTION_TOPIC_TRAUMA_THORACIC_REVIEW_RESPONSES = packet.independentReview1.responses;
export const QUESTION_TOPIC_TRAUMA_THORACIC_PARKED_ITEMS = packet.nodes.filter(n => n.revisionStatus === "parked");
/** Exact reviewed definitions remain available for review and frozen-history inspection. */
export const QUESTION_TOPIC_TRAUMA_THORACIC_REVIEWED_CASES = packet.independentReview1.inputSnapshot.runtimeCases.map(c =>
  syntheticClinicalCaseSchema.parse(c));
export const QUESTION_TOPIC_TRAUMA_THORACIC_REVIEWED_QUESTIONS = packet.independentReview1.inputSnapshot.runtimeQuestions;

/** Standalone case compositions returned for the manager's salvage review. */
export const QUESTION_TOPIC_TRAUMA_THORACIC_SALVAGE_CASES: SyntheticClinicalCase[] = packet.salvage.cases.map(c =>
  syntheticClinicalCaseSchema.parse(c));
const salvageQuestionIds = new Set(packet.salvage.items.flatMap(item => item.questionVariantIds));
export const QUESTION_TOPIC_TRAUMA_THORACIC_SALVAGE_QUESTIONS = QUESTION_TOPIC_TRAUMA_THORACIC_QUESTIONS.filter(q =>
  salvageQuestionIds.has(q.id));
export const QUESTION_TOPIC_TRAUMA_THORACIC_SALVAGE_TIMING_ENTRIES: AnswerChoiceTimingRegistryEntry[] = packet.salvage.timingProposals.map(entry =>
  answerChoiceTimingRegistryEntrySchema.parse(entry));
export const QUESTION_TOPIC_TRAUMA_THORACIC_SALVAGE_CASE_REVIEWS = packet.salvage.caseReviews;
export const QUESTION_TOPIC_TRAUMA_THORACIC_SALVAGE_MANIFEST = {
  status: "salvage",
  reviewStatus: "needs_clinician_review",
  pipelinePassed: false,
  clinicalApproval: false,
  installedInDefaultRelease: false,
  counts: packet.salvage.counts,
  reviewQueue: packet.salvage.reviewQueue,
} as const;

export const QUESTION_TOPIC_TRAUMA_THORACIC_MANIFEST = {
  ...QUESTION_TOPIC_TRAUMA_THORACIC_DRAFT,
  id: "batch.question-topic-trauma-thoracic.2026-11-11.v2",
  pipelinePassed: false, clinicalApproval: false, publicReleaseAuthorized: false,
  installedInDefaultRelease: false,
  scope: "Thirteen active decisions in ten existing-schema clinic chart reviews. Five candidates are parked in the packet.",
  counts: packet.counts,
  ownerApprovalsNeeded: packet.ownerApprovalsNeeded,
  withheldTeachingPoints: packet.withheldTeachingPoints,
  integrationDependencies: packet.integrationDependencies,
} as const;
