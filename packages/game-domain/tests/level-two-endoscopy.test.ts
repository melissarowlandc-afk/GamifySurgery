import { LEGACY_PROTOTYPE_CLINICAL_RELEASE } from "@gamify-surgery/clinical-content";
import { describe, expect, it } from "vitest";
import {
  PROTOTYPE_DOMAIN_CONTEXT,
  createInitialGameState,
  deserializeGameState,
  gameReducer,
  getCurrentCapabilities,
  getEligibleServiceRoute,
  getCurrentQuestion,
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
      status: "waiting_for_resources",
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
      reservedRoomInstanceIds: expect.arrayContaining(["room.test.endoscopy", "room.test.periop"]),
      reservedEmployeeIds: expect.arrayContaining(["employee.test.endoscopy-nurse", "employee.test.periop-nurse"]),
      providerReservation: { kind: "employee", employeeId: "employee.test.endoscopist" },
    });
    expect(state.serviceOperations[0]!.phaseEndsAtFacilityTick! - state.serviceOperations[0]!.phaseStartedAtFacilityTick!).toBe(75);
    expect(state.encounters[encounter.id]!.patientMovement?.kind).not.toBe("leaving_after_resolution");
    for (let minute = 0; minute < 120 && !(state.serviceOperations[0]?.phaseIndex === 1 && state.serviceOperations[0]?.status === "in_service"); minute += 1) {
      state = gameReducer(state, { type: "ADVANCE_TICK", operationId: `bidirectional.recovery.tick.${minute}` });
    }
    expect(state.serviceOperations[0]).toMatchObject({
      phaseIndex: 1,
      status: "in_service",
      reservedRoomInstanceIds: ["room.test.periop"],
      reservedEmployeeIds: ["employee.test.periop-nurse"],
      providerReservation: null,
    });
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
    expect(state.serviceOperations[0]).toMatchObject({ status: "completed" });
    expect(state.encounters[encounter.id]!.patientMovement?.kind).toBe("leaving_after_resolution");
    for (let minute = 0; minute < 120 && state.encounters[encounter.id]!.patientLocation !== null; minute += 1) {
      state = gameReducer(state, { type: "ADVANCE_TICK", operationId: `bidirectional.depart.tick.${minute}` });
    }
    expect(state.encounters[encounter.id]!.patientLocation).toBeNull();
    expect(state.serviceOperations[0]).toMatchObject({ status: "completed" });
    expect(state.serviceIncomeReceipts.filter((receipt) => receipt.actorId === encounter.id)).toHaveLength(1);
  });

  it("starts a gated routine scope after patient and provider arrival, then preserves external pathology follow-up", () => {
    let state = stateWithEndoscopy({ endoscopist: true });
    state.serviceAppointmentsEnabled = false;
    state.nextFinancialPostingTick = Number.MAX_SAFE_INTEGER;
    state.environment.nextLitterSpawnTick = Number.MAX_SAFE_INTEGER;
    state.environment.nextWaterCoolerDrainTick = Number.MAX_SAFE_INTEGER;
    state = gameReducer(state, {
      type: "ADMIT_PATIENT", operationId: "celiac-scope.admit",
      encounterId: "encounter.celiac-scope", caseId: "case.celiac.chronic-diarrhea",
      patientDisplayName: "Celiac Scope Patient", arrivalClass: "routine",
    });
    const encounter = state.encounters["encounter.celiac-scope"]!;
    const nodeIndex = encounter.frozenCase.decisionNodes.findIndex(
      (node) => node.id === "node.celiac.chronic-diarrhea.2",
    );
    expect(nodeIndex).toBeGreaterThanOrEqual(0);
    encounter.currentNodeIndex = nodeIndex;
    encounter.steps.forEach((step, index) => {
      step.status = index < nodeIndex ? "completed" : index === nodeIndex ? "action_required" : "locked";
    });
    encounter.lifecycle = "active_action_required";
    encounter.patientMovement = null;
    encounter.patientLocation = { x: 34, y: 26 };
    encounter.assignedRoomInstanceId = "room.test.exam";
    state.openChartEncounterId = encounter.id;
    state.attendedEncounterId = encounter.id;
    const question = getCurrentQuestion(state, encounter.id)!;
    state = gameReducer(state, {
      type: "SUBMIT_ANSWER", operationId: "celiac-scope.answer",
      encounterId: encounter.id, decisionNodeId: question.node.id,
      answerChoiceId: "endoscopy_biopsy_1", reviewedAtMs: 11_000,
    });
    expect(state.encounters[encounter.id]!.pendingResult).toMatchObject({
      routeId: "route.upper_endoscopy_duodenal_biopsy.in_house",
      approvedProcedureTimingVersion: 1,
      providerReservation: { kind: "employee", employeeId: "employee.test.endoscopist" },
      serviceIncomeLineId: "income.endoscopy",
      serviceIncomeFee: 450,
    });
    state = gameReducer(state, {
      type: "ACKNOWLEDGE_DECISION_FEEDBACK", operationId: "celiac-scope.feedback",
      encounterId: encounter.id, decisionNodeId: question.node.id,
    });
    const pending = state.encounters[encounter.id]!.pendingResult!;
    expect(pending.timingPhases?.map((phase) => [phase.durationTicks, phase.resourceBound])).toEqual([
      [30, true], [45, true], [45, true], [180, false],
    ]);
    expect(pending.timingPhases![0]!.startsAtTick).toBeGreaterThanOrEqual(
      pending.patientTravel!.outboundArrivalTick,
    );
    expect(state.employees.find((employee) => employee.id === "employee.test.endoscopist")?.facilityTask).toMatchObject({
      kind: "perform_service", targetId: pending.operationId,
    });
    while (state.facilityTick < pending.timingPhases![0]!.startsAtTick + 2) {
      state = gameReducer(state, { type: "ADVANCE_TICK", operationId: `celiac-scope.arrival.${state.facilityTick}` });
    }
    const endoscopyRoom = state.rooms.find((room) => room.id === "room.test.endoscopy")!;
    expect(state.employees.find((employee) => employee.id === "employee.test.endoscopist")?.location).toEqual(
      getRoomNavigationAnchor(endoscopyRoom, getRoomDefinition(endoscopyRoom.roomDefinitionId)!, "staff"),
    );
    expect(state.encounters[encounter.id]!.deliveredResultNarratives).toEqual([]);
    for (let minute = 0; minute < 180 && !state.serviceIncomeReceipts.some((receipt) => receipt.actorId === encounter.id); minute += 1) {
      state = gameReducer(state, { type: "ADVANCE_TICK", operationId: `celiac-scope.work.${minute}` });
    }
    expect(state.serviceIncomeReceipts.filter((receipt) => receipt.actorId === encounter.id)).toEqual([
      expect.objectContaining({ incomeLineId: "income.endoscopy", grossAmount: 450 }),
    ]);
    expect(state.encounters[encounter.id]!.currentNodeIndex).toBe(nodeIndex);
    expect(state.encounters[encounter.id]!.pendingResult?.deliveredAtTick).toBeNull();
    expect(state.employees.find((employee) => employee.id === "employee.test.endoscopist")?.facilityTask).toBeNull();
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
    const founderStillAvailable = gameReducer(state, {
      type: "MOVE_FOUNDER",
      operationId: "founder.available-with-specialist",
      destination: { x: 34, y: 26 },
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
    expect(restored.schemaVersion).toBe(8);
    expect(restored.encounters[encounterId]?.pendingResult?.providerReservation).toEqual({ kind: "employee", employeeId: "employee.test.endoscopist", staffRoleDefinitionId: "staff.endoscopist" });
  });
});
