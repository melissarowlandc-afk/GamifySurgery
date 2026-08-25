import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ChartPanel } from "./ChartPanel";
import type { ChartView } from "./types";

const noop = () => undefined;

function completedPilotChart(): ChartView {
  return {
    id: "encounter.preview",
    clinicalCaseId: "case.preview",
    patientName: "Taylor Morgan",
    patientDetails: "Clinic patient",
    statusLabel: "Encounter complete",
    presentation: "A completed pilot encounter.",
    answerChoices: [],
    terminalFeedbackNeedsAcknowledgment: false,
    summaryAvailable: true,
    summaryVisible: true,
    summaryBody: "Fallback summary.",
    canFile: true,
    readOnly: true,
    clinicalReview: {
      diagnosisId: "diagnosis.preview",
      diagnosisName: "Preview diagnosis",
      sections: [
        {
          id: "what-it-is",
          heading: "What it is",
          body: "An independently written summary.",
          evidenceClaimIds: ["claim.preview"],
        },
      ],
      claims: [
        {
          id: "claim.preview",
          statement: "An atomic factual statement.",
          reviewStatus: "needs_clinician_review",
        },
      ],
      sources: [
        {
          id: "source.preview",
          title: "Official preview guidance",
          organizationOrJournal: "Example Agency",
          year: 2026,
          href: "https://example.gov/guidance",
          supportedClaimIds: ["claim.preview"],
          reuseStatus: "Government-authored text; attribution required.",
          lastChecked: "2026-07-29",
        },
      ],
      contentVersion: "pilot.test.1",
      reviewStatus: "needs_clinician_review",
    },
  };
}

describe("completed chart clinical review", () => {
  it("shows source-linked claims only on the available chart back", () => {
    const markup = renderToStaticMarkup(
      <ChartPanel
        chart={completedPilotChart()}
        onClose={noop}
        onSubmitAnswer={noop}
        onFlagQuestion={noop}
        onAcknowledgeTerminalFeedback={noop}
        onToggleSummary={noop}
        onFileChart={noop}
      />,
    );

    expect(markup).toContain("Preview diagnosis");
    expect(markup).toContain("Sources &amp; Clinical Review (1)");
    expect(markup).toContain("Official preview guidance");
    expect(markup).toContain("claim.preview");
    expect(markup).toContain("needs clinician review");
    expect(markup).toContain('target="_blank"');
    expect(markup).toContain('rel="noopener noreferrer"');
    expect(markup).not.toContain("Fallback summary.");
  });
});
