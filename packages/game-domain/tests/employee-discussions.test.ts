import { describe, expect, it } from "vitest";
import {
  syntheticClinicalCaseSchema,
  type SyntheticClinicalCase,
} from "@gamify-surgery/clinical-content";
import {
  PROTOTYPE_DOMAIN_CONTEXT,
  createInitialGameState,
  deserializeGameState,
  gameReducer,
  getCurrentEmployeeDiscussionQuestion,
  getEmployeeDiscussionBlockedReason,
  getEmployeeDiscussionLists,
  getRoomWaitingAnchors,
  serializeGameState,
  createStaffDisplayName,
  getNamePresentationProfile,
  selectColleagueDisplayName,
  type DomainContext,
  type GameState,
} from "../src";

const templateCase = PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.find(
  (clinicalCase) => clinicalCase.routineEligible,
)!;

function employeeCase(): SyntheticClinicalCase {
  return {
    ...templateCase,
    id: "case.employee-discussion.pdsa",
    displayName: "PDSA team discussion",
    patientPresentationVariantId:
      "presentation.employee-discussion.pdsa",
    patientDisplayName: "{patientName}",
    participant: {
      kind: "employee_discussion",
      requiredStaffRoleDefinitionIds: ["staff.glp1_np"],
    },
    prototypeDemographics: undefined,
    prototypeVitalSigns: undefined,
    approvedInstantiationProfiles: undefined,
    patientPresentationRevision: undefined,
    chiefComplaint: "Team discussion",
    presentation:
      "{patientName} reviews a completed small test of change with the founder.",
    earliestFacilityStage: 0,
    requiredCapabilityIds: [],
    decisionNodes: [
      {
        ...templateCase.decisionNodes[0]!,
        id: "node.employee-discussion.pdsa",
        questionVariantId: "question.employee-discussion.pdsa.v1",
        primaryConceptId: "concept.employee-discussion.pdsa",
        resultGateAfter: null,
        answerChoices: templateCase.decisionNodes[0]!.answerChoices.map(
          (choice) => ({
            ...choice,
            serviceRequest: null,
          }),
        ),
      },
    ],
  };
}

function contextWithEmployeeCase(): DomainContext {
  return {
    ...PROTOTYPE_DOMAIN_CONTEXT,
    clinicalRelease: {
      ...PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease,
      id: "clinical-release.employee-discussion.test",
      cases: [
        ...PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.map(
          (clinicalCase) => ({ ...clinicalCase, routineEligible: false }),
        ),
        employeeCase(),
      ],
      concepts: [
        ...PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.concepts,
        {
          id: "concept.employee-discussion.pdsa",
          displayName: "PDSA team discussion",
          learningObjective: "Choose the next PDSA action.",
          earliestFacilityStage: 0,
          conceptType: "applied_science",
        },
      ],
    },
  };
}

function addReachableGlp1Np(state: GameState): void {
  const room = {
    id: "room.employee-discussion.glp",
    roomDefinitionId: "room.glp1_telehealth_suite",
    x: 29,
    y: 29,
    orientation: 0 as const,
    doorSide: null,
    upgradeLevel: 1 as const,
    cleanliness: 100,
  };
  const hallway = (y: number) => ({
    id: `room.employee-discussion.hall.${y}`,
    roomDefinitionId: "room.hallway",
    x: 32,
    y,
    orientation: 0 as const,
    doorSide: null,
    upgradeLevel: 1 as const,
    cleanliness: 100,
  });
  state.rooms.push(room, ...[24, 25, 26, 27, 28, 29, 30].map(hallway));
  state.doors.push(
    {
      id: "door.employee-discussion.front",
      roomId: "room.instance.founder_desk",
      side: "west",
      offset: 0,
      exterior: false,
    },
    {
      id: "door.employee-discussion.glp",
      roomId: room.id,
      side: "east",
      offset: 1,
      exterior: false,
    },
  );
  state.employees.push({
    id: "employee.employee-discussion.np",
    staffRoleDefinitionId: "staff.glp1_np",
    displayName: "Dana Rivera",
    appearance: state.founder.appearance,
    hiredAtFacilityTick: 0,
    salaryPerExpenseInterval: 0,
    morale: 100,
    trainingLevel: 1,
    homeRoomInstanceId: room.id,
    location: { x: 31, y: 30 },
    path: [],
    pathIndex: 0,
    lastMovedAtFacilityTick: 0,
    lastPraisedAtFacilityTick: null,
    nextIdleActionAtFacilityTick: 999,
    facilityTask: null,
  });
}

function fixture(withEmployee = true): {
  context: DomainContext;
  state: GameState;
} {
  const context = contextWithEmployeeCase();
  const state = createInitialGameState(context, {
    campaignId: "campaign.employee-discussion",
    campaignSeed: "employee-discussion",
    createdAtRealMs: 0,
  });
  state.facilityLevel = 2;
  state.paused = false;
  state.encounters = {};
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  state.nextFinancialPostingTick = Number.MAX_SAFE_INTEGER;
  state.nextEmployeeDiscussionTick = 1;
  if (withEmployee) addReachableGlp1Np(state);
  return { context, state };
}

function tick(
  state: GameState,
  context: DomainContext,
  id: string,
): GameState {
  return gameReducer(
    state,
    { type: "ADVANCE_TICK", operationId: id },
    context,
  );
}

function schedule(fixtureState: GameState, context: DomainContext): GameState {
  return tick(fixtureState, context, "employee-discussion.schedule");
}

describe("employee quality-improvement discussions", () => {
  it("keeps a generated colleague host's name, sex-compatible art and frozen discussion through reload", () => {
    const { context, state: initial } = fixture();
    const employee = initial.employees[0]!;
    employee.appearance = { ...employee.appearance, stillId: "gs022-new-employee-019" };
    const presentation = getNamePresentationProfile(employee.appearance);
    expect(presentation).toEqual({ sexLabel: "Female", ageBand: "middle_aged" });
    for (let index = 0; index < 1_000; index++) {
      const seed = `discussion.colleague.${index}`;
      if (!selectColleagueDisplayName(seed, `staff:${employee.id}`, presentation)) continue;
      initial.campaignSeed = seed;
      employee.displayName = createStaffDisplayName(seed, employee.id, [], presentation);
      break;
    }
    expect(employee.displayName).toBe(selectColleagueDisplayName(initial.campaignSeed, `staff:${employee.id}`, presentation));
    const state = schedule(initial, context);
    const discussion = Object.values(state.employeeDiscussions ?? {})[0]!;
    expect(discussion.employeeDisplayName).toBe(employee.displayName);
    expect(discussion.employeeAppearance).toEqual(employee.appearance);
    expect(discussion.frozenCase.presentation).toContain(employee.displayName);
    expect(deserializeGameState(serializeGameState(state), context).employeeDiscussions?.[discussion.id]).toEqual(discussion);
  });

  it("does not turn employee content into a patient when no eligible employee exists", () => {
    const { context, state } = fixture(false);
    state.nextRoutineArrivalTick = 1;
    const next = schedule(state, context);
    expect(Object.keys(next.encounters)).toEqual([]);
    expect(Object.keys(next.employeeDiscussions ?? {})).toEqual([]);
    expect(next.routineArrivalSequence).toBe(state.routineArrivalSequence);
  });

  it("queues one real employee, walks adjacent to that actor, and scores once without patient economics", () => {
    const { context, state: initial } = fixture();
    const cashBefore = initial.cashCents;
    const settlementsBefore = initial.settlements.length;
    const incomeBefore = initial.serviceIncomeReceipts.length;
    let state = schedule(initial, context);
    const discussion = Object.values(state.employeeDiscussions ?? {})[0]!;

    expect(discussion.employeeId).toBe("employee.employee-discussion.np");
    expect(discussion.employeeDisplayName).toBe("Dana Rivera");
    expect(discussion.frozenCase.presentation).toContain("Dana Rivera");
    expect(getEmployeeDiscussionLists(state).waiting[0]).toMatchObject({
      discussionId: discussion.id,
      employeeId: discussion.employeeId,
      actionRequired: true,
    });
    expect(getEmployeeDiscussionBlockedReason(state, discussion.id, context)).toBeNull();

    const waitingRoom = {
      id: "room.employee-discussion.waiting", roomDefinitionId: "room.waiting",
      x: 33, y: 22, orientation: 0 as const, doorSide: null, upgradeLevel: 1 as const, cleanliness: 100,
    };
    state.rooms.push(waitingRoom);
    state.doors.push({ id: "door.employee-discussion.waiting", roomId: waitingRoom.id, side: "west", offset: 2, exterior: false });
    const waitingDefinition = context.balanceRelease.facility.roomDefinitions.find((room) => room.id === "room.waiting")!;
    const deliberateSeat = getRoomWaitingAnchors(waitingRoom, waitingDefinition)[0]!;
    state.environment.founderActivity = {
      kind: "sit_in_chair",
      targetId: `chair.${deliberateSeat.x}.${deliberateSeat.y}`,
      path: [deliberateSeat],
      pathIndex: 0,
      lastMovedAtFacilityTick: state.facilityTick,
      workMinutesRemaining: Number.MAX_SAFE_INTEGER,
      explicitSeat: true,
    };

    state = gameReducer(
      state,
      {
        type: "OPEN_EMPLOYEE_DISCUSSION",
        operationId: "employee-discussion.open",
        discussionId: discussion.id,
      },
      context,
    );
    expect(state.employeeDiscussions![discussion.id]!.lifecycle).toBe(
      "active_action_required",
    );
    expect(getCurrentEmployeeDiscussionQuestion(state, discussion.id, context)).not.toBeNull();
    expect(state.environment.founderActivity).toMatchObject({
      kind: "attend_employee_discussion",
      targetId: discussion.id,
    });
    expect(state.environment.founderActivity?.path.at(-1)).not.toEqual(
      state.employees.find((employee) => employee.id === discussion.employeeId)!
        .location,
    );
    expect(state.environment.suspendedFounderActivity).toMatchObject({
      kind: "sit_in_chair",
      explicitSeat: true,
    });
    expect(
      state.employees.find((employee) => employee.id === discussion.employeeId)!
        .facilityTask,
    ).toMatchObject({
      kind: "participate_qi_discussion",
      targetId: discussion.id,
    });
    state = deserializeGameState(serializeGameState(state), context);
    const canonicalActiveConsult = serializeGameState(state);
    expect(serializeGameState(
      deserializeGameState(canonicalActiveConsult, context),
    )).toBe(canonicalActiveConsult);
    expect(state.environment.suspendedFounderActivity).toMatchObject({
      kind: "sit_in_chair",
      explicitSeat: true,
    });

    for (let index = 0; index < 20; index += 1) {
      if (
        state.employeeDiscussions![discussion.id]!.lifecycle ===
        "active_action_required"
      ) {
        break;
      }
      state = tick(state, context, `employee-discussion.travel.${index}`);
    }
    expect(getCurrentEmployeeDiscussionQuestion(state, discussion.id, context)).not.toBeNull();
    const fireAttempt = gameReducer(
      state,
      {
        type: "FIRE_EMPLOYEE",
        operationId: "employee-discussion.fire-active",
        employeeId: discussion.employeeId,
      },
      context,
    );
    expect(
      fireAttempt.operationReceipts["employee-discussion.fire-active"]?.status,
    ).toBe("rejected");
    expect(
      fireAttempt.employees.some(
        (employee) => employee.id === discussion.employeeId,
      ),
    ).toBe(true);
    const node = discussion.frozenCase.decisionNodes[0]!;
    const correct = node.answerChoices.find((choice) => choice.isCorrect)!;
    const xpBefore = state.clinicalXp;
    state = gameReducer(
      state,
      {
        type: "SUBMIT_EMPLOYEE_DISCUSSION_ANSWER",
        operationId: "employee-discussion.answer",
        discussionId: discussion.id,
        decisionNodeId: node.id,
        answerChoiceId: correct.id,
        reviewedAtMs: 100_000,
      },
      context,
    );
    expect(state.employeeDiscussions![discussion.id]!.lifecycle).toBe(
      "feedback_pending",
    );
    expect(state.environment.founderActivity).toMatchObject({ kind: "sit_in_chair", explicitSeat: true });
    expect(state.environment.suspendedFounderActivity).toBeNull();
    state = tick(state, context, "employee-discussion.after-answer");
    expect(state.environment.founderActivity?.kind).not.toBe("attend_employee_discussion");
    expect(state.employees.find((employee) => employee.id === discussion.employeeId)?.facilityTask).toBeNull();
    expect(
      state.learningHistories[node.primaryConceptId]?.reviews,
    ).toHaveLength(1);
    expect(state.clinicalXp).toBeGreaterThan(xpBefore);
    expect(state.cashCents).toBe(cashBefore);
    expect(state.settlements).toHaveLength(settlementsBefore);
    expect(state.serviceIncomeReceipts).toHaveLength(incomeBefore);
    const feedbackReload = deserializeGameState(
      serializeGameState(state),
      context,
    );
    expect(feedbackReload.employeeDiscussions?.[discussion.id]).toMatchObject({
      lifecycle: "feedback_pending",
      currentNodeIndex: 0,
    });
    expect(
      feedbackReload.learningHistories[node.primaryConceptId]?.reviews,
    ).toHaveLength(1);

    state = gameReducer(
      state,
      {
        type: "CLOSE_EMPLOYEE_DISCUSSION",
        operationId: "employee-discussion.close-feedback",
        discussionId: discussion.id,
      },
      context,
    );
    state = gameReducer(
      state,
      {
        type: "OPEN_EMPLOYEE_DISCUSSION",
        operationId: "employee-discussion.reopen-feedback",
        discussionId: discussion.id,
      },
      context,
    );

    const duplicate = gameReducer(
      state,
      {
        type: "SUBMIT_EMPLOYEE_DISCUSSION_ANSWER",
        operationId: "employee-discussion.answer-duplicate",
        discussionId: discussion.id,
        decisionNodeId: node.id,
        answerChoiceId: correct.id,
        reviewedAtMs: 100_001,
      },
      context,
    );
    expect(
      duplicate.learningHistories[node.primaryConceptId]?.reviews,
    ).toHaveLength(1);

    state = gameReducer(
      state,
      {
        type: "ACKNOWLEDGE_EMPLOYEE_DISCUSSION_FEEDBACK",
        operationId: "employee-discussion.feedback",
        discussionId: discussion.id,
        decisionNodeId: node.id,
      },
      context,
    );
    expect(state.employeeDiscussions![discussion.id]!.lifecycle).toBe(
      "resolved_summary_available",
    );
    const summaryReload = deserializeGameState(
      serializeGameState(state),
      context,
    );
    expect(summaryReload.employeeDiscussions?.[discussion.id]).toMatchObject({
      lifecycle: "resolved_summary_available",
    });
    state = gameReducer(
      state,
      {
        type: "FILE_EMPLOYEE_DISCUSSION",
        operationId: "employee-discussion.file",
        discussionId: discussion.id,
      },
      context,
    );
    expect(state.employeeDiscussions![discussion.id]!.lifecycle).toBe("resolved");
    expect(
      state.employees.find((employee) => employee.id === discussion.employeeId)!
        .facilityTask,
    ).toBeNull();
    const historical = JSON.parse(serializeGameState(state)) as GameState;
    historical.employees = historical.employees.filter(
      (employee) => employee.id !== discussion.employeeId,
    );
    const historicalReload = deserializeGameState(
      JSON.stringify(historical),
      context,
    );
    expect(historicalReload.employeeDiscussions?.[discussion.id]?.lifecycle).toBe(
      "resolved",
    );
    expect(
      historicalReload.learningHistories[node.primaryConceptId]?.reviews,
    ).toHaveLength(1);
  });

  it("opens a queued discussion immediately while busy or unreachable attendance waits", () => {
    const { context, state: initial } = fixture();
    const scheduled = schedule(initial, context);
    const discussion = Object.values(scheduled.employeeDiscussions ?? {})[0]!;

    const busy = JSON.parse(serializeGameState(scheduled)) as GameState;
    busy.employees.find(
      (employee) => employee.id === discussion.employeeId,
    )!.facilityTask = {
      kind: "clean_room",
      startedAtFacilityTick: busy.facilityTick,
      workMinutesRemaining: 5,
      targetId: "room.employee-discussion.glp",
    };
    const busyResult = gameReducer(
      busy,
      {
        type: "OPEN_EMPLOYEE_DISCUSSION",
        operationId: "employee-discussion.busy",
        discussionId: discussion.id,
      },
      context,
    );
    expect(busyResult.operationReceipts["employee-discussion.busy"]?.status).toBe(
      "applied",
    );
    expect(busyResult.employeeDiscussions![discussion.id]!.lifecycle).toBe(
      "active_action_required",
    );
    expect(getCurrentEmployeeDiscussionQuestion(busyResult, discussion.id, context)).not.toBeNull();
    expect(busyResult.environment.founderActivity?.kind).not.toBe("attend_employee_discussion");
    expect(deserializeGameState(serializeGameState(busyResult), context).employeeDiscussions?.[discussion.id]?.lifecycle).toBe("active_action_required");

    const unreachable = JSON.parse(serializeGameState(scheduled)) as GameState;
    unreachable.doors = unreachable.doors.filter(
      (door) => door.id !== "door.employee-discussion.glp",
    );
    const unreachableResult = gameReducer(
      unreachable,
      {
        type: "OPEN_EMPLOYEE_DISCUSSION",
        operationId: "employee-discussion.unreachable",
        discussionId: discussion.id,
      },
      context,
    );
    expect(
      unreachableResult.operationReceipts["employee-discussion.unreachable"]
        ?.status,
    ).toBe("applied");
    expect(unreachableResult.employeeDiscussions![discussion.id]!.lifecycle).toBe("active_action_required");
    expect(getCurrentEmployeeDiscussionQuestion(unreachableResult, discussion.id, context)).not.toBeNull();
  });

  it("does not restore a suspended seat after a newer founder command supersedes the consult", () => {
    const { context, state: initial } = fixture();
    let state = schedule(initial, context);
    const discussion = Object.values(state.employeeDiscussions ?? {})[0]!;
    const endpoint = { ...state.environment.founderLocation };
    state.environment.founderActivity = {
      kind: "sit_in_chair", targetId: "chair.explicit", path: [endpoint], pathIndex: 0,
      lastMovedAtFacilityTick: state.facilityTick, workMinutesRemaining: Number.MAX_SAFE_INTEGER,
      explicitSeat: true,
    };
    state = gameReducer(state, {
      type: "OPEN_EMPLOYEE_DISCUSSION", operationId: "discussion.supersede.open", discussionId: discussion.id,
    }, context);
    expect(state.environment.suspendedFounderActivity?.explicitSeat).toBe(true);
    state = gameReducer(state, {
      type: "MOVE_FOUNDER", operationId: "discussion.supersede.move", destination: endpoint,
    }, context);
    expect(state.operationReceipts["discussion.supersede.move"]?.status).toBe("applied");
    expect(state.environment.suspendedFounderActivity).toBeNull();
    state = tick(state, context, "discussion.supersede.tick");
    expect(state.environment.founderActivity?.kind).toBe("walk_to_point");
    const node = discussion.frozenCase.decisionNodes[0]!;
    state = gameReducer(state, {
      type: "SUBMIT_EMPLOYEE_DISCUSSION_ANSWER", operationId: "discussion.supersede.answer",
      discussionId: discussion.id, decisionNodeId: node.id,
      answerChoiceId: node.answerChoices.find((choice) => choice.isCorrect)!.id,
      reviewedAtMs: 200_000,
    }, context);
    expect(state.environment.founderActivity?.kind).toBe("walk_to_point");
    expect(state.environment.suspendedFounderActivity).toBeNull();
  });

  it("releases a closed employee consult so an actionable patient chart can open", () => {
    const { context, state: initial } = fixture();
    let state = schedule(initial, context);
    const discussion = Object.values(state.employeeDiscussions ?? {})[0]!;
    state = gameReducer(state, {
      type: "OPEN_EMPLOYEE_DISCUSSION", operationId: "switch.employee.open", discussionId: discussion.id,
    }, context);
    state = gameReducer(state, {
      type: "CLOSE_EMPLOYEE_DISCUSSION", operationId: "switch.employee.close", discussionId: discussion.id,
    }, context);
    const patient = JSON.parse(JSON.stringify(Object.values(createInitialGameState(context).encounters)[0]!)) as GameState["encounters"][string];
    patient.checkInStatus = "checked_in";
    patient.patientMovement = null;
    state.encounters[patient.id] = patient;
    state = gameReducer(state, {
      type: "OPEN_CHART", operationId: "switch.patient.open", encounterId: patient.id,
    }, context);
    expect(state.operationReceipts["switch.patient.open"]?.status).toBe("applied");
    expect(state.openChartEncounterId).toBe(patient.id);
    expect(state.employees.find((employee) => employee.id === discussion.employeeId)?.facilityTask).toBeNull();
  });

  it("round-trips active discussion reservations and cancels an orphan without review", () => {
    const { context, state: initial } = fixture();
    let state = schedule(initial, context);
    const discussion = Object.values(state.employeeDiscussions ?? {})[0]!;
    state = gameReducer(
      state,
      {
        type: "OPEN_EMPLOYEE_DISCUSSION",
        operationId: "employee-discussion.persistence.open",
        discussionId: discussion.id,
      },
      context,
    );
    const frozenParse = syntheticClinicalCaseSchema.safeParse(
      state.employeeDiscussions![discussion.id]!.frozenCase,
    );
    expect(
      frozenParse.success,
      frozenParse.success ? "" : JSON.stringify(frozenParse.error.issues),
    ).toBe(true);
    const restored = deserializeGameState(serializeGameState(state), context);
    expect(restored.employeeDiscussions?.[discussion.id]).toMatchObject({
      employeeId: discussion.employeeId,
      lifecycle: "active_action_required",
    });
    expect(restored.environment.founderActivity).toMatchObject({
      kind: "attend_employee_discussion",
      targetId: discussion.id,
    });
    expect(
      restored.employees.find((employee) => employee.id === discussion.employeeId)!
        .facilityTask,
    ).toMatchObject({ kind: "participate_qi_discussion" });

    const malformed = JSON.parse(serializeGameState(state)) as GameState;
    const malformedDiscussion = malformed.employeeDiscussions![discussion.id]!;
    const malformedNode = malformedDiscussion.frozenCase.decisionNodes[0]!;
    const malformedChoice = malformedNode.answerChoices[0]!;
    const malformedAnswer = {
      decisionNodeId: malformedNode.id,
      primaryConceptId: malformedNode.primaryConceptId,
      answerChoiceId: malformedChoice.id,
      correct: malformedChoice.isCorrect,
      ratingIntent: malformedChoice.isCorrect ? ("Good" as const) : ("Again" as const),
      answeredAtFacilityTick: malformed.facilityTick,
      explanation: malformedNode.explanation,
      correctedForward: false,
    };
    malformedDiscussion.lifecycle = "active_action_required";
    malformedDiscussion.answers = [malformedAnswer];
    malformedDiscussion.steps[0]!.answer = malformedAnswer;
    const malformedReload = deserializeGameState(
      JSON.stringify(malformed),
      context,
    );
    expect(malformedReload.employeeDiscussions?.[discussion.id]).toMatchObject({
      lifecycle: "cancelled",
      cancellationReason: "content_invalid",
    });

    const orphan = JSON.parse(serializeGameState(state)) as GameState;
    orphan.employees = orphan.employees.filter(
      (employee) => employee.id !== discussion.employeeId,
    );
    const cancelled = deserializeGameState(JSON.stringify(orphan), context);
    expect(cancelled.employeeDiscussions?.[discussion.id]).toMatchObject({
      lifecycle: "cancelled",
      cancellationReason: "employee_unavailable",
    });
    expect(
      cancelled.learningHistories["concept.employee-discussion.pdsa"]?.reviews,
    ).toHaveLength(0);
  });

  it("keeps a GLP-1 payout due tick while the NP is reserved for discussion", () => {
    const { context, state: initial } = fixture();
    initial.environment.glp1AutomationSlots = [
      {
        suiteRoomInstanceId: "room.employee-discussion.glp",
        employeeId: "employee.employee-discussion.np",
        nextPayoutTick: 90,
      },
    ];
    let state = schedule(initial, context);
    const discussion = Object.values(state.employeeDiscussions ?? {})[0]!;
    state = gameReducer(
      state,
      {
        type: "OPEN_EMPLOYEE_DISCUSSION",
        operationId: "employee-discussion.glp.open",
        discussionId: discussion.id,
      },
      context,
    );
    state = tick(state, context, "employee-discussion.glp.suspended");
    expect(state.environment.glp1AutomationSlots).toContainEqual({
      suiteRoomInstanceId: "room.employee-discussion.glp",
      employeeId: "employee.employee-discussion.np",
      nextPayoutTick: 90,
    });
  });
});
