import {
  createInitialGameState, gameReducer, getRoomDefinition, isRoomOperationalForFacilityWork,
  deserializeGameState, getRotatedFootprint, PROTOTYPE_DOMAIN_CONTEXT, serializeGameState, startServiceOperation, validateDoorPlacement,
  type GameState, type RoomOrientation,
} from "../src";

/** Disposable clinic using the shipped room sizes, furniture, doors and hiring.
 * Only unrelated arrivals/expenses are disabled; care uses normal reducer ticks.
 */
export function periopFlowFixture(nurseCount = 2, facilityLevel: 2 | 3 = 2, options: { amenities?: boolean; surgery?: boolean } = {}) {
  let state = createInitialGameState(undefined, { campaignId: "campaign.periop-owner-qa", campaignSeed: "periop-owner-feedback", createdAtRealMs: 0 });
  Object.assign(state, {
    facilityLevel, paused: false, cash: 100000, cashCents: 10000000,
    serviceAppointmentsEnabled: false, encounters: {},
    nextRoutineArrivalTick: Number.MAX_SAFE_INTEGER, nextFinancialPostingTick: Number.MAX_SAFE_INTEGER,
    nextEmployeeDiscussionTick: Number.MAX_SAFE_INTEGER, nextExternalRetailOpportunityTick: Number.MAX_SAFE_INTEGER,
  });
  state.environment.nextLitterSpawnTick = state.environment.nextWaterCoolerDrainTick = Number.MAX_SAFE_INTEGER;
  state.environment.pendingFounderConsult = null;
  state.environment.founderActivity = null;
  state.retailNextOpportunityTicks["founder:founder"] = Number.MAX_SAFE_INTEGER;
  const room = (id: string, definition: string, x: number, y: number, orientation: RoomOrientation = 0) => {
    state.rooms.push({ id, roomDefinitionId: definition, x, y, orientation, doorSide: null, upgradeLevel: 1, cleanliness: 100 });
  };
  const hall = (x: number, y: number) => {
    if (!state.rooms.some((entry) => entry.x === x && entry.y === y)) room(`qa.hall.${x}.${y}`, "room.hallway", x, y);
  };
  room("qa.exam", "room.examination", 28, 26);
  room("qa.endoscopy.0", "room.endoscopy", 33, 23);
  room("qa.periop.0", "room.periop_recovery", 38, 26);
  if (nurseCount > 2) room("qa.periop.1", "room.periop_recovery", 38, 19);
  for (let y = 19; y <= 27; y++) { hall(32, y); hall(37, y); }
  hall(32, 28);
  hall(31, 27);
  hall(31, 28);
  for (let x = 32; x <= 37; x++) hall(x, 22);
  state.doors.push(
    { id: "qa.front.west", roomId: "room.instance.founder_desk", side: "west", offset: 0, exterior: false },
    { id: "qa.front.north", roomId: "room.instance.founder_desk", side: "north", offset: 4, exterior: false },
    { id: "qa.exam.east", roomId: "qa.exam", side: "east", offset: 1, exterior: false },
    { id: "qa.endoscopy.0.west", roomId: "qa.endoscopy.0", side: "west", offset: 1, exterior: false },
    { id: "qa.endoscopy.0.east", roomId: "qa.endoscopy.0", side: "east", offset: 1, exterior: false },
    { id: "qa.periop.0.west", roomId: "qa.periop.0", side: "west", offset: 0, exterior: false },
    ...(nurseCount > 2 ? [{ id: "qa.periop.1.west", roomId: "qa.periop.1", side: "west" as const, offset: 0, exterior: false }] : []),
  );
  if (options.amenities) {
    room("qa.training", "room.training", 29, 19);
    room("qa.coffee", "room.coffee_kiosk", 30, 24);
    state.doors.push(
      { id: "qa.training.east", roomId: "qa.training", side: "east", offset: 1, exterior: false },
      { id: "qa.coffee.east", roomId: "qa.coffee", side: "east", offset: 1, exterior: false },
    );
    if (facilityLevel === 3) {
      room("qa.break", "room.staff_break", 24, 23);
      for (let x = 26; x <= 32; x++) hall(x, 22);
      state.doors.push({ id: "qa.break.north", roomId: "qa.break", side: "north", offset: 2, exterior: false });
    }
  }
  if (options.surgery) {
    room("qa.or", "room.ambulatory_or", 33, 18);
    room("qa.surgeon-office", "room.surgeon_office", 30, 16);
    hall(31, 18); hall(32, 18);
    state.doors.push(
      { id: "qa.or.west", roomId: "qa.or", side: "west", offset: 1, exterior: false },
      { id: "qa.or.east", roomId: "qa.or", side: "east", offset: 1, exterior: false },
      { id: "qa.surgeon-office.south", roomId: "qa.surgeon-office", side: "south", offset: 1, exterior: false },
    );
  }
  // Unlike a rendering harness, this clinic has no overlapping room footprints
  // and all doors are legal placements against the shipped furniture masks.
  const occupied = new Set<string>();
  for (const placed of state.rooms) {
    const size = getRotatedFootprint(getRoomDefinition(placed.roomDefinitionId)!, placed.orientation);
    for (let y = placed.y; y < placed.y + size.height; y++) for (let x = placed.x; x < placed.x + size.width; x++) {
      const key = `${x},${y}`;
      if (occupied.has(key)) throw new Error(`QA room overlap at ${key}: ${placed.id}`);
      occupied.add(key);
    }
  }
  const facility = PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility;
  for (const door of state.doors) {
    const validation = validateDoorPlacement(door, state.rooms, state.doors.filter((entry) => entry.id !== door.id), getRoomDefinition,
      facility.gridWidth, facility.gridHeight, new Set(facility.protectedRoomDefinitionIds));
    if (!validation.valid) throw new Error(`QA door ${door.id}: ${JSON.stringify(validation)}`);
  }
  let sequence = 0;
  const advance = (minutes = 1) => {
    for (let minute = 0; minute < minutes; minute++) state = gameReducer(state,
      { type: "ADVANCE_TICK", operationId: `periop.owner.tick.${sequence++}` }, PROTOTYPE_DOMAIN_CONTEXT);
    return state;
  };
  const hire = (role: string, count = 1) => {
    for (let index = 0; index < count; index++) {
      const before = state.employees.length;
      const id = `periop.owner.employee.${sequence++}`;
      state = gameReducer(state, { type: "HIRE_STAFF", employeeId: id, staffRoleDefinitionId: role, operationId: `periop.owner.hire.${sequence++}` }, PROTOTYPE_DOMAIN_CONTEXT);
      if (state.employees.length !== before + 1) throw new Error(`Normal hiring failed for ${role}: ${JSON.stringify(state.operationReceipts)}`);
      const employee = state.employees.at(-1)!;
      employee.morale = 100;
      state.retailNextOpportunityTicks[`employee:${employee.id}`] = Number.MAX_SAFE_INTEGER;
    }
  };
  hire("staff.periop_nurse", nurseCount);
  hire("staff.endoscopy_nurse");
  hire("staff.endoscopist");
  if (options.surgery) { hire("staff.or_nurse"); hire("staff.surgeon"); }
  advance(50); // Actual sidewalk-to-home hiring travel, no teleport.
  for (const id of ["qa.exam", "qa.periop.0", "qa.endoscopy.0", ...(nurseCount > 2 ? ["qa.periop.1"] : [])]) {
    if (!isRoomOperationalForFacilityWork(state, id, PROTOTYPE_DOMAIN_CONTEXT)) throw new Error(`QA room is not operational: ${id}`);
    const placed = state.rooms.find((entry) => entry.id === id)!;
    const definition = getRoomDefinition(placed.roomDefinitionId)!;
    if (definition.id === "room.periop_recovery" && (definition.width !== 6 || definition.height !== 6)) throw new Error("QA requires the approved 6x6 Periop layout.");
  }
  const admit = (count = 4, lines = ["income.endoscopy"]) => {
    const ids: string[] = [];
    for (let index = 0; index < count; index++) {
      // Inject an already accepted burst, bypassing only appointment admission
      // throttling. Factory-created patients still walk and use every care gate.
      const accepted = state.serviceOperations;
      state.serviceOperations = [];
      const id = startServiceOperation(state, lines[index % lines.length]!, "visitor", PROTOTYPE_DOMAIN_CONTEXT);
      state.serviceOperations = [...accepted, ...state.serviceOperations];
      if (!id) throw new Error(`Actual visitor factory failed for ${lines[index % lines.length]}.`);
      ids.push(id);
      advance(2);
    }
    return ids;
  };
  const train = (employeeId: string) => {
    state = gameReducer(state, { type: "TRAIN_EMPLOYEE", employeeId, operationId: `periop.owner.train.${sequence++}` }, PROTOTYPE_DOMAIN_CONTEXT);
  };
  const reload = () => { state = deserializeGameState(serializeGameState(state)); return state; };
  return { get state() { return state; }, advance, admit, train, reload };
}

export function periopNurses(state: GameState) {
  return state.employees.filter((employee) => employee.staffRoleDefinitionId === "staff.periop_nurse");
}
