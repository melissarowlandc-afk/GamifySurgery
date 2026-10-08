import { deserializeGameState, gameReducer, getCurrentQuestion, PROTOTYPE_DOMAIN_CONTEXT, serializeGameState, type GameCommand } from "../src";
import { periopFlowFixture } from "./periop-nurse-flow-fixture";

/** Shipped Level-2 rooms/doors and actual hires; all patient work below uses
 * the same commands as the chart UI. No edited steps, timers or task records.
 */
export function periopRealVisitFixture(patientCount = 1) {
  let state = periopFlowFixture(2, 2, { amenities: true }).state;
  let sequence = 0;
  const dispatch = (command: GameCommand) => {
    state = gameReducer(state, command, PROTOTYPE_DOMAIN_CONTEXT);
    return state;
  };
  const commandId = () => `periop.real.${sequence++}`;
  if (patientCount > 1) {
    dispatch({ type: "HIRE_STAFF", operationId: commandId(), employeeId: "periop.real.receptionist", staffRoleDefinitionId: "staff.receptionist" });
    for (let minute = 0; minute < 50; minute++) dispatch({ type: "ADVANCE_TICK", operationId: commandId() });
    state.retailNextOpportunityTicks["employee:periop.real.receptionist"] = Number.MAX_SAFE_INTEGER;
  }
  const patientIds = Array.from({ length: patientCount }, (_, index) => index === 0 ? "periop.real.patient" : `periop.real.patient.${index}`);
  for (const [index, id] of patientIds.entries()) dispatch({ type: "ADMIT_PATIENT", operationId: commandId(), encounterId: id,
    caseId: "case.colorectal.routine-screen", patientDisplayName: ["Maya Reed", "Liam Brooks", "Nora Vale", "Ethan Park"][index]!, arrivalClass: "routine" });
  const act = () => {
    const patients = patientIds.map((id) => state.encounters[id]!);
    const encounter = patients.find((patient) => patient.id === state.openChartEncounterId) ??
      patients.find((patient) => patient.lifecycle === "resolved_summary_available") ??
      patients.find((patient) => patient.checkInStatus === "checked_in" && ["waiting_unopened", "active_action_required"].includes(patient.lifecycle));
    if (!encounter) return;
    const id = encounter.id;
    if (encounter.lifecycle === "resolved_summary_available") {
      if (!encounter.terminalFeedback?.acknowledged) dispatch({ type: "ACKNOWLEDGE_TERMINAL_FEEDBACK", operationId: commandId(), encounterId: id });
      dispatch({ type: "CLOSE_CHART", operationId: commandId(), encounterId: id });
      return;
    }
    const step = encounter.steps[encounter.currentNodeIndex];
    if (step?.status === "feedback_pending") {
      dispatch({ type: "ACKNOWLEDGE_DECISION_FEEDBACK", operationId: commandId(), encounterId: id, decisionNodeId: step.decisionNodeId });
      return;
    }
    if (encounter.lifecycle === "active_pending_result") {
      if (state.openChartEncounterId === id) dispatch({ type: "CLOSE_CHART", operationId: commandId(), encounterId: id });
      return;
    }
    if (state.openChartEncounterId !== id && ["waiting_unopened", "active_action_required"].includes(encounter.lifecycle)) {
      dispatch({ type: "OPEN_CHART", operationId: commandId(), encounterId: id });
      return;
    }
    const question = getCurrentQuestion(state, id);
    if (question && state.attendedEncounterId === id) dispatch({ type: "SUBMIT_ANSWER", operationId: commandId(),
      encounterId: id, decisionNodeId: question.node.id, answerChoiceId: question.node.answerChoices.find((choice) => choice.isCorrect)!.id,
      reviewedAtMs: 10000 + sequence });
  };
  const advance = () => {
    act();
    if (state.paused) dispatch({ type: "SET_PAUSED", operationId: commandId(), paused: false });
    return dispatch({ type: "ADVANCE_TICK", operationId: commandId() });
  };
  const reload = () => { state = deserializeGameState(serializeGameState(state)); return state; };
  return { get state() { return state; }, advance, dispatch, commandId, patientIds, reload };
}
