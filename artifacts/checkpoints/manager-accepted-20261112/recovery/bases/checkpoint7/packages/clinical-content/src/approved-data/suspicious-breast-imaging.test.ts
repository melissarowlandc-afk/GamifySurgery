import { describe, expect, it } from "vitest";
import { SYNTHETIC_CLINICAL_RELEASE } from "../synthetic-content";
import {
  ROW_035_APPROVED_BACKLOG,
  ROW_035_APPROVED_CONCEPTS,
  ROW_035_APPROVED_QUESTION_VARIANTS,
  ROW_035_APPROVED_RESULTS_IN_HAND_BLUEPRINTS,
  ROW_035_CLINICAL_APPROVAL,
  ROW_035_CONTENT_VERSION,
  ROW_035_DRAFT_TWO_STEP_BLUEPRINTS,
  ROW_035_DRAFT_WORKUP_CONCEPT,
  ROW_035_DRAFT_WORKUP_QUESTION_VARIANTS,
  ROW_035_EVIDENCE_CLAIMS,
  ROW_035_SOURCES,
} from "./suspicious-breast-imaging";

describe("owner row 35 breast-imaging content", () => {
  it("records the exact approval of the two recognition concepts and eight reviewed questions", () => {
    expect(ROW_035_CLINICAL_APPROVAL).toMatchObject({
      id: "approval.melissa-rowland-md.owner-row-035.2026-08-06",
      reviewer: "Melissa Rowland, MD",
      reviewerRole: "Surgeon",
      reviewedOn: "2026-08-06",
      contentVersion: ROW_035_CONTENT_VERSION,
      approvedConceptIds: [
        "concept.breast-imaging.suspicious-mass-morphology",
        "concept.breast-imaging.suspicious-calcification-pattern",
      ],
      approvedReleasePointIds: ["release.l3.ambulatory_or_qi"],
      decision: "approved",
    });
    expect(ROW_035_CLINICAL_APPROVAL.sourceProvenance).toMatchObject({
      workbookFileName: "Gamify Surgery Concepts (2).xlsx",
      sheetName: "Sheet1",
      sourceRow: 35,
      sourceRecordKey: "owner-concept.sheet1.row-035",
      approvedScopeDecisionId:
        "decision.owner-row-035.two-concept-imaging-split.2026-08-06",
    });
    expect(ROW_035_CLINICAL_APPROVAL.approvedQuestionVariantIds).toHaveLength(
      8,
    );
  });

  it("keeps four alternative variants on each approved FSRS identity", () => {
    expect(ROW_035_APPROVED_CONCEPTS).toHaveLength(2);
    expect(ROW_035_APPROVED_QUESTION_VARIANTS).toHaveLength(8);

    for (const concept of ROW_035_APPROVED_CONCEPTS) {
      expect(concept.earliestFacilityStage).toBe(3);
      expect(
        ROW_035_APPROVED_QUESTION_VARIANTS.filter(
          (variant) => variant.conceptId === concept.id,
        ),
      ).toHaveLength(4);
    }
  });

  it("places a brief patient presentation before every approved question", () => {
    for (const variant of ROW_035_APPROVED_QUESTION_VARIANTS) {
      expect(variant.patientPresentation.trim().length).toBeGreaterThan(30);
      expect(variant.stem.trim().length).toBeGreaterThan(10);
      expect(variant.patientPresentation).not.toBe(variant.stem);
      expect(variant.presentationVariantId).toMatch(/^presentation\./);
    }
  });

  it("preserves every complete single-select answer set and rationale", () => {
    for (const variant of ROW_035_APPROVED_QUESTION_VARIANTS) {
      expect(variant.releasePointId).toBe(
        "release.l3.ambulatory_or_qi",
      );
      expect(variant.requiredClinicalSetting).toBe(
        "clinic_preoperative_evaluation",
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
        contentVersion: ROW_035_CONTENT_VERSION,
      });
    }

    expect(
      ROW_035_APPROVED_QUESTION_VARIANTS.map(
        (variant) =>
          variant.answerChoices.find((choice) => choice.isCorrect)!.label,
      ),
    ).toEqual([
      "An irregular mass with spiculated margins",
      "Irregular shape with a spiculated margin",
      "Spiculated",
      "Density is one descriptor and must be interpreted with shape, margin, associated features, comparison imaging, and the final assessment",
      "Fine linear or fine linear-branching calcifications in a segmental distribution",
      "Fine pleomorphic calcifications",
      "Coarse, large, densely calcified, confluent calcifications",
      "It is a distribution descriptor that must be interpreted with calcification morphology and the complete imaging assessment; it does not by itself diagnose cancer",
    ]);
  });

  it("holds the new age-30-to-39 workup card and its exact choices for clinician review", () => {
    expect(ROW_035_DRAFT_WORKUP_CONCEPT).toMatchObject({
      id: "concept.breast-mass.age-30-to-39.initial-diagnostic-imaging",
      earliestFacilityStage: 3,
      conceptType: "workup",
    });
    expect(ROW_035_DRAFT_WORKUP_QUESTION_VARIANTS).toHaveLength(2);

    for (const variant of ROW_035_DRAFT_WORKUP_QUESTION_VARIANTS) {
      expect(variant.reviewStatus).toBe("needs_clinician_review");
      expect(variant.lastClinicianReview).toBeNull();
      expect(variant.answerChoices).toHaveLength(4);
      expect(
        variant.answerChoices.filter((choice) => choice.isCorrect),
      ).toHaveLength(1);
      expect(
        variant.answerChoices.find((choice) => choice.isCorrect)?.label,
      ).toMatch(/diagnostic mammography or tomosynthesis/i);
      expect(variant.orderedServiceIds).toEqual([
        "service.diagnostic-mammography",
        "service.targeted-breast-ultrasound",
      ]);
    }
  });

  it("provides six approved results-in-hand visits and two gated sequential patients", () => {
    expect(ROW_035_APPROVED_RESULTS_IN_HAND_BLUEPRINTS).toHaveLength(6);
    expect(ROW_035_DRAFT_TWO_STEP_BLUEPRINTS).toHaveLength(2);

    for (const blueprint of ROW_035_APPROVED_RESULTS_IN_HAND_BLUEPRINTS) {
      expect(blueprint.questionVariantIds).toHaveLength(1);
      expect(
        ROW_035_APPROVED_QUESTION_VARIANTS.some(
          (variant) => variant.id === blueprint.questionVariantIds[0],
        ),
      ).toBe(true);
    }

    for (const blueprint of ROW_035_DRAFT_TWO_STEP_BLUEPRINTS) {
      expect(blueprint.reviewStatus).toBe("needs_clinician_review");
      expect(blueprint.questionVariantIds).toHaveLength(2);
      const conceptIds = blueprint.questionVariantIds.map(
        (questionId) =>
          [
            ...ROW_035_DRAFT_WORKUP_QUESTION_VARIANTS,
            ...ROW_035_APPROVED_QUESTION_VARIANTS,
          ].find((variant) => variant.id === questionId)!.conceptId,
      );
      expect(new Set(conceptIds).size).toBe(2);
      expect(blueprint.resultGate.orderedServiceIds).toEqual([
        "service.diagnostic-mammography",
        "service.targeted-breast-ultrasound",
      ]);
    }

    expect(ROW_035_APPROVED_BACKLOG).toMatchObject({
      releasePointId: "release.l3.ambulatory_or_qi",
      earliestFacilityStage: 3,
      currentGameEligibility: "deferred",
      approvedForRuntime: false,
      maximumScoredDecisionsPerEncounter: 2,
      approvedResultsInHandEncounterCount: 6,
      proposedSequentialEncounterCount: 2,
    });
  });

  it("preserves source-to-claim provenance and the tissue-diagnosis boundary", () => {
    const sourceIds = new Set(ROW_035_SOURCES.map((source) => source.id));
    const claimIds = new Set(
      ROW_035_EVIDENCE_CLAIMS.map((claim) => claim.id),
    );

    expect(ROW_035_SOURCES).toHaveLength(3);
    for (const source of ROW_035_SOURCES) {
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

    for (const claim of ROW_035_EVIDENCE_CLAIMS) {
      expect(claim.lastCheckedOn).toBe("2026-08-06");
      expect(claim.limitation).not.toBeNull();
      for (const sourceId of claim.sourceIds) {
        expect(sourceIds.has(sourceId)).toBe(true);
      }
    }

    const approvedClaims = ROW_035_EVIDENCE_CLAIMS.filter(
      (claim) => claim.reviewStatus === "clinically_approved",
    );
    const draftClaims = ROW_035_EVIDENCE_CLAIMS.filter(
      (claim) => claim.reviewStatus === "needs_clinician_review",
    );
    expect(approvedClaims).toHaveLength(5);
    expect(draftClaims).toHaveLength(1);
    expect(
      approvedClaims
        .map((claim) => `${claim.statement} ${claim.limitation}`)
        .join(" "),
    ).toContain("tissue diagnosis");
  });

  it("keeps Level 3 breast-imaging material out of the playable Level 0-1 release", () => {
    const conceptIds = [
      ...ROW_035_APPROVED_CONCEPTS.map((concept) => concept.id),
      ROW_035_DRAFT_WORKUP_CONCEPT.id,
    ];

    for (const conceptId of conceptIds) {
      expect(
        SYNTHETIC_CLINICAL_RELEASE.concepts.some(
          (runtimeConcept) => runtimeConcept.id === conceptId,
        ),
      ).toBe(false);
      expect(
        SYNTHETIC_CLINICAL_RELEASE.cases.some((clinicalCase) =>
          clinicalCase.decisionNodes.some(
            (node) => node.primaryConceptId === conceptId,
          ),
        ),
      ).toBe(false);
    }
  });
});
