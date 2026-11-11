import { describe, expect, it } from "vitest";
import { createAppAppointmentsQaState } from "../../../../tests/fixtures/app-appointments";
import { createLevelFourRoomsQaContext } from "../../../../tests/fixtures/level-four-rooms";
import { consultCommand, consultTick } from "../../../../packages/game-domain/tests/founder-consults.fixture";
import { createPrototypePlayerView } from "./viewModels";

describe("APP consult presentation hooks", () => {
  it("marks the current patient and seats the attending founder in its existing exam room", () => {
    const ctx = createLevelFourRoomsQaContext();
    let state = createAppAppointmentsQaState(ctx); state.paused = false;
    for (let i = 0; i < 100 && !state.serviceOperations.some(op => op.status === "in_service"); i++) state = consultTick(state, 1, ctx);
    state.nextRoutineArrivalTick = state.facilityTick + 1;
    state = consultTick(state, 1, ctx);
    const e = Object.values(state.encounters).find(e => e.consult?.kind === "app")!;
    expect(e).toBeTruthy();
    let view = createPrototypePlayerView(state, null, false, null);
    expect(view.patients.find(p => p.id === e.id)).toMatchObject({ actionRequired: true, statusLabel: "APP consult" });
    expect(view.facility.serviceVisitors!.some(p => p.instanceId === e.consult!.serviceOperationId)).toBe(false);
    state = consultCommand(state, { type: "OPEN_CHART", encounterId: e.id }, ctx);
    state = consultTick(state, 80, ctx);
    view = createPrototypePlayerView(state, null, false, null);
    expect(view.facility.founder).toMatchObject({ seated: true, moving: false });
    expect(view.facility.patients!.filter(p => p.instanceId === e.id)).toHaveLength(1);
    expect(view.facility.patients!.find(p => p.instanceId === e.id)?.location).toEqual(e.patientLocation);
  });
});
