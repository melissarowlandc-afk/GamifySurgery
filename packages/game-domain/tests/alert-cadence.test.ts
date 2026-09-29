import { describe, expect, it } from "vitest";
import {
  alertCadencePolicy,
  clearConditionAlertAge,
  conditionAlertIsDue,
  operatingDayMinutes,
  recordConditionAlertEmission,
} from "../src/alert-cadence";
import {
  PROTOTYPE_DOMAIN_CONTEXT,
  createInitialGameState,
} from "../src";

describe("facility alert cadence", () => {
  it("derives rolling daily and two-day limits from the configured operating day", () => {
    expect(operatingDayMinutes(PROTOTYPE_DOMAIN_CONTEXT)).toBe(600);
    expect(
      alertCadencePolicy(
        "room_upgrade_requested",
        PROTOTYPE_DOMAIN_CONTEXT,
      ),
    ).toMatchObject({ cooldownMinutes: 1_200, complaint: true });
  });

  it("requires more than 60 continuous minutes for litter and preserves the daily cooldown across targets", () => {
    const state = createInitialGameState();
    const policy = alertCadencePolicy(
      "visible_litter",
      PROTOTYPE_DOMAIN_CONTEXT,
    )!;
    expect(conditionAlertIsDue(state, "visible_litter", policy)).toBe(false);
    state.facilityTick = 60;
    expect(conditionAlertIsDue(state, "visible_litter", policy)).toBe(false);
    state.facilityTick = 61;
    expect(conditionAlertIsDue(state, "visible_litter", policy)).toBe(true);
    recordConditionAlertEmission(state, policy);

    clearConditionAlertAge(state, "visible_litter");
    state.facilityTick = 100;
    expect(conditionAlertIsDue(state, "visible_litter", policy)).toBe(false);
    state.facilityTick = 161;
    expect(conditionAlertIsDue(state, "visible_litter", policy)).toBe(false);
    state.facilityTick = 660;
    expect(conditionAlertIsDue(state, "visible_litter", policy)).toBe(false);
    state.facilityTick = 661;
    expect(conditionAlertIsDue(state, "visible_litter", policy)).toBe(true);
  });

  it("stagger complaints globally while keeping low staff morale outside complaint throttling", () => {
    const state = createInitialGameState();
    const waitingPolicy = alertCadencePolicy(
      "missing_waiting_room",
      PROTOTYPE_DOMAIN_CONTEXT,
    )!;
    const receptionistPolicy = alertCadencePolicy(
      "no_receptionist",
      PROTOTYPE_DOMAIN_CONTEXT,
    )!;
    expect(
      alertCadencePolicy(
        "missing_examination_room",
        PROTOTYPE_DOMAIN_CONTEXT,
      ),
    ).toMatchObject({
      group: "complaint.missing_examination_room",
      cooldownMinutes: 600,
      complaint: true,
    });
    expect(conditionAlertIsDue(state, "missing_waiting_room", waitingPolicy)).toBe(true);
    recordConditionAlertEmission(state, waitingPolicy);

    state.facilityTick = 59;
    expect(conditionAlertIsDue(state, "no_receptionist", receptionistPolicy)).toBe(false);
    state.facilityTick = 60;
    expect(conditionAlertIsDue(state, "no_receptionist", receptionistPolicy)).toBe(true);
    expect(
      alertCadencePolicy("low_staff_morale", PROTOTYPE_DOMAIN_CONTEXT),
    ).toBeNull();
  });

  it("does not let a zero-delay condition bypass its cooldown after disappearing", () => {
    const state = createInitialGameState();
    const policy = alertCadencePolicy(
      "advertising_recommended",
      PROTOTYPE_DOMAIN_CONTEXT,
    )!;
    expect(
      conditionAlertIsDue(state, "advertising_recommended", policy),
    ).toBe(true);
    recordConditionAlertEmission(state, policy);
    clearConditionAlertAge(state, "advertising_recommended");

    state.facilityTick = 61;
    expect(
      conditionAlertIsDue(state, "advertising_recommended", policy),
    ).toBe(false);
    state.facilityTick = 600;
    expect(
      conditionAlertIsDue(state, "advertising_recommended", policy),
    ).toBe(true);
  });
});
