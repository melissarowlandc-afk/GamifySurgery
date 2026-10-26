import { cloudCampaignStorageKey } from "../accountStorageKey";
import { sha256Utf8 } from "./codecJson";
import { CloudSyncError } from "./transport";

export interface CloudEntryStore {
  read<T>(key: string): Promise<T | null>;
  write<T>(key: string, value: T): Promise<T>;
  create<T>(key: string, value: T): Promise<T>;
  compareAndSet<T>(key: string, expected: T, value: T): Promise<T>;
  entries(): Promise<{ key: string; value: unknown }[]>;
  clear(): Promise<void>;
}
interface Stored { key: string; text: string; sha256: string }
const DATABASE = "gamify-surgery.cloud-entry.v1";
const STORE = "records";
const clone = <T>(value: T): T => structuredClone(value);
function request<T>(req: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => { req.onsuccess = () => resolve(req.result); req.onerror = () => reject(new CloudSyncError("storage")); });
}
function completion(tx: IDBTransaction): Promise<boolean> {
  return new Promise(resolve => { tx.oncomplete = () => resolve(true); tx.onabort = () => resolve(false); tx.onerror = () => {}; });
}

/** Account/backend-scoped raw sources, frozen imports and additive enrollment markers. */
export class IndexedDbCloudEntryStore implements CloudEntryStore {
  private readonly prefix: string;
  private database: Promise<IDBDatabase> | null = null;
  constructor(scope: { backendId: string; accountId: string }, private readonly factory = globalThis.indexedDB,
    private readonly databaseName = DATABASE) {
    this.prefix = `${cloudCampaignStorageKey({ ...scope, campaignId: "entry" })}:`;
  }
  private open(): Promise<IDBDatabase> {
    if (this.database) return this.database;
    this.database = new Promise((resolve, reject) => {
      if (!this.factory) return reject(new CloudSyncError("storage"));
      const opening = this.factory.open(this.databaseName, 1); let blocked = false;
      opening.onupgradeneeded = () => opening.result.createObjectStore(STORE, { keyPath: "key" });
      opening.onerror = () => reject(new CloudSyncError("storage"));
      opening.onblocked = () => { blocked = true; reject(new CloudSyncError("storage")); };
      opening.onsuccess = () => {
        if (blocked) { opening.result.close(); return; }
        opening.result.onversionchange = () => { opening.result.close(); this.database = null; };
        resolve(opening.result);
      };
    });
    this.database.catch(() => { this.database = null; }); return this.database;
  }
  private async unpack<T>(raw: Stored): Promise<T> {
    if (!raw.key.startsWith(this.prefix) || typeof raw.text !== "string" || await sha256Utf8(raw.text) !== raw.sha256) throw new CloudSyncError("storage");
    return JSON.parse(raw.text) as T;
  }
  async read<T>(key: string): Promise<T | null> {
    try {
      const db = await this.open(), tx = db.transaction(STORE, "readonly"), done = completion(tx);
      const raw = await request(tx.objectStore(STORE).get(this.prefix + key)) as Stored | undefined;
      if (!await done) throw new CloudSyncError("storage");
      return raw ? this.unpack<T>(raw) : null;
    } catch { throw new CloudSyncError("storage"); }
  }
  private async put<T>(key: string, value: T, onlyAbsent: boolean): Promise<T> {
    try {
      const text = JSON.stringify(value);
      const raw: Stored = { key: this.prefix + key, text, sha256: await sha256Utf8(text) };
      const db = await this.open(), tx = db.transaction(STORE, "readwrite"), done = completion(tx), store = tx.objectStore(STORE);
      const prior = await request(store.get(raw.key)) as Stored | undefined;
      if (!onlyAbsent || !prior) await request(store.put(raw));
      if (!await done) throw new CloudSyncError("storage");
      const selected = onlyAbsent && prior ? prior : raw, readback = await this.read<T>(key);
      if (JSON.stringify(readback) !== selected.text) throw new CloudSyncError("storage");
      return readback!;
    } catch (error) { throw error instanceof CloudSyncError ? error : new CloudSyncError("storage"); }
  }
  write<T>(key: string, value: T): Promise<T> { return this.put(key, value, false); }
  create<T>(key: string, value: T): Promise<T> { return this.put(key, value, true); }
  async compareAndSet<T>(key: string, expected: T, value: T): Promise<T> {
    const expectedText = JSON.stringify(expected), text = JSON.stringify(value);
    const expectedHash = await sha256Utf8(expectedText), sha256 = await sha256Utf8(text);
    const db = await this.open(), tx = db.transaction(STORE, "readwrite"), done = completion(tx), store = tx.objectStore(STORE);
    const prior = await request(store.get(this.prefix + key)) as Stored | undefined;
    if (prior?.text === expectedText && prior.sha256 === expectedHash) await request(store.put({ key: this.prefix + key, text, sha256 }));
    if (!await done) throw new CloudSyncError("storage");
    const selected = await this.read<T>(key);
    if (selected === null) throw new CloudSyncError("storage");
    return selected;
  }
  async entries(): Promise<{ key: string; value: unknown }[]> {
    const db = await this.open(), tx = db.transaction(STORE, "readonly"), done = completion(tx);
    const rows = await request(tx.objectStore(STORE).getAll(IDBKeyRange.bound(this.prefix, this.prefix + "\uffff"))) as Stored[];
    if (!await done) throw new CloudSyncError("storage");
    return Promise.all(rows.filter(row => row.key.startsWith(this.prefix)).map(async row => ({ key: row.key.slice(this.prefix.length), value: await this.unpack(row) })));
  }
  async clear(): Promise<void> {
    const db = await this.open(), tx = db.transaction(STORE, "readwrite"), done = completion(tx), store = tx.objectStore(STORE);
    for (const key of await request(store.getAllKeys(IDBKeyRange.bound(this.prefix, this.prefix + "\uffff")))) if (typeof key === "string" && key.startsWith(this.prefix)) await request(store.delete(key));
    if (!await done) throw new CloudSyncError("storage");
  }
}
export class MemoryCloudEntryStore implements CloudEntryStore {
  readonly records = new Map<string, unknown>();
  async read<T>(key: string): Promise<T | null> { return clone(this.records.get(key) as T ?? null); }
  async write<T>(key: string, value: T): Promise<T> { this.records.set(key, clone(value)); return clone(value); }
  async create<T>(key: string, value: T): Promise<T> { return this.records.has(key) ? clone(this.records.get(key) as T) : this.write(key, value); }
  async compareAndSet<T>(key: string, expected: T, value: T): Promise<T> {
    if (JSON.stringify(this.records.get(key)) === JSON.stringify(expected)) this.records.set(key, clone(value));
    if (!this.records.has(key)) throw new CloudSyncError("storage");
    return clone(this.records.get(key) as T);
  }
  async entries(): Promise<{ key: string; value: unknown }[]> { return [...this.records].map(([key, value]) => ({ key, value: clone(value) })); }
  async clear(): Promise<void> { this.records.clear(); }
}
