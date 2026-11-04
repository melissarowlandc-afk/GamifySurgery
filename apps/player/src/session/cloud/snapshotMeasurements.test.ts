import { expect, it } from "vitest";
import { importGameEvidence, serializeGameState, createGameEvidenceCheckpoint, applyGameEvidenceCommand, gameEvidenceDelta, PROTOTYPE_DOMAIN_CONTEXT } from "@gamify-surgery/game-domain";
import { writeFileSync, mkdirSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { largeEntryFixture } from "./entryPerformanceTestSupport";
import { decompressCloudText } from "./codecCompression";
import { runCloudCodecTask } from "./codecTasks";
import { snapshotEvidence, SNAPSHOT_BASELINE } from "./snapshotCodec";
import { MemoryCloudCache } from "./cache";
import { FakeCloudServer } from "./fakeTransport";
import { CloudSyncCoordinator } from "./coordinator";
import { CloudGameSession } from "./gameSession";
import { TestCloudClock } from "./syncTestSupport";
import { CloudSyncError, type CloudConfirmed } from "./transport";
import { importLocalCloudCampaign } from "./importCampaigns";
import { MemoryCloudEntryStore } from "./entryStorage";
import { logicalJsonText, sha256Utf8 } from "./codecJson";
import { MemoryJournalStorage, LocalJournalDrain } from "../localJournal";
import { bindJournal } from "./journalCodec";
import { cloudCodec } from "./codecWorker";
import { openAutomaticCloudCampaign } from "./automaticResolution";

it.each([["retained-level5", 0, false], ["existing-5mb", 1_200, true]] as const)("measures complete resumable state separately from the legacy move archive (%s)", async (name, actions, storedBlocks) => {
    const fixture = await largeEntryFixture(actions, storedBlocks);
    const start = performance.now();
    const state = importGameEvidence(fixture.prepared.checkpoint.snapshot, fixture.prepared.checkpoint.evidence);
    const hydrateMs = performance.now() - start;
    const stateText = serializeGameState(state), parsed = JSON.parse(stateText);
    const fields = Object.entries(parsed).map(([field, value]) => ({ field, bytes: Buffer.byteLength(JSON.stringify(value)),
      ...(Array.isArray(value) ? { entries: value.length } : value && typeof value === "object" ? { entries: Object.keys(value).length } : {}) })).sort((a, b) => b.bytes - a.bytes);
    const packed = fixture.copy.evidence, evidenceBytes = packed.header.compressedBytes + packed.records.reduce((sum, row) => sum + row.content.compressedBytes, 0);
    const snapshot = await decompressCloudText(fixture.copy.snapshot);
    const cloned = performance.now(); structuredClone(state); const cloneMs = performance.now() - cloned;
    const row = { name, sourceSha256: await sha256Utf8(fixture.source), actions, storedBlocks, records: packed.records.length, copyBytes: Buffer.byteLength(JSON.stringify(fixture.copy)),
      legacyOperationalBytes: Buffer.byteLength(snapshot), legacyOperationalStoredBytes: fixture.copy.snapshot.compressedBytes,
      evidenceStoredBytes: evidenceBytes, stateBytes: Buffer.byteLength(stateText), stateGzipBytes: gzipSync(stateText).length,
      hydrateMs, cloneMs, fields: fields.slice(0, 15) };
    expect(state.learningHistories).toEqual(importGameEvidence(fixture.prepared.checkpoint.snapshot, fixture.prepared.checkpoint.evidence).learningHistories);
  mkdirSync("../../.local-dev/snapshot-only-saves-20261103", { recursive: true });
  writeFileSync(`../../.local-dev/snapshot-only-saves-20261103/before-measurements-${name}.json`, JSON.stringify(row, null, 2));
  expect(row.stateBytes > 0 && row.evidenceStoredBytes > row.legacyOperationalStoredBytes).toBe(true);
  const lineage = { branchId: "measure.current", sequence: 0, parents: [] };
  const task = { kind: "snapshotEncode" as const, input: { state, campaign: fixture.prepared.envelope.campaign, lineage } };
  const clonedTask = performance.now(); structuredClone(task); const mainThreadCloneMs = performance.now() - clonedTask;
  const encodeStart = performance.now(), encoded = await runCloudCodecTask(task), snapshotEncodeMs = performance.now() - encodeStart;
  const native: CloudConfirmed = { saveFormat: 3, lineage, campaignId: state.campaignId, revision: "1", acceptedAtMs: 1_800_000_000_000,
    snapshot: encoded.snapshot, evidence: await snapshotEvidence(), baselineId: SNAPSHOT_BASELINE };
  const clock = new TestCloudClock(), server = new FakeCloudServer(() => clock.wall);
  server.seed("measure", native); server.setAccess("measure", { snapshotSaves: true });
  const scope = { accountId: "measure", backendId: "measurement", campaignId: state.campaignId }, cache = new MemoryCloudCache();
  const coordinator = new CloudSyncCoordinator({ scope, cache, transport: server.transport("measure"), clock, enabled: true });
  const openStart = performance.now(); expect(await coordinator.open()).toBe(true); await coordinator.startWriter(); coordinator.resume();
  const session = await CloudGameSession.create(coordinator), openMs = performance.now() - openStart;
  expect(session.state).toEqual(state); session.dispose();
  const baselineStart = performance.now(), checkpoint = createGameEvidenceCheckpoint(state), baselineMs = performance.now() - baselineStart;
  const journal = new MemoryJournalStorage(), key = "perf.local", seed = { checkpoint, campaign: task.input.campaign, source: null, confirmed: null, usageQuestions: [] };
  const head = await bindJournal(journal, key, "perf", seed, cloudCodec), drain = new LocalJournalDrain(journal, key, "perf", head.highWater, error => { throw error; });
  let current = checkpoint; const commands: number[] = [], ticks: number[] = [], commits: number[] = [];
  for (let i = 0; i < 6; i++) {
    const started = performance.now(), before = current;
    const command = i % 2 ? { type: "ADVANCE_TICK" as const, advancedAtRealMs: i, operationId: `perf.tick.${i}` } :
      { type: "SET_SIMULATION_SPEED" as const, speed: 4 as const, operationId: `perf.action.${i}` };
    current = applyGameEvidenceCommand(current, command).checkpoint;
    drain.accept({ delta: gameEvidenceDelta(before, current), campaign: task.input.campaign, usageQuestions: [] }, i % 2 === 1);
    (i % 2 ? ticks : commands).push(performance.now() - started);
    const commit = performance.now(); expect(await drain.drain()).toBe(true); commits.push(performance.now() - commit);
  }
  drain.stop();
  const after = { name, snapshotStoredBytes: encoded.snapshot.compressedBytes, snapshotRawBytes: encoded.snapshot.uncompressedBytes,
    copyBytes: Buffer.byteLength(JSON.stringify(native)), uploadedEvidenceRows: encoded.evidence.records.length,
    mainThreadCloneMs, snapshotEncodeMs, openMs, baselineMs, commandsMs: commands, ticksMs: ticks, memoryJournalCommitsMs: commits };
  writeFileSync(`../../.local-dev/snapshot-only-saves-20261103/after-measurements-${name}.json`, JSON.stringify(after, null, 2));
  if (actions) {
    // Reopen a capacity-fenced legacy account; the new capability converts the
    // exact pending local state and removes its evidence before future saves.
    const legacyServer = new FakeCloudServer(() => clock.wall); legacyServer.seed("migration", fixture.copy);
    const legacyCache = new MemoryCloudCache();
    const c = new CloudSyncCoordinator({ scope: { ...scope, accountId: "migration" }, transport: legacyServer.transport("migration"), cache: legacyCache, clock, enabled: true });
    expect(await c.open()).toBe(true); await c.startWriter(); c.resume();
    const s = await CloudGameSession.create(c);
    s.execute({ type: "SET_SIMULATION_SPEED", speed: 2, operationId: "capacity.pending" }, PROTOTYPE_DOMAIN_CONTEXT);
    const latest = s.state;
    legacyServer.faults.push({ method: "commit", at: "before", error: new CloudSyncError("capacity") });
    expect(await s.checkpointNow("purchase")).toBe(false); expect(c.view.failure).toBe("capacity");
    s.detach(); c.dispose();
    const entries = new MemoryCloudEntryStore(); legacyServer.setAccess("migration", { snapshotSaves: true });
    const migrated = await openAutomaticCloudCampaign({ runtime: { ...scope, accountId: "migration", region: "test",
      transport: legacyServer.transport("migration"), cache: legacyCache, entryStore: entries }, campaignId: scope.campaignId, clock });
    const newSession = await CloudGameSession.create(migrated); expect(newSession.state).toEqual(latest);
    expect(await newSession.checkpointNow("purchase")).toBe(true); expect(migrated.confirmed!.saveFormat).toBe(3);
    expect(migrated.confirmed!.evidence.records).toEqual([]); expect(legacyServer.operationCount("migration")).toBe(1); newSession.dispose();
    const localServer = new FakeCloudServer(), localStore = new MemoryCloudEntryStore(); localServer.setAccess("local.migrate", { snapshotSaves: true });
    const source = { id: "large.local", sourceKey: "local.fixture", unowned: false, serializedState: stateText,
      campaign: task.input.campaign, bytes: Buffer.byteLength(stateText), facilityLevel: state.facilityLevel, error: null, localEvidence: fixture.prepared.checkpoint };
    const imported = await importLocalCloudCampaign(source, source.campaign.name, localServer.transport("local.migrate"), localStore);
    expect(logicalJsonText(JSON.parse(serializeGameState(imported.verified.state)))).toBe(logicalJsonText(JSON.parse(stateText)));
    expect(imported.loaded.saveFormat).toBe(3); expect(imported.loaded.evidence.records).toEqual([]);
  }
}, 240_000);
