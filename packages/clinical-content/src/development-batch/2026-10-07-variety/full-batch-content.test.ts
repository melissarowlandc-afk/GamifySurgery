import { describe, expect, it } from "vitest";
import {
  answerChoiceTimingRegistryEntrySchema,
  syntheticClinicalCaseSchema,
  testedConceptSchema,
} from "../../schema";
import { BATCH_CONTENT_VERSION, CHECKED_ON } from "./batch-helpers";
import {
  GS028_20261007_AUTHORING_CONCEPTS as concepts,
  GS028_20261007_TESTED_CONCEPTS as testedConcepts,
  GS028_20261007_QUESTIONS as questions,
  GS028_20261007_CASES as cases,
  GS028_20261007_TIMING_ENTRIES as timings,
  GS028_20261007_CASE_REVIEWS as reviews,
  GS028_20261007_CLAIMS as claims,
  GS028_20261007_SOURCES as sources,
  GS028_20261007_SERVICE_CONTRACTS as serviceContracts,
  GS028_20261007_BATCH_MANIFEST as manifest,
  GS028_20261007_FAMILIES as families,
  mergeClinicalSources,
} from "./variety-batch";

describe("GS-028 October 7 complete variety authoring packet", () => {
  it("contains twenty objectives, eighty questions and two useful paired result gates", () => {
    expect(manifest).toMatchObject({
      contentVersion: "development-batch.2026-10-07.variety.1",
      authoringConceptCount: 20, testedConceptCount: 20, questionVariantCount: 80,
      caseCount: 78, decisionNodeCount: 80, timingEntryCount: 80,
      caseReviewCount: 78, resultGateCount: 2, publicReleaseAuthorized: false,
    });
    for (const concept of concepts) {
      const variants = questions.filter((question) => question.conceptId === concept.id);
      expect(variants, concept.id).toHaveLength(4);
      expect(new Set(variants.map((question) => question.stem)), concept.id).toHaveLength(4);
    }
    expect(new Set(concepts.map((concept) => concept.displayName))).toHaveLength(20);
  });

  it("passes actual runtime schemas and preserves every unique stable record", () => {
    for (const concept of testedConcepts) expect(testedConceptSchema.parse(concept)).toEqual(concept);
    for (const clinicalCase of cases) expect(syntheticClinicalCaseSchema.parse(clinicalCase)).toEqual(clinicalCase);
    for (const timing of timings) expect(answerChoiceTimingRegistryEntrySchema.parse(timing)).toEqual(timing);
    for (const records of [concepts, testedConcepts, questions, cases, claims, sources]) {
      expect(new Set(records.map((record) => record.id))).toHaveLength(records.length);
    }
    const nodes = cases.flatMap((clinicalCase) => clinicalCase.decisionNodes);
    expect(new Set(nodes.map((node) => node.id))).toHaveLength(80);
    expect(new Set(nodes.map((node) => node.questionVariantId))).toHaveLength(80);
    expect(nodes.map((node) => node.questionVariantId).sort()).toEqual(questions.map((question) => question.id).sort());
  });

  it("keeps all clinical metadata draft with separate tier, acuity and facility fields", () => {
    for (const record of [...concepts, ...questions, ...reviews, ...claims, ...sources]) {
      expect(record.contentVersion).toBe(BATCH_CONTENT_VERSION);
      expect(record.reviewStatus).toBe("needs_clinician_review");
      expect(record.lastClinicianReview).toBeNull();
      expect(record.aiAssistedDrafting).toBe(true);
    }
    for (const review of reviews) {
      expect([0, 1]).toContain(review.educationalTier);
      expect(["stable", "urgent"]).toContain(review.acuity);
      expect(review.earliestFacilityStage).toBe(0);
      expect(review.requiredClinicalSetting).toBe("clinic");
      expect(review.profileValuesBasis).toBe("editorial_simulation_not_prevalence_or_diagnostic_threshold");
      expect(review.agentReview.clinicianSignOff).toBe(false);
    }
  });

  it("merges reused source claim links without altering or concealing bibliographic data", () => {
    for (const merged of sources) {
      const originals = families.flatMap((family) => family.sources).filter((source) => source.id === merged.id);
      expect(merged.evidenceClaimIds).toEqual([...new Set(originals.flatMap((source) => source.evidenceClaimIds))].sort());
      const { evidenceClaimIds: _mergedClaims, ...mergedMetadata } = merged;
      for (const original of originals) {
        const { evidenceClaimIds: _originalClaims, ...originalMetadata } = original;
        expect(mergedMetadata).toEqual(originalMetadata);
      }
    }
    const original = sources[0]!;
    expect(() => mergeClinicalSources([original, { ...original, completeCitation: "Conflicting citation metadata" }]))
      .toThrow(`Conflicting clinical-source metadata for ${original.id}`);
    expect(() => mergeClinicalSources([original, { ...original, licenseLabel: "Conflicting reuse permission" }]))
      .toThrow(`Conflicting clinical-source metadata for ${original.id}`);
    const snapshot = JSON.stringify(original);
    mergeClinicalSources([original, original]);
    expect(JSON.stringify(original)).toBe(snapshot);
  });

  it("has reciprocal complete claim/source mappings for every authored teaching node", () => {
    const claimById = new Map(claims.map((claim) => [claim.id, claim]));
    const sourceById = new Map(sources.map((source) => [source.id, source]));
    for (const claim of claims) {
      expect(claim.lastCheckedOn).toBe(CHECKED_ON);
      expect(claim.sourceIds.length, claim.id).toBeGreaterThan(0);
      expect(claim.limitation?.length, claim.id).toBeGreaterThan(15);
      for (const sourceId of claim.sourceIds) expect(sourceById.get(sourceId)?.evidenceClaimIds, claim.id).toContain(claim.id);
    }
    for (const source of sources) {
      expect(source.accessedOn).toBe(CHECKED_ON);
      expect(source.authors.length, source.id).toBeGreaterThan(0);
      expect(source.completeCitation.length, source.id).toBeGreaterThan(40);
      expect(source.organizationOrJournal.length, source.id).toBeGreaterThan(5);
      expect(source.officialUrl).toMatch(/^https:\/\//);
      expect(source.licenseLabel.length, source.id).toBeGreaterThan(20);
      expect(source.authorityAssessment.length, source.id).toBeGreaterThan(30);
      expect(source.evidenceClaimIds.length, source.id).toBeGreaterThan(0);
      for (const claimId of source.evidenceClaimIds) expect(claimById.get(claimId)?.sourceIds, source.id).toContain(source.id);
    }
    for (const question of questions) {
      expect(question.supportingEvidenceClaimIds.length, question.id).toBeGreaterThan(0);
      for (const claimId of question.supportingEvidenceClaimIds) expect(claimById.has(claimId), claimId).toBe(true);
    }
    for (const concept of concepts) {
      for (const claimId of concept.evidenceClaimIds) expect(claimById.has(claimId), claimId).toBe(true);
    }
  });

  it("keeps named adult profiles coherent with each case and its question variants", () => {
    const questionById = new Map(questions.map((question) => [question.id, question]));
    for (const clinicalCase of cases) {
      expect(clinicalCase.patientDisplayName).toBe("{patientName}");
      expect(clinicalCase.chiefComplaint.trim().split(/\s+/).length).toBeLessThanOrEqual(5);
      // Clinically constrained histories can retain one sex with two age profiles.
      expect(clinicalCase.approvedInstantiationProfiles.length, clinicalCase.id).toBeGreaterThanOrEqual(2);
      expect(new Set(clinicalCase.approvedInstantiationProfiles.map((profile) => profile.id))).toHaveLength(clinicalCase.approvedInstantiationProfiles.length);
      expect(new Set(clinicalCase.approvedInstantiationProfiles.map((profile) =>
        `${profile.prototypeDemographics?.ageYears}:${profile.prototypeDemographics?.sexLabel}`)))
        .toHaveLength(clinicalCase.approvedInstantiationProfiles.length);
      for (const profile of clinicalCase.approvedInstantiationProfiles) {
        const demographics = profile.prototypeDemographics!;
        expect(demographics.ageYears).toBeGreaterThanOrEqual(18);
        const sexWord = demographics.sexLabel === "Female" ? "woman" : demographics.sexLabel === "Male" ? "man" : "adult";
        expect(profile.presentation).toContain(`{patientName}, a ${demographics.ageYears}-year-old ${sexWord}`);
        expect(profile.presentation).not.toMatch(/\{patientAge\}|\{patientSex\}/);
      }
      for (const node of clinicalCase.decisionNodes) {
        expect(questionById.get(node.questionVariantId)?.approvedInstantiationProfiles).toEqual(clinicalCase.approvedInstantiationProfiles);
      }
    }
  });

  it("has independently eligible early variants and neutral complete timing for every test option", () => {
    const timingByNode = new Map(timings.map((timing) => [timing.nodeId, timing]));
    for (const concept of concepts) {
      expect(concept.earliestFacilityStage).toBe(0);
      const standaloneStarts = cases.filter((clinicalCase) => clinicalCase.decisionNodes.length === 1
        && clinicalCase.decisionNodes[0]?.primaryConceptId === concept.id);
      expect(standaloneStarts.length, concept.id).toBeGreaterThanOrEqual(2);
    }
    for (const clinicalCase of cases) {
      expect(clinicalCase.requiredClinicalSetting).toBe("clinic");
      expect(clinicalCase.earliestFacilityStage).toBe(0);
      expect(clinicalCase.requiredCapabilityIds).toEqual([]);
      for (const node of clinicalCase.decisionNodes) {
        const timing = timingByNode.get(node.id)!;
        expect(timing.caseId).toBe(clinicalCase.id);
        expect(timing.questionVariantId).toBe(node.questionVariantId);
        if (node.resultGateAfter) {
          expect(timing.classification.kind).toBe("test_choices");
          if (timing.classification.kind !== "test_choices") throw new Error("Missing test-choice timing");
          expect(timing.classification.choices.map((choice) => [choice.choiceId, choice.choiceLabel]))
            .toEqual(node.answerChoices.map((choice) => [choice.id, choice.label]));
          for (const choice of timing.classification.choices) expect(choice.timing.kind).toBe("test");
          expect(new Set(timing.classification.choices.map((choice) => choice.timing.kind === "test" ? choice.timing.timingProfileId : "")))
            .toHaveLength(1);
        } else {
          expect(timing.classification).toEqual({ kind: "no_test" });
          for (const choice of node.answerChoices) expect(choice.serviceRequest).toBeNull();
        }
      }
    }
  });

  it("reveals mixing results only after an external gate and preserves the independent cases", () => {
    const paired = cases.filter((clinicalCase) => clinicalCase.decisionNodes.length === 2);
    expect(paired).toHaveLength(2);
    expect(serviceContracts).toEqual([{
      serviceId: "service.basic_labs", allowedRouteIds: ["route.basic_labs.outsourced"], delivery: "existing_balance_contract",
    }]);
    for (const clinicalCase of paired) {
      const [workup, result] = clinicalCase.decisionNodes;
      expect(workup!.primaryConceptId).toBe("concept.coagulation.isolated-aptt-mixing-workup");
      expect(result!.primaryConceptId).toBe("concept.coagulation.mixing-study-initial-interpretation");
      expect(workup!.resultGateAfter?.allowedServiceRouteIds).toEqual(["route.basic_labs.outsourced"]);
      expect(workup!.answerChoices.find((choice) => choice.isCorrect)?.serviceRequest?.serviceId).toBe("service.basic_labs");
      expect(result!.currentUpdate).toBe(workup!.resultGateAfter?.resultNarrative);
      expect(result!.resultGateAfter).toBeNull();
      expect(clinicalCase.presentation).not.toMatch(/mixture (corrects|fails to correct|remains prolonged)/i);
      const resultQuestion = questions.find((question) => question.id === result!.questionVariantId)!;
      expect(resultQuestion.reachedCurrentUpdate).toBe(result!.currentUpdate);
    }
  });

  it("retains one key, runtime shuffle and key-naming claim-linked feedback", () => {
    const questionById = new Map(questions.map((question) => [question.id, question]));
    for (const clinicalCase of cases) {
      for (const node of clinicalCase.decisionNodes) {
        const question = questionById.get(node.questionVariantId)!;
        expect(node.answerChoices).toHaveLength(4);
        expect(node.answerChoices.filter((choice) => choice.isCorrect)).toHaveLength(1);
        expect(node.shuffleAnswers).toBe(true);
        expect(node.stem.endsWith("?"), node.id).toBe(true);
        expect(node.explanation).toBe(question.explanation);
        const key = node.answerChoices.find((choice) => choice.isCorrect)!;
        expect(node.explanation, node.id).toContain(`The correct answer is “${key.label}.”`);
      }
    }
  });
});
