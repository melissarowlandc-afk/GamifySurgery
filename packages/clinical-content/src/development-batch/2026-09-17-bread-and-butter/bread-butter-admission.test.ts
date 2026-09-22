import { describe, expect, it } from "vitest";
import { syntheticClinicalCaseSchema } from "../../schema";
import { SYNTHETIC_CLINICAL_RELEASE } from "../../synthetic-content";
import {
  BREAD_BUTTER_20260917_AUTHORING_CONCEPTS as concepts,
  BREAD_BUTTER_20260917_BATCH_MANIFEST as manifest,
  BREAD_BUTTER_20260917_CASE_REVIEWS as reviews,
  BREAD_BUTTER_20260917_CASES as cases,
  BREAD_BUTTER_20260917_CLAIMS as claims,
  BREAD_BUTTER_20260917_QUESTIONS as questions,
  BREAD_BUTTER_20260917_SERVICE_CONTRACTS as serviceContracts,
  BREAD_BUTTER_20260917_SOURCES as sources,
  BREAD_BUTTER_20260917_TESTED_CONCEPTS as testedConcepts,
  BREAD_BUTTER_20260917_TIMING_ENTRIES as timings,
} from "./bread-butter-batch";

function idsAreUnique(records: readonly { id: string }[]) {
  return new Set(records.map((record) => record.id)).size === records.length;
}

describe("September 17 bread-and-butter admission", () => {
  it("admits the exact authored draft batch once", () => {
    expect(manifest).toMatchObject({
      contentVersion: "development-batch.2026-09-17.bread-and-butter.1",
      authoringConceptCount: 20,
      testedConceptCount: 20,
      questionVariantCount: 80,
      caseCount: 52,
      decisionNodeCount: 80,
      resultGateCount: 16,
      caseReviewCount: 52,
      sourceCount: 23,
      evidenceClaimCount: 22,
      timingEntryCount: 80,
      admissionScope: "active_synthetic_unapproved_prototype",
      publicReleaseAuthorized: false,
    });
    for (const records of [
      concepts,
      testedConcepts,
      questions,
      cases,
      reviews,
      sources,
      claims,
      timings,
    ]) {
      expect(records.length).toBeGreaterThan(0);
    }
    expect(SYNTHETIC_CLINICAL_RELEASE.concepts).toHaveLength(183);
    expect(SYNTHETIC_CLINICAL_RELEASE.cases).toHaveLength(450);
    expect(SYNTHETIC_CLINICAL_RELEASE.cases.flatMap((item) => item.decisionNodes))
      .toHaveLength(703);

    for (const clinicalCase of cases) {
      expect(syntheticClinicalCaseSchema.parse(clinicalCase)).toEqual(clinicalCase);
      expect(SYNTHETIC_CLINICAL_RELEASE.cases.filter((item) => item.id === clinicalCase.id))
        .toHaveLength(1);
    }
    for (const records of [
      concepts,
      testedConcepts,
      questions,
      cases,
      claims,
      sources,
    ]) {
      expect(idsAreUnique(records)).toBe(true);
    }
    expect(new Set(reviews.map((review) => review.caseId)).size).toBe(reviews.length);
  });

  it("keeps draft review metadata, provenance, stages, and service contracts coherent", () => {
    const sourceIds = new Set(sources.map((source) => source.id));
    const claimIds = new Set(claims.map((claim) => claim.id));
    const questionIds = new Set(questions.map((question) => question.id));
    const timingQuestionIds = new Set(timings.map((timing) => timing.questionVariantId));
    const reviewedRecords = [
      ...concepts,
      ...questions,
      ...claims,
      ...sources,
      ...reviews,
    ];

    for (const record of reviewedRecords) {
      expect(record.reviewStatus).toBe("needs_clinician_review");
      expect(record.lastClinicianReview).toBeNull();
    }
    for (const record of [...concepts, ...questions, ...reviews]) {
      expect(record.agentReview.clinicianSignOff).toBe(false);
    }
    for (const concept of concepts) {
      expect(testedConcepts.filter((tested) => tested.id === concept.id)).toHaveLength(1);
      expect(questions.filter((question) => question.conceptId === concept.id)).toHaveLength(4);
      expect(concept.earliestFacilityStage).toBeLessThanOrEqual(2);
      for (const claimId of concept.evidenceClaimIds) expect(claimIds.has(claimId)).toBe(true);
    }
    for (const question of questions) {
      expect(questionIds.has(question.id)).toBe(true);
      expect(timingQuestionIds.has(question.id)).toBe(true);
      for (const claimId of question.supportingEvidenceClaimIds) expect(claimIds.has(claimId)).toBe(true);
    }
    for (const claim of claims) {
      expect(claim.sourceIds.length).toBeGreaterThan(0);
      for (const sourceId of claim.sourceIds) {
        expect(sourceIds.has(sourceId)).toBe(true);
        expect(sources.find((source) => source.id === sourceId)?.evidenceClaimIds)
          .toContain(claim.id);
      }
    }
    for (const source of sources) {
      expect(source.evidenceClaimIds.length).toBeGreaterThan(0);
      for (const claimId of source.evidenceClaimIds) expect(claimIds.has(claimId)).toBe(true);
    }
    for (const review of reviews) {
      const clinicalCase = cases.find((item) => item.id === review.caseId);
      expect(clinicalCase).toBeDefined();
      expect(review.earliestFacilityStage).toBe(clinicalCase?.earliestFacilityStage);
      expect(review.earliestFacilityStage).toBeLessThanOrEqual(2);
    }

    const declaredServices = new Map(serviceContracts.map((contract) => [contract.serviceId, contract]));
    for (const node of cases.flatMap((clinicalCase) => clinicalCase.decisionNodes)) {
      const serviceIds = node.answerChoices
        .map((choice) => choice.serviceRequest?.serviceId)
        .filter((serviceId): serviceId is string => serviceId !== undefined);
      if (node.resultGateAfter) {
        expect(declaredServices.get(node.resultGateAfter.resultTypeId)?.allowedRouteIds)
          .toEqual(node.resultGateAfter.allowedServiceRouteIds);
        expect(serviceIds).toContain(node.resultGateAfter.resultTypeId);
      }
    }
  });

  it("keeps four profiles per case and concise authored presentation fields", () => {
    expect(cases.flatMap((clinicalCase) => clinicalCase.approvedInstantiationProfiles))
      .toHaveLength(208);
    for (const clinicalCase of cases) {
      expect(clinicalCase.chiefComplaint.trim().split(/\s+/).length).toBeLessThanOrEqual(5);
      expect(clinicalCase.presentation.trim().split(/\s+/).length).toBeLessThanOrEqual(55);
      expect(clinicalCase.approvedInstantiationProfiles).toHaveLength(4);
      for (const profile of clinicalCase.approvedInstantiationProfiles) {
        const demographics = profile.prototypeDemographics!;
        const sexWord = demographics.sexLabel === "Female" ? "woman" : "man";
        expect(["Female", "Male"]).toContain(demographics.sexLabel);
        expect(profile.presentation).toContain(`${demographics.ageYears}-year-old ${sexWord}`);
      }
      for (const node of clinicalCase.decisionNodes) {
        expect(node.shuffleAnswers).toBe(true);
        expect(node.stem.trim().split(/\s+/).length).toBeLessThanOrEqual(18);
        expect(node.answerChoices).toHaveLength(4);
        expect(node.answerChoices.filter((choice) => choice.isCorrect)).toHaveLength(1);
      }
    }
  });
});
