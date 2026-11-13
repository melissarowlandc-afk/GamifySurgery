import {
  PROTOTYPE_DOMAIN_CONTEXT as context, createPatientPixelAppearance, gameReducer, getCurrentQuestion,
  type DomainContext, type GameCommand, type GameState,
} from "../src";
import { endoscopyReadyClinic } from "./routine-endoscopy-ready.fixture";
import { routineOrFixture } from "./routine-or-demand.fixture";

type Command = { [T in GameCommand["type"]]: Omit<Extract<GameCommand, { type: T }>, "operationId"> }[GameCommand["type"]];
export function consultCommand(state: GameState, command: Command, ctx = context) {
  const operationId = `procedure-consult.${state.facilityTick}.${Object.keys(state.operationReceipts).length}`;
  const next = gameReducer(state, { ...command, operationId } as GameCommand, ctx);
  if (next.operationReceipts[operationId]?.status !== "applied") throw new Error(next.operationReceipts[operationId]?.message);
  return next;
}
export function consultTick(state: GameState, count = 1, ctx = context) {
  for (let i = 0; i < count; i++) state = consultCommand(state, { type: "ADVANCE_TICK", advancedAtRealMs: state.createdAtRealMs + state.facilityTick * 1000 }, ctx);
  return state;
}
export function preparedProcedureConsult(kind: "endoscopy" | "operation" = "endoscopy", founder = false) {
  const clinic = kind === "endoscopy" ? endoscopyReadyClinic({ provider: !founder }) : routineOrFixture();
  const definitionId = kind === "endoscopy" ? "room.endoscopy" : "room.ambulatory_or";
  for (let i = 0; i < 600 && !clinic.state.serviceOperations.some(op => op.status === "in_service" &&
    op.frozenOperationPhases?.[op.phaseIndex]?.roomDefinitionId === definitionId); i++) clinic.advance();
  let state = clinic.state;
  const op = state.serviceOperations.find(op => op.status === "in_service" && op.frozenOperationPhases?.[op.phaseIndex]?.roomDefinitionId === definitionId);
  if (!op) throw new Error("The actual procedure did not start");
  const published = context.clinicalRelease.cases.find(c => c.id === "case.l2.colonic-lipoma.direct.typical-a")!;
  // Mechanical OR context only. Reuses unchanged question/answers; no case is
  // added to the shipped release and no new medical prose is authored.
  const mechanical = { ...published, id: "case.mechanical.operative-consult", requiredClinicalSetting: "ambulatory_surgery" as const, requiredCapabilityIds: [],
    procedureContext: {version: "procedure-context.v1" as const, mode: "live" as const, familyId: "procedure.laparoscopic_cholecystectomy",
      kind: "operation" as const, phase: "procedure" as const, allowedIncomeLineIds: [op.incomeLineId], requiredCapabilityIds: []}};
  const ctx: DomainContext = kind === "operation" ? { ...context, clinicalRelease: { ...context.clinicalRelease, cases: [...context.clinicalRelease.cases, mechanical] } } : context;
  const c = kind === "operation" ? mechanical : published;
  if (kind === "operation") op.appearance = createPatientPixelAppearance(state.campaignSeed, "compatible.consult.actor",
    c.approvedInstantiationProfiles?.[0]?.prototypeDemographics ?? c.prototypeDemographics ?? {});
  if (kind === "operation") op.procedureContext = {version: "procedure-visit.v1", familyId: mechanical.procedureContext.familyId,
    kind: "operation", demographics: {...(c.approvedInstantiationProfiles?.[0]?.prototypeDemographics ?? c.prototypeDemographics)!} as {ageYears: number; sexLabel: "Female" | "Male"}};
  const id = op.id, originalAppearance = structuredClone(op.appearance), originalName = op.displayName;
  state.nextRoutineArrivalTick = state.facilityTick + 1;
  for (let i = 0; i < 5 && !state.serviceOperations.find(op => op.id === id)?.consultEncounterId; i++) state = consultTick(state, 1, ctx);
  const encounterId = state.serviceOperations.find(op => op.id === id)?.consultEncounterId;
  if (!encounterId) throw new Error("The due procedural consult did not bind");
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  return { state, id, encounterId, originalAppearance, originalName, ctx };
}
export function answerConsult(state: GameState, id: string, ctx = context) {
  for (let i = 0; i < 20; i++) {
    const e = state.encounters[id]!;
    if (e.terminalFeedback) return e.terminalFeedback.acknowledged ? state : consultCommand(state, { type: "ACKNOWLEDGE_TERMINAL_FEEDBACK", encounterId: id }, ctx);
    const step = e.steps[e.currentNodeIndex]!;
    if (step.status === "feedback_pending") state = consultCommand(state, { type: "ACKNOWLEDGE_DECISION_FEEDBACK", encounterId: id, decisionNodeId: step.decisionNodeId }, ctx);
    else {
      const q = getCurrentQuestion(state, id, ctx);
      if (!q) throw new Error("The consult question was unavailable");
      state = consultCommand(state, { type: "SUBMIT_ANSWER", encounterId: id, decisionNodeId: q.node.id,
        answerChoiceId: q.node.answerChoices.find(c => c.isCorrect)!.id, reviewedAtMs: state.createdAtRealMs + state.facilityTick * 1000 }, ctx);
    }
  }
  throw new Error("Consult did not reach terminal feedback");
}
