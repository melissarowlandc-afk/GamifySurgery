import { describe, expect, it } from "vitest";
import { syntheticClinicalCaseSchema } from "../../schema";
import { ETHICS_FAMILIES } from "./ethics";
import { EXISTING_ANCHOR_CLAIMS, EXISTING_ANCHOR_SOURCES } from "./clinical-anchor-test-catalog";

const cases = ETHICS_FAMILIES.flatMap((family) => family.cases);
const questions = ETHICS_FAMILIES.flatMap((family) => family.questions);
const claimsById = new Map([...ETHICS_FAMILIES.flatMap((family) => family.claims), ...EXISTING_ANCHOR_CLAIMS].map((claim) => [claim.id, claim]));
const sources = [...ETHICS_FAMILIES.flatMap((family) => family.sources), ...EXISTING_ANCHOR_SOURCES];

describe("GS028 patient-centered ethics overhaul", () => {
  it("retains ten concepts and forty questions in thirty-six patient cases", () => {
    expect(ETHICS_FAMILIES.flatMap((family) => family.authoringConcepts)).toHaveLength(10);
    expect(questions).toHaveLength(40);
    expect(cases).toHaveLength(36);
    expect(cases.filter((clinicalCase) => clinicalCase.decisionNodes.length === 2)).toHaveLength(4);
    for (const clinicalCase of cases) {
      syntheticClinicalCaseSchema.parse(clinicalCase);
      expect(clinicalCase.participant).toBeUndefined();
      expect(clinicalCase.earliestFacilityStage).toBe(0);
      expect(clinicalCase.chiefComplaint.trim().split(/\s+/).length).toBeLessThanOrEqual(5);
      expect(clinicalCase.presentation).toContain("{patientName}");
      expect(clinicalCase.presentation).not.toMatch(/A patient with|overhears staff discussing an identifiable clinic case/i);
      for (const profile of clinicalCase.approvedInstantiationProfiles ?? []) {
        const age = profile.prototypeDemographics!.ageYears;
        expect(profile.presentation).toMatch(new RegExp(`${age}-year-old|de ${age} años`));
        expect(profile.prototypeDemographics!.sexLabel).toMatch(/Female|Male/);
        if (profile.presentation.includes("una mujer")) expect(profile.prototypeDemographics!.sexLabel).toBe("Female");
      }
      for (const node of clinicalCase.decisionNodes) {
        expect(node.teachingPoint).toBeTruthy();
        expect(node.explanation).not.toBe(node.teachingPoint);
        expect(node.explanation.trim().split(/\s+/).length).toBeGreaterThanOrEqual(20);
        expect(node.explanation.trim().split(/\s+/).length).toBeLessThanOrEqual(40);
        expect(node.explanation).toMatch(/[.!?]$/);
        expect(node.explanation).not.toContain("Correct answer:");
        expect(node.answerChoices.every((choice) => Boolean(choice.rationale))).toBe(true);
        expect(node.shuffleAnswers).toBe(true);
        for (const disposition of node.terminalDispositions) {
          expect(disposition.kind).toBe("no_terminal_outcome");
          if (disposition.kind === "no_terminal_outcome") {
            expect(disposition.consequenceNarrative).toBe("Review the teaching point and choice rationales.");
          }
        }
      }
    }
  });

  it("continues the same patient's interpreted consent discussion without a new clinical treatment claim", () => {
    for (const clinicalCase of cases.filter((item) => item.decisionNodes.length === 2)) {
      expect(clinicalCase.decisionNodes.map((node) => node.primaryConceptId)).toEqual([
        "concept.statistics-ethics.qualified-interpreter",
        "concept.statistics-ethics.informed-consent",
      ]);
      expect(clinicalCase.prototypeDemographics!.sexLabel).toBe("Female");
      expect(clinicalCase.decisionNodes[1]!.currentUpdate).toContain("{patientName}");
      expect(clinicalCase.decisionNodes[1]!.currentUpdate).toMatch(/interpret/i);
      expect(clinicalCase.decisionNodes.every((node) => node.resultGateAfter === null)).toBe(true);
    }
  });

  it("keeps feedback and question records aligned without repeating every rationale in a paragraph", () => {
    for (const clinicalCase of cases) {
      expect(clinicalCase.learningSummary).toBe("Review the teaching points and choice rationales for this encounter.");
      for (const node of clinicalCase.decisionNodes) {
        const authored = questions.find((question) => question.id === node.questionVariantId)!;
        expect(authored.teachingPoint).toBe(node.teachingPoint);
        expect(authored.explanation).toBe(node.explanation);
        expect(authored.reachedCurrentUpdate).toBe(node.currentUpdate);
        expect(authored.reviewStatus).toBe("needs_clinician_review");
        expect(authored.lastClinicianReview).toBeNull();
        expect(authored.supportingEvidenceClaimIds.length).toBeGreaterThanOrEqual(1);
        expect(new Set(authored.supportingEvidenceClaimIds).size).toBe(authored.supportingEvidenceClaimIds.length);
        for (const id of authored.supportingEvidenceClaimIds) {
          const claim = claimsById.get(id);
          expect(claim, `${authored.id}: unresolved evidence ${id}`).toBeDefined();
          if (id.startsWith("claim.gs028se.")) expect(claim!.reviewStatus).toBe("needs_clinician_review");
          else if (claim!.reviewStatus === "clinically_approved") {
            expect(claim!.lastClinicianReview?.reviewer).toBeTruthy();
          } else expect(claim!.reviewStatus).toBe("needs_clinician_review");
          if (id.startsWith("claim.gs028se.")) expect(claim!.lastCheckedOn).toBe("2026-09-29");
          else expect(claim!.lastCheckedOn).toMatch(/^\d{4}-\d{2}-\d{2}$/);
          expect(claim!.sourceIds.length).toBeGreaterThan(0);
          for (const sourceId of claim!.sourceIds) {
            expect(sources.some((source) => source.id === sourceId && source.evidenceClaimIds.includes(id)), `${id}: missing reciprocal source ${sourceId}`).toBe(true);
          }
        }
        for (const choice of node.answerChoices) {
          expect(authored.answerChoices.find((answer) => answer.id === choice.id)?.rationale).toBe(choice.rationale);
        }
      }
    }
  });

  it("retains each original claim and explicitly supports the added consent and capacity contrasts", () => {
    for (const question of questions) {
      const suffix = question.id.replace("question.statistics-ethics.", "").replace(/\.v(\d)$/, ".$1");
      expect(question.supportingEvidenceClaimIds).toContain(`claim.gs028se.${suffix}`);
    }
    const interpreter = questions.find((question) => question.id === "question.statistics-ethics.qualified-interpreter.v1")!;
    expect(interpreter.supportingEvidenceClaimIds).toEqual(expect.arrayContaining([
      "claim.gs028se.qualified-interpreter.1", "claim.gs028se.qualified-interpreter.3", "claim.gs028se.qualified-interpreter.4",
    ]));
    const consent = questions.find((question) => question.id === "question.statistics-ethics.informed-consent.v1")!;
    expect(consent.supportingEvidenceClaimIds).toEqual(expect.arrayContaining([
      "claim.gs028se.informed-consent.1", "claim.gs028se.informed-consent.4", "claim.gs028se.qualified-interpreter.1",
    ]));
    const refusal = questions.find((question) => question.id === "question.statistics-ethics.capacity-refusal.v1")!;
    expect(refusal.supportingEvidenceClaimIds).toContain("claim.gs028se.capacity-refusal.3");
  });
});
