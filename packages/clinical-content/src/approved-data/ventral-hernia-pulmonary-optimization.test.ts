import { describe, expect, it } from "vitest";
import { validateSyntheticClinicalRelease } from "../schema";
import { SYNTHETIC_CLINICAL_RELEASE } from "../synthetic-content";
import {
  ROW_023_CASES,
  ROW_023_CLINICAL_APPROVAL,
  ROW_023_CONCEPT,
  ROW_023_CONTENT_VERSION,
  ROW_023_EVIDENCE_CLAIMS,
  ROW_023_SOURCES,
} from "./ventral-hernia-pulmonary-optimization";

describe("owner row 23 approved pulmonary-optimization content", () => {
  it("preserves the named clinician approval and immutable source-row provenance", () => {
    expect(ROW_023_CLINICAL_APPROVAL).toMatchObject({
      id: "approval.melissa-rowland-md.owner-row-023.2026-08-06",
      reviewer: "Melissa Rowland, MD",
      reviewerRole: "Surgeon",
      reviewedOn: "2026-08-06",
      contentVersion: ROW_023_CONTENT_VERSION,
      sourceProvenance: {
        workbookFileName: "Gamify Surgery Concepts (2).xlsx",
        sheetName: "Sheet1",
        sourceRow: 23,
        sourceRecordKey: "owner-concept.sheet1.row-023",
      },
      approvedConceptId:
        "concept.ventral-hernia.elective-pulmonary-optimization",
      approvedReleasePointIds: ["release.l0.clinic_evaluation"],
      tutorialEligible: true,
      decision: "approved",
    });
  });

  it("uses one FSRS concept for two distinct ordinary Level 0 variants", () => {
    expect(ROW_023_CASES).toHaveLength(2);
    expect(
      new Set(
        ROW_023_CASES.flatMap((clinicalCase) =>
          clinicalCase.decisionNodes.map((node) => node.primaryConceptId),
        ),
      ),
    ).toEqual(new Set([ROW_023_CONCEPT.id]));
    expect(
      new Set(
        ROW_023_CASES.flatMap((clinicalCase) =>
          clinicalCase.decisionNodes.map((node) => node.questionVariantId),
        ),
      ).size,
    ).toBe(2);

    for (const clinicalCase of ROW_023_CASES) {
      expect(clinicalCase.releasePointId).toBe(
        "release.l0.clinic_evaluation",
      );
      expect(clinicalCase.earliestFacilityStage).toBe(0);
      expect(clinicalCase.requiredClinicalSetting).toBe("clinic");
      expect(clinicalCase.routineEligible).toBe(true);
      expect(clinicalCase.decisionNodes).toHaveLength(1);
    }
    expect(ROW_023_CASES.map((clinicalCase) => clinicalCase.tutorialEligible))
      .toEqual([true, false]);
  });

  it("keeps a stable keyed answer while allowing answer-order variation", () => {
    const nodes = ROW_023_CASES.map(
      (clinicalCase) => clinicalCase.decisionNodes[0]!,
    );
    const expectedChoiceIds = [
      "emergency_repair",
      "optimize_pulmonary",
      "permanent_no_repair",
      "schedule_now",
    ];

    for (const node of nodes) {
      expect(node.answerChoices.map((choice) => choice.id).sort()).toEqual(
        expectedChoiceIds,
      );
      expect(
        node.answerChoices.filter((choice) => choice.isCorrect).map(
          (choice) => choice.id,
        ),
      ).toEqual(["optimize_pulmonary"]);
      expect(node.shuffleAnswers).toBe(true);
      expect(
        node.answerChoices.every((choice) => choice.serviceRequest === null),
      ).toBe(true);
    }
  });

  it("authors one constrained outcome for every incorrect final choice", () => {
    for (const clinicalCase of ROW_023_CASES) {
      const node = clinicalCase.decisionNodes[0]!;
      const incorrectIds = node.answerChoices
        .filter((choice) => !choice.isCorrect)
        .map((choice) => choice.id)
        .sort();

      expect(
        node.terminalDispositions
          .map((disposition) => disposition.answerChoiceId)
          .sort(),
      ).toEqual(incorrectIds);
      expect(
        node.terminalDispositions.every(
          (disposition) => disposition.kind === "no_terminal_outcome",
        ),
      ).toBe(true);
    }
  });

  it("retains complete source-to-claim provenance without promoting source metadata review", () => {
    const sourceIds = new Set(ROW_023_SOURCES.map((source) => source.id));
    const claimIds = new Set(
      ROW_023_EVIDENCE_CLAIMS.map((claim) => claim.id),
    );

    for (const source of ROW_023_SOURCES) {
      expect(source.completeCitation).not.toHaveLength(0);
      expect(source.organizationOrJournal).not.toHaveLength(0);
      expect(source.authors.length).toBeGreaterThan(0);
      expect(source.publicationYear).toBeGreaterThan(0);
      expect(source.officialUrl).toMatch(/^https:\/\//);
      expect(source.accessedOn).toBe("2026-07-30");
      expect(source.licenseLabel).not.toHaveLength(0);
      expect(source.reuseNotes).not.toHaveLength(0);
      expect(source.authorityAssessment).not.toHaveLength(0);
      expect(source.reviewStatus).toBe("needs_clinician_review");
      for (const claimId of source.evidenceClaimIds) {
        expect(claimIds.has(claimId)).toBe(true);
      }
    }

    for (const claim of ROW_023_EVIDENCE_CLAIMS) {
      expect(claim.reviewStatus).toBe("clinically_approved");
      expect(claim.lastClinicianReview).toMatchObject({
        reviewer: "Melissa Rowland, MD",
        reviewedOn: "2026-08-06",
        contentVersion: ROW_023_CONTENT_VERSION,
      });
      expect(claim.lastCheckedOn).toBe("2026-07-30");
      expect(claim.limitation).not.toBeNull();
      for (const sourceId of claim.sourceIds) {
        expect(sourceIds.has(sourceId)).toBe(true);
        expect(
          ROW_023_SOURCES.find((source) => source.id === sourceId)
            ?.evidenceClaimIds,
        ).toContain(claim.id);
      }
    }
  });

  it("is deliberately admitted to the mixed development fixture without changing its release status", () => {
    expect(() =>
      validateSyntheticClinicalRelease(SYNTHETIC_CLINICAL_RELEASE),
    ).not.toThrow();
    expect(SYNTHETIC_CLINICAL_RELEASE.publicationStatus).toBe(
      "synthetic_unapproved_prototype",
    );
    expect(
      SYNTHETIC_CLINICAL_RELEASE.concepts.filter(
        (concept) => concept.id === ROW_023_CONCEPT.id,
      ),
    ).toHaveLength(1);

    for (const approvedCase of ROW_023_CASES) {
      expect(
        SYNTHETIC_CLINICAL_RELEASE.cases.some(
          (clinicalCase) => clinicalCase.id === approvedCase.id,
        ),
      ).toBe(true);
    }
  });
});
