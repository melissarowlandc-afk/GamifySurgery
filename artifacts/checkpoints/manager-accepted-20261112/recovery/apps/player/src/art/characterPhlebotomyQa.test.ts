import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

const runtime = vi.hoisted(() => ({ scene: null as any, environmentBootstrap: vi.fn(), preloaded: [] as any[] }));
vi.mock("phaser", async () => {
  const { EventEmitter } = await import("node:events");
  return { default: {
    CANVAS: 1, Textures: { FilterMode: { NEAREST: 1, LINEAR: 0 } },
    Loader: { Events: { FILE_LOAD_ERROR: "loaderror" } },
    Scenes: { Events: { CREATE: "create" } }, Core: { Events: { POST_RENDER: "postrender" } },
    Game: class {
      constructor(config: any) {
        runtime.scene = config.scene[0];
        runtime.scene.game = { renderer: {}, events: new EventEmitter(), canvas: { toDataURL: () => "data:image/png;base64,test" } };
      }
    },
  } };
});
vi.mock("../facility/FacilityScene", async () => {
  const { EventEmitter } = await import("node:events");
  return { FacilityScene: class {
    events = new EventEmitter();
    textures = { exists: () => true };
    load = { on: vi.fn() };
    sys = { settings: { active: true, status: "CREATING" }, pause: () => {
      if (this.sys.settings.active) { this.sys.settings.active = false; this.sys.settings.status = "PAUSED"; }
    } };
    ensureEnvironmentAtlas() { runtime.environmentBootstrap(); }
    create() { this.ensureEnvironmentAtlas(); }
  } };
});
vi.mock("../facility/canvasRoomLighting", () => ({ assertCanvasRoomLighting: vi.fn() }));
vi.mock("./bitmapAssetAdapters", () => ({
  getPhaserTextureKey: (asset: { id: string }) => asset.id,
  preloadBitmapAssets: (_load: unknown, assets: any[]) => { runtime.preloaded = assets; },
}));

beforeAll(async () => {
  const node = () => ({ value: "", textContent: "", append: vi.fn() });
  const nodes = new Map<string, ReturnType<typeof node>>();
  vi.stubGlobal("location", { hostname: "127.0.0.1", origin: "http://127.0.0.1:4173" });
  vi.stubGlobal("window", { addEventListener: vi.fn(), setTimeout, clearTimeout });
  vi.stubGlobal("document", {
    createElement: node,
    getElementById: (id: string) => { if (!nodes.has(id)) nodes.set(id, node()); return nodes.get(id); },
  });
  await import("./characterPhlebotomyQa");
});
afterAll(() => vi.unstubAllGlobals());

describe("isolated phlebotomy QA capture lifecycle", () => {
  it("preloads the stationary south frame actually selected by the renderer", () => {
    runtime.scene.preload();
    expect(runtime.preloaded).toHaveLength(13);
    const paths = runtime.preloaded.map(asset => asset.relativePath);
    expect(paths).toContain("art/characters/gs026-stills-v1/gs022-new-employee-015/stand-south.png");
    expect(paths).not.toContain("art/characters/gs026-stills-v1/gs022-new-employee-015/stand-west.png");
  });

  it("waits for Phaser CREATE before pausing/drawing, and skips the async full-world bootstrap", async () => {
    const scene = runtime.scene;
    scene.readCapture = vi.fn(() => { scene.sys.pause(); return { stage: { tileSize: 52 } }; });
    scene.create();
    expect(runtime.environmentBootstrap).not.toHaveBeenCalled();
    expect(scene.readCapture).not.toHaveBeenCalled();
    expect(scene.sys.settings).toEqual({ active: true, status: "CREATING" });
    // Match SceneManager.create(): it writes RUNNING after scene.create returns.
    scene.sys.settings.status = "RUNNING";
    scene.events.emit("create");
    expect(scene.readCapture).toHaveBeenCalledOnce();
    expect(scene.sys.settings).toEqual({ active: false, status: "PAUSED" });
    expect(window.__characterPhlebotomyQa.ready).toBe(false);
    scene.game.events.emit("postrender");
    await vi.waitFor(() => expect(window.__characterPhlebotomyQa.ready).toBe(true));
  });
});
