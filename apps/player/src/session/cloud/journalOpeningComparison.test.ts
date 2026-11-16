import { afterEach, expect, it, vi } from "vitest";
import { createGameEvidenceCheckpoint, createInitialGameState, importGameEvidence } from "@gamify-surgery/game-domain";
import { MemoryJournalStorage, type JournalSeed } from "../localJournal";
import { codecTestCampaign } from "./codecTestSupport";
import * as snapshots from "./snapshotCodec";
import { logicalJsonText, sha256Utf8, type CodecJson } from "./codecJson";
import { prepareJournalInWorker } from "./journalCodec";

afterEach(() => vi.restoreAllMocks());
const canonical = (value: unknown) => logicalJsonText(JSON.parse(JSON.stringify(value)) as CodecJson);

it.each(["unchanged", "changed", "metadata", "reordered", "older", "older-usage"])(
  "matches the pre-optimization native preparation byte for byte (%s)", async scenario => {
    const state = createInitialGameState(), campaign = codecTestCampaign(JSON.stringify(state));
    const base = await snapshots.snapshotCopy(state, campaign, "1", 1_800_000_000_000,
      { branchId: "public.opening.comparison", sequence: 20, parents: [] });
    const current = structuredClone(state);
    if (scenario === "changed") current.simulationSpeed = 4;
    if (scenario === "reordered") current.learningHistories = Object.fromEntries(Object.entries(current.learningHistories).reverse());
    const metadata = scenario === "metadata" ? { ...campaign, updatedAtRealMs: campaign.updatedAtRealMs + 1 } : campaign;
    const usageQuestions = scenario === "older-usage" ? [{ kind: "question" as const,
      receipt_id: "00000000-0000-4000-8000-000000000001", occurred_at: "2027-01-15T08:00:00.000Z" }] : [];
    const seed: JournalSeed = { checkpoint: createGameEvidenceCheckpoint(current), campaign: metadata, confirmed: base,
      source: null, usageQuestions, snapshotPolicy: { lineage: { ...base.lineage!, sequence: scenario.startsWith("older") ? 19 : 21 } } };
    const store = new MemoryJournalStorage(), key = "public.opening.comparison";
    await store.bind(key, "public.owner", null, seed, await sha256Utf8(JSON.stringify(seed)));

    // Retained algorithm: encode before comparing canonical state/campaign.
    // This intentionally exercises the old work so the candidate bytes, usage,
    // older-prefix rule and lineage cannot change with the fast path.
    const oldState = importGameEvidence(seed.checkpoint.snapshot, seed.checkpoint.evidence);
    const encoded = await snapshots.encodeCloudSnapshot({ state: oldState, campaign: seed.campaign,
      lineage: { ...seed.snapshotPolicy!.lineage, sequence: seed.snapshotPolicy!.lineage.sequence + seed.checkpoint.snapshot.head.sequence } });
    const loaded = await snapshots.loadCloudSnapshot({ ...base, expectedRevision: "1", expectedCampaignId: state.campaignId });
    const same = canonical(loaded.state) === canonical(oldState) && canonical(loaded.campaign) === canonical(seed.campaign);
    const older = loaded.snapshotLineage.branchId === encoded.lineage.branchId && loaded.snapshotLineage.sequence > encoded.lineage.sequence;
    const expected = older && !usageQuestions.length ? null : { saveFormat: 3, lineage: same ? loaded.snapshotLineage : encoded.lineage,
      campaign: seed.campaign, snapshot: same ? base.snapshot : encoded.snapshot,
      evidence: { headerSha256: encoded.evidence.header.uncompressedSha256, fromRecord: 0, toRecord: 0, records: [] }, usageQuestions };
    const result = await prepareJournalInWorker({ data: (await store.read(key))!, base });
    expect(JSON.stringify(result!.candidate)).toBe(JSON.stringify(expected));
  }, 30_000);

it.each(["lineage", "campaign", "identity", "checksum"])("keeps the unchanged fast path fail-closed for invalid %s", async changed => {
  const state = createInitialGameState(), campaign = codecTestCampaign(JSON.stringify(state));
  const base = await snapshots.snapshotCopy(state, campaign, "1", 0,
    { branchId: "public.opening.guards", sequence: 20, parents: [] });
  const seed: JournalSeed = { checkpoint: createGameEvidenceCheckpoint(state), campaign, source: null, confirmed: base, usageQuestions: [],
    snapshotPolicy: { lineage: { ...base.lineage! } } };
  if (changed === "lineage") seed.snapshotPolicy!.lineage.sequence = -1;
  if (changed === "campaign") seed.campaign = { ...campaign, name: "" };
  if (changed === "identity") seed.campaign = { ...campaign, campaignId: "different.campaign" };
  const store = new MemoryJournalStorage(), key = "public.opening.guard";
  await store.bind(key, "public.owner", null, seed, changed === "checksum" ? "0".repeat(64) : await sha256Utf8(JSON.stringify(seed)));
  const encode = vi.spyOn(snapshots, "encodeCloudSnapshot");
  await expect(prepareJournalInWorker({ data: (await store.read(key))!, base })).rejects.toBeInstanceOf(Error);
  expect(encode).not.toHaveBeenCalled();
});
