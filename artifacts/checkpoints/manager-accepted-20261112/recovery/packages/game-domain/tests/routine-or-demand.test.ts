import { describe, expect, it } from "vitest";
import { getServiceIncomeLine } from "@gamify-surgery/balance-config";
import {
  advanceServiceOperations, getClinicSatisfaction, getCurrentCapabilities,
  getFacilityProgressionStatus, getFunctionalScheduledAmbulatoryOperationCapacity,
  getRoomDefinition, getRoomNavigationAnchor, PROTOTYPE_DOMAIN_CONTEXT as context,
  startEncounterProcedureOperation, type ServiceOperationState,
} from "../src";
import { advanceRoutineOrUntil, routineOrFixture } from "./routine-or-demand.fixture";

const lineId = "income.ambulatory_operation";
const scheduled = (operations: ServiceOperationState[]) => operations.filter(op => op.incomeLineId === lineId && op.actorKind === "visitor");
const done = (operations: ServiceOperationState[]) => scheduled(operations).some(op => op.status === "completed");

describe("routine ambulatory OR demand", () => {
  it("keeps an installed clinic's appointment when the OR nurse is away from her home room", () => {
    const { state } = routineOrFixture();
    const nurse = state.employees.find(employee => employee.staffRoleDefinitionId === "staff.or_nurse")!;
    nurse.location = { x: 32, y: 22 }; nurse.path = [nurse.location]; nurse.pathIndex = 0;
    expect(getCurrentCapabilities(state, context).has("capability.staff.or_nurse")).toBe(false);
    expect(getFunctionalScheduledAmbulatoryOperationCapacity(state, context)).toBe(1);
    state.nextServiceAppointmentTicks[lineId] = state.facilityTick;
    advanceServiceOperations(state, context);
    expect(scheduled(state.serviceOperations)).toHaveLength(1);
    expect(state.lastServiceAppointmentTicks[lineId]).toBe(state.facilityTick);
  });

  it("does not restart a future appointment during an ordinary nurse absence", () => {
    const { state } = routineOrFixture();
    const nurse = state.employees.find(employee => employee.staffRoleDefinitionId === "staff.or_nurse")!;
    nurse.location = { x: 32, y: 22 }; nurse.path = [nurse.location]; nurse.pathIndex = 0;
    const due = state.facilityTick + 30;
    state.nextServiceAppointmentTicks[lineId] = due;
    for (let i = 0; i < 10; i++) {
      state.facilityTick++;
      advanceServiceOperations(state, context);
      expect(state.nextServiceAppointmentTicks[lineId]).toBe(due);
    }
    expect(scheduled(state.serviceOperations)).toEqual([]);
  });

  it("arrives without a question, operates with the hired surgeon and OR nurse, recovers and credits the goal once", () => {
    const clinic = routineOrFixture();
    const initial = { tick: clinic.state.facilityTick, cash: clinic.state.cashCents, xp: clinic.state.clinicalXp,
      histories: JSON.stringify(clinic.state.learningHistories), satisfaction: getClinicSatisfaction(clinic.state, context) };
    const cadence = getServiceIncomeLine("income.endoscopy")!.operation!.arrivalCadenceMinutes!;
    clinic.advance(cadence + 1);
    const first = scheduled(clinic.state.serviceOperations)[0]!;
    expect(first).toBeDefined();
    expect(first.createdAtFacilityTick).toBeLessThanOrEqual(initial.tick + cadence + 1);
    expect(first.frozenOperationPhases?.map(phase => phase.durationMinutes)).toEqual([30, 120, 60]);
    const id = first.id;
    advanceRoutineOrUntil(clinic, state => state.serviceOperations.some(op => op.id === id && op.phaseIndex === 1 && op.status === "in_service"));
    const operating = clinic.state.serviceOperations.find(op => op.id === id)!;
    expect(operating.providerReservation?.kind).toBe("employee");
    const surgeon = clinic.state.employees.find(employee => operating.providerReservation?.kind === "employee" && employee.id === operating.providerReservation.employeeId)!;
    expect(surgeon.staffRoleDefinitionId).toBe("staff.surgeon");
    expect(operating.reservedEmployeeIds.some(employeeId => clinic.state.employees.some(employee => employee.id === employeeId && employee.staffRoleDefinitionId === "staff.or_nurse"))).toBe(true);
    expect(clinic.state.serviceIncomeReceipts.filter(receipt => receipt.incomeLineId === lineId)).toHaveLength(0);
    advanceRoutineOrUntil(clinic, state => state.serviceOperations.some(op => op.id === id && op.status === "completed"));
    const receipts = clinic.state.serviceIncomeReceipts.filter(receipt => receipt.transactionKey === `service-operation:${id}` || receipt.actorId === id && receipt.incomeLineId === lineId);
    expect(receipts).toHaveLength(1);
    expect(receipts[0]).toMatchObject({ incomeLineId: lineId, actorKind: "visitor", grossAmount: getServiceIncomeLine(lineId)!.fee });
    expect(clinic.state.cashCents).toBe(initial.cash + getServiceIncomeLine(lineId)!.fee * 100);
    expect(getFacilityProgressionStatus(clinic.state, context).requirements.find(goal => goal.id === "progression.ambulatory_operation_completion")).toMatchObject({ met: true, current: 1 });
    expect(clinic.state.clinicalXp).toBe(initial.xp);
    expect(clinic.state.encounters).toEqual({});
    expect(JSON.stringify(clinic.state.learningHistories)).toBe(initial.histories);
    expect(getClinicSatisfaction(clinic.state, context)).toBe(initial.satisfaction);
    clinic.advance(10);
    expect(clinic.state.serviceIncomeReceipts.filter(receipt => receipt.actorId === id && receipt.incomeLineId === lineId)).toHaveLength(1);
  });

  it.each(["room.ambulatory_or", "room.periop_recovery", "staff.or_nurse", "staff.periop_nurse"])("does not create demand without %s", missing => {
    const { state } = routineOrFixture();
    if (missing.startsWith("room.")) state.rooms = state.rooms.filter(room => room.roomDefinitionId !== missing);
    else state.employees = state.employees.filter(employee => employee.staffRoleDefinitionId !== missing);
    state.nextServiceAppointmentTicks[lineId] = state.facilityTick;
    advanceServiceOperations(state, context);
    expect(scheduled(state.serviceOperations)).toEqual([]);
    expect(state.nextServiceAppointmentTicks[lineId]).toBeUndefined();
  });

  it.each(["appointments_disabled", "below_level_three"])("respects %s", gate => {
    const { state } = routineOrFixture();
    if (gate === "appointments_disabled") state.serviceAppointmentsEnabled = false;
    else state.facilityLevel = 2;
    state.nextServiceAppointmentTicks[lineId] = state.facilityTick;
    advanceServiceOperations(state, context);
    expect(scheduled(state.serviceOperations)).toEqual([]);
  });

  it("clamps an old 600-minute first appointment once and keeps it across reload", () => {
    const clinic = routineOrFixture();
    clinic.state.nextServiceAppointmentTicks[lineId] = clinic.state.facilityTick + 600;
    clinic.advance();
    const due = clinic.state.nextServiceAppointmentTicks[lineId]!;
    expect(due).toBe(clinic.state.facilityTick + getServiceIncomeLine("income.endoscopy")!.operation!.arrivalCadenceMinutes!);
    clinic.reload();
    clinic.advance(10);
    expect(clinic.state.nextServiceAppointmentTicks[lineId]).toBe(due);
    clinic.advance(due - clinic.state.facilityTick);
    expect(scheduled(clinic.state.serviceOperations)).toHaveLength(1);
  });

  it("seats a visitor while Periop is occupied, then starts care after capacity frees", () => {
    const clinic = routineOrFixture(), state = clinic.state;
    const recovery = state.rooms.find(room => room.roomDefinitionId === "room.periop_recovery")!;
    const inside = getRoomNavigationAnchor(recovery, getRoomDefinition(recovery.roomDefinitionId)!);
    const blocker: ServiceOperationState = { id: "routine.or.capacity-blocker", incomeLineId: "income.laboratory_processing", catalogVersion: 1,
      actorKind: "remote", actorId: "synthetic.capacity", displayName: "Occupied capacity", appearance: null, status: "in_service",
      createdAtFacilityTick: state.facilityTick, waitDeadlineFacilityTick: Number.MAX_SAFE_INTEGER, startedAtFacilityTick: state.facilityTick,
      completedAtFacilityTick: null, cancelledAtFacilityTick: null, quoteFee: 0, phaseIndex: 0, phaseStartedAtFacilityTick: state.facilityTick,
      phaseEndsAtFacilityTick: Number.MAX_SAFE_INTEGER, reservedRoomInstanceIds: [recovery.id], reservedEmployeeIds: [], providerReservation: null,
      location: inside, path: [inside], pathIndex: 0, lastMovedAtFacilityTick: state.facilityTick, cancellationReason: null,
      frozenOperationPhases: [{ id: "synthetic.busy-periop", roomDefinitionId: recovery.roomDefinitionId, durationMinutes: 100_000, staffRoleDefinitionIds: [] }] };
    state.serviceOperations.push(blocker);
    state.nextServiceAppointmentTicks[lineId] = state.facilityTick;
    advanceRoutineOrUntil(clinic, candidate => scheduled(candidate.serviceOperations).some(op => op.status === "waiting_for_resources" && op.pathIndex === op.path.length - 1 && op.location !== null && op.location.x >= 38 && op.location.y >= 22 && op.location.y < 25));
    const queued = scheduled(clinic.state.serviceOperations)[0]!;
    expect(queued.pathIndex).toBe(queued.path.length - 1);
    expect(queued.location).not.toEqual(getRoomNavigationAnchor(clinic.state.rooms[0]!, getRoomDefinition("room.front_desk")!));
    clinic.state.serviceOperations = clinic.state.serviceOperations.filter(op => op.id !== blocker.id);
    advanceRoutineOrUntil(clinic, candidate => candidate.serviceOperations.some(op => op.id === queued.id && op.phaseIndex === 1 && op.status === "in_service"));
  });

  it("shares OR, surgeon, nurse and Periop bed reservations with encounter-linked work", () => {
    const clinic = routineOrFixture(), encounter = clinic.addEncounter();
    expect(startEncounterProcedureOperation(clinic.state, encounter, "income.ambulatory_operation_extended", context)).toBe(true);
    const encounterOperation = clinic.state.serviceOperations.find(op => op.actorKind === "encounter")!;
    const maximum = 800;
    let sawBusyOrQueue = false;
    for (let i = 0; i < maximum; i++) {
      clinic.advance();
      const active = clinic.state.serviceOperations.filter(op => !["completed", "cancelled"].includes(op.status));
      const orReservations = active.flatMap(op => op.reservedRoomInstanceIds.filter(id => clinic.state.rooms.some(room => room.id === id && room.roomDefinitionId === "room.ambulatory_or")));
      expect(new Set(orReservations).size).toBe(orReservations.length);
      const providers = active.flatMap(op => op.providerReservation?.kind === "employee" ? [op.providerReservation.employeeId] : []);
      expect(new Set(providers).size).toBe(providers.length);
      const beds = active.flatMap(op => op.periopBedReservation ? [`${op.periopBedReservation.roomInstanceId}:${op.periopBedReservation.bedId}`] : []);
      expect(new Set(beds).size).toBe(beds.length);
      const tasks = active.flatMap(op => op.reservedEmployeeIds);
      expect(new Set(tasks).size).toBe(tasks.length);
      for (const queued of active.filter(op => op.status === "waiting_for_next_phase" && op.phaseIndex === 0)) {
        if (!active.some(other => other.id !== queued.id && other.phaseIndex === 1 && other.status === "in_service")) continue;
        sawBusyOrQueue = true;
        // Preparation has already assigned a bed. Keep that existing Periop
        // reservation while the OR is busy, rather than returning to check-in.
        expect(queued.periopBedReservation).toBeDefined();
        expect(queued.location).toEqual(queued.periopBedReservation!.endpoint);
      }
      if (done(clinic.state.serviceOperations) && clinic.state.serviceOperations.find(op => op.id === encounterOperation.id)?.status === "completed") break;
    }
    expect(clinic.state.serviceOperations.find(op => op.id === encounterOperation.id)?.status).toBe("completed");
    expect(done(clinic.state.serviceOperations)).toBe(true);
    expect(sawBusyOrQueue).toBe(true);
  });

  it("continues an in-progress operation after reload without duplicate demand or income", () => {
    const clinic = routineOrFixture();
    advanceRoutineOrUntil(clinic, state => scheduled(state.serviceOperations).some(op => op.phaseIndex === 1 && op.status === "in_service"));
    const accepted = scheduled(clinic.state.serviceOperations)[0]!;
    const id = accepted.id, quote = accepted.quoteFee;
    clinic.reload();
    expect(clinic.state.serviceOperations.find(op => op.id === id)?.quoteFee).toBe(quote);
    advanceRoutineOrUntil(clinic, state => state.serviceOperations.some(op => op.id === id && op.status === "completed"));
    expect(clinic.state.serviceIncomeReceipts.filter(receipt => receipt.actorId === id && receipt.incomeLineId === lineId)).toHaveLength(1);
    const firstCreated = scheduled(clinic.state.serviceOperations).map(op => op.createdAtFacilityTick);
    expect(new Set(firstCreated).size).toBe(firstCreated.length);
    expect(getFacilityProgressionStatus(clinic.state, context).requirements.find(goal => goal.id === "progression.ambulatory_operation_completion")?.met).toBe(true);
  });

  it("replays the same arrival and completion times from the same initial inputs", () => {
    const run = () => {
      const clinic = routineOrFixture();
      advanceRoutineOrUntil(clinic, state => done(state.serviceOperations));
      return { tick: clinic.state.facilityTick, cash: clinic.state.cashCents,
        operations: scheduled(clinic.state.serviceOperations).map(op => ({ id: op.id, arrival: op.createdAtFacilityTick, completion: op.completedAtFacilityTick })) };
    };
    expect(run()).toEqual(run());
  });
});
