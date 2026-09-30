import { PROTOTYPE_ALERT_SCHEDULING } from "@gamify-surgery/balance-config";
import { operatingDayMinutes } from "./alert-cadence";
import { getOperatingExpensePerFacilityHour } from "./selectors";
import type {
  DomainContext,
  EmployeeState,
  EncounterState,
  GameState,
} from "./types";

export function patientDepartureRiskIsActive(
  state: GameState,
  encounter: EncounterState,
): boolean {
  const eligibleLifecycle =
    encounter.lifecycle === "waiting_unopened" ||
    encounter.lifecycle === "active_action_required";
  const idleInClinic =
    encounter.patientMovement === null ||
    encounter.patientMovement.kind === "idle_within_room";
  return (
    eligibleLifecycle &&
    !encounter.waiting.patienceExempt &&
    encounter.checkInStatus === "checked_in" &&
    encounter.idleWaitingSinceTick !== null &&
    state.openChartEncounterId !== encounter.id &&
    idleInClinic &&
    encounter.patientSatisfaction <=
      encounter.walkoutThreshold +
        PROTOTYPE_ALERT_SCHEDULING.patientDepartureRiskMargin
  );
}

export function projectedNextOperatingPostingCents(
  state: GameState,
  context: DomainContext,
): number {
  const minutesUntilPosting = Math.max(
    1,
    state.nextFinancialPostingTick - state.facilityTick,
  );
  const hourlyExpense = Math.max(
    0,
    -getOperatingExpensePerFacilityHour(state, context),
  );
  return Math.floor(
    (state.operatingAccrualSixtiethCents +
      hourlyExpense * 100 * minutesUntilPosting) /
      60,
  );
}

export function upcomingOperatingPostingIsUnderfunded(
  state: GameState,
  context: DomainContext,
): boolean {
  const projectedPosting = projectedNextOperatingPostingCents(state, context);
  return projectedPosting > 0 && state.cashCents < projectedPosting;
}

export function employeeDepartureRiskIsActive(
  state: GameState,
  employee: EmployeeState,
  context: DomainContext,
): boolean {
  const insolvency = context.balanceRelease.insolvency;
  return (
    employee.morale <=
      insolvency.employeeQuittingThreshold +
        insolvency.moraleDecayPerPosting &&
    upcomingOperatingPostingIsUnderfunded(state, context)
  );
}

export function employeeDepartureRiskCadenceGroup(
  employeeId: string,
): string {
  return `staff.departure-risk:${employeeId}`;
}

export function employeeDepartureRiskWarningIsDue(
  state: GameState,
  employee: EmployeeState,
  context: DomainContext,
): boolean {
  if (!employeeDepartureRiskIsActive(state, employee, context)) {
    return false;
  }
  const lastEmitted =
    state.alertHumor.conditionLastEmittedTicks[
      employeeDepartureRiskCadenceGroup(employee.id)
    ];
  return (
    lastEmitted === undefined ||
    state.facilityTick - lastEmitted >= operatingDayMinutes(context)
  );
}
