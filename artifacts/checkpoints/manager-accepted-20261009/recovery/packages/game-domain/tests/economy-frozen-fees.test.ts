import { describe, expect, it } from "vitest";
import { advanceRetailOperations, authorizeRetailOrder, deserializeGameState,
  serializeGameState, startRetailPurchase, startServiceOperation, type ServiceOperationState } from "../src";
import { timingFixture } from "./diagnostic-timing-fixtures";

function procedureFixture() {
  const f = timingFixture();
  f.addRoom("room.periop_recovery", "staff.periop_nurse");
  f.addRoom("room.ambulatory_or", "staff.or_nurse");
  f.state.serviceAppointmentsEnabled = false;
  f.state.environment.founderActivity = null;
  return f;
}

describe("option B accepted fee compatibility", () => {
  it.each([["income.ambulatory_operation", 900, 1300],
    ["income.ambulatory_operation_extended", 1300, 1900]] as const)(
    "%s keeps accepted old work and freezes the new fee only for a new acceptance", (lineId, oldFee, newFee) => {
      const f = procedureFixture();
      const id = startServiceOperation(f.state, lineId, "visitor", f.context);
      expect(id).not.toBeNull();
      const job = f.state.serviceOperations[0]!;
      expect(job.quoteFee).toBe(newFee);
      // Synthetic legacy contract at its accepted price; no catalog retrieval
      // or balance change during gameplay is needed to continue this work.
      job.quoteFee = oldFee;
      job.roomUpgradeRevenue!.baseFee = oldFee;
      const frozenPhases = structuredClone(job.frozenOperationPhases);
      delete f.state.salaryEconomyVersion;
      const loaded = deserializeGameState(serializeGameState(f.state), f.context);
      const restored = loaded.serviceOperations.find((operation) => operation.id === id)!;
      expect(restored).toMatchObject({ quoteFee: oldFee, roomUpgradeRevenue: { baseFee: oldFee },
        status: job.status, phaseIndex: job.phaseIndex });
      expect(restored.frozenOperationPhases).toEqual(frozenPhases);
      expect(deserializeGameState(serializeGameState(loaded), f.context).serviceOperations[0]?.quoteFee).toBe(oldFee);
      const fresh = procedureFixture();
      expect(startServiceOperation(fresh.state, lineId, "visitor", fresh.context)).not.toBeNull();
      expect(fresh.state.serviceOperations[0]?.quoteFee).toBe(newFee);
    },
  );

  it("continues and pays a frozen $25 prescription once after load, while new orders quote $70", () => {
    const f = timingFixture();
    const pharmacy = f.addRoom("room.pharmacy", "staff.pharmacist");
    f.state.cash = 10000;
    f.state.cashCents = 1000000;
    f.state.environment.founderLocation = { ...pharmacy.anchor };
    f.state.environment.founderActivity = null;
    expect(authorizeRetailOrder(f.state, "order.old", "income.pharmacy_pickup", "retail_visitor", "customer.old", 1, f.context)).toBe(true);
    const id = startRetailPurchase(f.state, "income.pharmacy_pickup", "retail_visitor", "customer.old", f.context, "order.old");
    expect(id).not.toBeNull();
    const job = f.state.retailOperations[0]!;
    expect(job.quoteGross).toBe(70);
    job.quoteGross = 25;
    job.roomUpgradeRevenue!.baseFee = 25;
    job.status = "purchasing";
    job.startedAtFacilityTick = 0;
    job.purchaseEndsAtFacilityTick = 2;
    job.location = { ...pharmacy.anchor };
    job.path = [job.location];
    job.pathIndex = 0;
    f.state.retailExternalActors[0]!.location = { ...pharmacy.anchor };
    delete f.state.salaryEconomyVersion;
    const loaded = deserializeGameState(serializeGameState(f.state), f.context);
    expect(loaded.retailOperations[0]).toMatchObject({ quoteGross: 25, quoteStockCost: 15,
      purchaseEndsAtFacilityTick: 2, status: "purchasing" });
    const cashBefore = loaded.cashCents;
    loaded.facilityTick = 2;
    advanceRetailOperations(loaded, f.context);
    expect(loaded.serviceIncomeReceipts).toEqual([expect.objectContaining({
      incomeLineId: "income.pharmacy_pickup", grossAmount: 25, stockCost: 15, netCashDelta: 10 })]);
    expect(loaded.cashCents).toBe(cashBefore + 1000);
    advanceRetailOperations(loaded, f.context);
    expect(loaded.serviceIncomeReceipts).toHaveLength(1);
    expect(loaded.cashCents).toBe(cashBefore + 1000);
    const fresh = timingFixture();
    const newPharmacy = fresh.addRoom("room.pharmacy", "staff.pharmacist");
    fresh.state.cash = 10000;
    fresh.state.cashCents = 1000000;
    fresh.state.environment.founderLocation = { ...newPharmacy.anchor };
    fresh.state.environment.founderActivity = null;
    expect(authorizeRetailOrder(fresh.state, "order.new", "income.pharmacy_pickup", "retail_visitor", "customer.new", 1, fresh.context)).toBe(true);
    expect(startRetailPurchase(fresh.state, "income.pharmacy_pickup", "retail_visitor", "customer.new", fresh.context, "order.new")).not.toBeNull();
    expect(fresh.state.retailOperations[0]).toMatchObject({ quoteGross: 70, quoteStockCost: 15, outletDurationMinutes: 2 });
  });

  it("keeps an unmarked in-flight OR fee and elapsed work from an older save", () => {
    const f = procedureFixture();
    const room = f.state.rooms.find((candidate) => candidate.roomDefinitionId === "room.ambulatory_or")!;
    const nurse = f.state.employees.find((employee) => employee.staffRoleDefinitionId === "staff.or_nurse")!;
    const job: ServiceOperationState = { id: "operation.old.in-flight", incomeLineId: "income.ambulatory_operation",
      catalogVersion: 1, actorKind: "visitor", actorId: "visitor.old.or", displayName: "Accepted operation", appearance: null,
      status: "in_service", createdAtFacilityTick: 0, waitDeadlineFacilityTick: 60, startedAtFacilityTick: 1,
      completedAtFacilityTick: null, cancelledAtFacilityTick: null, quoteFee: 900, phaseIndex: 0,
      phaseStartedAtFacilityTick: 1, phaseEndsAtFacilityTick: 121, reservedRoomInstanceIds: [room.id],
      reservedEmployeeIds: [nurse.id], providerReservation: { kind: "founder" }, location: { ...nurse.location },
      path: [], pathIndex: 0, lastMovedAtFacilityTick: 1, cancellationReason: null };
    f.state.facilityTick = 45;
    f.state.serviceOperations = [job];
    delete f.state.salaryEconomyVersion;
    const loaded = deserializeGameState(serializeGameState(f.state), f.context);
    expect(loaded.serviceOperations[0]).toMatchObject({ quoteFee: 900, status: "in_service",
      startedAtFacilityTick: 1, phaseStartedAtFacilityTick: 1, phaseEndsAtFacilityTick: 121,
      reservedRoomInstanceIds: [room.id], reservedEmployeeIds: [nurse.id] });
    expect(loaded.serviceOperations[0]?.roomUpgradeRevenue).toBeUndefined();
  });
});
