import { describe, expect, it } from "vitest";
import type { SyntheticClinicalCase } from "@gamify-surgery/clinical-content";
import {
  GS028_20260928_BATCH_MANIFEST,
  GS028_20260928_CASES,
  GS028_20260928_CLAIMS,
  GS028_20260928_QUESTIONS,
  GS028_20260928_SERVICE_CONTRACTS,
  GS028_20260928_SOURCES,
  GS028_20260928_TESTED_CONCEPTS,
} from "../../clinical-content/src/development-batch/2026-09-28-pre-endoscopy/pre-endoscopy-batch";
import {
  PROTOTYPE_DOMAIN_CONTEXT,
  createInitialGameState,
  deserializeGameState,
  gameReducer,
  getCurrentQuestion,
  getEligibleServiceRoute,
  selectRoutineClinicalCase,
  serializeGameState,
  validateDomainContext,
  type ConceptReviewEvidence,
  type GameState,
} from "../src";
import { EXACT_TEST_CHOICE_ORDER_RECORDS } from "../src/test-choice-orders";

const REAL_MS = 1_800_000_000_000;
const BATCH_CONTEXT = validateDomainContext({
  ...PROTOTYPE_DOMAIN_CONTEXT,
  clinicalRelease: {
    ...PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease,
    concepts: [
      ...PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.concepts.filter(
        (concept) => !GS028_20260928_TESTED_CONCEPTS.some((added) => added.id === concept.id),
      ),
      ...GS028_20260928_TESTED_CONCEPTS,
    ],
    cases: [
      ...PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.filter(
        (clinicalCase) => !GS028_20260928_CASES.some((added) => added.id === clinicalCase.id),
      ),
      ...GS028_20260928_CASES,
    ],
  },
});

type BatchCase = (typeof GS028_20260928_CASES)[number];

function prepared(seed: string, stage: 0 | 1 | 2): GameState {
  const state = createInitialGameState(undefined, {
    campaignId: `campaign.gs028.${seed}`,
    campaignSeed: seed,
    createdAtRealMs: REAL_MS,
  });
  state.facilityLevel = stage;
  state.encounters = {};
  state.openChartEncounterId = null;
  state.attendedEncounterId = null;
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  state.rooms.push({
    id: "room.gs028.examination",
    roomDefinitionId: "room.examination",
    x: 34,
    y: 26,
    orientation: 0,
    doorSide: "south",
    upgradeLevel: 1,
    cleanliness: 100,
  });
  state.doors.push({
    id: "door.gs028.examination",
    roomId: "room.gs028.examination",
    side: "south",
    offset: 1,
    exterior: false,
  });
  return state;
}

function admit(
  state: GameState,
  clinicalCase: BatchCase,
  encounterId: string,
  operationId: string,
): GameState {
  return gameReducer(
    state,
    {
      type: "ADMIT_PATIENT",
      operationId,
      encounterId,
      caseId: clinicalCase.id,
      patientDisplayName: `GS-028 Patient ${encounterId}`,
      arrivalClass: "routine",
    },
    BATCH_CONTEXT,
  );
}

function ready(state: GameState, encounterId: string, prefix: string): GameState {
  let next = state;
  for (let attempt = 0; attempt < 1_500; attempt += 1) {
    if (getCurrentQuestion(next, encounterId)) return next;
    const encounter = next.encounters[encounterId];
    if (!encounter) throw new Error(`${encounterId} disappeared before it was ready.`);
    next = encounter.lifecycle === "waiting_unopened" && encounter.patientMovement === null
      ? gameReducer(next, { type: "OPEN_CHART", operationId: `${prefix}.open.${attempt}`, encounterId }, BATCH_CONTEXT)
      : gameReducer(next, { type: "ADVANCE_TICK", operationId: `${prefix}.tick.${attempt}`, advancedAtRealMs: REAL_MS }, BATCH_CONTEXT);
  }
  throw new Error(`${encounterId} did not become answer-ready.`);
}

function answer(
  state: GameState,
  encounterId: string,
  correct: boolean,
  operationId: string,
  reviewedAtMs: number,
): GameState {
  const question = getCurrentQuestion(state, encounterId);
  const choice = question?.node.answerChoices.find((item) => item.isCorrect === correct);
  if (!question || !choice) throw new Error(`${encounterId} lacks a ${correct ? "correct" : "wrong"} answer.`);
  return gameReducer(state, {
    type: "SUBMIT_ANSWER", operationId, encounterId,
    decisionNodeId: question.node.id, answerChoiceId: choice.id, reviewedAtMs,
  }, BATCH_CONTEXT);
}

function acknowledge(state: GameState, encounterId: string, operationId: string): GameState {
  const step = state.encounters[encounterId]?.steps[state.encounters[encounterId]!.currentNodeIndex];
  if (!step) throw new Error(`${encounterId} has no feedback to acknowledge.`);
  return gameReducer(state, {
    type: "ACKNOWLEDGE_DECISION_FEEDBACK", operationId, encounterId, decisionNodeId: step.decisionNodeId,
  }, BATCH_CONTEXT);
}

function waitForResult(state: GameState, encounterId: string, prefix: string): GameState {
  let next = state;
  for (let elapsed = 0; elapsed < 1_500; elapsed += 1) {
    const pending = next.encounters[encounterId]?.pendingResult;
    if (pending && pending.deliveredAtTick !== null) return next;
    expect(getCurrentQuestion(next, encounterId)).toBeNull();
    expect(next.encounters[encounterId]?.deliveredResultNarratives).toEqual([]);
    next = gameReducer(next, {
      type: "ADVANCE_TICK", operationId: `${prefix}.${elapsed}`, advancedAtRealMs: REAL_MS,
    }, BATCH_CONTEXT);
  }
  throw new Error(`${encounterId} did not receive its gated result.`);
}

function complete(
  clinicalCase: BatchCase,
  correct: boolean,
  index: number,
): GameState {
  const encounterId = `encounter.gs028.${correct ? "correct" : "wrong"}.${index}`;
  let state = admit(
    prepared(`${correct ? "correct" : "wrong"}.${index}`, clinicalCase.earliestFacilityStage),
    clinicalCase,
    encounterId,
    `gs028.${correct ? "correct" : "wrong"}.${index}.admit`,
  );
  expect(state.operationReceipts[`gs028.${correct ? "correct" : "wrong"}.${index}.admit`]?.status).toBe("applied");

  for (let nodeIndex = 0; nodeIndex < clinicalCase.decisionNodes.length; nodeIndex += 1) {
    const prefix = `gs028.${correct ? "correct" : "wrong"}.${index}.${nodeIndex}`;
    state = ready(state, encounterId, prefix);
    const question = getCurrentQuestion(state, encounterId);
    const authored = clinicalCase.decisionNodes[nodeIndex];
    expect(question?.node.id).toBe(authored?.id);
    expect(question?.node.answerChoices.map((choice) => choice.id).sort()).toEqual(
      authored?.answerChoices.map((choice) => choice.id).sort(),
    );
    expect(question?.node.answerChoices.some((choice) => choice.isCorrect)).toBe(true);
    expect(question?.node.answerChoices.some((choice) => !choice.isCorrect)).toBe(true);

    state = answer(state, encounterId, correct, `${prefix}.answer`, REAL_MS + index * 100 + nodeIndex);
    expect(state.learningHistories[authored!.primaryConceptId]?.reviews).toHaveLength(1);
    expect(state.encounters[encounterId]?.steps[nodeIndex]?.answer).toMatchObject({
      correct,
      correctedForward: !correct && nodeIndex < clinicalCase.decisionNodes.length - 1,
      ratingIntent: correct ? "Good" : "Again",
    });

    if (nodeIndex === clinicalCase.decisionNodes.length - 1) continue;
    const gate = authored!.resultGateAfter;
    if (!gate) {
      expect(state.encounters[encounterId]?.pendingResult).toBeNull();
      state = acknowledge(state, encounterId, `${prefix}.acknowledge`);
      continue;
    }
    const pending = state.encounters[encounterId]?.pendingResult;
    expect(pending).toMatchObject({
      resultTypeId: gate.resultTypeId,
      routeId: expect.any(String),
      deliveredAtTick: null,
    });
    expect(getCurrentQuestion(state, encounterId)).toBeNull();
    state = acknowledge(state, encounterId, `${prefix}.acknowledge`);
    state = waitForResult(state, encounterId, `${prefix}.wait`);
    expect(state.encounters[encounterId]?.deliveredResultNarratives).toContain(gate.resultNarrative);
  }

  expect(state.encounters[encounterId]).toMatchObject({
    lifecycle: "resolved_summary_available", resolutionReason: "completed",
  });
  for (const node of clinicalCase.decisionNodes) {
    expect(state.learningHistories[node.primaryConceptId]?.reviews).toHaveLength(1);
  }
  return state;
}

function markNotDue(state: GameState, conceptId: string): void {
  const template = Object.values(state.learningHistories)[0];
  if (!template) throw new Error("The initial campaign should provide an FSRS card fixture.");
  state.learningHistories[conceptId] = {
    conceptId,
    card: { ...template.card, dueAtMs: REAL_MS + 86_400_000, lastReviewAtMs: REAL_MS, reps: 1 },
    reviews: [{} as ConceptReviewEvidence],
  };
}

function preparedVenousDuplexClinic(seed: string): GameState {
  const state = prepared(seed, 2);
  state.rooms.push(
    { id: "room.gs028.ultrasound", roomDefinitionId: "room.ultrasound", x: 33, y: 23, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
    ...([24, 25, 26, 27, 28] as const).map((y) => ({ id: `room.gs028.hall.${y}`, roomDefinitionId: "room.hallway", x: 32, y, orientation: 0 as const, doorSide: null, upgradeLevel: 1 as const, cleanliness: 100 })),
  );
  state.doors.push(
    { id: "door.gs028.ultrasound", roomId: "room.gs028.ultrasound", side: "south", offset: 2, exterior: false },
    { id: "door.gs028.ultrasound.staff", roomId: "room.gs028.ultrasound", side: "west", offset: 1, exterior: false },
    { id: "door.gs028.front", roomId: "room.instance.founder_desk", side: "west", offset: 0, exterior: false },
  );
  state.employees.push({
    id: "employee.gs028.imaging", staffRoleDefinitionId: "staff.imaging_technician", displayName: "GS-028 Imaging Technician",
    appearance: state.founder.appearance, hiredAtFacilityTick: state.facilityTick, salaryPerExpenseInterval: 26,
    morale: 75, trainingLevel: 1, homeRoomInstanceId: "room.gs028.ultrasound", location: { x: 32, y: 24 },
    path: [{ x: 32, y: 24 }], pathIndex: 0, lastMovedAtFacilityTick: state.facilityTick,
    lastPraisedAtFacilityTick: null, nextIdleActionAtFacilityTick: state.facilityTick + 20, facilityTask: null,
  });
  return state;
}

function scheduleVenousGate(
  state: GameState,
  clinicalCase: BatchCase,
  prefix: string,
): GameState {
  const encounterId = `${prefix}.encounter`;
  let next = admit(state, clinicalCase, encounterId, `${prefix}.admit`);
  next = ready(next, encounterId, `${prefix}.ready`);
  next = answer(next, encounterId, true, `${prefix}.answer`, REAL_MS + 42);
  expect(next.operationReceipts[`${prefix}.answer`]?.status).toBe("applied");
  expect(next.encounters[encounterId]?.deliveredResultNarratives).toEqual([]);
  return next;
}

describe("GS-028 September 28 pre-Endoscopy batch", () => {
  it("exports the accepted 20-objective / 80-question batch with complete provenance", () => {
    expect(GS028_20260928_BATCH_MANIFEST).toMatchObject({
      contentVersion: expect.stringContaining("2026-09-28"),
      authoringConceptCount: 20,
      testedConceptCount: 20,
      questionVariantCount: 80,
    });
    expect(GS028_20260928_TESTED_CONCEPTS).toHaveLength(20);
    expect(GS028_20260928_QUESTIONS).toHaveLength(80);
    expect(GS028_20260928_CASES.flatMap((clinicalCase) => clinicalCase.decisionNodes)).toHaveLength(80);
    expect(new Set(GS028_20260928_TESTED_CONCEPTS.map((concept) => concept.id)).size).toBe(20);
    expect(new Set(GS028_20260928_QUESTIONS.map((question) => question.id)).size).toBe(80);
    expect(GS028_20260928_CLAIMS.length).toBeGreaterThanOrEqual(20);
    expect(GS028_20260928_SOURCES.length).toBeGreaterThan(0);
    for (const question of GS028_20260928_QUESTIONS) {
      expect(question.reviewStatus).toBe("needs_clinician_review");
      expect(question.supportingEvidenceClaimIds.length).toBeGreaterThan(0);
    }
  });

  it("keeps each authored profile coherent and fully materialized before named-patient generation", () => {
    for (const clinicalCase of GS028_20260928_CASES) {
      expect(clinicalCase.patientDisplayName).toBe("{patientName}");
      expect(clinicalCase.approvedInstantiationProfiles.length).toBeGreaterThan(0);
      const first = clinicalCase.approvedInstantiationProfiles[0]!;
      expect(clinicalCase.prototypeDemographics).toEqual(first.prototypeDemographics);
      expect(clinicalCase.presentation).toBe(first.presentation);
      for (const profile of clinicalCase.approvedInstantiationProfiles) {
        expect(profile.prototypeDemographics.ageYears).toBeGreaterThanOrEqual(18);
        expect(profile.presentation).not.toContain("{patientAge}");
        expect(profile.presentation).not.toContain("{patientSex}");
        const sexWord = profile.prototypeDemographics.sexLabel === "Female"
          ? "woman" : profile.prototypeDemographics.sexLabel === "Male" ? "man" : "adult";
        expect(profile.presentation).toContain(`${profile.prototypeDemographics.ageYears}-year-old ${sexWord}`);
      }
    }
  });

  it("binds the three authored terminal test choices to exact executable terminal-service orders", () => {
    const records = EXACT_TEST_CHOICE_ORDER_RECORDS.filter((record) =>
      record.caseId.startsWith("case.gs028."),
    );
    expect(records).toHaveLength(3);
    for (const record of records) {
      const clinicalCase = GS028_20260928_CASES.find((item) => item.id === record.caseId);
      const node = clinicalCase?.decisionNodes.at(-1);
      const choice = node?.answerChoices.find((item) => item.id === record.choiceId);
      expect(node).toMatchObject({ id: record.nodeId, questionVariantId: record.questionVariantId });
      expect(choice).toMatchObject({ label: record.choiceLabel, isCorrect: true });
      expect(record.disposition.kind).toBe("terminal_service");
    }
  });

  it.each(
    EXACT_TEST_CHOICE_ORDER_RECORDS.filter((record) => record.caseId.startsWith("case.gs028.")).map((record) => [record] as const),
  )("executes terminal service %s through its real onsite lifecycle while wrong answers create no order", (record) => {
    const clinicalCase = GS028_20260928_CASES.find((item) => item.id === record.caseId);
    if (!clinicalCase) throw new Error(`Missing terminal-service case ${record.caseId}.`);
    const correctEncounterId = `encounter.gs028.terminal.correct.${record.choiceId}`;
    let correct = admit(preparedVenousDuplexClinic(`terminal.correct.${record.choiceId}`), clinicalCase, correctEncounterId, `${correctEncounterId}.admit`);
    correct = ready(correct, correctEncounterId, `${correctEncounterId}.ready`);
    correct = answer(correct, correctEncounterId, true, `${correctEncounterId}.answer`, REAL_MS + 100);
    expect(correct.encounters[correctEncounterId]?.terminalTestOrder).toMatchObject({
      caseId: record.caseId, nodeId: record.nodeId, questionVariantId: record.questionVariantId,
      choiceId: record.choiceId, choiceLabel: record.choiceLabel, status: "onsite_service",
      routeId: expect.stringMatching(/\.in_house$/),
    });
    expect(correct.serviceOperations).toHaveLength(1);
    for (let tick = 0; tick < 1_500 && correct.serviceOperations[0]?.status !== "completed"; tick += 1) {
      correct = gameReducer(correct, { type: "ADVANCE_TICK", operationId: `${correctEncounterId}.service.${tick}`, advancedAtRealMs: REAL_MS }, BATCH_CONTEXT);
    }
    expect(["completed", "leaving"]).toContain(correct.serviceOperations[0]?.status);
    expect(correct.serviceOperations[0]).toMatchObject({ testChoiceOrder: { purpose: "terminal", choiceId: record.choiceId } });
    expect(correct.encounters[correctEncounterId]?.terminalTestOrder).toMatchObject({ status: "onsite_service", serviceOperationId: correct.serviceOperations[0]?.id });
    expect(correct.serviceIncomeReceipts.filter((receipt) => receipt.actorId === correctEncounterId)).toHaveLength(1);

    const wrongEncounterId = `encounter.gs028.terminal.wrong.${record.choiceId}`;
    let wrong = admit(preparedVenousDuplexClinic(`terminal.wrong.${record.choiceId}`), clinicalCase, wrongEncounterId, `${wrongEncounterId}.admit`);
    wrong = ready(wrong, wrongEncounterId, `${wrongEncounterId}.ready`);
    wrong = answer(wrong, wrongEncounterId, false, `${wrongEncounterId}.answer`, REAL_MS + 101);
    expect(wrong.encounters[wrongEncounterId]?.terminalTestOrder).toBeUndefined();
    expect(wrong.serviceOperations).toEqual([]);
  }, 10_000);

  it.each(GS028_20260928_CASES.map((clinicalCase, index) => [index, clinicalCase] as const))(
    "runs every authored node in case %s correctly through gates without leaking pending results",
    (index, clinicalCase) => { complete(clinicalCase, true, index); },
  );

  it.each(GS028_20260928_CASES.map((clinicalCase, index) => [index, clinicalCase] as const))(
    "runs every authored node in case %s after wrong answers and corrected-forward continuation",
    (index, clinicalCase) => { complete(clinicalCase, false, index); },
  );

  it.each(GS028_20260928_TESTED_CONCEPTS.map((concept) => [concept.id] as const))(
    "has a standalone routine case for %s",
    (conceptId) => {
      const standalone = GS028_20260928_CASES.find((clinicalCase) =>
        clinicalCase.decisionNodes.length === 1 && clinicalCase.decisionNodes[0]?.primaryConceptId === conceptId,
      );
      expect(standalone?.routineEligible).toBe(true);
    },
  );

  it.each(
    GS028_20260928_CASES
      .filter((clinicalCase) => clinicalCase.decisionNodes.length > 1)
      .flatMap((clinicalCase) => clinicalCase.decisionNodes.map((node) => [clinicalCase, node.primaryConceptId] as const)),
  )(
    "keeps paired objective %s from %s selectable through its standalone case when its sibling is not due",
    (paired, conceptId) => {
      const standalone = GS028_20260928_CASES.find((clinicalCase) =>
        clinicalCase.decisionNodes.length === 1 && clinicalCase.decisionNodes[0]?.primaryConceptId === conceptId,
      );
      if (!standalone) throw new Error(`${conceptId} needs a standalone same-objective case.`);
      const state = prepared(`independent-not-due.${conceptId}`, 2);
      for (const node of paired.decisionNodes) {
        if (node.primaryConceptId !== conceptId) markNotDue(state, node.primaryConceptId);
      }
      const selection = selectRoutineClinicalCase(state, [paired, standalone], REAL_MS);
      expect(selection).toMatchObject({ kind: "new_concept", selectedConceptId: conceptId, clinicalCase: { id: standalone.id } });
    },
  );

  it("maps every declared service route to the current balance contract", () => {
    const state = preparedVenousDuplexClinic("service-routes");
    for (const contract of GS028_20260928_SERVICE_CONTRACTS) {
      const service = BATCH_CONTEXT.balanceRelease.services.find((item) => item.id === contract.serviceId);
      expect(service).toBeDefined();
      expect(contract.allowedRouteIds.every((routeId) => service!.routes.some((route) => route.id === routeId))).toBe(true);
      expect(getEligibleServiceRoute(state, contract.serviceId, ["route.gs028.missing"], BATCH_CONTEXT)).toBeNull();
    }
  });

  it("schedules the declared venous reflux gate in-house when operational, then offsite when its room or technician is unavailable", () => {
    const clinicalCase = GS028_20260928_CASES.find((item) =>
      item.decisionNodes[0]?.resultGateAfter?.resultTypeId === "service.venous_duplex",
    );
    if (!clinicalCase) throw new Error("GS-028 needs a venous reflux result-gated case.");
    const gate = clinicalCase.decisionNodes[0]!.resultGateAfter!;
    expect(gate.allowedServiceRouteIds).toEqual(expect.arrayContaining([
      "route.venous_duplex.in_house", "route.venous_duplex.outsourced",
    ]));

    let onsite = scheduleVenousGate(preparedVenousDuplexClinic("venous-onsite"), clinicalCase, "gs028.venous.onsite");
    expect(onsite.encounters["gs028.venous.onsite.encounter"]?.pendingResult).toMatchObject({
      routeId: "route.venous_duplex.in_house", deliveredAtTick: null,
      imagingTechnicianId: "employee.gs028.imaging",
    });
    expect(onsite.encounters["gs028.venous.onsite.encounter"]?.deliveredResultNarratives).toEqual([]);
    onsite = acknowledge(onsite, "gs028.venous.onsite.encounter", "gs028.venous.onsite.acknowledge");
    onsite = waitForResult(onsite, "gs028.venous.onsite.encounter", "gs028.venous.onsite.wait");
    expect(onsite.encounters["gs028.venous.onsite.encounter"]?.deliveredResultNarratives).toContain(gate.resultNarrative);
    onsite = ready(onsite, "gs028.venous.onsite.encounter", "gs028.venous.onsite.return");
    expect(getCurrentQuestion(onsite, "gs028.venous.onsite.encounter")?.node.id).toBe(clinicalCase.decisionNodes[1]?.id);

    let competing = scheduleVenousGate(preparedVenousDuplexClinic("venous-competing"), clinicalCase, "gs028.venous.first");
    competing = acknowledge(competing, "gs028.venous.first.encounter", "gs028.venous.first.acknowledge");
    for (let tick = 0; tick < 80 && competing.employees.find((employee) => employee.id === "employee.gs028.imaging")?.facilityTask === null; tick += 1) {
      competing = gameReducer(competing, { type: "ADVANCE_TICK", operationId: `gs028.venous.first.start.${tick}`, advancedAtRealMs: REAL_MS }, BATCH_CONTEXT);
    }
    expect(competing.employees.find((employee) => employee.id === "employee.gs028.imaging")?.facilityTask).toMatchObject({ kind: "perform_imaging" });
    competing = admit(competing, clinicalCase, "gs028.venous.queued.encounter", "gs028.venous.queued.admit");
    competing = ready(competing, "gs028.venous.queued.encounter", "gs028.venous.queued.ready");
    competing = answer(competing, "gs028.venous.queued.encounter", true, "gs028.venous.queued.answer", REAL_MS + 43);
    expect(competing.encounters["gs028.venous.queued.encounter"]?.pendingResult).toMatchObject({
      routeId: "route.venous_duplex.in_house", deliveredAtTick: null, imagingTechnicianId: null,
      resourceQueue: { status: "waiting_for_resources", routeId: "route.venous_duplex.in_house" },
    });
    competing = acknowledge(competing, "gs028.venous.queued.encounter", "gs028.venous.queued.acknowledge");
    for (let tick = 0; tick < 1_500 && competing.encounters["gs028.venous.queued.encounter"]?.pendingResult?.resourceQueue; tick += 1) {
      competing = gameReducer(competing, { type: "ADVANCE_TICK", operationId: `gs028.venous.queued.release.${tick}`, advancedAtRealMs: REAL_MS }, BATCH_CONTEXT);
    }
    expect(competing.encounters["gs028.venous.queued.encounter"]?.pendingResult).toMatchObject({
      routeId: "route.venous_duplex.in_house", imagingTechnicianId: "employee.gs028.imaging",
    });
    expect(competing.encounters["gs028.venous.queued.encounter"]?.pendingResult?.resourceQueue).toBeUndefined();
    competing = waitForResult(competing, "gs028.venous.queued.encounter", "gs028.venous.queued.wait");
    expect(competing.encounters["gs028.venous.queued.encounter"]?.deliveredResultNarratives).toContain(gate.resultNarrative);

    const missing = scheduleVenousGate(prepared("venous-missing", 2), clinicalCase, "gs028.venous.missing");
    expect(missing.encounters["gs028.venous.missing.encounter"]?.pendingResult).toMatchObject({
      routeId: "route.venous_duplex.outsourced", deliveredAtTick: null, imagingTechnicianId: null,
    });
  });

  it("preserves a wrong-answer gated encounter across reload until it returns, then completes and departs", () => {
    const clinicalCase = GS028_20260928_CASES.find((item) =>
      item.decisionNodes[0]?.resultGateAfter?.resultTypeId === "service.venous_duplex",
    );
    if (!clinicalCase) throw new Error("GS-028 requires an externally available venous result-gated case.");
    const encounterId = "encounter.gs028.persist";
    let state = admit(prepared("persist", clinicalCase.earliestFacilityStage), clinicalCase, encounterId, "gs028.persist.admit");
    state = ready(state, encounterId, "gs028.persist.ready");
    state = answer(state, encounterId, false, "gs028.persist.wrong", REAL_MS + 1);
    const pending = state.encounters[encounterId]?.pendingResult;
    expect(pending).toMatchObject({ deliveredAtTick: null });
    expect(state.encounters[encounterId]?.deliveredResultNarratives).toEqual([]);
    state = acknowledge(state, encounterId, "gs028.persist.acknowledge");
    const frozen = serializeGameState(state);
    let restored = deserializeGameState(frozen);
    expect(restored.encounters[encounterId]?.pendingResult).toMatchObject({
      gateId: pending?.gateId,
      resultTypeId: pending?.resultTypeId,
      routeId: pending?.routeId,
      resultNarrative: pending?.resultNarrative,
      deliveredAtTick: null,
    });
    expect(restored.encounters[encounterId]?.deliveredResultNarratives).toEqual([]);
    restored = waitForResult(restored, encounterId, "gs028.persist.wait");
    restored = ready(restored, encounterId, "gs028.persist.second");
    restored = answer(restored, encounterId, false, "gs028.persist.second.wrong", REAL_MS + 2);
    expect(restored.encounters[encounterId]).toMatchObject({ lifecycle: "resolved_summary_available", resolutionReason: "completed" });
    restored = gameReducer(restored, { type: "ACKNOWLEDGE_TERMINAL_FEEDBACK", operationId: "gs028.persist.terminal", encounterId }, BATCH_CONTEXT);
    expect(restored.operationReceipts["gs028.persist.terminal"]?.status).toBe("applied");
    restored = gameReducer(restored, { type: "CLOSE_CHART", operationId: "gs028.persist.close", encounterId }, BATCH_CONTEXT);
    expect(restored.operationReceipts["gs028.persist.close"]?.status).toBe("applied");
    for (let tick = 0; tick < 1_500 && restored.encounters[encounterId]?.patientLocation !== null; tick += 1) {
      restored = gameReducer(restored, { type: "ADVANCE_TICK", operationId: `gs028.persist.depart.${tick}`, advancedAtRealMs: REAL_MS }, BATCH_CONTEXT);
    }
    expect(restored.encounters[encounterId]?.patientMovement).toBeNull();
    expect(restored.encounters[encounterId]?.patientLocation).toBeNull();
  });
});
