import { describe, expect, it } from "vitest";
import {
  createInitialGameState,
  gameReducer,
  type EmployeeState,
  type EmployeeTrainingState,
  type GameState,
} from "@gamify-surgery/game-domain";
import { createEmployeeTrainingView } from "./employeeTrainingViewModels";
import { createPrototypePlayerView } from "./viewModels";
import { createRoleTrainingSummary } from "./managementViewModels";

function addEmployee(state: GameState, roleId: string, level: EmployeeState["trainingLevel"] = 2): EmployeeState {
  const employee: EmployeeState = {
    id: `employee.training-copy.${state.employees.length}`,
    staffRoleDefinitionId: roleId,
    displayName: "Training Test",
    appearance: state.founder.appearance,
    hiredAtFacilityTick: 0,
    salaryPerExpenseInterval: 1,
    morale: 90,
    trainingLevel: level,
    homeRoomInstanceId: null,
    location: { x: 33, y: 28 },
    path: [], pathIndex: 0, lastMovedAtFacilityTick: 0,
    lastPraisedAtFacilityTick: null, nextIdleActionAtFacilityTick: 999,
    facilityTask: null,
  };
  state.employees.push(employee);
  return employee;
}

function session(stage: EmployeeTrainingState["stage"], placeId: "stool1" | "stool2" = "stool1"): EmployeeTrainingState {
  return {
    version: 1, requestSequence: 0, requestedAtFacilityTick: 0,
    earliestDepartureAtFacilityTick: 0, paidAmount: 75, targetLevel: 2,
    stage, roomInstanceId: "room.training-copy", placeId,
    remainingMinutes: 42, startedAtFacilityTick: 1,
    completedAtFacilityTick: null, lastProgressAtFacilityTick: 19,
  };
}

describe("employee training presentation", () => {
  it.each([
    ["staff.receptionist", "Reduces wait penalties 10%", 150],
    ["staff.imaging_technician", "Reduces scan time 10%", 150],
    ["staff.periop_nurse", "Reduces prep time 10%", 250],
    ["staff.endoscopy_nurse", "Reduces procedure time 10%", 250],
    ["staff.endoscopist", "Reduces procedure time 10%", 450],
    ["staff.phlebotomist", "Reduces draw time 10%", 200],
    ["staff.evs_worker", "Improves cleaning 10%", 150],
    ["staff.glp1_np", "Adds $5 per consult", 300],
    ["staff.laboratory_technician", "Reduces lab work time 10%", 250],
    ["staff.surgeon", "Reduces OR/QI time 10%", 700],
    ["staff.or_nurse", "Reduces OR time 10%", 350],
    ["staff.pharmacist", "Cuts supply costs 5%", 300],
    ["staff.repair_person", "Reduces repair time 10%", 200],
    ["staff.radiologist", "Reduces reading time 10%", 150],
  ])("provides concise current and next-step copy for %s", (roleId, description, nextCost) => {
    const state = createInitialGameState();
    const employee = addEmployee(state, roleId as string);
    const view = createEmployeeTrainingView(state, employee.id);
    expect(view.currentBenefitLabel).toBe(description);
    expect(view.incrementBenefitLabel).toBe(description);
    expect(view.cost).toBe(nextCost);
    expect(view.nextLevel).toBe(3);
    expect(view.sessionDurationMinutes).toBe(60);
  });

  it("distinguishes the next consultation's total bonus from the one-level increase", () => {
    const state = createInitialGameState();
    const employee = addEmployee(state, "staff.glp1_np", 3);
    expect(createEmployeeTrainingView(state, employee.id)).toMatchObject({
      currentBenefitLabel: "Adds $10 per consult",
      nextBenefitLabel: "Adds $15 per consult",
      incrementBenefitLabel: "Adds $5 per consult",
      costLabel: "$450",
    });
    employee.trainingLevel = 5;
    expect(createEmployeeTrainingView(state, employee.id)).toMatchObject({
      currentBenefitLabel: "Adds $20 per consult", status: "max_level",
      nextLevel: null, cost: null, nextBenefitLabel: null, incrementBenefitLabel: null, canTrain: false,
    });
  });

  it("formats a fractional NP category benefit in cents without rounding skill first", () => {
    const state = createInitialGameState();
    state.rooms.push({ id: "room.training-copy", roomDefinitionId: "room.training", x: 38, y: 24,
      orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 });
    const employees = [addEmployee(state, "staff.glp1_np", 3), addEmployee(state, "staff.glp1_np", 1), addEmployee(state, "staff.glp1_np", 1)];
    expect(createRoleTrainingSummary(state, "staff.glp1_np", employees)?.averageBenefitLabel).toBe("Adds $3.33 per consult");
  });

  it("shows the category's current consult payment and pharmacy stock cost", () => {
    const state = createInitialGameState();
    state.facilityLevel = 3;
    addEmployee(state, "staff.glp1_np", 3);
    addEmployee(state, "staff.glp1_np", 1);
    addEmployee(state, "staff.glp1_np", 1);
    addEmployee(state, "staff.pharmacist", 5);
    addEmployee(state, "staff.pharmacist", 1);
    const view = createPrototypePlayerView(state, null, false, null);
    expect(view.serviceIncome.catalogLines.find((line) => line.id === "income.glp1_telehealth")?.feeLabel).toBe("$53.33");
    expect(view.staffRoles.find((role) => role.id === "staff.glp1_np")?.staffingGuidance).toContain("$53.33 per facility hour");
    expect(view.serviceIncome.catalogLines.find((line) => line.id === "income.pharmacy_pickup"))
      .toMatchObject({ feeLabel: "$25.00", stockCostLabel: "$13.50", contributionLabel: "$11.50" });
  });

  it("exposes training data in the staff list without requiring a new button", () => {
    const state = createInitialGameState();
    state.facilityLevel = 2;
    const employee = addEmployee(state, "staff.receptionist", 1);
    employee.training = session("queued");
    const row = createPrototypePlayerView(state, null, false, null).staffRoles
      .flatMap((role) => role.employees).find((candidate) => candidate.id === employee.id);
    expect(row?.training).toMatchObject({
      currentBenefitLabel: "Base performance", nextBenefitLabel: "Reduces wait penalties 10%",
      status: "queued", statusLabel: "Queued · working", canTrain: false,
    });
  });

  it("assigns distinct furniture contacts only to seated trainees", () => {
    const state = createInitialGameState();
    state.rooms.push({ id: "room.training-copy", roomDefinitionId: "room.training", x: 38, y: 24,
      orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 });
    const first = addEmployee(state, "staff.receptionist", 1);
    const second = addEmployee(state, "staff.evs_worker", 1);
    first.location = { x: 38, y: 25 };
    second.location = { x: 40, y: 25 };
    first.training = session("training", "stool1");
    second.training = session("training", "stool2");
    const staff = () => createPrototypePlayerView(state, null, false, null).facility.staff;
    expect(staff().filter((actor) => actor.supportRole === "training-employee")
      .map(({ supportId, supportRoomInstanceId }) => [supportId, supportRoomInstanceId]))
      .toEqual([["stool1", "room.training-copy"], ["stool2", "room.training-copy"]]);
    for (const stage of ["queued", "walking_to_training", "returning"] as const) {
      first.training.stage = stage;
      expect(staff().find((actor) => actor.instanceId === first.id)?.supportRole).not.toBe("training-employee");
    }
  });

  it("does not use a historical diagnostic order's nominal due date when another order is selected", () => {
    let state = createInitialGameState();
    state.facilityLevel = 3;
    state.encounters = {};
    state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
    state = gameReducer(state, { type: "ADMIT_PATIENT", operationId: "training-eta.admit",
      encounterId: "encounter.training-eta", caseId: "case.iron-deficiency.adult-man-fatigue",
      patientDisplayName: "Timing Test", arrivalClass: "routine" });
    expect(state.operationReceipts["training-eta.admit"]?.status).toBe("applied");
    let encounter = state.encounters["encounter.training-eta"]!;
    encounter.lifecycle = "active_action_required";
    encounter.patientMovement = null;
    encounter.patientLocation = { ...state.environment.founderLocation };
    encounter.steps[0]!.status = "action_required";
    const node = encounter.frozenCase.decisionNodes[0]!;
    state = gameReducer(state, { type: "SUBMIT_ANSWER", operationId: "training-eta.answer",
      encounterId: encounter.id, decisionNodeId: node.id,
      answerChoiceId: node.answerChoices.find((choice) => choice.isCorrect)!.id });
    state = gameReducer(state, { type: "ACKNOWLEDGE_DECISION_FEEDBACK", operationId: "training-eta.ack",
      encounterId: encounter.id, decisionNodeId: node.id });
    encounter = state.encounters[encounter.id]!;
    const historical = structuredClone(encounter.pendingResult!);
    expect(historical.diagnosticTiming).toBeDefined();
    historical.dueTick = state.facilityTick + 73;
    const collection = historical.diagnosticTiming!.phases.find((phase) => phase.kind === "collection")!;
    collection.mode = "local";
    collection.resource = null;
    collection.requirement = { roomDefinitionId: "room.phlebotomy", staffRoleDefinitionIds: ["staff.phlebotomist"],
      providerRoleDefinitionIds: [], founderEligible: false, stationKind: null };
    encounter.steps[0]!.result = historical;
    encounter.pendingResult!.diagnosticTiming!.orderId = "order.training-eta.current";
    encounter.currentNodeIndex = 1;
    encounter.steps[1]!.status = "action_required";
    encounter.lifecycle = "active_action_required";
    const chart = createPrototypePlayerView(state, encounter.id, false, null).chart!;
    expect(chart.decisionSteps![0]!.etaLabel).toBeUndefined();
    expect(chart.decisionSteps![0]!.etaLabel).not.toBe("73 min remaining");
  });
});
