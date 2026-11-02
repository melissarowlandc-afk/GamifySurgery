import type { CloudEntryStore } from "./entryStorage";
import type { CloudConfirmed } from "./transport";
import type { VerifiedCopyInspection } from "./copySelection";

/** Optional display metadata only. Never authority or a progress-selection input. */
export async function readCampaignPreview(store: CloudEntryStore, id: string, revision: string): Promise<number | null> {
  const preview = await store.read<{ revision: string; facilityLevel?: number }>(`preview:${id}`);
  const marker = preview?.revision === revision ? preview : await store.read<{ revision: string; facilityLevel?: number }>(`enrolled:${id}`);
  return marker?.revision === revision && Number.isInteger(marker.facilityLevel) && marker.facilityLevel! >= 0 ? marker.facilityLevel! : null;
}
export async function rememberCampaignPreview(store: CloudEntryStore, copy: CloudConfirmed, inspection: VerifiedCopyInspection): Promise<void> {
  await store.write(`preview:${copy.campaignId}`, { revision: copy.revision, facilityLevel: inspection.progress.level });
}
