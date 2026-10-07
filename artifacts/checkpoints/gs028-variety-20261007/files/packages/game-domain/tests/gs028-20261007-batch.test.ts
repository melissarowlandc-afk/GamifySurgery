/// <reference types="node" />
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  GS028_20261007_CASES as cases,
  GS028_20261007_TESTED_CONCEPTS as concepts,
  type SyntheticClinicalCase,
} from "@gamify-surgery/clinical-content";
import { afterAll, describe, expect, it } from "vitest";
import {
  PROTOTYPE_DOMAIN_CONTEXT, createInitialGameState, createPatientDisplayName,
  deserializeGameState, deterministicInteger, RANDOM_STREAMS,
  gameReducer, getAnswerChoiceServicePreview, getCurrentCapabilities,
  getCurrentQuestion, getEligibleServiceRoute, getRoomDefinition,
  getRoomNavigationAnchor, selectRoutineClinicalCase, serializeGameState,
  type ConceptReviewEvidence, type GameState,
} from "../src";
import { EXACT_TEST_CHOICE_ORDER_RECORDS } from "../src/test-choice-orders";

const REAL_MS = 1_800_000_000_000;
const OUTSIDE_ROUTE = "route.basic_labs.outsourced";
const paired = cases.filter((item) => item.decisionNodes.length === 2);
const exact = EXACT_TEST_CHOICE_ORDER_RECORDS.filter((item) => item.caseId.startsWith("case.gs028e."));
const coverage = new Map<string, Set<string>>();
const frozenProfiles = new Set<string>();
const routingEvidence: unknown[] = [];
const choicePreviewEvidence: unknown[] = [];
const eligibilityEvidence: unknown[] = [];
const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

function prepared(seed: string, stage: 0 | 1 | 2 | 3 = 0): GameState {
  const state = createInitialGameState(undefined, { campaignId: `campaign.gs028e.${seed}`, campaignSeed: seed, createdAtRealMs: REAL_MS });
  state.facilityLevel = stage;
  state.encounters = {};
  state.openChartEncounterId = null;
  state.attendedEncounterId = null;
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  state.nextFinancialPostingTick = Number.MAX_SAFE_INTEGER;
  state.serviceAppointmentsEnabled = false;
  state.rooms.push({ id: "room.gs028e.examination", roomDefinitionId: "room.examination", x: 34, y: 26, orientation: 0, doorSide: "south", upgradeLevel: 1, cleanliness: 100 });
  state.doors.push({ id: "door.gs028e.examination", roomId: "room.gs028e.examination", side: "south", offset: 1, exterior: false });
  return state;
}

function labClinic(seed: string): GameState {
  const state = prepared(seed, 3);
  state.rooms.push(
    { id: "room.gs028e.laboratory", roomDefinitionId: "room.laboratory", x: 33, y: 23, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
    { id: "room.gs028e.phlebotomy", roomDefinitionId: "room.phlebotomy", x: 29, y: 17, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
    ...[17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28].map((y) => ({ id: `room.gs028e.hall.${y}`, roomDefinitionId: "room.hallway", x: 32, y, orientation: 0 as const, doorSide: null, upgradeLevel: 1 as const, cleanliness: 100 })),
  );
  state.doors.push(
    { id: "door.gs028e.laboratory", roomId: "room.gs028e.laboratory", side: "west", offset: 1, exterior: false },
    { id: "door.gs028e.phlebotomy", roomId: "room.gs028e.phlebotomy", side: "east", offset: 1, exterior: false },
    { id: "door.gs028e.front", roomId: "room.instance.founder_desk", side: "west", offset: 0, exterior: false },
  );
  for (const [id, role, roomId] of [
    ["employee.gs028e.lab", "staff.laboratory_technician", "room.gs028e.laboratory"],
    ["employee.gs028e.phlebotomist", "staff.phlebotomist", "room.gs028e.phlebotomy"],
  ] as const) {
    const room = state.rooms.find((item) => item.id === roomId)!;
    const location = getRoomNavigationAnchor(room, getRoomDefinition(room.roomDefinitionId)!, "staff");
    state.employees.push({ id, staffRoleDefinitionId: role, displayName: id, appearance: state.founder.appearance,
      hiredAtFacilityTick: 0, salaryPerExpenseInterval: 26, morale: 100, trainingLevel: 1,
      homeRoomInstanceId: roomId, location, path: [{ ...location }], pathIndex: 0,
      lastMovedAtFacilityTick: 0, lastPraisedAtFacilityTick: null,
      nextIdleActionAtFacilityTick: Number.MAX_SAFE_INTEGER, facilityTask: null });
  }
  return state;
}

function admit(state: GameState, clinicalCase: SyntheticClinicalCase, encounterId: string): GameState {
  const profiles = clinicalCase.approvedInstantiationProfiles;
  const sex = profiles?.[deterministicInteger(state.campaignSeed, RANDOM_STREAMS.clinicalPresentation, `${encounterId}|${clinicalCase.id}|approved-profile.v1`, profiles.length)]?.prototypeDemographics?.sexLabel ?? clinicalCase.prototypeDemographics?.sexLabel;
  const patientDisplayName = createPatientDisplayName(state.campaignSeed, encounterId, sex);
  const command = { type: "ADMIT_PATIENT" as const, operationId: `${encounterId}.admit`, encounterId, caseId: clinicalCase.id, patientDisplayName, arrivalClass: "routine" as const };
  const next = gameReducer(state, command);
  expect(next.operationReceipts[command.operationId]?.status).toBe("applied");
  expect(gameReducer(next, command)).toBe(next);
  return next;
}

function tick(state: GameState, operationId: string): GameState {
  return gameReducer(state, { type: "ADVANCE_TICK", operationId, advancedAtRealMs: REAL_MS });
}

function ready(state: GameState, encounterId: string, prefix: string): GameState {
  let next = state;
  for (let attempt = 0; attempt < 1_500; attempt += 1) {
    if (getCurrentQuestion(next, encounterId)) return next;
    const encounter = next.encounters[encounterId];
    if (!encounter) throw new Error(`${encounterId} disappeared before its clinical task.`);
    next = encounter.lifecycle === "waiting_unopened" && encounter.patientMovement === null
      ? gameReducer(next, { type: "OPEN_CHART", operationId: `${prefix}.open.${attempt}`, encounterId })
      : tick(next, `${prefix}.tick.${attempt}`);
  }
  throw new Error(`${encounterId} did not become answer-ready.`);
}

function answer(state: GameState, encounterId: string, choiceId: string, operationId: string, reviewedAtMs: number) {
  const question = getCurrentQuestion(state, encounterId);
  const choice = question?.node.answerChoices.find((item) => item.id === choiceId);
  if (!question || !choice) throw new Error(`${encounterId} lacks authored choice ${choiceId}.`);
  return { question, choice, command: { type: "SUBMIT_ANSWER" as const, operationId, encounterId, decisionNodeId: question.node.id, answerChoiceId: choice.id, reviewedAtMs } };
}

function acknowledge(state: GameState, encounterId: string, operationId: string): GameState {
  const encounter = state.encounters[encounterId]!;
  const command = { type: "ACKNOWLEDGE_DECISION_FEEDBACK" as const, operationId, encounterId, decisionNodeId: encounter.steps[encounter.currentNodeIndex]!.decisionNodeId };
  const next = gameReducer(state, command);
  expect(next.operationReceipts[operationId]?.status).toBe("applied");
  expect(gameReducer(next, command)).toBe(next);
  return next;
}

function waitResult(state: GameState, encounterId: string, prefix: string): GameState {
  let next = state;
  for (let attempt = 0; attempt < 1_500; attempt += 1) {
    if (next.encounters[encounterId]?.pendingResult?.deliveredAtTick != null) return next;
    expect(getCurrentQuestion(next, encounterId)).toBeNull();
    expect(next.encounters[encounterId]?.deliveredResultNarratives).toEqual([]);
    next = tick(next, `${prefix}.${attempt}`);
  }
  throw new Error(`${encounterId} did not receive its external result.`);
}

function closeAndDepart(state: GameState, encounterId: string, prefix: string): GameState {
  const terminal = { type: "ACKNOWLEDGE_TERMINAL_FEEDBACK" as const, operationId: `${prefix}.terminal`, encounterId };
  let next = gameReducer(state, terminal);
  expect(next.operationReceipts[terminal.operationId]?.status).toBe("applied");
  expect(gameReducer(next, terminal)).toBe(next);
  const close = { type: "CLOSE_CHART" as const, operationId: `${prefix}.close`, encounterId };
  next = gameReducer(next, close);
  expect(next.operationReceipts[close.operationId]?.status).toBe("applied");
  expect(gameReducer(next, close)).toBe(next);
  expect(next.encounters[encounterId]?.lifecycle).toBe("resolved");
  for (let attempt = 0; attempt < 1_500; attempt += 1) {
    const encounter = next.encounters[encounterId];
    if (encounter?.patientLocation === null && encounter.patientMovement === null) return next;
    next = tick(next, `${prefix}.depart.${attempt}`);
  }
  throw new Error(`${encounterId} completed but did not depart.`);
}

function roundTrip(state: GameState, encounterId: string): GameState {
  const frozen = clone(state.encounters[encounterId]);
  const histories = clone(state.learningHistories);
  const next = deserializeGameState(serializeGameState(state));
  // Persistence legitimately renews an overdue cosmetic idle timer. Clinical
  // content, frozen results, answers and learning histories remain exact.
  if (frozen && frozen.nextIdleActionAtFacilityTick < state.facilityTick) {
    frozen.nextIdleActionAtFacilityTick = state.facilityTick + PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.environment.idleActionMinimumMinutes;
  }
  expect(clone(next.encounters[encounterId])).toEqual(frozen);
  expect(next.learningHistories).toEqual(histories);
  return next;
}

function noExtraService(state: GameState, encounterId: string): void {
  expect(state.serviceOperations.filter((item) => item.actorId === encounterId)).toEqual([]);
  expect(state.serviceIncomeReceipts.filter((item) => item.actorId === encounterId)).toEqual([]);
  expect(state.encounters[encounterId]?.terminalTestOrder).toBeUndefined();
}

function complete(clinicalCase: SyntheticClinicalCase, path: "correct" | 0 | 1 | 2, index: number): void {
  const encounterId = `encounter.gs028e.flow.${index}.${path}`;
  let state = ready(admit(prepared(`${index}.${path}`), clinicalCase, encounterId), encounterId, `${encounterId}.initial`);
  const encounter = state.encounters[encounterId]!;
  const profile = clinicalCase.approvedInstantiationProfiles?.find((item) => item.id === encounter.frozenCase.selectedInstantiationProfileId);
  expect(profile).toBeDefined();
  expect(encounter.frozenCase.prototypeDemographics).toEqual(profile?.prototypeDemographics);
  expect(encounter.frozenCase.presentation).toContain(encounter.patientDisplayName);
  expect(encounter.frozenCase.presentation).toContain(`${profile?.prototypeDemographics?.ageYears}-year-old`);
  expect(encounter.frozenCase.presentation).not.toMatch(/\{patient(Name|Age|Sex)\}/);
  frozenProfiles.add(profile!.id);
  state = roundTrip(state, encounterId);
  for (let nodeIndex = 0; nodeIndex < clinicalCase.decisionNodes.length; nodeIndex += 1) {
    const node = clinicalCase.decisionNodes[nodeIndex]!;
    state = ready(state, encounterId, `${encounterId}.${nodeIndex}.ready`);
    // Choose an authored ID, not an index in the shuffled runtime array.
    const selected = path === "correct" ? node.answerChoices.find((item) => item.isCorrect)! : node.answerChoices.filter((item) => !item.isCorrect)[path]!;
    const submitted = answer(state, encounterId, selected.id, `${encounterId}.${nodeIndex}.answer`, REAL_MS + index * 100 + nodeIndex);
    expect(submitted.question.node.id).toBe(node.id);
    expect(submitted.question.node.answerChoices.map((item) => item.id).sort()).toEqual(node.answerChoices.map((item) => item.id).sort());
    expect(submitted.choice.isCorrect).toBe(path === "correct");
    const xp = state.clinicalXp;
    state = gameReducer(state, submitted.command);
    expect(state.operationReceipts[submitted.command.operationId]?.status).toBe("applied");
    expect(state.clinicalXp - xp).toBe(path === "correct" ? PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.clinicalSettlement.clinicalXpPerCorrectFirstAnswer : PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.clinicalSettlement.clinicalXpPerIncorrectFirstAnswer);
    expect(state.learningHistories[node.primaryConceptId]?.reviews).toEqual([expect.objectContaining({ answerChoiceId: selected.id, correct: path === "correct", rating: path === "correct" ? "Good" : "Again" })]);
    expect(state.learningHistories[node.primaryConceptId]?.card.reps).toBe(1);
    expect(state.encounters[encounterId]?.steps[nodeIndex]?.answer).toMatchObject({ answerChoiceId: selected.id, correctedForward: path !== "correct" && nodeIndex < clinicalCase.decisionNodes.length - 1 });
    expect(gameReducer(state, submitted.command)).toBe(state);
    const seen = coverage.get(node.id) ?? new Set<string>();
    seen.add(selected.id); coverage.set(node.id, seen);
    noExtraService(state, encounterId);
    if (nodeIndex === clinicalCase.decisionNodes.length - 1) continue;
    const gate = node.resultGateAfter!;
    const operationId = `result.${encounterId}.${node.id}.${gate.id}`;
    expect(state.encounters[encounterId]?.pendingResult).toMatchObject({ operationId, gateId: gate.id, routeId: OUTSIDE_ROUTE, resultTypeId: "service.basic_labs", resultNarrative: gate.resultNarrative, deliveredAtTick: null });
    expect(state.encounters[encounterId]?.pendingResult?.patientTravel).toBeNull();
    expect(state.encounters[encounterId]?.pendingResult?.phlebotomistId).toBeNull();
    expect(state.encounters[encounterId]?.deliveredResultNarratives).toEqual([]);
    expect(state.learningHistories[clinicalCase.decisionNodes[1]!.primaryConceptId]?.reviews).toEqual([]);
    expect(getCurrentQuestion(state, encounterId)).toBeNull();
    state = acknowledge(state, encounterId, `${encounterId}.${nodeIndex}.ack`);
    state = roundTrip(state, encounterId);
    state = waitResult(state, encounterId, `${encounterId}.${nodeIndex}.result`);
    expect(state.encounters[encounterId]?.pendingResult?.operationId).toBe(operationId);
    expect(state.encounters[encounterId]?.deliveredResultNarratives).toEqual([gate.resultNarrative]);
    state = ready(roundTrip(state, encounterId), encounterId, `${encounterId}.${nodeIndex}.returned`);
    expect(getCurrentQuestion(state, encounterId)?.node.currentUpdate).toBe(gate.resultNarrative);
    expect(getCurrentQuestion(state, encounterId)?.resultNarratives).toEqual([gate.resultNarrative]);
  }
  expect(state.encounters[encounterId]?.lifecycle).toBe("resolved_summary_available");
  state = roundTrip(state, encounterId);
  state = closeAndDepart(state, encounterId, encounterId);
  for (const node of clinicalCase.decisionNodes) expect(state.learningHistories[node.primaryConceptId]?.reviews).toHaveLength(1);
  noExtraService(state, encounterId);
  roundTrip(state, encounterId);
}

function markReviewed(state: GameState, conceptId: string, dueAtMs: number): void {
  const template = Object.values(state.learningHistories)[0]!;
  state.learningHistories[conceptId] = { conceptId, card: { ...template.card, dueAtMs, lastReviewAtMs: REAL_MS - 10_000, reps: 1 }, reviews: [{} as ConceptReviewEvidence] };
}

function standalone(conceptId: string): SyntheticClinicalCase {
  const found = cases.find((item) => item.decisionNodes.length === 1 && item.decisionNodes[0]?.primaryConceptId === conceptId);
  if (!found) throw new Error(`${conceptId} lacks an independent case.`);
  return found;
}

function ordinaryPool(state: GameState): SyntheticClinicalCase[] {
  const capabilities = getCurrentCapabilities(state);
  return PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.filter((item) => item.participant?.kind !== "employee_discussion" && item.routineEligible && item.earliestFacilityStage <= state.facilityLevel && item.requiredCapabilityIds.every((id) => capabilities.has(id)));
}

const pools = [0, 1, 2].map((stage) => {
  const state = createInitialGameState(undefined, { campaignSeed: `gs028e.pool.${stage}`, createdAtRealMs: REAL_MS });
  state.facilityLevel = stage as 0 | 1 | 2;
  const capabilities = getCurrentCapabilities(state);
  const admitted = ordinaryPool(state);
  const old = admitted.filter((item) => !item.id.startsWith("case.gs028e."));
  return { stage, capabilities: [...capabilities].sort(), before: { cases: old.length, concepts: new Set(old.flatMap((item) => item.decisionNodes.map((node) => node.primaryConceptId))).size }, after: { cases: admitted.length, concepts: new Set(admitted.flatMap((item) => item.decisionNodes.map((node) => node.primaryConceptId))).size } };
});

describe("GS-028 October 7 real gameplay admission", () => {
  it("binds exactly two correct external gates and six non-executed distractors", () => {
    expect(exact).toHaveLength(8);
    let correctCount = 0, wrongCount = 0;
    for (const record of exact) {
      const node = cases.find((item) => item.id === record.caseId)!.decisionNodes.find((item) => item.id === record.nodeId)!;
      const choice = node.answerChoices.find((item) => item.id === record.choiceId)!;
      expect(record.choiceLabel).toBe(choice.label);
      expect(record.questionVariantId).toBe(node.questionVariantId);
      expect(record.timingProfileId).toBe("timing.test.basic_labs");
      if (choice.isCorrect) {
        correctCount += 1;
        expect(record.disposition).toMatchObject({ kind: "result_gate_route_override", serviceId: "service.basic_labs", allowedRouteIds: [OUTSIDE_ROUTE], allowOnsiteEquivalents: false });
        if (record.disposition.kind !== "result_gate_route_override") throw new Error("Missing gate override.");
        expect(record.disposition.externalRemainder).toMatch(/specialist.*coagulation.*laboratory/i);
      } else {
        wrongCount += 1;
        expect(record.disposition).toEqual({ kind: "not_executed", reason: "external_only" });
      }
    }
    expect({ correctCount, wrongCount }).toEqual({ correctCount: 2, wrongCount: 6 });
  });

  it.each(cases.map((item, index) => [index, item] as const))("completes every node correctly, saves and departs in case %s", (index, item) => complete(item, "correct", index));
  it.each(cases.flatMap((item, index) => ([0, 1, 2] as const).map((path) => [index, path, item] as const)))("completes authored wrong choice %s/%s with one FSRS review and corrected-forward", (index, path, item) => complete(item, path, index));

  it.each(paired.flatMap((item) => (["installed", "missing_staff", "busy", "missing_rooms", "lab_only"] as const).map((condition) => [item, condition] as const)))("keeps specialist mixing external in $id with %s clinic resources", (clinicalCase, condition) => {
    const encounterId = `encounter.gs028e.resources.${clinicalCase.id}.${condition}`;
    let state = ready(admit(labClinic(encounterId), clinicalCase, encounterId), encounterId, `${encounterId}.ready`);
    if (condition === "missing_staff") state.employees = [];
    if (condition === "missing_rooms" || condition === "lab_only") {
      const removed = new Set(state.rooms.filter((room) => room.id === "room.gs028e.phlebotomy" || (condition === "missing_rooms" && room.id === "room.gs028e.laboratory")).map((room) => room.id));
      state.rooms = state.rooms.filter((room) => !removed.has(room.id));
      state.doors = state.doors.filter((door) => !removed.has(door.roomId));
      state.employees = state.employees.filter((employee) => !removed.has(employee.homeRoomInstanceId ?? ""));
    }
    if (condition === "busy") for (const employee of state.employees) employee.facilityTask = { kind: "perform_service", targetId: "another-current-lab-service", startedAtFacilityTick: state.facilityTick, workMinutesRemaining: Number.MAX_SAFE_INTEGER };
    const ordinary = getEligibleServiceRoute(state, "service.basic_labs", [OUTSIDE_ROUTE]);
    if (condition === "installed") {
      expect(getCurrentCapabilities(state).has("capability.in_house_laboratory")).toBe(true);
      expect(getCurrentCapabilities(state).has("capability.phlebotomy_collection")).toBe(true);
      expect(ordinary?.route.id).toBe("route.basic_labs.phlebotomy_sendout");
    }
    const question = getCurrentQuestion(state, encounterId)!;
    const profile = PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.answerChoiceTimingProfiles.find((item) => item.id === "timing.test.basic_labs")!;
    for (const choice of question.node.answerChoices) {
      const preview = getAnswerChoiceServicePreview(state, encounterId, choice.id);
      expect(preview).toMatchObject({ kind: "test", timingProfileId: profile.id, durationTicks: profile.durationTicks });
      expect(preview?.routeId).toBe(choice.isCorrect ? OUTSIDE_ROUTE : null);
      if (!choice.isCorrect) expect(preview?.routeDisplayName).toBeNull();
      choicePreviewEvidence.push({ caseId: clinicalCase.id, nodeId: question.node.id, questionVariantId: question.node.questionVariantId, condition, choiceId: choice.id, choiceLabel: choice.label, correct: choice.isCorrect, disposition: exact.find((record) => record.caseId === clinicalCase.id && record.choiceId === choice.id)?.disposition, centralProfileDurationTicks: profile.durationTicks, actualPreview: preview });
    }
    const key = question.node.answerChoices.find((item) => item.isCorrect)!;
    const selected = answer(state, encounterId, key.id, `${encounterId}.answer`, REAL_MS + 1);
    state = gameReducer(state, selected.command);
    expect(state.operationReceipts[selected.command.operationId]?.status).toBe("applied");
    expect(state.encounters[encounterId]?.pendingResult).toMatchObject({ routeId: OUTSIDE_ROUTE, phlebotomistId: null, patientTravel: null, deliveredAtTick: null });
    noExtraService(state, encounterId);
    routingEvidence.push({ caseId: clinicalCase.id, condition, ordinaryRouteId: ordinary?.route.id, selectedRouteId: state.encounters[encounterId]?.pendingResult?.routeId, allChoiceEtasFromCentralProfile: true });
  });

  it("shows neutral estimates for every distractor and orders only one corrected mixing assessment", () => {
    for (const clinicalCase of paired) for (const wrong of clinicalCase.decisionNodes[0]!.answerChoices.filter((item) => !item.isCorrect)) {
      const encounterId = `encounter.gs028e.corrected.${clinicalCase.id}.${wrong.id}`;
      let state = ready(admit(labClinic(encounterId), clinicalCase, encounterId), encounterId, `${encounterId}.ready`);
      const profile = PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.answerChoiceTimingProfiles.find((item) => item.id === "timing.test.basic_labs")!;
      expect(getAnswerChoiceServicePreview(state, encounterId, wrong.id)).toMatchObject({ routeId: null, durationTicks: profile.durationTicks });
      const selected = answer(state, encounterId, wrong.id, `${encounterId}.answer`, REAL_MS + 1);
      state = gameReducer(state, selected.command);
      expect(state.encounters[encounterId]?.answers).toHaveLength(1);
      expect(state.encounters[encounterId]?.answers[0]).toMatchObject({ answerChoiceId: wrong.id, correct: false, correctedForward: true });
      const result = clone(state.encounters[encounterId]!.pendingResult);
      expect(result).toMatchObject({ gateId: clinicalCase.decisionNodes[0]!.resultGateAfter!.id, routeId: OUTSIDE_ROUTE });
      expect(gameReducer(state, selected.command)).toBe(state);
      expect(state.encounters[encounterId]?.pendingResult).toEqual(result);
      noExtraService(state, encounterId);
    }
  });

  it("actually randomizes runtime keys across encounters while preserving their identities", () => {
    for (const clinicalCase of cases) {
      const orders = new Set<string>();
      for (let seed = 0; seed < 6; seed += 1) {
        const id = `shuffle.${clinicalCase.id}.${seed}`;
        const state = admit(prepared(id), clinicalCase, id);
        orders.add(state.encounters[id]!.frozenCase.decisionNodes[0]!.answerChoices.map((choice) => choice.id).join("|"));
      }
      expect(orders.size, `${clinicalCase.id} must shuffle runtime choices`).toBeGreaterThan(1);
    }
  });

  it.each([0, 1, 2] as const)("selects each unseen and due objective independently at stage %s", (stage) => {
    for (const target of concepts) {
      for (const kind of ["new_concept", "due_review"] as const) {
        const state = prepared(`${stage}.${kind}.${target.id}`, stage);
        for (const concept of PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.concepts) if (concept.id !== target.id || kind === "due_review") markReviewed(state, concept.id, concept.id === target.id ? REAL_MS - 1 : REAL_MS + 86_400_000);
        const admittedPool = ordinaryPool(state);
        const selection = selectRoutineClinicalCase(state, admittedPool, REAL_MS);
        expect(selection).toMatchObject({ kind, selectedConceptId: target.id });
        expect(selection?.clinicalCase.decisionNodes).toHaveLength(1);
        expect(selection?.clinicalCase.decisionNodes[0]?.primaryConceptId).toBe(target.id);
        eligibilityEvidence.push({ stage, conceptId: target.id, kind, caseId: selection?.clinicalCase.id, admittedPoolSize: admittedPool.length, allOtherAdmittedConceptsFuture: true, pairedSiblingFuture: target.id.startsWith("concept.coagulation.") });
      }
      let unresolved = prepared(`${stage}.unresolved.${target.id}`, stage);
      for (const concept of PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.concepts) if (concept.id !== target.id) markReviewed(unresolved, concept.id, REAL_MS + 86_400_000);
      unresolved = admit(unresolved, standalone(target.id), `unresolved.${stage}.${target.id}`);
      expect(selectRoutineClinicalCase(unresolved, ordinaryPool(unresolved), REAL_MS)).toBeNull();
      eligibilityEvidence.push({ stage, conceptId: target.id, kind: "unresolved_rejected", admittedPoolSize: ordinaryPool(unresolved).length });
    }
    const future = prepared(`${stage}.future`, stage);
    for (const concept of PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.concepts) markReviewed(future, concept.id, REAL_MS + 86_400_000);
    expect(selectRoutineClinicalCase(future, ordinaryPool(future), REAL_MS)).toBeNull();
    for (const target of concepts) eligibilityEvidence.push({ stage, conceptId: target.id, kind: "future_rejected", admittedPoolSize: ordinaryPool(future).length });
  });

  it("blocks both paired objectives during an unresolved paired encounter without reviewing the locked sibling", () => {
    for (const clinicalCase of paired) {
      const id = `unresolved.pair.${clinicalCase.id}`;
      const state = admit(prepared(id), clinicalCase, id);
      for (const node of clinicalCase.decisionNodes) {
        expect(selectRoutineClinicalCase(state, [standalone(node.primaryConceptId)], REAL_MS)).toBeNull();
        expect(state.learningHistories[node.primaryConceptId]?.reviews).toEqual([]);
      }
    }
  });

  it("adds twenty blank histories to an old save and preserves all existing histories and frozen encounters", () => {
    const newIds = new Set(concepts.map((item) => item.id));
    const oldCase = PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.find((item) => item.routineEligible && item.decisionNodes.every((node) => !newIds.has(node.primaryConceptId)))!;
    const id = "encounter.gs028e.old-save";
    let state = admit(prepared(id, 2), oldCase, id);
    markReviewed(state, oldCase.decisionNodes[0]!.primaryConceptId, REAL_MS - 123_456);
    const oldFrozen = clone(state.encounters[id]);
    const histories = clone(Object.fromEntries(Object.entries(state.learningHistories).filter(([conceptId]) => !newIds.has(conceptId))));
    const saved = JSON.parse(serializeGameState(state)) as { learningHistories: Record<string, unknown> };
    for (const conceptId of newIds) delete saved.learningHistories[conceptId];
    state = deserializeGameState(JSON.stringify(saved));
    expect(state.encounters[id]).toEqual(oldFrozen);
    for (const [conceptId, history] of Object.entries(histories)) expect(state.learningHistories[conceptId]).toEqual(history);
    for (const conceptId of newIds) expect(state.learningHistories[conceptId]).toMatchObject({ conceptId, card: { reps: 0, lastReviewAtMs: null }, reviews: [] });
  });

  it("measures the real ordinary pools before and after admission", () => {
    expect(pools.map((item) => item.before)).toEqual([{ cases: 511, concepts: 141 }, { cases: 746, concepts: 247 }, { cases: 782, concepts: 263 }]);
    expect(pools.map((item) => item.after)).toEqual([{ cases: 589, concepts: 161 }, { cases: 824, concepts: 267 }, { cases: 860, concepts: 283 }]);
  });

  it("covers all eighty actual nodes and each of their four authored choices", () => {
    expect(coverage.size).toBe(80);
    for (const node of cases.flatMap((item) => item.decisionNodes)) expect([...(coverage.get(node.id) ?? [])].sort()).toEqual(node.answerChoices.map((choice) => choice.id).sort());
    expect([...coverage.values()].reduce((total, ids) => total + ids.size, 0)).toBe(320);
  });
});

afterAll(() => {
  const evidenceDirectory = process.env.GS028_EVIDENCE_DIR;
  if (!evidenceDirectory) return;
  writeFileSync(resolve(evidenceDirectory, "gameplay-evidence.json"), `${JSON.stringify({
    actualReducer: true, casePathCount: cases.length * 4, nodeCount: coverage.size,
    distinctChoiceSubmissions: [...coverage.values()].reduce((total, ids) => total + ids.size, 0),
    caseProfileCount: cases.reduce((total, item) => total + (item.approvedInstantiationProfiles?.length ?? 0), 0),
    sampledFrozenProfileCount: frozenProfiles.size,
    choicesByNode: Object.fromEntries([...coverage].map(([nodeId, ids]) => [nodeId, [...ids].sort()])),
    pools, routingEvidence, choicePreviewEvidence, eligibilityEvidence,
  }, null, 2)}\n`);
});
