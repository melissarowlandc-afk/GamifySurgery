import { describe, expect, it } from "vitest";
import { answerChoiceTimingRegistryEntrySchema, syntheticClinicalCaseSchema, testedConceptSchema } from "../../schema";
import { WOUND_HEALING_REMAINING_FAMILY } from "./wound-healing-remaining";
import { IMMUNOLOGY_FAMILY } from "./immunology";
import { COAGULATION_FAMILY } from "./coagulation";
import { ONCOLOGY_FAMILY } from "./oncology";
import { OPERATIVE_INFECTION_FAMILY } from "./operative-infection";

const families = [WOUND_HEALING_REMAINING_FAMILY, IMMUNOLOGY_FAMILY, COAGULATION_FAMILY, ONCOLOGY_FAMILY, OPERATIVE_INFECTION_FAMILY];
const concepts = families.flatMap((family) => family.authoringConcepts);
const questions = families.flatMap((family) => family.questions);
const cases = families.flatMap((family) => family.cases);
const claims = families.flatMap((family) => family.claims);
const sources = families.flatMap((family) => family.sources);
const timings = families.flatMap((family) => family.timingEntries);

describe("GS028 October 7 remaining-ten draft content", () => {
  it("contains ten distinct objectives, four questions each and thirty-eight encounters", () => {
    expect(concepts).toHaveLength(10);
    expect(questions).toHaveLength(40);
    expect(cases).toHaveLength(38);
    expect(new Set(concepts.map((item) => item.id)).size).toBe(10);
    expect(new Set(questions.map((item) => item.id)).size).toBe(40);
    expect(new Set(cases.map((item) => item.id)).size).toBe(38);
    for (const concept of concepts) {
      const variants = questions.filter((question) => question.conceptId === concept.id);
      expect(variants, concept.id).toHaveLength(4);
      expect(new Set(variants.map((item) => item.patientPresentation)).size, concept.id).toBe(4);
      expect(new Set(variants.map((item) => item.stem)).size, concept.id).toBe(4);
    }
  });

  it("allows each objective to start independently at the clinic release", () => {
    for (const concept of concepts) {
      expect(concept.earliestFacilityStage).toBe(0);
      expect(cases.some((item) => item.decisionNodes.length === 1 && item.decisionNodes[0]!.primaryConceptId === concept.id), concept.id).toBe(true);
    }
    for (const item of cases) {
      expect(item.releasePointId).toBe("release.l0.clinic_evaluation");
      expect(item.requiredClinicalSetting).toBe("clinic");
      expect(item.requiredCapabilityIds).toEqual([]);
      expect(item.earliestFacilityStage).toBe(0);
    }
  });

  it("preserves named coherent adult profiles, short complaints and complete tasks", () => {
    for (const item of cases) {
      expect(item.chiefComplaint.trim().split(/\s+/).length).toBeLessThanOrEqual(5);
      expect(item.presentation).toContain("{patientName}");
      expect(item.presentation).not.toMatch(/^A patient\b/);
      for (const profile of item.approvedInstantiationProfiles) {
        const demographics = profile.prototypeDemographics!;
        expect(demographics.ageYears).toBeGreaterThanOrEqual(18);
        expect(profile.presentation).toContain(`${demographics.ageYears}-year-old`);
        expect(profile.presentation).toContain(demographics.sexLabel === "Female" ? "woman" : "man");
        expect(profile.presentation).not.toMatch(/\{patient(?:Age|Sex)\}/);
      }
    }
    for (const item of questions) {
      expect(item.stem).toMatch(/\?$/);
      expect(item.answerChoices).toHaveLength(4);
      expect(item.answerChoices.filter((choice) => choice.isCorrect)).toHaveLength(1);
      const key = item.answerChoices.find((choice) => choice.isCorrect)!;
      expect(item.explanation).toContain(`“${key.label}.”`);
      expect(item.explanation).not.toMatch(/\b(?:option|answer) [ABCD]\b/i);
      expect(item.answerChoices.every((choice) => choice.isCorrect || Boolean(choice.distractorRationale))).toBe(true);
    }
    for (const item of cases) for (const node of item.decisionNodes) expect(node.shuffleAnswers).toBe(true);
  });

  it("keeps all authored clinical records unapproved and source links reciprocal", () => {
    const claimById = new Map(claims.map((claim) => [claim.id, claim]));
    const sourceById = new Map(sources.map((source) => [source.id, source]));
    expect(claimById.size).toBe(claims.length);
    expect(sourceById.size).toBe(sources.length);
    for (const record of [...concepts, ...questions, ...claims, ...sources, ...families.flatMap((family) => family.caseReviews)]) {
      expect(record.reviewStatus).toBe("needs_clinician_review");
      expect(record.aiAssistedDrafting).toBe(true);
      expect(record.lastClinicianReview).toBeNull();
    }
    for (const concept of concepts) for (const id of concept.evidenceClaimIds) expect(claimById.has(id), id).toBe(true);
    for (const question of questions) {
      expect(question.supportingEvidenceClaimIds.length).toBeGreaterThan(0);
      for (const id of question.supportingEvidenceClaimIds) expect(claimById.has(id), id).toBe(true);
    }
    for (const claim of claims) {
      expect(claim.lastCheckedOn).toBe("2026-10-07");
      expect(claim.limitation?.length).toBeGreaterThan(20);
      expect(claim.sourceIds.length).toBeGreaterThan(0);
      for (const id of claim.sourceIds) expect(sourceById.get(id)?.evidenceClaimIds, id).toContain(claim.id);
    }
    for (const source of sources) {
      expect(source.evidenceClaimIds.length, source.id).toBeGreaterThan(0);
      expect(source.authors.length).toBeGreaterThan(0);
      expect(source.authors).not.toContain("et al.");
      expect(source.completeCitation.length).toBeGreaterThan(50);
      expect(source.officialUrl).toMatch(/^https:\/\//);
      expect(source.accessedOn).toBe("2026-10-07");
      expect(source.licenseLabel.length).toBeGreaterThan(40);
      expect(source.authorityAssessment.length).toBeGreaterThan(40);
      for (const id of source.evidenceClaimIds) expect(claimById.get(id)?.sourceIds, id).toContain(source.id);
    }
  });

  it("does not mislabel OGL or restricted-SA sources as public domain", () => {
    const restrictedLicenseIds = new Set(["source.gs028e.nhs_scars", "source.gs028e.ukhsa_woundclass", "source.gs028e.czempik_mixing2020"]);
    for (const source of sources.filter((item) => restrictedLicenseIds.has(item.id))) {
      expect(source.reuseStatus).toBe("copyrighted_targeted_verification_only");
      expect(source.licenseLabel).toMatch(/schema|category/i);
    }
    expect(sources.find((item) => item.id === "source.gs028e.fda_immunotoxicity")?.evidenceClaimIds).toContain("claim.gs028e.type_i");
    expect(sources.find((item) => item.id === "source.gs028e.ahrq_transplant2012")?.evidenceClaimIds).toContain("claim.gs028e.hyperacute_preformed");
  });

  it("uses exactly two external-analysis gates without revealing results at the initial node", () => {
    const paired = COAGULATION_FAMILY.cases.filter((item) => item.decisionNodes.length === 2);
    expect(paired).toHaveLength(2);
    expect(cases.flatMap((item) => item.decisionNodes).filter((node) => node.resultGateAfter)).toHaveLength(2);
    for (const item of paired) {
      const [first, second] = item.decisionNodes;
      expect(first!.resultGateAfter).toMatchObject({ resultTypeId: "service.basic_labs", allowedServiceRouteIds: ["route.basic_labs.outsourced"] });
      expect(first!.resultGateAfter!.pendingLabel).toContain("External");
      expect(first!.resultGateAfter!.resultNarrative).toMatch(/external specialist coagulation laboratory/i);
      expect(first!.answerChoices.find((choice) => choice.isCorrect)?.serviceRequest).toEqual({ serviceId: "service.basic_labs" });
      expect(first!.currentUpdate).toBeUndefined();
      expect(item.presentation).not.toMatch(/mixture (?:corrects|fails to correct)|mixing (?:noncorrection|correction)/i);
      expect(second!.currentUpdate).toBe(first!.resultGateAfter!.resultNarrative);
      expect(second!.currentUpdate).toMatch(/(?:immediately|incubation)/);
      expect(second!.resultGateAfter).toBeNull();
    }
    expect(COAGULATION_FAMILY.serviceContracts).toEqual([{ serviceId: "service.basic_labs", allowedRouteIds: ["route.basic_labs.outsourced"], delivery: "existing_balance_contract" }]);
    expect(COAGULATION_FAMILY.cases.filter((item) => item.decisionNodes.length === 1)).toHaveLength(4);
  });

  it("gives all ordered-test choices central neutral timing and no fixed prose duration", () => {
    expect(timings).toHaveLength(40);
    let testingChoices = 0;
    for (const question of questions) {
      const entry = timings.find((item) => item.questionVariantId === question.id)!;
      expect(entry).toBeDefined();
      if (entry.classification.kind === "test_choices") {
        expect(entry.classification.choices).toHaveLength(4);
        for (const choice of entry.classification.choices) {
          expect(choice.timing).toEqual({ kind: "test", timingProfileId: "timing.test.basic_labs" });
          testingChoices += 1;
        }
      }
      expect(`${question.patientPresentation} ${question.stem} ${question.explanation}`).not.toMatch(/\b\d+\s*(?:minutes?|hours?|days?|weeks?|ticks?)\b/i);
      expect(question.explanation).not.toMatch(/the game's|service\.|route\.|timing\./i);
    }
    expect(testingChoices).toBe(8);
  });

  it("retains narrow clinical boundaries instead of new care capabilities", () => {
    const rb1 = questions.filter((item) => item.conceptId === "concept.oncology.rb1-biallelic-tumor-suppressor-loss");
    for (const item of rb1) {
      expect(item.patientPresentation).toMatch(/both RB1|both.*RB1|one RB1.*remaining allele|one RB1.*other/);
      if (item.stem.includes("normal biological role of functional RB1")) {
        expect(item.supportingEvidenceClaimIds).toEqual(["claim.gs028e.suppressor_loss"]);
        expect(item.patientPresentation).not.toMatch(/absent normal RB1 function|what biological function was lost/);
      } else {
        expect(item.supportingEvidenceClaimIds).toContain("claim.gs028e.two_hit_scoped");
      }
    }
    const hyperacute = questions.filter((item) => item.conceptId === "concept.immunology.preformed-antibody-hyperacute-rejection");
    for (const item of hyperacute) expect(item.patientPresentation).toMatch(/historical|prior|remote/);
    const secondary = questions.filter((item) => item.conceptId === "concept.wound.secondary-intention-healing");
    expect(new Set(secondary.map((item) => item.answerChoices.find((choice) => choice.isCorrect)!.label)).size).toBe(4);
    const immuneProse = IMMUNOLOGY_FAMILY.questions.map((item) => `${item.stem} ${item.explanation} ${item.answerChoices.map((choice) => `${choice.label} ${choice.distractorRationale ?? ""}`).join(" ")}`).join(" ");
    expect(immuneProse).not.toMatch(/RB1|tumor-suppressor|scar overgrowth|tumor antigens/i);
    expect(claims.find((item) => item.id === "claim.gs028e.mixing_limits")?.statement).toMatch(/cannot.*establish or exclude/);
  });

  it("passes runtime schemas without relying on aggregate admission", () => {
    for (const family of families) for (const item of family.testedConcepts) testedConceptSchema.parse(item);
    for (const item of cases) syntheticClinicalCaseSchema.parse(item);
    for (const item of timings) answerChoiceTimingRegistryEntrySchema.parse(item);
    expect(new Set(cases.flatMap((item) => item.decisionNodes).map((node) => node.id)).size).toBe(40);
  });
});
