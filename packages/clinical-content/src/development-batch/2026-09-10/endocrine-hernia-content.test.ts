import { describe, expect, it } from "vitest";
import { syntheticClinicalCaseSchema, testedConceptSchema } from "../../schema";
import { INGUINAL_HERNIA_CASES, INGUINAL_HERNIA_CLAIMS, INGUINAL_HERNIA_CONCEPTS, INGUINAL_HERNIA_QUESTIONS, INGUINAL_HERNIA_SOURCES, INGUINAL_HERNIA_TESTED_CONCEPTS } from "./inguinal-hernia";
import { PRIMARY_HYPERPARATHYROIDISM_CASES, PRIMARY_HYPERPARATHYROIDISM_CLAIMS, PRIMARY_HYPERPARATHYROIDISM_CONCEPTS, PRIMARY_HYPERPARATHYROIDISM_QUESTIONS, PRIMARY_HYPERPARATHYROIDISM_SOURCES, PRIMARY_HYPERPARATHYROIDISM_TESTED_CONCEPTS } from "./primary-hyperparathyroidism";
import { THYROID_NODULE_CASES, THYROID_NODULE_CLAIMS, THYROID_NODULE_CONCEPTS, THYROID_NODULE_QUESTIONS, THYROID_NODULE_SOURCES, THYROID_NODULE_TESTED_CONCEPTS } from "./thyroid-nodule";

const concepts = [...THYROID_NODULE_CONCEPTS, ...PRIMARY_HYPERPARATHYROIDISM_CONCEPTS, ...INGUINAL_HERNIA_CONCEPTS];
const questions = [...THYROID_NODULE_QUESTIONS, ...PRIMARY_HYPERPARATHYROIDISM_QUESTIONS, ...INGUINAL_HERNIA_QUESTIONS];
const cases = [...THYROID_NODULE_CASES, ...PRIMARY_HYPERPARATHYROIDISM_CASES, ...INGUINAL_HERNIA_CASES];
const claims = [...THYROID_NODULE_CLAIMS, ...PRIMARY_HYPERPARATHYROIDISM_CLAIMS, ...INGUINAL_HERNIA_CLAIMS];
const sources = [...THYROID_NODULE_SOURCES, ...PRIMARY_HYPERPARATHYROIDISM_SOURCES, ...INGUINAL_HERNIA_SOURCES];

describe("2026-09-10 endocrine and groin authoring milestone", () => {
  it("contains six distinct concepts, twenty-four variants, and twelve two-node cases", () => {
    expect(concepts).toHaveLength(6);
    expect(questions).toHaveLength(24);
    expect(cases).toHaveLength(12);
    expect(new Set(concepts.map((item) => item.id)).size).toBe(6);
    expect(new Set(questions.map((item) => item.id)).size).toBe(24);
    for (const concept of concepts) expect(questions.filter((item) => item.conceptId === concept.id)).toHaveLength(4);
    expect(cases.every((item) => item.decisionNodes.length === 2)).toBe(true);
  });

  it("keeps every authored record in the delegated-review, needs-clinician-review boundary", () => {
    for (const item of [...concepts, ...questions, ...claims, ...sources]) {
      expect(item.reviewStatus).toBe("needs_clinician_review");
      expect(item.lastClinicianReview).toBeNull();
      expect(item.aiAssistedDrafting).toBe(true);
    }
    for (const item of [...concepts, ...questions]) {
      expect(item.agentReview.authority).toBe("owner-delegated agent authoring and review");
      expect(item.agentReview.clinicianSignOff).toBe(false);
    }
  });

  it("uses complete patient-linked, shuffled, result-gated decision sequences", () => {
    const questionIds = new Set(questions.map((item) => item.id));
    const claimIds = new Set(claims.map((item) => item.id));
    for (const clinicalCase of cases) {
      expect(syntheticClinicalCaseSchema.parse(clinicalCase)).toEqual(clinicalCase);
      expect(clinicalCase.patientDisplayName).toBe("{patientName}");
      expect(clinicalCase.presentation).toContain("{patientName}");
      expect(clinicalCase.approvedInstantiationProfiles).toHaveLength(4);
      expect(clinicalCase.presentation).not.toContain(clinicalCase.decisionNodes[1]!.currentUpdate!);
      const [first, second] = clinicalCase.decisionNodes;
      expect(first!.shuffleAnswers).toBe(true);
      expect(second!.shuffleAnswers).toBe(true);
      expect(first!.resultGateAfter).not.toBeNull();
      expect(second!.resultGateAfter).toBeNull();
      expect(second!.currentUpdate).toBe(first!.resultGateAfter!.resultNarrative);
      expect(first!.answerChoices.filter((choice) => choice.isCorrect)).toHaveLength(1);
      expect(second!.answerChoices.filter((choice) => choice.isCorrect)).toHaveLength(1);
      expect(first!.answerChoices.find((choice) => choice.isCorrect)!.label.length).toBeLessThanOrEqual(Math.max(...first!.answerChoices.filter((choice) => !choice.isCorrect).map((choice) => choice.label.length)));
      expect(second!.answerChoices.find((choice) => choice.isCorrect)!.label.length).toBeLessThanOrEqual(Math.max(...second!.answerChoices.filter((choice) => !choice.isCorrect).map((choice) => choice.label.length)));
      expect(first!.answerChoices.find((choice) => choice.isCorrect)?.serviceRequest?.serviceId).toBe(first!.resultGateAfter!.resultTypeId);
      expect(first!.answerChoices.filter((choice) => !choice.isCorrect).every((choice) => choice.serviceRequest === null)).toBe(true);
      expect(questionIds.has(first!.questionVariantId)).toBe(true);
      expect(questionIds.has(second!.questionVariantId)).toBe(true);
    }
    for (const question of questions) {
      expect(question.answerChoices).toHaveLength(4);
      expect(question.answerChoices.filter((choice) => choice.isCorrect)).toHaveLength(1);
      expect(question.supportingEvidenceClaimIds.every((id) => claimIds.has(id))).toBe(true);
    }
  });

  it("declares only the accepted service routes and maps sources to claims bidirectionally", () => {
    expect(THYROID_NODULE_CASES.flatMap((item) => item.decisionNodes).filter((node) => node.resultGateAfter).every((node) => node.resultGateAfter!.resultTypeId === "service.thyroid_fna" && node.resultGateAfter!.allowedServiceRouteIds.includes("route.thyroid_fna.outsourced"))).toBe(true);
    expect(PRIMARY_HYPERPARATHYROIDISM_CASES.flatMap((item) => item.decisionNodes).filter((node) => node.resultGateAfter).every((node) => node.resultGateAfter!.resultTypeId === "service.basic_labs" && node.resultGateAfter!.allowedServiceRouteIds.includes("route.basic_labs.outsourced"))).toBe(true);
    expect(INGUINAL_HERNIA_CASES.flatMap((item) => item.decisionNodes).filter((node) => node.resultGateAfter).every((node) => node.resultGateAfter!.resultTypeId === "service.ultrasound" && node.resultGateAfter!.allowedServiceRouteIds.includes("route.ultrasound.in_house"))).toBe(true);
    const sourcesById = new Map(sources.map((item) => [item.id, item]));
    for (const evidenceClaim of claims) for (const sourceId of evidenceClaim.sourceIds) expect(sourcesById.get(sourceId)?.evidenceClaimIds).toContain(evidenceClaim.id);
    for (const source of sources) for (const claimId of source.evidenceClaimIds) expect(claims.find((item) => item.id === claimId)?.sourceIds).toContain(source.id);
  });

  it("keeps typed concept records and the PHPT single-source limitation explicit", () => {
    for (const item of [...THYROID_NODULE_TESTED_CONCEPTS, ...PRIMARY_HYPERPARATHYROIDISM_TESTED_CONCEPTS, ...INGUINAL_HERNIA_TESTED_CONCEPTS]) expect(testedConceptSchema.parse(item)).toMatchObject({ id: item.id });
    expect(PRIMARY_HYPERPARATHYROIDISM_CLAIMS.find((item) => item.id === "claim.primary-hyperparathyroidism.renal-bone-surgery-assessment")?.limitation).toContain("undated AAES patient education");
    expect(JSON.stringify(PRIMARY_HYPERPARATHYROIDISM_CASES)).toContain("do not support FHH");
    expect(JSON.stringify(INGUINAL_HERNIA_CASES)).not.toContain("Hesselbach");
  });
});
