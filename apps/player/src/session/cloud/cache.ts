import { cloudCampaignStorageKey } from "../accountStorageKey";
import { cloudCodec } from "./codecWorker";
import { CloudCacheError, type StoredCache } from "./codecCache";
export { CloudCacheError, cloudRecoveryBytes } from "./codecCache";
import { type CloudCandidate, type CloudConfirmed, type CloudFrozenOperation, type CloudScope } from "./transport";

export const CLOUD_CACHE_DATABASE = "gamify-surgery.cloud-cache.v1";
const STORE = "campaigns";
export interface CloudRecovery {
  baseRevision: string;
  writerGeneration: string;
  inFlight: CloudFrozenOperation | null;
  following: CloudCandidate | null;
}
export interface CloudCacheEntry {
  schemaVersion: 1;
  scope: CloudScope;
  confirmed: CloudConfirmed;
  recovery: CloudRecovery | null;
}
export interface CloudCacheRead { cacheRevision: number; entry: CloudCacheEntry }
export interface CloudCache {
  read(scope: CloudScope): Promise<CloudCacheRead | null>;
  write(entry: CloudCacheEntry, expectedCacheRevision: number | null): Promise<CloudCacheRead>;
  accountEntries?(scope: Pick<CloudScope, "backendId" | "accountId">): Promise<CloudCacheEntry[]>;
  clearAccount?(scope: Pick<CloudScope, "backendId" | "accountId">): Promise<void>;
}
const copy = <T>(value: T): T => structuredClone(value);
const pack = (entry: CloudCacheEntry, expected: number | null) => cloudCodec.run({ kind: "packCache", input: { entry, expected } });
const unpack = (raw: StoredCache, scope: CloudScope) => cloudCodec.run({ kind: "unpackCache", input: { raw, scope } });
function request<T>(value: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    value.onsuccess = () => resolve(value.result);
    value.onerror = () => reject(new CloudCacheError("transaction"));
  });
}
function completion(tx: IDBTransaction): Promise<boolean> {
  return new Promise(resolve => {
    tx.oncomplete = () => resolve(true);
    tx.onabort = () => resolve(false);
    tx.onerror = () => { /* onabort is terminal */ };
  });
}
export interface CloudCacheTestHooks {
  beforeCommit?: (tx: IDBTransaction) => void;
  afterCommit?: () => void | Promise<void>;
}

/** Separate database; the original global local repository is never opened/migrated. */
export class IndexedDbCloudCache implements CloudCache {
  private database: Promise<IDBDatabase> | null = null;
  constructor(private readonly factory: IDBFactory | null = globalThis.indexedDB ?? null,
    private readonly databaseName = CLOUD_CACHE_DATABASE, private readonly hooks: CloudCacheTestHooks = {}) {}

  private open(): Promise<IDBDatabase> {
    if (this.database) return this.database;
    this.database = new Promise((resolve, reject) => {
      if (!this.factory) { reject(new CloudCacheError("unavailable")); return; }
      let opening: IDBOpenDBRequest;
      try { opening = this.factory.open(this.databaseName, 1); }
      catch { reject(new CloudCacheError("unavailable")); return; }
      let blocked = false;
      opening.onupgradeneeded = () => { opening.result.createObjectStore(STORE, { keyPath: "key" }); };
      opening.onerror = () => reject(new CloudCacheError("unavailable"));
      opening.onblocked = () => { blocked = true; reject(new CloudCacheError("blocked")); };
      opening.onsuccess = () => {
        if (blocked) { opening.result.close(); return; }
        opening.result.onversionchange = () => { opening.result.close(); this.database = null; };
        resolve(opening.result);
      };
    });
    this.database.catch(() => { this.database = null; });
    return this.database;
  }
  async read(scope: CloudScope, expectedText?: string): Promise<CloudCacheRead | null> {
    const db = await this.open();
    try {
      const tx = db.transaction(STORE, "readonly"), done = completion(tx);
      const raw = await request(tx.objectStore(STORE).get(cloudCampaignStorageKey(scope))) as StoredCache | undefined;
      if (!await done) throw new CloudCacheError("transaction");
      if (expectedText !== undefined && raw?.text !== expectedText) throw new CloudCacheError("conflict");
      return raw ? unpack(raw, scope) : null;
    } catch (error) {
      if (error instanceof CloudCacheError) throw error;
      throw new CloudCacheError("transaction");
    }
  }
  async write(entry: CloudCacheEntry, expected: number | null): Promise<CloudCacheRead> {
    const stored = await pack(entry, expected), db = await this.open();
    const write = async () => {
      const tx = db.transaction(STORE, "readwrite"), done = completion(tx);
      try {
        const store = tx.objectStore(STORE), current = await request(store.get(stored.key)) as StoredCache | undefined;
        if ((current?.cacheRevision ?? null) !== expected) throw new CloudCacheError("conflict");
        await request(store.put(stored));
        this.hooks.beforeCommit?.(tx);
        if (!await done) throw new CloudCacheError("transaction");
        await this.hooks.afterCommit?.();
        const readback = await this.read(entry.scope, stored.text);
        if (!readback || readback.cacheRevision !== stored.cacheRevision) {
          throw new CloudCacheError("conflict");
        }
        return readback;
      } catch (error) {
        try { tx.abort(); } catch { /* already completed */ }
        await done;
        if (error instanceof CloudCacheError) throw error;
        throw new CloudCacheError("transaction");
      }
    };
    // The IDB compare-and-swap also fences tabs when Web Locks is unavailable.
    const locks = typeof navigator === "undefined" ? undefined : navigator.locks;
    return locks ? locks.request(stored.key, write) : write();
  }
  async close(): Promise<void> { if (this.database) (await this.database).close(); this.database = null; }
  async accountEntries(scope: Pick<CloudScope, "backendId" | "accountId">): Promise<CloudCacheEntry[]> {
    const db = await this.open(), tx = db.transaction(STORE, "readonly"), done = completion(tx);
    const prefix = cloudCampaignStorageKey({ ...scope, campaignId: "_" }).slice(0, -1);
    const records = await request(tx.objectStore(STORE).getAll(IDBKeyRange.bound(prefix, prefix + "\uffff"))) as StoredCache[];
    if (!await done) throw new CloudCacheError("transaction");
    const entries: CloudCacheEntry[] = [];
    for (const raw of records.filter(row => row.key.startsWith(prefix))) {
      const campaignId = decodeURIComponent(raw.key.slice(prefix.length));
      entries.push((await unpack(raw, { ...scope, campaignId })).entry);
    }
    return entries;
  }
  async clearAccount(scope: Pick<CloudScope, "backendId" | "accountId">): Promise<void> {
    const db = await this.open(), tx = db.transaction(STORE, "readwrite"), done = completion(tx), store = tx.objectStore(STORE);
    const prefix = cloudCampaignStorageKey({ ...scope, campaignId: "_" }).slice(0, -1);
    const keys = await request(store.getAllKeys(IDBKeyRange.bound(prefix, prefix + "\uffff")));
    for (const key of keys) if (typeof key === "string" && key.startsWith(prefix)) await request(store.delete(key));
    if (!await done) throw new CloudCacheError("transaction");
  }
}

/** Faults model both sides of the local commit boundary without a browser. */
export class MemoryCloudCache implements CloudCache {
  readonly records = new Map<string, StoredCache>();
  fault: "before-commit" | "after-commit" | "corrupt" | null = null;
  async read(scope: CloudScope): Promise<CloudCacheRead | null> {
    const raw = this.records.get(cloudCampaignStorageKey(scope));
    return raw ? unpack(copy(raw), scope) : null;
  }
  async write(entry: CloudCacheEntry, expected: number | null): Promise<CloudCacheRead> {
    const stored = await pack(copy(entry), expected);
    if ((this.records.get(stored.key)?.cacheRevision ?? null) !== expected) throw new CloudCacheError("conflict");
    const fault = this.fault; this.fault = null;
    if (fault === "before-commit") throw new CloudCacheError("transaction");
    this.records.set(stored.key, stored);
    if (fault === "after-commit") throw new CloudCacheError("transaction");
    if (fault === "corrupt") stored.text += " ";
    return (await this.read(entry.scope))!;
  }
  async accountEntries(scope: Pick<CloudScope, "backendId" | "accountId">): Promise<CloudCacheEntry[]> {
    const prefix = cloudCampaignStorageKey({ ...scope, campaignId: "_" }).slice(0, -1);
    const result: CloudCacheEntry[] = [];
    for (const row of this.records.values()) if (row.key.startsWith(prefix)) {
      result.push((await unpack(row, { ...scope, campaignId: decodeURIComponent(row.key.slice(prefix.length)) })).entry);
    }
    return result;
  }
  async clearAccount(scope: Pick<CloudScope, "backendId" | "accountId">): Promise<void> {
    const prefix = cloudCampaignStorageKey({ ...scope, campaignId: "_" }).slice(0, -1);
    for (const key of this.records.keys()) if (key.startsWith(prefix)) this.records.delete(key);
  }
}
