/** Explicit-import authoring sidecar. The manager owns release integration. */
import { z } from "zod";
import packet from "../../../docs/research/question-topic-trauma-head-spine-extremities-20261111.json";
import ledger from "../../../docs/research/sources-question-topic-trauma-head-spine-extremities-20261111.json";
import type { ClinicalSource, EvidenceClaim, QuestionVariant } from "./pilot-schema";
import {
  answerChoiceTimingRegistryEntrySchema,
  caseExhibitSchema,
  decisionNodeSchema,
  syntheticClinicalCaseSchema,
  testedConceptSchema,
  type AnswerChoiceTimingRegistryEntry,
  type DecisionNode,
  type SyntheticClinicalCase,
} from "./schema";

export const QUESTION_TOPIC_TRAUMA_HEAD_SPINE_EXTREMITIES_PACKET = packet;
export const QUESTION_TOPIC_TRAUMA_HEAD_SPINE_EXTREMITIES_DRAFT = {
  contentVersion: "clinical.question-topic-trauma-head-spine-extremities.2026-11-11.v2",
  reviewStatus: "needs_clinician_review",
  aiAssistedDrafting: true,
  lastClinicianReview: null,
} as const;

const authoredFields = {
  contentVersion: z.enum([
    "clinical.question-topic-trauma-head-spine-extremities.2026-11-11.v1",
    "clinical.question-topic-trauma-head-spine-extremities.2026-11-11.v2",
  ]),
  reviewStatus: z.literal("needs_clinician_review"),
  aiAssistedDrafting: z.literal(true),
  lastClinicianReview: z.null(),
};
const sourceSchema = z.object({
  ...authoredFields,
  id: z.string().startsWith("source.trauma-head-spine-extremities."),
  title: z.string().min(1),
  completeCitation: z.string().min(1),
  organizationOrJournal: z.string().min(1),
  authors: z.array(z.string()).min(1),
  publicationYear: z.number().int().nullable(),
  doi: z.string().nullable(),
  pmid: z.string().nullable(),
  officialUrl: z.url(),
  accessedOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  sourceClass: z.enum([
    "government_guidance", "professional_society_guideline", "peer_reviewed_guideline",
    "narrative_review", "open_educational_resource", "randomized_trial",
  ]),
  licenseLabel: z.string().min(1),
  reuseStatus: z.enum([
    "public_domain_conditions_apply", "cc_by_4_0", "copyrighted_targeted_verification_only",
  ]),
  reuseNotes: z.string().min(1),
  authorityAssessment: z.string().min(1),
  usageRole: z.enum(["evidence", "cross_check", "both"]),
  evidenceClaimIds: z.array(z.string()).min(1),
}).passthrough();
const claimSchema = z.object({
  ...authoredFields,
  id: z.string().startsWith("claim.trauma-head-spine-extremities."),
  statement: z.string().min(1),
  sourceIds: z.array(z.string()).min(1),
  evidenceCategory: z.enum([
    "evaluation", "management", "disposition", "safety_boundary", "anatomy",
  ]),
  certainty: z.enum(["high", "moderate", "low", "conflicting"]),
  limitation: z.string().nullable(),
  applicablePopulation: z.string().min(1),
  lastCheckedOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
}).passthrough();

export const QUESTION_TOPIC_TRAUMA_HEAD_SPINE_EXTREMITIES_SOURCES: ClinicalSource[] =
  ledger.sources.map(source => sourceSchema.parse(source));
export const QUESTION_TOPIC_TRAUMA_HEAD_SPINE_EXTREMITIES_CLAIMS: EvidenceClaim[] =
  ledger.claims.map(claim => claimSchema.parse(claim));

const sourceById = new Map(QUESTION_TOPIC_TRAUMA_HEAD_SPINE_EXTREMITIES_SOURCES.map(s => [s.id, s]));
const claimById = new Map(QUESTION_TOPIC_TRAUMA_HEAD_SPINE_EXTREMITIES_CLAIMS.map(c => [c.id, c]));

export const QUESTION_TOPIC_TRAUMA_HEAD_SPINE_EXTREMITIES_REVIEW_RESPONSES =
  packet.independentReview1.responses;
const parkedVariantIds = new Set(packet.independentReview1.responses
  .filter(response => response.status === "parked").map(response => response.currentQuestionVariantId));
export const QUESTION_TOPIC_TRAUMA_HEAD_SPINE_EXTREMITIES_PARKED_ITEMS =
  packet.nodes.filter(node => parkedVariantIds.has(node.questionVariantId));
const activeNodes = packet.nodes.filter(node => !parkedVariantIds.has(node.questionVariantId));
const activeNodeIds = new Set(activeNodes.map(node => node.id));
const activeCases = packet.cases.filter(clinicalCase => clinicalCase.nodeIds.some(id => activeNodeIds.has(id)));

/** Historical reviewed versions remain data, never silently rewritten or re-keyed. */
export const QUESTION_TOPIC_TRAUMA_HEAD_SPINE_EXTREMITIES_REVIEWED_QUESTIONS =
  packet.independentReview1.inputSnapshot.runtimeQuestions;
export const QUESTION_TOPIC_TRAUMA_HEAD_SPINE_EXTREMITIES_REVIEWED_CASES =
  packet.independentReview1.inputSnapshot.runtimeCases;

function recordMetadata(record: { contentVersion: string }) {
  return { ...QUESTION_TOPIC_TRAUMA_HEAD_SPINE_EXTREMITIES_DRAFT, contentVersion: record.contentVersion };
}

function sourceLabels(claimIds: readonly string[]): string[] {
  return [...new Set(claimIds.flatMap(id => {
    const claim = claimById.get(id);
    if (!claim) throw new Error(`Unknown head/spine/extremity claim ${id}`);
    return claim.sourceIds.map(sourceId => {
      const source = sourceById.get(sourceId);
      if (!source) throw new Error(`Unknown head/spine/extremity source ${sourceId}`);
      return source.title;
    });
  }))];
}

function caseForNode(nodeId: string) {
  const clinicalCase = packet.cases.find(c => c.nodeIds.includes(nodeId));
  if (!clinicalCase) throw new Error(`Topic node has no clinic review case ${nodeId}`);
  return clinicalCase;
}

/** Keep the exact age/sex profile while allowing the existing patient-name substitution. */
function runtimeText(text: string, patientName: string): string {
  const firstName = patientName.split(" ")[0]!;
  return text.split(patientName).join("{patientName}")
    .replace(new RegExp(`\\b${firstName}\\b`, "g"), "{patientName}");
}

export const QUESTION_TOPIC_TRAUMA_HEAD_SPINE_EXTREMITIES_QUESTIONS: QuestionVariant[] =
  activeNodes.map(node => {
    const clinicalCase = caseForNode(node.id);
    const exhibit = caseExhibitSchema.parse(node.exhibit);
    if (exhibit.kind !== "keyValue") throw new Error("Topic exhibits must be constructed record observations");
    return {
      ...recordMetadata(node),
      id: node.questionVariantId,
      conceptId: node.conceptId,
      stem: runtimeText(node.task, clinicalCase.patientDisplayName),
      exhibit: {
        ...exhibit,
        items: exhibit.items.map(item => ({
          ...item, value: runtimeText(item.value, clinicalCase.patientDisplayName),
        })),
      },
      answerChoices: node.choices.map(choice => ({
        id: choice.id,
        label: choice.label,
        isCorrect: choice.id === node.keyChoiceId,
        rationale: choice.rationale,
        distractorRationale: choice.id === node.keyChoiceId ? null : choice.rationale,
      })),
      explanation: runtimeText(node.explanation, clinicalCase.patientDisplayName),
      supportingEvidenceClaimIds: [...node.evidenceClaimIds],
    };
  });

export const QUESTION_TOPIC_TRAUMA_HEAD_SPINE_EXTREMITIES_DECISION_NODES: DecisionNode[] =
  activeNodes.map((node, index) => {
    const question = QUESTION_TOPIC_TRAUMA_HEAD_SPINE_EXTREMITIES_QUESTIONS[index]!;
    const clinicalCase = caseForNode(node.id);
    const labels = sourceLabels(node.evidenceClaimIds);
    return decisionNodeSchema.parse({
      id: node.id,
      questionVariantId: question.id,
      primaryConceptId: question.conceptId,
      currentUpdate: runtimeText(node.currentUpdate, clinicalCase.patientDisplayName),
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
      terminalDispositions: clinicalCase.nodeIds.filter(id => activeNodeIds.has(id)).at(-1) === node.id
        ? question.answerChoices.filter(choice => !choice.isCorrect).map(choice => ({
          answerChoiceId: choice.id,
          kind: "no_terminal_outcome",
          consequenceNarrative: "The clinic chart review ends with feedback on the outside hospital record.",
          clinicalRationale: choice.rationale!,
          sourceLabels: labels,
        })) : [],
    });
  });

const nodeById = new Map(QUESTION_TOPIC_TRAUMA_HEAD_SPINE_EXTREMITIES_DECISION_NODES.map(n => [n.id, n]));
export const QUESTION_TOPIC_TRAUMA_HEAD_SPINE_EXTREMITIES_CASES: SyntheticClinicalCase[] =
  activeCases.map(clinicalCase => {
    const presentation = runtimeText(clinicalCase.presentation, clinicalCase.patientDisplayName);
    const decisionNodes = clinicalCase.nodeIds.filter(id => activeNodeIds.has(id)).map(id => {
      const node = nodeById.get(id);
      if (!node) throw new Error(`Unknown clinic review node ${id}`);
      return node;
    });
    // A revised sibling must not alter the header, profile, sources or summary
    // supplied to an exact PASS. Retain every reviewed case-header field.
    if (packet.independentReview1.passPreservation.some(pin => pin.caseId === clinicalCase.id)) {
      const reviewedCase = packet.independentReview1.inputSnapshot.runtimeCases
        .find(candidate => candidate.id === clinicalCase.id);
      if (!reviewedCase) throw new Error(`Missing exact PASS case context ${clinicalCase.id}`);
      const { decisionNodes: reviewedNodes, ...header } = reviewedCase;
      void reviewedNodes;
      return syntheticClinicalCaseSchema.parse({ ...header, decisionNodes });
    }
    return syntheticClinicalCaseSchema.parse({
      id: clinicalCase.id,
      displayName: clinicalCase.displayName,
      patientPresentationVariantId: clinicalCase.patientPresentationVariantId,
      patientDisplayName: clinicalCase.patientDisplayName,
      prototypeDemographics: clinicalCase.prototypeDemographics,
      chiefComplaint: clinicalCase.chiefComplaint,
      presentation,
      approvedInstantiationProfiles: [{
        id: clinicalCase.profileId,
        prototypeDemographics: clinicalCase.prototypeDemographics,
        chiefComplaint: clinicalCase.chiefComplaint,
        presentation,
      }],
      tutorialEligible: false,
      routineEligible: clinicalCase.routineEligible,
      earliestFacilityStage: clinicalCase.earliestFacilityStage,
      requiredClinicalSetting: "clinic",
      requiredCapabilityIds: [],
      rewardTierId: clinicalCase.rewardTierId,
      sourceLabels: [...new Set(decisionNodes.flatMap(n => n.sourceLabels))],
      decisionNodes,
      learningSummary: decisionNodes.map(n => n.explanation).join(" "),
    });
  });

export const QUESTION_TOPIC_TRAUMA_HEAD_SPINE_EXTREMITIES_AUTHORING_CONCEPTS = packet.concepts;
const activeConceptIds = new Set(activeNodes.map(node => node.conceptId));
export const QUESTION_TOPIC_TRAUMA_HEAD_SPINE_EXTREMITIES_TESTED_CONCEPTS = packet.concepts
  .filter(concept => activeConceptIds.has(concept.id)).map(concept =>
  testedConceptSchema.parse({
    id: concept.id, displayName: concept.displayName, learningObjective: concept.learningObjective,
    conceptType: concept.conceptType, earliestFacilityStage: concept.earliestFacilityStage,
  }));

export const QUESTION_TOPIC_TRAUMA_HEAD_SPINE_EXTREMITIES_TIMING_ENTRIES: AnswerChoiceTimingRegistryEntry[] =
  activeNodes.map(node => answerChoiceTimingRegistryEntrySchema.parse({
    caseId: caseForNode(node.id).id,
    nodeId: node.id,
    questionVariantId: node.questionVariantId,
    classification: node.choices.some(choice => choice.timingProfileId) ? {
      kind: "test_choices",
      choices: node.choices.map(choice => ({
        choiceId: choice.id,
        choiceLabel: choice.label,
        timing: choice.timingProfileId
          ? { kind: "test", timingProfileId: choice.timingProfileId }
          : { kind: "no_test" },
      })),
    } : { kind: "no_test" },
  }));

export const QUESTION_TOPIC_TRAUMA_HEAD_SPINE_EXTREMITIES_CASE_REVIEWS = activeCases.map(c => ({
  ...recordMetadata(c),
  caseId: c.id, educationalTier: c.educationalTier, acuity: c.acuity,
  historicalAcuity: c.historicalAcuity, earliestFacilityStage: c.earliestFacilityStage,
  requiredCapabilityIds: c.requiredCapabilityIds, executionScope: c.executionScope,
  sequenceReview: c.sequenceReview, managerIntegrationHoldIds: c.managerIntegrationHoldIds,
}));
export const QUESTION_TOPIC_TRAUMA_HEAD_SPINE_EXTREMITIES_SOURCE_LINKS =
  QUESTION_TOPIC_TRAUMA_HEAD_SPINE_EXTREMITIES_SOURCES.map(source => ({
    ...recordMetadata(source),
    id: `link.trauma-head-spine-extremities.${source.id.split(".").at(-1)}`,
    sourceId: source.id, label: source.title, href: source.officialUrl!,
    target: "_blank", rel: "noopener noreferrer", referrerPolicy: "no-referrer",
  }));
export const QUESTION_TOPIC_TRAUMA_HEAD_SPINE_EXTREMITIES_AUDIT = packet.audit;
export const QUESTION_TOPIC_TRAUMA_HEAD_SPINE_EXTREMITIES_AUTHOR_CHECKS =
  activeNodes.map(node => ({ questionVariantId: node.questionVariantId, ...node.authorGate }));
export const QUESTION_TOPIC_TRAUMA_HEAD_SPINE_EXTREMITIES_STATEMENT_MAPPINGS = ledger.statementMappings;
export const QUESTION_TOPIC_TRAUMA_HEAD_SPINE_EXTREMITIES_ORDER_PROPOSALS = packet.orderProposals;
export const QUESTION_TOPIC_TRAUMA_HEAD_SPINE_EXTREMITIES_MANIFEST = {
  ...QUESTION_TOPIC_TRAUMA_HEAD_SPINE_EXTREMITIES_DRAFT,
  id: "batch.question-topic-trauma-head-spine-extremities.2026-11-11.v2",
  pipelinePassed: false,
  installedInDefaultRelease: false,
  publicReleaseAuthorized: false,
  clinicalApproval: false,
  counts: packet.counts,
  ownerApprovalsNeeded: packet.ownerApprovalsNeeded,
  integrationDependencies: packet.integrationDependencies,
} as const;
