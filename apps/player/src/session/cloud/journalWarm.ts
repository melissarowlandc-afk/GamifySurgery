import { applyGameEvidenceJournalPatches, gameEvidenceOperationalSnapshot, gameEvidenceProjection, type EvidenceObject,
  type GameEvidenceCheckpoint, type GameEvidenceRecord, type GameEvidenceSnapshot } from "@gamify-surgery/game-domain";
import { journalRowText, journalWorkerStore, type JournalHead, type JournalRow, type JournalSeed, type JournalWorkerAddress } from "../localJournal";
import { CloudCacheError } from "./codecCache";
import { compressCloudText } from "./codecCompression";
import { loadCloudEvidenceCheckpoint, type CloudEvidenceEnvelope } from "./codecEvidence";
import { logicalJsonText, sha256Utf8, type CodecJson } from "./codecJson";
import { prepareJournalInWorker } from "./journalCodec";
import type { CloudCandidate } from "./transport";

type PackedRecord = CloudCandidate["evidence"]["records"][number];
interface Mirror {
  owner: string; through: number; base: GameEvidenceCheckpoint; projected: EvidenceObject; head: GameEvidenceSnapshot["head"];
  records: GameEvidenceRecord[]; packed: PackedRecord[]; recordText: string; archivePrefix: string;
  seed: JournalSeed; headerSha256: string; published: boolean;
}
const mirrors = new Map<string, Mirror>(), queues = new Map<string, Promise<unknown>>();
const canonical = (value: unknown) => logicalJsonText(value as CodecJson);

/** Worker-private mutable projection. Inputs are committed/hash-checked domain
 * results. No reducers, answer replay, main-thread state clone or prefix encode. */
function patch(mirror: Mirror, row: JournalRow): void {
  if (row.delta) {
    const delta = row.delta;
    if (delta.fromSequence !== mirror.head.sequence || delta.fromRecord !== mirror.records.length ||
      delta.records.some((r, i) => r.id !== `e${(mirror.records.length + i + 1).toString(36)}`)) throw new CloudCacheError("checksum");
    mirror.projected = applyGameEvidenceJournalPatches(mirror.projected, delta.patches);
    if (delta.records.length) mirror.recordText += (mirror.records.length ? "," : "") + delta.records.map(canonical).join(",");
    mirror.records.push(...delta.records); mirror.head = delta.head;
  }
  mirror.seed = { ...mirror.seed, campaign: row.campaign, usageQuestions: row.usageQuestions };
  mirror.through = row.version;
}
async function initialize(address: JournalWorkerAddress): Promise<Mirror | null> {
  const store = journalWorkerStore(address), data = await store.read(address.key); if (!data) return null;
  const loaded = await prepareJournalInWorker({ data, encode: false, local: true });
  if (!loaded?.seed?.source || !loaded.seed.confirmed) return null;
  const seed = loaded.seed, base = seed.checkpoint, confirmed = seed.confirmed!;
  const accepted = await loadCloudEvidenceCheckpoint({ ...confirmed, expectedRevision: confirmed.revision,
    expectedCampaignId: confirmed.campaignId, expectedBaselineId: confirmed.baselineId });
  if (canonical(base.evidence.baseline) !== canonical(accepted.checkpoint.evidence.baseline) ||
    accepted.checkpoint.evidence.records.some((r, i) => canonical(r) !== canonical(base.evidence.records[i]))) throw new CloudCacheError("checksum");
  const records = [...base.evidence.records];
  const header = { formatVersion: 1, version: 1, campaignId: base.evidence.campaignId, source: seed.source, baseline: base.evidence.baseline };
  if (await sha256Utf8(canonical(header)) !== confirmed.evidence.header.uncompressedSha256) throw new CloudCacheError("checksum");
  const archivePrefix = canonical({ baseline: base.evidence.baseline, campaignId: base.evidence.campaignId }).slice(0, -1) + ',"records":[';
  return { owner: data.head.owner, through: data.head.highWater, base, projected: gameEvidenceProjection(base), head: base.snapshot.head,
    records, packed: [...confirmed.evidence.records], recordText: records.map(canonical).join(","), archivePrefix,
    seed, headerSha256: confirmed.evidence.header.uncompressedSha256, published: false };
}
async function warm(address: JournalWorkerAddress, owner: string): Promise<{ through: number }> {
  const id = JSON.stringify(address), store = journalWorkerStore(address);
  if ((await store.head(address.key))?.owner !== owner) throw new CloudCacheError("conflict");
  let mirror = mirrors.get(id), head: JournalHead;
  const changes = mirror ? await store.changes(address.key, mirror.through) : null;
  if (!mirror || !changes || changes.head.owner !== mirror.owner || changes.rows.length !== changes.head.highWater - mirror.through) {
    mirror = await initialize(address) ?? undefined;
    if (!mirror) throw new CloudCacheError("unavailable");
    mirrors.delete(id); mirrors.set(id, mirror);
    while (mirrors.size > 2) mirrors.delete(mirrors.keys().next().value!);
    head = (await store.head(address.key))!;
  } else {
    head = changes.head;
    for (const row of changes.rows) {
      if (row.version !== mirror.through + 1 || await sha256Utf8(journalRowText(row)) !== row.sha256) throw new CloudCacheError("checksum");
      patch(mirror, row);
    }
  }
  if (head.owner !== mirror.owner || mirror.owner !== owner) throw new CloudCacheError("conflict");
  if (head.highWater > mirror.through) {
    const trailing = await store.changes(address.key, mirror.through);
    if (!trailing || trailing.head.owner !== mirror.owner || trailing.rows.length !== trailing.head.highWater - mirror.through) throw new CloudCacheError("conflict");
    head = trailing.head;
    for (const row of trailing.rows) {
      if (row.version !== mirror.through + 1 || await sha256Utf8(journalRowText(row)) !== row.sha256) throw new CloudCacheError("checksum");
      patch(mirror, row);
    }
  }
  const from = Math.max(mirror.seed.confirmed!.evidence.records.length, head.acknowledgedRecords ?? 0);
  if (from > mirror.records.length) throw new CloudCacheError("checksum");
  const added: PackedRecord[] = [];
  for (let i = mirror.packed.length; i < mirror.records.length; i += 16) {
    const rows = await Promise.all(mirror.records.slice(i, i + 16).map(async row => ({ id: row.id, content: await compressCloudText(canonical(row), "gzip") })));
    mirror.packed.push(...rows); added.push(...rows);
  }
  // Existing immutable record strings are retained as a rope. Only new rows
  // are serialized/compressed; the v2 manifest still hashes the exact archive.
  const manifest = await sha256Utf8(mirror.archivePrefix + mirror.recordText + '],"version":1}');
  const envelope: CloudEvidenceEnvelope = { cloudFormatVersion: 2, evidenceContractVersion: 1, campaign: mirror.seed.campaign,
    baselineId: `baseline.${mirror.seed.source!.sha256}`, evidenceHighWater: mirror.records.length, evidenceManifestSha256: manifest,
    operational: gameEvidenceOperationalSnapshot(mirror.base, mirror.projected, mirror.head) };
  const candidate: CloudCandidate = { campaign: mirror.seed.campaign, snapshot: await compressCloudText(canonical(envelope), "gzip"),
    evidence: { headerSha256: mirror.headerSha256, fromRecord: from, toRecord: mirror.records.length, records: mirror.packed.slice(from) },
    usageQuestions: mirror.seed.usageQuestions.filter(r => !head.acknowledgedUsage?.includes(r.receipt_id)) };
  // A restarted worker may have packed rows before its last response/write was
  // lost. Include the suffix on a first publication; storage verifies identity.
  await store.prepare(address.key, mirror.owner, mirror.through, candidate, mirror.published ? added : mirror.packed.slice(from));
  mirror.published = true;
  return { through: mirror.through };
}
export function warmJournalInWorker(input: { address: JournalWorkerAddress; owner: string }): Promise<{ through: number }> {
  const { address, owner } = input;
  const id = JSON.stringify(address), prior = queues.get(id) ?? Promise.resolve();
  const work = prior.catch(() => {}).then(() => warm(address, owner)); queues.set(id, work);
  void work.finally(() => { if (queues.get(id) === work) queues.delete(id); }).catch(() => { mirrors.delete(id); });
  return work;
}
