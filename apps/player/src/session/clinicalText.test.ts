import { describe, expect, it } from "vitest";
import { splitClinicalDecisionStem } from "./clinicalText";

describe("clinical chart text separation", () => {
  it("keeps a question-only stem unchanged", () => {
    expect(
      splitClinicalDecisionStem("What evaluation should be obtained next?"),
    ).toEqual({ question: "What evaluation should be obtained next?" });
  });

  it("removes a repeated patient vignette from above the answer choices", () => {
    expect(
      splitClinicalDecisionStem(
        "A patient returns to finalize elective repair of a stable hernia. The patient continues to have poorly controlled COPD symptoms. Which plan is most appropriate?",
      ),
    ).toEqual({
      context:
        "A patient returns to finalize elective repair of a stable hernia. The patient continues to have poorly controlled COPD symptoms.",
      question: "Which plan is most appropriate?",
    });
  });

  it("preserves later-step findings as context while isolating the question", () => {
    expect(
      splitClinicalDecisionStem(
        "Targeted ultrasound shows a concordant simple cyst. It causes persistent focal discomfort. What is the most appropriate initial procedure?",
      ),
    ).toEqual({
      context:
        "Targeted ultrasound shows a concordant simple cyst. It causes persistent focal discomfort.",
      question: "What is the most appropriate initial procedure?",
    });
  });

  it("handles a question clause after a comma", () => {
    expect(
      splitClinicalDecisionStem(
        "With these results available, what is the next step?",
      ),
    ).toEqual({
      context: "With these results available,",
      question: "what is the next step?",
    });
  });
});
