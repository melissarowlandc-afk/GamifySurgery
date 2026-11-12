#!/usr/bin/env node
import '../economy-audit/source-loader.mjs';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
const current = await import('../../packages/game-domain/src/index.ts');
const legacy = await import('../../packages/game-domain/tests/fixtures/game-evidence-legacy.ts');
const { encodeCloudEvidenceCheckpoint, loadCloudEvidenceCheckpoint } = await import('../../apps/player/src/session/cloud/codecEvidence.ts');
const fixtures = JSON.parse(fs.readFileSync(new URL('../../tests/fixtures/level-five-integration-checkpoints-20261012.json', import.meta.url), 'utf8'));
const sources = [
  ['level1', current.serializeGameState(Object.assign(current.createInitialGameState(undefined, {
    campaignId: 'campaign.codec.differential', campaignSeed: 'evidence.codec', createdAtRealMs: 0 }), { facilityLevel: 1 }))],
  ...['integration-running', 'integration-finish'].map(name => [name, JSON.stringify(fixtures[name])]),
  ['legacy-level4', fs.readFileSync(new URL('../../tests/fixtures/level-four-legacy-pre-m3.json', import.meta.url), 'utf8')],
];
const results = [];
for (const [name, sourceText] of sources) {
  const state = current.deserializeGameState(sourceText), sourceState = JSON.parse(sourceText);
  let oldCheckpoint = legacy.createGameEvidenceCheckpoint(state, { sourceState });
  let newCheckpoint = current.createGameEvidenceCheckpoint(state, { sourceState });
  for (const command of [{ type: 'SET_PAUSED', paused: false, operationId: 'codec.play' },
    { type: 'SET_SIMULATION_SPEED', speed: 2, operationId: 'codec.speed' },
    { type: 'ADVANCE_TICK', operationId: 'codec.tick', advancedAtRealMs: state.createdAtRealMs + (state.facilityTick + 1) * 60_000 }]) {
    oldCheckpoint = legacy.applyGameEvidenceCommand(oldCheckpoint, command).checkpoint;
    newCheckpoint = current.applyGameEvidenceCommand(newCheckpoint, command).checkpoint;
  }
  const campaign = { campaignId: state.campaignId, name: 'Evidence differential', status: 'resumable',
    createdAtRealMs: state.createdAtRealMs, updatedAtRealMs: state.createdAtRealMs,
    tutorial: { guidance: null, introDismissed: true, dailyRoutineTipAcknowledgments: [], dailyRoutinePause: null } };
  const source = { sha256: createHash('sha256').update(sourceText).digest('hex'),
    utf8Bytes: Buffer.byteLength(sourceText), schemaVersion: sourceState.schemaVersion };
  for (const encoding of ['gzip', 'deflate']) {
    const input = { campaign, source, operationId: 'codec.evidence.differential', expectedRevision: '0', encoding };
    const oldEncoded = await encodeCloudEvidenceCheckpoint({ ...input, checkpoint: oldCheckpoint });
    const newEncoded = await encodeCloudEvidenceCheckpoint({ ...input, checkpoint: newCheckpoint });
    assert.deepStrictEqual(newEncoded, oldEncoded, `${name}/${encoding} encoded bytes and hashes`);
    const decoded = await loadCloudEvidenceCheckpoint({ snapshot: oldEncoded.snapshot, evidence: oldEncoded.packedEvidence,
      revision: '1', expectedRevision: '1', expectedCampaignId: state.campaignId, expectedBaselineId: oldEncoded.envelope.baselineId });
    assert.deepStrictEqual(decoded.state, legacy.importGameEvidence(oldCheckpoint.snapshot, oldCheckpoint.evidence));
    results.push({ name, encoding, transportSha256: newEncoded.transport.sha256,
      evidenceManifestSha256: newEncoded.envelope.evidenceManifestSha256, records: newCheckpoint.evidence.records.length });
  }
}
const result = { cases: results.length, byteIdentical: true, oldEncodedSavesDecoded: true, results };
const output = process.argv.find(arg => arg.startsWith('--output='))?.slice(9);
if (output) fs.writeFileSync(output, JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify(result));
