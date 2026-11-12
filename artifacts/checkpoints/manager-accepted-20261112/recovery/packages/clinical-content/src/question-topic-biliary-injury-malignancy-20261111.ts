import packet from "../../../docs/research/question-topic-biliary-injury-malignancy-20261111.json";
import ledger from "../../../docs/research/sources-question-topic-biliary-injury-malignancy-20261111.json";
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

/** Explicit-import authoring sidecar. Importing this module admits no content. */
export const BILIARY_INJURY_MALIGNANCY_TOPIC_PACKET = packet;
export const BILIARY_INJURY_MALIGNANCY_TOPIC_SOURCE_LEDGER = ledger;
export const BILIARY_INJURY_MALIGNANCY_TOPIC_DRAFT = {
  contentVersion: packet.contentVersion,
  reviewStatus: "needs_clinician_review",
  aiAssistedDrafting: true,
  lastClinicianReview: null,
} as const;
export const BILIARY_INJURY_MALIGNANCY_TOPIC_AUDIT = packet.audit;
export const BILIARY_INJURY_MALIGNANCY_TOPIC_AUTHOR_CHECKS = packet.proposedNodes;
export const BILIARY_INJURY_MALIGNANCY_TOPIC_SOURCES = ledger.sources as ClinicalSource[];
export const BILIARY_INJURY_MALIGNANCY_TOPIC_CLAIMS = ledger.evidenceClaims as EvidenceClaim[];
export const BILIARY_INJURY_MALIGNANCY_TOPIC_SOURCE_LINKS = packet.sourceLinkProposals;
export const BILIARY_INJURY_MALIGNANCY_TOPIC_ORDER_PROPOSALS = packet.testOrderProposals;
export const BILIARY_INJURY_MALIGNANCY_TOPIC_WITHHELD = packet.withheldTeachingPoints;
export const BILIARY_INJURY_MALIGNANCY_TOPIC_OWNER_APPROVALS = packet["Owner approvals needed"];
export const BILIARY_INJURY_MALIGNANCY_TOPIC_REVIEW_RESPONSE = packet.reviewRound;
export const BILIARY_INJURY_MALIGNANCY_TOPIC_PARKED = packet.reviewRound.parkedItems;
export const BILIARY_INJURY_MALIGNANCY_TOPIC_MANIFEST = packet.manifest;

const preservedPassById = new Map(packet.reviewRound.passFreeze.map((entry) => [entry.reviewedQuestionVariantId, entry]));

export const BILIARY_INJURY_MALIGNANCY_TOPIC_QUESTIONS: QuestionVariant[] = packet.proposedNodes.map((item) => {
  const preserved = preservedPassById.get(item.questionVariantId);
  if (preserved) return preserved.question as QuestionVariant;
  return {
  ...BILIARY_INJURY_MALIGNANCY_TOPIC_DRAFT,
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

function labelsFor(claimIds: readonly string[]): string[] {
  const sourceIds = new Set(BILIARY_INJURY_MALIGNANCY_TOPIC_CLAIMS
    .filter((claim) => claimIds.includes(claim.id)).flatMap((claim) => claim.sourceIds));
  return BILIARY_INJURY_MALIGNANCY_TOPIC_SOURCES.filter((source) => sourceIds.has(source.id)).map((source) => source.title);
}

export const BILIARY_INJURY_MALIGNANCY_TOPIC_NODES: DecisionNode[] = packet.proposedNodes.map((item) => {
  const preserved = preservedPassById.get(item.questionVariantId);
  // Exact PASS includes choices, feedback, update/exhibit and disposition metadata.
  // Splitting a former first node must not append new terminal dispositions.
  if (preserved) return preserved.node as DecisionNode;
  const question = BILIARY_INJURY_MALIGNANCY_TOPIC_QUESTIONS.find((entry) => entry.id === item.questionVariantId)!;
  const sourceLabels = labelsFor(item.supportingEvidenceClaimIds);
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
      id: choice.id, label: choice.label, isCorrect: choice.isCorrect,
      rationale: choice.rationale, serviceRequest: null,
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

export const BILIARY_INJURY_MALIGNANCY_TOPIC_TESTED_CONCEPTS: TestedConcept[] = packet.conceptDecisions.map((item) =>
  testedConceptSchema.parse(item.existingTestedConcept ?? {
    id: item.conceptId,
    displayName: item.objective,
    learningObjective: item.objective,
    earliestFacilityStage: item.earliestFacilityStage,
    conceptType: packet.proposedNodes.find((node) => node.conceptId === item.conceptId)!.conceptType,
  }));

export interface BiliaryInjuryMalignancyConceptProposal extends TestedConcept, AuthoredClinicalRecord {
  previousConceptId: string | null;
  conceptRelation: "existing_meaning_variant" | "new_meaning";
  educationalTier: number;
  evidenceClaimIds: string[];
}

export const BILIARY_INJURY_MALIGNANCY_TOPIC_CONCEPT_PROPOSALS: BiliaryInjuryMalignancyConceptProposal[] =
  BILIARY_INJURY_MALIGNANCY_TOPIC_TESTED_CONCEPTS.map((concept) => {
    if (packet.reviewRound.passFreeze.some((entry) => entry.question.conceptId === concept.id)) {
      return packet.reviewRound.snapshot.conceptProposals.find((entry) => entry.id === concept.id)! as BiliaryInjuryMalignancyConceptProposal;
    }
    const item = packet.conceptDecisions.find((entry) => entry.conceptId === concept.id)!;
    return {
      ...concept, ...BILIARY_INJURY_MALIGNANCY_TOPIC_DRAFT,
      previousConceptId: item.previousConceptId,
      conceptRelation: item.conceptRelation as BiliaryInjuryMalignancyConceptProposal["conceptRelation"],
      educationalTier: 2,
      evidenceClaimIds: item.evidenceClaimIds,
    };
  });

export const BILIARY_INJURY_MALIGNANCY_TOPIC_CASES: SyntheticClinicalCase[] = packet.caseCompositionProposals.map((item) => {
  const nodes = item.nodeIds.map((id) => BILIARY_INJURY_MALIGNANCY_TOPIC_NODES.find((node) => node.id === id)!);
  const preserved = packet.reviewRound.passFreeze.find((entry) => entry.originalCase.id === item.id);
  if (preserved) {
    // A former first node has no final dispositions. The raw PASS node above
    // stays byte-exact; this standalone composition supplies required closing
    // metadata using its already reviewed feedback verbatim, adding no wording.
    const finalNodes = nodes.map((node) => node.terminalDispositions.length ? node : {
      ...node,
      terminalDispositions: node.answerChoices.filter((choice) => !choice.isCorrect).map((choice) => ({
        answerChoiceId: choice.id,
        kind: "no_terminal_outcome" as const,
        consequenceNarrative: choice.rationale!,
        clinicalRationale: choice.rationale!,
        sourceLabels: node.sourceLabels,
      })),
    });
    return syntheticClinicalCaseSchema.parse({
      ...preserved.caseHeader,
      decisionNodes: finalNodes,
      learningSummary: nodes.map((node) => node.explanation).join(" "),
    });
  }
  return syntheticClinicalCaseSchema.parse({
    id: item.id,
    displayName: item.displayName,
    patientDisplayName: item.patientDisplayName,
    patientPresentationVariantId: item.patientPresentationVariantId,
    releasePointId: "release.l0.clinic_evaluation",
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

export const BILIARY_INJURY_MALIGNANCY_TOPIC_TIMING_ENTRIES: AnswerChoiceTimingRegistryEntry[] =
  packet.timingProposals.map((entry) => answerChoiceTimingRegistryEntrySchema.parse(entry));

/** Only exact editorial PASS cases; clinical review and manager acceptance remain separate. */
export const BILIARY_INJURY_MALIGNANCY_TOPIC_PASS_READY_CASES = BILIARY_INJURY_MALIGNANCY_TOPIC_CASES.filter((clinicalCase) =>
  packet.reviewRound.composition.passCaseIds.includes(clinicalCase.id));
/** Revised candidates are available for independent review, never automatically accepted. */
export const BILIARY_INJURY_MALIGNANCY_TOPIC_REVISED_CASES = BILIARY_INJURY_MALIGNANCY_TOPIC_CASES.filter((clinicalCase) =>
  packet.reviewRound.composition.revisedCaseIds.includes(clinicalCase.id));

export const BILIARY_INJURY_MALIGNANCY_TOPIC_INTEGRATION = {
  publicationStatus: "authoring_sidecar",
  reviewStatus: "needs_clinician_review",
  independentReview: packet.manifest.independentReview,
  managerAcceptance: null,
  dependencies: packet.integrationDependencies,
} as const;
