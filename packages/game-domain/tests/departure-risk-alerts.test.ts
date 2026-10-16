import { describe, expect, it } from "vitest";
import {
  PROTOTYPE_DOMAIN_CONTEXT,
  TUTORIAL_ENCOUNTER_ID,
  createInitialGameState,
  deserializeGameState,
  employeeDepartureRiskCadenceGroup,
  gameReducer,
  operatingDayMinutes,
  serializeGameState,
  type GameState,
} from "../src";

function tick(state: GameState, operationId: string): GameState {
  return gameReducer(state, { type: "ADVANCE_TICK", operationId });
}

function cloneState(state: GameState): GameState {
  return JSON.parse(JSON.stringify(state)) as GameState;
}

function riskEligiblePatient(state: GameState) {
  const encounter = state.encounters[TUTORIAL_ENCOUNTER_ID]!;
  encounter.waiting.patienceExempt = false;
  encounter.checkInStatus = "checked_in";
  encounter.lifecycle = "active_action_required";
  encounter.steps[encounter.currentNodeIndex]!.status = "action_required";
  encounter.patientMovement = null;
  encounter.patientLocation = { x: 34, y: 29 };
  encounter.idleWaitingSinceTick = state.facilityTick;
  encounter.lastSatisfactionDecayAtTick = state.facilityTick;
  return encounter;
}

function employeeRiskState(): GameState {
  let state = createInitialGameState();
  state.facilityLevel = 1;
  state.cashCents = 500_000;
  state.cash = 5_000;
  state = gameReducer(state, {
    type: "HIRE_STAFF",
    operationId: "risk.hire",
    employeeId: "employee.risk",
    staffRoleDefinitionId: "staff.receptionist",
  });
  state.cashCents = 0;
  state.cash = 0;
  state.employees[0]!.morale =
    PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.insolvency
      .employeeQuittingThreshold +
    PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.insolvency
      .moraleDecayPerPosting;
  state.nextFinancialPostingTick = state.facilityTick + 60;
  return state;
}

describe("departure-risk alerts", () => {
  it("warns once when an idle checked-in patient enters their own ten-point risk window", () => {
    let state = createInitialGameState();
    const encounter = riskEligiblePatient(state);
    encounter.patientSatisfaction = encounter.walkoutThreshold + 11;

    state = tick(state, "patient.outside-window");
    expect(state.events.some((event) =>
      event.definitionId === "alert.patient.departure-risk",
    )).toBe(false);

    state.encounters[TUTORIAL_ENCOUNTER_ID]!.patientSatisfaction -= 1;
    state = tick(state, "patient.enter-window");
    expect(state.events.filter((event) =>
      event.definitionId === "alert.patient.departure-risk",
    )).toHaveLength(1);
    expect(state.encounters[TUTORIAL_ENCOUNTER_ID]!.departureRiskWarningAtTick)
      .toBe(state.facilityTick);

    state.events = [];
    state = deserializeGameState(serializeGameState(state));
    state = tick(state, "patient.after-trim-reload");
    expect(state.events.filter((event) =>
      event.definitionId === "alert.patient.departure-risk",
    )).toHaveLength(0);
  });

  it("warns an eligible patient already at their cutoff before the next decay", () => {
    let state = createInitialGameState();
    const encounter = riskEligiblePatient(state);
    encounter.patientSatisfaction = encounter.walkoutThreshold;

    state = tick(state, "patient.at-cutoff");

    expect(state.events).toContainEqual(expect.objectContaining({
      definitionId: "alert.patient.departure-risk",
      encounterId: encounter.id,
    }));
  });

  it("does not warn during check-in, chart reading, travel, or patience immunity", () => {
    const base = createInitialGameState();
    const encounter = riskEligiblePatient(base);
    encounter.patientSatisfaction = encounter.walkoutThreshold;
    const variants: GameState[] = [];

    const atFrontDesk = cloneState(base);
    atFrontDesk.encounters[encounter.id]!.checkInStatus = "awaiting_staff";
    variants.push(atFrontDesk);
    const chartOpen = cloneState(base);
    chartOpen.openChartEncounterId = encounter.id;
    variants.push(chartOpen);
    const traveling = cloneState(base);
    traveling.encounters[encounter.id]!.patientMovement = {
      kind: "departing_for_offsite_testing",
      path: [{ x: 34, y: 29 }, { x: 34, y: 30 }],
      pathIndex: 0,
      lastMovedAtFacilityTick: 0,
      destinationRoomInstanceId: null,
    };
    traveling.encounters[encounter.id]!.idleWaitingSinceTick = null;
    variants.push(traveling);
    const exempt = cloneState(base);
    exempt.encounters[encounter.id]!.waiting.patienceExempt = true;
    variants.push(exempt);

    for (const [index, state] of variants.entries()) {
      const next = tick(state, `patient.ineligible.${index}`);
      expect(next.events.some((event) =>
        event.definitionId === "alert.patient.departure-risk",
      )).toBe(false);
    }
  });

  it("warns each endangered employee before an underfunded upcoming posting and throttles each employee for a rolling day", () => {
    let state = employeeRiskState();
    state.employees.push({
      ...state.employees[0]!,
      id: "employee.risk.two",
      displayName: "Second Risk",
    });

    state = tick(state, "staff.first-warning");
    expect(state.events.filter((event) =>
      event.type === "staff_departure_risk",
    )).toHaveLength(2);

    state = tick(state, "staff.same-day");
    expect(state.events.filter((event) =>
      event.type === "staff_departure_risk",
    )).toHaveLength(2);

    const firstEmployee = state.employees[0]!;
    state.facilityTick = operatingDayMinutes(PROTOTYPE_DOMAIN_CONTEXT) - 1;
    state.nextFinancialPostingTick = state.facilityTick + 60;
    state.alertHumor.conditionLastEmittedTicks[
      employeeDepartureRiskCadenceGroup(firstEmployee.id)
    ] = 0;
    state = tick(state, "staff.next-day");
    expect(state.events.filter((event) =>
      event.type === "staff_departure_risk" &&
      event.target?.id === firstEmployee.id,
    )).toHaveLength(2);
  });

  it("does not warn at-risk morale when the upcoming posting is funded", () => {
    let state = employeeRiskState();
    state.cashCents = 500_000;
    state.cash = 5_000;
    state = tick(state, "staff.funded");
    expect(state.events.some((event) =>
      event.type === "staff_departure_risk",
    )).toBe(false);
  });

  it("recovers missing durable warning markers from retained event history", () => {
    let state = employeeRiskState();
    state = tick(state, "staff.seed-history");
    const employee = state.employees[0]!;
    const group = employeeDepartureRiskCadenceGroup(employee.id);
    delete state.alertHumor.conditionLastEmittedTicks[group];

    const restored = deserializeGameState(serializeGameState(state));
    expect(restored.alertHumor.conditionLastEmittedTicks[group]).toBe(
      state.facilityTick,
    );
    expect(
      tick(restored, "staff.seeded-no-duplicate").events.filter(
        (event) => event.type === "staff_departure_risk",
      ),
    ).toHaveLength(1);
  });
});
