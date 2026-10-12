import { describe, expect, it } from "vitest";
import { writeFileSync } from "node:fs";
import { gameReducer, deserializeGameState, serializeGameState, getClinicalCaseEligibilityIssue, getServiceIncomeTotalsCents, type GameState } from "../src";
import { createLevelFiveStateQaContext, createLevelFiveStateQaState } from "../../../tests/fixtures/level-five-state";

const context = createLevelFiveStateQaContext();
function advance(state: GameState, count: number, seed: string): GameState {
  for (let i = 0; i < count; i++) state = gameReducer({ ...state, paused:false }, { type:"ADVANCE_TICK", operationId:`${seed}.${state.facilityTick}`, advancedAtRealMs:0 }, context);
  return state;
}
function quiet(seed: string) {
  const state = createLevelFiveStateQaState("gift", context);
  state.campaignSeed = seed; state.nextExternalRetailOpportunityTick = Number.MAX_SAFE_INTEGER;
  state.giftRetailDemand!.nextOpportunityAtFacilityTick = state.facilityTick + 120;
  state.retailNextOpportunityTicks = Object.fromEntries(["founder:founder", ...state.employees.map(e => `employee:${e.id}`)].map(id => [id,Number.MAX_SAFE_INTEGER]));
  return state;
}
describe("M5 measured dedicated gift demand", () => {
  it("fulfills baseline normal demand profitably without Executive terms after four warmup / 48 measured hours", () => {
    let state = quiet("m5.gift-normal-measured");
    state = advance(state, 240, "gift.warmup");
    const baseline = getServiceIncomeTotalsCents(state), cash = state.cashCents, costs = Math.round(state.totalOperatingExpenses * 100);
    const openingSequence = state.giftRetailDemand!.opportunitySequence;
    const learning = structuredClone(state.learningHistories);
    state = advance(state, 2880, "gift.measured");
    const totals = getServiceIncomeTotalsCents(state);
    const gross = totals.grossCents - baseline.grossCents, stock = totals.stockCostCents - baseline.stockCostCents;
    const net = totals.netCashDeltaCents - baseline.netCashDeltaCents;
    expect(state.giftRetailDemand!.opportunitySequence - openingSequence).toBe(24);
    expect(gross).toBe(24 * 1500); expect(stock).toBe(24 * 600); expect(net).toBe(gross-stock);
    expect(net - 48*100).toBe(16800); // 24 x $9 contribution - 48 x $1 shop upkeep
    expect(state.cashCents-cash).toBe(net - (Math.round(state.totalOperatingExpenses*100)-costs));
    expect(state.levelFive!.management.activeTerms).toBeNull();
    expect(state.levelFive!.management.supplierSavings.stockCents).toBe(0);
    expect(state.clinicalXp).toBe(1999); expect(state.learningHistories).toEqual(learning);
    expect(new Set(state.serviceIncomeReceipts.map(r => r.transactionKey)).size).toBe(state.serviceIncomeReceipts.length);
    if (process.env.LEVEL5_M5_REPORT === "1") writeFileSync(new URL("../../../.local-dev/level5-m5/normal-demand.json", import.meta.url), JSON.stringify({
      seed:state.campaignSeed, warmupHours:4, measuredHours:48, opportunities:24, normalSales:24, grossCents:gross, stockCents:stock,
      contributionCents:net, shopUpkeepCents:4800, directShopNetCents:net-4800,
      allFacilityChargedOperatingCents:Math.round(state.totalOperatingExpenses*100)-costs, allFacilityCashDeltaCents:state.cashCents-cash,
      executiveTerms:false, supplierSavingsStockCents:0, scoredArrivals:false, optionalShopping:false, clinicalXpChange:0,
    },null,2)+"\n");
  }, 90000);
  it.each([false,true])("preserves exact scored cases, arrival ticks and eligible pool with gift-only demand on/off (optional shopping %s)", optionalShopping => {
    let on = quiet("m5.gift-clinical-independence"), off = structuredClone(on);
    if (optionalShopping) { on.retailNextOpportunityTicks={}; off.retailNextOpportunityTicks={}; }
    on.nextRoutineArrivalTick = on.facilityTick + 1; off.nextRoutineArrivalTick = off.facilityTick + 1;
    off.giftRetailDemand!.nextOpportunityAtFacilityTick = Number.MAX_SAFE_INTEGER;
    const selectedOn = new Map<string, unknown>(), selectedOff = new Map<string, unknown>();
    const observe = (state: GameState, rows: Map<string, unknown>) => {
      for (const encounter of Object.values(state.encounters)) if (encounter.arrivalClass === "routine") rows.set(encounter.id,
        { caseId:encounter.frozenCase.id, arrivalTick:encounter.waiting.arrivedAtTick, frozenCase:encounter.frozenCase });
    };
    const pool = (state: GameState) => context.clinicalRelease.cases.filter(c => getClinicalCaseEligibilityIssue(state,c,context)===null).map(c => c.id);
    expect(pool(on)).toEqual(pool(off));
    for (let minute=0; minute<1440; minute++) {
      on = advance(on,1,"gift.clinical"); off = advance(off,1,"gift.clinical"); observe(on,selectedOn); observe(off,selectedOff);
      if (minute===350) { on=deserializeGameState(serializeGameState(on),context); off=deserializeGameState(serializeGameState(off),context); }
    }
    expect(selectedOn.size).toBeGreaterThan(10); expect([...selectedOn]).toEqual([...selectedOff]);
    expect(on.nextRoutineArrivalTick).toBe(off.nextRoutineArrivalTick); expect(pool(on)).toEqual(pool(off));
    expect(on.clinicalXp).toBe(off.clinicalXp); expect(on.learningHistories).toEqual(off.learningHistories);
    expect(on.serviceIncomeReceipts.some(r=>r.incomeLineId === "income.gift_shop")).toBe(true);
    expect(off.retailExternalActors.some(a=>a.giftOnlyVisit)).toBe(false);
    if (process.env.LEVEL5_M5_REPORT === "1") writeFileSync(new URL(`../../../.local-dev/level5-m5/clinical-independence-${optionalShopping}.json`,import.meta.url), JSON.stringify({
      seed:on.campaignSeed, minutes:1440, optionalShopping, reloadAtMinute:351, scoredArrivals:selectedOn.size,
      exactFrozenCasesAndTicksEqual:true, eligibleCaseCount:pool(on).length, xpEqual:true, learningEqual:true,
      onGiftOpportunities:on.giftRetailDemand!.opportunitySequence, offGiftOpportunities:off.giftRetailDemand!.opportunitySequence,
      caseIds:[...selectedOn].map(([id,value])=>({id,...value as {caseId:string; arrivalTick:number},frozenCase:undefined})),
    },null,2)+"\n");
  }, 90000);
});
