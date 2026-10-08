/// <reference types="node" />
import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { ANSWER_CHOICE_TIMING_REGISTRY } from "../../answer-choice-timing";
import { SYNTHETIC_CLINICAL_RELEASE as releaseWithLevel3 } from "../../synthetic-content";
// Keep this historical batch's inventory proof scoped to its original bank.
// New level3 admission and complete protected-intake checks live in its own test.
const release = { ...releaseWithLevel3,
  concepts: releaseWithLevel3.concepts.filter(c=>!c.id.startsWith("concept.gs028g.")),
  cases: releaseWithLevel3.cases.filter(c=>!c.id.startsWith("case.gs028g.")),
};
import {
  GS028_20261007_VARIETY2_CASES as cases,
  GS028_20261007_VARIETY2_TESTED_CONCEPTS as concepts,
  GS028_20261007_VARIETY2_TIMING_ENTRIES as timings,
  GS028_20261007_VARIETY2_BATCH_MANIFEST as manifest,
} from "./variety-batch";

const conceptIds = new Set(concepts.map((item) => item.id));
const caseIds = new Set(cases.map((item) => item.id));
const hash = (value: unknown) => createHash("sha256").update(`${JSON.stringify(value, null, 2)}\n`).digest("hex");

describe("GS-028 second October 7 additive runtime admission", () => {
  it("admits the accepted twenty concepts and eighty nodes once in the unapproved prototype", () => {
    expect(manifest).toMatchObject({ testedConceptCount: 20, questionVariantCount: 80, caseCount: 78, decisionNodeCount: 80, resultGateCount: 2, runtimeCaseProfileCount: 294, publicReleaseAuthorized: false });
    expect(release.publicationStatus).toBe("synthetic_unapproved_prototype");
    expect(release.concepts).toHaveLength(331);
    expect(release.cases).toHaveLength(1012);
    expect(release.cases.flatMap((item) => item.decisionNodes)).toHaveLength(1295);
    for (const item of concepts) expect(release.concepts.filter((entry) => entry.id === item.id)).toEqual([item]);
    for (const item of cases) expect(release.cases.filter((entry) => entry.id === item.id)).toEqual([item]);
  });

  it("preserves the complete prior 311-concept release byte-normalized, including every frozen-case field", () => {
    const oldRelease = {
      ...release,
      concepts: release.concepts.filter((item) => !conceptIds.has(item.id)),
      cases: release.cases.filter((item) => !caseIds.has(item.id)),
    };
    expect(oldRelease.concepts).toHaveLength(311);
    expect(oldRelease.cases).toHaveLength(934);
    expect(oldRelease.cases.flatMap((item) => item.decisionNodes)).toHaveLength(1215);
    // Independently captured from the complete active release before this batch was authored.
    expect(hash(oldRelease)).toBe("d9f1b176ee05ed551494583c78cfd385d50a59007d737d5b3391305be7da9970");
  });

  it("binds every new timing entry once and includes all twenty-six neutral test estimates", () => {
    let testCount = 0;
    for (const entry of timings) {
      expect(ANSWER_CHOICE_TIMING_REGISTRY.filter((item) => item.caseId === entry.caseId && item.nodeId === entry.nodeId && item.questionVariantId === entry.questionVariantId)).toEqual([entry]);
      const node = cases.find((item) => item.id === entry.caseId)!.decisionNodes.find((item) => item.id === entry.nodeId)!;
      if (entry.classification.kind !== "test_choices") continue;
      expect(entry.classification.choices.map((item) => [item.choiceId, item.choiceLabel]))
        .toEqual(node.answerChoices.map((item) => [item.id, item.label]));
      testCount += entry.classification.choices.filter((item) => item.timing.kind === "test").length;
    }
    expect(testCount).toBe(26);
  });
});
