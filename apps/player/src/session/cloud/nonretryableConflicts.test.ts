import { afterEach, expect, it, vi } from "vitest";
import { SupabaseCloudTransport } from "./supabaseTransport";

afterEach(() => vi.restoreAllMocks());

it.each(["40001", "PT409"])("maps stale leases from both rollout versions (%s) without optional-endpoint fallback", async code => {
  const rpc = vi.fn(async (name: string) => name === "beta2_cloud_access"
    ? { data: { protocolVersion: 3, enabled: true, writesEnabled: true, noticeAccepted: true, efficientLeases: true }, error: null }
    : { data: null, error: { code, message: "Cloud revision conflict" } });
  const transport = new SupabaseCloudTransport({ rpc }, "account.synthetic", async () => "account.synthetic");
  await transport.capabilities();
  await expect(transport.acquire({ campaignId: "campaign.synthetic", expectedRevision: "1", expectedWriterGeneration: "1",
    writerToken: "a".repeat(64), operationId: "acquire.synthetic", takeover: false })).rejects.toMatchObject({ code: "revision" });
  expect(rpc.mock.calls.map(([name]) => name)).toEqual(["beta2_cloud_access", "beta2_cloud_lease_v2"]);
});

it.each(["40001", "PT409"])("bounds a repeated stale lease (%s) and keeps reads available to reconcile it", async code => {
  let now = 1_800_000_000_000, conflict = false;
  vi.spyOn(Math, "random").mockReturnValue(.5);
  const rpc = vi.fn(async (name: string) => name === "beta2_cloud_list"
    ? { data: { serverTime: new Date(now).toISOString(), campaigns: [{ campaignId: "campaign.synthetic", name: "Synthetic",
      status: "resumable", revision: "2", priorRevision: "1", writerGeneration: "2", evidenceHighWater: 0,
      writerActive: true, updatedAt: new Date(now).toISOString() }] }, error: null }
    : conflict ? { data: null, error: { code, message: "Cloud revision conflict" } }
      : { data: { revision: "1", writerGeneration: "2", expiresAt: new Date(now + 60_000).toISOString(), serverTime: new Date(now).toISOString() }, error: null });
  const transport = new SupabaseCloudTransport({ rpc }, "account.synthetic", async () => "account.synthetic", () => now);
  const lease = await transport.acquire({ campaignId: "campaign.synthetic", expectedRevision: "1", expectedWriterGeneration: "1",
    writerToken: "a".repeat(64), operationId: "acquire.synthetic", takeover: false });
  conflict = true; rpc.mockClear();
  for (let second = 0; second < 60; second++) {
    await transport.head("campaign.synthetic");
    // Calls suppressed by the existing client budget report throttled. Calls
    // actually sent to either server version must classify as revision.
    const count = rpc.mock.calls.length;
    await expect(transport.renew(lease)).rejects.toSatisfy((error: { code: string }) =>
      error.code === (rpc.mock.calls.length > count ? "revision" : "throttled"));
    now += 1_000;
  }
  expect(rpc.mock.calls.filter(([name]) => name === "beta2_cloud_lease")).toHaveLength(3);
});
