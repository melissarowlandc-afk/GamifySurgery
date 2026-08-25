import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ChartPanel } from "./ChartPanel";
import type { ChartView } from "./types";

const noop = () => undefined;

function questionChart(flagged = false): ChartView {
  return {
    id: "encounter.flag-preview",
    clinicalCaseId: "case.flag-preview",
    patientName: "Taylor Morgan",
    patientDetails: "Clinic patient",
    statusLabel: "Action required",
    presentation: "A patient presents for evaluation.",
    answerChoices: [],
    terminalFeedbackNeedsAcknowledgment: false,
    summaryAvailable: false,
    summaryVisible: false,
    canFile: false,
    readOnly: false,
    decisionSteps: [
      {
        id: "decision.flag-preview",
        questionVariantId: "question.flag-preview.v1",
        primaryConceptId: "concept.flag-preview",
        flaggedForDeveloperReview: flagged,
        heading: "Decision 1 of 1",
        questionPrompt: "What is the best next step?",
        answerChoices: [
          {
            id: "choice.one",
            label: "Appropriate care",
            selected: false,
            disabled: false,
          },
          {
            id: "choice.two",
            label: "A less appropriate alternative",
            selected: false,
            disabled: false,
          },
        ],
        current: true,
        complete: false,
      },
    ],
  };
}

describe("question developer-review flag", () => {
  it("shows a compact flag beside every displayed authored question", () => {
    const markup = renderToStaticMarkup(
      <ChartPanel
        chart={questionChart()}
        onClose={noop}
        onSubmitAnswer={noop}
        onFlagQuestion={noop}
        onAcknowledgeTerminalFeedback={noop}
        onToggleSummary={noop}
        onFileChart={noop}
      />,
    );

    expect(markup).toContain("What is the best next step?");
    expect(markup).toContain("Flag question");
    expect(markup).toContain(
      'aria-label="Flag this question for developer review"',
    );
  });

  it("renders an already-open flag as a disabled confirmed control", () => {
    const markup = renderToStaticMarkup(
      <ChartPanel
        chart={questionChart(true)}
        onClose={noop}
        onSubmitAnswer={noop}
        onFlagQuestion={noop}
        onAcknowledgeTerminalFeedback={noop}
        onToggleSummary={noop}
        onFileChart={noop}
      />,
    );

    expect(markup).toContain("Flagged");
    expect(markup).toContain(
      'aria-label="Question flagged for developer review"',
    );
    expect(markup).toContain("disabled");
  });
});
