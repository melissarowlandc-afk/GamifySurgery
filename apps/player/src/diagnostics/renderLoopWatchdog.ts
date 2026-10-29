import { problemDiagnostics } from "./problemDiagnostics";

/** Phaser's native wake() cancels its old rAF and starts a new one. It only
 * repairs presentation; it cannot advance the domain clock or grant commands. */
export interface PresentationLoop { isPaused: boolean; resume(): void; loop: { running: boolean; wake(): void } }
export function wakePresentationLoop(game: PresentationLoop): void {
  // Phaser Game.step returns before both input updates and POST_STEP while
  // isPaused. Restarting its rAF alone cannot recover that native lifecycle flag.
  if (game.isPaused) game.resume();
  game.loop.wake();
}
export function renderLoopWatchdog(visible: () => boolean, restart: () => void, now = Date.now,
  state: () => { paused: boolean; running: boolean } = () => ({ paused: false, running: true })) {
  let lastFrame = now(), lastRestart = now(), restarts = 0;
  const unbind = problemDiagnostics.source("render", () => ({ frameAge: now() - lastFrame, restarts, ...state() }));
  return {
    frame: () => { lastFrame = now(); },
    check: () => {
      if (!visible()) { lastRestart = now(); return; }
      if (now() - Math.max(lastFrame, lastRestart) < 5_000) return;
      lastRestart = now(); restarts++; problemDiagnostics.event("watchdog", "render-loop-restart");
      try { restart(); } catch (error) { problemDiagnostics.error("render-loop", error); }
    },
    dispose: unbind,
  };
}
