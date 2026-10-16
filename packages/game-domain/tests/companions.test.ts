import { describe, expect, it } from "vitest";
import {
  COMPANION_VISIT_POLICIES,
  PROTOTYPE_DOMAIN_CONTEXT,
  RETAINED_FINISHED_RETAIL_RECORD_LIMIT,
  advanceRetailOperations,
  createInitialGameState,
  deserializeGameState,
  getRoomCompanionSeats,
  getRoomDefinition,
  findDeterministicFacilityPath,
  retireFinishedRetailHistory,
  serializeGameState,
  type DomainContext,
  type GameState,
  type ServiceOperationState,
} from "../src";

function fixture(): GameState {
  const state = createInitialGameState(undefined, { campaignId: "campaign.companions", campaignSeed: "companions", createdAtRealMs: 0 });
  state.encounters = {};
  state.serviceOperations = [];
  state.nextExternalRetailOpportunityTick = Number.MAX_SAFE_INTEGER;
  state.retailNextOpportunityTicks["founder:founder"] = Number.MAX_SAFE_INTEGER;
  return state;
}

function addOperation(state: GameState, incomeLineId: string, id = "procedure.test"): ServiceOperationState {
  const operation: ServiceOperationState = {
    id, incomeLineId, catalogVersion: 1, actorKind: "visitor", actorId: `${id}.patient`,
    displayName: "QA Patient", appearance: state.founder.appearance, status: "in_service",
    createdAtFacilityTick: 0, waitDeadlineFacilityTick: 60, startedAtFacilityTick: 0,
    completedAtFacilityTick: null, cancelledAtFacilityTick: null, quoteFee: 0,
    phaseIndex: 0, phaseStartedAtFacilityTick: 0, phaseEndsAtFacilityTick: 30,
    reservedRoomInstanceIds: [], reservedEmployeeIds: [], providerReservation: null,
    location: { x: 35, y: 31 }, path: [{ x: 35, y: 31 }], pathIndex: 0,
    lastMovedAtFacilityTick: 0, cancellationReason: null,
    visitorTravel: { version: "service-visitor-travel.v1", offscreenEndpoint: { x: PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility.gridWidth + 1, y: 32 }, arrivedAtFacilityTick: 0 },
  };
  state.serviceOperations.push(operation);
  state.retailNextOpportunityTicks[`service_visitor:${id}`] = Number.MAX_SAFE_INTEGER;
  return operation;
}

function tick(state: GameState, context: DomainContext = PROTOTYPE_DOMAIN_CONTEXT): void {
  state.facilityTick += 1;
  for (const actor of state.retailExternalActors) state.retailNextOpportunityTicks[`companion:${actor.id}`] = Number.MAX_SAFE_INTEGER;
  advanceRetailOperations(state, context);
}

function procedureFixture() {
  const state = fixture();
  state.facilityLevel = 2;
  state.rooms.push({ id: "periop.qa", roomDefinitionId: "room.periop_recovery", x: 38, y: 26, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 });
  state.doors.push({ id: "periop.qa.west", roomId: "periop.qa", side: "west", offset: 2, exterior: false });
  const operation = addOperation(state, "income.endoscopy");
  Object.assign(operation, {
    phaseFlowVersion: 1, periopBedFlowVersion: 1, reservedRoomInstanceIds: ["periop.qa"],
    location: { x: 40, y: 28 }, path: [{ x: 40, y: 28 }],
    periopBedReservation: { version: "periop-bed-reservation.v1", roomInstanceId: "periop.qa", bedId: "N3", endpoint: { x: 40, y: 28 } },
    frozenOperationPhases: [
      { id: "prep", roomDefinitionId: "room.periop_recovery", durationMinutes: 30, staffRoleDefinitionIds: [], roomStationId: "periop_preparation" },
      { id: "procedure", roomDefinitionId: "room.endoscopy", durationMinutes: 45, staffRoleDefinitionIds: [] },
      { id: "pacu", roomDefinitionId: "room.periop_recovery", durationMinutes: 60, staffRoleDefinitionIds: [], roomStationId: "periop_recovery" },
    ],
  } satisfies Partial<ServiceOperationState>);
  return { state, operation };
}

function settleCompanion(state: GameState, context = PROTOTYPE_DOMAIN_CONTEXT) {
  tick(state, context);
  const actor = state.retailExternalActors.find((candidate) => candidate.kind === "companion")!;
  expect(actor).toBeDefined();
  for (let index = 0; index < 100 && actor.lifecycle === "arriving"; index += 1) tick(state, context);
  expect(actor.lifecycle).toBe("onsite");
  return actor;
}

describe("companion visit eligibility", () => {
  it.each(Object.keys(COMPANION_VISIT_POLICIES))("creates one companion for %s", (incomeLineId) => {
    const state = fixture();
    addOperation(state, incomeLineId);
    tick(state);
    tick(state);
    expect(state.retailExternalActors.filter((actor) => actor.kind === "companion")).toHaveLength(1);
  });

  it.each([
    "income.basic_labs", "income.ultrasound", "income.minor_procedure_simple", "income.minor_procedure_complex",
    "income.cutaneous_lesion_biopsy", "income.skin_excisional_biopsy", "income.glp1_follow_up",
  ])("does not create a companion for %s", (incomeLineId) => {
    const state = fixture();
    addOperation(state, incomeLineId);
    tick(state);
    expect(state.retailExternalActors.filter((actor) => actor.kind === "companion")).toEqual([]);
  });

  it("lets a saved companion for a now-ineligible visit leave normally and never recreates it", () => {
    let state = fixture();
    const operation = addOperation(state, "income.minor_procedure_simple");
    state.retailExternalActors.push({
      id: "companion.saved", kind: "companion", displayName: "Saved Companion", appearance: state.founder.appearance,
      linkedServiceOperationId: operation.id, linkedEncounterId: null, lifecycle: "onsite",
      location: { x: 35, y: 31 }, path: [{ x: 35, y: 31 }], pathIndex: 0,
      lastMovedAtFacilityTick: 0, activeRetailOperationId: null,
    });
    state = deserializeGameState(serializeGameState(state));
    const saved = state.retailExternalActors[0]!;
    const before = { ...saved.location! };
    tick(state);
    expect(saved.location).toEqual(before);
    expect(saved.lifecycle).toBe("onsite");
    state.serviceOperations[0]!.status = "completed";
    state.serviceOperations[0]!.location = null;
    tick(state);
    expect(saved.lifecycle).toBe("departing");
    expect(saved.location).not.toBeNull();
    for (let index = 0; index < 100 && saved.lifecycle !== "departed"; index += 1) tick(state);
    expect(saved).toMatchObject({ lifecycle: "departed", location: null });
    // The saved departed actor also guards against a replacement if a frozen
    // operation is restored before its final service status is reconciled.
    state.serviceOperations[0]!.status = "in_service";
    tick(state);
    expect(state.retailExternalActors.map((actor) => actor.id)).toEqual(["companion.saved"]);
  });

  it("marks pediatric parents as always staying in the patient's room for future room design", () => {
    expect(COMPANION_VISIT_POLICIES["income.pediatric_consult"]).toEqual({ kind: "pediatric", parentMustStayWithPatient: true });
  });

  it("retains a saved departed companion's duplicate guard while its visit is active", () => {
    const state = fixture();
    const operation = addOperation(state, "income.endoscopy");
    tick(state);
    const companion = state.retailExternalActors[0]!;
    companion.lifecycle = "departed";
    companion.location = null;
    companion.path = [];
    for (let index = 0; index <= RETAINED_FINISHED_RETAIL_RECORD_LIMIT; index += 1) state.retailExternalActors.push({
      ...companion, id: `retail-visitor.history.${index}`, kind: "retail_visitor", linkedServiceOperationId: null,
    });
    retireFinishedRetailHistory(state);
    expect(state.retailExternalActors.some((actor) => actor.id === companion.id)).toBe(true);
    tick(state);
    expect(state.retailExternalActors.filter((actor) => actor.kind === "companion").map((actor) => actor.id)).toEqual([companion.id]);
    expect(operation.status).toBe("in_service");
  });
});

describe("procedure companion phases", () => {
  it("walks into the patient's Periop room, waits through PACU and follows the physical discharge", () => {
    const { state, operation } = procedureFixture();
    tick(state);
    const arriving = state.retailExternalActors[0]!;
    expect(arriving.lifecycle).toBe("arriving");
    expect(arriving.location!.x < 0 || arriving.location!.x >= PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility.gridWidth).toBe(true);
    const actor = settleCompanion(state);
    expect(actor.procedureCompanion?.waitingReservation?.roomInstanceId).toBe("periop.qa");
    expect(actor.procedureCompanion?.waitingReservation?.kind).toBe("chair");
    expect(actor.location).toEqual(actor.procedureCompanion?.waitingReservation?.location);
    expect(actor.location).not.toEqual(operation.location);
    const waitLocation = { ...actor.location! };
    operation.phaseIndex = 2;
    tick(state);
    expect(actor.location).toEqual(waitLocation);
    operation.status = "discharging";
    tick(state);
    expect(actor.lifecycle).toBe("onsite");
    expect(actor.procedureCompanion?.phase).toBe("waiting_in_periop");
    operation.location = { x: 37, y: 30 };
    tick(state);
    expect(actor.lifecycle).toBe("departing");
    expect(actor.procedureCompanion?.waitingReservation).toBeNull();
    expect(actor.location).not.toBeNull();
    operation.status = "completed";
    operation.location = null;
    for (let index = 0; index < 100 && actor.lifecycle !== "departed"; index += 1) tick(state);
    expect(actor).toMatchObject({ lifecycle: "departed", location: null });
    expect(state.retailExternalActors).toHaveLength(1);
  });

  it("uses a seeded existing amenity only during the procedure, preserves it on reload and returns when PACU starts", () => {
    let { state, operation } = procedureFixture();
    state.rooms.push({ id: "coffee.qa", roomDefinitionId: "room.coffee_kiosk", x: 38, y: 24, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 });
    state.doors.push({ id: "periop.qa.north", roomId: "periop.qa", side: "north", offset: 0, exterior: false });
    const context = JSON.parse(JSON.stringify(PROTOTYPE_DOMAIN_CONTEXT)) as DomainContext;
    context.balanceRelease.environment.idleActionChancePercent = 100;
    const actor = settleCompanion(state, context);
    expect(actor.procedureCompanion?.amenityDecisionPhaseIndex).toBeNull();
    operation.phaseIndex = 1;
    operation.location = { x: 2, y: 2 };
    tick(state, context);
    expect(actor.procedureCompanion).toMatchObject({ phase: "walking_to_amenity", amenityRoomInstanceId: "coffee.qa", waitingReservation: null, amenityDecisionPhaseIndex: 1 });
    const flow = structuredClone(actor.procedureCompanion);
    state = deserializeGameState(serializeGameState(state));
    const saved = state.retailExternalActors.find((candidate) => candidate.id === actor.id)!;
    expect(saved.procedureCompanion).toEqual(flow);
    for (let index = 0; index < 30 && saved.procedureCompanion?.phase !== "using_amenity"; index += 1) tick(state, context);
    expect(saved.procedureCompanion?.phase).toBe("using_amenity");
    for (let index = 0; index < 5; index += 1) tick(state, context);
    expect(saved.procedureCompanion?.phase).toBe("using_amenity");
    const amenityLocation = { ...saved.location! };
    operation = state.serviceOperations[0]!;
    operation.phaseIndex = 2;
    operation.location = { x: 40, y: 28 };
    tick(state, context);
    expect(saved.path[0]).toEqual(amenityLocation);
    expect(saved.pathIndex).toBeLessThanOrEqual(context.balanceRelease.facility.characterTravelTilesPerTick);
    for (let index = 0; index < 30 && saved.procedureCompanion?.phase !== "waiting_in_periop"; index += 1) tick(state, context);
    expect(saved.procedureCompanion).toMatchObject({ phase: "waiting_in_periop", amenityRoomInstanceId: null });
    expect(saved.location).toEqual(saved.procedureCompanion?.waitingReservation?.location);
    const roomCounts = state.rooms.length;
    for (let index = 0; index < 30; index += 1) tick(state, context);
    expect(saved.procedureCompanion?.phase).toBe("waiting_in_periop");
    expect(state.rooms).toHaveLength(roomCounts);
    expect(state.retailOperations).toEqual([]);
  });

  it.each(["missing", "unreachable", "out_of_service"] as const)("skips %s amenities instead of inventing one", (availability) => {
    const { state, operation } = procedureFixture();
    if (availability === "unreachable") state.rooms.push({ id: "unreachable.qa", roomDefinitionId: "room.vending", x: 1, y: 1, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 });
    if (availability === "out_of_service") {
      state.rooms.push({ id: "broken.qa", roomDefinitionId: "room.coffee_kiosk", x: 38, y: 24, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100,
        maintenance: { status: "out_of_service", dueAtFacilityTick: 0, outOfServiceAtFacilityTick: 0, completedUses: 0, appliedUseKeys: [] } });
      state.doors.push({ id: "periop.qa.north", roomId: "periop.qa", side: "north", offset: 0, exterior: false });
    }
    const context = JSON.parse(JSON.stringify(PROTOTYPE_DOMAIN_CONTEXT)) as DomainContext;
    context.balanceRelease.environment.idleActionChancePercent = 100;
    const actor = settleCompanion(state, context);
    operation.phaseIndex = 1;
    tick(state, context);
    expect(actor.procedureCompanion).toMatchObject({ phase: "waiting_in_periop", amenityRoomInstanceId: null, amenityDecisionPhaseIndex: 1 });
  });

  it("the seeded chance can keep a companion in Periop even with a reachable amenity", () => {
    const { state, operation } = procedureFixture();
    state.rooms.push({ id: "coffee.qa", roomDefinitionId: "room.coffee_kiosk", x: 38, y: 24, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 });
    state.doors.push({ id: "periop.qa.north", roomId: "periop.qa", side: "north", offset: 0, exterior: false });
    const context = JSON.parse(JSON.stringify(PROTOTYPE_DOMAIN_CONTEXT)) as DomainContext;
    context.balanceRelease.environment.idleActionChancePercent = 0;
    const actor = settleCompanion(state, context);
    operation.phaseIndex = 1;
    tick(state, context);
    expect(actor.procedureCompanion).toMatchObject({ phase: "waiting_in_periop", amenityRoomInstanceId: null, amenityDecisionPhaseIndex: 1 });
  });

  it("returns after the amenity dwell even while the procedure continues", () => {
    const { state, operation } = procedureFixture();
    state.rooms.push({ id: "coffee.qa", roomDefinitionId: "room.coffee_kiosk", x: 38, y: 24, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 });
    state.doors.push({ id: "periop.qa.north", roomId: "periop.qa", side: "north", offset: 0, exterior: false });
    const context = JSON.parse(JSON.stringify(PROTOTYPE_DOMAIN_CONTEXT)) as DomainContext;
    context.balanceRelease.environment.idleActionChancePercent = 100;
    context.balanceRelease.environment.idleActionMinimumMinutes = 1;
    context.balanceRelease.environment.idleActionMaximumMinutes = 1;
    const actor = settleCompanion(state, context);
    operation.phaseIndex = 1;
    tick(state, context);
    for (let index = 0; index < 30 && actor.procedureCompanion?.phase !== "using_amenity"; index += 1) tick(state, context);
    expect(actor.procedureCompanion?.phase).toBe("using_amenity");
    for (let index = 0; index < 30 && actor.procedureCompanion?.phase !== "waiting_in_periop"; index += 1) tick(state, context);
    expect(actor.procedureCompanion?.phase).toBe("waiting_in_periop");
    expect(operation.phaseIndex).toBe(1);
    const home = { ...actor.location! };
    tick(state, context);
    expect(actor.location).toEqual(home);
    expect(actor.procedureCompanion?.amenityRoomInstanceId).toBeNull();
  });
});

describe("Periop companion seating", () => {
  it("hides each doorway chair, including openings owned by the neighboring room", () => {
    const { state } = procedureFixture();
    const room = state.rooms.find((candidate) => candidate.id === "periop.qa")!;
    const definition = getRoomDefinition(room.roomDefinitionId)!;
    const seats = getRoomCompanionSeats(room, definition, [], state.rooms, getRoomDefinition);
    expect(seats).toHaveLength(8);
    for (const seat of seats) {
      const local = { x: seat.anchor.x - room.x, y: seat.anchor.y - room.y };
      const side = local.x === 0 ? "west" : local.x === 5 ? "east" : local.y === 0 ? "north" : "south";
      const offset = side === "north" || side === "south" ? local.x : local.y;
      const doors = [{ id: `door.${seat.id}`, roomId: room.id, side, offset, exterior: false } as const];
      expect(getRoomCompanionSeats(room, definition, doors, state.rooms, getRoomDefinition).map((candidate) => candidate.id)).not.toContain(seat.id);
      expect(getRoomCompanionSeats(room, definition, doors, state.rooms, getRoomDefinition)).toHaveLength(7);
    }
    state.rooms.push({ id: "hall.seat-door", roomDefinitionId: "room.hallway", x: 37, y: 27, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 });
    state.doors.push({ id: "hall.opens-chair", roomId: "hall.seat-door", side: "east", offset: 0, exterior: false });
    expect(getRoomCompanionSeats(room, definition, state.doors, state.rooms, getRoomDefinition).map((seat) => seat.id)).not.toContain("companion.NW.west");
  });

  it("reserves eight distinct chairs, keeps overflow standing in Periop and reseats it when one opens", () => {
    const { state } = procedureFixture();
    for (let index = 1; index < 9; index += 1) {
      const operation = structuredClone(state.serviceOperations[0]!);
      operation.id = `procedure.seat.${index}`;
      operation.actorId = `${operation.id}.patient`;
      state.serviceOperations.push(operation);
    }
    tick(state);
    const actors = state.retailExternalActors.filter((actor) => actor.kind === "companion");
    expect(actors).toHaveLength(9);
    const reservations = actors.map((actor) => actor.procedureCompanion!.waitingReservation!);
    expect(reservations.filter((reservation) => reservation.kind === "chair")).toHaveLength(8);
    expect(new Set(reservations.map((reservation) => `${reservation.location.x},${reservation.location.y}`)).size).toBe(9);
    const standing = actors.find((actor) => actor.procedureCompanion!.waitingReservation!.kind === "standing")!;
    for (let index = 0; index < 100 && actors.some((actor) => actor.lifecycle === "arriving"); index += 1) tick(state);
    expect(standing.location).toEqual(standing.procedureCompanion!.waitingReservation!.location);
    const seated = actors.find((actor) => actor.procedureCompanion!.waitingReservation!.kind === "chair")!;
    const freeSeatId = seated.procedureCompanion!.waitingReservation!.seatId;
    state.serviceOperations.find((operation) => operation.id === seated.linkedServiceOperationId)!.status = "completed";
    state.serviceOperations.find((operation) => operation.id === seated.linkedServiceOperationId)!.location = null;
    for (let index = 0; index < 30 && standing.procedureCompanion!.waitingReservation!.kind !== "chair"; index += 1) tick(state);
    expect(standing.procedureCompanion!.waitingReservation).toMatchObject({ kind: "chair", seatId: freeSeatId, roomInstanceId: "periop.qa" });
    const restored = deserializeGameState(serializeGameState(state));
    expect(restored.retailExternalActors.find((actor) => actor.id === standing.id)?.procedureCompanion).toEqual(standing.procedureCompanion);
  });

  it("a door replacing a reserved chair releases the claim and routes from the live tile", () => {
    const { state } = procedureFixture();
    const actor = settleCompanion(state);
    const reservation = actor.procedureCompanion!.waitingReservation!;
    const before = { ...actor.location! };
    const local = { x: reservation.location.x - 38, y: reservation.location.y - 26 };
    const side = local.x === 0 ? "west" : local.x === 5 ? "east" : local.y === 0 ? "north" : "south";
    state.doors.push({ id: "door.replaces-chair", roomId: "periop.qa", side, offset: side === "north" || side === "south" ? local.x : local.y, exterior: false });
    tick(state);
    expect(actor.procedureCompanion!.waitingReservation!.seatId).not.toBe(reservation.seatId);
    expect(actor.path[0]).toEqual(before);
    expect(Math.abs(actor.location!.x - before.x) + Math.abs(actor.location!.y - before.y)).toBeLessThanOrEqual(PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility.characterTravelTilesPerTick);
  });

  it("corner chairs are endpoints and do not obstruct the retained beds or shared staff post", () => {
    const { state } = procedureFixture();
    const room = state.rooms.find((candidate) => candidate.id === "periop.qa")!;
    const definition = getRoomDefinition(room.roomDefinitionId)!;
    for (const seat of getRoomCompanionSeats(room, definition, state.doors, state.rooms, getRoomDefinition)) {
      const path = findDeterministicFacilityPath({ x: 37, y: 30 }, seat.anchor, state.rooms, state.doors, getRoomDefinition);
      expect(path.at(-1)).toEqual(seat.anchor);
    }
    expect(findDeterministicFacilityPath({ x: 37, y: 30 }, { x: 40, y: 28 }, state.rooms, state.doors, getRoomDefinition).at(-1)).toEqual({ x: 40, y: 28 });
    expect(findDeterministicFacilityPath({ x: 37, y: 30 }, { x: 41, y: 29 }, state.rooms, state.doors, getRoomDefinition).at(-1)).toEqual({ x: 41, y: 29 });
  });

  it("preserves a navigable approach at every Periop doorway, including the four corners", () => {
    const { state } = procedureFixture();
    const room = state.rooms.find((candidate) => candidate.id === "periop.qa")!;
    for (const side of ["north", "east", "south", "west"] as const) for (let offset = 0; offset < 6; offset += 1) {
      const inside = side === "north" ? { x: room.x + offset, y: room.y }
        : side === "south" ? { x: room.x + offset, y: room.y + 5 }
          : side === "west" ? { x: room.x, y: room.y + offset } : { x: room.x + 5, y: room.y + offset };
      const door = { id: `door.slot.${side}.${offset}`, roomId: room.id, side, offset, exterior: false };
      const path = findDeterministicFacilityPath(inside, { x: 41, y: 28 }, [room], [door], getRoomDefinition);
      expect(path.at(-1), `${side} ${offset}`).toEqual({ x: 41, y: 28 });
    }
  });
});
