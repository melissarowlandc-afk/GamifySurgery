import { describe, expect, it } from "vitest";
import { getAppAppointmentHomes } from "@gamify-surgery/game-domain";
import { createLevelFourIntegrationState } from "../../../../tests/fixtures/level-four-integration";
import { consultCommand, consultTick } from "../../../../packages/game-domain/tests/founder-consults.fixture";
import { createPrototypePlayerView } from "./viewModels";

describe("specialty consult presentation hooks", () => {
  it.each([["income.pediatric_consult", "Pediatric consult"], ["income.wound_care", "Wound/ostomy consult"]])("projects %s with one chart/person and a seated founder", (line, label) => {
    let state = createLevelFourIntegrationState(`specialty-view.${line}`); state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
    for (const key of Object.keys(state.nextServiceAppointmentTicks)) state.nextServiceAppointmentTicks[key] = Number.MAX_SAFE_INTEGER;
    for (const home of getAppAppointmentHomes(state, undefined, line)) state.nextServiceAppointmentTicks[`${line}:${home}`] = 1;
    for (let i = 0; i < 300 && !state.serviceOperations.some(op => op.incomeLineId === line && op.status === "in_service"); i++) state = consultTick(state);
    state.nextRoutineArrivalTick = state.facilityTick + 1; state = consultTick(state);
    const e = Object.values(state.encounters).find(e => e.consult)!; expect(e).toBeTruthy();
    let view = createPrototypePlayerView(state, null, false, null);
    expect(view.patients.find(row => row.id === e.id)).toMatchObject({ actionRequired: true, statusLabel: label });
    expect(view.facility.patients!.filter(row => row.instanceId === e.id)).toHaveLength(1);
    expect(view.facility.serviceVisitors!.some(row => row.instanceId === e.consult!.serviceOperationId)).toBe(false);
    state = consultCommand(state, { type: "OPEN_CHART", encounterId: e.id }); state = consultTick(state, 100);
    view = createPrototypePlayerView(state, null, false, null);
    expect(view.facility.founder).toMatchObject({ moving: false, seated: true });
    expect(view.facility.patients!.find(row => row.instanceId === e.id)?.location).toEqual(e.patientLocation);
  });
});
