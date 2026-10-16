import { act } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanupPhoneTests, phoneTestDom } from "../mobile/screenTestUtils";
import { testElementProps } from "../mobile/testDom";
import { scoredEmployeeFixture, scoredPatientFixture } from "../playtime/usageTestFixtures";
import { createPrototypePlayerView } from "../session/viewModels";
import { ChartPanel } from "./ChartPanel";
import { MobileChart } from "../mobile/MobileChart";
import { MobileTeamDiscussion } from "../mobile/MobileChart";
import { EmployeeDiscussionPanel } from "./EmployeeDiscussionPanel";

vi.mock("react-dom", async (original) => ({ ...await original<typeof import("react-dom")>(), createPortal: (node: unknown) => node }));

afterEach(cleanupPhoneTests);
describe("desktop and phone flag composer", () => {
  it.each(["desktop", "phone"])("captures context, bounds comments and keeps %s answering/closing available", async (layout) => {
    const state = scoredPatientFixture();
    const chart = createPrototypePlayerView(state, state.openChartEncounterId, false, null).chart!;
    const step = chart.decisionSteps![0]!;
    const env = phoneTestDom(); const actions = { onFlagQuestion: vi.fn(), onClose: vi.fn(), onSubmitAnswer: vi.fn(),
      onAcknowledgeTerminalFeedback: vi.fn(), onToggleSummary: vi.fn(), onFileChart: vi.fn() };
    const render = (value = chart) => env.render(layout === "phone" ? <MobileChart chart={value} {...actions} /> : <ChartPanel chart={value} {...actions} />);
    await render(); await env.click("Flag this question for developer review");
    const textarea = env.find((node) => node.tagName === "TEXTAREA");
    expect(testElementProps(textarea).maxLength).toBe(500);
    await act(async () => { (testElementProps(textarea).onChange as (event: unknown) => void)({ target: { value: "z".repeat(530) } }); });
    expect(env.element.textContent).toContain("500/500");
    // An answer arriving while the composer is open does not replace its snapshot.
    await render({ ...chart, decisionSteps: chart.decisionSteps!.map((item) => ({ ...item,
      reviewFlagInput: { ...item.reviewFlagInput!, selectedAnswerChoiceId: item.answerChoices[0]!.id } })) });
    await env.click("Submit flag");
    expect(actions.onFlagQuestion).toHaveBeenCalledWith(step.id, "z".repeat(500), expect.objectContaining({ selectedAnswerChoiceId: null }));
    expect(env.element.textContent).toContain("flag saved on this device");
    expect(actions.onSubmitAnswer).not.toHaveBeenCalled(); expect(actions.onClose).not.toHaveBeenCalled();
    await env.click(layout === "phone" ? "Close chart" : "Close patient chart"); expect(actions.onClose).toHaveBeenCalledOnce();
  });

  it.each(["desktop", "phone"])("cancels without flagging or scoring in %s", async (layout) => {
    const state = scoredPatientFixture(); const chart = createPrototypePlayerView(state, state.openChartEncounterId, false, null).chart!;
    const env = phoneTestDom(); const flag = vi.fn(); const answer = vi.fn();
    const props = { chart, onClose: vi.fn(), onFlagQuestion: flag, onSubmitAnswer: answer, onAcknowledgeTerminalFeedback: vi.fn(), onToggleSummary: vi.fn(), onFileChart: vi.fn() };
    await env.render(layout === "phone" ? <MobileChart {...props} /> : <ChartPanel {...props} />);
    await env.click("Flag this question for developer review"); await env.click("Cancel");
    expect(flag).not.toHaveBeenCalled(); expect(answer).not.toHaveBeenCalled();
  });

  it.each(["desktop", "phone"])("supports an employee comment in %s without scoring the discussion", async (layout) => {
    const state = scoredEmployeeFixture(); const view = createPrototypePlayerView(state, null, false, null);
    const discussion = view.employeeDiscussion!; const env = phoneTestDom();
    const flag = vi.fn(); const answer = vi.fn();
    const actions = { discussion, onFlagQuestion: flag, onAnswer: answer, onClose: vi.fn(), onAcknowledge: vi.fn(), onFile: vi.fn() };
    await env.render(layout === "phone" ? <MobileTeamDiscussion {...actions} /> : <EmployeeDiscussionPanel {...actions} />);
    await env.click("Flag this question for developer review");
    await act(async () => { (testElementProps(env.find((node) => node.tagName === "TEXTAREA")).onChange as (event: unknown) => void)({ target: { value: "Team question comment" } }); });
    await env.click("Submit flag");
    expect(flag).toHaveBeenCalledWith(discussion.reviewFlagInput!.decisionNodeId, "Team question comment", expect.objectContaining({ patientDisplayName: "Synthetic Colleague" }));
    expect(answer).not.toHaveBeenCalled();
  });
});
