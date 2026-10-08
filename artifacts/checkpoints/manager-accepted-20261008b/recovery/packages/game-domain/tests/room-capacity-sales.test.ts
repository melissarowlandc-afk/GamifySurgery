import { describe, expect, it } from "vitest";
import {
  PROTOTYPE_DOMAIN_CONTEXT,
  advanceEmployeeMovement,
  createInitialGameState,
  deserializeGameState,
  gameReducer,
  getRoomSalePreview,
  getRoomStaffCapacity,
  getNextRoomUpgradeCost,
  getRoomResaleValue,
  getRoomDefinition,
  getRoomCareAnchor,
  getRoomNavigationAnchor,
  interruptServiceOperationsForRoomSale,
  reconcileEmployeeRoomSeats,
  serializeGameState,
  type EmployeeState,
  type GameState,
  type ServiceOperationState,
} from "../src";

let sequence = 0;

function advance(state: GameState, minutes: number): GameState {
  let next = state;
  for (let minute = 0; minute < minutes; minute += 1) {
    next = gameReducer(next, {
      type: "ADVANCE_TICK",
      operationId: `room-capacity.tick.${sequence++}`,
    });
  }
  return next;
}

function advanceUntil(
  state: GameState,
  predicate: (candidate: GameState) => boolean,
  maximumMinutes = 240,
): GameState {
  let next = state;
  for (let minute = 0; minute < maximumMinutes && !predicate(next); minute += 1) {
    next = advance(next, 1);
  }
  expect(predicate(next)).toBe(true);
  return next;
}

function phlebotomyState(roomCount = 2): GameState {
  const state = createInitialGameState(undefined, {
    campaignId: `campaign.room-sale-service.${sequence++}`,
    campaignSeed: "room-sale-service",
    createdAtRealMs: 0,
  });
  state.facilityLevel = 2;
  state.cash = 10_000;
  state.cashCents = 1_000_000;
  state.serviceAppointmentsEnabled = false;
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  state.nextFinancialPostingTick = Number.MAX_SAFE_INTEGER;
  state.environment.nextLitterSpawnTick = Number.MAX_SAFE_INTEGER;
  state.environment.nextWaterCoolerDrainTick = Number.MAX_SAFE_INTEGER;
  state.encounters = {};
  state.rooms.push(
    ...Array.from({ length: roomCount }, (_, index) => ({
      id: `room.phleb.${index}`,
      roomDefinitionId: "room.phlebotomy",
      x: 29,
      y: 17 + index * 3,
      orientation: 0 as const,
      doorSide: null,
      upgradeLevel: 1 as const,
      cleanliness: 100,
    })),
    ...Array.from({ length: 12 }, (_, index) => ({
      id: `room.hall.${index}`,
      roomDefinitionId: "room.hallway",
      x: 32,
      y: 17 + index,
      orientation: 0 as const,
      doorSide: null,
      upgradeLevel: 1 as const,
      cleanliness: 100,
    })),
  );
  state.doors.push(
    ...Array.from({ length: roomCount }, (_, index) => ({
      id: `door.phleb.${index}`,
      roomId: `room.phleb.${index}`,
      side: "east" as const,
      offset: 1,
      exterior: false,
    })),
    {
      id: "door.front.internal",
      roomId: "room.instance.founder_desk",
      side: "west",
      offset: 0,
      exterior: false,
    },
  );
  for (let index = 0; index < roomCount; index += 1) {
    state.employees.push(employee(
      state,
      `employee.phleb.${index}`,
      "staff.phlebotomist",
      `room.phleb.${index}`,
    ));
    state.employees.at(-1)!.location = { x: 30, y: 18 + index * 3 };
    state.employees.at(-1)!.path = [{ ...state.employees.at(-1)!.location }];
  }
  return state;
}

function startCollection(state: GameState): GameState {
  return gameReducer(state, {
    type: "START_SERVICE_OPERATION",
    operationId: `room-capacity.collection.${sequence++}`,
    incomeLineId: "income.collection",
    actorKind: "visitor",
  });
}

function employee(state: GameState, id: string, role: string, home: string | null): EmployeeState {
  return {
    id,
    staffRoleDefinitionId: role,
    displayName: id,
    appearance: state.founder.appearance,
    hiredAtFacilityTick: 0,
    salaryPerExpenseInterval: 20,
    morale: 75,
    trainingLevel: 1,
    homeRoomInstanceId: home,
    location: { x: 10, y: 10 },
    path: [{ x: 10, y: 10 }],
    pathIndex: 0,
    lastMovedAtFacilityTick: 0,
    lastPraisedAtFacilityTick: null,
    nextIdleActionAtFacilityTick: 100,
    facilityTask: null,
  };
}

function capacityState(): GameState {
  const state = createInitialGameState(undefined, {
    campaignId: "campaign.room-capacity",
    campaignSeed: "room-capacity-seed",
    createdAtRealMs: 0,
  });
  state.facilityLevel = 2;
  state.rooms.push(
    { id: "room.exam", roomDefinitionId: "room.examination", x: 20, y: 1, orientation: 0, doorSide: null, upgradeLevel: 1 },
    { id: "room.periop.a", roomDefinitionId: "room.periop_recovery", x: 1, y: 1, orientation: 0, doorSide: null, upgradeLevel: 1 },
    { id: "room.periop.b", roomDefinitionId: "room.periop_recovery", x: 8, y: 1, orientation: 0, doorSide: null, upgradeLevel: 1 },
    { id: "room.us", roomDefinitionId: "room.ultrasound", x: 1, y: 10, orientation: 0, doorSide: null, upgradeLevel: 1 },
    { id: "room.xr", roomDefinitionId: "room.xray", x: 6, y: 10, orientation: 0, doorSide: null, upgradeLevel: 1 },
    { id: "room.ct", roomDefinitionId: "room.ct", x: 11, y: 10, orientation: 0, doorSide: null, upgradeLevel: 1 },
    { id: "room.endo", roomDefinitionId: "room.endoscopy", x: 16, y: 10, orientation: 0, doorSide: null, upgradeLevel: 1 },
    { id: "room.phleb", roomDefinitionId: "room.phlebotomy", x: 21, y: 10, orientation: 0, doorSide: null, upgradeLevel: 1 },
    { id: "room.evs", roomDefinitionId: "room.evs_closet", x: 25, y: 10, orientation: 0, doorSide: null, upgradeLevel: 1 },
    { id: "room.glp", roomDefinitionId: "room.glp1_telehealth_suite", x: 28, y: 10, orientation: 0, doorSide: null, upgradeLevel: 1 },
  );
  return state;
}

describe("room-derived staffing and room-sale layoffs", () => {
  it("hires every Level 3 role against the approved reachable room capacity", () => {
    let state = createInitialGameState();
    state.facilityLevel = 3;
    state.cash = 20_000;
    state.cashCents = 2_000_000;
    state.rooms.push(
      { id: "room.l3.workshop", roomDefinitionId: "room.maintenance_workshop", x: 29, y: 10, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
      { id: "room.l3.office", roomDefinitionId: "room.surgeon_office", x: 33, y: 10, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
      { id: "room.l3.lab", roomDefinitionId: "room.laboratory", x: 29, y: 14, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
      { id: "room.l3.pharmacy", roomDefinitionId: "room.pharmacy", x: 33, y: 14, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
      { id: "room.l3.or", roomDefinitionId: "room.ambulatory_or", x: 28, y: 18, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
      { id: "room.l3.recovery", roomDefinitionId: "room.periop_recovery", x: 33, y: 18, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
      ...Array.from({ length: 19 }, (_, index) => ({ id: `room.l3.hall.${index}`, roomDefinitionId: "room.hallway", x: 32, y: 10 + index, orientation: 0 as const, doorSide: null, upgradeLevel: 1 as const, cleanliness: 100 })),
    );
    state.doors.push(
      { id: "door.l3.workshop", roomId: "room.l3.workshop", side: "east", offset: 1, exterior: false },
      { id: "door.l3.office", roomId: "room.l3.office", side: "west", offset: 0, exterior: false },
      { id: "door.l3.lab", roomId: "room.l3.lab", side: "east", offset: 1, exterior: false },
      { id: "door.l3.pharmacy", roomId: "room.l3.pharmacy", side: "west", offset: 1, exterior: false },
      { id: "door.l3.or", roomId: "room.l3.or", side: "east", offset: 1, exterior: false },
      { id: "door.l3.recovery", roomId: "room.l3.recovery", side: "west", offset: 1, exterior: false },
      { id: "door.l3.front", roomId: "room.instance.founder_desk", side: "west", offset: 0, exterior: false },
    );
    expect(Object.fromEntries([
      "staff.surgeon", "staff.or_nurse", "staff.laboratory_technician", "staff.pharmacist", "staff.repair_person",
    ].map((roleId) => [roleId, getRoomStaffCapacity(state, roleId).capacity]))).toEqual({
      "staff.surgeon": 2,
      "staff.or_nurse": 1,
      "staff.laboratory_technician": 1,
      "staff.pharmacist": 1,
      "staff.repair_person": 1,
    });
    for (const [index, roleId] of [
      "staff.surgeon", "staff.or_nurse", "staff.laboratory_technician", "staff.pharmacist", "staff.repair_person",
    ].entries()) {
      state = gameReducer(state, { type: "HIRE_STAFF", operationId: `hire.l3.${roleId}`, employeeId: `employee.l3.${index}`, staffRoleDefinitionId: roleId });
      expect(state.operationReceipts[`hire.l3.${roleId}`]).toMatchObject({ status: "applied" });
    }
    state = gameReducer(state, { type: "HIRE_STAFF", operationId: "hire.l3.second-surgeon", employeeId: "employee.l3.second-surgeon", staffRoleDefinitionId: "staff.surgeon" });
    expect(state.operationReceipts["hire.l3.second-surgeon"]).toMatchObject({ status: "applied" });
    state = gameReducer(state, { type: "HIRE_STAFF", operationId: "hire.l3.second-repair", employeeId: "employee.l3.second-repair", staffRoleDefinitionId: "staff.repair_person" });
    expect(state.operationReceipts["hire.l3.second-repair"]).toMatchObject({ status: "rejected", message: expect.stringContaining("1/1 built-room maximum") });
  });

  it("derives two peri-op seats per room and one shared imaging seat per modality", () => {
    const state = capacityState();
    expect(getRoomStaffCapacity(state, "staff.periop_nurse")).toMatchObject({
      builtRoomCount: 2,
      capacity: 4,
    });
    expect(getRoomStaffCapacity(state, "staff.imaging_technician")).toMatchObject({
      builtRoomCount: 3,
      capacity: 3,
    });
    expect(Object.fromEntries([
      "staff.receptionist",
      "staff.periop_nurse",
      "staff.endoscopy_nurse",
      "staff.endoscopist",
      "staff.phlebotomist",
      "staff.evs_worker",
      "staff.glp1_np",
    ].map((roleId) => [roleId, getRoomStaffCapacity(state, roleId).capacity]))).toEqual({
      "staff.receptionist": 1,
      "staff.periop_nurse": 4,
      "staff.endoscopy_nurse": 1,
      "staff.endoscopist": 1,
      "staff.phlebotomist": 1,
      "staff.evs_worker": 1,
      "staff.glp1_np": 2,
    });
  });

  it("reconciles legacy first-room assignments into distinct imaging seats without moving staff", () => {
    const state = capacityState();
    state.employees.push(
      employee(state, "tech.a", "staff.imaging_technician", "room.us"),
      employee(state, "tech.b", "staff.imaging_technician", "room.us"),
      employee(state, "tech.c", "staff.imaging_technician", "room.us"),
    );
    reconcileEmployeeRoomSeats(state);
    expect(new Set(state.employees.map((candidate) => candidate.homeRoomInstanceId)).size).toBe(3);
    expect(state.employees.map((candidate) => candidate.location)).toEqual([
      { x: 10, y: 10 }, { x: 10, y: 10 }, { x: 10, y: 10 },
    ]);
  });

  it("routes idle shared imaging technicians directly to their distinct assigned seats", () => {
    const state = createInitialGameState();
    state.facilityLevel = 2;
    state.rooms.push(
      { id: "room.imaging.us", roomDefinitionId: "room.ultrasound", x: 33, y: 23, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
      { id: "room.imaging.xr", roomDefinitionId: "room.xray", x: 33, y: 19, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
      ...Array.from({ length: 9 }, (_, index) => ({ id: `room.imaging.hall.${index}`, roomDefinitionId: "room.hallway", x: 32, y: 20 + index, orientation: 0 as const, doorSide: null, upgradeLevel: 1 as const, cleanliness: 100 })),
    );
    state.doors.push(
      { id: "door.imaging.us", roomId: "room.imaging.us", side: "west", offset: 1, exterior: false },
      { id: "door.imaging.xr", roomId: "room.imaging.xr", side: "west", offset: 1, exterior: false },
      { id: "door.imaging.front", roomId: "room.instance.founder_desk", side: "west", offset: 0, exterior: false },
    );
    state.employees = [
      employee(state, "tech.a", "staff.imaging_technician", "room.imaging.us"),
      employee(state, "tech.b", "staff.imaging_technician", "room.imaging.xr"),
    ];
    state.employees[0]!.location = { x: 34, y: 20 };
    state.employees[0]!.path = [{ ...state.employees[0]!.location }];
    state.employees[1]!.location = { x: 34, y: 24 };
    state.employees[1]!.path = [{ ...state.employees[1]!.location }];
    state.facilityTick = 1;
    advanceEmployeeMovement(state, PROTOTYPE_DOMAIN_CONTEXT);
    for (const tech of state.employees) {
      const home = state.rooms.find((room) => room.id === tech.homeRoomInstanceId)!;
      const target = getRoomNavigationAnchor(home, getRoomDefinition(home.roomDefinitionId)!, "staff");
      expect(tech.path.length).toBeGreaterThan(1);
      expect(tech.path.at(-1)).toEqual(target);
    }
  });

  it("retains legacy excess staff without firing or teleporting them", () => {
    const state = capacityState();
    state.employees.push(
      employee(state, "phleb.a", "staff.phlebotomist", "room.phleb"),
      employee(state, "phleb.b", "staff.phlebotomist", "room.phleb"),
      employee(state, "phleb.c", "staff.phlebotomist", "room.phleb"),
    );
    reconcileEmployeeRoomSeats(state);
    expect(state.employees).toHaveLength(3);
    expect(state.employees.every((candidate) => candidate.homeRoomInstanceId === "room.phleb")).toBe(true);
    expect(state.employees.every((candidate) => candidate.location.x === 10 && candidate.location.y === 10)).toBe(true);
  });

  it("blocks hiring at the built-room boundary while preserving legacy excess staff", () => {
    const state = capacityState();
    state.cash = 10_000;
    state.cashCents = 1_000_000;
    state.employees.push(
      employee(state, "periop.a", "staff.periop_nurse", "room.periop.a"),
      employee(state, "periop.b", "staff.periop_nurse", "room.periop.a"),
      employee(state, "periop.c", "staff.periop_nurse", "room.periop.b"),
      employee(state, "periop.d", "staff.periop_nurse", "room.periop.b"),
    );
    const rejected = gameReducer(state, {
      type: "HIRE_STAFF",
      operationId: "hire.periop.excess",
      employeeId: "periop.e",
      staffRoleDefinitionId: "staff.periop_nurse",
    });
    expect(rejected.operationReceipts["hire.periop.excess"]).toMatchObject({
      status: "rejected",
      message: expect.stringContaining("4/4 built-room maximum"),
    });
    expect(rejected.employees).toHaveLength(4);
  });

  it("hires beyond the legacy role cap when additional connected rooms provide seats", () => {
    let state = phlebotomyState(3);
    state.employees = [];
    for (let index = 0; index < 3; index += 1) {
      state = gameReducer(state, {
        type: "HIRE_STAFF",
        operationId: `hire.phleb.${index}`,
        employeeId: `hired.phleb.${index}`,
        staffRoleDefinitionId: "staff.phlebotomist",
      });
      expect(state.operationReceipts[`hire.phleb.${index}`]?.status).toBe("applied");
    }
    expect(state.employees).toHaveLength(3);
    expect(new Set(state.employees.map((candidate) => candidate.homeRoomInstanceId))).toEqual(
      new Set(["room.phleb.0", "room.phleb.1", "room.phleb.2"]),
    );
  });

  it("freezes a random excess imaging layoff in the preview and rejects a stale confirmation", () => {
    const state = capacityState();
    state.employees.push(
      employee(state, "tech.a", "staff.imaging_technician", "room.us"),
      employee(state, "tech.b", "staff.imaging_technician", "room.xr"),
      employee(state, "tech.c", "staff.imaging_technician", "room.ct"),
    );
    const preview = getRoomSalePreview(state, "room.ct", PROTOTYPE_DOMAIN_CONTEXT)!;
    expect(preview.dismissedEmployees).toHaveLength(1);
    expect(getRoomSalePreview(state, "room.ct", PROTOTYPE_DOMAIN_CONTEXT)).toEqual(preview);

    const rejected = gameReducer(state, {
      type: "SELL_ROOM",
      operationId: "sell.stale",
      roomId: "room.ct",
      saleConfirmationToken: `${preview.confirmationToken}.stale`,
    });
    expect(rejected.rooms.some((room) => room.id === "room.ct")).toBe(true);
    expect(rejected.operationReceipts["sell.stale"]?.status).toBe("rejected");

    const sold = gameReducer(state, {
      type: "SELL_ROOM",
      operationId: "sell.confirmed",
      roomId: "room.ct",
      saleConfirmationToken: preview.confirmationToken,
    });
    expect(sold.operationReceipts["sell.confirmed"]?.status).toBe("applied");
    expect(sold.rooms.some((room) => room.id === "room.ct")).toBe(false);
    expect(sold.employees).toHaveLength(2);
    expect(sold.departingEmployees?.map((candidate) => candidate.id)).toEqual([
      preview.dismissedEmployees[0]!.id,
    ]);
    expect(sold.departingEmployees?.[0]?.salaryPerExpenseInterval).toBe(0);
  });

  it("samples the excess imaging dismissal from the full roster across campaign seeds", () => {
    const selected = new Set<string>();
    for (let index = 0; index < 24; index += 1) {
      const state = capacityState();
      state.campaignSeed = `room-capacity-seed.${index}`;
      state.employees.push(
        employee(state, "tech.a", "staff.imaging_technician", "room.us"),
        employee(state, "tech.b", "staff.imaging_technician", "room.xr"),
        employee(state, "tech.c", "staff.imaging_technician", "room.ct"),
      );
      selected.add(getRoomSalePreview(state, "room.ct", PROTOTYPE_DOMAIN_CONTEXT)!.dismissedEmployees[0]!.id);
    }
    expect(selected.size).toBeGreaterThan(1);
    expect([...selected].every((id) => ["tech.a", "tech.b", "tech.c"].includes(id))).toBe(true);
  });

  it("keeps every imaging technician when the remaining rooms still provide enough seats", () => {
    const state = capacityState();
    state.employees.push(
      employee(state, "tech.a", "staff.imaging_technician", "room.us"),
      employee(state, "tech.b", "staff.imaging_technician", "room.ct"),
    );
    const preview = getRoomSalePreview(state, "room.ct", PROTOTYPE_DOMAIN_CONTEXT)!;
    expect(preview.dismissedEmployees).toEqual([]);
    const sold = gameReducer(state, {
      type: "SELL_ROOM",
      operationId: "sell.within-imaging-capacity",
      roomId: "room.ct",
    });
    expect(sold.operationReceipts["sell.within-imaging-capacity"]?.status).toBe("applied");
    expect(sold.employees.map((candidate) => candidate.id).sort()).toEqual(["tech.a", "tech.b"]);
    expect(new Set(sold.employees.map((candidate) => candidate.homeRoomInstanceId))).toEqual(
      new Set(["room.us", "room.xr"]),
    );
    expect(sold.departingEmployees).toEqual([]);
  });

  it("waits for a busy compatible room, resumes the interrupted current phase, and earns each fee once", () => {
    let state = startCollection(phlebotomyState(2));
    state = advanceUntil(state, (candidate) => candidate.serviceOperations[0]?.status === "in_service");
    const original = state.serviceOperations[0]!;
    const remainingRoom = state.rooms.find(room => room.roomDefinitionId === "room.phlebotomy" && !original.reservedRoomInstanceIds.includes(room.id))!;
    const remainingEmployee = state.employees.find(employee => employee.homeRoomInstanceId === remainingRoom.id)!;
    const busy = JSON.parse(JSON.stringify(original)) as typeof original;
    busy.id = `service-operation.busy.${sequence++}`;
    busy.actorId = busy.id;
    busy.displayName = "Busy collection visitor";
    busy.reservedRoomInstanceIds = [remainingRoom.id];
    busy.reservedEmployeeIds = [remainingEmployee.id];
    busy.location = getRoomCareAnchor(remainingRoom, getRoomDefinition(remainingRoom.roomDefinitionId)!, "patient");
    busy.path = [{ ...busy.location }];
    busy.pathIndex = 0;
    remainingEmployee.facilityTask = {
      kind: "perform_service",
      targetId: busy.id,
      startedAtFacilityTick: state.facilityTick,
      workMinutesRemaining: Number.MAX_SAFE_INTEGER,
    };
    state.serviceOperations.push(busy);
    const interruptedId = state.serviceOperations[0]!.id;
    const busyId = state.serviceOperations[1]!.id;
    const soldRoomId = state.serviceOperations[0]!.reservedRoomInstanceIds[0]!;
    state.serviceOperations[0]!.phaseEndsAtFacilityTick = state.facilityTick + 7;
    state.serviceOperations[1]!.phaseEndsAtFacilityTick = state.facilityTick + 90;
    const preview = getRoomSalePreview(state, soldRoomId, PROTOTYPE_DOMAIN_CONTEXT)!;
    state = gameReducer(state, {
      type: "SELL_ROOM",
      operationId: "sell.active-phlebotomy",
      roomId: soldRoomId,
      saleConfirmationToken: preview.confirmationToken,
    });
    expect(state.operationReceipts["sell.active-phlebotomy"]?.status).toBe("applied");
    expect(state.serviceOperations.find((operation) => operation.id === interruptedId)).toMatchObject({
      status: "waiting_for_resources",
      phaseIndex: 0,
      saleTransfer: { remainingPhaseMinutes: 7 },
    });

    state = deserializeGameState(serializeGameState(state));
    state = advance(state, 61);
    expect(state.serviceOperations.find((operation) => operation.id === interruptedId)?.status)
      .toBe("waiting_for_resources");
    expect(state.serviceOperations.find((operation) => operation.id === busyId)?.status)
      .toBe("in_service");

    state = advanceUntil(
      state,
      (candidate) => candidate.serviceOperations.find((operation) => operation.id === interruptedId)?.status === "in_service",
      120,
    );
    const resumed = state.serviceOperations.find((operation) => operation.id === interruptedId)!;
    expect(resumed.phaseIndex).toBe(0);
    expect(resumed.phaseEndsAtFacilityTick! - resumed.phaseStartedAtFacilityTick!).toBe(7);
    state = advance(state, 120);
    expect(state.serviceIncomeReceipts.filter((receipt) =>
      receipt.incomeLineId === "income.collection")).toHaveLength(2);
    expect(new Set(state.serviceIncomeReceipts.map((receipt) => receipt.transactionKey)).size)
      .toBe(state.serviceIncomeReceipts.length);
  });

  it("sends an interrupted final-room collection visitor offsite without an unfinished-service fee", () => {
    let state = startCollection(phlebotomyState(1));
    state = advanceUntil(state, (candidate) => candidate.serviceOperations[0]?.status === "in_service");
    const operationId = state.serviceOperations[0]!.id;
    const roomId = state.serviceOperations[0]!.reservedRoomInstanceIds[0]!;
    const preview = getRoomSalePreview(state, roomId, PROTOTYPE_DOMAIN_CONTEXT)!;
    state = gameReducer(state, {
      type: "SELL_ROOM",
      operationId: "sell.final-phlebotomy",
      roomId,
      saleConfirmationToken: preview.confirmationToken,
    });
    expect(state.operationReceipts["sell.final-phlebotomy"]?.status).toBe("applied");
    expect(state.serviceOperations.find((operation) => operation.id === operationId)).toMatchObject({
      cancelledAtFacilityTick: state.facilityTick,
      status: "leaving",
    });
    state = advance(state, 120);
    expect(state.serviceIncomeReceipts.filter((receipt) =>
      receipt.incomeLineId === "income.collection")).toEqual([]);
    expect(state.serviceOperations.find((operation) => operation.id === operationId)?.status)
      .toBe("cancelled");
  });

  it("does not replay a completed phase while an operation waits to reserve its next phase", () => {
    const state = capacityState();
    const operation: ServiceOperationState = {
      id: "operation.waiting-for-recovery",
      incomeLineId: "income.endoscopy",
      catalogVersion: 1,
      actorKind: "visitor",
      actorId: "operation.waiting-for-recovery",
      displayName: "Recovery visitor",
      appearance: state.founder.appearance,
      status: "waiting_for_next_phase",
      createdAtFacilityTick: 0,
      waitDeadlineFacilityTick: Number.MAX_SAFE_INTEGER,
      startedAtFacilityTick: 0,
      completedAtFacilityTick: null,
      cancelledAtFacilityTick: null,
      quoteFee: 150,
      phaseIndex: 1,
      phaseStartedAtFacilityTick: null,
      phaseEndsAtFacilityTick: null,
      reservedRoomInstanceIds: [],
      reservedEmployeeIds: [],
      providerReservation: null,
      location: { x: 17, y: 11 },
      path: [{ x: 17, y: 11 }],
      pathIndex: 0,
      lastMovedAtFacilityTick: 0,
      cancellationReason: null,
      phaseFlowVersion: 1,
      periopBedFlowVersion: 1,
      nextPhaseReadyAtFacilityTick: 0,
      transitionHeldRoomInstanceIds: ["room.endo"],
      frozenOperationPhases: [
        { id: "prep", roomDefinitionId: "room.periop_recovery", durationMinutes: 30, staffRoleDefinitionIds: ["staff.periop_nurse"], roomStationId: "periop_preparation" },
        { id: "procedure", roomDefinitionId: "room.endoscopy", durationMinutes: 45, staffRoleDefinitionIds: ["staff.endoscopy_nurse"] },
        { id: "recovery", roomDefinitionId: "room.periop_recovery", durationMinutes: 60, staffRoleDefinitionIds: ["staff.periop_nurse"], roomStationId: "periop_recovery" },
      ],
    };
    state.serviceOperations.push(operation);
    interruptServiceOperationsForRoomSale(
      state,
      "room.endo",
      "room.endoscopy",
      PROTOTYPE_DOMAIN_CONTEXT,
    );
    expect(operation).toMatchObject({
      status: "waiting_for_next_phase",
      phaseIndex: 1,
      transitionHeldRoomInstanceIds: [],
    });
    expect(operation.saleTransfer).toBeUndefined();
  });
});

describe("current room purchase eligibility and historical investment", () => {
  it("does not quote retired upgrades while retaining their invested resale amount", () => {
    const state = createInitialGameState();
    const definition = getRoomDefinition("room.imaging_control")!;
    const room = { id: "room.legacy.upgraded-control", roomDefinitionId: definition.id, x: 20, y: 12,
      orientation: 0 as const, doorSide: null, upgradeLevel: 3 as const, cleanliness: 100 };
    state.rooms.push(room);
    const historicalInvestment = definition.constructionCost + definition.upgradeCosts[0]! + definition.upgradeCosts[1]!;
    expect(historicalInvestment).toBeGreaterThan(definition.constructionCost);
    expect(getNextRoomUpgradeCost(state, room.id)).toBeNull();
    expect(getRoomResaleValue(state, room.id)).toBe(Math.floor(historicalInvestment * PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility.roomResalePercent / 100));
    const reloaded = deserializeGameState(serializeGameState(state));
    expect(getRoomResaleValue(reloaded, room.id)).toBe(getRoomResaleValue(state, room.id));
    expect(getNextRoomUpgradeCost(reloaded, room.id)).toBeNull();
  });

  it.each(["room.front_desk", "room.hallway", "room.founder_office", "room.unknown"])(
    "never quotes a new purchase for %s, even if a custom context declares prices", (roomDefinitionId) => {
      const state = createInitialGameState();
      state.rooms.push({ id: "room.no-purchase", roomDefinitionId, x: 20, y: 12,
        orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 });
      const context = structuredClone(PROTOTYPE_DOMAIN_CONTEXT);
      const definition = { ...getRoomDefinition("room.examination")!, id: roomDefinitionId, buildable: true };
      context.balanceRelease.facility.roomDefinitions = context.balanceRelease.facility.roomDefinitions.filter((room) => room.id !== roomDefinitionId);
      context.balanceRelease.facility.roomDefinitions.push(definition);
      expect(getNextRoomUpgradeCost(state, "room.no-purchase", context)).toBeNull();
    },
  );

  it("rejects an otherwise current room marked nonbuildable in its context", () => {
    const state = createInitialGameState();
    state.rooms.push({ id: "room.unbuildable-exam", roomDefinitionId: "room.examination", x: 20, y: 12,
      orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 });
    const context = structuredClone(PROTOTYPE_DOMAIN_CONTEXT);
    context.balanceRelease.facility.roomDefinitions.find((room) => room.id === "room.examination")!.buildable = false;
    expect(getNextRoomUpgradeCost(state, "room.unbuildable-exam", context)).toBeNull();
  });
});
