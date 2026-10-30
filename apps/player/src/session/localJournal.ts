import type { GameEvidenceCheckpoint, GameEvidenceDelta } from "@gamify-surgery/game-domain";
import { CloudCacheError } from "./cloud/codecCache";
import type { CloudCampaignMetadata } from "./cloud/codec";
import type { CloudSourceProvenance } from "./cloud/codecEvidence";
import type { CloudCandidate, CloudConfirmed } from "./cloud/transport";
import type { QuestionUsageReceipt } from "../playtime/usageTypes";
import { observeStorage, problemDiagnostics } from "../diagnostics/problemDiagnostics";
import { isStorageQuotaError, reclaimAuxiliaryStorage } from "./storagePressure";
import { sha256Utf8 } from "./cloud/codecJson";

export const LOCAL_JOURNAL_DATABASE = "gamify-surgery.local-journal.v1";
export const LOCAL_COMMIT_MS = 250;
export const LOCAL_TICK_COMMIT_MS = 1_000;
export const LOCAL_COMPACTION_MS = 5 * 60_000;
export const LOCAL_JOURNAL_QUEUE_LIMIT = 128;
/** Adopt an already verified, privately owned import once. Stable frozen
 * checkpoints let the incremental evidence index retain its exact parent. */
export function freezeJournalCheckpoint<T>(value: T): T {
  if (value !== null && typeof value === "object" && !Object.isFrozen(value)) {
    for (const child of Object.values(value)) freezeJournalCheckpoint(child);
    Object.freeze(value);
  }
  return value;
}
export interface JournalSeed {
  checkpoint: GameEvidenceCheckpoint;
  campaign: CloudCampaignMetadata;
  source: CloudSourceProvenance | null;
  confirmed: CloudConfirmed | null;
  /** Small local-profile metadata, without any serialized campaign states. */
  profile?: unknown;
  usageQuestions: QuestionUsageReceipt[];
  writerGeneration?: string;
}
export interface JournalRow {
  version: number;
  delta: GameEvidenceDelta | null;
  campaign: CloudCampaignMetadata;
  usageQuestions: QuestionUsageReceipt[];
  profile?: unknown;
  sha256?: string;
  writerGeneration?: string;
}
export interface JournalHead { schemaVersion: 1; key: string; owner: string; highWater: number; snapshotThrough: number; previousThrough: number | null;
  pendingUsageIds?: string[]; acknowledgedUsage?: string[]; profileOrder?: number; acknowledgedRecords?: number }
export interface JournalSnapshot { key: string; through: number; seed: JournalSeed; sha256: string }
export interface JournalRead { head: JournalHead; snapshot: JournalSnapshot; rows: JournalRow[] }
export interface JournalAddress { database: string; key: string }
export interface PreparedJournal { owner: string; through: number; candidate: CloudCandidate }
interface PreparedCursor { owner: string; through: number; campaign: CloudCandidate["campaign"]; snapshot: CloudCandidate["snapshot"];
  headerSha256: string; fromRecord: number; toRecord: number; usageQuestions: CloudCandidate["usageQuestions"] }
type PackedRecord = CloudCandidate["evidence"]["records"][number];
export interface JournalStorage {
  readonly databaseName?: string;
  head(key: string): Promise<JournalHead | null>;
  read(key: string): Promise<JournalRead | null>;
  changes(key: string, after: number): Promise<{ head: JournalHead; rows: JournalRow[] } | null>;
  bind(key: string, owner: string, expected: JournalHead | null, seed: JournalSeed, sha256: string): Promise<JournalHead>;
  append(key: string, owner: string, from: number, rows: JournalRow[]): Promise<number>;
  compact(key: string, owner: string, through: number, seed: JournalSeed, sha256: string): Promise<void>;
  acknowledge(key: string, ids: readonly string[], records?: { owner: string; count: number }): Promise<void>;
  prepared(key: string): Promise<PreparedJournal | null>;
  prepare(key: string, owner: string, through: number, candidate: CloudCandidate, added: readonly PackedRecord[]): Promise<void>;
  keys(prefix: string): Promise<string[]>;
  clear(prefix: string): Promise<void>;
}
const copy = <T>(v: T): T => structuredClone(v);
const conflict = (): never => { throw new CloudCacheError("conflict"); };
const snapshotKey = (key: string, through: number) => JSON.stringify([key, through]);
const profileOrderKey = (key: string) => key.startsWith("local|") ? `profile-order|${key.split("|")[1]}` : null;
const rowKey = (key: string, version: number) => JSON.stringify([key, String(version).padStart(16, "0")]);
const chunkKey = (key: string, owner: string, index: number) => JSON.stringify([key, owner, String(index).padStart(16, "0")]);
const keyPrefix = (key: string) => JSON.stringify([key]).slice(0, -1) + ",";
export const journalRowText = ({ sha256: _sha256, ...row }: JournalRow) => JSON.stringify(row);
const hashedRows = (rows: JournalRow[]) => Promise.all(rows.map(async row => ({ ...row, sha256: await sha256Utf8(journalRowText(row)) })));
export async function journalQuotaRetry<T>(write: () => Promise<T>): Promise<T> {
  try { return await write(); }
  catch (error) {
    if (!(error instanceof CloudCacheError && error.reason === "quota") && !isStorageQuotaError(error)) throw error;
    await reclaimAuxiliaryStorage();
    return write(); // Same immutable batch / same expected high-water.
  }
}
const fail = (error: unknown) => error instanceof CloudCacheError ? error : new CloudCacheError(isStorageQuotaError(error) ? "quota" : "transaction");

/** Independent versioned store. Legacy profiles/cache records are never removed.
 * Only small rows and the high-water manifest cross the ordinary commit path. */
export class IndexedDbJournalStorage implements JournalStorage {
  private opened: Promise<IDBDatabase> | null = null;
  constructor(private readonly name = LOCAL_JOURNAL_DATABASE, private readonly factory: IDBFactory | null = globalThis.indexedDB ?? null) {}
  get databaseName(): string | undefined { return this.factory === globalThis.indexedDB ? this.name : undefined; }
  private open(): Promise<IDBDatabase> {
    if (this.opened) return this.opened;
    this.opened = new Promise((resolve, reject) => {
      if (!this.factory) { reject(new CloudCacheError("unavailable")); return; }
      let late = false;
      const opening = this.factory.open(this.name, 2);
      const timer = setTimeout(() => { late = true; reject(new CloudCacheError("blocked")); }, 10_000);
      opening.onupgradeneeded = () => { for (const store of ["heads", "snapshots", "rows", "prepared", "chunks"])
        if (!opening.result.objectStoreNames.contains(store)) opening.result.createObjectStore(store); };
      opening.onerror = opening.onblocked = () => { clearTimeout(timer); late = true; reject(new CloudCacheError("unavailable")); };
      opening.onsuccess = () => {
        clearTimeout(timer);
        if (late) { opening.result.close(); return; }
        const db = opening.result;
        db.onversionchange = () => { db.close(); this.opened = null; };
        db.onclose = () => { this.opened = null; };
        resolve(db);
      };
    });
    this.opened.catch(() => { this.opened = null; }); return this.opened;
  }
  private request<T>(r: IDBRequest<T>): Promise<T> {
    return new Promise((resolve, reject) => { r.onsuccess = () => resolve(r.result); r.onerror = () => reject(fail(r.error)); });
  }
  private async profileOrder(tx: IDBTransaction, key: string): Promise<number | undefined> {
    const orderKey = profileOrderKey(key); if (!orderKey) return undefined;
    const heads = tx.objectStore("heads"), prior = await this.request(heads.get(orderKey)) as number | undefined;
    if (prior !== undefined && (!Number.isSafeInteger(prior) || prior < 0)) throw new CloudCacheError("checksum");
    const order = (prior ?? 0) + 1; await this.request(heads.put(order, orderKey)); return order;
  }
  private async transaction<T>(mode: IDBTransactionMode, work: (tx: IDBTransaction) => Promise<T>): Promise<T> {
    return observeStorage("journal." + mode, async () => {
      const db = await this.open();
      let tx: IDBTransaction;
      try { tx = db.transaction(["heads", "snapshots", "rows", "prepared", "chunks"], mode, mode === "readwrite" ? { durability: "strict" } : undefined); }
      catch (error) { if (!(error instanceof TypeError)) throw error; tx = db.transaction(["heads", "snapshots", "rows", "prepared", "chunks"], mode); }
      let timeout: ReturnType<typeof setTimeout>;
      let interrupt!: (error: unknown) => void;
      const interrupted = new Promise<never>((_resolve, reject) => { interrupt = reject; });
      const done = new Promise<void>((resolve, reject) => {
        timeout = setTimeout(() => {
          const error = new CloudCacheError("transaction"); interrupt(error);
          try { tx.abort(); } catch { /* terminal */ } reject(error);
        }, 10_000);
        tx.oncomplete = () => resolve();
        tx.onabort = () => { const error = fail(tx.error); reject(error); interrupt(error); };
        tx.onerror = () => {};
      });
      // Observe abort immediately even while an IDB request is outstanding.
      void done.catch(() => {});
      try { return await Promise.race([(async () => { const value = await work(tx); await done; return value; })(), interrupted]); }
      catch (error) { try { tx.abort(); } catch { /* terminal */ } throw fail(error); }
      finally { clearTimeout(timeout!); }
    });
  }
  head(key: string): Promise<JournalHead | null> { return this.transaction("readonly", async tx => await this.request(tx.objectStore("heads").get(key)) ?? null); }
  read(key: string): Promise<JournalRead | null> {
    return this.transaction("readonly", async tx => {
      const head = await this.request(tx.objectStore("heads").get(key)) as JournalHead | undefined;
      if (!head) return null;
      if (head.schemaVersion !== 1) throw new CloudCacheError("version");
      if (!Number.isSafeInteger(head.highWater) || !Number.isSafeInteger(head.snapshotThrough) || head.snapshotThrough < 0 ||
        head.highWater < head.snapshotThrough || head.highWater - head.snapshotThrough > 100_000) throw new CloudCacheError("checksum");
      const snapshot = await this.request(tx.objectStore("snapshots").get(snapshotKey(key, head.snapshotThrough))) as JournalSnapshot | undefined;
      if (!snapshot) throw new CloudCacheError("checksum");
      const rows: JournalRow[] = [];
      if (typeof IDBKeyRange !== "undefined" && head.highWater > head.snapshotThrough) {
        rows.push(...await this.request(tx.objectStore("rows").getAll(IDBKeyRange.bound(rowKey(key, head.snapshotThrough + 1), rowKey(key, head.highWater + 1), false, true))));
      } else for (let version = head.snapshotThrough + 1; version <= head.highWater; version++) {
        const row = await this.request(tx.objectStore("rows").get(rowKey(key, version))) as JournalRow | undefined;
        if (!row || row.version !== version) throw new CloudCacheError("checksum");
        rows.push(row);
      }
      if (rows.length !== head.highWater - head.snapshotThrough || rows.some((r, i) => r.version !== head.snapshotThrough + i + 1)) throw new CloudCacheError("checksum");
      return { head, snapshot, rows };
    });
  }
  changes(key: string, after: number): Promise<{ head: JournalHead; rows: JournalRow[] } | null> {
    return this.transaction("readonly", async tx => {
      const head = await this.request(tx.objectStore("heads").get(key)) as JournalHead | undefined; if (!head) return null;
      const rows: JournalRow[] = [];
      if (head.highWater > after && typeof IDBKeyRange !== "undefined")
        rows.push(...await this.request(tx.objectStore("rows").getAll(IDBKeyRange.bound(rowKey(key, after + 1), rowKey(key, head.highWater + 1), false, true))));
      else for (let version = after + 1; version <= head.highWater; version++) {
        const row = await this.request(tx.objectStore("rows").get(rowKey(key, version))) as JournalRow | undefined;
        if (row) rows.push(row);
      }
      return { head, rows };
    });
  }
  bind(key: string, owner: string, expected: JournalHead | null, seed: JournalSeed, sha256: string): Promise<JournalHead> {
    return this.transaction("readwrite", async tx => {
      const heads = tx.objectStore("heads"), actual = await this.request(heads.get(key)) as JournalHead | undefined;
      if (actual?.owner === owner) {
        const saved = await this.request(tx.objectStore("snapshots").get(snapshotKey(key, actual.snapshotThrough))) as JournalSnapshot | undefined;
        if (saved?.sha256 === sha256) return actual;
      }
      if ((actual?.owner ?? null) !== (expected?.owner ?? null) || (actual?.highWater ?? null) !== (expected?.highWater ?? null)) conflict();
      const through = (actual?.highWater ?? -1) + 1;
      const pendingUsageIds = seed.usageQuestions.map(r => r.receipt_id);
      const head: JournalHead = { schemaVersion: 1, key, owner, highWater: through, snapshotThrough: through, previousThrough: actual?.snapshotThrough ?? null,
        pendingUsageIds, acknowledgedUsage: actual?.acknowledgedUsage?.filter(id => pendingUsageIds.includes(id)) ?? [], profileOrder: await this.profileOrder(tx, key),
        acknowledgedRecords: seed.confirmed?.evidence.records.length ?? 0 };
      await this.request(tx.objectStore("snapshots").put({ key, through, seed, sha256 } satisfies JournalSnapshot, snapshotKey(key, through)));
      if (actual?.previousThrough !== null && actual?.previousThrough !== undefined)
        await this.request(tx.objectStore("snapshots").delete(snapshotKey(key, actual.previousThrough)));
      for (let v = (actual?.previousThrough ?? -1) + 1; v <= (actual?.snapshotThrough ?? -1); v++)
        await this.request(tx.objectStore("rows").delete(rowKey(key, v)));
      await this.request(tx.objectStore("prepared").delete(key));
      for (const chunk of await this.request(tx.objectStore("chunks").getAllKeys()))
        if (typeof chunk === "string" && chunk.startsWith(keyPrefix(key))) await this.request(tx.objectStore("chunks").delete(chunk));
      await this.request(heads.put(head, key)); return head;
    });
  }
  async append(key: string, owner: string, from: number, rows: JournalRow[]): Promise<number> {
    if (!rows.length) return from;
    const stored = await hashedRows(rows);
    return this.transaction("readwrite", async tx => {
      const heads = tx.objectStore("heads"), head = await this.request(heads.get(key)) as JournalHead | undefined;
      if (!head || head.owner !== owner) conflict();
      const to = rows.at(-1)!.version;
      // A lost local acknowledgement retries the exact immutable rows.
      if (head!.highWater === to) {
        for (const row of stored) if (JSON.stringify(await this.request(tx.objectStore("rows").get(rowKey(key, row.version)))) !== JSON.stringify(row)) conflict();
        return to;
      }
      if (head!.highWater !== from || rows.some((r, i) => r.version !== from + i + 1)) conflict();
      for (const row of stored) await this.request(tx.objectStore("rows").put(row, rowKey(key, row.version)));
      const pendingUsageIds = rows.at(-1)!.usageQuestions.map(r => r.receipt_id);
      await this.request(heads.put({ ...head, highWater: to, pendingUsageIds,
        acknowledgedUsage: head!.acknowledgedUsage?.filter(id => pendingUsageIds.includes(id)) ?? [], profileOrder: await this.profileOrder(tx, key) }, key)); return to;
    });
  }
  compact(key: string, owner: string, through: number, seed: JournalSeed, sha256: string): Promise<void> {
    return this.transaction("readwrite", async tx => {
      const heads = tx.objectStore("heads"), head = await this.request(heads.get(key)) as JournalHead | undefined;
      if (!head || head.owner !== owner || through > head.highWater || through < head.snapshotThrough) conflict();
      if (through === head!.snapshotThrough) return;
      const snapshots = tx.objectStore("snapshots"), rows = tx.objectStore("rows");
      await this.request(snapshots.put({ key, through, seed, sha256 } satisfies JournalSnapshot, snapshotKey(key, through)));
      // Keep one complete prior snapshot AND its journal suffix. Only the older
      // generation can be reclaimed, in the same manifest transaction.
      if (head!.previousThrough !== null) await this.request(snapshots.delete(snapshotKey(key, head!.previousThrough!)));
      for (let v = (head!.previousThrough ?? -1) + 1; v <= head!.snapshotThrough; v++) await this.request(rows.delete(rowKey(key, v)));
      await this.request(heads.put({ ...head, previousThrough: head!.snapshotThrough, snapshotThrough: through }, key));
    });
  }
  keys(prefix: string): Promise<string[]> { return this.transaction("readonly", async tx => (await this.request(tx.objectStore("heads").getAllKeys())).filter((k): k is string => typeof k === "string" && k.startsWith(prefix))); }
  acknowledge(key: string, ids: readonly string[], records?: { owner: string; count: number }): Promise<void> {
    if (!ids.length && !records) return Promise.resolve();
    return this.transaction("readwrite", async tx => {
      const heads = tx.objectStore("heads"), head = await this.request(heads.get(key)) as JournalHead | undefined;
      if (!head) return;
      const acknowledgedUsage = [...new Set([...(head.acknowledgedUsage ?? []), ...ids])].filter(id => head.pendingUsageIds?.includes(id));
      await this.request(heads.put({ ...head, acknowledgedUsage,
        acknowledgedRecords: records?.owner === head.owner ? Math.max(head.acknowledgedRecords ?? 0, records.count) : head.acknowledgedRecords }, key));
    });
  }
  prepared(key: string): Promise<PreparedJournal | null> {
    return this.transaction("readonly", async tx => {
      const head = await this.request(tx.objectStore("heads").get(key)) as JournalHead | undefined;
      const cursor = await this.request(tx.objectStore("prepared").get(key)) as PreparedCursor | undefined;
      if (!head || !cursor || cursor.owner !== head.owner) return null;
      if ((head.acknowledgedRecords ?? 0) > cursor.toRecord) return null;
      const from = Math.max(cursor.fromRecord, head.acknowledgedRecords ?? 0);
      const records: PackedRecord[] = [];
      if (cursor.toRecord > from && typeof IDBKeyRange !== "undefined") {
        records.push(...await this.request(tx.objectStore("chunks").getAll(IDBKeyRange.bound(chunkKey(key, head.owner, from), chunkKey(key, head.owner, cursor.toRecord), false, true))));
      } else for (let index = from; index < cursor.toRecord; index++) {
        const row = await this.request(tx.objectStore("chunks").get(chunkKey(key, head.owner, index))) as PackedRecord | undefined;
        if (!row) throw new CloudCacheError("checksum"); records.push(row);
      }
      if (records.length !== cursor.toRecord - from || records.some((r, i) => r.id !== `e${(from + i + 1).toString(36)}`)) throw new CloudCacheError("checksum");
      return { owner: cursor.owner, through: cursor.through, candidate: { campaign: cursor.campaign, snapshot: cursor.snapshot,
        evidence: { headerSha256: cursor.headerSha256, fromRecord: from, toRecord: cursor.toRecord, records },
        usageQuestions: cursor.usageQuestions.filter(r => !head.acknowledgedUsage?.includes(r.receipt_id)) } };
    });
  }
  prepare(key: string, owner: string, through: number, candidate: CloudCandidate, added: readonly PackedRecord[]): Promise<void> {
    return this.transaction("readwrite", async tx => {
      const head = await this.request(tx.objectStore("heads").get(key)) as JournalHead | undefined;
      if (!head || head.owner !== owner || head.highWater < through) conflict();
      const previous = await this.request(tx.objectStore("prepared").get(key)) as PreparedCursor | undefined;
      if (previous?.owner === owner && previous.through > through) return;
      for (const row of added) {
        const index = Number.parseInt(row.id.slice(1), 36) - 1, chunks = tx.objectStore("chunks");
        // These are regenerable encodings of hash-verified immutable raw rows,
        // not the source evidence or a frozen server operation.
        await this.request(chunks.put(row, chunkKey(key, owner, index)));
      }
      const cursor: PreparedCursor = { owner, through, campaign: candidate.campaign, snapshot: candidate.snapshot,
        headerSha256: candidate.evidence.headerSha256, fromRecord: candidate.evidence.fromRecord, toRecord: candidate.evidence.toRecord, usageQuestions: candidate.usageQuestions };
      await this.request(tx.objectStore("prepared").put(cursor, key));
      if (cursor.fromRecord > 0 && typeof IDBKeyRange !== "undefined")
        await this.request(tx.objectStore("chunks").delete(IDBKeyRange.bound(chunkKey(key, owner, 0), chunkKey(key, owner, cursor.fromRecord), false, true)));
    });
  }
  clear(prefix: string): Promise<void> {
    return this.transaction("readwrite", async tx => {
      const keys = (await this.request(tx.objectStore("heads").getAllKeys())).filter((k): k is string => typeof k === "string" && k.startsWith(prefix));
      for (const key of keys) await this.request(tx.objectStore("heads").delete(key));
      for (const key of keys) await this.request(tx.objectStore("prepared").delete(key));
      const orderKey = profileOrderKey(prefix); if (orderKey) await this.request(tx.objectStore("heads").delete(orderKey));
      for (const name of ["snapshots", "rows", "chunks"]) for (const key of await this.request(tx.objectStore(name).getAllKeys())) {
        if (typeof key === "string" && keys.includes((JSON.parse(key) as [string, number])[0])) await this.request(tx.objectStore(name).delete(key));
      }
    });
  }
}

export class MemoryJournalStorage implements JournalStorage {
  readonly data = new Map<string, { head: JournalHead; snapshots: Map<number, JournalSnapshot>; rows: Map<number, JournalRow> }>();
  fault: "before-commit" | "after-commit" | null = null;
  private readonly profileOrders = new Map<string, number>();
  private readonly preparedRows = new Map<string, PreparedJournal>();
  private profileOrder(key: string): number | undefined {
    const orderKey = profileOrderKey(key); if (!orderKey) return undefined;
    const next = (this.profileOrders.get(orderKey) ?? 0) + 1; this.profileOrders.set(orderKey, next); return next;
  }
  async head(key: string) { return copy(this.data.get(key)?.head ?? null); }
  async read(key: string): Promise<JournalRead | null> {
    const d = this.data.get(key); if (!d) return null;
    return copy({ head: d.head, snapshot: d.snapshots.get(d.head.snapshotThrough)!, rows: [...d.rows.values()].filter(r => r.version > d.head.snapshotThrough && r.version <= d.head.highWater) });
  }
  async changes(key: string, after: number) {
    const d = this.data.get(key); if (!d) return null;
    return copy({ head: d.head, rows: [...d.rows.values()].filter(r => r.version > after && r.version <= d.head.highWater) });
  }
  async bind(key: string, owner: string, expected: JournalHead | null, seed: JournalSeed, sha256: string) {
    const actual = this.data.get(key);
    if (actual?.head.owner === owner && actual.snapshots.get(actual.head.snapshotThrough)?.sha256 === sha256) return copy(actual.head);
    if ((actual?.head.owner ?? null) !== (expected?.owner ?? null) || (actual?.head.highWater ?? null) !== (expected?.highWater ?? null)) conflict();
    const through = (actual?.head.highWater ?? -1) + 1;
    const pendingUsageIds = seed.usageQuestions.map(r => r.receipt_id);
    const head: JournalHead = { schemaVersion: 1, key, owner, highWater: through, snapshotThrough: through, previousThrough: actual?.head.snapshotThrough ?? null,
      pendingUsageIds, acknowledgedUsage: actual?.head.acknowledgedUsage?.filter(id => pendingUsageIds.includes(id)) ?? [], profileOrder: this.profileOrder(key),
      acknowledgedRecords: seed.confirmed?.evidence.records.length ?? 0 };
    const d = actual ?? { head, snapshots: new Map(), rows: new Map() };
    if (actual?.head.previousThrough !== null && actual?.head.previousThrough !== undefined) d.snapshots.delete(actual.head.previousThrough);
    for (const version of d.rows.keys()) if (version <= (actual?.head.snapshotThrough ?? -1)) d.rows.delete(version);
    d.snapshots.set(through, copy({ key, through, seed, sha256 })); d.head = head; this.data.set(key, d); return copy(head);
  }
  async append(key: string, owner: string, from: number, rows: JournalRow[]) {
    const d = this.data.get(key); if (!d || d.head.owner !== owner) conflict();
    const to = rows.at(-1)?.version ?? from;
    if (d!.head.highWater === to && rows.every(r => d!.rows.has(r.version) && journalRowText(r) === journalRowText(d!.rows.get(r.version)!))) return to;
    if (d!.head.highWater !== from || rows.some((r, i) => r.version !== from + i + 1)) conflict();
    const fault = this.fault; this.fault = null;
    if (fault === "before-commit") throw new CloudCacheError("transaction");
    const hashed = await hashedRows(rows);
    if (d!.head.owner !== owner || d!.head.highWater !== from) conflict();
    for (const row of hashed) d!.rows.set(row.version, copy(row));
    const pendingUsageIds = rows.at(-1)!.usageQuestions.map(r => r.receipt_id);
    d!.head = { ...d!.head, highWater: to, pendingUsageIds, acknowledgedUsage: d!.head.acknowledgedUsage?.filter(id => pendingUsageIds.includes(id)) ?? [], profileOrder: this.profileOrder(key) };
    if (fault === "after-commit") throw new CloudCacheError("transaction"); return to;
  }
  async compact(key: string, owner: string, through: number, seed: JournalSeed, sha256: string) {
    const d = this.data.get(key); if (!d || d.head.owner !== owner || through > d.head.highWater) conflict();
    if (through === d!.head.snapshotThrough) return;
    const fault = this.fault; this.fault = null;
    if (fault === "before-commit") throw new CloudCacheError("transaction");
    if (d!.head.previousThrough !== null) d!.snapshots.delete(d!.head.previousThrough);
    for (const version of d!.rows.keys()) if (version <= d!.head.snapshotThrough) d!.rows.delete(version);
    d!.snapshots.set(through, copy({ key, through, seed, sha256 }));
    d!.head = { ...d!.head, snapshotThrough: through, previousThrough: d!.head.snapshotThrough };
    if (fault === "after-commit") throw new CloudCacheError("transaction");
  }
  async keys(prefix: string) { return [...this.data.keys()].filter(k => k.startsWith(prefix)); }
  async acknowledge(key: string, ids: readonly string[], records?: { owner: string; count: number }) {
    const d = this.data.get(key); if (!d) return;
    d.head = { ...d.head, acknowledgedUsage: [...new Set([...(d.head.acknowledgedUsage ?? []), ...ids])].filter(id => d.head.pendingUsageIds?.includes(id)),
      acknowledgedRecords: records?.owner === d.head.owner ? Math.max(d.head.acknowledgedRecords ?? 0, records.count) : d.head.acknowledgedRecords };
  }
  async prepared(key: string): Promise<PreparedJournal | null> {
    const value = this.preparedRows.get(key), head = this.data.get(key)?.head;
    if (!value || value.owner !== head?.owner) return null;
    const from = Math.max(value.candidate.evidence.fromRecord, head.acknowledgedRecords ?? 0);
    if (from > value.candidate.evidence.toRecord) return null;
    return copy({ ...value, candidate: { ...value.candidate, evidence: { ...value.candidate.evidence, fromRecord: from,
      records: value.candidate.evidence.records.slice(from - value.candidate.evidence.fromRecord) }, usageQuestions: value.candidate.usageQuestions.filter(r => !head.acknowledgedUsage?.includes(r.receipt_id)) } });
  }
  async prepare(key: string, owner: string, through: number, candidate: CloudCandidate, _added: readonly PackedRecord[]) {
    const head = this.data.get(key)?.head;
    if (!head || head.owner !== owner || head.highWater < through) conflict();
    const prior = this.preparedRows.get(key);
    if (prior?.owner === owner && prior.through > through) return;
    this.preparedRows.set(key, copy({ owner, through, candidate }));
  }
  async clear(prefix: string) { for (const key of await this.keys(prefix)) { this.data.delete(key); this.preparedRows.delete(key); } const orderKey = profileOrderKey(prefix); if (orderKey) this.profileOrders.delete(orderKey); }
}

export type JournalWorkerAddress = JournalAddress | { memory: string; key: string };
const memoryStores = new Map<string, WeakRef<JournalStorage>>(), memoryIds = new WeakMap<JournalStorage, string>();
const workerStores = new WeakMap<IDBFactory, Map<string, IndexedDbJournalStorage>>();
export function journalWorkerAddress(store: JournalStorage, key: string): JournalWorkerAddress {
  if (store.databaseName) return { database: store.databaseName, key };
  let id = memoryIds.get(store);
  if (!id) { id = crypto.randomUUID(); memoryIds.set(store, id); memoryStores.set(id, new WeakRef(store)); }
  return { memory: id, key };
}
export function journalWorkerStore(address: JournalWorkerAddress): JournalStorage {
  if ("database" in address) {
    const factory = globalThis.indexedDB; if (!factory) throw new CloudCacheError("unavailable");
    let stores = workerStores.get(factory); if (!stores) { stores = new Map(); workerStores.set(factory, stores); }
    let store = stores.get(address.database);
    if (!store) { store = new IndexedDbJournalStorage(address.database, factory); stores.set(address.database, store); }
    return store;
  }
  const store = memoryStores.get(address.memory)?.deref(); if (!store) throw new CloudCacheError("unavailable"); return store;
}

/** One active transaction, bounded accepted rows, fixed first-dirty deadline.
 * Captured barriers do not wait for future ticks. Failure retains every row. */
export class LocalJournalDrain {
  private pending: JournalRow[] = [];
  private active: Promise<boolean> | null = null;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private dueAt = Infinity;
  private stopped = false;
  private version: number;
  committed: number;
  error: unknown = null;
  onCommit?: (row: JournalRow) => void;
  constructor(readonly store: JournalStorage, readonly key: string, readonly owner: string, highWater: number,
    private readonly onFailure: (error: unknown) => void) { this.version = this.committed = highWater; }
  get canAccept() { return !this.stopped && !this.error && this.pending.length < LOCAL_JOURNAL_QUEUE_LIMIT; }
  get dirty() { return this.version > this.committed; }
  get highWater() { return this.version; }
  get queued() { return this.pending.length; }
  accept(row: Omit<JournalRow, "version">, tick = false): void {
    if (!this.canAccept) throw new CloudCacheError("transaction");
    this.pending.push({ ...row, version: ++this.version });
    const due = Date.now() + (tick ? LOCAL_TICK_COMMIT_MS : LOCAL_COMMIT_MS);
    if (due < this.dueAt) {
      if (this.timer !== null) clearTimeout(this.timer);
      this.dueAt = due; this.timer = setTimeout(() => { this.timer = null; this.dueAt = Infinity; void this.drain(); }, Math.max(0, due - Date.now()));
    }
  }
  async drain(): Promise<boolean> {
    const target = this.version;
    if (this.timer !== null) { clearTimeout(this.timer); this.timer = null; this.dueAt = Infinity; }
    while (this.committed < target && !this.stopped) {
      if (this.active) { if (!await this.active) return false; continue; }
      const rows = this.pending.slice(), from = this.committed;
      this.active = journalQuotaRetry(() => this.store.append(this.key, this.owner, from, rows)).then(through => {
        this.committed = through; this.pending = this.pending.filter(r => r.version > through); this.error = null;
        try { this.onCommit?.(rows.at(-1)!); } catch (error) { problemDiagnostics.error("journal-observer", error); }
        return true;
      }).catch(error => { this.error = error; this.onFailure(error); return false; }).finally(() => { this.active = null; });
      if (!await this.active) return false;
    }
    return !this.stopped && this.committed >= target;
  }
  stop() { this.stopped = true; if (this.timer !== null) clearTimeout(this.timer); }
}
