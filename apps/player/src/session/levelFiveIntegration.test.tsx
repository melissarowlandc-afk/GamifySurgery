import { act, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PROTOTYPE_DOMAIN_CONTEXT, deserializeGameState, serializeGameState, type GameState } from "@gamify-surgery/game-domain";
import { createLevelFiveIntegrationQaState, LEVEL_FIVE_INTEGRATION_QA_SCENARIOS } from "../../../../tests/fixtures/level-five-integration-qa";
import { integrationReviewTime } from "../../../../tests/fixtures/level-five-integration";
import { prepareLevelFiveQaProfile } from "../../../../tools/qa/level-five-state-bootstrap";
import { appendLocalCampaign, createFreshProfile, type LoadedPrototypeProfile } from "./prototypeStorage";
import { usePrototypeSession, type PrototypeSession } from "./usePrototypeSession";
import { createPrototypePlayerView } from "./viewModels";
import { AppShell } from "../AppShell";
import MobileShell from "../mobile/MobileShell";
import { MobileInspectorSheet } from "../mobile/MobileInspectorSheet";
import { describeMobileCharacter } from "../mobile/map/selection";
import { allElements, cleanupPhoneTests, phoneFixture, phoneTestDom } from "../mobile/screenTestUtils";
import { TestElement, testElementProps } from "../mobile/testDom";
import { createClinicFeedView } from "./alertsEventsViewModel";
import { GoalsPanel } from "../ui/GoalsPanel";
import { MobileGoals } from "../mobile/MobileGoals";

// The engine/session and both actual shells run. Only the canvas output is
// stubbed in Node; the real browser/geometry check is level-five.spec.ts.
vi.mock("../facility", () => ({ FacilityCanvas: () => <div data-testid="facility-canvas">Map</div> }));
vi.mock("../mobile/map/MobileFacilityMap", () => ({ MobileFacilityMap: () => <div data-testid="facility-canvas">Map</div> }));
const shipped = PROTOTYPE_DOMAIN_CONTEXT.balanceRelease;
const context = PROTOTYPE_DOMAIN_CONTEXT;
beforeEach(() => {
  vi.spyOn(Date, "now").mockReturnValue(1_000_000);
  Object.defineProperty(TestElement.prototype, "open", { configurable: true, get() { return this.attributes.open !== undefined; } });
  Object.defineProperty(TestElement.prototype, "showModal", { configurable: true, value(this: TestElement) { this.setAttribute("open", ""); } });
  Object.defineProperty(TestElement.prototype, "close", { configurable: true, value(this: TestElement) { this.removeAttribute("open"); } });
});
afterEach(async () => {
  await cleanupPhoneTests(); PROTOTYPE_DOMAIN_CONTEXT.balanceRelease = shipped; vi.restoreAllMocks();
  for (const key of ["open", "showModal", "close"]) Reflect.deleteProperty(TestElement.prototype, key);
});

async function mount(state: GameState, phone: boolean) {
  vi.mocked(Date.now).mockReturnValue(integrationReviewTime(state, state.facilityTick + 1));
  const env = phoneTestDom(); Object.assign(env.doc, { visibilityState: "visible" });
  const interval = vi.fn((_callback: () => void, _delay: number) => 1);
  Object.assign(env.browser, { setInterval: interval, clearInterval: vi.fn() });
  let session!: PrototypeSession, changeShell!: (phone: boolean) => void;
  const profile = { ...createFreshProfile(), activeCampaignId: state.campaignId, tutorialsEnabled: false,
    tutorialIntroDismissedCampaignIds: [state.campaignId], campaigns: [{ campaignId: state.campaignId,
      name: "M9 actual integration", createdAtRealMs: 0, updatedAtRealMs: 0, status: "resumable" as const, state }] };
  const loaded: LoadedPrototypeProfile = { notice: "Disposable integration test", profile };
  const fresh = vi.fn(() => appendLocalCampaign(session.profile, state.founder, "Fresh integration clinic", 2_000_000));
  function Host() {
    session = usePrototypeSession(loaded);
    const [isPhone, setPhone] = useState(phone); changeShell = setPhone;
    const view = createPrototypePlayerView(session.state, session.state.openChartEncounterId, false, session.selectedRoomDefinitionId, session.buildMode);
    const props = phoneFixture({ ...view, paused: session.state.paused, simulationSpeed: session.state.simulationSpeed,
      buildMode: session.buildMode, managementMode: session.managementMode, campaigns: session.campaigns,
      onEnterBuildMode: session.enterBuildMode, onExitBuildMode: session.exitBuildMode,
      onEnterManagementMode: session.enterManagementMode, onExitManagementMode: session.exitManagementMode,
      onBeginPlacement: session.beginPlacement, onLevelUp: session.levelUp, onTogglePause: session.togglePause,
      onCloseChart: session.closeChart, onOpenPatient: session.openPatient, onSubmitAnswer: session.submitAnswer,
      onAcknowledgeTerminalFeedback: session.acknowledgeTerminalFeedback, onFileChart: session.fileChart,
      onSimulationSpeedChange: session.setSimulationSpeed, onBookInspection: session.bookInspection, onCancelInspection: session.cancelInspection,
      finishReportOpen: session.finishReportOpen, onViewFinishReport: session.openFinishReport, onCloseFinishReport: session.closeFinishReport,
      onDescribeCharacter: session.describeCharacter, onCreateCampaign: fresh });
    return isPhone ? <MobileShell {...props} /> : <AppShell {...props} />;
  }
  await env.render(<Host />);
  return { ...env, interval, fresh, get session() { return session; }, switchShell: async (phone: boolean) => { await act(async () => changeShell(phone)); } };
}

describe("M9 actual integration in desktop and mobile shells", () => {
  it.each(LEVEL_FIVE_INTEGRATION_QA_SCENARIOS)("resumes %s without reseeding while switching desktop/phone queries", scenario => {
    const profile = prepareLevelFiveQaProfile(createFreshProfile(), scenario);
    expect(profile.campaigns).toHaveLength(1);
    const campaign = profile.campaigns[0]!;
    expect(prepareLevelFiveQaProfile(profile, scenario).campaigns[0]).toBe(campaign);
    expect(campaign.state).toEqual(createLevelFiveIntegrationQaState(scenario, context));
  });

  it.each([false, true])("exposes the five Build tiles and the Executive in Manage on phone=%s", async phone => {
    const env = await mount(createLevelFiveIntegrationQaState("integration-build", context), phone);
    await act(async () => env.session.closeChart());
    await env.click(phone ? "Build" : "Enter Build Mode");
    for (const id of ["room.founder_office", "room.executive_office", "room.gift_shop", "room.indoor_garden", "room.staff_gym"]) {
      const buttons = allElements(env.element, node => node.tagName === "BUTTON" &&
        (node.attributes["data-room-definition-id"] === id || node.attributes["data-build-room-option"] === id));
      expect(buttons, id).toHaveLength(1);
    }
    await env.click(phone ? "Manage" : "Done / Save");
    if (!phone) await env.click("Enter Management Mode");
    const role = phone ? allElements(env.element, node => node.tagName === "BUTTON" && node.attributes["data-staff-role-id"] === "staff.executive")[0]!
      : allElements(allElements(env.element, node => node.attributes["data-staff-role-id"] === "staff.executive")[0]!, node => node.attributes.class === "staff-role-toggle")[0]!;
    await env.clickElement(role);
    expect(env.element.textContent).toContain("$45");
    if (phone) {
      expect(allElements(env.element, node => node.attributes.class === "mobile-executive-role-details")).toHaveLength(1);
      expect(env.element.textContent).toContain("Training strengthens all four");
    }
    expect(env.session.state.clinicalXp).toBe(0);
    expect(env.session.state.levelFive!.progress.inspectionUnlocked).toBeNull();
  });

  it.each([false, true])("opens the actual first report once on phone=%s and keeps playing across reload/shell changes", async phone => {
    const state = createLevelFiveIntegrationQaState("integration-final", context);
    const env = await mount(state, phone);
    expect(env.session.finishReportOpen).toBe(false);
    await act(async () => env.session.togglePause());
    await act(async () => env.interval.mock.lastCall![0]());
    expect(env.session.finishReportOpen).toBe(true);
    expect(env.element.textContent).toContain("Congratulations. Your reward is a report card and the opportunity to improve it.");
    expect(env.session.state.levelFive!.inspection.lastReport!.rawTotalScore).toBeLessThan(80);
    const first = structuredClone(env.session.state.levelFive!.progress.gameFinished);
    await env.switchShell(!phone);
    expect(env.session.state.levelFive!.progress.gameFinished).toEqual(first);
    await env.click("Start new campaign"); await env.click("Return to report");
    expect(env.fresh).not.toHaveBeenCalled(); expect(env.session.finishReportOpen).toBe(true);
    const keep = testElementProps(env.button("Keep playing")).onClick as () => void;
    await act(async () => { keep(); keep(); });
    expect(env.session.finishReportOpen).toBe(false);
    expect(env.session.state.levelFive!.progress.gameFinished).toEqual(first);
    const saved = deserializeGameState(serializeGameState(env.session.state), context);
    await act(async () => env.root.unmount());
    const reloaded = await mount(saved, phone);
    expect(reloaded.session.finishReportOpen).toBe(false);
    await act(async () => reloaded.session.bookInspection());
    expect(reloaded.session.state.levelFive!.inspection.status).toBe("preparing");
    expect(reloaded.session.finishReportOpen).toBe(false);
  });

  it.each([false, true])("uses the actual earned finish for explicit fresh-campaign confirmation on phone=%s", async phone => {
    const env = await mount(createLevelFiveIntegrationQaState("integration-finish", context), phone);
    const original = structuredClone(env.session.state);
    await env.click("Start new campaign");
    const confirm = testElementProps(env.button("Confirm new campaign")).onClick as () => void;
    await act(async () => { confirm(); confirm(); });
    expect(env.fresh).toHaveBeenCalledOnce();
    const result = env.fresh.mock.results[0]!.value;
    expect(result.campaign.state).toMatchObject({ facilityLevel: 0, clinicalXp: 0, learningHistories: {} });
    expect(result.campaign.campaignId).not.toBe(original.campaignId);
    expect(result.campaign.state.campaignSeed).not.toBe(original.campaignSeed);
    expect(result.profile.campaigns[0]!.state).toEqual(original);
  });

  it("exposes all ten real inspectors as one-tap phone information without patient/staff actions", async () => {
    const state = createLevelFiveIntegrationQaState("integration-running", context);
    const model = createPrototypePlayerView(state, null, false, null).facility;
    const env = phoneTestDom(), close = vi.fn();
    expect(model.inspectors).toHaveLength(10);
    for (const actor of model.inspectors!) {
      const ref = { kind: "inspector" as const, id: actor.instanceId };
      const selection = describeMobileCharacter(ref, model)!;
      await env.render(<MobileInspectorSheet selection={selection} facility={model} onClose={close}
        onOpenRoom={vi.fn()} onOpenPatient={vi.fn()} onPraiseEmployee={vi.fn()} />);
      expect(env.element.textContent).toContain("Inspector");
      expect(allElements(env.element, node => node.tagName === "BUTTON")).toHaveLength(1);
      await env.click("Close Inspector");
    }
    expect(close).toHaveBeenCalledTimes(10);
  });

  it("refreshes the historical cap-4 milestone with ordinary Advance copy without changing its save", () => {
    PROTOTYPE_DOMAIN_CONTEXT.balanceRelease = shipped;
    const state = createLevelFiveIntegrationQaState("integration-l4", context);
    state.events.push({ id: "event.facility-level-4-complete", type: "success_message", facilityTick: state.facilityTick,
      encounterId: null, message: "Level 4 complete - Level 5 coming later. Keep playing; the clinic is still open.",
      priority: "informational", definitionId: "alert.progress.level-four-complete" });
    const before = serializeGameState(state), feed = createClinicFeedView(state);
    expect(feed.find(row => row.id === "event.facility-level-4-complete")!.message).toBe("The Level 4 goals were completed. Check Goals to advance.");
    expect(serializeGameState(state)).toBe(before);
    expect(PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility.maximumPlayableLevel).toBe(5);
    const view = createPrototypePlayerView(state, null, false, null).progression;
    expect(renderToStaticMarkup(<GoalsPanel view={view} onLevelUp={() => {}} onProcedureSetupAction={() => {}} />)).not.toContain("coming later");
    expect(renderToStaticMarkup(<MobileGoals view={view} onLevelUp={() => {}} onSetupAction={() => {}} />)).not.toContain("coming later");
  });
});
