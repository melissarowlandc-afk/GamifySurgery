import { deserializeGameState, gameReducer, type DomainContext, type GameState } from "@gamify-surgery/game-domain";
import checkpoint from "./level-five-economy-checkpoint-20261012.json";
import { createLevelFiveEconomyState, LEVEL_FIVE_ECONOMY_QA_PREFIX } from "./level-five-economy";

export const LEVEL_FIVE_ECONOMY_QA_SCENARIOS = ["economy", "economy-inspection"] as const;
export type LevelFiveEconomyQaScenario = typeof LEVEL_FIVE_ECONOMY_QA_SCENARIOS[number];

/** The inspection preview is an actual paused audit save, not synthetic XP,
 * admissions, receipts or a report. No answer bot runs in the browser. */
export function createLevelFiveEconomyQaState(scenario: LevelFiveEconomyQaScenario, context: DomainContext): GameState {
  let state: GameState;
  if (scenario === "economy-inspection") {
    const value: unknown = checkpoint;
    if (typeof value !== "object" || value === null) throw new Error("Generate the actual M8 checkpoint with the complete level-five-run.mjs --write audit first.");
    state = deserializeGameState(JSON.stringify(value), context);
    if (state.levelFive?.inspection.run?.accumulators.observedActiveMinutes !== 2999 || state.clinicalXp < 2000)
      throw new Error("M8 inspection checkpoint must contain the reducer-earned last-minute boundary.");
  } else state = createLevelFiveEconomyState(context, { seed: "level-five-m8.01", scored: true });
  state.campaignId = `${LEVEL_FIVE_ECONOMY_QA_PREFIX}.${scenario}`;
  return gameReducer(state, { type: "SET_PAUSED", paused: true, operationId: `m8.qa.pause.${scenario}` }, context);
}
