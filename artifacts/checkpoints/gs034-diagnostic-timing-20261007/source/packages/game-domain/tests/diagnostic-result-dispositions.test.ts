import { SYNTHETIC_CLINICAL_RELEASE } from "@gamify-surgery/clinical-content";
import { describe, expect, it } from "vitest";
import { EXACT_DIAGNOSTIC_RESULT_RECORDS, getDiagnosticResultDisposition } from "../src/diagnostic-result-dispositions";
import type { EncounterState } from "../src";

describe("exact frozen endoscopy result contracts", () => {
  it("binds every operational annotation to an active exact choice and profile, including distractors", () => {
    const keys = new Set<string>();
    for (const record of EXACT_DIAGNOSTIC_RESULT_RECORDS) {
      const clinicalCase = SYNTHETIC_CLINICAL_RELEASE.cases.find((candidate) => candidate.id === record.caseId);
      const node = clinicalCase?.decisionNodes.find((candidate) => candidate.id === record.nodeId && candidate.questionVariantId === record.questionVariantId);
      const key = `${record.caseId}|${record.nodeId}|${record.choiceId}`;
      expect(keys.has(key), key).toBe(false); keys.add(key);
      expect(node, key).toBeDefined();
      const encounter = { frozenCase: clinicalCase } as EncounterState;
      if (record.result) expect(getDiagnosticResultDisposition(encounter, node!, record.choiceId), key).toEqual(record.result);
      for (const [componentId, result] of Object.entries(record.components ?? {})) {
        expect(getDiagnosticResultDisposition(encounter, node!, record.choiceId, componentId), key).toEqual(result);
      }
    }
  });

  it("separates a visual update with pending histology from a returned biopsy result", () => {
    const selected = (caseId: string, index: number, choiceId: string) => {
      const clinicalCase = SYNTHETIC_CLINICAL_RELEASE.cases.find((candidate) => candidate.id === caseId)!;
      return getDiagnosticResultDisposition({ frozenCase: clinicalCase } as EncounterState, clinicalCase.decisionNodes[index]!, choiceId);
    };
    expect(selected("case.recovered-diverticulitis.drained-abscess", 0, "colonoscopy_1")).toEqual({ specimenCollected: false, resultKind: "visual" });
    expect(selected("case.esophageal-dysphagia.bread-sticking", 0, "egd_1")).toEqual({ specimenCollected: true, resultKind: "pathology" });
    expect(selected("case.colorectal.routine-screen", 0, "colonoscopy_1")).toEqual({ specimenCollected: true, resultKind: "visual" });
    expect(selected("case.celiac.chronic-diarrhea", 1, "colonoscopy_1")).toEqual({ specimenCollected: true, resultKind: "pathology" });
  });

  it("does not infer specimen collection from altered labels or new question versions", () => {
    const original = SYNTHETIC_CLINICAL_RELEASE.cases.find((candidate) => candidate.id === "case.esophageal-dysphagia.bread-sticking")!;
    const clinicalCase = JSON.parse(JSON.stringify(original)) as typeof original;
    const node = clinicalCase.decisionNodes[0]!;
    const encounter = { frozenCase: clinicalCase } as EncounterState;
    node.answerChoices.find((choice) => choice.id === "egd_1")!.label = "EGD";
    expect(getDiagnosticResultDisposition(encounter, node, "egd_1")).toBeNull();
    node.answerChoices.find((choice) => choice.id === "egd_1")!.label = "EGD with esophageal biopsies";
    node.questionVariantId += ".future";
    expect(getDiagnosticResultDisposition(encounter, node, "egd_1")).toBeNull();
  });
});
