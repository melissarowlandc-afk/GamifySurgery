import { describe, expect, it, vi } from "vitest";
import { PROTOTYPE_DOMAIN_CONTEXT } from "@gamify-surgery/game-domain";
import { fitRoomThumbnail, roomThumbnailAlphaBounds, roomThumbnailModel, roomThumbnailStage } from "./roomThumbnailCapture";
import { FacilityScene } from "./FacilityScene";

vi.mock("phaser", () => ({ default: { Scene: class {}, Textures: { FilterMode: { NEAREST: 0 } } } }));

describe("room thumbnail capture geometry and fresh-room projection", () => {
  it("captures each buildable footprint at base tier irrespective of unlock level; has no occupants or placed doors", () => {
    for (const definition of PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility.roomDefinitions.filter(room => room.buildable)) {
      const before = JSON.stringify(definition);
      const model = roomThumbnailModel(definition.id);
      expect(model.rooms).toHaveLength(1);
      expect(model.rooms[0]).toMatchObject({ definitionId: definition.id, width: definition.width, height: definition.height,
        orientation: 0, tileX: 0, tileY: 0, upgradeLevel: 1, cleanliness: 100, doorSide: null });
      expect(model.doors).toEqual([]); expect(model.patients).toEqual([]); expect(model.staff).toEqual([]);
      expect(model.placement).toBeNull(); expect(model.buildMode).toBeUndefined();
      expect(roomThumbnailModel(definition.id, definition.maximumUpgradeLevel).rooms[0]?.upgradeLevel).toBe(definition.maximumUpgradeLevel);
      expect(JSON.stringify(definition)).toBe(before);
      const stage = roomThumbnailStage(definition.width, definition.height);
      expect(stage.originX).toBe(360); expect(stage.originY).toBe(360);
      expect(stage.width).toBe(720 + definition.width * 120);
      expect(stage.height).toBe(720 + definition.height * 120);
    }
    expect(() => roomThumbnailModel("room.imaging_control")).toThrow(/not buildable/);
    for (const tier of [0, 6, NaN, 1.1]) expect(() => roomThumbnailModel("room.waiting", tier)).toThrow(/tier/);
    expect(() => roomThumbnailStage(0, 1)).toThrow();
  });
  it("alpha-crops all room pixels and fails on empty, invalid or truncated renders", () => {
    const rgba = new Uint8ClampedArray(10 * 8 * 4);
    rgba[(2 * 10 + 3) * 4 + 3] = 255; rgba[(5 * 10 + 8) * 4 + 3] = 1;
    expect(roomThumbnailAlphaBounds(rgba, 10, 8)).toEqual({ x: 3, y: 2, width: 6, height: 4 });
    expect(() => roomThumbnailAlphaBounds([], 10, 8)).toThrow(/buffer/);
    expect(() => roomThumbnailAlphaBounds(new Uint8Array(10 * 8 * 4), 10, 8)).toThrow(/empty/);
    rgba[3] = 255;
    expect(() => roomThumbnailAlphaBounds(rgba, 10, 8)).toThrow(/stage edge/);
  });
  it("fits portrait, landscape and square rooms with even padding and no stretch", () => {
    for (const [width, height] of [[100, 500], [500, 100], [400, 400], [721, 913]]) {
      const fitted = fitRoomThumbnail({ x: 0, y: 0, width: width!, height: height! }, 480, 336, 24);
      expect(fitted.x).toBeGreaterThanOrEqual(24); expect(fitted.y).toBeGreaterThanOrEqual(24);
      expect(Math.abs(fitted.x - (480 - fitted.x - fitted.width))).toBeLessThanOrEqual(1);
      expect(Math.abs(fitted.y - (336 - fitted.y - fitted.height))).toBeLessThanOrEqual(1);
      expect(Math.abs(fitted.width / width! - fitted.height / height!)).toBeLessThan(.011);
    }
    expect(() => fitRoomThumbnail({ x: 0, y: 0, width: 0, height: 1 }, 480, 336, 24)).toThrow();
    expect(() => fitRoomThumbnail({ x: 0, y: 0, width: 1, height: 1 }, 480, 336, 200)).toThrow();
  });
  it("uses the real drawRoom entry with canonical scale, hides world/UI/actors, and rejects nonisolated models", () => {
    const bridge = { viewModel: roomThumbnailModel("room.waiting"), onPlaceRoom: () => false };
    const scene = new FacilityScene(bridge) as any;
    const camera = { setViewport: vi.fn(), setScroll: vi.fn(), setZoom: vi.fn(), setBackgroundColor: vi.fn() };
    for (const method of Object.values(camera)) method.mockReturnValue(camera);
    const graphics = () => { const item = { clear: vi.fn(), setVisible: vi.fn() }; item.setVisible.mockReturnValue(item); return item; };
    scene.worldGraphics = graphics(); scene.architectureGraphics = graphics(); scene.terrainGraphics = graphics();
    scene.sys = { isPaused: () => false, pause: vi.fn() }; scene.scale = { resize: vi.fn() }; scene.cameras = { main: camera };
    const child = { setVisible: vi.fn() }; scene.children = { each: (callback: (item: unknown) => void) => callback(child), depthSort: vi.fn() };
    scene.textures = { getTextureKeys: () => [], get: vi.fn() };
    scene.drawRoom = vi.fn(); scene.reconcileApprovedSideChairLayers = vi.fn();
    const stage = scene.renderRoomThumbnail();
    expect(scene.sys.pause).toHaveBeenCalledOnce();
    expect(child.setVisible).toHaveBeenCalledWith(false);
    expect(scene.terrainGraphics.clear).toHaveBeenCalledOnce();
    expect(scene.drawRoom).toHaveBeenCalledExactlyOnceWith(scene.worldGraphics, bridge.viewModel.rooms[0], 0);
    expect(scene.layout).toMatchObject({ originX: 360, originY: 360, tileSize: 120, width: 480, height: 360 });
    expect(scene.scale.resize).toHaveBeenCalledWith(stage.width, stage.height);
    expect(camera.setBackgroundColor).toHaveBeenCalledWith("rgba(0,0,0,0)");
    bridge.viewModel.rooms.push({ ...bridge.viewModel.rooms[0]! });
    expect(() => scene.renderRoomThumbnail()).toThrow(/isolated/);
  });
});
