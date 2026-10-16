import { act } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createInitialGameState } from "@gamify-surgery/game-domain";
import { createPrototypePlayerView } from "../session/viewModels";
import type { PrototypeShellProps } from "../shellContract";
import type { ChartView, ClinicAlertAction, EmployeeDiscussionView, MessageBoardItemView } from "../ui/types";
import type { TutorialStepView } from "../session/tutorialViewModels";
import MobileShell from "./MobileShell";
import { cleanupPhoneTests, phoneFixture, phoneTestDom } from "./screenTestUtils";

vi.mock("../facility", () => ({ FacilityCanvas: () => <div data-testid="facility-canvas">Live map</div> }));
const chart: ChartView = { id: "fixture-patient", patientName: "Fixture Person", patientDetails: "41 · Female", ageLabel: "41", sexLabel: "Female", chiefComplaint: "Fixture visit",
  statusLabel: "Action required", presentation: "Fixture story.", questionPrompt: "Which fixture action is next?", answerChoices: [{ id: "frozen-z", label: "Fixture choice", selected: false, disabled: false }],
  terminalFeedbackNeedsAcknowledgment: false, summaryAvailable: false, summaryVisible: false, canFile: false, readOnly: false };
const discussion: EmployeeDiscussionView = { id: "fixture-discussion", employeeName: "Fixture Colleague", roleLabel: "Fixture role", status: "question", finalStep: false,
  presentation: "Fixture discussion.", question: "Which fixture team action is next?", choices: chart.answerChoices, reviewStatus: "needs clinician review" };
const patients = [{ id: chart.id, folder: "waiting" as const, name: chart.patientName, subtitle: "Fixture", statusLabel: "Waiting", actionRequired: true, selected: false, satisfactionPercent: 100 }];
afterEach(cleanupPhoneTests);

function renderShell(overrides: Partial<PrototypeShellProps> = {}) {
  const env = phoneTestDom(); let props = phoneFixture(overrides);
  return { ...env, mount: () => env.render(<MobileShell {...props} />),
    update: async (next: Partial<PrototypeShellProps>) => { props = phoneFixture({ ...props, ...next }); await env.render(<MobileShell {...props} />); } };
}

describe("phone screen/session interactions", () => {
  it("opens patient charts without pausing and leaves the clock/Pause/Speed usable above the sheet", async () => {
    const open = vi.fn(); const answer = vi.fn(); const pause = vi.fn(); const speed = vi.fn();
    const env = renderShell({ patients, onOpenPatient: open, onSubmitAnswer: answer, onTogglePause: pause, onSimulationSpeedChange: speed }); await env.mount();
    await env.click("Patients, 1 waiting"); await env.clickElement(env.find((node) => node.attributes["data-patient-id"] === chart.id));
    expect(open).toHaveBeenCalledWith(chart.id); expect(pause).not.toHaveBeenCalled();
    expect(env.element.textContent).toContain("Existing Patients"); // Refused/unchanged session cannot create a phantom sheet.
    await env.update({ chart });
    expect(env.find((node) => node.attributes["aria-label"] === "Patient chart").parentNode?.attributes.class).toBe("mobile-workspace");
    const clockButton = env.button("Pause facility time"); expect(clockButton.attributes.disabled).toBeUndefined();
    const chartSheet = env.find((node) => node.attributes["aria-label"] === "Patient chart");
    expect(chartSheet.contains(clockButton)).toBe(false);
    await env.click("Pause facility time"); expect(pause).toHaveBeenCalledOnce();
    await env.clickElement(env.find((node) => node.attributes.class === "mobile-speed")); expect(speed).toHaveBeenCalledWith(2);
    await env.clickElement(env.find((node) => node.attributes["data-choice-id"] === "frozen-z")); expect(answer).toHaveBeenCalledWith("frozen-z");
    expect(env.element.textContent).not.toContain("Press 1");
  });
  it("header Close and browser Back call the guarded close and keep the sheet until the projection closes", async () => {
    const close = vi.fn(); const ack = vi.fn(); const file = vi.fn(); const env = renderShell({ patients, onCloseChart: close, onAcknowledgeTerminalFeedback: ack, onFileChart: file }); await env.mount();
    await env.click("Patients, 1 waiting"); await env.update({ chart: { ...chart, terminalFeedbackNeedsAcknowledgment: true } });
    await env.click("Close Patient chart"); expect(close).toHaveBeenCalledOnce();
    expect(env.element.textContent).toContain("Fixture story.");
    await env.back(); expect(close).toHaveBeenCalledTimes(2); expect(env.element.textContent).toContain("Fixture story.");
    expect(ack).not.toHaveBeenCalled(); expect(file).not.toHaveBeenCalled(); // The shared close callback owns acknowledgment, not the shell.
    await env.update({ chart: null });
    expect(env.element.textContent).not.toContain("Fixture story."); expect(env.element.textContent).toContain("Existing Patients");
  });
  it.each(["Clinic", "Alerts", "Manage", "Build"])("does not bypass chart-close guards when selecting %s", async (tab) => {
    const close = vi.fn(); const enterManage = vi.fn(); const enterBuild = vi.fn();
    const env = renderShell({ chart, onCloseChart: close, onEnterManagementMode: enterManage, onEnterBuildMode: enterBuild }); await env.mount();
    await env.click(tab); expect(close).toHaveBeenCalledOnce(); expect(env.element.textContent).toContain("Fixture story.");
    expect(enterManage).not.toHaveBeenCalled(); expect(enterBuild).not.toHaveBeenCalled();
    await env.update({ chart: null });
    expect(env.button(tab).attributes["aria-current"]).toBe("page");
    expect(enterManage).toHaveBeenCalledTimes(tab === "Manage" ? 1 : 0); expect(enterBuild).toHaveBeenCalledTimes(tab === "Build" ? 1 : 0);
  });
  it("keeps employee discussion Back/header closure on the same session callback", async () => {
    const close = vi.fn(); const env = renderShell({ employeeDiscussion: discussion, onCloseEmployeeDiscussion: close }); await env.mount();
    await env.click("Close Team discussion"); expect(close).toHaveBeenCalledOnce(); expect(env.element.textContent).toContain("Fixture discussion.");
    await env.back(); expect(close).toHaveBeenCalledTimes(2);
    await env.update({ employeeDiscussion: null }); expect(env.element.textContent).not.toContain("Fixture discussion.");
  });
  it("contains expanded/collapsed guidance above the tab bar, keeps every tab tappable and points at hidden Patients", async () => {
    const step: TutorialStepView = { id: "open-first-chart", eyebrow: "First visit", title: "Meet Fixture Person", body: "Open the marked chart in Waiting.", target: "waiting-patient", targetSelector: ".patient-tab" };
    const action = vi.fn(); const env = renderShell({ tutorialStep: step, onTutorialAction: action }); await env.mount();
    const coach = env.find((node) => node.attributes.class?.startsWith("mobile-tutorial-coach") === true);
    const tabs = env.find((node) => node.attributes["aria-label"] === "Clinic tabs");
    expect(coach.parentNode?.attributes.class).toBe("mobile-content"); expect(coach.parentNode?.contains(tabs)).toBe(false);
    expect(env.button("Patients").attributes["data-mobile-tutorial-target"]).toBe("true");
    await env.click("Collapse guidance"); await env.click("Patients");
    expect(env.element.textContent).toContain("Existing Patients"); expect(env.button("Patients").attributes.disabled).toBeUndefined();
    expect(env.button("Patients").attributes["data-mobile-tutorial-target"]).toBeUndefined();
    await env.click("Alerts"); expect(env.element.textContent).toContain("Around the clinic");
    await env.click("Clinic"); await env.click("Expand guidance"); await env.click("Go to Patients ↓");
    expect(env.button("Patients").attributes["aria-current"]).toBe("page"); expect(action).not.toHaveBeenCalled();
  });
  it("completes GLP-1 consult directly and keeps Advertising controls in their sheet", async () => {
    const consult = vi.fn(); const advertising = vi.fn(); const env = renderShell({
      emergencyGlp1: { ...phoneFixture().emergencyGlp1, visible: true, enabled: true, automationCapacity: 0 },
      advertising: { ...phoneFixture().advertising, canIncrease: true, currentLevel: 0 }, onRunEmergencyGlp1Consultation: consult, onAdvertisingLevelChange: advertising,
    }); await env.mount();
    await env.click(`GLP-1 consult · ${phoneFixture().emergencyGlp1.paymentLabel}`); expect(consult).toHaveBeenCalledOnce();
    expect(env.element.textContent).not.toContain("Complete consult");
    await env.click("More clinic options"); await env.click("Advertising"); await env.click("Increase advertising"); expect(advertising).toHaveBeenCalledWith(1);
  });
});

describe("phone alert navigation", () => {
  const message = (action?: ClinicAlertAction, targetType?: MessageBoardItemView["targetType"], targetId?: string): MessageBoardItemView => ({
    id: "fixture-route", message: "Fixture route message", actionLabel: "Run fixture route", action, targetType, targetId,
  });
  async function alerts(overrides: Partial<PrototypeShellProps>) {
    const env = renderShell(overrides); await env.mount(); await env.click("Alerts"); return env;
  }
  it.each([{ kind: "open_chart", encounterId: chart.id }, { kind: "open_discussion", discussionId: discussion.id }] as const)("uses runClinicAlertAction for $kind and opens the right phone sheet", async (action) => {
    const run = vi.fn(() => ({ ok: true })); const env = await alerts({ messages: [message(action)], onClinicAlertAction: run });
    await env.click("Run fixture route"); expect(run).toHaveBeenCalledWith(action);
    await env.update(action.kind === "open_chart" ? { chart } : { employeeDiscussion: discussion });
    expect(env.element.textContent).toContain(action.kind === "open_chart" ? "Fixture story." : "Fixture discussion.");
  });
  it.each(["place_room", "restore_access", "train_employee", "show_goals"] as const)("stays on Alerts when the current $kind action is refused", async (kind) => {
    const action: ClinicAlertAction = kind === "place_room" ? { kind, definitionId: "room.examination", expectedCost: 1 }
      : kind === "restore_access" ? { kind, roomId: "fixture-room" } : kind === "train_employee" ? { kind, employeeId: "fixture-employee", expectedCost: 1 } : { kind };
    const run = vi.fn(() => ({ ok: false, reason: "Fixture guard refused" })); const enterBuild = vi.fn(); const enterManage = vi.fn();
    const env = await alerts({ messages: [message(action)], onClinicAlertAction: run, onEnterBuildMode: enterBuild, onEnterManagementMode: enterManage });
    await env.click("Run fixture route"); expect(run).toHaveBeenCalledWith(action); expect(env.element.textContent).toContain("Fixture guard refused");
    expect(env.button("Alerts").attributes["aria-current"]).toBe("page"); expect(enterBuild).not.toHaveBeenCalled(); expect(enterManage).not.toHaveBeenCalled();
  });
  it("routes successful room placement to Build and arms the same definition only after mode entry", async () => {
    const action: ClinicAlertAction = { kind: "place_room", definitionId: "room.examination", expectedCost: 1 };
    const run = vi.fn(() => ({ ok: true })); const enter = vi.fn(); const place = vi.fn();
    const env = await alerts({ messages: [message(action)], onClinicAlertAction: run, onEnterBuildMode: enter, onBeginPlacement: place });
    await env.click("Run fixture route"); expect(enter).toHaveBeenCalledOnce(); expect(place).not.toHaveBeenCalled();
    await env.update({ buildMode: true, paused: true }); expect(place).toHaveBeenCalledWith("room.examination"); expect(enter).toHaveBeenCalledOnce();
    expect(env.button("Build").attributes["aria-current"]).toBe("page");
  });
  it("routes successful restore-access to the Build room sheet rather than a desktop DOM target", async () => {
    const state = createInitialGameState(); const roomId = state.rooms[0]!.id;
    const view = createPrototypePlayerView(state, null, false, null, true, roomId);
    const action: ClinicAlertAction = { kind: "restore_access", roomId }; const run = vi.fn(() => ({ ok: true })); const enter = vi.fn(); const select = vi.fn();
    const env = await alerts({ messages: [message(action)], onClinicAlertAction: run, onEnterBuildMode: enter, onSelectRoom: select });
    await env.click("Run fixture route"); expect(enter).toHaveBeenCalledOnce(); expect(select).not.toHaveBeenCalled();
    await env.update({ buildMode: true, paused: true, selectedRoomBuild: view.selectedRoomBuild }); expect(select).toHaveBeenCalledWith(roomId);
    expect(env.element.textContent).toContain(view.selectedRoomBuild!.displayName);
  });
  it("routes successful training to Manage with the same employee request; the shell does not buy training", async () => {
    const run = vi.fn(() => ({ ok: true })); const enter = vi.fn(); const train = vi.fn();
    const action: ClinicAlertAction = { kind: "train_employee", employeeId: "fixture-employee", expectedCost: 1 };
    const env = await alerts({ messages: [message(action)], onClinicAlertAction: run, onEnterManagementMode: enter, onTrainEmployee: train });
    await env.click("Run fixture route"); expect(run).toHaveBeenCalledWith(action); expect(enter).toHaveBeenCalledOnce(); expect(train).not.toHaveBeenCalled();
    expect(env.button("Manage").attributes["aria-current"]).toBe("page");
  });
  it.each([
    ["staff_role", "staff.receptionist", "Manage"], ["employee", "fixture-employee", "Manage"], ["build_mode", undefined, "Build"],
    ["goal", undefined, "Goals"], ["advertising", undefined, "Advertising"], ["emergency_glp1", undefined, "GLP-1 consult"], ["money", undefined, "Money"],
  ] as const)("maps the legacy %s navigation target to a phone screen", async (target, id, screen) => {
    const enterBuild = vi.fn(); const enterManage = vi.fn(); const run = vi.fn();
    const env = await alerts({ messages: [message(undefined, target, id)], onClinicAlertAction: run, onEnterBuildMode: enterBuild, onEnterManagementMode: enterManage });
    await env.click("Run fixture route"); expect(run).not.toHaveBeenCalled();
    if (screen === "Manage" || screen === "Build") expect(env.button(screen).attributes["aria-current"]).toBe("page");
    else expect(env.find((node) => node.attributes.role === "dialog").attributes["aria-label"]).toBe(screen);
  });
});
