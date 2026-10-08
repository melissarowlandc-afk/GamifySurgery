import { describe, expect, it } from "vitest";

import { newestServiceIncomeReceipts } from "./viewModels";

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
});
