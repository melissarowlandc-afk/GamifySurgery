import type { SyntheticClinicalCase } from "@gamify-surgery/clinical-content";
import {
  GS028_STATS_ETHICS_20260929_CASES,
  GS028_STATS_ETHICS_20260929_TESTED_CONCEPTS,
} from "@gamify-surgery/clinical-content";
import { describe, expect, it } from "vitest";
import {
  PROTOTYPE_DOMAIN_CONTEXT,
  createInitialGameState,
  gameReducer,
  getCurrentEmployeeDiscussionQuestion,
  getCurrentQuestion,
  type GameState,
} from "../src";

const REVIEWED_AT_MS = 1_800_000_000_000;
const ordinaryCases = GS028_STATS_ETHICS_20260929_CASES.filter(
  (clinicalCase) => clinicalCase.participant?.kind !== "employee_discussion",
);
const employeeCases = GS028_STATS_ETHICS_20260929_CASES.filter(
  (clinicalCase) => clinicalCase.participant?.kind === "employee_discussion",
);

function ordinaryFixture(seed: string): GameState {
  const state = createInitialGameState(undefined, {
    campaignId: `campaign.gs028se.${seed}`,
    campaignSeed: seed,
    createdAtRealMs: REVIEWED_AT_MS,
  });
  state.facilityLevel = 0;
  state.encounters = {};
  state.openChartEncounterId = null;
  state.attendedEncounterId = null;
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  state.rooms.push({
    id: "room.gs028se.examination",
    roomDefinitionId: "room.examination",
    x: 34,
    y: 26,
    orientation: 0,
    doorSide: "south",
    upgradeLevel: 1,
    cleanliness: 100,
  });
  state.doors.push({
    id: "door.gs028se.examination",
    roomId: "room.gs028se.examination",
    side: "south",
    offset: 1,
    exterior: false,
  });
  return state;
}

function readyForPatientQuestion(
  state: GameState,
  encounterId: string,
  prefix: string,
): GameState {
  let next = state;
  for (let attempt = 0; attempt < 1_500; attempt += 1) {
    if (getCurrentQuestion(next, encounterId)) return next;
    const encounter = next.encounters[encounterId];
    if (!encounter) throw new Error(`${encounterId} disappeared before it was ready.`);
    next = encounter.lifecycle === "waiting_unopened" && encounter.patientMovement === null
      ? gameReducer(next, { type: "OPEN_CHART", operationId: `${prefix}.open.${attempt}`, encounterId })
      : gameReducer(next, { type: "ADVANCE_TICK", operationId: `${prefix}.tick.${attempt}`, advancedAtRealMs: REVIEWED_AT_MS });
  }
  throw new Error(`${encounterId} did not become answer-ready.`);
}

function runOrdinaryCase(
  clinicalCase: SyntheticClinicalCase,
  correct: boolean,
  index: number,
): GameState {
  const prefix = `gs028se.${correct ? "correct" : "wrong"}.${index}`;
  const encounterId = `encounter.${prefix}`;
  let state = gameReducer(
    ordinaryFixture(prefix),
    {
      type: "ADMIT_PATIENT",
      operationId: `${prefix}.admit`,
      encounterId,
      caseId: clinicalCase.id,
      patientDisplayName: `Statistics Patient ${index}`,
      arrivalClass: "routine",
    },
  );
  expect(state.operationReceipts[`${prefix}.admit`]?.status).toBe("applied");
  state = readyForPatientQuestion(state, encounterId, prefix);
  for (const [nodeIndex, authoredNode] of clinicalCase.decisionNodes.entries()) {
    const question = getCurrentQuestion(state, encounterId)!;
    expect(question.node.id).toBe(authoredNode.id);
    const choice = question.node.answerChoices.find((item) => item.isCorrect === correct)!;
    state = gameReducer(state, {
      type: "SUBMIT_ANSWER",
      operationId: `${prefix}.answer.${nodeIndex}`,
      encounterId,
      decisionNodeId: question.node.id,
      answerChoiceId: choice.id,
      reviewedAtMs: REVIEWED_AT_MS + index,
    });
    expect(state.operationReceipts[`${prefix}.answer.${nodeIndex}`]?.status).toBe("applied");
    expect(state.learningHistories[question.node.primaryConceptId]?.reviews).toHaveLength(1);
    const nonfinal = nodeIndex < clinicalCase.decisionNodes.length - 1;
    expect(state.encounters[encounterId]?.steps[nodeIndex]?.answer).toMatchObject({
      correct,
      correctedForward: !correct && nonfinal,
      ratingIntent: correct ? "Good" : "Again",
    });
    if (nonfinal) {
      state = gameReducer(state, {
        type: "ACKNOWLEDGE_DECISION_FEEDBACK",
        operationId: `${prefix}.continue.${nodeIndex}`,
        encounterId,
        decisionNodeId: question.node.id,
      });
      expect(state.operationReceipts[`${prefix}.continue.${nodeIndex}`]?.status).toBe("applied");
      expect(state.encounters[encounterId]?.currentNodeIndex).toBe(nodeIndex + 1);
    }
  }
  state = gameReducer(state, {
    type: "ACKNOWLEDGE_TERMINAL_FEEDBACK",
    operationId: `${prefix}.acknowledge`,
    encounterId,
  });
  expect(state.operationReceipts[`${prefix}.acknowledge`]?.status).toBe("applied");
  expect(state.encounters[encounterId]?.lifecycle).toBe("resolved_summary_available");
  state = gameReducer(state, {
    type: "CLOSE_CHART",
    operationId: `${prefix}.close`,
    encounterId,
  });
  expect(state.operationReceipts[`${prefix}.close`]?.status).toBe("applied");
  expect(state.encounters[encounterId]?.lifecycle).toBe("resolved");
  for (const node of clinicalCase.decisionNodes) {
    expect(state.learningHistories[node.primaryConceptId]?.reviews).toHaveLength(1);
  }
  return state;
}

function addReachableNp(state: GameState): void {
  state.rooms.push(
    {
      id: "room.gs028se.glp",
      roomDefinitionId: "room.glp1_telehealth_suite",
      x: 29,
      y: 29,
      orientation: 0,
      doorSide: null,
      upgradeLevel: 1,
      cleanliness: 100,
    },
    ...[24, 25, 26, 27, 28, 29, 30].map((y) => ({
      id: `room.gs028se.hall.${y}`,
      roomDefinitionId: "room.hallway",
      x: 32,
      y,
      orientation: 0 as const,
      doorSide: null,
      upgradeLevel: 1 as const,
      cleanliness: 100,
    })),
  );
  state.doors.push(
    { id: "door.gs028se.front", roomId: "room.instance.founder_desk", side: "west", offset: 0, exterior: false },
    { id: "door.gs028se.glp", roomId: "room.gs028se.glp", side: "east", offset: 1, exterior: false },
  );
  state.employees.push({
    id: "employee.gs028se.np",
    staffRoleDefinitionId: "staff.glp1_np",
    displayName: "Dana Rivera",
    appearance: state.founder.appearance,
    hiredAtFacilityTick: 0,
    salaryPerExpenseInterval: 0,
    morale: 100,
    trainingLevel: 1,
    homeRoomInstanceId: "room.gs028se.glp",
    location: { x: 31, y: 30 },
    path: [],
    pathIndex: 0,
    lastMovedAtFacilityTick: 0,
    lastPraisedAtFacilityTick: null,
    nextIdleActionAtFacilityTick: Number.MAX_SAFE_INTEGER,
    facilityTask: null,
  });
}

describe("GS-028 statistics and ethics runtime admission", () => {
  it("admits the 28 objectives and 112 nodes in 108 cases into the active release exactly once", () => {
    expect(GS028_STATS_ETHICS_20260929_TESTED_CONCEPTS).toHaveLength(28);
    expect(GS028_STATS_ETHICS_20260929_CASES).toHaveLength(108);
    expect(GS028_STATS_ETHICS_20260929_CASES.flatMap((item) => item.decisionNodes)).toHaveLength(112);
    expect(PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.concepts.filter(c => !c.id.startsWith("concept.gs028g."))).toHaveLength(331);
    expect(PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.filter(c => !c.id.startsWith("case.gs028g."))).toHaveLength(1008);
    expect(PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.filter(c => !c.id.startsWith("case.gs028g.")).flatMap((item) => item.decisionNodes)).toHaveLength(1295);
    for (const concept of GS028_STATS_ETHICS_20260929_TESTED_CONCEPTS) {
      expect(PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.concepts.filter((item) => item.id === concept.id)).toHaveLength(1);
    }
    for (const clinicalCase of GS028_STATS_ETHICS_20260929_CASES) {
      expect(PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.filter((item) => item.id === clinicalCase.id)).toHaveLength(1);
    }
  });

  it.each(ordinaryCases.map((clinicalCase, index) => [clinicalCase, index] as const))(
    "scores ordinary case %s correctly and incorrectly exactly once",
    (clinicalCase, index) => {
    expect(clinicalCase.participant).toBeUndefined();
    expect(runOrdinaryCase(clinicalCase, true, index).encounters[`encounter.gs028se.correct.${index}`]).toBeDefined();
    expect(runOrdinaryCase(clinicalCase, false, index).encounters[`encounter.gs028se.wrong.${index}`]).toBeDefined();
    },
  );

  it("schedules a real NP discussion without creating a patient encounter or economics", () => {
    expect(employeeCases).toHaveLength(60);
    let state = ordinaryFixture("employee");
    state.facilityLevel = 2;
    state.nextEmployeeDiscussionTick = 1;
    state.nextFinancialPostingTick = Number.MAX_SAFE_INTEGER;
    addReachableNp(state);
    const cashBefore = state.cashCents;
    const settlementsBefore = state.settlements.length;
    const incomeBefore = state.serviceIncomeReceipts.length;
    state = gameReducer(state, { type: "ADVANCE_TICK", operationId: "gs028se.employee.schedule", advancedAtRealMs: REVIEWED_AT_MS });
    const discussion = Object.values(state.employeeDiscussions ?? {})[0]!;
    expect(discussion).toBeDefined();
    expect(employeeCases.some((clinicalCase) => clinicalCase.id === discussion.frozenCase.id)).toBe(true);
    expect(Object.keys(state.encounters)).toEqual([]);
    state = gameReducer(state, { type: "OPEN_EMPLOYEE_DISCUSSION", operationId: "gs028se.employee.open", discussionId: discussion.id });
    for (let attempt = 0; attempt < 30 && !getCurrentEmployeeDiscussionQuestion(state, discussion.id, PROTOTYPE_DOMAIN_CONTEXT); attempt += 1) {
      state = gameReducer(state, { type: "ADVANCE_TICK", operationId: `gs028se.employee.travel.${attempt}`, advancedAtRealMs: REVIEWED_AT_MS });
    }
    const question = getCurrentEmployeeDiscussionQuestion(state, discussion.id, PROTOTYPE_DOMAIN_CONTEXT)!;
    const correct = question.node.answerChoices.find((choice) => choice.isCorrect)!;
    state = gameReducer(state, {
      type: "SUBMIT_EMPLOYEE_DISCUSSION_ANSWER",
      operationId: "gs028se.employee.answer",
      discussionId: discussion.id,
      decisionNodeId: question.node.id,
      answerChoiceId: correct.id,
      reviewedAtMs: REVIEWED_AT_MS,
    });
    expect(state.learningHistories[question.node.primaryConceptId]?.reviews).toHaveLength(1);
    expect(state.cashCents).toBe(cashBefore);
    expect(state.settlements).toHaveLength(settlementsBefore);
    expect(state.serviceIncomeReceipts).toHaveLength(incomeBefore);
    expect(Object.keys(state.encounters)).toEqual([]);
  });
});
