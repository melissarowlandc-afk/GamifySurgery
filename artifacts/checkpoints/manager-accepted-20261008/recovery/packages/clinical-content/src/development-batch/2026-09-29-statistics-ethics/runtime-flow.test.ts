import { describe, expect, it } from "vitest";
import {
  PROTOTYPE_DOMAIN_CONTEXT, createInitialGameState, deserializeGameState,
  gameReducer, getCurrentEmployeeDiscussionQuestion, getCurrentQuestion,
  materializePatientName, serializeGameState, type DomainContext, type GameState,
} from "../../../../game-domain/src";
import { ETHICS_FAMILIES } from "./ethics";
import { STATISTICS_DISCUSSION_HOST_ROLE_IDS, STATISTICS_QI_FAMILIES } from "./statistics-qi";
import type { SyntheticClinicalCase } from "../../schema";

const pairedCases = ETHICS_FAMILIES.flatMap((family) => family.cases).filter((clinicalCase) => clinicalCase.decisionNodes.length === 2);
const employeeCases = STATISTICS_QI_FAMILIES.flatMap((family) => family.cases).filter((clinicalCase) => clinicalCase.participant);

function fixture(clinicalCase: SyntheticClinicalCase) {
  const context: DomainContext = { ...PROTOTYPE_DOMAIN_CONTEXT, clinicalRelease: { ...PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease, cases: [...PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.filter((item) => item.tutorialEligible), clinicalCase] } };
  const state = createInitialGameState(undefined, { campaignSeed: "gs028-overhaul-flow", createdAtRealMs: 0 });
  state.encounters = {};
  state.openChartEncounterId = null;
  state.attendedEncounterId = null;
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  state.nextFinancialPostingTick = Number.MAX_SAFE_INTEGER;
  state.rooms.push({ id: "room.gs028.flow.exam", roomDefinitionId: "room.examination", x: 34, y: 26, orientation: 0, doorSide: "south", upgradeLevel: 1, cleanliness: 100 });
  state.doors.push({ id: "door.gs028.flow.exam", roomId: "room.gs028.flow.exam", side: "south", offset: 1, exterior: false });
  return { state, context };
}

function patientReady(state: GameState, context: DomainContext, prefix: string): GameState {
  let next = state;
  for (let attempt = 0; attempt < 1_500; attempt += 1) {
    if (getCurrentQuestion(next, "encounter.gs028.flow", context)) return next;
    const encounter = next.encounters["encounter.gs028.flow"]!;
    next = encounter.lifecycle === "waiting_unopened" && encounter.patientMovement === null
      ? gameReducer(next, { type: "OPEN_CHART", operationId: `${prefix}.open.${attempt}`, encounterId: encounter.id }, context)
      : gameReducer(next, { type: "ADVANCE_TICK", operationId: `${prefix}.tick.${attempt}` }, context);
  }
  throw new Error("Patient did not become answer-ready.");
}

function admit(clinicalCase: SyntheticClinicalCase) {
  const { state: initial, context } = fixture(clinicalCase);
  const state = gameReducer(initial, { type: "ADMIT_PATIENT", operationId: "flow.admit", encounterId: "encounter.gs028.flow", caseId: clinicalCase.id, patientDisplayName: "Maya Reed", arrivalClass: "routine" }, context);
  expect(state.operationReceipts["flow.admit"]?.status).toBe("applied");
  return { state, context };
}

describe("GS028 overhaul runtime and frozen-history regression", () => {
  it.each(pairedCases.flatMap((clinicalCase) => [true, false].map((correct) => [clinicalCase.id, correct, clinicalCase] as const)))(
    "completes both interpreted-consent nodes for %s, correct=%s", (_id, correct, clinicalCase) => {
      let { state, context } = admit(clinicalCase);
      state = patientReady(state, context, "pair.first");
      const frozenBefore = JSON.parse(JSON.stringify(state.encounters["encounter.gs028.flow"]!.frozenCase));
      for (let index = 0; index < 2; index += 1) {
        state = deserializeGameState(serializeGameState(state), context);
        expect(state.encounters["encounter.gs028.flow"]!.frozenCase).toEqual(frozenBefore);
        const question = getCurrentQuestion(state, "encounter.gs028.flow", context)!;
        expect(question.node.teachingPoint).toBeTruthy();
        expect(question.node.answerChoices.every((choice) => Boolean(choice.rationale))).toBe(true);
        if (index === 1) expect(question.node.currentUpdate).toContain("Maya Reed");
        const operationId = `pair.answer.${index}`;
        state = gameReducer(state, { type: "SUBMIT_ANSWER", operationId, encounterId: "encounter.gs028.flow", decisionNodeId: question.node.id, answerChoiceId: question.node.answerChoices.find((choice) => choice.isCorrect === correct)!.id, reviewedAtMs: index + 1 }, context);
        expect(state.operationReceipts[operationId]?.status).toBe("applied");
        expect(state.learningHistories[question.node.primaryConceptId]?.reviews).toHaveLength(1);
        expect(state.encounters["encounter.gs028.flow"]!.steps[index]!.answer?.correctedForward).toBe(index === 0 && !correct);
        if (index === 0) {
          state = gameReducer(state, { type: "ACKNOWLEDGE_DECISION_FEEDBACK", operationId: "pair.continue", encounterId: "encounter.gs028.flow", decisionNodeId: question.node.id }, context);
          expect(state.operationReceipts["pair.continue"]?.status).toBe("applied");
          state = patientReady(state, context, "pair.second");
        }
      }
      expect(state.encounters["encounter.gs028.flow"]!.lifecycle).toBe("resolved_summary_available");
      state = gameReducer(state, { type: "ACKNOWLEDGE_TERMINAL_FEEDBACK", operationId: "pair.final-feedback", encounterId: "encounter.gs028.flow" }, context);
      expect(state.operationReceipts["pair.final-feedback"]?.status).toBe("applied");
      state = gameReducer(state, { type: "CLOSE_CHART", operationId: "pair.close", encounterId: "encounter.gs028.flow" }, context);
      expect(state.encounters["encounter.gs028.flow"]!.lifecycle).toBe("resolved");
    },
  );

  it("keeps a removed single-step case frozen and playable without the optional fields", () => {
    let { state, context } = admit(pairedCases[0]!);
    state = patientReady(state, context, "legacy.first");
    const encounter = state.encounters["encounter.gs028.flow"]!;
    const first = encounter.frozenCase.decisionNodes[0]!;
    const final = encounter.frozenCase.decisionNodes[1]!;
    encounter.frozenCase.id = "case.gs028se.qualified-interpreter-informed-consent.a-qualified-interpreter-1";
    encounter.frozenCase.patientPresentationVariantId = "presentation.gs028se.qualified-interpreter-informed-consent.a-qualified-interpreter-1";
    first.id = "node.gs028se.qualified-interpreter-informed-consent.a-qualified-interpreter-1.1";
    first.terminalDispositions = final.terminalDispositions;
    delete first.teachingPoint;
    delete first.exhibit;
    for (const choice of first.answerChoices) delete choice.rationale;
    encounter.frozenCase.decisionNodes = [first];
    encounter.steps = [{ ...encounter.steps[0]!, decisionNodeId: first.id }];
    const legacyFrozen = JSON.parse(JSON.stringify(encounter.frozenCase));
    expect(context.clinicalRelease.cases.some((item) => item.id === legacyFrozen.id)).toBe(false);
    state = deserializeGameState(serializeGameState(state), context);
    expect(state.encounters[encounter.id]!.frozenCase).toEqual(legacyFrozen);
    const question = getCurrentQuestion(state, encounter.id, context)!;
    state = gameReducer(state, { type: "SUBMIT_ANSWER", operationId: "legacy.frozen-answer", encounterId: encounter.id, decisionNodeId: question.node.id, answerChoiceId: question.node.answerChoices.find((choice) => !choice.isCorrect)!.id, reviewedAtMs: 1 }, context);
    expect(state.operationReceipts["legacy.frozen-answer"]?.status).toBe("applied");
    expect(state.learningHistories[first.primaryConceptId]?.reviews).toHaveLength(1);
    expect(state.encounters[encounter.id]!.lifecycle).toBe("resolved_summary_available");
  });

  it("uses eight existing clinical roles, all unlocked at level 2 or later", () => {
    const roles = PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility.staffRoleDefinitions;
    expect(STATISTICS_DISCUSSION_HOST_ROLE_IDS).toHaveLength(8);
    for (const id of STATISTICS_DISCUSSION_HOST_ROLE_IDS) {
      const role = roles.find((item) => item.id === id);
      expect(role).toBeDefined();
      expect(role!.unlockFacilityLevel).toBeGreaterThanOrEqual(2);
    }
    expect(STATISTICS_DISCUSSION_HOST_ROLE_IDS.some((id) => roles.find((role) => role.id === id)!.unlockFacilityLevel === 2)).toBe(true);
  });

  it.each(["table", "keyValue", "abstract"])("preserves a real %s staff discussion through answer and reload", (kind) => {
    const clinicalCase = employeeCases.find((item) => item.decisionNodes[0]!.exhibit?.kind === kind)!;
    let { state, context } = fixture(clinicalCase);
    state.facilityLevel = 2;
    state.nextEmployeeDiscussionTick = 1;
    state.rooms.push(
      { id: "room.gs028.flow.glp", roomDefinitionId: "room.glp1_telehealth_suite", x: 29, y: 29, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
      ...[24, 25, 26, 27, 28, 29, 30].map((y) => ({ id: `room.gs028.flow.hall.${y}`, roomDefinitionId: "room.hallway", x: 32, y, orientation: 0 as const, doorSide: null, upgradeLevel: 1 as const, cleanliness: 100 })),
    );
    state.doors.push(
      { id: "door.gs028.flow.front", roomId: "room.instance.founder_desk", side: "west", offset: 0, exterior: false },
      { id: "door.gs028.flow.glp", roomId: "room.gs028.flow.glp", side: "east", offset: 1, exterior: false },
    );
    state.employees.push({ id: "employee.gs028.flow.np", staffRoleDefinitionId: "staff.glp1_np", displayName: "Dana Rivera", appearance: state.founder.appearance, hiredAtFacilityTick: 0, salaryPerExpenseInterval: 0, morale: 100, trainingLevel: 1, homeRoomInstanceId: "room.gs028.flow.glp", location: { x: 31, y: 30 }, path: [], pathIndex: 0, lastMovedAtFacilityTick: 0, lastPraisedAtFacilityTick: null, nextIdleActionAtFacilityTick: Number.MAX_SAFE_INTEGER, facilityTask: null });
    state = gameReducer(state, { type: "ADVANCE_TICK", operationId: "discussion.schedule" }, context);
    const discussion = Object.values(state.employeeDiscussions ?? {})[0]!;
    expect(discussion.frozenCase.id).toBe(clinicalCase.id);
    const expected = materializePatientName(clinicalCase, "Dana Rivera").decisionNodes[0]!;
    expect(discussion.frozenCase.decisionNodes[0]!.exhibit).toEqual(expected.exhibit);
    expect(discussion.frozenCase.decisionNodes[0]!.teachingPoint).toBe(expected.teachingPoint);
    state = gameReducer(state, { type: "OPEN_EMPLOYEE_DISCUSSION", operationId: "discussion.open", discussionId: discussion.id }, context);
    for (let attempt = 0; attempt < 30 && !getCurrentEmployeeDiscussionQuestion(state, discussion.id, context); attempt += 1) {
      state = gameReducer(state, { type: "ADVANCE_TICK", operationId: `discussion.travel.${attempt}` }, context);
    }
    const question = getCurrentEmployeeDiscussionQuestion(state, discussion.id, context)!;
    state = gameReducer(state, { type: "SUBMIT_EMPLOYEE_DISCUSSION_ANSWER", operationId: "discussion.answer", discussionId: discussion.id, decisionNodeId: question.node.id, answerChoiceId: question.node.answerChoices.find((choice) => !choice.isCorrect)!.id, reviewedAtMs: 1 }, context);
    expect(state.operationReceipts["discussion.answer"]?.status).toBe("applied");
    const frozen = state.employeeDiscussions![discussion.id]!.frozenCase;
    state = deserializeGameState(serializeGameState(state), context);
    expect(state.employeeDiscussions![discussion.id]!.frozenCase).toEqual(frozen);
    expect(state.learningHistories[question.node.primaryConceptId]?.reviews).toHaveLength(1);
    state = gameReducer(state, { type: "ACKNOWLEDGE_EMPLOYEE_DISCUSSION_FEEDBACK", operationId: "discussion.ack", discussionId: discussion.id, decisionNodeId: question.node.id }, context);
    state = gameReducer(state, { type: "FILE_EMPLOYEE_DISCUSSION", operationId: "discussion.file", discussionId: discussion.id }, context);
    expect(state.employeeDiscussions![discussion.id]!.lifecycle).toBe("resolved");
  });
});
