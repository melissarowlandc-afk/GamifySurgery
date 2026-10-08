import { describe, expect, it } from "vitest";
import { getServiceIncomeLine } from "@gamify-surgery/balance-config";
import {
  advanceServiceOperations, completeWaitingRoomExperience, createRoomUpgradeRecoveryQuote,
  deserializeGameState, gameReducer, getNewPeriopServiceOperationPhases, normalizeRoomUpgradeExperience,
  getRadiologistReadingStation, reconcileReadingStations,
  normalizeRoomUpgradeRecoveryQuote, observeWaitingRoomExperience, planDiagnosticOrder, serializeGameState,
  startDiagnosticAcquisitionOperation, startDiagnosticProcessingOperation, startEncounterProcedureOperation,
  type DiagnosticOrderPlan, type DiagnosticTimingRequest, type DomainContext, type GameState,
  type PlacedRoom, type RoomUpgradeLevel, type ServiceOperationState,
} from "../src";
import { pending, timingFixture } from "./diagnostic-timing-fixtures";

type Fixture = ReturnType<typeof timingFixture>;
const levels = [1, 2, 3, 4, 5] as const;
const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;
let sequence = 0;

function fixture(): Fixture {
  const result = timingFixture();
  const state = result.state;
  state.paused = false;
  state.serviceAppointmentsEnabled = false;
  state.nextRoutineArrivalTick = state.nextFinancialPostingTick = state.nextExternalRetailOpportunityTick =
    state.nextEmployeeDiscussionTick = Number.MAX_SAFE_INTEGER;
  state.environment.nextLitterSpawnTick = state.environment.nextWaterCoolerDrainTick =
    state.environment.nextAmbientPedestrianTick = Number.MAX_SAFE_INTEGER;
  state.environment.waterCoolerFillPercent = 100;
  state.retailNextOpportunityTicks["founder:founder"] = Number.MAX_SAFE_INTEGER;
  state.openChartEncounterId = state.attendedEncounterId = null;
  result.encounter.checkInStatus = "checked_in";
  result.encounter.nextIdleActionAtFacilityTick = Number.MAX_SAFE_INTEGER;
  result.encounter.arrivalClass = "routine";
  result.encounter.waiting.patienceExempt = false;
  // Isolate the purchased comfort from independent base care/environment effects.
  const satisfaction = result.context.balanceRelease.patientSatisfaction;
  satisfaction.correctCareRecovery = satisfaction.incorrectCarePenalty = satisfaction.cleanRoomCompletionBonus =
    satisfaction.dirtyRoomCompletionPenalty = satisfaction.maximumAmenityCompletionBonus =
    satisfaction.happyStaffCompletionBonus = satisfaction.unhappyStaffCompletionPenalty = 0;
  return result;
}

function tick(state: GameState, context: DomainContext, minutes = 1): GameState {
  for (let index = 0; index < minutes; index++) state = gameReducer(state,
    { type: "ADVANCE_TICK", operationId: `upgrade.experience.tick.${sequence++}` }, context);
  return state;
}

function terminal(result: Fixture): void {
  const encounter = result.state.encounters[result.encounter.id]!;
  encounter.currentNodeIndex = encounter.frozenCase.decisionNodes.length - 1;
  encounter.steps.forEach((step, index) => { step.status = index < encounter.currentNodeIndex ? "completed" : "action_required"; });
  encounter.lifecycle = "active_action_required";
}

function attend(result: Fixture, room: PlacedRoom): void {
  const encounter = result.state.encounters[result.encounter.id]!;
  const anchor = { x: room.x + 1, y: room.y + 1 };
  encounter.patientLocation = { ...anchor };
  encounter.patientMovement = null;
  encounter.assignedRoomInstanceId = room.id;
  encounter.queuedCareRoomInstanceId = null;
  encounter.waitingDestination = null;
  result.state.openChartEncounterId = result.state.attendedEncounterId = encounter.id;
  result.state.environment.founderLocation = { ...anchor };
  result.state.environment.founderActivity = { kind: "attend_encounter", targetId: encounter.id,
    path: [anchor], pathIndex: 0, lastMovedAtFacilityTick: result.state.facilityTick, workMinutesRemaining: Number.MAX_SAFE_INTEGER };
}

function submit(result: Fixture): void {
  const encounter = result.state.encounters[result.encounter.id]!;
  const node = encounter.frozenCase.decisionNodes[encounter.currentNodeIndex]!;
  const choice = node.answerChoices.find((entry) => !entry.isCorrect)!;
  const id = `upgrade.experience.answer.${sequence++}`;
  result.state = gameReducer(result.state, { type: "SUBMIT_ANSWER", operationId: id,
    encounterId: encounter.id, decisionNodeId: node.id, answerChoiceId: choice.id,
    reviewedAtMs: 10_000 + sequence }, result.context);
  expect(result.state.operationReceipts[id]?.status).toBe("applied");
}

function wait(result: Fixture, level: RoomUpgradeLevel, satisfaction = 100): PlacedRoom {
  const waiting = result.addRoom("room.waiting");
  waiting.room.upgradeLevel = level;
  const encounter = result.state.encounters[result.encounter.id]!;
  encounter.lifecycle = "waiting_unopened";
  encounter.patientSatisfaction = satisfaction;
  encounter.patientLocation = { ...waiting.anchor };
  encounter.patientMovement = null;
  encounter.assignedRoomInstanceId = null;
  encounter.waitingDestination = { roomInstanceId: waiting.room.id, location: { ...waiting.anchor }, kind: "standing" };
  encounter.idleWaitingSinceTick = encounter.lastSatisfactionDecayAtTick = result.state.facilityTick;
  return waiting.room;
}

function arrive(result: Fixture, job: ServiceOperationState): void {
  if (job.path.length) {
    job.pathIndex = job.path.length - 1; job.location = { ...job.path.at(-1)! };
    if (job.actorKind === "encounter") result.state.encounters[job.actorId]!.patientLocation = { ...job.location };
  }
  for (const employee of result.state.employees) if (employee.facilityTask?.targetId === job.id || employee.facilityTask?.kind === "cover_periop") {
    employee.pathIndex = employee.path.length - 1;
    if (employee.path.length) employee.location = { ...employee.path.at(-1)! };
  }
  const founder = result.state.environment.founderActivity;
  if (founder?.targetId === job.id) {
    founder.pathIndex = founder.path.length - 1;
    result.state.environment.founderLocation = { ...founder.path.at(-1)! };
  }
}

function advance(result: Fixture, atTick = result.state.facilityTick): void {
  result.state.facilityTick = atTick;
  advanceServiceOperations(result.state, result.context);
}

function finishRecovery(result: Fixture, job: ServiceOperationState): void {
  for (let attempt = 0; attempt < 30 && job.completedAtFacilityTick === null; attempt++) {
    arrive(result, job); advance(result);
    if (job.status === "in_service") advance(result, job.phaseEndsAtFacilityTick!);
    else advance(result, result.state.facilityTick + 1);
  }
  expect(job.completedAtFacilityTick).not.toBeNull();
}

function plan(result: Fixture, request: Omit<DiagnosticTimingRequest, "orderId" | "encounterId">): DiagnosticOrderPlan {
  const quote = planDiagnosticOrder(result.state, { orderId: `upgrade.experience.order.${sequence++}`,
    encounterId: result.encounter.id, ...request }, result.context);
  if (quote.kind !== "planned") throw new Error(quote.reason);
  return quote.plan;
}

function choiceOrder(result: Fixture, contract: DiagnosticOrderPlan): NonNullable<ServiceOperationState["testChoiceOrder"]> {
  const source = contract.sources[0]!;
  return { version: "test-choice-order.v1", purpose: "terminal", caseId: result.encounter.frozenCase.id,
    nodeId: "node.experience", questionVariantId: "variant.experience", choiceId: "choice.experience", choiceLabel: "Fixture care",
    serviceId: source.serviceId!, routeId: source.routeId!, routeDisplayName: source.routeDisplayName, externalRemainder: null };
}

describe("actual Waiting and Examination comfort", () => {
  it.each(levels)("defers Level %s Waiting points until after actual waiting loss and care", (level) => {
    const result = fixture(); const room = wait(result, level);
    result.state = tick(result.state, result.context);
    let encounter = result.state.encounters[result.encounter.id]!;
    expect(encounter.patientSatisfaction).toBe(100);
    expect(encounter.roomUpgradeExperience?.waiting).toMatchObject({ roomInstanceId: room.id, points: 2 * (level - 1), appliedAtFacilityTick: null });
    const config = result.context.balanceRelease.patientSatisfaction;
    result.state = tick(result.state, result.context, config.idleGraceMinutes + 2 * config.decayIntervalMinutes);
    encounter = result.state.encounters[result.encounter.id]!;
    const before = encounter.patientSatisfaction;
    expect(before).toBeLessThan(100);
    const losses = clone(encounter.dissatisfactionByCause);
    terminal(result); attend(result, result.state.rooms.find((entry) => entry.roomDefinitionId === "room.examination")!);
    submit(result);
    encounter = result.state.encounters[result.encounter.id]!;
    expect(encounter.patientSatisfaction).toBe(Math.min(100, before + 2 * (level - 1)));
    expect(encounter.finalPatientSatisfaction).toBe(encounter.patientSatisfaction);
    expect(encounter.dissatisfactionByCause).toEqual(losses);
    expect(encounter.roomUpgradeExperience?.waiting?.appliedAtFacilityTick).toBe(result.state.facilityTick);
  });

  it.each(levels)("awards Level %s Examination once at an actually attended decision", (level) => {
    const result = fixture(); terminal(result);
    const exam = result.state.rooms.find((room) => room.roomDefinitionId === "room.examination")!;
    exam.upgradeLevel = level; result.encounter.patientSatisfaction = 50;
    attend(result, exam); submit(result);
    const encounter = result.state.encounters[result.encounter.id]!;
    expect(encounter.finalPatientSatisfaction).toBe(50 + 2 * (level - 1));
    expect(encounter.roomUpgradeExperience?.examination).toMatchObject({ roomInstanceId: exam.id, points: 2 * (level - 1), appliedAtFacilityTick: result.state.facilityTick });
  });

  it("applies Waiting and Examination comfort after the decision's care loss", () => {
    const result = fixture(); wait(result, 2); result.state = tick(result.state, result.context);
    result.context.balanceRelease.patientSatisfaction.incorrectCarePenalty = 5;
    const exam = result.state.rooms.find((room) => room.roomDefinitionId === "room.examination")!;
    exam.upgradeLevel = 2;
    terminal(result); attend(result, exam); submit(result);
    expect(result.state.encounters[result.encounter.id]!.finalPatientSatisfaction).toBe(99);
  });

  it.each(["patient_walking", "founder_walking", "founder_elsewhere", "unrelated_attendance", "reservation_only"] as const)("does not count %s as examination", (mode) => {
    const result = fixture(); terminal(result);
    const exam = result.state.rooms.find((room) => room.roomDefinitionId === "room.examination")!;
    exam.upgradeLevel = 5; result.encounter.patientSatisfaction = 50; attend(result, exam);
    const anchor = { ...result.encounter.patientLocation! };
    if (mode === "patient_walking") result.encounter.patientMovement = { kind: "walking_to_care", path: [{ x: 7, y: 4 }, anchor], pathIndex: 0, lastMovedAtFacilityTick: 0, destinationRoomInstanceId: exam.id };
    if (mode === "founder_walking") Object.assign(result.state.environment.founderActivity!, { path: [{ x: 7, y: 4 }, anchor], pathIndex: 0 });
    if (mode === "founder_elsewhere") result.state.environment.founderLocation = { x: 7, y: 4 };
    if (mode === "unrelated_attendance") result.state.environment.founderActivity!.targetId = "another.encounter";
    if (mode === "reservation_only") result.encounter.patientLocation = { x: 7, y: 4 };
    submit(result);
    expect(result.state.encounters[result.encounter.id]!.roomUpgradeExperience?.examination).toBeUndefined();
    expect(result.state.encounters[result.encounter.id]!.finalPatientSatisfaction).toBe(50);
  });

  it("binds the decision's actual exam copy, never an unused arrival or upgraded reservation", () => {
    const result = fixture(); terminal(result);
    const first = result.state.rooms.find((room) => room.roomDefinitionId === "room.examination")!;
    first.upgradeLevel = 5;
    const used: PlacedRoom = { ...first, id: "room.exam.actual", y: 15, upgradeLevel: 2 };
    result.state.rooms.push(used);
    result.encounter.patientSatisfaction = 50;
    attend(result, first);
    expect(result.encounter.roomUpgradeExperience?.examination).toBeUndefined();
    attend(result, used); submit(result);
    expect(result.state.encounters[result.encounter.id]!.roomUpgradeExperience?.examination).toMatchObject({ roomInstanceId: used.id, points: 2 });
    expect(result.state.encounters[result.encounter.id]!.finalPatientSatisfaction).toBe(52);
  });

  it("records zero and capped decisions, and cannot farm another copy after reload or reopening", () => {
    for (const level of [1, 5] as const) {
      const result = fixture();
      const exam = result.state.rooms.find((room) => room.roomDefinitionId === "room.examination")!;
      exam.upgradeLevel = level; result.encounter.patientSatisfaction = 100;
      result.encounter.lifecycle = "active_action_required"; attend(result, exam); submit(result);
      let saved = deserializeGameState(serializeGameState(result.state), result.context);
      const encounter = saved.encounters[result.encounter.id]!;
      expect(encounter.roomUpgradeExperience?.examination?.points).toBe(2 * (level - 1));
      const witness = clone(encounter.roomUpgradeExperience!.examination);
      saved = gameReducer(saved, { type: "CLOSE_CHART", operationId: `upgrade.close.${sequence++}`, encounterId: encounter.id }, result.context);
      result.state = saved;
      terminal(result);
      result.state.rooms.find((room) => room.id === exam.id)!.upgradeLevel = 5;
      result.state.encounters[encounter.id]!.patientSatisfaction = 50;
      attend(result, result.state.rooms.find((room) => room.id === exam.id)!); submit(result);
      expect(result.state.encounters[encounter.id]!.roomUpgradeExperience?.examination).toEqual(witness);
      expect(result.state.encounters[encounter.id]!.finalPatientSatisfaction).toBe(50);
    }
  });

  it("freezes the first used Waiting copy through upgrades, excursions and reload", () => {
    const result = fixture(); const used = wait(result, 1, 60);
    result.state = tick(result.state, result.context);
    const other: PlacedRoom = { ...used, id: "room.waiting.other", y: 27, upgradeLevel: 5 };
    result.state.rooms.push(other); used.upgradeLevel = 5;
    result.state = deserializeGameState(serializeGameState(result.state), result.context);
    const encounter = result.state.encounters[result.encounter.id]!;
    encounter.patientLocation = null;
    observeWaitingRoomExperience(result.state, encounter, result.context);
    encounter.patientLocation = { x: other.x + 1, y: other.y + 1 };
    encounter.idleWaitingSinceTick = 0;
    result.state = tick(result.state, result.context);
    expect(result.state.encounters[encounter.id]!.roomUpgradeExperience?.waiting).toMatchObject({ roomInstanceId: used.id, points: 0 });
    completeWaitingRoomExperience(result.state.encounters[encounter.id]!, result.state.facilityTick);
    expect(result.state.encounters[encounter.id]!.patientSatisfaction).toBe(60);
    completeWaitingRoomExperience(result.state.encounters[encounter.id]!, result.state.facilityTick);
    expect(result.state.encounters[encounter.id]!.patientSatisfaction).toBe(60);
  });

  it("requires observed idle waiting, rather than a reservation or arrival pass-through", () => {
    const result = fixture(); const room = wait(result, 5);
    observeWaitingRoomExperience(result.state, result.encounter, result.context);
    expect(result.encounter.roomUpgradeExperience).toBeUndefined();
    result.state.facilityTick = 1; result.encounter.patientLocation = { x: 7, y: room.y + 1 };
    observeWaitingRoomExperience(result.state, result.encounter, result.context);
    expect(result.encounter.roomUpgradeExperience).toBeUndefined();
    result.encounter.patientLocation = { x: room.x + 1, y: room.y + 1 };
    result.encounter.patientMovement = { kind: "walking_to_waiting", path: [result.encounter.patientLocation], pathIndex: 0, lastMovedAtFacilityTick: 0, destinationRoomInstanceId: room.id };
    observeWaitingRoomExperience(result.state, result.encounter, result.context);
    expect(result.encounter.roomUpgradeExperience).toBeUndefined();
  });

  it("awards used Waiting at final completion even if the decision is made while walking", () => {
    const result = fixture(); wait(result, 3, 60); result.state = tick(result.state, result.context);
    terminal(result); result.state.encounters[result.encounter.id]!.patientLocation = { x: 7, y: 4 };
    submit(result);
    expect(result.state.encounters[result.encounter.id]!.finalPatientSatisfaction).toBe(64);
    expect(result.state.encounters[result.encounter.id]!.roomUpgradeExperience?.examination).toBeUndefined();
  });

  it("awards used Waiting once immediately before the walkout final score", () => {
    const result = fixture(); wait(result, 3, 60); result.state = tick(result.state, result.context);
    const encounter = result.state.encounters[result.encounter.id]!;
    encounter.patientSatisfaction = 1; encounter.walkoutThreshold = 59;
    encounter.idleWaitingSinceTick = -result.context.balanceRelease.patientSatisfaction.idleGraceMinutes;
    encounter.lastSatisfactionDecayAtTick = 0;
    const receipts = clone(result.state.serviceIncomeReceipts);
    result.state = tick(result.state, result.context, result.context.balanceRelease.patientSatisfaction.decayIntervalMinutes);
    for (let minute = 0; minute < 200 && result.state.encounters[encounter.id]!.resolutionReason === null; minute++) {
      result.state = tick(result.state, result.context);
    }
    const ended = result.state.encounters[encounter.id]!;
    expect(ended.resolutionReason).toBe("walkout");
    expect(ended.finalPatientSatisfaction).toBe(4);
    expect(ended.roomUpgradeExperience?.waiting?.appliedAtFacilityTick).not.toBeNull();
    expect(result.state.serviceIncomeReceipts).toEqual(receipts);
    result.state = deserializeGameState(serializeGameState(result.state), result.context);
    completeWaitingRoomExperience(result.state.encounters[encounter.id]!, result.state.facilityTick);
    expect(result.state.encounters[encounter.id]!.finalPatientSatisfaction).toBe(4);
  });

  it("awards used Waiting at actual patient-present prep start, never at room reservation", () => {
    const result = fixture();
    result.addRoom("room.periop_recovery", "staff.periop_nurse"); result.addRoom("room.endoscopy", "staff.endoscopy_nurse");
    wait(result, 3, 60); result.state = tick(result.state, result.context);
    const encounter = result.state.encounters[result.encounter.id]!;
    expect(startEncounterProcedureOperation(result.state, encounter, "income.endoscopy", result.context)).toBe(true);
    const job = result.state.serviceOperations[0]!;
    advance(result);
    expect(job.status).toBe("walking_to_service");
    expect(encounter.patientSatisfaction).toBe(60);
    expect(encounter.roomUpgradeExperience?.waiting?.appliedAtFacilityTick).toBeNull();
    arrive(result, job); advance(result);
    expect(job.status).toBe("in_service");
    expect(job.frozenOperationPhases![job.phaseIndex]!.roomStationId).toBe("periop_preparation");
    expect(encounter.patientSatisfaction).toBe(64);
    expect(encounter.roomUpgradeExperience?.recovery).toBeUndefined();
  });
});

describe("Recovery comfort and frozen carriers", () => {
  it.each(levels)("awards Level %s only when actual Recovery finishes, with the accepted level", (level) => {
    const result = fixture();
    const periop = result.addRoom("room.periop_recovery", "staff.periop_nurse");
    const procedure = result.addRoom("room.endoscopy", "staff.endoscopy_nurse");
    periop.room.upgradeLevel = level; result.encounter.patientSatisfaction = 50;
    result.encounter.patientLocation = { ...periop.anchor }; result.state.environment.founderLocation = { ...procedure.anchor };
    expect(startEncounterProcedureOperation(result.state, result.encounter, "income.endoscopy", result.context)).toBe(true);
    const job = result.state.serviceOperations[0]!;
    periop.room.upgradeLevel = 5;
    advance(result); arrive(result, job); advance(result);
    expect(job.phaseIndex).toBe(0); expect(job.roomUpgradeRecovery?.boundRoom).toBeNull();
    expect(result.encounter.roomUpgradeExperience?.recovery).toBeUndefined();
    Object.assign(result.state, deserializeGameState(serializeGameState(result.state), result.context));
    const savedJob = result.state.serviceOperations[0]!;
    finishRecovery(result, savedJob);
    const encounter = result.state.encounters[result.encounter.id]!;
    expect(encounter.patientSatisfaction).toBe(50 + 2 * (level - 1));
    expect(encounter.roomUpgradeExperience?.recovery).toMatchObject({ roomInstanceId: periop.room.id, points: 2 * (level - 1), operationId: savedJob.id });
    advance(result, result.state.facilityTick + 1);
    expect(encounter.patientSatisfaction).toBe(50 + 2 * (level - 1));
  });

  it.each([true, false])("carries a diagnostic source into remapped, nonbillable physical Recovery (marked=%s)", (marked) => {
    const result = fixture();
    result.addRoom("room.endoscopy", "staff.endoscopy_nurse");
    const periop = result.addRoom("room.periop_recovery", "staff.periop_nurse"); periop.room.upgradeLevel = 2;
    result.encounter.patientLocation = { ...periop.anchor }; result.encounter.patientSatisfaction = result.encounter.finalPatientSatisfaction = 60;
    result.encounter.resolutionReason = "completed"; result.encounter.resolvedAtFacilityTick = 0;
    const contract = plan(result, { serviceId: "service.colonoscopy", patientOrigin: periop.anchor });
    // Accepted diagnostic work may give its service-engine phase a distinct ID.
    contract.phases.find((phase) => phase.kind === "recovery")!.operationPhaseId = "operation.remapped.recovery";
    const source = contract.sources[0]!;
    if (!marked) delete source.roomUpgradeRecovery;
    // This accepted physical contract is nonbillable; its room comfort is independent of payment.
    delete source.incomeLineId; delete source.quoteFee; delete source.roomUpgradeRevenue;
    result.encounter.pendingResult = pending(contract);
    Object.assign(result.state, deserializeGameState(serializeGameState(result.state), result.context));
    const savedEncounter = result.state.encounters[result.encounter.id]!;
    const savedPlan = savedEncounter.pendingResult!.diagnosticTiming!;
    result.state.rooms.find((room) => room.id === periop.room.id)!.upgradeLevel = 5;
    const baseline = { cash: result.state.cashCents, xp: result.state.clinicalXp, reviews: clone(result.state.learningHistories), settlements: clone(result.state.settlements) };
    const id = startDiagnosticAcquisitionOperation(result.state, savedEncounter, savedPlan, null, null, choiceOrder(result, savedPlan), result.context)!;
    const job = result.state.serviceOperations.find((entry) => entry.id === id)!;
    expect(Boolean(job.roomUpgradeRecovery)).toBe(marked);
    if (marked) {
      expect(job.roomUpgradeRecovery!.phaseId).not.toBe(source.roomUpgradeRecovery!.phaseId);
      expect(job.frozenOperationPhases!.some((phase) => phase.id === job.roomUpgradeRecovery!.phaseId && phase.roomStationId === "periop_recovery")).toBe(true);
    }
    finishRecovery(result, job);
    expect(savedEncounter.patientSatisfaction).toBe(marked ? 62 : 60);
    expect(savedEncounter.finalPatientSatisfaction).toBe(marked ? 62 : 60);
    expect(result.state.cashCents).toBe(baseline.cash); expect(result.state.clinicalXp).toBe(baseline.xp);
    expect(result.state.learningHistories).toEqual(baseline.reviews); expect(result.state.settlements).toEqual(baseline.settlements);
    expect(result.state.serviceIncomeReceipts).toHaveLength(0);
    Object.assign(result.state, deserializeGameState(serializeGameState(result.state), result.context));
    advance(result, result.state.facilityTick + 1);
    expect(result.state.encounters[savedEncounter.id]!.finalPatientSatisfaction).toBe(marked ? 62 : 60);
  });

  it("uses one actual Recovery copy rather than summing unused upgraded rooms", () => {
    const result = fixture();
    const used = result.addRoom("room.periop_recovery", "staff.periop_nurse");
    result.addRoom("room.endoscopy", "staff.endoscopy_nurse"); used.room.upgradeLevel = 2;
    const unused: PlacedRoom = { ...used.room, id: "room.recovery.unused", x: 14, upgradeLevel: 5 };
    result.state.rooms.push(unused); result.state.doors.push({ id: "door.recovery.unused", roomId: unused.id, side: "west", offset: 1, exterior: false });
    result.encounter.patientLocation = { ...used.anchor }; result.encounter.patientSatisfaction = 50;
    expect(startEncounterProcedureOperation(result.state, result.encounter, "income.endoscopy", result.context)).toBe(true);
    const job = result.state.serviceOperations[0]!;
    used.room.upgradeLevel = 5; unused.upgradeLevel = 1;
    finishRecovery(result, job);
    expect(job.roomUpgradeRecovery?.boundRoom).toEqual({ roomInstanceId: used.room.id, points: 2 });
    expect(result.encounter.patientSatisfaction).toBe(52);
  });

  it("keeps an unmarked active Recovery neutral across an upgrade and reload", () => {
    const result = fixture();
    const periop = result.addRoom("room.periop_recovery", "staff.periop_nurse");
    result.addRoom("room.endoscopy", "staff.endoscopy_nurse"); periop.room.upgradeLevel = 2;
    result.encounter.patientLocation = { ...periop.anchor }; result.encounter.patientSatisfaction = 50;
    expect(startEncounterProcedureOperation(result.state, result.encounter, "income.endoscopy", result.context)).toBe(true);
    const job = result.state.serviceOperations[0]!;
    for (let attempt = 0; attempt < 20 && !(job.phaseIndex === 2 && job.status === "in_service"); attempt++) {
      arrive(result, job); advance(result);
      if (job.status === "in_service" && job.phaseIndex < 2) advance(result, job.phaseEndsAtFacilityTick!);
      else advance(result, result.state.facilityTick + 1);
    }
    expect(job.roomUpgradeRecovery?.boundRoom?.points).toBe(2);
    // This is an already-started operation from before the room-comfort feature.
    delete job.roomUpgradeRecovery; periop.room.upgradeLevel = 5;
    Object.assign(result.state, deserializeGameState(serializeGameState(result.state), result.context));
    finishRecovery(result, result.state.serviceOperations[0]!);
    expect(result.state.encounters[result.encounter.id]!.patientSatisfaction).toBe(50);
    expect(result.state.encounters[result.encounter.id]!.roomUpgradeExperience?.recovery).toBeUndefined();
  });

  it.each([1, 5] as const)("records a zero/capped Level %s Recovery attempt and cannot award a second operation", (level) => {
    const result = fixture();
    const periop = result.addRoom("room.periop_recovery", "staff.periop_nurse");
    result.addRoom("room.endoscopy", "staff.endoscopy_nurse"); periop.room.upgradeLevel = level;
    result.encounter.patientLocation = { ...periop.anchor }; result.encounter.patientSatisfaction = 100;
    expect(startEncounterProcedureOperation(result.state, result.encounter, "income.endoscopy", result.context)).toBe(true);
    const first = result.state.serviceOperations[0]!; finishRecovery(result, first);
    expect(result.encounter.roomUpgradeExperience?.recovery?.points).toBe(2 * (level - 1));
    expect(result.encounter.patientSatisfaction).toBe(100);
    result.encounter.patientLocation = { x: 7, y: 4 };
    result.encounter.patientMovement = { kind: "returning_from_onsite_service", path: [{ x: 7, y: 4 }], pathIndex: 0,
      lastMovedAtFacilityTick: result.state.facilityTick, destinationRoomInstanceId: null };
    advance(result, result.state.facilityTick + 1);
    expect(first.status).toBe("completed");
    Object.assign(result.state, deserializeGameState(serializeGameState(result.state), result.context));
    const encounter = result.state.encounters[result.encounter.id]!;
    encounter.patientMovement = null;
    encounter.patientSatisfaction = 50;
    result.state.rooms.find((room) => room.id === periop.room.id)!.upgradeLevel = 5;
    expect(startEncounterProcedureOperation(result.state, encounter, "income.endoscopy", result.context)).toBe(true);
    finishRecovery(result, result.state.serviceOperations.at(-1)!);
    expect(encounter.patientSatisfaction).toBe(50);
    expect(encounter.roomUpgradeExperience?.recovery?.operationId).toBe(first.id);
  });

  it.each(["pending", "staged", "continuation"] as const)("preserves marked and legacy %s carrier acceptance", (carrier) => {
    for (const marked of [true, false]) {
      const result = fixture(); const periop = result.addRoom("room.periop_recovery", "staff.periop_nurse");
      result.addRoom("room.endoscopy", "staff.endoscopy_nurse"); periop.room.upgradeLevel = 2;
      const encounter = result.encounter; encounter.patientSatisfaction = 50;
      const node = encounter.frozenCase.decisionNodes[0]!; const choice = node.answerChoices.find((entry) => entry.isCorrect)!;
      encounter.lifecycle = "active_action_required"; encounter.steps[0]!.status = "feedback_pending";
      encounter.steps[0]!.answer = { decisionNodeId: node.id, primaryConceptId: node.primaryConceptId, answerChoiceId: choice.id,
        correct: true, ratingIntent: "Good", answeredAtFacilityTick: 0, explanation: "Fixture feedback", correctedForward: false };
      encounter.answers = [encounter.steps[0]!.answer];
      const phases = clone(getServiceIncomeLine("income.endoscopy")!.operation!.phases);
      if (carrier === "staged") result.state.employees.forEach((employee) => { employee.trainingLevel = 2; });
      if (carrier === "staged") phases.find((phase) => phase.roomDefinitionId === "room.periop_recovery")!.id = "accepted_custom_recovery";
      const roomUpgradeRecovery = marked ? createRoomUpgradeRecoveryQuote(result.state, getNewPeriopServiceOperationPhases("income.endoscopy", phases)!) : undefined;
      if (carrier === "pending") {
        const accepted = pending();
        Object.assign(accepted, { resultTypeId: "service.colonoscopy", routeId: "route.colonoscopy.in_house", serviceIncomeEligible: true,
          serviceIncomeLineId: "income.endoscopy", serviceIncomeFee: 450, roomUpgradeRecovery,
          localServiceOperation: { version: "pending-result-service-operation.v1", status: "feedback_pending", incomeLineId: "income.endoscopy", serviceOperationId: null, externalDurationTicks: 0 } });
        encounter.pendingResult = accepted; encounter.steps[0]!.result = accepted;
      } else if (carrier === "staged") {
        encounter.stagedResultOrder = { version: "staged-result-order.v1", originatingNodeIndex: 0, caseId: encounter.frozenCase.id,
          nodeId: node.id, questionVariantId: node.questionVariantId, choiceId: choice.id, choiceLabel: choice.label,
          status: "feedback_pending", remainderMode: "external_processing", currentComponentIndex: 0,
          components: [{ componentId: "experience.acquisition", serviceId: "service.colonoscopy", routeId: "route.colonoscopy.in_house",
            routeDisplayName: "Fixture endoscopy", incomeLineId: "income.endoscopy", quoteFee: 450, roomUpgradeRecovery,
            operationPhases: phases.map((phase) => ({ id: phase.id, roomDefinitionId: phase.roomDefinitionId,
              durationMinutes: phase.durationMinutes, staffRoleDefinitionIds: [...phase.staffRoleDefinitionIds],
              ...(phase.providerRoleDefinitionIds ? { providerRoleDefinitionIds: [...phase.providerRoleDefinitionIds] } : {}),
              ...(phase.founderEligible ? { founderEligible: true as const } : {}),
              ...(marked && phase.roomDefinitionId === "room.periop_recovery" ? { roomStationId: "periop_recovery" as const } : {}) })),
            externalRemainder: "Fixture remainder", status: "pending", serviceOperationId: null }], remainder: pending() };
      } else {
        encounter.testOnlyContinuation = { version: "test-only-continuation.v1", originatingNodeIndex: 0,
          serviceId: "service.colonoscopy", routeId: "route.colonoscopy.in_house", routeDisplayName: "Fixture endoscopy",
          incomeLineId: "income.endoscopy", externalRemainder: "Fixture remainder", quoteFee: 450, roomUpgradeRecovery,
          status: "feedback_pending", serviceOperationId: null, scheduledAtFacilityTick: 0, completedAtFacilityTick: null };
      }
      periop.room.upgradeLevel = 5;
      if (carrier === "staged") result.state.employees.forEach((employee) => { employee.trainingLevel = 5; });
      const restored = deserializeGameState(serializeGameState(result.state), result.context);
      if (marked && carrier === "staged") expect(restored.encounters[encounter.id]!.stagedResultOrder!.components[0]!.operationPhases.at(-1)!.roomStationId).toBe("periop_recovery");
      const command = `upgrade.experience.carrier.${sequence++}`;
      result.state = gameReducer(restored, { type: "ACKNOWLEDGE_DECISION_FEEDBACK", operationId: command, encounterId: encounter.id, decisionNodeId: node.id }, result.context);
      expect(result.state.operationReceipts[command]?.status).toBe("applied");
      const job = result.state.serviceOperations[0]!;
      expect(Boolean(job.roomUpgradeRecovery)).toBe(marked);
      if (marked && carrier === "staged") expect(job.roomUpgradeRecovery!.phaseId).toBe("accepted_custom_recovery");
      if (carrier === "staged") {
        expect(job.trainingTiming).toBeUndefined();
        expect(job.frozenOperationPhases!.map((phase) => phase.durationMinutes)).toEqual([30, 45, 60]);
      }
      Object.assign(result.state, deserializeGameState(serializeGameState(result.state), result.context));
      finishRecovery(result, result.state.serviceOperations[0]!);
      expect(result.state.encounters[encounter.id]!.patientSatisfaction).toBe(marked ? 52 : 50);
    }
  });

  it("does not complete a used Waiting witness when only remote processing starts", () => {
    const result = fixture(); result.addRoom("room.reading", "staff.radiologist");
    const used = wait(result, 3, 60); result.state = tick(result.state, result.context);
    reconcileReadingStations(result.state);
    for (const reader of result.state.employees) {
      const post = getRadiologistReadingStation(result.state, reader, result.context)!;
      reader.location = { ...post.location }; reader.path = [post.location]; reader.pathIndex = 0;
    }
    const contract = plan(result, { serviceId: "service.ultrasound", allowedRouteIds: ["route.ultrasound.outsourced"] });
    const work = contract.phases.find((phase) => phase.kind === "interpretation")!;
    const complete = (phaseId: string): void => {
      const phase = contract.phases.find((entry) => entry.id === phaseId)!;
      phase.dependsOn.forEach(complete); Object.assign(phase, { status: "completed", startedAtTick: 0, completedAtTick: 0, remainingMinutes: 0 });
    };
    work.dependsOn.forEach(complete);
    const id = startDiagnosticProcessingOperation(result.state, contract, work.id, result.context);
    expect(id).not.toBeNull(); advance(result);
    const encounter = result.state.encounters[result.encounter.id]!;
    expect(encounter.roomUpgradeExperience?.waiting).toMatchObject({ roomInstanceId: used.id, appliedAtFacilityTick: null });
    expect(encounter.patientSatisfaction).toBe(60);
    terminal(result); attend(result, result.state.rooms.find((room) => room.roomDefinitionId === "room.examination")!); submit(result);
    expect(result.state.encounters[encounter.id]!.finalPatientSatisfaction).toBe(64);
  });

  it("strictly rejects malformed marked quotes and witnesses instead of falling back to legacy", () => {
    const result = fixture(); const periop = result.addRoom("room.periop_recovery", "staff.periop_nurse");
    const phases = getNewPeriopServiceOperationPhases("income.endoscopy")!;
    const quote = createRoomUpgradeRecoveryQuote(result.state, phases)!;
    expect(() => normalizeRoomUpgradeRecoveryQuote({ ...quote, phaseId: phases[0]!.id }, phases)).toThrow(/experience/i);
    expect(() => normalizeRoomUpgradeRecoveryQuote({ ...quote, candidates: [{ roomInstanceId: periop.room.id, points: 3 }] }, phases)).toThrow(/experience/i);
    expect(() => normalizeRoomUpgradeRecoveryQuote({ ...quote, boundRoom: { roomInstanceId: periop.room.id, points: 8 } }, phases)).toThrow(/experience/i);
    result.addRoom("room.endoscopy", "staff.endoscopy_nurse");
    const contract = plan(result, { serviceId: "service.colonoscopy", patientOrigin: periop.anchor });
    contract.sources[0]!.roomUpgradeRecovery!.phaseId = "periop_preparation";
    result.encounter.pendingResult = pending(contract);
    expect(() => deserializeGameState(serializeGameState(result.state), result.context)).toThrow(/diagnostic order/i);
    result.encounter.pendingResult = null;
    expect(() => normalizeRoomUpgradeExperience({ version: "room-upgrade-experience.v1", waiting: { roomInstanceId: periop.room.id, points: 10, boundAtFacilityTick: 0, appliedAtFacilityTick: null } }, 0)).toThrow(/experience/i);
    result.encounter.roomUpgradeExperience = { version: "room-upgrade-experience.v1", examination: { roomInstanceId: periop.room.id, points: 2, boundAtFacilityTick: 0, appliedAtFacilityTick: null } };
    expect(() => deserializeGameState(serializeGameState(result.state), result.context)).toThrow(/experience/i);
  });
});

describe("Bathroom completion dirt decay", () => {
  it.each(levels)("retains fractional Level %s loss through reload without changing other rooms", (level) => {
    const result = fixture(); terminal(result);
    result.context.balanceRelease.patientSatisfaction.roomCleanlinessLossPerEncounter = 3;
    const bathroom = result.addRoom("room.bathroom"); bathroom.room.upgradeLevel = level;
    const unused = result.addRoom("room.waiting"); unused.room.upgradeLevel = 5;
    result.encounter.patientSatisfaction = 50;
    submit(result);
    const loss = 3 * (1 - .1 * (level - 1));
    expect(result.state.rooms.find((room) => room.id === bathroom.room.id)!.cleanliness).toBeCloseTo(100 - loss);
    expect(result.state.rooms.find((room) => room.id === unused.room.id)!.cleanliness).toBe(97);
    expect(result.state.encounters[result.encounter.id]!.finalPatientSatisfaction).toBe(50);
    const restored = deserializeGameState(serializeGameState(result.state), result.context);
    expect(restored.rooms.find((room) => room.id === bathroom.room.id)!.cleanliness).toBeCloseTo(100 - loss);
  });
});
