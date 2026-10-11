import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { ChartDecisionStepView, ChartView, EmployeeDiscussionView } from "../ui/types";
import { MobileChart, MobileTeamDiscussion } from "./MobileChart";
import { allElements, cleanupPhoneTests, noop, phoneTestDom } from "./screenTestUtils";

const frozenChoices = [
  { id: "frozen.choice.z", label: "Test Z", selected: false, disabled: false, etaLabel: "30 min", detailLabel: "20 min processing · 10 min return (game estimate)" },
  { id: "frozen.choice.a", label: "Test A", selected: false, disabled: false, etaLabel: "1 hr", detailLabel: "1 hr off-site (game estimate)" },
  { id: "frozen.choice.q", label: "Other option", selected: false, disabled: false },
  { id: "frozen.choice.b", label: "Test B", selected: false, disabled: true, etaLabel: "2 hr", detailLabel: "2 hr waiting for capacity (game estimate)" },
];
export function chartFixture(overrides: Partial<ChartView> = {}): ChartView {
  return { id: "phone-chart", patientName: "Fixture Person", patientDetails: "41 · Female", ageLabel: "41", sexLabel: "Female",
    chiefComplaint: "Fixture visit", statusLabel: "Action required", presentation: "Fixture presentation story.",
    patientSatisfactionLabel: "Satisfaction 87%", questionPrompt: "Which fixture test should Fixture Person receive next?", answerChoices: frozenChoices,
    terminalFeedbackNeedsAcknowledgment: false, summaryAvailable: false, summaryVisible: false, canFile: false, readOnly: false, ...overrides };
}
const callbacks = () => ({ onClose: vi.fn(), onSubmitAnswer: vi.fn(), onFlagQuestion: vi.fn(),
  onAcknowledgeTerminalFeedback: vi.fn(), onToggleSummary: vi.fn(), onFileChart: vi.fn() });
afterEach(cleanupPhoneTests);

describe("phone-native chart", () => {
  it("shows identity and the presentation before the fully stated task; has no keyboard/hover hint", () => {
    const markup = renderToStaticMarkup(<MobileChart chart={chartFixture()} {...callbacks()} />);
    for (const label of ["Fixture Person", "41 · Female", "Fixture visit", "Satisfaction 87%", "Action required"]) expect(markup).toContain(label);
    expect(markup.indexOf("Fixture presentation story.")).toBeLessThan(markup.indexOf("Which fixture test"));
    expect(markup).not.toMatch(/Press 1|hover a wait|<kbd|chart-sheet/);
  });
  it("renders frozen choices in their displayed order and submits their exact IDs", async () => {
    const env = phoneTestDom(); const actions = callbacks();
    await env.render(<MobileChart chart={chartFixture()} {...actions} />);
    const buttons = allElements(env.element, (node) => node.attributes["data-choice-id"] !== undefined);
    expect(buttons.map((node) => node.attributes["data-choice-id"])).toEqual(frozenChoices.map((choice) => choice.id));
    for (const node of buttons.slice(0, 3)) await env.clickElement(node);
    expect(actions.onSubmitAnswer.mock.calls).toEqual(frozenChoices.slice(0, 3).map((choice) => [choice.id]));
    expect(buttons[3]!.attributes.disabled).toBe("");
    expect(actions.onClose).not.toHaveBeenCalled();
  });
  it("shows an estimate and visible breakdown on every testing choice, including a disabled distractor", async () => {
    const env = phoneTestDom(); await env.render(<MobileChart chart={chartFixture()} {...callbacks()} />);
    const buttons = allElements(env.element, (node) => node.attributes["data-choice-id"] !== undefined);
    for (const choice of frozenChoices.filter((choice) => choice.etaLabel)) {
      const button = buttons.find((node) => node.attributes["data-choice-id"] === choice.id)!;
      expect(button.textContent).toContain(`Wait estimate: ${choice.etaLabel}`);
      expect(button.textContent).toContain(choice.detailLabel);
      expect(allElements(button, (node) => node.attributes.hidden !== undefined || node.attributes.title !== undefined)).toHaveLength(0);
    }
    expect(env.element.textContent).not.toContain("Correct answer");
  });
  it.each([
    { name: "terminal feedback", chart: { terminalFeedbackNeedsAcknowledgment: true, primaryActionLabel: "Enact Plan" }, callback: "onAcknowledgeTerminalFeedback" },
    { name: "feedback that closes", chart: { terminalFeedbackNeedsAcknowledgment: true, primaryActionClosesChart: true, primaryActionLabel: "Enact Corrected Plan" }, callback: "onClose" },
    { name: "completed chart", chart: { canFile: true, primaryActionLabel: "Resolve Completed Chart" }, callback: "onFileChart" },
    { name: "resolved chart", chart: { canFile: true, readOnly: true, primaryActionLabel: "Close Resolved Chart" }, callback: "onFileChart" },
    { name: "pending chart", chart: { pendingLabel: "Fixture results pending", primaryActionLabel: "Return to clinic" }, callback: "onClose" },
  ] as const)("pins the shared primary action for $name", async ({ chart, callback }) => {
    const env = phoneTestDom(); const actions = callbacks();
    await env.render(<MobileChart chart={chartFixture(chart)} {...actions} />);
    const button = env.button(chart.primaryActionLabel);
    expect(button.parentNode?.tagName).toBe("FOOTER");
    await env.clickElement(button); expect(actions[callback]).toHaveBeenCalledOnce();
    for (const [key, action] of Object.entries(actions)) if (key !== callback) expect(action).not.toHaveBeenCalled();
  });
  it("preserves feedback-action precedence over filing, and never resubmits answered choices", async () => {
    const env = phoneTestDom(); const actions = callbacks();
    await env.render(<MobileChart chart={chartFixture({ canFile: true, terminalFeedbackNeedsAcknowledgment: true,
      feedbackTitle: "Incorrect", feedbackBody: "Fixture feedback.", teachingPoint: "Fixture teaching point.",
      answerChoices: frozenChoices.map((choice, index) => ({ ...choice, selected: index === 0, revealedCorrect: index === 1, rationale: "Fixture choice explanation." })) })} {...actions} />);
    expect(env.element.textContent).toContain("Fixture feedback."); expect(env.element.textContent).toContain("Fixture teaching point.");
    expect(env.element.textContent).toContain("Your answer ✕"); expect(env.element.textContent).toContain("Correct answer");
    expect(allElements(env.element, (node) => node.attributes["data-choice-id"] !== undefined).every((node) => node.attributes.disabled === "")).toBe(true);
    await env.click("Continue"); expect(actions.onAcknowledgeTerminalFeedback).toHaveBeenCalledOnce(); expect(actions.onFileChart).not.toHaveBeenCalled();
  });
  it("flags only the current frozen question by decision ID where the desktop offers it", async () => {
    const env = phoneTestDom(); const actions = callbacks();
    const step: ChartDecisionStepView = { id: "frozen.decision.2", questionVariantId: "frozen.variant.7", heading: "Decision 2 of 3", current: true, complete: false,
      questionPrompt: "Which fixture test is next?", answerChoices: frozenChoices };
    await env.render(<MobileChart chart={chartFixture({ decisionSteps: [{ ...step, id: "past", current: false }, step] })} {...actions} />);
    expect(allElements(env.element, (node) => node.attributes["aria-label"] === "Flag this question for developer review")).toHaveLength(1);
    await env.click("Flag this question for developer review"); expect(actions.onFlagQuestion).toHaveBeenCalledWith("frozen.decision.2");
    await env.render(<MobileChart chart={chartFixture({ decisionSteps: [{ ...step, flaggedForDeveloperReview: true }] })} {...actions} />);
    expect(env.button("Question flagged for developer review").attributes.disabled).toBe("");
  });
  it("keeps feedback readable when the projection marks a decision non-current while enactment is pending", async () => {
    const env = phoneTestDom();
    await env.render(<MobileChart chart={chartFixture({ terminalFeedbackNeedsAcknowledgment: true, primaryActionLabel: "Enact Plan", decisionSteps: [{
      id: "fixture.enactment", heading: "Fixture plan", current: false, complete: false, questionPrompt: "Which fixture test is next?",
      answerChoices: frozenChoices.map((choice, index) => ({ ...choice, disabled: true, selected: index === 0 })), feedbackTitle: "Correct", feedbackBody: "Fixture enactment feedback.",
    }] })} {...callbacks()} />);
    expect(env.find((node) => node.attributes.class === "mobile-decision is-past").attributes.open).toBe("");
    expect(env.element.textContent).toContain("Fixture enactment feedback."); expect(env.button("Enact Plan")).toBeDefined();
  });
  it("retains result phases, updates, vitals, exhibits, outcome and rewards", () => {
    const markup = renderToStaticMarkup(<MobileChart chart={chartFixture({
      vitals: [{ id: "fixture-vital", label: "Fixture vital", value: "Recorded" }], presentationUpdate: "Fixture later finding.",
      pendingLabel: "Fixture pending.", pendingPatientIsAway: false, pendingSummary: "Fixture processing.", etaLabel: "30 min",
      pendingPhases: [{ label: "Fixture phase", location: "onsite", progressLabel: "In progress", delayLabel: "Waiting for capacity", complete: false }],
      exhibit: { kind: "keyValue", caption: "Fixture exhibit", items: [{ label: "Fixture field", value: "Recorded" }] },
      terminalOutcomeTitle: "Fixture outcome", terminalOutcomeBody: "Fixture outcome body.", reward: { heading: "Fixture rewards", moneyLabel: "+$1", xpLabel: "+1 XP" },
    })} {...callbacks()} />);
    for (const label of ["Fixture vital", "Fixture later finding.", "Fixture processing.", "Patient is in clinic", "Fixture phase", "Waiting for capacity", "Fixture exhibit", "Fixture outcome body.", "+1 XP"]) expect(markup).toContain(label);
  });
  it("keeps clinical reference and claim metadata behind completion, with safe new-tab links", async () => {
    const env = phoneTestDom(); const actions = callbacks();
    const review: NonNullable<ChartView["clinicalReview"]> = { diagnosisId: "fixture-only", diagnosisName: "Fixture summary", contentVersion: "fixture.v1", reviewStatus: "needs_clinician_review",
      sections: [{ id: "fixture.section", heading: "Fixture heading", body: "Fixture summary body.", evidenceClaimIds: ["fixture.claim"] }],
      claims: [{ id: "fixture.claim", statement: "Fixture claim text.", reviewStatus: "needs_clinician_review" }],
      sources: [{ id: "fixture.source", title: "Synthetic test reference", organizationOrJournal: "Fixture only", year: 2026, href: "https://example.org/fixture", supportedClaimIds: ["fixture.claim"], reuseStatus: "Synthetic test data", lastChecked: "2026-10-09" }] };
    await env.render(<MobileChart chart={chartFixture({ clinicalReview: review })} {...actions} />);
    expect(env.element.textContent).not.toContain("Synthetic test reference");
    await env.render(<MobileChart chart={chartFixture({ clinicalReview: review, summaryAvailable: true, summaryVisible: true, canFile: true })} {...actions} />);
    for (const text of ["Fixture summary body.", "Content version fixture.v1", "needs clinician review", "Last clinician review: None recorded", "Fixture claim text."]) expect(env.element.textContent).toContain(text);
    const link = env.find((node) => node.tagName === "A");
    expect(link.attributes).toMatchObject({ target: "_blank", rel: "noopener noreferrer", href: "https://example.org/fixture" });
    await env.click("Return to chart front"); expect(actions.onToggleSummary).toHaveBeenCalledOnce();
  });
  it("uses the same native chart for employee discussions and preserves their answer and acknowledge/file callbacks", async () => {
    const env = phoneTestDom(); const answer = vi.fn(); const acknowledge = vi.fn(); const file = vi.fn();
    const discussion: EmployeeDiscussionView = { id: "discussion-fixture", employeeName: "Fixture Colleague", roleLabel: "Fixture role", status: "question", finalStep: false,
      presentation: "Fixture team scenario.", reviewStatus: "needs clinician review", question: "Which fixture team action is next?", choices: frozenChoices };
    const render = (view: EmployeeDiscussionView) => env.render(<MobileTeamDiscussion discussion={view} onAnswer={answer} onAcknowledge={acknowledge} onFile={file} onClose={noop} />);
    await render(discussion); expect(env.element.textContent).toContain("Fixture role");
    await env.clickElement(env.find((node) => node.attributes["data-choice-id"] === "frozen.choice.a")); expect(answer).toHaveBeenCalledWith("frozen.choice.a");
    await render({ ...discussion, status: "feedback", feedback: "Fixture team feedback." }); await env.click("Continue"); expect(acknowledge).toHaveBeenCalledOnce();
    await render({ ...discussion, status: "summary", finalStep: true }); await env.click("File discussion"); expect(file).toHaveBeenCalledOnce();
  });
});
