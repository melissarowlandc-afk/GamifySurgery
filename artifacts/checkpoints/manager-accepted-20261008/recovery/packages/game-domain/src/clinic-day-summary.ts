import { PROTOTYPE_DOMAIN_CONTEXT } from "./context";
import { operatingDayMinutes } from "./alert-cadence";
import { getServiceIncomeTotalsCents } from "./retired-service-history";
import { getDisplayedClinicSatisfaction } from "./selectors";
import type { DomainContext, DomainEvent, GameState } from "./types";

/** Freeze a brief digest before any work in the new day begins. */
export function captureClinicDaySummary(
  state: GameState,
  context: DomainContext = PROTOTYPE_DOMAIN_CONTEXT,
): NonNullable<DomainEvent["clinicDaySummary"]> {
  const length = operatingDayMinutes(context);
  const dayNumber = Math.floor(state.facilityTick / length);
  const start = state.facilityTick - length;
  const prior = (state.clinicDaySummaryBaseline?.facilityTick === start ? state.clinicDaySummaryBaseline : undefined) ?? state.events.find((event) =>
    event.type === "day_rollover" && event.facilityTick === start,
  )?.clinicDaySummary;
  const completedTotal = state.settlements.length;
  const earnedTotalCents = getServiceIncomeTotalsCents(state).netCashDeltaCents +
    state.settlements.reduce((sum, settlement) => sum + Math.round(settlement.netCashDelta * 100), 0) +
    state.emergencyGlp1.totalUses * Math.round(context.balanceRelease.emergencyGlp1.payment * 100);
  // A legacy day lacks a starting snapshot. Show retained records honestly,
  // then use complete cumulative deltas for every subsequent operating day.
  const partial = dayNumber > 1 && !prior;
  const duringDay = (tick: number) => tick >= start && tick < state.facilityTick;
  const reviews = state.events.filter((event) => event.type === "left_before_seen" && duringDay(event.facilityTick));
  const review = reviews.find((event) => event.message.includes("three magazines")) ??
    reviews.find((event) => event.walkoutReview?.rating === 1) ?? reviews[0];
  return {
    dayNumber,
    patientsSeen: partial
      ? state.settlements.filter((settlement) => duringDay(settlement.settledAtFacilityTick)).length
      : completedTotal - (prior?.completedTotal ?? 0),
    moneyEarnedCents: partial
      ? state.serviceIncomeReceipts.filter((receipt) => duringDay(receipt.completedAtFacilityTick))
          .reduce((sum, receipt) => sum + Math.round(receipt.netCashDelta * 100), 0) +
        state.settlements.filter((settlement) => duringDay(settlement.settledAtFacilityTick))
          .reduce((sum, settlement) => sum + Math.round(settlement.netCashDelta * 100), 0) +
        state.events.filter((event) => event.type === "emergency_glp1_consultation" && duringDay(event.facilityTick)).length *
          Math.round(context.balanceRelease.emergencyGlp1.payment * 100)
      : earnedTotalCents - (prior?.earnedTotalCents ?? 0),
    satisfactionPercent: getDisplayedClinicSatisfaction(state, context),
    ...(review ? { reviewLine: review.message.replace(/^New [12]-star review from [^:]+:\s*/, "") } : {}),
    ...(partial ? { partial: true } : {}),
    completedTotal,
    earnedTotalCents,
  };
}
