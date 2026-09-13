import { describe, expect, it } from "vitest";
import { syntheticClinicalCaseSchema, testedConceptSchema } from "../../schema";
import {
  ASYMPTOMATIC_PHPT_CASES,
  ASYMPTOMATIC_PHPT_CASE_REVIEWS,
  ASYMPTOMATIC_PHPT_CLAIMS,
  ASYMPTOMATIC_PHPT_CONCEPTS,
  ASYMPTOMATIC_PHPT_QUESTIONS,
  ASYMPTOMATIC_PHPT_SOURCES,
  ASYMPTOMATIC_PHPT_TESTED_CONCEPTS,
  ASYMPTOMATIC_PHPT_TIMING_ENTRIES,
} from "./asymptomatic-phpt";
import {
  CUSHING_CLASSIFICATION_CASES,
  CUSHING_CLASSIFICATION_CASE_REVIEWS,
  CUSHING_CLASSIFICATION_CLAIMS,
  CUSHING_CLASSIFICATION_CONCEPTS,
  CUSHING_CLASSIFICATION_QUESTIONS,
  CUSHING_CLASSIFICATION_SOURCES,
  CUSHING_CLASSIFICATION_TESTED_CONCEPTS,
  CUSHING_CLASSIFICATION_TIMING_ENTRIES,
} from "./cushing-classification";
import {
  PANCREATIC_CYST_CASES,
  PANCREATIC_CYST_CASE_REVIEWS,
  PANCREATIC_CYST_CLAIMS,
  PANCREATIC_CYST_CONCEPTS,
  PANCREATIC_CYST_QUESTIONS,
  PANCREATIC_CYST_SOURCES,
  PANCREATIC_CYST_TESTED_CONCEPTS,
  PANCREATIC_CYST_TIMING_ENTRIES,
} from "./pancreatic-cyst";

const concepts = [
  ...ASYMPTOMATIC_PHPT_CONCEPTS,
  ...CUSHING_CLASSIFICATION_CONCEPTS,
  ...PANCREATIC_CYST_CONCEPTS,
];
const testedConcepts = [
  ...ASYMPTOMATIC_PHPT_TESTED_CONCEPTS,
  ...CUSHING_CLASSIFICATION_TESTED_CONCEPTS,
  ...PANCREATIC_CYST_TESTED_CONCEPTS,
];
const questions = [
  ...ASYMPTOMATIC_PHPT_QUESTIONS,
  ...CUSHING_CLASSIFICATION_QUESTIONS,
  ...PANCREATIC_CYST_QUESTIONS,
];
const cases = [
  ...ASYMPTOMATIC_PHPT_CASES,
  ...CUSHING_CLASSIFICATION_CASES,
  ...PANCREATIC_CYST_CASES,
];
const claims = [
  ...ASYMPTOMATIC_PHPT_CLAIMS,
  ...CUSHING_CLASSIFICATION_CLAIMS,
  ...PANCREATIC_CYST_CLAIMS,
];
const sources = [
  ...ASYMPTOMATIC_PHPT_SOURCES,
  ...CUSHING_CLASSIFICATION_SOURCES,
  ...PANCREATIC_CYST_SOURCES,
];
const timingEntries = [
  ...ASYMPTOMATIC_PHPT_TIMING_ENTRIES,
  ...CUSHING_CLASSIFICATION_TIMING_ENTRIES,
  ...PANCREATIC_CYST_TIMING_ENTRIES,
];
const caseReviews = [
  ...ASYMPTOMATIC_PHPT_CASE_REVIEWS,
  ...CUSHING_CLASSIFICATION_CASE_REVIEWS,
  ...PANCREATIC_CYST_CASE_REVIEWS,
];

describe("2026-09-11 endocrine and pancreas authoring milestone", () => {
  it("contains six stable concepts, twenty-four variants, and twelve gated two-node cases", () => {
    expect(concepts).toHaveLength(6);
    expect(new Set(concepts.map((item) => item.id)).size).toBe(6);
    expect(questions).toHaveLength(24);
    expect(cases).toHaveLength(12);
    expect(cases.flatMap((item) => item.decisionNodes).filter((node) => node.resultGateAfter)).toHaveLength(12);
    for (const item of concepts) expect(questions.filter((question) => question.conceptId === item.id)).toHaveLength(4);
  });

  it("keeps records unapproved, source-traceable, and schema-valid", () => {
    for (const item of [...concepts, ...questions, ...claims, ...sources, ...caseReviews]) {
      expect(item.reviewStatus).toBe("needs_clinician_review");
      expect(item.lastClinicianReview).toBeNull();
      expect(item.aiAssistedDrafting).toBe(true);
    }
    for (const item of [...concepts, ...questions, ...caseReviews]) {
      expect(item.agentReview.authority).toBe("owner-delegated agent authoring and review");
      expect(item.agentReview.clinicianSignOff).toBe(false);
    }
    for (const item of testedConcepts) expect(testedConceptSchema.parse(item)).toEqual(item);
    for (const clinicalCase of cases) expect(syntheticClinicalCaseSchema.parse(clinicalCase)).toEqual(clinicalCase);
    const sourceById = new Map(sources.map((item) => [item.id, item]));
    for (const evidenceClaim of claims) for (const sourceId of evidenceClaim.sourceIds) expect(sourceById.get(sourceId)?.evidenceClaimIds).toContain(evidenceClaim.id);
    for (const item of sources) for (const claimId of item.evidenceClaimIds) expect(claims.find((claim) => claim.id === claimId)?.sourceIds).toContain(item.id);
  });

  it("uses patient-linked result gates and keeps returned findings out of intake", () => {
    for (const clinicalCase of cases) {
      const [first, second] = clinicalCase.decisionNodes;
      expect(clinicalCase.patientDisplayName).toBe("{patientName}");
      expect(clinicalCase.presentation).toContain("{patientName}");
      expect(clinicalCase.approvedInstantiationProfiles).toHaveLength(4);
      expect(first?.shuffleAnswers).toBe(true);
      expect(second?.shuffleAnswers).toBe(true);
      expect(first?.resultGateAfter).not.toBeNull();
      expect(second?.resultGateAfter).toBeNull();
      expect(second?.currentUpdate).toBe(first?.resultGateAfter?.resultNarrative);
      expect(clinicalCase.presentation).not.toContain(first?.resultGateAfter?.resultNarrative ?? "");
      expect(first?.answerChoices.filter((choice) => choice.isCorrect)).toHaveLength(1);
      expect(second?.answerChoices.filter((choice) => choice.isCorrect)).toHaveLength(1);
      expect(first?.answerChoices.find((choice) => choice.isCorrect)?.serviceRequest?.serviceId).toBe(first?.resultGateAfter?.resultTypeId);
      expect(first?.answerChoices.filter((choice) => !choice.isCorrect).every((choice) => choice.serviceRequest === null)).toBe(true);
    }
    expect(cases.flatMap((clinicalCase) => clinicalCase.decisionNodes).every((node) => node.answerChoices.filter((choice) => choice.isCorrect).length === 1)).toBe(true);
  });

  it("creates timing entries from every authored node and uses only declared timing contracts", () => {
    expect(timingEntries).toHaveLength(24);
    const nodeIds = new Set(cases.flatMap((clinicalCase) => clinicalCase.decisionNodes.map((node) => node.id)));
    expect(new Set(timingEntries.map((item) => item.nodeId))).toEqual(nodeIds);
    const profiles = new Set([
      "timing.test.dxa",
      "timing.test.nuclear_imaging",
      "timing.test.ultrasound",
      "timing.test.basic_labs",
      "timing.test.mri",
      "timing.test.ct",
      "timing.test.mrcp",
      "timing.test.endoscopy_with_sampling",
      "timing.test.overnight_protocol",
      "timing.test.pet_ct",
    ]);
    for (const entry of timingEntries) {
      const clinicalCase = cases.find((item) => item.id === entry.caseId);
      const node = clinicalCase?.decisionNodes.find((item) => item.id === entry.nodeId);
      expect(node?.questionVariantId).toBe(entry.questionVariantId);
      if (entry.classification.kind === "no_test") continue;
      expect(entry.classification.choices).toHaveLength(4);
      for (const choice of entry.classification.choices) {
        const authoredChoice = node?.answerChoices.find((item) => item.id === choice.choiceId);
        expect(authoredChoice?.label).toBe(choice.choiceLabel);
        if (choice.timing.kind === "test") expect(profiles.has(choice.timing.timingProfileId)).toBe(true);
      }
    }
  });

  it("keeps the PHPT age criterion and the Cushing and cyst limits clinically bounded", () => {
    expect(ASYMPTOMATIC_PHPT_CLAIMS.every((item) => item.certainty === "moderate")).toBe(true);
    for (const clinicalCase of ASYMPTOMATIC_PHPT_CASES) {
      expect(clinicalCase.approvedInstantiationProfiles?.every((profile) => (profile.prototypeDemographics?.ageYears ?? 50) < 50)).toBe(true);
      expect(clinicalCase.decisionNodes[1]?.stem).not.toContain("age under 50");
      expect(clinicalCase.decisionNodes[1]?.currentUpdate).toContain("age-appropriate normal bone density");
    }
    for (const clinicalCase of CUSHING_CLASSIFICATION_CASES) {
      expect(clinicalCase.decisionNodes[0]?.answerChoices.find((choice) => choice.isCorrect)?.label).toBe("Plasma ACTH measurement");
      expect(clinicalCase.decisionNodes[1]?.answerChoices.find((choice) => choice.isCorrect)?.label).toContain("Adrenal CT");
    }
    const cushingTiming = CUSHING_CLASSIFICATION_TIMING_ENTRIES.flatMap((entry) => entry.classification.kind === "test_choices" ? entry.classification.choices : []);
    expect(cushingTiming.find((choice) => choice.choiceId === "repeat_dst_1")?.timing).toEqual({ kind: "test", timingProfileId: "timing.test.overnight_protocol" });
    expect(cushingTiming.find((choice) => choice.choiceId === "whole_body_pet_ct_next_1")?.timing).toEqual({ kind: "test", timingProfileId: "timing.test.pet_ct" });
    expect(JSON.stringify(PANCREATIC_CYST_CASES)).toContain("does not prove histology, cancer, or an automatic need for resection");
  });
});
