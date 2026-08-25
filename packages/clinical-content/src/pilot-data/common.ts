import type {
  AuthoredClinicalRecord,
  PresentationPhenotype,
  QuestionAnswer,
  QuestionVariant,
} from "../pilot-schema";

export const PILOT_CONTENT_VERSION = "pilot.2026-07-29.4";

export const PILOT_DRAFT = {
  contentVersion: PILOT_CONTENT_VERSION,
  reviewStatus: "needs_clinician_review",
  aiAssistedDrafting: true,
  lastClinicianReview: null,
} as const satisfies AuthoredClinicalRecord;

export const GENERAL_ADULT_AGE_BANDS = [
  {
    label: "Broad adult pilot range",
    minimumYears: 18,
    maximumYears: 79,
    basis: "editorial_general_adult",
  },
] as const satisfies PresentationPhenotype["evidenceSupportedAgeBands"];

export const GENERAL_ADULT_SEX_POLICY = {
  kind: "general_adult_editorial",
  allowed: ["Female", "Male"],
  rationale:
    "Balanced disease-independent editorial variation; no clinical prevalence claim and no race or ethnicity input.",
} as const satisfies PresentationPhenotype["sexGenerationPolicy"];

export const BROAD_ADULT_BMI_POLICY = {
  kind: "broad_editorial_distribution",
  minimum: 18,
  maximum: 40,
  rationale:
    "Broad editorial variation only; BMI does not select the diagnosis and is not a clinical probability.",
} as const satisfies PresentationPhenotype["bmiGenerationPolicy"];

export const EQUAL_EDITORIAL_WEIGHT = {
  value: 1,
  rationale:
    "Equal pilot-review exposure; this is an editorial simulation choice, not claimed prevalence.",
  basis: "editorial",
} as const satisfies PresentationPhenotype["simulationWeight"];

export function answer(
  id: string,
  label: string,
  isCorrect: boolean,
  distractorRationale: string | null,
): QuestionAnswer {
  return { id, label, isCorrect, distractorRationale };
}

export function questionVariant(input: {
  id: string;
  conceptId: string;
  stem: string;
  answerChoices: QuestionAnswer[];
  explanation: string;
  supportingEvidenceClaimIds: string[];
}): QuestionVariant {
  return {
    ...PILOT_DRAFT,
    ...input,
  };
}
