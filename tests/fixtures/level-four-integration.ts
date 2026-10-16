import { PEDIATRIC_CLINIC_CASES } from "@gamify-surgery/clinical-content";
import {
  PROTOTYPE_DOMAIN_CONTEXT, gameReducer, getCurrentQuestion, getRoomSalePreview,
  pediatricFamilyForActor, pediatricPairAtReservation,
  type DomainContext, type GameCommand, type GameState,
} from "@gamify-surgery/game-domain";
import { createEarlyLevelFourEconomyState } from "../../tools/economy-audit/level-four-simulation";

export const M9_NOW = Date.UTC(2026, 9, 9, 12);
export const M9_PEDIATRIC_CASE_ID = "case.pediatric-clinic.groin-bulge-after-play";
export const M9_ROOMS = {
  adult: "room.economy.adult-app", pediatric: "room.economy.pediatric", wound: "room.economy.wound",
  mri: "room.economy.mri", reader: "room.m9.reading", training: "room.m9.training",
  sparePediatric: "room.m9.pediatric-spare",
} as const;
export type M9Command = { [T in GameCommand["type"]]: Omit<Extract<GameCommand, { type: T }>, "operationId"> }[GameCommand["type"]];

export function m9Apply(state: GameState, command: M9Command, id: string, context = PROTOTYPE_DOMAIN_CONTEXT): GameState {
  const next = gameReducer(state, { ...command, operationId: id } as GameCommand, context);
  const receipt = next.operationReceipts[id];
  if (receipt?.status !== "applied") throw new Error(`${id}: ${receipt?.message}`);
  return next;
}

export function m9Minute(state: GameState, context = PROTOTYPE_DOMAIN_CONTEXT): GameState {
  return m9Apply(state, { type: "ADVANCE_TICK", advancedAtRealMs: M9_NOW + state.facilityTick * 60_000 },
    `m9.tick.${state.facilityTick}`, context);
}

export function m9Until(state: GameState, predicate: (state: GameState) => boolean,
  context = PROTOTYPE_DOMAIN_CONTEXT, limit = 500): GameState {
  for (let i = 0; i < limit && !predicate(state); i++) state = m9Minute(state, context);
  if (!predicate(state)) throw new Error(`No expected phase by tick ${state.facilityTick}: ${JSON.stringify(
    state.serviceOperations.map(op => [op.id, op.status, op.resourceWaitReason, op.pathIndex, op.path.length]))}`);
  return state;
}

/** Existing prototype-authorized drafts only; no new clinical prose, balance or timing. */
export function m9ShortChartContext(includePediatric = true): DomainContext {
  const release = PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease;
  const adult = release.cases.find(clinicalCase => !clinicalCase.pediatricProfile && !clinicalCase.participant &&
    clinicalCase.routineEligible && !clinicalCase.tutorialEligible &&
    clinicalCase.earliestFacilityStage <= 1 && clinicalCase.requiredCapabilityIds.every(id => id === "capability.examination") &&
    clinicalCase.decisionNodes.length === 1 && !clinicalCase.decisionNodes[0]!.resultGateAfter &&
    clinicalCase.decisionNodes[0]!.answerChoices.every(choice => !choice.serviceRequest));
  if (!adult) throw new Error("M9 needs an existing simple outpatient adult scored case.");
  const pediatric = PEDIATRIC_CLINIC_CASES.find(clinicalCase => clinicalCase.id === M9_PEDIATRIC_CASE_ID)!;
  return { ...PROTOTYPE_DOMAIN_CONTEXT, clinicalRelease: { ...release, cases: [adult, ...includePediatric ? [pediatric] : []] } };
}

/** Real ordinary balance, room/door commands, hires, home demand, payroll and amenities. */
export function createLevelFourIntegrationState(seed = "level-four-m9-mixed", context = PROTOTYPE_DOMAIN_CONTEXT): GameState {
  // The ordinary initializer requires both protected tutorial cases. Setup has
  // no chart arrivals; a reduced published-case pool is used only during QA play.
  let state = createEarlyLevelFourEconomyState(seed, { ...context, clinicalRelease: PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease });
  state.campaignId = `campaign.qa.${seed}`;
  state.paused = true;
  const apply = (command: M9Command, id: string) => { state = m9Apply(state, command, `m9.setup.${id}`, context); };
  for (let x = 53; x <= 65; x++) apply({ type: "PLACE_ROOM", roomId: `room.m9.hall.${x}`,
    roomDefinitionId: "room.hallway", x, y: 26, orientation: 0 }, `hall.${x}`);
  for (const [definition, roomId, x, y, offset] of [
    ["room.reading", M9_ROOMS.reader, 54, 22, 2],
    ["room.training", M9_ROOMS.training, 59, 23, 1],
    ["room.pediatric_examination", M9_ROOMS.sparePediatric, 63, 23, 1],
  ] as const) {
    apply({ type: "PLACE_ROOM", roomId, roomDefinitionId: definition, x, y, orientation: 0 }, roomId);
    apply({ type: "PLACE_DOOR", roomId, doorId: `door.${roomId}`, side: "south", offset }, `door.${roomId}`);
  }
  apply({ type: "HIRE_STAFF", employeeId: "employee.m9.reader", staffRoleDefinitionId: "staff.radiologist" }, "reader");
  apply({ type: "HIRE_STAFF", employeeId: "employee.m9.pediatric-spare", staffRoleDefinitionId: "staff.app" }, "spare.app");
  apply({ type: "SET_PAUSED", paused: false }, "play");
  return state;
}

/** One command at a time through the genuine scored lifecycle. */
export function m9PumpChart(state: GameState, context = PROTOTYPE_DOMAIN_CONTEXT): GameState {
  const opened = state.openChartEncounterId ? state.encounters[state.openChartEncounterId] : null;
  if (!opened) {
    const waiting = Object.values(state.encounters).find(encounter => encounter.lifecycle === "waiting_unopened" &&
      encounter.checkInStatus === "checked_in" && !encounter.patientMovement);
    return waiting ? m9Apply(state, { type: "OPEN_CHART", encounterId: waiting.id }, `m9.chart.open.${waiting.id}`, context) : state;
  }
  const id = opened.id;
  if (opened.terminalFeedback && !opened.terminalFeedback.acknowledged) {
    return m9Apply(state, { type: "ACKNOWLEDGE_TERMINAL_FEEDBACK", encounterId: id }, `m9.chart.terminal.${id}`, context);
  }
  if (opened.resolutionReason || opened.lifecycle === "resolved_summary_available" || opened.lifecycle === "resolved") {
    return m9Apply(state, { type: "CLOSE_CHART", encounterId: id }, `m9.chart.close.${id}`, context);
  }
  const step = opened.steps[opened.currentNodeIndex];
  if (step?.status === "feedback_pending") return m9Apply(state, { type: "ACKNOWLEDGE_DECISION_FEEDBACK",
    encounterId: id, decisionNodeId: step.decisionNodeId }, `m9.chart.feedback.${id}.${opened.currentNodeIndex}`, context);
  const question = getCurrentQuestion(state, id, context);
  const family = pediatricFamilyForActor(state, "encounter", id);
  const ready = !opened.patientMovement && (!family || pediatricPairAtReservation(state, family));
  if (!question || !ready) return state;
  const choice = question.node.answerChoices.find(choice => choice.isCorrect)!;
  return m9Apply(state, { type: "SUBMIT_ANSWER", encounterId: id, decisionNodeId: question.node.id,
    answerChoiceId: choice.id, reviewedAtMs: M9_NOW + state.facilityTick * 60_000 },
    `m9.chart.answer.${id}.${opened.currentNodeIndex}`, context);
}

export function m9SellRoom(state: GameState, roomId: string, id: string, context = PROTOTYPE_DOMAIN_CONTEXT): GameState {
  const sale = getRoomSalePreview(state, roomId, context);
  if (!sale) throw new Error(`M9 sale unavailable: ${roomId}`);
  return m9Apply(state, { type: "SELL_ROOM", roomId, saleConfirmationToken: sale.confirmationToken }, id, context);
}

export function m9Learning(state: GameState) {
  return { xp: state.clinicalXp, histories: state.learningHistories, intents: state.reviewIntents };
}

/** Test-only demand control: keep MRI/global scheduling on, defer only APP clocks.
 * Reapply before a tick because maintenance may remove/recreate home clocks.
 * The actual scheduler, patient movement, reader and clinical selector still run.
 */
export function m9DeferAppDemand(state: GameState): GameState {
  const roomsByLine: Record<string, string> = {
    "income.app_consult": "room.examination", "income.pediatric_consult": "room.pediatric_examination",
    "income.wound_care": "room.wound_ostomy", "income.ostomy_support": "room.wound_ostomy",
  };
  const ticks = { ...state.nextServiceAppointmentTicks };
  for (const [line, definition] of Object.entries(roomsByLine))
    for (const room of state.rooms.filter(room => room.roomDefinitionId === definition))
      ticks[`${line}:${room.id}`] = Number.MAX_SAFE_INTEGER;
  return { ...state, nextServiceAppointmentTicks: ticks };
}
