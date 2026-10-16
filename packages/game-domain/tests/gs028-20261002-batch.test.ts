import { GS028_20261002_CASES, GS028_20261002_TESTED_CONCEPTS } from "@gamify-surgery/clinical-content";
import { describe, expect, it } from "vitest";
import {
  PROTOTYPE_DOMAIN_CONTEXT, createInitialGameState, deserializeGameState,
  gameReducer, getCurrentQuestion, getEligibleServiceRoute, getAnswerChoiceServicePreview,
  selectRoutineClinicalCase, serializeGameState, advanceServiceOperations, startServiceOperation,
  type ConceptReviewEvidence, type GameState,
} from "../src";
import { EXACT_TEST_CHOICE_ORDER_RECORDS } from "../src/test-choice-orders";

const REAL_MS = 1_800_000_000_000;
type BatchCase = (typeof GS028_20261002_CASES)[number];

function jsonClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function prepared(seed: string, stage: 0 | 1 | 2 = 2): GameState {
  const state = createInitialGameState(undefined, {
    campaignId: `campaign.gs028c.${seed}`, campaignSeed: seed,
    createdAtRealMs: REAL_MS,
  });
  state.facilityLevel = stage;
  state.encounters = {};
  state.openChartEncounterId = null;
  state.attendedEncounterId = null;
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  state.nextFinancialPostingTick = Number.MAX_SAFE_INTEGER;
  state.rooms.push({ id: "room.gs028c.examination", roomDefinitionId: "room.examination", x: 34, y: 26, orientation: 0, doorSide: "south", upgradeLevel: 1, cleanliness: 100 });
  state.doors.push({ id: "door.gs028c.examination", roomId: "room.gs028c.examination", side: "south", offset: 1, exterior: false });
  return state;
}

function preparedUltrasoundClinic(seed: string): GameState {
  const state = prepared(seed, 2);
  state.rooms.push(
    { id: "room.gs028c.ultrasound", roomDefinitionId: "room.ultrasound", x: 33, y: 23, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
    ...([24, 25, 26, 27, 28] as const).map((y) => ({ id: `room.gs028c.hall.${y}`, roomDefinitionId: "room.hallway", x: 32, y, orientation: 0 as const, doorSide: null, upgradeLevel: 1 as const, cleanliness: 100 })),
  );
  state.doors.push(
    { id: "door.gs028c.ultrasound", roomId: "room.gs028c.ultrasound", side: "south", offset: 2, exterior: false },
    { id: "door.gs028c.ultrasound.staff", roomId: "room.gs028c.ultrasound", side: "west", offset: 1, exterior: false },
    { id: "door.gs028c.front", roomId: "room.instance.founder_desk", side: "west", offset: 0, exterior: false },
  );
  state.employees.push({
    id: "employee.gs028c.imaging", staffRoleDefinitionId: "staff.imaging_technician",
    displayName: "GS-028C Imaging Technician", appearance: state.founder.appearance,
    hiredAtFacilityTick: state.facilityTick, salaryPerExpenseInterval: 26,
    morale: 75, trainingLevel: 1, homeRoomInstanceId: "room.gs028c.ultrasound",
    location: { x: 32, y: 24 }, path: [{ x: 32, y: 24 }], pathIndex: 0,
    lastMovedAtFacilityTick: state.facilityTick, lastPraisedAtFacilityTick: null,
    nextIdleActionAtFacilityTick: state.facilityTick + 20, facilityTask: null,
  });
  return state;
}

function occupyUltrasound(state: GameState): string {
  const operationId = startServiceOperation(state, "income.ultrasound", "visitor", PROTOTYPE_DOMAIN_CONTEXT);
  expect(operationId).not.toBeNull();
  const operation = state.serviceOperations.find((candidate) => candidate.id === operationId)!;
  // Place this synthetic competing visitor and its worker at each actual path
  // endpoint; the existing engine still owns reservations and finite work.
  const arrive = () => {
    operation.pathIndex = operation.path.length - 1;
    operation.location = { ...operation.path.at(-1)! };
    for (const employee of state.employees.filter((candidate) => candidate.facilityTask?.targetId === operationId)) {
      employee.pathIndex = employee.path.length - 1;
      employee.location = { ...employee.path.at(-1)! };
    }
  };
  arrive();
  advanceServiceOperations(state, PROTOTYPE_DOMAIN_CONTEXT);
  advanceServiceOperations(state, PROTOTYPE_DOMAIN_CONTEXT);
  arrive();
  advanceServiceOperations(state, PROTOTYPE_DOMAIN_CONTEXT);
  expect(operation).toMatchObject({ status: "in_service", reservedEmployeeIds: ["employee.gs028c.imaging"], reservedRoomInstanceIds: ["room.gs028c.ultrasound"] });
  expect(operation.phaseEndsAtFacilityTick).toBeGreaterThan(state.facilityTick);
  return operationId!;
}

function admit(state: GameState, clinicalCase: BatchCase, encounterId: string, operationId: string): GameState {
  const next = gameReducer(state, {
    type: "ADMIT_PATIENT", operationId, encounterId, caseId: clinicalCase.id,
    patientDisplayName: `GS-028C Patient ${encounterId}`, arrivalClass: "routine",
  });
  expect(next.operationReceipts[operationId]?.status).toBe("applied");
  return next;
}

function ready(state: GameState, encounterId: string, prefix: string): GameState {
  let next = state;
  for (let attempt = 0; attempt < 1_500; attempt += 1) {
    if (getCurrentQuestion(next, encounterId)) return next;
    const encounter = next.encounters[encounterId];
    if (!encounter) throw new Error(`${encounterId} disappeared before it was ready.`);
    next = encounter.lifecycle === "waiting_unopened" && encounter.patientMovement === null
      ? gameReducer(next, { type: "OPEN_CHART", operationId: `${prefix}.open.${attempt}`, encounterId })
      : gameReducer(next, { type: "ADVANCE_TICK", operationId: `${prefix}.tick.${attempt}`, advancedAtRealMs: REAL_MS });
  }
  throw new Error(`${encounterId} did not become answer-ready.`);
}

function readyAtNode(state: GameState, encounterId: string, nodeId: string, prefix: string): GameState {
  const next = ready(state, encounterId, prefix);
  const encounter = next.encounters[encounterId];
  const nodeIndex = encounter?.steps.findIndex((step) => step.decisionNodeId === nodeId) ?? -1;
  if (!encounter || nodeIndex < 0) throw new Error(`${encounterId} lacks ${nodeId}.`);
  encounter.currentNodeIndex = nodeIndex;
  encounter.steps.forEach((step, index) => {
    step.status = index < nodeIndex ? "completed" : index === nodeIndex ? "action_required" : "locked";
  });
  encounter.pendingResult = null;
  encounter.deliveredResultNarratives = [];
  encounter.lifecycle = "active_action_required";
  return next;
}

function answerCommand(state: GameState, encounterId: string, correct: boolean, operationId: string, reviewedAtMs: number) {
  const question = getCurrentQuestion(state, encounterId);
  const choice = question?.node.answerChoices.find((candidate) => candidate.isCorrect === correct);
  if (!question || !choice) throw new Error(`${encounterId} lacks a ${correct ? "correct" : "wrong"} answer.`);
  return { question, choice, command: {
    type: "SUBMIT_ANSWER" as const, operationId, encounterId,
    decisionNodeId: question.node.id, answerChoiceId: choice.id, reviewedAtMs,
  } };
}

function acknowledge(state: GameState, encounterId: string, operationId: string): GameState {
  const encounter = state.encounters[encounterId];
  const step = encounter?.steps[encounter.currentNodeIndex];
  if (!step) throw new Error(`${encounterId} has no feedback to acknowledge.`);
  const command = { type: "ACKNOWLEDGE_DECISION_FEEDBACK" as const, operationId, encounterId, decisionNodeId: step.decisionNodeId };
  const next = gameReducer(state, command);
  expect(next.operationReceipts[operationId]?.status).toBe("applied");
  expect(gameReducer(next, command)).toBe(next);
  return next;
}

function waitForResult(state: GameState, encounterId: string, prefix: string): GameState {
  let next = state;
  for (let elapsed = 0; elapsed < 1_500; elapsed += 1) {
    const pending = next.encounters[encounterId]?.pendingResult;
    if (pending && pending.deliveredAtTick !== null) return next;
    expect(getCurrentQuestion(next, encounterId)).toBeNull();
    expect(next.encounters[encounterId]?.deliveredResultNarratives).toEqual([]);
    next = gameReducer(next, { type: "ADVANCE_TICK", operationId: `${prefix}.${elapsed}`, advancedAtRealMs: REAL_MS });
  }
  throw new Error(`${encounterId} did not receive its gated result.`);
}

function acknowledgeAndClose(state: GameState, encounterId: string, prefix: string): GameState {
  const feedback = { type: "ACKNOWLEDGE_TERMINAL_FEEDBACK" as const, operationId: `${prefix}.terminal-feedback`, encounterId };
  let next = gameReducer(state, feedback);
  expect(next.operationReceipts[feedback.operationId]?.status).toBe("applied");
  expect(gameReducer(next, feedback)).toBe(next);
  const close = { type: "CLOSE_CHART" as const, operationId: `${prefix}.close`, encounterId };
  next = gameReducer(next, close);
  expect(next.operationReceipts[close.operationId]?.status).toBe("applied");
  expect(gameReducer(next, close)).toBe(next);
  expect(next.encounters[encounterId]?.lifecycle).toBe("resolved");
  return next;
}

function markReviewed(state: GameState, conceptId: string, dueAtMs: number): void {
  const template = Object.values(state.learningHistories)[0];
  if (!template) throw new Error("The initial campaign lacks an FSRS card fixture.");
  state.learningHistories[conceptId] = {
    conceptId,
    card: { ...template.card, dueAtMs, lastReviewAtMs: REAL_MS - 10_000, reps: 1 },
    reviews: [{} as ConceptReviewEvidence],
  };
}

function standaloneFor(conceptId: string): BatchCase {
  const standalone = GS028_20261002_CASES.find((clinicalCase) =>
    clinicalCase.decisionNodes.length === 1 && clinicalCase.decisionNodes[0]?.primaryConceptId === conceptId,
  );
  if (!standalone) throw new Error(`${conceptId} lacks a standalone case.`);
  return standalone;
}

function complete(clinicalCase: BatchCase, correct: boolean, index: number): GameState {
  const encounterId = `encounter.gs028c.${correct ? "correct" : "wrong"}.${index}`;
  let state = admit(prepared(`${correct}.${index}`, clinicalCase.earliestFacilityStage), clinicalCase, encounterId, `${encounterId}.admit`);
  for (let nodeIndex = 0; nodeIndex < clinicalCase.decisionNodes.length; nodeIndex += 1) {
    const prefix = `${encounterId}.${nodeIndex}`;
    state = ready(state, encounterId, `${prefix}.ready`);
    const authored = clinicalCase.decisionNodes[nodeIndex]!;
    const { question, choice, command } = answerCommand(state, encounterId, correct, `${prefix}.answer`, REAL_MS + index * 100 + nodeIndex);
    expect(question.node.id).toBe(authored.id);
    expect(question.node.answerChoices.map((item) => item.id).sort()).toEqual(authored.answerChoices.map((item) => item.id).sort());
    const xpBeforeAnswer = state.clinicalXp;
    state = gameReducer(state, command);
    expect(state.operationReceipts[command.operationId]?.status).toBe("applied");
    expect(state.clinicalXp - xpBeforeAnswer).toBe(
      correct
        ? PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.clinicalSettlement.clinicalXpPerCorrectFirstAnswer
        : PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.clinicalSettlement.clinicalXpPerIncorrectFirstAnswer,
    );
    expect(state.learningHistories[authored.primaryConceptId]?.reviews).toEqual([
      expect.objectContaining({ answerChoiceId: choice.id, correct, rating: correct ? "Good" : "Again" }),
    ]);
    expect(state.encounters[encounterId]?.steps[nodeIndex]?.answer).toMatchObject({
      answerChoiceId: choice.id, correct, ratingIntent: correct ? "Good" : "Again",
      correctedForward: !correct && nodeIndex < clinicalCase.decisionNodes.length - 1,
    });
    expect(gameReducer(state, command)).toBe(state);
    expect(state.learningHistories[authored.primaryConceptId]?.reviews).toHaveLength(1);
    if (nodeIndex === clinicalCase.decisionNodes.length - 1) continue;
    const gate = authored.resultGateAfter;
    if (!gate) {
      expect(state.encounters[encounterId]?.pendingResult).toBeNull();
      state = acknowledge(state, encounterId, `${prefix}.acknowledge`);
      continue;
    }
    expect(state.encounters[encounterId]?.pendingResult).toMatchObject({
      resultTypeId: gate.resultTypeId, routeId: expect.any(String),
      resultNarrative: gate.resultNarrative, deliveredAtTick: null,
    });
    expect(getCurrentQuestion(state, encounterId)).toBeNull();
    expect(state.encounters[encounterId]?.deliveredResultNarratives).toEqual([]);
    state = acknowledge(state, encounterId, `${prefix}.acknowledge`);
    state = waitForResult(state, encounterId, `${prefix}.wait`);
    expect(state.encounters[encounterId]?.deliveredResultNarratives).toContain(gate.resultNarrative);
  }
  expect(state.encounters[encounterId]).toMatchObject({ lifecycle: "resolved_summary_available", resolutionReason: "completed" });
  for (const node of clinicalCase.decisionNodes) expect(state.learningHistories[node.primaryConceptId]?.reviews).toHaveLength(1);
  return acknowledgeAndClose(state, encounterId, `${encounterId}.resolve`);
}

const pairedUltrasoundCases = GS028_20261002_CASES.filter((clinicalCase) =>
  clinicalCase.decisionNodes.length === 2 && clinicalCase.decisionNodes[0]?.resultGateAfter?.resultTypeId === "service.ultrasound",
);
const terminalUltrasoundRecords = EXACT_TEST_CHOICE_ORDER_RECORDS.filter((record) =>
  record.caseId.startsWith("case.gs028c.") && record.disposition.kind === "terminal_service" && record.disposition.serviceId === "service.ultrasound",
);

describe("GS-028 October 2 batch admission", () => {
  it("admits all twenty objectives, seventy-eight cases, and their exact timed orders", () => {
    expect(GS028_20261002_TESTED_CONCEPTS).toHaveLength(20);
    expect(GS028_20261002_CASES).toHaveLength(78);
    for (const item of GS028_20261002_CASES) expect(PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.filter((candidate) => candidate.id === item.id)).toHaveLength(1);
    const records = EXACT_TEST_CHOICE_ORDER_RECORDS.filter((record) => record.caseId.startsWith("case.gs028c."));
    expect(records).toHaveLength(27);
    expect(records.filter((record) => record.disposition.kind === "result_gate_route_override")).toHaveLength(2);
    expect(records.filter((record) => record.disposition.kind === "terminal_service")).toHaveLength(2);
    expect(records.filter((record) => record.disposition.kind === "not_executed" && record.disposition.reason === "external_only")).toHaveLength(12);
  });

  it.each(GS028_20261002_CASES.map((item, index) => [index, item] as const))(
    "runs every node correctly and idempotently through case %s", (index, item) => { complete(item, true, index); },
  );
  it.each(GS028_20261002_CASES.map((item, index) => [index, item] as const))(
    "runs every node wrong with corrected-key continuation through case %s", (index, item) => { complete(item, false, index); },
  );

  it.each(pairedUltrasoundCases)(
    "runs paired ultrasound case $id in house, preserves the gate, then refers without an invented biopsy service",
    (clinicalCase) => {
      const encounterId = `encounter.gs028c.gate.${clinicalCase.id}`;
      let state = admit(preparedUltrasoundClinic(`gate.${clinicalCase.id}`), clinicalCase, encounterId, `${encounterId}.admit`);
      state = ready(state, encounterId, `${encounterId}.ready`);
      const first = answerCommand(state, encounterId, true, `${encounterId}.first-answer`, REAL_MS + 1);
      const preview = getAnswerChoiceServicePreview(state, encounterId, first.choice.id)!;
      expect(preview.diagnosticTiming?.execution).toBe("supported");
      state = gameReducer(state, first.command);
      const pending = state.encounters[encounterId]!.pendingResult!;
      expect(pending).toMatchObject({
        routeId: "route.ultrasound.in_house",
        resultTypeId: "service.ultrasound", deliveredAtTick: null,
      });
      expect(pending.diagnosticTiming?.sources).toEqual(preview.diagnosticTiming!.sources);
      expect(pending.diagnosticTiming?.phases.map((phase) => [phase.id, phase.kind, phase.mode, phase.durationMinutes, phase.requirement, phase.resource])).toEqual(
        preview.diagnosticTiming!.phases.map((phase) => [phase.id, phase.kind, phase.mode, phase.durationMinutes, phase.requirement, phase.resource]),
      );
      expect(pending.diagnosticTiming?.phases.find((phase) => phase.kind === "acquisition")).toMatchObject({
        mode: "local",
        resource: { roomInstanceId: "room.gs028c.ultrasound", employeeIds: ["employee.gs028c.imaging"] },
      });
      expect(state.encounters[encounterId]?.deliveredResultNarratives).toEqual([]);
      expect(getCurrentQuestion(state, encounterId)).toBeNull();
      state = acknowledge(state, encounterId, `${encounterId}.acknowledge`);
      const acquisition = state.encounters[encounterId]!.pendingResult!.diagnosticTiming!.phases.find((phase) => phase.kind === "acquisition")!;
      expect(state.serviceOperations.find((operation) => operation.id === acquisition.serviceOperationId)).toMatchObject({
        actorId: encounterId,
        reservedEmployeeIds: ["employee.gs028c.imaging"],
        diagnosticPhysicalWork: { orderId: pending.diagnosticTiming!.orderId },
        testChoiceOrder: { purpose: "result_gate", choiceId: first.choice.id },
      });
      const frozenCase = jsonClone(state.encounters[encounterId]!.frozenCase);
      const frozenPending = jsonClone(state.encounters[encounterId]!.pendingResult);
      state = deserializeGameState(serializeGameState(state));
      expect(state.encounters[encounterId]?.frozenCase).toEqual(frozenCase);
      expect(state.encounters[encounterId]?.pendingResult).toEqual(frozenPending);
      expect(state.encounters[encounterId]?.deliveredResultNarratives).toEqual([]);
      expect(getCurrentQuestion(state, encounterId)).toBeNull();

      state = waitForResult(state, encounterId, `${encounterId}.wait`);
      state = ready(state, encounterId, `${encounterId}.returned`);
      expect(getCurrentQuestion(state, encounterId)?.node.primaryConceptId).toBe(clinicalCase.decisionNodes[1]?.primaryConceptId);
      expect(state.encounters[encounterId]?.deliveredResultNarratives).toContain(clinicalCase.decisionNodes[0]!.resultGateAfter!.resultNarrative);
      expect(state.serviceIncomeReceipts.filter((receipt) => receipt.actorId === encounterId)).toEqual([
        expect.objectContaining({ incomeLineId: "income.ultrasound", grossAmount: 120, netCashDelta: 120 }),
      ]);

      const second = answerCommand(state, encounterId, true, `${encounterId}.referral`, REAL_MS + 2);
      expect(second.choice.label).toBe("Breast-specialist biopsy referral");
      expect(second.choice.serviceRequest).toBeNull();
      const receipts = state.serviceIncomeReceipts.filter((receipt) => receipt.actorId === encounterId);
      const operations = state.serviceOperations.filter((operation) => operation.actorId === encounterId);
      state = gameReducer(state, second.command);
      expect(state.operationReceipts[second.command.operationId]?.status).toBe("applied");
      expect(state.learningHistories[second.question.node.primaryConceptId]?.reviews).toHaveLength(1);
      expect(state.serviceIncomeReceipts.filter((receipt) => receipt.actorId === encounterId)).toEqual(receipts);
      expect(state.serviceOperations.filter((operation) => operation.actorId === encounterId)).toEqual(operations);
      expect(state.encounters[encounterId]?.terminalTestOrder).toBeUndefined();
      state = acknowledgeAndClose(state, encounterId, `${encounterId}.resolve`);
      expect(state.encounters[encounterId]?.lifecycle).toBe("resolved");
    },
  );

  it.each(terminalUltrasoundRecords)(
    "executes terminal ultrasound order $choiceId onsite exactly once",
    (record) => {
      if (record.disposition.kind !== "terminal_service") throw new Error("Expected terminal-service record.");
      const clinicalCase = GS028_20261002_CASES.find((item) => item.id === record.caseId);
      if (!clinicalCase) throw new Error(`Missing ${record.caseId}.`);
      const encounterId = `encounter.gs028c.terminal.onsite.${record.choiceId}`;
      let state = admit(preparedUltrasoundClinic(`terminal.onsite.${record.choiceId}`), clinicalCase, encounterId, `${encounterId}.admit`);
      expect(getEligibleServiceRoute(state, record.disposition.serviceId, record.disposition.allowedRouteIds, PROTOTYPE_DOMAIN_CONTEXT, encounterId)?.route.id).toBe("route.ultrasound.in_house");
      state = readyAtNode(state, encounterId, record.nodeId, `${encounterId}.ready`);
      const answer = answerCommand(state, encounterId, true, `${encounterId}.answer`, REAL_MS + 3);
      state = gameReducer(state, answer.command);
      expect(state.encounters[encounterId]?.terminalTestOrder).toMatchObject({
        caseId: record.caseId, nodeId: record.nodeId, questionVariantId: record.questionVariantId,
        choiceId: record.choiceId, choiceLabel: record.choiceLabel, serviceId: "service.ultrasound",
        status: "onsite_service", routeId: "route.ultrasound.in_house", serviceOperationId: expect.any(String),
      });
      expect(state.serviceOperations).toHaveLength(1);
      expect(gameReducer(state, answer.command)).toBe(state);
      expect(state.learningHistories[answer.question.node.primaryConceptId]?.reviews).toHaveLength(1);
      for (let tick = 0; tick < 1_500 && state.serviceIncomeReceipts.filter((receipt) => receipt.actorId === encounterId).length === 0; tick += 1) {
        state = gameReducer(state, { type: "ADVANCE_TICK", operationId: `${encounterId}.service.${tick}`, advancedAtRealMs: REAL_MS });
      }
      expect(state.serviceOperations[0]).toMatchObject({
        status: expect.stringMatching(/^(completed|leaving)$/),
        testChoiceOrder: { purpose: "terminal", choiceId: record.choiceId, serviceId: "service.ultrasound" },
      });
      expect(state.serviceIncomeReceipts.filter((receipt) => receipt.actorId === encounterId)).toEqual([
        expect.objectContaining({ incomeLineId: "income.ultrasound", grossAmount: 120, netCashDelta: 120 }),
      ]);
      expect(state.learningHistories[answer.question.node.primaryConceptId]?.reviews).toHaveLength(1);
    },
  );

  it("loads a pre-batch save, inserts twenty blank histories, and preserves all old cards and frozen encounters", () => {
    const oldCase = PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.find((clinicalCase) =>
      clinicalCase.routineEligible && clinicalCase.decisionNodes.every((node) =>
        !GS028_20261002_TESTED_CONCEPTS.some((concept) => concept.id === node.primaryConceptId),
      ),
    );
    if (!oldCase) throw new Error("Missing an established pre-batch case fixture.");
    const oldConceptId = oldCase.decisionNodes[0]!.primaryConceptId;
    let state = prepared("prebatch-save", 2);
    markReviewed(state, oldConceptId, REAL_MS - 123_456);
    state = gameReducer(state, {
      type: "ADMIT_PATIENT", operationId: "prebatch.old.admit",
      encounterId: "prebatch.old.encounter", caseId: oldCase.id,
      patientDisplayName: "Frozen Existing Patient", arrivalClass: "routine",
    });
    for (const concept of GS028_20261002_TESTED_CONCEPTS) markReviewed(state, concept.id, REAL_MS + 86_400_000);
    const oldHistory = jsonClone(state.learningHistories[oldConceptId]);
    const oldFrozenCase = jsonClone(state.encounters["prebatch.old.encounter"]!.frozenCase);
    const newConceptIds = new Set(GS028_20261002_TESTED_CONCEPTS.map((concept) => concept.id));
    const allOldHistories = jsonClone(Object.fromEntries(
      Object.entries(state.learningHistories).filter(([conceptId]) => !newConceptIds.has(conceptId)),
    ));
    const serialized = JSON.parse(serializeGameState(state)) as { learningHistories: Record<string, unknown> };
    for (const concept of GS028_20261002_TESTED_CONCEPTS) delete serialized.learningHistories[concept.id];

    state = deserializeGameState(JSON.stringify(serialized));
    expect(state.learningHistories[oldConceptId]).toEqual(oldHistory);
    for (const [conceptId, history] of Object.entries(allOldHistories)) {
      expect(state.learningHistories[conceptId]).toEqual(history);
    }
    expect(state.encounters["prebatch.old.encounter"]?.frozenCase).toEqual(oldFrozenCase);
    for (const concept of GS028_20261002_TESTED_CONCEPTS) {
      expect(state.learningHistories[concept.id]).toMatchObject({
        conceptId: concept.id,
        card: { reps: 0, lastReviewAtMs: null },
        reviews: [],
      });
    }

    expect(state.learningHistories[oldConceptId]).toEqual(oldHistory);
    expect(state.encounters["prebatch.old.encounter"]?.frozenCase).toEqual(oldFrozenCase);
    expect(GS028_20261002_TESTED_CONCEPTS.every((concept) => state.learningHistories[concept.id]?.reviews.length === 0)).toBe(true);
  });

  it("selects each new objective independently when all other new objectives are learned and not due", () => {
    for (const target of GS028_20261002_TESTED_CONCEPTS) {
      const state = prepared(`independent.${target.id}`, 2);
      for (const concept of GS028_20261002_TESTED_CONCEPTS) {
        if (concept.id !== target.id) markReviewed(state, concept.id, REAL_MS + 86_400_000);
      }
      const selection = selectRoutineClinicalCase(state, GS028_20261002_CASES, REAL_MS);
      expect(selection).toMatchObject({ kind: "new_concept", selectedConceptId: target.id });
      expect(selection?.clinicalCase.decisionNodes).toHaveLength(1);
      expect(selection?.clinicalCase.decisionNodes[0]?.primaryConceptId).toBe(target.id);
    }
  });

  it("prioritizes due new objectives and returns none when all twenty are not due", () => {
    for (const target of GS028_20261002_TESTED_CONCEPTS) {
      const state = prepared(`due.${target.id}`, 2);
      for (const concept of GS028_20261002_TESTED_CONCEPTS) {
        markReviewed(state, concept.id, concept.id === target.id ? REAL_MS - 1 : REAL_MS + 86_400_000);
      }
      const selection = selectRoutineClinicalCase(state, GS028_20261002_CASES, REAL_MS);
      expect(selection).toMatchObject({ kind: "due_review", selectedConceptId: target.id });
      expect(selection?.clinicalCase.decisionNodes).toHaveLength(1);
      expect(selection?.clinicalCase.decisionNodes[0]?.primaryConceptId).toBe(target.id);
    }
    const noneDue = prepared("none-due", 2);
    for (const concept of GS028_20261002_TESTED_CONCEPTS) markReviewed(noneDue, concept.id, REAL_MS + 86_400_000);
    expect(selectRoutineClinicalCase(noneDue, GS028_20261002_CASES, REAL_MS)).toBeNull();
  });

  it("blocks a new objective while its own encounter remains unresolved", () => {
    for (const target of GS028_20261002_TESTED_CONCEPTS) {
      const clinicalCase = standaloneFor(target.id);
      const encounterId = `unresolved.${target.id}`;
      let state = prepared(encounterId, 2);
      state = admit(state, clinicalCase, encounterId, `${encounterId}.admit`);
      expect(selectRoutineClinicalCase(state, [clinicalCase], REAL_MS)).toBeNull();
    }
  });

  it.each(terminalUltrasoundRecords)(
    "arranges terminal ultrasound order $choiceId offsite without staff and queues it onsite while staff is busy",
    (record) => {
      if (record.disposition.kind !== "terminal_service") throw new Error("Expected terminal-service record.");
      const clinicalCase = GS028_20261002_CASES.find((item) => item.id === record.caseId);
      if (!clinicalCase) throw new Error(`Missing ${record.caseId}.`);
      const missingId = `encounter.gs028c.terminal.missing.${record.choiceId}`;
      let missing = preparedUltrasoundClinic(`terminal.missing.${record.choiceId}`);
      missing.employees = missing.employees.filter((employee) => employee.id !== "employee.gs028c.imaging");
      missing = admit(missing, clinicalCase, missingId, `${missingId}.admit`);
      missing = readyAtNode(missing, missingId, record.nodeId, `${missingId}.ready`);
      const missingAnswer = answerCommand(missing, missingId, true, `${missingId}.answer`, REAL_MS + 4);
      missing = gameReducer(missing, missingAnswer.command);
      expect(missing.encounters[missingId]?.terminalTestOrder).toMatchObject({
        serviceId: "service.ultrasound", status: "external_arranged",
        routeId: "route.ultrasound.outsourced", serviceOperationId: null,
      });
      expect(missing.serviceOperations.filter((operation) => operation.actorId === missingId)).toEqual([]);
      expect(missing.serviceIncomeReceipts.filter((receipt) => receipt.actorId === missingId)).toEqual([]);
      expect(missing.learningHistories[missingAnswer.question.node.primaryConceptId]?.reviews).toHaveLength(1);

      const busyId = `encounter.gs028c.terminal.busy.${record.choiceId}`;
      let busy = preparedUltrasoundClinic(`terminal.busy.${record.choiceId}`);
      busy = admit(busy, clinicalCase, busyId, `${busyId}.admit`);
      busy = readyAtNode(busy, busyId, record.nodeId, `${busyId}.ready`);
      const technician = busy.employees.find((employee) => employee.id === "employee.gs028c.imaging")!;
      const competingOperationId = occupyUltrasound(busy);
      const busyAnswer = answerCommand(busy, busyId, true, `${busyId}.answer`, REAL_MS + 5);
      const busyPreview = getAnswerChoiceServicePreview(busy, busyId, busyAnswer.choice.id)!;
      expect(busyPreview.diagnosticTiming!.phases.find((phase) => phase.kind === "acquisition")).toMatchObject({
        mode: "local", forecast: { queueMinutes: expect.any(Number) },
        resource: { employeeIds: [technician.id] },
      });
      expect(busyPreview.diagnosticTiming!.phases.find((phase) => phase.kind === "acquisition")!.forecast.queueMinutes).toBeGreaterThan(0);
      busy = gameReducer(busy, busyAnswer.command);
      expect(busy.encounters[busyId]?.terminalTestOrder).toMatchObject({
        serviceId: "service.ultrasound", status: "onsite_service",
        routeId: "route.ultrasound.in_house", serviceOperationId: expect.any(String),
      });
      expect(busy.serviceOperations.filter((operation) => operation.actorId === busyId)).toEqual([
        expect.objectContaining({
          status: "waiting_for_resources",
          testChoiceOrder: expect.objectContaining({ purpose: "terminal", choiceId: record.choiceId }),
        }),
      ]);
      expect(busy.serviceIncomeReceipts.filter((receipt) => receipt.actorId === busyId)).toEqual([]);
      expect(busy.learningHistories[busyAnswer.question.node.primaryConceptId]?.reviews).toHaveLength(1);
      for (let tick = 0; tick < 1_500 && busy.serviceIncomeReceipts.filter((receipt) => receipt.actorId === busyId).length === 0; tick += 1) {
        busy = gameReducer(busy, { type: "ADVANCE_TICK", operationId: `${busyId}.service.${tick}`, advancedAtRealMs: REAL_MS });
      }
      const operation = busy.serviceOperations.find((candidate) => candidate.actorId === busyId)!;
      const competing = busy.serviceOperations.find((candidate) => candidate.id === competingOperationId)!;
      expect(competing.completedAtFacilityTick).not.toBeNull();
      expect(operation.diagnosticPhysicalWork!.phaseWitnesses[0]!.startedAtFacilityTick).toBeGreaterThanOrEqual(competing.completedAtFacilityTick!);
      expect(busy.serviceIncomeReceipts.filter((receipt) => receipt.actorId === competing.actorId)).toHaveLength(1);
      expect(busy.serviceIncomeReceipts.filter((receipt) => receipt.actorId === busyId)).toHaveLength(1);
      expect(busy.learningHistories[busyAnswer.question.node.primaryConceptId]?.reviews).toHaveLength(1);
    },
  );
});
