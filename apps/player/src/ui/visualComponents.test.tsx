import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { TutorialCoach } from "./TutorialCoach";
import { ChartPanel } from "./ChartPanel";
import { PatientLists } from "./PatientLists";
import { ResourceBar } from "./ResourceBar";
import type { ChartView, ResourceBarView } from "./types";

const noop = () => undefined;

describe("paper chart presentation", () => {
  it("shows the compact patient header, reviewable decisions, and separate encounter rewards", () => {
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
      statusLabel: "Action required",
      presentation: "Three days of worsening localized pain.",
      answerChoices: [],
      terminalFeedbackNeedsAcknowledgment: false,
      summaryAvailable: true,
      summaryVisible: false,
      summaryBody: "A concise disease summary.",
      canFile: false,
      readOnly: false,
      reward: {
        heading: "Decisions Correct: 1/1",
        moneyLabel: "Encounter Payment: +$75",
        xpLabel: "Encounter XP: +20",
      },
      decisionSteps: [
        {
          id: "decision-0",
          heading: "Decision 1 of 2",
          questionPrompt: "Which test should be ordered?",
          answerChoices: [],
          feedbackTitle: "Correct",
          feedbackBody: "The requested result was obtained.",
          collapsedResultLabel: "Correct · Chest X-ray ordered",
          current: false,
          complete: true,
        },
        {
          id: "decision-1",
          heading: "Decision 2 of 2",
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
    expect(markup).toContain("Flip for More Disease Information");
    expect(markup).toContain(
      "Decision 1 Result — Correct · Chest X-ray ordered",
    );
    expect(markup).toContain("Decisions Correct: 1/1");
    expect(markup).toContain("Encounter Payment: +$75");
    expect(markup).toContain("Encounter XP: +20");
    expect(markup.match(/Action required/g)).toHaveLength(1);
    expect(markup).not.toContain("Outpatient clinic");
    expect(markup).not.toMatch(/Step [0-9]/);
  });
});

describe("patient chart tabs", () => {
  it("shows only the persistent portrait, name, and satisfaction indicator", () => {
    const markup = renderToStaticMarkup(
      <PatientLists
        patients={[
          {
            id: "encounter-1",
            name: "Morgan Reyes",
            subtitle: "42 years · Female",
            folder: "waiting",
            statusLabel: "Clinic patient",
            actionRequired: true,
            selected: false,
            satisfactionPercent: 94,
            patienceLabel: "Waiting 38 min",
          },
        ]}
        onOpen={noop}
      />,
    );

    expect(markup).toContain("Morgan Reyes");
    expect(markup).toContain("Satisfaction 94%");
    expect(markup.match(/Action required/g)).toHaveLength(1);
    expect(markup).not.toContain("42 years");
    expect(markup).not.toContain("Female");
    expect(markup).not.toContain("Clinic patient");
    expect(markup).not.toContain("Waiting 38 min");
  });
});

describe("tutorial controls", () => {
  it("always offers acknowledgment and tutorial opt-out without performing the highlighted action", () => {
    const markup = renderToStaticMarkup(
      <TutorialCoach
        step={{
          id: "first-decision",
          eyebrow: "Level 0 tutorial",
          title: "Read across the chart, then choose",
          body: "",
          target: "answer-choices",
          targetSelector: ".answer-list",
        }}
        onAction={noop}
        onDisableTutorials={noop}
      />,
    );

    expect(markup).toContain("Got It");
    expect(markup).toContain("Turn off tutorials");
    expect(markup).not.toContain("Enact Plan");
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
