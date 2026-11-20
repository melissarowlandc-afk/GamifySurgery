import {
  createInitialGameState, deserializeGameState, findCareAwareFacilityPath,
  findDeterministicFacilityPath, gameReducer, getDoorCells, getEncounterPatientLocation,
  getFacilityAccessValidation, getFacilityWalkableTileKeys, getRoomCareAnchor,
  getRoomDefinition, getRotatedFootprint, PROTOTYPE_DOMAIN_CONTEXT as context,
  serializeGameState, validateDoorPlacement,
  type DomainContext, type GameCommand, type GameState, type GridPoint,
} from "../src";
import { createLevelFourRoomsQaContext } from "../../../tests/fixtures/level-four-rooms";
import { createPediatricChartsQaState, PEDIATRIC_CHARTS_QA_ENCOUNTER_ID } from "../../../tests/fixtures/pediatric-charts";
import { periopFlowFixture } from "./periop-nurse-flow-fixture";

export { context };
export const EXAM = "b015.public.exam", SOUTH = "b015.public.south", NORTH = "b015.public.north";
export const PATIENT = "b015.public.patient", EMPLOYEE = "b015.public.app";
export type Blocker = "staff-home" | "queued" | "assigned" | "occupant" | "inbound";
type Input = { [T in GameCommand["type"]]: Omit<Extract<GameCommand, { type: T }>, "operationId"> }[GameCommand["type"]];
let sequence = 0;
export function command(state: GameState, input: Input, ctx = context) {
  const operationId = `b015.blind.${sequence++}`;
  const next = gameReducer(state, { ...input, operationId } as GameCommand, ctx);
  return { state: next, receipt: next.operationReceipts[operationId]! };
}
export function must(state: GameState, input: Input, ctx = context): GameState {
  const result = command(state, input, ctx);
  if (result.receipt?.status !== "applied") throw new Error(`B-015 fixture ${input.type}: ${result.receipt?.message}`);
  return result.state;
}
export function tick(state: GameState, ctx = context): GameState {
  return must(state, { type: "ADVANCE_TICK", advancedAtRealMs: state.createdAtRealMs + (state.facilityTick + 1) * ctx.balanceRelease.clock.realMillisecondsPerFacilityMinuteAt1x }, ctx);
}
export const reload = (state: GameState, ctx = context) => deserializeGameState(serializeGameState(state), ctx);
export const samePoint = (a: GridPoint | null | undefined, b: GridPoint | null | undefined) => Boolean(a && b && a.x === b.x && a.y === b.y);

function quiet(state: GameState) {
  state.nextRoutineArrivalTick = state.nextFinancialPostingTick = state.nextEmployeeDiscussionTick = state.nextExternalRetailOpportunityTick = Number.MAX_SAFE_INTEGER;
  state.serviceAppointmentsEnabled = false;
  state.environment.nextLitterSpawnTick = state.environment.nextWaterCoolerDrainTick = Number.MAX_SAFE_INTEGER;
  state.retailNextOpportunityTicks["founder:founder"] = Number.MAX_SAFE_INTEGER;
  for (const employee of state.employees) state.retailNextOpportunityTicks[`employee:${employee.id}`] = Number.MAX_SAFE_INTEGER;
  return state;
}

/** Public generated encounter plus a command-built local hallway loop. The
 * isolated home/queue/assignment/occupant arms are historical save shapes,
 * loaded by the real codec, without new clinical prose or owner data. */
export function doorRemodelFixture(blocker: Blocker | "empty" = "inbound", onlyDoor = false) {
  let state = createInitialGameState(context, { campaignId: "campaign.b015.blind", campaignSeed: "b015.public.blind", createdAtRealMs: 0 });
  const patient = structuredClone(Object.values(state.encounters)[0]!);
  state.facilityLevel = 4; state.cash = 100_000; state.cashCents = 10_000_000;
  state.encounters = {}; state.openChartEncounterId = state.attendedEncounterId = null;
  quiet(state);
  const front = state.rooms.find(room => room.roomDefinitionId === "room.front_desk")!;
  const definition = getRoomDefinition("room.examination")!;
  const x = front.x - definition.width, y = front.y - definition.height;
  state = must(state, { type: "PLACE_ROOM", roomId: EXAM, roomDefinitionId: definition.id, x, y });
  for (let hx = x - 1; hx <= x + definition.width; hx++) for (let hy = y - 1; hy <= y + definition.height; hy++) {
    if (hx >= x && hx < x + definition.width && hy >= y && hy < y + definition.height) continue;
    if (state.rooms.some(room => { const size = getRotatedFootprint(getRoomDefinition(room.roomDefinitionId)!, room.orientation);
      return hx >= room.x && hx < room.x + size.width && hy >= room.y && hy < room.y + size.height; })) continue;
    state = must(state, { type: "PLACE_ROOM", roomId: `b015.hall.${hx}.${hy}`, roomDefinitionId: "room.hallway", x: hx, y: hy });
  }
  for (const [doorId, roomId, side] of [
    ["b015.front.west", front.id, "west"], ["b015.front.north", front.id, "north"],
    [SOUTH, EXAM, "south"], ...(!onlyDoor ? [[NORTH, EXAM, "north"] as const] : []),
  ] as const) state = must(state, { type: "PLACE_DOOR", doorId, roomId, side, offset: 0 });
  if (!getFacilityAccessValidation(state).valid) throw new Error("The initial synthetic clinic must have legal reachable access.");
  if (blocker === "staff-home" || blocker === "inbound") {
    state = must(state, { type: "HIRE_STAFF", employeeId: EMPLOYEE, staffRoleDefinitionId: "staff.app" });
    if (blocker === "staff-home") {
      const employee = state.employees.find(employee => employee.id === EMPLOYEE)!;
      employee.location = { x, y: y + definition.height };
      employee.path = [{ ...employee.location }]; employee.pathIndex = 0;
    }
  }
  if (!["empty", "staff-home"].includes(blocker)) {
    Object.assign(patient, { id: PATIENT, patientDisplayName: "Synthetic Door Patient", lifecycle: "waiting_unopened",
      checkInStatus: "checked_in", pendingResult: null, patientMovement: null, waitingDestination: null,
      assignedRoomInstanceId: blocker === "assigned" ? EXAM : null, queuedCareRoomInstanceId: blocker === "queued" ? EXAM : null,
      patientLocation: { x, y: y + definition.height }, nextIdleActionAtFacilityTick: Number.MAX_SAFE_INTEGER });
    patient.waiting.patienceExempt = true; patient.waiting.departureDueTick = null;
    const room = state.rooms.find(room => room.id === EXAM)!;
    if (blocker === "occupant") patient.patientLocation = getRoomCareAnchor(room, definition, "patient");
    if (blocker === "inbound") {
      const path = findCareAwareFacilityPath(state, context, patient.patientLocation!, getRoomCareAnchor(room, definition, "patient"), new Set([EXAM]));
      if (path.length < 2) throw new Error("The approaching patient needs a real doorway route.");
      const cells = getDoorCells(state.doors.find(door => door.id === SOUTH)!, room, definition);
      if (!cells || !path.some((point, index) => samePoint(point, cells.outside) && samePoint(path[index + 1], cells.inside))) {
        throw new Error("The approaching patient's route must use the doorway that the remodel removes.");
      }
      patient.patientMovement = { kind: "walking_to_care", path, pathIndex: 0, lastMovedAtFacilityTick: state.facilityTick, destinationRoomInstanceId: EXAM };
    }
    state.encounters[PATIENT] = patient;
  }
  quiet(state);
  return reload(must(state, { type: "SET_PAUSED", paused: false }));
}

/** Facts that a door edit must not erase to make an occupancy gate disappear.
 * Rebuildable path knots and their progress/temporary wait text may change. */
export function acceptedWork(state: GameState) {
  const spatial = new Set(["path", "childPath", "parentPath", "outboundPath", "returnPath", "pathIndex", "lastMovedAtFacilityTick", "location", "patientLocation", "movementWaitReason", "resourceWaitReason", "doorIds"]);
  return JSON.stringify({ tick: state.facilityTick, speed: state.simulationSpeed, cash: state.cash, cents: state.cashCents,
    histories: state.learningHistories, encounters: state.encounters, employees: state.employees,
    operations: state.serviceOperations, families: state.pediatricFamilies, actors: state.retailExternalActors },
  (key, value) => spatial.has(key) ? undefined : value);
}

export function actorRows(state: GameState) {
  return [
    ...Object.values(state.encounters).map(actor => ({ id: `patient:${actor.id}`, point: getEncounterPatientLocation(state, actor.id), path: actor.patientMovement?.path ?? [], index: actor.patientMovement?.pathIndex ?? 0, movedAt: actor.patientMovement?.lastMovedAtFacilityTick ?? state.facilityTick })),
    ...state.employees.map(actor => ({ id: `staff:${actor.id}`, point: actor.location, path: actor.path, index: actor.pathIndex, movedAt: actor.lastMovedAtFacilityTick })),
    ...state.retailExternalActors.filter(actor => actor.lifecycle !== "departed").map(actor => ({ id: `external:${actor.id}`, point: actor.location, path: actor.path, index: actor.pathIndex, movedAt: actor.lastMovedAtFacilityTick })),
    ...state.serviceOperations.filter(actor => !["completed", "cancelled"].includes(actor.status)).map(actor => ({ id: `service:${actor.id}`, point: actor.location, path: actor.path, index: actor.pathIndex, movedAt: actor.lastMovedAtFacilityTick })),
    { id: "founder", point: state.environment.founderLocation, path: state.environment.founderActivity?.path ?? [], index: state.environment.founderActivity?.pathIndex ?? 0, movedAt: state.environment.founderActivity?.lastMovedAtFacilityTick ?? state.facilityTick },
  ];
}

export function travelBound(state: GameState, ctx = context) {
  const nodes = getFacilityWalkableTileKeys(state.rooms, id => getRoomDefinition(id, ctx), state.doors).size;
  const longest = Math.max(nodes, ...actorRows(state).map(actor => actor.path.length),
    ...Object.values(state.pediatricFamilies ?? {}).map(family => family.movement?.childPath.length ?? 0));
  // A simple route visits at most every walkable node; include its arrival
  // transition. The divisor is the shipped travel speed, never a wall timeout.
  return Math.ceil(longest / ctx.balanceRelease.facility.characterTravelTilesPerTick) + 1;
}

export function routeProblems(before: GameState, state: GameState, ctx = context): string[] {
  const problems: string[] = [], facility = ctx.balanceRelease.facility;
  const inGrid = (p: GridPoint) => p.x >= 0 && p.y >= 0 && p.x < facility.gridWidth && p.y < facility.gridHeight;
  const integer = (p: GridPoint) => Number.isInteger(p.x) && Number.isInteger(p.y);
  const previous = new Map(actorRows(before).map(row => [row.id, row]));
  const checked = new Set<string>();
  for (const actor of actorRows(state)) {
    const old = previous.get(actor.id);
    if (actor.point && old?.point && inGrid(actor.point) && inGrid(old.point) && integer(actor.point) && integer(old.point) && !samePoint(actor.point, old.point)) {
      const route = findDeterministicFacilityPath(old.point, actor.point, state.rooms, state.doors, id => getRoomDefinition(id, ctx));
      // Movement consumes elapsed time since its persisted movement clock;
      // ordinary staff may have accrued more than one tick while at a post.
      const budget = Math.max(1, state.facilityTick - old.movedAt) * facility.characterTravelTilesPerTick;
      if (!route.length || route.length - 1 > budget) problems.push(`${actor.id} crossed a wall or teleported: ${JSON.stringify({ tick: state.facilityTick, from: old.point, to: actor.point, route, budget })}.`);
    }
    const remaining = actor.path.slice(actor.index);
    for (let i = 1; i < remaining.length; i++) {
      const a = remaining[i - 1]!, b = remaining[i]!;
      if (!inGrid(a) || !inGrid(b) || !integer(a) || !integer(b) || samePoint(a, b)) continue;
      const key = JSON.stringify([a, b]); if (checked.has(key)) continue; checked.add(key);
      const route = findDeterministicFacilityPath(a, b, state.rooms, state.doors, id => getRoomDefinition(id, ctx));
      if (route.length !== 2) problems.push(`${actor.id} retained a non-navigable route edge ${key}.`);
    }
  }
  return problems;
}

export function replacementDoor(state: GameState, roomId: string, excluded: readonly { side: string; offset: number }[], ctx = context) {
  const room = state.rooms.find(room => room.id === roomId)!, definition = getRoomDefinition(room.roomDefinitionId, ctx)!;
  const size = getRotatedFootprint(definition, room.orientation), f = ctx.balanceRelease.facility;
  for (const side of ["south", "north", "west", "east"] as const) for (let offset = 0; offset < (side === "south" || side === "north" ? size.width : size.height); offset++) {
    if (excluded.some(door => door.side === side && door.offset === offset)) continue;
    const door = { id: "b015.replacement", roomId, side, offset, exterior: false };
    const valid = validateDoorPlacement(door, state.rooms, state.doors, id => getRoomDefinition(id, ctx), f.gridWidth, f.gridHeight, new Set(f.protectedRoomDefinitionIds));
    if (valid.valid && getFacilityAccessValidation({ ...state, doors: [...state.doors, door] }, ctx).valid) return door;
  }
  throw new Error(`The public ${roomId} fixture has no reachable replacement opening.`);
}

export function pairedFixture() {
  const ctx = createLevelFourRoomsQaContext();
  let state = quiet(createPediatricChartsQaState(ctx));
  state = must(state, { type: "SET_PAUSED", paused: false }, ctx);
  state = must(state, { type: "SEAT_FOUNDER_AT_FRONT_DESK" }, ctx);
  const arrivalBound = travelBound(state, ctx);
  for (let i = 0; i < arrivalBound && state.encounters[PEDIATRIC_CHARTS_QA_ENCOUNTER_ID]!.checkInStatus !== "checked_in"; i++) state = tick(state, ctx);
  if (state.encounters[PEDIATRIC_CHARTS_QA_ENCOUNTER_ID]!.checkInStatus !== "checked_in") throw new Error("The real pediatric arrival did not check in.");
  state = must(state, { type: "OPEN_CHART", encounterId: PEDIATRIC_CHARTS_QA_ENCOUNTER_ID }, ctx);
  const bound = travelBound(state, ctx);
  for (let i = 0; i < bound; i++) {
    const family = Object.values(state.pediatricFamilies ?? {})[0]!;
    if (family.movement && family.reservation?.roomInstanceId === "room.peds.exam") return { state: reload(state, ctx), context: ctx, familyId: family.id, childId: PEDIATRIC_CHARTS_QA_ENCOUNTER_ID };
    state = tick(state, ctx);
  }
  throw new Error("The real pediatric chart did not start paired examination travel.");
}

export function serviceFixture() {
  const clinic = periopFlowFixture(2, 2), ids = clinic.admit(2);
  const bound = clinic.state.serviceOperations.reduce((sum, op) => sum + op.frozenOperationPhases!.reduce((total, phase) => total + phase.durationMinutes, 0), 0) + travelBound(clinic.state);
  for (let i = 0; i < bound; i++) {
    if (clinic.state.serviceOperations.find(op => op.id === ids[0])?.phaseIndex === 1 && clinic.state.serviceOperations.find(op => op.id === ids[0])?.status === "in_service") return { state: reload(clinic.state), context, ids, roomId: "qa.endoscopy.0" };
    clinic.advance();
  }
  throw new Error("The real accepted endoscopy work did not start.");
}
