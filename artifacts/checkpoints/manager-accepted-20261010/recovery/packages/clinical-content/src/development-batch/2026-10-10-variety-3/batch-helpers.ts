import { z } from "zod";
import type { AuthoredClinicalRecord, QuestionVariant } from "../../pilot-schema";
import {
  syntheticClinicalCaseSchema,
  type AnswerChoiceTimingRegistryEntry,
  type ApprovedInstantiationProfile,
  type SyntheticClinicalCase,
  type TestedConcept,
} from "../../schema";

export const BATCH_CONTENT_VERSION = "development-batch.2026-10-10.variety-3.1";
export const CHECKED_ON = "2026-10-10";
export const NEEDS_REVIEW = {
  contentVersion: BATCH_CONTENT_VERSION,
  reviewStatus: "needs_clinician_review",
  aiAssistedDrafting: true,
  lastClinicianReview: null,
} as const satisfies AuthoredClinicalRecord;
export const AGENT_REVIEW = {
  authority: "owner-delegated agent authoring and review",
  reviewedOn: CHECKED_ON,
  clinicianSignOff: false,
  scope: "Editorial and provenance checks only; no clinical approval or release admission.",
} as const;

/** Authored roster metadata, not visual inference or demographic disease weights. */
export const ADULT_ART_PROFILES = {
  man32: { stillId: "patient-demographics20-v4.001", ageYears: 32, sexLabel: "Male" },
  man42: { stillId: "patient-demographics20-v4.004", ageYears: 42, sexLabel: "Male" },
  man46: { stillId: "patient-demographics20-v4.006", ageYears: 46, sexLabel: "Male" },
  man49: { stillId: "patient-demographics20-v4.007", ageYears: 49, sexLabel: "Male" },
  man55: { stillId: "patient-demographics20-v4.009", ageYears: 55, sexLabel: "Male" },
  man61: { stillId: "patient-demographics20-v4.011", ageYears: 61, sexLabel: "Male" },
  man64: { stillId: "patient-demographics20-v4.012", ageYears: 64, sexLabel: "Male" },
  man67: { stillId: "patient-demographics20-v4.016", ageYears: 67, sexLabel: "Male" },
  man68: { stillId: "patient-demographics20-v4.017", ageYears: 68, sexLabel: "Male" },
  man71: { stillId: "patient-demographics20-v4.018", ageYears: 71, sexLabel: "Male" },
  woman48: { stillId: "patient-demographics20-v4.019", ageYears: 48, sexLabel: "Female" },
  woman60: { stillId: "patient-demographics20-v4.020", ageYears: 60, sexLabel: "Female" },
  woman67: { stillId: "patient-demographics20-v4.013", ageYears: 67, sexLabel: "Female" },
  woman68: { stillId: "patient-demographics20-v4.014", ageYears: 68, sexLabel: "Female" },
  woman71: { stillId: "patient-demographics20-v4.015", ageYears: 71, sexLabel: "Female" },
} as const;

/** Same companion-envelope approach as the pediatric batch, narrowed for adults. */
export const adultDraftCaseSchema = syntheticClinicalCaseSchema.safeExtend({
  earliestFacilityStage: z.number().int().min(1).max(3),
  requiredClinicalSetting: z.literal("clinic"),
}).superRefine((item, context) => {
  const issue = (path: (string | number)[], message: string) => context.addIssue({ code: "custom", path, message });
  const profiles = item.approvedInstantiationProfiles ?? [];
  if (profiles.length !== 1) issue(["approvedInstantiationProfiles"], "One constrained adult profile is required.");
  for (const demographics of [item.prototypeDemographics, ...profiles.map(profile => profile.prototypeDemographics)]) {
    if (!demographics || demographics.ageYears < 18 || demographics.sexLabel === "Not specified") {
      issue(["prototypeDemographics"], "An explicit adult age and sex matched to authored art metadata are required.");
    }
  }
  if (profiles[0] && JSON.stringify(profiles[0].prototypeDemographics) !== JSON.stringify(item.prototypeDemographics)) {
    issue(["approvedInstantiationProfiles"], "Case and constrained-profile demographics must match.");
  }
  if (item.pediatricProfile || item.prototypeVitalSigns || profiles.some(profile => profile.pediatricProfile || profile.prototypeVitalSigns)) {
    issue(["prototypeDemographics"], "No pediatric marker or unverified vital-sign overlay belongs in this adult draft.");
  }
  if (item.requiredCapabilityIds.length || item.participant || item.tutorialEligible || item.decisionNodes.length !== 1) {
    issue(["decisionNodes"], "This batch contains one-decision adult clinic counseling/recognition visits.");
  }
  const expectedRelease = { 1: "release.l1.minor_procedure", 2: "release.l2.endoscopy", 3: "release.l3.ambulatory_or_qi" }[item.earliestFacilityStage as 1 | 2 | 3];
  if (item.releasePointId !== expectedRelease) issue(["releasePointId"], "Use the existing semantic release point for this level.");
  for (const [index, node] of item.decisionNodes.entries()) {
    if (node.resultGateAfter || node.answerChoices.some(choice => choice.serviceRequest) || !node.shuffleAnswers) {
      issue(["decisionNodes", index], "Only shuffled counseling/plan choices are authored; no executable procedure service or test-result gate.");
    }
  }
});

export interface DevelopmentConcept extends TestedConcept, AuthoredClinicalRecord {
  educationalTier: 0 | 1;
  evidenceClaimIds: string[];
  identityDisposition: "new_objective";
  agentReview: typeof AGENT_REVIEW;
}
export interface DevelopmentQuestion extends QuestionVariant {
  patientPresentationVariantId: string;
  patientPresentation: string;
  approvedInstantiationProfiles: ApprovedInstantiationProfile[];
  agentReview: typeof AGENT_REVIEW;
}
export interface ChoiceSpec {
  slug: string;
  label: string;
  rationale: string;
  claimIds: string[];
  /** Existing presentation-time estimate hook, including proposed distractor tests/procedures. */
  timingProfileId?: string;
}
export interface VariantSpec {
  slug: string;
  patientName: string;
  artProfile: keyof typeof ADULT_ART_PROFILES;
  chiefComplaint: string;
  findings: string;
  stem: string;
  /** Review authoring order is key first; runtime-shaped nodes always shuffle. */
  choices: [ChoiceSpec, ChoiceSpec, ChoiceSpec, ChoiceSpec];
  explanation: string;
  teachingPoint: string;
  evidence: { presentation: string[]; stem: string[]; explanation: string[]; teachingPoint: string[] };
  acuity?: "stable" | "urgent_stable";
}
export interface ConceptSpec {
  id: string;
  displayName: string;
  learningObjective: string;
  conceptType: TestedConcept["conceptType"];
  educationalTier: 0 | 1;
  earliestFacilityStage: 1 | 2 | 3;
  evidenceClaimIds: string[];
  variants: [VariantSpec, VariantSpec];
}

export function buildFamily(specs: ConceptSpec[], labelsForClaims: (ids: string[]) => string[]) {
  const concepts: DevelopmentConcept[] = specs.map(spec => ({
    ...NEEDS_REVIEW,
    id: spec.id, displayName: spec.displayName, learningObjective: spec.learningObjective,
    conceptType: spec.conceptType, earliestFacilityStage: spec.earliestFacilityStage,
    educationalTier: spec.educationalTier, evidenceClaimIds: [...spec.evidenceClaimIds],
    identityDisposition: "new_objective", agentReview: AGENT_REVIEW,
  }));
  const questions: DevelopmentQuestion[] = [];
  const cases: SyntheticClinicalCase[] = [];
  const timingEntries: AnswerChoiceTimingRegistryEntry[] = [];
  const caseReviews = [];
  const adultContexts = [];
  const statementMappings = [];
  for (const spec of specs) for (const [variantIndex, variant] of spec.variants.entries()) {
    const suffix = `variety3.${variant.slug}`;
    const caseId = `case.${suffix}`;
    const questionId = `question.${suffix}.v${variantIndex + 1}`;
    const nodeId = `node.${suffix}.1`;
    const art = ADULT_ART_PROFILES[variant.artProfile];
    const demographics = { ageYears: art.ageYears, sexLabel: art.sexLabel };
    const presentation = `${variant.patientName}, a ${art.ageYears}-year-old ${art.sexLabel === "Female" ? "woman" : "man"}, visits the clinic. ${variant.findings}`;
    const profile: ApprovedInstantiationProfile = {
      id: `profile.${suffix}.${variant.artProfile}`, prototypeDemographics: demographics,
      chiefComplaint: variant.chiefComplaint, presentation,
    };
    const clinicalClaimIds = [...new Set([...Object.values(variant.evidence).flat(), ...variant.choices.flatMap(choice => choice.claimIds)])];
    const sourceLabels = labelsForClaims(clinicalClaimIds);
    const releasePointId = { 1: "release.l1.minor_procedure", 2: "release.l2.endoscopy", 3: "release.l3.ambulatory_or_qi" }[spec.earliestFacilityStage];
    const answerChoices = variant.choices.map((choice, index) => ({
      id: `choice.${variant.slug}.${choice.slug}`, label: choice.label,
      isCorrect: index === 0, rationale: choice.rationale, serviceRequest: null,
    }));
    questions.push({
      ...NEEDS_REVIEW, id: questionId, conceptId: spec.id,
      patientPresentationVariantId: `presentation.${suffix}`, patientPresentation: presentation,
      approvedInstantiationProfiles: [profile], stem: variant.stem,
      answerChoices: answerChoices.map(({ serviceRequest: _service, ...choice }) => ({
        ...choice, distractorRationale: choice.isCorrect ? null : choice.rationale,
      })),
      explanation: variant.explanation, teachingPoint: variant.teachingPoint,
      supportingEvidenceClaimIds: clinicalClaimIds, agentReview: AGENT_REVIEW,
    });
    cases.push({
      id: caseId, displayName: spec.displayName, patientPresentationVariantId: `presentation.${suffix}`,
      releasePointId, patientDisplayName: variant.patientName, prototypeDemographics: demographics,
      chiefComplaint: variant.chiefComplaint, presentation, approvedInstantiationProfiles: [profile],
      tutorialEligible: false, routineEligible: true, earliestFacilityStage: spec.earliestFacilityStage,
      requiredClinicalSetting: "clinic", requiredCapabilityIds: [], rewardTierId: "reward.clinic_basic", sourceLabels,
      decisionNodes: [{
        id: nodeId, questionVariantId: questionId, primaryConceptId: spec.id, stem: variant.stem,
        answerChoices, shuffleAnswers: true, explanation: variant.explanation, teachingPoint: variant.teachingPoint,
        sourceLabels, resultGateAfter: null,
        terminalDispositions: answerChoices.filter(choice => !choice.isCorrect).map(choice => ({
          answerChoiceId: choice.id, kind: "no_terminal_outcome",
          consequenceNarrative: "Review the teaching point and choice rationales.",
          clinicalRationale: choice.rationale,
          sourceLabels: labelsForClaims(variant.choices.find(item => item.label === choice.label)!.claimIds),
        })),
      }],
      learningSummary: "Review the teaching point and choice rationales for this clinic visit.",
    });
    timingEntries.push({
      caseId, nodeId, questionVariantId: questionId,
      classification: variant.choices.some(choice => choice.timingProfileId)
        ? { kind: "test_choices", choices: variant.choices.map((choice, index) => ({
          choiceId: answerChoices[index]!.id, choiceLabel: choice.label,
          timing: choice.timingProfileId ? { kind: "test", timingProfileId: choice.timingProfileId } : { kind: "no_test" },
        })) }
        : { kind: "no_test" },
    });
    caseReviews.push({
      ...NEEDS_REVIEW, caseId, educationalTier: spec.educationalTier, acuity: variant.acuity ?? "stable",
      earliestFacilityStage: spec.earliestFacilityStage, requiredClinicalSetting: "clinic",
      requiredCapabilityIds: [], profileValuesBasis: "editorial_simulation_not_prevalence_or_diagnostic_threshold",
      agentReview: AGENT_REVIEW,
    } as const);
    adultContexts.push({
      ...NEEDS_REVIEW, id: `adult.${suffix}`, phenotypeId: `phenotype.${suffix}`, caseId, profileId: profile.id,
      patientName: variant.patientName, patientStillId: art.stillId, prototypeDemographics: demographics,
      metadataSource: "tools/character-mapping/patient-demographics20-v4/roster.json",
      profileValuesBasis: "editorial_art_contract_not_disease_probability",
      evidenceClaimIds: [...variant.evidence.presentation], agentReview: AGENT_REVIEW,
    } as const);
    statementMappings.push({
      ...NEEDS_REVIEW, id: `mapping.${suffix}`, caseId, questionVariantId: questionId,
      presentation: [...variant.evidence.presentation], stem: [...variant.evidence.stem],
      explanation: [...variant.evidence.explanation], teachingPoint: [...variant.evidence.teachingPoint],
      choices: variant.choices.map((choice, index) => ({
        answerChoiceId: answerChoices[index]!.id, labelAndRationale: [...choice.claimIds],
        proposalStatus: index === 0 ? "supported_answer" : "rejected_distractor",
      })),
      editorialFields: ["fictional names", "art-matched age and sex", "supplied individual findings", "narrative order"],
      agentReview: AGENT_REVIEW,
    });
  }
  return {
    concepts,
    testedConcepts: concepts.map(({ id, displayName, learningObjective, earliestFacilityStage, conceptType }) => ({
      id, displayName, learningObjective, earliestFacilityStage, conceptType,
    })),
    questions, cases, caseReviews, adultContexts, statementMappings, timingEntries,
  };
}
