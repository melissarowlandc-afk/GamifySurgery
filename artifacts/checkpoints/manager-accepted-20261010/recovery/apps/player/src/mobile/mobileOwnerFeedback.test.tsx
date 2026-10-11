import { act } from "react";
import { readFileSync } from "node:fs";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createInitialGameState, getEmergencyGlp1Status, PROTOTYPE_DOMAIN_CONTEXT, type GameState } from "@gamify-surgery/game-domain";
import type { FacilityCanvasProps } from "../facility";
import { appendLocalCampaign, createFreshProfile } from "../session/prototypeStorage";
import { usePrototypeSession, type PrototypeSession } from "../session/usePrototypeSession";
import { createPrototypePlayerView } from "../session/viewModels";
import MobileShell from "./MobileShell";
import { MobileGoalsChip } from "./MobileGoals";
import { describeMobileCharacter, describeMobileRoom, type MobileMapSelection } from "./map/selection";
import { allElements, cleanupPhoneTests, phoneFixture, phoneTestDom } from "./screenTestUtils";
import { testElementProps } from "./testDom";

const capture = vi.hoisted(() => ({ map: null as FacilityCanvasProps | null }));
vi.mock("../facility", () => ({ FacilityCanvas: (props: FacilityCanvasProps) => {
  capture.map = props; return <div data-testid="facility-canvas">Map</div>;
} }));
afterEach(async () => { await cleanupPhoneTests(); capture.map = null; });

async function mount(initialState: GameState = createInitialGameState()) {
  vi.useFakeTimers(); const env = phoneTestDom();
  const createText = env.doc.createTextNode.bind(env.doc);
  env.doc.createTextNode = text => {
    const node = createText(text);
    Object.defineProperty(node, "nodeValue", { get: () => node.textContent, set: (value: string) => { node.textContent = value; } });
    return node;
  };
  Object.assign(env.doc, { visibilityState: "visible" });
  Object.assign(env.browser, { setInterval, clearInterval });
  const values = new Map<string, string>();
  Object.assign(env.browser, { localStorage: { getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value), removeItem: (key: string) => values.delete(key) } });
  initialState.paused = true; initialState.encounters = {};
  const made = appendLocalCampaign({ ...createFreshProfile(), tutorialsEnabled: false }, initialState.founder, "MB9 Fixture", 1000, "mb9.fixture", false);
  initialState.campaignId = made.campaign.campaignId; made.campaign.state = initialState;
  let session!: PrototypeSession;
  const consult = vi.fn(() => session.runEmergencyGlp1Consultation());
  function Host() {
    session = usePrototypeSession({ profile: made.profile, notice: "Fixture loaded" });
    const view = createPrototypePlayerView(session.state, null, session.summaryVisible, session.selectedRoomDefinitionId,
      session.buildMode, session.selectedRoomInstanceId, session.placementOrientation, session.facilityCamera);
    return <MobileShell {...phoneFixture({ ...view, paused: session.state.paused, simulationSpeed: session.state.simulationSpeed,
      buildMode: session.buildMode, managementMode: session.managementMode, campaigns: session.campaigns,
      announcement: session.announcement, onRunEmergencyGlp1Consultation: consult, onTogglePause: session.togglePause,
      onSimulationSpeedChange: session.setSimulationSpeed, onMoveFounder: session.moveFounder,
      onSeatFounderInChair: session.seatFounderInChair, onSeatFounderAtFrontDesk: session.seatFounderAtFrontDesk,
      onDescribeCharacter: session.describeCharacter, onPraiseEmployee: session.praiseEmployee,
      onEnterBuildMode: session.enterBuildMode, onExitBuildMode: session.exitBuildMode, mobileBuildActions: session.mobileBuildActions,
    })} />;
  }
  await env.render(<Host />);
  const progress = () => Number(env.find(node => node.attributes.role === "progressbar" &&
    node.attributes["aria-label"] === "GLP-1 consultation cooldown").attributes["aria-valuenow"]);
  const assertProgress = () => {
    const elapsed = session.state.emergencyGlp1.lastUsedAtFacilityTick === null ? Infinity :
      session.state.facilityTick - session.state.emergencyGlp1.lastUsedAtFacilityTick;
    const expected = Math.max(0, Math.min(100, elapsed / PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.emergencyGlp1.cooldownMinutes * 100));
    expect(progress()).toBeCloseTo(expected, 10);
    const chip = env.find(node => node.attributes["data-phone-anchor"] === "emergency");
    expect(chip.style["--mobile-consult-progress"]).toBe(`${progress()}%`);
  };
  return { ...env, consult, progress, assertProgress, get session() { return session; },
    call: async (fn: (current: PrototypeSession) => void) => { await act(async () => fn(session)); },
    time: async (ms: number) => { await act(async () => vi.advanceTimersByTime(ms)); },
    get map() { return capture.map!; } };
}

describe("MB9 GLP-1 chip through the unchanged real session", () => {
  it("pays exactly once on one tap, including rapid double activation, and retains the ordinary receipt", async () => {
    const env = await mount(); const before = env.session.state;
    expect(env.progress()).toBe(100);
    const chip = env.button("GLP-1 consult · +$50"); const tap = testElementProps(chip).onClick as () => void;
    await act(async () => { tap(); tap(); });
    expect(env.consult).toHaveBeenCalledOnce();
    const next = env.session.state;
    expect(next.cash).toBe(before.cash + getEmergencyGlp1Status(before).payment);
    expect(next.serviceIncomeReceipts).toHaveLength(before.serviceIncomeReceipts.length + 1);
    expect(next.serviceIncomeReceipts.at(-1)).toMatchObject({ incomeLineId: "income.glp1_telehealth", actorKind: "founder",
      netCashDelta: getEmergencyGlp1Status(before).payment, completedAtFacilityTick: before.facilityTick });
    expect(Object.values(next.operationReceipts).filter(r => r.commandType === "RUN_EMERGENCY_GLP1_CONSULTATION")).toHaveLength(1);
    expect(next.emergencyGlp1.totalUses).toBe(before.emergencyGlp1.totalUses + 1); expect(env.progress()).toBe(0);
    expect(allElements(env.element, node => node.attributes.class?.startsWith("mobile-sheet") === true)).toHaveLength(0);
    await env.clickElement(env.find(node => node.attributes["data-phone-anchor"] === "emergency"));
    expect(env.consult).toHaveBeenCalledOnce(); expect(env.session.state).toBe(next);
    await env.click("More clinic options"); await env.click("GLP-1 consult info");
    expect(env.element.textContent).toContain("one consult per facility hour");
    expect(env.element.textContent).toContain(createPrototypePlayerView(next, null, false, null).emergencyGlp1.statusLabel);
    expect(env.element.textContent).not.toContain("Complete consult");
  });

  it("uses facility elapsed time across pauses and speed changes, reaches ready, and permits one new consult", async () => {
    const env = await mount(); const base = PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.clock.realMillisecondsPerFacilityMinuteAt1x;
    await env.click("GLP-1 consult · +$50"); env.assertProgress();
    const usedAt = env.session.state.facilityTick;
    await env.time(base * 10); expect(env.session.state.facilityTick).toBe(usedAt); expect(env.progress()).toBe(0);
    await env.call(s => s.togglePause()); await env.time(base * 10);
    expect(env.session.state.facilityTick - usedAt).toBe(10); env.assertProgress();
    await env.call(s => s.setSimulationSpeed(2)); await env.time(base * 5);
    expect(env.session.state.facilityTick - usedAt).toBe(20); env.assertProgress();
    await env.call(s => s.togglePause()); const held = env.progress(); await env.time(base * 10);
    expect(env.progress()).toBe(held); expect(env.session.state.facilityTick - usedAt).toBe(20);
    await env.call(s => s.setSimulationSpeed(4)); await env.time(base * 2); expect(env.progress()).toBe(held);
    await env.call(s => s.togglePause()); await env.time(base * 5);
    expect(env.session.state.facilityTick - usedAt).toBe(40); env.assertProgress();
    const remaining = getEmergencyGlp1Status(env.session.state).cooldownRemainingTicks;
    await env.time(remaining * base / 4); expect(env.progress()).toBe(100); env.assertProgress();
    expect(env.button("GLP-1 consult · +$50").attributes["aria-disabled"]).toBe("false");
    const before = env.session.state.cash; await env.click("GLP-1 consult · +$50");
    expect(env.consult).toHaveBeenCalledTimes(2); expect(env.session.state.cash).toBe(before + getEmergencyGlp1Status(env.session.state).payment);
    expect(env.progress()).toBe(0);
  });

  it("shows the existing Build prohibition and makes a blocked tap inert", async () => {
    const env = await mount(); await env.call(s => s.enterBuildMode());
    const before = env.session.state;
    const chip = env.find(node => node.attributes["data-phone-anchor"] === "emergency");
    expect(chip.textContent).toContain("Exit Build Mode before running the emergency consultation.");
    await env.clickElement(chip); expect(env.consult).not.toHaveBeenCalled(); expect(env.session.state).toBe(before);
  });
});

describe("MB9 interaction audit", () => {
  it("shows real staffed coverage on the chip without changing eligibility or issuing a manual consult", async () => {
    const state = createInitialGameState(); const suiteId = "mb9.staffed-suite";
    state.rooms.push({ id: suiteId, roomDefinitionId: "room.glp1_telehealth_suite", x: 29, y: 29,
      orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
      ...[24, 25, 26, 27, 28, 29, 30].map(y => ({ id: `mb9.hall.${y}`, roomDefinitionId: "room.hallway", x: 32, y,
        orientation: 0 as const, doorSide: null, upgradeLevel: 1 as const, cleanliness: 100 })));
    state.doors.push({ id: "mb9.front-door", roomId: "room.instance.founder_desk", side: "west", offset: 0, exterior: false },
      { id: "mb9.suite-door", roomId: suiteId, side: "east", offset: 1, exterior: false });
    state.employees.push({ id: "mb9.np", staffRoleDefinitionId: "staff.glp1_np", displayName: "Fixture Colleague",
      appearance: state.founder.appearance, hiredAtFacilityTick: 0, salaryPerExpenseInterval: 0, morale: 100, trainingLevel: 1,
      homeRoomInstanceId: suiteId, location: { x: 31, y: 30 }, path: [], pathIndex: 0, lastMovedAtFacilityTick: 0,
      lastPraisedAtFacilityTick: null, nextIdleActionAtFacilityTick: 999, facilityTask: null });
    const env = await mount(state); const before = env.session.state;
    const view = createPrototypePlayerView(before, null, false, null).emergencyGlp1;
    expect(view).toMatchObject({ visible: false, enabled: false, automationCapacity: 1 });
    expect(allElements(env.element, node => node.attributes["data-phone-anchor"] === "emergency")).toHaveLength(0);
    expect(env.element.textContent).not.toContain(view.statusLabel);
    expect(env.consult).not.toHaveBeenCalled(); expect(env.session.state).toBe(before);
    await env.click("More clinic options"); await env.click("GLP-1 consult info");
    expect(env.element.textContent).toContain(view.statusLabel);
  });

  it("advances directly when ready, ignores duplicate activation, and preserves Goals information in More", async () => {
    const env = phoneTestDom(); const advance = vi.fn(); const info = vi.fn();
    const view = { ...phoneFixture().progression, canLevelUp: true, nextLevelLabel: "Level 1" };
    await env.render(<MobileGoalsChip view={view} onLevelUp={advance} onShowGoals={info} />);
    const tap = testElementProps(env.button("Advance to Level 1")).onClick as () => void;
    await act(async () => { tap(); tap(); }); expect(advance).toHaveBeenCalledOnce(); expect(info).not.toHaveBeenCalled();
    await env.render(<MobileGoalsChip view={{ ...view, canLevelUp: false }} onLevelUp={advance} onShowGoals={info} />);
    await env.clickElement(env.find(node => node.attributes["data-phone-anchor"] === "goals-chip")); expect(info).toHaveBeenCalledOnce();
    await env.render(<MobileShell {...phoneFixture({ progression: view, onLevelUp: advance })} />);
    await env.click("More clinic options"); await env.click("Goals"); expect(env.element.textContent).toContain("Current requirements");
  });

  it("moves to a free chair on one map tap through the real session, without an inspector", async () => {
    const env = await mount();
    const chair = env.map.viewModel.founderChairs!.find(c => !c.occupied)!; expect(chair).toBeDefined();
    const before = env.session.state;
    await act(async () => env.map.onMobileSelection!({ kind: "chair", chair, name: "Chair" }));
    const receipts = Object.values(env.session.state.operationReceipts).filter(r => r.commandType === "SEAT_FOUNDER_IN_CHAIR");
    expect(receipts).toHaveLength(1); expect(receipts[0]!.status).toBe("applied");
    expect(env.session.state.cash).toBe(before.cash);
    expect(allElements(env.element, node => node.attributes["data-testid"] === "mobile-map-inspector")).toHaveLength(0);
    expect(env.element.textContent).not.toContain("Sit here");
  });

  it("takes the collapsed Goals tutorial hint directly to Goals and waits for the existing chart-close guard", async () => {
    const env = phoneTestDom(); const close = vi.fn();
    const props = phoneFixture({ tutorialStep: { id: "remaining-goals", eyebrow: "Clinic", title: "Review Goals", body: "Review the clinic requirements.",
      target: "goals", targetSelector: ".goals-panel" }, onCloseChart: close });
    const chart = { id: "fixture.chart", patientName: "Fixture", patientDetails: "Fixture", statusLabel: "Review", presentation: "Fixture story", questionPrompt: "Fixture?",
      answerChoices: [], terminalFeedbackNeedsAcknowledgment: false, summaryAvailable: false, summaryVisible: false, canFile: false, readOnly: true };
    await env.render(<MobileShell {...props} chart={chart} />);
    await env.click("Go to Goals ↓"); expect(close).toHaveBeenCalledOnce();
    expect(env.element.textContent).not.toContain("Current requirements");
    await env.render(<MobileShell {...props} chart={null} />); expect(env.element.textContent).toContain("Current requirements");
  });

  it("handles floor result, occupied/illegal seats and Front Desk in one tap, with brief rejected reasons", async () => {
    vi.useFakeTimers(); const env = phoneTestDom(); const move = vi.fn(); const seat = vi.fn(() => false); const desk = vi.fn(() => true);
    await env.render(<MobileShell {...phoneFixture({ onMoveFounder: move, onSeatFounderInChair: seat, onSeatFounderAtFrontDesk: desk })} />);
    const select = async (selection: MobileMapSelection) => { await act(async () => capture.map!.onMobileSelection!(selection)); };
    await select({ kind: "floor", destination: { x: 1, y: 2 }, accepted: true }); expect(move).not.toHaveBeenCalled();
    expect(env.element.textContent).not.toContain("Walk here"); // The scene already applied the move.
    await select({ kind: "floor", destination: { x: 1, y: 2 }, accepted: false });
    expect(env.element.textContent).toContain("No walkable route"); await act(async () => vi.advanceTimersByTime(1_800));
    expect(env.element.textContent).not.toContain("No walkable route");
    const chair = { roomInstanceId: "fixture.room", location: { x: 1, y: 2 }, seatId: "seat.fixture" };
    await select({ kind: "chair", chair: { ...chair, occupied: true }, name: "Chair" });
    expect(seat).not.toHaveBeenCalled(); expect(env.element.textContent).toContain("Seat occupied.");
    await select({ kind: "chair", chair, name: "Chair" }); expect(seat).toHaveBeenCalledExactlyOnceWith(chair.roomInstanceId, chair.location, chair.seatId);
    expect(env.element.textContent).toContain("Seat unavailable");
    await select({ kind: "front-desk", roomId: "fixture.room" }); expect(desk).toHaveBeenCalledOnce();
    expect(allElements(env.element, node => node.attributes["data-testid"] === "mobile-map-inspector")).toHaveLength(0);
  });

  it("opens character/room inspectors in one tap, while Praise, litter and water actions have no intermediary sheet", async () => {
    const env = phoneTestDom(); const praise = vi.fn(); const litter = vi.fn(); const water = vi.fn();
    const fixture = phoneFixture({ onPraiseEmployee: praise, onCollectLitter: litter, onRefillWaterCooler: water });
    await env.render(<MobileShell {...fixture} />);
    await act(async () => capture.map!.onMobileSelection!(describeMobileCharacter({ kind: "founder", id: "founder" }, fixture.facility)!));
    expect(env.find(node => node.attributes["data-testid"] === "mobile-map-inspector")).toBeDefined();
    await act(async () => capture.map!.onMobileSelection!(describeMobileRoom(fixture.facility.rooms[0]!, null)));
    expect(env.element.textContent).toContain("Room actions"); expect(env.element.textContent).not.toContain("Walk here");
    await act(async () => capture.map!.onPraiseEmployee!("employee.fixture")); expect(praise).toHaveBeenCalledExactlyOnceWith("employee.fixture");
    await act(async () => capture.map!.onMobileSelection!({ kind: "environment", action: "collect-litter", id: "litter.fixture", name: "Litter", status: "Collect" }));
    expect(litter).toHaveBeenCalledExactlyOnceWith("litter.fixture");
    await act(async () => capture.map!.onMobileSelection!({ kind: "environment", action: "refill-water", name: "Water", status: "Refill" }));
    expect(water).toHaveBeenCalledOnce();
    expect(allElements(env.element, node => node.attributes["data-testid"] === "mobile-map-inspector")).toHaveLength(0);
  });

  it("keeps only the 44px recenter control and defines a left-to-right facility-time fill without animation", () => {
    const css = readFileSync(new URL("./mobileShell.css", import.meta.url), "utf8");
    expect(css).toMatch(/\.mobile-map-recenter\s*\{[^}]*width:\s*44px;\s*min-height:\s*44px/);
    expect(css).toMatch(/\.mobile-consult-fill\s*\{[^}]*inset:\s*0 auto 0 0;[^}]*width:\s*var\(--mobile-consult-progress\)/);
    expect(css).not.toContain(".mobile-zoom");
  });
});
