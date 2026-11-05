import { expect, it, vi } from "vitest";
import { memoizeSnapshotQuery } from "./tickQueryCache";

it("reuses false and true results only inside the caller's unchanged snapshot", () => {
  const query = vi.fn((id: number) => id > 0);
  const first = memoizeSnapshotQuery(query);
  for (let i = 0; i < 170; i++) {
    expect(first(0)).toBe(false);
    expect(first(1)).toBe(true);
  }
  expect(query).toHaveBeenCalledTimes(2);
  const laterSnapshot = memoizeSnapshotQuery(query);
  expect(laterSnapshot(0)).toBe(false);
  expect(query).toHaveBeenCalledTimes(3);
});
