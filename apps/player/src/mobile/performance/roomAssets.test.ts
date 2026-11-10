import { afterEach, describe, expect, it, vi } from "vitest";
import { createInitialGameState, PROTOTYPE_DOMAIN_CONTEXT } from "@gamify-surgery/game-domain";
import { APPROVED_GS015_ROOM_ATLASES, ENVIRONMENT_ATLAS_V1, FRONTAGE_V2_ASSETS, LANDSCAPING_ATLAS_V1, ROOM_FIXTURE_ATLASES } from "../../art/bitmapAssetManifest";
import { getApprovedRoomPresentation, resolveApprovedRoomDrawRecords } from "../../facility/approvedRoomPresentation";
import { getTouchupCorridorDecor, isTouchupFileSprite, ROOM_TOUCHUP_DECOR_ASSETS, TOUCHUP_SPRITES } from "../../facility/roomTouchups";
import { DESKTOP_FACILITY_ASSETS, MobileBitmapCache, mobileRoomAssets, selectFacilityAssets, trimPhoneFacilityTextures } from "./roomAssets";
import { createPrototypePlayerView } from "../../session/viewModels";
import { FacilityScene } from "../../facility/FacilityScene";

vi.mock("phaser", () => ({ default: { Scene: class {} } }));
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });
const ids = (assets: ReturnType<typeof mobileRoomAssets>) => assets.map(asset => asset.id);

describe("mobile facility art gating", () => {
  it("holds a decode slot until asynchronous rasterization completes and drains rejected decodes", async () => {
    const images: any[] = [], finish: (() => void)[] = [];
    const cache = new MobileBitmapCache(() => {
      const n = images.length, image = { decode: () => n === 1 ? Promise.reject(Error("Decoder unavailable")) : new Promise<void>(resolve => finish.push(resolve)) };
      images.push(image); return image as unknown as HTMLImageElement;
    });
    const requests = Array.from({ length: 5 }, (_, n) => cache.load({ ...ENVIRONMENT_ATLAS_V1, id: `decode.${n}` }, "/fixture.png"));
    images[0].onload(); expect(images).toHaveLength(4); expect(cache.health.activeDecodes).toBe(4);
    finish.shift()!(); await requests[0]; expect(images).toHaveLength(5);
    images[1].onload(); expect(await requests[1]).toBeNull();
    for (const n of [2, 3, 4]) { images[n].onload(); finish.shift()!(); }
    await Promise.all(requests); expect(cache.health).toMatchObject({ activeDecodes: 0, queuedDecodes: 0, pending: 0 });
  });
  it("bounds simultaneous phone decodes at four, drains failures, and clears all completed queue entries", async () => {
    const images: any[] = [];
    const cache = new MobileBitmapCache(() => { const image = {}; images.push(image); return image as HTMLImageElement; });
    const requests = Array.from({ length: 40 }, (_, n) => cache.load({ ...ENVIRONMENT_ATLAS_V1, id: `bounded.${n}` }, "/fixture.png"));
    expect(images).toHaveLength(4); expect(cache.health).toMatchObject({ activeDecodes: 4, queuedDecodes: 36 });
    for (let n = 0; n < 40; n++) {
      expect(cache.health.activeDecodes).toBeLessThanOrEqual(4);
      images[n]![n % 2 ? "onload" : "onerror"]();
    }
    await Promise.all(requests);
    expect(cache.health).toMatchObject({ activeDecodes: 0, queuedDecodes: 0, pending: 0 });
  });
  it("reclaims obsolete room atlases while preserving current rooms, live image references, characters and derivatives", () => {
    const assets = [...mobileRoomAssets("room.front_desk"), ...mobileRoomAssets("room.mri")];
    const keys = new Set(assets.map(asset => `stitchin-time-art:${asset.id}`));
    keys.add("character:live"); keys.add("approved-chair:live");
    const required = new Set(mobileRoomAssets("room.front_desk").map(asset => `stitchin-time-art:${asset.id}`));
    const used = new Set([`stitchin-time-art:${mobileRoomAssets("room.mri").find(a => a.id.startsWith("level4:"))!.id}`]);
    trimPhoneFacilityTextures({ getTextureKeys: () => [...keys], remove: key => keys.delete(key) }, required, used);
    expect([...required].every(key => keys.has(key))).toBe(true);
    expect([...used].every(key => keys.has(key))).toBe(true);
    expect(keys.has("character:live")).toBe(true); expect(keys.has("approved-chair:live")).toBe(true);
    expect([...keys].filter(key => !required.has(key) && !used.has(key))).toEqual(["character:live", "approved-chair:live"]);
  });
  it("preserves the exact eager desktop set and order at every facility level", () => {
    const original = [ENVIRONMENT_ATLAS_V1, LANDSCAPING_ATLAS_V1, ...Object.values(FRONTAGE_V2_ASSETS),
      ...ROOM_FIXTURE_ATLASES, ...APPROVED_GS015_ROOM_ATLASES, ...ROOM_TOUCHUP_DECOR_ASSETS];
    expect(DESKTOP_FACILITY_ASSETS).toEqual(original); expect(new Set(original.map(asset => asset.id)).size).toBe(199);
    for (const facilityLevel of [0, 4]) expect(selectFacilityAssets({ mobile: false, facilityLevel, builtRoomIds: [], previewRoomIds: ["room.mri"] })).toBe(DESKTOP_FACILITY_ASSETS);
  });
  it("loads environment/frontage/corridor plus built dependencies, withholding unlocked but unbuilt art", () => {
    const assets = selectFacilityAssets({ mobile: true, facilityLevel: 0, builtRoomIds: ["room.front_desk"] });
    expect(assets).toEqual(expect.arrayContaining([ENVIRONMENT_ATLAS_V1, LANDSCAPING_ATLAS_V1, ...Object.values(FRONTAGE_V2_ASSETS), ...mobileRoomAssets("room.front_desk")]));
    expect(ids(assets)).not.toEqual(ids(DESKTOP_FACILITY_ASSETS));
    expect(ids(assets)).not.toContain(mobileRoomAssets("room.mri").find(asset => asset.id.startsWith("level4:"))?.id);
    expect(assets).toEqual(expect.arrayContaining([...mobileRoomAssets("room.hallway")]));
    expect(ids(assets)).not.toContain(mobileRoomAssets("room.mri").find(asset => asset.id.startsWith("level4:"))!.id);
  });
  it("first placement and explicit preview load complete dependencies without loading every unlocked room on level-up", () => {
    const level4 = selectFacilityAssets({ mobile: true, facilityLevel: 4, builtRoomIds: [] });
    expect(level4).toEqual(selectFacilityAssets({ mobile: true, facilityLevel: 0, builtRoomIds: [] }));
    for (const key of ["builtRoomIds", "previewRoomIds"] as const) {
      const input = { mobile: true, facilityLevel: 0, builtRoomIds: [], [key]: ["room.mri"] };
      expect(selectFacilityAssets(input)).toEqual(expect.arrayContaining([...mobileRoomAssets("room.mri")]));
    }
    expect(level4.length).toBeLessThan(199);
  });
  it("keeps the large public Level4 blueprint below160MB of nominal decoded room sources", () => {
    const builtRoomIds = ["room.front_desk", "room.hallway", "room.mri", "room.pediatric_waiting", "room.pediatric_examination", "room.wound_ostomy",
      "room.examination", "room.waiting", "room.bathroom", "room.evs_closet", "room.maintenance_workshop", "room.staff_break", "room.coffee_kiosk"];
    const assets = selectFacilityAssets({ mobile: true, facilityLevel: 4, builtRoomIds });
    expect(assets.reduce((bytes, asset) => bytes + asset.nativeWidth * asset.nativeHeight * 4, 0)).toBeLessThan(160_000_000);
    for (const definition of builtRoomIds) expect(assets).toEqual(expect.arrayContaining([...mobileRoomAssets(definition)]));
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

  it("bounds completed metadata and releases image handlers/resolved promises while sharing pending loads", async () => {
    let image: any;
    const cache = new MobileBitmapCache(() => image = {} as HTMLImageElement);
    for (let i = 0; i < 1000; i++) {
      const asset = { ...ENVIRONMENT_ATLAS_V1, id: `test:${i}`, nativeWidth: 16, nativeHeight: 16 };
      const pending = cache.load(asset, "/fixture.png"); expect(cache.load(asset, "/fixture.png")).toBe(pending);
      image.onload(); expect(await pending).toBe(image);
      expect(image.onload).toBeNull(); expect(image.onerror).toBeNull();
    }
    expect(cache.health).toMatchObject({ pending: 0, completed: 256, strongBytes: 0, weak: true });
  });

  it("uses bounded normal/reduced fallback LRUs on Safari without WeakRef, preserving live image owners", async () => {
    vi.stubGlobal("WeakRef", undefined);
    let image: any, reduced = false;
    const cache = new MobileBitmapCache(() => image = {} as HTMLImageElement,
      () => ({ bytes: reduced ? 2048 : 8192, count: 256 }));
    let liveActorImage: any;
    for (let i = 0; i < 100; i++) {
      const pending = cache.load({ ...ENVIRONMENT_ATLAS_V1, id: `test:${i}`, nativeWidth: 16, nativeHeight: 16 }, "/fixture.png");
      image.onload(); await pending; if (i === 0) liveActorImage = image;
      expect(cache.health.strongBytes).toBeLessThanOrEqual(8192);
    }
    expect(cache.health).toMatchObject({ completed: 8, strongBytes: 8192, weak: false });
    reduced = true; expect(cache.health).toMatchObject({ completed: 2, strongBytes: 2048 });
    expect(liveActorImage.onload).toBeNull(); // Eviction never mutates a live source or texture.
  });

  it("retries a reclaimed weak source and handles image-construction failure without a rejected boot promise", async () => {
    let image: any, alive = true, created = 0;
    const cache = new MobileBitmapCache(() => { created++; return image = {} as HTMLImageElement; },
      () => ({ bytes: 0, count: 256 }), value => ({ deref: () => alive ? value : undefined }));
    const first = cache.load(ENVIRONMENT_ATLAS_V1, "/fixture.png"); image.onload(); await first;
    expect(await cache.load(ENVIRONMENT_ATLAS_V1, "/fixture.png")).toBe(image); expect(created).toBe(1);
    alive = false; const second = cache.load(ENVIRONMENT_ATLAS_V1, "/fixture.png"); image.onload(); await second;
    expect(created).toBe(2);
    const unavailable = new MobileBitmapCache(() => { throw Error("Unavailable"); });
    expect(await unavailable.load(ENVIRONMENT_ATLAS_V1, "/fixture.png")).toBeNull();
    expect(unavailable.health.pending).toBe(0);
  });

  it("reuses an oversized atlas owned by the map without WeakRef or a strong cache copy, and disconnects cleanly", async () => {
    const create = vi.fn(() => { throw Error("No duplicate decode"); });
    const cache = new MobileBitmapCache(create, () => ({ bytes: 0, count: 1 }), null);
    const asset = APPROVED_GS015_ROOM_ATLASES.find(candidate => candidate.id === "gs015:recovery:furniture")!;
    const image = { naturalWidth: 7611, naturalHeight: 749 } as HTMLImageElement;
    const stale = cache.connectSource(() => { throw Error("Disposed owner"); });
    const disconnect = cache.connectSource(id => id === asset.id ? image : null);
    for (let i = 0; i < 100; i++) expect(await cache.load(asset, "/fixture.png")).toBe(image);
    expect(create).not.toHaveBeenCalled(); expect(cache.health).toMatchObject({ owners: 2, strongBytes: 0, completed: 0 });
    stale(); disconnect(); expect(cache.health.owners).toBe(0);
    expect(await cache.load(asset, "/fixture.png")).toBeNull(); expect(create).toHaveBeenCalledOnce();
  });
});
