import { describe, expect, it, vi } from "vitest";
import { createInitialGameState, type GridPoint } from "@gamify-surgery/game-domain";
import { createPrototypePlayerView } from "../../session/viewModels";
import { FacilityScene, type FacilitySceneBridge } from "../../facility/FacilityScene";
import type { FacilityCameraView } from "../../facility/types";
import type { MapTouchGestures } from "../map/gestures";
import type { MobileBuildMapState } from "./types";

vi.mock("phaser", () => ({ default: { Scene: class {}, Scenes: { Events: { SHUTDOWN: "shutdown" } } } }));

interface SceneHarness {
  bridge: FacilitySceneBridge; layout: { originX: number; originY: number; tileSize: number };
  scale: { width: number; height: number }; cameraView: FacilityCameraView;
  mobileInputSignature: string; mobileBuildDrawSignature: string; mobileGhostInitialized: boolean;
  mobileGestures: MapTouchGestures; time: { now: number }; game: { canvas: EventTarget };
  input: { on: ReturnType<typeof vi.fn>; addPointer: ReturnType<typeof vi.fn> }; events: { once: ReturnType<typeof vi.fn> };
  ghostGraphics: Record<"clear" | "fillStyle" | "fillRect" | "lineStyle" | "strokeRect", ReturnType<typeof vi.fn>>;
  ghostStatusText: { setVisible: ReturnType<typeof vi.fn> }; ghostDoorText: { setVisible: ReturnType<typeof vi.fn> };
  bindInput: () => void; drawMobileBuildPreview: () => void;
  applyCamera: ReturnType<typeof vi.fn>; endHallwayPaint: ReturnType<typeof vi.fn>; setInteractionHint: ReturnType<typeof vi.fn>;
  drawPlacementGhost: ReturnType<typeof vi.fn>;
  getDoorGeometry: (room: unknown, side: string, offset: number) => { hitRegion: { x: number; y: number; width: number; height: number } };
}
function harness(definitionId: string | null = "room.waiting", flag = true) {
  const state = createInitialGameState(); state.facilityLevel = 3;
  const scene = Object.create(FacilityScene.prototype) as SceneHarness;
  const handlers = new Map<string, (pointer: { id: number; x: number; y: number; button: number; wasTouch: boolean }) => void>();
  const intent = vi.fn();
  const map: MobileBuildMapState = { ghost: null, initialGhost: null,
    hallway: definitionId === "room.hallway" ? { cells: [], buildCells: [], cost: 0, reason: null } : null,
    doors: [], selectedDoorId: null, onIntent: intent };
  intent.mockImplementation(event => {
    if (event.kind === "ghost") map.ghost = { ...event.point, valid: true, reason: null, cost: 0 };
    if (event.kind === "hallway") map.hallway = { cells: event.cells.map((cell: GridPoint) => ({ ...cell, status: "build" })), buildCells: event.cells, cost: 0, reason: null };
  });
  scene.bridge = { mobileInput: flag, mobileBuild: map,
    viewModel: createPrototypePlayerView(state, null, false, definitionId, true).facility,
    onPlaceRoom: vi.fn(), onPlaceDoor: vi.fn(), onRemoveDoor: vi.fn(), onSelectRoom: vi.fn() };
  scene.layout = { originX: -110, originY: -70, tileSize: 20 }; scene.scale = { width: 390, height: 410 };
  scene.cameraView = { zoom: 1.5, panX: 0, panY: 0 }; scene.mobileInputSignature = "";
  scene.mobileBuildDrawSignature = ""; scene.mobileGhostInitialized = false;
  scene.ghostGraphics = { clear: vi.fn(), fillStyle: vi.fn(), fillRect: vi.fn(), lineStyle: vi.fn(), strokeRect: vi.fn() };
  scene.ghostStatusText = { setVisible: vi.fn() }; scene.ghostDoorText = { setVisible: vi.fn() };
  scene.input = { on: vi.fn((name, callback) => handlers.set(name, callback)), addPointer: vi.fn() };
  scene.events = { once: vi.fn() }; scene.time = { now: 0 }; scene.game = { canvas: new EventTarget() };
  scene.applyCamera = vi.fn(camera => { scene.cameraView = camera; }); scene.endHallwayPaint = vi.fn();
  scene.setInteractionHint = vi.fn(); scene.drawPlacementGhost = vi.fn();
  if (flag) scene.bindInput();
  const send = (event: string, x: number, y: number, id = 1, now = 0) => {
    scene.time.now = now; handlers.get(event)!({ id, x, y, button: 0, wasTouch: true });
  };
  return { scene, map, intent, send };
}

describe("phone scene Build projection and input", () => {
  it("initializes a new ghost once at the visible map center, snapped to the current camera grid", () => {
    const { scene, map, intent } = harness(); scene.drawMobileBuildPreview(); scene.drawMobileBuildPreview();
    const placement = scene.bridge.viewModel.placement!;
    expect(intent).toHaveBeenCalledExactlyOnceWith({ kind: "ghost", point: {
      x: Math.round((390 / 2 + 110) / 20 - placement.width / 2),
      y: Math.round((410 / 2 + 70) / 20 - placement.height / 2),
    } });
    expect(scene.bridge.onPlaceRoom).not.toHaveBeenCalled(); expect(map.ghost).not.toBeNull();
    map.ghost!.valid = false; scene.drawMobileBuildPreview(); expect(scene.ghostGraphics.fillStyle).toHaveBeenLastCalledWith(0xc94b43, 0.34);
    map.ghost!.valid = true; scene.drawMobileBuildPreview(); expect(scene.ghostGraphics.fillStyle).toHaveBeenLastCalledWith(0x3d8650, 0.34);
  });
  it("initializes a moving ghost at its original spot instead of recentering it", () => {
    const { scene, map, intent } = harness(); map.initialGhost = { x: 3, y: 4 };
    scene.drawMobileBuildPreview(); expect(intent).toHaveBeenCalledExactlyOnceWith({ kind: "ghost", point: { x: 3, y: 4 } });
  });
  it("a fresh catalog choice restarts initialization even when another placement is still active", () => {
    const { scene, map, intent } = harness(); map.placementKey = "waiting:1"; scene.drawMobileBuildPreview();
    map.ghost = null; map.placementKey = "waiting:2"; scene.drawMobileBuildPreview();
    expect(intent).toHaveBeenCalledTimes(2); expect(map.ghost).not.toBeNull();
    scene.drawMobileBuildPreview(); expect(intent).toHaveBeenCalledTimes(2);
  });
  it("flag-off ignores a supplied mobile Build projection, including rendering and initial intents", () => {
    const { scene, intent } = harness("room.waiting", false); scene.drawMobileBuildPreview();
    expect(intent).not.toHaveBeenCalled(); expect(scene.ghostGraphics.clear).not.toHaveBeenCalled();
  });
  it.each(["room.waiting", "room.hallway"])("two fingers discard the tentative %s drag and pan/pinch without any command", definitionId => {
    const { scene, map, send } = harness(definitionId); scene.layout = { originX: 0, originY: 0, tileSize: 20 };
    if (definitionId !== "room.hallway") map.ghost = { x: 3, y: 3, valid: true, reason: null, cost: 100 };
    send("pointerdown", 80, 80); send("pointermove", 120, 100, 1, 30);
    if (definitionId === "room.hallway") expect(map.hallway!.buildCells.length).toBeGreaterThan(1);
    else expect(map.ghost).toMatchObject({ x: 5, y: 4 });
    send("pointerdown", 190, 100, 2, 40); send("pointermove", 220, 110, 2, 50);
    expect(scene.applyCamera).toHaveBeenCalled();
    if (definitionId === "room.hallway") expect(map.hallway!.cells).toEqual([]);
    else expect(map.ghost).toMatchObject({ x: 3, y: 3 });
    send("pointerup", 220, 110, 2, 70); send("pointermove", 160, 130, 1, 80); send("pointerup", 160, 130, 1, 100);
    if (definitionId === "room.hallway") expect(map.hallway!.cells).toEqual([]);
    else expect(map.ghost).toMatchObject({ x: 3, y: 3 });
    expect(scene.bridge.onPlaceRoom).not.toHaveBeenCalled(); expect(scene.bridge.onPlaceDoor).not.toHaveBeenCalled();
    expect(scene.bridge.onRemoveDoor).not.toHaveBeenCalled(); expect(scene.bridge.onSelectRoom).not.toHaveBeenCalled();
  });
  it("door taps choose the nearest section within the radius, including illegal sections, without issuing commands", () => {
    const { scene, map, intent, send } = harness(null);
    scene.bridge.viewModel.buildDoorTool = "place";
    const roomId = scene.bridge.viewModel.rooms[0]!.instanceId;
    map.doors = [0, 1].map(offset => ({ id: `section.${offset}`, roomId, side: "south", offset,
      request: { kind: "add", roomId, side: "south", offset }, validation: { valid: offset === 0, reason: offset === 0 ? null : "Blocked wall section.", cost: 0 } }));
    scene.getDoorGeometry = (_room, _side, offset) => ({ hitRegion: { x: 100 + offset * 30, y: 100, width: 4, height: 20 } });
    send("pointerdown", 123, 110); expect(intent).not.toHaveBeenCalled(); send("pointerup", 123, 110, 1, 100);
    expect(intent).toHaveBeenLastCalledWith({ kind: "door", id: "section.1" });
    send("pointerdown", 300, 200, 1, 150); send("pointerup", 300, 200, 1, 200);
    expect(intent).toHaveBeenLastCalledWith({ kind: "door", id: null });
    expect(scene.bridge.onPlaceDoor).not.toHaveBeenCalled(); expect(scene.bridge.onRemoveDoor).not.toHaveBeenCalled();
  });
  it("wall highlights use one existing section hit region and differentiate legal, illegal and selected sections", () => {
    const { scene, map } = harness(null); const roomId = scene.bridge.viewModel.rooms[0]!.instanceId;
    map.doors = [0, 1].map(offset => ({ id: `section.${offset}`, roomId, side: "south", offset,
      request: { kind: "add", roomId, side: "south", offset }, validation: { valid: offset === 0, reason: offset === 0 ? null : "Blocked", cost: 0 } }));
    scene.drawMobileBuildPreview(); expect(scene.ghostGraphics.strokeRect).toHaveBeenCalledTimes(2);
    expect(scene.ghostGraphics.lineStyle).toHaveBeenCalledWith(2, 0x3d8650, 0.6);
    expect(scene.ghostGraphics.lineStyle).toHaveBeenCalledWith(2, 0xc94b43, 0.6);
    map.selectedDoorId = "section.1"; scene.drawMobileBuildPreview();
    expect(scene.ghostGraphics.lineStyle).toHaveBeenLastCalledWith(4, 0xf7c960, 1);
  });
});
