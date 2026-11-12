import type { DomainContext, GameState } from "@gamify-surgery/game-domain";
import { createLevelFiveStateQaState } from "./level-five-state";
import { inspectionQaApply } from "./level-five-inspection";

export const LEVEL_FIVE_INSPECTORS_QA_SCENARIOS = ["inspectors", "inspectors-arriving"] as const;
export type LevelFiveInspectorsQaScenario = typeof LEVEL_FIVE_INSPECTORS_QA_SCENARIOS[number];
export const LEVEL_FIVE_INSPECTORS_QA_PREFIX = "campaign.qa.level-five-inspectors-m7b";

/** Real rooms, booking, preparation and presentation travel; XP is explicit QA setup. */
export function createLevelFiveInspectorsQaState(scenario: LevelFiveInspectorsQaScenario, context: DomainContext): GameState {
  let state = createLevelFiveStateQaState("rooms", context);
  state.campaignId = `${LEVEL_FIVE_INSPECTORS_QA_PREFIX}.${scenario}`;
  state.campaignSeed = `level-five-inspectors-m7b.${scenario}`;
  state.clinicalXp = 2000;
  // Explicit clean-floor presentation QA: the small unstaffed clinic otherwise
  // spawns ordinary litter beside the Gift Shop/Garden inspector's shoes.
  // Defer only this fixture's next litter event beyond the 60 + 3000 minutes;
  // gameplay litter, its renderer and environment RNG are unchanged.
  state.environment.nextLitterSpawnTick = state.facilityTick + 60 + 3000 + 1;
  state = inspectionQaApply(state, context, { type: "SET_PAUSED", paused: true }, "m7b.qa.unlock");
  state = inspectionQaApply(state, context, { type: "BOOK_INSPECTION" }, "m7b.qa.book");
  state = inspectionQaApply(state, context, { type: "SET_PAUSED", paused: false }, "m7b.qa.play");
  while (state.levelFive!.inspection.status === "preparing")
    state = inspectionQaApply(state, context, { type: "ADVANCE_TICK" }, `m7b.qa.preparation.${state.facilityTick}`);
  if (scenario === "inspectors") for (let minute = 0; minute < 80; minute++)
    state = inspectionQaApply(state, context, { type: "ADVANCE_TICK" }, `m7b.qa.spread.${minute}`);
  return inspectionQaApply(state, context, { type: "SET_PAUSED", paused: true }, "m7b.qa.pause");
}
