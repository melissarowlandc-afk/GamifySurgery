import type { SupabaseClient } from "@supabase/supabase-js";
import type { HostedAuthConfiguration } from "../auth/prototypeAuth";
import { USAGE_METRIC_VERSION, type UsageAccess, type UsageReceipt, type UsageTransport } from "./usageTypes";

/** No tokens/keys are stored in the usage queue or returned to the UI. */
export function createSupabaseUsageTransport(client: SupabaseClient, configuration: HostedAuthConfiguration,
  accountId: string): UsageTransport {
  async function token(): Promise<string> {
    const { data, error } = await client.auth.getSession();
    if (error || !data.session || data.session.user.id !== accountId) throw new Error("Usage account unavailable");
    return data.session.access_token;
  }

  async function rpc(name: string, args: Record<string, unknown> = {}): Promise<unknown> {
    const accessToken = await token();
    // Pin the departing account's token; a later Auth change cannot redirect a batch.
    const { data, error } = await client.rpc(name, args).setHeader("Authorization", `Bearer ${accessToken}`);
    if (error) throw new Error("Usage service unavailable");
    return data;
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
      const accessToken = await token();
      const response = await fetch(`${configuration.supabaseUrl.replace(/\/$/, "")}/rest/v1/rpc/ingest_player_usage`, {
        method: "POST", keepalive: true,
        headers: { apikey: configuration.supabaseAnonKey, Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
        body: JSON.stringify(args),
      });
      if (!response.ok) throw new Error("Usage service unavailable");
      return acknowledged(await response.json());
    },
    async requestDeletion() { await rpc("request_usage_data_deletion"); },
  };
}
