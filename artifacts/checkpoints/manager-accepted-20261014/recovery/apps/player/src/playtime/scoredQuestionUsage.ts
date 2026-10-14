import type { GameCommand, GameState } from "@gamify-surgery/game-domain";

/** Inspect only the final accepted reducer transition, never provisional reviews. */
export function isFirstScoredAnswer(previous: GameState, next: GameState, command: GameCommand): boolean {
  if (next.operationReceipts[command.operationId]?.status !== "applied") return false;
  if (command.type !== "SUBMIT_ANSWER" && command.type !== "SUBMIT_EMPLOYEE_DISCUSSION_ANSWER") return false;
  const before = command.type === "SUBMIT_ANSWER" ? previous.encounters[command.encounterId] : previous.employeeDiscussions?.[command.discussionId];
  const after = command.type === "SUBMIT_ANSWER" ? next.encounters[command.encounterId] : next.employeeDiscussions?.[command.discussionId];
  const beforeStep = before?.steps.find((step) => step.decisionNodeId === command.decisionNodeId);
  const afterStep = after?.steps.find((step) => step.decisionNodeId === command.decisionNodeId);
  if (!beforeStep || beforeStep.answer !== null || !afterStep?.answer) return false;
  const conceptId = afterStep.answer.primaryConceptId;
  const reviewId = `review.${after!.id}.${command.decisionNodeId}`;
  return !previous.learningHistories[conceptId]?.reviews.some((review) => review.id === reviewId) &&
    Boolean(next.learningHistories[conceptId]?.reviews.some((review) => review.id === reviewId));
}
