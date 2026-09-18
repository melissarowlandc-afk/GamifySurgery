import { BREAD_BUTTER_20260917_CASES } from "@gamify-surgery/clinical-content";
import { describe, expect, it } from "vitest";
import {
  createInitialGameState,
  deserializeGameState,
  gameReducer,
  getCurrentQuestion,
  getEligibleServiceRoute,
  serializeGameState,
  type GameState,
} from "../src";

type BreadButterCase = (typeof BREAD_BUTTER_20260917_CASES)[number];

function prepared(seed: string, level: 0 | 1 | 2): GameState {
  const state = createInitialGameState(undefined, {
    campaignId: `campaign.bread-butter-sept17.${seed}`,
    campaignSeed: seed,
    createdAtRealMs: 0,
  });
  state.facilityLevel = level;
  state.encounters = {};
  state.openChartEncounterId = null;
  state.attendedEncounterId = null;
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  state.rooms.push({
    id: "room.bread-butter-sept17.examination",
    roomDefinitionId: "room.examination",
    x: 34,
    y: 26,
    orientation: 0,
    doorSide: "south",
    upgradeLevel: 1,
    cleanliness: 100,
  });
  state.doors.push({
    id: "door.bread-butter-sept17.examination",
    roomId: "room.bread-butter-sept17.examination",
    side: "south",
    offset: 1,
    exterior: false,
  });
  state.rooms.push({
    id: "room.bread-butter-sept17.minor-procedure",
    roomDefinitionId: "room.minor_procedure",
    x: 38,
    y: 26,
    orientation: 0,
    doorSide: "south",
    upgradeLevel: 1,
    cleanliness: 100,
  });
  state.doors.push({ id: "door.bread-butter-sept17.minor-procedure", roomId: "room.bread-butter-sept17.minor-procedure", side: "south", offset: 1, exterior: false });
  return state;
}

function stateWithoutExaminationCapability(seed: string): GameState {
  const state = createInitialGameState(undefined, {
    campaignId: `campaign.bread-butter-sept17.${seed}`,
    campaignSeed: seed,
    createdAtRealMs: 0,
  });
  state.rooms = state.rooms.filter(
    (room) => room.roomDefinitionId !== "room.examination",
  );
  state.doors = state.doors.filter((door) =>
    state.rooms.some((room) => room.id === door.roomId),
  );
  return state;
}

function admit(
  state: GameState,
  clinicalCase: BreadButterCase,
  encounterId: string,
  operationId: string,
): GameState {
  return gameReducer(state, {
    type: "ADMIT_PATIENT",
    operationId,
    encounterId,
    caseId: clinicalCase.id,
    patientDisplayName: `Bread Butter Patient ${encounterId}`,
    arrivalClass: "routine",
  });
}

function ready(
  state: GameState,
  encounterId: string,
  operationPrefix: string,
): GameState {
  let next = state;
  for (let attempt = 0; attempt < 1_500; attempt += 1) {
    if (getCurrentQuestion(next, encounterId)) {
      return next;
    }
    const encounter = next.encounters[encounterId];
    if (!encounter) {
      throw new Error(`${encounterId} disappeared before becoming ready`);
    }
    next =
      encounter.lifecycle === "waiting_unopened" &&
      encounter.patientMovement === null
        ? gameReducer(next, {
            type: "OPEN_CHART",
            operationId: `${operationPrefix}.open.${attempt}`,
            encounterId,
          })
        : gameReducer(next, {
            type: "ADVANCE_TICK",
            operationId: `${operationPrefix}.tick.${attempt}`,
          });
  }
  throw new Error(`${encounterId} did not become ready`);
}

function stationaryAtCare(
  state: GameState,
  encounterId: string,
  operationPrefix: string,
): GameState {
  let next = state;
  for (let attempt = 0; attempt < 1_500; attempt += 1) {
    const encounter = next.encounters[encounterId];
    if (
      getCurrentQuestion(next, encounterId) &&
      encounter?.patientMovement === null &&
      encounter.assignedRoomInstanceId !== null
    ) {
      return next;
    }
    next = gameReducer(next, {
      type: "ADVANCE_TICK",
      operationId: `${operationPrefix}.tick.${attempt}`,
    });
  }
  throw new Error(`${encounterId} did not become stationary at care`);
}

function submit(
  state: GameState,
  encounterId: string,
  correct: boolean,
  operationId: string,
  reviewedAtMs: number,
): GameState {
  const question = getCurrentQuestion(state, encounterId);
  if (!question) {
    throw new Error(`${encounterId} has no current question`);
  }
  const choice = question.node.answerChoices.find(
    (candidate) => candidate.isCorrect === correct,
  );
  if (!choice) {
    throw new Error(
      `${question.node.id} has no ${correct ? "correct" : "incorrect"} choice`,
    );
  }
  return gameReducer(state, {
    type: "SUBMIT_ANSWER",
    operationId,
    encounterId,
    decisionNodeId: question.node.id,
    answerChoiceId: choice.id,
    reviewedAtMs,
  });
}

function acknowledge(
  state: GameState,
  encounterId: string,
  operationId: string,
): GameState {
  const encounter = state.encounters[encounterId];
  const step = encounter?.steps[encounter.currentNodeIndex];
  if (!step) {
    throw new Error(`${encounterId} has no feedback to acknowledge`);
  }
  return gameReducer(state, {
    type: "ACKNOWLEDGE_DECISION_FEEDBACK",
    operationId,
    encounterId,
    decisionNodeId: step.decisionNodeId,
  });
}

function advanceUntilResult(
  state: GameState,
  encounterId: string,
  operationPrefix: string,
): GameState {
  let next = state;
  const pending = next.encounters[encounterId]?.pendingResult;
  if (!pending) {
    throw new Error(`${encounterId} did not schedule a result`);
  }
  while (next.facilityTick < pending.dueTick) {
    expect(getCurrentQuestion(next, encounterId)).toBeNull();
    expect(next.encounters[encounterId]?.deliveredResultNarratives).toEqual([]);
    next = gameReducer(next, {
      type: "ADVANCE_TICK",
      operationId: `${operationPrefix}.${next.facilityTick}`,
    });
  }
  return next;
}

const singleCases = BREAD_BUTTER_20260917_CASES.filter(
  (clinicalCase) => clinicalCase.decisionNodes.length === 1,
);
const gatedCases = BREAD_BUTTER_20260917_CASES.filter(
  (clinicalCase) =>
    clinicalCase.decisionNodes.length === 2 &&
    clinicalCase.decisionNodes[0]?.resultGateAfter !== null,
);
const nongatedCases = BREAD_BUTTER_20260917_CASES.filter(
  (clinicalCase) =>
    clinicalCase.decisionNodes.length === 2 &&
    clinicalCase.decisionNodes[0]?.resultGateAfter === null,
);

describe("September 17 bread-and-butter production flows", () => {
  it("contains the authored case, node, and pathway mix", () => {
    expect(BREAD_BUTTER_20260917_CASES).toHaveLength(52);
    expect(
      BREAD_BUTTER_20260917_CASES.flatMap(
        (clinicalCase) => clinicalCase.decisionNodes,
      ),
    ).toHaveLength(80);
    expect(singleCases).toHaveLength(24);
    expect(gatedCases).toHaveLength(16);
    expect(nongatedCases).toHaveLength(12);
  });

  it.each(
    BREAD_BUTTER_20260917_CASES.map(
      (clinicalCase, index) => [index, clinicalCase] as const,
    ),
  )(
    "runs case %s through every authored node with one FSRS review per node",
    (index, clinicalCase) => {
      const encounterId = `encounter.bread-butter-sept17.${index}`;
      const prefix = `bread-butter-sept17.${index}`;
      let state = prepared(`all-${index}`, clinicalCase.earliestFacilityStage);
      state = admit(
        state,
        clinicalCase,
        encounterId,
        `${prefix}.admit`,
      );
      expect(state.operationReceipts[`${prefix}.admit`]?.status).toBe("applied");

      for (
        let nodeIndex = 0;
        nodeIndex < clinicalCase.decisionNodes.length;
        nodeIndex += 1
      ) {
        state = ready(state, encounterId, `${prefix}.node-${nodeIndex}.ready`);
        const question = getCurrentQuestion(state, encounterId);
        const authoredNode = clinicalCase.decisionNodes[nodeIndex];
        expect(question?.node.id).toBe(authoredNode?.id);
        if (!question || !authoredNode) {
          throw new Error(`${clinicalCase.id} is missing node ${nodeIndex}`);
        }

        state = submit(
          state,
          encounterId,
          true,
          `${prefix}.node-${nodeIndex}.answer`,
          index * 100 + nodeIndex + 1,
        );
        expect(
          state.learningHistories[question.node.primaryConceptId]?.reviews,
        ).toHaveLength(1);

        const isFinal = nodeIndex === clinicalCase.decisionNodes.length - 1;
        if (isFinal) {
          expect(state.encounters[encounterId]).toMatchObject({
            lifecycle: "resolved_summary_available",
            resolutionReason: "completed",
          });
          continue;
        }

        const gate = authoredNode.resultGateAfter;
        if (gate) {
          expect(state.encounters[encounterId]?.pendingResult).toMatchObject({
            resultTypeId: gate.resultTypeId,
            deliveredAtTick: null,
          });
          expect(getCurrentQuestion(state, encounterId)).toBeNull();
          state = acknowledge(
            state,
            encounterId,
            `${prefix}.node-${nodeIndex}.acknowledge`,
          );
          state = advanceUntilResult(
            state,
            encounterId,
            `${prefix}.node-${nodeIndex}.wait`,
          );
          expect(
            state.encounters[encounterId]?.deliveredResultNarratives,
          ).toContain(gate.resultNarrative);
        } else {
          expect(state.encounters[encounterId]?.pendingResult).toBeNull();
          state = acknowledge(
            state,
            encounterId,
            `${prefix}.node-${nodeIndex}.acknowledge`,
          );
          expect(state.encounters[encounterId]?.pendingResult).toBeNull();
          expect(
            state.encounters[encounterId]?.deliveredResultNarratives,
          ).toEqual([]);
        }
      }

      for (const node of clinicalCase.decisionNodes) {
        expect(
          state.learningHistories[node.primaryConceptId]?.reviews,
        ).toHaveLength(1);
      }
    },
  );

  it.each(
    nongatedCases.map((clinicalCase, index) => [index, clinicalCase] as const),
  )(
    "keeps nongated two-step case %s synchronous after a corrected-forward answer",
    (index, clinicalCase) => {
      const encounterId = `encounter.bread-butter-sept17.nongated.${index}`;
      const prefix = `bread-butter-sept17.nongated.${index}`;
      let state = admit(
        prepared(`nongated-${index}`, clinicalCase.earliestFacilityStage),
        clinicalCase,
        encounterId,
        `${prefix}.admit`,
      );
      state = ready(state, encounterId, `${prefix}.first.ready`);
      const first = getCurrentQuestion(state, encounterId);
      if (!first) {
        throw new Error(`${clinicalCase.id} did not expose its first question`);
      }
      state = submit(
        state,
        encounterId,
        false,
        `${prefix}.first.wrong`,
        index + 1,
      );
      expect(state.encounters[encounterId]?.steps[0]?.answer).toMatchObject({
        correct: false,
        correctedForward: true,
        ratingIntent: "Again",
      });
      expect(state.encounters[encounterId]?.pendingResult).toBeNull();

      state = acknowledge(state, encounterId, `${prefix}.first.acknowledge`);
      expect(state.encounters[encounterId]?.pendingResult).toBeNull();
      expect(state.encounters[encounterId]?.deliveredResultNarratives).toEqual(
        [],
      );
      state = ready(state, encounterId, `${prefix}.second.ready`);
      expect(getCurrentQuestion(state, encounterId)?.node.id).toBe(
        clinicalCase.decisionNodes[1]?.id,
      );
      state = submit(
        state,
        encounterId,
        true,
        `${prefix}.second.correct`,
        index + 10_000,
      );
      expect(state.encounters[encounterId]).toMatchObject({
        lifecycle: "resolved_summary_available",
        resolutionReason: "completed",
        pendingResult: null,
      });
      expect(
        state.learningHistories[first.node.primaryConceptId]?.reviews,
      ).toHaveLength(1);
    },
  );

  it("rejects a case before its authored facility stage", () => {
    const clinicalCase = BREAD_BUTTER_20260917_CASES.find(
      (candidate) => candidate.earliestFacilityStage === 2,
    );
    if (!clinicalCase) {
      throw new Error("Expected at least one Level 2 bread-and-butter case");
    }
    const operationId = "bread-butter-sept17.stage.reject";
    const encounterId = "encounter.bread-butter-sept17.stage";
    const state = admit(
      prepared("stage-rejection", 1),
      clinicalCase,
      encounterId,
      operationId,
    );
    expect(state.operationReceipts[operationId]).toMatchObject({
      status: "rejected",
    });
    expect(state.encounters[encounterId]).toBeUndefined();
  });

  it("preserves a corrected-forward gated encounter and idempotency across reload", () => {
    const clinicalCase = gatedCases[0];
    if (!clinicalCase) {
      throw new Error("Expected at least one gated bread-and-butter case");
    }
    const encounterId = "encounter.bread-butter-sept17.persist";
    let state = admit(
      prepared("corrected-forward-persistence", clinicalCase.earliestFacilityStage),
      clinicalCase,
      encounterId,
      "bread-butter-sept17.persist.admit",
    );
    state = ready(state, encounterId, "bread-butter-sept17.persist.first");

    const first = getCurrentQuestion(state, encounterId);
    if (!first) {
      throw new Error("Expected the first persisted question");
    }
    const patientName = state.encounters[encounterId]?.patientDisplayName;
    const choiceOrder = first.node.answerChoices.map((choice) => choice.id);
    const wrongOperationId = "bread-butter-sept17.persist.wrong-answer";
    const wrongChoice = first.node.answerChoices.find(
      (choice) => !choice.isCorrect,
    );
    if (!wrongChoice) {
      throw new Error("Expected an incorrect first-node choice");
    }
    const wrongCommand = {
      type: "SUBMIT_ANSWER" as const,
      operationId: wrongOperationId,
      encounterId,
      decisionNodeId: first.node.id,
      answerChoiceId: wrongChoice.id,
      reviewedAtMs: 99,
    };
    state = gameReducer(state, wrongCommand);
    const afterWrong = serializeGameState(state);
    state = gameReducer(state, wrongCommand);
    expect(serializeGameState(state)).toBe(afterWrong);
    expect(state.encounters[encounterId]?.steps[0]?.answer).toMatchObject({
      correct: false,
      correctedForward: true,
      ratingIntent: "Again",
    });
    expect(
      state.learningHistories[first.node.primaryConceptId]?.reviews,
    ).toHaveLength(1);
    expect(state.encounters[encounterId]?.pendingResult).not.toBeNull();

    const acknowledgementId = "bread-butter-sept17.persist.acknowledge";
    state = acknowledge(state, encounterId, acknowledgementId);
    const afterAcknowledgement = serializeGameState(state);
    state = acknowledge(state, encounterId, acknowledgementId);
    expect(serializeGameState(state)).toBe(afterAcknowledgement);
    const pending = state.encounters[encounterId]?.pendingResult;
    if (!pending) {
      throw new Error("Expected the gated answer to retain a pending result");
    }

    let restored = deserializeGameState(serializeGameState(state));
    expect(restored.encounters[encounterId]?.pendingResult).toEqual(pending);
    expect(restored.encounters[encounterId]?.pendingResult?.dueTick).toBe(
      pending.dueTick,
    );
    expect(restored.encounters[encounterId]?.patientDisplayName).toBe(
      patientName,
    );
    expect(restored.encounters[encounterId]?.frozenCase).toEqual(
      state.encounters[encounterId]?.frozenCase,
    );
    expect(
      restored.encounters[
        encounterId
      ]?.frozenCase.decisionNodes[0]?.answerChoices.map((choice) => choice.id),
    ).toEqual(choiceOrder);
    expect(
      restored.learningHistories[first.node.primaryConceptId]?.reviews,
    ).toHaveLength(1);

    restored = advanceUntilResult(
      restored,
      encounterId,
      "bread-butter-sept17.persist.wait",
    );
    restored = ready(
      restored,
      encounterId,
      "bread-butter-sept17.persist.second",
    );
    const second = getCurrentQuestion(restored, encounterId);
    if (!second) {
      throw new Error("Expected the second persisted question");
    }
    const terminalOperationId =
      "bread-butter-sept17.persist.second.wrong-answer";
    const terminalWrongChoice = second.node.answerChoices.find(
      (choice) => !choice.isCorrect,
    );
    if (!terminalWrongChoice) {
      throw new Error("Expected an incorrect terminal-node choice");
    }
    const terminalWrongCommand = {
      type: "SUBMIT_ANSWER" as const,
      operationId: terminalOperationId,
      encounterId,
      decisionNodeId: second.node.id,
      answerChoiceId: terminalWrongChoice.id,
      reviewedAtMs: 10_099,
    };
    restored = gameReducer(restored, terminalWrongCommand);
    const afterTerminal = serializeGameState(restored);
    restored = gameReducer(restored, terminalWrongCommand);
    expect(serializeGameState(restored)).toBe(afterTerminal);
    expect(restored.encounters[encounterId]).toMatchObject({
      lifecycle: "resolved_summary_available",
      resolutionReason: "completed",
    });
    expect(restored.encounters[encounterId]?.steps[1]?.answer).toMatchObject({
      correct: false,
      correctedForward: false,
      ratingIntent: "Again",
    });
    expect(
      restored.learningHistories[first.node.primaryConceptId]?.reviews,
    ).toHaveLength(1);
    expect(
      restored.learningHistories[second.node.primaryConceptId]?.reviews,
    ).toHaveLength(1);
  });

  it.each(
    BREAD_BUTTER_20260917_CASES.filter((clinicalCase) =>
      clinicalCase.id.startsWith(
        "case.bread-butter.postoperative-retention.",
      ),
    ).map((clinicalCase, index) => [index, clinicalCase] as const),
  )(
    "schedules retention case %s as a five-tick bedside scan without travel",
    (index, clinicalCase) => {
      const encounterId = `encounter.bread-butter-sept17.retention.${index}`;
      const prefix = `bread-butter-sept17.retention.${index}`;
      let state = admit(
        prepared(`retention-${index}`, clinicalCase.earliestFacilityStage),
        clinicalCase,
        encounterId,
        `${prefix}.admit`,
      );
      state = ready(state, encounterId, `${prefix}.ready`);
      state = stationaryAtCare(state, encounterId, `${prefix}.at-care`);
      const locationBeforeScan = state.encounters[encounterId]?.patientLocation;
      const roomBeforeScan =
        state.encounters[encounterId]?.assignedRoomInstanceId;
      state = submit(
        state,
        encounterId,
        true,
        `${prefix}.answer`,
        index + 1,
      );
      const pending = state.encounters[encounterId]?.pendingResult;
      expect(pending).toMatchObject({
        resultTypeId: "service.bladder_scan",
        routeId: "route.bladder_scan.in_house",
        serviceDurationTicks: 5,
        durationTicks: 5,
        deliveredAtTick: null,
        offsiteTravel: null,
        patientTravel: null,
        patientRemainsOnsite: true,
      });
      expect(pending!.dueTick - pending!.scheduledAtTick).toBe(5);
      expect(pending?.resourceReservations ?? []).toEqual([]);
      expect(pending?.imagingTechnicianId ?? null).toBeNull();
      expect(pending?.providerReservation ?? null).toBeNull();

      state = acknowledge(state, encounterId, `${prefix}.acknowledge`);
      expect(state.encounters[encounterId]?.pendingResult).toMatchObject({
        offsiteTravel: null,
        patientTravel: null,
        patientRemainsOnsite: true,
      });
      expect(state.encounters[encounterId]?.patientMovement).toBeNull();
      expect(state.encounters[encounterId]?.patientLocation).toEqual(
        locationBeforeScan,
      );
      expect(state.encounters[encounterId]?.assignedRoomInstanceId).toBe(
        roomBeforeScan,
      );
      state = deserializeGameState(serializeGameState(state));
      expect(state.encounters[encounterId]?.pendingResult).toMatchObject({
        dueTick: pending?.dueTick,
        offsiteTravel: null,
        patientTravel: null,
        patientRemainsOnsite: true,
      });
      state = advanceUntilResult(state, encounterId, `${prefix}.wait`);
      expect(state.encounters[encounterId]?.patientMovement).toBeNull();
      expect(state.encounters[encounterId]?.patientLocation).toEqual(
        locationBeforeScan,
      );
      expect(state.encounters[encounterId]?.assignedRoomInstanceId).toBe(
        roomBeforeScan,
      );
      expect(
        state.encounters[encounterId]?.pendingResult?.deliveredAtTick,
      ).toBe(pending?.dueTick);
    },
  );

  it("requires examination capability for the bedside bladder-scan route", () => {
    expect(
      getEligibleServiceRoute(
        stateWithoutExaminationCapability("bladder-scan-no-exam"),
        "service.bladder_scan",
        ["route.bladder_scan.in_house"],
      ),
    ).toBeNull();

    const eligible = getEligibleServiceRoute(
      prepared("bladder-scan-with-exam", 0),
      "service.bladder_scan",
      ["route.bladder_scan.in_house"],
    );
    expect(eligible?.route).toMatchObject({
      id: "route.bladder_scan.in_house",
      durationTicks: 5,
      requiredCapabilityId: "capability.examination",
      requiredCapabilityIds: [],
    });
  });
});
