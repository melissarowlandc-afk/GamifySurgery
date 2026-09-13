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

export const BATCH_CONTENT_VERSION = "development-batch.2026-09-10.1";
export const CHECKED_ON = "2026-09-10";

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
  requiredCapabilityIds?: string[];
  nodes: [NodeSpec, NodeSpec];
}

export function createDevelopmentFamily(args: {
  concepts: DevelopmentConcept[];
  cases: CaseSpec[];
  sourceLabels: string[];
}) {
  const counts = new Map<string, number>();
  const conceptsById = new Map(args.concepts.map((item) => [item.id, item]));
  const questions: DevelopmentQuestion[] = [];
  const cases = args.cases.map((spec) => {
    const suffix = spec.id.replace(/^case\./, "");
    const profiles = spec.ageYears.flatMap((ageYears) => spec.sexLabels.map((sexLabel) => ({
      id: `profile.${suffix}.${sexLabel.toLowerCase().replace(" ", "_")}.${ageYears}`,
      prototypeDemographics: { ageYears, sexLabel },
      prototypeVitalSigns: { heartRateBpm: 76, systolicBloodPressureMmHg: 118, diastolicBloodPressureMmHg: 74, temperatureF: 98.4, oxygenSaturationPercent: 99 },
      presentation: spec.presentation,
    })));
    const nodes = spec.nodes.map((node, index) => {
      const number = (counts.get(node.conceptId) ?? 0) + 1;
      counts.set(node.conceptId, number);
      const questionId = `question.${node.conceptId.replace(/^concept\./, "")}.v${number}`;
      questions.push({
        ...NEEDS_REVIEW, id: questionId, conceptId: node.conceptId,
        patientPresentationVariantId: `presentation.${suffix}`, patientPresentation: spec.presentation,
        approvedInstantiationProfiles: profiles,
        ...(node.currentUpdate ? { reachedCurrentUpdate: node.currentUpdate } : {}),
        stem: node.stem,
        answerChoices: node.choices.map((choice) => ({ id: choice.id, label: choice.label, isCorrect: choice.isCorrect === true, distractorRationale: choice.isCorrect ? null : choice.rationale })),
        explanation: node.explanation, supportingEvidenceClaimIds: [...node.claimIds], agentReview: OWNER_DELEGATED_AGENT_REVIEW,
      });
      const answers = node.choices.map((choice) => ({ id: choice.id, label: choice.label, isCorrect: choice.isCorrect === true, serviceRequest: choice.serviceId ? { serviceId: choice.serviceId } : null }));
      const final = index === spec.nodes.length - 1;
      return {
        id: `node.${suffix}.${index + 1}`, questionVariantId: questionId, primaryConceptId: node.conceptId,
        ...(node.currentUpdate ? { currentUpdate: node.currentUpdate } : {}), stem: node.stem,
        showServicePreviews: false,
        answerChoices: answers, shuffleAnswers: true, explanation: node.explanation, sourceLabels: [...args.sourceLabels],
        resultGateAfter: node.gate ? { id: node.gate.id, resultTypeId: node.gate.serviceId, pendingLabel: node.gate.pendingLabel, resultNarrative: node.gate.resultNarrative, readiness: "all" as const, allowedServiceRouteIds: [...node.gate.routeIds] } : null,
        terminalDispositions: final ? answers.filter((answer) => !answer.isCorrect).map((answer) => ({ answerChoiceId: answer.id, kind: "no_terminal_outcome" as const, consequenceNarrative: `The teaching encounter recorded “${answer.label}.”`, clinicalRationale: node.explanation, sourceLabels: [...args.sourceLabels] })) : [],
      };
    });
    return {
      id: spec.id, displayName: spec.displayName, patientPresentationVariantId: `presentation.${suffix}`,
      releasePointId: "release.l0.clinic_evaluation", patientDisplayName: "{patientName}",
      prototypeDemographics: profiles[0]!.prototypeDemographics, prototypeVitalSigns: profiles[0]!.prototypeVitalSigns,
      chiefComplaint: spec.chiefComplaint, presentation: spec.presentation, approvedInstantiationProfiles: profiles,
      tutorialEligible: false, routineEligible: true, earliestFacilityStage: spec.stage,
      requiredClinicalSetting: "clinic" as const, requiredCapabilityIds: [...(spec.requiredCapabilityIds ?? [])], rewardTierId: "reward.clinic_basic",
      sourceLabels: [...args.sourceLabels], decisionNodes: nodes,
      learningSummary: spec.nodes.map((node) => node.explanation).join(" "),
    } satisfies SyntheticClinicalCase;
  });
  return {
    concepts: args.concepts,
    testedConcepts: args.concepts.map(({ id, displayName, learningObjective, earliestFacilityStage, conceptType }) => ({ id, displayName, learningObjective, earliestFacilityStage, conceptType })),
    questions, cases,
    caseReviews: cases.map((clinicalCase) => ({
      ...NEEDS_REVIEW, caseId: clinicalCase.id,
      educationalTier: clinicalCase.decisionNodes.reduce<0 | 1>((tier, node) => Math.max(tier, conceptsById.get(node.primaryConceptId)?.educationalTier ?? 0) as 0 | 1, 0),
      acuity: "stable" as const, earliestFacilityStage: clinicalCase.earliestFacilityStage as 0 | 1 | 2,
      requiredClinicalSetting: "clinic" as const, requiredCapabilityIds: [...clinicalCase.requiredCapabilityIds],
      profileValuesBasis: "editorial_simulation_not_prevalence_or_diagnostic_threshold" as const,
      agentReview: OWNER_DELEGATED_AGENT_REVIEW,
    })),
  };
}

export function linkSourcesToClaims(sources: Array<Omit<ClinicalSource, "evidenceClaimIds">>, claims: EvidenceClaim[]): ClinicalSource[] {
  return sources.map((item) => ({ ...item, evidenceClaimIds: claims.filter((claim) => claim.sourceIds.includes(item.id)).map((claim) => claim.id) }));
}

export function concept(args: Omit<DevelopmentConcept, keyof AuthoredClinicalRecord | "agentReview">): DevelopmentConcept {
  return { ...NEEDS_REVIEW, ...args, agentReview: OWNER_DELEGATED_AGENT_REVIEW };
}
export function claim(args: Omit<EvidenceClaim, keyof AuthoredClinicalRecord>): EvidenceClaim {
  return { ...NEEDS_REVIEW, ...args };
}
export function source(args: Omit<ClinicalSource, keyof AuthoredClinicalRecord | "evidenceClaimIds">): Omit<ClinicalSource, "evidenceClaimIds"> {
  return { ...NEEDS_REVIEW, ...args };
}
