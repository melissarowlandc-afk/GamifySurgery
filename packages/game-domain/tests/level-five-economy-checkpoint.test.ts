import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { deserializeGameState, gameReducer, getServiceIncomeTotalsCents, serializeGameState, type InspectionReportState } from "../src";
import { createLevelFiveStateQaContext } from "../../../tests/fixtures/level-five-state";
import { createLevelFiveEconomyQaState } from "../../../tests/fixtures/level-five-economy-qa";

describe("M8 reducer-earned inspection checkpoint", () => {
  it("reloads the actual long-run clocks, ledger and earned progress without reseeding", () => {
    const context = createLevelFiveStateQaContext(), state = createLevelFiveEconomyQaState("economy-inspection", context);
    expect(state.paused).toBe(true);
    expect(state.clinicalXp).toBeGreaterThanOrEqual(2000);
    expect(state.levelFive!.inspection.run!.accumulators.observedActiveMinutes).toBe(2999);
    expect(state.levelFive!.progress.gameFinished).toBeNull();
    expect(state.retiredServiceHistory!.retiredReceiptCount).toBeGreaterThan(0);
    expect(state.retiredEncounterSummary!.retiredCount).toBeGreaterThan(0);
    const loaded = deserializeGameState(serializeGameState(state), context);
    for (const field of ["levelFive", "giftRetailDemand", "cashCents", "clinicalXp", "totalOperatingExpenses", "operatingAccrualSixtiethCents", "learningHistories", "serviceIncomeReceipts", "retiredServiceHistory"] as const)
      expect(loaded[field], field).toEqual(state[field]);
  });

  it("replays the last minute to the exact audited report and pays no finish reward", () => {
    const context = createLevelFiveStateQaContext();
    let state = createLevelFiveEconomyQaState("economy-inspection", context);
    state = gameReducer(state, { type: "SET_PAUSED", paused: false, operationId: "m8.checkpoint.play" }, context);
    const before = state, income = getServiceIncomeTotalsCents(before);
    state = gameReducer(state, { type: "ADVANCE_TICK", operationId: "m8.checkpoint.last-minute", advancedAtRealMs: before.createdAtRealMs + (before.facilityTick + 1) * context.balanceRelease.clock.realMillisecondsPerFacilityMinuteAt1x }, context);
    const artifact = JSON.parse(readFileSync(new URL("../../../tools/economy-audit/level-five-results-20261012.json", import.meta.url), "utf8")) as {
      pacing: Array<{ seed: string; requestedAccuracyPercent: number; firstInspection: InspectionReportState }>;
    };
    const expected = artifact.pacing.find(run => run.seed === "level-five-m8.01" && run.requestedAccuracyPercent === 80)!.firstInspection;
    expect(state.levelFive!.inspection.lastReport).toEqual(expected);
    expect(state.levelFive!.progress.gameFinished!.firstCompletedReport).toEqual(expected);
    expect(state.levelFive!.inspectionPresentation.actors).toHaveLength(0);
    const settlementDelta = state.settlements.reduce((sum, r) => sum + Math.round(r.netCashDelta * 100), 0) - before.settlements.reduce((sum, r) => sum + Math.round(r.netCashDelta * 100), 0);
    const charged = Math.round((state.totalOperatingExpenses - before.totalOperatingExpenses) * 100);
    expect(state.cashCents - before.cashCents).toBe(getServiceIncomeTotalsCents(state).netCashDeltaCents - income.netCashDeltaCents + settlementDelta - charged);
    expect(state.clinicalXp).toBe(before.clinicalXp);
    expect(gameReducer(state, { type: "ADVANCE_TICK", operationId: "m8.checkpoint.last-minute" }, context)).toBe(state);
  });
});
