import { expect, it, vi } from "vitest";
import { serializeGameState } from "@gamify-surgery/game-domain";
import { parseCodecJson } from "./codecJson";
import { encodeCloudSnapshot, loadCloudSnapshot, prepareSnapshotImport } from "./snapshotCodec";
import { parseSnapshotJson, repairSnapshotNumbers, SNAPSHOT_NUMBER_REPAIR } from "./snapshotNumberRecovery";
import { numericClinic } from "./unsafeNumberTestSupport";
import { compressCloudText, decompressCloudText } from "./codecCompression";
import { CloudCodecWorker } from "./codecWorker";
import { handleCloudCodecMessage, type CloudCodecMessage, type CloudCodecReply, type CloudCodecExecutor } from "./codecTasks";
import { problemDiagnostics } from "../../diagnostics/problemDiagnostics";

it("reproduces unsafe Level-2 pending forecasts from a decremented attendance hold", async () => {
  const f = numericClinic(true);
  expect(f.plan.phases.some(phase => !Number.isSafeInteger(phase.forecast.endsAtTick))).toBe(true);
  expect(f.encounter.pendingResult!.dueTick).toBeGreaterThan(Number.MAX_SAFE_INTEGER);
  expect(() => parseCodecJson(serializeGameState(f.state))).toThrowError(expect.objectContaining({ code: "unsafe_number" }));
  const start = performance.now(), repaired = repairSnapshotNumbers(f.state), repairMs = performance.now() - start;
  expect(repaired.numberRepairs).toEqual([SNAPSHOT_NUMBER_REPAIR]);
  expect(repaired.state.learningHistories).toEqual(f.state.learningHistories);
  expect(repaired.state.encounters[f.encounter.id]!.frozenCase).toEqual(f.encounter.frozenCase);
  const encoded = await encodeCloudSnapshot({ ...f, state: f.state });
  const opened = await loadCloudSnapshot({ snapshot: encoded.snapshot, revision: "57", expectedRevision: "57", expectedCampaignId: f.state.campaignId });
  expect(opened.state).toEqual(repaired.state);
  expect(f.encounter.pendingResult!.dueTick).toBeGreaterThan(Number.MAX_SAFE_INTEGER); // Original retained bytes never mutated.
  process.stdout.write("NUMERIC_RECOVERY_MEASURE " + JSON.stringify({ level: 2, facilityTick: f.state.facilityTick,
    snapshotBytes: new TextEncoder().encode(serializeGameState(f.state)).length,
    unsafeDueTick: f.encounter.pendingResult!.dueTick, repairedDueTick: opened.state.encounters[f.encounter.id]!.pendingResult!.dueTick,
    repairMs: Math.round(repairMs * 1000) / 1000 }) + "\n");
});

it.each([NaN, Infinity, -Infinity, -0, Number.MAX_SAFE_INTEGER + 1])("repairs derived forecast %s through snapshot encode and reopen without changing work/learning", async value => {
  const f = numericClinic();
  f.plan.phases[0]!.forecast.endsAtTick = value;
  // The live and historical carriers deliberately share the corrupted ETA.
  f.encounter.pendingResult!.diagnosticTiming = f.plan;
  f.encounter.steps[0]!.result!.diagnosticTiming = structuredClone(f.plan);
  const expected = repairSnapshotNumbers(f.state);
  const encoded = await encodeCloudSnapshot(f);
  const loaded = await loadCloudSnapshot({ snapshot: encoded.snapshot, revision: "1", expectedRevision: "1", expectedCampaignId: f.state.campaignId });
  expect(loaded.state).toEqual(expected.state);
  expect(loaded.state.learningHistories).toEqual(f.state.learningHistories);
  expect(loaded.state.facilityTick).toBe(3828);
  expect(loaded.state.cashCents).toBe(f.state.cashCents);
  for (const [index, phase] of loaded.state.encounters[f.encounter.id]!.pendingResult!.diagnosticTiming!.phases.entries()) {
    expect({ ...phase, forecast: undefined }).toEqual({ ...f.plan.phases[index], forecast: undefined });
  }
});

it("reopens an existing local profile containing a lossy forecast token but rejects such a token in FSRS", async () => {
  const f = numericClinic(), normal = serializeGameState(f.state);
  const raw = normal.replace(/("forecast":\{"readyAtTick":)[^,]+/, "$10.10000000000000001");
  expect(() => parseCodecJson(raw)).toThrowError(expect.objectContaining({ code: "unsafe_number" }));
  const prepared = await prepareSnapshotImport({ serializedState: raw, campaign: f.campaign, branchId: "numeric.local" });
  expect(prepared.numberRepairs).toEqual([SNAPSHOT_NUMBER_REPAIR]);
  const loaded = await loadCloudSnapshot({ snapshot: prepared.snapshot, revision: "1", expectedRevision: "1", expectedCampaignId: f.state.campaignId });
  expect(loaded.state.learningHistories).toEqual(f.state.learningHistories);
  expect(() => parseSnapshotJson('{"learningHistories":{"card":{"stability":0.10000000000000001}}}'))
    .toThrowError(expect.objectContaining({ code: "unsafe_number" }));
  expect(() => parseSnapshotJson(raw.replace('"cashCents":', '"cashCents":1,"cashCents":')))
    .toThrowError(expect.objectContaining({ code: "duplicate_key" }));
  expect(() => parseSnapshotJson('{"encounters":{"id":{"frozenCase":{"diagnosticTiming":{"phases":[{"forecast":{"startsAtTick":0.10000000000000001}}]}}}}}'))
    .toThrowError(expect.objectContaining({ code: "unsafe_number" }));
  expect(() => parseSnapshotJson('{"encounters":{"id":{"pendingResult":{"dueTick":0.10000000000000001}}}}'))
    .toThrowError(expect.objectContaining({ code: "unsafe_number" }));
});

it.each(["-0", "-0.0", "1e400", "1e-400", "9007199254740993"])("repairs only the derived forecast represented by raw token %s on local import", async token => {
  const f = numericClinic();
  const raw = serializeGameState(f.state).replace(/("forecast":\{"readyAtTick":)[^,]+/, (_match, prefix: string) => prefix + token);
  const prepared = await prepareSnapshotImport({ serializedState: raw, campaign: f.campaign, branchId: "numeric.token" });
  expect(prepared.numberRepairs).toEqual([SNAPSHOT_NUMBER_REPAIR]);
  const loaded = await loadCloudSnapshot({ snapshot: prepared.snapshot, revision: "1", expectedRevision: "1", expectedCampaignId: f.state.campaignId });
  expect(loaded.state.learningHistories).toEqual(f.state.learningHistories);
  expect(loaded.state.encounters[f.encounter.id]!.pendingResult!.dueTick).toBeLessThan(5000);
});

it("keeps completed/active phase work and reached clocks while repairing their forecasts", async () => {
  const f = numericClinic(); f.state.facilityTick = 3850;
  const first = f.plan.phases[0]!, second = f.plan.phases[1]!;
  first.status = "completed"; first.startedAtTick = 3828; first.completedAtTick = 3828 + first.durationMinutes; first.remainingMinutes = 0;
  second.status = "active"; second.startedAtTick = first.completedAtTick; second.remainingMinutes = second.durationMinutes - 1;
  first.forecast.endsAtTick = Infinity;
  f.encounter.pendingResult!.diagnosticTiming = f.plan;
  f.encounter.steps[0]!.result!.diagnosticTiming = structuredClone(f.plan);
  const encoded = await encodeCloudSnapshot(f);
  const loaded = await loadCloudSnapshot({ snapshot: encoded.snapshot, revision: "1", expectedRevision: "1", expectedCampaignId: f.state.campaignId });
  const actual = loaded.state.encounters[f.encounter.id]!.pendingResult!.diagnosticTiming!;
  expect(actual.phases.map(({ forecast: _forecast, ...work }) => work)).toEqual(f.plan.phases.map(({ forecast: _forecast, ...work }) => work));
  expect(loaded.state.learningHistories).toEqual(f.state.learningHistories);
  expect(loaded.state.cashCents).toBe(f.state.cashCents);
});

it.each([NaN, Infinity, -Infinity, Number.MAX_SAFE_INTEGER + 1])("rejects non-repairable learning value %s without replacing it with a default", async value => {
  const f = numericClinic(), history = Object.values(f.state.learningHistories)[0]!;
  history.card.stability = value;
  await expect(encodeCloudSnapshot(f)).rejects.toMatchObject({ code: "unsafe_number" });
  expect(Object.is(history.card.stability, value)).toBe(true);
});

it("refuses damaged frozen work or malformed milestones instead of treating them as repairable forecasts", async () => {
  for (const malformed of [false, true]) {
    const f = numericClinic(true);
    if (malformed) f.plan.resultReady.afterPhaseIds = ["missing.phase"];
    else f.plan.phases[0]!.durationMinutes = Number.MAX_SAFE_INTEGER + 1;
    f.encounter.pendingResult!.diagnosticTiming = f.plan;
    const original = serializeGameState(f.state);
    await expect(encodeCloudSnapshot(f)).rejects.toMatchObject({ code: "domain_validation" });
    expect(serializeGameState(f.state)).toBe(original);
  }
});

it("checks original checksum/canonical bytes before repairing an old snapshot, keeping its original source", async () => {
  const good = numericClinic(), broken = numericClinic(true), encoded = await encodeCloudSnapshot(good);
  const envelope = JSON.parse(await decompressCloudText(encoded.snapshot)); envelope.gameState = JSON.parse(serializeGameState(broken.state));
  const { logicalJsonText } = await import("./codecJson");
  const snapshot = await compressCloudText(logicalJsonText(envelope), "gzip");
  const input = { snapshot, revision: "57", expectedRevision: "57", expectedCampaignId: good.state.campaignId };
  const loaded = await loadCloudSnapshot(input);
  expect(loaded.numberRepairs).toEqual([SNAPSHOT_NUMBER_REPAIR]);
  expect(loaded.originalSource).toEqual(envelope.gameState);
  expect(loaded.state.learningHistories).toEqual(broken.state.learningHistories);
  expect(loaded.state.encounters[broken.encounter.id]!.pendingResult!.dueTick).toBeLessThan(5000);
  await expect(loadCloudSnapshot({ ...input, snapshot: { ...snapshot, uncompressedSha256: "0".repeat(64) } })).rejects.toBeInstanceOf(Error);
});

it("reports recovery codes across the actual structured-clone worker boundary without changing candidate bytes", async () => {
  const f = numericClinic(true);
  const worker = new CloudCodecWorker(() => {
    const port = { onmessage: null as ((event: MessageEvent<CloudCodecReply>) => void) | null, onerror: null, onmessageerror: null,
      postMessage: (message: CloudCodecMessage) => { void handleCloudCodecMessage(structuredClone(message)).then(reply => port.onmessage?.({ data: structuredClone(reply) } as MessageEvent<CloudCodecReply>)); },
      terminate() {} };
    queueMicrotask(() => port.onmessage?.({ data: { ready: true } } as MessageEvent<CloudCodecReply>));
    return port;
  });
  const report = vi.spyOn(problemDiagnostics, "event");
  try {
    const result = await (worker as CloudCodecExecutor).run({ kind: "snapshotEncode", input: f });
    expect(result).not.toHaveProperty("numberRepairs");
    expect(result).not.toHaveProperty("diagnosticCodes");
    expect(report).toHaveBeenCalledWith("codec-repair", SNAPSHOT_NUMBER_REPAIR);
  } finally { worker.releaseIdle(); report.mockRestore(); }
});
