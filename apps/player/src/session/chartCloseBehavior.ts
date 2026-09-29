import type { GameState } from "@gamify-surgery/game-domain";

export type ChartFeedbackAcknowledgmentCommand =
  | {
      type: "ACKNOWLEDGE_DECISION_FEEDBACK";
      encounterId: string;
      decisionNodeId: string;
    }
  | { type: "ACKNOWLEDGE_TERMINAL_FEEDBACK"; encounterId: string };

/**
 * Closing a chart is deliberate dismissal of currently displayed feedback.
 * The caller must execute this command successfully before issuing CLOSE_CHART,
 * so a rejected clinical transition cannot hide the blocked chart.
 */
export function getChartFeedbackAcknowledgmentCommand(
  state: GameState,
  encounterId: string,
): ChartFeedbackAcknowledgmentCommand | null {
  const encounter = state.encounters[encounterId];
  const step = encounter?.steps[encounter.currentNodeIndex];
  if (step?.status === "feedback_pending") {
    return {
      type: "ACKNOWLEDGE_DECISION_FEEDBACK",
      encounterId,
      decisionNodeId: step.decisionNodeId,
    };
  }
  if (
    encounter?.lifecycle === "resolved_summary_available" &&
    encounter.terminalFeedback &&
    !encounter.terminalFeedback.acknowledged
  ) {
    return { type: "ACKNOWLEDGE_TERMINAL_FEEDBACK", encounterId };
  }
  return null;
}
