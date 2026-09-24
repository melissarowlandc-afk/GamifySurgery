import { describe, expect, it } from "vitest";
import {
  createInitialGameState,
  deserializeGameState,
  gameReducer,
  getFacilityAccessValidation,
  getOperationalGlp1AutomationCapacity,
  serializeGameState,
  type GameState,
} from "../src";

function levelTwoPersistenceFixture(): GameState {
  const state = createInitialGameState(undefined, {
    campaignId: "campaign.level-two-persistence",
    campaignSeed: "level-two-persistence",
    createdAtRealMs: 0,
  });
  state.facilityLevel = 2;
  state.paused = false;
  state.rooms = state.rooms.filter((room) => room.id !== "room.instance.starter_examination");
  state.doors = state.doors.filter((door) => door.roomId !== "room.instance.starter_examination");
  state.encounters = {};
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  state.nextFinancialPostingTick = Number.MAX_SAFE_INTEGER;
  const room = (id: string, roomDefinitionId: string, x: number, y: number) =>
    ({ id, roomDefinitionId, x, y, orientation: 0 as const, doorSide: null, upgradeLevel: 1 as const, cleanliness: 100 });
  state.rooms.push(
    room("room.test.exam", "room.examination", 33, 25),
    room("room.test.endoscopy", "room.endoscopy", 28, 23),
    room("room.test.periop", "room.periop_recovery", 28, 26),
    room("room.test.glp", "room.glp1_telehealth_suite", 29, 29),
    ...[24, 25, 26, 27, 28, 29, 30].map((y) => room(`room.test.hall.${y}`, "room.hallway", 32, y)),
  );
  state.doors.push(
    { id: "door.test.front", roomId: "room.instance.founder_desk", side: "west", offset: 0, exterior: false },
    { id: "door.test.exam", roomId: "room.test.exam", side: "west", offset: 1, exterior: false },
    { id: "door.test.endoscopy", roomId: "room.test.endoscopy", side: "east", offset: 1, exterior: false },
    { id: "door.test.periop", roomId: "room.test.periop", side: "east", offset: 1, exterior: false },
    { id: "door.test.glp", roomId: "room.test.glp", side: "east", offset: 1, exterior: false },
  );
  const employee = (id: string, role: string, homeRoomInstanceId: string) => ({
    id, staffRoleDefinitionId: role, displayName: id, appearance: state.founder.appearance,
    hiredAtFacilityTick: 0, salaryPerExpenseInterval: 0, morale: 100, trainingLevel: 1 as const,
    homeRoomInstanceId, location: { x: 30, y: 25 }, path: [], pathIndex: 0,
    lastMovedAtFacilityTick: 0, lastPraisedAtFacilityTick: null, nextIdleActionAtFacilityTick: 999,
  });
  state.employees.push(
    employee("employee.test.endoscopy-nurse", "staff.endoscopy_nurse", "room.test.endoscopy"),
    employee("employee.test.periop-nurse", "staff.periop_nurse", "room.test.periop"),
    employee("employee.test.endoscopist", "staff.endoscopist", "room.test.endoscopy"),
    employee("employee.test.glp", "staff.glp1_np", "room.test.glp"),
  );
  state.employees.at(-1)!.location = { x: 31, y: 30 };
  state.environment.glp1AutomationNextPayoutTicks = [60];
  state.environment.glp1AutomationNextPayoutTick = 60;
  state.encounters["encounter.test.endoscopy"] = {
    id: "encounter.test.endoscopy", lifecycle: "active_pending_result", frozenCase: Object.values(createInitialGameState().encounters)[0]!.frozenCase,
    patientDisplayName: "Persistence fixture", arrivalClass: "routine", patientSatisfaction: 100, arrivedAtTick: 0,
    departureDueTick: null, patienceExempt: false, warningThresholdsShown: [], currentNodeIndex: 0, answers: [], steps: [],
    firstOpenedAtTick: null, idleWaitingSinceTick: null, nextIdleActionAtFacilityTick: 999, assignedRoomInstanceId: "room.test.exam",
    queuedCareRoomInstanceId: null, patientLocation: { x: 34, y: 26 }, patientMovement: null, feedAttentionKind: null, dissatisfactionByCause: {},
    pendingResult: { operationId: "fixture.endoscopy", gateId: "fixture", originatingNodeIndex: 0, resultTypeId: "service.endoscopy", pendingLabel: "fixture", resultNarrative: "fixture", routeId: "route.endoscopy.in_house", routeDisplayName: "fixture", scheduledAtTick: 0, serviceDurationTicks: 120, durationTicks: 120, dueTick: 120, deliveredAtTick: null, offsiteReturnStartedAtTick: null, offsiteTravel: null, patientTravel: null, resourceReservations: [{ roomDefinitionId: "room.endoscopy", staffRoleDefinitionId: "staff.endoscopy_nurse" }, { roomDefinitionId: "room.periop_recovery", staffRoleDefinitionId: "staff.periop_nurse" }], providerReservation: { kind: "employee", employeeId: "employee.test.endoscopist", staffRoleDefinitionId: "staff.endoscopist" }, timingPhases: [{ id: "prep", durationTicks: 30, resourceBound: true, startsAtTick: 0, endsAtTick: 30 }, { id: "procedure", durationTicks: 45, resourceBound: true, startsAtTick: 30, endsAtTick: 75 }, { id: "recovery", durationTicks: 45, resourceBound: true, startsAtTick: 75, endsAtTick: 120 }] },
  } as unknown as GameState["encounters"][string];
  return state;
}

describe("Level 2 persistence", () => {
  it("does not inject the creation-only starter Examination Room into existing saves", () => {
    const state = createInitialGameState(undefined, {
      campaignId: "campaign.no-starter-save",
      campaignSeed: "no-starter-save",
      createdAtRealMs: 0,
    });
    state.rooms = state.rooms.filter(
      (room) => room.id !== "room.instance.starter_examination",
    );
    state.doors = state.doors.filter(
      (door) => door.roomId !== "room.instance.starter_examination",
    );
    const expectedRoomIds = state.rooms.map((room) => room.id);
    const expectedDoorIds = state.doors.map((door) => door.id);

    for (const schemaVersion of [8, 7, 6]) {
      const serialized = JSON.parse(serializeGameState(state)) as Record<string, unknown>;
      serialized.schemaVersion = schemaVersion;
      const restored = deserializeGameState(JSON.stringify(serialized));
      expect(restored.rooms.map((room) => room.id)).toEqual(expectedRoomIds);
      expect(restored.doors.map((door) => door.id)).toEqual(expectedDoorIds);
      expect(restored.rooms.some((room) => room.id === "room.instance.starter_examination")).toBe(false);
      expect(restored.doors.some((door) => door.id === "door.instance.starter_examination")).toBe(false);
      expect(restored.rooms.some((room) => room.id === "room.instance.founder_desk")).toBe(true);
      expect(restored.doors.some((door) => door.id === "door.instance.front_entrance")).toBe(true);
    }
  });

  it("round-trips waiting reservations and automatic exam attendance, while legacy absence normalizes safely", () => {
    const state = createInitialGameState(undefined, { campaignId: "campaign.waiting-reservations", campaignSeed: "waiting-reservations", createdAtRealMs: 0 });
    const encounter = Object.values(state.encounters)[0]!;
    encounter.checkInStatus = "checked_in";
    encounter.waitingDestination = { roomInstanceId: "room.instance.founder_desk", location: { x: 37, y: 31 }, kind: "chair" };
    state.environment.founderActivity = { kind: "attend_encounter", targetId: encounter.id, path: [{ ...state.environment.founderLocation }, { x: 37, y: 31 }], pathIndex: 0, lastMovedAtFacilityTick: 0, workMinutesRemaining: 4 };
    for (const kind of ["chair", "standing", "public_wander"] as const) {
      encounter.waitingDestination = { roomInstanceId: "room.instance.founder_desk", location: { x: 37, y: 31 }, kind };
      const restored = deserializeGameState(serializeGameState(state));
      expect(restored.encounters[encounter.id]!.waitingDestination).toEqual(encounter.waitingDestination);
      expect(restored.environment.founderActivity).toEqual(state.environment.founderActivity);
    }
    const legacy = JSON.parse(serializeGameState(state)) as Record<string, unknown>;
    legacy.schemaVersion = 6;
    delete (legacy.encounters as Record<string, Record<string, unknown>>)[encounter.id]!.waitingDestination;
    expect(deserializeGameState(JSON.stringify(legacy)).encounters[encounter.id]!.waitingDestination).toBeNull();
  });

  it("retains an active endoscopy reservation and GLP-1 schedule across save/load and ticks", () => {
    const fixture = levelTwoPersistenceFixture();
    const legacy = JSON.parse(serializeGameState(fixture)) as Record<string, unknown>;
    legacy.schemaVersion = 7;
    delete legacy.approvedRoomGeometryMigration;
    delete legacy.approvedRoomNavigationMigration;
    let restored = deserializeGameState(JSON.stringify(legacy));
    expect(getFacilityAccessValidation(restored)).toMatchObject({ valid: true, unreachableRoomIds: [] });
    expect(getOperationalGlp1AutomationCapacity(restored)).toBe(1);
    expect(restored.facilityLevel).toBe(2);
    expect(restored.encounters["encounter.test.endoscopy"]?.pendingResult).toMatchObject({
      providerReservation: { kind: "employee", employeeId: "employee.test.endoscopist", staffRoleDefinitionId: "staff.endoscopist" },
      resourceReservations: [
        { roomDefinitionId: "room.endoscopy", staffRoleDefinitionId: "staff.endoscopy_nurse" },
        { roomDefinitionId: "room.periop_recovery", staffRoleDefinitionId: "staff.periop_nurse" },
      ],
    });
    expect(restored.environment.glp1AutomationNextPayoutTicks).toEqual([60]);
    const cashBeforePayout = restored.cash;
    for (let tick = 1; tick <= 60; tick += 1) restored = gameReducer(restored, { type: "ADVANCE_TICK", operationId: `persist.tick.${tick}` });
    expect(restored.facilityLevel).toBe(2);
    expect(restored.encounters["encounter.test.endoscopy"]?.pendingResult?.providerReservation).toEqual({ kind: "employee", employeeId: "employee.test.endoscopist", staffRoleDefinitionId: "staff.endoscopist" });
    expect(restored.environment.glp1AutomationConsultationsCompleted).toBe(1);
    expect(restored.cash).toBe(cashBeforePayout + 50);
    expect(restored.serviceIncomeReceipts).toHaveLength(1);
    expect(restored.environment.glp1AutomationNextPayoutTicks).toEqual([120]);
  });
});
