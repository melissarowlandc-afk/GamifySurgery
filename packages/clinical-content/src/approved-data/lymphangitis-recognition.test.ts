import { describe, expect, it } from "vitest";
import { validateSyntheticClinicalRelease } from "../schema";
import { SYNTHETIC_CLINICAL_RELEASE } from "../synthetic-content";
import {
  ROW_104_APPROVED_BACKLOG,
  ROW_104_APPROVED_ENCOUNTER_BLUEPRINTS,
  ROW_104_CASES,
  ROW_104_CLINICAL_APPROVAL,
  ROW_104_CONCEPT,
  ROW_104_CONTENT_VERSION,
  ROW_104_EVIDENCE_CLAIMS,
  ROW_104_QUESTION_VARIANTS,
  ROW_104_SOURCES,
} from "./lymphangitis-recognition";

describe("owner row 104 approved lymphangitis recognition package", () => {
  it("records one clinician-approved diagnosis identity and five exact variants", () => {
    expect(ROW_104_CLINICAL_APPROVAL).toMatchObject({
      id: "approval.melissa-rowland-md.owner-row-104.2026-08-21",
      reviewer: "Melissa Rowland, MD",
      reviewedOn: "2026-08-21",
      contentVersion: ROW_104_CONTENT_VERSION,
      decision: "approved",
    });
    expect(ROW_104_CONCEPT).toMatchObject({
      id: "concept.lymphangitis.acute-clinical-recognition",
      conceptType: "diagnosis",
      earliestFacilityStage: 0,
    });
    expect(ROW_104_CASES).toHaveLength(5);
    expect(ROW_104_QUESTION_VARIANTS).toHaveLength(5);
    expect(ROW_104_APPROVED_ENCOUNTER_BLUEPRINTS).toHaveLength(5);
  });

  it("keeps every approved encounter to one shuffled three-choice decision", () => {
    for (const clinicalCase of ROW_104_CASES) {
      expect(clinicalCase.tutorialEligible).toBe(false);
      expect(clinicalCase.routineEligible).toBe(true);
      expect(clinicalCase.releasePointId).toBe("release.l0.clinic_evaluation");
      expect(clinicalCase.earliestFacilityStage).toBe(0);
      expect(clinicalCase.requiredClinicalSetting).toBe("clinic");
      expect(clinicalCase.requiredCapabilityIds).toEqual([]);
      expect(clinicalCase.decisionNodes).toHaveLength(1);

      const [node] = clinicalCase.decisionNodes;
      expect(node?.answerChoices).toHaveLength(3);
      expect(node?.answerChoices.filter((choice) => choice.isCorrect)).toHaveLength(1);
      expect(node?.shuffleAnswers).toBe(true);
      expect(node?.resultGateAfter).toBeNull();
      expect(node?.terminalDispositions).toHaveLength(2);
      expect(node?.terminalDispositions.map((entry) => entry.answerChoiceId).sort()).toEqual(
        node?.answerChoices
          .filter((choice) => !choice.isCorrect)
          .map((choice) => choice.id)
          .sort(),
      );
    }
  });

  it("contains every owner-approved entry-site and regional-node pattern", () => {
    const content = JSON.stringify(ROW_104_CASES);
    expect(content).toContain("toe");
    expect(content).toContain("palm");
    expect(content).toContain("heel");
    expect(content).toContain("finger");
    expect(content).toContain("tender axillary nodes");
    expect(content).toContain("tender groin nodes");
    expect(content).toContain("red streak extending toward tender axillary nodes");
  });

  it("keeps the package to recognition rather than treatment or testing", () => {
    const content = JSON.stringify({
      variants: ROW_104_QUESTION_VARIANTS,
      cases: ROW_104_CASES,
    });
    expect(content).not.toMatch(/antibiotic|culture|imaging|laboratory|organism/i);
    expect(ROW_104_APPROVED_BACKLOG.multiDecisionAssessment).toContain(
      "one-decision",
    );
  });

  it("links the approved phenotype claim to complete source metadata still awaiting source review", () => {
    const sourceIds = new Set(ROW_104_SOURCES.map((source) => source.id));
    expect(ROW_104_SOURCES).toHaveLength(1);
    expect(sourceIds).toEqual(
      new Set(["source.msd-manual-professional.lymphangitis.2026"]),
    );
    for (const source of ROW_104_SOURCES) {
      expect(source.reviewStatus).toBe("needs_clinician_review");
      expect(source.completeCitation).not.toHaveLength(0);
      expect(source.organizationOrJournal).not.toHaveLength(0);
      expect(source.authors.length).toBeGreaterThan(0);
      expect(source.officialUrl).toMatch(/^https:\/\//);
    }
    expect(ROW_104_EVIDENCE_CLAIMS).toHaveLength(1);
    expect(ROW_104_EVIDENCE_CLAIMS[0]).toMatchObject({
      reviewStatus: "clinically_approved",
      id: "claim.lymphangitis.distal-entry-proximal-streak-regional-nodes",
      lastCheckedOn: "2026-08-21",
    });
    expect(ROW_104_EVIDENCE_CLAIMS[0]?.limitation).toContain(
      "sole adequate targeted-verification source",
    );
    for (const sourceId of ROW_104_EVIDENCE_CLAIMS[0]?.sourceIds ?? []) {
      expect(sourceIds.has(sourceId)).toBe(true);
    }
  });

  it("admits the five approved Level 0 cases exactly once", () => {
    expect(() => validateSyntheticClinicalRelease(SYNTHETIC_CLINICAL_RELEASE)).not.toThrow();
    const activeConceptIds = SYNTHETIC_CLINICAL_RELEASE.concepts.map(
      (concept) => concept.id,
    );
    const activeCaseIds = SYNTHETIC_CLINICAL_RELEASE.cases.map(
      (clinicalCase) => clinicalCase.id,
    );
    expect(activeConceptIds.filter((id) => id === ROW_104_CONCEPT.id)).toHaveLength(1);
    for (const clinicalCase of ROW_104_CASES) {
      expect(activeCaseIds.filter((id) => id === clinicalCase.id)).toHaveLength(1);
    }
  });
});
