import { describe, expect, it } from "vitest";
import { DIAGNOSTIC_TIMING_TABLE, getServiceIncomeLine } from "@gamify-surgery/balance-config";
import {
  advanceEmployeeMovement, advanceEmployeeTraining, advanceLevelThreeSupport, advanceRetailOperations, advanceServiceOperations,
  authorizeRetailOrder, deserializeGameState, forecastDiagnosticOrderPlan, gameReducer, getAnswerChoiceServicePreview,
  getDiagnosticOrderPlans, getDiagnosticOrderTiming, getEmployeeRoleTrainingPercent, getEmployeeTrainingAvailability,
  getEmployeeTrainingHomeLocation, getEmployeeTrainingWorkMinutes, getNewPeriopServiceOperationPhases, getPendingResultEta,
  getServiceOperationTrainingMinutes, interruptServiceOperationsForEmployeeDismissal, normalizeDiagnosticOrderPlan,
  planDiagnosticOrder, PROTOTYPE_DOMAIN_CONTEXT, requestEmployeeTraining, requeueDiagnosticPhase, serializeGameState,
  selectWaitingDestinationForTesting,
  startDiagnosticAcquisitionOperation, startDiagnosticProcessingOperation, startRetailPurchase, startServiceOperation,
  type DiagnosticOrderPlan, type DiagnosticTimingRequest, type DomainContext, type GameState, type ServiceOperationState,
} from "../src";
import { addTrainingEmployee, advanceTrainingMinutes, reachTrainingStage, trainingFixture } from "./employee-training-fixtures";
import { pending, timingFixture } from "./diagnostic-timing-fixtures";

type Fixture = ReturnType<typeof timingFixture>;
let sequence = 0;
function controlled(fixture: Fixture): void {
  const state = fixture.state;
  state.paused = false;
  state.cash = 10_000; state.cashCents = 1_000_000;
  state.serviceAppointmentsEnabled = false;
  state.nextRoutineArrivalTick = state.nextFinancialPostingTick = state.nextExternalRetailOpportunityTick = state.nextEmployeeDiscussionTick = Number.MAX_SAFE_INTEGER;
  state.environment.nextLitterSpawnTick = state.environment.nextWaterCoolerDrainTick = Number.MAX_SAFE_INTEGER;
  state.environment.waterCoolerFillPercent = 100;
  state.environment.pendingFounderConsult = null;
  for (const employee of state.employees) employee.morale = 100;
}
function tick(state: GameState, context: DomainContext = PROTOTYPE_DOMAIN_CONTEXT, minutes = 1): GameState {
  for (let index = 0; index < minutes; index++) state = gameReducer(state, { type: "ADVANCE_TICK", operationId: `training.effect.tick.${sequence++}` }, context);
  return state;
}
function quote(fixture: Fixture, request: Partial<DiagnosticTimingRequest> = {}): DiagnosticOrderPlan {
  const result = planDiagnosticOrder(fixture.state, { orderId: `training.effect.order.${sequence++}`, encounterId: fixture.encounter.id, serviceId: "service.basic_labs", ...request }, fixture.context);
  if (result.kind !== "planned") throw new Error(result.reason);
  expect(normalizeDiagnosticOrderPlan(result.plan)).toEqual(result.plan);
  return result.plan;
}
const phase = (plan: DiagnosticOrderPlan, kind: string) => plan.phases.find((entry) => entry.kind === kind)!;
function choiceOrder(fixture: Fixture, plan: DiagnosticOrderPlan): NonNullable<ServiceOperationState["testChoiceOrder"]> {
  const source = plan.sources[0]!;
  return { version: "test-choice-order.v1", purpose: "terminal", caseId: fixture.encounter.frozenCase.id, nodeId: "node.training", questionVariantId: "variant.training",
    choiceId: "choice.training", choiceLabel: "Training fixture", serviceId: source.serviceId!, routeId: source.routeId!, routeDisplayName: source.routeDisplayName, externalRemainder: null };
}
function arrive(fixture: Fixture, job: ServiceOperationState): void {
  if (job.path.length) { job.pathIndex = job.path.length - 1; job.location = { ...job.path.at(-1)! }; }
  for (const employee of fixture.state.employees) if (employee.facilityTask?.targetId === job.id || employee.facilityTask?.kind === "cover_periop") {
    employee.pathIndex = employee.path.length - 1;
    if (employee.path.length) employee.location = { ...employee.path.at(-1)! };
  }
  const founder = fixture.state.environment.founderActivity;
  if (founder?.targetId === job.id) { founder.pathIndex = founder.path.length - 1; fixture.state.environment.founderLocation = { ...founder.path.at(-1)! }; }
  advanceServiceOperations(fixture.state, fixture.context);
}
function startWaiting(fixture: Fixture, lineId: string): ServiceOperationState {
  const id = startServiceOperation(fixture.state, lineId, "visitor", fixture.context);
  expect(id).not.toBeNull();
  const job = fixture.state.serviceOperations.find((entry) => entry.id === id)!;
  job.status = "waiting_for_resources";
  job.location = { ...fixture.encounter.patientLocation! }; job.path = [{ ...job.location }]; job.pathIndex = 0;
  return job;
}
function endoscopyFixture(withProvider = true) {
  const fixture = timingFixture(); controlled(fixture);
  const recovery = fixture.addRoom("room.periop_recovery", "staff.periop_nurse");
  const endoscopy = fixture.addRoom("room.endoscopy", "staff.endoscopy_nurse");
  for (const employee of fixture.state.employees) employee.trainingLevel = 5;
  if (withProvider) {
    const provider = { ...fixture.state.employees[1]!, id: "employee.endoscopist", staffRoleDefinitionId: "staff.endoscopist", location: { ...endoscopy.anchor }, path: [{ ...endoscopy.anchor }], facilityTask: null };
    fixture.state.employees.push(provider);
  }
  fixture.encounter.patientLocation = { ...recovery.anchor };
  fixture.state.environment.founderLocation = { ...endoscopy.anchor };
  return fixture;
}
function readyLabFixture(caseId = "case.fhh.suggestive-results-confirmation"): Fixture {
  const fixture = timingFixture(); controlled(fixture);
  const encounter = fixture.encounter;
  encounter.frozenCase = structuredClone(fixture.context.clinicalRelease.cases.find((entry) => entry.id === caseId)!);
  encounter.arrivalClass = "routine"; encounter.checkInStatus = "checked_in"; encounter.lifecycle = "active_action_required";
  encounter.currentNodeIndex = 0; encounter.terminalFeedback = null;
  encounter.steps = encounter.frozenCase.decisionNodes.map((node, index) => ({ nodeIndex: index, decisionNodeId: node.id, questionVariantId: node.questionVariantId,
    primaryConceptId: node.primaryConceptId, status: index === 0 ? "action_required" : "locked", answer: null, result: null }));
  fixture.state.openChartEncounterId = encounter.id;
  return fixture;
}
function acceptLab(fixture: Fixture): GameState {
  const node = fixture.encounter.frozenCase.decisionNodes[0]!;
  let state = gameReducer(fixture.state, { type: "SUBMIT_ANSWER", operationId: `training.answer.${sequence++}`, encounterId: fixture.encounter.id,
    decisionNodeId: node.id, answerChoiceId: node.answerChoices.find((choice) => choice.isCorrect)!.id }, fixture.context);
  if (state.encounters[fixture.encounter.id]!.steps[0]!.status === "feedback_pending") state = gameReducer(state,
    { type: "ACKNOWLEDGE_DECISION_FEEDBACK", operationId: `training.enact.${sequence++}`, encounterId: fixture.encounter.id, decisionNodeId: node.id }, fixture.context);
  expect(getDiagnosticOrderPlans(state)).toHaveLength(1);
  return state;
}
function placeInWaiting(fixture: Fixture): void {
  const destination = selectWaitingDestinationForTesting(fixture.state, fixture.context, fixture.encounter.id)!;
  expect(destination.reservation).not.toBeNull();
  fixture.encounter.patientLocation = { ...destination.reservation!.location };
  fixture.encounter.waitingDestination = destination.reservation;
  fixture.encounter.patientMovement = null;
}
function completeDependencies(plan: DiagnosticOrderPlan, workId: string, atTick: number): void {
  for (const id of plan.phases.find((entry) => entry.id === workId)!.dependsOn) {
    completeDependencies(plan, id, atTick);
    const dependency = plan.phases.find((entry) => entry.id === id)!;
    dependency.status = "completed"; dependency.startedAtTick = atTick; dependency.completedAtTick = atTick; dependency.remainingMinutes = 0;
  }
}

describe("role-average employee training benefits", () => {
  it("averages hired identities including away staff, excludes departures, and retains fractional skill", () => {
    const state = trainingFixture();
    const expert = addTrainingEmployee(state, "expert"); expert.trainingLevel = 5;
    addTrainingEmployee(state, "baseline");
    expert.training = { version: 1, requestSequence: 0, requestedAtFacilityTick: 0, earliestDepartureAtFacilityTick: 0, paidAmount: 300,
      targetLevel: 5, stage: "returning", roomInstanceId: null, placeId: null, remainingMinutes: 0, startedAtFacilityTick: 0, completedAtFacilityTick: 60, lastProgressAtFacilityTick: 60 };
    (state.departingEmployees ??= []).push({ ...expert, id: "departing", dismissedAtFacilityTick: 0 });
    expect(getEmployeeRoleTrainingPercent(state, "staff.receptionist")).toBe(20);
    addTrainingEmployee(state, "third");
    expect(getEmployeeRoleTrainingPercent(state, "staff.receptionist")).toBe(40 / 3);
    expect(getEmployeeTrainingWorkMinutes(15, 40 / 3)).toBe(13);
    expect(getEmployeeTrainingWorkMinutes(0, 40)).toBe(0);
    expect(getEmployeeTrainingWorkMinutes(1, 40)).toBe(1);
    expect(getEmployeeRoleTrainingPercent(state, "staff.surgeon")).toBe(0);
  });

  it("reduces new image acquisition and local interpretation while preserving equipment-only work and outside processing", () => {
    const fixture = timingFixture(); controlled(fixture);
    const us = fixture.addRoom("room.ultrasound", "staff.imaging_technician");
    fixture.addRoom("room.reading", "staff.radiologist");
    fixture.state.employees.forEach((employee) => employee.trainingLevel = 5);
    const plan = quote(fixture, { serviceId: "service.ultrasound", patientOrigin: us.anchor });
    expect(phase(plan, "acquisition").durationMinutes).toBe(27);
    expect(phase(plan, "interpretation").durationMinutes).toBe(3);
    const equipmentOnly = timingFixture(); controlled(equipmentOnly);
    expect(phase(quote(equipmentOnly, { serviceId: "service.bladder_scan" }), "acquisition").durationMinutes).toBe(5);
    const outside = quote(fixture, { serviceId: "service.ultrasound", allowedRouteIds: ["route.ultrasound.outsourced"], allowOnsiteEquivalents: false });
    expect(phase(outside, "acquisition")).toMatchObject({ mode: "external", durationMinutes: 120 });
    fixture.state.employees = fixture.state.employees.filter((employee) => employee.staffRoleDefinitionId !== "staff.radiologist");
    expect(phase(quote(fixture, { serviceId: "service.ultrasound", patientOrigin: us.anchor }), "interpretation")).toMatchObject({ mode: "external", durationMinutes: 30 });
  });

  it("uses collector and processor category means for new work and lab skill for pathology", () => {
    const fixture = timingFixture(); controlled(fixture);
    const collector = fixture.addRoom("room.phlebotomy", "staff.phlebotomist", 2);
    fixture.addRoom("room.laboratory", "staff.laboratory_technician");
    fixture.state.employees[0]!.trainingLevel = 5;
    fixture.state.employees[2]!.trainingLevel = 5;
    const labs = quote(fixture, { patientOrigin: collector.anchor });
    expect(phase(labs, "collection").durationMinutes).toBe(12);
    expect(phase(labs, "laboratory_processing").durationMinutes).toBe(9);
    const biopsy = fixture.addRoom("room.minor_procedure");
    fixture.state.environment.founderLocation = { ...biopsy.anchor };
    const tissue = quote(fixture, { serviceId: "service.skin_excisional_biopsy", patientOrigin: biopsy.anchor });
    expect(phase(tissue, "pathology")).toMatchObject({ mode: "local", durationMinutes: Math.ceil(DIAGNOSTIC_TIMING_TABLE.pathology.onsiteProcessingMinutes * 0.6) });
  });

  it("freezes diagnostic effective durations through factories, reforecast, retries, saves and later level changes", () => {
    const fixture = timingFixture(); controlled(fixture);
    const us = fixture.addRoom("room.ultrasound", "staff.imaging_technician");
    fixture.addRoom("room.reading", "staff.radiologist");
    fixture.state.employees.forEach((employee) => employee.trainingLevel = 5);
    const plan = quote(fixture, { serviceId: "service.ultrasound", patientOrigin: us.anchor });
    fixture.encounter.patientLocation = { ...us.anchor };
    fixture.encounter.pendingResult = pending(plan);
    const id = startDiagnosticAcquisitionOperation(fixture.state, fixture.encounter, plan, null, "income.ultrasound", choiceOrder(fixture, plan), fixture.context)!;
    const job = fixture.state.serviceOperations.find((entry) => entry.id === id)!;
    expect(job.trainingTiming).toBeUndefined();
    expect(job.frozenOperationPhases![0]!.durationMinutes).toBe(27);
    expect(job.phaseEndsAtFacilityTick).toBe(27);
    fixture.state.employees.forEach((employee) => employee.trainingLevel = 1);
    const durations = plan.phases.map((entry) => entry.durationMinutes);
    const retried = requeueDiagnosticPhase(plan, phase(plan, "interpretation").id, 0);
    for (let index = 0; index < 3; index++) expect(forecastDiagnosticOrderPlan(fixture.state, retried, fixture.context).plan.phases.map((entry) => entry.durationMinutes)).toEqual(durations);
    const restored = deserializeGameState(serializeGameState(fixture.state), fixture.context);
    expect(restored.serviceOperations.find((entry) => entry.id === id)!.phaseEndsAtFacilityTick).toBe(27);
    expect(restored.encounters[fixture.encounter.id]!.pendingResult!.diagnosticTiming!.phases.map((entry) => entry.durationMinutes)).toEqual(durations);
    const read = phase(plan, "interpretation");
    phase(plan, "acquisition").status = "completed"; phase(plan, "acquisition").remainingMinutes = 0; phase(plan, "acquisition").completedAtTick = 27;
    fixture.state.facilityTick = 27; advanceServiceOperations(fixture.state, fixture.context);
    const readId = startDiagnosticProcessingOperation(fixture.state, plan, read.id, fixture.context)!;
    const readJob = fixture.state.serviceOperations.find((entry) => entry.id === readId)!;
    expect(readJob.frozenOperationPhases![0]!.durationMinutes).toBe(3);
    expect(readJob.trainingTiming).toBeUndefined();
    expect(phase(quote(fixture, { serviceId: "service.ultrasound", patientOrigin: us.anchor }), "acquisition").durationMinutes).toBe(45);
  });

  it.each([false, true])("binds frozen endoscopy timing once with an employee provider=%s and leaves recovery60", (employeeProvider) => {
    const fixture = endoscopyFixture();
    const provider = fixture.state.employees.find((employee) => employee.staffRoleDefinitionId === "staff.endoscopist")!;
    if (!employeeProvider) provider.facilityTask = { kind: "take_break", targetId: "busy.fixture", startedAtFacilityTick: 0, workMinutesRemaining: 30 };
    const job = startWaiting(fixture, "income.endoscopy");
    const baseline = getNewPeriopServiceOperationPhases("income.endoscopy")!;
    expect(job.frozenOperationPhases).toEqual(baseline);
    advanceServiceOperations(fixture.state, fixture.context); arrive(fixture, job);
    expect(job.frozenOperationPhases![0]!.durationMinutes).toBe(18);
    expect(job.phaseEndsAtFacilityTick! - job.phaseStartedAtFacilityTick!).toBe(18);
    const restored = deserializeGameState(serializeGameState(fixture.state), fixture.context);
    expect(restored.serviceOperations.find((entry) => entry.id === job.id)).toMatchObject({ phaseFlowVersion: 1, periopBedFlowVersion: 1 });
    expect(restored.serviceOperations.find((entry) => entry.id === job.id)!.trainingTiming).toEqual(job.trainingTiming);
    fixture.state.employees.forEach((employee) => employee.trainingLevel = 1);
    fixture.state.facilityTick = job.phaseEndsAtFacilityTick!;
    advanceServiceOperations(fixture.state, fixture.context); arrive(fixture, job);
    if (job.status === "waiting_for_next_phase") { advanceServiceOperations(fixture.state, fixture.context); arrive(fixture, job); }
    expect(job.phaseIndex).toBe(1);
    expect(job.providerReservation?.kind).toBe(employeeProvider ? "employee" : "founder");
    expect(job.frozenOperationPhases![1]!.durationMinutes).toBe(getEmployeeTrainingWorkMinutes(baseline[1]!.durationMinutes, employeeProvider ? 40 : 20));
    expect(job.frozenOperationPhases!.find((entry) => entry.roomStationId === "periop_recovery")!.durationMinutes).toBe(60);
  });

  it("retains already-bound remaining procedure time when its trained employee is replaced by the founder", () => {
    const fixture = endoscopyFixture();
    const job = startWaiting(fixture, "income.endoscopy");
    advanceServiceOperations(fixture.state, fixture.context); arrive(fixture, job);
    fixture.state.facilityTick = job.phaseEndsAtFacilityTick!;
    advanceServiceOperations(fixture.state, fixture.context); arrive(fixture, job);
    if (job.status === "waiting_for_next_phase") { advanceServiceOperations(fixture.state, fixture.context); arrive(fixture, job); }
    const duration = job.frozenOperationPhases![1]!.durationMinutes;
    const end = job.phaseEndsAtFacilityTick!;
    fixture.state.facilityTick += 5;
    const provider = fixture.state.employees.find((employee) => employee.staffRoleDefinitionId === "staff.endoscopist")!;
    interruptServiceOperationsForEmployeeDismissal(fixture.state, new Set([provider.id]));
    fixture.state.employees = fixture.state.employees.filter((employee) => employee.id !== provider.id);
    expect(job.saleTransfer!.remainingPhaseMinutes).toBe(end - fixture.state.facilityTick);
    advanceServiceOperations(fixture.state, fixture.context); arrive(fixture, job);
    expect(job.providerReservation?.kind).toBe("founder");
    expect(job.frozenOperationPhases![1]!.durationMinutes).toBe(duration);
    expect(job.phaseEndsAtFacilityTick! - job.phaseStartedAtFacilityTick!).toBe(duration - 5);
  });

  it.each([false, true])("freezes new diagnostic team preparation/procedure alternatives with employee provider=%s", (employeeProvider) => {
    const fixture = endoscopyFixture();
    const provider = fixture.state.employees.find((employee) => employee.staffRoleDefinitionId === "staff.endoscopist")!;
    if (!employeeProvider) provider.facilityTask = { kind: "take_break", targetId: "busy.fixture", startedAtFacilityTick: 0, workMinutesRemaining: 500 };
    const plan = quote(fixture, { serviceId: "service.endoscopy" });
    expect(phase(plan, "preparation").durationMinutes).toBe(18);
    expect(phase(plan, "procedure").resource!.provider!.kind).toBe(employeeProvider ? "employee" : "founder");
    expect(phase(plan, "procedure").durationMinutes).toBe(employeeProvider ? 27 : 36);
    expect(phase(plan, "recovery").durationMinutes).toBe(60);
    fixture.state.employees.forEach((employee) => employee.trainingLevel = 1);
    expect(forecastDiagnosticOrderPlan(fixture.state, plan, fixture.context).plan.phases.map((entry) => entry.durationMinutes)).toEqual(plan.phases.map((entry) => entry.durationMinutes));
  });

  it("keeps legacy queued and active service jobs at baseline despite newly trained categories", () => {
    const fixture = endoscopyFixture();
    const job = startWaiting(fixture, "income.endoscopy"); delete job.trainingTiming;
    advanceServiceOperations(fixture.state, fixture.context); arrive(fixture, job);
    expect(job.frozenOperationPhases![0]!.durationMinutes).toBe(30);
    const saved = deserializeGameState(serializeGameState(fixture.state), fixture.context);
    expect(saved.serviceOperations.find((entry) => entry.id === job.id)!.phaseEndsAtFacilityTick).toBe(job.phaseEndsAtFacilityTick);
    expect(saved.serviceOperations.find((entry) => entry.id === job.id)!.trainingTiming).toBeUndefined();
  });

  it("averages surgeon/OR nurse categories for OR work, with founder baseline as the other alternative", () => {
    const fixture = timingFixture(); controlled(fixture);
    fixture.addRoom("room.periop_recovery", "staff.periop_nurse");
    fixture.addRoom("room.ambulatory_or", "staff.or_nurse");
    fixture.addRoom("room.surgeon_office", "staff.surgeon", 2);
    fixture.state.employees.find((employee) => employee.staffRoleDefinitionId === "staff.or_nurse")!.trainingLevel = 5;
    const surgeon = fixture.state.employees.find((employee) => employee.staffRoleDefinitionId === "staff.surgeon")!; surgeon.trainingLevel = 5;
    const job = startWaiting(fixture, "income.ambulatory_operation");
    const workIndex = job.frozenOperationPhases!.findIndex((entry) => entry.roomDefinitionId === "room.ambulatory_or");
    const base = job.frozenOperationPhases![workIndex]!.durationMinutes;
    expect(getServiceOperationTrainingMinutes(fixture.state, job, workIndex, { kind: "employee", employeeId: surgeon.id })).toBe(Math.ceil(base * 0.7));
    expect(getServiceOperationTrainingMinutes(fixture.state, job, workIndex, { kind: "founder" })).toBe(Math.ceil(base * 0.8));
    advanceServiceOperations(fixture.state, fixture.context); arrive(fixture, job);
    fixture.state.facilityTick = job.phaseEndsAtFacilityTick!; advanceServiceOperations(fixture.state, fixture.context); arrive(fixture, job);
    if (job.status === "waiting_for_next_phase") { advanceServiceOperations(fixture.state, fixture.context); arrive(fixture, job); }
    expect(job.frozenOperationPhases![workIndex]!.durationMinutes).toBe(Math.ceil(base * 0.7));
  });
});

describe("training-aware local diagnostic queues", () => {
  it("uses an available farther collector before a nearer paused trainee at initial acceptance", () => {
    const fixture = timingFixture(); controlled(fixture);
    const station = fixture.addRoom("room.phlebotomy", "staff.phlebotomist", 2); const training = fixture.addRoom("room.training"); controlled(fixture);
    const trainee = fixture.state.employees[0]!; const spare = fixture.state.employees[1]!;
    expect(requestEmployeeTraining(fixture.state, trainee.id, fixture.context).applied).toBe(true);
    for (let minute = 0; trainee.training?.stage !== "training" && minute < 60; minute++) advanceTrainingMinutes(fixture.state, 1, fixture.context);
    fixture.state.doors = fixture.state.doors.filter((door) => door.roomId !== training.room.id);
    spare.location = { ...fixture.state.environment.founderLocation }; spare.path = [{ ...spare.location }]; spare.pathIndex = 0;
    fixture.encounter.patientLocation = { ...station.anchor };
    const plan = quote(fixture, { patientOrigin: station.anchor });
    expect(phase(plan, "collection").resource!.employeeIds).toEqual([spare.id]);
    expect(forecastDiagnosticOrderPlan(fixture.state, plan, fixture.context).blockedPhaseIds).toEqual([]);
    const id = startDiagnosticAcquisitionOperation(fixture.state, fixture.encounter, plan, null, "income.phlebotomy", choiceOrder(fixture, plan), fixture.context)!;
    const job = fixture.state.serviceOperations.find((entry) => entry.id === id)!;
    expect(job.reservedEmployeeIds).toEqual([spare.id]);
    expect(trainee.facilityTask).toBeNull();
    arrive(fixture, job);
    fixture.state.facilityTick = job.phaseEndsAtFacilityTick!; advanceServiceOperations(fixture.state, fixture.context);
    expect(job.status).toBe("completed");
    expect(fixture.state.serviceIncomeReceipts).toHaveLength(1);
  });

  it.each([["room.phlebotomy", "staff.phlebotomist", "collection"], ["room.laboratory", "staff.laboratory_technician", "laboratory_processing"], ["room.reading", "staff.radiologist", "interpretation"]] as const)
    ("rebinds queued %s work to a spare after the accepted worker leaves, preserving work and saved duration", (roomId, role, kind) => {
      const fixture = timingFixture(); controlled(fixture);
      if (kind !== "collection") fixture.addRoom("room.phlebotomy", "staff.phlebotomist");
      if (kind === "interpretation") fixture.addRoom("room.ultrasound", "staff.imaging_technician");
      const station = fixture.addRoom(roomId, role, 2); const training = fixture.addRoom("room.training"); controlled(fixture);
      const employees = fixture.state.employees.filter((employee) => employee.staffRoleDefinitionId === role);
      const trainee = employees[0]!; const spare = employees[1]!; trainee.trainingLevel = 4;
      const plan = quote(fixture, { serviceId: kind === "interpretation" ? "service.ultrasound" : "service.basic_labs", patientOrigin: station.anchor });
      const work = phase(plan, kind); const acceptedMinutes = work.durationMinutes;
      expect(work.resource!.employeeIds).toEqual([trainee.id]);
      expect(requestEmployeeTraining(fixture.state, trainee.id, fixture.context).applied).toBe(true);
      advanceTrainingMinutes(fixture.state, 1, fixture.context);
      fixture.state.doors = fixture.state.doors.filter((door) => door.roomId !== training.room.id);
      const forecast = forecastDiagnosticOrderPlan(fixture.state, plan, fixture.context);
      expect(forecast.blockedPhaseIds).toEqual([]);
      expect(phase(forecast.plan, kind).forecast.employeePaths.map((entry) => entry.employeeId)).toEqual([spare.id]);
      let id: string | null;
      if (kind === "collection") {
        fixture.encounter.patientLocation = { ...station.anchor };
        id = startDiagnosticAcquisitionOperation(fixture.state, fixture.encounter, plan, null, "income.phlebotomy", choiceOrder(fixture, plan), fixture.context);
      } else {
        completeDependencies(plan, work.id, fixture.state.facilityTick);
        id = startDiagnosticProcessingOperation(fixture.state, plan, work.id, fixture.context);
      }
      expect(id).not.toBeNull();
      const job = fixture.state.serviceOperations.find((entry) => entry.id === id)!;
      expect(job.reservedEmployeeIds).toEqual([spare.id]);
      expect(job.frozenOperationPhases![0]!.durationMinutes).toBe(acceptedMinutes);
      expect(trainee.facilityTask).toBeNull();
      const restored = deserializeGameState(serializeGameState(fixture.state), fixture.context);
      expect(restored.serviceOperations.find((entry) => entry.id === id)!.frozenOperationPhases![0]!.durationMinutes).toBe(acceptedMinutes);
    });

  it("replaces a training nurse while retaining the accepted periop bed in unlinked/linked forecasts and execution", () => {
    const fixture = timingFixture(); controlled(fixture);
    const recovery = fixture.addRoom("room.periop_recovery", "staff.periop_nurse", 2);
    const endoscopy = fixture.addRoom("room.endoscopy", "staff.endoscopy_nurse");
    const training = fixture.addRoom("room.training"); controlled(fixture);
    const trainee = fixture.state.employees[0]!; const spare = fixture.state.employees[1]!;
    trainee.trainingLevel = 4; fixture.state.employees[2]!.trainingLevel = 5;
    fixture.state.environment.founderLocation = { ...endoscopy.anchor };
    const acceptedBed = { x: recovery.room.x + 2, y: recovery.room.y + 1 };
    fixture.encounter.patientLocation = { ...acceptedBed };
    const plan = quote(fixture, { serviceId: "service.endoscopy", patientOrigin: acceptedBed });
    expect(phase(plan, "preparation").resource).toMatchObject({ stationId: "N4", employeeIds: [trainee.id] });
    const durations = plan.phases.map((entry) => entry.durationMinutes);
    expect(requestEmployeeTraining(fixture.state, trainee.id, fixture.context).applied).toBe(true);
    advanceTrainingMinutes(fixture.state, 1, fixture.context);
    fixture.state.doors = fixture.state.doors.filter((door) => door.roomId !== training.room.id);
    // The other bed is now closer, but the accepted bed remains the patient's.
    fixture.encounter.patientLocation = { ...recovery.anchor };
    const unlinked = forecastDiagnosticOrderPlan(fixture.state, plan, fixture.context);
    expect(unlinked.blockedPhaseIds).toEqual([]);
    for (const kind of ["preparation", "recovery"]) {
      expect(phase(unlinked.plan, kind).forecast.patientPath.at(-1)).toEqual(acceptedBed);
      expect(phase(unlinked.plan, kind).forecast.employeePaths.map((entry) => entry.employeeId)).toEqual([spare.id]);
    }

    spare.facilityTask = { kind: "refill_water", targetId: recovery.room.id, startedAtFacilityTick: fixture.state.facilityTick, workMinutesRemaining: 1 };
    const id = startDiagnosticAcquisitionOperation(fixture.state, fixture.encounter, plan, null, "income.endoscopy", choiceOrder(fixture, plan), fixture.context)!;
    const job = fixture.state.serviceOperations.find((entry) => entry.id === id)!;
    expect(job.status).toBe("waiting_for_resources");
    // Retained bedside occupancy can precede a successful replacement claim.
    job.periopBedReservation = { version: "periop-bed-reservation.v1", roomInstanceId: recovery.room.id, bedId: "N4", endpoint: { ...acceptedBed } };
    spare.facilityTask = null;
    for (const entry of plan.phases.filter((entry) => entry.patientPresent && entry.requirement)) entry.serviceOperationId = id;
    const linked = forecastDiagnosticOrderPlan(fixture.state, plan, fixture.context);
    expect(linked.blockedPhaseIds).toEqual([]);
    expect(phase(linked.plan, "preparation").forecast.endsAtTick).toBe(phase(unlinked.plan, "preparation").forecast.endsAtTick);
    expect(phase(linked.plan, "recovery").forecast.endsAtTick).toBe(phase(unlinked.plan, "recovery").forecast.endsAtTick);
    advanceServiceOperations(fixture.state, fixture.context);
    for (let index = 0; index < 3; index++) {
      expect(job.periopBedReservation).toMatchObject({ bedId: "N4", endpoint: acceptedBed });
      if (index !== 1) expect(job.path.at(-1)).toEqual(acceptedBed);
      arrive(fixture, job);
      expect(job.status).toBe("in_service");
      fixture.state.facilityTick = job.phaseEndsAtFacilityTick!;
      advanceServiceOperations(fixture.state, fixture.context);
      if (index < 2) {
        fixture.state.facilityTick++;
        advanceServiceOperations(fixture.state, fixture.context);
      }
    }
    expect(job.status).toBe("discharging");
    expect(job.diagnosticPhysicalWork!.phaseWitnesses.every((witness) => witness.completedAtFacilityTick !== null)).toBe(true);
    // Release the retained bed only after the patient actually clears the room.
    fixture.encounter.patientLocation = { x: recovery.room.x - 1, y: recovery.room.y + 1 };
    job.location = { ...fixture.encounter.patientLocation };
    advanceServiceOperations(fixture.state, fixture.context);
    expect(job.status).toBe("completed");
    expect(job.frozenOperationPhases!.map((entry) => entry.durationMinutes)).toEqual(durations.filter((minutes) => minutes > 0));
    expect(plan.phases.map((entry) => entry.durationMinutes)).toEqual(durations);
  });

  it("does not reserve a zero-length returning employee until the service tick after physical home clearance", () => {
    const fixture = readyLabFixture(); fixture.addRoom("room.phlebotomy", "staff.phlebotomist"); fixture.addRoom("room.training"); controlled(fixture); placeInWaiting(fixture);
    const employee = fixture.state.employees[0]!;
    expect(requestEmployeeTraining(fixture.state, employee.id, fixture.context).applied).toBe(true);
    employee.trainingLevel = 2;
    Object.assign(employee.training!, { stage: "returning", startedAtFacilityTick: 0, completedAtFacilityTick: 0, remainingMinutes: 0, roomInstanceId: null, placeId: null });
    employee.location = { ...getEmployeeTrainingHomeLocation(fixture.state, employee, fixture.context)! }; employee.path = [{ ...employee.location }]; employee.pathIndex = 0;
    const plan = quote(fixture);
    expect(phase(plan, "collection").forecast.queueMinutes).toBe(2);
    let state = acceptLab(fixture);
    state = tick(state, fixture.context);
    expect(state.employees[0]!.training).toBeNull();
    expect(state.serviceOperations.find((entry) => entry.diagnosticPhysicalWork)!.reservedEmployeeIds).toEqual([]);
    state = tick(state, fixture.context);
    expect(state.serviceOperations.find((entry) => entry.diagnosticPhysicalWork)!.reservedEmployeeIds).toEqual([employee.id]);
  });

  it("marks preparation and a linked unstarted endoscopy operation blocked while its sole periop nurse is paused", () => {
    const fixture = endoscopyFixture(); fixture.addRoom("room.training");
    const nurse = fixture.state.employees.find((entry) => entry.staffRoleDefinitionId === "staff.periop_nurse")!; nurse.trainingLevel = 1;
    expect(requestEmployeeTraining(fixture.state, nurse.id, fixture.context).applied).toBe(true);
    advanceTrainingMinutes(fixture.state, 1, fixture.context);
    fixture.state.doors = fixture.state.doors.filter((door) => !door.roomId.endsWith("training"));
    const plan = quote(fixture, { serviceId: "service.endoscopy" });
    expect(forecastDiagnosticOrderPlan(fixture.state, plan, fixture.context).blockedPhaseIds).toContain(phase(plan, "preparation").id);
    const id = startDiagnosticAcquisitionOperation(fixture.state, fixture.encounter, plan, null, "income.endoscopy", choiceOrder(fixture, plan), fixture.context)!;
    expect(fixture.state.serviceOperations.find((entry) => entry.id === id)!.status).toBe("waiting_for_resources");
    for (const work of plan.phases.filter((entry) => entry.patientPresent && entry.requirement)) work.serviceOperationId = id;
    expect(forecastDiagnosticOrderPlan(fixture.state, plan, fixture.context).blockedPhaseIds).toContain(phase(plan, "preparation").id);
    expect(fixture.state.serviceIncomeReceipts).toHaveLength(0);
  });

  it("includes outbound, seated hour and actual home return in a sole collector's local estimate and waits in execution", () => {
    const fixture = readyLabFixture();
    const station = fixture.addRoom("room.phlebotomy", "staff.phlebotomist");
    fixture.addRoom("room.laboratory", "staff.laboratory_technician"); fixture.addRoom("room.training");
    controlled(fixture);
    placeInWaiting(fixture);
    const employee = fixture.state.employees[0]!;
    expect(requestEmployeeTraining(fixture.state, employee.id, fixture.context).applied).toBe(true);
    advanceTrainingMinutes(fixture.state, 1, fixture.context);
    const availability = getEmployeeTrainingAvailability(fixture.state, employee, fixture.context);
    expect(availability.kind).toBe("returning_at");
    if (availability.kind !== "returning_at") throw new Error("Expected finite training absence");
    const node = fixture.encounter.frozenCase.decisionNodes[0]!;
    const preview = getAnswerChoiceServicePreview(fixture.state, fixture.encounter.id, node.answerChoices.find((choice) => choice.isCorrect)!.id, fixture.context)!;
    expect(phase(preview.diagnosticTiming!, "collection").mode).toBe("local");
    expect(phase(preview.diagnosticTiming!, "collection").forecast.queueMinutes).toBeGreaterThanOrEqual(availability.remainingMinutes);
    expect(phase(preview.diagnosticTiming!, "collection").forecast.employeePaths[0]!.path[0]).toEqual(availability.homeLocation);
    expect(preview.durationTicks).toBeGreaterThanOrEqual(availability.remainingMinutes + 30);
    let state = acceptLab(fixture);
    for (let minute = 0; state.facilityTick < availability.availableAtTick; minute++) {
      state = tick(state, fixture.context);
      const job = state.serviceOperations.find((operation) => operation.diagnosticPhysicalWork)!;
      expect(job.reservedEmployeeIds).toEqual([]);
      expect(state.serviceIncomeReceipts).toHaveLength(0);
    }
    for (let minute = 0; getDiagnosticOrderPlans(state)[0]!.resultReady.reachedAtTick === null && minute < 100; minute++) state = tick(state, fixture.context);
    const accepted = getDiagnosticOrderPlans(state)[0]!;
    expect(accepted.resultReady.reachedAtTick).not.toBeNull();
    expect(phase(accepted, "collection").startedAtTick).toBe(phase(preview.diagnosticTiming!, "collection").forecast.startsAtTick);
    expect(phase(accepted, "collection").durationMinutes).toBe(15);
    expect(state.employees[0]!.trainingLevel).toBe(2);
    expect(state.serviceIncomeReceipts).toHaveLength(1);
  });

  it("accepts paused local collection with unknown ETA, survives nominal due/reload, then finishes once after access returns", () => {
    const fixture = readyLabFixture();
    const station = fixture.addRoom("room.phlebotomy", "staff.phlebotomist"); fixture.addRoom("room.laboratory", "staff.laboratory_technician");
    const training = fixture.addRoom("room.training"); controlled(fixture);
    fixture.encounter.patientLocation = { ...station.anchor };
    expect(requestEmployeeTraining(fixture.state, fixture.state.employees[0]!.id, fixture.context).applied).toBe(true);
    for (let minute = 0; fixture.state.employees[0]!.training?.stage !== "training" && minute < 60; minute++) advanceTrainingMinutes(fixture.state, 1, fixture.context);
    const door = fixture.state.doors.find((entry) => entry.roomId === training.room.id)!;
    fixture.state.doors = fixture.state.doors.filter((entry) => entry.id !== door.id);
    const node = fixture.encounter.frozenCase.decisionNodes[0]!;
    const preview = getAnswerChoiceServicePreview(fixture.state, fixture.encounter.id, node.answerChoices.find((choice) => choice.isCorrect)!.id, fixture.context)!;
    expect(phase(preview.diagnosticTiming!, "collection").mode).toBe("local");
    expect(preview.durationTicks).toBeNull();
    let state = acceptLab(fixture);
    const paidCash = state.cash;
    state = tick(state, fixture.context, 120);
    expect(getDiagnosticOrderTiming(state, fixture.encounter.id)!.totalRemainingTicks).toBeNull();
    expect(getDiagnosticOrderPlans(state)[0]!.resultReady.reachedAtTick).toBeNull();
    expect(state.serviceIncomeReceipts).toHaveLength(0);
    expect(state.cash).toBe(paidCash);
    state = deserializeGameState(serializeGameState(state), fixture.context);
    expect(getDiagnosticOrderTiming(state, fixture.encounter.id, fixture.context)!.blocked).toBe(true);
    expect(phase(getDiagnosticOrderPlans(state)[0]!, "collection").mode).toBe("local");
    state.doors.push(door);
    for (let minute = 0; getDiagnosticOrderPlans(state)[0]!.resultReady.reachedAtTick === null && minute < 180; minute++) state = tick(state, fixture.context);
    expect(getDiagnosticOrderPlans(state)[0]!.resultReady.reachedAtTick).not.toBeNull();
    expect(state.serviceIncomeReceipts).toHaveLength(1);
    state = tick(deserializeGameState(serializeGameState(state), fixture.context), fixture.context, 2);
    expect(state.serviceIncomeReceipts).toHaveLength(1);
  });

  it.each([["room.laboratory", "staff.laboratory_technician", "laboratory_processing"], ["room.reading", "staff.radiologist", "interpretation"]] as const)
    ("keeps paused %s processing local and reports blocked rather than an outside substitute", (roomId, role, kind) => {
      const fixture = timingFixture(); controlled(fixture);
      fixture.addRoom("room.phlebotomy", "staff.phlebotomist"); const us = fixture.addRoom("room.ultrasound", "staff.imaging_technician");
      fixture.addRoom(roomId, role); const training = fixture.addRoom("room.training"); controlled(fixture);
      const employee = fixture.state.employees.find((entry) => entry.staffRoleDefinitionId === role)!;
      expect(requestEmployeeTraining(fixture.state, employee.id, fixture.context).applied).toBe(true);
      for (let minute = 0; employee.training?.stage !== "training" && minute < 80; minute++) advanceTrainingMinutes(fixture.state, 1, fixture.context);
      fixture.state.doors = fixture.state.doors.filter((door) => door.roomId !== training.room.id);
      const plan = quote(fixture, { serviceId: kind === "interpretation" ? "service.ultrasound" : "service.basic_labs", patientOrigin: us.anchor });
      expect(phase(plan, kind).mode).toBe("local");
      expect(forecastDiagnosticOrderPlan(fixture.state, plan, fixture.context).blockedPhaseIds).toContain(phase(plan, kind).id);
      fixture.encounter.pendingResult = pending(plan);
      expect(getPendingResultEta(fixture.state, fixture.encounter.id, fixture.context)).toBeNull();
    });

  it.each([["room.laboratory", "staff.laboratory_technician", "laboratory_processing"], ["room.reading", "staff.radiologist", "interpretation"]] as const)
    ("retains paused %s processing through nominal due and reload, then waits for the actual return/completion witness", (roomId, role, kind) => {
      const fixture = readyLabFixture("case.primary-hyperparathyroidism.stone-history");
      fixture.addRoom("room.phlebotomy", "staff.phlebotomist"); fixture.addRoom("room.ultrasound", "staff.imaging_technician");
      fixture.addRoom(roomId, role); const training = fixture.addRoom("room.training"); controlled(fixture);
      const employee = fixture.state.employees.find((entry) => entry.staffRoleDefinitionId === role)!;
      expect(requestEmployeeTraining(fixture.state, employee.id, fixture.context).applied).toBe(true);
      for (let minute = 0; employee.training?.stage !== "training" && minute < 80; minute++) advanceTrainingMinutes(fixture.state, 1, fixture.context);
      const door = fixture.state.doors.find((entry) => entry.roomId === training.room.id)!;
      fixture.state.doors = fixture.state.doors.filter((entry) => entry.id !== door.id);
      const plan = quote(fixture, { serviceId: kind === "interpretation" ? "service.ultrasound" : "service.basic_labs" });
      const work = phase(plan, kind); const acceptedMinutes = work.durationMinutes;
      completeDependencies(plan, work.id, fixture.state.facilityTick);
      const jobId = startDiagnosticProcessingOperation(fixture.state, plan, work.id, fixture.context)!;
      expect(jobId).not.toBeNull();
      work.serviceOperationId = jobId;
      fixture.encounter.pendingResult = pending(plan);
      fixture.encounter.lifecycle = "active_pending_result";
      fixture.encounter.steps[0]!.status = "result_pending"; fixture.encounter.steps[0]!.result = fixture.encounter.pendingResult;
      const cash = fixture.state.cash;
      let state = tick(fixture.state, fixture.context, 120);
      expect(state.serviceOperations.find((entry) => entry.id === jobId)!.status).toBe("waiting_for_resources");
      expect(getDiagnosticOrderPlans(state)[0]!.resultReady.reachedAtTick).toBeNull();
      expect(getPendingResultEta(state, fixture.encounter.id, fixture.context)).toBeNull();
      expect(state.serviceIncomeReceipts).toHaveLength(0);
      state = deserializeGameState(serializeGameState(state), fixture.context);
      state.doors.push(door);
      for (let minute = 0; getDiagnosticOrderPlans(state)[0]!.resultReady.reachedAtTick === null && minute < 180; minute++) state = tick(state, fixture.context);
      expect(getDiagnosticOrderPlans(state)[0]!.resultReady.reachedAtTick).not.toBeNull();
      expect(state.serviceOperations.find((entry) => entry.id === jobId)!.frozenOperationPhases![0]!.durationMinutes).toBe(acceptedMinutes);
      expect(state.employees.find((entry) => entry.id === employee.id)!.trainingLevel).toBe(2);
      expect(state.serviceIncomeReceipts).toHaveLength(0);
      expect(state.cash).toBe(cash);
    });
});

describe("nonclinical training consumers", () => {
  it("freezes repair work on assignment and QI work through preemption, category changes and reload", () => {
    const fixture = timingFixture(); controlled(fixture);
    const maintained = fixture.addRoom("room.laboratory"); fixture.addRoom("room.maintenance_workshop", "staff.repair_person"); fixture.addRoom("room.surgeon_office", "staff.surgeon");
    fixture.addRoom("room.periop_recovery", "staff.periop_nurse"); fixture.addRoom("room.ambulatory_or", "staff.or_nurse");
    fixture.state.employees.forEach((employee) => employee.trainingLevel = 5);
    maintained.room.maintenance = { status: "out_of_service", completedUses: 8, dueAtFacilityTick: 0, outOfServiceAtFacilityTick: 0, appliedUseKeys: [] };
    fixture.state.serviceIncomeReceipts.push({ id: "qi.receipt", transactionKey: "qi.receipt", incomeLineId: "income.ambulatory_operation", catalogVersion: 1, routeId: null, actorKind: "visitor", actorId: "qi.actor", grossAmount: 900, stockCost: 0, netCashDelta: 900, completedAtFacilityTick: 0 });
    advanceLevelThreeSupport(fixture.state, fixture.context);
    const repairer = fixture.state.employees[0]!; const surgeon = fixture.state.employees[1]!;
    expect(repairer.facilityTask!.workMinutesRemaining).toBe(Math.ceil(fixture.context.balanceRelease.environment.levelThreeSupport.repairDurationMinutes * 0.6));
    expect(surgeon.facilityTask!.workMinutesRemaining).toBe(18);
    surgeon.pathIndex = surgeon.path.length - 1; surgeon.location = { ...surgeon.path.at(-1)! };
    fixture.state.facilityTick++;
    advanceLevelThreeSupport(fixture.state, fixture.context);
    expect(fixture.state.levelThreeQiReviews[0]!.trainingWork!.remainingMinutes).toBe(17);
    const care = startWaiting(fixture, "income.ambulatory_operation");
    care.frozenOperationPhases = [{ id: "or", roomDefinitionId: "room.ambulatory_or", durationMinutes: 120, staffRoleDefinitionIds: ["staff.or_nurse"], providerRoleDefinitionIds: ["staff.surgeon"] }];
    delete care.trainingTiming;
    advanceLevelThreeSupport(fixture.state, fixture.context);
    expect(fixture.state.levelThreeQiReviews[0]!).toMatchObject({ status: "queued", trainingWork: { durationMinutes: 18, remainingMinutes: 17 } });
    fixture.state.serviceOperations = [];
    fixture.state.employees.forEach((employee) => employee.trainingLevel = 1);
    const restored = deserializeGameState(serializeGameState(fixture.state), fixture.context);
    advanceLevelThreeSupport(restored, fixture.context);
    expect(restored.employees.find((employee) => employee.id === surgeon.id)!.facilityTask!.workMinutesRemaining).toBe(17);
    expect(restored.employees.find((employee) => employee.id === repairer.id)!.facilityTask!.workMinutesRemaining).toBe(repairer.facilityTask!.workMinutesRemaining);
  });

  it("freezes increased EVS room restoration without shortening work or boosting litter cleanup; legacy jobs keep baseline", () => {
    const fixture = timingFixture(); controlled(fixture); fixture.state.encounters = {};
    const room = fixture.addRoom("room.evs_closet", "staff.evs_worker"); fixture.state.employees[0]!.trainingLevel = 5; room.room.cleanliness = 50;
    let state = tick(fixture.state, fixture.context);
    expect(state.employees[0]!.facilityTask).toMatchObject({ kind: "clean_room", workMinutesRemaining: fixture.context.balanceRelease.environment.evsRoomCleanupMinutes, cleanlinessRestore: 14 });
    state.employees[0]!.trainingLevel = 1;
    state = deserializeGameState(serializeGameState(state), fixture.context);
    state = tick(state, fixture.context, fixture.context.balanceRelease.environment.evsRoomCleanupMinutes);
    expect(state.rooms.find((entry) => entry.id === room.room.id)!.cleanliness).toBe(64);
    const legacy = trainingFixture(); const worker = addTrainingEmployee(legacy, "evs.legacy", "staff.evs_worker"); worker.trainingLevel = 5;
    legacy.rooms[0]!.cleanliness = 50; worker.facilityTask = { kind: "clean_room", targetId: legacy.rooms[0]!.id, startedAtFacilityTick: 0, workMinutesRemaining: 1 };
    expect(tick(legacy).rooms[0]!.cleanliness).toBe(60);
  });

  it("freezes each new NP interval's category payment through changes and reload, then quotes the next hour", () => {
    const fixture = timingFixture(); controlled(fixture); fixture.state.encounters = {};
    fixture.addRoom("room.glp1_telehealth_suite", "staff.glp1_np", 2);
    fixture.state.employees[0]!.trainingLevel = 5;
    let state = tick(fixture.state, fixture.context);
    const employeeId = fixture.state.employees[0]!.id;
    const interval = state.environment.glp1AutomationSlots.find((slot) => slot.employeeId === employeeId)!;
    expect(interval.quotePayment).toBe(60);
    expect(interval.nextPayoutTick - state.facilityTick + 1).toBe(60);
    state.employees.forEach((employee) => employee.trainingLevel = 1);
    state = deserializeGameState(serializeGameState(state), fixture.context);
    expect(state.environment.glp1AutomationSlots.find((slot) => slot.employeeId === employeeId)!.quotePayment).toBe(60);
    state = tick(state, fixture.context, interval.nextPayoutTick - state.facilityTick);
    const receipts = (current: GameState) => current.serviceIncomeReceipts.filter((receipt) => receipt.incomeLineId === "income.glp1_telehealth" && receipt.actorId === employeeId);
    expect(receipts(state).map((receipt) => receipt.grossAmount)).toEqual([60]);
    expect(state.environment.glp1AutomationSlots.find((slot) => slot.employeeId === employeeId)!).toMatchObject({
      nextPayoutTick: interval.nextPayoutTick + 60, quotePayment: 50,
    });
    state = tick(deserializeGameState(serializeGameState(state), fixture.context), fixture.context);
    expect(receipts(state)).toHaveLength(1);
    state = tick(state, fixture.context, interval.nextPayoutTick + 60 - state.facilityTick);
    expect(receipts(state).map((receipt) => receipt.grossAmount)).toEqual([60, 50]);
    state = tick(deserializeGameState(serializeGameState(state), fixture.context), fixture.context);
    expect(receipts(state)).toHaveLength(2);
  });

  it("preserves the baseline payment for a legacy NP interval and applies category skill to its next hour", () => {
    const fixture = timingFixture(); controlled(fixture); fixture.state.encounters = {};
    fixture.addRoom("room.glp1_telehealth_suite", "staff.glp1_np");
    fixture.state.employees[0]!.trainingLevel = 5;
    let state = tick(fixture.state, fixture.context);
    const accepted = state.environment.glp1AutomationSlots[0]!;
    const firstPayout = accepted.nextPayoutTick;
    delete accepted.quotePayment;
    delete accepted.roomUpgradeRevenue;
    state = deserializeGameState(serializeGameState(state), fixture.context);
    state = tick(state, fixture.context, firstPayout - state.facilityTick);
    const receipts = (current: GameState) => current.serviceIncomeReceipts.filter((receipt) => receipt.incomeLineId === "income.glp1_telehealth");
    expect(receipts(state).map((receipt) => receipt.grossAmount)).toEqual([50]);
    expect(state.environment.glp1AutomationSlots[0]!).toMatchObject({ nextPayoutTick: firstPayout + 60, quotePayment: 70 });
    state = tick(deserializeGameState(serializeGameState(state), fixture.context), fixture.context, 60);
    expect(receipts(state).map((receipt) => receipt.grossAmount)).toEqual([50, 70]);
    state = tick(deserializeGameState(serializeGameState(state), fixture.context), fixture.context);
    expect(receipts(state)).toHaveLength(2);
  });

  it("discounts quoted pharmacy stock costs, freezes them across skill changes/reload, and keeps coffee prices unchanged", () => {
    const fixture = timingFixture(); controlled(fixture); fixture.state.encounters = {};
    fixture.addRoom("room.pharmacy", "staff.pharmacist", 2); fixture.addRoom("room.coffee_kiosk");
    fixture.state.employees[0]!.trainingLevel = 5;
    expect(authorizeRetailOrder(fixture.state, "order.rx.training", "income.pharmacy_pickup", "retail_visitor", "rx.training", 1, fixture.context)).toBe(true);
    const id = startRetailPurchase(fixture.state, "income.pharmacy_pickup", "retail_visitor", "rx.training", fixture.context, "order.rx.training");
    expect(id).not.toBeNull();
    expect(fixture.state.retailOperations[0]!).toMatchObject({ quoteGross: 25, quoteStockCost: 13.5 });
    fixture.state.employees.forEach((employee) => employee.trainingLevel = 1);
    const restored = deserializeGameState(serializeGameState(fixture.state), fixture.context);
    for (let count = 0; !restored.serviceIncomeReceipts.some((receipt) => receipt.incomeLineId === "income.pharmacy_pickup") && count < 150; count++) { restored.facilityTick++; advanceRetailOperations(restored, fixture.context); advanceEmployeeMovement(restored, fixture.context); }
    expect(restored.serviceIncomeReceipts.find((receipt) => receipt.incomeLineId === "income.pharmacy_pickup")).toMatchObject({ grossAmount: 25, stockCost: 13.5, netCashDelta: 11.5 });
    expect(restored.retailOperations.find((entry) => entry.incomeLineId === "income.coffee")!.quoteStockCost).toBe(getServiceIncomeLine("income.coffee")!.retail!.stockCost);
  });

  it("reduces only excessive waiting loss when a receptionist is available, leaving missing-amenity loss unchanged", () => {
    const fixture = timingFixture(); controlled(fixture);
    const employee = addTrainingEmployee(fixture.state, "reception.training", "staff.receptionist"); employee.trainingLevel = 5;
    const front = fixture.state.rooms.find((room) => room.id === employee.homeRoomInstanceId)!;
    employee.location = { x: front.x + 1, y: front.y + 1 }; employee.path = [{ ...employee.location }];
    const encounter = fixture.encounter; encounter.lifecycle = "waiting_unopened"; encounter.waiting.patienceExempt = false;
    encounter.patientMovement = null; encounter.idleWaitingSinceTick = 0; encounter.lastSatisfactionDecayAtTick = 0;
    encounter.patientSatisfaction = 100; encounter.dissatisfactionByCause = {}; fixture.state.openChartEncounterId = null;
    fixture.state.facilityTick = fixture.context.balanceRelease.patientSatisfaction.idleGraceMinutes + fixture.context.balanceRelease.patientSatisfaction.decayIntervalMinutes - 1;
    const baseline = structuredClone(fixture.state); baseline.employees[0]!.trainingLevel = 1;
    const trained = tick(fixture.state, fixture.context); const untrained = tick(baseline, fixture.context);
    expect(trained.encounters[encounter.id]!.dissatisfactionByCause.excessive_waiting!.pointsLost).toBeCloseTo(untrained.encounters[encounter.id]!.dissatisfactionByCause.excessive_waiting!.pointsLost * 0.6);
    expect(trained.encounters[encounter.id]!.dissatisfactionByCause.missing_amenities).toEqual(untrained.encounters[encounter.id]!.dissatisfactionByCause.missing_amenities);
    fixture.state.employees[0]!.facilityTask = { kind: "refill_water", targetId: front.id, startedAtFacilityTick: 0, workMinutesRemaining: 5 };
    const busy = tick(fixture.state, fixture.context);
    expect(busy.encounters[encounter.id]!.dissatisfactionByCause.excessive_waiting!.pointsLost).toBe(untrained.encounters[encounter.id]!.dissatisfactionByCause.excessive_waiting!.pointsLost);
  });
});
