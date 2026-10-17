/// <reference types="node" />
import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { ANSWER_CHOICE_TIMING_REGISTRY } from "../../answer-choice-timing";
import { SYNTHETIC_CLINICAL_RELEASE as releaseWithLevel3 } from "../../synthetic-content";
// Keep this historical batch's inventory proof scoped to its original bank.
// Later-batch admission/protected-intake checks live in their own tests.
const release = { ...releaseWithLevel3,
  concepts: releaseWithLevel3.concepts.filter(c=>!c.id.startsWith("concept.gs028g.")&&!c.id.startsWith("concept.pediatric-clinic.")&&!c.id.startsWith("concept.variety3.")),
  cases: releaseWithLevel3.cases.filter(c=>!c.id.startsWith("case.gs028g.")&&!c.id.startsWith("case.pediatric-clinic.")&&!c.id.startsWith("case.variety3.")),
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
    expect(release.cases).toHaveLength(1008);
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
    expect(oldRelease.cases).toHaveLength(930);
    expect(oldRelease.cases.flatMap((item) => item.decisionNodes)).toHaveLength(1215);
    // Round 3, 2026-10-16: scoped GS-028 clinical anchors and wording only.
    // Restoring the 108 prior GS-028 cases reproduces the previous whole hash.
    // All non-GS-028 records retain hash 7e1918260ca1433b7695f6ea91144e09866b2db4fe18960acdcf7e2336a45a02.
    // Counts, IDs, stages, pairing, and execution are unchanged; see the ExecPlan.
    expect(hash(oldRelease)).toBe("ae2e3c2d2bd64d280632279f066508a12bb5905a96f4ef2c2c2812815b86f9ab");
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
