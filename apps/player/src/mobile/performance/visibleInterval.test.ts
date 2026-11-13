import { afterEach, expect, it, vi } from "vitest";
import { bindVisibleInterval, wakeVisibleIntervals } from "./visibleInterval";
import { IdleWorkerRelease } from "./idleWorkerRelease";

afterEach(() => vi.useRealTimers());

it("has no hidden/bfcache polling and resumes exactly one cadence with complete cleanup", () => {
  const active = new Map<number, () => void>(); let id = 0;
  const browser = Object.assign(new EventTarget(), { setInterval: (run: () => void) => { active.set(++id, run); return id; }, clearInterval: (key: number) => active.delete(key) });
  const doc = Object.assign(new EventTarget(), { visibilityState: "visible" as DocumentVisibilityState });
  const work = vi.fn(), stop = bindVisibleInterval(browser as unknown as Window, doc as unknown as Document, work, 1000);
  expect(active.size).toBe(1); const queued = [...active.values()][0]!; queued(); expect(work).toHaveBeenCalledTimes(1);
  doc.visibilityState = "hidden"; doc.dispatchEvent(new Event("visibilitychange")); queued(); expect(active.size).toBe(0); expect(work).toHaveBeenCalledTimes(1);
  doc.visibilityState = "visible"; doc.dispatchEvent(new Event("visibilitychange")); browser.dispatchEvent(new Event("pageshow")); expect(active.size).toBe(1);
  browser.dispatchEvent(new Event("pagehide")); expect(active.size).toBe(0);
  browser.dispatchEvent(new Event("pageshow")); expect(active.size).toBe(1);
  doc.visibilityState = "hidden"; doc.dispatchEvent(new Event("visibilitychange")); expect(active.size).toBe(0);
  wakeVisibleIntervals(doc); expect(active.size).toBe(0);
  doc.visibilityState = "visible"; wakeVisibleIntervals(doc); wakeVisibleIntervals(doc); expect(active.size).toBe(1);
  stop(); doc.dispatchEvent(new Event("visibilitychange")); browser.dispatchEvent(new Event("pageshow")); wakeVisibleIntervals(doc); expect(active.size).toBe(0);
});

it("resets an idle release on new work, defers unsafe barriers and never retries after dispose", async () => {
  vi.useFakeTimers(); const release = vi.fn().mockResolvedValueOnce(false).mockResolvedValue(true), idle = new IdleWorkerRelease(release, 1000);
  idle.update(1); await vi.advanceTimersByTimeAsync(900); idle.update(2); await vi.advanceTimersByTimeAsync(900); expect(release).not.toHaveBeenCalled();
  await vi.advanceTimersByTimeAsync(100); expect(release).toHaveBeenCalledTimes(1);
  await vi.advanceTimersByTimeAsync(1000); expect(release).toHaveBeenCalledTimes(2);
  idle.update(null); idle.update(3); idle.dispose(); await vi.advanceTimersByTimeAsync(10_000); expect(release).toHaveBeenCalledTimes(2); expect(vi.getTimerCount()).toBe(0);
});
