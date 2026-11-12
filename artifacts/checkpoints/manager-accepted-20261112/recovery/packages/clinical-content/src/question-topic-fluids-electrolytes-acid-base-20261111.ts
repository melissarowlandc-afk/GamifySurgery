import packet from "../../../docs/research/question-topic-fluids-electrolytes-acid-base-20261111.json";
import ledger from "../../../docs/research/sources-question-topic-fluids-electrolytes-acid-base-20261111.json";
import type { AuthoredClinicalRecord, ClinicalSource, EvidenceClaim, QuestionVariant } from "./pilot-schema";
import {
  answerChoiceTimingRegistryEntrySchema,
  caseExhibitSchema,
  decisionNodeSchema,
  syntheticClinicalCaseSchema,
  testedConceptSchema,
  validateSyntheticClinicalRelease,
  type DecisionNode,
  type SyntheticClinicalCase,
  type TestedConcept,
} from "./schema";

/** Explicit-import authoring sidecar. The manager owns release admission. */
export const FLUIDS_TOPIC_PACKET = packet;
export const FLUIDS_TOPIC_SOURCE_LEDGER = ledger;
export const FLUIDS_TOPIC_DRAFT = {
  contentVersion: packet.contentVersion,
  reviewStatus: "needs_clinician_review",
  aiAssistedDrafting: true,
  lastClinicianReview: null,
} as const;
export const FLUIDS_TOPIC_SOURCES = ledger.sources as ClinicalSource[];
export const FLUIDS_TOPIC_CLAIMS = ledger.evidenceClaims as EvidenceClaim[];
export const FLUIDS_TOPIC_AUDIT = packet.completeAudit;
export const FLUIDS_TOPIC_REVIEW_DISPOSITIONS = packet.reviewRound.dispositions;
export const FLUIDS_TOPIC_PASS_FREEZE = packet.reviewRound.passFreeze;
export const FLUIDS_TOPIC_PARKED_ITEMS = packet.reviewRound.parkedItems;
/** Historical returned definitions are inspectable, never admitted by this export. */
export const FLUIDS_TOPIC_RETAINED_QUESTIONS =
  packet.reviewRound.originalQuestionDefinitions as QuestionVariant[];
export const FLUIDS_TOPIC_RETAINED_NODES = packet.reviewRound.originalNodeDefinitions
  .map((node) => decisionNodeSchema.parse(node));
export const FLUIDS_TOPIC_SOURCE_LINKS = packet.sourceLinkProposals;
export const FLUIDS_TOPIC_ORDER_PROPOSALS = packet.testOrderProposals;
export const FLUIDS_TOPIC_OWNER_APPROVALS = packet["Owner approvals needed"];
export const FLUIDS_TOPIC_TIMING_PROPOSALS = packet.timingProposals.map((entry) =>
  answerChoiceTimingRegistryEntrySchema.parse(entry));

export interface FluidsTopicConceptProposal extends TestedConcept, AuthoredClinicalRecord {
  educationalTier: number;
  previousConceptId: string | null;
  conceptRelation: string;
  evidenceClaimIds: string[];
}

export const FLUIDS_TOPIC_CONCEPT_PROPOSALS: FluidsTopicConceptProposal[] =
  packet.proposedNodes.map((item) => ({
    ...FLUIDS_TOPIC_DRAFT,
    contentVersion: item.contentVersion,
    id: item.conceptId,
    displayName: item.objective,
    learningObjective: item.objective,
    earliestFacilityStage: 0,
    educationalTier: 2,
    conceptType: item.conceptType as TestedConcept["conceptType"],
    previousConceptId: item.previousConceptId,
    conceptRelation: item.conceptRelation,
    evidenceClaimIds: item.supportingEvidenceClaimIds,
  }));

export const FLUIDS_TOPIC_CONCEPTS: TestedConcept[] = FLUIDS_TOPIC_CONCEPT_PROPOSALS.map((item) =>
  testedConceptSchema.parse({
    id: item.id,
    displayName: item.displayName,
    learningObjective: item.learningObjective,
    earliestFacilityStage: item.earliestFacilityStage,
    conceptType: item.conceptType,
  }));

export const FLUIDS_TOPIC_QUESTIONS: QuestionVariant[] = packet.proposedNodes.map((item) => {
  const frozen = FLUIDS_TOPIC_PASS_FREEZE.find((entry) => entry.questionVariantId === item.questionVariantId);
  if (frozen) return frozen.questionDefinition as QuestionVariant;
  return ({
  ...FLUIDS_TOPIC_DRAFT,
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
  });
});

function sourceLabels(claimIds: readonly string[]): string[] {
  const sourceIds = new Set(FLUIDS_TOPIC_CLAIMS
    .filter((claim) => claimIds.includes(claim.id)).flatMap((claim) => claim.sourceIds));
  return FLUIDS_TOPIC_SOURCES.filter((source) => sourceIds.has(source.id)).map((source) => source.title);
}

/** Updates reveal historical observations; they never schedule a clinical test. */
export const FLUIDS_TOPIC_NODES: DecisionNode[] = packet.proposedNodes.map((item, index) => {
  const frozen = FLUIDS_TOPIC_PASS_FREEZE.find((entry) => entry.nodeId === item.nodeId);
  if (frozen) return decisionNodeSchema.parse(frozen.nodeDefinition);
  const question = FLUIDS_TOPIC_QUESTIONS[index]!;
  const clinicalCase = packet.caseDefinitions.find((entry) => entry.id === item.caseId)!;
  const labels = sourceLabels(item.supportingEvidenceClaimIds);
  const final = clinicalCase.nodeIds.at(-1) === item.nodeId;
  return decisionNodeSchema.parse({
    id: item.nodeId,
    questionVariantId: question.id,
    primaryConceptId: question.conceptId,
    currentUpdate: item.currentUpdate,
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
    sourceLabels: labels,
    resultGateAfter: null,
    terminalDispositions: final ? question.answerChoices.filter((choice) => !choice.isCorrect).map((choice) => ({
      answerChoiceId: choice.id,
      kind: "no_terminal_outcome",
      consequenceNarrative: "Review the recorded observations and the decision before continuing.",
      clinicalRationale: choice.rationale,
      sourceLabels: labels,
    })) : [],
  });
});

export const FLUIDS_TOPIC_CASES: SyntheticClinicalCase[] = packet.caseDefinitions.map((item) => {
  const split = packet.reviewRound.standalonePassCases.find((entry) => entry.caseId === item.id);
  if (split) return syntheticClinicalCaseSchema.parse(split.caseDefinition);
  const frozen = FLUIDS_TOPIC_PASS_FREEZE.find((entry) => entry.caseDefinition.id === item.id);
  if (frozen) return syntheticClinicalCaseSchema.parse(frozen.caseDefinition);
  return syntheticClinicalCaseSchema.parse({
    ...item.runtimeFields,
    decisionNodes: item.nodeIds.map((id) => FLUIDS_TOPIC_NODES.find((node) => node.id === id)!),
  });
});

export const FLUIDS_TOPIC_SOURCE_RELEASE = validateSyntheticClinicalRelease({
  id: "clinical.synthetic.prototype.v1",
  schemaVersion: 1,
  publicationStatus: "synthetic_unapproved_prototype",
  disclaimer: "Synthetic clinic and outside-record review preview, not clinically approved. Exact versions require independent review, manager acceptance and Melissa Rowland's clinical sign-off.",
  concepts: FLUIDS_TOPIC_CONCEPTS,
  cases: FLUIDS_TOPIC_CASES,
});

export const FLUIDS_TOPIC_INTEGRATION = {
  publicationStatus: "authoring_sidecar",
  reviewStatus: "needs_clinician_review",
  requiredClinicalSetting: "clinic",
  independentReview: {
    recordFile: packet.reviewRound.reviewFile,
    reviewSha256: packet.reviewRound.reviewFileSha256,
    passPreserved: 3,
    revisedPendingReReview: 8,
    parkedExcluded: 8,
    revisedReReview: "pending",
  },
  multiPartAdmissionRule: packet.reviewRound.caseAdmissionRule,
  managerAcceptance: null,
  normalizedRuntimeRelease: FLUIDS_TOPIC_SOURCE_RELEASE,
  dependencies: packet.integrationDependencies,
} as const;
