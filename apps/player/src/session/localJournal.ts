import type { GameEvidenceCheckpoint, GameEvidenceDelta } from "@gamify-surgery/game-domain";
import { CloudCacheError } from "./cloud/codecCache";
import type { CloudCampaignMetadata } from "./cloud/codec";
import type { CloudSourceProvenance } from "./cloud/codecEvidence";
import type { CloudCandidate, CloudConfirmed, SnapshotLineage } from "./cloud/transport";
import type { CloudCompressedText } from "./cloud/codecCompression";
import type { QuestionUsageReceipt } from "../playtime/usageTypes";
import { observeStorage, problemDiagnostics } from "../diagnostics/problemDiagnostics";
import { deleteJournalKeyRange } from "./journalRangeDelete";
import { decodeJournalValue, encodeJournalValue, preparedJournalValue, type EncodedJournalValue } from "./journalEncoding";
import { LOCAL_STORAGE_COMPRESSION_WRITES } from "./localStorageBuildPolicy";
import { isStorageQuotaError, reclaimAuxiliaryStorage } from "./storagePressure";
import { sha256Utf8 } from "./cloud/codecJson";
import { isTransientStorageError, retrySlowStorage } from "./cloud/storageRetry";

export const LOCAL_JOURNAL_DATABASE = "gamify-surgery.local-journal.v1";
export const LOCAL_COMMIT_MS = 250;
export const LOCAL_TICK_COMMIT_MS = 1_000;
export const LOCAL_COMPACTION_MS = 5 * 60_000;
/** Prepare a full native cloud body quietly, not after every one-second row.
 * Explicit/boundary checkpoints bypass this preparation cooldown. */
export const LOCAL_NATIVE_PREPARE_MS = 60_000;
/** Native account move tails are recovery data, not campaign history. Pulse
 * compacts an unusually busy/offline tail before the ordinary time boundary. */
export const LOCAL_SNAPSHOT_TAIL_LIMIT = 512;
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
  snapshotPolicy?: { lineage: SnapshotLineage; legacyBaseSnapshot?: CloudCompressedText };
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
  snapshotFormat?: 3; pendingUsageIds?: string[]; acknowledgedUsage?: string[]; profileOrder?: number; acknowledgedRecords?: number }
export interface JournalSnapshot { key: string; through: number; seed: JournalSeed; sha256: string }
type StoredRow = JournalRow | (EncodedJournalValue & { version: number });
type StoredSnapshot = Omit<JournalSnapshot, "seed"> & { seed: JournalSeed | EncodedJournalValue };
async function decodeRows(rows: readonly StoredRow[]): Promise<JournalRow[]> {
  // Bound stream/UTF-8 scratch when reopening a long tail. The readonly IDB
  // transaction has already completed; no durability or ordering depends on it.
  const decoded: JournalRow[] = [];
  for (const row of rows) decoded.push(await decodeJournalValue<JournalRow>(row));
  return decoded;
}
export interface JournalRead { head: JournalHead; snapshot: JournalSnapshot; rows: JournalRow[] }
export interface JournalAddress { database: string; key: string }
export interface PreparedJournal { owner: string; through: number; candidate: CloudCandidate }
interface PreparedCursor { owner: string; through: number; campaign: CloudCandidate["campaign"]; snapshot: CloudCandidate["snapshot"];
  headerSha256: string; fromRecord: number; toRecord: number; usageQuestions: CloudCandidate["usageQuestions"];
  saveFormat?: 3; lineage?: SnapshotLineage; legacyBaseSnapshot?: CloudCompressedText }
type PackedRecord = CloudCandidate["evidence"]["records"][number];
export interface JournalStorage {
  readonly databaseName?: string;
  head(key: string): Promise<JournalHead | null>;
  read(key: string): Promise<JournalRead | null>;
  changes(key: string, after: number): Promise<{ head: JournalHead; rows: JournalRow[] } | null>;
  bind(key: string, owner: string, expected: JournalHead | null, seed: JournalSeed, sha256: string, encoded?: JournalSeed | EncodedJournalValue): Promise<JournalHead>;
  append(key: string, owner: string, from: number, rows: JournalRow[], encoded?: readonly StoredRow[]): Promise<number>;
  compact(key: string, owner: string, through: number, seed: JournalSeed, sha256: string, encoded?: JournalSeed | EncodedJournalValue): Promise<void>;
  /** Only after verification: reclaim older native representations before a
   * quota-constrained reopen needs to allocate any new cache/snapshot bytes. */
  reclaimCovered?(key: string, expected: JournalHead): Promise<void>;
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
const preparedHashes = new WeakMap<JournalRow, string>();
const hashedRows = (rows: JournalRow[]) => Promise.all(rows.map(async row => ({ ...row,
  sha256: preparedHashes.get(row) ?? await sha256Utf8(journalRowText(row)) })));
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
      const timer = setTimeout(() => { late = true; reject(new CloudCacheError("timeout")); }, 10_000);
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
    return retrySlowStorage(() => observeStorage("journal." + mode, async () => {
      const db = await this.open();
      let tx: IDBTransaction;
      try { tx = db.transaction(["heads", "snapshots", "rows", "prepared", "chunks"], mode, mode === "readwrite" ? { durability: "strict" } : undefined); }
      catch (error) { if (!(error instanceof TypeError)) throw error; tx = db.transaction(["heads", "snapshots", "rows", "prepared", "chunks"], mode); }
      let timeout: ReturnType<typeof setTimeout>;
      let interrupt!: (error: unknown) => void;
      const interrupted = new Promise<never>((_resolve, reject) => { interrupt = reject; });
      const done = new Promise<void>((resolve, reject) => {
        timeout = setTimeout(() => {
          const error = new CloudCacheError("timeout"); interrupt(error);
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
    }));
  }
  head(key: string): Promise<JournalHead | null> { return this.transaction("readonly", async tx => await this.request(tx.objectStore("heads").get(key)) ?? null); }
  async read(key: string): Promise<JournalRead | null> {
    const data = await this.transaction("readonly", async tx => {
      const head = await this.request(tx.objectStore("heads").get(key)) as JournalHead | undefined;
      if (!head) return null;
      if (head.schemaVersion !== 1) throw new CloudCacheError("version");
      if (!Number.isSafeInteger(head.highWater) || !Number.isSafeInteger(head.snapshotThrough) || head.snapshotThrough < 0 ||
        head.highWater < head.snapshotThrough || head.highWater - head.snapshotThrough > 100_000) throw new CloudCacheError("checksum");
      const snapshot = await this.request(tx.objectStore("snapshots").get(snapshotKey(key, head.snapshotThrough))) as StoredSnapshot | undefined;
      if (!snapshot) throw new CloudCacheError("checksum");
      const rows: StoredRow[] = [];
      if (typeof IDBKeyRange !== "undefined" && head.highWater > head.snapshotThrough) {
        rows.push(...await this.request(tx.objectStore("rows").getAll(IDBKeyRange.bound(rowKey(key, head.snapshotThrough + 1), rowKey(key, head.highWater + 1), false, true))));
      } else for (let version = head.snapshotThrough + 1; version <= head.highWater; version++) {
        const row = await this.request(tx.objectStore("rows").get(rowKey(key, version))) as StoredRow | undefined;
        if (!row || row.version !== version) throw new CloudCacheError("checksum");
        rows.push(row);
      }
      if (rows.length !== head.highWater - head.snapshotThrough || rows.some((r, i) => r.version !== head.snapshotThrough + i + 1)) throw new CloudCacheError("checksum");
      return { head, snapshot, rows };
    });
    if (!data) return null;
    return { head: data.head, snapshot: { ...data.snapshot, seed: await decodeJournalValue(data.snapshot.seed) },
      rows: await decodeRows(data.rows) };
  }
  async changes(key: string, after: number): Promise<{ head: JournalHead; rows: JournalRow[] } | null> {
    const data = await this.transaction("readonly", async tx => {
      const head = await this.request(tx.objectStore("heads").get(key)) as JournalHead | undefined; if (!head) return null;
      const rows: StoredRow[] = [];
      if (head.highWater > after && typeof IDBKeyRange !== "undefined")
        rows.push(...await this.request(tx.objectStore("rows").getAll(IDBKeyRange.bound(rowKey(key, after + 1), rowKey(key, head.highWater + 1), false, true))));
      else for (let version = after + 1; version <= head.highWater; version++) {
        const row = await this.request(tx.objectStore("rows").get(rowKey(key, version))) as StoredRow | undefined;
        if (row) rows.push(row);
      }
      return { head, rows };
    });
    return data ? { head: data.head, rows: await decodeRows(data.rows) } : null;
  }
  async bind(key: string, owner: string, expected: JournalHead | null, seed: JournalSeed, sha256: string, packed?: JournalSeed | EncodedJournalValue): Promise<JournalHead> {
    const encoded = LOCAL_STORAGE_COMPRESSION_WRITES ? packed ?? await encodeJournalValue(seed) : seed;
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
        acknowledgedRecords: seed.confirmed?.evidence.records.length ?? 0, ...(seed.snapshotPolicy ? { snapshotFormat: 3 } : {}) };
      if (actual?.previousThrough !== null && actual?.previousThrough !== undefined)
        await this.request(tx.objectStore("snapshots").delete(snapshotKey(key, actual.previousThrough)));
      const first = (actual?.previousThrough ?? -1) + 1, last = seed.snapshotPolicy ? actual?.highWater ?? -1 : actual?.snapshotThrough ?? -1;
      if (last >= first) await deleteJournalKeyRange(tx.objectStore("rows"), rowKey(key, first), rowKey(key, last), value => this.request(value));
      await this.request(tx.objectStore("prepared").delete(key));
      for (const chunk of await this.request(tx.objectStore("chunks").getAllKeys()))
        if (typeof chunk === "string" && chunk.startsWith(keyPrefix(key))) await this.request(tx.objectStore("chunks").delete(chunk));
      // Reclaim redundant generations before allocating the replacement. All
      // mutations share this transaction: an abort restores every old byte.
      await this.request(tx.objectStore("snapshots").put({ key, through, seed: encoded, sha256 } satisfies StoredSnapshot, snapshotKey(key, through)));
      await this.request(heads.put(head, key)); return head;
    });
  }
  async append(key: string, owner: string, from: number, rows: JournalRow[], packed?: readonly StoredRow[]): Promise<number> {
    if (!rows.length) return from;
    // Enforce the rollout at the write boundary too: cached/worker-prepared
    // values from another build cannot introduce compressed records while off.
    const stored = !LOCAL_STORAGE_COMPRESSION_WRITES ? await hashedRows(rows) : packed ?? await Promise.all(rows.map(async row => preparedJournalValue<StoredRow>(row) ??
      { ...await encodeJournalValue((await hashedRows([row]))[0]!), version: row.version }));
    if (stored.length !== rows.length || stored.some((r, i) => r.version !== rows[i]!.version)) throw new CloudCacheError("checksum");
    const to = rows.at(-1)!.version;
    const result = await this.transaction("readwrite", async tx => {
      const heads = tx.objectStore("heads"), head = await this.request(heads.get(key)) as JournalHead | undefined;
      if (!head || head.owner !== owner) conflict();
      // Read a lost-ack retry atomically, but decode outside the transaction:
      // asynchronous stream/crypto work must never outlive an active IDB tx.
      if (head!.highWater === to) return await Promise.all(stored.map(row => this.request(tx.objectStore("rows").get(rowKey(key, row.version))) as Promise<StoredRow | undefined>));
      if (head!.highWater !== from || rows.some((r, i) => r.version !== from + i + 1)) conflict();
      for (const row of stored) await this.request(tx.objectStore("rows").put(row, rowKey(key, row.version)));
      const pendingUsageIds = rows.at(-1)!.usageQuestions.map(r => r.receipt_id);
      await this.request(heads.put({ ...head, highWater: to, pendingUsageIds,
        acknowledgedUsage: head!.acknowledgedUsage?.filter(id => pendingUsageIds.includes(id)) ?? [], profileOrder: await this.profileOrder(tx, key) }, key)); return to;
    });
    if (typeof result === "number") return result;
    const expected = await hashedRows(rows);
    for (let i = 0; i < expected.length; i++) {
      if (!result[i] || JSON.stringify(await decodeJournalValue<JournalRow>(result[i]!)) !== JSON.stringify(expected[i])) conflict();
    }
    // Recheck the owner/high-water AND captured bytes after asynchronous decode.
    // A concurrent bind, corruption or replacement cannot bless an old retry.
    return this.transaction("readonly", async tx => {
      const head = await this.request(tx.objectStore("heads").get(key)) as JournalHead | undefined;
      if (head?.owner !== owner || head.highWater !== to) conflict();
      for (let i = 0; i < stored.length; i++) if (JSON.stringify(await this.request(tx.objectStore("rows").get(rowKey(key, stored[i]!.version)))) !== JSON.stringify(result[i])) conflict();
      return to;
    });
  }
  async compact(key: string, owner: string, through: number, seed: JournalSeed, sha256: string, packed?: JournalSeed | EncodedJournalValue): Promise<void> {
    const encoded = LOCAL_STORAGE_COMPRESSION_WRITES ? packed ?? await encodeJournalValue(seed) : seed;
    return this.transaction("readwrite", async tx => {
      const heads = tx.objectStore("heads"), head = await this.request(heads.get(key)) as JournalHead | undefined;
      if (!head || head.owner !== owner || through > head.highWater || through < head.snapshotThrough) conflict();
      if (through === head!.snapshotThrough) return;
      const snapshots = tx.objectStore("snapshots"), rows = tx.objectStore("rows");
      // Keep one complete prior snapshot. Native full-state snapshots supersede
      // their move rows; legacy evidence journals still retain the prior suffix.
      if (head!.previousThrough !== null) await this.request(snapshots.delete(snapshotKey(key, head!.previousThrough!)));
      const redundantThrough = seed.snapshotPolicy ? through : head!.snapshotThrough;
      const first = (head!.previousThrough ?? -1) + 1;
      if (redundantThrough >= first) await deleteJournalKeyRange(rows, rowKey(key, first), rowKey(key, redundantThrough), value => this.request(value));
      if (seed.snapshotPolicy) {
        // Native snapshots contain complete state. Old packed evidence is a
        // regenerable legacy representation, not an unsent recovery operation.
        const chunks = tx.objectStore("chunks"), prefix = keyPrefix(key);
        for (const chunk of await this.request(chunks.getAllKeys())) if (typeof chunk === "string" && chunk.startsWith(prefix)) await this.request(chunks.delete(chunk));
      }
      await this.request(snapshots.put({ key, through, seed: encoded, sha256 } satisfies StoredSnapshot, snapshotKey(key, through)));
      await this.request(heads.put({ ...head, previousThrough: head!.snapshotThrough, snapshotThrough: through, ...(seed.snapshotPolicy ? { snapshotFormat: 3 } : {}) }, key));
    });
  }
  async reclaimCovered(key: string, expected: JournalHead): Promise<void> {
    // Only pre-hint native generations need this migration read. Decode before
    // opening the deleting transaction, then fence its exact snapshot digest.
    const legacy = expected.snapshotFormat !== 3 ? await this.transaction("readonly", async tx =>
      await this.request(tx.objectStore("snapshots").get(snapshotKey(key, expected.snapshotThrough))) as StoredSnapshot | undefined) : undefined;
    const seed = legacy ? await decodeJournalValue(legacy.seed) : undefined;
    if (seed && await sha256Utf8(JSON.stringify(seed)) !== legacy!.sha256) throw new CloudCacheError("checksum");
    return this.transaction("readwrite", async tx => {
      const head = await this.request(tx.objectStore("heads").get(key)) as JournalHead | undefined;
      if (!head || head.owner !== expected.owner || head.snapshotThrough !== expected.snapshotThrough) return;
      if (head.snapshotFormat !== 3) {
        // The earliest native releases did not write the format hint. Inspect
        // only that migration case; legacy evidence suffixes remain protected.
        const snapshot = await this.request(tx.objectStore("snapshots").get(snapshotKey(key, head.snapshotThrough))) as JournalSnapshot | undefined;
        if (!seed?.snapshotPolicy || !snapshot || snapshot.sha256 !== legacy?.sha256) return;
      }
      const rows = tx.objectStore("rows"), prefix = keyPrefix(key);
      await deleteJournalKeyRange(rows, rowKey(key, 0), rowKey(key, head.snapshotThrough), value => this.request(value));
      const chunks = tx.objectStore("chunks");
      const packed = await this.request(chunks.getAllKeys(typeof IDBKeyRange === "undefined" ? undefined : IDBKeyRange.bound(prefix, prefix + "\uffff")));
      for (const chunk of packed) if (typeof chunk === "string" && chunk.startsWith(prefix)) await this.request(chunks.delete(chunk));
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
      if (cursor.saveFormat === 3) return { owner: cursor.owner, through: cursor.through, candidate: {
        saveFormat: 3, lineage: cursor.lineage, legacyBaseSnapshot: cursor.legacyBaseSnapshot, campaign: cursor.campaign, snapshot: cursor.snapshot,
        evidence: { headerSha256: cursor.headerSha256, fromRecord: 0, toRecord: 0, records: [] },
        usageQuestions: cursor.usageQuestions.filter(r => !head.acknowledgedUsage?.includes(r.receipt_id)) } };
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
        ...(candidate.saveFormat === 3 ? { saveFormat: 3, lineage: candidate.lineage, legacyBaseSnapshot: candidate.legacyBaseSnapshot } : {}),
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
  async bind(key: string, owner: string, expected: JournalHead | null, seed: JournalSeed, sha256: string, _packed?: JournalSeed | EncodedJournalValue) {
    const actual = this.data.get(key);
    if (actual?.head.owner === owner && actual.snapshots.get(actual.head.snapshotThrough)?.sha256 === sha256) return copy(actual.head);
    if ((actual?.head.owner ?? null) !== (expected?.owner ?? null) || (actual?.head.highWater ?? null) !== (expected?.highWater ?? null)) conflict();
    const through = (actual?.head.highWater ?? -1) + 1;
    const pendingUsageIds = seed.usageQuestions.map(r => r.receipt_id);
    const head: JournalHead = { schemaVersion: 1, key, owner, highWater: through, snapshotThrough: through, previousThrough: actual?.head.snapshotThrough ?? null,
      pendingUsageIds, acknowledgedUsage: actual?.head.acknowledgedUsage?.filter(id => pendingUsageIds.includes(id)) ?? [], profileOrder: this.profileOrder(key),
      acknowledgedRecords: seed.confirmed?.evidence.records.length ?? 0, ...(seed.snapshotPolicy ? { snapshotFormat: 3 } : {}) };
    const d = actual ?? { head, snapshots: new Map(), rows: new Map() };
    if (actual?.head.previousThrough !== null && actual?.head.previousThrough !== undefined) d.snapshots.delete(actual.head.previousThrough);
    for (const version of d.rows.keys()) if (version <= (seed.snapshotPolicy ? actual?.head.highWater ?? -1 : actual?.head.snapshotThrough ?? -1)) d.rows.delete(version);
    d.snapshots.set(through, copy({ key, through, seed, sha256 })); d.head = head; this.data.set(key, d); return copy(head);
  }
  async append(key: string, owner: string, from: number, rows: JournalRow[], _packed?: readonly StoredRow[]) {
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
  async compact(key: string, owner: string, through: number, seed: JournalSeed, sha256: string, _packed?: JournalSeed | EncodedJournalValue) {
    const d = this.data.get(key); if (!d || d.head.owner !== owner || through > d.head.highWater) conflict();
    if (through === d!.head.snapshotThrough) return;
    const fault = this.fault; this.fault = null;
    if (fault === "before-commit") throw new CloudCacheError("transaction");
    if (d!.head.previousThrough !== null) d!.snapshots.delete(d!.head.previousThrough);
    for (const version of d!.rows.keys()) if (version <= (seed.snapshotPolicy ? through : d!.head.snapshotThrough)) d!.rows.delete(version);
    d!.snapshots.set(through, copy({ key, through, seed, sha256 }));
    d!.head = { ...d!.head, snapshotThrough: through, previousThrough: d!.head.snapshotThrough, ...(seed.snapshotPolicy ? { snapshotFormat: 3 } : {}) };
    if (fault === "after-commit") throw new CloudCacheError("transaction");
  }
  async reclaimCovered(key: string, expected: JournalHead) {
    const data = this.data.get(key), head = data?.head;
    if (!head || head.owner !== expected.owner || head.snapshotThrough !== expected.snapshotThrough || !data!.snapshots.get(head.snapshotThrough)?.seed.snapshotPolicy) return;
    for (const version of data!.rows.keys()) if (version <= head.snapshotThrough) data!.rows.delete(version);
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
    if (value.candidate.saveFormat === 3) return copy({ ...value, candidate: { ...value.candidate,
      usageQuestions: value.candidate.usageQuestions.filter(r => !head.acknowledgedUsage?.includes(r.receipt_id)) } });
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
  private rebasing: { through: number; work(through: number): Promise<void> } | null = null;
  private rebaseActive: Promise<boolean> | null = null;
  private active: Promise<boolean> | null = null;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private dueAt = Infinity;
  private retries = 0;
  private stopped = false;
  private version: number;
  committed: number;
  error: unknown = null;
  onCommit?: (row: JournalRow) => void;
  onRecovered?: () => void;
  constructor(readonly store: JournalStorage, readonly key: string, readonly owner: string, highWater: number,
    private readonly onFailure: (error: unknown) => void,
    private readonly prepareHashes?: (rows: readonly JournalRow[]) => Promise<readonly string[] | null>) { this.version = this.committed = highWater; }
  get canAccept() { return !this.stopped && (!this.error || isTransientStorageError(this.error)) && this.pending.length < LOCAL_JOURNAL_QUEUE_LIMIT; }
  get dirty() { return this.version > this.committed; }
  get highWater() { return this.version; }
  get queued() { return this.pending.length; }
  get rebasePending() { return this.rebasing !== null; }
  accept(row: Omit<JournalRow, "version">, tick = false): void {
    if (!this.canAccept) throw new CloudCacheError("transaction");
    this.acceptAdmitted(row, tick);
  }
  /** Capacity reserved by the async session BEFORE dispatch. A storage failure
   * during computation cannot discard its already admitted recovery delta. */
  acceptAdmitted(row: Omit<JournalRow, "version">, tick = false): void {
    if (this.stopped || this.pending.length >= LOCAL_JOURNAL_QUEUE_LIMIT) throw new CloudCacheError("transaction");
    this.pending.push({ ...row, version: ++this.version });
    if (isTransientStorageError(this.error)) { this.scheduleRetry(); return; }
    const due = Date.now() + (tick ? LOCAL_TICK_COMMIT_MS : LOCAL_COMMIT_MS);
    if (due < this.dueAt) {
      if (this.timer !== null) clearTimeout(this.timer);
      this.dueAt = due; this.timer = setTimeout(() => { this.timer = null; this.dueAt = Infinity; void this.drain(); }, Math.max(0, due - Date.now()));
    }
  }
  private scheduleRetry(): void {
    if (this.stopped || this.timer !== null) return;
    const delay = Math.min(10_000, 250 * 2 ** Math.min(this.retries++, 6));
    this.dueAt = Date.now() + delay;
    this.timer = setTimeout(() => { this.timer = null; this.dueAt = Infinity; void this.drain(); }, delay);
  }
  private failed(error: unknown): false {
    this.error = error; this.onFailure(error);
    if (isTransientStorageError(error)) this.scheduleRetry();
    return false;
  }
  /** Install the new baseline before any deltas that refer to it can commit.
   * Accepted commands continue synchronously in the bounded pending queue. */
  rebase(work: (through: number) => Promise<void>): Promise<boolean> {
    if (!this.rebasing) this.rebasing = { through: this.version, work };
    return this.finishRebase();
  }
  private finishRebase(): Promise<boolean> {
    if (this.rebaseActive) return this.rebaseActive;
    const job = this.rebasing; if (!job) return Promise.resolve(true);
    this.rebaseActive = (async () => {
      if (!await this.drainThrough(job.through)) return false;
      await journalQuotaRetry(() => job.work(job.through));
      this.rebasing = null; this.error = null; this.retries = 0;
      try { this.onRecovered?.(); } catch (error) { problemDiagnostics.error("journal-observer", error); }
      return true;
    })().catch(error => this.failed(error)).finally(() => { this.rebaseActive = null; });
    return this.rebaseActive;
  }
  async drain(): Promise<boolean> {
    const target = this.version;
    if (this.rebasing && !await this.finishRebase()) return false;
    return this.drainThrough(target);
  }
  private async drainThrough(target: number): Promise<boolean> {
    if (this.timer !== null) { clearTimeout(this.timer); this.timer = null; this.dueAt = Infinity; }
    while (this.committed < target && !this.stopped) {
      if (this.active) { if (!await this.active) return false; continue; }
      const rows = this.pending.filter(row => row.version <= target), from = this.committed;
      this.active = journalQuotaRetry(async () => {
        if (this.prepareHashes && rows.some(row => !preparedHashes.has(row))) {
          const hashes = await this.prepareHashes(rows);
          if (hashes) {
            if (hashes.length !== rows.length || hashes.some(hash => !/^[a-f0-9]{64}$/.test(hash))) throw new CloudCacheError("checksum");
            rows.forEach((row, index) => preparedHashes.set(row, hashes[index]!));
          }
        }
        const encoded = rows.map(row => preparedJournalValue<StoredRow>(row));
        return this.store.append(this.key, this.owner, from, rows, encoded.every((value): value is StoredRow => value !== undefined) ? encoded : undefined);
      }).then(through => {
        this.committed = through; this.pending = this.pending.filter(r => r.version > through); this.error = null; this.retries = 0;
        try { this.onCommit?.(rows.at(-1)!); } catch (error) { problemDiagnostics.error("journal-observer", error); }
        return true;
      }).catch(error => this.failed(error)).finally(() => { this.active = null; });
      if (!await this.active) return false;
    }
    return !this.stopped && this.committed >= target;
  }
  stop() { this.stopped = true; if (this.timer !== null) clearTimeout(this.timer); }
}
