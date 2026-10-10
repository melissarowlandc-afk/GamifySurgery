import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { SYNTHETIC_CLINICAL_RELEASE } from "@gamify-surgery/clinical-content";
import { PEDIATRIC_CHARACTER_STILLS, pediatricStillEligibleEntries, patientStillEligibleEntries,
  createPatientPixelAppearance, createPatientDisplayName, completePatientDemographics,
  selectPatientStillId, pediatricCaseHasCompatibleIdentity } from "../src";

describe("M5a pediatric identity", () => {
  it("reviews all twelve source briefs without inferring sex from their pixels", () => {
    const source = JSON.parse(readFileSync(new URL("../../../tools/character-mapping/level3-roster-complete-v2/roster.json", import.meta.url), "utf8"));
    expect(PEDIATRIC_CHARACTER_STILLS).toHaveLength(12);
    for (const entry of PEDIATRIC_CHARACTER_STILLS) {
      const row = source.identities.find((identity: { stableId: string }) => identity.stableId === entry.stillId);
      expect(row.visualAge).toBe(entry.intendedVisualAge);
      expect(row.brief.startsWith(entry.compatibleSexLabel === "Female" ? "girl" : "boy")).toBe(true);
      expect([entry.minimumAge, entry.maximumAge]).toEqual(row.targetKey === "younger-child" ? [5, 8] : row.targetKey === "older-child" ? [9, 12] : [13, 17]);
    }
  });

  it("covers both sexes at every launch age, never using an adult identity", () => {
    for (let ageYears = 5; ageYears <= 17; ageYears++) for (const sexLabel of ["Female", "Male"] as const) {
      const eligible = pediatricStillEligibleEntries(sexLabel, ageYears);
      expect(eligible.length).toBeGreaterThan(0);
      for (let index = 0; index < 20; index++) {
        const appearance = createPatientPixelAppearance("child.identity", `child.${ageYears}.${sexLabel}.${index}`, { ageYears, sexLabel });
        expect(eligible.some(entry => entry.stillId === appearance.stillId)).toBe(true);
        expect(appearance.patientIdentityId).toBeUndefined();
        expect(selectPatientStillId("reload", "child", { ageYears, sexLabel }, appearance.stillId)).toBe(appearance.stillId);
        const name = createPatientDisplayName("child.identity", "child.name", sexLabel);
        expect(createPatientDisplayName("child.identity", "child.name", sexLabel)).toBe(name);
      }
      expect(patientStillEligibleEntries(sexLabel, ageYears)).toEqual([]);
    }
  });

  it("rejects missing/out-of-range pediatric demographics and arbitrary/adult saved stills", () => {
    for (const ageYears of [0, 4, 18, 30]) expect(pediatricStillEligibleEntries("Male", ageYears)).toEqual([]);
    expect(pediatricStillEligibleEntries("Not specified", 8)).toEqual([]);
    expect(selectPatientStillId("seed", "child", { ageYears: 8, sexLabel: "Male" }, "patient.adult.001")).toMatch(/^level3-roster-v2\./);
    expect(selectPatientStillId("seed", "child", { ageYears: 4, sexLabel: "Male" }, "future.unknown")).toBeUndefined();
    expect(() => completePatientDemographics({ caseId: "fixture", campaignSeed: "s", encounterId: "c", pediatric: true })).toThrow("explicit age");
    const demographics = { ageYears: 9, sexLabel: "Female" as const };
    expect(completePatientDemographics({ caseId: "fixture", campaignSeed: "s", encounterId: "c", pediatric: true, demographics })).toEqual(demographics);
    const fixture = structuredClone(SYNTHETIC_CLINICAL_RELEASE.cases[0]!);
    fixture.prototypeDemographics = demographics;
    expect(pediatricCaseHasCompatibleIdentity(fixture)).toBe(false);
    fixture.pediatricProfile = { version: "pediatric-patient-profile.v1", requiresParent: true, clinicalScope: "outpatient" };
    expect(pediatricCaseHasCompatibleIdentity(fixture)).toBe(true);
    fixture.prototypeDemographics = { ageYears: 4, sexLabel: "Female" };
    expect(pediatricCaseHasCompatibleIdentity(fixture)).toBe(false);
  });
});
