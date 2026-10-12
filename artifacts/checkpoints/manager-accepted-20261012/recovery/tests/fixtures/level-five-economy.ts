import { gameReducer, type DomainContext, type GameCommand, type GameState } from "@gamify-surgery/game-domain";
import { createEarlyLevelFourEconomyState } from "../../tools/economy-audit/level-four-simulation";
import { LEVEL_FIVE_ROOMS_QA_PLACEMENTS } from "./level-five-rooms";

export const LEVEL_FIVE_ECONOMY_QA_PREFIX = "campaign.qa.level-five-economy-m8";
export const LEVEL_FIVE_ECONOMY_READER_ID = "employee.economy.reader";
export const LEVEL_FIVE_ECONOMY_EXECUTIVE_ID = "employee.economy.executive";

export interface LevelFiveEconomySetup {
  seed: string;
  scored?: boolean;
  reader?: boolean;
  executive?: boolean;
  blockExecutive?: boolean;
}

type SetupCommand = { [T in GameCommand["type"]]: Omit<Extract<GameCommand, { type: T }>, "operationId"> }[GameCommand["type"]];

/** Synthetic funded opening clinic, zero earned XP. Every room, door and hire
 * uses the reducer. Catalog prices, cadence, staff/room tiers and wages are
 * unchanged. The sole mechanical opt-in is the supplied cap-5 QA context. */
export function createLevelFiveEconomyState(context: DomainContext, setup: LevelFiveEconomySetup): GameState {
  let state = createEarlyLevelFourEconomyState(setup.seed, context);
  if (state.clinicalXp !== 0) throw new Error("M8 must start at zero XP.");
  state.facilityLevel = 5;
  let sequence = 0;
  const apply = (data: SetupCommand) => {
    const operationId = `m8.setup.${sequence++}`;
    state = gameReducer(state, { ...data, operationId } as GameCommand, context);
    if (state.operationReceipts[operationId]?.status !== "applied") throw new Error(`M8 setup: ${state.operationReceipts[operationId]?.message}`);
  };
  // The specialty rooms occupy M2's old x35 link. The adjacent x34 lane
  // connects the same approved prestige sites without crossing Pediatric Exam.
  for (let x = 22; x <= 49; x++) apply({ type: "PLACE_ROOM", roomDefinitionId: "room.hallway", roomId: `room.economy.north.${x}`, x, y: 21, orientation: 0 });
  for (let y = 22; y <= 25; y++) apply({ type: "PLACE_ROOM", roomDefinitionId: "room.hallway", roomId: `room.economy.link.${y}`, x: 34, y, orientation: 0 });
  for (const site of LEVEL_FIVE_ROOMS_QA_PLACEMENTS) {
    apply({ type: "PLACE_ROOM", roomDefinitionId: site.roomDefinitionId, roomId: site.roomId, x: site.x, y: site.y, orientation: 0 });
    apply({ type: "PLACE_DOOR", roomId: site.roomId, doorId: `door.${site.roomId}`, side: "south", offset: site.doorOffset });
  }
  for (let x = 53; x <= 58; x++) apply({ type: "PLACE_ROOM", roomDefinitionId: "room.hallway", roomId: `room.economy.hall.${x}`, x, y: 26, orientation: 0 });
  if (setup.reader !== false) {
    apply({ type: "PLACE_ROOM", roomDefinitionId: "room.reading", roomId: "room.economy.reading", x: 54, y: 27, orientation: 0 });
    apply({ type: "PLACE_DOOR", roomId: "room.economy.reading", doorId: "door.economy.reading", side: "north", offset: 1 });
    apply({ type: "HIRE_STAFF", staffRoleDefinitionId: "staff.radiologist", employeeId: LEVEL_FIVE_ECONOMY_READER_ID });
  }
  apply({ type: "PLACE_ROOM", roomDefinitionId: "room.training", roomId: "room.economy.training", x: 54, y: 23, orientation: 0 });
  apply({ type: "PLACE_DOOR", roomId: "room.economy.training", doorId: "door.economy.training", side: "south", offset: 1 });
  if (setup.executive !== false) apply({ type: "HIRE_STAFF", staffRoleDefinitionId: "staff.executive", employeeId: LEVEL_FIVE_ECONOMY_EXECUTIVE_ID });
  // A real upstream sale interrupts the accepted route without bypassing the
  // occupied-door guard or firing the Executive. Founder ownership still
  // applies; Gift/Garden/Gym remain connected on the other side of this gap.
  if (setup.blockExecutive) apply({ type: "SELL_ROOM", roomId: "room.economy.north.30" });
  // Restore only the fixture's initially suppressed scored clock. All later
  // arrivals, selection, waits and settlement are ordinary production behavior.
  if (setup.scored) state.nextRoutineArrivalTick = context.balanceRelease.arrivals.routineBaseIntervalMinutes;
  return state;
}
