import { describe, expect, it } from "vitest";
import { advancePatientAmenityTrips, deserializeGameState, gameReducer,
  findRouteFromDisplacedLocationOffscreen, getRoomDefinition, getRoomNavigationAnchor, PROTOTYPE_DOMAIN_CONTEXT, serializeGameState,
  tryStartPatientBathroomTrip, type GameState } from "../src";
import { createPediatricFamily } from "../src/pediatric-family";
import { releaseBusyRoom, serviceQueueFixture } from "./service-queue-waiting.fixture";
import { chooseWaitingAreaDestination } from "../src/waiting-destinations";

function fixture(kind: "encounter" | "visitor" = "visitor") {
  const { state, operation } = serviceQueueFixture("room.ultrasound", kind);
  const front = state.rooms[0]!;
  state.rooms.push({ id: "bathroom", roomDefinitionId: "room.bathroom", x: front.x + 5, y: front.y + 1,
    orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 });
  state.doors.push({ id: "bathroom.west", roomId: "bathroom", side: "west", offset: 1, exterior: false });
  if (kind === "encounter") {
    const encounter = state.encounters[operation.actorId]!;
    encounter.lifecycle = "waiting_unopened"; encounter.resolutionReason = null; encounter.resolvedAtFacilityTick = null;
    encounter.nextIdleActionAtFacilityTick = Number.MAX_SAFE_INTEGER;
  }
  const actorKind = kind === "visitor" ? "service_visitor" as const : "encounter" as const;
  const actorId = kind === "visitor" ? operation.id : operation.actorId;
  state.patientAmenityNextOpportunityTicks = { [`${actorKind}:${actorId}`]: Number.MAX_SAFE_INTEGER };
  const bathroom = state.rooms.find(room => room.id === "bathroom")!;
  const inside = getRoomNavigationAnchor(bathroom, getRoomDefinition(bathroom.roomDefinitionId)!);
  return { state, operation, actorKind, actorId, inside };
}

function occupy(f: ReturnType<typeof fixture>) {
  expect(tryStartPatientBathroomTrip(f.state, f.actorKind, f.actorId, PROTOTYPE_DOMAIN_CONTEXT)).toBe(true);
  for (let i = 0; i < 40 && f.state.patientAmenityTrips![0]?.status !== "using_amenity"; i++) {
    f.state.facilityTick++; advancePatientAmenityTrips(f.state, PROTOTYPE_DOMAIN_CONTEXT);
  }
  expect(f.state.patientAmenityTrips![0]?.status).toBe("using_amenity");
  f.state.patientAmenityNextOpportunityTicks![`${f.actorKind}:${f.actorId}`] = Number.MAX_SAFE_INTEGER;
}

function location(state: GameState, f: ReturnType<typeof fixture>) {
  return f.actorKind === "encounter" ? state.encounters[f.actorId]?.patientLocation
    : state.serviceOperations.find(op => op.id === f.actorId)?.location;
}

function tickAmenities(state: GameState, minutes = 1) {
  for (let i = 0; i < minutes; i++) { state.facilityTick++; advancePatientAmenityTrips(state, PROTOTYPE_DOMAIN_CONTEXT); }
}

describe("restroom exit recovery", () => {
  it.each(["visitor", "encounter"] as const)("repairs an unowned fractional %s position without a grid escape search", kind => {
    const f = fixture(kind);
    const start = { x: f.inside.x + .6, y: f.inside.y + .2 };
    f.operation.location = start; f.operation.path = [start]; f.operation.pathIndex = 0;
    if (kind === "encounter") {
      const encounter = f.state.encounters[f.actorId]!;
      encounter.patientLocation = start;
      encounter.waitingDestination = { roomInstanceId: "waiting", location: { x: 29, y: 25 }, kind: "chair" };
    }
    f.state.rooms = f.state.rooms.filter(room => room.id !== "bathroom");
    f.state.doors = f.state.doors.filter(door => door.roomId !== "bathroom");
    tickAmenities(f.state);
    const repaired = location(f.state, f)!;
    expect(repaired).not.toEqual(start);
    expect(repaired.x).toBeLessThan(33);
    expect(Number.isInteger(repaired.x) && Number.isInteger(repaired.y)).toBe(true);
  });

  it.each(["visitor", "encounter", "service_owned_encounter"] as const)("preserves a %s's captured exit path after its room is removed", kind => {
    const f = fixture(kind === "service_owned_encounter" ? "encounter" : kind);
    const start = { x: f.inside.x + .6, y: f.inside.y + .2 };
    const path = [start, { x: f.inside.x + .2, y: f.inside.y }, { x: f.inside.x - 1, y: f.inside.y }];
    if (kind !== "visitor") {
      const encounter = f.state.encounters[f.actorId]!;
      encounter.patientLocation = start;
      encounter.waitingDestination = { roomInstanceId: "waiting", location: path.at(-1)!, kind: "standing" };
      encounter.patientMovement = kind === "service_owned_encounter" ? null : { kind: "walking_to_waiting", path, pathIndex: 0,
        lastMovedAtFacilityTick: 0, destinationRoomInstanceId: "waiting" };
    }
    f.operation.location = start; f.operation.path = path; f.operation.pathIndex = 0;
    f.state.rooms = f.state.rooms.filter(room => room.id !== "bathroom");
    f.state.doors = f.state.doors.filter(door => door.roomId !== "bathroom");
    tickAmenities(f.state);
    expect(location(f.state, f)).toEqual(start);
    expect(kind === "encounter" ? f.state.encounters[f.actorId]!.patientMovement?.path : f.operation.path).toEqual(path);
  });

  it.each(["visitor", "encounter"] as const)("respects a %s retail movement owner through a bathroom", kind => {
    const f = fixture(kind);
    if (kind === "encounter") f.state.encounters[f.actorId]!.patientLocation = f.inside;
    f.operation.location = f.inside; f.operation.path = [f.inside]; f.operation.pathIndex = 0;
    const outside = { x: f.inside.x - 1, y: f.inside.y };
    f.state.retailOperations.push({ id: "retail.bathroom-transit", incomeLineId: "income.coffee", catalogVersion: 1,
      actorKind: f.actorKind, actorId: f.actorId, displayName: "Retail transit", appearance: f.state.founder.appearance,
      linkedServiceOperationId: null, authorizedOrderId: null, status: "returning", createdAtFacilityTick: 0,
      waitDeadlineFacilityTick: 200, startedAtFacilityTick: 0, completedAtFacilityTick: null, quoteGross: 0,
      quoteStockCost: 0, outletRoomInstanceId: "coffee", outletDurationMinutes: 1, staffRoleDefinitionId: null,
      servingEmployeeId: null, location: f.inside, returnLocation: outside, path: [f.inside, outside], pathIndex: 0,
      lastMovedAtFacilityTick: 0, purchaseEndsAtFacilityTick: null, cancellationReason: null });
    tickAmenities(f.state);
    expect(location(f.state, f)).toEqual(f.inside);
    expect(f.state.patientAmenityTrips).toEqual([]);
    expect(f.state.retailOperations[0]!.status).toBe("returning");
  });

  it.each(["visitor", "encounter"] as const)("bounds a %s stay even when its return target becomes unreachable", kind => {
    const f = fixture(kind); occupy(f);
    // A retired/moved care reservation is no longer a legal public return target.
    f.state.patientAmenityTrips![0]!.returnTarget = { x: 34, y: 22 };
    f.state.patientAmenityTrips![0]!.dwellEndsAtFacilityTick = f.state.facilityTick;
    tickAmenities(f.state);
    const returnTarget = f.state.patientAmenityTrips![0]!.returnTarget;
    if (kind === "visitor") {
      const other = chooseWaitingAreaDestination(f.state, PROTOTYPE_DOMAIN_CONTEXT,
        { kind: "service_visitor", id: "other.waiter", location: { x: 35, y: 31 } }, true);
      expect(other.reservation).not.toBeNull();
      expect(other.reservation!.location).not.toEqual(returnTarget);
    }
    tickAmenities(f.state, 60);
    expect(f.state.patientAmenityTrips).toEqual([]);
    expect(location(f.state, f)).not.toEqual(f.inside);
    expect(location(f.state, f)?.x).toBeLessThan(33);
  });

  it("uses public overflow away from check-in when no waiting room exists", () => {
    const f = fixture(); occupy(f);
    f.state.rooms = f.state.rooms.filter(room => room.id !== "waiting" && !room.id.startsWith("hall."));
    f.state.doors = f.state.doors.filter(door => door.id !== "waiting.east" && door.id !== "bathroom.west");
    tickAmenities(f.state);
    const point = location(f.state, f)!;
    expect(point.y).toBe(PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility.gridHeight);
    const entrance = f.state.doors.find(door => door.exterior)!;
    const front = f.state.rooms.find(room => room.id === entrance.roomId)!;
    const checkIn = getRoomNavigationAnchor(front, getRoomDefinition(front.roomDefinitionId)!);
    expect(Math.abs(point.x - checkIn.x)).toBeGreaterThanOrEqual(2);
    expect(f.state.patientAmenityTrips).toEqual([]);
  });

  it.each([null, Number.MAX_SAFE_INTEGER])("repairs an absent or unbounded dwell deadline (%s)", deadline => {
    const f = fixture(); occupy(f);
    f.state.patientAmenityTrips![0]!.dwellEndsAtFacilityTick = deadline;
    f.state.facilityTick += PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.environment.idleActionMaximumMinutes + 1;
    tickAmenities(f.state);
    expect(f.state.patientAmenityTrips![0]?.status).toBe("returning");
    tickAmenities(f.state, 60);
    expect(f.state.patientAmenityTrips).toEqual([]);
    expect(location(f.state, f)).not.toEqual(f.inside);
  });

  it.each(["visitor", "encounter"] as const)("repairs an orphaned %s on the first tick after snapshot reopen", kind => {
    const f = fixture(kind); occupy(f);
    f.state.patientAmenityTrips![0]!.path = [{ x: 1, y: 1 }, { x: 4, y: 4 }];
    // Legacy normalization discards the malformed trip, retaining the visible actor.
    if (kind === "visitor") { f.operation.path = [f.inside]; f.operation.pathIndex = 0; }
    let state = deserializeGameState(serializeGameState(f.state));
    expect(state.patientAmenityTrips).toEqual([]);
    expect(location(state, f)).toEqual(f.inside);
    state = gameReducer(state, { type: "ADVANCE_TICK", operationId: "restroom.reopen.repair" });
    expect(location(state, f)).not.toEqual(f.inside);
    expect(location(state, f)?.x).toBeLessThan(33);
  });

  it.each(["visitor", "encounter", "routine"] as const)("recovers a %s whose bathroom was sold immediately before reopen", kind => {
    const initial = fixture(kind === "routine" ? "encounter" : kind);
    let state = initial.state;
    for (let i = 0; i < 25; i++) state = gameReducer(state, { type: "ADVANCE_TICK", operationId: `restroom.sold.seat.${i}` });
    const f = { ...initial, state, operation: state.serviceOperations.find(op => op.id === initial.operation.id)! };
    if (kind === "routine") state.serviceOperations = [];
    occupy(f);
    state.rooms = state.rooms.filter(room => room.id !== "bathroom");
    state.doors = state.doors.filter(door => door.roomId !== "bathroom");
    state = deserializeGameState(serializeGameState(state));
    expect(state.patientAmenityTrips).toEqual([]);
    for (let i = 0; i < 60; i++) state = gameReducer(state, { type: "ADVANCE_TICK", operationId: `restroom.sold.return.${i}` });
    expect(location(state, f)).not.toEqual(f.inside);
    expect(location(state, f)?.x).toBeLessThan(33);
  });

  it.each(["visitor", "encounter"] as const)("evacuates a %s when its bathroom door is removed", kind => {
    const f = fixture(kind); occupy(f);
    f.state.doors = f.state.doors.filter(door => door.id !== "bathroom.west");
    tickAmenities(f.state);
    expect(location(f.state, f)).not.toEqual(f.inside);
    expect(f.state.patientAmenityTrips).toEqual([]);
  });

  it.each(["completed", "cancelled"] as const)("releases an occupied bathroom after a visitor operation is %s", status => {
    const f = fixture(); occupy(f);
    f.operation.status = status;
    tickAmenities(f.state);
    expect(f.state.patientAmenityTrips).toEqual([]);
    expect(location(f.state, f)).not.toEqual(f.inside);
  });

  it.each(["completed", "walkout"] as const)("releases an occupied bathroom after a patient is resolved by %s", resolution => {
    const f = fixture("encounter"); occupy(f);
    f.operation.status = "cancelled";
    const encounter = f.state.encounters[f.actorId]!;
    encounter.lifecycle = "resolved"; encounter.resolutionReason = resolution;
    tickAmenities(f.state);
    expect(f.state.patientAmenityTrips).toEqual([]);
    expect(location(f.state, f)).not.toEqual(f.inside);
    expect(f.state.encounters[f.actorId]?.patientMovement?.kind).toBe(resolution === "walkout" ? "leaving_after_walkout" : "leaving_after_resolution");
  });

  it("yields bathroom movement ownership to a committed walkout instead of pulling the patient back", () => {
    const f = fixture("encounter"); occupy(f);
    f.operation.status = "cancelled";
    const encounter = f.state.encounters[f.actorId]!;
    const path = findRouteFromDisplacedLocationOffscreen(f.state, PROTOTYPE_DOMAIN_CONTEXT, f.inside);
    expect(path.length).toBeGreaterThan(1);
    encounter.patientMovement = { kind: "leaving_after_walkout", path, pathIndex: 0,
      lastMovedAtFacilityTick: f.state.facilityTick, destinationRoomInstanceId: null };
    tickAmenities(f.state);
    expect(f.state.patientAmenityTrips).toEqual([]);
    expect(encounter.patientMovement.path).toEqual(path);
    let state = f.state;
    for (let i = 0; i < 60 && state.encounters[encounter.id]?.patientLocation; i++) state = gameReducer(state,
      { type: "ADVANCE_TICK", operationId: `restroom.walkout.${i}` });
    expect(state.encounters[encounter.id]).toMatchObject({ patientLocation: null, resolutionReason: "walkout" });
  });

  it("keeps service-queue movement paused during a bounded bathroom trip, then walks to the freed service room", () => {
    const f = fixture();
    let state = f.state;
    for (let i = 0; i < 25; i++) state = gameReducer(state, { type: "ADVANCE_TICK", operationId: `restroom.queue.seat.${i}` });
    const origin = { ...location(state, f)! };
    expect(origin.x).toBeLessThan(33);
    expect(tryStartPatientBathroomTrip(state, f.actorKind, f.actorId, PROTOTYPE_DOMAIN_CONTEXT)).toBe(true);
    releaseBusyRoom(state);
    for (let i = 0; i < 100 && state.serviceOperations.find(op => op.id === f.actorId)?.status !== "in_service"; i++) {
      state = gameReducer(state, { type: "ADVANCE_TICK", operationId: `restroom.queue.return.${i}` });
      if (state.patientAmenityTrips?.length) expect(state.serviceOperations.find(op => op.id === f.actorId)?.status).toBe("waiting_for_resources");
    }
    expect(state.patientAmenityTrips).toEqual([]);
    expect(state.serviceOperations.find(op => op.id === f.actorId)).toMatchObject({ status: "in_service", reservedRoomInstanceIds: ["service"] });
  });

  it("repairs an orphaned pediatric pair together without starting an independent bathroom visit", () => {
    const f = fixture("encounter");
    const child = f.state.encounters[f.actorId]!;
    child.frozenCase.pediatricProfile = structuredClone(PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.find(row => row.pediatricProfile)!.pediatricProfile!);
    child.frozenCase.prototypeDemographics = { ageYears: 9, sexLabel: "Female" };
    child.frozenCase.prototypeVitalSigns = undefined;
    child.frozenCase.approvedInstantiationProfiles = undefined;
    child.frozenCase.selectedInstantiationProfileId = undefined;
    child.frozenCase.patientPresentationRevision = undefined;
    const family = createPediatricFamily(f.state, child, "encounter");
    const parent = f.state.retailExternalActors.find(actor => actor.id === family.parentActorId)!;
    parent.location = f.inside; parent.path = [f.inside]; parent.pathIndex = 0;
    child.patientLocation = f.inside;
    f.operation.location = f.inside; f.operation.path = [f.inside]; f.operation.pathIndex = 0;
    let state = gameReducer(deserializeGameState(serializeGameState(f.state)), { type: "ADVANCE_TICK", operationId: "restroom.parent.repair" });
    expect(state.retailExternalActors.find(actor => actor.id === parent.id)?.location).not.toEqual(f.inside);
    expect(state.patientAmenityTrips).toEqual([]);
    expect(state.encounters[child.id]?.patientLocation).not.toEqual(f.inside);
    expect(state.retailExternalActors.find(actor => actor.id === parent.id)?.location).toEqual(state.encounters[child.id]?.patientLocation);
    for (let i = 0; i < 30; i++) state = gameReducer(state, { type: "ADVANCE_TICK", operationId: `restroom.pair.seat.${i}` });
    expect(state.pediatricFamilies![family.id]!.reservation).not.toBeNull();
    expect(state.retailExternalActors.find(actor => actor.id === parent.id)?.location).not.toEqual(state.encounters[child.id]?.patientLocation);
  });
});
