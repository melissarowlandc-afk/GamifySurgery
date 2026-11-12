import packet from "../../../docs/research/question-topic-critical-respiratory-ventilation-20261111.json";
import ledger from "../../../docs/research/sources-question-topic-critical-respiratory-ventilation-20261111.json";
import type { AuthoredClinicalRecord, ClinicalSource, EvidenceClaim, QuestionVariant } from "./pilot-schema";
import {
  answerChoiceTimingRegistryEntrySchema,
  caseExhibitSchema,
  decisionNodeSchema,
  syntheticClinicalCaseSchema,
  type DecisionNode,
  type SyntheticClinicalCase,
  type TestedConcept,
} from "./schema";

/** Explicit-import authoring sidecar. No manifest, catalog, or service installation. */
export const RESPIRATORY_TOPIC_PACKET = packet;
export const RESPIRATORY_TOPIC_SOURCE_LEDGER = ledger;
export const RESPIRATORY_TOPIC_DRAFT = {
  contentVersion: packet.contentVersion,
  reviewStatus: "needs_clinician_review",
  aiAssistedDrafting: true,
  lastClinicianReview: null,
} as const;

export const RESPIRATORY_TOPIC_SOURCES = ledger.sources as ClinicalSource[];
export const RESPIRATORY_TOPIC_CLAIMS = ledger.evidenceClaims as EvidenceClaim[];
export const RESPIRATORY_TOPIC_SOURCE_LINKS = packet.sourceLinkProposals;
export const RESPIRATORY_TOPIC_AUDIT = packet.audit;
export const RESPIRATORY_TOPIC_ORDER_PROPOSALS = [
  ...packet.orderProposals,
  ...packet.salvageRound.orderProposals,
];
export const RESPIRATORY_TOPIC_REVIEW_DISPOSITIONS = packet.reviewRound.dispositions;
export const RESPIRATORY_TOPIC_PASS_FREEZE = packet.reviewRound.passFreeze;
export const RESPIRATORY_TOPIC_PARKED_ATTEMPTS = packet.reviewRound.parkedAttempts;
export const RESPIRATORY_TOPIC_HELD_PRESERVED = packet.reviewRound.heldPreserved;
export const RESPIRATORY_TOPIC_CONTEXT_HOLDS = packet.reviewRound.contextCompositionHolds;
/** Full reviewed contexts are evidence, not authorization to admit returned companions. */
export const RESPIRATORY_TOPIC_FROZEN_CASES = packet.reviewRound.passFreeze.map((item) =>
  syntheticClinicalCaseSchema.parse(item.caseDefinition));
export const RESPIRATORY_TOPIC_SALVAGE_ITEMS = packet.salvageRound.items;
export const RESPIRATORY_TOPIC_SALVAGE_CASES: SyntheticClinicalCase[] =
  packet.salvageRound.caseDefinitions.map((item) => syntheticClinicalCaseSchema.parse(item));
export const RESPIRATORY_TOPIC_SALVAGE_NODES: DecisionNode[] =
  RESPIRATORY_TOPIC_SALVAGE_CASES.flatMap((item) => item.decisionNodes);

export const RESPIRATORY_TOPIC_QUESTIONS: QuestionVariant[] = packet.proposedNodes.map((item) => {
  const passed = packet.reviewRound.passFreeze.find((entry) => entry.questionVariantId === item.questionVariantId);
  if (passed) return passed.questionDefinition as QuestionVariant;
  return ({
  ...RESPIRATORY_TOPIC_DRAFT,
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
    distractorRationale: choice.isCorrect ? null : choice.rationale,
  })),
  explanation: item.explanation,
  supportingEvidenceClaimIds: item.supportingEvidenceClaimIds,
  });
});

function sourceLabels(claimIds: readonly string[]): string[] {
  const used = new Set(RESPIRATORY_TOPIC_CLAIMS.filter((claim) => claimIds.includes(claim.id))
    .flatMap((claim) => claim.sourceIds));
  return RESPIRATORY_TOPIC_SOURCES.filter((source) => used.has(source.id)).map((source) => source.title);
}

export const RESPIRATORY_TOPIC_NODES: DecisionNode[] = packet.proposedNodes.map((item, index) => {
  const passed = packet.reviewRound.passFreeze.find((entry) => entry.questionVariantId === item.questionVariantId);
  if (passed) return decisionNodeSchema.parse(passed.nodeDefinition);
  const question = RESPIRATORY_TOPIC_QUESTIONS[index]!;
  const labels = sourceLabels(question.supportingEvidenceClaimIds);
  const siblings = packet.proposedNodes.filter((proposal) => proposal.caseId === item.caseId);
  const finalNode = siblings[siblings.length - 1]!.nodeId === item.nodeId;
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
    sourceLabels: labels,
    resultGateAfter: null,
    terminalDispositions: finalNode ? question.answerChoices.filter((choice) => !choice.isCorrect).map((choice) => ({
      answerChoiceId: choice.id,
      kind: "no_terminal_outcome",
      consequenceNarrative: "The founder reviews the historical decision; no clinical intervention is simulated.",
      clinicalRationale: choice.rationale,
      sourceLabels: labels,
    })) : [],
  });
});

export interface RespiratoryConceptProposal extends TestedConcept, AuthoredClinicalRecord {
  educationalTier: number;
  previousConceptId: string | null;
  conceptRelation: string;
  evidenceClaimIds: string[];
}

export const RESPIRATORY_TOPIC_CONCEPT_PROPOSALS: RespiratoryConceptProposal[] =
  packet.proposedNodes.map((item) => ({
    ...RESPIRATORY_TOPIC_DRAFT,
    contentVersion: item.contentVersion,
    id: item.conceptId,
    displayName: item.objective,
    learningObjective: item.objective,
    conceptType: item.conceptType as TestedConcept["conceptType"],
    earliestFacilityStage: 0,
    educationalTier: 2,
    previousConceptId: item.previousConceptId,
    conceptRelation: item.conceptRelation,
    evidenceClaimIds: item.supportingEvidenceClaimIds,
  }));

/** Earlier authoring compositions remain inspectable without admitting their companions. */
export const RESPIRATORY_TOPIC_RETAINED_CASES: SyntheticClinicalCase[] = packet.caseCompositionProposals
  .filter((item) => !packet.reviewRound.contextCompositionHolds.some((hold) => hold.caseId === item.id))
  .map((item) => {
  const passed = packet.reviewRound.passFreeze.find((entry) => entry.caseDefinition.id === item.id);
  if (passed) return syntheticClinicalCaseSchema.parse(passed.caseDefinition);
  const nodes = RESPIRATORY_TOPIC_NODES.filter((node) =>
    packet.proposedNodes.some((proposal) => proposal.caseId === item.id && proposal.nodeId === node.id));
  const claims = packet.proposedNodes.filter((proposal) => proposal.caseId === item.id)
    .flatMap((proposal) => proposal.supportingEvidenceClaimIds);
  return syntheticClinicalCaseSchema.parse({
    id: item.id,
    displayName: `${item.name}: outside-record review`,
    patientPresentationVariantId: `presentation.topic.${packet.topicSlug}.${item.key}.v2`,
    releasePointId: "release.l0.clinic_evaluation",
    patientDisplayName: item.name,
    prototypeDemographics: { ageYears: item.age, sexLabel: item.sex },
    chiefComplaint: item.chiefComplaint,
    presentation: item.presentation,
    approvedInstantiationProfiles: [{
      id: `profile.topic.${packet.topicSlug}.${item.key}.v2`,
      prototypeDemographics: { ageYears: item.age, sexLabel: item.sex },
      chiefComplaint: item.chiefComplaint,
      presentation: item.presentation,
    }],
    tutorialEligible: false,
    routineEligible: true,
    earliestFacilityStage: 0,
    requiredClinicalSetting: "clinic",
    requiredCapabilityIds: [],
    rewardTierId: "reward.clinic_basic",
    sourceLabels: sourceLabels(claims),
    decisionNodes: nodes,
    learningSummary: "Review the historical observations and the reasoning for each recorded support decision.",
  });
});

/** Standalone salvage wrappers replace ambiguous mixed-case occurrences in this review projection. */
export const RESPIRATORY_TOPIC_CASES: SyntheticClinicalCase[] = [
  ...RESPIRATORY_TOPIC_RETAINED_CASES.filter((item) =>
    !packet.salvageRound.replacedMixedCaseIds.includes(item.id)),
  ...RESPIRATORY_TOPIC_SALVAGE_CASES,
];

export const RESPIRATORY_TOPIC_TIMING_PROPOSALS = [
  ...packet.timingProposals,
  ...packet.salvageRound.timingProposals,
].map((entry) =>
  answerChoiceTimingRegistryEntrySchema.parse(entry));

/** These holds survive authoring and automated validation. */
export const RESPIRATORY_TOPIC_RELEASE_HOLDS = packet.ownerApprovalsNeeded;
export const RESPIRATORY_TOPIC_REVIEW_METADATA = {
  ...RESPIRATORY_TOPIC_DRAFT,
  independentPass: false,
  exactIndependentPassQuestionIds: packet.reviewRound.passFreeze.map((item) => item.questionVariantId),
  responseCounts: packet.reviewRound.counts,
  salvageCounts: packet.salvageRound.counts,
  salvageReviewQueue: packet.salvageRound.reviewQueue,
  managerAccepted: false,
  publicReleaseAuthorized: false,
  reviewDisplay: "key shown first for review only",
  caseReviews: [...packet.caseCompositionProposals.map((item) => ({
    ...RESPIRATORY_TOPIC_DRAFT,
    caseId: item.id,
    educationalTier: item.educationalTier,
    patientAcuity: item.patientAcuity,
    historicalRecordAcuity: item.historicalRecordAcuity,
    earliestFacilityStage: item.earliestFacilityStage,
    requiredClinicalSetting: item.requiredClinicalSetting,
    requiredFacilityCapabilityIds: item.requiredCapabilityIds,
  })), ...packet.salvageRound.items.map((item) => ({
    ...RESPIRATORY_TOPIC_DRAFT,
    contentVersion: item.contentVersion,
    status: item.status,
    caseId: item.caseId,
    educationalTier: 2,
    patientAcuity: "stable",
    historicalRecordAcuity: "critical",
    earliestFacilityStage: item.caseDefinition.earliestFacilityStage,
    requiredClinicalSetting: item.caseDefinition.requiredClinicalSetting,
    requiredFacilityCapabilityIds: item.caseDefinition.requiredCapabilityIds,
  }))],
} as const;
