import type { CloudEntryStore } from "./entryStorage";
import type { CloudLease, CloudScope, CloudTransport } from "./transport";

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
 * Storage denial degrades to waiting for the previous lease, never a takeover.
 */
export async function readWriterIdentity(store: CloudEntryStore | undefined, scope: CloudScope): Promise<WriterIdentity | null> {
  try {
    const value = store ? await readOptionalCloudEntry<WriterIdentity>(store, key(scope)) : null;
    if (!value?.scope || !sameScope(value.scope, scope) || JSON.stringify(value).length > 4096) return null;
    const valid = (proof: { campaignId: string; writerToken?: string; writerGeneration?: string; expectedWriterGeneration?: string }) =>
      proof.campaignId === scope.campaignId && typeof proof.writerToken === "string" && proof.writerToken.length > 0 && proof.writerToken.length <= 256 &&
      /^\d{1,19}$/.test(proof.writerGeneration ?? proof.expectedWriterGeneration ?? "");
    if (value.lease && !valid(value.lease) || value.acquisition && !valid(value.acquisition)) return null;
    return value;
  } catch { return null; }
}
export async function writeWriterIdentity(store: CloudEntryStore | undefined, scope: CloudScope,
  lease: CloudLease | null, acquisition: WriterAcquisition | null = null): Promise<void> {
  try { if (store) await bounded(store.write(key(scope), { scope, lease, acquisition } satisfies WriterIdentity)); }
  catch { /* Auxiliary proof cannot prevent a durable campaign save. */ }
}
export function newWriterToken(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)), value => value.toString(16).padStart(2, "0")).join("");
}
