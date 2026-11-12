#!/usr/bin/env node
import '../economy-audit/source-loader.mjs';
import fs from 'node:fs';
const { runFullEvidenceDifferential } = await import('../../packages/game-domain/tests/fixtures/evidence-differential.ts');
const output = process.argv.find(arg => arg.startsWith('--output='))?.slice(9);
const snapshots = process.argv.find(arg => arg.startsWith('--snapshots='))?.slice(12);
const pauseAt = Number(process.argv.find(arg => arg.startsWith('--pause-at='))?.slice(11));
const resumeFile = process.argv.find(arg => arg.startsWith('--resume-file='))?.slice(14);
const pauseSignal = new Int32Array(new SharedArrayBuffer(4));
if (snapshots) fs.mkdirSync(snapshots, { recursive: true });
const result = runFullEvidenceDifferential(message => process.stdout.write(message + '\n'), (steps, pair) => {
  if (snapshots && [100, 1000, 10000].includes(steps)) fs.writeFileSync(`${snapshots}/level5-${steps}.json`, JSON.stringify(pair.old) + '\n');
  if (resumeFile && steps === pauseAt) {
    console.log(`Paused after ${steps}; waiting for ${resumeFile}`);
    while (!fs.existsSync(resumeFile)) Atomics.wait(pauseSignal, 0, 0, 1000);
    console.log(`Resuming after ${steps}`);
  }
});
if (output) fs.writeFileSync(output, JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify(result));
