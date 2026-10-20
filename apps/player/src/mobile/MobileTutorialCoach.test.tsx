import { act } from "react";
import { readFileSync } from "node:fs";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { TutorialStepView, TutorialTarget } from "../session/tutorialViewModels";
import { MobileTutorialCoach, mobileTutorialBody, mobileTutorialTab } from "./MobileTutorialCoach";
import { cleanupPhoneTests, noop, phoneTestDom } from "./screenTestUtils";
import { testElementProps } from "./testDom";

const step: TutorialStepView = { id: "open-first-chart", eyebrow: "First visit", title: "Meet Fixture Person", body: "Open the marked chart in Waiting.",
  note: "Fixture note", flavor: "Fixture flavor", target: "waiting-patient", targetSelector: ".patient-folder.is-waiting .patient-tab.is-tutorial-target", topicIds: ["patient-folders"] };
afterEach(cleanupPhoneTests);

describe("phone tutorial coach", () => {
  it("tells the phone player to use Patients or tap the patient on the map after check-in", () => {
    expect(mobileTutorialBody(step)).toMatch(/^Go to Patients, or tap the patient on the map, to open their chart\./);
    expect(mobileTutorialBody({ ...step, id: "open-second-chart" })).toBe("Go to Patients, or tap the patient on the map, to open their chart.");
    expect(mobileTutorialBody({ ...step, id: "first-patient-arriving" })).toBe(step.body);
  });
  it("explains the map advertising pin and cycling phone speed button without desktop locations", () => {
    const advertising = mobileTutorialBody({ ...step, id: "advertising-tour" });
    expect(advertising).toContain("top middle of the Clinic map"); expect(advertising).toContain("+ / −");
    expect(advertising).toContain("Level 1"); expect(advertising).not.toContain("patient folders");
    const speed = mobileTutorialBody({ ...step, id: "speed-controls-tour" });
    expect(speed).toContain("Pause and Play in the top bar"); expect(speed).toContain("cycle 1×, 2×, 4×");
    expect(speed).toContain("Time only runs while unpaused"); expect(speed).toContain("does not press Play");
  });
  it.each([
    ["waiting-patient", "patients"], ["existing-patient", "patients"], ["answer-choices", "patients"],
    ["chart-feedback", "patients"], ["alerts", "alerts"], ["build-mode", "build"], ["management", "manage"],
  ] as const)("points a hidden %s target at its %s tab", (target, expected) => {
    expect(mobileTutorialTab({ ...step, target })).toBe(expected);
  });
  it.each(["facility-clock", "facility-entrance", "facility-placement"] as const)("keeps the already available %s control on screen", (target) => {
    expect(mobileTutorialTab({ ...step, target })).toBeNull();
  });
  it("does not redirect a target already on its patient, chart, goals, build or manage screen", () => {
    for (const [target, sheet] of [["waiting-patient", "patients"], ["answer-choices", "chart"], ["goals", "goals"], ["door-tool", "build"], ["management", "manage"]] as const) {
      expect(mobileTutorialTab({ ...step, target }, sheet)).toBeNull();
    }
    expect(mobileTutorialTab({ ...step, target: "goals" }, "patients")).toBe("clinic");
    expect(mobileTutorialTab(null)).toBeNull();
  });
  it("collapses and expands without sending any tutorial action, and routes the navigation hint independently", async () => {
    const env = phoneTestDom(); const navigate = vi.fn(); const action = vi.fn();
    await env.render(<MobileTutorialCoach step={step} targetTab="patients" onNavigate={navigate} onAction={action} onDisableTutorials={noop} />);
    expect(env.element.textContent).toContain("Fixture note"); expect(env.element.textContent).toContain("Fixture flavor");
    await env.click("Collapse guidance"); expect(env.button("Expand guidance").attributes["aria-expanded"]).toBe("false");
    expect(env.find((node) => node.attributes.class === "mobile-coach-copy").attributes.hidden).toBe("");
    const directHint = env.find(node => node.tagName === "BUTTON" && node.textContent === "Go to Patients ↓" && node.parentNode?.attributes.class === "mobile-coach-heading");
    await env.clickElement(directHint); expect(navigate).toHaveBeenCalledExactlyOnceWith("patients");
    navigate.mockClear();
    await env.click("Expand guidance"); await env.click("Go to Patients ↓");
    expect(navigate).toHaveBeenCalledWith("patients"); expect(action).not.toHaveBeenCalled();
  });
  it("sends only the original supplied tutorial IDs and disables through the existing callback", async () => {
    const env = phoneTestDom(); const action = vi.fn(); const disable = vi.fn();
    await env.render(<MobileTutorialCoach step={{ ...step, primaryAction: { id: "acknowledge-step", label: "Fixture continue" }, secondaryAction: { id: "open-management", label: "Fixture manage" } }}
      targetTab={null} onNavigate={noop} onAction={action} onDisableTutorials={disable} />);
    await env.click("Fixture continue"); await env.click("Fixture manage"); expect(action.mock.calls).toEqual([["acknowledge-step"], ["open-management"]]);
    await env.click("Skip guidance"); expect(disable).toHaveBeenCalledOnce();
  });
  it("retains six-second topic exposure timing and cancels exposure for hidden/unread guidance", async () => {
    vi.useFakeTimers(); const env = phoneTestDom(); const exposure = vi.fn();
    const render = (current: TutorialStepView | null) => env.render(<MobileTutorialCoach step={current} targetTab={null} onNavigate={noop} onAction={noop} onDisableTutorials={noop} onTopicExposure={exposure} />);
    await render(step);
    await act(async () => vi.advanceTimersByTime(5_999)); expect(exposure).not.toHaveBeenCalled();
    await act(async () => vi.advanceTimersByTime(1)); expect(exposure).toHaveBeenCalledWith(["patient-folders"]);
    exposure.mockClear(); await render({ ...step, id: "second-patient", topicIds: ["returned-result"] });
    await env.click("Collapse guidance"); await act(async () => vi.advanceTimersByTime(6_000)); expect(exposure).not.toHaveBeenCalled();
    await env.click("Expand guidance"); await render(null); await act(async () => vi.advanceTimersByTime(6_000)); expect(exposure).not.toHaveBeenCalled();
  });
  it("absorbs gestures only inside its card and uses contained flow instead of viewport docking", async () => {
    const env = phoneTestDom(); await env.render(<MobileTutorialCoach step={step} targetTab={null} onNavigate={noop} onAction={noop} onDisableTutorials={noop} />);
    const coach = env.find((node) => node.attributes.role === "region");
    for (const event of ["onPointerDown", "onPointerUp", "onClick"]) {
      const stopPropagation = vi.fn(); (testElementProps(coach)[event] as (event: unknown) => void)({ stopPropagation }); expect(stopPropagation).toHaveBeenCalledOnce();
    }
    expect(coach.style.position).toBeUndefined();
    const css = readFileSync(new URL("./mobileScreens.css", import.meta.url), "utf8");
    expect(css).toMatch(/\.mobile-tutorial-coach\s*\{[^}]*position:\s*relative/);
    expect(css).toMatch(/\.mobile-content\s*\{[^}]*display:\s*flex;\s*flex-direction:\s*column/);
    expect(css).toMatch(/\.mobile-workspace\s*\{[^}]*min-height:\s*0/);
  });
});
