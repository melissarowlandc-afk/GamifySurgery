import packet from "../../../docs/research/question-topic-esophagus-gerd-barrett-hiatal-20261111.json";
import ledger from "../../../docs/research/sources-question-topic-esophagus-gerd-barrett-hiatal-20261111.json";
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

/** Explicit-import authoring sidecar. Release admission belongs to the manager. */
export const EGH_TOPIC_PACKET = packet;
export const EGH_TOPIC_SOURCE_LEDGER = ledger;
export const EGH_TOPIC_DRAFT = {
  contentVersion: packet.contentVersion,
  reviewStatus: "needs_clinician_review",
  aiAssistedDrafting: true,
  lastClinicianReview: null,
} as const;
export const EGH_TOPIC_MANIFEST = packet.manifest;
export const EGH_TOPIC_AUDIT = packet.audit;
export const EGH_TOPIC_AUTHOR_CHECKS = packet.proposedNodes.map(item => ({
  questionVariantId: item.questionVariantId,
  reasoning: item.reasoning,
  manualAuthorGate: item.manualAuthorGate,
  validationRole: item.authorValidationRole,
}));
export const EGH_TOPIC_SOURCES = ledger.sources as ClinicalSource[];
export const EGH_TOPIC_CLAIMS = ledger.evidenceClaims as EvidenceClaim[];
export const EGH_TOPIC_SOURCE_LINKS = packet.sourceLinkProposals;
export const EGH_TOPIC_ORDER_PROPOSALS = packet.testOrderProposals;
export const EGH_TOPIC_STATEMENT_MAPPINGS = packet.statementMappings;
export const EGH_TOPIC_WITHHELD = packet.withheldTeachingPoints;
export const EGH_TOPIC_OWNER_APPROVALS = packet["Owner approvals needed"];
export const EGH_TOPIC_ITEM_STATUSES = packet.itemStatuses;
export const EGH_TOPIC_PARKED_ITEMS = packet.parkedItems;
export const EGH_TOPIC_REVISION_RESPONSES = packet.revisionResponses;

/** Exact reviewed artifacts: do not rebuild PASS fields from changed surrounding data. */
export const EGH_TOPIC_REVIEWED_ARTIFACTS = {
  questions: packet.reviewedArtifacts.questions as QuestionVariant[],
  nodes: packet.reviewedArtifacts.nodes as DecisionNode[],
  cases: packet.reviewedArtifacts.cases as SyntheticClinicalCase[],
  concepts: packet.reviewedArtifacts.concepts as TestedConcept[],
  conceptProposals: packet.reviewedArtifacts.conceptProposals as EghConceptProposal[],
  timingEntries: packet.reviewedArtifacts.timingEntries as AnswerChoiceTimingRegistryEntry[],
};
export const EGH_TOPIC_FROZEN_PASS_CONTEXTS = packet.frozenPassContexts.map(receipt => ({
  ...receipt,
  clinicalCase: EGH_TOPIC_REVIEWED_ARTIFACTS.cases.find(item => item.id === receipt.caseId)!,
  node: EGH_TOPIC_REVIEWED_ARTIFACTS.nodes.find(item => item.questionVariantId === receipt.questionVariantId)!,
  question: EGH_TOPIC_REVIEWED_ARTIFACTS.questions.find(item => item.id === receipt.questionVariantId)!,
  timing: EGH_TOPIC_REVIEWED_ARTIFACTS.timingEntries.find(item => item.questionVariantId === receipt.questionVariantId)!,
  definition: packet.reviewedPacket.proposedNodes.find(item => item.questionVariantId === receipt.questionVariantId)!,
}));
export const EGH_TOPIC_FROZEN_CONTEXT_ONLY_PASS_IDS = packet.frozenContextOnlyQuestionIds;
const passByQuestion = new Map(EGH_TOPIC_FROZEN_PASS_CONTEXTS.map(item => [item.questionVariantId, item]));

function sourceLabelsFor(claimIds: readonly string[]): string[] {
  const ids = new Set(EGH_TOPIC_CLAIMS.filter(claim => claimIds.includes(claim.id))
    .flatMap(claim => claim.sourceIds));
  return EGH_TOPIC_SOURCES.filter(source => ids.has(source.id)).map(source => source.title);
}

export const EGH_TOPIC_QUESTIONS: QuestionVariant[] = packet.proposedNodes.map(item =>
  passByQuestion.get(item.questionVariantId)?.question ?? ({
  ...EGH_TOPIC_DRAFT,
  contentVersion: item.contentVersion,
  id: item.questionVariantId,
  conceptId: item.conceptId,
  stem: item.task,
  exhibit: caseExhibitSchema.parse(item.exhibit),
  answerChoices: item.choices.map(choice => ({
    id: choice.id,
    label: choice.label,
    isCorrect: choice.isCorrect,
    rationale: choice.rationale,
    distractorRationale: choice.isCorrect ? null : choice.rationale,
  })),
  explanation: item.explanation,
  supportingEvidenceClaimIds: item.supportingEvidenceClaimIds,
}));

const questionById = new Map(EGH_TOPIC_QUESTIONS.map(question => [question.id, question]));

export const EGH_TOPIC_NODES: DecisionNode[] = packet.proposedNodes.map(item => {
  const frozen = passByQuestion.get(item.questionVariantId);
  if (frozen) return frozen.node;
  const question = questionById.get(item.questionVariantId)!;
  const sources = sourceLabelsFor(question.supportingEvidenceClaimIds);
  const clinicalCase = packet.caseCompositionProposals.find(candidate => candidate.id === item.caseId)!;
  const isFinal = clinicalCase.nodeIds.at(-1) === item.nodeId;
  return decisionNodeSchema.parse({
    id: item.nodeId,
    questionVariantId: question.id,
    primaryConceptId: question.conceptId,
    ...(item.currentUpdate ? { currentUpdate: item.currentUpdate } : {}),
    stem: question.stem,
    exhibit: question.exhibit,
    answerChoices: question.answerChoices.map(choice => ({
      id: choice.id,
      label: choice.label,
      isCorrect: choice.isCorrect,
      rationale: choice.rationale,
      serviceRequest: null,
    })),
    shuffleAnswers: true,
    explanation: question.explanation,
    sourceLabels: sources,
    // Later records are completed outside records, not results promised by a game order.
    resultGateAfter: null,
    terminalDispositions: isFinal ? question.answerChoices.filter(choice => !choice.isCorrect).map(choice => ({
      answerChoiceId: choice.id,
      kind: "no_terminal_outcome",
      consequenceNarrative: "Review the recorded findings and the proposed care plan.",
      clinicalRationale: choice.rationale!,
      sourceLabels: sources,
    })) : [],
  });
});

export const EGH_TOPIC_TESTED_CONCEPTS: TestedConcept[] = packet.conceptDecisions.map(decision =>
  EGH_TOPIC_REVIEWED_ARTIFACTS.concepts.find(item => item.id === decision.conceptId) ?? testedConceptSchema.parse({
    id: decision.conceptId,
    displayName: decision.displayName,
    learningObjective: decision.objective,
    earliestFacilityStage: 0,
    conceptType: decision.conceptType,
  }));

export interface EghConceptProposal extends TestedConcept, AuthoredClinicalRecord {
  previousConceptId: string | null;
  conceptRelation: "existing_meaning_variant" | "new_meaning";
  educationalTier: number;
  evidenceClaimIds: string[];
  historyMigration: string;
}

export const EGH_TOPIC_CONCEPT_PROPOSALS: EghConceptProposal[] = EGH_TOPIC_TESTED_CONCEPTS.map(concept => {
  const original = EGH_TOPIC_REVIEWED_ARTIFACTS.conceptProposals.find(item => item.id === concept.id);
  if (original) return original;
  const decision = packet.conceptDecisions.find(item => item.conceptId === concept.id)!;
  return {
    ...concept,
    ...EGH_TOPIC_DRAFT,
    previousConceptId: decision.previousConceptId,
    conceptRelation: decision.conceptRelation as EghConceptProposal["conceptRelation"],
    educationalTier: 1,
    evidenceClaimIds: decision.evidenceClaimIds,
    historyMigration: decision.historyMigration,
  };
});

const nodeById = new Map(EGH_TOPIC_NODES.map(node => [node.id, node]));

/** Existing clinic/profile representations; the schema's profile name grants no clinical approval. */
export const EGH_TOPIC_CASES: SyntheticClinicalCase[] = packet.caseCompositionProposals.map(item => {
  const frozenCase = EGH_TOPIC_REVIEWED_ARTIFACTS.cases.find(candidate => candidate.id === item.id);
  if (frozenCase) return frozenCase;
  const nodes = item.nodeIds.map(id => nodeById.get(id)!);
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
    sourceLabels: [...new Set(nodes.flatMap(node => node.sourceLabels))],
    decisionNodes: nodes,
    learningSummary: nodes.map(node => node.explanation).join(" "),
  });
});

export const EGH_TOPIC_TIMING_ENTRIES: AnswerChoiceTimingRegistryEntry[] = packet.timingProposals
  .map(entry => answerChoiceTimingRegistryEntrySchema.parse(entry));

export const EGH_TOPIC_CASE_REVIEWS = packet.caseCompositionProposals.map(item => ({
  ...EGH_TOPIC_DRAFT,
  caseId: item.id,
  educationalTier: item.educationalTier,
  acuity: item.acuity,
  earliestFacilityStage: item.earliestFacilityStage,
  requiredCapabilityIds: item.requiredCapabilityIds,
  clinicalSettingScope: "clinic_with_outside_record_review",
  selectionConstraint: item.nodeIds.length > 1
    ? "Paired-only. Every companion must be unseen or due under the unchanged selector; a future-due companion may block supply. Later nodes require their self-contained current update."
    : "Standalone clinic case.",
}));

export const EGH_TOPIC_PREVIEW_RELEASE = {
  id: "clinical.synthetic.prototype.v1",
  schemaVersion: 1,
  publicationStatus: "synthetic_unapproved_prototype",
  disclaimer: "Synthetic explicit-import authoring preview. Not clinically approved. Independent review, manager acceptance and exact clinical sign-off remain separate.",
  concepts: EGH_TOPIC_TESTED_CONCEPTS,
  cases: EGH_TOPIC_CASES,
} as const;

/** Five new context proposals only. Existing reviewed/accepted exports stay exact. */
export const EGH_TOPIC_SALVAGE_ITEMS = packet.salvageItems;
export const EGH_TOPIC_SALVAGE_REVIEW_QUEUE = packet.currentReviewQueue;
export const EGH_TOPIC_SALVAGE_REVISION_DEFINITIONS = packet.salvageRevisionDefinitions;
export const EGH_TOPIC_SALVAGE_QUESTIONS: QuestionVariant[] = packet.salvageItems.map(item => {
  const revision = packet.salvageQuestionRevisions.find(question => question.id === item.questionVariantId);
  return revision ? { ...revision, exhibit: caseExhibitSchema.parse(revision.exhibit) } as QuestionVariant
    : questionById.get(item.questionVariantId)!;
});
export const EGH_TOPIC_SALVAGE_NODES: DecisionNode[] = packet.salvageItems.map(item => {
  const revision = packet.salvageNodeRevisions.find(node => node.id === item.nodeId);
  if (revision) return decisionNodeSchema.parse(revision);
  const original = nodeById.get(item.nodeId)!;
  if (original.terminalDispositions.length > 0) return original;
  // A formerly intermediate node now ends its own case. This binding has no
  // clinical outcome; all learner wording, choices and feedback remain exact.
  return decisionNodeSchema.parse({
    ...original,
    terminalDispositions: original.answerChoices.filter(choice => !choice.isCorrect).map(choice => ({
      answerChoiceId: choice.id,
      kind: "no_terminal_outcome",
      consequenceNarrative: "Review the recorded findings and the proposed care plan.",
      clinicalRationale: choice.rationale!,
      sourceLabels: original.sourceLabels,
    })),
  });
});
const salvageNodeById = new Map(EGH_TOPIC_SALVAGE_NODES.map(node => [node.id, node]));
export const EGH_TOPIC_SALVAGE_CASES: SyntheticClinicalCase[] = packet.salvageCaseCompositionProposals.map(item => {
  const node = salvageNodeById.get(item.nodeIds[0]!)!;
  return syntheticClinicalCaseSchema.parse({
    id: item.id,
    displayName: item.displayName,
    patientPresentationVariantId: item.patientPresentationVariantId,
    releasePointId: item.releasePointId,
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
    requiredCapabilityIds: item.requiredCapabilityIds,
    rewardTierId: "reward.referral",
    sourceLabels: node.sourceLabels,
    decisionNodes: [node],
    learningSummary: node.explanation,
  });
});
export const EGH_TOPIC_SALVAGE_CASE_REVIEWS = packet.salvageCaseCompositionProposals.map(item => ({
  contentVersion: item.contentVersion,
  reviewStatus: "needs_clinician_review",
  aiAssistedDrafting: true,
  lastClinicianReview: null,
  status: "salvage",
  caseId: item.id,
  sourceCaseId: item.sourceCaseId,
  educationalTier: item.educationalTier,
  acuity: item.acuity,
  earliestFacilityStage: item.earliestFacilityStage,
  requiredCapabilityIds: item.requiredCapabilityIds,
  contextRecheckRequired: true,
  selectionConstraint: "Standalone clinic chart review; no companion is scored.",
} as const));
export const EGH_TOPIC_SALVAGE_TIMING_ENTRIES: AnswerChoiceTimingRegistryEntry[] = packet.salvageTimingProposals
  .map(entry => answerChoiceTimingRegistryEntrySchema.parse(entry));
export const EGH_TOPIC_SALVAGE_ORDER_PROPOSALS = packet.salvageTestOrderProposals;
export const EGH_TOPIC_SALVAGE_PREVIEW_RELEASE = {
  id: "clinical.synthetic.prototype.v1",
  schemaVersion: 1,
  publicationStatus: "synthetic_unapproved_prototype",
  disclaimer: "Synthetic explicit-import salvage preview. Not clinically approved. Three exact PASS contexts preserved; two revised contexts await independent recheck.",
  concepts: EGH_TOPIC_TESTED_CONCEPTS.filter(concept => EGH_TOPIC_SALVAGE_QUESTIONS
    .some(question => question.conceptId === concept.id)),
  cases: EGH_TOPIC_SALVAGE_CASES,
} as const;
