#!/usr/bin/env node
// Run the existing generators without changing their source or evidence.
// M9 writes a progress file even without --write; its lower companion always
// writes artifacts. Intercept those exact paths, compare bytes and keep the
// progress state in memory. Every other attempted write is an error.
import '../economy-audit/source-loader.mjs';
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const output = process.argv.find(arg => arg.startsWith('--output='))?.slice(9);
if (process.argv.includes('--write')) throw new Error('This runner is check-only.');
const lowerOnly = process.argv.includes('--lower-only');
const integration = !lowerOnly && !process.argv.includes('--economy-only');
const economy = !lowerOnly && !process.argv.includes('--integration-only');
const originalArgv = process.argv;
const seedArgument = originalArgv.find(argument => argument.startsWith('--seed='));
const originalRead = fs.readFileSync, originalWrite = fs.writeFileSync;
const progressPath = path.join(root, '.local-dev/level5-m9/progress-state.json');
const checkpointPath = path.join(root, 'tests/fixtures/level-five-integration-checkpoints-20261012.json');
const runPath = path.join(root, 'tools/qa/level-five-integration-results-20261012.json');
const snapshots = {}, checkedWrites = [];
let progressBytes, journey, result, economySummary;
const start = performance.now();
const filename = value => path.resolve(value instanceof URL ? fileURLToPath(value) : String(value));
fs.readFileSync = function(file, options) {
  if (filename(file) === progressPath && progressBytes) return typeof options === 'string' || options?.encoding ? progressBytes.toString('utf8') : progressBytes;
  return originalRead.call(this, file, options);
};
fs.writeFileSync = function(file, data) {
  const target = filename(file), bytes = Buffer.from(data);
  if (target === progressPath) { progressBytes = bytes; return; }
  if (target !== checkpointPath && target !== runPath) throw new Error(`Unexpected generator write: ${path.relative(root, target)}`);
  assert.deepEqual(bytes, originalRead(target), `Generator bytes differ: ${path.relative(root, target)}`);
  checkedWrites.push({ path: path.relative(root, target).replaceAll('\\', '/'), sha256: createHash('sha256').update(bytes).digest('hex') });
};
try {
  // Wrapper selection flags must not change the original M8 generator's
  // scenario selection (its own --economy-only would omit all pacing runs).
  process.argv = [...process.argv.slice(0, 2), ...(seedArgument ? [seedArgument] : [])];
  if (integration) {
    const { LevelFiveIntegrationJourney } = await import('../../tests/fixtures/level-five-integration.ts');
    const apply = LevelFiveIntegrationJourney.prototype.apply, checkpoint = LevelFiveIntegrationJourney.prototype.checkpoint;
    LevelFiveIntegrationJourney.prototype.apply = function(command) { apply.call(this, command); journey = this; };
    LevelFiveIntegrationJourney.prototype.checkpoint = function(name) { checkpoint.call(this, name); snapshots[name] = this.checkpoints[name]; };
    try { await import('../qa/level-five-integration-run.mjs'); }
    finally { LevelFiveIntegrationJourney.prototype.apply = apply; LevelFiveIntegrationJourney.prototype.checkpoint = checkpoint; }
    assert.equal(journey.commands, 26_710); assert.equal(journey.state.cashCents, 5_818_501);
    const expected = JSON.parse(originalRead(checkpointPath, 'utf8'));
    for (const [name, state] of Object.entries(snapshots)) assert.equal(JSON.stringify(state), JSON.stringify(expected[name]), `Checkpoint ${name}`);
    await import('../qa/level-five-integration-lower.mjs');
  }
  if (lowerOnly) await import('../qa/level-five-integration-lower.mjs');
  if (economy) {
    const originalLog = console.log;
    console.log = (...args) => {
      if (typeof args[0] === 'string' && args[0].startsWith('{')) {
        try { const summary = JSON.parse(args[0]); if (typeof summary.economyRuns === 'number' && typeof summary.pacingRuns === 'number') economySummary = summary; } catch { /* ordinary progress text */ }
      }
      originalLog.apply(console, args);
    };
    try { await import('../economy-audit/level-five-run.mjs'); }
    finally { console.log = originalLog; }
    assert(economySummary && economySummary.resultsWritten === false, 'Original generator must finish its complete read-only selection.');
  }
  result = { integration: integration ? { commands: journey.commands, closingCashCents: journey.state.cashCents,
    byteIdenticalCheckpoints: Object.keys(snapshots), checkedWrites } : null,
    lowerOnly, checkedWrites,
    economy: economy ? { selection: seedArgument?.slice(7) ?? 'all', ...economySummary } : null,
    elapsedMs: performance.now() - start, evidenceFilesRewritten: 0 };
} finally { fs.readFileSync = originalRead; fs.writeFileSync = originalWrite; process.argv = originalArgv; }
if (output) fs.writeFileSync(output, JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify(result));
