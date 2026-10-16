import { describe, expect, it } from "vitest";
import { getCurrentPeriopNurseAttention, getPeriopNurseAttentionQueue, getPeriopNurseStandingPoints,
  isEmployeeAwayForTraining, PROTOTYPE_DOMAIN_CONTEXT, startRetailPurchase } from "../src";
import { getPlacedRoomIdleSpots } from "../src/employee-idle-spots";
import { periopFlowFixture, periopNurses } from "./periop-nurse-flow-fixture";

describe("Owner periop nurse flow reproduction", () => {
  it.each([2, 3])("shares closely arriving visits and staggered recovery checks across %i normally hired nurses", (count) => {
    const clinic = periopFlowFixture(count, count === 3 ? 3 : 2);
    const patientIds = clinic.admit(4);
    const assignments = new Map<string, { nurse: string; kind: string }>();
    const walked = new Set<string>();
    const stood = new Set<string>();
    let concurrent = 0;
    for (let minute = 0; minute < 360; minute++) {
      const state = clinic.advance();
      concurrent = Math.max(concurrent, periopNurses(state).filter((employee) => employee.facilityTask?.kind === "periop_attention").length);
      for (const operation of state.serviceOperations) for (const task of operation.periopNurseAttention?.tasks ?? []) {
        const key = `${operation.id}:${task.kind}`;
        if (task.employeeId) {
          assignments.set(key, { nurse: task.employeeId, kind: task.kind });
          const nurse = state.employees.find((employee) => employee.id === task.employeeId)!;
          if (nurse.pathIndex < nurse.path.length - 1) walked.add(key);
          else {
            expect(nurse.location).toEqual(task.standingPoint);
            expect(getPeriopNurseStandingPoints(state, operation, PROTOTYPE_DOMAIN_CONTEXT)).toContainEqual(nurse.location);
            expect(Math.max(Math.abs(nurse.location.x - operation.location!.x), Math.abs(nurse.location.y - operation.location!.y))).toBe(1);
            stood.add(key);
          }
        }
      }
      if (patientIds.every((id) => state.serviceOperations.find((operation) => operation.id === id)?.status === "completed")) break;
    }
    const diagnostics = {
      assignments: [...assignments.entries()],
      nurses: periopNurses(clinic.state).map((employee) => ({ id: employee.id, home: employee.homeRoomInstanceId, location: employee.location, task: employee.facilityTask })),
      operations: clinic.state.serviceOperations.map((operation) => ({ id: operation.id, status: operation.status, phase: operation.phaseIndex, checks: operation.periopNurseAttention?.tasks })),
    };
    expect(concurrent, JSON.stringify(diagnostics)).toBe(count);
    expect(patientIds.every((id) => clinic.state.serviceOperations.find((operation) => operation.id === id)?.status === "completed"), JSON.stringify(diagnostics)).toBe(true);
    expect(assignments.size).toBe(8);
    expect(walked.size).toBeGreaterThanOrEqual(4);
    expect(stood.size).toBe(8);
    for (const operation of clinic.state.serviceOperations) for (const task of operation.periopNurseAttention!.tasks) {
      expect(task.completedAtFacilityTick! - task.startedAtFacilityTick!).toBe(15);
      expect(task.employeeId).toBeNull();
    }
    const recoveryNurses = new Set([...assignments.values()].filter((entry) => entry.kind === "post_op").map((entry) => entry.nurse));
    expect(recoveryNurses.size, JSON.stringify(diagnostics)).toBe(count);
    const recoveryCounts = periopNurses(clinic.state).map((employee) => [...assignments.values()].filter((entry) => entry.kind === "post_op" && entry.nurse === employee.id).length);
    expect(Math.max(...recoveryCounts) - Math.min(...recoveryCounts), JSON.stringify(diagnostics)).toBeLessThanOrEqual(1);
  });

  it("settles released nurses into distinct free staff seats during a quiet period", () => {
    const clinic = periopFlowFixture();
    const ids = clinic.admit(4);
    for (let minute = 0; minute < 360 && ids.some((id) => clinic.state.serviceOperations.find((operation) => operation.id === id)?.status !== "completed"); minute++) clinic.advance();
    clinic.advance(5);
    const nurses = periopNurses(clinic.state);
    const destinations = nurses.map((employee) => employee.path.at(-1) ?? employee.location);
    for (const [index, employee] of nurses.entries()) {
      const home = clinic.state.rooms.find((room) => room.id === employee.homeRoomInstanceId)!;
      expect(employee.facilityTask).toBeNull();
      expect(getPlacedRoomIdleSpots(home).map((spot) => spot.tile), JSON.stringify(nurses)).toContainEqual(destinations[index]);
    }
    expect(destinations[0]).not.toEqual(destinations[1]);
  });

  it("covers mixed endoscopy/surgery pre-op and recovery at Level 3, including patients outside a nurse's home room", () => {
    const clinic = periopFlowFixture(3, 3, { surgery: true });
    const ids = clinic.admit(4, ["income.endoscopy", "income.ambulatory_operation"]);
    const working = new Set<string>();
    let coveredAnotherRoom = false;
    for (let minute = 0; minute < 520; minute++) {
      const state = clinic.advance();
      for (const operation of state.serviceOperations) {
        const task = getCurrentPeriopNurseAttention(operation);
        if (!task?.employeeId) continue;
        working.add(task.employeeId);
        const nurse = state.employees.find((employee) => employee.id === task.employeeId)!;
        coveredAnotherRoom ||= nurse.homeRoomInstanceId !== operation.periopBedReservation?.roomInstanceId;
      }
      if (ids.every((id) => state.serviceOperations.find((operation) => operation.id === id)?.status === "completed")) break;
    }
    expect(working.size).toBe(3);
    expect(coveredAnotherRoom).toBe(true);
    for (const id of ids) {
      const operation = clinic.state.serviceOperations.find((entry) => entry.id === id)!;
      expect(operation.status).toBe("completed");
      expect(operation.periopNurseAttention!.tasks.every((task) => task.completedAtFacilityTick !== null)).toBe(true);
    }
  });

  it("preserves nurse rotation and in-flight work when saving a real burst, and defaults old employee records safely", () => {
    const clinic = periopFlowFixture();
    const ids = clinic.admit();
    clinic.advance(25);
    expect(getPeriopNurseAttentionQueue(clinic.state).length).toBeGreaterThan(0);
    const before = structuredClone(clinic.state.serviceOperations.map((operation) => operation.periopNurseAttention));
    const rotation = periopNurses(clinic.state).map((employee) => employee.lastPeriopAttentionAssignedAtFacilityTick);
    clinic.reload();
    expect(clinic.state.serviceOperations.map((operation) => operation.periopNurseAttention)).toEqual(before);
    expect(periopNurses(clinic.state).map((employee) => employee.lastPeriopAttentionAssignedAtFacilityTick)).toEqual(rotation);
    for (let minute = 0; minute < 360 && ids.some((id) => clinic.state.serviceOperations.find((operation) => operation.id === id)?.status !== "completed"); minute++) clinic.advance();
    expect(clinic.state.serviceOperations.every((operation) => operation.status === "completed")).toBe(true);
    for (const employee of periopNurses(clinic.state)) delete employee.lastPeriopAttentionAssignedAtFacilityTick;
    clinic.reload();
    expect(periopNurses(clinic.state).every((employee) => employee.lastPeriopAttentionAssignedAtFacilityTick === undefined)).toBe(true);
  });

  it("lets a seated nurse leave for paid training while the other handles the burst and delayed phases", () => {
    const clinic = periopFlowFixture(2, 2, { amenities: true });
    const absentId = periopNurses(clinic.state)[0]!.id;
    clinic.train(absentId);
    clinic.advance();
    expect(clinic.state.employees.find((employee) => employee.id === absentId)!.training?.stage).toBe("walking_to_training");
    clinic.admit();
    let observedTraining = false;
    let observedOtherWorking = false;
    for (let minute = 0; minute < 80; minute++) {
      const state = clinic.advance();
      const absent = state.employees.find((employee) => employee.id === absentId)!;
      if (isEmployeeAwayForTraining(absent)) {
        expect(absent.facilityTask).toBeNull();
        expect(state.serviceOperations.every((operation) => getCurrentPeriopNurseAttention(operation)?.employeeId !== absentId)).toBe(true);
        observedTraining ||= absent.training?.stage === "training";
        observedOtherWorking ||= periopNurses(state).some((employee) => employee.id !== absentId && employee.facilityTask?.kind === "periop_attention");
      }
    }
    expect(observedTraining).toBe(true);
    expect(observedOtherWorking).toBe(true);
  });

  it("clears orphan coverage and keeps legacy visits attended without recreating room coverage or adding checks", () => {
    const clinic = periopFlowFixture();
    const orphanId = periopNurses(clinic.state)[0]!.id;
    periopNurses(clinic.state)[0]!.facilityTask = { kind: "cover_periop", targetId: "qa.periop.0", startedAtFacilityTick: 0, workMinutesRemaining: Number.MAX_SAFE_INTEGER };
    clinic.advance();
    expect(clinic.state.employees.find((employee) => employee.id === orphanId)!.facilityTask).toBeNull();
    const ids = clinic.admit();
    for (const operation of clinic.state.serviceOperations) delete operation.periopNurseAttention;
    clinic.reload();
    for (let minute = 0; minute < 520; minute++) {
      const state = clinic.advance();
      expect(periopNurses(state).some((employee) => employee.facilityTask?.kind === "cover_periop")).toBe(false);
      expect(state.serviceOperations.every((operation) => operation.periopNurseAttention === undefined)).toBe(true);
      if (ids.every((id) => state.serviceOperations.find((operation) => operation.id === id)?.status === "completed")) break;
    }
    expect(clinic.state.serviceOperations.every((operation) => operation.status === "completed")).toBe(true);
    expect(periopNurses(clinic.state).every((employee) => !employee.facilityTask)).toBe(true);
  });

  it("lets idle nurses use the real coffee trip and Level-3 break room before returning to staff seats", () => {
    const clinic = periopFlowFixture(2, 3, { amenities: true });
    const [coffee, resting] = periopNurses(clinic.state);
    const coffeeId = startRetailPurchase(clinic.state, "income.coffee", "employee", coffee!.id, PROTOTYPE_DOMAIN_CONTEXT);
    expect(coffeeId).not.toBeNull();
    resting!.morale = 50;
    clinic.advance();
    expect(clinic.state.employees.find((employee) => employee.id === resting!.id)!.facilityTask?.kind).toBe("take_break");
    let walkedForCoffee = false;
    let satOnBreak = false;
    for (let minute = 0; minute < 100; minute++) {
      const state = clinic.advance();
      const trip = state.retailOperations.find((operation) => operation.id === coffeeId)!;
      const buyer = state.employees.find((employee) => employee.id === coffee!.id)!;
      const onBreak = state.employees.find((employee) => employee.id === resting!.id)!;
      if (!["completed", "cancelled", "abandoned"].includes(trip.status)) {
        expect(buyer.facilityTask).toBeNull();
        walkedForCoffee ||= buyer.pathIndex < buyer.path.length - 1;
      }
      satOnBreak ||= onBreak.facilityTask?.kind === "take_break" && onBreak.pathIndex === onBreak.path.length - 1;
      if (trip.status === "completed" && onBreak.lastBreakAtFacilityTick !== null && onBreak.lastBreakAtFacilityTick !== undefined) break;
    }
    expect(walkedForCoffee).toBe(true);
    expect(satOnBreak).toBe(true);
    const returnedToSeat = new Set<string>();
    for (let minute = 0; minute < 30; minute++) for (const employee of periopNurses(clinic.advance())) {
      expect(employee.facilityTask).toBeNull();
      if (getPlacedRoomIdleSpots(clinic.state.rooms.find((room) => room.id === employee.homeRoomInstanceId)!).some((spot) =>
        spot.tile.x === employee.location.x && spot.tile.y === employee.location.y)) returnedToSeat.add(employee.id);
    }
    expect(returnedToSeat.size, JSON.stringify(periopNurses(clinic.state))).toBe(2); // They may leave again on their idle schedule.
  });
});
