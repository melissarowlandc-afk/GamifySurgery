import type {
  AuthoredClinicalRecord,
  ClinicalSource,
  EvidenceClaim,
  QuestionVariant,
} from "../../pilot-schema";
import type {
  ApprovedInstantiationProfile,
  SyntheticClinicalCase,
  TestedConcept,
} from "../../schema";

export const BATCH_CONTENT_VERSION = "development-batch.2026-09-09.1";
export const CHECKED_ON = "2026-09-09";

export const NEEDS_REVIEW = {
  contentVersion: BATCH_CONTENT_VERSION,
  reviewStatus: "needs_clinician_review",
  aiAssistedDrafting: true,
  lastClinicianReview: null,
} as const satisfies AuthoredClinicalRecord;

export const OWNER_DELEGATED_AGENT_REVIEW = {
  authority: "owner-delegated agent authoring and review",
  reviewedOn: CHECKED_ON,
  clinicianSignOff: false,
  scope:
    "Technical, editorial, source-traceability, and internal-consistency review; clinical review remains required.",
} as const;

export interface DevelopmentConcept extends TestedConcept, AuthoredClinicalRecord {
  educationalTier: 0 | 1;
  evidenceClaimIds: string[];
  agentReview: typeof OWNER_DELEGATED_AGENT_REVIEW;
}

export interface DevelopmentQuestion extends QuestionVariant {
  patientPresentationVariantId: string;
  patientPresentation: string;
  approvedInstantiationProfiles: ApprovedInstantiationProfile[];
  reachedCurrentUpdate?: string;
  agentReview: typeof OWNER_DELEGATED_AGENT_REVIEW;
}

export interface DevelopmentCaseReview extends AuthoredClinicalRecord {
  caseId: string;
  educationalTier: 0 | 1;
  acuity: "stable";
  earliestFacilityStage: 0 | 1 | 2;
  requiredClinicalSetting: "clinic";
  requiredCapabilityIds: string[];
  profileValuesBasis: "editorial_simulation_not_prevalence_or_diagnostic_threshold";
  agentReview: typeof OWNER_DELEGATED_AGENT_REVIEW;
}

export interface DevelopmentServiceContract {
  serviceId: string;
  allowedRouteIds: string[];
  delivery: "existing_balance_contract" | "new_external_contract_required";
}

export interface ChoiceSpec {
  id: string;
  label: string;
  isCorrect?: boolean;
  serviceId?: string;
  rationale: string;
}

export interface GateSpec {
  id: string;
  serviceId: string;
  pendingLabel: string;
  resultNarrative: string;
  routeIds: string[];
}

export interface NodeSpec {
  conceptId: string;
  stem: string;
  choices: [ChoiceSpec, ChoiceSpec, ChoiceSpec, ChoiceSpec];
  explanation: string;
  claimIds: string[];
  currentUpdate?: string;
  gate?: GateSpec;
}

export interface CaseSpec {
  id: string;
  displayName: string;
  chiefComplaint: string;
  presentation: string;
  ageYears: readonly number[];
  sexLabels: readonly ("Female" | "Male" | "Not specified")[];
  stage: 0 | 1 | 2;
  nodes: NodeSpec[];
}

function stableSuffix(id: string): string {
  return id.replace(/^case\./, "");
}

function variantNumber(index: number): string {
  return `v${index + 1}`;
}

export function createDevelopmentFamily(args: {
  concepts: DevelopmentConcept[];
  cases: CaseSpec[];
  sourceLabels: string[];
}): {
  concepts: DevelopmentConcept[];
  testedConcepts: TestedConcept[];
  questions: DevelopmentQuestion[];
  cases: SyntheticClinicalCase[];
  caseReviews: DevelopmentCaseReview[];
} {
  const conceptCounts = new Map<string, number>();
  const conceptsById = new Map(args.concepts.map((item) => [item.id, item]));
  const questions: DevelopmentQuestion[] = [];

  const cases = args.cases.map((caseSpec) => {
    const suffix = stableSuffix(caseSpec.id);
    const profiles: ApprovedInstantiationProfile[] = caseSpec.ageYears.flatMap((ageYears) =>
      caseSpec.sexLabels.map((sexLabel) => ({
        id: `profile.${suffix}.${sexLabel.toLowerCase().replace(" ", "_")}.${ageYears}`,
        prototypeDemographics: { ageYears, sexLabel },
        prototypeVitalSigns: {
          heartRateBpm: 76,
          systolicBloodPressureMmHg: 118,
          diastolicBloodPressureMmHg: 74,
          temperatureF: 98.4,
          oxygenSaturationPercent: 99,
        },
        presentation: caseSpec.presentation,
      })),
    );
    const profile = profiles[0]!;

    const nodes = caseSpec.nodes.map((nodeSpec, nodeIndex) => {
      const count = conceptCounts.get(nodeSpec.conceptId) ?? 0;
      conceptCounts.set(nodeSpec.conceptId, count + 1);
      const questionId = `question.${nodeSpec.conceptId.replace(/^concept\./, "")}.${variantNumber(count)}`;
      questions.push({
        ...NEEDS_REVIEW,
        id: questionId,
        conceptId: nodeSpec.conceptId,
        patientPresentationVariantId: `presentation.${suffix}`,
        patientPresentation: caseSpec.presentation,
        approvedInstantiationProfiles: profiles,
        ...(nodeSpec.currentUpdate ? { reachedCurrentUpdate: nodeSpec.currentUpdate } : {}),
        stem: nodeSpec.stem,
        answerChoices: nodeSpec.choices.map((choice) => ({
          id: choice.id,
          label: choice.label,
          isCorrect: choice.isCorrect === true,
          distractorRationale: choice.isCorrect ? null : choice.rationale,
        })),
        explanation: nodeSpec.explanation,
        supportingEvidenceClaimIds: [...nodeSpec.claimIds],
        agentReview: OWNER_DELEGATED_AGENT_REVIEW,
      });

      const final = nodeIndex === caseSpec.nodes.length - 1;
      const answers = nodeSpec.choices.map((choice) => ({
        id: choice.id,
        label: choice.label,
        isCorrect: choice.isCorrect === true,
        serviceRequest: choice.serviceId ? { serviceId: choice.serviceId } : null,
      }));
      return {
        id: `node.${suffix}.${nodeIndex + 1}`,
        questionVariantId: questionId,
        primaryConceptId: nodeSpec.conceptId,
        ...(nodeSpec.currentUpdate ? { currentUpdate: nodeSpec.currentUpdate } : {}),
        stem: nodeSpec.stem,
        answerChoices: answers,
        shuffleAnswers: true,
        explanation: nodeSpec.explanation,
        sourceLabels: [...args.sourceLabels],
        resultGateAfter: nodeSpec.gate
          ? {
              id: nodeSpec.gate.id,
              resultTypeId: nodeSpec.gate.serviceId,
              pendingLabel: nodeSpec.gate.pendingLabel,
              resultNarrative: nodeSpec.gate.resultNarrative,
              readiness: "all" as const,
              allowedServiceRouteIds: [...nodeSpec.gate.routeIds],
            }
          : null,
        terminalDispositions: final
          ? answers
              .filter((answer) => !answer.isCorrect)
              .map((answer) => ({
                answerChoiceId: answer.id,
                kind: "no_terminal_outcome" as const,
                consequenceNarrative: `The teaching encounter recorded “${answer.label}.”`,
                clinicalRationale: nodeSpec.explanation,
                sourceLabels: [...args.sourceLabels],
              }))
          : [],
      };
    });

    return {
      id: caseSpec.id,
      displayName: caseSpec.displayName,
      patientPresentationVariantId: `presentation.${suffix}`,
      releasePointId: "release.l0.clinic_evaluation",
      patientDisplayName: "{patientName}",
      prototypeDemographics: profile.prototypeDemographics,
      prototypeVitalSigns: profile.prototypeVitalSigns,
      chiefComplaint: caseSpec.chiefComplaint,
      presentation: caseSpec.presentation,
      approvedInstantiationProfiles: profiles,
      tutorialEligible: false,
      routineEligible: true,
      earliestFacilityStage: caseSpec.stage,
      requiredClinicalSetting: "clinic" as const,
      requiredCapabilityIds: [],
      rewardTierId: "reward.clinic_basic",
      sourceLabels: [...args.sourceLabels],
      decisionNodes: nodes,
      learningSummary: caseSpec.nodes.map((node) => node.explanation).join(" "),
    };
  }) satisfies SyntheticClinicalCase[];

  return {
    concepts: args.concepts,
    testedConcepts: args.concepts.map(({ id, displayName, learningObjective, earliestFacilityStage, conceptType }) => ({
      id,
      displayName,
      learningObjective,
      earliestFacilityStage,
      conceptType,
    })),
    questions,
    cases,
    caseReviews: cases.map((clinicalCase) => ({
      ...NEEDS_REVIEW,
      caseId: clinicalCase.id,
      educationalTier: clinicalCase.decisionNodes.reduce<0 | 1>(
        (tier, node) => Math.max(tier, conceptsById.get(node.primaryConceptId)?.educationalTier ?? 0) as 0 | 1,
        0,
      ),
      acuity: "stable",
      earliestFacilityStage: clinicalCase.earliestFacilityStage as 0 | 1 | 2,
      requiredClinicalSetting: "clinic",
      requiredCapabilityIds: [...clinicalCase.requiredCapabilityIds],
      profileValuesBasis: "editorial_simulation_not_prevalence_or_diagnostic_threshold",
      agentReview: OWNER_DELEGATED_AGENT_REVIEW,
    })),
  };
}

export function linkSourcesToClaims(
  sources: Array<Omit<ClinicalSource, "evidenceClaimIds">>,
  claims: EvidenceClaim[],
): ClinicalSource[] {
  return sources.map((source) => ({
    ...source,
    evidenceClaimIds: claims
      .filter((claim) => claim.sourceIds.includes(source.id))
      .map((claim) => claim.id),
  }));
}

export function concept(args: Omit<DevelopmentConcept, keyof AuthoredClinicalRecord | "agentReview">): DevelopmentConcept {
  return {
    ...NEEDS_REVIEW,
    ...args,
    agentReview: OWNER_DELEGATED_AGENT_REVIEW,
  };
}

export function claim(args: Omit<EvidenceClaim, keyof AuthoredClinicalRecord>): EvidenceClaim {
  return { ...NEEDS_REVIEW, ...args };
}

export function source(args: Omit<ClinicalSource, keyof AuthoredClinicalRecord | "evidenceClaimIds">): Omit<ClinicalSource, "evidenceClaimIds"> {
  return { ...NEEDS_REVIEW, ...args };
}

