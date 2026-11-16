import { describe, expect, it } from "vitest";
import { compactGameState, createInitialGameState, type ServiceOperationState } from "@gamify-surgery/game-domain";

import { createPrototypePlayerView, newestServiceIncomeReceipts } from "./viewModels";

describe("newest service income receipts", () => {
  it("matches a stable newest-first sort and slice, including ties", () => {
    let seed = 7;
    const random = () => (seed = (seed * 16_807) % 2_147_483_647) / 2_147_483_647;
    for (let trial = 0; trial < 40; trial += 1) {
      const receipts = Array.from({ length: Math.floor(random() * 60) }, (_, index) => ({
        id: `receipt.${index}`,
        completedAtFacilityTick: Math.floor(random() * 12),
      }));
      for (const limit of [0, 1, 8, 100]) {
        const expected = [...receipts]
          .sort((left, right) => right.completedAtFacilityTick - left.completedAtFacilityTick)
          .slice(0, limit);
        expect(newestServiceIncomeReceipts(receipts, limit)).toEqual(expected);
      }
    }
  });

  it("keeps the displayed eight visitor names when eleven visits complete in the same minute", () => {
    const before = createInitialGameState(); before.facilityTick = 2_100;
    before.serviceOperations = Array.from({ length: 11 }, (_, n) => ({
      id: `service.tied.${String(n).padStart(2, "0")}`, incomeLineId: "income.ultrasound",
      actorKind: "visitor", actorId: `visitor.tied.${n}`, displayName: `Test visitor ${n}`,
      status: "completed", location: null, path: [], pathIndex: 0, phaseIndex: 1,
      completedAtFacilityTick: 2_000, reservedRoomInstanceIds: [], reservedEmployeeIds: [],
    } as unknown as ServiceOperationState));
    before.serviceIncomeReceipts = before.serviceOperations.map((operation, n) => ({
      id: `receipt.tied.${n}`, transactionKey: `income.tied.${n}`, incomeLineId: operation.incomeLineId,
      actorKind: "visitor", actorId: operation.actorId, catalogVersion: 1, routeId: null,
      grossAmount: 20, netCashDelta: 20, stockCost: 0, completedAtFacilityTick: 2_000,
    }));
    const receipts = (state: typeof before) => createPrototypePlayerView(state, null, false, null).serviceIncome.recentReceipts;
    expect(receipts(before).map(row => row.actorLabel)).toEqual(Array.from({ length: 8 }, (_, n) => `Test visitor ${n}`));
    expect(receipts(compactGameState(before))).toEqual(receipts(before));
  });

  it("keeps the UI's tied oldest-insertion receipts when outside reads exceed the retained tail", () => {
    const before = createInitialGameState(); before.facilityTick = 2_100;
    before.serviceIncomeReceipts = Array.from({ length: 60 }, (_, n) => ({
      id: `receipt.read.tied.${n}`, transactionKey: `income.outside-read.${n}`, incomeLineId: "income.radiologist_outside_read",
      actorKind: "remote" as const, actorId: "employee.synthetic", catalogVersion: 1, routeId: null,
      grossAmount: 5, netCashDelta: 5, stockCost: 0, completedAtFacilityTick: 2_000,
    }));
    const expected = newestServiceIncomeReceipts(before.serviceIncomeReceipts, 8);
    expect(newestServiceIncomeReceipts(compactGameState(before).serviceIncomeReceipts, 8)).toEqual(expected);
  });
});
