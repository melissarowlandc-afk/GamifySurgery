import { describe, expect, it } from "vitest";
import { C } from "./evidence-claims";
import {
  PEDIATRIC_CLINIC_CASES as cases,
  PEDIATRIC_CLINIC_FAMILY_CONTEXTS as families,
  PEDIATRIC_CLINIC_QUESTIONS as questions,
} from "./pediatric-clinic-batch";

const variantsFor = (conceptSuffix: string) => questions.filter((question) => question.conceptId === `concept.pediatric-clinic.${conceptSuffix}`);

describe("pediatric content scope and editorial checks", () => {
  it("uses concise complaints, named child introductions and complete question tasks", () => {
    for (const item of cases) {
      expect(item.chiefComplaint!.trim().split(/\s+/).length).toBeGreaterThanOrEqual(1);
      expect(item.chiefComplaint!.trim().split(/\s+/).length).toBeLessThanOrEqual(5);
      expect(item.presentation.startsWith(`${item.patientDisplayName}, ${item.prototypeDemographics!.ageYears === 11 ? "an" : "a"} `)).toBe(true);
      expect(item.presentation).not.toMatch(/^A patient with/i);
      const node = item.decisionNodes[0]!;
      expect(node.stem).toContain(item.patientDisplayName);
      expect(node.stem).toMatch(/^(Which|What) .+\?$/);
      expect(node.stem).not.toBe(item.presentation);
      expect(node.teachingPoint).toBeTruthy();
      expect(JSON.stringify(item)).not.toMatch(/\{patient(Name|Age|Sex)\}|\b(?:infant|newborn)\b|\b\d+\s*(?:minutes?|hours?|weeks?|months?)\b/i);
    }
  });

  it("gives four parallel concise options, one key, and a rationale for every option", () => {
    for (const question of questions) {
      expect(question.answerChoices).toHaveLength(4);
      expect(question.answerChoices.filter((choice) => choice.isCorrect)).toHaveLength(1);
      expect(new Set(question.answerChoices.map((choice) => choice.label)).size).toBe(4);
      const counts = question.answerChoices.map((choice) => choice.label.split(/\s+/).length);
      expect(Math.max(...counts) / Math.min(...counts)).toBeLessThanOrEqual(1.75);
      for (const choice of question.answerChoices) {
        expect(choice.rationale).toBeTruthy();
        expect(choice.distractorRationale).toBe(choice.isCorrect ? null : choice.rationale);
        expect(choice.label).not.toMatch(/because|which would|unlike|\([^)]+\)/i);
      }
    }
  });

  it("distinguishes true-retractile profiles from acquired-ascent profiles and preserves male art constraints", () => {
    for (const question of variantsFor("true-retractile-testis-surveillance")) {
      expect(question.patientPresentation).toMatch(/without tension and remains there after release/);
      expect(question.supportingEvidenceClaimIds).toContain(C.retractileDefinition);
      expect(question.supportingEvidenceClaimIds).toContain(C.retractileFollowup);
      expect(question.answerChoices.find((choice) => choice.isCorrect)!.label).toMatch(/follow-up|examinations/);
      expect(question.approvedInstantiationProfiles.every((profile) => profile.prototypeDemographics!.sexLabel === "Male")).toBe(true);
    }
    for (const question of variantsFor("acquired-testis-ascent-referral")) {
      expect(question.supportingEvidenceClaimIds).toContain(C.testisAscent);
      expect(question.supportingEvidenceClaimIds).toContain(C.persistentHighTestis);
      expect(question.supportingEvidenceClaimIds).toContain(C.ascentReferral);
      expect(question.answerChoices.find((choice) => choice.isCorrect)!.label).toMatch(/urolog/);
      expect(question.approvedInstantiationProfiles.every((profile) => profile.prototypeDemographics!.sexLabel === "Male")).toBe(true);
    }
    for (const family of families.filter((item) => item.caseId.includes("testis") || item.caseId.includes("testicle"))) expect(family.prototypeDemographics.sexLabel).toBe("Male");
  });

  it("keeps cervical-node questions within the source's under-16 pathway and separates observation from red flags", () => {
    for (const question of [...variantsFor("reactive-neck-node-observation"), ...variantsFor("concerning-neck-node-referral")]) {
      expect(question.approvedInstantiationProfiles[0]!.prototypeDemographics!.ageYears).toBeLessThan(16);
    }
    for (const question of variantsFor("reactive-neck-node-observation")) {
      expect(question.supportingEvidenceClaimIds).toContain(C.nodeObservation);
      expect(question.supportingEvidenceClaimIds).toContain(C.nodeSafetyNet);
      expect(question.answerChoices.find((choice) => choice.isCorrect)!.label).toMatch(/[Oo]bserv/);
    }
    for (const question of variantsFor("concerning-neck-node-referral")) {
      expect(question.supportingEvidenceClaimIds).toContain(C.nodeReferral);
      expect(question.answerChoices.find((choice) => choice.isCorrect)!.label).toContain("pediatric specialist assessment");
      expect(question.explanation).toContain("cause remains uncertain");
    }
  });

  it("uses referral/assessment for pectus and preserves uncertainty rather than promising correction", () => {
    for (const question of variantsFor("symptomatic-pectus-excavatum-evaluation")) {
      expect(question.supportingEvidenceClaimIds).toContain(C.excavatumEvaluation);
      expect(question.supportingEvidenceClaimIds).toContain(C.excavatumUncertainty);
      expect(question.answerChoices.find((choice) => choice.isCorrect)!.label).toMatch(/cardiopulmonary/);
    }
    for (const question of variantsFor("pectus-carinatum-brace-assessment")) {
      expect(question.supportingEvidenceClaimIds).toContain(C.braceSelection);
      expect(question.supportingEvidenceClaimIds).toContain(C.braceEvidence);
      expect(question.answerChoices.find((choice) => choice.isCorrect)!.label).toMatch(/suitability/);
      expect(question.explanation).toMatch(/observational|outcomes vary/);
    }
  });

  it("limits pilonidal questions to conservative mild-disease planning with no abscess procedure or universal regimen", () => {
    for (const question of variantsFor("limited-pilonidal-conservative-care")) {
      expect(question.supportingEvidenceClaimIds).toContain(C.pilonidalCare);
      expect(question.supportingEvidenceClaimIds).toContain(C.pilonidalReassessment);
      expect(question.supportingEvidenceClaimIds).toContain(C.pilonidalInfection);
      expect(question.answerChoices.find((choice) => choice.isCorrect)!.label).toMatch(/conservative/);
      expect(question.patientPresentation).toMatch(/no tender fluctuant swelling|without a fluctuant mass/);
      expect(question.explanation).not.toMatch(/shave daily|laser every|\d+\s*(?:days?|weeks?|months?)/i);
    }
  });

  it("teaches nonurgent child participation while retaining the legal/privacy boundary", () => {
    for (const question of variantsFor("developmental-assent-discussion")) {
      expect(question.patientPresentation).toContain("nonurgent");
      expect(question.supportingEvidenceClaimIds).toContain(C.childInformation);
      expect(question.supportingEvidenceClaimIds).toContain(C.childAssent);
      expect(question.supportingEvidenceClaimIds).toContain(C.consentBoundary);
      expect(question.explanation).toContain("legal consent authority");
      expect(question.answerChoices.find((choice) => choice.isCorrect)!.label).toMatch(/^Explain/);
    }
  });
});
