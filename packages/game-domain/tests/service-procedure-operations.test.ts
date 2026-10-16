import { describe, expect, it } from "vitest";
import {
  PROTOTYPE_DOMAIN_CONTEXT,
  advanceServiceOperations,
  createInitialGameState,
  deserializeGameState,
  encounterHasActiveServiceOperation,
  findDeterministicRoomPath,
  gameReducer,
  getCurrentQuestion,
  getCurrentCapabilities,
  getAnswerChoiceServicePreview,
  getEncounterPatientLocation,
  getEligibleServiceRoute,
  getPatientLists,
  getPendingPatientLocation,
  getPendingPatientRoutePresentation,
  getRoomDefinition,
  getRoomSalePreview,
  getRoomNavigationAnchor,
  isRoomOperationalForFacilityWork,
  serializeGameState,
  startEncounterProcedureOperation,
  startServiceOperation,
  type GameState,
} from "../src";

let sequence = 0;

function minorProcedureState(): GameState {
  const state = createInitialGameState(undefined, {
    campaignId: `campaign.procedure-income.${sequence++}`,
    campaignSeed: "procedure-income",
    createdAtRealMs: 0,
  });
  state.facilityLevel = 1;
  state.serviceAppointmentsEnabled = false;
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  state.nextFinancialPostingTick = Number.MAX_SAFE_INTEGER;
  state.environment.nextLitterSpawnTick = Number.MAX_SAFE_INTEGER;
  state.environment.nextWaterCoolerDrainTick = Number.MAX_SAFE_INTEGER;
  state.environment.founderActivity = null;
  state.encounters = {};
  state.rooms.push(
    { id: "room.test.exam", roomDefinitionId: "room.examination", x: 29, y: 23, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
    { id: "room.test.minor", roomDefinitionId: "room.minor_procedure", x: 33, y: 23, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
    ...([24, 25, 26, 27, 28] as const).map((y) => ({ id: `room.test.hall.${y}`, roomDefinitionId: "room.hallway", x: 32, y, orientation: 0 as const, doorSide: null, upgradeLevel: 1 as const, cleanliness: 100 })),
  );
  state.doors.push(
    { id: "door.test.minor", roomId: "room.test.minor", side: "west", offset: 1, exterior: false },
    { id: "door.test.exam", roomId: "room.test.exam", side: "east", offset: 1, exterior: false },
    { id: "door.test.front", roomId: "room.instance.founder_desk", side: "west", offset: 0, exterior: false },
  );
  return state;
}

function ultrasoundProcedureState(): GameState {
  const state = createInitialGameState(undefined, {
    campaignId: `campaign.ultrasound-procedure.${sequence++}`,
    campaignSeed: "ultrasound-procedure",
    createdAtRealMs: 0,
  });
  state.facilityLevel = 1;
  state.serviceAppointmentsEnabled = false;
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  state.nextFinancialPostingTick = Number.MAX_SAFE_INTEGER;
  state.environment.nextLitterSpawnTick = Number.MAX_SAFE_INTEGER;
  state.environment.nextWaterCoolerDrainTick = Number.MAX_SAFE_INTEGER;
  state.environment.founderActivity = null;
  state.encounters = {};
  state.rooms.push(
    { id: "room.test.exam", roomDefinitionId: "room.examination", x: 34, y: 26, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
    { id: "room.test.ultrasound", roomDefinitionId: "room.ultrasound", x: 33, y: 23, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
    { id: "room.test.exam-hall", roomDefinitionId: "room.hallway", x: 33, y: 27, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
    ...([24, 25, 26, 27, 28] as const).map((y) => ({ id: `room.test.us-hall.${y}`, roomDefinitionId: "room.hallway", x: 32, y, orientation: 0 as const, doorSide: null, upgradeLevel: 1 as const, cleanliness: 100 })),
  );
  state.doors.push(
    { id: "door.test.ultrasound", roomId: "room.test.ultrasound", side: "south", offset: 2, exterior: false },
    { id: "door.test.ultrasound.staff", roomId: "room.test.ultrasound", side: "west", offset: 1, exterior: false },
    { id: "door.test.exam", roomId: "room.test.exam", side: "west", offset: 1, exterior: false },
    { id: "door.test.front", roomId: "room.instance.founder_desk", side: "west", offset: 0, exterior: false },
  );
  const ultrasound = state.rooms.find((room) => room.id === "room.test.ultrasound")!;
  const ultrasoundStaffAnchor = getRoomNavigationAnchor(
    ultrasound,
    getRoomDefinition(ultrasound.roomDefinitionId)!,
    "staff",
  );
  state.employees.push({
    id: "employee.test.imaging", staffRoleDefinitionId: "staff.imaging_technician",
    displayName: "Ultrasound Technician", appearance: state.founder.appearance,
    hiredAtFacilityTick: state.facilityTick, salaryPerExpenseInterval: 26,
    morale: 75, trainingLevel: 1, homeRoomInstanceId: "room.test.ultrasound",
    location: ultrasoundStaffAnchor, path: [{ ...ultrasoundStaffAnchor }], pathIndex: 0,
    lastMovedAtFacilityTick: state.facilityTick, lastPraisedAtFacilityTick: null,
    nextIdleActionAtFacilityTick: Number.MAX_SAFE_INTEGER, facilityTask: null,
  });
  return state;
}

function phlebotomyProcedureState(): GameState {
  const state = ultrasoundProcedureState();
  state.facilityLevel = 2;
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
    nextIdleActionAtFacilityTick: Number.MAX_SAFE_INTEGER, facilityTask: null,
  });
  return state;
}

function ctProcedureState(): GameState {
  const state = ultrasoundProcedureState();
  state.facilityLevel = 2;
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

function xrayProcedureState(): GameState {
  const state = ultrasoundProcedureState();
  state.facilityLevel = 2;
  state.rooms.push({
    id: "room.test.xray", roomDefinitionId: "room.xray", x: 29, y: 23,
    orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100,
  });
  state.doors.push({
    id: "door.test.xray", roomId: "room.test.xray", side: "east", offset: 1,
    exterior: false,
  });
  return state;
}

function endoscopyProcedureState(): GameState {
  const state = createInitialGameState(undefined, {
    campaignId: `campaign.endoscopy-procedure.${sequence++}`,
    campaignSeed: "endoscopy-procedure",
    createdAtRealMs: 0,
  });
  state.facilityLevel = 2;
  state.serviceAppointmentsEnabled = false;
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  state.nextFinancialPostingTick = Number.MAX_SAFE_INTEGER;
  state.environment.nextLitterSpawnTick = Number.MAX_SAFE_INTEGER;
  state.environment.nextWaterCoolerDrainTick = Number.MAX_SAFE_INTEGER;
  state.environment.founderActivity = null;
  state.encounters = {};
  state.rooms.push(
    { id: "room.test.exam", roomDefinitionId: "room.examination", x: 33, y: 25, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
    { id: "room.test.endoscopy", roomDefinitionId: "room.endoscopy", x: 28, y: 23, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
    { id: "room.test.periop", roomDefinitionId: "room.periop_recovery", x: 26, y: 26, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
    ...[24, 25, 26, 27, 28].map((y) => ({ id: `room.test.scope-hall.${y}`, roomDefinitionId: "room.hallway", x: 32, y, orientation: 0 as const, doorSide: null, upgradeLevel: 1 as const, cleanliness: 100 })),
  );
  state.doors.push(
    { id: "door.test.front", roomId: "room.instance.founder_desk", side: "west", offset: 0, exterior: false },
    { id: "door.test.exam", roomId: "room.test.exam", side: "west", offset: 1, exterior: false },
    { id: "door.test.endoscopy", roomId: "room.test.endoscopy", side: "east", offset: 1, exterior: false },
    { id: "door.test.periop", roomId: "room.test.periop", side: "east", offset: 1, exterior: false },
  );
  const addEmployee = (id: string, role: string, roomId: string, location: { x: number; y: number }) => {
    state.employees.push({
      id,
      staffRoleDefinitionId: role,
      displayName: id,
      appearance: state.founder.appearance,
      hiredAtFacilityTick: 0,
      salaryPerExpenseInterval: 0,
      morale: 100,
      trainingLevel: 1,
      homeRoomInstanceId: roomId,
      location,
      path: [location],
      pathIndex: 0,
      lastMovedAtFacilityTick: 0,
      lastPraisedAtFacilityTick: null,
      nextIdleActionAtFacilityTick: Number.MAX_SAFE_INTEGER,
      facilityTask: null,
    });
  };
  addEmployee("employee.test.endoscopy-nurse", "staff.endoscopy_nurse", "room.test.endoscopy", { x: 29, y: 24 });
  addEmployee("employee.test.periop-nurse", "staff.periop_nurse", "room.test.periop", { x: 29, y: 28 });
  addEmployee("employee.test.endoscopist", "staff.endoscopist", "room.test.endoscopy", { x: 30, y: 24 });
  return state;
}

function prepareQuestion(state: GameState, caseId: string, conceptId: string, markerless = true): GameState {
  let next = gameReducer(state, {
    type: "ADMIT_PATIENT",
    operationId: `procedure.admit.${sequence++}`,
    encounterId: "procedure-patient",
    caseId,
    patientDisplayName: "Procedure Patient",
    arrivalClass: "routine",
  });
  expect(next.operationReceipts[Object.keys(next.operationReceipts).at(-1)!]?.status).toBe("applied");
  const encounter = next.encounters["procedure-patient"]!;
  // These scenarios exercise the saved, markerless operation contract. A
  // previous-version alternative prevents the complete current choice group
  // from opting into diagnostic-order.v1, while the exact correct operational
  // choice remains unchanged. New current-release orders are tested separately
  // in diagnostic-orders.test.ts and diagnostic-service-operations.test.ts.
  for (const node of markerless ? encounter.frozenCase.decisionNodes : []) {
    const alternative = node.answerChoices.find((choice) => !choice.isCorrect);
    if (alternative) alternative.label += " [frozen prior wording]";
  }
  const nodeIndex = encounter.frozenCase.decisionNodes.findIndex((node) => node.primaryConceptId === conceptId);
  expect(nodeIndex).toBeGreaterThanOrEqual(0);
  encounter.currentNodeIndex = nodeIndex;
  encounter.steps.forEach((step, index) => {
    step.status = index < nodeIndex ? "completed" : index === nodeIndex ? "action_required" : "locked";
  });
  const front = next.rooms.find((room) => room.id === "room.instance.founder_desk")!;
  encounter.patientLocation = getRoomNavigationAnchor(front, getRoomDefinition(front.roomDefinitionId)!, "primary");
  encounter.patientMovement = null;
  encounter.lifecycle = "active_action_required";
  next.openChartEncounterId = encounter.id;
  next.attendedEncounterId = encounter.id;
  return next;
}

function placePatientInTestExam(state: GameState): void {
  const encounter = state.encounters["procedure-patient"]!;
  const exam = state.rooms.find((room) => room.id === "room.test.exam")!;
  encounter.assignedRoomInstanceId = exam.id;
  encounter.queuedCareRoomInstanceId = null;
  encounter.patientLocation = getRoomNavigationAnchor(
    exam,
    getRoomDefinition(exam.roomDefinitionId)!,
    "primary",
  );
  encounter.patientMovement = null;
}

function submit(state: GameState, correct: boolean): GameState {
  const question = getCurrentQuestion(state, "procedure-patient")!;
  const choice = question.node.answerChoices.find((candidate) => candidate.isCorrect === correct)!;
  return gameReducer(state, {
    type: "SUBMIT_ANSWER",
    operationId: `procedure.answer.${sequence++}`,
    encounterId: "procedure-patient",
    decisionNodeId: question.node.id,
    answerChoiceId: choice.id,
    reviewedAtMs: 10_000,
  });
}

function acknowledgeDecisionFeedback(state: GameState): GameState {
  const encounter = state.encounters["procedure-patient"]!;
  const decisionNodeId = encounter.frozenCase.decisionNodes[encounter.currentNodeIndex]!.id;
  return gameReducer(state, {
    type: "ACKNOWLEDGE_DECISION_FEEDBACK",
    operationId: `procedure.feedback.${sequence++}`,
    encounterId: "procedure-patient",
    decisionNodeId,
  });
}

function advance(state: GameState, minutes: number): GameState {
  let next = state;
  for (let index = 0; index < minutes; index += 1) {
    next = gameReducer(next, { type: "ADVANCE_TICK", operationId: `procedure.tick.${sequence++}` });
  }
  return next;
}

describe("mapped in-clinic procedure operations", () => {
  it.each([
    ["case.breast-cyst.under-30-painful-simple", "concept.breast-cyst.symptomatic-simple-aspiration", "income.procedure.breast_cyst_aspiration.v2", 150, 15],
    ["case.bread-butter.cutaneous-abscess.forearm-redness", "concept.cutaneous-abscess.incision-drainage", "income.procedure.cutaneous_abscess_drainage.v2", 100, 15],
    ["case.bread-butter.superficial-incisional-ssi.purulent-staple-line", "concept.superficial-incisional-ssi.open-drain", "income.procedure.superficial_incisional_infection_drainage.v2", 200, 15],
    ["case.bread-butter.perianal-abscess.tender-perianal-lump", "concept.perianal-abscess.prompt-drainage", "income.procedure.perianal_abscess_drainage", 200, 15],
    ["case.internal-hemorrhoids.commute", "concept.internal-hemorrhoids.office-banding-selection", "income.procedure.office_internal_hemorrhoid_banding", 200, 30],
  ])("performs %s only after the exact final correct action", (caseId, conceptId, incomeLineId, fee, workMinutes) => {
    let state = prepareQuestion(minorProcedureState(), caseId, conceptId);
    const cashBefore = state.cash;
    state = submit(state, true);
    expect(state.serviceIncomeReceipts).toEqual([]);
    expect(state.serviceOperations[0]).toMatchObject({ actorKind: "encounter", incomeLineId, status: "waiting_for_resources" });
    expect(state.encounters["procedure-patient"]!.patientMovement).toBeNull();
    const cashAfterAnswer = state.cash;
    expect(cashAfterAnswer).toBeGreaterThanOrEqual(cashBefore);
    for (let minute = 0; minute < 40 && state.serviceOperations[0]?.status !== "in_service"; minute += 1) state = advance(state, 1);
    expect(state.serviceOperations[0]!.phaseEndsAtFacilityTick! - state.serviceOperations[0]!.phaseStartedAtFacilityTick!).toBe(workMinutes);
    state = advance(state, 100);
    expect(state.cash).toBe(cashAfterAnswer + fee);
    expect(state.serviceIncomeReceipts).toHaveLength(1);
    expect(state.serviceIncomeReceipts[0]).toMatchObject({ actorKind: "patient", incomeLineId, grossAmount: fee });
  });

  it.each([
    ["minor", "case.breast-cyst.under-30-painful-simple", "concept.breast-cyst.symptomatic-simple-aspiration", 15],
    ["minor", "case.internal-hemorrhoids.commute", "concept.internal-hemorrhoids.office-banding-selection", 30],
    ["ultrasound", "case.lactational-breast-abscess.tender-upper-breast", "concept.lactational-breast-abscess.selected-drainage", 60],
  ] as const)("keeps a resolved procedure patient onsite through the full work phase, then starts departure", (fixture, caseId, conceptId, workMinutes) => {
    let state = prepareQuestion(
      fixture === "minor" ? minorProcedureState() : ultrasoundProcedureState(),
      caseId,
      conceptId,
    );
    placePatientInTestExam(state);
    let encounter = state.encounters["procedure-patient"]!;
    encounter.checkInStatus = "checked_in";
    encounter.lifecycle = "waiting_unopened";
    state.openChartEncounterId = null;
    state.attendedEncounterId = null;
    state = gameReducer(state, {
      type: "OPEN_CHART",
      operationId: `procedure.terminal-open.${sequence++}`,
      encounterId: encounter.id,
    });
    state = submit(state, true);
    state = gameReducer(state, {
      type: "ACKNOWLEDGE_TERMINAL_FEEDBACK",
      operationId: `procedure.terminal-feedback.${sequence++}`,
      encounterId: encounter.id,
    });
    expect(state.operationReceipts[Object.keys(state.operationReceipts).at(-1)!]?.status).toBe("applied");
    state = gameReducer(state, {
      type: "CLOSE_CHART",
      operationId: `procedure.terminal-close.${sequence++}`,
      encounterId: encounter.id,
    });
    encounter = state.encounters[encounter.id]!;
    expect(encounter.lifecycle).toBe("resolved");
    expect(encounter.patientMovement).toBeNull();
    if (workMinutes === 30) {
      const frozenOperationLocation = { ...state.serviceOperations[0]!.location! };
      encounter.patientMovement = {
        kind: "leaving_after_resolution",
        path: [
          { ...encounter.patientLocation! },
          { x: encounter.patientLocation!.x - 1, y: encounter.patientLocation!.y },
          { x: encounter.patientLocation!.x - 2, y: encounter.patientLocation!.y },
          { x: encounter.patientLocation!.x - 3, y: encounter.patientLocation!.y },
        ],
        pathIndex: 0,
        lastMovedAtFacilityTick: state.facilityTick,
        destinationRoomInstanceId: null,
      };
      state = deserializeGameState(serializeGameState(state));
      state = advance(state, 1);
      expect(state.encounters[encounter.id]!.patientMovement).toBeNull();
      expect(state.encounters[encounter.id]!.patientLocation).toEqual(frozenOperationLocation);
    }

    for (let minute = 0; minute < 80 && state.serviceOperations[0]?.status !== "in_service"; minute += 1) {
      state = advance(state, 1);
    }
    const operation = state.serviceOperations[0]!;
    expect(operation.status).toBe("in_service");
    expect(operation.phaseEndsAtFacilityTick! - operation.phaseStartedAtFacilityTick!).toBe(workMinutes);
    if (fixture === "ultrasound") {
      expect(operation.reservedEmployeeIds).toEqual(["employee.test.imaging"]);
      expect(operation.providerReservation).toBeNull();
      expect(state.environment.founderActivity?.kind).not.toBe("perform_service");
    }
    expect(state.encounters[encounter.id]!.patientMovement).toBeNull();
    expect(getEncounterPatientLocation(state, encounter.id)).toEqual(operation.location);

    state = advance(state, workMinutes - 1);
    expect(state.serviceOperations[0]!.status).toBe("in_service");
    expect(state.encounters[encounter.id]!.patientMovement).toBeNull();
    expect(getEncounterPatientLocation(state, encounter.id)).toEqual(state.serviceOperations[0]!.location);
    state = advance(state, 1);
    expect(state.serviceOperations[0]!.status).toBe("completed");
    expect(state.encounters[encounter.id]!.patientMovement).toMatchObject({
      kind: "leaving_after_resolution",
      pathIndex: 0,
    });
    expect(state.encounters[encounter.id]!.patientMovement!.path[0]).toEqual(operation.location);
    const departurePath = state.encounters[encounter.id]!.patientMovement!.path;
    const firstExteriorIndex = departurePath.findIndex(
      (point) => point.y >= PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility.gridHeight,
    );
    expect(firstExteriorIndex).toBeGreaterThan(0);
    expect(firstExteriorIndex).toBeLessThan(departurePath.length - 1);
    while (
      state.encounters[encounter.id]!.patientMovement &&
      state.encounters[encounter.id]!.patientMovement!.pathIndex < firstExteriorIndex
    ) {
      state = advance(state, 1);
    }
    const exteriorMovement = state.encounters[encounter.id]!.patientMovement!;
    expect(exteriorMovement.pathIndex).toBeGreaterThanOrEqual(firstExteriorIndex);
    expect(exteriorMovement.pathIndex).toBeLessThan(departurePath.length - 1);
    expect(getEncounterPatientLocation(state, encounter.id)).toEqual(
      departurePath[exteriorMovement.pathIndex],
    );
    expect(state.encounters[encounter.id]!.patientLocation).not.toBeNull();
    state = deserializeGameState(serializeGameState(state));
    expect(state.encounters[encounter.id]!.patientMovement).toMatchObject({
      kind: "leaving_after_resolution",
      pathIndex: exteriorMovement.pathIndex,
    });
    for (let minute = 0; minute < 80 && state.encounters[encounter.id]!.patientMovement; minute += 1) {
      state = advance(state, 1);
    }
    expect(state.encounters[encounter.id]!.patientMovement).toBeNull();
    expect(state.encounters[encounter.id]!.patientLocation).toBeNull();
  });

  it("retains a resolved procedure patient at the service room until a blocked exit becomes reachable", () => {
    let state = prepareQuestion(
      minorProcedureState(),
      "case.internal-hemorrhoids.commute",
      "concept.internal-hemorrhoids.office-banding-selection",
    );
    placePatientInTestExam(state);
    const encounterId = "procedure-patient";
    const encounter = state.encounters[encounterId]!;
    encounter.checkInStatus = "checked_in";
    encounter.lifecycle = "waiting_unopened";
    state.openChartEncounterId = null;
    state.attendedEncounterId = null;
    state = gameReducer(state, {
      type: "OPEN_CHART",
      operationId: `procedure.blocked-open.${sequence++}`,
      encounterId,
    });
    state = submit(state, true);
    state = gameReducer(state, {
      type: "ACKNOWLEDGE_TERMINAL_FEEDBACK",
      operationId: `procedure.blocked-feedback.${sequence++}`,
      encounterId,
    });
    state = gameReducer(state, {
      type: "CLOSE_CHART",
      operationId: `procedure.blocked-close.${sequence++}`,
      encounterId,
    });
    for (let minute = 0; minute < 80 && state.serviceOperations[0]?.status !== "in_service"; minute += 1) {
      state = advance(state, 1);
    }
    const operation = state.serviceOperations[0]!;
    state.facilityTick = operation.phaseEndsAtFacilityTick!;
    advanceServiceOperations(
      state,
      PROTOTYPE_DOMAIN_CONTEXT,
      undefined,
      () => [],
    );
    expect(state.serviceOperations[0]).toMatchObject({ status: "leaving" });
    expect(state.encounters[encounterId]!.patientMovement).toBeNull();
    expect(state.encounters[encounterId]!.patientLocation).toEqual(
      state.serviceOperations[0]!.location,
    );
    expect(encounterHasActiveServiceOperation(state, encounterId)).toBe(true);

    state = deserializeGameState(serializeGameState(state));
    const blockedServiceDoor = state.doors.find(
      (door) => door.id === "door.test.minor",
    )!;
    state.doors = state.doors.filter(
      (door) => door.id !== blockedServiceDoor.id,
    );
    state = advance(state, 1);
    expect(state.serviceOperations[0]).toMatchObject({ status: "leaving" });
    expect(state.encounters[encounterId]!.patientMovement).toBeNull();
    expect(state.encounters[encounterId]!.patientLocation).not.toBeNull();
    expect(encounterHasActiveServiceOperation(state, encounterId)).toBe(true);
    state.doors.push(blockedServiceDoor);
    state = advance(state, 1);
    expect(state.serviceOperations[0]).toMatchObject({ status: "completed" });
    expect(state.encounters[encounterId]!.patientMovement).toMatchObject({
      kind: "leaving_after_resolution",
      pathIndex: 0,
    });
  });

  it("does not start or pay a mapped procedure after an incorrect final choice", () => {
    let state = prepareQuestion(minorProcedureState(), "case.bread-butter.superficial-incisional-ssi.purulent-staple-line", "concept.superficial-incisional-ssi.open-drain");
    state = submit(state, false);
    expect(state.serviceOperations).toEqual([]);
    expect(state.serviceIncomeReceipts).toEqual([]);
  });

  it("prefers the approved onsite skin acquisition routes while retaining external pathology time", () => {
    const state = minorProcedureState();
    expect([...getCurrentCapabilities(state)]).toContain("capability.minor_procedure");
    expect(isRoomOperationalForFacilityWork(state, "room.test.minor")).toBe(true);
    const exam = state.rooms.find((room) => room.id === "room.test.exam")!;
    const minor = state.rooms.find((room) => room.id === "room.test.minor")!;
    expect(findDeterministicRoomPath(exam, minor, getRoomDefinition, state.rooms, new Set(["room.front_desk"]), state.doors).length).toBeGreaterThan(0);
    for (const [serviceId, routeId, workMinutes] of [
      ["service.skin_excisional_biopsy", "route.skin_excisional_biopsy.in_house", 45],
      ["service.cutaneous_lesion_biopsy", "route.cutaneous_lesion_biopsy.in_house", 15],
    ] as const) {
      expect(getEligibleServiceRoute(state, serviceId)).toMatchObject({
        route: {
          id: routeId,
          timingPhases: [
            { durationTicks: workMinutes, resourceBound: true },
            { durationTicks: 120, resourceBound: false },
          ],
        },
        providerReservation: { kind: "founder" },
      });
    }
  });

  it("blocks every new generic procedure visitor while preserving encounter-origin operations", () => {
    const state = minorProcedureState();
    expect(startServiceOperation(state, "income.minor_procedure_simple", "visitor", PROTOTYPE_DOMAIN_CONTEXT)).toBeNull();
    expect(startServiceOperation(state, "income.minor_procedure_sampling", "visitor", PROTOTYPE_DOMAIN_CONTEXT)).toBeNull();
    expect(startServiceOperation(state, "income.minor_procedure_complex", "visitor", PROTOTYPE_DOMAIN_CONTEXT)).toBeNull();
    expect(state.serviceOperations).toEqual([]);
  });

  it.each([
    ["income.minor_procedure_simple", 45],
    ["income.minor_procedure_sampling", 60],
    ["income.minor_procedure_complex", 60],
  ])("reloads a frozen legacy %s operation with its original work duration", (incomeLineId, durationMinutes) => {
    let state = prepareQuestion(
      minorProcedureState(),
      "case.bread-butter.perianal-abscess.tender-perianal-lump",
      "concept.perianal-abscess.prompt-drainage",
    );
    expect(startEncounterProcedureOperation(
      state,
      state.encounters["procedure-patient"]!,
      incomeLineId,
      PROTOTYPE_DOMAIN_CONTEXT,
    )).toBe(true);
    state = deserializeGameState(serializeGameState(state));
    for (let minute = 0; minute < 40 && state.serviceOperations[0]?.status !== "in_service"; minute += 1) {
      state = advance(state, 1);
    }
    expect(state.serviceOperations[0]).toMatchObject({ incomeLineId, status: "in_service" });
    expect(
      state.serviceOperations[0]!.phaseEndsAtFacilityTick! -
        state.serviceOperations[0]!.phaseStartedAtFacilityTick!,
    ).toBe(durationMinutes);
  });

  it("reserves rooms and staff from a persisted frozen phase contract", () => {
    const clinicalCase = PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.find(
      (candidate) => candidate.id === "case.fhh.suggestive-results-confirmation",
    )!;
    let state = prepareQuestion(
      phlebotomyProcedureState(),
      clinicalCase.id,
      clinicalCase.decisionNodes[0]!.primaryConceptId,
    );
    placePatientInTestExam(state);
    expect(startEncounterProcedureOperation(
      state,
      state.encounters["procedure-patient"]!,
      "income.collection",
      PROTOTYPE_DOMAIN_CONTEXT,
    )).toBe(true);
    state.serviceOperations[0]!.frozenOperationPhases = [{
      id: "frozen-ultrasound-acquisition",
      roomDefinitionId: "room.ultrasound",
      durationMinutes: 7,
      staffRoleDefinitionIds: ["staff.imaging_technician"],
    }];
    // A custom legacy contract has no snapshots from the original factory phases.
    delete state.serviceOperations[0]!.trainingTiming;
    delete state.serviceOperations[0]!.roomUpgradeRevenue;
    state = deserializeGameState(serializeGameState(state));
    for (let minute = 0; minute < 80 && state.serviceOperations[0]?.status !== "in_service"; minute += 1) {
      state = advance(state, 1);
    }
    expect(state.serviceOperations[0]).toMatchObject({
      status: "in_service",
      reservedRoomInstanceIds: ["room.test.ultrasound"],
      reservedEmployeeIds: ["employee.test.imaging"],
      frozenOperationPhases: [{
        id: "frozen-ultrasound-acquisition",
        roomDefinitionId: "room.ultrasound",
        durationMinutes: 7,
        staffRoleDefinitionIds: ["staff.imaging_technician"],
      }],
    });
    expect(state.serviceOperations[0]!.phaseEndsAtFacilityTick! - state.serviceOperations[0]!.phaseStartedAtFacilityTick!).toBe(7);
  });

  it("keeps a markerless frozen skin-biopsy result on its legacy 60-minute acquisition after reload", () => {
    let state = prepareQuestion(
      minorProcedureState(),
      "case.pigmented-skin-lesion.changing-back-lesion",
      "concept.pigmented-skin-lesion.complete-diagnostic-biopsy",
    );
    placePatientInTestExam(state);
    const encounter = state.encounters["procedure-patient"]!;
    state.environment.founderActivity = {
      kind: "attend_encounter", targetId: encounter.id,
      path: [{ ...state.environment.founderLocation }], pathIndex: 0,
      lastMovedAtFacilityTick: state.facilityTick, workMinutesRemaining: Number.MAX_SAFE_INTEGER,
    };
    state = submit(state, true);
    const frozen = state.encounters["procedure-patient"]!.pendingResult!;
    frozen.approvedProcedureTimingVersion = undefined;
    frozen.onsiteReturn = undefined;
    frozen.serviceDurationTicks = 180;
    frozen.durationTicks = 180;
    frozen.dueTick = frozen.scheduledAtTick + 180;
    frozen.timingPhases = [
      { id: "phase.skin_excisional_biopsy.sampling", durationTicks: 60, resourceBound: true, startsAtTick: frozen.scheduledAtTick, endsAtTick: frozen.scheduledAtTick + 60 },
      { id: "phase.skin_excisional_biopsy.external_pathology", durationTicks: 120, resourceBound: false, startsAtTick: frozen.scheduledAtTick + 60, endsAtTick: frozen.scheduledAtTick + 180 },
    ];
    const returnTicks = Math.ceil((frozen.patientTravel!.returnPath.length - 1) / frozen.patientTravel!.tilesPerTick);
    frozen.patientTravel!.serviceCompletionTick = frozen.dueTick - returnTicks;
    frozen.patientTravel!.returnArrivalTick = frozen.dueTick;
    state.environment.founderActivity = {
      kind: "attend_encounter", targetId: encounter.id,
      path: [{ ...state.environment.founderLocation }], pathIndex: 0,
      lastMovedAtFacilityTick: state.facilityTick, workMinutesRemaining: Number.MAX_SAFE_INTEGER,
    };
    state = deserializeGameState(serializeGameState(state));
    state = acknowledgeDecisionFeedback(state);
    const pending = state.encounters["procedure-patient"]!.pendingResult!;
    const resource = pending.timingPhases!.find((phase) => phase.resourceBound)!;
    expect(pending.approvedProcedureTimingVersion).toBeUndefined();
    expect(pending.onsiteReturn).toBeUndefined();
    expect(resource.endsAtTick - resource.startsAtTick).toBe(60);
    expect(pending.serviceDurationTicks).toBe(180);
    expect(pending.patientTravel!.serviceCompletionTick).toBeGreaterThanOrEqual(resource.endsAtTick);
    expect(pending.patientTravel!.returnArrivalTick).toBe(pending.dueTick);
    state = advance(state, pending.dueTick - state.facilityTick);
    const repairedDueTick = state.encounters["procedure-patient"]!.pendingResult!.dueTick;
    expect(state.encounters["procedure-patient"]!.pendingResult!.deliveredAtTick).toBeNull();
    state = advance(state, repairedDueTick - state.facilityTick);
    expect(state.encounters["procedure-patient"]!.pendingResult).toMatchObject({
      dueTick: repairedDueTick,
      deliveredAtTick: repairedDueTick,
    });
  });

  it.each([
    ["case.thyroid-nodule.palpable-referral", "concept.thyroid-nodule.fna-selection", "route.thyroid_fna.in_house", 150],
    ["case.bread-butter.breast-mass.screening-call-back", "concept.breast-mass.image-guided-core-biopsy", "route.breast_core_needle_biopsy.in_house", 150],
  ])("uses one hour of in-room ultrasound work for %s and persists the opt-in marker", (caseId, conceptId, routeId, fee) => {
    let state = prepareQuestion(ultrasoundProcedureState(), caseId, conceptId);
    placePatientInTestExam(state);
    let encounter = state.encounters["procedure-patient"]!;
    encounter.checkInStatus = "checked_in";
    encounter.lifecycle = "waiting_unopened";
    state.openChartEncounterId = null;
    state.attendedEncounterId = null;
    const exam = state.rooms.find((room) => room.id === "room.test.exam")!;
    const examStaffAnchor = getRoomNavigationAnchor(
      exam,
      getRoomDefinition(exam.roomDefinitionId)!,
      "staff",
    );
    state.employees.push({
      id: "employee.test.busy-app", staffRoleDefinitionId: "staff.app",
      displayName: "Busy APP", appearance: state.founder.appearance,
      hiredAtFacilityTick: state.facilityTick, salaryPerExpenseInterval: 30,
      morale: 75, trainingLevel: 1, homeRoomInstanceId: exam.id,
      location: examStaffAnchor, path: [{ ...examStaffAnchor }], pathIndex: 0,
      lastMovedAtFacilityTick: state.facilityTick, lastPraisedAtFacilityTick: null,
      nextIdleActionAtFacilityTick: Number.MAX_SAFE_INTEGER,
      facilityTask: {
        kind: "perform_service", targetId: "service-operation.unrelated",
        startedAtFacilityTick: state.facilityTick,
        workMinutesRemaining: Number.MAX_SAFE_INTEGER,
      },
    });
    state = gameReducer(state, {
      type: "OPEN_CHART",
      operationId: `procedure.open.${sequence++}`,
      encounterId: encounter.id,
    });
    encounter = state.encounters["procedure-patient"]!;
    expect(state.environment.founderActivity).toMatchObject({
      kind: "attend_encounter",
      targetId: encounter.id,
    });
    state = submit(state, true);
    expect(state.encounters[encounter.id]!.pendingResult).toMatchObject({
      routeId,
      serviceIncomeFee: fee,
      approvedProcedureTimingVersion: 1,
      providerReservation: null,
      timingPhases: [{ durationTicks: 60, resourceBound: true }, { durationTicks: 120, resourceBound: false }],
    });
    expect(state.environment.founderActivity).toBeNull();
    expect(state.employees[0]!.facilityTask).toMatchObject({ kind: "perform_imaging" });
    state = deserializeGameState(serializeGameState(state));
    expect(state.encounters[encounter.id]!.pendingResult?.approvedProcedureTimingVersion).toBe(1);
    state = acknowledgeDecisionFeedback(state);
    const pending = state.encounters[encounter.id]!.pendingResult!;
    const work = pending.timingPhases!.find((phase) => phase.resourceBound)!;
    expect(pending.onsiteReturn).toMatchObject({
      status: "awaiting_service_completion",
      serviceCompletedAtTick: work.endsAtTick,
      frontDeskArrivalTick: null,
    });
    expect(work.endsAtTick - work.startsAtTick).toBe(60);
    expect(pending.patientTravel!.serviceCompletionTick).toBe(work.endsAtTick);
    expect(pending.dueTick - work.endsAtTick).toBe(120);
    state = advance(state, work.startsAtTick - state.facilityTick);
    expect(getEncounterPatientLocation(state, encounter.id)).toEqual(
      pending.patientTravel!.outboundPath.at(-1),
    );
    state = advance(state, work.endsAtTick - state.facilityTick);
    expect(state.employees[0]!.facilityTask).toBeNull();
    expect(state.environment.founderActivity?.kind).not.toBe("perform_service");
    expect(state.encounters[encounter.id]!.pendingResult?.deliveredAtTick).toBeNull();
    expect(
      getPatientLists(state).active.find((patient) => patient.encounterId === encounter.id),
    ).toMatchObject({ statusLabel: "Returning to Front Desk" });
    state = deserializeGameState(serializeGameState(state));
    for (
      let minute = 0;
      minute < 80 &&
      state.encounters[encounter.id]!.pendingResult?.onsiteReturn?.status !== "front_desk_arrived";
      minute += 1
    ) {
      state = advance(state, 1);
    }
    expect(state.encounters[encounter.id]!.pendingResult?.onsiteReturn).toMatchObject({
      status: "front_desk_arrived",
      frontDeskArrivalTick: expect.any(Number),
    });
    for (let minute = 0; minute < 40 && state.encounters[encounter.id]!.patientMovement; minute += 1) {
      state = advance(state, 1);
    }
    expect(getEncounterPatientLocation(state, encounter.id)).toEqual(
      state.encounters[encounter.id]!.waitingDestination!.location,
    );
    expect(getPendingPatientLocation(state, encounter.id)).toBeNull();
    expect(getPendingPatientRoutePresentation(state, encounter.id)).toBeNull();
    expect(state.facilityTick).toBeLessThan(pending.dueTick);
    expect(state.encounters[encounter.id]!.pendingResult?.deliveredAtTick).toBeNull();
    state = advance(state, pending.dueTick - state.facilityTick);
    expect(state.encounters[encounter.id]!.pendingResult?.deliveredAtTick).toBe(state.facilityTick);
    expect(state.encounters[encounter.id]!.feedAttentionKind).toBe("result_ready");
    const markerlessDeliveredState = deserializeGameState(serializeGameState(state));
    markerlessDeliveredState.encounters[encounter.id]!.pendingResult!.onsiteReturn = undefined;
    markerlessDeliveredState.encounters[encounter.id]!.pendingResult!.deliveredAtTick = 0;
    expect(getPendingPatientLocation(markerlessDeliveredState, encounter.id)).toBeNull();
    expect(getPendingPatientRoutePresentation(markerlessDeliveredState, encounter.id)).toBeNull();
    state.openChartEncounterId = null;
    state.attendedEncounterId = null;
    state = gameReducer(state, {
      type: "OPEN_CHART",
      operationId: `procedure.next-care.${sequence++}`,
      encounterId: encounter.id,
    });
    expect(state.encounters[encounter.id]!.patientMovement).toMatchObject({
      kind: "walking_to_care",
    });
    expect(getPendingPatientLocation(state, encounter.id)).toBeNull();
    expect(getPendingPatientRoutePresentation(state, encounter.id)).toBeNull();
    expect(getEncounterPatientLocation(state, encounter.id)).toEqual(
      state.encounters[encounter.id]!.patientMovement!.path[
        state.encounters[encounter.id]!.patientMovement!.pathIndex
      ],
    );
  });

  it("withholds a ready result until a blocked onsite return can physically reach Front Desk", () => {
    let state = prepareQuestion(
      ultrasoundProcedureState(),
      "case.thyroid-nodule.palpable-referral",
      "concept.thyroid-nodule.fna-selection",
    );
    placePatientInTestExam(state);
    state = acknowledgeDecisionFeedback(submit(state, true));
    const encounterId = "procedure-patient";
    const pending = state.encounters[encounterId]!.pendingResult!;
    const frozenDueTick = pending.dueTick;
    const ultrasoundDoors = state.doors.filter(
      (door) => door.roomId === "room.test.ultrasound",
    );
    state.doors = state.doors.filter(
      (door) => door.roomId !== "room.test.ultrasound",
    );
    state = advance(state, frozenDueTick - state.facilityTick + 5);
    expect(state.encounters[encounterId]!.pendingResult).toMatchObject({
      deliveredAtTick: null,
      dueTick: frozenDueTick,
      onsiteReturn: {
        status: "awaiting_service_completion",
        frontDeskArrivalTick: null,
      },
    });
    expect(getEncounterPatientLocation(state, encounterId)).toEqual(
      pending.patientTravel!.outboundPath.at(-1),
    );
    state = deserializeGameState(serializeGameState(state));
    expect(state.encounters[encounterId]!.pendingResult?.onsiteReturn).toMatchObject({
      status: "awaiting_service_completion",
      frontDeskArrivalTick: null,
    });
    state.doors.push(...ultrasoundDoors);
    for (
      let minute = 0;
      minute < 80 && state.encounters[encounterId]!.pendingResult?.deliveredAtTick === null;
      minute += 1
    ) {
      state = advance(state, 1);
    }
    expect(state.encounters[encounterId]!.pendingResult?.onsiteReturn).toMatchObject({
      status: "front_desk_arrived",
      frontDeskArrivalTick: expect.any(Number),
    });
    expect(state.encounters[encounterId]!.pendingResult?.deliveredAtTick).toBe(state.facilityTick);
    expect(state.encounters[encounterId]!.feedAttentionKind).toBe("result_ready");
  });

  it("keeps an approved FNA onsite when a reachable ultrasound technician needs more than 60 minutes to arrive", () => {
    const slowTechState = ultrasoundProcedureState();
    const hallwayPoints = new Set<string>();
    const addHallway = (x: number, y: number) => {
      const key = `${x},${y}`;
      if (hallwayPoints.has(key) || slowTechState.rooms.some((room) => room.x === x && room.y === y)) return;
      hallwayPoints.add(key);
      slowTechState.rooms.push({
        id: `room.test.slow-tech-hall.${x}.${y}`,
        roomDefinitionId: "room.hallway",
        x, y, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100,
      });
    };
    for (let x = 35; x <= 68; x += 1) addHallway(x, 26);
    for (let y = 22; y <= 25; y += 1) addHallway(68, y);
    for (let x = 40; x <= 68; x += 1) addHallway(x, 22);
    for (let x = 32; x <= 39; x += 1) addHallway(x, 22);
    addHallway(32, 23);
    for (let y = 20; y <= 21; y += 1) addHallway(40, y);
    for (let x = 40; x <= 68; x += 1) addHallway(x, 20);
    for (let y = 18; y <= 19; y += 1) addHallway(68, y);
    for (let x = 40; x <= 68; x += 1) addHallway(x, 18);
    for (let y = 16; y <= 17; y += 1) addHallway(40, y);
    for (let x = 40; x <= 68; x += 1) addHallway(x, 16);
    for (let y = 0; y <= 15; y += 1) addHallway(8, y);
    for (let x = 8; x <= 39; x += 1) addHallway(x, 0);
    for (let x = 8; x <= 39; x += 1) addHallway(x, 16);
    slowTechState.employees[0]!.location = { x: 8, y: 0 };
    slowTechState.employees[0]!.path = [{ x: 8, y: 0 }];
    slowTechState.employees[0]!.pathIndex = 0;

    let state = prepareQuestion(
      slowTechState,
      "case.thyroid-nodule.palpable-referral",
      "concept.thyroid-nodule.fna-selection",
    );
    placePatientInTestExam(state);
    const encounter = state.encounters["procedure-patient"]!;
    state.environment.founderActivity = {
      kind: "attend_encounter", targetId: encounter.id,
      path: [{ ...state.environment.founderLocation }], pathIndex: 0,
      lastMovedAtFacilityTick: state.facilityTick, workMinutesRemaining: Number.MAX_SAFE_INTEGER,
    };
    state = submit(state, true);
    expect(state.encounters[encounter.id]!.pendingResult?.routeId).toBe("route.thyroid_fna.in_house");
    expect(state.employees[0]!.path.length).toBeGreaterThan(121);
    state = acknowledgeDecisionFeedback(state);
    const pending = state.encounters[encounter.id]!.pendingResult!;
    const work = pending.timingPhases!.find((phase) => phase.resourceBound)!;
    expect(work.startsAtTick - state.facilityTick).toBeGreaterThan(60);
    expect(work.endsAtTick - work.startsAtTick).toBe(60);
  });

  it("runs anoscopy for 15 in-room minutes, then returns the patient to a waiting destination", () => {
    const longWalkState = minorProcedureState();
    longWalkState.rooms.find((room) => room.id === "room.test.minor")!.x = 60;
    for (let x = 33; x < 60; x += 1) {
      longWalkState.rooms.push({
        id: `room.test.long-hall.${x}`,
        roomDefinitionId: "room.hallway",
        x,
        y: 24,
        orientation: 0,
        doorSide: null,
        upgradeLevel: 1,
        cleanliness: 100,
      });
    }
    let state = prepareQuestion(
      longWalkState,
      "case.internal-hemorrhoids.commute",
      "concept.internal-hemorrhoids.anoscopy-evaluation",
    );
    placePatientInTestExam(state);
    const encounter = state.encounters["procedure-patient"]!;
    state.environment.founderActivity = {
      kind: "attend_encounter", targetId: encounter.id,
      path: [{ ...state.environment.founderLocation }], pathIndex: 0,
      lastMovedAtFacilityTick: state.facilityTick, workMinutesRemaining: Number.MAX_SAFE_INTEGER,
    };
    const eligible = getEligibleServiceRoute(
      state,
      "service.anoscopy",
      ["route.anoscopy.outsourced"],
      PROTOTYPE_DOMAIN_CONTEXT,
      encounter.id,
    )!;
    expect(eligible.route.id).toBe("route.anoscopy.in_house");
    expect(eligible.timing.durationTicks).toBeGreaterThan(15);
    const correctChoiceId = getCurrentQuestion(state, encounter.id)!.node.answerChoices.find(
      (choice) => choice.isCorrect,
    )!.id;
    expect(getAnswerChoiceServicePreview(state, encounter.id, correctChoiceId)).toBeNull();
    state = acknowledgeDecisionFeedback(submit(state, true));
    const pending = state.encounters[encounter.id]!.pendingResult!;
    const work = pending.timingPhases![0]!;
    expect(pending).toMatchObject({ routeId: "route.anoscopy.in_house", approvedProcedureTimingVersion: 1, serviceIncomeFee: 200 });
    expect(work.endsAtTick - work.startsAtTick).toBe(15);
    expect(state.encounters[encounter.id]!.waitingDestination).not.toBeNull();
    state = advance(state, pending.dueTick - state.facilityTick);
    for (let minute = 0; minute < 80 && state.encounters[encounter.id]!.patientMovement; minute += 1) {
      state = advance(state, 1);
    }
    expect(state.encounters[encounter.id]!.assignedRoomInstanceId).toBe(
      state.encounters[encounter.id]!.waitingDestination!.roomInstanceId,
    );
    expect(getEncounterPatientLocation(state, encounter.id)).toEqual(
      state.encounters[encounter.id]!.waitingDestination!.location,
    );
  });

  it("uses one hour of ultrasound-room work for the exact lactational aspiration action", () => {
    let state = prepareQuestion(
      ultrasoundProcedureState(),
      "case.lactational-breast-abscess.tender-upper-breast",
      "concept.lactational-breast-abscess.selected-drainage",
    );
    expect([...getCurrentCapabilities(state)]).toEqual(expect.arrayContaining([
      "capability.ultrasound_machine",
      "capability.staff.imaging_technician",
    ]));
    expect(getCurrentQuestion(state, "procedure-patient")?.node.id).toBe(
      "node.lactational-breast-abscess.tender-upper-breast.2",
    );
    expect(state.encounters["procedure-patient"]!.frozenCase.id).toBe(
      "case.lactational-breast-abscess.tender-upper-breast",
    );
    expect(
      getCurrentQuestion(state, "procedure-patient")?.node.answerChoices.find(
        (choice) => choice.isCorrect,
      )?.id,
    ).toBe("guided_aspiration_1");
    state = submit(state, true);
    const cashAfterAnswer = state.cash;
    expect(state.serviceOperations[0]).toMatchObject({
      actorKind: "encounter",
      incomeLineId: "income.procedure.image_guided_breast_abscess_aspiration",
      quoteFee: 150,
    });
    for (let minute = 0; minute < 50 && state.serviceOperations[0]?.status !== "in_service"; minute += 1) state = advance(state, 1);
    const operation = state.serviceOperations[0]!;
    expect(operation.phaseEndsAtFacilityTick! - operation.phaseStartedAtFacilityTick!).toBe(60);
    state = advance(state, 70);
    expect(state.cash).toBe(cashAfterAnswer + 150);
  });

  it("queues terminal ultrasound while its assigned technician is busy in CT, then runs the full tech-only work phase", () => {
    let state = ultrasoundProcedureState();
    state.facilityLevel = 2;
    state.rooms.push({
      id: "room.test.ct",
      roomDefinitionId: "room.ct",
      x: 28,
      y: 23,
      orientation: 0,
      doorSide: null,
      upgradeLevel: 1,
      cleanliness: 100,
    });
    state.doors.push({
      id: "door.test.ct",
      roomId: "room.test.ct",
      side: "east",
      offset: 1,
      exterior: false,
    });
    state = gameReducer(state, {
      type: "START_SERVICE_OPERATION",
      operationId: `procedure.busy-ct.${sequence++}`,
      incomeLineId: "income.ct",
      actorKind: "visitor",
    });
    for (
      let minute = 0;
      minute < 80 && state.serviceOperations[0]?.status !== "in_service";
      minute += 1
    ) {
      state = advance(state, 1);
    }
    const ctOperation = state.serviceOperations[0]!;
    expect(ctOperation).toMatchObject({
      incomeLineId: "income.ct",
      status: "in_service",
      reservedEmployeeIds: ["employee.test.imaging"],
    });
    expect(state.employees[0]).toMatchObject({
      location: expect.not.objectContaining(
        getRoomNavigationAnchor(
          state.rooms.find((room) => room.id === "room.test.ultrasound")!,
          getRoomDefinition("room.ultrasound")!,
          "staff",
        ),
      ),
      facilityTask: { kind: "perform_service", targetId: ctOperation.id },
    });

    state = prepareQuestion(
      state,
      "case.lactational-breast-abscess.tender-upper-breast",
      "concept.lactational-breast-abscess.selected-drainage",
    );
    state = submit(state, true);
    const ultrasoundOperation = state.serviceOperations.find(
      (operation) => operation.actorKind === "encounter",
    )!;
    expect(ultrasoundOperation).toMatchObject({
      incomeLineId: "income.procedure.image_guided_breast_abscess_aspiration",
      status: "waiting_for_resources",
      resourceQueueVersion: 1,
      reservedEmployeeIds: [],
      providerReservation: null,
    });
    expect(state.environment.founderActivity?.kind).not.toBe("perform_service");

    const remainingCtWork = ctOperation.phaseEndsAtFacilityTick! - state.facilityTick;
    state = advance(state, remainingCtWork - 1);
    expect(
      state.serviceOperations.find((operation) => operation.id === ultrasoundOperation.id),
    ).toMatchObject({ status: "waiting_for_resources", providerReservation: null });
    for (
      let minute = 0;
      minute < 80 &&
      state.serviceOperations.find((operation) => operation.id === ultrasoundOperation.id)?.status !== "in_service";
      minute += 1
    ) {
      state = advance(state, 1);
    }
    const dispatched = state.serviceOperations.find(
      (operation) => operation.id === ultrasoundOperation.id,
    )!;
    expect(dispatched).toMatchObject({
      status: "in_service",
      reservedEmployeeIds: ["employee.test.imaging"],
      providerReservation: null,
    });
    expect(dispatched.phaseEndsAtFacilityTick! - dispatched.phaseStartedAtFacilityTick!).toBe(60);
    expect(state.environment.founderActivity?.kind).not.toBe("perform_service");
  });

  it("keeps named distractors, follow-up observation, and reflux monitoring out of procedure resources", () => {
    let state = prepareQuestion(
      minorProcedureState(),
      "case.internal-hemorrhoids.commute",
      "concept.internal-hemorrhoids.office-banding-selection",
    );
    const question = getCurrentQuestion(state, "procedure-patient")!;
    const thrombectomy = question.node.answerChoices.find((choice) => choice.id === "thrombectomy_1")!;
    state = gameReducer(state, {
      type: "SUBMIT_ANSWER", operationId: "procedure.distractor.thrombectomy",
      encounterId: "procedure-patient", decisionNodeId: question.node.id,
      answerChoiceId: thrombectomy.id, reviewedAtMs: 10_000,
    });
    expect(state.serviceOperations).toEqual([]);
    const reflux = getEligibleServiceRoute(state, "service.ambulatory_reflux_monitoring");
    expect(reflux).toMatchObject({
      route: { id: "route.ambulatory_reflux_monitoring.outsourced", resourceRequirements: [], providerRequirement: null },
      providerReservation: null,
      imagingTechnicianId: null,
    });
    for (const [caseId, conceptId] of [
      ["case.postoperative-seroma.lumpectomy-fullness", "concept.postoperative-seroma.uncomplicated-observation"],
      ["case.pilonidal-disease.recurrent-drainage", "concept.pilonidal-disease.off-midline-closure-planning"],
    ] as const) {
      const nonprocedural = submit(
        prepareQuestion(minorProcedureState(), caseId, conceptId),
        true,
      );
      expect(nonprocedural.serviceOperations).toEqual([]);
    }
  });

  it("collects a terminal FHH genetic specimen before departure and freezes the exact order across reload", () => {
    const clinicalCase = PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.find(
      (candidate) => candidate.id === "case.fhh.suggestive-results-confirmation",
    )!;
    const node = clinicalCase.decisionNodes.find(
      (candidate) => candidate.id === "node.fhh.suggestive-results-confirmation.v1",
    )!;
    let state = prepareQuestion(phlebotomyProcedureState(), clinicalCase.id, node.primaryConceptId);
    placePatientInTestExam(state);
    state = submit(state, true);
    expect(state.serviceOperations).toHaveLength(1);
    expect(state.serviceOperations[0]).toMatchObject({
      actorKind: "encounter",
      incomeLineId: "income.collection",
      quoteFee: 50,
      status: "waiting_for_resources",
      testChoiceOrder: {
        purpose: "terminal",
        choiceId: "suspect_fhh_genetic_testing",
        serviceId: "service.genetic_testing",
        routeId: "route.genetic_testing.phlebotomy_sendout",
      },
    });
    state = deserializeGameState(serializeGameState(state));
    expect(state.serviceOperations).toHaveLength(1);
    expect(state.encounters["procedure-patient"]!.terminalTestOrder).toMatchObject({
      status: "onsite_service",
      routeId: "route.genetic_testing.phlebotomy_sendout",
      serviceOperationId: state.serviceOperations[0]!.id,
    });
    for (let minute = 0; minute < 80 && state.serviceOperations[0]?.status !== "in_service"; minute += 1) {
      state = advance(state, 1);
    }
    expect(state.serviceOperations[0]!.phaseEndsAtFacilityTick! - state.serviceOperations[0]!.phaseStartedAtFacilityTick!).toBe(15);
    const cashBeforeCompletion = state.cash;
    state = advance(state, 80);
    expect(state.serviceIncomeReceipts).toHaveLength(1);
    expect(state.cash).toBe(cashBeforeCompletion + 50);
    const reloaded = deserializeGameState(serializeGameState(state));
    const afterDuplicateTicks = advance(reloaded, 5);
    expect(afterDuplicateTicks.serviceIncomeReceipts).toHaveLength(1);
    expect(afterDuplicateTicks.cash).toBe(state.cash);
  });

  it("persists an external terminal test order without creating clinic work or revenue", () => {
    const clinicalCase = PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.find(
      (candidate) => candidate.id === "case.fhh.suggestive-results-confirmation",
    )!;
    const node = clinicalCase.decisionNodes.find(
      (candidate) => candidate.id === "node.fhh.suggestive-results-confirmation.v1",
    )!;
    let state = prepareQuestion(ultrasoundProcedureState(), clinicalCase.id, node.primaryConceptId);
    state.facilityLevel = 2;
    placePatientInTestExam(state);
    state = submit(state, true);
    expect(state.serviceOperations).toEqual([]);
    expect(state.serviceIncomeReceipts).toEqual([]);
    expect(state.encounters["procedure-patient"]!.terminalTestOrder).toMatchObject({
      status: "external_arranged",
      routeId: "route.genetic_testing.outsourced",
      serviceOperationId: null,
    });
    state = deserializeGameState(serializeGameState(state));
    expect(state.encounters["procedure-patient"]!.terminalTestOrder).toMatchObject({
      status: "external_arranged",
      routeId: "route.genetic_testing.outsourced",
    });
    state = advance(state, 10);
    expect(state.serviceIncomeReceipts).toEqual([]);
  });

  it("converts an interrupted terminal collection to its external order without clinic revenue", () => {
    const clinicalCase = PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.find(
      (candidate) => candidate.id === "case.fhh.suggestive-results-confirmation",
    )!;
    const node = clinicalCase.decisionNodes.find(
      (candidate) => candidate.id === "node.fhh.suggestive-results-confirmation.v1",
    )!;
    let state = prepareQuestion(phlebotomyProcedureState(), clinicalCase.id, node.primaryConceptId);
    placePatientInTestExam(state);
    state = submit(state, true);
    for (let minute = 0; minute < 120 && state.serviceOperations[0]?.status !== "in_service"; minute += 1) {
      state = advance(state, 1);
    }
    const roomId = state.serviceOperations[0]!.reservedRoomInstanceIds[0]!;
    const preview = getRoomSalePreview(state, roomId, PROTOTYPE_DOMAIN_CONTEXT)!;
    state = gameReducer(state, {
      type: "SELL_ROOM",
      operationId: "sell.terminal.phlebotomy",
      roomId,
      saleConfirmationToken: preview.confirmationToken,
    });
    expect(state.encounters["procedure-patient"]!.terminalTestOrder).toMatchObject({
      status: "external_arranged",
      serviceOperationId: null,
    });
    expect(state.serviceIncomeReceipts).toEqual([]);
    state = gameReducer(state, {
      type: "ACKNOWLEDGE_TERMINAL_FEEDBACK",
      operationId: "ack.terminal.after-sale",
      encounterId: "procedure-patient",
    });
    state = gameReducer(state, {
      type: "CLOSE_CHART",
      operationId: "close.terminal.after-sale",
      encounterId: "procedure-patient",
    });
    let sawVisibleDeparture = false;
    for (let minute = 0; minute < 180 && state.encounters["procedure-patient"]!.patientLocation !== null; minute += 1) {
      state = advance(state, 1);
      sawVisibleDeparture ||= state.encounters["procedure-patient"]!.patientMovement?.kind === "leaving_after_resolution";
    }
    expect(sawVisibleDeparture).toBe(true);
    expect(state.encounters["procedure-patient"]!.patientLocation).toBeNull();
    expect(state.serviceIncomeReceipts).toEqual([]);
  });

  it.each([
    [
      "ultrasound",
      "case.mondor-disease.uncertain-targeted-ultrasound",
      "node.mondor-disease.evaluation.uncertain-doppler-ultrasound.v1",
      "income.ultrasound",
      "route.ultrasound.in_house",
      45,
    ],
    [
      "ct",
      "case.cushing-classification.progressive-features",
      "node.cushing-classification.progressive-features.2",
      "income.ct",
      "route.ct.in_house",
      60,
    ],
  ] as const)("acquires the exact terminal %s order before the patient leaves", (_modality, caseId, nodeId, incomeLineId, routeId, workMinutes) => {
    const clinicalCase = PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.find(
      (candidate) => candidate.id === caseId,
    )!;
    const node = clinicalCase.decisionNodes.find((candidate) => candidate.id === nodeId)!;
    let state = prepareQuestion(
      _modality === "ct" ? ctProcedureState() : ultrasoundProcedureState(),
      clinicalCase.id,
      node.primaryConceptId,
    );
    placePatientInTestExam(state);
    state = submit(state, true);
    expect(state.serviceOperations[0]).toMatchObject({
      actorKind: "encounter",
      incomeLineId,
      status: "waiting_for_resources",
      testChoiceOrder: { purpose: "terminal", routeId },
    });
    for (let minute = 0; minute < 80 && state.serviceOperations[0]?.status !== "in_service"; minute += 1) {
      state = advance(state, 1);
    }
    expect(state.serviceOperations[0]!.phaseEndsAtFacilityTick! - state.serviceOperations[0]!.phaseStartedAtFacilityTick!).toBe(workMinutes);
    expect(state.encounters["procedure-patient"]!.patientMovement?.kind).not.toBe("leaving_after_resolution");
  });

  it("performs terminal endoanal ultrasound in the ultrasound room before departure", () => {
    const clinicalCase = PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.find(
      (candidate) => candidate.id === "case.fecal-incontinence.obstetric-injury",
    )!;
    const node = clinicalCase.decisionNodes.find(
      (candidate) => candidate.id === "node.fecal-incontinence.obstetric-injury.1",
    )!;
    let state = prepareQuestion(ultrasoundProcedureState(), clinicalCase.id, node.primaryConceptId);
    placePatientInTestExam(state);
    state = submit(state, true);
    expect(state.encounters["procedure-patient"]!.terminalTestOrder).toMatchObject({
      routeId: "route.endoanal_ultrasound.in_house",
      status: "onsite_service",
    });
    expect(state.serviceOperations[0]).toMatchObject({
      incomeLineId: "income.ultrasound",
      quoteFee: 120,
      testChoiceOrder: { purpose: "terminal", serviceId: "service.endoanal_ultrasound" },
    });
  });

  it.each([
    {
      label: "contrast swallow",
      makeState: xrayProcedureState,
      caseId: "case.zenker-diverticulum.regurgitated-food",
      nodeId: "node.zenker-diverticulum.regurgitated-food.1",
      routeId: "route.contrast_swallow.in_house",
      phaseId: "phase.contrast_swallow.acquisition",
      incomeLineId: "income.xray",
      fee: 90,
      localMinutes: 60,
    },
    {
      label: "resting ABI",
      makeState: ultrasoundProcedureState,
      caseId: "case.peripheral-arterial-disease.mail-route",
      nodeId: "node.peripheral-arterial-disease.mail-route.1",
      routeId: "route.resting_abi.in_house",
      phaseId: "phase.resting_abi.acquisition",
      incomeLineId: "income.ultrasound",
      fee: 120,
      localMinutes: 45,
    },
    {
      label: "urea breath specimen",
      makeState: phlebotomyProcedureState,
      caseId: "case.h-pylori-ulcer.duodenal-ulcer",
      nodeId: "node.h-pylori-ulcer.duodenal-ulcer.1",
      routeId: "route.h_pylori_urea_breath.in_house",
      phaseId: "phase.h_pylori_urea_breath.collection",
      incomeLineId: "income.collection",
      fee: 50,
      localMinutes: 15,
    },
    {
      label: "nipple-areolar skin sampling",
      makeState: minorProcedureState,
      caseId: "case.mammary-paget.crusted-nipple",
      nodeId: "node.mammary-paget.crusted-nipple.1",
      routeId: "route.nipple_areolar_biopsy.in_house",
      phaseId: "phase.nipple_areolar_biopsy.sampling",
      incomeLineId: "income.minor_procedure_sampling",
      fee: 150,
      localMinutes: 15,
    },
  ])("routes the exact $label gate through its reviewed clinic resource", ({ makeState, caseId, nodeId, routeId, phaseId, incomeLineId, fee, localMinutes }) => {
    const clinicalCase = PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.find((candidate) => candidate.id === caseId)!;
    const node = clinicalCase.decisionNodes.find((candidate) => candidate.id === nodeId)!;
    let state = prepareQuestion(makeState(), clinicalCase.id, node.primaryConceptId);
    placePatientInTestExam(state);
    state = submit(state, true);
    expect(state.encounters["procedure-patient"]!.pendingResult).toMatchObject({
      routeId,
      serviceIncomeEligible: true,
      serviceIncomeLineId: incomeLineId,
      serviceIncomeFee: fee,
      deliveredAtTick: null,
      timingPhases: expect.arrayContaining([
        expect.objectContaining({ id: phaseId, durationTicks: localMinutes, resourceBound: true }),
      ]),
    });
    state = acknowledgeDecisionFeedback(state);
    const pending = state.encounters["procedure-patient"]!.pendingResult!;
    expect(pending.approvedProcedureTimingVersion).toBe(1);
    expect(pending.patientTravel).not.toBeNull();
    expect(pending.timingPhases![0]!.startsAtTick).toBeGreaterThanOrEqual(
      pending.patientTravel!.outboundArrivalTick,
    );
    if (routeId === "route.h_pylori_urea_breath.in_house") {
      expect(pending.pendingLabel).toContain("Urea breath");
      expect(pending.pendingLabel.toLowerCase()).not.toContain("blood");
    }
  });

  it("walks the full-thickness punch-biopsy patient to Minor Procedure for 15 minutes before external pathology", () => {
    const clinicalCase = PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.find(
      (candidate) => candidate.id === "case.mammary-paget.crusted-nipple",
    )!;
    const node = clinicalCase.decisionNodes.find(
      (candidate) => candidate.id === "node.mammary-paget.crusted-nipple.1",
    )!;
    let state = prepareQuestion(minorProcedureState(), clinicalCase.id, node.primaryConceptId);
    placePatientInTestExam(state);
    const encounter = state.encounters["procedure-patient"]!;
    state.environment.founderActivity = {
      kind: "attend_encounter",
      targetId: encounter.id,
      path: [{ ...state.environment.founderLocation }],
      pathIndex: 0,
      lastMovedAtFacilityTick: state.facilityTick,
      workMinutesRemaining: Number.MAX_SAFE_INTEGER,
    };
    state = submit(state, true);
    expect(state.encounters["procedure-patient"]!.steps[0]).toMatchObject({
      status: "feedback_pending",
      answer: { answerChoiceId: "full_thickness_1" },
    });
    state = deserializeGameState(serializeGameState(state));
    state = acknowledgeDecisionFeedback(state);
    let pending = state.encounters["procedure-patient"]!.pendingResult!;
    expect(pending).toMatchObject({
      routeId: "route.nipple_areolar_biopsy.in_house",
      serviceIncomeLineId: "income.minor_procedure_sampling",
      serviceIncomeFee: 150,
      approvedProcedureTimingVersion: 1,
      providerReservation: { kind: "founder" },
      onsiteReturn: { status: "awaiting_service_completion" },
    });
    expect(state.encounters["procedure-patient"]!.patientMovement?.kind).toBe("walking_to_care");
    expect(state.encounters["procedure-patient"]!.patientMovement?.path.at(-1)).toEqual(
      pending.patientTravel!.outboundPath.at(-1),
    );
    const activeMovement = state.encounters["procedure-patient"]!.patientMovement!;
    const frozenMovement = {
      ...activeMovement,
      path: activeMovement.path.map((point) => ({ ...point })),
    };
    state = deserializeGameState(serializeGameState(state));
    state = acknowledgeDecisionFeedback(state);
    expect(state.encounters["procedure-patient"]!.patientMovement).toEqual(frozenMovement);
    const sampling = pending.timingPhases!.find((phase) => phase.id === "phase.nipple_areolar_biopsy.sampling")!;
    expect(sampling.endsAtTick - sampling.startsAtTick).toBe(15);
    expect(sampling.startsAtTick).toBeGreaterThanOrEqual(pending.patientTravel!.outboundArrivalTick);
    while (state.facilityTick < sampling.startsAtTick) state = advance(state, 1);
    expect(state.encounters["procedure-patient"]!.patientLocation).toEqual(
      pending.patientTravel!.outboundPath.at(-1),
    );
    expect(state.environment.founderActivity).toMatchObject({
      kind: "perform_service",
      targetId: pending.operationId,
    });
    state = advance(state, 15);
    pending = state.encounters["procedure-patient"]!.pendingResult!;
    expect(state.serviceIncomeReceipts.filter((receipt) => receipt.incomeLineId === "income.minor_procedure_sampling")).toEqual([
      expect.objectContaining({ grossAmount: 150 }),
    ]);
    expect(pending.onsiteReturn?.status).not.toBe("awaiting_service_completion");
    expect(pending.deliveredAtTick).toBeNull();
  });

  it("persists a local CT component, returns to Front Desk, then starts the authored external anal-staging remainder once", () => {
    const clinicalCase = PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.find(
      (candidate) => candidate.id === "case.anal-squamous-cell-cancer.bleeding-lesion",
    )!;
    const node = clinicalCase.decisionNodes.find(
      (candidate) => candidate.id === "node.anal-squamous-cell-cancer.bleeding-lesion.1",
    )!;
    let state = prepareQuestion(ctProcedureState(), clinicalCase.id, node.primaryConceptId);
    placePatientInTestExam(state);
    state = submit(state, true);
    expect(state.encounters["procedure-patient"]!.stagedResultOrder).toMatchObject({
      status: "feedback_pending",
      components: [{ componentId: "ct_acquisition", routeId: "route.ct.in_house", quoteFee: 180 }],
      remainder: { routeId: "route.anal_lesion_biopsy_staging.outsourced", deliveredAtTick: null },
    });
    expect(state.encounters["procedure-patient"]!.pendingResult).toBeNull();
    state = acknowledgeDecisionFeedback(state);
    expect(state.serviceOperations[0]?.testChoiceOrder).toMatchObject({
      purpose: "staged_result_component",
      routeId: "route.ct.in_house",
      externalRemainder: expect.stringContaining("Biopsy"),
    });
    state = deserializeGameState(serializeGameState(state));
    const operationId = state.encounters["procedure-patient"]!.stagedResultOrder!.components[0]!.serviceOperationId;
    for (let minute = 0; minute < 240 && state.encounters["procedure-patient"]!.stagedResultOrder?.status !== "remainder_pending"; minute += 1) {
      state = advance(state, 1);
    }
    const encounter = state.encounters["procedure-patient"]!;
    expect(encounter.stagedResultOrder).toMatchObject({
      status: "remainder_pending",
      components: [{ status: "completed", serviceOperationId: operationId }],
    });
    expect(encounter.pendingResult).toMatchObject({
      routeId: "route.anal_lesion_biopsy_staging.outsourced",
      deliveredAtTick: null,
    });
    expect(state.serviceIncomeReceipts.filter((receipt) => receipt.incomeLineId === "income.ct")).toHaveLength(1);
    const reloaded = deserializeGameState(serializeGameState(state));
    expect(reloaded.encounters["procedure-patient"]!.stagedResultOrder?.components[0]?.serviceOperationId).toBe(operationId);
    expect(reloaded.serviceIncomeReceipts.filter((receipt) => receipt.incomeLineId === "income.ct")).toHaveLength(1);
  });

  it("moves a staged result fully off site when its last local room is sold mid-acquisition", () => {
    const clinicalCase = PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.find(
      (candidate) => candidate.id === "case.anal-squamous-cell-cancer.bleeding-lesion",
    )!;
    const node = clinicalCase.decisionNodes.find(
      (candidate) => candidate.id === "node.anal-squamous-cell-cancer.bleeding-lesion.1",
    )!;
    let state = prepareQuestion(ctProcedureState(), clinicalCase.id, node.primaryConceptId);
    placePatientInTestExam(state);
    state = acknowledgeDecisionFeedback(submit(state, true));
    const expectedExternalDuration = state.encounters["procedure-patient"]!
      .stagedResultOrder!.remainder.serviceDurationTicks;
    for (let minute = 0; minute < 120 && state.serviceOperations[0]?.status !== "in_service"; minute += 1) {
      state = advance(state, 1);
    }
    const roomId = state.serviceOperations[0]!.reservedRoomInstanceIds[0]!;
    const preview = getRoomSalePreview(state, roomId, PROTOTYPE_DOMAIN_CONTEXT)!;
    state = gameReducer(state, {
      type: "SELL_ROOM",
      operationId: "sell.staged.ct",
      roomId,
      saleConfirmationToken: preview.confirmationToken,
    });
    const encounter = state.encounters["procedure-patient"]!;
    expect(encounter.stagedResultOrder).toMatchObject({
      status: "remainder_pending",
      components: [{ status: "cancelled" }],
    });
    expect(encounter.pendingResult).toMatchObject({
      routeId: "route.anal_lesion_biopsy_staging.outsourced",
      patientTravel: null,
      offsiteTravel: null,
      deliveredAtTick: null,
    });
    expect(encounter.pendingResult?.patientRemainsOnsite).toBeUndefined();
    expect(encounter.pendingResult!.dueTick - encounter.pendingResult!.scheduledAtTick)
      .toBe(expectedExternalDuration);
    expect(state.serviceIncomeReceipts).toEqual([]);
    let sawOffsite = false;
    for (let minute = 0; minute < 600; minute += 1) {
      state = advance(state, 1);
      sawOffsite ||= state.encounters["procedure-patient"]!.patientLocation === null;
      const current = state.encounters["procedure-patient"]!;
      if (current.pendingResult?.deliveredAtTick !== null && current.patientLocation !== null &&
          current.patientMovement?.kind !== "returning_from_offsite_testing") break;
    }
    expect(sawOffsite).toBe(true);
    expect(typeof state.encounters["procedure-patient"]!.pendingResult?.deliveredAtTick).toBe("number");
    expect(state.encounters["procedure-patient"]!.patientLocation).not.toBeNull();
    expect(state.serviceIncomeReceipts).toEqual([]);
  });

  it("shows serial local-plus-external time for the staged breast-imaging bundle", () => {
    const clinicalCase = PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.find(
      (candidate) => candidate.id === "case.mondor-disease.full-pathway",
    )!;
    const node = clinicalCase.decisionNodes.find(
      (candidate) => candidate.id === "node.mondor-disease.evaluation.diagnostic-breast-imaging.full-pathway",
    )!;
    const state = prepareQuestion(ultrasoundProcedureState(), clinicalCase.id, node.primaryConceptId, false);
    const preview = getAnswerChoiceServicePreview(
      state,
      "procedure-patient",
      "diagnostic_mammography_or_dbt_and_targeted_ultrasound",
    )!;
    expect(preview).toMatchObject({
      routeId: "route.ultrasound.in_house",
    });
    expect(preview.diagnosticTiming!.phases).toEqual(expect.arrayContaining([
      expect.objectContaining({ kind: "acquisition", mode: "local", durationMinutes: 45 }),
      expect.objectContaining({ kind: "interpretation", mode: "external", durationMinutes: 30 }),
      expect.objectContaining({ id: "diagnostic.remainder", durationMinutes: 120, patientPresent: true }),
      expect.objectContaining({ id: "diagnostic.remainder.patient_departure" }),
    ]));
    expect(preview.durationTicks).toBe(Math.max(...preview.diagnosticTiming!.phases.map((phase) => phase.forecast.endsAtTick)) - state.facilityTick);
    expect(preview.durationTicks).toBeGreaterThan(165);
  });

  it("falls back to the authored external compound route when no reviewed local component is available", () => {
    const clinicalCase = PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.find(
      (candidate) => candidate.id === "case.anal-squamous-cell-cancer.bleeding-lesion",
    )!;
    const node = clinicalCase.decisionNodes.find(
      (candidate) => candidate.id === "node.anal-squamous-cell-cancer.bleeding-lesion.1",
    )!;
    let state = prepareQuestion(ultrasoundProcedureState(), clinicalCase.id, node.primaryConceptId);
    placePatientInTestExam(state);
    state = submit(state, true);
    const encounter = state.encounters["procedure-patient"]!;
    expect(encounter.stagedResultOrder).toBeUndefined();
    expect(encounter.pendingResult).toMatchObject({
      routeId: "route.anal_lesion_biopsy_staging.outsourced",
      deliveredAtTick: null,
    });
    expect(state.serviceOperations).toEqual([]);
  });

  it("performs local GIST EUS sampling and marks the remainder as external processing", () => {
    const clinicalCase = PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.find(
      (candidate) => candidate.id === "case.gastric-gist.posterior-fundus-mass",
    )!;
    const node = clinicalCase.decisionNodes.find(
      (candidate) => candidate.id === "node.gastric-gist.posterior-fundus-mass.1",
    )!;
    let state = prepareQuestion(endoscopyProcedureState(), clinicalCase.id, node.primaryConceptId);
    placePatientInTestExam(state);
    state = submit(state, true);
    expect(state.encounters["procedure-patient"]!.stagedResultOrder).toMatchObject({
      remainderMode: "external_processing",
      status: "feedback_pending",
      components: [{
        componentId: "eus_sampling",
        routeId: "route.endoscopy.eus-ercp-sampling.in_house",
        incomeLineId: "income.advanced_endoscopy",
        quoteFee: 600,
        operationPhases: [
          { id: "preparation_and_procedure", durationMinutes: 75 },
          { id: "recovery", durationMinutes: 45 },
        ],
      }],
    });
    state = acknowledgeDecisionFeedback(state);
    expect(state.serviceOperations[0]).toMatchObject({
      quoteFee: 600,
      frozenOperationPhases: [
        { id: "periop_preparation", durationMinutes: 30 },
        { id: "preparation_and_procedure.procedure", durationMinutes: 45 },
        { id: "recovery", durationMinutes: 60 },
      ],
      testChoiceOrder: {
        purpose: "staged_result_component",
        componentId: "eus_sampling",
      },
    });
    state = deserializeGameState(serializeGameState(state));
    for (let minute = 0; minute < 360 && state.encounters["procedure-patient"]!.stagedResultOrder?.status !== "remainder_pending"; minute += 1) {
      state = advance(state, 1);
    }
    const encounter = state.encounters["procedure-patient"]!;
    expect(state.serviceOperations[0]).toMatchObject({ status: "completed", cancellationReason: null });
    expect(state.serviceOperations[0]!.departureItinerary).toBeUndefined();
    expect(encounter.stagedResultOrder).toMatchObject({
      remainderMode: "external_processing",
      status: "remainder_pending",
      components: [{ status: "completed" }],
    });
    expect(encounter.pendingResult).toMatchObject({
      externalProcessingOnly: true,
      patientRemainsOnsite: true,
      offsiteTravel: null,
      pendingLabel: expect.stringContaining("External processing pending"),
      deliveredAtTick: null,
    });
    state = advance(state, 1);
    expect(state.encounters["procedure-patient"]!.patientMovement?.kind).not.toBe("departing_for_offsite_testing");
    expect(state.serviceIncomeReceipts.filter((receipt) => receipt.incomeLineId === "income.advanced_endoscopy")).toHaveLength(1);
  });

  it("holds the FHH later-follow-up node until paired serum collection finishes and the patient returns to Front Desk", () => {
    const clinicalCase = PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.find(
      (candidate) => candidate.id === "case.fhh.evaluation-to-confirmed-management",
    )!;
    const node = clinicalCase.decisionNodes.find(
      (candidate) => candidate.id === "node.fhh.initial-biochemical-evaluation.v1",
    )!;
    let state = prepareQuestion(phlebotomyProcedureState(), clinicalCase.id, node.primaryConceptId);
    placePatientInTestExam(state);
    state = acknowledgeDecisionFeedback(submit(state, true));
    let encounter = state.encounters["procedure-patient"]!;
    expect(encounter.currentNodeIndex).toBe(0);
    expect(encounter.testOnlyContinuation).toMatchObject({
      status: "waiting_for_service",
      serviceId: "service.basic_labs",
      routeId: "route.basic_labs.phlebotomy_sendout",
    });
    expect(state.serviceOperations[0]?.testChoiceOrder).toMatchObject({
      purpose: "continuation",
      choiceId: "paired_24h_urine_serum_values",
    });
    state = deserializeGameState(serializeGameState(state));
    for (let minute = 0; minute < 180 && state.encounters["procedure-patient"]!.currentNodeIndex === 0; minute += 1) {
      state = advance(state, 1);
    }
    encounter = state.encounters["procedure-patient"]!;
    expect(encounter.currentNodeIndex).toBe(1);
    expect(encounter.lifecycle).toBe("active_action_required");
    expect(encounter.steps[0]).toMatchObject({ status: "completed" });
    expect(encounter.steps[1]).toMatchObject({ status: "action_required" });
    expect(encounter.testOnlyContinuation).toMatchObject({ status: "completed" });
    expect(encounter.pendingResult).toBeNull();
    expect(encounter.deliveredResultNarratives).toEqual([]);
    expect(state.serviceIncomeReceipts).toHaveLength(1);
  });

  it("sends an interrupted continuation collection off site and returns before unlocking its follow-up", () => {
    const clinicalCase = PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.find(
      (candidate) => candidate.id === "case.fhh.evaluation-to-confirmed-management",
    )!;
    const node = clinicalCase.decisionNodes.find(
      (candidate) => candidate.id === "node.fhh.initial-biochemical-evaluation.v1",
    )!;
    let state = prepareQuestion(phlebotomyProcedureState(), clinicalCase.id, node.primaryConceptId);
    placePatientInTestExam(state);
    state = acknowledgeDecisionFeedback(submit(state, true));
    for (let minute = 0; minute < 120 && state.serviceOperations[0]?.status !== "in_service"; minute += 1) {
      state = advance(state, 1);
    }
    const operation = state.serviceOperations[0]!;
    const roomId = operation.reservedRoomInstanceIds[0]!;
    const preview = getRoomSalePreview(state, roomId, PROTOTYPE_DOMAIN_CONTEXT)!;
    state = gameReducer(state, {
      type: "SELL_ROOM",
      operationId: "sell.continuation.phlebotomy",
      roomId,
      saleConfirmationToken: preview.confirmationToken,
    });
    expect(state.encounters["procedure-patient"]!.testOnlyContinuation).toMatchObject({
      status: "external_arranged",
      saleInterruptedOffsite: { version: "sale-interrupted-continuation.v1" },
    });
    expect(state.serviceIncomeReceipts).toEqual([]);
    state = deserializeGameState(serializeGameState(state));
    let sawOffsite = false;
    let checkedContiguousDeparture = false;
    for (let minute = 0; minute < 480 && state.encounters["procedure-patient"]!.currentNodeIndex === 0; minute += 1) {
      state = advance(state, 1);
      const movement = state.encounters["procedure-patient"]!.patientMovement;
      if (!checkedContiguousDeparture && movement?.kind === "departing_for_offsite_testing") {
        for (let index = 1; index < movement.path.length; index += 1) {
          expect(Math.abs(movement.path[index]!.x - movement.path[index - 1]!.x) +
            Math.abs(movement.path[index]!.y - movement.path[index - 1]!.y)).toBe(1);
        }
        checkedContiguousDeparture = true;
      }
      sawOffsite ||= state.encounters["procedure-patient"]!.patientLocation === null;
    }
    const encounter = state.encounters["procedure-patient"]!;
    expect(sawOffsite).toBe(true);
    expect(checkedContiguousDeparture).toBe(true);
    expect(encounter.currentNodeIndex).toBe(1);
    expect(encounter.patientLocation).not.toBeNull();
    expect(encounter.testOnlyContinuation).toMatchObject({ status: "external_arranged" });
    expect(encounter.testOnlyContinuation?.saleInterruptedOffsite).toBeUndefined();
    expect(state.serviceIncomeReceipts).toEqual([]);
  });

  it("falls back to authored external result timing when the last local collection room is sold", () => {
    const clinicalCase = PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.find(
      (candidate) => candidate.id === "case.fap.new-parent",
    )!;
    const node = clinicalCase.decisionNodes.find(
      (candidate) => candidate.id === "node.fap.new-parent.1",
    )!;
    let state = prepareQuestion(phlebotomyProcedureState(), clinicalCase.id, node.primaryConceptId);
    placePatientInTestExam(state);
    state = acknowledgeDecisionFeedback(submit(state, true));
    const expectedExternalDuration = state.encounters["procedure-patient"]!.pendingResult!
      .durationTicks;
    const roomId = state.encounters["procedure-patient"]!.pendingResult!.patientTravel!
      .destinationRoomInstanceId;
    const preview = getRoomSalePreview(state, roomId, PROTOTYPE_DOMAIN_CONTEXT)!;
    state = gameReducer(state, {
      type: "SELL_ROOM",
      operationId: "sell.result-gate.phlebotomy",
      roomId,
      saleConfirmationToken: preview.confirmationToken,
    });
    expect(state.encounters["procedure-patient"]!.pendingResult).toMatchObject({
      patientTravel: null,
      offsiteTravel: null,
      deliveredAtTick: null,
    });
    expect(state.encounters["procedure-patient"]!.pendingResult?.localServiceOperation).toBeUndefined();
    expect(state.encounters["procedure-patient"]!.pendingResult?.patientRemainsOnsite).toBeUndefined();
    expect(state.encounters["procedure-patient"]!.pendingResult!.dueTick -
      state.encounters["procedure-patient"]!.pendingResult!.scheduledAtTick)
      .toBe(expectedExternalDuration);
    expect(state.serviceIncomeReceipts).toEqual([]);
    let sawOffsite = false;
    for (let minute = 0; minute < 480; minute += 1) {
      state = advance(state, 1);
      sawOffsite ||= state.encounters["procedure-patient"]!.patientLocation === null;
      const pending = state.encounters["procedure-patient"]!.pendingResult;
      if (pending?.deliveredAtTick !== null &&
          state.encounters["procedure-patient"]!.patientLocation !== null &&
          state.encounters["procedure-patient"]!.patientMovement?.kind !== "returning_from_offsite_testing") break;
    }
    expect(sawOffsite).toBe(true);
    expect(typeof state.encounters["procedure-patient"]!.pendingResult?.deliveredAtTick).toBe("number");
    expect(state.encounters["procedure-patient"]!.patientLocation).not.toBeNull();
    expect(state.serviceIncomeReceipts).toEqual([]);
  });

  it("preserves an authored result-gate return after its in-progress Endoscopy room is sold", () => {
    const clinicalCase = PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.find(
      (candidate) => candidate.id === "case.colorectal.routine-screen",
    )!;
    const node = clinicalCase.decisionNodes.find(
      (candidate) => candidate.id === "node.colorectal.routine-screen.1",
    )!;
    let state = prepareQuestion(endoscopyProcedureState(), clinicalCase.id, node.primaryConceptId);
    placePatientInTestExam(state);
    state = acknowledgeDecisionFeedback(submit(state, true));
    const expectedExternalDuration = state.encounters["procedure-patient"]!.pendingResult!
      .localServiceOperation!.externalDurationTicks;
    for (let minute = 0; minute < 240 && !(state.serviceOperations[0]?.status === "in_service" &&
      state.serviceOperations[0]?.phaseIndex === 1); minute += 1) {
      state = advance(state, 1);
    }
    expect(state.serviceOperations[0]).toMatchObject({
      status: "in_service",
      phaseIndex: 1,
      testChoiceOrder: { purpose: "result_gate" },
    });
    const roomId = state.serviceOperations[0]!.reservedRoomInstanceIds.find((id) =>
      state.rooms.find((room) => room.id === id)?.roomDefinitionId === "room.endoscopy")!;
    const preview = getRoomSalePreview(state, roomId, PROTOTYPE_DOMAIN_CONTEXT)!;
    state = gameReducer(state, {
      type: "SELL_ROOM",
      operationId: "sell.result-gate.endoscopy",
      roomId,
      saleConfirmationToken: preview.confirmationToken,
    });
    const pending = state.encounters["procedure-patient"]!.pendingResult!;
    expect(pending.localServiceOperation).toBeUndefined();
    expect(pending.dueTick - pending.scheduledAtTick).toBe(expectedExternalDuration);
    expect(pending.patientRemainsOnsite).toBeUndefined();
    expect(state.serviceIncomeReceipts).toEqual([]);
    state = deserializeGameState(serializeGameState(state));
    let sawOffsite = false;
    for (let minute = 0; minute < 600; minute += 1) {
      state = advance(state, 1);
      const current = state.encounters["procedure-patient"]!;
      sawOffsite ||= current.patientLocation === null;
      if (typeof current.pendingResult?.deliveredAtTick === "number" && current.patientLocation !== null &&
          current.patientMovement?.kind !== "returning_from_offsite_testing") break;
    }
    expect(sawOffsite).toBe(true);
    expect(typeof state.encounters["procedure-patient"]!.pendingResult?.deliveredAtTick).toBe("number");
    expect(state.encounters["procedure-patient"]!.patientLocation).not.toBeNull();
    expect(state.serviceIncomeReceipts).toEqual([]);
  });

  it("routes the intermediate FAP genetic order through phlebotomy while retaining its authored result gate", () => {
    const clinicalCase = PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.find(
      (candidate) => candidate.id === "case.fap.new-parent",
    )!;
    const node = clinicalCase.decisionNodes.find(
      (candidate) => candidate.id === "node.fap.new-parent.1",
    )!;
    let state = prepareQuestion(phlebotomyProcedureState(), clinicalCase.id, node.primaryConceptId);
    placePatientInTestExam(state);
    state = submit(state, true);
    expect(state.encounters["procedure-patient"]!.pendingResult).toMatchObject({
      resultTypeId: "service.genetic_testing",
      routeId: "route.genetic_testing.phlebotomy_sendout",
      serviceDurationTicks: 180,
      serviceIncomeEligible: true,
      serviceIncomeLineId: "income.collection",
      serviceIncomeFee: 50,
      deliveredAtTick: null,
    });
    state = acknowledgeDecisionFeedback(state);
    const pending = state.encounters["procedure-patient"]!.pendingResult!;
    expect(pending.approvedProcedureTimingVersion).toBe(1);
    expect(pending.patientTravel).not.toBeNull();
    expect(pending.timingPhases?.[0]).toMatchObject({
      id: "phase.genetic_testing.collection",
      durationTicks: 15,
      resourceBound: true,
    });
    expect(pending.timingPhases![0]!.startsAtTick).toBeGreaterThanOrEqual(
      pending.patientTravel!.outboundArrivalTick,
    );
    expect(pending.timingPhases?.[1]).toMatchObject({
      id: "phase.genetic_testing.sendout",
      durationTicks: 165,
      resourceBound: false,
    });
    expect(state.encounters["procedure-patient"]!.currentNodeIndex).toBe(0);
    expect(state.encounters["procedure-patient"]!.deliveredResultNarratives).toEqual([]);
  });

  it("falls back offsite when an approved ultrasound room, technician, or provider is already reserved", () => {
    let state = prepareQuestion(
      ultrasoundProcedureState(),
      "case.thyroid-nodule.palpable-referral",
      "concept.thyroid-nodule.fna-selection",
    );
    state = submit(state, true);
    expect(state.encounters["procedure-patient"]!.pendingResult?.routeId).toBe("route.thyroid_fna.in_house");
    expect(getEligibleServiceRoute(
      state,
      "service.breast_core_needle_biopsy",
      ["route.breast_core_needle_biopsy.outsourced"],
      PROTOTYPE_DOMAIN_CONTEXT,
      "another-encounter",
    )?.route.id).toBe("route.breast_core_needle_biopsy.outsourced");
  });

  it("keeps newly admitted mapped cases behind the minor-procedure capability", () => {
    const state = createInitialGameState();
    const gatedCaseIds = PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases
      .filter((clinicalCase) => clinicalCase.requiredCapabilityIds.includes("capability.minor_procedure"))
      .map((clinicalCase) => clinicalCase.id);
    expect(gatedCaseIds).toContain("case.bread-butter.superficial-incisional-ssi.purulent-staple-line");
    expect(gatedCaseIds.some((id) => id.startsWith("case.cutaneous-scc."))).toBe(true);
    expect(gatedCaseIds.some((id) => id.startsWith("case.pigmented-skin-lesion."))).toBe(true);
    const attempted = gameReducer(state, { type: "ADMIT_PATIENT", operationId: "gated.case", encounterId: "gated", caseId: "case.bread-butter.superficial-incisional-ssi.purulent-staple-line", patientDisplayName: "Gated Patient", arrivalClass: "routine" });
    expect(attempted.operationReceipts["gated.case"]?.status).toBe("rejected");
  });
});
