// Rebuild the M9 watchable saves using actual reducer/engine play. No browser,
// owner storage, balance overrides, installs or Git.
import '../economy-audit/source-loader.mjs';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const { createLevelFiveStateQaContext } = await import('../../tests/fixtures/level-five-state.ts');
const { runLevelFiveIntegrationJourney, LEVEL_FIVE_INTEGRATION_SEED } = await import('../../tests/fixtures/level-five-integration.ts');
const { serializeGameState } = await import('../../packages/game-domain/src/index.ts');
const context = createLevelFiveStateQaContext();
const journey = runLevelFiveIntegrationJourney(context, (message, state) => {
  process.stdout.write(message + '\n');
  fs.writeFileSync(path.join(root, '.local-dev/level5-m9/progress-state.json'), serializeGameState(state) + '\n');
});
assert(journey.reports[0].rawTotalScore < 80, 'First low-score finish');
assert(journey.reports[1].rawTotalScore > journey.reports[0].rawTotalScore, 'Higher retry improves best');
assert(journey.reports[2].rawTotalScore < journey.reports[1].rawTotalScore, 'Lower retry preserves best');
assert.deepEqual(journey.state.levelFive.inspection.bestCompletedReport, journey.reports[1]);
assert.deepEqual(journey.state.levelFive.inspection.latestCompletedReport, journey.reports[2]);
assert.deepEqual(journey.state.levelFive.progress.gameFinished.firstCompletedReport, journey.reports[0]);
assert(journey.rounds.size > 0 && journey.comfortUses.size > 0);
assert(journey.state.levelFive.management.supplierSavings.stockCents > 0);
assert(journey.state.levelFive.management.supplierSavings.upkeepSixtiethCents > 0);
assert(journey.state.retiredEncounterSummary.retiredCount > 0);
assert(journey.state.retiredServiceHistory.retiredReceiptCount > 0);
const states = Object.fromEntries(Object.entries(journey.checkpoints).map(([key, state]) => [key, JSON.parse(serializeGameState(state))]));
const sourceRoots = ['packages/game-domain/src', 'packages/balance-config/src', 'packages/clinical-content/src'];
const sourcePaths = [];
function collect(directory) {
  for (const item of fs.readdirSync(path.join(root, directory), { withFileTypes: true })) {
    const file = directory + '/' + item.name;
    if (item.isDirectory()) collect(file);
    else if (!/\.(test|spec)\./.test(file) && /\.(ts|json)$/.test(file)) sourcePaths.push(file);
  }
}
sourceRoots.forEach(collect);
sourcePaths.push('tests/fixtures/level-five-integration.ts', 'tests/fixtures/level-five-rooms.ts', 'tests/fixtures/level-four-rooms.ts',
  'tools/economy-audit/level-four-simulation.ts', 'tools/qa/level-five-integration-run.mjs');
const inputs = Object.fromEntries(sourcePaths.sort().map(file => [file, crypto.createHash('sha256').update(fs.readFileSync(path.join(root, file))).digest('hex')]));
const summary = {
  version: 'level-five-m9-integration.v1', seed: LEVEL_FIVE_INTEGRATION_SEED,
  setup: 'Existing synthetic funded Level 4 opening. One ten-hour operating-day session per calendar day, with ordinary full-pool arrivals and real-world FSRS due dates. Real first answers and earned Level 4/5 goals; no XP/history/witness/report injection or offline active minutes.',
  liveCap: 4, commandsReconciled: journey.commands, openingCashCents: journey.openingCashCents,
  grossCents: journey.grossCents, stockCents: journey.stockCents, paidOperatingCents: journey.paidCents, capitalCents: journey.capitalCents,
  closingCashCents: journey.state.cashCents, levelFourAdvanceTick: states['integration-l4'].facilityTick,
  xpGoalTick: journey.xpGoalTick, unlock: journey.state.levelFive.progress.inspectionUnlocked,
  firstAnswers: journey.firstAnswers.size, levelFiveFirstAnswers: [...journey.firstAnswers.values()].filter(a => a.level === 5).length,
  completedDailyRounds: journey.rounds.size, positiveComfortUses: journey.comfortUses.size,
  supplierSavings: journey.state.levelFive.management.supplierSavings, reports: journey.reports,
  retiredReceipts: journey.state.retiredServiceHistory.retiredReceiptCount, retiredEncounters: journey.state.retiredEncounterSummary.retiredCount,
  finishNotices: journey.state.events.filter(event => event.id === 'event.level-five.game-finished').length,
  snapshotPhases: Object.fromEntries(Object.entries(states).map(([key, state]) => [key, { tick: state.facilityTick, xp: state.clinicalXp, phase: state.levelFive?.inspection.status ?? null }])),
  inputs,
};
if (process.argv.includes('--write')) {
  fs.writeFileSync(path.join(root, 'tests/fixtures/level-five-integration-checkpoints-20261012.json'), JSON.stringify(states) + '\n', 'utf8');
  fs.writeFileSync(path.join(root, 'tools/qa/level-five-integration-results-20261012.json'), JSON.stringify(summary, null, 2) + '\n', 'utf8');
}
process.stdout.write(JSON.stringify({ commands: journey.commands, closingCashCents: summary.closingCashCents,
  xpGoalTick: summary.xpGoalTick, unlock: summary.unlock, snapshots: summary.snapshotPhases,
  reports: journey.reports.map(r => ({ score: r.rawTotalScore, patients: r.qualifyingScoredPatientCount })) }, null, 2) + '\n');
