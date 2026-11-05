import { expect, it } from "vitest";
import { retainPresentationIds } from "./recentPresentationIds";
import { reconcileEarningsPopups, type EarningsPopupState } from "./facility/earningsPopupPresentation";

it("retains current history and bounded recent IDs through 10,000 rolling feed windows", () => {
  let known = new Set<string>();
  for (let i = 0; i < 10_000; i++) {
    const live = Array.from({ length: 80 }, (_, n) => `event.${i + n}`);
    known = retainPresentationIds(known, live);
    expect(known.size).toBeLessThanOrEqual(208);
    expect(live.every(id => known.has(id))).toBe(true);
  }
  expect(known.has("event.0")).toBe(false);
  expect(known.has("event.9998")).toBe(true);
});

it("does not replay current receipts after retirement or short-lived omission, with bounded popup cursors", () => {
  let state: EarningsPopupState | undefined;
  for (let i = 0; i < 10_000; i++) {
    const receipts = Array.from({ length: 50 }, (_, n) => ({ transactionKey: `income.${i + n}`,
      actorId: "founder", actorKind: "founder" as const, grossAmount: 1 }));
    state = reconcileEarningsPopups(state, { campaignId: "public", receipts, actorAnchors: { founder: { founder: true } }, nowMilliseconds: i * 2000 });
    expect(state.observedTransactionKeys.length).toBeLessThanOrEqual(178);
    expect(state.activePopups.length).toBe(i === 0 ? 0 : 1);
  }
  const last = state!;
  state = reconcileEarningsPopups(last, { campaignId: "public", receipts: [], actorAnchors: {}, nowMilliseconds: 20_000_000 });
  const returned = reconcileEarningsPopups(state, { campaignId: "public", receipts: last.observedReceipts!, actorAnchors: { founder: { founder: true } }, nowMilliseconds: 20_000_001 });
  expect(returned.activePopups).toEqual([]);
});
