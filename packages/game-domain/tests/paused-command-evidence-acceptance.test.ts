import { describe, expect, it } from "vitest";
import {
  advanceExecutiveManagement, applyGameEvidenceCommand, createGameEvidenceCheckpoint, createInitialGameState,
  gameEvidenceDelta, gameReducer, getExecutiveDeskLocation, getRoomSalePreview, importGameEvidence,
  PROTOTYPE_DOMAIN_CONTEXT as context, TUTORIAL_ENCOUNTER_ID, type GameState,
} from "../src";
import {
  apronHall, bridgeHall, buildFixture, examDoor, examRoom, frontDoor, hallwaySaleClinic, pausedClinic,
  type FixtureCommand,
} from "./paused-command-outage-fixtures";

const recovery = "public.outage.recovery";
const endoscopy = "public.outage.endoscopy";
const periopNurse = "public.outage.periop-nurse";
const rotate = { type: "ROTATE_ROOM", roomId: examRoom } as const;
const removeDoor = { type: "REMOVE_DOOR", doorId: examDoor } as const;
const placeDoor = { type: "PLACE_DOOR", doorId: examDoor, roomId: examRoom, side: "south", offset: 1 } as const;
const sellHallway = { type: "SELL_ROOM", roomId: bridgeHall } as const;
const fire = { type: "FIRE_EMPLOYEE", employeeId: periopNurse } as const;
const move = (x: number) => ({ type: "MOVE_ROOM", roomId: bridgeHall, x, y: 27 } as const);
const remodel = (x: number): FixtureCommand => ({ type: "APPLY_REMODEL_PLAN", rooms: [
  { roomId: bridgeHall, x, y: 27, orientation: 0 },
  { roomId: apronHall, x, y: 26, orientation: 0 },
] });
const placeHall = (x: number): FixtureCommand => ({
  type: "PLACE_ROOM", roomId: `public.outage.hall.${x}`, roomDefinitionId: "room.hallway", x, y: 26, orientation: 0,
});

function surgicalClinic() {
  return buildFixture(hallwaySaleClinic(2), ...[33, 34, 36, 37].map(placeHall),
    { type: "PLACE_ROOM", roomId: endoscopy, roomDefinitionId: "room.endoscopy", x: 30, y: 23, orientation: 0 },
    { type: "PLACE_ROOM", roomId: recovery, roomDefinitionId: "room.periop_recovery", x: 37, y: 20, orientation: 0 },
    { type: "PLACE_DOOR", doorId: "public.outage.scope-door", roomId: endoscopy, side: "south", offset: 3 },
    { type: "PLACE_DOOR", doorId: "public.outage.recovery-door", roomId: recovery, side: "south", offset: 0 },
    { type: "HIRE_STAFF", employeeId: "public.outage.scope-nurse", staffRoleDefinitionId: "staff.endoscopy_nurse" },
    { type: "HIRE_STAFF", employeeId: periopNurse, staffRoleDefinitionId: "staff.periop_nurse" },
  );
}

function rotationClinic() {
  return buildFixture(pausedClinic(),
    { type: "PLACE_ROOM", roomId: bridgeHall, roomDefinitionId: "room.hallway", x: 35, y: 27, orientation: 0 },
    { type: "PLACE_ROOM", roomId: apronHall, roomDefinitionId: "room.hallway", x: 35, y: 26, orientation: 0 },
    { type: "PLACE_ROOM", roomId: examRoom, roomDefinitionId: "room.examination", x: 32, y: 25, orientation: 0 },
    { type: "PLACE_DOOR", doorId: frontDoor, roomId: "room.instance.founder_desk", side: "north", offset: 2 },
    { type: "PLACE_DOOR", doorId: examDoor, roomId: examRoom, side: "east", offset: 1 },
  );
}

const clocks = (state: GameState) => state.rooms.map(room =>
  [room.id, Object.hasOwn(room, "upkeepOutage"), room.upkeepOutage]);
const readSyncedState = (state: GameState) => ({
  clocks: clocks(state),
  occurrences: state.environment.facilityConditionOccurrences,
  occurrenceSequence: state.environment.facilityConditionOccurrenceSequence,
  alertCadence: state.alertHumor,
  management: state.levelFive?.management,
  staff: state.employees,
});

function verifyEvidence(
  state: GameState, input: FixtureCommand, assertEffect: (next: GameState) => void,
): void {
  expect(state.paused).toBe(true);
  const command = { ...input, operationId: "public.outage.action" };
  const expected = gameReducer(structuredClone(state), command, context);
  const receipt = expected.operationReceipts[command.operationId];
  expect(receipt?.status, receipt?.message).toBe("applied");
  assertEffect(expected);

  const checkpoint = createGameEvidenceCheckpoint(state);
  const previous = structuredClone(readSyncedState(importGameEvidence(checkpoint.snapshot, checkpoint.evidence)));
  const applied = applyGameEvidenceCommand(checkpoint, command, context);
  expect(applied.replayed).toBe(false);
  expect(applied.state.operationReceipts[command.operationId]).toStrictEqual(receipt);
  expect(applied.state.facilityTick).toBe(state.facilityTick);
  expect(applied.state.paused).toBe(true);
  assertEffect(applied.state);
  expect(readSyncedState(applied.state)).toStrictEqual(readSyncedState(expected));
  expect(applied.checkpoint.snapshot.head.sequence).toBe(checkpoint.snapshot.head.sequence + 1);
  expect(gameEvidenceDelta(checkpoint, applied.checkpoint)).toBeDefined();
  const restored = importGameEvidence(applied.checkpoint.snapshot, applied.checkpoint.evidence);
  expect(restored.operationReceipts[command.operationId]).toStrictEqual(receipt);
  expect(readSyncedState(restored)).toStrictEqual(readSyncedState(expected));
  expect(readSyncedState(importGameEvidence(checkpoint.snapshot, checkpoint.evidence))).toStrictEqual(previous);
}

const outage = (state: GameState, roomId: string) => state.rooms.find(room => room.id === roomId)!.upkeepOutage;
function verifyOutage(state: GameState, command: FixtureCommand, roomId: string, starts: boolean) {
  if (starts) expect(outage(state, roomId)).toBeUndefined();
  else expect(outage(state, roomId)?.lastObservedFacilityTick).toBe(state.facilityTick);
  verifyEvidence(state, command, next => {
    const room = next.rooms.find(room => room.id === roomId)!;
    if (starts) expect(room.upkeepOutage).toStrictEqual({
      version: "room-upkeep-outage.v1", sinceFacilityTick: state.facilityTick, lastObservedFacilityTick: state.facilityTick,
    });
    else expect(Object.hasOwn(room, "upkeepOutage")).toBe(false);
  });
}

describe("B-018 paused Build and staff commands through the evidence boundary", () => {
  it("starts the outage when selling a hallway cuts access to an Examination Room", () => {
    verifyOutage(hallwaySaleClinic(), sellHallway, examRoom, true);
  });

  it("starts the outage when a confirmed support room sale removes recovery and its required nurse", () => {
    const state = surgicalClinic();
    const preview = getRoomSalePreview(state, recovery, context)!;
    expect(preview.dismissedEmployees.map(employee => employee.id)).toEqual([periopNurse]);
    verifyOutage(state, { type: "SELL_ROOM", roomId: recovery, saleConfirmationToken: preview.confirmationToken }, endoscopy, true);
  });

  it("starts the outage when firing required staff", () => {
    verifyOutage(surgicalClinic(), fire, endoscopy, true);
  });

  it("clears the outage when hiring restores the required staff", () => {
    verifyOutage(buildFixture(surgicalClinic(), fire), {
      type: "HIRE_STAFF", employeeId: "public.outage.replacement-nurse", staffRoleDefinitionId: "staff.periop_nurse",
    }, endoscopy, false);
  });

  const accessEdits = [
    ["MOVE_ROOM", move(30), move(35)],
    ["APPLY_REMODEL_PLAN", remodel(30), remodel(35)],
    ["REMOVE_DOOR and PLACE_DOOR", removeDoor, placeDoor],
  ] as const;
  it.each(accessEdits)("starts the outage through %s", (_label, disconnect) => {
    verifyOutage(hallwaySaleClinic(), disconnect, examRoom, true);
  });
  it.each(accessEdits)("clears the outage through %s", (_label, disconnect, reconnect) => {
    verifyOutage(buildFixture(hallwaySaleClinic(), disconnect), reconnect, examRoom, false);
  });

  it.each([examRoom, apronHall])("removes a legacy stale clock from a surviving room on sale (%s)", roomId => {
    const state = buildFixture(hallwaySaleClinic(), placeHall(34));
    state.rooms.find(room => room.id === roomId)!.upkeepOutage = {
      version: "room-upkeep-outage.v1", sinceFacilityTick: state.facilityTick - 5, lastObservedFacilityTick: state.facilityTick,
    };
    verifyOutage(state, { type: "SELL_ROOM", roomId: "public.outage.hall.34" }, roomId, false);
  });

  it("starts the outage when a room rotates away from its connection", () => {
    const state = buildFixture(rotationClinic(), rotate); // 90° still connects to the Front Desk.
    verifyOutage(state, rotate, examRoom, true);
  });

  it("clears the outage when a room rotates back to its connection", () => {
    verifyOutage(buildFixture(rotationClinic(), rotate, rotate, rotate), rotate, examRoom, false);
  });

  it("resolves an existing facility-experience occurrence on paused door restoration", () => {
    let state = buildFixture(hallwaySaleClinic(), removeDoor);
    const patient = createInitialGameState().encounters[TUTORIAL_ENCOUNTER_ID]!;
    // A checked-in waiting actor makes the missing examination condition relevant.
    state.encounters = { [patient.id]: { ...patient, patientMovement: null, patientLocation: state.environment.founderLocation } };
    state.alertHumor.conditionLastEmittedTicks["complaint.missing_waiting_room"] = state.facilityTick;
    state = buildFixture(state, { type: "SET_SIMULATION_SPEED", speed: 2 });
    const row = state.environment.facilityConditionOccurrences.find(entry => entry.conditionKey === "missing_examination_room");
    expect(row?.resolvedAtFacilityTick).toBeNull();
    verifyEvidence(state, placeDoor, next => {
      expect(next.environment.facilityConditionOccurrences.find(entry => entry.id === row!.id)?.resolvedAtFacilityTick)
        .toBe(state.facilityTick);
      expect(outage(next, examRoom)).toBeUndefined();
    });
  });

  it("resolves an existing operational low-cash occurrence when the hallway refund crosses the threshold", () => {
    let state = buildFixture(hallwaySaleClinic(), placeHall(34));
    state.cash = context.balanceRelease.emergencyGlp1.lowCashAlertThreshold - 1;
    state.cashCents = state.cash * 100;
    state = buildFixture(state, { type: "SET_SIMULATION_SPEED", speed: 2 });
    const row = state.environment.facilityConditionOccurrences.find(entry => entry.conditionKey === "low_cash");
    expect(row?.resolvedAtFacilityTick).toBeNull();
    verifyEvidence(state, { type: "SELL_ROOM", roomId: "public.outage.hall.34" }, next => {
      expect(next.environment.facilityConditionOccurrences.find(entry => entry.id === row!.id)?.resolvedAtFacilityTick)
        .toBe(state.facilityTick);
      expect(outage(next, examRoom)).toBeUndefined();
    });
  });

  it("cancels the Executive's existing round and releases its reserved contact on firing", () => {
    const office = "public.outage.office", employeeId = "public.outage.executive";
    const state = buildFixture(hallwaySaleClinic(5), ...[33, 34].map(placeHall),
      { type: "PLACE_ROOM", roomId: office, roomDefinitionId: "room.executive_office", x: 31, y: 24, orientation: 0 },
      { type: "PLACE_DOOR", roomId: office, doorId: "public.outage.office-door", side: "south", offset: 2 },
      { type: "HIRE_STAFF", employeeId, staffRoleDefinitionId: "staff.executive" },
    );
    const executive = state.employees.find(employee => employee.id === employeeId)!;
    const desk = getExecutiveDeskLocation(state, executive)!;
    Object.assign(executive, { location: desk, path: [desk], pathIndex: 0 });
    advanceExecutiveManagement(state, context);
    expect(state.levelFive?.management.round).toMatchObject({
      status: "walking_to_office", reservedContactId: "executiveChair",
    });
    verifyEvidence(state, { type: "FIRE_EMPLOYEE", employeeId }, next => {
      expect(next.levelFive?.management.round).toMatchObject({ status: "cancelled", reservedContactId: null });
    });
  });
});
