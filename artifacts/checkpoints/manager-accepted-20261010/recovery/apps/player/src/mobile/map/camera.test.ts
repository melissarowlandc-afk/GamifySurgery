import { describe, expect, it, vi } from "vitest";
import { createInitialGameState } from "@gamify-surgery/game-domain";
import { createPrototypePlayerView } from "../../session/viewModels";
import { FacilityScene } from "../../facility/FacilityScene";
import { clampFacilityCamera } from "../../facility/facilityCameraBounds";
import type { FacilityCameraView, FacilityRoomView, FacilityViewModel } from "../../facility/types";
import { builtFacilityBounds, framePhoneFacility, phoneCameraLayout, transformPhoneCamera } from "./camera";

vi.mock("phaser", () => ({ default: { Scene: class {} } }));
const starter = createPrototypePlayerView(createInitialGameState(), null, false, null).facility;
const model = { ...starter, rooms: [{ ...starter.rooms[0]!, tileX: 30, tileY: 18 },
  { ...starter.rooms[0]!, instanceId: "hall", definitionId: "room.hallway", kind: "hallway", isFounderRoom: false,
    tileX: 35, tileY: 21, width: 3, height: 1 } as FacilityRoomView] };
function actualSceneLayout(camera: FacilityCameraView, view: FacilityViewModel, width: number, height: number) {
  const scene = Object.create(FacilityScene.prototype) as { bridge: { viewModel: FacilityViewModel; mobileInput: boolean }; cameraView: FacilityCameraView;
    lastRequestedCameraSignature: string; calculateLayout: (width: number, height: number) => { tileSize: number; originX: number; originY: number } };
  scene.bridge = { viewModel: { ...view, camera }, mobileInput: true }; scene.cameraView = camera; scene.lastRequestedCameraSignature = "";
  return scene.calculateLayout(width, height);
}
describe("phone facility framing and focal zoom", () => {
  it.each([[390, 650], [412, 720], [360, 550], [844, 210], [768, 850]])("centers rooms and hallways, including walls and margin, at %dx%d", (width, height) => {
    const viewport = { width, height }; const camera = framePhoneFacility(model, viewport);
    const layout = phoneCameraLayout(camera, model, viewport); const bounds = builtFacilityBounds(model)!;
    expect((bounds.left + bounds.right) / 2 * layout.tileSize + layout.originX).toBeCloseTo(width / 2, 0);
    expect((bounds.top + bounds.bottom) / 2 * layout.tileSize + layout.originY).toBeCloseTo(height / 2, 0);
    expect(bounds.left * layout.tileSize + layout.originX).toBeGreaterThanOrEqual(layout.tileSize * 0.5);
    expect(bounds.top * layout.tileSize + layout.originY).toBeGreaterThanOrEqual(layout.tileSize * 0.5);
    expect(bounds.right * layout.tileSize + layout.originX).toBeLessThanOrEqual(width - layout.tileSize * 0.5);
    expect(bounds.bottom * layout.tileSize + layout.originY).toBeLessThanOrEqual(height - layout.tileSize * 0.5);
    expect(camera).toEqual(clampFacilityCamera(camera, model, viewport, true));
    expect(layout.tileSize).toBeGreaterThanOrEqual(22);
  });
  it("frames the real starter clinic closely with its built bounds centered in the padded phone viewport", () => {
    const viewport = { width: 390, height: 650 }; const camera = framePhoneFacility(starter, viewport);
    const layout = phoneCameraLayout(camera, starter, viewport);
    const before = phoneCameraLayout(starter.camera!, starter, viewport);
    expect(layout.tileSize).toBeGreaterThan(before.tileSize);
    const room = starter.rooms[0]!;
    expect(room.width * layout.tileSize).toBeGreaterThan(300);
    expect(room.tileX * layout.tileSize + layout.originX).toBeGreaterThan(0);
    expect((room.tileX + room.width) * layout.tileSize + layout.originX).toBeLessThan(390);
    const bounds = builtFacilityBounds(starter)!;
    expect(Math.abs((bounds.left + bounds.right) / 2 * layout.tileSize + layout.originX - viewport.width / 2)).toBeLessThanOrEqual(0.5);
    expect(Math.abs((bounds.top + bounds.bottom) / 2 * layout.tileSize + layout.originY - viewport.height / 2)).toBeLessThanOrEqual(0.5);
  });
  it.each([0.1, 0.5, 1, 1.1, 1.75, 2.5])("matches the actual mobile scene transform at zoom %f", (zoom) => {
    const camera = clampFacilityCamera({ zoom, panX: 190.5, panY: 450.25 }, model, { width: 390, height: 650 }, true);
    const layout = phoneCameraLayout(camera, model, { width: 390, height: 650 });
    const actual = actualSceneLayout(camera, model, 390, 650);
    expect({ tileSize: layout.tileSize, originX: layout.originX, originY: layout.originY }).toEqual({ tileSize: actual.tileSize, originX: actual.originX, originY: actual.originY });
  });
  it("keeps a midpoint's world coordinates stable through simultaneous pinch and pan", () => {
    const viewport = { width: 390, height: 650 }; const camera = framePhoneFacility(model, viewport);
    const from = { x: 170, y: 290 }; const to = { x: 190, y: 330 };
    const next = transformPhoneCamera(camera, model, viewport, from, to, camera.zoom * 0.9);
    const before = phoneCameraLayout(camera, model, viewport); const after = phoneCameraLayout(next, model, viewport);
    expect((to.x - after.originX) / after.tileSize).toBeCloseTo((from.x - before.originX) / before.tileSize, 1);
    expect((to.y - after.originY) / after.tileSize).toBeCloseTo((from.y - before.originY) / before.tileSize, 1);
  });
  it("recenter recomputes grown/rotated footprints without mutating the projection; empty maps use the shared default", () => {
    const before = JSON.stringify(model);
    const rotated = { ...model, rooms: [{ ...model.rooms[0]!, width: 4, height: 5, orientation: 90 as const }] };
    expect(framePhoneFacility(rotated, { width: 390, height: 650 })).not.toEqual(framePhoneFacility(model, { width: 390, height: 650 }));
    expect(framePhoneFacility({ ...model, rooms: [] }, { width: 390, height: 650 }).zoom).toBe(1);
    expect(JSON.stringify(model)).toBe(before);
    const limited = transformPhoneCamera({ zoom: 1, panX: 0, panY: 0 }, model, { width: 390, height: 650 }, { x: 0, y: 0 }, { x: 1e9, y: -1e9 }, 100);
    expect(limited).toEqual(clampFacilityCamera(limited, model, { width: 390, height: 650 }, true));
    expect(limited.zoom).toBe(2.5);
  });
});
