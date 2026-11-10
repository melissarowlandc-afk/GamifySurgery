import type { SupabaseClient } from "@supabase/supabase-js";
import type { HostedAuthConfiguration } from "../auth/prototypeAuth";
import { USAGE_METRIC_VERSION, type UsageAccess, type UsageReceipt, type UsageTransport } from "./usageTypes";

export const USAGE_REQUEST_TIMEOUT_MS = 30_000;

/** No tokens/keys are stored in the usage queue or returned to the UI. */
export function createSupabaseUsageTransport(client: SupabaseClient, configuration: HostedAuthConfiguration,
  accountId: string): UsageTransport {
  // Include Auth, HTTP and JSON decoding in one deadline. A lost request must
  // release the tracker's single-flight slot, leaving its immutable outbox for
  // the existing bounded retry/next launch. Abort the actual fetch as well.
  async function request<T>(run: (signal: AbortSignal, checkActive: () => void) => Promise<T>): Promise<T> {
    const controller = new AbortController();
    let expired = false;
    const checkActive = () => { if (expired) throw new Error("Usage service unavailable"); };
    let timer: ReturnType<typeof setTimeout> | undefined;
    const timeout = new Promise<never>((_, reject) => {
      timer = setTimeout(() => { expired = true; controller.abort(); reject(new Error("Usage service unavailable")); }, USAGE_REQUEST_TIMEOUT_MS);
    });
    try { return await Promise.race([run(controller.signal, checkActive), timeout]); }
    finally { clearTimeout(timer); }
  }

  async function token(): Promise<string> {
    const { data, error } = await client.auth.getSession();
    if (error || !data.session || data.session.user.id !== accountId) throw new Error("Usage account unavailable");
    return data.session.access_token;
  }

  async function rpc(name: string, args: Record<string, unknown> = {}): Promise<unknown> {
    return request(async (signal, checkActive) => {
      const accessToken = await token(); checkActive();
      // Pin the departing account's token; a later Auth change cannot redirect a batch.
      const query = client.rpc(name, args).setHeader("Authorization", `Bearer ${accessToken}`);
      const { data, error } = await (query.abortSignal?.(signal) ?? query);
      checkActive();
      if (error) throw new Error("Usage service unavailable");
      return data;
    });
  }

  function acknowledged(data: unknown): string[] {
    const value = data as { acknowledged_receipt_ids?: unknown } | null;
    if (!Array.isArray(value?.acknowledged_receipt_ids) || !value.acknowledged_receipt_ids.every((id) => typeof id === "string")) {
      throw new Error("Usage acknowledgement unavailable");
    }
    return value.acknowledged_receipt_ids;
  }

  return {
    async access() {
      const data = await rpc("get_usage_access") as Partial<UsageAccess> | null;
      if (typeof data?.admitted !== "boolean" || typeof data.notice_accepted !== "boolean" || typeof data.deletion_requested !== "boolean" ||
          (data.casual !== undefined && typeof data.casual !== "boolean")) {
        throw new Error("Usage access unavailable");
      }
      return { admitted: data.admitted, notice_accepted: data.notice_accepted, deletion_requested: data.deletion_requested,
        casual: data.admitted && !data.deletion_requested && data.casual === true };
    },
    async acceptNotice(version) { await rpc("accept_usage_notice", { p_version: version }); },
    async ingest(receipts: readonly UsageReceipt[], keepalive) {
      const args = { p_receipts: receipts, p_metric_version: USAGE_METRIC_VERSION };
      if (!keepalive) return acknowledged(await rpc("ingest_player_usage", args));
      return request(async (signal, checkActive) => {
        const accessToken = await token(); checkActive();
        const response = await fetch(`${configuration.supabaseUrl.replace(/\/$/, "")}/rest/v1/rpc/ingest_player_usage`, {
          method: "POST", keepalive: true, signal,
          headers: { apikey: configuration.supabaseAnonKey, Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
          body: JSON.stringify(args),
        });
        if (!response.ok) throw new Error("Usage service unavailable");
        const data = await response.json(); checkActive();
        return acknowledged(data);
      });
    },
    async requestDeletion() { await rpc("request_usage_data_deletion"); },
  };
}
