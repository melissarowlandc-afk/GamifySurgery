/** Explicit-import authoring sidecar. No default-release or shared-registry mutation. */
import { z } from "zod";
import packet from "../../../docs/research/question-topic-neuro-orthopedic-essentials-20261111.json";
import ledger from "../../../docs/research/sources-question-topic-neuro-orthopedic-essentials-20261111.json";
import type { ClinicalSource, EvidenceClaim, QuestionVariant } from "./pilot-schema";
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
} from "./schema";

export const QUESTION_TOPIC_NEURO_ORTHOPEDIC_ESSENTIALS_PACKET = packet;
export const QUESTION_TOPIC_NEURO_ORTHOPEDIC_ESSENTIALS_REVIEW = {
  contentVersion: "question-topic.neuro-orthopedic-essentials.2026-11-11.v2",
  reviewStatus: "needs_clinician_review",
  aiAssistedDrafting: true,
  lastClinicianReview: null,
} as const;

const review = QUESTION_TOPIC_NEURO_ORTHOPEDIC_ESSENTIALS_REVIEW;
const sourceClass = z.enum([
  "government_guidance", "professional_society_guideline", "narrative_review", "randomized_trial",
]);
const reuseStatus = z.enum([
  "public_domain_conditions_apply", "cc_by_4_0", "cc_by_nc_4_0_restricted",
  "copyrighted_targeted_verification_only",
]);
const category = z.enum([
  "anatomy", "presentation", "evaluation", "management", "safety_boundary",
]);
export const QUESTION_TOPIC_NEURO_ORTHOPEDIC_ESSENTIALS_SOURCES: ClinicalSource[] =
  ledger.sources.map(source => ({
    ...source,
    reviewStatus: review.reviewStatus,
    evidenceClaimIds: ledger.sourceToClaim.find(mapping => mapping.sourceId === source.id)!.claimIds,
    sourceClass: sourceClass.parse(source.sourceClass),
    reuseStatus: reuseStatus.parse(source.reuseStatus),
    usageRole: z.enum(["evidence", "cross_check", "both"]).parse(source.usageRole),
  }));
export const QUESTION_TOPIC_NEURO_ORTHOPEDIC_ESSENTIALS_CLAIMS: EvidenceClaim[] =
  ledger.claims.map(claim => ({
    ...claim, reviewStatus: review.reviewStatus,
    evidenceCategory: category.parse(claim.evidenceCategory),
    certainty: z.enum(["high", "moderate", "low", "conflicting"]).parse(claim.certainty),
  }));

const claimById = new Map(QUESTION_TOPIC_NEURO_ORTHOPEDIC_ESSENTIALS_CLAIMS.map(c => [c.id, c]));
const sourceById = new Map(QUESTION_TOPIC_NEURO_ORTHOPEDIC_ESSENTIALS_SOURCES.map(s => [s.id, s]));
function sourceLabels(claimIds: readonly string[]): string[] {
  return [...new Set(claimIds.flatMap(id => {
    const claim = claimById.get(id);
    if (!claim) throw new Error(`Unknown neuro/orthopedic claim: ${id}`);
    return claim.sourceIds.map(sourceId => {
      const source = sourceById.get(sourceId);
      if (!source) throw new Error(`Unknown neuro/orthopedic source: ${sourceId}`);
      return source.title;
    });
  }))];
}
function contextFor(nodeId: string) {
  const context = packet.cases.find(c => c.nodeIds.includes(nodeId));
  if (!context) throw new Error(`Missing clinic context: ${nodeId}`);
  return context;
}

export const QUESTION_TOPIC_NEURO_ORTHOPEDIC_ESSENTIALS_QUESTIONS: QuestionVariant[] =
  packet.nodes.map(node => ({
    ...review,
    contentVersion: node.contentVersion,
    id: node.questionVariantId,
    conceptId: node.conceptId,
    stem: node.task,
    exhibit: caseExhibitSchema.parse(node.exhibit),
    answerChoices: node.choices.map(choice => ({
      id: choice.id,
      label: choice.label,
      isCorrect: choice.id === node.keyChoiceId,
      rationale: choice.rationale,
      distractorRationale: choice.isCorrect ? null : choice.rationale,
    })),
    explanation: node.explanation,
    supportingEvidenceClaimIds: [...node.evidenceClaimIds],
  }));

export const QUESTION_TOPIC_NEURO_ORTHOPEDIC_ESSENTIALS_DECISION_NODES: DecisionNode[] =
  packet.nodes.map((node, index) => {
    // The manager froze these exact scored objects. Splitting a companion must
    // not add terminal feedback or otherwise rewrite a preserved PASS node.
    const preserved = packet.independentReview1.passPreservation.find(p => p.nodeId === node.id);
    if (preserved) {
      const frozen = packet.independentReview1.inputSnapshot.runtimeCases
        .flatMap(c => c.decisionNodes).find(n => n.id === node.id);
      if (!frozen) throw new Error(`Missing frozen PASS node: ${node.id}`);
      return decisionNodeSchema.parse(frozen);
    }
    const question = QUESTION_TOPIC_NEURO_ORTHOPEDIC_ESSENTIALS_QUESTIONS[index]!;
    const labels = sourceLabels(node.evidenceClaimIds);
    const context = contextFor(node.id);
    return decisionNodeSchema.parse({
      id: node.id,
      questionVariantId: question.id,
      primaryConceptId: question.conceptId,
      currentUpdate: node.currentUpdate,
      stem: question.stem,
      exhibit: question.exhibit,
      answerChoices: question.answerChoices.map(choice => ({
        id: choice.id, label: choice.label, isCorrect: choice.isCorrect,
        rationale: choice.rationale!, serviceRequest: null,
      })),
      shuffleAnswers: true,
      explanation: question.explanation,
      sourceLabels: labels,
      resultGateAfter: null,
      terminalDispositions: context.nodeIds.at(-1) === node.id
        ? question.answerChoices.filter(c => !c.isCorrect).map(choice => ({
          answerChoiceId: choice.id,
          kind: "no_terminal_outcome",
          consequenceNarrative: "The clinic records feedback on the reviewed outside care.",
          clinicalRationale: choice.rationale!,
          sourceLabels: labels,
        })) : [],
    });
  });

const nodeById = new Map(QUESTION_TOPIC_NEURO_ORTHOPEDIC_ESSENTIALS_DECISION_NODES.map(n => [n.id, n]));
export const QUESTION_TOPIC_NEURO_ORTHOPEDIC_ESSENTIALS_CASES: SyntheticClinicalCase[] =
  packet.cases.map(context => {
    const nodes = context.nodeIds.map(id => {
      const node = nodeById.get(id);
      if (!node) throw new Error(`Missing authored node: ${id}`);
      return node;
    });
    const preserved = packet.caseBindings.find(binding =>
      binding.caseId === context.id && binding.status === "pass-preserved");
    if (preserved) {
      const frozen = packet.independentReview1.inputSnapshot.runtimeCases
        .find(c => c.id === preserved.reviewedCaseId);
      if (!frozen) throw new Error(`Missing frozen PASS context: ${context.id}`);
      // A formerly intermediate PASS needs final-answer bindings in a singleton
      // case. Keep the exported scored object exact; attach only the required
      // case-composition metadata, reusing its reviewed rationale verbatim.
      const boundNodes = nodes.map(node => node.terminalDispositions.length ? node : {
        ...node,
        terminalDispositions: node.answerChoices.filter(choice => !choice.isCorrect).map(choice => ({
          answerChoiceId: choice.id,
          kind: "no_terminal_outcome" as const,
          consequenceNarrative: "The clinic records feedback on the reviewed outside care.",
          clinicalRationale: choice.rationale!,
          sourceLabels: node.sourceLabels,
        })),
      });
      return syntheticClinicalCaseSchema.parse({
        ...frozen, id: context.id, decisionNodes: boundNodes,
        learningSummary: nodes.map(n => n.explanation).join(" "),
      });
    }
    return syntheticClinicalCaseSchema.parse({
      id: context.id,
      displayName: context.displayName,
      patientPresentationVariantId: context.patientPresentationVariantId,
      patientDisplayName: context.patientDisplayName,
      prototypeDemographics: context.prototypeDemographics,
      chiefComplaint: context.chiefComplaint,
      presentation: context.presentation,
      approvedInstantiationProfiles: [{
        id: context.profileId,
        prototypeDemographics: context.prototypeDemographics,
        chiefComplaint: context.chiefComplaint,
        presentation: context.presentation,
      }],
      earliestFacilityStage: context.earliestFacilityStage,
      tutorialEligible: false,
      routineEligible: true,
      requiredClinicalSetting: "clinic",
      requiredCapabilityIds: [],
      rewardTierId: "reward.clinic_basic",
      sourceLabels: [...new Set(nodes.flatMap(n => n.sourceLabels))],
      decisionNodes: nodes,
      learningSummary: nodes.map(n => n.explanation).join(" "),
    });
  });

export const QUESTION_TOPIC_NEURO_ORTHOPEDIC_ESSENTIALS_AUTHORING_CONCEPTS = packet.concepts;
export const QUESTION_TOPIC_NEURO_ORTHOPEDIC_ESSENTIALS_TESTED_CONCEPTS = packet.concepts.map(c =>
  testedConceptSchema.parse({
    id: c.id, displayName: c.displayName, learningObjective: c.learningObjective,
    conceptType: c.conceptType, earliestFacilityStage: c.earliestFacilityStage,
  }));

export const QUESTION_TOPIC_NEURO_ORTHOPEDIC_ESSENTIALS_TIMING_ENTRIES: AnswerChoiceTimingRegistryEntry[] =
  packet.nodes.map(node => answerChoiceTimingRegistryEntrySchema.parse({
    caseId: contextFor(node.id).id, nodeId: node.id, questionVariantId: node.questionVariantId,
    classification: node.choices.some(c => c.timingProfileId) ? {
      kind: "test_choices",
      choices: node.choices.map(choice => ({
        choiceId: choice.id, choiceLabel: choice.label,
        timing: choice.timingProfileId
          ? { kind: "test", timingProfileId: choice.timingProfileId }
          : { kind: "no_test" },
      })),
    } : { kind: "no_test" },
  }));

export const QUESTION_TOPIC_NEURO_ORTHOPEDIC_ESSENTIALS_RELEASE = validateSyntheticClinicalRelease({
  id: "clinical.question-topic-neuro-orthopedic-essentials.2026-11-11.v2",
  schemaVersion: 1,
  publicationStatus: "synthetic_unapproved_prototype",
  disclaimer: "Synthetic educational authoring draft; not clinically approved.",
  concepts: QUESTION_TOPIC_NEURO_ORTHOPEDIC_ESSENTIALS_TESTED_CONCEPTS,
  cases: QUESTION_TOPIC_NEURO_ORTHOPEDIC_ESSENTIALS_CASES,
});
export const QUESTION_TOPIC_NEURO_ORTHOPEDIC_ESSENTIALS_SOURCE_LINKS =
  ledger.sources.map(source => ({
    sourceId: source.id, label: source.title, href: source.officialUrl,
    target: "_blank", rel: "noopener noreferrer", referrerPolicy: "no-referrer",
  } as const));
export const QUESTION_TOPIC_NEURO_ORTHOPEDIC_ESSENTIALS_CASE_REVIEWS = packet.cases.map(c => ({
  ...review, caseId: c.id, educationalTier: c.educationalTier, acuity: c.acuity,
  historicalAcuity: c.historicalAcuity, earliestFacilityStage: c.earliestFacilityStage,
  requiredCapabilityIds: c.requiredCapabilityIds, executionScope: c.executionScope,
  sequenceReview: c.sequenceReview,
}));
export const QUESTION_TOPIC_NEURO_ORTHOPEDIC_ESSENTIALS_AUDIT = packet.audit;
export const QUESTION_TOPIC_NEURO_ORTHOPEDIC_ESSENTIALS_ORDER_PROPOSALS = packet.orderProposals;
export const QUESTION_TOPIC_NEURO_ORTHOPEDIC_ESSENTIALS_AUTHOR_CHECKS = packet.nodes.map(n => ({
  questionVariantId: n.questionVariantId, ...n.authorGate,
}));
export const QUESTION_TOPIC_NEURO_ORTHOPEDIC_ESSENTIALS_MANIFEST = {
  ...review,
  pipelinePassed: false,
  clinicalApproval: false,
  installedInDefaultRelease: false,
  publicReleaseAuthorized: false,
  counts: packet.counts,
  ownerApprovalsNeeded: packet.ownerApprovalsNeeded,
  integrationDependencies: packet.integrationDependencies,
} as const;
