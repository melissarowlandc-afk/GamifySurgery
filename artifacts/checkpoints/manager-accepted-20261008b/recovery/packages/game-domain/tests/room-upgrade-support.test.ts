import { describe, expect, it } from "vitest";
import {
  PROTOTYPE_DOMAIN_CONTEXT, advanceEmployeeMovement, advanceLevelThreeSupport,
  deserializeGameState, gameReducer, getEmployeeTrainingPlaces, getRoomDefinition,
  getRoomNavigationAnchor, isRoomOperationalForFacilityWork, requestEmployeeTraining,
  serializeGameState, type EmployeeState, type GameState, type PlacedRoom,
  type RoomUpgradeLevel,
} from "../src";
import { addTrainingEmployee, advanceTrainingMinutes, reachTrainingStage, trainingFixture } from "./employee-training-fixtures";

const levels = [1, 2, 3, 4, 5] as const;
const supportMinutes = [30, 27, 24, 21, 18];
let sequence = 0;
const reload = (state: GameState): GameState => deserializeGameState(serializeGameState(state));

function fixture(): GameState {
  const state = trainingFixture();
  state.rooms = state.rooms.filter((room) => room.roomDefinitionId === "room.front_desk");
  state.doors = state.doors.filter((door) => door.roomId === "room.instance.founder_desk");
  state.rooms.push(...Array.from({ length: 17 }, (_, index) => ({
    id: `room.support.hall.${15 + index}`, roomDefinitionId: "room.hallway", x: 32, y: 15 + index,
    orientation: 0 as const, doorSide: null, upgradeLevel: 1 as const, cleanliness: 100,
  })));
  state.retailNextOpportunityTicks["founder:founder"] = Number.MAX_SAFE_INTEGER;
  state.environment.nextAmbientPedestrianTick = Number.MAX_SAFE_INTEGER;
  return state;
}

function room(state: GameState, id: string, definitionId: string, y = 24, upgradeLevel: RoomUpgradeLevel = 1): PlacedRoom {
  const definition = getRoomDefinition(definitionId)!;
  const placed: PlacedRoom = {
    id, roomDefinitionId: definitionId, x: 32 - definition.width, y,
    orientation: 0, doorSide: null, upgradeLevel, cleanliness: 100,
  };
  state.rooms.push(placed);
  state.doors.push({ id: `door.${id}`, roomId: id, side: "east", offset: 1, exterior: false });
  return placed;
}

function employee(state: GameState, id: string): EmployeeState {
  return state.employees.find((candidate) => candidate.id === id)!;
}

function seated(state: GameState, id: string): void {
  const staff = employee(state, id);
  staff.location = { ...staff.path.at(-1)! };
  staff.pathIndex = staff.path.length - 1;
  staff.lastMovedAtFacilityTick = state.facilityTick;
}

function support(state: GameState, minutes = 1): void {
  for (let minute = 0; minute < minutes; minute++) {
    state.facilityTick++;
    advanceLevelThreeSupport(state, PROTOTYPE_DOMAIN_CONTEXT);
    advanceEmployeeMovement(state, PROTOTYPE_DOMAIN_CONTEXT);
  }
}

function tick(state: GameState, minutes = 1): GameState {
  for (let minute = 0; minute < minutes; minute++) state = gameReducer(state,
    { type: "ADVANCE_TICK", operationId: `support.upgrade.tick.${sequence++}` });
  return state;
}

function ambulatoryReceipt(state: GameState): void {
  state.serviceIncomeReceipts.push({
    id: "receipt.support.or", transactionKey: "receipt.support.or", incomeLineId: "income.ambulatory_operation",
    catalogVersion: 1, routeId: null, actorKind: "visitor", actorId: "visitor.support.or",
    grossAmount: 900, stockCost: 0, netCashDelta: 900, completedAtFacilityTick: state.facilityTick,
  });
}

function repairFixture(level: RoomUpgradeLevel = 1, staffLevel: RoomUpgradeLevel = 1): GameState {
  const state = fixture();
  room(state, "room.workshop.used", "room.maintenance_workshop", 20, level);
  room(state, "room.workshop.unused", "room.maintenance_workshop", 16, 5);
  const target = room(state, "room.repair.target", "room.pharmacy", 24, 5);
  target.maintenance = { status: "due", completedUses: 8, dueAtFacilityTick: 0, outOfServiceAtFacilityTick: 0, appliedUseKeys: ["use.support"] };
  addTrainingEmployee(state, "employee.repair", "staff.repair_person", "room.workshop.used").trainingLevel = staffLevel;
  return state;
}

function qiFixture(level: RoomUpgradeLevel = 1, staffLevel: RoomUpgradeLevel = 1): GameState {
  const state = fixture();
  room(state, "room.office.used", "room.surgeon_office", 24, level);
  room(state, "room.office.unused", "room.surgeon_office", 20, 5);
  addTrainingEmployee(state, "employee.surgeon", "staff.surgeon", "room.office.used").trainingLevel = staffLevel;
  ambulatoryReceipt(state);
  return state;
}

function breakFixture(level: RoomUpgradeLevel = 1): GameState {
  const state = fixture();
  room(state, "room.break.used", "room.staff_break", 24, level);
  room(state, "room.break.unused", "room.staff_break", 19, 5);
  addTrainingEmployee(state, "employee.break", "staff.evs_worker", "room.break.used").morale = 50;
  return state;
}

describe("accepted room upgrades in actual support work", () => {
  it.each(levels)("repairs use only the actual home workshop at Level %s", (level) => {
    const state = repairFixture(level);
    support(state);
    const staff = employee(state, "employee.repair");
    const duration = supportMinutes[level - 1]!;
    expect(staff.facilityTask).toMatchObject({ kind: "repair_room", workMinutesRemaining: duration,
      roomUpgradeWork: { boundRoomInstanceId: "room.workshop.used", boundUpgradeLevel: level, durationMinutes: duration } });
    expect(isRoomOperationalForFacilityWork(state, "room.workshop.unused")).toBe(true);
    while (staff.pathIndex < staff.path.length - 1) {
      support(state);
      expect(staff.facilityTask?.workMinutesRemaining).toBe(duration);
    }
    support(state, duration - 1);
    expect(staff.facilityTask?.workMinutesRemaining).toBe(1);
    expect(state.rooms.find((candidate) => candidate.id === "room.repair.target")?.maintenance?.status).toBe("out_of_service");
    support(state);
    expect(staff.facilityTask).toBeNull();
    expect(state.rooms.find((candidate) => candidate.id === "room.repair.target")?.maintenance).toMatchObject({ status: "operational", completedUses: 0, appliedUseKeys: ["use.support"] });
  });

  it.each(levels)("QI uses the performing surgeon's office at Level %s", (level) => {
    const state = qiFixture(level);
    const initialCash = state.cash;
    support(state);
    const duration = supportMinutes[level - 1]!;
    expect(state.levelThreeQiReviews[0]).toMatchObject({ status: "in_progress",
      trainingWork: { durationMinutes: duration, remainingMinutes: duration },
      roomUpgradeWork: { boundRoomInstanceId: "room.office.used", boundUpgradeLevel: level } });
    support(state, duration - 1);
    expect(state.levelThreeQiReviews[0]?.trainingWork?.remainingMinutes).toBe(1);
    support(state);
    expect(state.levelThreeQiReviews[0]).toMatchObject({ status: "completed", trainingWork: { remainingMinutes: 0 } });
    support(state, 5);
    expect(state.levelThreeQiReviews).toHaveLength(1);
    expect(state.cash).toBe(initialCash);
  });

  it.each(levels)("paid training uses its selected room at Level %s, with unchanged price and learning", (level) => {
    let state = trainingFixture();
    state.rooms.find((candidate) => candidate.id === "room.test.training")!.upgradeLevel = level;
    addTrainingEmployee(state, "employee.training");
    state = gameReducer(state, { type: "TRAIN_EMPLOYEE", employeeId: "employee.training", operationId: `support.train.${level}` });
    expect(employee(state, "employee.training").training).toMatchObject({ stage: "queued", paidAmount: 75, remainingMinutes: 60,
      roomUpgradeWork: { durationMinutes: null, acceptedRooms: [{ roomInstanceId: "room.test.training", upgradeLevel: level }] } });
    reachTrainingStage(state, "employee.training", "training");
    const duration = [60, 54, 48, 42, 36][level - 1]!;
    expect(employee(state, "employee.training").training).toMatchObject({ remainingMinutes: duration,
      roomUpgradeWork: { boundRoomInstanceId: "room.test.training", boundUpgradeLevel: level, durationMinutes: duration } });
    advanceTrainingMinutes(state, duration - 1);
    expect(employee(state, "employee.training").trainingLevel).toBe(1);
    advanceTrainingMinutes(state);
    expect(employee(state, "employee.training")).toMatchObject({ trainingLevel: 2, training: { stage: "returning", remainingMinutes: 0 } });
    state = reload(state);
    expect(state.cash).toBe(24_925);
    expect(employee(state, "employee.training").trainingLevel).toBe(2);
  });

  it.each(levels)("a completed break freezes one actual room's Level %s gain", (level) => {
    let state = breakFixture(level);
    support(state);
    expect(employee(state, "employee.break").facilityTask).toMatchObject({ kind: "take_break", workMinutesRemaining: 30,
      roomUpgradeBreakBenefit: { roomInstanceId: "room.break.used", upgradeLevel: level, moraleGain: 5 + 2 * (level - 1) } });
    state.rooms.find((candidate) => candidate.id === "room.break.used")!.upgradeLevel = 5;
    state = reload(state);
    support(state, 45);
    expect(employee(state, "employee.break").morale).toBe(55 + 2 * (level - 1));
    const completedAt = employee(state, "employee.break").lastBreakAtFacilityTick;
    support(state, 100);
    expect(employee(state, "employee.break").morale).toBe(55 + 2 * (level - 1));
    expect(employee(state, "employee.break").lastBreakAtFacilityTick).toBe(completedAt);
  });

  it.each(levels)("coffee applies one best operational Level %s kiosk once per day and survives reload", (level) => {
    let state = fixture();
    room(state, "room.coffee.first", "room.coffee_kiosk", 24, level);
    room(state, "room.coffee.copy", "room.coffee_kiosk", 20, level);
    room(state, "room.coffee.blocked", "room.coffee_kiosk", 16, 5);
    state.doors = state.doors.filter((door) => door.roomId !== "room.coffee.blocked");
    addTrainingEmployee(state, "employee.coffee").morale = 50;
    expect(isRoomOperationalForFacilityWork(state, "room.coffee.blocked")).toBe(false);
    state = tick(state);
    const expected = 52 + level - 1;
    expect(employee(state, "employee.coffee").morale).toBe(expected);
    expect(state.environment.coffeeMoraleAppliedDayNumber).toBe(1);
    state.rooms.find((candidate) => candidate.id === "room.coffee.first")!.upgradeLevel = 5;
    state = reload(state);
    state = tick(state, 5);
    expect(employee(state, "employee.coffee").morale).toBe(expected);
    const minutesPerDay = (PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.clock.dayEndHour - PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.clock.dayStartHour) * 60;
    state.facilityTick = minutesPerDay;
    state = tick(state);
    expect(employee(state, "employee.coffee").morale).toBe(expected + 6);
    expect(state.environment.coffeeMoraleAppliedDayNumber).toBe(2);
  });

  it.each(levels)("EVS room cleaning retains exact Level %s work and separate learned restoration", (level) => {
    let state = fixture();
    room(state, "room.evs.used", "room.evs_closet", 20, level);
    room(state, "room.evs.unused", "room.evs_closet", 16, 5);
    room(state, "room.clean.target", "room.training", 24, 5).cleanliness = 39;
    addTrainingEmployee(state, "employee.evs", "staff.evs_worker", "room.evs.used").trainingLevel = 5;
    state = tick(state);
    const duration = [5, 4.5, 4, 3.5, 3][level - 1]!;
    const task = employee(state, "employee.evs").facilityTask!;
    expect(task).toMatchObject({ kind: "clean_room", targetId: "room.clean.target", workMinutesRemaining: duration,
      roomUpgradeWork: { boundRoomInstanceId: "room.evs.used", boundUpgradeLevel: level, employeeReductionPercent: 0 } });
    expect(task.cleanlinessRestore).toBe(PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.environment.evsRoomCleanlinessRestore * 1.4);
    state.rooms.find((candidate) => candidate.id === "room.evs.used")!.upgradeLevel = 5;
    employee(state, "employee.evs").trainingLevel = 1;
    seated(state, "employee.evs");
    state = tick(state, Math.ceil(duration) - 1);
    expect(employee(state, "employee.evs").facilityTask?.workMinutesRemaining).toBeCloseTo(duration - Math.ceil(duration) + 1);
    state = reload(state);
    state = tick(state);
    expect(employee(state, "employee.evs").facilityTask).toBeNull();
    expect(state.rooms.find((candidate) => candidate.id === "room.clean.target")!.cleanliness).toBe(39 + task.cleanlinessRestore!);
    expect(state.environment.lastEvsRoomCleanupAtTick).toBe(state.facilityTick);
  });
});

describe("frozen support work through queues, upgrades and reassignment", () => {
  it("uses the actual selected Training Room rather than the best copy, with two global places", () => {
    const state = fixture();
    room(state, "room.a.training.used", "room.training", 24, 2);
    room(state, "room.z.training.unused", "room.training", 20, 5);
    for (const id of ["first", "second", "third"]) {
      addTrainingEmployee(state, id); requestEmployeeTraining(state, id);
    }
    advanceTrainingMinutes(state);
    expect(getEmployeeTrainingPlaces(state).filter((place) => place.employeeId)).toHaveLength(2);
    expect(employee(state, "third").training?.stage).toBe("queued");
    expect(employee(state, "first").training).toMatchObject({ remainingMinutes: 54,
      roomUpgradeWork: { boundRoomInstanceId: "room.a.training.used", boundUpgradeLevel: 2 } });
    expect(employee(state, "second").training?.roomUpgradeWork?.durationMinutes).toBe(54);
  });

  it("combines repair staff and actual workshop percentages before rounding, preserving 21.6 work on reload", () => {
    let state = repairFixture(2, 3);
    support(state);
    expect(employee(state, "employee.repair").facilityTask).toMatchObject({ workMinutesRemaining: 21.6,
      roomUpgradeWork: { baselineMinutes: 30, employeeReductionPercent: 20, boundUpgradeLevel: 2, durationMinutes: 21.6 } });
    seated(state, "employee.repair");
    support(state, 3);
    expect(employee(state, "employee.repair").facilityTask?.workMinutesRemaining).toBeCloseTo(18.6);
    state.rooms.find((candidate) => candidate.id === "room.workshop.used")!.upgradeLevel = 5;
    employee(state, "employee.repair").trainingLevel = 5;
    employee(state, "employee.repair").homeRoomInstanceId = "room.workshop.unused";
    state = reload(state);
    expect(employee(state, "employee.repair").facilityTask).toMatchObject({ roomUpgradeWork: { durationMinutes: 21.6, boundUpgradeLevel: 2 } });
    support(state, 18);
    expect(employee(state, "employee.repair").facilityTask?.workMinutesRemaining).toBeCloseTo(0.6);
    state = reload(state);
    support(state);
    expect(employee(state, "employee.repair").facilityTask).toBeNull();
    expect(state.rooms.find((candidate) => candidate.id === "room.repair.target")?.maintenance?.status).toBe("operational");
  });

  it("freezes queued training at payment, binds one place, and preserves partial work through room replacement", () => {
    let state = trainingFixture();
    const trainingRoom = state.rooms.find((candidate) => candidate.id === "room.test.training")!;
    trainingRoom.upgradeLevel = 2;
    for (const id of ["employee.first", "employee.second", "employee.third"]) {
      addTrainingEmployee(state, id);
      requestEmployeeTraining(state, id);
    }
    advanceTrainingMinutes(state);
    expect(getEmployeeTrainingPlaces(state).filter((place) => place.employeeId)).toHaveLength(2);
    expect(employee(state, "employee.third").training?.stage).toBe("queued");
    trainingRoom.upgradeLevel = 5;
    state = reload(state);
    reachTrainingStage(state, "employee.first", "training");
    expect(employee(state, "employee.first").training?.remainingMinutes).toBe(54);
    advanceTrainingMinutes(state, 10);
    const remaining = employee(state, "employee.first").training!.remainingMinutes;
    state.rooms = state.rooms.filter((candidate) => candidate.id !== "room.test.training");
    state.doors = state.doors.filter((door) => door.roomId !== "room.test.training");
    state = reload(state);
    advanceTrainingMinutes(state, 5);
    expect(employee(state, "employee.first").training?.remainingMinutes).toBe(remaining);
    room(state, "room.training.replacement", "room.training", 24, 5);
    reachTrainingStage(state, "employee.first", "training");
    expect(employee(state, "employee.first").training).toMatchObject({ remainingMinutes: remaining,
      roomUpgradeWork: { boundRoomInstanceId: "room.test.training", boundUpgradeLevel: 2, durationMinutes: 54 } });
    advanceTrainingMinutes(state, remaining);
    expect(employee(state, "employee.first").trainingLevel).toBe(2);
    // The originally queued third employee uses the post-acceptance replacement
    // at baseline, rather than receiving a bonus purchased after its payment.
    for (let minute = 0; employee(state, "employee.third").training?.roomInstanceId === null && minute < 90; minute++) advanceTrainingMinutes(state);
    expect(employee(state, "employee.third").training?.roomUpgradeWork).toMatchObject({ boundRoomInstanceId: "room.training.replacement", boundUpgradeLevel: 1, durationMinutes: 60 });
    expect(getEmployeeTrainingPlaces(state).filter((place) => place.employeeId).length).toBeLessThanOrEqual(2);
    expect(state.cash).toBe(24_775);
  });

  it("does not consume seated training work when an employee is displaced from the reserved stool", () => {
    const state = trainingFixture();
    state.rooms.find((candidate) => candidate.id === "room.test.training")!.upgradeLevel = 5;
    addTrainingEmployee(state, "employee.displaced"); requestEmployeeTraining(state, "employee.displaced");
    reachTrainingStage(state, "employee.displaced", "training");
    const staff = employee(state, "employee.displaced");
    staff.location = { x: 32, y: 27 }; staff.path = [{ ...staff.location }]; staff.pathIndex = 0;
    advanceTrainingMinutes(state);
    expect(staff.training).toMatchObject({ stage: "walking_to_training", remainingMinutes: 36 });
    reachTrainingStage(state, staff.id, "training");
    expect(staff.training?.remainingMinutes).toBe(36);
  });

  it("preserves fractional QI work through care preemption, category changes, reload and an actual office reassignment", () => {
    let state = qiFixture(2, 3);
    support(state); support(state, 3);
    const review = state.levelThreeQiReviews[0]!;
    expect(review.trainingWork?.remainingMinutes).toBeCloseTo(18.6);
    state.serviceOperations.push({
      id: "service.support.demand", incomeLineId: "income.ambulatory_operation", catalogVersion: 1,
      actorKind: "visitor", actorId: "visitor.support.demand", displayName: "Waiting", appearance: null,
      status: "waiting_for_resources", createdAtFacilityTick: state.facilityTick, waitDeadlineFacilityTick: state.facilityTick + 60,
      startedAtFacilityTick: null, completedAtFacilityTick: null, cancelledAtFacilityTick: null, quoteFee: 900,
      phaseIndex: 0, phaseStartedAtFacilityTick: null, phaseEndsAtFacilityTick: null,
      reservedRoomInstanceIds: [], reservedEmployeeIds: [], providerReservation: null,
      location: { x: 32, y: 27 }, path: [{ x: 32, y: 27 }], pathIndex: 0, lastMovedAtFacilityTick: state.facilityTick,
      cancellationReason: null,
      frozenOperationPhases: [{ id: "operation", roomDefinitionId: "room.ambulatory_or", durationMinutes: 120,
        staffRoleDefinitionIds: ["staff.or_nurse"], providerRoleDefinitionIds: ["staff.surgeon"] }],
    });
    support(state);
    expect(review.status).toBe("queued");
    expect(employee(state, "employee.surgeon").facilityTask).toBeNull();
    state.serviceOperations = [];
    employee(state, "employee.surgeon").trainingLevel = 5;
    employee(state, "employee.surgeon").homeRoomInstanceId = "room.office.unused";
    state.rooms = state.rooms.filter((candidate) => candidate.id !== "room.office.used");
    state.doors = state.doors.filter((door) => door.roomId !== "room.office.used");
    state = reload(state);
    expect(state.levelThreeQiReviews[0]).toMatchObject({ status: "queued", roomUpgradeWork: { durationMinutes: 21.6, boundUpgradeLevel: 2 } });
    support(state);
    expect(employee(state, "employee.surgeon").facilityTask?.workMinutesRemaining).toBeCloseTo(18.6);
    seated(state, "employee.surgeon");
    support(state, 18);
    state = reload(state);
    expect(state.levelThreeQiReviews[0]?.trainingWork?.remainingMinutes).toBeCloseTo(0.6);
    support(state);
    expect(state.levelThreeQiReviews[0]).toMatchObject({ status: "completed", trainingWork: { durationMinutes: 21.6, remainingMinutes: 0 } });
  });

  it("freezes employee skill and installed office alternatives while QI is queued before first assignment", () => {
    let state = qiFixture(2, 3);
    const staff = employee(state, "employee.surgeon");
    staff.facilityTask = { kind: "perform_service", targetId: "existing.care", startedAtFacilityTick: 0, workMinutesRemaining: 10 };
    support(state);
    expect(state.levelThreeQiReviews[0]).toMatchObject({ status: "queued", roomUpgradeWork: { employeeReductionPercent: 20, durationMinutes: null } });
    state.rooms.find((candidate) => candidate.id === "room.office.used")!.upgradeLevel = 5;
    staff.trainingLevel = 5;
    state = reload(state);
    employee(state, staff.id).facilityTask = null;
    support(state);
    expect(state.levelThreeQiReviews[0]).toMatchObject({ trainingWork: { durationMinutes: 21.6, remainingMinutes: 21.6 },
      roomUpgradeWork: { employeeReductionPercent: 20, boundUpgradeLevel: 2 } });
  });
});

describe("support clocks, completion witnesses and legacy compatibility", () => {
  it.each(["take_break", "repair_room", "review_ambulatory_qi"] as const)(
    "ADVANCE_TICK advances %s once per minute and completes its effect exactly once", (kind) => {
      let state = kind === "take_break" ? breakFixture() : kind === "repair_room" ? repairFixture() : qiFixture();
      const id = kind === "take_break" ? "employee.break" : kind === "repair_room" ? "employee.repair" : "employee.surgeon";
      state = tick(state);
      expect(employee(state, id).facilityTask).toMatchObject({ kind, workMinutesRemaining: 30 });
      seated(state, id);
      employee(state, id).facilityTask!.workMinutesRemaining = 2;
      if (kind === "review_ambulatory_qi") state.levelThreeQiReviews[0]!.trainingWork!.remainingMinutes = 2;
      state = reload(state);
      state = tick(state);
      expect(employee(state, id).facilityTask?.workMinutesRemaining).toBe(1);
      if (kind === "take_break") expect(employee(state, id).morale).toBe(50);
      if (kind === "repair_room") expect(state.rooms.find((candidate) => candidate.id === "room.repair.target")?.maintenance?.status).toBe("out_of_service");
      if (kind === "review_ambulatory_qi") expect(state.levelThreeQiReviews[0]?.status).toBe("in_progress");
      state = tick(state);
      expect(employee(state, id).facilityTask).toBeNull();
      const completedAt = state.facilityTick;
      state = reload(state);
      state = tick(state, 5);
      if (kind === "take_break") expect(employee(state, id)).toMatchObject({ morale: 55, lastBreakAtFacilityTick: completedAt });
      if (kind === "repair_room") expect(state.rooms.find((candidate) => candidate.id === "room.repair.target")?.maintenance).toMatchObject({ status: "operational", completedUses: 0 });
      if (kind === "review_ambulatory_qi") {
        expect(state.levelThreeQiReviews).toHaveLength(1);
        expect(state.levelThreeQiReviews[0]).toMatchObject({ status: "completed", completedAtFacilityTick: completedAt, trainingWork: { remainingMinutes: 0 } });
      }
    },
  );

  it.each(levels)("retains exact Level %s EVS litter work while observing completion on whole-minute ticks", (level) => {
    let state = fixture();
    room(state, "room.evs.used", "room.evs_closet", 20, level);
    room(state, "room.evs.unused", "room.evs_closet", 16, 5);
    addTrainingEmployee(state, "employee.evs", "staff.evs_worker", "room.evs.used");
    state.environment.litterItems.push({ id: "litter.support", roomId: "room.support.hall.27", location: { x: 32, y: 27 }, spawnedAtFacilityTick: 0 });
    state = tick(state);
    const duration = [2, 1.8, 1.6, 1.4, 1.2][level - 1]!;
    expect(employee(state, "employee.evs").facilityTask).toMatchObject({ kind: "collect_litter", workMinutesRemaining: duration,
      roomUpgradeWork: { boundRoomInstanceId: "room.evs.used", durationMinutes: duration } });
    seated(state, "employee.evs");
    state = tick(state);
    expect(employee(state, "employee.evs").facilityTask?.workMinutesRemaining).toBeCloseTo(duration - 1);
    expect(state.environment.litterItems).toHaveLength(1);
    state = reload(state);
    expect(employee(state, "employee.evs").facilityTask?.workMinutesRemaining).toBeCloseTo(duration - 1);
    state = tick(state);
    expect(state.environment.litterItems).toHaveLength(0);
    const completedAt = state.environment.lastLitterCleanupAtTick;
    state = reload(state); state = tick(state);
    expect(state.environment.lastLitterCleanupAtTick).toBe(completedAt);
    expect(Number.isInteger(state.facilityTick)).toBe(true);
  });

  it("uses the best later-listed operational coffee copy without summing outlets", () => {
    let state = fixture();
    room(state, "room.coffee.lower", "room.coffee_kiosk", 24, 1);
    room(state, "room.coffee.higher", "room.coffee_kiosk", 20, 5);
    addTrainingEmployee(state, "employee.coffee").morale = 50;
    state = tick(state);
    expect(employee(state, "employee.coffee").morale).toBe(56);
  });

  it("keeps newly accepted support work above the one-minute minimum", () => {
    let state = fixture();
    room(state, "room.evs.used", "room.evs_closet", 20, 5);
    addTrainingEmployee(state, "employee.evs", "staff.evs_worker", "room.evs.used");
    state.environment.litterItems.push({ id: "litter.minimum", roomId: "room.support.hall.27", location: { x: 32, y: 27 }, spawnedAtFacilityTick: 0 });
    const context = structuredClone(PROTOTYPE_DOMAIN_CONTEXT);
    context.balanceRelease.environment.founderInteractionMinutes = 1;
    state = gameReducer(state, { type: "ADVANCE_TICK", operationId: "support.minimum" }, context);
    expect(employee(state, "employee.evs").facilityTask).toMatchObject({ workMinutesRemaining: 1,
      roomUpgradeWork: { baselineMinutes: 1, durationMinutes: 1, boundUpgradeLevel: 5 } });
  });

  it("leaves founder litter cleanup at its existing two-minute baseline despite an upgraded EVS closet", () => {
    let state = fixture();
    room(state, "room.evs.upgraded", "room.evs_closet", 20, 5);
    state.environment.founderLocation = { x: 32, y: 27 };
    state.environment.litterItems.push({ id: "litter.founder", roomId: "room.support.hall.27", location: { x: 32, y: 27 }, spawnedAtFacilityTick: 0 });
    state = gameReducer(state, { type: "COLLECT_LITTER", litterId: "litter.founder", operationId: "support.founder.cleanup" });
    expect(state.operationReceipts["support.founder.cleanup"]?.status).toBe("applied");
    expect(state.environment.founderActivity).toMatchObject({ kind: "collect_litter", workMinutesRemaining: 2 });
  });

  it("waits for the actual EVS endpoint rather than consuming work at a stale path index", () => {
    let state = fixture();
    room(state, "room.evs.used", "room.evs_closet", 20, 2);
    room(state, "room.clean.target", "room.training", 24).cleanliness = 39;
    addTrainingEmployee(state, "employee.evs", "staff.evs_worker", "room.evs.used");
    state = tick(state);
    const staff = employee(state, "employee.evs");
    staff.pathIndex = staff.path.length - 1;
    // The saved index claims arrival, but the physical location still differs.
    staff.location = { ...staff.path[0]! };
    state = tick(state);
    expect(employee(state, staff.id).facilityTask?.workMinutesRemaining).toBe(4.5);
  });

  it("clamps completed break and daily coffee gains at 100", () => {
    const breakState = breakFixture(5);
    employee(breakState, "employee.break").morale = 99;
    support(breakState, 45);
    expect(employee(breakState, "employee.break").morale).toBe(100);
    let coffeeState = fixture();
    room(coffeeState, "room.coffee", "room.coffee_kiosk", 24, 5);
    addTrainingEmployee(coffeeState, "employee.coffee").morale = 99;
    coffeeState = tick(coffeeState);
    expect(employee(coffeeState, "employee.coffee").morale).toBe(100);
  });

  it("keeps legacy queued and active training at its saved hour and remaining work", () => {
    let state = trainingFixture();
    addTrainingEmployee(state, "employee.legacy"); requestEmployeeTraining(state, "employee.legacy");
    delete employee(state, "employee.legacy").training!.roomUpgradeWork;
    state.rooms.find((candidate) => candidate.id === "room.test.training")!.upgradeLevel = 5;
    state = reload(state);
    reachTrainingStage(state, "employee.legacy", "training");
    expect(employee(state, "employee.legacy").training?.remainingMinutes).toBe(60);
    advanceTrainingMinutes(state, 17);
    state = reload(state);
    expect(employee(state, "employee.legacy").training).toMatchObject({ remainingMinutes: 43 });
    expect(employee(state, "employee.legacy").training?.roomUpgradeWork).toBeUndefined();
    advanceTrainingMinutes(state, 43);
    expect(employee(state, "employee.legacy").trainingLevel).toBe(2);
  });

  it("keeps legacy GS037 QI training work without adding a room bonus", () => {
    let state = qiFixture(5, 5);
    state.levelThreeQiReviews.push({
      id: "level-three-qi.12", receiptId: "receipt.support.or", status: "queued", surgeonEmployeeId: null,
      enqueuedAtFacilityTick: 0, startedAtFacilityTick: null, completedAtFacilityTick: null,
      trainingWork: { version: "employee-training-work.v1", durationMinutes: 18, remainingMinutes: 9 },
    });
    state = reload(state);
    support(state);
    expect(employee(state, "employee.surgeon").facilityTask?.workMinutesRemaining).toBe(9);
    expect(state.levelThreeQiReviews[0]?.roomUpgradeWork).toBeUndefined();
    state = reload(state);
    support(state, 9);
    expect(state.levelThreeQiReviews[0]).toMatchObject({ status: "completed", trainingWork: { durationMinutes: 18, remainingMinutes: 0 } });
  });

  it("keeps legacy repair and break tasks at their saved terms after upgrades", () => {
    let repairState = repairFixture(5, 5);
    const target = repairState.rooms.find((candidate) => candidate.id === "room.repair.target")!;
    target.maintenance!.status = "out_of_service";
    const repairer = employee(repairState, "employee.repair");
    const point = getRoomNavigationAnchor(target, getRoomDefinition(target.roomDefinitionId)!, "staff");
    repairer.location = point; repairer.path = [point]; repairer.pathIndex = 0;
    repairer.facilityTask = { kind: "repair_room", targetId: target.id, startedAtFacilityTick: 0, workMinutesRemaining: 10 };
    repairState = reload(repairState);
    repairState = tick(repairState);
    expect(employee(repairState, repairer.id).facilityTask?.workMinutesRemaining).toBe(9);
    expect(employee(repairState, repairer.id).facilityTask?.roomUpgradeWork).toBeUndefined();
    let breakState = breakFixture();
    support(breakState);
    delete employee(breakState, "employee.break").facilityTask!.roomUpgradeBreakBenefit;
    breakState.rooms.find((candidate) => candidate.id === "room.break.used")!.upgradeLevel = 5;
    breakState = reload(breakState);
    support(breakState, 45);
    expect(employee(breakState, "employee.break").morale).toBe(55);
  });
});

describe("strict optional support save contracts", () => {
  it.each(["version", "kind", "employee_percent", "duplicate_room", "bound_level", "duration", "unknown_field", "remaining"])(
    "refuses malformed marked repair %s rather than dropping accepted work", (problem) => {
      const state = repairFixture(2, 3); support(state);
      const raw = JSON.parse(serializeGameState(state));
      const task = raw.employees[0].facilityTask;
      const work = task.roomUpgradeWork;
      if (problem === "version") work.version = "room-upgrade-support.v99";
      if (problem === "kind") work.effectKind = "reading_duration_reduction_percent";
      if (problem === "employee_percent") work.employeeReductionPercent = 100;
      if (problem === "duplicate_room") work.acceptedRooms.push({ ...work.acceptedRooms[0] });
      if (problem === "bound_level") work.boundUpgradeLevel = 5;
      if (problem === "duration") work.durationMinutes = 21;
      if (problem === "unknown_field") work.extraBonus = 1;
      if (problem === "remaining") task.workMinutesRemaining = work.durationMinutes + 1;
      expect(() => deserializeGameState(JSON.stringify(raw))).toThrow("saved room upgrade");
    },
  );

  it.each(["version", "duration", "remaining", "missing_work"])("refuses malformed marked QI %s", (problem) => {
    const state = qiFixture(2, 3); support(state);
    const raw = JSON.parse(serializeGameState(state));
    const review = raw.levelThreeQiReviews[0];
    if (problem === "version") review.roomUpgradeWork.version = "future";
    if (problem === "duration") review.trainingWork.durationMinutes = 22;
    if (problem === "remaining") review.trainingWork.remainingMinutes = 30;
    if (problem === "missing_work") delete review.trainingWork;
    expect(() => deserializeGameState(JSON.stringify(raw))).toThrow("saved room upgrade");
  });

  it("rejects mismatched new QI task/review remaining work", () => {
    const state = qiFixture(2, 3); support(state);
    const raw = JSON.parse(serializeGameState(state));
    raw.employees[0].facilityTask.workMinutesRemaining = 20.6;
    expect(() => deserializeGameState(JSON.stringify(raw))).toThrow("saved room upgrade QI assignment");
  });

  it.each(["version", "level", "employee_percent", "early_binding", "missing_active_binding"])("refuses malformed paid training room %s", (problem) => {
    const state = trainingFixture();
    state.rooms.find((candidate) => candidate.id === "room.test.training")!.upgradeLevel = 2;
    addTrainingEmployee(state, "employee.invalid"); requestEmployeeTraining(state, "employee.invalid");
    const raw = JSON.parse(serializeGameState(state));
    const work = raw.employees[0].training.roomUpgradeWork;
    if (problem === "version") work.version = "future";
    if (problem === "level") work.acceptedRooms[0].upgradeLevel = 6;
    if (problem === "employee_percent") work.employeeReductionPercent = 10;
    if (problem === "early_binding") {
      work.boundRoomInstanceId = "room.test.training"; work.boundUpgradeLevel = 2; work.durationMinutes = 54;
    }
    if (problem === "missing_active_binding") {
      raw.employees[0].training.stage = "walking_to_training";
    }
    expect(() => deserializeGameState(JSON.stringify(raw))).toThrow(/saved (room upgrade|employee training)/);
  });

  it("refuses a malformed frozen break gain and never permits fractions on unmarked legacy task work", () => {
    const state = breakFixture(2); support(state);
    const raw = JSON.parse(serializeGameState(state));
    raw.employees[0].facilityTask.roomUpgradeBreakBenefit.moraleGain = 99;
    expect(() => deserializeGameState(JSON.stringify(raw))).toThrow("saved room upgrade break benefit");
    delete raw.employees[0].facilityTask.roomUpgradeBreakBenefit;
    raw.employees[0].facilityTask.workMinutesRemaining = 2.5;
    const restored = deserializeGameState(JSON.stringify(raw));
    expect(restored.employees[0]?.facilityTask).toBeNull();
  });
});
