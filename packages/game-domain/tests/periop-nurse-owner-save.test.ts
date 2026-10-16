import { describe, expect, it } from "vitest";
import { getCurrentPeriopNurseAttention, getPeriopNurseStandingPoints, isEmployeeAwayForTraining, PROTOTYPE_DOMAIN_CONTEXT } from "../src";
import { getPlacedRoomIdleSpots } from "../src/employee-idle-spots";
import { ownerBlake, ownerCoverageTask, periopOwnerSaveFixture } from "./periop-nurse-owner-save-fixture";

describe("Owner save legacy periop coverage release", () => {
  it.each([9007199254737433, Number.MAX_SAFE_INTEGER, Infinity, NaN, 15])("releases coverage with %s remaining on load, including JSON-null nonfinite values", (remaining) => {
    const clinic = periopOwnerSaveFixture();
    ownerBlake(clinic.state).facilityTask!.workMinutesRemaining = remaining;
    clinic.reload();
    expect(ownerBlake(clinic.state).facilityTask).toBeNull();
    expect(ownerBlake(clinic.state).path).toEqual([{ x: 26, y: 29 }]);
    expect(ownerBlake(clinic.state).training?.paidAmount).toBe(125);
  });

  it.each([9007199254737433, Infinity, NaN])("releases an orphan periop room service alias with %s remaining on a normal tick", (remaining) => {
    const clinic = periopOwnerSaveFixture();
    const employee = ownerBlake(clinic.state);
    employee.facilityTask = { ...ownerCoverageTask("qa.periop.0"), kind: "perform_service", workMinutesRemaining: remaining };
    clinic.advance();
    expect(ownerBlake(clinic.state).facilityTask).toBeNull();
  });

  it.each([9007199254737433, Infinity, NaN])("releases an orphan periop room service alias with %s remaining on deserialize", (remaining) => {
    const clinic = periopOwnerSaveFixture();
    const employee = ownerBlake(clinic.state);
    employee.facilityTask = { ...ownerCoverageTask("qa.periop.0"), kind: "perform_service", workMinutesRemaining: remaining };
    clinic.reload();
    expect(ownerBlake(clinic.state).facilityTask).toBeNull();
    expect(ownerBlake(clinic.state).path).toEqual([{ x: 26, y: 29 }]);
    expect(ownerBlake(clinic.state).training?.paidAmount).toBe(125);
  });

  it("loads Blake's exact targetless coverage and honours the already-paid $125 training before returning to checks and idle seats", () => {
    const clinic = periopOwnerSaveFixture();
    const cash = clinic.state.cashCents;
    clinic.reload();
    expect(ownerBlake(clinic.state).facilityTask).toBeNull();
    expect(ownerBlake(clinic.state).path).toEqual([{ x: 26, y: 29 }]);
    expect(ownerBlake(clinic.state).training).toMatchObject({ stage: "queued", paidAmount: 125, targetLevel: 2, requestedAtFacilityTick: 10705 });
    let walkedToTraining = false;
    let trained = false;
    for (let minute = 0; minute < 140; minute++) {
      const employee = ownerBlake(clinic.advance());
      walkedToTraining ||= employee.training?.stage === "walking_to_training";
      trained ||= employee.training?.stage === "training";
      if (employee.training) expect(employee.training.paidAmount).toBe(125);
      expect(clinic.state.cashCents).toBe(cash);
      if (!employee.training && employee.trainingLevel === 2) break;
    }
    expect(walkedToTraining).toBe(true);
    expect(trained).toBe(true);
    expect(ownerBlake(clinic.state)).toMatchObject({ training: null, trainingLevel: 2 });
    const ids = clinic.admit();
    const checks = new Set<string>();
    let walkedToPatient = false;
    for (let minute = 0; minute < 400; minute++) {
      const employee = ownerBlake(clinic.advance());
      expect(employee.facilityTask?.kind).not.toBe("cover_periop");
      if (employee.facilityTask?.kind === "periop_attention") {
        const operation = clinic.state.serviceOperations.find((entry) => entry.id === employee.facilityTask!.targetId)!;
        const task = getCurrentPeriopNurseAttention(operation)!;
        checks.add(task.kind);
        walkedToPatient ||= employee.pathIndex < employee.path.length - 1;
        if (task.startedAtFacilityTick !== null) expect(getPeriopNurseStandingPoints(clinic.state, operation, PROTOTYPE_DOMAIN_CONTEXT)).toContainEqual(employee.location);
      }
      if (ids.every((id) => clinic.state.serviceOperations.find((operation) => operation.id === id)?.status === "completed")) break;
    }
    expect(checks).toEqual(new Set(["pre_op", "post_op"]));
    expect(walkedToPatient).toBe(true);
    expect(ids.every((id) => clinic.state.serviceOperations.find((operation) => operation.id === id)?.status === "completed")).toBe(true);
    let sat = false;
    for (let minute = 0; minute < 35; minute++) {
      const employee = ownerBlake(clinic.advance());
      expect(employee.facilityTask).toBeNull();
      sat ||= getPlacedRoomIdleSpots(clinic.state.rooms.find((room) => room.id === employee.homeRoomInstanceId)!).some((spot) =>
        spot.tile.x === employee.location.x && spot.tile.y === employee.location.y);
    }
    expect(sat).toBe(true);
  });

  it("does not retain room-bound sentinel coverage merely because a new queue patient reserved a bed", () => {
    const clinic = periopOwnerSaveFixture();
    ownerBlake(clinic.state).training = null;
    clinic.reload();
    const ids = clinic.admit();
    for (let minute = 0; minute < 90 && !clinic.state.serviceOperations.some((operation) => operation.periopBedReservation); minute++) clinic.advance();
    expect(clinic.state.serviceOperations.some((operation) => operation.periopBedReservation)).toBe(true);
    ownerBlake(clinic.state).facilityTask = ownerCoverageTask("qa.periop.0");
    clinic.reload();
    expect(ownerBlake(clinic.state).facilityTask).toBeNull();
    let assigned = false;
    for (let minute = 0; minute < 70; minute++) {
      assigned ||= ownerBlake(clinic.advance()).facilityTask?.kind === "periop_attention";
    }
    expect(assigned).toBe(true);
    expect(clinic.state.serviceOperations.filter((operation) => ids.includes(operation.id)).every((operation) => operation.periopNurseAttention)).toBe(true);
  });

  it("lets Blake take a check while training has no place, then leave between checks when a place becomes available", () => {
    const clinic = periopOwnerSaveFixture();
    const trainingDoor = clinic.state.doors.find((door) => door.id === "owner.training.east")!;
    clinic.state.doors = clinic.state.doors.filter((door) => door.id !== trainingDoor.id);
    clinic.reload();
    clinic.admit();
    let checkedId: string | undefined;
    for (let minute = 0; minute < 100; minute++) {
      const employee = ownerBlake(clinic.advance());
      expect(employee.training).toMatchObject({ stage: "queued", paidAmount: 125 });
      if (employee.facilityTask?.kind === "periop_attention") {
        const operation = clinic.state.serviceOperations.find((entry) => entry.id === employee.facilityTask!.targetId)!;
        if (getCurrentPeriopNurseAttention(operation)!.startedAtFacilityTick !== null) { checkedId = operation.id; break; }
      }
    }
    expect(checkedId).toBeDefined();
    clinic.state.doors.push(trainingDoor);
    let completedBeforeTraining = false;
    let departed = false;
    for (let minute = 0; minute < 45; minute++) {
      const state = clinic.advance();
      completedBeforeTraining ||= state.serviceOperations.find((operation) => operation.id === checkedId)!.periopNurseAttention!.tasks[0]!.completedAtFacilityTick !== null;
      if (isEmployeeAwayForTraining(ownerBlake(state))) {
        expect(completedBeforeTraining).toBe(true);
        expect(ownerBlake(state).training?.paidAmount).toBe(125);
        expect(ownerBlake(state).facilityTask).toBeNull();
        departed = true;
        break;
      }
    }
    expect(departed).toBe(true);
  });

  it("releases coverage on a live tick and never recreates it for already-attended legacy visits while paid training departs", () => {
    const clinic = periopOwnerSaveFixture();
    const trainingDoor = clinic.state.doors.find((door) => door.id === "owner.training.east")!;
    clinic.state.doors = clinic.state.doors.filter((door) => door.id !== trainingDoor.id);
    const ids = clinic.admit(1);
    for (const operation of clinic.state.serviceOperations) delete operation.periopNurseAttention;
    for (let minute = 0; minute < 100 && !clinic.state.serviceOperations.some((operation) => operation.periopBedReservation); minute++) clinic.advance();
    ownerBlake(clinic.state).facilityTask = ownerCoverageTask("qa.periop.0");
    clinic.state.doors.push(trainingDoor);
    expect(ownerBlake(clinic.state).training?.stage).toBe("queued");
    let trained = false;
    for (let minute = 0; minute < 330; minute++) {
      const state = clinic.advance();
      expect(state.employees.some((employee) => employee.facilityTask?.kind === "cover_periop")).toBe(false);
      trained ||= isEmployeeAwayForTraining(ownerBlake(state));
      if (ids.every((id) => state.serviceOperations.find((operation) => operation.id === id)?.status === "completed")) break;
    }
    expect(trained).toBe(true);
    expect(clinic.state.serviceOperations[0]!.periopNurseAttention).toBeUndefined();
    expect(clinic.state.serviceOperations[0]!.status).toBe("completed");
  });
});
