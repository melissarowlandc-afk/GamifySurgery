import { act, useState } from "react";
import { readFileSync } from "node:fs";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PROTOTYPE_DOMAIN_CONTEXT, deserializeGameState, serializeGameState, type GameState } from "@gamify-surgery/game-domain";
import { createLevelFiveStateQaContext, createLevelFiveStateQaState } from "../../../../tests/fixtures/level-five-state";
import { appendLocalCampaign, createFreshProfile, type LoadedPrototypeProfile } from "./prototypeStorage";
import { usePrototypeSession, type PrototypeSession } from "./usePrototypeSession";
import { createPrototypePlayerView } from "./viewModels";
import { AppShell } from "../AppShell";
import MobileShell from "../mobile/MobileShell";
import { allElements, cleanupPhoneTests, phoneFixture, phoneTestDom } from "../mobile/screenTestUtils";
import { TestElement, testElementProps } from "../mobile/testDom";
// Hosted CI runners run long simulations up to ten times slower.
const hostedTime = (ms: number) => (process.env.CI ? ms * 10 : ms);

vi.mock("../facility", () => ({ FacilityCanvas: () => <div data-testid="facility-canvas">Map</div> }));
vi.mock("../mobile/map/MobileFacilityMap", () => ({ MobileFacilityMap: () => <div data-testid="facility-canvas">Map</div> }));
const shipped = PROTOTYPE_DOMAIN_CONTEXT.balanceRelease;
beforeEach(() => {
  PROTOTYPE_DOMAIN_CONTEXT.balanceRelease = createLevelFiveStateQaContext().balanceRelease;
  vi.spyOn(Date, "now").mockReturnValue(1_000_000);
  Object.defineProperty(TestElement.prototype, "open", { configurable: true, get() { return this.attributes.open !== undefined; } });
  Object.defineProperty(TestElement.prototype, "showModal", { configurable: true, value(this: TestElement) { this.setAttribute("open", ""); } });
  Object.defineProperty(TestElement.prototype, "close", { configurable: true, value(this: TestElement) { this.removeAttribute("open"); } });
});
afterEach(async () => {
  await cleanupPhoneTests(); PROTOTYPE_DOMAIN_CONTEXT.balanceRelease = shipped; vi.restoreAllMocks();
  for (const key of ["open", "showModal", "close"]) Reflect.deleteProperty(TestElement.prototype, key);
});

async function mount(state: GameState, phone = false) {
  const env = phoneTestDom(); Object.assign(env.doc, { visibilityState: "visible" });
  const interval = vi.fn((_callback: () => void, _delay: number) => 1);
  Object.assign(env.browser, { setInterval: interval, clearInterval: vi.fn() });
  const loaded: LoadedPrototypeProfile = { notice: "M7c disposable test", profile: { ...createFreshProfile(), activeCampaignId: state.campaignId,
    tutorialsEnabled: false, tutorialIntroDismissedCampaignIds: [state.campaignId], campaigns: [{ campaignId: state.campaignId,
      name: "Finished test clinic", createdAtRealMs: 0, updatedAtRealMs: 0, status: "resumable", state }] } };
  let session!: PrototypeSession;
  let setPhone!: (value: boolean) => void;
  const newCampaign = vi.fn(() => appendLocalCampaign(session.profile, state.founder, "New test clinic", 2_000_000));
  function Host() {
    session = usePrototypeSession(loaded);
    const [isPhone, updatePhone] = useState(phone); setPhone = updatePhone;
    const view = createPrototypePlayerView(session.state, null, false, null);
    const props = phoneFixture({ ...view, paused: session.state.paused, simulationSpeed: session.state.simulationSpeed,
      campaigns: session.campaigns, onTogglePause: session.togglePause, onSimulationSpeedChange: session.setSimulationSpeed,
      onBookInspection: session.bookInspection, onCancelInspection: session.cancelInspection,
      finishReportOpen: session.finishReportOpen, onViewFinishReport: session.openFinishReport,
      onCloseFinishReport: session.closeFinishReport, onCreateCampaign: newCampaign });
    return isPhone ? <MobileShell {...props} /> : <AppShell {...props} />;
  }
  await env.render(<Host />);
  return { ...env, interval, newCampaign, get session() { return session; }, switchShell: async (value: boolean) => { await act(async () => setPhone(value)); } };
}
const finishDialogs = (env: ReturnType<typeof phoneTestDom>) => allElements(env.element, node => node.tagName === "DIALOG" && Boolean(node.attributes.class?.includes("finished-game-dialog")));

describe("M7c finished-game page in the actual desktop and phone shells", () => {
  it("opens automatically when the session's next real minute completes the first valid inspection", async () => {
    const state = createLevelFiveStateQaState("inspection-final");
    const env = await mount(state, true);
    expect(env.session.finishReportOpen).toBe(false);
    await act(async () => env.session.togglePause());
    const tick = env.interval.mock.lastCall![0];
    await act(async () => tick());
    expect(env.session.state.levelFive!.inspection.lastReport).toMatchObject({ outcome: "completed", observedActiveMinutes: 3000, qualifyingScoredPatientCount: 25 });
    expect(env.session.finishReportOpen).toBe(true); expect(env.session.state.paused).toBe(true);
    expect(env.element.textContent).toContain("60.05"); expect(finishDialogs(env)).toHaveLength(1);
    const first = structuredClone(env.session.state.levelFive!.progress.gameFinished);
    await env.click("Keep playing"); expect(env.session.state.paused).toBe(false);
    expect(env.session.state.levelFive!.progress.gameFinished).toEqual(first);
    expect(env.session.state.events.filter(event => event.id === "event.level-five.game-finished")).toHaveLength(1);
  }, hostedTime(60_000));

  it.each([false, true])("opens the first valid low-score finish on phone=%s, pauses once, and keeps the campaign on double-tap Keep playing", async phone => {
    const state = createLevelFiveStateQaState("finish"); state.paused = false;
    const before = structuredClone(state);
    const env = await mount(state, phone);
    expect(finishDialogs(env)).toHaveLength(1);
    expect(env.element.textContent).toContain("Congratulations. Your reward is a report card and the opportunity to improve it.");
    expect(env.element.textContent).toContain("The inspectors have left. Their recommendations have moved in.");
    expect(env.session.state.paused).toBe(true); expect(env.session.finishReportOpen).toBe(true);
    expect(env.doc.activeElement.textContent).toContain("Congratulations.");
    const tick = env.session.state.facilityTick;
    await act(async () => { env.session.togglePause(); env.session.setSimulationSpeed(4); env.session.fastForward(); });
    expect(env.session.state.facilityTick).toBe(tick); expect(env.session.state.paused).toBe(true); expect(env.session.state.simulationSpeed).toBe(1);
    const keep = testElementProps(env.button("Keep playing")).onClick as () => void;
    await act(async () => { keep(); keep(); });
    expect(finishDialogs(env)).toHaveLength(0); expect(env.session.state.paused).toBe(false);
    expect(env.session.state.levelFive!.progress.finishPageAcknowledgedAtFacilityTick).toBe(tick);
    expect(Object.values(env.session.state.operationReceipts).filter(receipt => receipt.commandType === "ACKNOWLEDGE_FINISH_PAGE" && receipt.status === "applied")).toHaveLength(1);
    for (const key of ["campaignId", "campaignSeed", "cashCents", "clinicalXp", "learningHistories", "rooms", "employees", "encounters"] as const) expect(env.session.state[key]).toEqual(before[key]);
    expect(env.session.state.levelFive!.inspection).toEqual(before.levelFive!.inspection);
    expect(env.session.state.levelFive!.progress.gameFinished).toEqual(before.levelFive!.progress.gameFinished);
    expect(env.newCampaign).not.toHaveBeenCalled();
  });

  it.each([false, true])("confirms a fresh campaign through the existing create path on phone=%s and cancels back to the intact report", async phone => {
    const env = await mount(createLevelFiveStateQaState("finish"), phone);
    const before = structuredClone(env.session.state);
    await env.click("Start new campaign");
    expect(env.newCampaign).not.toHaveBeenCalled(); expect(env.session.state).toEqual(before);
    await env.click("Return to report");
    expect(env.element.textContent).toContain("Congratulations."); expect(env.session.state).toEqual(before);
    await env.click("Start new campaign");
    const confirm = testElementProps(env.button("Confirm new campaign")).onClick as () => void;
    await act(async () => { confirm(); confirm(); });
    expect(env.newCampaign).toHaveBeenCalledOnce();
    const result = env.newCampaign.mock.results[0]!.value;
    expect(result.campaign.state.campaignSeed).not.toBe(before.campaignSeed);
    expect(result.campaign.campaignId).not.toBe(before.campaignId);
    expect(result.campaign.state).toMatchObject({ facilityLevel: 0, clinicalXp: 0, learningHistories: {} });
    expect(result.profile.campaigns).toHaveLength(2);
    expect(result.profile.campaigns[0]!.state).toEqual(before);
    expect(result.profile.campaigns[0]!.status).toBe("resumable");
    expect(env.session.state.levelFive!.progress.finishPageAcknowledgedAtFacilityTick).toBeNull();
  });

  it("keeps the same page, pause and frozen report through shell switches; reopens from Goals and More after dismissal", async () => {
    const env = await mount(createLevelFiveStateQaState("finish"));
    const before = structuredClone(env.session.state);
    await env.switchShell(true);
    expect(finishDialogs(env)[0]!.attributes.class).toContain("is-phone");
    expect(env.session.state).toEqual(before); expect(env.session.finishReportOpen).toBe(true);
    await env.click("Keep playing");
    await env.click("More clinic options"); await env.click("View finish report");
    expect(finishDialogs(env)).toHaveLength(1);
    await env.switchShell(false); expect(env.session.state.levelFive!.inspection).toEqual(before.levelFive!.inspection);
    await env.click("Keep playing"); await env.click("View finish report");
    expect(finishDialogs(env)).toHaveLength(1);
    expect(Object.values(env.session.state.operationReceipts).filter(receipt => receipt.commandType === "ACKNOWLEDGE_FINISH_PAGE")).toHaveLength(1);
  });

  it("reopens on reload before acknowledgment, stays dismissed afterward, and allows ordinary repeat booking without another victory", async () => {
    const first = await mount(createLevelFiveStateQaState("finish"));
    const pending = deserializeGameState(serializeGameState(first.session.state));
    await act(async () => first.root.unmount());
    const second = await mount(pending, true); expect(second.session.finishReportOpen).toBe(true);
    await second.click("Keep playing");
    const acknowledged = deserializeGameState(serializeGameState(second.session.state));
    await act(async () => second.root.unmount());
    const third = await mount(acknowledged);
    expect(finishDialogs(third)).toHaveLength(0);
    const history = structuredClone(third.session.state.levelFive!.progress.gameFinished);
    await third.click("Book another inspection");
    expect(third.session.state.levelFive!.inspection.status).toBe("preparing");
    expect(third.session.finishReportOpen).toBe(false);
    expect(third.session.state.levelFive!.progress.gameFinished).toEqual(history);
    await third.click("Cancel inspection"); expect(finishDialogs(third)).toHaveLength(0);
    expect(third.session.state.levelFive!.inspection.bestCompletedReport).toEqual(acknowledged.levelFive!.inspection.bestCompletedReport);
  });

  it("opens phone Inspection from Goals and handles browser Back from a category before returning to Goals", async () => {
    const env = await mount(createLevelFiveStateQaState("report"), true);
    await env.click("Inspections unlocked"); await env.click("View inspection");
    const tile = allElements(env.element, node => node.attributes.class === "inspection-category-tile")[0]!;
    await env.clickElement(tile);
    expect(env.doc.activeElement.textContent).toContain("Cleanliness");
    expect(env.element.textContent).toContain("← Back to report card");
    await env.back();
    expect(env.element.textContent).not.toContain("← Back to report card");
    expect(allElements(env.element, node => node.attributes.class === "inspection-category-tile")).toHaveLength(10);
    expect(env.doc.activeElement.attributes.class).toBe("inspection-category-tile");
    await env.back();
    expect(env.element.textContent).toContain("Current requirements"); expect(env.session.finishReportOpen).toBe(false);
  });

  it.each(["pre-goal", "eligible", "incomplete", "cancelled", "l4-ready"] as const)("does not open a finish page for %s in either shell", async scenario => {
    const env = await mount(createLevelFiveStateQaState(scenario));
    expect(env.session.finishReportOpen).toBe(false); expect(finishDialogs(env)).toHaveLength(0);
    await env.switchShell(true); expect(finishDialogs(env)).toHaveLength(0);
  });

  it("Escape cancels new-campaign confirmation first, then follows Keep playing through the shared acknowledgment", async () => {
    const env = await mount(createLevelFiveStateQaState("finish"), true);
    await env.click("Start new campaign");
    const event = { preventDefault: vi.fn() };
    await act(async () => { (testElementProps(finishDialogs(env)[0]!).onCancel as (event: unknown) => void)(event); });
    expect(event.preventDefault).toHaveBeenCalledOnce(); expect(env.element.textContent).toContain("Congratulations.");
    expect(env.session.state.levelFive!.progress.finishPageAcknowledgedAtFacilityTick).toBeNull();
    await act(async () => { (testElementProps(finishDialogs(env)[0]!).onCancel as (event: unknown) => void)(event); });
    expect(env.session.finishReportOpen).toBe(false); expect(env.newCampaign).not.toHaveBeenCalled();
  });

  it("routes the finish action to App's existing fresh founder flow, distinct from same-seed Restart", () => {
    const app = readFileSync(new URL("../App.tsx", import.meta.url), "utf8");
    expect(app).toContain("onCreateCampaign={() => onRequestNewCampaign(session.profile)}");
    expect(app).toContain('requestOpening(profile, undefined, "founder", guidanceEnabled)');
    const shell = readFileSync(new URL("../AppShell.tsx", import.meta.url), "utf8");
    expect(shell).toContain("onKeepPlaying={onCloseFinishReport} onStartNewCampaign={onCreateCampaign}");
  });
});
