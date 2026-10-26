import { PROTOTYPE_DOMAIN_CONTEXT, type GameState } from "@gamify-surgery/game-domain";

export interface RevenueDay { day: number; grossCents: number }
export interface RevenueHistory {
  boundaryDay: number;
  boundaryGrossCents: number;
  days: RevenueDay[];
}
export const competitionDayMinutes = () => {
  const clock = PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.clock;
  return (clock.dayEndHour - clock.dayStartHour) * 60;
};
const cents = (amount: number) => Math.round(amount * 100);

/**
 * Revenue is gross patient completion/quality income plus all actual gross
 * service and retail receipts (including manual telehealth). Never use cash
 * balance changes, payroll, stock costs, penalties, debug cash or net profit.
 * Patient settlements remain in saves; retired service gross remains cumulative.
 */
export function readRevenueHistory(state: GameState, previous?: RevenueHistory,
  dayMinutes = competitionDayMinutes()): RevenueHistory {
  const completedDay = Math.floor(state.facilityTick / dayMinutes);
  const currentStart = completedDay * dayMinutes;
  const settlements = [...new Map(state.settlements.map(s => [s.id, s])).values()];
  const receipts = [...new Map(state.serviceIncomeReceipts.map(r => [r.transactionKey, r])).values()];
  const patientGross = (s: GameState["settlements"][number]) => cents(s.completionRevenue) + cents(s.qualityRevenueBonus);
  const sumBetween = (start: number, end: number) =>
    settlements.filter(s => s.settledAtFacilityTick >= start && s.settledAtFacilityTick < end)
      .reduce((sum, s) => sum + patientGross(s), 0) +
    receipts.filter(r => r.completedAtFacilityTick >= start && r.completedAtFacilityTick < end)
      .reduce((sum, r) => sum + cents(r.grossAmount), 0);
  const totalGross = (state.retiredServiceHistory?.grossCents ?? 0) +
    settlements.reduce((sum, s) => sum + patientGross(s), 0) + receipts.reduce((sum, r) => sum + cents(r.grossAmount), 0);
  const boundaryGrossCents = totalGross - sumBetween(currentStart, Infinity);
  let days: RevenueDay[] = [];
  if (!state.retiredServiceHistory?.retiredReceiptCount) {
    // Every raw service receipt is still available, including legacy saves.
    for (let day = Math.max(1, completedDay - 2); day <= completedDay; day++) {
      days.push({ day, grossCents: sumBetween((day - 1) * dayMinutes, day * dayMinutes) });
    }
  } else if (completedDay === 1) {
    days = [{ day: 1, grossCents: boundaryGrossCents }];
  } else if (previous && previous.boundaryDay === completedDay && previous.boundaryGrossCents === boundaryGrossCents) {
    days = previous.days;
  } else if (previous && previous.boundaryDay === completedDay - 1 && boundaryGrossCents >= previous.boundaryGrossCents) {
    days = [...previous.days, { day: completedDay, grossCents: boundaryGrossCents - previous.boundaryGrossCents }].slice(-3);
  }
  // A backwards/older save or a multi-day gap establishes a fresh baseline.
  // Missing retired daily data is never guessed or treated as zero revenue.
  return { boundaryDay: completedDay, boundaryGrossCents, days };
}

export function averageDailyRevenue(history: RevenueHistory): { averageDailyRevenueCents: number; daysCounted: number } | null {
  const days = history.days.slice(-3);
  if (!days.length || days.at(-1)!.day !== history.boundaryDay ||
    days.some((day, i) => !Number.isSafeInteger(day.grossCents) || day.grossCents < 0 ||
      day.day !== history.boundaryDay - days.length + i + 1)) return null;
  return { averageDailyRevenueCents: Math.round(days.reduce((sum, day) => sum + day.grossCents, 0) / days.length), daysCounted: days.length };
}
