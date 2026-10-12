import { describe, expect, it } from "vitest";
import { PROTOTYPE_BALANCE_RELEASE } from "@gamify-surgery/balance-config";
import { advanceEmployeeMovement, advanceLevelThreeSupport, advancePatientAmenityTrips, deserializeGameState,
  gameReducer, getAverageEffectiveStaffMorale, getEmployeeEffectiveMorale, getFounderOfficeMoraleBonus,
  getPatientAmenityTrip, getLevelFiveSupportTarget, getNextRoomUpgradeCost,
  serializeGameState, tryStartPatientGardenRest, startServiceOperation, advanceServiceOperations,
  findLevelFiveSupportPath, getClinicSatisfaction, type GameState, type RoomUpgradeLevel } from "../src";
import { createPediatricFamilyFixture } from "../../../tests/fixtures/pediatric-families";
import { createLevelFiveStateQaContext, createLevelFiveStateQaState } from "../../../tests/fixtures/level-five-state";

const context = createLevelFiveStateQaContext();
const levels = [1, 2, 3, 4, 5] as const;
let sequence = 0;
const reload = (state: GameState) => deserializeGameState(serializeGameState(state), context);
const founder = (state: GameState) => state.rooms.find(room => room.roomDefinitionId === "room.founder_office")!;
const garden = (state: GameState) => state.rooms.find(room => room.roomDefinitionId === "room.indoor_garden")!;
const gym = (state: GameState) => state.rooms.find(room => room.roomDefinitionId === "room.staff_gym")!;
const patientId = "encounter.level5.support.0";

function gymFixture(level: RoomUpgradeLevel = 1): GameState {
  const state = createLevelFiveStateQaState("rooms", context);
  gym(state).upgradeLevel = level;
  const employee = state.employees[0]!;
  employee.location = { ...employee.path.at(-1)! }; employee.pathIndex = employee.path.length - 1;
  employee.lastMovedAtFacilityTick = state.facilityTick; employee.nextIdleActionAtFacilityTick = Number.MAX_SAFE_INTEGER;
  employee.morale = 60;
  state.nextEmployeeDiscussionTick = state.nextExternalRetailOpportunityTick = Number.MAX_SAFE_INTEGER;
  state.retailNextOpportunityTicks[`employee:${employee.id}`] = Number.MAX_SAFE_INTEGER;
  state.retailNextOpportunityTicks["founder:founder"] = Number.MAX_SAFE_INTEGER;
  advanceLevelThreeSupport(state, context);
  return state;
}

function supportMinutes(state: GameState, minutes: number): void {
  for (let i = 0; i < minutes; i++) { state.facilityTick++; advanceLevelThreeSupport(state, context); advanceEmployeeMovement(state, context); }
}
function gardenMinutes(state: GameState, minutes: number): void {
  for (let i = 0; i < minutes; i++) { state.facilityTick++; advancePatientAmenityTrips(state, context); }
}
function gardenFixture(level: RoomUpgradeLevel = 1): GameState {
  const state = createLevelFiveStateQaState("support", context);
  // Restart only the first QA route at the chosen tier, with no prior award.
  state.patientAmenityTrips = state.patientAmenityTrips!.filter(trip => trip.actorId !== patientId);
  garden(state).upgradeLevel = level;
  expect(tryStartPatientGardenRest(state, "encounter", patientId, context)).toBe(true);
  return state;
}
function fullTicks(state: GameState, minutes: number): GameState {
  state.paused = false;
  for (let i = 0; i < minutes; i++) state = gameReducer(state, { type: "ADVANCE_TICK", operationId: `m3.tick.${sequence++}` }, context);
  return state;
}

describe("Founder ownership: effective, reversible, never stored twice", () => {
  it.each(levels)("gives every employee +%s-tier ownership through repeated reload and later hire", tier => {
    let state = createLevelFiveStateQaState("support", context); founder(state).upgradeLevel = tier;
    const stored = state.employees.map(employee => employee.morale);
    const expected = 2 * tier;
    expect(getFounderOfficeMoraleBonus(state)).toBe(expected);
    expect(state.employees.map(employee => getEmployeeEffectiveMorale(state, employee))).toEqual(stored.map(morale => Math.min(100, morale + expected)));
    state = reload(reload(state));
    expect(state.employees.map(employee => employee.morale)).toEqual(stored);
    expect(getAverageEffectiveStaffMorale(state)).toBe(stored.reduce((sum, morale) => sum + morale + expected, 0) / stored.length);
    expect(state.employees.find(employee => employee.id === "employee.level5.support.app")!.morale).toBe(75);
    expect(getEmployeeEffectiveMorale(state, state.employees.find(employee => employee.id === "employee.level5.support.app")!)).toBe(75 + expected);
  });
  it("keeps ownership across blocked access and removes only its modifier on sale", () => {
    let state = gymFixture(1); founder(state).upgradeLevel = 5;
    const stored = state.employees[0]!.morale;
    state.doors = state.doors.filter(door => door.roomId !== founder(state).id);
    expect(getEmployeeEffectiveMorale(state, state.employees[0]!)).toBe(stored + 10);
    state = gameReducer(state, { type: "SELL_ROOM", operationId: "m3.sell.founder", roomId: founder(state).id }, context);
    expect(state.operationReceipts["m3.sell.founder"]?.status).toBe("applied");
    expect(state.employees[0]!.morale).toBe(stored);
    expect(getEmployeeEffectiveMorale(reload(state), state.employees[0]!)).toBe(stored);
  });
  it("retains the salary normalization rule separately, including repeated commands and clamps", () => {
    let state = gymFixture(1); founder(state).upgradeLevel = 5;
    const employee = state.employees[0]!, role = context.balanceRelease.facility.staffRoleDefinitions.find(role => role.id === employee.staffRoleDefinitionId)!;
    const command = { type: "SET_EMPLOYEE_SALARY" as const, operationId: "m3.salary", employeeId: employee.id, salaryPerExpenseInterval: role.salaryPerExpenseInterval + role.salaryAdjustmentStep };
    state = gameReducer(state, command, context); const once = serializeGameState(state);
    state = gameReducer(state, command, context);
    expect(serializeGameState(state)).toBe(once);
    expect(state.employees[0]!.morale).toBe(role.baseMorale + role.moralePerSalaryStep);
    expect(getEmployeeEffectiveMorale(state, state.employees[0]!)).toBe(role.baseMorale + role.moralePerSalaryStep + 10);
    state.employees[0]!.morale = 99; expect(getEmployeeEffectiveMorale(state, state.employees[0]!)).toBe(100);
    state.employees = []; expect(getAverageEffectiveStaffMorale(state)).toBeNull();
  });
  it("still allows quitting at zero stored morale with the maximum +10 office under sustained nonpayment", () => {
    let state = gymFixture(1); founder(state).upgradeLevel = 5;
    state.employees[0]!.morale = 15; state.employees[0]!.facilityTask = null;
    state.doors = state.doors.filter(door => door.roomId !== gym(state).id);
    state.cash = state.cashCents = 0; state.nextFinancialPostingTick = state.facilityTick + 1;
    state = fullTicks(state, 180);
    expect(state.employees).toHaveLength(0);
    expect(state.events.some(event => event.id.startsWith("event.staff-quit."))).toBe(true);
  });
  it.each([0, 1, 2, 3, 4])("does not activate ownership in Level %s or insert it into saves", level => {
    const state = createLevelFiveStateQaState("rooms", context); state.facilityLevel = level as GameState["facilityLevel"];
    expect(getFounderOfficeMoraleBonus(state)).toBe(0);
    expect(getEmployeeEffectiveMorale(state, state.employees[0]!)).toBe(state.employees[0]!.morale);
    expect(serializeGameState(state)).not.toContain("founderOwnershipMorale");
    expect(PROTOTYPE_BALANCE_RELEASE.facility.maximumPlayableLevel).toBe(5);
    expect(getNextRoomUpgradeCost(state, founder(state).id, context)).toBeNull();
    const upgrade = gameReducer(state, { type: "UPGRADE_ROOM", operationId: `m3.lower-level.${level}`, roomId: founder(state).id }, context);
    expect(upgrade.operationReceipts[`m3.lower-level.${level}`]?.status).toBe("rejected"); expect(upgrade.cashCents).toBe(state.cashCents);
  });
});

describe("Garden: real adult use, five-minute rest, frozen once-only visit witness", () => {
  it("records actual unscored visitor comfort without adding HUD patients, money, XP or reviews", () => {
    let state = createLevelFiveStateQaState("support", context);
    state.encounters = {}; state.patientAmenityTrips = [];
    const id = startServiceOperation(state, "income.app_consult", "visitor", context)!;
    expect(id).toBeTruthy();
    const visitor = state.serviceOperations.find(operation => operation.id === id)!;
    visitor.status = "waiting_for_resources"; visitor.location = { x: 39, y: 21 }; visitor.path = [{ ...visitor.location }]; visitor.pathIndex = 0;
    const baseline = [getClinicSatisfaction(state), state.clinicalXp, JSON.stringify(state.learningHistories), state.serviceIncomeReceipts.length];
    garden(state).upgradeLevel = 3;
    expect(tryStartPatientGardenRest(state, "service_visitor", id, context)).toBe(true);
    gardenMinutes(state, 80); state = reload(state);
    expect(state.serviceOperations.find(operation => operation.id === id)!.gardenVisitBenefit).toMatchObject({ upgradeLevel: 3, points: 6 });
    expect([getClinicSatisfaction(state), state.clinicalXp, JSON.stringify(state.learningHistories), state.serviceIncomeReceipts.length]).toEqual(baseline);
    expect(state.encounters).toEqual({});
    expect(tryStartPatientGardenRest(state, "service_visitor", id, context)).toBe(false);
  });
  it("preempts unscored garden use as soon as an APP care room can be dispatched", () => {
    const state = createLevelFiveStateQaState("support", context); state.encounters = {}; state.patientAmenityTrips = [];
    const id = startServiceOperation(state, "income.app_consult", "visitor", context)!;
    const visitor = state.serviceOperations.find(operation => operation.id === id)!;
    visitor.status = "waiting_for_resources"; visitor.location = { x: 39, y: 21 }; visitor.path = [{ ...visitor.location }]; visitor.pathIndex = 0;
    expect(tryStartPatientGardenRest(state, "service_visitor", id, context)).toBe(true);
    const app = state.employees.find(employee => employee.staffRoleDefinitionId === "staff.app")!;
    app.facilityTask = null; app.location = { x: 24, y: 25 }; app.path = [{ ...app.location }]; app.pathIndex = 0;
    advanceServiceOperations(state, context);
    expect(getPatientAmenityTrip(state, "service_visitor", id)?.returnRequested).toBe(true);
    expect(visitor.gardenVisitBenefit).toBeUndefined();
  });
  it("keeps pediatric children and parents in their existing paired waiting flow", () => {
    const fixture = createPediatricFamilyFixture(9, context); fixture.state.facilityLevel = 5;
    const before = structuredClone(fixture.family), parent = structuredClone(fixture.state.retailExternalActors.find(actor => actor.id === fixture.family.parentActorId));
    expect(tryStartPatientGardenRest(fixture.state, "encounter", fixture.encounter.id, context)).toBe(false);
    expect(fixture.family).toEqual(before); expect(fixture.state.retailExternalActors.find(actor => actor.id === fixture.family.parentActorId)).toEqual(parent);
  });
  it.each(levels)("earns +2..+10 at tier %s after use, retaining the quote across an upgrade/reload", tier => {
    let state = gardenFixture(tier); const before = state.encounters[patientId]!.patientSatisfaction;
    const trip = getPatientAmenityTrip(state, "encounter", patientId)!;
    expect(state.encounters[patientId]!.gardenVisitBenefit).toBeUndefined();
    expect(trip.amenityKind).toBe("garden");
    expect(trip.path.some(point => !Number.isInteger(point.x) || !Number.isInteger(point.y))).toBe(true);
    gardenMinutes(state, 2); state = reload(state); garden(state).upgradeLevel = 5;
    for (let n = 0; n < 80 && getPatientAmenityTrip(state, "encounter", patientId)?.status !== "using_amenity"; n++) gardenMinutes(state, 1);
    const seated = getPatientAmenityTrip(state, "encounter", patientId)!;
    expect(seated.status).toBe("using_amenity");
    expect(seated.dwellEndsAtFacilityTick).toBe(state.facilityTick + 5);
    gardenMinutes(state, 4); expect(state.encounters[patientId]!.gardenVisitBenefit).toBeUndefined();
    state = reload(state); gardenMinutes(state, 1);
    expect(state.encounters[patientId]!.gardenVisitBenefit).toMatchObject({ upgradeLevel: tier, points: 2 * tier, seatId: "leftSeat" });
    expect(state.encounters[patientId]!.patientSatisfaction).toBe(before + 2 * tier);
    state = reload(state); gardenMinutes(state, 80);
    expect(tryStartPatientGardenRest(state, "encounter", patientId, context)).toBe(false);
    expect(state.encounters[patientId]!.patientSatisfaction).toBe(before + 2 * tier);
  });
  it("reserves exactly two garden contacts and awards no ownership/pass-through comfort", () => {
    const state = createLevelFiveStateQaState("support", context);
    const claims = state.patientAmenityTrips!.filter(trip => trip.amenityKind === "garden");
    expect(claims.map(trip => trip.amenityKind === "garden" ? trip.gardenSeatId : "")).toEqual(["leftSeat", "rightSeat"]);
    expect(Object.values(state.encounters).every(encounter => !encounter.gardenVisitBenefit && encounter.patientSatisfaction === 80)).toBe(true);
    const third = structuredClone(state.encounters[patientId]!); third.id = "encounter.m3.third";
    state.encounters[third.id] = third;
    expect(tryStartPatientGardenRest(state, "encounter", third.id, context)).toBe(false);
  });
  it.each(["walking", "seated"])("yields to accepted care while %s without awarding the interrupted rest", phase => {
    let state = gardenFixture(5);
    if (phase === "seated") for (let i = 0; i < 80 && getPatientAmenityTrip(state, "encounter", patientId)?.status !== "using_amenity"; i++) gardenMinutes(state, 1);
    const opened = gameReducer(state, { type: "OPEN_CHART", operationId: `m3.open.${phase}`, encounterId: patientId }, context);
    expect(opened.operationReceipts[`m3.open.${phase}`]?.status).toBe("applied");
    expect(getPatientAmenityTrip(opened, "encounter", patientId)?.returnRequested).toBe(true);
    state = reload(opened); state = fullTicks(state, 80);
    expect(state.encounters[patientId]!.gardenVisitBenefit).toBeUndefined();
    expect(getPatientAmenityTrip(state, "encounter", patientId)).toBeNull();
    expect(state.encounters[patientId]!.patientLocation).not.toBeNull();
  });
  it("captures sale exits, releases contacts and survives reload without an award", () => {
    let state = gardenFixture(5); gardenMinutes(state, 5);
    const id = garden(state).id;
    state = gameReducer(state, { type: "SELL_ROOM", operationId: "m3.sell.garden", roomId: id }, context);
    expect(state.operationReceipts["m3.sell.garden"]?.status).toBe("applied");
    expect(state.patientAmenityTrips!.every(trip => trip.status === "returning")).toBe(true);
    state = reload(state); gardenMinutes(state, 80);
    expect(state.patientAmenityTrips).toHaveLength(0);
    expect(Object.values(state.encounters).every(encounter => !encounter.gardenVisitBenefit)).toBe(true);
  });
  it("protects a garden reservation before arrival from room movement and releases it on lost access", () => {
    let state = gardenFixture(3);
    const moved = gameReducer(state, { type: "MOVE_ROOM", operationId: "m3.move.garden", roomId: garden(state).id, x: 10, y: 10 }, context);
    expect(moved.operationReceipts["m3.move.garden"]?.status).toBe("rejected");
    state.doors = state.doors.filter(door => door.roomId !== garden(state).id);
    state = reload(state); gardenMinutes(state, 40);
    expect(Object.values(state.encounters).every(encounter => !encounter.gardenVisitBenefit)).toBe(true);
    expect(state.patientAmenityTrips).toHaveLength(0);
  });
  it.each(["restore", "sell"])("holds an interrupted seated garden return through reload and safely resumes on %s", action => {
    let state = gardenFixture(5);
    for (let i = 0; i < 80 && getPatientAmenityTrip(state, "encounter", patientId)?.status !== "using_amenity"; i++) gardenMinutes(state, 1);
    const doors = state.doors.filter(door => door.roomId === garden(state).id);
    state.doors = state.doors.filter(door => door.roomId !== garden(state).id);
    gardenMinutes(state, 1);
    const location = { ...state.encounters[patientId]!.patientLocation! };
    expect(getPatientAmenityTrip(state, "encounter", patientId)).toMatchObject({ status: "returning", returnBlocked: true, dwellEndsAtFacilityTick: null });
    state = reload(state); gardenMinutes(state, 10);
    expect(state.encounters[patientId]!.patientLocation).toEqual(location);
    expect(state.encounters[patientId]!.gardenVisitBenefit).toBeUndefined();
    if (action === "restore") state.doors.push(...doors);
    else state = gameReducer(state, { type: "SELL_ROOM", operationId: "m3.sell.blocked.garden", roomId: garden(state).id }, context);
    gardenMinutes(state, 80); state = reload(state);
    expect(getPatientAmenityTrip(state, "encounter", patientId)).toBeNull();
    expect(state.encounters[patientId]!.patientLocation).not.toEqual(location);
    expect(state.encounters[patientId]!.gardenVisitBenefit).toBeUndefined();
  });
  it("clamps use and rejects malformed quotes, duplicate seats and future witness clocks", () => {
    const state = gardenFixture(5); state.encounters[patientId]!.patientSatisfaction = 99;
    gardenMinutes(state, 80); expect(state.encounters[patientId]!.patientSatisfaction).toBe(100);
    const bad = JSON.parse(serializeGameState(state)); bad.encounters[patientId].gardenVisitBenefit.completedAtFacilityTick = state.facilityTick + 1;
    expect(() => deserializeGameState(JSON.stringify(bad), context)).toThrow(/garden/);
    const fresh = createLevelFiveStateQaState("support", context), raw = JSON.parse(serializeGameState(fresh));
    raw.patientAmenityTrips[1].gardenSeatId = raw.patientAmenityTrips[0].gardenSeatId;
    expect(() => deserializeGameState(JSON.stringify(raw), context)).toThrow(/duplicate reservations/);
    raw.patientAmenityTrips[1].gardenSeatId = "rightSeat"; raw.patientAmenityTrips[0].gardenSatisfactionPoints = 10;
    expect(() => deserializeGameState(JSON.stringify(raw), context)).toThrow(/garden/);
  });
});

describe("Gym: one shared break policy, contacts, payroll and cooldown", () => {
  it("preempts an optional gym break for arriving care demand without earning a partial reward", () => {
    const state = gymFixture(5), employee = state.employees[0]!, before = employee.morale;
    const adult = createLevelFiveStateQaState("support", context).encounters[patientId]!;
    adult.checkInStatus = "awaiting_staff"; state.encounters[adult.id] = adult;
    supportMinutes(state, 1);
    expect(employee.facilityTask).toBeNull(); expect(employee.morale).toBe(before); expect(employee.lastBreakAtFacilityTick).toBeNull();
  });
  it.each(levels)("uses a real route, earns +5..+13 at tier %s and does not replay after load", tier => {
    let state = gymFixture(tier); const task = state.employees[0]!.facilityTask!, baseline = state.employees[0]!.morale;
    expect(task).toMatchObject({ kind: "take_break", seatId: "benchSeat", workMinutesRemaining: 30, roomUpgradeBreakBenefit: { roomDefinitionId: "room.staff_gym", upgradeLevel: tier, moraleGain: 5 + (tier - 1) * 2 } });
    expect(state.employees[0]!.path.at(-1)).toEqual(getLevelFiveSupportTarget(gym(state), "benchSeat"));
    supportMinutes(state, 2); state = reload(state); gym(state).upgradeLevel = 5;
    for (let n = 0; n < 100 && state.employees[0]!.facilityTask; n++) supportMinutes(state, 1);
    expect(state.employees[0]!.morale).toBe(baseline + 5 + (tier - 1) * 2);
    const completedAt = state.employees[0]!.lastBreakAtFacilityTick;
    state = reload(state); supportMinutes(state, 200);
    expect(state.employees[0]!.morale).toBe(baseline + 5 + (tier - 1) * 2);
    expect(state.employees[0]!.lastBreakAtFacilityTick).toBe(completedAt);
  });
  it("does not offer an ordinary break before the same 240-minute cooldown and leaves its seven seats intact", () => {
    let state = gymFixture(1); supportMinutes(state, 100);
    const completed = state.employees[0]!.lastBreakAtFacilityTick!;
    state = gameReducer(state, { type: "PLACE_ROOM", operationId: "m3.break.room", roomId: "room.m3.break", roomDefinitionId: "room.staff_break", x: 14, y: 18 }, context);
    // Synthetic access extension to the existing support hall, avoiding QA layout overlap.
    for (let x = 14; x <= 22; x++) state.rooms.push({ id: `room.m3.hall.${x}`, roomDefinitionId: "room.hallway", x, y: 22, orientation: 0, doorSide: null, upgradeLevel: 1 });
    state.rooms.push({ id: "room.m3.hall.link", roomDefinitionId: "room.hallway", x: 22, y: 21, orientation: 0, doorSide: null, upgradeLevel: 1 });
    state = gameReducer(state, { type: "PLACE_DOOR", operationId: "m3.break.door", doorId: "door.m3.break", roomId: "room.m3.break", side: "south", offset: 2 }, context);
    state.doors = state.doors.filter(door => door.roomId !== gym(state).id);
    supportMinutes(state, Math.max(0, completed + 239 - state.facilityTick));
    expect(state.employees[0]!.facilityTask).toBeNull();
    supportMinutes(state, 1);
    expect(state.employees[0]!.facilityTask).toMatchObject({ kind: "take_break", targetId: "room.m3.break", roomUpgradeBreakBenefit: { baselineMoraleGain: 5 } });
  });
  it("shares two distinct contacts, cancels lost access without morale/cooldown and cannot duplicate claims on reload", () => {
    let state = createLevelFiveStateQaState("support", context);
    expect(state.employees.map(employee => employee.facilityTask?.seatId)).toEqual(["benchSeat", "stretchSpot"]);
    const baseline = state.employees.map(employee => employee.morale);
    state.doors = state.doors.filter(door => door.roomId !== gym(state).id);
    state = reload(state); supportMinutes(state, 80);
    expect(state.employees.map(employee => employee.morale)).toEqual(baseline);
    expect(state.employees.every(employee => employee.lastBreakAtFacilityTick === null && employee.facilityTask === null)).toBe(true);
  });
  it("rejects duplicate gym contacts, altered frozen gains and replayable completion tasks on reload", () => {
    const state = createLevelFiveStateQaState("support", context), raw = JSON.parse(serializeGameState(state));
    raw.employees[1].facilityTask.seatId = raw.employees[0].facilityTask.seatId;
    raw.employees[1].path = raw.employees[0].path;
    expect(() => deserializeGameState(JSON.stringify(raw), context)).toThrow(/gym break reservation/);
    const quote = JSON.parse(serializeGameState(state)); quote.employees[0].facilityTask.roomUpgradeBreakBenefit.moraleGain = 99;
    expect(() => deserializeGameState(JSON.stringify(quote), context)).toThrow(/break benefit/);
    const replay = JSON.parse(serializeGameState(state)); replay.employees[0].lastBreakAtFacilityTick = replay.facilityTick;
    expect(() => deserializeGameState(JSON.stringify(replay), context)).toThrow(/gym break contract/);
  });
  it("retains a blocked gym employee at the native contact, then uses the approved exit after access returns", () => {
    let state = gymFixture(5);
    while (state.employees[0]!.pathIndex < state.employees[0]!.path.length - 1) supportMinutes(state, 1);
    const location = { ...state.employees[0]!.location }, doors = state.doors.filter(door => door.roomId === gym(state).id), morale = state.employees[0]!.morale;
    state.doors = state.doors.filter(door => door.roomId !== gym(state).id);
    supportMinutes(state, 1); state = reload(state); supportMinutes(state, 5);
    expect(state.employees[0]!.location).toEqual(location); expect(state.employees[0]!.facilityTask).toBeNull();
    state.doors.push(...doors); supportMinutes(state, 1);
    expect(state.employees[0]!.path.some(point => !Number.isInteger(point.x) || !Number.isInteger(point.y))).toBe(true);
    expect(state.employees[0]!.morale).toBe(morale); expect(state.employees[0]!.lastBreakAtFacilityTick).toBeNull();
  });
  it("interrupts and refunds no use award on sale or firing, and payroll continues during real travel/work", () => {
    let state = gymFixture(5); supportMinutes(state, 15);
    const baseline = state.employees[0]!.morale, id = gym(state).id;
    state = gameReducer(state, { type: "SELL_ROOM", operationId: "m3.sell.gym", roomId: id }, context);
    expect(state.employees[0]!.facilityTask).toBeNull(); state = reload(state); supportMinutes(state, 80);
    expect(state.employees[0]!.morale).toBe(baseline); expect(state.employees[0]!.lastBreakAtFacilityTick).toBeNull();
    state = gymFixture(5); state = fullTicks(state, 20);
    expect(state.totalOperatingExpenses).toBeGreaterThan(0);
    const employeeId = state.employees[0]!.id;
    state = gameReducer(state, { type: "FIRE_EMPLOYEE", operationId: "m3.fire", employeeId }, context);
    expect(state.employees).toHaveLength(0); expect(state.departingEmployees!.every(employee => !employee.facilityTask)).toBe(true);
    expect(reload(state).employees).toHaveLength(0);
  });
});

describe("Approved support-door routing", () => {
  it.each(["room.indoor_garden", "room.staff_gym"])("binds every perimeter door to both permanent %s contacts", definitionId => {
    const state = createLevelFiveStateQaState("rooms", context), room = state.rooms.find(room => room.roomDefinitionId === definitionId)!;
    for (let x = room.x - 1; x <= room.x + 4; x++) for (let y = room.y - 1; y <= room.y + 4; y++) {
      if (x >= room.x && x < room.x + 4 && y >= room.y && y < room.y + 4 || state.rooms.some(other => other.x === x && other.y === y)) continue;
      state.rooms.push({ id: `route.hall.${x}.${y}`, roomDefinitionId: "room.hallway", x, y, orientation: 0, doorSide: null, upgradeLevel: 1 });
    }
    const contacts = definitionId === "room.indoor_garden" ? ["leftSeat", "rightSeat"] : ["benchSeat", "stretchSpot"];
    for (const side of ["north", "south", "west", "east"] as const) for (let offset = 0; offset < 4; offset++) {
      state.doors = state.doors.filter(door => door.roomId !== room.id);
      const doorId = `route.${side}.${offset}`; state.doors.push({ id: doorId, roomId: room.id, side, offset, exterior: false });
      for (const contact of contacts) {
        const route = findLevelFiveSupportPath(state, room, contact, { x: room.x, y: 21 }, context);
        expect(route, `${definitionId} ${side}${offset} ${contact}`).toBeTruthy();
        expect(route!.doorId).toBe(doorId); expect(route!.path.at(-1)).toEqual(getLevelFiveSupportTarget(room, contact));
      }
    }
  });
});

describe("Integrated support preview/save behavior", () => {
  it("runs both actual support tasks through the full reducer while inspection and unrelated mechanics remain dormant", () => {
    let state = createLevelFiveStateQaState("support", context);
    state = fullTicks(state, 65); state = reload(state); state = fullTicks(state, 10);
    expect(Object.values(state.encounters).filter(encounter => encounter.gardenVisitBenefit)).toHaveLength(2);
    expect(state.employees.some(employee => employee.lastBreakAtFacilityTick !== null)).toBe(true);
    expect(state.levelFive!.management.round).toBeNull(); expect(state.levelFive!.progress.inspectionUnlocked).toBeNull();
    expect(state.clinicalXp).toBe(1999); expect(Object.values(state.learningHistories).every(history => history.reviews.length === 0)).toBe(true);
    expect(state.serviceIncomeReceipts).toHaveLength(0); expect(state.levelFive!.inspection.status).toBe("locked");
  });
});
