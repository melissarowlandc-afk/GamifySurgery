import { afterEach, expect, it, vi } from "vitest";
import { startFacilityClock, type FacilityClockScheduler } from "../../session/facilityClock";
import { bindVisibleInterval } from "./visibleInterval";

afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); });

it("reuses the existing clock watchdog to resume quiet polls after Safari omits its foreground event", async () => {
  vi.useFakeTimers();
  const doc = Object.assign(new EventTarget(), { visibilityState: "visible" as DocumentVisibilityState }); vi.stubGlobal("document", doc);
  const browser = Object.assign(new EventTarget(), { setInterval: globalThis.setInterval, clearInterval: globalThis.clearInterval });
  const poll = vi.fn(), advance = vi.fn();
  const stopPoll = bindVisibleInterval(browser as unknown as Window, doc, poll, 1000);
  const stopClock = startFacilityClock(globalThis as unknown as FacilityClockScheduler, 1000,
    () => ({ tick: 0, paused: true, speed: 1, visible: doc.visibilityState !== "hidden", allowed: true }), advance);
  try {
    expect(vi.getTimerCount()).toBe(2);
    doc.visibilityState = "hidden"; doc.dispatchEvent(new Event("visibilitychange"));
    await vi.advanceTimersByTimeAsync(5000); expect(poll).not.toHaveBeenCalled(); expect(vi.getTimerCount()).toBe(1);
    doc.visibilityState = "visible"; // Deliberately no visibilitychange/pageshow/focus.
    await vi.advanceTimersByTimeAsync(1000); expect(vi.getTimerCount()).toBe(2);
    await vi.advanceTimersByTimeAsync(1000); expect(poll).toHaveBeenCalledOnce(); expect(advance).not.toHaveBeenCalled();
  } finally { stopPoll(); stopClock(); }
  expect(vi.getTimerCount()).toBe(0);
});
