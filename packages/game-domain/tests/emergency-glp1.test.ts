import { describe, expect, it } from "vitest";
import {
  PROTOTYPE_DOMAIN_CONTEXT,
  createInitialGameState,
  deserializeGameState,
  gameReducer,
  getEmergencyGlp1Status,
  serializeGameState,
  type GameState,
} from "../src";

function consult(state: GameState, sequence: number): GameState {
  return gameReducer(state, {
    type: "RUN_EMERGENCY_GLP1_CONSULTATION",
    operationId: `test.glp1.${sequence}`,
  });
}

function advanceMinutes(
  state: GameState,
  minutes: number,
  prefix: string,
): GameState {
  let next = state;
  for (let minute = 1; minute <= minutes; minute += 1) {
    next = gameReducer(next, {
      type: "ADVANCE_TICK",
      operationId: `${prefix}.${minute}`,
    });
  }
  return next;
}

describe("manual GLP-1 side-business action", () => {
  it("is available below the low-cash threshold and awards $25 cash only", () => {
    const initial = createInitialGameState();
    const histories = JSON.parse(
      JSON.stringify(initial.learningHistories),
    ) as typeof initial.learningHistories;

    const next = consult(initial, 1);

    expect(next.cash).toBe(
      initial.cash +
        PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.emergencyGlp1.payment,
    );
    expect(next.clinicalXp).toBe(0);
    expect(next.learningHistories).toEqual(histories);
    expect(next.emergencyGlp1.usesToday).toBe(1);
    expect(next.events.at(-1)).toMatchObject({
      type: "emergency_glp1_consultation",
      reward: {
        learningXpDelta: 0,
        satisfactionDelta: 0,
      },
    });
  });

  it("is unavailable when the clinic is not below the low-cash threshold", () => {
    const initial = createInitialGameState();
    initial.cashCents = 50_000;
    initial.cash = 500;
    expect(getEmergencyGlp1Status(initial)).toMatchObject({
      cashEligible: false,
      eligible: false,
    });
    const blocked = consult(initial, 99);
    expect(blocked.cash).toBe(500);
    expect(blocked.operationReceipts["test.glp1.99"]?.status).toBe("rejected");
  });

  it("uses facility-minute cooldown time and survives save/reload", () => {
    const first = consult(createInitialGameState(), 1);
    const restored = deserializeGameState(serializeGameState(first));

    expect(getEmergencyGlp1Status(restored)).toMatchObject({
      eligible: false,
      cooldownRemainingTicks: 60,
      usesToday: 1,
    });
    const blocked = consult(restored, 2);
    expect(blocked.operationReceipts["test.glp1.2"]?.status).toBe(
      "rejected",
    );

    const ready = advanceMinutes(
      blocked,
      60,
      "test.glp1.cooldown",
    );
    expect(getEmergencyGlp1Status(ready).eligible).toBe(true);
    expect(consult(ready, 3).emergencyGlp1.usesToday).toBe(2);
  });

  it("has no daily cap or diminishing payout and adds sarcasm after use five", () => {
    let state = createInitialGameState(undefined, {
      campaignSeed: "glp1-current-rules",
    });
    const payments: number[] = [];
    const flavor: string[] = [];
    const cooldown =
      PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.emergencyGlp1
        .cooldownMinutes;

    for (let use = 1; use <= 9; use += 1) {
      state.cash = 0;
      state.cashCents = 0;
      const before = state.cash;
      state = consult(state, use);
      payments.push(state.cash - before);
      if (state.emergencyGlp1.lastFlavorMessage) {
        flavor.push(state.emergencyGlp1.lastFlavorMessage);
      }
      if (use < 9) {
        state = advanceMinutes(
          state,
          cooldown,
          `test.glp1.between.${use}`,
        );
      }
    }

    expect(payments).toEqual([25, 25, 25, 25, 25, 25, 25, 25, 25]);
    expect(flavor.slice(0, 4)).toEqual([
      "Your commitment to comprehensive metabolic care has been noted.",
      "Another individualized 90-second consultation completed.",
      "Prior authorization remains someone elses problem.",
      "At this point, this is less of a safety net and more of a business model.",
    ]);
    state = advanceMinutes(state, cooldown, "test.glp1.no-cap");
    state.cash = 0;
    state.cashCents = 0;
    const tenth = consult(state, 10);
    expect(tenth.operationReceipts["test.glp1.10"]?.status).toBe("applied");
    expect(tenth.cash).toBe(25);
  });

  it("resets daily usage at the continuous ten-hour day rollover", () => {
    let state = consult(createInitialGameState(), 1);
    state = advanceMinutes(state, 600, "test.glp1.day");

    expect(state.facilityTick).toBe(600);
    expect(state.emergencyGlp1).toMatchObject({
      dayNumber: 2,
      usesToday: 0,
      lastFlavorMessage: null,
    });
  });
});
