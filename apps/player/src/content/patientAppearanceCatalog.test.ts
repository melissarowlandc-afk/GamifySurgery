import { describe, expect, it } from "vitest";
import {
  CURRENT_HUMAN_PATIENT_APPEARANCE_CATALOG,
  FUTURE_HUMAN_PATIENT_ROSTER_TARGET,
  RESERVED_FUTURE_HUMAN_PATIENT_ID_PREFIX,
  patientRosterEligibleEntries,
} from "./patientAppearanceCatalog";

describe("patient appearance catalog expansion seam", () => {
  it("honestly exposes the current fifty-person authored adult roster, not a fabricated 150", () => {
    expect(CURRENT_HUMAN_PATIENT_APPEARANCE_CATALOG).toHaveLength(50);
    expect(CURRENT_HUMAN_PATIENT_APPEARANCE_CATALOG.length).toBeLessThan(FUTURE_HUMAN_PATIENT_ROSTER_TARGET);
    expect(CURRENT_HUMAN_PATIENT_APPEARANCE_CATALOG.every((entry) => entry.artStatus === "authored")).toBe(true);
    expect(CURRENT_HUMAN_PATIENT_APPEARANCE_CATALOG.every((entry) => entry.human)).toBe(true);
    expect(new Set(CURRENT_HUMAN_PATIENT_APPEARANCE_CATALOG.map((entry) => entry.id)).size).toBe(50);
    expect(RESERVED_FUTURE_HUMAN_PATIENT_ID_PREFIX).toBe("patient.human.future.");
  });

  it("exposes only chart-compatible adult presentation identities", () => {
    const feminine = patientRosterEligibleEntries("Female", 26);
    const masculine = patientRosterEligibleEntries("Male", 71);
    expect(feminine.every((entry) => entry.compatibleSexLabel === "Female" && entry.ageBand === "young_adult")).toBe(true);
    expect(masculine.every((entry) => entry.compatibleSexLabel === "Male" && entry.ageBand === "older_adult")).toBe(true);
  });
});
