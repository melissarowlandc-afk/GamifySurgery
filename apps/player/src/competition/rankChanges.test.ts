import { describe, expect, it } from "vitest";
import { CompetitionClient } from "./competitionClient";
import { fakeTransport, memoryStorage, revenueState } from "./testFixtures";
import type { CompetitionBoard } from "./types";

const board = (rank: number | null, hidden = false): CompetitionBoard => ({ hidden, rows: [
  { rank, isSelf: true, clinicName: "My clinic", facilityLevel: 2, averageDailyRevenueCents: 1000, daysCounted: 1 },
] });
async function submit(client: CompetitionClient, day: number, campaignId = "campaign.rank-test") {
  const state = revenueState(day); state.campaignId = campaignId;
  client.observe(state, "Clinic"); await client.flush();
}

describe("game-day competition rank changes", () => {
  it("establishes a baseline then reports up/down, suppressing unchanged ranks and duplicate reads", async () => {
    const transport = fakeTransport(board(3)), storage = memoryStorage(), client = new CompetitionClient(transport, storage, "account-a");
    await submit(client, 1);
    expect(await client.rankChange("campaign.rank-test", 1, false)).toBeNull();
    await submit(client, 2); transport.leaderboard.mockResolvedValue(board(2));
    expect(await client.rankChange("campaign.rank-test", 2, false)).toEqual({ campaignId: "campaign.rank-test", completedDay: 2, message: "You moved up to #2 in Clinic Competition!" });
    expect(await client.rankChange("campaign.rank-test", 2, false)).toBeNull();
    await submit(client, 3); transport.leaderboard.mockResolvedValue(board(4));
    expect((await client.rankChange("campaign.rank-test", 3, false))?.message).toBe("Another clinic passed yours — you're now #4.");
    await submit(client, 4);
    expect(await client.rankChange("campaign.rank-test", 4, false)).toBeNull();
    expect(transport.leaderboard).toHaveBeenCalledTimes(4);
    expect(JSON.parse(storage.getItem("account-a")!)[0]).toMatchObject({ lastRank: 4, rankCheckedDay: 4 });
  });
  it("keeps rank history per campaign/account across reloads without changing game state", async () => {
    const storage = memoryStorage(), transport = fakeTransport(board(5)), first = new CompetitionClient(transport, storage, "account-a");
    const state = revenueState(); state.campaignId = "campaign.rank-test"; const frozen = JSON.stringify(state);
    first.observe(state, "Clinic"); await first.flush(); await first.rankChange(state.campaignId, 1, false);
    expect(JSON.stringify(state)).toBe(frozen);
    const reload = new CompetitionClient(transport, storage, "account-a");
    await submit(reload, 2); transport.leaderboard.mockResolvedValue(board(2));
    expect((await reload.rankChange(state.campaignId, 2, false))?.message).toContain("moved up to #2");
    await submit(reload, 1, "other-campaign");
    expect(await reload.rankChange("other-campaign", 1, false)).toBeNull();
    const otherAccount = new CompetitionClient(transport, storage, "account-b");
    await submit(otherAccount, 2);
    expect(await otherAccount.rankChange(state.campaignId, 2, false)).toBeNull();
  });
  it("makes no rank request for casual/unknown mode or before submission succeeds", async () => {
    const transport = fakeTransport(board(1)), client = new CompetitionClient(transport, null, "a");
    await submit(client, 1);
    expect(await client.rankChange("campaign.rank-test", 1, true)).toBeNull();
    expect(await client.rankChange("campaign.rank-test", 1, null)).toBeNull();
    transport.submit.mockRejectedValueOnce(new Error("offline")); await submit(client, 2);
    expect(await client.rankChange("campaign.rank-test", 2, false)).toBeNull();
    expect(transport.leaderboard).not.toHaveBeenCalled();
  });
  it("retains the last known rank through offline reads and retries without an invented alert", async () => {
    const transport = fakeTransport(board(3)), client = new CompetitionClient(transport, memoryStorage(), "a");
    await submit(client, 1); await client.rankChange("campaign.rank-test", 1, false);
    await submit(client, 2); transport.leaderboard.mockRejectedValueOnce(new Error("offline"));
    expect(await client.rankChange("campaign.rank-test", 2, false)).toBeNull();
    transport.leaderboard.mockResolvedValue(board(2));
    expect((await client.rankChange("campaign.rank-test", 2, false))?.message).toContain("moved up to #2");
    expect(await client.rankChange("campaign.rank-test", 2, false)).toBeNull();
  });
  it("emits no hidden/unranked/re-entry change and clears the old baseline", async () => {
    const transport = fakeTransport(board(3)), client = new CompetitionClient(transport, null, "a");
    await submit(client, 1); await client.rankChange("campaign.rank-test", 1, false);
    await submit(client, 2); transport.leaderboard.mockResolvedValue(board(null, true));
    expect(await client.rankChange("campaign.rank-test", 2, false)).toBeNull();
    await submit(client, 3); transport.leaderboard.mockResolvedValue({ hidden: false, rows: [] });
    expect(await client.rankChange("campaign.rank-test", 3, false)).toBeNull();
    await submit(client, 4); transport.leaderboard.mockResolvedValue(board(1));
    expect(await client.rankChange("campaign.rank-test", 4, false)).toBeNull();
  });
  it("serializes simultaneous rank checks and keeps blocked storage nonfatal", async () => {
    const storage = { getItem: () => null, setItem: () => { throw new Error("blocked"); }, removeItem: () => {} };
    const transport = fakeTransport(board(5)), client = new CompetitionClient(transport, storage, "a");
    await submit(client, 1); await client.rankChange("campaign.rank-test", 1, false);
    await submit(client, 2); transport.leaderboard.mockResolvedValue(board(1));
    const results = await Promise.all([client.rankChange("campaign.rank-test", 2, false), client.rankChange("campaign.rank-test", 2, false)]);
    expect(results.filter(Boolean)).toHaveLength(1);
    expect(transport.leaderboard).toHaveBeenCalledTimes(2);
  });
  it("does not read after a deletion/denial and treats unavailable checks as nonblocking", async () => {
    const transport = fakeTransport(board(1)), client = new CompetitionClient(transport, null, "a");
    await submit(client, 1); client.clear();
    expect(await client.rankChange("campaign.rank-test", 1, false)).toBeNull();
    expect(transport.leaderboard).not.toHaveBeenCalled();
  });
});
