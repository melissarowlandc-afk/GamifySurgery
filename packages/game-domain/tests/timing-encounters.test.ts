import { describe, expect, it } from "vitest";
import { PROTOTYPE_BALANCE_RELEASE } from "@gamify-surgery/balance-config";
import {
  PROTOTYPE_DOMAIN_CONTEXT,
  TUTORIAL_ENCOUNTER_ID,
  createInitialGameState,
  createPixelAppearance,
  deserializeGameState,
  gameReducer,
  getAnswerChoiceServicePreview,
  getCurrentCapabilities,
  getCurrentQuestion,
  getEncounterSettlement,
  getFacilityClock,
  getPendingPatientLocation,
  serializeGameState,
  type DomainContext,
  type GameState,
} from "../src";

const XRAY_CASE_ID = "case.synthetic.xray-routing";
const THREE_STEP_CASE_ID = "case.synthetic.three-step-routing";

function advanceTicks(
  state: GameState,
  count: number,
  operationPrefix: string,
): GameState {
  let next = state;
  for (let tick = 1; tick <= count; tick += 1) {
    next = gameReducer(next, {
      type: "ADVANCE_TICK",
      operationId: `${operationPrefix}.${tick}`,
    });
  }
  return next;
}

function createEmptyLevelOneState(
  campaignSeed = "timing-encounter-seed",
): GameState {
  const state = createInitialGameState(PROTOTYPE_DOMAIN_CONTEXT, {
    campaignId: `campaign.${campaignSeed}`,
    campaignSeed,
    createdAtRealMs: 0,
  });
  state.facilityLevel = 1;
  state.encounters = {};
  state.openChartEncounterId = null;
  state.attendedEncounterId = null;
  state.nextRoutineArrivalTick = 2;
  state.routineArrivalSequence = 0;
  return state;
}

function admitAndOpen(
  state: GameState,
  encounterId: string,
  caseId: string,
): GameState {
  let next = gameReducer(state, {
    type: "ADMIT_PATIENT",
    operationId: `op.admit.${encounterId}`,
    encounterId,
    caseId,
    patientDisplayName: "Timing Test Patient",
    arrivalClass: "routine",
  });
  expect(next.operationReceipts[`op.admit.${encounterId}`]?.status).toBe(
    "applied",
  );
  next = gameReducer(next, {
    type: "OPEN_CHART",
    operationId: `op.open.${encounterId}.0`,
    encounterId,
  });
  return next;
}

function submitAnswer(
  state: GameState,
  encounterId: string,
  answerChoiceId: string,
  operationId: string,
  reviewedAtMs: number,
): GameState {
  const question = getCurrentQuestion(state, encounterId);
  if (!question) {
    throw new Error(`Expected an answer-ready question for ${encounterId}.`);
  }
  return gameReducer(state, {
    type: "SUBMIT_ANSWER",
    operationId,
    encounterId,
    decisionNodeId: question.node.id,
    answerChoiceId,
    reviewedAtMs,
  });
}

function answerOrder(state: GameState, encounterId: string): string[] {
  return state.encounters[encounterId]!.frozenCase.decisionNodes[0]!
    .answerChoices.map((choice) => choice.id);
}

function addInHouseXrayFacility(
  state: GameState,
  xrayX: number,
  includeStaff = true,
): GameState {
  const next = deserializeGameState(serializeGameState(state));
  const hallwayXs = new Set<number>([9]);
  for (let x = xrayX + 1; x <= 7; x += 1) {
    hallwayXs.add(x);
  }
  for (const x of [...hallwayXs].sort((left, right) => left - right)) {
    if (
      next.rooms.some(
        (room) => room.roomDefinitionId === "room.hallway" && room.x === x && room.y === 4,
      )
    ) {
      continue;
    }
    next.rooms.push({
      id: `room.test.hallway.${x}.4`,
      roomDefinitionId: "room.hallway",
      x,
      y: 4,
      orientation: 0,
      doorSide: null,
      upgradeLevel: 1,
    });
  }
  next.rooms.push(
    {
      id: "room.test.imaging-control",
      roomDefinitionId: "room.imaging_control",
      x: 9,
      y: 2,
      orientation: 0,
      doorSide: "south",
      upgradeLevel: 1,
    },
    {
      id: "room.test.xray",
      roomDefinitionId: "room.xray",
      x: xrayX,
      y: 1,
      orientation: 0,
      doorSide: "south",
      upgradeLevel: 1,
    },
  );
  if (includeStaff) {
    next.employees.push({
      id: "employee.test.imaging-technician",
      staffRoleDefinitionId: "staff.imaging_technician",
      displayName: "Test Technician",
      appearance: createPixelAppearance(
        next.campaignSeed,
        "staff",
        "employee.test.imaging-technician",
      ),
      hiredAtFacilityTick: next.facilityTick,
      salaryPerExpenseInterval: 5,
      morale: 75,
      trainingLevel: 1,
      homeRoomInstanceId: "room.test.xray",
      location: { x: xrayX + 1, y: 2 },
      path: [],
      pathIndex: 0,
      lastMovedAtFacilityTick: next.facilityTick,
    });
  }
  return next;
}

describe("facility clock and patient cadence", () => {
  it("maps one facility hour to 30 real seconds and rolls a ten-hour day from 8 AM to 6 PM", () => {
    let state = createInitialGameState();

    expect(PROTOTYPE_BALANCE_RELEASE.clock).toEqual({
      facilityHoursPerTick: 1,
      realMillisecondsPerFacilityHour: 30_000,
      dayStartHour: 8,
      dayEndHour: 18,
    });
    expect(getFacilityClock(state)).toMatchObject({
      dayNumber: 1,
      hour24: 8,
      displayLabel: "Day 1 8 AM",
      operatingHoursPerDay: 10,
      realMillisecondsPerFacilityHour: 30_000,
    });

    state = advanceTicks(state, 9, "op.clock.day-one");
    expect(getFacilityClock(state)).toMatchObject({
      dayNumber: 1,
      hour24: 17,
      displayLabel: "Day 1 5 PM",
    });

    state = advanceTicks(state, 1, "op.clock.rollover");
    expect(getFacilityClock(state)).toMatchObject({
      dayNumber: 2,
      hour24: 8,
      displayLabel: "Day 2 8 AM",
    });
    expect(
      state.events.some(
        (event) =>
          event.type === "day_rollover" &&
          event.facilityTick === 10 &&
          event.message === "Day 2 begins at 8 AM.",
      ),
    ).toBe(true);
  });

  it("admits Level 1 routine patients no faster than every two facility ticks", () => {
    let state = createEmptyLevelOneState("arrival-cadence");

    state = advanceTicks(state, 1, "op.arrival.first-hour");
    expect(state.routineArrivalSequence).toBe(0);

    state = advanceTicks(state, 1, "op.arrival.second-hour");
    expect(state.routineArrivalSequence).toBe(1);
    expect(state.nextRoutineArrivalTick).toBe(4);
    const firstArrival = state.encounters["encounter.auto.1.0"]!;
    expect(firstArrival.patientDisplayName).toMatch(
      /^[A-Z][a-z]+ [A-Z][a-z]+$/,
    );
    expect(
      state.events.find(
        (event) =>
          event.type === "patient_arrived" &&
          event.encounterId === firstArrival.id,
      )?.message,
    ).toBe(`${firstArrival.patientDisplayName} arrived.`);
    expect(
      deserializeGameState(serializeGameState(state)).encounters[
        "encounter.auto.1.0"
      ]!.patientDisplayName,
    ).toBe(firstArrival.patientDisplayName);

    state = advanceTicks(state, 1, "op.arrival.third-hour");
    expect(state.routineArrivalSequence).toBe(1);

    state = advanceTicks(state, 1, "op.arrival.fourth-hour");
    expect(state.routineArrivalSequence).toBe(2);
    expect(state.nextRoutineArrivalTick).toBe(6);
  });
});

describe("deterministic frozen answer order", () => {
  it("repeats for the same seed and encounter, varies across seeds, and survives save/reload", () => {
    const first = createInitialGameState(PROTOTYPE_DOMAIN_CONTEXT, {
      campaignId: "campaign.shuffle.first",
      campaignSeed: "shuffle-seed-same",
    });
    const repeated = createInitialGameState(PROTOTYPE_DOMAIN_CONTEXT, {
      campaignId: "campaign.shuffle.repeated",
      campaignSeed: "shuffle-seed-same",
    });
    expect(answerOrder(repeated, TUTORIAL_ENCOUNTER_ID)).toEqual(
      answerOrder(first, TUTORIAL_ENCOUNTER_ID),
    );

    const observedOrders = new Set(
      Array.from({ length: 12 }, (_, index) =>
        answerOrder(
          createInitialGameState(PROTOTYPE_DOMAIN_CONTEXT, {
            campaignId: `campaign.shuffle.${index}`,
            campaignSeed: `shuffle-seed-${index}`,
          }),
          TUTORIAL_ENCOUNTER_ID,
        ).join("|"),
      ),
    );
    expect(observedOrders.size).toBeGreaterThan(1);

    const frozenOrder = answerOrder(first, TUTORIAL_ENCOUNTER_ID);
    const restored = deserializeGameState(serializeGameState(first));
    expect(answerOrder(restored, TUTORIAL_ENCOUNTER_ID)).toEqual(frozenOrder);
  });

  it("preserves authored order when a decision node disables shuffling", () => {
    const context = JSON.parse(
      JSON.stringify(PROTOTYPE_DOMAIN_CONTEXT),
    ) as DomainContext;
    const firstNode = context.clinicalRelease.cases.find(
      (clinicalCase) => clinicalCase.id === "case.synthetic.tutorial",
    )!.decisionNodes[0]!;
    const authoredOrder = firstNode.answerChoices.map((choice) => choice.id);
    firstNode.shuffleAnswers = false;

    const state = createInitialGameState(context, {
      campaignId: "campaign.no-shuffle",
      campaignSeed: "a-seed-that-must-not-matter",
    });
    expect(answerOrder(state, TUTORIAL_ENCOUNTER_ID)).toEqual(authoredOrder);
  });
});

describe("service routing and structured multi-step encounters", () => {
  it("keeps outsourced X-ray at six hours and includes frozen hallway travel in the in-house preview", () => {
    const encounterId = "encounter.xray-preview";
    let state = admitAndOpen(
      createEmptyLevelOneState("xray-preview"),
      encounterId,
      XRAY_CASE_ID,
    );

    expect(
      getAnswerChoiceServicePreview(
        state,
        encounterId,
        "choice.synthetic.xray-routing.xray",
      ),
    ).toMatchObject({
      serviceId: "service.xray",
      routeId: "route.xray.outsourced",
      durationTicks: 6,
    });

    state = addInHouseXrayFacility(state, 6);

    expect(
      getAnswerChoiceServicePreview(
        state,
        encounterId,
        "choice.synthetic.xray-routing.xray",
      ),
    ).toMatchObject({
      serviceId: "service.xray",
      routeId: "route.xray.in_house",
      durationTicks: 4,
    });
  });

  it("freezes a longer in-house path into a longer ETA and preserves it across reload", () => {
    const shortEncounterId = "encounter.xray-short-route";
    const longEncounterId = "encounter.xray-long-route";
    let shortState = addInHouseXrayFacility(
      createEmptyLevelOneState("xray-short-route"),
      6,
    );
    let longState = addInHouseXrayFacility(
      createEmptyLevelOneState("xray-long-route"),
      0,
    );
    shortState = admitAndOpen(shortState, shortEncounterId, XRAY_CASE_ID);
    longState = admitAndOpen(longState, longEncounterId, XRAY_CASE_ID);

    expect(
      getAnswerChoiceServicePreview(
        shortState,
        shortEncounterId,
        "choice.synthetic.xray-routing.xray",
      )?.durationTicks,
    ).toBe(4);
    expect(
      getAnswerChoiceServicePreview(
        longState,
        longEncounterId,
        "choice.synthetic.xray-routing.xray",
      )?.durationTicks,
    ).toBe(6);

    longState = submitAnswer(
      longState,
      longEncounterId,
      "choice.synthetic.xray-routing.xray",
      "op.answer.long-in-house-route",
      1_000,
    );
    const pending = longState.encounters[longEncounterId]!.pendingResult!;
    expect(pending).toMatchObject({
      routeId: "route.xray.in_house",
      serviceDurationTicks: 2,
      durationTicks: 6,
      dueTick: 6,
      patientTravel: {
        version: "patient-travel.v1",
        originRoomInstanceId: "room.instance.founder_desk",
        destinationRoomInstanceId: "room.test.xray",
        tilesPerTick: 6,
        outboundStartTick: 0,
        outboundArrivalTick: 2,
        serviceCompletionTick: 4,
        returnArrivalTick: 6,
      },
    });
    expect(pending.patientTravel!.outboundPath.length).toBeGreaterThan(6);
    expect(getPendingPatientLocation(longState, longEncounterId)).toEqual(
      pending.patientTravel!.outboundPath[0],
    );
    const movingState = advanceTicks(
      longState,
      1,
      "op.long-in-house-route.move",
    );
    expect(
      getPendingPatientLocation(movingState, longEncounterId),
    ).toEqual(pending.patientTravel!.outboundPath[6]);

    const restored = deserializeGameState(serializeGameState(longState));
    expect(restored.encounters[longEncounterId]!.pendingResult).toEqual(
      pending,
    );
    expect(
      restored.encounters[longEncounterId]!.steps[0]!.result,
    ).toEqual(pending);
  });

  it("keeps staff capability offline during the persisted entrance walk", () => {
    let state = addInHouseXrayFacility(
      createEmptyLevelOneState("staff-arrival-route"),
      6,
      false,
    );
    state.cash = 5_000;
    state.nextRoutineArrivalTick = 999;
    state = gameReducer(state, {
      type: "HIRE_STAFF",
      operationId: "op.hire.traveling-tech",
      employeeId: "employee.traveling-tech",
      staffRoleDefinitionId: "staff.imaging_technician",
      displayName: "Traveling Tech",
    });

    const hired = state.employees[0]!;
    expect(hired.homeRoomInstanceId).toBe("room.test.xray");
    expect(hired.path.length).toBeGreaterThan(1);
    expect(hired.location).toEqual(hired.path[0]);
    expect(
      getCurrentCapabilities(state).has(
        "capability.staff.imaging_technician",
      ),
    ).toBe(false);

    state = advanceTicks(state, 4, "op.staff-arrival.first-step");
    expect(state.employees[0]!.pathIndex).toBe(1);
    expect(
      getCurrentCapabilities(state).has(
        "capability.staff.imaging_technician",
      ),
    ).toBe(false);

    const restored = deserializeGameState(serializeGameState(state));
    expect(restored.employees[0]!.path).toEqual(state.employees[0]!.path);
    expect(restored.employees[0]!.location).toEqual(
      state.employees[0]!.location,
    );
    expect(restored.employees[0]!.pathIndex).toBe(1);

    state = advanceTicks(restored, 4, "op.staff-arrival.reach-room");
    expect(
      getCurrentCapabilities(state).has(
        "capability.staff.imaging_technician",
      ),
    ).toBe(true);
  });

  it("corrects a wrong nonfinal answer forward, closes the chart, and records the result-ready step", () => {
    const encounterId = "encounter.correction-forward";
    let state = createEmptyLevelOneState("correction-forward");
    state.nextRoutineArrivalTick = 999;
    state = admitAndOpen(state, encounterId, XRAY_CASE_ID);

    state = submitAnswer(
      state,
      encounterId,
      "choice.synthetic.xray-routing.wait",
      "op.answer.correction-forward",
      1_000,
    );

    let encounter = state.encounters[encounterId]!;
    expect(encounter.lifecycle).toBe("active_pending_result");
    expect(state.openChartEncounterId).toBeNull();
    expect(state.attendedEncounterId).toBeNull();
    expect(encounter.steps[0]).toMatchObject({
      status: "result_pending",
      answer: {
        correct: false,
        ratingIntent: "Again",
        correctedForward: true,
      },
      result: {
        routeId: "route.xray.outsourced",
        durationTicks: 6,
        deliveredAtTick: null,
      },
    });
    expect(encounter.steps[1]!.status).toBe("locked");

    state = advanceTicks(state, 6, "op.correction-forward.result");
    encounter = state.encounters[encounterId]!;
    expect(encounter.lifecycle).toBe("active_action_required");
    expect(encounter.currentNodeIndex).toBe(1);
    expect(encounter.steps[0]).toMatchObject({
      status: "completed",
      result: {
        routeId: "route.xray.outsourced",
        deliveredAtTick: 6,
      },
    });
    expect(encounter.steps[1]!.status).toBe("action_required");
    expect(encounter.deliveredResultNarratives).toEqual([
      "Training X-ray token result: CLEAR GRID.",
    ]);
    expect(
      state.events.some(
        (event) =>
          event.type === "result_ready" &&
          event.encounterId === encounterId &&
          event.priority === "action_required",
      ),
    ).toBe(true);
  });

  it("adds safe no-travel defaults when loading an older schema-v3 pending result", () => {
    const encounterId = "encounter.pre-travel-v3";
    let state = createEmptyLevelOneState("pre-travel-v3");
    state.nextRoutineArrivalTick = 999;
    state = admitAndOpen(state, encounterId, XRAY_CASE_ID);
    state = submitAnswer(
      state,
      encounterId,
      "choice.synthetic.xray-routing.xray",
      "op.answer.pre-travel-v3",
      1_000,
    );

    const legacy = JSON.parse(serializeGameState(state)) as {
      encounters: Record<
        string,
        {
          pendingResult: Record<string, unknown>;
          steps: Array<{ result: Record<string, unknown> | null }>;
        }
      >;
    };
    const legacyEncounter = legacy.encounters[encounterId]!;
    delete legacyEncounter.pendingResult.serviceDurationTicks;
    delete legacyEncounter.pendingResult.patientTravel;
    delete legacyEncounter.steps[0]!.result!.serviceDurationTicks;
    delete legacyEncounter.steps[0]!.result!.patientTravel;

    const restored = deserializeGameState(JSON.stringify(legacy));
    expect(restored.encounters[encounterId]!.pendingResult).toMatchObject({
      routeId: "route.xray.outsourced",
      serviceDurationTicks: 6,
      durationTicks: 6,
      patientTravel: null,
    });
    expect(restored.encounters[encounterId]!.steps[0]!.result).toMatchObject({
      serviceDurationTicks: 6,
      patientTravel: null,
    });
  });

  it("retains both result routes and every step, then exposes exact settlement rewards", () => {
    const encounterId = "encounter.three-step";
    let state = createEmptyLevelOneState("three-step-history");
    state.nextRoutineArrivalTick = 999;
    state = admitAndOpen(state, encounterId, THREE_STEP_CASE_ID);

    state = submitAnswer(
      state,
      encounterId,
      "choice.synthetic.three-step.labs",
      "op.three-step.answer.labs",
      1_000,
    );
    state = advanceTicks(state, 4, "op.three-step.wait.labs");
    state = gameReducer(state, {
      type: "OPEN_CHART",
      operationId: "op.open.encounter.three-step.1",
      encounterId,
    });
    state = submitAnswer(
      state,
      encounterId,
      "choice.synthetic.three-step.xray",
      "op.three-step.answer.xray",
      2_000,
    );
    state = advanceTicks(state, 6, "op.three-step.wait.xray");
    state = gameReducer(state, {
      type: "OPEN_CHART",
      operationId: "op.open.encounter.three-step.2",
      encounterId,
    });
    state = submitAnswer(
      state,
      encounterId,
      "choice.synthetic.three-step.routine",
      "op.three-step.answer.disposition",
      3_000,
    );

    const encounter = state.encounters[encounterId]!;
    expect(encounter.lifecycle).toBe("resolved_summary_available");
    expect(encounter.answers).toHaveLength(3);
    expect(encounter.steps.map((step) => step.status)).toEqual([
      "completed",
      "completed",
      "completed",
    ]);
    expect(encounter.steps[0]!.result).toMatchObject({
      routeId: "route.basic_labs.outsourced",
      durationTicks: 4,
      resultNarrative: "First token result: LAB GRID READY.",
      deliveredAtTick: 4,
    });
    expect(encounter.steps[1]!.result).toMatchObject({
      routeId: "route.xray.outsourced",
      durationTicks: 6,
      resultNarrative: "Second token result: IMAGE GRID READY.",
      deliveredAtTick: 10,
    });
    expect(encounter.deliveredResultNarratives).toEqual([
      "First token result: LAB GRID READY.",
      "Second token result: IMAGE GRID READY.",
    ]);

    const settlement = getEncounterSettlement(state, encounterId);
    expect(settlement).toMatchObject({
      completionRevenue: 95,
      qualityRevenueBonus: 15,
      incorrectFinancialConsequence: 0,
      netCashDelta: 110,
      satisfactionDelta: 2,
      clinicalXpAwarded: 15,
      correctAnswers: 3,
      incorrectAnswers: 0,
    });
    expect(
      state.events.find(
        (event) =>
          event.type === "encounter_settled" &&
          event.encounterId === encounterId,
      ),
    ).toMatchObject({
      message: "Encounter complete: +$110 and +15 Learning XP.",
      reward: {
        cashDelta: 110,
        learningXpDelta: 15,
        satisfactionDelta: 2,
      },
    });
  });
});

describe("campaign learning isolation and legacy save migration", () => {
  it("starts every campaign with fresh concept-specific FSRS histories", () => {
    let firstCampaign = createInitialGameState(PROTOTYPE_DOMAIN_CONTEXT, {
      campaignId: "campaign.learning.first",
      campaignSeed: "learning-first",
      createdAtRealMs: 1_000,
    });
    firstCampaign = gameReducer(firstCampaign, {
      type: "OPEN_CHART",
      operationId: "op.learning.first.open",
      encounterId: TUTORIAL_ENCOUNTER_ID,
    });
    firstCampaign = submitAnswer(
      firstCampaign,
      TUTORIAL_ENCOUNTER_ID,
      "choice.signal.alpha",
      "op.learning.first.answer",
      2_000,
    );

    const conceptId = "concept.synthetic.signal";
    expect(firstCampaign.learningHistories[conceptId]!.reviews).toHaveLength(1);

    const secondCampaign = createInitialGameState(PROTOTYPE_DOMAIN_CONTEXT, {
      campaignId: "campaign.learning.second",
      campaignSeed: "learning-second",
      createdAtRealMs: 3_000,
    });
    expect(secondCampaign.learningHistories[conceptId]!.reviews).toEqual([]);
    expect(
      secondCampaign.learningHistories[conceptId]!.card.lastReviewAtMs,
    ).toBeNull();
  });

  it("migrates schema 2 without reshuffling frozen answers or losing old learning evidence", () => {
    let state = createInitialGameState(PROTOTYPE_DOMAIN_CONTEXT, {
      campaignId: "campaign.legacy-v2",
      campaignSeed: "legacy-v2-seed",
      createdAtRealMs: 1_000,
    });
    state = gameReducer(state, {
      type: "OPEN_CHART",
      operationId: "op.legacy.open",
      encounterId: TUTORIAL_ENCOUNTER_ID,
    });
    state = submitAnswer(
      state,
      TUTORIAL_ENCOUNTER_ID,
      "choice.signal.alpha",
      "op.legacy.answer",
      2_000,
    );
    const frozenOrderBeforeMigration = answerOrder(
      state,
      TUTORIAL_ENCOUNTER_ID,
    );
    const preservedHistory = JSON.parse(
      JSON.stringify(state.learningHistories["concept.synthetic.signal"]),
    );

    const legacy = JSON.parse(serializeGameState(state)) as Record<
      string,
      any
    >;
    legacy.schemaVersion = 2;
    delete legacy.randomGeneratorVersion;
    delete legacy.learningHistories["concept.synthetic.service.xray"];
    for (const encounter of Object.values(
      legacy.encounters as Record<string, Record<string, any>>,
    )) {
      delete encounter.patientAppearance;
      delete encounter.steps;
      for (const answer of encounter.answers as Record<string, any>[]) {
        delete answer.correctedForward;
      }
      for (const node of encounter.frozenCase
        .decisionNodes as Record<string, any>[]) {
        for (const choice of node.answerChoices as Record<string, any>[]) {
          delete choice.serviceRequest;
        }
      }
    }

    const migrated = deserializeGameState(JSON.stringify(legacy));
    expect(migrated.schemaVersion).toBe(3);
    expect(migrated.randomGeneratorVersion).toBe(
      "randomness.xoshiro128ss.v1",
    );
    expect(answerOrder(migrated, TUTORIAL_ENCOUNTER_ID)).toEqual(
      frozenOrderBeforeMigration,
    );
    expect(
      migrated.encounters[TUTORIAL_ENCOUNTER_ID]!.answers[0],
    ).toMatchObject({
      answerChoiceId: "choice.signal.alpha",
      correct: true,
      ratingIntent: "Good",
      correctedForward: false,
    });
    expect(
      migrated.learningHistories["concept.synthetic.signal"],
    ).toEqual(preservedHistory);
    expect(
      migrated.learningHistories["concept.synthetic.service.xray"]!.reviews,
    ).toEqual([]);
    expect(
      migrated.encounters[TUTORIAL_ENCOUNTER_ID]!.steps[0],
    ).toMatchObject({
      status: "result_pending",
      answer: {
        answerChoiceId: "choice.signal.alpha",
      },
      result: {
        routeId: "route.synthetic.outsourced",
      },
    });
  });
});
