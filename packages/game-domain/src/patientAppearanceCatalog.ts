import type { PatientIdentityId, PatientSexLabel } from "./types";

/** Adult-only visual age bands used to match an already-frozen vignette. */
export type PatientVisualAgeBand =
  | "young_adult"
  | "adult"
  | "middle_aged"
  | "older_adult";

export interface PatientAppearanceCatalogEntry {
  readonly id: PatientIdentityId;
  readonly human: true;
  /** Canonical original raster poses are generated in the patient-v1 pack. */
  readonly artStatus: "authored";
  /** Presentation matching only; never used to select a clinical case. */
  readonly compatibleSexLabel: Exclude<PatientSexLabel, "Not specified">;
  readonly ageBand: PatientVisualAgeBand;
  /** Stable design brief for the future canonical full-actor asset package. */
  readonly visualBrief: string;
}

const ADULT_PATIENT_ROSTER_ROWS = [
  ["Female", "young_adult", "short curls, round glasses, patterned overshirt"],
  ["Female", "young_adult", "long braid, soft cardigan, practical trainers"],
  ["Female", "young_adult", "cropped textured hair, denim jacket, tote strap"],
  ["Female", "young_adult", "wavy bob, small hoop earrings, zip hoodie"],
  ["Female", "young_adult", "high ponytail, athletic jacket, bright sneakers"],
  ["Female", "young_adult", "headwrap, collared shirt, cross-body bag"],
  ["Female", "adult", "shoulder-length waves, utility coat, watch"],
  ["Female", "adult", "straight bob, square glasses, knit sweater"],
  ["Female", "adult", "loose curls, long cardigan, ankle boots"],
  ["Female", "adult", "low ponytail, striped blouse, canvas shoes"],
  ["Female", "adult", "loc bun, light jacket, simple pendant"],
  ["Female", "adult", "side-parted hair, floral scarf, practical handbag"],
  ["Female", "middle_aged", "short silver curls, framed glasses, wool vest"],
  ["Female", "middle_aged", "braided updo, long coat, small hearing aid"],
  ["Female", "middle_aged", "shoulder-length straight hair, denim overshirt, loafers"],
  ["Female", "middle_aged", "textured pixie cut, tunic sweater, watch"],
  ["Female", "middle_aged", "long waves with gray streak, scarf, walking shoes"],
  ["Female", "middle_aged", "covered hair, tailored jacket, patterned tote"],
  ["Female", "older_adult", "soft white bob, reading glasses, warm cardigan"],
  ["Female", "older_adult", "short curled gray hair, cane, quilted vest"],
  ["Female", "older_adult", "silver braid, long coat, low-heeled shoes"],
  ["Female", "older_adult", "cropped gray curls, hearing aid, knit shawl"],
  ["Female", "older_adult", "neat headscarf, button coat, walking stick"],
  ["Female", "older_adult", "short dark hair with silver temples, glasses, tote"],
  ["Female", "older_adult", "wavy gray shoulder cut, layered blouse, sensible shoes"],
  ["Male", "young_adult", "close-cropped curls, varsity jacket, trainers"],
  ["Male", "young_adult", "side-parted hair, glasses, canvas jacket"],
  ["Male", "young_adult", "short twists, zip hoodie, backpack strap"],
  ["Male", "young_adult", "tousled waves, utility overshirt, sneakers"],
  ["Male", "young_adult", "short fade, knit beanie, denim jacket"],
  ["Male", "young_adult", "curly hair, checked shirt, messenger bag"],
  ["Male", "adult", "neat beard, collared overshirt, wristwatch"],
  ["Male", "adult", "medium waves, round glasses, field jacket"],
  ["Male", "adult", "short locs, patterned sweater, sturdy boots"],
  ["Male", "adult", "bare scalp, close beard, zip vest"],
  ["Male", "adult", "side sweep, small hearing device, light coat"],
  ["Male", "adult", "textured crop, hoodie under jacket, trainers"],
  ["Male", "middle_aged", "silver temples, moustache, corduroy jacket"],
  ["Male", "middle_aged", "short curls, rectangular glasses, work shirt"],
  ["Male", "middle_aged", "bare scalp, trimmed beard, knit vest"],
  ["Male", "middle_aged", "long tied-back hair, flannel overshirt, boots"],
  ["Male", "middle_aged", "wave cut, broad-frame glasses, light raincoat"],
  ["Male", "middle_aged", "short gray beard, cap in hand, relaxed sweater"],
  ["Male", "older_adult", "white side part, glasses, cardigan and slacks"],
  ["Male", "older_adult", "silver curls, cane, button coat"],
  ["Male", "older_adult", "bare scalp, white moustache, walking shoes"],
  ["Male", "older_adult", "thin gray braid, reading glasses, wool jacket"],
  ["Male", "older_adult", "short gray waves, hearing aid, quilted vest"],
  ["Male", "older_adult", "salt-and-pepper beard, knit cap, sturdy coat"],
  ["Male", "older_adult", "neat silver crop, small glasses, plaid overshirt"],
] as const satisfies readonly (readonly [
  Exclude<PatientSexLabel, "Not specified">,
  PatientVisualAgeBand,
  string,
])[];

export const AUTHORED_ADULT_PATIENT_ROSTER = ADULT_PATIENT_ROSTER_ROWS.map(
  ([compatibleSexLabel, ageBand, visualBrief], index) => ({
    id: `patient.adult.${String(index + 1).padStart(3, "0")}` as PatientIdentityId,
    human: true,
    artStatus: "authored",
    compatibleSexLabel,
    ageBand,
    visualBrief,
  }),
) as readonly PatientAppearanceCatalogEntry[];

export const AUTHORED_ADULT_PATIENT_ROSTER_SIZE = 50;

export function patientVisualAgeBand(ageYears: number | undefined): PatientVisualAgeBand | null {
  if (!Number.isInteger(ageYears) || ageYears === undefined || ageYears < 18) return null;
  if (ageYears <= 29) return "young_adult";
  if (ageYears <= 44) return "adult";
  if (ageYears <= 64) return "middle_aged";
  return "older_adult";
}

export function isAuthoredAdultPatientIdentity(
  identityId: unknown,
): identityId is PatientIdentityId {
  return typeof identityId === "string" && AUTHORED_ADULT_PATIENT_ROSTER.some((entry) => entry.id === identityId);
}

/** Selection eligibility only. It receives demographics after case freezing. */
export function patientRosterEligibleEntries(
  sexLabel?: PatientSexLabel,
  ageYears?: number,
): readonly PatientAppearanceCatalogEntry[] {
  // This package is intentionally adult-only. Returning no entry lets callers
  // retain their legacy renderer rather than falsely displaying a child as a
  // member of the adult roster before pediatric art is approved.
  if (ageYears !== undefined && ageYears < 18) return [];
  const sexEligible = sexLabel === "Female" || sexLabel === "Male"
    ? AUTHORED_ADULT_PATIENT_ROSTER.filter((entry) => entry.compatibleSexLabel === sexLabel)
    : AUTHORED_ADULT_PATIENT_ROSTER;
  const ageBand = patientVisualAgeBand(ageYears);
  if (!ageBand) return sexEligible;
  const ageEligible = sexEligible.filter((entry) => entry.ageBand === ageBand);
  return ageEligible.length > 0 ? ageEligible : sexEligible;
}

export function patientRosterEntryById(
  identityId: PatientIdentityId | undefined,
): PatientAppearanceCatalogEntry | undefined {
  return AUTHORED_ADULT_PATIENT_ROSTER.find((entry) => entry.id === identityId);
}
