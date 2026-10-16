import { describe, expect, it } from "vitest";
import { getCurrentPeriopNurseAttention, getRoomCareStations, getRoomDefinition } from "../src";
import { stuckPeriopOwnerSaveFixture } from "./periop-stuck-owner-save-fixture";

describe("Owner save: stranded periop patients and legacy companion", () => {
  it("releases Riley's 281-minute stalled bedside assignment on load, walks the patient back and preserves the 14 minutes still owed", () => {
    const clinic = stuckPeriopOwnerSaveFixture();
    clinic.reload();
    expect(clinic.state.facilityLevel).toBe(3);
    expect(clinic.state.rooms.filter((room) => room.roomDefinitionId === "room.periop_recovery")).toHaveLength(1);
    expect(clinic.state.rooms.filter((room) => room.roomDefinitionId === "room.endoscopy")).toHaveLength(2);
    expect(clinic.state.employees.find((employee) => employee.id === clinic.rileyId)!.facilityTask).toBeNull();
    expect(getCurrentPeriopNurseAttention(clinic.current())).toMatchObject({ remainingMinutes: 14, employeeId: null });
    expect(clinic.current().path.at(-1)).toEqual({ x: 27, y: 29 });
    let walked = false;
    let arrived = false;
    let completed = false;
    let progressedMinutes = 0;
    let previousRemaining = 14;
    for (let minute = 0; minute < 90; minute++) {
      clinic.advance();
      const op = clinic.current();
      const task = op.periopNurseAttention!.tasks[0]!;
      if (task.remainingMinutes < previousRemaining) {
        expect(op.location).toEqual(op.periopBedReservation!.endpoint);
        progressedMinutes += previousRemaining - task.remainingMinutes;
      }
      previousRemaining = task.remainingMinutes;
      expect(clinic.state.encounters[op.actorId]!.patientMovement?.kind).not.toBe("departing_for_offsite_testing");
      expect(op.location!.y).toBeLessThan(32);
      walked ||= op.pathIndex < op.path.length - 1;
      arrived ||= op.location?.x === 27 && op.location.y === 29;
      if (!arrived) expect(task.employeeId).toBeNull();
      if (task.completedAtFacilityTick !== null) { completed = true; break; }
      expect(op.phaseIndex).toBe(0);
    }
    expect(walked).toBe(true); expect(arrived).toBe(true); expect(completed).toBe(true);
    expect(progressedMinutes).toBe(14);
    expect(clinic.current().periopNurseAttention!.tasks[0]!.remainingMinutes).toBe(0);
  }, 30000);

  it("repairs the same assignment on a live tick without requiring reload", () => {
    const clinic = stuckPeriopOwnerSaveFixture();
    clinic.advance();
    expect(getCurrentPeriopNurseAttention(clinic.current())!.employeeId).toBeNull();
    expect(clinic.current().path.at(-1)).toEqual({ x: 27, y: 29 });
    expect(clinic.state.encounters[clinic.current().actorId]!.patientLocation).not.toEqual({ x: 37, y: 23 });
  }, 30000);

  it("resumes Maxwell's markerless 2,155-minute wait, adopts Lane, completes the visit and walks both off the map", () => {
    const clinic = stuckPeriopOwnerSaveFixture();
    clinic.reload();
    expect(clinic.legacy()).toBeDefined();
    expect(clinic.legacy().periopNurseAttention).toBeUndefined();
    expect(clinic.lane().procedureCompanion).toBeDefined();
    let procedure = false;
    let recovery = false;
    let companionWalked = false;
    let companionSat = false;
    for (let minute = 0; minute < 310; minute++) {
      clinic.advance();
      const op = clinic.legacy();
      procedure ||= op.phaseIndex === 1 && op.status === "in_service";
      recovery ||= op.phaseIndex === 2 && op.status === "in_service";
      companionWalked ||= clinic.lane().location !== null && (clinic.lane().location!.x !== 38 || clinic.lane().location!.y !== 26);
      companionSat ||= clinic.lane().procedureCompanion?.waitingReservation?.kind === "chair";
      if (op.status === "completed" && clinic.lane().lifecycle === "departed") break;
    }
    expect(procedure).toBe(true); expect(recovery).toBe(true);
    expect(companionWalked).toBe(true); expect(companionSat).toBe(true);
    expect(clinic.legacy().status).toBe("completed");
    expect(clinic.lane().lifecycle).toBe("departed");
    expect(clinic.lane().location).toBeNull();
    expect(clinic.state.encounters[clinic.legacy().actorId]!.patientLocation).toBeNull();
  }, 30000);

  it.each(["load", "tick"])("adopts legacy phase flags without training metadata on %s, retaining the accepted 29/41/60-minute work", (repair) => {
    const clinic = stuckPeriopOwnerSaveFixture();
    delete clinic.legacy().phaseFlowVersion;
    delete clinic.legacy().periopBedFlowVersion;
    delete clinic.legacy().trainingTiming;
    if (repair === "load") clinic.reload(); else clinic.advance();
    expect(clinic.legacy()).toMatchObject({ phaseFlowVersion: 1, periopBedFlowVersion: 1, nextPhaseReadyAtFacilityTick: 11237 });
    expect(clinic.legacy().frozenOperationPhases!.map((phase) => phase.durationMinutes)).toEqual([29, 41, 60]);
    expect(clinic.legacy().periopNurseAttention).toBeUndefined();
    for (let minute = 0; minute < 100 && clinic.legacy().phaseIndex === 0; minute++) clinic.advance();
    expect(clinic.legacy().phaseIndex).toBe(1);
  }, 30000);

  it("repairs an invalid saved bed endpoint to a reachable real bed instead of discarding the visit or pinning Riley", () => {
    const clinic = stuckPeriopOwnerSaveFixture();
    clinic.current().periopBedReservation!.endpoint = { x: 27, y: 30 };
    clinic.reload();
    const bed = clinic.current().periopBedReservation!;
    const room = clinic.state.rooms.find((room) => room.id === bed.roomInstanceId)!;
    const realBed = getRoomCareStations(room, getRoomDefinition(room.roomDefinitionId)!, clinic.state.doors, clinic.state.rooms, getRoomDefinition)
      .find((station) => station.id === bed.bedId)!;
    expect(bed.endpoint).toEqual(realBed.patientAnchor);
    expect(bed.endpoint).not.toEqual({ x: 27, y: 30 });
    for (let minute = 0; minute < 100 && clinic.current().periopNurseAttention!.tasks[0]!.completedAtFacilityTick === null; minute++) clinic.advance();
    expect(clinic.current().periopNurseAttention!.tasks[0]!.remainingMinutes).toBe(0);
    expect(clinic.current().status).not.toBe("cancelled");
  }, 30000);

  it("reports a disconnected room, frees the nurse and resumes with the same remaining work when its real door is restored", () => {
    const clinic = stuckPeriopOwnerSaveFixture();
    const door = clinic.state.doors.find((door) => door.id === "owner.periop.west")!;
    clinic.state.doors = clinic.state.doors.filter((candidate) => candidate.id !== door.id);
    clinic.reload(); clinic.advance(12);
    expect(clinic.current().status).toBe("waiting_for_resources");
    expect(clinic.current().resourceWaitReason).toMatch(/waiting for/i);
    expect(clinic.current().periopNurseAttention!.tasks[0]!.remainingMinutes).toBe(14);
    expect(clinic.state.employees.find((employee) => employee.id === clinic.rileyId)!.facilityTask?.kind).not.toBe("periop_attention");
    expect(clinic.legacy().nextPhaseReadyAtFacilityTick).toBe(11237);
    clinic.state.doors.push(door);
    for (let minute = 0; minute < 110 && clinic.current().periopNurseAttention!.tasks[0]!.completedAtFacilityTick === null; minute++) clinic.advance();
    expect(clinic.current().periopNurseAttention!.tasks[0]!.remainingMinutes).toBe(0);
    expect(clinic.current().status).not.toBe("cancelled");
  }, 30000);

  it("reports a genuine indefinite capacity wait without completing or cancelling the accepted visit", () => {
    const clinic = stuckPeriopOwnerSaveFixture();
    clinic.state.employees = clinic.state.employees.filter((employee) => employee.staffRoleDefinitionId !== "staff.endoscopy_nurse");
    clinic.reload(); clinic.advance(110);
    expect(clinic.legacy().status).toBe("waiting_for_next_phase");
    expect(clinic.legacy().phaseIndex).toBe(0);
    expect(clinic.legacy().resourceWaitReason).toMatch(/waiting for available.*capacity|connected route/i);
    expect(clinic.legacy().waitDeadlineFacilityTick).toBe(Number.MAX_SAFE_INTEGER);
    expect(clinic.legacy().cancelledAtFacilityTick).toBeNull();
    expect(clinic.legacy().completedAtFacilityTick).toBeNull();
  }, 30000);

  it("releases a dangling retail lock and lets a terminal visit's companion leave independently of a retained patient location", () => {
    const clinic = stuckPeriopOwnerSaveFixture();
    clinic.legacy().status = "cancelled"; clinic.legacy().cancelledAtFacilityTick = 13392;
    clinic.lane().activeRetailOperationId = "retail-operation.missing";
    clinic.reload();
    expect(clinic.lane().activeRetailOperationId).toBeNull();
    for (let minute = 0; minute < 100 && clinic.lane().lifecycle !== "departed"; minute++) clinic.advance();
    expect(clinic.lane().lifecycle).toBe("departed");
    expect(clinic.lane().location).toBeNull();
  }, 30000);

  it("walks an orphaned shopper out instead of retaining a missing optional-trip reservation forever", () => {
    const clinic = stuckPeriopOwnerSaveFixture();
    clinic.lane().kind = "retail_visitor"; clinic.lane().linkedServiceOperationId = clinic.lane().linkedEncounterId = null;
    clinic.lane().activeRetailOperationId = "retail-operation.missing";
    clinic.reload();
    expect(clinic.lane().activeRetailOperationId).toBeNull();
    for (let minute = 0; minute < 100 && clinic.lane().lifecycle !== "departed"; minute++) clinic.advance();
    expect(clinic.lane().lifecycle).toBe("departed");
  }, 30000);

  it("repairs a legacy completed-recovery transition with no next phase instead of waiting forever", () => {
    const clinic = stuckPeriopOwnerSaveFixture();
    const op = clinic.legacy(); op.phaseIndex = 2;
    op.roomUpgradeRecovery!.boundRoom = { roomInstanceId: "qa.periop.0", points: 0 };
    op.location = { x: 27, y: 28 }; op.path = [{ ...op.location }]; op.pathIndex = 0;
    clinic.state.encounters[op.actorId]!.patientLocation = { ...op.location };
    clinic.reload(); clinic.advance();
    expect(["discharging", "leaving", "completed"]).toContain(clinic.legacy().status);
    for (let minute = 0; minute < 100 && clinic.legacy().status !== "completed"; minute++) clinic.advance();
    expect(clinic.legacy().status).toBe("completed");
    expect(clinic.state.serviceIncomeReceipts.filter((receipt) => receipt.transactionKey.includes(op.id))).toHaveLength(1);
    clinic.reload(); clinic.advance(3);
    expect(clinic.state.serviceIncomeReceipts.filter((receipt) => receipt.transactionKey.includes(op.id))).toHaveLength(1);
  }, 30000);

  it("reserves a new bed for a legacy completed procedure whose recovery reservation is missing, then physically returns there", () => {
    const clinic = stuckPeriopOwnerSaveFixture();
    clinic.legacy().phaseIndex = 1;
    delete clinic.legacy().periopBedReservation;
    clinic.reload();
    expect(clinic.legacy().periopBedReservation).toBeDefined();
    let walked = false;
    for (let minute = 0; minute < 75; minute++) {
      clinic.advance();
      walked ||= clinic.legacy().status === "walking_between_phases";
      if (clinic.legacy().phaseIndex === 2 && clinic.legacy().status === "in_service") break;
    }
    expect(walked).toBe(true);
    expect(clinic.legacy()).toMatchObject({ phaseIndex: 2, status: "in_service" });
    expect(clinic.legacy().location).toEqual(clinic.legacy().periopBedReservation!.endpoint);
  }, 30000);

  it("restores a missing in-service phase clock without overwriting the attention task's required-until time", () => {
    const clinic = stuckPeriopOwnerSaveFixture();
    clinic.current().phaseEndsAtFacilityTick = null;
    clinic.reload();
    expect(clinic.current().phaseEndsAtFacilityTick).toBe(13399);
    expect(getCurrentPeriopNurseAttention(clinic.current())!.requiredUntilFacilityTick).toBe(13399);
    clinic.advance();
    expect(clinic.current().phaseEndsAtFacilityTick).toBeGreaterThanOrEqual(clinic.state.facilityTick + 14);
    expect(clinic.current().phaseIndex).toBe(0);
  }, 30000);

  it("does not forgive an incomplete check in a saved next-phase transition, and round-trips its mid-walk progress", () => {
    const clinic = stuckPeriopOwnerSaveFixture();
    clinic.current().status = "waiting_for_next_phase";
    clinic.current().phaseStartedAtFacilityTick = clinic.current().phaseEndsAtFacilityTick = null;
    clinic.current().nextPhaseReadyAtFacilityTick = 13390;
    clinic.reload(); clinic.advance(3);
    expect(clinic.current().status).toBe("in_service");
    const position = { ...clinic.current().location! };
    const index = clinic.current().pathIndex;
    const remaining = getCurrentPeriopNurseAttention(clinic.current())!.remainingMinutes;
    clinic.reload();
    expect(clinic.current().location).toEqual(position);
    expect(clinic.current().pathIndex).toBe(index);
    expect(getCurrentPeriopNurseAttention(clinic.current())!.remainingMinutes).toBe(remaining);
    for (let minute = 0; minute < 75 && clinic.current().periopNurseAttention!.tasks[0]!.completedAtFacilityTick === null; minute++) {
      clinic.advance();
      if (clinic.current().periopNurseAttention!.tasks[0]!.completedAtFacilityTick === null) expect(clinic.current().phaseIndex).toBe(0);
    }
    expect(clinic.current().periopNurseAttention!.tasks[0]!.completedAtFacilityTick).not.toBeNull();
  }, 30000);
});
