import { describe, expect, it } from "vitest";
import { LEGACY_PROTOTYPE_CLINICAL_RELEASE } from "@gamify-surgery/clinical-content";
import {
  PROTOTYPE_DOMAIN_CONTEXT,
  createInitialGameState,
  deserializeGameState,
  gameReducer,
  getClinicSatisfaction,
  getCurrentQuestion,
  getFacilityClock,
  getEligibleServiceRoute,
  getPatientLists,
  serializeGameState,
  validateDomainContext,
  type GameState,
} from "../src";

const XRAY_CASE_ID = "case.synthetic.xray-routing";
const LEGACY_TEST_CONTEXT = validateDomainContext({
  ...PROTOTYPE_DOMAIN_CONTEXT,
  clinicalRelease: LEGACY_PROTOTYPE_CLINICAL_RELEASE,
});

function tick(state: GameState, id: string): GameState {
  return gameReducer(state, {
    type: "ADVANCE_TICK",
    operationId: id,
  });
}

function advance(
  state: GameState,
  minutes: number,
  prefix: string,
): GameState {
  let next = state;
  for (let minute = 1; minute <= minutes; minute += 1) {
    next = tick(next, `${prefix}.${minute}`);
  }
  return next;
}

function emptyLevelOne(seed: string): GameState {
  const state = createInitialGameState(undefined, {
    campaignId: `campaign.${seed}`,
    campaignSeed: seed,
    createdAtRealMs: 0,
  });
  state.facilityLevel = 1;
  state.encounters = {};
  state.openChartEncounterId = null;
  state.attendedEncounterId = null;
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  return state;
}

function addWaitingAndExaminationRooms(state: GameState): void {
  state.rooms.push(
    {
      id: "room.test.waiting",
      roomDefinitionId: "room.waiting",
      x: 29,
      y: 28,
      orientation: 0,
      doorSide: null,
      upgradeLevel: 1,
      cleanliness: 100,
    },
    {
      id: "room.test.return-examination",
      roomDefinitionId: "room.examination",
      x: 34,
      y: 26,
      orientation: 0,
      doorSide: null,
      upgradeLevel: 1,
      cleanliness: 100,
    },
  );
  state.doors.push(
    {
      id: "door.test.waiting-to-front",
      roomId: "room.test.waiting",
      side: "east",
      offset: 1,
      exterior: false,
    },
    {
      id: "door.test.return-exam-to-front",
      roomId: "room.test.return-examination",
      side: "south",
      offset: 1,
      exterior: false,
    },
  );
}

function addOperationalXrayService(state: GameState): void {
  state.rooms.push(
    {
      id: "room.test.examination",
      roomDefinitionId: "room.examination",
      x: 7,
      y: 10,
      orientation: 0,
      doorSide: null,
      upgradeLevel: 1,
      cleanliness: 100,
    },
    {
      id: "room.test.imaging-control",
      roomDefinitionId: "room.imaging_control",
      x: 10,
      y: 8,
      orientation: 0,
      doorSide: null,
      upgradeLevel: 1,
      cleanliness: 100,
    },
    {
      id: "room.test.xray",
      roomDefinitionId: "room.xray",
      x: 10,
      y: 10,
      orientation: 0,
      doorSide: null,
      upgradeLevel: 1,
      cleanliness: 100,
    },
  );
  state.doors.push({
    id: "door.test.exam-to-xray",
    roomId: "room.test.examination",
    side: "east",
    offset: 1,
    exterior: false,
  });
  state.employees.push({
    id: "employee.test.imaging-tech",
    staffRoleDefinitionId: "staff.imaging_technician",
    displayName: "Imaging Test Technician",
    appearance: state.founder.appearance,
    hiredAtFacilityTick: state.facilityTick,
    salaryPerExpenseInterval: 26,
    morale: 75,
    trainingLevel: 1,
    homeRoomInstanceId: "room.test.imaging-control",
    location: { x: 10, y: 8 },
    path: [{ x: 10, y: 8 }],
    pathIndex: 0,
    lastMovedAtFacilityTick: state.facilityTick,
    lastPraisedAtFacilityTick: null,
    nextIdleActionAtFacilityTick: state.facilityTick + 20,
  });
}

function addTwoExamOperationalXrayService(state: GameState): void {
  state.rooms.push(
    {
      id: "room.test.exam-front",
      roomDefinitionId: "room.examination",
      x: 34,
      y: 26,
      orientation: 0,
      doorSide: null,
      upgradeLevel: 1,
      cleanliness: 100,
    },
    {
      id: "room.test.exam-xray",
      roomDefinitionId: "room.examination",
      x: 31,
      y: 28,
      orientation: 90,
      doorSide: null,
      upgradeLevel: 1,
      cleanliness: 100,
    },
    {
      id: "room.test.multi-imaging-control",
      roomDefinitionId: "room.imaging_control",
      x: 28,
      y: 26,
      orientation: 0,
      doorSide: null,
      upgradeLevel: 1,
      cleanliness: 100,
    },
    {
      id: "room.test.multi-xray",
      roomDefinitionId: "room.xray",
      x: 28,
      y: 28,
      orientation: 0,
      doorSide: null,
      upgradeLevel: 1,
      cleanliness: 100,
    },
  );
  state.doors.push(
    {
      id: "door.test.exam-front",
      roomId: "room.test.exam-front",
      side: "south",
      offset: 1,
      exterior: false,
    },
    {
      id: "door.test.exam-xray-front",
      roomId: "room.test.exam-xray",
      side: "east",
      offset: 1,
      exterior: false,
    },
    {
      id: "door.test.xray-patient",
      roomId: "room.test.multi-xray",
      side: "east",
      offset: 1,
      exterior: false,
    },
    {
      id: "door.test.xray-control",
      roomId: "room.test.multi-imaging-control",
      side: "south",
      offset: 1,
      exterior: false,
    },
  );
  state.employees.push({
    id: "employee.test.multi-imaging-tech",
    staffRoleDefinitionId: "staff.imaging_technician",
    displayName: "Multi-Exam Imaging Technician",
    appearance: state.founder.appearance,
    hiredAtFacilityTick: state.facilityTick,
    salaryPerExpenseInterval: 26,
    morale: 75,
    trainingLevel: 1,
    homeRoomInstanceId: "room.test.multi-imaging-control",
    location: { x: 28, y: 27 },
    path: [{ x: 28, y: 27 }],
    pathIndex: 0,
    lastMovedAtFacilityTick: state.facilityTick,
    lastPraisedAtFacilityTick: null,
    nextIdleActionAtFacilityTick: state.facilityTick + 20,
  });
}

function admit(
  state: GameState,
  encounterId: string,
  caseId = XRAY_CASE_ID,
): GameState {
  return gameReducer(
    state,
    {
      type: "ADMIT_PATIENT",
      operationId: `admit.${encounterId}`,
      encounterId,
      caseId,
      patientDisplayName: "Routing Test Patient",
      arrivalClass: "routine",
    },
    caseId.startsWith("case.synthetic.") ||
      caseId.startsWith("case.prototype.")
      ? LEGACY_TEST_CONTEXT
      : PROTOTYPE_DOMAIN_CONTEXT,
  );
}

function makeQuestionReady(
  state: GameState,
  encounterId: string,
  prefix: string,
): GameState {
  let next = state;
  for (let attempt = 0; attempt < 150; attempt += 1) {
    if (getCurrentQuestion(next, encounterId)) {
      return next;
    }
    const encounter = next.encounters[encounterId]!;
    if (
      encounter.lifecycle === "waiting_unopened" &&
      encounter.patientMovement === null
    ) {
      next = gameReducer(next, {
        type: "OPEN_CHART",
        operationId: `${prefix}.open.${attempt}`,
        encounterId,
      });
    } else {
      next = tick(next, `${prefix}.tick.${attempt}`);
    }
  }
  throw new Error("The patient never reached an answer-ready state.");
}

function answerCorrect(
  state: GameState,
  encounterId: string,
  prefix: string,
): GameState {
  const question = getCurrentQuestion(state, encounterId)!;
  const choice = question.node.answerChoices.find(
    (candidate) => candidate.isCorrect,
  )!;
  return gameReducer(state, {
    type: "SUBMIT_ANSWER",
    operationId: `${prefix}.answer`,
    encounterId,
    decisionNodeId: question.node.id,
    answerChoiceId: choice.id,
    reviewedAtMs: 1_000,
  });
}

describe("minute simulation and economy", () => {
  it("uses minute clocks, 1×/2×/4× speed state, and continuous day rollover", () => {
    let state = createInitialGameState();
    expect(getFacilityClock(state)).toMatchObject({
      dayNumber: 1,
      hour24: 8,
      minute: 0,
      displayLabel: "Day 1 8:00 AM",
    });
    state = gameReducer(state, {
      type: "SET_SIMULATION_SPEED",
      operationId: "speed.4",
      speed: 4,
    });
    expect(state.simulationSpeed).toBe(4);

    state = advance(state, 600, "clock.day");
    expect(getFacilityClock(state)).toMatchObject({
      dayNumber: 2,
      hour24: 8,
      minute: 0,
    });
  });

  it("accrues continuously and posts hourly rates on quarter-hour boundaries", () => {
    let state = createInitialGameState();
    const startingCash = state.cash;
    state = advance(state, 14, "expense.before-quarter");
    expect(state.cash).toBe(startingCash);
    expect(state.operatingAccrualSixtiethCents).toBeGreaterThan(0);

    state = tick(state, "expense.quarter");
    expect(state.facilityTick).toBe(15);
    expect(state.cash).toBe(startingCash - 1.5);
    const restored = deserializeGameState(serializeGameState(state));
    expect(restored.nextFinancialPostingTick).toBe(30);
    expect(restored.operatingAccrualSixtiethCents).toBe(
      state.operatingAccrualSixtiethCents,
    );
  });

  it("persists irregular, non-quarter-hour patient arrival timestamps", () => {
    const state = createInitialGameState(undefined, {
      campaignSeed: "irregular-arrival-current",
    });
    expect(state.nextRoutineArrivalTick).toBeGreaterThanOrEqual(35);
    expect(state.nextRoutineArrivalTick).toBeLessThanOrEqual(75);
    expect(state.nextRoutineArrivalTick % 15).not.toBe(0);

    const restored = deserializeGameState(serializeGameState(state));
    expect(restored.nextRoutineArrivalTick).toBe(
      state.nextRoutineArrivalTick,
    );
  });
});

describe("physical patient routing", () => {
  it("starts deterministic arrivals fully offscreen from both sides with cardinal reload-stable routes", () => {
    const starts = new Set<"left" | "right">();
    for (let index = 0; index < 32; index += 1) {
      const encounterId = `encounter.arrival-side.${index}`;
      const state = admit(
        emptyLevelOne("arrival-side-sample"),
        encounterId,
      );
      const path =
        state.encounters[encounterId]!.patientMovement!.path;
      const first = path[0]!;
      if (first.x === -2) {
        starts.add("left");
      }
      if (
        first.x ===
        PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility.gridWidth + 1
      ) {
        starts.add("right");
      }
      expect(
        path.every((point, pathIndex) => {
          const previous = path[pathIndex - 1];
          return (
            !previous ||
            Math.abs(point.x - previous.x) +
              Math.abs(point.y - previous.y) ===
              1
          );
        }),
      ).toBe(true);
      const restored = deserializeGameState(
        serializeGameState(state),
      );
      expect(
        restored.encounters[encounterId]!.patientMovement?.path,
      ).toEqual(path);
    }
    expect(starts).toEqual(new Set(["left", "right"]));
  });

  it("advances patients, employees, and the founder at one shared tile rate", () => {
    let state = createInitialGameState(undefined, {
      campaignId: "campaign.shared-character-speed",
      campaignSeed: "shared-character-speed",
      createdAtRealMs: 0,
    });
    state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
    const encounter = Object.values(state.encounters)[0]!;
    const sharedPath = encounter.patientMovement!.path.map((point) => ({
      ...point,
    }));
    expect(sharedPath.length).toBeGreaterThan(9);
    state.employees.push({
      id: "employee.shared-speed",
      staffRoleDefinitionId: "staff.receptionist",
      displayName: "Shared Speed",
      appearance: state.founder.appearance,
      hiredAtFacilityTick: 0,
      salaryPerExpenseInterval: 0,
      morale: 100,
      trainingLevel: 1,
      homeRoomInstanceId: null,
      location: { ...sharedPath[0]! },
      path: sharedPath.map((point) => ({ ...point })),
      pathIndex: 0,
      lastMovedAtFacilityTick: state.facilityTick,
      lastPraisedAtFacilityTick: null,
      nextIdleActionAtFacilityTick: 100,
    });
    state.environment.founderLocation = { ...sharedPath[0]! };
    state.environment.founderActivity = {
      kind: "collect_litter",
      targetId: "litter.shared-speed",
      path: sharedPath.map((point) => ({ ...point })),
      pathIndex: 0,
      lastMovedAtFacilityTick: state.facilityTick,
      workMinutesRemaining: 1,
    };

    state = tick(state, "shared-speed.tick");

    const expectedIndex = Math.min(
      sharedPath.length - 1,
      PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility
        .characterTravelTilesPerTick,
    );
    expect(encounter.id).toBeDefined();
    expect(
      state.encounters[encounter.id]!.patientMovement?.pathIndex,
    ).toBe(expectedIndex);
    expect(state.employees[0]!.pathIndex).toBe(expectedIndex);
    expect(
      state.environment.founderActivity?.pathIndex,
    ).toBe(expectedIndex);
  });

  it("clamps and repairs every persisted in-progress character route", () => {
    const state = createInitialGameState(undefined, {
      campaignId: "campaign.route-persistence-repair",
      campaignSeed: "route-persistence-repair",
      createdAtRealMs: 0,
    });
    const encounter = Object.values(state.encounters)[0]!;
    const path = encounter.patientMovement!.path;
    encounter.patientMovement!.pathIndex = 999;
    encounter.patientLocation = { x: 999, y: 999 };
    state.employees.push({
      id: "employee.route-persistence",
      staffRoleDefinitionId: "staff.receptionist",
      displayName: "Persistence Tester",
      appearance: state.founder.appearance,
      hiredAtFacilityTick: 0,
      salaryPerExpenseInterval: 0,
      morale: 100,
      trainingLevel: 1,
      homeRoomInstanceId: null,
      location: { x: 999, y: 999 },
      path: path.map((point) => ({ ...point })),
      pathIndex: 999,
      lastMovedAtFacilityTick: 0,
      lastPraisedAtFacilityTick: null,
      nextIdleActionAtFacilityTick: 100,
    });
    state.environment.founderActivity = {
      kind: "collect_litter",
      targetId: "litter.route-persistence",
      path: path.map((point) => ({ ...point })),
      pathIndex: 999,
      lastMovedAtFacilityTick: 0,
      workMinutesRemaining: 1,
    };
    state.environment.founderLocation = { x: 999, y: 999 };

    const restored = deserializeGameState(serializeGameState(state));
    const endpoint = path.at(-1)!;

    expect(
      restored.encounters[encounter.id]!.patientMovement?.pathIndex,
    ).toBe(path.length - 1);
    expect(restored.encounters[encounter.id]!.patientLocation).toEqual(
      endpoint,
    );
    expect(restored.employees[0]).toMatchObject({
      pathIndex: path.length - 1,
      location: endpoint,
    });
    expect(restored.environment.founderActivity?.pathIndex).toBe(
      path.length - 1,
    );
    expect(restored.environment.founderLocation).toEqual(endpoint);
  });

  it("uses 60-minute laboratory and staffed onsite X-ray routes, then falls back to 120-minute offsite X-ray at capacity", () => {
    let state = emptyLevelOne("service-timing");
    expect(
      getEligibleServiceRoute(state, "service.basic_labs"),
    ).toMatchObject({
      route: { id: "route.basic_labs.outsourced" },
      timing: { serviceDurationTicks: 60 },
    });
    expect(getEligibleServiceRoute(state, "service.xray")).toMatchObject({
      route: { id: "route.xray.outsourced" },
      timing: { serviceDurationTicks: 120 },
    });

    addOperationalXrayService(state);
    expect(getEligibleServiceRoute(state, "service.xray")).toMatchObject({
      route: { id: "route.xray.in_house" },
      timing: { serviceDurationTicks: 60 },
    });

    const encounterId = "encounter.inhouse-capacity";
    state = makeQuestionReady(
      admit(state, encounterId),
      encounterId,
      "inhouse.ready",
    );
    state = answerCorrect(state, encounterId, "inhouse.order");
    expect(state.encounters[encounterId]!.pendingResult).toMatchObject({
      routeId: "route.xray.in_house",
      serviceDurationTicks: 60,
    });
    expect(getEligibleServiceRoute(state, "service.xray")).toMatchObject({
      route: { id: "route.xray.outsourced" },
      timing: { serviceDurationTicks: 120 },
    });
  });

  it("binds an onsite service route to this encounter's actual examination room", () => {
    const encounterId = "encounter.multi-exam-origin";
    let state = emptyLevelOne("multi-exam-origin");
    addTwoExamOperationalXrayService(state);
    state = makeQuestionReady(
      admit(state, encounterId),
      encounterId,
      "multi-exam.ready",
    );
    const encounter = state.encounters[encounterId]!;
    encounter.patientMovement = null;
    encounter.patientLocation = { x: 35, y: 27 };
    encounter.assignedRoomInstanceId = "room.test.exam-front";
    encounter.queuedCareRoomInstanceId = null;
    state = answerCorrect(state, encounterId, "multi-exam.order");

    expect(
      state.encounters[encounterId]!.pendingResult?.patientTravel
        ?.originRoomInstanceId,
    ).toBe("room.test.exam-xray");
    const step =
      state.encounters[encounterId]!.steps[
        state.encounters[encounterId]!.currentNodeIndex
      ]!;
    state = gameReducer(state, {
      type: "ACKNOWLEDGE_DECISION_FEEDBACK",
      operationId: "multi-exam.ack",
      encounterId,
      decisionNodeId: step.decisionNodeId,
    });

    expect(
      state.operationReceipts["multi-exam.ack"]?.status,
    ).toBe("applied");
    const reboundTravel =
      state.encounters[encounterId]!.pendingResult?.patientTravel;
    expect(reboundTravel?.originRoomInstanceId).toBe(
      "room.test.exam-front",
    );
    expect(reboundTravel?.outboundPath[0]).toEqual({
      x: 35,
      y: 27,
    });
    const timingBoundaries = {
      dueTick: state.encounters[encounterId]!.pendingResult!.dueTick,
      outboundArrivalTick: reboundTravel!.outboundArrivalTick,
      returnArrivalTick: reboundTravel!.returnArrivalTick,
    };
    reboundTravel!.tilesPerTick = 4;
    const restored = deserializeGameState(serializeGameState(state));
    expect(
      restored.encounters[encounterId]!.pendingResult?.patientTravel
        ?.tilesPerTick,
    ).toBe(
      PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility
        .characterTravelTilesPerTick,
    );
    expect(
      restored.encounters[encounterId]!.pendingResult?.dueTick,
    ).toBe(timingBoundaries.dueTick);
    expect(
      restored.encounters[encounterId]!.pendingResult?.patientTravel,
    ).toMatchObject({
      outboundArrivalTick: timingBoundaries.outboundArrivalTick,
      returnArrivalTick: timingBoundaries.returnArrivalTick,
    });
  });

  it("hides the chart until Front Desk check-in, then exposes it immediately while walking to care", () => {
    let admitted = admit(
      emptyLevelOne("arrival-route"),
      "encounter.arrival-route",
    );
    expect(
      admitted.encounters["encounter.arrival-route"]!.patientMovement
        ?.kind,
    ).toBe("arriving_for_check_in");
    expect(
      getCurrentQuestion(admitted, "encounter.arrival-route"),
    ).toBeNull();
    expect(getPatientLists(admitted).waiting).toHaveLength(0);
    const tooEarly = gameReducer(admitted, {
      type: "OPEN_CHART",
      operationId: "arrival-route.open-too-early",
      encounterId: "encounter.arrival-route",
    });
    expect(
      tooEarly.operationReceipts["arrival-route.open-too-early"]?.status,
    ).toBe("rejected");

    for (let minute = 0; minute < 100; minute += 1) {
      if (getPatientLists(admitted).waiting.length > 0) {
        break;
      }
      admitted = tick(admitted, `arrival-route.check-in.${minute}`);
    }
    expect(getPatientLists(admitted).waiting).toHaveLength(1);
    const opened = gameReducer(admitted, {
      type: "OPEN_CHART",
      operationId: "arrival-route.open-at-check-in",
      encounterId: "encounter.arrival-route",
    });
    expect(
      opened.encounters["encounter.arrival-route"]!.lifecycle,
    ).toBe("active_action_required");
    expect(
      getCurrentQuestion(opened, "encounter.arrival-route"),
    ).not.toBeNull();

    const ready = makeQuestionReady(
      opened,
      "encounter.arrival-route",
      "arrival-route",
    );
    expect(
      getCurrentQuestion(ready, "encounter.arrival-route"),
    ).not.toBeNull();
  });

  it("uses only one Front Desk waiting place before queuing later patients on the sidewalk", () => {
    let state = emptyLevelOne("front-desk-overflow");
    state = admit(state, "encounter.front-desk.first");
    state = admit(state, "encounter.front-desk.second");
    for (let minute = 0; minute < 100; minute += 1) {
      const encounters = [
        state.encounters["encounter.front-desk.first"]!,
        state.encounters["encounter.front-desk.second"]!,
      ];
      if (
        encounters.every(
          (encounter) => encounter.patientMovement === null,
        )
      ) {
        break;
      }
      state = tick(state, `front-desk-overflow.${minute}`);
    }
    const encounters = [
      state.encounters["encounter.front-desk.first"]!,
      state.encounters["encounter.front-desk.second"]!,
    ];
    const frontDeskWaiters = encounters.filter(
      (encounter) =>
        encounter.assignedRoomInstanceId ===
          "room.instance.founder_desk" ||
        encounter.patientMovement?.destinationRoomInstanceId ===
          "room.instance.founder_desk",
    );
    const sidewalkWaiters = encounters.filter(
      (encounter) =>
        encounter.assignedRoomInstanceId === null &&
        encounter.patientLocation !== null &&
        encounter.patientLocation.y >=
          PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility.gridHeight,
    );

    expect(frontDeskWaiters).toHaveLength(1);
    expect(sidewalkWaiters).toHaveLength(1);
  });

  it("uses only visible Waiting Room chairs and sends chair overflow outside that room", () => {
    let state = emptyLevelOne("waiting-room-visible-seats");
    addWaitingAndExaminationRooms(state);
    const visibleChairKeys = new Set([
      "30,28",
      "31,28",
      "29,29",
      "32,29",
    ]);
    // The east-side chair shares this test layout's door threshold, leaving
    // the other three visible chairs available to patients.
    const usableChairKeys = new Set([
      "30,28",
      "31,28",
      "29,29",
    ]);

    const usableChairCount = usableChairKeys.size;
    for (let index = 0; index < usableChairCount; index += 1) {
      const encounterId = `encounter.waiting-chair.${index}`;
      state = admit(state, encounterId);
      state.encounters[encounterId]!.waiting.patienceExempt = true;
      for (let minute = 0; minute < 100; minute += 1) {
        if (state.encounters[encounterId]!.patientMovement === null) {
          break;
        }
        state = tick(
          state,
          `waiting-room-visible-chair.${index}.${minute}`,
        );
      }
      const encounter = state.encounters[encounterId]!;
      const locationKey = `${encounter.patientLocation?.x},${encounter.patientLocation?.y}`;
      expect(encounter.assignedRoomInstanceId).toBe(
        "room.test.waiting",
      );
      expect(usableChairKeys.has(locationKey)).toBe(true);
      usableChairKeys.delete(locationKey);
      encounter.nextIdleActionAtFacilityTick =
        Number.MAX_SAFE_INTEGER;
    }
    expect(usableChairKeys.size).toBe(0);

    const overflowEncounterId = "encounter.waiting-overflow";
    state = admit(state, overflowEncounterId);
    state.encounters[overflowEncounterId]!.waiting.patienceExempt =
      true;
    for (let minute = 0; minute < 100; minute += 1) {
      if (state.encounters[overflowEncounterId]!.patientMovement === null) {
        break;
      }
      state = tick(state, `waiting-room-overflow.${minute}`);
    }
    const overflowEncounter = state.encounters[overflowEncounterId]!;
    const overflowKey = `${overflowEncounter.patientLocation?.x},${overflowEncounter.patientLocation?.y}`;

    expect(overflowEncounter.assignedRoomInstanceId).toBe(
      "room.instance.founder_desk",
    );
    expect(visibleChairKeys.has(overflowKey)).toBe(false);
    expect(overflowKey).not.toBe("29,28");
    expect(overflowKey).not.toBe("32,28");
  });

  it("walks out for send-out testing, remains away, and returns before results become actionable", () => {
    const encounterId = "encounter.offsite-route";
    const initial = emptyLevelOne("offsite-route");
    addWaitingAndExaminationRooms(initial);
    let state = makeQuestionReady(
      admit(initial, encounterId),
      encounterId,
      "offsite.ready",
    );
    state = answerCorrect(state, encounterId, "offsite.order");
    expect(state.encounters[encounterId]!.pendingResult).toMatchObject({
      routeId: "route.xray.outsourced",
      serviceDurationTicks: 120,
    });
    const step =
      state.encounters[encounterId]!.steps[
        state.encounters[encounterId]!.currentNodeIndex
      ]!;
    state = gameReducer(state, {
      type: "ACKNOWLEDGE_DECISION_FEEDBACK",
      operationId: "offsite.ack",
      encounterId,
      decisionNodeId: step.decisionNodeId,
    });

    for (let minute = 0; minute < 100; minute += 1) {
      if (
        state.encounters[encounterId]!.patientMovement?.kind ===
        "departing_for_offsite_testing"
      ) {
        break;
      }
      state = tick(state, `offsite.to-exam.${minute}`);
    }
    expect(state.encounters[encounterId]!.patientMovement?.kind).toBe(
      "departing_for_offsite_testing",
    );
    const frozenTravel =
      state.encounters[encounterId]!.pendingResult!.offsiteTravel!;
    expect(frozenTravel).not.toBeNull();
    expect(
      state.encounters[encounterId]!.pendingResult!.dueTick -
        state.encounters[encounterId]!.pendingResult!.scheduledAtTick,
    ).toBe(120);
    let sawAway = false;
    let sawReturningInside = false;
    let restoredAwayState = false;
    let returnedAtTick: number | null = null;
    for (let minute = 0; minute < 500; minute += 1) {
      const current = state.encounters[encounterId]!;
      sawAway ||=
        current.lifecycle === "active_pending_result" &&
        current.patientLocation === null &&
        current.patientMovement === null;
      if (
        !restoredAwayState &&
        current.lifecycle === "active_pending_result" &&
        current.patientLocation === null &&
        current.patientMovement === null
      ) {
        const dueBeforeReload = current.pendingResult!.dueTick;
        current.pendingResult!.offsiteTravel!.tilesPerTick = 4;
        state = deserializeGameState(serializeGameState(state));
        expect(
          state.encounters[encounterId]!.pendingResult!.dueTick,
        ).toBe(dueBeforeReload);
        expect(
          state.encounters[encounterId]!.pendingResult!.offsiteTravel
            ?.tilesPerTick,
        ).toBe(
          PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility
            .characterTravelTilesPerTick,
        );
        restoredAwayState = true;
      }
      sawReturningInside ||=
        current.patientMovement?.kind ===
        "returning_from_offsite_testing";
      if (
        current.lifecycle === "active_action_required"
      ) {
        returnedAtTick = state.facilityTick;
        break;
      }
      state = tick(state, `offsite.wait.${minute}`);
    }

    expect(sawAway).toBe(true);
    expect(sawReturningInside).toBe(true);
    expect(returnedAtTick).toBe(frozenTravel.returnArrivalTick);
    expect(state.encounters[encounterId]).toMatchObject({
      lifecycle: "active_action_required",
      patientMovement: {
        kind: "walking_to_waiting",
        destinationRoomInstanceId: "room.test.waiting",
      },
      assignedRoomInstanceId: "room.instance.founder_desk",
    });
    expect(getCurrentQuestion(state, encounterId)).not.toBeNull();
    expect(
      state.events.filter(
        (event) =>
          event.type === "result_ready" &&
          event.encounterId === encounterId,
      ),
    ).toHaveLength(0);
    expect(state.encounters[encounterId]).toMatchObject({
      feedAttentionKind: "result_ready",
      feedAttentionStartedAtTick: state.facilityTick,
    });

    const waitingRoute =
      state.encounters[encounterId]!.patientMovement!;
    state = deserializeGameState(serializeGameState(state));
    expect(
      state.encounters[encounterId]!.patientMovement,
    ).toEqual(waitingRoute);

    let immediateResolution = deserializeGameState(
      serializeGameState(state),
    );
    immediateResolution = gameReducer(immediateResolution, {
      type: "OPEN_CHART",
      operationId: "offsite.open-while-walking-to-wait",
      encounterId,
    });
    expect(
      immediateResolution.encounters[encounterId]!
        .queuedCareRoomInstanceId,
    ).toBe("room.test.return-examination");
    immediateResolution = answerCorrect(
      immediateResolution,
      encounterId,
      "offsite.immediate-final",
    );
    immediateResolution = gameReducer(immediateResolution, {
      type: "ACKNOWLEDGE_TERMINAL_FEEDBACK",
      operationId: "offsite.immediate-ack-final",
      encounterId,
    });
    immediateResolution = gameReducer(immediateResolution, {
      type: "CLOSE_CHART",
      operationId: "offsite.immediate-resolve-chart",
      encounterId,
    });
    expect(immediateResolution.encounters[encounterId]).toMatchObject({
      lifecycle: "resolved",
      patientMovement: { kind: "walking_to_waiting" },
      queuedCareRoomInstanceId: "room.test.return-examination",
    });
    for (let minute = 0; minute < 100; minute += 1) {
      if (
        immediateResolution.encounters[encounterId]!.patientMovement
          ?.kind === "walking_to_care"
      ) {
        break;
      }
      immediateResolution = tick(
        immediateResolution,
        `offsite.immediate-to-exam.${minute}`,
      );
    }
    expect(
      immediateResolution.encounters[encounterId]!.patientMovement,
    ).toMatchObject({
      kind: "walking_to_care",
      destinationRoomInstanceId: "room.test.return-examination",
    });
    for (let minute = 0; minute < 100; minute += 1) {
      if (
        immediateResolution.encounters[encounterId]!.patientMovement ===
        null
      ) {
        break;
      }
      immediateResolution = tick(
        immediateResolution,
        `offsite.immediate-exit.${minute}`,
      );
    }
    expect(immediateResolution.encounters[encounterId]).toMatchObject({
      lifecycle: "resolved",
      patientMovement: null,
      patientLocation: null,
    });

    for (let minute = 0; minute < 100; minute += 1) {
      if (
        state.encounters[encounterId]!.patientMovement?.kind !==
        "walking_to_waiting"
      ) {
        break;
      }
      state = tick(state, `offsite.waiting.${minute}`);
    }
    expect(state.encounters[encounterId]).toMatchObject({
      lifecycle: "active_action_required",
      patientMovement: null,
      assignedRoomInstanceId: "room.test.waiting",
    });
    expect(state.openChartEncounterId).toBeNull();

    state = gameReducer(state, {
      type: "OPEN_CHART",
      operationId: "offsite.open-returned-chart",
      encounterId,
    });
    expect(
      state.operationReceipts["offsite.open-returned-chart"]?.status,
    ).toBe("applied");
    expect(state.openChartEncounterId).toBe(encounterId);
    expect(state.encounters[encounterId]!.patientMovement).toMatchObject({
      kind: "walking_to_care",
      destinationRoomInstanceId: "room.test.return-examination",
    });
    expect(
      Object.values(state.encounters).filter(
        (candidate) =>
          candidate.lifecycle !== "resolved" &&
          (candidate.assignedRoomInstanceId ===
            "room.test.return-examination" ||
            candidate.queuedCareRoomInstanceId ===
              "room.test.return-examination" ||
            candidate.patientMovement?.destinationRoomInstanceId ===
              "room.test.return-examination"),
      ),
    ).toHaveLength(1);

    for (let minute = 0; minute < 100; minute += 1) {
      if (
        state.encounters[encounterId]!.patientMovement?.kind !==
        "walking_to_care"
      ) {
        break;
      }
      state = tick(state, `offsite.exam.${minute}`);
    }
    expect(state.encounters[encounterId]).toMatchObject({
      lifecycle: "active_action_required",
      patientMovement: null,
      assignedRoomInstanceId: "room.test.return-examination",
    });

    state = answerCorrect(state, encounterId, "offsite.final");
    expect(state.encounters[encounterId]).toMatchObject({
      lifecycle: "resolved_summary_available",
      resolutionReason: "completed",
    });
    state = gameReducer(state, {
      type: "ACKNOWLEDGE_TERMINAL_FEEDBACK",
      operationId: "offsite.ack-final",
      encounterId,
    });
    state = gameReducer(state, {
      type: "CLOSE_CHART",
      operationId: "offsite.resolve-chart",
      encounterId,
    });
    expect(state.encounters[encounterId]!.patientMovement?.kind).toBe(
      "leaving_after_resolution",
    );
    for (let minute = 0; minute < 100; minute += 1) {
      if (state.encounters[encounterId]!.patientMovement === null) {
        break;
      }
      state = tick(state, `offsite.exit.${minute}`);
    }
    expect(state.encounters[encounterId]).toMatchObject({
      lifecycle: "resolved",
      resolutionReason: "completed",
      patientMovement: null,
      patientLocation: null,
    });
  });

  it("extends a legacy ten-minute send-out enough for the complete natural-speed round trip", () => {
    const encounterId = "encounter.ten-minute-sendout";
    let state = makeQuestionReady(
      admit(
        emptyLevelOne("ten-minute-sendout"),
        encounterId,
        "case.synthetic.tutorial",
      ),
      encounterId,
      "ten-minute.ready",
    );
    state = answerCorrect(state, encounterId, "ten-minute.order");
    const step =
      state.encounters[encounterId]!.steps[
        state.encounters[encounterId]!.currentNodeIndex
      ]!;
    state = gameReducer(state, {
      type: "ACKNOWLEDGE_DECISION_FEEDBACK",
      operationId: "ten-minute.ack",
      encounterId,
      decisionNodeId: step.decisionNodeId,
    });
    const pending = state.encounters[encounterId]!.pendingResult!;
    expect(pending.serviceDurationTicks).toBe(10);
    expect(pending.dueTick - pending.scheduledAtTick).toBeGreaterThan(10);

    while (
      state.encounters[encounterId]!.lifecycle ===
        "active_pending_result" &&
      state.facilityTick <= pending.dueTick
    ) {
      state = tick(
        state,
        `ten-minute.tick.${state.facilityTick}`,
      );
    }

    expect(state.facilityTick).toBe(pending.dueTick);
    expect(state.encounters[encounterId]).toMatchObject({
      lifecycle: "active_action_required",
      patientLocation: expect.any(Object),
      patientMovement: {
        kind: "walking_to_waiting",
      },
      assignedRoomInstanceId: "room.instance.founder_desk",
    });
  });

  it("fits the legacy tutorial itinerary from either persisted sidewalk side", () => {
    const sides = new Set<"left" | "right">();
    for (let index = 0; index < 16; index += 1) {
      const encounterId = `encounter.ten-minute-side.${index}`;
      let state = admit(
        emptyLevelOne("ten-minute-both-sides"),
        encounterId,
        "case.synthetic.tutorial",
      );
      const arrivalX =
        state.encounters[encounterId]!.patientMovement!.path[0]!.x;
      sides.add(arrivalX < 0 ? "left" : "right");
      state = makeQuestionReady(
        state,
        encounterId,
        `ten-minute-side.${index}.ready`,
      );
      state = answerCorrect(
        state,
        encounterId,
        `ten-minute-side.${index}.order`,
      );
      const step =
        state.encounters[encounterId]!.steps[
          state.encounters[encounterId]!.currentNodeIndex
        ]!;
      state = gameReducer(state, {
        type: "ACKNOWLEDGE_DECISION_FEEDBACK",
        operationId: `ten-minute-side.${index}.ack`,
        encounterId,
        decisionNodeId: step.decisionNodeId,
      });
      const receipt =
        state.operationReceipts[`ten-minute-side.${index}.ack`];
      expect(receipt?.status).toBe("applied");
      const pending = state.encounters[encounterId]!.pendingResult!;
      expect(pending.serviceDurationTicks).toBe(10);
      expect(
        pending.dueTick - pending.scheduledAtTick,
      ).toBeGreaterThan(10);
    }
    expect(sides).toEqual(new Set(["left", "right"]));
  });

  it("persists a walkout threshold and resolves only after the patient reaches the exit", () => {
    const encounterId = "encounter.walkout";
    let state = admit(emptyLevelOne("walkout"), encounterId);
    while (state.encounters[encounterId]!.patientMovement) {
      state = tick(state, `walkout.arrival.${state.facilityTick}`);
    }
    const encounter = state.encounters[encounterId]!;
    encounter.patientSatisfaction = 59;
    encounter.walkoutThreshold = 59;
    encounter.idleWaitingSinceTick =
      state.facilityTick -
      PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.patientSatisfaction
        .idleGraceMinutes -
      PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.patientSatisfaction
        .decayIntervalMinutes;
    encounter.lastSatisfactionDecayAtTick =
      encounter.idleWaitingSinceTick;

    state = tick(state, "walkout.trigger");
    expect(state.encounters[encounterId]).toMatchObject({
      resolutionReason: null,
      patientMovement: {
        kind: "leaving_after_walkout",
      },
    });
    const restored = deserializeGameState(serializeGameState(state));
    expect(restored.encounters[encounterId]!.walkoutThreshold).toBe(59);

    state = restored;
    for (let minute = 0; minute < 30; minute += 1) {
      if (state.encounters[encounterId]!.resolutionReason === "walkout") {
        break;
      }
      state = tick(state, `walkout.exit.${minute}`);
    }
    expect(state.encounters[encounterId]).toMatchObject({
      lifecycle: "resolved",
      resolutionReason: "walkout",
      patientLocation: null,
      patientMovement: null,
      finalPatientSatisfaction: expect.any(Number),
    });
    expect(
      state.events.find(
        (event) =>
          event.type === "left_before_seen" &&
          event.encounterId === encounterId,
      )?.message,
    ).toMatch(/^New [12]-star review from .+: .+/);
  });
});

describe("rolling clinic satisfaction", () => {
  it("uses only the configured most-recent completed encounter window", () => {
    const state = emptyLevelOne("rolling-satisfaction");
    expect(getClinicSatisfaction(state)).toBeNull();
    for (let index = 0; index < 12; index += 1) {
      const encounter = JSON.parse(
        JSON.stringify(
          createInitialGameState().encounters[
            "encounter.synthetic.tutorial"
          ]!,
        ),
      ) as GameState["encounters"][string];
      encounter.id = `encounter.completed.${index}`;
      encounter.lifecycle = "resolved";
      encounter.resolutionReason = "completed";
      encounter.patientMovement = null;
      encounter.patientLocation = null;
      encounter.finalPatientSatisfaction = index < 2 ? 0 : 90;
      encounter.resolvedAtFacilityTick = index + 1;
      state.encounters[encounter.id] = encounter;
    }
    expect(getClinicSatisfaction(state)).toBe(90);
  });
});
