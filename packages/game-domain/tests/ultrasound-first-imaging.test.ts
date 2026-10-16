import {
  PROTOTYPE_DOMAIN_CONTEXT,
  TUTORIAL_ENCOUNTER_ID,
  createInitialGameState,
  deserializeGameState,
  gameReducer,
  getEligibleServiceRoute,
  getEncounterPatientLocation,
  getCurrentQuestion,
  getRoomCareAnchor,
  getFacilityProgressionStatus,
  getPendingResultEta,
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
    { id: "room.test.exam-hall", roomDefinitionId: "room.hallway", x: 33, y: 27, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
  );
  state.doors.push(
    { id: "door.test.ultrasound", roomId: "room.test.ultrasound", side: "south", offset: 2, exterior: false },
    { id: "door.test.ultrasound.staff", roomId: "room.test.ultrasound", side: "west", offset: 1, exterior: false },
    { id: "door.test.exam", roomId: "room.test.exam", side: "west", offset: 1, exterior: false },
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

function withReachableCt(state: GameState): GameState {
  state.rooms.push({
    id: "room.test.ct", roomDefinitionId: "room.ct", x: 28, y: 23,
    orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100,
  });
  state.doors.push({
    id: "door.test.ct", roomId: "room.test.ct", side: "east", offset: 1,
    exterior: false,
  });
  return state;
}

function withReachablePhlebotomy(state: GameState): GameState {
  state.rooms.push({
    id: "room.test.phlebotomy", roomDefinitionId: "room.phlebotomy", x: 29, y: 26,
    orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100,
  });
  state.doors.push({
    id: "door.test.phlebotomy", roomId: "room.test.phlebotomy", side: "east", offset: 1,
    exterior: false,
  });
  state.employees.push({
    id: "employee.test.phlebotomist", staffRoleDefinitionId: "staff.phlebotomist",
    displayName: "Phlebotomist", appearance: state.founder.appearance,
    hiredAtFacilityTick: state.facilityTick, salaryPerExpenseInterval: 20,
    morale: 75, trainingLevel: 1, homeRoomInstanceId: "room.test.phlebotomy",
    location: { x: 31, y: 27 }, path: [{ x: 31, y: 27 }], pathIndex: 0,
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
  caseId?: string,
): GameState {
  const selected = context.clinicalRelease.cases
    .flatMap((candidate) =>
      candidate.decisionNodes.map((node, nodeIndex) => ({ candidate, node, nodeIndex })),
    )
    .find(({ candidate, node }) =>
      node.resultGateAfter?.resultTypeId === serviceId &&
      (caseId === undefined || candidate.id === caseId),
    );
  expect(selected, `current ${serviceId} case`).toBeDefined();
  const admitted = gameReducer(state, {
    type: "ADMIT_PATIENT", operationId: `${encounterId}.admit`, encounterId,
    caseId: selected!.candidate.id, patientDisplayName: `${serviceId} Patient`,
    arrivalClass: "routine",
  }, context);
  const encounter = admitted.encounters[encounterId]!;
  // These assertions exercise a saved, markerless question contract. A prior
  // distractor wording keeps it outside the exact current-release opt-in guard.
  // Current facility-dependent orders have their own diagnostic-orders suite.
  for (const node of encounter.frozenCase.decisionNodes) {
    const alternative = node.answerChoices.find((choice) => !choice.isCorrect);
    if (alternative) alternative.label += " [frozen prior wording]";
  }
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
  it("queues a new onsite ultrasound without a result clock until its busy technician is free", () => {
    let state = withOrdinaryDoorUltrasound(stateAt(2));
    state.employees[0]!.facilityTask = {
      kind: "perform_imaging",
      targetId: "busy-existing-service",
      startedAtFacilityTick: state.facilityTick,
      workMinutesRemaining: Number.MAX_SAFE_INTEGER,
    };
    state = admitQuestionAtCare(state, "queued-ultrasound", "service.ultrasound");
    const decisionNodeId = getCurrentQuestion(state, "queued-ultrasound")!.node.id;
    state = submitCorrect(state, "queued-ultrasound", "order");
    let encounter = state.encounters["queued-ultrasound"]!;
    expect(encounter.pendingResult).toMatchObject({
      routeId: "route.ultrasound.in_house",
      resourceQueue: {
        version: "onsite-resource-queue.v1",
        status: "waiting_for_resources",
      },
      durationTicks: 0,
      patientTravel: null,
      imagingTechnicianId: null,
    });
    expect(getPendingResultEta(state, encounter.id)).toBeNull();
    state = gameReducer(state, {
      type: "ACKNOWLEDGE_DECISION_FEEDBACK",
      operationId: "queued-ultrasound.ack",
      encounterId: encounter.id,
      decisionNodeId,
    });
    expect(state.encounters[encounter.id]!.waitingDestination).not.toBeNull();
    state = deserializeGameState(serializeGameState(state));
    encounter = state.encounters[encounter.id]!;
    expect(encounter.pendingResult?.resourceQueue?.routeId).toBe("route.ultrasound.in_house");
    expect(encounter.pendingResult?.durationTicks).toBe(0);
    expect(getPendingResultEta(state, encounter.id)).toBeNull();
    state.employees[0]!.facilityTask = null;
    for (let index = 0; index < 80 && state.encounters[encounter.id]!.pendingResult?.resourceQueue; index += 1) {
      state = advance(state, 1, `queued-ultrasound.release.${index}`);
    }
    const dispatched = state.encounters[encounter.id]!.pendingResult!;
    expect(dispatched.resourceQueue).toBeUndefined();
    expect(dispatched.routeId).toBe("route.ultrasound.in_house");
    expect(dispatched.imagingTechnicianId).toBe("employee.test.imaging");
    expect(dispatched.serviceDurationTicks).toBe(75);
    expect(dispatched.dueTick).toBeGreaterThan(state.facilityTick);
    expect(state.employees[0]!.facilityTask).toMatchObject({ kind: "perform_imaging" });
  });

  it("queues behind an occupied ultrasound room even when another imaging technician is free", () => {
    let state = withOrdinaryDoorUltrasound(stateAt(2));
    state.employees.push({ ...state.employees[0]!, id: "employee.test.imaging.second" });
    state = admitQuestionAtCare(state, "occupying-ultrasound", "service.ultrasound");
    state = submitCorrect(state, "occupying-ultrasound", "order");
    expect(state.encounters["occupying-ultrasound"]!.pendingResult?.resourceQueue).toBeUndefined();
    state = admitQuestionAtCare(state, "queued-for-room", "service.ultrasound");
    state = submitCorrect(state, "queued-for-room", "order");
    expect(state.encounters["queued-for-room"]!.pendingResult).toMatchObject({
      routeId: "route.ultrasound.in_house",
      resourceQueue: { status: "waiting_for_resources" },
      imagingTechnicianId: null,
    });
  });

  it("keeps an onsite phlebotomy order queued while the installed phlebotomist is busy", () => {
    let state = withReachablePhlebotomy(withOrdinaryDoorUltrasound(stateAt(2)));
    state = gameReducer(state, {
      type: "START_SERVICE_OPERATION",
      operationId: "busy-collection.start",
      incomeLineId: "income.collection",
      actorKind: "visitor",
    });
    for (let index = 0; index < 80 && state.serviceOperations[0]?.status !== "in_service"; index += 1) {
      state = advance(state, 1, `busy-collection.arrival.${index}`);
    }
    expect(state.serviceOperations[0]?.status).toBe("in_service");
    state.serviceOperations[0]!.phaseEndsAtFacilityTick = state.facilityTick + 120;
    state = admitQuestionAtCare(state, "queued-labs", "service.basic_labs");
    const decisionNodeId = getCurrentQuestion(state, "queued-labs")!.node.id;
    state = submitCorrect(state, "queued-labs", "order");
    expect(state.encounters["queued-labs"]!.pendingResult).toMatchObject({
      routeId: "route.basic_labs.phlebotomy_sendout",
      resourceQueue: { status: "waiting_for_resources" },
      patientTravel: null,
    });
    expect(getPendingResultEta(state, "queued-labs")).toBeNull();
    state = gameReducer(state, {
      type: "ACKNOWLEDGE_DECISION_FEEDBACK",
      operationId: "queued-labs.ack",
      encounterId: "queued-labs",
      decisionNodeId,
    });
    state = advance(state, 90, "queued-labs.busy");
    expect(state.encounters["queued-labs"]!.pendingResult).toMatchObject({
      resourceQueue: { status: "waiting_for_resources" },
      offsiteTravel: null,
      deliveredAtTick: null,
    });
    expect(state.serviceIncomeReceipts).toEqual([]);
    state.serviceOperations[0]!.phaseEndsAtFacilityTick = state.facilityTick;
    state = advance(state, 1, "busy-collection.complete");
    for (let index = 0; index < 80 && state.encounters["queued-labs"]!.pendingResult?.resourceQueue; index += 1) {
      state = advance(state, 1, `queued-labs.release.${index}`);
    }
    expect(state.encounters["queued-labs"]!.pendingResult).toMatchObject({
      routeId: "route.basic_labs.phlebotomy_sendout",
      patientTravel: { destinationRoomInstanceId: "room.test.phlebotomy" },
      phlebotomyArrivalGatedVersion: 1,
      phlebotomistId: "employee.test.phlebotomist",
    });
    expect(state.encounters["queued-labs"]!.pendingResult?.resourceQueue).toBeUndefined();
    expect(state.employees.find((employee) => employee.id === "employee.test.phlebotomist")?.facilityTask).toMatchObject({
      kind: "perform_service",
      targetId: state.encounters["queued-labs"]!.pendingResult!.operationId,
    });
  });

  it("routes both actors to phlebotomy care seats, preserves the full collection phase on reload, and releases staff for external processing", () => {
    let state = withReachablePhlebotomy(withOrdinaryDoorUltrasound(stateAt(2)));
    state = admitQuestionAtCare(state, "labs-arrival-gated", "service.basic_labs");
    const decisionNodeId = getCurrentQuestion(state, "labs-arrival-gated")!.node.id;
    state = submitCorrect(state, "labs-arrival-gated", "order");
    let pending = state.encounters["labs-arrival-gated"]!.pendingResult!;
    const room = state.rooms.find((candidate) => candidate.id === "room.test.phlebotomy")!;
    const definition = PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility.roomDefinitions.find(
      (candidate) => candidate.id === "room.phlebotomy",
    )!;
    expect(pending).toMatchObject({
      routeId: "route.basic_labs.phlebotomy_sendout",
      phlebotomyArrivalGatedVersion: 1,
      phlebotomistId: "employee.test.phlebotomist",
    });
    const employee = state.employees.find((candidate) => candidate.id === pending.phlebotomistId)!;
    expect(employee.path.at(-1)).toEqual(getRoomCareAnchor(room, definition, "clinician"));
    expect(employee.facilityTask).toMatchObject({ kind: "perform_service", targetId: pending.operationId });
    state = gameReducer(state, {
      type: "ACKNOWLEDGE_DECISION_FEEDBACK",
      operationId: "labs-arrival-gated.ack",
      encounterId: "labs-arrival-gated",
      decisionNodeId,
    });
    pending = state.encounters["labs-arrival-gated"]!.pendingResult!;
    expect(pending.patientTravel?.outboundPath.at(-1)).toEqual(getRoomCareAnchor(room, definition, "patient"));
    const collection = pending.timingPhases!.find((phase) => phase.resourceBound)!;
    expect(collection.endsAtTick - collection.startsAtTick).toBe(15);
    expect(collection.startsAtTick).toBeGreaterThanOrEqual(pending.patientTravel!.outboundArrivalTick);

    const frozenTiming = JSON.parse(JSON.stringify(pending.timingPhases));
    state = deserializeGameState(serializeGameState(state));
    pending = state.encounters["labs-arrival-gated"]!.pendingResult!;
    expect(pending.timingPhases).toEqual(frozenTiming);
    expect(state.employees.find((candidate) => candidate.id === pending.phlebotomistId)?.facilityTask).toMatchObject({
      kind: "perform_service", targetId: pending.operationId,
    });
    const activeUntil = pending.timingPhases!.find((phase) => phase.resourceBound)!.endsAtTick;
    state = advance(state, Math.max(0, activeUntil - state.facilityTick - 1), "labs-arrival-gated.collection");
    expect(state.employees.find((candidate) => candidate.id === pending.phlebotomistId)?.facilityTask).toMatchObject({ kind: "perform_service" });
    state = advance(state, 1, "labs-arrival-gated.collection-complete");
    expect(state.employees.find((candidate) => candidate.id === pending.phlebotomistId)?.facilityTask).toBeNull();
    expect(state.encounters["labs-arrival-gated"]!.pendingResult?.deliveredAtTick).toBeNull();

    state = admitQuestionAtCare(state, "labs-during-sendout", "service.basic_labs");
    state = submitCorrect(state, "labs-during-sendout", "order");
    expect(state.encounters["labs-during-sendout"]!.pendingResult).toMatchObject({
      phlebotomistId: "employee.test.phlebotomist",
      phlebotomyArrivalGatedVersion: 1,
    });
    expect(state.encounters["labs-during-sendout"]!.pendingResult?.resourceQueue).toBeUndefined();
  });

  it("preserves an arrival-gated lab result when its saved phlebotomist is missing", () => {
    let state = withReachablePhlebotomy(withOrdinaryDoorUltrasound(stateAt(2)));
    state = admitQuestionAtCare(state, "labs-missing-staff", "service.basic_labs");
    state = submitCorrect(state, "labs-missing-staff", "order");
    const before = state.encounters["labs-missing-staff"]!.pendingResult!;
    const frozenDueTick = before.dueTick;
    const frozenRoute = before.routeId;
    state.employees = state.employees.filter((employee) => employee.id !== before.phlebotomistId);
    const restored = deserializeGameState(serializeGameState(state));
    expect(restored.encounters["labs-missing-staff"]!.pendingResult).toMatchObject({
      routeId: frozenRoute,
      dueTick: frozenDueTick,
      deliveredAtTick: null,
      phlebotomyArrivalGatedVersion: 1,
      phlebotomistId: null,
    });
  });

  it("uses rotated phlebotomy care anchors and preserves markerless frozen lab timing", () => {
    let state = withReachablePhlebotomy(withOrdinaryDoorUltrasound(stateAt(2)));
    const room = state.rooms.find((candidate) => candidate.id === "room.test.phlebotomy")!;
    room.y = 23;
    room.orientation = 270;
    const door = state.doors.find((candidate) => candidate.roomId === room.id)!;
    door.side = "south";
    door.offset = 1;
    state.rooms.push(
      { id: "room.test.rotated-phleb-hall.30", roomDefinitionId: "room.hallway", x: 30, y: 26, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
      { id: "room.test.rotated-phleb-hall.31", roomDefinitionId: "room.hallway", x: 31, y: 26, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
    );
    const definition = PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility.roomDefinitions.find(
      (candidate) => candidate.id === "room.phlebotomy",
    )!;
    const rotatedClinicianAnchor = getRoomCareAnchor(room, definition, "clinician");
    const phlebotomist = state.employees.find((employee) => employee.id === "employee.test.phlebotomist")!;
    phlebotomist.location = rotatedClinicianAnchor;
    phlebotomist.path = [rotatedClinicianAnchor];
    phlebotomist.pathIndex = 0;
    state = admitQuestionAtCare(state, "labs-rotated", "service.basic_labs");
    const decisionNodeId = getCurrentQuestion(state, "labs-rotated")!.node.id;
    state = submitCorrect(state, "labs-rotated", "order");
    let pending = state.encounters["labs-rotated"]!.pendingResult!;
    expect(state.employees.find((employee) => employee.id === pending.phlebotomistId)?.path.at(-1))
      .toEqual(getRoomCareAnchor(room, definition, "clinician"));
    state = gameReducer(state, {
      type: "ACKNOWLEDGE_DECISION_FEEDBACK",
      operationId: "labs-rotated.ack",
      encounterId: "labs-rotated",
      decisionNodeId,
    });
    pending = state.encounters["labs-rotated"]!.pendingResult!;
    expect(pending.patientTravel?.outboundPath.at(-1)).toEqual(getRoomCareAnchor(room, definition, "patient"));
    const frozenDueTick = pending.dueTick;
    const frozenTravel = JSON.parse(JSON.stringify(pending.patientTravel));
    delete pending.phlebotomyArrivalGatedVersion;
    delete pending.phlebotomistId;
    const restored = deserializeGameState(serializeGameState(state));
    expect(restored.encounters["labs-rotated"]!.pendingResult).toMatchObject({ dueTick: frozenDueTick });
    expect(restored.encounters["labs-rotated"]!.pendingResult?.patientTravel).toEqual(frozenTravel);
    expect(restored.encounters["labs-rotated"]!.pendingResult?.phlebotomyArrivalGatedVersion).toBeUndefined();
    expect(restored.encounters["labs-rotated"]!.pendingResult?.phlebotomistId).toBeNull();
  });

  it("keeps exact phlebotomist assignments distinct across service operations and pending lab collection", () => {
    let state = withReachablePhlebotomy(withOrdinaryDoorUltrasound(stateAt(2)));
    state.rooms.push({
      id: "room.test.phlebotomy.second",
      roomDefinitionId: "room.phlebotomy",
      x: 29,
      y: 22,
      orientation: 0,
      doorSide: null,
      upgradeLevel: 1,
      cleanliness: 100,
    });
    state.doors.push({
      id: "door.test.phlebotomy.second",
      roomId: "room.test.phlebotomy.second",
      side: "south",
      offset: 1,
      exterior: false,
    });
    state.rooms.push(
      { id: "room.test.second-phleb-hall.30", roomDefinitionId: "room.hallway", x: 30, y: 24, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
      { id: "room.test.second-phleb-hall.31", roomDefinitionId: "room.hallway", x: 31, y: 24, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
    );
    state.employees.push({
      ...state.employees.find((employee) => employee.id === "employee.test.phlebotomist")!,
      id: "employee.test.phlebotomist.second",
      homeRoomInstanceId: "room.test.phlebotomy.second",
      location: { x: 30, y: 23 },
      path: [{ x: 30, y: 23 }],
    });
    state = gameReducer(state, {
      type: "START_SERVICE_OPERATION",
      operationId: "parallel-collection.start",
      incomeLineId: "income.collection",
      actorKind: "visitor",
    });
    for (let index = 0; index < 80 && state.serviceOperations[0]?.status !== "in_service"; index += 1) {
      state = advance(state, 1, `parallel-collection.arrival.${index}`);
    }
    expect(state.serviceOperations[0]?.reservedEmployeeIds).toEqual(["employee.test.phlebotomist"]);
    state = admitQuestionAtCare(state, "parallel-labs", "service.basic_labs");
    state = submitCorrect(state, "parallel-labs", "order");
    expect(state.encounters["parallel-labs"]!.pendingResult).toMatchObject({
      phlebotomistId: "employee.test.phlebotomist.second",
      phlebotomyArrivalGatedVersion: 1,
    });
    expect(state.employees.find((employee) => employee.id === "employee.test.phlebotomist")?.facilityTask?.targetId)
      .toBe(state.serviceOperations[0]?.id);
    expect(state.employees.find((employee) => employee.id === "employee.test.phlebotomist.second")?.facilityTask?.targetId)
      .toBe(state.encounters["parallel-labs"]!.pendingResult?.operationId);
  });

  it("permits one shared imaging technician per installed imaging room and rejects a fourth without changing economics", () => {
    let state = withReachableCt(withOrdinaryDoorUltrasound(stateAt(2)));
    state.rooms.push(
      { id: "room.test.xray-capacity", roomDefinitionId: "room.xray", x: 29, y: 27, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
    );
    state.doors.push({
      id: "door.test.xray-capacity", roomId: "room.test.xray-capacity", side: "east", offset: 1,
      exterior: false,
    });
    const startingCash = state.cash;
    for (const employeeId of ["employee.test.imaging.second", "employee.test.imaging.third"] as const) {
      state = gameReducer(state, {
        type: "HIRE_STAFF", operationId: `hire.${employeeId}`, employeeId,
        staffRoleDefinitionId: "staff.imaging_technician",
      });
      expect(state.operationReceipts[`hire.${employeeId}`]?.status).toBe("applied");
    }
    expect(state.employees.filter((employee) => employee.staffRoleDefinitionId === "staff.imaging_technician")).toHaveLength(3);
    expect(state.cash).toBe(startingCash - 600);
    state = gameReducer(state, {
      type: "HIRE_STAFF", operationId: "hire.employee.test.imaging.fourth",
      employeeId: "employee.test.imaging.fourth", staffRoleDefinitionId: "staff.imaging_technician",
    });
    expect(state.operationReceipts["hire.employee.test.imaging.fourth"]?.status).toBe("rejected");
    expect(state.cash).toBe(startingCash - 600);
  });

  it("uses the staffed reachable CT route for every frozen colon-staging gate", () => {
    const state = withReachableCt(withOrdinaryDoorUltrasound(stateAt(2)));
    const colonCases = PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.filter(
      (clinicalCase) => clinicalCase.id.startsWith("case.colon-cancer."),
    );
    expect(colonCases).toHaveLength(4);
    for (const clinicalCase of colonCases) {
      const gate = clinicalCase.decisionNodes[0]!.resultGateAfter!;
      expect(getEligibleServiceRoute(
        state, gate.resultTypeId, gate.allowedServiceRouteIds,
      )).toMatchObject({ route: { id: "route.ct.in_house" } });
    }
  });

  it("uses separate shared technicians for simultaneous ultrasound and CT, while one busy technician falls back offsite", () => {
    let state = withReachableCt(withOrdinaryDoorUltrasound(stateAt(2)));
    state.employees.push({ ...state.employees[0]!, id: "employee.test.imaging.second" });
    state = admitQuestionAtCare(state, "parallel-ultrasound", "service.ultrasound");
    state = submitCorrect(state, "parallel-ultrasound", "order");
    state = admitQuestionAtCare(
      state, "parallel-ct", "service.ct", PROTOTYPE_DOMAIN_CONTEXT,
      "case.colon-cancer.right-colon-referral",
    );
    state = submitCorrect(state, "parallel-ct", "order");
    const ultrasoundPending = state.encounters["parallel-ultrasound"]!.pendingResult!;
    const ctPending = state.encounters["parallel-ct"]!.pendingResult!;
    expect(ultrasoundPending.routeId).toBe("route.ultrasound.in_house");
    expect(ctPending.routeId).toBe("route.ct.in_house");
    expect([ultrasoundPending.imagingTechnicianId, ctPending.imagingTechnicianId].sort())
      .toEqual(["employee.test.imaging", "employee.test.imaging.second"]);

    const oneTechnician = withReachableCt(withOrdinaryDoorUltrasound(stateAt(2)));
    oneTechnician.employees[0]!.facilityTask = {
      kind: "perform_imaging", targetId: "busy.ultrasound", startedAtFacilityTick: 0,
      workMinutesRemaining: Number.MAX_SAFE_INTEGER,
    };
    const colonGate = PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.find(
      (clinicalCase) => clinicalCase.id === "case.colon-cancer.right-colon-referral",
    )!.decisionNodes[0]!.resultGateAfter!;
    expect(getEligibleServiceRoute(
      oneTechnician, colonGate.resultTypeId, colonGate.allowedServiceRouteIds,
    )).toMatchObject({ route: { id: "route.ct.outsourced" } });
  });

  it("falls back offsite when the CT suite is missing or disconnected and preserves an already-offsite order", () => {
    const colonGate = PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.find(
      (clinicalCase) => clinicalCase.id === "case.colon-cancer.right-colon-referral",
    )!.decisionNodes[0]!.resultGateAfter!;
    const missing = withOrdinaryDoorUltrasound(stateAt(2));
    expect(getEligibleServiceRoute(missing, colonGate.resultTypeId, colonGate.allowedServiceRouteIds))
      .toMatchObject({ route: { id: "route.ct.outsourced" } });
    const disconnected = withReachableCt(withOrdinaryDoorUltrasound(stateAt(2)));
    disconnected.doors = disconnected.doors.filter((door) => door.id !== "door.test.ct");
    expect(getEligibleServiceRoute(disconnected, colonGate.resultTypeId, colonGate.allowedServiceRouteIds))
      .toMatchObject({ route: { id: "route.ct.outsourced" } });

    let pending = admitQuestionAtCare(
      missing, "frozen-offsite-ct", "service.ct", PROTOTYPE_DOMAIN_CONTEXT,
      "case.colon-cancer.right-colon-referral",
    );
    pending = submitCorrect(pending, "frozen-offsite-ct", "order");
    const encounter = pending.encounters["frozen-offsite-ct"]!;
    expect(encounter.pendingResult?.routeId).toBe("route.ct.outsourced");
    const frozenDueTick = encounter.pendingResult!.dueTick;
    pending = withReachableCt(pending);
    const restored = deserializeGameState(serializeGameState(pending));
    expect(restored.encounters[encounter.id]!.pendingResult).toMatchObject({
      routeId: "route.ct.outsourced", routeDisplayName: "Off-site CT",
      dueTick: frozenDueTick,
    });
  });

  it("sends a colon-staging patient and ultrasound-home technician to CT, then preserves the frozen trip on reload", () => {
    let state = admitQuestionAtCare(
      withReachableCt(withOrdinaryDoorUltrasound(stateAt(2))),
      "colon-ct", "service.ct", PROTOTYPE_DOMAIN_CONTEXT,
      "case.colon-cancer.right-colon-referral",
    );
    state = submitCorrect(state, "colon-ct", "order");
    const encounter = state.encounters["colon-ct"]!;
    expect(encounter.pendingResult).toMatchObject({
      routeId: "route.ct.in_house",
      pendingLabel: "CT scan and interpretation pending",
      imagingTechnicianId: "employee.test.imaging",
      patientTravel: expect.objectContaining({ destinationRoomInstanceId: "room.test.ct" }),
    });
    state = gameReducer(state, {
      type: "ACKNOWLEDGE_DECISION_FEEDBACK", operationId: "colon-ct.ack",
      encounterId: encounter.id,
      decisionNodeId: encounter.steps[encounter.currentNodeIndex]!.decisionNodeId,
    });
    state = advance(state, 1, "colon-ct.walk");
    const pending = state.encounters[encounter.id]!.pendingResult!;
    const frozenDueTick = pending.dueTick;
    const technician = state.employees.find((employee) => employee.id === pending.imagingTechnicianId)!;
    expect(technician.facilityTask).toMatchObject({ kind: "perform_imaging", targetId: pending.operationId });
    expect(technician.path.at(-1)).toEqual({ x: 31, y: 25 });
    const restored = deserializeGameState(serializeGameState(state));
    expect(restored.encounters[encounter.id]!.pendingResult).toMatchObject({
      routeId: "route.ct.in_house", patientTravel: pending.patientTravel,
      imagingTechnicianId: technician.id, dueTick: frozenDueTick,
    });
    expect(restored.employees.find((employee) => employee.id === technician.id)).toMatchObject({
      path: technician.path, pathIndex: technician.pathIndex,
      facilityTask: { kind: "perform_imaging", targetId: pending.operationId },
    });
    state = advance(restored, technician.path.length, "colon-ct.arrive");
    const arrivedTechnician = state.employees.find((employee) => employee.id === technician.id)!;
    expect(arrivedTechnician.location).toEqual(technician.path.at(-1));
    const ctRoom = state.rooms.find((room) => room.id === "room.test.ct")!;
    const patientLocation = getEncounterPatientLocation(state, encounter.id)!;
    expect(patientLocation.x).toBeGreaterThanOrEqual(ctRoom.x);
    expect(patientLocation.x).toBeLessThan(ctRoom.x + 4);
    expect(patientLocation.y).toBeGreaterThanOrEqual(ctRoom.y);
    expect(patientLocation.y).toBeLessThan(ctRoom.y + 4);
    expect(state.encounters[encounter.id]!.pendingResult?.deliveredAtTick).toBeNull();
    state = advance(
      state,
      frozenDueTick - state.facilityTick + 1,
      "colon-ct.complete",
    );
    expect(state.encounters[encounter.id]!.pendingResult?.deliveredAtTick).not.toBeNull();
    expect(state.encounters[encounter.id]!.deliveredResultNarratives).toHaveLength(1);
    const completedReload = deserializeGameState(serializeGameState(state));
    expect(completedReload.encounters[encounter.id]!.deliveredResultNarratives).toHaveLength(1);
  });

  it("keeps unrelated outsourced services gated while allowing CT staff to walk from ultrasound", () => {
    const state = withReachableCt(withOrdinaryDoorUltrasound(stateAt(2)));
    const pseudocyst = PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.find(
      (clinicalCase) => clinicalCase.id === "case.pancreatic-pseudocyst.early-satiety",
    )!;
    const ctGate = pseudocyst.decisionNodes[0]!.resultGateAfter!;
    expect(getEligibleServiceRoute(state, ctGate.resultTypeId, ctGate.allowedServiceRouteIds))
      .toMatchObject({ route: { id: "route.ct.in_house" } });
    expect(getEligibleServiceRoute(
      state, "service.colonoscopy", ["route.colonoscopy.outsourced"],
    )).toMatchObject({ route: { id: "route.colonoscopy.outsourced" } });
  });

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
    const travelingTechnician = state.employees.find(
      (employee) => employee.id === "employee.test.imaging",
    )!;
    travelingTechnician.location = { x: 32, y: 26 };
    travelingTechnician.path = [{ x: 32, y: 26 }];
    travelingTechnician.pathIndex = 0;
    state = submitCorrect(state, "actual-ultrasound", "order");
    const beforeAck = state.encounters["actual-ultrasound"]!;
    expect(beforeAck.pendingResult).toMatchObject({
      routeId: "route.ultrasound.in_house",
      imagingTechnicianId: "employee.test.imaging",
      serviceIncomeEligible: true,
      serviceIncomeLineId: "income.ultrasound",
      serviceIncomeFee: 120,
      deliveredAtTick: null,
    });
    const dueBeforeAck = beforeAck.pendingResult!.dueTick;
    const step = beforeAck.steps[beforeAck.currentNodeIndex]!;
    expect(state.serviceIncomeReceipts).toEqual([]);
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
    expect(state.cashCents).toBeLessThanOrEqual(cashBeforeReload + 12_000);
    expect(
      state.serviceIncomeReceipts.filter(
        (receipt) =>
          receipt.incomeLineId === "income.ultrasound" &&
          receipt.actorId === beforeAck.id,
      ),
    ).toEqual([
      expect.objectContaining({
        routeId: "route.ultrasound.in_house",
        grossAmount: 120,
        netCashDelta: 120,
      }),
    ]);
    const cashAfterCompletion = state.cashCents;
    const completedReload = deserializeGameState(serializeGameState(state));
    expect(completedReload.encounters[beforeAck.id]!.deliveredResultNarratives)
      .toHaveLength(1);
    expect(completedReload.cashCents).toBe(cashAfterCompletion);
    expect(completedReload.serviceIncomeReceipts).toEqual(state.serviceIncomeReceipts);
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
