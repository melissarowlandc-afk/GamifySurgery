import { describe, expect, it } from "vitest";
import { advanceEmployeeMovement, advanceLevelThreeSupport, advanceServiceOperations,
  cancelEmployeeTrainingForDismissal, gameReducer, getCurrentCapabilities, getEmployeeTrainingBenefit,
  getEmployeeTrainingPlaces, getEmployeeTrainingQuote, getFacilityAccessValidation,
  getWorkloadSnapshot, isEmployeeAwayForTraining, isEmployeeOperational, planDiagnosticOrder, PROTOTYPE_DOMAIN_CONTEXT,
  requestEmployeeTraining, startDiagnosticAcquisitionOperation, startServiceOperation } from "../src";
import { addTrainingEmployee, advanceTrainingMinutes, reachTrainingStage, trainingFixture } from "./employee-training-fixtures";
import { timingFixture } from "./diagnostic-timing-fixtures";

describe("individual paid employee training", () => {
  it("pays once, rejects duplicates, and keeps a queued employee operational", () => {
    let state = trainingFixture();
    const employee = addTrainingEmployee(state, "employee.payment");
    const command = { type: "TRAIN_EMPLOYEE" as const, operationId: "training.payment", employeeId: employee.id };
    state = gameReducer(state, command);
    expect(state.cash).toBe(24_925);
    expect(state.employees[0]?.training).toMatchObject({ stage: "queued", paidAmount: 75, targetLevel: 2, requestSequence: 0, remainingMinutes: 60 });
    expect(isEmployeeOperational(state, employee.id)).toBe(true);
    expect(gameReducer(state, command)).toBe(state);
    state = gameReducer(state, { ...command, operationId: "training.duplicate" });
    expect(state.operationReceipts["training.duplicate"]?.status).toBe("rejected");
    expect(state.cash).toBe(24_925);
    expect(state.employeeTrainingSequence).toBe(1);
  });

  it("rejects missing resources, unsupported identities, max level and insufficient cash before payment", () => {
    const state = trainingFixture();
    const employee = addTrainingEmployee(state, "employee.guard");
    expect(getFacilityAccessValidation(state).valid).toBe(true);
    expect(getEmployeeTrainingQuote(state, employee.id).canTrain).toBe(true);
    employee.trainingLevel = 5;
    expect(requestEmployeeTraining(state, employee.id).applied).toBe(false);
    expect(getEmployeeTrainingQuote(state, employee.id)).toMatchObject({ targetLevel: null, status: "max_level" });
    employee.trainingLevel = 1;
    state.cash = 74; state.cashCents = 7400;
    expect(requestEmployeeTraining(state, employee.id).applied).toBe(false);
    expect(state.cash).toBe(74);
    state.cash = 25_000; state.cashCents = 2_500_000;
    employee.staffRoleDefinitionId = "staff.unknown";
    expect(requestEmployeeTraining(state, employee.id).applied).toBe(false);
    employee.staffRoleDefinitionId = "staff.receptionist";
    state.doors = state.doors.filter((door) => door.id !== "door.test.training");
    expect(requestEmployeeTraining(state, employee.id).applied).toBe(false);
    expect(state.cash).toBe(25_000);
    expect(requestEmployeeTraining(state, "employee.missing").applied).toBe(false);
  });

  it("reserves only two places, keeps the third working and uses FIFO among eligible requests", () => {
    const state = trainingFixture();
    const employees = ["first", "second", "third"].map((id) => addTrainingEmployee(state, id));
    for (const employee of employees) expect(requestEmployeeTraining(state, employee.id).applied).toBe(true);
    advanceTrainingMinutes(state);
    expect(employees.map((employee) => employee.training?.stage)).toEqual(["walking_to_training", "walking_to_training", "queued"]);
    expect(getEmployeeTrainingPlaces(state).map((place) => place.employeeId)).toEqual(["first", "second"]);
    expect(employees[0]?.training?.placeId).not.toBe(employees[1]?.training?.placeId);
    expect(isEmployeeOperational(state, "third")).toBe(true);
    expect(isEmployeeAwayForTraining(employees[0]!)).toBe(true);
    reachTrainingStage(state, "first", "training");
    const first = employees[0]!;
    first.training!.remainingMinutes = 1;
    advanceTrainingMinutes(state);
    expect(first.training?.stage).toBe("returning");
    expect(employees[2]?.training?.stage).toBe("walking_to_training");
    expect(getEmployeeTrainingPlaces(state).filter((place) => place.employeeId)).toHaveLength(2);
    expect(isEmployeeOperational(state, first.id)).toBe(false);
  });

  it.each(["cover_periop", "perform_service", "perform_imaging", "refill_water", "clean_room", "repair_room", "participate_qi_discussion"] as const)(
    "finishes an existing %s duty before leaving and lets a later eligible request use a place", (kind) => {
      const state = trainingFixture();
      const busy = addTrainingEmployee(state, "employee.busy");
      const free = addTrainingEmployee(state, "employee.free");
      busy.facilityTask = { kind, startedAtFacilityTick: 0, workMinutesRemaining: 10, targetId: "existing.duty" };
      requestEmployeeTraining(state, busy.id); requestEmployeeTraining(state, free.id);
      advanceTrainingMinutes(state);
      expect(busy.training?.stage).toBe("queued");
      expect(busy.facilityTask?.kind).toBe(kind);
      expect(free.training?.stage).toBe("walking_to_training");
      busy.facilityTask = null;
      advanceTrainingMinutes(state);
      expect(busy.training?.stage).toBe("walking_to_training");
    },
  );

  it("starts the full hour on arrival, increments once and returns before becoming available", () => {
    const state = trainingFixture();
    const employee = addTrainingEmployee(state, "employee.hour");
    const home = { ...employee.location };
    const identities = { id: employee.id, appearance: { ...employee.appearance }, homeRoomInstanceId: employee.homeRoomInstanceId };
    const histories = JSON.stringify(state.learningHistories);
    requestEmployeeTraining(state, employee.id);
    advanceTrainingMinutes(state);
    expect(employee.training).toMatchObject({ stage: "walking_to_training", remainingMinutes: 60, startedAtFacilityTick: null });
    reachTrainingStage(state, employee.id, "training");
    const arrival = state.facilityTick;
    expect(employee.training).toMatchObject({ remainingMinutes: 60, startedAtFacilityTick: arrival });
    advanceTrainingMinutes(state, 59);
    expect(employee.training).toMatchObject({ stage: "training", remainingMinutes: 1 });
    expect(employee.trainingLevel).toBe(1);
    advanceTrainingMinutes(state);
    expect(employee.trainingLevel).toBe(2);
    expect(employee.training?.completedAtFacilityTick).toBe(arrival + 60);
    expect(employee.training?.stage).toBe("returning");
    expect(isEmployeeOperational(state, employee.id)).toBe(false);
    for (let tick = 0; employee.training && tick < 40; tick += 1) advanceTrainingMinutes(state);
    expect(employee.training).toBeNull();
    expect(employee.location).toEqual(home);
    expect(isEmployeeOperational(state, employee.id)).toBe(true);
    expect(employee).toMatchObject(identities);
    expect(employee.trainingLevel).toBe(2);
    expect(JSON.stringify(state.learningHistories)).toBe(histories);
    expect(getEmployeeTrainingBenefit(employee.staffRoleDefinitionId, 2)?.percent).toBe(10);
  });

  it("pauses remaining seated work through temporary room access loss and resumes it", () => {
    const state = trainingFixture();
    const employee = addTrainingEmployee(state, "employee.pause");
    requestEmployeeTraining(state, employee.id);
    reachTrainingStage(state, employee.id, "training");
    advanceTrainingMinutes(state, 15);
    const door = state.doors.find((candidate) => candidate.id === "door.test.training")!;
    state.doors = state.doors.filter((candidate) => candidate.id !== door.id);
    advanceTrainingMinutes(state, 20);
    expect(employee.training).toMatchObject({ stage: "training", remainingMinutes: 45 });
    expect(getEmployeeTrainingQuote(state, employee.id).blockedReason).toContain("paused");
    state.doors.push(door);
    advanceTrainingMinutes(state, 44);
    expect(employee.trainingLevel).toBe(1);
    advanceTrainingMinutes(state);
    expect(employee.trainingLevel).toBe(2);
  });

  it("refunds unstarted dismissal once and never grants a completed level to a fired identity", () => {
    let state = trainingFixture();
    const employee = addTrainingEmployee(state, "employee.dismissed");
    requestEmployeeTraining(state, employee.id);
    expect(state.cash).toBe(24_925);
    cancelEmployeeTrainingForDismissal(state, employee.id);
    cancelEmployeeTrainingForDismissal(state, employee.id);
    expect(state.cash).toBe(25_000);
    requestEmployeeTraining(state, employee.id);
    reachTrainingStage(state, employee.id, "training");
    const paidCash = state.cash;
    state = gameReducer(state, { type: "FIRE_EMPLOYEE", employeeId: employee.id, operationId: "fire.active-training" });
    expect(state.employees).toHaveLength(0);
    expect(state.cash).toBe(paidCash);
    advanceTrainingMinutes(state, 65);
    expect(state.employees).toHaveLength(0);
  });

  it("leaves the passive training workload bonus unchanged and does not let support work seize a trainee", () => {
    const state = trainingFixture();
    const employee = addTrainingEmployee(state, "employee.support", "staff.evs_worker");
    const workload = getWorkloadSnapshot(state).routineLimit;
    requestEmployeeTraining(state, employee.id);
    reachTrainingStage(state, employee.id, "training");
    advanceLevelThreeSupport(state, PROTOTYPE_DOMAIN_CONTEXT);
    advanceEmployeeMovement(state, PROTOTYPE_DOMAIN_CONTEXT);
    expect(employee.facilityTask).toBeNull();
    expect(employee.training?.stage).toBe("training");
    expect(getWorkloadSnapshot(state).routineLimit).toBe(workload);
  });

  it("finishes the NP's current consultation before departure, then pauses consultations while away", () => {
    let state = trainingFixture();
    state.rooms.push(
      { id: "room.test.training-glp", roomDefinitionId: "room.glp1_telehealth_suite", x: 29, y: 29, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
      ...[29, 30].map((y) => ({ id: `room.test.glp-hall.${y}`, roomDefinitionId: "room.hallway", x: 32, y, orientation: 0 as const, doorSide: null, upgradeLevel: 1 as const, cleanliness: 100 })),
    );
    state.doors.push({ id: "door.test.training-glp", roomId: "room.test.training-glp", side: "east", offset: 1, exterior: false });
    addTrainingEmployee(state, "employee.np", "staff.glp1_np", "room.test.training-glp");
    state.environment.glp1AutomationSlots = [{ suiteRoomInstanceId: "room.test.training-glp", employeeId: "employee.np", nextPayoutTick: 3 }];
    state = gameReducer(state, { type: "TRAIN_EMPLOYEE", employeeId: "employee.np", operationId: "train.np" });
    expect(state.employees[0]?.training?.earliestDepartureAtFacilityTick).toBe(3);
    for (let tick = 1; tick <= 2; tick += 1) {
      state = gameReducer(state, { type: "ADVANCE_TICK", operationId: `np.tick.${tick}` });
      expect(state.employees[0]?.training?.stage).toBe("queued");
    }
    state = gameReducer(state, { type: "ADVANCE_TICK", operationId: "np.tick.3" });
    expect(state.environment.glp1AutomationConsultationsCompleted).toBe(1);
    expect(state.cash).toBe(24_900);
    expect(state.employees[0]?.training?.stage).toBe("walking_to_training");
    for (let tick = 4; tick <= 45; tick += 1) state = gameReducer(state, { type: "ADVANCE_TICK", operationId: `np.tick.${tick}` });
    expect(state.employees[0]?.training?.stage).toBe("training");
    expect(state.environment.glp1AutomationConsultationsCompleted).toBe(1);
  });

  it("keeps payroll accruing during travel and seated training", () => {
    let state = trainingFixture();
    addTrainingEmployee(state, "employee.payroll").salaryPerExpenseInterval = 60;
    requestEmployeeTraining(state, "employee.payroll");
    state = gameReducer(state, { type: "ADVANCE_TICK", operationId: "payroll.first" });
    const oneMinuteAccrual = state.operatingAccrualSixtiethCents;
    for (let tick = 2; tick <= 30; tick += 1) state = gameReducer(state, { type: "ADVANCE_TICK", operationId: `payroll.tick.${tick}` });
    expect(state.employees[0]?.training?.stage).toBe("training");
    expect(state.operatingAccrualSixtiethCents).toBe(oneMinuteAccrual * 30);
    expect(state.employees[0]?.salaryPerExpenseInterval).toBe(60);
    expect(oneMinuteAccrual).toBeGreaterThanOrEqual(6000);
  });

  it("preserves an imaging technician's original home across training and return", () => {
    const fixture = timingFixture();
    const first = fixture.addRoom("room.ultrasound", "staff.imaging_technician");
    fixture.addRoom("room.xray"); fixture.addRoom("room.training");
    const employee = fixture.state.employees[0]!;
    expect(requestEmployeeTraining(fixture.state, employee.id, fixture.context).applied).toBe(true);
    advanceTrainingMinutes(fixture.state, 1, fixture.context);
    expect(employee.training?.stage).toBe("walking_to_training");
    advanceEmployeeMovement(fixture.state, fixture.context);
    expect(employee.homeRoomInstanceId).toBe(first.room.id);
    for (let tick = 0; employee.training && tick < 200; tick += 1) advanceTrainingMinutes(fixture.state, 1, fixture.context);
    expect(employee.training).toBeNull();
    expect(employee.homeRoomInstanceId).toBe(first.room.id);
    expect(employee.trainingLevel).toBe(2);
  });

  it("keeps installed onsite blood collection eligible while actual collection waits for the trainee", () => {
    const fixture = timingFixture();
    fixture.state.serviceAppointmentsEnabled = false;
    const station = fixture.addRoom("room.phlebotomy", "staff.phlebotomist");
    fixture.addRoom("room.training");
    const employee = fixture.state.employees[0]!;
    const installedCapabilities = getCurrentCapabilities(fixture.state, fixture.context);
    requestEmployeeTraining(fixture.state, employee.id, fixture.context);
    advanceTrainingMinutes(fixture.state, 1, fixture.context);
    expect(getCurrentCapabilities(fixture.state, fixture.context)).toEqual(installedCapabilities);
    const quote = planDiagnosticOrder(fixture.state, { orderId: "order.training.collection", encounterId: fixture.encounter.id,
      serviceId: "service.basic_labs", patientOrigin: station.anchor }, fixture.context);
    expect(quote.kind).toBe("planned");
    if (quote.kind !== "planned") throw new Error(quote.reason);
    expect(quote.plan.phases.find((phase) => phase.kind === "collection")?.mode).toBe("local");
    fixture.encounter.patientLocation = { ...station.anchor };
    const source = quote.plan.sources[0]!;
    const id = startDiagnosticAcquisitionOperation(fixture.state, fixture.encounter, quote.plan, null, "income.phlebotomy", {
      version: "test-choice-order.v1", purpose: "terminal", caseId: fixture.encounter.frozenCase.id, nodeId: "node.training", questionVariantId: "variant.training",
      choiceId: "choice.training", choiceLabel: "Training fixture", serviceId: source.serviceId!, routeId: source.routeId!, routeDisplayName: source.routeDisplayName, externalRemainder: null,
    }, fixture.context);
    expect(id).not.toBeNull();
    const operation = fixture.state.serviceOperations.find((candidate) => candidate.id === id)!;
    expect(operation.status).toBe("waiting_for_resources");
    expect(operation.reservedEmployeeIds).toEqual([]);
    advanceServiceOperations(fixture.state, fixture.context);
    expect(operation.status).toBe("waiting_for_resources");
    expect(employee.facilityTask).toBeNull();
    expect(employee.training?.stage).toBe("walking_to_training");
  });

  it("keeps an endoscopy patient waiting for periop coverage instead of seizing the training nurse", () => {
    const fixture = timingFixture();
    fixture.state.cash = 10_000;
    fixture.state.cashCents = 1_000_000;
    fixture.state.serviceAppointmentsEnabled = false;
    fixture.addRoom("room.endoscopy", "staff.endoscopy_nurse");
    fixture.addRoom("room.periop_recovery", "staff.periop_nurse");
    fixture.addRoom("room.training");
    const nurse = fixture.state.employees.find((employee) => employee.staffRoleDefinitionId === "staff.periop_nurse")!;
    const request = requestEmployeeTraining(fixture.state, nurse.id, fixture.context);
    if (!request.applied) throw new Error(request.message);
    advanceTrainingMinutes(fixture.state, 1, fixture.context);
    expect(nurse.training?.stage).toBe("walking_to_training");
    expect(isEmployeeAwayForTraining(nurse)).toBe(true);
    const operationId = startServiceOperation(fixture.state, "income.endoscopy", "visitor", fixture.context);
    expect(operationId).not.toBeNull();
    const operation = fixture.state.serviceOperations.find((candidate) => candidate.id === operationId)!;
    operation.status = "waiting_for_resources";
    operation.location = { x: 4, y: 77 };
    operation.path = [{ ...operation.location }];
    operation.pathIndex = 0;
    advanceServiceOperations(fixture.state, fixture.context);
    expect(operation.status).toBe("waiting_for_resources");
    expect(operation.reservedEmployeeIds).not.toContain(nurse.id);
    expect(operation.periopBedReservation).toBeUndefined();
    expect(nurse.facilityTask).toBeNull();
    expect(nurse.training?.stage).toBe("walking_to_training");
  });
});
