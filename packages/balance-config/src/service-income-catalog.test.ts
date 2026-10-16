import { describe, expect, it } from "vitest";
import { APPROVED_CLINIC_PROCEDURE_WORK_CONTRACTS, getServiceIncomeForRoute, getServiceIncomeLine, SERVICE_INCOME_CATALOG } from "./service-income-catalog";

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
    ["income.pharmacy_pickup", 70, 15, "room.pharmacy", 2],
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

  it("keeps question fees separate from approved scheduled Endoscopy income and cadence", () => {
    expect(getServiceIncomeLine("income.endoscopy")).toMatchObject({
      fee: 450,
      scheduledVisitorFee: 600,
      operation: { arrivalCadenceMinutes: 120 },
    });
    expect(getServiceIncomeLine("income.advanced_endoscopy")).toMatchObject({
      fee: 600,
      scheduledVisitorFee: 600,
      operation: { arrivalCadenceMinutes: 600 },
    });
  });

  it("keeps future approved procedure definitions inert and blocks all generic procedure visitors", () => {
    expect(APPROVED_CLINIC_PROCEDURE_WORK_CONTRACTS.filter((contract) => contract.implementation === "future_explicit_action")).toEqual([
      expect.objectContaining({ id: "procedure.thrombosed_external_hemorrhoid_excision", durationMinutes: 15 }),
      expect.objectContaining({ id: "procedure.pilonidal_abscess_drainage", durationMinutes: 15 }),
      expect.objectContaining({ id: "procedure.superficial_cyst_removal", durationMinutes: 45 }),
      expect.objectContaining({ id: "procedure.superficial_lipoma_removal", durationMinutes: 45 }),
      expect.objectContaining({ id: "procedure.seroma_aspiration", durationMinutes: 15 }),
    ]);
    for (const id of ["income.minor_procedure_simple", "income.minor_procedure_sampling", "income.minor_procedure_complex"]) {
      expect(getServiceIncomeLine(id)!.operation).toMatchObject({
        visitorMode: "explicit_only",
        arrivalCadenceMinutes: null,
        encounterOnly: true,
      });
    }
  });

  it("maps approved new procedure fees to only their exact onsite route", () => {
    expect(getServiceIncomeForRoute("route.anoscopy.in_house")).toMatchObject({
      id: "income.procedure.anoscopy", fee: 200,
    });
    expect(getServiceIncomeForRoute("route.thyroid_fna.in_house")).toMatchObject({
      id: "income.procedure.ultrasound_guided_thyroid_fna", fee: 150,
    });
    expect(getServiceIncomeForRoute("route.breast_core_needle_biopsy.in_house")).toMatchObject({
      id: "income.procedure.image_guided_breast_core_biopsy", fee: 150,
    });
    expect(getServiceIncomeForRoute("route.ultrasound.in_house")).toMatchObject({
      id: "income.ultrasound", fee: 120,
    });
  });

  it("uses the approved breast and anorectal fees without changing existing skin fees", () => {
    expect(getServiceIncomeLine("income.procedure.breast_cyst_aspiration.v2")?.fee).toBe(150);
    expect(getServiceIncomeLine("income.procedure.image_guided_breast_abscess_aspiration")?.fee).toBe(150);
    expect(getServiceIncomeLine("income.procedure.office_internal_hemorrhoid_banding")?.fee).toBe(200);
    expect(getServiceIncomeLine("income.procedure.perianal_abscess_drainage")?.fee).toBe(200);
    expect(getServiceIncomeLine("income.minor_procedure_sampling")?.fee).toBe(150);
    expect(getServiceIncomeLine("income.procedure.cutaneous_abscess_drainage.v2")?.fee).toBe(100);
    expect(getServiceIncomeLine("income.procedure.superficial_incisional_infection_drainage.v2")?.fee).toBe(200);
  });

  it("records future thrombosed-hemorrhoid and pilonidal fees without enabling work", () => {
    for (const id of [
      "income.procedure.thrombosed_external_hemorrhoid_excision",
      "income.procedure.pilonidal_abscess_drainage",
    ]) {
      expect(getServiceIncomeLine(id)).toMatchObject({ fee: 200, eligibleRouteIds: [], showInCatalog: false });
      expect(getServiceIncomeLine(id)?.operation).toBeUndefined();
    }
  });
});
