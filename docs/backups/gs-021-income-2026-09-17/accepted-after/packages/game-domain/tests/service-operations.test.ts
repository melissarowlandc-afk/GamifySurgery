import { getServiceIncomeLine } from "@gamify-surgery/balance-config";
import { describe, expect, it } from "vitest";
import {
  createInitialGameState,
  deserializeGameState,
  gameReducer,
  getCurrentCapabilities,
  isEmployeeOperational,
  isRoomOperationalForFacilityWork,
  PROTOTYPE_DOMAIN_CONTEXT,
  advanceServiceOperations,
  serializeGameState,
  type GameState,
  type DomainContext,
  type PendingResult,
} from "../src";

let sequence = 0;

function serviceState(): GameState {
  const state = createInitialGameState(undefined, {
    campaignId: `campaign.service-operations.${sequence++}`,
    campaignSeed: "service-operations",
    createdAtRealMs: 0,
  });
  state.facilityLevel = 1;
  state.serviceAppointmentsEnabled = false;
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  state.nextFinancialPostingTick = Number.MAX_SAFE_INTEGER;
  state.environment.nextLitterSpawnTick = Number.MAX_SAFE_INTEGER;
  state.environment.nextWaterCoolerDrainTick = Number.MAX_SAFE_INTEGER;
  state.encounters = {};
  state.rooms.push(
    { id: "room.test.ultrasound", roomDefinitionId: "room.ultrasound", x: 33, y: 23, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
    ...([24, 25, 26, 27, 28] as const).map((y) => ({ id: `room.test.hall.${y}`, roomDefinitionId: "room.hallway", x: 32, y, orientation: 0 as const, doorSide: null, upgradeLevel: 1 as const, cleanliness: 100 })),
  );
  state.doors.push(
    { id: "door.test.ultrasound", roomId: "room.test.ultrasound", side: "south", offset: 2, exterior: false },
    { id: "door.test.ultrasound.staff", roomId: "room.test.ultrasound", side: "west", offset: 1, exterior: false },
    { id: "door.test.front", roomId: "room.instance.founder_desk", side: "west", offset: 0, exterior: false },
  );
  state.employees.push({
    id: "employee.test.imaging", staffRoleDefinitionId: "staff.imaging_technician",
    displayName: "Imaging Technician", appearance: state.founder.appearance,
    hiredAtFacilityTick: 0, salaryPerExpenseInterval: 26, morale: 75,
    trainingLevel: 1, homeRoomInstanceId: "room.test.ultrasound",
    location: { x: 34, y: 24 }, path: [{ x: 34, y: 24 }], pathIndex: 0,
    lastMovedAtFacilityTick: 0, lastPraisedAtFacilityTick: null,
    nextIdleActionAtFacilityTick: Number.MAX_SAFE_INTEGER, facilityTask: null,
  });
  return state;
}

function advance(state: GameState, minutes: number, context: DomainContext = PROTOTYPE_DOMAIN_CONTEXT): GameState {
  let next = state;
  for (let index = 0; index < minutes; index += 1) {
    next = gameReducer(next, { type: "ADVANCE_TICK", operationId: `service-operation.tick.${sequence++}` }, context);
  }
  return next;
}

function startUltrasound(state: GameState): GameState {
  return gameReducer(state, {
    type: "START_SERVICE_OPERATION",
    operationId: `service-operation.start.${sequence++}`,
    incomeLineId: "income.ultrasound",
    actorKind: "visitor",
  });
}

describe("service-only operations", () => {
  it("moves a visitor through real work and departure, then credits the frozen quote exactly once without FSRS work", () => {
    let state = serviceState();
    const initialCash = state.cash;
    const initialReviews = Object.values(state.learningHistories).reduce((sum, history) => sum + history.reviews.length, 0);
    expect([...getCurrentCapabilities(state)]).toContain("capability.ultrasound_machine");
    expect([...getCurrentCapabilities(state)]).toContain("capability.staff.imaging_technician");
    expect(isRoomOperationalForFacilityWork(state, "room.test.ultrasound")).toBe(true);
    expect(isEmployeeOperational(state, "employee.test.imaging")).toBe(true);
    state = startUltrasound(state);
    expect(Object.values(state.operationReceipts).at(-1)).toMatchObject({ status: "applied" });
    const operation = state.serviceOperations[0]!;
    expect(operation).toMatchObject({ actorKind: "visitor", status: "waiting_for_resources", quoteFee: 120 });
    const line = getServiceIncomeLine("income.ultrasound")! as { fee: number };
    const originalFee = line.fee;
    line.fee = 999;
    try {
      state = advance(state, 100);
    } finally {
      line.fee = originalFee;
    }
    expect(state.serviceOperations[0]).toMatchObject({ status: "completed", location: null, cancellationReason: null });
    expect(state.cash).toBe(initialCash + 120);
    expect(state.serviceIncomeReceipts).toHaveLength(1);
    expect(state.serviceIncomeReceipts[0]).toMatchObject({ actorKind: "visitor", grossAmount: 120 });
    expect(Object.values(state.learningHistories).reduce((sum, history) => sum + history.reviews.length, 0)).toBe(initialReviews);
    const reloaded = advance(deserializeGameState(serializeGameState(state)), 10);
    expect(reloaded.cash).toBe(initialCash + 120);
    expect(reloaded.serviceIncomeReceipts).toHaveLength(1);
  });

  it("keeps one active and one waiting operation per line even when both were explicitly queued", () => {
    let state = advance(startUltrasound(serviceState()), 2);
    state = startUltrasound(state);
    const operationCount = state.serviceOperations.length;
    state = startUltrasound(state);
    expect(state.serviceOperations).toHaveLength(operationCount);
    expect(Object.values(state.operationReceipts).at(-1)?.status).toBe("rejected");
    expect(state.serviceOperations.map((operation) => operation.status).filter((status) => status === "waiting_for_resources")).toHaveLength(1);
    expect(state.serviceOperations.map((operation) => operation.status).filter((status) => status === "walking_to_service" || status === "in_service")).toHaveLength(1);
    state = advance(state, 180);
    expect(state.serviceIncomeReceipts).toHaveLength(2);
  });

  it("does not leave phantom reservations when a selected employee cannot reach the room", () => {
    let state = startUltrasound(serviceState());
    state.employees[0]!.location = { x: 0, y: 0 };
    state.employees[0]!.path = [{ x: 0, y: 0 }];
    state = advance(state, 1);
    expect(state.serviceOperations[0]).toMatchObject({
      status: "waiting_for_resources",
      reservedRoomInstanceIds: [],
      reservedEmployeeIds: [],
    });
    expect(state.employees[0]!.facilityTask).toBeNull();
  });

  it("persists in-flight work and posts its receipt once after reload", () => {
    let state = advance(startUltrasound(serviceState()), 10);
    expect(state.serviceIncomeReceipts).toEqual([]);
    state = deserializeGameState(serializeGameState(state));
    state = advance(state, 100);
    expect(state.serviceIncomeReceipts).toHaveLength(1);
    const transactionKey = state.serviceIncomeReceipts[0]!.transactionKey;
    state = advance(deserializeGameState(serializeGameState(state)), 100);
    expect(state.serviceIncomeReceipts.map((receipt) => receipt.transactionKey)).toEqual([transactionKey]);
  });

  it("gives a concrete clinical acquisition first claim while allowing a second room and technician to serve a visitor", () => {
    let state = serviceState();
    state.rooms.push(
      { id: "room.test.ultrasound.second", roomDefinitionId: "room.ultrasound", x: 33, y: 19, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
      ...([20, 21, 22, 23] as const).map((y) => ({ id: `room.test.hall.${y}`, roomDefinitionId: "room.hallway", x: 32, y, orientation: 0 as const, doorSide: null, upgradeLevel: 1 as const, cleanliness: 100 })),
    );
    state.doors.push({ id: "door.test.ultrasound.second", roomId: "room.test.ultrasound.second", side: "west", offset: 1, exterior: false });
    state.employees.push({ ...state.employees[0]!, id: "employee.test.imaging.second", homeRoomInstanceId: "room.test.ultrasound.second", location: { x: 34, y: 20 }, path: [{ x: 34, y: 20 }] });
    state = gameReducer(state, {
      type: "ADMIT_PATIENT", operationId: "clinical-priority.admit", encounterId: "clinical-priority",
      caseId: PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.find((clinicalCase) => clinicalCase.earliestFacilityStage <= 1 && clinicalCase.requiredCapabilityIds.length === 0)!.id,
      patientDisplayName: "Clinical Priority", arrivalClass: "routine",
    });
    const encounter = state.encounters["clinical-priority"]!;
    const pending: PendingResult = {
      operationId: "clinical-priority.result", gateId: "clinical-priority.gate", originatingNodeIndex: 0,
      resultTypeId: "service.ultrasound", pendingLabel: "Scanning", resultNarrative: "Pending",
      routeId: "route.ultrasound.in_house", routeDisplayName: "Onsite ultrasound",
      scheduledAtTick: state.facilityTick, serviceDurationTicks: 100, durationTicks: 100,
      dueTick: state.facilityTick + 100, deliveredAtTick: null, offsiteReturnStartedAtTick: null,
      offsiteTravel: null, patientRemainsOnsite: true,
      patientTravel: { version: "patient-travel.v1", originRoomInstanceId: "room.instance.founder_desk", destinationRoomInstanceId: "room.test.ultrasound", outboundPath: [], returnPath: [], tilesPerTick: 1, outboundStartTick: 0, outboundArrivalTick: 0, serviceCompletionTick: 100, returnArrivalTick: 100 },
      timingPhases: [{ id: "clinical-acquisition", durationTicks: 100, resourceBound: true, startsAtTick: state.facilityTick, endsAtTick: state.facilityTick + 100 }],
      resourceReservations: [{ roomDefinitionId: "room.ultrasound", staffRoleDefinitionId: "staff.imaging_technician" }],
      imagingTechnicianId: "employee.test.imaging",
    };
    encounter.pendingResult = pending;
    encounter.steps[0]!.status = "feedback_pending";
    encounter.steps[0]!.result = pending;
    encounter.lifecycle = "active_pending_result";
    state = advance(startUltrasound(state), 1);
    expect(state.serviceOperations[0]).toMatchObject({
      reservedRoomInstanceIds: ["room.test.ultrasound.second"],
      reservedEmployeeIds: ["employee.test.imaging.second"],
    });
  });

  it("releases endoscopy procedure capacity when the patient enters the separately reserved recovery phase", () => {
    const state = serviceState();
    state.facilityLevel = 2;
    state.rooms = state.rooms.filter((room) => room.id !== "room.test.ultrasound");
    state.doors = state.doors.filter((door) => !door.id.startsWith("door.test.ultrasound"));
    state.employees = [];
    state.rooms.push(
      { id: "room.test.endoscopy", roomDefinitionId: "room.endoscopy", x: 33, y: 23, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
      { id: "room.test.recovery", roomDefinitionId: "room.periop_recovery", x: 38, y: 23, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
      { id: "room.test.bridge", roomDefinitionId: "room.hallway", x: 37, y: 24, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
    );
    state.doors.push(
      { id: "door.test.endoscopy.west", roomId: "room.test.endoscopy", side: "west", offset: 1, exterior: false },
      { id: "door.test.endoscopy.east", roomId: "room.test.endoscopy", side: "east", offset: 1, exterior: false },
      { id: "door.test.recovery.west", roomId: "room.test.recovery", side: "west", offset: 1, exterior: false },
    );
    const employee = (id: string, role: string, roomId: string, location: { x: number; y: number }) => ({
      id, staffRoleDefinitionId: role, displayName: id, appearance: state.founder.appearance,
      hiredAtFacilityTick: 0, salaryPerExpenseInterval: 30, morale: 75, trainingLevel: 1 as const,
      homeRoomInstanceId: roomId, location, path: [location], pathIndex: 0, lastMovedAtFacilityTick: 0,
      lastPraisedAtFacilityTick: null, nextIdleActionAtFacilityTick: Number.MAX_SAFE_INTEGER,
      facilityTask: { kind: "perform_service" as const, targetId: "service-operation.endoscopy", startedAtFacilityTick: 0, workMinutesRemaining: Number.MAX_SAFE_INTEGER },
    });
    state.employees.push(
      employee("employee.endoscopy", "staff.endoscopy_nurse", "room.test.endoscopy", { x: 34, y: 24 }),
      employee("employee.recovery", "staff.periop_nurse", "room.test.recovery", { x: 39, y: 24 }),
    );
    state.environment.founderActivity = { kind: "perform_service", targetId: "service-operation.endoscopy", path: [{ x: 34, y: 24 }], pathIndex: 0, lastMovedAtFacilityTick: 0, workMinutesRemaining: Number.MAX_SAFE_INTEGER };
    state.serviceOperations.push({
      id: "service-operation.endoscopy", incomeLineId: "income.endoscopy", catalogVersion: 1,
      actorKind: "visitor", actorId: "visitor.endoscopy", displayName: "Endoscopy Visitor", appearance: state.founder.appearance,
      status: "in_service", createdAtFacilityTick: 0, waitDeadlineFacilityTick: 60, startedAtFacilityTick: 0,
      completedAtFacilityTick: null, cancelledAtFacilityTick: null, quoteFee: 400, phaseIndex: 0,
      phaseStartedAtFacilityTick: 0, phaseEndsAtFacilityTick: 1,
      reservedRoomInstanceIds: ["room.test.endoscopy", "room.test.recovery"],
      reservedEmployeeIds: ["employee.endoscopy", "employee.recovery"], providerReservation: { kind: "founder" },
      location: { x: 34, y: 24 }, path: [{ x: 34, y: 24 }], pathIndex: 0,
      lastMovedAtFacilityTick: 0, cancellationReason: null,
    });
    state.facilityTick = 1;
    advanceServiceOperations(state, PROTOTYPE_DOMAIN_CONTEXT);
    expect(state.serviceOperations[0]).toMatchObject({
      status: "walking_between_phases",
      phaseIndex: 1,
      reservedRoomInstanceIds: ["room.test.recovery"],
      reservedEmployeeIds: ["employee.recovery"],
      providerReservation: null,
    });
    expect(state.employees.find((candidate) => candidate.id === "employee.endoscopy")!.facilityTask).toBeNull();
    expect(state.employees.find((candidate) => candidate.id === "employee.recovery")!.facilityTask?.targetId).toBe("service-operation.endoscopy");
    expect(state.environment.founderActivity).toBeNull();
  });

  it("cancels invalidated work without payment and lets the visitor leave", () => {
    let state = advance(startUltrasound(serviceState()), 5);
    expect(state.serviceOperations[0]!.status).not.toBe("waiting_for_resources");
    state.rooms = state.rooms.filter((room) => room.id !== "room.test.ultrasound");
    const cashBefore = state.cash;
    state = advance(state, 20);
    expect(state.serviceOperations[0]).toMatchObject({ status: "cancelled", location: null });
    expect(state.cash).toBe(cashBefore);
    expect(state.serviceIncomeReceipts).toEqual([]);
  });

  it("honors the appointments toggle without accumulating an offline backlog", () => {
    let state = serviceState();
    state.nextServiceAppointmentTicks["income.ultrasound"] = 1;
    state = advance(state, 5);
    expect(state.serviceOperations).toEqual([]);
    state = gameReducer(state, { type: "SET_SERVICE_APPOINTMENTS_ENABLED", operationId: "appointments.on", enabled: true });
    state = advance(state, 1);
    expect(state.serviceOperations).toEqual([]);
    expect(state.nextServiceAppointmentTicks["income.ultrasound"]).toBe(state.facilityTick + 120);
  });

  it("fairly serves harmonic ultrasound, CT, and collection appointment cadences without backlog bursts", () => {
    const state = serviceState();
    state.facilityLevel = 2;
    state.serviceAppointmentsEnabled = true;
    state.rooms.push(
      { id: "room.test.ct", roomDefinitionId: "room.ct", x: 28, y: 20, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
      { id: "room.test.phlebotomy", roomDefinitionId: "room.phlebotomy", x: 29, y: 17, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
      ...([18, 19, 20, 21, 22, 23] as const).map((y) => ({ id: `room.test.fair.hall.${y}`, roomDefinitionId: "room.hallway", x: 32, y, orientation: 0 as const, doorSide: null, upgradeLevel: 1 as const, cleanliness: 100 })),
    );
    state.doors.push(
      { id: "door.test.ct.east", roomId: "room.test.ct", side: "east", offset: 1, exterior: false },
      { id: "door.test.phlebotomy.east", roomId: "room.test.phlebotomy", side: "east", offset: 1, exterior: false },
    );
    state.employees.push({ ...state.employees[0]!, id: "employee.test.phlebotomist", staffRoleDefinitionId: "staff.phlebotomist", homeRoomInstanceId: "room.test.phlebotomy", location: { x: 31, y: 18 }, path: [{ x: 31, y: 18 }] });
    state.nextServiceAppointmentTicks = { "income.ultrasound": 1, "income.ct": 1, "income.collection": 1 };
    const admitted: string[] = [];
    for (let tick = 1; tick <= 720; tick += 1) {
      state.facilityTick = tick;
      const before = state.serviceOperations.length;
      advanceServiceOperations(state, PROTOTYPE_DOMAIN_CONTEXT);
      const created = state.serviceOperations.slice(before);
      admitted.push(...created.map((operation) => operation.incomeLineId));
      if (created.length) {
        state.serviceOperations = [];
        for (const employee of state.employees) employee.facilityTask = null;
        state.environment.founderActivity = null;
      }
    }
    expect(new Set(admitted)).toEqual(new Set(["income.ultrasound", "income.ct", "income.collection"]));
    expect(admitted.length).toBeGreaterThan(3);
    expect(state.lastServiceAppointmentTicks).toMatchObject({
      "income.ultrasound": expect.any(Number), "income.ct": expect.any(Number), "income.collection": expect.any(Number),
    });
  });

  it("rejects remote physical services and physical visitors for work-queue services", () => {
    let state = serviceState();
    state = gameReducer(state, { type: "START_SERVICE_OPERATION", operationId: "remote-ultrasound", incomeLineId: "income.ultrasound", actorKind: "remote" });
    expect(state.operationReceipts["remote-ultrasound"]?.status).toBe("rejected");
    expect(state.serviceOperations).toEqual([]);
    state = gameReducer(state, { type: "START_SERVICE_OPERATION", operationId: "visitor-image-read", incomeLineId: "income.image_read", actorKind: "visitor" });
    expect(state.operationReceipts["visitor-image-read"]?.status).toBe("rejected");
  });

  it("executes a future remote handler from supplied room and staff capabilities and anchors its receipt to the worker", () => {
    const context = JSON.parse(JSON.stringify(PROTOTYPE_DOMAIN_CONTEXT)) as DomainContext;
    const roomDefinitions = context.balanceRelease.facility.roomDefinitions as unknown as Array<(typeof context.balanceRelease.facility.roomDefinitions)[number]>;
    const staffDefinitions = context.balanceRelease.facility.staffRoleDefinitions as unknown as Array<(typeof context.balanceRelease.facility.staffRoleDefinitions)[number]>;
    const stageDefinitions = context.balanceRelease.facility.stageDefinitions as unknown as Array<(typeof context.balanceRelease.facility.stageDefinitions)[number]>;
    const roomSource = roomDefinitions.find((definition) => definition.id === "room.ultrasound")!;
    const staffSource = staffDefinitions.find((definition) => definition.id === "staff.imaging_technician")!;
    roomDefinitions.push({ ...roomSource, id: "room.reading", displayName: "Reading Room", capabilityIds: ["capability.radiology_reading"] });
    staffDefinitions.push({ ...staffSource, id: "staff.radiologist", displayName: "Radiologist", requiredAnyRoomDefinitionIds: ["room.reading"], capabilityIds: ["capability.staff.radiologist"] });
    stageDefinitions.push({ ...stageDefinitions.find((stage) => stage.level === 2)!, level: 4, displayName: "Future fixture", nextFacilityLevel: null } as (typeof stageDefinitions)[number]);

    const state = serviceState();
    (state as { facilityLevel: number }).facilityLevel = 4;
    state.rooms.find((room) => room.id === "room.test.ultrasound")!.roomDefinitionId = "room.reading";
    state.employees[0]!.staffRoleDefinitionId = "staff.radiologist";
    state.employees[0]!.displayName = "Reading Radiologist";
    let next = gameReducer(state, { type: "START_SERVICE_OPERATION", operationId: "future-read", incomeLineId: "income.image_read", actorKind: "remote" }, context);
    expect(next.operationReceipts["future-read"]?.status).toBe("applied");
    next = advance(next, 50, context);
    expect(next.serviceIncomeReceipts).toHaveLength(1);
    expect(next.serviceIncomeReceipts[0]).toMatchObject({
      actorKind: "remote",
      grossAmount: 40,
      displayAnchor: { actorKind: "employee", actorId: "employee.test.imaging" },
    });
    next.facilityLevel = 2;
    const reloaded = deserializeGameState(serializeGameState(next), context);
    expect(reloaded.serviceIncomeReceipts[0]?.displayAnchor).toEqual({ actorKind: "employee", actorId: "employee.test.imaging" });
  });

  it("executes a future physical MRI handler from supplied room and staff capabilities", () => {
    const context = JSON.parse(JSON.stringify(PROTOTYPE_DOMAIN_CONTEXT)) as DomainContext;
    const roomDefinitions = context.balanceRelease.facility.roomDefinitions as unknown as Array<(typeof context.balanceRelease.facility.roomDefinitions)[number]>;
    const stageDefinitions = context.balanceRelease.facility.stageDefinitions as unknown as Array<(typeof context.balanceRelease.facility.stageDefinitions)[number]>;
    const roomSource = roomDefinitions.find((definition) => definition.id === "room.ultrasound")!;
    roomDefinitions.push({ ...roomSource, id: "room.mri", displayName: "MRI Room", capabilityIds: ["capability.mri_machine"] });
    stageDefinitions.push({ ...stageDefinitions.find((stage) => stage.level === 2)!, level: 4, displayName: "Future fixture", nextFacilityLevel: null } as (typeof stageDefinitions)[number]);
    const state = serviceState();
    (state as { facilityLevel: number }).facilityLevel = 4;
    state.rooms.find((room) => room.id === "room.test.ultrasound")!.roomDefinitionId = "room.mri";
    let next = gameReducer(state, { type: "START_SERVICE_OPERATION", operationId: "future-mri", incomeLineId: "income.mri", actorKind: "visitor" }, context);
    expect(next.operationReceipts["future-mri"]?.status).toBe("applied");
    next = advance(next, 100, context);
    expect(next.serviceOperations[0]).toMatchObject({ status: "completed", location: null });
    expect(next.serviceIncomeReceipts[0]).toMatchObject({ actorKind: "visitor", incomeLineId: "income.mri", grossAmount: 240 });
  });
});
