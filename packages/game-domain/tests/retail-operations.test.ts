import { describe, expect, it } from "vitest";
import { getServiceIncomeLine } from "@gamify-surgery/balance-config";
import {
  createInitialGameState,
  advanceRetailOperations,
  deserializeGameState,
  gameReducer,
  PROTOTYPE_DOMAIN_CONTEXT,
  serializeGameState,
  type DomainContext,
  type GameState,
  type PendingResult,
} from "../src";

let sequence = 0;

function retailState(): GameState {
  const state = createInitialGameState(undefined, { campaignId: `retail.${sequence++}`, campaignSeed: "retail-operations", createdAtRealMs: 0 });
  state.facilityLevel = 2;
  state.serviceAppointmentsEnabled = false;
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  state.nextFinancialPostingTick = Number.MAX_SAFE_INTEGER;
  state.nextExternalRetailOpportunityTick = Number.MAX_SAFE_INTEGER;
  state.environment.nextLitterSpawnTick = Number.MAX_SAFE_INTEGER;
  state.environment.nextWaterCoolerDrainTick = Number.MAX_SAFE_INTEGER;
  state.encounters = {};
  state.rooms.push(
    { id: "room.retail.ultrasound", roomDefinitionId: "room.ultrasound", x: 33, y: 23, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
    { id: "room.retail.coffee", roomDefinitionId: "room.coffee_kiosk", x: 30, y: 27, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
    ...([24, 25, 26, 27, 28] as const).map((y) => ({ id: `room.retail.hall.${y}`, roomDefinitionId: "room.hallway", x: 32, y, orientation: 0 as const, doorSide: null, upgradeLevel: 1 as const, cleanliness: 100 })),
  );
  state.doors.push(
    { id: "door.retail.ultrasound.south", roomId: "room.retail.ultrasound", side: "south", offset: 2, exterior: false },
    { id: "door.retail.ultrasound", roomId: "room.retail.ultrasound", side: "west", offset: 1, exterior: false },
    { id: "door.retail.coffee", roomId: "room.retail.coffee", side: "east", offset: 1, exterior: false },
    { id: "door.retail.front", roomId: "room.instance.founder_desk", side: "west", offset: 0, exterior: false },
  );
  state.employees.push(employee(state, "employee.shopper", "staff.imaging_technician", "room.retail.ultrasound", { x: 33, y: 25 }));
  state.retailNextOpportunityTicks["employee:employee.shopper"] = Number.MAX_SAFE_INTEGER;
  state.retailNextOpportunityTicks["founder:founder"] = Number.MAX_SAFE_INTEGER;
  return state;
}

function employee(state: GameState, id: string, role: string, roomId: string, location: { x: number; y: number }) {
  return { id, staffRoleDefinitionId: role, displayName: id, appearance: state.founder.appearance, hiredAtFacilityTick: 0, salaryPerExpenseInterval: 20, morale: 75, trainingLevel: 1 as const,
    homeRoomInstanceId: roomId, location, path: [location], pathIndex: 0, lastMovedAtFacilityTick: 0, lastPraisedAtFacilityTick: null, nextIdleActionAtFacilityTick: Number.MAX_SAFE_INTEGER, facilityTask: null };
}

function advance(state: GameState, minutes: number, context: DomainContext = PROTOTYPE_DOMAIN_CONTEXT): GameState {
  let next = state;
  for (let index = 0; index < minutes; index += 1) next = gameReducer(next, { type: "ADVANCE_TICK", operationId: `retail.tick.${sequence++}` }, context);
  return next;
}

function start(state: GameState, line: string, kind: "employee" | "founder" | "encounter" | "retail_visitor", actorId: string, orderId?: string, context: DomainContext = PROTOTYPE_DOMAIN_CONTEXT) {
  return gameReducer(state, { type: "START_RETAIL_PURCHASE", operationId: `retail.start.${sequence++}`, incomeLineId: line, actorKind: kind, actorId, authorizedOrderId: orderId }, context);
}

function addWaitingPatient(state: GameState, id = "encounter.waiting"): void {
  const source = PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.find((candidate) => candidate.earliestFacilityStage <= 1 && candidate.requiredCapabilityIds.length === 0 && candidate.decisionNodes.length > 1)!;
  const admitted = gameReducer(state, { type: "ADMIT_PATIENT", operationId: `admit.${id}`, encounterId: id, caseId: source.id, patientDisplayName: "Waiting Patient", arrivalClass: "routine" });
  Object.assign(state, admitted);
  const encounter = state.encounters[id]!;
  const pending: PendingResult = { operationId: `pending.${id}`, gateId: "gate", originatingNodeIndex: 0, resultTypeId: "service.basic_labs", pendingLabel: "Waiting", resultNarrative: "Ready", routeId: "route.basic_labs.external", routeDisplayName: "External", scheduledAtTick: 0, serviceDurationTicks: 500, durationTicks: 500, dueTick: 500, deliveredAtTick: null, offsiteReturnStartedAtTick: null, offsiteTravel: null, patientTravel: null, patientRemainsOnsite: true, timingPhases: [{ id: "external", durationTicks: 500, resourceBound: false, startsAtTick: 0, endsAtTick: 500 }] };
  encounter.lifecycle = "active_pending_result";
  encounter.pendingResult = pending;
  encounter.steps[0]!.status = "result_pending";
  encounter.steps[0]!.result = pending;
  encounter.patientLocation = { x: 35, y: 25 };
  encounter.patientMovement = null;
  encounter.assignedRoomInstanceId = "room.retail.ultrasound";
  state.retailNextOpportunityTicks[`encounter:${id}`] = Number.MAX_SAFE_INTEGER;
}

function futureOutletContext(roomId: string, capability: string, role?: string): DomainContext {
  const context = JSON.parse(JSON.stringify(PROTOTYPE_DOMAIN_CONTEXT)) as DomainContext;
  const rooms = context.balanceRelease.facility.roomDefinitions as unknown as Array<(typeof context.balanceRelease.facility.roomDefinitions)[number]>;
  const stages = context.balanceRelease.facility.stageDefinitions as unknown as Array<(typeof context.balanceRelease.facility.stageDefinitions)[number]>;
  rooms.push({ ...rooms.find((room) => room.id === "room.coffee_kiosk")!, id: roomId, displayName: roomId, capabilityIds: [capability] });
  if (role) {
    const roles = context.balanceRelease.facility.staffRoleDefinitions as unknown as Array<(typeof context.balanceRelease.facility.staffRoleDefinitions)[number]>;
    roles.push({ ...roles.find((candidate) => candidate.id === "staff.imaging_technician")!, id: role, displayName: role, requiredAnyRoomDefinitionIds: [roomId], capabilityIds: [`capability.${role}`] });
  }
  for (const level of [3, 4, 5] as const) if (!stages.some((stage) => stage.level === level)) stages.push({ ...stages.find((stage) => stage.level === 2)!, level, displayName: `L${level}`, nextFacilityLevel: null } as (typeof stages)[number]);
  return context;
}

describe("retail operations", () => {
  it("autonomously starts optional trips for a free employee and eligible waiting patient without duplicating either identity", () => {
    let state = retailState();
    addWaitingPatient(state);
    state.retailNextOpportunityTicks = {};
    state = advance(state, 60);
    expect(state.retailOperations).toEqual(expect.arrayContaining([
      expect.objectContaining({ actorKind: "employee", actorId: "employee.shopper" }),
      expect.objectContaining({ actorKind: "encounter", actorId: "encounter.waiting" }),
    ]));
    expect(state.employees.filter((employee) => employee.id === "employee.shopper")).toHaveLength(1);
    expect(Object.keys(state.encounters).filter((id) => id === "encounter.waiting")).toHaveLength(1);
  });

  it("lets a free employee and a result-waiting patient buy as their existing identities with atomic gross, stock, and net receipts", () => {
    let state = retailState();
    addWaitingPatient(state);
    const cash = state.cash;
    state = start(state, "income.coffee", "employee", "employee.shopper");
    state = start(state, "income.kiosk_drink", "encounter", "encounter.waiting");
    state = advance(state, 30);
    expect(state.serviceIncomeReceipts).toEqual(expect.arrayContaining([
      expect.objectContaining({ actorKind: "employee", actorId: "employee.shopper", grossAmount: 5, stockCost: 1, netCashDelta: 4 }),
      expect.objectContaining({ actorKind: "patient", actorId: "encounter.waiting", grossAmount: 3, stockCost: 1, netCashDelta: 2 }),
    ]));
    expect(state.cash).toBe(cash + 6);
    expect(state.encounters["encounter.waiting"]!.patientLocation).not.toBeNull();
  });

  it("gives an active employee retail trip sole movement ownership through travel and queueing", () => {
    let state = start(retailState(), "income.coffee", "employee", "employee.shopper");
    const before = { ...state.employees[0]!.location };
    state = advance(state, 1);
    const employeeState = state.employees[0]!;
    const operation = state.retailOperations[0]!;
    expect(Math.abs(employeeState.location.x - before.x) + Math.abs(employeeState.location.y - before.y))
      .toBeLessThanOrEqual(PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility.characterTravelTilesPerTick);
    expect(employeeState.location).toEqual(operation.location);

    operation.status = "queued";
    operation.location = { x: 30, y: 28 };
    operation.path = [{ x: 30, y: 28 }];
    operation.pathIndex = 0;
    employeeState.location = { x: 30, y: 28 };
    employeeState.path = [{ x: 30, y: 28 }, { x: 31, y: 28 }, { x: 32, y: 28 }];
    employeeState.pathIndex = 0;
    employeeState.lastMovedAtFacilityTick = state.facilityTick;
    state = advance(state, 1);
    expect(state.employees[0]!.location).toEqual({ x: 30, y: 28 });
    expect(state.employees[0]!.pathIndex).toBe(0);
  });

  it("preempts an employee trip for real clinical work before fulfillment and never charges the cancelled sale", () => {
    let state = start(retailState(), "income.coffee", "employee", "employee.shopper");
    state = advance(state, 1);
    state = gameReducer(state, { type: "START_SERVICE_OPERATION", operationId: "start-ultrasound", incomeLineId: "income.ultrasound", actorKind: "visitor" });
    state = advance(state, 2);
    expect(state.retailOperations[0]).toMatchObject({ status: "cancelled" });
    expect(state.serviceIncomeReceipts.filter((receipt) => receipt.incomeLineId === "income.coffee")).toEqual([]);
    expect(state.employees[0]!.facilityTask).toMatchObject({ kind: "perform_service" });
  });

  it("lets a nonprocedural service visitor shop under the same visitor identity before care claims it", () => {
    let state = gameReducer(retailState(), { type: "START_SERVICE_OPERATION", operationId: "service-visitor", incomeLineId: "income.ultrasound", actorKind: "visitor" });
    const serviceId = state.serviceOperations[0]!.id;
    state = gameReducer(state, { type: "START_RETAIL_PURCHASE", operationId: "service-visitor-coffee", incomeLineId: "income.coffee", actorKind: "service_visitor", actorId: serviceId });
    expect(state.operationReceipts["service-visitor-coffee"]?.status).toBe("applied");
    state = advance(state, 30);
    expect(state.serviceIncomeReceipts).toEqual(expect.arrayContaining([expect.objectContaining({ incomeLineId: "income.coffee", actorKind: "visitor", actorId: serviceId })]));
    expect(state.serviceOperations.filter((operation) => operation.id === serviceId)).toHaveLength(1);
  });

  it("records founder consumption as exactly-once stock expense with no fabricated gross income", () => {
    let state = retailState();
    state.environment.founderLocation = { x: 35, y: 25 };
    const cash = state.cash;
    state = start(state, "income.coffee", "founder", "founder");
    state = advance(state, 30);
    expect(state.cash).toBe(cash - 1);
    expect(state.serviceIncomeReceipts).toHaveLength(1);
    expect(state.serviceIncomeReceipts[0]).toMatchObject({ actorKind: "founder", grossAmount: 0, stockCost: 1, netCashDelta: -1 });
    const reloaded = advance(deserializeGameState(serializeGameState(state)), 10);
    expect(reloaded.cash).toBe(cash - 1);
    expect(reloaded.serviceIncomeReceipts).toHaveLength(1);
  });

  it("resumes a mid-trip sale after reload and fulfills the frozen quote exactly once", () => {
    let state = start(retailState(), "income.coffee", "employee", "employee.shopper");
    state = advance(state, 2);
    state = deserializeGameState(serializeGameState(state));
    state = advance(state, 30);
    expect(state.serviceIncomeReceipts).toEqual([expect.objectContaining({ incomeLineId: "income.coffee", grossAmount: 5, stockCost: 1 })]);
    state = advance(deserializeGameState(serializeGameState(state)), 30);
    expect(state.serviceIncomeReceipts).toHaveLength(1);
  });

  it("caps each outlet at two approaching/queued shoppers and starts the cooldown even when a trip is later abandoned", () => {
    let state = retailState();
    state.employees.push(employee(state, "employee.two", "staff.imaging_technician", "room.retail.ultrasound", { x: 35, y: 24 }));
    state.employees.push(employee(state, "employee.three", "staff.imaging_technician", "room.retail.ultrasound", { x: 34, y: 25 }));
    state = start(state, "income.coffee", "employee", "employee.shopper");
    state = start(state, "income.coffee", "employee", "employee.two");
    state = start(state, "income.coffee", "employee", "employee.three");
    expect(state.retailOperations).toHaveLength(2);
    expect(Object.values(state.operationReceipts).at(-1)?.status).toBe("rejected");
    state.retailOperations[0]!.status = "queued";
    state.retailOperations[0]!.waitDeadlineFacilityTick = 100;
    state.retailOperations[1]!.status = "purchasing";
    state.retailOperations[1]!.purchaseEndsAtFacilityTick = 100;
    state.facilityTick += 1;
    advanceRetailOperations(state, PROTOTYPE_DOMAIN_CONTEXT);
    expect(state.retailOperations[0]!.status).toBe("queued");
    state.retailOperations[0]!.status = "abandoned";
    state = start(state, "income.coffee", "employee", "employee.shopper");
    expect(Object.values(state.operationReceipts).at(-1)?.status).toBe("rejected");
  });

  it("materializes an authorized outside prescription recipient and persists one staffed fulfillment", () => {
    const context = futureOutletContext("room.pharmacy", "capability.pharmacy", "staff.pharmacist");
    let state = retailState();
    (state as { facilityLevel: number }).facilityLevel = 3;
    state.rooms.find((room) => room.id === "room.retail.coffee")!.roomDefinitionId = "room.pharmacy";
    state.employees.push(employee(state, "employee.pharmacist", "staff.pharmacist", "room.retail.coffee", { x: 30, y: 28 }));
    state.retailNextOpportunityTicks["employee:employee.pharmacist"] = Number.MAX_SAFE_INTEGER;
    state = start(state, "income.pharmacy_pickup", "retail_visitor", "rx.customer", "missing-order", context);
    expect(Object.values(state.operationReceipts).at(-1)?.status).toBe("rejected");
    state = gameReducer(state, { type: "AUTHORIZE_RETAIL_ORDER", operationId: "authorize-rx", orderId: "order.rx", incomeLineId: "income.pharmacy_pickup", actorKind: "retail_visitor", actorId: "rx.customer" }, context);
    expect(state.retailExternalActors).toEqual([expect.objectContaining({ id: "rx.customer", lifecycle: "arriving" })]);
    state = start(state, "income.pharmacy_pickup", "retail_visitor", "rx.customer", "order.rx", context);
    state = advance(state, 40, context);
    expect(state.serviceIncomeReceipts).toEqual(expect.arrayContaining([expect.objectContaining({ incomeLineId: "income.pharmacy_pickup", actorKind: "retail_visitor", grossAmount: 25, stockCost: 15, netCashDelta: 10 })]));
    expect(state.retailOrders[0]).toMatchObject({ fulfilledQuantity: 1 });
    state = gameReducer(state, { type: "AUTHORIZE_RETAIL_ORDER", operationId: "authorize-supply", orderId: "order.supply", incomeLineId: "income.wound_supply", actorKind: "retail_visitor", actorId: "supply.customer" }, context);
    state = start(state, "income.wound_supply", "retail_visitor", "supply.customer", "order.supply", context);
    state = advance(state, 40, context);
    expect(state.serviceIncomeReceipts).toEqual(expect.arrayContaining([expect.objectContaining({ incomeLineId: "income.wound_supply", grossAmount: 20, stockCost: 10 })]));
  });

  it("enforces explicit food restrictions, 120-minute cooldowns, and the two-per-day food cap", () => {
    let state = retailState();
    addWaitingPatient(state);
    state.encounters["encounter.waiting"]!.retailFoodDrinkAllowed = false;
    state = start(state, "income.coffee", "encounter", "encounter.waiting");
    expect(Object.values(state.operationReceipts).at(-1)?.status).toBe("rejected");
    state = start(state, "income.coffee", "employee", "employee.shopper");
    state = advance(state, 30);
    state.facilityTick = state.retailActorLedgers["employee:employee.shopper"]!.lastTripAtFacilityTick! + 120;
    state = start(state, "income.kiosk_drink", "employee", "employee.shopper");
    expect(
      Object.values(state.operationReceipts).at(-1)?.status,
      Object.values(state.operationReceipts).at(-1)?.message,
    ).toBe("applied");
    state = advance(state, 30);
    state.facilityTick = 260;
    state = start(state, "income.kiosk_snack", "employee", "employee.shopper");
    expect(Object.values(state.operationReceipts).at(-1)?.status).toBe("rejected");
    expect(state.serviceIncomeReceipts.filter((receipt) => receipt.actorId === "employee.shopper")).toHaveLength(2);
  });

  it("uses one seeded clinic-wide outside-retail opportunity stream with both arrivals and skipped opportunities", () => {
    let state = retailState();
    state.nextExternalRetailOpportunityTick = 1;
    state = advance(state, 1200);
    const arrivals = state.retailExternalActors.filter((actor) => actor.kind === "retail_visitor").length;
    expect(state.externalRetailSequence).toBe(10);
    expect(arrivals).toBeGreaterThan(0);
    expect(arrivals).toBeLessThan(10);
  });

  it.each([
    ["income.vending_snack", "room.vending", "capability.vending", 4, 2, 1],
    ["income.gift_shop", "room.gift_shop", "capability.gift_shop", 15, 6, 2],
  ])("executes future %s through its supplied capability fixture", (lineId, roomId, capability, gross, cost, duration) => {
    const context = futureOutletContext(roomId, capability);
    let state = retailState();
    (state as { facilityLevel: number }).facilityLevel = lineId.includes("gift") ? 5 : 3;
    state.rooms.find((room) => room.id === "room.retail.coffee")!.roomDefinitionId = roomId;
    state = start(state, lineId, "employee", "employee.shopper", undefined, context);
    expect(state.retailOperations[0]).toMatchObject({ quoteGross: gross, quoteStockCost: cost, outletDurationMinutes: duration });
    state = advance(state, 30, context);
    expect(state.serviceIncomeReceipts[0]).toMatchObject({ incomeLineId: lineId, grossAmount: gross, stockCost: cost });
  });

  it("creates at most one companion for an actual procedural operation and sends it out without delaying the primary", () => {
    let state = retailState();
    state.serviceOperations.push({ id: "procedure.visit", incomeLineId: "income.endoscopy", catalogVersion: 1, actorKind: "visitor", actorId: "procedure.patient", displayName: "Procedure Patient", appearance: state.founder.appearance, status: "waiting_for_resources", createdAtFacilityTick: 0, waitDeadlineFacilityTick: 60, startedAtFacilityTick: null, completedAtFacilityTick: null, cancelledAtFacilityTick: null, quoteFee: 400, phaseIndex: 0, phaseStartedAtFacilityTick: null, phaseEndsAtFacilityTick: null, reservedRoomInstanceIds: [], reservedEmployeeIds: [], providerReservation: null, location: { x: 34, y: 24 }, path: [], pathIndex: 0, lastMovedAtFacilityTick: 0, cancellationReason: null });
    state = advance(state, 1);
    expect(state.retailExternalActors.filter((actor) => actor.kind === "companion")).toHaveLength(1);
    const companion = state.retailExternalActors[0]!;
    const before = { ...companion.location! };
    state.serviceOperations[0]!.location = { x: 30, y: 28 };
    state.facilityTick += 1;
    advanceRetailOperations(state, PROTOTYPE_DOMAIN_CONTEXT);
    expect(Math.abs(companion.location!.x - before.x) + Math.abs(companion.location!.y - before.y)).toBeLessThanOrEqual(1);
    state.serviceOperations[0]!.status = "completed";
    state.serviceOperations[0]!.location = null;
    state = advance(state, 30);
    expect(state.retailExternalActors[0]).toMatchObject({ lifecycle: "departed", location: null });
    expect(state.serviceOperations[0]!.status).toBe("completed");
  });

  it("cancels a walking patient trip when a result becomes due, preserves patient location, and takes no sale", () => {
    let state = retailState();
    addWaitingPatient(state);
    state.encounters["encounter.waiting"]!.pendingResult!.dueTick = 1;
    state = start(state, "income.coffee", "encounter", "encounter.waiting");
    state = advance(state, 2);
    expect(state.retailOperations[0]).toMatchObject({ status: "cancelled" });
    expect(state.serviceIncomeReceipts).toEqual([]);
    const locationAtPreemption = state.encounters["encounter.waiting"]!.patientLocation;
    expect(locationAtPreemption).toEqual({ x: 35, y: 25 });
    state = advance(state, 20);
    expect(state.encounters["encounter.waiting"]!.patientLocation).toEqual({ x: 35, y: 25 });
    expect(state.encounters["encounter.waiting"]!.patientMovement).toBeNull();
    expect(state.encounters["encounter.waiting"]!.lifecycle).toBe("active_action_required");
  });
});
