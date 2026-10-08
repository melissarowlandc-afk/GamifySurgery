import { describe, expect, it, vi } from "vitest";
import { clampFacilityCamera, isValidFacilityCamera } from "./facilityCameraBounds";
import { snapPresentationOrigin } from "./presentationOrigin";
import { FacilityScene } from "./FacilityScene";
import type { FacilityCameraView, FacilityRoomView, FacilityViewModel } from "./types";

// Exercise the actual scene's layout math without booting Phaser/DOM/rendering.
vi.mock("phaser", () => ({ default: { Scene: class {} } }));

type LayoutModel = Pick<FacilityViewModel, "gridColumns" | "gridRows" | "rooms">;
const model: LayoutModel = {
  gridColumns: 64, gridRows: 40,
  rooms: [{ isFounderRoom: true, tileX: 33, tileY: 28, width: 5, height: 4 } as FacilityRoomView],
};

function sceneLayout(camera: FacilityCameraView, view: LayoutModel, width: number, height: number) {
  const scene = Object.create(FacilityScene.prototype) as {
    bridge: { viewModel: LayoutModel & { camera: FacilityCameraView } };
    cameraView: FacilityCameraView;
    lastRequestedCameraSignature: string;
    calculateLayout: (width: number, height: number) => {
      originX: number; originY: number; tileSize: number; worldBottom: number;
    };
  };
  scene.bridge = { viewModel: { ...view, camera } };
  scene.cameraView = { zoom: 1, panX: 0, panY: 0 };
  scene.lastRequestedCameraSignature = "";
  return scene.calculateLayout(width, height);
}

describe("restored facility camera clamping", () => {
  it("keeps legal fractional pan and zoom exactly", () => {
    const camera = { zoom: 1.7, panX: -172.25, panY: 281.5 };
    expect(clampFacilityCamera(camera, model, { width: 900, height: 450 })).toEqual(camera);
  });

  it.each([
    { zoom: 0.001, panX: -1e9, panY: 1e9 },
    { zoom: 1, panX: 1e9, panY: -1e9 },
    { zoom: 1.5, panX: -1e9, panY: 1e9 },
    { zoom: 999, panX: 1e9, panY: -1e9 },
  ])("bounds zoom/pan to the rendered site for $zoom zoom", (camera) => {
    const restored = clampFacilityCamera(camera, model, { width: 900, height: 450 });
    expect(restored.zoom).toBeGreaterThanOrEqual(0.1);
    expect(restored.zoom).toBeLessThanOrEqual(2.5);
    expect(Math.abs(restored.panX)).toBeLessThan(1e9);
    expect(Math.abs(restored.panY)).toBeLessThan(1e9);
    const before = sceneLayout(camera, model, 900, 450);
    const after = sceneLayout(restored, model, 900, 450);
    expect(after).toEqual(before);
    expect(clampFacilityCamera(restored, model, { width: 900, height: 450 })).toEqual(restored);
  });

  it.each([
    [900, 450, 64, 40], [360, 220, 64, 40], [1440, 800, 96, 64],
    [1200, 800, 10, 6], [360, 640, 5, 4],
  ])("uses current viewport %dx%d and current grid %dx%d rather than stored bounds", (
    width, height, columns, rows,
  ) => {
    const changed = { ...model, gridColumns: columns, gridRows: rows,
      rooms: [{ ...model.rooms[0]!, tileX: Math.floor(columns / 2) } as FacilityRoomView] };
    for (const camera of [
      { zoom: 0.05, panX: 1e9, panY: -1e9 },
      { zoom: 0.6, panX: -1e9, panY: 1e9 },
      { zoom: 1.1, panX: -999, panY: 1234 },
      { zoom: 2.9, panX: 1e9, panY: -1e9 },
    ]) {
      const restored = clampFacilityCamera(camera, changed, { width, height });
      expect(sceneLayout(restored, changed, width, height)).toEqual(
        sceneLayout(camera, changed, width, height),
      );
      const layout = sceneLayout(restored, changed, width, height);
      const focusTileX = changed.rooms[0]!.tileX + changed.rooms[0]!.width / 2;
      const expectedOriginX = Math.floor(width / 2 - focusTileX * layout.tileSize) + restored.panX;
      expect(layout.originX).toBe(snapPresentationOrigin(expectedOriginX));
    }
  });

  it("handles resized and grown facilities and the no-founder fallback", () => {
    const saved = { zoom: 1.7, panX: 1e9, panY: 1e9 };
    const original = clampFacilityCamera(saved, model, { width: 900, height: 450 });
    const resized = clampFacilityCamera(saved, model, { width: 1800, height: 1000 });
    const grown = clampFacilityCamera(saved, { ...model, gridColumns: 96, gridRows: 64 },
      { width: 900, height: 450 });
    expect(resized).not.toEqual(original);
    expect(grown).not.toEqual(original);
    const noFounder = { ...model, rooms: [] };
    expect(sceneLayout(clampFacilityCamera(saved, noFounder, { width: 900, height: 450 }),
      noFounder, 900, 450)).toEqual(sceneLayout(saved, noFounder, 900, 450));
  });

  it.each([null, [], {}, { zoom: 0, panX: 0, panY: 0 },
    { zoom: -1, panX: 0, panY: 0 }, { zoom: NaN, panX: 0, panY: 0 },
    { zoom: 1, panX: Infinity, panY: 0 }, { zoom: 1, panX: 0, panY: undefined },
  ])("rejects invalid camera data %j", (camera) => {
    expect(isValidFacilityCamera(camera)).toBe(false);
  });
});
