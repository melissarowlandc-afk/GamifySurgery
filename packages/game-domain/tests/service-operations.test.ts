import { getServiceIncomeLine } from "@gamify-surgery/balance-config";
import { describe, expect, it } from "vitest";
import {
  createInitialGameState,
  deserializeGameState,
  deterministicInteger,
  RANDOM_STREAMS,
  gameReducer,
  getCurrentCapabilities,
  isEmployeeOperational,
  isRoomOperationalForFacilityWork,
  PROTOTYPE_DOMAIN_CONTEXT,
  advanceServiceOperations,
  getNewPeriopServiceOperationPhases,
  getRoomDefinition,
  getRoomCareStations,
  getRoomNavigationAnchor,
  getRoomWaitingAnchors,
  serializeGameState,
  startEncounterProcedureOperation,
  tryStartPatientBathroomTrip,
  type GameState,
  type DomainContext,
  type PendingResult,
} from "../src";

let sequence = 0;

function cloneValue<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function departureSeed(operationId: string, wantsStop: boolean): string {
  for (let index = 0; index < 10_000; index += 1) {
    const seed = `departure-seed.${index}`;
    const roll = deterministicInteger(seed, RANDOM_STREAMS.environment, `service-departure:${operationId}:roll`, 100);
    if ((roll < PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.environment.idleActionChancePercent) === wantsStop) return seed;
  }
  throw new Error("No departure seed found.");
}

function serviceState(campaignSeed = "service-operations"): GameState {
  const state = createInitialGameState(undefined, {
    campaignId: `campaign.service-operations.${sequence++}`,
    campaignSeed,
    createdAtRealMs: 0,
  });
  state.facilityLevel = 1;
  state.serviceAppointmentsEnabled = false;
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  state.nextFinancialPostingTick = Number.MAX_SAFE_INTEGER;
  state.environment.nextLitterSpawnTick = Number.MAX_SAFE_INTEGER;
  state.environment.nextWaterCoolerDrainTick = Number.MAX_SAFE_INTEGER;
  state.encounters = {};
  state.rooms.push(
    { id: "room.test.ultrasound", roomDefinitionId: "room.ultrasound", x: 33, y: 23, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
    ...([24, 25, 26, 27, 28] as const).map((y) => ({ id: `room.test.hall.${y}`, roomDefinitionId: "room.hallway", x: 32, y, orientation: 0 as const, doorSide: null, upgradeLevel: 1 as const, cleanliness: 100 })),
  );
  state.doors.push(
    { id: "door.test.ultrasound", roomId: "room.test.ultrasound", side: "south", offset: 2, exterior: false },
    { id: "door.test.ultrasound.staff", roomId: "room.test.ultrasound", side: "west", offset: 1, exterior: false },
    { id: "door.test.front", roomId: "room.instance.founder_desk", side: "west", offset: 0, exterior: false },
  );
  state.employees.push({
    id: "employee.test.imaging", staffRoleDefinitionId: "staff.imaging_technician",
    displayName: "Imaging Technician", appearance: state.founder.appearance,
    hiredAtFacilityTick: 0, salaryPerExpenseInterval: 26, morale: 75,
    trainingLevel: 1, homeRoomInstanceId: "room.test.ultrasound",
    location: { x: 34, y: 24 }, path: [{ x: 34, y: 24 }], pathIndex: 0,
    lastMovedAtFacilityTick: 0, lastPraisedAtFacilityTick: null,
    nextIdleActionAtFacilityTick: Number.MAX_SAFE_INTEGER, facilityTask: null,
  });
  return state;
}

function advance(state: GameState, minutes: number, context: DomainContext = PROTOTYPE_DOMAIN_CONTEXT): GameState {
  let next = state;
  for (let index = 0; index < minutes; index += 1) {
    next = gameReducer(next, { type: "ADVANCE_TICK", operationId: `service-operation.tick.${sequence++}` }, context);
  }
  return next;
}

function advanceUntil(
  state: GameState,
  predicate: (candidate: GameState) => boolean,
  maximumMinutes = 240,
  context: DomainContext = PROTOTYPE_DOMAIN_CONTEXT,
): GameState {
  let next = state;
  for (let minute = 0; minute < maximumMinutes && !predicate(next); minute += 1) next = advance(next, 1, context);
  expect(predicate(next)).toBe(true);
  return next;
}

function startUltrasound(state: GameState): GameState {
  return gameReducer(state, {
    type: "START_SERVICE_OPERATION",
    operationId: `service-operation.start.${sequence++}`,
    incomeLineId: "income.ultrasound",
    actorKind: "visitor",
  });
}

function periopServiceState(): GameState {
  const state = serviceState("periop-phase-flow");
  state.facilityLevel = 2;
  state.rooms = state.rooms.filter((room) => room.id !== "room.test.ultrasound");
  state.doors = state.doors.filter((door) => !door.id.startsWith("door.test.ultrasound"));
  state.employees = [];
  state.rooms.push(
    { id: "room.test.endoscopy", roomDefinitionId: "room.endoscopy", x: 33, y: 23, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
    { id: "room.test.recovery", roomDefinitionId: "room.periop_recovery", x: 38, y: 23, orientation: 0, doorSide: null, upgradeLevel: 5, cleanliness: 100 },
    { id: "room.test.bridge", roomDefinitionId: "room.hallway", x: 37, y: 24, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
  );
  state.doors.push(
    { id: "door.test.endoscopy.west", roomId: "room.test.endoscopy", side: "west", offset: 1, exterior: false },
    { id: "door.test.endoscopy.east", roomId: "room.test.endoscopy", side: "east", offset: 1, exterior: false },
    { id: "door.test.recovery.west", roomId: "room.test.recovery", side: "west", offset: 1, exterior: false },
  );
  const endoscopy = state.rooms.find((room) => room.id === "room.test.endoscopy")!;
  const recovery = state.rooms.find((room) => room.id === "room.test.recovery")!;
  const endoscopyAnchor = getRoomNavigationAnchor(
    endoscopy,
    getRoomDefinition(endoscopy.roomDefinitionId)!,
    "staff",
  );
  const recoveryAnchor = getRoomNavigationAnchor(
    recovery,
    getRoomDefinition(recovery.roomDefinitionId)!,
    "staff",
  );
  const employee = (id: string, role: string, roomId: string, location: { x: number; y: number }) => ({
    id, staffRoleDefinitionId: role, displayName: id, appearance: state.founder.appearance,
    hiredAtFacilityTick: 0, salaryPerExpenseInterval: 30, morale: 75, trainingLevel: 1 as const,
    homeRoomInstanceId: roomId, location, path: [{ ...location }], pathIndex: 0,
    lastMovedAtFacilityTick: 0, lastPraisedAtFacilityTick: null,
    nextIdleActionAtFacilityTick: Number.MAX_SAFE_INTEGER, facilityTask: null,
  });
  state.employees.push(
    employee("employee.test.endoscopy-nurse", "staff.endoscopy_nurse", endoscopy.id, endoscopyAnchor),
    employee("employee.test.periop-nurse", "staff.periop_nurse", recovery.id, recoveryAnchor),
  );
  return state;
}

function addPeriopBathroom(state: GameState): void {
  state.rooms.push(
    { id: "room.test.bathroom", roomDefinitionId: "room.bathroom", x: 33, y: 29, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
    ...([29, 30, 31] as const).map((y) => ({ id: `room.test.bathroom-hall.${y}`, roomDefinitionId: "room.hallway", x: 32, y, orientation: 0 as const, doorSide: null, upgradeLevel: 1 as const, cleanliness: 100 })),
  );
  state.doors.push({ id: "door.test.bathroom.west", roomId: "room.test.bathroom", side: "west", offset: 1, exterior: false });
}

function startEndoscopyVisitor(state: GameState): GameState {
  return gameReducer(state, {
    type: "START_SERVICE_OPERATION",
    operationId: `service-operation.endoscopy.start.${sequence++}`,
    incomeLineId: "income.endoscopy",
    actorKind: "visitor",
  });
}

function startEndoscopyEncounter(state: GameState, encounterId: string): GameState {
  const template = Object.values(state.encounters)[0];
  if (template) {
    state.encounters[encounterId] = {
      ...cloneValue(template),
      id: encounterId,
      patientDisplayName: encounterId,
      patientMovement: null,
      waitingDestination: null,
    };
  } else {
    state = gameReducer(state, {
      type: "ADMIT_PATIENT",
      operationId: `periop.multi.admit.${encounterId}`,
      encounterId,
      caseId: PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.find(
        (candidate) => candidate.earliestFacilityStage <= 1 && candidate.requiredCapabilityIds.length === 0,
      )!.id,
      patientDisplayName: encounterId,
      arrivalClass: "routine",
    });
  }
  const encounter = state.encounters[encounterId]!;
  encounter.patientMovement = null;
  encounter.patientLocation = { ...state.environment.founderLocation };
  expect(startEncounterProcedureOperation(state, encounter, "income.endoscopy", PROTOTYPE_DOMAIN_CONTEXT)).toBe(true);
  return state;
}

describe("service-only operations", () => {
  it("moves a visitor through real work and departure, then credits the frozen quote exactly once without FSRS work", () => {
    let state = serviceState();
    const initialCash = state.cash;
    const initialReviews = Object.values(state.learningHistories).reduce((sum, history) => sum + history.reviews.length, 0);
    expect([...getCurrentCapabilities(state)]).toContain("capability.ultrasound_machine");
    expect([...getCurrentCapabilities(state)]).toContain("capability.staff.imaging_technician");
    expect(isRoomOperationalForFacilityWork(state, "room.test.ultrasound")).toBe(true);
    expect(isEmployeeOperational(state, "employee.test.imaging")).toBe(true);
    state = startUltrasound(state);
    expect(Object.values(state.operationReceipts).at(-1)).toMatchObject({ status: "applied" });
    const operation = state.serviceOperations[0]!;
    expect(operation).toMatchObject({ actorKind: "visitor", status: "arriving", quoteFee: 120 });
    expect(operation.location).toEqual(operation.visitorTravel?.offscreenEndpoint);
    const line = getServiceIncomeLine("income.ultrasound")! as { fee: number };
    const originalFee = line.fee;
    line.fee = 999;
    try {
      state = advance(state, 180);
    } finally {
      line.fee = originalFee;
    }
    expect(state.serviceOperations[0]).toMatchObject({ status: "completed", location: null, cancellationReason: null });
    expect(state.cash).toBe(initialCash + 120);
    expect(state.serviceIncomeReceipts).toHaveLength(1);
    expect(state.serviceIncomeReceipts[0]).toMatchObject({ actorKind: "visitor", grossAmount: 120 });
    expect(Object.values(state.learningHistories).reduce((sum, history) => sum + history.reviews.length, 0)).toBe(initialReviews);
    const reloaded = advance(deserializeGameState(serializeGameState(state)), 10);
    expect(reloaded.cash).toBe(initialCash + 120);
    expect(reloaded.serviceIncomeReceipts).toHaveLength(1);
  });

  it("persists complete arrivals and departures from both deterministic sidewalk sides", () => {
    const bySide = new Map<number, GameState>();
    for (let seed = 0; seed < 32 && bySide.size < 2; seed += 1) {
      const candidate = startUltrasound(serviceState(`visitor-side.${seed}`));
      const endpoint = candidate.serviceOperations[0]!.visitorTravel!.offscreenEndpoint;
      bySide.set(Math.sign(endpoint.x), candidate);
    }
    expect([...bySide.keys()].sort()).toEqual([-1, 1]);
    for (const state of bySide.values()) {
      const operation = state.serviceOperations[0]!;
      const actorId = operation.actorId;
      const endpoint = { ...operation.visitorTravel!.offscreenEndpoint };
      expect(endpoint.x === -2 || endpoint.x === PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility.gridWidth + 1).toBe(true);
      const midArrival = advance(state, 2);
      const pathIndex = midArrival.serviceOperations[0]!.pathIndex;
      let current = deserializeGameState(serializeGameState(midArrival));
      expect(current.serviceOperations[0]).toMatchObject({ status: "arriving", pathIndex, actorId });
      let previousLocation = { ...current.serviceOperations[0]!.location! };
      let lastVisibleLocation = previousLocation;
      let reloadedDeparture = false;
      let phaseDuration: number | null = null;
      for (let minute = 0; minute < 240 && current.serviceOperations[0]!.status !== "completed"; minute += 1) {
        current = advance(current, 1);
        const nextOperation = current.serviceOperations[0]!;
        expect(nextOperation.actorId).toBe(actorId);
        if (nextOperation.phaseStartedAtFacilityTick !== null && nextOperation.phaseEndsAtFacilityTick !== null) {
          phaseDuration = nextOperation.phaseEndsAtFacilityTick - nextOperation.phaseStartedAtFacilityTick;
        }
        if (nextOperation.location) {
          const distance = Math.abs(nextOperation.location.x - previousLocation.x) + Math.abs(nextOperation.location.y - previousLocation.y);
          expect(distance).toBeLessThanOrEqual(PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility.characterTravelTilesPerTick);
          previousLocation = { ...nextOperation.location };
          lastVisibleLocation = previousLocation;
        } else {
          expect(nextOperation.status).toBe("completed");
        }
        if (!reloadedDeparture && nextOperation.status === "leaving" && nextOperation.pathIndex > 0) {
          current = deserializeGameState(serializeGameState(current));
          reloadedDeparture = true;
        }
      }
      expect(current.serviceOperations[0]).toMatchObject({ status: "completed", location: null });
      expect(reloadedDeparture).toBe(true);
      expect(current.serviceOperations[0]!.path.at(-1)).toEqual(endpoint);
      expect(current.serviceOperations[0]!.pathIndex).toBe(current.serviceOperations[0]!.path.length - 1);
      expect(Math.abs(lastVisibleLocation.x - endpoint.x) + Math.abs(lastVisibleLocation.y - endpoint.y))
        .toBeLessThanOrEqual(PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility.characterTravelTilesPerTick);
      expect(phaseDuration).toBe(45);
      expect(current.serviceIncomeReceipts).toHaveLength(1);
      current = advance(deserializeGameState(serializeGameState(current)), 10);
      expect(current.serviceIncomeReceipts).toHaveLength(1);
    }
  });

  it("starts the resource timeout only after arrival and visibly leaves after a reloaded wait", () => {
    let state = startUltrasound(serviceState("visitor-timeout"));
    state.employees = [];
    const createdDeadline = state.serviceOperations[0]!.waitDeadlineFacilityTick;
    state = advanceUntil(state, (candidate) => candidate.serviceOperations[0]?.status === "waiting_for_resources");
    const operation = state.serviceOperations[0]!;
    expect(operation.visitorTravel!.arrivedAtFacilityTick).toBe(state.facilityTick);
    expect(operation.waitDeadlineFacilityTick).toBe(state.facilityTick + 60);
    expect(operation.waitDeadlineFacilityTick).toBeGreaterThan(createdDeadline);
    const waitingLocation = { ...operation.location! };
    state = deserializeGameState(serializeGameState(state));
    state = advance(state, 59);
    expect(state.serviceOperations[0]).toMatchObject({ status: "waiting_for_resources", location: waitingLocation });
    state = advance(state, 1);
    expect(state.serviceOperations[0]).toMatchObject({ status: "leaving", cancelledAtFacilityTick: state.facilityTick });
    expect(state.serviceOperations[0]!.path.at(-1)).toEqual(state.serviceOperations[0]!.visitorTravel!.offscreenEndpoint);
    state = advance(state, 120);
    expect(state.serviceOperations[0]).toMatchObject({ status: "cancelled", location: null });
    expect(state.serviceIncomeReceipts).toEqual([]);
  });

  it("extends a legacy visitor departure from its saved location to a deterministic offscreen endpoint", () => {
    let state = startUltrasound(serviceState("legacy-visitor"));
    const operation = state.serviceOperations[0]!;
    const oldEntrancePath = operation.path;
    operation.status = "leaving";
    operation.location = { ...oldEntrancePath.at(-1)! };
    operation.path = [{ ...operation.location }, { ...oldEntrancePath.at(-2)! }];
    operation.pathIndex = 0;
    delete operation.visitorTravel;
    state = advance(deserializeGameState(serializeGameState(state)), 1);
    const migrated = state.serviceOperations[0]!;
    expect(migrated.visitorTravel).toMatchObject({ version: "service-visitor-travel.v1" });
    expect(migrated.path.at(-1)).toEqual(migrated.visitorTravel!.offscreenEndpoint);
    state = advance(state, 120);
    expect(state.serviceOperations[0]).toMatchObject({ status: "completed", location: null });
  });

  it("keeps one active and one waiting operation per line even when both were explicitly queued", () => {
    let state = advanceUntil(
      startUltrasound(serviceState()),
      (candidate) => candidate.serviceOperations[0]?.status === "walking_to_service" || candidate.serviceOperations[0]?.status === "in_service",
    );
    state = startUltrasound(state);
    const operationCount = state.serviceOperations.length;
    state = startUltrasound(state);
    expect(state.serviceOperations).toHaveLength(operationCount);
    expect(Object.values(state.operationReceipts).at(-1)?.status).toBe("rejected");
    expect(state.serviceOperations.map((operation) => operation.status).filter((status) => status === "arriving")).toHaveLength(1);
    expect(state.serviceOperations.map((operation) => operation.status).filter((status) => status === "walking_to_service" || status === "in_service")).toHaveLength(1);
    state = advance(state, 240);
    expect(state.serviceIncomeReceipts).toHaveLength(2);
  });

  it("does not leave phantom reservations when a selected employee cannot reach the room", () => {
    let state = startUltrasound(serviceState());
    state.employees[0]!.location = { x: 0, y: 0 };
    state.employees[0]!.path = [{ x: 0, y: 0 }];
    state = advanceUntil(state, (candidate) => candidate.serviceOperations[0]?.status === "waiting_for_resources");
    expect(state.serviceOperations[0]).toMatchObject({
      status: "waiting_for_resources",
      reservedRoomInstanceIds: [],
      reservedEmployeeIds: [],
    });
    expect(state.employees[0]!.facilityTask).toBeNull();
  });

  it("persists in-flight work and posts its receipt once after reload", () => {
    let state = advance(startUltrasound(serviceState()), 10);
    expect(state.serviceIncomeReceipts).toEqual([]);
    state = deserializeGameState(serializeGameState(state));
    state = advance(state, 100);
    expect(state.serviceIncomeReceipts).toHaveLength(1);
    const transactionKey = state.serviceIncomeReceipts[0]!.transactionKey;
    state = advance(deserializeGameState(serializeGameState(state)), 100);
    expect(state.serviceIncomeReceipts.map((receipt) => receipt.transactionKey)).toEqual([transactionKey]);
  });

  it("gives a concrete clinical acquisition first claim while allowing a second room and technician to serve a visitor", () => {
    let state = serviceState();
    state.rooms.push(
      { id: "room.test.ultrasound.second", roomDefinitionId: "room.ultrasound", x: 33, y: 19, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
      ...([20, 21, 22, 23] as const).map((y) => ({ id: `room.test.hall.${y}`, roomDefinitionId: "room.hallway", x: 32, y, orientation: 0 as const, doorSide: null, upgradeLevel: 1 as const, cleanliness: 100 })),
    );
    state.doors.push({ id: "door.test.ultrasound.second", roomId: "room.test.ultrasound.second", side: "west", offset: 1, exterior: false });
    state.employees.push({ ...state.employees[0]!, id: "employee.test.imaging.second", homeRoomInstanceId: "room.test.ultrasound.second", location: { x: 34, y: 20 }, path: [{ x: 34, y: 20 }] });
    state = gameReducer(state, {
      type: "ADMIT_PATIENT", operationId: "clinical-priority.admit", encounterId: "clinical-priority",
      caseId: PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.find((clinicalCase) => clinicalCase.earliestFacilityStage <= 1 && clinicalCase.requiredCapabilityIds.length === 0)!.id,
      patientDisplayName: "Clinical Priority", arrivalClass: "routine",
    });
    const encounter = state.encounters["clinical-priority"]!;
    const pending: PendingResult = {
      operationId: "clinical-priority.result", gateId: "clinical-priority.gate", originatingNodeIndex: 0,
      resultTypeId: "service.ultrasound", pendingLabel: "Scanning", resultNarrative: "Pending",
      routeId: "route.ultrasound.in_house", routeDisplayName: "Onsite ultrasound",
      scheduledAtTick: state.facilityTick, serviceDurationTicks: 100, durationTicks: 100,
      dueTick: state.facilityTick + 100, deliveredAtTick: null, offsiteReturnStartedAtTick: null,
      offsiteTravel: null, patientRemainsOnsite: true,
      patientTravel: { version: "patient-travel.v1", originRoomInstanceId: "room.instance.founder_desk", destinationRoomInstanceId: "room.test.ultrasound", outboundPath: [], returnPath: [], tilesPerTick: 1, outboundStartTick: 0, outboundArrivalTick: 0, serviceCompletionTick: 100, returnArrivalTick: 100 },
      timingPhases: [{ id: "clinical-acquisition", durationTicks: 100, resourceBound: true, startsAtTick: state.facilityTick, endsAtTick: state.facilityTick + 100 }],
      resourceReservations: [{ roomDefinitionId: "room.ultrasound", staffRoleDefinitionId: "staff.imaging_technician" }],
      imagingTechnicianId: "employee.test.imaging",
    };
    encounter.pendingResult = pending;
    encounter.steps[0]!.status = "feedback_pending";
    encounter.steps[0]!.result = pending;
    encounter.lifecycle = "active_pending_result";
    state = advanceUntil(startUltrasound(state), (candidate) => candidate.serviceOperations[0]?.status === "walking_to_service");
    expect(state.serviceOperations[0]).toMatchObject({
      reservedRoomInstanceIds: ["room.test.ultrasound.second"],
      reservedEmployeeIds: ["employee.test.imaging.second"],
    });
  });

  it("freezes prep-first phase contracts for new Endoscopy and future OR operations", () => {
    expect(getNewPeriopServiceOperationPhases("income.endoscopy")?.map((phase) => [
      phase.roomDefinitionId,
      phase.durationMinutes,
      phase.roomStationId ?? null,
    ])).toEqual([
      ["room.periop_recovery", 30, "periop_preparation"],
      ["room.endoscopy", 45, null],
      ["room.periop_recovery", 60, "periop_recovery"],
    ]);
    expect(getNewPeriopServiceOperationPhases("income.advanced_endoscopy")?.map((phase) => phase.durationMinutes)).toEqual([30, 45, 60]);
    expect(getNewPeriopServiceOperationPhases("income.ambulatory_operation")?.map((phase) => phase.durationMinutes)).toEqual([30, 120, 60]);
    expect(getNewPeriopServiceOperationPhases("income.ambulatory_operation_extended")?.map((phase) => phase.durationMinutes)).toEqual([30, 180, 60]);
    expect(getNewPeriopServiceOperationPhases("income.ultrasound")).toBeNull();
  });

  it("assigns eight distinct authored beds under one shared Periop nurse and leaves the ninth queued", () => {
    let state = periopServiceState();
    for (let index = 0; index < 9; index += 1) state = startEndoscopyEncounter(state, `encounter.periop.${index}`);
    state = advanceUntil(state, (candidate) =>
      candidate.serviceOperations.filter((operation) => operation.periopBedReservation).length === 8,
    );
    const assigned = state.serviceOperations.filter((operation) => operation.periopBedReservation);
    expect(assigned.map((operation) => operation.periopBedReservation!.bedId).sort()).toEqual([
      "EC", "ED", "N3", "N4", "S3", "S4", "WC", "WD",
    ]);
    expect(new Set(assigned.map((operation) => `${operation.periopBedReservation!.endpoint.x},${operation.periopBedReservation!.endpoint.y}`)).size).toBe(8);
    expect(state.serviceOperations.filter((operation) => operation.status === "waiting_for_resources")).toHaveLength(1);
    expect(state.employees.filter((employee) => employee.facilityTask?.kind === "cover_periop")).toEqual([
      expect.objectContaining({ id: "employee.test.periop-nurse", facilityTask: expect.objectContaining({ targetId: "room.test.recovery" }) }),
    ]);
    const restored = deserializeGameState(serializeGameState(state));
    expect(restored.serviceOperations.filter((operation) => operation.periopBedReservation)).toHaveLength(8);
    expect(new Set(restored.serviceOperations.flatMap((operation) => operation.periopBedReservation
      ? [`${operation.periopBedReservation.roomInstanceId}:${operation.periopBedReservation.bedId}`]
      : [])).size).toBe(8);
  });

  it("excludes a door-hidden bed and rejects duplicate active bed reservations on reload", () => {
    let state = periopServiceState();
    state.doors.push({ id: "door.test.recovery.east.2", roomId: "room.test.recovery", side: "east", offset: 2, exterior: false });
    for (let index = 0; index < 8; index += 1) state = startEndoscopyEncounter(state, `encounter.hidden-bed.${index}`);
    state = advanceUntil(state, (candidate) =>
      candidate.serviceOperations.filter((operation) => operation.periopBedReservation).length === 7,
    );
    expect(state.serviceOperations.flatMap((operation) => operation.periopBedReservation?.bedId ?? [])).not.toContain("EC");
    const duplicate = cloneValue(state.serviceOperations.find((operation) => operation.periopBedReservation)!);
    duplicate.id = "service-operation.duplicate-bed";
    duplicate.actorId = "encounter.duplicate-bed";
    state.serviceOperations.push(duplicate);
    const restored = deserializeGameState(serializeGameState(state));
    const duplicateKey = `${duplicate.periopBedReservation!.roomInstanceId}:${duplicate.periopBedReservation!.bedId}`;
    expect(restored.serviceOperations.filter((operation) => operation.periopBedReservation &&
      `${operation.periopBedReservation.roomInstanceId}:${operation.periopBedReservation.bedId}` === duplicateKey)).toHaveLength(1);
  });

  it("starts the 30-minute prep clock at physical periop arrival and waits there without reserving Founder", () => {
    let state = startEndoscopyVisitor(periopServiceState());
    expect(state.serviceOperations).toHaveLength(1);
    state = advanceUntil(
      state,
      (candidate) => candidate.serviceOperations[0]?.status === "in_service",
    );
    let operation = state.serviceOperations[0]!;
    const recovery = state.rooms.find((room) => room.id === "room.test.recovery")!;
    const prepAnchor = getRoomCareStations(
      recovery,
      getRoomDefinition(recovery.roomDefinitionId)!,
      state.doors,
      state.rooms,
      (id) => getRoomDefinition(id),
    )[0]!;
    expect(operation).toMatchObject({
      phaseFlowVersion: 1,
      phaseIndex: 0,
      status: "in_service",
      reservedRoomInstanceIds: [recovery.id],
      reservedEmployeeIds: [],
      providerReservation: null,
      location: prepAnchor.patientAnchor,
      periopBedReservation: expect.objectContaining({ bedId: "N3", endpoint: prepAnchor.patientAnchor }),
    });
    expect(operation.phaseEndsAtFacilityTick! - operation.phaseStartedAtFacilityTick!).toBe(30);
    expect(state.environment.founderActivity?.targetId).not.toBe(operation.id);
    state.environment.founderActivity = {
      kind: "attend_encounter",
      targetId: "encounter.unrelated",
      path: [{ ...state.environment.founderLocation }],
      pathIndex: 0,
      lastMovedAtFacilityTick: state.facilityTick,
      workMinutesRemaining: Number.MAX_SAFE_INTEGER,
    };
    const frozenPrepEnd = operation.phaseEndsAtFacilityTick;
    state = advance(state, 12);
    state = deserializeGameState(serializeGameState(state));
    expect(state.serviceOperations[0]).toMatchObject({
      phaseIndex: 0,
      status: "in_service",
      phaseEndsAtFacilityTick: frozenPrepEnd,
    });
    state = advance(state, 17);
    expect(state.serviceOperations[0]).toMatchObject({ phaseIndex: 0, status: "in_service", location: prepAnchor.patientAnchor });
    state = advance(state, 1);
    operation = state.serviceOperations[0]!;
    expect(operation).toMatchObject({
      phaseIndex: 0,
      status: "waiting_for_next_phase",
      reservedRoomInstanceIds: [],
      reservedEmployeeIds: [],
      providerReservation: null,
      location: prepAnchor.patientAnchor,
    });
    expect(state.employees.find((employee) => employee.id === "employee.test.periop-nurse")?.facilityTask).toMatchObject({ kind: "cover_periop", targetId: recovery.id });
    const savedPrepStart = operation.startedAtFacilityTick;
    state = deserializeGameState(serializeGameState(state));
    expect(state.serviceOperations[0]).toMatchObject({
      phaseFlowVersion: 1,
      status: "waiting_for_next_phase",
      startedAtFacilityTick: savedPrepStart,
    });
    expect(state.employees.find((employee) => employee.id === "employee.test.periop-nurse")?.facilityTask).toMatchObject({
      kind: "cover_periop",
      targetId: recovery.id,
    });
    state.environment.founderActivity = null;
    state = advance(state, 1);
    expect(state.serviceOperations[0]).toMatchObject({
      phaseIndex: 1,
      status: "walking_between_phases",
      reservedRoomInstanceIds: ["room.test.endoscopy"],
      reservedEmployeeIds: ["employee.test.endoscopy-nurse"],
      providerReservation: { kind: "founder" },
    });
    state = advanceUntil(
      state,
      (candidate) => candidate.serviceOperations[0]?.status === "in_service",
    );
    expect(state.serviceOperations[0]!.phaseEndsAtFacilityTick! - state.serviceOperations[0]!.phaseStartedAtFacilityTick!).toBe(45);
  });

  it("pauses periop preparation while a visitor physically uses the bathroom and resumes the unchanged remainder after reload", () => {
    let state = periopServiceState();
    addPeriopBathroom(state);
    state = startEndoscopyVisitor(state);
    state = advanceUntil(state, (candidate) => candidate.serviceOperations[0]?.status === "in_service");
    const operationId = state.serviceOperations[0]!.id;
    const originalEnd = state.serviceOperations[0]!.phaseEndsAtFacilityTick!;
    expect(isRoomOperationalForFacilityWork(state, "room.test.bathroom", PROTOTYPE_DOMAIN_CONTEXT)).toBe(true);
    expect(tryStartPatientBathroomTrip(state, "service_visitor", operationId, PROTOTYPE_DOMAIN_CONTEXT)).toBe(true);
    state = advance(state, 4);
    expect(state.serviceOperations[0]).toMatchObject({ phaseIndex: 0, status: "in_service", phaseEndsAtFacilityTick: originalEnd + 4 });
    expect(state.serviceOperations[0]!.reservedRoomInstanceIds).not.toContain("room.test.endoscopy");
    state = deserializeGameState(serializeGameState(state));
    expect(state.patientAmenityTrips).toHaveLength(1);
    const remaining = state.serviceOperations[0]!.phaseEndsAtFacilityTick! - state.facilityTick;
    state = advanceUntil(state, (candidate) => !candidate.patientAmenityTrips?.length, 120);
    expect(state.serviceOperations[0]).toMatchObject({ phaseIndex: 0, status: "in_service" });
    expect(state.serviceOperations[0]!.phaseEndsAtFacilityTick! - state.facilityTick).toBe(remaining - 1);
  });

  it("keeps a bathroom-absent ready patient out of the suite FIFO and excludes procedure and recovery phases", () => {
    let state = periopServiceState();
    addPeriopBathroom(state);
    state.environment.founderActivity = {
      kind: "attend_encounter", targetId: "encounter.unrelated",
      path: [{ ...state.environment.founderLocation }], pathIndex: 0,
      lastMovedAtFacilityTick: state.facilityTick, workMinutesRemaining: Number.MAX_SAFE_INTEGER,
    };
    state = startEndoscopyVisitor(state);
    state = advanceUntil(state, (candidate) => candidate.serviceOperations[0]?.status === "waiting_for_next_phase");
    const operationId = state.serviceOperations[0]!.id;
    const readyAt = state.serviceOperations[0]!.nextPhaseReadyAtFacilityTick;
    expect(tryStartPatientBathroomTrip(state, "service_visitor", operationId, PROTOTYPE_DOMAIN_CONTEXT)).toBe(true);
    state.environment.founderActivity = null;
    state = advance(state, 5);
    expect(state.serviceOperations[0]).toMatchObject({ status: "waiting_for_next_phase", phaseIndex: 0, nextPhaseReadyAtFacilityTick: readyAt });
    expect(state.serviceOperations[0]!.reservedRoomInstanceIds).toEqual([]);
    state = advanceUntil(state, (candidate) => !candidate.patientAmenityTrips?.length, 120);
    state = advanceUntil(state, (candidate) => candidate.serviceOperations[0]?.status === "in_service" && candidate.serviceOperations[0]?.phaseIndex === 1);
    expect(tryStartPatientBathroomTrip(state, "service_visitor", operationId, PROTOTYPE_DOMAIN_CONTEXT)).toBe(false);
    state = advanceUntil(state, (candidate) => candidate.serviceOperations[0]?.status === "in_service" && candidate.serviceOperations[0]?.phaseIndex === 2);
    expect(tryStartPatientBathroomTrip(state, "service_visitor", operationId, PROTOTYPE_DOMAIN_CONTEXT)).toBe(false);
  });

  it("releases the bed, persists one departure bathroom stop, and then completes the full visitor exit", () => {
    let state = periopServiceState();
    addPeriopBathroom(state);
    state = startEndoscopyVisitor(state);
    const operationId = state.serviceOperations[0]!.id;
    state.campaignSeed = departureSeed(operationId, true);
    state = advanceUntil(state, (candidate) => candidate.serviceOperations[0]?.periopBedReservation !== undefined, 120);
    state = advanceUntil(state, (candidate) => candidate.serviceOperations[0]?.periopBedReservation === undefined, 300);
    expect(state.serviceOperations[0]).toMatchObject({
      status: "discharging",
      departureItinerary: { status: "bathroom", choiceKind: "bathroom" },
    });
    expect(state.patientAmenityTrips?.[0]).toMatchObject({ purpose: "departure", linkedServiceOperationId: operationId });
    state = deserializeGameState(serializeGameState(state));
    expect(state.patientAmenityTrips).toHaveLength(1);
    state = advanceUntil(state, (candidate) => candidate.serviceOperations[0]?.status === "completed", 300);
    expect(state.serviceOperations[0]).toMatchObject({ departureItinerary: { status: "completed" }, location: null });
    expect(state.serviceIncomeReceipts.filter((receipt) => receipt.incomeLineId === "income.endoscopy")).toHaveLength(1);
  });

  it("lets recovery progress beside a prepared patient and then releases Endoscopy without deadlock", () => {
    let state = startEndoscopyVisitor(periopServiceState());
    state = advanceUntil(
      state,
      (candidate) => candidate.serviceOperations[0]?.status === "in_service" && candidate.serviceOperations[0]?.phaseIndex === 1,
    );
    const firstId = state.serviceOperations[0]!.id;
    state = startEndoscopyVisitor(state);
    expect(state.serviceOperations).toHaveLength(2);
    const secondId = state.serviceOperations[1]!.id;
    state = advanceUntil(
      state,
      (candidate) => candidate.serviceOperations.find((operation) => operation.id === secondId)?.status === "in_service",
    );
    expect(state.serviceOperations.find((operation) => operation.id === secondId)).toMatchObject({
      phaseIndex: 0,
      reservedRoomInstanceIds: ["room.test.recovery"],
    });
    state = advanceUntil(
      state,
      (candidate) => candidate.serviceOperations.find((operation) => operation.id === firstId)?.phaseIndex === 2,
    );
    expect(state.serviceOperations.find((operation) => operation.id === firstId)).toMatchObject({
      reservedRoomInstanceIds: ["room.test.recovery"],
    });
    state = advanceUntil(
      state,
      (candidate) => candidate.serviceOperations.find((operation) => operation.id === secondId)?.phaseIndex === 1,
    );
    expect(state.serviceOperations.find((operation) => operation.id === secondId)).toMatchObject({
      reservedRoomInstanceIds: ["room.test.endoscopy"],
    });
  });

  it("holds the Endoscopy suite until the outgoing patient physically clears it", () => {
    let state = startEndoscopyVisitor(periopServiceState());
    state = advanceUntil(state, (candidate) => candidate.serviceOperations[0]?.phaseIndex === 1 && candidate.serviceOperations[0]?.status === "in_service");
    const firstId = state.serviceOperations[0]!.id;
    state = startEndoscopyVisitor(state);
    const secondId = state.serviceOperations[1]!.id;
    const procedureEnd = state.serviceOperations.find((operation) => operation.id === firstId)!.phaseEndsAtFacilityTick!;
    state = advance(state, procedureEnd - state.facilityTick);
    expect(state.serviceOperations.find((operation) => operation.id === firstId)).toMatchObject({
      phaseIndex: 2,
      status: "walking_between_phases",
      transitionHeldRoomInstanceIds: ["room.test.endoscopy"],
    });
    expect(state.serviceOperations.find((operation) => operation.id === secondId)?.reservedRoomInstanceIds).not.toContain("room.test.endoscopy");
    for (let minute = 0; minute < 120; minute += 1) {
      const suiteOwners = state.serviceOperations.filter((operation) =>
        operation.status !== "completed" && operation.status !== "cancelled" &&
        (operation.reservedRoomInstanceIds.includes("room.test.endoscopy") ||
          operation.transitionHeldRoomInstanceIds?.includes("room.test.endoscopy")),
      );
      expect(suiteOwners.length).toBeLessThanOrEqual(1);
      state = advance(state, 1);
      if (state.serviceOperations.find((operation) => operation.id === secondId)?.reservedRoomInstanceIds.includes("room.test.endoscopy")) break;
    }
    expect(state.serviceOperations.find((operation) => operation.id === firstId)?.transitionHeldRoomInstanceIds).not.toContain("room.test.endoscopy");
    expect(state.serviceOperations.find((operation) => operation.id === secondId)?.reservedRoomInstanceIds).toContain("room.test.endoscopy");
  });

  it("runs 60 recovery minutes from bed arrival, persists mid-recovery, and holds the bed through physical discharge", () => {
    let state = startEndoscopyVisitor(periopServiceState());
    state = advanceUntil(state, (candidate) => candidate.serviceOperations[0]?.phaseIndex === 2 && candidate.serviceOperations[0]?.status === "in_service");
    const recoveryStart = state.serviceOperations[0]!.phaseStartedAtFacilityTick!;
    expect(state.serviceOperations[0]!.phaseEndsAtFacilityTick).toBe(recoveryStart + 60);
    state = advance(state, 59);
    expect(state.serviceOperations[0]).toMatchObject({ phaseIndex: 2, status: "in_service", phaseStartedAtFacilityTick: recoveryStart });
    state = deserializeGameState(serializeGameState(state));
    state = advance(state, 1);
    expect(state.serviceOperations[0]).toMatchObject({ status: "discharging", completedAtFacilityTick: state.facilityTick });
    expect(state.serviceOperations[0]!.periopBedReservation).toBeDefined();
    expect(state.serviceIncomeReceipts).toHaveLength(1);
    state = advanceUntil(state, (candidate) => candidate.serviceOperations[0]?.periopBedReservation === undefined);
    state = advance(state, 1);
    expect(state.serviceOperations[0]!.status).toBe("leaving");
    state = advanceUntil(state, (candidate) => candidate.serviceOperations[0]?.status === "completed", 120);
    expect(state.serviceOperations[0]!.location).toBeNull();
    expect(state.serviceIncomeReceipts).toHaveLength(1);
  });

  it("pauses prep while shared nurse coverage is lost and resumes with a replacement", () => {
    let state = startEndoscopyVisitor(periopServiceState());
    state = advanceUntil(state, (candidate) => candidate.serviceOperations[0]?.phaseIndex === 0 && candidate.serviceOperations[0]?.status === "in_service");
    const firstNurse = state.employees.find((employee) => employee.id === "employee.test.periop-nurse")!;
    const originalEnd = state.serviceOperations[0]!.phaseEndsAtFacilityTick!;
    state.employees.push({
      ...cloneValue(firstNurse),
      id: "employee.test.periop-nurse.replacement",
      displayName: "Replacement Periop Nurse",
      location: { ...state.environment.founderLocation },
      path: [{ ...state.environment.founderLocation }],
      pathIndex: 0,
      facilityTask: null,
    });
    firstNurse.homeRoomInstanceId = null;
    state = advance(state, 1);
    expect(state.employees.find((employee) => employee.id === "employee.test.periop-nurse.replacement")?.facilityTask).toMatchObject({
      kind: "cover_periop",
      targetId: "room.test.recovery",
    });
    expect(state.serviceOperations[0]!.phaseEndsAtFacilityTick).toBeGreaterThan(originalEnd);
    state = advanceUntil(state, (candidate) => (candidate.serviceOperations[0]?.phaseIndex ?? 0) > 0);
    expect(state.serviceOperations[0]!.cancellationReason).toBeNull();
  });

  it("freezes the prep-first contract on new encounter operations while legacy phase zero stays unchanged", () => {
    let state = periopServiceState();
    state = gameReducer(state, {
      type: "ADMIT_PATIENT",
      operationId: "periop.encounter.admit",
      encounterId: "encounter.periop",
      caseId: PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.find((candidate) => candidate.earliestFacilityStage <= 1 && candidate.requiredCapabilityIds.length === 0)!.id,
      patientDisplayName: "Periop Patient",
      arrivalClass: "routine",
    });
    const encounter = state.encounters["encounter.periop"]!;
    encounter.patientMovement = null;
    encounter.patientLocation = { ...state.environment.founderLocation };
    expect(startEncounterProcedureOperation(state, encounter, "income.endoscopy", PROTOTYPE_DOMAIN_CONTEXT)).toBe(true);
    expect(state.serviceOperations[0]).toMatchObject({
      actorKind: "encounter",
      phaseFlowVersion: 1,
      phaseIndex: 0,
      frozenOperationPhases: [
        expect.objectContaining({ durationMinutes: 30, roomStationId: "periop_preparation" }),
        expect.objectContaining({ durationMinutes: 45, roomDefinitionId: "room.endoscopy" }),
        expect.objectContaining({ durationMinutes: 60, roomStationId: "periop_recovery" }),
      ],
    });

    let legacyState = startEndoscopyVisitor(periopServiceState());
    delete legacyState.serviceOperations[0]!.phaseFlowVersion;
    delete legacyState.serviceOperations[0]!.periopBedFlowVersion;
    delete legacyState.serviceOperations[0]!.periopBedReservation;
    delete legacyState.serviceOperations[0]!.nextPhaseReadyAtFacilityTick;
    delete legacyState.serviceOperations[0]!.transitionHeldRoomInstanceIds;
    delete legacyState.serviceOperations[0]!.frozenOperationPhases;
    legacyState = deserializeGameState(serializeGameState(legacyState));
    legacyState = advanceUntil(
      legacyState,
      (candidate) => candidate.serviceOperations[0]?.status === "in_service",
    );
    const legacy = legacyState.serviceOperations[0]!;
    expect(legacy).toMatchObject({
      phaseIndex: 0,
      status: "in_service",
      reservedRoomInstanceIds: ["room.test.endoscopy", "room.test.recovery"],
    });
    expect(legacy.phaseFlowVersion).toBeUndefined();
    expect(legacy.location).toEqual(getRoomNavigationAnchor(
      legacyState.rooms.find((room) => room.id === "room.test.endoscopy")!,
      getRoomDefinition("room.endoscopy")!,
      "primary",
    ));
    expect(legacy.phaseEndsAtFacilityTick! - legacy.phaseStartedAtFacilityTick!).toBe(75);
    const legacyEnd = legacy.phaseEndsAtFacilityTick;
    legacyState = advance(deserializeGameState(serializeGameState(legacyState)), 10);
    expect(legacyState.serviceOperations[0]).toMatchObject({
      phaseIndex: 0,
      status: "in_service",
      phaseEndsAtFacilityTick: legacyEnd,
    });
    expect(legacyState.serviceOperations[0]!.phaseFlowVersion).toBeUndefined();
  });

  it("rejects a marker-only periop phase flow on reload instead of interpreting mutable catalog phases", () => {
    const state = startEndoscopyVisitor(periopServiceState());
    const operation = state.serviceOperations[0]!;
    operation.status = "waiting_for_next_phase";
    operation.phaseIndex = 0;
    delete operation.frozenOperationPhases;
    const restored = deserializeGameState(serializeGameState(state));
    expect(restored.serviceOperations).toEqual([]);
  });

  it("releases endoscopy procedure capacity when the patient enters the separately reserved recovery phase", () => {
    let state = serviceState();
    state.facilityLevel = 2;
    state.rooms = state.rooms.filter((room) => room.id !== "room.test.ultrasound");
    state.doors = state.doors.filter((door) => !door.id.startsWith("door.test.ultrasound"));
    state.employees = [];
    state.rooms.push(
      { id: "room.test.endoscopy", roomDefinitionId: "room.endoscopy", x: 33, y: 23, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
      { id: "room.test.recovery", roomDefinitionId: "room.periop_recovery", x: 38, y: 23, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
      { id: "room.test.bridge", roomDefinitionId: "room.hallway", x: 37, y: 24, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
    );
    state.doors.push(
      { id: "door.test.endoscopy.west", roomId: "room.test.endoscopy", side: "west", offset: 1, exterior: false },
      { id: "door.test.endoscopy.east", roomId: "room.test.endoscopy", side: "east", offset: 1, exterior: false },
      { id: "door.test.recovery.west", roomId: "room.test.recovery", side: "west", offset: 1, exterior: false },
    );
    const employee = (id: string, role: string, roomId: string, location: { x: number; y: number }) => ({
      id, staffRoleDefinitionId: role, displayName: id, appearance: state.founder.appearance,
      hiredAtFacilityTick: 0, salaryPerExpenseInterval: 30, morale: 75, trainingLevel: 1 as const,
      homeRoomInstanceId: roomId, location, path: [location], pathIndex: 0, lastMovedAtFacilityTick: 0,
      lastPraisedAtFacilityTick: null, nextIdleActionAtFacilityTick: Number.MAX_SAFE_INTEGER,
      facilityTask: { kind: "perform_service" as const, targetId: "service-operation.endoscopy", startedAtFacilityTick: 0, workMinutesRemaining: Number.MAX_SAFE_INTEGER },
    });
    state.employees.push(
      employee("employee.endoscopy", "staff.endoscopy_nurse", "room.test.endoscopy", { x: 34, y: 24 }),
      employee("employee.recovery", "staff.periop_nurse", "room.test.recovery", { x: 39, y: 24 }),
    );
    const frontDesk = state.rooms.find(
      (room) => room.roomDefinitionId === "room.front_desk",
    )!;
    state.environment.founderLocation = {
      x: frontDesk.x + 2,
      y: frontDesk.y + 3,
    };
    state.environment.founderActivity = { kind: "perform_service", targetId: "service-operation.endoscopy", path: [{ x: 34, y: 24 }], pathIndex: 0, lastMovedAtFacilityTick: 0, workMinutesRemaining: Number.MAX_SAFE_INTEGER };
    state.serviceOperations.push({
      id: "service-operation.endoscopy", incomeLineId: "income.endoscopy", catalogVersion: 1,
      actorKind: "visitor", actorId: "visitor.endoscopy", displayName: "Endoscopy Visitor", appearance: state.founder.appearance,
      status: "in_service", createdAtFacilityTick: 0, waitDeadlineFacilityTick: 60, startedAtFacilityTick: 0,
      completedAtFacilityTick: null, cancelledAtFacilityTick: null, quoteFee: 400, phaseIndex: 0,
      phaseStartedAtFacilityTick: 0, phaseEndsAtFacilityTick: 1,
      reservedRoomInstanceIds: ["room.test.endoscopy", "room.test.recovery"],
      reservedEmployeeIds: ["employee.endoscopy", "employee.recovery"], providerReservation: { kind: "founder" },
      location: { x: 34, y: 24 }, path: [{ x: 34, y: 24 }], pathIndex: 0,
      lastMovedAtFacilityTick: 0, cancellationReason: null,
    });
    state = advance(state, 1);
    expect(state.serviceOperations[0]).toMatchObject({
      status: "walking_between_phases",
      phaseIndex: 1,
      reservedRoomInstanceIds: ["room.test.recovery"],
      reservedEmployeeIds: ["employee.recovery"],
      providerReservation: null,
    });
    expect(state.employees.find((candidate) => candidate.id === "employee.endoscopy")!.facilityTask).toBeNull();
    expect(state.employees.find((candidate) => candidate.id === "employee.recovery")!.facilityTask?.targetId).toBe("service-operation.endoscopy");
    expect(state.environment.founderActivity?.kind).toBe("return_to_front_desk");
    state = advance(deserializeGameState(serializeGameState(state)), 180);
    expect(state.serviceOperations[0]).toMatchObject({
      status: "completed",
      phaseIndex: 2,
      location: null,
    });
    expect(state.serviceIncomeReceipts).toEqual([
      expect.objectContaining({ incomeLineId: "income.endoscopy", grossAmount: 400 }),
    ]);
  });

  it("cancels invalidated work without payment and lets the visitor leave", () => {
    let state = advanceUntil(
      startUltrasound(serviceState()),
      (candidate) => candidate.serviceOperations[0]?.status === "walking_to_service" || candidate.serviceOperations[0]?.status === "in_service",
    );
    state.rooms = state.rooms.filter((room) => room.id !== "room.test.ultrasound");
    const cashBefore = state.cash;
    state = advance(state, 120);
    expect(state.serviceOperations[0]).toMatchObject({ status: "cancelled", location: null });
    expect(state.cash).toBe(cashBefore);
    expect(state.serviceIncomeReceipts).toEqual([]);
  });

  it("honors the appointments toggle without accumulating an offline backlog", () => {
    let state = serviceState();
    state.nextServiceAppointmentTicks["income.ultrasound"] = 1;
    state = advance(state, 5);
    expect(state.serviceOperations).toEqual([]);
    state = gameReducer(state, { type: "SET_SERVICE_APPOINTMENTS_ENABLED", operationId: "appointments.on", enabled: true });
    state = advance(state, 1);
    expect(state.serviceOperations).toEqual([]);
    expect(state.nextServiceAppointmentTicks["income.ultrasound"]).toBe(state.facilityTick + 120);
  });

  it("keeps a capacity-blocked appointment pending and admits it once paid departures release the slot", () => {
    let state = startUltrasound(serviceState("pending-capacity"));
    state = advanceUntil(
      state,
      (candidate) => candidate.serviceOperations[0]?.status === "walking_to_service" || candidate.serviceOperations[0]?.status === "in_service",
    );
    state = startUltrasound(state);
    expect(state.serviceOperations).toHaveLength(2);
    state.serviceAppointmentsEnabled = true;
    const pendingDue = state.facilityTick + 1;
    state.nextServiceAppointmentTicks = { "income.ultrasound": pendingDue };
    state.lastServiceAppointmentArrivalTick = null;
    state = advance(state, 1);
    expect(state.serviceOperations).toHaveLength(2);
    expect(state.nextServiceAppointmentTicks["income.ultrasound"]).toBe(pendingDue);

    for (const operation of state.serviceOperations) {
      operation.status = "leaving";
      operation.reservedRoomInstanceIds = [];
      operation.reservedEmployeeIds = [];
      operation.providerReservation = null;
    }
    for (const employee of state.employees) employee.facilityTask = null;
    state.environment.founderActivity = null;
    state = advance(state, 1);
    const admitted = state.serviceOperations.filter((operation) => operation.status === "arriving");
    expect(admitted).toHaveLength(1);
    expect(admitted[0]!.incomeLineId).toBe("income.ultrasound");
    expect(state.nextServiceAppointmentTicks["income.ultrasound"]).toBe(state.facilityTick + 120);
  });

  it("clears an ineligible due line and initializes a fresh cadence after capability returns", () => {
    const state = serviceState("missing-capability-reset");
    state.serviceAppointmentsEnabled = true;
    state.nextServiceAppointmentTicks = { "income.ultrasound": 1 };
    const room = state.rooms.find((candidate) => candidate.id === "room.test.ultrasound")!;
    const doors = state.doors.filter((door) => door.roomId === room.id);
    state.rooms = state.rooms.filter((candidate) => candidate.id !== room.id);
    state.doors = state.doors.filter((door) => door.roomId !== room.id);
    state.facilityTick = 1;
    advanceServiceOperations(state, PROTOTYPE_DOMAIN_CONTEXT);
    expect(state.nextServiceAppointmentTicks["income.ultrasound"]).toBeUndefined();
    expect(state.serviceOperations).toEqual([]);

    state.rooms.push(room);
    state.doors.push(...doors);
    state.facilityTick = 2;
    advanceServiceOperations(state, PROTOTYPE_DOMAIN_CONTEXT);
    expect(state.nextServiceAppointmentTicks["income.ultrasound"]).toBe(122);
    expect(state.serviceOperations).toEqual([]);
  });

  it("fairly serves harmonic ultrasound, CT, and collection appointment cadences without backlog bursts", () => {
    let state = serviceState();
    state.facilityLevel = 2;
    state.serviceAppointmentsEnabled = true;
    state.rooms.push(
      { id: "room.test.ct", roomDefinitionId: "room.ct", x: 28, y: 20, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
      { id: "room.test.phlebotomy", roomDefinitionId: "room.phlebotomy", x: 29, y: 17, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
      { id: "room.test.xray", roomDefinitionId: "room.xray", x: 29, y: 14, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
      ...([15, 16, 17, 18, 19, 20, 21, 22, 23] as const).map((y) => ({ id: `room.test.fair.hall.${y}`, roomDefinitionId: "room.hallway", x: 32, y, orientation: 0 as const, doorSide: null, upgradeLevel: 1 as const, cleanliness: 100 })),
    );
    state.doors.push(
      { id: "door.test.ct.east", roomId: "room.test.ct", side: "east", offset: 1, exterior: false },
      { id: "door.test.phlebotomy.east", roomId: "room.test.phlebotomy", side: "east", offset: 1, exterior: false },
      { id: "door.test.xray.east", roomId: "room.test.xray", side: "east", offset: 1, exterior: false },
    );
    state.employees.push({ ...state.employees[0]!, id: "employee.test.phlebotomist", staffRoleDefinitionId: "staff.phlebotomist", homeRoomInstanceId: "room.test.phlebotomy", location: { x: 31, y: 18 }, path: [{ x: 31, y: 18 }] });
    state.nextServiceAppointmentTicks = { "income.ultrasound": 1, "income.xray": 1, "income.ct": 1, "income.collection": 1 };
    const admitted: Array<{ tick: number; lineId: string }> = [];
    for (let tick = 1; tick <= 720; tick += 1) {
      state.facilityTick = tick;
      const dueBefore = Object.fromEntries(Object.entries(state.nextServiceAppointmentTicks).filter(([, due]) => due <= tick));
      const before = state.serviceOperations.length;
      advanceServiceOperations(state, PROTOTYPE_DOMAIN_CONTEXT);
      const created = state.serviceOperations.slice(before);
      admitted.push(...created.map((operation) => ({ tick, lineId: operation.incomeLineId })));
      for (const [lineId, due] of Object.entries(dueBefore)) {
        if (!created.some((operation) => operation.incomeLineId === lineId)) {
          expect(state.nextServiceAppointmentTicks[lineId]).toBe(due);
        }
      }
      if (created.length) {
        state.serviceOperations = [];
        for (const employee of state.employees) employee.facilityTask = null;
        state.environment.founderActivity = null;
      }
      if (tick === 45) state = deserializeGameState(serializeGameState(state));
    }
    expect(admitted.slice(0, 4)).toEqual([
      { tick: 1, lineId: "income.ultrasound" },
      { tick: 31, lineId: "income.xray" },
      { tick: 61, lineId: "income.ct" },
      { tick: 91, lineId: "income.collection" },
    ]);
    expect(new Set(admitted.map((entry) => entry.lineId))).toEqual(new Set(["income.ultrasound", "income.xray", "income.ct", "income.collection"]));
    expect(admitted.length).toBeGreaterThan(12);
    expect(state.lastServiceAppointmentTicks).toMatchObject({
      "income.ultrasound": expect.any(Number), "income.ct": expect.any(Number), "income.collection": expect.any(Number),
    });
  });

  it("rejects remote physical services and physical visitors for work-queue services", () => {
    let state = serviceState();
    state = gameReducer(state, { type: "START_SERVICE_OPERATION", operationId: "remote-ultrasound", incomeLineId: "income.ultrasound", actorKind: "remote" });
    expect(state.operationReceipts["remote-ultrasound"]?.status).toBe("rejected");
    expect(state.serviceOperations).toEqual([]);
    state = gameReducer(state, { type: "START_SERVICE_OPERATION", operationId: "visitor-image-read", incomeLineId: "income.image_read", actorKind: "visitor" });
    expect(state.operationReceipts["visitor-image-read"]?.status).toBe("rejected");
  });

  it("executes a future remote handler from supplied room and staff capabilities and anchors its receipt to the worker", () => {
    const context = JSON.parse(JSON.stringify(PROTOTYPE_DOMAIN_CONTEXT)) as DomainContext;
    const roomDefinitions = context.balanceRelease.facility.roomDefinitions as unknown as Array<(typeof context.balanceRelease.facility.roomDefinitions)[number]>;
    const staffDefinitions = context.balanceRelease.facility.staffRoleDefinitions as unknown as Array<(typeof context.balanceRelease.facility.staffRoleDefinitions)[number]>;
    const stageDefinitions = context.balanceRelease.facility.stageDefinitions as unknown as Array<(typeof context.balanceRelease.facility.stageDefinitions)[number]>;
    const roomSource = roomDefinitions.find((definition) => definition.id === "room.ultrasound")!;
    const staffSource = staffDefinitions.find((definition) => definition.id === "staff.imaging_technician")!;
    roomDefinitions.push({ ...roomSource, id: "room.reading", displayName: "Reading Room", capabilityIds: ["capability.radiology_reading"] });
    staffDefinitions.push({ ...staffSource, id: "staff.radiologist", displayName: "Radiologist", requiredAnyRoomDefinitionIds: ["room.reading"], capabilityIds: ["capability.staff.radiologist"] });
    stageDefinitions.push({ ...stageDefinitions.find((stage) => stage.level === 2)!, level: 4, displayName: "Future fixture", nextFacilityLevel: null } as (typeof stageDefinitions)[number]);

    const state = serviceState();
    (state as { facilityLevel: number }).facilityLevel = 4;
    state.rooms.find((room) => room.id === "room.test.ultrasound")!.roomDefinitionId = "room.reading";
    state.employees[0]!.staffRoleDefinitionId = "staff.radiologist";
    state.employees[0]!.displayName = "Reading Radiologist";
    let next = gameReducer(state, { type: "START_SERVICE_OPERATION", operationId: "future-read", incomeLineId: "income.image_read", actorKind: "remote" }, context);
    expect(next.operationReceipts["future-read"]?.status).toBe("applied");
    next = advance(next, 50, context);
    expect(next.serviceIncomeReceipts).toHaveLength(1);
    expect(next.serviceIncomeReceipts[0]).toMatchObject({
      actorKind: "remote",
      grossAmount: 40,
      displayAnchor: { actorKind: "employee", actorId: "employee.test.imaging" },
    });
    next.facilityLevel = 2;
    const reloaded = deserializeGameState(serializeGameState(next), context);
    expect(reloaded.serviceIncomeReceipts[0]?.displayAnchor).toEqual({ actorKind: "employee", actorId: "employee.test.imaging" });
  });

  it("executes a future physical MRI handler from supplied room and staff capabilities", () => {
    const context = JSON.parse(JSON.stringify(PROTOTYPE_DOMAIN_CONTEXT)) as DomainContext;
    const roomDefinitions = context.balanceRelease.facility.roomDefinitions as unknown as Array<(typeof context.balanceRelease.facility.roomDefinitions)[number]>;
    const stageDefinitions = context.balanceRelease.facility.stageDefinitions as unknown as Array<(typeof context.balanceRelease.facility.stageDefinitions)[number]>;
    const roomSource = roomDefinitions.find((definition) => definition.id === "room.ultrasound")!;
    roomDefinitions.push({ ...roomSource, id: "room.mri", displayName: "MRI Room", capabilityIds: ["capability.mri_machine"] });
    stageDefinitions.push({ ...stageDefinitions.find((stage) => stage.level === 2)!, level: 4, displayName: "Future fixture", nextFacilityLevel: null } as (typeof stageDefinitions)[number]);
    const state = serviceState();
    (state as { facilityLevel: number }).facilityLevel = 4;
    state.rooms.find((room) => room.id === "room.test.ultrasound")!.roomDefinitionId = "room.mri";
    let next = gameReducer(state, { type: "START_SERVICE_OPERATION", operationId: "future-mri", incomeLineId: "income.mri", actorKind: "visitor" }, context);
    expect(next.operationReceipts["future-mri"]?.status).toBe("applied");
    next = advance(next, 180, context);
    expect(next.serviceOperations[0]).toMatchObject({ status: "completed", location: null });
    expect(next.serviceIncomeReceipts[0]).toMatchObject({ actorKind: "visitor", incomeLineId: "income.mri", grossAmount: 240 });
  });
});
