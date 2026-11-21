import { EventEmitter } from "node:events";
import { act, type ComponentProps } from "react";
import { afterEach, vi } from "vitest";
import type { GameState } from "@gamify-surgery/game-domain";
import * as domain from "@gamify-surgery/game-domain";
import { ActivePrototypeGame } from "../App";
import { AuthAccountContext } from "../auth/AuthAccountContext";
import { findTestElement, TestElement } from "../mobile/testDom";
import { createFreshProfile } from "../session/prototypeStorage";
import { operationalSessionFixture } from "../session/cloud/operationalSessionTestSupport";
import { cleanupPhoneTests, phoneTestDom } from "../ui/testDomHarness";
import { canvasClinic, roomCenter, workingCamera } from "./desktopLagAcceptanceFixtures";
import { facilityCameraPreferenceKey } from "../session/facilityCameraPreference";
import type { FacilityScene } from "./FacilityScene";
import type { FacilityViewModel } from "./types";

vi.mock("phaser", () => ({ default: {
  Scene: class {}, Game: HeadlessCanvasGame, CANVAS: 1, Scale: { NONE: 0, Events: { RESIZE: "resize" } },
  BlendModes: { MULTIPLY: 2, SCREEN: 3 }, Scenes: { Events: { RESUME: "resume", WAKE: "wake", SHUTDOWN: "shutdown" } },
  Core: { Events: { POST_STEP: "poststep", RESUME: "resume" } },
  Textures: { FilterMode: { LINEAR: 1 }, Events: { ADD: "addtexture" } }, Renderer: { Events: { PRE_RENDER: "prerender" } },
} }));

vi.mock("../ui", async importOriginal => {
  const ui = await importOriginal<typeof import("../ui")>();
  return { ...ui, BuildPanel: (props: ComponentProps<typeof ui.BuildPanel>) => {
    chooseDoorTool = props.onBuildDoorToolChange;
    return <ui.BuildPanel {...props} />;
  } };
});

vi.mock("../../../../node_modules/@gamify-surgery/game-domain/src/facilityNavigation", async importOriginal => {
  const navigation = await importOriginal<typeof import("../../../../packages/game-domain/src/facilityNavigation")>();
  return { ...navigation, createFacilityNavigationCache<T>(limit?: number) {
    const cached = navigation.createFacilityNavigationCache<T>(limit);
    return (...[rooms, doors, reader, build]: Parameters<typeof cached>) => cached(rooms, doors, reader, () => {
      observeLayoutBuild?.(doors);
      const layout = build();
      if (layout && typeof layout === "object" && "graphs" in layout && layout.graphs instanceof Map) {
        // Graphs are built lazily after layout. The cache write observes a
        // completed graph even if the private graph builder is renamed.
        const graphs = layout.graphs;
        const set = graphs.set;
        graphs.set = function (key, graph) { observeGraphBuild?.(doors); return set.call(this, key, graph); };
      }
      return layout;
    });
  } };
});

// React owns the real App, hooks, AppShell, and FacilityCanvas bridge. Only
// Phaser host boot, DOM transport, storage transport and clock are in memory.
let mounted: HeadlessCanvasGame;
let observedResize: ((width: number, height: number) => void) | undefined;
let cleanup: (() => void) | undefined;
let chooseDoorTool: ((tool: "place" | "remove" | null) => void) | undefined;
let adaptProjection: ((model: FacilityViewModel) => FacilityViewModel) | undefined;
let observeLayoutBuild: ((doors: readonly GameState["doors"][number][]) => void) | undefined;
let observeGraphBuild: typeof observeLayoutBuild;

function HeadlessCanvasGame(this: unknown, config: { width: number; height: number; parent: TestElement; scene: FacilityScene }) {
  const scene = config.scene as unknown as { bridge: { viewModel: FacilityViewModel }; game: unknown; sys: { game: unknown }; events: EventEmitter };
  if (adaptProjection) {
    const adapt = adaptProjection;
    let model = adapt(scene.bridge.viewModel);
    Object.defineProperty(scene.bridge, "viewModel", { configurable: true, get: () => model,
      set(next: FacilityViewModel) { model = adapt(next); } });
  }
  const f = canvasClinic(scene.bridge.viewModel, { scene: config.scene, width: config.width, height: config.height, authored: true });
  const events = new EventEmitter();
  const canvas = config.parent.ownerDocument.createElement("canvas");
  config.parent.appendChild(canvas);
  const game = {
    f, events, canvas, isBooted: true, isPaused: false, loop: { running: true, targetFps: 60, wake() {} },
    textures: f.scene.textures, renderer: f.scene.game.renderer, scene: { getScene: () => scene },
    scale: Object.assign(f.scale, { resize(width: number, height: number) { f.scale.width = width; f.scale.height = height; } }),
    destroy() { scene.events.emit("shutdown"); canvas.remove(); events.removeAllListeners(); },
  };
  scene.game = scene.sys.game = game;
  mounted = game;
  return game;
}
type HeadlessCanvasGame = ReturnType<typeof HeadlessCanvasGame>;

export function observeDoorWork(savedDoors: readonly GameState["doors"][number][]) {
  const savedIds = new Set(savedDoors.map(door => door.id));
  const initial = () => ({ candidates: 0, roomVisits: 0, doorVisits: 0, speculativeKeys: 0, speculativeLayouts: 0, speculativeGraphs: 0 });
  let counts = initial();
  observeLayoutBuild = doors => { if (doors.some(door => !savedIds.has(door.id))) counts.speculativeLayouts++; };
  observeGraphBuild = doors => { if (doors.some(door => !savedIds.has(door.id))) counts.speculativeGraphs++; };
  const stringify = JSON.stringify;
  const serialization = vi.spyOn(JSON, "stringify").mockImplementation((value, replacer, space) => {
    // The native navigation cache serializes [footprints, doors, definitions].
    // Detect speculative geometry at the serialization boundary.
    if (Array.isArray(value) && value.length === 3 && value.every(Array.isArray) && value[1]!.some(
      (row: unknown) => Array.isArray(row) && row.length === 5 && typeof row[0] === "string" && !savedIds.has(row[0]),
    )) counts.speculativeKeys++;
    return Reflect.apply(stringify, JSON, [value, replacer, space]) as string;
  });
  function observeVisits<T>(rows: readonly T[], visit: () => void): readonly T[] {
    return new Proxy(rows, { get(target, property, receiver) {
      if (typeof property === "string" && property >= "0" && property[0]! <= "9") visit();
      return Reflect.get(target, property, receiver);
    } });
  }
  const validate = domain.validateDoorPlacement;
  const validation = vi.spyOn(domain, "validateDoorPlacement").mockImplementation((door, rooms, doors, ...args) => {
    if (savedIds.has(door.id)) return validate(door, rooms, doors, ...args);
    counts.candidates++;
    return validate(door, observeVisits(rooms, () => counts.roomVisits++), observeVisits(doors, () => counts.doorVisits++), ...args);
  });
  return { read: () => ({ ...counts }), reset: () => { counts = initial(); }, zero: initial(),
    stop() { observeLayoutBuild = observeGraphBuild = undefined; validation.mockRestore(); serialization.mockRestore(); } };
}

afterEach(async () => {
  try { await cleanupPhoneTests(); }
  finally {
    cleanup?.(); cleanup = undefined; observedResize = undefined; chooseDoorTool = undefined;
    adaptProjection = undefined; observeLayoutBuild = observeGraphBuild = undefined; vi.restoreAllMocks();
  }
});

export async function mountDesktopClinic(state: GameState, options: {
  adapt?: (model: FacilityViewModel) => FacilityViewModel; localProjection?: boolean;
} = {}) {
  adaptProjection = options.adapt;
  const operational = await operationalSessionFixture({}, state);
  cleanup = () => operational.session.dispose();
  const env = phoneTestDom();
  vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "Date"] });
  vi.setSystemTime(operational.clock.wall);
  const storage = new Map([[facilityCameraPreferenceKey(state.campaignId), JSON.stringify({ schemaVersion: 1, camera: workingCamera })]]);
  const writes = vi.fn((key: string, value: string) => { storage.set(key, value); });
  Object.assign(env.browser, {
    innerWidth: 1440, innerHeight: 1000, devicePixelRatio: 1,
    location: { href: "http://127.0.0.1:5184/?layout=desktop", search: "?layout=desktop" },
    localStorage: { getItem: (key: string) => storage.get(key) ?? null, setItem: writes, removeItem: (key: string) => storage.delete(key) },
    setInterval: () => 1, clearInterval() {},
    requestAnimationFrame: (callback: FrameRequestCallback) => setTimeout(() => callback(Date.now()), 0),
    cancelAnimationFrame: (timer: ReturnType<typeof setTimeout>) => clearTimeout(timer),
    setTimeout: (...args: Parameters<typeof setTimeout>) => setTimeout(...args),
    clearTimeout: (...args: Parameters<typeof clearTimeout>) => clearTimeout(...args),
  });
  const create = env.doc.createElement.bind(env.doc);
  env.doc.createElement = (name: string) => Object.assign(create(name), { clientWidth: 1100, clientHeight: 780, dataset: {} });
  Object.assign(env.doc, { visibilityState: "visible" });
  vi.stubGlobal("ResizeObserver", class {
    private target?: TestElement;
    constructor(private callback: (entries: { contentRect: { width: number; height: number } }[]) => void) {}
    observe(target: TestElement) {
      this.target = target;
      // Match FacilityCanvas's real observer, independent of other observers
      // attached by the surrounding desktop panels.
      if (target.childNodes.some(node => node.tagName === "CANVAS")) {
        observedResize = (width, height) => {
          Object.assign(this.target!, { clientWidth: width, clientHeight: height });
          this.callback([{ contentRect: { width, height } }]);
        };
      }
    }
    disconnect() { this.target = undefined; }
  });

  const profile = { ...createFreshProfile(), activeCampaignId: state.campaignId, tutorialsEnabled: false,
    tutorialGuidanceByCampaign: { [state.campaignId]: { version: 2 as const, mode: "off" as const, exposedTopicIds: [] } },
    campaigns: [{ ...operational.session.metadata, state: operational.session.state }],
  };
  if (options.localProjection) vi.stubGlobal("indexedDB", undefined);
  await env.render(<AuthAccountContext.Provider value={options.localProjection ? null : operational.scope.accountId}>
    <ActivePrototypeGame cloudSession={options.localProjection ? undefined : operational.session} loadedProfile={{ profile, notice: "Public synthetic clinic" }}
      onRequestNewCampaign={() => {}} onRequestRestart={() => {}} />
  </AuthAccountContext.Provider>);
  const game = mounted;
  const f = game.f;
  async function frame(delta?: number) {
    await act(async () => { f.frame(delta); game.events.emit("poststep"); });
  }
  async function action(work: () => unknown) {
    await act(async () => {
      await work();
      if (!options.localProjection) { await operational.session.commandsSettled(); await operational.session.durable(); }
    });
  }
  async function click(name: string) {
    const button = findTestElement(env.doc.body, node => node.tagName === "BUTTON" &&
      (node.attributes["aria-label"] === name || node.textContent === name));
    if (!button) throw Error(`Desktop button '${name}' was not rendered`);
    await env.clickElement(button);
    await action(() => {});
  }
  await frame();
  return { ...operational, env, f, storage, writes, action, click, frame,
    async openChart(encounterId: string) {
      const operationId = "public.perf.open-chart";
      await action(() => operational.session.executeAsync({ type: "OPEN_CHART", encounterId, operationId }, domain.PROTOTYPE_DOMAIN_CONTEXT));
      const { status, message } = operational.session.state.operationReceipts[operationId] ?? {};
      if (status !== "applied") throw Error(`Chart could not be opened: ${message}`);
      await frame();
    },
    async revealRoom(roomId: string) {
      const point = roomCenter(f, roomId);
      const visible = ({ x, y }: { x: number; y: number }) => x > 25 && x < f.scale.width - 25 && y > 25 && y < f.scale.height - 25;
      if (visible(point)) return;
      const camera = f.scene.getCameraPreference();
      await action(() => f.scene.applyCamera({ ...camera,
        panX: camera.panX + f.scale.width / 2 - point.x, panY: camera.panY + f.scale.height / 2 - point.y }));
      await frame(190);
      if (!visible(roomCenter(f, roomId))) throw Error(`Could not pan ${roomId} into the native camera viewport`);
    },
    async removeTool() {
      if (!chooseDoorTool) throw Error("BuildPanel did not publish its door tool callback");
      await act(async () => chooseDoorTool!("remove"));
    },
    async resize(width: number, height: number) {
      if (!observedResize) throw Error("FacilityCanvas did not attach a ResizeObserver");
      await act(async () => { observedResize!(width, height); await vi.advanceTimersByTimeAsync(1); });
      await frame();
    },
    async visibility(value: "hidden" | "visible") {
      await act(async () => {
        Object.assign(env.doc, { visibilityState: value });
        env.doc.dispatchEvent(new Event("visibilitychange"));
      });
    },
  };
}
