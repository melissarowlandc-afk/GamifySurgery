import { expect, it } from "vitest";
import { applyGameEvidenceCommand, createGameEvidenceCheckpoint, gameEvidenceDelta, PROTOTYPE_DOMAIN_CONTEXT, serializeGameState } from "@gamify-surgery/game-domain";
import { syncHarness } from "./syncTestSupport";
import { snapshotCopy } from "./snapshotCodec";
import { numericClinic } from "./unsafeNumberTestSupport";
import { parseCodecJson, sha256Utf8 } from "./codecJson";
import { cloudCodec } from "./codecWorker";
import { prepareJournal, prepareJournalInWorker } from "./journalCodec";
import { cloudCampaignStorageKey } from "../accountStorageKey";
import { MemoryCloudEntryStore } from "./entryStorage";
import { openAutomaticCloudCampaign } from "./automaticResolution";
import { CloudGameSession } from "./gameSession";
import { repairSnapshotNumbers } from "./snapshotNumberRecovery";
import { ControllableOperationalPort } from "./operationalSessionTestSupport";
import type { JournalRow, JournalSeed } from "../localJournal";

it("automatically recovers a blocked Level-2 campaign and every one of its 266 committed worker-tail commands", async () => {
  const clinic = numericClinic(true), good = repairSnapshotNumbers(clinic.state).state;
  const f = await syncHarness({ campaignId: clinic.state.campaignId });
  f.server.setAccess(f.scope.accountId, { snapshotSaves: true });
  const confirmed = await snapshotCopy(good, clinic.campaign, "57", f.clock.wall,
    { ...clinic.lineage, sequence: 0 });
  f.server.seed(f.scope.accountId, confirmed);
  expect(await f.coordinator.open()).toBe(true); expect(await f.coordinator.startWriter()).toBe(true); expect(f.coordinator.resume()).toBe(true);
  const journal = f.cache.journal!, key = cloudCampaignStorageKey(f.scope), owner = "synthetic.previous.document";
  let checkpoint = createGameEvidenceCheckpoint(clinic.state);
  const seed: JournalSeed = { checkpoint, campaign: clinic.campaign, source: null, confirmed,
    snapshotPolicy: { lineage: { ...clinic.lineage, sequence: 0, parents: [confirmed.snapshot.uncompressedSha256] } }, usageQuestions: [] };
  const head = await journal.bind(key, owner, await journal.head(key), seed, await sha256Utf8(JSON.stringify(seed)));
  const rows: JournalRow[] = [];
  let latest = clinic.state;
  for (let index = 0; index < 266; index++) {
    const before = checkpoint, applied = applyGameEvidenceCommand(checkpoint,
      { type: "SET_SIMULATION_SPEED", speed: index % 2 ? 4 : 2, operationId: `kept.numeric.${index}` });
    checkpoint = applied.checkpoint; latest = applied.state;
    rows.push({ version: head.highWater + index + 1, delta: gameEvidenceDelta(before, checkpoint), campaign: clinic.campaign, usageQuestions: [] });
  }
  await journal.append(key, owner, head.highWater, rows);
  const original = await journal.read(key);
  // The released encoder's strict parse fails on exactly this committed state.
  let oldFailure: unknown;
  try { parseCodecJson(serializeGameState(latest)); } catch (error) { oldFailure = error; }
  expect(oldFailure).toMatchObject({ code: "unsafe_number" });
  f.coordinator.reportLocalFailure(oldFailure);
  expect(f.coordinator.view).toMatchObject({ phase: "blocked", failure: "corrupt", canExecute: false, localDurable: true });
  const prepared = await prepareJournal(journal, key, cloudCodec, { local: true });
  expect(await journal.read(key)).toEqual(original); // Reading/repair never rewrites unchecked source rows.
  expect(prepared!.through).toBe(head.highWater + 266);
  expect(prepared!.state).toEqual(repairSnapshotNumbers(latest).state);
  expect(prepared!.seed!.snapshotPolicy!.lineage.sequence + prepared!.seed!.checkpoint.snapshot.head.sequence).toBe(266);
  const corrupt = structuredClone(original!); corrupt.rows[0]!.sha256 = "0".repeat(64);
  await expect(prepareJournalInWorker({ data: corrupt, local: true })).rejects.toMatchObject({ reason: "checksum" });
  f.coordinator.dispose();
  const runtime = { ...f.scope, region: "test", cache: f.cache, entryStore: new MemoryCloudEntryStore(), transport: f.server.transport(f.scope.accountId) };
  const coordinator = await openAutomaticCloudCampaign({ runtime, campaignId: f.scope.campaignId, clock: f.clock });
  const port = new ControllableOperationalPort();
  const session = await CloudGameSession.create(coordinator, undefined, undefined, { operational: { createPort: () => port } });
  try {
    expect(session.canExecute).toBe(true);
    expect(session.state).toEqual(repairSnapshotNumbers(latest).state);
    expect(session.state.learningHistories).toEqual(latest.learningHistories);
    expect(session.state.campaignId).toBe(latest.campaignId);
    expect(await session.executeAsync({ type: "SET_SIMULATION_SPEED", speed: 2, operationId: "recovered.first.tap" }, PROTOTYPE_DOMAIN_CONTEXT)).not.toBeNull();
    expect(await session.checkpointNow("purchase")).toBe(true);
    const account = await runtime.transport.load(f.scope.campaignId);
    const loaded = await cloudCodec.run({ kind: "hydrate", input: { ...account, expectedRevision: account.revision,
      expectedCampaignId: f.scope.campaignId, expectedBaselineId: account.baselineId } });
    expect(loaded.state).toEqual(session.state);
    expect(loaded.state.learningHistories).toEqual(latest.learningHistories);
    expect(await runtime.transport.list()).toHaveLength(1);
    expect(session.canExecute).toBe(true);
  } finally { session.dispose(); }
});

it.each([NaN, Infinity, -Infinity, -0, Number.MAX_SAFE_INTEGER + 1])("checkpoints and uploads a repaired forecast %s once, then reopens exactly", async value => {
  const clinic = numericClinic(), f = await syncHarness({ campaignId: clinic.state.campaignId });
  f.server.setAccess(f.scope.accountId, { snapshotSaves: true });
  const confirmed = await snapshotCopy(clinic.state, clinic.campaign, "1", f.clock.wall, clinic.lineage);
  f.server.seed(f.scope.accountId, confirmed);
  await f.coordinator.open(); await f.coordinator.startWriter(); f.coordinator.resume();
  clinic.plan.phases[0]!.forecast.endsAtTick = value;
  clinic.encounter.pendingResult!.diagnosticTiming = clinic.plan;
  const candidate = await cloudCodec.run({ kind: "snapshotEncode", input: { state: clinic.state, campaign: clinic.campaign,
    lineage: { ...clinic.lineage, sequence: 267, parents: [confirmed.snapshot.uncompressedSha256] } } });
  try {
    expect(await f.coordinator.stage(candidate, "purchase")).toBe(true);
    expect(await f.coordinator.checkpoint("purchase")).toBe(true);
    const account = await f.server.transport(f.scope.accountId).load(f.scope.campaignId);
    const reopened = await cloudCodec.run({ kind: "hydrate", input: { ...account, expectedRevision: account.revision,
      expectedCampaignId: account.campaignId, expectedBaselineId: account.baselineId } });
    expect(reopened.state).toEqual(repairSnapshotNumbers(clinic.state).state);
    expect(reopened.state.learningHistories).toEqual(clinic.state.learningHistories);
    expect(f.server.operationCount(f.scope.accountId)).toBe(1);
    expect(f.coordinator.view).toMatchObject({ canExecute: true, failure: null, pending: false });
  } finally { f.coordinator.dispose(); }
});
