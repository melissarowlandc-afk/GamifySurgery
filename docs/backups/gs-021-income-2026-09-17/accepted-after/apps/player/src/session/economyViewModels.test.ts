import { describe, expect, it } from "vitest";
import { createInitialGameState } from "@gamify-surgery/game-domain";
import { createPrototypePlayerView } from "./viewModels";

describe("economy player view models", () => {
  it("keeps the GLP-1 control available until a suite is operationally staffed", () => {
    const state = createInitialGameState();
    const view = createPrototypePlayerView(state, null, false, null);

    expect(view.emergencyGlp1).toMatchObject({
      visible: true,
      enabled: true,
      paymentLabel: "+$50",
      statusLabel: "Ready now; one consult per facility hour.",
    });
    expect(JSON.stringify(view.emergencyGlp1)).not.toContain("daily");

    state.cash = 500;
    state.cashCents = 50_000;
    const highCashView = createPrototypePlayerView(
      state,
      null,
      false,
      null,
    ).emergencyGlp1;
    expect(highCashView).toMatchObject({
      visible: true,
      enabled: true,
      statusLabel: "Ready now; one consult per facility hour.",
    });
    expect(JSON.stringify(highCashView)).not.toContain(
      "Available below",
    );

    state.rooms.push({
      ...state.rooms[0]!,
      id: "room.instance.glp1.telehealth",
      roomDefinitionId:
        "room.glp1_telehealth_suite",
    });
    expect(
      createPrototypePlayerView(state, null, false, null).emergencyGlp1
        .visible,
    ).toBe(true);
  });

  it("presents the current centralized advertising tier", () => {
    const state = createInitialGameState();
    state.advertisingLevel = 2;

    const advertising = createPrototypePlayerView(
      state,
      null,
      false,
      null,
    ).advertising;

    expect(advertising).toMatchObject({
      currentLevel: 2,
      currentDisplayName: "Neighborhood ads",
      hourlyCostLabel: "$8/hr",
      arrivalFrequencyLabel: "+19% arrival frequency",
      canDecrease: true,
      canIncrease: true,
    });
  });

  it("projects durable income receipts for display without recalculating their cash", () => {
    const state = createInitialGameState();
    const cashBeforeProjection = state.cash;
    state.serviceIncomeReceipts = [
      {
        id: "income.glp1.manual.operation.1.0",
        transactionKey: "income.glp1.manual.operation.1",
        incomeLineId: "income.glp1_telehealth",
        catalogVersion: 1,
        routeId: null,
        actorKind: "founder",
        actorId: "founder",
        grossAmount: 50,
        stockCost: 0,
        netCashDelta: 50,
        completedAtFacilityTick: 12,
      },
    ];

    const facility = createPrototypePlayerView(
      state,
      null,
      false,
      null,
    ).facility;

    expect(facility.campaignId).toBe(state.campaignId);
    expect(facility.earningsReceipts).toEqual([
      {
        transactionKey: "income.glp1.manual.operation.1",
        actorKind: "founder",
        actorId: "founder",
        grossAmount: 50,
      },
    ]);
    expect(state.cash).toBe(cashBeforeProjection);
  });

  it("keeps the complete approved catalog visible while identifying level and capability locks", () => {
    const state = createInitialGameState();
    state.facilityLevel = 1;
    state.serviceIncomeReceipts = [
      {
        id: "income.ultrasound.1",
        transactionKey: "income.ultrasound.1",
        incomeLineId: "income.ultrasound",
        catalogVersion: 1,
        routeId: "route.example",
        actorKind: "patient",
        actorId: "encounter.example",
        grossAmount: 120,
        stockCost: 15,
        netCashDelta: 105,
        completedAtFacilityTick: 25,
      },
    ];

    const serviceIncome = createPrototypePlayerView(state, null, false, null).serviceIncome;

    expect(serviceIncome.catalogLines.length).toBeGreaterThan(20);
    expect(serviceIncome.catalogLines.find((line) => line.id === "income.gift_shop_premium")?.unavailableReason).toBe("Locked until Facility Level 5");
    expect(serviceIncome.catalogLines.find((line) => line.id === "income.ultrasound")).toMatchObject({
      available: false,
      unavailableReason: "Requires Ultrasound Room + Imaging Technician",
    });
    expect(serviceIncome).toMatchObject({
      appointmentsEnabled: state.serviceAppointmentsEnabled,
      grossTotalLabel: "$120.00",
      stockCostTotalLabel: "$15.00",
      netTotalLabel: "$105.00",
    });
    expect(serviceIncome.recentReceipts[0]).toMatchObject({ displayName: "Ultrasound", netLabel: "$105.00" });
  });

  it("projects an outside buyer at the active retail trip without creating an encounter duplicate", () => {
    const state = createInitialGameState();
    const appearance = state.founder.appearance;
    state.retailExternalActors = [{
      id: "retail-visitor.1", kind: "retail_visitor", displayName: "Maya Shopper", appearance,
      linkedServiceOperationId: null, linkedEncounterId: null, lifecycle: "onsite",
      location: { x: 10, y: 11 }, path: [], pathIndex: 0, lastMovedAtFacilityTick: 0, activeRetailOperationId: "retail-operation.1",
    }];
    state.retailOperations = [{
      id: "retail-operation.1", incomeLineId: "income.coffee", catalogVersion: 1,
      actorKind: "retail_visitor", actorId: "retail-visitor.1", displayName: "Maya Shopper", appearance,
      linkedServiceOperationId: null, authorizedOrderId: null, status: "walking_to_outlet",
      createdAtFacilityTick: 0, waitDeadlineFacilityTick: 10, startedAtFacilityTick: null, completedAtFacilityTick: null,
      quoteGross: 5, quoteStockCost: 1, outletRoomInstanceId: "room.kiosk", outletDurationMinutes: 2,
      staffRoleDefinitionId: null, servingEmployeeId: null, location: { x: 12, y: 11 }, returnLocation: null,
      path: [{ x: 10, y: 11 }, { x: 12, y: 11 }], pathIndex: 1, lastMovedAtFacilityTick: 1,
      purchaseEndsAtFacilityTick: null, cancellationReason: null,
    }];
    state.serviceIncomeReceipts = [{
      id: "income.retail.visitor.1.0", transactionKey: "income.retail.visitor.1", incomeLineId: "income.coffee",
      catalogVersion: 1, routeId: null, actorKind: "retail_visitor", actorId: "retail-visitor.1",
      grossAmount: 5, stockCost: 1, netCashDelta: 4, completedAtFacilityTick: 12,
    }];

    const view = createPrototypePlayerView(state, null, false, null);
    expect(view.facility.retailExternalActors).toEqual([
      expect.objectContaining({ instanceId: "retail-visitor.1", actorKind: "retail_visitor", displayName: "Maya Shopper", location: { x: 12, y: 11 }, pathIndex: 1 }),
    ]);
    expect(view.facility.patients).not.toContainEqual(expect.objectContaining({ instanceId: "retail-visitor.1" }));
    expect(view.serviceIncome.activeOperations).toContainEqual(expect.objectContaining({ actorLabel: "Maya Shopper", quoteFeeLabel: "$5.00 gross · $1.00 stock" }));
    expect(view.serviceIncome.recentReceipts[0]).toMatchObject({ actorLabel: "Maya Shopper", grossLabel: "$5.00", stockCostLabel: "$1.00", netLabel: "$4.00" });

    state.retailExternalActors[0]!.lifecycle = "departed";
    expect(createPrototypePlayerView(state, null, false, null).facility.retailExternalActors).toEqual([]);
  });

  it("labels coffee economics and keeps wound supplies locked without either operational outlet", () => {
    const state = createInitialGameState();
    const catalog = createPrototypePlayerView(state, null, false, null).serviceIncome.catalogLines;
    expect(catalog.find((line) => line.id === "income.coffee")).toMatchObject({ feeLabel: "$5.00", stockCostLabel: "$1.00", contributionLabel: "$4.00" });
    expect(catalog.find((line) => line.id === "income.wound_supply")).toMatchObject({
      available: false,
      requirementLabel: "Pharmacy + Pharmacist or Wound/Ostomy Clinic",
      unavailableReason: "Locked until Facility Level 3",
    });
  });
});
