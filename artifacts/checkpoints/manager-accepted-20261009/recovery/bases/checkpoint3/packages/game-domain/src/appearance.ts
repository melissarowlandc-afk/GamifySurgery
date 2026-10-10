import {
  createDeterministicRandom,
  deterministicInteger,
  RANDOM_STREAMS,
} from "./randomness";
import type {
  PixelAppearanceDescriptor,
  PixelAppearanceVariant,
  CharacterStillId,
  EncounterState,
  GameState,
  PatientIdentityId,
  PatientSexLabel,
} from "./types";
import {
  PREFERRED_STAFF_STILL_IDS_BY_ROLE,
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
  "Ari",
  "Blair",
  "Cameron",
  "Charlie",
  "Dana",
  "Devon",
  "Eden",
  "Ellis",
  "Frankie",
  "Hayden",
  "Hollis",
  "Jesse",
  "Jules",
  "Kendall",
  "Lane",
  "Lee",
  "Lennon",
  "Marley",
  "Micah",
  "Nico",
  "Noel",
  "Oakley",
  "Peyton",
  "Remy",
  "River",
  "Robin",
  "Rory",
  "Sage",
  "Sasha",
  "Shay",
  "Skyler",
  "Spencer",
  "Sydney",
  "Tatum",
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

export interface PatientAppearanceSelectionContext {
  /** Still IDs currently carried by visible patient-like actors. */
  readonly occupiedStillIds: ReadonlySet<string>;
  /** Previously used encounter still IDs, ordered oldest to newest. */
  readonly recentlyUsedStillIds: readonly string[];
}

type PatientAppearanceSelectionState = Pick<
  GameState,
  | "encounters"
  | "serviceOperations"
  | "retailExternalActors"
  | "environment"
  | "retiredEncounterSummary"
>;

export function patientStillIdForAppearance(
  appearance: PixelAppearanceDescriptor | null | undefined,
): string | undefined {
  if (!appearance) return undefined;
  if (isCharacterStillId(appearance.stillId)) return appearance.stillId;
  return legacyPatientStillId(appearance.patientIdentityId);
}

/**
 * Builds the transient reservation and rotation inputs for a newly created
 * patient-like actor. The state already retains encounter history, so this
 * needs no new persisted schema.
 */
export function getPatientAppearanceSelectionContext(
  state: PatientAppearanceSelectionState,
): PatientAppearanceSelectionContext {
  const visibleAppearances = [
    ...Object.values(state.encounters)
      .filter((encounter) => encounter.patientLocation !== null)
      .map((encounter) => encounter.patientAppearance),
    ...state.serviceOperations
      .filter(
        (operation) =>
          operation.actorKind === "visitor" && operation.location !== null,
      )
      .map((operation) => operation.appearance),
    ...state.retailExternalActors
      .filter((actor) => actor.lifecycle !== "departed" && actor.location !== null)
      .map((actor) => actor.appearance),
    ...state.environment.ambientPedestrians.map(
      (pedestrian) => pedestrian.appearance,
    ),
  ];
  const occupiedStillIds = new Set<string>();
  for (const appearance of visibleAppearances) {
    const stillId = patientStillIdForAppearance(appearance);
    if (stillId) occupiedStillIds.add(stillId);
  }

  const encounterStillIds = (encounters: EncounterState[]) => encounters
    .sort(
      (left, right) =>
        left.waiting.arrivedAtTick - right.waiting.arrivedAtTick ||
        left.id.localeCompare(right.id),
    )
    .map((encounter) => patientStillIdForAppearance(encounter.patientAppearance))
    .filter((stillId): stillId is string => stillId !== undefined);
  const retiredStillUses = state.retiredEncounterSummary?.recentStillUses ?? [];
  // Retired patients keep their latest still use and arrival, so merging
  // them reproduces the full arrival-ordered history this rotation reads.
  const recentlyUsedStillIds = retiredStillUses.length === 0
    ? encounterStillIds(Object.values(state.encounters))
    : [
        ...retiredStillUses,
        ...Object.values(state.encounters).flatMap((encounter) => {
          const stillId = patientStillIdForAppearance(encounter.patientAppearance);
          return stillId
            ? [{ stillId, encounterId: encounter.id, arrivedAtTick: encounter.waiting.arrivedAtTick }]
            : [];
        }),
      ]
        .sort(
          (left, right) =>
            left.arrivedAtTick - right.arrivedAtTick ||
            left.encounterId.localeCompare(right.encounterId),
        )
        .map((use) => use.stillId);

  return { occupiedStillIds, recentlyUsedStillIds };
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

/**
 * Selects one still for a newly created patient-like actor. Unoccupied stills
 * always win. Within that pool, never-used stills precede the least recently
 * used stills, with the existing seeded stream resolving ties.
 */
export function selectNewPatientStillId(
  campaignSeed: string,
  selectionKey: string,
  profile: PatientAppearanceProfile,
  selectionContext?: PatientAppearanceSelectionContext,
): CharacterStillId | undefined {
  const eligible = patientStillEligibleEntries(profile.sexLabel, profile.ageYears);
  if (eligible.length === 0) return undefined;

  const occupiedStillIds = selectionContext?.occupiedStillIds ?? new Set<string>();
  const unoccupied = eligible.filter(
    (entry) => !occupiedStillIds.has(entry.stillId),
  );
  const available = unoccupied.length > 0 ? unoccupied : eligible;
  const lastUseIndex = new Map<string, number>();
  for (const [index, stillId] of (
    selectionContext?.recentlyUsedStillIds ?? []
  ).entries()) {
    lastUseIndex.set(stillId, index);
  }
  const leastRecentIndex = Math.min(
    ...available.map((entry) => lastUseIndex.get(entry.stillId) ?? -1),
  );
  const leastRecentlyUsed = available.filter(
    (entry) => (lastUseIndex.get(entry.stillId) ?? -1) === leastRecentIndex,
  );
  return leastRecentlyUsed[
    deterministicInteger(
      campaignSeed,
      RANDOM_STREAMS.patientAppearance,
      `${selectionKey}:patient-still.lru.v1`,
      leastRecentlyUsed.length,
    )
  ]?.stillId;
}

function patientIdentityForNewStill(
  campaignSeed: string,
  selectionKey: string,
  profile: PatientAppearanceProfile,
  stillId: CharacterStillId | undefined,
): PatientIdentityId | undefined {
  if (!stillId) return undefined;
  const canonicalIdentity = patientRosterEntryById(stillId as PatientIdentityId);
  if (canonicalIdentity) return canonicalIdentity.id;
  const still = characterStillCatalogEntryById(stillId);
  const visualProfile = still?.category === "patient"
    ? {
        sexLabel: still.compatibleSexLabel,
        ageYears: still.intendedAge ?? (
          still.ageBand === "young_adult" ? 24
            : still.ageBand === "adult" ? 38
              : still.ageBand === "middle_aged" ? 54
                : 70
        ),
      }
    : profile;
  const eligible = patientRosterEligibleEntries(
    visualProfile.sexLabel,
    visualProfile.ageYears,
  );
  return eligible[
    deterministicInteger(
      campaignSeed,
      RANDOM_STREAMS.patientAppearance,
      `${selectionKey}:${stillId}:patient-roster-for-still.v1`,
      eligible.length,
    )
  ]?.id;
}

export function selectStaffStillId(
  campaignSeed: string,
  employeeId: string,
  staffRoleDefinitionId: string,
  currentStillId?: string,
  occupiedStillIds: ReadonlySet<string | undefined> = new Set(),
): CharacterStillId | undefined {
  if (isCharacterStillId(currentStillId)) {
    const known = characterStillCatalogEntryById(currentStillId);
    if (!known && !occupiedStillIds.has(currentStillId)) return currentStillId;
    if (known?.category === "staff" && known.eligibleStaffRoleDefinitionIds.includes(staffRoleDefinitionId) && !occupiedStillIds.has(currentStillId)) return currentStillId;
  }
  const eligible = staffStillEligibleEntries(staffRoleDefinitionId);
  if (eligible.length === 0) return undefined;
  const orderedStillId = PREFERRED_STAFF_STILL_IDS_BY_ROLE[staffRoleDefinitionId]?.find(
    (stillId) => !occupiedStillIds.has(stillId) && eligible.some((entry) => entry.stillId === stillId),
  );
  if (orderedStillId) return orderedStillId;
  // Seeded selection starts from the complete eligible pool. Filtering before the hash
  // changes an otherwise free employee's identity whenever somebody else
  // occupies an unrelated option in that role's pool.
  const preferred = eligible[
    deterministicInteger(
      campaignSeed,
      RANDOM_STREAMS.staffAppearance,
      `${employeeId}:${staffRoleDefinitionId}:staff-still.v1`,
      eligible.length,
    )
  ];
  if (preferred && !occupiedStillIds.has(preferred.stillId)) {
    return preferred.stillId;
  }
  const available = eligible.filter((entry) => !occupiedStillIds.has(entry.stillId));
  return available.length > 0
    ? available[deterministicInteger(campaignSeed, RANDOM_STREAMS.staffAppearance, `${employeeId}:${staffRoleDefinitionId}:staff-still.v1`, available.length)]?.stillId
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
  selectionContext?: PatientAppearanceSelectionContext,
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
    const stillId = selectNewPatientStillId(
      campaignSeed,
      `${selectionScope}:${encounterId}`,
      { sexLabel, ageYears },
      selectionContext,
    );
    const patientIdentityId = patientIdentityForNewStill(
      campaignSeed,
      `${selectionScope}:${encounterId}`,
      { sexLabel, ageYears },
      stillId,
    );
    const {
      patientIdentityId: _discardedPatientIdentityId,
      stillId: _discardedStillId,
      ...appearanceWithoutIdentity
    } = normalized;
    return {
      ...appearanceWithoutIdentity,
      ...(patientIdentityId ? { patientIdentityId } : {}),
      ...(stillId ? { stillId } : {}),
    };
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
  const stillId = selectNewPatientStillId(
    campaignSeed,
    `${selectionScope}:${encounterId}`,
    { sexLabel, ageYears },
    selectionContext,
  );
  const patientIdentityId = patientIdentityForNewStill(
    campaignSeed,
    `${selectionScope}:${encounterId}`,
    { sexLabel, ageYears },
    stillId,
  );
  return {
    ...normalized,
    headVariant: variantWithinFamily(normalized.headVariant, familyOffset),
    bodyVariant: variantWithinFamily(normalized.headVariant, familyOffset),
    ...(patientIdentityId ? { patientIdentityId } : {}),
    ...(stillId ? { stillId } : {}),
  };
}

/**
 * Plain first name for an employee. Starting from the seeded pick, it skips
 * names already in use so staff never need numbered names like "Sam 2".
 */
export function createStaffDisplayName(
  campaignSeed: string,
  employeeId: string,
  usedDisplayNames: Iterable<string> = [],
): string {
  const random = createDeterministicRandom(
    campaignSeed,
    RANDOM_STREAMS.staffAppearance,
    `${employeeId}:display-name.v1`,
  );
  const start = random.integer(STAFF_NAMES.length);
  const used = new Set(usedDisplayNames);
  for (let offset = 0; offset < STAFF_NAMES.length; offset += 1) {
    const name = STAFF_NAMES[(start + offset) % STAFF_NAMES.length]!;
    if (!used.has(name)) return name;
  }
  return STAFF_NAMES[start]!;
}

const NUMBERED_STAFF_NAME = /^(.+?) \d+$/;

/**
 * Renames employees whose names repeat another employee's or carry an old
 * numeric suffix ("Blake 2") to an unused plain first name. Mutates in place.
 */
export function dedupeStaffDisplayNames(
  campaignSeed: string,
  employees: { id: string; displayName: string }[],
  reservedDisplayNames: Iterable<string> = [],
): void {
  const used = new Set(reservedDisplayNames);
  for (const employee of employees) {
    if (!NUMBERED_STAFF_NAME.test(employee.displayName) && !used.has(employee.displayName)) {
      used.add(employee.displayName);
    }
  }
  const kept = new Set<string>();
  for (const employee of employees) {
    const numbered = NUMBERED_STAFF_NAME.test(employee.displayName);
    if (!numbered && !kept.has(employee.displayName)) {
      kept.add(employee.displayName);
      continue;
    }
    employee.displayName = createStaffDisplayName(campaignSeed, employee.id, used);
    used.add(employee.displayName);
    kept.add(employee.displayName);
  }
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
