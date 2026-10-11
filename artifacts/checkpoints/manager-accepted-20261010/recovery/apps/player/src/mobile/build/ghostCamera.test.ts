import { describe, expect, it, vi } from "vitest";
import { createInitialGameState } from "@gamify-surgery/game-domain";
import { createPrototypePlayerView } from "../../session/viewModels";
import { FacilityScene, type FacilitySceneBridge } from "../../facility/FacilityScene";
import { phoneCameraLayout } from "../map/camera";
import { framePhoneGhost, phoneGhostEdgePan } from "./ghostCamera";
import { PhoneBuildMapInput } from "./mapInput";
import type { MobileBuildMapState } from "./types";

vi.mock("phaser", () => ({ default: { Scene: class {} } }));
const model = createPrototypePlayerView(createInitialGameState(), null, false, null).facility;

describe("phone placement framing and edge pan", () => {
  it.each([[360, 350], [390, 410], [430, 440], [768, 180], [844, 160]])("fits the whole ghost plus two tiles per side in %sx%s", (width, height) => {
    const viewport = { width, height }; const size = { width: 3, height: 2 };
    const ghost = { x: 10, y: 28 }; const before = { zoom: 2.5, panX: 0, panY: 0 };
    const camera = framePhoneGhost(before, model, viewport, ghost, size);
    const layout = phoneCameraLayout(camera, model, viewport);
    expect(camera.zoom).toBeLessThanOrEqual(before.zoom);
    const left = layout.originX + ghost.x * layout.tileSize; const top = layout.originY + ghost.y * layout.tileSize;
    expect(left).toBeGreaterThanOrEqual(layout.tileSize * 2 - 1);
    expect(top).toBeGreaterThanOrEqual(layout.tileSize * 2 - 1);
    expect(left + size.width * layout.tileSize).toBeLessThanOrEqual(width - layout.tileSize * 2 + 1);
    expect(top + size.height * layout.tileSize).toBeLessThanOrEqual(height - layout.tileSize * 2 + 1);
  });
  it("does not zoom in a placement that already fits", () => {
    expect(framePhoneGhost({ zoom: 0.8, panX: 0, panY: 0 }, model, { width: 390, height: 600 }, { x: 10, y: 28 }, { width: 3, height: 2 }).zoom).toBe(0.8);
  });
  it.each([[[1, 150], [1, 0]], [[389, 150], [-1, 0]], [[150, 1], [0, 1]], [[150, 299], [0, -1]]])("drifts inward near each edge %j", (point, direction) => {
    const pan = phoneGhostEdgePan({ x: point[0]!, y: point[1]! }, { width: 390, height: 300 });
    expect(Math.sign(pan.x)).toBe(direction[0]); expect(Math.sign(pan.y)).toBe(direction[1]);
    expect(phoneGhostEdgePan({ x: 195, y: 150 }, { width: 390, height: 300 })).toEqual({ x: 0, y: 0 });
  });
  it("keeps the ghost visible during a three-tile top-edge drag and continued camera drift, and cancels without commands", () => {
    let grid = { originX: 0, originY: 0, tileSize: 40 };
    const map: MobileBuildMapState = { ghost: { x: 3, y: 3, valid: true, reason: null, cost: 0 }, initialGhost: null,
      hallway: null, doors: [], selectedDoorId: null, onIntent: vi.fn(event => {
        if (event.kind === "ghost") map.ghost = { ...event.point, valid: true, reason: null, cost: 0 };
      }) };
    const input = new PhoneBuildMapInput(() => map, () => grid, () => ({ width: 3, height: 2 }), () => ({ width: 390, height: 300 }));
    input.down(1, { x: 160, y: 160 }, 0); input.move(1, { x: 160, y: 10 });
    expect(map.ghost!.y * grid.tileSize).toBeGreaterThanOrEqual(20);
    for (let frame = 0; frame < 60; frame++) {
      const pan = phoneGhostEdgePan(input.ghostDrag!.point, { width: 390, height: 300 });
      grid = { ...grid, originY: grid.originY + pan.y };
      input.move(1, input.ghostDrag!.point);
      const top = grid.originY + map.ghost!.y * grid.tileSize;
      expect(top).toBeGreaterThanOrEqual(20); expect(top + 80).toBeLessThan(300);
    }
    expect(map.ghost!.y).toBeLessThan(3);
    input.cancel(); expect(map.ghost).toMatchObject({ x: 3, y: 3 }); expect(input.ghostDrag).toBeNull();
    expect((map.onIntent as ReturnType<typeof vi.fn>).mock.calls.every(([event]) => event.kind === "ghost")).toBe(true);
  });
  it("runs the actual scene edge lane only under mobileInput and single-finger Build, without buying", () => {
    type Harness = { bridge: FacilitySceneBridge; scale: { width: number; height: number }; cameraView: { zoom: number; panX: number; panY: number };
      mobileGestures: { hadMultipleTouches: boolean }; phoneBuildInput: { ghostDrag: { id: number; point: { x: number; y: number } }; move: ReturnType<typeof vi.fn> };
      applyCamera: ReturnType<typeof vi.fn>; panMobileGhostAtEdge: (delta: number) => void };
    const scene = Object.create(FacilityScene.prototype) as Harness;
    scene.bridge = { viewModel: { ...model, buildMode: true }, mobileInput: false, onPlaceRoom: vi.fn(), onPlaceDoor: vi.fn() };
    scene.scale = { width: 390, height: 300 }; scene.cameraView = { zoom: 1.5, panX: 0, panY: 0 };
    scene.mobileGestures = { hadMultipleTouches: false }; scene.phoneBuildInput = { ghostDrag: { id: 1, point: { x: 100, y: 1 } }, move: vi.fn() };
    scene.applyCamera = vi.fn(); scene.panMobileGhostAtEdge(16); expect(scene.applyCamera).not.toHaveBeenCalled();
    scene.bridge.mobileInput = true; scene.panMobileGhostAtEdge(16); expect(scene.applyCamera).toHaveBeenCalledOnce();
    expect(scene.phoneBuildInput.move).toHaveBeenCalledWith(1, { x: 100, y: 1 });
    scene.mobileGestures.hadMultipleTouches = true; scene.panMobileGhostAtEdge(16); expect(scene.applyCamera).toHaveBeenCalledOnce();
    expect(scene.bridge.onPlaceRoom).not.toHaveBeenCalled(); expect(scene.bridge.onPlaceDoor).not.toHaveBeenCalled();
  });
  it.each([false, true])("keeps desktop on-canvas hints unchanged and hides them only with mobileInput=%s", flag => {
    type Text = { setFontSize: ReturnType<typeof vi.fn>; setText: ReturnType<typeof vi.fn>; setPosition: ReturnType<typeof vi.fn>; setVisible: ReturnType<typeof vi.fn> };
    type Harness = { bridge: FacilitySceneBridge; layout: { originX: number; originY: number; width: number; height: number; tileSize: number };
      scale: { width: number; height: number }; roomTexts: unknown[]; roomStarGraphics: { clear: () => void; setVisible: (value: boolean) => void };
      footerText: Text; positionText: () => void };
    const scene = Object.create(FacilityScene.prototype) as Harness;
    scene.bridge = { mobileInput: flag, viewModel: { ...model, rooms: [], placement: { definitionId: "room.examination", displayName: "Examination Room", width: 3, height: 2, orientation: 0 } }, onPlaceRoom: vi.fn() };
    scene.layout = { originX: 0, originY: 0, width: 390, height: 300, tileSize: 20 }; scene.scale = { width: 390, height: 300 };
    scene.roomTexts = []; scene.roomStarGraphics = { clear: vi.fn(), setVisible: vi.fn() };
    const text = {} as Text;
    for (const name of ["setFontSize", "setText", "setPosition", "setVisible"] as const) text[name] = vi.fn(() => text);
    scene.footerText = text; scene.positionText();
    expect(text.setText).toHaveBeenCalledWith("BUILD: EXAMINATION ROOM 3×2 • ROTATION 0° • MOVE OVER MAP");
    if (flag) expect(text.setVisible).toHaveBeenCalledExactlyOnceWith(false); else expect(text.setVisible).not.toHaveBeenCalled();
  });
});
