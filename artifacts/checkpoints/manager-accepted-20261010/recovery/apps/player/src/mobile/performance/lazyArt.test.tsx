import { act } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createInitialGameState } from "@gamify-surgery/game-domain";
import { createPrototypePlayerView } from "../../session/viewModels";
import { FacilityScene, type FacilitySceneBridge } from "../../facility/FacilityScene";
import { getPhaserTextureKey } from "../../art/bitmapAssetAdapters";
import { cleanupPhoneTests, phoneTestDom } from "../screenTestUtils";
import { RoomThumbnail } from "../build/RoomThumbnail";
import { mobileBitmapCache, mobileRoomAssets, selectFacilityAssets } from "./roomAssets";
import { MobileMapPresentationPolicy } from "./presentationPolicy";

vi.mock("phaser", () => ({ default: { Scene: class {} } }));
afterEach(async () => { await cleanupPhoneTests(); vi.restoreAllMocks(); });

describe("mobile lazy art integration", () => {
  it("loads only Level 0 at create, then missing preview and Level 4 assets; covered completions do no drawing", async () => {
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
    const all = selectFacilityAssets({ mobile: true, facilityLevel: 4, builtRoomIds: ["room.front_desk"] });
    await vi.waitFor(() => expect(keys.size).toBe(all.length));
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
  it.each([false, true])("defers catalog requests until visible and shows a whole placeholder until completion (failure=%s)", async fail => {
    const env = phoneTestDom();
    const draw = vi.fn(); const context = { fillRect: vi.fn(), strokeRect: vi.fn(), save: vi.fn(), restore: vi.fn(),
      setTransform: vi.fn(), transform: vi.fn(), drawImage: draw };
    const createElement = env.doc.createElement.bind(env.doc);
    env.doc.createElement = name => { const element = createElement(name); if (name === "canvas") Object.assign(element, { dataset: {}, getContext: () => context }); return element; };
    vi.stubGlobal("Image", class {});
    let intersect!: (entries: { isIntersecting: boolean }[]) => void;
    const disconnect = vi.fn();
    vi.stubGlobal("IntersectionObserver", class { constructor(callback: typeof intersect) { intersect = callback; } observe() {} disconnect = disconnect; });
    const completions: ((image: HTMLImageElement | null) => void)[] = [];
    const load = vi.spyOn(mobileBitmapCache, "load").mockImplementation(() => new Promise(resolve => completions.push(resolve)));
    const visible = vi.fn();
    await env.render(<RoomThumbnail definitionId="room.mri" onVisible={visible} />);
    const canvas = env.find(node => node.tagName === "CANVAS") as unknown as HTMLCanvasElement;
    expect(canvas.dataset.artState).toBe("placeholder"); expect(load).not.toHaveBeenCalled();
    await act(async () => intersect([{ isIntersecting: false }])); expect(load).not.toHaveBeenCalled();
    await act(async () => intersect([{ isIntersecting: true }]));
    expect(visible).toHaveBeenCalledExactlyOnceWith("room.mri"); expect(load).toHaveBeenCalledTimes(mobileRoomAssets("room.mri").length);
    expect(draw).not.toHaveBeenCalled(); expect(canvas.dataset.artState).toBe("placeholder");
    await act(async () => { completions.forEach((complete, index) => complete(fail && index === 0 ? null : {} as HTMLImageElement)); });
    expect(canvas.dataset.artState).toBe(fail ? "unavailable" : "ready");
    if (fail) expect(draw).not.toHaveBeenCalled(); else expect(draw).toHaveBeenCalled();
    expect(disconnect).toHaveBeenCalled();
  });
});
