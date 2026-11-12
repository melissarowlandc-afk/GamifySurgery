import { describe, expect, it } from "vitest";
import { APPROVED_LEVEL5_SUPPORT_ROUTES, PROTOTYPE_BALANCE_RELEASE } from "@gamify-surgery/balance-config";
import { advanceRetailOperations, cancelRetailTripsForActor, createInitialGameState, deserializeGameState, gameReducer, getCurrentCapabilities, giftContactLocation,
  getRoomResaleValue, getActiveExecutiveTerms, serializeGameState, startRetailPurchase, type GameState, type GridPoint } from "../src";
import { createLevelFiveStateQaContext, createLevelFiveStateQaState } from "../../../tests/fixtures/level-five-state";
import { addGiftQaVisitor } from "../../../tests/fixtures/level-five-gift-retail";

const context = createLevelFiveStateQaContext(), SHOP = "room.qa.level5.gift";
let seq = 0;
function initial(tier = 1): GameState {
  const state = createLevelFiveStateQaState("gift", context);
  state.rooms.find(r => r.id === SHOP)!.upgradeLevel = tier as 1 | 2 | 3 | 4 | 5;
  state.giftRetailDemand!.nextOpportunityAtFacilityTick = Number.MAX_SAFE_INTEGER;
  state.nextExternalRetailOpportunityTick = Number.MAX_SAFE_INTEGER;
  state.retailNextOpportunityTicks = Object.fromEntries(["founder:founder", ...state.employees.map(e => `employee:${e.id}`)].map(id => [id, Number.MAX_SAFE_INTEGER]));
  return state;
}
function retailTick(state: GameState, count = 1): GameState {
  for (let i = 0; i < count; i++) { state.facilityTick++; advanceRetailOperations(state, context); }
  return state;
}
function tick(state: GameState, count = 1): GameState {
  for (let i = 0; i < count; i++) state = gameReducer({ ...state, paused: false }, { type: "ADVANCE_TICK", operationId: `m5.tick.${seq++}`, advancedAtRealMs: 0 }, context);
  return state;
}
const reload = (state: GameState) => deserializeGameState(serializeGameState(state), context);
function start(state: GameState, id: string, premium = false, giftOnly = true, location?: GridPoint): string | null {
  addGiftQaVisitor(state, id, giftOnly, location);
  return startRetailPurchase(state, premium ? "income.gift_shop_premium" : "income.gift_shop", "retail_visitor", id, context);
}
function purchasing(state: GameState): GameState {
  for (let i = 0; i < 100 && state.retailOperations[0]?.status !== "purchasing"; i++) retailTick(state);
  expect(state.retailOperations[0]?.status).toBe("purchasing");
  return state;
}
const receipts = (state: GameState) => state.serviceIncomeReceipts.filter(r => r.incomeLineId.startsWith("income.gift_shop"));

describe("Level 5 M5 gift checkout and frozen money", () => {
  it.each([1, 2, 3, 4, 5])("dispenses normal and premium gifts at shop tier %i with one cent-exact receipt", tier => {
    for (const premium of [false, true]) {
      const state = initial(tier), cash = state.cashCents;
      const id = start(state, `shopper.${tier}.${premium}`, premium);
      expect(id).toBeTruthy();
      const trip = state.retailOperations[0]!;
      const gross = Math.round((premium ? 25 : 15) * (1 + .06 * (tier - 1)) * 100);
      expect(trip.quoteGross * 100).toBeCloseTo(gross, 8);
      expect(trip.roomUpgradeRevenue?.boundRoom?.roomInstanceId).toBe(SHOP);
      purchasing(state);
      expect(receipts(state)).toHaveLength(0);
      retailTick(state, 1); expect(receipts(state)).toHaveLength(0);
      retailTick(state, 1);
      expect(receipts(state)).toHaveLength(1);
      expect(receipts(state)[0]).toMatchObject({ grossAmount: gross / 100, stockCost: premium ? 12 : 6, netCashDelta: (gross - (premium ? 1200 : 600)) / 100 });
      expect(state.cashCents).toBe(cash + gross - (premium ? 1200 : 600));
      const restored = retailTick(reload(state), 120);
      expect(receipts(restored)).toHaveLength(1);
      expect(restored.cashCents).toBe(state.cashCents);
      expect(restored.retailExternalActors.find(a => a.id === trip.actorId)?.lifecycle).toBe("departed");
    }
  });
  it("retains an accepted shop price across a real upgrade and reload", () => {
    let state = initial(); start(state, "frozen"); retailTick(state, 2);
    const accepted = structuredClone(state.retailOperations[0]);
    state = gameReducer(state, { type: "UPGRADE_ROOM", operationId: "gift.upgrade", roomId: SHOP }, context);
    expect(state.operationReceipts["gift.upgrade"]?.status).toBe("applied");
    state = reload(state);
    expect(state.retailOperations[0]?.roomUpgradeRevenue).toEqual(accepted!.roomUpgradeRevenue);
    retailTick(state, 100);
    expect(receipts(state)[0]?.grossAmount).toBe(15);
    start(state, "later"); retailTick(state, 100);
    expect(receipts(state).map(r => r.grossAmount)).toEqual([15, 15.9]);
  });
  it("reloads a shopper already at the counter without a stale aisle-wait marker", () => {
    let state = initial();
    const shop = state.rooms.find(room => room.id === SHOP)!;
    expect(start(state, "at-counter", false, true, giftContactLocation(shop, "pay"))).toBeTruthy();
    retailTick(state);
    expect(state.retailOperations[0]?.status).toBe("queued");
    state = reload(state);
    expect(state.retailOperations[0]?.giftCheckout).not.toHaveProperty("aisleWaiting");
    retailTick(state, 100);
    expect(receipts(state)).toHaveLength(1);
    expect(() => reload(state)).not.toThrow();
  });
  it("tests the final quote against $20/$30/$40 and money already spent", () => {
    const state = initial(5);
    expect(start(state, "ordinary", true, false)).toBeNull(); // $31 > $30
    expect(start(state, "gift-only", true)).toBeTruthy(); // $31 <= $40
    const employee = state.employees[0]!;
    employee.path = [{ x: 35, y: 29 }]; employee.pathIndex = 0; employee.location = employee.path[0]!; employee.facilityTask = null;
    state.retailActorLedgers[`employee:${employee.id}`] = { dayNumber: 0, foodDayNumber: 0, discretionarySpent: 5, foodDrinkPurchases: 1, giftSupplyPurchases: 0, lastTripAtFacilityTick: null };
    expect(startRetailPurchase(state, "income.gift_shop", "employee", employee.id, context)).toBeNull(); // $5 + $18.60 > $20
    state.retailActorLedgers[`employee:${employee.id}`]!.discretionarySpent = 0;
    expect(startRetailPurchase(state, "income.gift_shop_premium", "employee", employee.id, context)).toBeNull();
    expect(startRetailPurchase(state, "income.gift_shop", "employee", employee.id, context)).toBeTruthy();
  });
  it("uses eligible idle employees and rejects working staff and linked pediatric parents", () => {
    const state = initial(), employee = state.employees[0]!;
    employee.location = { x: 35, y: 29 }; employee.path = [employee.location]; employee.pathIndex = 0;
    employee.facilityTask = { kind: "refill_water", startedAtFacilityTick: state.facilityTick, workMinutesRemaining: 2 };
    expect(startRetailPurchase(state, "income.gift_shop", "employee", employee.id, context)).toBeNull();
    employee.facilityTask = null;
    expect(startRetailPurchase(state, "income.gift_shop", "employee", employee.id, context)).toBeTruthy();
    const parent = addGiftQaVisitor(state, "parent"); parent.kind = "companion"; delete parent.giftOnlyVisit;
    state.pediatricFamilies = { family: { version: "pediatric-family.v1", id: "family", child: { kind: "encounter", id: "child" }, parentActorId: parent.id, phase: "waiting", reservation: null } };
    expect(startRetailPurchase(state, "income.gift_shop", "companion", parent.id, context)).toBeNull();
  });
  it("returns idle adult staff to their original protected care-room home after checkout", () => {
    let state = createLevelFiveStateQaState("executive-visits", context);
    state.giftRetailDemand = { version: "gift-retail-demand.v1", nextOpportunityAtFacilityTick: Number.MAX_SAFE_INTEGER, opportunitySequence: 0 };
    state.nextExternalRetailOpportunityTick = Number.MAX_SAFE_INTEGER;
    state.retailNextOpportunityTicks = Object.fromEntries(["founder:founder", ...state.employees.map(e => `employee:${e.id}`)].map(id => [id, Number.MAX_SAFE_INTEGER]));
    const employee = state.employees.find(e => e.staffRoleDefinitionId === "staff.app")!;
    const home = { x: 24, y: 25 };
    employee.location = home; employee.path = [home]; employee.pathIndex = 0; employee.facilityTask = null;
    expect(startRetailPurchase(state, "income.gift_shop", "employee", employee.id, context)).toBeTruthy();
    retailTick(state, 150);
    expect(state.retailOperations[0]?.status).toBe("completed");
    expect(state.employees.find(e => e.id === employee.id)?.location).toEqual(home);
    expect(receipts(state)).toHaveLength(1);
    state = reload(state);
    expect(state.retailOperations[0]?.giftCheckout).not.toHaveProperty("returnBlocked");
  });
  it("records founder stock consumption with $0 gross and no duplicate after reload", () => {
    let state = initial(5); state.environment.founderActivity = null; state.environment.founderLocation = { x: 35, y: 21 };
    const cash = state.cashCents;
    expect(startRetailPurchase(state, "income.gift_shop", "founder", "founder", context)).toBeTruthy();
    retailTick(state, 80);
    expect(receipts(state)).toEqual([expect.objectContaining({ actorKind: "founder", grossAmount: 0, stockCost: 6, netCashDelta: -6 })]);
    expect(state.cashCents).toBe(cash - 600);
    state = retailTick(reload(state), 20); expect(receipts(state)).toHaveLength(1);
  });
  it("requires stock cash at acceptance and dispensing, without earning an unfinished sale", () => {
    let state = initial(); state.cashCents = 599; state.cash = 5.99;
    expect(start(state, "no-stock")).toBeNull(); expect(receipts(state)).toHaveLength(0);
    state = initial(); start(state, "cash-lost"); purchasing(state);
    state.cashCents = 0; state.cash = 0; retailTick(state, 100);
    expect(receipts(state)).toHaveLength(0); expect(state.cashCents).toBe(0);
    expect(state.retailOperations[0]?.giftCheckout?.contactId).toBeNull();
    expect(state.retailExternalActors.find(a => a.id === "cash-lost")?.lifecycle).toBe("departed");
  });
  it("reserves the pay contact plus two distinct queue places, rejects a fourth, and reloads them intact", () => {
    let state = initial();
    for (const id of ["first", "second", "third"]) expect(start(state, id)).toBeTruthy();
    expect(start(state, "fourth")).toBeNull();
    expect(state.retailOperations.map(o => o.giftCheckout?.contactId)).toEqual(["pay", "queue1", "queue2"]);
    const frozen = structuredClone(state.retailOperations); state = reload(state);
    expect(state.retailOperations.map(o => o.giftCheckout)).toEqual(frozen.map(o => o.giftCheckout));
    retailTick(state, 200);
    expect(state.retailOperations.every(o => o.giftCheckout?.contactId === null)).toBe(true);
    expect(receipts(state).length).toBeGreaterThan(0);
    expect(new Set(receipts(state).map(r => r.transactionKey)).size).toBe(receipts(state).length);
  });
  it("releases a blocked queue, holds the actual native cursor across reload, and exits when access returns", () => {
    let state = initial(); start(state, "blocked"); purchasing(state);
    const doors = structuredClone(state.doors);
    state.doors = state.doors.filter(d => d.roomId !== SHOP);
    retailTick(state);
    const held = structuredClone(state.retailOperations[0]!);
    expect(held.giftCheckout).toMatchObject({ contactId: null, returnBlocked: true });
    expect(receipts(state)).toHaveLength(0);
    state = reload(state); retailTick(state, 10);
    expect(state.retailOperations[0]?.location).toEqual(held.location);
    expect(state.retailOperations[0]?.pathIndex).toBe(held.pathIndex);
    state.doors = doors; retailTick(state, 120);
    expect(state.retailExternalActors.find(a => a.id === "blocked")?.lifecycle).toBe("departed");
    expect(receipts(state)).toHaveLength(0);
  });
  it("clears a blocked-return marker when required work takes over the shopper's movement", () => {
    let state = initial();
    const employee = state.employees[0]!;
    employee.location = { x: 35, y: 29 }; employee.path = [employee.location]; employee.pathIndex = 0;
    expect(startRetailPurchase(state, "income.gift_shop", "employee", employee.id, context)).toBeTruthy();
    purchasing(state);
    state.doors = state.doors.filter(d => d.roomId !== SHOP);
    retailTick(state);
    expect(state.retailOperations[0]?.giftCheckout?.returnBlocked).toBe(true);
    cancelRetailTripsForActor(state, "employee", employee.id, "Required work takes over.");
    expect(state.retailOperations[0]?.status).toBe("cancelled");
    state = reload(state);
    expect(state.retailOperations[0]?.giftCheckout).toMatchObject({ contactId: null });
    expect(state.retailOperations[0]?.giftCheckout).not.toHaveProperty("returnBlocked");
    expect(receipts(state)).toHaveLength(0);
  });
  it("cancels an unpaid real shop sale and lets its customer leave safely", () => {
    let state = initial(); start(state, "sold"); purchasing(state);
    const cash = state.cashCents, refund = getRoomResaleValue(state, SHOP, context)! * 100;
    state = gameReducer(state, { type: "SELL_ROOM", operationId: "gift.sale", roomId: SHOP }, context);
    expect(state.operationReceipts["gift.sale"]?.status).toBe("applied");
    expect(state.cashCents).toBe(cash + refund); expect(state.retailOperations[0]?.giftCheckout?.contactId).toBeNull();
    state = retailTick(reload(state), 160);
    expect(receipts(state)).toHaveLength(0);
    expect(state.retailExternalActors.find(a => a.id === "sold")?.lifecycle).toBe("departed");
  });
  it("freezes actual Executive stock terms through firing/load and records the reduction once", () => {
    let state = createLevelFiveStateQaState("gift-suppliers", context);
    const executive = state.employees.find(e => e.staffRoleDefinitionId === "staff.executive")!; executive.trainingLevel = 5;
    state.rooms = state.rooms.filter(r => r.roomDefinitionId !== "room.staff_gym"); state.doors = state.doors.filter(d => state.rooms.some(r => r.id === d.roomId));
    state.giftRetailDemand!.nextOpportunityAtFacilityTick = Number.MAX_SAFE_INTEGER;
    state.nextExternalRetailOpportunityTick = Number.MAX_SAFE_INTEGER;
    state.retailNextOpportunityTicks = Object.fromEntries(["founder:founder", ...state.employees.map(e => `employee:${e.id}`)].map(id => [id, Number.MAX_SAFE_INTEGER]));
    for (let i = 0; i < 150 && !getActiveExecutiveTerms(state, context); i++) state = tick(state);
    expect(getActiveExecutiveTerms(state, context)?.effects.supplierReductionPercent).toBe(2);
    start(state, "supplier-premium", true);
    expect(state.retailOperations[0]?.quoteStockCost).toBe(11.76);
    const quote = structuredClone(state.retailOperations[0]?.executiveStock);
    state = gameReducer(state, { type: "FIRE_EMPLOYEE", operationId: "supplier.fire", employeeId: executive.id }, context);
    state = reload(state); expect(state.retailOperations[0]?.executiveStock).toEqual(quote);
    const priorSaved = state.levelFive!.management.supplierSavings.stockCents;
    retailTick(state, 100);
    expect(receipts(state)).toEqual([expect.objectContaining({ grossAmount: 25, stockCost: 11.76, netCashDelta: 13.24 })]);
    expect(state.levelFive!.management.supplierSavings.stockCents - priorSaved).toBe(24);
    state = retailTick(reload(state), 20); expect(state.levelFive!.management.supplierSavings.stockCents - priorSaved).toBe(24);
  });
  it.each(["walking_to_outlet", "queued", "purchasing", "leaving"] as const)("preserves the exact accepted %s clock/quote/cursor through repeated reloads", status => {
    let state = initial(); start(state, `reload.${status}`);
    for (let i = 0; i < 110 && state.retailOperations[0]?.status !== status; i++) retailTick(state);
    expect(state.retailOperations[0]?.status).toBe(status);
    for (let i = 0; i < 3; i++) {
      const before = structuredClone(state.retailOperations[0]); const clock = structuredClone(state.giftRetailDemand);
      state = reload(state); expect(state.retailOperations[0]).toEqual(before); expect(state.giftRetailDemand).toEqual(clock);
    }
  });
  it.each(["version", "contact", "duration", "cursor", "room", "price", "duplicate"])("rejects corrupt marked %s without silently dropping the quote", defect => {
    const state = initial(); start(state, "invalid"); const raw = JSON.parse(serializeGameState(state)); const trip = raw.retailOperations[0];
    if (defect === "version") trip.giftCheckout.version = "gift-checkout.v2";
    if (defect === "contact") trip.giftCheckout.contactId = "shelf";
    if (defect === "duration") trip.outletDurationMinutes = 1;
    if (defect === "cursor") trip.pathIndex = trip.path.length;
    if (defect === "room") trip.outletRoomInstanceId = "somewhere-else";
    if (defect === "price") trip.quoteGross = 999;
    if (defect === "duplicate") raw.retailOperations.push({ ...trip, id: "duplicate", actorId: "other" });
    expect(() => deserializeGameState(JSON.stringify(raw), context)).toThrow();
  });
});

describe("M5 independent demand and approved approaches", () => {
  it.each(APPROVED_LEVEL5_SUPPORT_ROUTES["room.gift_shop"].filter(r => r.targetId === "pay"))("reaches the actual counter through $doorSegment with the approved knots", route => {
    let state = initial();
    const ring = [[33,17],[33,18],[33,19],[33,20],[34,17],[35,17],[36,17],[37,17],[37,18],[37,19],[37,20]];
    for (const [x,y] of ring) state = gameReducer(state, { type: "PLACE_ROOM", operationId: `ring.${x}.${y}`, roomId: `gift.ring.${x}.${y}`, roomDefinitionId: "room.hallway", x: x!, y: y!, orientation: 0 }, context);
    state = gameReducer(state, { type: "REMOVE_DOOR", operationId: "gift.old-door", doorId: "door.room.qa.level5.gift" }, context);
    const side = ({N:"north",S:"south",W:"west",E:"east"} as const)[route.doorSegment[0] as "N"|"S"|"W"|"E"];
    state = gameReducer(state, { type: "PLACE_DOOR", operationId: "gift.native-door", doorId: "gift.native-door", roomId: SHOP, side,
      offset: side === "north" || side === "south" ? Number(route.doorSegment[1])-1 : route.doorSegment.charCodeAt(1)-65 }, context);
    expect(state.operationReceipts["gift.native-door"]?.status).toBe("applied");
    start(state, `door.${route.doorSegment}`);
    expect(state.retailOperations[0]?.path.slice(-route.logicalPath.length)).toEqual(route.logicalPath.map(p => ({x:34+p[0]!,y:18+p[1]!})));
    retailTick(state, 180); expect(receipts(state)).toHaveLength(1);
  });
  it("creates one normal gift opportunity at 120-minute facility cadence without changing the shared stream", () => {
    let state = initial(); state.giftRetailDemand!.nextOpportunityAtFacilityTick = state.facilityTick + 120;
    const shared = state.externalRetailSequence;
    retailTick(state, 119); expect(state.retailExternalActors.filter(a => a.giftOnlyVisit)).toHaveLength(0);
    retailTick(state); expect(state.retailExternalActors.filter(a => a.giftOnlyVisit)).toHaveLength(1);
    expect(state.retailOperations[0]?.incomeLineId).toBe("income.gift_shop");
    state = reload(state); retailTick(state, 119); expect(state.giftRetailDemand?.opportunitySequence).toBe(1);
    retailTick(state); expect(state.giftRetailDemand?.opportunitySequence).toBe(2);
    expect(state.externalRetailSequence).toBe(shared);
    expect(state.clinicalXp).toBe(1999); expect(state.levelFive!.progress.inspectionUnlocked).toBeNull();
  });
  it("preserves an overdue gift opportunity on load and skips blocked access without a paid sale", () => {
    let state = initial(); state.giftRetailDemand!.nextOpportunityAtFacilityTick = state.facilityTick - 1;
    state.doors = state.doors.filter(d => d.roomId !== SHOP);
    state = reload(state); expect(state.giftRetailDemand!.nextOpportunityAtFacilityTick).toBe(state.facilityTick - 1);
    retailTick(state); expect(state.giftRetailDemand!.opportunitySequence).toBe(1);
    expect(state.retailOperations).toHaveLength(0); expect(receipts(state)).toHaveLength(0);
  });
  it.each([0, 1, 2, 3, 4] as const)("leaves ordinary Level %i saves without gift state or purchases", level => {
    let state = createInitialGameState(); state.facilityLevel = level;
    state = deserializeGameState(serializeGameState(state));
    expect(state).not.toHaveProperty("giftRetailDemand"); expect(state).not.toHaveProperty("levelFive");
    expect(getCurrentCapabilities(state).has("capability.gift_shop")).toBe(false);
    expect(PROTOTYPE_BALANCE_RELEASE.facility.maximumPlayableLevel).toBe(5);
  });
});
