import type { ClinicalSource, EvidenceClaim, QuestionVariant } from "./pilot-schema";
import {
  validateSyntheticClinicalRelease,
  type AnswerChoiceTimingRegistryEntry,
  type SyntheticClinicalCase,
  type TestedConcept,
} from "./schema";
import packet from "../../../docs/research/question-topic-esophagus-structural-inflammatory-emergencies-20261111.json";
import ledger from "../../../docs/research/sources-question-topic-esophagus-structural-inflammatory-emergencies-20261111.json";

export const ESOPHAGUS_TOPIC_SLUG = "esophagus-structural-inflammatory-emergencies";
export const ESOPHAGUS_TOPIC_DRAFT = {
  contentVersion: `question-topic-${ESOPHAGUS_TOPIC_SLUG}.2026-11-11.v2`,
  reviewStatus: "needs_clinician_review" as const,
  aiAssistedDrafting: true,
  lastClinicianReview: null,
};

interface TopicChoice {
  id: string;
  label: string;
  rationale: string;
  temptation: string;
  correctUnder: string;
  claimIds: string[];
  timingProfileId?: string;
}
interface TopicNode {
  slug: string;
  conceptId: string;
  previousConceptId: string | null;
  conceptType: TestedConcept["conceptType"];
  objective: string;
  currentUpdate: string;
  task: string;
  choices: TopicChoice[];
  correctChoice: string;
  explanation: string;
  claimIds: string[];
  questionVariantId: string;
  nodeId: string;
  caseId: string;
  creationKind: "new" | "Rewrite";
  identityDecision: "reuse" | "new_meaning";
  identityReason: string;
  replacesInventoryIds: string[];
  authorGate: Record<string, string | boolean>;
}
interface TopicCase {
  slug: string;
  caseId: string;
  version: number;
  reviewDisposition: "pass-preserved" | "revised" | "parked";
  reviewedOriginCaseId?: string;
  name: string;
  age: number;
  sex: "Female" | "Male";
  complaint: string;
  presentation: string;
  mode: "clinic_assessment" | "longitudinal_chart_review_in_clinic";
  educationalTier: number;
  encounterAcuity: string;
  historicalDecisionAcuity: string;
  facilityProgressionLevel: number;
  requiredCapabilityIds: string[];
  nodes: TopicNode[];
}

/** Explicit authoring import only. No default registry, service, source-view,
 * selector, save or manifest is changed. Hospital decisions are chart reviews
 * in clinic; estimates describe proposals and never execute an order. */
export const ESOPHAGUS_TOPIC_PACKET = packet;
export const ESOPHAGUS_TOPIC_SOURCE_LEDGER = ledger;
export const ESOPHAGUS_TOPIC_REVIEWED_V1 = packet.reviewRound2.reviewedV1Bundle as unknown as {
  questions: QuestionVariant[];
  cases: SyntheticClinicalCase[];
  concepts: TestedConcept[];
  timingEntries: AnswerChoiceTimingRegistryEntry[];
};
export const ESOPHAGUS_TOPIC_REVIEW_DISPOSITIONS = packet.reviewRound2.items;
export const ESOPHAGUS_TOPIC_CATALOG_ITEMS = packet.candidateCases as unknown as TopicCase[];
export const ESOPHAGUS_TOPIC_PARKED_ITEMS = ESOPHAGUS_TOPIC_CATALOG_ITEMS.filter((item) => item.reviewDisposition === "parked");
export const ESOPHAGUS_TOPIC_ITEMS = ESOPHAGUS_TOPIC_CATALOG_ITEMS.filter((item) => item.reviewDisposition !== "parked");
export const ESOPHAGUS_TOPIC_CATALOG_NODES = ESOPHAGUS_TOPIC_CATALOG_ITEMS.flatMap((item) => item.nodes);
export const ESOPHAGUS_TOPIC_NODES = ESOPHAGUS_TOPIC_ITEMS.flatMap((item) => item.nodes);
export const ESOPHAGUS_TOPIC_SOURCES = ledger.sources as ClinicalSource[];
export const ESOPHAGUS_TOPIC_CLAIMS = ledger.claims as EvidenceClaim[];
const choiceId = (node: TopicNode, suffix: string) =>
  `choice.topic.${ESOPHAGUS_TOPIC_SLUG}.${node.slug}.${node.questionVariantId.endsWith(".v2") ? "v2." : ""}${suffix}`;
const caseId = (item: TopicCase) => item.caseId;
const currentCaseIds = new Map(ESOPHAGUS_TOPIC_ITEMS.flatMap((item) =>
  item.nodes.map((node) => [node.questionVariantId, item.caseId] as const),
));
const currentCaseId = (node: TopicNode) => currentCaseIds.get(node.questionVariantId)!;
const draftFor = (node: TopicNode) => ({
  ...ESOPHAGUS_TOPIC_DRAFT,
  contentVersion: `question-topic-${ESOPHAGUS_TOPIC_SLUG}.2026-11-11.${node.questionVariantId.split(".").at(-1)}`,
});

export const ESOPHAGUS_TOPIC_CATALOG_QUESTIONS: QuestionVariant[] = ESOPHAGUS_TOPIC_CATALOG_NODES.map((node) => {
  const reviewed = ESOPHAGUS_TOPIC_REVIEWED_V1.questions.find((question) => question.id === node.questionVariantId);
  if (reviewed) return reviewed;
  return {
    ...draftFor(node),
    id: node.questionVariantId,
    conceptId: node.conceptId,
    stem: node.task,
    answerChoices: node.choices.map((choice) => ({
      id: choiceId(node, choice.id),
      label: choice.label,
      isCorrect: choice.id === node.correctChoice,
      rationale: choice.rationale,
      distractorRationale: choice.id === node.correctChoice ? null : choice.rationale,
    })),
    explanation: node.explanation,
    supportingEvidenceClaimIds: [...new Set([
      ...node.claimIds,
      ...node.choices.flatMap((choice) => choice.claimIds),
    ])],
  };
});
export const ESOPHAGUS_TOPIC_QUESTIONS = ESOPHAGUS_TOPIC_CATALOG_QUESTIONS.filter((question) => currentCaseIds.has(question.id));

export const ESOPHAGUS_TOPIC_CONCEPTS: TestedConcept[] = ESOPHAGUS_TOPIC_NODES.map((node) => ({
  id: node.conceptId,
  displayName: node.slug.replaceAll("-", " "),
  learningObjective: node.objective,
  earliestFacilityStage: 2,
  conceptType: node.conceptType,
}));
export const ESOPHAGUS_TOPIC_AUTHORING_CONCEPTS = ESOPHAGUS_TOPIC_CONCEPTS.map((concept, index) => ({
  ...concept,
  ...draftFor(ESOPHAGUS_TOPIC_NODES[index]!),
  previousConceptId: ESOPHAGUS_TOPIC_NODES[index]!.previousConceptId,
  identityDecision: ESOPHAGUS_TOPIC_NODES[index]!.identityDecision,
  identityReason: ESOPHAGUS_TOPIC_NODES[index]!.identityReason,
  evidenceClaimIds: ESOPHAGUS_TOPIC_QUESTIONS[index]!.supportingEvidenceClaimIds,
  historyMigration: "None; retain all prior definitions, frozen encounters and cards on their original meanings.",
}));

export const ESOPHAGUS_TOPIC_CASES: SyntheticClinicalCase[] = ESOPHAGUS_TOPIC_ITEMS.map((item) => {
  if (item.reviewDisposition === "pass-preserved") {
    const reviewedCase = ESOPHAGUS_TOPIC_REVIEWED_V1.cases.find((clinicalCase) => clinicalCase.id === item.reviewedOriginCaseId)!;
    if (reviewedCase.id === item.caseId) return reviewedCase;
    const node = reviewedCase.decisionNodes.find((node) => node.questionVariantId === item.nodes[0]!.questionVariantId)!;
    return {
      ...reviewedCase,
      id: item.caseId,
      decisionNodes: [{
        ...node,
        terminalDispositions: node.terminalDispositions.length > 0 ? node.terminalDispositions
          : node.answerChoices.filter((choice) => !choice.isCorrect).map((choice) => ({
            answerChoiceId: choice.id,
            kind: "no_terminal_outcome" as const,
            consequenceNarrative: "Review the decision and its rationale. No hospital procedure or patient outcome is simulated in this clinic chart review.",
            clinicalRationale: choice.rationale!,
            sourceLabels: node.sourceLabels,
          })),
      }],
      learningSummary: node.explanation,
    };
  }
  const demographics = { ageYears: item.age, sexLabel: item.sex };
  const sourceIds = new Set(ESOPHAGUS_TOPIC_CLAIMS
    .filter((claim) => item.nodes.some((node) => node.claimIds.includes(claim.id)
      || node.choices.some((choice) => choice.claimIds.includes(claim.id))))
    .flatMap((claim) => claim.sourceIds));
  const sourceLabels = ESOPHAGUS_TOPIC_SOURCES.filter((source) => sourceIds.has(source.id)).map((source) => source.title);
  return {
    id: caseId(item),
    displayName: item.complaint,
    patientDisplayName: item.name,
    patientPresentationVariantId: `presentation.topic.${ESOPHAGUS_TOPIC_SLUG}.${item.slug}.v${item.version}`,
    prototypeDemographics: demographics,
    chiefComplaint: item.complaint,
    presentation: item.presentation,
    approvedInstantiationProfiles: [{
      id: `profile.topic.${ESOPHAGUS_TOPIC_SLUG}.${item.slug}.v${item.version}`,
      prototypeDemographics: demographics,
      chiefComplaint: item.complaint,
      presentation: item.presentation,
    }],
    releasePointId: "release.l0.clinic_evaluation",
    tutorialEligible: false,
    routineEligible: true,
    earliestFacilityStage: 2,
    requiredClinicalSetting: "clinic",
    requiredCapabilityIds: [],
    rewardTierId: "reward.clinic_basic",
    sourceLabels,
    decisionNodes: item.nodes.map((node, index) => {
      const question = ESOPHAGUS_TOPIC_QUESTIONS.find((question) => question.id === node.questionVariantId)!;
      return {
        id: node.nodeId,
        questionVariantId: question.id,
        primaryConceptId: question.conceptId,
        stem: question.stem,
        currentUpdate: node.currentUpdate,
        answerChoices: question.answerChoices.map((choice) => ({
          id: choice.id, label: choice.label, isCorrect: choice.isCorrect,
          rationale: choice.rationale!, serviceRequest: null,
        })),
        shuffleAnswers: true,
        explanation: question.explanation,
        sourceLabels,
        resultGateAfter: null,
        terminalDispositions: index === item.nodes.length - 1
          ? question.answerChoices.filter((choice) => !choice.isCorrect).map((choice) => ({
            answerChoiceId: choice.id,
            kind: "no_terminal_outcome" as const,
            consequenceNarrative: "Review the decision and its rationale. No hospital procedure or patient outcome is simulated in this clinic chart review.",
            clinicalRationale: choice.rationale!, sourceLabels,
          }))
          : [],
      };
    }),
    learningSummary: item.nodes.map((node) => node.explanation).join(" "),
  };
});

export const ESOPHAGUS_TOPIC_TIMING_ENTRIES: AnswerChoiceTimingRegistryEntry[] = ESOPHAGUS_TOPIC_NODES.map((node) => ({
  caseId: currentCaseId(node),
  nodeId: node.nodeId,
  questionVariantId: node.questionVariantId,
  classification: node.choices.some((choice) => choice.timingProfileId)
    ? { kind: "test_choices" as const, choices: node.choices.map((choice) => ({
      choiceId: choiceId(node, choice.id),
      choiceLabel: choice.label,
      timing: choice.timingProfileId
        ? { kind: "test" as const, timingProfileId: choice.timingProfileId }
        : { kind: "no_test" as const },
    })) }
    : { kind: "no_test" as const },
}));
export const ESOPHAGUS_TOPIC_ORDER_PROPOSALS = ESOPHAGUS_TOPIC_TIMING_ENTRIES.flatMap((entry) =>
  entry.classification.kind === "test_choices"
    ? entry.classification.choices.filter((choice) => choice.timing.kind === "test").map((choice) => ({
      ...ESOPHAGUS_TOPIC_DRAFT,
      caseId: entry.caseId, nodeId: entry.nodeId, questionVariantId: entry.questionVariantId,
      choiceId: choice.choiceId, choiceLabel: choice.choiceLabel, timing: choice.timing,
      serviceRequest: null, resultGateAfter: null,
      disposition: { kind: "not_executed" as const, reason: "future_planned" as const },
    }))
    : [],
);
export const ESOPHAGUS_TOPIC_SOURCE_LINKS = ESOPHAGUS_TOPIC_SOURCES.map((source) => ({
  ...ESOPHAGUS_TOPIC_DRAFT,
  sourceId: source.id, label: source.title, href: source.officialUrl!,
  target: "_blank" as const, rel: "noopener noreferrer" as const,
  referrerPolicy: "no-referrer" as const,
}));
export const ESOPHAGUS_TOPIC_SELF_CHECKS = ESOPHAGUS_TOPIC_NODES.map((node) => ({
  ...draftFor(node),
  questionVariantId: node.questionVariantId, nodeId: node.nodeId, caseId: currentCaseId(node),
  rubric: "question-authoring.2026-11-08.v15", ...node.authorGate,
  optionAudit: node.choices.map((choice) => ({
    choiceId: choiceId(node, choice.id), isKey: choice.id === node.correctChoice,
    temptation: choice.temptation, whyRankedHere: choice.rationale,
    correctUnder: choice.correctUnder, claimIds: choice.claimIds,
  })),
}));
export const ESOPHAGUS_TOPIC_CASE_REVIEWS = ESOPHAGUS_TOPIC_ITEMS.map((item) => ({
  ...ESOPHAGUS_TOPIC_DRAFT,
  caseId: caseId(item), mode: item.mode,
  educationalTier: item.educationalTier,
  encounterAcuity: item.encounterAcuity,
  historicalDecisionAcuity: item.historicalDecisionAcuity,
  facilityProgressionLevel: item.facilityProgressionLevel,
  requiredCapabilityIds: item.requiredCapabilityIds,
  selection: item.nodes.length > 1 ? "paired_only_all_concepts_unseen_or_due" : "standalone",
}));
export const ESOPHAGUS_TOPIC_STATEMENT_MAPPINGS = ESOPHAGUS_TOPIC_ITEMS.flatMap((item) => item.nodes.map((node) => ({
  ...draftFor(node),
  caseId: currentCaseId(node), nodeId: node.nodeId, questionVariantId: node.questionVariantId,
  constructedObservationPolicy: packet.constructedObservationPolicy,
  fields: [
    ...["presentation", "currentUpdate", "stem", "explanation"].map((field) => ({ field, claimIds: node.claimIds })),
    ...node.choices.flatMap((choice) => ["label", "rationale"].map((field) => ({
      field: `answerChoices.${choiceId(node, choice.id)}.${field}`, claimIds: choice.claimIds,
    }))),
  ],
})));
export const ESOPHAGUS_TOPIC_SOURCE_RELEASE = validateSyntheticClinicalRelease({
  id: "clinical.synthetic.prototype.v1", schemaVersion: 1,
  publicationStatus: "synthetic_unapproved_prototype",
  disclaimer: "Original synthetic topic drafts, not clinically approved. Melissa Rowland is the named clinical sign-off. Explicit authoring preview only.",
  concepts: ESOPHAGUS_TOPIC_CONCEPTS, cases: ESOPHAGUS_TOPIC_CASES,
});
export const ESOPHAGUS_TOPIC_MANIFEST = {
  ...ESOPHAGUS_TOPIC_DRAFT,
  topicSlug: ESOPHAGUS_TOPIC_SLUG,
  reviewDisplay: "key shown first for review only",
  variantCount: ESOPHAGUS_TOPIC_QUESTIONS.length,
  caseCount: ESOPHAGUS_TOPIC_CASES.length,
  conceptCount: ESOPHAGUS_TOPIC_CONCEPTS.length,
  passPreservedCount: packet.reviewRound2.summary.passPreserved,
  revisedPendingReviewCount: packet.reviewRound2.summary.revised,
  parkedCount: packet.reviewRound2.summary.parked,
  reviewedArchiveVariantCount: ESOPHAGUS_TOPIC_REVIEWED_V1.questions.length,
  independentPass: false, clinicalApproval: false, managerAccepted: false,
  clinicalSignoff: "Melissa Rowland",
  integrationDependencies: packet.integrationDependencies,
};
