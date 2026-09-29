import { describe, expect, it } from "vitest";
import {
  createPatientPixelAppearance,
  createPixelAppearance,
  normalizePatientAppearanceForSex,
  selectPatientStillId,
  selectStaffStillId,
} from "./appearance";
import {
  CHARACTER_STILL_CATALOG,
  EXPLICIT_ADDITIONAL_AVATAR_STILL_IDS,
  EXPLICIT_ADDITIONAL_AVATAR_STILLS,
  FOUNDER_STILL_IDS,
  PATIENT_CHARACTER_STILLS,
  STAFF_CHARACTER_STILLS,
  founderStillIdForPresetIds,
  patientStillEligibleEntries,
  staffStillEligibleEntries,
  withExplicitAdditionalAvatarStill,
} from "./characterStillCatalog";

describe("character still selection catalog", () => {
  it("covers all 128 packaged identities through explicit selection categories", () => {
    expect(CHARACTER_STILL_CATALOG).toHaveLength(128);
    expect(new Set(CHARACTER_STILL_CATALOG.map((entry) => entry.stillId)).size).toBe(128);
    expect(PATIENT_CHARACTER_STILLS).toHaveLength(70);
    expect(STAFF_CHARACTER_STILLS).toHaveLength(22);
    expect(FOUNDER_STILL_IDS).toHaveLength(30);
    expect(EXPLICIT_ADDITIONAL_AVATAR_STILLS).toHaveLength(6);
  });

  it("makes all twenty public designs reachable only through compatible adult profiles", () => {
    const publicEntries = PATIENT_CHARACTER_STILLS.filter((entry) => entry.sourceCohort === "gs022-public20");
    expect(publicEntries).toHaveLength(20);
    for (const entry of publicEntries) {
      expect(patientStillEligibleEntries(entry.compatibleSexLabel, entry.intendedAge)).toContainEqual(entry);
      let reached = false;
      for (let attempt = 0; attempt < 2_000 && !reached; attempt += 1) {
        reached = createPatientPixelAppearance(
          `public-reach-${attempt}`,
          `encounter-${entry.stillId}-${attempt}`,
          { sexLabel: entry.compatibleSexLabel, ageYears: entry.intendedAge },
        ).stillId === entry.stillId;
      }
      expect(reached).toBe(true);
    }
    expect(patientStillEligibleEntries("Female", 12)).toEqual([]);
    expect(createPatientPixelAppearance("child-seed", "child", { sexLabel: "Female", ageYears: 12 }).stillId).toBeUndefined();
  });

  it("retains compatible saved stills, preserves forward-compatible unknown IDs, and selects deterministically", () => {
    const profile = { sexLabel: "Female" as const, ageYears: 67 };
    expect(selectPatientStillId("seed", "patient", profile, "gs022-new-person-017")).toBe("gs022-new-person-017");
    expect(selectPatientStillId("seed", "patient", profile, "future.patient-art.v2")).toBe("future.patient-art.v2");
    const first = selectPatientStillId("seed", "patient", profile);
    expect(selectPatientStillId("seed", "patient", profile)).toBe(first);
    expect(patientStillEligibleEntries(profile.sexLabel, profile.ageYears).some((entry) => entry.stillId === first)).toBe(true);
  });

  it("keeps legacy patient identity separate and uses it as the missing-still migration", () => {
    const base = createPixelAppearance("seed", "patient", "legacy", "patient");
    const normalized = normalizePatientAppearanceForSex({ ...base, patientIdentityId: "patient.adult.001", stillId: undefined }, "Female", 24, "legacy-key");
    expect(normalized.patientIdentityId).toBe("patient.adult.001");
    expect(normalized.stillId).toBe("patient.adult.001");
  });

  it("uses exact role pools and stable staff selection", () => {
    for (const entry of STAFF_CHARACTER_STILLS) for (const role of entry.eligibleStaffRoleDefinitionIds) {
      expect(staffStillEligibleEntries(role)).toContainEqual(entry);
    }
    expect(staffStillEligibleEntries("staff.receptionist")).toHaveLength(4);
    expect(staffStillEligibleEntries("staff.periop_nurse").map((entry) => entry.stillId)).toContain("mixed-20260910-nurse-01");
    const first = selectStaffStillId("seed", "employee.1", "staff.imaging_technician");
    expect(selectStaffStillId("seed", "employee.1", "staff.imaging_technician")).toBe(first);
    expect(selectStaffStillId("seed", "employee.1", "staff.imaging_technician", "future.staff-art.v2")).toBe("future.staff-art.v2");
    expect(selectStaffStillId("seed", "employee.1", "staff.imaging_technician", "gs022-new-employee-001")).toBe(first);
    expect(selectStaffStillId("seed", "employee.1", "staff.imaging_technician", "patient.adult.001")).toBe(first);
  });

  it("maps all thirty founder presets exactly and keeps six extras explicit-only", () => {
    for (let index = 1; index <= 30; index += 1) {
      const suffix = String(index).padStart(2, "0");
      expect(founderStillIdForPresetIds(`head.${suffix}`, `body.${suffix}`)).toBe(`founder.${suffix}`);
    }
    expect(founderStillIdForPresetIds("head.01", "body.02")).toBeUndefined();
    expect(EXPLICIT_ADDITIONAL_AVATAR_STILL_IDS).toHaveLength(6);
    const base = createPixelAppearance("seed", "staff", "founder", "founder");
    expect(withExplicitAdditionalAvatarStill(base, "mixed-20260910-patient-01").stillId).toBe("mixed-20260910-patient-01");
    expect(PATIENT_CHARACTER_STILLS.some((entry) => EXPLICIT_ADDITIONAL_AVATAR_STILL_IDS.includes(entry.stillId as never))).toBe(false);
  });
});
