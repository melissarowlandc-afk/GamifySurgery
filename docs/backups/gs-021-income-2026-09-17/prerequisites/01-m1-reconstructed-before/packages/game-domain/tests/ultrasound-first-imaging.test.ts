import {
  PROTOTYPE_DOMAIN_CONTEXT,
  TUTORIAL_ENCOUNTER_ID,
  createInitialGameState,
  deserializeGameState,
  gameReducer,
  getEligibleServiceRoute,
  getCurrentQuestion,
  getFacilityProgressionStatus,
  serializeGameState,
  validateDomainContext,
  type DomainContext,
  type GameState,
} from "../src";
import { describe, expect, it } from "vitest";

function stateAt(level: 0 | 1 | 2): GameState {
  const state = createInitialGameState(undefined, {
    campaignId: `campaign.ultrasound-first.${level}`,
    campaignSeed: `ultrasound-first.${level}`,
    createdAtRealMs: 0,
  });
  state.facilityLevel = level;
  state.cash = 10_000;
  state.cashCents = 1_000_000;
  state.encounters = {};
  return state;
}

function withOrdinaryDoorUltrasound(state: GameState): GameState {
  state.rooms = state.rooms.filter(
    (room) => room.id !== "room.instance.starter_examination",
  );
  state.doors = state.doors.filter(
    (door) => door.roomId !== "room.instance.starter_examination",
  );
  state.rooms.push(
    { id: "room.test.exam", roomDefinitionId: "room.examination", x: 34, y: 26, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
    { id: "room.test.ultrasound", roomDefinitionId: "room.ultrasound", x: 33, y: 23, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
    ...([24, 25, 26, 27, 28] as const).map((y) => ({ id: `room.test.hall.${y}`, roomDefinitionId: "room.hallway", x: 32, y, orientation: 0 as const, doorSide: null, upgradeLevel: 1 as const, cleanliness: 100 })),
  );
  state.doors.push(
    { id: "door.test.ultrasound", roomId: "room.test.ultrasound", side: "south", offset: 2, exterior: false },
    { id: "door.test.ultrasound.staff", roomId: "room.test.ultrasound", side: "west", offset: 1, exterior: false },
    { id: "door.test.front", roomId: "room.instance.founder_desk", side: "west", offset: 0, exterior: false },
  );
  state.employees.push({
    id: "employee.test.imaging", staffRoleDefinitionId: "staff.imaging_technician",
    displayName: "Ultrasound Technician", appearance: state.founder.appearance,
    hiredAtFacilityTick: state.facilityTick, salaryPerExpenseInterval: 26,
    morale: 75, trainingLevel: 1, homeRoomInstanceId: "room.test.ultrasound",
    location: { x: 32, y: 24 }, path: [{ x: 32, y: 24 }], pathIndex: 0,
    lastMovedAtFacilityTick: state.facilityTick, lastPraisedAtFacilityTick: null,
    nextIdleActionAtFacilityTick: state.facilityTick + 20, facilityTask: null,
  });
  return state;
}

function admitQuestionAtCare(
  state: GameState,
  encounterId: string,
  serviceId: string,
  context: DomainContext = PROTOTYPE_DOMAIN_CONTEXT,
): GameState {
  const selected = context.clinicalRelease.cases
    .flatMap((candidate) =>
      candidate.decisionNodes.map((node, nodeIndex) => ({ candidate, node, nodeIndex })),
    )
    .find(({ node }) => node.resultGateAfter?.resultTypeId === serviceId);
  expect(selected, `current ${serviceId} case`).toBeDefined();
  const admitted = gameReducer(state, {
    type: "ADMIT_PATIENT", operationId: `${encounterId}.admit`, encounterId,
    caseId: selected!.candidate.id, patientDisplayName: `${serviceId} Patient`,
    arrivalClass: "routine",
  }, context);
  const encounter = admitted.encounters[encounterId]!;
  encounter.currentNodeIndex = selected!.nodeIndex;
  encounter.steps.forEach((step, index) => {
    step.status = index < selected!.nodeIndex ? "completed" :
      index === selected!.nodeIndex ? "action_required" : "locked";
  });
  encounter.patientMovement = null;
  encounter.patientLocation = { x: 35, y: 27 };
  encounter.assignedRoomInstanceId = "room.test.exam";
  encounter.queuedCareRoomInstanceId = null;
  encounter.checkInStatus = "checked_in";
  encounter.lifecycle = "active_action_required";
  admitted.openChartEncounterId = encounterId;
  admitted.attendedEncounterId = encounterId;
  return admitted;
}

function submitCorrect(
  state: GameState,
  encounterId: string,
  suffix: string,
  context: DomainContext = PROTOTYPE_DOMAIN_CONTEXT,
): GameState {
  const question = getCurrentQuestion(state, encounterId, context)!;
  const correct = question.node.answerChoices.find((choice) => choice.isCorrect)!;
  return gameReducer(state, {
    type: "SUBMIT_ANSWER", operationId: `${encounterId}.${suffix}.submit`,
    encounterId, decisionNodeId: question.node.id, answerChoiceId: correct.id,
    reviewedAtMs: 10_000 + state.facilityTick,
  }, context);
}

function advance(
  state: GameState,
  ticks: number,
  prefix: string,
  context: DomainContext = PROTOTYPE_DOMAIN_CONTEXT,
): GameState {
  let next = state;
  for (let index = 0; index < ticks; index += 1) {
    next = gameReducer(next, {
      type: "ADVANCE_TICK", operationId: `${prefix}.${index}`,
    }, context);
  }
  return next;
}

function contextWithReducerDrivenXrayCase(): DomainContext {
  const clinicalRelease = JSON.parse(
    JSON.stringify(PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease),
  ) as typeof PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease;
  const source = clinicalRelease.cases.find(
    (candidate) =>
      candidate.decisionNodes[0]?.resultGateAfter?.resultTypeId ===
      "service.ultrasound",
  )!;
  const xrayCase = JSON.parse(JSON.stringify(source)) as typeof source;
  xrayCase.id = "case.synthetic.gs020-sequential-xray";
  const node = xrayCase.decisionNodes[0]!;
  node.resultGateAfter = {
    ...node.resultGateAfter!,
    id: "gate.synthetic.gs020-sequential-xray",
    resultTypeId: "service.xray",
    allowedServiceRouteIds: ["route.xray.in_house", "route.xray.outsourced"],
  };
  node.answerChoices.forEach((choice) => {
    choice.serviceRequest = { serviceId: "service.xray" };
  });
  clinicalRelease.cases.push(xrayCase);
  return validateDomainContext({ ...PROTOTYPE_DOMAIN_CONTEXT, clinicalRelease });
}

describe("ultrasound-first imaging progression", () => {
  it("makes ultrasound, not X-ray, the Level-1 imaging objective", () => {
    const stage = PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility.stageDefinitions[1]!;
    expect(stage.requiredRoomDefinitionIds).toContain("room.ultrasound");
    expect(stage.requiredRoomDefinitionIds).not.toContain("room.xray");
    expect(PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility.roomDefinitions.find(
      (room) => room.id === "room.ultrasound",
    )?.unlockFacilityLevel).toBe(1);
  });

  it("actually advances Level 1 with ultrasound, minor procedure, and a technician but no X-ray", () => {
    const state = withOrdinaryDoorUltrasound(createInitialGameState());
    state.facilityLevel = 1;
    state.clinicalXp = 150;
    state.rooms.push({
      id: "room.test.minor", roomDefinitionId: "room.minor_procedure",
      x: 29, y: 26, orientation: 0, doorSide: null, upgradeLevel: 1,
      cleanliness: 100,
    });
    state.doors.push({
      id: "door.test.minor", roomId: "room.test.minor", side: "east",
      offset: 1, exterior: false,
    });
    const tutorial = state.encounters[TUTORIAL_ENCOUNTER_ID]!;
    tutorial.resolutionReason = "completed";
    tutorial.resolvedAtFacilityTick = 0;
    tutorial.patientSatisfaction = 100;
    tutorial.finalPatientSatisfaction = 100;
    expect(state.rooms.some((room) => room.roomDefinitionId === "room.xray"))
      .toBe(false);
    expect(
      getFacilityProgressionStatus(state).requirements.filter(
        (requirement) => !requirement.met,
      ),
    ).toEqual([]);
    const advanced = gameReducer(state, {
      type: "LEVEL_UP", operationId: "ultrasound.level-up",
    });
    expect(advanced.operationReceipts["ultrasound.level-up"]?.status).toBe("applied");
    expect(advanced.facilityLevel).toBe(2);
  });

  it("keeps X-ray as an optional Level-2 purchase and rejects new control rooms", () => {
    const levelOne = gameReducer(stateAt(1), {
      type: "PLACE_ROOM", operationId: "xray.l1", roomId: "xray.l1",
      roomDefinitionId: "room.xray", x: 10, y: 10,
    });
    expect(levelOne.operationReceipts["xray.l1"]?.status).toBe("rejected");
    const levelTwo = gameReducer(stateAt(2), {
      type: "PLACE_ROOM", operationId: "xray.l2", roomId: "xray.l2",
      roomDefinitionId: "room.xray", x: 10, y: 10,
    });
    expect(levelTwo.operationReceipts["xray.l2"]?.status).toBe("applied");
    const control = gameReducer(stateAt(2), {
      type: "PLACE_ROOM", operationId: "control.new", roomId: "control.new",
      roomDefinitionId: "room.imaging_control", x: 10, y: 10,
    });
    expect(control.operationReceipts["control.new"]?.status).toBe("rejected");
  });

  it("uses an equipped, staffed ultrasound room through ordinary doors and gates missing prerequisites", () => {
    const bare = stateAt(1);
    expect(getEligibleServiceRoute(bare, "service.ultrasound")?.route.id)
      .toBe("route.ultrasound.outsourced");

    const operational = withOrdinaryDoorUltrasound(stateAt(1));
    const clinicalGate = PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases
      .flatMap((clinicalCase) => clinicalCase.decisionNodes)
      .map((node) => node.resultGateAfter)
      .find((gate) => gate?.resultTypeId === "service.ultrasound");
    expect(clinicalGate).toBeDefined();
    expect(getEligibleServiceRoute(
      operational,
      "service.ultrasound",
      clinicalGate!.allowedServiceRouteIds,
    )).toMatchObject({
      route: { id: "route.ultrasound.in_house" },
      imagingTechnicianId: "employee.test.imaging",
      timing: { patientTravel: { destinationRoomInstanceId: "room.test.ultrasound" } },
    });
    expect(operational.rooms.some((room) => room.roomDefinitionId === "room.imaging_control"))
      .toBe(false);

    const unstaffed = withOrdinaryDoorUltrasound(stateAt(1));
    unstaffed.employees = [];
    expect(getEligibleServiceRoute(unstaffed, "service.ultrasound")?.route.id)
      .toBe("route.ultrasound.outsourced");

    const inaccessible = withOrdinaryDoorUltrasound(stateAt(1));
    inaccessible.doors = inaccessible.doors.filter(
      (door) => !door.id.startsWith("door.test.ultrasound"),
    );
    expect(getEligibleServiceRoute(inaccessible, "service.ultrasound")?.route.id)
      .toBe("route.ultrasound.outsourced");
  });

  it("holds one concrete technician through delayed feedback, then permits sequential reuse", () => {
    let state = withOrdinaryDoorUltrasound(stateAt(1));
    state = gameReducer(state, {
      type: "ADMIT_PATIENT", operationId: "busy.admit", encounterId: "busy",
      caseId: PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases[0]!.id,
      patientDisplayName: "Busy Imaging Patient", arrivalClass: "routine",
    });
    const encounter = state.encounters.busy!;
    const selected = getEligibleServiceRoute(state, "service.ultrasound")!;
    encounter.pendingResult = {
      operationId: "result.busy", gateId: "gate.busy", originatingNodeIndex: 0,
      resultTypeId: "service.ultrasound", pendingLabel: "Pending", resultNarrative: "Hidden until ready.",
      routeId: selected.route.id, routeDisplayName: selected.route.displayName,
      scheduledAtTick: 0, serviceDurationTicks: 75, durationTicks: 75, dueTick: 75,
      deliveredAtTick: null, offsiteReturnStartedAtTick: null, offsiteTravel: null,
      patientTravel: selected.timing.patientTravel,
      timingPhases: selected.route.timingPhases.map((phase) => ({ ...phase, startsAtTick: 0, endsAtTick: phase.durationTicks })),
      resourceReservations: selected.route.resourceRequirements,
      imagingTechnicianId: selected.imagingTechnicianId, providerReservation: null,
    };
    encounter.steps[0]!.status = "feedback_pending";
    state.employees[0]!.facilityTask = { kind: "perform_imaging", startedAtFacilityTick: 0, workMinutesRemaining: 1, targetId: "result.busy" };
    state.facilityTick = 60;
    expect(getEligibleServiceRoute(state, "service.ultrasound")?.route.id)
      .toBe("route.ultrasound.outsourced");

    encounter.steps[0]!.status = "result_pending";
    state.employees[0]!.facilityTask = null;
    expect(getEligibleServiceRoute(state, "service.ultrasound")?.route.id)
      .toBe("route.ultrasound.in_house");
  });

  it("selects the operational room and valid technician when earlier identities are unusable", () => {
    const state = withOrdinaryDoorUltrasound(stateAt(1));
    state.rooms.push({
      id: "room.aaa.disconnected-ultrasound", roomDefinitionId: "room.ultrasound",
      x: 4, y: 4, orientation: 0, doorSide: null, upgradeLevel: 1,
      cleanliness: 100,
    });
    state.employees.push({
      ...state.employees[0]!,
      id: "employee.aaa.invalid-home",
      displayName: "Invalid Home Technician",
      homeRoomInstanceId: "room.missing",
      facilityTask: null,
    });
    expect(getEligibleServiceRoute(state, "service.ultrasound")).toMatchObject({
      route: { id: "route.ultrasound.in_house" },
      imagingTechnicianId: "employee.test.imaging",
      timing: { patientTravel: { destinationRoomInstanceId: "room.test.ultrasound" } },
    });
  });

  it("falls back offsite when a reachable technician cannot arrive inside the fixed acquisition window", () => {
    const state = withOrdinaryDoorUltrasound(stateAt(1));
    state.rooms.push(
      ...Array.from({ length: 24 }, (_, y) => ({
        id: `room.long.vertical.${y}`, roomDefinitionId: "room.hallway",
        x: 32, y, orientation: 0 as const, doorSide: null,
        upgradeLevel: 1 as const, cleanliness: 100,
      })),
      ...Array.from({ length: 31 }, (_, offset) => ({
        id: `room.long.horizontal.${offset}`, roomDefinitionId: "room.hallway",
        x: 33 + offset, y: 0, orientation: 0 as const, doorSide: null,
        upgradeLevel: 1 as const, cleanliness: 100,
      })),
    );
    const technician = state.employees[0]!;
    technician.location = { x: 63, y: 0 };
    technician.path = [{ x: 63, y: 0 }];
    technician.pathIndex = 0;
    const slowContext = {
      ...PROTOTYPE_DOMAIN_CONTEXT,
      balanceRelease: {
        ...PROTOTYPE_DOMAIN_CONTEXT.balanceRelease,
        facility: {
          ...PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility,
          characterTravelTilesPerTick: 1,
        },
      },
    };
    expect(getEligibleServiceRoute(
      state,
      "service.ultrasound",
      null,
      slowContext,
    )?.route.id).toBe("route.ultrasound.outsourced");
  });

  it("uses one technician for actual ultrasound then X-ray services in sequence", () => {
    const context = contextWithReducerDrivenXrayCase();
    let state = withOrdinaryDoorUltrasound(stateAt(2));
    state.rooms.push({
      id: "room.test.xray", roomDefinitionId: "room.xray", x: 29, y: 23,
      orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100,
    });
    state.doors.push({
      id: "door.test.xray", roomId: "room.test.xray", side: "east",
      offset: 1, exterior: false,
    });
    state = admitQuestionAtCare(state, "sequential-ultrasound", "service.ultrasound", context);
    state = submitCorrect(state, "sequential-ultrasound", "order", context);
    let encounter = state.encounters["sequential-ultrasound"]!;
    state = gameReducer(state, {
      type: "ACKNOWLEDGE_DECISION_FEEDBACK", operationId: "sequential-ultrasound.ack",
      encounterId: encounter.id,
      decisionNodeId: encounter.steps[encounter.currentNodeIndex]!.decisionNodeId,
    }, context);
    const acquisitionEnd = state.encounters[encounter.id]!.pendingResult!
      .timingPhases!.find((phase) => phase.resourceBound)!.endsAtTick;
    state = advance(
      state,
      acquisitionEnd - state.facilityTick + 1,
      "sequential-ultrasound.acquire",
      context,
    );
    expect(state.employees[0]!.facilityTask).toBeNull();

    state = admitQuestionAtCare(state, "sequential-xray", "service.xray", context);
    state = submitCorrect(state, "sequential-xray", "order", context);
    encounter = state.encounters["sequential-xray"]!;
    expect(encounter.pendingResult).toMatchObject({
      routeId: "route.xray.in_house",
      imagingTechnicianId: "employee.test.imaging",
    });
    expect(state.encounters["sequential-ultrasound"]!.pendingResult?.deliveredAtTick)
      .toBeNull();
  });

  it("preserves an actual submitted ultrasound service, technician walk, timing, and reward state across reload", () => {
    let state = admitQuestionAtCare(
      withOrdinaryDoorUltrasound(stateAt(1)),
      "actual-ultrasound",
      "service.ultrasound",
    );
    state = submitCorrect(state, "actual-ultrasound", "order");
    const beforeAck = state.encounters["actual-ultrasound"]!;
    expect(beforeAck.pendingResult).toMatchObject({
      routeId: "route.ultrasound.in_house",
      imagingTechnicianId: "employee.test.imaging",
      deliveredAtTick: null,
    });
    const dueBeforeAck = beforeAck.pendingResult!.dueTick;
    const step = beforeAck.steps[beforeAck.currentNodeIndex]!;
    state = gameReducer(state, {
      type: "ACKNOWLEDGE_DECISION_FEEDBACK",
      operationId: "actual-ultrasound.ack", encounterId: beforeAck.id,
      decisionNodeId: step.decisionNodeId,
    });
    state = advance(state, 1, "actual-ultrasound.mid-walk");
    const cashBeforeReload = state.cashCents;
    const pendingBeforeReload = state.encounters[beforeAck.id]!.pendingResult!;
    const techBeforeReload = state.employees.find(
      (employee) => employee.id === pendingBeforeReload.imagingTechnicianId,
    )!;
    expect(techBeforeReload.facilityTask).toMatchObject({
      kind: "perform_imaging", targetId: pendingBeforeReload.operationId,
    });
    expect(techBeforeReload.pathIndex).toBeGreaterThan(0);
    expect(techBeforeReload.pathIndex).toBeLessThan(techBeforeReload.path.length - 1);

    state = deserializeGameState(serializeGameState(state));
    expect(state.encounters[beforeAck.id]!.pendingResult).toMatchObject({
      operationId: pendingBeforeReload.operationId,
      imagingTechnicianId: techBeforeReload.id,
      dueTick: pendingBeforeReload.dueTick,
    });
    expect(state.employees.find((employee) => employee.id === techBeforeReload.id))
      .toMatchObject({
        path: techBeforeReload.path,
        pathIndex: techBeforeReload.pathIndex,
        facilityTask: { kind: "perform_imaging", targetId: pendingBeforeReload.operationId },
      });
    expect(pendingBeforeReload.dueTick).toBeGreaterThanOrEqual(dueBeforeAck);
    state = advance(
      state,
      pendingBeforeReload.dueTick - state.facilityTick + 1,
      "actual-ultrasound.finish",
    );
    expect(state.encounters[beforeAck.id]!.pendingResult?.deliveredAtTick)
      .not.toBeNull();
    expect(state.encounters[beforeAck.id]!.deliveredResultNarratives).toHaveLength(1);
    expect(state.cashCents).toBeLessThanOrEqual(cashBeforeReload);
    const cashAfterCompletion = state.cashCents;
    const completedReload = deserializeGameState(serializeGameState(state));
    expect(completedReload.encounters[beforeAck.id]!.deliveredResultNarratives)
      .toHaveLength(1);
    expect(completedReload.cashCents).toBe(cashAfterCompletion);
  });

  it("round-trips an existing control room and frozen imaging reservation unchanged", () => {
    let state = stateAt(1);
    state = gameReducer(state, {
      type: "ADMIT_PATIENT",
      operationId: "legacy.pending.admit",
      encounterId: "pending",
      caseId: PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases[0]!.id,
      patientDisplayName: "Legacy Pending Patient",
      arrivalClass: "routine",
    });
    state.rooms.push({ id: "legacy.control", roomDefinitionId: "room.imaging_control", x: 10, y: 10, orientation: 0, doorSide: null, upgradeLevel: 2, cleanliness: 100 });
    state.encounters.pending!.pendingResult = {
        operationId: "result.pending", gateId: "gate", originatingNodeIndex: 0,
        resultTypeId: "service.ultrasound", pendingLabel: "Pending", resultNarrative: "Frozen.",
        routeId: "route.ultrasound.in_house", routeDisplayName: "Onsite", scheduledAtTick: 0,
        serviceDurationTicks: 75, durationTicks: 75, dueTick: 75, deliveredAtTick: null,
        offsiteReturnStartedAtTick: null, offsiteTravel: null, patientTravel: null,
        timingPhases: [{ id: "phase.ultrasound.acquisition", durationTicks: 45, resourceBound: true, startsAtTick: 0, endsAtTick: 45 }],
        resourceReservations: [{ roomDefinitionId: "room.ultrasound", staffRoleDefinitionId: "staff.imaging_technician" }],
        providerReservation: null,
    };
    const restored = deserializeGameState(serializeGameState(state));
    expect(restored.rooms.some((room) => room.id === "legacy.control")).toBe(true);
    expect(restored.encounters.pending?.pendingResult).toMatchObject({
      routeId: "route.ultrasound.in_house", imagingTechnicianId: null, dueTick: 75,
    });
  });
});
