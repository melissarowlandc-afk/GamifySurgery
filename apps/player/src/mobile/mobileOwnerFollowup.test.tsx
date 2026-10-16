import { act } from "react";
import { readFileSync } from "node:fs";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createInitialGameState, PROTOTYPE_DOMAIN_CONTEXT, type GameState } from "@gamify-surgery/game-domain";
import { createLevelFourRoomsQaContext } from "../../../../tests/fixtures/level-four-rooms";
import { createPediatricChartsQaState, PEDIATRIC_CHARTS_QA_ENCOUNTER_ID } from "../../../../tests/fixtures/pediatric-charts";
import type { FacilityCanvasProps } from "../facility";
import type { FacilityCharacterRef } from "../facility/types";
import { appendLocalCampaign, createFreshProfile } from "../session/prototypeStorage";
import { usePrototypeSession, type PrototypeSession } from "../session/usePrototypeSession";
import { createPrototypePlayerView } from "../session/viewModels";
import MobileShell from "./MobileShell";
import { MobileTopBar } from "./MobileTopBar";
import { describeMobileCharacter } from "./map/selection";
import { allElements, cleanupPhoneTests, noop, phoneFixture, phoneTestDom } from "./screenTestUtils";
import { testElementProps } from "./testDom";

const capture = vi.hoisted(() => ({ map: null as FacilityCanvasProps | null }));
vi.mock("../facility", () => ({ FacilityCanvas: (props: FacilityCanvasProps) => {
  capture.map = props; return <div data-testid="facility-canvas">Map</div>;
} }));
afterEach(async () => { await cleanupPhoneTests(); capture.map = null; });

async function mount(initialState = createInitialGameState()) {
  vi.useFakeTimers(); const env = phoneTestDom();
  const createText = env.doc.createTextNode.bind(env.doc);
  env.doc.createTextNode = text => {
    const node = createText(text);
    Object.defineProperty(node, "nodeValue", { get: () => node.textContent, set: (value: string) => { node.textContent = value; } });
    return node;
  };
  Object.assign(env.doc, { visibilityState: "visible" });
  Object.assign(env.browser, { innerWidth: 360, setInterval, clearInterval });
  const values = new Map<string, string>();
  Object.assign(env.browser, { localStorage: { getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value), removeItem: (key: string) => values.delete(key) } });
  const made = appendLocalCampaign({ ...createFreshProfile(), tutorialsEnabled: false }, initialState.founder,
    "MB9b Fixture", 1000, "mb9b.fixture", false);
  initialState.campaignId = made.campaign.campaignId; made.campaign.state = initialState;
  let session!: PrototypeSession;
  const pause = vi.fn(() => session.togglePause()); const open = vi.fn((id: string) => session.openPatient(id));
  function Host() {
    session = usePrototypeSession({ profile: made.profile, notice: "Fixture loaded" });
    const view = createPrototypePlayerView(session.state, session.state.openChartEncounterId, session.summaryVisible,
      session.selectedRoomDefinitionId, session.buildMode, session.selectedRoomInstanceId, session.placementOrientation, session.facilityCamera);
    return <MobileShell {...phoneFixture({ ...view, paused: session.state.paused, simulationSpeed: session.state.simulationSpeed,
      buildMode: session.buildMode, managementMode: session.managementMode, campaigns: session.campaigns,
      announcement: session.announcement, onTogglePause: pause, onSimulationSpeedChange: session.setSimulationSpeed,
      onOpenPatient: open, onCloseChart: session.closeChart, onDescribeCharacter: session.describeCharacter,
    })} />;
  }
  await env.render(<Host />);
  const select = async (character: FacilityCharacterRef) => {
    const selection = describeMobileCharacter(character, capture.map!.viewModel, session.describeCharacter);
    expect(selection).not.toBeNull(); await act(async () => capture.map!.onMobileSelection!(selection));
  };
  return { ...env, pause, open, select, get session() { return session; }, get map() { return capture.map!; },
    time: async (ms: number) => { await act(async () => vi.advanceTimersByTime(ms)); } };
}

describe("MB9b separate phone Pause and Play controls", () => {
  it("selects the requested state once through the existing clock action, with idempotent active taps and unchanged speeds", async () => {
    const state = createInitialGameState(); state.paused = false; state.encounters = {};
    const env = await mount(state); const base = PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.clock.realMillisecondsPerFacilityMinuteAt1x;
    const pressed = (paused: boolean) => {
      expect(env.button("Pause facility time").attributes["aria-pressed"]).toBe(String(paused));
      expect(env.button("Resume facility time").attributes["aria-pressed"]).toBe(String(!paused));
    };
    pressed(false); await env.click("Resume facility time"); expect(env.pause).not.toHaveBeenCalled();
    await env.time(base); expect(env.session.state.facilityTick - state.facilityTick).toBe(1);
    const pause = testElementProps(env.button("Pause facility time")).onClick as () => void;
    await act(async () => { pause(); pause(); }); expect(env.pause).toHaveBeenCalledOnce(); pressed(true);
    const held = env.session.state.facilityTick; await env.time(base * 5);
    expect(env.session.state.facilityTick).toBe(held);
    await env.click("Pause facility time"); expect(env.pause).toHaveBeenCalledOnce();
    await env.click("Facility speed 1x. Cycle speed"); expect(env.session.state.simulationSpeed).toBe(2);
    const play = testElementProps(env.button("Resume facility time")).onClick as () => void;
    await act(async () => { play(); play(); }); expect(env.pause).toHaveBeenCalledTimes(2); pressed(false);
    await env.time(base * 2); expect(env.session.state.facilityTick - held).toBe(4);
    await env.click("Facility speed 2x. Cycle speed"); expect(env.session.state.simulationSpeed).toBe(4);
    const atFour = env.session.state.facilityTick; await env.time(base);
    expect(env.session.state.facilityTick - atFour).toBe(4);
    await env.click("Facility speed 4x. Cycle speed"); expect(env.session.state.simulationSpeed).toBe(1);
    await env.click("Resume facility time"); expect(env.pause).toHaveBeenCalledTimes(2);
  });

  it.each([
    [{ buildMode: true }, "Exit Build Mode to resume."],
    [{ managementMode: true }, "Exit Management Mode to resume."],
    [{ referenceLocked: true }, "Close this dialog to resume."],
  ] as const)("disables both controls and preserves the visible lock reason for %j", async (lock, reason) => {
    const env = phoneTestDom(); const pause = vi.fn();
    await env.render(<MobileTopBar {...phoneFixture({ paused: true, onTogglePause: pause })} {...lock} onCash={noop} onMore={noop} />);
    for (const label of ["Pause facility time", "Resume facility time"]) {
      const button = env.button(label); expect(button.attributes.disabled).toBeDefined(); expect(button.attributes.title).toBe(reason);
      await act(async () => (testElementProps(button).onClick as () => void)());
    }
    expect(pause).not.toHaveBeenCalled(); expect(env.element.textContent).toContain(reason);
    expect(env.button("Facility speed 1x. Cycle speed").attributes.disabled).toBeDefined();
  });

  it("bounds the adjacent controls for a 360px top bar and defines dark active/light inactive 44px targets", () => {
    const css = readFileSync(new URL("./mobileShell.css", import.meta.url), "utf8");
    expect(css).toMatch(/\.mobile-clock-row\s*\{[^}]*grid-template-columns: minmax\(0, 1fr\) auto 44px auto/);
    expect(css).toMatch(/\.mobile-playback-controls button\s*\{[^}]*width: 68px; flex: 0 0 68px; min-height: 44px;[^}]*background: var\(--paper-raised\); color: var\(--ink\)/);
    expect(css).toMatch(/\.mobile-playback-controls button\[aria-pressed="true"\]\s*\{ background: var\(--ink\); color: var\(--paper-raised\)/);
    // The fake DOM cannot measure layout; the manager checks real 360px geometry and iPhone rendering.
  });
});

function pediatricState(): GameState {
  const state = createPediatricChartsQaState(createLevelFourRoomsQaContext());
  const child = state.encounters[PEDIATRIC_CHARTS_QA_ENCOUNTER_ID]!;
  child.checkInStatus = "checked_in"; child.lifecycle = "waiting_unopened"; child.patientMovement = null;
  state.paused = false; return state;
}

describe("MB9b patient and pediatric-parent one-tap chart path", () => {
  it.each(["patient", "parent"] as const)("one %s tap opens the child's real chart without an inspector or clock change", async kind => {
    const env = await mount(pediatricState()); const before = env.session.state;
    const parent = env.map.viewModel.retailExternalActors!.find(actor => actor.pediatricFamilyId)!;
    expect(parent.linkedEncounterId).toBe(PEDIATRIC_CHARTS_QA_ENCOUNTER_ID);
    await env.select(kind === "patient" ? { kind: "patient", id: PEDIATRIC_CHARTS_QA_ENCOUNTER_ID }
      : { kind: "companion", id: parent.instanceId });
    expect(env.open).toHaveBeenCalledExactlyOnceWith(PEDIATRIC_CHARTS_QA_ENCOUNTER_ID);
    expect(env.session.state.openChartEncounterId).toBe(PEDIATRIC_CHARTS_QA_ENCOUNTER_ID);
    expect(Object.values(env.session.state.operationReceipts).filter(receipt => receipt.commandType === "OPEN_CHART")).toMatchObject([{ status: "applied" }]);
    expect(allElements(env.element, node => node.attributes.class === "mobile-chart")).toHaveLength(1);
    expect(allElements(env.element, node => node.attributes["data-testid"] === "mobile-map-inspector")).toHaveLength(0);
    expect(env.session.state.paused).toBe(before.paused); expect(env.pause).not.toHaveBeenCalled();
    expect(env.session.state.facilityTick).toBe(before.facilityTick); expect(env.session.state.simulationSpeed).toBe(before.simulationSpeed);
  });

  it.each(["approaching", "awaiting_staff", "filed"] as const)("a %s child and parent keep one-tap inspection without opening a chart", async status => {
    const state = pediatricState(); const child = state.encounters[PEDIATRIC_CHARTS_QA_ENCOUNTER_ID]!;
    if (status === "filed") { child.lifecycle = "resolved"; child.resolutionReason = "completed"; child.resolvedAtFacilityTick = state.facilityTick; }
    else child.checkInStatus = status;
    const env = await mount(state); const before = env.session.state;
    await env.select({ kind: "patient", id: PEDIATRIC_CHARTS_QA_ENCOUNTER_ID });
    expect(env.find(node => node.attributes["data-testid"] === "mobile-map-inspector")).toBeDefined();
    const parent = env.map.viewModel.retailExternalActors!.find(actor => actor.pediatricFamilyId)!;
    await env.select({ kind: "companion", id: parent.instanceId });
    expect(env.find(node => node.attributes["data-testid"] === "mobile-map-inspector").textContent).toContain("Companion");
    expect(env.open).not.toHaveBeenCalled(); expect(env.session.state).toBe(before);
    expect(allElements(env.element, node => node.attributes.class === "mobile-chart")).toHaveLength(0);
  });

  it.each(["staff", "service-visitor", "retail-visitor", "companion", "ambient", "founder"] as const)("%s keeps inspection without aliasing to a patient chart", async kind => {
    const env = phoneTestDom(); const open = vi.fn();
    const props = phoneFixture({ onOpenPatient: open, onDescribeCharacter: () => ({ name: "Fixture actor", activity: "Fixture activity" }) });
    await env.render(<MobileShell {...props} />);
    const selection = describeMobileCharacter({ kind, id: "fixture.actor" }, props.facility, props.onDescribeCharacter)!;
    await act(async () => capture.map!.onMobileSelection!(selection));
    expect(env.find(node => node.attributes["data-testid"] === "mobile-map-inspector").textContent).toContain("Fixture activity");
    expect(env.element.textContent).toContain("Fixture actor");
    expect(open).not.toHaveBeenCalled();
  });

  it("lets the existing open-chart action refuse a request without fabricating a chart sheet", async () => {
    const env = phoneTestDom(); const open = vi.fn(); const state = pediatricState();
    const view = createPrototypePlayerView(state, null, false, null);
    const props = phoneFixture({ ...view, onOpenPatient: open, onDescribeCharacter: () => ({ name: "Fixture patient", activity: "Waiting" }) });
    await env.render(<MobileShell {...props} />);
    await act(async () => capture.map!.onMobileSelection!(describeMobileCharacter({ kind: "patient", id: PEDIATRIC_CHARTS_QA_ENCOUNTER_ID }, props.facility, props.onDescribeCharacter)!));
    expect(open).toHaveBeenCalledExactlyOnceWith(PEDIATRIC_CHARTS_QA_ENCOUNTER_ID);
    expect(allElements(env.element, node => node.attributes.class === "mobile-chart")).toHaveLength(0);
  });
});
