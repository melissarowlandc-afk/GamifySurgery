import { describe, expect, it } from "vitest";
import {
  TUTORIAL_ENCOUNTER_ID,
  createInitialGameState,
  deserializeGameState,
  getDisplayedClinicSatisfaction,
  getFacilityProgressionStatus,
  getRoomDefinition,
  getRoomNavigationAnchor,
  getStaffRoleDefinition,
  serializeGameState,
  type EmployeeState,
  type GameState,
  type ServiceOperationState,
} from "../src";

function readyCampaign(): GameState {
  const state = createInitialGameState();
  state.facilityLevel = 3;
  state.clinicalXp = 500;
  state.environment.litterItems = [];
  const ended = state.encounters[TUTORIAL_ENCOUNTER_ID]!;
  ended.lifecycle = "resolved";
  ended.resolutionReason = "completed";
  ended.resolvedAtFacilityTick = 1;
  ended.finalPatientSatisfaction = 100;
  state.encounters = { [ended.id]: ended };
  const rooms = [
    { id: "pharmacy", definitionId: "room.pharmacy", x: 29, y: 24 },
    { id: "waiting", definitionId: "room.waiting", x: 28, y: 19 },
    { id: "bathroom", definitionId: "room.bathroom", x: 30, y: 16 },
    { id: "exam", definitionId: "room.examination", x: 29, y: 12 },
    { id: "xray", definitionId: "room.xray", x: 33, y: 20 },
    { id: "control", definitionId: "room.imaging_control", x: 36, y: 20 },
  ];
  state.rooms.push(
    ...rooms.map((room) => ({ id: `room.goal.${room.id}`, roomDefinitionId: room.definitionId, x: room.x, y: room.y, orientation: 0 as const, doorSide: null, upgradeLevel: 1 as const, cleanliness: 100 })),
    ...Array.from({ length: 16 }, (_, index) => ({ id: `room.goal.hall.${13 + index}`, roomDefinitionId: "room.hallway", x: 32, y: 13 + index, orientation: 0 as const, doorSide: null, upgradeLevel: 1 as const, cleanliness: 100 })),
  );
  state.doors.push(
    { id: "door.goal.front", roomId: "room.instance.founder_desk", side: "west", offset: 0, exterior: false },
    ...rooms.map((room) => ({ id: `door.goal.${room.id}`, roomId: `room.goal.${room.id}`, side: room.id === "xray" || room.id === "control" ? "west" as const : "east" as const, offset: room.id === "bathroom" ? 0 : 1, exterior: false })),
    { id: "door.goal.xray-control", roomId: "room.goal.xray", side: "east", offset: 1, exterior: false },
  );
  const staff = (roleId: string, homeRoomInstanceId: string): EmployeeState => {
    const role = getStaffRoleDefinition(roleId)!;
    const home = state.rooms.find((room) => room.id === homeRoomInstanceId)!;
    const location = getRoomNavigationAnchor(home, getRoomDefinition(home.roomDefinitionId)!, "staff");
    return {
      id: `employee.goal.${roleId}`, staffRoleDefinitionId: roleId, displayName: role.displayName,
      appearance: state.founder.appearance, hiredAtFacilityTick: 0,
      salaryPerExpenseInterval: role.salaryPerExpenseInterval, morale: 100, trainingLevel: 1,
      homeRoomInstanceId, location, path: [location], pathIndex: 0, lastMovedAtFacilityTick: 0,
      lastPraisedAtFacilityTick: null, nextIdleActionAtFacilityTick: 1, facilityTask: null,
    };
  };
  state.employees = [staff("staff.pharmacist", "room.goal.pharmacy"), staff("staff.imaging_technician", "room.goal.control")];
  state.serviceIncomeReceipts.push({
    id: "receipt.goal.first-operation", transactionKey: "receipt.goal.first-operation",
    incomeLineId: "income.ambulatory_operation", catalogVersion: 1, routeId: null,
    actorKind: "visitor", actorId: "visitor.goal.first-operation", grossAmount: 900,
    stockCost: 0, netCashDelta: 900, completedAtFacilityTick: 220,
  });
  return state;
}

describe("condensed Level 3 goals", () => {
  it("completes the terminal checklist without a lab, lab technician, OR, or OR nurse remaining", () => {
    const state = readyCampaign();
    const progression = getFacilityProgressionStatus(state);
    expect(progression.requirements.map((requirement) => requirement.id)).toEqual([
      "progression.clinical_xp",
      "progression.satisfaction",
      "progression.staff.staff.pharmacist",
      "progression.ambulatory_operation_completion",
    ]);
    expect(getDisplayedClinicSatisfaction(state)).toBeGreaterThan(90);
    expect(progression.requirements.filter((requirement) => !requirement.met)).toEqual([]);
    expect(progression).toMatchObject({ eligible: false, nextFacilityLevel: null, maximumPlayableLevel: 3 });
  });

  it("preserves the XP, strict satisfaction, and operational pharmacist requirements", () => {
    const state = readyCampaign();
    state.clinicalXp = 499;
    state.encounters[TUTORIAL_ENCOUNTER_ID]!.finalPatientSatisfaction = 90;
    state.employees = state.employees.filter((employee) => employee.staffRoleDefinitionId !== "staff.pharmacist");
    expect(getFacilityProgressionStatus(state).requirements.filter((requirement) => !requirement.met).map((requirement) => requirement.id)).toEqual([
      "progression.clinical_xp", "progression.satisfaction", "progression.staff.staff.pharmacist",
    ]);
  });

  it("retains existing completion, current XP, encounters, and learning histories after save/reload", () => {
    const state = readyCampaign();
    const restored = deserializeGameState(serializeGameState(state));
    expect(getFacilityProgressionStatus(restored).requirements.every((requirement) => requirement.met)).toBe(true);
    expect(restored.clinicalXp).toBe(500);
    expect(restored.learningHistories).toEqual(state.learningHistories);
    expect(restored.encounters[TUTORIAL_ENCOUNTER_ID]!.frozenCase).toEqual(state.encounters[TUTORIAL_ENCOUNTER_ID]!.frozenCase);
    expect(restored.serviceIncomeReceipts).toEqual(state.serviceIncomeReceipts);
  });

  it.each(["ambulatoryOperationCompleted", "ambulatoryOperationReceipt"] as const)("retains retired %s credit after save/reload", (flag) => {
    const state = readyCampaign();
    state.serviceIncomeReceipts = [];
    state.retiredServiceHistory = {
      version: "retired-service-history.v1", retiredReceiptCount: 0, retiredOperationCount: 1,
      grossCents: 0, stockCostCents: 0, netCashDeltaCents: 0,
      endoscopyReceipt: false, endoscopyOperationCompleted: false,
      ambulatoryOperationReceipt: false, ambulatoryOperationCompleted: false,
      [flag]: true,
    };
    const restored = deserializeGameState(serializeGameState(state));
    expect(getFacilityProgressionStatus(restored).requirements.every((requirement) => requirement.met)).toBe(true);
  });

  it("does not count an operation still awaiting recovery as completion", () => {
    const state = readyCampaign();
    state.serviceIncomeReceipts = [];
    state.serviceOperations = [{
      id: "service.goal.pending-recovery", incomeLineId: "income.ambulatory_operation",
      status: "waiting_for_next_phase", completedAtFacilityTick: null, cancelledAtFacilityTick: null,
      phaseIndex: 1, actorKind: "visitor",
    } as ServiceOperationState];
    expect(getFacilityProgressionStatus(state).requirements.find((requirement) => requirement.id === "progression.ambulatory_operation_completion")).toMatchObject({ met: false, current: 0 });
  });
});
