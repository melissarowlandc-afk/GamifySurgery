import { describe, expect, it } from "vitest";
import { answerChoiceTimingRegistryEntrySchema, syntheticClinicalCaseSchema, testedConceptSchema } from "../../schema";
import { TACROLIMUS_FAMILY } from "./tacrolimus";
import { ANESTHESIA_REMAINING_FAMILY } from "./anesthesia-remaining";
import { NUTRITION_FAMILY } from "./nutrition";
import { PATIENT_SAFETY_FAMILY } from "./patient-safety";
import { OXYGEN_CONTENT_FAMILY } from "./oxygen-content";
import { MELANOMA_BOWEL_FAMILY } from "./melanoma-bowel";
import { FOREIGN_BODY_FAMILY } from "./foreign-body";

const families = [TACROLIMUS_FAMILY, ANESTHESIA_REMAINING_FAMILY, NUTRITION_FAMILY, PATIENT_SAFETY_FAMILY, OXYGEN_CONTENT_FAMILY, MELANOMA_BOWEL_FAMILY, FOREIGN_BODY_FAMILY];
const concepts = families.flatMap((family) => family.authoringConcepts);
const questions = families.flatMap((family) => family.questions);
const cases = families.flatMap((family) => family.cases);
const claims = families.flatMap((family) => family.claims);
const sources = families.flatMap((family) => family.sources);
const timings = families.flatMap((family) => family.timingEntries);
const key = (question: (typeof questions)[number]) => question.answerChoices.find((choice) => choice.isCorrect)!;

describe("GS028 second October 7 remaining-ten original draft content", () => {
  it("has ten distinct meanings and four substantive questions per meaning", () => {
    expect(concepts).toHaveLength(10);
    expect(questions).toHaveLength(40);
    expect(cases).toHaveLength(40);
    expect(new Set(concepts.map((item) => item.id)).size).toBe(10);
    expect(new Set(questions.map((item) => item.id)).size).toBe(40);
    expect(new Set(cases.map((item) => item.id)).size).toBe(40);
    for (const concept of concepts) {
      const variants = questions.filter((question) => question.conceptId === concept.id);
      expect(variants, concept.id).toHaveLength(4);
      expect(new Set(variants.map((item) => item.patientPresentation)).size, concept.id).toBe(4);
      expect(new Set(variants.map((item) => item.stem)).size, concept.id).toBe(4);
      expect(concept.earliestFacilityStage, concept.id).toBe(0);
      expect(cases.filter((item) => item.decisionNodes[0]!.primaryConceptId === concept.id), concept.id).toHaveLength(4);
    }
  });

  it("uses coherent named adult clinic encounters and immutable complete profiles", () => {
    expect(cases.flatMap((item) => item.approvedInstantiationProfiles)).toHaveLength(160);
    for (const item of cases) {
      expect(item.id).toMatch(/^case\.gs028f\./);
      expect(item.releasePointId).toBe("release.l0.clinic_evaluation");
      expect(item.requiredClinicalSetting).toBe("clinic");
      expect(item.requiredCapabilityIds).toEqual([]);
      expect(item.earliestFacilityStage).toBe(0);
      expect(item.decisionNodes).toHaveLength(1);
      expect(item.chiefComplaint.trim().split(/\s+/).length, item.id).toBeLessThanOrEqual(5);
      expect(item.presentation, item.id).toContain("{patientName}");
      expect(item.presentation).not.toMatch(/^A patient\b/);
      for (const profile of item.approvedInstantiationProfiles) {
        const demographics = profile.prototypeDemographics!;
        expect(demographics.ageYears).toBeGreaterThanOrEqual(18);
        expect(profile.presentation).toContain(`${demographics.ageYears}-year-old`);
        expect(profile.presentation).toContain(demographics.sexLabel === "Female" ? "woman" : "man");
        expect(profile.presentation).not.toMatch(/\{patient(?:Age|Sex)\}/);
        expect(profile.id.length).toBeGreaterThan(0);
      }
      expect(item.decisionNodes[0]!.shuffleAnswers).toBe(true);
    }
  });

  it("keeps complete single-best tasks and prevents a uniquely longest key", () => {
    for (const question of questions) {
      expect(question.stem, question.id).toMatch(/\?$/);
      expect(question.answerChoices, question.id).toHaveLength(4);
      expect(question.answerChoices.filter((choice) => choice.isCorrect), question.id).toHaveLength(1);
      const correct = key(question);
      const distractors = question.answerChoices.filter((choice) => !choice.isCorrect);
      expect(new Set(question.answerChoices.map((choice) => choice.label)).size, question.id).toBe(4);
      expect(correct.label.length, `${question.id}: uniquely longest key ${correct.label}`).toBeLessThanOrEqual(Math.max(...distractors.map((choice) => choice.label.length)));
      if (question.conceptId === "concept.gs028f.outcomes.rca-versus-fmea-purpose") {
        expect(question.explanation, question.id).not.toBe(question.teachingPoint);
        expect(question.explanation.trim().split(/\s+/).length, question.id).toBeGreaterThanOrEqual(20);
        expect(question.explanation, question.id).toMatch(/RCA|root cause analysis|FMEA/i);
        expect(question.teachingPoint, question.id).toMatch(/retrospective|prospective|already happened|look ahead/i);
      } else {
        expect(question.explanation, question.id).toContain(`“${correct.label}.”`);
      }
      expect(question.explanation).not.toMatch(/\b(?:option|answer) [ABCD]\b/i);
      for (const choice of distractors) expect(choice.distractorRationale?.length, question.id).toBeGreaterThan(15);
    }
  });

  it("retains draft provenance and reciprocal atomic evidence links", () => {
    expect(claims).toHaveLength(26);
    expect(sources).toHaveLength(14);
    const claimById = new Map(claims.map((claim) => [claim.id, claim]));
    const sourceById = new Map(sources.map((source) => [source.id, source]));
    expect(claimById.size).toBe(claims.length);
    expect(sourceById.size).toBe(sources.length);
    for (const record of [...concepts, ...questions, ...claims, ...sources, ...families.flatMap((family) => family.caseReviews)]) {
      expect(record.contentVersion).toBe("development-batch.2026-10-07.variety.2");
      expect(record.reviewStatus).toBe("needs_clinician_review");
      expect(record.aiAssistedDrafting).toBe(true);
      expect(record.lastClinicianReview).toBeNull();
    }
    for (const concept of concepts) for (const id of concept.evidenceClaimIds) expect(claimById.has(id), id).toBe(true);
    for (const question of questions) {
      expect(question.supportingEvidenceClaimIds.length, question.id).toBeGreaterThan(0);
      for (const id of question.supportingEvidenceClaimIds) expect(claimById.has(id), id).toBe(true);
    }
    for (const claim of claims) {
      expect(claim.lastCheckedOn).toBe("2026-10-07");
      expect(claim.limitation?.length, claim.id).toBeGreaterThan(30);
      expect(claim.applicablePopulation.length, claim.id).toBeGreaterThan(20);
      expect(claim.sourceIds.length, claim.id).toBeGreaterThan(0);
      for (const id of claim.sourceIds) expect(sourceById.get(id)?.evidenceClaimIds, id).toContain(claim.id);
    }
    for (const source of sources) {
      expect(source.completeCitation.length, source.id).toBeGreaterThan(80);
      expect(source.authors.length, source.id).toBeGreaterThan(0);
      expect(source.authors).not.toContain("et al.");
      expect(source.officialUrl).toMatch(/^https:\/\//);
      expect(source.accessedOn).toBe("2026-10-07");
      expect(source.licenseLabel.length).toBeGreaterThan(60);
      expect(source.authorityAssessment.length).toBeGreaterThan(80);
      expect(source.reuseNotes).toMatch(/no source prose/i);
      expect(source.evidenceClaimIds.length, source.id).toBeGreaterThan(0);
      for (const id of source.evidenceClaimIds) expect(claimById.get(id)?.sourceIds, id).toContain(source.id);
    }
  });

  it("records the exact permitted sources, licensing gaps and single-source limits", () => {
    expect(sources.map((item) => item.officialUrl).join(" ")).not.toMatch(/nice\.org|asahq\.org|entnet\.org|orthoinfo\.aaos/i);
    const auspen = sources.find((item) => item.id === "source.gs028f.auspen_refeeding2025")!;
    expect(auspen.licenseLabel).toMatch(/CC BY-NC-ND 4\.0/);
    expect(auspen.reuseStatus).toBe("copyrighted_targeted_verification_only");
    expect(claims.find((item) => item.id === "claim.gs028f.refeeding.thiamine-before-intake")?.limitation).toMatch(/no specific evidence|single adequate/i);
    const rocuronium = sources.find((item) => item.id === "source.gs028f.rocuronium2026")!;
    expect(rocuronium.publicationYear).toBe(2026);
    expect(rocuronium.completeCitation).toMatch(/August 2, 2026/);
    expect(rocuronium.reuseStatus).toBe("copyrighted_targeted_verification_only");
    expect(sources.find((item) => item.id === "source.gs028f.prograf2023")?.officialUrl).toContain("7f667de1-9dfa-4bd6-8ba0-15ee2d78873b");
    expect(sources.find((item) => item.id === "source.gs028f.esge_foreignbody2016")?.officialUrl).toContain("2016_s_0042_100456.pdf");
    expect(sources.find((item) => item.id === "source.gs028f.esge_foreignbody2016")?.usageRole).toBe("cross_check");
    expect(sources.find((item) => item.id === "source.gs028f.wses_esophagus2019")?.reuseStatus).toBe("cc_by_4_0");
  });

  it("uses supplied reports and care referrals without fabricated tests, gates or fixed durations", () => {
    expect(timings).toHaveLength(40);
    for (const entry of timings) expect(entry.classification).toEqual({ kind: "no_test" });
    for (const family of families) expect(family.serviceContracts).toEqual([]);
    for (const item of cases) for (const node of item.decisionNodes) {
      expect(node.resultGateAfter).toBeNull();
      expect(node.currentUpdate).toBeUndefined();
      expect(node.answerChoices.every((choice) => choice.serviceRequest === null), item.id).toBe(true);
    }
    for (const question of questions) {
      const prose = `${question.patientPresentation} ${question.stem} ${question.explanation}`;
      expect(prose).not.toMatch(/\b\d+\s*(?:minutes?|hours?|days?|weeks?|ticks?|mg|mcg|kcal)\b/i);
      expect(prose).not.toMatch(/the game's|service\.|route\.|timing\.|onsite rescue|not a new onsite procedure|is taught|question requiring/i);
    }
    const acute = FOREIGN_BODY_FAMILY.cases.filter((item) => !item.id.includes("completed-false-negative"));
    expect(acute).toHaveLength(7);
    for (const item of acute) {
      expect(FOREIGN_BODY_FAMILY.caseReviews.find((review) => review.caseId === item.id)?.acuity).toBe("urgent");
      for (const profile of item.approvedInstantiationProfiles) {
        expect(profile.prototypeVitalSigns).toMatchObject({ heartRateBpm: 78, oxygenSaturationPercent: 99 });
      }
    }
    const cardiacFirst = ANESTHESIA_REMAINING_FAMILY.questions.find((item) => item.patientPresentation.includes("first documented manifestation"))!;
    expect(cardiacFirst.patientPresentation).not.toMatch(/toxicity event|diagnosed.*toxicity/);
    expect(cardiacFirst.stem).not.toContain("toxicity");
  });

  it("passes actual runtime schemas without aggregate admission", () => {
    for (const family of families) for (const item of family.testedConcepts) testedConceptSchema.parse(item);
    for (const item of cases) syntheticClinicalCaseSchema.parse(item);
    for (const item of timings) answerChoiceTimingRegistryEntrySchema.parse(item);
    expect(new Set(cases.flatMap((item) => item.decisionNodes).map((node) => node.id)).size).toBe(40);
  });
});
