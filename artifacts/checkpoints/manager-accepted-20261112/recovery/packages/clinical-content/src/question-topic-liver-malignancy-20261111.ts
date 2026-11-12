import packet from "../../../docs/research/question-topic-liver-malignancy-20261111.json";
import ledger from "../../../docs/research/sources-question-topic-liver-malignancy-20261111.json";
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
import { ROW_092_CONCEPT } from "./approved-data/hcc-resection-selection";

/** Explicit-import authoring sidecar. No default-release admission is performed. */
export const LIVER_MALIGNANCY_TOPIC_PACKET = packet;
export const LIVER_MALIGNANCY_TOPIC_SOURCE_LEDGER = ledger;
export const LIVER_MALIGNANCY_TOPIC_DRAFT = {
  contentVersion: packet.contentVersion,
  reviewStatus: "needs_clinician_review",
  aiAssistedDrafting: true,
  lastClinicianReview: null,
} as const;
export const LIVER_MALIGNANCY_TOPIC_MANIFEST = packet.manifest;
export const LIVER_MALIGNANCY_TOPIC_AUDIT = packet.audit;
export const LIVER_MALIGNANCY_TOPIC_CASE_DEFINITIONS = packet.caseCompositionProposals;
export const LIVER_MALIGNANCY_TOPIC_AUTHOR_CHECKS = packet.proposedNodes;
export const LIVER_MALIGNANCY_TOPIC_SOURCES = ledger.sources as ClinicalSource[];
export const LIVER_MALIGNANCY_TOPIC_CLAIMS = ledger.evidenceClaims as EvidenceClaim[];
export const LIVER_MALIGNANCY_TOPIC_SOURCE_LINKS = packet.sourceLinkProposals;
export const LIVER_MALIGNANCY_TOPIC_ORDER_PROPOSALS = packet.testOrderProposals;
export const LIVER_MALIGNANCY_TOPIC_WITHHELD = packet.withheldTeachingPoints;
export const LIVER_MALIGNANCY_TOPIC_OWNER_APPROVALS = packet["Owner approvals needed"];
export const LIVER_MALIGNANCY_TOPIC_REVIEW_RESPONSE = packet.reviewRound;
/** Empty for this dispatch: all four liver-topic PASS nodes were already accepted. */
export const LIVER_MALIGNANCY_TOPIC_SALVAGE = packet.salvageRound;
/** Audit-only attempted candidates; these are never admitted to the active exports below. */
export const LIVER_MALIGNANCY_TOPIC_PARKED = packet.reviewRound.parkedItems;

const preservedPassById = new Map(packet.reviewRound.passFreeze.map((item) => [item.reviewedQuestionVariantId, item]));

export const LIVER_MALIGNANCY_TOPIC_QUESTIONS: QuestionVariant[] = packet.proposedNodes.map((item) => {
  const preserved = preservedPassById.get(item.questionVariantId);
  if (preserved) return preserved.question as QuestionVariant;
  return {
  ...LIVER_MALIGNANCY_TOPIC_DRAFT,
  contentVersion: item.contentVersion,
  id: item.questionVariantId,
  conceptId: item.conceptId,
  stem: item.task,
  exhibit: caseExhibitSchema.parse(item.exhibit),
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

function sourceLabelsFor(claimIds: readonly string[]): string[] {
  const sourceIds = new Set(LIVER_MALIGNANCY_TOPIC_CLAIMS
    .filter((claim) => claimIds.includes(claim.id))
    .flatMap((claim) => claim.sourceIds));
  return LIVER_MALIGNANCY_TOPIC_SOURCES.filter((source) => sourceIds.has(source.id)).map((source) => source.title);
}

const questionById = new Map(LIVER_MALIGNANCY_TOPIC_QUESTIONS.map((question) => [question.id, question]));

export const LIVER_MALIGNANCY_TOPIC_NODES: DecisionNode[] = packet.proposedNodes.map((item) => {
  const preserved = preservedPassById.get(item.questionVariantId);
  if (preserved) return preserved.node as DecisionNode;
  const question = questionById.get(item.questionVariantId)!;
  const sourceLabels = sourceLabelsFor(item.supportingEvidenceClaimIds);
  const isFinal = packet.caseCompositionProposals.find((clinicalCase) => clinicalCase.id === item.caseId)!.nodeIds.at(-1) === item.nodeId;
  return decisionNodeSchema.parse({
    id: item.nodeId,
    questionVariantId: question.id,
    primaryConceptId: question.conceptId,
    ...(item.currentUpdate ? { currentUpdate: item.currentUpdate } : {}),
    stem: question.stem,
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
    terminalDispositions: isFinal ? question.answerChoices.filter((choice) => !choice.isCorrect).map((choice) => ({
      answerChoiceId: choice.id,
      kind: "no_terminal_outcome",
      consequenceNarrative: "Review the outside record and the selected plan before continuing.",
      clinicalRationale: choice.rationale!,
      sourceLabels,
    })) : [],
  });
});

const nodeById = new Map(LIVER_MALIGNANCY_TOPIC_NODES.map((node) => [node.id, node]));

export const LIVER_MALIGNANCY_TOPIC_TESTED_CONCEPTS: TestedConcept[] = packet.conceptDecisions.map((decision) => {
  // A harder wording variant does not change this registered meaning or its FSRS identity.
  if (decision.conceptId === ROW_092_CONCEPT.id) return ROW_092_CONCEPT;
  const previous = packet.reviewRound.snapshot.testedConcepts.find((concept) => concept.id === decision.conceptId);
  if (previous) return previous as TestedConcept;
  const item = packet.proposedNodes.find((node) => node.conceptId === decision.conceptId)!;
  return testedConceptSchema.parse({
    id: item.conceptId,
    displayName: item.objective,
    learningObjective: item.objective,
    earliestFacilityStage: 0,
    conceptType: item.conceptType,
  });
});

export interface LiverMalignancyConceptProposal extends TestedConcept, AuthoredClinicalRecord {
  previousConceptId: string | null;
  conceptRelation: "new_meaning" | "existing_meaning_variant";
  educationalTier: number;
  evidenceClaimIds: string[];
}

export const LIVER_MALIGNANCY_TOPIC_CONCEPT_PROPOSALS: LiverMalignancyConceptProposal[] =
  LIVER_MALIGNANCY_TOPIC_TESTED_CONCEPTS.map((concept) => {
    const decision = packet.conceptDecisions.find((entry) => entry.conceptId === concept.id)!;
    const passedConcept = packet.reviewRound.passFreeze.some((item) => item.conceptId === concept.id);
    if (passedConcept) return packet.reviewRound.snapshot.conceptProposals.find((item) => item.id === concept.id)! as LiverMalignancyConceptProposal;
    return {
      ...concept,
      ...LIVER_MALIGNANCY_TOPIC_DRAFT,
      previousConceptId: decision.previousConceptId,
      conceptRelation: decision.conceptRelation as LiverMalignancyConceptProposal["conceptRelation"],
      educationalTier: 2,
      evidenceClaimIds: [...new Set(packet.proposedNodes.filter((node) => node.conceptId === concept.id)
        .flatMap((node) => node.supportingEvidenceClaimIds))],
    };
  });

/** Finite profiles use the existing schema field; that field does not grant clinical approval. */
export const LIVER_MALIGNANCY_TOPIC_CASES: SyntheticClinicalCase[] = packet.caseCompositionProposals.map((item) => {
  const nodes = item.nodeIds.map((nodeId) => nodeById.get(nodeId)!);
  const preserved = packet.reviewRound.passFreeze.find((entry) => entry.caseId === item.id);
  if (preserved) return syntheticClinicalCaseSchema.parse({
    ...preserved.caseHeader,
    decisionNodes: nodes,
    // Aggregate current node feedback without rewriting any individual PASS explanation.
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

export const LIVER_MALIGNANCY_TOPIC_TIMING_ENTRIES: AnswerChoiceTimingRegistryEntry[] =
  packet.timingProposals.map((entry) => answerChoiceTimingRegistryEntrySchema.parse(entry));

export const LIVER_MALIGNANCY_TOPIC_INTEGRATION = {
  publicationStatus: "authoring_sidecar",
  reviewStatus: "needs_clinician_review",
  managerAcceptance: null,
  independentReview: packet.manifest.independentReview,
  dependencies: packet.integrationDependencies,
} as const;
