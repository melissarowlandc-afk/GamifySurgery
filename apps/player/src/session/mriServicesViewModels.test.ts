import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createInitialGameState, gameReducer, PROTOTYPE_DOMAIN_CONTEXT, type GameState } from "@gamify-surgery/game-domain";
import { createMriAppointmentsQaState } from "../../../../tests/fixtures/mri-appointments";
import { createLevelFourRoomsQaContext } from "../../../../tests/fixtures/level-four-rooms";
import { createPrototypePlayerView } from "./viewModels";
import { describeFacilityCharacter } from "./characterActivityPresentation";

const context = createLevelFourRoomsQaContext(), originalBalance = PROTOTYPE_DOMAIN_CONTEXT.balanceRelease;
beforeAll(() => { PROTOTYPE_DOMAIN_CONTEXT.balanceRelease = context.balanceRelease; });
afterAll(() => { PROTOTYPE_DOMAIN_CONTEXT.balanceRelease = originalBalance; });
let sequence = 0;
function until(state: GameState, predicate: (state: GameState) => boolean) {
  for (let i = 0; i < 300 && !predicate(state); i++) state = gameReducer({ ...state, paused: false },
    { type: "ADVANCE_TICK", operationId: `mri.view.tick.${sequence++}` }, context);
  expect(predicate(state)).toBe(true); return state;
}

describe("MRI services, supports, activity and finance", () => {
  it("shows the real patient/table and technician/console supports and named read activity", () => {
    let state = createMriAppointmentsQaState(context);
    state = until(state, value => value.serviceOperations.some(row => row.incomeLineId === "income.mri" && row.status === "in_service"));
    const visit = state.serviceOperations.find(row => row.incomeLineId === "income.mri")!;
    const view = createPrototypePlayerView(state, null, false, null);
    expect(view.facility.serviceVisitors?.find(row => row.instanceId === visit.id)).toMatchObject({ supportRole: "mri-patient", supportId: "patient-seated", supportRoomInstanceId: "room.mri.qa" });
    expect(view.facility.staff.find(row => row.instanceId === "tech.mri.qa")).toMatchObject({ supportRole: "mri-operator", supportId: "operator", supportRoomInstanceId: "room.mri.qa" });
    expect(view.serviceIncome.catalogLines.find(row => row.id === "income.mri")).toMatchObject({ available: true, feeLabel: "$240.00", scheduled: true });
    expect(view.serviceIncome.catalogLines.find(row => row.id === "income.mri")?.arrivalLabel).toContain("60 min acquisition + 5 min onsite / 30 min external read");
    expect(view.serviceIncome.activeOperations.find(row => row.id === visit.id)?.actorLabel).toContain(`${visit.clinicVisit!.demographics.ageYears}, ${visit.clinicVisit!.demographics.sexLabel}`);
    expect(view.serviceIncome.activeOperations.find(row => row.id === visit.id)?.statusLabel).toContain("Result in");
    expect(describeFacilityCharacter(state, { kind: "service-visitor", id: visit.actorId })?.name).toContain("MRI visitor");
    // The chart adapter must bind the same delivered physical scan to the table.
    const chartState = structuredClone(state);
    const patient = Object.values(createInitialGameState(context).encounters)[0]!;
    patient.patientMovement = null; patient.patientLocation = { ...visit.location! };
    chartState.encounters = { [patient.id]: patient };
    chartState.serviceOperations = [{ ...structuredClone(visit), actorKind: "encounter", actorId: patient.id,
      clinicVisit: undefined, diagnosticTiming: undefined }];
    expect(createPrototypePlayerView(chartState, null, false, null).facility.patients?.find(row => row.instanceId === patient.id)).toMatchObject({
      supportRole: "mri-patient", supportId: "patient-seated", supportRoomInstanceId: "room.mri.qa" });
    state = until(state, value => value.serviceOperations.some(row => row.diagnosticPhaseWork?.kind === "interpretation" && row.status === "in_service"));
    expect(describeFacilityCharacter(state, { kind: "staff", id: "reader.mri.qa" })?.activity).toContain(visit.displayName);
    expect(createPrototypePlayerView(state, null, false, null).serviceIncome.activeOperations.find(row => row.displayName === "In-house study read")).toMatchObject({ actorLabel: visit.displayName, quoteFeeLabel: "$5.00" });
  });

  it("shows external reading without requiring a local reader and exposes the actual MRI receipt once", () => {
    let state = createMriAppointmentsQaState(context);
    state.employees = state.employees.filter(row => row.staffRoleDefinitionId !== "staff.radiologist");
    state = until(state, value => value.serviceOperations.some(row => row.incomeLineId === "income.mri" && row.status === "in_service"));
    expect(createPrototypePlayerView(state, null, false, null).serviceIncome.catalogLines.find(row => row.id === "income.mri")?.available).toBe(true);
    state = until(state, value => value.serviceOperations.some(row => row.status === "waiting_for_results"));
    const visit = state.serviceOperations.find(row => row.incomeLineId === "income.mri")!;
    expect(describeFacilityCharacter(state, { kind: "service-visitor", id: visit.actorId })?.activity).toBe("Waiting for external MRI interpretation");
    const receipts = createPrototypePlayerView(state, null, false, null).serviceIncome.recentReceipts.filter(row => row.displayName === "MRI");
    expect(createPrototypePlayerView(state, null, false, null).serviceIncome.activeOperations.find(row => row.id === visit.id)?.statusLabel).toMatch(/external MRI interpretation.*Result in.*game estimate/);
    expect(receipts).toHaveLength(1); expect(receipts[0]?.grossLabel).toBe("$240.00");
    expect(state.clinicalXp).toBe(0);
  });
});
