import type { SupabaseClient } from "@supabase/supabase-js";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createSupabaseUsageTransport } from "./supabaseUsage";
import { USAGE_METRIC_VERSION, USAGE_NOTICE_VERSION, type QuestionUsageReceipt } from "./usageTypes";

afterEach(() => vi.unstubAllGlobals());
const receipt: QuestionUsageReceipt = { kind: "question", receipt_id: "11111111-1111-4111-8111-111111111111", occurred_at: "2026-10-13T12:00:00.000Z" };
function transportFixture() {
  const getSession = vi.fn(async () => ({ data: { session: { user: { id: "a" }, access_token: "synthetic-session-token" } }, error: null }));
  const setHeader = vi.fn(async (_name: string, _value: string) => ({ data: { acknowledged_receipt_ids: [receipt.receipt_id] } as unknown, error: null }));
  const rpc = vi.fn(() => ({ setHeader }));
  const transport = createSupabaseUsageTransport({ auth: { getSession }, rpc } as unknown as SupabaseClient,
    { supabaseUrl: "https://usage.example.invalid/", supabaseAnonKey: "synthetic-public-key" }, "a");
  return { transport, getSession, setHeader, rpc };
}
describe("count-only Supabase transport", () => {
  it.each([true, false, undefined])("maps read-only casual access %s without a write RPC", async casual => {
    const f = transportFixture();
    f.setHeader.mockResolvedValue({ data: { admitted: true, notice_accepted: false, deletion_requested: false, casual }, error: null });
    expect(await f.transport.access()).toEqual({ admitted: true, notice_accepted: false, deletion_requested: false, casual: casual === true });
    expect(f.rpc).toHaveBeenCalledExactlyOnceWith("get_usage_access", {});
    expect(f.transport).not.toHaveProperty("setCasualMode");
  });
  it.each(["true", 1, null, {}])("rejects malformed casual mode %s", async casual => {
    const f = transportFixture();
    f.setHeader.mockResolvedValue({ data: { admitted: true, notice_accepted: true, deletion_requested: false, casual }, error: null });
    await expect(f.transport.access()).rejects.toThrow("Usage access unavailable");
  });
  it.each([{ admitted: false, deletion_requested: false }, { admitted: true, deletion_requested: true }])("does not enable casual mode for denied/deleted access %s", async access => {
    const f = transportFixture();
    f.setHeader.mockResolvedValue({ data: { ...access, notice_accepted: false, casual: true }, error: null });
    expect((await f.transport.access()).casual).toBe(false);
  });
  it("pins the expected account token and sends only metric version and opaque time/count receipts", async () => {
    const f = transportFixture();
    expect(await f.transport.ingest([receipt], false)).toEqual([receipt.receipt_id]);
    expect(f.rpc).toHaveBeenCalledWith("ingest_player_usage", { p_receipts: [receipt], p_metric_version: USAGE_METRIC_VERSION });
    expect(f.setHeader).toHaveBeenCalledWith("Authorization", "Bearer synthetic-session-token");
    await f.transport.acceptNotice(USAGE_NOTICE_VERSION); await f.transport.requestDeletion();
    expect(f.rpc).toHaveBeenCalledWith("accept_usage_notice", { p_version: USAGE_NOTICE_VERSION });
    expect(f.rpc).toHaveBeenCalledWith("request_usage_data_deletion", {});
  });

  it("rejects a changed/missing signed-in account before issuing an RPC or pagehide fetch", async () => {
    const f = transportFixture(); const fetch = vi.fn(() => { throw new Error("Unexpected network"); }); vi.stubGlobal("fetch", fetch);
    f.getSession.mockResolvedValue({ data: { session: { user: { id: "b" }, access_token: "synthetic-other-token" } }, error: null });
    await expect(f.transport.ingest([receipt], false)).rejects.toThrow("Usage account unavailable");
    await expect(f.transport.ingest([receipt], true)).rejects.toThrow("Usage account unavailable");
    expect(f.rpc).not.toHaveBeenCalled(); expect(fetch).not.toHaveBeenCalled();
  });

  it("uses a bounded keepalive request on pagehide with only a public key and the matching account token", async () => {
    const f = transportFixture();
    const fetch = vi.fn(async () => new Response(JSON.stringify({ acknowledged_receipt_ids: [receipt.receipt_id] }), { status: 200 }));
    vi.stubGlobal("fetch", fetch);
    await f.transport.ingest([receipt], true);
    expect(fetch).toHaveBeenCalledWith("https://usage.example.invalid/rest/v1/rpc/ingest_player_usage", expect.objectContaining({ keepalive: true, method: "POST" }));
    expect(f.rpc).not.toHaveBeenCalled();
  });

  it("does not invent successful access or receipt acknowledgements on malformed/error responses", async () => {
    const f = transportFixture();
    f.setHeader.mockResolvedValue({ data: {} as { acknowledged_receipt_ids: string[] }, error: null });
    await expect(f.transport.access()).rejects.toThrow("Usage access unavailable");
    await expect(f.transport.ingest([receipt], false)).rejects.toThrow("Usage acknowledgement unavailable");
  });
});
