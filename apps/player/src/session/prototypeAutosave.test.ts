import { describe, expect, it } from "vitest";
import {
  cancelPrototypeAutosaveTask,
  PROTOTYPE_AUTOSAVE_INTERVAL_FACILITY_TICKS,
  requestPrototypeAutosaveTask,
  shouldPersistPrototypeCommand,
  type PrototypeAutosaveTaskHost,
} from "./prototypeAutosave";

describe("prototype autosave cadence", () => {
  it("coalesces ordinary facility ticks onto quarter-hour boundaries", () => {
    expect(PROTOTYPE_AUTOSAVE_INTERVAL_FACILITY_TICKS).toBe(15);
    expect(shouldPersistPrototypeCommand("ADVANCE_TICK", 1)).toBe(false);
    expect(shouldPersistPrototypeCommand("ADVANCE_TICK", 14)).toBe(false);
    expect(shouldPersistPrototypeCommand("ADVANCE_TICK", 15)).toBe(true);
    expect(shouldPersistPrototypeCommand("ADVANCE_TICK", 29)).toBe(false);
    expect(shouldPersistPrototypeCommand("ADVANCE_TICK", 30)).toBe(true);
  });

  it.each([
    "SET_PAUSED",
    "SET_SIMULATION_SPEED",
    "OPEN_CHART",
    "SUBMIT_ANSWER",
    "PLACE_ROOM",
  ] as const)("keeps %s write-through between autosaves", (commandType) => {
    expect(shouldPersistPrototypeCommand(commandType, 7)).toBe(true);
  });

  it("defers full-profile work to browser idle time when available", () => {
    let scheduled: (() => void) | null = null;
    let cancelledId: number | null = null;
    const host: PrototypeAutosaveTaskHost = {
      requestIdleCallback: (callback) => {
        scheduled = callback;
        return 17;
      },
      cancelIdleCallback: (id) => {
        cancelledId = id;
      },
      setTimeout: () => 99,
      clearTimeout: () => undefined,
    };
    let saves = 0;

    const task = requestPrototypeAutosaveTask(host, () => {
      saves += 1;
    });

    expect(task).toEqual({ kind: "idle", id: 17 });
    expect(saves).toBe(0);
    (scheduled as (() => void) | null)?.();
    expect(saves).toBe(1);
    cancelPrototypeAutosaveTask(host, task);
    expect(cancelledId).toBe(17);
  });

  it("uses a cancellable zero-delay task when idle callbacks are unavailable", () => {
    let scheduled: (() => void) | null = null;
    let cancelledId: number | null = null;
    const host: PrototypeAutosaveTaskHost = {
      setTimeout: (callback) => {
        scheduled = callback;
        return 23;
      },
      clearTimeout: (id) => {
        cancelledId = id;
      },
    };

    const task = requestPrototypeAutosaveTask(host, () => undefined);

    expect(task).toEqual({ kind: "timeout", id: 23 });
    expect(scheduled).not.toBeNull();
    cancelPrototypeAutosaveTask(host, task);
    expect(cancelledId).toBe(23);
  });
});
