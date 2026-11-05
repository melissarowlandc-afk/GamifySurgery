import {
  createInitialGameState, deserializeGameState, gameReducer, getDoorCells,
  getRoomDefinition, getRoomCareStations, getRotatedFootprint, serializeGameState,
  PROTOTYPE_DOMAIN_CONTEXT,
  type CardinalDirection, type GameCommand, type GameState, type GridPoint,
  type RoomOrientation,
} from "../src";

export interface EndoscopyReadyOptions {
  orientation?: RoomOrientation;
  endoscopy?: GridPoint;
  recovery?: GridPoint;
  provider?: boolean;
  missingDoor?: "endoscopy" | "recovery" | "front";
  /** A deliberately connected treatment-room chain, without public bypass. */
  chain?: "recovery-through-endoscopy" | "endoscopy-through-recovery";
  lowSalary?: boolean;
  appointments?: boolean;
  legacyBreakRoom?: boolean;
  trainingRoom?: boolean;
  extraRecovery?: GridPoint;
}

/** Stop on the exact pending transition found in an older stuck snapshot. A
 * finite manual founder walk prevents same-tick dispatch in the fixed code. */
export function preparedEndoscopyClinic(options: EndoscopyReadyOptions = {}) {
  const clinic = endoscopyReadyClinic({ chain: "endoscopy-through-recovery", provider: false, ...options });
  for (let i = 0; i < 500; i++) {
    const prep = clinic.state.serviceOperations.find(op => op.incomeLineId === "income.endoscopy" &&
      op.phaseIndex === 0 && op.status === "in_service" && op.phaseEndsAtFacilityTick !== null &&
      op.phaseEndsAtFacilityTick - clinic.state.facilityTick <= 2);
    if (prep) break;
    clinic.advance();
  }
  clinic.dispatch({ type: "MOVE_FOUNDER", destination: { x: 43, y: 21 } });
  for (let i = 0; i < 20 && !clinic.state.serviceOperations.some(op => op.phaseIndex === 0 && op.status === "waiting_for_next_phase"); i++) clinic.advance();
  if (!clinic.state.serviceOperations.some(op => op.phaseIndex === 0 && op.status === "waiting_for_next_phase")) throw new Error("Prepared endoscopy transition was not captured");
  const stuck = JSON.parse(serializeGameState(clinic.state));
  stuck.environment.founderActivity = null;
  stuck.environment.suspendedFounderActivity = null;
  clinic.restore(deserializeGameState(JSON.stringify(stuck)));
  return clinic;
}

/** Older pre-op selection could commit a visit to this public but dead-end
 * Recovery room. Keep the completed preparation and frozen operation intact. */
export function stuckRecoveryEndoscopyClinic() {
  const clinic = preparedEndoscopyClinic({ extraRecovery: { x: 12, y: 26 } });
  const raw = JSON.parse(serializeGameState(clinic.state));
  const operation = raw.serviceOperations.find((op: { status: string }) => op.status === "waiting_for_next_phase");
  const room = clinic.state.rooms.find(room => room.id === "ready.aaa-recovery")!;
  const station = getRoomCareStations(room, getRoomDefinition(room.roomDefinitionId)!, clinic.state.doors,
    clinic.state.rooms, getRoomDefinition).find(station => station.kind === "periop_bed")!;
  operation.periopBedReservation = { version: "periop-bed-reservation.v1", roomInstanceId: room.id, bedId: station.id, endpoint: { ...station.patientAnchor } };
  operation.reservedRoomInstanceIds = [room.id]; operation.transitionHeldRoomInstanceIds = [];
  operation.location = { ...station.patientAnchor }; operation.path = [{ ...station.patientAnchor }]; operation.pathIndex = 0;
  clinic.restore(deserializeGameState(JSON.stringify(raw)));
  return clinic;
}
type WithoutReceiptId<C> = C extends unknown ? Omit<C, "operationId"> : never;

/** Rooms, public circulation, doors and hires use actual game commands.
 * Funded synthetic opening suppresses only unrelated scored demand/distractions.
 * No clinical catalog, service cadence, movement or care phase is replaced. */
export function endoscopyReadyClinic(options: EndoscopyReadyOptions = {}, initialState?: GameState) {
  let state = structuredClone(initialState ?? createInitialGameState(PROTOTYPE_DOMAIN_CONTEXT, {
    campaignId: "synthetic.endoscopy-ready", campaignSeed: "endoscopy-ready", createdAtRealMs: 0,
  }));
  Object.assign(state, {
    facilityLevel: options.legacyBreakRoom ? 3 : 2, cash: 100_000, cashCents: 10_000_000,
    paused: false, encounters: {}, serviceAppointmentsEnabled: false,
    nextRoutineArrivalTick: Number.MAX_SAFE_INTEGER,
    nextEmployeeDiscussionTick: Number.MAX_SAFE_INTEGER,
    nextExternalRetailOpportunityTick: Number.MAX_SAFE_INTEGER,
  });
  state.environment.nextLitterSpawnTick = state.environment.nextWaterCoolerDrainTick = Number.MAX_SAFE_INTEGER;
  state.environment.pendingFounderConsult = state.environment.founderActivity = null;
  state.retailNextOpportunityTicks["founder:founder"] = Number.MAX_SAFE_INTEGER;
  let sequence = 0;
  const dispatch = (command: WithoutReceiptId<GameCommand>) => {
    const operationId = `endoscopy.ready.command.${sequence++}`;
    state = gameReducer(state, { ...command, operationId } as GameCommand, PROTOTYPE_DOMAIN_CONTEXT);
    const receipt = state.operationReceipts[operationId];
    if (receipt?.status === "rejected") throw new Error(`${command.type}: ${receipt.message}`);
    return state;
  };
  const place = (roomId: string, roomDefinitionId: string, x: number, y: number, orientation: RoomOrientation = 0) =>
    state.rooms.some(room => room.id === roomId) ? state : dispatch({ type: "PLACE_ROOM", roomId, roomDefinitionId, x, y, orientation } as GameCommand);
  const door = (roomId: string, side: CardinalDirection, offset: number) =>
    state.doors.some(door => door.roomId === roomId && door.side === side && door.offset === offset) ? state
      : dispatch({ type: "PLACE_DOOR", doorId: `${roomId}.${side}.${offset}`, roomId, side, offset } as GameCommand);
  const advance = (minutes = 1) => {
    for (let i = 0; i < minutes; i++) dispatch({ type: "ADVANCE_TICK", advancedAtRealMs: (state.facilityTick + 1) * 1000 } as GameCommand);
    return state;
  };
  const reload = () => { state = deserializeGameState(serializeGameState(state), PROTOTYPE_DOMAIN_CONTEXT); return state; };

  place("ready.exam", "room.examination", 28, 26);
  const endoscopy = options.chain ? { x: 33, y: 22 } : options.endoscopy ?? { x: 33, y: 23 };
  const recovery = options.chain ? { x: 37, y: 21 } : options.recovery ?? { x: 40, y: 22 };
  place("ready.endoscopy", "room.endoscopy", endoscopy.x, endoscopy.y, options.orientation ?? 0);
  place("ready.recovery", "room.periop_recovery", recovery.x, recovery.y, options.orientation ?? 0);
  if (options.extraRecovery) place("ready.aaa-recovery", "room.periop_recovery", options.extraRecovery.x, options.extraRecovery.y);
  place("ready.waiting", "room.waiting", 26, 19);
  if (options.trainingRoom) place("ready.training", "room.training", 22, 18);
  if (options.legacyBreakRoom) place("ready.break", "room.staff_break", 22, 23);

  const occupied = new Set(state.rooms.filter(room => getRoomDefinition(room.roomDefinitionId)!.kind !== "hallway").flatMap(room => {
    const size = getRotatedFootprint(getRoomDefinition(room.roomDefinitionId)!, room.orientation);
    return Array.from({ length: size.height }, (_, y) => Array.from({ length: size.width }, (_, x) => `${room.x + x},${room.y + y}`)).flat();
  }));
  const hallway = new Set<string>();
  const connect = (target: GridPoint) => {
    const origin = { x: 32, y: 28 }, queue = [origin], previous = new Map<string, GridPoint | null>([[`${origin.x},${origin.y}`, null]]);
    for (let n = 0; n < queue.length; n++) {
      const at = queue[n]!;
      if (at.x === target.x && at.y === target.y) break;
      for (const step of [{ x: 0, y: -1 }, { x: -1, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }]) {
        const next = { x: at.x + step.x, y: at.y + step.y }, key = `${next.x},${next.y}`;
        if (next.x < 0 || next.x >= 72 || next.y < 0 || next.y >= 31 || occupied.has(key) || previous.has(key)) continue;
        previous.set(key, at); queue.push(next);
      }
    }
    let at: GridPoint | null = target;
    if (!previous.has(`${at.x},${at.y}`)) throw new Error("Synthetic public hall cannot reach requested door");
    while (at) { hallway.add(`${at.x},${at.y}`); at = previous.get(`${at.x},${at.y}`) ?? null; }
  };
  const doors: Array<{ roomId: string; side: CardinalDirection; offset: number; missing?: boolean }> = [
    { roomId: "room.instance.founder_desk", side: "west", offset: 0, missing: options.missingDoor === "front" },
    { roomId: "ready.exam", side: "west", offset: 1 },
    { roomId: "ready.waiting", side: "east", offset: 1 },
  ];
  // Rotation-safe choices from the authored door slots, not arbitrary anchors.
  const rotated = (side: CardinalDirection, offset: number, definitionId: string) => {
    const d = getRoomDefinition(definitionId)!;
    let width = d.width, height = d.height;
    for (let n = 0; n < (options.orientation ?? 0) / 90; n++) {
      const old = side;
      side = ({ north: "east", east: "south", south: "west", west: "north" } as const)[side];
      if (old === "east") offset = height - 1 - offset;
      if (old === "west") offset = height - 1 - offset;
      [width, height] = [height, width];
    }
    return { side, offset };
  };
  if (options.chain) {
    // The shared E1 threshold enters Periop at its west offset 2.
    doors.push({ roomId: "ready.endoscopy", side: "east", offset: 1 });
    // Hire through public entrances first, then remove a public-hall bypass.
    // The room door itself cannot be removed while it has assigned staff.
    doors.push({ roomId: "ready.endoscopy", side: "west", offset: 1 });
    doors.push({ roomId: "ready.recovery", side: "east", offset: 0 });
  } else {
    doors.push({ roomId: "ready.endoscopy", ...rotated("west", 1, "room.endoscopy"), missing: options.missingDoor === "endoscopy" });
    doors.push({ roomId: "ready.recovery", ...rotated("west", 0, "room.periop_recovery"), missing: options.missingDoor === "recovery" });
  }
  if (options.legacyBreakRoom) doors.push({ roomId: "ready.break", side: "north", offset: 2 });
  if (options.trainingRoom) doors.push({ roomId: "ready.training", side: "east", offset: 1 });
  if (options.extraRecovery) doors.push({ roomId: "ready.aaa-recovery", side: "west", offset: 0 });
  for (const d of doors) {
    const room = state.rooms.find(room => room.id === d.roomId)!;
    const cells = getDoorCells({ ...d, id: "probe", exterior: false }, room, getRoomDefinition(room.roomDefinitionId)!);
    if (!cells) throw new Error("Synthetic door has no threshold");
    if (!occupied.has(`${cells.outside.x},${cells.outside.y}`)) connect(cells.outside);
  }
  for (const key of hallway) { const [x, y] = key.split(",").map(Number); place(`ready.hall.${key}`, "room.hallway", x!, y!); }
  for (const d of doors) if (!d.missing) door(d.roomId, d.side, d.offset);
  const blockedHires: string[] = [];
  for (const role of ["staff.endoscopy_nurse", "staff.periop_nurse", ...(options.provider === false ? [] : ["staff.endoscopist"])]) {
    const id = `ready.employee.${role}`;
    try { dispatch({ type: "HIRE_STAFF", employeeId: id, staffRoleDefinitionId: role } as GameCommand); }
    catch (error) { if (!options.missingDoor) throw error; blockedHires.push(`${role}: ${String(error)}`); continue; }
    if (options.lowSalary) {
      const definition = PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility.staffRoleDefinitions.find(d => d.id === role)!;
      dispatch({ type: "SET_EMPLOYEE_SALARY", employeeId: id, salaryPerExpenseInterval: definition.minimumSalaryPerExpenseInterval } as GameCommand);
    }
  }
  if (options.chain) {
    advance(30);
    dispatch({ type: "SELL_ROOM", roomId: options.chain === "recovery-through-endoscopy"
      ? "ready.hall.43,27" : "ready.hall.32,24" } as GameCommand);
  }
  if (options.legacyBreakRoom) {
    // Level 2 cannot buy this Level 3 room. Compatibility arm models an old
    // snapshot containing it; construction/hiring still used real commands.
    const raw = JSON.parse(serializeGameState(state)); raw.facilityLevel = 2;
    state = deserializeGameState(JSON.stringify(raw), PROTOTYPE_DOMAIN_CONTEXT);
  }
  dispatch({ type: "SET_SERVICE_APPOINTMENTS_ENABLED", enabled: options.appointments !== false } as GameCommand);
  return { get state() { return state; }, dispatch, advance, reload, blockedHires, restore(saved: GameState) {
    state = saved;
    for (const id of Object.keys(state.operationReceipts)) {
      const index = /^endoscopy\.ready\.command\.(\d+)$/.exec(id)?.[1];
      if (index) sequence = Math.max(sequence, Number(index) + 1);
    }
  } };
}

/** Real Level 1 construction/hires, old-schema hydration, then real LEVEL_UP. */
export function transitionedEndoscopyClinic(provider = true) {
  let state = structuredClone(createInitialGameState(PROTOTYPE_DOMAIN_CONTEXT, { campaignId: "synthetic.endoscopy-legacy", campaignSeed: "endoscopy-legacy", createdAtRealMs: 0 }));
  Object.assign(state, { facilityLevel: 1, clinicalXp: 150, cash: 100_000, cashCents: 10_000_000,
    paused: false, encounters: {}, serviceAppointmentsEnabled: false, nextRoutineArrivalTick: Number.MAX_SAFE_INTEGER });
  state.retiredEncounterSummary = { version: "retired-encounter-summary.v1", retiredCount: 1, completedCount: 1,
    ordinaryEncounterCompleted: true, inHouseEndoscopyCompleted: false, recentStillUses: [],
    recentEndedSatisfaction: [{ id: "synthetic.legacy.ended", resolvedAtFacilityTick: 0, finalPatientSatisfaction: 100, resolutionReason: "completed" }] };
  state.environment.pendingFounderConsult = state.environment.founderActivity = null;
  let sequence = 0;
  const apply = (command: WithoutReceiptId<GameCommand>) => {
    const operationId = `endoscopy.legacy.${sequence++}`;
    state = gameReducer(state, { ...command, operationId } as GameCommand);
    if (state.operationReceipts[operationId]?.status !== "applied") throw new Error(`Legacy fixture ${command.type}: ${state.operationReceipts[operationId]?.message}`);
  };
  const place = (roomId: string, roomDefinitionId: string, x: number, y: number) => apply({ type: "PLACE_ROOM", roomId, roomDefinitionId, x, y });
  place("ready.exam", "room.examination", 28, 26);
  place("legacy.ultrasound", "room.ultrasound", 29, 23);
  place("legacy.minor", "room.minor_procedure", 23, 26);
  const halls = [[32, 23], [32, 24], [32, 25], [32, 26], [32, 27], [32, 28],
    [31, 28], [30, 28], [29, 28], [28, 28], [27, 28], [26, 28], [26, 27], [27, 27]];
  for (const [x, y] of halls) place(`ready.hall.${x},${y}`, "room.hallway", x!, y!);
  for (const [roomId, side, offset] of [["room.instance.founder_desk", "west", 0], ["ready.exam", "west", 1],
    ["legacy.ultrasound", "east", 0], ["legacy.minor", "east", 1]] as const) {
    apply({ type: "PLACE_DOOR", doorId: `${roomId}.${side}.${offset}`, roomId, side, offset });
  }
  apply({ type: "HIRE_STAFF", employeeId: "legacy.imaging", staffRoleDefinitionId: "staff.imaging_technician" });
  for (let i = 0; i < 40; i++) apply({ type: "ADVANCE_TICK" });
  const raw = JSON.parse(serializeGameState(state)); raw.schemaVersion = 7;
  delete raw.serviceAppointmentsEnabled; delete raw.nextServiceAppointmentTicks;
  delete raw.lastServiceAppointmentTicks; delete raw.lastServiceAppointmentArrivalTick;
  state = deserializeGameState(JSON.stringify(raw));
  apply({ type: "LEVEL_UP" });
  if (state.facilityLevel !== 2) throw new Error("Legacy clinic did not advance to Level 2");
  return endoscopyReadyClinic({ provider }, state);
}
