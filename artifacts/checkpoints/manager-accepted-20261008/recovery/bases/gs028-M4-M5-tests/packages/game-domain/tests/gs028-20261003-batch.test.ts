import {
  GS028_20261003_AUTHORING_CONCEPTS,
  GS028_20261003_CASES,
  GS028_20261003_CLAIMS,
  GS028_20261003_QUESTIONS,
  GS028_20261003_SOURCES,
  GS028_20261003_TESTED_CONCEPTS,
  GS028_20261003_TIMING_ENTRIES,
  type SyntheticClinicalCase,
} from "@gamify-surgery/clinical-content";
import { describe, expect, it } from "vitest";
import {
  PROTOTYPE_DOMAIN_CONTEXT, createInitialGameState, deserializeGameState,
  gameReducer, getCurrentQuestion, getEligibleServiceRoute,
  getAnswerChoiceServicePreview,
  selectRoutineClinicalCase, serializeGameState,
  type ConceptReviewEvidence, type GameState,
} from "../src";
import { EXACT_TEST_CHOICE_ORDER_RECORDS } from "../src/test-choice-orders";

const REAL_MS = 1_800_000_000_000;
type BatchCase = (typeof GS028_20261003_CASES)[number];

function jsonClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function prepared(seed: string, stage: 0 | 1 | 2 = 2): GameState {
  const state = createInitialGameState(undefined, {
    campaignId: `campaign.gs028d.${seed}`, campaignSeed: seed,
    createdAtRealMs: REAL_MS,
  });
  state.facilityLevel = stage;
  state.encounters = {};
  state.openChartEncounterId = null;
  state.attendedEncounterId = null;
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  state.nextFinancialPostingTick = Number.MAX_SAFE_INTEGER;
  state.rooms.push({ id: "room.gs028d.examination", roomDefinitionId: "room.examination", x: 34, y: 26, orientation: 0, doorSide: "south", upgradeLevel: 1, cleanliness: 100 });
  state.doors.push({ id: "door.gs028d.examination", roomId: "room.gs028d.examination", side: "south", offset: 1, exterior: false });
  return state;
}

function preparedUltrasoundClinic(seed: string): GameState {
  const state = prepared(seed, 2);
  state.rooms.push(
    { id: "room.gs028d.ultrasound", roomDefinitionId: "room.ultrasound", x: 33, y: 23, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
    ...([24, 25, 26, 27, 28] as const).map((y) => ({ id: `room.gs028d.hall.${y}`, roomDefinitionId: "room.hallway", x: 32, y, orientation: 0 as const, doorSide: null, upgradeLevel: 1 as const, cleanliness: 100 })),
  );
  state.doors.push(
    { id: "door.gs028d.ultrasound", roomId: "room.gs028d.ultrasound", side: "south", offset: 2, exterior: false },
    { id: "door.gs028d.ultrasound.staff", roomId: "room.gs028d.ultrasound", side: "west", offset: 1, exterior: false },
    { id: "door.gs028d.front", roomId: "room.instance.founder_desk", side: "west", offset: 0, exterior: false },
  );
  state.employees.push({
    id: "employee.gs028d.imaging", staffRoleDefinitionId: "staff.imaging_technician",
    displayName: "GS-028D Imaging Technician", appearance: state.founder.appearance,
    hiredAtFacilityTick: state.facilityTick, salaryPerExpenseInterval: 26,
    morale: 75, trainingLevel: 1, homeRoomInstanceId: "room.gs028d.ultrasound",
    location: { x: 32, y: 24 }, path: [{ x: 32, y: 24 }], pathIndex: 0,
    lastMovedAtFacilityTick: state.facilityTick, lastPraisedAtFacilityTick: null,
    nextIdleActionAtFacilityTick: state.facilityTick + 20, facilityTask: null,
  });
  return state;
}

function allRoutesAvailableContext(): typeof PROTOTYPE_DOMAIN_CONTEXT {
  const context = jsonClone(PROTOTYPE_DOMAIN_CONTEXT);
  for (const service of context.balanceRelease.services) {
    service.routes = service.routes.map((route) => ({
      ...route,
      requiredCapabilityId: null,
      requiredCapabilityIds: [],
    }));
  }
  return context;
}

function admit(state: GameState, clinicalCase: SyntheticClinicalCase, encounterId: string, operationId: string): GameState {
  const next = gameReducer(state, {
    type: "ADMIT_PATIENT", operationId, encounterId, caseId: clinicalCase.id,
    patientDisplayName: `GS-028D Patient ${encounterId}`, arrivalClass: "routine",
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

function answerCommand(state: GameState, encounterId: string, correct: boolean, operationId: string, reviewedAtMs: number, choiceIndex = 0) {
  const question = getCurrentQuestion(state, encounterId);
  const choice = question?.node.answerChoices.filter((candidate) => candidate.isCorrect === correct)[choiceIndex];
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
  const standalone = GS028_20261003_CASES.find((clinicalCase) =>
    clinicalCase.decisionNodes.length === 1 && clinicalCase.decisionNodes[0]?.primaryConceptId === conceptId,
  );
  if (!standalone) throw new Error(`${conceptId} lacks a standalone case.`);
  return standalone;
}

function complete(clinicalCase: BatchCase, correct: boolean, index: number, choiceIndex = 0): GameState {
  const answerPath = correct ? "correct" : `wrong.${choiceIndex}`;
  const encounterId = `encounter.gs028d.${answerPath}.${index}`;
  let state = admit(prepared(`${answerPath}.${index}`, clinicalCase.earliestFacilityStage), clinicalCase, encounterId, `${encounterId}.admit`);
  for (let nodeIndex = 0; nodeIndex < clinicalCase.decisionNodes.length; nodeIndex += 1) {
    const prefix = `${encounterId}.${nodeIndex}`;
    state = ready(state, encounterId, `${prefix}.ready`);
    const authored = clinicalCase.decisionNodes[nodeIndex]!;
    const { question, choice, command } = answerCommand(state, encounterId, correct, `${prefix}.answer`, REAL_MS + index * 100 + nodeIndex, choiceIndex);
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

const pairedUltrasoundCases = GS028_20261003_CASES.filter((clinicalCase) =>
  clinicalCase.decisionNodes.length === 2 && clinicalCase.decisionNodes[0]?.resultGateAfter?.resultTypeId === "service.ultrasound",
);
const nonExecutedRecords = EXACT_TEST_CHOICE_ORDER_RECORDS.filter((record) =>
  record.caseId.startsWith("case.gs028d.") && record.disposition.kind === "not_executed",
);
describe("GS-028 October 3 batch admission", () => {
  it("admits all twenty objectives, seventy-eight cases, and their exact timed orders", () => {
    expect(GS028_20261003_TESTED_CONCEPTS).toHaveLength(20);
    expect(GS028_20261003_CASES).toHaveLength(78);
    expect(GS028_20261003_CASES.flatMap((item) => item.decisionNodes)).toHaveLength(80);
    expect(PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.concepts.filter(c => !c.id.startsWith("concept.gs028g."))).toHaveLength(331);
    expect(PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.filter(c => !c.id.startsWith("case.gs028g."))).toHaveLength(1012);
    expect(PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.filter(c => !c.id.startsWith("case.gs028g.")).flatMap((item) => item.decisionNodes)).toHaveLength(1295);
    for (const item of GS028_20261003_CASES) expect(PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.filter((candidate) => candidate.id === item.id)).toHaveLength(1);
    const records = EXACT_TEST_CHOICE_ORDER_RECORDS.filter((record) => record.caseId.startsWith("case.gs028d."));
    expect(records).toHaveLength(19);
    expect(records.filter((record) => record.disposition.kind === "result_gate_route_override")).toHaveLength(2);
    expect(records.filter((record) => record.disposition.kind === "terminal_service")).toHaveLength(0);
    expect(records.filter((record) => record.disposition.kind === "not_executed" && record.disposition.reason === "external_only")).toHaveLength(13);
    expect(records.filter((record) => record.disposition.kind === "not_executed" && record.disposition.reason === "specialist_or_unsupported_service")).toHaveLength(4);
  });

  it("keeps draft provenance complete and every source link HTTPS-only", () => {
    expect(GS028_20261003_SOURCES).toHaveLength(17);
    expect(GS028_20261003_CLAIMS).toHaveLength(21);
    const claims = new Map(GS028_20261003_CLAIMS.map((claim) => [claim.id, claim]));
    const sources = new Map(GS028_20261003_SOURCES.map((source) => [source.id, source]));
    for (const concept of GS028_20261003_AUTHORING_CONCEPTS) {
      for (const claimId of concept.evidenceClaimIds) {
        expect(claims.has(claimId), `${concept.id} references ${claimId}`).toBe(true);
      }
    }
    for (const question of GS028_20261003_QUESTIONS) {
      for (const claimId of question.supportingEvidenceClaimIds) {
        expect(claims.has(claimId), `${question.id} references ${claimId}`).toBe(true);
      }
    }
    for (const claim of GS028_20261003_CLAIMS) {
      expect(claim.reviewStatus).toBe("needs_clinician_review");
      for (const sourceId of claim.sourceIds) {
        expect(sources.has(sourceId), `${claim.id} references ${sourceId}`).toBe(true);
      }
    }
    for (const source of GS028_20261003_SOURCES) {
      expect(source.reviewStatus).toBe("needs_clinician_review");
      expect(source.officialUrl).toMatch(/^https:\/\//);
      for (const claimId of source.evidenceClaimIds) {
        expect(claims.has(claimId), `${source.id} maps ${claimId}`).toBe(true);
      }
    }
  });

  it("binds every accepted node to exact timing metadata and shuffles every answer set", () => {
    const timingKeys = new Set(GS028_20261003_TIMING_ENTRIES.map((entry) =>
      `${entry.caseId}|${entry.nodeId}|${entry.questionVariantId}`,
    ));
    expect(GS028_20261003_TIMING_ENTRIES).toHaveLength(80);
    for (const clinicalCase of GS028_20261003_CASES) {
      for (const node of clinicalCase.decisionNodes) {
        expect(node.shuffleAnswers).toBe(true);
        expect(timingKeys.has(`${clinicalCase.id}|${node.id}|${node.questionVariantId}`)).toBe(true);
      }
    }
  });

  it.each(GS028_20261003_CASES.map((item, index) => [index, item] as const))(
    "runs every node correctly and idempotently through case %s", (index, item) => { complete(item, true, index); },
  );
  it.each(GS028_20261003_CASES.flatMap((item, index) =>
    [0, 1, 2].map((choiceIndex) => [index, item, choiceIndex] as const),
  ))(
    "runs every node through wrong choice path %s for case %s",
    (index, item, choiceIndex) => { complete(item, false, index, choiceIndex); },
  );

  it.each(pairedUltrasoundCases)(
    "runs paired access-ultrasound case $id only through the outsourced route and preserves the returned result",
    (clinicalCase) => {
      const encounterId = `encounter.gs028d.gate.${clinicalCase.id}`;
      let state = admit(preparedUltrasoundClinic(`gate.${clinicalCase.id}`), clinicalCase, encounterId, `${encounterId}.admit`);
      state = ready(state, encounterId, `${encounterId}.ready`);
      const first = answerCommand(state, encounterId, true, `${encounterId}.first-answer`, REAL_MS + 1);
      const record = EXACT_TEST_CHOICE_ORDER_RECORDS.find((candidate) =>
        candidate.caseId === clinicalCase.id &&
        candidate.nodeId === first.question.node.id &&
        candidate.choiceId === first.choice.id,
      );
      expect(record?.disposition.kind).toBe("result_gate_route_override");
      if (record?.disposition.kind !== "result_gate_route_override") throw new Error("Missing outsourced access-ultrasound route override.");
      expect(getEligibleServiceRoute(
        state,
        record.disposition.serviceId,
        record.disposition.allowedRouteIds,
        PROTOTYPE_DOMAIN_CONTEXT,
        encounterId,
      )?.route.id).toBe("route.ultrasound.in_house");
      expect(getEligibleServiceRoute(
        state,
        record.disposition.serviceId,
        record.disposition.allowedRouteIds,
        PROTOTYPE_DOMAIN_CONTEXT,
        encounterId,
        record.disposition.allowOnsiteEquivalents ?? true,
      )?.route.id).toBe("route.ultrasound.outsourced");
      expect(getAnswerChoiceServicePreview(state, encounterId, first.choice.id)).toMatchObject({
        kind: "test",
        routeId: "route.ultrasound.outsourced",
        routeDisplayName: expect.any(String),
      });
      state = gameReducer(state, first.command);
      expect(state.encounters[encounterId]?.pendingResult).toMatchObject({
        routeId: "route.ultrasound.outsourced",
        resultTypeId: "service.ultrasound", deliveredAtTick: null,
      });
      expect(state.encounters[encounterId]?.pendingResult?.imagingTechnicianId).toBeNull();
      expect(state.serviceOperations.filter((operation) => operation.actorId === encounterId)).toEqual([]);
      expect(state.serviceIncomeReceipts.filter((receipt) => receipt.actorId === encounterId)).toEqual([]);
      expect(state.encounters[encounterId]?.deliveredResultNarratives).toEqual([]);
      expect(getCurrentQuestion(state, encounterId)).toBeNull();
      state = acknowledge(state, encounterId, `${encounterId}.acknowledge`);
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
      expect(state.serviceIncomeReceipts.filter((receipt) => receipt.actorId === encounterId)).toEqual([]);

      const second = answerCommand(state, encounterId, true, `${encounterId}.referral`, REAL_MS + 2);
      expect(second.choice.label).toMatch(/access team/i);
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

  it.each(pairedUltrasoundCases.flatMap((clinicalCase) =>
    ["missing", "busy"].map((resourceState) => [clinicalCase, resourceState] as const),
  ))(
    "keeps $id outsourced when onsite ultrasound staff are $resourceState",
    (clinicalCase, resourceState) => {
      const encounterId = `encounter.gs028d.gate.${resourceState}.${clinicalCase.id}`;
      let state = preparedUltrasoundClinic(`gate.${resourceState}.${clinicalCase.id}`);
      if (resourceState === "missing") {
        state.employees = state.employees.filter((employee) => employee.id !== "employee.gs028d.imaging");
      } else {
        state.employees.find((employee) => employee.id === "employee.gs028d.imaging")!.facilityTask = {
          kind: "perform_imaging",
          targetId: "existing-ultrasound-service",
          startedAtFacilityTick: state.facilityTick,
          workMinutesRemaining: Number.MAX_SAFE_INTEGER,
        };
      }
      state = admit(state, clinicalCase, encounterId, `${encounterId}.admit`);
      state = ready(state, encounterId, `${encounterId}.ready`);
      const answer = answerCommand(state, encounterId, true, `${encounterId}.answer`, REAL_MS + 2);
      state = gameReducer(state, answer.command);
      expect(state.encounters[encounterId]?.pendingResult).toMatchObject({
        routeId: "route.ultrasound.outsourced",
        deliveredAtTick: null,
      });
      expect(state.encounters[encounterId]?.pendingResult?.resourceQueue).toBeUndefined();
      expect(state.encounters[encounterId]!.pendingResult!.dueTick).toBeGreaterThan(state.facilityTick);
      expect(state.serviceOperations.filter((operation) => operation.actorId === encounterId)).toEqual([]);
      expect(state.serviceIncomeReceipts.filter((receipt) => receipt.actorId === encounterId)).toEqual([]);
    },
  );

  it.each(nonExecutedRecords)(
    "keeps external or specialist test $choiceId outside clinic execution",
    (record) => {
      const clinicalCase = GS028_20261003_CASES.find((item) => item.id === record.caseId);
      if (!clinicalCase) throw new Error(`Missing ${record.caseId}.`);
      const encounterId = `encounter.gs028d.external.${record.choiceId}`;
      let state = admit(prepared(`external.${record.choiceId}`, clinicalCase.earliestFacilityStage), clinicalCase, encounterId, `${encounterId}.admit`);
      state = readyAtNode(state, encounterId, record.nodeId, `${encounterId}.ready`);
      const answer = answerCommand(state, encounterId, true, `${encounterId}.answer`, REAL_MS + 3);
      expect(answer.choice.id).toBe(record.choiceId);
      const context = allRoutesAvailableContext();
      if (/\b(?:CT|LDCT)\b/.test(record.choiceLabel)) {
        expect(getEligibleServiceRoute(state, "service.ct", null, context, encounterId)).not.toBeNull();
      }
      if (record.timingProfileId === "timing.test.basic_labs") {
        expect(getEligibleServiceRoute(state, "service.basic_labs", null, context, encounterId)).not.toBeNull();
      }
      const preview = getAnswerChoiceServicePreview(state, encounterId, record.choiceId, context);
      expect(preview).toMatchObject({
        kind: "test",
        durationTicks: expect.any(Number),
        timingProfileId: record.timingProfileId,
        diagnosticTiming: { execution: "preview_only", timingVersion: "diagnostic-timing.v1" },
      });
      const plan = preview!.diagnosticTiming!;
      expect(plan.phases.some((phase) => phase.mode === "local" && phase.patientPresent && phase.requirement)).toBe(false);
      expect(preview!.durationTicks).toBe(Math.max(...plan.phases.map((phase) => phase.forecast.endsAtTick)) - state.facilityTick);
      expect(preview!.routeDisplayName).toBe(plan.sources[0]!.routeDisplayName);
      if (plan.sources[0]!.routeId) {
        const route = context.balanceRelease.services.flatMap((service) => service.routes).find((candidate) => candidate.id === plan.sources[0]!.routeId)!;
        expect(route).toMatchObject({ patientTravel: null, resourceRequirements: [] });
        expect(route.patientRemainsOnsite).not.toBe(true);
      } else {
        expect(plan.sources[0]!.kind).toBe("retained_profile");
        expect(preview!.routeDisplayName).toBe(context.balanceRelease.answerChoiceTimingProfiles.find((profile) => profile.id === record.timingProfileId)!.displayName);
      }
      if (preview?.serviceId && context.balanceRelease.services.some((service) => service.id === preview.serviceId)) {
        expect(getEligibleServiceRoute(state, preview.serviceId, null, context, encounterId)).not.toBeNull();
      }
      state = gameReducer(state, answer.command);
      expect(state.operationReceipts[answer.command.operationId]?.status).toBe("applied");
      expect(state.encounters[encounterId]).toMatchObject({
        lifecycle: "resolved_summary_available",
        resolutionReason: "completed",
        pendingResult: null,
      });
      expect(state.encounters[encounterId]?.terminalTestOrder).toBeUndefined();
      expect(state.serviceOperations.filter((operation) => operation.actorId === encounterId)).toEqual([]);
      expect(state.serviceIncomeReceipts.filter((receipt) => receipt.actorId === encounterId)).toEqual([]);
      expect(state.learningHistories[answer.question.node.primaryConceptId]?.reviews).toHaveLength(1);
    },
  );

  it("keeps representative older exact records backward compatible", () => {
    const externalCase = PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.find((item) =>
      item.id === "case.gs028c.appendicitis.a-nondiagnostic-ultrasound",
    );
    if (!externalCase) throw new Error("Missing older external-only CT case.");
    let external = admit(prepared("older.external", 2), externalCase, "encounter.older.external", "older.external.admit");
    external = ready(external, "encounter.older.external", "older.external.ready");
    const externalQuestion = getCurrentQuestion(external, "encounter.older.external")!;
    const externalCorrect = externalQuestion.node.answerChoices.find((choice) => choice.isCorrect)!;
    const context = allRoutesAvailableContext();
    expect(getEligibleServiceRoute(external, "service.ct", null, context, "encounter.older.external")).not.toBeNull();
    const externalPreview = getAnswerChoiceServicePreview(external, "encounter.older.external", externalCorrect.id, context)!;
    expect(externalPreview).toMatchObject({
      kind: "test",
      routeId: "route.ct.outsourced",
      timingProfileId: "timing.test.ct",
      diagnosticTiming: { execution: "preview_only" },
    });
    expect(externalPreview.diagnosticTiming!.phases.find((phase) => phase.kind === "acquisition")).toMatchObject({ mode: "external", requirement: null });
    expect(externalPreview.durationTicks).toBe(Math.max(...externalPreview.diagnosticTiming!.phases.map((phase) => phase.forecast.endsAtTick)) - external.facilityTick);

    const terminalCase = PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.find((item) =>
      item.id === "case.gs028c.palpable-breast.a-recent-negative",
    );
    if (!terminalCase) throw new Error("Missing older onsite-equivalent ultrasound case.");
    let terminal = admit(preparedUltrasoundClinic("older.terminal"), terminalCase, "encounter.older.terminal", "older.terminal.admit");
    terminal = ready(terminal, "encounter.older.terminal", "older.terminal.ready");
    const terminalQuestion = getCurrentQuestion(terminal, "encounter.older.terminal")!;
    const terminalCorrect = terminalQuestion.node.answerChoices.find((choice) => choice.isCorrect)!;
    expect(getAnswerChoiceServicePreview(terminal, "encounter.older.terminal", terminalCorrect.id)).toMatchObject({
      kind: "test",
      routeId: "route.ultrasound.in_house",
      timingProfileId: "timing.test.ultrasound",
    });
  });

  it("loads a pre-batch save, inserts twenty blank histories, and preserves all old cards and frozen encounters", () => {
    const oldCase = PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.find((clinicalCase) =>
      clinicalCase.routineEligible && clinicalCase.decisionNodes.every((node) =>
        !GS028_20261003_TESTED_CONCEPTS.some((concept) => concept.id === node.primaryConceptId),
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
    for (const concept of GS028_20261003_TESTED_CONCEPTS) markReviewed(state, concept.id, REAL_MS + 86_400_000);
    const oldHistory = jsonClone(state.learningHistories[oldConceptId]);
    const oldFrozenCase = jsonClone(state.encounters["prebatch.old.encounter"]!.frozenCase);
    const newConceptIds = new Set(GS028_20261003_TESTED_CONCEPTS.map((concept) => concept.id));
    const allOldHistories = jsonClone(Object.fromEntries(
      Object.entries(state.learningHistories).filter(([conceptId]) => !newConceptIds.has(conceptId)),
    ));
    const serialized = JSON.parse(serializeGameState(state)) as { learningHistories: Record<string, unknown> };
    for (const concept of GS028_20261003_TESTED_CONCEPTS) delete serialized.learningHistories[concept.id];

    state = deserializeGameState(JSON.stringify(serialized));
    expect(state.learningHistories[oldConceptId]).toEqual(oldHistory);
    for (const [conceptId, history] of Object.entries(allOldHistories)) {
      expect(state.learningHistories[conceptId]).toEqual(history);
    }
    expect(state.encounters["prebatch.old.encounter"]?.frozenCase).toEqual(oldFrozenCase);
    for (const concept of GS028_20261003_TESTED_CONCEPTS) {
      expect(state.learningHistories[concept.id]).toMatchObject({
        conceptId: concept.id,
        card: { reps: 0, lastReviewAtMs: null },
        reviews: [],
      });
    }

    expect(state.learningHistories[oldConceptId]).toEqual(oldHistory);
    expect(state.encounters["prebatch.old.encounter"]?.frozenCase).toEqual(oldFrozenCase);
    expect(GS028_20261003_TESTED_CONCEPTS.every((concept) => state.learningHistories[concept.id]?.reviews.length === 0)).toBe(true);
  });

  it("selects each new objective independently when all other new objectives are learned and not due", () => {
    for (const target of GS028_20261003_TESTED_CONCEPTS) {
      const state = prepared(`independent.${target.id}`, 2);
      for (const concept of GS028_20261003_TESTED_CONCEPTS) {
        if (concept.id !== target.id) markReviewed(state, concept.id, REAL_MS + 86_400_000);
      }
      const selection = selectRoutineClinicalCase(state, GS028_20261003_CASES, REAL_MS);
      expect(selection).toMatchObject({ kind: "new_concept", selectedConceptId: target.id });
      expect(selection?.clinicalCase.decisionNodes).toHaveLength(1);
      expect(selection?.clinicalCase.decisionNodes[0]?.primaryConceptId).toBe(target.id);
    }
  });

  it("prioritizes due new objectives and returns none when all twenty are not due", () => {
    for (const target of GS028_20261003_TESTED_CONCEPTS) {
      const state = prepared(`due.${target.id}`, 2);
      for (const concept of GS028_20261003_TESTED_CONCEPTS) {
        markReviewed(state, concept.id, concept.id === target.id ? REAL_MS - 1 : REAL_MS + 86_400_000);
      }
      const selection = selectRoutineClinicalCase(state, GS028_20261003_CASES, REAL_MS);
      expect(selection).toMatchObject({ kind: "due_review", selectedConceptId: target.id });
      expect(selection?.clinicalCase.decisionNodes).toHaveLength(1);
      expect(selection?.clinicalCase.decisionNodes[0]?.primaryConceptId).toBe(target.id);
    }
    const noneDue = prepared("none-due", 2);
    for (const concept of GS028_20261003_TESTED_CONCEPTS) markReviewed(noneDue, concept.id, REAL_MS + 86_400_000);
    expect(selectRoutineClinicalCase(noneDue, GS028_20261003_CASES, REAL_MS)).toBeNull();
  });

  it("blocks a new objective while its own encounter remains unresolved", () => {
    for (const target of GS028_20261003_TESTED_CONCEPTS) {
      const clinicalCase = standaloneFor(target.id);
      const encounterId = `unresolved.${target.id}`;
      let state = prepared(encounterId, 2);
      state = admit(state, clinicalCase, encounterId, `${encounterId}.admit`);
      expect(selectRoutineClinicalCase(state, [clinicalCase], REAL_MS)).toBeNull();
    }
  });

});
