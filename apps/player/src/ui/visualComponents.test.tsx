import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ChartPanel } from "./ChartPanel";
import { ResourceBar } from "./ResourceBar";
import type { ChartView, ResourceBarView } from "./types";

const noop = () => undefined;

describe("paper chart presentation", () => {
  it("shows approved chart context without exposing question counts", () => {
    const chart: ChartView = {
      id: "chart-1",
      patientName: "Morgan Reyes",
      patientDetails: "Outpatient clinic",
      ageLabel: "42 years",
      sexLabel: "Female",
      chiefComplaint: "Painful swelling",
      patientSatisfactionLabel: "94%",
      vitals: [
        {
          id: "temperature",
          label: "Temp",
          value: "38.1 C",
          icon: "temperature",
        },
      ],
      statusLabel: "Question 2 of 2",
      presentation: "Three days of worsening localized pain.",
      answerChoices: [],
      terminalFeedbackNeedsAcknowledgment: false,
      summaryAvailable: true,
      summaryVisible: false,
      summaryBody: "A concise disease summary.",
      canFile: false,
      readOnly: false,
      decisionSteps: [
        {
          id: "decision-1",
          heading: "Choose management",
          questionPrompt: "What is the best next step?",
          answerChoices: [
            {
              id: "choice-1",
              label: "Incision and drainage",
              selected: false,
              disabled: false,
            },
          ],
          feedbackTitle: "Correct",
          feedbackBody: "Source control is required.",
          rewardLabel: "+10 learning XP",
          current: true,
          complete: false,
        },
      ],
    };

    const markup = renderToStaticMarkup(
      <ChartPanel
        chart={chart}
        onClose={noop}
        onSubmitAnswer={noop}
        onAcknowledgeTerminalFeedback={noop}
        onToggleSummary={noop}
        onFileChart={noop}
      />,
    );

    expect(markup).toContain("paper-chart");
    expect(markup).toContain("Morgan Reyes");
    expect(markup).toContain("Chief complaint");
    expect(markup).toContain("38.1 C");
    expect(markup).toContain("Satisfaction 94%");
    expect(markup).toContain("+10 learning XP");
    expect(markup).toContain("Flip for more disease information");
    expect(markup).toContain("Clinical decision");
    expect(markup).not.toContain("Question 2 of 2");
    expect(markup).not.toMatch(/Step [0-9]/);
  });
});

describe("segmented resource HUD", () => {
  it("keeps money, learning, satisfaction, time, and controls distinct", () => {
    const view: ResourceBarView = {
      moneyLabel: "$350",
      moneyDeltaLabel: "-$12/hour",
      xpLabel: "20 XP",
      satisfactionLabel: "94%",
      facilityTimeLabel: "Day 1, 9 AM",
      workloadLabel: "1 waiting",
      workloadStatusLabel: "Stable",
      facilityLevelLabel: "Level 0",
      xpProgressPercent: 50,
      goals: [],
    };

    const markup = renderToStaticMarkup(
      <ResourceBar
        view={view}
        paused={false}
        onTogglePause={noop}
        onSaveAndClose={noop}
      />,
    );

    expect(markup).toContain("resource-bar-redesign");
    expect(markup).toContain("pixel-hud-icon is-learning");
    expect(markup).toContain("pixel-hud-icon is-money");
    expect(markup).toContain(
      "pixel-hud-icon is-satisfaction is-happy",
    );
    expect(markup).toContain("pixel-hud-icon is-time");
    expect(markup).toContain(
      'class="pixel-control-button pause-button" type="button" aria-label="Pause facility time" aria-pressed="false"',
    );
    expect(markup).toContain(
      'class="pixel-control-button is-selected" type="button" aria-label="Resume facility time" aria-pressed="true"',
    );
    expect(markup).toContain("$350");
    expect(markup).toContain("20 XP");
  });
});
