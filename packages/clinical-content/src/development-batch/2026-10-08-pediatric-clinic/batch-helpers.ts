import { z } from "zod";
import type { AuthoredClinicalRecord, QuestionVariant } from "../../pilot-schema";
import {
  syntheticClinicalCaseSchema,
  type AnswerChoiceTimingRegistryEntry,
  type ApprovedInstantiationProfile,
  type CaseExhibit,
  type PediatricPatientProfile,
  type SyntheticClinicalCase,
  type TestedConcept,
} from "../../schema";

export const BATCH_CONTENT_VERSION = "development-batch.2026-10-08.pediatric-clinic.1";
export const CHECKED_ON = "2026-10-08";
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

/** Uses the concurrently introduced foundation marker; grants no clinical approval. */
export const PEDIATRIC_PROFILE = {
  version: "pediatric-patient-profile.v1",
  requiresParent: true,
  clinicalScope: "outpatient",
} as const satisfies PediatricPatientProfile;

/** Local draft validation only; narrows the foundation's broader runtime schema. */
export const pediatricDraftCaseSchema = syntheticClinicalCaseSchema.safeExtend({
  earliestFacilityStage: z.literal(4),
}).superRefine((item, context) => {
  const issue = (path: (string | number)[], message: string) => context.addIssue({ code: "custom", path, message });
  const profiles = item.approvedInstantiationProfiles ?? [];
  if (profiles.length !== 1) issue(["approvedInstantiationProfiles"], "This draft requires one constrained child profile.");
  if (!item.pediatricProfile || profiles.some((profile) => !profile.pediatricProfile)) {
    issue(["pediatricProfile"], "Case and profile require the explicit parent-present outpatient pediatric marker.");
  }
  const demographicSets = [item.prototypeDemographics, ...profiles.map((profile) => profile.prototypeDemographics)];
  for (const demographics of demographicSets) {
    if (!demographics || demographics.ageYears < 5 || demographics.ageYears > 17 || demographics.sexLabel === "Not specified") {
      issue(["prototypeDemographics"], "Pediatric draft profiles require an explicit age 5-17 and sex matched to authored art metadata.");
    }
  }
  if (profiles[0] && JSON.stringify(profiles[0].prototypeDemographics) !== JSON.stringify(item.prototypeDemographics)) {
    issue(["approvedInstantiationProfiles"], "Case and constrained-profile demographics must match.");
  }
  if (item.prototypeVitalSigns || profiles.some((profile) => profile.prototypeVitalSigns)) {
    issue(["prototypeVitalSigns"], "This draft has no authored vital signs or adult-default vital overlay.");
  }
  if (item.requiredClinicalSetting !== "clinic" || item.releasePointId !== "release.l4.pediatrics" ||
      item.requiredCapabilityIds.length !== 1 || item.requiredCapabilityIds[0] !== "capability.pediatric_examination") {
    issue(["requiredClinicalSetting"], "This draft is restricted to the pediatric outpatient examination contract.");
  }
  if (item.participant || item.tutorialEligible || item.decisionNodes.length !== 1) {
    issue(["decisionNodes"], "Pediatric draft encounters are one-decision child clinic visits.");
  }
  for (const [index, node] of item.decisionNodes.entries()) {
    if (node.resultGateAfter || node.answerChoices.some((choice) => choice.serviceRequest) || !node.shuffleAnswers) {
      issue(["decisionNodes", index], "This standalone draft permits shuffled referral/counseling choices, without tests or procedure services.");
    }
  }
});

/** Age and sex come from authored roster metadata, never visual or ethnicity inference. */
export const PEDIATRIC_ART_PROFILES = {
  girl6: { stillId: "level3-roster-v2.021", ageYears: 6, sexLabel: "Female" },
  boy5: { stillId: "level3-roster-v2.022", ageYears: 5, sexLabel: "Male" },
  girl7: { stillId: "level3-roster-v2.023", ageYears: 7, sexLabel: "Female" },
  boy6: { stillId: "level3-roster-v2.024", ageYears: 6, sexLabel: "Male" },
  girl9: { stillId: "level3-roster-v2.025", ageYears: 9, sexLabel: "Female" },
  boy10: { stillId: "level3-roster-v2.026", ageYears: 10, sexLabel: "Male" },
  girl11: { stillId: "level3-roster-v2.027", ageYears: 11, sexLabel: "Female" },
  boy12: { stillId: "level3-roster-v2.028", ageYears: 12, sexLabel: "Male" },
  girl14: { stillId: "level3-roster-v2.029", ageYears: 14, sexLabel: "Female" },
  boy14: { stillId: "level3-roster-v2.030", ageYears: 14, sexLabel: "Male" },
  girl16: { stillId: "level3-roster-v2.031", ageYears: 16, sexLabel: "Female" },
  boy17: { stillId: "level3-roster-v2.032", ageYears: 17, sexLabel: "Male" },
} as const;

export interface DevelopmentConcept extends TestedConcept, AuthoredClinicalRecord {
  educationalTier: 0 | 1;
  evidenceClaimIds: string[];
  identityDisposition: "new_objective" | "reuse_unchanged_objective";
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
  /** Claims explain acceptance/rejection of this proposed plan or diagnosis. */
  claimIds: string[];
}

export interface VariantSpec {
  slug: string;
  patientName: string;
  artProfile: keyof typeof PEDIATRIC_ART_PROFILES;
  parentName: string;
  parentRelationship: "mother" | "father";
  chiefComplaint: string;
  /** Clinical narrative after the generated, named clinic introduction. */
  findings: string;
  stem: string;
  /** Authoring order is key first; runtime nodes always shuffle. */
  choices: [ChoiceSpec, ChoiceSpec, ChoiceSpec, ChoiceSpec];
  explanation: string;
  teachingPoint: string;
  exhibit?: CaseExhibit;
  evidence: {
    presentation: string[];
    stem: string[];
    explanation: string[];
    teachingPoint: string[];
    exhibit?: string[];
  };
  acuity?: "stable" | "urgent_stable";
}

export interface ConceptSpec {
  id: string;
  displayName: string;
  learningObjective: string;
  conceptType: TestedConcept["conceptType"];
  educationalTier: 0 | 1;
  evidenceClaimIds: string[];
  reusedStage?: 0;
  variants: [VariantSpec, VariantSpec];
}

export function buildFamily(specs: ConceptSpec[], labelsForClaims: (ids: string[]) => string[]) {
  const concepts: DevelopmentConcept[] = specs.map((spec) => ({
    ...NEEDS_REVIEW,
    id: spec.id,
    displayName: spec.displayName,
    learningObjective: spec.learningObjective,
    conceptType: spec.conceptType,
    earliestFacilityStage: spec.reusedStage ?? 4,
    educationalTier: spec.educationalTier,
    evidenceClaimIds: [...spec.evidenceClaimIds],
    identityDisposition: spec.reusedStage === 0 ? "reuse_unchanged_objective" : "new_objective",
    agentReview: AGENT_REVIEW,
  }));
  const questions: DevelopmentQuestion[] = [];
  const cases: SyntheticClinicalCase[] = [];
  const timingEntries: AnswerChoiceTimingRegistryEntry[] = [];
  const caseReviews = [];
  const familyContexts = [];
  const statementMappings = [];

  for (const spec of specs) for (const [variantIndex, variant] of spec.variants.entries()) {
    const suffix = `pediatric-clinic.${variant.slug}`;
    const caseId = `case.${suffix}`;
    const questionId = `question.${suffix}.v${variantIndex + 1}`;
    const nodeId = `node.${suffix}.1`;
    const art = PEDIATRIC_ART_PROFILES[variant.artProfile];
    const demographics = { ageYears: art.ageYears, sexLabel: art.sexLabel };
    const childWord = art.sexLabel === "Female" ? "girl" : "boy";
    const pronoun = art.sexLabel === "Female" ? "her" : "his";
    const article = art.ageYears === 11 ? "an" : "a";
    const presentation = `${variant.patientName}, ${article} ${art.ageYears}-year-old ${childWord}, visits the clinic with ${pronoun} ${variant.parentRelationship}, ${variant.parentName}, who remains in the same room throughout the visit. ${variant.findings}`;
    const profile: ApprovedInstantiationProfile = {
      id: `profile.${suffix}.${variant.artProfile}`,
      pediatricProfile: PEDIATRIC_PROFILE,
      prototypeDemographics: demographics,
      chiefComplaint: variant.chiefComplaint,
      presentation,
    };
    // No adult-default vitals, demographic distributions, or generated test results.
    const clinicalClaimIds = [...new Set([
      ...Object.values(variant.evidence).flat(),
      ...variant.choices.flatMap((choice) => choice.claimIds),
    ])];
    const sourceLabels = labelsForClaims(clinicalClaimIds);
    const answerChoices = variant.choices.map((choice, index) => ({
      id: `choice.${variant.slug}.${choice.slug}`,
      label: choice.label,
      isCorrect: index === 0,
      rationale: choice.rationale,
      serviceRequest: null,
    }));
    questions.push({
      ...NEEDS_REVIEW,
      id: questionId,
      conceptId: spec.id,
      patientPresentationVariantId: `presentation.${suffix}`,
      patientPresentation: presentation,
      approvedInstantiationProfiles: [profile],
      stem: variant.stem,
      answerChoices: answerChoices.map(({ serviceRequest: _service, ...choice }) => ({
        ...choice,
        distractorRationale: choice.isCorrect ? null : choice.rationale,
      })),
      explanation: variant.explanation,
      teachingPoint: variant.teachingPoint,
      ...(variant.exhibit ? { exhibit: variant.exhibit } : {}),
      supportingEvidenceClaimIds: clinicalClaimIds,
      agentReview: AGENT_REVIEW,
    });
    cases.push({
      id: caseId,
      pediatricProfile: PEDIATRIC_PROFILE,
      displayName: spec.displayName,
      patientPresentationVariantId: `presentation.${suffix}`,
      releasePointId: "release.l4.pediatrics",
      patientDisplayName: variant.patientName,
      prototypeDemographics: demographics,
      chiefComplaint: variant.chiefComplaint,
      presentation,
      approvedInstantiationProfiles: [profile],
      tutorialEligible: false,
      routineEligible: true,
      earliestFacilityStage: 4,
      requiredClinicalSetting: "clinic",
      requiredCapabilityIds: ["capability.pediatric_examination"],
      rewardTierId: "reward.clinic_basic",
      sourceLabels,
      decisionNodes: [{
        id: nodeId,
        questionVariantId: questionId,
        primaryConceptId: spec.id,
        stem: variant.stem,
        answerChoices,
        shuffleAnswers: true,
        explanation: variant.explanation,
        teachingPoint: variant.teachingPoint,
        ...(variant.exhibit ? { exhibit: variant.exhibit } : {}),
        sourceLabels,
        resultGateAfter: null,
        terminalDispositions: answerChoices.filter((choice) => !choice.isCorrect).map((choice) => ({
          answerChoiceId: choice.id,
          kind: "no_terminal_outcome",
          consequenceNarrative: "Review the teaching point and choice rationales.",
          clinicalRationale: choice.rationale,
          sourceLabels: labelsForClaims(variant.choices.find((item) => item.label === choice.label)!.claimIds),
        })),
      }],
      learningSummary: "Review the teaching point and choice rationales for this clinic visit.",
    });
    timingEntries.push({ caseId, nodeId, questionVariantId: questionId, classification: { kind: "no_test" } });
    caseReviews.push({
      ...NEEDS_REVIEW,
      caseId,
      educationalTier: spec.educationalTier,
      acuity: variant.acuity ?? "stable",
      earliestFacilityStage: 4,
      requiredClinicalSetting: "clinic",
      requiredCapabilityIds: ["capability.pediatric_examination"],
      profileValuesBasis: "editorial_simulation_not_prevalence_or_diagnostic_threshold",
      agentReview: AGENT_REVIEW,
    } as const);
    familyContexts.push({
      ...NEEDS_REVIEW,
      id: `family.${suffix}`,
      phenotypeId: `phenotype.${suffix}`,
      caseId,
      profileId: profile.id,
      childName: variant.patientName,
      childStillId: art.stillId,
      prototypeDemographics: demographics,
      parentName: variant.parentName,
      parentRelationship: variant.parentRelationship,
      parentCount: 1,
      parentPlacement: "same_room_throughout",
      metadataSource: "tools/character-mapping/level3-roster-complete-v2/roster.json",
      profileValuesBasis: "editorial_art_contract_not_disease_probability",
      evidenceClaimIds: [...variant.evidence.presentation],
      agentReview: AGENT_REVIEW,
    } as const);
    statementMappings.push({
      ...NEEDS_REVIEW,
      id: `mapping.${suffix}`,
      caseId,
      questionVariantId: questionId,
      presentation: [...variant.evidence.presentation],
      stem: [...variant.evidence.stem],
      explanation: [...variant.evidence.explanation],
      teachingPoint: [...variant.evidence.teachingPoint],
      ...(variant.exhibit ? { exhibit: [...(variant.evidence.exhibit ?? [])] } : {}),
      choices: variant.choices.map((choice, index) => ({
        answerChoiceId: answerChoices[index]!.id,
        labelAndRationale: [...choice.claimIds],
        proposalStatus: index === 0 ? "supported_answer" : "rejected_distractor",
      })),
      editorialFields: ["fictional names", "art-matched age and sex", "parent presence required by owner prototype", "narrative order"],
      agentReview: AGENT_REVIEW,
    });
  }
  return {
    concepts,
    testedConcepts: concepts.map(({ id, displayName, learningObjective, earliestFacilityStage, conceptType }) => ({
      id, displayName, learningObjective, earliestFacilityStage, conceptType,
    })),
    questions, cases, caseReviews, familyContexts, statementMappings, timingEntries,
  };
}
