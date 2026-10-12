import { describe, expect, it } from "vitest";
import source from "../../../apps/player/src/facility/level5/gift-shop.json";
import { APPROVED_LEVEL5_SUPPORT_ROUTES, LEVEL_FIVE_GIFT_RETAIL, PROTOTYPE_BALANCE_RELEASE, SERVICE_INCOME_CATALOG,
  getRoomUpgradeRevenueMultiplier } from "./index";

describe("M5 editorial gift retail contract", () => {
  it("keeps the catalog's normal/premium stock and duration, one shop and ordinary cap 5", () => {
    expect(LEVEL_FIVE_GIFT_RETAIL).toMatchObject({ arrivalCadenceMinutes: 120, checkoutMinutes: 2, queueCapacity: 2,
      recurringBudget: 20, ordinaryVisitorBudget: 30, visitorBudget: 40 });
    expect(SERVICE_INCOME_CATALOG.filter(line => line.id.startsWith("income.gift_shop"))).toEqual([
      expect.objectContaining({ fee: 15, minimumFacilityLevel: 5, retail: expect.objectContaining({ stockCost: 6,
        outlets: [{ roomDefinitionId: "room.gift_shop", requiredCapabilityIds: ["capability.gift_shop"], durationMinutes: 2 }] }) }),
      expect.objectContaining({ fee: 25, minimumFacilityLevel: 5, retail: expect.objectContaining({ stockCost: 12,
        outlets: [{ roomDefinitionId: "room.gift_shop", requiredCapabilityIds: ["capability.gift_shop"], durationMinutes: 2 }] }) }),
    ]);
    expect(PROTOTYPE_BALANCE_RELEASE.facility.maximumPlayableLevel).toBe(5);
    expect(PROTOTYPE_BALANCE_RELEASE.facility.roomDefinitions.find(r => r.id === "room.gift_shop")).toMatchObject({ width:3, height:3, maximumInstances:1,
      constructionCost:800, upkeepPerExpenseInterval:1, upkeepPerUpgradeLevel:0, capabilityIds:["capability.gift_shop"] });
  });
  it("adds percentages of base gross, without compound profit or stock arithmetic", () => {
    expect([1,2,3,4,5].map(t => Math.round(1500 * getRoomUpgradeRevenueMultiplier("room.gift_shop", t)))).toEqual([1500,1590,1680,1770,1860]);
    expect([1,2,3,4,5].map(t => Math.round(2500 * getRoomUpgradeRevenueMultiplier("room.gift_shop", t)))).toEqual([2500,2650,2800,2950,3100]);
  });
  it("takes all 36 exact counter/queue routes from the accepted M2 native data", () => {
    const expected = source.tiers[0]!.approachRoutes.filter((r: {openDoorSegments:string[]; targetId:string}) => r.openDoorSegments.length===1 && ["pay","queue1","queue2"].includes(r.targetId))
      .map((r: Record<string,unknown>) => Object.fromEntries(["doorSegment","targetId","logicalPath","walkingPath","seatingTransition"].map(k => [k,r[k]])));
    expect(APPROVED_LEVEL5_SUPPORT_ROUTES["room.gift_shop"]).toEqual(expected);
    expect(expected).toHaveLength(36);
  });
});
