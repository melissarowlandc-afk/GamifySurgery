import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { AnsweredChoices, ChartPanel } from "./ChartPanel";
import { employeeDiscussionChartView } from "./EmployeeDiscussionPanel";
import type { AnswerChoiceView, ChartDecisionStepView, ChartView } from "./types";

const choices: AnswerChoiceView[] = [
  { id: "key", label: "First option", selected: false, disabled: true, revealedCorrect: true, rationale: "The first option fits the observations." },
  { id: "pick", label: "Second option", selected: true, disabled: true, rationale: "The second option uses a different comparison." },
  { id: "third", label: "Third option", selected: false, disabled: true, rationale: "The third option omits an observation." },
  { id: "fourth", label: "Fourth option", selected: false, disabled: true, rationale: "The fourth option changes the question." },
];
const step: ChartDecisionStepView = {
  id: "decision", heading: "Decision 1 of 1", questionPrompt: "Which option fits the observations?",
  answerChoices: choices, feedbackTitle: "Incorrect", feedbackBody: "Legacy fallback explanation.",
  teachingPoint: "Compare the observations using the stated question.", current: true, complete: false,
};
const chart: ChartView = {
  id: "chart.structured", patientName: "QA Patient", patientDetails: "Clinic patient",
  statusLabel: "Action required", presentation: "A short scenario.", answerChoices: [],
  terminalFeedbackNeedsAcknowledgment: true, summaryAvailable: false, summaryVisible: false,
  canFile: false, readOnly: false, decisionSteps: [step],
};
const props = {
  onClose: vi.fn(), onSubmitAnswer: vi.fn(), onFlagQuestion: vi.fn(),
  onAcknowledgeTerminalFeedback: vi.fn(), onToggleSummary: vi.fn(), onFileChart: vi.fn(),
};
const render = (view = chart) => renderToStaticMarkup(<ChartPanel chart={view} {...props} />);
const exhibits: NonNullable<ChartDecisionStepView["exhibit"]>[] = [
  { kind: "table", caption: "Example observations", columnHeaders: ["Group A", "Group B"], rowHeaders: ["First observation", "Second observation"], cells: [["10", "20"], ["30", "40"]] },
  { kind: "keyValue", caption: "Example values", items: [{ label: "First group", value: "10" }, { label: "Second group", value: "20" }] },
  { kind: "abstract", title: "Example study", body: "A short original summary of the observations." },
];

describe("structured chart exhibits", () => {
  it.each(exhibits)("renders $kind teaching data in the story column", (exhibit) => {
    const html = render({ ...chart, decisionSteps: [{ ...step, exhibit }] });
    expect(html).toContain("Teaching dataset");
    expect(html.indexOf('class="cs-exhibit"')).toBeGreaterThan(html.indexOf('class="cs-story"'));
    expect(html.indexOf('class="cs-exhibit"')).toBeLessThan(html.indexOf('class="cs-decisions"'));
    if (exhibit.kind === "table") {
      expect(html).toContain("<caption>Example observations</caption>");
      expect(html).toContain('<th scope="col">Group A</th>');
      expect(html).toContain('<th scope="row">First observation</th><td>10</td><td>20</td>');
      expect(html).toMatch(/class="cs-exhibit-table" tabindex="0" role="region"/);
    } else if (exhibit.kind === "keyValue") {
      expect(html).toContain("<dt>First group</dt><dd>10</dd>");
    } else {
      expect(html).toContain("<h4>Example study</h4><p>A short original summary of the observations.</p>");
    }
  });

  it("labels multiple visited nodes' datasets with their decision headings", () => {
    const html = render({ ...chart, decisionSteps: [
      { ...step, id: "earlier", heading: "Decision 1 of 2", current: false, complete: true, exhibit: exhibits[0] },
      { ...step, heading: "Decision 2 of 2", exhibit: exhibits[1] },
    ] });
    expect(html.match(/Teaching dataset/g)).toHaveLength(2);
    expect(html).toContain('class="cs-exhibit-step">Decision 1 of 2');
    expect(html).toContain('class="cs-exhibit-step">Decision 2 of 2');
  });
});

describe("structured chart feedback", () => {
  it("shows the teaching point followed by why the selected wrong answer does not fit", () => {
    const html = render();
    expect(html).toContain("Why not your pick");
    expect(html).not.toContain(step.feedbackBody);
    expect(html.indexOf(step.teachingPoint!)).toBeLessThan(html.indexOf("Why not your pick"));
    expect(html.indexOf("Why not your pick")).toBeLessThan(html.indexOf(choices[1]!.rationale!));
    expect(html).not.toContain(choices[2]!.rationale);
    expect(html).toContain("Show all 4 choices");
  });

  it("shows the chosen correct answer's rationale without a wrong-pick heading", () => {
    const html = render({ ...chart, decisionSteps: [{ ...step, feedbackTitle: "Correct", answerChoices: choices.map((choice) => ({ ...choice, selected: choice.id === "key" })) }] });
    expect(html).toContain("Why this answer");
    expect(html).toContain(choices[0]!.rationale);
    expect(html).not.toContain("Why not your pick");
  });

  it("withholds rationales and teaching feedback while an answer is still open", () => {
    const html = render({ ...chart, terminalFeedbackNeedsAcknowledgment: false, decisionSteps: [{
      ...step, teachingPoint: undefined, feedbackBody: undefined, feedbackTitle: undefined,
      answerChoices: choices.map((choice) => ({ ...choice, selected: false, disabled: false, revealedCorrect: undefined })),
    }] });
    expect(html).toContain('class="cs-answers is-open"');
    for (const choice of choices) expect(html).not.toContain(choice.rationale);
    expect(html).not.toContain("Why this choice");
    expect(html).not.toContain("cs-feedback");
  });

  it("falls back to the saved explanation when structured feedback is absent", () => {
    const html = render({ ...chart, decisionSteps: [{ ...step, teachingPoint: undefined, answerChoices: choices.map(({ rationale: _rationale, ...choice }) => choice) }] });
    expect(html).toContain(step.feedbackBody);
    expect(html).not.toContain("Why not your pick");
    expect(html).not.toContain("Teaching dataset");
  });

  it("preserves structured feedback on a reopened past decision", () => {
    const html = render({ ...chart, decisionSteps: [{ ...step, current: false, complete: true }], canFile: true, readOnly: true });
    expect(html).toContain('class="cs-past"');
    expect(html).toContain(step.teachingPoint);
    expect(html).toContain(choices[1]!.rationale);
  });

  it("carries structured fields through the employee discussion adapter onto the same sheet", () => {
    const view = employeeDiscussionChartView({
      id: "discussion", employeeName: "QA Colleague", roleLabel: "Nurse", status: "feedback",
      presentation: "A team scenario.", reviewStatus: "needs_clinician_review", question: step.questionPrompt,
      choices, feedbackTitle: "Incorrect", feedback: step.feedbackBody, teachingPoint: step.teachingPoint,
      exhibit: exhibits[0], finalStep: true,
    });
    const html = render(view);
    expect(html).toContain('aria-label="QA Colleague team discussion"');
    expect(html).toContain("Teaching dataset");
    expect(html).toContain(step.teachingPoint);
    expect(html).toContain("Why not your pick");
    expect(html).toContain("File discussion");
  });
});

describe("all-choices rationale reveals", () => {
  it("offers a closed native rationale reveal under each choice only after showing all choices", () => {
    const html = renderToStaticMarkup(<AnsweredChoices choices={choices} feedbackTitle="Incorrect" showAll onToggleShowAll={vi.fn()} />);
    expect(html.match(/<details class="cs-choice-rationale">/g)).toHaveLength(4);
    expect(html.match(/<summary>Why this choice<\/summary>/g)).toHaveLength(4);
    for (const choice of choices) {
      expect(html).toContain(choice.label);
      expect(html).toContain(choice.rationale);
    }
    expect(html).not.toContain("open=");
    expect(html).toContain("Hide other choices");
  });

  it("keeps the compact picked/key rows when other choices are hidden", () => {
    const html = renderToStaticMarkup(<AnsweredChoices choices={choices} feedbackTitle="Incorrect" showAll={false} onToggleShowAll={vi.fn()} />);
    expect(html).toContain("First option");
    expect(html).toContain("Second option");
    expect(html).not.toContain("Third option");
    expect(html).not.toContain("Why this choice");
  });

  it("shows legacy all-choice rows without empty rationale controls", () => {
    const html = renderToStaticMarkup(<AnsweredChoices choices={choices.map(({ rationale: _rationale, ...choice }) => choice)} feedbackTitle="Incorrect" showAll onToggleShowAll={vi.fn()} />);
    expect(html).toContain("Fourth option");
    expect(html).not.toContain("Why this choice");
  });
});
