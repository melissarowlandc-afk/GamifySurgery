import '../economy-audit/source-loader.mjs';
import { parentPort, workerData } from 'node:worker_threads';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
const { EvidenceDifferential } = await import('../../packages/game-domain/tests/fixtures/evidence-differential.ts');
const { createLevelFiveStateQaContext } = await import('../../tests/fixtures/level-five-state.ts');
const { freezeEvidence } = await import('../../packages/game-domain/src/game-evidence-json.ts');
const pair = Object.create(EvidenceDifferential.prototype);
pair.old = freezeEvidence(JSON.parse(workerData.startCheckpoint));
pair.current = freezeEvidence(JSON.parse(workerData.startCheckpoint));
pair.steps = workerData.start;
const context = createLevelFiveStateQaContext(), started = performance.now();
for (const command of workerData.commands) {
  pair.apply(command, context);
  if (pair.steps % 100 === 0) parentPort.postMessage({ kind: 'progress', step: pair.steps, range: workerData.range });
}
pair.verify();
const endSha256 = createHash('sha256').update(JSON.stringify(pair.current)).digest('hex');
assert.equal(endSha256, workerData.expectedEndSha256, 'The next interval starts with the exact bytes proven by this interval.');
parentPort.postMessage({ kind: 'result', range: workerData.range, start: workerData.start, end: pair.steps,
  commands: workerData.commands.length, startSha256: createHash('sha256').update(workerData.startCheckpoint).digest('hex'),
  endSha256, elapsedMs: performance.now() - started });
