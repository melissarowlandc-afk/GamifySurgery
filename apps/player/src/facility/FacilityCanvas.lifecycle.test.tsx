import { afterEach, expect, it, vi } from "vitest";
import { act } from "react";
import { phoneFixture, phoneTestDom, cleanupPhoneTests } from "../mobile/screenTestUtils";
import { FacilityCanvas } from "./FacilityCanvas";

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
    isBooted = true; isPaused = false; scale = { width: 390, height: 844, resize: vi.fn() };
    loop = { running: true, setFPSLimit: vi.fn(), sleep: vi.fn(() => { this.loop.running = false; }),
      wake: vi.fn(() => { this.loop.running = true; }) };
    resume = vi.fn(); destroy = vi.fn();
    constructor(public config: any) { config.parent.appendChild(this.canvas); captured.games.push(this); }
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
