import { act } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createInitialGameState } from "@gamify-surgery/game-domain";
import { createPrototypePlayerView } from "../../session/viewModels";
import { FacilityScene, type FacilitySceneBridge } from "../../facility/FacilityScene";
import { getPhaserTextureKey } from "../../art/bitmapAssetAdapters";
import { allElements, cleanupPhoneTests, phoneTestDom } from "../screenTestUtils";
import { testElementProps } from "../testDom";
import { roomThumbnailAsset } from "../../art/roomThumbnailManifest";
import { RoomThumbnail } from "../build/RoomThumbnail";
import { mobileBitmapCache, mobileRoomAssets, selectFacilityAssets } from "./roomAssets";
import { MobileMapPresentationPolicy } from "./presentationPolicy";

vi.mock("phaser", () => ({ default: { Scene: class {} } }));
afterEach(async () => { await cleanupPhoneTests(); vi.restoreAllMocks(); });

describe("mobile lazy art integration", () => {
  it("loads built and preview art once without preloading unlocked rooms; covered completions do no drawing", async () => {
    vi.stubGlobal("Image", class {});
    const load = vi.spyOn(mobileBitmapCache, "load").mockResolvedValue({} as HTMLImageElement);
    const policy = new MobileMapPresentationPolicy(); policy.setCovered(true);
    const bridge: FacilitySceneBridge = { mobileInput: true, mobilePresentation: policy, mobileFacilityLevel: 0,
      viewModel: createPrototypePlayerView(createInitialGameState(), null, false, null).facility, onPlaceRoom: vi.fn() };
    const scene = new FacilityScene(bridge) as any;
    const keys = new Set<string>(); const addImage = vi.fn((key: string) => keys.add(key));
    scene.textures = { exists: (key: string) => keys.has(key), addImage };
    scene.sys = { isActive: () => true }; scene.scale = { width: 390, height: 600 };
    for (const method of ["registerEnvironmentAtlasFrames", "registerLandscapingAtlasFrames", "registerRoomFixtureAtlasFrames",
      "drawWorld", "positionText", "drawPlacementGhost"]) scene[method] = vi.fn();
    scene.ensureMobileAtlases();
    const initial = selectFacilityAssets({ mobile: true, facilityLevel: 0, builtRoomIds: ["room.front_desk"] });
    await vi.waitFor(() => expect(keys.size).toBe(initial.length));
    expect(load.mock.calls.map(([asset]) => asset.id)).toEqual(initial.map(asset => asset.id));
    expect(scene.drawWorld).not.toHaveBeenCalled();
    scene.ensureMobileAtlases(); expect(load).toHaveBeenCalledTimes(initial.length);
    bridge.mobilePreviewRoomIds = ["room.mri"]; scene.ensureMobileAtlases();
    const preview = selectFacilityAssets({ mobile: true, facilityLevel: 0, builtRoomIds: ["room.front_desk"], previewRoomIds: ["room.mri"] });
    await vi.waitFor(() => expect(keys.size).toBe(preview.length));
    expect(load).toHaveBeenCalledTimes(preview.length);
    bridge.mobileFacilityLevel = 4; scene.ensureMobileAtlases();
    const all = selectFacilityAssets({ mobile: true, facilityLevel: 4, builtRoomIds: ["room.front_desk"], previewRoomIds: ["room.mri"] });
    await vi.waitFor(() => expect(keys.size).toBe(all.length));
    expect(all.map(asset => asset.id)).toEqual(preview.map(asset => asset.id));
    expect(load).toHaveBeenCalledTimes(all.length); expect(scene.drawWorld).not.toHaveBeenCalled();
    expect(new Set(addImage.mock.calls.map(([key]) => key)).size).toBe(all.length);
    expect(keys).toEqual(new Set(all.map(getPhaserTextureKey)));
  });
  it("leaves failed room sources absent, so the existing procedural placeholder remains usable", async () => {
    vi.stubGlobal("Image", class {});
    const missing = mobileRoomAssets("room.front_desk").find(asset => asset.id.startsWith("gs015:"))!;
    vi.spyOn(mobileBitmapCache, "load").mockImplementation(async asset => asset.id === missing.id ? null : {} as HTMLImageElement);
    const bridge: FacilitySceneBridge = { mobileInput: true, mobileFacilityLevel: 0,
      viewModel: createPrototypePlayerView(createInitialGameState(), null, false, null).facility, onPlaceRoom: vi.fn() };
    const scene = new FacilityScene(bridge) as any; const keys = new Set<string>();
    scene.textures = { exists: (key: string) => keys.has(key), addImage: (key: string) => keys.add(key), get: vi.fn() };
    scene.sys = { isActive: () => true };
    for (const method of ["registerEnvironmentAtlasFrames", "registerLandscapingAtlasFrames", "registerRoomFixtureAtlasFrames", "refreshLayout"]) scene[method] = vi.fn();
    scene.ensureMobileAtlases(); await vi.waitFor(() => expect(scene.refreshLayout).toHaveBeenCalled());
    expect(keys.has(getPhaserTextureKey(missing))).toBe(false);
    expect(scene.drawApprovedRoomFixtures(bridge.viewModel.rooms[0], { x: 0, y: 0, width: 100, height: 80 })).toBe(false);
    expect(scene.textures.get).not.toHaveBeenCalled();
  });
  it.each([false, true])("defers catalog PNG requests until visible; never loads room packs (failure=%s)", async fail => {
    const env = phoneTestDom();
    let intersect!: (entries: { isIntersecting: boolean }[]) => void;
    const disconnect = vi.fn();
    vi.stubGlobal("IntersectionObserver", class { constructor(callback: typeof intersect) { intersect = callback; } observe() {} disconnect = disconnect; });
    const load = vi.spyOn(mobileBitmapCache, "load");
    const visible = vi.fn();
    await env.render(<RoomThumbnail definitionId="room.mri" onVisible={visible} />);
    const frame = env.find(node => node.attributes["data-room-thumbnail"] === "room.mri");
    expect(frame.attributes["data-art-state"]).toBe("placeholder"); expect(load).not.toHaveBeenCalled();
    expect(allElements(env.element, node => node.tagName === "IMG")).toHaveLength(0);
    await act(async () => intersect([{ isIntersecting: false }])); expect(visible).not.toHaveBeenCalled();
    await act(async () => intersect([{ isIntersecting: true }]));
    expect(visible).toHaveBeenCalledExactlyOnceWith("room.mri");
    const image = env.find(node => node.tagName === "IMG");
    expect(image.attributes.src).toBe(roomThumbnailAsset("room.mri")!.src);
    expect(frame.attributes["data-art-state"]).toBe("placeholder");
    await act(async () => { (testElementProps(image)[fail ? "onError" : "onLoad"] as () => void)(); });
    expect(frame.attributes["data-art-state"]).toBe(fail ? "unavailable" : "ready");
    expect(load).not.toHaveBeenCalled(); expect(disconnect).toHaveBeenCalled();
  });
});
