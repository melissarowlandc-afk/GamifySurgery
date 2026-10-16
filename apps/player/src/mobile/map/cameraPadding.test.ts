import { describe, expect, it, vi } from "vitest";
import { createInitialGameState } from "@gamify-surgery/game-domain";
import { createPrototypePlayerView } from "../../session/viewModels";
import { FacilityScene } from "../../facility/FacilityScene";
import { clampFacilityCamera } from "../../facility/facilityCameraBounds";
import type { FacilityCameraView, FacilityRoomView, FacilityViewModel } from "../../facility/types";
import { builtFacilityBounds, framePhoneFacility, phoneCameraLayout, transformPhoneCamera } from "./camera";

vi.mock("phaser", () => ({ default: { Scene: class {} } }));
type CameraModel = Pick<FacilityViewModel, "gridColumns" | "gridRows" | "rooms">;
const model: CameraModel = { gridColumns: 64, gridRows: 32,
  rooms: [{ isFounderRoom: true, tileX: 33, tileY: 28, width: 5, height: 4 } as FacilityRoomView] };
const viewport = { width: 390, height: 650 };
const starter = createPrototypePlayerView(createInitialGameState(), null, false, null).facility;
function sceneLayout(camera: FacilityCameraView, view: CameraModel, size = viewport, mobileInput?: boolean) {
  const scene = Object.create(FacilityScene.prototype) as {
    bridge: { viewModel: CameraModel & { camera: FacilityCameraView }; mobileInput?: boolean };
    cameraView: FacilityCameraView; lastRequestedCameraSignature: string;
    calculateLayout: (width: number, height: number) => { originX: number; originY: number; tileSize: number; worldBottom: number };
  };
  scene.bridge = { viewModel: { ...view, camera }, mobileInput };
  scene.cameraView = camera; scene.lastRequestedCameraSignature = "";
  return scene.calculateLayout(size.width, size.height);
}

// Captured from the original desktop clamp before adding the phone flag.
const desktopBounds = [
  { zoom: 0.05, boundedZoom: 0.1, minX: 18, maxX: 24, minY: -452, maxY: 0 },
  { zoom: 0.6, boundedZoom: 0.6, minX: -318, maxX: 444, minY: -56, maxY: 0 },
  { zoom: 1, boundedZoom: 1, minX: -574, maxX: 764, minY: 0, maxY: 241 },
  { zoom: 1.7, boundedZoom: 1.7, minX: -1116, maxX: 1438, minY: 0, maxY: 868 },
  { zoom: 2.5, boundedZoom: 2.5, minX: -1743, maxX: 2219, minY: 0, maxY: 1594 },
  { zoom: 9, boundedZoom: 2.5, minX: -1743, maxX: 2219, minY: 0, maxY: 1594 },
];

describe("phone-only viewport pan padding", () => {
  it.each(desktopBounds)("retains the exact original desktop bounds at zoom $zoom with the flag omitted or false", (bounds) => {
    for (const flag of [undefined, false]) {
      expect(clampFacilityCamera({ zoom: bounds.zoom, panX: -1e9, panY: -1e9 }, model, viewport, flag))
        .toEqual({ zoom: bounds.boundedZoom, panX: bounds.minX, panY: bounds.minY });
      expect(clampFacilityCamera({ zoom: bounds.zoom, panX: 1e9, panY: 1e9 }, model, viewport, flag))
        .toEqual({ zoom: bounds.boundedZoom, panX: bounds.maxX, panY: bounds.maxY });
    }
  });
  it.each(desktopBounds)("only true adds exactly 40% of each viewport dimension to each bound at zoom $zoom", (bounds) => {
    expect(clampFacilityCamera({ zoom: bounds.zoom, panX: -1e9, panY: -1e9 }, model, viewport, true))
      .toEqual({ zoom: bounds.boundedZoom, panX: bounds.minX - 156, panY: bounds.minY - 260 });
    expect(clampFacilityCamera({ zoom: bounds.zoom, panX: 1e9, panY: 1e9 }, model, viewport, true))
      .toEqual({ zoom: bounds.boundedZoom, panX: bounds.maxX + 156, panY: bounds.maxY + 260 });
  });
  it("preserves legal fractional phone pan outside the desktop range and keeps flag-off scene layout exact", () => {
    const camera = { zoom: 1, panX: -600.25, panY: -200.75 };
    expect(clampFacilityCamera(camera, model, viewport, true)).toEqual(camera);
    expect(clampFacilityCamera(camera, model, viewport, false)).toEqual({ zoom: 1, panX: -574, panY: 0 });
    const desktop = sceneLayout(camera, model);
    expect(sceneLayout(camera, model, viewport, false)).toEqual(desktop);
    expect(desktop).toMatchObject({ originX: -1338, originY: -241, tileSize: 27, worldBottom: 650 });
    expect(sceneLayout(camera, model, viewport, true)).toMatchObject({ originX: -1364, originY: -442, tileSize: 27, worldBottom: 449 });
  });
  it.each([[390, 650], [412, 720], [360, 550], [844, 210], [768, 850]])("centers the real south-edge starter exactly (within pixel snapping) at %dx%d", (width, height) => {
    const size = { width, height }; const camera = framePhoneFacility(starter, size);
    const layout = sceneLayout(camera, starter, size, true); const bounds = builtFacilityBounds(starter)!;
    expect(Math.abs((bounds.left + bounds.right) / 2 * layout.tileSize + layout.originX - width / 2)).toBeLessThanOrEqual(0.5);
    expect(Math.abs((bounds.top + bounds.bottom) / 2 * layout.tileSize + layout.originY - height / 2)).toBeLessThanOrEqual(0.5);
    expect(camera).toEqual(clampFacilityCamera(camera, starter, size, true));
    expect(layout.tileSize).toBeGreaterThanOrEqual(22);
  });
  it.each([[390, 650], [844, 210]])("clamps saved/gesture extremes to the actual padded scene at %dx%d", (width, height) => {
    const size = { width, height };
    for (const zoom of [0.1, 0.6, 1, 1.7, 2.5]) {
      for (const direction of [-1, 1]) {
        const camera = { zoom, panX: direction * 1e9, panY: direction * 1e9 };
        const bounded = clampFacilityCamera(camera, model, size, true);
        const actual = sceneLayout(camera, model, size, true); const projected = phoneCameraLayout(bounded, model, size);
        expect(sceneLayout(bounded, model, size, true)).toEqual(actual);
        expect({ tileSize: actual.tileSize, originX: actual.originX, originY: actual.originY })
          .toEqual({ tileSize: projected.tileSize, originX: projected.originX, originY: projected.originY });
        expect(sceneLayout(camera, model, size, false)).toEqual(sceneLayout(clampFacilityCamera(camera, model, size), model, size));
      }
    }
  });
  it("allows drag and simultaneous pinch/pan through padded space with the world midpoint stable", () => {
    const camera = framePhoneFacility(starter, viewport);
    const from = { x: 180, y: 320 }; const to = { x: 195, y: 295 };
    for (const zoom of [camera.zoom, camera.zoom * 0.95]) {
      const next = transformPhoneCamera(camera, starter, viewport, from, to, zoom);
      expect(next).toEqual(clampFacilityCamera(next, starter, viewport, true));
      expect(next).not.toEqual(clampFacilityCamera(next, starter, viewport));
      const before = phoneCameraLayout(camera, starter, viewport); const after = phoneCameraLayout(next, starter, viewport);
      expect(Math.abs((from.x - before.originX) / before.tileSize * after.tileSize + after.originX - to.x)).toBeLessThanOrEqual(0.5);
      expect(Math.abs((from.y - before.originY) / before.tileSize * after.tileSize + after.originY - to.y)).toBeLessThanOrEqual(0.5);
    }
  });
});
