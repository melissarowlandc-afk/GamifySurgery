import { describe, expect, it, vi } from "vitest";
import { FacilityScene } from "./FacilityScene";
import type { FacilityCameraView, FacilityRoomView } from "./types";

vi.mock("phaser", () => ({ default: { Scene: class {} } }));

const room = { instanceId: "shade.front-desk", isFounderRoom: true, tileX: 33, tileY: 28,
  width: 5, height: 4, orientation: 0 } as FacilityRoomView;
const model = { campaignId: "shade.fixture", gridColumns: 64, gridRows: 40, rooms: [room] };
type Layout = { originX: number; originY: number; tileSize: number; worldBottom: number };
function sceneCamera(camera: FacilityCameraView, mobileInput = false) {
  const scene = Object.create(FacilityScene.prototype) as {
    bridge: { viewModel: typeof model & { camera: FacilityCameraView }; mobileInput: boolean };
    cameraView: FacilityCameraView; lastRequestedCameraSignature: string; layout: Layout;
    calculateLayout: (width: number, height: number) => Layout;
    gridPointAtPointer: (pointer: { x: number; y: number }) => { x: number; y: number };
    roomAtPointer: (pointer: { x: number; y: number }) => FacilityRoomView | undefined;
    getCameraPreference: () => Readonly<FacilityCameraView> | null;
  };
  scene.bridge = { viewModel: { ...model, camera }, mobileInput };
  scene.cameraView = { zoom: 1, panX: 0, panY: 0 }; scene.lastRequestedCameraSignature = "";
  return { scene, resize: (height: number, width = 900) => {
    scene.layout = scene.calculateLayout(width, height); return scene.layout;
  } };
}

describe("desktop map shade: actual scene projection", () => {
  it("reveals and covers without changing tile scale or any world point above the bottom bound", () => {
    const { resize } = sceneCamera({ zoom: 1.1, panX: 27.25, panY: 500.25 });
    const before = resize(350), grown = resize(450), covered = resize(250);
    expect(grown.tileSize).toBe(before.tileSize); expect(covered.tileSize).toBe(before.tileSize);
    expect(grown.originX).toBe(before.originX); expect(grown.originY).toBe(before.originY);
    expect(covered.originX).toBe(before.originX); expect(covered.originY).toBe(before.originY);
  });

  it("moves down by only the revealed excess at the bottom, smoothly one pixel at a time", () => {
    const { resize } = sceneCamera({ zoom: 1.1, panX: 0, panY: 20 });
    const before = resize(350);
    for (let height = 351; height <= 410; height++) {
      const view = resize(height);
      expect(view.tileSize).toBe(before.tileSize);
      expect(view.originY).toBe(before.originY + Math.max(0, height - before.worldBottom));
      expect(view.worldBottom).toBe(Math.max(before.worldBottom, height));
    }
  });

  it("never reverses the bottom translation on cover or on regrowth before reaching the bottom again", () => {
    const { resize } = sceneCamera({ zoom: 1.1, panX: 0, panY: 0 });
    resize(350); const bottom = resize(450);
    expect(bottom.worldBottom).toBe(450);
    const covered = resize(250), regrown = resize(400);
    expect(covered).toEqual(bottom); expect(regrown).toEqual(bottom);
    const beyond = resize(480);
    expect(beyond.originY).toBe(bottom.originY + 30); expect(beyond.tileSize).toBe(bottom.tileSize);
  });

  it("also keeps a small overview down after the expanded pane covers the whole world", () => {
    const { resize } = sceneCamera({ zoom: 0.1, panX: 0, panY: 0 });
    const before = resize(350), expanded = resize(550), covered = resize(250);
    expect(expanded.tileSize).toBe(before.tileSize); expect(expanded.worldBottom).toBe(550);
    expect(covered).toEqual(expanded);
  });

  it("keeps the chosen zoom and pointer-to-room/tile mapping through every height change", () => {
    const { scene, resize } = sceneCamera({ zoom: 1.7, panX: -42.25, panY: 400.25 });
    for (const height of [350, 450, 250, 550, 300]) {
      const view = resize(height);
      const pointer = { x: view.originX + (room.tileX + 1.5) * view.tileSize,
        y: view.originY + (room.tileY + 1.5) * view.tileSize };
      expect(scene.cameraView.zoom).toBe(1.7);
      expect(scene.gridPointAtPointer(pointer)).toEqual({ x: room.tileX + 1, y: room.tileY + 1 });
      expect(scene.roomAtPointer(pointer)?.instanceId).toBe(room.instanceId);
    }
  });

  it("restores exact scale and pan on reload after a bottom-edge translation and cover", () => {
    const original = sceneCamera({ zoom: 0.1, panX: 0, panY: 0 });
    original.resize(350); original.resize(550); const covered = original.resize(250);
    const preference = structuredClone(original.scene.cameraView);
    expect(sceneCamera(preference).resize(250)).toEqual(covered);
    expect(preference.zoom).toBe(0.1);
  });

  it("preserves fractional pan intent, and still permits explicit pan/zoom within the existing limits", () => {
    const { scene, resize } = sceneCamera({ zoom: 1.7, panX: -42.25, panY: 400.25 });
    resize(350); resize(300);
    expect(scene.cameraView).toMatchObject({ zoom: 1.7, panX: -42.25, panY: 400.25 });
    scene.bridge.viewModel.camera = { ...scene.cameraView, zoom: 2, panY: 500.5 };
    resize(300); expect(scene.cameraView).toMatchObject({ zoom: 2, panY: 500.5 });
    scene.bridge.viewModel.camera = { ...scene.cameraView, zoom: 99 };
    resize(300); expect(scene.cameraView.zoom).toBe(2.5);
    scene.bridge.viewModel.camera = { ...scene.cameraView, zoom: 0.01 };
    resize(300); expect(scene.cameraView.zoom).toBe(0.1);
  });

  it("adopts a new campaign's own reference even when its numerical camera matches the previous campaign", () => {
    const { scene, resize } = sceneCamera({ zoom: 1.1, panX: 0, panY: 0 });
    const first = resize(350);
    scene.bridge.viewModel = { ...scene.bridge.viewModel, campaignId: "second.fixture", camera: { zoom: 1.1, panX: 0, panY: 0 } };
    const second = resize(450);
    expect(scene.cameraView.desktopViewport?.height).toBe(450);
    expect(second.tileSize).not.toBe(first.tileSize);
  });

  it("does not publish a stale resize over an explicit zoom or campaign change before the next frame", () => {
    const { scene, resize } = sceneCamera({ zoom: 1.1, panX: 0, panY: 0 });
    resize(350); resize(450);
    scene.bridge.viewModel.camera = { ...scene.cameraView, zoom: 2 };
    expect(scene.getCameraPreference()).toBeNull();
    resize(450); expect(scene.getCameraPreference()?.zoom).toBe(2);
    scene.bridge.viewModel = { ...scene.bridge.viewModel, campaignId: "new.campaign" };
    expect(scene.getCameraPreference()).toBeNull();
  });

  it("leaves the phone's viewport-dependent fit behavior intact", () => {
    const { resize } = sceneCamera({ zoom: 1.1, panX: 0, panY: 0 }, true);
    expect(resize(350).tileSize).not.toBe(resize(450).tileSize);
  });
});
