import { describe, expect, it } from "vitest";
import { deserializeGameState, gameReducer, getOperatingExpensePerFacilityHour,
  serializeGameState, type GameState, type PlacedRoom } from "../src";
import { normalizeRoomUpkeepOutage, synchronizeRoomUpkeepOutages } from "../src/room-upkeep-outages";
import { timingFixture } from "./diagnostic-timing-fixtures";

function fixture(staffed = false) {
  const result = timingFixture();
  result.state.encounters = {};
  result.state.paused = false;
  result.state.cash = 10000;
  result.state.cashCents = 1000000;
  result.state.serviceAppointmentsEnabled = false;
  result.state.nextRoutineArrivalTick = result.state.nextFinancialPostingTick =
    result.state.nextExternalRetailOpportunityTick = result.state.nextEmployeeDiscussionTick = Number.MAX_SAFE_INTEGER;
  result.state.environment.nextLitterSpawnTick = result.state.environment.nextWaterCoolerDrainTick = Number.MAX_SAFE_INTEGER;
  result.state.retailNextOpportunityTicks["founder:founder"] = Number.MAX_SAFE_INTEGER;
  const { room } = result.addRoom("room.ultrasound", staffed ? "staff.imaging_technician" : undefined);
  synchronizeRoomUpkeepOutages(result.state, result.context);
  return { ...result, room };
}
let sequence = 0;
function tick(state: GameState, context: ReturnType<typeof fixture>["context"], minutes: number): GameState {
  for (let index = 0; index < minutes; index++) state = gameReducer(state,
    { type: "ADVANCE_TICK", operationId: `rent.tick.${sequence++}` }, context);
  return state;
}
const outageRoom = (state: GameState, id: string) => state.rooms.find((room) => room.id === id)!;

describe("technical idle-room upkeep relief", () => {
  it("charges 60 full minutes then only 20% of base, without charging upgraded rent", () => {
    const f = fixture();
    f.room.upgradeLevel = 5;
    f.state.nextFinancialPostingTick = 15;
    // Front Desk + exam = $3/h; upgraded ultrasound = $12/h.
    let state = tick(f.state, f.context, 59);
    expect(-getOperatingExpensePerFacilityHour(state, f.context)).toBe(15);
    state = tick(state, f.context, 1);
    expect(state.totalOperatingExpenses).toBe(15);
    expect(-getOperatingExpensePerFacilityHour(state, f.context)).toBe(4.6);
    state = tick(state, f.context, 15);
    expect(state.totalOperatingExpenses).toBe(16.15);
    expect(state.cashCents).toBe(998385);
    expect(Number.isSafeInteger(state.operatingAccrualSixtiethCents)).toBe(true);
  });
  it("preserves the observed clock and integer fractional accrual across reload and speed changes", () => {
    const f = fixture();
    let state = tick(f.state, f.context, 40);
    const savedClock = outageRoom(state, f.room.id).upkeepOutage;
    state = deserializeGameState(serializeGameState(state), f.context);
    expect(outageRoom(state, f.room.id).upkeepOutage).toEqual(savedClock);
    state = gameReducer(state, { type: "SET_SIMULATION_SPEED", operationId: "rent.speed", speed: 4 }, f.context);
    state = tick(state, f.context, 35);
    const uninterrupted = tick(f.state, f.context, 75);
    expect(state.operatingAccrualSixtiethCents).toBe(uninterrupted.operatingAccrualSixtiethCents);
    expect(state.operatingAccrualSixtiethCents).toBe(72900);
    expect(deserializeGameState(serializeGameState(state), f.context).operatingAccrualSixtiethCents).toBe(72900);
  });
  it("starts legacy outage clocks at load and leaves old financial accrual untouched", () => {
    const f = fixture();
    f.state.facilityTick = 900;
    delete f.room.upkeepOutage;
    f.state.operatingAccrualSixtiethCents = 12345;
    const loaded = deserializeGameState(serializeGameState(f.state), f.context);
    expect(outageRoom(loaded, f.room.id).upkeepOutage).toMatchObject({ sinceFacilityTick: 900, lastObservedFacilityTick: 900 });
    expect(loaded.operatingAccrualSixtiethCents).toBe(12345);
    expect(-getOperatingExpensePerFacilityHour(loaded, f.context)).toBe(11);
  });
  it("stops relief immediately when a paused door command restores service and resets a later outage", () => {
    const f = fixture(true);
    f.state.doors = f.state.doors.filter((door) => door.roomId !== f.room.id);
    synchronizeRoomUpkeepOutages(f.state, f.context);
    let state = tick(f.state, f.context, 60);
    state = gameReducer(state, { type: "SET_PAUSED", operationId: "rent.pause", paused: true }, f.context);
    state = gameReducer(state, { type: "PLACE_DOOR", operationId: "rent.reconnect", roomId: f.room.id,
      doorId: "door.rent.restored", side: "west", offset: 1, exterior: false }, f.context);
    expect(state.operationReceipts["rent.reconnect"]?.status).toBe("applied");
    expect(outageRoom(state, f.room.id).upkeepOutage).toBeUndefined();
    expect(-getOperatingExpensePerFacilityHour(state, f.context)).toBe(37);
    state = gameReducer(state, { type: "FIRE_EMPLOYEE", operationId: "rent.dismiss",
      employeeId: state.employees[0]!.id }, f.context);
    expect(state.operationReceipts["rent.dismiss"]?.status).toBe("applied");
    expect(outageRoom(state, f.room.id).upkeepOutage).toMatchObject({ sinceFacilityTick: 60 });
    state = tick(state, f.context, 30);
    expect(state.facilityTick).toBe(60);
    expect(outageRoom(state, f.room.id).upkeepOutage?.sinceFacilityTick).toBe(60);
  });
  it("restores full rent after a required employee is assigned, without waiving payroll", () => {
    const f = fixture(true);
    f.state.employees[0]!.homeRoomInstanceId = null;
    synchronizeRoomUpkeepOutages(f.state, f.context);
    f.state.facilityTick = 60;
    f.room.upkeepOutage!.lastObservedFacilityTick = 60;
    expect(-getOperatingExpensePerFacilityHour(f.state, f.context)).toBe(30.6);
    f.state.employees[0]!.homeRoomInstanceId = f.room.id;
    synchronizeRoomUpkeepOutages(f.state, f.context);
    expect(f.room.upkeepOutage).toBeUndefined();
    expect(-getOperatingExpensePerFacilityHour(f.state, f.context)).toBe(37);
  });
  it("counts maintenance outages, excludes due equipment and ends the clock after repair", () => {
    const f = fixture(true);
    f.room.maintenance = { status: "due", completedUses: 1, dueAtFacilityTick: 0,
      outOfServiceAtFacilityTick: 200, appliedUseKeys: [] };
    synchronizeRoomUpkeepOutages(f.state, f.context);
    expect(f.room.upkeepOutage).toBeUndefined();
    f.room.maintenance.status = "out_of_service";
    synchronizeRoomUpkeepOutages(f.state, f.context);
    expect(f.room.upkeepOutage?.sinceFacilityTick).toBe(0);
    f.room.maintenance.status = "operational";
    synchronizeRoomUpkeepOutages(f.state, f.context);
    expect(f.room.upkeepOutage).toBeUndefined();
  });
  it("observes repair-held equipment and an expired maintenance deadline without treating clinical work as repair", () => {
    const f = fixture(true);
    const employee = f.state.employees[0]!;
    employee.facilityTask = { kind: "repair_room", targetId: f.room.id, startedAtFacilityTick: 0, workMinutesRemaining: 100 };
    synchronizeRoomUpkeepOutages(f.state, f.context);
    expect(f.room.upkeepOutage?.sinceFacilityTick).toBe(0);
    employee.facilityTask = null;
    synchronizeRoomUpkeepOutages(f.state, f.context);
    expect(f.room.upkeepOutage).toBeUndefined();
    f.room.maintenance = { status: "due", completedUses: 1, dueAtFacilityTick: 0,
      outOfServiceAtFacilityTick: 0, appliedUseKeys: [] };
    synchronizeRoomUpkeepOutages(f.state, f.context);
    expect(f.room.upkeepOutage?.sinceFacilityTick).toBe(0);
  });
  it("ignores no patients, disabled appointments, temporary work/walks/breaks and paid training", () => {
    const f = fixture(true);
    const employee = f.state.employees[0]!;
    employee.location = { x: 7, y: 4 };
    for (const kind of ["perform_imaging", "perform_service", "periop_attention", "take_break"] as const) {
      employee.facilityTask = { kind, targetId: "temporary.work", startedAtFacilityTick: 0, workMinutesRemaining: 300 };
      synchronizeRoomUpkeepOutages(f.state, f.context);
      expect(f.room.upkeepOutage).toBeUndefined();
    }
    employee.training = { version: 1, requestSequence: 0, requestedAtFacilityTick: 0,
      earliestDepartureAtFacilityTick: 0, paidAmount: 75, targetLevel: 2, stage: "training",
      roomInstanceId: null, placeId: null, remainingMinutes: 60, startedAtFacilityTick: 0,
      completedAtFacilityTick: null, lastProgressAtFacilityTick: 0 };
    synchronizeRoomUpkeepOutages(f.state, f.context);
    expect(f.room.upkeepOutage).toBeUndefined();
  });
  it("allows cross-covered imaging assignments and the founder procedural provider fallback", () => {
    const f = fixture(true);
    const xray = f.addRoom("room.xray").room;
    const endoscopy = f.addRoom("room.endoscopy", "staff.endoscopy_nurse").room;
    const recovery = f.addRoom("room.periop_recovery", "staff.periop_nurse").room;
    synchronizeRoomUpkeepOutages(f.state, f.context);
    expect(xray.upkeepOutage).toBeUndefined();
    expect(endoscopy.upkeepOutage).toBeUndefined();
    // Recovery is temporary bed work, regardless of occupied capacity.
    f.state.employees.find((employee) => employee.staffRoleDefinitionId === "staff.periop_nurse")!.facilityTask =
      { kind: "periop_attention", targetId: "active.recovery", startedAtFacilityTick: 0, workMinutesRemaining: 200 };
    synchronizeRoomUpkeepOutages(f.state, f.context);
    expect(endoscopy.upkeepOutage).toBeUndefined();
    f.state.doors = f.state.doors.filter((door) => door.roomId !== recovery.id);
    synchronizeRoomUpkeepOutages(f.state, f.context);
    expect(endoscopy.upkeepOutage?.sinceFacilityTick).toBe(0);
    expect(recovery.upkeepOutage).toBeUndefined();
  });
  it.each(["room.pharmacy", "room.glp1_telehealth_suite", "room.reading"])("requires a local installed assignment for %s", (roomId) => {
    const f = fixture();
    const role = roomId === "room.pharmacy" ? "staff.pharmacist" : roomId === "room.reading" ? "staff.radiologist" : "staff.glp1_np";
    f.addRoom(roomId, role);
    const second = f.addRoom(roomId).room;
    second.id += ".second";
    f.state.doors.at(-1)!.roomId = second.id;
    synchronizeRoomUpkeepOutages(f.state, f.context);
    expect(second.upkeepOutage?.sinceFacilityTick).toBe(0);
  });
  it.each(["room.examination", "room.minor_procedure", "room.coffee_kiosk", "room.vending"])("relieves an inaccessible revenue room %s", (roomId) => {
    const f = fixture();
    const room = roomId === "room.examination" ? f.state.rooms.find((candidate) => candidate.roomDefinitionId === roomId)! : f.addRoom(roomId).room;
    f.state.doors = f.state.doors.filter((door) => door.roomId !== room.id);
    synchronizeRoomUpkeepOutages(f.state, f.context);
    expect(room.upkeepOutage?.sinceFacilityTick).toBe(0);
  });
  it.each([
    { version: "room-upkeep-outage.v1", sinceFacilityTick: -1, lastObservedFacilityTick: 100 },
    { version: "room-upkeep-outage.v1", sinceFacilityTick: 101, lastObservedFacilityTick: 100 },
    { version: "room-upkeep-outage.v1", sinceFacilityTick: 0, lastObservedFacilityTick: 99 },
    { version: "room-upkeep-outage.v1", sinceFacilityTick: 0.5, lastObservedFacilityTick: 100 },
    { version: "unknown.v2", sinceFacilityTick: 0, lastObservedFacilityTick: 100 },
  ])("discards an invalid or unobserved saved outage clock", (clock) => {
    expect(normalizeRoomUpkeepOutage(clock, 100)).toBeUndefined();
    const f = fixture();
    f.state.facilityTick = 100;
    f.room.upkeepOutage = clock as PlacedRoom["upkeepOutage"];
    const loaded = deserializeGameState(serializeGameState(f.state), f.context);
    expect(outageRoom(loaded, f.room.id).upkeepOutage?.sinceFacilityTick).toBe(100);
  });
  it("drops stale clocks from support rooms and does not copy downtime to replacement room IDs", () => {
    const f = fixture();
    f.state.rooms[0]!.upkeepOutage = { version: "room-upkeep-outage.v1", sinceFacilityTick: 0, lastObservedFacilityTick: 0 };
    synchronizeRoomUpkeepOutages(f.state, f.context);
    expect(f.state.rooms[0]!.upkeepOutage).toBeUndefined();
    const oldRoom = f.room;
    f.state.facilityTick = 200;
    f.state.rooms = f.state.rooms.filter((room) => room.id !== oldRoom.id);
    const replacement: PlacedRoom = { ...oldRoom, id: "replacement.ultrasound", upkeepOutage: undefined };
    f.state.rooms.push(replacement);
    synchronizeRoomUpkeepOutages(f.state, f.context);
    expect(replacement.upkeepOutage?.sinceFacilityTick).toBe(200);
  });
});
