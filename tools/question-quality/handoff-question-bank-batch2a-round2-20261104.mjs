// Scoped handback only: never import the moving combined clinical assembly.
import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const prefix = 'tools/question-quality/question-bank-batch2a-round2-';
const handoff = 'docs/research/question-bank-batch2a-round2-handoff-20261104.md';
const manifest = prefix + 'owned-files-20261104.json';
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const sha = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const packet = read('docs/research/question-bank-batch2a-round2-20261104.json');
const lint = read(prefix + 'lint-20261104.json');
const isolated = read(prefix + 'isolated-verification-20261104.json');
const ledger = read('docs/research/sources-question-bank-batch2a-round2-20261104.json');
const entry = read('tools/question-quality/fixtures/question-bank-batch2a-round2-before-20261104.json');
const reviews = packet.filter(p => p.id !== 'B2A01');
assert.equal(reviews.length, 10);
assert.equal(isolated.noteResponses, 121);
assert(isolated.passed);
assert.deepEqual(packet, read('docs/research/question-bank-batch2a-20261104.json'));

// Append a scoped pointer; never rewrite the manager's accumulated handoff.
const currentHandoff = 'docs/handoffs/CURRENT_THREAD_HANDOFF.md';
const marker = 'BATCH2A ROUND2 HANDOFF 20261104';
if (!fs.readFileSync(currentHandoff, 'utf8').includes(marker)) {
  fs.appendFileSync(currentHandoff, '\n\n<!-- ' + marker + ' -->\n' +
    'Batch 2a round two worker: ten revised drafts, B2A01 frozen; STOP for independent review/integration. ' +
    'Scoped handoff: docs/research/question-bank-batch2a-round2-handoff-20261104.md. ' +
    'Packet: docs/research/question-bank-batch2a-round2-20261104.json. ' +
    'Current shared-bank imports are blocked by the separate N1 round-two binding error; ' +
    'full validation windows and protected cloud performance failure are documented. ' +
    'No release/Git/network/evidence changes; batch 2b is proposal-only.\n');
}

const bound = [
  'packages/clinical-content/src/answer-choice-timing.ts',
  'packages/clinical-content/src/index.ts',
  'packages/clinical-content/src/synthetic-content.ts',
  'packages/game-domain/src/test-choice-orders.ts',
  'packages/clinical-content/src/question-bank-batch2a-round2-20261104.ts',
  'packages/clinical-content/src/question-bank-batch2a-round2-20261104-data.ts',
  'packages/clinical-content/src/question-bank-batch2a-round2-evidence-20261104.ts',
];
const tests = [
  'packages/clinical-content/src/answer-choice-timing.test.ts',
  'packages/clinical-content/src/question-bank-batch2a-round2-20261104.test.ts',
  'packages/game-domain/tests/question-bank-batch2a-round2-bindings.test.ts',
  'packages/game-domain/tests/question-bank-batch2a-bindings.test.ts',
  'packages/game-domain/tests/approved-clinical-admission.test.ts',
  'packages/game-domain/tests/test-choice-order-inventory.test.ts',
  'packages/game-domain/tests/patient-supply.test.ts',
  'packages/game-domain/tests/diagnostics/patient-supply.test.ts',
  'packages/game-domain/tests/gs028-20261007-batch.test.ts',
  'packages/game-domain/tests/gs028-20261007-variety2-batch.test.ts',
  'packages/game-domain/tests/surgery-center-batch.test.ts',
  'packages/game-domain/tests/gs028-20261003-batch.test.ts',
];
const other = [
  'apps/player/public/clinical-exhibits/batch2a-r2-b04-pressure.png',
  'tools/question-quality/report.mjs',
  'docs/execplans/question-bank-program-20261104.md',
  'docs/research/question-bank-batch2a-20261104.json',
  'docs/research/question-bank-program-queue-20261104.json',
  'docs/research/question-bank-batch2b-proposal-20261104.md',
  'docs/research/question-bank-retire-merge-proposals-20261104.md',
  'docs/handoffs/CURRENT_THREAD_HANDOFF.md',
];
const scope = [...new Set([...bound, ...tests, ...other])];
for (const dir of ['tools/question-quality', 'tools/question-quality/fixtures', 'docs/research']) {
  for (const name of fs.readdirSync(dir)) {
    const path = dir + '/' + name;
    if (fs.statSync(path).isFile() && name.includes('question-bank-batch2a-round2') && path !== manifest) scope.push(path);
  }
}
const log = name => {
  const b = fs.readFileSync(prefix + name + '-20261104.log');
  return b.toString(b[0] === 255 ? 'utf16le' : 'utf8').replace(/\x1b\[[0-9;]*m/g, '');
};
const footer = name => log(name).split(/\r?\n/).filter(s => /^\s*(Test Files\s|Tests\s|Duration\s|ℹ (tests|pass|fail|duration))/.test(s)).map(s => s.trim()).join('; ');
const evidence = [
  ['clinical-complete', 'Last complete clinical-content run; prior to the later N1 integration failure'],
  ['domain-repaired', 'Last complete game-domain run; expected Level 5 failures only in that source window'],
  ['domain-focused', 'Four exact-binding/admission/inventory test files'],
  ['domain-isolated', 'Inventory and preceding flag-preview expectation at original deadlines'],
  ['player-final', 'Complete player run with existing preload, threads and two workers'],
  ['player-isolated', 'Original projection deadline passes; protected cloud performance guard still fails'],
  ['lint-tests', 'Last all-passing linter run before N1 assembly changed'],
  ['lint-tests-handoff', 'Fresh linter run: one bank-import test blocked by N1 binding'],
  ['clinical-scope-final', 'Fresh clinical scope test: suite import blocked; no tests run'],
  ['player-focused-final', 'Fresh three presentation suites: imports blocked; no tests run'],
];
const safe = s => String(s).replaceAll('|', '\\|').replaceAll('\n', ' ');
const lines = [
  '# Batch 2a round two — worker handoff', '',
  'Authored 2026-11-04; validation/handoff completed across midnight UTC. STOP for independent review and manager integration. Nothing shipped; no Git, installs, network, source retrieval, clinical approval or analytics. All ten new variants and eight claims remain `needs_clinician_review`; Melissa Rowland is clinical sign-off.', '',
  'Regenerated both eleven-item packets: `question-bank-batch2a-round2-20261104.json` and `question-bank-batch2a-20261104.json`. **Key shown first for review only; runtime choices are randomized.** B2A01 is the exact independently passed version, marked pipelinePassed/basicAccepted; this is not clinical approval. The fourteen flag drafts, F01/F12/F14, old source definitions, earlier approvals and old picture assets were not edited.', '',
  '## Review response and author checks', '',
  'All 121 first-review cue/fairness/suggestion notes have individually indexed responses in reviewResponse.noteResponses. Every revised item has the requested five-part self-check: cover-the-key cue attack, parallel same-stage/category choices, interpret then apply, predicted PGY-2/3 moderate difficulty, and one best answer with visible decision-critical context. These are author judgments pending independent review, not measured difficulty or self-granted pipeline passes. Initial draft issues caught in self-check were rewritten, including uniquely long keys, component convergence, named missing steps and permission/feasibility wording.', '',
  '| Item | Before → after | Response; exact per-note details in JSON |',
  '|---|---|---|',
  ...reviews.map(p => '| ' + [p.id, p.before.variantId + ' → ' + p.after.variantId, p.whatChanged].map(safe).join(' | ') + ' |'), '',
  '## Versioning, continuity and evidence', '',
  'Six newly scored constructs require separate concept versions (old concepts retained):', '',
  ...reviews.filter(p => p.conceptVersion).map(p => '- `' + p.conceptId + '` — ' + p.clinicalMeaning), '',
  'Four new constructs are paired-only; two are standalone. No selector/routing change is made. The owned schema-validated projection preserves 1,181 whole cases and 1,492 non-target nodes exactly, retains all 501 entry concepts and adds six. The captured valid bank has 1,189 cases / 1,502 node occurrences. Zero new variant-ID collisions. Ten timing rows and seventeen exact choice-order records are additive: four existing-service gates and thirteen explicitly nonexecuted previews. The 1,903 prior timing rows and old choice records remain retained. Frozen encounters/saves are not rewritten.', '',
  'B2A04 adds an existing outsourced contrast-swallow gate, with raw returned findings and explicit later-pressure-study chronology; the following passed question/current update remains exact. B2A08 corrects the earlier inguinal label with new interval anatomy, rather than silently contradicting it. There is no runtime/save-envelope/choice-randomization change.', '',
  `Evidence ledger: ${ledger.claims.length} current/prior/basis atomic claims and ${ledger.sources.length} existing source records, including eight new independently written application claims. Source authority, reuse/license status, original access dates and mapping limitations are retained. No fresh source verification is claimed. The prior B2A02 Heller/PPI/nitrate treatment hold remains on its retained version; the new scored construct concerns a secondary junction lesion, using existing directly checked guidance, with the exact sampling approach still for clinical review.`, '',
  'The new pressure schematic is original project artwork generated offline with System.Drawing, not a copied figure or patient trace; visually inspected at 1200×720. It includes software integral observations so reduced reserve is not inferred from peak height. Prior B01/B03 PNGs remain byte-exact.', '',
  '## Advisory lint', '',
  `Last complete same-v8 comparison (${lint.checkedAt}): ${lint.before.uniqueVariants} variants / ${lint.before.profileContexts} finite contexts on each side; whole-bank findings **${lint.before.findings} → ${lint.after.findings}**. Selected ten **${lint.selected.beforeFindings} → ${lint.selected.afterFindings}**; forbidden owner-rule findings **${lint.selected.beforeOwnerFindings} → ${lint.selected.afterOwnerFindings}**. The same preceding N1/N2 definitions are present on both sides.`, '',
  ...reviews.filter(p => p.lint.after.length).map(p => '- ' + p.id + ': ' + [...new Set(p.lint.after.map(f => f.rule))].join(', ') + '; exact phrases/fields and author dispositions retained.'), '',
  'No rule or warning is suppressed. The linter implementation is unchanged; report metadata includes the additive versions. The current combined-bank CLI now fails before inventory at the separate N1 round-two binding error below, so the preceding complete comparison is not presented as a scan of the latest combined tree.', '',
  '## Validation and moving-tree limits', '',
  'Commands use existing dependencies, npm.cmd and --pool=threads. Full domain used --maxWorkers=1; full player used --maxWorkers=2 with the existing absolute preload path. No assertions or deadlines were weakened. Logs and immutable input locks are in tools/question-quality with this milestone prefix.', '',
  '| Log suffix | Exact output | Scope/result |', '|---|---|---|',
  ...evidence.map(([name, note]) => '| ' + [name, footer(name) || 'See import-error log', note].map(safe).join(' | ') + ' |'), '',
  'Root `npm.cmd run typecheck`: all seven workspaces pass in `question-bank-batch2a-round2-typecheck-handoff-20261104.log`. The initial full clinical length failure was fixed, followed by full 885/885 passes. Early interrupted domain/player attempts are not counted as completed validation. An initial focused-player command used a relative preload path and failed MODULE_NOT_FOUND; it was corrected to the absolute preload for the final attempt listed above.', '',
  'The full player failure in diagnosticProjectionDifferential.test.ts was a 30-second timeout; the original-deadline isolated rerun passes. The cloud diagnosticWorkloadPerformance.test.ts guard fails both full and isolated: isolated tick+overview 49.1916 ms against its unchanged 16 ms budget. No cloud code/test or performance threshold was edited. A read-only disposable fixture control finds the same active cases and byte-exact state after removing only six new empty concept histories; this narrows the content delta but does not establish timing causation. Cloud/performance owner review remains required.', '',
  '**Latest combined-tree blocker:** `N1 round-two prior binding changed: case.n1.breast-mass-morphology.v1` from the separate question-new-n1-round2 stage. Fresh bank CLI, one clinical suite and all three affected presentation suites fail at import (zero tests run); the fresh linter run is 32/33, with its bank-dependent test failing at the same import. Those files/stage were left untouched. Earlier full runs are source-window evidence, not proof that the present combined tree starts or is green.', '',
  'The separate N1 stage arrived during validation. This round exposes a stable QUESTION_BANK_BATCH2A_ROUND2_RELEASE stage and asserts that its timing rows form a retained prefix so another worker can append after it. Current source/packet correctness was rechecked with the actual owned projection and real release schema, independently of the later failing assembly: ten versions, six constructs, eight claims, 121 note responses and all protected source/asset hashes pass. This does not bypass or validate the default combined assembly.', '',
  'Input-window JSONs for full/final/repaired launches record external changes separately. The repaired launch covers 4,882 files; later shared changes include N1 files, its assembly/timing/order appends and reducer.ts, plus this round’s stable-stage test alias. Do not attribute those other-lane edits to this batch or overwrite them. Earlier four-file in-memory hunk restoration proves other appended content was retained at that earlier checkpoint; later shared hashes naturally differ.', '',
  '## Exact Level 5 failures and inputs', '',
  'All 26 failures in the repaired full-domain run are in tests/level-five-integration.test.ts:', '',
  '- M9 connected Level 5 reducer journey → binds the actual run to its current game, balance, clinical and driver inputs and reconciles cash (recorded input binding).',
  '- M9 Level 0–4 intake behavior after the ordinary cap-5 switch → matches the actual pre-M9 load and next 120 minutes: every pair of level {0,1,2,3,4} × schema {5,6,7,8,9} (25 separate initial-state SHA assertions, line 183). Each fails before its behavioral continuation. Other behavioral cases pass in that run; refreshed evidence must still be rerun by the manager.', '',
  'Exactly these seven bound source inputs were changed by this milestone (four shared files also contain other workers’ appends):', '',
  ...bound.map(p => '- `' + p + '`'), '',
  'The new PNG, documentation, question-quality tooling and .test.ts files are outside that source collector. No Level 5 evidence, Level 4/5 tests, release snapshot or rebind was edited. Manager owns the rebind and legacy behavioral-evidence refresh after integrating all lanes.', '',
  '## Fixture changes and checks', '',
  'New clinical/domain tests verify exact versions, schemas, retained histories, note coverage, timing and gates. The historical batch-2a binding suite now explicitly checks its retained round-one release stage. Admission expectations add exactly the six draft constructs without promoting approval. Inventory totals become 1,528 active study options / 160 terminal correct-test choices; the added runtime gate uses an existing service.', '',
  'Six fixture files have documented expectation repairs. The read-only same-domain before/after control reproduces all three original supply snapshots before applying this round. Early-pool concept counts gain three at levels 1/2, with case counts unchanged; the new unseen-history mix legitimately changes seeded arrivals. Day 6 changes from a completed two-node perianal case to a completed one-node nutrition case. Sustained supply changes from 96 arrivals / 94 complete / 128 answers to 94 / 93 / 136, with zero walkouts in both; exact values are recorded in fixture-control JSON. All original commands, deadlines and 409 assertion call sites remain, plus one added exact guard (410 total).', '',
  'The Oct-3 cohort study count 19→20 is a carried-over stale expectation from flag F13, not a new flag edit: the exact planned polysomnography preview already exists in both this round’s before and after bank. A new exact-row assertion documents it. F13 content stays frozen. Inventory’s one initial 10-second timeout passes in isolation and in the repaired full run without a timeout increase.', '',
  '## Files and manager next actions', '',
  'The machine-readable owned-files manifest lists every scoped path, current SHA and whether it was present at entry. Shared-file hashes include unrelated concurrent work; they are audit evidence, never instructions to replace whole files. Principal runtime/test paths:', '',
  ...[...bound, ...tests, other[0], 'tools/question-quality/report.mjs'].map(p => '- `' + p + '`'), '',
  'Packets, source ledger, cue audit, queue, retire/merge ledger, original image generator, reproducible author/packet/verification/control tools and validation logs are included in the manifest. The standard remains v13; this round applies it rather than altering owner direction.', '',
  'Queue update changes only the eleven batch rows and preserves 1,486 unrelated rows. Batch 2b has a refreshed next-forty proposal only; no variants were rewritten. Starting it is unsafe while the separate combined-bank assembly cannot import. Resume after manager integration and the review gate. Merge/retirement entries remain proposals only; F14 and neck-node KEEP decisions remain in force.', '',
  'Manager actions: run independent review on the ten new drafts, resolve the separate N1 binding, rerun current combined lint/clinical/affected-player validation, investigate the protected cloud performance failure, then perform the owned Level 5 rebind/legacy refresh and acceptance. Keep old/fallback definitions if a draft is rejected; no worker release or save migration was performed.', '',
  'This checkpoint exists only in the local shared working tree. No Git backup was created; any future “push to GitHub” instruction belongs with the manager after scoped review. No release or publication is authorized by a backup.', '',
];
fs.writeFileSync(handoff, lines.join('\n'));
scope.push(handoff);
const files = [...new Set(scope)].filter(p => fs.existsSync(p)).sort().map(path => ({
  path, change: Object.hasOwn(entry.files, path) ? 'modified_or_shared_existing' : 'added_or_existing_doc_outside_entry_hash_scope',
  sha256: sha(path), level5Bound: bound.includes(path),
}));
fs.writeFileSync(manifest, JSON.stringify({
  generatedAt: new Date().toISOString(), milestone: 'Batch 2a round 2; ten author drafts and one frozen PASS',
  scopeNotice: 'Only the named worker hunks belong to this round. Shared files also contain other authors’ work. Logs and fixtures are evidence, not runtime sources.',
  handoff, packet: 'docs/research/question-bank-batch2a-round2-20261104.json',
  exactLevel5BoundInputs: bound, excludedLanes: ['question-new-*', 'cloud/save', 'supabase', 'Level 4/5 tests and evidence', 'selector/routing', 'entry/loading/art'], files,
}, null, 2) + '\n');
console.log(JSON.stringify({handoff, manifest, scopedFiles: files.length, revisions: 10, frozenPass: 1, notes: 121, boundInputs: bound.length}));
