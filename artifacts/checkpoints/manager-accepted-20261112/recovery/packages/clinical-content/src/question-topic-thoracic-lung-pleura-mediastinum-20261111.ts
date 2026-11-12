import packet from "../../../docs/research/question-topic-thoracic-lung-pleura-mediastinum-20261111.json";
import ledger from "../../../docs/research/sources-question-topic-thoracic-lung-pleura-mediastinum-20261111.json";
import type { AuthoredClinicalRecord, ClinicalSource, EvidenceClaim, QuestionVariant } from "./pilot-schema";
import {
  answerChoiceTimingRegistryEntrySchema,
  caseExhibitSchema,
  syntheticClinicalCaseSchema,
  testedConceptSchema,
  type SyntheticClinicalCase,
  type TestedConcept,
} from "./schema";

/** Explicit-import draft sidecar. No release, selector or shared registry imports it. */
export const THORACIC_TOPIC_DRAFT = {
  contentVersion: "clinical.question-topic-thoracic-lung-pleura-mediastinum.2026-11-11.v2",
  reviewStatus: "needs_clinician_review",
  aiAssistedDrafting: true,
  lastClinicianReview: null,
} as const;

export const THORACIC_TOPIC_PACKET = packet;
export const THORACIC_TOPIC_ITEMS = packet.proposedNodes;
// Historical exact versions remain available for frozen encounters and review.
// These arrays are never concatenated into the active authoring supply.
export const THORACIC_TOPIC_RETAINED_QUESTIONS = packet.reviewRound.archive.questionDefinitions as QuestionVariant[];
export const THORACIC_TOPIC_RETAINED_CASES = packet.reviewRound.archive.caseDefinitions.map(definition =>
  syntheticClinicalCaseSchema.parse(definition));
export const THORACIC_TOPIC_RETAINED_CONCEPTS = packet.reviewRound.archive.conceptDefinitions;
export const THORACIC_TOPIC_PARKED_ATTEMPTS = packet.reviewRound.parkedAttempts;
// Inherited evidence retains its original content version and verification dates.
export const THORACIC_TOPIC_SOURCES = ledger.sources as ClinicalSource[];
export const THORACIC_TOPIC_CLAIMS = ledger.claims as EvidenceClaim[];

function sourceLabels(claimIds: readonly string[]): string[] {
  const sourceIds = new Set(THORACIC_TOPIC_CLAIMS
    .filter(claim => claimIds.includes(claim.id)).flatMap(claim => claim.sourceIds));
  return THORACIC_TOPIC_SOURCES.filter(source => sourceIds.has(source.id)).map(source => source.title);
}

function patientText(text: string, caseId: string): string {
  const patient = packet.proposedCases.find(proposal => proposal.id === caseId);
  if (!patient) throw new Error(`Missing thoracic patient context: ${caseId}`);
  // The packet uses the named review patient; runtime uses the frozen name token.
  return text.split(patient.name).join("{patientName}")
    .split(patient.name.split(" ")[0]!).join("{patientName}");
}

function clinicalExhibit(item: (typeof THORACIC_TOPIC_ITEMS)[number]) {
  return caseExhibitSchema.parse({
    ...item.exhibit,
    items: item.exhibit.items.map(row => ({
      label: patientText(row.label, item.caseId),
      value: patientText(row.value, item.caseId),
    })),
  });
}

export const THORACIC_TOPIC_QUESTIONS: QuestionVariant[] = THORACIC_TOPIC_ITEMS.map(item => {
  const frozen = packet.reviewRound.passFreeze.find(record => record.questionVariantId === item.questionVariantId);
  if (frozen) return frozen.questionDefinition as QuestionVariant;
  return {
    ...THORACIC_TOPIC_DRAFT,
    contentVersion: item.contentVersion,
    id: item.questionVariantId,
    conceptId: item.conceptId,
    stem: patientText(item.stem, item.caseId),
    exhibit: clinicalExhibit(item),
    answerChoices: item.choices.map(choice => ({
      id: choice.id,
      label: patientText(choice.label, item.caseId),
      isCorrect: choice.isCorrect,
      rationale: patientText(choice.rationale, item.caseId),
      distractorRationale: choice.isCorrect ? null : patientText(choice.rationale, item.caseId),
    })),
    explanation: patientText(item.explanation, item.caseId),
    supportingEvidenceClaimIds: item.supportingEvidenceClaimIds,
  };
});

export interface ThoracicConceptProposal extends TestedConcept, AuthoredClinicalRecord {
  educationalTier: 1;
  previousConceptId: string | null;
  conceptRelation: string;
  evidenceClaimIds: string[];
}

export const THORACIC_TOPIC_CONCEPT_PROPOSALS: ThoracicConceptProposal[] = THORACIC_TOPIC_ITEMS.map(item => {
  if (item.status === "pass-preserved") {
    return packet.reviewRound.archive.conceptDefinitions.find(record => record.id === item.conceptId)! as ThoracicConceptProposal;
  }
  return {
    ...THORACIC_TOPIC_DRAFT,
    contentVersion: item.contentVersion,
    ...testedConceptSchema.parse({
      id: item.conceptId,
      displayName: item.objective,
      learningObjective: item.objective,
      earliestFacilityStage: 0,
      conceptType: item.conceptType,
    }),
    educationalTier: 1,
    previousConceptId: item.previousConceptId,
    conceptRelation: item.conceptRelation,
    evidenceClaimIds: item.supportingEvidenceClaimIds,
  };
});

export const THORACIC_TOPIC_CASES: SyntheticClinicalCase[] = packet.proposedCases.map(proposal => {
  const preserved = packet.reviewRound.passCaseProposals.find(record => record.caseId === proposal.id);
  if (preserved) return syntheticClinicalCaseSchema.parse(preserved.caseDefinition);
  const items = THORACIC_TOPIC_ITEMS.filter(item => proposal.nodeIds.includes(item.id));
  const labels = sourceLabels(items.flatMap(item => item.supportingEvidenceClaimIds));
  const demographics = { ageYears: proposal.age, sexLabel: proposal.sex };
  return syntheticClinicalCaseSchema.parse({
    id: proposal.id,
    displayName: `${proposal.name}: outside-record review`,
    patientPresentationVariantId: `presentation.topic.thoracic-lung-pleura-mediastinum.${proposal.key}.v2`,
    releasePointId: "release.l0.clinic_evaluation",
    patientDisplayName: proposal.name,
    prototypeDemographics: demographics,
    chiefComplaint: proposal.chiefComplaint,
    presentation: proposal.presentation,
    approvedInstantiationProfiles: [{
      id: `profile.topic.thoracic-lung-pleura-mediastinum.${proposal.key}.v2`,
      prototypeDemographics: demographics,
      chiefComplaint: proposal.chiefComplaint,
      presentation: proposal.presentation,
    }],
    tutorialEligible: false,
    routineEligible: true,
    earliestFacilityStage: proposal.earliestFacilityStage,
    requiredClinicalSetting: proposal.requiredClinicalSetting,
    requiredCapabilityIds: proposal.requiredCapabilityIds,
    rewardTierId: "reward.clinic_basic",
    sourceLabels: labels,
    decisionNodes: items.map((item, index) => {
      const nodeLabels = sourceLabels(item.supportingEvidenceClaimIds);
      return {
        id: item.id,
        questionVariantId: item.questionVariantId,
        primaryConceptId: item.conceptId,
        ...(item.currentPatientUpdate ? { currentUpdate: item.currentPatientUpdate } : {}),
        stem: patientText(item.stem, item.caseId),
        exhibit: clinicalExhibit(item),
        answerChoices: item.choices.map(choice => ({
          id: choice.id,
          label: patientText(choice.label, item.caseId),
          isCorrect: choice.isCorrect,
          rationale: patientText(choice.rationale, item.caseId),
          serviceRequest: null,
        })),
        shuffleAnswers: true,
        explanation: patientText(item.explanation, item.caseId),
        sourceLabels: nodeLabels,
        resultGateAfter: null,
        terminalDispositions: index === items.length - 1 ? item.choices.filter(choice => !choice.isCorrect).map(choice => ({
          answerChoiceId: choice.id,
          kind: "no_terminal_outcome",
          consequenceNarrative: "Review the clinical rationale for this decision in the outside record.",
          clinicalRationale: patientText(choice.rationale, item.caseId),
          sourceLabels: nodeLabels,
        })) : [],
      };
    }),
    learningSummary: "Interpret each dated outside record and compare the clinical reasoning for the decisions reviewed in clinic.",
  });
});

export const THORACIC_TOPIC_NODES = THORACIC_TOPIC_CASES.flatMap(clinicalCase => clinicalCase.decisionNodes);
export const THORACIC_TOPIC_TIMING_PROPOSALS = packet.timingProposals.map(entry =>
  answerChoiceTimingRegistryEntrySchema.parse(entry));
export const THORACIC_TOPIC_TEST_ORDER_PROPOSALS = packet.testOrderProposals;
export const THORACIC_TOPIC_SOURCE_LINKS = packet.sourceLinks;
export const THORACIC_TOPIC_STATEMENT_MAPPINGS = ledger.statementMappings;
export const THORACIC_TOPIC_SELF_CHECKS = THORACIC_TOPIC_ITEMS.map(item => ({
  questionVariantId: item.questionVariantId,
  ...item.manualAuthorGate,
}));
export const THORACIC_TOPIC_CASE_REVIEWS = packet.proposedCases.map(proposal => ({
  ...THORACIC_TOPIC_DRAFT,
  contentVersion: proposal.contentVersion,
  caseId: proposal.id,
  educationalTier: proposal.educationalTier,
  patientAcuity: proposal.patientAcuity,
  historicalRecordAcuity: proposal.historicalRecordAcuity,
  earliestFacilityStage: proposal.earliestFacilityStage,
  requiredClinicalSetting: proposal.requiredClinicalSetting,
  requiredFacilityCapabilityIds: proposal.requiredCapabilityIds,
}));
export const THORACIC_TOPIC_REVIEW_METADATA = {
  ...THORACIC_TOPIC_DRAFT,
  independentPass: false,
  managerAccepted: false,
  publicReleaseAuthorized: false,
  independentPassQuestionIds: packet.reviewRound.passFreeze.map(record => record.questionVariantId),
  reviewDispositions: packet.reviewRound.dispositions,
  caseCompositionStatus: "pending_manager_review",
  reviewDisplay: "key shown first for review only",
  counts: packet.counts,
  ownerApprovalsNeeded: packet.ownerApprovalsNeeded,
  consolidationProposals: packet.caseCompositionProposals,
} as const;
