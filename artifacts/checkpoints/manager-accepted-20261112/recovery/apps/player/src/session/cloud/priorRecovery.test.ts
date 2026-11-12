import { describe, expect, it } from "vitest";
import { syncHarness } from "./syncTestSupport";

describe("reported verified-prior recovery", () => {
  it("falls back to the exact prior prefix while retaining the actual server head and blocking writes", async () => {
    const f = await syncHarness(), row = f.server.account(f.scope.accountId).campaigns.get(f.scope.campaignId)!;
    row.prior = structuredClone(f.confirmed);
    const newHead = { ...structuredClone(f.confirmed), revision: "2", snapshot: { ...f.confirmed.snapshot, uncompressedSha256: "0".repeat(64) } };
    row.confirmed = newHead;
    expect(await f.coordinator.open()).toBe(true);
    expect(f.coordinator.confirmed?.revision).toBe("1");
    expect(f.coordinator.confirmed?.priorRecovery).toEqual({ serverRevision: "2", serverEvidenceHighWater: f.confirmed.evidence.records.length });
    expect(f.coordinator.view).toMatchObject({ phase: "readonly", failure: "prior-recovery", canExecute: false, priorRecovery: { verifiedRevision: "1", serverRevision: "2" } });
    expect(await f.coordinator.startWriter()).toBe(false); expect(f.coordinator.resume()).toBe(false);
    expect(await f.coordinator.checkpoint()).toBe(false); expect(f.server.operationCount(f.scope.accountId)).toBe(0);
    expect(f.server.calls.filter(call => call.method === "load")).toHaveLength(2);
    // A compatible repaired current save is verified afresh, never overwritten from the prior.
    row.confirmed = { ...f.confirmed, revision: "2" };
    expect(await f.coordinator.retry()).toBe(true); expect(f.coordinator.confirmed?.revision).toBe("2");
    expect(f.coordinator.view.failure).toBeNull(); expect(await f.coordinator.startWriter()).toBe(true);
  });
  it("preserves bytes and blocks if both current and prior fail verification", async () => {
    const f = await syncHarness(), row = f.server.account(f.scope.accountId).campaigns.get(f.scope.campaignId)!;
    row.prior = { ...f.confirmed, snapshot: { ...f.confirmed.snapshot, uncompressedSha256: "1".repeat(64) } };
    row.confirmed = { ...row.prior, revision: "2" };
    const before = structuredClone(row);
    expect(await f.coordinator.open()).toBe(false); expect(f.coordinator.view).toMatchObject({ phase: "blocked", failure: "corrupt", canExecute: false });
    expect(row).toEqual(before); expect(f.coordinator.confirmed).toBeNull();
  });
});
