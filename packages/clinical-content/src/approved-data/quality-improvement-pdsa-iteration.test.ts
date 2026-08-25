import { describe, expect, it } from "vitest";
import { validateSyntheticClinicalRelease } from "../schema";
import { SYNTHETIC_CLINICAL_RELEASE } from "../synthetic-content";
import {
  ROW_050_APPROVED_BACKLOG,
  ROW_050_APPROVED_ENCOUNTER_BLUEPRINTS,
  ROW_050_CLINICAL_APPROVAL,
  ROW_050_CONCEPTS,
  ROW_050_CONTENT_VERSION,
  ROW_050_EVIDENCE_CLAIMS,
  ROW_050_QUESTION_VARIANTS,
  ROW_050_SOURCES,
} from "./quality-improvement-pdsa-iteration";

describe("owner row 50 approved PDSA iteration concept", () => {
  it("records the exact one-concept Level 3 approval", () => {
    expect(ROW_050_CLINICAL_APPROVAL).toMatchObject({
      id: "approval.melissa-rowland-md.owner-row-050.2026-08-10",
      reviewer: "Melissa Rowland, MD",
      reviewedOn: "2026-08-10",
      contentVersion: ROW_050_CONTENT_VERSION,
      sourceProvenance: {
        workbookFileName: "Gamify Surgery Concepts (2).xlsx",
        sheetName: "Sheet1",
        sourceRow: 50,
        sourceRecordKey: "owner-concept.sheet1.row-050",
      },
      approvedConceptIds: [
        "concept.quality-improvement.pdsa-act-and-iterate",
      ],
      approvedReleasePointIds: ["release.l3.ambulatory_or_qi"],
      decision: "approved",
    });
    expect(ROW_050_CONCEPTS).toEqual([
      expect.objectContaining({
        id: "concept.quality-improvement.pdsa-act-and-iterate",
        conceptType: "applied_science",
        earliestFacilityStage: 3,
      }),
    ]);
  });

  it("stores five exact dry ASC project variants", () => {
    expect(ROW_050_QUESTION_VARIANTS).toHaveLength(5);
    expect(
      ROW_050_QUESTION_VARIANTS.map(
        (variant) => variant.projectPresentation,
      ),
    ).toEqual([
      "The surgery center's established method for locating supplies is 'ask Dana.' Dana has requested a quality-improvement project. The team tests a preprocedure supply checklist in one room and reviews the resulting delay data.",
      "A team introduces color-coded supply bins. Missing-item delays decrease, although several staff members now refer to every bin as 'the gray one.' The improvement does not reach the target.",
      "The center tests a clearer preoperative callback script after determining that its previous patient-instruction system consisted mostly of voicemail and optimism. The limited test meets its cancellation-reduction target without worsening balancing measures.",
      "A redesigned supply cart looks exceptionally organized in photographs. During actual use, retrieval time increases and more items are reported missing. The committee describes the results as 'visually encouraging.'",
      "A team tests a new clipboard-return system after the clinic's clipboard inventory becomes mostly theoretical. The test is completed, results are compared with the prediction, and the team summarizes what it learned.",
    ]);

    for (const variant of ROW_050_QUESTION_VARIANTS) {
      expect(variant.answerChoices).toHaveLength(4);
      expect(
        variant.answerChoices.filter((choice) => choice.isCorrect),
      ).toHaveLength(1);
      expect(variant.shuffleAnswers).toBe(true);
      expect(variant.releasePointId).toBe(
        "release.l3.ambulatory_or_qi",
      );
      expect(variant.requiredClinicalSetting).toBe(
        "ambulatory_surgery",
      );
      expect(variant.requiredCapabilityIds).toEqual([]);
      expect(variant.reviewStatus).toBe("clinically_approved");
    }
  });

  it("preserves every approved keyed answer", () => {
    expect(
      ROW_050_QUESTION_VARIANTS.map(
        (variant) =>
          variant.answerChoices.find((choice) => choice.isCorrect)?.label,
      ),
    ).toEqual([
      "Act on the findings and plan the next PDSA test",
      "Adapt the bins and test the revision in another PDSA cycle",
      "Expand cautiously and continue measuring through linked PDSA cycles",
      "Abandon or redesign the change and plan another PDSA test",
      "Act: refine the change and plan the next test",
    ]);
  });

  it("does not make the keyed response uniquely longest", () => {
    for (const variant of ROW_050_QUESTION_VARIANTS) {
      const correctLength =
        variant.answerChoices.find((choice) => choice.isCorrect)?.label
          .length ?? 0;
      expect(
        variant.answerChoices.some(
          (choice) =>
            !choice.isCorrect && choice.label.length >= correctLength,
        ),
      ).toBe(true);
    }
  });

  it("exposes each reviewed variant through one single-decision blueprint", () => {
    expect(ROW_050_APPROVED_ENCOUNTER_BLUEPRINTS).toHaveLength(5);
    expect(
      ROW_050_APPROVED_ENCOUNTER_BLUEPRINTS.every(
        (blueprint) => blueprint.maximumScoredDecisions === 1,
      ),
    ).toBe(true);
    expect(
      new Set(
        ROW_050_APPROVED_ENCOUNTER_BLUEPRINTS.flatMap(
          (blueprint) => blueprint.questionVariantIds,
        ),
      ),
    ).toEqual(
      new Set(ROW_050_QUESTION_VARIANTS.map((variant) => variant.id)),
    );
    expect(ROW_050_APPROVED_BACKLOG.multiDecisionAssessment).toContain(
      "separately reviewed",
    );
  });

  it("retains complete source-to-claim provenance", () => {
    const sourceIds = new Set(ROW_050_SOURCES.map((source) => source.id));
    const claimIds = new Set(
      ROW_050_EVIDENCE_CLAIMS.map((claim) => claim.id),
    );

    for (const source of ROW_050_SOURCES) {
      expect(source.completeCitation).not.toHaveLength(0);
      expect(source.organizationOrJournal).toBe(
        "Agency for Healthcare Research and Quality",
      );
      expect(source.authors.length).toBeGreaterThan(0);
      expect(source.publicationYear).toBeGreaterThan(0);
      expect(source.officialUrl).toMatch(/^https:\/\//);
      expect(source.accessedOn).toBe("2026-08-10");
      expect(source.reviewStatus).toBe("needs_clinician_review");
      for (const claimId of source.evidenceClaimIds) {
        expect(claimIds.has(claimId)).toBe(true);
      }
    }

    for (const claim of ROW_050_EVIDENCE_CLAIMS) {
      expect(claim.reviewStatus).toBe("clinically_approved");
      expect(claim.lastClinicianReview).toMatchObject({
        reviewer: "Melissa Rowland, MD",
        reviewedOn: "2026-08-10",
        contentVersion: ROW_050_CONTENT_VERSION,
      });
      expect(claim.lastCheckedOn).toBe("2026-08-10");
      expect(claim.limitation).not.toBeNull();
      for (const sourceId of claim.sourceIds) {
        expect(sourceIds.has(sourceId)).toBe(true);
      }
    }
  });

  it("keeps the Level 3 package outside the Level 0-1 runtime", () => {
    expect(() =>
      validateSyntheticClinicalRelease(SYNTHETIC_CLINICAL_RELEASE),
    ).not.toThrow();
    expect(ROW_050_APPROVED_BACKLOG).toMatchObject({
      approvedForRuntime: false,
      currentGameEligibility: "deferred",
      earliestFacilityStage: 3,
      maximumScoredDecisionsPerEncounter: 1,
    });
    expect(
      SYNTHETIC_CLINICAL_RELEASE.concepts.some(
        (concept) => concept.id === ROW_050_CONCEPTS[0]?.id,
      ),
    ).toBe(false);
  });
});
