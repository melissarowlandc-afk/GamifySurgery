import { afterEach, expect, it, vi } from "vitest";
import { act } from "react";
import { phoneFixture, phoneTestDom, cleanupPhoneTests } from "../mobile/screenTestUtils";
import { DESKTOP_CAMERA_RESIZE_SETTLE_MS, FacilityCanvas } from "./FacilityCanvas";
import { bindFacilityCameraPreferenceLifecycle, createFacilityCameraPreferenceSession, readFacilityCameraPreference } from "../session/facilityCameraPreference";
import type { FacilityCameraView } from "./types";

const captured = vi.hoisted(() => ({ games: [] as any[] }));
vi.mock("phaser", () => {
  class Events {
    rows = new Map<string, Set<(...args: any[]) => void>>();
    on(key: string, work: (...args: any[]) => void) { if (!this.rows.has(key)) this.rows.set(key, new Set()); this.rows.get(key)!.add(work); }
    off(key: string, work: (...args: any[]) => void) { this.rows.get(key)?.delete(work); }
    emit(key: string) { for (const work of [...this.rows.get(key) ?? []]) work(); }
  }
  class Game {
    canvas = document.createElement("canvas"); events = new Events(); textures = new Events();
    isBooted = true; isPaused = false; scale = { width: 390, height: 844, resize: vi.fn((width: number, height: number) => {
      this.scale.width = width; this.scale.height = height; this.canvas.width = width; this.canvas.height = height;
    }) };
    loop = { running: true, setFPSLimit: vi.fn(), sleep: vi.fn(() => { this.loop.running = false; }),
      wake: vi.fn(() => { this.loop.running = true; }) };
    resume = vi.fn(); destroy = vi.fn();
    constructor(public config: any) {
      this.scale.width = config.width; this.scale.height = config.height;
      config.parent.appendChild(this.canvas); captured.games.push(this);
    }
  }
  return { default: { Scene: class { sys = { isActive: () => false }; }, Game, CANVAS: 1,
    Scale: { NONE: 0 }, Core: { Events: { POST_STEP: "poststep" } }, Textures: { Events: { ADD: "texture" } } } };
});

afterEach(async () => { await cleanupPhoneTests(); vi.unstubAllGlobals(); captured.games.length = 0; });
const observer = () => vi.stubGlobal("ResizeObserver", class { observe() {} disconnect() {} });

it("sleeps the mounted phone map on cover/visibility, wakes on reveal/input, and destroys a sleeping game", async () => {
  observer(); const env = phoneTestDom(); Object.assign(env.doc, { visibilityState: "visible" });
  Object.assign(env.browser, { setInterval, clearInterval });
  const fixture = phoneFixture(), facility = { ...fixture.facility, paused: true };
  const render = (covered = false) => env.render(<FacilityCanvas mobileInput viewModel={facility} mobileMapCovered={covered} onPlaceRoom={() => true} />);
  await render(); const game = captured.games[0];
  expect(game.config.fps).toEqual({ target: 30, limit: 30 });
  await act(async () => { game.events.emit("poststep"); });
  expect(game.loop.setFPSLimit).toHaveBeenLastCalledWith(1);
  await act(async () => { game.canvas.dispatchEvent(new Event("pointerdown")); });
  expect(game.loop.setFPSLimit).toHaveBeenLastCalledWith(30);
  await render(true); expect(game.loop.running).toBe(false);
  await render(false); expect(game.loop.running).toBe(true);
  await act(async () => { Object.assign(env.doc, { visibilityState: "hidden" }); env.doc.dispatchEvent(new Event("visibilitychange")); });
  expect(game.loop.running).toBe(false);
  const wakeCount = game.loop.wake.mock.calls.length;
  await cleanupPhoneTests();
  expect(game.destroy).toHaveBeenCalledWith(true);
  expect(game.loop.wake).toHaveBeenCalledTimes(wakeCount + 1);
  expect(game.events.rows.get("poststep")?.size).toBe(0);
  expect(game.textures.rows.get("texture")?.size).toBe(0);
  game.loop.setFPSLimit.mockClear();
  game.canvas.dispatchEvent(new Event("pointerdown"));
  expect(game.loop.setFPSLimit).not.toHaveBeenCalled();
});

it("leaves the desktop frame configuration and interaction lifecycle unchanged", async () => {
  observer(); const env = phoneTestDom(), fixture = phoneFixture();
  Object.assign(env.browser, { setInterval, clearInterval });
  await env.render(<FacilityCanvas viewModel={fixture.facility} onPlaceRoom={() => true} />);
  const game = captured.games[0]; expect(game.config.fps).toBeUndefined();
  game.canvas.dispatchEvent(new Event("pointerdown"));
  expect(game.loop.setFPSLimit).not.toHaveBeenCalled();
  await cleanupPhoneTests(); expect(game.destroy).toHaveBeenCalledWith(true); expect(game.loop.wake).not.toHaveBeenCalled();
});

it("resizes the desktop bitmap and live scene once per frame, publishing the camera only after resizing settles", async () => {
  vi.useFakeTimers();
  let notify!: ResizeObserverCallback;
  vi.stubGlobal("ResizeObserver", class { constructor(callback: ResizeObserverCallback) { notify = callback; } observe() {} disconnect() {} });
  const env = phoneTestDom(), fixture = phoneFixture();
  const values = new Map<string, string>(), storage = { getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => { values.set(key, value); } };
  const preferences = createFacilityCameraPreferenceSession(storage);
  const changed = vi.fn((camera: FacilityCameraView) => { preferences.change("shade", camera); });
  const subscribed = vi.spyOn(env.browser, "addEventListener");
  Object.assign(env.browser, { setInterval, clearInterval });
  await env.render(<FacilityCanvas viewModel={{ ...fixture.facility, camera: { zoom: 1.1, panX: 0, panY: 0 } }}
    onCameraChange={changed} onPlaceRoom={() => true} />);
  const game = captured.games[0], scene = game.config.scene;
  const host = env.find(node => node.attributes["data-testid"] === "facility-canvas");
  Object.defineProperties(host, { clientWidth: { configurable: true, value: 900 }, clientHeight: { configurable: true, value: 350 } });
  game.scale.width = 900; game.scale.height = 350; scene.scale = game.scale; scene.sys.isActive = () => true;
  scene.drawWorld = vi.fn(); scene.positionText = vi.fn(); scene.drawPlacementGhost = vi.fn();
  scene.refreshLayout(); game.events.emit("poststep");
  const tileSize = scene.layout.tileSize;
  expect(changed).toHaveBeenCalledOnce(); preferences.flush(); changed.mockClear(); scene.drawWorld.mockClear();
  const splitter = env.doc.createElement("div");
  Object.assign(splitter, { closest: (selector: string) => selector === ".workspace-splitter" ? splitter : null });
  const down = new Event("pointerdown"); Object.defineProperty(down, "target", { value: splitter });
  env.browser.dispatchEvent(down);
  for (const height of [360, 380, 400, 420, 450]) {
    Object.defineProperty(host, "clientHeight", { configurable: true, value: height });
    await act(async () => {
      notify([{ contentRect: { width: 900, height } } as ResizeObserverEntry], {} as ResizeObserver);
      vi.advanceTimersByTime(1); scene.refreshLayout(); game.events.emit("poststep");
    });
    expect(game.canvas.width).toBe(900); expect(game.canvas.height).toBe(height);
    expect(scene.layout.tileSize).toBe(tileSize); expect(scene.layout.worldBottom).toBe(height);
    // A slow drag/held pointer must not produce a parent render per move.
    await act(async () => { vi.advanceTimersByTime(DESKTOP_CAMERA_RESIZE_SETTLE_MS + 1); });
    expect(changed).not.toHaveBeenCalled();
  }
  expect(scene.drawWorld).toHaveBeenCalledTimes(5);
  env.browser.dispatchEvent(new Event("pointerup"));
  await act(async () => { vi.advanceTimersByTime(DESKTOP_CAMERA_RESIZE_SETTLE_MS); });
  expect(changed).toHaveBeenCalledOnce();
  expect(changed.mock.calls[0]![0]).toEqual(scene.getCameraPreference());
  expect(changed.mock.calls[0]![0].zoom).toBe(1.1);
  game.events.emit("poststep"); expect(changed).toHaveBeenCalledOnce();
  // Reload before another settle timeout: capture publishes first, then the
  // existing session lifecycle flush stores that exact small camera preference.
  const unbind = bindFacilityCameraPreferenceLifecycle(preferences, env.browser, env.doc as unknown as Document);
  changed.mockClear();
  Object.defineProperty(host, "clientHeight", { configurable: true, value: 500 });
  await act(async () => {
    notify([{ contentRect: { width: 900, height: 500 } } as ResizeObserverEntry], {} as ResizeObserver);
    vi.advanceTimersByTime(1); scene.refreshLayout(); game.events.emit("poststep");
  });
  expect(changed).not.toHaveBeenCalled();
  expect(subscribed.mock.calls.some(([event, , capture]) => event === "pagehide" && capture === true)).toBe(true);
  await act(async () => { env.browser.dispatchEvent(new Event("pagehide")); });
  expect(changed).toHaveBeenCalledOnce();
  expect(readFacilityCameraPreference("shade", storage)).toEqual(scene.getCameraPreference());
  unbind();
});

it("defers an initially covered phone map until first reveal, then retains the same game across covers", async () => {
  observer(); const env = phoneTestDom(), fixture = phoneFixture();
  Object.assign(env.browser, { setInterval, clearInterval });
  const render = (covered: boolean) => env.render(<FacilityCanvas mobileInput mobileMapCovered={covered} viewModel={fixture.facility} onPlaceRoom={() => true} />);
  await render(true); expect(captured.games).toHaveLength(0);
  await render(false); expect(captured.games).toHaveLength(1); const game = captured.games[0];
  await render(true); await render(false); expect(captured.games).toHaveLength(1); expect(game.destroy).not.toHaveBeenCalled();
  await cleanupPhoneTests(); expect(game.destroy).toHaveBeenCalledWith(true);
});
