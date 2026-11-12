import packet from "../../../docs/research/question-topic-soft-tissue-sarcoma-desmoid-20261111.json";
import ledger from "../../../docs/research/sources-question-topic-soft-tissue-sarcoma-desmoid-20261111.json";
import type { AuthoredClinicalRecord, ClinicalSource, EvidenceClaim, QuestionVariant } from "./pilot-schema";
import {
  answerChoiceTimingRegistryEntrySchema,
  caseExhibitSchema,
  decisionNodeSchema,
  syntheticClinicalCaseSchema,
  testedConceptSchema,
  type AnswerChoiceTimingRegistryEntry,
  type DecisionNode,
  type SyntheticClinicalCase,
  type TestedConcept,
} from "./schema";

/** Explicit-import authoring sidecar. This module admits no content to a release. */
export const SOFT_TISSUE_SARCOMA_DESMOID_TOPIC_PACKET = packet;
export const SOFT_TISSUE_SARCOMA_DESMOID_TOPIC_LEDGER = ledger;
export const SOFT_TISSUE_SARCOMA_DESMOID_TOPIC_DRAFT = {
  contentVersion: packet.contentVersion,
  reviewStatus: "needs_clinician_review",
  aiAssistedDrafting: true,
  lastClinicianReview: null,
} as const;
export const SOFT_TISSUE_SARCOMA_DESMOID_TOPIC_AUDIT = packet.audit;
export const SOFT_TISSUE_SARCOMA_DESMOID_TOPIC_AUTHOR_CHECKS = packet.proposedNodes;
export const SOFT_TISSUE_SARCOMA_DESMOID_TOPIC_SOURCES = ledger.sources as ClinicalSource[];
export const SOFT_TISSUE_SARCOMA_DESMOID_TOPIC_CLAIMS = ledger.evidenceClaims as EvidenceClaim[];
export const SOFT_TISSUE_SARCOMA_DESMOID_TOPIC_SOURCE_LINKS = packet.sourceLinkProposals;
export const SOFT_TISSUE_SARCOMA_DESMOID_TOPIC_ORDER_PROPOSALS = packet.testOrderProposals;
export const SOFT_TISSUE_SARCOMA_DESMOID_TOPIC_OWNER_APPROVALS = packet.ownerApprovalsNeeded;
export const SOFT_TISSUE_SARCOMA_DESMOID_TOPIC_REVIEW_RESPONSE = packet.reviewRound;
export const SOFT_TISSUE_SARCOMA_DESMOID_TOPIC_ITEM_STATUSES = packet.itemStatuses;
/** Parked attempts are review history and never enter active questions/cases/timing. */
export const SOFT_TISSUE_SARCOMA_DESMOID_TOPIC_PARKED = packet.reviewRound.parkedItems;
export const SOFT_TISSUE_SARCOMA_DESMOID_TOPIC_REVIEWED_V1 = packet.reviewRound.snapshot;

const activeItems = packet.proposedNodes.filter((item) =>
  !packet.itemStatuses.some((status) => status.id === item.id && status.status === "parked"));
const preservedByQuestionId = new Map(packet.reviewRound.passFreeze.map((item) => [item.reviewedQuestionVariantId, item]));

export const SOFT_TISSUE_SARCOMA_DESMOID_TOPIC_QUESTIONS: QuestionVariant[] = activeItems.map((item) => {
  const preserved = preservedByQuestionId.get(item.questionVariantId);
  if (preserved) return preserved.question as QuestionVariant;
  return {
  ...SOFT_TISSUE_SARCOMA_DESMOID_TOPIC_DRAFT,
  contentVersion: item.contentVersion,
  id: item.questionVariantId,
  conceptId: item.conceptId,
  stem: item.task,
  ...(item.exhibit ? { exhibit: caseExhibitSchema.parse(item.exhibit) } : {}),
  answerChoices: item.choices.map((choice) => ({
    id: choice.id,
    label: choice.label,
    isCorrect: choice.isCorrect,
    rationale: choice.rationale,
    distractorRationale: choice.distractorRationale,
  })),
  explanation: item.explanation,
  supportingEvidenceClaimIds: item.supportingEvidenceClaimIds,
  };
});

function sourceLabelsFor(claimIds: readonly string[]): string[] {
  const sourceIds = new Set(SOFT_TISSUE_SARCOMA_DESMOID_TOPIC_CLAIMS
    .filter((claim) => claimIds.includes(claim.id)).flatMap((claim) => claim.sourceIds));
  return SOFT_TISSUE_SARCOMA_DESMOID_TOPIC_SOURCES
    .filter((source) => sourceIds.has(source.id)).map((source) => source.title);
}

const questionById = new Map(SOFT_TISSUE_SARCOMA_DESMOID_TOPIC_QUESTIONS.map((question) => [question.id, question]));

export const SOFT_TISSUE_SARCOMA_DESMOID_TOPIC_NODES: DecisionNode[] = activeItems.map((item) => {
  const preserved = preservedByQuestionId.get(item.questionVariantId);
  if (preserved) return preserved.node as DecisionNode;
  const question = questionById.get(item.questionVariantId)!;
  const sourceLabels = sourceLabelsFor(item.supportingEvidenceClaimIds);
  const isFinal = packet.caseCompositionProposals.find((clinicalCase) => clinicalCase.id === item.caseId)!.nodeIds.at(-1) === item.nodeId;
  return decisionNodeSchema.parse({
    id: item.nodeId,
    questionVariantId: question.id,
    primaryConceptId: question.conceptId,
    currentUpdate: item.currentUpdate,
    stem: question.stem,
    ...(question.exhibit ? { exhibit: question.exhibit } : {}),
    answerChoices: question.answerChoices.map((choice) => ({
      id: choice.id,
      label: choice.label,
      isCorrect: choice.isCorrect,
      rationale: choice.rationale,
      serviceRequest: null,
    })),
    shuffleAnswers: true,
    explanation: question.explanation,
    sourceLabels,
    resultGateAfter: null,
    terminalDispositions: isFinal ? question.answerChoices.filter((choice) => !choice.isCorrect).map((choice) => ({
      answerChoiceId: choice.id,
      kind: "no_terminal_outcome",
      consequenceNarrative: "Review the outside specialist record and the selected plan.",
      clinicalRationale: choice.rationale!,
      sourceLabels,
    })) : [],
  });
});

const nodeById = new Map(SOFT_TISSUE_SARCOMA_DESMOID_TOPIC_NODES.map((node) => [node.id, node]));

export const SOFT_TISSUE_SARCOMA_DESMOID_TOPIC_TESTED_CONCEPTS: TestedConcept[] = packet.conceptDecisions.map((decision) => {
  const passed = packet.reviewRound.snapshot.testedConcepts.find((concept) =>
    concept.id === decision.conceptId && packet.reviewRound.passFreeze.some((item) => item.conceptId === concept.id));
  if (passed) return testedConceptSchema.parse(passed);
  const reused = packet.reusedConceptDefinitions.find((concept) => concept.id === decision.conceptId);
  if (reused) return testedConceptSchema.parse(reused);
  const item = activeItems.find((node) => node.conceptId === decision.conceptId)!;
  return testedConceptSchema.parse({
    id: item.conceptId,
    displayName: item.objective,
    learningObjective: item.objective,
    earliestFacilityStage: 0,
    conceptType: item.conceptType,
  });
});

export interface SoftTissueSarcomaDesmoidConceptProposal extends TestedConcept, AuthoredClinicalRecord {
  previousConceptId: string | null;
  conceptRelation: "new_meaning" | "existing_meaning_variant";
  educationalTier: number;
  evidenceClaimIds: string[];
}

export const SOFT_TISSUE_SARCOMA_DESMOID_TOPIC_CONCEPT_PROPOSALS: SoftTissueSarcomaDesmoidConceptProposal[] =
  SOFT_TISSUE_SARCOMA_DESMOID_TOPIC_TESTED_CONCEPTS.map((concept) => {
    const preserved = packet.reviewRound.passFreeze.find((item) => item.conceptId === concept.id);
    if (preserved) return preserved.concept as SoftTissueSarcomaDesmoidConceptProposal;
    const decision = packet.conceptDecisions.find((entry) => entry.conceptId === concept.id)!;
    return {
      ...concept,
      ...SOFT_TISSUE_SARCOMA_DESMOID_TOPIC_DRAFT,
      previousConceptId: decision.previousConceptId,
      conceptRelation: decision.conceptRelation as SoftTissueSarcomaDesmoidConceptProposal["conceptRelation"],
      educationalTier: 1,
      evidenceClaimIds: decision.evidenceClaimIds,
    };
  });

/** The schema's finite-profile field name is not a grant of clinical approval. */
export const SOFT_TISSUE_SARCOMA_DESMOID_TOPIC_CASES: SyntheticClinicalCase[] = packet.caseCompositionProposals.map((item) => {
  const nodes = item.nodeIds.map((nodeId) => nodeById.get(nodeId)!);
  const preserved = packet.reviewRound.passFreeze.find((entry) => entry.caseId === item.id);
  if (preserved) return syntheticClinicalCaseSchema.parse({
    ...preserved.caseHeader,
    sourceLabels: preserved.caseSourceLabels,
    decisionNodes: nodes,
    // The aggregate summary drops the parked precursor, preserving PASS feedback exactly.
    learningSummary: nodes.map((node) => node.explanation).join(" "),
  });
  return syntheticClinicalCaseSchema.parse({
    id: item.id,
    displayName: item.displayName,
    patientPresentationVariantId: item.patientPresentationVariantId,
    releasePointId: "release.l0.clinic_evaluation",
    patientDisplayName: item.patientDisplayName,
    prototypeDemographics: item.prototypeDemographics,
    chiefComplaint: item.chiefComplaint,
    presentation: item.presentation,
    approvedInstantiationProfiles: [{
      id: item.patientPresentationVariantId.replace(/^presentation\./, "profile."),
      prototypeDemographics: item.prototypeDemographics,
      chiefComplaint: item.chiefComplaint,
      presentation: item.presentation,
    }],
    tutorialEligible: false,
    routineEligible: true,
    earliestFacilityStage: item.earliestFacilityStage,
    requiredClinicalSetting: "clinic",
    requiredCapabilityIds: [],
    rewardTierId: "reward.referral",
    sourceLabels: [...new Set(nodes.flatMap((node) => node.sourceLabels))],
    decisionNodes: nodes,
    learningSummary: nodes.map((node) => node.explanation).join(" "),
  });
});

export const SOFT_TISSUE_SARCOMA_DESMOID_TOPIC_CASE_PROPOSALS = packet.caseCompositionProposals.map((item) => ({
  ...item,
  ...SOFT_TISSUE_SARCOMA_DESMOID_TOPIC_DRAFT,
  contentVersion: packet.reviewRound.passFreeze.find((entry) => entry.caseId === item.id)?.question.contentVersion
    ?? packet.contentVersion,
}));

export const SOFT_TISSUE_SARCOMA_DESMOID_TOPIC_TIMING_ENTRIES: AnswerChoiceTimingRegistryEntry[] =
  packet.timingProposals.map((entry) => answerChoiceTimingRegistryEntrySchema.parse(entry));

export const SOFT_TISSUE_SARCOMA_DESMOID_TOPIC_INTEGRATION = {
  publicationStatus: "authoring_sidecar",
  reviewStatus: "needs_clinician_review",
  managerAcceptance: null,
  independentReview: "five_exact_v1_PASS_preserved_ten_v2_awaiting_re_review",
  dependencies: packet.integrationDependencies,
} as const;
