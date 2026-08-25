import { describe, expect, it } from "vitest";
import { SYNTHETIC_CLINICAL_RELEASE } from "../synthetic-content";
import {
  ROW_037_APPROVED_BACKLOG,
  ROW_037_APPROVED_ENCOUNTER_BLUEPRINT,
  ROW_037_CLINICAL_APPROVAL,
  ROW_037_CONCEPTS,
  ROW_037_CONTENT_VERSION,
  ROW_037_EVIDENCE_CLAIMS,
  ROW_037_QUESTION_VARIANTS,
  ROW_037_SOURCES,
} from "./postoperative-chylous-ascites";

describe("owner row 37 approved postoperative chylous-ascites pathway", () => {
  it("records the exact approval as Future Hospital Floor with no numeric level", () => {
    expect(ROW_037_CLINICAL_APPROVAL).toMatchObject({
      id: "approval.melissa-rowland-md.owner-row-037.2026-08-06",
      reviewer: "Melissa Rowland, MD",
      reviewerRole: "Surgeon",
      reviewedOn: "2026-08-06",
      contentVersion: ROW_037_CONTENT_VERSION,
      approvedReleasePointIds: ["release.future.hospital_floor"],
      decision: "approved",
    });
    expect(ROW_037_CLINICAL_APPROVAL.sourceProvenance).toMatchObject({
      workbookFileName: "Gamify Surgery Concepts (2).xlsx",
      sheetName: "Sheet1",
      sourceRow: 37,
      sourceRecordKey: "owner-concept.sheet1.row-037",
      approvedScopeDecisionId:
        "decision.owner-row-037.future-hospital-floor-three-concept-pathway.2026-08-06",
    });
    expect(
      ROW_037_CONCEPTS.every(
        (concept) =>
          concept.releasePointId === "release.future.hospital_floor" &&
          concept.earliestFacilityStage === null &&
          concept.requiredClinicalSetting === "hospital_floor",
      ),
    ).toBe(true);
  });

  it("keeps evaluation, fluid confirmation, and management as three FSRS identities", () => {
    expect(ROW_037_CONCEPTS).toEqual([
      expect.objectContaining({
        id: "concept.postoperative-ascites.cross-sectional-evaluation",
        conceptType: "workup",
      }),
      expect.objectContaining({
        id: "concept.chylous-ascites.fluid-confirmation",
        conceptType: "workup",
      }),
      expect.objectContaining({
        id: "concept.postoperative-chylous-ascites.initial-hospital-management",
        conceptType: "management",
      }),
    ]);
    expect(
      new Set(
        ROW_037_QUESTION_VARIANTS.map((variant) => variant.conceptId),
      ),
    ).toEqual(
      new Set(ROW_037_CONCEPTS.map((concept) => concept.id)),
    );
  });

  it("stores the exact three-decision sequence and complete single-select answers", () => {
    expect(ROW_037_QUESTION_VARIANTS).toHaveLength(3);
    expect(
      ROW_037_QUESTION_VARIANTS.map(
        (variant) => variant.decisionOrdinal,
      ),
    ).toEqual([1, 2, 3]);
    expect(
      ROW_037_APPROVED_ENCOUNTER_BLUEPRINT.questionVariantIds,
    ).toEqual(ROW_037_QUESTION_VARIANTS.map((variant) => variant.id));
    expect(
      ROW_037_APPROVED_ENCOUNTER_BLUEPRINT.resultSequence,
    ).toHaveLength(3);

    for (const variant of ROW_037_QUESTION_VARIANTS) {
      expect(variant.releasePointId).toBe(
        "release.future.hospital_floor",
      );
      expect(variant.earliestFacilityStage).toBeNull();
      expect(variant.requiredClinicalSetting).toBe("hospital_floor");
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
      expect(variant.reviewStatus).toBe("clinically_approved");
    }

    expect(
      ROW_037_QUESTION_VARIANTS.map(
        (variant) =>
          variant.answerChoices.find((choice) => choice.isCorrect)!
            .label,
      ),
    ).toEqual([
      "CT of the abdomen and pelvis with IV contrast",
      "Image-guided diagnostic paracentesis with fluid triglycerides and studies for infection and other plausible postoperative leaks",
      "Admit for symptom-directed peritoneal drainage, a low-long-chain-triglyceride diet enriched with medium-chain triglycerides, and nutritional, fluid, and electrolyte monitoring",
    ]);
  });

  it("preserves the imaging boundary and symptom-dependent drainage scope", () => {
    const allText = [
      ...ROW_037_EVIDENCE_CLAIMS.map(
        (claim) => `${claim.statement} ${claim.limitation}`,
      ),
      ...ROW_037_QUESTION_VARIANTS.map(
        (variant) => `${variant.stem} ${variant.explanation}`,
      ),
    ].join(" ");

    expect(allText).toContain(
      "cannot by appearance alone establish that the fluid is chylous",
    );
    expect(allText).toContain(
      "does not teach an unsourced universal numeric triglyceride cutoff",
    );
    expect(allText).toContain(
      "drainage is symptom- and accumulation-dependent",
    );
    expect(allText).toContain(
      "does not impose a rigid escalation timeline",
    );
  });

  it("maintains complete source-to-claim provenance and separate review states", () => {
    const sourceIds = new Set(ROW_037_SOURCES.map((source) => source.id));
    const claimIds = new Set(
      ROW_037_EVIDENCE_CLAIMS.map((claim) => claim.id),
    );

    expect(ROW_037_SOURCES).toHaveLength(4);
    for (const source of ROW_037_SOURCES) {
      expect(source.completeCitation).not.toHaveLength(0);
      expect(source.organizationOrJournal).not.toHaveLength(0);
      expect(source.authors.length).toBeGreaterThan(0);
      expect(source.publicationYear).toBeGreaterThan(0);
      expect(source.officialUrl).toMatch(/^https:\/\//);
      expect(source.accessedOn).toBe("2026-08-06");
      expect(source.reviewStatus).toBe("needs_clinician_review");
      for (const claimId of source.evidenceClaimIds) {
        expect(claimIds.has(claimId)).toBe(true);
      }
    }

    expect(ROW_037_EVIDENCE_CLAIMS).toHaveLength(4);
    for (const claim of ROW_037_EVIDENCE_CLAIMS) {
      expect(claim.reviewStatus).toBe("clinically_approved");
      expect(claim.lastClinicianReview).toMatchObject({
        reviewer: "Melissa Rowland, MD",
        reviewedOn: "2026-08-06",
        contentVersion: ROW_037_CONTENT_VERSION,
      });
      expect(claim.lastCheckedOn).toBe("2026-08-06");
      expect(claim.limitation).not.toBeNull();
      for (const sourceId of claim.sourceIds) {
        expect(sourceIds.has(sourceId)).toBe(true);
      }
    }
  });

  it("keeps the approved future pathway outside the current playable release", () => {
    expect(ROW_037_APPROVED_BACKLOG).toMatchObject({
      releasePointId: "release.future.hospital_floor",
      earliestFacilityStage: null,
      currentGameEligibility: "deferred",
      approvedForRuntime: false,
      maximumScoredDecisionsPerEncounter: 3,
    });

    for (const concept of ROW_037_CONCEPTS) {
      expect(
        SYNTHETIC_CLINICAL_RELEASE.concepts.some(
          (runtimeConcept) => runtimeConcept.id === concept.id,
        ),
      ).toBe(false);
      expect(
        SYNTHETIC_CLINICAL_RELEASE.cases.some((clinicalCase) =>
          clinicalCase.decisionNodes.some(
            (node) => node.primaryConceptId === concept.id,
          ),
        ),
      ).toBe(false);
    }
  });
});
