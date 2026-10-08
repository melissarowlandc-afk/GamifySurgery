import { describe, expect, it } from "vitest";
import { getServiceIncomeLine } from "@gamify-surgery/balance-config";
import {
  advanceEmployeeMovement, advanceRetailOperations, advanceServiceOperations, authorizeRetailOrder,
  deserializeGameState, gameReducer, interruptServiceOperationsForRoomSale, planDiagnosticOrder,
  serializeGameState, startDiagnosticAcquisitionOperation, startDiagnosticProcessingOperation,
  startEncounterProcedureOperation, startRetailPurchase, startServiceOperation,
  type DiagnosticOrderPlan, type DiagnosticTimingRequest, type DomainContext, type GameState,
  type PlacedRoom, type ServiceOperationState,
} from "../src";
import {
  bindRoomUpgradeRevenueQuote, createRoomUpgradeRevenueQuote, getRoomUpgradeQuotedFee,
  normalizeRoomUpgradeRevenueQuote,
} from "../src/room-upgrades";
import { pending, timingFixture } from "./diagnostic-timing-fixtures";

type Fixture = ReturnType<typeof timingFixture>;
let sequence = 0;

function fixture(): Fixture {
  const result = timingFixture();
  const state = result.state;
  state.paused = false;
  state.cash = 10_000;
  state.cashCents = 1_000_000;
  state.serviceAppointmentsEnabled = false;
  state.nextRoutineArrivalTick = state.nextFinancialPostingTick = state.nextExternalRetailOpportunityTick =
    state.nextEmployeeDiscussionTick = Number.MAX_SAFE_INTEGER;
  state.environment.nextLitterSpawnTick = state.environment.nextWaterCoolerDrainTick = Number.MAX_SAFE_INTEGER;
  state.environment.waterCoolerFillPercent = 100;
  state.environment.pendingFounderConsult = null;
  state.retailNextOpportunityTicks["founder:founder"] = Number.MAX_SAFE_INTEGER;
  return result;
}

function tick(state: GameState, context: DomainContext, minutes = 1): GameState {
  for (let index = 0; index < minutes; index++) state = gameReducer(state,
    { type: "ADVANCE_TICK", operationId: `upgrade.revenue.tick.${sequence++}` }, context);
  return state;
}

function advance(result: Fixture, atTick = result.state.facilityTick): void {
  result.state.facilityTick = atTick;
  advanceServiceOperations(result.state, result.context);
}

/** Explicit arrival keeps payment assertions independent of idle staff policy. */
function arrive(result: Fixture, job: ServiceOperationState): void {
  if (job.path.length) {
    job.pathIndex = job.path.length - 1;
    job.location = { ...job.path.at(-1)! };
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

function finish(result: Fixture, job: ServiceOperationState): void {
  for (let attempt = 0; attempt < 20 && !result.state.serviceIncomeReceipts.some((receipt) => receipt.actorId === job.actorId); attempt++) {
    arrive(result, job);
    advance(result);
    if (job.status === "in_service") advance(result, job.phaseEndsAtFacilityTick!);
  }
  expect(result.state.serviceIncomeReceipts.some((receipt) => receipt.actorId === job.actorId)).toBe(true);
}

function alternative(result: Fixture, original: PlacedRoom, level: PlacedRoom["upgradeLevel"]): PlacedRoom {
  const room = { ...original, id: `${original.id}.alternative`, y: original.y + 6, upgradeLevel: level };
  result.state.rooms.push(room);
  result.state.doors.push({ id: `door.${room.id}`, roomId: room.id, side: "west", offset: 1, exterior: false });
  return room;
}

function diagnosticPlan(result: Fixture, request: Omit<DiagnosticTimingRequest, "orderId" | "encounterId">): DiagnosticOrderPlan {
  const quote = planDiagnosticOrder(result.state,
    { orderId: `upgrade.order.${sequence++}`, encounterId: result.encounter.id, ...request }, result.context);
  if (quote.kind !== "planned") throw new Error(quote.reason);
  return quote.plan;
}

function choiceOrder(result: Fixture, plan: DiagnosticOrderPlan): NonNullable<ServiceOperationState["testChoiceOrder"]> {
  const source = plan.sources[0]!;
  return { version: "test-choice-order.v1", purpose: "terminal", caseId: result.encounter.frozenCase.id,
    nodeId: "node.upgrade", questionVariantId: "variant.upgrade", choiceId: "choice.upgrade", choiceLabel: "Upgrade fixture",
    serviceId: source.serviceId!, routeId: source.routeId!, routeDisplayName: source.routeDisplayName, externalRemainder: null };
}

describe("actual-room revenue upgrades", () => {
  it.each([
    ["income.minor_procedure_simple", "room.minor_procedure", undefined, 112],
    ["income.ultrasound", "room.ultrasound", "staff.imaging_technician", 134.4],
    ["income.xray", "room.xray", "staff.imaging_technician", 100.8],
    ["income.ct", "room.ct", "staff.imaging_technician", 201.6],
    ["income.collection", "room.phlebotomy", "staff.phlebotomist", 56],
  ] as const)("pays %s once using its actual Level 3 room", (lineId, roomDefinitionId, roleId, gross) => {
    const result = fixture();
    const room = result.addRoom(roomDefinitionId, roleId);
    room.room.upgradeLevel = 3;
    result.encounter.patientLocation = { ...room.anchor };
    result.state.environment.founderLocation = { ...room.anchor };
    expect(startEncounterProcedureOperation(result.state, result.encounter, lineId, result.context)).toBe(true);
    const job = result.state.serviceOperations[0]!;
    advance(result);
    arrive(result, job);
    advance(result);
    expect(job.roomUpgradeRevenue?.boundRoom?.roomInstanceId).toBe(room.room.id);
    expect(job.quoteFee).toBe(gross);
    room.room.upgradeLevel = 5;
    const restored = deserializeGameState(serializeGameState(result.state), result.context);
    Object.assign(result.state, restored);
    const savedJob = result.state.serviceOperations[0]!;
    const cash = result.state.cash;
    finish(result, savedJob);
    expect(result.state.cash).toBeCloseTo(cash + gross);
    expect(result.state.serviceIncomeReceipts).toEqual([expect.objectContaining({ incomeLineId: lineId, grossAmount: gross })]);
    advance(result, result.state.facilityTick + 1);
    expect(result.state.serviceIncomeReceipts).toHaveLength(1);
  });

  it("uses one copy's accepted level rather than later upgrades or unused copies", () => {
    const result = fixture();
    const primary = result.addRoom("room.ultrasound", "staff.imaging_technician");
    primary.room.upgradeLevel = 2;
    const other = alternative(result, primary.room, 5);
    result.encounter.patientLocation = { ...primary.anchor };
    expect(startEncounterProcedureOperation(result.state, result.encounter, "income.ultrasound", result.context)).toBe(true);
    const job = result.state.serviceOperations[0]!;
    expect(job.roomUpgradeRevenue?.boundRoom).toBeNull();
    primary.room.upgradeLevel = 5;
    other.upgradeLevel = 1;
    advance(result);
    arrive(result, job);
    advance(result);
    expect(job.quoteFee).toBe(127.2);
    expect(job.roomUpgradeRevenue?.boundRoom).toEqual({ roomInstanceId: primary.room.id, multiplier: 1.06 });
    finish(result, job);
    expect(result.state.serviceIncomeReceipts[0]?.grossAmount).toBe(127.2);
  });

  it.each([
    ["income.endoscopy", "room.endoscopy", "staff.endoscopy_nurse", 504],
    ["income.ambulatory_operation", "room.ambulatory_or", "staff.or_nurse", 1008],
  ] as const)("attributes %s to the procedure suite, not upgraded prep/recovery", (lineId, roomId, roleId, gross) => {
    const result = fixture();
    const recovery = result.addRoom("room.periop_recovery", "staff.periop_nurse");
    recovery.room.upgradeLevel = 5;
    const earning = result.addRoom(roomId, roleId);
    earning.room.upgradeLevel = 3;
    result.encounter.patientLocation = { ...recovery.anchor };
    result.state.environment.founderLocation = { ...earning.anchor };
    expect(startEncounterProcedureOperation(result.state, result.encounter, lineId, result.context)).toBe(true);
    const job = result.state.serviceOperations[0]!;
    advance(result); arrive(result, job); advance(result);
    expect(job).toMatchObject({ phaseIndex: 0, status: "in_service" });
    expect(job.roomUpgradeRevenue?.boundRoom).toBeNull();
    finish(result, job);
    expect(job.roomUpgradeRevenue?.boundRoom?.roomInstanceId).toBe(earning.room.id);
    expect(result.state.serviceIncomeReceipts[0]?.grossAmount).toBe(gross);
  });

  it.each([false, true])("transfers a reserved earning room while preserving work-start attribution (started=%s)", (started) => {
    const result = fixture();
    const recovery = result.addRoom("room.periop_recovery", "staff.periop_nurse");
    const earning = result.addRoom("room.endoscopy", "staff.endoscopy_nurse");
    earning.room.upgradeLevel = 2;
    const replacement = alternative(result, earning.room, 4);
    result.encounter.patientLocation = { ...recovery.anchor };
    result.state.environment.founderLocation = { ...earning.anchor };
    expect(startEncounterProcedureOperation(result.state, result.encounter, "income.endoscopy", result.context)).toBe(true);
    const job = result.state.serviceOperations[0]!;
    advance(result); arrive(result, job); advance(result);
    expect(job.roomUpgradeRevenue?.boundRoom).toBeNull();
    advance(result, job.phaseEndsAtFacilityTick!);
    advance(result);
    expect(job.phaseIndex).toBe(1);
    expect(job.reservedRoomInstanceIds).toContain(earning.room.id);
    expect(job.roomUpgradeRevenue?.boundRoom).toBeNull();
    if (started) {
      arrive(result, job); advance(result);
      expect(job.status).toBe("in_service");
      advance(result, result.state.facilityTick + 5);
      expect(job.quoteFee).toBe(477);
    }
    interruptServiceOperationsForRoomSale(result.state, earning.room.id, earning.room.roomDefinitionId, result.context);
    result.state.rooms = result.state.rooms.filter((room) => room.id !== earning.room.id);
    result.state.doors = result.state.doors.filter((door) => door.roomId !== earning.room.id);
    const nurse = result.state.employees.find((employee) => employee.staffRoleDefinitionId === "staff.endoscopy_nurse")!;
    nurse.homeRoomInstanceId = replacement.id;
    // The room-sale reducer displaces stranded actors to surviving public floor.
    const publicFloor = { x: 7, y: earning.room.y + 1 };
    nurse.location = { x: replacement.x + 1, y: replacement.y + 1 };
    nurse.path = [{ ...nurse.location }]; nurse.pathIndex = 0;
    result.state.environment.founderLocation = { ...publicFloor };
    job.location = { ...publicFloor };
    result.encounter.patientLocation = { ...publicFloor };
    replacement.upgradeLevel = 5;
    advance(result); arrive(result, job); advance(result);
    expect(job.status).toBe("in_service");
    expect(job.quoteFee).toBe(started ? 477 : 531);
    expect(job.roomUpgradeRevenue?.boundRoom?.roomInstanceId).toBe(started ? earning.room.id : replacement.id);
    finish(result, job);
    expect(result.state.serviceIncomeReceipts[0]?.grossAmount).toBe(started ? 477 : 531);
  });

  it("applies the suite bonus to the separate scheduled Endoscopy visitor fee", () => {
    const result = fixture();
    const recovery = result.addRoom("room.periop_recovery", "staff.periop_nurse");
    const earning = result.addRoom("room.endoscopy", "staff.endoscopy_nurse"); earning.room.upgradeLevel = 2;
    result.state.environment.founderLocation = { ...earning.anchor };
    const id = startServiceOperation(result.state, "income.endoscopy", "visitor", result.context);
    expect(id).not.toBeNull();
    const job = result.state.serviceOperations.find((entry) => entry.id === id)!;
    expect(job.quoteFee).toBe(600);
    job.status = "waiting_for_resources";
    job.location = { ...recovery.anchor }; job.path = [{ ...recovery.anchor }]; job.pathIndex = 0;
    job.visitorTravel!.arrivedAtFacilityTick = 0;
    finish(result, job);
    expect(result.state.serviceIncomeReceipts[0]).toMatchObject({ actorKind: "visitor", grossAmount: 636 });
  });

  it("binds a pending fee to actual resource-phase presence after a pre-work room transfer", () => {
    const result = fixture();
    const initial = result.addRoom("room.ultrasound", "staff.imaging_technician"); initial.room.upgradeLevel = 2;
    const replacement = alternative(result, initial.room, 4);
    const accepted = pending();
    Object.assign(accepted, { resultTypeId: "service.ultrasound", routeId: "route.ultrasound.in_house",
      serviceDurationTicks: 30, durationTicks: 30, dueTick: 30, patientRemainsOnsite: true,
      serviceIncomeEligible: true, serviceIncomeLineId: "income.ultrasound", serviceIncomeFee: 120,
      roomUpgradeRevenue: createRoomUpgradeRevenueQuote(result.state, 120, ["room.ultrasound"]),
      timingPhases: [{ id: "acquisition", durationTicks: 8, resourceBound: true, startsAtTick: 2, endsAtTick: 10 },
        { id: "interpretation", durationTicks: 20, resourceBound: false, startsAtTick: 10, endsAtTick: 30 }] });
    result.encounter.lifecycle = "active_pending_result";
    result.encounter.pendingResult = accepted;
    result.encounter.steps[0]!.status = "result_pending";
    result.encounter.steps[0]!.result = accepted;
    result.encounter.assignedRoomInstanceId = initial.room.id;
    let state = tick(result.state, result.context);
    expect(state.encounters[result.encounter.id]!.pendingResult!.roomUpgradeRevenue?.boundRoom).toBeNull();
    const encounter = state.encounters[result.encounter.id]!;
    encounter.patientLocation = { x: replacement.x + 1, y: replacement.y + 1 };
    encounter.patientMovement = null;
    encounter.assignedRoomInstanceId = replacement.id;
    state.rooms.find((room) => room.id === replacement.id)!.upgradeLevel = 5;
    state = tick(state, result.context);
    expect(state.encounters[encounter.id]!.pendingResult).toMatchObject({ serviceIncomeFee: 141.6,
      roomUpgradeRevenue: { boundRoom: { roomInstanceId: replacement.id, multiplier: 1.18 } } });
    state = deserializeGameState(serializeGameState(state), result.context);
    state = tick(state, result.context, 8);
    expect(state.serviceIncomeReceipts).toEqual([expect.objectContaining({ incomeLineId: "income.ultrasound", grossAmount: 141.6 })]);
  });

  it("does not backdate a bonus from a new room and keeps future revenue metadata inert", () => {
    const result = fixture();
    const room = result.addRoom("room.ultrasound");
    room.room.upgradeLevel = 2;
    const quote = createRoomUpgradeRevenueQuote(result.state, 120, ["room.ultrasound"])!;
    const newRoom = alternative(result, room.room, 5);
    bindRoomUpgradeRevenueQuote(quote, newRoom.id);
    expect(getRoomUpgradeQuotedFee(quote)).toBe(120);
    expect(createRoomUpgradeRevenueQuote(result.state, 120, ["room.mri"])).toBeUndefined();
  });

  it("preserves markerless queued operation overrides and rejects inconsistent marked saves", () => {
    const result = fixture();
    const room = result.addRoom("room.ultrasound", "staff.imaging_technician");
    room.room.upgradeLevel = 5;
    result.encounter.patientLocation = { ...room.anchor };
    startEncounterProcedureOperation(result.state, result.encounter, "income.ultrasound", result.context);
    const job = result.state.serviceOperations[0]!;
    delete job.roomUpgradeRevenue;
    job.quoteFee = 37;
    Object.assign(result.state, deserializeGameState(serializeGameState(result.state), result.context));
    finish(result, result.state.serviceOperations[0]!);
    expect(result.state.serviceIncomeReceipts[0]?.grossAmount).toBe(37);
    const marked = createRoomUpgradeRevenueQuote(result.state, 120, ["room.ultrasound"])!;
    expect(() => normalizeRoomUpgradeRevenueQuote(marked, 37)).toThrow(/room upgrade revenue/i);
    bindRoomUpgradeRevenueQuote(marked, room.room.id);
    marked.boundRoom!.multiplier = 2;
    expect(() => normalizeRoomUpgradeRevenueQuote(marked, 240)).toThrow(/room upgrade revenue/i);
  });
});

describe("diagnostic revenue carriers", () => {
  it.each([
    ["pending", true], ["pending", false], ["staged", true], ["staged", false],
    ["continuation", true], ["continuation", false],
  ] as const)("preserves %s carrier acceptance when a factory wraps it (marked=%s)", (carrier, marked) => {
    const result = fixture();
    const us = result.addRoom("room.ultrasound", "staff.imaging_technician"); us.room.upgradeLevel = 2;
    const encounter = result.encounter;
    const node = encounter.frozenCase.decisionNodes[0]!;
    const choice = node.answerChoices.find((entry) => entry.isCorrect)!;
    encounter.lifecycle = "active_action_required";
    encounter.steps[0]!.status = "feedback_pending";
    encounter.steps[0]!.answer = { decisionNodeId: node.id, primaryConceptId: node.primaryConceptId,
      answerChoiceId: choice.id, correct: true, ratingIntent: "Good", answeredAtFacilityTick: 0,
      explanation: "Fixture feedback", correctedForward: false };
    encounter.answers = [encounter.steps[0]!.answer];
    const quoteFee = marked ? 120 : 37;
    const roomUpgradeRevenue = marked ? createRoomUpgradeRevenueQuote(result.state, quoteFee, ["room.ultrasound"]) : undefined;
    if (carrier === "pending") {
      const accepted = pending();
      Object.assign(accepted, { resultTypeId: "service.ultrasound", routeId: "route.ultrasound.in_house",
        serviceIncomeEligible: true, serviceIncomeLineId: "income.ultrasound", serviceIncomeFee: quoteFee, roomUpgradeRevenue,
        localServiceOperation: { version: "pending-result-service-operation.v1", status: "feedback_pending",
          incomeLineId: "income.ultrasound", serviceOperationId: null, externalDurationTicks: 0 } });
      encounter.pendingResult = accepted;
      encounter.steps[0]!.result = accepted;
    } else if (carrier === "staged") {
      encounter.stagedResultOrder = { version: "staged-result-order.v1", originatingNodeIndex: 0,
        caseId: encounter.frozenCase.id, nodeId: node.id, questionVariantId: node.questionVariantId,
        choiceId: choice.id, choiceLabel: choice.label, status: "feedback_pending", remainderMode: "external_processing",
        currentComponentIndex: 0, components: [{ componentId: "upgrade.acquisition", serviceId: "service.ultrasound",
          routeId: "route.ultrasound.in_house", routeDisplayName: "Fixture ultrasound", incomeLineId: "income.ultrasound",
          quoteFee, roomUpgradeRevenue, operationPhases: getServiceIncomeLine("income.ultrasound")!.operation!.phases.map((phase) =>
            ({ id: phase.id, roomDefinitionId: phase.roomDefinitionId, durationMinutes: phase.durationMinutes,
              staffRoleDefinitionIds: [...phase.staffRoleDefinitionIds], providerRoleDefinitionIds: [...(phase.providerRoleDefinitionIds ?? [])],
              ...(phase.founderEligible ? { founderEligible: true as const } : {}) })),
          externalRemainder: "Fixture external work", status: "pending", serviceOperationId: null }], remainder: pending() };
    } else {
      encounter.testOnlyContinuation = { version: "test-only-continuation.v1", originatingNodeIndex: 0,
        serviceId: "service.ultrasound", routeId: "route.ultrasound.in_house", routeDisplayName: "Fixture ultrasound",
        incomeLineId: "income.ultrasound", externalRemainder: "Fixture external work", roomUpgradeRevenue,
        ...(marked ? { quoteFee } : {}), status: "feedback_pending", serviceOperationId: null,
        scheduledAtFacilityTick: 0, completedAtFacilityTick: null };
    }
    us.room.upgradeLevel = 5;
    const restored = deserializeGameState(serializeGameState(result.state), result.context);
    const commandId = `upgrade.carrier.enact.${sequence++}`;
    Object.assign(result.state, gameReducer(restored, { type: "ACKNOWLEDGE_DECISION_FEEDBACK", operationId: commandId,
      encounterId: encounter.id, decisionNodeId: node.id }, result.context));
    expect(result.state.operationReceipts[commandId]?.status).toBe("applied");
    const job = result.state.serviceOperations[0]!;
    expect(Boolean(job.roomUpgradeRevenue)).toBe(marked);
    finish(result, job);
    expect(result.state.serviceIncomeReceipts[0]?.grossAmount).toBe(marked ? 127.2 : carrier === "continuation" ? 120 : 37);
  });

  it("carries the accepted source through reload and operation creation without compounding it", () => {
    const result = fixture();
    const us = result.addRoom("room.ultrasound", "staff.imaging_technician");
    us.room.upgradeLevel = 2;
    result.encounter.patientLocation = { ...us.anchor };
    const plan = diagnosticPlan(result, { serviceId: "service.ultrasound", patientOrigin: us.anchor });
    result.encounter.pendingResult = pending(plan);
    Object.assign(result.state, deserializeGameState(serializeGameState(result.state), result.context));
    const savedEncounter = result.state.encounters[result.encounter.id]!;
    const savedPlan = savedEncounter.pendingResult!.diagnosticTiming!;
    result.state.rooms.find((room) => room.id === us.room.id)!.upgradeLevel = 5;
    const id = startDiagnosticAcquisitionOperation(result.state, savedEncounter, savedPlan, null, "income.ultrasound", choiceOrder(result, savedPlan), result.context);
    const job = result.state.serviceOperations.find((entry) => entry.id === id)!;
    expect(job.quoteFee).toBe(127.2);
    expect(savedPlan.sources[0]!.quoteFee).toBe(120);
    expect(savedPlan.sources[0]!.roomUpgradeRevenue?.boundRoom).toBeNull();
    Object.assign(result.state, deserializeGameState(serializeGameState(result.state), result.context));
    finish(result, result.state.serviceOperations[0]!);
    expect(result.state.serviceIncomeReceipts.map((receipt) => receipt.grossAmount)).toEqual([127.2]);
  });

  it.each([
    ["service.anoscopy", "room.minor_procedure", "income.procedure.anoscopy", 224],
    ["service.thyroid_fna", "room.ultrasound", "income.procedure.ultrasound_guided_thyroid_fna", 168],
    ["service.breast_core_needle_biopsy", "room.ultrasound", "income.procedure.image_guided_breast_core_biopsy", 168],
  ] as const)("applies the actual-room bonus to fee-only %s", (serviceId, roomDefinitionId, incomeLineId, gross) => {
    const result = fixture();
    const room = result.addRoom(roomDefinitionId, roomDefinitionId === "room.ultrasound" ? "staff.imaging_technician" : undefined);
    room.room.upgradeLevel = 3;
    result.encounter.patientLocation = { ...room.anchor };
    result.state.environment.founderLocation = { ...room.anchor };
    const plan = diagnosticPlan(result, { serviceId, patientOrigin: room.anchor });
    const id = startDiagnosticAcquisitionOperation(result.state, result.encounter, plan, null, incomeLineId, choiceOrder(result, plan), result.context);
    const job = result.state.serviceOperations.find((entry) => entry.id === id)!;
    expect(job.quoteFee).toBe(gross);
    Object.assign(result.state, deserializeGameState(serializeGameState(result.state), result.context));
    finish(result, result.state.serviceOperations[0]!);
    expect(result.state.serviceIncomeReceipts[0]).toMatchObject({ incomeLineId, grossAmount: gross });
  });

  it("does not add a fresh quote when a new operation wraps a legacy diagnostic source", () => {
    const result = fixture();
    const us = result.addRoom("room.ultrasound", "staff.imaging_technician");
    us.room.upgradeLevel = 5;
    result.encounter.patientLocation = { ...us.anchor };
    const plan = diagnosticPlan(result, { serviceId: "service.ultrasound", patientOrigin: us.anchor });
    delete plan.sources[0]!.roomUpgradeRevenue;
    plan.sources[0]!.quoteFee = 37;
    const id = startDiagnosticAcquisitionOperation(result.state, result.encounter, plan, null, "income.ultrasound", choiceOrder(result, plan), result.context);
    const job = result.state.serviceOperations.find((entry) => entry.id === id)!;
    expect(job.roomUpgradeRevenue).toBeUndefined();
    finish(result, job);
    expect(result.state.serviceIncomeReceipts[0]?.grossAmount).toBe(37);
  });

  it("upgrades paid manual Lab processing while its diagnostic child stays nonbillable", () => {
    const result = fixture();
    result.addRoom("room.phlebotomy", "staff.phlebotomist");
    const lab = result.addRoom("room.laboratory", "staff.laboratory_technician");
    lab.room.upgradeLevel = 5;
    const manualId = startServiceOperation(result.state, "income.laboratory_processing", "remote", result.context);
    expect(manualId).not.toBeNull();
    const manual = result.state.serviceOperations.find((entry) => entry.id === manualId)!;
    advance(result); arrive(result, manual); advance(result);
    expect(manual.quoteFee).toBe(99.2);
    const plan = diagnosticPlan(result, { serviceId: "service.basic_labs" });
    const work = plan.phases.find((entry) => entry.kind === "laboratory_processing")!;
    for (const entry of plan.phases) if (entry.id !== work.id) {
      entry.status = "completed"; entry.startedAtTick = 0; entry.completedAtTick = 0; entry.remainingMinutes = 0;
    }
    const childId = startDiagnosticProcessingOperation(result.state, plan, work.id, result.context);
    const child = result.state.serviceOperations.find((entry) => entry.id === childId)!;
    expect(child).toMatchObject({ quoteFee: 0, status: "waiting_for_resources" });
    expect(child.roomUpgradeRevenue).toBeUndefined();
    const xp = result.state.clinicalXp;
    advance(result, manual.phaseEndsAtFacilityTick!);
    arrive(result, child); advance(result);
    advance(result, child.phaseEndsAtFacilityTick!);
    expect(child.status).toBe("completed");
    expect(result.state.clinicalXp).toBe(xp);
    expect(result.state.serviceIncomeReceipts.map((receipt) => receipt.grossAmount)).toEqual([99.2]);
  });
});

describe("retail gross and GLP interval revenue", () => {
  it("freezes pharmacy gross separately from trained procurement costs", () => {
    const result = fixture(); result.state.encounters = {};
    const pharmacy = result.addRoom("room.pharmacy", "staff.pharmacist", 2);
    result.state.employees.forEach((employee) => result.state.retailNextOpportunityTicks[`employee:${employee.id}`] = Number.MAX_SAFE_INTEGER);
    pharmacy.room.upgradeLevel = 3;
    result.state.employees[0]!.trainingLevel = 5;
    expect(authorizeRetailOrder(result.state, "upgrade.rx", "income.pharmacy_pickup", "retail_visitor", "upgrade.rx.actor", 1, result.context)).toBe(true);
    const id = startRetailPurchase(result.state, "income.pharmacy_pickup", "retail_visitor", "upgrade.rx.actor", result.context, "upgrade.rx");
    expect(id).not.toBeNull();
    expect(result.state.retailOperations[0]).toMatchObject({ quoteGross: 28, quoteStockCost: 13.5 });
    pharmacy.room.upgradeLevel = 5;
    result.state.employees.forEach((employee) => employee.trainingLevel = 1);
    Object.assign(result.state, deserializeGameState(serializeGameState(result.state), result.context));
    const cash = result.state.cash;
    for (let count = 0; !result.state.serviceIncomeReceipts.some((receipt) => receipt.incomeLineId === "income.pharmacy_pickup") && count < 150; count++) {
      result.state.facilityTick++; advanceRetailOperations(result.state, result.context); advanceEmployeeMovement(result.state, result.context);
    }
    expect(result.state.serviceIncomeReceipts.find((receipt) => receipt.incomeLineId === "income.pharmacy_pickup")).toMatchObject({ grossAmount: 28, stockCost: 13.5, netCashDelta: 14.5 });
    expect(result.state.cash).toBeCloseTo(cash + 14.5);
    advanceRetailOperations(result.state, result.context);
    expect(result.state.serviceIncomeReceipts).toHaveLength(1);
  });

  it("upgrades vending sales but leaves founder consumption at stock expense only", () => {
    const result = fixture(); result.state.encounters = {};
    result.addRoom("room.ultrasound", "staff.imaging_technician");
    const vending = result.addRoom("room.vending"); vending.room.upgradeLevel = 5;
    const customer = result.state.employees[0]!;
    result.state.retailNextOpportunityTicks[`employee:${customer.id}`] = Number.MAX_SAFE_INTEGER;
    expect(startRetailPurchase(result.state, "income.vending_snack", "employee", customer.id, result.context)).not.toBeNull();
    expect(startRetailPurchase(result.state, "income.vending_snack", "founder", "founder", result.context)).not.toBeNull();
    const cash = result.state.cash;
    for (let count = 0; result.state.serviceIncomeReceipts.length < 2 && count < 200; count++) {
      result.state.facilityTick++; advanceRetailOperations(result.state, result.context);
    }
    expect(result.state.serviceIncomeReceipts).toEqual(expect.arrayContaining([
      expect.objectContaining({ actorKind: "employee", grossAmount: 4.96, stockCost: 2, netCashDelta: 2.96 }),
      expect.objectContaining({ actorKind: "founder", grossAmount: 0, stockCost: 2, netCashDelta: -2 }),
    ]));
    expect(result.state.cash).toBeCloseTo(cash + 0.96);
  });

  it("keeps a legacy retail gross quote after reloading an upgraded outlet", () => {
    const result = fixture(); result.state.encounters = {};
    const vending = result.addRoom("room.vending"); vending.room.upgradeLevel = 5;
    const id = startRetailPurchase(result.state, "income.vending_snack", "founder", "founder", result.context);
    expect(id).not.toBeNull();
    const legacy = result.state.retailOperations[0]!;
    delete legacy.roomUpgradeRevenue;
    legacy.quoteGross = 4;
    Object.assign(result.state, deserializeGameState(serializeGameState(result.state), result.context));
    expect(result.state.retailOperations[0]!.quoteGross).toBe(4);
    for (let count = 0; !result.state.serviceIncomeReceipts.length && count < 150; count++) {
      result.state.facilityTick++; advanceRetailOperations(result.state, result.context);
    }
    expect(result.state.serviceIncomeReceipts[0]).toMatchObject({ grossAmount: 0, stockCost: 2, netCashDelta: -2 });
    expect(result.state.retailOperations[0]!.quoteGross).toBe(4);
  });

  it("freezes both category pay and actual-suite bonus until the next GLP interval", () => {
    const result = fixture(); result.state.encounters = {};
    const suite = result.addRoom("room.glp1_telehealth_suite", "staff.glp1_np");
    suite.room.upgradeLevel = 2; result.state.employees[0]!.trainingLevel = 5;
    alternative(result, suite.room, 5);
    let state = tick(result.state, result.context);
    const interval = state.environment.glp1AutomationSlots[0]!;
    expect(interval.quotePayment).toBe(74.2);
    expect(interval.nextPayoutTick).toBe(60);
    state.rooms.find((room) => room.id === suite.room.id)!.upgradeLevel = 5;
    state.employees[0]!.trainingLevel = 1;
    state = deserializeGameState(serializeGameState(state), result.context);
    state = tick(state, result.context, 59);
    expect(state.serviceIncomeReceipts.map((receipt) => receipt.grossAmount)).toEqual([74.2]);
    expect(state.environment.glp1AutomationSlots[0]).toMatchObject({ quotePayment: 62, nextPayoutTick: 120 });
    state = tick(deserializeGameState(serializeGameState(state), result.context), result.context, 60);
    expect(state.serviceIncomeReceipts.map((receipt) => receipt.grossAmount)).toEqual([74.2, 62]);
    expect(new Set(state.serviceIncomeReceipts.map((receipt) => receipt.transactionKey)).size).toBe(2);
  });

  it.each([undefined, 63])("preserves an unmarked GLP interval's legacy payment (saved=%s)", (quotePayment) => {
    const result = fixture(); result.state.encounters = {};
    const suite = result.addRoom("room.glp1_telehealth_suite", "staff.glp1_np");
    suite.room.upgradeLevel = 5; result.state.employees[0]!.trainingLevel = 5;
    result.state.environment.glp1AutomationSlots = [{ suiteRoomInstanceId: suite.room.id,
      employeeId: result.state.employees[0]!.id, nextPayoutTick: 1, ...(quotePayment === undefined ? {} : { quotePayment }) }];
    let state = tick(deserializeGameState(serializeGameState(result.state), result.context), result.context);
    expect(state.serviceIncomeReceipts.map((receipt) => receipt.grossAmount)).toEqual([quotePayment ?? 50]);
    expect(state.environment.glp1AutomationSlots[0]).toMatchObject({ quotePayment: 86.8, nextPayoutTick: 61 });
    state = tick(deserializeGameState(serializeGameState(state), result.context), result.context, 60);
    expect(state.serviceIncomeReceipts.map((receipt) => receipt.grossAmount)).toEqual([quotePayment ?? 50, 86.8]);
  });
});
