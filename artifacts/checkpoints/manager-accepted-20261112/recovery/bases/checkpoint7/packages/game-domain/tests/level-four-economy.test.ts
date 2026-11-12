import { describe, expect, it } from "vitest";
import { writeFileSync } from "node:fs";
import { createEarlyLevelFourEconomyState, simulateEarlyLevelFourEconomy } from "../../../tools/economy-audit/level-four-simulation";
import { gameReducer, getEmergencyGlp1Status, type GameState } from "../src";

describe("Level 4 real simulation economy and arrivals", () => {
  it("covers each specialty's base rent and staff through ordinary appointments, with real shared overhead", () => {
    const result = simulateEarlyLevelFourEconomy();
    for (const row of result.rows) expect(row.netPerHour, row.name).toBeGreaterThan(0);
    expect(result.totals.netPerHour).toBeGreaterThan(0);
    expect(result.totals.operatingPerHour).toBeCloseTo(result.totals.closingOperatingQuote, 2);
    expect(result.closingLearning).toEqual(result.openingLearning);
    const { state, openingLearning, closingLearning, ...report } = result;
    expect(state.retiredServiceHistory?.retiredOperationCount).toBeGreaterThan(0);
    for (const witness of [state.levelFourCompletion!.pediatricVisitWithParent!, state.levelFourCompletion!.woundOstomyCareVisit!])
      expect(state.serviceOperations.some((operation) => operation.id === witness.serviceOperationId)).toBe(false);
    if (process.env.LEVEL_FOUR_ECONOMY_REPORT === "1") writeFileSync(
      new URL("../../../tools/economy-audit/level-four-results-20261009.json", import.meta.url),
      `${JSON.stringify(report, null, 2)}\n`, "utf8",
    );
  }, 120_000);

  it("adds all APP streams beside the same normal scored arrivals without rewarding learning", () => {
    let withAppointments = createEarlyLevelFourEconomyState("level-four-arrival-fairness-m8");
    withAppointments.nextRoutineArrivalTick = 1;
    let withoutAppointments = structuredClone(withAppointments);
    withoutAppointments.serviceAppointmentsEnabled = false;
    const admitted = (state: GameState) => Object.keys(state.encounters);
    const arrivalsWith = new Set<string>();
    const arrivalsWithout = new Set<string>();
    for (let i = 0; i < 600; i++) {
      withAppointments = gameReducer(withAppointments, { type: "ADVANCE_TICK", operationId: `fairness.with.${i}` });
      withoutAppointments = gameReducer(withoutAppointments, { type: "ADVANCE_TICK", operationId: `fairness.without.${i}` });
      for (const id of admitted(withAppointments)) arrivalsWith.add(id);
      for (const id of admitted(withoutAppointments)) arrivalsWithout.add(id);
    }
    expect(arrivalsWith.size).toBeGreaterThan(1);
    expect([...arrivalsWith]).toEqual([...arrivalsWithout]);
    expect(withAppointments.learningHistories).toEqual(withoutAppointments.learningHistories);
    expect(withAppointments.clinicalXp).toBe(withoutAppointments.clinicalXp);
    expect(withAppointments.serviceIncomeReceipts.some((receipt) => receipt.incomeLineId === "income.pediatric_consult")).toBe(true);
    expect(withAppointments.serviceIncomeReceipts.some((receipt) => receipt.incomeLineId === "income.app_consult")).toBe(true);
    expect(withAppointments.serviceIncomeReceipts.some((receipt) => receipt.incomeLineId === "income.wound_care")).toBe(true);
    expect(getEmergencyGlp1Status(withAppointments).payment).toBe(50);
  }, 120_000);
});
