import type {
  DomainContext,
  FacilityAlertConditionKey,
  GameState,
} from "./types";

export interface AlertCadencePolicy {
  group: string;
  minimumActiveMinutes: number;
  cooldownMinutes: number;
  complaint: boolean;
}

export function operatingDayMinutes(context: DomainContext): number {
  const clock = context.balanceRelease.clock;
  return (clock.dayEndHour - clock.dayStartHour) * 60;
}

export function alertCadencePolicy(
  conditionKey: FacilityAlertConditionKey,
  context: DomainContext,
): AlertCadencePolicy | null {
  const day = operatingDayMinutes(context);
  switch (conditionKey) {
    case "low_cash":
      return {
        group: "finance.low-cash",
        minimumActiveMinutes: 0,
        cooldownMinutes: day,
        complaint: false,
      };
    case "visible_litter":
    case "dirty_cleanliness":
      return {
        group: "environment.litter",
        minimumActiveMinutes: 60,
        cooldownMinutes: day,
        complaint: true,
      };
    case "empty_water_cooler":
      return {
        group: "environment.water",
        minimumActiveMinutes: 60,
        cooldownMinutes: day,
        complaint: false,
      };
    case "advertising_recommended":
      return {
        group: "guidance.no-arrivals",
        minimumActiveMinutes: 0,
        cooldownMinutes: day,
        complaint: false,
      };
    case "room_upgrade_requested":
      return {
        group: "complaint.room-upgrade",
        minimumActiveMinutes: 0,
        cooldownMinutes: day * 2,
        complaint: true,
      };
    case "missing_waiting_room":
    case "missing_examination_room":
    case "missing_bathroom":
    case "no_receptionist":
    case "unavailable_onsite_xray":
    case "waiting_room_crowded":
      return {
        group: `complaint.${conditionKey}`,
        minimumActiveMinutes: 0,
        cooldownMinutes: day,
        complaint: true,
      };
    default:
      return null;
  }
}

export function clearConditionAlertAge(
  state: GameState,
  conditionKey: FacilityAlertConditionKey,
): void {
  delete state.alertHumor.conditionActiveSinceTicks[conditionKey];
}

export function conditionAlertIsDue(
  state: GameState,
  conditionKey: FacilityAlertConditionKey,
  policy: AlertCadencePolicy,
): boolean {
  const activeSince =
    state.alertHumor.conditionActiveSinceTicks[conditionKey];
  if (activeSince === undefined) {
    state.alertHumor.conditionActiveSinceTicks[conditionKey] =
      state.facilityTick;
    if (policy.minimumActiveMinutes > 0) {
      return false;
    }
  } else if (
    state.facilityTick - activeSince <= policy.minimumActiveMinutes
  ) {
    return false;
  }
  const lastEmitted =
    state.alertHumor.conditionLastEmittedTicks[policy.group];
  if (
    lastEmitted !== undefined &&
    state.facilityTick - lastEmitted < policy.cooldownMinutes
  ) {
    return false;
  }
  return complaintSeparationSatisfied(state, policy);
}

function complaintSeparationSatisfied(
  state: GameState,
  policy: AlertCadencePolicy,
): boolean {
  return !policy.complaint ||
    state.alertHumor.lastComplaintAlertTick === null ||
    state.facilityTick - state.alertHumor.lastComplaintAlertTick >= 60;
}

export function recordConditionAlertEmission(
  state: GameState,
  policy: AlertCadencePolicy,
): void {
  state.alertHumor.conditionLastEmittedTicks[policy.group] =
    state.facilityTick;
  if (policy.complaint) {
    state.alertHumor.lastComplaintAlertTick = state.facilityTick;
  }
}
