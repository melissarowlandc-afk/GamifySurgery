import { describe, expect, it } from "vitest";
import {
  createPatientPixelAppearance,
  createPixelAppearance,
  normalizePatientAppearanceForSex,
  selectPatientStillId,
  selectNewPatientStillId,
  selectStaffStillId,
} from "./appearance";
import {
  CHARACTER_STILL_CATALOG,
  EXPLICIT_ADDITIONAL_AVATAR_STILL_IDS,
  EXPLICIT_ADDITIONAL_AVATAR_STILLS,
  FOUNDER_STILL_IDS,
  FUTURE_PRESENTATION_CHARACTER_STILLS,
  PATIENT_CHARACTER_STILLS,
  STAFF_CHARACTER_STILLS,
  founderStillIdForPresetIds,
  patientStillEligibleEntries,
  staffStillEligibleEntries,
  withExplicitAdditionalAvatarStill,
} from "./characterStillCatalog";

describe("character still selection catalog", () => {
  it("covers all 225 packaged identities through explicit selection categories", () => {
    expect(CHARACTER_STILL_CATALOG).toHaveLength(225);
    expect(new Set(CHARACTER_STILL_CATALOG.map((entry) => entry.stillId)).size).toBe(225);
    expect(PATIENT_CHARACTER_STILLS).toHaveLength(116);
    expect(STAFF_CHARACTER_STILLS).toHaveLength(61);
    expect(FOUNDER_STILL_IDS).toHaveLength(30);
    expect(EXPLICIT_ADDITIONAL_AVATAR_STILLS).toHaveLength(6);
    expect(FUTURE_PRESENTATION_CHARACTER_STILLS).toHaveLength(12);
  });

  it("reaches all twenty approved demographic-gap designs before repeating each compatible pool", () => {
    const additions = PATIENT_CHARACTER_STILLS.filter(entry => entry.sourceCohort === "patient-demographics20-v4");
    expect(additions).toHaveLength(20);
    expect(additions.filter(entry => entry.compatibleSexLabel === "Male")).toHaveLength(15);
    expect(additions.filter(entry => entry.compatibleSexLabel === "Female")).toHaveLength(5);
    const profiles = [
      { sexLabel: "Male", ageYears: 38, additions: 5 },
      { sexLabel: "Male", ageYears: 54, additions: 7 },
      { sexLabel: "Male", ageYears: 70, additions: 3 },
      { sexLabel: "Female", ageYears: 70, additions: 3 },
      { sexLabel: "Female", ageYears: 54, additions: 2 },
    ] as const;
    for (const profile of profiles) {
      const pool = patientStillEligibleEntries(profile.sexLabel, profile.ageYears);
      const newPool = additions.filter(entry => pool.includes(entry));
      expect(newPool).toHaveLength(profile.additions);
      const occupiedStillIds = new Set<string>(), recentlyUsedStillIds: string[] = [];
      for (let index = 0; index < pool.length; index += 1) {
        const selected = selectNewPatientStillId("approved-demographic-cohort", `${profile.sexLabel}.${profile.ageYears}.${index}`, profile, { occupiedStillIds, recentlyUsedStillIds });
        expect(selected).toBeDefined();
        expect(occupiedStillIds.has(selected!)).toBe(false);
        occupiedStillIds.add(selected!); recentlyUsedStillIds.push(selected!);
      }
      expect([...occupiedStillIds].sort()).toEqual(pool.map(entry => entry.stillId).sort());
      for (const entry of newPool) expect(occupiedStillIds.has(entry.stillId)).toBe(true);
      expect(selectNewPatientStillId("approved-demographic-cohort", "exhausted", profile, { occupiedStillIds, recentlyUsedStillIds })).toBe(recentlyUsedStillIds[0]);
    }
    for (const entry of additions) {
      expect(patientStillEligibleEntries(entry.compatibleSexLabel, entry.intendedAge)).toContainEqual(entry);
      expect(patientStillEligibleEntries(entry.compatibleSexLabel === "Male" ? "Female" : "Male", entry.intendedAge)).not.toContainEqual(entry);
      expect(patientStillEligibleEntries(entry.compatibleSexLabel, 12)).not.toContainEqual(entry);
      for (const ageYears of [24, 38, 54, 70]) {
        if (entry.ageBand !== patientStillEligibleEntries(entry.compatibleSexLabel, ageYears)[0]?.ageBand) expect(patientStillEligibleEntries(entry.compatibleSexLabel, ageYears)).not.toContainEqual(entry);
      }
    }
  });

  it("reaches all twenty approved women designs before repeating a compatible pool", () => {
    const additions = PATIENT_CHARACTER_STILLS.filter(entry => entry.sourceCohort === "patient-women20-v3");
    expect(additions).toHaveLength(20);
    expect(additions.filter(entry => entry.ageBand === "adult")).toHaveLength(12);
    expect(additions.filter(entry => entry.ageBand === "middle_aged")).toHaveLength(8);
    for (const ageYears of [38, 54]) {
      const profile = { sexLabel: "Female" as const, ageYears };
      const pool = patientStillEligibleEntries(profile.sexLabel, ageYears);
      const occupiedStillIds = new Set<string>();
      const recentlyUsedStillIds: string[] = [];
      for (let index = 0; index < pool.length; index += 1) {
        const selected = selectNewPatientStillId("approved-women-cohort", `encounter.${ageYears}.${index}`, profile, { occupiedStillIds, recentlyUsedStillIds });
        expect(selected).toBeDefined();
        expect(occupiedStillIds.has(selected!)).toBe(false);
        occupiedStillIds.add(selected!);
        recentlyUsedStillIds.push(selected!);
      }
      expect([...occupiedStillIds].sort()).toEqual(pool.map(entry => entry.stillId).sort());
      for (const entry of additions.filter(entry => entry.ageBand === pool[0]!.ageBand)) expect(occupiedStillIds.has(entry.stillId)).toBe(true);
      expect(selectNewPatientStillId("approved-women-cohort", "exhausted", profile, { occupiedStillIds, recentlyUsedStillIds })).toBe(recentlyUsedStillIds[0]);
    }
    for (const entry of additions) {
      expect(entry.compatibleSexLabel).toBe("Female");
      expect(patientStillEligibleEntries("Female", entry.intendedAge)).toContainEqual(entry);
      for (const ageYears of [24, 70, entry.ageBand === "adult" ? 54 : 38]) expect(patientStillEligibleEntries("Female", ageYears)).not.toContainEqual(entry);
      expect(patientStillEligibleEntries("Male", entry.intendedAge)).not.toContainEqual(entry);
      expect(patientStillEligibleEntries("Female", 12)).not.toContainEqual(entry);
    }
  });

  it("retains every compatible saved patient still across the append-only roster expansion", () => {
    for (const entry of PATIENT_CHARACTER_STILLS) {
      const ageYears = entry.intendedAge ?? ({ young_adult: 24, adult: 38, middle_aged: 54, older_adult: 70 } as const)[entry.ageBand];
      expect(selectPatientStillId("saved-campaign", "frozen-patient", { sexLabel: entry.compatibleSexLabel, ageYears }, entry.stillId)).toBe(entry.stillId);
    }
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

  it("adds six authorized adult Level 3 designs to the existing adult-only pool", () => {
    const additions = PATIENT_CHARACTER_STILLS.filter((entry) => entry.sourceCohort === "level3-roster-v2");
    expect(additions.map((entry) => [entry.stillId, entry.compatibleSexLabel, entry.intendedAge])).toEqual([
      ["level3-roster-v2.015", "Male", 19], ["level3-roster-v2.016", "Male", 24],
      ["level3-roster-v2.017", "Male", 28], ["level3-roster-v2.018", "Female", 21],
      ["level3-roster-v2.019", "Female", 26], ["level3-roster-v2.020", "Male", 38],
    ]);
    for (const entry of additions) expect(patientStillEligibleEntries(entry.compatibleSexLabel, entry.intendedAge)).toContainEqual(entry);
    expect(patientStillEligibleEntries("Female", 12)).toEqual([]);
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
    for (const role of ["staff.surgeon", "staff.or_nurse", "staff.laboratory_technician", "staff.pharmacist", "staff.repair_person"]) {
      expect(staffStillEligibleEntries(role).filter((entry) => entry.sourceCohort === "level3-roster-v2")).toHaveLength(2);
    }
  });

  it("keeps future pediatric art excluded and retains the enabled radiologist staff pool", () => {
    const pediatric = FUTURE_PRESENTATION_CHARACTER_STILLS.filter((entry) => entry.futurePresentationKind === "pediatric");
    const radiologists = FUTURE_PRESENTATION_CHARACTER_STILLS.filter((entry) => entry.futurePresentationKind === "radiologist");
    expect(pediatric).toHaveLength(12);
    expect(pediatric.every((entry) => entry.availability === "excluded-until-future-approved-pediatric-release")).toBe(true);
    expect(radiologists).toHaveLength(0);
    expect(patientStillEligibleEntries(undefined, undefined).map((entry) => entry.stillId)).not.toContain("level3-roster-v2.021");
    expect(staffStillEligibleEntries("staff.radiologist").map(entry => entry.stillId)).toEqual([
      "level3-roster-v2.001", "level3-roster-v2.002", "level3-roster-v2.003", "level3-roster-v2.004",
    ]);
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
