import { gameReducer, getCurrentQuestion, type DomainContext, type GameCommand, type GameState } from "@gamify-surgery/game-domain";
import { createLevelFiveStateQaState } from "./level-five-state";

export const LEVEL_FIVE_INSPECTION_QA_SCENARIOS = [
  "inspection-ready", "inspection-executive", "inspection-running", "inspection-final", "inspection-incomplete",
] as const;
export type LevelFiveInspectionQaScenario = typeof LEVEL_FIVE_INSPECTION_QA_SCENARIOS[number];
export const LEVEL_FIVE_INSPECTION_QA_PREFIX = "campaign.qa.level-five-inspection-m7a";

export type InspectionQaCommand = { [T in GameCommand["type"]]: Omit<Extract<GameCommand, { type: T }>, "operationId"> }[GameCommand["type"]];
export function inspectionQaApply(state: GameState, context: DomainContext, command: InspectionQaCommand, id: string): GameState {
  const next = gameReducer(state, { ...command, operationId: id } as GameCommand, context);
  if (next.operationReceipts[id]?.status !== "applied") throw new Error(`Inspection QA ${id}: ${next.operationReceipts[id]?.message}`);
  return next;
}

/** One scripted existing game-key action per minute, through ordinary commands. */
export function inspectionQaPump(state: GameState, context: DomainContext, id: string): GameState {
  const opened = state.openChartEncounterId ? state.encounters[state.openChartEncounterId] : null;
  let command: InspectionQaCommand | null = null;
  if (!opened) {
    const waiting = Object.values(state.encounters).find(encounter => encounter.lifecycle === "waiting_unopened" && encounter.checkInStatus === "checked_in" && !encounter.patientMovement);
    if (waiting) command = { type: "OPEN_CHART", encounterId: waiting.id };
  } else if (opened.terminalFeedback && !opened.terminalFeedback.acknowledged) {
    command = { type: "ACKNOWLEDGE_TERMINAL_FEEDBACK", encounterId: opened.id };
  } else if (opened.resolutionReason || ["resolved_summary_available", "resolved"].includes(opened.lifecycle)) {
    command = { type: "CLOSE_CHART", encounterId: opened.id };
  } else if (opened.steps[opened.currentNodeIndex]?.status === "feedback_pending") {
    command = { type: "ACKNOWLEDGE_DECISION_FEEDBACK", encounterId: opened.id,
      decisionNodeId: opened.steps[opened.currentNodeIndex]!.decisionNodeId };
  } else {
    const question = getCurrentQuestion(state, opened.id, context);
    if (question && !opened.patientMovement) command = { type: "SUBMIT_ANSWER", encounterId: opened.id,
      decisionNodeId: question.node.id, answerChoiceId: question.node.answerChoices.find(choice => choice.isCorrect)!.id,
      reviewedAtMs: 1_791_806_400_000 + state.facilityTick * 1000 };
  }
  return command ? inspectionQaApply(state, context, command, id) : state;
}

/** Boundary XP and scripted admissions are synthetic QA setup, never pacing evidence.
 * Every preparation/minute/answer/settlement/bill below executes the real reducer.
 */
export function createLevelFiveInspectionQaState(scenario: LevelFiveInspectionQaScenario, context: DomainContext,
  audit?: { start: (state: GameState) => void; minute: (state: GameState) => void }): GameState {
  let state = createLevelFiveStateQaState(scenario === "inspection-executive" ? "executive" : "pre-goal", context);
  state.campaignId = `${LEVEL_FIVE_INSPECTION_QA_PREFIX}.${scenario}`;
  state.campaignSeed = `level-five-inspection-m7a.${scenario}`;
  state.clinicalXp = 2000; // Explicit unlock-boundary fixture; not a zero-XP playthrough.
  if (scenario === "inspection-executive") {
    const employee = state.employees.find(employee => employee.staffRoleDefinitionId === "staff.executive")!;
    state = inspectionQaApply(state, context, { type: "SET_EMPLOYEE_SALARY", employeeId: employee.id, salaryPerExpenseInterval: 49 }, "m7a.qa.executive.pay");
    state = inspectionQaApply(state, context, { type: "SET_PAUSED", paused: false }, "m7a.qa.executive.play");
    for (let minute = 0; minute < 180 && state.levelFive!.management.round?.status !== "completed"; minute++) {
      state = inspectionQaApply(state, context, { type: "ADVANCE_TICK" }, `m7a.qa.executive.tick.${minute}`);
    }
    if (state.levelFive!.management.round?.status !== "completed") throw new Error("QA Executive did not complete its real round.");
  }
  state = inspectionQaApply(state, context, { type: "SET_PAUSED", paused: true }, "m7a.qa.unlock");
  if (!state.levelFive!.progress.inspectionUnlocked) throw new Error("Inspection QA goals did not unlock through the real command.");
  if (scenario === "inspection-ready" || scenario === "inspection-executive") return state;
  state = inspectionQaApply(state, context, { type: "BOOK_INSPECTION" }, "m7a.qa.book");
  state = inspectionQaApply(state, context, { type: "SET_PAUSED", paused: false }, "m7a.qa.play");
  while (state.levelFive!.inspection.status === "preparing") state = inspectionQaApply(state, context, { type: "ADVANCE_TICK" }, `m7a.qa.preparation.${state.facilityTick}`);
  audit?.start(state);
  if (scenario === "inspection-running") return inspectionQaApply(state, context, { type: "SET_PAUSED", paused: true }, "m7a.qa.pause.start");
  const clinicalCase = context.clinicalRelease.cases.find(candidate => !candidate.participant && !candidate.pediatricProfile && candidate.routineEligible && !candidate.tutorialEligible &&
    candidate.earliestFacilityStage <= 1 && candidate.requiredCapabilityIds.every(id => id === "capability.examination") && candidate.decisionNodes.length === 1 &&
    !candidate.decisionNodes[0]!.resultGateAfter && candidate.decisionNodes[0]!.answerChoices.every(choice => !choice.serviceRequest));
  if (!clinicalCase) throw new Error("QA needs an existing simple scored case.");
  for (let minute = 0; minute < 2999; minute++) {
    if (scenario === "inspection-final") {
      if (minute % 120 === 0) state = inspectionQaApply(state, context, { type: "ADMIT_PATIENT", encounterId: `encounter.m7a.qa.${minute / 120}`,
        caseId: clinicalCase.id, patientDisplayName: clinicalCase.patientDisplayName, arrivalClass: "routine" }, `m7a.qa.admit.${minute}`);
      state = inspectionQaPump(state, context, `m7a.qa.action.${minute}`);
    }
    state = inspectionQaApply(state, context, { type: "ADVANCE_TICK" }, `m7a.qa.window.${minute}`);
    audit?.minute(state);
  }
  if (scenario === "inspection-final" && state.levelFive!.inspection.run!.accumulators.qualifyingCompletedEncounterIds.length < 20) throw new Error("QA real scored sample is short; no completion was fabricated.");
  return inspectionQaApply(state, context, { type: "SET_PAUSED", paused: true }, "m7a.qa.pause.last");
}
