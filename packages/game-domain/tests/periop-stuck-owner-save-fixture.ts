import {
  deserializeGameState, gameReducer, getRoomDefinition, getRotatedFootprint,
  isRoomOperationalForFacilityWork, PROTOTYPE_DOMAIN_CONTEXT, serializeGameState, startEncounterProcedureOperation,
  validateDoorPlacement, type GameState,
} from "../src";
import { periopOwnerSaveFixture } from "./periop-nurse-owner-save-fixture";
import { periopRealVisitFixture } from "./periop-nurse-real-visit-fixture";

/** Rebuild only the supplied owner facts, starting with a UI-ordered endoscopy
 * encounter and shipped Level-3 rooms. Never reads a browser/profile save. */
export function stuckPeriopOwnerSaveFixture() {
  const visit = periopRealVisitFixture();
  for (let minute = 0; minute < 180 && !visit.state.serviceOperations.some((op) => op.incomeLineId === "income.endoscopy"); minute++) visit.advance();
  const template = visit.state.serviceOperations.find((op) => op.incomeLineId === "income.endoscopy")!;
  if (!template) throw new Error("Normal chart commands did not order endoscopy.");
  let state: GameState = periopOwnerSaveFixture().state;
  // The latest report supplies these actor coordinates, but not suite positions.
  // This approved second endoscopy suite contains (37,23); all doors are real.
  const second = state.rooms.find((room) => room.id === "qa.endoscopy.1")!;
  Object.assign(second, { x: 34, y: 21, orientation: 0 });
  state.doors = state.doors.filter((door) => door.roomId !== second.id);
  for (const [x, firstY, lastY] of [[33, 22, 24], [38, 22, 26]]) for (let y = firstY!; y <= lastY!; y++) {
    state.rooms.push({ id: `stuck.hall.${x}.${y}`, roomDefinitionId: "room.hallway", x: x!, y, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 });
  }
  state.doors.push(
    { id: "stuck.endoscopy.west", roomId: second.id, side: "west", offset: 1, exterior: false },
    { id: "stuck.endoscopy.east", roomId: second.id, side: "east", offset: 1, exterior: false },
  );
  const occupied = new Set<string>();
  for (const room of state.rooms) {
    const size = getRotatedFootprint(getRoomDefinition(room.roomDefinitionId)!, room.orientation);
    for (let y = room.y; y < room.y + size.height; y++) for (let x = room.x; x < room.x + size.width; x++) {
      if (occupied.has(`${x},${y}`)) throw new Error(`Owner-stall fixture overlaps at ${x},${y}.`);
      occupied.add(`${x},${y}`);
    }
  }
  const facility = PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility;
  for (const door of state.doors) {
    const result = validateDoorPlacement(door, state.rooms, state.doors.filter((other) => other.id !== door.id), getRoomDefinition,
      facility.gridWidth, facility.gridHeight, new Set(facility.protectedRoomDefinitionIds));
    if (!result.valid) throw new Error(`Owner-stall fixture door ${door.id}: ${JSON.stringify(result)}`);
  }
  for (const room of state.rooms.filter((room) => room.roomDefinitionId !== "room.hallway")) {
    if (!isRoomOperationalForFacilityWork(state, room.id, PROTOTYPE_DOMAIN_CONTEXT)) throw new Error(`Owner-stall fixture room is disconnected: ${room.id}`);
  }
  state.facilityTick = 13392;
  state.encounters = {};
  state.serviceOperations = [];
  state.retailExternalActors = [];
  state.openChartEncounterId = state.attendedEncounterId = null;
  const nurses = state.employees.filter((employee) => employee.staffRoleDefinitionId === "staff.periop_nurse");
  for (const employee of state.employees) {
    employee.facilityTask = null; employee.training = null; employee.morale = 100;
    employee.lastMovedAtFacilityTick = state.facilityTick;
    employee.nextIdleActionAtFacilityTick = state.facilityTick + 10;
  }
  const [riley, blake] = nurses;
  riley!.location = { x: 27, y: 30 }; riley!.path = [{ ...riley!.location }]; riley!.pathIndex = 0;
  const make = (id: string, encounterId: string, name: string, bedId: "ED" | "EC", endpointY: number) => {
    const encounter = structuredClone(visit.state.encounters[template.actorId]!);
    encounter.id = encounterId; encounter.patientDisplayName = name;
    encounter.patientLocation = { x: 37, y: 23 }; encounter.patientMovement = null;
    encounter.lifecycle = "active_pending_result";
    // The owner operations predate the marked diagnostic timing protocol.
    for (const result of [encounter.pendingResult, ...encounter.steps.map((step) => step.result)]) if (result) {
      delete result.diagnosticTiming;
      result.localServiceOperation = { version: "pending-result-service-operation.v1", incomeLineId: "income.endoscopy", serviceOperationId: id,
        status: "waiting_for_service", externalDurationTicks: result.serviceDurationTicks };
      result.patientRemainsOnsite = true;
      result.onsiteReturn = { version: "onsite-front-desk-return.v1", status: "awaiting_service_completion",
        serviceCompletedAtTick: null, frontDeskArrivalTick: null };
    }
    state.encounters[encounterId] = encounter;
    if (!startEncounterProcedureOperation(state, encounter, "income.endoscopy", PROTOTYPE_DOMAIN_CONTEXT)) throw new Error("Legacy encounter factory failed.");
    const op = state.serviceOperations.at(-1)!;
    Object.assign(op, { id, actorId: encounterId, displayName: name, status: "in_service", createdAtFacilityTick: 13000,
      phaseIndex: 0, phaseStartedAtFacilityTick: 13049, phaseEndsAtFacilityTick: 13406,
      startedAtFacilityTick: 13049, location: { x: 37, y: 23 }, path: [{ x: 37, y: 23 }], pathIndex: 0,
      lastMovedAtFacilityTick: 13111, reservedRoomInstanceIds: ["qa.periop.0"], reservedEmployeeIds: [], providerReservation: null,
      waitDeadlineFacilityTick: Number.MAX_SAFE_INTEGER, resourceWaitReason: null,
      periopBedReservation: { version: "periop-bed-reservation.v1", roomInstanceId: "qa.periop.0", bedId, endpoint: { x: 27, y: endpointY } },
    });
    const task = op.periopNurseAttention!.tasks[0]!;
    Object.assign(task, { employeeId: null, standingPoint: null, readyAtFacilityTick: 13049, startedAtFacilityTick: 13111,
      remainingMinutes: 14, lastProgressAtFacilityTick: 13392, requiredUntilFacilityTick: 13399 });
    return { encounter, op, task };
  };
  const current = make("service-operation.353", "encounter.owner.current", "Maya Reed", "ED", 29);
  current.task.employeeId = riley!.id; current.task.standingPoint = { x: 27, y: 30 };
  riley!.facilityTask = { kind: "periop_attention", targetId: current.op.id, startedAtFacilityTick: 13111, workMinutesRemaining: 14 };
  const legacy = make("service-operation.260", "encounter.auto.3.215", "Maxwell Sawyer", "EC", 28);
  legacy.encounter.lifecycle = "resolved"; legacy.encounter.pendingResult = null;
  Object.assign(legacy.op, { status: "waiting_for_next_phase", phaseStartedAtFacilityTick: null, phaseEndsAtFacilityTick: null,
    nextPhaseReadyAtFacilityTick: 11237, reservedRoomInstanceIds: [], createdAtFacilityTick: 11000 });
  delete legacy.op.periopNurseAttention;
  // Preserve accepted owner timing (a 5% preparation and 10% procedure modifier).
  const timing = legacy.op.trainingTiming!;
  timing.categoryPercents["staff.periop_nurse"] = 5;
  timing.categoryPercents["staff.endoscopy_nurse"] = timing.categoryPercents["staff.endoscopist"] = 10;
  timing.phases.forEach((phase, index) => { phase.boundPercent = index === 0 ? 5 : index === 1 ? 10 : 0; });
  legacy.op.frozenOperationPhases!.forEach((phase, index) => { phase.durationMinutes = [29, 41, 60][index]!; });
  state.retailExternalActors.push({ id: "companion.59", kind: "companion", displayName: "Lane Barlow",
    appearance: structuredClone(legacy.encounter.patientAppearance), linkedServiceOperationId: legacy.op.id,
    linkedEncounterId: legacy.encounter.id, lifecycle: "onsite", location: { x: 38, y: 26 }, path: [{ x: 38, y: 26 }],
    pathIndex: 0, lastMovedAtFacilityTick: 11237, activeRetailOperationId: null });
  state.companionSequence = 86;
  let sequence = 0;
  const advance = (minutes = 1) => {
    for (let minute = 0; minute < minutes; minute++) state = gameReducer(state,
      { type: "ADVANCE_TICK", operationId: `owner.stuck.tick.${sequence++}` }, PROTOTYPE_DOMAIN_CONTEXT);
    return state;
  };
  const reload = () => { state = deserializeGameState(serializeGameState(state)); return state; };
  return { get state() { return state; }, advance, reload, rileyId: riley!.id, blakeId: blake!.id,
    current: () => state.serviceOperations.find((op) => op.id === current.op.id)!,
    legacy: () => state.serviceOperations.find((op) => op.id === legacy.op.id)!,
    lane: () => state.retailExternalActors.find((actor) => actor.id === "companion.59")! };
}
