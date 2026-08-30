import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { ChartPanel } from "./ChartPanel";

describe("ChartPanel current updates", () => {
  it("renders the authored update once above the newly active decision", () => {
    const markup = renderToStaticMarkup(
      <ChartPanel
        chart={{
          id: "chart.level-two",
          patientName: "Test Patient",
          patientDetails: "Clinic patient",
          statusLabel: "Decision required",
          presentation: "Original presentation remains here.",
          answerChoices: [],
          terminalFeedbackNeedsAcknowledgment: false,
          summaryAvailable: false,
          summaryVisible: false,
          canFile: false,
          readOnly: false,
          decisionSteps: [
            { id: "first", heading: "Decision 1 of 2", answerChoices: [], current: false, complete: true },
            {
              id: "second",
              heading: "Decision 2 of 2",
              questionPrompt: "Newly active decision",
              currentUpdate: "Authored distal result update.",
              answerChoices: [], current: true, complete: false,
            },
          ],
        }}
        onClose={vi.fn()} onSubmitAnswer={vi.fn()} onFlagQuestion={vi.fn()}
        onAcknowledgeTerminalFeedback={vi.fn()} onToggleSummary={vi.fn()} onFileChart={vi.fn()}
      />,
    );

    expect(markup.match(/Authored distal result update\./g)).toHaveLength(1);
    expect(markup).toContain("Current update");
    expect(markup).toContain("Original presentation remains here.");
  });

  it("keeps the legacy presentation-derived update when no authored update exists", () => {
    const markup = renderToStaticMarkup(
      <ChartPanel
        chart={{
          id: "chart.legacy", patientName: "Test Patient", patientDetails: "Clinic patient",
          statusLabel: "Decision required", presentation: "Original presentation.",
          presentationUpdate: "Legacy derived context.", answerChoices: [],
          terminalFeedbackNeedsAcknowledgment: false, summaryAvailable: false,
          summaryVisible: false, canFile: false, readOnly: false,
          decisionSteps: [{ id: "legacy", heading: "Decision 2 of 2", questionPrompt: "Current decision", answerChoices: [], current: true, complete: false }],
        }}
        onClose={vi.fn()} onSubmitAnswer={vi.fn()} onFlagQuestion={vi.fn()}
        onAcknowledgeTerminalFeedback={vi.fn()} onToggleSummary={vi.fn()} onFileChart={vi.fn()}
      />,
    );
    expect(markup.match(/Legacy derived context\./g)).toHaveLength(1);
    expect(markup).toContain("Current update");
  });
});
