import {
  createDeterministicRandom,
  deterministicInteger,
  RANDOM_STREAMS,
} from "./randomness";
import type {
  PixelAppearanceDescriptor,
  PixelAppearanceVariant,
  CharacterStillId,
  GameState,
  PatientIdentityId,
  PatientSexLabel,
} from "./types";
import {
  characterStillCatalogEntryById,
  founderStillIdForAppearance,
  isCharacterStillId,
  legacyPatientStillId,
  patientStillEligibleEntries,
  staffStillEligibleEntries,
} from "./characterStillCatalog";
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
  "Blair",
  "Casey",
  "Cameron",
  "Devon",
  "Emery",
  "Frankie",
  "Hayden",
  "Jamie",
  "Jordan",
  "Kendall",
  "Lane",
  "Lennon",
  "Marley",
  "Morgan",
  "Nico",
  "Peyton",
  "Quinn",
  "Reese",
  "Riley",
  "Robin",
  "Sage",
  "Shiloh",
  "Taylor",
] as const;

const PATIENT_FEMININE_FIRST_NAMES = [
  "Amelia",
  "Ava",
  "Bianca",
  "Camille",
  "Chloe",
  "Clara",
  "Daphne",
  "Elise",
  "Elena",
  "Eva",
  "Fiona",
  "Georgia",
  "Grace",
  "Isabella",
  "Hannah",
  "Iris",
  "Jade",
  "Julia",
  "June",
  "Kara",
  "Kiara",
  "Leah",
  "Lena",
  "Lily",
  "Lucia",
  "Maeve",
  "Maya",
  "Mila",
  "Naomi",
  "Natalie",
  "Nora",
  "Olivia",
  "Paige",
  "Priya",
  "Renee",
  "Ruby",
  "Sophia",
  "Sadie",
  "Sienna",
  "Sabrina",
  "Tessa",
  "Valerie",
  "Vivian",
  "Yasmin",
  "Willa",
  "Ximena",
  "Zoe",
  "Zara",
] as const;

const PATIENT_MASCULINE_FIRST_NAMES = [
  "Adam",
  "Benjamin",
  "Cameron",
  "Caleb",
  "Colin",
  "Daniel",
  "Darius",
  "Elliot",
  "Emmett",
  "Elijah",
  "Ethan",
  "Felix",
  "Gabriel",
  "Gavin",
  "Henry",
  "Holden",
  "Hugo",
  "Isaac",
  "James",
  "Julian",
  "Jonah",
  "Kai",
  "Liam",
  "Lucas",
  "Malcolm",
  "Mateo",
  "Maxwell",
  "Micah",
  "Miles",
  "Noah",
  "Oliver",
  "Owen",
  "Paul",
  "Parker",
  "Quentin",
  "Rafael",
  "Samuel",
  "Roman",
  "Rowan",
  "Reid",
  "Silas",
  "Theo",
  "Tristan",
  "Victor",
  "Wesley",
  "Wyatt",
  "Xavier",
  "Zane",
] as const;

const PATIENT_LAST_NAMES = [
  "Ash",
  "Baker",
  "Bell",
  "Bennett",
  "Brook",
  "Caldwell",
  "Calloway",
  "Campbell",
  "Carter",
  "Clay",
  "Collins",
  "Dawson",
  "Day",
  "Delaney",
  "Ellis",
  "Everett",
  "Field",
  "Fletcher",
  "Foster",
  "Garner",
  "Gray",
  "Griffin",
  "Hart",
  "Holland",
  "Hudson",
  "Ingram",
  "Jordan",
  "Kendall",
  "Keene",
  "Kingston",
  "Lane",
  "Lawson",
  "Lennox",
  "Madden",
  "Marshall",
  "Mercer",
  "Monroe",
  "Nolan",
  "Oakley",
  "Parker",
  "Perry",
  "Quincy",
  "Reed",
  "Rhodes",
  "Rivers",
  "Rowe",
  "Sawyer",
  "Shepherd",
  "Sloan",
  "Stone",
  "Sutton",
  "Tanner",
  "Thorne",
  "Townsend",
  "Turner",
  "Vale",
  "Vaughn",
  "Walton",
  "West",
  "Whitaker",
  "Winter",
  "Wolfe",
  "Wright",
  "York",
  "Young",
  "Zimmerman",
  "Abbott",
  "Barlow",
  "Bishop",
  "Cohen",
  "Conrad",
  "Denton",
  "Donovan",
  "Easton",
  "Finch",
  "Gibson",
  "Hale",
  "Irwin",
  "Jarvis",
  "Keller",
  "Lowell",
  "Morris",
  "Nash",
  "Ortega",
  "Prescott",
  "Russo",
  "Salem",
  "Sellers",
  "Serrano",
  "Sinclair",
  "Sterling",
  "Talbot",
  "Temple",
  "Tobin",
  "Underwood",
  "Vance",
] as const;

export type PixelRoleStyle = NonNullable<
  PixelAppearanceDescriptor["roleStyle"]
>;

export type { PatientSexLabel } from "./types";

export interface PatientAppearanceProfile {
  readonly sexLabel?: PatientSexLabel;
  readonly ageYears?: number;
}

/** Names of patient-like actors currently visible in the facility. */
export function getPresentPatientDisplayNames(
  state: Pick<GameState, "encounters" | "serviceOperations" | "retailExternalActors">,
): string[] {
  return [
    ...Object.values(state.encounters)
      .filter((encounter) => encounter.patientLocation !== null)
      .map((encounter) => encounter.patientDisplayName),
    ...state.serviceOperations
      .filter((operation) => operation.actorKind === "visitor" && operation.location !== null)
      .map((operation) => operation.displayName),
    ...state.retailExternalActors
      .filter((actor) => actor.lifecycle !== "departed" && actor.location !== null)
      .map((actor) => actor.displayName),
  ];
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
  const { stillId: persistedStillId, ...appearanceWithoutStillId } = appearance;
  const bodyShapeIndex = BODY_SHAPES.indexOf(appearance.bodyShape);
  const hairStyleIndex = HAIR_STYLES.indexOf(appearance.hairStyle);
  const faceStyleIndex = FACE_STYLES.indexOf(appearance.faceStyle);
  const outfitStyleIndex = OUTFIT_STYLES.indexOf(appearance.outfitStyle);
  const accessoryIndex = ACCESSORIES.indexOf(appearance.accessory);
  const normalized: PixelAppearanceDescriptor = {
    ...appearanceWithoutStillId,
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
  const stillId = isCharacterStillId(persistedStillId)
    ? persistedStillId
    : roleStyle === "founder"
      ? founderStillIdForAppearance(normalized)
      : undefined;
  return { ...normalized, ...(stillId ? { stillId } : {}) };
}

export function selectPatientStillId(
  campaignSeed: string,
  selectionKey: string,
  profile: PatientAppearanceProfile,
  currentStillId?: string,
  legacyIdentityId?: PatientIdentityId,
): CharacterStillId | undefined {
  const eligible = patientStillEligibleEntries(profile.sexLabel, profile.ageYears);
  if (isCharacterStillId(currentStillId)) {
    const catalogEntry = characterStillCatalogEntryById(currentStillId);
    if (!catalogEntry || (catalogEntry.category === "patient" && eligible.some((entry) => entry.stillId === currentStillId))) return currentStillId;
  }
  const legacyStill = legacyPatientStillId(legacyIdentityId);
  if (legacyStill && eligible.some((entry) => entry.stillId === legacyStill)) return legacyStill;
  return eligible.length > 0
    ? eligible[deterministicInteger(campaignSeed, RANDOM_STREAMS.patientAppearance, `${selectionKey}:patient-still.v1`, eligible.length)]?.stillId
    : undefined;
}

export function selectStaffStillId(
  campaignSeed: string,
  employeeId: string,
  staffRoleDefinitionId: string,
  currentStillId?: string,
): CharacterStillId | undefined {
  if (isCharacterStillId(currentStillId)) {
    const known = characterStillCatalogEntryById(currentStillId);
    if (!known) return currentStillId;
    if (known.category === "staff" && known.eligibleStaffRoleDefinitionIds.includes(staffRoleDefinitionId)) return currentStillId;
  }
  const eligible = staffStillEligibleEntries(staffRoleDefinitionId);
  return eligible.length > 0
    ? eligible[deterministicInteger(campaignSeed, RANDOM_STREAMS.staffAppearance, `${employeeId}:${staffRoleDefinitionId}:staff-still.v1`, eligible.length)]?.stillId
    : undefined;
}

function staffRoleDefinitionForRoleStyle(roleStyle: PixelRoleStyle): string | undefined {
  return roleStyle === "founder" || roleStyle === "patient" ? undefined : `staff.${roleStyle}`;
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
  const appearance = normalizePixelAppearance({
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
  const staffRoleDefinitionId = staffRoleDefinitionForRoleStyle(roleStyle);
  const founderStillId = roleStyle === "founder" ? founderStillIdForAppearance(appearance) : undefined;
  return staffRoleDefinitionId
    ? { ...appearance, stillId: selectStaffStillId(campaignSeed, subjectId, staffRoleDefinitionId, appearance.stillId) }
    : founderStillId ? { ...appearance, stillId: founderStillId } : appearance;
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
  const existingIdentity = patientRosterEntryById(normalized.patientIdentityId);
  const existingIdentityIsCompatible = existingIdentity
    && (
      (sexLabel !== "Female" && sexLabel !== "Male") ||
      existingIdentity.compatibleSexLabel === sexLabel
    )
    && (
      ageYears === undefined ||
      eligible.some((entry) => entry.id === existingIdentity.id)
    );
  const selectedIdentity = existingIdentityIsCompatible
    ? existingIdentity.id
    : eligible.length > 0
      ? eligible[deterministicInteger(
          identitySelectionKey,
          RANDOM_STREAMS.patientAppearance,
          `legacy-roster:${legacyVariant}:${sexLabel ?? "unspecified"}:${ageYears ?? "unknown"}`,
          eligible.length,
        )]?.id
      : undefined;
  const {
    patientIdentityId: _discardedPatientIdentityId,
    stillId: _discardedStillId,
    ...appearanceWithoutIdentity
  } = normalized;
  const stillId = selectPatientStillId(
    identitySelectionKey,
    identitySelectionKey,
    { sexLabel, ageYears },
    normalized.stillId,
    selectedIdentity,
  );
  const withIdentity = {
    ...appearanceWithoutIdentity,
    ...(selectedIdentity ? { patientIdentityId: selectedIdentity } : {}),
    ...(stillId ? { stillId } : {}),
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
    const normalized = normalizePatientAppearanceForSex(base, sexLabel, ageYears, `${campaignSeed}:${selectionScope}:${encounterId}:patient-roster.v1`);
    const stillId = selectPatientStillId(campaignSeed, `${selectionScope}:${encounterId}`, { sexLabel, ageYears });
    return { ...normalized, ...(stillId ? { stillId } : {}) };
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
  const stillId = selectPatientStillId(
    campaignSeed,
    `${selectionScope}:${encounterId}`,
    { sexLabel, ageYears },
  );
  return {
    ...normalized,
    headVariant: variantWithinFamily(normalized.headVariant, familyOffset),
    bodyVariant: variantWithinFamily(normalized.headVariant, familyOffset),
    ...(patientIdentityId ? { patientIdentityId } : {}),
    ...(stillId ? { stillId } : {}),
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
  excludedDisplayNames: readonly string[] = [],
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
  const firstStart = random.integer(firstNames.length);
  const lastStart = random.integer(PATIENT_LAST_NAMES.length);
  if (excludedDisplayNames.length === 0) {
    return `${firstNames[firstStart]!} ${PATIENT_LAST_NAMES[lastStart]!}`;
  }

  const usedFullNames = new Set(excludedDisplayNames);
  const usedLastNames = new Set(
    excludedDisplayNames
      .map((displayName) => displayName.trim().split(/\s+/).at(-1))
      .filter((lastName): lastName is string => Boolean(lastName)),
  );
  const candidates = Array.from(
    { length: firstNames.length * PATIENT_LAST_NAMES.length },
    (_, index) => {
      const firstName = firstNames[(firstStart + index) % firstNames.length]!;
      const lastName = PATIENT_LAST_NAMES[
        (lastStart + Math.floor(index / firstNames.length)) % PATIENT_LAST_NAMES.length
      ]!;
      return `${firstName} ${lastName}`;
    },
  );
  return candidates.find((name) => !usedFullNames.has(name) && !usedLastNames.has(name.split(" ")[1]!))
    ?? candidates.find((name) => !usedFullNames.has(name))
    ?? candidates[0]!;
}
