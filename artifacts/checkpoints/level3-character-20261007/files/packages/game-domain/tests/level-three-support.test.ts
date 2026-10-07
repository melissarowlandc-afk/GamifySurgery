import { describe, expect, it } from "vitest";
import {
  LEVEL_THREE_BREAK_SEATS,
  PROTOTYPE_DOMAIN_CONTEXT,
  advanceEmployeeMovement,
  advanceLevelThreeSupport,
  createInitialGameState,
  deserializeGameState,
  getLevelThreeSupportStatus,
  getRoomDefinition,
  getRoomNavigationAnchor,
  isEmployeeOperational,
  isRoomOperationalForFacilityWork,
  recordLevelThreeRoomUse,
  serializeGameState,
  type EmployeeState,
  type GameState,
} from "../src";

function supportState(roomDefinitionId: string, roomId = `room.test.${roomDefinitionId}`): GameState {
  const state = createInitialGameState(undefined, {
    campaignId: `support.${roomDefinitionId}`,
    campaignSeed: `support.${roomDefinitionId}`,
    createdAtRealMs: 0,
  });
  state.facilityLevel = 3;
  state.serviceAppointmentsEnabled = false;
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  state.nextFinancialPostingTick = Number.MAX_SAFE_INTEGER;
  state.encounters = {};
  const room = {
    id: roomId,
    roomDefinitionId,
    x: roomDefinitionId === "room.staff_break" || roomDefinitionId === "room.ambulatory_or" ? 28 : roomDefinitionId === "room.surgeon_office" ? 30 : 29,
    y: 24,
    orientation: 0 as const,
    doorSide: null,
    upgradeLevel: 1 as const,
    cleanliness: 100,
  };
  state.rooms.push(
    room,
    ...[25, 26, 27, 28].map((y) => ({ id: `room.test.hall.${y}`, roomDefinitionId: "room.hallway", x: 32, y, orientation: 0 as const, doorSide: null, upgradeLevel: 1 as const, cleanliness: 100 })),
  );
  state.doors.push(
    { id: "door.test.front.west", roomId: "room.instance.founder_desk", side: "west", offset: 0, exterior: false },
    { id: "door.test.support.east", roomId, side: "east", offset: roomDefinitionId === "room.staff_break" || roomDefinitionId === "room.ambulatory_or" ? 1 : 1, exterior: false },
  );
  return state;
}

function addEmployee(state: GameState, id: string, role: string, homeRoomId: string): EmployeeState {
  const room = state.rooms.find((candidate) => candidate.id === homeRoomId)!;
  const definition = getRoomDefinition(room.roomDefinitionId)!;
  const location = getRoomNavigationAnchor(room, definition, "staff");
  const employee: EmployeeState = {
    id,
    staffRoleDefinitionId: role,
    displayName: id,
    appearance: state.founder.appearance,
    hiredAtFacilityTick: 0,
    salaryPerExpenseInterval: 20,
    morale: 50,
    trainingLevel: 1 as const,
    homeRoomInstanceId: homeRoomId,
    location,
    path: [{ ...location }],
    pathIndex: 0,
    lastMovedAtFacilityTick: 0,
    lastPraisedAtFacilityTick: null,
    lastBreakAtFacilityTick: null,
    nextIdleActionAtFacilityTick: Number.MAX_SAFE_INTEGER,
    facilityTask: null,
  };
  state.employees.push(employee);
  return employee;
}

function advanceSupport(state: GameState, minutes: number): void {
  for (let minute = 0; minute < minutes; minute += 1) {
    state.facilityTick += 1;
    advanceLevelThreeSupport(state, PROTOTYPE_DOMAIN_CONTEXT);
    advanceEmployeeMovement(state, PROTOTYPE_DOMAIN_CONTEXT);
  }
}

describe("Level 3 support operations", () => {
  it("routes seven truly idle employees into unique approved seats and applies one cooled-down morale gain", () => {
    let state = supportState("room.staff_break", "room.test.break");
    for (let index = 0; index < 7; index += 1) addEmployee(state, `employee.break.${index}`, "staff.evs_worker", "room.test.break");
    advanceSupport(state, 1);
    expect(getLevelThreeSupportStatus(state).occupiedBreakSeats.map((seat) => seat.seatId).sort()).toEqual(
      LEVEL_THREE_BREAK_SEATS.map((seat) => seat.id).sort(),
    );
    state = deserializeGameState(serializeGameState(state));
    expect(getLevelThreeSupportStatus(state).occupiedBreakSeats).toHaveLength(7);
    advanceSupport(state, 40);
    expect(state.employees.every((employee) => employee.morale === 55 && employee.lastBreakAtFacilityTick !== null)).toBe(true);
    advanceSupport(state, 1);
    expect(getLevelThreeSupportStatus(state).occupiedBreakSeats).toHaveLength(0);
  });

  it("preempts a support task as soon as queued care needs that role", () => {
    const state = supportState("room.staff_break", "room.test.break");
    const nurse = addEmployee(state, "employee.or-nurse", "staff.or_nurse", "room.test.break");
    advanceSupport(state, 1);
    expect(nurse.facilityTask?.kind).toBe("take_break");
    state.serviceOperations.push({
      id: "service.waiting-or", incomeLineId: "income.ambulatory_operation", catalogVersion: 1, actorKind: "visitor", actorId: "visitor.waiting", displayName: "Waiting", appearance: null,
      status: "waiting_for_resources", createdAtFacilityTick: 0, waitDeadlineFacilityTick: 60, startedAtFacilityTick: null, completedAtFacilityTick: null, cancelledAtFacilityTick: null, quoteFee: 900,
      phaseIndex: 1, phaseStartedAtFacilityTick: null, phaseEndsAtFacilityTick: null, reservedRoomInstanceIds: [], reservedEmployeeIds: [], providerReservation: null,
      location: { x: 0, y: 0 }, path: [{ x: 0, y: 0 }], pathIndex: 0, lastMovedAtFacilityTick: 0, cancellationReason: null,
      frozenOperationPhases: [
        { id: "prep", roomDefinitionId: "room.periop_recovery", durationMinutes: 30, staffRoleDefinitionIds: ["staff.periop_nurse"] },
        { id: "operation", roomDefinitionId: "room.ambulatory_or", durationMinutes: 120, staffRoleDefinitionIds: ["staff.or_nurse"], providerRoleDefinitionIds: ["staff.surgeon"] },
      ],
    });
    advanceSupport(state, 1);
    expect(nurse.facilityTask).toBeNull();
  });

  it("does not take over an employee's active retail return path", () => {
    const state = supportState("room.staff_break", "room.test.break");
    const shopper = addEmployee(state, "employee.shopper", "staff.evs_worker", "room.test.break");
    shopper.morale = 20;
    shopper.path = [{ ...shopper.location }, { x: shopper.location.x, y: shopper.location.y + 1 }];
    shopper.pathIndex = 0;
    state.retailOperations.push({
      id: "retail.employee.return", incomeLineId: "income.coffee", catalogVersion: 1, actorKind: "employee", actorId: shopper.id,
      displayName: shopper.displayName, appearance: shopper.appearance, linkedServiceOperationId: null, authorizedOrderId: null,
      status: "returning", createdAtFacilityTick: 0, waitDeadlineFacilityTick: 10, startedAtFacilityTick: 0, completedAtFacilityTick: null,
      quoteGross: 0, quoteStockCost: 0, outletRoomInstanceId: "room.test.break", outletDurationMinutes: 5,
      staffRoleDefinitionId: null, servingEmployeeId: null, location: { ...shopper.location }, returnLocation: { ...shopper.path[1]! },
      path: shopper.path.map((point) => ({ ...point })), pathIndex: 0, lastMovedAtFacilityTick: 0, purchaseEndsAtFacilityTick: null,
      cancellationReason: null, resourceWaitReason: null,
    });
    state.facilityTick = 1;
    advanceLevelThreeSupport(state, PROTOTYPE_DOMAIN_CONTEXT);
    expect(shopper.facilityTask).toBeNull();
    expect(shopper.path).toHaveLength(2);
    expect(shopper.pathIndex).toBe(0);
  });

  it("lets active care finish, blocks the next reservation, repairs, and preserves deduplication through reload", () => {
    const state = supportState("room.ambulatory_or", "room.test.or");
    for (let index = 0; index < 8; index += 1) recordLevelThreeRoomUse(state, "room.test.or", `use.${index}`, PROTOTYPE_DOMAIN_CONTEXT);
    const maintenance = state.rooms.find((room) => room.id === "room.test.or")!.maintenance!;
    expect(maintenance).toMatchObject({ status: "due", completedUses: 8 });
    state.facilityTick = maintenance.outOfServiceAtFacilityTick!;
    state.serviceOperations.push({
      id: "service.active-or", incomeLineId: "income.ambulatory_operation", catalogVersion: 1, actorKind: "visitor", actorId: "visitor.active", displayName: "Active", appearance: null,
      status: "in_service", createdAtFacilityTick: 0, waitDeadlineFacilityTick: 60, startedAtFacilityTick: 1, completedAtFacilityTick: null, cancelledAtFacilityTick: null, quoteFee: 900,
      phaseIndex: 1, phaseStartedAtFacilityTick: 1, phaseEndsAtFacilityTick: state.facilityTick + 10, reservedRoomInstanceIds: ["room.test.or"], reservedEmployeeIds: [], providerReservation: { kind: "founder" },
      location: { x: 30, y: 26 }, path: [{ x: 30, y: 26 }], pathIndex: 0, lastMovedAtFacilityTick: 1, cancellationReason: null,
    });
    advanceLevelThreeSupport(state, PROTOTYPE_DOMAIN_CONTEXT);
    expect(maintenance.status).toBe("due");
    state.serviceOperations[0]!.status = "completed";
    state.serviceOperations[0]!.reservedRoomInstanceIds = [];
    advanceLevelThreeSupport(state, PROTOTYPE_DOMAIN_CONTEXT);
    expect(maintenance.status).toBe("out_of_service");
    expect(isRoomOperationalForFacilityWork(state, "room.test.or")).toBe(false);

    state.rooms.push({ id: "room.test.workshop", roomDefinitionId: "room.maintenance_workshop", x: 29, y: 20, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 });
    state.rooms.push(...[20, 21, 22, 23, 24].map((y) => ({ id: `room.test.workshop-hall.${y}`, roomDefinitionId: "room.hallway", x: 32, y, orientation: 0 as const, doorSide: null, upgradeLevel: 1 as const, cleanliness: 100 })));
    state.doors.push({ id: "door.test.workshop", roomId: "room.test.workshop", side: "east", offset: 1, exterior: false });
    const repairer = addEmployee(state, "employee.repair", "staff.repair_person", "room.test.workshop");
    expect(isRoomOperationalForFacilityWork(state, "room.test.workshop")).toBe(true);
    advanceSupport(state, 1);
    expect(repairer.facilityTask?.kind).toBe("repair_room");
    advanceSupport(state, 80);
    expect(repairer.facilityTask).toBeNull();
    expect(isEmployeeOperational(state, repairer.id)).toBe(true);
    const repairedMaintenance = state.rooms.find((room) => room.id === "room.test.or")!.maintenance!;
    expect(repairedMaintenance).toMatchObject({ status: "operational", completedUses: 0 });
    expect(repairedMaintenance.appliedUseKeys).toHaveLength(8);
    const restored = deserializeGameState(serializeGameState(state));
    recordLevelThreeRoomUse(restored, "room.test.or", "use.0", PROTOTYPE_DOMAIN_CONTEXT);
    expect(restored.rooms.find((room) => room.id === "room.test.or")!.maintenance).toMatchObject({ completedUses: 0, appliedUseKeys: expect.arrayContaining(["use.0"]) });
    const rebuiltRoom = { ...restored.rooms.find((room) => room.id === "room.test.or")!, maintenance: undefined };
    restored.rooms = restored.rooms.filter((room) => room.id !== "room.test.or");
    restored.rooms.push(rebuiltRoom);
    recordLevelThreeRoomUse(restored, "room.test.or", "use.0", PROTOTYPE_DOMAIN_CONTEXT);
    expect(restored.rooms.find((room) => room.id === "room.test.or")!.maintenance).toBeUndefined();
    expect(restored.levelThreeMaintenanceAppliedUseKeys).toContain("use.0");
  });

  it("reviews each ambulatory receipt once in the single office seat without cash or XP", () => {
    let state = supportState("room.surgeon_office", "room.test.office");
    addEmployee(state, "employee.surgeon", "staff.surgeon", "room.test.office");
    state.serviceIncomeReceipts.push({ id: "receipt.or.1", transactionKey: "receipt.or.1", incomeLineId: "income.ambulatory_operation", catalogVersion: 1, routeId: null, actorKind: "visitor", actorId: "visitor.or", grossAmount: 900, stockCost: 0, netCashDelta: 900, completedAtFacilityTick: 1 });
    const cash = state.cash;
    const xp = state.clinicalXp;
    advanceSupport(state, 1);
    expect(state.employees[0]!.facilityTask?.kind).toBe("review_ambulatory_qi");
    state = deserializeGameState(serializeGameState(state));
    expect(state.levelThreeQiReviews[0]).toMatchObject({ status: "in_progress", surgeonEmployeeId: "employee.surgeon" });
    expect(state.employees[0]!.facilityTask?.kind).toBe("review_ambulatory_qi");
    advanceSupport(state, 35);
    expect(getLevelThreeSupportStatus(state)).toMatchObject({ queuedQiReviewCount: 0, completedQiReviewCount: 1 });
    expect(getLevelThreeSupportStatus(state).firstQiReviewCompleted).toBe(true);
    expect(state.cash).toBe(cash);
    expect(state.clinicalXp).toBe(xp);
    state = deserializeGameState(serializeGameState(state));
    advanceLevelThreeSupport(state, PROTOTYPE_DOMAIN_CONTEXT);
    expect(state.schemaVersion).toBe(9);
    expect(state.levelThreeQiReviews).toHaveLength(1);
  });

  it("requeues an in-progress QI review if its surgeon is fired or office is removed", () => {
    const state = supportState("room.surgeon_office", "room.test.office");
    addEmployee(state, "employee.surgeon", "staff.surgeon", "room.test.office");
    state.serviceIncomeReceipts.push({ id: "receipt.or.orphan", transactionKey: "receipt.or.orphan", incomeLineId: "income.ambulatory_operation", catalogVersion: 1, routeId: null, actorKind: "visitor", actorId: "visitor.orphan", grossAmount: 900, stockCost: 0, netCashDelta: 900, completedAtFacilityTick: 1 });
    advanceSupport(state, 1);
    expect(state.levelThreeQiReviews[0]?.status).toBe("in_progress");
    state.employees = [];
    advanceLevelThreeSupport(state, PROTOTYPE_DOMAIN_CONTEXT);
    expect(state.levelThreeQiReviews[0]).toMatchObject({ status: "queued", surgeonEmployeeId: null, startedAtFacilityTick: null });

    const surgeon = addEmployee(state, "employee.surgeon.rehired", "staff.surgeon", "room.test.office");
    advanceLevelThreeSupport(state, PROTOTYPE_DOMAIN_CONTEXT);
    expect(state.levelThreeQiReviews[0]?.status).toBe("in_progress");
    state.rooms = state.rooms.filter((room) => room.id !== "room.test.office");
    advanceLevelThreeSupport(state, PROTOTYPE_DOMAIN_CONTEXT);
    expect(state.levelThreeQiReviews[0]?.status).toBe("queued");
    expect(surgeon.facilityTask).toBeNull();
  });

  it("adds safe schema-9 support defaults to a version-8 campaign", () => {
    const state = createInitialGameState();
    const legacy = JSON.parse(serializeGameState(state)) as Record<string, unknown>;
    legacy.schemaVersion = 8;
    delete legacy.levelThreeQiReviews;
    delete legacy.levelThreeQiReviewSequence;
    delete legacy.levelThreeMaintenanceAppliedUseKeys;
    const restored = deserializeGameState(JSON.stringify(legacy));
    expect(restored).toMatchObject({ schemaVersion: 9, levelThreeQiReviews: [], levelThreeQiReviewSequence: 0, levelThreeMaintenanceAppliedUseKeys: [] });
    expect(restored.rooms.every((room) => room.maintenance === undefined)).toBe(true);
    const hotState = { ...restored } as Partial<GameState>;
    delete hotState.levelThreeQiReviews;
    expect(getLevelThreeSupportStatus(hotState as GameState)).toMatchObject({ queuedQiReviewCount: 0, completedQiReviewCount: 0, firstQiReviewCompleted: false });
  });

  it("reconciles duplicate break claims and malformed QI ownership on reload", () => {
    const state = supportState("room.staff_break", "room.test.break");
    const first = addEmployee(state, "employee.break.a", "staff.evs_worker", "room.test.break");
    const second = addEmployee(state, "employee.break.b", "staff.evs_worker", "room.test.break");
    first.facilityTask = { kind: "take_break", targetId: "room.test.break", seatId: "massage", startedAtFacilityTick: 0, workMinutesRemaining: 10 };
    second.facilityTask = { kind: "take_break", targetId: "room.test.break", seatId: "massage", startedAtFacilityTick: 0, workMinutesRemaining: 10 };
    state.levelThreeQiReviews = [{ id: "level-three-qi.41", receiptId: "receipt.missing", status: "in_progress", surgeonEmployeeId: "employee.missing", enqueuedAtFacilityTick: 0, startedAtFacilityTick: 0, completedAtFacilityTick: null }];
    state.levelThreeQiReviewSequence = 1;
    const restored = deserializeGameState(serializeGameState(state));
    expect(restored.employees.filter((employee) => employee.facilityTask?.kind === "take_break")).toHaveLength(1);
    expect(restored.levelThreeQiReviews[0]).toMatchObject({ status: "queued", surgeonEmployeeId: null });
    expect(restored.levelThreeQiReviewSequence).toBe(42);
  });
});
