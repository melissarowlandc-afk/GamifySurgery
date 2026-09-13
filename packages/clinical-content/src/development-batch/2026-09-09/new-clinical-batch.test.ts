import { describe, expect, it } from "vitest";
import { syntheticClinicalCaseSchema, testedConceptSchema } from "../../schema";
import {
  NEW_BATCH_AUTHORING_CONCEPTS,
  NEW_BATCH_CASE_REVIEWS,
  NEW_BATCH_CASES,
  NEW_BATCH_CLAIMS,
  NEW_BATCH_CONCEPTS,
  NEW_BATCH_QUESTIONS,
  NEW_BATCH_SERVICE_CONTRACTS,
  NEW_BATCH_SOURCES,
} from "./new-clinical-batch";

const EXPECTED_CONCEPT_IDS = [
  "concept.gallstones.initial-ultrasound",
  "concept.gallstones.symptomatic-surgical-referral",
  "concept.gallstones.incidental-observation",
  "concept.nephrolithiasis.noncontrast-ct-evaluation",
  "concept.nephrolithiasis.recurrent-metabolic-evaluation",
  "concept.celiac.initial-serology",
  "concept.celiac.duodenal-biopsy-confirmation",
  "concept.celiac.gluten-free-treatment",
  "concept.colorectal.positive-fit-colonoscopy",
  "concept.colorectal.histologic-confirmation",
  "concept.iron-deficiency.iron-studies",
  "concept.iron-deficiency.gi-evaluation",
  "concept.soft-tissue-mass.extremity-mri",
  "concept.soft-tissue-mass.specialist-planned-biopsy",
].sort();

describe("2026-09-09 unadmitted clinical batch", () => {
  it("contains the exact 14-concept, 56-question, 28-case inventory", () => {
    expect(NEW_BATCH_AUTHORING_CONCEPTS.map((item) => item.id).sort()).toEqual(EXPECTED_CONCEPT_IDS);
    expect(NEW_BATCH_CONCEPTS).toHaveLength(14);
    expect(NEW_BATCH_QUESTIONS).toHaveLength(56);
    expect(NEW_BATCH_CASES).toHaveLength(28);
    expect(new Set(NEW_BATCH_QUESTIONS.map((item) => item.id)).size).toBe(56);
    expect(new Set(NEW_BATCH_CASES.map((item) => item.id)).size).toBe(28);
    for (const conceptId of EXPECTED_CONCEPT_IDS) {
      expect(NEW_BATCH_QUESTIONS.filter((question) => question.conceptId === conceptId)).toHaveLength(4);
    }
  });

  it("keeps all records awaiting clinician review while recording bounded agent review", () => {
    for (const record of [...NEW_BATCH_AUTHORING_CONCEPTS, ...NEW_BATCH_QUESTIONS, ...NEW_BATCH_CASE_REVIEWS, ...NEW_BATCH_CLAIMS, ...NEW_BATCH_SOURCES]) {
      expect(record.reviewStatus).toBe("needs_clinician_review");
      expect(record.lastClinicianReview).toBeNull();
      expect(record.aiAssistedDrafting).toBe(true);
    }
    for (const record of [...NEW_BATCH_AUTHORING_CONCEPTS, ...NEW_BATCH_QUESTIONS, ...NEW_BATCH_CASE_REVIEWS]) {
      expect(record.agentReview.authority).toBe("owner-delegated agent authoring and review");
      expect(record.agentReview.clinicianSignOff).toBe(false);
    }
    expect(JSON.stringify({ concepts: NEW_BATCH_AUTHORING_CONCEPTS, questions: NEW_BATCH_QUESTIONS, reviews: NEW_BATCH_CASE_REVIEWS })).not.toMatch(/Melissa|clinically_approved/);
  });

  it("records teaching tier separately from facility stage and derives each case tier from its concepts", () => {
    const concepts = new Map(NEW_BATCH_AUTHORING_CONCEPTS.map((item) => [item.id, item]));
    for (const review of NEW_BATCH_CASE_REVIEWS) {
      const clinicalCase = NEW_BATCH_CASES.find((item) => item.id === review.caseId)!;
      const expectedTier = Math.max(...clinicalCase.decisionNodes.map((node) => concepts.get(node.primaryConceptId)!.educationalTier));
      expect(review.educationalTier).toBe(expectedTier);
      expect(review.earliestFacilityStage).toBe(clinicalCase.earliestFacilityStage);
      expect(review.profileValuesBasis).toBe("editorial_simulation_not_prevalence_or_diagnostic_threshold");
    }
  });

  it("passes the current runtime case and concept schemas", () => {
    for (const concept of NEW_BATCH_CONCEPTS) expect(testedConceptSchema.parse(concept)).toEqual(concept);
    for (const clinicalCase of NEW_BATCH_CASES) expect(syntheticClinicalCaseSchema.parse(clinicalCase)).toEqual(clinicalCase);
  });

  it("uses complete shuffled four-choice questions with one key and resolved references", () => {
    const conceptIds = new Set(NEW_BATCH_CONCEPTS.map((item) => item.id));
    const questionIds = new Set(NEW_BATCH_QUESTIONS.map((item) => item.id));
    const claimIds = new Set(NEW_BATCH_CLAIMS.map((item) => item.id));
    for (const question of NEW_BATCH_QUESTIONS) {
      expect(question.answerChoices).toHaveLength(4);
      expect(question.answerChoices.filter((choice) => choice.isCorrect)).toHaveLength(1);
      expect(question.answerChoices.every((choice) => choice.label.trim().length >= 4)).toBe(true);
      expect(conceptIds.has(question.conceptId)).toBe(true);
      expect(question.supportingEvidenceClaimIds.every((id) => claimIds.has(id))).toBe(true);
    }
    for (const clinicalCase of NEW_BATCH_CASES) {
      for (const node of clinicalCase.decisionNodes) {
        expect(node.shuffleAnswers).toBe(true);
        expect(questionIds.has(node.questionVariantId)).toBe(true);
        expect(conceptIds.has(node.primaryConceptId)).toBe(true);
      }
    }
  });

  it("has 24 multistep cases, 28 real gates, four incidental single-node cases, and correct stage floors", () => {
    const multi = NEW_BATCH_CASES.filter((item) => item.decisionNodes.length > 1);
    const singles = NEW_BATCH_CASES.filter((item) => item.decisionNodes.length === 1);
    expect(multi).toHaveLength(24);
    expect(singles).toHaveLength(4);
    expect(NEW_BATCH_CASES.flatMap((item) => item.decisionNodes).filter((node) => node.resultGateAfter !== null)).toHaveLength(28);
    expect(singles.every((item) => item.id.includes("gallstones.incidental"))).toBe(true);
    for (const clinicalCase of NEW_BATCH_CASES) {
      if (clinicalCase.decisionNodes.length === 2) expect(clinicalCase.earliestFacilityStage).toBeGreaterThanOrEqual(1);
      if (clinicalCase.decisionNodes.length === 3) expect(clinicalCase.earliestFacilityStage).toBeGreaterThanOrEqual(2);
      expect(new Set(clinicalCase.decisionNodes.map((node) => node.primaryConceptId)).size).toBe(clinicalCase.decisionNodes.length);
      clinicalCase.decisionNodes.forEach((node, index) => {
        expect(node.resultGateAfter === null).toBe(index === clinicalCase.decisionNodes.length - 1);
        if (index === clinicalCase.decisionNodes.length - 1) {
          expect(node.answerChoices.every((choice) => choice.serviceRequest === null)).toBe(true);
        }
        if (node.resultGateAfter) {
          const keyed = node.answerChoices.find((choice) => choice.isCorrect)!;
          expect(keyed.serviceRequest?.serviceId).toBe(node.resultGateAfter.resultTypeId);
        }
      });
    }
  });

  it("maps every gate to an explicit service contract and route allowlist", () => {
    const contracts = new Map(NEW_BATCH_SERVICE_CONTRACTS.map((item) => [item.serviceId, item]));
    expect([...contracts.keys()].sort()).toEqual([
      "service.basic_labs",
      "service.colonoscopy",
      "service.ct",
      "service.extremity_mri",
      "service.ultrasound",
      "service.upper_endoscopy_duodenal_biopsy",
    ]);
    for (const clinicalCase of NEW_BATCH_CASES) for (const node of clinicalCase.decisionNodes) if (node.resultGateAfter) {
      const contract = contracts.get(node.resultGateAfter.resultTypeId)!;
      expect(contract).toBeDefined();
      expect(node.resultGateAfter.allowedServiceRouteIds.every((route) => contract.allowedRouteIds.includes(route))).toBe(true);
    }
  });

  it("keeps initial presentations result-free and binds later review context to delivered results", () => {
    for (const clinicalCase of NEW_BATCH_CASES) {
      expect(clinicalCase.patientDisplayName).toBe("{patientName}");
      expect(clinicalCase.presentation).toContain("{patientName}");
      expect(clinicalCase.approvedInstantiationProfiles!.length).toBeGreaterThanOrEqual(2);
      expect(new Set(clinicalCase.approvedInstantiationProfiles!.map((profile) => profile.prototypeDemographics?.ageYears)).size).toBeGreaterThanOrEqual(2);
      for (const profile of clinicalCase.approvedInstantiationProfiles!) expect(profile.presentation).toBe(clinicalCase.presentation);
      clinicalCase.decisionNodes.forEach((node, index) => {
        const question = NEW_BATCH_QUESTIONS.find((item) => item.id === node.questionVariantId)!;
        expect(question.patientPresentation).toBe(clinicalCase.presentation);
        if (index > 0) {
          expect(question.reachedCurrentUpdate).toBe(node.currentUpdate);
          expect(node.currentUpdate).toBe(clinicalCase.decisionNodes[index - 1]!.resultGateAfter!.resultNarrative);
          expect(clinicalCase.presentation).not.toContain(node.currentUpdate!);
        }
      });
    }
    expect(JSON.stringify(NEW_BATCH_CASES)).not.toMatch(/\b[A-Z][a-z]+(?:'s)? attends clinic\b/);
    for (const clinicalCase of NEW_BATCH_CASES.filter((item) => item.presentation.includes("nonpregnant"))) {
      expect(clinicalCase.approvedInstantiationProfiles!.every((profile) => profile.prototypeDemographics?.sexLabel === "Female")).toBe(true);
    }
    for (const clinicalCase of NEW_BATCH_CASES.filter((item) => item.presentation.includes("postmenopausal"))) {
      expect(clinicalCase.approvedInstantiationProfiles!.every((profile) => profile.prototypeDemographics?.sexLabel === "Female")).toBe(true);
    }
  });

  it("has complete bidirectional source-claim mappings and explicit rights", () => {
    const sources = new Map(NEW_BATCH_SOURCES.map((item) => [item.id, item]));
    const claims = new Map(NEW_BATCH_CLAIMS.map((item) => [item.id, item]));
    expect(sources.size).toBe(NEW_BATCH_SOURCES.length);
    expect(claims.size).toBe(NEW_BATCH_CLAIMS.length);
    for (const source of sources.values()) {
      expect(source.completeCitation.length).toBeGreaterThan(40);
      expect(source.authorityAssessment.length).toBeGreaterThan(30);
      expect(source.reuseNotes.length).toBeGreaterThan(30);
      expect(source.evidenceClaimIds.length).toBeGreaterThan(0);
      for (const claimId of source.evidenceClaimIds) expect(claims.get(claimId)?.sourceIds).toContain(source.id);
    }
    for (const evidenceClaim of claims.values()) {
      expect(evidenceClaim.limitation).toBeTruthy();
      for (const sourceId of evidenceClaim.sourceIds) expect(sources.get(sourceId)?.evidenceClaimIds).toContain(evidenceClaim.id);
    }
    for (const authoredConcept of NEW_BATCH_AUTHORING_CONCEPTS) {
      expect(authoredConcept.evidenceClaimIds.length).toBeGreaterThan(0);
      expect(authoredConcept.evidenceClaimIds.every((claimId) => claims.has(claimId))).toBe(true);
    }
  });

  it("preserves family-specific clinical boundaries", () => {
    const text = JSON.stringify({ cases: NEW_BATCH_CASES, claims: NEW_BATCH_CLAIMS });
    expect(text).not.toMatch(/service\.breast|route\.breast|\bEAU\b/);
    expect(text).not.toMatch(/\b\d+(?:\.\d+)?\s*(?:mg|milligrams?)\b/i);
    expect(text).toContain("positive FIT is an abnormal screening result, not a cancer diagnosis");
    expect(text).toContain("MRI guides planning but does not prove a histologic diagnosis");
    expect(text).toContain("Inflammation can make a normal ferritin less reassuring");
    expect(text).toContain("starting gluten avoidance before testing can change results");
  });
});
