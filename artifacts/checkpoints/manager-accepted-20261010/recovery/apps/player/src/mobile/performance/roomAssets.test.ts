import { afterEach, describe, expect, it, vi } from "vitest";
import { createInitialGameState, PROTOTYPE_DOMAIN_CONTEXT } from "@gamify-surgery/game-domain";
import { APPROVED_GS015_ROOM_ATLASES, ENVIRONMENT_ATLAS_V1, FRONTAGE_V2_ASSETS, LANDSCAPING_ATLAS_V1, ROOM_FIXTURE_ATLASES } from "../../art/bitmapAssetManifest";
import { getApprovedRoomPresentation, resolveApprovedRoomDrawRecords } from "../../facility/approvedRoomPresentation";
import { getTouchupCorridorDecor, isTouchupFileSprite, ROOM_TOUCHUP_DECOR_ASSETS, TOUCHUP_SPRITES } from "../../facility/roomTouchups";
import { DESKTOP_FACILITY_ASSETS, MobileBitmapCache, mobileRoomAssets, selectFacilityAssets } from "./roomAssets";
import { createPrototypePlayerView } from "../../session/viewModels";
import { FacilityScene } from "../../facility/FacilityScene";

vi.mock("phaser", () => ({ default: { Scene: class {} } }));
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });
const ids = (assets: ReturnType<typeof mobileRoomAssets>) => assets.map(asset => asset.id);

describe("mobile facility art gating", () => {
  it("preserves the exact eager desktop set and order at every facility level", () => {
    const original = [ENVIRONMENT_ATLAS_V1, LANDSCAPING_ATLAS_V1, ...Object.values(FRONTAGE_V2_ASSETS),
      ...ROOM_FIXTURE_ATLASES, ...APPROVED_GS015_ROOM_ATLASES, ...ROOM_TOUCHUP_DECOR_ASSETS];
    expect(DESKTOP_FACILITY_ASSETS).toEqual(original); expect(new Set(original.map(asset => asset.id)).size).toBe(199);
    for (const facilityLevel of [0, 4]) expect(selectFacilityAssets({ mobile: false, facilityLevel, builtRoomIds: [], previewRoomIds: ["room.mri"] })).toBe(DESKTOP_FACILITY_ASSETS);
  });
  it("Level 0 loads environment/frontage/landscape plus built or unlocked room dependencies, withholding Level 4", () => {
    const assets = selectFacilityAssets({ mobile: true, facilityLevel: 0, builtRoomIds: ["room.front_desk"] });
    expect(assets).toEqual(expect.arrayContaining([ENVIRONMENT_ATLAS_V1, LANDSCAPING_ATLAS_V1, ...Object.values(FRONTAGE_V2_ASSETS), ...mobileRoomAssets("room.front_desk")]));
    expect(ids(assets)).not.toEqual(ids(DESKTOP_FACILITY_ASSETS));
    expect(ids(assets)).not.toContain(mobileRoomAssets("room.mri").find(asset => asset.id.startsWith("level4:"))?.id);
    for (const room of PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility.roomDefinitions.filter(room => room.buildable && room.unlockFacilityLevel === 0))
      expect(assets).toEqual(expect.arrayContaining([...mobileRoomAssets(room.id)]));
  });
  it("Level 4, first placement, preview and level-up each include their complete room dependencies", () => {
    const level4 = selectFacilityAssets({ mobile: true, facilityLevel: 4, builtRoomIds: [] });
    for (const room of PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility.roomDefinitions.filter(room => room.unlockFacilityLevel <= 4 && room.buildable))
      expect(level4).toEqual(expect.arrayContaining([...mobileRoomAssets(room.id)]));
    for (const key of ["builtRoomIds", "previewRoomIds"] as const) {
      const input = { mobile: true, facilityLevel: 0, builtRoomIds: [], [key]: ["room.mri"] };
      expect(selectFacilityAssets(input)).toEqual(expect.arrayContaining([...mobileRoomAssets("room.mri")]));
    }
    expect(level4.length).toBeLessThan(199);
  });
  it("includes every approved draw and variant asset in each supported orientation, including borrowed decor crops", () => {
    for (const room of PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility.roomDefinitions) {
      const presentation = getApprovedRoomPresentation(room.id); if (!presentation) continue;
      const available = new Set(ids(mobileRoomAssets(room.id)));
      for (const orientation of presentation.orientations) {
        const records = resolveApprovedRoomDrawRecords(room.id, orientation.runtimeOrientation);
        for (const record of records) expect(available, `${room.id}:${record.assetId}`).toContain(record.assetId);
      }
    }
    const corridor = new Set(ids(mobileRoomAssets("room.hallway")));
    for (let x = 0; x < 40; x++) for (let y = 0; y < 32; y++) {
      const decor = getTouchupCorridorDecor({ x, y }, () => true, { north: "tall", west: true, east: true }, { north: false, west: false, east: false });
      for (const item of decor) {
        const sprite = TOUCHUP_SPRITES[item.sprite];
        const id = isTouchupFileSprite(sprite) ? `room-touchup:${sprite.file}` :
          resolveApprovedRoomDrawRecords(sprite.definitionId, 0).find(record => record.id === sprite.recordId)?.assetId;
        expect(corridor).toContain(id);
      }
    }
  });
  it("deduplicates map/preview image requests and retains an unavailable placeholder after errors", async () => {
    const images: { decoding?: string; onload?: () => void; onerror?: () => void; src?: string }[] = [];
    const cache = new MobileBitmapCache(() => { const image = {}; images.push(image); return image as HTMLImageElement; });
    const asset = mobileRoomAssets("room.mri")[0]!;
    const first = cache.load(asset, "/one.webp"); expect(cache.load(asset, "/one.webp")).toBe(first);
    expect(images).toHaveLength(1); images[0]!.onerror!(); expect(await first).toBeNull();
    expect(await cache.load(asset, "/one.webp")).toBeNull(); expect(images).toHaveLength(1);
    const success = cache.load(ENVIRONMENT_ATLAS_V1, "/environment.png"); images[1]!.onload!();
    expect(await success).toBe(images[1]);
  });
  it("uses procedural room fixtures when one mobile texture is pending or failed, never a missing texture", () => {
    const bridge = { mobileInput: true, viewModel: createPrototypePlayerView(createInitialGameState(), null, false, null).facility, onPlaceRoom: vi.fn() };
    const scene = new FacilityScene(bridge) as any;
    const room = bridge.viewModel.rooms[0]!;
    const assets = mobileRoomAssets(room.definitionId);
    const get = vi.fn(); scene.textures = { exists: (key: string) => key !== `stitchin-time-art:${assets[0]!.id}`, get };
    expect(scene.drawApprovedRoomFixtures(room, { x: 0, y: 0, width: 100, height: 80 })).toBe(false);
    expect(get).not.toHaveBeenCalled();
    scene.textures.exists = () => false;
    expect(scene.registerApprovedRoomFrame({ assetId: assets[0]!.id, sourceRect: [0, 0, 1, 1] })).toBeUndefined();
    expect(get).not.toHaveBeenCalled();
  });
});
