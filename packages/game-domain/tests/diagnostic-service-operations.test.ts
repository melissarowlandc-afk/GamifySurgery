import { describe, expect, it } from "vitest";
import {
  advanceServiceOperations, deserializeGameState, forecastDiagnosticOrderPlan, getDiagnosticOrderPlans,
  getRadiologistReadingStation, hasOutstandingDiagnosticWork, interruptServiceOperationsForEmployeeDismissal,
  interruptServiceOperationsForRoomSale, planDiagnosticOrder, reconcileReadingStations, serializeGameState,
  startDiagnosticAcquisitionOperation, startDiagnosticProcessingOperation,
  type DiagnosticOrderPhase, type DiagnosticOrderPlan, type DiagnosticTimingRequest, type ServiceOperationState,
} from "../src";
import { manualLab, pending, timingFixture } from "./diagnostic-timing-fixtures";

type Fixture = ReturnType<typeof timingFixture>;
let orderSequence = 0;
const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

function plan(fixture: Fixture, request: Omit<DiagnosticTimingRequest, "orderId" | "encounterId">): DiagnosticOrderPlan {
  const quote = planDiagnosticOrder(fixture.state, { orderId: `order.execution.${orderSequence++}`, encounterId: fixture.encounter.id, ...request }, fixture.context);
  if (quote.kind !== "planned") throw new Error(quote.reason);
  return quote.plan;
}

function phase(plan: DiagnosticOrderPlan, kind: DiagnosticOrderPhase["kind"]): DiagnosticOrderPhase {
  return plan.phases.find((entry) => entry.kind === kind)!;
}

function completeDependencies(plan: DiagnosticOrderPlan, work: DiagnosticOrderPhase, tick: number): void {
  for (const id of work.dependsOn) {
    const dependency = plan.phases.find((entry) => entry.id === id)!;
    completeDependencies(plan, dependency, tick);
    dependency.status = "completed";
    dependency.startedAtTick = tick;
    dependency.completedAtTick = tick;
    dependency.remainingMinutes = 0;
  }
}

function choiceOrder(fixture: Fixture, plan: DiagnosticOrderPlan, purpose: NonNullable<ServiceOperationState["testChoiceOrder"]>["purpose"] = "terminal") {
  const source = plan.sources[0]!;
  return { version: "test-choice-order.v1" as const, purpose, caseId: fixture.encounter.frozenCase.id, nodeId: "node.fixture", questionVariantId: "variant.fixture",
    choiceId: "choice.fixture", choiceLabel: "Fixture diagnostic work", serviceId: source.serviceId!, routeId: source.routeId!, routeDisplayName: source.routeDisplayName, externalRemainder: null };
}

function operation(fixture: Fixture, id: string | null): ServiceOperationState {
  expect(id).not.toBeNull();
  return fixture.state.serviceOperations.find((entry) => entry.id === id)!;
}

/** Synthetic actor arrival isolates the operation engine from staff idle policy. */
function arrive(fixture: Fixture, operation: ServiceOperationState): void {
  if (operation.path.length) {
    operation.pathIndex = operation.path.length - 1;
    operation.location = { ...operation.path.at(-1)! };
    if (operation.actorKind === "encounter") fixture.state.encounters[operation.actorId]!.patientLocation = { ...operation.location };
  }
  for (const employee of fixture.state.employees) if (employee.facilityTask?.targetId === operation.id || employee.facilityTask?.kind === "cover_periop") {
    employee.pathIndex = employee.path.length - 1;
    if (employee.path.length) employee.location = { ...employee.path.at(-1)! };
  }
  const founder = fixture.state.environment.founderActivity;
  if (founder?.targetId === operation.id) {
    founder.pathIndex = founder.path.length - 1;
    fixture.state.environment.founderLocation = { ...founder.path.at(-1)! };
  }
}

function advance(fixture: Fixture, tick: number): void {
  fixture.state.facilityTick = tick;
  advanceServiceOperations(fixture.state, fixture.context);
}

function readingFixture(count = 4) {
  const fixture = timingFixture();
  fixture.state.serviceAppointmentsEnabled = false;
  fixture.addRoom("room.reading", "staff.radiologist", count);
  reconcileReadingStations(fixture.state);
  for (const reader of fixture.state.employees) {
    const post = getRadiologistReadingStation(fixture.state, reader, fixture.context)!;
    reader.location = { ...post.location };
    reader.path = [{ ...post.location }];
  }
  return fixture;
}

function startRead(fixture: Fixture, readerIndex?: number) {
  const contract = plan(fixture, { serviceId: "service.ultrasound", allowedRouteIds: ["route.ultrasound.outsourced"] });
  const work = phase(contract, "interpretation");
  completeDependencies(contract, work, fixture.state.facilityTick);
  if (readerIndex !== undefined) {
    // Four already-acquired synthetic studies retain four accepted desk choices.
    const reader = fixture.state.employees.filter((employee) => employee.staffRoleDefinitionId === "staff.radiologist")[readerIndex]!;
    const post = getRadiologistReadingStation(fixture.state, reader, fixture.context)!;
    work.resource = { roomInstanceId: post.roomInstanceId, roomDefinitionId: "room.reading", stationId: post.station.id,
      employeeIds: [reader.id], provider: null, patientAnchor: post.location, staffAnchor: post.location };
  }
  return { contract, work, job: operation(fixture, startDiagnosticProcessingOperation(fixture.state, contract, work.id, fixture.context)) };
}

describe("frozen diagnostic operation execution", () => {
  it("starts frozen acquisition now and retains the existing single fee", () => {
    const fixture = timingFixture();
    fixture.state.serviceAppointmentsEnabled = false;
    const us = fixture.addRoom("room.ultrasound", "staff.imaging_technician");
    fixture.encounter.patientLocation = { ...us.anchor };
    const contract = plan(fixture, { serviceId: "service.ultrasound", patientOrigin: us.anchor });
    const job = operation(fixture, startDiagnosticAcquisitionOperation(fixture.state, fixture.encounter, contract, null, "income.ultrasound", choiceOrder(fixture, contract), fixture.context));
    expect(job).toMatchObject({ status: "in_service", phaseStartedAtFacilityTick: 0, phaseEndsAtFacilityTick: 45, quoteFee: 120 });
    expect(job.diagnosticPhysicalWork?.phaseBindings[0]?.diagnosticPhaseId).toBe(phase(contract, "acquisition").id);
    expect(startDiagnosticAcquisitionOperation(fixture.state, fixture.encounter, contract, null, "income.ultrasound", choiceOrder(fixture, contract), fixture.context)).toBe(job.id);
    const cash = fixture.state.cash;
    advance(fixture, 45);
    expect(job.status).toBe("completed");
    expect(job.diagnosticPhysicalWork?.phaseWitnesses[0]).toMatchObject({ startedAtFacilityTick: 0, completedAtFacilityTick: 45 });
    expect(fixture.state.cash).toBe(cash + 120);
    expect(fixture.state.serviceIncomeReceipts).toHaveLength(1);
    expect(fixture.encounter.patientMovement).toBeNull();
    expect(fixture.encounter.patientLocation).toEqual(us.anchor);
    advance(fixture, 46);
    expect(fixture.state.serviceIncomeReceipts).toHaveLength(1);
  });

  it("reserves the current Examination room for a stationary bladder scan without staff or payout", () => {
    const fixture = timingFixture();
    const origin = { ...fixture.encounter.patientLocation! };
    const contract = plan(fixture, { serviceId: "service.bladder_scan" });
    const scan = phase(contract, "acquisition");
    expect(scan.resource).toMatchObject({ roomInstanceId: fixture.encounter.assignedRoomInstanceId, employeeIds: [], provider: null, patientAnchor: origin });
    expect(scan.forecast.walkingMinutes).toBe(0);
    const cash = fixture.state.cash;
    const job = operation(fixture, startDiagnosticAcquisitionOperation(fixture.state, fixture.encounter, contract, null, null, choiceOrder(fixture, contract), fixture.context));
    expect(job).toMatchObject({ status: "in_service", phaseEndsAtFacilityTick: 5, quoteFee: 0, reservedRoomInstanceIds: [fixture.encounter.assignedRoomInstanceId] });
    advance(fixture, 5);
    expect(job.status).toBe("completed");
    expect(fixture.encounter.patientLocation).toEqual(origin);
    expect(fixture.state.cash).toBe(cash);
    expect(fixture.state.serviceIncomeReceipts).toEqual([]);
    fixture.state.rooms = fixture.state.rooms.filter((room) => room.roomDefinitionId !== "room.examination");
    const outside = plan(fixture, { serviceId: "service.bladder_scan" });
    expect(phase(outside, "acquisition")).toMatchObject({ mode: "external", durationMinutes: 30, requirement: null });
  });

  it("freezes acquisition income and an existing fee override independently of later factory lookup", () => {
    const fixture = timingFixture();
    fixture.state.serviceAppointmentsEnabled = false;
    const us = fixture.addRoom("room.ultrasound", "staff.imaging_technician");
    fixture.encounter.patientLocation = { ...us.anchor };
    const contract = plan(fixture, { serviceId: "service.ultrasound", patientOrigin: us.anchor });
    expect(contract.sources[0]).toMatchObject({ incomeLineId: "income.ultrasound", quoteFee: 120 });
    // An existing accepted component may freeze an explicit quoted fee override.
    delete contract.sources[0]!.roomUpgradeRevenue;
    contract.sources[0]!.quoteFee = 37;
    fixture.encounter.pendingResult = pending(contract);
    const saved = deserializeGameState(serializeGameState(fixture.state), fixture.context).encounters[fixture.encounter.id]!.pendingResult!.diagnosticTiming!;
    expect(saved.sources[0]!.quoteFee).toBe(37);
    const cash = fixture.state.cash;
    const job = operation(fixture, startDiagnosticAcquisitionOperation(fixture.state, fixture.encounter, saved, null, "income.collection", choiceOrder(fixture, saved), fixture.context));
    expect(job).toMatchObject({ incomeLineId: "income.ultrasound", quoteFee: 37 });
    advance(fixture, 45);
    expect(fixture.state.cash).toBe(cash + 37);
    expect(fixture.state.serviceIncomeReceipts[0]).toMatchObject({ incomeLineId: "income.ultrasound", grossAmount: 37 });
    const older = clone(contract);
    delete older.sources[0]!.incomeLineId;
    delete older.sources[0]!.quoteFee;
    delete older.sources[0]!.roomUpgradeRevenue;
    fixture.encounter.pendingResult = pending(older);
    expect(deserializeGameState(serializeGameState(fixture.state), fixture.context).encounters[fixture.encounter.id]!.pendingResult!.diagnosticTiming!.sources[0]?.incomeLineId).toBeUndefined();
    for (const invalid of [-1, Number.POSITIVE_INFINITY]) {
      fixture.encounter.pendingResult = pending(clone(contract));
      fixture.encounter.pendingResult.diagnosticTiming!.sources[0]!.quoteFee = invalid;
      expect(() => deserializeGameState(serializeGameState(fixture.state), fixture.context)).toThrow(/diagnostic/i);
    }
  });

  it.each([
    ["service.anoscopy", "room.minor_procedure", "income.procedure.anoscopy", 15, 200],
    ["service.thyroid_fna", "room.ultrasound", "income.procedure.ultrasound_guided_thyroid_fna", 60, 150],
    ["service.breast_core_needle_biopsy", "room.ultrasound", "income.procedure.image_guided_breast_core_biopsy", 60, 150],
  ] as const)("executes %s using its frozen physical phases and existing fee-only income row", (serviceId, roomId, incomeLineId, duration, fee) => {
    const fixture = timingFixture();
    fixture.state.serviceAppointmentsEnabled = false;
    const room = fixture.addRoom(roomId, roomId === "room.ultrasound" ? "staff.imaging_technician" : undefined);
    fixture.encounter.patientLocation = { ...room.anchor };
    fixture.state.environment.founderLocation = { ...room.anchor };
    const contract = plan(fixture, { serviceId, patientOrigin: room.anchor });
    expect(contract.sources[0]).toMatchObject({ incomeLineId, quoteFee: fee });
    const job = operation(fixture, startDiagnosticAcquisitionOperation(fixture.state, fixture.encounter, contract, null, incomeLineId, choiceOrder(fixture, contract), fixture.context));
    expect(job).toMatchObject({ incomeLineId, status: "in_service", phaseEndsAtFacilityTick: duration, quoteFee: fee });
    const restored = deserializeGameState(serializeGameState(fixture.state), fixture.context);
    expect(restored.serviceOperations[0]?.diagnosticPhysicalWork).toEqual(job.diagnosticPhysicalWork);
    advance(fixture, duration);
    expect(job.status).toBe("completed");
    expect(fixture.state.serviceIncomeReceipts).toEqual([expect.objectContaining({ incomeLineId, grossAmount: fee })]);
  });

  it("runs four reading desks concurrently and serializes a fifth study on its frozen desk", () => {
    const fixture = readingFixture();
    const cash = fixture.state.cash;
    const xp = fixture.state.clinicalXp;
    const appliedUses = clone(fixture.state.levelThreeMaintenanceAppliedUseKeys);
    const jobs = Array.from({ length: 4 }, (_, index) => startRead(fixture, index).job);
    expect(jobs.map((job) => ({ status: job.status, ends: job.phaseEndsAtFacilityTick, resource: job.diagnosticPhaseWork!.resource?.stationId }))).toEqual([
      { status: "in_service", ends: 5, resource: "northwest" }, { status: "in_service", ends: 5, resource: "northeast" },
      { status: "in_service", ends: 5, resource: "southeast" }, { status: "in_service", ends: 5, resource: "southwest" },
    ]);
    expect(new Set(jobs.map((job) => job.diagnosticPhaseWork!.resource!.stationId)).size).toBe(4);
    const fifth = startRead(fixture, 0).job;
    expect(fifth.status).toBe("waiting_for_resources");
    expect(fifth.diagnosticPhaseWork!.resource?.stationId).toBe(jobs[0]!.diagnosticPhaseWork!.resource?.stationId);
    advance(fixture, 5);
    expect(jobs.every((job) => job.status === "completed")).toBe(true);
    expect(fifth).toMatchObject({ status: "in_service", phaseStartedAtFacilityTick: 5, phaseEndsAtFacilityTick: 10 });
    advance(fixture, 10);
    expect(fifth.status).toBe("completed");
    expect(fixture.state.cash).toBe(cash + 25);
    expect(fixture.state.clinicalXp).toBe(xp);
    expect(fixture.state.levelThreeMaintenanceAppliedUseKeys).toEqual(appliedUses);
    expect(fixture.state.serviceIncomeReceipts.filter(receipt => receipt.incomeLineId === "income.radiologist_in_house_read")).toHaveLength(5);
    expect(jobs.every((job) => job.actorId === fixture.encounter.id && job.quoteFee === 0)).toBe(true);
  });

  it("a legacy whole-room read blocks every new desk without a processing timeout", () => {
    const fixture = readingFixture();
    const first = startRead(fixture).job;
    const old = clone(first);
    old.id = "read.legacy";
    old.actorId = "read.legacy";
    delete old.diagnosticPhaseWork;
    old.quoteFee = 40;
    old.phaseEndsAtFacilityTick = 100;
    old.frozenOperationPhases![0]!.durationMinutes = 100;
    fixture.state.serviceOperations = [old];
    const reader = fixture.state.employees.find((employee) => employee.id === old.reservedEmployeeIds[0])!;
    reader.facilityTask!.targetId = old.id;
    const queued = startRead(fixture).job;
    advance(fixture, 75);
    expect(queued).toMatchObject({ status: "waiting_for_resources", cancelledAtFacilityTick: null });
    advance(fixture, 100);
    arrive(fixture, queued);
    advance(fixture, 100);
    expect(queued).toMatchObject({ status: "in_service", phaseStartedAtFacilityTick: 100, phaseEndsAtFacilityTick: 105 });
    advance(fixture, 105);
    expect(fixture.state.serviceIncomeReceipts.map((receipt) => receipt.grossAmount)).toEqual([40, 5]);
  });

  it("shares the existing paid manual Lab calendar and never bills the diagnostic child", () => {
    const fixture = timingFixture();
    fixture.state.serviceAppointmentsEnabled = false;
    fixture.addRoom("room.phlebotomy", "staff.phlebotomist");
    fixture.addRoom("room.laboratory", "staff.laboratory_technician");
    const manual = manualLab(fixture.state);
    fixture.state.serviceOperations.push(manual);
    const tech = fixture.state.employees.find((employee) => employee.id === manual.reservedEmployeeIds[0])!;
    tech.facilityTask = { kind: "perform_service", targetId: manual.id, startedAtFacilityTick: 0, workMinutesRemaining: Number.MAX_SAFE_INTEGER };
    const contract = plan(fixture, { serviceId: "service.basic_labs" });
    const work = phase(contract, "laboratory_processing");
    expect(work.forecast.startsAtTick).toBe(60);
    completeDependencies(contract, work, 15);
    const cash = fixture.state.cash;
    const job = operation(fixture, startDiagnosticProcessingOperation(fixture.state, contract, work.id, fixture.context));
    expect(job.status).toBe("waiting_for_resources");
    advance(fixture, 60);
    expect(job).toMatchObject({ status: "in_service", phaseStartedAtFacilityTick: 60, phaseEndsAtFacilityTick: 75 });
    advance(fixture, 75);
    expect(fixture.state.cash).toBe(cash + 80);
    expect(fixture.state.serviceIncomeReceipts.map((receipt) => receipt.grossAmount)).toEqual([80]);
    expect(job.diagnosticPhaseWork?.remainingMinutes).toBe(0);
  });

  it("preserves three remaining read minutes after dismissal and resumes on compatible capacity", () => {
    const fixture = readingFixture(2);
    const { contract, work, job } = startRead(fixture);
    advance(fixture, 2);
    expect(job.diagnosticPhaseWork?.remainingMinutes).toBe(5);
    const lostReader = job.reservedEmployeeIds[0]!;
    interruptServiceOperationsForEmployeeDismissal(fixture.state, new Set([lostReader]));
    fixture.state.employees = fixture.state.employees.filter((employee) => employee.id !== lostReader);
    expect(job).toMatchObject({ status: "waiting_for_resources", phaseStartedAtFacilityTick: null, diagnosticPhaseWork: { remainingMinutes: 3, resource: null } });
    advance(fixture, 2);
    expect(job).toMatchObject({ status: "in_service", phaseStartedAtFacilityTick: 2, phaseEndsAtFacilityTick: 5 });
    expect(job.reservedEmployeeIds).not.toContain(lostReader);
    // Neither a future balance change nor the stale quote can restart the work.
    work.durationMinutes = 99;
    contract.resultReady.forecastAtTick = 999;
    advance(fixture, 5);
    expect(job.status).toBe("completed");
    expect(job.frozenOperationPhases![0]!.durationMinutes).toBe(5);
  });

  it("holds a lost Lab job indefinitely and resumes its frozen remainder after the room returns", () => {
    const fixture = timingFixture();
    fixture.state.serviceAppointmentsEnabled = false;
    fixture.addRoom("room.phlebotomy", "staff.phlebotomist");
    const lab = fixture.addRoom("room.laboratory", "staff.laboratory_technician");
    const contract = plan(fixture, { serviceId: "service.basic_labs" });
    const work = phase(contract, "laboratory_processing");
    completeDependencies(contract, work, 0);
    const job = operation(fixture, startDiagnosticProcessingOperation(fixture.state, contract, work.id, fixture.context));
    advance(fixture, 4);
    interruptServiceOperationsForRoomSale(fixture.state, lab.room.id, lab.room.roomDefinitionId, fixture.context);
    fixture.state.rooms = fixture.state.rooms.filter((room) => room.id !== lab.room.id);
    expect(job.diagnosticPhaseWork?.remainingMinutes).toBe(11);
    advance(fixture, 100);
    expect(job.status).toBe("waiting_for_resources");
    fixture.state.rooms.push(lab.room);
    advance(fixture, 100);
    expect(job).toMatchObject({ status: "in_service", phaseEndsAtFacilityTick: 111 });
    advance(fixture, 111);
    expect(job.status).toBe("completed");
  });

  it("keeps completed physical work and the actual remaining segment when acquisition staff are lost", () => {
    const fixture = timingFixture();
    fixture.state.serviceAppointmentsEnabled = false;
    const us = fixture.addRoom("room.ultrasound", "staff.imaging_technician");
    fixture.encounter.patientLocation = { ...us.anchor };
    const contract = plan(fixture, { serviceId: "service.ultrasound", patientOrigin: us.anchor });
    const job = operation(fixture, startDiagnosticAcquisitionOperation(fixture.state, fixture.encounter, contract, null, "income.ultrasound", choiceOrder(fixture, contract), fixture.context));
    const technician = clone(fixture.state.employees[0]!);
    advance(fixture, 10);
    interruptServiceOperationsForEmployeeDismissal(fixture.state, new Set([technician.id]));
    fixture.state.employees = [];
    advance(fixture, 60);
    expect(job).toMatchObject({ status: "waiting_for_resources", cancelledAtFacilityTick: null, diagnosticPhysicalWork: { remainingPhaseMinutes: 35 } });
    technician.id = "technician.replacement";
    technician.facilityTask = null;
    fixture.state.employees.push(technician);
    advance(fixture, 60);
    expect(job).toMatchObject({ status: "in_service", phaseStartedAtFacilityTick: 60, phaseEndsAtFacilityTick: 95 });
    expect(job.diagnosticPhysicalWork?.phaseWitnesses[0]?.startedAtFacilityTick).toBe(0);
    expect(job.diagnosticPhysicalWork?.phaseBindings[0]?.resource?.employeeIds).toEqual([technician.id]);
    advance(fixture, 95);
    expect(job.diagnosticPhysicalWork?.phaseWitnesses[0]?.completedAtFacilityTick).toBe(95);
    expect(job.status).toBe("completed");
    expect(fixture.state.serviceIncomeReceipts).toHaveLength(1);
    expect(deserializeGameState(serializeGameState(fixture.state), fixture.context).serviceOperations[0]?.diagnosticPhysicalWork).toEqual(job.diagnosticPhysicalWork);
  });

  it("honors an authored external capability gate rather than quoting an unauthorized fallback", () => {
    const fixture = timingFixture();
    const service = fixture.context.balanceRelease.services.find((entry) => entry.id === "service.ultrasound")!;
    for (const route of service.routes) route.requiredCapabilityId = "capability.fixture.unavailable";
    const quote = planDiagnosticOrder(fixture.state, { orderId: "order.gated", encounterId: fixture.encounter.id,
      serviceId: service.id, timingProfileId: "timing.test.ultrasound" }, fixture.context);
    expect(quote).toMatchObject({ kind: "unavailable", reason: "no_valid_route" });
    expect(quote.kind === "unavailable" && quote.estimateMinutes).toBeGreaterThan(0);
  });

  it("witnesses the procedure before recovery, starts pathology then, and retains the bed until physical clearance", () => {
    const fixture = timingFixture();
    fixture.state.serviceAppointmentsEnabled = false;
    fixture.addRoom("room.endoscopy", "staff.endoscopy_nurse");
    const periop = fixture.addRoom("room.periop_recovery", "staff.periop_nurse");
    fixture.addRoom("room.laboratory", "staff.laboratory_technician");
    fixture.encounter.patientLocation = { ...periop.anchor };
    const contract = plan(fixture, { serviceId: "service.colonoscopy", patientOrigin: periop.anchor, specimenCollected: true, resultKind: "visual" });
    const job = operation(fixture, startDiagnosticAcquisitionOperation(fixture.state, fixture.encounter, contract, null, "income.endoscopy", choiceOrder(fixture, contract), fixture.context));
    arrive(fixture, job);
    advance(fixture, 0);
    // Preparation starts on patient arrival, then dispatches its bedside nurse.
    arrive(fixture, job);
    advance(fixture, 0);
    expect(job.phaseEndsAtFacilityTick).toBe(30);
    advance(fixture, 30);
    arrive(fixture, job);
    advance(fixture, 31);
    expect(job.phaseIndex).toBe(1);
    expect(job.phaseEndsAtFacilityTick).toBe(76);
    advance(fixture, 76);
    const procedureWitness = job.diagnosticPhysicalWork!.phaseWitnesses[1]!;
    expect(procedureWitness.completedAtFacilityTick).toBe(76);
    expect(job.diagnosticPhysicalWork!.phaseWitnesses[2]!.completedAtFacilityTick).toBeNull();
    const specimen = phase(contract, "procedure");
    completeDependencies(contract, specimen, 30);
    specimen.status = "completed"; specimen.startedAtTick = 31; specimen.completedAtTick = 76; specimen.remainingMinutes = 0;
    const pathology = phase(contract, "pathology");
    expect(contract.resultReady.afterPhaseIds).toEqual([specimen.id]);
    const processing = operation(fixture, startDiagnosticProcessingOperation(fixture.state, contract, pathology.id, fixture.context));
    expect(processing).toMatchObject({ status: "in_service", phaseStartedAtFacilityTick: 76, phaseEndsAtFacilityTick: 106 });
    arrive(fixture, job);
    advance(fixture, 77);
    arrive(fixture, job);
    advance(fixture, 77);
    expect(job.phaseEndsAtFacilityTick).toBe(137);
    advance(fixture, 106);
    expect(processing.status).toBe("completed");
    expect(job.status).toBe("in_service");
    advance(fixture, 137);
    expect(job.status).toBe("discharging");
    expect(job.periopBedReservation).toBeDefined();
    expect(fixture.encounter.patientMovement).toBeNull();
    expect(fixture.state.serviceIncomeReceipts).toHaveLength(1);
    const movement = { kind: "returning_from_onsite_service" as const, path: [{ x: 7, y: 4 }], pathIndex: 0, lastMovedAtFacilityTick: 137, destinationRoomInstanceId: null };
    fixture.encounter.patientLocation = { x: 7, y: 4 };
    fixture.encounter.patientMovement = movement;
    advance(fixture, 138);
    expect(job.status).toBe("completed");
    expect(job.periopBedReservation).toBeUndefined();
    expect(fixture.encounter.patientMovement).toBe(movement);
    expect(fixture.state.serviceIncomeReceipts).toHaveLength(1);
  });

  it("roundtrips actual physical phase witnesses and rejects malformed marked work", () => {
    const fixture = timingFixture();
    const us = fixture.addRoom("room.ultrasound", "staff.imaging_technician");
    fixture.encounter.patientLocation = { ...us.anchor };
    const contract = plan(fixture, { serviceId: "service.ultrasound", patientOrigin: us.anchor });
    const job = operation(fixture, startDiagnosticAcquisitionOperation(fixture.state, fixture.encounter, contract, null, "income.ultrasound", choiceOrder(fixture, contract), fixture.context));
    advance(fixture, 10);
    interruptServiceOperationsForEmployeeDismissal(fixture.state, new Set(job.reservedEmployeeIds));
    const restored = deserializeGameState(serializeGameState(fixture.state), fixture.context);
    expect(restored.serviceOperations[0]!.diagnosticPhysicalWork).toEqual(job.diagnosticPhysicalWork);
    expect(restored.serviceOperations[0]!.saleTransfer?.remainingPhaseMinutes).toBe(35);
    for (const mutate of [(entry: ServiceOperationState) => { entry.phaseFlowVersion = undefined; },
      (entry: ServiceOperationState) => { entry.diagnosticPhysicalWork!.phaseWitnesses[0]!.completedAtFacilityTick = 2; },
      (entry: ServiceOperationState) => { entry.diagnosticPhysicalWork!.phaseBindings[0]!.operationPhaseId = "another.phase"; },
      (entry: ServiceOperationState) => { entry.phaseIndex = 3; }]) {
      fixture.state.serviceOperations = [clone(job)];
      mutate(fixture.state.serviceOperations[0]!);
      expect(() => deserializeGameState(serializeGameState(fixture.state), fixture.context)).toThrow(/diagnostic/i);
    }
  });

  it("retains history background work after pending overwrite while a live carrier copy wins", () => {
    const fixture = timingFixture();
    const contract = plan(fixture, { serviceId: "service.ultrasound" });
    fixture.encounter.steps[0]!.result = pending(contract);
    fixture.encounter.pendingResult = pending();
    expect(getDiagnosticOrderPlans(fixture.state)).toEqual([contract]);
    expect(hasOutstandingDiagnosticWork(contract)).toBe(true);
    const live = clone(contract);
    live.phases[0]!.status = "queued";
    fixture.encounter.pendingResult = pending(live);
    expect(getDiagnosticOrderPlans(fixture.state)).toEqual([live]);
  });

  it("keeps a single opaque outside protocol and wraps an actual patient-visit remainder in walking legs", () => {
    const fixture = timingFixture();
    const frontDesk = { ...fixture.state.environment.founderLocation };
    const protocol = plan(fixture, { retainedExternalProtocol: { timingProfileId: "timing.test.twenty_four_hour_protocol", mode: "external_patient_visit" }, patientReturnLocation: frontDesk });
    expect(protocol.execution).toBe("supported");
    expect(protocol.phases.filter((entry) => entry.durationMinutes > 0).map((entry) => entry.durationMinutes)).toEqual([1440]);
    expect(protocol.sources[0]).toMatchObject({ kind: "retained_profile", serviceId: null, routeId: null });
    expect(protocol.phases.at(-1)?.forecast.patientPath.at(-1)).toEqual(frontDesk);
    const us = fixture.addRoom("room.ultrasound", "staff.imaging_technician");
    const mixed = plan(fixture, { serviceId: "service.ultrasound", patientOrigin: us.anchor, patientReturnLocation: frontDesk,
      remainder: { label: "Existing outside protocol", durationMinutes: 120, mode: "external_patient_visit", startsAfter: "care_completion" } });
    const remainder = mixed.phases.find((entry) => entry.id === "diagnostic.remainder")!;
    const departure = mixed.phases.find((entry) => entry.id === "diagnostic.remainder.patient_departure")!;
    expect(remainder.dependsOn).toEqual([departure.id]);
    expect(departure.forecast.patientPath[0]).toEqual(us.anchor);
    expect(departure.forecast.patientPath.at(-1)!.x).toBe(-2);
    expect(mixed.phases.at(-1)?.forecast.patientPath.at(-1)).toEqual(frontDesk);
    expect(mixed.careComplete.afterPhaseIds).toContain("diagnostic.remainder.patient_return");
    expect(mixed.careComplete.forecastAtTick).toBeGreaterThan(remainder.forecast.endsAtTick);
  });

  it("feeds a downstream forecast from the actual procedure witness instead of its stale quote", () => {
    const fixture = timingFixture();
    const us = fixture.addRoom("room.ultrasound", "staff.imaging_technician");
    fixture.encounter.patientLocation = { ...us.anchor };
    const contract = plan(fixture, { serviceId: "service.ultrasound", patientOrigin: us.anchor });
    const job = operation(fixture, startDiagnosticAcquisitionOperation(fixture.state, fixture.encounter, contract, null, "income.ultrasound", choiceOrder(fixture, contract), fixture.context));
    const acquired = phase(contract, "acquisition");
    acquired.serviceOperationId = job.id;
    job.phaseEndsAtFacilityTick = 80;
    advance(fixture, 80);
    fixture.state.facilityTick = 90;
    const forecast = forecastDiagnosticOrderPlan(fixture.state, contract, fixture.context);
    expect(phase(forecast.plan, "acquisition").forecast.endsAtTick).toBe(80);
    expect(phase(forecast.plan, "interpretation").forecast.readyAtTick).toBe(90);
    expect(forecast.blockedPhaseIds).toEqual([]);
  });
});
