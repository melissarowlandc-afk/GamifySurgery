import { act } from "react";
import { describe, expect, it, afterEach, vi } from "vitest";
import type { TutorialStepView, TutorialTarget } from "../session/tutorialViewModels";
import { resolveMobileTutorialTarget, findPhoneTutorialAnchor } from "./tutorialTargets";
import { MobileTutorialCoach } from "./MobileTutorialCoach";
import { cleanupPhoneTests, phoneTestDom, noop } from "./screenTestUtils";
import type { MobileSheetId } from "./navigation";

// Every declared first-visit, timed-visit, daily-routine and setup ID, including
// saved/legacy beats. `satisfies` makes additions to the shared union fail typecheck.
const STEPS = {
  welcome: "waiting-patient", "first-patient-arriving": "waiting-patient", "open-first-chart": "waiting-patient",
  "first-patient-walking-to-care": "facility-clock", "reopen-first-chart": "existing-patient", "chart-tour": "chart",
  "first-decision": "answer-choices", "off-site-result": "facility-clock", "results-ready": "existing-patient",
  "follow-up-decision": "answer-choices", "reopen-first-feedback": "existing-patient", "first-feedback": "chart-feedback",
  "dismiss-first-feedback": "chart-feedback", "first-encounter-summary": "encounter-summary", "flip-first-chart": "flip-chart",
  "resolve-first-chart": "resolve-chart", "reopen-first-summary": "existing-patient", "between-tutorial-patients": "facility-clock",
  "second-patient": "waiting-patient", "second-patient-arriving": "waiting-patient", "open-second-chart": "waiting-patient",
  "second-first-decision": "answer-choices", "second-plan-feedback": "chart-feedback", "reopen-second-plan-feedback": "existing-patient",
  "enact-second-plan": "chart-feedback", "second-sendout-wait": "facility-clock", "second-result-ready": "existing-patient",
  "second-follow-up-decision": "answer-choices", "second-final-feedback": "chart-feedback", "dismiss-second-feedback": "chart-feedback",
  "reopen-second-summary": "existing-patient", "reopen-second-chart": "existing-patient", "second-decision": "answer-choices",
  "reopen-second-feedback": "existing-patient", "second-feedback": "chart-feedback", "resolve-second-chart": "resolve-chart",
  "alerts-tour": "alerts", "goals-tour": "goals", "enter-build-mode": "build-mode", "select-exam-room": "exam-room-option",
  "place-exam-room": "facility-placement", "select-exam-room-for-door": "room-selection", "place-exam-room-door": "door-tool",
  "exit-build-mode": "exit-build-mode", "remaining-goals": "goals", "advance-level": "level-up", "level-one-ready": "goals",
  "level-one-resume-time": "facility-clock", "level-one-await-first-arrival": "facility-entrance", "sendout-management": "management",
  "sendout-trash": "facility-entrance", "sendout-water": "facility-entrance",
} as const satisfies Record<TutorialStepView["id"], TutorialTarget>;
const step = (id: TutorialStepView["id"], target: TutorialTarget): TutorialStepView => ({ id, target,
  eyebrow: "Fixture", title: "Fixture step", body: "Fixture instructions.", targetSelector: ".hidden-desktop-node",
  patientEncounterId: "fixture.patient", topicIds: ["patient-folders"] });
afterEach(cleanupPhoneTests);

describe("complete phone tutorial target resolver", () => {
  it.each(Object.entries(STEPS))("resolves %s only to a phone control, map or tab hint", (id, target) => {
    for (const sheet of [undefined, "patients", "chart", "goals", "build", "room", "manage", "alerts"] as const) {
      const result = resolveMobileTutorialTarget(step(id as TutorialStepView["id"], target), { sheet, buildMode: sheet === "build" || sheet === "room" });
      expect(result).not.toBeNull(); expect(["control", "tab", "map"]).toContain(result!.kind);
      expect(result!.selector).toMatch(/^\[data-(phone-anchor|mobile-tab)=/);
      expect(result!.selector).not.toMatch(/desktop|patient-tab|goals-panel|pause-button|data-tutorial-anchor/);
    }
  });
  it.each([
    ["waiting-patient", "patients", "patient"], ["answer-choices", "chart", "choice"],
    ["chart-feedback", "chart", "primary"], ["resolve-chart", "chart", "primary"],
    ["exam-room-option", "build", "exam-option"], ["facility-placement", undefined, "place"],
    ["door-tool", undefined, "doors-active"], ["management", "manage", "hire"], ["level-up", "goals", "advance"],
  ] as const)("uses the visible %s control on %s", (target, sheet, anchor) => {
    expect(resolveMobileTutorialTarget(step("welcome", target), { sheet, buildMode: true })?.selector).toContain(`data-phone-anchor="${anchor}"`);
  });
  it("maps dynamic paused-arrival/access/cash variants using target semantics, with no desktop selector dependency", () => {
    for (const id of ["first-patient-arriving", "second-patient-arriving", "place-exam-room-door", "remaining-goals"] as const) {
      const variants: TutorialTarget[] = id === "remaining-goals" ? ["waiting-actions", "goals"] : id === "place-exam-room-door" ? ["build-mode", "door-tool"] : ["facility-clock", "waiting-patient"];
      for (const target of variants) expect(resolveMobileTutorialTarget(step(id, target))).not.toBeNull();
    }
    expect(resolveMobileTutorialTarget(null)).toBeNull();
    expect(resolveMobileTutorialTarget(step("sendout-trash", "facility-entrance"))?.mapFocus?.kind).toBe("litter");
    expect(resolveMobileTutorialTarget(step("sendout-water", "facility-entrance"))?.mapFocus?.kind).toBe("water");
    expect(resolveMobileTutorialTarget(step("first-decision", "answer-choices"), { sheet: "alerts" })).toMatchObject({ kind: "tab", tab: "patients" });
  });
  it("queries only the supplied phone root, rejects hidden nodes, and prefers the named patient", () => {
    const node = (id: string, width = 100) => ({ dataset: { patientId: id }, closest: () => null,
      getBoundingClientRect: () => ({ width, height: 44 }) }) as unknown as HTMLElement;
    const hidden = node("fixture.patient", 0); const other = node("other"); const patient = node("fixture.patient");
    const root = { querySelectorAll: vi.fn(() => [hidden, other, patient]) } as unknown as HTMLElement;
    const current = step("open-first-chart", "waiting-patient");
    const target = resolveMobileTutorialTarget(current, { sheet: "patients" })!;
    expect(findPhoneTutorialAnchor(root, target, current)).toBe(patient);
    expect(root.querySelectorAll).toHaveBeenCalledWith('[data-phone-anchor="patient"]');
  });
});

describe("phone chart coach disclosure", () => {
  it("is collapsed on first chart render and stays collapsed through all chart beats", async () => {
    vi.useFakeTimers(); const env = phoneTestDom(); const action = vi.fn(); const exposure = vi.fn();
    const render = (id: TutorialStepView["id"], sheet?: MobileSheetId) => env.render(<MobileTutorialCoach
      step={step(id, "answer-choices")} chartScreen={sheet === "chart"} targetTab={null} onNavigate={noop}
      onAction={action} onDisableTutorials={noop} onTopicExposure={exposure} />);
    await render("first-decision", "chart"); expect(env.button("Expand guidance").attributes["aria-expanded"]).toBe("false");
    await act(async () => vi.advanceTimersByTime(6_000)); expect(exposure).not.toHaveBeenCalled();
    await render("follow-up-decision", "chart"); expect(env.button("Expand guidance").attributes["aria-expanded"]).toBe("false");
    await env.click("Expand guidance"); await act(async () => vi.advanceTimersByTime(5_999)); expect(exposure).not.toHaveBeenCalled();
    await act(async () => vi.advanceTimersByTime(1)); expect(exposure).toHaveBeenCalledExactlyOnceWith(["patient-folders"]);
    await render("first-feedback", "chart"); expect(env.button("Collapse guidance")).toBeDefined();
    await render("open-second-chart", "patients"); expect(env.button("Collapse guidance")).toBeDefined();
    await render("second-first-decision", "chart"); expect(env.button("Expand guidance")).toBeDefined();
    expect(action).not.toHaveBeenCalled();
  });
});
