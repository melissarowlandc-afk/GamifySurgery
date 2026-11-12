import packet from "../../../docs/research/question-topic-breast-benign-high-risk-20261111.json";
import ledger from "../../../docs/research/sources-question-topic-breast-benign-high-risk-20261111.json";
import type { ClinicalSource, EvidenceClaim, QuestionVariant } from "./pilot-schema";
import {
  answerChoiceTimingRegistryEntrySchema,
  syntheticClinicalCaseSchema,
  testedConceptSchema,
} from "./schema";

/** Explicit-import authoring sidecar. No shipping, registration or service execution. */
export const BREAST_BENIGN_HIGH_RISK_TOPIC_DRAFT = {
  contentVersion: "clinical.question-topic-breast-benign-high-risk.2026-11-11.v2",
  reviewStatus: "needs_clinician_review",
  aiAssistedDrafting: true,
  lastClinicianReview: null,
  releaseAdmission: "not_requested_by_this_sidecar",
  reviewOrderLabel: "key shown first for review only.",
} as const;

export const BREAST_BENIGN_HIGH_RISK_TOPIC_QUESTIONS: QuestionVariant[] =
  packet.proposals.map(({ question }) => question as QuestionVariant);

export const BREAST_BENIGN_HIGH_RISK_TOPIC_CASES = packet.authoredCases.map(
  (clinicalCase) => syntheticClinicalCaseSchema.parse(clinicalCase),
);

/** Editorial PASS is separate from named clinical approval and release admission. */
export const BREAST_BENIGN_HIGH_RISK_TOPIC_REVIEW_RESPONSES =
  packet.reviewRound2.responses;
export const BREAST_BENIGN_HIGH_RISK_TOPIC_INDEPENDENT_PASS_CASES =
  BREAST_BENIGN_HIGH_RISK_TOPIC_CASES.filter((clinicalCase) =>
    clinicalCase.decisionNodes.every((node) =>
      packet.reviewRound2.responses.some((response) =>
        response.currentQuestionVariantId === node.questionVariantId &&
        response.status === "pass-preserved"),
    ),
  );
export const BREAST_BENIGN_HIGH_RISK_TOPIC_PENDING_REVIEW_CASES =
  BREAST_BENIGN_HIGH_RISK_TOPIC_CASES.filter((clinicalCase) =>
    !BREAST_BENIGN_HIGH_RISK_TOPIC_INDEPENDENT_PASS_CASES.includes(clinicalCase),
  );

/** Unkeyed attempts and superseded versions never join the scored candidate arrays. */
export const BREAST_BENIGN_HIGH_RISK_TOPIC_PARKED_ATTEMPTS =
  packet.reviewRound2.parkedAttempts;
export const BREAST_BENIGN_HIGH_RISK_TOPIC_RETAINED_ROUND1 = {
  questions: packet.reviewRound1Archive.proposals.map(({ question }) => question),
  cases: packet.reviewRound1Archive.authoredCases,
  selection: "archive_only",
} as const;

export const BREAST_BENIGN_HIGH_RISK_TOPIC_CONCEPTS = packet.proposals.map(
  (proposal) => {
    const previous = packet.assignment.concepts.find(
      (concept) => concept.conceptId === proposal.question.conceptId,
    );
    const clinicalCase = BREAST_BENIGN_HIGH_RISK_TOPIC_CASES.find(
      (candidate) => candidate.id === proposal.caseId,
    )!;
    return testedConceptSchema.parse({
      id: proposal.question.conceptId,
      displayName: previous?.displayName ?? proposal.objective,
      learningObjective: previous?.learningObjective ?? proposal.objective,
      earliestFacilityStage: clinicalCase.earliestFacilityStage,
      conceptType: "management",
    });
  },
);

/** Review state and tier are separate from the normalized runtime concept shape. */
export const BREAST_BENIGN_HIGH_RISK_TOPIC_CONCEPT_PROPOSALS =
  packet.proposals.map((proposal) => ({
    ...BREAST_BENIGN_HIGH_RISK_TOPIC_DRAFT,
    ...proposal.conceptDecision,
    educationalTier: 1,
    patientAcuity: "stable_outpatient",
    requiredClinicalSetting: "clinic",
    requiredCapabilityIds: [] as string[],
    earliestFacilityStage: BREAST_BENIGN_HIGH_RISK_TOPIC_CASES.find(
      (candidate) => candidate.id === proposal.caseId,
    )!.earliestFacilityStage,
    evidenceClaimIds: proposal.question.supportingEvidenceClaimIds,
    historyPolicy: "preserve_old_definitions_and_fsrs; no_history_transfer",
  }));

export const BREAST_BENIGN_HIGH_RISK_TOPIC_TIMING_PROPOSALS =
  packet.proposals.map((proposal) =>
    answerChoiceTimingRegistryEntrySchema.parse({
      caseId: proposal.caseId,
      nodeId: proposal.nodeId,
      questionVariantId: proposal.question.id,
      classification: {
        kind: "test_choices",
        choices: proposal.choiceTiming,
      },
    }),
  );

export const BREAST_BENIGN_HIGH_RISK_TOPIC_ORDER_PROPOSALS =
  packet.proposals.map((proposal) => ({
    ...BREAST_BENIGN_HIGH_RISK_TOPIC_DRAFT,
    caseId: proposal.caseId,
    nodeId: proposal.nodeId,
    questionVariantId: proposal.question.id,
    ...proposal.orderProposal,
    exactChoiceMappings: proposal.choiceTiming,
    choiceOrderScopes: proposal.choiceOrderScopes,
  }));

export const BREAST_BENIGN_HIGH_RISK_TOPIC_SOURCES: ClinicalSource[] =
  ledger.sources as ClinicalSource[];
export const BREAST_BENIGN_HIGH_RISK_TOPIC_EVIDENCE_CLAIMS: EvidenceClaim[] =
  ledger.claims as EvidenceClaim[];

export const BREAST_BENIGN_HIGH_RISK_TOPIC_SOURCE_LINKS = ledger.sources.map(
  (source) => ({
    ...BREAST_BENIGN_HIGH_RISK_TOPIC_DRAFT,
    id: `link.breast-benign-high-risk.${source.id.replace(/^source\./, "")}`,
    sourceId: source.id,
    label: source.title,
    href: source.officialUrl,
    target: "_blank" as const,
    rel: "noopener noreferrer" as const,
    referrerPolicy: "no-referrer" as const,
  }),
);

export const BREAST_BENIGN_HIGH_RISK_TOPIC_AUDIT = packet.audit;
export const BREAST_BENIGN_HIGH_RISK_TOPIC_AUTHOR_GATES = packet.proposals.map(
  (proposal) => proposal.manualAuthorGate,
);
export const BREAST_BENIGN_HIGH_RISK_TOPIC_STATEMENT_MAPPINGS =
  packet.proposals.map((proposal) => ({
    ...BREAST_BENIGN_HIGH_RISK_TOPIC_DRAFT,
    caseId: proposal.caseId,
    questionVariantId: proposal.question.id,
    ...proposal.statementMappings,
  }));
export const BREAST_BENIGN_HIGH_RISK_TOPIC_COMPOSITION_PROPOSALS =
  packet.authoredCases.map((clinicalCase) => ({
    ...BREAST_BENIGN_HIGH_RISK_TOPIC_DRAFT,
    caseId: clinicalCase.id,
    nodeIds: clinicalCase.decisionNodes.map((node) => node.id),
    questionVariantIds: clinicalCase.decisionNodes.map((node) => node.questionVariantId),
    scoredTopic: "breast-benign-high-risk",
    selection: clinicalCase.decisionNodes.length > 1 ? "paired_only" : "standalone",
    requiredClinicalSetting: "clinic",
    resultHandling: "sequential_outside_record_updates",
    pipelinePassed: false,
    everyScoredNodePassedIndependentReview:
      BREAST_BENIGN_HIGH_RISK_TOPIC_INDEPENDENT_PASS_CASES.some(
        (candidate) => candidate.id === clinicalCase.id,
      ),
    independentReviewStatus:
      BREAST_BENIGN_HIGH_RISK_TOPIC_INDEPENDENT_PASS_CASES.some(
        (candidate) => candidate.id === clinicalCase.id,
      ) ? "PASS_wording_preserved" : "re_review_pending",
  }));
