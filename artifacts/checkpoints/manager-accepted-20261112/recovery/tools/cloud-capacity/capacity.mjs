import '../economy-audit/source-loader.mjs';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { performance } from 'node:perf_hooks';
// Dynamic imports run AFTER the existing source loader registers extension/alias hooks.
const { applyGameEvidenceCommand, serializeGameState } = await import('../../packages/game-domain/src/index.ts');
const { prepareCloudEvidenceImport, encodeCloudEvidenceCheckpoint, loadCloudEvidenceCheckpoint } = await import('../../apps/player/src/session/cloud/codecEvidence.ts');
const { compressCloudEvidencePages, decompressCloudEvidencePages } = await import('../../apps/player/src/session/cloud/codecEvidencePages.ts');
const { cloudWireBlob } = await import('../../apps/player/src/session/cloud/supabaseTransport.ts');
const { logicalJsonText } = await import('../../apps/player/src/session/cloud/codecJson.ts');
const { codecTestCampaign } = await import('../../apps/player/src/session/cloud/codecTestSupport.ts');
const { LevelFiveIntegrationJourney } = await import('../../tests/fixtures/level-five-integration.ts');
const { createLevelFiveStateQaContext } = await import('../../tests/fixtures/level-five-state.ts');

export const LIMITS = Object.freeze({ accounts: 30, campaignsPerAccount: 2, database: 500_000_000,
  working: 400_000_000, warning: 300_000_000, sharedReserve: 50_000_000, monthlyEgress: 5_000_000_000,
  accountSnapshotsAndAuxiliary: 8_000_000, accountEvidence: 2_000_000, campaignEvidence: 1_000_000 });
export const PLAY = Object.freeze({ daysPerMonth: 30, sessionsPerDay: 2, sessionMinutes: 30,
  checkpointsPerSession: 36, receiptRetentionDays: 8, renewSeconds: 15, metadataSeconds: 60,
  smallResponseBytes: 2_048, backupRunsPerMonth: 5, otherBackupJsonBytes: 50_000_000 });
const root = fileURLToPath(new URL('../../', import.meta.url));
const hash = value => createHash('sha256').update(value).digest('hex');
const bytes = value => Buffer.byteLength(JSON.stringify(value));
export const storageCost = n => n + Math.ceil(n / 8) + 2_048;
const rowText = row => logicalJsonText(JSON.parse(JSON.stringify(row)));

/** Mirrors the APPLIED SQL's reservation rules, not pg_total_relation_size. */
export function storageProjection({ snapshotBytes, priorSnapshotBytes = snapshotBytes, headerBytes, pageBytes, campaignIdBytes }, play = PLAY) {
  const currentAndPrior = storageCost(snapshotBytes) + storageCost(priorSnapshotBytes);
  const evidencePayload = headerBytes + pageBytes.reduce((a, b) => a + b, 0);
  const evidenceReserved = storageCost(headerBytes) + pageBytes.reduce((a, b) => a + storageCost(b), 0);
  // 1 KiB receipt estimate, 64-byte operation ID; maximum shape uses SQL's 2 KiB receipt and two 256-byte IDs.
  const operationCost = 2 * (64 + campaignIdBytes) + 1_024 + 1_024;
  const savesPerCampaign = Math.ceil(play.checkpointsPerSession * play.sessionsPerDay * play.receiptRetentionDays / LIMITS.campaignsPerAccount);
  const operationsReserved = (savesPerCampaign + 1) * operationCost; // lifetime import + rolling saves
  const auxiliaryPerCampaign = 4_096 + operationsReserved;
  const perAccount = { snapshots: currentAndPrior * 2, evidence: evidenceReserved * 2,
    auxiliary: 8_192 + auxiliaryPerCampaign * 2 };
  const perAccountReserved = perAccount.snapshots + perAccount.evidence + perAccount.auxiliary;
  const steadyWithSharedReserve = perAccountReserved * LIMITS.accounts + LIMITS.sharedReserve;
  const largestWriteReservation = storageCost(snapshotBytes) + Math.max(0, ...pageBytes.map(storageCost)) + operationCost + 4_096;
  const deadSnapshotBytesPerDay = storageCost(snapshotBytes) * play.checkpointsPerSession * play.sessionsPerDay * LIMITS.accounts;
  // Receipts also become dead tuples when purged. Do not credit either until cleanup is verified.
  const deadOperationBytesPerDay = operationCost * play.checkpointsPerSession * play.sessionsPerDay * LIMITS.accounts;
  const peak = days => steadyWithSharedReserve + (deadSnapshotBytesPerDay + deadOperationBytesPerDay) * days + largestWriteReservation * LIMITS.accounts * 2 + 1_048_576;
  return { payloadPerCampaign: snapshotBytes + priorSnapshotBytes + evidencePayload, evidencePayload, evidenceReserved,
    currentAndPriorReserved: currentAndPrior, operationsReserved, operationCost, maximumOperationCost: 4_096,
    retainedSavesPerCampaignEstimate: savesPerCampaign, perAccount, perAccountReserved, beta30Accounts60Campaigns: perAccountReserved * LIMITS.accounts,
    steadyWithSharedReserve, deadSnapshotBytesPerDay, deadOperationBytesPerDay,
    peakWithOneDayUnverifiedCleanup: peak(1), peakWithEightDaysUnverifiedCleanup: peak(8),
    campaignEvidenceFits: evidenceReserved <= LIMITS.campaignEvidence,
    accountFits: perAccount.snapshots + perAccount.auxiliary <= LIMITS.accountSnapshotsAndAuxiliary && perAccount.evidence <= LIMITS.accountEvidence,
    workingBudgetFitsSteady: steadyWithSharedReserve < LIMITS.working,
    workingBudgetFitsOneDayPeak: peak(1) < LIMITS.working };
}

/** Upload bodies are INGRESS. Only load responses, small RPC replies and private exports are EGRESS. */
export function egressProjection(loadResponseBytes, backupExportBytes, checkpointUploadBytes, play = PLAY) {
  const sessions = LIMITS.accounts * play.daysPerMonth * play.sessionsPerDay;
  const renewals = Math.ceil(play.sessionMinutes * 60 / play.renewSeconds);
  const metadata = Math.ceil(play.sessionMinutes * 60 / play.metadataSeconds);
  const smallRepliesPerSession = play.checkpointsPerSession + renewals + metadata + 4; // admission/acquire/release/list
  const replies = sessions * smallRepliesPerSession * play.smallResponseBytes;
  const backups = play.backupRunsPerMonth * backupExportBytes;
  return [1, 2, 3].map(loadsPerSession => {
    const loads = sessions * loadsPerSession * loadResponseBytes;
    const total = loads + replies + backups;
    return { loadsPerSession, fullDownloadsPerAccountPerDay: loadsPerSession * play.sessionsPerDay,
      loadEgressBytes: loads, smallRpcEgressBytes: replies, backupEgressBytes: backups, totalEgressBytes: total,
      allowanceFraction: total / LIMITS.monthlyEgress, fits: total <= LIMITS.monthlyEgress,
      checkpointSnapshotOnlyIngressBytes: sessions * play.checkpointsPerSession * checkpointUploadBytes };
  });
}

async function measure(prepared, pages, priorSnapshotBytes = prepared.snapshot.compressedBytes) {
  const header = prepared.packedEvidence.header;
  // These are the actual protocol-3 wire blob/page shapes, including base64 and compressed hashes.
  const wireSnapshot = await cloudWireBlob(prepared.snapshot), wireHeader = await cloudWireBlob(header);
  const wirePages = await Promise.all(pages.map(async p => ({ ...p, content: await cloudWireBlob(p.content) })));
  const load = { revision: '2', writerGeneration: '2', acceptedAt: '2026-10-17T00:00:00.000Z', snapshot: wireSnapshot,
    evidence: { header: wireHeader, pages: wirePages }, quota: {}, serverTime: '2026-10-17T00:00:00.000Z' };
  const loadResponseBytes = bytes(load) + 2_048; // quota JSON + HTTP/header allowance, no assumed HTTP gzip saving
  const storage = storageProjection({ snapshotBytes: prepared.snapshot.compressedBytes, priorSnapshotBytes,
    headerBytes: header.compressedBytes, pageBytes: pages.map(p => p.content.compressedBytes), campaignIdBytes: Buffer.byteLength(prepared.envelope.campaign.campaignId) });
  const decodedLoadBytes = prepared.snapshot.uncompressedBytes + header.uncompressedBytes + pages.reduce((n, p) => n + p.content.uncompressedBytes, 0);
  const maxEvidencePageBytes = Math.max(0, ...pages.map(p => p.content.uncompressedBytes));
  const checkpointUploadBytes = bytes({ p_request_text: JSON.stringify({ protocolVersion: 3, cloudFormatVersion: 2,
    evidenceContractVersion: 1, action: 'save', operationId: 'capacity.synthetic.checkpoint', issuedAt: '2026-10-17T00:00:00.000Z',
    campaign: { campaignId: prepared.envelope.campaign.campaignId, name: prepared.envelope.campaign.name, status: 'resumable' },
    campaignId: prepared.envelope.campaign.campaignId, expectedRevision: '1', writerGeneration: '1', writerToken: '0'.repeat(64),
    snapshot: wireSnapshot, evidence: { headerSha256: header.uncompressedSha256, fromRecord: 0, toRecord: 0, pages: [] }, usageReceipts: [] }), p_request_sha256: '0'.repeat(64) });
  // Export uses JSON bytea hex, so binary payload doubles. Count private metadata/receipts without mistaking SQL reservations for stored blobs.
  const estimatedCampaignExportBytes = storage.payloadPerCampaign * 2 + (pages.length + 4) * 1_024 + storage.operationsReserved;
  const backupExportBytes = estimatedCampaignExportBytes * 60 + PLAY.otherBackupJsonBytes;
  return { decodedGameBytes: prepared.sizes.decodedGameBytes, snapshotBytes: prepared.snapshot.compressedBytes,
    priorSnapshotBytes, headerBytes: header.compressedBytes, pageBytes: pages.reduce((n, p) => n + p.content.compressedBytes, 0),
    pageCount: pages.length, evidenceRecords: prepared.checkpoint.evidence.records.length, decodedLoadBytes, maxEvidencePageBytes,
    loadResponseBytes, checkpointSnapshotOnlyUploadBytes: checkpointUploadBytes, backupExportBytesEstimate: backupExportBytes, storage,
    processingFits: decodedLoadBytes <= 6_000_000 && prepared.sizes.decodedGameBytes <= 3_000_000 && prepared.snapshot.uncompressedBytes <= 3_000_000,
    egress: egressProjection(loadResponseBytes, backupExportBytes, checkpointUploadBytes) };
}

export async function runCapacity({ days = 1, minutesPerDay = 600, sealEveryMinutes = 60, maxWallSeconds = 180, progress = () => {} } = {}) {
  for (const [name, value] of Object.entries({ days, minutesPerDay, sealEveryMinutes, maxWallSeconds })) {
    if (!Number.isSafeInteger(value) || value < (name === 'days' ? 0 : 1) || value > (name === 'days' ? 30 : 86_400)) throw new Error(`Invalid ${name}`);
  }
  const fixtures = [], inputs = {};
  let growthSource;
  for (const file of ['level-four-legacy-pre-m3.json', 'level-five-economy-checkpoint-20261012.json', 'level-five-integration-checkpoints-20261012.json']) {
    const data = await readFile(resolve(root, 'tests/fixtures', file));
    inputs[`tests/fixtures/${file}`] = { sha256: hash(data), bytes: data.length };
    const value = JSON.parse(data.toString('utf8'));
    for (const [name, state] of value.schemaVersion ? [[file, value]] : Object.entries(value)) {
      const source = JSON.stringify(state);
      const prepared = await prepareCloudEvidenceImport({ serializedState: source, campaign: codecTestCampaign(source), operationId: `capacity.${name}` });
      const pages = await compressCloudEvidencePages(prepared.checkpoint.evidence.records.map(rowText));
      assert.deepEqual(await decompressCloudEvidencePages(pages), prepared.checkpoint.evidence.records);
      fixtures.push({ name, file, ...(await measure(prepared, pages)) });
      if (name === 'integration-lower-repeat') growthSource = source;
      progress(`Measured ${name}`);
    }
  }
  const growth = { requestedDays: days, minutesPerDay, sealEveryMinutes, completedMinutes: 0, completedDays: 0, checkpoints: [], stoppedReason: null };
  if (days) {
    const context = createLevelFiveStateQaContext();
    const initial = await prepareCloudEvidenceImport({ serializedState: growthSource, campaign: codecTestCampaign(growthSource), operationId: 'capacity.growth' }, context);
    const source = { sha256: initial.sourceRecovery.sha256, utf8Bytes: initial.sourceRecovery.utf8Bytes, schemaVersion: initial.sourceRecovery.schemaVersion };
    let checkpoint = initial.checkpoint, encoded = initial, previousSnapshotBytes = initial.snapshot.compressedBytes;
    const pages = [...await compressCloudEvidencePages(checkpoint.evidence.records.map(rowText))];
    let sealedRows = checkpoint.evidence.records.length;
    const journey = new LevelFiveIntegrationJourney(context, JSON.parse(serializeGameState((await loadCloudEvidenceCheckpoint({ snapshot: initial.snapshot,
      evidence: initial.packedEvidence, revision: '1', expectedRevision: '1', expectedCampaignId: initial.envelope.campaign.campaignId, expectedBaselineId: initial.envelope.baselineId })).state)));
    journey.accuracy = 100;
    // Reuse the journey's chart selection, day boundaries and review clock, routing ALL selected commands through the real evidence reducer.
    journey.apply = command => {
      const operationId = `capacity.journey.${journey.sequence++}`;
      const result = applyGameEvidenceCommand(checkpoint, { ...command, operationId }, context);
      assert.equal(result.state.operationReceipts[operationId]?.status, 'applied');
      checkpoint = result.checkpoint; journey.state = result.state; journey.commands++;
    };
    journey.apply({ type: 'SET_PAUSED', paused: false });
    const started = performance.now();
    const sample = async () => {
      const added = checkpoint.evidence.records.slice(sealedRows).map(rowText);
      pages.push(...await compressCloudEvidencePages(added, sealedRows)); sealedRows = checkpoint.evidence.records.length;
      previousSnapshotBytes = encoded.snapshot.compressedBytes;
      encoded = await encodeCloudEvidenceCheckpoint({ checkpoint, campaign: initial.envelope.campaign, source,
        operationId: `capacity.growth.${growth.completedMinutes}`, expectedRevision: '1' });
      const m = await measure(encoded, pages, previousSnapshotBytes);
      growth.checkpoints.push({ facilityMinutes: growth.completedMinutes, facilityDays: growth.completedMinutes / minutesPerDay, commands: journey.commands, ...m });
      progress(`Growth ${growth.completedMinutes}/${days * minutesPerDay} facility minutes`);
    };
    for (let minute = 1; minute <= days * minutesPerDay; minute++) {
      journey.pump(); journey.tick(); growth.completedMinutes = minute;
      // Preserve every accepted partial page, even when that increases reservation overhead.
      if (minute % sealEveryMinutes === 0 || minute === days * minutesPerDay) {
        try { await sample(); } catch (e) {
          growth.stoppedReason = `Codec processing bound: ${e.code ?? e.name}: ${e.message}`;
          growth.failureDiagnostics = { evidenceRecords: checkpoint.evidence.records.length,
            snapshotJsonBytes: bytes(checkpoint.snapshot), archiveJsonBytes: bytes(checkpoint.evidence),
            stackFrames: String(e.stack).split('\n').slice(1, 5).map(line => line.trim().replaceAll(root, '<repo>/')) };
          break;
        }
      }
      if (performance.now() - started > maxWallSeconds * 1_000) { growth.stoppedReason = 'Wall-time safety bound; requested days not fully simulated'; break; }
    }
    growth.completedDays = growth.completedMinutes / minutesPerDay;
    growth.elapsedSeconds = (performance.now() - started) / 1_000;
    // All rows, including the tail at an early wall-time stop, remain in memory and are checked; none is truncated to fit.
    if (sealedRows < checkpoint.evidence.records.length && !growth.stoppedReason?.startsWith('Codec')) {
      try { await sample(); } catch (e) { growth.stoppedReason = `Codec processing bound at final tail: ${e.code ?? e.name}: ${e.message}`; }
    }
    if (!growth.stoppedReason?.startsWith('Codec')) assert.deepEqual(await decompressCloudEvidencePages(pages), checkpoint.evidence.records);
    assert.deepEqual(checkpoint.evidence.records.slice(0, initial.checkpoint.evidence.records.length), initial.checkpoint.evidence.records);
    growth.commands = journey.commands;
    growth.initialSourcePreserved = true;
  }
  for (const file of ['apps/player/src/session/cloud/codecEvidence.ts', 'apps/player/src/session/cloud/codecEvidencePages.ts',
    'apps/player/src/session/cloud/supabaseTransport.ts', 'supabase/migrations/20261018000100_beta2_cloud_saves.sql',
    'packages/game-domain/src/game-evidence.ts', 'tests/fixtures/level-five-integration.ts']) inputs[file] = { sha256: hash(await readFile(resolve(root, file))) };
  return { format: 'beta2.capacity.v1', generatedAt: new Date().toISOString(), node: process.version, limits: LIMITS, playAssumptions: PLAY,
    scope: 'Synthetic local codec/reducer only. No network, database or owner saves. Physical bytes and provider egress remain manager measurements.',
    assumptions: ['Decimal MB/GB.', 'Both retained snapshots estimated at current size for imports; growth retains the previous measured checkpoint size.',
      'Per-account session demand is split across two campaigns; not doubled for each campaign.', '8-day operation retention; purge must actually run.',
      '50 MB shared DB reserve, further 50 MB working headroom at the original 350 MB target, and 100 MB above working ceiling to provider cap.',
      '5 weekly exports in a long billing month; 50 MB of other-table export JSON is an explicit unmeasured allowance.',
      'Full selected-campaign reload each load; the current adapter returns the entire sealed prefix. No immutable download-cache saving assumed.',
      '2 KiB per small RPC response including headers; no assumed HTTP compression or provider billing adjustment.',
      'Ingress totals are snapshot-only checkpoint bodies; evidence tails/imports add ingress and never increase egress.',
      'Evidence batching is configurable: default 60 facility minutes approximates ordinary 60-second checkpoints at 1x (one facility minute/second); this does not change production cadence.',
      'Simulation stops at wall/codec bounds and reports partial results; it never deletes history to meet a limit.'], inputs, fixtures, growth };
}

function options(args) {
  const result = {};
  const names = { '--days': 'days', '--minutes-per-day': 'minutesPerDay', '--seal-every-minutes': 'sealEveryMinutes', '--max-wall-seconds': 'maxWallSeconds', '--out': 'out' };
  while (args.length) { const key = names[args.shift()], value = args.shift(); if (!key || value === undefined || result[key] !== undefined) throw new Error('Use --days N --minutes-per-day N --seal-every-minutes N --max-wall-seconds N [--out path]'); result[key] = key === 'out' ? value : Number(value); }
  return result;
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  // A capacity run cannot accidentally become a hosted load test.
  globalThis.fetch = async () => { throw new Error('Network is prohibited in the capacity harness'); };
  const { out, ...opts } = options(process.argv.slice(2));
  const result = await runCapacity({ ...opts, progress: message => process.stderr.write(message + '\n') });
  const text = JSON.stringify(result, null, 2) + '\n';
  if (out) await writeFile(resolve(out), text, { encoding: 'utf8', flag: 'w' }); else process.stdout.write(text);
}
