import {
  AUTHORED_ADULT_PATIENT_ROSTER,
  patientVisualAgeBand,
  type PatientVisualAgeBand,
} from "./patientAppearanceCatalog";
import type {
  CharacterStillId,
  PatientIdentityId,
  PatientSexLabel,
  PixelAppearanceDescriptor,
} from "./types";

export const MAX_CHARACTER_STILL_ID_LENGTH = 128;

export type CharacterStillCatalogEntry =
  | {
      readonly stillId: CharacterStillId;
      readonly category: "patient";
      readonly sourceCohort: "gs018-patient50" | "gs022-public20";
      readonly compatibleSexLabel: Exclude<PatientSexLabel, "Not specified">;
      readonly ageBand: PatientVisualAgeBand;
      readonly intendedAge?: number;
    }
  | {
      readonly stillId: CharacterStillId;
      readonly category: "staff";
      readonly sourceCohort: "gs022-employee20" | "gs018-foundation-employee" | "gs026-employee-coverage";
      readonly eligibleStaffRoleDefinitionIds: readonly string[];
    }
  | {
      readonly stillId: CharacterStillId;
      readonly category: "founder";
      readonly sourceCohort: "gs018-founder30";
      readonly founderPresetIndex: number;
    }
  | {
      readonly stillId: CharacterStillId;
      readonly category: "explicit-avatar-extra";
      readonly sourceCohort: "gs018-retained-reference" | "gs018-foundation-patient";
    };

const id = (value: string) => value as CharacterStillId;

const LEGACY_PATIENT_STILLS = AUTHORED_ADULT_PATIENT_ROSTER.map((entry) => ({
  stillId: id(entry.id), category: "patient" as const, sourceCohort: "gs018-patient50" as const,
  compatibleSexLabel: entry.compatibleSexLabel, ageBand: entry.ageBand,
}));

const PUBLIC_PATIENT_ROWS = [
  ["gs022-new-person-001", 28, "Female"], ["gs022-new-person-002", 35, "Female"],
  ["gs022-new-person-003", 36, "Male"], ["gs022-new-person-004", 38, "Female"],
  ["gs022-new-person-005", 41, "Male"], ["gs022-new-person-006", 42, "Female"],
  ["gs022-new-person-007", 47, "Female"], ["gs022-new-person-008", 47, "Male"],
  ["gs022-new-person-009", 51, "Female"], ["gs022-new-person-010", 51, "Male"],
  ["gs022-new-person-011", 54, "Female"], ["gs022-new-person-012", 54, "Male"],
  ["gs022-new-person-013", 59, "Female"], ["gs022-new-person-014", 59, "Male"],
  ["gs022-new-person-015", 61, "Male"], ["gs022-new-person-016", 62, "Female"],
  ["gs022-new-person-017", 67, "Female"], ["gs022-new-person-018", 67, "Male"],
  ["gs022-new-person-019", 70, "Female"], ["gs022-new-person-020", 70, "Male"],
] as const satisfies readonly (readonly [string, number, Exclude<PatientSexLabel, "Not specified">])[];

const PUBLIC_PATIENT_STILLS = PUBLIC_PATIENT_ROWS.map(([stillId, intendedAge, compatibleSexLabel]) => ({
  stillId: id(stillId), category: "patient" as const, sourceCohort: "gs022-public20" as const,
  compatibleSexLabel, intendedAge, ageBand: patientVisualAgeBand(intendedAge)!,
}));

const EMPLOYEE_ROWS = [
  ["gs022-new-employee-001", "staff.receptionist"], ["gs022-new-employee-002", "staff.receptionist"], ["gs022-new-employee-003", "staff.receptionist"],
  ["gs022-new-employee-004", "staff.imaging_technician"], ["gs022-new-employee-005", "staff.imaging_technician"], ["gs022-new-employee-006", "staff.imaging_technician"],
  ["gs022-new-employee-007", "staff.periop_nurse"], ["gs022-new-employee-008", "staff.periop_nurse"], ["gs022-new-employee-009", "staff.periop_nurse"],
  ["gs022-new-employee-010", "staff.endoscopy_nurse"], ["gs022-new-employee-011", "staff.endoscopy_nurse"], ["gs022-new-employee-012", "staff.endoscopy_nurse"],
  ["gs022-new-employee-013", "staff.endoscopist"], ["gs022-new-employee-014", "staff.endoscopist"],
  ["gs022-new-employee-015", "staff.phlebotomist"], ["gs022-new-employee-016", "staff.phlebotomist"],
  ["gs022-new-employee-017", "staff.evs_worker"], ["gs022-new-employee-018", "staff.evs_worker"],
  ["gs022-new-employee-019", "staff.glp1_np"], ["gs022-new-employee-020", "staff.glp1_np"],
] as const;

const GS026_EMPLOYEE_ROWS = [
  ["gs026-employee-001", "staff.periop_nurse"], ["gs026-employee-002", "staff.periop_nurse"], ["gs026-employee-003", "staff.periop_nurse"],
  ["gs026-employee-004", "staff.endoscopy_nurse"], ["gs026-employee-005", "staff.endoscopy_nurse"],
  ["gs026-employee-006", "staff.endoscopist"], ["gs026-employee-007", "staff.endoscopist"], ["gs026-employee-008", "staff.endoscopist"],
  ["gs026-employee-009", "staff.phlebotomist"],
  ["gs026-employee-010", "staff.evs_worker"], ["gs026-employee-011", "staff.evs_worker"], ["gs026-employee-012", "staff.evs_worker"], ["gs026-employee-013", "staff.evs_worker"], ["gs026-employee-014", "staff.evs_worker"], ["gs026-employee-015", "staff.evs_worker"], ["gs026-employee-016", "staff.evs_worker"], ["gs026-employee-017", "staff.evs_worker"],
  ["gs026-employee-018", "staff.glp1_np"], ["gs026-employee-019", "staff.glp1_np"], ["gs026-employee-020", "staff.glp1_np"], ["gs026-employee-021", "staff.glp1_np"], ["gs026-employee-022", "staff.glp1_np"], ["gs026-employee-023", "staff.glp1_np"], ["gs026-employee-024", "staff.glp1_np"], ["gs026-employee-025", "staff.glp1_np"],
] as const;

const STAFF_STILLS = [
  ...EMPLOYEE_ROWS.map(([stillId, role]) => ({
    stillId: id(stillId), category: "staff" as const, sourceCohort: "gs022-employee20" as const,
    eligibleStaffRoleDefinitionIds: [role] as readonly string[],
  })),
  ...GS026_EMPLOYEE_ROWS.map(([stillId, role]) => ({
    stillId: id(stillId), category: "staff" as const, sourceCohort: "gs026-employee-coverage" as const,
    eligibleStaffRoleDefinitionIds: [role] as readonly string[],
  })),
  { stillId: id("mixed-20260910-receptionist-01"), category: "staff" as const, sourceCohort: "gs018-foundation-employee" as const, eligibleStaffRoleDefinitionIds: ["staff.receptionist"] },
  { stillId: id("mixed-20260910-nurse-01"), category: "staff" as const, sourceCohort: "gs018-foundation-employee" as const, eligibleStaffRoleDefinitionIds: ["staff.periop_nurse", "staff.endoscopy_nurse"] },
];

export const FOUNDER_STILL_IDS = Array.from({ length: 30 }, (_, index) => id(`founder.${String(index + 1).padStart(2, "0")}`));
const FOUNDER_STILLS = FOUNDER_STILL_IDS.map((stillId, index) => ({
  stillId, category: "founder" as const, sourceCohort: "gs018-founder30" as const, founderPresetIndex: index,
}));

export const EXPLICIT_ADDITIONAL_AVATAR_STILL_IDS = [
  "retained.reference.038fac25", "retained.gray-braid", "retained.reference.54c78cba", "retained.reference.6ee80949",
  "mixed-20260910-patient-01", "mixed-20260910-patient-02",
] as const satisfies readonly string[];
const EXPLICIT_EXTRA_STILLS = EXPLICIT_ADDITIONAL_AVATAR_STILL_IDS.map((stillId) => ({
  stillId: id(stillId), category: "explicit-avatar-extra" as const,
  sourceCohort: (stillId.startsWith("retained.") ? "gs018-retained-reference" : "gs018-foundation-patient") as "gs018-retained-reference" | "gs018-foundation-patient",
}));

export const CHARACTER_STILL_CATALOG = [
  ...LEGACY_PATIENT_STILLS, ...PUBLIC_PATIENT_STILLS, ...STAFF_STILLS, ...FOUNDER_STILLS, ...EXPLICIT_EXTRA_STILLS,
] as readonly CharacterStillCatalogEntry[];

export const PATIENT_CHARACTER_STILLS = CHARACTER_STILL_CATALOG.filter((entry): entry is Extract<CharacterStillCatalogEntry, { category: "patient" }> => entry.category === "patient");
export const STAFF_CHARACTER_STILLS = CHARACTER_STILL_CATALOG.filter((entry): entry is Extract<CharacterStillCatalogEntry, { category: "staff" }> => entry.category === "staff");
export const EXPLICIT_ADDITIONAL_AVATAR_STILLS = CHARACTER_STILL_CATALOG.filter((entry): entry is Extract<CharacterStillCatalogEntry, { category: "explicit-avatar-extra" }> => entry.category === "explicit-avatar-extra");

export function isCharacterStillId(value: unknown): value is CharacterStillId {
  return typeof value === "string" && value.length > 0 && value.length <= MAX_CHARACTER_STILL_ID_LENGTH && value.trim() === value;
}

export function characterStillCatalogEntryById(stillId: string | undefined): CharacterStillCatalogEntry | undefined {
  return CHARACTER_STILL_CATALOG.find((entry) => entry.stillId === stillId);
}

export function patientStillEligibleEntries(sexLabel?: PatientSexLabel, ageYears?: number) {
  if (ageYears !== undefined && ageYears < 18) return [];
  const sexEligible = sexLabel === "Female" || sexLabel === "Male"
    ? PATIENT_CHARACTER_STILLS.filter((entry) => entry.compatibleSexLabel === sexLabel)
    : PATIENT_CHARACTER_STILLS;
  const band = patientVisualAgeBand(ageYears);
  if (!band) return sexEligible;
  const ageEligible = sexEligible.filter((entry) => entry.ageBand === band);
  return ageEligible.length > 0 ? ageEligible : sexEligible;
}

export function staffStillEligibleEntries(staffRoleDefinitionId: string) {
  return STAFF_CHARACTER_STILLS.filter((entry) => entry.eligibleStaffRoleDefinitionIds.includes(staffRoleDefinitionId));
}

export function founderStillIdForPresetIds(headId: string, bodyId: string): CharacterStillId | undefined {
  const match = /^head\.(\d{2})$/.exec(headId); if (!match || bodyId !== `body.${match[1]}`) return undefined;
  const index = Number(match[1]); return index >= 1 && index <= 30 ? FOUNDER_STILL_IDS[index - 1] : undefined;
}

export function founderStillIdForAppearance(appearance: PixelAppearanceDescriptor): CharacterStillId | undefined {
  const head = appearance.headVariant;
  return head !== undefined && head >= 0 && head < 30 ? FOUNDER_STILL_IDS[head] : undefined;
}

export function withExplicitAdditionalAvatarStill(
  appearance: PixelAppearanceDescriptor,
  stillId: (typeof EXPLICIT_ADDITIONAL_AVATAR_STILL_IDS)[number],
): PixelAppearanceDescriptor {
  return { ...appearance, stillId: id(stillId) };
}

export function legacyPatientStillId(identityId: PatientIdentityId | undefined): CharacterStillId | undefined {
  return identityId && /^patient\.adult\.\d{3}$/.test(identityId) ? id(identityId) : undefined;
}
