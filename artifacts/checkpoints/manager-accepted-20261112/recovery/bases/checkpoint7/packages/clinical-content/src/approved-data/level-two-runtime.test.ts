import { describe, expect, it } from "vitest";
import { validateSyntheticClinicalRelease } from "../schema";
import { SYNTHETIC_CLINICAL_RELEASE } from "../synthetic-content";
import {
  LEVEL_TWO_ROUTINE_CASE_IDS,
  LEVEL_TWO_RUNTIME_CASES,
} from "./level-two-runtime";
import { ROW_034_QUESTION_VARIANTS } from "./colonic-lipoma";
import { ROW_038_QUESTION_VARIANTS } from "./vitamin-c-collagen-hydroxylation";
import { ROW_039_QUESTION_VARIANTS } from "./gastric-malt-lymphoma";
import { ROW_040_QUESTION_VARIANTS } from "./gastroparesis";
import { ROW_042_QUESTION_VARIANTS } from "./gastric-splenectomy";
import { ROW_049_QUESTION_VARIANTS } from "./peptic-ulcer-bleeding-hemostasis";
import { ROW_111_QUESTION_VARIANTS } from "./distal-cholangiocarcinoma";

const APPROVED_VARIANTS = [
  ...ROW_034_QUESTION_VARIANTS,
  ...ROW_038_QUESTION_VARIANTS,
  ...ROW_039_QUESTION_VARIANTS,
  ...ROW_040_QUESTION_VARIANTS,
  ...ROW_042_QUESTION_VARIANTS,
  ...ROW_049_QUESTION_VARIANTS,
  ...ROW_111_QUESTION_VARIANTS,
];

const EXPECTED_CASE_VARIANTS = [
  ["case.l2.colonic-lipoma.direct.typical-a", ["question.colonic-lipoma.recognition.patient-to-diagnosis.v1", "question.colonic-lipoma.management.patient-to-plan.v1"]],
  ["case.l2.colonic-lipoma.direct.typical-b", ["question.colonic-lipoma.recognition.patient-to-diagnosis.v2", "question.colonic-lipoma.management.patient-to-plan.v2"]],
  ["case.l2.wound-healing.vitamin-c.vitamin-identification.v1", ["question.wound-healing.vitamin-c.vitamin-identification.v1"]],
  ["case.l2.wound-healing.vitamin-c.biochemical-step.v1", ["question.wound-healing.vitamin-c.biochemical-step.v1"]],
  ["case.l2.wound-healing.vitamin-c.mechanism-explanation.v1", ["question.wound-healing.vitamin-c.mechanism-explanation.v1"]],
  ["case.l2.wound-healing.vitamin-c.mechanism-consequence.v1", ["question.wound-healing.vitamin-c.mechanism-consequence.v1"]],
  ["case.l2.gastric-malt.integrated-diagnosis-to-treatment.v1", ["question.gastric-malt.integrated-pathology-diagnosis.v1", "question.gastric-malt.localized-hpylori-positive-initial-treatment.v1"]],
  ["case.l2.gastric-malt.profile-to-followup-boundary.v1", ["question.gastric-malt.pathology-profile-selection.v1", "question.gastric-malt.eradication-response-reassessment.v1"]],
  ["case.l2.gastric-malt.cd20-boundary.v1", ["question.gastric-malt.cd20-alone-boundary.v1"]],
  ["case.l2.gastric-malt.eradication-patient-selection.v1", ["question.gastric-malt.eradication-patient-selection.v1"]],
  ["case.l2.gastroparesis.general-confirmatory-testing.v1", ["question.gastroparesis.general-confirmatory-testing.v1"]],
  ["case.l2.gastroparesis.diabetes-confirmatory-testing.v1", ["question.gastroparesis.diabetes-confirmatory-testing.v1"]],
  ["case.l2.gastroparesis.postsurgical-confirmatory-testing.v1", ["question.gastroparesis.postsurgical-confirmatory-testing.v1"]],
  ["case.l2.gastroparesis.objective-result-selection.v1", ["question.gastroparesis.objective-result-selection.v1"]],
  ["case.l2.gastric-adenocarcinoma.post-endoscopy-splenic-referral.v1", ["question.gastric-adenocarcinoma.post-endoscopy-splenic-referral.v1"]],
  ["case.l2.gastric-adenocarcinoma.spleen-preservation-counseling.v1", ["question.gastric-adenocarcinoma.spleen-preservation-counseling.v1"]],
  ["case.l2.peptic-ulcer-bleeding.visible-vessel-hemostasis.v1", ["question.peptic-ulcer-bleeding.visible-vessel-treat.v1", "question.peptic-ulcer-bleeding.visible-vessel-inadequate-monotherapy.v1"]],
  ["case.l2.peptic-ulcer-bleeding.select-high-risk-stigmata.v1", ["question.peptic-ulcer-bleeding.select-high-risk-stigmata.v1"]],
  ["case.l2.peptic-ulcer-bleeding.clean-base-reverse.v1", ["question.peptic-ulcer-bleeding.clean-base-reverse.v1"]],
  ["case.l2.peptic-ulcer-bleeding.visible-vessel-modality-principle.v1", ["question.peptic-ulcer-bleeding.visible-vessel-modality-principle.v1"]],
  ["case.l2.distal-cholangiocarcinoma.deferred-eus-ercp-to-resection", ["question.distal-cholangiocarcinoma.workup-a.v1", "question.distal-cholangiocarcinoma.management-a.v1"]],
] as const;

describe("Level 2 approved runtime adapter", () => {
  it("admits only exact approved Level 2 cases with bounded decisions and provenance", () => {
    expect(() => validateSyntheticClinicalRelease(SYNTHETIC_CLINICAL_RELEASE)).not.toThrow();
    expect(LEVEL_TWO_ROUTINE_CASE_IDS).toEqual(EXPECTED_CASE_VARIANTS.map(([caseId]) => caseId));
    expect(LEVEL_TWO_RUNTIME_CASES).not.toHaveLength(0);
    for (const clinicalCase of LEVEL_TWO_RUNTIME_CASES) {
      expect(clinicalCase.earliestFacilityStage).toBe(2);
      expect(clinicalCase.releasePointId).toBe("release.l2.endoscopy");
      expect(clinicalCase.decisionNodes.length).toBeLessThanOrEqual(3);
      expect(new Set(clinicalCase.decisionNodes.map((node) => node.primaryConceptId)).size).toBe(clinicalCase.decisionNodes.length);
      expect(clinicalCase.sourceLabels.some((label) => label.startsWith("Clinically approved by Melissa Rowland, MD"))).toBe(true);
      expect(clinicalCase.sourceLabels.some((label) => !label.startsWith("Clinically approved by"))).toBe(true);
      expect(SYNTHETIC_CLINICAL_RELEASE.cases.filter((candidate) => candidate.id === clinicalCase.id)).toHaveLength(1);
    }
  });

  it("copies every admitted approved node verbatim from its exact source variant", () => {
    for (const [caseId, variantIds] of EXPECTED_CASE_VARIANTS) {
      const clinicalCase = LEVEL_TWO_RUNTIME_CASES.find((candidate) => candidate.id === caseId)!;
      expect(clinicalCase.decisionNodes.map((node) => node.questionVariantId)).toEqual(variantIds);
      for (const node of clinicalCase.decisionNodes) {
        const source = APPROVED_VARIANTS.find((variant) => variant.id === node.questionVariantId)!;
        expect(node).toMatchObject({ primaryConceptId: source.conceptId, explanation: source.explanation });
        expect(
          node.stem === source.stem || `${node.currentUpdate ?? clinicalCase.presentation} ${node.stem}` === source.stem,
        ).toBe(true);
        expect(node.answerChoices.map(({ id, label, isCorrect, serviceRequest }) => ({ id, label, isCorrect, serviceId: serviceRequest?.serviceId ?? null }))).toEqual(
          source.answerChoices.map((choice) => ({
            id: choice.id,
            label: choice.label,
            isCorrect: choice.isCorrect,
            serviceId: "deferredService" in choice && choice.deferredService &&
              typeof choice.deferredService === "object" && "serviceId" in choice.deferredService &&
              typeof choice.deferredService.serviceId === "string"
              ? choice.deferredService.serviceId
              : null,
          })),
        );
        expect(node.sourceLabels.some((label) => !label.startsWith("Clinically approved by"))).toBe(true);
        expect(node.sourceLabels.some((label) => label.startsWith("Clinically approved by Melissa Rowland, MD"))).toBe(true);
      }
    }
  });

  it("mechanically splits both direct colonic blueprints without altering a word", () => {
    for (const suffix of ["typical-a", "typical-b"]) {
      const clinicalCase = LEVEL_TWO_RUNTIME_CASES.find((candidate) => candidate.id === `case.l2.colonic-lipoma.direct.${suffix}`)!;
      const [first, second] = clinicalCase.decisionNodes;
      const sourceFirst = APPROVED_VARIANTS.find((variant) => variant.id === first!.questionVariantId)!;
      const sourceSecond = APPROVED_VARIANTS.find((variant) => variant.id === second!.questionVariantId)!;
      expect(`${clinicalCase.presentation} ${first!.stem}`).toBe(sourceFirst.stem);
      expect(`${second!.currentUpdate} ${second!.stem}`).toBe(sourceSecond.stem);
    }
  });

  it("excludes every future Hospital OR and Floor record plus the unschedulable final-node workup", () => {
    const text = JSON.stringify(LEVEL_TWO_RUNTIME_CASES);
    expect(text).not.toContain("hospital_or");
    expect(text).not.toContain("hospital_floor");
    expect(text).not.toContain("active-oozing");
    expect(LEVEL_TWO_ROUTINE_CASE_IDS).not.toContain("case.l2.distal-cholangiocarcinoma.deferred-eus-ercp-workup-only");
    expect(LEVEL_TWO_ROUTINE_CASE_IDS).toContain("case.l2.distal-cholangiocarcinoma.deferred-eus-ercp-to-resection");
  });

  it("preserves the exact two-step EUS/ERCP workup mapping and later current update", () => {
    const clinicalCase = LEVEL_TWO_RUNTIME_CASES.find((candidate) =>
      candidate.id.endsWith("distal-cholangiocarcinoma.deferred-eus-ercp-to-resection"),
    )!;
    expect(clinicalCase.decisionNodes.map((node) => node.questionVariantId)).toEqual([
      "question.distal-cholangiocarcinoma.workup-a.v1",
      "question.distal-cholangiocarcinoma.management-a.v1",
    ]);
    expect(clinicalCase.decisionNodes[0]?.answerChoices.find((choice) => choice.isCorrect)?.serviceRequest).toEqual({ serviceId: "service.endoscopy.eus-ercp-sampling" });
    expect(clinicalCase.decisionNodes[1]?.currentUpdate).toBe("Sampling supports distal cholangiocarcinoma and disease remains resectable.");
  });
});
