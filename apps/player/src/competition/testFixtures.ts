import { createInitialGameState, type EncounterSettlement, type ServiceIncomeReceipt } from "@gamify-surgery/game-domain";
import { vi } from "vitest";
import type { CompetitionStorage } from "./competitionClient";
import type { CompetitionBoard, CompetitionTransport } from "./types";

export function receipt(tick: number, gross: number, key = `receipt.${tick}`, stock = 0): ServiceIncomeReceipt {
  return { id: key, transactionKey: key, catalogVersion: 1, incomeLineId: "income.coffee", routeId: null,
    actorKind: "retail_visitor", actorId: "fixture", grossAmount: gross, stockCost: stock, netCashDelta: gross - stock,
    completedAtFacilityTick: tick };
}
export function settlement(tick: number, gross: number, key = `settlement.${tick}`): EncounterSettlement {
  return { id: key, encounterId: key, completionRevenue: gross, qualityRevenueBonus: 0, incorrectFinancialConsequence: 0,
    netCashDelta: gross, satisfactionDelta: 0, clinicalXpAwarded: 0, correctAnswers: 0, incorrectAnswers: 0,
    terminalOutcomeSeverity: null, settledAtFacilityTick: tick };
}
export function revenueState(completedDays = 1) {
  const state = createInitialGameState(); state.facilityTick = completedDays * 600;
  state.settlements = []; state.serviceIncomeReceipts = [];
  return state;
}
export function memoryStorage(): CompetitionStorage {
  const values = new Map<string, string>();
  return { getItem: key => values.get(key) ?? null, setItem: (key, value) => { values.set(key, value); }, removeItem: key => { values.delete(key); } };
}
export const emptyBoard: CompetitionBoard = { hidden: false, rows: [] };
export function fakeTransport(board: CompetitionBoard = emptyBoard) {
  return { submit: vi.fn<CompetitionTransport["submit"]>().mockResolvedValue(undefined),
    leaderboard: vi.fn<CompetitionTransport["leaderboard"]>().mockResolvedValue(board),
    setHidden: vi.fn<CompetitionTransport["setHidden"]>().mockResolvedValue(undefined) };
}
