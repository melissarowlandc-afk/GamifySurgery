import { describe, expect, it } from "vitest";
import { CompetitionClient } from "./competitionClient";
import { CompetitionAccessError, CompetitionValidationError } from "./types";
import { fakeTransport, memoryStorage, receipt, revenueState } from "./testFixtures";

describe("competition offline submissions", () => {
  it("persists offline work, retries and deduplicates an acknowledged game day across reloads", async () => {
    const transport = fakeTransport(), storage = memoryStorage(), state = revenueState();
    state.serviceIncomeReceipts = [receipt(10, 12.34)];
    transport.submit.mockRejectedValueOnce(new Error("offline"));
    const first = new CompetitionClient(transport, storage, "account-a");
    first.observe(state, "  My clinic  "); await first.flush();
    const restored = new CompetitionClient(transport, storage, "account-a"); await restored.flush();
    expect(transport.submit.mock.calls[1]![0]).toEqual({ campaignId: state.campaignId, clinicName: "My clinic", facilityLevel: 0,
      averageDailyRevenueCents: 1234, daysCounted: 1, completedDay: 1 });
    const reload = new CompetitionClient(transport, storage, "account-a"); reload.observe(state, "My clinic"); await reload.flush();
    expect(transport.submit).toHaveBeenCalledTimes(2);
  });
  it("coalesces multiple offline days to the newest average for each clinic", async () => {
    const transport = fakeTransport(), client = new CompetitionClient(transport, memoryStorage(), "a");
    const state = revenueState(); state.serviceIncomeReceipts = [receipt(10, 10)]; client.observe(state, "Clinic");
    state.facilityTick = 1200; state.serviceIncomeReceipts.push(receipt(610, 30)); client.observe(state, "Clinic");
    await client.flush();
    expect(transport.submit).toHaveBeenCalledTimes(1);
    expect(transport.submit.mock.calls[0]![0]).toMatchObject({ completedDay: 2, daysCounted: 2, averageDailyRevenueCents: 2000 });
  });
  it("keeps a newly completed day if an older submission was already in flight", async () => {
    const transport = fakeTransport(), client = new CompetitionClient(transport, memoryStorage(), "a");
    let acknowledge!: () => void;
    transport.submit.mockImplementationOnce(() => new Promise<void>(resolve => { acknowledge = resolve; }));
    const state = revenueState(); client.observe(state, "Clinic"); const upload = client.flush();
    state.facilityTick = 1200; client.observe(state, "Clinic"); acknowledge(); await upload;
    await client.flush();
    expect(transport.submit.mock.calls.map(([sample]) => sample.completedDay)).toEqual([1, 2]);
  });
  it("ignores backwards saves, does not duplicate concurrent flushes, and isolates accounts", async () => {
    const storage = memoryStorage(), transport = fakeTransport();
    const client = new CompetitionClient(transport, storage, "a"), state = revenueState(2);
    client.observe(state, "Clinic"); client.observe(revenueState(1), "Older");
    await Promise.all([client.flush(), client.flush()]);
    expect(transport.submit).toHaveBeenCalledTimes(1);
    expect(transport.submit.mock.calls[0]![0].completedDay).toBe(2);
    await new CompetitionClient(transport, storage, "b").flush();
    expect(transport.submit).toHaveBeenCalledTimes(1);
  });
  it("drops expired queued data and handles unavailable or corrupt storage", async () => {
    const storage = memoryStorage(), transport = fakeTransport();
    const first = new CompetitionClient(transport, storage, "a", () => 1_000); first.observe(revenueState(), "Clinic");
    await new CompetitionClient(transport, storage, "a", () => 8 * 86_400_000).flush();
    expect(transport.submit).not.toHaveBeenCalled();
    const blocked = { getItem() { throw new Error("blocked"); }, setItem() { throw new Error("blocked"); }, removeItem() { throw new Error("blocked"); } };
    const memory = new CompetitionClient(transport, blocked, "a"); memory.observe(revenueState(), "Clinic"); await memory.flush();
    expect(transport.submit).toHaveBeenCalledTimes(1);
  });
  it("stops and clears the queue when membership is denied or deletion is requested", async () => {
    const storage = memoryStorage(), transport = fakeTransport(), client = new CompetitionClient(transport, storage, "a");
    client.observe(revenueState(), "Clinic"); transport.submit.mockRejectedValue(new CompetitionAccessError());
    await client.flush(); expect(storage.getItem("a")).toBeNull();
    client.observe(revenueState(2), "Clinic"); await client.flush(); expect(transport.submit).toHaveBeenCalledTimes(1);
    await expect(client.leaderboard()).rejects.toBeInstanceOf(CompetitionAccessError);
    await expect(client.setHidden(true)).rejects.toBeInstanceOf(CompetitionAccessError);
    expect(transport.leaderboard).not.toHaveBeenCalled(); expect(transport.setHidden).not.toHaveBeenCalled();
  });
  it("skips invalid names, absurd amounts and invalid queued samples without blocking the next clinic", async () => {
    const transport = fakeTransport(), client = new CompetitionClient(transport, null, "a"), state = revenueState();
    client.observe(state, "Bad\nName"); await client.flush(); expect(transport.submit).not.toHaveBeenCalled();
    state.serviceIncomeReceipts = [receipt(1, 1e12)]; client.observe(state, "Clinic"); await client.flush(); expect(transport.submit).not.toHaveBeenCalled();
    state.serviceIncomeReceipts = []; client.observe(state, "Clinic");
    const second = revenueState(); second.campaignId = "other"; client.observe(second, "Other");
    transport.submit.mockRejectedValueOnce(new CompetitionValidationError()); await client.flush();
    expect(transport.submit).toHaveBeenCalledTimes(2);
  });
});
