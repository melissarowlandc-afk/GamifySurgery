import packet from "../../../docs/research/question-topic-hematology-transfusion-coagulation-20261111.json";
import ledger from "../../../docs/research/sources-question-topic-hematology-transfusion-coagulation-20261111.json";
import type { ClinicalSource, EvidenceClaim, QuestionVariant } from "./pilot-schema";
import {
  answerChoiceTimingRegistryEntrySchema,
  caseExhibitSchema,
  decisionNodeSchema,
  syntheticClinicalCaseSchema,
  testedConceptSchema,
  type DecisionNode,
  type SyntheticClinicalCase,
  type TestedConcept,
} from "./schema";

/** Explicit-import authoring sidecar; the manager owns every release installation. */
export const HEMATOLOGY_TOPIC_PACKET = packet;
export const HEMATOLOGY_TOPIC_SOURCE_LEDGER = ledger;
export const HEMATOLOGY_TOPIC_DRAFT = {
  contentVersion: packet.contentVersion,
  reviewStatus: "needs_clinician_review",
  aiAssistedDrafting: true,
  lastClinicianReview: null,
} as const;

export const HEMATOLOGY_TOPIC_SOURCES = ledger.sources as ClinicalSource[];
export const HEMATOLOGY_TOPIC_CLAIMS = ledger.evidenceClaims as EvidenceClaim[];
export const HEMATOLOGY_TOPIC_AUDIT = packet.audit;
export const HEMATOLOGY_TOPIC_SOURCE_LINKS = packet.sourceLinkProposals;
export const HEMATOLOGY_TOPIC_ORDER_PROPOSALS = packet.orderProposals;
export const HEMATOLOGY_TOPIC_FROZEN_PASS = packet.frozenIndependentPass;
export const HEMATOLOGY_TOPIC_HISTORICAL_APPROVALS = packet.frozenClinicalApprovals;
export const HEMATOLOGY_TOPIC_REVIEW_DISPOSITIONS = packet.reviewRound.items;
export const HEMATOLOGY_TOPIC_REVIEW_PASS = packet.reviewRound.exactPassFreeze;
export const HEMATOLOGY_TOPIC_PARKED_ITEMS = packet.parkedNodes;

function sourceLabels(claimIds: readonly string[]): string[] {
  const used = new Set(HEMATOLOGY_TOPIC_CLAIMS.filter((claim) => claimIds.includes(claim.id))
    .flatMap((claim) => claim.sourceIds));
  return HEMATOLOGY_TOPIC_SOURCES.filter((source) => used.has(source.id)).map((source) => source.title);
}

export const HEMATOLOGY_TOPIC_QUESTIONS: QuestionVariant[] = packet.proposedNodes.map((item) => {
  if (item.questionVariantId === HEMATOLOGY_TOPIC_REVIEW_PASS.question.id) {
    return HEMATOLOGY_TOPIC_REVIEW_PASS.question as QuestionVariant;
  }
  return {
  ...HEMATOLOGY_TOPIC_DRAFT,
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
  };
});

export const HEMATOLOGY_TOPIC_NODES: DecisionNode[] = packet.proposedNodes.map((item, index) => {
  if (item.nodeId === HEMATOLOGY_TOPIC_REVIEW_PASS.node.id) {
    return decisionNodeSchema.parse(HEMATOLOGY_TOPIC_REVIEW_PASS.node);
  }
  const question = HEMATOLOGY_TOPIC_QUESTIONS[index]!;
  const labels = sourceLabels(question.supportingEvidenceClaimIds);
  const siblings = packet.proposedNodes.filter((proposal) => proposal.caseId === item.caseId);
  const last = siblings[siblings.length - 1]!.nodeId === item.nodeId;
  return decisionNodeSchema.parse({
    id: item.nodeId,
    questionVariantId: question.id,
    primaryConceptId: question.conceptId,
    ...(item.currentUpdate ? { currentUpdate: item.currentUpdate } : {}),
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
    terminalDispositions: last ? question.answerChoices.filter((choice) => !choice.isCorrect).map((choice) => ({
      answerChoiceId: choice.id,
      kind: "no_terminal_outcome",
      consequenceNarrative: "The founder reviews a clinical decision; this draft simulates no intervention or patient outcome.",
      clinicalRationale: choice.rationale,
      sourceLabels: labels,
    })) : [],
  });
});

export const HEMATOLOGY_TOPIC_CONCEPTS: TestedConcept[] = packet.proposedNodes.map((item) =>
  testedConceptSchema.parse({
    id: item.conceptId,
    displayName: item.objective,
    learningObjective: item.objective,
    earliestFacilityStage: 0,
    conceptType: item.conceptType,
  }));

export const HEMATOLOGY_TOPIC_AUTHORING_CONCEPTS = HEMATOLOGY_TOPIC_CONCEPTS.map((concept, index) => ({
  ...HEMATOLOGY_TOPIC_DRAFT,
  contentVersion: packet.proposedNodes[index]!.contentVersion,
  ...concept,
  educationalTier: 2,
  previousConceptId: packet.proposedNodes[index]!.previousConceptId,
  conceptRelation: packet.proposedNodes[index]!.conceptRelation,
  evidenceClaimIds: packet.proposedNodes[index]!.supportingEvidenceClaimIds,
  historyMigration: "None. Preserve existing histories and every old exact definition; changed meanings use new IDs.",
}));

/** Critically ill episodes are historical records reviewed by stable patients in clinic. */
export const HEMATOLOGY_TOPIC_CASES: SyntheticClinicalCase[] = packet.caseCompositionProposals.map((item) => {
  if (item.id === HEMATOLOGY_TOPIC_REVIEW_PASS.case.id) {
    // The reviewed node was already terminal. Only membership changes in this split.
    return syntheticClinicalCaseSchema.parse({
      ...HEMATOLOGY_TOPIC_REVIEW_PASS.case,
      decisionNodes: [HEMATOLOGY_TOPIC_REVIEW_PASS.node],
    });
  }
  const proposed = packet.proposedNodes.filter((node) => node.caseId === item.id);
  const ids = new Set(proposed.map((node) => node.nodeId));
  const labels = sourceLabels([...new Set(proposed.flatMap((node) => node.supportingEvidenceClaimIds))]);
  return syntheticClinicalCaseSchema.parse({
    id: item.id,
    displayName: `${item.name}: hematology record review`,
    patientPresentationVariantId: item.patientPresentationVariantId,
    releasePointId: "release.l0.clinic_evaluation",
    patientDisplayName: item.name,
    prototypeDemographics: { ageYears: item.age, sexLabel: item.sex },
    chiefComplaint: item.chiefComplaint,
    presentation: item.presentation,
    approvedInstantiationProfiles: [{
      id: item.profileId,
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
    sourceLabels: labels,
    decisionNodes: HEMATOLOGY_TOPIC_NODES.filter((node) => ids.has(node.id)),
    learningSummary: "Interpret the supplied record at each care phase and review the evidence-limited reasoning after each choice.",
  });
});

export const HEMATOLOGY_TOPIC_TIMING_PROPOSALS = packet.timingProposals.map((entry) =>
  answerChoiceTimingRegistryEntrySchema.parse(entry));

export const HEMATOLOGY_TOPIC_REVIEW_METADATA = {
  ...HEMATOLOGY_TOPIC_DRAFT,
  independentPass: false,
  managerAccepted: false,
  publicReleaseAuthorized: false,
  reviewDisplay: "key shown first for review only",
  independentPassQuestionVariantIds: packet.reviewRound.items
    .filter((item) => item.status === "pass-preserved")
    .map((item) => item.beforeQuestionVariantId),
  compositionPolicy: packet.reviewRound.compositionPolicy,
  holds: packet.ownerApprovalsNeeded,
  caseReviews: packet.caseCompositionProposals.map((item) => ({
    ...HEMATOLOGY_TOPIC_DRAFT,
    caseId: item.id,
    educationalTier: item.educationalTier,
    patientAcuity: item.patientAcuity,
    historicalRecordAcuity: item.historicalRecordAcuity,
    earliestFacilityStage: item.earliestFacilityStage,
    requiredClinicalSetting: item.requiredClinicalSetting,
    requiredFacilityCapabilityIds: item.requiredCapabilityIds,
  })),
} as const;
