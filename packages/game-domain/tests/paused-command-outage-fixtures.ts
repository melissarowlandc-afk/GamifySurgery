import { createInitialGameState, gameReducer, type GameCommand, type GameState } from "../src";

export const bridgeHall = "public.outage.bridge";
export const apronHall = "public.outage.apron";
export const examRoom = "public.outage.exam";
export const frontDoor = "public.outage.front-door";
export const examDoor = "public.outage.exam-door";

export type FixtureCommand = {
  [K in GameCommand["type"]]: Omit<Extract<GameCommand, { type: K }>, "operationId">;
}[GameCommand["type"]];

export function pausedClinic(level: GameState["facilityLevel"] = 1): GameState {
  const state = createInitialGameState(undefined, {
    campaignId: "public.paused-command-outage", campaignSeed: "paused-command-outage", createdAtRealMs: 0,
  });
  return { ...state, paused: true, facilityLevel: level, facilityTick: 37, cash: 10_000, cashCents: 1_000_000,
    encounters: {}, openChartEncounterId: null, serviceAppointmentsEnabled: false };
}

export function buildFixture(state: GameState, ...commands: FixtureCommand[]): GameState {
  for (const command of commands) {
    const operationId = `public.outage.setup.${Object.keys(state.operationReceipts).length}`;
    state = gameReducer(state, { ...command, operationId });
    const receipt = state.operationReceipts[operationId];
    if (receipt?.status !== "applied") throw Error(`Synthetic ${command.type} setup: ${receipt?.message}`);
  }
  return state;
}

export function hallwaySaleClinic(level: GameState["facilityLevel"] = 1): GameState {
  // Sidewalk -> Front Desk -> bridge -> apron -> Examination Room.
  return buildFixture(pausedClinic(level),
    { type: "PLACE_ROOM", roomId: bridgeHall, roomDefinitionId: "room.hallway", x: 35, y: 27, orientation: 0 },
    { type: "PLACE_ROOM", roomId: apronHall, roomDefinitionId: "room.hallway", x: 35, y: 26, orientation: 0 },
    { type: "PLACE_ROOM", roomId: examRoom, roomDefinitionId: "room.examination", x: 34, y: 24, orientation: 0 },
    { type: "PLACE_DOOR", doorId: frontDoor, roomId: "room.instance.founder_desk", side: "north", offset: 2 },
    { type: "PLACE_DOOR", doorId: examDoor, roomId: examRoom, side: "south", offset: 1 },
  );
}
