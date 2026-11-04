import { describe, expect, it } from "vitest";
import { ANSWER_CHOICE_TIMING_REGISTRY, LEGACY_QUESTION_QUALITY_TIMING_ENTRIES, RETAINED_QUESTION_QUALITY_DRAFT_TIMING_ENTRIES, LEGACY_QUESTION_QUALITY_BATCH1_TIMING_ENTRIES, QUESTION_QUALITY_ADVERSARIAL_TIMING_ENTRIES, QUESTION_QUALITY_ADVERSARIAL_R3_TIMING_ENTRIES, QUESTION_QUALITY_ADVERSARIAL_R4_TIMING_ENTRIES, QUESTION_QUALITY_ADVERSARIAL_R5_TIMING_ENTRIES, QUESTION_QUALITY_ADVERSARIAL_R6_TIMING_ENTRIES, QUESTION_QUALITY_ADVERSARIAL_R7_TIMING_ENTRIES } from "./answer-choice-timing";
import { SYNTHETIC_CLINICAL_RELEASE } from "./synthetic-content";

describe("admitted answer-choice timing classification", () => {
  it("classifies every admitted node exactly once and freezes test-choice labels", () => {
    const nodes = SYNTHETIC_CLINICAL_RELEASE.cases.flatMap((clinicalCase) =>
      clinicalCase.decisionNodes.map((node) => ({ clinicalCase, node })),
    );
    expect(ANSWER_CHOICE_TIMING_REGISTRY).toHaveLength(nodes.length + LEGACY_QUESTION_QUALITY_TIMING_ENTRIES.length + RETAINED_QUESTION_QUALITY_DRAFT_TIMING_ENTRIES.length + LEGACY_QUESTION_QUALITY_BATCH1_TIMING_ENTRIES.length + QUESTION_QUALITY_ADVERSARIAL_TIMING_ENTRIES.length + QUESTION_QUALITY_ADVERSARIAL_R3_TIMING_ENTRIES.length + QUESTION_QUALITY_ADVERSARIAL_R4_TIMING_ENTRIES.length + QUESTION_QUALITY_ADVERSARIAL_R5_TIMING_ENTRIES.length + QUESTION_QUALITY_ADVERSARIAL_R6_TIMING_ENTRIES.length + QUESTION_QUALITY_ADVERSARIAL_R7_TIMING_ENTRIES.length);
    const identities = ANSWER_CHOICE_TIMING_REGISTRY.map(entry => JSON.stringify([entry.caseId, entry.nodeId, entry.questionVariantId]));
    expect(new Set(identities).size).toBe(identities.length);

    for (const { clinicalCase, node } of nodes) {
      const matches = ANSWER_CHOICE_TIMING_REGISTRY.filter(
        (entry) =>
          entry.caseId === clinicalCase.id &&
          entry.nodeId === node.id &&
          entry.questionVariantId === node.questionVariantId,
      );
      expect(matches, `${clinicalCase.id} / ${node.id}`).toHaveLength(1);
      const entry = matches[0]!;
      if (entry.classification.kind === "test_choices") {
        expect(entry.classification.choices).toEqual(
          node.answerChoices.map((choice) =>
            expect.objectContaining({
              choiceId: choice.id,
              choiceLabel: choice.label,
            }),
          ),
        );
        expect(entry.classification.choices.some((choice) => choice.timing.kind === "test")).toBe(true);
      }
    }
  });

  it("keeps diagnosis-only nodes untimed and explicitly classifies mixed choices", () => {
    const diagnosis = ANSWER_CHOICE_TIMING_REGISTRY.find(
      (entry) => entry.nodeId === "node.achalasia.water-and-solids.2",
    );
    expect(diagnosis?.classification).toEqual({ kind: "no_test" });

    const mixed = ANSWER_CHOICE_TIMING_REGISTRY.find(
      (entry) => entry.nodeId === "node.fhh.suggestive-results-confirmation.v1",
    );
    expect(mixed?.classification).toMatchObject({ kind: "test_choices" });
    if (mixed?.classification.kind === "test_choices") {
      expect(mixed.classification.choices.map((choice) => choice.timing.kind)).toEqual([
        "test",
        "no_test",
        "no_test",
        "no_test",
      ]);
    }
  });
});
