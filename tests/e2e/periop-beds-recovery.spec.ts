import { expect, test, type Page } from "@playwright/test";
import {
  PROTOTYPE_DOMAIN_CONTEXT,
  RANDOM_STREAMS,
  createInitialGameState,
  deterministicInteger,
  deserializeGameState,
  findDeterministicFacilityPath,
  gameReducer,
  getPatientAmenityTrip,
  getReachablePatientBathroomRoomIds,
  getDoorCells,
  getFacilityAccessValidation,
  getRoomCareStations,
  getRoomDefinition,
  getRoomInstanceFootprint,
  getRoomNavigationAnchor,
  getViableDepartureRetailLineIds,
  serializeGameState,
  startEncounterTestOperation,
  type GameState,
  type GridPoint,
  type ServiceOperationState,
} from "@gamify-surgery/game-domain";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import CHARACTER_REGISTRY from "../../apps/player/src/art/characterStillRegistry.generated.json";
import {
  PROFILE_KEY,
  getActiveState,
  getProfile,
  startClinic,
  waitForDecisionChoices,
} from "./helpers";

const ORIGIN = process.env.GAMIFY_E2E_BASE_URL ?? "http://127.0.0.1:4197";
const PROOF_ROOT = process.env.GAMIFY_PERIOP_BEDS_PROOF_ROOT ??
  ".local-dev/gs025-periop-beds/final";
const PERIOP_ROOM_ID = "room.periop.capacity";
const ENDOSCOPY_ROOM_ID = "room.periop.endoscopy";
const WAITING_ROOM_ID = "room.periop.waiting";
const EXAM_ROOM_ID = "room.periop.exam";
const EXPECTED_BEDS = ["N3", "N4", "S3", "S4", "WC", "WD", "EC", "ED"] as const;
const EXPECTED_FACING = {
  N3: "south", N4: "south", S3: "north", S4: "north",
  WC: "east", WD: "east", EC: "west", ED: "west",
} as const;
const CAPACITY_IDS = Array.from({ length: 9 }, (_, index) => `periop-capacity-${index + 1}`);
const QUESTION_ID = "periop-bed-question";
const BATHROOM_ROOM_ID = "room.periop.bathroom";

type Room = GameState["rooms"][number];

function room(id: string, roomDefinitionId: string, x: number, y: number): Room {
  return {
    id, roomDefinitionId, x, y, orientation: 0, doorSide: null,
    upgradeLevel: 1, cleanliness: 100,
  };
}

function definition(candidate: Room) {
  const found = getRoomDefinition(candidate.roomDefinitionId);
  if (!found) throw new Error(`Missing room definition ${candidate.roomDefinitionId}.`);
  return found;
}

function anchor(candidate: Room, kind: "primary" | "staff" = "primary"): GridPoint {
  return getRoomNavigationAnchor(candidate, definition(candidate), kind);
}

function operation(state: GameState, id: string): ServiceOperationState {
  const found = state.serviceOperations.find((candidate) => candidate.id === id);
  if (!found) throw new Error(`Missing service operation ${id}.`);
  return found;
}

function advance(state: GameState, label: string): GameState {
  const next = gameReducer(
    { ...state, paused: false },
    { type: "ADVANCE_TICK", operationId: `periop-beds.${label}.${state.facilityTick}` },
  );
  if (next.facilityTick <= state.facilityTick) {
    throw new Error(`${label} failed to advance facility tick ${state.facilityTick}.`);
  }
  return next;
}

function advanceUntil(
  state: GameState,
  label: string,
  predicate: (candidate: GameState) => boolean,
  maximum = 480,
): GameState {
  let next = state;
  for (let index = 0; index <= maximum; index += 1) {
    if (predicate(next)) return { ...next, paused: true };
    if (index === maximum) break;
    next = advance(next, `${label}.${index}`);
  }
  const diagnostic = {
    label,
    facilityTick: next.facilityTick,
    operations: next.serviceOperations.map((candidate) => ({
      id: candidate.id,
      actorId: candidate.actorId,
      status: candidate.status,
      phaseIndex: candidate.phaseIndex,
      location: candidate.location,
      pathIndex: candidate.pathIndex,
      pathLength: candidate.path.length,
      bed: candidate.periopBedReservation,
      readyAt: candidate.nextPhaseReadyAtFacilityTick,
      rooms: candidate.reservedRoomInstanceIds,
      heldRooms: candidate.transitionHeldRoomInstanceIds,
      phaseStart: candidate.phaseStartedAtFacilityTick,
      phaseEnd: candidate.phaseEndsAtFacilityTick,
    })),
  };
  throw new Error(`${label} did not reach its expected state: ${JSON.stringify(diagnostic)}`);
}

function scheduleRealBathroomOpportunity(
  state: GameState,
  actorKind: "encounter" | "service_visitor",
  actorId: string,
): { state: GameState; dueTick: number; roll: number } {
  const next = deserializeGameState(serializeGameState(state));
  const dueTick = next.facilityTick + 1;
  const actorKey = `${actorKind}:${actorId}`;
  const chance = PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.environment.idleActionChancePercent;
  let roll = 100;
  for (let attempt = 0; attempt < 10_000; attempt += 1) {
    const seed = `periop-amenity-${actorKey}-${dueTick}-${attempt}`;
    roll = deterministicInteger(
      seed,
      RANDOM_STREAMS.environment,
      `patient-amenity:${actorKey}:roll:${dueTick}`,
      100,
    );
    if (roll < chance) {
      next.campaignSeed = seed;
      next.patientAmenityNextOpportunityTicks = {
        ...(next.patientAmenityNextOpportunityTicks ?? {}),
        [actorKey]: dueTick,
      };
      return { state: next, dueTick, roll };
    }
  }
  throw new Error(`No deterministic bathroom opportunity seed found for ${actorKey} at ${dueTick}.`);
}

function startActualEndoscopyVisitor(initial: GameState, label: string): {
  state: GameState;
  operationId: string;
} {
  const state = configureFacility(initial);
  const priorIds = new Set(state.serviceOperations.map((candidate) => candidate.id));
  const receiptId = `periop-beds.departure.${label}`;
  let next = gameReducer(state, {
    type: "START_SERVICE_OPERATION",
    operationId: receiptId,
    incomeLineId: "income.endoscopy",
    actorKind: "visitor",
  });
  expect(next.operationReceipts[receiptId]?.status).toBe("applied");
  const operationId = next.serviceOperations.find((candidate) => !priorIds.has(candidate.id))?.id;
  if (!operationId) throw new Error(`Actual Endoscopy visitor ${label} was not created.`);
  next.patientAmenityNextOpportunityTicks ??= {};
  next.patientAmenityNextOpportunityTicks[`service_visitor:${operationId}`] = Number.MAX_SAFE_INTEGER;
  next.retailNextOpportunityTicks[`service_visitor:${operationId}`] = Number.MAX_SAFE_INTEGER;
  next = advanceUntil(next, `${label}.discharging-from-bed`, (candidate) => {
    const current = operation(candidate, operationId);
    return current.status === "discharging" && current.periopBedReservation !== undefined;
  }, 360);
  return { state: next, operationId };
}

function selectDepartureSeed(
  state: GameState,
  operationId: string,
  desired: "bathroom" | "retail" | "none",
): string {
  const service = operation(state, operationId);
  const actorKind = service.actorKind === "encounter" ? "encounter" as const : "service_visitor" as const;
  const actorId = service.actorKind === "encounter" ? service.actorId : service.id;
  // Choice viability is evaluated only after physical bed clearance.  Build a
  // read-only probe of that pending itinerary shape to calculate the seed;
  // the returned seed is then exercised against the untouched reducer state.
  const choiceProbe = deserializeGameState(serializeGameState(state));
  const probeOperation = operation(choiceProbe, operationId);
  probeOperation.periopBedReservation = undefined;
  probeOperation.departureItinerary = {
    version: "service-departure-itinerary.v1",
    status: "pending",
    choiceKind: null,
    selectedAtFacilityTick: null,
    completedAtFacilityTick: null,
    linkedTripId: null,
    retailIncomeLineId: null,
  };
  const choices = [
    ...getReachablePatientBathroomRoomIds(choiceProbe, actorKind, actorId, PROTOTYPE_DOMAIN_CONTEXT, operationId)
      .map((id) => `bathroom:${id}`),
    ...getViableDepartureRetailLineIds(choiceProbe, actorKind, actorId, PROTOTYPE_DOMAIN_CONTEXT)
      .map((id) => `retail:${id}`),
  ].sort();
  if (desired !== "none" && !choices.some((choice) => choice.startsWith(`${desired}:`))) {
    throw new Error(`No viable ${desired} choice for ${operationId}: ${JSON.stringify(choices)}.`);
  }
  const chance = PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.environment.idleActionChancePercent;
  for (let attempt = 0; attempt < 10_000; attempt += 1) {
    const seed = `periop-departure-${desired}-${operationId}-${attempt}`;
    const roll = deterministicInteger(
      seed,
      RANDOM_STREAMS.environment,
      `service-departure:${operationId}:roll`,
      100,
    );
    if (desired === "none") {
      if (roll >= chance) return seed;
      continue;
    }
    if (roll >= chance) continue;
    const choice = choices[deterministicInteger(
      seed,
      RANDOM_STREAMS.environment,
      `service-departure:${operationId}:choice`,
      choices.length,
    )];
    if (choice?.startsWith(`${desired}:`)) return seed;
  }
  throw new Error(`No deterministic ${desired} departure seed found for ${operationId}.`);
}

function buildRetailDepartureEvidence(initial: GameState, label: string): {
  operationId: string;
  retailActive: GameState;
  retailComplete: GameState;
  sidewalk: GameState;
  completed: GameState;
  movementTrace: Array<{ tick: number; location: GridPoint | null; status: string; itineraryStatus: string | null }>;
} {
  const prepared = startActualEndoscopyVisitor(initial, label);
  const seed = selectDepartureSeed(prepared.state, prepared.operationId, "retail");
  let state = deserializeGameState(serializeGameState(prepared.state));
  state.campaignSeed = seed;
  const movementTrace: Array<{ tick: number; location: GridPoint | null; status: string; itineraryStatus: string | null }> = [];
  const advanceTrackedUntil = (
    current: GameState,
    stage: string,
    predicate: (candidate: GameState) => boolean,
    maximum: number,
  ): GameState => {
    let next = current;
    for (let index = 0; index <= maximum; index += 1) {
      const tracked = operation(next, prepared.operationId);
      expect(tracked.path.every((point, pathIndex, path) => pathIndex === 0 ||
        Math.abs(point.x - path[pathIndex - 1]!.x) + Math.abs(point.y - path[pathIndex - 1]!.y) === 1)).toBe(true);
      movementTrace.push({
        tick: next.facilityTick,
        location: tracked.location ? { ...tracked.location } : null,
        status: tracked.status,
        itineraryStatus: tracked.departureItinerary?.status ?? null,
      });
      const linkedRetail = next.retailOperations.find((candidate) =>
        candidate.departureServiceOperationId === prepared.operationId &&
        candidate.status !== "completed" && candidate.status !== "cancelled" && candidate.status !== "abandoned");
      if (linkedRetail?.location && tracked.location) expect(tracked.location).toEqual(linkedRetail.location);
      if (predicate(next)) return { ...next, paused: true };
      if (index === maximum) break;
      const prior = tracked.location ? { ...tracked.location } : null;
      next = advance(next, `${stage}.${index}`);
      const afterOperation = operation(next, prepared.operationId);
      expect(afterOperation.path.every((point, pathIndex, path) => pathIndex === 0 ||
        Math.abs(point.x - path[pathIndex - 1]!.x) + Math.abs(point.y - path[pathIndex - 1]!.y) === 1)).toBe(true);
      const after = afterOperation.location;
      if (prior && after) {
        const distance = Math.abs(after.x - prior.x) + Math.abs(after.y - prior.y);
        const speed = PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility.characterTravelTilesPerTick;
        if (distance > speed) {
          const linkedAfter = next.retailOperations.find((candidate) =>
            candidate.departureServiceOperationId === prepared.operationId);
          throw new Error(`Departure movement exceeded configured speed: ${JSON.stringify({
            stage,
            index,
            priorTick: next.facilityTick - 1,
            currentTick: next.facilityTick,
            prior,
            after,
            distance,
            speed,
            beforeStatus: tracked.status,
            beforePathIndex: tracked.pathIndex,
            beforeLastMovedAt: tracked.lastMovedAtFacilityTick,
            afterStatus: afterOperation.status,
            afterPathIndex: afterOperation.pathIndex,
            afterLastMovedAt: afterOperation.lastMovedAtFacilityTick,
            itinerary: afterOperation.departureItinerary,
            linkedRetail: linkedAfter ? {
              status: linkedAfter.status,
              location: linkedAfter.location,
              pathIndex: linkedAfter.pathIndex,
              lastMovedAtFacilityTick: linkedAfter.lastMovedAtFacilityTick,
            } : null,
          })}`);
        }
      }
    }
    throw new Error(`${stage} did not complete within ${maximum} tracked ticks.`);
  };
  state = advanceTrackedUntil(state, `${label}.retail-selected`, (candidate) =>
    operation(candidate, prepared.operationId).departureItinerary?.status === "retail", 90);
  const service = operation(state, prepared.operationId);
  expect(service.status).toBe("discharging");
  expect(service.periopBedReservation).toBeUndefined();
  expect(service.departureItinerary).toMatchObject({
    version: "service-departure-itinerary.v1",
    status: "retail",
    choiceKind: "retail",
  });
  const retailId = service.departureItinerary!.linkedTripId!;
  state = advanceTrackedUntil(state, `${label}.retail-mid-route`, (candidate) => {
    const retail = candidate.retailOperations.find((item) => item.id === retailId);
    return Boolean(retail && (retail.status !== "walking_to_outlet" || retail.pathIndex > 0));
  }, 10);
  const activeRetail = state.retailOperations.find((candidate) => candidate.id === retailId)!;
  expect(activeRetail).toMatchObject({
    actorKind: "service_visitor",
    actorId: prepared.operationId,
    departureServiceOperationId: prepared.operationId,
  });
  expect(activeRetail.status).toMatch(/walking_to_outlet|queued|purchasing/);
  if (activeRetail.status === "walking_to_outlet" && activeRetail.path.length > 2) {
    expect(activeRetail.pathIndex).toBeGreaterThan(0);
    expect(activeRetail.pathIndex).toBeLessThan(activeRetail.path.length - 1);
  }
  const retailActive = deserializeGameState(serializeGameState(state));
  expect(retailActive.retailOperations.find((candidate) => candidate.id === retailId)).toEqual(activeRetail);

  state = advanceTrackedUntil(retailActive, `${label}.retail-completed`, (candidate) =>
    candidate.retailOperations.find((item) => item.id === retailId)?.status === "completed" &&
      operation(candidate, prepared.operationId).departureItinerary?.status === "completed", 120);
  const retailComplete = deserializeGameState(serializeGameState(state));
  expect(retailComplete.serviceIncomeReceipts.filter((receipt) =>
    receipt.transactionKey === `income.retail.${retailId}.${activeRetail.incomeLineId}`)).toHaveLength(1);
  expect(retailComplete.serviceIncomeReceipts.filter((receipt) =>
    receipt.actorId === prepared.operationId && receipt.incomeLineId === "income.endoscopy")).toHaveLength(1);

  state = advanceTrackedUntil(state, `${label}.sidewalk`, (candidate) => {
    const current = operation(candidate, prepared.operationId);
    return current.status === "leaving" && current.location !== null &&
      current.pathIndex > 0 && current.pathIndex < current.path.length - 1 &&
      !candidate.rooms.some((roomCandidate) =>
        pointInsideRoom(candidate, current.location, roomCandidate.id));
  }, 90);
  const sidewalk = deserializeGameState(serializeGameState(state));
  expect(operation(sidewalk, prepared.operationId).path.every((point, index, path) => index === 0 ||
    Math.abs(point.x - path[index - 1]!.x) + Math.abs(point.y - path[index - 1]!.y) === 1)).toBe(true);
  state = advanceTrackedUntil(state, `${label}.full-exit`, (candidate) => {
    const current = operation(candidate, prepared.operationId);
    return current.status === "completed" && current.location === null;
  }, 120);
  const completed = deserializeGameState(serializeGameState(state));
  expect(completed.serviceIncomeReceipts.filter((receipt) =>
    receipt.transactionKey === `income.retail.${retailId}.${activeRetail.incomeLineId}`)).toHaveLength(1);
  return { operationId: prepared.operationId, retailActive, retailComplete, sidewalk, completed, movementTrace };
}

function buildResolvedBathroomDepartureEvidence(initial: GameState, label: string): {
  operationId: string;
  encounterId: string;
  bathroomActive: GameState;
  completed: GameState;
} {
  const resolved = buildCapacityState(initial, 1, 1);
  const operationId = resolved.operationIds[0]!;
  const controlledEncounterId = operation(resolved.state, operationId).actorId;
  const controlledEncounter = resolved.state.encounters[controlledEncounterId]!;
  // The capacity helper starts legitimate service work but intentionally leaves
  // its chart unopened.  For this departure-only proof, mirror the persisted
  // state of an answered terminal chart while keeping that real operation.
  controlledEncounter.lifecycle = "resolved";
  controlledEncounter.resolutionReason = "completed";
  controlledEncounter.resolvedAtFacilityTick = resolved.state.facilityTick;
  controlledEncounter.finalPatientSatisfaction = controlledEncounter.patientSatisfaction;
  controlledEncounter.pendingResult = null;
  controlledEncounter.steps.forEach((step) => { step.status = "completed"; });
  let state = advanceUntil(resolved.state, `${label}.discharging`, (candidate) => {
    const current = operation(candidate, operationId);
    return current.status === "discharging" && current.periopBedReservation !== undefined;
  }, 360);
  state.campaignSeed = selectDepartureSeed(state, operationId, "bathroom");
  state = advanceUntil(state, `${label}.bathroom-selected`, (candidate) =>
    operation(candidate, operationId).departureItinerary?.status === "bathroom", 90);
  const encounterId = operation(state, operationId).actorId;
  expect(state.encounters[encounterId]?.lifecycle).toBe("resolved");
  expect(operation(state, operationId).periopBedReservation).toBeUndefined();
  expect(getPatientAmenityTrip(state, "encounter", encounterId)).toMatchObject({
    purpose: "departure",
    linkedServiceOperationId: operationId,
  });
  state = advanceUntil(state, `${label}.bathroom-active`, (candidate) =>
    getPatientAmenityTrip(candidate, "encounter", encounterId)?.status === "using_amenity", 90);
  const bathroomActive = deserializeGameState(serializeGameState(state));
  expect(operation(bathroomActive, operationId).departureItinerary?.status).toBe("bathroom");
  state = advanceUntil(bathroomActive, `${label}.departure-handoff`, (candidate) => {
    const current = operation(candidate, operationId);
    const currentEncounter = candidate.encounters[encounterId];
    return current.status === "completed" && currentEncounter?.patientMovement !== null;
  }, 180);
  const departurePath = state.encounters[encounterId]!.patientMovement!.path;
  expect(departurePath.every((point, index, path) => index === 0 ||
    Math.abs(point.x - path[index - 1]!.x) + Math.abs(point.y - path[index - 1]!.y) === 1)).toBe(true);
  state = advanceUntil(state, `${label}.patient-full-exit`, (candidate) => {
    const currentEncounter = candidate.encounters[encounterId];
    return currentEncounter?.patientLocation === null && currentEncounter.patientMovement === null;
  }, 180);
  const completed = deserializeGameState(serializeGameState(state));
  expect(completed.serviceIncomeReceipts.filter((receipt) =>
    receipt.actorId === encounterId && receipt.incomeLineId === "income.endoscopy")).toHaveLength(1);
  return { operationId, encounterId, bathroomActive, completed };
}

function configureFacility(initial: GameState, periopDoorOffset = 1): GameState {
  const state = deserializeGameState(serializeGameState(initial));
  const front = state.rooms.find((candidate) => candidate.id === "room.instance.founder_desk");
  if (!front) throw new Error("Fresh campaign Front Desk is missing.");
  const exteriorDoors = state.doors.filter((candidate) => candidate.roomId === front.id && candidate.exterior);
  if (exteriorDoors.length === 0) throw new Error("Fresh campaign exterior entrance is missing.");

  const endoscopy = room(ENDOSCOPY_ROOM_ID, "room.endoscopy", 28, 2);
  const periop = room(PERIOP_ROOM_ID, "room.periop_recovery", 26, 8);
  const bathroom = room("room.periop.bathroom", "room.bathroom", 33, 8);
  const coffee = room("room.periop.coffee", "room.coffee_kiosk", 33, 11);
  const waiting = room(WAITING_ROOM_ID, "room.waiting", 33, 14);
  const exam = room(EXAM_ROOM_ID, "room.examination", 33, 18);
  periop.upgradeLevel = 5;

  state.facilityLevel = 2;
  state.cash = 100_000;
  state.cashCents = 10_000_000;
  state.paused = true;
  state.simulationSpeed = 4;
  state.serviceAppointmentsEnabled = false;
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  state.nextFinancialPostingTick = Number.MAX_SAFE_INTEGER;
  state.environment.nextLitterSpawnTick = Number.MAX_SAFE_INTEGER;
  state.environment.nextWaterCoolerDrainTick = Number.MAX_SAFE_INTEGER;
  state.environment.ambientPedestrians = [];
  state.environment.litterItems = [];
  state.encounters = {};
  state.serviceOperations = [];
  state.serviceOperationSequence = 0;
  state.serviceIncomeReceipts = [];
  state.operationReceipts = {};
  state.retailOperations = [];
  state.retailExternalActors = [];
  state.openChartEncounterId = null;
  state.attendedEncounterId = null;
  state.rooms = [
    { ...front }, endoscopy, periop, bathroom, coffee, waiting, exam,
    ...Array.from({ length: 29 }, (_, index) =>
      room(`room.periop.hall.${index}`, "room.hallway", 32, 3 + index)),
  ];
  state.doors = [
    ...exteriorDoors,
    { id: "door.periop.front", roomId: front.id, side: "west", offset: 0, exterior: false },
    { id: "door.periop.endoscopy", roomId: endoscopy.id, side: "east", offset: 1, exterior: false },
    { id: "door.periop.capacity", roomId: periop.id, side: "east", offset: periopDoorOffset, exterior: false },
    { id: "door.periop.bathroom", roomId: bathroom.id, side: "west", offset: 1, exterior: false },
    { id: "door.periop.coffee", roomId: coffee.id, side: "west", offset: 0, exterior: false },
    { id: "door.periop.waiting", roomId: waiting.id, side: "west", offset: 2, exterior: false },
    { id: "door.periop.exam", roomId: exam.id, side: "west", offset: 1, exterior: false },
  ];

  const addEmployee = (id: string, role: string, home: Room, location = anchor(home, "staff")) => ({
    id,
    staffRoleDefinitionId: role,
    displayName: id,
    appearance: state.founder.appearance,
    hiredAtFacilityTick: state.facilityTick,
    salaryPerExpenseInterval: 1,
    morale: 100,
    trainingLevel: 1 as const,
    homeRoomInstanceId: home.id,
    location: { ...location },
    path: [{ ...location }],
    pathIndex: 0,
    lastMovedAtFacilityTick: state.facilityTick,
    lastPraisedAtFacilityTick: null,
    nextIdleActionAtFacilityTick: Number.MAX_SAFE_INTEGER,
    facilityTask: null,
  });
  state.employees = [
    addEmployee("employee.periop.cover", "staff.periop_nurse", periop),
    addEmployee("employee.periop.endoscopy-nurse", "staff.endoscopy_nurse", endoscopy),
    addEmployee("employee.periop.endoscopist", "staff.endoscopist", endoscopy),
  ];
  state.environment.founderLocation = anchor(front, "staff");
  state.environment.founderActivity = null;
  return state;
}

function assertFacilityPreflight(state: GameState, expectedBedIds: readonly string[]): void {
  const occupied = new Map<string, string>();
  for (const candidate of state.rooms) {
    const footprint = getRoomInstanceFootprint(state, candidate.id);
    if (!footprint) throw new Error(`Missing footprint for ${candidate.id}.`);
    for (let y = candidate.y; y < candidate.y + footprint.height; y += 1) {
      for (let x = candidate.x; x < candidate.x + footprint.width; x += 1) {
        const key = `${x},${y}`;
        const prior = occupied.get(key);
        if (prior) throw new Error(`Fixture overlap at ${key}: ${prior} and ${candidate.id}.`);
        occupied.set(key, candidate.id);
      }
    }
  }
  const hallwayKeys = new Set(
    state.rooms.filter((candidate) => candidate.roomDefinitionId === "room.hallway")
      .map((candidate) => `${candidate.x},${candidate.y}`),
  );
  for (const door of state.doors.filter((candidate) => !candidate.exterior)) {
    const owner = state.rooms.find((candidate) => candidate.id === door.roomId);
    const cells = owner ? getDoorCells(door, owner, definition(owner)) : null;
    if (!cells) throw new Error(`Invalid door ${door.id}.`);
    if (!hallwayKeys.has(`${cells.outside.x},${cells.outside.y}`)) {
      throw new Error(`Door ${door.id} does not open to the fixture hallway: ${JSON.stringify(cells)}.`);
    }
  }
  const access = getFacilityAccessValidation(state);
  if (!access.valid || access.issues.length > 0 || access.unreachableRoomIds.length > 0) {
    throw new Error(`Invalid facility access: ${JSON.stringify(access)}`);
  }
  const periop = state.rooms.find((candidate) => candidate.id === PERIOP_ROOM_ID)!;
  const stations = getRoomCareStations(
    periop,
    definition(periop),
    state.doors,
    state.rooms,
    (id) => getRoomDefinition(id),
  );
  expect(stations.map((station) => station.id)).toEqual(expectedBedIds);
  for (const station of stations) {
    expect(station.facing).toBe(EXPECTED_FACING[station.id as keyof typeof EXPECTED_FACING]);
    const path = findDeterministicFacilityPath(
      anchor(state.rooms.find((candidate) => candidate.id === WAITING_ROOM_ID)!),
      station.patientAnchor,
      state.rooms,
      state.doors,
      (id) => getRoomDefinition(id),
    );
    if (path.length < 2) throw new Error(`Bed ${station.id} is unreachable.`);
    expect(path.every((point, index) => index === 0 ||
      Math.abs(point.x - path[index - 1]!.x) + Math.abs(point.y - path[index - 1]!.y) === 1)).toBe(true);
  }
}

function admitControlledEncounter(state: GameState, encounterId: string, ordinal: number): GameState {
  const operationId = `periop-beds.admit.${encounterId}`;
  const next = gameReducer(state, {
    type: "ADMIT_PATIENT",
    operationId,
    encounterId,
    caseId: "case.colorectal.routine-screen",
    patientDisplayName: `Periop Capacity ${ordinal}`,
    arrivalClass: "routine",
  });
  const receipt = next.operationReceipts[operationId];
  if (receipt?.status !== "applied") {
    throw new Error(`Admission ${encounterId} rejected: ${JSON.stringify(receipt)}`);
  }
  const encounter = next.encounters[encounterId]!;
  encounter.checkInStatus = "checked_in";
  encounter.checkInWaitingSinceTick = null;
  encounter.lifecycle = "waiting_unopened";
  encounter.patientMovement = null;
  encounter.patientLocation = { x: 32, y: 15 + ordinal };
  encounter.assignedRoomInstanceId = WAITING_ROOM_ID;
  encounter.queuedCareRoomInstanceId = null;
  encounter.waitingDestination = null;
  encounter.nextIdleActionAtFacilityTick = Number.MAX_SAFE_INTEGER;
  // Existing capacity/timing controls are not amenity scenarios.  Their
  // patients opt into a due opportunity only in the dedicated M2 test.
  next.patientAmenityNextOpportunityTicks ??= {};
  next.patientAmenityNextOpportunityTicks[`encounter:${encounter.id}`] = Number.MAX_SAFE_INTEGER;
  const started = startEncounterTestOperation(
    next,
    encounter,
    "income.endoscopy",
    PROTOTYPE_DOMAIN_CONTEXT,
    {
      version: "test-choice-order.v1",
      purpose: "terminal",
      caseId: "case.colorectal.routine-screen",
      nodeId: "node.colorectal.routine-screen.1",
      questionVariantId: "question.colorectal.routine-screen.1",
      choiceId: "colonoscopy_1",
      choiceLabel: "Diagnostic colonoscopy",
      serviceId: "service.colonoscopy",
      routeId: "route.colonoscopy.in_house",
      routeDisplayName: "Onsite colonoscopy with external pathology",
      externalRemainder: null,
    },
  );
  if (!started) throw new Error(`Controlled service operation ${encounterId} did not start.`);
  return next;
}

function buildCapacityState(initial: GameState, count = 9, periopDoorOffset = 1): {
  state: GameState;
  operationIds: string[];
} {
  let state = configureFacility(initial, periopDoorOffset);
  assertFacilityPreflight(state, periopDoorOffset === 2
    ? EXPECTED_BEDS.filter((id) => id !== "EC")
    : EXPECTED_BEDS);
  const operationIds: string[] = [];
  for (const [index, encounterId] of CAPACITY_IDS.slice(0, count).entries()) {
    const prior = new Set(state.serviceOperations.map((candidate) => candidate.id));
    state = admitControlledEncounter(state, encounterId, index + 1);
    const created = state.serviceOperations.find((candidate) => !prior.has(candidate.id));
    if (!created) throw new Error(`No operation created for ${encounterId}.`);
    operationIds.push(created.id);
  }
  const expectedCapacity = periopDoorOffset === 2 ? 7 : 8;
  state = advanceUntil(state, "capacity-arrival", (candidate) => {
    const operations = operationIds.map((id) => operation(candidate, id));
    return operations.filter((candidateOperation) =>
      candidateOperation.periopBedReservation &&
      candidateOperation.status === "in_service" &&
      candidateOperation.phaseIndex === 0 &&
      candidateOperation.pathIndex >= candidateOperation.path.length - 1,
    ).length === Math.min(count, expectedCapacity);
  }, 180);
  return { state, operationIds };
}

function assertCapacityState(
  state: GameState,
  operationIds: string[],
  expectedBedIds: readonly string[],
): void {
  const operations = operationIds.map((id) => operation(state, id));
  const bedded = operations.filter((candidate) => candidate.periopBedReservation);
  const waiting = operations.filter((candidate) => !candidate.periopBedReservation);
  expect(bedded).toHaveLength(expectedBedIds.length);
  expect(new Set(bedded.map((candidate) => candidate.periopBedReservation!.bedId))).toEqual(new Set(expectedBedIds));
  expect(new Set(bedded.map((candidate) => `${candidate.periopBedReservation!.endpoint.x},${candidate.periopBedReservation!.endpoint.y}`)).size).toBe(expectedBedIds.length);
  expect(waiting).toHaveLength(operationIds.length - expectedBedIds.length);
  for (const candidate of bedded) {
    expect(candidate).toMatchObject({
      periopBedFlowVersion: 1,
      periopBedReservation: { version: "periop-bed-reservation.v1", roomInstanceId: PERIOP_ROOM_ID },
      status: "in_service",
      phaseIndex: 0,
    });
    expect(candidate.location).toEqual(candidate.periopBedReservation!.endpoint);
  }
  for (const candidate of waiting) {
    expect(candidate.status).toBe("waiting_for_resources");
    const encounter = state.encounters[candidate.actorId]!;
    expect(encounter.patientLocation).not.toBeNull();
    expect(encounter.patientMovement?.destinationRoomInstanceId ?? encounter.waitingDestination?.roomInstanceId).toBe(WAITING_ROOM_ID);
  }
  const cover = state.employees.find((candidate) => candidate.id === "employee.periop.cover")!;
  expect(cover.facilityTask).toEqual(expect.objectContaining({ kind: "cover_periop", targetId: PERIOP_ROOM_ID }));
}

function writeState(name: string, state: GameState): void {
  mkdirSync(join(PROOF_ROOT, "states"), { recursive: true });
  writeFileSync(join(PROOF_ROOT, "states", `${name}.json`), `${JSON.stringify(state, null, 2)}\n`);
}

test("@domain-preflight validates the real eight-bed topology, hidden-door capacity, and persisted reservations", async () => {
  const initial = createInitialGameState(undefined, {
    campaignId: "campaign.periop-beds-preflight",
    campaignSeed: "periop-beds-preflight",
    createdAtRealMs: 0,
  });
  const full = buildCapacityState(initial, 9, 1);
  assertCapacityState(full.state, full.operationIds, EXPECTED_BEDS);
  const restored = deserializeGameState(serializeGameState(full.state));
  assertCapacityState(restored, full.operationIds, EXPECTED_BEDS);
  expect(full.operationIds.map((id) => operation(restored, id).periopBedReservation))
    .toEqual(full.operationIds.map((id) => operation(full.state, id).periopBedReservation));
  writeState("preflight-eight-bed", restored);

  const hidden = buildCapacityState(initial, 8, 2);
  const visibleBeds = EXPECTED_BEDS.filter((id) => id !== "EC");
  assertCapacityState(hidden.state, hidden.operationIds, visibleBeds);
  expect(hidden.state.serviceOperations.some((candidate) => candidate.periopBedReservation?.bedId === "EC")).toBe(false);
  writeState("preflight-door-hidden", hidden.state);
});

test("@amenity-preflight gives a controlled preparing patient a real exclusive bathroom round trip and preserves the bed clock", async () => {
  const initial = createInitialGameState(undefined, {
    campaignId: "campaign.periop-bathroom-preflight",
    campaignSeed: "periop-bathroom-preflight",
    createdAtRealMs: 0,
  });
  const fixture = buildCapacityState(initial, 1, 1);
  const operationId = fixture.operationIds[0]!;
  const preparing = operation(fixture.state, operationId);
  expect(preparing).toMatchObject({
    actorKind: "encounter",
    status: "in_service",
    phaseIndex: 0,
    periopBedFlowVersion: 1,
  });
  const encounterId = preparing.actorId;
  const preparingEncounter = fixture.state.encounters[encounterId]!;
  expect(preparingEncounter).toMatchObject({
    checkInStatus: "checked_in",
    lifecycle: "waiting_unopened",
    patientMovement: null,
  });
  expect(preparingEncounter.patientLocation).not.toBeNull();
  expect(fixture.state.openChartEncounterId).not.toBe(encounterId);
  const bed = preparing.periopBedReservation!;
  const originalPhaseEnd = preparing.phaseEndsAtFacilityTick!;
  const bathroom = fixture.state.rooms.find((candidate) => candidate.id === BATHROOM_ROOM_ID)!;
  const bathroomTarget = anchor(bathroom);

  // This is a controlled capacity check: the Founder already owns the only
  // Bathroom.  The patient still reaches a normal due opportunity and must
  // remain on the authored Peri-op bed without creating a trip.
  const founderBlocked = scheduleRealBathroomOpportunity(fixture.state, "encounter", encounterId);
  founderBlocked.state.environment.founderActivity = {
    kind: "visit_bathroom",
    targetId: `${BATHROOM_ROOM_ID}.${bathroomTarget.x}.${bathroomTarget.y}`,
    path: [{ ...bathroomTarget }],
    pathIndex: 0,
    lastMovedAtFacilityTick: founderBlocked.state.facilityTick,
    workMinutesRemaining: 1,
  };
  founderBlocked.state.environment.founderLocation = { ...bathroomTarget };
  const excluded = advance(founderBlocked.state, "bathroom-founder-exclusive");
  expect(excluded.facilityTick).toBe(founderBlocked.dueTick);
  expect(getPatientAmenityTrip(excluded, "encounter", encounterId)).toBeNull();
  expect(operation(excluded, operationId).periopBedReservation).toEqual(bed);

  const scheduled = scheduleRealBathroomOpportunity(fixture.state, "encounter", encounterId);
  expect(scheduled.roll).toBeLessThan(PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.environment.idleActionChancePercent);
  let state = advance(scheduled.state, "bathroom-opportunity");
  expect(state.facilityTick).toBe(scheduled.dueTick);
  let trip = getPatientAmenityTrip(state, "encounter", encounterId);
  expect(trip).toMatchObject({
    version: "patient-amenity-trip.v1",
    actorKind: "encounter",
    actorId: encounterId,
    amenityKind: "bathroom",
    bathroomRoomInstanceId: BATHROOM_ROOM_ID,
    status: "walking_to_amenity",
    returnTarget: bed.endpoint,
    pathIndex: 0,
  });
  expect(trip!.path.length).toBeGreaterThan(1);
  expect(trip!.path.at(-1)).toEqual(bathroomTarget);
  expect(trip!.path.every((point, index) => index === 0 ||
    Math.abs(point.x - trip!.path[index - 1]!.x) + Math.abs(point.y - trip!.path[index - 1]!.y) === 1)).toBe(true);
  expect(operation(state, operationId).periopBedReservation).toEqual(bed);
  expect(operation(state, operationId).phaseEndsAtFacilityTick).toBe(originalPhaseEnd + 1);

  const restored = deserializeGameState(serializeGameState(state));
  expect(getPatientAmenityTrip(restored, "encounter", encounterId)).toEqual(trip);
  const priorEnd = operation(restored, operationId).phaseEndsAtFacilityTick!;
  state = advance(restored, "bathroom-clock-pauses");
  expect(operation(state, operationId).phaseEndsAtFacilityTick).toBe(priorEnd + 1);
  state = advanceUntil(state, "bathroom-arrival", (candidate) =>
    getPatientAmenityTrip(candidate, "encounter", encounterId)?.status === "using_amenity", 90);
  trip = getPatientAmenityTrip(state, "encounter", encounterId);
  expect(trip?.dwellEndsAtFacilityTick).toBeGreaterThan(state.facilityTick);
  expect(operation(state, operationId).periopBedReservation).toEqual(bed);

  state = advanceUntil(state, "bathroom-return", (candidate) =>
    getPatientAmenityTrip(candidate, "encounter", encounterId) === null, 120);
  const returned = operation(state, operationId);
  expect(returned.location).toEqual(bed.endpoint);
  expect(returned.periopBedReservation).toEqual(bed);
  expect(returned.phaseEndsAtFacilityTick).toBeGreaterThan(originalPhaseEnd);
  writeState("amenity-prep-return", state);
});

test("@amenity-preflight keeps a queued ninth patient outside Peri-op through a real bathroom round trip", async () => {
  const initial = createInitialGameState(undefined, {
    campaignId: "campaign.periop-bathroom-queue",
    campaignSeed: "periop-bathroom-queue",
    createdAtRealMs: 0,
  });
  const fixture = buildCapacityState(initial, 9, 1);
  const queuedId = fixture.operationIds.find((id) => !operation(fixture.state, id).periopBedReservation);
  if (!queuedId) throw new Error("Expected a ninth operation waiting outside Peri-op.");
  const queued = operation(fixture.state, queuedId);
  expect(queued.status).toBe("waiting_for_resources");
  const encounter = fixture.state.encounters[queued.actorId]!;
  expect(encounter.waitingDestination?.roomInstanceId).toBe(WAITING_ROOM_ID);
  expect(encounter.patientLocation).toEqual(encounter.waitingDestination?.location);
  const returnTarget = { ...encounter.patientLocation! };

  const scheduled = scheduleRealBathroomOpportunity(fixture.state, "encounter", queued.actorId);
  let state = advance(scheduled.state, "queue-bathroom-opportunity");
  expect(getPatientAmenityTrip(state, "encounter", queued.actorId)).toMatchObject({
    status: "walking_to_amenity",
    returnTarget,
  });
  expect(operation(state, queuedId).status).toBe("waiting_for_resources");
  expect(operation(state, queuedId).periopBedReservation).toBeUndefined();
  state = advanceUntil(state, "queue-bathroom-use", (candidate) =>
    getPatientAmenityTrip(candidate, "encounter", queued.actorId)?.status === "using_amenity", 90);
  expect(operation(state, queuedId).periopBedReservation).toBeUndefined();
  state = advanceUntil(state, "queue-bathroom-return", (candidate) =>
    getPatientAmenityTrip(candidate, "encounter", queued.actorId) === null, 120);
  expect(operation(state, queuedId).status).toBe("waiting_for_resources");
  expect(operation(state, queuedId).periopBedReservation).toBeUndefined();
  expect(state.encounters[queued.actorId]?.patientLocation).toEqual(returnTarget);
  expect(state.encounters[queued.actorId]?.waitingDestination?.location).toEqual(returnTarget);
  writeState("amenity-queue-return", state);
});

test("@amenity-preflight prevents a ready patient from claiming Endoscopy while away, then preserves its claim", async () => {
  const initial = createInitialGameState(undefined, {
    campaignId: "campaign.periop-bathroom-ready",
    campaignSeed: "periop-bathroom-ready",
    createdAtRealMs: 0,
  });
  const fixture = buildCapacityState(initial, 2, 1);
  let state = advanceUntil(fixture.state, "bathroom-ready-near-release", (candidate) => {
    const operations = fixture.operationIds.map((id) => operation(candidate, id));
    const activeProcedure = operations.find((item) => item.phaseIndex === 1 && item.status === "in_service");
    const ready = operations.find((item) => item.phaseIndex === 0 && item.status === "waiting_for_next_phase");
    return Boolean(activeProcedure?.phaseEndsAtFacilityTick != null &&
      activeProcedure!.phaseEndsAtFacilityTick! - candidate.facilityTick <= 4 && ready);
  }, 120);
  const activeId = fixture.operationIds.find((id) => {
    const candidate = operation(state, id);
    return candidate.phaseIndex === 1 && candidate.status === "in_service";
  })!;
  const readyId = fixture.operationIds.find((id) => {
    const candidate = operation(state, id);
    return candidate.phaseIndex === 0 && candidate.status === "waiting_for_next_phase";
  })!;
  const ready = operation(state, readyId);
  expect(ready.reservedRoomInstanceIds).not.toContain(ENDOSCOPY_ROOM_ID);
  const scheduled = scheduleRealBathroomOpportunity(state, "encounter", ready.actorId);
  state = advance(scheduled.state, "ready-bathroom-opportunity");
  expect(getPatientAmenityTrip(state, "encounter", ready.actorId)).not.toBeNull();

  state = advanceUntil(state, "ready-suite-cleared-while-away", (candidate) =>
    !pointInsideRoom(candidate, operation(candidate, activeId).location, ENDOSCOPY_ROOM_ID) &&
      getPatientAmenityTrip(candidate, "encounter", ready.actorId) !== null, 30);
  expect(operation(state, readyId)).toMatchObject({
    phaseIndex: 0,
    status: "waiting_for_next_phase",
  });
  expect(operation(state, readyId).reservedRoomInstanceIds).not.toContain(ENDOSCOPY_ROOM_ID);
  state = advanceUntil(state, "ready-bathroom-return-and-claim", (candidate) =>
    getPatientAmenityTrip(candidate, "encounter", ready.actorId) === null &&
      operation(candidate, readyId).reservedRoomInstanceIds.includes(ENDOSCOPY_ROOM_ID), 120);
  expect(operation(state, readyId).phaseIndex).toBe(1);
  expect(operation(state, readyId).periopBedReservation).toEqual(ready.periopBedReservation);
  writeState("amenity-ready-claim", state);
});

test("@amenity-preflight routes an actual Endoscopy service visitor to the exclusive Bathroom and exact held bed", async () => {
  const initial = configureFacility(createInitialGameState(undefined, {
    campaignId: "campaign.periop-bathroom-visitor",
    campaignSeed: "periop-bathroom-visitor",
    createdAtRealMs: 0,
  }));
  const priorIds = new Set(initial.serviceOperations.map((candidate) => candidate.id));
  const startId = "periop-beds.start-bathroom-visitor";
  let state = gameReducer(initial, {
    type: "START_SERVICE_OPERATION",
    operationId: startId,
    incomeLineId: "income.endoscopy",
    actorKind: "visitor",
  });
  expect(state.operationReceipts[startId]?.status).toBe("applied");
  const visitorId = state.serviceOperations.find((candidate) => !priorIds.has(candidate.id))?.id;
  if (!visitorId) throw new Error("Actual Endoscopy service visitor was not created.");
  state = advanceUntil(state, "visitor-prep-start", (candidate) => {
    const current = operation(candidate, visitorId);
    return current.actorKind === "visitor" && current.periopBedFlowVersion === 1 &&
      current.phaseIndex === 0 && current.status === "in_service" &&
      current.periopBedReservation !== undefined;
  }, 180);
  const visitor = operation(state, visitorId);
  const bed = visitor.periopBedReservation!;
  state.patientAmenityNextOpportunityTicks ??= {};
  state.patientAmenityNextOpportunityTicks[`service_visitor:${visitorId}`] = Number.MAX_SAFE_INTEGER;
  const scheduled = scheduleRealBathroomOpportunity(state, "service_visitor", visitorId);
  state = advance(scheduled.state, "visitor-bathroom-opportunity");
  expect(getPatientAmenityTrip(state, "service_visitor", visitorId)).toMatchObject({
    actorKind: "service_visitor",
    actorId: visitorId,
    bathroomRoomInstanceId: BATHROOM_ROOM_ID,
    status: "walking_to_amenity",
    returnTarget: bed.endpoint,
  });
  expect(operation(state, visitorId).periopBedReservation).toEqual(bed);
  const restored = deserializeGameState(serializeGameState(state));
  expect(getPatientAmenityTrip(restored, "service_visitor", visitorId)).toEqual(
    getPatientAmenityTrip(state, "service_visitor", visitorId),
  );
  state = advanceUntil(restored, "visitor-bathroom-return", (candidate) =>
    getPatientAmenityTrip(candidate, "service_visitor", visitorId) === null, 120);
  expect(operation(state, visitorId).location).toEqual(bed.endpoint);
  expect(operation(state, visitorId).periopBedReservation).toEqual(bed);
  writeState("amenity-service-visitor-return", state);
});

test("@departure-preflight gives terminal Peri-op services at most one optional stop before a full exit", async () => {
  const retailEvidence = buildRetailDepartureEvidence(createInitialGameState(undefined, {
    campaignId: "campaign.periop-departure-retail",
    campaignSeed: "periop-departure-retail",
    createdAtRealMs: 0,
  }), "departure-retail");
  writeState("departure-retail-active", retailEvidence.retailActive);
  writeState("departure-retail-complete", retailEvidence.retailComplete);
  writeState("departure-retail-sidewalk", retailEvidence.sidewalk);
  writeState("departure-retail-exited", retailEvidence.completed);
  writeFileSync(join(PROOF_ROOT, "departure-retail-movement-trace.json"),
    `${JSON.stringify(retailEvidence.movementTrace, null, 2)}\n`);

  const skipped = startActualEndoscopyVisitor(createInitialGameState(undefined, {
    campaignId: "campaign.periop-departure-none",
    campaignSeed: "periop-departure-none",
    createdAtRealMs: 0,
  }), "departure-none");
  let skippedState = deserializeGameState(serializeGameState(skipped.state));
  skippedState.campaignSeed = selectDepartureSeed(skippedState, skipped.operationId, "none");
  skippedState = advanceUntil(skippedState, "departure-none.full-exit", (candidate) => {
    const current = operation(candidate, skipped.operationId);
    return current.status === "completed" && current.location === null;
  }, 180);
  expect(operation(skippedState, skipped.operationId).departureItinerary).toMatchObject({
    status: "skipped",
    choiceKind: "none",
  });
  expect(skippedState.retailOperations.some((candidate) =>
    candidate.departureServiceOperationId === skipped.operationId)).toBe(false);
  expect(skippedState.patientAmenityTrips?.some((candidate) =>
    candidate.linkedServiceOperationId === skipped.operationId)).toBe(false);
  expect(skippedState.serviceIncomeReceipts.filter((receipt) =>
    receipt.actorId === skipped.operationId && receipt.incomeLineId === "income.endoscopy")).toHaveLength(1);
  writeState("departure-none-exited", skippedState);

  const resolved = buildResolvedBathroomDepartureEvidence(createInitialGameState(undefined, {
    campaignId: "campaign.periop-departure-resolved",
    campaignSeed: "periop-departure-resolved",
    createdAtRealMs: 0,
  }), "departure-resolved");
  const restoredResolved = deserializeGameState(serializeGameState(resolved.bathroomActive));
  expect(operation(restoredResolved, resolved.operationId).departureItinerary).toEqual(
    operation(resolved.bathroomActive, resolved.operationId).departureItinerary,
  );
  writeState("departure-resolved-bathroom", restoredResolved);
  writeState("departure-resolved-exited", resolved.completed);
});

async function installState(page: Page, state: GameState, campaignName: string, marker: string): Promise<void> {
  const profile = await getProfile(page);
  const active = profile.campaigns.find((candidate) => candidate.campaignId === profile.activeCampaignId);
  if (!active) throw new Error("Private proof campaign is missing.");
  active.name = campaignName;
  active.serializedState = serializeGameState({ ...state, paused: true });
  profile.tutorialsEnabled = false;
  await page.addInitScript(
    ({ key, value, sessionMarker }) => {
      if (sessionStorage.getItem(sessionMarker)) return;
      sessionStorage.setItem(sessionMarker, "installed");
      localStorage.setItem(key, JSON.stringify(value));
    },
    { key: PROFILE_KEY, value: profile, sessionMarker: marker },
  );
  await page.goto("/?prototype-tools=0&facility-gait-proof=1");
  expect(await page.evaluate(() => location.origin)).toBe(ORIGIN);
  const resume = page.getByRole("button", { name: `Resume ${campaignName}` });
  if (await resume.isVisible()) await resume.click();
  await expect(page.getByTestId("facility-canvas")).toBeVisible();
  await page.addStyleTag({
    content: ".tutorial-overlay,.tutorial-card,.prototype-toolbar,.game-announcement,.facility-pause-indicator{display:none!important}",
  });
}

async function centerRoom(page: Page, roomId: string, zoom: 1 | 1.6): Promise<void> {
  await page.evaluate(({ id, requestedZoom }) => {
    const host = document.querySelector("[data-testid='facility-canvas']") as any;
    const scene = host?.__facilityGame?.scene?.getScene("facility-scene");
    const target = scene?.bridge?.viewModel?.rooms?.find((candidate: any) => candidate.instanceId === id);
    if (!scene || !target) throw new Error(`Missing live room ${id}.`);
    scene.applyCamera({ ...scene.cameraView, zoom: requestedZoom, panX: 0, panY: 0 });
    scene.refreshLayout(true);
    const x = scene.layout.originX + (target.tileX + target.width / 2) * scene.layout.tileSize;
    const y = scene.layout.originY + (target.tileY + target.height / 2) * scene.layout.tileSize;
    scene.applyCamera({
      ...scene.cameraView,
      zoom: requestedZoom,
      panX: scene.scale.width / 2 - x,
      panY: scene.scale.height / 2 - y,
    });
    scene.refreshLayout(true);
    scene.drawCharacters();
  }, { id: roomId, requestedZoom: zoom });
}

async function centerPoint(page: Page, point: GridPoint, zoom: 1 | 1.6): Promise<void> {
  await page.evaluate(({ target, requestedZoom }) => {
    const host = document.querySelector("[data-testid='facility-canvas']") as any;
    const scene = host?.__facilityGame?.scene?.getScene("facility-scene");
    if (!scene) throw new Error("Missing live Facility Scene.");
    scene.applyCamera({ ...scene.cameraView, zoom: requestedZoom, panX: 0, panY: 0 });
    scene.refreshLayout(true);
    const x = scene.layout.originX + (target.x + 0.5) * scene.layout.tileSize;
    const y = scene.layout.originY + (target.y + 0.5) * scene.layout.tileSize;
    scene.applyCamera({
      ...scene.cameraView,
      zoom: requestedZoom,
      panX: scene.scale.width / 2 - x,
      panY: scene.scale.height / 2 - y,
    });
    scene.refreshLayout(true);
    scene.drawCharacters();
  }, { target: point, requestedZoom: zoom });
}

type RenderedPatient = {
  key: string;
  supportRole?: string;
  supportId?: string;
  supportRoomId?: string;
  pose?: string;
  direction?: string;
  flipX?: boolean;
  visible: boolean;
  depth: number;
  x: number;
  y: number;
  textureKey?: string;
  atlasId?: string;
  stillId?: string;
};

async function renderedPatients(page: Page, actorIds: string[]): Promise<Record<string, RenderedPatient>> {
  const keys = actorIds.map((id) => `character:patient:${id}`);
  await page.waitForFunction((expected) => {
    const host = document.querySelector("[data-testid='facility-canvas']") as any;
    const scene = host?.__facilityGame?.scene?.getScene("facility-scene");
    return Boolean(scene && expected.every((key: string) => {
      const container = scene.characterBitmapContainers?.get(key);
      const actor = container?.getByName("actor");
      return container?.visible && actor?.visible && actor.texture?.key !== "__DEFAULT" &&
        actor.displayWidth > 4 && actor.displayHeight > 8;
    }));
  }, keys, { timeout: 20_000 });
  return page.evaluate((expected) => {
    const host = document.querySelector("[data-testid='facility-canvas']") as any;
    const scene = host.__facilityGame.scene.getScene("facility-scene");
    return Object.fromEntries(expected.map((key: string) => {
      const container = scene.characterBitmapContainers.get(key);
      const actor = container.getByName("actor");
      return [key, {
        key,
        supportRole: container.getData("actor-support-role") ?? undefined,
        supportId: container.getData("actor-support-id") ?? undefined,
        supportRoomId: container.getData("actor-support-room-instance-id") ?? undefined,
        pose: actor.getData("gait-pose") ?? undefined,
        direction: actor.getData("gait-direction") ?? undefined,
        flipX: actor.getData("gait-flip-x") ?? undefined,
        visible: Boolean(container.visible && actor.visible),
        depth: container.depth,
        x: container.x,
        y: container.y,
        textureKey: actor.texture?.key,
        atlasId: actor.getData("gait-atlas-id") ?? undefined,
        stillId: actor.getData("gait-still-id") ?? undefined,
      }];
    }));
  }, keys);
}

async function waitForRenderedActor(page: Page, key: string): Promise<void> {
  await page.waitForFunction((actorKey) => {
    const host = document.querySelector("[data-testid='facility-canvas']") as any;
    const scene = host?.__facilityGame?.scene?.getScene("facility-scene");
    const container = scene?.characterBitmapContainers?.get(actorKey);
    const actor = container?.getByName("actor");
    return Boolean(container?.visible && actor?.visible && actor.texture?.key !== "__DEFAULT" &&
      actor.displayWidth > 4 && actor.displayHeight > 8);
  }, key, { timeout: 20_000 });
}

function renderedCardinal(actor: RenderedPatient): "north" | "east" | "south" | "west" | undefined {
  const entry = CHARACTER_REGISTRY.characters.find((candidate) => candidate.id === actor.stillId);
  const hash = actor.atlasId?.split(":").at(-1);
  return entry && hash
    ? (Object.entries(entry.poses.sit).find(([, asset]) => asset.sha256.startsWith(hash))?.[0] as
        "north" | "east" | "south" | "west" | undefined)
    : undefined;
}

async function bedFixtureLayers(page: Page, roomId: string): Promise<Record<string, { depth: number; visible: boolean }>> {
  return page.evaluate((id) => {
    const host = document.querySelector("[data-testid='facility-canvas']") as any;
    const scene = host.__facilityGame.scene.getScene("facility-scene");
    const entries = [...scene.fixtureBitmapImages.entries()] as Array<[string, any]>;
    return Object.fromEntries(entries.flatMap(([key, image]) => {
      if (!key.includes(`approved:${id}:`)) return [];
      const bed = ["N3", "N4", "S3", "S4", "WC", "WD", "EC", "ED"]
        .find((candidate) => key.includes(`${candidate}.bed`));
      return bed ? [[bed, { depth: image.depth, visible: Boolean(image.visible) }]] : [];
    }));
  }, roomId);
}

async function captureRoom(
  page: Page,
  state: GameState,
  name: string,
  roomId: string,
  zoom: 1 | 1.6,
): Promise<void> {
  mkdirSync(join(PROOF_ROOT, "screenshots"), { recursive: true });
  writeState(name, state);
  await centerRoom(page, roomId, zoom);
  await page.mouse.move(8, 8);
  await page.getByTestId("facility-canvas").screenshot({
    path: join(PROOF_ROOT, "screenshots", `${name}.png`),
    animations: "disabled",
  });
}

async function installReloadAndRead(
  page: Page,
  state: GameState,
  campaignName: string,
  marker: string,
): Promise<GameState> {
  await installState(page, state, campaignName, marker);
  const before = (await getActiveState(page)) as unknown as GameState;
  await page.reload();
  const resume = page.getByRole("button", { name: `Resume ${campaignName}` });
  if (await resume.isVisible()) await resume.click();
  await expect(page.getByTestId("facility-canvas")).toBeVisible();
  const after = (await getActiveState(page)) as unknown as GameState;
  expect(after.facilityTick).toBe(before.facilityTick);
  return after;
}

function pointInsideRoom(state: GameState, point: GridPoint | null, roomId: string): boolean {
  if (!point) return false;
  const roomInstance = state.rooms.find((candidate) => candidate.id === roomId);
  const footprint = getRoomInstanceFootprint(state, roomId);
  return Boolean(roomInstance && footprint &&
    point.x >= roomInstance.x && point.x < roomInstance.x + footprint.width &&
    point.y >= roomInstance.y && point.y < roomInstance.y + footprint.height);
}

function prepareQuestion(state: GameState): GameState {
  const operationId = "periop-beds.question.admit";
  const next = gameReducer(state, {
    type: "ADMIT_PATIENT",
    operationId,
    encounterId: QUESTION_ID,
    caseId: "case.colorectal.routine-screen",
    patientDisplayName: "Periop Bed Question Patient",
    arrivalClass: "routine",
  });
  if (next.operationReceipts[operationId]?.status !== "applied") {
    throw new Error(`Question admission rejected: ${JSON.stringify(next.operationReceipts[operationId])}`);
  }
  const encounter = next.encounters[QUESTION_ID]!;
  const nodeIndex = encounter.frozenCase.decisionNodes.findIndex(
    (node) => node.id === "node.colorectal.routine-screen.1",
  );
  if (nodeIndex < 0) throw new Error("Owner-reported colonoscopy node is missing.");
  encounter.currentNodeIndex = nodeIndex;
  encounter.steps.forEach((step, index) => {
    step.status = index < nodeIndex ? "completed" : index === nodeIndex ? "action_required" : "locked";
  });
  const exam = next.rooms.find((candidate) => candidate.id === EXAM_ROOM_ID)!;
  encounter.checkInStatus = "checked_in";
  encounter.lifecycle = "active_action_required";
  encounter.patientMovement = null;
  encounter.patientLocation = anchor(exam);
  encounter.assignedRoomInstanceId = exam.id;
  encounter.queuedCareRoomInstanceId = null;
  encounter.waitingDestination = null;
  // Keep the actual UI timing case focused on the authored30/60 clocks.
  next.patientAmenityNextOpportunityTicks ??= {};
  next.patientAmenityNextOpportunityTicks[`encounter:${encounter.id}`] = Number.MAX_SAFE_INTEGER;
  next.openChartEncounterId = encounter.id;
  next.attendedEncounterId = null;
  return { ...next, paused: true };
}

function linkedQuestionOperation(state: GameState): ServiceOperationState {
  const id = state.encounters[QUESTION_ID]?.pendingResult?.localServiceOperation?.serviceOperationId;
  if (!id) throw new Error("Actual colonoscopy question has no linked operation.");
  return operation(state, id);
}

test("eight patients occupy exact authored beds while the ninth remains outside Periop", async ({ page }, testInfo) => {
  testInfo.setTimeout(150_000);
  test.skip(testInfo.project.name !== "desktop-chrome", "Private desktop Phaser proof only.");
  const campaignName = "Periop Eight Bed Capacity";
  await startClinic(page, "Periop Capacity Founder", campaignName);
  const fixture = buildCapacityState((await getActiveState(page)) as unknown as GameState, 9, 1);
  assertCapacityState(fixture.state, fixture.operationIds, EXPECTED_BEDS);
  await installState(page, fixture.state, campaignName, "periop-eight-bed-capacity");
  const bedded = fixture.operationIds.map((id) => operation(fixture.state, id))
    .filter((candidate) => candidate.periopBedReservation);
  const actors = await renderedPatients(page, bedded.map((candidate) => candidate.actorId));
  const layers = await bedFixtureLayers(page, PERIOP_ROOM_ID);
  const directionForFacing = {
    north: "back", south: "front", east: "side", west: "side",
  } as const;
  for (const candidate of bedded) {
    const bed = candidate.periopBedReservation!;
    const actor = actors[`character:patient:${candidate.actorId}`]!;
    expect(actor).toMatchObject({
      supportRole: "periop-bed-patient",
      supportId: `periop-bed:${bed.bedId}`,
      supportRoomId: PERIOP_ROOM_ID,
      pose: "seated",
      direction: directionForFacing[EXPECTED_FACING[bed.bedId as keyof typeof EXPECTED_FACING]],
      visible: true,
    });
    expect(layers[bed.bedId]).toMatchObject({ visible: true });
    expect(actor.depth).toBeGreaterThan(layers[bed.bedId]!.depth);
    expect(renderedCardinal(actor)).toBe(EXPECTED_FACING[bed.bedId as keyof typeof EXPECTED_FACING]);
  }
  expect(new Set(Object.values(actors).map((actor) => `${actor.x},${actor.y}`)).size).toBe(8);
  writeFileSync(join(PROOF_ROOT, "eight-bed-actors.json"), `${JSON.stringify({ actors, layers }, null, 2)}\n`);
  await captureRoom(page, fixture.state, "capacity-eight-beds-100", PERIOP_ROOM_ID, 1);
  await captureRoom(page, fixture.state, "capacity-eight-beds-160", PERIOP_ROOM_ID, 1.6);
  await captureRoom(page, fixture.state, "capacity-ninth-waiting-160", WAITING_ROOM_ID, 1.6);

  const hidden = buildCapacityState(fixture.state, 8, 2);
  assertCapacityState(hidden.state, hidden.operationIds, EXPECTED_BEDS.filter((id) => id !== "EC"));
  await installState(page, hidden.state, campaignName, "periop-door-hidden-capacity");
  await centerRoom(page, PERIOP_ROOM_ID, 1.6);
  await renderedPatients(page, hidden.operationIds.map((id) => operation(hidden.state, id))
    .filter((candidate) => candidate.periopBedReservation)
    .map((candidate) => candidate.actorId));
  const hiddenLayers = await bedFixtureLayers(page, PERIOP_ROOM_ID);
  expect(hiddenLayers.EC).toBeUndefined();
  expect(Object.keys(hiddenLayers).sort()).toEqual(EXPECTED_BEDS.filter((id) => id !== "EC").sort());
  await captureRoom(page, hidden.state, "capacity-door-hidden-seven-160", PERIOP_ROOM_ID, 1.6);
});

test("one Endoscopy suite stays exclusive through the outgoing room boundary", async ({ page }, testInfo) => {
  testInfo.setTimeout(150_000);
  test.skip(testInfo.project.name !== "desktop-chrome", "Private desktop Phaser proof only.");
  const campaignName = "Periop Suite Boundary";
  await startClinic(page, "Periop Boundary Founder", campaignName);
  const fixture = buildCapacityState((await getActiveState(page)) as unknown as GameState, 3, 1);
  let state = advanceUntil(fixture.state, "one-procedure-two-ready", (candidate) => {
    const operations = fixture.operationIds.map((id) => operation(candidate, id));
    return operations.filter((item) => item.phaseIndex === 1 && item.status === "in_service").length === 1 &&
      operations.filter((item) => item.phaseIndex === 0 && item.status === "waiting_for_next_phase").length === 2;
  }, 120);
  const first = fixture.operationIds.map((id) => operation(state, id))
    .find((candidate) => candidate.phaseIndex === 1 && candidate.status === "in_service")!;
  const readyOrder = fixture.operationIds.map((id) => operation(state, id))
    .filter((candidate) => candidate.status === "waiting_for_next_phase")
    .sort((left, right) =>
    (left.nextPhaseReadyAtFacilityTick ?? Number.MAX_SAFE_INTEGER) -
      (right.nextPhaseReadyAtFacilityTick ?? Number.MAX_SAFE_INTEGER) ||
    left.createdAtFacilityTick - right.createdAtFacilityTick ||
    left.id.localeCompare(right.id));
  expect(readyOrder).toHaveLength(2);
  expect(readyOrder.every((candidate) => candidate.nextPhaseReadyAtFacilityTick !== null)).toBe(true);
  const second = readyOrder[0]!;
  expect(second.status).toBe("waiting_for_next_phase");
  expect(first.reservedRoomInstanceIds).toContain(ENDOSCOPY_ROOM_ID);
  expect(second.reservedRoomInstanceIds).not.toContain(ENDOSCOPY_ROOM_ID);

  state = advanceUntil(state, "outgoing-boundary-start", (candidate) => {
    const current = operation(candidate, first.id);
    return current.phaseIndex === 2 && current.status === "walking_between_phases" &&
      current.transitionHeldRoomInstanceIds?.includes(ENDOSCOPY_ROOM_ID) === true;
  }, 90);
  const outgoingPath = operation(state, first.id).path;
  expect(outgoingPath.length).toBeGreaterThan(1);
  expect(outgoingPath.every((point, index) => index === 0 ||
    Math.abs(point.x - outgoingPath[index - 1]!.x) + Math.abs(point.y - outgoingPath[index - 1]!.y) === 1)).toBe(true);
  let observedInsideHold = false;
  for (let index = 0; index < 60; index += 1) {
    const outgoing = operation(state, first.id);
    const queued = operation(state, second.id);
    if (pointInsideRoom(state, outgoing.location, ENDOSCOPY_ROOM_ID)) {
      observedInsideHold = true;
      expect(outgoing.transitionHeldRoomInstanceIds).toContain(ENDOSCOPY_ROOM_ID);
      expect(queued.reservedRoomInstanceIds).not.toContain(ENDOSCOPY_ROOM_ID);
    } else {
      break;
    }
    state = advance(state, `boundary-cross.${index}`);
  }
  expect(observedInsideHold).toBe(true);
  expect(pointInsideRoom(state, operation(state, first.id).location, ENDOSCOPY_ROOM_ID)).toBe(false);
  state = advanceUntil(state, "second-claims-suite", (candidate) =>
    operation(candidate, second.id).reservedRoomInstanceIds.includes(ENDOSCOPY_ROOM_ID), 90);
  expect(operation(state, first.id).transitionHeldRoomInstanceIds ?? []).not.toContain(ENDOSCOPY_ROOM_ID);
  const suiteClaimants = fixture.operationIds.filter((id) =>
    operation(state, id).reservedRoomInstanceIds.includes(ENDOSCOPY_ROOM_ID) ||
    operation(state, id).transitionHeldRoomInstanceIds?.includes(ENDOSCOPY_ROOM_ID));
  expect(suiteClaimants).toEqual([second.id]);
  await installState(page, state, campaignName, "periop-suite-boundary");
  await captureRoom(page, state, "suite-boundary-second-claim-160", ENDOSCOPY_ROOM_ID, 1.6);
});

test("a finished Endoscopy visitor takes one persisted retail stop and then completes the full sidewalk exit", async ({ page }, testInfo) => {
  testInfo.setTimeout(180_000);
  test.skip(testInfo.project.name !== "desktop-chrome", "Private desktop Phaser proof only.");
  const campaignName = "Periop Departure Stop";
  await startClinic(page, "Periop Departure Founder", campaignName);
  const browserInitial = (await getActiveState(page)) as unknown as GameState;
  const evidence = buildRetailDepartureEvidence(
    browserInitial,
    "departure-browser",
  );
  const activeRetail = evidence.retailActive.retailOperations.find((candidate) =>
    candidate.departureServiceOperationId === evidence.operationId)!;
  const reloaded = await installReloadAndRead(
    page,
    evidence.retailActive,
    campaignName,
    "periop-departure-retail-reload",
  );
  expect(reloaded.retailOperations.find((candidate) => candidate.id === activeRetail.id)).toEqual(activeRetail);
  expect(operation(reloaded, evidence.operationId).departureItinerary).toEqual(
    operation(evidence.retailActive, evidence.operationId).departureItinerary,
  );

  await installState(page, evidence.retailComplete, campaignName, "periop-departure-retail-counter");
  await waitForRenderedActor(page, `character:service-visitor:${evidence.operationId}`);
  await captureRoom(page, evidence.retailComplete, "departure-retail-counter-160", "room.periop.coffee", 1.6);
  await installState(page, evidence.sidewalk, campaignName, "periop-departure-sidewalk");
  const sidewalkActorKey = `character:service-visitor:${evidence.operationId}`;
  await waitForRenderedActor(page, sidewalkActorKey);
  const sidewalkLocation = operation(evidence.sidewalk, evidence.operationId).location!;
  writeState("departure-retail-sidewalk-160", evidence.sidewalk);
  await centerPoint(page, sidewalkLocation, 1.6);
  const actorBounds = await page.evaluate((actorKey) => {
    const host = document.querySelector("[data-testid='facility-canvas']") as any;
    const scene = host.__facilityGame.scene.getScene("facility-scene");
    const bounds = scene.characterBitmapContainers.get(actorKey).getBounds();
    return { x: bounds.x, y: bounds.y, width: bounds.width, height: bounds.height,
      canvasWidth: scene.scale.width, canvasHeight: scene.scale.height };
  }, sidewalkActorKey);
  expect(actorBounds.x + actorBounds.width).toBeGreaterThan(0);
  expect(actorBounds.y + actorBounds.height).toBeGreaterThan(0);
  expect(actorBounds.x).toBeLessThan(actorBounds.canvasWidth);
  expect(actorBounds.y).toBeLessThan(actorBounds.canvasHeight);
  await page.getByTestId("facility-canvas").screenshot({
    path: join(PROOF_ROOT, "screenshots", "departure-retail-sidewalk-160.png"),
    animations: "disabled",
  });
  expect(operation(evidence.completed, evidence.operationId)).toMatchObject({
    status: "completed",
    location: null,
  });
  expect(operation(evidence.completed, evidence.operationId).periopBedReservation).toBeUndefined();
  writeFileSync(join(PROOF_ROOT, "departure-browser-movement-trace.json"),
    `${JSON.stringify(evidence.movementTrace, null, 2)}\n`);

  const resolved = buildResolvedBathroomDepartureEvidence(browserInitial, "departure-resolved-browser");
  await installState(page, resolved.bathroomActive, campaignName, "periop-departure-resolved-bathroom");
  await waitForRenderedActor(page, `character:patient:${resolved.encounterId}`);
  await captureRoom(page, resolved.bathroomActive, "departure-resolved-bathroom-160", BATHROOM_ROOM_ID, 1.6);
});

test("actual colonoscopy preserves prep, recovery, and its Waiting Room bathroom return across reload", async ({ page }, testInfo) => {
  testInfo.setTimeout(180_000);
  test.skip(testInfo.project.name !== "desktop-chrome", "Private desktop Phaser proof only.");
  const campaignName = "Periop Bed Timing";
  await startClinic(page, "Periop Timing Founder", campaignName);
  const prepared = prepareQuestion(configureFacility((await getActiveState(page)) as unknown as GameState));
  await installState(page, prepared, campaignName, "periop-bed-timing-question");
  await waitForDecisionChoices(page);
  await page.getByRole("button", { name: /^Diagnostic colonoscopy(?:$|\s)/ }).click();
  await expect(page.locator(".chart-step-feedback")).toContainText("Correct");
  await page.getByRole("button", { name: "Enact Plan", exact: true }).click();
  let state = (await getActiveState(page)) as unknown as GameState;
  state = advanceUntil(state, "question-prep-start", (candidate) => {
    const current = linkedQuestionOperation(candidate);
    return current.phaseIndex === 0 && current.status === "in_service" && current.periopBedReservation !== undefined;
  });
  let current = linkedQuestionOperation(state);
  const bed = { ...current.periopBedReservation!, endpoint: { ...current.periopBedReservation!.endpoint } };
  const prepStart = current.phaseStartedAtFacilityTick!;
  expect(current.phaseEndsAtFacilityTick).toBe(prepStart + 30);
  state = advanceUntil(state, "prep-twelve", (candidate) => candidate.facilityTick === prepStart + 12, 30);
  state = await installReloadAndRead(page, state, campaignName, "periop-bed-prep-twelve-reload");
  current = linkedQuestionOperation(state);
  expect(current.periopBedReservation).toEqual(bed);
  expect(current.phaseEndsAtFacilityTick).toBe(prepStart + 30);
  state = advanceUntil(state, "prep-twenty-nine", (candidate) => candidate.facilityTick === prepStart + 29, 30);
  expect(linkedQuestionOperation(state)).toMatchObject({ phaseIndex: 0, status: "in_service" });
  state = advanceUntil(state, "procedure-start", (candidate) => {
    const linked = linkedQuestionOperation(candidate);
    return linked.phaseIndex === 1 && linked.status === "in_service";
  }, 90);
  expect(linkedQuestionOperation(state).phaseStartedAtFacilityTick).toBeGreaterThanOrEqual(prepStart + 30);
  state = advanceUntil(state, "recovery-start", (candidate) => {
    const linked = linkedQuestionOperation(candidate);
    return linked.phaseIndex === 2 && linked.status === "in_service" &&
      linked.location?.x === bed.endpoint.x && linked.location?.y === bed.endpoint.y;
  }, 120);
  current = linkedQuestionOperation(state);
  const recoveryStart = current.phaseStartedAtFacilityTick!;
  expect(current.phaseEndsAtFacilityTick).toBe(recoveryStart + 60);
  expect(current.periopBedReservation).toEqual(bed);
  await installState(page, state, campaignName, "periop-bed-timing-recovery");
  await captureRoom(page, state, "timing-recovery-start-160", PERIOP_ROOM_ID, 1.6);
  state = advanceUntil(state, "recovery-thirty", (candidate) => candidate.facilityTick === recoveryStart + 30, 45);
  state = await installReloadAndRead(page, state, campaignName, "periop-bed-recovery-thirty-reload");
  expect(linkedQuestionOperation(state)).toMatchObject({
    phaseIndex: 2,
    status: "in_service",
    phaseEndsAtFacilityTick: recoveryStart + 60,
    periopBedReservation: bed,
  });
  state = advanceUntil(state, "recovery-fifty-nine", (candidate) => candidate.facilityTick === recoveryStart + 59, 45);
  expect(linkedQuestionOperation(state)).toMatchObject({ phaseIndex: 2, status: "in_service" });
  state = advance(state, "recovery-sixty");
  expect(linkedQuestionOperation(state)).toMatchObject({
    status: "discharging",
    periopBedReservation: bed,
  });
  state = advanceUntil(state, "physical-bed-release", (candidate) =>
    linkedQuestionOperation(candidate).periopBedReservation === undefined, 90);
  expect(pointInsideRoom(state, linkedQuestionOperation(state).location, PERIOP_ROOM_ID)).toBe(false);
  state = advanceUntil(state, "external-processing", (candidate) =>
    candidate.encounters[QUESTION_ID]?.pendingResult?.localServiceOperation?.status === "external_processing", 120);
  expect(linkedQuestionOperation(state).departureItinerary).toBeUndefined();
  expect(state.serviceIncomeReceipts.filter((receipt) => receipt.actorId === QUESTION_ID)).toHaveLength(1);
  state = advanceUntil(state, "front-desk-report-in", (candidate) => {
    const encounter = candidate.encounters[QUESTION_ID];
    return encounter?.pendingResult?.onsiteReturn?.status === "front_desk_arrived" &&
      encounter.waitingDestination?.roomInstanceId === WAITING_ROOM_ID;
  }, 120);
  let encounter = state.encounters[QUESTION_ID]!;
  expect(encounter.lifecycle).toBe("active_pending_result");
  expect(encounter.patientMovement?.kind).toBe("walking_to_waiting");
  expect(encounter.patientMovement?.kind).not.toMatch(/leaving/);
  await installState(page, state, campaignName, "periop-bed-front-desk-return");
  await captureRoom(page, state, "timing-unresolved-front-desk-160", "room.instance.founder_desk", 1.6);
  state = advanceUntil(state, "waiting-room-arrival", (candidate) => {
    const currentEncounter = candidate.encounters[QUESTION_ID];
    return currentEncounter?.patientMovement === null &&
      currentEncounter.waitingDestination?.roomInstanceId === WAITING_ROOM_ID &&
      currentEncounter.patientLocation?.x === currentEncounter.waitingDestination.location.x &&
      currentEncounter.patientLocation?.y === currentEncounter.waitingDestination.location.y;
  }, 120);
  encounter = state.encounters[QUESTION_ID]!;
  expect(encounter.lifecycle).toBe("active_pending_result");
  expect(encounter.patientMovement).toBeNull();
  expect(encounter.waitingDestination?.roomInstanceId).toBe(WAITING_ROOM_ID);
  expect(encounter.patientLocation).toEqual(encounter.waitingDestination?.location);
  await installState(page, state, campaignName, "periop-bed-waiting-return");
  await captureRoom(page, state, "timing-unresolved-waiting-160", WAITING_ROOM_ID, 1.6);

  const waitingResultState = deserializeGameState(serializeGameState(state));
  waitingResultState.retailNextOpportunityTicks[`encounter:${QUESTION_ID}`] = Number.MAX_SAFE_INTEGER;
  const waitingTarget = { ...encounter.waitingDestination!.location };
  expect(encounter.pendingResult!.dueTick).toBeGreaterThan(state.facilityTick);
  const scheduledBathroom = scheduleRealBathroomOpportunity(state, "encounter", QUESTION_ID);
  state = advance(scheduledBathroom.state, "actual-waiter-bathroom-opportunity");
  state = advanceUntil(state, "actual-waiter-bathroom-use", (candidate) =>
    getPatientAmenityTrip(candidate, "encounter", QUESTION_ID)?.status === "using_amenity", 90);
  expect(state.encounters[QUESTION_ID]?.waitingDestination?.location).toEqual(waitingTarget);
  expect(state.encounters[QUESTION_ID]?.patientLocation).toEqual(anchor(
    state.rooms.find((candidate) => candidate.id === BATHROOM_ROOM_ID)!,
  ));
  await installState(page, state, campaignName, "periop-bed-waiter-bathroom-use");
  const bathroomActor = (await renderedPatients(page, [QUESTION_ID]))[`character:patient:${QUESTION_ID}`]!;
  expect(bathroomActor.supportRole).toBeUndefined();
  await captureRoom(page, state, "timing-unresolved-bathroom-160", BATHROOM_ROOM_ID, 1.6);

  const openWhileAwayId = "periop-beds.open-chart-while-bathroom";
  state = gameReducer(state, {
    type: "OPEN_CHART",
    operationId: openWhileAwayId,
    encounterId: QUESTION_ID,
  });
  expect(state.operationReceipts[openWhileAwayId]).toMatchObject({
    status: "rejected",
  });
  expect(state.operationReceipts[openWhileAwayId]?.message).toContain("returning from the bathroom");
  expect(getPatientAmenityTrip(state, "encounter", QUESTION_ID)).toMatchObject({
    status: "returning",
    returnRequested: true,
    returnTarget: waitingTarget,
  });
  state = advanceUntil(state, "actual-waiter-bathroom-return", (candidate) =>
    getPatientAmenityTrip(candidate, "encounter", QUESTION_ID) === null, 90);
  encounter = state.encounters[QUESTION_ID]!;
  expect(encounter.patientLocation).toEqual(waitingTarget);
  expect(encounter.waitingDestination?.location).toEqual(waitingTarget);
  expect(encounter.lifecycle).toBe("active_pending_result");
  const openAfterReturnId = "periop-beds.open-chart-after-bathroom";
  state = gameReducer(state, {
    type: "OPEN_CHART",
    operationId: openAfterReturnId,
    encounterId: QUESTION_ID,
  });
  expect(state.operationReceipts[openAfterReturnId]?.status).toBe("applied");
  await installState(page, state, campaignName, "periop-bed-waiter-bathroom-returned");
  const returnedActor = (await renderedPatients(page, [QUESTION_ID]))[`character:patient:${QUESTION_ID}`]!;
  expect(returnedActor.supportRole).toBe("waiting-seat");
  await captureRoom(page, state, "timing-unresolved-bathroom-return-160", WAITING_ROOM_ID, 1.6);

  let dueState = advanceUntil(waitingResultState, "actual-result-due-window", (candidate) => {
    const pending = candidate.encounters[QUESTION_ID]?.pendingResult;
    return Boolean(pending && pending.deliveredAtTick === null && pending.dueTick - candidate.facilityTick === 2);
  }, 240);
  const dueOpportunity = scheduleRealBathroomOpportunity(dueState, "encounter", QUESTION_ID);
  dueState = advance(dueOpportunity.state, "actual-result-due-bathroom-start");
  const dueTrip = getPatientAmenityTrip(dueState, "encounter", QUESTION_ID);
  if (!dueTrip) {
    const dueEncounter = dueState.encounters[QUESTION_ID]!;
    throw new Error(`Due-window bathroom opportunity was ineligible: ${JSON.stringify({
      facilityTick: dueState.facilityTick,
      lifecycle: dueEncounter.lifecycle,
      checkInStatus: dueEncounter.checkInStatus,
      patientMovement: dueEncounter.patientMovement,
      patientLocation: dueEncounter.patientLocation,
      waitingDestination: dueEncounter.waitingDestination,
      openChartEncounterId: dueState.openChartEncounterId,
      deliveredAtTick: dueEncounter.pendingResult?.deliveredAtTick,
      dueTick: dueEncounter.pendingResult?.dueTick,
      nextOpportunity: dueState.patientAmenityNextOpportunityTicks?.[`encounter:${QUESTION_ID}`],
    })}`);
  }
  expect(dueTrip.status).toBe("walking_to_amenity");
  expect(dueState.encounters[QUESTION_ID]?.pendingResult?.deliveredAtTick).toBeNull();
  dueState = advance(dueState, "actual-result-becomes-due-away");
  expect(dueState.facilityTick).toBe(dueState.encounters[QUESTION_ID]?.pendingResult?.dueTick);
  expect(getPatientAmenityTrip(dueState, "encounter", QUESTION_ID)).toMatchObject({
    status: "returning",
    returnRequested: true,
    returnTarget: waitingTarget,
  });
  expect(dueState.encounters[QUESTION_ID]?.pendingResult?.deliveredAtTick).toBeNull();
  writeState("amenity-result-due-return-requested", dueState);
  writeFileSync(join(PROOF_ROOT, "timing-summary.json"), `${JSON.stringify({
    prepStart,
    prepReadyAt: prepStart + 30,
    recoveryStart,
    recoveryCompleteAt: recoveryStart + 60,
    bed,
    bathroomReturnTarget: waitingTarget,
  }, null, 2)}\n`);
});
