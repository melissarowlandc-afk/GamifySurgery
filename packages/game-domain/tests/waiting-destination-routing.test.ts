import { describe, expect, it } from "vitest";
import {
  PROTOTYPE_DOMAIN_CONTEXT,
  createInitialGameState,
  deserializeGameState,
  gameReducer,
  isRoomOperationalForFacilityWork,
  selectWaitingDestinationForTesting,
  serializeGameState,
  type GameState,
} from "../src";

function fixture(): GameState {
  const state = createInitialGameState(undefined, { campaignId: "campaign.waiting-routing", campaignSeed: "waiting-routing", createdAtRealMs: 0 });
  state.encounters = {};
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  state.rooms.push(
    { id: "waiting", roomDefinitionId: "room.waiting", x: 29, y: 28, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
    { id: "periop", roomDefinitionId: "room.periop_recovery", x: 38, y: 26, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
    { id: "hall", roomDefinitionId: "room.hallway", x: 28, y: 28, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
  );
  state.doors.push(
    { id: "waiting-east", roomId: "waiting", side: "east", offset: 1, exterior: false },
    { id: "waiting-west", roomId: "waiting", side: "west", offset: 0, exterior: false },
    { id: "periop-west", roomId: "periop", side: "west", offset: 2, exterior: false },
  );
  return state;
}

function addEncounter(state: GameState, id: string) {
  const sample = Object.values(createInitialGameState().encounters)[0]!;
  state.encounters[id] = { ...(JSON.parse(JSON.stringify(sample)) as typeof sample), id, checkInStatus: "checked_in", lifecycle: "waiting_unopened", patientLocation: { x: 35, y: 31 }, patientMovement: null, waitingDestination: null, assignedRoomInstanceId: "room.instance.founder_desk" };
  return state.encounters[id]!;
}

describe("waiting destination routing acceptance", () => {
  it("skips a Waiting Room reachable only through a protected care room when allocating from the street", () => {
    const state = fixture();
    state.rooms.push({ id: "a-waiting-through-periop", roomDefinitionId: "room.waiting", x: 44, y: 26, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 });
    state.doors.push({ id: "periop-east-for-waiting", roomId: "periop", side: "east", offset: 2, exterior: false });
    expect(isRoomOperationalForFacilityWork(state, "a-waiting-through-periop")).toBe(true);
    const arriving = addEncounter(state, "encounter.public-arrival");
    arriving.patientLocation = { x: -2, y: PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility.gridHeight };
    const destination = selectWaitingDestinationForTesting(state, PROTOTYPE_DOMAIN_CONTEXT, arriving.id)!;
    expect(destination.reservation?.roomInstanceId).toBe("waiting");
    expect(destination.path.at(-1)).toEqual(destination.reservation?.location);
  });

  it("uses free chairs in a second reachable Waiting Room before any standing overflow", () => {
    const state = fixture();
    state.rooms.push({ id: "waiting-second", roomDefinitionId: "room.waiting", x: 24, y: 28, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 });
    for (const y of [29, 30]) state.rooms.push({ id: `hall-second-${y}`, roomDefinitionId: "room.hallway", x: 28, y, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 });
    state.doors.push({ id: "waiting-second-east", roomId: "waiting-second", side: "east", offset: 2, exterior: false }, { id: "waiting-west-clear", roomId: "waiting", side: "west", offset: 2, exterior: false });
    for (const [index, location] of [{ x: 30, y: 28 }, { x: 31, y: 28 }, { x: 29, y: 29 }].entries()) {
      const seated = addEncounter(state, `encounter.first-room.${index}`);
      seated.patientLocation = location;
      seated.waitingDestination = { roomInstanceId: "waiting", location, kind: "chair" };
      seated.assignedRoomInstanceId = "waiting";
    }
    const next = addEncounter(state, "encounter.second-room");
    expect(selectWaitingDestinationForTesting(state, PROTOTYPE_DOMAIN_CONTEXT, next.id)?.reservation).toEqual({
      roomInstanceId: "waiting-second", location: { x: 25, y: 28 }, kind: "chair",
    });
  });

  it("reseats an onsite external-result waiter into a second room without changing frozen timing", () => {
    let state = fixture();
    state.rooms.push({ id: "waiting-second", roomDefinitionId: "room.waiting", x: 24, y: 28, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 });
    for (const y of [29, 30]) state.rooms.push({ id: `hall-second-${y}`, roomDefinitionId: "room.hallway", x: 28, y, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 });
    state.doors.push({ id: "waiting-second-east", roomId: "waiting-second", side: "east", offset: 2, exterior: false }, { id: "waiting-west-clear", roomId: "waiting", side: "west", offset: 2, exterior: false });
    for (const [index, location] of [{ x: 30, y: 28 }, { x: 31, y: 28 }, { x: 29, y: 29 }].entries()) {
      const seated = addEncounter(state, `encounter.first-room-pending.${index}`);
      seated.patientLocation = location;
      seated.waitingDestination = { roomInstanceId: "waiting", location, kind: "chair" };
      seated.assignedRoomInstanceId = "waiting";
    }
    const waiting = addEncounter(state, "encounter.external-result");
    waiting.lifecycle = "active_pending_result";
    waiting.assignedRoomInstanceId = "waiting";
    waiting.patientLocation = { x: 30, y: 30 };
    waiting.waitingDestination = { roomInstanceId: "waiting", location: { x: 30, y: 30 }, kind: "standing" };
    waiting.pendingResult = {
      operationId: "pending.external-result", gateId: "gate.external-result", originatingNodeIndex: 0,
      resultTypeId: "service.basic_labs", pendingLabel: "Waiting", resultNarrative: "Ready",
      routeId: "route.basic_labs.external", routeDisplayName: "External", scheduledAtTick: 0,
      serviceDurationTicks: 500, durationTicks: 500, dueTick: 500, deliveredAtTick: null,
      offsiteReturnStartedAtTick: null, offsiteTravel: null, patientTravel: null, patientRemainsOnsite: true,
      externalProcessingOnly: true,
      timingPhases: [{ id: "external", durationTicks: 500, resourceBound: false, startsAtTick: 0, endsAtTick: 500 }],
    };
    const frozen = JSON.parse(JSON.stringify(waiting.pendingResult));
    state = gameReducer(state, { type: "ADVANCE_TICK", operationId: "second-room.reseat" });
    expect(state.encounters[waiting.id]!.waitingDestination).toEqual({
      roomInstanceId: "waiting-second", location: { x: 25, y: 28 }, kind: "chair",
    });
    expect(state.encounters[waiting.id]!.patientMovement?.kind).toBe("idle_within_room");
    expect(state.encounters[waiting.id]!.pendingResult).toEqual(frozen);
  });

  it("reseats a resolved patient waiting for procedure resources in the second room", () => {
    let state = fixture();
    state.rooms.push({ id: "waiting-second", roomDefinitionId: "room.waiting", x: 24, y: 28, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 });
    for (const y of [29, 30]) state.rooms.push({ id: `hall-second-${y}`, roomDefinitionId: "room.hallway", x: 28, y, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 });
    state.doors.push({ id: "waiting-second-east", roomId: "waiting-second", side: "east", offset: 2, exterior: false }, { id: "waiting-west-clear", roomId: "waiting", side: "west", offset: 2, exterior: false });
    for (const [index, location] of [{ x: 30, y: 28 }, { x: 31, y: 28 }, { x: 29, y: 29 }].entries()) {
      const seated = addEncounter(state, `encounter.first-room-queue.${index}`);
      seated.patientLocation = location;
      seated.waitingDestination = { roomInstanceId: "waiting", location, kind: "chair" };
      seated.assignedRoomInstanceId = "waiting";
    }
    const queued = addEncounter(state, "encounter.standing-queue");
    queued.lifecycle = "resolved";
    queued.assignedRoomInstanceId = "waiting";
    queued.patientLocation = { x: 30, y: 30 };
    queued.waitingDestination = { roomInstanceId: "waiting", location: { x: 30, y: 30 }, kind: "standing" };
    state.serviceOperations.push({
      id: "service-operation.standing-queue", incomeLineId: "income.procedure.image_guided_breast_abscess_aspiration", catalogVersion: 1,
      actorKind: "encounter", actorId: queued.id, displayName: queued.patientDisplayName, appearance: queued.patientAppearance,
      status: "waiting_for_resources", createdAtFacilityTick: 0, waitDeadlineFacilityTick: 60,
      startedAtFacilityTick: null, completedAtFacilityTick: null, cancelledAtFacilityTick: null,
      quoteFee: 0, phaseIndex: 0, phaseStartedAtFacilityTick: null, phaseEndsAtFacilityTick: null,
      reservedRoomInstanceIds: [], reservedEmployeeIds: [], providerReservation: null,
      location: { ...queued.patientLocation }, path: [], pathIndex: 0, lastMovedAtFacilityTick: 0,
      cancellationReason: null, resourceQueueVersion: 1,
    });
    state = gameReducer(state, { type: "ADVANCE_TICK", operationId: "second-room.queued-reseat" });
    expect(state.encounters[queued.id]!.waitingDestination).toEqual({ roomInstanceId: "waiting-second", location: { x: 25, y: 28 }, kind: "chair" });
    expect(state.encounters[queued.id]!.patientMovement?.kind).toBe("idle_within_room");
    expect(state.serviceOperations[0]).toMatchObject({ status: "waiting_for_resources", startedAtFacilityTick: null, phaseIndex: 0, reservedRoomInstanceIds: [] });
  });

  it("A: reserves indoor preferences in hierarchy order without a sidewalk overflow", () => {
    const state = fixture();
    const keys = new Set<string>();
    const picks = [] as NonNullable<ReturnType<typeof selectWaitingDestinationForTesting>>[];
    for (let index = 0; index < 12; index += 1) {
      const encounter = addEncounter(state, `encounter.hierarchy.${index}`);
      const destination = selectWaitingDestinationForTesting(state, PROTOTYPE_DOMAIN_CONTEXT, encounter.id)!;
      picks.push(destination);
      encounter.waitingDestination = destination.reservation;
      expect(destination.reservation).not.toBeNull();
      const point = destination.reservation!.location;
      expect(point.y).toBeLessThan(PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility.gridHeight);
      expect(keys.has(`${point.x},${point.y}`)).toBe(false);
      keys.add(`${point.x},${point.y}`);
    }
    expect(picks.slice(0, 3).map((pick) => pick.reservation)).toEqual([
      { roomInstanceId: "waiting", location: { x: 30, y: 28 }, kind: "chair" },
      { roomInstanceId: "waiting", location: { x: 31, y: 28 }, kind: "chair" },
      { roomInstanceId: "waiting", location: { x: 29, y: 29 }, kind: "chair" },
    ]);
    expect(picks[3]!.reservation).toEqual({ roomInstanceId: "room.instance.founder_desk", location: { x: 37, y: 31 }, kind: "chair" });
    expect(picks[4]!.reservation).toEqual({ roomInstanceId: "room.instance.founder_desk", location: { x: 36, y: 31 }, kind: "standing" });
    expect(picks.slice(5).every((pick) =>
      pick.reservation?.roomInstanceId === "waiting" &&
      pick.reservation.kind === "standing",
    )).toBe(true);
    expect(picks.some((pick) => pick.reservation?.roomInstanceId === "periop")).toBe(false);
  });

  it("B: sequential check-in-equivalent selections never duplicate persisted reservations", () => {
    const state = fixture();
    for (let index = 0; index < 12; index += 1) {
      const encounter = addEncounter(state, `encounter.unique.${index}`);
      encounter.waitingDestination = selectWaitingDestinationForTesting(state, PROTOTYPE_DOMAIN_CONTEXT, encounter.id)!.reservation;
    }
    const keys = Object.values(state.encounters).map((encounter) => `${encounter.waitingDestination!.location.x},${encounter.waitingDestination!.location.y}`);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("C: stationary reservations persist while public wander reservations serialize", () => {
    const state = fixture();
    const chair = addEncounter(state, "encounter.chair");
    chair.waitingDestination = { roomInstanceId: "waiting", location: { x: 30, y: 28 }, kind: "chair" };
    const standing = addEncounter(state, "encounter.standing");
    standing.waitingDestination = { roomInstanceId: "waiting", location: { x: 32, y: 28 }, kind: "standing" };
    const wander = addEncounter(state, "encounter.wander");
    wander.waitingDestination = { roomInstanceId: "hall", location: { x: 28, y: 28 }, kind: "public_wander" };
    chair.assignedRoomInstanceId = "waiting";
    standing.assignedRoomInstanceId = "waiting";
    wander.assignedRoomInstanceId = "hall";
    chair.patientLocation = { x: 30, y: 28 };
    standing.patientLocation = { x: 32, y: 28 };
    wander.patientLocation = { x: 28, y: 28 };
    chair.nextIdleActionAtFacilityTick = 0;
    standing.nextIdleActionAtFacilityTick = 0;
    wander.nextIdleActionAtFacilityTick = 0;
    // Owner rule (2026-10-07): standing and hallway patients take a free
    // chair, so every chair is filled to exercise the idle contract alone.
    for (const [index, seat] of [
      { roomInstanceId: "waiting", location: { x: 31, y: 28 } },
      { roomInstanceId: "waiting", location: { x: 29, y: 29 } },
      { roomInstanceId: "waiting", location: { x: 32, y: 29 } },
      { roomInstanceId: "room.instance.founder_desk", location: { x: 37, y: 31 } },
    ].entries()) {
      const seated = addEncounter(state, `encounter.full.${index}`);
      seated.waitingDestination = { ...seat, kind: "chair" };
      seated.patientLocation = { ...seat.location };
      seated.assignedRoomInstanceId = seat.roomInstanceId;
      seated.nextIdleActionAtFacilityTick = Number.MAX_SAFE_INTEGER;
    }
    const eagerContext = JSON.parse(JSON.stringify(PROTOTYPE_DOMAIN_CONTEXT)) as typeof PROTOTYPE_DOMAIN_CONTEXT;
    eagerContext.balanceRelease.environment.idleActionChancePercent = 100;
    const advanced = gameReducer(state, { type: "ADVANCE_TICK", operationId: "wander.advance" }, eagerContext);
    expect(advanced.encounters[chair.id]!.patientLocation).toEqual({ x: 30, y: 28 });
    expect(advanced.encounters[chair.id]!.patientMovement).toBeNull();
    expect(advanced.encounters[standing.id]!.patientLocation).toEqual({ x: 32, y: 28 });
    expect(advanced.encounters[standing.id]!.patientMovement).toBeNull();
    expect(advanced.encounters[wander.id]!.waitingDestination).toMatchObject({ kind: "public_wander" });
    const wanderMovement = advanced.encounters[wander.id]!.patientMovement;
    if (wanderMovement) {
      expect(wanderMovement.path[0]).toEqual({ x: 28, y: 28 });
      expect(wanderMovement.path.at(-1)).toEqual(advanced.encounters[wander.id]!.waitingDestination?.location);
    }
    const restored = deserializeGameState(serializeGameState(advanced));
    expect(restored.encounters[chair.id]!.waitingDestination).toEqual(advanced.encounters[chair.id]!.waitingDestination);
    expect(restored.encounters[standing.id]!.waitingDestination).toEqual(advanced.encounters[standing.id]!.waitingDestination);
    expect(restored.encounters[wander.id]!.waitingDestination).toEqual(advanced.encounters[wander.id]!.waitingDestination);
  });

  it("keeps a resolved terminal-procedure queue reservation occupied", () => {
    const state = fixture();
    const terminal = addEncounter(state, "encounter.terminal-queue");
    terminal.lifecycle = "resolved";
    terminal.waitingDestination = {
      roomInstanceId: "waiting",
      location: { x: 30, y: 28 },
      kind: "chair",
    };
    terminal.patientLocation = { x: 30, y: 28 };
    state.serviceOperations.push({
      id: "service-operation.terminal-queue",
      incomeLineId: "income.procedure.image_guided_breast_abscess_aspiration",
      catalogVersion: 1,
      actorKind: "encounter",
      actorId: terminal.id,
      displayName: terminal.patientDisplayName,
      appearance: terminal.patientAppearance,
      status: "waiting_for_resources",
      createdAtFacilityTick: state.facilityTick,
      waitDeadlineFacilityTick: state.facilityTick + 60,
      startedAtFacilityTick: null,
      completedAtFacilityTick: null,
      cancelledAtFacilityTick: null,
      quoteFee: 0,
      phaseIndex: 0,
      phaseStartedAtFacilityTick: null,
      phaseEndsAtFacilityTick: null,
      reservedRoomInstanceIds: [],
      reservedEmployeeIds: [],
      providerReservation: null,
      location: { ...terminal.patientLocation },
      path: [],
      pathIndex: 0,
      lastMovedAtFacilityTick: state.facilityTick,
      cancellationReason: null,
      resourceQueueVersion: 1,
    });
    const next = addEncounter(state, "encounter.after-terminal-queue");
    const destination = selectWaitingDestinationForTesting(
      state,
      PROTOTYPE_DOMAIN_CONTEXT,
      next.id,
    )!;
    expect(destination.reservation?.location).not.toEqual({ x: 30, y: 28 });
  });
});
