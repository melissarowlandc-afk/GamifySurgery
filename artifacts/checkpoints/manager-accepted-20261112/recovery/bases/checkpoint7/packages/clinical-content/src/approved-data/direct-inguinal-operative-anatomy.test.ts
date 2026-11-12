import { describe, expect, it } from "vitest";
import { SYNTHETIC_CLINICAL_RELEASE } from "../synthetic-content";
import {
  ROW_008_025_APPROVED_BACKLOG,
  ROW_008_025_CLINICAL_APPROVAL,
  ROW_008_025_CONCEPT,
  ROW_008_025_CONTENT_VERSION,
  ROW_008_025_EVIDENCE_CLAIMS,
  ROW_008_025_QUESTION_VARIANTS,
  ROW_008_025_SOURCES,
} from "./direct-inguinal-operative-anatomy";

describe("owner rows 8 and 25 approved direct-inguinal anatomy", () => {
  it("preserves the two source rows under one named-clinician approval", () => {
    expect(ROW_008_025_CLINICAL_APPROVAL).toMatchObject({
      id: "approval.melissa-rowland-md.owner-rows-008-025.2026-08-06",
      reviewer: "Melissa Rowland, MD",
      reviewerRole: "Surgeon",
      reviewedOn: "2026-08-06",
      contentVersion: ROW_008_025_CONTENT_VERSION,
      approvedConceptId:
        "concept.inguinal-hernia.direct-operative-anatomy",
      approvedReleasePointIds: ["release.l3.ambulatory_or_qi"],
      tutorialEligible: false,
      decision: "approved",
    });
    expect(
      ROW_008_025_CLINICAL_APPROVAL.sourceProvenance.sourceRows.map(
        (source) => source.sourceRow,
      ),
    ).toEqual([8, 25]);
    expect(
      ROW_008_025_CLINICAL_APPROVAL.mergedSourceRecordKeys,
    ).toEqual([
      "owner-concept.sheet1.row-008",
      "owner-concept.sheet1.row-025",
    ]);
  });

  it("stores one Level 3 anatomy concept and three alternative variants", () => {
    expect(ROW_008_025_CONCEPT).toMatchObject({
      id: "concept.inguinal-hernia.direct-operative-anatomy",
      earliestFacilityStage: 3,
      conceptType: "anatomy",
    });
    expect(ROW_008_025_QUESTION_VARIANTS).toHaveLength(3);
    expect(
      new Set(
        ROW_008_025_QUESTION_VARIANTS.map((variant) => variant.conceptId),
      ),
    ).toEqual(new Set([ROW_008_025_CONCEPT.id]));
    expect(
      new Set(ROW_008_025_QUESTION_VARIANTS.map((variant) => variant.stem))
        .size,
    ).toBe(3);
    expect(
      new Set(
        ROW_008_025_QUESTION_VARIANTS.map(
          (variant) => variant.presentationVariantId,
        ),
      ).size,
    ).toBe(3);

    for (const variant of ROW_008_025_QUESTION_VARIANTS) {
      expect(variant.releasePointId).toBe(
        "release.l3.ambulatory_or_qi",
      );
      expect(variant.requiredClinicalSetting).toBe("ambulatory_surgery");
      expect(variant.encounterRole).toBe(
        "intermediate_corrective_forward",
      );
      expect(variant.shuffleAnswers).toBe(true);
      expect(
        variant.answerChoices.filter((choice) => choice.isCorrect),
      ).toHaveLength(1);
      expect(
        new Set(variant.answerChoices.map((choice) => choice.id)).size,
      ).toBe(variant.answerChoices.length);
      expect(variant.supportingEvidenceClaimIds).toEqual(
        ROW_008_025_CLINICAL_APPROVAL.approvedEvidenceClaimIds,
      );
    }
  });

  it("retains the exact approved keyed answers and removes the ambiguous locator", () => {
    const keyedLabels = ROW_008_025_QUESTION_VARIANTS.map(
      (variant) =>
        variant.answerChoices.find((choice) => choice.isCorrect)!.label,
    );

    expect(keyedLabels).toEqual([
      "Direct inguinal hernia",
      "Weakness of the transversalis fascia in the posterior inguinal wall",
      "The posterior inguinal wall in Hesselbach's triangle, medial to the inferior epigastric vessels",
    ]);
    expect(
      keyedLabels.some((label) =>
        label.toLowerCase().includes("medial and deep"),
      ),
    ).toBe(false);
  });

  it("limits an encounter to one scored expression of the shared FSRS card", () => {
    expect(ROW_008_025_APPROVED_BACKLOG).toMatchObject({
      conceptId: ROW_008_025_CONCEPT.id,
      educationalDifficulty: "foundational_operative_anatomy",
      releasePointId: "release.l3.ambulatory_or_qi",
      earliestFacilityStage: 3,
      requiredClinicalSetting: "ambulatory_surgery",
      currentGameEligibility: "deferred",
      approvedForRuntime: false,
      tutorialEligible: false,
      questionVariantsAreAlternatives: true,
      maximumScoredVariantsPerEncounter: 1,
    });
    expect(ROW_008_025_APPROVED_BACKLOG.questionVariantIds).toEqual(
      ROW_008_025_QUESTION_VARIANTS.map((variant) => variant.id),
    );
  });

  it("preserves the current single-source limitation and atomic claim review", () => {
    expect(ROW_008_025_SOURCES).toHaveLength(1);
    const source = ROW_008_025_SOURCES[0]!;
    expect(source).toMatchObject({
      id: "source.review.inguinal-releasing-incisions.2023",
      publicationYear: 2023,
      doi: "10.3389/jaws.2023.11378",
      accessedOn: "2026-07-30",
      sourceClass: "narrative_review",
      licenseLabel: "CC BY 4.0",
      reuseStatus: "cc_by_4_0",
      reviewStatus: "needs_clinician_review",
    });
    expect(source.completeCitation).not.toHaveLength(0);
    expect(source.authors.length).toBeGreaterThan(0);
    expect(source.officialUrl).toMatch(/^https:\/\//);
    expect(source.authorityAssessment).toContain(
      "not comparative or diagnostic-performance evidence",
    );

    expect(ROW_008_025_EVIDENCE_CLAIMS).toHaveLength(3);
    for (const claim of ROW_008_025_EVIDENCE_CLAIMS) {
      expect(claim.reviewStatus).toBe("clinically_approved");
      expect(claim.lastClinicianReview).toMatchObject({
        reviewer: "Melissa Rowland, MD",
        reviewedOn: "2026-08-06",
        contentVersion: ROW_008_025_CONTENT_VERSION,
      });
      expect(claim.sourceIds).toEqual([source.id]);
      expect(claim.lastCheckedOn).toBe("2026-07-30");
      expect(claim.limitation).not.toBeNull();
      expect(source.evidenceClaimIds).toContain(claim.id);
    }
  });

  it("does not admit deferred Level 3 content to the Level 0-1 runtime", () => {
    expect(
      SYNTHETIC_CLINICAL_RELEASE.concepts.some(
        (concept) => concept.id === ROW_008_025_CONCEPT.id,
      ),
    ).toBe(false);
    expect(
      SYNTHETIC_CLINICAL_RELEASE.cases.some((clinicalCase) =>
        clinicalCase.decisionNodes.some(
          (node) => node.primaryConceptId === ROW_008_025_CONCEPT.id,
        ),
      ),
    ).toBe(false);
  });
});
