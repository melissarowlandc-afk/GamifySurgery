import { describe, expect, it } from "vitest";
import {
  advanceEmployeeTraining, advanceLevelThreeSupport, advanceServiceOperations, bindReadingUpgradeWork, compareReadingQueueKeys, createReadingUpgradeWork,
  deserializeGameState, enableReadingPhase, forecastDiagnosticOrderPlan, gameReducer, getEmployeeTrainingPlaces,
  getQueuedEmployeeTrainingDepartures, getRadiologistReadingStation, getReadingUpgradeMinutes, readingOperationQueueKey,
  interruptServiceOperationsForEmployeeDismissal, interruptServiceOperationsForRoomSale, isEmployeeAwayForTraining,
  normalizeDiagnosticOrderPlan, normalizeReadingUpgradeWork, planDiagnosticOrder, quoteReadingUpgradeWork,
  reconcileReadingStations, requestEmployeeTraining, serializeGameState, startDiagnosticProcessingOperation, startRetailPurchase,
  createEmployeeRoomUpgradeSupportWork,
  type DiagnosticOrderPhase, type DiagnosticOrderPlan, type EmployeeState, type GameState, type RoomUpgradeLevel, type ServiceOperationState,
} from "../src";
import { advanceDiagnosticOrders, replaceDiagnosticOrderPlan } from "../src/diagnostic-orders";
import { pending, timingFixture } from "./diagnostic-timing-fixtures";

type Fixture = ReturnType<typeof timingFixture>;
const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;
let sequence = 0;
function fixture(level: RoomUpgradeLevel = 2, readers = 1) {
  const f = timingFixture();
  f.state.serviceAppointmentsEnabled = false;
  f.state.cashCents = 1_000_000; f.state.cash = 10_000;
  f.state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  f.state.nextFinancialPostingTick = Number.MAX_SAFE_INTEGER;
  f.state.environment.nextLitterSpawnTick = Number.MAX_SAFE_INTEGER;
  f.state.environment.nextWaterCoolerDrainTick = Number.MAX_SAFE_INTEGER;
  const room = f.addRoom("room.reading", "staff.radiologist", readers).room;
  room.upgradeLevel = level;
  reconcileReadingStations(f.state);
  for (const employee of f.state.employees) {
    const post = getRadiologistReadingStation(f.state, employee, f.context)!;
    employee.location = { ...post.location }; employee.path = [{ ...post.location }]; employee.pathIndex = 0;
  }
  return { ...f, room, reader: f.state.employees[0]! };
}
function accept(f: Fixture, id = `reading.${sequence++}`) {
  const quote = planDiagnosticOrder(f.state, { orderId: id, encounterId: f.encounter.id,
    serviceId: "service.ultrasound", allowedRouteIds: ["route.ultrasound.outsourced"] }, f.context);
  if (quote.kind !== "planned") throw new Error(quote.reason);
  return { plan: quote.plan, phase: quote.plan.phases.find((phase) => phase.kind === "interpretation")! };
}
function completeDependencies(plan: DiagnosticOrderPlan, phase: DiagnosticOrderPhase, at: number) {
  for (const id of phase.dependsOn) {
    const dependency = plan.phases.find((entry) => entry.id === id)!;
    completeDependencies(plan, dependency, at);
    Object.assign(dependency, { status: "completed", startedAtTick: at, completedAtTick: at, remainingMinutes: 0 });
  }
}
function prepare(f: Fixture, id?: string, readerIndex?: number) {
  const read = accept(f, id);
  completeDependencies(read.plan, read.phase, f.state.facilityTick);
  enableReadingPhase(read.plan, read.phase, f.state.facilityTick);
  if (readerIndex !== undefined) {
    const reader = f.state.employees.filter((employee) => employee.staffRoleDefinitionId === "staff.radiologist")[readerIndex]!;
    const post = getRadiologistReadingStation(f.state, reader, f.context)!;
    read.phase.resource = { roomInstanceId: post.roomInstanceId, roomDefinitionId: "room.reading", stationId: post.station.id,
      employeeIds: [reader.id], provider: null, patientAnchor: post.location, staffAnchor: post.location };
    read.phase.readingUpgradeWork!.quotedRoomInstanceId = post.roomInstanceId;
    read.phase.durationMinutes = read.phase.remainingMinutes = quoteReadingUpgradeWork(read.phase.readingUpgradeWork!, post.roomInstanceId);
  }
  return read;
}
function start(f: Fixture, read: ReturnType<typeof accept>) {
  const id = startDiagnosticProcessingOperation(f.state, read.plan, read.phase.id, f.context);
  expect(id).not.toBeNull();
  return f.state.serviceOperations.find((entry) => entry.id === id)!;
}
function advance(f: Fixture, at: number) { f.state.facilityTick = at; advanceServiceOperations(f.state, f.context); }
function sync(f: Fixture, read: ReturnType<typeof accept>, job: ServiceOperationState) {
  const work = job.diagnosticPhaseWork!;
  Object.assign(read.phase, { readingUpgradeWork: clone(work.readingUpgradeWork), durationMinutes: work.durationMinutes,
    remainingMinutes: work.remainingMinutes, resource: clone(work.resource), serviceOperationId: job.id,
    startedAtTick: job.phaseStartedAtFacilityTick, completedAtTick: job.completedAtFacilityTick,
    status: job.status === "completed" ? "completed" : job.phaseStartedAtFacilityTick === null ? "queued" : "active" });
  const refreshed = forecastDiagnosticOrderPlan(f.state, read.plan, f.context).plan;
  read.plan = refreshed; read.phase = refreshed.phases.find((phase) => phase.kind === "interpretation")!;
  if (job.status === "completed") read.plan.resultReady.reachedAtTick = job.completedAtFacilityTick;
  f.encounter.pendingResult = pending(read.plan);
  return read;
}
function roundtrip(f: Fixture): GameState { return deserializeGameState(serializeGameState(f.state), f.context); }
function addCopy(f: ReturnType<typeof fixture>, level: RoomUpgradeLevel, employeeId = "reader.copy", y = 21) {
  const room = { ...f.room, id: `room.reading.copy.${sequence++}`, x: 8, y, upgradeLevel: level };
  f.state.rooms.push(room);
  f.state.doors.push({ id: `door.${room.id}`, roomId: room.id, side: "west", offset: 1, exterior: false });
  const employee: EmployeeState = { ...clone(f.reader), id: employeeId, homeRoomInstanceId: room.id, readingStationId: undefined, facilityTask: null, training: null };
  f.state.employees.push(employee);
  reconcileReadingStations(f.state);
  const post = getRadiologistReadingStation(f.state, employee, f.context)!;
  employee.location = { ...post.location }; employee.path = [{ ...post.location }]; employee.pathIndex = 0;
  return { room, employee, post };
}

function occupiedTraining(f: ReturnType<typeof fixture>, remaining: number[] = [6, 60], roomLevel: RoomUpgradeLevel = 1) {
  const room = f.addRoom("room.training").room; room.upgradeLevel = roomLevel;
  f.addRoom("room.phlebotomy", "staff.phlebotomist", 2);
  const places = getEmployeeTrainingPlaces(f.state, f.context);
  const trainees = f.state.employees.filter(employee => employee.staffRoleDefinitionId === "staff.phlebotomist");
  trainees.forEach((employee, index) => {
    requestEmployeeTraining(f.state, employee.id, f.context);
    Object.assign(employee.training!, { stage: "training", roomInstanceId: places[index]!.roomInstanceId, placeId: places[index]!.placeId,
      startedAtFacilityTick: 0, lastProgressAtFacilityTick: 0, remainingMinutes: remaining[index], roomUpgradeWork: undefined });
    employee.location = clone(places[index]!.location); employee.path = [{ ...employee.location }]; employee.pathIndex = 0;
  });
  return { room, places, trainees };
}
function linkedStart(f: ReturnType<typeof fixture>, read: ReturnType<typeof accept>) {
  const job = start(f, read); read.phase.serviceOperationId = job.id; return job;
}
function previewRead(f: ReturnType<typeof fixture>, read: ReturnType<typeof accept>) {
  const before = JSON.stringify(f.state), original = JSON.stringify(read.plan);
  const result = forecastDiagnosticOrderPlan(f.state, read.plan, f.context).plan.phases.find(phase => phase.kind === "interpretation")!;
  expect(JSON.stringify(f.state)).toBe(before); expect(JSON.stringify(read.plan)).toBe(original);
  return result;
}
function trainingTick(f: ReturnType<typeof fixture>, at: number) {
  advance(f, at); advanceEmployeeTraining(f.state, f.context);
}

describe("Reading forecasts share execution order and future training cohorts", () => {
  it.each([false, true])("keeps a compatible preferred reader when another station offers a token, reverse=%s", (reverse) => {
    const f = fixture(2, 2), a = linkedStart(f, prepare(f, "preferred.a", 0));
    const bRead = prepare(f, "preferred.b", 1), next = prepare(f, "preferred.next", 1);
    f.state.facilityTick = 2;
    const b = linkedStart(f, bRead), nextJob = linkedStart(f, next);
    if (reverse) f.state.serviceOperations.reverse();
    f.state.facilityTick = 3;
    const forecast = previewRead(f, next);
    expect(forecast.forecast).toMatchObject({ startsAtTick: 6.5, endsAtTick: 11 });
    expect(forecast.resource!.employeeIds).toEqual([f.state.employees[1]!.id]);
    advance(f, 5); expect(a.completedAtFacilityTick).toBe(4.5); expect(nextJob.phaseStartedAtFacilityTick).toBeNull();
    advance(f, 7); expect(b.completedAtFacilityTick).toBe(6.5);
    expect(nextJob.phaseStartedAtFacilityTick).toBe(6.5); expect(nextJob.phaseEndsAtFacilityTick).toBe(11);
    expect(nextJob.diagnosticPhaseWork!.resource!.employeeIds).toEqual([f.state.employees[1]!.id]);
  });

  it.each([false, true])("keeps ordinary legacy manual30 on integer boundaries after a marked read, interrupted=%s", (interrupted) => {
    const f = fixture(), first = linkedStart(f, prepare(f, "ordinary.marked")), manualRead = prepare(f, "ordinary.manual");
    const manual: ServiceOperationState = { ...clone(first), id: "ordinary.legacy.manual", actorId: "ordinary.legacy.manual", diagnosticPhaseWork: undefined,
      status: "waiting_for_resources", startedAtFacilityTick: null, phaseStartedAtFacilityTick: null, phaseEndsAtFacilityTick: null,
      reservedEmployeeIds: [], reservedRoomInstanceIds: [],
      frozenOperationPhases: [{ id: "manual30", durationMinutes: 30, roomDefinitionId: "room.reading", staffRoleDefinitionIds: ["staff.radiologist"] }] };
    f.state.serviceOperations.push(manual);
    manualRead.phase.readingUpgradeWork = undefined; manualRead.phase.durationMinutes = manualRead.phase.remainingMinutes = 30;
    manualRead.phase.serviceOperationId = manual.id;
    if (interrupted) f.state.employeeDiscussions = { conflict: { employeeId: f.reader.id, lifecycle: "open" } as any };
    const quote = previewRead(f, manualRead);
    expect(quote.forecast).toMatchObject({ startsAtTick: 5, endsAtTick: 35 });
    expect(Number.isSafeInteger(quote.forecast.startsAtTick)).toBe(true); expect(Number.isSafeInteger(quote.forecast.endsAtTick)).toBe(true);
    expect(quote.durationMinutes).toBe(30); expect(manual.frozenOperationPhases![0]!.durationMinutes).toBe(30);
    expect(first.phaseEndsAtFacilityTick).toBe(4.5);
  });

  it.each([20, 21])("reports dependency-ready queue time independently of the future reservation event, now=%s", (now) => {
    const f = fixture(1); f.state.facilityTick = now;
    const busyRead = prepare(f, `queue.busy.${now}`), busy = linkedStart(f, busyRead);
    busy.diagnosticPhaseWork = undefined;
    busy.frozenOperationPhases = [{ id: "manual200", durationMinutes: 200, roomDefinitionId: "room.reading", staffRoleDefinitionIds: ["staff.radiologist"] }];
    busy.phaseEndsAtFacilityTick = now + 200;
    const read = accept(f, `queue.next.${now}`), dependency = read.plan.phases.find(phase => phase.id === read.phase.dependsOn[0])!;
    completeDependencies(read.plan, dependency, now);
    Object.assign(dependency, { kind: "acquisition", mode: "external", patientPresent: false, requirement: null, resource: null,
      durationMinutes: 70, remainingMinutes: 70, status: "pending", startedAtTick: null, completedAtTick: null });
    const work = clone(read.phase.readingUpgradeWork), quote = previewRead(f, read);
    expect(quote.forecast).toMatchObject({ readyAtTick: now + 70, startsAtTick: now + 200, endsAtTick: now + 205, queueMinutes: 130, walkingMinutes: 0 });
    expect(quote.readingUpgradeWork).toEqual(work); expect(quote.status).toBe("pending"); expect(quote.startedAtTick).toBeNull();
  });

  it.each(["original", "reverse", "shuffle"] as const)("orders late factories by original readiness, array=%s", (order) => {
    const f = fixture(), first = linkedStart(f, prepare(f, "late.first")), a = prepare(f, "late.a");
    f.state.facilityTick = 1;
    const b = prepare(f, "late.b"), bJob = linkedStart(f, b);
    f.state.facilityTick = 2;
    const aJob = linkedStart(f, a);
    if (order === "reverse") f.state.serviceOperations.reverse();
    if (order === "shuffle") f.state.serviceOperations = [bJob, aJob, first];
    expect(readingOperationQueueKey(aJob)).toMatchObject({ readyAtTick: 0, acceptedAtTick: 0 });
    expect(previewRead(f, a).forecast).toMatchObject({ startsAtTick: 4.5, endsAtTick: 9 });
    expect(previewRead(f, b).forecast).toMatchObject({ startsAtTick: 9, endsAtTick: 13.5 });
    advance(f, 5); expect(aJob.phaseStartedAtFacilityTick).toBe(4.5); expect(bJob.phaseStartedAtFacilityTick).toBeNull();
    advance(f, 9); expect(bJob.phaseStartedAtFacilityTick).toBe(9);
  });

  it("inserts an accepted unmaterialized order before a later factory without changing its witnesses", () => {
    const f = fixture(); linkedStart(f, prepare(f, "unmaterialized.first"));
    const a = prepare(f, "unmaterialized.a"); f.encounter.pendingResult = pending(a.plan);
    f.state.facilityTick = 1;
    const b = prepare(f, "unmaterialized.b"), bJob = linkedStart(f, b);
    f.state.facilityTick = 2;
    expect(previewRead(f, a).forecast).toMatchObject({ startsAtTick: 4.5, endsAtTick: 9 });
    expect(previewRead(f, b).forecast).toMatchObject({ startsAtTick: 9, endsAtTick: 13.5 });
    expect(a.phase.serviceOperationId).toBeNull(); expect(a.phase.readingUpgradeWork!.durationMinutes).toBeNull();
    const aJob = linkedStart(f, a);
    advance(f, 5); expect(aJob.phaseStartedAtFacilityTick).toBe(4.5); expect(bJob.phaseStartedAtFacilityTick).toBeNull();
  });

  it("uses a transitive Reading key for stable ties", () => {
    const key = { readyAtTick: 2, acceptedAtTick: 1, orderId: "a", phaseId: "a", operationId: "a" };
    const later = [ { ...key, readyAtTick: 3 }, { ...key, acceptedAtTick: 2 }, { ...key, orderId: "b" },
      { ...key, phaseId: "b" }, { ...key, operationId: "b" } ];
    for (const other of later) { expect(compareReadingQueueKeys(key, other)).toBeLessThan(0); expect(compareReadingQueueKeys(other, key)).toBeGreaterThan(0); }
    expect(compareReadingQueueKeys(key, { ...key })).toBe(0);
  });

  it("forecasts a later departure at 9 and full frozen return at 80 across reloads", () => {
    const f = fixture(); occupiedTraining(f);
    const reads = [0, 1, 2].map(n => prepare(f, `return.${n}`)), ids = reads.map(read => linkedStart(f, read).id);
    const readerId = f.reader.id; requestEmployeeTraining(f.state, readerId, f.context);
    f.state.facilityTick = 1;
    expect(previewRead(f, reads[2]!).forecast).toMatchObject({ startsAtTick: 80, endsAtTick: 84.5 });
    for (let at = 1; at <= 85; at++) {
      trainingTick(f, at);
      if ([5, 6, 9].includes(at)) {
        if (at === 5) expect(previewRead(f, reads[2]!).forecast).toMatchObject({ startsAtTick: 80, endsAtTick: 84.5 });
        f.state = roundtrip(f); f.reader = f.state.employees.find(employee => employee.id === readerId)!;
        expect(previewRead(f, reads[2]!).forecast).toMatchObject({ startsAtTick: 80, endsAtTick: 84.5 });
      }
      if (at === 9) expect(f.reader.training!.stage).toBe("walking_to_training");
    }
    const jobs = ids.map(id => f.state.serviceOperations.find(job => job.id === id)!);
    expect(jobs.map(job => job.phaseStartedAtFacilityTick)).toEqual([0, 4.5, 80]);
    expect(jobs[2]!.completedAtFacilityTick).toBe(84.5);
    expect(f.reader.trainingLevel).toBe(2); expect(jobs[2]!.diagnosticPhaseWork!.durationMinutes).toBe(4.5);
  });

  it.each([false, true, "shuffle"] as const)("projects an entire future two-reader cohort before one FIFO departure, array=%s", (order) => {
    const f = fixture(2, 2); occupiedTraining(f);
    const readers = f.state.employees.filter(employee => employee.staffRoleDefinitionId === "staff.radiologist");
    const reads = [0, 1, 2, 3, 4, 5].map(n => prepare(f, `cohort.${n}`, n % 2)), jobs = reads.map(read => linkedStart(f, read));
    requestEmployeeTraining(f.state, readers[1]!.id, f.context); requestEmployeeTraining(f.state, readers[0]!.id, f.context);
    if (order === true) { f.state.serviceOperations.reverse(); f.state.employees.reverse(); }
    if (order === "shuffle") {
      f.state.serviceOperations = [jobs[3]!, jobs[0]!, jobs[5]!, jobs[2]!, jobs[4]!, jobs[1]!];
      const trainees = f.state.employees.filter(employee => employee.staffRoleDefinitionId === "staff.phlebotomist");
      f.state.employees = [trainees[1]!, readers[0]!, trainees[0]!, readers[1]!];
    }
    f.state.facilityTick = 1;
    expect(previewRead(f, reads[4]!).forecast).toMatchObject({ startsAtTick: 9, endsAtTick: 13.5 });
    for (let at = 1; at <= 9; at++) trainingTick(f, at);
    expect(readers[1]!.training!.stage).toBe("walking_to_training"); expect(readers[0]!.training!.stage).toBe("queued");
    expect(jobs[4]!.phaseStartedAtFacilityTick).toBe(9); expect(jobs[5]!.phaseStartedAtFacilityTick).toBeNull();
  });

  it("selects FIFO for unequal exact completions in the same observing cohort", () => {
    const f = fixture(2, 2); occupiedTraining(f);
    const readers = f.state.employees.filter(employee => employee.staffRoleDefinitionId === "staff.radiologist");
    const reads = [0, 1, 2, 3, 4, 5].map(n => prepare(f, `unequal.${n}`, n % 2)), jobs = reads.map(read => linkedStart(f, read));
    for (let n = 2; n <= 3; n++) { bindReadingUpgradeWork(jobs[n]!.diagnosticPhaseWork!.readingUpgradeWork!, f.room.id); jobs[n]!.diagnosticPhaseWork!.remainingMinutes = n === 2 ? 4.1 : 4.4; }
    requestEmployeeTraining(f.state, readers[1]!.id, f.context); requestEmployeeTraining(f.state, readers[0]!.id, f.context);
    f.state.facilityTick = 1;
    expect(previewRead(f, reads[4]!).forecast.startsAtTick).toBeCloseTo(8.6);
    for (let at = 1; at <= 9; at++) trainingTick(f, at);
    expect(readers[1]!.training!.stage).toBe("walking_to_training"); expect(readers[0]!.training!.stage).toBe("queued");
    expect(jobs[4]!.phaseStartedAtFacilityTick).toBeCloseTo(8.6); expect(jobs[5]!.phaseStartedAtFacilityTick).toBeNull();
  });

  it("keeps an earlier FIFO reader's committed successor busy until its own later completion", () => {
    const f = fixture(2, 2); occupiedTraining(f, [8, 60]);
    const [a, b] = f.state.employees.filter(employee => employee.staffRoleDefinitionId === "staff.radiologist");
    b!.facilityTask = { kind: "refill_water", targetId: f.room.id, startedAtFacilityTick: 0, workMinutesRemaining: 2 };
    const bFirst = prepare(f, "busy.00.b", 1);
    linkedStart(f, prepare(f, "busy.00.a", 0));
    const aNext = prepare(f, "busy.01.a", 0); linkedStart(f, aNext);
    const bNext = prepare(f, "busy.02.b", 1), aThird = prepare(f, "busy.03.a", 0);
    f.state.facilityTick = 2; b!.facilityTask = null;
    linkedStart(f, bFirst); const bJob = linkedStart(f, bNext); const aJob = linkedStart(f, aThird);
    requestEmployeeTraining(f.state, b!.id, f.context); requestEmployeeTraining(f.state, a!.id, f.context);
    f.state.facilityTick = 3;
    expect(previewRead(f, bNext).forecast).toMatchObject({ startsAtTick: 6.5, endsAtTick: 11 });
    expect(previewRead(f, aThird).forecast).toMatchObject({ startsAtTick: 11, endsAtTick: 15.5 });
    for (let at = 3; at <= 9; at++) trainingTick(f, at);
    expect(a!.training!.stage).toBe("walking_to_training"); expect(b!.training!.stage).toBe("queued");
    expect(bJob.phaseStartedAtFacilityTick).toBe(6.5); expect(bJob.phaseEndsAtFacilityTick).toBe(11); expect(aJob.phaseStartedAtFacilityTick).toBeNull();
    trainingTick(f, 10); trainingTick(f, 11);
    expect(aJob.phaseStartedAtFacilityTick).toBe(11); expect(aJob.diagnosticPhaseWork!.resource!.employeeIds).toEqual([b!.id]);
  });

  it.each([2, 5])("projects validated fractional EVS work before global FIFO seat selection, baseline=%s", (baseline) => {
    const f = fixture(); occupiedTraining(f);
    const home = f.addRoom("room.evs_closet", "staff.evs_worker").room; home.upgradeLevel = 2;
    const evs = f.state.employees.find(employee => employee.staffRoleDefinitionId === "staff.evs_worker")!;
    const work = createEmployeeRoomUpgradeSupportWork(f.state, evs, "cleaning_duration_reduction_percent", baseline, 0, f.context)!;
    expect(work.durationMinutes).toBe(baseline === 2 ? 1.8 : 4.5);
    if (baseline === 2) f.state.environment.litterItems.push({ id: "litter.fifo", roomId: home.id, location: clone(evs.location), spawnedAtFacilityTick: 0 });
    else home.cleanliness = 60;
    evs.facilityTask = { kind: baseline === 2 ? "collect_litter" : "clean_room", targetId: baseline === 2 ? "litter.fifo" : home.id,
      startedAtFacilityTick: 0, workMinutesRemaining: work.durationMinutes!, roomUpgradeWork: work, cleanlinessRestore: 40 };
    evs.path = [{ ...evs.location }]; evs.pathIndex = 0;
    const reads = [0, 1, 2].map(n => prepare(f, `fractional.${baseline}.${n}`)), ids = reads.map(read => linkedStart(f, read).id);
    requestEmployeeTraining(f.state, evs.id, f.context); requestEmployeeTraining(f.state, f.reader.id, f.context);
    f.state.facilityTick = 1;
    expect(previewRead(f, reads[2]!).forecast).toMatchObject({ startsAtTick: 9, endsAtTick: 13.5 });
    f.state.facilityTick = 0;
    for (let at = 1; at <= 9; at++) {
      f.state = gameReducer(f.state, { type: "ADVANCE_TICK", operationId: `fifo.evs.${baseline}.${at}` }, f.context);
      if (at === Math.ceil(work.durationMinutes!)) {
        expect(f.state.employees.find(employee => employee.id === evs.id)!.facilityTask).toBeNull();
        expect(baseline === 2 ? f.state.environment.lastLitterCleanupAtTick : f.state.environment.lastEvsRoomCleanupAtTick).toBe(at);
      }
    }
    expect(f.state.employees.find(employee => employee.id === evs.id)!.training!.stage).toBe("walking_to_training");
    expect(f.state.employees.find(employee => employee.id === f.reader.id)!.training!.stage).toBe("queued");
    expect(f.state.serviceOperations.find(job => job.id === ids[2])!.phaseStartedAtFacilityTick).toBe(9);
  });

  it.each(["unmarked", "unreachable"] as const)("does not retire an unknown or unreachable fractional duty: %s", (kind) => {
    const f = fixture(); occupiedTraining(f);
    const home = f.addRoom("room.evs_closet", "staff.evs_worker").room; home.upgradeLevel = 2;
    const evs = f.state.employees.find(employee => employee.staffRoleDefinitionId === "staff.evs_worker")!;
    const work = createEmployeeRoomUpgradeSupportWork(f.state, evs, "cleaning_duration_reduction_percent", 5, 0, f.context)!;
    evs.facilityTask = { kind: "clean_room", targetId: home.id, startedAtFacilityTick: 0, workMinutesRemaining: 4.5,
      ...(kind === "unreachable" ? { roomUpgradeWork: work } : {}) };
    if (kind === "unreachable") evs.location = { x: 70, y: 70 };
    const reads = [0, 1, 2].map(n => prepare(f, `unknown.${kind}.${n}`)); reads.forEach(read => linkedStart(f, read));
    requestEmployeeTraining(f.state, evs.id, f.context); requestEmployeeTraining(f.state, f.reader.id, f.context);
    f.state.facilityTick = 1;
    expect(previewRead(f, reads[2]!).forecast).toMatchObject({ startsAtTick: 80, endsAtTick: 84.5 });
  });

  it.each([true, false])("uses private future dependency readiness only for an enabled target, enabled=%s", (enabled) => {
    const f = fixture(), first = linkedStart(f, prepare(f, `prospective.first.${enabled}`));
    const read = accept(f, `prospective.next.${enabled}`), dependency = read.plan.phases.find(phase => phase.id === read.phase.dependsOn[0])!;
    completeDependencies(read.plan, dependency, 0);
    Object.assign(dependency, { kind: "acquisition", mode: "external", patientPresent: false, requirement: null, resource: null,
      durationMinutes: 2, remainingMinutes: 2, status: "active", startedAtTick: 0, completedAtTick: null,
      forecast: { ...dependency.forecast, readyAtTick: 0, startsAtTick: 0, endsAtTick: 2, patientPath: [], employeePaths: [], walkingMinutes: 0 } });
    if (enabled) enableReadingPhase(read.plan, read.phase, 0);
    expect(read.phase.readingUpgradeWork!.readyAtTick).toBeNull();
    const forecast = previewRead(f, read);
    expect(forecast.forecast).toMatchObject({ startsAtTick: enabled ? 4.5 : 5, endsAtTick: enabled ? 9 : 9.5 });
    expect(forecast.readingUpgradeWork).toMatchObject({ readyAtTick: null, executionEnabledAtTick: enabled ? 0 : null });
    if (!enabled) return;
    f.encounter.pendingResult = pending(read.plan); f.encounter.steps[0]!.status = "result_pending";
    const actions = { walkingPath: () => [], startMovement: () => {}, roomAt: () => null, releaseCare: () => {}, careCompleted: () => {} };
    for (let at = 1; at <= 5; at++) {
      advance(f, at); advanceDiagnosticOrders(f.state, f.context, actions);
    }
    const job = f.state.serviceOperations.find(entry => entry.diagnosticPhaseWork?.orderId === read.plan.orderId)!;
    expect(first.completedAtFacilityTick).toBe(4.5); expect(job.phaseStartedAtFacilityTick).toBe(4.5); expect(job.phaseEndsAtFacilityTick).toBe(9);
    expect(job.diagnosticPhaseWork!.readingUpgradeWork!.readyAtTick).toBe(2);
  });

  it("retains projected seat claims until genuine completion, then returns a reader before another departs", () => {
    const f = fixture(2, 2); occupiedTraining(f, [6, 60], 5);
    const readers = f.state.employees.filter(employee => employee.staffRoleDefinitionId === "staff.radiologist");
    const reads = Array.from({ length: 16 }, (_, n) => prepare(f, `persistent.${String(n).padStart(2, "0")}`, n % 2));
    const jobs = reads.map(read => linkedStart(f, read));
    requestEmployeeTraining(f.state, readers[0]!.id, f.context); requestEmployeeTraining(f.state, readers[1]!.id, f.context);
    f.state.facilityTick = 1;
    const forecast = previewRead(f, reads[13]!);
    expect(forecast.forecast).toMatchObject({ startsAtTick: 56, endsAtTick: 60.5 });
    for (let at = 1; at <= 56; at++) {
      trainingTick(f, at);
      expect(f.state.employees.filter(employee => employee.training?.roomInstanceId &&
        ["walking_to_training", "training"].includes(employee.training.stage)).length).toBeLessThanOrEqual(2);
      if (at === 9) { expect(readers[0]!.training!.stage).toBe("walking_to_training"); expect(readers[1]!.training!.stage).toBe("queued"); }
      if (at === 50) expect(readers[1]!.training!.stage).toBe("walking_to_training");
    }
    expect(jobs[13]!.phaseStartedAtFacilityTick).toBe(56); expect(jobs[13]!.phaseEndsAtFacilityTick).toBe(60.5);
    expect(jobs[13]!.diagnosticPhaseWork!.resource!.employeeIds).toEqual([readers[0]!.id]);
  });

  it("quotes an accepted alternate copy when it becomes free at a future training departure", () => {
    const f = fixture(); occupiedTraining(f); const copy = addCopy(f, 5, "future.copy.reader", 33);
    copy.employee.facilityTask = { kind: "refill_water", targetId: copy.room.id, startedAtFacilityTick: 0, workMinutesRemaining: 9 };
    const reads = [0, 1, 2].map(n => prepare(f, `future.copy.${n}`, 0)), jobs = reads.map(read => linkedStart(f, read));
    requestEmployeeTraining(f.state, f.reader.id, f.context);
    const quoted = previewRead(f, reads[2]!);
    expect(quoted.forecast).toMatchObject({ startsAtTick: 9, endsAtTick: 12 });
    expect(quoted.durationMinutes).toBe(3); expect(quoted.remainingMinutes).toBe(3);
    expect(quoted.readingUpgradeWork).toMatchObject({ quotedRoomInstanceId: copy.room.id, durationMinutes: null, boundRoomInstanceId: null });
    expect(reads[2]!.phase.readingUpgradeWork!.quotedRoomInstanceId).toBe(f.room.id);
    for (let at = 1; at <= 9; at++) {
      if (at === 9) copy.employee.facilityTask = null;
      trainingTick(f, at);
    }
    expect(jobs[2]!.phaseStartedAtFacilityTick).toBe(9); expect(jobs[2]!.phaseEndsAtFacilityTick).toBe(12);
    expect(jobs[2]!.diagnosticPhaseWork!.resource!.roomInstanceId).toBe(copy.room.id);
  });

  it("replays all new terminal image components coherently without factories or saved witness changes", () => {
    const f = fixture(); occupiedTraining(f);
    [0, 1, 2].map(n => prepare(f, `new.plan.backlog.${n}`)).forEach(read => linkedStart(f, read));
    requestEmployeeTraining(f.state, f.reader.id, f.context);
    const ultrasound = f.addRoom("room.ultrasound", "staff.imaging_technician");
    f.encounter.patientLocation = clone(ultrasound.anchor);
    const request = { orderId: "new.plan.multiple", encounterId: f.encounter.id, patientOrigin: ultrasound.anchor, patientReturnLocation: ultrasound.anchor,
      components: [{ componentId: "one", serviceId: "service.ultrasound" }, { componentId: "two", serviceId: "service.ultrasound" }] };
    f.state.facilityTick = 1;
    const before = JSON.stringify(f.state), quote = planDiagnosticOrder(f.state, request, f.context);
    if (quote.kind !== "planned") throw new Error(quote.reason);
    expect(JSON.stringify(f.state)).toBe(before);
    const phases = quote.plan.phases.filter(phase => phase.kind === "interpretation");
    expect(phases).toHaveLength(2);
    expect(phases.map(phase => phase.forecast.startsAtTick)).toEqual([85, 91]);
    expect(quote.plan.resultReady.forecastAtTick).toBe(Math.max(...phases.map(phase => phase.forecast.endsAtTick)));
    for (const phase of phases) expect(phase.readingUpgradeWork).toMatchObject({ acceptedAtTick: 1, executionEnabledAtTick: null,
      readyAtTick: null, durationMinutes: null, boundRoomInstanceId: null });
    const expected = clone(quote.plan);
    phases[0]!.forecast.employeePaths[0]!.path[0]!.x = -999;
    phases[0]!.readingUpgradeWork!.acceptedRooms[0]!.upgradeLevel = 5;
    const next = planDiagnosticOrder(f.state, request, f.context);
    if (next.kind !== "planned") throw new Error(next.reason);
    expect(next.plan).toEqual(expected); expect(JSON.stringify(f.state)).toBe(before);
    const refreshed = forecastDiagnosticOrderPlan(f.state, expected, f.context);
    expect(refreshed.blockedPhaseIds).toEqual([]);
    expect(refreshed.plan.phases.filter(phase => phase.kind === "interpretation").map(phase => phase.forecast)).toEqual(expected.phases.filter(phase => phase.kind === "interpretation").map(phase => phase.forecast));
  });
});

describe("accepted local Reading upgrades", () => {
  it.each([1, 2, 3, 4, 5] as const)("quotes and executes level %i with one interpretation fee", (level) => {
    const f = fixture(level), read = prepare(f), expected = 5 * (1 - (level - 1) / 10);
    expect(read.phase.durationMinutes).toBe(expected);
    const job = start(f, read);
    expect(job.phaseEndsAtFacilityTick).toBe(expected);
    expect(job.diagnosticPhaseWork!.readingUpgradeWork).toMatchObject({ baselineMinutes: 5, acceptedAtTick: 0, boundUpgradeLevel: level });
    const cash = f.state.cashCents;
    advance(f, Math.ceil(expected));
    expect(job.completedAtFacilityTick).toBe(expected);
    expect(f.state.cashCents).toBe(cash + 500);
    expect(f.state.serviceIncomeReceipts.filter(receipt => receipt.incomeLineId === "income.radiologist_in_house_read")).toHaveLength(1);
    advance(f, 10);
    expect(f.state.serviceIncomeReceipts.filter(receipt => receipt.incomeLineId === "income.radiologist_in_house_read")).toHaveLength(1);
  });

  it("combines the original raw staff factor with the actual room before rounding", () => {
    const f = fixture(2); f.reader.trainingLevel = 3;
    const read = prepare(f), job = start(f, read);
    expect(read.phase.durationMinutes).toBeCloseTo(3.6);
    expect(job.phaseEndsAtFacilityTick).toBeCloseTo(3.6);
    expect(getReadingUpgradeMinutes(100, 5)).toBe(1);
    const work = createReadingUpgradeWork(f.state, 7.5, f.room.id);
    expect(quoteReadingUpgradeWork(work, f.room.id)).toBeCloseTo(4.1625);
  });

  it.each([1, 2, 3, 4, 5] as const)("retains a fractional category mean at room level %i", (level) => {
    const f = fixture(level, 2); f.reader.trainingLevel = 2; f.state.employees[1]!.trainingLevel = 3;
    const read = prepare(f, undefined, 0), expected = 5 * 0.85 * (1 - (level - 1) / 10), job = start(f, read);
    expect(read.phase.readingUpgradeWork!.employeeReductionPercent).toBe(15);
    expect(read.phase.durationMinutes).toBeCloseTo(expected); expect(job.phaseEndsAtFacilityTick).toBeCloseTo(expected);
  });

  it("freezes purchases and category skill at original acceptance, before a late factory", () => {
    const f = fixture(2), read = prepare(f);
    f.room.upgradeLevel = 5; f.reader.trainingLevel = 5; f.state.facilityTick = 5;
    const job = start(f, read);
    expect(job.diagnosticPhaseWork!.durationMinutes).toBe(4.5);
    expect(job.phaseStartedAtFacilityTick).toBe(5); expect(job.phaseEndsAtFacilityTick).toBe(9.5);
    expect(job.diagnosticPhaseWork!.readingUpgradeWork!.acceptedAtTick).toBe(0);
  });

  it("uses the accepted alternate copy at first actual seating, coherently quoted while unbound", () => {
    const f = fixture(2), copy = addCopy(f, 5), read = prepare(f, undefined, 0);
    // The initially preferred employee cannot leave their current other duty.
    f.reader.facilityTask = { kind: "refill_water", targetId: f.room.id, startedAtFacilityTick: 0, workMinutesRemaining: 10 };
    copy.employee.facilityTask = { kind: "refill_water", targetId: copy.room.id, startedAtFacilityTick: 0, workMinutesRemaining: 10 };
    const job = start(f, read);
    expect(job.status).toBe("waiting_for_resources");
    read.phase.serviceOperationId = job.id;
    f.reader.homeRoomInstanceId = null;
    copy.employee.facilityTask = null;
    const forecast = forecastDiagnosticOrderPlan(f.state, read.plan, f.context).plan;
    const quoted = forecast.phases.find((phase) => phase.kind === "interpretation")!;
    expect(quoted.durationMinutes).toBe(3); expect(quoted.remainingMinutes).toBe(3);
    expect(quoted.readingUpgradeWork).toMatchObject({ quotedRoomInstanceId: copy.room.id, durationMinutes: null, boundRoomInstanceId: null });
    expect(normalizeDiagnosticOrderPlan(forecast)).not.toBeNull();
    advance(f, 1);
    expect(job.diagnosticPhaseWork!.resource!.roomInstanceId).toBe(copy.room.id);
    expect(job.diagnosticPhaseWork!.durationMinutes).toBe(3);
  });

  it("binds a post-acceptance copy at neutral level 1 and never rescales bound work", () => {
    const f = fixture(5), read = prepare(f), copy = addCopy(f, 5);
    f.reader.homeRoomInstanceId = null;
    const job = start(f, read);
    expect(job.diagnosticPhaseWork!.durationMinutes).toBe(5);
    expect(job.diagnosticPhaseWork!.readingUpgradeWork).toMatchObject({ boundRoomInstanceId: copy.room.id, boundUpgradeLevel: 1 });
    expect(normalizeReadingUpgradeWork(job.diagnosticPhaseWork!.readingUpgradeWork)).not.toBeNull();
    copy.room.upgradeLevel = 2; copy.employee.trainingLevel = 5;
    expect(bindReadingUpgradeWork(job.diagnosticPhaseWork!.readingUpgradeWork!, f.room.id)).toBe(5);
    advance(f, 5); expect(job.completedAtFacilityTick).toBe(5);
  });

  it.each([false, true, "shuffle"] as const)("drains three 4.5-minute reads at 5/9/14 independently of array order: %s", (order) => {
    const f = fixture(), reads = [0, 1, 2].map((n) => prepare(f, `backlog.${n}`)), jobs = reads.map((read) => start(f, read));
    if (order === true) f.state.serviceOperations.reverse();
    if (order === "shuffle") f.state.serviceOperations = [jobs[1]!, jobs[2]!, jobs[0]!];
    const events: Array<[number, number]> = [], seen = new Set<string>();
    for (let at = 1; at <= 14; at++) {
      advance(f, at);
      for (const job of jobs) if (job.status === "completed" && !seen.has(job.id)) { seen.add(job.id); events.push([at, job.completedAtFacilityTick!]); }
    }
    expect(events).toEqual([[5, 4.5], [9, 9], [14, 13.5]]);
    expect(jobs.map((job) => job.phaseStartedAtFacilityTick)).toEqual([0, 4.5, 9]);
  });

  it("preserves four simultaneous stations and queues the fifth", () => {
    const f = fixture(2, 4);
    const jobs = [0, 1, 2, 3, 4].map((n) => start(f, prepare(f, `parallel.${n}`, n % 4)));
    expect(jobs.filter((job) => job.status === "in_service")).toHaveLength(4);
    expect(new Set(jobs.slice(0, 4).map((job) => job.diagnosticPhaseWork!.resource!.stationId)).size).toBe(4);
    advance(f, 5); expect(jobs[4]!.phaseStartedAtFacilityTick).toBe(4.5);
  });

  it("inherits its private station proof through multiple subminute resumed jobs", () => {
    const f = fixture(), jobs = [0, 1, 2, 3].map((n) => start(f, prepare(f, `small.${n}`)));
    for (const job of jobs.slice(1)) {
      bindReadingUpgradeWork(job.diagnosticPhaseWork!.readingUpgradeWork!, f.room.id);
      job.diagnosticPhaseWork!.remainingMinutes = 0.1;
    }
    advance(f, 5);
    expect(jobs.every((job) => job.status === "completed")).toBe(true);
    expect(jobs.map((job) => job.completedAtFacilityTick)).toEqual([4.5, 4.6, 4.699999999999999, 4.799999999999999]);
  });

  it.each([false, true])("keeps exact preview and execution for a real active backlog, competing activity=%s", (conflict) => {
    const f = fixture(), first = start(f, prepare(f, "forecast.first")), read = prepare(f, "forecast.second"), second = start(f, read);
    read.phase.serviceOperationId = second.id;
    if (conflict) f.state.employeeDiscussions = { conflict: { employeeId: f.reader.id, lifecycle: "open" } as any };
    f.state.facilityTick = 1;
    const forecast = forecastDiagnosticOrderPlan(f.state, read.plan, f.context).plan.phases.find((phase) => phase.kind === "interpretation")!;
    expect(forecast.forecast.startsAtTick).toBe(conflict ? 5 : 4.5);
    expect(forecast.forecast.endsAtTick).toBe(conflict ? 9.5 : 9);
    advance(f, 5);
    expect(first.completedAtFacilityTick).toBe(4.5); expect(second.phaseStartedAtFacilityTick).toBe(forecast.forecast.startsAtTick);
    expect(second.phaseEndsAtFacilityTick).toBe(forecast.forecast.endsAtTick);
  });

  it("has the same observed backlog through real ADVANCE_TICK and reload", () => {
    const f = fixture(), jobs = [0, 1, 2].map((n) => start(f, prepare(f, `reducer.${n}`)));
    let state = f.state;
    const events: Array<[number, number]> = [], seen = new Set<string>();
    for (let at = 1; at <= 14; at++) {
      state = gameReducer(state, { type: "ADVANCE_TICK", operationId: `reading.tick.${sequence++}` }, f.context);
      if (at === 5 || at === 9) state = deserializeGameState(serializeGameState(state), f.context);
      for (const job of state.serviceOperations) if (job.diagnosticPhaseWork && job.status === "completed" && !seen.has(job.id)) {
        seen.add(job.id); events.push([at, job.completedAtFacilityTick!]);
      }
    }
    expect(events).toEqual([[5, 4.5], [9, 9], [14, 13.5]]);
    expect(state.serviceIncomeReceipts.filter(receipt => receipt.incomeLineId === "income.radiologist_in_house_read")).toHaveLength(3); expect(jobs).toHaveLength(3);
  });
});

describe("Reading completion gives queued training its whole-minute boundary", () => {
  it.each([false, true])("releases two due readers before selecting one free place, reversed=%s", (reverse) => {
    const f = fixture(2, 2); f.addRoom("room.training");
    f.addRoom("room.coffee_kiosk"); f.addRoom("room.break_room");
    const places = getEmployeeTrainingPlaces(f.state, f.context);
    const occupied = clone(f.reader); occupied.id = "occupied.trainee"; occupied.facilityTask = null;
    occupied.staffRoleDefinitionId = "staff.phlebotomist"; occupied.homeRoomInstanceId = f.addRoom("room.phlebotomy").room.id;
    f.state.employees.push(occupied);
    requestEmployeeTraining(f.state, occupied.id, f.context);
    Object.assign(occupied.training!, { stage: "training", roomInstanceId: places[0]!.roomInstanceId, placeId: places[0]!.placeId,
      startedAtFacilityTick: 0, remainingMinutes: 40 });
    occupied.training!.roomUpgradeWork = undefined;
    occupied.location = { ...places[0]!.location }; occupied.path = [{ ...occupied.location }];
    const readers = f.state.employees.slice(0, 2);
    const jobs = [0, 1, 2, 3].map((n) => start(f, prepare(f, `training.${n}`, n % 2)));
    requestEmployeeTraining(f.state, readers[1]!.id, f.context); // Earlier request wins, despite ID/resource order.
    requestEmployeeTraining(f.state, readers[0]!.id, f.context);
    if (reverse) f.state.serviceOperations.reverse();
    advance(f, 5);
    expect(isEmployeeAwayForTraining(readers[1]!)).toBe(true);
    expect(isEmployeeAwayForTraining(readers[0]!)).toBe(false);
    expect(jobs[2]!.phaseStartedAtFacilityTick).toBe(4.5);
    expect(jobs[3]!.status).toBe("waiting_for_resources");
    readers[1]!.morale = 0;
    expect(startRetailPurchase(f.state, "income.coffee", "employee", readers[1]!.id, f.context)).toBeNull();
    advanceLevelThreeSupport(f.state, f.context);
    expect(readers[1]!.facilityTask).toBeNull();
    const another = start(f, prepare(f, "intervening.attempt"));
    expect(another.reservedEmployeeIds).not.toContain(readers[1]!.id);
    advanceEmployeeTraining(f.state, f.context);
    expect(readers[1]!.training!.stage).toBe("walking_to_training");
    expect(readers[0]!.training!.stage).toBe("queued");
    expect(occupied.training!.remainingMinutes).toBe(35);
    expect(f.state.employees.filter((employee) => employee.training?.roomInstanceId)).toHaveLength(2);
  });

  it("projects a genuinely finishing seat at observing tick 5, with no double progress", () => {
    const f = fixture(); f.addRoom("room.training");
    const home = f.addRoom("room.phlebotomy").room;
    const places = getEmployeeTrainingPlaces(f.state, f.context);
    for (let n = 0; n < 2; n++) {
      const employee = clone(f.reader); employee.id = `occupied.${n}`; employee.facilityTask = null;
      employee.staffRoleDefinitionId = "staff.phlebotomist"; employee.homeRoomInstanceId = home.id;
      f.state.employees.push(employee); requestEmployeeTraining(f.state, employee.id, f.context);
      Object.assign(employee.training!, { stage: "training", roomInstanceId: places[n]!.roomInstanceId, placeId: places[n]!.placeId,
        startedAtFacilityTick: 0, remainingMinutes: n === 0 ? 5 : 60, roomUpgradeWork: undefined });
      employee.location = { ...places[n]!.location }; employee.path = [{ ...employee.location }];
    }
    const first = start(f, prepare(f, "freed.0")), second = start(f, prepare(f, "freed.1"));
    requestEmployeeTraining(f.state, f.reader.id, f.context);
    f.state.facilityTick = 1;
    expect(getQueuedEmployeeTrainingDepartures(f.state, f.context, 5, new Set([first.id]), true).map((entry) => entry.employeeId)).toEqual([f.reader.id]);
    const preview = forecastDiagnosticOrderPlan(f.state, prepare(f, "preview.after.freed", 0).plan, f.context);
    expect(preview.plan.phases.find((phase) => phase.kind === "interpretation")!.forecast.startsAtTick).toBeGreaterThan(60);
    advance(f, 5); expect(second.status).toBe("waiting_for_resources");
    expect(f.state.employees[1]!.training!.stage).toBe("training"); // Projection did not mutate the real seat.
    advanceEmployeeTraining(f.state, f.context);
    expect(f.state.employees[1]!.training!.stage).toBe("returning");
    expect(f.state.employees[2]!.training!.remainingMinutes).toBe(55);
    expect(f.reader.training!.stage).toBe("walking_to_training");
  });

  it("does not free a blocked or just-arrived nominal seat", () => {
    const f = fixture(); const room = f.addRoom("room.training").room;
    requestEmployeeTraining(f.state, f.reader.id, f.context); advanceEmployeeTraining(f.state, f.context);
    const session = f.reader.training!;
    session.remainingMinutes = 1; session.stage = "walking_to_training";
    const places = getEmployeeTrainingPlaces(f.state, f.context), spare = addCopy(f, 1).employee;
    requestEmployeeTraining(f.state, spare.id, f.context);
    const projected = getQueuedEmployeeTrainingDepartures(f.state, f.context, 5, new Set(), true);
    expect(projected[0]!.place.placeId).not.toBe(session.placeId);
    session.stage = "training"; session.startedAtFacilityTick = 0; f.reader.location = { ...places[0]!.location };
    f.state.doors = f.state.doors.filter((door) => door.roomId !== room.id);
    expect(getQueuedEmployeeTrainingDepartures(f.state, f.context, 5, new Set(), true)).toEqual([]);
  });
});

describe("Reading continuity exclusions and actual readiness", () => {
  it.each(["late_factory", "late_acceptance", "late_enablement", "late_dependency"] as const)("uses original witnesses at the exact-end cutoff: %s", (kind) => {
    const f = fixture(), first = start(f, prepare(f, "cutoff.first"));
    let read = accept(f, "cutoff.second");
    if (kind !== "late_enablement") enableReadingPhase(read.plan, read.phase, 0);
    completeDependencies(read.plan, read.phase, kind === "late_dependency" ? 5 : 0);
    f.state.facilityTick = 5;
    if (kind === "late_acceptance") read = prepare(f, "cutoff.new");
    const second = start(f, read);
    advance(f, 5);
    expect(first.completedAtFacilityTick).toBe(4.5);
    expect(second.phaseStartedAtFacilityTick).toBe(kind === "late_factory" ? 4.5 : 5);
    expect(second.diagnosticPhaseWork!.readingUpgradeWork!.readyAtTick).toBe(kind === "late_factory" ? 0 : 5);
  });

  it("does not use a dependency forecast or enact a feedback-pending plan", () => {
    const f = fixture(), read = accept(f);
    completeDependencies(read.plan, read.phase, 0);
    f.encounter.pendingResult = pending(read.plan);
    const step = f.encounter.steps[0]!;
    step.status = "feedback_pending";
    step.result = { ...step.result, diagnosticTiming: clone(read.plan) } as NonNullable<typeof step.result>;
    const actions = { walkingPath: () => [], startMovement: () => {}, roomAt: () => null, releaseCare: () => {}, careCompleted: () => {} };
    advanceDiagnosticOrders(f.state, f.context, actions);
    expect(f.state.serviceOperations).toHaveLength(0);
    expect(f.encounter.pendingResult!.diagnosticTiming!.phases.find((phase) => phase.kind === "interpretation")!.readingUpgradeWork!.executionEnabledAtTick).toBeNull();
    f.state.facilityTick = 5; step.status = "result_pending";
    advanceDiagnosticOrders(f.state, f.context, actions);
    const job = f.state.serviceOperations.find((entry) => entry.diagnosticPhaseWork)!;
    expect(job.phaseStartedAtFacilityTick).toBe(5);
    expect(job.diagnosticPhaseWork!.readingUpgradeWork!.executionEnabledAtTick).toBe(5);
    expect(job.diagnosticPhaseWork!.readingUpgradeWork!.readyAtTick).toBe(5);

    const other = accept(f); other.phase.forecast.readyAtTick = 0;
    expect(startDiagnosticProcessingOperation(f.state, other.plan, other.phase.id, f.context)).toBeNull();
  });

  it("never reconstructs a carry token from completed history or an idle gap", () => {
    const f = fixture(), first = start(f, prepare(f, "idle.first")), queuedBeforeCompletion = prepare(f, "idle.next");
    advance(f, 5); expect(first.completedAtFacilityTick).toBe(4.5);
    f.state = roundtrip(f);
    const second = start(f, queuedBeforeCompletion);
    expect(second.phaseStartedAtFacilityTick).toBe(5);
    advance(f, 10); f.state.facilityTick = 12;
    const third = start(f, prepare(f)); expect(third.phaseStartedAtFacilityTick).toBe(12);
  });

  it("keeps different desks independent and cannot donate a reader's fraction to another desk", () => {
    const f = fixture(2, 2), first = start(f, prepare(f, "different.0", 0));
    const otherReader = f.state.employees[1]!;
    otherReader.facilityTask = { kind: "refill_water", targetId: f.room.id, startedAtFacilityTick: 0, workMinutesRemaining: 5 };
    const second = start(f, prepare(f, "different.1", 1));
    f.state.facilityTick = 5; otherReader.facilityTask = null;
    advance(f, 5); expect(first.completedAtFacilityTick).toBe(4.5);
    expect(second.phaseStartedAtFacilityTick).toBe(5);
    expect(second.diagnosticPhaseWork!.resource!.employeeIds).toEqual([otherReader.id]);
  });

  it.each(["retail", "discussion", "praise", "movement"] as const)("does not carry through a competing activity or physical interruption: %s", (kind) => {
    const f = fixture(), first = start(f, prepare(f, "conflict.0")), second = start(f, prepare(f, "conflict.1"));
    if (kind === "retail") f.state.retailOperations.push({ id: "conflict.retail", status: "queued", actorKind: "employee", actorId: f.reader.id } as any);
    if (kind === "discussion") f.state.employeeDiscussions = { conflict: { employeeId: f.reader.id, lifecycle: "open" } as any };
    if (kind === "praise") f.state.environment.founderActivity = { kind: "praise_employee", targetId: f.reader.id } as any;
    if (kind === "movement") {
      f.reader.path = [{ x: 7, y: 4 }, { ...f.reader.location }]; f.reader.pathIndex = 1; f.reader.lastMovedAtFacilityTick = 5;
    }
    advance(f, 5);
    expect(first.completedAtFacilityTick).toBe(4.5);
    expect(second.phaseStartedAtFacilityTick).toBe(5);
  });

  it("does not backdate a moved reader that only reaches the actual station on the observing tick", () => {
    const f = fixture(); f.reader.location = { x: 7, y: 4 }; f.reader.path = [{ ...f.reader.location }];
    const first = start(f, prepare(f, "arriving.0")), second = start(f, prepare(f, "arriving.1"));
    expect(first.status).toBe("walking_to_service");
    f.reader.location = { ...first.diagnosticPhaseWork!.resource!.staffAnchor };
    f.reader.pathIndex = f.reader.path.length - 1; f.reader.lastMovedAtFacilityTick = 5;
    advance(f, 5);
    expect(first.phaseStartedAtFacilityTick).toBe(5); expect(first.phaseEndsAtFacilityTick).toBe(9.5);
    expect(second.status).toBe("waiting_for_resources");
  });

  it("starts a fresh segment after room sale, then may hand off only its new actual remainder", () => {
    const f = fixture(), read = prepare(f), first = start(f, read), copy = addCopy(f, 5);
    f.state.facilityTick = 4;
    interruptServiceOperationsForRoomSale(f.state, f.room.id, "room.reading", f.context);
    f.state.rooms = f.state.rooms.filter((room) => room.id !== f.room.id);
    f.state.employees = f.state.employees.filter((employee) => employee.id !== f.reader.id);
    expect(first.diagnosticPhaseWork!.remainingMinutes).toBe(0.5);
    advance(f, 5); expect(first.phaseStartedAtFacilityTick).toBe(5); expect(first.phaseEndsAtFacilityTick).toBe(5.5);
    const next = start(f, prepare(f)); advance(f, 6);
    expect(next.diagnosticPhaseWork!.resource!.roomInstanceId).toBe(copy.room.id);
    expect(next.phaseStartedAtFacilityTick).toBe(5.5); // Only the new continuous segment donates its endpoint.
  });

  it("keeps queued training working when both places remain occupied", () => {
    const f = fixture(); f.addRoom("room.training");
    const home = f.addRoom("room.phlebotomy").room;
    const places = getEmployeeTrainingPlaces(f.state, f.context);
    for (let n = 0; n < 2; n++) {
      const employee = clone(f.reader); employee.id = `full.${n}`; employee.facilityTask = null; f.state.employees.push(employee);
      employee.staffRoleDefinitionId = "staff.phlebotomist"; employee.homeRoomInstanceId = home.id;
      requestEmployeeTraining(f.state, employee.id, f.context);
      Object.assign(employee.training!, { stage: "training", roomInstanceId: places[n]!.roomInstanceId, placeId: places[n]!.placeId,
        startedAtFacilityTick: 0, remainingMinutes: 60, roomUpgradeWork: undefined });
      employee.location = { ...places[n]!.location }; employee.path = [{ ...employee.location }];
    }
    const first = start(f, prepare(f, "full.first", 0)), second = start(f, prepare(f, "full.second", 0));
    requestEmployeeTraining(f.state, f.reader.id, f.context);
    advance(f, 5); advanceEmployeeTraining(f.state, f.context);
    expect(first.completedAtFacilityTick).toBe(4.5); expect(second.phaseStartedAtFacilityTick).toBe(4.5);
    expect(f.reader.training!.stage).toBe("queued");
  });

  it("keeps reconstructed walking integral around fractional start, interruption, walking resume and reload", () => {
    const f = fixture(); f.reader.location = { x: 7, y: 4 }; f.reader.path = [{ ...f.reader.location }];
    const first = start(f, prepare(f, "walk.first")), read = prepare(f, "walk.second"), second = start(f, read);
    f.reader.location = { ...first.diagnosticPhaseWork!.resource!.staffAnchor }; f.reader.pathIndex = f.reader.path.length - 1; f.reader.lastMovedAtFacilityTick = 2;
    advance(f, 2); advance(f, 7); expect(second.phaseStartedAtFacilityTick).toBe(6.5);
    f.state.facilityTick = 8; interruptServiceOperationsForEmployeeDismissal(f.state, new Set([f.reader.id]));
    expect(second.diagnosticPhaseWork!.remainingMinutes).toBe(3);
    f.reader.location = { x: 7, y: 4 }; f.reader.path = [{ ...f.reader.location }]; f.reader.pathIndex = 0;
    advance(f, 9); expect(second.status).toBe("walking_to_service");
    sync(f, read, second);
    expect(Number.isSafeInteger(read.phase.forecast.walkingMinutes)).toBe(true);
    expect(normalizeDiagnosticOrderPlan(read.plan)).not.toBeNull();
    f.state = roundtrip(f);
    const reader = f.state.employees[0]!, resumed = f.state.serviceOperations.find((operation) => operation.id === second.id)!;
    reader.location = { ...resumed.diagnosticPhaseWork!.resource!.staffAnchor }; reader.pathIndex = reader.path.length - 1; reader.lastMovedAtFacilityTick = 10;
    advance(f, 10); expect(resumed.phaseStartedAtFacilityTick).toBe(10); expect(resumed.phaseEndsAtFacilityTick).toBe(13);
  });
});

describe("strict fractional Reading persistence", () => {
  it("roundtrips unbound acceptance across every live and history carrier", () => {
    const f = fixture(), { encounter } = f, { plan } = accept(f), source = plan.sources[0]!;
    encounter.pendingResult = pending(clone(plan)); encounter.steps[0]!.result = pending(clone(plan));
    encounter.testOnlyContinuation = { version: "test-only-continuation.v1", originatingNodeIndex: 0, serviceId: source.serviceId!, routeId: source.routeId!,
      routeDisplayName: source.routeDisplayName, incomeLineId: "income.ultrasound", externalRemainder: "Frozen protocol", status: "waiting_for_service",
      serviceOperationId: null, scheduledAtFacilityTick: 0, completedAtFacilityTick: null, diagnosticTiming: clone(plan) };
    encounter.terminalTestOrder = { version: "terminal-test-order.v1", caseId: encounter.frozenCase.id, nodeId: "node.fixture", questionVariantId: "question.fixture",
      choiceId: "choice.fixture", choiceLabel: "Fixture image", serviceId: source.serviceId!, routeId: source.routeId!, routeDisplayName: source.routeDisplayName,
      externalRemainder: null, status: "onsite_service", serviceOperationId: null, scheduledAtFacilityTick: 0, diagnosticTiming: clone(plan) };
    encounter.stagedResultOrder = { version: "staged-result-order.v1", originatingNodeIndex: 0, caseId: encounter.frozenCase.id, nodeId: "node.fixture", questionVariantId: "question.fixture",
      choiceId: "choice.fixture", choiceLabel: "Fixture image", status: "waiting_for_component", remainderMode: "external_processing", currentComponentIndex: 0,
      components: [{ componentId: "image", serviceId: source.serviceId!, routeId: source.routeId!, routeDisplayName: source.routeDisplayName, incomeLineId: "income.ultrasound", quoteFee: 50,
        operationPhases: [{ id: "scan", roomDefinitionId: "room.ultrasound", durationMinutes: 45, staffRoleDefinitionIds: ["staff.imaging_technician"] }],
        externalRemainder: "Frozen protocol", status: "waiting_for_service", serviceOperationId: null, diagnosticTiming: clone(plan) }],
      remainder: pending(clone(plan)), diagnosticTiming: clone(plan) };
    const restored = roundtrip(f).encounters[encounter.id]!;
    for (const carrier of [restored.pendingResult, restored.steps[0]!.result, restored.testOnlyContinuation, restored.terminalTestOrder,
      restored.stagedResultOrder, restored.stagedResultOrder!.remainder, restored.stagedResultOrder!.components[0]]) {
      expect(carrier!.diagnosticTiming).toEqual(plan);
    }
  });

  it("synchronizes first actual alternate binding to every carrier once", () => {
    const f = fixture(), copy = addCopy(f, 5), read = prepare(f, undefined, 0);
    f.encounter.pendingResult = pending(clone(read.plan)); f.encounter.steps[0]!.result = pending(clone(read.plan));
    f.reader.homeRoomInstanceId = null;
    const job = start(f, read);
    read.phase.serviceOperationId = job.id;
    replaceDiagnosticOrderPlan(f.encounter, read.plan);
    advanceDiagnosticOrders(f.state, f.context, { walkingPath: () => [], startMovement: () => {}, roomAt: () => null, releaseCare: () => {}, careCompleted: () => {} });
    for (const carrier of [f.encounter.pendingResult, f.encounter.steps[0]!.result]) {
      const phase = carrier!.diagnosticTiming!.phases.find((phase) => phase.kind === "interpretation")!;
      expect(phase.durationMinutes).toBe(3); expect(phase.readingUpgradeWork!.boundRoomInstanceId).toBe(copy.room.id);
      expect(phase.readingUpgradeWork).toEqual(job.diagnosticPhaseWork!.readingUpgradeWork);
    }
    expect(roundtrip(f).serviceOperations[0]!.diagnosticPhaseWork!.durationMinutes).toBe(3);
  });

  it("roundtrips queued work and then a start4.5/end9 segment with the linked carrier", () => {
    const f = fixture(); start(f, prepare(f, "queued.first")); const read = prepare(f, "queued.second"), job = start(f, read);
    sync(f, read, job); expect(roundtrip(f).encounters[f.encounter.id]!.pendingResult!.diagnosticTiming!.phases.find((phase) => phase.kind === "interpretation")!.status).toBe("queued");
    advance(f, 5); sync(f, read, job);
    const restored = roundtrip(f), saved = restored.serviceOperations.find((operation) => operation.id === job.id)!;
    expect(saved.phaseStartedAtFacilityTick).toBe(4.5); expect(saved.phaseEndsAtFacilityTick).toBe(9);
    expect(restored.encounters[f.encounter.id]!.pendingResult!.dueTick % 1).toBe(0);
  });
  it("roundtrips an accepted plan, then an active bound phase/operation and integer pending clocks", () => {
    const f = fixture(), read = prepare(f), job = start(f, read);
    sync(f, read, job);
    expect(roundtrip(f).serviceOperations[0]!.diagnosticPhaseWork).toEqual(job.diagnosticPhaseWork);
    advance(f, 5); sync(f, read, job);
    expect(roundtrip(f).encounters[f.encounter.id]!.pendingResult!.diagnosticTiming!.resultReady.reachedAtTick).toBe(4.5);
  });

  it.each([0, 0.5])("keeps a partial remainder %s through loss, reload and a different reader/copy", (remainder) => {
    const f = fixture(), read = prepare(f), job = start(f, read), copy = addCopy(f, 5);
    // Freeze a valid resumed segment ending 4.5; the interruption occurs at4 or5.
    f.state.facilityTick = remainder ? 4 : 5;
    interruptServiceOperationsForEmployeeDismissal(f.state, new Set([f.reader.id]));
    f.state.employees = f.state.employees.filter((employee) => employee.id !== f.reader.id);
    expect(job.diagnosticPhaseWork!.remainingMinutes).toBe(remainder);
    const restored = roundtrip(f); f.state = restored;
    const resumed = restored.serviceOperations[0]!;
    advance(f, restored.facilityTick + 1);
    expect(resumed.diagnosticPhaseWork!.durationMinutes).toBe(4.5);
    expect(resumed.diagnosticPhaseWork!.resource!.roomInstanceId).toBe(copy.room.id);
    expect(resumed.phaseEndsAtFacilityTick! - resumed.phaseStartedAtFacilityTick!).toBe(remainder);
    advance(f, restored.facilityTick + 1); expect(resumed.status).toBe("completed");
  });

  it.each([
    (raw: any) => { raw.serviceOperations[0].diagnosticPhaseWork.readingUpgradeWork.baselineMinutes = 6; },
    (raw: any) => { raw.serviceOperations[0].diagnosticPhaseWork.readingUpgradeWork.employeeReductionPercent = -1; },
    (raw: any) => { raw.serviceOperations[0].diagnosticPhaseWork.readingUpgradeWork.durationMinutes = 3; },
    (raw: any) => { raw.serviceOperations[0].diagnosticPhaseWork.remainingMinutes = -0.1; },
    (raw: any) => { raw.serviceOperations[0].phaseEndsAtFacilityTick = 4; },
    (raw: any) => { raw.serviceOperations[0].lastMovedAtFacilityTick = 0.5; },
    (raw: any) => { raw.serviceOperations[0].diagnosticPhaseWork.readingUpgradeWork.acceptedAtTick = 1; },
    (raw: any) => { raw.serviceOperations[0].diagnosticPhaseWork.readingUpgradeWork.executionEnabledAtTick = null; },
    (raw: any) => { raw.serviceOperations[0].diagnosticPhaseWork.readingUpgradeWork.durationMinutes += 1e-10; },
    (raw: any) => { raw.serviceOperations[0].frozenOperationPhases[0].id = "other.phase"; },
    (raw: any) => { raw.serviceOperations[0].diagnosticPhaseWork.readingUpgradeWork.boundUpgradeLevel = 1; },
  ])("rejects malformed marked work explicitly (%#)", (mutate) => {
    const f = fixture(), job = start(f, prepare(f));
    const raw = JSON.parse(serializeGameState(f.state)); mutate(raw);
    expect(() => deserializeGameState(JSON.stringify(raw), f.context)).toThrow(/reading|diagnostic/i);
    expect(job.status).toBe("in_service");
  });

  it.each([NaN, Infinity, -Infinity])("rejects nonfinite marker inputs directly: %s", (invalid) => {
    const f = fixture(), work = createReadingUpgradeWork(f.state, 0, f.room.id);
    for (const key of ["employeeReductionPercent", "acceptedAtTick", "executionEnabledAtTick", "readyAtTick", "durationMinutes"]) {
      expect(() => normalizeReadingUpgradeWork({ ...work, [key]: invalid })).toThrow(/reading/i);
    }
  });

  it.each(["acceptance", "readiness", "pre_enactment", "binding", "resource", "source_integer", "walking_integer"] as const)("rejects cross-field carrier/witness contradictions: %s", (kind) => {
    const f = fixture(), read = prepare(f), job = start(f, read); sync(f, read, job);
    const raw = JSON.parse(serializeGameState(f.state)), plan = raw.encounters[f.encounter.id].pendingResult.diagnosticTiming;
    const phase = plan.phases.find((phase: any) => phase.kind === "interpretation");
    if (kind === "acceptance") plan.createdAtTick = 1;
    if (kind === "readiness") phase.readingUpgradeWork.readyAtTick = 1;
    if (kind === "pre_enactment") {
      raw.encounters[f.encounter.id].steps[0].status = "feedback_pending";
      raw.encounters[f.encounter.id].steps[0].result = clone(raw.encounters[f.encounter.id].pendingResult);
    }
    if (kind === "binding") {
      const work = raw.serviceOperations[0].diagnosticPhaseWork;
      work.readingUpgradeWork.acceptedRooms[0].upgradeLevel = 3; work.readingUpgradeWork.boundUpgradeLevel = 3;
      work.readingUpgradeWork.durationMinutes = work.durationMinutes = work.remainingMinutes = 4;
      raw.serviceOperations[0].frozenOperationPhases[0].durationMinutes = 4; raw.serviceOperations[0].phaseEndsAtFacilityTick = 4;
    }
    if (kind === "resource") phase.resource.employeeIds[0] = "different.employee";
    if (kind === "source_integer") plan.sources[0].inclusiveDurationMinutes += 0.5;
    if (kind === "walking_integer") phase.forecast.walkingMinutes = 0.5;
    expect(() => deserializeGameState(JSON.stringify(raw), f.context)).toThrow(/reading|diagnostic/i);
  });

  it("keeps a historical paid manual30-minute read outside the upgrade clock", () => {
    const f = fixture(5), job = start(f, prepare(f));
    delete job.diagnosticPhaseWork;
    job.actorId = "manual.saved"; job.quoteFee = 40;
    job.frozenOperationPhases![0]!.durationMinutes = 30; job.phaseEndsAtFacilityTick = 30;
    f.reader.trainingLevel = 5;
    const restored = roundtrip(f); f.state = restored;
    advance(f, 29); expect(restored.serviceOperations[0]!.status).toBe("in_service");
    advance(f, 30); expect(restored.serviceOperations[0]!.completedAtFacilityTick).toBe(30);
    expect(restored.serviceOperations[0]!.frozenOperationPhases![0]!.durationMinutes).toBe(30);
    expect(restored.serviceIncomeReceipts).toHaveLength(1);
  });

  it("keeps legacy absence and its frozen integer five minutes after a new factory", () => {
    const f = fixture(5), read = prepare(f);
    delete read.phase.readingUpgradeWork; read.phase.durationMinutes = read.phase.remainingMinutes = 5;
    const job = start(f, read);
    expect(job.diagnosticPhaseWork!.readingUpgradeWork).toBeUndefined();
    expect(job.phaseEndsAtFacilityTick).toBe(5); expect(roundtrip(f).serviceOperations[0]!.diagnosticPhaseWork!.readingUpgradeWork).toBeUndefined();
  });
});
