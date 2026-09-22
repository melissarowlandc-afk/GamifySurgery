import { describe, expect, it } from "vitest";
import { getServiceIncomeLine, SERVICE_INCOME_CATALOG } from "./service-income-catalog";

describe("service income retail contracts", () => {
  it.each([
    ["income.coffee", 5, 1, "room.coffee_kiosk", 2],
    ["income.kiosk_drink", 3, 1, "room.coffee_kiosk", 2],
    ["income.kiosk_snack", 4, 2, "room.coffee_kiosk", 2],
    ["income.vending_drink", 3, 1, "room.vending", 1],
    ["income.vending_snack", 4, 2, "room.vending", 1],
    ["income.gift_shop", 15, 6, "room.gift_shop", 2],
    ["income.gift_shop_premium", 25, 12, "room.gift_shop", 2],
    ["income.otc_supply", 12, 6, "room.pharmacy", 2],
    ["income.pharmacy_pickup", 25, 15, "room.pharmacy", 2],
  ])("freezes %s gross, stock cost, outlet, and fulfillment duration", (id, gross, cost, room, duration) => {
    const line = getServiceIncomeLine(id)!;
    expect(line.fee).toBe(gross);
    expect(line.retail).toMatchObject({ stockCost: cost, outlets: [expect.objectContaining({ roomDefinitionId: room, durationMinutes: duration })] });
  });

  it("allows authorized wound supplies through either the L3 pharmacy or L4 specialty clinic", () => {
    expect(getServiceIncomeLine("income.wound_supply")).toMatchObject({ minimumFacilityLevel: 3, fee: 20, retail: { stockCost: 10, category: "authorized_order" } });
    expect(getServiceIncomeLine("income.wound_supply")!.retail!.outlets.map((outlet) => outlet.roomDefinitionId)).toEqual(["room.pharmacy", "room.wound_ostomy"]);
  });

  it("contains no cafeteria and models onsite laboratory processing as a remote specimen work queue", () => {
    expect(SERVICE_INCOME_CATALOG.some((line) => line.id.includes("cafeteria"))).toBe(false);
    expect(getServiceIncomeLine("income.laboratory_processing")!.operation).toMatchObject({ visitorMode: "work_queue", phases: [{ durationMinutes: 60, staffRoleDefinitionIds: ["staff.laboratory_technician"] }] });
    expect(getServiceIncomeLine("income.xray")!.operation!.phases[0]!.durationMinutes).toBe(60);
  });
});
