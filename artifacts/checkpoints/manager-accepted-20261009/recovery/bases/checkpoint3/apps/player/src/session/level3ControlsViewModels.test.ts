import { describe, expect, it } from "vitest";
import {
  PROTOTYPE_DOMAIN_CONTEXT,
  createInitialGameState,
  gameReducer,
  getRoomDefinition,
  getRoomNavigationAnchor,
  type EmployeeState,
  type GameState,
  type GridPoint,
  type PlacedRoom,
  type RetailOperationState,
  type ServiceOperationState,
} from "@gamify-surgery/game-domain";
import { createPrototypePlayerView } from "./viewModels";

const viewOf = (state = createInitialGameState()) => createPrototypePlayerView(state, null, false, null);

function addRoom(state: GameState, id: string, roomDefinitionId: string, x: number, y: number, maintenance?: NonNullable<PlacedRoom["maintenance"]>): PlacedRoom {
  const room: PlacedRoom = { id, roomDefinitionId, x, y, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100, ...(maintenance ? { maintenance } : {}) };
  state.rooms.push(room);
  return room;
}

function roomStaffAnchor(room: PlacedRoom): GridPoint {
  const definition = getRoomDefinition(room.roomDefinitionId);
  if (!definition) throw new Error(`Missing room definition ${room.roomDefinitionId}`);
  return getRoomNavigationAnchor(room, definition, "staff");
}

function employee(state: GameState, id: string, role: string, homeRoomInstanceId: string | null, location: GridPoint): EmployeeState {
  return {
    id, staffRoleDefinitionId: role, displayName: id, appearance: state.founder.appearance,
    hiredAtFacilityTick: 0, salaryPerExpenseInterval: 0, morale: 100, trainingLevel: 1,
    homeRoomInstanceId, location, path: [location], pathIndex: 0, lastMovedAtFacilityTick: 0,
    lastPraisedAtFacilityTick: null, lastBreakAtFacilityTick: null, nextIdleActionAtFacilityTick: 1, facilityTask: null,
  };
}

function serviceOperation(state: GameState, overrides: Partial<ServiceOperationState> = {}): ServiceOperationState {
  return {
    id: "operation.test", incomeLineId: "income.ambulatory_operation", catalogVersion: 1,
    actorKind: "visitor", actorId: "visitor.test", displayName: "Test visitor", appearance: state.founder.appearance,
    status: "in_service", createdAtFacilityTick: 0, waitDeadlineFacilityTick: 300, startedAtFacilityTick: 0,
    completedAtFacilityTick: null, cancelledAtFacilityTick: null, quoteFee: 900, phaseIndex: 0,
    phaseStartedAtFacilityTick: 0, phaseEndsAtFacilityTick: 120, reservedRoomInstanceIds: [], reservedEmployeeIds: [],
    providerReservation: null, location: null, path: [], pathIndex: 0, lastMovedAtFacilityTick: 0, cancellationReason: null,
    ...overrides,
  };
}

describe("Level 3 control view models", () => {
  it("keeps Level 3 controls and support status out of earlier levels", () => {
    const level2 = createInitialGameState();
    level2.facilityLevel = 2;
    expect(viewOf(level2).serviceIncome.laboratoryWorkQueue).toBeUndefined();
    expect(viewOf(level2).serviceIncome.levelThreeSupport).toBeUndefined();
    expect(viewOf(level2).progression.secondaryGoals).toBeUndefined();

    const level3 = createInitialGameState();
    level3.facilityLevel = 3;
    const view = viewOf(level3);
    expect(view.roomOptions.filter((room) => PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility.roomDefinitions.find((definition) => definition.id === room.id)?.unlockFacilityLevel === 3)).toHaveLength(8);
    expect(view.staffRoles.filter((role) => PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility.staffRoleDefinitions.find((definition) => definition.id === role.id)?.unlockFacilityLevel === 3)).toHaveLength(6);
    expect(view.progression.nextLevelLabel).toBe("Level 4 preview");
  });

  it("tolerates a legacy in-memory campaign before support defaults are hydrated", () => {
    const state = createInitialGameState();
    state.facilityLevel = 3;
    (state as unknown as { levelThreeQiReviews?: GameState["levelThreeQiReviews"] }).levelThreeQiReviews = undefined;
    expect(() => viewOf(state)).not.toThrow();
    expect(viewOf(state).serviceIncome.levelThreeSupport).toMatchObject({
      queuedQiReviewCount: 0,
      inProgressQiReviewCount: 0,
      completedQiReviewCount: 0,
    });
  });

  it("distinguishes an unreachable lab, equipment repair, and a full work queue", () => {
    const state = createInitialGameState();
    state.facilityLevel = 3;
    expect(viewOf(state).serviceIncome.laboratoryWorkQueue).toMatchObject({ enabled: false, disabledReason: "Requires a reachable, operational Laboratory." });

    const laboratory = addRoom(state, "room.test.laboratory", "room.laboratory", 33, 23, {
      status: "out_of_service", completedUses: 8, dueAtFacilityTick: 0, outOfServiceAtFacilityTick: 600, appliedUseKeys: [],
    });
    expect(viewOf(state).serviceIncome.laboratoryWorkQueue).toMatchObject({ enabled: false, disabledReason: "Laboratory equipment is awaiting repair." });

    laboratory.maintenance!.status = "operational";
    state.doors.push(
      { id: "door.test.laboratory", roomId: laboratory.id, side: "south", offset: 2, exterior: false },
      { id: "door.test.laboratory.staff", roomId: laboratory.id, side: "west", offset: 1, exterior: false },
      { id: "door.test.lab-front", roomId: "room.instance.founder_desk", side: "west", offset: 0, exterior: false },
    );
    for (const y of [24, 25, 26, 27, 28]) addRoom(state, `room.test.lab-hall.${y}`, "room.hallway", 32, y);
    const technician = employee(state, "employee.test.laboratory", "staff.laboratory_technician", laboratory.id, roomStaffAnchor(laboratory));
    state.employees.push(technician);
    expect(viewOf(state).serviceIncome.laboratoryWorkQueue).toMatchObject({ enabled: true, statusLabel: "Ready to queue processing" });

    const breakRoom = addRoom(state, "room.test.break", "room.staff_break", 40, 23);
    const breakEndpoint = roomStaffAnchor(breakRoom);
    technician.location = breakEndpoint;
    technician.path = [breakEndpoint];
    technician.facilityTask = { kind: "take_break", targetId: breakRoom.id, seatId: "smallNorth", startedAtFacilityTick: 0, workMinutesRemaining: 10 };
    expect(viewOf(state).serviceIncome.laboratoryWorkQueue).toMatchObject({
      enabled: false,
      disabledReason: "Waiting for the laboratory technician to return.",
    });

    technician.location = roomStaffAnchor(laboratory);
    technician.path = [technician.location];
    technician.facilityTask = null;
    const queued = gameReducer(state, { type: "START_SERVICE_OPERATION", operationId: "lab.one", incomeLineId: "income.laboratory_processing", actorKind: "remote" });
    expect(viewOf(queued).serviceIncome.laboratoryWorkQueue).toMatchObject({ enabled: false, disabledReason: "Laboratory work queue is full." });
  });

  it("projects a break seat only after the employee reaches the assigned route endpoint", () => {
    const state = createInitialGameState(); state.facilityLevel = 3;
    const breakRoom = addRoom(state, "room.break", "room.staff_break", 33, 23);
    const endpoint = roomStaffAnchor(breakRoom);
    const worker = employee(state, "employee.break", "staff.pharmacist", null, { x: endpoint.x - 1, y: endpoint.y });
    worker.path = [worker.location, endpoint];
    worker.facilityTask = { kind: "take_break", targetId: breakRoom.id, seatId: "largeNorth", startedAtFacilityTick: 0, workMinutesRemaining: 5 };
    state.employees.push(worker);
    expect(viewOf(state).facility.staff.find((candidate) => candidate.instanceId === worker.id)?.supportRole).toBeUndefined();
    worker.location = endpoint; worker.pathIndex = 1;
    expect(viewOf(state).facility.staff.find((candidate) => candidate.instanceId === worker.id)).toMatchObject({ supportRole: "staff-break-seat", supportId: "largeNorth", supportRoomInstanceId: breakRoom.id });
  });

  it("seats only the surgeon assigned to the in-progress office review", () => {
    const state = createInitialGameState(); state.facilityLevel = 3;
    const office = addRoom(state, "room.office", "room.surgeon_office", 33, 23);
    const endpoint = roomStaffAnchor(office);
    const assigned = employee(state, "employee.surgeon.assigned", "staff.surgeon", office.id, endpoint);
    assigned.facilityTask = { kind: "review_ambulatory_qi", targetId: "qi.1", startedAtFacilityTick: 0, workMinutesRemaining: 5 };
    const other = employee(state, "employee.surgeon.other", "staff.surgeon", office.id, endpoint);
    state.employees.push(assigned, other);
    state.levelThreeQiReviews.push({ id: "qi.1", receiptId: "receipt.1", status: "in_progress", surgeonEmployeeId: assigned.id, enqueuedAtFacilityTick: 0, startedAtFacilityTick: 0, completedAtFacilityTick: null });
    const staff = viewOf(state).facility.staff;
    expect(staff.find((candidate) => candidate.instanceId === assigned.id)).toMatchObject({ supportRole: "surgeon-office", supportId: "surgeon", supportRoomInstanceId: office.id });
    expect(staff.find((candidate) => candidate.instanceId === other.id)?.supportRole).toBeUndefined();
    state.levelThreeQiReviews[0]!.surgeonEmployeeId = other.id;
    expect(viewOf(state).facility.staff.find((candidate) => candidate.instanceId === assigned.id)?.supportRole).toBeUndefined();
  });

  it("maps only the active OR phase to the surgeon, nurse, founder, and covered occupancy", () => {
    const state = createInitialGameState(); state.facilityLevel = 3;
    const prep = addRoom(state, "room.prep", "room.periop_preparation", 30, 20);
    const operatingRoom = addRoom(state, "room.or", "room.ambulatory_or", 36, 20);
    const recovery = addRoom(state, "room.recovery", "room.periop_recovery", 42, 20);
    const endpoint = roomStaffAnchor(operatingRoom);
    const surgeon = employee(state, "employee.surgeon", "staff.surgeon", null, endpoint);
    const nurse = employee(state, "employee.or-nurse", "staff.or_nurse", null, endpoint);
    const unrelated = employee(state, "employee.periop-nurse", "staff.periop_nurse", null, endpoint);
    surgeon.facilityTask = { kind: "perform_service", targetId: "operation.or", startedAtFacilityTick: 0, workMinutesRemaining: 30 };
    nurse.facilityTask = { kind: "perform_service", targetId: "operation.or", startedAtFacilityTick: 0, workMinutesRemaining: 30 };
    unrelated.facilityTask = { kind: "perform_service", targetId: "operation.or", startedAtFacilityTick: 0, workMinutesRemaining: 30 };
    state.employees.push(surgeon, nurse, unrelated);
    const operation = serviceOperation(state, {
      id: "operation.or", phaseFlowVersion: 1, phaseIndex: 1, status: "in_service",
      reservedRoomInstanceIds: [prep.id, operatingRoom.id, recovery.id], reservedEmployeeIds: [nurse.id, unrelated.id],
      providerReservation: { kind: "employee", employeeId: surgeon.id }, location: endpoint, path: [endpoint],
      frozenOperationPhases: [
        { id: "prep", roomDefinitionId: "room.periop_preparation", durationMinutes: 30, staffRoleDefinitionIds: ["staff.periop_nurse"], roomStationId: "periop_preparation" },
        { id: "operation", roomDefinitionId: "room.ambulatory_or", durationMinutes: 120, staffRoleDefinitionIds: ["staff.or_nurse"], providerRoleDefinitionIds: ["staff.surgeon"], founderEligible: true },
        { id: "recovery", roomDefinitionId: "room.periop_recovery", durationMinutes: 60, staffRoleDefinitionIds: ["staff.periop_nurse"], roomStationId: "periop_recovery" },
      ],
    });
    state.serviceOperations.push(operation);
    let view = viewOf(state);
    expect(view.facility.staff.find((candidate) => candidate.instanceId === surgeon.id)).toMatchObject({ supportRole: "ambulatory-or-surgeon", supportRoomInstanceId: operatingRoom.id });
    expect(view.facility.staff.find((candidate) => candidate.instanceId === nurse.id)).toMatchObject({ supportRole: "ambulatory-or-nurse", supportRoomInstanceId: operatingRoom.id });
    expect(view.facility.staff.find((candidate) => candidate.instanceId === unrelated.id)?.supportRole).toBeUndefined();
    expect(view.facility.endoscopyOccupancy).toMatchObject({ roomInstanceIds: [operatingRoom.id], serviceVisitorInstanceIds: [operation.id] });

    operation.providerReservation = { kind: "founder" }; surgeon.facilityTask = null;
    state.environment.founderLocation = endpoint;
    state.environment.founderActivity = { kind: "perform_service", targetId: operation.id, path: [endpoint], pathIndex: 0, lastMovedAtFacilityTick: 0, workMinutesRemaining: 30 };
    expect(viewOf(state).facility.founder.supportRole).toBe("ambulatory-or-surgeon");

    for (const [phaseIndex, status] of [[0, "in_service"], [1, "walking_between_phases"], [1, "waiting_for_next_phase"], [2, "in_service"]] as const) {
      operation.phaseIndex = phaseIndex; operation.status = status; view = viewOf(state);
      expect(view.facility.endoscopyOccupancy!.roomInstanceIds).not.toContain(operatingRoom.id);
      expect(view.facility.endoscopyOccupancy!.serviceVisitorInstanceIds).not.toContain(operation.id);
    }
  });

  it("uses active lab and exact idle home anchors without snapping repair work into unsupported rooms", () => {
    const state = createInitialGameState(); state.facilityLevel = 3;
    const lab = addRoom(state, "room.lab", "room.laboratory", 30, 20);
    const pharmacy = addRoom(state, "room.pharmacy", "room.pharmacy", 35, 20);
    const workshop = addRoom(state, "room.workshop", "room.maintenance_workshop", 40, 20);
    const damagedOr = addRoom(state, "room.damaged-or", "room.ambulatory_or", 45, 20, { status: "out_of_service", completedUses: 8, dueAtFacilityTick: 0, outOfServiceAtFacilityTick: 600, appliedUseKeys: [] });
    const labAnchor = roomStaffAnchor(lab), pharmacyAnchor = roomStaffAnchor(pharmacy), workshopAnchor = roomStaffAnchor(workshop), repairEndpoint = roomStaffAnchor(damagedOr);
    const activeLab = employee(state, "employee.lab.active", "staff.laboratory_technician", null, labAnchor);
    activeLab.facilityTask = { kind: "perform_service", targetId: "operation.lab", startedAtFacilityTick: 0, workMinutesRemaining: 10 };
    const idleLab = employee(state, "employee.lab.idle", "staff.laboratory_technician", lab.id, labAnchor);
    const pharmacyWorker = employee(state, "employee.pharmacy", "staff.pharmacist", pharmacy.id, pharmacyAnchor);
    const repairWorker = employee(state, "employee.repair", "staff.repair_person", workshop.id, workshopAnchor);
    state.employees.push(activeLab, idleLab, pharmacyWorker, repairWorker);
    state.serviceOperations.push(serviceOperation(state, {
      id: "operation.lab", incomeLineId: "income.laboratory_processing", actorKind: "remote", actorId: "remote.operation.lab", appearance: null,
      reservedRoomInstanceIds: [lab.id], reservedEmployeeIds: [activeLab.id], location: labAnchor, path: [labAnchor],
      frozenOperationPhases: [{ id: "processing", roomDefinitionId: "room.laboratory", durationMinutes: 60, staffRoleDefinitionIds: ["staff.laboratory_technician"] }],
    }));
    let staff = viewOf(state).facility.staff;
    expect(staff.find((candidate) => candidate.instanceId === activeLab.id)).toMatchObject({ supportRole: "laboratory-technician", supportRoomInstanceId: lab.id });
    expect(staff.find((candidate) => candidate.instanceId === idleLab.id)).toMatchObject({ supportRole: "laboratory-technician", supportRoomInstanceId: lab.id });
    expect(staff.find((candidate) => candidate.instanceId === pharmacyWorker.id)).toMatchObject({ supportRole: "pharmacist", supportRoomInstanceId: pharmacy.id });
    expect(staff.find((candidate) => candidate.instanceId === repairWorker.id)).toMatchObject({ supportRole: "repair-person", supportRoomInstanceId: workshop.id });

    idleLab.location = { x: labAnchor.x + 1, y: labAnchor.y }; idleLab.path = [idleLab.location];
    repairWorker.location = repairEndpoint; repairWorker.path = [repairEndpoint];
    repairWorker.facilityTask = { kind: "repair_room", targetId: damagedOr.id, startedAtFacilityTick: 0, workMinutesRemaining: 10 };
    staff = viewOf(state).facility.staff;
    expect(staff.find((candidate) => candidate.instanceId === idleLab.id)?.supportRole).toBeUndefined();
    expect(staff.find((candidate) => candidate.instanceId === repairWorker.id)).not.toHaveProperty("supportRole");
    expect(staff.find((candidate) => candidate.instanceId === repairWorker.id)?.location).toEqual(repairEndpoint);
  });

  it("projects maintenance, QI, breaks, wait reasons, and a non-gating secondary objective", () => {
    const state = createInitialGameState(); state.facilityLevel = 3;
    const dueLab = addRoom(state, "room.lab.due", "room.laboratory", 30, 20, { status: "due", completedUses: 8, dueAtFacilityTick: 0, outOfServiceAtFacilityTick: 600, appliedUseKeys: [] });
    const outOr = addRoom(state, "room.or.out", "room.ambulatory_or", 35, 20, { status: "out_of_service", completedUses: 8, dueAtFacilityTick: 0, outOfServiceAtFacilityTick: 600, appliedUseKeys: [] });
    const repairing = employee(state, "employee.repairing", "staff.repair_person", null, roomStaffAnchor(outOr));
    repairing.facilityTask = { kind: "repair_room", targetId: outOr.id, startedAtFacilityTick: 0, workMinutesRemaining: 10 };
    const breaker = employee(state, "employee.breaking", "staff.pharmacist", null, roomStaffAnchor(dueLab));
    breaker.facilityTask = { kind: "take_break", targetId: "room.break", seatId: "smallSouth", startedAtFacilityTick: 0, workMinutesRemaining: 5 };
    state.employees.push(repairing, breaker);
    state.levelThreeQiReviews.push(
      { id: "qi.queued", receiptId: "receipt.queued", status: "queued", surgeonEmployeeId: null, enqueuedAtFacilityTick: 0, startedAtFacilityTick: null, completedAtFacilityTick: null },
      { id: "qi.active", receiptId: "receipt.active", status: "in_progress", surgeonEmployeeId: "employee.surgeon", enqueuedAtFacilityTick: 0, startedAtFacilityTick: 1, completedAtFacilityTick: null },
    );
    state.serviceOperations.push(serviceOperation(state, { id: "operation.wait", status: "waiting_for_resources", resourceWaitReason: "Waiting for equipment repair." }));
    const retail: RetailOperationState = {
      id: "retail.wait", incomeLineId: "income.pharmacy_retail", catalogVersion: 1, actorKind: "employee", actorId: repairing.id,
      displayName: repairing.displayName, appearance: repairing.appearance, linkedServiceOperationId: null, authorizedOrderId: null,
      status: "queued", createdAtFacilityTick: 0, waitDeadlineFacilityTick: 300, startedAtFacilityTick: null, completedAtFacilityTick: null,
      quoteGross: 20, quoteStockCost: 5, outletRoomInstanceId: "room.pharmacy", outletDurationMinutes: 10,
      staffRoleDefinitionId: "staff.pharmacist", servingEmployeeId: null, location: repairing.location, returnLocation: null,
      path: [repairing.location], pathIndex: 0, lastMovedAtFacilityTick: 0, purchaseEndsAtFacilityTick: null,
      cancellationReason: null, resourceWaitReason: "Waiting for equipment repair.",
    };
    state.retailOperations.push(retail);

    const before = viewOf(state);
    expect(before.serviceIncome.levelThreeSupport).toEqual({
      maintenanceDueRoomNames: ["In-house Laboratory"], maintenanceOutOfServiceRoomNames: ["Ambulatory OR"], maintenanceRepairingRoomNames: ["Ambulatory OR"],
      queuedQiReviewCount: 1, inProgressQiReviewCount: 1, completedQiReviewCount: 0, staffOnBreakCount: 1,
    });
    expect(before.serviceIncome.activeOperations.filter((operation) => operation.statusLabel === "Waiting for equipment repair.")).toHaveLength(2);
    expect(before.progression.goals.some((goal) => goal.id.includes("qi"))).toBe(false);
    expect(before.progression.secondaryGoals).toEqual([expect.objectContaining({ complete: false, progressLabel: "0/1" })]);
    const primaryBefore = { canLevelUp: before.progression.canLevelUp, prototypeComplete: before.progression.prototypeComplete, goals: before.progression.goals };

    state.levelThreeQiReviews.push({ id: "qi.done", receiptId: "receipt.done", status: "completed", surgeonEmployeeId: "employee.surgeon", enqueuedAtFacilityTick: 0, startedAtFacilityTick: 1, completedAtFacilityTick: 30 });
    const after = viewOf(state);
    expect({ canLevelUp: after.progression.canLevelUp, prototypeComplete: after.progression.prototypeComplete, goals: after.progression.goals }).toEqual(primaryBefore);
    expect(after.progression.secondaryGoals).toEqual([expect.objectContaining({ complete: true, progressLabel: "1/1" })]);
  });
});
