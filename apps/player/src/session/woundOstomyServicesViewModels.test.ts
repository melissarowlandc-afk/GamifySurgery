import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { gameReducer, PROTOTYPE_DOMAIN_CONTEXT, type GameState } from "@gamify-surgery/game-domain";
import { createWoundOstomyAppointmentsQaState } from "../../../../tests/fixtures/wound-ostomy-appointments";
import { createLevelFourRoomsQaContext } from "../../../../tests/fixtures/level-four-rooms";
import { createPrototypePlayerView } from "./viewModels";
import { describeFacilityCharacter } from "./characterActivityPresentation";

const context = createLevelFourRoomsQaContext(), originalBalance = PROTOTYPE_DOMAIN_CONTEXT.balanceRelease;
beforeAll(() => { PROTOTYPE_DOMAIN_CONTEXT.balanceRelease = context.balanceRelease; });
afterAll(() => { PROTOTYPE_DOMAIN_CONTEXT.balanceRelease = originalBalance; });
let sequence = 0;
function until(state: GameState, predicate: (state: GameState) => boolean) {
  for (let i = 0; i < 400 && !predicate(state); i++) state = gameReducer({ ...state, paused: false },
    { type: "ADVANCE_TICK", operationId: `wound.view.tick.${sequence++}` }, context);
  expect(predicate(state)).toBe(true); return state;
}

describe("M6 wound/ostomy service presentation", () => {
  it("shows real chair/provider supports, unscored demand, exact fee and the named APP activity", () => {
    let state = createWoundOstomyAppointmentsQaState(context);
    state = until(state, value => value.serviceOperations.some(row => row.status === "in_service"));
    const visit = state.serviceOperations.find(row => row.status === "in_service")!;
    const view = createPrototypePlayerView(state, null, false, null);
    expect(view.facility.serviceVisitors?.find(row => row.instanceId === visit.id)).toMatchObject({ supportRole: "wound-ostomy-patient", supportId: "recliner:patient", supportRoomInstanceId: "room.wound.qa.0" });
    expect(view.facility.staff.find(row => row.instanceId === "app.wound.0")).toMatchObject({ supportRole: "wound-ostomy-clinician", supportId: "stool:clinician", supportRoomInstanceId: "room.wound.qa.0" });
    for (const [id, feeLabel] of [["income.wound_care", "$60.00"], ["income.ostomy_support", "$75.00"]]) {
      const line = view.serviceIncome.catalogLines.find(row => row.id === id)!;
      expect(line).toMatchObject({ available: true, scheduled: true, feeLabel });
      expect(line.arrivalLabel).toContain("Every 3 hr per staffed wound/ostomy home · 30 min visit · unscored");
    }
    expect(view.serviceIncome.activeOperations.find(row => row.id === visit.id)?.actorLabel).toContain(state.employees[0]!.displayName);
    expect(describeFacilityCharacter(state, { kind: "staff", id: "app.wound.0" })?.activity).toContain(visit.displayName);
    expect(describeFacilityCharacter(state, { kind: "service-visitor", id: visit.actorId })?.name).toContain("Wound care appointment");
    expect(view.serviceIncome.catalogLines.find(row => row.id === "income.wound_procedure")).toMatchObject({ available: false, unavailableReason: "Wound procedures are deferred" });
    expect(view.serviceIncome.catalogLines.find(row => row.id === "income.wound_supply")?.arrivalLabel).toContain("Authorized supply orders only");
    state = until(state, value => value.serviceIncomeReceipts.some(row => row.incomeLineId === "income.wound_care"));
    expect(createPrototypePlayerView(state, null, false, null).serviceIncome.recentReceipts.find(row => row.displayName === "Routine wound care")?.grossLabel).toBe("$60.00");
    expect(state.clinicalXp).toBe(0);
  });

  it("shows APP-specific fees, requires an installed home and displays wound readiness", () => {
    const state = createWoundOstomyAppointmentsQaState(context, 2);
    state.employees[1]!.trainingLevel = 5;
    const view = createPrototypePlayerView(state, null, false, null);
    expect(view.serviceIncome.catalogLines.find(row => row.id === "income.wound_care")?.feeLabel).toBe("$60.00–$84.00 by APP training");
    expect(view.serviceIncome.catalogLines.find(row => row.id === "income.ostomy_support")?.feeLabel).toBe("$75.00–$105.00 by APP training");
    for (const employee of state.employees) { employee.path = [employee.location]; employee.pathIndex = 0; }
    expect(describeFacilityCharacter(state, { kind: "staff", id: "app.wound.0" })?.activity).toBe("Ready for wound/ostomy appointments");
    state.employees = [];
    expect(createPrototypePlayerView(state, null, false, null).serviceIncome.catalogLines.find(row => row.id === "income.wound_care")).toMatchObject({ available: false, unavailableReason: "Assign an APP to an operational Wound/Ostomy Clinic" });
  });
});
