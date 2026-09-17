import { describe, expect, it } from "vitest";
import {
  TWENTY_CONCEPT_BATCH_CASES,
  TWENTY_CONCEPT_BATCH_CONCEPTS,
  TWENTY_CONCEPT_BATCH_QUESTIONS,
} from "@gamify-surgery/clinical-content";
import {
  PROTOTYPE_DOMAIN_CONTEXT,
  createInitialGameState,
  createPatientPixelAppearance,
  deserializeGameState,
  gameReducer,
  getCurrentQuestion,
  getEligibleServiceRoute,
  serializeGameState,
  type GameState,
} from "../src";

function emptyState(seed: string, level: 0 | 1 | 2): GameState {
  const state = createInitialGameState(undefined, {
    campaignId: `campaign.batch.${seed}`,
    campaignSeed: seed,
    createdAtRealMs: 0,
  });
  state.facilityLevel = level;
  state.encounters = {};
  state.openChartEncounterId = null;
  state.attendedEncounterId = null;
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  return state;
}

function tick(state: GameState, id: string): GameState {
  return gameReducer(state, { type: "ADVANCE_TICK", operationId: id });
}

function ready(state: GameState, encounterId: string, prefix: string): GameState {
  let next = state;
  for (let attempt = 0; attempt < 250; attempt += 1) {
    if (getCurrentQuestion(next, encounterId)) return next;
    const encounter = next.encounters[encounterId]!;
    if (encounter.lifecycle === "waiting_unopened" && encounter.patientMovement === null) {
      next = gameReducer(next, { type: "OPEN_CHART", operationId: `${prefix}.open.${attempt}`, encounterId });
    } else {
      next = tick(next, `${prefix}.tick.${attempt}`);
    }
  }
  throw new Error("Encounter did not become question-ready.");
}

function answer(state: GameState, encounterId: string, correct: boolean, prefix: string, reviewedAtMs: number): GameState {
  const question = getCurrentQuestion(state, encounterId)!;
  const choice = question.node.answerChoices.find((item) => item.isCorrect === correct)!;
  return gameReducer(state, {
    type: "SUBMIT_ANSWER",
    operationId: `${prefix}.answer`,
    encounterId,
    decisionNodeId: question.node.id,
    answerChoiceId: choice.id,
    reviewedAtMs,
  });
}

function acknowledge(state: GameState, encounterId: string, prefix: string): GameState {
  const encounter = state.encounters[encounterId]!;
  return gameReducer(state, {
    type: "ACKNOWLEDGE_DECISION_FEEDBACK",
    operationId: `${prefix}.ack`,
    encounterId,
    decisionNodeId: encounter.steps[encounter.currentNodeIndex]!.decisionNodeId,
  });
}

function advanceToNextNode(state: GameState, encounterId: string, prefix: string): GameState {
  const startingIndex = state.encounters[encounterId]!.currentNodeIndex;
  let next = state;
  for (let minute = 1; minute <= 700; minute += 1) {
    next = tick(next, `${prefix}.${minute}`);
    if (next.encounters[encounterId]!.currentNodeIndex > startingIndex) return next;
  }
  throw new Error("The external result did not unlock the next node.");
}

describe("twenty-concept development admission", () => {
  it("admits all 20 concepts, 80 variants, and 52 cases with unique stable IDs", () => {
    expect(TWENTY_CONCEPT_BATCH_CONCEPTS).toHaveLength(20);
    expect(TWENTY_CONCEPT_BATCH_QUESTIONS).toHaveLength(80);
    expect(TWENTY_CONCEPT_BATCH_CASES).toHaveLength(52);
    expect(new Set(TWENTY_CONCEPT_BATCH_CONCEPTS.map((item) => item.id)).size).toBe(20);
    expect(new Set(TWENTY_CONCEPT_BATCH_QUESTIONS.map((item) => item.id)).size).toBe(80);
    expect(new Set(TWENTY_CONCEPT_BATCH_CASES.map((item) => item.id)).size).toBe(52);
    for (const clinicalCase of TWENTY_CONCEPT_BATCH_CASES) {
      expect(PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.find((item) => item.id === clinicalCase.id)).toBeDefined();
    }
  });

  it("offers the three new services externally at every reached facility stage", () => {
    for (const level of [0, 1, 2] as const) {
      const state = emptyState(`routes-${level}`, level);
      for (const [serviceId, routeId] of [
        ["service.colonoscopy", "route.colonoscopy.outsourced"],
        ["service.upper_endoscopy_duodenal_biopsy", "route.upper_endoscopy_duodenal_biopsy.outsourced"],
        ["service.extremity_mri", "route.extremity_mri.outsourced"],
      ] as const) {
        expect(getEligibleServiceRoute(state, serviceId)).toMatchObject({ route: { id: routeId, requiredCapabilityIds: [] } });
      }
    }
  });

  it("enforces production facility-stage floors for two- and three-node cases", () => {
    const admit = (state: GameState, caseId: string, operationId: string) => gameReducer(state, {
      type: "ADMIT_PATIENT", operationId, encounterId: `encounter.${operationId}`, caseId,
      patientDisplayName: "Stage Test Patient", arrivalClass: "routine",
    });
    let state = admit(emptyState("stage-gallstone-zero", 0), "case.gallstones.symptomatic-postmeal-episodes", "stage.gallstone.zero");
    expect(state.operationReceipts["stage.gallstone.zero"]?.message).toBe("This patient becomes eligible at Level 1.");
    state = admit(emptyState("stage-gallstone-one", 1), "case.gallstones.symptomatic-postmeal-episodes", "stage.gallstone.one");
    expect(state.operationReceipts["stage.gallstone.one"]?.status).toBe("applied");
    state = admit(emptyState("stage-celiac-one", 1), "case.celiac.chronic-diarrhea", "stage.celiac.one");
    expect(state.operationReceipts["stage.celiac.one"]?.message).toBe("This patient becomes eligible at Level 2.");
    state = admit(emptyState("stage-celiac-two", 2), "case.celiac.chronic-diarrhea", "stage.celiac.two");
    expect(state.operationReceipts["stage.celiac.two"]?.status).toBe("applied");
  });

  it("shuffles the same question across admissions while preserving its key", () => {
    const orders = new Set<string>();
    for (let seed = 0; seed < 12; seed += 1) {
      const encounterId = `encounter.shuffle.${seed}`;
      let state = gameReducer(emptyState(`shuffle-${seed}`, 1), {
        type: "ADMIT_PATIENT", operationId: `shuffle.admit.${seed}`, encounterId,
        caseId: "case.gallstones.incidental-checkup", patientDisplayName: "Shuffle Patient", arrivalClass: "routine",
      });
      state = ready(state, encounterId, `shuffle.ready.${seed}`);
      const choices = getCurrentQuestion(state, encounterId)!.node.answerChoices;
      orders.add(choices.map((choice) => choice.id).join("|"));
      expect(choices.filter((choice) => choice.isCorrect)).toHaveLength(1);
      expect(choices.find((choice) => choice.isCorrect)?.id).toBe("observe_1");
    }
    expect(orders.size).toBeGreaterThan(1);
  });

  it("freezes automatic identity, selected demographics, and matching appearance together", () => {
    let state: GameState | undefined;
    for (let seed = 0; seed < 100 && !state; seed += 1) {
      const candidate = emptyState(`auto-identity-${seed}`, 1);
      candidate.nextRoutineArrivalTick = candidate.facilityTick + 1;
      const admitted = tick(candidate, `batch.auto-identity.arrival.${seed}`);
      const encounter = Object.values(admitted.encounters)[0];
      if (encounter && TWENTY_CONCEPT_BATCH_CASES.some((item) => item.id === encounter.frozenCase.id)) state = admitted;
    }
    expect(state).toBeDefined();
    const encounterId = Object.keys(state!.encounters)[0]!;
    const encounter = state!.encounters[encounterId]!;
    const demographics = encounter.frozenCase.prototypeDemographics!;
    expect(encounter.frozenCase.patientDisplayName).toBe(encounter.patientDisplayName);
    expect(encounter.frozenCase.presentation).toContain(encounter.patientDisplayName);
    expect(encounter.frozenCase.presentation).not.toContain("{patientName}");
    expect(encounter.patientAppearance).toEqual(createPatientPixelAppearance(state!.campaignSeed, encounterId, demographics));
    expect(encounter.frozenCase.selectedInstantiationProfileId).toBeTruthy();
  });

  it("honors literal manual names and preserves the frozen name through serialization", () => {
    const encounterId = "encounter.batch.manual-name";
    const name = "Taylor $& {patientName}";
    const state = gameReducer(emptyState("manual-name", 1), {
      type: "ADMIT_PATIENT",
      operationId: "batch.manual-name.admit",
      encounterId,
      caseId: "case.gallstones.incidental-checkup",
      patientDisplayName: name,
      arrivalClass: "routine",
    });
    expect(state.encounters[encounterId]!.frozenCase.presentation).toContain(name);
    const restored = deserializeGameState(serializeGameState(state));
    expect(restored.encounters[encounterId]!.patientDisplayName).toBe(name);
    expect(restored.encounters[encounterId]!.frozenCase).toEqual(state.encounters[encounterId]!.frozenCase);
  });

  it("requires both celiac services before later questions and records three FSRS concept reviews", () => {
    const encounterId = "encounter.batch.celiac";
    let state = gameReducer(emptyState("celiac-flow", 2), {
      type: "ADMIT_PATIENT",
      operationId: "batch.celiac.admit",
      encounterId,
      caseId: "case.celiac.chronic-diarrhea",
      patientDisplayName: "Celiac Flow Patient",
      arrivalClass: "routine",
    });
    state = ready(state, encounterId, "celiac.first");
    expect(getCurrentQuestion(state, encounterId)!.node.primaryConceptId).toBe("concept.celiac.initial-serology");
    state = answer(state, encounterId, false, "celiac.first", 1_000);
    expect(state.encounters[encounterId]!.steps[0]!.answer?.correctedForward).toBe(true);
    state = acknowledge(state, encounterId, "celiac.first");
    expect(getCurrentQuestion(state, encounterId)).toBeNull();
    expect(state.encounters[encounterId]!.deliveredResultNarratives).toEqual([]);
    expect(state.encounters[encounterId]!.pendingResult).toMatchObject({ resultTypeId: "service.basic_labs", routeId: "route.basic_labs.outsourced" });
    state = deserializeGameState(serializeGameState(state));
    state = advanceToNextNode(state, encounterId, "celiac.first.wait");
    expect(state.encounters[encounterId]!.deliveredResultNarratives).toHaveLength(1);
    expect(state.encounters[encounterId]!.frozenCase.decisionNodes[1]!.currentUpdate).toBe(state.encounters[encounterId]!.deliveredResultNarratives[0]);
    state = ready(state, encounterId, "celiac.second");
    expect(getCurrentQuestion(state, encounterId)!.node.primaryConceptId).toBe("concept.celiac.duodenal-biopsy-confirmation");
    state = answer(state, encounterId, true, "celiac.second", 2_000);
    state = acknowledge(state, encounterId, "celiac.second");
    expect(state.encounters[encounterId]!.pendingResult).toMatchObject({ resultTypeId: "service.upper_endoscopy_duodenal_biopsy", routeId: "route.upper_endoscopy_duodenal_biopsy.outsourced" });
    expect(getCurrentQuestion(state, encounterId)).toBeNull();
    state = advanceToNextNode(state, encounterId, "celiac.second.wait");
    state = ready(state, encounterId, "celiac.third");
    expect(getCurrentQuestion(state, encounterId)!.node.primaryConceptId).toBe("concept.celiac.gluten-free-treatment");
    state = answer(state, encounterId, true, "celiac.third", 3_000);
    for (const conceptId of [
      "concept.celiac.initial-serology",
      "concept.celiac.duodenal-biopsy-confirmation",
      "concept.celiac.gluten-free-treatment",
    ]) {
      expect(state.learningHistories[conceptId]?.conceptId).toBe(conceptId);
      expect(state.learningHistories[conceptId]?.reviews).toHaveLength(1);
      expect(state.learningHistories[conceptId]?.reviews[0]?.primaryConceptId).toBe(conceptId);
    }
    expect(state.encounters[encounterId]!.deliveredResultNarratives).toHaveLength(2);
  });

  it.each([
    ["case.colorectal.routine-screen", "service.colonoscopy", "concept.colorectal.histologic-confirmation"],
    ["case.soft-tissue-mass.deep-thigh", "service.extremity_mri", "concept.soft-tissue-mass.specialist-planned-biopsy"],
  ])("completes the external gate for %s before exposing the next concept", (caseId, serviceId, nextConceptId) => {
    const encounterId = `encounter.${serviceId}`;
    let state = gameReducer(emptyState(`flow-${serviceId}`, 1), {
      type: "ADMIT_PATIENT", operationId: `flow.admit.${serviceId}`, encounterId, caseId,
      patientDisplayName: "External Flow Patient", arrivalClass: "routine",
    });
    state = ready(state, encounterId, `flow.ready.${serviceId}`);
    state = answer(state, encounterId, true, `flow.answer.${serviceId}`, 4_000);
    state = acknowledge(state, encounterId, `flow.ack.${serviceId}`);
    expect(state.encounters[encounterId]!.pendingResult?.resultTypeId).toBe(serviceId);
    expect(getCurrentQuestion(state, encounterId)).toBeNull();
    state = advanceToNextNode(state, encounterId, `flow.wait.${serviceId}`);
    state = ready(state, encounterId, `flow.next.${serviceId}`);
    expect(getCurrentQuestion(state, encounterId)!.node.primaryConceptId).toBe(nextConceptId);
  });
});
