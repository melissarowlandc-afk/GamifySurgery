import type {
  AuthoredClinicalRecord,
  ClinicalSource,
  EvidenceClaim,
  QuestionVariant,
} from "../../pilot-schema";
import type {
  AnswerChoiceTimingRegistryEntry,
  ApprovedInstantiationProfile,
  SyntheticClinicalCase,
  TestedConcept,
} from "../../schema";

export const BATCH_CONTENT_VERSION = "development-batch.2026-09-17.1";
export const CHECKED_ON = "2026-09-17";

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
    "Technical, editorial, source-traceability, and internal-consistency review; named clinician review remains required.",
} as const;

export interface DevelopmentConcept
  extends TestedConcept,
    AuthoredClinicalRecord {
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
  acuity: "stable" | "urgent";
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

export type TimingSpec =
  | { kind: "no_test" }
  | { kind: "test"; timingProfileId: string };

export interface ChoiceSpec {
  id: string;
  label: string;
  isCorrect?: boolean;
  serviceId?: string;
  rationale: string;
  timing: TimingSpec;
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
  acuity?: "stable" | "urgent";
  prototypeVitalSigns?: {
    heartRateBpm: number;
    systolicBloodPressureMmHg: number;
    diastolicBloodPressureMmHg: number;
    temperatureF: number;
    oxygenSaturationPercent: number;
  };
  requiredCapabilityIds?: string[];
  nodes: [NodeSpec] | [NodeSpec, NodeSpec];
}

const sexWord = (sex: "Female" | "Male" | "Not specified") =>
  sex === "Female" ? "woman" : sex === "Male" ? "man" : "adult";

const presentationFor = (
  template: string,
  age: number,
  sex: "Female" | "Male" | "Not specified",
) =>
  template
    .replaceAll("{patientAge}", String(age))
    .replaceAll("{patientSex}", sexWord(sex));

function timingEntry(
  caseId: string,
  nodeId: string,
  questionVariantId: string,
  choices: readonly ChoiceSpec[],
): AnswerChoiceTimingRegistryEntry {
  const hasTest = choices.some((choice) => choice.timing.kind === "test");
  return hasTest
    ? {
        caseId,
        nodeId,
        questionVariantId,
        classification: {
          kind: "test_choices",
          choices: choices.map((choice) => ({
            choiceId: choice.id,
            choiceLabel: choice.label,
            timing: choice.timing,
          })),
        },
      }
    : {
        caseId,
        nodeId,
        questionVariantId,
        classification: { kind: "no_test" },
      };
}

export function createDevelopmentFamily(args: {
  concepts: DevelopmentConcept[];
  cases: CaseSpec[];
  sourceLabels: string[];
}) {
  const counts = new Map<string, number>();
  const conceptsById = new Map(args.concepts.map((item) => [item.id, item]));
  const questions: DevelopmentQuestion[] = [];
  const timingEntries: AnswerChoiceTimingRegistryEntry[] = [];

  const cases = args.cases.map((spec) => {
    const suffix = spec.id.replace(/^case\./, "");
    const profiles = spec.ageYears.flatMap((age) =>
      spec.sexLabels.map((sex) => ({
        id: `profile.${suffix}.${sex.toLowerCase().replace(" ", "_")}.${age}`,
        prototypeDemographics: { ageYears: age, sexLabel: sex },
        prototypeVitalSigns: spec.prototypeVitalSigns ?? {
          heartRateBpm: 76,
          systolicBloodPressureMmHg: 118,
          diastolicBloodPressureMmHg: 74,
          temperatureF: 98.4,
          oxygenSaturationPercent: 99,
        },
        presentation: presentationFor(spec.presentation, age, sex),
      })),
    );
    const basePresentation = profiles[0]!.presentation;

    const nodes = spec.nodes.map((node, index) => {
      const number = (counts.get(node.conceptId) ?? 0) + 1;
      counts.set(node.conceptId, number);
      const questionId = `question.${node.conceptId.replace(/^concept\./, "")}.v${number}`;
      const nodeId = `node.${suffix}.${index + 1}`;

      questions.push({
        ...NEEDS_REVIEW,
        id: questionId,
        conceptId: node.conceptId,
        patientPresentationVariantId: `presentation.${suffix}`,
        patientPresentation: basePresentation,
        approvedInstantiationProfiles: profiles,
        ...(node.currentUpdate
          ? { reachedCurrentUpdate: node.currentUpdate }
          : {}),
        stem: node.stem,
        answerChoices: node.choices.map((choice) => ({
          id: choice.id,
          label: choice.label,
          isCorrect: choice.isCorrect === true,
          distractorRationale: choice.isCorrect ? null : choice.rationale,
        })),
        explanation: node.explanation,
        supportingEvidenceClaimIds: [...node.claimIds],
        agentReview: OWNER_DELEGATED_AGENT_REVIEW,
      });

      timingEntries.push(
        timingEntry(spec.id, nodeId, questionId, node.choices),
      );

      const answers = node.choices.map((choice) => ({
        id: choice.id,
        label: choice.label,
        isCorrect: choice.isCorrect === true,
        serviceRequest: choice.serviceId
          ? { serviceId: choice.serviceId }
          : null,
      }));
      const final = index === spec.nodes.length - 1;

      return {
        id: nodeId,
        questionVariantId: questionId,
        primaryConceptId: node.conceptId,
        ...(node.currentUpdate ? { currentUpdate: node.currentUpdate } : {}),
        stem: node.stem,
        answerChoices: answers,
        shuffleAnswers: true,
        explanation: node.explanation,
        sourceLabels: [...args.sourceLabels],
        resultGateAfter: node.gate
          ? {
              id: node.gate.id,
              resultTypeId: node.gate.serviceId,
              pendingLabel: node.gate.pendingLabel,
              resultNarrative: node.gate.resultNarrative,
              readiness: "all" as const,
              allowedServiceRouteIds: [...node.gate.routeIds],
            }
          : null,
        terminalDispositions: final
          ? answers
              .filter((answer) => !answer.isCorrect)
              .map((answer) => ({
                answerChoiceId: answer.id,
                kind: "no_terminal_outcome" as const,
                consequenceNarrative: `The teaching encounter recorded “${answer.label}.”`,
                clinicalRationale: node.explanation,
                sourceLabels: [...args.sourceLabels],
              }))
          : [],
      };
    });

    return {
      id: spec.id,
      displayName: spec.displayName,
      patientPresentationVariantId: `presentation.${suffix}`,
      releasePointId: "release.l0.clinic_evaluation",
      patientDisplayName: "{patientName}",
      prototypeDemographics: profiles[0]!.prototypeDemographics,
      prototypeVitalSigns: profiles[0]!.prototypeVitalSigns,
      chiefComplaint: spec.chiefComplaint,
      presentation: basePresentation,
      approvedInstantiationProfiles: profiles,
      tutorialEligible: false,
      routineEligible: true,
      earliestFacilityStage: spec.stage,
      requiredClinicalSetting: "clinic" as const,
      requiredCapabilityIds: [...(spec.requiredCapabilityIds ?? [])],
      rewardTierId: "reward.clinic_basic",
      sourceLabels: [...args.sourceLabels],
      decisionNodes: nodes,
      learningSummary: spec.nodes
        .map((node) => node.explanation)
        .join(" "),
    } satisfies SyntheticClinicalCase;
  });

  return {
    concepts: args.concepts,
    testedConcepts: args.concepts.map(
      ({ id, displayName, learningObjective, earliestFacilityStage, conceptType }) => ({
        id,
        displayName,
        learningObjective,
        earliestFacilityStage,
        conceptType,
      }),
    ),
    questions,
    cases,
    timingEntries,
    caseReviews: cases.map((clinicalCase, index) => ({
      ...NEEDS_REVIEW,
      caseId: clinicalCase.id,
      educationalTier: clinicalCase.decisionNodes.reduce<0 | 1>(
        (tier, node) =>
          Math.max(
            tier,
            conceptsById.get(node.primaryConceptId)?.educationalTier ?? 0,
          ) as 0 | 1,
        0,
      ),
      acuity: args.cases[index]!.acuity ?? "stable",
      earliestFacilityStage: clinicalCase.earliestFacilityStage as 0 | 1 | 2,
      requiredClinicalSetting: "clinic" as const,
      requiredCapabilityIds: [...clinicalCase.requiredCapabilityIds],
      profileValuesBasis:
        "editorial_simulation_not_prevalence_or_diagnostic_threshold" as const,
      agentReview: OWNER_DELEGATED_AGENT_REVIEW,
    })),
  };
}

export function linkSourcesToClaims(
  sources: Array<Omit<ClinicalSource, "evidenceClaimIds">>,
  claims: EvidenceClaim[],
): ClinicalSource[] {
  return sources.map((item) => ({
    ...item,
    evidenceClaimIds: claims
      .filter((claimItem) => claimItem.sourceIds.includes(item.id))
      .map((claimItem) => claimItem.id),
  }));
}

export function concept(
  args: Omit<DevelopmentConcept, keyof AuthoredClinicalRecord | "agentReview">,
): DevelopmentConcept {
  return {
    ...NEEDS_REVIEW,
    ...args,
    agentReview: OWNER_DELEGATED_AGENT_REVIEW,
  };
}

export function claim(
  args: Omit<EvidenceClaim, keyof AuthoredClinicalRecord | "evidenceCategory"> & {
    evidenceCategory: EvidenceClaim["evidenceCategory"] | "diagnosis";
  },
): EvidenceClaim {
  return {
    ...NEEDS_REVIEW,
    ...args,
    evidenceCategory:
      args.evidenceCategory === "diagnosis"
        ? "evaluation"
        : args.evidenceCategory,
  };
}

export function source(
  args: Omit<
    ClinicalSource,
    keyof AuthoredClinicalRecord | "evidenceClaimIds" | "sourceClass"
  > & {
    sourceClass: ClinicalSource["sourceClass"] | "consensus_guideline";
  },
): Omit<ClinicalSource, "evidenceClaimIds"> {
  return {
    ...NEEDS_REVIEW,
    ...args,
    sourceClass:
      args.sourceClass === "consensus_guideline"
        ? "peer_reviewed_guideline"
        : args.sourceClass,
  };
}
