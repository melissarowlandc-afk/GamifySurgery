import packet from "../../../docs/research/question-topic-critical-renal-organ-support-20261111.json";
import ledger from "../../../docs/research/sources-question-topic-critical-renal-organ-support-20261111.json";
import type {
  AuthoredClinicalRecord,
  ClinicalSource,
  EvidenceClaim,
  QuestionVariant,
} from "./pilot-schema";
import {
  answerChoiceTimingRegistryEntrySchema,
  caseExhibitSchema,
  decisionNodeSchema,
  syntheticClinicalCaseSchema,
  testedConceptSchema,
  validateSyntheticClinicalRelease,
  type AnswerChoiceTimingRegistryEntry,
  type DecisionNode,
  type SyntheticClinicalCase,
  type TestedConcept,
} from "./schema";

/** Explicit-import authoring sidecar for manager and independent review. */
export const CRITICAL_RENAL_TOPIC_PACKET = packet;
export const CRITICAL_RENAL_TOPIC_SOURCE_LEDGER = ledger;
export const CRITICAL_RENAL_TOPIC_DRAFT = {
  contentVersion: "clinical.question-topic.critical-renal-organ-support.2026-11-11.v1",
  reviewStatus: "needs_clinician_review",
  aiAssistedDrafting: true,
  lastClinicianReview: null,
} as const;

export const CRITICAL_RENAL_TOPIC_SOURCES: ClinicalSource[] = ledger.sources as ClinicalSource[];
export const CRITICAL_RENAL_TOPIC_CLAIMS: EvidenceClaim[] = ledger.evidenceClaims as EvidenceClaim[];
export const CRITICAL_RENAL_TOPIC_SOURCE_LINKS = packet.sourceLinkProposals;
export const CRITICAL_RENAL_TOPIC_CASE_DEFINITIONS = packet.caseDefinitions;
export const CRITICAL_RENAL_TOPIC_SETTING_CONVERSION = packet.settingConversion;
export const CRITICAL_RENAL_TOPIC_REVIEW_DISPOSITIONS = packet.reviewRound.dispositions;
export const CRITICAL_RENAL_TOPIC_PASS_FREEZE = packet.reviewRound.passFreeze;
export const CRITICAL_RENAL_TOPIC_PARKED_ITEMS = packet.reviewRound.parkedItems;
export const CRITICAL_RENAL_TOPIC_FROZEN_CONTEXTS = packet.reviewRound.frozenContexts;
export const CRITICAL_RENAL_TOPIC_REVIEWED_ITEMS = packet.reviewRound.reviewedItems;
export const CRITICAL_RENAL_TOPIC_REVIEWED_QUESTIONS: QuestionVariant[] =
  packet.reviewRound.reviewedQuestionDefinitions as QuestionVariant[];
export const CRITICAL_RENAL_TOPIC_REVIEWED_NODES: DecisionNode[] =
  packet.reviewRound.reviewedNodeDefinitions.map((node) => decisionNodeSchema.parse(node));
export const CRITICAL_RENAL_TOPIC_REVIEWED_TIMING: AnswerChoiceTimingRegistryEntry[] =
  packet.reviewRound.reviewedTimingProposals.map((entry) => answerChoiceTimingRegistryEntrySchema.parse(entry));
export const CRITICAL_RENAL_TOPIC_AUTHOR_CHECKS = packet.proposedNodes.map((item) => ({
  questionVariantId: item.questionVariantId,
  exactVisibleContextSha256: item.exactVisibleContextSha256,
  ...item.manualAuthorGate,
}));

/** Clinical meaning and educational tier remain separate from the clinic gate. */
export interface CriticalRenalConceptProposal
  extends TestedConcept, AuthoredClinicalRecord {
  educationalTier: number;
  previousConceptId: string | null;
  conceptRelation: "new_meaning" | "existing_meaning_variant";
  evidenceClaimIds: string[];
}

export const CRITICAL_RENAL_TOPIC_CONCEPT_PROPOSALS: CriticalRenalConceptProposal[] =
  packet.proposedNodes.map((item) => ({
    ...CRITICAL_RENAL_TOPIC_DRAFT,
    contentVersion: item.contentVersion,
    id: item.conceptId,
    displayName: item.objective,
    learningObjective: item.objective,
    conceptType: item.conceptType as TestedConcept["conceptType"],
    earliestFacilityStage: packet.settingConversion.facilityProgressionLevel,
    educationalTier: 2,
    previousConceptId: item.previousConceptId,
    conceptRelation: item.conceptRelation as CriticalRenalConceptProposal["conceptRelation"],
    evidenceClaimIds: item.supportingEvidenceClaimIds,
  }));

export const CRITICAL_RENAL_TOPIC_CONCEPTS: TestedConcept[] =
  CRITICAL_RENAL_TOPIC_CONCEPT_PROPOSALS.map((concept) => testedConceptSchema.parse({
    id: concept.id,
    displayName: concept.displayName,
    learningObjective: concept.learningObjective,
    conceptType: concept.conceptType,
    earliestFacilityStage: concept.earliestFacilityStage,
  }));

export const CRITICAL_RENAL_TOPIC_QUESTIONS: QuestionVariant[] = packet.proposedNodes.map(
  (item) => ({
    ...CRITICAL_RENAL_TOPIC_DRAFT,
    contentVersion: item.contentVersion,
    id: item.questionVariantId,
    conceptId: item.conceptId,
    stem: item.task,
    answerChoices: item.choices.map((choice) => ({
      id: choice.id,
      label: choice.label,
      isCorrect: choice.isCorrect,
      rationale: choice.rationale,
      distractorRationale: choice.isCorrect ? null : choice.rationale,
    })),
    explanation: item.explanation,
    exhibit: caseExhibitSchema.parse(item.exhibit),
    supportingEvidenceClaimIds: item.supportingEvidenceClaimIds,
  }),
);

/** Presentation-only framing leaves the clinical QuestionVariant values intact. */
export const CRITICAL_RENAL_TOPIC_NODES: DecisionNode[] = packet.proposedNodes.map(
  (item, index) => {
    const question = CRITICAL_RENAL_TOPIC_QUESTIONS[index]!;
    const clinicalCase = packet.caseDefinitions.find((row) => row.id === item.caseId)!;
    const isFinalNode = clinicalCase.nodeIds.at(-1) === item.nodeId;
    const sourceIds = new Set(
      CRITICAL_RENAL_TOPIC_CLAIMS
        .filter((claim) => item.supportingEvidenceClaimIds.includes(claim.id))
        .flatMap((claim) => claim.sourceIds),
    );
    const sourceLabels = CRITICAL_RENAL_TOPIC_SOURCES
      .filter((source) => sourceIds.has(source.id))
      .map((source) => source.title);

    return decisionNodeSchema.parse({
      id: item.nodeId,
      questionVariantId: question.id,
      primaryConceptId: question.conceptId,
      ...(item.chartReview.currentUpdate ? { currentUpdate: item.chartReview.currentUpdate } : {}),
      stem: item.chartReview.task,
      exhibit: question.exhibit,
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
      terminalDispositions: isFinalNode ? question.answerChoices
        .filter((choice) => !choice.isCorrect)
        .map((choice) => ({
          answerChoiceId: choice.id,
          kind: "no_terminal_outcome",
          consequenceNarrative: "Review the observed course and the proposed support decision before continuing.",
          clinicalRationale: choice.rationale,
          sourceLabels,
        })) : [],
    });
  },
);

export const CRITICAL_RENAL_TOPIC_CASES: SyntheticClinicalCase[] =
  packet.caseDefinitions.map((clinicalCase) =>
    syntheticClinicalCaseSchema.parse(clinicalCase.normalizedRuntimeCase));

/** Explicit-import preview using the existing clinic runtime contract. */
export const CRITICAL_RENAL_TOPIC_SOURCE_RELEASE = validateSyntheticClinicalRelease({
  id: "clinical.synthetic.prototype.v1",
  schemaVersion: 1,
  publicationStatus: "synthetic_unapproved_prototype",
  disclaimer: "Synthetic clinic chart-review preview of outside hospital records, not clinically approved. Exact versions need Melissa Rowland's clinical review and manager admission.",
  concepts: CRITICAL_RENAL_TOPIC_CONCEPTS,
  cases: CRITICAL_RENAL_TOPIC_CASES,
});

export const CRITICAL_RENAL_TOPIC_TIMING_PROPOSALS: AnswerChoiceTimingRegistryEntry[] =
  packet.timingProposals.map((entry) => answerChoiceTimingRegistryEntrySchema.parse(entry));

export const CRITICAL_RENAL_TOPIC_TEST_ORDER_PROPOSALS = packet.testOrderProposals;
export const CRITICAL_RENAL_TOPIC_WITHHELD_TEACHING_POINTS = packet.withheldTeachingPoints;
export const CRITICAL_RENAL_TOPIC_OWNER_APPROVALS = packet["Owner approvals needed"];

/** Batch1 salvage is a separate, complete-case review view. */
export const CRITICAL_RENAL_TOPIC_SALVAGE = packet.salvageRound;
export const CRITICAL_RENAL_TOPIC_SALVAGE_REVIEW_ITEMS = packet.salvageRound.proposedNodes;
export const CRITICAL_RENAL_TOPIC_SALVAGE_CASES: SyntheticClinicalCase[] =
  packet.salvageRound.caseDefinitions.map((clinicalCase) =>
    syntheticClinicalCaseSchema.parse(clinicalCase.normalizedRuntimeCase));
export const CRITICAL_RENAL_TOPIC_SALVAGE_NODES =
  CRITICAL_RENAL_TOPIC_SALVAGE_CASES.flatMap((clinicalCase) => clinicalCase.decisionNodes);
export const CRITICAL_RENAL_TOPIC_SALVAGE_QUESTIONS = CRITICAL_RENAL_TOPIC_QUESTIONS.filter(
  (question) => packet.salvageRound.reviewOnlyQuestionVariantIds.includes(question.id),
);
export const CRITICAL_RENAL_TOPIC_SALVAGE_CONCEPTS = CRITICAL_RENAL_TOPIC_CONCEPTS.filter(
  (concept) => CRITICAL_RENAL_TOPIC_SALVAGE_QUESTIONS.some((question) => question.conceptId === concept.id),
);
export const CRITICAL_RENAL_TOPIC_SALVAGE_TIMING_PROPOSALS: AnswerChoiceTimingRegistryEntry[] =
  packet.salvageRound.timingProposals.map((entry) => answerChoiceTimingRegistryEntrySchema.parse(entry));
export const CRITICAL_RENAL_TOPIC_SALVAGE_TEST_ORDER_PROPOSALS = packet.salvageRound.testOrderProposals;
export const CRITICAL_RENAL_TOPIC_SALVAGE_SOURCE_RELEASE = validateSyntheticClinicalRelease({
  id: "clinical.synthetic.prototype.v1",
  schemaVersion: 1,
  publicationStatus: "synthetic_unapproved_prototype",
  disclaimer: "Synthetic renal PASS salvage preview, not clinically approved. Only three standalone clinic chart reviews are submitted for context re-review. Accepted cases remain unchanged.",
  concepts: CRITICAL_RENAL_TOPIC_SALVAGE_CONCEPTS,
  cases: CRITICAL_RENAL_TOPIC_SALVAGE_CASES,
});

/** Clinic delivery is normalized. Shared release admission remains with the manager. */
export const CRITICAL_RENAL_TOPIC_INTEGRATION = {
  publicationStatus: "authoring_sidecar",
  reviewStatus: "needs_clinician_review",
  normalizedRuntimeRelease: CRITICAL_RENAL_TOPIC_SOURCE_RELEASE,
  requiredClinicalSetting: "clinic",
  settingDecision: packet.settingConversion.id,
  managerAcceptance: null,
  independentReview: {
    recordFile: packet.reviewRound.reviewFile,
    counts: packet.reviewRound.counts,
    revisedReReview: "pending",
  },
  dependencies: packet.integrationDependencies,
  salvage: {
    status: "salvage",
    reviewOnlyCaseIds: packet.salvageRound.reviewOnlyCaseIds,
    normalizedRuntimeRelease: CRITICAL_RENAL_TOPIC_SALVAGE_SOURCE_RELEASE,
    independentContextReview: "pending",
    managerAdmission: null,
  },
} as const;
