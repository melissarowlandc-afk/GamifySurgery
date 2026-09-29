import { describe, expect, it } from "vitest";
import {
  PROTOTYPE_DOMAIN_CONTEXT,
  createInitialGameState,
  deserializeGameState,
  gameReducer,
  getEmergencyGlp1Status,
  getFacilityAccessValidation,
  getCurrentCapabilities,
  getEmployeeHomeLocation,
  getOperationalGlp1AutomationCapacity,
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
  it("assigns hired GLP-1 NPs to two stations per reachable suite before using the next suite", () => {
    let state = supportState();
    state.employees = state.employees.filter((employee) => employee.id === "employee.evs");
    for (const employeeId of ["employee.glp.hire.one", "employee.glp.hire.two", "employee.glp.hire.three"]) {
      state = gameReducer(state, {
        type: "HIRE_STAFF",
        operationId: `hire.${employeeId}`,
        employeeId,
        staffRoleDefinitionId: "staff.glp1_np",
      });
      expect(state.operationReceipts[`hire.${employeeId}`]?.status).toBe("applied");
    }
    const hires = state.employees.filter((employee) => employee.staffRoleDefinitionId === "staff.glp1_np");
    expect(hires.map((employee) => employee.homeRoomInstanceId)).toEqual([
      "room.glp.one",
      "room.glp.one",
      "room.glp.two",
    ]);
    expect(hires[0]!.path.at(-1)).not.toEqual(hires[1]!.path.at(-1));
  });

  it("keeps the two GLP-1 NP stations distinct in both approved suite orientations", () => {
    for (const orientation of [0, 270] as const) {
      const state = supportState();
      const suite = state.rooms.find((room) => room.id === "room.glp.one")!;
      suite.orientation = orientation;
      state.employees = state.employees.filter((employee) => employee.staffRoleDefinitionId !== "staff.glp1_np");
      const firstStation = getEmployeeHomeLocation(state, "staff.glp1_np", PROTOTYPE_DOMAIN_CONTEXT);
      state.employees.push({
        ...supportState().employees.find((employee) => employee.id === "employee.glp.one")!,
        homeRoomInstanceId: "room.glp.one",
        location: firstStation.location,
        path: [firstStation.location],
        pathIndex: 0,
      });
      const secondStation = getEmployeeHomeLocation(state, "staff.glp1_np", PROTOTYPE_DOMAIN_CONTEXT);
      expect(secondStation.homeRoomInstanceId).toBe("room.glp.one");
      expect(secondStation.location).not.toEqual(firstStation.location);
    }
  });

  it("redistributes only legacy GLP-1 assignments above two per suite on reload", () => {
    const state = supportState();
    state.employees.push({
      ...state.employees.find((employee) => employee.id === "employee.glp.one")!,
      id: "employee.glp.zthree",
    });
    state.employees
      .filter((employee) => employee.staffRoleDefinitionId === "staff.glp1_np")
      .forEach((employee) => {
        employee.homeRoomInstanceId = "room.glp.one";
      });
    const restored = deserializeGameState(serializeGameState(state));
    expect(restored.employees
      .filter((employee) => employee.staffRoleDefinitionId === "staff.glp1_np")
      .map((employee) => employee.homeRoomInstanceId)).toEqual([
      "room.glp.one",
      "room.glp.one",
      "room.glp.two",
    ]);
  });

  it("preserves later valid two-NP suite assignments before placing earlier legacy overflow", () => {
    const state = supportState();
    const source = state.employees.find((employee) => employee.id === "employee.glp.one")!;
    state.employees = state.employees.filter((employee) => employee.staffRoleDefinitionId !== "staff.glp1_np");
    for (const [id, homeRoomInstanceId] of [
      ["employee.glp.a1", "room.glp.one"],
      ["employee.glp.a2", "room.glp.one"],
      ["employee.glp.a3", "room.glp.one"],
      ["employee.glp.b1", "room.glp.two"],
      ["employee.glp.b2", "room.glp.two"],
    ] as const) {
      state.employees.push({ ...source, id, homeRoomInstanceId });
    }
    const restored = deserializeGameState(serializeGameState(state));
    expect(restored.employees
      .filter((employee) => employee.staffRoleDefinitionId === "staff.glp1_np")
      .map((employee) => [employee.id, employee.homeRoomInstanceId])).toEqual([
      ["employee.glp.a1", "room.glp.one"],
      ["employee.glp.a2", "room.glp.one"],
      ["employee.glp.a3", "room.glp.one"],
      ["employee.glp.b1", "room.glp.two"],
      ["employee.glp.b2", "room.glp.two"],
    ]);
  });

  it("binds staggered GLP-1 timers and receipts to the concrete operational NP", () => {
    let state = supportState();
    expect(getFacilityAccessValidation(state).unreachableRoomIds).toEqual([]);
    state.employees = [];
    expect(getEmergencyGlp1Status(state).eligible).toBe(true);
    state = advance(state, 10);
    state.employees.push({ ...supportState().employees[1]!, id: "employee.glp.one" });
    expect(getOperationalGlp1AutomationCapacity(state)).toBe(1);
    state.employees.at(-1)!.facilityTask = {
      kind: "perform_imaging",
      targetId: "room.missing",
      startedAtFacilityTick: state.facilityTick,
      workMinutesRemaining: 5,
    };
    expect(getOperationalGlp1AutomationCapacity(state)).toBe(0);
    state.employees.at(-1)!.facilityTask = null;
    state = advance(state, 30);
    state.employees.push({ ...supportState().employees[2]!, id: "employee.glp.two" });
    state.employees.push({
      ...supportState().employees[2]!,
      id: "employee.aaa.nonoperational",
      homeRoomInstanceId: "room.missing",
    });
    state = advance(state, 29);
    expect(state.environment.glp1AutomationConsultationsCompleted).toBe(0);
    state = advance(state, 1);
    expect(state.environment.glp1AutomationConsultationsCompleted).toBe(1);
    expect(state.serviceIncomeReceipts.at(-1)).toMatchObject({
      incomeLineId: "income.glp1_telehealth",
      actorId: "employee.glp.one",
      grossAmount: 50,
      netCashDelta: 50,
    });
    const afterFirstPayout = deserializeGameState(serializeGameState(state));
    state = advance(afterFirstPayout, 30);
    expect(state.environment.glp1AutomationConsultationsCompleted).toBe(2);
    expect(state.serviceIncomeReceipts.at(-1)).toMatchObject({
      actorId: "employee.glp.two",
      grossAmount: 50,
    });
    expect(state.serviceIncomeReceipts.some(
      (receipt) => receipt.actorId === "employee.aaa.nonoperational",
    )).toBe(false);
    const receiptKeys = state.serviceIncomeReceipts.map((receipt) => receipt.transactionKey);
    const cashAfterTwo = state.cash;
    state = advance(deserializeGameState(serializeGameState(state)), 1);
    expect(state.cash).toBe(cashAfterTwo);
    expect(state.serviceIncomeReceipts.map((receipt) => receipt.transactionKey)).toEqual(receiptKeys);
    expect(getEmergencyGlp1Status(state).eligible).toBe(false);
    const learning = JSON.stringify(state.learningHistories);
    state.paused = true;
    state = advance(state, 120);
    expect(state.environment.glp1AutomationConsultationsCompleted).toBe(2);
    state.paused = false;
    const restored = deserializeGameState(serializeGameState(state));
    expect(restored.environment.glp1AutomationConsultationsCompleted).toBe(2);
    expect(JSON.stringify(restored.learningHistories)).toBe(learning);
  });

  it("supports two independent NP payout slots in one suite across staffing changes and reload", () => {
    let state = supportState();
    state.employees = state.employees.filter((employee) => employee.id === "employee.glp.one");
    state = advance(state, 30);
    expect(state.environment.glp1AutomationSlots).toEqual([
      expect.objectContaining({
        suiteRoomInstanceId: "room.glp.one",
        employeeId: "employee.glp.one",
        nextPayoutTick: 60,
      }),
    ]);

    state.employees.push({
      ...supportState().employees.find((employee) => employee.id === "employee.glp.two")!,
      homeRoomInstanceId: "room.glp.one",
      location: { x: 31, y: 23 },
      path: [{ x: 31, y: 23 }],
      pathIndex: 0,
    });
    expect(getOperationalGlp1AutomationCapacity(state)).toBe(2);
    state = advance(state, 29);
    expect(state.environment.glp1AutomationConsultationsCompleted).toBe(0);

    state = advance(deserializeGameState(serializeGameState(state)), 1);
    expect(state.environment.glp1AutomationConsultationsCompleted).toBe(1);
    expect(state.serviceIncomeReceipts.filter(
      (receipt) => receipt.incomeLineId === "income.glp1_telehealth",
    )).toEqual([
      expect.objectContaining({ actorId: "employee.glp.one", grossAmount: 50 }),
    ]);
    expect(state.environment.glp1AutomationSlots).toEqual(expect.arrayContaining([
      expect.objectContaining({ suiteRoomInstanceId: "room.glp.one", employeeId: "employee.glp.one", nextPayoutTick: 120 }),
      expect.objectContaining({ suiteRoomInstanceId: "room.glp.one", employeeId: "employee.glp.two", nextPayoutTick: 90 }),
    ]));

    const cashAfterFirstPayout = state.cash;
    state = advance(deserializeGameState(serializeGameState(state)), 30);
    expect(state.environment.glp1AutomationConsultationsCompleted).toBe(2);
    expect(state.cash).toBe(cashAfterFirstPayout + 50);
    expect(state.serviceIncomeReceipts.filter(
      (receipt) => receipt.incomeLineId === "income.glp1_telehealth",
    ).map((receipt) => receipt.transactionKey)).toEqual([
      "income.glp1.automation.room.glp.one.employee.glp.one.60",
      "income.glp1.automation.room.glp.one.employee.glp.two.90",
    ]);
    const receipts = state.serviceIncomeReceipts.filter(
      (receipt) => receipt.incomeLineId === "income.glp1_telehealth",
    ).map((receipt) => receipt.transactionKey);
    const cashAfterSecondPayout = state.cash;
    state = advance(deserializeGameState(serializeGameState(state)), 1);
    expect(state.cash).toBe(cashAfterSecondPayout);
    expect(state.serviceIncomeReceipts.filter(
      (receipt) => receipt.incomeLineId === "income.glp1_telehealth",
    ).map((receipt) => receipt.transactionKey)).toEqual(receipts);
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
