import { cloudCampaignStorageKey } from "../accountStorageKey";
import { sha256Utf8, utf8Bytes } from "./codecJson";
import { CLOUD_RECOVERY_BYTES, CloudSyncError, type CloudScope } from "./transport";
import type { CloudCacheEntry, CloudCacheRead } from "./cache";

export class CloudCacheError extends CloudSyncError {
  constructor(readonly reason: "unavailable" | "blocked" | "transaction" | "quota" | "checksum" | "version" | "conflict" | "capacity") {
    super(reason === "capacity" ? "capacity" : "storage");
  }
}
export interface StoredCache { key: string; cacheRevision: number; text: string; sha256: string; utf8Bytes: number }

export function cloudRecoveryBytes(entry: CloudCacheEntry): number {
  return utf8Bytes(JSON.stringify({ schemaVersion: entry.schemaVersion, scope: entry.scope, recovery: entry.recovery }));
}
export async function packCloudCache(entry: CloudCacheEntry, expected: number | null): Promise<StoredCache> {
  if (entry.schemaVersion !== 1) throw new CloudCacheError("version");
  if (entry.confirmed.campaignId !== entry.scope.campaignId) throw new CloudCacheError("checksum");
  if (cloudRecoveryBytes(entry) > CLOUD_RECOVERY_BYTES) throw new CloudCacheError("capacity");
  const text = JSON.stringify(entry);
  return { key: cloudCampaignStorageKey(entry.scope), cacheRevision: (expected ?? 0) + 1,
    text, sha256: await sha256Utf8(text), utf8Bytes: utf8Bytes(text) };
}
export async function unpackCloudCache(raw: StoredCache, scope: CloudScope): Promise<CloudCacheRead> {
  try {
    if (raw.key !== cloudCampaignStorageKey(scope) || !Number.isSafeInteger(raw.cacheRevision) || raw.cacheRevision < 1 ||
      typeof raw.text !== "string" || raw.text.length > 24_000_000 || raw.utf8Bytes !== utf8Bytes(raw.text) ||
      raw.sha256 !== await sha256Utf8(raw.text)) throw new CloudCacheError("checksum");
    const entry = JSON.parse(raw.text) as CloudCacheEntry;
    if (entry.schemaVersion !== 1) throw new CloudCacheError("version");
    if (cloudCampaignStorageKey(entry.scope) !== raw.key || entry.confirmed.campaignId !== scope.campaignId ||
      cloudRecoveryBytes(entry) > CLOUD_RECOVERY_BYTES) throw new CloudCacheError("checksum");
    return { cacheRevision: raw.cacheRevision, entry };
  } catch (error) {
    if (error instanceof CloudCacheError) throw error;
    throw new CloudCacheError("checksum");
  }
}
