#!/usr/bin/env node
import './source-loader.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const { createLevelFiveStateQaContext } = await import('../../tests/fixtures/level-five-state.ts');
const { LEVEL_FIVE_AUDIT_SEEDS, LEVEL_FIVE_ECONOMIC_SCENARIOS, simulateLevelFiveEconomy, simulateLevelFivePacing } = await import('./level-five-simulation.ts');
const context = createLevelFiveStateQaContext();
const args = new Set(process.argv.slice(2));
const write = args.has('--write'), smoke = args.has('--smoke');
const seedArg = [...args].find(value => value.startsWith('--seed='))?.slice(7);
if (seedArg && !LEVEL_FIVE_AUDIT_SEEDS.includes(seedArg)) throw new Error('Unknown audit seed.');
const seeds = seedArg ? [seedArg] : smoke ? LEVEL_FIVE_AUDIT_SEEDS.slice(0, 1) : LEVEL_FIVE_AUDIT_SEEDS;
const scenarios = smoke ? ['passive-qualified', 'active-qualified', 'passive-no-round'] : LEVEL_FIVE_ECONOMIC_SCENARIOS;
const paths = ['packages/balance-config/src', 'packages/game-domain/src', 'packages/clinical-content/src', 'tests/fixtures', 'tools/economy-audit'];
function fingerprints() {
  const result = {};
  function visit(directory) {
    for (const entry of fs.readdirSync(path.join(root, directory), { withFileTypes: true })) {
      const relative = `${directory}/${entry.name}`;
      if (entry.isDirectory()) visit(relative);
      else if (/\.(ts|mjs|json)$/.test(entry.name) && !/results-|checkpoint-/.test(entry.name)) result[relative] = createHash('sha256').update(fs.readFileSync(path.join(root, relative))).digest('hex');
    }
  }
  paths.forEach(visit);
  return result;
}
const before = fingerprints(), economy = [], pacing = [];
const scratch = path.join(root, '.local-dev/level5-m8/audit-parts');
if (write) fs.mkdirSync(scratch, { recursive: true });
const sourceKey = createHash('sha256').update(JSON.stringify(before)).digest('hex');
const provenancePath = 'tools/economy-audit/level-five-audit-provenance-20261012.json';
const prior = JSON.parse(fs.readFileSync(path.join(root, provenancePath), 'utf8'));
// Retain only the completed runs whose executed branches did not change in
// the isolated training scheduler correction. Every gameplay/data dependency
// remains exact; neither earlier production revisions nor training caches qualify.
function unchangedPriorRun(name, key) {
  if (name.endsWith('.reader-training') || key !== prior.priorSourceKey) return false;
  if (createHash('sha256').update(JSON.stringify(prior.priorSourceFingerprints)).digest('hex') !== key) return false;
  for (const [file, digest] of Object.entries(prior.priorSourceFingerprints)) {
    const change = prior.correctedAuditScripts[file];
    if (change && (change.beforeSha256 !== digest || createHash('sha256').update(prior.priorAuditScripts[file]).digest('hex') !== digest)) return false;
    if (before[file] !== (change?.afterSha256 ?? digest)) return false;
  }
  return Object.keys(before).every(file => file in prior.priorSourceFingerprints || file === provenancePath);
}
function recordRunSource(name, result, key) {
  const row = name.includes('.pacing') ? result.report : result;
  row.auditSourceKey = key;
  row.auditRevision = key === sourceKey ? 'final' : 'before isolated training scheduler correction';
  return result;
}
function cached(name, produce) {
  const file = path.join(scratch, `${name}.json`);
  if (args.has('--resume') && fs.existsSync(file)) {
    const cache = JSON.parse(fs.readFileSync(file, 'utf8'));
    if (cache.sourceKey === sourceKey) { console.log(`Verified same-source cached reducer run: ${name}`); return recordRunSource(name, cache.result, cache.sourceKey); }
    if (unchangedPriorRun(name, cache.sourceKey)) { console.log(`Verified unchanged gameplay/data and prior unaffected audit branch: ${name}; source ${cache.sourceKey}`); return recordRunSource(name, cache.result, cache.sourceKey); }
  }
  const result = recordRunSource(name, produce(), sourceKey);
  if (write) fs.writeFileSync(file, JSON.stringify({ sourceKey, result }) + '\n', 'utf8');
  return result;
}
let checkpoint = null;
if (args.has('--merge')) {
  for (const seed of LEVEL_FIVE_AUDIT_SEEDS) {
    const part = JSON.parse(fs.readFileSync(path.join(scratch, `${seed}.part.json`), 'utf8'));
    if (part.sourceKey !== sourceKey) throw new Error(`Source mismatch in ${seed} partial; rerun that part.`);
    economy.push(...part.economy); pacing.push(...part.pacing);
    if (seed === LEVEL_FIVE_AUDIT_SEEDS[0]) checkpoint = part.checkpoint;
  }
} else {
if (!args.has('--pacing-only')) for (const seed of seeds) for (const scenario of scenarios) {
  const result = cached(`${seed}.${scenario}`, () => simulateLevelFiveEconomy(context, seed, scenario));
  economy.push(result);
  console.log(`${seed} ${scenario}: gross $${result.grossPerHour.toFixed(6)}/h, stock $${result.stockPerHour.toFixed(6)}/h, costs $${result.postedOperatingPerHour.toFixed(6)}/h, net $${result.operatingNetPerHour.toFixed(6)}/h; Gift $${result.giftDirectNetPerHour.toFixed(6)}/h; ${result.firstAnswers} answers / ${result.clinicalXp} XP; cash reconciled ${result.commandsReconciled} commands.`);
}
if (!smoke && !args.has('--economy-only')) for (const [index, seed] of seeds.entries()) {
  const result = cached(`${seed}.pacing80`, () => simulateLevelFivePacing(context, seed, 80, console.log));
  pacing.push(result.report);
  if (index === 0) checkpoint = result.checkpoint;
}
if (!smoke && !args.has('--economy-only') && seeds.includes(LEVEL_FIVE_AUDIT_SEEDS[0])) pacing.push(cached(`${LEVEL_FIVE_AUDIT_SEEDS[0]}.pacing90`, () => simulateLevelFivePacing(context, LEVEL_FIVE_AUDIT_SEEDS[0], 90, console.log)).report);
}
if (JSON.stringify(before) !== JSON.stringify(fingerprints())) throw new Error('Inputs changed during the audit; do not publish mixed-source results.');
const report = {
  version: 'level-five-reducer-audit.v1', date: '2026-10-12', method: 'Actual production reducer; all rooms/doors/hires and answers use commands; no balance, fee, wage, room-tier, training-tier or XP override.',
  assumptions: {
    initialClinic: 'Synthetic Level 5 opening, zero XP, $30,000 before paid construction/hiring; existing early Level 4 specialty factory plus normal Reading/Training rooms and all five prestige rooms; all tiers/training 1, default salaries, no advertising.',
    clinical: 'Full current eligible content, normal routine cadence restored once at opening, one chart action per active minute, 80% and 90% first-key accuracy; no employee discussion answers or emergency income.',
    passive: 'Scored arrivals suppressed only in clearly labeled autonomous-income references; no scored income or XP.',
    sensitivities: 'Half-gift withholds every second exogenous gift-only opportunity, preserving the 120-minute catalog and ordinary shopping. Slow-demand also toggles ordinary scheduled appointments off for alternating half-days; it does not change published fees or cadence.',
    missedRound: 'Real upstream hallway sale makes the Executive Office inaccessible, retaining full support upkeep and $45 wage; missed-first-round rebuilds the hallway after day 1 (capital excluded from operating margin). Gift/Garden/Gym stay connected. Gift outage uses actual missing door and existing technical upkeep relief. The isolated reader-training sensitivity withholds unanswered staff conversations and requests once normal arrival makes the production training quote available. Its paid 60-minute session and travel interrupt warmup reading; the measured period includes genuinely earned tier 2, not a tier override. All normal and pacing runs retain ordinary staff discussions.',
    clock: 'Active game hours and ten-hour operating days. Script execution speed and human reading time are not measured.',
    ownership: 'No owner storage, external clinical sources, gameplay web/AI, Git, installs or launch switch.',
  },
  sourceFingerprints: before, auditInputProvenance: prior, economy, pacing,
};
if (write) {
  if (smoke) throw new Error('--smoke is read-only.');
  if (seedArg) fs.writeFileSync(path.join(scratch, `${seedArg}.part.json`), JSON.stringify({ sourceKey, economy, pacing, checkpoint }) + '\n', 'utf8');
  else {
    if (!checkpoint || economy.length !== 36 || pacing.length !== 4) throw new Error('--write requires the complete three-seed economy and four extended pacing runs.');
    fs.writeFileSync(path.join(root, 'tools/economy-audit/level-five-results-20261012.json'), JSON.stringify(report, null, 2) + '\n', 'utf8');
    fs.writeFileSync(path.join(root, 'tests/fixtures/level-five-economy-checkpoint-20261012.json'), checkpoint + '\n', 'utf8');
  }
}
console.log(JSON.stringify({ economyRuns: economy.length, pacingRuns: pacing.length, resultsWritten: write, pacing: pacing.map(p => ({ seed: p.seed, accuracy: p.requestedAccuracyPercent, xpPerHour: p.xpPerGameHour, xpGoalHours: p.xpGoalGameHours, unlockHours: p.unlockGameHours, finishHours: p.firstFinishGameHours, inspectionScore: p.firstInspection.rawTotalScore, qualifyingPatients: p.firstInspection.qualifyingScoredPatientCount })) }, null, 2));
