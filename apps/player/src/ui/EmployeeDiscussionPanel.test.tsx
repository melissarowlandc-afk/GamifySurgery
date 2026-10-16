import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { EmployeeDiscussionPanel, employeeDiscussionChartView } from "./EmployeeDiscussionPanel";
import type { EmployeeDiscussionView } from "./types";

const base: EmployeeDiscussionView = {
  id: "d", employeeName: "Ari", roleLabel: "Nurse", status: "question", topicLabel: "Methods huddle",
  presentation: "Team review", reviewStatus: "Needs clinician review", question: "Choose",
  choices: [{ id: "a", label: "Option", selected: false, disabled: false }, { id: "b", label: "Other", selected: false, disabled: false }],
  finalStep: true,
};
const answered: EmployeeDiscussionView = {
  ...base, status: "feedback", feedbackTitle: "Incorrect", feedback: "Teaching text", correctAnswerText: "Option",
  choices: [
    { id: "a", label: "Option", selected: false, disabled: true, revealedCorrect: true },
    { id: "b", label: "Other", selected: true, disabled: true, revealedCorrect: false },
  ],
};
const props = { onAnswer: vi.fn(), onAcknowledge: vi.fn(), onFile: vi.fn(), onClose: vi.fn() };
const render = (discussion: EmployeeDiscussionView) =>
  renderToStaticMarkup(<EmployeeDiscussionPanel discussion={discussion} {...props} />);

describe("EmployeeDiscussionPanel", () => {
  it("uses the chart sheet with employee identity and no patient-only fields", () => {
    const html = render(base);
    expect(html).toContain("chart-sheet");
    expect(html).toContain('aria-label="Ari team discussion"');
    expect(html).toContain("Nurse");
    expect(html).toContain("Methods huddle");
    expect(html).toContain("cs-story");
    expect(html).toContain("cs-decisions");
    expect(html).not.toMatch(/vitals|Satisfaction|Patient is away/i);
  });

  it("keeps answers available while the founder walks over", () => {
    const html = render({ ...base, status: "traveling" });
    expect(html).toContain("Founder walking over");
    expect(html).toMatch(/<button class="cs-answer"[^>]*>(?:(?!disabled).)*Option/);
  });

  it("shows feedback beneath the answered choices on the same sheet", () => {
    const html = render(answered);
    expect(html).toContain("Team review");
    expect(html).toContain("Choose");
    expect(html).toContain("Your answer ✕");
    expect(html).toContain("Correct answer");
    expect(html).toContain("Teaching text");
    expect(html).toContain("File discussion");
    expect(html).not.toContain("Discussion summary");
    expect(html.indexOf("Your answer ✕")).toBeLessThan(html.indexOf("Teaching text"));
  });

  it("continues instead of filing when another step remains", () => {
    expect(employeeDiscussionChartView({ ...answered, finalStep: false }).primaryActionLabel).toBe("Continue");
  });

  it("files a reopened completed discussion from the chart front", () => {
    const view = employeeDiscussionChartView({ ...answered, status: "summary" });
    expect(view.canFile).toBe(true);
    expect(view.summaryAvailable).toBe(false);
    const html = render({ ...answered, status: "summary" });
    expect(html).toContain("Discussion complete");
    expect(html).toContain("File discussion");
    expect(html).toContain("Teaching text");
  });
});
