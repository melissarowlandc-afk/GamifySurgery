import { describe, expect, it } from "vitest";
import { validateSyntheticClinicalRelease } from "../schema";
import { SYNTHETIC_CLINICAL_RELEASE } from "../synthetic-content";
import {
  ROW_048_CASES,
  ROW_048_CLINICAL_APPROVAL,
  ROW_048_CONCEPTS,
  ROW_048_CONTENT_VERSION,
  ROW_048_EVIDENCE_CLAIMS,
  ROW_048_SOURCES,
} from "./desmoid-management-pathway";

describe("owner row 48 approved desmoid management pathway", () => {
  it("records the exact two-concept Level 0 approval", () => {
    expect(ROW_048_CLINICAL_APPROVAL).toMatchObject({
      id: "approval.melissa-rowland-md.owner-row-048.2026-08-10",
      reviewer: "Melissa Rowland, MD",
      reviewedOn: "2026-08-10",
      contentVersion: ROW_048_CONTENT_VERSION,
      sourceProvenance: {
        workbookFileName: "Gamify Surgery Concepts (2).xlsx",
        sheetName: "Sheet1",
        sourceRow: 48,
        sourceRecordKey: "owner-concept.sheet1.row-048",
      },
      approvedConceptIds: [
        "concept.desmoid.initial-active-surveillance",
        "concept.desmoid.progressing-abdominal-wall-surgical-option",
      ],
      approvedReleasePointIds: ["release.l0.clinic_evaluation"],
      decision: "approved",
      multiDecisionAssessment: {
        status: "approved_two_decision_encounter",
      },
    });
    expect(ROW_048_CONCEPTS).toHaveLength(2);
    expect(
      ROW_048_CONCEPTS.every(
        (concept) =>
          concept.conceptType === "management" &&
          concept.earliestFacilityStage === 0,
      ),
    ).toBe(true);
  });

  it("admits eight exact variants through seven encounter blueprints", () => {
    expect(ROW_048_CASES).toHaveLength(7);
    const nodes = ROW_048_CASES.flatMap(
      (clinicalCase) => clinicalCase.decisionNodes,
    );
    expect(nodes).toHaveLength(8);
    expect(new Set(nodes.map((node) => node.questionVariantId)).size).toBe(
      8,
    );
    expect(
      new Set(nodes.map((node) => node.primaryConceptId)),
    ).toEqual(new Set(ROW_048_CONCEPTS.map((concept) => concept.id)));

    for (const clinicalCase of ROW_048_CASES) {
      expect(clinicalCase.releasePointId).toBe(
        "release.l0.clinic_evaluation",
      );
      expect(clinicalCase.requiredClinicalSetting).toBe("clinic");
      expect(clinicalCase.requiredCapabilityIds).toEqual([]);
      expect(clinicalCase.tutorialEligible).toBe(false);
      for (const node of clinicalCase.decisionNodes) {
        expect(node.shuffleAnswers).toBe(true);
        expect(
          node.answerChoices.filter((choice) => choice.isCorrect),
        ).toHaveLength(1);
      }
    }
  });

  it("uses one coherent two-decision later-follow-up encounter", () => {
    const pathway = ROW_048_CASES.find(
      (clinicalCase) =>
        clinicalCase.id ===
        "case.desmoid.surveillance-to-progressing-abdominal-wall",
    );
    expect(pathway?.decisionNodes).toHaveLength(2);
    expect(
      pathway?.decisionNodes.map((node) => node.primaryConceptId),
    ).toEqual([
      "concept.desmoid.initial-active-surveillance",
      "concept.desmoid.progressing-abdominal-wall-surgical-option",
    ]);
    expect(pathway?.decisionNodes[0]?.resultGateAfter).toBeNull();
    expect(pathway?.decisionNodes[0]?.terminalDispositions).toEqual([]);
    expect(pathway?.decisionNodes[1]?.stem).toContain(
      "At a later specialist follow-up",
    );
  });

  it("preserves all eight keyed answers", () => {
    expect(
      ROW_048_CASES.flatMap((clinicalCase) =>
        clinicalCase.decisionNodes.map(
          (node) =>
            node.answerChoices.find((choice) => choice.isCorrect)?.label,
        ),
      ),
    ).toEqual([
      "Active surveillance with specialist follow-up",
      "Function-preserving resection after multidisciplinary review",
      "Newly diagnosed stable desmoid without a threat to function",
      "Many newly diagnosed desmoids begin with active surveillance",
      "Continue active surveillance",
      "Progressing resectable abdominal-wall tumor with low expected morbidity",
      "Preserve function rather than pursuing a wide margin at any cost",
      "Surgery may be proposed for progressing abdominal-wall disease",
    ]);
  });

  it("does not make the correct answer uniquely longest", () => {
    for (const node of ROW_048_CASES.flatMap(
      (clinicalCase) => clinicalCase.decisionNodes,
    )) {
      const correctLength =
        node.answerChoices.find((choice) => choice.isCorrect)?.label.length ??
        0;
      expect(
        node.answerChoices.some(
          (choice) =>
            !choice.isCorrect && choice.label.length >= correctLength,
        ),
      ).toBe(true);
    }
  });

  it("authors one bounded consequence for every wrong final answer", () => {
    for (const clinicalCase of ROW_048_CASES) {
      const finalNode = clinicalCase.decisionNodes.at(-1)!;
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

  it("retains complete source-to-claim provenance", () => {
    const sourceIds = new Set(ROW_048_SOURCES.map((source) => source.id));
    const claimIds = new Set(
      ROW_048_EVIDENCE_CLAIMS.map((claim) => claim.id),
    );

    for (const source of ROW_048_SOURCES) {
      expect(source.completeCitation).not.toHaveLength(0);
      expect(source.organizationOrJournal).not.toHaveLength(0);
      expect(source.authors.length).toBeGreaterThan(0);
      expect(source.publicationYear).toBeGreaterThan(0);
      expect(source.officialUrl).toMatch(/^https:\/\//);
      expect(source.accessedOn).toBe("2026-08-10");
      expect(source.reviewStatus).toBe("needs_clinician_review");
      for (const claimId of source.evidenceClaimIds) {
        expect(claimIds.has(claimId)).toBe(true);
      }
    }

    for (const claim of ROW_048_EVIDENCE_CLAIMS) {
      expect(claim.reviewStatus).toBe("clinically_approved");
      expect(claim.lastClinicianReview).toMatchObject({
        reviewer: "Melissa Rowland, MD",
        reviewedOn: "2026-08-10",
        contentVersion: ROW_048_CONTENT_VERSION,
      });
      expect(claim.lastCheckedOn).toBe("2026-08-10");
      expect(claim.limitation).not.toBeNull();
      for (const sourceId of claim.sourceIds) {
        expect(sourceIds.has(sourceId)).toBe(true);
      }
    }
  });

  it("admits the exact reviewed variants to the active development release", () => {
    expect(() =>
      validateSyntheticClinicalRelease(SYNTHETIC_CLINICAL_RELEASE),
    ).not.toThrow();
    for (const concept of ROW_048_CONCEPTS) {
      expect(
        SYNTHETIC_CLINICAL_RELEASE.concepts.filter(
          (candidate) => candidate.id === concept.id,
        ),
      ).toHaveLength(1);
    }
    for (const approvedCase of ROW_048_CASES) {
      expect(
        SYNTHETIC_CLINICAL_RELEASE.cases.some(
          (clinicalCase) => clinicalCase.id === approvedCase.id,
        ),
      ).toBe(true);
    }
  });
});
