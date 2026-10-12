import { deserializeGameState, type DomainContext, type GameState } from "@gamify-surgery/game-domain";
import checkpoints from "./level-five-integration-checkpoints-20261012.json";

export const LEVEL_FIVE_INTEGRATION_QA_SCENARIOS = [
  "integration-l4", "integration-build", "integration-preparing", "integration-running",
  "integration-final", "integration-finish", "integration-repeat-final", "integration-repeat", "integration-lower-repeat",
] as const;
export type LevelFiveIntegrationQaScenario = typeof LEVEL_FIVE_INTEGRATION_QA_SCENARIOS[number];
export const LEVEL_FIVE_INTEGRATION_QA_PREFIX = "campaign.qa.level-five-integration-m9";

/** Real serialized milestones from one reducer-driven journey. The browser only
 * resumes a paused save; it never computes answers or seeds goals/reports. */
export function createLevelFiveIntegrationQaState(scenario: LevelFiveIntegrationQaScenario, context: DomainContext): GameState {
  const values = checkpoints as Record<string, unknown>;
  if (!values[scenario]) throw new Error("Rebuild the M9 checkpoints with node tools/qa/level-five-integration-run.mjs --write.");
  const state = deserializeGameState(JSON.stringify(values[scenario]), context);
  state.campaignId = `${LEVEL_FIVE_INTEGRATION_QA_PREFIX}.${scenario}`;
  if (!state.paused) throw new Error("M9 watchable checkpoints must be paused.");
  return state;
}
