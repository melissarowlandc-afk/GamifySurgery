import { describe, expect, it } from "vitest";
import { advanceRetailOperations, startRetailPurchase } from "../src";
import { createLevelFiveStateQaContext } from "../../../tests/fixtures/level-five-state";
import { createLevelFiveEconomyState } from "../../../tests/fixtures/level-five-economy";

describe("Level 5 gift return to the original fine care contact", () => {
  it("returns the founder to the actual pediatric couch contact without another payment or a blocked exit", () => {
    const context = createLevelFiveStateQaContext();
    const state = createLevelFiveEconomyState(context, { seed: "m8.fine-return" });
    // Synthetic starting pose is the real couch contact seen in the long-run
    // failure. Purchase, movement, dispensing, return and cash are production.
    const original = { x: 36, y: 25.3 };
    state.environment.founderLocation = { ...original };
    state.environment.founderActivity = null;
    state.nextExternalRetailOpportunityTick = Number.MAX_SAFE_INTEGER;
    state.giftRetailDemand = { version: "gift-retail-demand.v1", opportunitySequence: 0, nextOpportunityAtFacilityTick: Number.MAX_SAFE_INTEGER };
    state.retailNextOpportunityTicks["founder:founder"] = Number.MAX_SAFE_INTEGER;
    for (const employee of state.employees) state.retailNextOpportunityTicks[`employee:${employee.id}`] = Number.MAX_SAFE_INTEGER;
    const cash = state.cashCents;
    const id = startRetailPurchase(state, "income.gift_shop", "founder", "founder", context);
    expect(id).not.toBeNull();
    const trip = state.retailOperations.find(row => row.id === id)!;
    for (let minute = 0; minute < 160 && trip.status !== "completed"; minute++) { state.facilityTick++; advanceRetailOperations(state, context); }
    expect(trip.status).toBe("completed");
    expect(trip.giftCheckout?.returnBlocked).toBeUndefined();
    expect(state.environment.founderLocation).toEqual(original);
    const receipts = state.serviceIncomeReceipts.filter(receipt => receipt.actorKind === "founder");
    expect(receipts).toHaveLength(1);
    expect(receipts[0]).toMatchObject({ grossAmount: 0, stockCost: 6, netCashDelta: -6 });
    expect(state.cashCents).toBe(cash - 600);
  });
});
