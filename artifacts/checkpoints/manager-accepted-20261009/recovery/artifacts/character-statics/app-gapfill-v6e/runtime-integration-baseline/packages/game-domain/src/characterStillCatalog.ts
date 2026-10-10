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
      readonly category: "pediatric";
      readonly sourceCohort: "level3-roster-v2";
      readonly compatibleSexLabel: "Female" | "Male";
      readonly intendedVisualAge: number;
      /** Editorial art bounds from the authored child/older-child/teen groups. */
      readonly minimumAge: number;
      readonly maximumAge: number;
    }
  | {
      readonly stillId: CharacterStillId;
      readonly category: "patient";
      readonly sourceCohort: "gs018-patient50" | "gs022-public20" | "level3-roster-v2" | "patient-women20-v3" | "patient-demographics20-v4" | "future-roster20-v5" | "patient-gapfill-v6a" | "patient-gapfill-v6b" | "patient-gapfill-v6c";
      readonly compatibleSexLabel: Exclude<PatientSexLabel, "Not specified">;
      readonly ageBand: PatientVisualAgeBand;
      readonly intendedAge?: number;
    }
  | {
      readonly stillId: CharacterStillId;
      readonly category: "staff";
      readonly sourceCohort: "gs022-employee20" | "gs018-foundation-employee" | "gs026-employee-coverage" | "level3-roster-v2" | "future-roster20-v5" | "staff-gapfill-v6d";
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
    }
  | {
      /** Renderable art registered for a deliberately future-only release seam. */
      readonly stillId: CharacterStillId;
      readonly category: "future-presentation";
      readonly sourceCohort: "level3-roster-v2";
      readonly futurePresentationKind: "pediatric" | "radiologist";
      readonly availability: "level4-locked" | "excluded-until-future-approved-pediatric-release";
      readonly futureStaffRoleDefinitionId?: "staff.radiologist";
      readonly intendedVisualAge?: number;
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

const LEVEL3_ROSTER_V2_ADULT_PATIENT_ROWS = [
  ["level3-roster-v2.015", 19, "Male"], ["level3-roster-v2.016", 24, "Male"],
  ["level3-roster-v2.017", 28, "Male"], ["level3-roster-v2.018", 21, "Female"],
  ["level3-roster-v2.019", 26, "Female"], ["level3-roster-v2.020", 38, "Male"],
] as const satisfies readonly (readonly [string, number, Exclude<PatientSexLabel, "Not specified">])[];

const LEVEL3_ROSTER_V2_ADULT_PATIENT_STILLS = LEVEL3_ROSTER_V2_ADULT_PATIENT_ROWS.map(([stillId, intendedAge, compatibleSexLabel]) => ({
  stillId: id(stillId), category: "patient" as const, sourceCohort: "level3-roster-v2" as const,
  compatibleSexLabel, intendedAge, ageBand: patientVisualAgeBand(intendedAge)!,
}));

const LEVEL3_ROSTER_V2_STAFF_ROWS = [
  ["level3-roster-v2.001", "staff.radiologist"], ["level3-roster-v2.002", "staff.radiologist"],
  ["level3-roster-v2.003", "staff.radiologist"], ["level3-roster-v2.004", "staff.radiologist"],
  ["level3-roster-v2.005", "staff.surgeon"], ["level3-roster-v2.006", "staff.surgeon"],
  ["level3-roster-v2.007", "staff.or_nurse"], ["level3-roster-v2.008", "staff.or_nurse"],
  ["level3-roster-v2.009", "staff.laboratory_technician"], ["level3-roster-v2.010", "staff.laboratory_technician"],
  ["level3-roster-v2.011", "staff.pharmacist"], ["level3-roster-v2.012", "staff.pharmacist"],
  ["level3-roster-v2.013", "staff.repair_person"], ["level3-roster-v2.014", "staff.repair_person"],
] as const;

const LEVEL3_ROSTER_V2_STAFF_STILLS = LEVEL3_ROSTER_V2_STAFF_ROWS.map(([stillId, role]) => ({
  stillId: id(stillId), category: "staff" as const, sourceCohort: "level3-roster-v2" as const,
  eligibleStaffRoleDefinitionIds: [role] as readonly string[],
}));

// Owner-requested hiring order: Mark, Helly, Irving, then Dylan. Saved staff
// retain their looks; other roles and exhausted preferences use seeded selection.
export const PREFERRED_STAFF_STILL_IDS_BY_ROLE: Readonly<Partial<Record<string, readonly CharacterStillId[]>>> = {
  "staff.radiologist": [
    id("level3-roster-v2.001"),
    id("level3-roster-v2.002"),
    id("level3-roster-v2.003"),
    id("level3-roster-v2.004"),
  ],
};

// Sex and visual age are explicit in level3-roster-complete-v2/roster.json,
// identities 021-032. Bounds describe its authored art groups, not clinical risk.
export const PEDIATRIC_CHARACTER_STILLS = [
  ["021", 6, "Female", 5, 8], ["022", 5, "Male", 5, 8],
  ["023", 7, "Female", 5, 8], ["024", 6, "Male", 5, 8],
  ["025", 9, "Female", 9, 12], ["026", 10, "Male", 9, 12],
  ["027", 11, "Female", 9, 12], ["028", 12, "Male", 9, 12],
  ["029", 14, "Female", 13, 17], ["030", 14, "Male", 13, 17],
  ["031", 16, "Female", 13, 17], ["032", 17, "Male", 13, 17],
].map(([number, intendedVisualAge, compatibleSexLabel, minimumAge, maximumAge]) => ({
  stillId: id(`level3-roster-v2.${number}`), category: "pediatric" as const,
  sourceCohort: "level3-roster-v2" as const, intendedVisualAge, compatibleSexLabel,
  minimumAge, maximumAge,
})) as readonly Extract<CharacterStillCatalogEntry, { category: "pediatric" }>[];

export function pediatricStillEligibleEntries(sexLabel?: PatientSexLabel, ageYears?: number) {
  if (!Number.isInteger(ageYears) || ageYears === undefined || ageYears < 5 || ageYears > 17 ||
    (sexLabel !== "Female" && sexLabel !== "Male")) return [];
  return PEDIATRIC_CHARACTER_STILLS.filter(entry => entry.compatibleSexLabel === sexLabel &&
    ageYears >= entry.minimumAge && ageYears <= entry.maximumAge);
}

const PATIENT_WOMEN20_V3_ROWS = [
  ["001", 32], ["002", 34], ["003", 36], ["004", 38],
  ["005", 39], ["006", 40], ["007", 41], ["008", 42],
  ["009", 42], ["010", 43], ["011", 44], ["012", 44],
  ["013", 46], ["014", 48], ["015", 50], ["016", 52],
  ["017", 55], ["018", 57], ["019", 60], ["020", 63],
] as const;

const PATIENT_WOMEN20_V3_STILLS = PATIENT_WOMEN20_V3_ROWS.map(([number, intendedAge]) => ({
  stillId: id(`patient-women20-v3.${number}`), category: "patient" as const,
  sourceCohort: "patient-women20-v3" as const, compatibleSexLabel: "Female" as const,
  intendedAge, ageBand: patientVisualAgeBand(intendedAge)!,
}));

const PATIENT_DEMOGRAPHICS20_V4_ROWS = [
  ["001", 32, "Male"], ["002", 35, "Male"], ["003", 39, "Male"],
  ["004", 42, "Male"], ["005", 44, "Male"], ["006", 46, "Male"],
  ["007", 49, "Male"], ["008", 52, "Male"], ["009", 55, "Male"],
  ["010", 58, "Male"], ["011", 61, "Male"], ["012", 64, "Male"],
  ["013", 67, "Female"], ["014", 68, "Female"], ["015", 71, "Female"],
  ["016", 67, "Male"], ["017", 68, "Male"], ["018", 71, "Male"],
  ["019", 48, "Female"], ["020", 60, "Female"],
] as const satisfies readonly (readonly [string, number, Exclude<PatientSexLabel, "Not specified">])[];

const PATIENT_DEMOGRAPHICS20_V4_STILLS = PATIENT_DEMOGRAPHICS20_V4_ROWS.map(([number, intendedAge, compatibleSexLabel]) => ({
  stillId: id(`patient-demographics20-v4.${number}`), category: "patient" as const,
  sourceCohort: "patient-demographics20-v4" as const, compatibleSexLabel,
  intendedAge, ageBand: patientVisualAgeBand(intendedAge)!,
}));

// Owner-approved GS-033 provider art: M4 enables the two authored APP looks.
// Executive looks remain future-only; no other role's preferred art is borrowed.
const FUTURE_ROSTER20_V5_STAFF_ROWS = [
  ["001", ["staff.app"]],
  ["002", ["staff.app"]],
  ["003", []],
  ["004", []],
  ["005", ["staff.radiologist"]],
  ["006", ["staff.radiologist"]],
  ["007", ["staff.radiologist"]],
  ["008", ["staff.radiologist"]],
  ["009", ["staff.radiologist"]],
  ["010", ["staff.radiologist"]],
  ["011", ["staff.radiologist"]],
  ["012", ["staff.radiologist"]],
  ["013", ["staff.radiologist"]],
  ["014", ["staff.radiologist"]],
  ["015", ["staff.radiologist"]],
  ["016", ["staff.radiologist"]],
] as const;

const FUTURE_ROSTER20_V5_STAFF_STILLS = FUTURE_ROSTER20_V5_STAFF_ROWS.map(([number, roles]) => ({
  stillId: id(`future-roster20-v5.${number}`), category: "staff" as const,
  sourceCohort: "future-roster20-v5" as const, eligibleStaffRoleDefinitionIds: roles as readonly string[],
}));

const FUTURE_ROSTER20_V5_PATIENT_ROWS = [
  ["017", 41, "Male"],
  ["018", 54, "Female"],
  ["019", 57, "Male"],
  ["020", 69, "Female"],
] as const satisfies readonly (readonly [string, number, Exclude<PatientSexLabel, "Not specified">])[];

const FUTURE_ROSTER20_V5_PATIENT_STILLS = FUTURE_ROSTER20_V5_PATIENT_ROWS.map(([number, intendedAge, compatibleSexLabel]) => ({
  stillId: id(`future-roster20-v5.${number}`), category: "patient" as const,
  sourceCohort: "future-roster20-v5" as const, compatibleSexLabel,
  intendedAge, ageBand: patientVisualAgeBand(intendedAge)!,
}));

// Owner-delegated manager approval recorded on 2026-10-07; visual metadata only.
const PATIENT_GAPFILL_V6A_ROWS = [
  ["001", 45, "Female"],
  ["002", 48, "Female"],
  ["003", 51, "Female"],
  ["004", 54, "Female"],
  ["005", 57, "Female"],
  ["006", 60, "Female"],
  ["007", 63, "Female"],
  ["008", 46, "Male"],
  ["009", 49, "Male"],
  ["010", 52, "Male"],
  ["011", 55, "Male"],
  ["012", 58, "Male"],
  ["013", 62, "Male"],
  ["014", 31, "Female"],
  ["015", 35, "Female"],
  ["016", 39, "Female"],
  ["017", 43, "Female"],
  ["018", 32, "Male"],
  ["019", 37, "Male"],
  ["020", 44, "Male"],
] as const satisfies readonly (readonly [string, number, Exclude<PatientSexLabel, "Not specified">])[];

const PATIENT_GAPFILL_V6A_STILLS = PATIENT_GAPFILL_V6A_ROWS.map(([number, intendedAge, compatibleSexLabel]) => ({
  stillId: id(`patient-gapfill-v6a.${number}`), category: "patient" as const,
  sourceCohort: "patient-gapfill-v6a" as const, compatibleSexLabel,
  intendedAge, ageBand: patientVisualAgeBand(intendedAge)!,
}));

// Owner-delegated manager approval recorded on 2026-10-08; visual metadata only.
const PATIENT_GAPFILL_V6B_ROWS = [
  ["001", 46, "Female"],
  ["002", 49, "Female"],
  ["003", 52, "Female"],
  ["004", 55, "Female"],
  ["005", 58, "Female"],
  ["006", 61, "Female"],
  ["007", 64, "Female"],
  ["008", 45, "Male"],
  ["009", 48, "Male"],
  ["010", 51, "Male"],
  ["011", 54, "Male"],
  ["012", 59, "Male"],
  ["013", 63, "Male"],
  ["014", 30, "Male"],
  ["015", 34, "Male"],
  ["016", 38, "Male"],
  ["017", 42, "Male"],
  ["018", 32, "Female"],
  ["019", 37, "Female"],
  ["020", 44, "Female"],
] as const satisfies readonly (readonly [string, number, Exclude<PatientSexLabel, "Not specified">])[];

const PATIENT_GAPFILL_V6B_STILLS = PATIENT_GAPFILL_V6B_ROWS.map(([number, intendedAge, compatibleSexLabel]) => ({
  stillId: id(`patient-gapfill-v6b.${number}`), category: "patient" as const,
  sourceCohort: "patient-gapfill-v6b" as const, compatibleSexLabel,
  intendedAge, ageBand: patientVisualAgeBand(intendedAge)!,
}));

// Owner-delegated manager approval recorded on 2026-10-08; visual metadata only.
const PATIENT_GAPFILL_V6C_ROWS = [
  ["001", 65, "Female"],
  ["002", 68, "Female"],
  ["003", 72, "Female"],
  ["004", 76, "Female"],
  ["005", 80, "Female"],
  ["006", 84, "Female"],
  ["007", 88, "Female"],
  ["008", 65, "Male"],
  ["009", 68, "Male"],
  ["010", 71, "Male"],
  ["011", 74, "Male"],
  ["012", 77, "Male"],
  ["013", 81, "Male"],
  ["014", 85, "Male"],
  ["015", 88, "Male"],
  ["016", 34, "Female"],
  ["017", 42, "Female"],
  ["018", 33, "Male"],
  ["019", 43, "Male"],
] as const satisfies readonly (readonly [string, number, Exclude<PatientSexLabel, "Not specified">])[];

const PATIENT_GAPFILL_V6C_STILLS = PATIENT_GAPFILL_V6C_ROWS.map(([number, intendedAge, compatibleSexLabel]) => ({
  stillId: id(`patient-gapfill-v6c.${number}`), category: "patient" as const,
  sourceCohort: "patient-gapfill-v6c" as const, compatibleSexLabel,
  intendedAge, ageBand: patientVisualAgeBand(intendedAge)!,
}));

// Owner-delegated manager approval recorded on 2026-10-08; one exact role per look.
const STAFF_GAPFILL_V6D_ROWS = [
  ["001", "staff.imaging_technician"],
  ["002", "staff.imaging_technician"],
  ["003", "staff.phlebotomist"],
  ["004", "staff.phlebotomist"],
  ["005", "staff.laboratory_technician"],
  ["006", "staff.laboratory_technician"],
  ["007", "staff.surgeon"],
  ["008", "staff.surgeon"],
  ["009", "staff.or_nurse"],
  ["010", "staff.or_nurse"],
  ["011", "staff.pharmacist"],
  ["012", "staff.pharmacist"],
  ["013", "staff.repair_person"],
  ["014", "staff.repair_person"],
] as const satisfies readonly (readonly [string, string])[];

const STAFF_GAPFILL_V6D_STILLS = STAFF_GAPFILL_V6D_ROWS.map(([number, role]) => ({
  stillId: id(`staff-gapfill-v6d.${number}`), category: "staff" as const,
  sourceCohort: "staff-gapfill-v6d" as const, eligibleStaffRoleDefinitionIds: [role],
}));

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
  ...LEGACY_PATIENT_STILLS, ...PUBLIC_PATIENT_STILLS, ...LEVEL3_ROSTER_V2_ADULT_PATIENT_STILLS,
  ...STAFF_STILLS, ...LEVEL3_ROSTER_V2_STAFF_STILLS, ...FOUNDER_STILLS, ...EXPLICIT_EXTRA_STILLS,
  ...PEDIATRIC_CHARACTER_STILLS,
  ...PATIENT_WOMEN20_V3_STILLS,
  ...PATIENT_DEMOGRAPHICS20_V4_STILLS,
  ...FUTURE_ROSTER20_V5_STAFF_STILLS, ...FUTURE_ROSTER20_V5_PATIENT_STILLS,
  ...PATIENT_GAPFILL_V6A_STILLS,
  ...PATIENT_GAPFILL_V6B_STILLS,
  ...PATIENT_GAPFILL_V6C_STILLS,
  ...STAFF_GAPFILL_V6D_STILLS,
] as readonly CharacterStillCatalogEntry[];

export const PATIENT_CHARACTER_STILLS = CHARACTER_STILL_CATALOG.filter((entry): entry is Extract<CharacterStillCatalogEntry, { category: "patient" }> => entry.category === "patient");
export const STAFF_CHARACTER_STILLS = CHARACTER_STILL_CATALOG.filter((entry): entry is Extract<CharacterStillCatalogEntry, { category: "staff" }> => entry.category === "staff");
export const EXPLICIT_ADDITIONAL_AVATAR_STILLS = CHARACTER_STILL_CATALOG.filter((entry): entry is Extract<CharacterStillCatalogEntry, { category: "explicit-avatar-extra" }> => entry.category === "explicit-avatar-extra");
export const FUTURE_PRESENTATION_CHARACTER_STILLS = CHARACTER_STILL_CATALOG.filter((entry): entry is Extract<CharacterStillCatalogEntry, { category: "future-presentation" }> => entry.category === "future-presentation");

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
