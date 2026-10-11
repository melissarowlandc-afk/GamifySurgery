import { describe, expect, it } from "vitest";
import { PILOT_CLINICAL_RELEASE } from "../../pilot-content";
import { SYNTHETIC_CLINICAL_RELEASE } from "../../synthetic-content";
import { syntheticClinicalReleaseSchema, type SyntheticClinicalCase, type SyntheticClinicalRelease } from "../../schema";
import { VARIETY3_CASES, VARIETY3_TESTED_CONCEPTS } from "./variety3-batch";

/** Identical traversal/length rule to pilot-content.test.ts, with no new exceptions. */
function uniquelyLongestKeys(cases: SyntheticClinicalCase[]) {
  const seenQuestionVariantIds = new Set<string>();
  return cases.flatMap(clinicalCase => clinicalCase.decisionNodes.flatMap(node => {
    if (clinicalCase.id.startsWith("case.l2.")) return [];
    if (seenQuestionVariantIds.has(node.questionVariantId)) return [];
    seenQuestionVariantIds.add(node.questionVariantId);
    const correct = node.answerChoices.find(choice => choice.isCorrect);
    const longestDistractor = Math.max(...node.answerChoices.filter(choice => !choice.isCorrect).map(choice => choice.label.length));
    return correct && correct.label.length > longestDistractor ? [{ questionVariantId: node.questionVariantId, correctLength: correct.label.length, longestDistractor }] : [];
  }));
}

const withoutVariety3 = (release: SyntheticClinicalRelease) => ({ ...release,
  concepts: release.concepts.filter(item => !item.id.startsWith("concept.variety3.")),
  cases: release.cases.filter(item => !item.id.startsWith("case.variety3.")),
});

describe("admitted variety-3 against complete release validation and runtime length guard", () => {
  it("adds no stable-ID, meaning-string or case-ID collision to either existing release", () => {
    for (const release of [SYNTHETIC_CLINICAL_RELEASE, PILOT_CLINICAL_RELEASE]) {
      const baseline = withoutVariety3(release);
      const ids = new Set(baseline.concepts.map(item => item.id));
      const objectives = new Set(baseline.concepts.map(item => item.learningObjective.toLowerCase()));
      for (const item of VARIETY3_TESTED_CONCEPTS) { expect(ids.has(item.id)).toBe(false); expect(objectives.has(item.learningObjective.toLowerCase())).toBe(false); }
      const caseIds = new Set(baseline.cases.map(item => item.id));
      for (const item of VARIETY3_CASES) expect(caseIds.has(item.id)).toBe(false);
      expect(new Set(release.concepts.map(item => item.id)).size).toBe(release.concepts.length);
      expect(new Set(release.cases.map(item => item.id)).size).toBe(release.cases.length);
    }
  });

  it("passes the entire admitted release schema with exactly ten concepts and twenty cases added", () => {
    for (const release of [SYNTHETIC_CLINICAL_RELEASE, PILOT_CLINICAL_RELEASE]) {
      const baseline = withoutVariety3(release);
      const parsed = syntheticClinicalReleaseSchema.safeParse(release);
      expect(parsed.success, parsed.success ? "" : JSON.stringify(parsed.error.issues)).toBe(true);
      expect(release.concepts).toHaveLength(baseline.concepts.length + 10);
      expect(release.cases).toHaveLength(baseline.cases.length + 20);
      expect(release.publicationStatus).toBe("synthetic_unapproved_prototype");
    }
  });

  it("has zero draft longest-key violations and preserves the full release baseline exactly", () => {
    expect(uniquelyLongestKeys(VARIETY3_CASES)).toEqual([]);
    for (const release of [SYNTHETIC_CLINICAL_RELEASE, PILOT_CLINICAL_RELEASE]) {
      const baseline = uniquelyLongestKeys(withoutVariety3(release).cases);
      expect(uniquelyLongestKeys(release.cases)).toEqual(baseline);
      expect(baseline.some(item => item.questionVariantId.startsWith("question.variety3."))).toBe(false);
    }
  });
});
