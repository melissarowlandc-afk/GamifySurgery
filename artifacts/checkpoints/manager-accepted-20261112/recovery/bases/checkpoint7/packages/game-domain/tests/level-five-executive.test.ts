import { describe, expect, it } from "vitest";
import { getExecutiveOfficeDuration, getExecutiveTrainingEffects, APPROVED_LEVEL5_SUPPORT_ROUTES } from "@gamify-surgery/balance-config";
import { gameReducer, deserializeGameState, serializeGameState, getActiveExecutiveTerms, getExecutiveDeskLocation,
  getExecutivePreparationQuote, getOperatingExpensePerFacilityHour, getRoomUpkeepBeforeSupplierPerFacilityHour,
  freezeExecutiveComfort, applyExecutiveComfort, quoteExecutiveStock, getRoomSalePreview, startRetailPurchase,
  type GameCommand, type GameState } from "../src/index";
import { createLevelFiveStateQaContext, createLevelFiveStateQaState } from "../../../tests/fixtures/level-five-state";

const context = createLevelFiveStateQaContext();
type CommandInput = { [K in GameCommand["type"]]: Omit<Extract<GameCommand, { type: K }>, "operationId"> }[GameCommand["type"]];
function apply(state: GameState, command: CommandInput): GameState {
  return gameReducer(state, { ...command, operationId: `m4.${state.facilityTick}.${Object.keys(state.operationReceipts).length}` } as GameCommand, context);
}
function tick(state: GameState, count = 1): GameState {
  for (let i = 0; i < count; i++) state = apply({ ...state, paused: false }, { type: "ADVANCE_TICK", advancedAtRealMs: 0 });
  return state;
}
function working(level = 1, officeLevel = 1, isolateRetail = false) {
  let state = createLevelFiveStateQaState("executive", context);
  if (isolateRetail) {
    // This stock-receipt test requests its own coffee purchase. M5 optional
    // gifts must not spend that founder's allowance or add unrelated savings.
    state.giftRetailDemand = { version: "gift-retail-demand.v1", nextOpportunityAtFacilityTick: Number.MAX_SAFE_INTEGER, opportunitySequence: 0 };
    state.nextExternalRetailOpportunityTick = Number.MAX_SAFE_INTEGER;
    state.retailNextOpportunityTicks = Object.fromEntries(["founder:founder", ...state.employees.map(e => `employee:${e.id}`)].map(id => [id, Number.MAX_SAFE_INTEGER]));
  }
  const executive = state.employees.find(employee => employee.staffRoleDefinitionId === "staff.executive")!;
  executive.trainingLevel = level as 1 | 2 | 3 | 4 | 5;
  state.rooms.find(room => room.id === executive.homeRoomInstanceId)!.upgradeLevel = officeLevel as 1 | 2 | 3 | 4 | 5;
  // Omit Gym only in this focused fixture so ordinary optional breaks cannot mask desk work.
  state.rooms = state.rooms.filter(room => room.roomDefinitionId !== "room.staff_gym");
  state.doors = state.doors.filter(door => state.rooms.some(room => room.id === door.roomId));
  for (let i = 0; i < 150 && state.levelFive?.management.round?.status !== "working"; i++) state = tick(state);
  expect(state.levelFive?.management.round?.status).toBe("working");
  return state;
}
function completed(level = 1, officeLevel = 1, isolateRetail = false) {
  let state = working(level, officeLevel, isolateRetail);
  state = tick(state, state.levelFive!.management.round!.durationMinutes);
  expect(state.levelFive!.management.round!.status).toBe("completed");
  return state;
}
const reload = (state: GameState) => deserializeGameState(serializeGameState(state), context);

describe("M4 daily Executive lifecycle", () => {
  it.each(APPROVED_LEVEL5_SUPPORT_ROUTES["room.executive_office"])("uses the exact approved native hire route through $doorSegment", route => {
    let state = createLevelFiveStateQaState("executive-hire", context);
    state = apply(state, { type: "REMOVE_DOOR", doorId: "door.room.qa.level5.executive" });
    const ring = [[28, 18], [28, 19], [28, 20], [29, 18], [30, 18], [31, 18], [32, 18], [32, 19], [32, 20]];
    for (const [x, y] of ring) state = apply(state, { type: "PLACE_ROOM", roomId: `m4.ring.${x}.${y}`, roomDefinitionId: "room.hallway", x: x!, y: y!, orientation: 0 });
    const side = ({ N: "north", S: "south", W: "west", E: "east" } as const)[route.doorSegment[0] as "N" | "S" | "W" | "E"];
    const offset = side === "north" || side === "south" ? Number(route.doorSegment[1]) - 1 : route.doorSegment.charCodeAt(1) - 65;
    state = apply(state, { type: "PLACE_DOOR", doorId: "m4.native.door", roomId: "room.qa.level5.executive", side, offset });
    state = apply(state, { type: "HIRE_STAFF", employeeId: "m4.native.executive", staffRoleDefinitionId: "staff.executive" });
    const employee = state.employees.find(employee => employee.id === "m4.native.executive")!;
    expect(employee).toBeDefined();
    expect(employee.path.slice(-route.logicalPath.length)).toEqual(route.logicalPath.map(point => ({ x: 29 + point[0]!, y: 19 + point[1]! })));
    for (let i = 0; i < 110 && state.levelFive!.management.round?.status !== "working"; i++) state = tick(state);
    expect(state.levelFive!.management.round?.status).toBe("working");
    expect(state.employees.find(employee => employee.id === "m4.native.executive")!.location).toEqual(getExecutiveDeskLocation(state, employee));
  });
  it.each(["executive", "executive-look2"] as const)("hires the approved %s look at $45 with one desk", scenario => {
    const state = createLevelFiveStateQaState(scenario, context);
    const employee = state.employees.find(employee => employee.staffRoleDefinitionId === "staff.executive")!;
    expect(employee.salaryPerExpenseInterval).toBe(45);
    expect(employee.appearance.stillId).toBe(scenario === "executive" ? "future-roster20-v5.003" : "future-roster20-v5.004");
    const second = apply(state, { type: "HIRE_STAFF", employeeId: "executive.second", staffRoleDefinitionId: "staff.executive" });
    expect(second.cashCents).toBe(state.cashCents);
    expect(second.employees.filter(employee => employee.staffRoleDefinitionId === "staff.executive")).toHaveLength(1);
  });
  it.each([1, 2, 3, 4, 5])("freezes and awards all four tier %i effects once", level => {
    let state = working(level, level);
    const round = structuredClone(state.levelFive!.management.round!);
    const morale = state.employees.map(employee => employee.morale);
    const xp = state.clinicalXp;
    expect(round.effects).toEqual({ version: "executive-effect-quote.v1", ...getExecutiveTrainingEffects(level) });
    expect(round.rawDurationMinutes).toBe(getExecutiveOfficeDuration(level).rawMinutes);
    state = tick(state, round.durationMinutes);
    expect(state.employees.map(employee => employee.morale)).toEqual(morale.map(value => value + getExecutiveTrainingEffects(level).staffMoralePoints));
    expect(state.clinicalXp).toBe(xp);
    const terms = structuredClone(getActiveExecutiveTerms(state, context));
    state = tick(reload(state), 3);
    expect(getActiveExecutiveTerms(state, context)).toEqual(terms);
    expect(state.levelFive!.management.lastCompletedDayNumber).toBe(1);
    expect(state.employees.map(employee => employee.morale)).toEqual(morale.map(value => value + getExecutiveTrainingEffects(level).staffMoralePoints));
    const prep = getExecutivePreparationQuote(state, context);
    expect(prep.durationMinutes).toBe([57, 57, 56, 55, 54][level - 1]);
  });
  it("retains native routes/progress/accepted tiers across reload and real office upgrade", () => {
    let state = working(); state = tick(state, 7);
    const before = structuredClone(state.levelFive!.management.round);
    state = apply(state, { type: "UPGRADE_ROOM", roomId: "room.qa.level5.executive" });
    state = reload(state);
    expect(state.levelFive!.management.round).toEqual(before);
    const executive = state.employees.find(employee => employee.staffRoleDefinitionId === "staff.executive")!;
    expect(executive.location).toEqual(getExecutiveDeskLocation(state, executive));
    state = tick(state, before!.remainingWorkMinutes);
    expect(state.levelFive!.management.round!.officeUpgradeLevel).toBe(1);
    expect(state.levelFive!.management.round!.effectsAppliedAtFacilityTick).not.toBeNull();
  });
  it("interrupts a closed entrance, releases its contact, resumes remaining work and cancels firing", () => {
    let state = tick(working(), 5);
    const employee = state.employees.find(employee => employee.staffRoleDefinitionId === "staff.executive")!;
    const guarded = apply(state, { type: "REMOVE_DOOR", doorId: "door.room.qa.level5.executive" });
    expect(Object.values(guarded.operationReceipts).at(-1)?.status).toBe("rejected");
    state = apply(state, { type: "SELL_ROOM", roomId: "room.level5.rooms.link.25" });
    expect(state.levelFive!.management.round!.status).toBe("paused");
    expect(state.levelFive!.management.round!.reservedContactId).toBeNull();
    state = tick(reload(state), 5);
    expect(state.levelFive!.management.round!.remainingWorkMinutes).toBe(25);
    state = apply(state, { type: "PLACE_ROOM", roomId: "m4.restored", roomDefinitionId: "room.hallway", x: 35, y: 25, orientation: 0 });
    state = tick(state, 4);
    expect(state.levelFive!.management.round!.remainingWorkMinutes).toBeLessThan(25);
    state = apply(state, { type: "FIRE_EMPLOYEE", employeeId: employee.id });
    expect(state.levelFive!.management.round!.status).toBe("cancelled");
    expect(getActiveExecutiveTerms(state, context)).toBeNull();
  });
  it("expires unfinished work at day rollover and starts one new round without an old award", () => {
    let state = working();
    state.facilityTick = 599; state.levelFive!.management.round!.lastProgressAtFacilityTick = 599;
    const oldId = state.levelFive!.management.round!.id;
    const morale = state.employees.map(employee => employee.morale);
    state = tick(state);
    expect(state.levelFive!.management.round!.dayNumber).toBe(2);
    expect(state.levelFive!.management.round!.id).not.toBe(oldId);
    expect(state.levelFive!.management.round!.remainingWorkMinutes).toBe(30);
    expect(state.employees.map(employee => employee.morale)).toEqual(morale);
  });
  it("keeps awarded morale but stops new terms on firing or actual office sale", () => {
    const initial = completed();
    const executive = initial.employees.find(employee => employee.staffRoleDefinitionId === "staff.executive")!;
    for (const mode of ["fire", "sale"]) {
      const state = mode === "fire" ? apply(initial, { type: "FIRE_EMPLOYEE", employeeId: executive.id }) : apply(initial,
        { type: "SELL_ROOM", roomId: executive.homeRoomInstanceId!, saleConfirmationToken: getRoomSalePreview(initial, executive.homeRoomInstanceId!, context)!.confirmationToken });
      expect(getActiveExecutiveTerms(state, context)).toBeNull();
      expect(state.employees[0]!.morale).toBe(initial.employees[0]!.morale);
      expect(getExecutivePreparationQuote(state, context).durationMinutes).toBe(60);
      expect(reload(state).levelFive!.management.round).toEqual(state.levelFive!.management.round);
    }
  });
  it("runs existing paid training and retains active terms while training", () => {
    let state = completed();
    const id = state.employees.find(employee => employee.staffRoleDefinitionId === "staff.executive")!.id;
    const before = state.cashCents;
    state = apply(state, { type: "TRAIN_EMPLOYEE", employeeId: id });
    expect(state.cashCents).toBe(before - 10000);
    let observedTraining = false;
    for (let i = 0; i < 150 && state.employees.find(employee => employee.id === id)!.trainingLevel === 1; i++) {
      state = tick(state);
      observedTraining ||= state.employees.find(employee => employee.id === id)!.training?.stage === "training";
      expect(getActiveExecutiveTerms(state, context)?.employeeTrainingLevel).toBe(1);
      if (i === 20) state = reload(state);
    }
    expect(observedTraining).toBe(true);
    expect(state.employees.find(employee => employee.id === id)!.trainingLevel).toBe(2);
    expect(getActiveExecutiveTerms(state, context)?.effects.supplierReductionPercent).toBe(1);
  });
  it("trains through all four paid tiers, without repricing the accepted daily terms", () => {
    let state = completed();
    const id = state.employees.find(employee => employee.staffRoleDefinitionId === "staff.executive")!.id;
    for (const level of [2, 3, 4, 5]) {
      for (let i = 0; state.employees.find(employee => employee.id === id)!.training && i < 120; i++) state = tick(state);
      const before = state.cashCents;
      state = apply(state, { type: "TRAIN_EMPLOYEE", employeeId: id });
      expect(state.cashCents).toBe(before - (level - 1) * 10000);
      state = reload(state);
      for (let i = 0; i < 160 && state.employees.find(employee => employee.id === id)!.trainingLevel < level; i++) state = tick(state);
      expect(state.employees.find(employee => employee.id === id)!.trainingLevel).toBe(level);
    }
    const maxRequest = apply(state, { type: "TRAIN_EMPLOYEE", employeeId: id });
    expect(maxRequest.cashCents).toBe(state.cashCents);
    expect(Object.values(maxRequest.operationReceipts).at(-1)?.status).toBe("rejected");
  });
  it("rejects malformed round/task and comfort/stock quotes rather than fabricating effects", () => {
    const state = working();
    for (const mutate of [
      (raw: GameState) => { raw.employees.find(employee => employee.staffRoleDefinitionId === "staff.executive")!.facilityTask = null; },
      (raw: GameState) => { raw.levelFive!.management.round!.remainingWorkMinutes = 40; },
      (raw: GameState) => { raw.levelFive!.management.upkeepAccounting = { baselineAccrualSixtiethCents: 1, fractionalReduction: 2 }; },
    ]) {
      const raw = structuredClone(state); mutate(raw);
      expect(() => reload(raw)).toThrow(/Executive|Level 5/);
    }
  });
});

describe("M4 accepted quotes and expense arithmetic", () => {
  it("freezes a real visitor quote before the care walk and retains it through firing and reload", () => {
    let state = createLevelFiveStateQaState("executive-visits", context);
    let visit: GameState["serviceOperations"][number] | undefined;
    for (let i = 0; i < 360 && !visit; i++) {
      state = tick(state);
      visit = state.serviceOperations.find(operation => operation.status === "walking_to_service" && operation.executiveComfort?.points === 1);
    }
    expect(visit).toBeDefined();
    const id = visit!.id, quote = structuredClone(visit!.executiveComfort!);
    expect(quote.appliedAtFacilityTick).toBeNull();
    expect(quote.acceptedAtFacilityTick).toBe(state.facilityTick);
    expect(visit!.startedAtFacilityTick).toBeNull();
    const executive = state.employees.find(employee => employee.staffRoleDefinitionId === "staff.executive")!;
    state = reload(apply(state, { type: "FIRE_EMPLOYEE", employeeId: executive.id }));
    expect(getActiveExecutiveTerms(state, context)).toBeNull();
    for (let i = 0; i < 120 && state.serviceOperations.find(operation => operation.id === id)!.completedAtFacilityTick === null; i++) state = tick(state);
    const settled = state.serviceOperations.find(operation => operation.id === id)!.executiveComfort!;
    expect(settled).toEqual({ ...quote, appliedAtFacilityTick: expect.any(Number) });
    const applied = settled.appliedAtFacilityTick;
    state = tick(reload(state), 4);
    expect(state.serviceOperations.find(operation => operation.id === id)!.executiveComfort!.appliedAtFacilityTick).toBe(applied);
    expect(state.clinicalXp).toBe(1999);
    expect(state.encounters).toEqual({});
  });
  it("freezes and settles real unscored APP visitor comfort without scored completions or learning", () => {
    let state = createLevelFiveStateQaState("executive-visits", context);
    const beforeLearning = JSON.stringify([state.clinicalXp, state.learningHistories, state.reviewIntents, state.settlements]);
    let comfortVisit: GameState["serviceOperations"][number] | undefined;
    for (let i = 0; i < 360 && !comfortVisit; i++) {
      state = tick(state);
      comfortVisit = state.serviceOperations.find(operation => operation.executiveComfort?.points === 1 && operation.executiveComfort.appliedAtFacilityTick !== null);
    }
    expect(comfortVisit).toBeDefined();
    expect(comfortVisit!.actorKind).toBe("visitor");
    expect(state.encounters).toEqual({});
    expect(JSON.stringify([state.clinicalXp, state.learningHistories, state.reviewIntents, state.settlements])).toBe(beforeLearning);
    expect(reload(state).serviceOperations.find(operation => operation.id === comfortVisit!.id)?.executiveComfort).toEqual(comfortVisit!.executiveComfort);
  });
  it("posts a frozen supplier stock saving once after a real purchase, even after firing and reload", () => {
    let state = completed(2, 1, true);
    state = apply(state, { type: "PLACE_ROOM", roomId: "m4.coffee", roomDefinitionId: "room.coffee_kiosk", x: 45, y: 24, orientation: 0 });
    state = apply(state, { type: "PLACE_ROOM", roomId: "m4.coffee.link", roomDefinitionId: "room.hallway", x: 44, y: 26, orientation: 0 });
    state = apply(state, { type: "PLACE_ROOM", roomId: "m4.coffee.hall", roomDefinitionId: "room.hallway", x: 45, y: 26, orientation: 0 });
    state = apply(state, { type: "PLACE_DOOR", doorId: "m4.coffee.door", roomId: "m4.coffee", side: "south", offset: 0 });
    const id = startRetailPurchase(state, "income.coffee", "founder", "founder", context);
    expect(id).not.toBeNull();
    const accepted = structuredClone(state.retailOperations.find(operation => operation.id === id)!.executiveStock);
    expect(accepted).toMatchObject({ reductionPercent: 1.25, baselineCostCents: 100, costCents: 99 });
    const employee = state.employees.find(employee => employee.staffRoleDefinitionId === "staff.executive")!;
    state = apply(state, { type: "FIRE_EMPLOYEE", employeeId: employee.id });
    state = reload(state);
    for (let i = 0; i < 120 && !state.serviceIncomeReceipts.some(receipt => receipt.transactionKey.includes(id!)); i++) state = tick(state);
    const receipt = state.serviceIncomeReceipts.find(receipt => receipt.transactionKey.includes(id!))!;
    expect(receipt).toMatchObject({ grossAmount: 0, stockCost: .99, netCashDelta: -.99 });
    expect(state.levelFive!.management.supplierSavings.stockCents).toBe(1);
    state = tick(reload(state), 5);
    expect(state.levelFive!.management.supplierSavings.stockCents).toBe(1);
    expect(state.serviceIncomeReceipts.filter(receipt => receipt.transactionKey.includes(id!))).toHaveLength(1);
  });
  it("freezes scored and unscored comfort once, including a zero quote before completion", () => {
    const state = completed(2);
    const visit = { patientSatisfaction: 70, resolutionReason: null } as unknown as GameState["encounters"][string];
    freezeExecutiveComfort(state, visit, context);
    state.levelFive!.management.activeTerms = null;
    applyExecutiveComfort(state, visit); applyExecutiveComfort(state, visit);
    expect(visit.patientSatisfaction).toBe(71.25);
    const visitor = { actorKind: "visitor" } as GameState["serviceOperations"][number];
    freezeExecutiveComfort(state, visitor, context);
    expect(visitor.executiveComfort?.points).toBe(0);
    applyExecutiveComfort(state, visitor);
    expect(visitor.executiveComfort?.appliedAtFacilityTick).toBe(state.facilityTick);
    expect(state.encounters).toEqual({});
  });
  it.each([1, 2, 3, 4, 5])("discounts tier %i stock after pharmacist modifiers, excludes wages and saves posting cents", level => {
    let state = completed(level);
    const rate = getExecutiveTrainingEffects(level).supplierReductionPercent;
    const stock = quoteExecutiveStock(state, 13.5, context)!;
    expect(stock.costCents).toBe(Math.round(1350 * (1 - rate / 100)));
    const baseline = getRoomUpkeepBeforeSupplierPerFacilityHour(state, context);
    const payroll = state.employees.reduce((sum, employee) => sum + employee.salaryPerExpenseInterval, 0);
    expect(-getOperatingExpensePerFacilityHour(state, context)).toBeCloseTo(baseline * (1 - rate / 100) + payroll, 10);
    const control = structuredClone(state); control.levelFive!.management.activeTerms = null;
    let afterControl = control;
    const expense = state.totalOperatingExpenses, controlExpense = control.totalOperatingExpenses;
    const savedBefore = state.levelFive!.management.supplierSavings.upkeepSixtiethCents;
    state = tick(reload(state), 60); afterControl = tick(reload(afterControl), 60);
    const difference = (afterControl.totalOperatingExpenses - controlExpense) - (state.totalOperatingExpenses - expense);
    expect((state.levelFive!.management.supplierSavings.upkeepSixtiethCents - savedBefore) / 6000).toBeCloseTo(difference, 8);
    expect(difference).toBeGreaterThan(0);
    expect(state.employees.map(employee => employee.salaryPerExpenseInterval)).toEqual(afterControl.employees.map(employee => employee.salaryPerExpenseInterval));
  });
});
