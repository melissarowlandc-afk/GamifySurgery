import {
  createInitialGameState,
  deserializeGameState,
  gameReducer,
  getFacilityAccessValidation,
  getRoomDefinition,
  getRoomStaffCapacity,
  serializeGameState,
  type GameCommand,
  type GameState,
} from "../src";

// D-2026-11-18-09 / D-2026-11-19-01: these are built homes, not a read of
// maximumInstances (the independent room-cap milestone may still be pending).
export const APP_HOME_COUNTS = [
  ["room.examination", 10],
  ["room.minor_procedure", 3],
  ["room.pediatric_examination", 4],
  ["room.wound_ostomy", 2],
] as const;
export const APP_POSTS = APP_HOME_COUNTS.reduce((total, [, count]) => total + count, 0);

export function applyAppFixtureCommand(state: GameState, command: GameCommand): GameState {
  const next = gameReducer(state, command);
  const receipt = next.operationReceipts[command.operationId];
  if (receipt?.status !== "applied") {
    throw new Error(`APP fixture ${command.operationId}: ${receipt?.message}`);
  }
  return next;
}

export function placeAppHome(state: GameState, roomId: string, definitionId: string, x: number, corridorY: number): GameState {
  const y = corridorY - getRoomDefinition(definitionId)!.height;
  state = applyAppFixtureCommand(state, { type: "PLACE_ROOM", operationId: `build.${roomId}`,
    roomId, roomDefinitionId: definitionId, x, y, orientation: 0 });
  return applyAppFixtureCommand(state, { type: "PLACE_DOOR", operationId: `door.${roomId}`,
    doorId: `door.${roomId}`, roomId, side: "south", offset: 1 });
}

export function addExpandedAppHomes(state: GameState): GameState {
  for (let index = 0; index < 3; index++) {
    state = placeAppHome(state, `app.home.minor.${index}`, "room.minor_procedure", 40 + index * 4, 26);
  }
  for (let index = 0; index < 4; index++) {
    state = placeAppHome(state, `app.home.pediatric.${index}`, "room.pediatric_examination", 2 + index * 8, 16);
  }
  for (let index = 0; index < 2; index++) {
    state = placeAppHome(state, `app.home.wound.${index}`, "room.wound_ostomy", 40 + index * 8, 16);
  }
  return state;
}

export function appHiringClinic(expanded = true): GameState {
  let state = createInitialGameState(undefined, { campaignId: "campaign.app-registration-acceptance",
    campaignSeed: "app-registration-acceptance-synthetic", createdAtRealMs: 0 });
  Object.assign(state, { facilityLevel: 5, paused: true, cash: 1_000_000, cashCents: 100_000_000,
    encounters: {}, openChartEncounterId: null, attendedEncounterId: null,
    serviceAppointmentsEnabled: false, nextRoutineArrivalTick: Number.MAX_SAFE_INTEGER });
  for (const y of [16, 26]) for (let x = 0; x <= 60; x++) {
    state = applyAppFixtureCommand(state, { type: "PLACE_ROOM", operationId: `hall.${x}.${y}`,
      roomId: `hall.${x}.${y}`, roomDefinitionId: "room.hallway", x, y });
  }
  for (let y = 17; y < 26; y++) {
    state = applyAppFixtureCommand(state, { type: "PLACE_ROOM", operationId: `spine.${y}`,
      roomId: `spine.${y}`, roomDefinitionId: "room.hallway", x: 0, y });
  }
  state = applyAppFixtureCommand(state, { type: "PLACE_ROOM", operationId: "front.connect",
    roomId: "front.connect", roomDefinitionId: "room.hallway", x: 35, y: 27 });
  state = applyAppFixtureCommand(state, { type: "PLACE_DOOR", operationId: "front.north",
    doorId: "front.north", roomId: "room.instance.founder_desk", side: "north", offset: 2 });
  for (let index = 0; index < 10; index++) {
    state = placeAppHome(state, `app.home.exam.${index}`, "room.examination", 2 + index * 3, 26);
  }
  if (expanded) state = addExpandedAppHomes(state);
  // Exercise the real hydration and arrival path before testing any hiring.
  state = deserializeGameState(serializeGameState(state));
  const expected = expanded ? APP_POSTS : 10;
  if (getRoomStaffCapacity(state, "staff.app").capacity !== expected) throw new Error("Wrong built APP post count");
  const unreachable = getFacilityAccessValidation(state).unreachableRoomIds;
  if (unreachable.length) throw new Error(`Disconnected APP fixture: ${unreachable.join(", ")}`);
  return state;
}

export function hireApp(state: GameState, number: number): GameState {
  return gameReducer(state, { type: "HIRE_STAFF", operationId: `app.hire.${number}`,
    employeeId: `app.employee.${number}`, staffRoleDefinitionId: "staff.app" });
}
