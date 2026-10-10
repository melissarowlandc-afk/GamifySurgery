import {
  getServiceIncomeLine,
  RADIOLOGIST_IN_HOUSE_INCOME_LINE_ID,
  RADIOLOGIST_OUTSIDE_INCOME_LINE_ID,
} from "@gamify-surgery/balance-config";
import type { EncounterSettlement, GameState, ServiceIncomeReceipt } from "./types";

/** Six operating hours, shorter than the existing one-day receipt retention. */
export const ROLLING_INCOME_WINDOW_MINUTES = 6 * 60;

export type RollingIncomeSourceId =
  | "patient_encounters" | "patient_services" | "scheduled_services"
  | "telehealth_automation" | "manual_telehealth" | "reads"
  | "retail" | "remote_work" | "other";

export interface RollingIncomeSource {
  id: RollingIncomeSourceId;
  grossCents: number;
  stockCostCents: number;
  receiptCount: number;
}

export interface RollingIncomeSummary {
  windowStartFacilityTick: number;
  windowEndFacilityTick: number;
  observedMinutes: number;
  averagingHours: number;
  earlyEstimate: boolean;
  grossCents: number;
  stockCostCents: number;
  netCashDeltaCents: number;
  incomePerHour: number;
  stockCostPerHour: number;
  sources: RollingIncomeSource[];
}

const SOURCE_IDS: readonly RollingIncomeSourceId[] = [
  "patient_encounters", "patient_services", "scheduled_services",
  "telehealth_automation", "manual_telehealth", "reads", "retail", "remote_work", "other",
];
const cents = (amount: number) => Math.round(amount * 100);

function receiptSource(receipt: ServiceIncomeReceipt): RollingIncomeSourceId {
  if ([RADIOLOGIST_IN_HOUSE_INCOME_LINE_ID, RADIOLOGIST_OUTSIDE_INCOME_LINE_ID, "income.image_read"].includes(receipt.incomeLineId)) return "reads";
  if (receipt.incomeLineId === "income.glp1_telehealth") return receipt.actorKind === "founder" ? "manual_telehealth" : "telehealth_automation";
  const line = getServiceIncomeLine(receipt.incomeLineId);
  if (line?.kind === "retail") return "retail";
  if (receipt.actorKind === "visitor") return "scheduled_services";
  if (line?.kind === "remote") return "remote_work";
  if (line?.kind === "clinical") return "patient_services";
  return "other";
}

function uniqueSettlements(settlements: readonly EncounterSettlement[]): EncounterSettlement[] {
  const seen = new Set<string>();
  return settlements.filter((settlement) => {
    if (seen.has(settlement.id)) return false;
    seen.add(settlement.id);
    return true;
  });
}

/** Actual patient cash payments, including legacy settlement adjustments. */
export function getPatientEncounterIncomeCents(state: Pick<GameState, "settlements">): number {
  return uniqueSettlements(state.settlements).reduce((total, settlement) => total + cents(settlement.netCashDelta), 0);
}

/**
 * Only settled cash receipts count: no queued jobs, catalog prices or cash
 * balance changes. The interval is (now - 360, now], including tick zero
 * before a full window has elapsed. Game time is operating minutes, so
 * pauses, simulation speed, reloads and day rollovers do not change the rate.
 * During the first hour, spread actual receipts over one hour to avoid a
 * one-minute payment becoming a misleading sustained hourly rate.
 *
 * Encounter settlements are not retired. Service history retains every
 * receipt from the last ten-hour operating day, covering this entire window.
 */
export function getRollingIncomeSummary(
  state: Pick<GameState, "facilityTick" | "settlements" | "serviceIncomeReceipts">,
): RollingIncomeSummary {
  const now = state.facilityTick;
  const observedMinutes = Math.min(ROLLING_INCOME_WINDOW_MINUTES, now);
  const averagingHours = Math.max(60, observedMinutes) / 60;
  const inWindow = (tick: number) => Number.isFinite(tick) && tick >= 0 && tick > now - ROLLING_INCOME_WINDOW_MINUTES && tick <= now;
  const sources = SOURCE_IDS.map((id): RollingIncomeSource => ({ id, grossCents: 0, stockCostCents: 0, receiptCount: 0 }));
  const byId = new Map(sources.map((source) => [source.id, source]));
  let netCashDeltaCents = 0;
  for (const settlement of uniqueSettlements(state.settlements)) {
    if (!inWindow(settlement.settledAtFacilityTick)) continue;
    const amount = cents(settlement.netCashDelta);
    const source = byId.get("patient_encounters")!;
    source.grossCents += amount;
    source.receiptCount += 1;
    netCashDeltaCents += amount;
  }
  const seen = new Set<string>();
  for (const receipt of state.serviceIncomeReceipts) {
    if (seen.has(receipt.transactionKey)) continue;
    seen.add(receipt.transactionKey);
    if (!inWindow(receipt.completedAtFacilityTick)) continue;
    const source = byId.get(receiptSource(receipt))!;
    source.grossCents += cents(receipt.grossAmount);
    source.stockCostCents += cents(receipt.stockCost);
    source.receiptCount += 1;
    netCashDeltaCents += cents(receipt.netCashDelta);
  }
  const grossCents = sources.reduce((total, source) => total + source.grossCents, 0);
  const stockCostCents = sources.reduce((total, source) => total + source.stockCostCents, 0);
  return {
    windowStartFacilityTick: Math.max(0, now - ROLLING_INCOME_WINDOW_MINUTES),
    windowEndFacilityTick: now,
    observedMinutes,
    averagingHours,
    earlyEstimate: now < 60,
    grossCents, stockCostCents, netCashDeltaCents,
    incomePerHour: grossCents / 100 / averagingHours,
    stockCostPerHour: stockCostCents / 100 / averagingHours,
    sources,
  };
}
