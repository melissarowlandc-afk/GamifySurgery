import { describe, expect, it } from "vitest";
import {
  createInitialGameState,
  deserializeGameState,
  gameReducer,
  getEmergencyGlp1Status,
  getFacilityAccessValidation,
  getCurrentCapabilities,
  isEmployeeAssignedToOperationalRoom,
  getWorkloadSnapshot,
  serializeGameState,
  type GameState,
} from "../src";

let operation = 0;

function advance(state: GameState, minutes: number): GameState {
  let next = state;
  for (let index = 0; index < minutes; index += 1) {
    next = gameReducer(next, { type: "ADVANCE_TICK", operationId: `support.tick.${operation++}` });
  }
  return next;
}

function supportState(): GameState {
  const state = createInitialGameState(undefined, {
    campaignId: "campaign.local.level-two-support",
    campaignSeed: "level-two-support",
    createdAtRealMs: 0,
  });
  state.facilityLevel = 2;
  state.cash = 10_000;
  state.cashCents = 1_000_000;
  state.encounters = {};
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  state.nextFinancialPostingTick = Number.MAX_SAFE_INTEGER;
  state.environment.nextLitterSpawnTick = Number.MAX_SAFE_INTEGER;
  state.environment.nextWaterCoolerDrainTick = Number.MAX_SAFE_INTEGER;
  for (let y = 20; y <= 31; y += 1) {
    state.rooms.push({ id: `room.hall.${y}`, roomDefinitionId: "room.hallway", x: 32, y, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 });
  }
  state.rooms.push(
    { id: "room.hall.evs.20", roomDefinitionId: "room.hallway", x: 31, y: 20, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
    { id: "room.hall.evs.21", roomDefinitionId: "room.hallway", x: 31, y: 21, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
  );
  state.doors.push({ id: "door.front.internal", roomId: "room.instance.founder_desk", side: "west", offset: 0, exterior: false });
  const addRoom = (id: string, definitionId: string, x: number, y: number) => {
    state.rooms.push({ id, roomDefinitionId: definitionId, x, y, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 });
    state.doors.push({ id: `door.${id}`, roomId: id, side: "east", offset: 1, exterior: false });
  };
  addRoom("room.evs", "room.evs_closet", 29, 20);
  addRoom("room.glp.one", "room.glp1_telehealth_suite", 29, 22);
  addRoom("room.glp.two", "room.glp1_telehealth_suite", 29, 24);
  addRoom("room.training", "room.training", 29, 26);
  addRoom("room.coffee", "room.coffee_kiosk", 30, 29);
  const addEmployee = (id: string, role: string, homeRoomInstanceId: string, location: { x: number; y: number }) => state.employees.push({
    id, staffRoleDefinitionId: role, displayName: id, appearance: state.founder.appearance,
    hiredAtFacilityTick: 0, salaryPerExpenseInterval: 0, morale: 50, trainingLevel: 1,
    homeRoomInstanceId, location, path: [location], pathIndex: 0, lastMovedAtFacilityTick: 0,
    lastPraisedAtFacilityTick: null, nextIdleActionAtFacilityTick: Number.MAX_SAFE_INTEGER, facilityTask: null,
  });
  addEmployee("employee.evs", "staff.evs_worker", "room.evs", { x: 30, y: 21 });
  addEmployee("employee.glp.one", "staff.glp1_np", "room.glp.one", { x: 31, y: 23 });
  addEmployee("employee.glp.two", "staff.glp1_np", "room.glp.two", { x: 31, y: 25 });
  return state;
}

describe("Level 2 nonclinical support operations", () => {
  it("automates only staffed GLP-1 suites on independent full-hour schedules", () => {
    let state = supportState();
    expect(getFacilityAccessValidation(state).unreachableRoomIds).toEqual([]);
    state.employees = [];
    expect(getEmergencyGlp1Status(state).eligible).toBe(true);
    state = advance(state, 60);
    expect(state.environment.glp1AutomationConsultationsCompleted).toBe(0);
    state.employees.push({ ...supportState().employees[1]!, id: "employee.glp.one" });
    state = advance(state, 60);
    expect(state.environment.glp1AutomationConsultationsCompleted).toBe(1);
    const cashAfterOne = state.cash;
    state.employees.push({ ...supportState().employees[2]!, id: "employee.glp.two" });
    state = advance(state, 59);
    expect(state.environment.glp1AutomationConsultationsCompleted).toBe(1);
    state = advance(state, 1);
    expect(state.environment.glp1AutomationConsultationsCompleted).toBe(3);
    expect(state.cash).toBe(cashAfterOne + 50);
    expect(getEmergencyGlp1Status(state).eligible).toBe(false);
    const learning = JSON.stringify(state.learningHistories);
    state.paused = true;
    state = advance(state, 120);
    expect(state.environment.glp1AutomationConsultationsCompleted).toBe(3);
    state.paused = false;
    const restored = deserializeGameState(serializeGameState(state));
    expect(restored.environment.glp1AutomationConsultationsCompleted).toBe(3);
    expect(JSON.stringify(restored.learningHistories)).toBe(learning);
  });

  it("routes EVS to oldest litter, reserves targets, completes physically, and recovers missing targets", () => {
    let state = supportState();
    expect(getCurrentCapabilities(state)).toContain("capability.staff.evs_worker");
    state.employees = state.employees.filter((employee) => employee.id === "employee.evs");
    state.environment.litterItems = [
      { id: "litter.old", roomId: "room.glp.one", location: { x: 30, y: 23 }, spawnedAtFacilityTick: 1 },
      { id: "litter.new", roomId: "room.glp.two", location: { x: 32, y: 25 }, spawnedAtFacilityTick: 2 },
    ];
    state = advance(state, 1);
    expect(state.employees[0]!.facilityTask).toMatchObject({ kind: "collect_litter", targetId: "litter.old" });
    const savedInProgress = deserializeGameState(serializeGameState(state));
    expect(savedInProgress.employees[0]!.facilityTask).toMatchObject({ targetId: "litter.old" });
    expect(state.employees[0]!.location).not.toEqual({ x: 30, y: 23 });
    state.environment.litterItems = state.environment.litterItems.filter((item) => item.id !== "litter.old");
    state = advance(state, 20);
    expect(state.employees[0]!.facilityTask).toBeNull();
    expect(isEmployeeAssignedToOperationalRoom(state, "employee.evs")).toBe(true);
  });

  it("falls back to the dirtiest reachable room and observes its cleanup cooldown", () => {
    let state = supportState();
    state.employees = state.employees.filter((employee) => employee.id === "employee.evs");
    state.environment.litterItems = [];
    state.rooms.find((room) => room.id === "room.glp.one")!.cleanliness = 80;
    state.rooms.find((room) => room.id === "room.glp.two")!.cleanliness = 70;
    state = advance(state, 1);
    expect(state.employees[0]!.facilityTask).toMatchObject({ kind: "clean_room", targetId: "room.glp.two" });
    state = advance(state, 30);
    expect(state.environment.lastEvsRoomCleanupAtTick).not.toBeNull();
    state.employees[0]!.location = { x: 30, y: 21 };
    state.employees[0]!.path = [{ x: 30, y: 21 }];
    state.employees[0]!.pathIndex = 0;
    state.rooms.find((room) => room.id === "room.glp.one")!.cleanliness = 60;
    state = advance(state, 1);
    expect(state.employees[0]!.facilityTask).toBeNull();
  });

  it("uses Training only when operational and Coffee at most once per reachable facility day", () => {
    let state = supportState();
    expect(getCurrentCapabilities(state)).toContain("capability.staff_training");
    expect(getCurrentCapabilities(state)).toContain("capability.coffee_kiosk");
    const base = getWorkloadSnapshot(state).routineLimit;
    state.rooms = state.rooms.filter((room) => room.id !== "room.training");
    expect(getWorkloadSnapshot(state).routineLimit).toBe(base - 1);
    state = supportState();
    const before = state.employees[0]!.morale;
    state = advance(state, 1);
    expect(state.employees[0]!.morale).toBe(before + 2);
    state = advance(state, 20);
    expect(state.employees[0]!.morale).toBe(before + 2);
    const restored = deserializeGameState(serializeGameState(state));
    expect(restored.employees[0]!.morale).toBe(before + 2);
    restored.rooms = restored.rooms.filter((room) => room.id !== "room.coffee");
    restored.facilityTick = 599;
    const nextDay = advance(restored, 1);
    expect(nextDay.employees[0]!.morale).toBe(before + 2);
  });
});
