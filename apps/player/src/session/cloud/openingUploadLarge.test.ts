import { mkdirSync, writeFileSync } from "node:fs";
import { expect, it, vi } from "vitest";
import { applyGameEvidenceCommand } from "@gamify-surgery/game-domain";
import { largeEntryFixture } from "./entryPerformanceTestSupport";
import { encodeCloudEvidenceCheckpoint, loadCloudEvidenceCheckpoint } from "./codecEvidence";
import { decompressCloudText } from "./codecCompression";
import { verifiedEvidenceText, VerifiedEvidenceTextCache } from "./verifiedEvidenceText";
import { VerifiedCopyCache } from "./verifiedCopyCache";
import { prepareCloudWire } from "./codecWire";
import { type CloudCandidate, type CloudCommitRequest } from "./transport";
import { CloudCodecWorker } from "./codecWorker";
import { MessageChannelCloudCodecWorker } from "./codecWorkerMessageTestSupport";
import { FakeCloudServer } from "./fakeTransport";
import { MemoryCloudCache } from "./cache";
import { MemoryCloudEntryStore } from "./entryStorage";
import { openAutomaticCloudCampaign } from "./automaticResolution";
import { CloudGameSession } from "./gameSession";
import { deferred, TestCloudClock } from "./syncTestSupport";
import { cloudEntryTimings } from "./entryTimings";

it("opens 9,119 immutable records without an upload barrier and prepares only a verified suffix", async () => {
  const f = await largeEntryFixture(3_200, false), count = f.copy.evidence.records.length;
  expect(count).toBeGreaterThan(8_500); expect(count).toBe(9_300);
  const checkpoint = applyGameEvidenceCommand(f.prepared.checkpoint,
    { type: "SET_SIMULATION_SPEED", speed: 4, operationId: "large.open.delta" }).checkpoint;
  const measurements: Record<string, unknown> = { records: count, copyBytes: Buffer.byteLength(JSON.stringify(f.copy)) };
  const read = vi.spyOn(verifiedEvidenceText, "read");
  let candidate!: CloudCandidate;
  try {
    for (const reuse of [false, true]) {
      let decompressions = 0, reads = 0;
      const decode = async (value: Parameters<typeof decompressCloudText>[0]) => { decompressions++; return decompressCloudText(value); };
      const cache = new VerifiedEvidenceTextCache(decode), timings: Record<string, number> = {}, work: Record<string, number> = {};
      read.mockImplementation(value => { reads++; return reuse ? cache.read(value) : decode(value); });
      const step = async <T>(name: string, run: () => Promise<T>) => {
        const started = performance.now(), before = decompressions;
        const value = await run(); timings[name] = performance.now() - started; work[name] = decompressions - before; return value;
      };
      const accountInput = { ...f.copy, expectedRevision: "1", expectedCampaignId: f.copy.campaignId, expectedBaselineId: f.copy.baselineId };
      await step("accountVerify", () => loadCloudEvidenceCheckpoint(accountInput));
      const encoded = await step("deltaEncode", () => encodeCloudEvidenceCheckpoint({ checkpoint, campaign: f.prepared.envelope.campaign,
        source: f.provenance, operationId: "large.pending", expectedRevision: "1", reuseEvidence: f.copy.evidence,
        acknowledgedEvidence: { headerSha256: f.copy.evidence.header.uncompressedSha256, records: count } }));
      const evidence = encoded.request.evidence;
      if (typeof evidence.headerSha256 !== "string") throw new Error("Expected immutable evidence suffix");
      candidate = { campaign: f.prepared.envelope.campaign, snapshot: encoded.snapshot, evidence: { ...evidence, headerSha256: evidence.headerSha256 }, usageQuestions: [] };
      expect(evidence.fromRecord).toBe(count); expect(evidence.toRecord).toBe(count + 2); expect(evidence.records).toHaveLength(2);
      expect(encoded.packedEvidence.records.slice(0, count)).toEqual(f.copy.evidence.records);
      const proof = new VerifiedCopyCache(), candidateInput = { ...accountInput, snapshot: encoded.snapshot, evidence: encoded.packedEvidence };
      await step("candidateVerify", () => proof.read(candidateInput));
      const request: CloudCommitRequest = { ...candidate, campaignId: f.copy.campaignId, expectedRevision: "1", protocolVersion: 2,
        operationId: "large.pending", writerGeneration: "1", writerToken: "synthetic-proof" };
      const wire = await step("wireSuffix", () => prepareCloudWire(request, 1_800_000_000_000));
      const body = JSON.parse(wire.text);
      expect(body.evidence.fromRecord).toBe(count); expect(body.evidence.toRecord).toBe(count + 2);
      expect(body.evidence.header).toBeUndefined(); expect(body.evidence.pages).toHaveLength(1);
      await step("receiptVerifyCached", () => proof.read({ ...candidateInput, revision: "2", expectedRevision: "2" }));
      const cloneStarted = performance.now(); structuredClone({ candidate, confirmed: f.copy }); timings.candidateClone = performance.now() - cloneStarted;
      measurements[reuse ? "after" : "before"] = { timingsMs: timings, immutableDecompressions: work, reads, decompressions,
        uploadRecords: evidence.records.length, uploadBytes: Buffer.byteLength(wire.text) };
      if (reuse) { expect(work.deltaEncode).toBe(0); expect(work.candidateVerify).toBe(2); expect(work.receiptVerifyCached).toBe(0); }
    }
    read.mockRestore();
    const native = new MessageChannelCloudCodecWorker(), codec = new CloudCodecWorker(() => native), clock = new TestCloudClock();
    const scope = { backendId: "large-pending-open", accountId: "large-pending-open", campaignId: f.copy.campaignId };
    const cache = new MemoryCloudCache(), entryStore = new MemoryCloudEntryStore(), server = new FakeCloudServer(() => clock.wall);
    server.seed(scope.accountId, f.copy);
    await cache.write({ schemaVersion: 1, scope, confirmed: f.copy, recovery: { baseRevision: "1", writerGeneration: "1",
      inFlight: null, following: candidate } }, null);
    const transport = server.transport(scope.accountId), held = deferred(), commitStarted = deferred(), commit = transport.commit;
    transport.commit = async operation => { commitStarted.resolve(); await held.promise; return commit(operation); };
    const tasks = vi.spyOn(codec, "run"); let session: CloudGameSession | null = null;
    const opening = performance.now();
    try {
      session = await CloudGameSession.create(await openAutomaticCloudCampaign({ runtime: { ...scope, region: "test", cache, entryStore, transport },
        campaignId: scope.campaignId, codec, clock }));
      expect(session.canExecute).toBe(true); expect(session.state.paused).toBe(true); expect(session.state.simulationSpeed).toBe(4);
      expect(server.operationCount(scope.accountId)).toBe(0);
      measurements.openPlayableMs = performance.now() - opening;
      const preparingUpload = performance.now(), upload = session.checkpointNow("ordinary"); await commitStarted.promise;
      measurements.uploadReadyMs = performance.now() - preparingUpload;
      expect(session.canExecute).toBe(true); expect(session.syncView.pending).toBe(true);
      const acknowledging = performance.now(); held.resolve(); expect(await upload).toBe(true);
      measurements.uploadAcknowledgeMs = performance.now() - acknowledging;
      measurements.uploadTimings = cloudEntryTimings.health.timings.filter(row => typeof row[0] === "string" && row[0].startsWith("upload-"));
      expect(session.canExecute).toBe(true); expect(session.needsReload).toBe(false);
      const stored = await transport.load(scope.campaignId);
      expect(stored.evidence.records.slice(0, count)).toEqual(f.copy.evidence.records);
      expect(stored.evidence.records.slice(count)).toEqual(candidate.evidence.records);
      expect(server.operationCount(scope.accountId)).toBe(1); expect(codec.health.restarts).toBe(0);
      measurements.tasks = tasks.mock.calls.reduce((rows, [task]) => ({ ...rows, [task.kind]: (rows[task.kind] ?? 0) + 1 }), {} as Record<string, number>);
      measurements.workerRestarts = codec.health.restarts;
      expect(tasks.mock.calls.filter(([task]) => task.kind === "encode")).toHaveLength(0);
    } finally { held.resolve(); session?.dispose(); codec.dispose(); }
    if (process.env.GAMIFY_OPEN_UPLOAD_MEASURE === "1") {
      const folder = new URL("../../../../../.local-dev/open-with-pending-upload-20261102/", import.meta.url); mkdirSync(folder, { recursive: true });
      writeFileSync(new URL("measurements.json", folder), JSON.stringify(measurements, null, 2));
    }
  } finally { read.mockRestore(); }
}, 600_000); // Includes building 3,200 real reducer actions, outside all timed steps; slow CI runners took >220s.
