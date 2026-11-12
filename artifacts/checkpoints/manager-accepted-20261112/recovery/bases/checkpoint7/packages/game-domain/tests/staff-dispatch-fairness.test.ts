import { describe, expect, it } from "vitest";
import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import {
  advanceEmployeeMovement, advanceServiceOperations, createInitialGameState, gameReducer, getCurrentQuestion,
  getDiagnosticOrderPlans, getRoomCareAnchor, getRoomDefinition,
  isRoomOperationalForFacilityWork, startEncounterProcedureOperation,
  getEligibleServiceRoute, planDiagnosticOrder, reconcileImagingIdleSeats, serializeGameState, deserializeGameState,
  reconcileReadingStations, getRadiologistReadingStation, startDiagnosticProcessingOperation, enableReadingPhase,
  getClinicalResourceReservations,
  type GameState,
} from "../src";
import { pending, timingFixture } from "./diagnostic-timing-fixtures";
import { hasQueuedHomeRoomWork } from "../src/staff-dispatch";
import { proceduralStaffingFixture } from "./procedural-staffing-fixture";

function twoStations(roomDefinitionId: string, roleId: string) {
  const fixture = timingFixture();
  fixture.state.serviceAppointmentsEnabled = false;
  const first = fixture.addRoom(roomDefinitionId, roleId);
  const second = fixture.addRoom(roomDefinitionId, roleId);
  second.room.id += ".second";
  fixture.state.doors.at(-1)!.roomId = second.room.id;
  fixture.state.doors.at(-1)!.id += ".second";
  const workers = fixture.state.employees.filter(employee => employee.staffRoleDefinitionId === roleId);
  workers[0]!.id = "worker.z.first-home";
  workers[1]!.id = "worker.a.second-home";
  workers[1]!.homeRoomInstanceId = second.room.id;
  return { ...fixture, first, second, workers };
}

function addPatient(state: GameState, id: string, location: { x: number; y: number }) {
  const encounter = structuredClone(Object.values(state.encounters)[0]!);
  encounter.id = id;
  encounter.patientLocation = { ...location };
  encounter.patientMovement = null;
  encounter.waitingDestination = null;
  state.encounters[id] = encounter;
  return encounter;
}

describe("service room and staff dispatch fairness", () => {
  it.each([
    ["room.phlebotomy", "staff.phlebotomist", "income.collection"],
    ["room.ultrasound", "staff.imaging_technician", "income.ultrasound"],
    ["room.xray", "staff.imaging_technician", "income.xray"],
    ["room.ct", "staff.imaging_technician", "income.ct"],
    ["room.laboratory", "staff.laboratory_technician", "income.laboratory_processing"],
  ])("uses both %s rooms concurrently with their own home staff", (roomId, roleId, incomeLineId) => {
    const fixture = twoStations(roomId, roleId);
    for (const [index, station] of [fixture.first, fixture.second].entries()) {
      const patient = addPatient(fixture.state, `patient.${index}`, station.anchor);
      expect(startEncounterProcedureOperation(fixture.state, patient, incomeLineId, fixture.context)).toBe(true);
    }
    advanceServiceOperations(fixture.state, fixture.context);
    for (const operation of fixture.state.serviceOperations) {
      const worker = fixture.state.employees.find(employee => operation.reservedEmployeeIds.includes(employee.id))!;
      expect(operation.reservedRoomInstanceIds).toEqual([worker.homeRoomInstanceId]);
    }
    expect(new Set(fixture.state.serviceOperations.flatMap(operation => operation.reservedEmployeeIds)).size).toBe(2);
    fixture.state.facilityTick++;
    advanceEmployeeMovement(fixture.state, fixture.context);
    advanceServiceOperations(fixture.state, fixture.context);
    expect(fixture.state.serviceOperations.map(operation => operation.status)).toEqual(["in_service", "in_service"]);
  });

  it("uses the nearest reachable station rather than the first room ID", () => {
    const fixture = twoStations("room.phlebotomy", "staff.phlebotomist");
    const patient = addPatient(fixture.state, "patient.near-second", fixture.second.anchor);
    expect(startEncounterProcedureOperation(fixture.state, patient, "income.collection", fixture.context)).toBe(true);
    advanceServiceOperations(fixture.state, fixture.context);
    expect(fixture.state.serviceOperations[0]!.reservedRoomInstanceIds).toEqual([fixture.second.room.id]);
    expect(fixture.state.serviceOperations[0]!.reservedEmployeeIds).toEqual([fixture.workers[1]!.id]);
  });

  it.each([0, 1])("honors anonymous legacy capacity without skipping the nearest station's home staff (station %s)", stationIndex => {
    const fixture = twoStations("room.phlebotomy", "staff.phlebotomist");
    fixture.encounter.pendingResult = pending();
    fixture.encounter.steps[0]!.status = "result_pending";
    const clinical = getClinicalResourceReservations(fixture.state, fixture.context);
    expect(clinical.roomDefinitionCounts.get("room.phlebotomy")).toBe(1);
    expect(clinical.staffRoleCounts.get("staff.phlebotomist")).toBe(1);
    const station = [fixture.first, fixture.second][stationIndex]!;
    for (let index = 0; index < 2; index++) {
      const patient = addPatient(fixture.state, `anonymous.spare.${index}`, station.anchor);
      patient.pendingResult = null;
      expect(startEncounterProcedureOperation(fixture.state, patient, "income.collection", fixture.context)).toBe(true);
    }
    advanceServiceOperations(fixture.state, fixture.context);
    expect(fixture.state.serviceOperations[0]!.reservedRoomInstanceIds).toEqual([station.room.id]);
    expect(fixture.state.serviceOperations[0]!.reservedEmployeeIds).toEqual([fixture.workers[stationIndex]!.id]);
    expect(fixture.state.serviceOperations[1]!.reservedEmployeeIds).toEqual([]);
  });

  it("tries another reachable staff member when the first employee cannot route", () => {
    const fixture = twoStations("room.phlebotomy", "staff.phlebotomist");
    fixture.state.doors = fixture.state.doors.filter(door => door.roomId !== fixture.second.room.id);
    const patient = addPatient(fixture.state, "patient.first", fixture.first.anchor);
    expect(startEncounterProcedureOperation(fixture.state, patient, "income.collection", fixture.context)).toBe(true);
    advanceServiceOperations(fixture.state, fixture.context);
    expect(fixture.state.serviceOperations[0]!.reservedEmployeeIds).toEqual([fixture.workers[0]!.id]);
  });

  it("sends collection to the spare staffed room while the nearer home phlebotomist is busy", () => {
    const fixture = twoStations("room.phlebotomy", "staff.phlebotomist");
    fixture.workers[0]!.facilityTask = { kind: "take_break", startedAtFacilityTick: 0, workMinutesRemaining: 10 };
    const patient = addPatient(fixture.state, "patient.near-busy", fixture.first.anchor);
    expect(startEncounterProcedureOperation(fixture.state, patient, "income.collection", fixture.context)).toBe(true);
    advanceServiceOperations(fixture.state, fixture.context);
    expect(fixture.state.serviceOperations[0]!.reservedRoomInstanceIds).toEqual([fixture.second.room.id]);
    expect(fixture.state.serviceOperations[0]!.reservedEmployeeIds).toEqual([fixture.workers[1]!.id]);
  });

  it("borrows a phlebotomist only when home staff is busy and the spare has no accepted home work", () => {
    const fixture = twoStations("room.phlebotomy", "staff.phlebotomist");
    const patient = addPatient(fixture.state, "patient.near-first", fixture.first.anchor);
    // Maintenance leaves the spare employee installed but makes their own
    // collection station unavailable for new work. Only the first station is free.
    fixture.second.room.maintenance = { status: "due", completedUses: 0, dueAtFacilityTick: 0, outOfServiceAtFacilityTick: 0, appliedUseKeys: [] };
    fixture.workers[0]!.facilityTask = { kind: "take_break", startedAtFacilityTick: 0, workMinutesRemaining: 10 };
    expect(hasQueuedHomeRoomWork(fixture.state, fixture.workers[1]!)).toBe(false);
    expect(startEncounterProcedureOperation(fixture.state, patient, "income.collection", fixture.context)).toBe(true);
    advanceServiceOperations(fixture.state, fixture.context);
    expect(fixture.state.serviceOperations[0]!.reservedRoomInstanceIds).toEqual([fixture.first.room.id]);
    expect(fixture.state.serviceOperations[0]!.reservedEmployeeIds).toEqual([fixture.workers[1]!.id]);
  });

  it("does not lend idle staff with an accepted collection waiting at their home station", () => {
    const fixture = twoStations("room.phlebotomy", "staff.phlebotomist");
    fixture.encounter.patientLocation = { ...fixture.second.anchor };
    const quote = planDiagnosticOrder(fixture.state, { orderId: "home.queue", encounterId: fixture.encounter.id, serviceId: "service.basic_labs" }, fixture.context);
    if (quote.kind !== "planned") throw new Error(quote.reason);
    expect(quote.plan.phases.find(phase => phase.kind === "collection")!.resource?.employeeIds).toEqual([fixture.workers[1]!.id]);
    fixture.encounter.pendingResult = pending(quote.plan);
    expect(hasQueuedHomeRoomWork(fixture.state, fixture.workers[1]!)).toBe(true);
    fixture.second.room.maintenance = { status: "due", completedUses: 0, dueAtFacilityTick: 0, outOfServiceAtFacilityTick: 0, appliedUseKeys: [] };
    fixture.workers[0]!.facilityTask = { kind: "take_break", startedAtFacilityTick: 0, workMinutesRemaining: 10 };
    const patient = addPatient(fixture.state, "patient.other", fixture.first.anchor);
    patient.pendingResult = null;
    expect(startEncounterProcedureOperation(fixture.state, patient, "income.collection", fixture.context)).toBe(true);
    advanceServiceOperations(fixture.state, fixture.context);
    expect(fixture.state.serviceOperations[0]!.reservedEmployeeIds).toEqual([]);
    expect(fixture.workers[1]!.facilityTask).toBeNull();
  });

  it("quotes spare cross-cover for a busy home phlebotomist without stealing accepted home work", () => {
    const fixture = twoStations("room.phlebotomy", "staff.phlebotomist");
    fixture.workers[0]!.facilityTask = { kind: "take_break", startedAtFacilityTick: 0, workMinutesRemaining: 10 };
    const request = { orderId: "cross.quote", encounterId: fixture.encounter.id, serviceId: "service.basic_labs", patientOrigin: fixture.first.anchor };
    const quote = planDiagnosticOrder(fixture.state, request, fixture.context);
    if (quote.kind !== "planned") throw new Error(quote.reason);
    expect(quote.plan.phases.find(phase => phase.kind === "collection")!.resource).toMatchObject({ roomInstanceId: fixture.first.room.id, employeeIds: [fixture.workers[1]!.id] });
    const home = planDiagnosticOrder(fixture.state, { ...request, orderId: "spare.home", patientOrigin: fixture.second.anchor }, fixture.context);
    if (home.kind !== "planned") throw new Error(home.reason);
    fixture.encounter.pendingResult = pending(home.plan);
    const next = planDiagnosticOrder(fixture.state, { ...request, orderId: "cross.retry" }, fixture.context);
    if (next.kind !== "planned") throw new Error(next.reason);
    expect(next.plan.phases.find(phase => phase.kind === "collection")!.resource?.employeeIds).toEqual([fixture.workers[0]!.id]);
  });

  it("keeps imaging home assignments distinct while another technician covers a busy home room", () => {
    const fixture = twoStations("room.ultrasound", "staff.imaging_technician");
    const patient = addPatient(fixture.state, "patient.imaging-cover", fixture.first.anchor);
    fixture.workers[0]!.facilityTask = { kind: "take_break", startedAtFacilityTick: 0, workMinutesRemaining: 10 };
    const second = fixture.second.room;
    second.maintenance = { status: "due", completedUses: 0, dueAtFacilityTick: 0, outOfServiceAtFacilityTick: 0, appliedUseKeys: [] };
    expect(startEncounterProcedureOperation(fixture.state, patient, "income.ultrasound", fixture.context)).toBe(true);
    advanceServiceOperations(fixture.state, fixture.context);
    expect(fixture.state.serviceOperations[0]!.reservedEmployeeIds).toEqual([fixture.workers[1]!.id]);
    fixture.workers[0]!.facilityTask = null;
    const homes = fixture.workers.map(employee => employee.homeRoomInstanceId);
    reconcileImagingIdleSeats(fixture.state);
    expect(fixture.workers.map(employee => employee.homeRoomInstanceId)).toEqual(homes);
  });

  it.each([
    ["room.phlebotomy", "staff.phlebotomist", "service.basic_labs"],
    ["room.ultrasound", "staff.imaging_technician", "service.ultrasound"],
  ])("prefers the home %s employee in legacy route selection", (roomId, roleId, serviceId) => {
    const fixture = twoStations(roomId, roleId);
    const selected = getEligibleServiceRoute(fixture.state, serviceId, null, fixture.context);
    expect(selected?.timing.patientTravel?.destinationRoomInstanceId).toBe(fixture.first.room.id);
    expect(selected?.phlebotomistId ?? selected?.imagingTechnicianId).toBe(fixture.workers[0]!.id);
  });

  it("keeps nearest-room ranking after legacy route selection tries each staffed room", () => {
    const fixture = twoStations("room.phlebotomy", "staff.phlebotomist");
    const firstY = fixture.first.room.y;
    fixture.first.room.y = fixture.second.room.y;
    fixture.second.room.y = firstY;
    for (const employee of fixture.workers) {
      const home = fixture.state.rooms.find(room => room.id === employee.homeRoomInstanceId)!;
      employee.location = { x: home.x + 1, y: home.y + 1 }; employee.path = [employee.location];
    }
    const selected = getEligibleServiceRoute(fixture.state, "service.basic_labs", null, fixture.context);
    expect(selected?.timing.patientTravel?.destinationRoomInstanceId).toBe(fixture.second.room.id);
    expect(selected?.phlebotomistId).toBe(fixture.workers[1]!.id);
  });

  it("retains frozen in-flight assignments, salary, fees and durations through save/reload", () => {
    const fixture = twoStations("room.phlebotomy", "staff.phlebotomist");
    const patient = addPatient(fixture.state, "patient.saved", fixture.first.anchor);
    expect(startEncounterProcedureOperation(fixture.state, patient, "income.collection", fixture.context)).toBe(true);
    advanceServiceOperations(fixture.state, fixture.context);
    fixture.state.facilityTick++;
    advanceServiceOperations(fixture.state, fixture.context);
    const operation = fixture.state.serviceOperations[0]!;
    const restored = deserializeGameState(serializeGameState(fixture.state), fixture.context);
    expect(restored.serviceOperations[0]).toMatchObject({ reservedEmployeeIds: operation.reservedEmployeeIds, reservedRoomInstanceIds: operation.reservedRoomInstanceIds,
      quoteFee: 50, phaseStartedAtFacilityTick: operation.phaseStartedAtFacilityTick, phaseEndsAtFacilityTick: operation.phaseEndsAtFacilityTick });
    expect(restored.employees.map(employee => employee.salaryPerExpenseInterval)).toEqual(fixture.workers.map(employee => employee.salaryPerExpenseInterval));
  });
});

/** Shipped room masks/doors and ordinary hiring; no fabricated work tasks. */
function gameplayFixture(roomId: string, roleId: string) {
  let state = createInitialGameState(undefined, { campaignId: "dispatch.gameplay", campaignSeed: "dispatch.gameplay", createdAtRealMs: 0 });
  state.facilityLevel = 3;
  state.paused = false;
  state.cash = 100_000; state.cashCents = 10_000_000;
  state.encounters = {};
  state.serviceAppointmentsEnabled = false;
  state.nextRoutineArrivalTick = state.nextFinancialPostingTick = state.nextEmployeeDiscussionTick = Number.MAX_SAFE_INTEGER;
  state.environment.nextLitterSpawnTick = state.environment.nextWaterCoolerDrainTick = Number.MAX_SAFE_INTEGER;
  state.rooms = state.rooms.filter(room => room.roomDefinitionId === "room.front_desk");
  state.doors = state.doors.filter(door => door.exterior);
  for (let y = 8; y <= 28; y++) state.rooms.push({ id: `dispatch.hall.${y}`, roomDefinitionId: "room.hallway", x: 32, y, orientation: 0, doorSide: null, upgradeLevel: 1 });
  state.doors.push({ id: "dispatch.front.west", roomId: state.rooms[0]!.id, side: "west", offset: 0, exterior: false });
  const definition = getRoomDefinition(roomId)!;
  for (let index = 0; index < 2; index++) {
    const id = `dispatch.station.${index}`;
    state.rooms.push({ id, roomDefinitionId: roomId, x: 32 - definition.width, y: 8 + index * 10, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 });
    state.doors.push({ id: `${id}.door`, roomId: id, side: "east", offset: 1, exterior: false });
  }
  for (let index = 0; index < 3; index++) {
    const id = `dispatch.exam.${index}`;
    state.rooms.push({ id, roomDefinitionId: "room.examination", x: 33, y: 8 + index * 5, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 });
    state.doors.push({ id: `${id}.door`, roomId: id, side: "west", offset: 1, exterior: false });
  }
  let sequence = 0;
  const dispatch = (command: Parameters<typeof gameReducer>[1]) => { state = gameReducer(state, command); return state; };
  const tick = () => dispatch({ type: "ADVANCE_TICK", operationId: `dispatch.tick.${sequence++}` });
  for (const id of ["worker.z.first-home", "worker.a.second-home"]) {
    dispatch({ type: "HIRE_STAFF", operationId: `dispatch.hire.${sequence++}`, employeeId: id, staffRoleDefinitionId: roleId });
    expect(state.employees.some(employee => employee.id === id)).toBe(true);
  }
  for (const room of state.rooms.filter(room => room.roomDefinitionId !== "room.hallway")) expect(isRoomOperationalForFacilityWork(state, room.id)).toBe(true);
  for (let minute = 0; minute < 70; minute++) tick();
  for (const employee of state.employees) {
    employee.morale = 100;
    state.retailNextOpportunityTicks[`employee:${employee.id}`] = Number.MAX_SAFE_INTEGER;
  }
  state.environment.founderActivity = null;
  return { get state() { return state; }, dispatch, tick };
}

describe("concurrent staff through real chart/order commands", () => {
  it.each([
    ["room.phlebotomy", "staff.phlebotomist", "case.fhh.suggestive-results-confirmation", "collection"],
    ["room.ultrasound", "staff.imaging_technician", "case.breast-cyst.under-30-asymptomatic-simple", "acquisition"],
  ])("runs three chart orders across two staffed %s rooms", (roomId, roleId, caseId, phaseKind) => {
    const fixture = gameplayFixture(roomId, roleId);
    for (let index = 0; index < 3; index++) {
      const id = `dispatch.patient.${index}`;
      fixture.dispatch({ type: "ADMIT_PATIENT", operationId: `${id}.admit`, encounterId: id, caseId, patientDisplayName: `QA Patient ${index}`, arrivalClass: "routine" });
      const patient = fixture.state.encounters[id]!;
      expect(patient).toBeDefined();
      const room = fixture.state.rooms.find(room => room.id === `dispatch.exam.${index}`)!;
      patient.patientLocation = getRoomCareAnchor(room, getRoomDefinition("room.examination")!, "patient");
      patient.assignedRoomInstanceId = room.id; patient.queuedCareRoomInstanceId = null;
      patient.patientMovement = null; patient.checkInStatus = "checked_in"; patient.lifecycle = "active_action_required";
      patient.steps[0]!.status = "action_required";
      fixture.dispatch({ type: "OPEN_CHART", operationId: `${id}.open`, encounterId: id });
      const question = getCurrentQuestion(fixture.state, id)!;
      expect(question).not.toBeNull();
      fixture.dispatch({ type: "SUBMIT_ANSWER", operationId: `${id}.answer`, encounterId: id, decisionNodeId: question.node.id,
        answerChoiceId: question.node.answerChoices.find(choice => choice.isCorrect)!.id });
      expect(fixture.state.operationReceipts[`${id}.answer`]?.status).toBe("applied");
      if (fixture.state.encounters[id]!.steps[0]!.status === "feedback_pending") fixture.dispatch({ type: "ACKNOWLEDGE_DECISION_FEEDBACK", operationId: `${id}.enact`, encounterId: id, decisionNodeId: question.node.id });
      fixture.dispatch({ type: "CLOSE_CHART", operationId: `${id}.close`, encounterId: id });
    }
    let concurrent = false;
    const assignments = new Map<string, string>();
    for (let minute = 0; minute < 180; minute++) {
      fixture.tick();
      const working = fixture.state.serviceOperations.filter(operation => operation.status === "in_service" && operation.diagnosticPhysicalWork?.phaseBindings.some(binding =>
        getDiagnosticOrderPlans(fixture.state).some(plan => plan.phases.some(phase => phase.id === binding.diagnosticPhaseId && phase.kind === phaseKind))));
      if (working.length >= 2 && !concurrent && process.env.DISPATCH_QA_ARTIFACTS === "1") {
        const directory = fileURLToPath(new URL("../../../.local-dev/staff-dispatch-20261008/", import.meta.url));
        mkdirSync(directory, { recursive: true });
        const qa = structuredClone(fixture.state);
        qa.paused = true;
        const saved = serializeGameState(qa);
        expect(deserializeGameState(saved).serviceOperations.filter(operation => operation.status === "in_service").length).toBeGreaterThanOrEqual(2);
        const name = roomId.slice(5);
        writeFileSync(`${directory}/${name}-concurrent.json`, saved, "utf8");
        writeFileSync(`${directory}/${name}-concurrent-summary.json`, JSON.stringify({ tick: qa.facilityTick,
          employees: qa.employees.map(employee => ({ id: employee.id, home: employee.homeRoomInstanceId, location: employee.location, task: employee.facilityTask })),
          operations: working.map(operation => ({ id: operation.id, status: operation.status, rooms: operation.reservedRoomInstanceIds, employees: operation.reservedEmployeeIds,
            started: operation.phaseStartedAtFacilityTick, ends: operation.phaseEndsAtFacilityTick })) }, null, 2), "utf8");
      }
      if (working.length >= 2) concurrent = true;
      for (const operation of working) {
        const employee = fixture.state.employees.find(employee => operation.reservedEmployeeIds.includes(employee.id))!;
        expect(operation.reservedRoomInstanceIds).toEqual([employee.homeRoomInstanceId]);
        assignments.set(operation.actorId, employee.id);
      }
      if (assignments.size === 3 && getDiagnosticOrderPlans(fixture.state).every(plan => plan.phases.filter(phase => phase.kind === phaseKind).every(phase => phase.status === "completed"))) break;
    }
    expect(concurrent).toBe(true);
    expect(assignments.size).toBe(3);
    expect(new Set(assignments.values()).size).toBe(2);
  }, 30_000);
});

describe("per-room role dispatch audit", () => {
  it.each([false, true])("keeps procedure nurses at their home room and uses both specialists (surgery=%s)", surgery => {
    const fixture = proceduralStaffingFixture(surgery);
    const role = surgery ? "staff.or_nurse" : "staff.endoscopy_nurse";
    const providerRole = surgery ? "staff.surgeon" : "staff.endoscopist";
    for (const staffRole of [role, providerRole]) {
      const workers = fixture.state.employees.filter(employee => employee.staffRoleDefinitionId === staffRole);
      for (const [index, worker] of workers.entries()) worker.id = `audit.${staffRole}.${index === 0 ? "z" : "a"}`;
    }
    const ids = fixture.admit();
    const served = new Set<string>();
    let concurrent = false;
    for (let minute = 0; minute < 260; minute++) {
      fixture.advance();
      const working = fixture.state.serviceOperations.filter(operation => ids.includes(operation.id) && operation.status === "in_service" && operation.providerReservation);
      if (working.length === 2) concurrent = true;
      for (const operation of working) {
        const nurse = fixture.state.employees.find(employee => employee.staffRoleDefinitionId === role && operation.reservedEmployeeIds.includes(employee.id))!;
        expect(nurse).toBeDefined();
        expect(operation.reservedRoomInstanceIds).toContain(nurse.homeRoomInstanceId);
        expect(operation.providerReservation?.kind).toBe("employee");
        if (!surgery && operation.providerReservation?.kind === "employee") {
          const providerId = operation.providerReservation.employeeId;
          expect(fixture.state.employees.find(employee => employee.id === providerId)?.homeRoomInstanceId).toBe(nurse.homeRoomInstanceId);
        }
        served.add(operation.id);
      }
      if (served.size === 2 && concurrent) break;
    }
    expect(served.size).toBe(2);
    expect(concurrent).toBe(true);
  }, 30_000);

  it("processes two ready studies at home desks in two Reading Rooms concurrently", () => {
    const fixture = twoStations("room.reading", "staff.radiologist");
    reconcileReadingStations(fixture.state);
    for (const employee of fixture.workers) {
      const post = getRadiologistReadingStation(fixture.state, employee, fixture.context)!;
      employee.location = { ...post.location }; employee.path = [employee.location];
    }
    for (let index = 0; index < 2; index++) {
      const quote = planDiagnosticOrder(fixture.state, { orderId: `read.audit.${index}`, encounterId: fixture.encounter.id,
        serviceId: "service.ultrasound", allowedRouteIds: ["route.ultrasound.outsourced"] }, fixture.context);
      if (quote.kind !== "planned") throw new Error(quote.reason);
      const read = quote.plan.phases.find(phase => phase.kind === "interpretation")!;
      for (const phase of quote.plan.phases) if (phase !== read) Object.assign(phase, { status: "completed", startedAtTick: 0, completedAtTick: 0, remainingMinutes: 0 });
      enableReadingPhase(quote.plan, read, 0);
      expect(startDiagnosticProcessingOperation(fixture.state, quote.plan, read.id, fixture.context)).not.toBeNull();
    }
    expect(fixture.state.serviceOperations.map(operation => operation.status)).toEqual(["in_service", "in_service"]);
    expect(new Set(fixture.state.serviceOperations.flatMap(operation => operation.reservedRoomInstanceIds)).size).toBe(2);
  });

  it("serves two authorized prescription customers using both pharmacies and their home pharmacists", () => {
    const fixture = twoStations("room.pharmacy", "staff.pharmacist");
    let state = fixture.state;
    for (let index = 0; index < 2; index++) {
      const actorId = `rx.customer.${index}`;
      const orderId = `rx.order.${index}`;
      state = gameReducer(state, { type: "AUTHORIZE_RETAIL_ORDER", operationId: `${orderId}.authorize`, orderId,
        incomeLineId: "income.pharmacy_pickup", actorKind: "retail_visitor", actorId }, fixture.context);
      state = gameReducer(state, { type: "START_RETAIL_PURCHASE", operationId: `${orderId}.start`, incomeLineId: "income.pharmacy_pickup",
        actorKind: "retail_visitor", actorId, authorizedOrderId: orderId }, fixture.context);
      expect(state.operationReceipts[`${orderId}.start`]?.status).toBe("applied");
    }
    expect(new Set(state.retailOperations.map(operation => operation.outletRoomInstanceId)).size).toBe(2);
    expect(new Set(state.retailOperations.map(operation => operation.servingEmployeeId)).size).toBe(2);
    for (const operation of state.retailOperations) expect(state.employees.find(employee => employee.id === operation.servingEmployeeId)?.homeRoomInstanceId).toBe(operation.outletRoomInstanceId);
  });

  it("keeps four GLP-1 NPs earning through individual slots across two suites while at their fixed posts", () => {
    const fixture = twoStations("room.glp1_telehealth_suite", "staff.glp1_np");
    for (const worker of [...fixture.workers]) fixture.state.employees.push({ ...structuredClone(worker), id: `${worker.id}.suite-partner` });
    fixture.state.encounters = {};
    fixture.state.openChartEncounterId = null;
    fixture.state.attendedEncounterId = null;
    fixture.state.nextRoutineArrivalTick = fixture.state.nextFinancialPostingTick = fixture.state.nextEmployeeDiscussionTick = Number.MAX_SAFE_INTEGER;
    fixture.state.paused = false;
    let state = gameReducer(fixture.state, { type: "ADVANCE_TICK", operationId: "glp1.audit.tick.1" }, fixture.context);
    expect(state.environment.glp1AutomationSlots).toHaveLength(4);
    const payoutAt = Math.max(...state.environment.glp1AutomationSlots.map(slot => slot.nextPayoutTick));
    while (state.facilityTick < payoutAt) state = gameReducer(state, { type: "ADVANCE_TICK", operationId: `glp1.audit.tick.${state.facilityTick + 1}` }, fixture.context);
    const receipts = state.serviceIncomeReceipts.filter(receipt => receipt.incomeLineId === "income.glp1_telehealth");
    expect(new Set(receipts.map(receipt => receipt.actorId)).size).toBe(4);
    expect(state.employees.every(employee => employee.facilityTask === null)).toBe(true);
    expect(new Set(state.environment.glp1AutomationSlots.map(slot => slot.suiteRoomInstanceId)).size).toBe(2);
  });

  it("assigns distinct cleanup targets to both EVS workers and sends the nearer worker first", () => {
    const fixture = twoStations("room.evs_closet", "staff.evs_worker");
    fixture.state.encounters = {};
    fixture.state.paused = false;
    fixture.state.environment.nextLitterSpawnTick = Number.MAX_SAFE_INTEGER;
    fixture.state.nextRoutineArrivalTick = fixture.state.nextFinancialPostingTick = Number.MAX_SAFE_INTEGER;
    fixture.state.environment.litterItems = [fixture.first, fixture.second].map((station, index) => ({ id: `cleanup.${index}`, roomId: station.room.id, location: station.anchor, spawnedAtFacilityTick: 0 }));
    const state = gameReducer(fixture.state, { type: "ADVANCE_TICK", operationId: "evs.audit.tick" }, fixture.context);
    expect(state.employees.map(employee => employee.facilityTask?.kind)).toEqual(["collect_litter", "collect_litter"]);
    expect(state.employees.map(employee => employee.facilityTask?.targetId)).toEqual(["cleanup.0", "cleanup.1"]);
  });

  it("chooses a reachable receptionist when the first employee cannot get to the cooler", () => {
    const state = createInitialGameState();
    state.facilityLevel = 1;
    state.encounters = {};
    state.paused = false;
    state.nextRoutineArrivalTick = state.nextFinancialPostingTick = state.nextEmployeeDiscussionTick = Number.MAX_SAFE_INTEGER;
    state.environment.waterCoolerFillPercent = 0;
    const base = twoStations("room.phlebotomy", "staff.phlebotomist").workers[0]!;
    for (const [index, location] of [{ x: 0, y: 0 }, state.environment.founderLocation].entries()) state.employees.push({ ...structuredClone(base),
      id: `reception.${index}`, staffRoleDefinitionId: "staff.receptionist", homeRoomInstanceId: "room.instance.founder_desk", location, path: [location], hiredAtFacilityTick: index });
    const next = gameReducer(state, { type: "ADVANCE_TICK", operationId: "reception.audit.tick" });
    expect(next.employees.find(employee => employee.id === "reception.1")?.facilityTask?.kind).toBe("refill_water");
  });

  it.each([
    ["room.phlebotomy", "staff.phlebotomist"], ["room.ultrasound", "staff.imaging_technician"],
    ["room.xray", "staff.imaging_technician"], ["room.ct", "staff.imaging_technician"],
    ["room.endoscopy", "staff.endoscopy_nurse"], ["room.endoscopy", "staff.endoscopist"],
    ["room.evs_closet", "staff.evs_worker"], ["room.laboratory", "staff.laboratory_technician"],
    ["room.pharmacy", "staff.pharmacist"], ["room.ambulatory_or", "staff.or_nurse"], ["room.surgeon_office", "staff.surgeon"],
  ])("both idle %s/%s employees take available idle actions in their own room", (roomId, roleId) => {
    const fixture = twoStations(roomId, roleId);
    fixture.context.balanceRelease.environment.idleActionChancePercent = 100;
    fixture.state.facilityTick = fixture.context.balanceRelease.facility.staffMovementIntervalTicks;
    for (const worker of fixture.workers) { worker.path = []; worker.pathIndex = 0; worker.nextIdleActionAtFacilityTick = 0; }
    advanceEmployeeMovement(fixture.state, fixture.context);
    for (const worker of fixture.workers) {
      expect(worker.path.length).toBeGreaterThan(1);
      const home = fixture.state.rooms.find(room => room.id === worker.homeRoomInstanceId)!;
      expect(worker.path.at(-1)!.x).toBeGreaterThanOrEqual(home.x);
      expect(worker.path.at(-1)!.y).toBeGreaterThanOrEqual(home.y);
      expect(worker.facilityTask).toBeNull();
    }
  });
});
