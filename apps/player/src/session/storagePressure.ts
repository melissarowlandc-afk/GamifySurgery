/** Campaign/auth/recovery keys are deliberately absent from this allowlist. */
export type AuxiliaryStorage = Pick<Storage, "getItem" | "setItem"> & Partial<Pick<Storage, "removeItem" | "key" | "length">>;
export const AUXILIARY_ITEM_BYTES = 128 * 1024;
export const AUXILIARY_TOTAL_BYTES = 256 * 1024;
export const AUXILIARY_ARCHIVE_ITEM_BYTES = 512 * 1024;
export const AUXILIARY_ARCHIVE_TOTAL_BYTES = 1024 * 1024;
export const AUXILIARY_RECLAIM_BUDGET_MS = 1_500;
const LOCAL_STORAGE_HEADROOM = 512 * 1024;
const LOCAL_STORAGE_BUDGET = 5 * 1024 * 1024;
const REVIEW_KEY = "gamify-surgery.question-review-flags.v1";
const ARCHIVE_DATABASE = "gamify-surgery.review-archive.v1";
const archiveGenerations = new Map<string, number>();
const OPTIONAL_PREFIXES = ["gamify-surgery.competition.v1", "gamify-surgery.competition-tip.v1",
  "gamify-surgery.casual-mode.v1", "gamify-surgery.prototype.facility-camera.v1",
  "gamify-surgery.prototype.phone-facility-camera.v1", "gamify-surgery.ui.workspace-split.v1",
  "gamify-surgery.presentation-layout.v1"];
const AUXILIARY_PREFIXES = [...OPTIONAL_PREFIXES, REVIEW_KEY, "gamify-surgery.question-flag-outbox.v1", "gamify-surgery.usage.outbox.v1"];
const matches = (key: string, prefix: string) => key === prefix || key.startsWith(`${prefix}.`) || key.startsWith(`${prefix}:`);
const bytes = (key: string, value: string) => 2 * (key.length + value.length);
function read(storage: AuxiliaryStorage, key: string): string | null {
  try { return storage.getItem(key); } catch { return null; }
}

export function browserAuxiliaryStorage(): AuxiliaryStorage | null {
  try { return typeof window === "undefined" ? null : window.localStorage; } catch { return null; }
}
function keys(storage: AuxiliaryStorage): string[] {
  const result: string[] = [];
  try {
    if (typeof storage.key !== "function" || typeof storage.length !== "number") return result;
    for (let i = 0; i < storage.length; i++) { const key = storage.key(i); if (key !== null) result.push(key); }
  } catch { /* A minimal or blocked storage adapter cannot be inventoried. */ }
  return result;
}
export function isStorageQuotaError(error: unknown): boolean {
  const value = error as { name?: string; reason?: string; code?: number } | null;
  return value?.name === "QuotaExceededError" || value?.name === "NS_ERROR_DOM_QUOTA_REACHED" || value?.reason === "quota";
}

/** Auxiliary growth may fail independently; reserve space for the next save. */
export function setAuxiliaryItem(storage: AuxiliaryStorage, key: string, value: string): void {
  if (bytes(key, value) > AUXILIARY_ITEM_BYTES) throw new DOMException("Auxiliary item budget", "QuotaExceededError");
  for (let attempt = 0; attempt < 2; attempt++) {
    const previous = read(storage, key), growth = bytes(key, value) - (previous === null ? 0 : bytes(key, previous));
    let total = 0, auxiliary = 0;
    const inventory = keys(storage);
    for (const candidate of inventory) {
      const text = read(storage, candidate); if (text === null) continue;
      const size = bytes(candidate, text); total += size;
      if (AUXILIARY_PREFIXES.some(prefix => matches(candidate, prefix))) auxiliary += size;
    }
    const crowded = growth > 0 && (auxiliary + growth > AUXILIARY_TOTAL_BYTES ||
      inventory.length > 0 && total + growth > LOCAL_STORAGE_BUDGET - LOCAL_STORAGE_HEADROOM);
    if (crowded) {
      if (attempt === 0 && reclaimOptionalStorage(storage)) continue;
      throw new DOMException("Auxiliary storage budget reserved for campaign saves", "QuotaExceededError");
    }
    try { storage.setItem(key, value); return; }
    catch (error) { if (attempt || !isStorageQuotaError(error) || !reclaimOptionalStorage(storage)) throw error; }
  }
}

/** Synchronous local-save retry: only reconstructible presentation/board caches. */
export function reclaimOptionalStorage(storage: AuxiliaryStorage | null = browserAuxiliaryStorage(), oversizedOnly = false): number {
  if (!storage?.removeItem) return 0;
  let freed = 0;
  const inventory = keys(storage);
  let optionalBytes = 0;
  for (const key of inventory) if (OPTIONAL_PREFIXES.some(prefix => matches(key, prefix))) {
    try { optionalBytes += bytes(key, storage.getItem(key) ?? ""); } catch { /* Leave unreadable data alone. */ }
  }
  if (oversizedOnly && optionalBytes <= AUXILIARY_TOTAL_BYTES / 2) return 0;
  for (const key of inventory) {
    if (!OPTIONAL_PREFIXES.some(prefix => matches(key, prefix))) continue;
    try { const value = storage.getItem(key); if (value === null) continue;
      storage.removeItem(key); freed += bytes(key, value);
    } catch { /* No campaign, auth, flag, usage receipt or recovery is removed. */ }
  }
  return freed;
}

function request<T>(value: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => { value.onsuccess = () => resolve(value.result); value.onerror = () => reject(value.error); });
}
function completion(tx: IDBTransaction): Promise<boolean> {
  return new Promise(resolve => { tx.oncomplete = () => resolve(true); tx.onabort = () => resolve(false); tx.onerror = () => {}; });
}
async function archiveDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!globalThis.indexedDB) { reject(new Error("Review archive unavailable")); return; }
    const opening = indexedDB.open(ARCHIVE_DATABASE, 1); let blocked = false;
    const timer = setTimeout(() => { blocked = true; reject(new Error("Review archive timed out")); }, 2_000);
    opening.onupgradeneeded = () => opening.result.createObjectStore("flags", { keyPath: "key" });
    opening.onerror = () => { clearTimeout(timer); reject(opening.error); };
    opening.onblocked = () => { clearTimeout(timer); blocked = true; reject(new Error("Review archive blocked")); };
    opening.onsuccess = () => { clearTimeout(timer); if (blocked) opening.result.close(); else resolve(opening.result); };
  });
}
function mergeEnvelopes(...values: (string | null)[]): string {
  const flags = new Map<string, Record<string, unknown>>();
  for (const value of values) {
    if (!value) continue;
    const parsed = JSON.parse(value);
    if (parsed?.schemaVersion !== 1 || !Array.isArray(parsed.flags)) throw new Error("Unsupported review flags");
    for (const flag of parsed.flags) {
      // Unknown records remain in the source; never delete a partially readable envelope.
      if (!flag || typeof flag.id !== "string") throw new Error("Unreadable review flag");
      const prior = flags.get(flag.id);
      if (!prior || Number(flag.lastFlaggedAtRealMs) >= Number(prior.lastFlaggedAtRealMs)) flags.set(flag.id, flag);
    }
  }
  return JSON.stringify({ schemaVersion: 1, flags: [...flags.values()] });
}
export async function readArchivedReviewFlags(key: string): Promise<string | null> {
  let db: IDBDatabase | undefined;
  try {
    db = await archiveDatabase(); const tx = db.transaction("flags", "readonly"), done = completion(tx);
    const row = await request(tx.objectStore("flags").get(key));
    if (!await done) return null;
    return typeof row?.value === "string" ? row.value : null;
  } catch { return null; } finally { db?.close(); }
}

/** Move full review snapshots only after a verified IDB copy. No campaign format changes. */
export async function archiveReviewFlags(key: string, value: string, storage: AuxiliaryStorage | null): Promise<boolean> {
  if (!matches(key, REVIEW_KEY)) return false;
  const generation = archiveGenerations.get(key) ?? 0;
  let db: IDBDatabase | undefined;
  try {
    const original = storage?.getItem(key) ?? null;
    db = await archiveDatabase();
    if ((archiveGenerations.get(key) ?? 0) !== generation) return false;
    const tx = db.transaction("flags", "readwrite"), done = completion(tx), store = tx.objectStore("flags");
    try {
      const prior = await request(store.get(key));
      if ((archiveGenerations.get(key) ?? 0) !== generation) { tx.abort(); await done; return false; }
      const merged = mergeEnvelopes(prior?.value ?? null, original, value);
      const rows = await request(store.getAll()) as { key: string; value: string }[];
      const priorSize = typeof prior?.value === "string" ? bytes(key, prior.value) : 0;
      const legacySize = original === null ? 0 : bytes(key, original);
      const total = rows.reduce((size, row) => size + bytes(row.key, row.value), 0);
      const nextSize = bytes(key, merged);
      // Preserve already-existing oversized history, while refusing new growth
      // above the archive budget. Migration never discards old reports.
      if (nextSize > Math.max(AUXILIARY_ARCHIVE_ITEM_BYTES, priorSize + legacySize) ||
        total - priorSize + nextSize > Math.max(AUXILIARY_ARCHIVE_TOTAL_BYTES, total + legacySize)) {
        tx.abort(); await done; return false;
      }
      await request(store.put({ key, value: merged }));
      if (!await done || await readArchivedReviewFlags(key) !== merged) return false;
      if (storage?.getItem(key) === original) storage.removeItem?.(key);
      return true;
    } catch { try { tx.abort(); } catch { /* Already finished. */ } await done; return false; }
  } catch { return false; } finally { db?.close(); }
}
export async function clearArchivedReviewFlags(key: string): Promise<void> {
  archiveGenerations.set(key, (archiveGenerations.get(key) ?? 0) + 1);
  if (!globalThis.indexedDB) return;
  let db: IDBDatabase | undefined;
  try { db = await archiveDatabase(); const tx = db.transaction("flags", "readwrite"), done = completion(tx);
    await request(tx.objectStore("flags").delete(key)); if (!await done) throw new Error("Review archive not cleared");
  } finally { db?.close(); }
}

/** Used on startup and once before retrying a quota-failed cloud write. */
export async function reclaimAuxiliaryStorage(storage: AuxiliaryStorage | null = browserAuxiliaryStorage(), startup = false): Promise<void> {
  if (!storage) return;
  reclaimOptionalStorage(storage, startup);
  const deadline = performance.now() + AUXILIARY_RECLAIM_BUDGET_MS;
  for (const key of keys(storage)) {
    if (!matches(key, REVIEW_KEY)) continue;
    try {
      const value = storage.getItem(key);
      if (value && (!startup || bytes(key, value) > AUXILIARY_ITEM_BYTES)) {
        const remaining = deadline - performance.now();
        if (remaining <= 0) return;
        // Auxiliary IDB housekeeping can finish in the background, but a hung
        // archive must never hold campaign startup/checkpoint recovery forever.
        await new Promise<void>(resolve => {
          const timer = setTimeout(resolve, remaining);
          void archiveReviewFlags(key, value, storage).finally(() => { clearTimeout(timer); resolve(); });
        });
      }
    } catch { /* Original bytes are retained if archiving is unavailable/full. */ }
  }
}
