import { describe, expect, it, vi } from "vitest";
import { createInitialGameState } from "@gamify-surgery/game-domain";
import { createPrototypePlayerView } from "../../session/viewModels";
import { FacilityScene, type FacilitySceneBridge } from "../../facility/FacilityScene";
import type { FacilityCameraView, FacilityRoomView } from "../../facility/types";
import { MapTouchGestures, type MapGesture } from "./gestures";
import type { MobileBuildMapState } from "../build/types";

vi.mock("phaser", () => ({ default: { Scene: class {}, Scenes: { Events: { SHUTDOWN: "shutdown" } } } }));
const model = createPrototypePlayerView(createInitialGameState(), null, false, null).facility;
type Pointer = { id: number; x: number; y: number; button: number; wasTouch: boolean };
function sceneHarness(mobileInput?: boolean, buildMode = false) {
  const handlers = new Map<string, (...args: unknown[]) => void>();
  const scene = Object.create(FacilityScene.prototype) as {
    bridge: FacilitySceneBridge; input: { on: ReturnType<typeof vi.fn>; addPointer: ReturnType<typeof vi.fn> };
    events: { once: ReturnType<typeof vi.fn> }; time: { now: number }; game: { canvas: EventTarget };
    scale: { width: number; height: number }; cameraView: FacilityCameraView; mobileInputSignature: string;
    mobileGestures: MapTouchGestures; mobileBuildStroke: unknown; bindInput: () => void;
    applyMobileGestures: (gestures: readonly MapGesture[]) => void;
    applyCamera: ReturnType<typeof vi.fn>; handlePointerDown: ReturnType<typeof vi.fn>; handlePointerMove: ReturnType<typeof vi.fn>;
    handlePointerUp: ReturnType<typeof vi.fn>; handleWheel: ReturnType<typeof vi.fn>; endHallwayPaint: ReturnType<typeof vi.fn>;
    setInteractionHint: ReturnType<typeof vi.fn>; drawPlacementGhost: ReturnType<typeof vi.fn>;
    mobileSelectionAtPoint: ReturnType<typeof vi.fn>; placementGhost: unknown; dragStart: unknown;
    layout: { originX: number; originY: number; tileSize: number };
  };
  scene.bridge = { mobileInput, viewModel: { ...model, buildMode }, onPlaceRoom: vi.fn(), onMobileSelection: vi.fn() };
  scene.input = { on: vi.fn((name: string, callback: (...args: unknown[]) => void) => handlers.set(name, callback)), addPointer: vi.fn() };
  scene.events = { once: vi.fn() }; scene.time = { now: 0 }; scene.game = { canvas: new EventTarget() };
  scene.scale = { width: 390, height: 650 }; scene.cameraView = { zoom: 1.5, panX: 0, panY: 0 }; scene.mobileInputSignature = "";
  scene.layout = { originX: 0, originY: 0, tileSize: 20 };
  scene.applyCamera = vi.fn((camera: FacilityCameraView) => { scene.cameraView = camera; });
  for (const key of ["handlePointerDown", "handlePointerMove", "handlePointerUp", "handleWheel", "endHallwayPaint", "setInteractionHint", "drawPlacementGhost", "mobileSelectionAtPoint"] as const) scene[key] = vi.fn();
  scene.bindInput();
  const send = (event: string, x: number, y = 100, id = 1, now = 0, wasTouch = true) => {
    scene.time.now = now;
    const pointer: Pointer = { id, x, y, button: 0, wasTouch };
    handlers.get(event)!(pointer); return pointer;
  };
  return { scene, handlers, send };
}

describe("explicit phone input gate and original desktop path", () => {
  it.each([undefined, false])("with flag %s registers exactly the original pointer/wheel callbacks and no touch pointer/listeners", (flag) => {
    const { scene, handlers, send } = sceneHarness(flag);
    expect([...handlers.keys()]).toEqual(["pointermove", "pointerdown", "pointerup", "wheel", "gameout"]);
    expect(scene.input.addPointer).not.toHaveBeenCalled(); expect(scene.mobileGestures).toBeUndefined();
    expect(scene.events.once).not.toHaveBeenCalled();
    const down = send("pointerdown", 100); const move = send("pointermove", 110); const up = send("pointerup", 110);
    expect(scene.handlePointerDown).toHaveBeenCalledExactlyOnceWith(down);
    expect(scene.handlePointerMove).toHaveBeenCalledExactlyOnceWith(move);
    expect(scene.handlePointerUp).toHaveBeenCalledExactlyOnceWith(up);
    handlers.get("wheel")!(down, [], 0, 24); expect(scene.handleWheel).toHaveBeenCalledExactlyOnceWith(24);
    scene.placementGhost = {}; scene.dragStart = {}; handlers.get("gameout")!();
    expect(scene.placementGhost).toBeNull(); expect(scene.dragStart).toBeNull();
    expect(scene.endHallwayPaint).toHaveBeenCalledOnce(); expect(scene.setInteractionHint).toHaveBeenCalledExactlyOnceWith(null);
    expect(scene.drawPlacementGhost).toHaveBeenCalledOnce(); expect(scene.applyCamera).not.toHaveBeenCalled();
  });
  it("allocates the second touch pointer only on explicit opt-in and suppresses browser gestures", () => {
    const { scene } = sceneHarness(true); expect(scene.input.addPointer).toHaveBeenCalledExactlyOnceWith(1);
    expect(scene.mobileGestures).toBeInstanceOf(MapTouchGestures);
    for (const name of ["touchstart", "touchmove", "gesturestart", "gesturechange"]) {
      const event = new Event(name, { cancelable: true }); scene.game.canvas.dispatchEvent(event); expect(event.defaultPrevented).toBe(true);
    }
  });
  it("normal phone drag never enters desktop click, hover, movement or Build paths", () => {
    const { scene, send } = sceneHarness(true);
    send("pointerdown", 100); send("pointermove", 107); expect(scene.applyCamera).not.toHaveBeenCalled();
    send("pointermove", 120); send("pointerup", 120, 100, 1, 100);
    expect(scene.applyCamera).toHaveBeenCalled(); expect(scene.bridge.onMobileSelection).not.toHaveBeenCalled();
    expect(scene.handlePointerDown).not.toHaveBeenCalled(); expect(scene.handlePointerMove).not.toHaveBeenCalled();
    expect(scene.handlePointerUp).not.toHaveBeenCalled(); expect(scene.mobileSelectionAtPoint).not.toHaveBeenCalled();
  });
  it("reports a tap immediately on release, with no down-time commands", () => {
    const { scene, send } = sceneHarness(true);
    const selection = { kind: "floor", destination: { x: 4, y: 5 }, accepted: true };
    scene.mobileSelectionAtPoint.mockReturnValue(selection);
    send("pointerdown", 100);
    expect(scene.bridge.onMobileSelection).not.toHaveBeenCalled(); expect(scene.handlePointerDown).not.toHaveBeenCalled();
    send("pointerup", 100, 100, 1, 80);
    expect(scene.bridge.onMobileSelection).toHaveBeenCalledExactlyOnceWith(selection);
  });
  it("rapid repeated taps select immediately and never zoom or run desktop click", () => {
    const { scene, send } = sceneHarness(true);
    send("pointerdown", 100); send("pointerup", 100, 100, 1, 80);
    send("pointerdown", 100, 100, 1, 180); send("pointerup", 100, 100, 1, 240);
    expect(scene.cameraView.zoom).toBe(1.5); expect(scene.applyCamera).not.toHaveBeenCalled();
    expect(scene.bridge.onMobileSelection).toHaveBeenCalledTimes(2); expect(scene.mobileSelectionAtPoint).toHaveBeenCalledTimes(2);
    expect(scene.handlePointerDown).not.toHaveBeenCalled();
  });
  it("two-finger Build pan/pinch never places, edits a door, selects a room or paints a hallway", () => {
    const { scene, send } = sceneHarness(true, true);
    send("pointerdown", 100); send("pointermove", 110);
    send("pointerdown", 200, 100, 2, 30); send("pointermove", 230, 120, 2, 60);
    send("pointerup", 230, 120, 2, 90); send("pointermove", 130, 100, 1, 100); send("pointerup", 130, 100, 1, 120);
    expect(scene.applyCamera).toHaveBeenCalled(); expect(scene.bridge.onPlaceRoom).not.toHaveBeenCalled();
    expect(scene.handlePointerDown).not.toHaveBeenCalled(); expect(scene.handlePointerUp).not.toHaveBeenCalled();
    expect(scene.handlePointerMove).not.toHaveBeenCalled(); expect(scene.bridge.onMobileSelection).not.toHaveBeenCalled();
  });
  it("a single phone Build touch now emits a ghost preview only; interrupted gestures restore the ghost", () => {
    const { scene, send } = sceneHarness(true, true);
    const preview: MobileBuildMapState = { ghost: { x: 4, y: 4, valid: true, reason: null, cost: 100 }, initialGhost: null,
      hallway: null, doors: [], selectedDoorId: null, onIntent: vi.fn() };
    scene.bridge.mobileBuild = preview;
    scene.bridge.viewModel.placement = { definitionId: "room.examination", displayName: "Exam", width: 3, height: 2 };
    send("pointerdown", 100); send("pointermove", 120);
    expect(scene.handlePointerDown).not.toHaveBeenCalled();
    send("pointerup", 120, 100, 1, 100);
    expect(preview.onIntent).toHaveBeenCalledWith({ kind: "ghost", point: { x: 5, y: 4 } });
    expect(scene.handlePointerMove).not.toHaveBeenCalled(); expect(scene.handlePointerUp).not.toHaveBeenCalled();
    expect(scene.bridge.onPlaceRoom).not.toHaveBeenCalled(); send("pointerdown", 100, 100, 1, 200);
    scene.game.canvas.dispatchEvent(new Event("touchcancel")); send("pointerup", 100, 100, 1, 220);
    expect(scene.handlePointerDown).not.toHaveBeenCalled();
    expect(preview.onIntent).toHaveBeenLastCalledWith({ kind: "ghost", point: { x: 4, y: 4 } });
  });
  it("copies the ghost drag start from Phaser prototype getters rather than retaining a live position reference", () => {
    const { scene, handlers } = sceneHarness(true, true);
    const preview: MobileBuildMapState = { ghost: { x: 4, y: 4, valid: true, reason: null, cost: 100 }, initialGhost: null,
      hallway: null, doors: [], selectedDoorId: null, onIntent: vi.fn() };
    scene.bridge.mobileBuild = preview;
    scene.bridge.viewModel.placement = { definitionId: "room.examination", displayName: "Exam", width: 3, height: 2 };
    class PhaserPointer {
      id = 1; button = 0; wasTouch = true; position = { x: 100, y: 100 };
      get x() { return this.position.x; }
      get y() { return this.position.y; }
    }
    const pointer = new PhaserPointer(); handlers.get("pointerdown")!(pointer);
    pointer.position.x = 120; handlers.get("pointermove")!(pointer);
    pointer.position.x = 140; scene.time.now = 100; handlers.get("pointerup")!(pointer);
    expect(preview.onIntent).toHaveBeenCalledWith({ kind: "ghost", point: { x: 5, y: 4 } });
    expect(preview.onIntent).toHaveBeenLastCalledWith({ kind: "ghost", point: { x: 6, y: 4 } });
    expect(scene.handlePointerDown).not.toHaveBeenCalled(); expect(scene.handlePointerMove).not.toHaveBeenCalled();
  });
});

describe("scene touch targets and existing founder command", () => {
  function pickingScene() {
    const room = { ...model.rooms[0]!, tileX: 0, tileY: 0, width: 10, height: 10, definitionId: "room.examination" };
    const scene = Object.create(FacilityScene.prototype) as {
      bridge: FacilitySceneBridge; layout: { originX: number; originY: number; tileSize: number; sidewalkTop: number; sidewalkHeight: number };
      characterBitmapContainers: Map<string, unknown>; characterGraphics: Map<string, unknown>; characterMotionSnapshots: Map<string, unknown>;
      founderSeatScreenPoint: (chair: unknown) => { x: number; y: number }; frontDeskSeatInteractionAtPointer: () => boolean;
      getDoorGeometry: () => { hitRegion: { x: number; y: number; width: number; height: number } };
      mobileSelectionAtPoint: (point: { x: number; y: number }) => import("./selection").MobileMapSelection | null;
    };
    scene.bridge = { mobileInput: true, viewModel: { ...model, rooms: [room], gridColumns: 10, gridRows: 10, staff: [{ instanceId: "employee", displayName: "Avery", roleDisplayName: "Nurse", homeRoomInstanceId: room.instanceId }], founderChairs: [], doors: [] },
      onPlaceRoom: vi.fn(), onMoveFounder: vi.fn(() => true), onPraiseEmployee: vi.fn(), onDescribeCharacter: vi.fn(() => ({ name: "Avery · Nurse", activity: "Waiting for patients" })) };
    scene.layout = { originX: 0, originY: 0, tileSize: 20, sidewalkTop: 200, sidewalkHeight: 20 };
    scene.characterBitmapContainers = new Map(); scene.characterGraphics = new Map(); scene.characterMotionSnapshots = new Map();
    scene.frontDeskSeatInteractionAtPointer = () => false; scene.founderSeatScreenPoint = () => ({ x: 80, y: 80 });
    scene.getDoorGeometry = () => ({ hitRegion: { x: 198, y: 95, width: 4, height: 10 } });
    return { scene, room };
  }
  it("selects a nearby rendered character ahead of the room floor and returns structured canonical data", () => {
    const { scene } = pickingScene();
    scene.characterBitmapContainers.set("character:staff:employee", { visible: true, depth: 10, getByName: () => ({ visible: true, getBounds: () => ({ x: 80, y: 80, width: 20, height: 30 }) }) });
    expect(scene.mobileSelectionAtPoint({ x: 110, y: 95 })).toMatchObject({ kind: "character", role: "Nurse", activity: "Waiting for patients", praise: { employeeId: "employee", eligible: true }, patient: null });
    expect(scene.bridge.onDescribeCharacter).toHaveBeenCalledWith({ kind: "staff", id: "employee" });
    expect(scene.bridge.onMoveFounder).not.toHaveBeenCalled();
  });
  it("picks authorized chairs, doors and nearby room edges with the touch radius", () => {
    const { scene, room } = pickingScene();
    scene.bridge.viewModel.founderChairs = [{ roomInstanceId: room.instanceId, location: { x: 4, y: 4 } }];
    expect(scene.mobileSelectionAtPoint({ x: 100, y: 80 })?.kind).toBe("chair");
    scene.bridge.viewModel.doors = [{ instanceId: "door", roomInstanceId: room.instanceId, side: "east", offset: 5, exterior: false }];
    expect(scene.mobileSelectionAtPoint({ x: 220, y: 100 })?.kind).toBe("door");
    scene.bridge.viewModel.doors = [];
    expect(scene.mobileSelectionAtPoint({ x: -20, y: 150 })).toMatchObject({ kind: "room", room: { instanceId: room.instanceId }, destination: null });
  });
  it("uses the existing founder command only for permitted empty hallway/sidewalk floor; lawn stays inert", () => {
    const { scene, room } = pickingScene();
    scene.bridge.viewModel.rooms = [{ ...room, kind: "hallway", definitionId: "room.hallway" } as FacilityRoomView];
    expect(scene.mobileSelectionAtPoint({ x: 40, y: 100 })).toMatchObject({ kind: "floor", destination: { x: 2, y: 5 }, accepted: true });
    expect(scene.bridge.onMoveFounder).toHaveBeenCalledWith({ x: 2, y: 5 });
    expect(scene.mobileSelectionAtPoint({ x: 40, y: 210 })).toMatchObject({ kind: "floor", destination: { x: 2, y: 10 } });
    expect(scene.mobileSelectionAtPoint({ x: 40, y: 250 })).toBeNull(); expect(scene.bridge.onMoveFounder).toHaveBeenCalledTimes(2);
  });
});
