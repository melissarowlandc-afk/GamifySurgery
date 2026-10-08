import { describe, expect, it } from "vitest";
import { captureClinicDaySummary, createInitialGameState, deserializeGameState, gameReducer, serializeGameState } from "../src";

describe("clinic day rollover digest", () => {
  it("captures one immutable summary at the rollover, including hidden review context", () => {
    let state = createInitialGameState();
    state.facilityTick = 599;
    state.events.push({ id: "review", type: "left_before_seen", facilityTick: 500, encounterId: null, message: "New 1-star review from Morgan: I was seen by three magazines and zero clinicians.", walkoutReview: { rating: 1, cause: "excessive_waiting" } });
    state.emergencyGlp1.totalUses = 2;
    state.retiredServiceHistory = { version: "retired-service-history.v1", retiredReceiptCount: 50, grossCents: 10000, stockCostCents: 1000, netCashDeltaCents: 9000, endoscopyReceipt: false, ambulatoryOperationReceipt: false, retiredOperationCount: 0, endoscopyOperationCompleted: false, ambulatoryOperationCompleted: false };
    state = gameReducer(state, { type: "ADVANCE_TICK", operationId: "rollover" });
    const event = state.events.find((candidate) => candidate.type === "day_rollover")!;
    expect(event.clinicDaySummary).toMatchObject({ dayNumber: 1, patientsSeen: 0, moneyEarnedCents: 19000, reviewLine: "I was seen by three magazines and zero clinicians." });
    const restored = deserializeGameState(serializeGameState(state));
    expect(restored.events.find((candidate) => candidate.id === event.id)?.clinicDaySummary).toEqual(event.clinicDaySummary);
    restored.facilityTick = 1200; restored.emergencyGlp1.totalUses = 3;
    expect(captureClinicDaySummary(restored)).toMatchObject({ dayNumber: 2, moneyEarnedCents: 5000 });
  });
  it("marks a legacy partial day rather than attributing lifetime income to it", () => {
    const state = createInitialGameState(); state.facilityTick = 1800; state.emergencyGlp1.totalUses = 100;
    expect(captureClinicDaySummary(state)).toMatchObject({ dayNumber: 3, partial: true, moneyEarnedCents: 0 });
  });
  it("retains the last daily baseline after raw history is evicted and the campaign is restored", () => {
    let state = createInitialGameState(); state.facilityTick = 599; state.emergencyGlp1.totalUses = 2;
    state = gameReducer(state, { type: "ADVANCE_TICK", operationId: "baseline.rollover" });
    state.events = [];
    state = deserializeGameState(serializeGameState(state));
    state.facilityTick = 1200; state.emergencyGlp1.totalUses = 3;
    expect(captureClinicDaySummary(state)).toMatchObject({ dayNumber: 2, moneyEarnedCents: 5000 });
    expect(captureClinicDaySummary(state).partial).toBeUndefined();
  });
});
