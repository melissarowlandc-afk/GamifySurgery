import { act } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createInitialGameState, type GameState } from "@gamify-surgery/game-domain";
import { appendLocalCampaign, createFreshProfile } from "../../session/prototypeStorage";
import { usePrototypeSession, type PrototypeSession } from "../../session/usePrototypeSession";
import { getTutorialTickIntervalMs } from "../../session/tutorialTiming";
import { createPrototypePlayerView } from "../../session/viewModels";
import { cleanupPhoneTests, phoneFixture, phoneTestDom } from "../screenTestUtils";
import { testElementProps } from "../testDom";
import { MobilePerformanceTools } from "./MobilePrototypeTools";
import MobileShell from "../MobileShell";
import type { FacilityCanvasProps } from "../../facility";
import { MOBILE_BUILD_UNDO_LIMIT } from "./buildHistory";

const capture = vi.hoisted(() => ({ map: null as FacilityCanvasProps | null }));
vi.mock("../../facility", () => ({ FacilityCanvas: (props: FacilityCanvasProps) => { capture.map = props; return <div>Map</div>; } }));
afterEach(async () => { await cleanupPhoneTests(); vi.restoreAllMocks(); capture.map = null; });

async function sessionDom(showShell = false) {
  const env = phoneTestDom(); vi.useFakeTimers();
  Object.assign(env.doc, { visibilityState: "visible" }); Object.assign(env.browser, { setInterval, clearInterval });
  const state = createInitialGameState(); state.facilityLevel = 4; state.cash = 100_000; state.cashCents = 10_000_000; state.encounters = {};
  const made = appendLocalCampaign({ ...createFreshProfile(), tutorialsEnabled: false }, state.founder, "MB7", 1000, "mb7.fixture", false);
  state.campaignId = made.campaign.campaignId; made.campaign.state = state;
  let session!: PrototypeSession;
  function Host() {
    session = usePrototypeSession({ profile: made.profile, notice: "MB7" });
    if (!showShell) return <div>Session</div>;
    const view = createPrototypePlayerView(session.state, null, false, null);
    return <MobileShell {...phoneFixture({ ...view, campaigns: session.campaigns, paused: session.state.paused,
      simulationSpeed: session.state.simulationSpeed, onTogglePause: session.togglePause,
      onSimulationSpeedChange: session.setSimulationSpeed, mobileBuildActions: session.mobileBuildActions })} />;
  }
  await env.render(<Host />);
  const call = async (callback: (session: PrototypeSession) => void) => act(async () => callback(session));
  return { ...env, call, get session() { return session; } };
}

describe("mobile performance shell and session isolation", () => {
  it("passes full-cover versus bottom-sheet presentation without changing Pause or speed", async () => {
    const env = phoneTestDom(); const onTogglePause = vi.fn(); const onSimulationSpeedChange = vi.fn();
    const props = phoneFixture({ onTogglePause, onSimulationSpeedChange });
    await env.render(<MobileShell {...props} />); expect(capture.map?.mobileMapCovered).toBe(false);
    await env.click("Patients"); expect(capture.map?.mobileMapCovered).toBe(true);
    await env.click("Clinic"); expect(capture.map?.mobileMapCovered).toBe(false);
    await env.clickElement(env.find(node => node.attributes["data-phone-anchor"] === "goals-chip"));
    expect(capture.map?.mobileMapCovered).toBe(true);
    await env.click("Close Goals"); await env.click("More"); expect(capture.map?.mobileMapCovered).toBe(false);
    expect(onTogglePause).not.toHaveBeenCalled(); expect(onSimulationSpeedChange).not.toHaveBeenCalled();
  });
  it("map cover leaves the real session interval, facility ticks and state behavior running", async () => {
    const env = await sessionDom(true);
    const interval = getTutorialTickIntervalMs(env.session.state, false);
    const before = env.session.state.facilityTick;
    await act(async () => vi.advanceTimersByTime(interval)); expect(env.session.state.facilityTick).toBe(before + 1);
    await env.click("Patients"); expect(capture.map?.mobileMapCovered).toBe(true);
    expect(env.session.state.paused).toBe(false);
    await act(async () => vi.advanceTimersByTime(interval)); expect(env.session.state.facilityTick).toBe(before + 2);
    await env.click("Clinic"); expect(capture.map?.mobileMapCovered).toBe(false);
    await act(async () => vi.advanceTimersByTime(interval)); expect(env.session.state.facilityTick).toBe(before + 3);
  });
  it.each([true, false])("bounds only mobile history (enabled=%s), retaining whole newest undo snapshots", async mobile => {
    const env = await sessionDom(); await env.call(session => { session.mobileBuildActions.setHistoryLimit?.(mobile); session.enterBuildMode(); });
    await env.call(session => session.beginPlacement("room.hallway"));
    const snapshots: GameState[] = [structuredClone(env.session.state)];
    for (let index = 0; index < 35; index++) {
      await env.call(session => expect(session.placeRoom(index % 20 + 1, 2 + Math.floor(index / 20))).toBe(true));
      snapshots.push(structuredClone(env.session.state));
    }
    expect(env.session.buildUndoCount).toBe(mobile ? MOBILE_BUILD_UNDO_LIMIT : 35);
    const count = mobile ? 30 : 35;
    for (let index = 0; index < count; index++) {
      await env.call(session => session.undoBuildAction());
      expect(env.session.state).toEqual(snapshots[34 - index]);
    }
    expect(env.session.buildUndoCount).toBe(0); expect(env.session.buildUndoLabel).toBeNull();
    expect(env.session.state.rooms).toHaveLength(snapshots[mobile ? 5 : 0]!.rooms.length);
  });
  it("coalesces each mobile hallway stroke before applying the cap, then releases the cap for desktop", async () => {
    const env = await sessionDom(); await env.call(session => { session.mobileBuildActions.setHistoryLimit?.(true); session.enterBuildMode(); });
    await env.call(session => session.beginPlacement("room.hallway"));
    const before = structuredClone(env.session.state);
    await env.call(session => expect(session.mobileBuildActions.commitHallway([{ x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 }])).toBe(true));
    expect(env.session.buildUndoCount).toBe(1);
    await env.call(session => session.undoBuildAction()); expect(env.session.state).toEqual(before);
    await env.call(session => session.mobileBuildActions.setHistoryLimit?.(false));
    for (let i = 0; i < 31; i++) await env.call(session => { session.placeRoom(i % 20 + 1, 2 + Math.floor(i / 20)); });
    expect(env.session.buildUndoCount).toBe(31);
  });
  it("mounts and releases the history policy only through the lazy phone shell", async () => {
    const env = phoneTestDom(); const setHistoryLimit = vi.fn();
    await env.render(<MobileShell {...phoneFixture({ mobileBuildActions: {
      setHistoryLimit, previewPlacement: vi.fn(), previewHallway: vi.fn(), previewDoor: vi.fn(), commitHallway: vi.fn(),
    } })} />);
    expect(setHistoryLimit).toHaveBeenCalledExactlyOnceWith(true);
    await env.render(<div>Desktop</div>); expect(setHistoryLimit).toHaveBeenLastCalledWith(false);
  });
});

describe("phone heavy prototype tools", () => {
  it("does not execute fast-forward before Confirm; Cancel and rapid double activation are safe", async () => {
    const env = phoneTestDom(); const props = phoneFixture(); const forward = vi.fn(); const pause = vi.fn();
    await env.render(<MobilePerformanceTools view={props.development} paused={false} tutorialsEnabled={false}
      onFastForward={forward} onAddMoney={vi.fn()} onTogglePause={pause} onRestart={vi.fn()} onTutorialsEnabledChange={vi.fn()} />);
    await env.click(props.development.fastForwardLabel); expect(forward).not.toHaveBeenCalled(); expect(pause).not.toHaveBeenCalled();
    await env.click("Cancel"); expect(forward).not.toHaveBeenCalled();
    await env.click(props.development.fastForwardLabel);
    const confirm = testElementProps(env.button(`Confirm ${props.development.fastForwardLabel}`)).onClick as () => void;
    await act(async () => { confirm(); confirm(); }); expect(forward).toHaveBeenCalledOnce(); expect(pause).not.toHaveBeenCalled();
  });
  it("adds prototype money and opens read-only FSRS cards in one tap while retaining Restart", async () => {
    const env = phoneTestDom(); const props = phoneFixture(); const money = vi.fn();
    await env.render(<MobilePerformanceTools view={props.development} paused={false} tutorialsEnabled={false}
      onFastForward={vi.fn()} onAddMoney={money} onTogglePause={vi.fn()} onRestart={vi.fn()} onTutorialsEnabledChange={vi.fn()} />);
    await env.click(props.development.addMoneyLabel); expect(money).toHaveBeenCalledOnce();
    expect(env.element.textContent).not.toContain(props.development.learningCards[0]!.conceptLabel);
    await env.click("Inspect FSRS cards"); expect(env.element.textContent).toContain(props.development.learningCards[0]!.conceptLabel);
    expect(env.element.textContent).not.toContain("Confirm Inspect FSRS cards");
    await env.click("Close FSRS cards"); expect(env.element.textContent).not.toContain(props.development.learningCards[0]!.conceptLabel);
    expect(env.button("Restart Campaign")).toBeDefined();
  });
});
