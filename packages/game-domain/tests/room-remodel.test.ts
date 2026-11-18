import { describe, expect, it } from "vitest";
import { APPROVED_LEVEL5_SUPPORT_ROUTES } from "@gamify-surgery/balance-config";
import { pediatricSupportLocation } from "../src/pediatric-family";
import { createInitialGameState, gameReducer, getRoomDefinition, getRoomNavigableTiles,
  PROTOTYPE_DOMAIN_CONTEXT as context, validateRoomRemodelPlan, serializeGameState, deserializeGameState,
  createGameEvidenceCheckpoint, applyGameEvidenceCommand, importGameEvidence,
  getLevelFiveSupportTarget, findLevelFiveSupportExitPath, getRoomNavigationAnchor, createLevelFiveState,
  type GameCommand, type GameState, type PlacedRoom, type RoomRemodelStep, type ServiceOperationState } from "../src";

function fixture() {
  const state = createInitialGameState(undefined, { campaignId: "campaign.remodel", campaignSeed: "remodel", createdAtRealMs: 0 });
  const patient = structuredClone(Object.values(state.encounters)[0]!);
  state.encounters = {}; state.openChartEncounterId = null; state.attendedEncounterId = null;
  state.rooms.push(...[15, 25].map((x, i): PlacedRoom => ({ id: `remodel.${i}`, roomDefinitionId: "room.waiting", x, y: 20,
    orientation: 0, doorSide: "south", upgradeLevel: 1, cleanliness: 100 })));
  for (const room of state.rooms.filter(room => room.id.startsWith("remodel."))) state.doors.push({ id: `door.${room.id}`, roomId: room.id, side: "south", offset: 1, exterior: false });
  const room = state.rooms.find(row => row.id === "remodel.0")!;
  const definition = getRoomDefinition(room.roomDefinitionId)!;
  const start = getRoomNavigableTiles(room, definition, state.doors)[0]!;
  state.employees.push({ id: "employee.remodel", staffRoleDefinitionId: "staff.receptionist", displayName: "Synthetic", appearance: state.founder.appearance,
    hiredAtFacilityTick: 0, salaryPerExpenseInterval: 0, morale: 100, trainingLevel: 1, homeRoomInstanceId: null,
    location: start, path: [], pathIndex: 0, lastMovedAtFacilityTick: 0, lastPraisedAtFacilityTick: null, nextIdleActionAtFacilityTick: 0 });
  return { state, room, start, patient, definition };
}
const move = (state: GameState, roomId = "remodel.0", x = 35, y = 20) => gameReducer(state, { type: "MOVE_ROOM", operationId: "move", roomId, x, y });
const plan = (state: GameState, rooms: RoomRemodelStep[]) => gameReducer(state, { type: "APPLY_REMODEL_PLAN", operationId: "remodel", rooms });
function assertInside(state: GameState, point: { x: number; y: number }, id = "remodel.0") {
  const room = state.rooms.find(row => row.id === id)!, definition = getRoomDefinition(room.roomDefinitionId)!;
  expect(getRoomNavigableTiles(room, definition, state.doors, state.rooms, getRoomDefinition)).toContainEqual(point);
}

describe("room carries contents and atomic blueprint", () => {
  it("moves assigned idle staff after reentering Build Mode without detaching their home", () => {
    const { state, room, start } = fixture(), employee = state.employees[0]!;
    employee.homeRoomInstanceId = room.id; employee.location = start; employee.path = []; employee.facilityTask = null;
    const before = structuredClone(state), next = move(state);
    expect(next.operationReceipts.move?.status).toBe("applied");
    expect(next.employees[0]!.homeRoomInstanceId).toBe(room.id);
    expect(next.employees[0]!.location).toEqual({ x: start.x + 20, y: start.y });
    expect(next.events.at(-1)?.message).toContain("Check its doors"); expect(state).toEqual(before);
  });

  it("carries waiting patients, founder, companions and their waiting endpoints on rotation", () => {
    const { state, room, start, patient } = fixture();
    patient.lifecycle = "waiting_unopened"; patient.patientLocation = start; patient.patientMovement = null;
    patient.assignedRoomInstanceId = room.id; patient.waitingDestination = { roomInstanceId: room.id, location: start, kind: "standing" };
    state.encounters[patient.id] = patient; state.environment.founderLocation = start; state.environment.founderActivity = null;
    state.retailExternalActors.push({ id: "companion", kind: "companion", displayName: "Synthetic", appearance: patient.patientAppearance,
      linkedEncounterId: patient.id, linkedServiceOperationId: null, lifecycle: "onsite", location: start, path: [], pathIndex: 0,
      lastMovedAtFacilityTick: 0, activeRetailOperationId: null });
    const next = gameReducer(state, { type: "ROTATE_ROOM", operationId: "rotate", roomId: room.id });
    expect(next.operationReceipts.rotate?.status).toBe("applied");
    assertInside(next, next.encounters[patient.id]!.patientLocation!); assertInside(next, next.environment.founderLocation);
    expect(next.encounters[patient.id]!.waitingDestination!.location).toEqual(next.encounters[patient.id]!.patientLocation);
    expect(next.retailExternalActors[0]!.location).toEqual(next.encounters[patient.id]!.patientLocation);
    expect(next.encounters[patient.id]!.frozenCase).toEqual(patient.frozenCase);
    expect(next.doors.find(door => door.roomId === room.id)?.side).toBe("west");
  });

  it("replans an intersecting through-route and waits safely when the new layout has no reachable door", () => {
    const { state, room, start } = fixture(), employee = state.employees[0]!;
    employee.homeRoomInstanceId = null; employee.location = { x: room.x - 1, y: room.y };
    employee.path = [employee.location, start, { x: room.x + 5, y: room.y }]; employee.pathIndex = 0;
    const next = move(state);
    expect(next.operationReceipts.move?.status).toBe("applied");
    expect(next.employees[0]!.path).not.toEqual(employee.path);
    expect(next.employees[0]!.path).not.toContainEqual(start);
    expect(next.employees[0]!.location).toEqual(employee.location);
  });

  it("uses the final graph to reroute through a connected alternate hallway", () => {
    const { state } = fixture();
    const points = [{ x: 3, y: 3 }, { x: 3, y: 4 }, { x: 3, y: 5 }, { x: 2, y: 3 }, { x: 2, y: 4 }, { x: 2, y: 5 }];
    state.rooms = points.map((point, i) => ({ id: `hall.${i}`, roomDefinitionId: "room.hallway", ...point, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 }));
    state.doors = [];
    const employee = state.employees[0]!;
    employee.location = points[0]!; employee.path = points.slice(0, 3); employee.pathIndex = 0;
    const next = move(state, "hall.1", 15, 10);
    expect(next.operationReceipts.move?.status).toBe("applied");
    expect(next.employees[0]!.path).toEqual([points[0], points[3], points[4], points[5], points[2]]);
    expect(next.employees[0]!.pathIndex).toBe(0);
  });

  it("carries a paired family and keeps its child/parent reservations consistent", () => {
    const { state, room, start, patient } = fixture();
    patient.lifecycle = "waiting_unopened"; patient.patientLocation = start; patient.patientMovement = null;
    patient.assignedRoomInstanceId = room.id; state.encounters[patient.id] = patient;
    state.pediatricFamilies = { family: { version: "pediatric-family.v1", id: "family", child: { kind: "encounter", id: patient.id },
      parentActorId: "parent", phase: "waiting", reservation: { roomInstanceId: room.id, childLocation: start,
        parentLocation: start, childSeatId: null, parentSeatId: null } } };
    state.retailExternalActors.push({ id: "parent", kind: "companion", displayName: "Synthetic", appearance: patient.patientAppearance,
      linkedEncounterId: patient.id, linkedServiceOperationId: null, lifecycle: "onsite", location: start, path: [], pathIndex: 0,
      lastMovedAtFacilityTick: 0, activeRetailOperationId: null, pediatricFamilyId: "family" });
    const next = move(state); const position = { x: start.x + 20, y: start.y };
    expect(next.operationReceipts.move?.status).toBe("applied");
    expect(next.pediatricFamilies!.family!.reservation).toMatchObject({ childLocation: position, parentLocation: position, roomInstanceId: room.id });
    expect(next.encounters[patient.id]!.patientLocation).toEqual(position); expect(next.retailExternalActors[0]!.location).toEqual(position);
  });

  it("keeps a frozen test's through-route safe without restarting its accepted service work", () => {
    const { state, patient } = fixture();
    const points = [{ x: 3, y: 3 }, { x: 3, y: 4 }, { x: 3, y: 5 }, { x: 2, y: 3 }, { x: 2, y: 4 }, { x: 2, y: 5 }];
    state.rooms = points.map((point, i) => ({ id: `hall.${i}`, roomDefinitionId: "room.hallway", ...point, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 }));
    state.doors = []; patient.lifecycle = "active_pending_result"; patient.patientLocation = points[0]!;
    patient.patientMovement = { kind: "walking_to_care", path: points.slice(0, 3), pathIndex: 0, lastMovedAtFacilityTick: 0, destinationRoomInstanceId: "hall.2" };
    patient.pendingResult = { operationId: "test", gateId: "test", originatingNodeIndex: 0, resultTypeId: "test",
      pendingLabel: "test", resultNarrative: "test", routeId: "test", routeDisplayName: "test", scheduledAtTick: 0,
      serviceDurationTicks: 10, durationTicks: 14, dueTick: 14, deliveredAtTick: null, offsiteReturnStartedAtTick: null, offsiteTravel: null,
      patientTravel: { version: "patient-travel.v1", originRoomInstanceId: "hall.0", destinationRoomInstanceId: "hall.2",
        outboundPath: points.slice(0, 3), returnPath: points.slice(0, 3).reverse(), tilesPerTick: 1,
        outboundStartTick: 0, outboundArrivalTick: 2, serviceCompletionTick: 12, returnArrivalTick: 14 } };
    state.encounters[patient.id] = patient;
    const next = move(state, "hall.1", 15, 10), pending = next.encounters[patient.id]!.pendingResult!;
    expect(next.operationReceipts.move?.status).toBe("applied");
    expect(pending.patientTravel!.outboundPath).not.toContainEqual(points[1]);
    expect(pending.patientTravel!.serviceCompletionTick - pending.patientTravel!.outboundArrivalTick).toBe(10);
    expect(pending.deliveredAtTick).toBeNull(); expect(next.encounters[patient.id]!.answers).toEqual(patient.answers);
  });

  it("does not resurrect an unreachable legacy offsite departure from its stale cached route", () => {
    const { state, patient } = fixture();
    const points = [{ x: 3, y: 3 }, { x: 3, y: 4 }], outside = { x: -2, y: context.balanceRelease.facility.gridHeight };
    state.rooms = points.map((point, i) => ({ id: `hall.${i}`, roomDefinitionId: "room.hallway", ...point,
      orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 }));
    state.doors = []; patient.lifecycle = "active_pending_result"; patient.patientLocation = points[0]!;
    patient.assignedRoomInstanceId = null;
    const path = [...points, outside];
    patient.patientMovement = { kind: "departing_for_offsite_testing", path, pathIndex: 0, lastMovedAtFacilityTick: 0, destinationRoomInstanceId: null };
    patient.pendingResult = { operationId: "test", gateId: "test", originatingNodeIndex: 0, resultTypeId: "test",
      pendingLabel: "test", resultNarrative: "test", routeId: "test", routeDisplayName: "test", scheduledAtTick: 0,
      serviceDurationTicks: 10, durationTicks: 14, dueTick: 14, deliveredAtTick: null, offsiteReturnStartedAtTick: null, patientTravel: null,
      offsiteTravel: { version: "offsite-patient-travel.v1", direction: -1, outboundPath: path, returnPath: [...path].reverse(),
        tilesPerTick: 1, outboundStartTick: 0, outboundArrivalTick: 2, returnStartTick: 12, returnArrivalTick: 14 } };
    state.encounters[patient.id] = patient;
    const next = move(state, "hall.1", 15, 10), saved = next.encounters[patient.id]!;
    expect(next.operationReceipts.move?.status).toBe("applied");
    expect(saved.patientMovement).toBeNull(); expect(saved.patientLocation).toEqual(patient.patientLocation);
    // ensureLegacyOffsiteTravel retries against the current layout; the old
    // beginPendingResultTravel cache must not restart a walk through old walls.
    expect(saved.pendingResult).toEqual({ ...patient.pendingResult, offsiteTravel: null });
    expect(saved.frozenCase).toEqual(patient.frozenCase); expect(saved.answers).toEqual(patient.answers);
    expect(next.learningHistories).toEqual(state.learningHistories); expect(next.facilityTick).toBe(state.facilityTick);
  });

  it.each([0, 20])("preserves exact native furniture contacts and seated activity when translated to x=%s", x => {
    const { state } = fixture(); state.facilityLevel = 5;
    const room: PlacedRoom = { id: "native.gym", roomDefinitionId: "room.staff_gym", x: 10, y: 10, orientation: 0,
      doorSide: null, upgradeLevel: 1, cleanliness: 100 };
    state.rooms.push(room);
    const start = getLevelFiveSupportTarget(room, "benchSeat")!;
    expect(Number.isInteger(start.x) && Number.isInteger(start.y)).toBe(false);
    state.environment.founderLocation = start;
    state.environment.founderActivity = { kind: "sit_in_chair", targetId: room.id, path: [start], pathIndex: 0,
      lastMovedAtFacilityTick: state.facilityTick, workMinutesRemaining: 0, explicitSeat: true };
    const next = move(state, room.id, x, 10), moved = next.rooms.find(row => row.id === room.id)!;
    expect(next.operationReceipts.move?.status).toBe("applied");
    expect(next.environment.founderLocation).toEqual(getLevelFiveSupportTarget(moved, "benchSeat"));
    expect(next.environment.founderActivity).toMatchObject({ kind: "sit_in_chair", targetId: room.id, explicitSeat: true,
      path: [getLevelFiveSupportTarget(moved, "benchSeat")] });
  });

  it("carries a whole approved native in-room journey without abandoning the activity", () => {
    const { state } = fixture(); state.facilityLevel = 5;
    const room: PlacedRoom = { id: "native.gym", roomDefinitionId: "room.staff_gym", x: 10, y: 10, orientation: 0,
      doorSide: null, upgradeLevel: 1, cleanliness: 100 };
    state.rooms.push(room);
    const native = APPROVED_LEVEL5_SUPPORT_ROUTES["room.staff_gym"].find(row => row.targetId === "benchSeat")!.logicalPath;
    const firstInside = native.findIndex(p => p[0]! >= 0 && p[0]! < 4 && p[1]! >= 0 && p[1]! < 4);
    const remaining = native.slice(firstInside);
    expect(remaining.length).toBeGreaterThan(1);
    expect(remaining.every(p => p[0]! >= 0 && p[0]! < 4 && p[1]! >= 0 && p[1]! < 4)).toBe(true);
    const path = remaining.map(p => ({ x: room.x + p[0]!, y: room.y + p[1]! }));
    state.environment.founderLocation = path[0]!;
    state.environment.founderActivity = { kind: "walk_to_point", targetId: "native.walk", path, pathIndex: 0,
      lastMovedAtFacilityTick: 0, workMinutesRemaining: 0 };
    const next = move(state, room.id, 0, 0);
    expect(next.operationReceipts.move?.status).toBe("applied");
    expect(next.environment.founderActivity).toMatchObject({ kind: "walk_to_point", targetId: "native.walk",
      path: remaining.map(p => ({ x: p[0]!, y: p[1]! })) });
  });

  it.each(Object.keys(APPROVED_LEVEL5_SUPPORT_ROUTES))("translates every existing %s native contact to its canonical new contact", definitionId => {
    const routes = APPROVED_LEVEL5_SUPPORT_ROUTES[definitionId as keyof typeof APPROVED_LEVEL5_SUPPORT_ROUTES];
    for (const target of new Set(routes.map(row => row.targetId))) {
      const { state } = fixture(); state.facilityLevel = 5;
      const room: PlacedRoom = { id: "native.contacts", roomDefinitionId: definitionId, x: 10, y: 10, orientation: 0,
        doorSide: null, upgradeLevel: 1, cleanliness: 100 }; state.rooms.push(room);
      const point = getLevelFiveSupportTarget(room, target)!; state.environment.founderLocation = point;
      const next = move(state, room.id, 0, 0), moved = next.rooms.find(row => row.id === room.id)!;
      expect(next.operationReceipts.move?.status).toBe("applied");
      expect(next.environment.founderLocation, target).toEqual(getLevelFiveSupportTarget(moved, target));
    }
  });

  it("keeps paired pediatric seat contacts exact when moving toward the grid origin", () => {
    const { state, room, patient } = fixture(); state.facilityLevel = 4; room.roomDefinitionId = "room.pediatric_waiting";
    const child = pediatricSupportLocation(room, "bench:seat-1")!, parent = pediatricSupportLocation(room, "bench:seat-2")!;
    expect(child).not.toBeNull(); expect(parent).not.toBeNull();
    patient.lifecycle = "waiting_unopened"; patient.patientLocation = child; patient.patientMovement = null; state.encounters[patient.id] = patient;
    state.pediatricFamilies = { family: { version: "pediatric-family.v1", id: "family", child: { kind: "encounter", id: patient.id },
      parentActorId: "parent", phase: "waiting", reservation: { roomInstanceId: room.id, childLocation: child, parentLocation: parent,
        childSeatId: "bench:seat-1", parentSeatId: "bench:seat-2" } } };
    state.retailExternalActors.push({ id: "parent", kind: "companion", displayName: "Synthetic", appearance: patient.patientAppearance,
      linkedEncounterId: patient.id, linkedServiceOperationId: null, lifecycle: "onsite", location: parent, path: [], pathIndex: 0,
      lastMovedAtFacilityTick: 0, activeRetailOperationId: null, pediatricFamilyId: "family" });
    const next = move(state, room.id, 1, 1), moved = next.rooms.find(row => row.id === room.id)!;
    expect(next.operationReceipts.move?.status).toBe("applied");
    expect(next.encounters[patient.id]!.patientLocation).toEqual(pediatricSupportLocation(moved, "bench:seat-1"));
    expect(next.retailExternalActors[0]!.location).toEqual(pediatricSupportLocation(moved, "bench:seat-2"));
    expect(next.pediatricFamilies!.family!.reservation).toMatchObject({ childLocation: next.encounters[patient.id]!.patientLocation,
      parentLocation: next.retailExternalActors[0]!.location });
  });

  it("replans an existing native support exit after the whole room is moved", () => {
    const { state } = fixture(); state.facilityLevel = 5;
    const room: PlacedRoom = { id: "native.gym", roomDefinitionId: "room.staff_gym", x: 34, y: 24, orientation: 0,
      doorSide: "south", upgradeLevel: 1, cleanliness: 100 };
    state.rooms.push(room); state.doors.push({ id: "door.native", roomId: room.id, side: "south", offset: 1, exterior: false });
    const start = getLevelFiveSupportTarget(room, "benchSeat")!;
    const frontDesk = state.rooms.find(row => row.roomDefinitionId === "room.front_desk")!;
    const goal = getRoomNavigationAnchor(frontDesk, getRoomDefinition(frontDesk.roomDefinitionId)!);
    const path = findLevelFiveSupportExitPath(state, room, start, goal, context);
    expect(path.length).toBeGreaterThan(1);
    state.environment.founderLocation = start; state.environment.founderActivity = { kind: "walk_to_point", targetId: "native.exit", path,
      pathIndex: 0, lastMovedAtFacilityTick: 0, workMinutesRemaining: 0 };
    const next = move(state, room.id, 33, 24);
    expect(next.operationReceipts.move?.status).toBe("applied");
    expect(next.environment.founderActivity?.kind).toBe("walk_to_point");
    expect(next.environment.founderActivity?.path[0]).toEqual(next.environment.founderLocation);
    expect(next.environment.founderActivity?.path.at(-1)).toEqual(goal);
    expect(next.environment.founderActivity!.path.length).toBeGreaterThan(1);
  });

  it("retries a remodel-created native founder return when a disconnected room is reconnected", () => {
    const { state } = fixture(); state.facilityLevel = 5; state.levelFive = createLevelFiveState();
    const room: PlacedRoom = { id: "native.gym", roomDefinitionId: "room.staff_gym", x: 34, y: 24, orientation: 0,
      doorSide: "south", upgradeLevel: 1, cleanliness: 100 };
    state.rooms.push(room); state.doors.push({ id: "door.native", roomId: room.id, side: "south", offset: 1, exterior: false });
    const start = getLevelFiveSupportTarget(room, "benchSeat")!, frontDesk = state.rooms.find(row => row.roomDefinitionId === "room.front_desk")!;
    const goal = getRoomNavigationAnchor(frontDesk, getRoomDefinition(frontDesk.roomDefinitionId)!, "staff");
    const path = findLevelFiveSupportExitPath(state, room, start, goal, context); expect(path.length).toBeGreaterThan(1);
    state.environment.founderLocation = start; state.environment.founderActivity = { kind: "walk_to_point", targetId: "native.exit", path,
      pathIndex: 0, lastMovedAtFacilityTick: 0, workMinutesRemaining: 0 };
    // A missing saved door is genuinely unreachable. An isolated room with an
    // intact door can use the existing displaced-actor grass recovery path.
    state.doors = state.doors.filter(door => door.roomId !== room.id);
    const disconnected = move(state, room.id, 5, 5);
    expect(disconnected.environment.founderActivity).toMatchObject({ kind: "return_to_front_desk", targetId: "system.room-remodel.return", path: [] });
    const returned = gameReducer(disconnected, { type: "MOVE_ROOM", operationId: "reconnect", roomId: room.id, x: 34, y: 24 });
    const connected = gameReducer(returned, { type: "PLACE_DOOR", operationId: "reopen.door", doorId: "door.reopened", roomId: room.id, side: "south", offset: 1 });
    expect(connected.operationReceipts["reopen.door"]?.status).toBe("applied");
    connected.paused = false;
    const tick = gameReducer(connected, { type: "ADVANCE_TICK", operationId: "retry.native.return" });
    expect(tick.environment.founderActivity?.path.at(-1)).toEqual(goal);
    expect(tick.environment.founderActivity!.path.length).toBeGreaterThan(1);
    expect(tick.environment.founderLocation).not.toEqual(connected.environment.founderLocation);
  });

  it("carries cosmetic inspection actors and invalidates an unreachable old walk safely", () => {
    const { state, room, start } = fixture(); state.facilityLevel = 5; state.levelFive = createLevelFiveState();
    state.levelFive.inspectionPresentation.actors.push({ id: "inspector.synthetic", stillId: "inspector-v6f.001", phase: "walking", location: start,
      path: [start, { x: 60, y: 0 }], pathIndex: 0, lastMovedAtFacilityTick: 0, targetRoomInstanceId: null, observingUntilFacilityTick: null });
    const next = move(state), actor = next.levelFive!.inspectionPresentation.actors[0]!;
    expect(next.operationReceipts.move?.status).toBe("applied");
    expect(actor.location).toEqual({ x: start.x + 20, y: start.y });
    expect(actor.phase).toBe("stationary"); expect(actor.path).toEqual([actor.location]);
  });

  it.each(["active_action_required", "active_pending_result"] as const)("blocks genuine patient %s work", lifecycle => {
    const { state, room, start, patient } = fixture(); patient.lifecycle = lifecycle; patient.assignedRoomInstanceId = room.id; patient.patientLocation = start;
    if (lifecycle === "active_pending_result") patient.pendingResult = { operationId: "test", gateId: "test", originatingNodeIndex: 0, resultTypeId: "test",
      pendingLabel: "test", resultNarrative: "test", routeId: "test", routeDisplayName: "test", scheduledAtTick: 0,
      serviceDurationTicks: 10, durationTicks: 10, dueTick: 10, deliveredAtTick: null, offsiteReturnStartedAtTick: null,
      offsiteTravel: null, patientTravel: null, patientRemainsOnsite: true };
    state.encounters[patient.id] = patient;
    expect(move(state).operationReceipts.move).toMatchObject({ status: "rejected", message: "Wait for every character and reserved route to clear this room before moving it." });
    expect(move(state).rooms).toEqual(state.rooms);
  });

  it("blocks an in-progress service reservation even when its actor is elsewhere", () => {
    const { state, room } = fixture();
    state.serviceOperations.push({ id: "service", status: "in_service", reservedRoomInstanceIds: [room.id], location: null } as ServiceOperationState);
    expect(move(state).operationReceipts.move?.status).toBe("rejected");
  });

  it("blocks an offsite test actively leaving its origin, then allows that idle room while the patient is away", () => {
    const { state, room, start, patient } = fixture();
    patient.lifecycle = "active_pending_result"; patient.patientLocation = start; patient.assignedRoomInstanceId = room.id;
    const outside = { x: -2, y: context.balanceRelease.facility.gridHeight }, frontDesk = state.rooms.find(row => row.roomDefinitionId === "room.front_desk")!;
    const home = getRoomNavigationAnchor(frontDesk, getRoomDefinition(frontDesk.roomDefinitionId)!);
    patient.pendingResult = { operationId: "test.offsite", gateId: "test", originatingNodeIndex: 0, resultTypeId: "test",
      pendingLabel: "test", resultNarrative: "test", routeId: "test", routeDisplayName: "test", scheduledAtTick: 0,
      serviceDurationTicks: 20, durationTicks: 20, dueTick: 20, deliveredAtTick: null, offsiteReturnStartedAtTick: null, patientTravel: null,
      offsiteTravel: { version: "offsite-patient-travel.v1", direction: -1, outboundPath: [start, outside], returnPath: [outside, home],
        tilesPerTick: 1, outboundStartTick: 0, outboundArrivalTick: 2, returnStartTick: 18, returnArrivalTick: 20 } };
    state.encounters[patient.id] = patient;
    expect(move(state).operationReceipts.move?.status).toBe("rejected");
    state.facilityTick = 3; patient.patientLocation = null; patient.assignedRoomInstanceId = null; patient.patientMovement = null;
    const before = structuredClone(patient.pendingResult), next = move(state);
    expect(next.operationReceipts.move?.status).toBe("applied");
    expect(next.encounters[patient.id]!.pendingResult).toEqual(before);
    expect(next.learningHistories).toEqual(state.learningHistories);
  });

  it("retains an active terminal-order travel fence after the chart resolves, without fencing a queued forecast", () => {
    const { state, room, start, patient } = fixture();
    patient.lifecycle = "resolved_summary_available"; patient.pendingResult = null;
    // This pure predicate needs only the persisted phase execution witness;
    // it neither executes the order nor reads authored question content.
    patient.terminalTestOrder = { diagnosticTiming: { phases: [{ status: "active", kind: "patient_departure", resource: null,
      forecast: { patientPath: [start, { x: -2, y: context.balanceRelease.facility.gridHeight }] } }] } } as NonNullable<typeof patient.terminalTestOrder>;
    state.encounters[patient.id] = patient;
    expect(move(state).operationReceipts.move?.status).toBe("rejected");
    patient.terminalTestOrder.diagnosticTiming!.phases[0]!.status = "queued";
    expect(move(state).operationReceipts.move?.status).toBe("applied");
    patient.terminalTestOrder.diagnosticTiming!.phases[0]!.status = "completed";
    expect(move(state).operationReceipts.move?.status).toBe("applied");
  });

  it("swaps two staffed rooms atomically and carries from the original layout exactly once", () => {
    const { state, room, start } = fixture();
    state.employees[0]!.homeRoomInstanceId = room.id; state.employees[0]!.location = start; state.employees[0]!.path = [];
    const rooms: RoomRemodelStep[] = [{ roomId: room.id, x: 25, y: 20, orientation: 0 }, { roomId: "remodel.1", x: 15, y: 20, orientation: 0 }];
    expect(move(state, room.id, 25).operationReceipts.move?.status).toBe("rejected");
    expect(validateRoomRemodelPlan(state, rooms, context)).toEqual({ valid: true, reason: null, invalidRoomIds: [] });
    const next = plan(state, rooms); expect(next.operationReceipts.remodel?.status).toBe("applied");
    expect(next.employees[0]!.location).toEqual({ x: start.x + 10, y: start.y });
    expect(next.cashCents).toBe(state.cashCents); expect(next.facilityTick).toBe(state.facilityTick);
    expect(next.rooms.find(row => row.id === room.id)).not.toHaveProperty("roomId");
  });

  it("rejects the entire blueprint for one overlap, protected room, stale ID or malformed step", () => {
    const { state } = fixture();
    const first: RoomRemodelStep = { roomId: "remodel.0", x: 35, y: 20, orientation: 90 };
    const protectedRoom = state.rooms.find(room => context.balanceRelease.facility.protectedRoomDefinitionIds.includes(room.roomDefinitionId))!;
    for (const bad of [ { roomId: "remodel.1", x: 35, y: 20, orientation: 0 },
      { roomId: protectedRoom.id, x: protectedRoom.x + 1, y: protectedRoom.y, orientation: 0 },
      { roomId: "missing", x: 1, y: 1, orientation: 0 }, null,
      { roomId: "remodel.1", x: NaN, y: 20, orientation: 13 } ]) {
      const next = plan(state, [first, bad as RoomRemodelStep]);
      expect(next.operationReceipts.remodel?.status).toBe("rejected"); expect(next.rooms).toEqual(state.rooms);
      expect(next.employees).toEqual(state.employees); expect(next.doors).toEqual(state.doors);
    }
  });

  it("is deterministic, idempotent and replays through the existing save boundary", () => {
    const { state } = fixture();
    const command: GameCommand = { type: "APPLY_REMODEL_PLAN", operationId: "replay", rooms: [
      { roomId: "remodel.0", x: 25, y: 20, orientation: 0 }, { roomId: "remodel.1", x: 15, y: 20, orientation: 0 }] };
    const a = gameReducer(state, command), b = gameReducer(structuredClone(state), command);
    expect(a).toEqual(b); expect(gameReducer(a, command)).toBe(a);
    const restored = deserializeGameState(serializeGameState(a));
    expect(restored.rooms).toEqual(a.rooms);
    const reversed = gameReducer(state, { ...command, rooms: [...command.rooms].reverse() });
    expect(reversed).toEqual(a);
  });

  it("round-trips a blueprint rotation in the existing approved furniture orientation contract", () => {
    const { state, room, start } = fixture();
    state.employees[0]!.homeRoomInstanceId = room.id; state.employees[0]!.location = start;
    const next = plan(state, [{ roomId: room.id, x: 35, y: 20, orientation: 270 }]);
    expect(next.operationReceipts.remodel?.status).toBe("applied");
    assertInside(next, next.employees[0]!.location);
    const restored = deserializeGameState(serializeGameState(next));
    expect(restored.rooms).toEqual(next.rooms); expect(restored.employees[0]!.location).toEqual(next.employees[0]!.location);
    expect(plan(state, [{ roomId: room.id, x: 35, y: 20, orientation: 90 }]).operationReceipts.remodel).toMatchObject({ status: "rejected", message: "Choose an approved furniture orientation for this room." });
  });

  it("applies and replays the atomic command through the real immutable evidence boundary", () => {
    const { state, room, start } = fixture(); state.employees[0]!.location = start; state.employees[0]!.homeRoomInstanceId = room.id;
    const command: GameCommand = { type: "APPLY_REMODEL_PLAN", operationId: "journal.remodel", rooms: [
      { roomId: room.id, x: 25, y: 20, orientation: 0 }, { roomId: "remodel.1", x: 15, y: 20, orientation: 0 }] };
    const checkpoint = createGameEvidenceCheckpoint(state), before = JSON.stringify(checkpoint);
    const observed = applyGameEvidenceCommand(checkpoint, command);
    expect(observed.state).toEqual(gameReducer(state, command));
    expect(JSON.stringify(checkpoint)).toBe(before);
    expect(applyGameEvidenceCommand(observed.checkpoint, command)).toMatchObject({ replayed: true, appendedEvidence: [] });
    const restored = importGameEvidence(observed.checkpoint.snapshot, observed.checkpoint.evidence);
    expect(restored.rooms).toEqual(observed.state.rooms); expect(restored.learningHistories).toEqual(state.learningHistories);
  });

  it("rejects stale direct move/rotate commands without throwing", () => {
    const { state } = fixture();
    expect(move(state, "missing").operationReceipts.move?.status).toBe("rejected");
    expect(gameReducer(state, { type: "ROTATE_ROOM", operationId: "stale", roomId: "missing" }).operationReceipts.stale?.status).toBe("rejected");
    state.rooms[1]!.roomDefinitionId = "missing.definition";
    expect(() => move(state, state.rooms[1]!.id)).not.toThrow();
  });
});
