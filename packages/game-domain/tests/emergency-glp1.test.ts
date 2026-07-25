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

function advance(state: GameState, sequence: number): GameState {
  return gameReducer(state, {
    type: "ADVANCE_TICK",
    operationId: `test.glp1.tick.${sequence}`,
  });
}

function snapshot<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

describe("emergency manual GLP-1 consultation", () => {
  it("provides only the configured cash payment below the strict threshold", () => {
    const state = createInitialGameState();
    const learningBefore = snapshot(state.learningHistories);
    const encountersBefore = snapshot(state.encounters);
    const settlementsBefore = snapshot(state.settlements);
    const reviewsBefore = snapshot(state.reviewIntents);

    const next = consult(state, 1);

    expect(next.cash).toBe(
      state.cash +
        PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.emergencyGlp1.fullPayment,
    );
    expect(next.clinicalXp).toBe(state.clinicalXp);
    expect(next.satisfaction).toBe(state.satisfaction);
    expect(next.learningHistories).toEqual(learningBefore);
    expect(next.encounters).toEqual(encountersBefore);
    expect(next.settlements).toEqual(settlementsBefore);
    expect(next.reviewIntents).toEqual(reviewsBefore);
    expect(next.emergencyGlp1.usesToday).toBe(1);
    expect(next.events.at(-1)).toMatchObject({
      type: "emergency_glp1_consultation",
      reward: {
        cashDelta: 20,
        learningXpDelta: 0,
        satisfactionDelta: 0,
      },
    });

    const atThreshold = createInitialGameState();
    atThreshold.cash =
      PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.emergencyGlp1
        .cashEligibilityThreshold;
    const rejected = consult(atThreshold, 2);
    expect(rejected).not.toBe(atThreshold);
    expect(rejected.cash).toBe(atThreshold.cash);
    expect(rejected.operationReceipts["test.glp1.2"]?.status).toBe("rejected");
  });

  it("enforces a cooldown that survives save and reload", () => {
    const state = createInitialGameState();
    state.cash = 0;
    const first = consult(state, 1);
    first.cash = 0;

    const restored = deserializeGameState(serializeGameState(first));
    expect(getEmergencyGlp1Status(restored)).toMatchObject({
      eligible: false,
      cooldownRemainingTicks: 1,
      usesToday: 1,
    });

    const blocked = consult(restored, 2);
    expect(blocked.emergencyGlp1.usesToday).toBe(1);
    expect(blocked.operationReceipts["test.glp1.2"]?.status).toBe("rejected");

    const oneHourLater = advance(blocked, 1);
    oneHourLater.cash = 0;
    expect(getEmergencyGlp1Status(oneHourLater).eligible).toBe(true);
    expect(consult(oneHourLater, 3).emergencyGlp1.usesToday).toBe(2);
  });

  it("applies diminishing payment, the configured daily cap, and rotating sarcasm", () => {
    let state = createInitialGameState(undefined, {
      campaignSeed: "glp1-cap-test",
    });
    const payments: number[] = [];
    const flavorMessages: string[] = [];

    for (let use = 1; use <= 8; use += 1) {
      state.cash = 0;
      const beforeCash = state.cash;
      state = consult(state, use);
      payments.push(state.cash - beforeCash);
      if (state.emergencyGlp1.lastFlavorMessage) {
        flavorMessages.push(state.emergencyGlp1.lastFlavorMessage);
      }
      if (use < 8) {
        state = advance(state, use);
      }
    }

    expect(payments).toEqual([20, 20, 20, 20, 20, 10, 10, 10]);
    expect(flavorMessages).toEqual([
      "Your commitment to comprehensive metabolic care has been noted.",
      "Another individualized 90-second consultation completed.",
      "Prior authorization remains someone elses problem.",
      "At this point, this is less of a safety net and more of a business model.",
    ]);
    expect(state.emergencyGlp1.usesToday).toBe(8);

    state.cash = 0;
    state = advance(state, 8);
    const capped = consult(state, 9);
    expect(capped.emergencyGlp1.usesToday).toBe(8);
    expect(capped.operationReceipts["test.glp1.9"]?.status).toBe("rejected");
    expect(getEmergencyGlp1Status(capped).blockedReason).toContain(
      "Daily limit reached",
    );
  });

  it("resets daily use only when the next facility day begins", () => {
    let state = createInitialGameState();
    state.cash = 0;
    state = consult(state, 1);
    state = advance(state, 1);
    expect(state.emergencyGlp1.usesToday).toBe(1);

    for (let tick = 2; tick <= 10; tick += 1) {
      state = advance(state, tick);
    }

    expect(state.facilityTick).toBe(10);
    expect(state.emergencyGlp1).toMatchObject({
      dayNumber: 2,
      usesToday: 0,
      lastFlavorMessage: null,
    });
  });

  it("safely supplies defaults to older schema-v3 saves with no usage record", () => {
    const legacy = JSON.parse(
      serializeGameState(createInitialGameState()),
    ) as Record<string, unknown>;
    delete legacy.emergencyGlp1;

    const restored = deserializeGameState(JSON.stringify(legacy));

    expect(restored.emergencyGlp1).toEqual({
      dayNumber: 1,
      usesToday: 0,
      totalUses: 0,
      lastUsedAtFacilityTick: null,
      sarcasmMessagesShown: 0,
      lastFlavorMessage: null,
    });
  });
});
