import type { CloudAccountRuntime } from "./CloudAccount";
import { cloudCodec } from "./codecWorker";
import { cloudCheckDeadline } from "./checkDeadline";
import { sha256Utf8, utf8Bytes } from "./codecJson";
import { importSeparateCloudCampaign } from "./importCampaigns";
import type { ProtectedClinicCopy } from "./retainedCopies";
import { CloudSyncError } from "./transport";

export interface OlderClinicCopy {
  key: string; name: string; dayTime: string; cash: number; facilityTick: number;
}
export async function listOlderClinicCopies(runtime: CloudAccountRuntime): Promise<OlderClinicCopy[]> {
  const result: OlderClinicCopy[] = [], seen = new Set<string>();
  for (const row of await runtime.entryStore.entries()) {
    if (!row.key.startsWith("older-copy:")) continue;
    const record = row.value as ProtectedClinicCopy;
    if (record?.version !== 1) continue;
    try {
      const inspected = await cloudCodec.run({ kind: "inspectCopy", input: record.copy });
      if (seen.has(inspected.digest)) continue;
      seen.add(inspected.digest);
      result.push({ key: row.key, name: inspected.campaign.name, dayTime: inspected.progress.dayTime,
        cash: inspected.progress.cash, facilityTick: inspected.progress.facilityTick });
    } catch { /* The complete device export still contains unreadable originals. */ }
  }
  return result.sort((a, b) => b.facilityTick - a.facilityTick || a.key.localeCompare(b.key));
}
export async function exportOlderClinicCopy(runtime: CloudAccountRuntime, key: string): Promise<string> {
  if (!key.startsWith("older-copy:")) throw new CloudSyncError("corrupt");
  const record = await runtime.entryStore.read<ProtectedClinicCopy>(key);
  if (record?.version !== 1) throw new CloudSyncError("storage");
  await cloudCodec.run({ kind: "inspectCopy", input: record.copy });
  return JSON.stringify({ version: 1, backendId: runtime.backendId, accountId: runtime.accountId, retainedCopy: record });
}
/** Support restoration creates an independent campaign; it never rewinds or
 * changes the immutable history of the currently playing campaign. */
export async function restoreOlderClinicCopy(runtime: CloudAccountRuntime, key: string): Promise<string> {
  return cloudCheckDeadline((async () => {
    if (!key.startsWith("older-copy:")) throw new CloudSyncError("corrupt");
    const record = await runtime.entryStore.read<ProtectedClinicCopy>(key);
    if (record?.version !== 1) throw new CloudSyncError("storage");
    const inspected = await cloudCodec.run({ kind: "inspectCopy", input: record.copy });
    const summaries = await runtime.transport.list();
    const campaignId = `restored.${await sha256Utf8(key)}`;
    let name = inspected.campaign.name, count = 1;
    for (;;) {
      const suffix = ` (restored${count === 1 ? "" : ` ${count}`})`, letters = Array.from(inspected.campaign.name);
      while (utf8Bytes(letters.join("") + suffix) > 160) letters.pop();
      name = letters.join("") + suffix;
      if (!summaries.some(row => row.name.toLowerCase() === name.toLowerCase() && row.campaignId !== campaignId)) break;
      count++;
    }
    if (!summaries.some(row => row.campaignId === campaignId)) {
      if (summaries.length >= 2) throw new CloudSyncError("capacity");
      await importSeparateCloudCampaign(record.copy, runtime.transport, runtime.entryStore, { campaignId, name, status: "resumable" });
    }
    await runtime.entryStore.write("last-active-campaign", { campaignId });
    return campaignId;
  })());
}
