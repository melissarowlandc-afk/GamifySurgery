import { act } from "react";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createInitialGameState, getRoomDefinition, getRoomResaleValue, type GameState } from "@gamify-surgery/game-domain";
import { appendLocalCampaign, createFreshProfile, PROTOTYPE_PROFILE_KEY } from "../../session/prototypeStorage";
import { usePrototypeSession, type PrototypeSession } from "../../session/usePrototypeSession";
import { createPrototypePlayerView } from "../../session/viewModels";
import type { FacilityCanvasProps } from "../../facility";
import MobileShell from "../MobileShell";
import { allElements, cleanupPhoneTests, phoneFixture, phoneTestDom } from "../screenTestUtils";
import { testElementProps } from "../testDom";
import type { MobileBuildIntent } from "./types";
import { describeRoomUpgradeBenefit } from "../../session/buildModePresentation";
import { getApprovedPlacementOrientations } from "../../facility/roomVisualLayout";
import { FacilityScene, type FacilitySceneBridge } from "../../facility/FacilityScene";
import type { FacilityRoomView } from "../../facility/types";
import type { DoorInteractionGeometry } from "../../facility/doorInteractionGeometry";
import { installMobileCanvasResolution } from "../performance/canvasResolution";

const capture = vi.hoisted(() => ({ map: null as FacilityCanvasProps | null }));
vi.mock("../../facility", () => ({ FacilityCanvas: (props: FacilityCanvasProps) => { capture.map = props; return <div data-testid="facility-canvas">Map</div>; } }));
vi.mock("phaser", () => ({ default: { Scene: class {}, Scenes: { Events: { SHUTDOWN: "shutdown" } } } }));
afterEach(async () => { await cleanupPhoneTests(); capture.map = null; });

function initial() { const state = createInitialGameState(); state.facilityLevel = 3; state.cash = 10_000; state.cashCents = 1_000_000; state.encounters = {}; state.paused = true; return state; }
function addWaiting(state: GameState) {
  state.rooms.push({ id: "phone.waiting", roomDefinitionId: "room.waiting", x: 3, y: 3, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 });
  return state;
}

async function mount(initialState = initial()) {
  vi.useFakeTimers(); const env = phoneTestDom();
  // React updates text nodes through nodeValue; extend only this test's document.
  const createText = env.doc.createTextNode.bind(env.doc);
  env.doc.createTextNode = text => {
    const node = createText(text);
    Object.defineProperty(node, "nodeValue", { get: () => node.textContent, set: (value: string) => { node.textContent = value; } });
    return node;
  };
  Object.assign(env.doc, { visibilityState: "visible" });
  Object.assign(env.browser, { setInterval, clearInterval });
  const values = new Map<string, string>();
  const storage = { getItem: (key: string) => values.get(key) ?? null,
    setItem: vi.fn((key: string, value: string) => { values.set(key, value); }), removeItem: vi.fn((key: string) => values.delete(key)) };
  Object.assign(env.browser, { localStorage: storage });
  const made = appendLocalCampaign({ ...createFreshProfile(), tutorialsEnabled: false }, initialState.founder, "MB5 Fixture", 1000, "mb5.fixture", false);
  initialState.campaignId = made.campaign.campaignId;
  made.campaign.state = initialState;
  let session!: PrototypeSession;
  const place = vi.fn((x: number, y: number, orientation?: 0 | 90 | 180 | 270) => session.placeRoom(x, y, orientation));
  const sell = vi.fn((id: string, token?: string) => session.sellSelectedRoom(id, token));
  function Host() {
    session = usePrototypeSession({ profile: made.profile, notice: "Fixture loaded" });
    const view = createPrototypePlayerView(session.state, null, session.summaryVisible, session.selectedRoomDefinitionId,
      session.buildMode, session.selectedRoomInstanceId, session.placementOrientation, session.facilityCamera);
    return <MobileShell {...phoneFixture({ ...view, paused: session.state.paused, simulationSpeed: session.state.simulationSpeed,
      buildMode: session.buildMode, managementMode: session.managementMode, buildUndoCount: session.buildUndoCount,
      buildUndoLabel: session.buildUndoLabel, movingRoomInstanceId: session.movingRoomInstanceId,
      buildExitBlockedReason: session.buildExitBlockedReason, buildExitBlockedIssues: session.buildExitBlockedIssues,
      placementOrientation: session.placementOrientation, mobileBuildActions: session.mobileBuildActions,
      campaigns: session.campaigns, announcement: session.announcement,
      onEnterBuildMode: session.enterBuildMode, onExitBuildMode: session.exitBuildMode,
      onBeginPlacement: session.beginPlacement, onCancelPlacement: session.cancelPlacement, onRotatePlacement: session.rotatePlacement,
      onPlaceRoom: place, onSelectRoom: session.selectRoom, onBeginMoveSelectedRoom: session.beginMoveSelectedRoom,
      onUpgradeSelectedRoom: session.upgradeSelectedRoom, onSellSelectedRoom: sell,
      onPlaceDoor: session.placeDoor, onRemoveDoor: session.removeDoor, onUndoBuildAction: session.undoBuildAction,
    })} />;
  }
  await env.render(<Host />);
  const call = async (fn: (session: PrototypeSession) => void) => { await act(async () => { fn(session); }); };
  const intent = async (event: MobileBuildIntent) => { await act(async () => capture.map!.mobileBuild!.onIntent(event)); };
  const confirm = async (kind: string, twice = false) => {
    const button = env.find(node => node.attributes["data-phone-build-confirm"] === kind);
    expect(button.attributes.disabled).toBeUndefined();
    const onClick = testElementProps(button).onClick as () => void;
    await act(async () => { onClick(); if (twice) onClick(); });
  };
  const choose = async (id: string) => { await env.clickElement(env.find(node => id === "room.hallway"
    ? node.attributes["data-build-tool"] === "hallway" : node.attributes["data-build-room-option"] === id)); };
  const profileWrites = () => storage.setItem.mock.calls.filter(([key]) => key === PROTOTYPE_PROFILE_KEY);
  return { ...env, call, intent, confirm, choose, place, sell, storage, profileWrites, get session() { return session; },
    get map() { return capture.map!; } };
}

/** Real scene methods, wall geometry, Phaser pointer/end dispatch and shared session; no mocked picking or door intent. */
function doorScene(env: Awaited<ReturnType<typeof mount>>) {
  // Skip Phaser's browser graphics feature probes in this non-rendering harness.
  vi.stubGlobal("importScripts", vi.fn());
  const require = createRequire(import.meta.url);
  const phaserRoot = dirname(dirname(require.resolve("phaser")));
  const Pointer = require(join(phaserRoot, "src/input/Pointer.js"));
  const InputPlugin = require(join(phaserRoot, "src/input/InputPlugin.js"));
  const InputManager = require(join(phaserRoot, "src/input/InputManager.js"));
  const ScaleManager = require(join(phaserRoot, "src/scale/ScaleManager.js"));
  const scene = Object.create(FacilityScene.prototype) as {
    bridge: FacilitySceneBridge; scale: { width: number; height: number };
    layout: { originX: number; originY: number; tileSize: number };
    input: { processDownEvents: (pointer: unknown) => void; processUpEvents: (pointer: unknown) => void };
    game: { canvas: EventTarget }; events: { once: ReturnType<typeof vi.fn> }; time: { now: number };
    mobileInputSignature: string; bindInput: () => void; endHallwayPaint: ReturnType<typeof vi.fn>;
    getDoorGeometry: (room: FacilityRoomView, side: "north" | "east" | "south" | "west", offset: number) => DoorInteractionGeometry;
  };
  const canvasTop = 114.5;
  const canvas = Object.assign(new EventTarget(), { width: 360, height: 370, style: { width: "360px", height: "370px" },
    getBoundingClientRect: () => ({ left: 0, top: canvasTop, width: Number.parseFloat(canvas.style.width), height: Number.parseFloat(canvas.style.height) }) });
  Object.assign(env.doc, { documentElement: { clientLeft: 0, clientTop: 0 } });
  const scale = new ScaleManager({ canvas }); scale.canvas = canvas; scale.resize(360, 370);
  const context = { setTransform: vi.fn(), resetTransform: vi.fn() } as unknown as CanvasRenderingContext2D;
  const resolution = installMobileCanvasResolution(canvas as unknown as HTMLCanvasElement, context, scale);
  resolution.resize(360, 370, 2);
  scale.on("resize", () => resolution.resize(scale.width, scale.height, 2));
  // The Doors controls are shorter than the ghost controls, so the map grows.
  // Use Phaser's real NONE resize/refresh order, not an idealized CSS transform.
  scale.resize(360, 461);
  const manager = Object.assign(Object.create(InputManager.prototype), { game: { canvas }, scaleManager: scale });
  // InputPlugin's actual dispatch checks native Touch.target against the game canvas.
  scene.input = Object.assign(Object.create(InputPlugin.prototype), { _events: Object.create(null), _eventsCount: 0,
    _temp: [], _eventData: { cancelled: false }, manager, isActive: () => true, addPointer: vi.fn() });
  scene.game = { canvas }; scene.events = { once: vi.fn() }; scene.time = { now: 0 }; scene.mobileInputSignature = "";
  scene.scale = scale;
  // Manager's 360x740/DPR2 room view: 51 CSS px/tile, exam south-center (180.5,531.5).
  scene.layout = { originX: -1630, originY: -1011, tileSize: 51 };
  scene.endHallwayPaint = vi.fn();
  const sync = () => { scene.bridge = { ...env.map, mobileInput: true }; };
  sync(); scene.bindInput();
  const pointer = new Pointer(manager, 1);
  const tap = async (x: number, y: number) => {
    sync(); const touch = { identifier: 1, target: canvas, pageX: x, pageY: y };
    await act(async () => {
      scene.time.now += 400; pointer.touchstart(touch, { timeStamp: scene.time.now }); scene.input.processDownEvents(pointer);
      scene.time.now += 80; pointer.touchend(touch, { timeStamp: scene.time.now }); scene.input.processUpEvents(pointer);
    });
    sync();
  };
  return { scene, tap, canvasTop, scale, canvas, resolution };
}

describe("native phone Build through the real shared session", () => {
  it("MB9c real scene adds the exam-above-Front-Desk shared-wall door on one native touch, removes it and offers Undo", async () => {
    const state = createInitialGameState(); state.paused = true; state.cash = 1_000; state.cashCents = 100_000; state.encounters = {};
    const env = await mount(state); expect(env.session.state.rooms).toHaveLength(1);
    expect(env.map.viewModel.rooms[0]).toMatchObject({ tileX: 33, tileY: 28, width: 5, height: 4 });
    await env.click("Build"); await env.choose("room.examination");
    await env.intent({ kind: "ghost", point: { x: 34, y: 26 } }); const beforePlace = env.session.state;
    await env.confirm("placement"); const placed = env.session.state;
    expect(placed.rooms).toHaveLength(2); expect(placed.cash).toBe(beforePlace.cash - 160);
    expect(env.map.viewModel.placement).toBeNull(); expect(env.map.viewModel.buildDoorTool).toBe("place");
    const exam = env.map.viewModel.rooms.find(room => room.definitionId === "room.examination")!;
    const native = doorScene(env); const geometry = native.scene.getDoorGeometry(exam, "south", 1);
    expect(geometry.center).toEqual({ x: 180.5, y: 417 });
    expect(native.canvas.width).toBe(720); expect(native.canvas.height).toBe(922);
    expect(env.map.mobileBuild!.doors.filter(section => section.roomId === exam.instanceId && section.side === "south" && section.validation.valid)).toHaveLength(3);
    await native.tap(180.5, 528.5);
    expect(env.session.state.doors).toHaveLength(2); expect(env.session.buildExitBlockedReason).toBeNull();
    expect(env.session.state.cash).toBe(placed.cash); expect(env.session.buildUndoCount).toBe(2);
    expect(Object.values(env.session.state.operationReceipts).filter(receipt => receipt.commandType === "PLACE_DOOR")).toMatchObject([{ status: "applied" }]);
    const added = env.session.state;
    await native.tap(geometry.center.x, geometry.center.y + native.canvasTop);
    expect(env.session.state.doors).toHaveLength(1); expect(env.element.textContent).toContain("Door removed · Undo");
    expect(env.session.buildUndoCount).toBe(3); await env.click("Undo door removal"); expect(env.session.state).toBe(added);
  });
  it("catalog has existing art, room size/price/upkeep/limits/unlock/reasons and My Rooms", async () => {
    const env = await mount(); await env.click("Build");
    expect(env.session.buildMode).toBe(true); expect(env.session.state.paused).toBe(true);
    expect(env.element.textContent).toContain("New Rooms"); expect(env.element.textContent).toContain("Unlock Level");
    expect(env.element.textContent).toContain("upkeep / hr"); expect(env.element.textContent).toContain("built");
    const art = env.find(node => node.tagName === "CANVAS" && node.attributes.role === "img"); expect(art.attributes["aria-label"]).toContain("art");
    await env.click("My Rooms"); expect(env.element.textContent).toContain("Open Front Desk");
    expect(env.element.textContent).toContain("construction"); expect(env.element.textContent).toContain("Unlock Level");
    await env.click("Close Build"); expect(env.session.buildMode).toBe(true); // Close the catalog; Done owns guarded exit.
  });
  it("ghost previews do not write or mutate; ✓ dispatches exactly one placement command even before rerender", async () => {
    const env = await mount(); await env.click("Build"); await env.choose("room.waiting");
    const before = env.session.state; const cash = before.cash; const writes = env.profileWrites().length;
    await env.intent({ kind: "ghost", point: { x: 0, y: 0 } });
    expect(env.session.state).toBe(before); expect(env.profileWrites()).toHaveLength(writes); expect(env.place).not.toHaveBeenCalled();
    expect(env.map.mobileInput).toBe(true); expect(env.map.mobileBuild?.ghost?.valid).toBe(true);
    await env.confirm("placement", true);
    expect(env.place).toHaveBeenCalledExactlyOnceWith(0, 0, 0);
    expect(env.session.state.rooms).toHaveLength(before.rooms.length + 1);
    expect(env.session.state.cash).toBe(cash - getRoomDefinition("room.waiting")!.constructionCost);
    expect(env.session.buildUndoCount).toBe(1); expect(env.profileWrites()).toHaveLength(writes + 1);
    expect(env.map.mobileBuild?.doors.length).toBeGreaterThan(0); // New rooms arm the same Doors tool.
  });
  it("invalid ghost disables ✓ and presents the actual reason; Cancel spends nothing", async () => {
    const env = await mount(); await env.click("Build"); await env.choose("room.waiting");
    const before = env.session.state; const front = before.rooms[0]!;
    await env.intent({ kind: "ghost", point: { x: front.x, y: front.y } });
    expect(env.map.mobileBuild?.ghost).toEqual({ x: front.x, y: front.y,
      ...env.session.mobileBuildActions.previewPlacement(front.x, front.y, 0) });
    expect(env.map.mobileBuild?.ghost?.valid).toBe(false); expect(env.element.textContent).toContain("overlaps an existing room");
    expect(env.find(node => node.attributes["data-phone-build-confirm"] === "placement").attributes.disabled).toBeDefined();
    await env.click("✕ Cancel"); expect(env.session.selectedRoomDefinitionId).toBeNull(); expect(env.session.state).toBe(before);
  });
  it("Rotate offers only approved new-room orientations and keeps the existing placement command", async () => {
    const env = await mount(); await env.click("Build"); await env.choose("room.waiting");
    await env.intent({ kind: "ghost", point: { x: 0, y: 0 } }); const before = env.session.state;
    await env.click("↻ Rotate"); expect(env.session.state).toBe(before);
    expect(env.session.placementOrientation).toBe(getApprovedPlacementOrientations("room.waiting")[1]);
    expect(env.map.mobileBuild!.ghost).toMatchObject({ x: 0, y: 0, valid: true });
    await env.confirm("placement"); expect(env.place).toHaveBeenCalledExactlyOnceWith(0, 0, 270);
    expect(env.session.state.rooms.at(-1)).toMatchObject({ roomDefinitionId: "room.waiting", orientation: 270 });
    await env.click("Room catalog"); await env.choose("room.bathroom");
    expect(env.element.textContent).not.toContain("↻ Rotate");
  });
  it("choosing the same catalog room again clears the prior ghost and requests a fresh centered preview", async () => {
    const env = await mount(); await env.click("Build"); await env.choose("room.waiting");
    await env.intent({ kind: "ghost", point: { x: 0, y: 0 } }); const key = env.map.mobileBuild!.placementKey;
    await env.click("Room catalog"); await env.choose("room.waiting");
    expect(env.map.mobileBuild!.ghost).toBeNull(); expect(env.map.mobileBuild!.placementKey).not.toBe(key);
    expect(env.place).not.toHaveBeenCalled();
  });
  it("move starts at the current spot and uses MOVE_ROOM once, with no cost or unsupported rotation", async () => {
    const env = await mount(addWaiting(initial())); await env.click("Build");
    await act(async () => env.map.onSelectRoom!("phone.waiting")); await env.click("Move");
    expect(env.map.mobileBuild?.initialGhost).toEqual({ x: 3, y: 3 });
    expect(env.element.textContent).not.toContain("↻ Rotate");
    await env.intent({ kind: "ghost", point: env.map.mobileBuild!.initialGhost! });
    expect(env.map.mobileBuild?.ghost?.valid).toBe(true);
    const cash = env.session.state.cash;
    await env.intent({ kind: "ghost", point: { x: 8, y: 3 } }); await env.confirm("placement", true);
    expect(env.place).toHaveBeenCalledExactlyOnceWith(8, 3, 0);
    expect(env.session.state.rooms.find(room => room.id === "phone.waiting")).toMatchObject({ x: 8, y: 3 });
    expect(env.session.state.cash).toBe(cash); expect(env.session.buildUndoCount).toBe(1);
    expect(Object.values(env.session.state.operationReceipts).filter(receipt => receipt.commandType === "MOVE_ROOM")).toHaveLength(1);
  });
  it("one legal wall tap adds a door; one existing-door tap removes it with toast Undo and persistent Undo", async () => {
    const state = initial(); const front = state.rooms[0]!;
    state.rooms.push({ id: "phone.exam", roomDefinitionId: "room.examination", x: front.x, y: front.y - 2,
      orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 });
    const env = await mount(state); await env.click("Build"); await env.call(session => session.selectRoom("phone.exam")); await env.click("Doors · $0");
    const legal = env.map.mobileBuild!.doors.find(section => section.roomId === "phone.exam" && section.validation.valid && section.request.kind === "add")!;
    expect(legal).toBeDefined(); const before = env.session.state; const writes = env.profileWrites().length;
    await env.intent({ kind: "door", id: legal.id });
    const withDoor = env.session.state;
    expect(withDoor.doors).toHaveLength(before.doors.length + 1); expect(env.session.buildUndoCount).toBe(1);
    expect(withDoor.cash).toBe(before.cash); expect(env.profileWrites()).toHaveLength(writes + 1);
    expect(Object.values(withDoor.operationReceipts).filter(receipt => receipt.commandType === "PLACE_DOOR")).toMatchObject([{ status: "applied" }]);
    expect(env.element.textContent).not.toMatch(/✓ (Add|Remove) door/);
    expect(allElements(env.element, node => node.attributes["data-phone-build-confirm"] === "door")).toHaveLength(0);
    const added = env.map.mobileBuild!.doors.find(section => section.id === legal.id)!;
    expect(added.request.kind).toBe("remove"); await env.intent({ kind: "door", id: added.id });
    expect(env.session.state.doors).toHaveLength(before.doors.length); expect(env.session.buildUndoCount).toBe(2);
    expect(env.element.textContent).toContain("Door removed · Undo");
    expect(env.profileWrites()).toHaveLength(writes + 2);
    expect(Object.values(env.session.state.operationReceipts).filter(receipt => receipt.commandType === "REMOVE_DOOR")).toMatchObject([{ status: "applied" }]);
    await env.click("Undo door removal"); expect(env.session.state).toBe(withDoor); expect(env.session.buildUndoCount).toBe(1);
    expect(env.element.textContent).not.toContain("Door removed");
    await env.intent({ kind: "door", id: added.id }); expect(env.session.buildUndoCount).toBe(2);
    await act(async () => vi.advanceTimersByTime(3_000));
    expect(allElements(env.element, node => node.attributes.class === "mobile-map-toast mobile-door-toast")).toHaveLength(0);
    await env.click("Undo (2)"); expect(env.session.state).toBe(withDoor); expect(env.session.buildUndoCount).toBe(1);
    await env.click("Undo (1)"); expect(env.session.state).toBe(before); expect(env.session.buildUndoCount).toBe(0);
  });
  it("illegal sections show the shared reason briefly; far or stale targets change nothing", async () => {
    const env = await mount(); await env.click("Build"); await env.click("Doors · $0");
    const before = env.session.state; const writes = env.profileWrites().length;
    await env.intent({ kind: "door", id: null }); await env.intent({ kind: "door", id: "missing.wall" });
    expect(env.session.state).toBe(before); expect(env.profileWrites()).toHaveLength(writes);
    const illegal = env.map.mobileBuild!.doors.find(section => section.validation.reason?.includes("public Front Desk entrance"))!;
    await env.intent({ kind: "door", id: illegal.id }); expect(env.element.textContent).toContain(illegal.validation.reason!);
    expect(env.session.state).toBe(before); expect(env.profileWrites()).toHaveLength(writes); expect(env.session.buildUndoCount).toBe(0);
    expect(env.element.textContent).not.toMatch(/✓ (Add|Remove) door/);
    await act(async () => vi.advanceTimersByTime(3_000)); expect(env.element.textContent).not.toContain(illegal.validation.reason!);
  });
  it("a fresh shared preview prevents stale rapid taps from issuing a second add command", async () => {
    const state = initial(); const front = state.rooms[0]!;
    state.rooms.push({ id: "phone.exam", roomDefinitionId: "room.examination", x: front.x, y: front.y - 2,
      orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 });
    const env = await mount(state); await env.click("Build"); await env.call(session => session.selectRoom("phone.exam")); await env.click("Doors · $0");
    const legal = env.map.mobileBuild!.doors.find(section => section.roomId === "phone.exam" && section.validation.valid && section.request.kind === "add")!;
    const tap = env.map.mobileBuild!.onIntent; const before = env.session.state; const writes = env.profileWrites().length;
    await act(async () => { tap({ kind: "door", id: legal.id }); tap({ kind: "door", id: legal.id }); });
    expect(env.session.state.doors).toHaveLength(before.doors.length + 1); expect(env.session.buildUndoCount).toBe(1);
    expect(env.profileWrites()).toHaveLength(writes + 1);
    expect(Object.values(env.session.state.operationReceipts).filter(receipt => receipt.commandType === "PLACE_DOOR")).toMatchObject([{ status: "applied" }]);
  });
  it("paid room placement still needs Place, then automatically enables immediate wall taps", async () => {
    const env = await mount(); const front = env.session.state.rooms[0]!;
    await env.click("Build"); await env.choose("room.examination");
    const before = env.session.state;
    await env.intent({ kind: "ghost", point: { x: front.x, y: front.y - 2 } });
    expect(env.session.state).toBe(before); expect(env.map.mobileBuild!.ghost?.valid).toBe(true);
    await env.confirm("placement"); const placed = env.session.state;
    expect(placed.cash).toBe(before.cash - getRoomDefinition("room.examination")!.constructionCost);
    const roomId = placed.rooms.at(-1)!.id;
    const legal = env.map.mobileBuild!.doors.find(section => section.roomId === roomId && section.validation.valid && section.request.kind === "add")!;
    expect(legal).toBeDefined(); await env.intent({ kind: "door", id: legal.id });
    expect(env.session.state.doors).toHaveLength(placed.doors.length + 1); expect(env.session.state.cash).toBe(placed.cash);
    expect(env.session.buildUndoCount).toBe(2);
  });
  it.each(["Room catalog", "Build"])("%s exits Doors without leaving Build, and another tool stays out of Doors", async label => {
    const env = await mount(); await env.click("Build"); await env.click("Doors · $0");
    expect(env.map.mobileBuild!.doors.length).toBeGreaterThan(0);
    await env.click(label); expect(env.session.buildMode).toBe(true); expect(env.map.mobileBuild!.doors).toEqual([]);
    await env.choose("room.hallway"); expect(env.map.mobileBuild!.doors).toEqual([]); expect(env.map.mobileBuild!.hallway).not.toBeNull();
  });
  it("hallway preview commits one save and one undo entry; undo restores the whole stroke", async () => {
    const env = await mount(); await env.click("Build"); await env.clickElement(env.find(node => node.attributes["data-build-tool"] === "hallway"));
    const before = env.session.state; const writes = env.profileWrites().length;
    const stroke = [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }];
    await env.intent({ kind: "hallway", cells: stroke });
    expect(env.session.state).toBe(before); expect(env.profileWrites()).toHaveLength(writes);
    expect(env.element.textContent).toContain("4 new hallway cells"); await env.confirm("hallway", true);
    expect(env.session.state.rooms).toHaveLength(before.rooms.length + 4); expect(env.session.buildUndoCount).toBe(1);
    expect(env.session.state.cash).toBe(before.cash - 4 * getRoomDefinition("room.hallway")!.constructionCost);
    expect(env.profileWrites()).toHaveLength(writes + 1); expect(env.session.buildUndoLabel).toContain("Build hallway");
    await env.click("Undo (1)"); expect(env.session.state).toBe(before); expect(env.session.buildUndoCount).toBe(0);
    expect(env.session.selectedRoomDefinitionId).toBe("room.hallway");
  });
  it("the desktop per-cell session path still makes one snapshot and save per cell", async () => {
    const env = await mount(); await env.call(session => session.enterBuildMode()); await env.call(session => session.beginPlacement("room.hallway"));
    const before = env.session.state; const writes = env.profileWrites().length;
    await env.call(session => { for (let x = 0; x < 4; x += 1) expect(session.placeRoom(x, 0)).toBe(true); });
    expect(env.session.buildUndoCount).toBe(4); expect(env.profileWrites()).toHaveLength(writes + 4);
    await env.call(session => session.undoBuildAction()); expect(env.session.state.rooms).toHaveLength(before.rooms.length + 3);
    expect(env.session.buildUndoCount).toBe(3);
  });
  it("Cancel discards hallway cells, while an obstructed stroke commits only the identical valid prefix", async () => {
    const env = await mount(addWaiting(initial())); await env.click("Build"); await env.choose("room.hallway");
    const before = env.session.state; const writes = env.profileWrites().length;
    const cells = [{ x: 1, y: 3 }, { x: 2, y: 3 }, { x: 3, y: 3 }, { x: 9, y: 3 }];
    await env.intent({ kind: "hallway", cells }); expect(env.map.mobileBuild!.hallway!.buildCells).toHaveLength(2);
    expect(env.element.textContent).toContain("Stroke stops: The room overlaps an existing room.");
    await env.click("✕ Cancel"); expect(env.session.state).toBe(before); expect(env.profileWrites()).toHaveLength(writes);
    expect(env.session.selectedRoomDefinitionId).toBe("room.hallway"); expect(env.map.mobileBuild!.hallway!.cells).toEqual([]);
    await env.intent({ kind: "hallway", cells });
    await env.confirm("hallway"); expect(env.session.buildUndoCount).toBe(1);
    expect(env.session.state.rooms).toHaveLength(before.rooms.length + 2); expect(env.profileWrites()).toHaveLength(writes + 1);
  });
  it("the grouped hallway preserves undo and surfaces the existing warning if the one final save fails", async () => {
    const env = await mount(); await env.click("Build"); await env.choose("room.hallway");
    const before = env.session.state; const writes = env.profileWrites().length;
    env.storage.setItem.mockImplementation((key, value) => {
      if (key === PROTOTYPE_PROFILE_KEY) throw new DOMException("Fixture quota", "QuotaExceededError");
      void value;
    });
    await env.intent({ kind: "hallway", cells: [{ x: 0, y: 0 }, { x: 1, y: 0 }] }); await env.confirm("hallway");
    expect(env.session.state.rooms).toHaveLength(before.rooms.length + 2); expect(env.session.buildUndoCount).toBe(1);
    expect(env.profileWrites()).toHaveLength(writes + 1);
    const warning = env.session.systemNotices.find(notice => notice.definitionId === "alert.system.save-failed");
    expect(warning).toBeDefined(); expect(env.session.announcement).toBe(warning!.message);
    await env.call(session => session.undoBuildAction()); expect(env.session.state).toBe(before);
  });
  it("the room sheet uses existing tier benefits and prices, and Upgrade is an undoable shared command", async () => {
    const env = await mount(addWaiting(initial())); await env.click("Build"); await act(async () => env.map.onSelectRoom!("phone.waiting"));
    const room = env.session.state.rooms.find(candidate => candidate.id === "phone.waiting")!;
    const definition = getRoomDefinition(room.roomDefinitionId)!;
    const details = env.find(node => node.tagName === "DETAILS");
    for (let tier = 1; tier <= definition.maximumUpgradeLevel; tier += 1) {
      const benefit = describeRoomUpgradeBenefit({ roomDefinitionId: room.roomDefinitionId, upgradeLevel: tier,
        maxUpgradeLevel: definition.maximumUpgradeLevel, upkeepPerLevel: definition.upkeepPerUpgradeLevel });
      expect(details.textContent).toContain(`Tier ${tier}`); expect(details.textContent).toContain(benefit!.currentLabel);
      if (tier > 1) expect(details.textContent).toContain(`$${definition.upgradeCosts[tier - 2]!.toLocaleString()}`);
    }
    const before = env.session.state; const upgrade = env.find(node => node.tagName === "BUTTON" && node.textContent.startsWith("Upgrade to"));
    await env.clickElement(upgrade); expect(env.session.state.rooms.find(candidate => candidate.id === room.id)?.upgradeLevel).toBe(2);
    expect(env.session.state.cash).toBe(before.cash - definition.upgradeCosts[0]!); expect(env.session.buildUndoCount).toBe(1);
    await env.click("Undo (1)"); expect(env.session.state).toBe(before);
  });
  it("room sale keeps the preview token, rejects a stale token, refunds the approved version and is undoable", async () => {
    const state = addWaiting(initial()); state.rooms.at(-1)!.roomDefinitionId = "room.reading";
    for (const id of ["first", "second"]) state.employees.push({ id, staffRoleDefinitionId: "staff.radiologist", displayName: `Fixture ${id}`,
      appearance: state.founder.appearance, hiredAtFacilityTick: 0, salaryPerExpenseInterval: 0, morale: 75, trainingLevel: 1,
      homeRoomInstanceId: "phone.waiting", location: { x: 4, y: 4 }, path: [{ x: 4, y: 4 }], pathIndex: 0,
      lastMovedAtFacilityTick: 0, lastPraisedAtFacilityTick: null, nextIdleActionAtFacilityTick: 10, facilityTask: null });
    const env = await mount(state); await env.click("Build"); await act(async () => env.map.onSelectRoom!("phone.waiting"));
    const saleButton = () => env.find(node => node.tagName === "BUTTON" && node.textContent.startsWith("Sell ·"));
    await env.clickElement(saleButton()); const oldToken = createPrototypePlayerView(env.session.state, null, false, null, true, "phone.waiting").selectedRoomBuild!.salePreview!.confirmationToken;
    expect(env.element.textContent).toContain("Fixture first"); expect(env.element.textContent).toContain("Fixture second");
    await env.call(session => session.fireEmployee("second")); await env.click("Confirm Sale");
    expect(env.sell).toHaveBeenLastCalledWith("phone.waiting", oldToken); expect(env.session.state.rooms.some(room => room.id === "phone.waiting")).toBe(true);
    expect(Object.values(env.session.state.operationReceipts).filter(receipt => receipt.commandType === "SELL_ROOM").at(-1)?.status).toBe("rejected");
    const beforeSale = env.session.state; const refund = getRoomResaleValue(beforeSale, "phone.waiting")!;
    await env.clickElement(saleButton()); await env.click("Confirm Sale");
    expect(env.session.state.rooms.some(room => room.id === "phone.waiting")).toBe(false);
    expect(env.session.state.cash).toBe(beforeSale.cash + refund); expect(env.session.buildUndoCount).toBe(1);
    await env.click("Undo (1)"); expect(env.session.state).toBe(beforeSale);
  });
  it("persistent Done uses the exit access check and presents a blocked phone sheet without escaping Build", async () => {
    const env = await mount(); await env.click("Build"); await env.choose("room.waiting");
    await env.intent({ kind: "ghost", point: { x: 0, y: 0 } }); await env.confirm("placement");
    expect(env.element.textContent).not.toContain("Finish room access");
    await env.click("Done"); expect(env.session.buildMode).toBe(true); expect(env.session.state.paused).toBe(true);
    expect(env.map.mobileBuild!.doors).toEqual([]); // Done exits Doors even when the existing access guard keeps Build open.
    expect(env.find(node => node.attributes["aria-label"] === "Finish room access").textContent).toContain(env.session.buildExitBlockedReason!);
    await env.click("Continue Renovating"); await env.click("Undo (1)"); await env.click("Done");
    expect(env.session.buildMode).toBe(false); expect(env.session.state.paused).toBe(true);
  });
  it("valid Done restores a clinic that was running before Build", async () => {
    const state = initial(); state.paused = false; const env = await mount(state);
    await env.click("Build"); expect(env.session.state.paused).toBe(true);
    await env.click("Done"); expect(env.session.buildMode).toBe(false); expect(env.session.state.paused).toBe(false);
  });
});
