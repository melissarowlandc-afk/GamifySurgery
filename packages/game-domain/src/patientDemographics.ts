import { deterministicInteger, RANDOM_STREAMS } from "./randomness";
import { patientRosterEntryById } from "./patientAppearanceCatalog";
import type { PatientIdentityId, PatientSexLabel } from "./types";

export interface PatientDemographics {
  readonly ageYears: number;
  readonly sexLabel: PatientSexLabel;
}

export interface PatientDemographicCompletionInput {
  readonly caseId: string;
  readonly campaignSeed: string;
  readonly encounterId: string;
  readonly demographics?: Partial<PatientDemographics> | null;
  /** An existing saved roster identity may complete a medically unconstrained chart. */
  readonly savedPatientIdentityId?: PatientIdentityId;
}

const LEGACY_AGE_BY_VISUAL_BAND = {
  young_adult: 24,
  adult: 37,
  middle_aged: 52,
  older_adult: 70,
} as const;

function isDisplaySexLabel(value: unknown): value is Exclude<PatientSexLabel, "Not specified"> {
  return value === "Female" || value === "Male";
}

function validAgeYears(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0 && value <= 120;
}

function constrainedAgeYears(input: PatientDemographicCompletionInput): number | undefined {
  if (input.caseId === "case.fhh.evaluation-to-confirmed-management") return 27;
  if (input.caseId === "case.fhh.suggestive-results-confirmation") {
    return 18 + deterministicInteger(
      input.campaignSeed,
      RANDOM_STREAMS.patientIdentity,
      `${input.encounterId}|${input.caseId}:editorial-young-adult-age.v1`,
      12,
    );
  }
  if (input.caseId === "case.pancreatic-tail-adenocarcinoma.clinic-counseling") return 70;
  if (input.caseId === "case.choledochal-cyst.type-iva.2a") return 52;
  return undefined;
}

function constrainedSexLabel(
  input: PatientDemographicCompletionInput,
): Exclude<PatientSexLabel, "Not specified"> | undefined {
  return input.caseId === "case.anal-hsil.hpv.3d" ? "Female" : undefined;
}

/**
 * Completes display-only demographics after a clinical case is frozen. The
 * fallback stream is editorial only: it cannot select a clinical case or
 * influence scoring, medical content, or any disease probability.
 */
export function completePatientDemographics(
  input: PatientDemographicCompletionInput,
): PatientDemographics {
  const explicitAge = validAgeYears(input.demographics?.ageYears)
    ? input.demographics.ageYears
    : undefined;
  const explicitSex = isDisplaySexLabel(input.demographics?.sexLabel)
    ? input.demographics.sexLabel
    : undefined;
  const savedIdentity = patientRosterEntryById(input.savedPatientIdentityId);
  const constrainedAge = constrainedAgeYears(input);
  const constrainedSex = constrainedSexLabel(input);
  const ageYears = explicitAge
    ?? constrainedAge
    ?? (savedIdentity ? LEGACY_AGE_BY_VISUAL_BAND[savedIdentity.ageBand] : undefined)
    ?? (30 + deterministicInteger(
      input.campaignSeed,
      RANDOM_STREAMS.patientIdentity,
      `${input.encounterId}|${input.caseId}:editorial-adult-age.v1`,
      35,
    ));
  const sexLabel = explicitSex
    ?? constrainedSex
    ?? savedIdentity?.compatibleSexLabel
    ?? (deterministicInteger(
      input.campaignSeed,
      RANDOM_STREAMS.patientIdentity,
      `${input.encounterId}|${input.caseId}:editorial-sex.v1`,
      2,
    ) === 0 ? "Female" : "Male");
  return { ageYears, sexLabel };
}
