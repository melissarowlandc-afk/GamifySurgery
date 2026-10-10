import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createAppAppointmentsQaState } from "../../../../tests/fixtures/app-appointments";
import { createLevelFourRoomsQaContext, createLevelFourRoomsQaState } from "../../../../tests/fixtures/level-four-rooms";
import { advanceEmployeeMovement, advanceServiceOperations, gameReducer, getRoomStaffCapacity, isAppAppointment, PROTOTYPE_DOMAIN_CONTEXT } from "@gamify-surgery/game-domain";
import { createPrototypePlayerView } from "./viewModels";
import { describeFacilityCharacter } from "./characterActivityPresentation";

const context = createLevelFourRoomsQaContext();
const originalBalance = PROTOTYPE_DOMAIN_CONTEXT.balanceRelease;
beforeAll(() => { PROTOTYPE_DOMAIN_CONTEXT.balanceRelease = context.balanceRelease; });
afterAll(() => { PROTOTYPE_DOMAIN_CONTEXT.balanceRelease = originalBalance; });
describe("APP staff, service and named activity presentation", () => {
  it("shows individual provider fees and named unscored visits in Staff/Services/map activity", () => {
    const state = createAppAppointmentsQaState(context);
    state.employees[0]!.trainingLevel = 3;
    for (let i = 0; i < 30; i++) { state.facilityTick++; advanceEmployeeMovement(state, context); advanceServiceOperations(state, context); }
    const view = createPrototypePlayerView(state, null, false, null);
    const line = view.serviceIncome.catalogLines.find(row => row.id === "income.app_consult")!;
    expect(line.displayName).toBe("Appointments in clinic");
    expect(line.feeLabel).toBe("$80.00–$96.00 by APP training");
    expect(line.arrivalLabel).toContain("per staffed exam home");
    expect(line.arrivalLabel).toContain("unscored");
    const operations = state.serviceOperations.filter(isAppAppointment);
    expect(operations).toHaveLength(2);
    for (const operation of operations) {
      const provider = state.employees.find(employee => employee.id === (operation.providerReservation?.kind === "employee" ? operation.providerReservation.employeeId : ""))!;
      const activity = describeFacilityCharacter(state, { kind: "staff", id: provider.id })!;
      expect(activity.activity).toContain(operation.displayName);
      expect(view.serviceIncome.activeOperations.find(row => row.id === operation.id)?.actorLabel).toContain(provider.displayName);
      expect(view.staffRoles.find(row => row.id === "staff.app")?.employees.find(row => row.id === provider.id)?.activityLabel).toBe(activity.activity);
      const visitor = describeFacilityCharacter(state, { kind: "service-visitor", id: operation.actorId })!;
      expect(visitor.name).toContain(`${operation.clinicVisit!.demographics.ageYears}-year-old`);
      expect(visitor.name).toContain("Clinic appointment");
      expect(view.facility.serviceVisitors?.find(row => row.actorId === operation.actorId)?.supportRole).toBe("examination-patient");
      expect(view.facility.staff.find(row => row.instanceId === provider.id)?.supportRole).toBe("examination-clinician");
    }
    expect(view.staffRoles.find(row => row.id === "staff.app")?.staffingGuidance).toContain("upgrades add no posts");
    expect(view.staffRoles.find(row => row.id === "staff.app")?.canHire).toBe(false);
    expect(view.staffRoles.find(row => row.id === "staff.app")?.blockedReason).toContain("Maximum 2 hired");
  });

  it("shows art exhaustion for an eleventh APP while one reachable physical post remains free", () => {
    let state = createLevelFourRoomsQaState(context);
    for (let x = 9; x < 25; x++) {
      state = gameReducer(state, { type: "PLACE_ROOM", operationId: `art.hall.${x}`, roomId: `room.art.hall.${x}`,
        roomDefinitionId: "room.hallway", x, y: 26, orientation: 0 }, context);
      expect(state.operationReceipts[`art.hall.${x}`]?.status).toBe("applied");
    }
    for (let i = 0; i < 11; i++) {
      state = gameReducer(state, { type: "PLACE_ROOM", operationId: `art.exam.${i}`, roomId: `room.art.${i}`,
        roomDefinitionId: "room.examination", x: 9 + 3 * i, y: 24, orientation: 0 }, context);
      state = gameReducer(state, { type: "PLACE_DOOR", operationId: `art.door.${i}`, doorId: `door.art.${i}`,
        roomId: `room.art.${i}`, side: "south", offset: 1 }, context);
      expect(state.operationReceipts[`art.door.${i}`]?.status).toBe("applied");
    }
    for (let i = 0; i < 10; i++) {
      expect(createPrototypePlayerView(state, null, false, null).staffRoles.find(row => row.id === "staff.app")?.canHire).toBe(true);
      state = gameReducer(state, { type: "HIRE_STAFF", operationId: `art.hire.${i}`, employeeId: `app.art.${i}`, staffRoleDefinitionId: "staff.app" }, context);
      expect(state.operationReceipts[`art.hire.${i}`]?.status).toBe("applied");
    }
    expect(getRoomStaffCapacity(state, "staff.app").capacity).toBe(11);
    const view = createPrototypePlayerView(state, null, false, null);
    expect(view.staffRoles.find(row => row.id === "staff.app")).toMatchObject({ canHire: false,
      blockedReason: "All approved APP looks are in use; additional APP art is needed." });
    expect(view.staffOptions.find(row => row.id === "staff.app")).toMatchObject({ enabled: false,
      blockedReason: "All approved APP looks are in use; additional APP art is needed." });
  });

  it("shows pediatric and wound readiness while preserving the deferred procedure row", () => {
    const state = createAppAppointmentsQaState(context);
    for (const [i, definition] of ["room.pediatric_examination", "room.wound_ostomy"].entries()) {
      const employee = state.employees[i]!;
      const room = state.rooms.find(row => row.id === employee.homeRoomInstanceId)!;
      room.roomDefinitionId = definition;
      employee.location = { x: room.x, y: room.y }; employee.path = [employee.location]; employee.pathIndex = 0;
    }
    expect(describeFacilityCharacter(state, { kind: "staff", id: "app.0" })?.activity).toBe("Ready for pediatric appointments");
    expect(describeFacilityCharacter(state, { kind: "staff", id: "app.1" })?.activity).toBe("Ready for wound/ostomy appointments");
    const view = createPrototypePlayerView(state, null, false, null);
    for (const id of ["income.wound_care", "income.ostomy_support"]) {
      const line = view.serviceIncome.catalogLines.find(row => row.id === id)!;
      // This label fixture changes room definitions without moving their doors.
      // Operational readiness is covered by the real wound/ostomy QA fixture.
      expect(line.unavailableReason).not.toBe("Waiting for wound/ostomy services");
    }
    expect(view.serviceIncome.catalogLines.find(row => row.id === "income.wound_procedure")).toMatchObject({ available: false, unavailableReason: "Wound procedures are deferred" });
    expect(view.serviceIncome.catalogLines.find(row => row.id === "income.pediatric_consult")?.unavailableReason).not.toBe("Waiting for pediatric services");
    expect(view.serviceIncome.catalogLines.find(row => row.id === "income.app_consult")?.available).toBe(false);
  });
});
