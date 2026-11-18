import { describe, expect, it } from "vitest";
import { getCurrentPeriopNurseAttention, getPeriopNurseAttentionQueue,
  getPeriopNurseStandingPoints, isEmployeeAssignedToOperationalRoom,
  pathServiceVisitorFromCurrentLocation, periopNurseAttentionStatus } from "../src";
import { planProcedureCompanionWait } from "../src/procedure-companions";
import { advanceSharedSpace, context, getRoomCompanionSeats, getRoomDefinition,
  hydrateSharedSpace, PERIOP_ROOMS, samePoint, sharedSpaceFixture, SharedSpaceCareMonitor, type SharedSpaceFixture } from "./periop-shared-working-space-fixture";

function acceptedWork(state: SharedSpaceFixture["state"], fixture: SharedSpaceFixture) {
  return fixture.initialTasks.map(row => {
    const op = state.serviceOperations.find(candidate => candidate.id === row.id)!;
    const task = op.periopNurseAttention!.tasks.find(task => task.phaseIndex === row.phaseIndex)!;
    return { id: op.id, created: op.createdAtFacilityTick, phases: op.frozenOperationPhases,
      ready: task.readyAtFacilityTick, duration: task.durationMinutes, remaining: task.remainingMinutes };
  });
}

function runUntilCare(fixture: SharedSpaceFixture, reload = false) {
  // Establish the symptom before loading; hydration is allowed to repair the
  // obstruction or assign a nurse immediately, while retaining all paid work.
  const initial = fixture.state;
  expect(initial.simulationSpeed).toBe(1);
  expect(initial.rooms.filter(room => room.roomDefinitionId === "room.endoscopy")).toHaveLength(5);
  expect(initial.rooms.filter(room => room.roomDefinitionId === "room.ambulatory_or")).toHaveLength(2);
  const nurses = initial.employees.filter(employee => employee.staffRoleDefinitionId === "staff.periop_nurse");
  expect(nurses).toHaveLength(4);
  for (const nurse of nurses) {
    expect(isEmployeeAssignedToOperationalRoom(initial, nurse.id, context)).toBe(true);
    expect(nurse.facilityTask).toBeNull();
  }
  expect(getPeriopNurseAttentionQueue(initial).map(({ operation }) => operation.id)).toEqual(fixture.patientIds);
  for (const id of fixture.patientIds.slice(2)) {
    const younger = initial.serviceOperations.find(op => op.id === id)!;
    const points = getPeriopNurseStandingPoints(initial, younger, context);
    expect(points.length, "Younger work in the other room has real bedside access").toBeGreaterThan(0);
    expect(initial.retailExternalActors.some(actor => actor.lifecycle !== "departed" && points.some(point =>
      samePoint(point, actor.location) || samePoint(point, actor.path.at(-1))))).toBe(false);
  }
  let state = reload ? hydrateSharedSpace(initial) : initial;
  expect(acceptedWork(state, fixture), "Hydration must retain accepted priority, frozen phases and every nursing minute").toEqual(acceptedWork(initial, fixture));
  const monitor = new SharedSpaceCareMonitor(fixture, state);
  for (let minute = 0; minute < fixture.bound; minute++) {
    state = advanceSharedSpace(state, `symptom.${minute}`);
    monitor.observe(state);
    if (monitor.done) break;
  }
  return { state, monitor, summary: monitor.summary(state) };
}

function expectCareResumes(fixture: SharedSpaceFixture, result: ReturnType<typeof runUntilCare>) {
  const evidence = JSON.stringify({ ...result.summary, waiting: getPeriopNurseAttentionQueue(result.state).map(({ operation }) => operation.id) });
  expect(result.summary.completed, `B-013: every ready patient, including the blocked FIFO head, must receive all accepted care. ${evidence}`).toEqual(expect.arrayContaining(fixture.patientIds));
  expect(result.summary.procedures.length, evidence).toBeGreaterThan(0);
  expect(result.summary.assignmentOrder, "Preserve ready-time/creation-time/stable-ID priority").toEqual(fixture.patientIds);
  expect(result.summary.violations, evidence).toEqual([]);
  for (const row of fixture.initialTasks) {
    const op = result.state.serviceOperations.find(candidate => candidate.id === row.id)!;
    const task = op.periopNurseAttention!.tasks.find(task => task.phaseIndex === row.phaseIndex)!;
    expect(task.remainingMinutes).toBe(0);
    expect(result.monitor.work.get(row.id), "Credit each accepted minute exactly once at the bedside").toBe(row.remaining);
    expect(task.completedAtFacilityTick).not.toBeNull();
    expect(periopNurseAttentionStatus(op, result.state.facilityTick)).not.toBe("Waiting for peri-op nurse");
  }
}

describe("B-013 shared peri-op working space", () => {
  it("B-013 attends the oldest and younger ready patients and starts a case despite a later pediatric parent", () => {
    const fixture = sharedSpaceFixture();
    const result = runUntilCare(fixture);
    expectCareResumes(fixture, result);
  });

  it("B-013 automatically recovers an already-persisted same-room parent/FIFO deadlock", () => {
    const fixture = sharedSpaceFixture({ retained: true });
    const result = runUntilCare(fixture, true);
    expectCareResumes(fixture, result);
  });

  it("B-013 recovers a mid-parent-walk reload without abandoning the accepted oldest work", () => {
    const fixture = sharedSpaceFixture({ retained: true, midWalk: true });
    const parent = fixture.state.retailExternalActors.find(actor => actor.id === fixture.blockerId)!;
    expect(parent.pathIndex).toBeGreaterThan(0);
    expect(parent.pathIndex).toBeLessThan(parent.path.length - 1);
    const result = runUntilCare(fixture, true);
    expectCareResumes(fixture, result);
  });

  it("B-013 frees a persisted post-op queue head and lets younger preparation proceed", () => {
    const fixture = sharedSpaceFixture({ retained: true, postOp: true });
    const result = runUntilCare(fixture, true);
    expectCareResumes(fixture, result);
    const oldest = result.state.serviceOperations.find(op => op.id === fixture.oldestId)!;
    expect(periopNurseAttentionStatus(oldest, result.state.facilityTick)).not.toBe("Waiting for peri-op nurse");
    expect(getCurrentPeriopNurseAttention(oldest)?.remainingMinutes ?? 0).toBe(0);
  });

  it("B-013 ordinary companion standing overflow leaves all needed nurse working points usable when chairs are full", () => {
    const fixture = sharedSpaceFixture({ ordinary: true });
    const { state } = fixture;
    const room = state.rooms.find(room => room.id === PERIOP_ROOMS[0])!;
    const companion = state.retailExternalActors.find(actor => actor.id === fixture.blockerId)!;
    expect(companion.kind).toBe("companion");
    expect(companion.pediatricFamilyId).toBeUndefined();
    const seats = getRoomCompanionSeats(room, getRoomDefinition(room.roomDefinitionId)!, state.doors, state.rooms, getRoomDefinition);
    expect(seats).toHaveLength(8);
    for (const [index, seat] of seats.entries()) {
      if (state.employees.some(employee => samePoint(employee.location, seat.anchor) || samePoint(employee.path.at(-1), seat.anchor))) continue;
      state.retailExternalActors.push({ ...companion, id: `shared.full-chair.${index}`,
        displayName: `Synthetic seated companion ${index + 1}`,
        procedureCompanion: { ...companion.procedureCompanion!, waitingReservation: {
          roomInstanceId: room.id, kind: "chair", seatId: seat.id, location: { ...seat.anchor },
        } },
        location: { ...seat.anchor }, path: [{ ...seat.anchor }], pathIndex: 0 });
    }
    expect(seats.every(seat => state.retailExternalActors.some(actor => samePoint(actor.location, seat.anchor)) ||
      state.employees.some(employee => samePoint(employee.location, seat.anchor) || samePoint(employee.path.at(-1), seat.anchor)))).toBe(true);
    const operation = state.serviceOperations.find(op => op.id === fixture.oldestId)!;
    const plan = planProcedureCompanionWait(state, context, companion, operation, (start, target, roomId) =>
      pathServiceVisitorFromCurrentLocation(state, context, start, target, new Set(roomId ? [roomId] : [])));
    // Use the real planner for the accepted standing-overflow route, then judge
    // actual care and safe movement. A valid repair may reroute at any layer.
    if (plan) {
      companion.procedureCompanion!.waitingReservation = plan.reservation;
      companion.path = plan.path; companion.pathIndex = 0;
    }
    expectCareResumes(fixture, runUntilCare(fixture));
  });
});
