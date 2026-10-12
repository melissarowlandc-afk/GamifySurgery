import type { DomainContext, GameState } from "@gamify-surgery/game-domain";
import { createLevelFiveInspectionQaState, inspectionQaApply } from "./level-five-inspection";

export const LEVEL_FIVE_REPORT_QA_SCENARIOS = ["inspection-finish", "inspection-report-card"] as const;
export type LevelFiveReportQaScenario = typeof LEVEL_FIVE_REPORT_QA_SCENARIOS[number];
export const LEVEL_FIVE_REPORT_QA_PREFIX = "campaign.qa.level-five-report-m7c";

/** Boundary XP/scripted admissions are QA setup; the full report is reducer-earned. */
export function createLevelFiveReportQaState(scenario: LevelFiveReportQaScenario, context: DomainContext): GameState {
  let state = createLevelFiveInspectionQaState("inspection-final", context);
  state.campaignId = `${LEVEL_FIVE_REPORT_QA_PREFIX}.${scenario}`;
  state = inspectionQaApply(state, context, { type: "SET_PAUSED", paused: false }, "m7c.qa.play.final");
  state = inspectionQaApply(state, context, { type: "ADVANCE_TICK" }, "m7c.qa.finish.final");
  if (!state.levelFive?.progress.gameFinished || state.levelFive.inspection.lastReport?.outcome !== "completed") {
    throw new Error("M7c QA must finish a real valid full-window report.");
  }
  if (scenario === "inspection-report-card") {
    state = inspectionQaApply(state, context, { type: "ACKNOWLEDGE_FINISH_PAGE" }, "m7c.qa.acknowledge");
  }
  return inspectionQaApply(state, context, { type: "SET_PAUSED", paused: true }, "m7c.qa.pause.report");
}
