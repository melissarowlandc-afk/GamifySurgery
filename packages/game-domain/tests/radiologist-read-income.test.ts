import { describe, expect, it } from "vitest";
import { RADIOLOGIST_IN_HOUSE_INCOME_LINE_ID, RADIOLOGIST_OUTSIDE_INCOME_LINE_ID } from "@gamify-surgery/balance-config";
import {
  advanceServiceOperations, captureClinicDaySummary, deserializeGameState, enableReadingPhase,
  forecastDiagnosticOrderPlan, getRadiologistReadIncomeSummary, getRadiologistReadingStation,
  getReadingWorkMinutes, planDiagnosticOrder, reconcileReadingStations, requestEmployeeTraining,
  operatingDayMinutes, retireFinishedServiceHistory,
  serializeGameState, startDiagnosticAcquisitionOperation, startDiagnosticProcessingOperation,
  type DiagnosticOrderPhase, type DiagnosticOrderPlan, type GameState, type RoomUpgradeLevel,
} from "../src";
import { pending, timingFixture } from "./diagnostic-timing-fixtures";
import { advanceDiagnosticOrders, replaceDiagnosticOrderPlan, type DiagnosticPatientActions } from "../src/diagnostic-orders";

function fixture(level: RoomUpgradeLevel = 1, trainingLevel: RoomUpgradeLevel = 1, readers = 1) {
  const f = timingFixture();
  f.state.serviceAppointmentsEnabled = false;
  const room = f.addRoom("room.reading", "staff.radiologist", readers).room;
  room.upgradeLevel = level;
  reconcileReadingStations(f.state);
  for (const employee of f.state.employees) {
    employee.trainingLevel = trainingLevel;
    const post = getRadiologistReadingStation(f.state, employee, f.context)!;
    employee.location = { ...post.location }; employee.path = []; employee.pathIndex = 0;
  }
  return { ...f, room, reader: f.state.employees[0]! };
}
type Fixture = ReturnType<typeof fixture>;
function advance(f: Fixture, through: number) {
  while (f.state.facilityTick < through) {
    f.state.facilityTick += 1;
    advanceServiceOperations(f.state, f.context);
  }
}
function completeDependencies(plan: DiagnosticOrderPlan, phase: DiagnosticOrderPhase, atTick: number) {
  for (const id of phase.dependsOn) {
    const dependency = plan.phases.find((entry) => entry.id === id)!;
    completeDependencies(plan, dependency, atTick);
    Object.assign(dependency, { status: "completed", startedAtTick: atTick, completedAtTick: atTick, remainingMinutes: 0 });
  }
}
let sequence = 0;
function centerRead(f: Fixture) {
  const quote = planDiagnosticOrder(f.state, { orderId: `center.read.${sequence++}`, encounterId: f.encounter.id,
    serviceId: "service.ultrasound", allowedRouteIds: ["route.ultrasound.outsourced"] }, f.context);
  if (quote.kind !== "planned") throw new Error(quote.reason);
  const plan = quote.plan;
  const phase = plan.phases.find((entry) => entry.kind === "interpretation")!;
  completeDependencies(plan, phase, f.state.facilityTick);
  enableReadingPhase(plan, phase, f.state.facilityTick);
  const forecast = forecastDiagnosticOrderPlan(f.state, plan, f.context).plan;
  const forecastPhase = forecast.phases.find((entry) => entry.id === phase.id)!;
  return { plan: forecast, phase: forecastPhase };
}
function start(f: Fixture, read = centerRead(f)) {
  const id = startDiagnosticProcessingOperation(f.state, read.plan, read.phase.id, f.context)!;
  expect(id).toBeTruthy();
  return f.state.serviceOperations.find((entry) => entry.id === id)!;
}
const outsideReceipts = (state: GameState) => state.serviceIncomeReceipts.filter((receipt) => receipt.incomeLineId === RADIOLOGIST_OUTSIDE_INCOME_LINE_ID);
const centerReceipts = (state: GameState) => state.serviceIncomeReceipts.filter((receipt) => receipt.incomeLineId === RADIOLOGIST_IN_HOUSE_INCOME_LINE_ID);

const patientActions: DiagnosticPatientActions = {
  walkingPath: (_encounter, phase) => phase.forecast.patientPath,
  startMovement: () => {}, roomAt: () => null, releaseCare: () => {}, careCompleted: () => {},
};
function dispatchOrder(f: Fixture) {
  advanceDiagnosticOrders(f.state, f.context, patientActions);
  advanceServiceOperations(f.state, f.context);
  advanceDiagnosticOrders(f.state, f.context, patientActions);
}
function advanceOrderUntil(f: Fixture, done: (state: GameState) => boolean) {
  const limit = f.state.facilityTick + 200;
  while (!done(f.state) && f.state.facilityTick < limit) {
    f.state.facilityTick += 1;
    dispatchOrder(f);
  }
  expect(done(f.state)).toBe(true);
}
function acceptedUltrasound(f: Fixture, legacySplit: boolean) {
  const scanner = f.addRoom("room.ultrasound", "staff.imaging_technician");
  f.encounter.patientLocation = scanner.anchor;
  const quote = planDiagnosticOrder(f.state, { orderId: `saved.ultrasound.${sequence++}`, encounterId: f.encounter.id,
    serviceId: "service.ultrasound", allowedRouteIds: ["route.ultrasound.in_house"] }, f.context);
  if (quote.kind !== "planned") throw new Error(quote.reason);
  if (legacySplit) for (const source of quote.plan.sources) delete source.readIncomeBilling;
  f.encounter.pendingResult = pending(quote.plan);
}

describe("radiologist read income", () => {
  it("pays one frozen center-read fee only when the actual read completes", () => {
    const f = fixture(); const cash = f.state.cashCents;
    const job = start(f);
    expect(job.diagnosticPhaseWork?.readIncomeFee).toBe(5);
    advance(f, 4);
    expect(centerReceipts(f.state)).toHaveLength(0);
    expect(f.state.cashCents).toBe(cash);
    advance(f, 5);
    expect(job.status).toBe("completed");
    expect(centerReceipts(f.state)).toHaveLength(1);
    expect(f.state.cashCents).toBe(cash + 500);
    advanceServiceOperations(f.state, f.context);
    expect(centerReceipts(f.state)).toHaveLength(1);
    expect(getRadiologistReadIncomeSummary(f.state, f.context).today).toMatchObject({ inHouseReads: 1, inHouseIncomeCents: 500 });
  });

  it.each([1, 2, 5] as const)("adds one read fee to unchanged imaging payment, including room level %s revenue", (level) => {
    const f = fixture();
    const scanner = f.addRoom("room.ultrasound", "staff.imaging_technician"); scanner.room.upgradeLevel = level;
    f.encounter.patientLocation = scanner.anchor;
    const quote = planDiagnosticOrder(f.state, { orderId: `bundle.${sequence++}`, encounterId: f.encounter.id,
      serviceId: "service.ultrasound", allowedRouteIds: ["route.ultrasound.in_house"] }, f.context);
    if (quote.kind !== "planned") throw new Error(quote.reason);
    const plan = quote.plan;
    expect(plan.sources[0]).toMatchObject({ quoteFee: 120, readIncomeFee: 5, readIncomeBilling: "additive" });
    const node = f.encounter.frozenCase.decisionNodes[0]!;
    const id = startDiagnosticAcquisitionOperation(f.state, f.encounter, plan, null, "income.ultrasound", {
      version: "test-choice-order.v1", purpose: "result_gate", caseId: f.encounter.frozenCase.id,
      nodeId: node.id, questionVariantId: node.questionVariantId, choiceId: node.answerChoices[0]!.id,
      choiceLabel: node.answerChoices[0]!.label, serviceId: "service.ultrasound", routeId: "route.ultrasound.in_house",
      routeDisplayName: "In-house ultrasound", externalRemainder: null,
    }, f.context);
    const acquisition = f.state.serviceOperations.find((entry) => entry.id === id)!;
    expect(acquisition).toBeDefined();
    expect(acquisition.diagnosticPhysicalWork?.readIncomeFee).toBeUndefined();
    const cash = f.state.cashCents;
    while (acquisition.status !== "completed" && f.state.facilityTick < 200) advance(f, f.state.facilityTick + 1);
    expect(acquisition.status).toBe("completed");
    const expectedBundle = Math.round(120 * (1 + 0.06 * (level - 1)) * 100);
    const acquisitionReceipt = f.state.serviceIncomeReceipts.find((receipt) => receipt.incomeLineId === "income.ultrasound")!;
    expect(Math.round(acquisitionReceipt.netCashDelta * 100)).toBe(expectedBundle);
    const phase = plan.phases.find((entry) => entry.kind === "interpretation")!;
    completeDependencies(plan, phase, f.state.facilityTick);
    enableReadingPhase(plan, phase, f.state.facilityTick);
    const readId = startDiagnosticProcessingOperation(f.state, plan, phase.id, f.context);
    const readJob = f.state.serviceOperations.find((entry) => entry.id === readId)!;
    const limit = f.state.facilityTick + 20;
    while (readJob.status !== "completed" && f.state.facilityTick < limit) advance(f, f.state.facilityTick + 1);
    expect(readJob.status, JSON.stringify({ readJob, reader: f.reader })).toBe("completed");
    expect(centerReceipts(f.state)).toHaveLength(1);
    expect(centerReceipts(f.state)[0]!.netCashDelta).toBe(5);
    expect(acquisitionReceipt.netCashDelta + centerReceipts(f.state)[0]!.netCashDelta).toBeCloseTo(expectedBundle / 100 + 5);
    // Idle outside reads are a separate, explicitly counted revenue source.
    expect(f.state.cashCents - cash - outsideReceipts(f.state).length * 500).toBe(expectedBundle + 500);
    advanceServiceOperations(f.state, f.context);
    expect(centerReceipts(f.state)).toHaveLength(1);
    f.state.facilityTick = operatingDayMinutes(f.context);
    expect(captureClinicDaySummary(f.state, f.context).moneyEarnedCents).toBe(expectedBundle + 500 + outsideReceipts(f.state).length * 500);
  });

  it.each(["accepted", "acquired", "reading", "settled"] as const)("settles saved legacy split work exactly once from the %s checkpoint", (checkpoint) => {
    const f = fixture(); const initialCash = f.state.cashCents;
    acceptedUltrasound(f, true);
    if (checkpoint !== "accepted") {
      dispatchOrder(f);
      advanceOrderUntil(f, state => state.serviceIncomeReceipts.some(receipt => receipt.incomeLineId === "income.ultrasound"));
      expect(f.state.serviceIncomeReceipts.find(receipt => receipt.incomeLineId === "income.ultrasound")?.netCashDelta).toBe(115);
    }
    if (checkpoint === "reading") {
      advanceOrderUntil(f, state => state.serviceOperations.some(operation => operation.diagnosticPhaseWork?.kind === "interpretation" && operation.status === "in_service"));
      f.state.facilityTick += 2; dispatchOrder(f);
      expect(centerReceipts(f.state)).toHaveLength(0);
    }
    if (checkpoint === "settled") advanceOrderUntil(f, state => centerReceipts(state).length === 1);
    const cashAtSave = f.state.cashCents;
    const receiptsAtSave = structuredClone(f.state.serviceIncomeReceipts);
    f.state = deserializeGameState(serializeGameState(f.state), f.context);
    expect(f.state.cashCents).toBe(cashAtSave);
    expect(f.state.serviceIncomeReceipts).toEqual(receiptsAtSave);
    advanceOrderUntil(f, state => centerReceipts(state).length === 1);
    const acquisition = f.state.serviceOperations.find(operation => operation.diagnosticPhysicalWork)!;
    expect(acquisition.diagnosticPhysicalWork?.readIncomeFee).toBe(5);
    expect(centerReceipts(f.state)[0]!.netCashDelta).toBe(5);
    expect(f.state.cashCents - initialCash - outsideReceipts(f.state).length * 500).toBe(12_000);
    f.state = deserializeGameState(serializeGameState(f.state), f.context);
    dispatchOrder(f);
    expect(centerReceipts(f.state)).toHaveLength(1);
    expect(getRadiologistReadIncomeSummary(f.state, f.context).today.inHouseReads).toBe(1);
    f.state.facilityTick = operatingDayMinutes(f.context);
    expect(captureClinicDaySummary(f.state, f.context).moneyEarnedCents).toBe(12_000 + outsideReceipts(f.state).length * 500);
  });

  it.each(["accepted", "acquired", "reading", "settled"] as const)("retains additive payment through the saved %s checkpoint", (checkpoint) => {
    const f = fixture(); const initialCash = f.state.cashCents;
    acceptedUltrasound(f, false);
    if (checkpoint !== "accepted") {
      dispatchOrder(f);
      advanceOrderUntil(f, state => state.serviceIncomeReceipts.some(receipt => receipt.incomeLineId === "income.ultrasound"));
      expect(f.state.serviceIncomeReceipts.find(receipt => receipt.incomeLineId === "income.ultrasound")?.netCashDelta).toBe(120);
    }
    if (checkpoint === "reading") {
      advanceOrderUntil(f, state => state.serviceOperations.some(operation => operation.diagnosticPhaseWork?.kind === "interpretation" && operation.status === "in_service"));
      f.state.facilityTick += 2; dispatchOrder(f);
      expect(centerReceipts(f.state)).toHaveLength(0);
    }
    if (checkpoint === "settled") advanceOrderUntil(f, state => centerReceipts(state).length === 1);
    const cashAtSave = f.state.cashCents;
    f.state = deserializeGameState(serializeGameState(f.state), f.context);
    expect(f.state.cashCents).toBe(cashAtSave);
    advanceOrderUntil(f, state => centerReceipts(state).length === 1);
    const acquisition = f.state.serviceOperations.find(operation => operation.diagnosticPhysicalWork)!;
    expect(acquisition.diagnosticPhysicalWork?.readIncomeFee).toBeUndefined();
    expect(f.state.encounters[f.encounter.id]!.pendingResult!.diagnosticTiming!.sources[0]?.readIncomeBilling).toBe("additive");
    expect(f.state.cashCents - initialCash - outsideReceipts(f.state).length * 500).toBe(12_500);
    dispatchOrder(f);
    expect(centerReceipts(f.state)).toHaveLength(1);
    f.state.facilityTick = operatingDayMinutes(f.context);
    expect(captureClinicDaySummary(f.state, f.context).moneyEarnedCents).toBe(12_500 + outsideReceipts(f.state).length * 500);
  });

  it("keeps an already-accepted legacy read nonbillable", () => {
    const f = fixture(); const read = centerRead(f);
    for (const source of read.plan.sources) { delete source.readIncomeFee; delete source.readIncomeBilling; }
    const job = start(f, read); advance(f, 5);
    expect(job.status).toBe("completed");
    expect(centerReceipts(f.state)).toHaveLength(0);
    expect(getRadiologistReadIncomeSummary(f.state, f.context).today).toMatchObject({ inHouseReads: 1, inHouseIncomeCents: 0 });
  });

  it("runs continuous outside work at an assigned station, paying 12 base reads per hour without feed rows", () => {
    const f = fixture(); const cash = f.state.cashCents; const events = f.state.events.length;
    advanceServiceOperations(f.state, f.context);
    expect(f.state.outsideRadiologyReads).toHaveLength(1);
    advance(f, 60);
    expect(outsideReceipts(f.state)).toHaveLength(12);
    expect(f.state.cashCents).toBe(cash + 6000);
    expect(f.state.events).toHaveLength(events);
    expect(getRadiologistReadIncomeSummary(f.state, f.context)).toMatchObject({
      today: { outsideReads: 12, outsideIncomeCents: 6000 }, thisLevel: { outsideReads: 12, outsideIncomeCents: 6000 },
    });
  });

  it.each(["unassigned", "unreachable", "away", "walking", "break", "duty"] as const)("does no outside work while %s", (condition) => {
    const f = fixture();
    if (condition === "unassigned") f.reader.homeRoomInstanceId = null;
    if (condition === "unreachable") f.state.doors = f.state.doors.filter((door) => door.roomId !== f.room.id);
    if (condition === "away") f.reader.location = { x: 7, y: 4 };
    if (condition === "walking") f.reader.path = [{ ...f.reader.location }, { x: 7, y: 4 }];
    if (condition === "break") f.reader.facilityTask = { kind: "take_break", startedAtFacilityTick: 0, workMinutesRemaining: 10 };
    if (condition === "duty") f.reader.facilityTask = { kind: "participate_qi_discussion", startedAtFacilityTick: 0, workMinutesRemaining: 10 };
    advanceServiceOperations(f.state, f.context); advance(f, 15);
    expect(f.state.outsideRadiologyReads ?? []).toHaveLength(0);
    expect(outsideReceipts(f.state)).toHaveLength(0);
  });

  it("interrupts a longer outside read immediately for an in-house study without paying unfinished work", () => {
    const f = fixture(); advanceServiceOperations(f.state, f.context); advance(f, 1);
    const job = start(f);
    expect(job.status).toBe("in_service"); expect(job.phaseStartedAtFacilityTick).toBe(1);
    expect(f.state.outsideRadiologyReads).toHaveLength(0);
    advance(f, 6);
    expect(outsideReceipts(f.state)).toHaveLength(0); expect(centerReceipts(f.state)).toHaveLength(1);
  });

  it("respects a legacy whole-room reservation instead of starting outside work on another desk", () => {
    const f = fixture(1, 1, 4);
    const job = start(f);
    delete job.diagnosticPhaseWork;
    job.quoteFee = 40; job.phaseEndsAtFacilityTick = 100;
    job.frozenOperationPhases![0]!.durationMinutes = 100;
    advanceServiceOperations(f.state, f.context); advance(f, 20);
    expect(f.state.outsideRadiologyReads ?? []).toHaveLength(0);
    expect(outsideReceipts(f.state)).toHaveLength(0);
  });

  it("finishes a short outside read first, forecasts that wait, then prioritizes the queued in-house read", () => {
    const f = fixture(); advanceServiceOperations(f.state, f.context); advance(f, 4);
    const read = centerRead(f);
    expect(read.phase.forecast.startsAtTick).toBe(5);
    const job = start(f, read);
    expect(job.status).toBe("waiting_for_resources");
    expect(outsideReceipts(f.state)).toHaveLength(0);
    advance(f, 5);
    expect(outsideReceipts(f.state)).toHaveLength(1);
    expect(job.status).toBe("in_service"); expect(job.phaseStartedAtFacilityTick).toBe(5);
    expect(f.state.outsideRadiologyReads).toHaveLength(0);
    advance(f, 10);
    expect(centerReceipts(f.state)).toHaveLength(1);
    expect(f.state.outsideRadiologyReads).toHaveLength(1);
    expect(f.state.outsideRadiologyReads![0]!.startedAtFacilityTick).toBe(10);
  });

  it("pays a due outside read once before a study claims the station on the same observing tick", () => {
    const f = fixture(); advanceServiceOperations(f.state, f.context); advance(f, 4);
    f.state.facilityTick = 5;
    const job = start(f); expect(job.status).toBe("in_service");
    advanceServiceOperations(f.state, f.context);
    expect(outsideReceipts(f.state)).toHaveLength(1);
  });

  it.each([[1, 2, 4.5], [2, 2, 4.05], [5, 5, 1.8]] as const)("applies the same training and room time factors (%s/%s)", (roomLevel, trainingLevel, minutes) => {
    const f = fixture(roomLevel, trainingLevel);
    advanceServiceOperations(f.state, f.context);
    expect(f.state.outsideRadiologyReads![0]!.durationMinutes).toBeCloseTo(minutes);
    expect(f.state.outsideRadiologyReads![0]!.durationMinutes).toBe(getReadingWorkMinutes(5, 10 * (trainingLevel - 1), roomLevel));
    advance(f, Math.ceil(minutes)); expect(outsideReceipts(f.state)).toHaveLength(1);
  });

  it("keeps fractional outside work continuous and freezes an active job through upgrades", () => {
    const f = fixture(2); advanceServiceOperations(f.state, f.context);
    const accepted = structuredClone(f.state.outsideRadiologyReads![0]!);
    advance(f, 1); f.room.upgradeLevel = 5; f.reader.trainingLevel = 5;
    expect(f.state.outsideRadiologyReads![0]!.durationMinutes).toBe(accepted.durationMinutes);
    advance(f, 5);
    expect(outsideReceipts(f.state)).toHaveLength(1);
    expect(f.state.outsideRadiologyReads![0]!.startedAtFacilityTick).toBe(4.5);
    expect(f.state.outsideRadiologyReads![0]!.durationMinutes).toBeCloseTo(1.8);
  });

  it("stops unpaid outside work for a break and starts a fresh study after return", () => {
    const f = fixture(); advanceServiceOperations(f.state, f.context); advance(f, 4);
    f.reader.facilityTask = { kind: "take_break", startedAtFacilityTick: 4, workMinutesRemaining: 10 };
    advance(f, 10); expect(outsideReceipts(f.state)).toHaveLength(0);
    f.reader.facilityTask = null; advance(f, 11);
    expect(f.state.outsideRadiologyReads![0]!.startedAtFacilityTick).toBe(11);
    advance(f, 16); expect(outsideReceipts(f.state)).toHaveLength(1);
  });

  it.each(["walking_to_training", "training", "returning"] as const)("stops outside work while training stage is %s", (stage) => {
    const f = fixture(); f.addRoom("room.training");
    advanceServiceOperations(f.state, f.context); advance(f, 4);
    expect(requestEmployeeTraining(f.state, f.reader.id, f.context).applied).toBe(true);
    f.reader.training!.stage = stage;
    advance(f, 10);
    expect(outsideReceipts(f.state)).toHaveLength(0);
    expect(f.state.outsideRadiologyReads).toHaveLength(0);
  });

  it("allows training departure to claim an idle reader even while outside work is active", () => {
    const f = fixture(); f.addRoom("room.training");
    advanceServiceOperations(f.state, f.context); advance(f, 2);
    expect(requestEmployeeTraining(f.state, f.reader.id, f.context).applied).toBe(true);
    advance(f, 5);
    expect(outsideReceipts(f.state)).toHaveLength(0);
    expect(f.state.outsideRadiologyReads).toHaveLength(0);
  });

  it("saves current outside work and counters, resumes only the remaining work, and never pays during load", () => {
    const f = fixture(2); advanceServiceOperations(f.state, f.context); advance(f, 6);
    const accepted = structuredClone(f.state.outsideRadiologyReads);
    const cash = f.state.cashCents;
    f.state = deserializeGameState(serializeGameState(f.state), f.context);
    expect(f.state.outsideRadiologyReads).toEqual(accepted);
    expect(f.state.cashCents).toBe(cash);
    expect(getRadiologistReadIncomeSummary(f.state, f.context).today.outsideReads).toBe(1);
    advance(f, 9);
    expect(outsideReceipts(f.state)).toHaveLength(2);
    expect(f.state.cashCents).toBe(cash + 500);
  });

  it("loads old campaigns with zero outside history and starts fresh without retroactive income", () => {
    const f = fixture(); f.state.facilityTick = 100;
    delete f.state.radiologistReadIncome; delete f.state.outsideRadiologyReads;
    const cash = f.state.cashCents;
    f.state = deserializeGameState(serializeGameState(f.state), f.context);
    expect(getRadiologistReadIncomeSummary(f.state, f.context).today.outsideReads).toBe(0);
    expect(f.state.cashCents).toBe(cash);
    advance(f, 101); expect(outsideReceipts(f.state)).toHaveLength(0);
    advance(f, 106); expect(outsideReceipts(f.state)).toHaveLength(1);
  });

  it("round-trips a linked paid read, retains its frozen fee, and rejects mismatched bundle/read witnesses", () => {
    const f = fixture(); const read = centerRead(f); const job = start(f, read);
    Object.assign(read.phase, { readingUpgradeWork: structuredClone(job.diagnosticPhaseWork!.readingUpgradeWork),
      remainingMinutes: job.diagnosticPhaseWork!.remainingMinutes, resource: structuredClone(job.diagnosticPhaseWork!.resource),
      serviceOperationId: job.id, startedAtTick: job.phaseStartedAtFacilityTick, status: "active" });
    f.encounter.pendingResult = pending(read.plan);
    const saved = serializeGameState(f.state);
    const loaded = deserializeGameState(saved, f.context);
    expect(loaded.serviceOperations[0]!.diagnosticPhaseWork?.readIncomeFee).toBe(5);
    const bad = JSON.parse(saved) as GameState;
    bad.serviceOperations[0]!.diagnosticPhaseWork!.readIncomeFee = 6;
    expect(() => deserializeGameState(JSON.stringify(bad), f.context)).toThrow(/read fee/);
    f.state = loaded; advance(f, 5);
    expect(centerReceipts(f.state)).toHaveLength(1);
    const completed = f.state.serviceOperations.find(entry => entry.id === job.id)!;
    const retainedPlan = f.state.encounters[f.encounter.id]!.pendingResult!.diagnosticTiming!;
    const retainedPhase = retainedPlan.phases.find(entry => entry.id === read.phase.id)!;
    Object.assign(retainedPhase, { readingUpgradeWork: structuredClone(completed.diagnosticPhaseWork!.readingUpgradeWork),
      remainingMinutes: 0, resource: structuredClone(completed.diagnosticPhaseWork!.resource),
      status: "completed", startedAtTick: completed.phaseStartedAtFacilityTick, completedAtTick: completed.completedAtFacilityTick });
    retainedPlan.resultReady.reachedAtTick = completed.completedAtFacilityTick;
    replaceDiagnosticOrderPlan(f.state.encounters[f.encounter.id]!, forecastDiagnosticOrderPlan(f.state, retainedPlan, f.context).plan);
    f.state = deserializeGameState(serializeGameState(f.state), f.context);
    advance(f, 6);
    expect(centerReceipts(f.state)).toHaveLength(1);
    expect(getRadiologistReadIncomeSummary(f.state, f.context).thisLevel.inHouseReads).toBe(1);
  });

  it("shows zero today/level after their boundaries without changing the saved cash", () => {
    const f = fixture(); advanceServiceOperations(f.state, f.context); advance(f, 5);
    f.state.facilityTick = operatingDayMinutes(f.context);
    expect(getRadiologistReadIncomeSummary(f.state, f.context).today.outsideReads).toBe(0);
    expect(getRadiologistReadIncomeSummary(f.state, f.context).thisLevel.outsideReads).toBe(1);
    f.state.facilityLevel = 2;
    expect(getRadiologistReadIncomeSummary(f.state, f.context).thisLevel.outsideReads).toBe(0);
  });

  it("includes outside-read income in the existing end-of-day money total", () => {
    const f = fixture(); advanceServiceOperations(f.state, f.context); advance(f, 5);
    f.state.facilityTick = operatingDayMinutes(f.context);
    expect(captureClinicDaySummary(f.state, f.context).moneyEarnedCents).toBe(500);
  });

  it("preserves read totals after routine receipt retirement and a save round-trip", () => {
    const f = fixture(); advanceServiceOperations(f.state, f.context); advance(f, 300);
    f.state.facilityTick += operatingDayMinutes(f.context);
    retireFinishedServiceHistory(f.state, f.context);
    expect(f.state.serviceIncomeReceipts.length).toBeLessThanOrEqual(50);
    f.state = deserializeGameState(serializeGameState(f.state), f.context);
    expect(getRadiologistReadIncomeSummary(f.state, f.context).thisLevel).toMatchObject({ outsideReads: 60, outsideIncomeCents: 30_000 });
  });
});
