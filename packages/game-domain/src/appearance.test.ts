import { describe, expect, it } from "vitest";
import {
  createPatientPixelAppearance,
  createPixelAppearance,
  normalizePatientAppearanceForSex,
} from "./appearance";
import {
  AUTHORED_ADULT_PATIENT_ROSTER,
  patientRosterEntryById,
} from "./patientAppearanceCatalog";

describe("coherent rendered appearance families", () => {
  it("generates matching human head/body identities for staff and patients", () => {
    for (const role of ["patient", "receptionist", "imaging_technician"] as const) {
      for (let index = 0; index < 24; index += 1) {
        const appearance = createPixelAppearance("appearance-seed", role === "patient" ? "patient" : "staff", `subject-${role}-${index}`, role);
        expect(appearance.headVariant).toBe(appearance.bodyVariant);
      }
    }
  });

  it("keeps sex-label presentation in a coherent human family without using it clinically", () => {
    const base = createPixelAppearance("appearance-seed", "patient", "patient", "patient");
    for (const sex of ["Female", "Male", "Not specified"] as const) {
      const appearance = sex === "Not specified"
        ? createPatientPixelAppearance("appearance-seed", "patient-unspecified")
        : normalizePatientAppearanceForSex(base, sex);
      expect(appearance.headVariant).toBe(appearance.bodyVariant);
      expect(appearance.headVariant).toBeLessThan(20);
      expect(patientRosterEntryById(appearance.patientIdentityId)).toBeDefined();
    }
  });

  it("selects a stable authored adult identity from already-frozen demographics", () => {
    const profile = { sexLabel: "Female" as const, ageYears: 67 };
    const first = createPatientPixelAppearance("appearance-seed", "encounter-roster", profile);
    const second = createPatientPixelAppearance("appearance-seed", "encounter-roster", profile);
    expect(first.patientIdentityId).toBe(second.patientIdentityId);
    expect(patientRosterEntryById(first.patientIdentityId)?.compatibleSexLabel).toBe("Female");
    expect(patientRosterEntryById(first.patientIdentityId)?.ageBand).toBe("older_adult");
  });

  it("keeps legacy descriptors save-safe while assigning a deterministic roster identity", () => {
    const legacy = createPixelAppearance("appearance-seed", "patient", "legacy", "patient");
    const first = normalizePatientAppearanceForSex(legacy, "Male", 38, "legacy-save-key");
    const second = normalizePatientAppearanceForSex(legacy, "Male", 38, "legacy-save-key");
    expect(first.patientIdentityId).toBe(second.patientIdentityId);
    expect(patientRosterEntryById(first.patientIdentityId)?.compatibleSexLabel).toBe("Male");
    expect(patientRosterEntryById(first.patientIdentityId)?.ageBand).toBe("adult");
  });

  it("contains fifty distinct, all-human adult visual records", () => {
    expect(AUTHORED_ADULT_PATIENT_ROSTER).toHaveLength(50);
    expect(new Set(AUTHORED_ADULT_PATIENT_ROSTER.map((entry) => entry.id)).size).toBe(50);
    expect(AUTHORED_ADULT_PATIENT_ROSTER.every((entry) => entry.human && entry.artStatus === "authored")).toBe(true);
    expect(AUTHORED_ADULT_PATIENT_ROSTER.filter((entry) => entry.compatibleSexLabel === "Female")).toHaveLength(25);
    expect(AUTHORED_ADULT_PATIENT_ROSTER.filter((entry) => entry.compatibleSexLabel === "Male")).toHaveLength(25);
  });

  it("keeps ambient-pedestrian identity selection separate from encounter selection", () => {
    const profile = { sexLabel: "Male" as const, ageYears: 51 };
    const before = createPatientPixelAppearance("shared-seed", "encounter.17", profile);
    const passer = createPatientPixelAppearance(
      "shared-seed",
      "ambient-pedestrian.17",
      {},
      "ambient-pedestrian",
    );
    const after = createPatientPixelAppearance("shared-seed", "encounter.17", profile);
    expect(after.patientIdentityId).toBe(before.patientIdentityId);
    expect(passer.patientIdentityId).toMatch(/^patient\.adult\.\d{3}$/);
  });

  it("does not misrepresent a pediatric chart as an adult roster identity", () => {
    const child = createPatientPixelAppearance(
      "appearance-seed",
      "encounter-pediatric-fallback",
      { sexLabel: "Female", ageYears: 12 },
    );
    expect(child.patientIdentityId).toBeUndefined();
  });
});
