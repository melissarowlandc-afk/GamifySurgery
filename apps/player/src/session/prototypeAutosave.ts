import type { GameCommand } from "@gamify-surgery/game-domain";

/**
 * Persist the complete local campaign profile on quarter-hour facility
 * boundaries. At the pilot clock rates this is every 15 seconds at 1x and
 * every 3.75 seconds at 4x, while eliminating synchronous serialization from
 * the other fourteen facility-minute ticks.
 */
export const PROTOTYPE_AUTOSAVE_INTERVAL_FACILITY_TICKS = 15;

const PROTOTYPE_AUTOSAVE_IDLE_TIMEOUT_MS = 2_000;

export type PrototypeAutosaveTask =
  | { kind: "idle"; id: number }
  | { kind: "timeout"; id: number };

export interface PrototypeAutosaveTaskHost {
  requestIdleCallback?: (
    callback: () => void,
    options?: { timeout: number },
  ) => number;
  cancelIdleCallback?: (id: number) => void;
  setTimeout: (callback: () => void, delay: number) => number;
  clearTimeout: (id: number) => void;
}

/**
 * Move full-profile serialization out of the facility-tick callback.
 *
 * localStorage writes are synchronous. As a campaign grows, serializing it in
 * the same task that extends character routes can consume the next animation
 * frame and produce a visible stop-and-sprint cadence. Browsers with an idle
 * scheduler perform the checkpoint between busy frames; the timeout fallback
 * preserves compatibility in test DOMs and older browsers.
 */
export function requestPrototypeAutosaveTask(
  host: PrototypeAutosaveTaskHost,
  callback: () => void,
): PrototypeAutosaveTask {
  if (typeof host.requestIdleCallback === "function") {
    return {
      kind: "idle",
      id: host.requestIdleCallback(callback, {
        timeout: PROTOTYPE_AUTOSAVE_IDLE_TIMEOUT_MS,
      }),
    };
  }
  return {
    kind: "timeout",
    id: host.setTimeout(callback, 0),
  };
}

export function cancelPrototypeAutosaveTask(
  host: PrototypeAutosaveTaskHost,
  task: PrototypeAutosaveTask,
): void {
  if (
    task.kind === "idle" &&
    typeof host.cancelIdleCallback === "function"
  ) {
    host.cancelIdleCallback(task.id);
    return;
  }
  host.clearTimeout(task.id);
}

/**
 * Player actions and other meaningful commands remain write-through. Only the
 * high-frequency facility clock command is coalesced onto deterministic
 * autosave boundaries.
 */
export function shouldPersistPrototypeCommand(
  commandType: GameCommand["type"],
  facilityTick: number,
): boolean {
  if (commandType !== "ADVANCE_TICK") {
    return true;
  }
  return (
    facilityTick > 0 &&
    facilityTick % PROTOTYPE_AUTOSAVE_INTERVAL_FACILITY_TICKS === 0
  );
}
