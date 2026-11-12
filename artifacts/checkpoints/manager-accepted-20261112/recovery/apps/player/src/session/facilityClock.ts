import { problemDiagnostics } from "../diagnostics/problemDiagnostics";

export interface FacilityClockScheduler {
  setInterval(callback: () => void, ms: number): number; clearInterval(id: number): void;
  setTimeout(callback: () => void, ms: number): number; clearTimeout(id: number): void;
  requestAnimationFrame?(callback: FrameRequestCallback): number; cancelAnimationFrame?(id: number): void;
}
export const FACILITY_CLOCK_STALL_MS = 5_000;

/** No catch-up ticks and no authority bypass. A separate timer repairs a lost
 * interval/rAF after iOS suspension; every tick still uses the command boundary. */
export function startFacilityClock(scheduler: FacilityClockScheduler, intervalMs: number,
  read: () => { tick: number; paused: boolean; speed: number; visible: boolean; allowed: boolean }, advance: () => void,
  now = Date.now): () => void {
  let stopped = false, interval: number | null = null, watchdog = 0, frame: number | null = null;
  let lastTimer = now(), lastFrame: number | null = null, frameRequestedAt: number | null = null;
  let lastTickAt = now(), lastTick = read().tick, lastRepair = now(), restarts = 0;
  const observe = () => { const state = read(); if (state.tick !== lastTick) { lastTick = state.tick; lastTickAt = now(); } return state; };
  const tick = () => {
    lastTimer = now();
    const state = observe();
    if (!state.visible || state.paused || !state.allowed) return;
    try { advance(); observe(); } catch (error) { problemDiagnostics.error("facility-clock", error); }
  };
  const start = () => { if (interval !== null) scheduler.clearInterval(interval); interval = scheduler.setInterval(tick, intervalMs); };
  const unbind = problemDiagnostics.source("clock", () => { const state = observe(); return {
    tick: state.tick, paused: state.paused, speed: state.speed, visible: state.visible, allowed: state.allowed,
    lastTickAt, tickAge: now() - lastTickAt, timerAge: now() - lastTimer, rafAge: lastFrame === null ? null : now() - lastFrame,
    rafPendingAge: frameRequestedAt === null ? null : now() - frameRequestedAt, restarts,
  }; });
  const check = () => {
    if (stopped) return;
    const state = observe();
    const running = state.visible && !state.paused && state.allowed;
    if (running && interval === null) { start(); lastRepair = now(); }
    if (!running && interval !== null) { scheduler.clearInterval(interval); interval = null; }
    if (state.visible && !state.paused && state.allowed && now() - Math.max(lastTickAt, lastRepair) >= Math.max(FACILITY_CLOCK_STALL_MS, intervalMs * 3)) {
      restarts++; problemDiagnostics.event("watchdog", "facility-clock-restart"); start(); tick();
      // Retry at most once per stall window if a domain rule rejected the tick.
      lastRepair = now(); problemDiagnostics.persist();
    } else if (!state.visible || state.paused || !state.allowed) lastRepair = now();
    if (state.visible && frame === null && scheduler.requestAnimationFrame) {
      frameRequestedAt = now();
      frame = scheduler.requestAnimationFrame(() => { lastFrame = now(); frameRequestedAt = null; frame = null; });
    }
    watchdog = scheduler.setTimeout(check, 1_000);
  };
  const initial = read(); if (initial.visible && !initial.paused && initial.allowed) start();
  watchdog = scheduler.setTimeout(check, 1_000);
  return () => { stopped = true; if (interval !== null) scheduler.clearInterval(interval); scheduler.clearTimeout(watchdog);
    if (frame !== null) scheduler.cancelAnimationFrame?.(frame); unbind(); };
}
