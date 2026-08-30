import {
  createDeterministicRandom,
  deterministicInteger,
  RANDOM_STREAMS,
} from "./randomness";
import type {
  PixelAppearanceDescriptor,
  PixelAppearanceVariant,
  PatientIdentityId,
  PatientSexLabel,
} from "./types";
import {
  patientRosterEligibleEntries,
  patientRosterEntryById,
} from "./patientAppearanceCatalog";

const BODY_SHAPES = ["compact", "average", "broad", "tall"] as const;
const HAIR_STYLES = ["none", "short", "parted", "curly", "bun"] as const;
const FACE_STYLES = ["round", "square", "long"] as const;
const OUTFIT_STYLES = ["plain", "striped", "checked", "coat"] as const;
const ACCESSORIES = ["none", "glasses", "badge", "headband"] as const;

const STAFF_NAMES = [
  "Alex",
  "Avery",
  "Bailey",
  "Blake",
  "Casey",
  "Dakota",
  "Drew",
  "Emery",
  "Finley",
  "Harper",
  "Jamie",
  "Jordan",
  "Kai",
  "Logan",
  "Morgan",
  "Parker",
  "Quinn",
  "Reese",
  "Riley",
  "Rowan",
  "Sam",
  "Taylor",
] as const;

const PATIENT_NEUTRAL_FIRST_NAMES = [
  "Avery",
  "Casey",
  "Devon",
  "Emery",
  "Jamie",
  "Jordan",
  "Morgan",
  "Quinn",
  "Reese",
  "Riley",
  "Robin",
  "Taylor",
] as const;

const PATIENT_FEMININE_FIRST_NAMES = [
  "Amelia",
  "Ava",
  "Chloe",
  "Elena",
  "Grace",
  "Hannah",
  "Isabella",
  "Julia",
  "Leah",
  "Lily",
  "Maya",
  "Natalie",
  "Nora",
  "Olivia",
  "Sophia",
  "Zoe",
] as const;

const PATIENT_MASCULINE_FIRST_NAMES = [
  "Adam",
  "Benjamin",
  "Caleb",
  "Daniel",
  "Elijah",
  "Ethan",
  "Henry",
  "Isaac",
  "James",
  "Liam",
  "Lucas",
  "Mateo",
  "Noah",
  "Oliver",
  "Samuel",
  "Theo",
] as const;

const PATIENT_LAST_NAMES = [
  "Ash",
  "Bell",
  "Brook",
  "Clay",
  "Day",
  "Field",
  "Gray",
  "Hart",
  "Lane",
  "Reed",
  "Stone",
  "Vale",
] as const;

export type PixelRoleStyle = NonNullable<
  PixelAppearanceDescriptor["roleStyle"]
>;

export type { PatientSexLabel } from "./types";

export interface PatientAppearanceProfile {
  readonly sexLabel?: PatientSexLabel;
  readonly ageYears?: number;
}

const ROLE_STYLES: readonly PixelRoleStyle[] = [
  "founder",
  "patient",
  "receptionist",
  "imaging_technician",
  "periop_nurse",
  "endoscopy_nurse",
  "endoscopist",
  "phlebotomist",
  "evs_worker",
  "glp1_np",
];

function boundedVariant(value: number): 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 {
  return Math.max(0, Math.min(9, Math.floor(value))) as
    | 0
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8
    | 9;
}

/**
 * Converts a persisted pre-golden-slice descriptor into the canonical visual
 * identity without rerolling it. The fallback values are derived only from
 * the saved appearance fields so reloads and migrations remain stable.
 */
export function normalizePixelAppearance(
  appearance: PixelAppearanceDescriptor,
  roleStyle: PixelRoleStyle = appearance.roleStyle ?? "patient",
): PixelAppearanceDescriptor {
  const bodyShapeIndex = BODY_SHAPES.indexOf(appearance.bodyShape);
  const hairStyleIndex = HAIR_STYLES.indexOf(appearance.hairStyle);
  const faceStyleIndex = FACE_STYLES.indexOf(appearance.faceStyle);
  const outfitStyleIndex = OUTFIT_STYLES.indexOf(appearance.outfitStyle);
  const accessoryIndex = ACCESSORIES.indexOf(appearance.accessory);
  return {
    ...appearance,
    skinTone:
      appearance.skinTone ??
      (((appearance.hairShade +
        faceStyleIndex +
        appearance.outfitShade) %
        4) as 0 | 1 | 2 | 3),
    headVariant:
      appearance.headVariant ??
      boundedVariant(
        hairStyleIndex * 2 +
          faceStyleIndex * 3 +
          accessoryIndex +
          appearance.hairShade,
      ),
    bodyVariant:
      appearance.bodyVariant ??
      boundedVariant(
        bodyShapeIndex * 2 +
          outfitStyleIndex * 3 +
          appearance.outfitShade,
      ),
    roleStyle: ROLE_STYLES.includes(roleStyle) ? roleStyle : "patient",
  };
}

export function roleStyleForStaffDefinition(
  staffRoleDefinitionId: string,
): PixelRoleStyle {
  switch (staffRoleDefinitionId) {
    case "staff.receptionist":
      return "receptionist";
    case "staff.imaging_technician":
      return "imaging_technician";
    case "staff.periop_nurse":
      return "periop_nurse";
    case "staff.endoscopy_nurse":
      return "endoscopy_nurse";
    case "staff.endoscopist":
      return "endoscopist";
    case "staff.phlebotomist":
      return "phlebotomist";
    case "staff.evs_worker":
      return "evs_worker";
    case "staff.glp1_np":
      return "glp1_np";
    default:
      // Unknown legacy definitions keep the original front-desk treatment.
      return "receptionist";
  }
}

export function createPixelAppearance(
  campaignSeed: string,
  subjectKind: "patient" | "staff",
  subjectId: string,
  roleStyle: PixelRoleStyle =
    subjectKind === "patient" ? "patient" : "receptionist",
): PixelAppearanceDescriptor {
  const streamId =
    subjectKind === "patient"
      ? RANDOM_STREAMS.patientAppearance
      : RANDOM_STREAMS.staffAppearance;
  const random = createDeterministicRandom(
    campaignSeed,
    streamId,
    `${subjectId}:pixel-avatar.v1`,
  );

  const coherentVariant = boundedVariant(random.integer(10));
  return normalizePixelAppearance({
    version: "pixel-avatar.v1",
    bodyShape: BODY_SHAPES[random.integer(BODY_SHAPES.length)]!,
    hairStyle: HAIR_STYLES[random.integer(HAIR_STYLES.length)]!,
    hairShade: random.integer(4) as 0 | 1 | 2 | 3,
    faceStyle: FACE_STYLES[random.integer(FACE_STYLES.length)]!,
    outfitStyle: OUTFIT_STYLES[random.integer(OUTFIT_STYLES.length)]!,
    outfitShade: random.integer(4) as 0 | 1 | 2 | 3,
    accessory: ACCESSORIES[random.integer(ACCESSORIES.length)]!,
    skinTone: random.integer(4) as 0 | 1 | 2 | 3,
    // The renderer's authored human identity has a matched neck/skin/body
    // family. This is display identity only, never a clinical selector.
    headVariant: coherentVariant,
    bodyVariant: coherentVariant,
    roleStyle,
  }, roleStyle);
}

function variantWithinFamily(
  variant: PixelAppearanceVariant | undefined,
  familyOffset: 0 | 10,
): PixelAppearanceVariant {
  return (familyOffset + ((variant ?? 0) % 10)) as PixelAppearanceVariant;
}

/**
 * Aligns the human presentation of a patient avatar with the authored chart
 * sex label. This changes presentation only; it is not a clinical selector and
 * has no effect on case choice, simulation, scoring, or demographics.
 */
export function normalizePatientAppearanceForSex(
  appearance: PixelAppearanceDescriptor,
  sexLabel?: PatientSexLabel,
  ageYears?: number,
  identitySelectionKey = "legacy-patient-appearance.v1",
): PixelAppearanceDescriptor {
  const normalized = normalizePixelAppearance(appearance, "patient");
  const legacyVariant = normalized.headVariant ?? 0;
  const eligible = patientRosterEligibleEntries(sexLabel, ageYears);
  const selectedIdentity = patientRosterEntryById(normalized.patientIdentityId)
    ? normalized.patientIdentityId
    : eligible.length > 0
      ? eligible[deterministicInteger(
          identitySelectionKey,
          RANDOM_STREAMS.patientAppearance,
          `legacy-roster:${legacyVariant}:${sexLabel ?? "unspecified"}:${ageYears ?? "unknown"}`,
          eligible.length,
        )]?.id
      : undefined;
  const withIdentity = {
    ...normalized,
    ...(selectedIdentity ? { patientIdentityId: selectedIdentity } : {}),
  };
  if (sexLabel === "Female") {
    return {
      ...withIdentity,
      headVariant: variantWithinFamily(withIdentity.headVariant, 10),
      bodyVariant: variantWithinFamily(withIdentity.headVariant, 10),
    };
  }
  if (sexLabel === "Male") {
    return {
      ...withIdentity,
      headVariant: variantWithinFamily(withIdentity.headVariant, 0),
      bodyVariant: variantWithinFamily(withIdentity.headVariant, 0),
    };
  }
  return withIdentity;
}

export function createPatientPixelAppearance(
  campaignSeed: string,
  encounterId: string,
  profile: PatientAppearanceProfile | PatientSexLabel = {},
  selectionScope: "patient" | "ambient-pedestrian" = "patient",
): PixelAppearanceDescriptor {
  const normalizedProfile: PatientAppearanceProfile =
    typeof profile === "string" ? { sexLabel: profile } : profile;
  const { sexLabel, ageYears } = normalizedProfile;
  const base = createPixelAppearance(
    campaignSeed,
    "patient",
    encounterId,
    "patient",
  );
  if (sexLabel === "Female" || sexLabel === "Male") {
    return normalizePatientAppearanceForSex(base, sexLabel, ageYears, `${campaignSeed}:${selectionScope}:${encounterId}:patient-roster.v1`);
  }

  // When the chart intentionally does not specify sex, keep one coherent
  // human presentation family without implying a chart value.
  const familyOffset =
    deterministicInteger(
      campaignSeed,
      RANDOM_STREAMS.patientAppearance,
      `${encounterId}:unspecified-presentation-family.v1`,
      2,
    ) === 0
      ? 0
      : 10;
  const normalized = normalizePixelAppearance(base, "patient");
  const eligible = patientRosterEligibleEntries(undefined, ageYears);
  const patientIdentityId = eligible.length > 0
    ? eligible[deterministicInteger(
        campaignSeed,
        RANDOM_STREAMS.patientAppearance,
        `${selectionScope}:${encounterId}:patient-roster.unspecified.v1`,
        eligible.length,
      )]?.id as PatientIdentityId | undefined
    : undefined;
  return {
    ...normalized,
    headVariant: variantWithinFamily(normalized.headVariant, familyOffset),
    bodyVariant: variantWithinFamily(normalized.headVariant, familyOffset),
    ...(patientIdentityId ? { patientIdentityId } : {}),
  };
}

export function createStaffDisplayName(
  campaignSeed: string,
  employeeId: string,
): string {
  const random = createDeterministicRandom(
    campaignSeed,
    RANDOM_STREAMS.staffAppearance,
    `${employeeId}:display-name.v1`,
  );
  return STAFF_NAMES[random.integer(STAFF_NAMES.length)]!;
}

export function createPatientDisplayName(
  campaignSeed: string,
  encounterId: string,
  sexLabel?: PatientSexLabel,
): string {
  const random = createDeterministicRandom(
    campaignSeed,
    RANDOM_STREAMS.patientIdentity,
    `${encounterId}:display-name.v1`,
  );
  const firstNames =
    sexLabel === "Female"
      ? PATIENT_FEMININE_FIRST_NAMES
      : sexLabel === "Male"
        ? PATIENT_MASCULINE_FIRST_NAMES
        : PATIENT_NEUTRAL_FIRST_NAMES;
  const firstName = firstNames[random.integer(firstNames.length)]!;
  const lastName =
    PATIENT_LAST_NAMES[random.integer(PATIENT_LAST_NAMES.length)]!;
  return `${firstName} ${lastName}`;
}
