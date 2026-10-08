import { describe, expect, it } from "vitest";
import { PROCEDURAL_SPECIALIST_SHORT_WAIT_MINUTES } from "@gamify-surgery/balance-config";
import { advanceServiceOperations, deserializeGameState, getDoorCells, getEligibleServiceRoute, getProcedureStaffStandingSpots, getProceduralSpecialistReadyAt,
  getRoomDefinition, planDiagnosticOrder, PROTOTYPE_DOMAIN_CONTEXT, serializeGameState, type DiagnosticOrderPlan, type GameState, type ServiceOperationState } from "../src";
import { proceduralStaffingFixture } from "./procedural-staffing-fixture";
import { timingFixture } from "./diagnostic-timing-fixtures";

function traceProcedures(fixture: ReturnType<typeof proceduralStaffingFixture>, ids: string[], maximum = 480) {
  const providers = new Map<string, NonNullable<ServiceOperationState["providerReservation"]>>();
  let simultaneous = false;
  for (let minute = 0; minute < maximum; minute++) {
    const operations = fixture.state.serviceOperations.filter((entry) => ids.includes(entry.id));
    const procedures = operations.filter((operation) => operation.status === "in_service" &&
      ["room.endoscopy", "room.ambulatory_or"].includes(operation.frozenOperationPhases![operation.phaseIndex]!.roomDefinitionId!));
    simultaneous ||= procedures.length === 2;
    for (const operation of procedures) {
      providers.set(operation.id, operation.providerReservation!);
      const room = fixture.state.rooms.find((entry) => operation.reservedRoomInstanceIds.includes(entry.id))!;
      const definition = getRoomDefinition(room.roomDefinitionId)!;
      const reservation = operation.providerReservation;
      const provider = reservation?.kind === "employee"
        ? fixture.state.employees.find((entry) => entry.id === reservation.employeeId)!.location
        : fixture.state.environment.founderLocation;
      const nurse = fixture.state.employees.find((entry) => operation.reservedEmployeeIds.includes(entry.id))!.location;
      const providerSpot = getProcedureStaffStandingSpots(room, definition, fixture.state.doors, "provider").find((spot) => spot.anchor.x === provider.x && spot.anchor.y === provider.y);
      const nurseSpot = getProcedureStaffStandingSpots(room, definition, fixture.state.doors, "nurse").find((spot) => spot.anchor.x === nurse.x && spot.anchor.y === nurse.y);
      expect(providerSpot).toBeDefined(); expect(nurseSpot).toBeDefined();
      expect(nurse).not.toEqual(provider);
      if (room.orientation === 270) expect(nurse.y).toBeGreaterThan(provider.y);
      else if (room.roomDefinitionId === "room.endoscopy") expect(nurse.x).toBeLessThan(provider.x);
      else expect(nurse.x).toBeGreaterThan(provider.x);
      for (const door of fixture.state.doors.filter((entry) => entry.roomId === room.id)) {
        const threshold = getDoorCells(door, room, definition)!.inside;
        expect(nurse).not.toEqual(threshold); expect(provider).not.toEqual(threshold);
      }
    }
    if (providers.size === ids.length && operations.every((entry) => entry.completedCareProvenance)) break;
    fixture.advance();
  }
  expect(providers.size).toBe(ids.length);
  return { providers: [...providers.values()], simultaneous };
}

describe("specialists before founder procedure overflow", () => {
  it.each([false, true])("uses both qualified specialists in two simultaneous rooms (surgery=%s)", (surgery) => {
    const fixture = proceduralStaffingFixture(surgery);
    const result = traceProcedures(fixture, fixture.admit());
    expect(result.simultaneous).toBe(true);
    expect(result.providers.every((provider) => provider.kind === "employee")).toBe(true);
    expect(new Set(result.providers.map((provider) => provider.kind === "employee" ? provider.employeeId : "founder")).size).toBe(2);
    // Reused rooms include specialists walking back from their last procedure.
    expect(traceProcedures(fixture, fixture.admit()).providers.every((provider) => provider.kind === "employee")).toBe(true);
  }, 30000);

  it.each([false, true])("uses founder only for overflow while one specialist trains (surgery=%s)", (surgery) => {
    const fixture = proceduralStaffingFixture(surgery);
    const specialist = fixture.state.employees.find((entry) => entry.staffRoleDefinitionId === (surgery ? "staff.surgeon" : "staff.endoscopist"))!;
    fixture.dispatch({ type: "TRAIN_EMPLOYEE", operationId: "staffing.train", employeeId: specialist.id });
    expect(specialist.training ?? fixture.state.employees.find((entry) => entry.id === specialist.id)?.training).toBeDefined();
    const result = traceProcedures(fixture, fixture.admit());
    expect(result.simultaneous).toBe(true);
    expect(result.providers.filter((provider) => provider.kind === "founder")).toHaveLength(1);
    expect(result.providers.filter((provider) => provider.kind === "employee")).toHaveLength(1);
  }, 30000);

  it("keeps a reachable endoscopist dispatchable while walking outside their assigned room", () => {
    const fixture = proceduralStaffingFixture();
    const specialists = fixture.state.employees.filter((entry) => entry.staffRoleDefinitionId === "staff.endoscopist");
    fixture.state.employees = fixture.state.employees.filter((entry) => entry.id !== specialists[1]!.id);
    specialists[0]!.location = { x: 32, y: 24 };
    specialists[0]!.path = [specialists[0]!.location, { x: 33, y: 24 }]; specialists[0]!.pathIndex = 0;
    expect(getEligibleServiceRoute(fixture.state, "service.endoscopy")?.providerReservation).toMatchObject({ kind: "employee", employeeId: specialists[0]!.id });
  });

  it("waits through the inclusive five-minute boundary and permits founder after it", () => {
    const fixture = proceduralStaffingFixture();
    const specialists = fixture.state.employees.filter((entry) => entry.staffRoleDefinitionId === "staff.endoscopist");
    fixture.state.employees = fixture.state.employees.filter((entry) => entry.id !== specialists[1]!.id);
    const specialist = specialists[0]!;
    specialist.path = [specialist.location]; specialist.pathIndex = 0;
    specialist.facilityTask = { kind: "take_break", targetId: "fixture.short-break", startedAtFacilityTick: fixture.state.facilityTick, workMinutesRemaining: PROCEDURAL_SPECIALIST_SHORT_WAIT_MINUTES };
    expect(getProceduralSpecialistReadyAt(fixture.state, specialist, PROTOTYPE_DOMAIN_CONTEXT)).toBe(fixture.state.facilityTick + 5);
    expect(getEligibleServiceRoute(fixture.state, "service.endoscopy")).toBeNull();
    specialist.facilityTask.workMinutesRemaining += 1;
    expect(getEligibleServiceRoute(fixture.state, "service.endoscopy")?.providerReservation).toEqual({ kind: "founder" });
    specialist.facilityTask = null;
    expect(getEligibleServiceRoute(fixture.state, "service.endoscopy")?.providerReservation?.kind).toBe("employee");
  });

  it.each(["unhired", "unassigned", "unreachable", "out_of_service"])("permits overflow for a specialist who is %s", (reason) => {
    const fixture = proceduralStaffingFixture();
    const specialist = fixture.state.employees.find((entry) => entry.staffRoleDefinitionId === "staff.endoscopist")!;
    fixture.state.employees = fixture.state.employees.filter((entry) => entry.staffRoleDefinitionId !== "staff.endoscopist" || entry.id === specialist.id);
    if (reason === "unhired") fixture.state.employees = fixture.state.employees.filter((entry) => entry.id !== specialist.id);
    else if (reason === "unassigned") specialist.homeRoomInstanceId = null;
    else if (reason === "unreachable") fixture.state.doors = fixture.state.doors.filter((door) => door.roomId !== specialist.homeRoomInstanceId);
    else fixture.state.rooms.find((room) => room.id === specialist.homeRoomInstanceId)!.maintenance =
      { status: "out_of_service", completedUses: 0, dueAtFacilityTick: 0, outOfServiceAtFacilityTick: 0, appliedUseKeys: [] };
    expect(getEligibleServiceRoute(fixture.state, "service.endoscopy")?.providerReservation).toEqual({ kind: "founder" });
  });

  it.each([false, true])("waits at the care gate for a specialist released in five minutes (surgery=%s)", (surgery) => {
    const fixture = proceduralStaffingFixture(surgery);
    const specialists = fixture.state.employees.filter((entry) => entry.staffRoleDefinitionId === (surgery ? "staff.surgeon" : "staff.endoscopist"));
    const blockFounder = () => { fixture.state.environment.founderActivity = { kind: "attend_encounter", targetId: "fixture.other-consult",
      path: [fixture.state.environment.founderLocation], pathIndex: 0, lastMovedAtFacilityTick: fixture.state.facilityTick, workMinutesRemaining: Number.MAX_SAFE_INTEGER }; };
    blockFounder();
    for (const specialist of specialists) specialist.facilityTask = { kind: "review_ambulatory_qi", targetId: "fixture.busy", startedAtFacilityTick: fixture.state.facilityTick, workMinutesRemaining: Number.MAX_SAFE_INTEGER };
    const ids = fixture.admit(1);
    let operation: ServiceOperationState | undefined;
    for (let tick = 0; tick < 240; tick++) {
      operation = fixture.state.serviceOperations.find((entry) => entry.id === ids[0]);
      if (operation?.status === "walking_between_phases" || operation?.providerReservation) break;
      if (operation?.status === "waiting_for_next_phase") break;
      // Domain-only unknown work stays occupied; ordinary staff tasks can be
      // abandoned by their real controller when their synthetic target is absent.
      fixture.advance();
      blockFounder();
      for (const id of specialists.map((entry) => entry.id)) fixture.state.employees.find((entry) => entry.id === id)!.facilityTask =
        { kind: "review_ambulatory_qi", targetId: "fixture.busy", startedAtFacilityTick: fixture.state.facilityTick, workMinutesRemaining: Number.MAX_SAFE_INTEGER };
    }
    expect(operation?.status).toBe("waiting_for_next_phase");
    fixture.state.environment.founderActivity = null;
    for (const id of specialists.map((entry) => entry.id)) {
      const employee = fixture.state.employees.find((entry) => entry.id === id)!;
      employee.path = [employee.location]; employee.pathIndex = 0;
      employee.facilityTask!.workMinutesRemaining = PROCEDURAL_SPECIALIST_SHORT_WAIT_MINUTES;
    }
    advanceServiceOperations(fixture.state, PROTOTYPE_DOMAIN_CONTEXT);
    expect(operation!.providerReservation).toBeNull();
    expect(fixture.state.environment.founderActivity).toBeNull();
    fixture.state.facilityTick += PROCEDURAL_SPECIALIST_SHORT_WAIT_MINUTES;
    fixture.state.employees.find((entry) => entry.id === specialists[0]!.id)!.facilityTask = null;
    advanceServiceOperations(fixture.state, PROTOTYPE_DOMAIN_CONTEXT);
    expect(operation!.providerReservation).toMatchObject({ kind: "employee", employeeId: specialists[0]!.id });
  });

  it("preserves an already executing founder procedure across reload", () => {
    const fixture = proceduralStaffingFixture();
    fixture.state.employees = fixture.state.employees.filter((entry) => entry.staffRoleDefinitionId !== "staff.endoscopist");
    const ids = fixture.admit(1);
    for (let tick = 0; tick < 240 && !fixture.state.serviceOperations.some((entry) => entry.id === ids[0] && entry.status === "in_service" && entry.providerReservation); tick++) fixture.advance();
    const restored = deserializeGameState(serializeGameState(fixture.state));
    const operation = restored.serviceOperations.find((entry) => entry.id === ids[0])!;
    expect(operation.providerReservation).toEqual({ kind: "founder" });
    const originalEnd = operation.phaseEndsAtFacilityTick;
    advanceServiceOperations(restored, PROTOTYPE_DOMAIN_CONTEXT);
    expect(operation.providerReservation).toEqual({ kind: "founder" });
    expect(operation.phaseEndsAtFacilityTick).toBe(originalEnd);
  });

  it("hydrates legacy visitors without phase-flow, nurse-attention or training metadata", () => {
    const fixture = proceduralStaffingFixture();
    const ids = fixture.admit(1);
    const saved = JSON.parse(serializeGameState(fixture.state)) as GameState;
    const operation = saved.serviceOperations.find((entry) => entry.id === ids[0])!;
    delete operation.phaseFlowVersion; delete operation.periopBedFlowVersion; delete operation.periopNurseAttention;
    delete operation.trainingTiming; delete operation.frozenOperationPhases;
    delete operation.roomUpgradeRevenue; delete operation.roomUpgradeRecovery;
    delete operation.nextPhaseReadyAtFacilityTick; delete operation.transitionHeldRoomInstanceIds;
    const restored = deserializeGameState(JSON.stringify(saved));
    expect(restored.serviceOperations.find((entry) => entry.id === operation.id)).toMatchObject({ incomeLineId: "income.endoscopy", phaseIndex: 0 });
    expect(() => advanceServiceOperations(restored, PROTOTYPE_DOMAIN_CONTEXT)).not.toThrow();
  });
});

describe("diagnostic calendar specialist priority", () => {
  function quote(extra: (fixture: ReturnType<typeof timingFixture>) => void = () => {}): DiagnosticOrderPlan {
    const fixture = timingFixture();
    const endoscopy = fixture.addRoom("room.endoscopy", "staff.endoscopy_nurse");
    fixture.addRoom("room.periop_recovery", "staff.periop_nurse");
    const employee = { ...fixture.state.employees[0]!, id: "specialist.calendar", staffRoleDefinitionId: "staff.endoscopist", location: { x: 7, y: 65 }, path: [], facilityTask: null };
    fixture.state.employees.push(employee);
    fixture.state.environment.founderLocation = endoscopy.anchor;
    extra(fixture);
    const result = planDiagnosticOrder(fixture.state, { orderId: "order.specialist-priority", encounterId: fixture.encounter.id, serviceId: "service.endoscopy", allowedRouteIds: ["route.endoscopy.in_house"], patientOrigin: endoscopy.anchor }, fixture.context);
    expect(result.kind).toBe("planned");
    if (result.kind !== "planned") throw new Error(result.reason);
    return result.plan;
  }

  it("prefers a free specialist even when founder is at the table and the specialist walks farther", () => {
    const plan = quote();
    expect(plan.phases.find((phase) => phase.kind === "procedure")?.resource?.provider).toEqual({ kind: "employee", employeeId: "specialist.calendar" });
  });

  it("permits founder when specialist has longer known competing work", () => {
    const plan = quote((fixture) => {
      const employee = fixture.state.employees.find((entry) => entry.id === "specialist.calendar")!;
      employee.facilityTask = { kind: "review_ambulatory_qi", targetId: "qi.busy", startedAtFacilityTick: 0, workMinutesRemaining: 200 };
      employee.path = [employee.location];
    });
    expect(plan.phases.find((phase) => phase.kind === "procedure")?.resource?.provider).toEqual({ kind: "founder" });
  });

  it.each([5, 6])("uses the same inclusive short-wait boundary in the diagnostic calendar (%s minutes)", (remaining) => {
    const fixture = timingFixture();
    const endoscopy = fixture.addRoom("room.endoscopy", "staff.endoscopy_nurse");
    fixture.addRoom("room.periop_recovery", "staff.periop_nurse");
    fixture.state.environment.founderLocation = endoscopy.anchor;
    fixture.state.employees.push({ ...fixture.state.employees[0]!, id: "specialist.short-calendar", staffRoleDefinitionId: "staff.endoscopist", path: [endoscopy.anchor],
      facilityTask: { kind: "review_ambulatory_qi", targetId: "fixture.busy", startedAtFacilityTick: 0, workMinutesRemaining: remaining } });
    const result = planDiagnosticOrder(fixture.state, { orderId: "order.short-calendar", encounterId: fixture.encounter.id, serviceId: "service.endoscopy", allowedRouteIds: ["route.endoscopy.in_house"], patientOrigin: endoscopy.anchor,
      operationPhases: [{ id: "procedure", roomDefinitionId: "room.endoscopy", durationMinutes: 45, staffRoleDefinitionIds: ["staff.endoscopy_nurse"], providerRoleDefinitionIds: ["staff.endoscopist"], founderEligible: true }] }, fixture.context);
    expect(result.kind).toBe("planned");
    if (result.kind !== "planned") throw new Error(result.reason);
    expect(result.plan.phases.find((phase) => phase.kind === "procedure")?.resource?.provider?.kind).toBe(remaining === 5 ? "employee" : "founder");
  });
});
