import fs from 'node:fs';
import assert from 'node:assert/strict';

const root = 'docs/research/question-topic-acceptance-batch5';
const logs = '.local-dev/question-topic-acceptance-batch5-20261111';
const read = path => JSON.parse(fs.readFileSync(path, 'utf8').replace(/^\uFEFF/, ''));
const textFile = path => {
  const bytes = fs.readFileSync(path);
  return bytes[0] === 255 ? bytes.toString('utf16le').replace(/^\uFEFF/, '') : bytes.toString('utf8');
};
const cell = value => String(value ?? '').replaceAll('|', '\\|').replace(/\r?\n/g, ' ');
const table = (headers, rows) => ['| ' + headers.join(' | ') + ' |',
  '| ' + headers.map(() => '---').join(' | ') + ' |',
  ...rows.map(row => '| ' + row.map(cell).join(' | ') + ' |')].join('\n');
const packet = read(root + '-packet-20261111.json');
const migration = read('tools/question-quality/fixtures/question-topic-acceptance-batch5-source-migration-20261111.json');
const before = read('tools/question-quality/fixtures/question-topic-acceptance-batch5-before-20261111.json');
function result(label) {
  const report = read(logs + '/' + label + '.json');
  const log = textFile(logs + '/' + label + '.log');
  return {label, files: report.testResults.length, passed: report.numPassedTests,
    failed: report.numFailedTests, skipped: report.numPendingTests, total: report.numTotalTests,
    jsonPath: logs + '/' + label + '.json', logPath: logs + '/' + label + '.log',
    commandLine: log.split(/\r?\n/).find(line => line.startsWith('> vitest run')),
    durationLine: log.split(/\r?\n/).find(line => /^\s*Duration\s/.test(line))?.trim(),
    failures: report.testResults.flatMap(file => file.assertionResults.filter(test => test.status === 'failed')
      .map(test => ({file: file.name, title: test.fullName, messages: test.failureMessages}))),
    collectionFailures: report.testResults.filter(file => file.status === 'failed' && !file.assertionResults.length)
      .map(file => ({file: file.name, message: file.message})),
    perFile: report.testResults.map(file => ({file: file.name,
      passed: file.assertionResults.filter(test => test.status === 'passed').length,
      failed: file.assertionResults.filter(test => test.status === 'failed').length})),
  };
}
const finalRuns = Object.fromEntries(['clinical-final', 'domain-full', 'player-close', 'focused-close'].map(label => [label, result(label)]));
const baseline = result('topic-baseline-final');
const typeLog = textFile(logs + '/typecheck-close.log').replace(/\r\n/g, '\n');
const headers = [...typeLog.matchAll(/^> (@.*) typecheck$/gm)];
assert.equal(headers.length, 7);
const typechecks = {command: 'npm.cmd run typecheck', logPath: logs + '/typecheck-close.log',
  scripts: headers.map((header, index) => ({workspace: header[1],
    passed: !/: error TS\d+/.test(typeLog.slice(header.index, headers[index + 1]?.index ?? typeLog.length))})),
  diagnostics: typeLog.split('\n').filter(line => /: error TS\d+/.test(line))};
const cueLog = textFile(logs + '/lint-tests-close.log');
assert.match(cueLog, /pass 33/);
assert.match(cueLog, /fail 0/);
const playerNativeExit = read(logs + '/player-close-exit.json');
assert.equal(playerNativeExit.nativeExitCode, 0);
const ownPlayer = finalRuns['player-close'].perFile.find(row => row.file.endsWith('/questionProgramBatch5SaveCompatibility.test.ts'));
assert.equal(ownPlayer.passed, 47);
assert.equal(ownPlayer.failed, 0);
const currentFailures = new Set(finalRuns['clinical-final'].failures.map(row => row.title));
const repairedBaselineTests = baseline.failures.filter(row => !currentFailures.has(row.title));
const remainingTopicTests = finalRuns['clinical-final'].failures.filter(row => /\/question-topic-/.test(row.file));
const validation = {checkedOn: '2026-11-12', finalRuns, typechecks,
  cueTests: {passed: 33, failed: 0, command: 'node --test --test-isolation=none tools/question-quality/lint.test.mjs'},
  playerPreload: 'tools/question-quality/adversarial-r5-player-preload-20261102.cjs',
  playerInvocation: {firstWrapperExitCode: 1, firstPassedTests: 128, firstFailedTests: 0,
    firstLogPath: logs + '/player-focused.log', finalNativeExitCode: playerNativeExit.nativeExitCode,
    nativeExitPath: logs + '/player-close-exit.json',
    note: 'PowerShell treated React act warnings on stderr as a command error. The final invocation exits with the actual npm native status, preserving all warnings and test assertions.'},
  newCompatibility: {passed: 47, failed: 0, admissionsAndFormat3Completion: 21,
    retiredSnapshotsAndCompletion: 13, retiredJournalsAndCompletion: 13},
  topicBaseline: baseline, repairedBaselineTests, remainingTopicTests,
  commands: [
    {cwd: 'packages/clinical-content', command: 'npm.cmd test -- --pool=threads --maxWorkers=2 --reporter=default --reporter=json --outputFile=../../.local-dev/question-topic-acceptance-batch5-20261111/clinical-final.json', exitCode: 1},
    {cwd: 'packages/game-domain', command: 'npm.cmd test -- --pool=threads --maxWorkers=2 --reporter=default --reporter=json --outputFile=../../.local-dev/question-topic-acceptance-batch5-20261111/domain-full.json', exitCode: 1},
    {cwd: 'apps/player', command: 'npm.cmd test -- src/questionProgramBatch5SaveCompatibility.test.ts src/questionShipSaveCompatibility.test.ts src/session/cloud/separateCampaign.test.ts src/session/flagFreeze.test.tsx --pool=threads --maxWorkers=2 --reporter=default --reporter=json --outputFile=../../.local-dev/question-topic-acceptance-batch5-20261111/player-close.json', exitCode: 0},
    {cwd: 'packages/clinical-content', command: 'npm.cmd test -- src/question-program-batch5-acceptance-20261111.test.ts src/question-program-batch4-acceptance-20261111.test.ts src/question-ship-manifest.test.ts src/answer-choice-timing.test.ts src/patient-library-wording-repair.test.ts src/pilot-content.test.ts src/question-topic-ethics-professionalism-20261111.test.ts src/question-topic-pancreas-chronic-cysts-neoplasia-20261111.test.ts --pool=threads --maxWorkers=2 --reporter=default --reporter=json --outputFile=../../.local-dev/question-topic-acceptance-batch5-20261111/focused-close.json', exitCode: 0},
    {cwd: '.', command: 'npm.cmd run typecheck', exitCode: 0},
    {cwd: '.', command: 'node --test --test-isolation=none tools/question-quality/lint.test.mjs', exitCode: 0},
  ],
  environment: {CI: '1', NODE_NO_WARNINGS: '1', domainGS028_LEVEL3_EVIDENCE_DIR: null,
    playerNODE_OPTIONS: '--require=C:/Users/rowla/Projects/GamifySurgery/tools/question-quality/adversarial-r5-player-preload-20261102.cjs'}};
fs.writeFileSync(root + '-validation-20261111.json', JSON.stringify(validation, null, 2) + '\n');
const changes = migration.files.filter(row => /\/question-topic-.*\.test\.ts$/.test(row.path));
const topics = before.topics.map(topic => {
  const accepted = packet.accepted.filter(row => row.sourceView === 'topic-batch5-' + topic.config.slug);
  return [topic.config.slug + (topic.config.salvage ? ' (salvage)' : ''), topic.requested.length,
    accepted.length, new Set(accepted.map(row => row.caseId)).size];
});
const failures = Object.values(finalRuns).flatMap(run => run.failures.map(failure => [run.label,
  failure.file.replace(/^.*\/packages\//, 'packages/').replace(/^.*\/apps\//, 'apps/'), failure.title]));
const report = `# Topic program acceptance batch 5 - 2026-11-11

Completed on 2026-11-12. Accepted **22 exact PASS nodes in 21 complete cases**
from the manager's 29 requested identities. Seven nodes are skipped. Every
accepted variant remains **needs_clinician_review**. Manifest
\`${packet.manifestId}\` has **686 authority rows**. The default now contains
**1338 cases, 1533 nodes, 1035 registered meanings and 840 scored meanings**.

[The acceptance packet](question-topic-acceptance-batch5-packet-20261111.json)
contains exact identities, latest review records, source hashes, existing
claims/sources, clinical contexts, runtime probes and diagnostic-choice tuples.
Keys are shown first for review only. Runtime options shuffle.

## Accepted and skipped

${table(['Topic', 'Requested nodes', 'Accepted nodes', 'Accepted cases'], topics)}

${table(['Accepted node', 'Case', 'Variant', 'Concept'], packet.accepted.map(row => [row.nodeId, row.caseId, row.questionVariantId, row.conceptId]))}

${table(['Skipped node', 'Reason', 'Unlisted scored siblings in source contexts'], packet.skipped.map(row => [row.nodeId, row.reason, row.unlistedSiblingIds.join(', ')]))}

The pediatric neck CDH and pyogenic cases lack compatible explicit pediatric
identity metadata. The DSD, mediastinal biopsy and node-sample cases have
prospective test timing which the current pediatric runtime rejects. The
negative-exploration and PE-imaging cases include unlisted scored siblings.
Each skip is recorded against its exact requested identity.
Gastroschisis and the quality-safety checklist item received no acceptance row.

The first pediatric preflight omitted prospective timing registration. It
temporarily selected three additional cases which would fail after timing
installation. The timing-aware recheck withholds those exact three cases.
[The initial preflight archive](../../tools/question-quality/fixtures/question-topic-acceptance-batch5-initial-preflight-20261111.json)
retains that probe, its initial correction ledger and every original reviewed
serialization. The immutable intake still records the preceding v13 default.
Final admission probes run with the actual accepted timing registry installed.

## Frozen bytes and identity

[The reviewed source archive](question-topic-acceptance-batch5-source-freeze-20261111.json)
contains the original node/question serializations for all 22 accepted nodes.
Six object-key order normalizations are recorded separately. Whole source-file,
question, node, case and accepted-view hashes accompany the records.

Accepted runtime copies apply **65 exact name-only substitutions in 12 cases**.
[The correction ledger](../../tools/question-quality/fixtures/question-topic-acceptance-batch5-literal-name-corrections-20261111.json)
records each changed field, its original text, replacement and source hash.
Options feedback and explanations follow the same patient-name rule.
Question and concept identities stay exact. Fixed demographic profiles remain
bound to the reviewed cases. Five pediatric salvage cases have compatible
child art, an explicit pediatric profile and parent accompaniment in the
existing operational Pediatric Examination Room.

All 1019 previous registered meaning definitions and 664 prior authority rows
pass exact preservation checks. Sixteen authored meanings are newly registered.
One ordinary replacement and four explicit topic consolidations retire 13
prior cases containing 19 nodes. The shared venous-ulcer source is retired
once and both reviewed successor cases remain admitted.

${table(['Retired case', 'Original scored nodes', 'Original SHA-256'], packet.retained.map(row => [row.caseId, row.nodes.map(node => node.id).join(', '), row.sha256]))}

All **47 new compatibility tests pass**. They cover fresh admission and
format-3 completion for all 21 new cases, plus snapshot and committed-journal
reopening/completion for all 13 retired cases. Original question versions,
answer choice meaning, FSRS identities and existing reviews are checked.
The historical pediatric fixture explicitly opens the exact retired M7 chart
under its retained source context. Its real room, child art and parent paths
stay exercised. The M7 admission suite uses its verified pre-batch5 content
epoch with the current reducer. Original assertions and timeout budgets remain.

## Runtime bindings

Sixteen adult cases admit through the existing clinic route and match APP
consult affinity. Five pediatric cases admit through the existing pediatric
clinic route with a real examination room. All 22 timing rows are installed.

The domain worker must install **24 exact diagnostic-choice bindings** exported
as \`QUESTION_PROGRAM_BATCH5_ACCEPTED_TEST_ORDER_RECORDS\` in
packages/game-domain/src/test-choice-orders.ts. They retain the explicit
not_executed/future_planned disposition. The five pediatric cases have no
enacted tests or procedures. Three held pediatric neck cases require a
separate manager decision about supported pediatric testing before acceptance.
The two cases missing pediatric identity metadata need a reviewed compatible
profile/art context before a later acceptance attempt.

${table(['Case', 'Node', 'Variant', 'Choice', 'Label', 'Timing profile'], packet.pendingRuntimeOrders.map(row => [row.caseId, row.nodeId, row.questionVariantId, row.choiceId, row.choiceLabel, row.timingProfileId]))}

## Later acceptance membership guards

The topic baseline contained 1166 passed and 33 failed tests in 60 files.
${changes.length} topic test files now recognize later exact manager
acceptances or their retained historical cases. The shared test helper verifies
authority against the captured prior manifest plus this batch's exact rows,
checks every fresh tuple, and binds each admitted case to its frozen SHA-256.
Retired source lookups require an explicit retirement relation and retained
definition. Existing clinical/source/approval assertions remain in place.

${table(['Updated topic test', 'Intake SHA-256', 'After SHA-256'], changes.map(row => [row.path, row.beforeSha256, row.afterSha256]))}

${repairedBaselineTests.length} of the 33 original failing topic tests pass
in the final full clinical run. Remaining topic guards are listed below and
in the validation JSON. Their captured review or source mismatch requires
separate reconciliation. Original review files, source packets and immutable
captures retain their original bytes.

${table(['Remaining topic test', 'Failure title'], remainingTopicTests.map(row => [row.file.replace(/^.*\/packages\//, 'packages/'), row.title]))}

## Counts, source views and hashes

${table(['Measure', 'Before', 'After'], Object.keys(packet.counts.before).map(key => [key, packet.counts.before[key], packet.counts.after[key]]))}

${table(['Artifact', 'SHA-256'], [['Default release', packet.hashes.defaultAfter], ['Manifest', packet.hashes.manifestAfter], ['Authoring catalog', packet.hashes.catalogAfter]])}

${table(['Accepted source view', 'Cases', 'Nodes', 'SHA-256'], packet.sourceViews.map(row => [row.name, row.cases, row.nodes, row.sha256]))}

The accepted copies reuse ${packet.claims.length} existing atomic claims and
${packet.sources.length} existing source records. The packet retains their
full metadata, license/reuse status and claim links. This integration adds
no clinical facts or external-source records.

## Validation

All Vitest commands use npm.cmd with --pool=threads --maxWorkers=2. Player
tests use the existing Windows preload. Full output, commands, durations and
every failure message are recorded in
[the validation receipt](question-topic-acceptance-batch5-validation-20261111.json)
and the logs under ${logs}/.
The initial player wrapper returned 1 after React act warnings on stderr,
with all 128 assertions passing. The final player invocation explicitly records
npm's native exit code in player-close-exit.json and retains the warning output.

${table(['Run', 'Files', 'Pass', 'Fail', 'Skip', 'Duration'], Object.values(finalRuns).map(run => [run.label, run.files, run.passed, run.failed, run.skipped, run.durationLine]))}

All seven workspace typecheck scripts ran. ${typechecks.scripts.filter(row => row.passed).length}/7 pass.
Cue tests pass 33/33. The full-library naming guard runs in both the complete
clinical suite and focused-close. Exact typecheck diagnostics follow.

\`\`\`text
${typechecks.diagnostics.join('\n') || 'All seven workspace typecheck scripts pass.'}
\`\`\`

${table(['Run', 'File', 'Failing test'], failures)}

Advisory lint reports ${packet.lint.accepted.findings} findings in
${packet.lint.accepted.variantsWithFindings} of 22 accepted variants, and
${packet.lint.wholeBank.findings} findings in ${packet.lint.wholeBank.variantsWithFindings}
of ${packet.lint.wholeBank.uniqueVariants} unique live variants. The eight
reviewed uniquely-longest keys are individually hash-bound. The full phrase
and field report is [the cue inventory](question-topic-acceptance-batch5-lint-20261111.json).

## Changed Level5 inputs and files

${table(['Changed bound input', 'Intake SHA-256', 'After SHA-256', 'Recorded SHA-256'], packet.levelFiveInputs.map(row => [row.path, row.beforeSha256, row.afterSha256, row.recordedSha256]))}

${table(['New runtime dependency', 'SHA-256'], packet.newUnboundClinicalRuntimeInputs.map(row => [row.path, row.sha256]))}

The three bound inputs were already unbound at intake. The manager owns the
dependency inventory, evidence rebind and release integration. Exact scoped
files, preimages/postimages and protected-source receipts are in
[the file receipt](question-topic-acceptance-batch5-files-20261111.json).
Every requested topic-source module, packet, ledger and review file retains
its captured hash. The test-only membership corrections are recorded above.

The shared handoff and ExecPlan record completion. This checkpoint is local
to the main working tree. The manager owns the backup gate and can request
the checkpoint with "push to GitHub".
`;
fs.writeFileSync(root + '-20261111.md', report);
console.log(JSON.stringify({accepted: packet.accepted.length, skipped: packet.skipped.length,
  finalRuns: Object.values(finalRuns).map(({label, passed, failed, skipped}) => ({label, passed, failed, skipped})),
  repairedBaselineTests: repairedBaselineTests.length, remainingTopicTests: remainingTopicTests.length,
  typechecks: typechecks.scripts.filter(row => row.passed).length, newCompatibility: 47}));
