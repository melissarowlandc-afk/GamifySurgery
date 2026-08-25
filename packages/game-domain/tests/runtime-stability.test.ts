import { describe, expect, it } from "vitest";

import {
  createInitialGameState,
  gameReducer,
  type GameState,
} from "../src";

describe("long-session runtime state", () => {
  it("retains only a small rolling window of minute-tick receipts", () => {
    let state: GameState = createInitialGameState();
    state = gameReducer(state, {
      type: "SET_PAUSED",
      paused: false,
      operationId: "runtime.resume",
    });
    // Keep the regression focused on clock bookkeeping rather than producing
    // a large clinical queue while the synthetic session advances.
    state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
    state.environment.nextAmbientPedestrianTick = Number.MAX_SAFE_INTEGER;
    state.environment.nextLitterSpawnTick = Number.MAX_SAFE_INTEGER;

    for (let minute = 1; minute <= 180; minute += 1) {
      const operationId = `runtime.tick.${minute}`;
      state = gameReducer(state, {
        type: "ADVANCE_TICK",
        operationId,
      });
      expect(state.operationReceipts[operationId]?.status).toBe("applied");
    }

    const receipts = Object.values(state.operationReceipts);
    expect(
      receipts.filter((receipt) => receipt.commandType === "ADVANCE_TICK"),
    ).toHaveLength(4);
    expect(receipts.length).toBeLessThanOrEqual(96);
  });
});
