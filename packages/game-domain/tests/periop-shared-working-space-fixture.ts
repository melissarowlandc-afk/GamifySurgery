import {
  beginPeriopNurseAttention, createPatientPixelAppearance, createPediatricFamily,
  deserializeGameState, gameReducer,
  getCurrentPeriopNurseAttention, getPeriopNurseStandingPoints, getRoomCareStations,
  getRoomCompanionSeats, getRoomDefinition, getRoomNavigableTiles, getRotatedFootprint,
  isEmployeeAssignedToOperationalRoom, isRoomOperationalForFacilityWork,
  pathServiceVisitorFromCurrentLocation,
  PROTOTYPE_DOMAIN_CONTEXT as context, serializeGameState, startServiceOperation,
  validateDoorPlacement, type GameState, type GridPoint, type ServiceOperationState,
} from "../src";
import { reconcilePediatricProcedureFamily } from "../src/pediatric-procedure-flow";
import { createProcedureCompanionState } from "../src/procedure-companions";
import { periopFlowFixture } from "./periop-nurse-flow-fixture";

// Public synthetic geometry/factories only. No owner export, captured names,
// chart answers, new clinical teaching content or wall-clock input is used.
export const PERIOP_ROOMS = ["qa.periop.0", "qa.periop.1"] as const;
export const samePoint = (a: GridPoint | null | undefined, b: GridPoint | null | undefined) => Boolean(a && b && a.x === b.x && a.y === b.y);
const key = (p: GridPoint) => `${p.x},${p.y}`;

function roomState(): GameState {
  const state = structuredClone(periopFlowFixture(4, 3, { surgery: true }).state);
  state.facilityLevel = 5;
  state.simulationSpeed = 1;
  const addRoom = (id: string, definition: string, x: number, y: number) => state.rooms.push({
    id, roomDefinitionId: definition, x, y, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100,
  });
  for (const [index, x] of [4, 10, 16, 22].entries()) addRoom(`shared.endoscopy.${index}`, "room.endoscopy", x, 23);
  addRoom("shared.or", "room.ambulatory_or", 22, 18);
  addRoom("shared.surgeon-office", "room.surgeon_office", 16, 20);
  for (let x = 3; x <= 37; x++) {
    if (!state.rooms.some(room => room.roomDefinitionId === "room.hallway" && room.x === x && room.y === 22)) addRoom(`shared.hall.${x}`, "room.hallway", x, 22);
  }
  const facility = context.balanceRelease.facility;
  for (const id of ["shared.endoscopy.0", "shared.endoscopy.1", "shared.endoscopy.2", "shared.endoscopy.3", "shared.or", "shared.surgeon-office"]) {
    const room = state.rooms.find(candidate => candidate.id === id)!;
    const definition = getRoomDefinition(room.roomDefinitionId)!;
    const side = room.roomDefinitionId === "room.endoscopy" ? "north" : "south";
    const door = Array.from({ length: definition.width }, (_, offset) => ({ id: `door.${id}`, roomId: id, side, offset, exterior: false } as const))
      .find(candidate => validateDoorPlacement(candidate, state.rooms, state.doors, getRoomDefinition,
        facility.gridWidth, facility.gridHeight, new Set(facility.protectedRoomDefinitionIds)).valid);
    if (!door) throw new Error(`Synthetic shared-space room has no legal corridor door: ${id}`);
    state.doors.push(door);
  }
  const occupied = new Set<string>();
  for (const room of state.rooms) {
    const footprint = getRotatedFootprint(getRoomDefinition(room.roomDefinitionId)!, room.orientation);
    for (let y = room.y; y < room.y + footprint.height; y++) for (let x = room.x; x < room.x + footprint.width; x++) {
      if (occupied.has(`${x},${y}`)) throw new Error(`Synthetic shared-space fixture overlap: ${x},${y}`);
      occupied.add(`${x},${y}`);
    }
    if (!isRoomOperationalForFacilityWork(state, room.id, context)) throw new Error(`Synthetic room lacks operational access: ${room.id}`);
  }
  for (const id of PERIOP_ROOMS) {
    const room = state.rooms.find(candidate => candidate.id === id)!;
    if (getRoomCareStations(room, getRoomDefinition(room.roomDefinitionId)!, state.doors, state.rooms, getRoomDefinition).length !== 8) throw new Error("The fixture requires two authored eight-bed rooms.");
  }
  return state;
}

function fullyStaffedClinic(): GameState {
  let state = roomState();
  const hires = [
    ...Array.from({ length: 4 }, (_, i) => ["staff.endoscopy_nurse", `shared.endoscopy-nurse.${i}`]),
    ...Array.from({ length: 4 }, (_, i) => ["staff.endoscopist", `shared.endoscopist.${i}`]),
    ["staff.or_nurse", "shared.or-nurse"], ["staff.surgeon", "shared.surgeon"],
  ];
  for (const [role, id] of hires) {
    const operationId = `shared.hire.${id}`;
    state = gameReducer(state, { type: "HIRE_STAFF", operationId, employeeId: id!, staffRoleDefinitionId: role! }, context);
    if (state.operationReceipts[operationId]?.status !== "applied") throw new Error(`Synthetic staffing: ${state.operationReceipts[operationId]?.message}`);
    state.retailNextOpportunityTicks[`employee:${id}`] = Number.MAX_SAFE_INTEGER;
  }
  // A simple path cannot exceed the grid's tile count. This is a path-derived
  // setup bound, not a new simulated care duration or a real-time deadline.
  const facility = context.balanceRelease.facility;
  const arrivalBound = Math.ceil(facility.gridWidth * facility.gridHeight / facility.characterTravelTilesPerTick);
  for (let i = 0; i < arrivalBound && state.employees.some(employee => !isEmployeeAssignedToOperationalRoom(state, employee.id, context)); i++) state = advanceSharedSpace(state, `setup.${i}`);
  if (state.employees.some(employee => !isEmployeeAssignedToOperationalRoom(state, employee.id, context))) throw new Error("Synthetic hires failed to enter the clinic.");
  return state;
}

export function advanceSharedSpace(state: GameState, id: string): GameState {
  return gameReducer(state, { type: "ADVANCE_TICK", operationId: `shared.tick.${id}`,
    advancedAtRealMs: state.createdAtRealMs + state.facilityTick + 1 }, context);
}

export interface SharedSpaceFixture {
  state: GameState;
  patientIds: string[];
  oldestId: string;
  childId: string;
  familyId: string;
  blockerId: string;
  blockedPoint: GridPoint;
  initialTasks: Array<{ id: string; phaseIndex: number; created: number; ready: number; remaining: number; duration: number }>;
  bound: number;
}

/** Already accepted bedside work uses the real visitor factory, frozen phase
 * lengths and attention quote. Explicit historical placement is test setup,
 * like the existing nurse-queue/persistence fixtures, never a repair action. */
export function sharedSpaceFixture(options: { retained?: boolean; midWalk?: boolean; postOp?: boolean; ordinary?: boolean } = {}): SharedSpaceFixture {
  const state = fullyStaffedClinic();
  const first = state.rooms.find(room => room.id === PERIOP_ROOMS[0])!;
  const second = state.rooms.find(room => room.id === PERIOP_ROOMS[1])!;
  const beds = (room: typeof first) => getRoomCareStations(room, getRoomDefinition(room.roomDefinitionId)!, state.doors, state.rooms, getRoomDefinition);
  const firstBeds = beds(first), secondBeds = beds(second);
  const choose = (all: typeof firstBeds, id: string) => {
    const bed = all.find(candidate => candidate.id === id);
    if (!bed) throw new Error(`Authored synthetic bed missing: ${id}`);
    return bed;
  };
  const rows = [
    { line: "income.endoscopy", room: first, bed: choose(firstBeds, "N4") },
    { line: "income.endoscopy", room: first, bed: choose(firstBeds, "N3") },
    { line: "income.endoscopy", room: second, bed: secondBeds[0]! },
    { line: "income.ambulatory_operation", room: second, bed: secondBeds[1]! },
  ];
  const origin = state.facilityTick;
  let readyOrigin = origin;
  const patientIds: string[] = [];
  for (const [index, row] of rows.entries()) {
    // The existing public flow helper also admits already-accepted bursts by
    // bypassing appointment throttling alone; no care/resource gate is skipped.
    const accepted = state.serviceOperations;
    state.serviceOperations = [];
    const id = startServiceOperation(state, row.line, "visitor", context);
    state.serviceOperations = [...accepted, ...state.serviceOperations];
    if (!id) throw new Error(`Synthetic visitor factory could not admit ${row.line}`);
    const op = state.serviceOperations.find(candidate => candidate.id === id)!;
    const phaseIndex = options.postOp && index === 0 ? op.frozenOperationPhases!.length - 1 : 0;
    const phase = op.frozenOperationPhases![phaseIndex]!;
    if (options.postOp && index === 0) readyOrigin += op.periopNurseAttention!.tasks[0]!.durationMinutes + op.frozenOperationPhases![1]!.durationMinutes;
    const ready = readyOrigin + index;
    Object.assign(op, { displayName: `Synthetic bedside patient ${index + 1}`, status: "in_service", phaseIndex,
      startedAtFacilityTick: origin, phaseStartedAtFacilityTick: ready,
      phaseEndsAtFacilityTick: ready + phase.durationMinutes, reservedRoomInstanceIds: [row.room.id],
      reservedEmployeeIds: [], providerReservation: null,
      location: { ...row.bed.patientAnchor }, path: [{ ...row.bed.patientAnchor }], pathIndex: 0,
      lastMovedAtFacilityTick: ready, waitDeadlineFacilityTick: Number.MAX_SAFE_INTEGER,
      periopBedReservation: { version: "periop-bed-reservation.v1", roomInstanceId: row.room.id, bedId: row.bed.id, endpoint: { ...row.bed.patientAnchor } },
    });
    op.visitorTravel!.arrivedAtFacilityTick = ready;
    if (phaseIndex > 0) {
      const pre = op.periopNurseAttention!.tasks[0]!;
      Object.assign(pre, { readyAtFacilityTick: origin, requiredUntilFacilityTick: origin + pre.durationMinutes,
        startedAtFacilityTick: origin, completedAtFacilityTick: origin + pre.durationMinutes,
        remainingMinutes: 0, lastProgressAtFacilityTick: origin + pre.durationMinutes });
    }
    beginPeriopNurseAttention(op, ready);
    state.retailNextOpportunityTicks[`service_visitor:${id}`] = Number.MAX_SAFE_INTEGER;
    patientIds.push(id);
  }
  state.facilityTick = Math.max(...state.serviceOperations.map(op => op.phaseEndsAtFacilityTick!));
  const child = state.serviceOperations.find(op => op.id === patientIds[1])!;
  const oldest = state.serviceOperations.find(op => op.id === patientIds[0])!;
  const points = getPeriopNurseStandingPoints(state, oldest, context);
  if (points.length !== 1) throw new Error(`Synthetic oldest bed must have exactly one authored working point: ${JSON.stringify(points)}`);
  const blockedPoint = points[0]!;
  let familyId = "", blockerId = "shared.ordinary.companion";
  if (options.ordinary) {
    state.retailExternalActors.push({ id: blockerId, kind: "companion", displayName: "Synthetic ordinary companion",
      appearance: state.founder.appearance, linkedServiceOperationId: oldest.id, linkedEncounterId: null,
      lifecycle: "onsite", location: { x: first.x - 1, y: first.y }, path: [], pathIndex: 0,
      lastMovedAtFacilityTick: state.facilityTick, activeRetailOperationId: null,
      procedureCompanion: { ...createProcedureCompanionState(), periopRoomInstanceId: first.id } });
  } else {
  const demographics = { ageYears: 10, sexLabel: "Female" as const };
  child.clinicVisit = { version: "clinic-visit.v1", kind: "pediatric_procedure", demographics };
  child.appearance = createPatientPixelAppearance(state.campaignSeed, child.id, demographics);
  child.procedureContext = { version: "procedure-visit.v1", familyId: "procedure.egd", kind: "endoscopy", demographics,
    pediatricFamilyContext: { profileId: "shared.synthetic.child", childName: child.displayName,
      childStillId: child.appearance.stillId!, parentName: "Synthetic later parent", parentRelationship: "mother" } };
  const family = createPediatricFamily(state, child, "service_visitor", { displayName: "Synthetic later parent", sexLabel: "Female" });
  familyId = family.id; blockerId = family.parentActorId;
  family.procedureFlow = { version: "pediatric-procedure-flow.v1", serviceOperationId: child.id,
    familyId: "procedure.egd", phase: "consent", parentCheckpoint: null };
  family.phase = "in_care";
  const parent = state.retailExternalActors.find(actor => actor.id === family.parentActorId)!;
  parent.lifecycle = "onsite";
  parent.location = { ...child.location! };
  parent.path = [{ ...parent.location }]; parent.pathIndex = 0; parent.lastMovedAtFacilityTick = state.facilityTick;
  if (options.retained) {
    family.procedureFlow.parentCheckpoint = { roomInstanceId: first.id, location: { ...blockedPoint } };
    const path = pathServiceVisitorFromCurrentLocation(state, context, parent.location!, blockedPoint, new Set([first.id]));
    if (!path.length) throw new Error("Synthetic parent's historical checkpoint is not reachable.");
    parent.path = options.midWalk ? path : [{ ...blockedPoint }];
    parent.pathIndex = options.midWalk ? Math.floor((path.length - 1) / 2) : 0;
    if (options.midWalk && (parent.pathIndex === 0 || parent.pathIndex >= path.length - 1)) throw new Error("Synthetic parent needs a genuine mid-walk checkpoint.");
    parent.location = { ...parent.path[parent.pathIndex]! };
  } else reconcilePediatricProcedureFamily(state, context, family);
  }
  const initialTasks = patientIds.map(id => {
    const op = state.serviceOperations.find(candidate => candidate.id === id)!;
    const task = getCurrentPeriopNurseAttention(op)!;
    return { id, phaseIndex: task.phaseIndex, created: op.createdAtFacilityTick,
      ready: task.readyAtFacilityTick!, remaining: task.remainingMinutes, duration: task.durationMinutes };
  });
  // Allow serial nursing plus a full same-room support walk and the longest
  // real nurse route for every ready patient. All minutes derive from shipped
  // travel speed, authored navigation and the factory's frozen care durations.
  const destinations = state.serviceOperations.flatMap(op => getPeriopNurseStandingPoints(state, op, context)
    .map(point => ({ point, roomId: op.periopBedReservation!.roomInstanceId })));
  const starts = [...state.employees.filter(employee => employee.staffRoleDefinitionId === "staff.periop_nurse").map(employee => employee.location),
    ...destinations.map(destination => destination.point)];
  const longestNurseRoute = Math.max(...destinations.flatMap(destination => starts.map(start =>
    Math.max(0, pathServiceVisitorFromCurrentLocation(state, context, start, destination.point, new Set([destination.roomId])).length - 1))));
  const supportWalk = Math.max(...PERIOP_ROOMS.map(id => {
    const room = state.rooms.find(room => room.id === id)!;
    return getRoomNavigableTiles(room, getRoomDefinition(room.roomDefinitionId)!, state.doors, state.rooms, getRoomDefinition).length - 1;
  }));
  const travelPerPatient = Math.ceil(longestNurseRoute / context.balanceRelease.facility.characterTravelTilesPerTick) +
    Math.ceil(supportWalk / context.balanceRelease.facility.characterTravelTilesPerTick);
  const bound = initialTasks.length * travelPerPatient + initialTasks.reduce((sum, task) => sum + task.remaining, 0) +
    Math.max(...state.serviceOperations.map(op => op.frozenOperationPhases![op.phaseIndex]!.durationMinutes));
  return { state, patientIds, oldestId: oldest.id, childId: child.id, familyId,
    blockerId, blockedPoint: { ...blockedPoint }, initialTasks, bound };
}

export function hydrateSharedSpace(state: GameState): GameState {
  return deserializeGameState(serializeGameState(state), context);
}

export function authoredNursePoints(state: GameState, roomId: string): GridPoint[] {
  const room = state.rooms.find(candidate => candidate.id === roomId)!;
  return getRoomCareStations(room, getRoomDefinition(room.roomDefinitionId)!, state.doors, state.rooms, getRoomDefinition).flatMap(bed =>
    getPeriopNurseStandingPoints(state, { periopBedReservation: { version: "periop-bed-reservation.v1", roomInstanceId: room.id, bedId: bed.id, endpoint: bed.patientAnchor } } as ServiceOperationState, context));
}

export class SharedSpaceCareMonitor {
  readonly completed = new Set<string>();
  readonly attended = new Set<string>();
  readonly procedures = new Set<string>();
  readonly assignmentOrder: string[] = [];
  readonly violations = new Set<string>();
  readonly work = new Map<string, number>();
  private readonly blockedSupports = new Map<string, string>();
  private prior: GameState;

  constructor(readonly fixture: SharedSpaceFixture, initial = fixture.state) { this.prior = initial; }

  observe(state: GameState) {
    const tickDelta = state.facilityTick - this.prior.facilityTick;
    const nurseMinutes = new Map<string, number>();
    if (tickDelta !== 1 || state.simulationSpeed !== 1) this.violations.add("Care observation must advance one real 1x facility minute.");
    for (const [index, row] of this.fixture.initialTasks.entries()) {
      const before = this.prior.serviceOperations.find(op => op.id === row.id)!;
      const op = state.serviceOperations.find(op => op.id === row.id)!;
      const previous = before.periopNurseAttention!.tasks.find(task => task.phaseIndex === row.phaseIndex)!;
      const task = op.periopNurseAttention!.tasks.find(task => task.phaseIndex === row.phaseIndex)!;
      if (op.createdAtFacilityTick !== row.created || task.readyAtFacilityTick !== row.ready || task.durationMinutes !== row.duration) this.violations.add(`Accepted priority/duration changed for ${row.id}.`);
      const decrement = previous.remainingMinutes - task.remainingMinutes;
      if (decrement < 0 || decrement > tickDelta) this.violations.add(`Skipped/duplicated nursing minute for ${row.id}.`);
      if (!this.assignmentOrder.includes(row.id) && (task.employeeId || task.startedAtFacilityTick !== null || decrement > 0)) {
        if (this.fixture.initialTasks.slice(0, index).some(older => !this.assignmentOrder.includes(older.id))) this.violations.add(`Younger work overtook an unassigned older patient: ${row.id}.`);
        this.assignmentOrder.push(row.id);
      }
      if (decrement > 0) {
        this.attended.add(row.id);
        this.work.set(row.id, (this.work.get(row.id) ?? 0) + decrement);
        const nurseId = task.employeeId ?? previous.employeeId;
        const standing = task.standingPoint ?? previous.standingPoint;
        // A last minute may release the nurse and start the patient's next
        // walk in this same reducer tick. Either tick boundary may witness the
        // actual bedside; neither can supply unstaffed or duplicated care.
        const witnessed = [this.prior, state].some(snapshot => {
          const nurse = snapshot.employees.find(employee => employee.id === nurseId);
          const patient = snapshot.serviceOperations.find(patient => patient.id === row.id)!;
          return nurse?.staffRoleDefinitionId === "staff.periop_nurse" && samePoint(nurse.location, standing) &&
            samePoint(patient.location, patient.periopBedReservation?.endpoint) &&
            !snapshot.retailExternalActors.some(actor => actor.lifecycle !== "departed" && samePoint(actor.location, standing));
        });
        if (!witnessed || !nurseId) this.violations.add(`Care credited without an unobstructed nurse at the actual bedside: ${row.id}.`);
        if (nurseId) {
          nurseMinutes.set(nurseId, (nurseMinutes.get(nurseId) ?? 0) + decrement);
          if (nurseMinutes.get(nurseId)! > tickDelta) this.violations.add(`A nurse performed duplicate simultaneous work: ${nurseId}.`);
        }
      }
      if (task.completedAtFacilityTick !== null) {
        this.completed.add(row.id);
        if (task.remainingMinutes !== 0 || this.work.get(row.id) !== row.remaining || task.startedAtFacilityTick === null) this.violations.add(`Free or incomplete nursing completion: ${row.id}.`);
      }
      const phase = op.frozenOperationPhases?.[op.phaseIndex];
      if (op.status === "in_service" && (phase?.roomDefinitionId === "room.endoscopy" || phase?.roomDefinitionId === "room.ambulatory_or")) this.procedures.add(phase.roomDefinitionId);
    }
    for (const id of PERIOP_ROOMS) {
      const room = state.rooms.find(room => room.id === id)!;
      const tiles = new Set(getRoomNavigableTiles(room, getRoomDefinition(room.roomDefinitionId)!, state.doors, state.rooms, getRoomDefinition).map(key));
      const working = authoredNursePoints(state, id);
      const needs = this.fixture.initialTasks.flatMap(row => {
        const op = state.serviceOperations.find(op => op.id === row.id)!;
        const task = op.periopNurseAttention!.tasks.find(task => task.phaseIndex === row.phaseIndex)!;
        return task.completedAtFacilityTick === null && op.periopBedReservation?.roomInstanceId === id ? getPeriopNurseStandingPoints(state, op, context) : [];
      });
      for (const actor of state.retailExternalActors.filter(actor => actor.lifecycle !== "departed")) {
        if (needs.some(point => samePoint(point, actor.location) || samePoint(point, actor.path.at(-1)))) this.blockedSupports.set(actor.id, id);
        if (this.blockedSupports.get(actor.id) !== id) continue;
        const end = actor.path.at(-1) ?? actor.location;
        const validSupport = end && tiles.has(key(end)) &&
          !working.some(point => samePoint(point, end)) &&
          !state.retailExternalActors.some(other => other.id !== actor.id && other.lifecycle !== "departed" && (samePoint(other.location, end) || samePoint(other.path.at(-1), end))) &&
          !state.employees.some(employee => samePoint(employee.location, end) || samePoint(employee.path.at(-1), end));
        if (validSupport && (actor.pathIndex < actor.path.length - 1 || samePoint(actor.location, end))) this.blockedSupports.delete(actor.id);
      }
    }
    const actor = state.retailExternalActors.find(actor => actor.id === this.fixture.blockerId)!;
    const previousActor = this.prior.retailExternalActors.find(actor => actor.id === this.fixture.blockerId)!;
    if (this.fixture.familyId && actor.lifecycle !== "departed") {
      const room = state.rooms.find(room => room.id === PERIOP_ROOMS[0])!;
      const bounds = getRotatedFootprint(getRoomDefinition(room.roomDefinitionId)!, room.orientation);
      if (actor.location && (actor.location.x < room.x || actor.location.x >= room.x + bounds.width || actor.location.y < room.y || actor.location.y >= room.y + bounds.height)) this.violations.add("Parent left the child's peri-op room instead of using a same-room support.");
      if (actor.location && previousActor.location && Math.abs(actor.location.x - previousActor.location.x) + Math.abs(actor.location.y - previousActor.location.y) > tickDelta * context.balanceRelease.facility.characterTravelTilesPerTick) this.violations.add("Parent teleported instead of walking aside.");
    }
    this.prior = state;
  }

  get done() { return this.completed.size === this.fixture.patientIds.length && this.procedures.size > 0; }
  summary(state: GameState) {
    const blocker = state.retailExternalActors.find(actor => actor.id === this.fixture.blockerId)!;
    return { tick: state.facilityTick, bound: this.fixture.bound, attended: [...this.attended], completed: [...this.completed],
      procedures: [...this.procedures], assignmentOrder: this.assignmentOrder,
      idlePeriopNurses: state.employees.filter(employee => employee.staffRoleDefinitionId === "staff.periop_nurse" && !employee.facilityTask).length,
      blocker: { id: blocker.id, location: blocker.location, destination: blocker.path.at(-1) },
      remaining: this.fixture.initialTasks.map(row => ({ id: row.id,
        remaining: state.serviceOperations.find(op => op.id === row.id)!.periopNurseAttention!.tasks.find(task => task.phaseIndex === row.phaseIndex)!.remainingMinutes })),
      violations: [...this.violations, ...[...this.blockedSupports].map(([actor, room]) => `Non-nurse retains a needed working point in ${room}: ${actor}.`)] };
  }
}

export { context, getRoomCompanionSeats, getRoomNavigableTiles, getRoomDefinition };
