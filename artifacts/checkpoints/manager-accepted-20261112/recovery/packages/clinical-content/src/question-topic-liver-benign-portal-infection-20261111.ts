import packet from "../../../docs/research/question-topic-liver-benign-portal-infection-20261111.json";
import ledger from "../../../docs/research/sources-question-topic-liver-benign-portal-infection-20261111.json";
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

/** Explicit-import authoring sidecar. The manager owns admission and shared registries. */
export const LIVER_BENIGN_TOPIC_PACKET = packet;
export const LIVER_BENIGN_TOPIC_LEDGER = ledger;
export const LIVER_BENIGN_TOPIC_DRAFT = {
  contentVersion: packet.contentVersion,
  reviewStatus: "needs_clinician_review",
  aiAssistedDrafting: true,
  lastClinicianReview: null,
} as const satisfies AuthoredClinicalRecord;

export const LIVER_BENIGN_TOPIC_AUDIT = packet.audit;
export const LIVER_BENIGN_TOPIC_AUTHOR_CHECKS = packet.proposedNodes;
export const LIVER_BENIGN_TOPIC_SOURCES = ledger.sources as ClinicalSource[];
export const LIVER_BENIGN_TOPIC_CLAIMS = ledger.evidenceClaims as EvidenceClaim[];
export const LIVER_BENIGN_TOPIC_SOURCE_LINKS = packet.sourceLinkProposals;
export const LIVER_BENIGN_TOPIC_ORDER_PROPOSALS = packet.testOrderProposals;
export const LIVER_BENIGN_TOPIC_CONCEPT_PROPOSALS = packet.conceptDecisions;
export const LIVER_BENIGN_TOPIC_OWNER_APPROVALS = packet["Owner approvals needed"];
export const LIVER_BENIGN_TOPIC_REVIEW_RESPONSE = packet.reviewRound;
export const LIVER_BENIGN_TOPIC_PARKED_ITEMS = packet.reviewRound.parkedItems;

// Exact reviewed values are the authority for PASS versions. Review metadata lives
// beside them, so changing the response packet cannot silently rewrite those items.
const passByQuestion = new Map(packet.reviewRound.passFreeze.map((entry) =>
  [entry.reviewedQuestionVariantId, entry]));

export const LIVER_BENIGN_TOPIC_QUESTIONS: QuestionVariant[] = packet.proposedNodes.map((item) => {
  const frozen = passByQuestion.get(item.questionVariantId);
  if (frozen) return structuredClone(frozen.question) as unknown as QuestionVariant;
  return {
  ...LIVER_BENIGN_TOPIC_DRAFT,
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

function sourceLabelsFor(claimIds: readonly string[]): string[] {
  const sourceIds = new Set(LIVER_BENIGN_TOPIC_CLAIMS
    .filter((claim) => claimIds.includes(claim.id)).flatMap((claim) => claim.sourceIds));
  return LIVER_BENIGN_TOPIC_SOURCES.filter((source) => sourceIds.has(source.id)).map((source) => source.title);
}

const questionById = new Map(LIVER_BENIGN_TOPIC_QUESTIONS.map((question) => [question.id, question]));

export const LIVER_BENIGN_TOPIC_NODES: DecisionNode[] = packet.proposedNodes.map((item) => {
  const frozen = passByQuestion.get(item.questionVariantId);
  if (frozen) {
    const node = structuredClone(frozen.node) as unknown as DecisionNode;
    // The pyogenic PASS was formerly nonfinal. Ending its standalone case requires
    // a graph wrapper, using only the already reviewed wrong-choice feedback.
    if (node.terminalDispositions.length === 0) {
      node.terminalDispositions = node.answerChoices.filter((choice) => !choice.isCorrect).map((choice) => ({
        answerChoiceId: choice.id,
        kind: "no_terminal_outcome",
        consequenceNarrative: "The clinic chart review ends with feedback on the selected plan.",
        clinicalRationale: choice.rationale!,
        sourceLabels: node.sourceLabels,
      }));
    }
    return node;
  }
  const question = questionById.get(item.questionVariantId)!;
  const sourceLabels = sourceLabelsFor(item.supportingEvidenceClaimIds);
  const clinicalCase = packet.caseCompositionProposals.find((entry) => entry.id === item.caseId)!;
  const isFinal = clinicalCase.nodeIds.at(-1) === item.nodeId;
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
    sourceLabels,
    resultGateAfter: null,
    terminalDispositions: isFinal ? question.answerChoices.filter((choice) => !choice.isCorrect).map((choice) => ({
      answerChoiceId: choice.id,
      kind: "no_terminal_outcome",
      consequenceNarrative: "The clinic chart review ends with feedback on the selected plan.",
      clinicalRationale: choice.rationale!,
      sourceLabels,
    })) : [],
  });
});

export const LIVER_BENIGN_TOPIC_CONCEPTS: TestedConcept[] = packet.conceptDecisions.map((entry) =>
  testedConceptSchema.parse({
    id: entry.conceptId,
    displayName: entry.displayName,
    learningObjective: entry.learningObjective,
    conceptType: entry.conceptType,
    earliestFacilityStage: entry.earliestFacilityStage,
  }));

const nodeById = new Map(LIVER_BENIGN_TOPIC_NODES.map((node) => [node.id, node]));

export const LIVER_BENIGN_TOPIC_CASES: SyntheticClinicalCase[] = packet.caseCompositionProposals.map((item) => {
  const nodes = item.nodeIds.map((id) => nodeById.get(id)!);
  const frozen = packet.reviewRound.passFreeze.find((entry) => entry.caseId === item.id);
  if (frozen) return {
    ...structuredClone(frozen.caseHeader),
    decisionNodes: nodes,
    learningSummary: nodes.map((node) => node.explanation).join(" "),
  } as unknown as SyntheticClinicalCase;
  return syntheticClinicalCaseSchema.parse({
    id: item.id,
    displayName: item.displayName,
    patientDisplayName: item.patientDisplayName,
    patientPresentationVariantId: item.patientPresentationVariantId,
    prototypeDemographics: item.prototypeDemographics,
    chiefComplaint: item.chiefComplaint,
    presentation: item.presentation,
    // This legacy schema field binds one finite profile; it does not grant clinical approval.
    approvedInstantiationProfiles: [{
      id: item.patientPresentationVariantId.replace(/^presentation\./, "profile."),
      prototypeDemographics: item.prototypeDemographics,
      chiefComplaint: item.chiefComplaint,
      presentation: item.presentation,
    }],
    releasePointId: "release.l0.clinic_evaluation",
    tutorialEligible: false,
    routineEligible: true,
    earliestFacilityStage: item.earliestFacilityStage,
    requiredClinicalSetting: "clinic",
    requiredCapabilityIds: [],
    rewardTierId: "reward.clinic_basic",
    sourceLabels: [...new Set(nodes.flatMap((node) => node.sourceLabels))],
    decisionNodes: nodes,
    learningSummary: nodes.map((node) => node.explanation).join(" "),
  });
});

/** Presentation estimates only; no orders, routes, result receipts or shared entries added. */
export const LIVER_BENIGN_TOPIC_TIMING_ENTRIES: AnswerChoiceTimingRegistryEntry[] =
  packet.timingProposals.map((entry) => answerChoiceTimingRegistryEntrySchema.parse(entry));

export const LIVER_BENIGN_TOPIC_INTEGRATION = {
  ...LIVER_BENIGN_TOPIC_DRAFT,
  publicationStatus: "authoring_sidecar",
  independentReview: "partial_pass_revisions_pending",
  managerAcceptance: null,
  defaultReleaseChanged: false,
  dependencies: packet.integrationDependencies,
} as const;
