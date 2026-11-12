import { describe, expect, it } from "vitest";
import { SYNTHETIC_CLINICAL_RELEASE } from "../synthetic-content";
import {
  ROW_034_APPROVED_BACKLOG,
  ROW_034_APPROVED_ENCOUNTER_BLUEPRINTS,
  ROW_034_CLINICAL_APPROVAL,
  ROW_034_CONCEPTS,
  ROW_034_CONTENT_VERSION,
  ROW_034_EVIDENCE_CLAIMS,
  ROW_034_QUESTION_VARIANTS,
  ROW_034_SOURCES,
} from "./colonic-lipoma";

describe("owner row 34 approved colonic-lipoma content", () => {
  it("records the exact named-clinician approval and two-concept split", () => {
    expect(ROW_034_CLINICAL_APPROVAL).toMatchObject({
      id: "approval.melissa-rowland-md.owner-row-034.2026-08-06",
      reviewer: "Melissa Rowland, MD",
      reviewerRole: "Surgeon",
      reviewedOn: "2026-08-06",
      contentVersion: ROW_034_CONTENT_VERSION,
      approvedConceptIds: [
        "concept.colonic-lipoma.endoscopic-recognition",
        "concept.colonic-lipoma.asymptomatic-management",
      ],
      approvedReleasePointIds: ["release.l2.endoscopy"],
      decision: "approved",
    });
    expect(ROW_034_CLINICAL_APPROVAL.sourceProvenance).toMatchObject({
      workbookFileName: "Gamify Surgery Concepts (2).xlsx",
      sheetName: "Sheet1",
      sourceRow: 34,
      sourceRecordKey: "owner-concept.sheet1.row-034",
      approvedScopeDecisionId:
        "decision.owner-row-034.two-concept-split.2026-08-06",
    });
  });

  it("stores two Level 2 concepts and four variants for each FSRS identity", () => {
    expect(ROW_034_CONCEPTS).toEqual([
      expect.objectContaining({
        id: "concept.colonic-lipoma.endoscopic-recognition",
        earliestFacilityStage: 2,
        conceptType: "diagnosis",
      }),
      expect.objectContaining({
        id: "concept.colonic-lipoma.asymptomatic-management",
        earliestFacilityStage: 2,
        conceptType: "management",
      }),
    ]);
    expect(ROW_034_QUESTION_VARIANTS).toHaveLength(8);

    for (const concept of ROW_034_CONCEPTS) {
      expect(
        ROW_034_QUESTION_VARIANTS.filter(
          (variant) => variant.conceptId === concept.id,
        ),
      ).toHaveLength(4);
    }
  });

  it("preserves every exact single-select answer set and complete distractors", () => {
    for (const variant of ROW_034_QUESTION_VARIANTS) {
      expect(variant.releasePointId).toBe("release.l2.endoscopy");
      expect(variant.requiredClinicalSetting).toBe(
        "outpatient_endoscopy",
      );
      expect(variant.shuffleAnswers).toBe(true);
      expect(variant.answerChoices).toHaveLength(4);
      expect(
        variant.answerChoices.filter((choice) => choice.isCorrect),
      ).toHaveLength(1);
      expect(
        variant.answerChoices
          .filter((choice) => !choice.isCorrect)
          .every(
            (choice) =>
              typeof choice.distractorRationale === "string" &&
              choice.distractorRationale.length > 0,
          ),
      ).toBe(true);
      expect(
        new Set(variant.answerChoices.map((choice) => choice.id)).size,
      ).toBe(4);
      expect(variant.reviewStatus).toBe("clinically_approved");
      expect(variant.lastClinicianReview).toMatchObject({
        reviewer: "Melissa Rowland, MD",
        reviewedOn: "2026-08-06",
        contentVersion: ROW_034_CONTENT_VERSION,
      });
    }

    expect(
      ROW_034_QUESTION_VARIANTS.map(
        (variant) =>
          variant.answerChoices.find((choice) => choice.isCorrect)!.label,
      ),
    ).toEqual([
      "Colonic lipoma",
      "Colonic lipoma",
      "A smooth, yellowish subepithelial lesion that indents with gentle pressure and regains its shape",
      "An absent cushion or pillow sign does not by itself exclude lipoma; the full lesion assessment must guide further evaluation",
      "No lipoma-directed removal or dedicated surveillance; continue ordinary follow-up based on the rest of the colonoscopy and the patient's usual indications",
      "No lesion-specific treatment or surveillance",
      "A patient with a clearly characterized, asymptomatic colonic lipoma and no bleeding, ulceration, obstruction, or pain",
      "Bleeding from an ulcerated lesion",
    ]);
  });

  it("pairs distinct concepts only in the two direct two-decision blueprints", () => {
    expect(ROW_034_APPROVED_ENCOUNTER_BLUEPRINTS).toHaveLength(6);
    const direct = ROW_034_APPROVED_ENCOUNTER_BLUEPRINTS.filter(
      (blueprint) => blueprint.questionVariantIds.length === 2,
    );
    const single = ROW_034_APPROVED_ENCOUNTER_BLUEPRINTS.filter(
      (blueprint) => blueprint.questionVariantIds.length === 1,
    );
    expect(direct).toHaveLength(2);
    expect(single).toHaveLength(4);

    for (const blueprint of direct) {
      const concepts = blueprint.questionVariantIds.map(
        (questionId) =>
          ROW_034_QUESTION_VARIANTS.find(
            (variant) => variant.id === questionId,
          )!.conceptId,
      );
      expect(new Set(concepts)).toEqual(
        new Set(ROW_034_CONCEPTS.map((concept) => concept.id)),
      );
    }

    expect(ROW_034_APPROVED_BACKLOG).toMatchObject({
      releasePointId: "release.l2.endoscopy",
      earliestFacilityStage: 2,
      currentGameEligibility: "partially_active_level_2_direct_blueprints_only",
      approvedForRuntime: true,
      maximumScoredDecisionsPerEncounter: 2,
      directEncounterCount: 2,
      singleDecisionEncounterCount: 4,
    });
  });

  it("preserves complete source-to-claim provenance and clinical boundaries", () => {
    const sourceIds = new Set(ROW_034_SOURCES.map((source) => source.id));
    const claimIds = new Set(
      ROW_034_EVIDENCE_CLAIMS.map((claim) => claim.id),
    );

    expect(ROW_034_SOURCES).toHaveLength(3);
    for (const source of ROW_034_SOURCES) {
      expect(source.completeCitation).not.toHaveLength(0);
      expect(source.organizationOrJournal).not.toHaveLength(0);
      expect(source.authors.length).toBeGreaterThan(0);
      expect(source.publicationYear).toBeGreaterThan(0);
      expect(source.doi).toMatch(/^10\./);
      expect(source.officialUrl).toMatch(/^https:\/\//);
      expect(source.accessedOn).toBe("2026-08-06");
      expect(source.reviewStatus).toBe("needs_clinician_review");
      for (const claimId of source.evidenceClaimIds) {
        expect(claimIds.has(claimId)).toBe(true);
      }
    }

    expect(ROW_034_EVIDENCE_CLAIMS).toHaveLength(3);
    for (const claim of ROW_034_EVIDENCE_CLAIMS) {
      expect(claim.reviewStatus).toBe("clinically_approved");
      expect(claim.lastClinicianReview).toMatchObject({
        reviewer: "Melissa Rowland, MD",
        reviewedOn: "2026-08-06",
        contentVersion: ROW_034_CONTENT_VERSION,
      });
      expect(claim.lastCheckedOn).toBe("2026-08-06");
      expect(claim.limitation).not.toBeNull();
      for (const sourceId of claim.sourceIds) {
        expect(sourceIds.has(sourceId)).toBe(true);
      }
    }

    const allClaimText = ROW_034_EVIDENCE_CLAIMS.map(
      (claim) => `${claim.statement} ${claim.limitation}`,
    ).join(" ");
    expect(allClaimText).toContain("does not exclude");
    expect(allClaimText).toContain("ordinary colorectal screening");
    expect(allClaimText).toContain(
      "does not select a particular endoscopic or surgical resection technique",
    );
  });

  it("activates only the approved direct Level 2 blueprints", () => {
    for (const concept of ROW_034_CONCEPTS) {
      expect(
        SYNTHETIC_CLINICAL_RELEASE.concepts.some(
          (runtimeConcept) => runtimeConcept.id === concept.id,
        ),
      ).toBe(true);
      expect(
        SYNTHETIC_CLINICAL_RELEASE.cases.some((clinicalCase) =>
          clinicalCase.decisionNodes.some(
            (node) => node.primaryConceptId === concept.id,
          ),
        ),
      ).toBe(true);
    }
  });
});
