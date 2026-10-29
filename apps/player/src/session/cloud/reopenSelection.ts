import type { CloudAccountRuntime } from "./CloudAccount";
import { cloudCheckDeadline, CLOUD_READ_TIMEOUT_MS } from "./checkDeadline";
import { cloudCopyFamily } from "./copySelection";

export type CampaignReopenDecision = { kind: "open"; campaignId: string } | { kind: "list" } | { kind: "wait" };
type LastCampaign = { campaignId: string | null };

/** Selection is a preference, never permission to play. Automatic opening still
 * verifies admission, every copy, the current head and fenced writer authority.
 * Read fresh sources: the account context may publish access before its list. */
export async function selectCampaignToReopen(runtime: CloudAccountRuntime, offline: boolean): Promise<CampaignReopenDecision> {
  const selected = await cloudCheckDeadline(runtime.entryStore.read<LastCampaign>("last-active-campaign"), CLOUD_READ_TIMEOUT_MS);
  if (selected?.campaignId === null) return { kind: "list" }; // Explicit campaign-screen choice, including across reload.
  if (typeof selected?.campaignId === "string" && selected.campaignId.trim()) return { kind: "open", campaignId: selected.campaignId };

  const [entries, summaries] = await Promise.all([
    cloudCheckDeadline(Promise.resolve(runtime.cache.accountEntries?.(runtime))).then(rows => rows ?? []),
    offline ? [] : cloudCheckDeadline(runtime.transport.list(), CLOUD_READ_TIMEOUT_MS),
  ]);
  const retained = entries.filter(row => row.scope.backendId === runtime.backendId && row.scope.accountId === runtime.accountId);
  if (offline) return retained.length === 1 ? { kind: "open", campaignId: retained[0]!.scope.campaignId } : { kind: "wait" };
  const families = new Set(await Promise.all(retained.map(row => cloudCopyFamily(row.scope.campaignId))));
  const candidates = new Map<string, string>();
  for (const row of summaries) {
    if (row.status !== "resumable") continue;
    const family = await cloudCopyFamily(row.campaignId);
    if (families.has(family)) candidates.set(family, row.campaignId);
  }
  if (candidates.size === 1) return { kind: "open", campaignId: [...candidates.values()][0]! };
  return { kind: candidates.size > 1 ? "list" : "wait" };
}

/** Tiny auxiliary preference. Failure must never reject a verified campaign or
 * discard recovery bytes. A successful UI transition waits for durable readback. */
export async function rememberCampaignToReopen(runtime: CloudAccountRuntime, campaignId: string | null): Promise<void> {
  try { await cloudCheckDeadline(runtime.entryStore.write("last-active-campaign", { campaignId }), CLOUD_READ_TIMEOUT_MS); }
  catch { /* A missing preference can be recovered from a single retained family. */ }
}
