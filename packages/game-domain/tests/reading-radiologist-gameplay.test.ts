import { describe, expect, it } from "vitest";
import { DIAGNOSTIC_READING_WORKSTATIONS, RADIOLOGIST_IN_HOUSE_INCOME_LINE_ID, RADIOLOGIST_OUTSIDE_INCOME_LINE_ID } from "@gamify-surgery/balance-config";
import {
  PROTOTYPE_DOMAIN_CONTEXT, createInitialGameState, gameReducer,
  getRadiologistReadingStation, getRadiologistReadIncomeSummary,
  enableReadingPhase, planDiagnosticOrder, startDiagnosticProcessingOperation,
  deserializeGameState, findCareAwareFacilityPath, getReadingWorkMinutes, serializeGameState,
  advanceOutsideRadiologyReads,
  type DiagnosticOrderPhase, type DiagnosticOrderPlan, type DoorState, type GameState,
} from "../src";

function readingCampaign(upgradeLevel: 1 | 4 = 1, readerCount = 2,
  door: Pick<DoorState, "side" | "offset"> = { side: "west", offset: 1 }): GameState {
  let state = createInitialGameState();
  state.facilityLevel = 3;
  state.paused = false;
  state.cash = 20_000; state.cashCents = 2_000_000;
  state.encounters = {}; state.serviceOperations = [];
  state.serviceAppointmentsEnabled = false;
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  state.nextFinancialPostingTick = Number.MAX_SAFE_INTEGER;
  state.nextEmployeeDiscussionTick = Number.MAX_SAFE_INTEGER;
  state.rooms.push({ id: "room.readers", roomDefinitionId: "room.reading", x: 33, y: 20,
    orientation: 0, doorSide: null, upgradeLevel, cleanliness: 100 },
    ...[
      ...Array.from({ length: 10 }, (_, i) => ({ x: 32, y: 19 + i })),
      ...Array.from({ length: 6 }, (_, i) => ({ x: 37, y: 19 + i })),
      ...[19, 24].flatMap(y => Array.from({ length: 4 }, (_, i) => ({ x: 33 + i, y }))),
    ].map((point, i) => ({ id: `room.reading-hall.${i}`,
      roomDefinitionId: "room.hallway", ...point, orientation: 0 as const,
      doorSide: null, upgradeLevel: 1 as const })));
  state.doors.push({ id: "door.readers", roomId: "room.readers", ...door, exterior: false },
    { id: "door.front.readers", roomId: "room.instance.founder_desk", side: "west", offset: 0, exterior: false });
  for (let i = 1; i <= readerCount; i++) state = gameReducer(state, { type: "HIRE_STAFF",
    operationId: `hire.reader.${i}`, employeeId: `reader.${i}`, staffRoleDefinitionId: "staff.radiologist" });
  expect(state.employees).toHaveLength(readerCount);
  return state;
}

function tick(state: GameState): GameState {
  return gameReducer(state, { type: "ADVANCE_TICK", operationId: `tick.${state.facilityTick + 1}` });
}

function advance(state: GameState, minutes: number): GameState {
  for (let i = 0; i < minutes; i++) state = tick(state);
  return state;
}

function retainedSoutheastCampaign(): GameState {
  let state = readingCampaign(1, 3);
  state = gameReducer(state, { type: "FIRE_EMPLOYEE", operationId: "dismiss.reader.2", employeeId: "reader.2" });
  expect(state.employees.map(employee => employee.readingStationId)).toEqual(["northwest", "southeast"]);
  return state;
}

const outsideReceipts = (state: GameState, employeeId?: string) => state.serviceIncomeReceipts.filter(receipt =>
  receipt.incomeLineId === RADIOLOGIST_OUTSIDE_INCOME_LINE_ID && (!employeeId || receipt.actorId === employeeId));

function expectContinuousOutsideWork(state: GameState, upgradeLevel: 1 | 4) {
  for (const employee of state.employees) {
    expect(employee.location).toEqual(getRadiologistReadingStation(state, employee, PROTOTYPE_DOMAIN_CONTEXT)!.location);
    const expectedReads = Math.floor((state.facilityTick - employee.lastMovedAtFacilityTick) / getReadingWorkMinutes(5, 0, upgradeLevel));
    expect(expectedReads).toBeGreaterThanOrEqual(5);
    expect(outsideReceipts(state, employee.id)).toHaveLength(expectedReads);
    expect(state.outsideRadiologyReads?.filter(read => read.employeeId === employee.id)).toHaveLength(1);
  }
  expect(new Set(state.outsideRadiologyReads?.map(read => read.stationId)).size).toBe(state.employees.length);
  expect(getRadiologistReadIncomeSummary(state, PROTOTYPE_DOMAIN_CONTEXT).today).toMatchObject({
    inHouseReads: 0, outsideReads: outsideReceipts(state).length, outsideIncomeCents: outsideReceipts(state).length * 500,
  });
}

function readyCenterStudy(state: GameState, id: string) {
  const patient = structuredClone(Object.values(createInitialGameState().encounters)[0]!);
  patient.id = id;
  state.encounters[id] = patient;
  const quote = planDiagnosticOrder(state, { orderId: `order.${id}`, encounterId: id,
    serviceId: "service.ultrasound", allowedRouteIds: ["route.ultrasound.outsourced"] }, PROTOTYPE_DOMAIN_CONTEXT);
  if (quote.kind !== "planned") throw new Error(quote.reason);
  const phase = quote.plan.phases.find(entry => entry.kind === "interpretation")!;
  const complete = (plan: DiagnosticOrderPlan, entry: DiagnosticOrderPhase) => {
    for (const dependencyId of entry.dependsOn) {
      const dependency = plan.phases.find(candidate => candidate.id === dependencyId)!;
      complete(plan, dependency);
      Object.assign(dependency, { status: "completed", startedAtTick: state.facilityTick,
        completedAtTick: state.facilityTick, remainingMinutes: 0 });
    }
  };
  complete(quote.plan, phase);
  enableReadingPhase(quote.plan, phase, state.facilityTick);
  return { plan: quote.plan, phase };
}

describe("approved Reading Room campaign with two radiologists", () => {
  it.each([1, 4] as const)("both hired readers settle and earn outside income at Reading Room upgrade %s", (upgradeLevel) => {
    expectContinuousOutsideWork(advance(readingCampaign(upgradeLevel), 60), upgradeLevel);
  });

  it("keeps the second remaining hired radiologist at the southeast station after a dismissal", () => {
    expectContinuousOutsideWork(advance(retainedSoutheastCampaign(), 70), 1);
  });

  it("keeps reading outside studies while a real team discussion is waiting to be opened", () => {
    let state = readingCampaign();
    state.nextEmployeeDiscussionTick = 30;
    state = advance(state, 70);
    const discussion = Object.values(state.employeeDiscussions ?? {}).find(discussion => discussion.lifecycle === "waiting_unopened")!;
    expect(discussion).toBeDefined();
    expectContinuousOutsideWork(state, 1);
    for (const lifecycle of ["active_traveling", "active_action_required", "feedback_pending"] as const) {
      discussion.lifecycle = lifecycle;
      advanceOutsideRadiologyReads(state, PROTOTYPE_DOMAIN_CONTEXT, true);
      expect(state.outsideRadiologyReads?.some(read => read.employeeId === discussion.employeeId)).toBe(false);
    }
    discussion.lifecycle = "resolved_summary_available";
    advanceOutsideRadiologyReads(state, PROTOTYPE_DOMAIN_CONTEXT, true);
    expect(state.outsideRadiologyReads?.some(read => read.employeeId === discussion.employeeId)).toBe(true);
  });

  it.each([false, true])("assigns two simultaneously ready center studies to both available readers, retained southeast=%s", (southeast) => {
    let state = advance(southeast ? retainedSoutheastCampaign() : readingCampaign(), 60);
    const studies = [readyCenterStudy(state, "patient.a"), readyCenterStudy(state, "patient.b")];
    for (const study of studies) expect(study.phase.resource).toBeNull();
    for (const study of studies) startDiagnosticProcessingOperation(state, study.plan, study.phase.id, PROTOTYPE_DOMAIN_CONTEXT);
    for (let i = 0; i < 2; i++) state = tick(state);
    const reads = state.serviceOperations.filter(operation => operation.diagnosticPhaseWork?.kind === "interpretation");
    expect(reads.map(read => read.status)).toEqual(["in_service", "in_service"]);
    expect(new Set(reads.flatMap(read => read.reservedEmployeeIds)).size).toBe(2);
    expect(new Set(reads.map(read => read.diagnosticPhaseWork?.resource?.stationId)).size).toBe(2);
    for (let i = 0; i < 7; i++) state = tick(state);
    expect(state.serviceIncomeReceipts.filter(receipt => receipt.incomeLineId === RADIOLOGIST_IN_HOUSE_INCOME_LINE_ID)).toHaveLength(2);
    expect(getRadiologistReadIncomeSummary(state, PROTOTYPE_DOMAIN_CONTEXT).today).toMatchObject({ inHouseReads: 2, inHouseIncomeCents: 1000 });
    expect(state.outsideRadiologyReads).toHaveLength(2);
  });

  it.each((["north", "east", "south", "west"] as const).flatMap(side =>
    [0, 1, 2, 3].map(offset => ({ side, offset }))))("reaches all four seats and keeps all four readers earning through door $side/$offset", (door) => {
    let state = readingCampaign(1, 4, door);
    const room = state.rooms.find(candidate => candidate.id === "room.readers")!;
    const definition = PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility.roomDefinitions.find(candidate => candidate.id === "room.reading")!;
    expect({ width: definition.width, height: definition.height, orientation: room.orientation }).toEqual({ width: 4, height: 4, orientation: 0 });
    expect(state.employees.map(employee => employee.readingStationId)).toEqual(DIAGNOSTIC_READING_WORKSTATIONS.map(station => station.id));
    const blocked = new Set(definition.navigation!.blockedTiles.map(point => `${room.x + point.x},${room.y + point.y}`));
    // Hiring includes the exterior sidewalk. Observe current indoor positions
    // after the actual arrival route has crossed the public entrance.
    state = advance(state, 24);
    for (const employee of state.employees) {
      const post = getRadiologistReadingStation(state, employee, PROTOTYPE_DOMAIN_CONTEXT)!;
      const path = findCareAwareFacilityPath(state, PROTOTYPE_DOMAIN_CONTEXT, employee.location, post.location);
      expect(path.length).toBeGreaterThan(1);
      expect(path.at(-1)).toEqual(post.location);
      expect(path.slice(0, -1).some(point => blocked.has(`${point.x},${point.y}`))).toBe(false);
    }
    state = advance(state, 46);
    expectContinuousOutsideWork(state, 1);
  });

  it("recovers an old saved southeast-to-northwest wandering route without load-time income", () => {
    let state = advance(retainedSoutheastCampaign(), 38);
    const southeast = state.employees.find(employee => employee.readingStationId === "southeast")!;
    const northwest = getRadiologistReadingStation(state, state.employees[0]!, PROTOTYPE_DOMAIN_CONTEXT)!;
    southeast.path = findCareAwareFacilityPath(state, PROTOTYPE_DOMAIN_CONTEXT, southeast.location, northwest.location);
    southeast.pathIndex = 0; southeast.lastMovedAtFacilityTick = state.facilityTick;
    state.outsideRadiologyReads = state.outsideRadiologyReads?.filter(read => read.employeeId !== southeast.id);
    const cash = state.cashCents; const receipts = structuredClone(state.serviceIncomeReceipts);
    state = deserializeGameState(serializeGameState(state));
    expect(state.cashCents).toBe(cash); expect(state.serviceIncomeReceipts).toEqual(receipts);
    const before = outsideReceipts(state, southeast.id).length;
    state = advance(state, 40);
    expect(state.employees.find(employee => employee.id === southeast.id)?.readingStationId).toBe("southeast");
    expect(state.employees.find(employee => employee.id === southeast.id)?.location).toEqual({ x: 35, y: 22 });
    expect(outsideReceipts(state, southeast.id).length - before).toBeGreaterThanOrEqual(5);
    expect(state.outsideRadiologyReads).toHaveLength(2);
  });

  it("finishes real automatic breaks, returns each reader to their own desk and resumes outside income", () => {
    let state = advance(retainedSoutheastCampaign(), 60);
    state.rooms.push({ id: "room.reader-break", roomDefinitionId: "room.staff_break", x: 28, y: 20,
      orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 });
    state.doors.push({ id: "door.reader-break", roomId: "room.reader-break", side: "east", offset: 2, exterior: false });
    state = tick(state);
    expect(state.employees.every(employee => employee.facilityTask?.kind === "take_break")).toBe(true);
    expect(state.outsideRadiologyReads).toHaveLength(0);
    const receiptsAtBreak = outsideReceipts(state).length;
    let observedReturn = false;
    for (let i = 0; i < 60; i++) {
      state = tick(state);
      for (const employee of state.employees) if (!employee.facilityTask && employee.path.length > 1) {
        expect(employee.path.at(-1)).toEqual(getRadiologistReadingStation(state, employee, PROTOTYPE_DOMAIN_CONTEXT)!.location);
        observedReturn = true;
      }
    }
    expect(observedReturn).toBe(true);
    expect(state.employees.every(employee => employee.lastBreakAtFacilityTick != null)).toBe(true);
    expect(state.outsideRadiologyReads).toHaveLength(2);
    expect(outsideReceipts(state).length - receiptsAtBreak).toBeGreaterThanOrEqual(4);
  });
});
