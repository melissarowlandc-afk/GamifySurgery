import { describe, expect, it } from "vitest";
import { createPatientPixelAppearance } from "./appearance";
import { PROTOTYPE_DOMAIN_CONTEXT } from "./context";
import { completePatientDemographics } from "./patientDemographics";
import { patientRosterEntryById } from "./patientAppearanceCatalog";

describe("patient demographic completion", () => {
  it("completes every active case or profile with an adult display identity without changing source content", () => {
    const before = JSON.stringify(PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases);
    for (const clinicalCase of PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases) {
      const variants = clinicalCase.approvedInstantiationProfiles?.length
        ? clinicalCase.approvedInstantiationProfiles
        : [clinicalCase];
      for (const [index, variant] of variants.entries()) {
        const demographics = completePatientDemographics({
          caseId: clinicalCase.id,
          campaignSeed: "identity-coverage",
          encounterId: `encounter.${clinicalCase.id}.${index}`,
          demographics: variant.prototypeDemographics,
        });
        expect(demographics.ageYears, clinicalCase.id).toBeGreaterThanOrEqual(18);
        expect(["Female", "Male"], clinicalCase.id).toContain(demographics.sexLabel);
        const appearance = createPatientPixelAppearance(
          "identity-coverage",
          `encounter.${clinicalCase.id}.${index}`,
          demographics,
        );
        const rosterIdentity = patientRosterEntryById(appearance.patientIdentityId);
        expect(rosterIdentity, clinicalCase.id).toBeDefined();
        expect(rosterIdentity?.compatibleSexLabel, clinicalCase.id).toBe(
          demographics.sexLabel,
        );
      }
    }
    expect(JSON.stringify(PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases)).toBe(before);
  });

  it("preserves valid authored demographics and honors the FHH age constraints", () => {
    expect(completePatientDemographics({
      caseId: "case.explicit",
      campaignSeed: "seed",
      encounterId: "encounter.explicit",
      demographics: { ageYears: 67, sexLabel: "Female" },
    })).toEqual({ ageYears: 67, sexLabel: "Female" });
    expect(["Female", "Male"]).toContain(completePatientDemographics({
      caseId: "case.explicit-unspecified",
      campaignSeed: "seed",
      encounterId: "encounter.explicit-unspecified",
      demographics: { ageYears: 42, sexLabel: "Not specified" },
    }).sexLabel);
    expect(completePatientDemographics({
      caseId: "case.fhh.evaluation-to-confirmed-management",
      campaignSeed: "seed",
      encounterId: "encounter.fhh.27",
    }).ageYears).toBe(27);
    const youngAdult = completePatientDemographics({
      caseId: "case.fhh.suggestive-results-confirmation",
      campaignSeed: "seed",
      encounterId: "encounter.fhh.young",
    });
    expect(youngAdult.ageYears).toBeGreaterThanOrEqual(18);
    expect(youngAdult.ageYears).toBeLessThanOrEqual(29);
    expect(completePatientDemographics({
      caseId: "case.pancreatic-tail-adenocarcinoma.clinic-counseling",
      campaignSeed: "seed",
      encounterId: "encounter.pancreatic-older",
    }).ageYears).toBeGreaterThanOrEqual(65);
    const middleAged = completePatientDemographics({
      caseId: "case.choledochal-cyst.type-iva.2a",
      campaignSeed: "seed",
      encounterId: "encounter.choledochal-middle",
    });
    expect(middleAged.ageYears).toBeGreaterThanOrEqual(45);
    expect(middleAged.ageYears).toBeLessThanOrEqual(64);
    expect(completePatientDemographics({
      caseId: "case.anal-hsil.hpv.3d",
      campaignSeed: "seed",
      encounterId: "encounter.anal-hsil",
    }).sexLabel).toBe("Female");
  });

  it("uses a compatible saved catalog identity only for medically unconstrained missing values", () => {
    const savedIdentityId = "patient.adult.009" as const;
    const savedIdentity = patientRosterEntryById(savedIdentityId)!;
    const restored = completePatientDemographics({
      caseId: "case.legacy.generic",
      campaignSeed: "seed",
      encounterId: "encounter.legacy",
      savedPatientIdentityId: savedIdentityId,
    });
    expect(restored.sexLabel).toBe(savedIdentity.compatibleSexLabel);
    expect(restored.ageYears).toBe(37);
    expect(completePatientDemographics({
      caseId: "case.fhh.evaluation-to-confirmed-management",
      campaignSeed: "seed",
      encounterId: "encounter.fhh.legacy",
      savedPatientIdentityId: savedIdentityId,
    }).ageYears).toBe(27);
  });
});
