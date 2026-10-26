import { describe, expect, it } from "vitest";
import { averageDailyRevenue, readRevenueHistory } from "./revenue";
import { receipt, revenueState, settlement } from "./testFixtures";

describe("completed game-day gross revenue", () => {
  it("averages the last 3 completed game days and excludes the current day and old days", () => {
    const state = revenueState(4);
    state.serviceIncomeReceipts = [receipt(0, 900), receipt(600, 10), receipt(1200, 20), receipt(2399, 30), receipt(2400, 1000)];
    const history = readRevenueHistory(state);
    expect(history.days).toEqual([{ day: 2, grossCents: 1000 }, { day: 3, grossCents: 2000 }, { day: 4, grossCents: 3000 }]);
    expect(averageDailyRevenue(history)).toEqual({ averageDailyRevenueCents: 2000, daysCounted: 3 });
  });
  it("uses gross patient/service/retail income before stock costs or financial consequences", () => {
    const state = revenueState();
    const patient = { ...settlement(100, 100), qualityRevenueBonus: 12, incorrectFinancialConsequence: 9, netCashDelta: 103 };
    state.settlements = [patient, patient];
    const retail = receipt(50, 20, "retail", 6);
    state.serviceIncomeReceipts = [retail, retail, { ...receipt(75, 5), incomeLineId: "income.glp1_telehealth", actorKind: "founder" }];
    state.emergencyGlp1.totalUses = 1; // Its actual receipt already counts; never double-count this counter.
    state.totalOperatingExpenses = 999_999;
    state.cash = 987_654;
    expect(averageDailyRevenue(readRevenueHistory(state))).toEqual({ averageDailyRevenueCents: 13700, daysCounted: 1 });
  });
  it("counts zero-revenue days and uses 1 or 2 days while a clinic is new", () => {
    expect(averageDailyRevenue(readRevenueHistory(revenueState(0)))).toBeNull();
    expect(averageDailyRevenue(readRevenueHistory(revenueState(1)))).toEqual({ averageDailyRevenueCents: 0, daysCounted: 1 });
    const state = revenueState(2); state.serviceIncomeReceipts = [receipt(5, 10.01)];
    expect(averageDailyRevenue(readRevenueHistory(state))).toEqual({ averageDailyRevenueCents: 501, daysCounted: 2 });
  });
  it("keeps exact daily cumulative deltas after service details retire, including a batched rollover", () => {
    const state = revenueState(3);
    state.facilityTick += 20;
    state.serviceIncomeReceipts = [receipt(1800, 99), receipt(1810, 20)];
    state.settlements = [settlement(5, 10), settlement(1250, 15), settlement(1801, 80)];
    state.retiredServiceHistory = { version: "retired-service-history.v1", retiredReceiptCount: 500,
      grossCents: 60000, stockCostCents: 20000, netCashDeltaCents: 40000, endoscopyReceipt: false,
      ambulatoryOperationReceipt: false, retiredOperationCount: 0, endoscopyOperationCompleted: false, ambulatoryOperationCompleted: false };
    const history = readRevenueHistory(state, { boundaryDay: 2, boundaryGrossCents: 40000,
      days: [{ day: 1, grossCents: 10000 }, { day: 2, grossCents: 30000 }] });
    expect(history.boundaryGrossCents).toBe(62500);
    expect(history.days).toEqual([{ day: 1, grossCents: 10000 }, { day: 2, grossCents: 30000 }, { day: 3, grossCents: 22500 }]);
    expect(averageDailyRevenue(history)).toEqual({ averageDailyRevenueCents: 20833, daysCounted: 3 });
    expect(readRevenueHistory(state, history)).toEqual(history);
  });
  it("establishes an honest baseline when a legacy history or multi-day gap is incomplete", () => {
    const state = revenueState(10);
    state.retiredServiceHistory = { version: "retired-service-history.v1", retiredReceiptCount: 50, grossCents: 10000,
      stockCostCents: 0, netCashDeltaCents: 10000, endoscopyReceipt: false, ambulatoryOperationReceipt: false,
      retiredOperationCount: 0, endoscopyOperationCompleted: false, ambulatoryOperationCompleted: false };
    const baseline = readRevenueHistory(state);
    expect(averageDailyRevenue(baseline)).toBeNull();
    state.facilityTick = 11 * 600; state.serviceIncomeReceipts = [receipt(6001, 42)];
    expect(averageDailyRevenue(readRevenueHistory(state, baseline))).toEqual({ averageDailyRevenueCents: 4200, daysCounted: 1 });
    state.facilityTick = 15 * 600;
    expect(averageDailyRevenue(readRevenueHistory(state, baseline))).toBeNull();
  });
  it("rejects invalid or noncontiguous daily amounts", () => {
    expect(averageDailyRevenue({ boundaryDay: 4, boundaryGrossCents: 0, days: [{ day: 2, grossCents: 0 }] })).toBeNull();
    expect(averageDailyRevenue({ boundaryDay: 1, boundaryGrossCents: 0, days: [{ day: 1, grossCents: -1 }] })).toBeNull();
  });
  it("takes operating day length from the game clock, without calendar-time assumptions", () => {
    const state = revenueState(0); state.facilityTick = 20;
    state.serviceIncomeReceipts = [receipt(0, 10), receipt(10, 30), receipt(20, 999)];
    expect(averageDailyRevenue(readRevenueHistory(state, undefined, 10))).toEqual({ averageDailyRevenueCents: 2000, daysCounted: 2 });
  });
});
