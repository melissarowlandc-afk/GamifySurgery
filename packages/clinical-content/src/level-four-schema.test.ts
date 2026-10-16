import { describe, expect, it } from "vitest";
import { SYNTHETIC_CLINICAL_RELEASE } from "./synthetic-content";
import { approvedInstantiationProfileSchema, syntheticClinicalCaseSchema } from "./schema";

const pediatricProfile = { version: "pediatric-patient-profile.v1", requiresParent: true, clinicalScope: "outpatient" } as const;

function pediatricSchemaFixture() {
  const fixture = structuredClone(SYNTHETIC_CLINICAL_RELEASE.cases[0]!);
  fixture.id = "case.schema.pediatric-fixture";
  fixture.pediatricProfile = pediatricProfile;
  fixture.prototypeDemographics = { ageYears: 9, sexLabel: "Female" };
  fixture.earliestFacilityStage = 4;
  fixture.tutorialEligible = false;
  fixture.presentation = "Schema-only synthetic fixture; no teaching content authored.";
  delete fixture.prototypeVitalSigns;
  delete fixture.approvedInstantiationProfiles;
  delete fixture.selectedInstantiationProfileId;
  delete fixture.patientPresentationRevision;
  return fixture;
}

describe("Level 4 pediatric profile schema", () => {
  it("round-trips a frozen outpatient child profile without synthesizing vital signs", () => {
    const fixture = syntheticClinicalCaseSchema.parse(pediatricSchemaFixture());
    expect(syntheticClinicalCaseSchema.parse(JSON.parse(JSON.stringify(fixture)))).toEqual(fixture);
    expect(fixture.prototypeVitalSigns).toBeUndefined();
    expect(fixture.pediatricProfile).toEqual(pediatricProfile);
  });

  it("accepts the owner presentation endpoints 5 and 17 and requires explicit demographics", () => {
    for (const ageYears of [5, 9, 10, 17]) {
      expect(syntheticClinicalCaseSchema.safeParse({ ...pediatricSchemaFixture(), prototypeDemographics: { ageYears, sexLabel: "Male" } }).success).toBe(true);
    }
    for (const demographics of [undefined, { ageYears: 4, sexLabel: "Female" }, { ageYears: 18, sexLabel: "Male" }, { ageYears: 9, sexLabel: "Not specified" }]) {
      expect(syntheticClinicalCaseSchema.safeParse({ ...pediatricSchemaFixture(), prototypeDemographics: demographics }).success).toBe(false);
    }
    for (const override of [{ requiresParent: false }, { clinicalScope: "inpatient" }, { version: "pediatric-patient-profile.v2" }]) {
      expect(syntheticClinicalCaseSchema.safeParse({ ...pediatricSchemaFixture(), pediatricProfile: { ...pediatricProfile, ...override } }).success).toBe(false);
    }
  });

  it("supports exact pediatric instantiation profiles and rejects adult alternatives", () => {
    const profile = approvedInstantiationProfileSchema.parse({ id: "profile.schema.child", pediatricProfile,
      prototypeDemographics: { ageYears: 17, sexLabel: "Male" }, presentation: "Schema-only profile." });
    expect(approvedInstantiationProfileSchema.parse(JSON.parse(JSON.stringify(profile)))).toEqual(profile);
    const fixture = pediatricSchemaFixture();
    fixture.approvedInstantiationProfiles = [profile];
    fixture.selectedInstantiationProfileId = profile.id;
    expect(syntheticClinicalCaseSchema.safeParse(fixture).success).toBe(true);
    profile.prototypeDemographics = { ageYears: 30, sexLabel: "Male" };
    expect(syntheticClinicalCaseSchema.safeParse(fixture).success).toBe(false);
    delete profile.prototypeDemographics;
    expect(approvedInstantiationProfileSchema.safeParse(profile).success).toBe(false);
  });

  it("retains legacy cases and the unapproved release without adding pediatric records", () => {
    for (const fixture of SYNTHETIC_CLINICAL_RELEASE.cases) {
      expect(syntheticClinicalCaseSchema.parse(fixture)).toEqual(fixture);
    }
    expect(SYNTHETIC_CLINICAL_RELEASE.publicationStatus).toBe("synthetic_unapproved_prototype");
    expect(SYNTHETIC_CLINICAL_RELEASE.cases.some((fixture) => fixture.id === "case.schema.pediatric-fixture")).toBe(false);
    expect(syntheticClinicalCaseSchema.safeParse({ ...pediatricSchemaFixture(), earliestFacilityStage: 5 }).success).toBe(false);
  });
});
