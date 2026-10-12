// Retain the actual third-result state written by the journey's progress hook.
// Run after level-five-integration-run.mjs --write; no replay or seeded report.
import '../economy-audit/source-loader.mjs';
import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const { createLevelFiveStateQaContext } = await import('../../tests/fixtures/level-five-state.ts');
const { gameReducer, serializeGameState } = await import('../../packages/game-domain/src/index.ts');
const runPath = new URL('./level-five-integration-results-20261012.json', import.meta.url);
const checkpointPath = new URL('../../tests/fixtures/level-five-integration-checkpoints-20261012.json', import.meta.url);
const state = JSON.parse(fs.readFileSync(new URL('../../.local-dev/level5-m9/progress-state.json', import.meta.url), 'utf8'));
const run = JSON.parse(fs.readFileSync(runPath, 'utf8'));
assert.deepEqual(state.levelFive.inspection.lastReport, run.reports[2]);
assert.deepEqual(state.levelFive.inspection.bestCompletedReport, run.reports[1]);
assert.deepEqual(state.levelFive.progress.gameFinished.firstCompletedReport, run.reports[0]);
assert.equal(state.cashCents, run.closingCashCents);
const name = 'integration-lower-repeat';
const paused = gameReducer(state, { type: 'SET_PAUSED', paused: true, operationId: `m9.snapshot.${name}` }, createLevelFiveStateQaContext());
const checkpoints = JSON.parse(fs.readFileSync(checkpointPath, 'utf8'));
checkpoints[name] = JSON.parse(serializeGameState(paused));
run.snapshotPhases[name] = { tick: paused.facilityTick, xp: paused.clinicalXp, phase: paused.levelFive.inspection.status };
run.artifactInputs = { 'tools/qa/level-five-integration-lower.mjs': crypto.createHash('sha256').update(fs.readFileSync(fileURL())).digest('hex') };
function fileURL() { return new URL('./level-five-integration-lower.mjs', import.meta.url); }
fs.writeFileSync(checkpointPath, JSON.stringify(checkpoints) + '\n');
fs.writeFileSync(runPath, JSON.stringify(run, null, 2) + '\n');
console.log(`M9 lower retry checkpoint PASS: latest ${state.levelFive.inspection.lastReport.rawTotalScore}, best ${state.levelFive.inspection.bestCompletedReport.rawTotalScore}, immutable first ${state.levelFive.progress.gameFinished.firstCompletedReport.rawTotalScore}.`);
