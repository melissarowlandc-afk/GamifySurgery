import { describe, expect, it } from "vitest";
import { advanceServiceOperations, deserializeGameState, gameReducer, getRoomDefinition, getRoomWaitingAnchors,
  PROTOTYPE_DOMAIN_CONTEXT, selectWaitingDestinationForTesting, serializeGameState, startServiceOperation,
  pediatricFamilyForActor, type GameState } from "../src";
import { chooseWaitingAreaDestination, serviceWaitingPointKind } from "../src/waiting-destinations";
import { createPediatricAppointmentsQaState } from "../../../tests/fixtures/pediatric-appointments";
import { createLevelFourRoomsQaContext } from "../../../tests/fixtures/level-four-rooms";
import { releaseBusyRoom, serviceQueueFixture } from "./service-queue-waiting.fixture";

let sequence = 0;
const tick = (state: GameState) => gameReducer(state, { type: "ADVANCE_TICK", operationId: `service.waiting.tick.${sequence++}` });
const operation = (state: GameState) => state.serviceOperations.find((candidate) => candidate.id === "queued")!;

describe("service queues use shared waiting areas", () => {
  // The room requirement, rather than a service ID allowlist, drives dispatch.
  for (const room of ["room.ultrasound", "room.xray", "room.ct", "room.mri", "room.phlebotomy", "room.laboratory",
    "room.endoscopy", "room.minor_procedure", "room.pediatric_examination", "room.wound_ostomy", "room.examination",
    "room.ambulatory_or", "room.periop_recovery", "room.glp1_telehealth_suite", "room.pharmacy"]) {
    for (const actorKind of ["visitor", "encounter"] as const) {
      it(`${room}: ${actorKind} queues in a seat and walks from that seat when the room frees`, () => {
        let { state, checkIn } = serviceQueueFixture(room, actorKind);
        state = tick(state);
        const target = actorKind === "visitor" ? operation(state).path.at(-1)! : state.encounters["waiting.actor"]!.waitingDestination!.location;
        const waiting = state.rooms.find((candidate) => candidate.id === "waiting")!;
        expect(getRoomWaitingAnchors(waiting, getRoomDefinition("room.waiting")!)).toContainEqual(target);
        expect(target).not.toEqual(checkIn);
        for (let count = 0; count < 30 && (actorKind === "visitor" ? operation(state).pathIndex < operation(state).path.length - 1
          : state.encounters["waiting.actor"]!.patientMovement !== null); count++) state = tick(state);
        expect(operation(state).status).toBe("waiting_for_resources");
        expect(operation(state).location).toEqual(target);
        expect(operation(state).reservedRoomInstanceIds).toEqual([]);
        state = deserializeGameState(serializeGameState(state));
        releaseBusyRoom(state);
        state = tick(state);
        expect(operation(state)).toMatchObject({ status: "walking_to_service", reservedRoomInstanceIds: ["service"] });
        expect(operation(state).path[0]).toEqual(target);
        for (let count = 0; count < 30 && operation(state).status !== "in_service"; count++) state = tick(state);
        expect(operation(state).status).toBe("in_service");
        expect(serviceWaitingPointKind(state, PROTOTYPE_DOMAIN_CONTEXT, target)).toBe("chair");
      });
    }
  }

  it("reserves distinct chairs across visitors and exam-room waiters, including in-flight endpoints", () => {
    const { state, operation: first } = serviceQueueFixture();
    const second = { ...structuredClone(first), id: "queued.second", actorId: "second.actor" };
    state.serviceOperations.push(second);
    state.facilityTick++;
    advanceServiceOperations(state, PROTOTYPE_DOMAIN_CONTEXT);
    expect(first.path.at(-1)).not.toEqual(second.path.at(-1));
    // Use the ordinary initial encounter; this is seating only, with no case edits.
    const initial = serviceQueueFixture("room.ultrasound", "encounter").state.encounters["waiting.actor"]!;
    state.encounters.exam = { ...initial, id: "exam", lifecycle: "waiting_unopened" };
    const exam = selectWaitingDestinationForTesting(state, PROTOTYPE_DOMAIN_CONTEXT, "exam")!;
    expect(exam.reservation?.location).not.toEqual(first.path.at(-1));
    expect(exam.reservation?.location).not.toEqual(second.path.at(-1));
  });

  it("uses standing space inside the waiting room when every visible seat is reserved", () => {
    const { state, operation: queued } = serviceQueueFixture();
    const room = state.rooms.find((candidate) => candidate.id === "waiting")!;
    for (const [index, anchor] of getRoomWaitingAnchors(room, getRoomDefinition("room.waiting")!).entries()) {
      state.serviceOperations.push({ ...structuredClone(queued), id: `chair.${index}`, actorId: `seated.${index}`, location: anchor, path: [anchor] });
    }
    const destination = chooseWaitingAreaDestination(state, PROTOTYPE_DOMAIN_CONTEXT, { kind: "service_visitor", id: queued.id, location: queued.location }, true);
    expect(destination.reservation).toMatchObject({ roomInstanceId: "waiting", kind: "standing" });
  });

  it("uses a hallway without a waiting room, then moves to a newly available chair", () => {
    let { state, checkIn } = serviceQueueFixture();
    const waiting = state.rooms.find((room) => room.id === "waiting")!;
    const door = state.doors.find((candidate) => candidate.roomId === "waiting")!;
    state.rooms = state.rooms.filter((room) => room.id !== "waiting");
    state.doors = state.doors.filter((candidate) => candidate.roomId !== "waiting");
    state = tick(state);
    const endpoint = operation(state).path.at(-1)!;
    expect(state.rooms.some((room) => room.roomDefinitionId === "room.hallway" && room.x === endpoint.x && room.y === endpoint.y)).toBe(true);
    expect(endpoint).not.toEqual(checkIn);
    for (let count = 0; count < 20; count++) state = tick(state);
    state.rooms.push(waiting); state.doors.push(door);
    state = tick(state);
    expect(getRoomWaitingAnchors(waiting, getRoomDefinition("room.waiting")!)).toContainEqual(operation(state).path.at(-1));
  });

  it("keeps check-in clear even when no reachable indoor overflow exists", () => {
    let { state, checkIn } = serviceQueueFixture();
    state.rooms = state.rooms.filter((room) => room.roomDefinitionId === "room.front_desk");
    state.doors = state.doors.filter((door) => door.exterior);
    state = tick(state);
    expect(operation(state).path.at(-1)).not.toEqual(checkIn);
    expect(operation(state).path.at(-1)!.y).toBe(PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility.gridHeight);
    expect(Math.abs(operation(state).path.at(-1)!.x - checkIn.x)).toBeGreaterThanOrEqual(2);
  });

  it.each(["visitor", "encounter"] as const)("repairs a legacy %s desk queue on the next loaded tick without changing the format", (actorKind) => {
    const fixture = serviceQueueFixture("room.ultrasound", actorKind);
    let state = deserializeGameState(serializeGameState(fixture.state));
    state = tick(state);
    const destination = actorKind === "visitor" ? operation(state).path.at(-1) : state.encounters["waiting.actor"]!.waitingDestination?.location;
    expect(destination).toBeDefined();
    expect(destination).not.toEqual(fixture.checkIn);
    expect(deserializeGameState(serializeGameState(state)).serviceOperations.find((candidate) => candidate.id === "queued")?.path)
      .toEqual(operation(state).path);
  });

  it("reseats the legacy pending-result resource queue without changing its frozen order", () => {
    let { state, checkIn } = serviceQueueFixture("room.ultrasound", "encounter");
    const encounter = state.encounters["waiting.actor"]!;
    state.serviceOperations = [];
    encounter.lifecycle = "active_pending_result";
    encounter.resolvedAtFacilityTick = null;
    encounter.resolutionReason = null;
    encounter.pendingResult = {
      operationId: "legacy.result", gateId: "legacy.gate", originatingNodeIndex: 0,
      resultTypeId: "service.ultrasound", pendingLabel: "Waiting", resultNarrative: "Ready",
      routeId: "route.ultrasound.in_house", routeDisplayName: "Ultrasound", scheduledAtTick: 0,
      serviceDurationTicks: 75, durationTicks: 0, dueTick: 0, deliveredAtTick: null,
      offsiteReturnStartedAtTick: null, offsiteTravel: null, patientTravel: null, patientRemainsOnsite: true,
      timingPhases: [], resourceReservations: [],
      resourceQueue: { version: "onsite-resource-queue.v1", status: "waiting_for_resources", serviceId: "service.ultrasound",
        routeId: "route.ultrasound.in_house", allowedRouteIds: ["route.ultrasound.in_house"], queuedAtTick: 0 },
    };
    state = deserializeGameState(serializeGameState(state));
    const frozen = structuredClone(state.encounters[encounter.id]!.pendingResult);
    state = tick(state);
    expect(state.encounters[encounter.id]!.waitingDestination).toMatchObject({ roomInstanceId: "waiting", kind: "chair" });
    expect(state.encounters[encounter.id]!.patientMovement?.path[0]).toEqual(checkIn);
    expect(state.encounters[encounter.id]!.pendingResult).toEqual(frozen);
  });

  it("keeps new visitors' first journey at check-in", () => {
    const { state, checkIn } = serviceQueueFixture();
    state.serviceOperations = [];
    // The normal factory, including capability/staff checks, is exercised by
    // the production service-operations suite; retain its actual arrival path.
    state.facilityLevel = 1;
    state.employees.push({ id: "imaging", staffRoleDefinitionId: "staff.imaging_technician", displayName: "Imaging staff",
      appearance: state.founder.appearance, hiredAtFacilityTick: 0, salaryPerExpenseInterval: 0, morale: 80, trainingLevel: 1,
      homeRoomInstanceId: "service", location: { x: 34, y: 21 }, path: [], pathIndex: 0, lastMovedAtFacilityTick: 0,
      lastPraisedAtFacilityTick: null, nextIdleActionAtFacilityTick: Number.MAX_SAFE_INTEGER, facilityTask: null });
    const id = startServiceOperation(state, "income.ultrasound", "visitor", PROTOTYPE_DOMAIN_CONTEXT);
    expect(id).not.toBeNull();
    expect(state.serviceOperations.find((candidate) => candidate.id === id)?.path.at(-1)).toEqual(checkIn);
    expect(state.serviceOperations.find((candidate) => candidate.id === id)?.status).toBe("arriving");
  });

  it("retains the pediatric waiting-room preference for a queued family", () => {
    const context = createLevelFourRoomsQaContext();
    let state = { ...createPediatricAppointmentsQaState(context), paused: false };
    for (let count = 0; count < 60 && !state.serviceOperations.some((candidate) => candidate.status === "waiting_for_resources"); count++) {
      state = gameReducer(state, { type: "ADVANCE_TICK", operationId: `family.wait.${count}` }, context);
    }
    const visit = state.serviceOperations.find((candidate) => candidate.status === "waiting_for_resources")!;
    const family = pediatricFamilyForActor(state, "service_visitor", visit.id)!;
    expect(family.reservation?.roomInstanceId).toBe("room.peds.wait");
    expect(family.reservation?.childLocation).not.toEqual(family.reservation?.parentLocation);
  });
});
