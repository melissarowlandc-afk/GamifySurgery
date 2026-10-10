import { describe, expect, it } from "vitest";
import {
  createInitialGameState, deserializeGameState, getPatientEncounterIncomeCents,
  getRollingIncomeSummary, retireFinishedServiceHistory, serializeGameState,
  type EncounterSettlement, type ServiceIncomeReceipt,
} from "../src";

function receipt(id: string, overrides: Partial<ServiceIncomeReceipt> = {}): ServiceIncomeReceipt {
  return {
    id, transactionKey: id, incomeLineId: "income.ultrasound", catalogVersion: 1,
    routeId: null, actorKind: "patient", actorId: "patient.finance",
    grossAmount: 120, stockCost: 15, netCashDelta: 105, completedAtFacilityTick: 600,
    ...overrides,
  };
}

function settlement(id: string, tick: number, netCashDelta: number): EncounterSettlement {
  return {
    id, encounterId: id, completionRevenue: netCashDelta, qualityRevenueBonus: 0,
    incorrectFinancialConsequence: 0, netCashDelta, satisfactionDelta: 0,
    clinicalXpAwarded: 0, correctAnswers: 1, incorrectAnswers: 0,
    terminalOutcomeSeverity: null, settledAtFacilityTick: tick,
  };
}

describe("rolling settled income", () => {
  it("counts actual patient, scheduled, automated, read and retail payments before stock", () => {
    const state = createInitialGameState();
    state.facilityTick = 600;
    state.settlements = [settlement("patient", 300, 300)];
    state.serviceIncomeReceipts = [
      receipt("patient.service"),
      receipt("scheduled", { actorKind: "visitor", grossAmount: 600, stockCost: 0, netCashDelta: 600 }),
      receipt("automation", { incomeLineId: "income.glp1_telehealth", actorKind: "employee", grossAmount: 125, stockCost: 0, netCashDelta: 125 }),
      receipt("manual", { incomeLineId: "income.glp1_telehealth", actorKind: "founder", grossAmount: 50, stockCost: 0, netCashDelta: 50 }),
      receipt("read", { incomeLineId: "income.radiologist_outside_read", actorKind: "remote", grossAmount: 5, stockCost: 0, netCashDelta: 5 }),
      receipt("retail", { incomeLineId: "income.coffee", actorKind: "companion", grossAmount: 5, stockCost: 1, netCashDelta: 4 }),
      receipt("remote", { incomeLineId: "income.image_read", actorKind: "remote", grossAmount: 40, stockCost: 0, netCashDelta: 40 }),
      receipt("unknown", { incomeLineId: "income.legacy", grossAmount: 15, stockCost: 0, netCashDelta: 15 }),
    ];
    const summary = getRollingIncomeSummary(state);
    expect(summary).toMatchObject({ averagingHours: 6, grossCents: 126_000, stockCostCents: 1_600, netCashDeltaCents: 124_400 });
    expect(summary.incomePerHour).toBe(210);
    expect(summary.stockCostPerHour).toBeCloseTo(16 / 6);
    expect(summary.sources.find((source) => source.id === "patient_encounters")?.grossCents).toBe(30_000);
    expect(summary.sources.find((source) => source.id === "scheduled_services")?.grossCents).toBe(60_000);
    expect(summary.sources.find((source) => source.id === "telehealth_automation")?.grossCents).toBe(12_500);
    expect(summary.sources.find((source) => source.id === "manual_telehealth")?.grossCents).toBe(5_000);
    expect(summary.sources.find((source) => source.id === "reads")?.grossCents).toBe(4_500);
    expect(summary.sources.find((source) => source.id === "retail")?.stockCostCents).toBe(100);
    expect(summary.sources.find((source) => source.id === "other")?.grossCents).toBe(1_500);
  });

  it("uses an open start and closed end, including fractional completion ticks", () => {
    const state = createInitialGameState();
    state.facilityTick = 600;
    state.serviceIncomeReceipts = [239, 240, 240.5, 600, 600.5].map((tick) => receipt(`receipt.${tick}`, { completedAtFacilityTick: tick }));
    state.settlements = [settlement("old", 240, 50), settlement("recent", 241, 30), settlement("future", 601, 50)];
    expect(getRollingIncomeSummary(state)).toMatchObject({
      windowStartFacilityTick: 240, windowEndFacilityTick: 600,
      grossCents: 27_000, stockCostCents: 3_000, netCashDeltaCents: 24_000,
      incomePerHour: 45, stockCostPerHour: 5,
    });
  });

  it("has no invented opening income and smooths the first hour explicitly", () => {
    const state = createInitialGameState();
    expect(getRollingIncomeSummary(state)).toMatchObject({ observedMinutes: 0, averagingHours: 1, earlyEstimate: true, incomePerHour: 0 });
    state.facilityTick = 12;
    state.settlements = [settlement("first", 12, 50)];
    expect(getRollingIncomeSummary(state)).toMatchObject({ observedMinutes: 12, averagingHours: 1, earlyEstimate: true, incomePerHour: 50 });
    state.facilityTick = 120;
    expect(getRollingIncomeSummary(state)).toMatchObject({ averagingHours: 2, earlyEstimate: false, incomePerHour: 25 });
    state.facilityTick = 372;
    expect(getRollingIncomeSummary(state).incomePerHour).toBe(0);
  });

  it("includes a tick-zero payment before its window expires", () => {
    const state = createInitialGameState();
    state.settlements = [settlement("opening", 0, 25)];
    expect(getRollingIncomeSummary(state).incomePerHour).toBe(25);
    state.facilityTick = 360;
    expect(getRollingIncomeSummary(state).incomePerHour).toBe(0);
  });

  it("does not double count a settlement or receipt transaction", () => {
    const state = createInitialGameState();
    state.facilityTick = 600;
    const payment = receipt("once");
    const visit = settlement("once.patient", 590, 60);
    state.settlements = [visit, { ...visit }];
    state.serviceIncomeReceipts = [payment, { ...payment, id: "duplicate" }];
    expect(getRollingIncomeSummary(state)).toMatchObject({ grossCents: 18_000, stockCostCents: 1_500, netCashDeltaCents: 16_500, incomePerHour: 30 });
    expect(getPatientEncounterIncomeCents(state)).toBe(6_000);
  });

  it("uses frozen receipts rather than current catalog prices, cash or retired totals", () => {
    const state = createInitialGameState();
    state.facilityTick = 600;
    state.cash = 1_000_000;
    state.serviceIncomeReceipts = [receipt("frozen", { grossAmount: 99.99, stockCost: 0.99, netCashDelta: 99 })];
    state.retiredServiceHistory = { version: "retired-service-history.v1", retiredReceiptCount: 999, grossCents: 999_999, stockCostCents: 999, netCashDeltaCents: 999_000, endoscopyReceipt: false, ambulatoryOperationReceipt: false, retiredOperationCount: 0, endoscopyOperationCompleted: false, ambulatoryOperationCompleted: false };
    expect(getRollingIncomeSummary(state)).toMatchObject({ grossCents: 9_999, stockCostCents: 99, netCashDeltaCents: 9_900 });
    expect(getRollingIncomeSummary(state).incomePerHour).toBeCloseTo(99.99 / 6);
  });

  it("keeps the complete window after high-volume history retirement and save/reload", () => {
    const state = createInitialGameState();
    state.facilityTick = 1260;
    state.serviceIncomeReceipts = Array.from({ length: 180 }, (_, index) => receipt(`volume.${index}`, { completedAtFacilityTick: 1081 + index }));
    const before = getRollingIncomeSummary(state);
    retireFinishedServiceHistory(state);
    expect(state.serviceIncomeReceipts).toHaveLength(180);
    expect(getRollingIncomeSummary(state)).toEqual(before);
    const restored = deserializeGameState(serializeGameState(state));
    expect(getRollingIncomeSummary(restored)).toEqual(before);
  });

  it("is read-only and independent of pause and speed", () => {
    const state = createInitialGameState();
    state.facilityTick = 610;
    state.settlements = [settlement("actual", 605, -10)];
    const before = JSON.stringify(state);
    const summary = getRollingIncomeSummary(state);
    expect(JSON.stringify(state)).toBe(before);
    state.paused = !state.paused;
    state.simulationSpeed = 4;
    expect(getRollingIncomeSummary(state)).toEqual(summary);
    expect(summary.grossCents).toBe(-1_000);
  });
});
