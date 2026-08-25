import { describe, expect, it } from "vitest";
import { validateSyntheticClinicalRelease } from "../schema";
import { SYNTHETIC_CLINICAL_RELEASE } from "../synthetic-content";
import {
  ROW_036_CASES,
  ROW_036_CLINICAL_APPROVAL,
  ROW_036_CONCEPTS,
  ROW_036_CONTENT_VERSION,
  ROW_036_EVIDENCE_CLAIMS,
  ROW_036_SOURCES,
} from "./mondor-disease";

describe("owner row 36 approved Mondor disease package", () => {
  it("records the named approval, three concepts, and Level 0 release", () => {
    expect(ROW_036_CLINICAL_APPROVAL).toMatchObject({
      id: "approval.melissa-rowland-md.owner-row-036.2026-08-06",
      reviewer: "Melissa Rowland, MD",
      reviewerRole: "Surgeon",
      reviewedOn: "2026-08-06",
      contentVersion: ROW_036_CONTENT_VERSION,
      sourceProvenance: {
        workbookFileName: "Gamify Surgery Concepts (2).xlsx",
        sheetName: "Sheet1",
        sourceRow: 36,
        sourceRecordKey: "owner-concept.sheet1.row-036",
      },
      approvedReleasePointIds: ["release.l0.clinic_evaluation"],
      decision: "approved",
    });
    expect(
      ROW_036_CONCEPTS.map((concept) => concept.conceptType),
    ).toEqual(["diagnosis", "workup", "management"]);
    expect(
      ROW_036_CONCEPTS.every(
        (concept) => concept.earliestFacilityStage === 0,
      ),
    ).toBe(true);
  });

  it("implements exactly nine approved variants across separate FSRS identities", () => {
    const nodes = ROW_036_CASES.flatMap(
      (clinicalCase) => clinicalCase.decisionNodes,
    );
    const questionVariantIds = new Set(
      nodes.map((node) => node.questionVariantId),
    );
    expect(questionVariantIds).toEqual(
      new Set(ROW_036_CLINICAL_APPROVAL.approvedQuestionVariantIds),
    );
    expect(questionVariantIds.size).toBe(9);
    expect(
      new Set(nodes.map((node) => node.primaryConceptId)),
    ).toEqual(
      new Set(ROW_036_CONCEPTS.map((concept) => concept.id)),
    );
    for (const node of nodes) {
      expect(node.answerChoices).toHaveLength(4);
      expect(
        node.answerChoices.filter((choice) => choice.isCorrect),
      ).toHaveLength(1);
      expect(node.shuffleAnswers).toBe(true);
    }
  });

  it("provides the approved three-step, two-step, and short-case organization", () => {
    expect(ROW_036_CASES).toHaveLength(8);
    expect(ROW_036_CASES[0]?.decisionNodes).toHaveLength(3);
    expect(ROW_036_CASES[1]?.decisionNodes).toHaveLength(2);
    expect(
      ROW_036_CASES.slice(2).every(
        (clinicalCase) => clinicalCase.decisionNodes.length === 1,
      ),
    ).toBe(true);
    for (const clinicalCase of ROW_036_CASES) {
      expect(clinicalCase).toMatchObject({
        releasePointId: "release.l0.clinic_evaluation",
        tutorialEligible: false,
        routineEligible: true,
        earliestFacilityStage: 0,
        requiredClinicalSetting: "clinic",
        requiredCapabilityIds: [],
      });
    }
  });

  it("uses an off-site result gate only for the approved diagnostic-imaging steps", () => {
    const gatedNodes = ROW_036_CASES.flatMap(
      (clinicalCase) => clinicalCase.decisionNodes,
    ).filter((node) => node.resultGateAfter !== null);
    expect(gatedNodes).toHaveLength(2);
    for (const node of gatedNodes) {
      expect(node.resultGateAfter).toMatchObject({
        resultTypeId: "service.diagnostic_breast_imaging",
        allowedServiceRouteIds: [
          "route.diagnostic_breast_imaging.outsourced",
        ],
      });
      expect(
        node.answerChoices.find((choice) => choice.isCorrect)
          ?.serviceRequest,
      ).toEqual({
        serviceId: "service.diagnostic_breast_imaging",
      });
      expect(
        Object.fromEntries(
          node.answerChoices.map((choice) => [
            choice.id,
            choice.serviceRequest?.serviceId,
          ]),
        ),
      ).toEqual({
        diagnostic_mammography_or_dbt_and_targeted_ultrasound:
          "service.diagnostic_breast_imaging",
        screening_mammography: "service.mammography",
        breast_mri: "service.breast_mri",
        immediate_excisional_biopsy:
          "service.breast_excisional_biopsy",
      });
      expect(node.terminalDispositions).toEqual([]);
    }
  });

  it("authors a bounded disposition for every wrong final answer", () => {
    for (const clinicalCase of ROW_036_CASES) {
      const finalNode =
        clinicalCase.decisionNodes[
          clinicalCase.decisionNodes.length - 1
        ]!;
      const wrongChoiceIds = finalNode.answerChoices
        .filter((choice) => !choice.isCorrect)
        .map((choice) => choice.id)
        .sort();
      expect(
        finalNode.terminalDispositions
          .map((disposition) => disposition.answerChoiceId)
          .sort(),
      ).toEqual(wrongChoiceIds);
      expect(
        finalNode.terminalDispositions.every(
          (disposition) => disposition.kind === "no_terminal_outcome",
        ),
      ).toBe(true);
    }
  });

  it("keeps complete source-to-claim provenance and review-state separation", () => {
    const sourceIds = new Set(ROW_036_SOURCES.map((source) => source.id));
    const claimIds = new Set(
      ROW_036_EVIDENCE_CLAIMS.map((claim) => claim.id),
    );

    for (const source of ROW_036_SOURCES) {
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

    for (const claim of ROW_036_EVIDENCE_CLAIMS) {
      expect(claim.reviewStatus).toBe("clinically_approved");
      expect(claim.lastClinicianReview).toMatchObject({
        reviewer: "Melissa Rowland, MD",
        reviewedOn: "2026-08-06",
        contentVersion: ROW_036_CONTENT_VERSION,
      });
      expect(claim.lastCheckedOn).toBe("2026-08-06");
      expect(claim.limitation).not.toBeNull();
      for (const sourceId of claim.sourceIds) {
        expect(sourceIds.has(sourceId)).toBe(true);
      }
    }
  });

  it("admits the exact package to the active development release", () => {
    expect(() =>
      validateSyntheticClinicalRelease(SYNTHETIC_CLINICAL_RELEASE),
    ).not.toThrow();
    for (const concept of ROW_036_CONCEPTS) {
      expect(
        SYNTHETIC_CLINICAL_RELEASE.concepts.filter(
          (candidate) => candidate.id === concept.id,
        ),
      ).toHaveLength(1);
    }
    for (const approvedCase of ROW_036_CASES) {
      expect(
        SYNTHETIC_CLINICAL_RELEASE.cases.some(
          (candidate) => candidate.id === approvedCase.id,
        ),
      ).toBe(true);
    }
  });
});
