import { importGameEvidence, restoreGameEvidenceJournal } from "@gamify-surgery/game-domain";
import { journalWorkerStore, journalQuotaRetry, journalRowText, type JournalAddress, type JournalHead, type JournalRead, type JournalSeed, type JournalStorage } from "../localJournal";
import { CloudCacheError } from "./codecCache";
import { encodeCloudEvidenceCheckpoint, loadCloudEvidenceCheckpoint } from "./codecEvidence";
import { logicalJsonText, sha256Utf8, type CodecJson } from "./codecJson";
import type { CloudCandidate, CloudConfirmed } from "./transport";
import { cloudProgress } from "./progress";

export interface JournalPreparationInput {
  address?: JournalAddress;
  data?: JournalRead;
  base?: CloudConfirmed;
  compact?: boolean;
  local?: boolean;
  encode?: boolean;
}
export interface JournalPreparation {
  through: number;
  candidate: CloudCandidate | null;
  base: CloudConfirmed | null;
  /** Returned only for inline stores/local opening, never ordinary native prep. */
  seed?: JournalSeed;
  state?: ReturnType<typeof importGameEvidence>;
  writerGeneration?: string;
  profileOrder?: number;
}
function rejectRewind(seed: JournalSeed, latest: JournalPreparation | null): void {
  if (!latest?.seed || !latest.state) return;
  const state = importGameEvidence(seed.checkpoint.snapshot, seed.checkpoint.evidence);
  const proposed = [state.facilityTick, seed.checkpoint.snapshot.head.sequence, cloudProgress(state).xp, state.facilityLevel, seed.checkpoint.evidence.records.length];
  const current = [latest.state.facilityTick, latest.seed.checkpoint.snapshot.head.sequence, cloudProgress(latest.state).xp, latest.state.facilityLevel, latest.seed.checkpoint.evidence.records.length];
  for (let i = 0; i < proposed.length; i++) {
    if (proposed[i]! < current[i]!) throw new CloudCacheError("conflict");
    if (proposed[i]! > current[i]!) return;
  }
}
export async function bindJournalInWorker(input: { address: JournalAddress; owner: string; expected: JournalHead | null; seed: JournalSeed }): Promise<JournalHead> {
  importGameEvidence(input.seed.checkpoint.snapshot, input.seed.checkpoint.evidence);
  const store = journalWorkerStore(input.address);
  rejectRewind(input.seed, await prepareJournalInWorker({ address: input.address, encode: false, local: true }));
  const head = await store.bind(input.address.key, input.owner, input.expected, input.seed, await sha256Utf8(JSON.stringify(input.seed)));
  const committed = await store.read(input.address.key);
  if (!committed || committed.head.owner !== input.owner || await sha256Utf8(JSON.stringify(committed.snapshot.seed)) !== committed.snapshot.sha256) throw new CloudCacheError("checksum");
  return head;
}
export async function prepareJournalInWorker(input: JournalPreparationInput): Promise<JournalPreparation | null> {
  const store = input.address ? journalWorkerStore(input.address) : null;
  const data = input.data ?? await store?.read(input.address!.key);
  if (!data) return null;
  if (data.head.schemaVersion !== 1) throw new CloudCacheError("version");
  if (await sha256Utf8(JSON.stringify(data.snapshot.seed)) !== data.snapshot.sha256) throw new CloudCacheError("checksum");
  for (const row of data.rows) if (await sha256Utf8(journalRowText(row)) !== row.sha256) throw new CloudCacheError("checksum");
  if (data.rows.length !== data.head.highWater - data.head.snapshotThrough || data.rows.some((r, i) => r.version !== data.head.snapshotThrough + i + 1)) throw new CloudCacheError("checksum");
  const checkpoint = restoreGameEvidenceJournal(data.snapshot.seed.checkpoint, data.rows.flatMap(row => row.delta ? [row.delta] : []));
  const last = data.rows.at(-1), prior = data.snapshot.seed;
  const seed: JournalSeed = { ...prior, checkpoint, campaign: last?.campaign ?? prior.campaign,
    writerGeneration: last?.writerGeneration ?? prior.writerGeneration,
    usageQuestions: (last?.usageQuestions ?? prior.usageQuestions).filter(r => !data.head.acknowledgedUsage?.includes(r.receipt_id)),
    ...(last?.profile === undefined ? {} : { profile: last.profile }) };
  let base = input.base ?? seed.confirmed, candidate: CloudCandidate | null = null;
  if (input.encode !== false && base && seed.source) {
    const loaded = await loadCloudEvidenceCheckpoint({ ...base, expectedRevision: base.revision, expectedCampaignId: base.campaignId, expectedBaselineId: base.baselineId });
    const actual = checkpoint.evidence.records, accepted = loaded.checkpoint.evidence.records;
    const equal = (a: unknown, b: unknown) => logicalJsonText(a as CodecJson) === logicalJsonText(b as CodecJson);
    const sameBaseline = equal(checkpoint.evidence.baseline, loaded.checkpoint.evidence.baseline);
    const prefix = sameBaseline && accepted.length <= actual.length && accepted.every((row, i) => equal(row, actual[i]));
    const older = sameBaseline && actual.length <= accepted.length && actual.every((row, i) => equal(row, accepted[i])) &&
      checkpoint.snapshot.head.sequence < loaded.checkpoint.snapshot.head.sequence;
    if (older) base = null; // The acknowledged head covers this older journal; keep its bytes.
    else {
      if (!prefix) base = seed.confirmed;
      if (!base) throw new CloudCacheError("checksum");
      const encoded = await encodeCloudEvidenceCheckpoint({ checkpoint, campaign: seed.campaign, source: seed.source,
        operationId: "local-candidate", expectedRevision: base.revision,
        acknowledgedEvidence: { headerSha256: base.evidence.header.uncompressedSha256, records: base.evidence.records.length }, reuseEvidence: base.evidence });
      if (encoded.snapshot.uncompressedSha256 !== base.snapshot.uncompressedSha256 || encoded.request.evidence.records.length || seed.usageQuestions.length) {
        const evidence = encoded.request.evidence;
        if (!evidence.headerSha256) throw new CloudCacheError("checksum");
        candidate = { campaign: seed.campaign, snapshot: encoded.snapshot,
          evidence: { headerSha256: evidence.headerSha256, fromRecord: evidence.fromRecord, toRecord: evidence.toRecord, records: evidence.records }, usageQuestions: seed.usageQuestions };
      }
    }
  }
  if (input.compact && store) await store.compact(input.address!.key, data.head.owner, data.head.highWater, seed, await sha256Utf8(JSON.stringify(seed)));
  return { through: data.head.highWater, base: store && input.encode === false && !input.local ? null : base,
    candidate, writerGeneration: seed.writerGeneration, profileOrder: data.head.profileOrder,
    ...(!store || input.local ? { seed } : {}), ...(input.local ? { state: importGameEvidence(checkpoint.snapshot, checkpoint.evidence) } : {}) };
}

export async function bindJournal(store: JournalStorage, key: string, owner: string, seed: JournalSeed,
  codec: import("./codecTasks").CloudCodecExecutor): Promise<JournalHead> {
  const expected = await store.head(key);
  if (store.databaseName) return journalQuotaRetry(() => codec.run({ kind: "journalBind", input: { address: { database: store.databaseName!, key }, owner, expected, seed } }));
  rejectRewind(seed, await prepareJournalInWorker({ data: await store.read(key) ?? undefined, encode: false, local: true }));
  return store.bind(key, owner, expected, seed, await sha256Utf8(JSON.stringify(seed)));
}
export async function prepareJournal(store: JournalStorage, key: string, codec: import("./codecTasks").CloudCodecExecutor,
  options: Omit<JournalPreparationInput, "data" | "address"> = {}): Promise<JournalPreparation | null> {
  const input = { ...options, ...(store.databaseName ? { address: { database: store.databaseName, key } } : { data: await store.read(key) ?? undefined }) };
  const result = await journalQuotaRetry(() => codec.run({ kind: "journalPrepare", input }));
  if (result?.seed && options.compact && !store.databaseName) {
    const head = await store.head(key);
    if (!head) throw new CloudCacheError("conflict");
    await store.compact(key, head.owner, result.through, result.seed, await sha256Utf8(JSON.stringify(result.seed)));
  }
  return result;
}
