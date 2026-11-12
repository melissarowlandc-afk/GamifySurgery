import { afterEach, expect, it, vi } from "vitest";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { writeFileSync } from "node:fs";
import { PhoneFrameBudget } from "./frameBudget";

afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); });
it("runs the installed Phaser timestep at 30 active /1 paused /0 covered fps without duplicating rAF", async () => {
  const require = createRequire(import.meta.url);
  const TimeStep = require(resolve(dirname(require.resolve("phaser")), "../src/core/TimeStep.js"));
  let time = 0, sequence = 0, renders = 0;
  const callbacks = new Map<number, FrameRequestCallback>();
  vi.stubGlobal("window", { performance: { now: () => time },
    requestAnimationFrame: (callback: FrameRequestCallback) => { callbacks.set(++sequence, callback); return sequence; },
    cancelAnimationFrame: (id: number) => callbacks.delete(id) });
  let hidden = false, paused = false; const model = {};
  const game = { isPaused: false, resume() { this.isPaused = false; }, loop: null as any };
  game.loop = new TimeStep(game, { target: 30, limit: 30, smoothStep: false });
  const budget = new PhoneFrameBudget(game, () => ({ hidden, paused, model }), () => time);
  game.loop.start(() => { renders++; budget.frame(); });
  const frames = async (count: number) => {
    const start = renders;
    for (let i = 0; i < count; i++) {
      time += 1000 / 60; const next = [...callbacks.values()]; callbacks.clear();
      for (const callback of next) callback(time);
      await Promise.resolve();
      expect(callbacks.size).toBeLessThanOrEqual(1);
    }
    return renders - start;
  };
  await frames(60); const active = await frames(600); expect(active).toBeGreaterThanOrEqual(299); expect(active).toBeLessThanOrEqual(301);
  paused = true; budget.update(); await frames(60);
  const idle = await frames(600); expect(idle).toBeGreaterThanOrEqual(9);
  expect(await frames(600)).toBeLessThanOrEqual(11);
  hidden = true; budget.update(); expect(callbacks.size).toBe(0); const covered = await frames(600); expect(covered).toBe(0);
  hidden = false; paused = false; budget.update(); expect(callbacks.size).toBe(1);
  expect(await frames(600)).toBeGreaterThanOrEqual(299);
  budget.dispose(); game.loop.stop(); expect(callbacks.size).toBe(0);
  game.loop = new TimeStep(game, { smoothStep: false }); game.loop.start(() => { renders++; });
  await frames(60); const baseline = await frames(600); game.loop.stop(); expect(baseline).toBe(600);
  const report = { harness: "installed Phaser timestep with deterministic 60Hz rAF; no browser/GPU", baselineFps: baseline / 10,
    phoneActiveFps: active / 10, phoneIdleFps: idle / 10, coveredFps: covered / 10, maxPendingRaf: 1 };
  if (process.env.PHONE_RENDER_REPORT) writeFileSync(process.env.PHONE_RENDER_REPORT, JSON.stringify(report, null, 2));
});

it("keeps paused updates responsive, ignores shallow-identical React renders, and cleans the one quiet timer", async () => {
  vi.useFakeTimers(); let model = { tick: 1, rooms: [] as unknown[] }, hidden = false;
  const game = { isPaused: false, resume: vi.fn(), loop: { running: true, setFPSLimit: vi.fn(), sleep: vi.fn(), wake: vi.fn() } };
  const budget = new PhoneFrameBudget(game, () => ({ model, paused: true, hidden }));
  budget.update(); budget.frame(); await Promise.resolve();
  expect(game.loop.setFPSLimit).toHaveBeenLastCalledWith(1);
  for (let i = 0; i < 1000; i++) { model = { ...model }; budget.update(); }
  expect(vi.getTimerCount()).toBe(0);
  budget.interact(); expect(game.loop.setFPSLimit).toHaveBeenLastCalledWith(30);
  for (let i = 0; i < 1000; i++) budget.interact(); expect(vi.getTimerCount()).toBe(1);
  await vi.advanceTimersByTimeAsync(1_600); expect(game.loop.setFPSLimit).toHaveBeenLastCalledWith(1);
  model = { ...model, tick: 2 }; budget.update(); expect(game.loop.setFPSLimit).toHaveBeenLastCalledWith(30);
  hidden = true; budget.update(); expect(game.loop.sleep).toHaveBeenCalled(); expect(vi.getTimerCount()).toBe(0);
  budget.dispose(); budget.interact(); expect(vi.getTimerCount()).toBe(0);
});
