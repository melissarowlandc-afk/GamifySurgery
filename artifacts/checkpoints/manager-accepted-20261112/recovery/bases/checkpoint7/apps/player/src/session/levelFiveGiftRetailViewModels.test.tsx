import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { advanceRetailOperations, gameReducer, deserializeGameState, serializeGameState, createInitialGameState, PROTOTYPE_DOMAIN_CONTEXT } from "@gamify-surgery/game-domain";
import { createLevelFiveStateQaContext, createLevelFiveStateQaState } from "../../../../tests/fixtures/level-five-state";
import { addGiftQaVisitor } from "../../../../tests/fixtures/level-five-gift-retail";
import { prepareLevelFiveQaProfile } from "../../../../tools/qa/level-five-state-bootstrap";
import { createFreshProfile } from "./prototypeStorage";
import { createPrototypePlayerView } from "./viewModels";
import { describeFacilityCharacter } from "./characterActivityPresentation";
import { ServiceIncomePanel } from "../ui/ServiceIncomePanel";
import { MoneyPanel } from "../ui/MoneyPanel";
import { MobileServices } from "../mobile/manage/MobileServices";
import { MobileMoney } from "../mobile/manage/MobileMoney";
import { phoneTestDom, cleanupPhoneTests, noop } from "../mobile/screenTestUtils";
import { startRetailPurchase } from "@gamify-surgery/game-domain";

const original = PROTOTYPE_DOMAIN_CONTEXT.balanceRelease, context = createLevelFiveStateQaContext();
afterEach(async () => { await cleanupPhoneTests(); PROTOTYPE_DOMAIN_CONTEXT.balanceRelease = original; vi.restoreAllMocks(); });
function fixture(tier = 1) {
  PROTOTYPE_DOMAIN_CONTEXT.balanceRelease = context.balanceRelease;
  const state = createLevelFiveStateQaState("gift", context);
  state.rooms.find(r=>r.roomDefinitionId === "room.gift_shop")!.upgradeLevel=tier as 1|2|3|4|5;
  return state;
}
describe("M5 shared shop facts, desktop and compact phone", () => {
  it.each([1,2,3,4,5])("shows actual tier %i fees/stock in both Services shells", async tier => {
    const state = fixture(tier), view = createPrototypePlayerView(state,null,false,null);
    const normal = view.serviceIncome.catalogLines.find(l=>l.id === "income.gift_shop")!;
    expect(normal.available).toBe(true); expect(normal.feeLabel).toBe(["$15.00","$15.90","$16.80","$17.70","$18.60"][tier-1]);
    expect(normal.stockCostLabel).toBe("$6.00"); expect(normal.scheduled).toBe(false);
    const desktop=renderToStaticMarkup(<ServiceIncomePanel serviceIncome={view.serviceIncome} onAppointmentsEnabledChange={noop} onStartLaboratoryProcessing={noop} />);
    expect(desktop).toContain(view.serviceIncome.giftShop!.normalLabel); expect(desktop).toContain("120 game min per facility");
    const dom=phoneTestDom(); await dom.render(<MobileServices view={view.serviceIncome} onAppointmentsEnabledChange={noop} onStartLaboratoryProcessing={noop} onSetupAction={noop} />);
    expect(dom.element.textContent).not.toContain("$20 staff/founder per day"); // root stays compact
    await dom.click("Service details for Gift");
    expect(dom.element.textContent).toContain(view.serviceIncome.giftShop!.normalLabel);
    expect(dom.element.textContent).toContain("2 min at the counter");
    expect(dom.element.textContent).toContain("$40 gift-only visitor");
    expect(dom.element.textContent).not.toContain("Turn on appointments");
  });
  it("binds counter and two queue supports in the common map and gives each shopper a truthful activity label", () => {
    const state=fixture(), seeded=createLevelFiveStateQaState("gift-queue",context);
    for(let minute=0;minute<70;minute++) { seeded.facilityTick++; advanceRetailOperations(seeded,context);
      const view=createPrototypePlayerView(seeded,null,false,null);
      for(const trip of seeded.retailOperations.filter(t=>["queued","purchasing"].includes(t.status))) {
        const actor=trip.actorKind === "founder" ? view.facility.founder : trip.actorKind === "employee" ? view.facility.staff.find(a=>a.instanceId === trip.actorId)!
          : view.facility.retailExternalActors!.find(a=>a.instanceId === trip.actorId)!;
        expect(actor).toBeDefined();
        expect(actor.supportRole).toBe("gift-shop-contact"); expect(actor.supportId).toBe(trip.giftCheckout!.contactId);
        expect(actor.supportRoomInstanceId).toBe("room.qa.level5.gift");
      }
    }
    const view=createPrototypePlayerView(state,null,false,null);
    expect(view.serviceIncome.giftShop!.checkoutLabel).toContain("0/2 in line");
    const active=seeded.retailOperations.find(t=>!['completed','abandoned','cancelled'].includes(t.status));
    if(active) expect(describeFacilityCharacter(seeded,{kind:"retail-visitor",id:active.actorId})!.activity).toMatch(/Gift Shop|gift checkout/);
  });
  it("opens a one-tap Gift Shop Money tile with receipt gross/stock/net and founder consumption in both shells", async () => {
    const state=fixture(); state.giftRetailDemand!.nextOpportunityAtFacilityTick=Number.MAX_SAFE_INTEGER;
    state.nextExternalRetailOpportunityTick=Number.MAX_SAFE_INTEGER;
    state.retailNextOpportunityTicks=Object.fromEntries(["founder:founder",...state.employees.map(e=>`employee:${e.id}`)].map(id=>[id,Number.MAX_SAFE_INTEGER]));
    const actor=addGiftQaVisitor(state,"money.gift"); expect(startRetailPurchase(state,"income.gift_shop","retail_visitor",actor.id,context)).toBeTruthy();
    for(let i=0;i<80;i++){state.facilityTick++;advanceRetailOperations(state,context);}
    const view=createPrototypePlayerView(state,null,false,null);
    expect(view.serviceIncome.giftShop).toMatchObject({purchaseCount:1,grossLabel:"$15.00",stockLabel:"$6.00",netLabel:"$9.00"});
    const desktop=renderToStaticMarkup(<MoneyPanel serviceIncome={view.serviceIncome} />);
    expect(desktop).toContain("Gift Shop · $9.00 after stock"); expect(desktop).toContain("$15.00 / $6.00 / $9.00");
    const dom=phoneTestDom(); await dom.render(<MobileMoney view={view.serviceIncome} resourceBar={view.resourceBar} advertising={view.advertising} onAdvertisingLevelChange={noop} />);
    expect(dom.element.textContent).toContain("Gift Shop"); expect(dom.element.textContent).not.toContain("Recorded gross / stock / net");
    await dom.click("Gift Shop sales"); expect(dom.element.textContent).toContain("$15.00 / $6.00 / $9.00"); expect(dom.element.textContent).toContain("Founder purchases earn $0 gross");
    await dom.click("Back to money"); expect(dom.element.textContent).not.toContain("Recorded gross / stock / net");
  });
  it("shows frozen supplier stock and actual self-service countdown, including adult age/sex", () => {
    let state=fixture();
    state=gameReducer({...state,paused:false},{type:"ADVANCE_TICK",operationId:"gift.view.arrival"},context);
    for(let i=0;i<100 && !state.retailOperations.some(t=>t.status === "purchasing");i++) { state.facilityTick++;advanceRetailOperations(state,context); }
    const view=createPrototypePlayerView(state,null,false,null);
    const operation=view.serviceIncome.activeOperations.find(o=>o.incomeLineId === "income.gift_shop" && o.statusLabel.includes("checkout"))!;
    expect(operation).toBeDefined(); expect(operation.statusLabel).toContain("2 min remaining");
    expect(operation.actorLabel).toMatch(/\d+, (Female|Male) · Gift shopper/); expect(operation.quoteFeeLabel).toBe("$15.00 gross · $6.00 stock");
    expect(operation.providerLabel).toBe("Self-service checkout");
    const before=structuredClone(view.serviceIncome); state=deserializeGameState(serializeGameState(state),context);
    expect(createPrototypePlayerView(state,null,false,null).serviceIncome).toEqual(before);
  });
  it.each([0,1,2,3,4] as const)("keeps Level %i desktop and phone Money/Services exactly unchanged when no gift view exists", level => {
    const state=createInitialGameState();state.facilityLevel=level;const view=createPrototypePlayerView(state,null,false,null);
    expect(view.serviceIncome).not.toHaveProperty("giftShop");
    const desktop=renderToStaticMarkup(<MoneyPanel serviceIncome={view.serviceIncome}/>);
    const phone=renderToStaticMarkup(<MobileMoney view={view.serviceIncome} resourceBar={view.resourceBar} advertising={view.advertising} onAdvertisingLevelChange={noop}/>);
    expect(phone).not.toContain('data-money-tile="gifts"'); expect(desktop).not.toContain("gift-shop-facts");
  });
  it("adds all three isolated QA campaigns and resumes edited states without reseeding", () => {
    fixture(); let profile=createFreshProfile();
    for(const scenario of ["gift","gift-queue","gift-suppliers"] as const) profile=prepareLevelFiveQaProfile(profile,scenario);
    expect(profile.campaigns).toHaveLength(3);
    const selected=profile.campaigns.find(c=>c.campaignId.endsWith(".gift"))!;
    selected.state.cashCents=12345;selected.state.cash=123.45;
    const resumed=prepareLevelFiveQaProfile(profile,"gift");expect(resumed.campaigns.find(c=>c.campaignId===selected.campaignId)).toBe(selected);
    expect(resumed.campaigns.find(c=>c.campaignId===selected.campaignId)!.state.cashCents).toBe(12345);
    expect(selected.state.clinicalXp).toBe(1999);expect(selected.state.levelFive!.progress.inspectionUnlocked).toBeNull();
    expect(original.facility.maximumPlayableLevel).toBe(5);
  });
});
