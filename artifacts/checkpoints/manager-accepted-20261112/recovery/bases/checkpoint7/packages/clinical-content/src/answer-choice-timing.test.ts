import { describe, expect, it } from "vitest";
import { ANSWER_CHOICE_TIMING_REGISTRY } from "./answer-choice-timing";
import { SYNTHETIC_CLINICAL_RELEASE } from "./synthetic-content";

describe("admitted answer-choice timing classification", () => {
  it("classifies every admitted node exactly once and freezes test-choice labels", () => {
    const nodes = SYNTHETIC_CLINICAL_RELEASE.cases.flatMap((clinicalCase) =>
      clinicalCase.decisionNodes.map((node) => ({ clinicalCase, node })),
    );
    expect(ANSWER_CHOICE_TIMING_REGISTRY).toHaveLength(nodes.length);

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
