import type { SupabaseClient } from "@supabase/supabase-js";
import { afterEach, expect, it, vi } from "vitest";
import { PlaytimeTracker } from "./playtimeTracker";
import { UsageOutbox } from "./usageOutbox";
import { createSupabaseUsageTransport } from "./supabaseUsage";
import { type QuestionUsageReceipt, type UsageReceipt, USAGE_METRIC_VERSION } from "./usageTypes";

afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });
const receipt: QuestionUsageReceipt = { kind: "question", receipt_id: "11111111-1111-4111-8111-111111111111", occurred_at: "2026-11-10T12:00:00.000Z" };
const playtime: UsageReceipt = { kind: "playtime", receipt_id: "22222222-2222-4222-8222-222222222222",
  session_id: "33333333-3333-4333-8333-333333333333", started_at: "2026-11-10T11:59:55.000Z", ended_at: receipt.occurred_at, active_ms: 5_000 };
const config = { supabaseUrl: "https://usage.example.invalid", supabaseAnonKey: "synthetic-public-key" };

it("releases a hung ingest single-flight and resends its immutable IDs, including after a reload", async () => {
  vi.useFakeTimers(); vi.setSystemTime(Date.parse(receipt.occurred_at));
  vi.spyOn(Math, "random").mockReturnValue(.5);
  let hang = true, signal: AbortSignal | undefined;
  const rpc = vi.fn((name: string, _args: Record<string, unknown>) => {
    const response = name === "get_usage_access" ? Promise.resolve({ data: { admitted: true, notice_accepted: true, deletion_requested: false }, error: null })
      : hang ? new Promise<never>(() => {}) : Promise.resolve({ data: { acknowledged_receipt_ids: [receipt.receipt_id, playtime.receipt_id] }, error: null });
    const builder = { setHeader: () => builder, abortSignal: (value: AbortSignal) => { signal = value; return builder; }, then: response.then.bind(response) };
    return builder;
  });
  const client = { rpc, auth: { getSession: async () => ({ data: { session: { user: { id: "usage.recovery" }, access_token: "synthetic-token" } }, error: null }) } } as unknown as SupabaseClient;
  const values = new Map<string, string>();
  const storage = { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => { values.set(key, value); }, removeItem: (key: string) => { values.delete(key); } };
  const outbox = new UsageOutbox("usage.recovery", storage, Date.now);
  const clock = { wall: Date.now, monotonic: Date.now };
  const make = () => new PlaytimeTracker(outbox, createSupabaseUsageTransport(client, config, "usage.recovery"), clock, () => receipt.receipt_id);
  const tracker = make(); await tracker.refreshAccess(); tracker.commitQuestions([receipt]); outbox.append([playtime]);
  let settled = false;
  const pending = tracker.flush().then(() => { settled = true; });
  await vi.advanceTimersByTimeAsync(30_001);
  expect(settled).toBe(true); await pending;
  expect(signal?.aborted).toBe(true);
  expect(tracker.status()).toMatchObject({ state: "unavailable", pendingReceipts: 2 });
  // A failed HTTP request changes no IDs and is not retried every second.
  for (let second = 0; second < 10; second++) { await tracker.flush(); await vi.advanceTimersByTimeAsync(1_000); }
  expect(rpc.mock.calls.filter(([name]) => name === "ingest_player_usage")).toHaveLength(1);
  tracker.stop(); hang = false;
  const reloaded = new PlaytimeTracker(new UsageOutbox("usage.recovery", storage, Date.now), createSupabaseUsageTransport(client, config, "usage.recovery"), clock, () => receipt.receipt_id);
  await reloaded.refreshAccess(); await reloaded.flush();
  expect(reloaded.status()).toMatchObject({ state: "ready", pendingReceipts: 0 });
  const batches = rpc.mock.calls.filter(([name]) => name === "ingest_player_usage");
  expect(batches).toHaveLength(2);
  expect(batches[1]![1]).toEqual(batches[0]![1]);
  expect(batches[1]![1]).toEqual({ p_metric_version: USAGE_METRIC_VERSION, p_receipts: [receipt, playtime] });
  reloaded.stop();
});

it("does not send a late RPC if Auth only resolves after the usage deadline", async () => {
  vi.useFakeTimers();
  let release!: (value: unknown) => void;
  const rpc = vi.fn();
  const client = { rpc, auth: { getSession: () => new Promise(resolve => { release = resolve; }) } } as unknown as SupabaseClient;
  const transport = createSupabaseUsageTransport(client, config, "usage.late");
  const pending = transport.ingest([receipt], false);
  let error: unknown;
  const settled = pending.catch(value => { error = value; });
  await vi.advanceTimersByTimeAsync(30_001);
  expect(error).toEqual(new Error("Usage service unavailable")); await settled;
  release({ data: { session: { user: { id: "usage.late" }, access_token: "synthetic-token" } }, error: null });
  await Promise.resolve(); await Promise.resolve();
  expect(rpc).not.toHaveBeenCalled();
});

it.each(["rpc", "keepalive", "response-json"])("bounds hung %s work and aborts its actual request", async kind => {
  vi.useFakeTimers();
  let signal: AbortSignal | undefined;
  const response = new Promise<never>(() => {});
  const builder = { setHeader: () => builder, abortSignal: (value: AbortSignal) => { signal = value; return builder; }, then: response.then.bind(response) };
  const rpc = vi.fn(() => builder);
  const client = { rpc, auth: { getSession: async () => ({ data: { session: { user: { id: "usage.deadline" }, access_token: "synthetic-token" } }, error: null }) } } as unknown as SupabaseClient;
  const fetch = vi.fn(async (_url: string, init: RequestInit) => {
    signal = init.signal as AbortSignal;
    return kind === "keepalive" ? response : { ok: true, json: () => response };
  });
  vi.stubGlobal("fetch", fetch);
  const transport = createSupabaseUsageTransport(client, config, "usage.deadline");
  let error: unknown;
  const settled = (kind === "rpc" ? transport.access() : transport.ingest([receipt], true)).catch(value => { error = value; });
  await vi.advanceTimersByTimeAsync(20_000);
  expect(error).toBeUndefined(); expect(signal?.aborted).toBe(false);
  await vi.advanceTimersByTimeAsync(10_001);
  expect(error).toEqual(new Error("Usage service unavailable"));
  expect(signal?.aborted).toBe(true); await settled;
  expect(kind === "rpc" ? rpc : fetch).toHaveBeenCalledTimes(1);
});
