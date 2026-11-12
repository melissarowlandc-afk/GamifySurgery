import type { CloudEntryStore } from "./entryStorage";
import { CloudSyncError, type CloudLease, type CloudScope, type CloudTransport } from "./transport";
import { cloudCheckDeadline, CLOUD_READ_TIMEOUT_MS } from "./checkDeadline";

export type WriterAcquisition = Parameters<CloudTransport["acquire"]>[0] & { writerToken: string };
interface WriterIdentity { scope: CloudScope; lease: CloudLease | null; acquisition: WriterAcquisition | null }
const key = (scope: CloudScope) => `writer:${scope.campaignId}`;
const sameScope = (a: CloudScope, b: CloudScope) => a.backendId === b.backendId && a.accountId === b.accountId && a.campaignId === b.campaignId;
async function bounded<T>(request: Promise<T>): Promise<T | null> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try { return await Promise.race([request, new Promise<null>(resolve => { timer = setTimeout(() => resolve(null), 1_500); })]); }
  finally { clearTimeout(timer); }
}
export async function readOptionalCloudEntry<T>(store: CloudEntryStore, name: string): Promise<T | null> {
  try { return await bounded(store.read<T>(name)); } catch { return null; }
}

/** At most one tiny journal per campaign, separate from every campaign/save format.
 * Tokens prove ownership to the existing lease RPC; dates here never grant play.
 * Intent must be durable before its RPC. It is recovery proof, not a cache.
 */
export async function readWriterIdentity(store: CloudEntryStore | undefined, scope: CloudScope): Promise<WriterIdentity | null> {
  try {
    const value = store ? await cloudCheckDeadline(store.read<WriterIdentity>(key(scope)), CLOUD_READ_TIMEOUT_MS) : null;
    if (!value?.scope || !sameScope(value.scope, scope) || JSON.stringify(value).length > 4096) return null;
    const valid = (proof: { campaignId: string; writerToken?: string; writerGeneration?: string; expectedWriterGeneration?: string }) =>
      proof.campaignId === scope.campaignId && typeof proof.writerToken === "string" && proof.writerToken.length > 0 && proof.writerToken.length <= 256 &&
      /^\d{1,19}$/.test(proof.writerGeneration ?? proof.expectedWriterGeneration ?? "");
    if (value.lease && !valid(value.lease) || value.acquisition && !valid(value.acquisition)) return null;
    return value;
  } catch { return null; }
}
export async function writeWriterIdentity(store: CloudEntryStore | undefined, scope: CloudScope,
  lease: CloudLease | null, acquisition: WriterAcquisition | null = null): Promise<boolean> {
  if (!store) return true; // Nonpersistent coordinators do not promise relaunch proof.
  const value: WriterIdentity = { scope, lease, acquisition };
  try {
    return await cloudCheckDeadline((async () => {
      const previous = await store.read<WriterIdentity>(key(scope));
      const generation = (record: WriterIdentity) => {
        const expected = record.acquisition?.expectedWriterGeneration, confirmed = record.lease?.writerGeneration;
        if (typeof expected === "string" && /^\d{1,19}$/.test(expected)) return BigInt(expected) + 1n;
        return typeof confirmed === "string" && /^\d{1,19}$/.test(confirmed) ? BigInt(confirmed) : null;
      };
      const previousGeneration = previous?.scope && sameScope(previous.scope, scope) ? generation(previous) : null, nextGeneration = generation(value);
      if (previousGeneration !== null && nextGeneration !== null && previousGeneration > nextGeneration) throw new CloudSyncError("writer");
      // CAS also fences a late completion in an old document: it may not replace
      // a newer document's intent/lease after its bounded caller has timed out.
      let written: WriterIdentity | null = previous === null ? await store.create(key(scope), value) :
        await store.compareAndSet(key(scope), previous, value);
      // JSON null was a tolerated old value, distinct from an absent record in
      // IDB's create-if-absent operation. Repair it with its own checked CAS.
      if (written === null) written = await store.compareAndSet<WriterIdentity | null>(key(scope), null, value);
      if (JSON.stringify(written) !== JSON.stringify(value) || JSON.stringify(await store.read(key(scope))) !== JSON.stringify(value)) throw new CloudSyncError("writer");
      return true;
    })(), CLOUD_READ_TIMEOUT_MS);
  } catch (error) {
    if (error instanceof CloudSyncError && ["network", "writer"].includes(error.code)) throw error;
    return false; // A completed storage denial cannot prevent independent campaign persistence.
  }
}
export function newWriterToken(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)), value => value.toString(16).padStart(2, "0")).join("");
}
