import { describe, expect, it } from "vitest";
import { EXISTING_ANCHOR_CLAIMS, EXISTING_ANCHOR_SOURCES } from "../2026-09-29-statistics-ethics/clinical-anchor-test-catalog";
import { answerChoiceTimingRegistryEntrySchema, syntheticClinicalCaseSchema, testedConceptSchema } from "../../schema";
import {
  GS028_20261007_VARIETY2_AUTHORING_CONCEPTS as concepts,
  GS028_20261007_VARIETY2_TESTED_CONCEPTS as testedConcepts,
  GS028_20261007_VARIETY2_QUESTIONS as questions,
  GS028_20261007_VARIETY2_CASES as cases,
  GS028_20261007_VARIETY2_TIMING_ENTRIES as timings,
  GS028_20261007_VARIETY2_CASE_REVIEWS as reviews,
  GS028_20261007_VARIETY2_CLAIMS as claims,
  GS028_20261007_VARIETY2_SOURCES as sources,
  GS028_20261007_VARIETY2_FAMILIES as families,
  GS028_20261007_VARIETY2_BATCH_MANIFEST as manifest,
  mergeVariety2ClinicalSources,
} from "./variety-batch";

describe("GS-028 second October 7 complete accepted authoring packet", () => {
  it("contains twenty meanings and eighty questions with the exact profile-reference distinction", () => {
    expect(manifest).toEqual({
      contentVersion: "development-batch.2026-10-07.variety.2",
      authoringConceptCount: 20, testedConceptCount: 20, questionVariantCount: 80,
      caseCount: 78, decisionNodeCount: 80, runtimeCaseProfileCount: 294,
      questionProfileReferenceCount: 302, sourceCount: 32, evidenceClaimCount: 51,
      timingEntryCount: 80, caseReviewCount: 78, resultGateCount: 2,
      publicReleaseAuthorized: false,
    });
    expect(new Set(cases.flatMap((item) => item.approvedInstantiationProfiles).map((item) => item.id)).size).toBe(294);
    expect(new Set(questions.flatMap((item) => item.approvedInstantiationProfiles).map((item) => item.id)).size).toBe(294);
    for (const concept of concepts) {
      const variants = questions.filter((question) => question.conceptId === concept.id);
      expect(variants, concept.id).toHaveLength(4);
      expect(new Set(variants.map((question) => question.stem)).size, concept.id).toBe(4);
      expect(cases.filter((item) => item.decisionNodes.length === 1 && item.decisionNodes[0]!.primaryConceptId === concept.id).length, concept.id)
        .toBeGreaterThanOrEqual(2);
    }
  });

  it("passes actual runtime schemas with unique case, node, question and source identifiers", () => {
    for (const item of testedConcepts) expect(testedConceptSchema.parse(item)).toEqual(item);
    for (const item of cases) expect(syntheticClinicalCaseSchema.parse(item)).toEqual(item);
    for (const item of timings) expect(answerChoiceTimingRegistryEntrySchema.parse(item)).toEqual(item);
    for (const records of [concepts, testedConcepts, questions, cases, claims, sources]) {
      expect(new Set(records.map((item) => item.id)).size).toBe(records.length);
    }
    const nodes = cases.flatMap((item) => item.decisionNodes);
    expect(new Set(nodes.map((item) => item.id)).size).toBe(80);
    expect(nodes.map((item) => item.questionVariantId).sort()).toEqual(questions.map((item) => item.id).sort());
  });

  it("retains clinical draft status independently from editorial acceptance and facility progression", () => {
    for (const item of [...concepts, ...questions, ...reviews, ...claims, ...sources]) {
      expect(item.contentVersion).toBe(manifest.contentVersion);
      expect(item.reviewStatus).toBe("needs_clinician_review");
      expect(item.aiAssistedDrafting).toBe(true);
      expect(item.lastClinicianReview).toBeNull();
    }
    for (const item of reviews) {
      expect(item.agentReview.clinicianSignOff).toBe(false);
      expect(item.earliestFacilityStage).toBe(0);
      expect(item.requiredClinicalSetting).toBe("clinic");
      expect(item.requiredCapabilityIds).toEqual([]);
      expect(item.profileValuesBasis).toBe("editorial_simulation_not_prevalence_or_diagnostic_threshold");
    }
  });

  it("merges reciprocal source links without overwriting contradictory bibliographic or reuse metadata", () => {
    for (const merged of sources) {
      const originals = families.flatMap((family) => family.sources).filter((item) => item.id === merged.id);
      expect(merged.evidenceClaimIds).toEqual([...new Set(originals.flatMap((item) => item.evidenceClaimIds))].sort());
      const { evidenceClaimIds: _mergedClaims, ...metadata } = merged;
      for (const original of originals) {
        const { evidenceClaimIds: _originalClaims, ...originalMetadata } = original;
        expect(metadata).toEqual(originalMetadata);
      }
    }
    const original = sources[0]!;
    const snapshot = JSON.stringify(original);
    expect(mergeVariety2ClinicalSources([original, original])).toHaveLength(1);
    expect(JSON.stringify(original)).toBe(snapshot);
    expect(() => mergeVariety2ClinicalSources([original, { ...original, completeCitation: "Conflicting bibliography" }])).toThrow("Conflicting clinical-source metadata");
    expect(() => mergeVariety2ClinicalSources([original, { ...original, licenseLabel: "Contradictory license" }])).toThrow("Conflicting clinical-source metadata");
    const claimById = new Map(claims.map((item) => [item.id, item]));
    const sourceById = new Map(sources.map((item) => [item.id, item]));
    for (const item of claims) {
      expect(item.lastCheckedOn).toBe("2026-10-07");
      expect(item.sourceIds.length).toBeGreaterThan(0);
      for (const id of item.sourceIds) expect(sourceById.get(id)?.evidenceClaimIds, item.id).toContain(item.id);
    }
    for (const item of sources) {
      expect(item.accessedOn).toBe("2026-10-07");
      expect(item.authors.length).toBeGreaterThan(0);
      expect(item.officialUrl).toMatch(/^https:\/\//);
      for (const id of item.evidenceClaimIds) expect(claimById.get(id)?.sourceIds, id).toContain(item.id);
    }
    for (const question of questions) for (const id of question.supportingEvidenceClaimIds) {
      const claim = claimById.get(id) ?? EXISTING_ANCHOR_CLAIMS.find((item) => item.id === id);
      expect(claim, `${question.id}: ${id}`).toBeDefined();
      for (const sourceId of claim!.sourceIds) {
        expect([...sources, ...EXISTING_ANCHOR_SOURCES].some((source) => source.id === sourceId && source.evidenceClaimIds.includes(id)), `${id}: ${sourceId}`).toBe(true);
      }
    }
  });

  it("has eighty balanced single-best tasks and preserves each patient profile on paired second nodes", () => {
    const byId = new Map(questions.map((question) => [question.id, question]));
    for (const clinicalCase of cases) for (const node of clinicalCase.decisionNodes) {
      expect(node.shuffleAnswers).toBe(true);
      expect(node.answerChoices).toHaveLength(4);
      const keys = node.answerChoices.filter((choice) => choice.isCorrect);
      expect(keys, node.id).toHaveLength(1);
      expect(keys[0]!.label.length, node.questionVariantId)
        .toBeLessThanOrEqual(Math.max(...node.answerChoices.filter((choice) => !choice.isCorrect).map((choice) => choice.label.length)));
      if (node.primaryConceptId === "concept.gs028f.outcomes.rca-versus-fmea-purpose") {
        const feedbackNode = syntheticClinicalCaseSchema.parse(clinicalCase).decisionNodes.find((item) => item.id === node.id)!;
        expect(node.explanation).not.toBe(feedbackNode.teachingPoint);
        expect(node.explanation).toBe(byId.get(node.questionVariantId)!.explanation);
        expect(feedbackNode.teachingPoint).toBe(byId.get(node.questionVariantId)!.teachingPoint);
        expect(feedbackNode.teachingPoint).toMatch(/retrospective|prospective|already happened|look ahead/i);
      } else if (node.questionVariantId === "question.gs028f.nutrition.high-risk-refeeding-thiamine-planning.v4") {
        expect(node.explanation).toContain("Plan thiamine before nutrition restarts");
        expect(node.explanation).not.toContain("The correct answer is");
      } else {
        expect(node.explanation).toContain(`The correct answer is “${keys[0]!.label}.”`);
      }
      expect(byId.get(node.questionVariantId)!.approvedInstantiationProfiles).toEqual(clinicalCase.approvedInstantiationProfiles);
      expect(byId.get(node.questionVariantId)!.reachedCurrentUpdate).toBe(node.currentUpdate);
      const entry = timings.find((item) => item.caseId === clinicalCase.id && item.nodeId === node.id)!;
      expect(entry.questionVariantId).toBe(node.questionVariantId);
      if (entry.classification.kind === "test_choices") {
        expect(entry.classification.choices.map((item) => [item.choiceId, item.choiceLabel]))
          .toEqual(node.answerChoices.map((item) => [item.id, item.label]));
      }
    }
    const paired = cases.filter((item) => item.decisionNodes.length === 2);
    expect(paired).toHaveLength(2);
    for (const item of paired) {
      expect(item.decisionNodes[0]!.resultGateAfter!.resultTypeId).toBe("service.ct");
      expect(item.decisionNodes[1]!.currentUpdate).toBe(item.decisionNodes[0]!.resultGateAfter!.resultNarrative);
      expect(item.presentation).not.toContain(item.decisionNodes[1]!.currentUpdate!);
    }
  });
});
