import { describe, expect, it } from "vitest";
import { PROTOTYPE_BALANCE_RELEASE } from "@gamify-surgery/balance-config";
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
  PEDIATRIC_CHARACTER_STILLS,
  STAFF_CHARACTER_STILLS,
  founderStillIdForPresetIds,
  patientStillEligibleEntries,
  staffStillEligibleEntries,
  withExplicitAdditionalAvatarStill,
} from "./characterStillCatalog";

describe("character still selection catalog", () => {
  it("covers all 318 packaged identities through explicit selection categories", () => {
    expect(CHARACTER_STILL_CATALOG).toHaveLength(318);
    expect(new Set(CHARACTER_STILL_CATALOG.map((entry) => entry.stillId)).size).toBe(318);
    expect(PATIENT_CHARACTER_STILLS).toHaveLength(179);
    expect(STAFF_CHARACTER_STILLS).toHaveLength(91);
    expect(FOUNDER_STILL_IDS).toHaveLength(30);
    expect(EXPLICIT_ADDITIONAL_AVATAR_STILLS).toHaveLength(6);
    expect(FUTURE_PRESENTATION_CHARACTER_STILLS).toHaveLength(0);
    expect(PEDIATRIC_CHARACTER_STILLS).toHaveLength(12);
  });

  it("admits the twenty manager-approved v6a patients only to their exact sex and age-band pools", () => {
    const additions = PATIENT_CHARACTER_STILLS.filter(entry => entry.sourceCohort === "patient-gapfill-v6a");
    expect(additions.map(entry => [entry.stillId, entry.compatibleSexLabel, entry.intendedAge])).toEqual([
      ["patient-gapfill-v6a.001", "Female", 45], ["patient-gapfill-v6a.002", "Female", 48],
      ["patient-gapfill-v6a.003", "Female", 51], ["patient-gapfill-v6a.004", "Female", 54],
      ["patient-gapfill-v6a.005", "Female", 57], ["patient-gapfill-v6a.006", "Female", 60],
      ["patient-gapfill-v6a.007", "Female", 63], ["patient-gapfill-v6a.008", "Male", 46],
      ["patient-gapfill-v6a.009", "Male", 49], ["patient-gapfill-v6a.010", "Male", 52],
      ["patient-gapfill-v6a.011", "Male", 55], ["patient-gapfill-v6a.012", "Male", 58],
      ["patient-gapfill-v6a.013", "Male", 62], ["patient-gapfill-v6a.014", "Female", 31],
      ["patient-gapfill-v6a.015", "Female", 35], ["patient-gapfill-v6a.016", "Female", 39],
      ["patient-gapfill-v6a.017", "Female", 43], ["patient-gapfill-v6a.018", "Male", 32],
      ["patient-gapfill-v6a.019", "Male", 37], ["patient-gapfill-v6a.020", "Male", 44],
    ]);
    for (const entry of additions) {
      for (const sexLabel of ["Female", "Male"] as const) {
        for (const [ageYears, ageBand] of [
          [18, "young_adult"], [29, "young_adult"], [30, "adult"], [44, "adult"],
          [45, "middle_aged"], [64, "middle_aged"], [65, "older_adult"], [90, "older_adult"],
        ] as const) {
          expect(patientStillEligibleEntries(sexLabel, ageYears).includes(entry)).toBe(
            entry.compatibleSexLabel === sexLabel && entry.ageBand === ageBand,
          );
        }
      }
      expect(patientStillEligibleEntries(entry.compatibleSexLabel, 12)).not.toContainEqual(entry);
      for (const staff of STAFF_CHARACTER_STILLS) expect(staff.stillId).not.toBe(entry.stillId);
    }
  });

  it("reaches every v6a addition before reuse and keeps occupied, free, LRU and saved-ID behavior", () => {
    for (const profile of [
      { sexLabel: "Female", ageYears: 38, total: 30, added: 4 },
      { sexLabel: "Male", ageYears: 38, total: 24, added: 3 },
      { sexLabel: "Female", ageYears: 54, total: 36, added: 7 },
      { sexLabel: "Male", ageYears: 54, total: 31, added: 6 },
    ] as const) {
      const pool = patientStillEligibleEntries(profile.sexLabel, profile.ageYears);
      expect(pool).toHaveLength(profile.total);
      expect(pool.filter(entry => entry.sourceCohort === "patient-gapfill-v6a")).toHaveLength(profile.added);
      const occupiedStillIds = new Set<string>(), recentlyUsedStillIds: string[] = [];
      for (let index = 0; index < pool.length; index += 1) {
        const selected = selectNewPatientStillId("v6a-pools", `${profile.sexLabel}.${profile.ageYears}.${index}`, profile, { occupiedStillIds, recentlyUsedStillIds });
        expect(selected).toBeDefined(); expect(occupiedStillIds.has(selected!)).toBe(false);
        occupiedStillIds.add(selected!); recentlyUsedStillIds.push(selected!);
      }
      expect([...occupiedStillIds].sort()).toEqual(pool.map(entry => entry.stillId).sort());
      expect(selectNewPatientStillId("v6a-pools", "full", profile, { occupiedStillIds, recentlyUsedStillIds })).toBe(recentlyUsedStillIds[0]);
      const recent = recentlyUsedStillIds.at(-1)!;
      occupiedStillIds.delete(recent);
      expect(selectNewPatientStillId("v6a-pools", "one-free", profile, { occupiedStillIds, recentlyUsedStillIds })).toBe(recent);
      for (const entry of pool) expect(selectPatientStillId("saved-campaign", "frozen-patient", profile, entry.stillId)).toBe(entry.stillId);
    }
  });

  it("admits the twenty manager-approved v6b patients only to their exact sex and age-band pools", () => {
    const additions = PATIENT_CHARACTER_STILLS.filter(entry => entry.sourceCohort === "patient-gapfill-v6b");
    expect(additions.map(entry => [entry.stillId, entry.compatibleSexLabel, entry.intendedAge])).toEqual([
      ["patient-gapfill-v6b.001", "Female", 46],
      ["patient-gapfill-v6b.002", "Female", 49],
      ["patient-gapfill-v6b.003", "Female", 52],
      ["patient-gapfill-v6b.004", "Female", 55],
      ["patient-gapfill-v6b.005", "Female", 58],
      ["patient-gapfill-v6b.006", "Female", 61],
      ["patient-gapfill-v6b.007", "Female", 64],
      ["patient-gapfill-v6b.008", "Male", 45],
      ["patient-gapfill-v6b.009", "Male", 48],
      ["patient-gapfill-v6b.010", "Male", 51],
      ["patient-gapfill-v6b.011", "Male", 54],
      ["patient-gapfill-v6b.012", "Male", 59],
      ["patient-gapfill-v6b.013", "Male", 63],
      ["patient-gapfill-v6b.014", "Male", 30],
      ["patient-gapfill-v6b.015", "Male", 34],
      ["patient-gapfill-v6b.016", "Male", 38],
      ["patient-gapfill-v6b.017", "Male", 42],
      ["patient-gapfill-v6b.018", "Female", 32],
      ["patient-gapfill-v6b.019", "Female", 37],
      ["patient-gapfill-v6b.020", "Female", 44],
    ]);
    for (const entry of additions) {
      for (const sexLabel of ["Female", "Male"] as const) {
        for (const [ageYears, ageBand] of [
          [18, "young_adult"], [29, "young_adult"], [30, "adult"], [44, "adult"],
          [45, "middle_aged"], [64, "middle_aged"], [65, "older_adult"], [90, "older_adult"],
        ] as const) {
          expect(patientStillEligibleEntries(sexLabel, ageYears).includes(entry)).toBe(
            entry.compatibleSexLabel === sexLabel && entry.ageBand === ageBand,
          );
        }
      }
      expect(patientStillEligibleEntries(entry.compatibleSexLabel, 12)).not.toContainEqual(entry);
      for (const staff of STAFF_CHARACTER_STILLS) expect(staff.stillId).not.toBe(entry.stillId);
    }
  });

  it("reaches every v6b addition before reuse and keeps occupied, free, LRU and saved-ID behavior", () => {
    for (const profile of [
      { sexLabel: "Female", ageYears: 38, total: 30, added: 3 },
      { sexLabel: "Male", ageYears: 38, total: 24, added: 4 },
      { sexLabel: "Female", ageYears: 54, total: 36, added: 7 },
      { sexLabel: "Male", ageYears: 54, total: 31, added: 6 },
    ] as const) {
      const pool = patientStillEligibleEntries(profile.sexLabel, profile.ageYears);
      expect(pool).toHaveLength(profile.total);
      expect(pool.filter(entry => entry.sourceCohort === "patient-gapfill-v6b")).toHaveLength(profile.added);
      const occupiedStillIds = new Set<string>(), recentlyUsedStillIds: string[] = [];
      for (let index = 0; index < pool.length; index += 1) {
        const selected = selectNewPatientStillId("v6b-pools", `${profile.sexLabel}.${profile.ageYears}.${index}`, profile, { occupiedStillIds, recentlyUsedStillIds });
        expect(selected).toBeDefined(); expect(occupiedStillIds.has(selected!)).toBe(false);
        occupiedStillIds.add(selected!); recentlyUsedStillIds.push(selected!);
      }
      expect([...occupiedStillIds].sort()).toEqual(pool.map(entry => entry.stillId).sort());
      expect(selectNewPatientStillId("v6b-pools", "full", profile, { occupiedStillIds, recentlyUsedStillIds })).toBe(recentlyUsedStillIds[0]);
      const recent = recentlyUsedStillIds.at(-1)!;
      occupiedStillIds.delete(recent);
      expect(selectNewPatientStillId("v6b-pools", "one-free", profile, { occupiedStillIds, recentlyUsedStillIds })).toBe(recent);
      for (const entry of pool) expect(selectPatientStillId("saved-campaign", "frozen-patient", profile, entry.stillId)).toBe(entry.stillId);
    }
  });

  it("admits the nineteen corrected manager-approved v6c patients only to their exact adult pools", () => {
    const additions = PATIENT_CHARACTER_STILLS.filter(entry => entry.sourceCohort === "patient-gapfill-v6c");
    expect(additions.map(entry => [entry.stillId, entry.compatibleSexLabel, entry.intendedAge])).toEqual([
      ["patient-gapfill-v6c.001", "Female", 65],
      ["patient-gapfill-v6c.002", "Female", 68],
      ["patient-gapfill-v6c.003", "Female", 72],
      ["patient-gapfill-v6c.004", "Female", 76],
      ["patient-gapfill-v6c.005", "Female", 80],
      ["patient-gapfill-v6c.006", "Female", 84],
      ["patient-gapfill-v6c.007", "Female", 88],
      ["patient-gapfill-v6c.008", "Male", 65],
      ["patient-gapfill-v6c.009", "Male", 68],
      ["patient-gapfill-v6c.010", "Male", 71],
      ["patient-gapfill-v6c.011", "Male", 74],
      ["patient-gapfill-v6c.012", "Male", 77],
      ["patient-gapfill-v6c.013", "Male", 81],
      ["patient-gapfill-v6c.014", "Male", 85],
      ["patient-gapfill-v6c.015", "Male", 88],
      ["patient-gapfill-v6c.016", "Female", 34],
      ["patient-gapfill-v6c.017", "Female", 42],
      ["patient-gapfill-v6c.018", "Male", 33],
      ["patient-gapfill-v6c.019", "Male", 43],
    ]);
    for (const entry of additions) {
      for (const sexLabel of ["Female", "Male"] as const) for (const [ageYears, ageBand] of [
        [18, "young_adult"], [29, "young_adult"], [30, "adult"], [44, "adult"],
        [45, "middle_aged"], [64, "middle_aged"], [65, "older_adult"], [90, "older_adult"],
      ] as const) expect(patientStillEligibleEntries(sexLabel, ageYears).includes(entry)).toBe(entry.compatibleSexLabel === sexLabel && entry.ageBand === ageBand);
      expect(patientStillEligibleEntries(entry.compatibleSexLabel, 17)).not.toContainEqual(entry);
      expect(STAFF_CHARACTER_STILLS.some(staff => staff.stillId === entry.stillId)).toBe(false);
    }
  });

  it("reaches every v6c patient before reuse and preserves occupied, free, LRU and compatible saved IDs", () => {
    for (const profile of [
      { sexLabel: "Female", ageYears: 38, total: 30, added: 2 },
      { sexLabel: "Male", ageYears: 38, total: 24, added: 2 },
      { sexLabel: "Female", ageYears: 70, total: 20, added: 7 },
      { sexLabel: "Male", ageYears: 70, total: 20, added: 8 },
    ] as const) {
      const pool = patientStillEligibleEntries(profile.sexLabel, profile.ageYears);
      expect(pool).toHaveLength(profile.total);
      expect(pool.filter(entry => entry.sourceCohort === "patient-gapfill-v6c")).toHaveLength(profile.added);
      const occupiedStillIds = new Set<string>(), recentlyUsedStillIds: string[] = [];
      for (let index = 0; index < pool.length; index += 1) {
        const selected = selectNewPatientStillId("v6c-pools", `${profile.sexLabel}.${index}`, profile, { occupiedStillIds, recentlyUsedStillIds });
        expect(selected).toBeDefined(); expect(occupiedStillIds.has(selected!)).toBe(false);
        occupiedStillIds.add(selected!); recentlyUsedStillIds.push(selected!);
      }
      expect([...occupiedStillIds].sort()).toEqual(pool.map(entry => entry.stillId).sort());
      expect(selectNewPatientStillId("v6c-pools", "full", profile, { occupiedStillIds, recentlyUsedStillIds })).toBe(recentlyUsedStillIds[0]);
      const recent = recentlyUsedStillIds.at(-1)!; occupiedStillIds.delete(recent);
      expect(selectNewPatientStillId("v6c-pools", "free", profile, { occupiedStillIds, recentlyUsedStillIds })).toBe(recent);
      for (const entry of pool) expect(selectPatientStillId("saved-campaign", "frozen-patient", profile, entry.stillId)).toBe(entry.stillId);
    }
  });

  it("admits all fourteen manager-approved v6d staff only to their single assigned role", () => {
    const rolePools = [
      ["staff.imaging_technician", 5], ["staff.phlebotomist", 5],
      ["staff.laboratory_technician", 4], ["staff.surgeon", 4], ["staff.or_nurse", 4],
      ["staff.pharmacist", 4], ["staff.repair_person", 4],
    ] as const;
    const additions = STAFF_CHARACTER_STILLS.filter(entry => entry.sourceCohort === "staff-gapfill-v6d");
    expect(additions).toHaveLength(14);
    const allRoles = [...PROTOTYPE_BALANCE_RELEASE.facility.staffRoleDefinitions.map(role => role.id), "staff.app", "staff.executive"];
    for (const [index, entry] of additions.entries()) {
      const assignedRole = rolePools[Math.floor(index / 2)]![0];
      expect(entry.stillId).toBe(`staff-gapfill-v6d.${String(index + 1).padStart(3, "0")}`);
      expect(entry.eligibleStaffRoleDefinitionIds).toEqual([assignedRole]);
      for (const role of allRoles) expect(staffStillEligibleEntries(role).includes(entry)).toBe(role === assignedRole);
      expect(patientStillEligibleEntries()).not.toContainEqual(entry);
    }
    for (const [role, size] of rolePools) {
      const pool = staffStillEligibleEntries(role);
      expect(pool).toHaveLength(size);
      expect(pool.filter(entry => entry.sourceCohort === "staff-gapfill-v6d")).toHaveLength(2);
    }
  });

  it("reaches every v6d role look without collisions and never displaces a compatible current employee", () => {
    for (const role of ["staff.imaging_technician", "staff.phlebotomist", "staff.laboratory_technician", "staff.surgeon", "staff.or_nurse", "staff.pharmacist", "staff.repair_person"]) {
      const pool = staffStillEligibleEntries(role), occupied = new Set<string>();
      for (let index = 0; index < pool.length; index += 1) {
        const selected = selectStaffStillId("v6d-hires", `${role}.${index}`, role, undefined, occupied);
        expect(selected).toBeDefined(); expect(occupied.has(selected!)).toBe(false); occupied.add(selected!);
      }
      expect([...occupied].sort()).toEqual(pool.map(entry => entry.stillId).sort());
      expect(selectStaffStillId("v6d-hires", "exhausted", role, undefined, occupied)).toBeUndefined();
      for (const entry of pool) {
        const otherCurrentOrDepartingIds = new Set(STAFF_CHARACTER_STILLS.filter(other => other.stillId !== entry.stillId).map(other => other.stillId));
        expect(selectStaffStillId("saved-campaign", "current-employee", role, entry.stillId, otherCurrentOrDepartingIds)).toBe(entry.stillId);
        const allOccupied = new Set([...otherCurrentOrDepartingIds, entry.stillId]);
        expect(selectStaffStillId("saved-campaign", "new-hire", role, undefined, allOccupied)).toBeUndefined();
      }
      const additions = pool.filter(entry => entry.sourceCohort === "staff-gapfill-v6d");
      const existingEmployees = new Set(pool.filter(entry => entry.sourceCohort !== "staff-gapfill-v6d").map(entry => entry.stillId));
      for (let index = 0; index < additions.length; index += 1) {
        const selected = selectStaffStillId("saved-campaign", `rehire.${index}`, role, undefined, existingEmployees)!;
        expect(additions.some(entry => entry.stillId === selected)).toBe(true); expect(existingEmployees.has(selected)).toBe(false); existingEmployees.add(selected);
      }
    }
  });

  it("selects all twelve new radiologists without collisions and retains existing saved staff IDs", () => {
    const pool = staffStillEligibleEntries("staff.radiologist");
    const additions = pool.filter(entry => entry.sourceCohort === "future-roster20-v5");
    expect(additions).toHaveLength(12);
    expect(pool).toHaveLength(16);
    const occupied = new Set<string>();
    for (let index = 0; index < pool.length; index += 1) {
      const selected = selectStaffStillId("GS-033-radiologists", `employee.${index}`, "staff.radiologist", undefined, occupied);
      expect(selected).toBeDefined();
      expect(occupied.has(selected!)).toBe(false);
      occupied.add(selected!);
    }
    expect([...occupied].sort()).toEqual(pool.map(entry => entry.stillId).sort());
    for (const entry of STAFF_CHARACTER_STILLS) for (const role of entry.eligibleStaffRoleDefinitionIds) {
      expect(selectStaffStillId("saved-campaign", "saved-employee", role, entry.stillId)).toBe(entry.stillId);
    }
  });

  it("enables only the two authored APP looks and keeps executives excluded", () => {
    const inactive = STAFF_CHARACTER_STILLS.filter(entry => entry.sourceCohort === "future-roster20-v5" && entry.eligibleStaffRoleDefinitionIds.length === 0);
    expect(inactive.map(entry => entry.stillId)).toEqual(["future-roster20-v5.003", "future-roster20-v5.004"]);
    const roleIds = [...PROTOTYPE_BALANCE_RELEASE.facility.staffRoleDefinitions.map(role => role.id), "staff.app", "staff.executive"];
    for (const role of roleIds) for (const entry of inactive) {
      expect(staffStillEligibleEntries(role)).not.toContainEqual(entry);
      expect(selectStaffStillId("GS-033-inactive", "new-hire", role, entry.stillId)).not.toBe(entry.stillId);
    }
    for (const entry of inactive) expect(patientStillEligibleEntries()).not.toContainEqual(entry);
    expect(staffStillEligibleEntries("staff.app").map(entry => entry.stillId)).toEqual(["future-roster20-v5.001", "future-roster20-v5.002"]);
    expect(selectStaffStillId("GS-033-inactive", "executive", "staff.executive")).toBeUndefined();
  });

  it("reaches all four GS-033 patients using unchanged compatible occupancy and LRU selection", () => {
    const additions = PATIENT_CHARACTER_STILLS.filter(entry => entry.sourceCohort === "future-roster20-v5");
    expect(additions.map(entry => [entry.stillId, entry.compatibleSexLabel, entry.intendedAge])).toEqual([
      ["future-roster20-v5.017", "Male", 41], ["future-roster20-v5.018", "Female", 54],
      ["future-roster20-v5.019", "Male", 57], ["future-roster20-v5.020", "Female", 69],
    ]);
    for (const entry of additions) {
      const profile = { sexLabel: entry.compatibleSexLabel, ageYears: entry.intendedAge };
      const pool = patientStillEligibleEntries(profile.sexLabel, profile.ageYears);
      expect(pool).toContainEqual(entry);
      expect(patientStillEligibleEntries(profile.sexLabel === "Male" ? "Female" : "Male", profile.ageYears)).not.toContainEqual(entry);
      expect(patientStillEligibleEntries(profile.sexLabel, 12)).not.toContainEqual(entry);
      for (const ageYears of [24, 38, 54, 70]) if (pool[0]!.ageBand !== patientStillEligibleEntries(profile.sexLabel, ageYears)[0]!.ageBand) {
        expect(patientStillEligibleEntries(profile.sexLabel, ageYears)).not.toContainEqual(entry);
      }
      const occupiedStillIds = new Set<string>(), recentlyUsedStillIds: string[] = [];
      for (let index = 0; index < pool.length; index += 1) {
        const selected = selectNewPatientStillId("GS-033-patients", `${entry.stillId}.${index}`, profile, { occupiedStillIds, recentlyUsedStillIds });
        expect(selected).toBeDefined();
        expect(occupiedStillIds.has(selected!)).toBe(false);
        occupiedStillIds.add(selected!); recentlyUsedStillIds.push(selected!);
      }
      expect([...occupiedStillIds].sort()).toEqual(pool.map(candidate => candidate.stillId).sort());
      expect(selectNewPatientStillId("GS-033-patients", "exhausted", profile, { occupiedStillIds, recentlyUsedStillIds })).toBe(recentlyUsedStillIds[0]);
      expect(selectPatientStillId("saved-campaign", "saved-patient", profile, entry.stillId)).toBe(entry.stillId);
    }
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
    expect(createPatientPixelAppearance("child-seed", "child", { sexLabel: "Female", ageYears: 12 }).stillId).toMatch(/^level3-roster-v2\./);
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

  it("keeps pediatric art separate from adult selection and retains the radiologist staff pool", () => {
    const pediatric = PEDIATRIC_CHARACTER_STILLS;
    const radiologists = FUTURE_PRESENTATION_CHARACTER_STILLS.filter((entry) => entry.futurePresentationKind === "radiologist");
    expect(pediatric).toHaveLength(12);
    expect(pediatric.every((entry) => entry.minimumAge >= 5 && entry.maximumAge <= 17)).toBe(true);
    expect(radiologists).toHaveLength(0);
    expect(patientStillEligibleEntries(undefined, undefined).map((entry) => entry.stillId)).not.toContain("level3-roster-v2.021");
    expect(staffStillEligibleEntries("staff.radiologist").filter(entry => entry.sourceCohort === "level3-roster-v2").map(entry => entry.stillId)).toEqual([
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
