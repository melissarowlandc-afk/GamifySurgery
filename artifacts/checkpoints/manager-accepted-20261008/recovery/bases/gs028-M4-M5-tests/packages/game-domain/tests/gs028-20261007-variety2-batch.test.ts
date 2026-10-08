/// <reference types="node" />
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { DIAGNOSTIC_TIMING_TABLE } from "@gamify-surgery/balance-config";
import {
  GS028_20261007_VARIETY2_CASES as cases,
  GS028_20261007_VARIETY2_TESTED_CONCEPTS as concepts,
  GS028_20261007_VARIETY2_TIMING_ENTRIES as timings,
  type SyntheticClinicalCase,
} from "@gamify-surgery/clinical-content";
import { afterAll, describe, expect, it } from "vitest";
import {
  PROTOTYPE_DOMAIN_CONTEXT, createInitialGameState, createPatientDisplayName,
  deserializeGameState, deterministicInteger, RANDOM_STREAMS,
  gameReducer, getAnswerChoiceServicePreview, getCurrentCapabilities,
  getCurrentQuestion, getDiagnosticOrderPlans, getEmployeeTrainingAvailability, getRoomDefinition,
  getRoomNavigationAnchor, selectRoutineClinicalCase, serializeGameState,
  type ConceptReviewEvidence, type DiagnosticOrderPhase, type GameState, type ServiceOperationState,
} from "../src";
import { EXACT_TEST_CHOICE_ORDER_RECORDS } from "../src/test-choice-orders";

const REAL_MS = 1_800_000_000_000;
const paired = cases.filter((item) => item.decisionNodes.length === 2);
const exact = EXACT_TEST_CHOICE_ORDER_RECORDS.filter((item) => item.caseId.startsWith("case.gs028f."));
const coverage = new Map<string, Set<string>>();
const frozenProfiles = new Set<string>();
const routingEvidence: unknown[] = [];
const choicePreviewEvidence = new Map<string, unknown>();
const eligibilityEvidence: unknown[] = [];
const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

function prepared(seed: string, stage: 0 | 1 | 2 | 3 = 0): GameState {
  const state = createInitialGameState(undefined, { campaignId: `campaign.gs028f.${seed}`, campaignSeed: seed, createdAtRealMs: REAL_MS });
  state.facilityLevel = stage;
  state.encounters = {};
  state.openChartEncounterId = null;
  state.attendedEncounterId = null;
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  state.nextFinancialPostingTick = Number.MAX_SAFE_INTEGER;
  state.serviceAppointmentsEnabled = false;
  state.environment.nextLitterSpawnTick = Number.MAX_SAFE_INTEGER;
  state.environment.nextWaterCoolerDrainTick = Number.MAX_SAFE_INTEGER;
  state.rooms.push({ id: "room.gs028f.examination", roomDefinitionId: "room.examination", x: 34, y: 26, orientation: 0, doorSide: "south", upgradeLevel: 1, cleanliness: 100 });
  state.doors.push({ id: "door.gs028f.examination", roomId: "room.gs028f.examination", side: "south", offset: 1, exterior: false });
  return state;
}

function resourceClinic(seed: string, resources: readonly string[]): GameState {
  const state = prepared(seed, 3);
  state.cash = 25_000; state.cashCents = 2_500_000;
  for (let y = 8; y <= 28; y++) state.rooms.push({ id: `room.gs028f.hall.${y}`, roomDefinitionId: "room.hallway", x: 32, y, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 });
  state.doors.push({ id: "door.gs028f.front", roomId: "room.instance.founder_desk", side: "west", offset: 0, exterior: false });
  const placements = [
    ["ct", "room.ct", "staff.imaging_technician", 28, 20, "east"],
    ["reading", "room.reading", "staff.radiologist", 33, 17, "west"],
    ["phlebotomy", "room.phlebotomy", "staff.phlebotomist", 29, 15, "east"],
    ["laboratory", "room.laboratory", "staff.laboratory_technician", 33, 23, "west"],
    ["training", "room.training", null, 33, 10, "west"],
  ] as const;
  for (const [id, definitionId, roleId, x, y, side] of placements) {
    if (!resources.includes(id)) continue;
    const room = { id: `room.gs028f.${id}`, roomDefinitionId: definitionId, x, y, orientation: 0 as const, doorSide: null, upgradeLevel: 1 as const, cleanliness: 100 };
    state.rooms.push(room);
    state.doors.push({ id: `door.gs028f.${id}`, roomId: room.id, side, offset: 1, exterior: false });
    if (!roleId) continue;
    const location = getRoomNavigationAnchor(room, getRoomDefinition(definitionId)!, "staff");
    state.employees.push({ id: `employee.gs028f.${id}`, staffRoleDefinitionId: roleId, displayName: `Fixture ${id} employee`,
      appearance: state.founder.appearance, hiredAtFacilityTick: 0, salaryPerExpenseInterval: 26,
      morale: 100, trainingLevel: 1, homeRoomInstanceId: room.id, location, path: [{ ...location }], pathIndex: 0,
      lastMovedAtFacilityTick: 0, lastPraisedAtFacilityTick: null, nextIdleActionAtFacilityTick: Number.MAX_SAFE_INTEGER, facilityTask: null });
  }
  return state;
}

function admit(state: GameState, clinicalCase: SyntheticClinicalCase, encounterId: string): GameState {
  const profiles = clinicalCase.approvedInstantiationProfiles;
  const selected = profiles?.[deterministicInteger(state.campaignSeed, RANDOM_STREAMS.clinicalPresentation, `${encounterId}|${clinicalCase.id}|approved-profile.v1`, profiles.length)];
  const name = createPatientDisplayName(state.campaignSeed, encounterId, selected?.prototypeDemographics?.sexLabel ?? clinicalCase.prototypeDemographics?.sexLabel);
  const command = { type: "ADMIT_PATIENT" as const, operationId: `${encounterId}.admit`, encounterId, caseId: clinicalCase.id, patientDisplayName: name, arrivalClass: "routine" as const };
  const next = gameReducer(state, command);
  expect(next.operationReceipts[command.operationId]?.status).toBe("applied");
  expect(gameReducer(next, command)).toBe(next);
  const frozen = next.encounters[encounterId]!.frozenCase;
  expect(frozen.selectedInstantiationProfileId).toBe(selected?.id);
  if (selected) expect(frozen.prototypeDemographics).toEqual(selected.prototypeDemographics);
  expect(frozen.presentation).toContain(name);
  expect(frozen.presentation).not.toMatch(/\{patient(?:Name|Age|Sex)\}/);
  if (selected) frozenProfiles.add(selected.id);
  return next;
}

function tick(state: GameState, id: string): GameState {
  return gameReducer(state, { type: "ADVANCE_TICK", operationId: id, advancedAtRealMs: REAL_MS });
}

function ready(state: GameState, encounterId: string, prefix: string): GameState {
  let next = state;
  for (let count = 0; count < 1_500; count++) {
    if (getCurrentQuestion(next, encounterId)) return next;
    const encounter = next.encounters[encounterId];
    if (!encounter) throw new Error(`${encounterId} disappeared before its task`);
    next = encounter.lifecycle === "waiting_unopened" && encounter.patientMovement === null
      ? gameReducer(next, { type: "OPEN_CHART", operationId: `${prefix}.open.${count}`, encounterId })
      : tick(next, `${prefix}.tick.${count}`);
  }
  throw new Error(`${encounterId} never became answer-ready`);
}

function submit(state: GameState, encounterId: string, choiceId: string, id: string, reviewedAtMs = REAL_MS): GameState {
  const question = getCurrentQuestion(state, encounterId)!;
  const command = { type: "SUBMIT_ANSWER" as const, operationId: id, encounterId, decisionNodeId: question.node.id, answerChoiceId: choiceId, reviewedAtMs };
  const next = gameReducer(state, command);
  expect(next.operationReceipts[id]?.status).toBe("applied");
  expect(gameReducer(next, command)).toBe(next);
  return next;
}

function roundTrip(state: GameState, encounterId: string): GameState {
  const encounter = clone(state.encounters[encounterId]);
  const histories = clone(state.learningHistories);
  let next: GameState;
  try {
    next = deserializeGameState(serializeGameState(state));
  } catch (error) {
    const evidenceDirectory = process.env.GS028_VARIETY2_EVIDENCE_DIR;
    if (evidenceDirectory) writeFileSync(resolve(evidenceDirectory, `save-plan-failure-${encounterId.replace(/[^a-z0-9.-]/gi, "_")}.json`), `${JSON.stringify({
      syntheticFixtureOnly: true, encounterId, caseId: encounter?.frozenCase.id, facilityTick: state.facilityTick,
      lifecycle: encounter?.lifecycle, step: encounter?.steps[encounter.currentNodeIndex],
      plan: encounter?.pendingResult?.diagnosticTiming ?? encounter?.terminalTestOrder?.diagnosticTiming,
      relatedOperations: state.serviceOperations.filter((item) => item.actorId === encounterId),
      resources: state.rooms.filter((item) => ["room.ct", "room.reading", "room.training"].includes(item.roomDefinitionId)),
      employees: state.employees.map((item) => ({ id: item.id, role: item.staffRoleDefinitionId, location: item.location, training: item.training })),
      error: error instanceof Error ? error.message : String(error),
    }, null, 2)}\n`);
    throw error;
  }
  // Assert the exact existing central loader rules: overdue cosmetic idle
  // timers are renewed, and an open chart resets only its attention timestamps.
  // No clinical/satisfaction value, frozen order identity, route, phase,
  // ready time, narrative or learning history is ignored.
  if (encounter && encounter.nextIdleActionAtFacilityTick < state.facilityTick) {
    encounter.nextIdleActionAtFacilityTick = state.facilityTick + PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.environment.idleActionMinimumMinutes;
  }
  if (encounter && state.openChartEncounterId === encounterId) {
    encounter.idleWaitingSinceTick = null;
    encounter.lastSatisfactionDecayAtTick = state.facilityTick;
    encounter.feedAttentionKind = null;
    encounter.feedAttentionStartedAtTick = null;
  }
  expect(clone(next.encounters[encounterId])).toEqual(encounter);
  expect(next.learningHistories).toEqual(histories);
  return next;
}

function acknowledge(state: GameState, encounterId: string, id: string): GameState {
  const encounter = state.encounters[encounterId]!;
  const command = { type: "ACKNOWLEDGE_DECISION_FEEDBACK" as const, operationId: id, encounterId, decisionNodeId: encounter.steps[encounter.currentNodeIndex]!.decisionNodeId };
  const next = gameReducer(state, command);
  expect(next.operationReceipts[id]?.status).toBe("applied");
  expect(gameReducer(next, command)).toBe(next);
  return next;
}

function waitResult(state: GameState, encounterId: string, prefix: string): GameState {
  let next = state;
  for (let count = 0; count < 1_500; count++) {
    if (next.encounters[encounterId]?.pendingResult?.deliveredAtTick != null) return next;
    expect(getCurrentQuestion(next, encounterId)).toBeNull();
    expect(next.encounters[encounterId]?.deliveredResultNarratives).toEqual([]);
    next = tick(next, `${prefix}.${count}`);
  }
  throw new Error(`${encounterId} never received its CT result`);
}

function waitCare(state: GameState, encounterId: string, prefix: string): GameState {
  let next = state;
  for (let count = 0; count < 1_500; count++) {
    const plans = getDiagnosticOrderPlans(next).filter((plan) => plan.encounterId === encounterId);
    if (plans.every((plan) => plan.careComplete.reachedAtTick !== null)) return next;
    next = tick(next, `${prefix}.${count}`);
  }
  throw new Error(`${encounterId} diagnostic care did not finish`);
}

function closeAndDepart(state: GameState, encounterId: string, prefix: string): GameState {
  const command = { type: "ACKNOWLEDGE_TERMINAL_FEEDBACK" as const, operationId: `${prefix}.terminal`, encounterId };
  let next = gameReducer(state, command);
  expect(next.operationReceipts[command.operationId]?.status).toBe("applied");
  expect(gameReducer(next, command)).toBe(next);
  const close = { type: "CLOSE_CHART" as const, operationId: `${prefix}.close`, encounterId };
  next = gameReducer(next, close);
  expect(next.operationReceipts[close.operationId]?.status).toBe("applied");
  expect(gameReducer(next, close)).toBe(next);
  expect(next.encounters[encounterId]?.lifecycle).toBe("resolved");
  for (let count = 0; count < 1_500; count++) {
    const encounter = next.encounters[encounterId];
    if (encounter?.patientLocation === null && encounter.patientMovement === null) return next;
    next = tick(next, `${prefix}.depart.${count}`);
  }
  throw new Error(`${encounterId} did not depart`);
}

function assertPreviews(state: GameState, encounterId: string, mode: string): void {
  const question = getCurrentQuestion(state, encounterId)!;
  const entry = timings.find((item) => item.nodeId === question.node.id)!;
  for (const choice of question.node.answerChoices) {
    const timing = entry.classification.kind === "test_choices" ? entry.classification.choices.find((item) => item.choiceId === choice.id)!.timing : { kind: "no_test" } as const;
    const before = JSON.stringify(state);
    const preview = getAnswerChoiceServicePreview(state, encounterId, choice.id);
    expect(JSON.stringify(state)).toBe(before);
    if (timing.kind === "no_test") {
      if (entry.classification.kind === "no_test") expect(preview, `${question.node.id}/${choice.id}`).toBeNull();
      else expect(preview).toEqual({ kind: "no_test", answerChoiceId: choice.id, durationTicks: null,
        serviceId: null, serviceDisplayName: null, routeId: null, routeDisplayName: null, timingProfileId: null });
      continue;
    }
    const record = exact.find((item) => item.nodeId === question.node.id && item.choiceId === choice.id)!;
    expect(preview).toMatchObject({ kind: "test", timingProfileId: timing.timingProfileId });
    const plan = preview!.diagnosticTiming!;
    expect(plan).toBeDefined();
    expect(plan.execution).toBe(record.disposition.kind === "not_executed" ? "preview_only" : "supported");
    if (preview!.durationTicks !== null) {
      expect(preview!.durationTicks).toBeGreaterThan(0);
      expect(preview!.durationTicks).toBe(Math.max(...plan.phases.map((phase) => phase.forecast.endsAtTick)) - state.facilityTick);
    }
    choicePreviewEvidence.set(`${question.node.id}|${choice.id}|${mode}`, { caseId: entry.caseId, nodeId: question.node.id,
      questionVariantId: question.node.questionVariantId, choiceId: choice.id, choiceLabel: choice.label, mode, preview });
  }
}

function noExtraService(state: GameState, encounterId: string): void {
  expect(state.serviceOperations.filter((item) => item.actorId === encounterId)).toEqual([]);
  expect(state.serviceIncomeReceipts.filter((item) => item.actorId === encounterId)).toEqual([]);
  expect(state.encounters[encounterId]?.terminalTestOrder).toBeUndefined();
}

function occupyResource(state: GameState, roomId: string, roleId: string, incomeLineId: string, minutes: number): void {
  const room = state.rooms.find((item) => item.id === roomId)!;
  const employee = state.employees.find((item) => item.staffRoleDefinitionId === roleId)!;
  // A concrete already-started legacy job occupies the real room/employee.
  // Its remaining frozen duration is a fixture value, not a new clinical ETA.
  const id = `existing.${incomeLineId}`;
  const operation: ServiceOperationState = {
    id, incomeLineId, catalogVersion: 1, actorKind: "remote", actorId: id,
    displayName: "Existing resource reservation", appearance: null, status: "in_service",
    createdAtFacilityTick: state.facilityTick, waitDeadlineFacilityTick: state.facilityTick + minutes,
    startedAtFacilityTick: state.facilityTick, completedAtFacilityTick: null, cancelledAtFacilityTick: null,
    quoteFee: 0, phaseIndex: 0, phaseStartedAtFacilityTick: state.facilityTick, phaseEndsAtFacilityTick: state.facilityTick + minutes,
    reservedRoomInstanceIds: [room.id], reservedEmployeeIds: [employee.id], providerReservation: null,
    location: null, path: [], pathIndex: 0, lastMovedAtFacilityTick: state.facilityTick, cancellationReason: null,
    frozenOperationPhases: [{ id: "existing.work", roomDefinitionId: room.roomDefinitionId, durationMinutes: minutes, staffRoleDefinitionIds: [roleId] }],
  };
  state.serviceOperations.push(operation);
  employee.facilityTask = { kind: "perform_service", targetId: id, startedAtFacilityTick: state.facilityTick, workMinutesRemaining: minutes };
}

function leaveForTraining(state: GameState, roleId: string, prefix: string): GameState {
  const employee = state.employees.find((item) => item.staffRoleDefinitionId === roleId)!;
  const command = { type: "TRAIN_EMPLOYEE" as const, operationId: `${prefix}.train`, employeeId: employee.id };
  let next = gameReducer(state, command);
  expect(next.operationReceipts[command.operationId]?.status).toBe("applied");
  for (let count = 0; count < 200; count++) {
    if (next.employees.find((item) => item.id === employee.id)?.training?.stage !== "queued") break;
    next = tick(next, `${prefix}.leave.${count}`);
  }
  expect(next.employees.find((item) => item.id === employee.id)?.training?.stage).toMatch(/walking_to_training|training/);
  return next;
}

function assertTrainingReturnReservation(state: GameState, roleId: string, phase: DiagnosticOrderPhase): void {
  const employee = state.employees.find((item) => item.staffRoleDefinitionId === roleId)!;
  const availability = getEmployeeTrainingAvailability(state, employee);
  expect(availability.kind).toBe("returning_at");
  if (availability.kind !== "returning_at") throw new Error("The reachable training fixture requires a known return.");
  expect(phase.mode).toBe("local");
  expect(phase.resource?.employeeIds).toContain(employee.id);
  // Central reservations resume on the tick after the employee reaches home.
  expect(phase.forecast.startsAtTick).toBeGreaterThanOrEqual(availability.availableAtTick + 1);
  expect(phase.forecast.employeePaths.find((item) => item.employeeId === employee.id)?.path[0]).toEqual(availability.homeLocation);
}

function assertNeutralPregnancyLabQuotes(state: GameState, encounterId: string): void {
  const question = getCurrentQuestion(state, encounterId)!;
  const quotes = question.node.answerChoices.map((choice) => getAnswerChoiceServicePreview(state, encounterId, choice.id)!);
  const publicTiming = (quote: typeof quotes[number]) => ({ routeId: quote.routeId, durationTicks: quote.durationTicks,
    timingProfileId: quote.timingProfileId,
    phases: quote.diagnosticTiming!.phases.map((phase) => ({ kind: phase.kind, mode: phase.mode, durationMinutes: phase.durationMinutes,
      readyAtTick: phase.forecast.readyAtTick, startsAtTick: phase.forecast.startsAtTick, endsAtTick: phase.forecast.endsAtTick })) });
  expect(quotes).toHaveLength(4);
  for (const quote of quotes) expect(publicTiming(quote)).toEqual(publicTiming(quotes[0]!));
  expect(quotes.filter((quote) => quote.diagnosticTiming!.execution === "supported")).toHaveLength(1);
  expect(quotes.filter((quote) => quote.diagnosticTiming!.execution === "preview_only")).toHaveLength(3);
}

function complete(clinicalCase: SyntheticClinicalCase, path: "correct" | 0 | 1 | 2, index: number): void {
  const id = `encounter.gs028f.flow.${index}.${path}`;
  let state = ready(admit(prepared(`${index}.${path}`), clinicalCase, id), id, `${id}.initial`);
  state = roundTrip(state, id);
  for (let nodeIndex = 0; nodeIndex < clinicalCase.decisionNodes.length; nodeIndex++) {
    const node = clinicalCase.decisionNodes[nodeIndex]!;
    state = ready(state, id, `${id}.${nodeIndex}.ready`);
    assertPreviews(state, id, "beginning");
    const question = getCurrentQuestion(state, id)!;
    expect(question.node.id).toBe(node.id);
    expect(question.node.answerChoices.map((item) => item.id).sort()).toEqual(node.answerChoices.map((item) => item.id).sort());
    const choice = path === "correct" ? node.answerChoices.find((item) => item.isCorrect)! : node.answerChoices.filter((item) => !item.isCorrect)[path]!;
    const xp = state.clinicalXp;
    state = submit(state, id, choice.id, `${id}.${nodeIndex}.answer`, REAL_MS + index * 100 + nodeIndex);
    expect(state.clinicalXp - xp).toBe(path === "correct" ? PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.clinicalSettlement.clinicalXpPerCorrectFirstAnswer : PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.clinicalSettlement.clinicalXpPerIncorrectFirstAnswer);
    expect(state.learningHistories[node.primaryConceptId]?.reviews).toEqual([expect.objectContaining({ answerChoiceId: choice.id, correct: path === "correct", rating: path === "correct" ? "Good" : "Again" })]);
    expect(state.learningHistories[node.primaryConceptId]?.card.reps).toBe(1);
    expect(state.encounters[id]?.steps[nodeIndex]?.answer).toMatchObject({ answerChoiceId: choice.id, correctedForward: path !== "correct" && nodeIndex < clinicalCase.decisionNodes.length - 1 });
    const seen = coverage.get(node.id) ?? new Set<string>(); seen.add(choice.id); coverage.set(node.id, seen);
    if (nodeIndex === clinicalCase.decisionNodes.length - 1) {
      const record = exact.find((item) => item.nodeId === node.id && item.choiceId === choice.id);
      if (path === "correct" && record?.disposition.kind === "terminal_service") {
        expect(state.encounters[id]?.terminalTestOrder).toMatchObject({ choiceId: choice.id, nodeId: node.id, serviceId: "service.basic_labs", routeId: "route.basic_labs.outsourced", status: "external_arranged", diagnosticTiming: { execution: "supported" } });
        state = roundTrip(state, id);
        state = waitCare(state, id, `${id}.terminal-care`);
        expect(state.serviceIncomeReceipts.filter((item) => item.actorId === id)).toEqual([]);
      } else noExtraService(state, id);
      continue;
    }
    const gate = node.resultGateAfter!;
    const key = node.answerChoices.find((item) => item.isCorrect)!;
    const orderId = `diagnostic.${id}.${node.id}.${key.id}`;
    const pending = state.encounters[id]!.pendingResult!;
    expect(pending).toMatchObject({ operationId: orderId, gateId: gate.id, routeId: "route.ct.outsourced", resultTypeId: "service.ct", resultNarrative: gate.resultNarrative, deliveredAtTick: null });
    expect(pending.diagnosticTiming).toMatchObject({ orderId, execution: "supported", timingVersion: "diagnostic-timing.v1" });
    expect(state.encounters[id]?.deliveredResultNarratives).toEqual([]);
    expect(state.learningHistories[clinicalCase.decisionNodes[1]!.primaryConceptId]?.reviews).toEqual([]);
    expect(getCurrentQuestion(state, id)).toBeNull();
    noExtraService(state, id);
    state = acknowledge(state, id, `${id}.${nodeIndex}.ack`);
    state = roundTrip(state, id);
    state = waitResult(state, id, `${id}.${nodeIndex}.result`);
    expect(state.encounters[id]?.pendingResult?.operationId).toBe(orderId);
    expect(state.encounters[id]?.deliveredResultNarratives).toEqual([gate.resultNarrative]);
    state = ready(roundTrip(state, id), id, `${id}.${nodeIndex}.returned`);
    expect(getCurrentQuestion(state, id)?.node.currentUpdate).toBe(gate.resultNarrative);
    expect(getCurrentQuestion(state, id)?.resultNarratives).toEqual([gate.resultNarrative]);
  }
  expect(state.encounters[id]?.lifecycle).toBe("resolved_summary_available");
  state = roundTrip(state, id);
  state = closeAndDepart(state, id, id);
  for (const node of clinicalCase.decisionNodes) expect(state.learningHistories[node.primaryConceptId]?.reviews).toHaveLength(1);
  roundTrip(state, id);
}

function markReviewed(state: GameState, id: string, dueAtMs: number): void {
  const template = Object.values(state.learningHistories)[0]!;
  state.learningHistories[id] = { conceptId: id, card: { ...template.card, dueAtMs, lastReviewAtMs: REAL_MS - 10_000, reps: 1 }, reviews: [{} as ConceptReviewEvidence] };
}
function standalone(id: string): SyntheticClinicalCase {
  const clinicalCase = cases.find((item) => item.decisionNodes.length === 1 && item.decisionNodes[0]!.primaryConceptId === id);
  if (!clinicalCase) throw new Error(`${id} lacks an independent sibling`);
  return clinicalCase;
}
function ordinaryPool(state: GameState): SyntheticClinicalCase[] {
  const capabilities = getCurrentCapabilities(state);
  return PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.filter((item) => item.participant?.kind !== "employee_discussion" && item.routineEligible && item.earliestFacilityStage <= state.facilityLevel && item.requiredCapabilityIds.every((id) => capabilities.has(id)));
}
const pools = ([0, 1, 2] as const).map((stage) => {
  const state = prepared(`pool.${stage}`, stage);
  const admitted = ordinaryPool(state);
  const old = admitted.filter((item) => !item.id.startsWith("case.gs028f."));
  const count = (items: SyntheticClinicalCase[]) => ({ cases: items.length, concepts: new Set(items.flatMap((item) => item.decisionNodes.map((node) => node.primaryConceptId))).size });
  return { stage, before: count(old), after: count(admitted) };
});

describe("GS-028 second October 7 actual gameplay", () => {
  it("binds every one of twenty-six testing choices with exactly five executable correct orders", () => {
    expect(exact).toHaveLength(26);
    expect(exact.filter((item) => item.disposition.kind === "terminal_service")).toHaveLength(3);
    expect(exact.filter((item) => item.disposition.kind === "result_gate_route_override")).toHaveLength(2);
    expect(exact.filter((item) => item.disposition.kind === "not_executed")).toHaveLength(21);
    for (const record of exact) {
      const clinicalCase = cases.find((item) => item.id === record.caseId)!;
      const node = clinicalCase.decisionNodes.find((item) => item.id === record.nodeId)!;
      const choice = node.answerChoices.find((item) => item.id === record.choiceId)!;
      expect(record.choiceLabel).toBe(choice.label);
      expect(record.questionVariantId).toBe(node.questionVariantId);
      const entry = timings.find((item) => item.nodeId === node.id)!;
      if (entry.classification.kind !== "test_choices") throw new Error("Missing testing metadata");
      expect(entry.classification.choices.find((item) => item.choiceId === record.choiceId)!.timing).toEqual({ kind: "test", timingProfileId: record.timingProfileId });
      if (!choice.isCorrect) expect(record.disposition.kind).toBe("not_executed");
      if (record.disposition.kind === "result_gate_route_override") {
        expect(record.disposition.allowedRouteIds).toEqual(["route.ct.in_house", "route.ct.outsourced"]);
        expect(record.disposition.allowOnsiteEquivalents).not.toBe(false);
      }
      if (record.disposition.kind === "terminal_service") expect(record.disposition.allowedRouteIds).toEqual(["route.basic_labs.phlebotomy_sendout", "route.basic_labs.outsourced"]);
    }
  });

  it.each(cases.map((item, index) => [index, item] as const))("completes every correct node, saves and departs in case %s", (index, item) => complete(item, "correct", index));
  it.each(cases.flatMap((item, index) => ([0, 1, 2] as const).map((path) => [index, path, item] as const)))("completes wrong choice %s/%s exactly once with supported corrected-forward work", (index, path, item) => complete(item, path, index));

  it.each(paired.flatMap((item) => (["offsite", "local_acquisition", "local_reading", "local_both", "no_technician", "no_reader", "busy_acquisition", "busy_reading", "away_acquisition", "away_reading"] as const)
    .map((mode) => [item.id, mode, item] as const)))("executes the actual CT pair %s with %s capacity", (_caseId, mode, clinicalCase) => {
    const id = `encounter.gs028f.ct.${mode}.${clinicalCase.id}`;
    const resources = mode === "offsite" ? [] : mode === "local_acquisition" ? ["ct"] : mode === "local_reading" ? ["reading"] : ["ct", "reading", "training"];
    let state = ready(admit(resourceClinic(id, resources), clinicalCase, id), id, `${id}.ready`);
    if (mode === "no_technician") state.employees = state.employees.filter((item) => item.staffRoleDefinitionId !== "staff.imaging_technician");
    if (mode === "no_reader") state.employees = state.employees.filter((item) => item.staffRoleDefinitionId !== "staff.radiologist");
    if (mode === "busy_acquisition") occupyResource(state, "room.gs028f.ct", "staff.imaging_technician", "income.ct", 20);
    if (mode === "busy_reading") occupyResource(state, "room.gs028f.reading", "staff.radiologist", "income.image_read", 200);
    if (mode === "away_acquisition") state = leaveForTraining(state, "staff.imaging_technician", id);
    if (mode === "away_reading") state = leaveForTraining(state, "staff.radiologist", id);
    assertPreviews(state, id, mode);
    const question = getCurrentQuestion(state, id)!;
    const key = question.node.answerChoices.find((item) => item.isCorrect)!;
    const preview = getAnswerChoiceServicePreview(state, id, key.id)!;
    const plan = preview.diagnosticTiming!;
    const acquisition = plan.phases.find((phase) => phase.kind === "acquisition")!;
    const reading = plan.phases.find((phase) => phase.kind === "interpretation")!;
    const localAcquisition = !["offsite", "local_reading", "no_technician"].includes(mode);
    const localReading = !["offsite", "local_acquisition", "no_reader"].includes(mode);
    expect(acquisition.mode).toBe(localAcquisition ? "local" : "external");
    expect(reading.mode).toBe(localReading ? "local" : "external");
    expect(preview.routeId).toBe(localAcquisition ? "route.ct.in_house" : "route.ct.outsourced");
    const route = PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.services.find((item) => item.id === "service.ct")!.routes.find((item) => item.id === preview.routeId)!;
    const expectedAcquisition = localAcquisition ? route.timingPhases!.find((phase) => phase.resourceBound)!.durationTicks : route.durationTicks - DIAGNOSTIC_TIMING_TABLE.imaging.offsiteInterpretationMinutes;
    expect(acquisition.durationMinutes).toBe(expectedAcquisition);
    expect(reading.durationMinutes).toBe(localReading ? DIAGNOSTIC_TIMING_TABLE.imaging.onsiteInterpretationMinutes : DIAGNOSTIC_TIMING_TABLE.imaging.offsiteInterpretationMinutes);
    if (mode === "busy_acquisition") expect(acquisition.forecast.queueMinutes).toBeGreaterThan(0);
    if (mode === "busy_reading") expect(reading.forecast.queueMinutes).toBeGreaterThan(0);
    if (mode === "away_acquisition") assertTrainingReturnReservation(state, "staff.imaging_technician", acquisition);
    if (mode === "away_reading") assertTrainingReturnReservation(state, "staff.radiologist", reading);
    const beforeHistory = clone(state.learningHistories[question.node.primaryConceptId]);
    const wrong = mode === "busy_acquisition" || mode === "away_reading";
    const chosen = wrong ? question.node.answerChoices.find((item) => !item.isCorrect)! : key;
    state = submit(state, id, chosen.id, `${id}.answer`);
    const pending = state.encounters[id]!.pendingResult!;
    expect(pending.operationId).toBe(`diagnostic.${id}.${question.node.id}.${key.id}`);
    expect(pending.routeId).toBe(preview.routeId);
    expect(pending.diagnosticTiming!.phases.map((phase) => [phase.id, phase.kind, phase.mode, phase.durationMinutes]))
      .toEqual(plan.phases.map((phase) => [phase.id, phase.kind, phase.mode, phase.durationMinutes]));
    expect(state.learningHistories[question.node.primaryConceptId]!.reviews).toHaveLength(beforeHistory!.reviews.length + 1);
    expect(state.encounters[id]?.answers).toEqual([expect.objectContaining({ answerChoiceId: chosen.id, correctedForward: wrong })]);
    expect(state.encounters[id]?.deliveredResultNarratives).toEqual([]);
    state = acknowledge(state, id, `${id}.ack`);
    state = roundTrip(state, id);
    state = waitResult(state, id, `${id}.result`);
    expect(getDiagnosticOrderPlans(state).find((item) => item.encounterId === id)?.careComplete.reachedAtTick).not.toBeNull();
    expect(getDiagnosticOrderPlans(state).find((item) => item.encounterId === id)?.resultReady.reachedAtTick).not.toBeNull();
    state = ready(roundTrip(state, id), id, `${id}.returned`);
    expect(getCurrentQuestion(state, id)?.node.currentUpdate).toBe(question.node.resultGateAfter!.resultNarrative);
    assertPreviews(state, id, mode);
    const serviceBefore = clone(state.serviceOperations.filter((item) => item.actorId === id));
    const receiptsBefore = clone(state.serviceIncomeReceipts.filter((item) => item.actorId === id));
    const tissue = getCurrentQuestion(state, id)!;
    state = submit(state, id, tissue.node.answerChoices.find((item) => item.isCorrect)!.id, `${id}.fna`);
    expect(state.encounters[id]?.terminalTestOrder).toBeUndefined();
    expect(clone(state.serviceOperations.filter((item) => item.actorId === id))).toEqual(serviceBefore);
    expect(clone(state.serviceIncomeReceipts.filter((item) => item.actorId === id))).toEqual(receiptsBefore);
    if (localAcquisition) {
      expect(serviceBefore.filter((item) => item.diagnosticPhysicalWork)).toHaveLength(1);
      expect(receiptsBefore.filter((item) => item.incomeLineId === "income.ct")).toHaveLength(1);
    } else expect(receiptsBefore).toEqual([]);
    if (localReading) expect(serviceBefore.filter((item) => item.diagnosticPhaseWork?.kind === "interpretation")).toHaveLength(1);
    expect(receiptsBefore.some((item) => item.incomeLineId === "income.image_read" || item.incomeLineId === "income.thyroid_fna")).toBe(false);
    routingEvidence.push({ caseId: clinicalCase.id, mode, routeId: pending.routeId,
      acceptedPhases: pending.diagnosticTiming!.phases.map((phase) => ({ kind: phase.kind, mode: phase.mode, durationMinutes: phase.durationMinutes })),
      actualOperations: serviceBefore.map((item) => ({ incomeLineId: item.incomeLineId, status: item.status, physical: Boolean(item.diagnosticPhysicalWork), phase: item.diagnosticPhaseWork?.kind })), receipts: receiptsBefore });
    state = closeAndDepart(roundTrip(state, id), id, id);
    roundTrip(state, id);
  });

  it.each(exact.filter((item) => item.disposition.kind === "terminal_service").flatMap((record) => (["offsite", "collection_only", "local_processing", "no_collector", "no_processor", "busy_collection", "busy_processing", "away_collection", "away_processing"] as const)
    .map((mode) => [record.caseId, mode, record] as const)))("executes genuine serum hCG %s with %s capacity", (_caseId, mode, record) => {
    const clinicalCase = cases.find((item) => item.id === record.caseId)!;
    const id = `encounter.gs028f.hcg.${mode}.${record.caseId}`;
    const resources = mode === "offsite" ? [] : mode === "collection_only" ? ["phlebotomy"] : ["phlebotomy", "laboratory", "training"];
    let state = ready(admit(resourceClinic(id, resources), clinicalCase, id), id, `${id}.ready`);
    if (mode === "no_collector") state.employees = state.employees.filter((item) => item.staffRoleDefinitionId !== "staff.phlebotomist");
    if (mode === "no_processor") state.employees = state.employees.filter((item) => item.staffRoleDefinitionId !== "staff.laboratory_technician");
    if (mode === "busy_collection") occupyResource(state, "room.gs028f.phlebotomy", "staff.phlebotomist", "income.basic_labs", 20);
    if (mode === "busy_processing") occupyResource(state, "room.gs028f.laboratory", "staff.laboratory_technician", "income.laboratory_processing", 60);
    if (mode === "away_collection") state = leaveForTraining(state, "staff.phlebotomist", id);
    if (mode === "away_processing") state = leaveForTraining(state, "staff.laboratory_technician", id);
    assertPreviews(state, id, mode);
    assertNeutralPregnancyLabQuotes(state, id);
    const preview = getAnswerChoiceServicePreview(state, id, record.choiceId)!;
    const plan = preview.diagnosticTiming!;
    const collection = plan.phases.find((phase) => phase.kind === "collection")!;
    const localCollection = !["offsite", "no_collector"].includes(mode);
    const localProcessing = localCollection && !["collection_only", "no_processor"].includes(mode);
    expect(collection.mode).toBe(localCollection ? "local" : "external");
    expect(preview.routeId).toBe(localCollection ? "route.basic_labs.phlebotomy_sendout" : "route.basic_labs.outsourced");
    expect(collection.durationMinutes).toBe(localCollection ? DIAGNOSTIC_TIMING_TABLE.collectedLab.onsiteCollectionMinutes : DIAGNOSTIC_TIMING_TABLE.collectedLab.offsiteTotalMinutes);
    if (localCollection) {
      const processing = plan.phases.find((phase) => phase.kind === "laboratory_processing")!;
      expect(processing.mode).toBe(localProcessing ? "local" : "external");
      expect(processing.durationMinutes).toBe(localProcessing ? DIAGNOSTIC_TIMING_TABLE.collectedLab.onsiteProcessingMinutes : DIAGNOSTIC_TIMING_TABLE.collectedLab.offsiteProcessingMinutes);
      if (mode === "busy_processing") expect(processing.forecast.queueMinutes).toBeGreaterThan(0);
    }
    if (mode === "busy_collection") expect(collection.forecast.queueMinutes).toBeGreaterThan(0);
    if (mode === "away_collection") assertTrainingReturnReservation(state, "staff.phlebotomist", collection);
    if (mode === "away_processing") assertTrainingReturnReservation(state, "staff.laboratory_technician", plan.phases.find((phase) => phase.kind === "laboratory_processing")!);
    state = submit(state, id, record.choiceId, `${id}.answer`);
    expect(state.encounters[id]?.terminalTestOrder).toMatchObject({ choiceId: record.choiceId, serviceId: "service.basic_labs", routeId: preview.routeId, diagnosticTiming: { execution: "supported" } });
    const accepted = state.encounters[id]!.terminalTestOrder!.diagnosticTiming!;
    expect(accepted.phases.map((phase) => [phase.id, phase.kind, phase.mode, phase.durationMinutes]))
      .toEqual(plan.phases.map((phase) => [phase.id, phase.kind, phase.mode, phase.durationMinutes]));
    state = roundTrip(state, id);
    state = waitCare(state, id, `${id}.care`);
    for (let count = 0; count < 1_500 && state.encounters[id]!.terminalTestOrder!.diagnosticTiming!.resultReady.reachedAtTick === null; count++) state = tick(state, `${id}.processing.${count}`);
    expect(state.encounters[id]!.terminalTestOrder!.diagnosticTiming!.resultReady.reachedAtTick).not.toBeNull();
    const operations = state.serviceOperations.filter((item) => item.actorId === id);
    const receipts = state.serviceIncomeReceipts.filter((item) => item.actorId === id);
    expect(operations.filter((item) => item.diagnosticPhysicalWork)).toHaveLength(localCollection ? 1 : 0);
    expect(operations.filter((item) => item.diagnosticPhaseWork?.kind === "laboratory_processing")).toHaveLength(localProcessing ? 1 : 0);
    expect(receipts).toHaveLength(localCollection ? 1 : 0);
    expect(receipts.some((item) => item.incomeLineId === "income.laboratory_processing")).toBe(false);
    expect(state.learningHistories[clinicalCase.decisionNodes[0]!.primaryConceptId]?.reviews).toHaveLength(1);
    routingEvidence.push({ caseId: clinicalCase.id, mode, routeId: preview.routeId,
      acceptedPhases: accepted.phases.map((phase) => ({ kind: phase.kind, mode: phase.mode, durationMinutes: phase.durationMinutes })),
      actualOperations: operations.map((item) => ({ incomeLineId: item.incomeLineId, status: item.status, physical: Boolean(item.diagnosticPhysicalWork), phase: item.diagnosticPhaseWork?.kind })), receipts });
    state = closeAndDepart(roundTrip(state, id), id, id);
    roundTrip(state, id);
  });

  it("instantiates every permitted age/sex profile with a real generated name and shuffled stable choice IDs", () => {
    for (const clinicalCase of cases) {
      const orders = new Set<string>();
      for (const profile of clinicalCase.approvedInstantiationProfiles!) {
        let matched = false;
        for (let seed = 0; seed < 64; seed++) {
          const id = `profile.${clinicalCase.id}.${profile.id}.${seed}`;
          const state = prepared(id);
          const index = deterministicInteger(state.campaignSeed, RANDOM_STREAMS.clinicalPresentation, `${id}|${clinicalCase.id}|approved-profile.v1`, clinicalCase.approvedInstantiationProfiles!.length);
          if (clinicalCase.approvedInstantiationProfiles![index]!.id !== profile.id) continue;
          const admitted = admit(state, clinicalCase, id);
          const frozen = admitted.encounters[id]!.frozenCase;
          expect(frozen.prototypeDemographics).toEqual(profile.prototypeDemographics);
          expect(frozen.presentation).toContain(`${profile.prototypeDemographics!.ageYears}-year-old ${profile.prototypeDemographics!.sexLabel === "Female" ? "woman" : "man"}`);
          orders.add(frozen.decisionNodes[0]!.answerChoices.map((choice) => choice.id).join("|"));
          matched = true; break;
        }
        expect(matched, `${clinicalCase.id}/${profile.id}`).toBe(true);
      }
      for (let seed = 0; seed < 6 && orders.size < 2; seed++) {
        const id = `shuffle.${clinicalCase.id}.${seed}`;
        const state = admit(prepared(id), clinicalCase, id);
        orders.add(state.encounters[id]!.frozenCase.decisionNodes[0]!.answerChoices.map((choice) => choice.id).join("|"));
      }
      expect(orders.size, clinicalCase.id).toBeGreaterThan(1);
    }
    expect(frozenProfiles.size).toBe(294);
  });

  it.each([0, 1, 2] as const)("selects each admitted unseen/due concept and rejects future/unresolved siblings at stage %s", (stage) => {
    for (const target of concepts) {
      for (const kind of ["new_concept", "due_review"] as const) {
        const state = prepared(`${stage}.${kind}.${target.id}`, stage);
        for (const concept of PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.concepts) if (concept.id !== target.id || kind === "due_review") markReviewed(state, concept.id, concept.id === target.id ? REAL_MS - 1 : REAL_MS + 86_400_000);
        const pool = ordinaryPool(state);
        const result = selectRoutineClinicalCase(state, pool, REAL_MS);
        expect(result).toMatchObject({ kind, selectedConceptId: target.id });
        expect(result!.clinicalCase.decisionNodes).toHaveLength(1);
        eligibilityEvidence.push({ stage, conceptId: target.id, kind, caseId: result!.clinicalCase.id, admittedPoolSize: pool.length, allOtherAdmittedConceptsFuture: true });
      }
      let unresolved = prepared(`${stage}.unresolved.${target.id}`, stage);
      for (const concept of PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.concepts) if (concept.id !== target.id) markReviewed(unresolved, concept.id, REAL_MS + 86_400_000);
      unresolved = admit(unresolved, standalone(target.id), `unresolved.${stage}.${target.id}`);
      expect(selectRoutineClinicalCase(unresolved, ordinaryPool(unresolved), REAL_MS)).toBeNull();
      eligibilityEvidence.push({ stage, conceptId: target.id, kind: "unresolved_rejected" });
    }
    const future = prepared(`${stage}.future`, stage);
    for (const concept of PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.concepts) markReviewed(future, concept.id, REAL_MS + 86_400_000);
    expect(selectRoutineClinicalCase(future, ordinaryPool(future), REAL_MS)).toBeNull();
    for (const target of concepts) eligibilityEvidence.push({ stage, conceptId: target.id, kind: "future_rejected" });
  });

  it("blocks both unresolved neck-pair siblings without grading the unreached tissue question", () => {
    for (const clinicalCase of paired) {
      const id = `unresolved.pair.${clinicalCase.id}`;
      const state = admit(prepared(id), clinicalCase, id);
      for (const node of clinicalCase.decisionNodes) {
        expect(selectRoutineClinicalCase(state, [standalone(node.primaryConceptId)], REAL_MS)).toBeNull();
        expect(state.learningHistories[node.primaryConceptId]?.reviews).toEqual([]);
      }
    }
  });

  it("loads old saves with twenty blank histories while preserving every old card and frozen encounter", () => {
    const ids = new Set(concepts.map((item) => item.id));
    const oldCase = PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.find((item) => item.routineEligible && item.decisionNodes.every((node) => !ids.has(node.primaryConceptId)))!;
    const id = "encounter.gs028f.old-save";
    let state = admit(prepared(id, 2), oldCase, id);
    markReviewed(state, oldCase.decisionNodes[0]!.primaryConceptId, REAL_MS - 123_456);
    const frozen = clone(state.encounters[id]);
    const histories = clone(Object.fromEntries(Object.entries(state.learningHistories).filter(([key]) => !ids.has(key))));
    const saved = JSON.parse(serializeGameState(state)) as { learningHistories: Record<string, unknown> };
    for (const key of ids) delete saved.learningHistories[key];
    state = deserializeGameState(JSON.stringify(saved));
    expect(clone(state.encounters[id])).toEqual(frozen);
    for (const [key, value] of Object.entries(histories)) expect(state.learningHistories[key]).toEqual(value);
    for (const key of ids) expect(state.learningHistories[key]).toMatchObject({ conceptId: key, card: { reps: 0, lastReviewAtMs: null }, reviews: [] });
  });

  it("measures the actual early ordinary pool delta of seventy-eight cases and twenty concepts", () => {
    expect(pools.map((item) => item.before)).toEqual([{ cases: 589, concepts: 161 }, { cases: 824, concepts: 267 }, { cases: 860, concepts: 283 }]);
    expect(pools.map((item) => item.after)).toEqual([{ cases: 667, concepts: 181 }, { cases: 902, concepts: 287 }, { cases: 938, concepts: 303 }]);
  });

  it("covers all eighty actual nodes and all three distractors plus the key in each", () => {
    expect(coverage.size).toBe(80);
    for (const node of cases.flatMap((item) => item.decisionNodes)) expect([...(coverage.get(node.id) ?? [])].sort()).toEqual(node.answerChoices.map((choice) => choice.id).sort());
    expect([...coverage.values()].reduce((total, ids) => total + ids.size, 0)).toBe(320);
  });
});

afterAll(() => {
  const directory = process.env.GS028_VARIETY2_EVIDENCE_DIR;
  if (!directory) return;
  writeFileSync(resolve(directory, "gameplay-evidence.json"), `${JSON.stringify({
    actualReducer: true, casePathCount: cases.length * 4, nodeCount: coverage.size,
    distinctChoiceSubmissions: [...coverage.values()].reduce((total, ids) => total + ids.size, 0),
    caseProfileCount: cases.reduce((total, item) => total + (item.approvedInstantiationProfiles?.length ?? 0), 0),
    instantiatedProfileCount: frozenProfiles.size, exactTestChoiceRecords: exact,
    choicesByNode: Object.fromEntries([...coverage].map(([id, choices]) => [id, [...choices].sort()])),
    pools, routingEvidence, choicePreviewEvidence: [...choicePreviewEvidence.values()], eligibilityEvidence,
  }, null, 2)}\n`);
});
