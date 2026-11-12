import { LEGACY_PROTOTYPE_CLINICAL_RELEASE } from "@gamify-surgery/clinical-content";
import { describe, expect, it } from "vitest";
import {
  PROTOTYPE_DOMAIN_CONTEXT,
  createInitialGameState,
  deserializeGameState,
  gameReducer,
  getCurrentCapabilities,
  getFacilityProgressionStatus,
  getEligibleServiceRoute,
  getCurrentQuestion,
  getPendingResultEta,
  getRoomDefinition,
  getRoomNavigationAnchor,
  serializeGameState,
  validateDomainContext,
  type DomainContext,
  type GameState,
} from "../src";

const XRAY_CASE_ID = "case.synthetic.xray-routing";

function createEndoscopyContext(): DomainContext {
  const release = JSON.parse(JSON.stringify(PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease)) as typeof PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease;
  const source = LEGACY_PROTOTYPE_CLINICAL_RELEASE.cases.find((item) => item.id === XRAY_CASE_ID)!;
  const testCase = JSON.parse(JSON.stringify(source)) as typeof source;
  testCase.id = "case.synthetic.unapproved.endoscopy-route-drill";
  testCase.displayName = "Unapproved local endoscopy route fixture";
  const node = testCase.decisionNodes[0]!;
  node.answerChoices.find((choice) => choice.isCorrect)!.serviceRequest = {
    serviceId: "service.endoscopy",
  };
  node.resultGateAfter = {
    ...node.resultGateAfter!,
    id: "gate.synthetic.unapproved.endoscopy-route-drill",
    resultTypeId: "service.endoscopy",
    allowedServiceRouteIds: ["route.endoscopy.in_house"],
  };
  release.cases.push(testCase);
  return validateDomainContext({ ...PROTOTYPE_DOMAIN_CONTEXT, clinicalRelease: release });
}

function stateWithEndoscopy(staff: {
  endoscopyNurse?: boolean;
  periopNurse?: boolean;
  endoscopist?: boolean;
} = {}): GameState {
  const state = createInitialGameState(undefined, {
    campaignId: "campaign.unapproved.endoscopy-fixture",
    campaignSeed: "unapproved-endoscopy-fixture",
    createdAtRealMs: 0,
  });
  state.facilityLevel = 2;
  state.encounters = {};
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  state.rooms.push(
    { id: "room.test.exam", roomDefinitionId: "room.examination", x: 33, y: 25, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
    { id: "room.test.endoscopy", roomDefinitionId: "room.endoscopy", x: 28, y: 23, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
    { id: "room.test.periop", roomDefinitionId: "room.periop_recovery", x: 26, y: 26, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
    ...[24, 25, 26, 27, 28].map((y) => ({ id: `room.test.hall.${y}`, roomDefinitionId: "room.hallway", x: 32, y, orientation: 0 as const, doorSide: null, upgradeLevel: 1 as const, cleanliness: 100 })),
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
      nextIdleActionAtFacilityTick: 100,
    });
  };
  if (staff.endoscopyNurse !== false) addEmployee("employee.test.endoscopy-nurse", "staff.endoscopy_nurse", "room.test.endoscopy", { x: 29, y: 24 });
  if (staff.periopNurse !== false) addEmployee("employee.test.periop-nurse", "staff.periop_nurse", "room.test.periop", { x: 29, y: 28 });
  if (staff.endoscopist === true) addEmployee("employee.test.endoscopist", "staff.endoscopist", "room.test.endoscopy", { x: 30, y: 24 });
  return state;
}

describe("Level 2 endoscopy operational capacity", () => {
  it("requires reachable rooms and both operational nurses, without relying on facility level", () => {
    const bareEndoscopyRoom = stateWithEndoscopy({
      endoscopyNurse: false,
      periopNurse: false,
    });
    bareEndoscopyRoom.rooms = bareEndoscopyRoom.rooms.filter(
      (room) =>
        room.id === "room.instance.founder_desk" ||
        room.id === "room.test.endoscopy",
    );
    bareEndoscopyRoom.doors = bareEndoscopyRoom.doors.filter(
      (door) => door.roomId === "room.instance.founder_desk");
    expect(getCurrentCapabilities(bareEndoscopyRoom)).not.toContain(
      "capability.endoscopy",
    );

    const complete = stateWithEndoscopy();
    expect(getCurrentCapabilities(complete)).toContain("capability.endoscopy");
    expect(getEligibleServiceRoute(complete, "service.endoscopy")?.route.id).toBe("route.endoscopy.in_house");

    for (const incomplete of [
      stateWithEndoscopy({ endoscopyNurse: false }),
      stateWithEndoscopy({ periopNurse: false }),
    ]) {
      expect(getCurrentCapabilities(incomplete)).not.toContain("capability.endoscopy");
      expect(getEligibleServiceRoute(incomplete, "service.endoscopy")).toBeNull();
    }
    const missingRecovery = stateWithEndoscopy();
    missingRecovery.rooms = missingRecovery.rooms.filter(
      (room) => room.id !== "room.test.periop",
    );
    expect(getCurrentCapabilities(missingRecovery)).not.toContain(
      "capability.endoscopy",
    );
    const unreachable = stateWithEndoscopy();
    unreachable.doors = unreachable.doors.filter((door) => door.roomId !== "room.test.endoscopy");
    expect(getCurrentCapabilities(unreachable)).not.toContain("capability.endoscopy");
  });

  it("prefers an available Endoscopist and otherwise freezes Founder coverage", () => {
    const withSpecialist = stateWithEndoscopy({ endoscopist: true });
    expect(getEligibleServiceRoute(withSpecialist, "service.endoscopy")?.providerReservation).toEqual({
      kind: "employee", employeeId: "employee.test.endoscopist", staffRoleDefinitionId: "staff.endoscopist",
    });
    const founderFallback = stateWithEndoscopy();
    expect(getEligibleServiceRoute(founderFallback, "service.endoscopy")?.providerReservation).toEqual({ kind: "founder" });
  });

  it("opens a returned Endoscopy question while the founder travels only as a consult", () => {
    const state = stateWithEndoscopy({ endoscopist: true });
    const source = Object.values(createInitialGameState().encounters)[0]!;
    const multiNodeCase = PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.find((candidate) => candidate.decisionNodes.length > 1)!;
    const encounter = JSON.parse(JSON.stringify(source)) as GameState["encounters"][string];
    encounter.frozenCase = JSON.parse(JSON.stringify(multiNodeCase)) as typeof encounter.frozenCase;
    encounter.steps = encounter.frozenCase.decisionNodes.map((node, index) => ({
      nodeIndex: index, decisionNodeId: node.id, questionVariantId: node.questionVariantId,
      primaryConceptId: node.primaryConceptId, status: index === 0 ? "completed" : index === 1 ? "action_required" : "locked",
      answer: null, result: null,
    }));
    encounter.id = "encounter.endoscopy.consult";
    encounter.checkInStatus = "checked_in";
    encounter.lifecycle = "active_action_required";
    encounter.currentNodeIndex = 1;
    encounter.patientMovement = null;
    encounter.patientLocation = { x: 34, y: 26 };
    encounter.assignedRoomInstanceId = null;
    encounter.pendingResult = {
      operationId: "result.endoscopy.consult", gateId: "gate.endoscopy.consult",
      originatingNodeIndex: 0, resultTypeId: "service.endoscopy", pendingLabel: "Endoscopy complete",
      resultNarrative: "Fixture result", routeId: "route.endoscopy.in_house", routeDisplayName: "Onsite endoscopy",
      scheduledAtTick: 0, serviceDurationTicks: 1, durationTicks: 1, dueTick: 1, deliveredAtTick: 1,
      offsiteReturnStartedAtTick: null, offsiteTravel: null,
      patientTravel: {
        version: "patient-travel.v1", originRoomInstanceId: "room.test.exam",
        destinationRoomInstanceId: "room.test.endoscopy", outboundPath: [], returnPath: [],
        tilesPerTick: 1, outboundStartTick: 0, outboundArrivalTick: 0,
        serviceCompletionTick: 1, returnArrivalTick: 1,
      },
      providerReservation: { kind: "employee", employeeId: "employee.test.endoscopist", staffRoleDefinitionId: "staff.endoscopist" },
    } as unknown as NonNullable<typeof encounter.pendingResult>;
    state.encounters[encounter.id] = encounter;
    const opened = gameReducer(state, {
      type: "OPEN_CHART", operationId: "endoscopy.consult.open", encounterId: encounter.id,
    });
    expect(opened.operationReceipts["endoscopy.consult.open"]?.status).toBe("applied");
    const question = getCurrentQuestion(opened, encounter.id)!;
    expect(opened.environment.founderActivity).toMatchObject({ kind: "attend_encounter", targetId: encounter.id });
    const endoscopyRoom = opened.rooms.find((room) => room.id === "room.test.endoscopy")!;
    expect(opened.environment.founderActivity?.path.at(-1)).toEqual(
      getRoomNavigationAnchor(endoscopyRoom, getRoomDefinition(endoscopyRoom.roomDefinitionId)!, "staff"),
    );
    expect(opened.encounters[encounter.id]?.patientMovement).toBeNull();
    expect(opened.encounters[encounter.id]?.assignedRoomInstanceId).toBeNull();
    expect(opened.encounters[encounter.id]?.pendingResult?.providerReservation).toEqual({
      kind: "employee", employeeId: "employee.test.endoscopist", staffRoleDefinitionId: "staff.endoscopist",
    });
    expect(opened.employees.find((employee) => employee.id === "employee.test.endoscopist")?.facilityTask).toBeFalsy();

    const answered = gameReducer(opened, {
      type: "SUBMIT_ANSWER",
      operationId: "endoscopy.consult.answer",
      encounterId: encounter.id,
      decisionNodeId: question.node.id,
      answerChoiceId: question.node.answerChoices[0]!.id,
      reviewedAtMs: 10_000,
    });
    expect(answered.environment.founderActivity).toBeNull();
    expect(answered.environment.pendingFounderConsult).toBeNull();
    const advanced = gameReducer(answered, {
      type: "ADVANCE_TICK",
      operationId: "endoscopy.consult.tick-after-answer",
    });
    expect(advanced.environment.founderActivity).toBeNull();
    expect(advanced.environment.pendingFounderConsult).toBeNull();
    expect(advanced.encounters[encounter.id]?.pendingResult?.providerReservation).toEqual({
      kind: "employee", employeeId: "employee.test.endoscopist", staffRoleDefinitionId: "staff.endoscopist",
    });
    expect(advanced.employees.find((employee) => employee.id === "employee.test.endoscopist")?.facilityTask).toBeFalsy();
  });

  it("runs the exact bidirectional terminal order through the staffed Endoscopy and Recovery episode", () => {
    let state = stateWithEndoscopy({ endoscopist: true });
    state.serviceAppointmentsEnabled = false;
    state.nextFinancialPostingTick = Number.MAX_SAFE_INTEGER;
    state.environment.nextLitterSpawnTick = Number.MAX_SAFE_INTEGER;
    state.environment.nextWaterCoolerDrainTick = Number.MAX_SAFE_INTEGER;
    state = gameReducer(state, {
      type: "ADMIT_PATIENT",
      operationId: "bidirectional.admit",
      encounterId: "encounter.bidirectional",
      caseId: "case.iron-deficiency.adult-man-fatigue",
      patientDisplayName: "Scope Patient",
      arrivalClass: "routine",
    });
    const encounter = state.encounters["encounter.bidirectional"]!;
    const nodeIndex = encounter.frozenCase.decisionNodes.findIndex(
      (node) => node.id === "node.iron-deficiency.adult-man-fatigue.2",
    );
    expect(nodeIndex).toBeGreaterThanOrEqual(0);
    encounter.currentNodeIndex = nodeIndex;
    encounter.steps.forEach((step, index) => {
      step.status = index < nodeIndex ? "completed" : index === nodeIndex ? "action_required" : "locked";
    });
    encounter.checkInStatus = "checked_in";
    encounter.lifecycle = "active_action_required";
    encounter.patientMovement = null;
    encounter.patientLocation = { x: 34, y: 26 };
    encounter.assignedRoomInstanceId = "room.test.exam";
    state.openChartEncounterId = encounter.id;
    state.attendedEncounterId = encounter.id;
    const question = getCurrentQuestion(state, encounter.id)!;
    state = gameReducer(state, {
      type: "SUBMIT_ANSWER",
      operationId: "bidirectional.answer",
      encounterId: encounter.id,
      decisionNodeId: question.node.id,
      answerChoiceId: "bidirectional_1",
      reviewedAtMs: 10_000,
    });
    state = gameReducer(state, {
      type: "ACKNOWLEDGE_TERMINAL_FEEDBACK",
      operationId: "bidirectional.feedback",
      encounterId: encounter.id,
    });
    state = gameReducer(state, {
      type: "CLOSE_CHART",
      operationId: "bidirectional.close",
      encounterId: encounter.id,
    });
    expect(state.serviceOperations[0]).toMatchObject({
      incomeLineId: "income.endoscopy",
      quoteFee: 450,
      status: "walking_to_service",
      testChoiceOrder: {
        purpose: "terminal",
        serviceId: "service.bidirectional_endoscopy",
        routeId: "route.bidirectional_endoscopy.in_house",
      },
    });
    for (let minute = 0; minute < 100 && state.serviceOperations[0]?.status !== "in_service"; minute += 1) {
      state = gameReducer(state, { type: "ADVANCE_TICK", operationId: `bidirectional.tick.${minute}` });
    }
    expect(state.serviceOperations[0]).toMatchObject({
      status: "in_service",
      phaseIndex: 0,
      reservedRoomInstanceIds: ["room.test.periop"],
      reservedEmployeeIds: [],
      periopBedReservation: {
        roomInstanceId: "room.test.periop",
        bedId: expect.any(String),
        endpoint: expect.any(Object),
      },
      providerReservation: null,
    });
    expect(state.employees.find((employee) => employee.id === "employee.test.periop-nurse")?.facilityTask).toMatchObject({
      kind: "periop_attention",
      targetId: state.serviceOperations[0]!.id,
    });
    expect(state.serviceOperations[0]!.phaseEndsAtFacilityTick! - state.serviceOperations[0]!.phaseStartedAtFacilityTick!).toBe(30);
    expect(state.encounters[encounter.id]!.patientMovement?.kind).not.toBe("leaving_after_resolution");
    for (let minute = 0; minute < 120 && !(state.serviceOperations[0]?.phaseIndex === 1 && state.serviceOperations[0]?.status === "in_service"); minute += 1) {
      state = gameReducer(state, { type: "ADVANCE_TICK", operationId: `bidirectional.recovery.tick.${minute}` });
    }
    expect(state.serviceOperations[0]).toMatchObject({
      phaseIndex: 1,
      status: "in_service",
      reservedRoomInstanceIds: ["room.test.endoscopy"],
      reservedEmployeeIds: ["employee.test.endoscopy-nurse"],
      providerReservation: { kind: "employee", employeeId: "employee.test.endoscopist" },
    });
    expect(getFacilityProgressionStatus(state).requirements.find(
      (requirement) => requirement.id === "progression.endoscopy_completion",
    )).toMatchObject({ met: false, current: 0, required: 1 });
    expect(state.serviceOperations[0]!.phaseEndsAtFacilityTick! - state.serviceOperations[0]!.phaseStartedAtFacilityTick!).toBe(45);
    expect(state.encounters[encounter.id]!.patientLocation).toEqual(
      state.serviceOperations[0]!.location,
    );
    for (let minute = 0; minute < 120 && !state.serviceIncomeReceipts.some((receipt) => receipt.actorId === encounter.id); minute += 1) {
      state = gameReducer(state, { type: "ADVANCE_TICK", operationId: `bidirectional.complete.tick.${minute}` });
    }
    expect(state.serviceIncomeReceipts.filter((receipt) => receipt.actorId === encounter.id)).toEqual([
      expect.objectContaining({ incomeLineId: "income.endoscopy", grossAmount: 450 }),
    ]);
    expect(state.serviceOperations[0]).toMatchObject({ status: "discharging" });
    expect(getFacilityProgressionStatus(state).requirements.find(
      (requirement) => requirement.id === "progression.endoscopy_completion",
    )).toMatchObject({ met: true, current: 1, required: 1 });
    expect(getFacilityProgressionStatus(deserializeGameState(serializeGameState(state))).requirements.find(
      (requirement) => requirement.id === "progression.endoscopy_completion",
    )).toMatchObject({ met: true, current: 1, required: 1 });
    expect(state.encounters[encounter.id]!.patientMovement?.kind).toBe("returning_from_onsite_service");
    expect(state.encounters[encounter.id]!.terminalTestOrder?.diagnosticTiming?.careComplete.reachedAtTick).toBeNull();
    for (let minute = 0; minute < 120 && state.encounters[encounter.id]!.patientLocation !== null; minute += 1) {
      state = gameReducer(state, { type: "ADVANCE_TICK", operationId: `bidirectional.depart.tick.${minute}` });
    }
    expect(state.encounters[encounter.id]!.patientLocation).toBeNull();
    expect(state.encounters[encounter.id]!.terminalTestOrder?.diagnosticTiming?.careComplete.reachedAtTick).toEqual(expect.any(Number));
    expect(state.serviceOperations[0]).toMatchObject({ status: "completed" });
    expect(state.serviceIncomeReceipts.filter((receipt) => receipt.actorId === encounter.id)).toHaveLength(1);
  });

  it("preserves a frozen markerless colonoscopy, periop retry, and external pathology follow-up", () => {
    let state = stateWithEndoscopy({ endoscopist: true });
    state.serviceAppointmentsEnabled = false;
    state.nextFinancialPostingTick = Number.MAX_SAFE_INTEGER;
    state.environment.nextLitterSpawnTick = Number.MAX_SAFE_INTEGER;
    state.environment.nextWaterCoolerDrainTick = Number.MAX_SAFE_INTEGER;
    state = gameReducer(state, {
      type: "ADMIT_PATIENT", operationId: "colonoscopy.admit",
      encounterId: "encounter.colonoscopy", caseId: "case.colorectal.routine-screen",
      patientDisplayName: "Colonoscopy Patient", arrivalClass: "routine",
    });
    const encounter = state.encounters["encounter.colonoscopy"]!;
    // Preserve the previous question-group contract rather than reinterpreting
    // saved work through the new exact-release phase planner.
    for (const node of encounter.frozenCase.decisionNodes) {
      const alternative = node.answerChoices.find((choice) => !choice.isCorrect);
      if (alternative) alternative.label += " [frozen prior wording]";
    }
    const nodeIndex = encounter.frozenCase.decisionNodes.findIndex(
      (node) => node.id === "node.colorectal.routine-screen.1",
    );
    expect(nodeIndex).toBeGreaterThanOrEqual(0);
    encounter.currentNodeIndex = nodeIndex;
    encounter.steps.forEach((step, index) => {
      step.status = index < nodeIndex ? "completed" : index === nodeIndex ? "action_required" : "locked";
    });
    encounter.checkInStatus = "checked_in";
    encounter.lifecycle = "active_action_required";
    encounter.patientMovement = null;
    encounter.patientLocation = { x: 34, y: 26 };
    encounter.assignedRoomInstanceId = "room.test.exam";
    state.openChartEncounterId = encounter.id;
    state.attendedEncounterId = encounter.id;
    const question = getCurrentQuestion(state, encounter.id)!;
    state = gameReducer(state, {
      type: "SUBMIT_ANSWER", operationId: "colonoscopy.answer",
      encounterId: encounter.id, decisionNodeId: question.node.id,
      answerChoiceId: "colonoscopy_1", reviewedAtMs: 11_000,
    });
    expect(state.encounters[encounter.id]!.pendingResult).toMatchObject({
      routeId: "route.colonoscopy.in_house",
      approvedProcedureTimingVersion: 1,
      providerReservation: null,
      serviceIncomeLineId: "income.endoscopy",
      serviceIncomeFee: 450,
      localServiceOperation: {
        status: "feedback_pending",
        incomeLineId: "income.endoscopy",
        serviceOperationId: null,
        externalDurationTicks: 180,
      },
    });
    state = gameReducer(state, {
      type: "ACKNOWLEDGE_DECISION_FEEDBACK", operationId: "colonoscopy.feedback",
      encounterId: encounter.id, decisionNodeId: question.node.id,
    });
    let pending = state.encounters[encounter.id]!.pendingResult!;
    expect(pending.timingPhases?.map((phase) => [phase.durationTicks, phase.resourceBound])).toEqual([
      [180, false],
    ]);
    expect(pending.patientTravel).toBeNull();
    expect(pending.localServiceOperation).toMatchObject({
      status: "waiting_for_service",
      serviceOperationId: state.serviceOperations[0]!.id,
    });
    expect(state.serviceOperations[0]).toMatchObject({
      phaseFlowVersion: 1,
      testChoiceOrder: { purpose: "result_gate" },
      frozenOperationPhases: [
        { id: "periop_preparation", durationMinutes: 30 },
        { id: "preparation_and_procedure.procedure", durationMinutes: 45 },
        { id: "recovery", durationMinutes: 60 },
      ],
    });
    state = deserializeGameState(serializeGameState(state));
    expect(state.encounters[encounter.id]!.pendingResult?.localServiceOperation).toMatchObject({
      status: "waiting_for_service",
      serviceOperationId: state.serviceOperations[0]!.id,
      externalDurationTicks: 180,
    });
    for (let minute = 0; minute < 120 && state.serviceOperations[0]?.phaseStartedAtFacilityTick === null; minute += 1) {
      state = gameReducer(state, { type: "ADVANCE_TICK", operationId: `colonoscopy.arrival.${state.facilityTick}` });
    }
    expect(state.serviceOperations[0]).toMatchObject({ phaseIndex: 0, status: "in_service", providerReservation: null });
    expect(getPendingResultEta(state, encounter.id)).toBeNull();
    expect(state.employees.find((employee) => employee.id === "employee.test.endoscopist")?.facilityTask).toBeFalsy();
    expect(state.encounters[encounter.id]!.deliveredResultNarratives).toEqual([]);
    const interruptedOperationId = state.serviceOperations[0]!.id;
    const periopRoomIndex = state.rooms.findIndex((room) => room.id === "room.test.periop");
    const [temporarilyUnavailablePeriop] = state.rooms.splice(periopRoomIndex, 1);
    state = gameReducer(state, { type: "ADVANCE_TICK", operationId: "colonoscopy.invalidate-prep" });
    expect(state.serviceOperations.find((operation) => operation.id === interruptedOperationId)?.status).toBe("waiting_for_resources");
    expect(state.encounters[encounter.id]!.pendingResult?.localServiceOperation?.serviceOperationId).toBe(interruptedOperationId);
    state.rooms.splice(periopRoomIndex, 0, temporarilyUnavailablePeriop!);
    state = gameReducer(state, { type: "ADVANCE_TICK", operationId: "colonoscopy.restore-prep" });
    const retryOperationId = state.encounters[encounter.id]!.pendingResult?.localServiceOperation?.serviceOperationId;
    expect(retryOperationId).toBeTruthy();
    expect(retryOperationId).toBe(interruptedOperationId);
    const linkedOperation = () =>
      state.serviceOperations.find((operation) => operation.id === retryOperationId);
    for (let minute = 0; minute < 240 && linkedOperation()?.status !== "completed"; minute += 1) {
      if (linkedOperation()?.completedAtFacilityTick === null) {
        expect(getPendingResultEta(state, encounter.id)).toBeNull();
      } else {
        expect(getPendingResultEta(state, encounter.id)).toBeLessThanOrEqual(180);
      }
      state = gameReducer(state, { type: "ADVANCE_TICK", operationId: `colonoscopy.work.${minute}` });
    }
    expect(linkedOperation()?.status).toBe("completed");
    expect(linkedOperation()?.completedCareProvenance).toEqual({
      version: "completed-care-provenance.v1",
      roomInstanceId: "room.test.endoscopy",
      provider: { kind: "employee", employeeId: "employee.test.endoscopist" },
    });
    pending = state.encounters[encounter.id]!.pendingResult!;
    expect(state.serviceIncomeReceipts.filter((receipt) => receipt.actorId === encounter.id)).toEqual([
      expect.objectContaining({ incomeLineId: "income.endoscopy", grossAmount: 450 }),
    ]);
    expect(pending.localServiceOperation?.status).toBe("external_processing");
    expect(pending.completedCareProvenance).toEqual({
      version: "completed-care-provenance.v1",
      serviceOperationId: linkedOperation()!.id,
      roomInstanceId: "room.test.endoscopy",
      provider: { kind: "employee", employeeId: "employee.test.endoscopist" },
    });
    state = deserializeGameState(serializeGameState(state));
    const completedConsultSave = serializeGameState(state);
    state = deserializeGameState(completedConsultSave);
    expect(serializeGameState(state)).toBe(completedConsultSave);
    pending = state.encounters[encounter.id]!.pendingResult!;
    expect(pending.completedCareProvenance?.roomInstanceId).toBe("room.test.endoscopy");
    const etaBeforeCountdown = getPendingResultEta(state, encounter.id);
    expect(etaBeforeCountdown).toBeGreaterThan(0);
    expect(etaBeforeCountdown).toBeLessThanOrEqual(180);
    expect(pending.dueTick - pending.scheduledAtTick).toBe(180);
    expect(pending.timingPhases).toEqual([
      expect.objectContaining({ durationTicks: 180, resourceBound: false, startsAtTick: pending.scheduledAtTick, endsAtTick: pending.dueTick }),
    ]);
    state = gameReducer(state, { type: "ADVANCE_TICK", operationId: "colonoscopy.external-countdown" });
    pending = state.encounters[encounter.id]!.pendingResult!;
    expect(getPendingResultEta(state, encounter.id)).toBe(etaBeforeCountdown! - 1);
    for (let minute = 0; minute < 120 && pending.onsiteReturn?.frontDeskArrivalTick === null; minute += 1) {
      state = gameReducer(state, { type: "ADVANCE_TICK", operationId: `colonoscopy.front-desk.${minute}` });
      pending = state.encounters[encounter.id]!.pendingResult!;
    }
    expect(pending.onsiteReturn?.frontDeskArrivalTick).not.toBeNull();
    expect(pending.deliveredAtTick).toBeNull();
    while (state.facilityTick < pending.dueTick) {
      state = gameReducer(state, { type: "ADVANCE_TICK", operationId: `colonoscopy.external.${state.facilityTick}` });
      pending = state.encounters[encounter.id]!.pendingResult!;
    }
    expect(pending.deliveredAtTick).toBe(state.facilityTick);
    expect(state.encounters[encounter.id]!.currentNodeIndex).toBe(nodeIndex + 1);
    expect(state.employees.find((employee) => employee.id === "employee.test.endoscopist")?.facilityTask).toBeNull();
    const beforeReturnedQuestion = state;
    state = gameReducer(state, {
      type: "OPEN_CHART",
      operationId: "colonoscopy.returned-question.open",
      encounterId: encounter.id,
    });
    const endoscopyRoom = state.rooms.find((room) => room.id === "room.test.endoscopy")!;
    const endoscopyConsultAnchor = getRoomNavigationAnchor(endoscopyRoom, getRoomDefinition(endoscopyRoom.roomDefinitionId)!, "staff");
    expect(state.environment.founderActivity).toMatchObject({
      kind: "attend_encounter",
      targetId: encounter.id,
    });
    expect(state.environment.founderActivity?.path.at(-1)).toEqual(endoscopyConsultAnchor);
    expect(state.employees.find((employee) => employee.id === "employee.test.endoscopist")?.facilityTask).toBeNull();

    // Another patient's finished in-suite test keeps its last in-room location
    // after that patient walks back to wait. It must not block the suite.
    const withStaleFinishedTest = deserializeGameState(serializeGameState(beforeReturnedQuestion));
    const finished = withStaleFinishedTest.serviceOperations.find((operation) => operation.id === retryOperationId)!;
    withStaleFinishedTest.serviceOperations.push({
      ...finished,
      id: "service-operation.other-patient-finished-test",
      actorId: "encounter.other-patient-waiting-for-results",
      status: "completed",
      location: { ...endoscopyConsultAnchor },
    });
    const reopened = gameReducer(withStaleFinishedTest, {
      type: "OPEN_CHART",
      operationId: "colonoscopy.returned-question.open-with-stale-test",
      encounterId: encounter.id,
    });
    expect(reopened.environment.founderActivity?.path.at(-1)).toEqual(endoscopyConsultAnchor);
  });

  it("holds both rooms, nurses, and Founder only through the last resource-bound phase", () => {
    const state = stateWithEndoscopy({ endoscopist: true });
    state.encounters["encounter.test.active"] = {
      id: "encounter.test.active",
      lifecycle: "active_pending_result",
      frozenCase: createEndoscopyContext().clinicalRelease.cases.find((item) => item.id.includes("endoscopy-route-drill"))!,
      patientDisplayName: "Unapproved fixture",
      arrivalClass: "routine",
      patientSatisfaction: 100,
      arrivedAtTick: 0,
      departureDueTick: null,
      patienceExempt: false,
      warningThresholdsShown: [],
      currentNodeIndex: 0,
      answers: [],
      steps: [],
      firstOpenedAtTick: null,
      idleWaitingSinceTick: null,
      nextIdleActionAtFacilityTick: 1,
      assignedRoomInstanceId: "room.test.exam",
      queuedCareRoomInstanceId: null,
      patientLocation: { x: 34, y: 26 },
      patientMovement: null,
      feedAttentionKind: null,
      dissatisfactionByCause: {},
      pendingResult: {
        operationId: "fixture", gateId: "fixture", originatingNodeIndex: 0, resultTypeId: "service.endoscopy", pendingLabel: "fixture", resultNarrative: "fixture", routeId: "route.endoscopy.in_house", routeDisplayName: "fixture", scheduledAtTick: 0, serviceDurationTicks: 120, durationTicks: 120, dueTick: 120, deliveredAtTick: null, offsiteReturnStartedAtTick: null, offsiteTravel: null, patientTravel: null,
        resourceReservations: [
          { roomDefinitionId: "room.endoscopy", staffRoleDefinitionId: "staff.endoscopy_nurse" },
          { roomDefinitionId: "room.periop_recovery", staffRoleDefinitionId: "staff.periop_nurse" },
        ],
        providerReservation: { kind: "founder" },
        timingPhases: [
          { id: "prep", durationTicks: 30, resourceBound: true, startsAtTick: 0, endsAtTick: 30 },
          { id: "procedure", durationTicks: 45, resourceBound: true, startsAtTick: 30, endsAtTick: 75 },
          { id: "recovery", durationTicks: 45, resourceBound: true, startsAtTick: 75, endsAtTick: 120 },
        ],
      },
    } as unknown as GameState["encounters"][string];
    expect(getEligibleServiceRoute(state, "service.endoscopy")).toBeNull();
    const blocked = gameReducer(state, { type: "MOVE_FOUNDER", operationId: "founder.blocked", destination: { x: 34, y: 26 } });
    expect(blocked.operationReceipts["founder.blocked"]?.status).toBe("rejected");
    state.encounters["encounter.test.active"]!.pendingResult!.providerReservation = {
      kind: "employee",
      employeeId: "employee.test.endoscopist",
      staffRoleDefinitionId: "staff.endoscopist",
    };
    const frontDesk = state.rooms.find((room) => room.id === "room.instance.founder_desk")!;
    const founderStillAvailable = gameReducer(state, {
      type: "MOVE_FOUNDER",
      operationId: "founder.available-with-specialist",
      destination: getRoomNavigationAnchor(
        frontDesk,
        getRoomDefinition(frontDesk.roomDefinitionId)!,
        "primary",
      ),
    });
    expect(
      founderStillAvailable.operationReceipts["founder.available-with-specialist"]
        ?.status,
    ).toBe("applied");
    state.facilityTick = 120;
    expect(getEligibleServiceRoute(state, "service.endoscopy")?.route.id).toBe("route.endoscopy.in_house");
  });

  it("round-trips frozen provider reservations in schema version 6 saves", () => {
    const state = createInitialGameState(undefined, {
      campaignSeed: "endoscopy-provider-save",
      createdAtRealMs: 0,
    });
    const raw = JSON.parse(serializeGameState(state));
    const encounterId = Object.keys(raw.encounters)[0]!;
    raw.encounters[encounterId].pendingResult = {
      operationId: "fixture", gateId: "fixture", originatingNodeIndex: 0,
      resultTypeId: "service.endoscopy", pendingLabel: "fixture",
      resultNarrative: "fixture", routeId: "route.endoscopy.in_house",
      routeDisplayName: "fixture", scheduledAtTick: 0,
      serviceDurationTicks: 120, durationTicks: 120, dueTick: 120,
      deliveredAtTick: null, offsiteReturnStartedAtTick: null,
      offsiteTravel: null, patientTravel: null,
      providerReservation: { kind: "employee", employeeId: "employee.test.endoscopist", staffRoleDefinitionId: "staff.endoscopist" },
    };
    const restored = deserializeGameState(JSON.stringify(raw));
    expect(restored.schemaVersion).toBe(9);
    expect(restored.encounters[encounterId]?.pendingResult?.providerReservation).toEqual({ kind: "employee", employeeId: "employee.test.endoscopist", staffRoleDefinitionId: "staff.endoscopist" });
  });
});
