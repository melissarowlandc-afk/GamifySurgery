import { describe, expect, it } from "vitest";
import { validateSyntheticClinicalRelease } from "../schema";
import { SYNTHETIC_CLINICAL_RELEASE } from "../synthetic-content";
import { ROW_111_APPROVED_BACKLOG, ROW_111_APPROVED_ENCOUNTER_BLUEPRINTS, ROW_111_CASES, ROW_111_CONCEPTS, ROW_111_EVIDENCE_CLAIMS, ROW_111_QUESTION_VARIANTS, ROW_111_SOURCES } from "./distal-cholangiocarcinoma";

describe("owner row 111 distal cholangiocarcinoma package", () => {
  it("records two concepts, five variants, and four blueprints", () => {
    expect(ROW_111_CONCEPTS.map((concept) => concept.id)).toEqual(["concept.distal-cholangiocarcinoma.operable-tissue-evaluation", "concept.distal-cholangiocarcinoma.resection-selection"]);
    expect(ROW_111_QUESTION_VARIANTS).toHaveLength(5);
    expect(ROW_111_APPROVED_ENCOUNTER_BLUEPRINTS).toHaveLength(4);
  });
  it("keeps L2 workup deferred with explicit editorial timing", () => {
    const deferred = ROW_111_APPROVED_ENCOUNTER_BLUEPRINTS.slice(0, 2);
    for (const blueprint of deferred) {
      expect(blueprint.releasePointId).toBe("release.l2.endoscopy");
      expect(blueprint.requiredCapabilityIds).toEqual(["capability.endoscopy"]);
      expect("editorialSimulation" in blueprint && blueprint.editorialSimulation).toEqual({ resultDelayMinutes: 480, basis: "editorial_simulation" });
    }
    expect(ROW_111_APPROVED_BACKLOG.currentGameEligibility).toBe("partially_active_and_partially_deferred");
    expect(deferred[0]?.intermediateDecisionBehavior).toBe("corrective_forward");
  });
  it("uses shared hospital-referral procedure wording without referral labels", () => {
    const management = ROW_111_QUESTION_VARIANTS.filter((variant) =>
      variant.answerChoices.some((choice) => choice.label === "Whipple pancreaticoduodenectomy"),
    );
    for (const variant of management) {
      expect(variant.stem).toContain("Refer to hospital HPB surgery for");
      expect(variant.answerChoices.map((choice) => choice.label)).toContain("Whipple pancreaticoduodenectomy");
      expect(variant.answerChoices.map((choice) => choice.label)).toContain("Bile-duct excision with hepaticojejunostomy");
      expect(variant.answerChoices.every((choice) => !choice.label.includes("Refer"))).toBe(true);
    }
  });
  it("gives every deferred workup choice a stable service ID and editorial eight-hour timing", () => {
    const workup = ROW_111_QUESTION_VARIANTS.filter((variant) =>
      variant.conceptId.endsWith("operable-tissue-evaluation"),
    );
    const choices = workup.flatMap((variant) => variant.answerChoices);
    expect(choices).toHaveLength(6);
    expect(new Set(choices.map((choice) => choice.deferredService?.serviceId)).size).toBe(5);
    for (const choice of choices) {
      expect(choice.deferredService?.serviceId).toMatch(/^service\./);
      expect(choice.deferredService?.editorialSimulation).toEqual({ resultDelayMinutes: 480, basis: "editorial_simulation" });
    }
  });
  it("keeps deferred management admission separate from timed-service metadata", () => {
    const managementA = ROW_111_QUESTION_VARIANTS.find(
      (variant) => variant.id === "question.distal-cholangiocarcinoma.management-a.v1",
    );
    expect(managementA).toMatchObject({
      releasePointId: "release.l2.endoscopy",
      requiredCapabilityIds: ["capability.endoscopy"],
    });
    expect(managementA?.editorialSimulation).toBeUndefined();
    expect(
      managementA?.answerChoices.every((choice) => !("deferredService" in choice)),
    ).toBe(true);
    for (const variant of ROW_111_QUESTION_VARIANTS.filter(
      (candidate) => candidate.conceptId.endsWith("resection-selection"),
    )) {
      expect(variant.editorialSimulation).toBeUndefined();
      expect(variant.answerChoices.every((choice) => !("deferredService" in choice))).toBe(true);
    }
  });
  it("admits exactly two active Level 0 management cases", () => {
    expect(ROW_111_CASES).toHaveLength(2);
    expect(() => validateSyntheticClinicalRelease(SYNTHETIC_CLINICAL_RELEASE)).not.toThrow();
    for (const clinicalCase of ROW_111_CASES) {
      expect(clinicalCase.decisionNodes).toHaveLength(1);
      const node = clinicalCase.decisionNodes[0]!;
      expect(node.answerChoices).toHaveLength(3);
      expect(node.answerChoices.filter((choice) => choice.isCorrect)).toHaveLength(1);
      expect(node.shuffleAnswers).toBe(true);
      expect(node.resultGateAfter).toBeNull();
      expect(node.terminalDispositions).toHaveLength(2);
      expect(SYNTHETIC_CLINICAL_RELEASE.cases.filter((candidate) => candidate.id === clinicalCase.id)).toHaveLength(1);
    }
  });
  it("links complete sources and preserves the constrained-pathway limitations", () => {
    expect(ROW_111_SOURCES).toHaveLength(2);
    for (const source of ROW_111_SOURCES) expect(source.reviewStatus).toBe("needs_clinician_review");
    expect(ROW_111_EVIDENCE_CLAIMS.every((claim) => claim.reviewStatus === "clinically_approved")).toBe(true);
    expect(JSON.stringify(ROW_111_EVIDENCE_CLAIMS)).toMatch(/CA 19-9 is not diagnostic confirmation/);
    expect(JSON.stringify(ROW_111_EVIDENCE_CLAIMS)).toMatch(/editorial simulation/);
  });
});
