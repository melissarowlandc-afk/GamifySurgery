import { describe, expect, it } from "vitest";
import { syntheticClinicalCaseSchema, testedConceptSchema } from "../../schema";
import { ACHALASIA_CASES, ACHALASIA_CLAIMS, ACHALASIA_CONCEPTS, ACHALASIA_QUESTIONS, ACHALASIA_SOURCES } from "./achalasia";
import { ANAL_FISSURE_CASES, ANAL_FISSURE_CLAIMS, ANAL_FISSURE_CONCEPTS, ANAL_FISSURE_QUESTIONS, ANAL_FISSURE_SOURCES } from "./anal-fissure";
import { ESOPHAGEAL_DYSPHAGIA_CASES, ESOPHAGEAL_DYSPHAGIA_CLAIMS, ESOPHAGEAL_DYSPHAGIA_CONCEPTS, ESOPHAGEAL_DYSPHAGIA_QUESTIONS, ESOPHAGEAL_DYSPHAGIA_SOURCES } from "./esophageal-dysphagia";
import { INTERNAL_HEMORRHOIDS_CASES, INTERNAL_HEMORRHOIDS_CLAIMS, INTERNAL_HEMORRHOIDS_CONCEPTS, INTERNAL_HEMORRHOIDS_QUESTIONS, INTERNAL_HEMORRHOIDS_SOURCES } from "./internal-hemorrhoids";
import { PIGMENTED_SKIN_LESION_CASES, PIGMENTED_SKIN_LESION_CLAIMS, PIGMENTED_SKIN_LESION_CONCEPTS, PIGMENTED_SKIN_LESION_QUESTIONS, PIGMENTED_SKIN_LESION_SOURCES } from "./pigmented-skin-lesion";
import { PILONIDAL_DISEASE_CASES, PILONIDAL_DISEASE_CLAIMS, PILONIDAL_DISEASE_CONCEPTS, PILONIDAL_DISEASE_QUESTIONS, PILONIDAL_DISEASE_SOURCES } from "./pilonidal-disease";
import { POSTOPERATIVE_SEROMA_CASES, POSTOPERATIVE_SEROMA_CLAIMS, POSTOPERATIVE_SEROMA_CONCEPTS, POSTOPERATIVE_SEROMA_QUESTIONS, POSTOPERATIVE_SEROMA_SOURCES } from "./postoperative-seroma";
import { SURGERY_CENTER_AUTHORING_CONCEPTS, SURGERY_CENTER_BATCH_MANIFEST, SURGERY_CENTER_CASE_REVIEWS, SURGERY_CENTER_CASES, SURGERY_CENTER_CLAIMS, SURGERY_CENTER_QUESTIONS, SURGERY_CENTER_SERVICE_CONTRACTS, SURGERY_CENTER_SOURCES, SURGERY_CENTER_TESTED_CONCEPTS } from "./surgery-center-batch";

const remainingConcepts = [...ANAL_FISSURE_CONCEPTS, ...INTERNAL_HEMORRHOIDS_CONCEPTS, ...ESOPHAGEAL_DYSPHAGIA_CONCEPTS, ...ACHALASIA_CONCEPTS, ...PIGMENTED_SKIN_LESION_CONCEPTS, ...POSTOPERATIVE_SEROMA_CONCEPTS, ...PILONIDAL_DISEASE_CONCEPTS];
const remainingQuestions = [...ANAL_FISSURE_QUESTIONS, ...INTERNAL_HEMORRHOIDS_QUESTIONS, ...ESOPHAGEAL_DYSPHAGIA_QUESTIONS, ...ACHALASIA_QUESTIONS, ...PIGMENTED_SKIN_LESION_QUESTIONS, ...POSTOPERATIVE_SEROMA_QUESTIONS, ...PILONIDAL_DISEASE_QUESTIONS];
const remainingCases = [...ANAL_FISSURE_CASES, ...INTERNAL_HEMORRHOIDS_CASES, ...ESOPHAGEAL_DYSPHAGIA_CASES, ...ACHALASIA_CASES, ...PIGMENTED_SKIN_LESION_CASES, ...POSTOPERATIVE_SEROMA_CASES, ...PILONIDAL_DISEASE_CASES];
const remainingClaims = [...ANAL_FISSURE_CLAIMS, ...INTERNAL_HEMORRHOIDS_CLAIMS, ...ESOPHAGEAL_DYSPHAGIA_CLAIMS, ...ACHALASIA_CLAIMS, ...PIGMENTED_SKIN_LESION_CLAIMS, ...POSTOPERATIVE_SEROMA_CLAIMS, ...PILONIDAL_DISEASE_CLAIMS];
const remainingSources = [...ANAL_FISSURE_SOURCES, ...INTERNAL_HEMORRHOIDS_SOURCES, ...ESOPHAGEAL_DYSPHAGIA_SOURCES, ...ACHALASIA_SOURCES, ...PIGMENTED_SKIN_LESION_SOURCES, ...POSTOPERATIVE_SEROMA_SOURCES, ...PILONIDAL_DISEASE_SOURCES];
const words = (value: string) => value.trim().split(/\s+/).length;

describe("2026-09-10 remaining surgery-center authoring", () => {
  it("contains fourteen concepts, fifty-six variants, and twenty-eight two-node cases", () => {
    expect(remainingConcepts).toHaveLength(14);
    expect(remainingQuestions).toHaveLength(56);
    expect(remainingCases).toHaveLength(28);
    expect(new Set(remainingConcepts.map((item) => item.id)).size).toBe(14);
    expect(new Set(remainingQuestions.map((item) => item.id)).size).toBe(56);
    for (const item of remainingConcepts) expect(remainingQuestions.filter((question) => question.conceptId === item.id)).toHaveLength(4);
    expect(remainingCases.every((item) => item.decisionNodes.length === 2)).toBe(true);
  });

  it("keeps all records unapproved by a named clinician with complete traceability", () => {
    for (const item of [...remainingConcepts, ...remainingQuestions, ...remainingClaims, ...remainingSources]) {
      expect(item.contentVersion).toBe("development-batch.2026-09-10.1");
      expect(item.reviewStatus).toBe("needs_clinician_review");
      expect(item.aiAssistedDrafting).toBe(true);
      expect(item.lastClinicianReview).toBeNull();
    }
    for (const item of [...remainingConcepts, ...remainingQuestions]) {
      expect(item.agentReview.authority).toBe("owner-delegated agent authoring and review");
      expect(item.agentReview.clinicianSignOff).toBe(false);
    }
    const sourceIds = new Set(remainingSources.map((item) => item.id));
    const claimIds = new Set(remainingClaims.map((item) => item.id));
    for (const evidenceClaim of remainingClaims) {
      expect(evidenceClaim.lastCheckedOn).toBe("2026-09-10");
      expect(evidenceClaim.limitation).toBeTruthy();
      expect(evidenceClaim.sourceIds.every((id) => sourceIds.has(id))).toBe(true);
    }
    for (const source of remainingSources) {
      expect(source.accessedOn).toBe("2026-09-10");
      expect(source.completeCitation.length).toBeGreaterThan(40);
      expect(source.officialUrl).toMatch(/^https:\/\//);
      expect(source.evidenceClaimIds.every((id) => claimIds.has(id))).toBe(true);
      if (source.completeCitation.includes("Undated")) expect(source.publicationYear).toBeNull();
    }
  });

  it("uses contextual shuffled questions, one primary concept, and balanced parallel choices", () => {
    const questionIds = new Set(remainingQuestions.map((item) => item.id));
    for (const clinicalCase of remainingCases) {
      expect(syntheticClinicalCaseSchema.parse(clinicalCase)).toEqual(clinicalCase);
      expect(clinicalCase.patientDisplayName).toBe("{patientName}");
      expect(clinicalCase.presentation).toContain("{patientName}");
      expect(clinicalCase.approvedInstantiationProfiles).toHaveLength(4);
      expect(clinicalCase.decisionNodes.map((node) => node.primaryConceptId)).toHaveLength(2);
      for (const node of clinicalCase.decisionNodes) {
        expect(node.stem).toContain("{patientName}");
        expect(node.shuffleAnswers).toBe(true);
        expect(node.answerChoices).toHaveLength(4);
        expect(node.answerChoices.filter((choice) => choice.isCorrect)).toHaveLength(1);
        expect(questionIds.has(node.questionVariantId)).toBe(true);
        const lengths = node.answerChoices.map((choice) => words(choice.label));
        expect(Math.max(...lengths) - Math.min(...lengths)).toBeLessThanOrEqual(4);
        const correct = node.answerChoices.find((choice) => choice.isCorrect)!;
        expect(words(correct.label)).toBeLessThanOrEqual(Math.max(...node.answerChoices.filter((choice) => !choice.isCorrect).map((choice) => words(choice.label))));
        expect(correct.label.length).toBeLessThanOrEqual(Math.max(...node.answerChoices.filter((choice) => !choice.isCorrect).map((choice) => choice.label.length)));
      }
    }
  });

  it("uses exactly twenty genuine result gates and keeps their next answers hidden", () => {
    const gatedFamilies = [INTERNAL_HEMORRHOIDS_CASES, ESOPHAGEAL_DYSPHAGIA_CASES, ACHALASIA_CASES, PIGMENTED_SKIN_LESION_CASES, POSTOPERATIVE_SEROMA_CASES];
    expect(gatedFamilies.flat().every((item) => item.decisionNodes[0]!.resultGateAfter !== null)).toBe(true);
    expect([...ANAL_FISSURE_CASES, ...PILONIDAL_DISEASE_CASES].every((item) => item.decisionNodes.every((node) => node.resultGateAfter === null))).toBe(true);
    const gates = remainingCases.flatMap((item) => item.decisionNodes).filter((node) => node.resultGateAfter);
    expect(gates).toHaveLength(20);
    for (const clinicalCase of gatedFamilies.flat()) {
      const [first, second] = clinicalCase.decisionNodes;
      const gate = first!.resultGateAfter!;
      expect(first!.answerChoices.find((choice) => choice.isCorrect)?.serviceRequest?.serviceId).toBe(gate.resultTypeId);
      expect(first!.answerChoices.filter((choice) => !choice.isCorrect).every((choice) => choice.serviceRequest === null)).toBe(true);
      expect(second!.currentUpdate).toBe(gate.resultNarrative);
      expect(clinicalCase.presentation).not.toContain(gate.resultNarrative);
      const nextKey = second!.answerChoices.find((choice) => choice.isCorrect)!.label.toLowerCase();
      expect(gate.resultNarrative.toLowerCase()).not.toContain(nextKey);
    }
  });

  it("keeps education classified as education and excludes every withdrawn host", () => {
    const educationalIds = new Set(["source.sc.ascrs-fissure-patient", "source.sc.ascrs-hemorrhoids-patient", "source.sc.acg-barrett-patient-2024", "source.sc.aad-melanoma-highlights", "source.sc.ucla-post-surgical-fluid", "source.sc.ascrs-pilonidal-patient"]);
    for (const source of remainingSources) if (educationalIds.has(source.id)) expect(source.sourceClass).toBe("open_educational_resource");
    const serialized = JSON.stringify({ remainingSources, remainingClaims, remainingQuestions });
    expect(serialized).not.toContain("ascrsu.com");
    expect(serialized).not.toContain("academic.oup.com");
    expect(serialized).not.toContain("PMC8097120");
  });

  it("assembles the complete twenty-concept batch with exact capability and manifest boundaries", () => {
    expect(SURGERY_CENTER_AUTHORING_CONCEPTS).toHaveLength(20);
    expect(SURGERY_CENTER_TESTED_CONCEPTS).toHaveLength(20);
    expect(SURGERY_CENTER_QUESTIONS).toHaveLength(80);
    expect(SURGERY_CENTER_CASES).toHaveLength(40);
    expect(SURGERY_CENTER_CASE_REVIEWS).toHaveLength(40);
    expect(SURGERY_CENTER_CLAIMS).toHaveLength(20);
    expect(SURGERY_CENTER_SOURCES).toHaveLength(20);
    expect(SURGERY_CENTER_SERVICE_CONTRACTS).toHaveLength(7);
    expect(new Set(SURGERY_CENTER_AUTHORING_CONCEPTS.map((item) => item.id)).size).toBe(20);
    expect(new Set(SURGERY_CENTER_TESTED_CONCEPTS.map((item) => item.id)).size).toBe(20);
    expect(new Set(SURGERY_CENTER_QUESTIONS.map((item) => item.id)).size).toBe(80);
    expect(new Set(SURGERY_CENTER_CASES.map((item) => item.id)).size).toBe(40);
    expect(SURGERY_CENTER_CASES.flatMap((item) => item.decisionNodes).filter((node) => node.resultGateAfter)).toHaveLength(32);
    expect(SURGERY_CENTER_BATCH_MANIFEST).toMatchObject({ authoringConceptCount: 20, testedConceptCount: 20, questionVariantCount: 80, caseCount: 40, multistepCaseCount: 40, resultGateCount: 32, publicReleaseAuthorized: false });
    for (const tested of SURGERY_CENTER_TESTED_CONCEPTS) expect(testedConceptSchema.parse(tested)).toMatchObject({ id: tested.id });
    for (const clinicalCase of ESOPHAGEAL_DYSPHAGIA_CASES) {
      expect(clinicalCase.earliestFacilityStage).toBe(2);
      expect(clinicalCase.requiredCapabilityIds).toEqual(["capability.endoscopy"]);
      expect(clinicalCase.decisionNodes[0]!.resultGateAfter).toMatchObject({ resultTypeId: "service.endoscopy", allowedServiceRouteIds: ["route.endoscopy.in_house"] });
    }
  });
});
