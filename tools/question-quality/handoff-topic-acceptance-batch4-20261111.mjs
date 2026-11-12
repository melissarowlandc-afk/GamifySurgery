import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';

const root = 'docs/research/question-topic-acceptance-batch4';
const logs = '.local-dev/question-topic-acceptance-batch4-20261111';
const read = path => JSON.parse(fs.readFileSync(path, 'utf8'));
const hash = value => createHash('sha256').update(value).digest('hex');
const raw = path => hash(fs.readFileSync(path));
const textFile = path => {
  const bytes = fs.readFileSync(path);
  return bytes[0] === 255 ? bytes.toString('utf16le').replace(/^\uFEFF/, '') : bytes.toString('utf8');
};
const cell = value => String(value ?? '').replaceAll('|', '\\|').replace(/\r?\n/g, ' ');
const table = (headers, rows) => [
  '| ' + headers.join(' | ') + ' |', '| ' + headers.map(() => '---').join(' | ') + ' |',
  ...rows.map(row => '| ' + row.map(cell).join(' | ') + ' |'),
].join('\n');
const packet = read(root + '-packet-20261111.json');
const before = read('tools/question-quality/fixtures/question-topic-acceptance-batch4-before-20261111.json');
const selection = read('tools/question-quality/fixtures/question-topic-acceptance-batch4-selection-20261111.json');
const migration = read('tools/question-quality/fixtures/question-topic-acceptance-batch4-source-migration-20261111.json');

function run(label) {
  const result = read(logs + '/' + label + '.json');
  const log = textFile(logs + '/' + label + '.log');
  return {
    label, logPath: logs + '/' + label + '.log', jsonPath: logs + '/' + label + '.json',
    files: result.testResults.length, passed: result.numPassedTests, failed: result.numFailedTests,
    skipped: result.numPendingTests, total: result.numTotalTests,
    durationLine: log.split(/\r?\n/).find(line => /^\s*Duration\s/.test(line))?.trim(),
    commandLine: log.split(/\r?\n/).find(line => line.startsWith('> vitest run')),
    failures: result.testResults.flatMap(file => file.assertionResults.filter(test => test.status === 'failed')
      .map(test => ({file: file.name, title: test.fullName, messages: test.failureMessages}))),
    collectionFailures: result.testResults.filter(file => file.status === 'failed' && !file.assertionResults.length)
      .map(file => ({file: file.name, message: file.message})),
    perFile: result.testResults.map(file => ({file: file.name,
      passed: file.assertionResults.filter(test => test.status === 'passed').length,
      failed: file.assertionResults.filter(test => test.status === 'failed').length})),
  };
}

const finalRuns = Object.fromEntries(['clinical-final', 'domain-final', 'player-final', 'focused-final', 'domain-historical-final']
  .map(label => [label, run(label)]));
const typeLog = textFile(logs + '/typecheck-close.log');
const diagnostics = typeLog.split(/\r?\n/).filter(line => /: error TS\d+/.test(line));
const typechecks = {
  command: 'npm.cmd run typecheck', path: logs + '/typecheck-close.log',
  workspaceScripts: typeLog.split(/\r?\n/).filter(line => /^> @.* typecheck$/.test(line)),
  diagnostics, ownedDiagnostics: diagnostics.filter(line => line.includes('question-program-batch4') || line.includes('questionProgramBatch4')),
};
assert.equal(typechecks.workspaceScripts.length, 7);
assert.deepEqual(typechecks.ownedDiagnostics, []);
const scriptText = typeLog.replace(/\r\n/g, '\n');
const scriptHeaders = [...scriptText.matchAll(/^> (@.*) typecheck$/gm)];
assert.equal(scriptHeaders.length, 7);
typechecks.scripts = scriptHeaders.map((header, index) => {
  const segment = scriptText.slice(header.index, scriptHeaders[index + 1]?.index ?? scriptText.length);
  return {workspace: header[1], passed: !/: error TS\d+/.test(segment)};
});
typechecks.passedScripts = typechecks.scripts.filter(script => script.passed).length;
const lintText = textFile(logs + '/lint-tests-final.log');
assert.match(lintText, /pass 33/);
assert.match(lintText, /fail 0/);
const player = finalRuns['player-final'];
const ownPlayer = player.perFile.filter(file => /questionProgramBatch4(?:SaveCompatibility|StaffAdmission)\.test\.ts$/.test(file.file));
assert.equal(ownPlayer.reduce((sum, file) => sum + file.passed, 0), 596);
assert(ownPlayer.every(file => file.failed === 0));
const validation = {
  checkedOn: '2026-11-11', finalRuns, typechecks,
  lintTests: {passed: 33, failed: 0, command: 'node --test --test-isolation=none tools/question-quality/lint.test.mjs'},
  newCompatibility: {passed: 596, failed: 0, patientAdmissions: 249, employeeAdmissions: 3,
    retiredPatientSnapshots: 170, retiredPatientJournals: 170, retiredStaffSnapshots: 2, retiredStaffJournals: 2},
  playerPreload: 'tools/question-quality/adversarial-r5-player-preload-20261102.cjs',
};
fs.writeFileSync(root + '-validation-20261111.json', JSON.stringify(validation, null, 2) + '\n');

const topicRows = before.topics.map(topic => {
  const accepted = packet.accepted.filter(item => item.sourceView === 'topic-batch4-' + topic.config.slug);
  return [topic.config.slug + (topic.config.salvage ? ' (salvage)' : ''), topic.requested.length,
    accepted.length, new Set(accepted.map(item => item.caseId)).size];
});
const failureRows = Object.values(finalRuns).flatMap(result => result.failures.map(failure => [result.label,
  failure.file.replace(/^.*\/packages\//, 'packages/').replace(/^.*\/apps\//, 'apps/'), failure.title]));
const limitedClaims = packet.claims.filter(claim => claim.certainty === 'limited').map(claim => claim.id);
const report = `# Topic program acceptance batch 4 - 2026-11-11

Accepted **260 exact PASS nodes in 252 complete cases** from the 271 requested
identities. Eleven requested nodes are skipped. All accepted questions remain
**needs_clinician_review**. The default contains **1330 cases, 1530 nodes,
1019 registered meanings and 824 scored meanings**. Manifest
\`${packet.manifestId}\` has **664 authority rows**.

[The acceptance packet](question-topic-acceptance-batch4-packet-20261111.json)
contains exact review records, source hashes, claim/source mappings, clinical
contexts, runtime probes and all diagnostic tuples. Keys are shown first for
review only. Runtime choices shuffle. [The raw source archive](question-topic-acceptance-batch4-source-freeze-20261111.json)
retains all 260 original reviewed node/question serializations, with 57 schema
object-key order normalizations recorded separately.

## Topic disposition

${table(['Topic', 'Requested nodes', 'Accepted nodes', 'Accepted cases'], topicRows)}

## Exact accepted identities

${table(['Node', 'Case', 'Question variant', 'Concept'], packet.accepted.map(item => [item.nodeId, item.caseId, item.questionVariantId, item.conceptId]))}

## Skipped identities

${table(['Requested node', 'Reason', 'Unlisted scored siblings'], packet.skipped.map(item => [item.nodeId, item.reason, item.unlistedSiblingIds.join(', ')]))}

Four skips have unlisted scored siblings. Six pediatric cases fail the current
runtime requirement for compatible explicit pediatric demographics and child
art. The exact requested recurrent-clearance-test.v2 has no salvage PASS.
Its salvage review instead passes node.topic.esophagus-motility-achalasia.recurrent-clearance-test.v3.
The v3 identity requires a later manager acceptance decision.

The source packet retains an earlier composition hold on the paired
salvage-before-resection context. The accepted standalone context has its own
PASS salvage review and complete terminal dispositions. Keyed source holds
were absent in the selected contexts.

## Frozen source and presentation corrections

The accepted copies record **112 exact name-only substitutions in 30 cases**.
[The correction ledger](../../tools/question-quality/fixtures/question-topic-acceptance-batch4-literal-name-corrections-20261111.json)
binds every original and revised field. The regression checks presentation,
task, current update, option feedback, explanation and outcome copies for
literal authored patient names. Fixed demographic profiles supply matching
ages, sex nouns and pronouns. Stable question/concept identities pass their
original comparisons.

One accepted timing classification is reordered to match its frozen runtime
option order. Two all-action rows are represented as no_test after proving
every original choice was already no_test. Every original choice timing value
is retained and checked. These metadata adjustments are recorded in the
dispositions and packet. The exact reviewed clinical fields remain bound by
the source archive and the explicit name substitutions.

Two authored claim records use the certainty label limited. Their archived
typing preserves that existing source metadata. Their IDs are
${limitedClaims.map(id => '\`' + id + '\`').join(', ')}.

## Projection and compatibility

There are 23 new ordinary replacements and 36 explicit topic consolidations.
They retire **172 prior cases containing 244 scored nodes**. Each retired
identity appears once, with every declared successor recorded. The original
813 meaning definitions and 404 authority rows pass exact preservation checks.

All **596 new compatibility checks pass**. These cover 249 patient admissions,
three employee-discussion admissions, and snapshot/journal completion for all
170 retired patient cases and two retired staff-discussion cases. Real clinic
commands, format-3 saves, the journal codec and FSRS scoring are exercised.
The two-node portal review exercises both scored decisions. Timers and timeout budgets
retain their original values.

Historical clinical, geometry, peri-op and statistics fixtures use the verified
pre-batch4 cases through strict source reconstruction. The diagnostic-contract
test includes the explicitly retained batch4 cases. The old held-FNA cue
regression now verifies its retained version and the explicit consolidation.
The reviewed specimen-label story has an exact sentence and whole-case hash
binding for its background reference to labels from several patients.

${table(['Retired case', 'Original nodes', 'SHA-256'], packet.retained.map(item => [item.caseId, item.nodes.map(node => node.id).join(', '), item.sha256]))}

## Runtime bindings

All 249 patient cases admit in an existing clinic and match the current APP
consult line. Their procedure-consult classifier returns null. The three
quality-discussion cases use the existing surgeon discussion route and a real
Surgeon's Office. All 260 timing classifications are installed.

The domain worker must install **292 exact diagnostic-choice records** from
\`QUESTION_PROGRAM_BATCH4_ACCEPTED_TEST_ORDER_RECORDS\` in
packages/game-domain/src/test-choice-orders.ts. Their explicit disposition is
not_executed/future_planned. The active inventory and future-batch binding
guards expose these pending records.

${table(['Case', 'Node', 'Variant', 'Choice', 'Label', 'Timing profile'], packet.pendingRuntimeOrders.map(item => [item.caseId, item.nodeId, item.questionVariantId, item.choiceId, item.choiceLabel, item.timingProfileId]))}

## Counts and hashes

${table(['Measure', 'Before', 'After'], Object.keys(packet.counts.before).map(key => [key, packet.counts.before[key], packet.counts.after[key]]))}

${table(['Artifact', 'SHA-256'], [['Default release', packet.hashes.defaultAfter], ['Manifest', packet.hashes.manifestAfter], ['Authoring catalog', packet.hashes.catalogAfter]])}

${table(['Accepted source view', 'Cases', 'Nodes', 'SHA-256'], packet.sourceViews.map(item => [item.name, item.cases, item.nodes, item.sha256]))}

## Validation

All Vitest commands use npm.cmd with --pool=threads --maxWorkers=2. Player
tests use the existing Windows probe preload. The linter uses Node's
--test-isolation=none because the sandbox rejects child-process spawning.
[Exact results and failures](question-topic-acceptance-batch4-validation-20261111.json)
accompany the complete logs under ${logs}/.

${table(['Run', 'Files', 'Pass', 'Fail', 'Skip', 'Duration'], Object.values(finalRuns).map(result => [result.label, result.files, result.passed, result.failed, result.skipped, result.durationLine]))}

Cue tests pass 33/33. The full-library naming guard passes within the focused
clinical run. Workspace typechecks pass ${typechecks.passedScripts}/7 scripts, with the diagnostics
below. The complete typecheck output is typecheck-close.log.

\`\`\`text
${diagnostics.join('\n') || 'All seven workspace typecheck scripts pass.'}
\`\`\`

The remaining clinical failures concern topic-owned pre-acceptance assertions
or historical source pins. Four protected-source failures concern
app-appointments.ts, test-choice-orders.ts and codecJson.ts. The domain's
retained evidence/input checks, legacy meaning census and pending diagnostic
bindings are listed by exact title below. The focused cloud suite retains its
codec string-limit failure. Counts include these failures.

${table(['Run', 'File', 'Failing test'], failureRows)}

## Advisory cue inventory

Accepted variants have ${packet.lint.accepted.findings} findings across ${packet.lint.accepted.variantsWithFindings}
of 260 variants. Whole-bank lint reports ${packet.lint.wholeBank.findings} findings across
${packet.lint.wholeBank.variantsWithFindings} of ${packet.lint.wholeBank.uniqueVariants} unique variants.
The exact 81 uniquely-longest-key residuals are bound to their reviewed cases.
[The lint report](question-topic-acceptance-batch4-lint-20261111.json) retains each phrase and field.

## Level5 inputs and files

${table(['Changed bound input', 'Intake SHA-256', 'After SHA-256', 'Recorded SHA-256'], packet.levelFiveInputs.map(item => [item.path, item.beforeSha256, item.afterSha256, item.recordedSha256]))}

${table(['New runtime dependency', 'SHA-256'], packet.newUnboundClinicalRuntimeInputs.map(item => [item.path, item.sha256]))}

The manager owns the dependency inventory, evidence rebind and release port.
Scoped existing-source preimages and postimages are recorded below.

${table(['Existing file', 'Before SHA-256', 'After SHA-256'], migration.files.map(item => [item.path, item.beforeSha256, item.afterSha256]))}

New accepted archive, wrapper, test support, clinical/player tests, tooling,
fixtures and research records are enumerated with hashes in
[the file receipt](question-topic-acceptance-batch4-files-20261111.json).
All requested topic-source, packet, ledger and review hashes are included in
the acceptance packet. Observed concurrent changes have their own receipt
entries. The shared thread handoff records this bounded milestone.

This checkpoint is local to the working tree. The manager owns the backup
gate and can request it with "push to GitHub".
`;
fs.writeFileSync(root + '-20261111.md', report);
console.log(JSON.stringify({accepted: packet.accepted.length, skipped: packet.skipped.length,
  finalRuns: Object.values(finalRuns).map(({label, passed, failed, skipped}) => ({label, passed, failed, skipped})),
  newCompatibility: validation.newCompatibility, typeDiagnostics: diagnostics.length}));
