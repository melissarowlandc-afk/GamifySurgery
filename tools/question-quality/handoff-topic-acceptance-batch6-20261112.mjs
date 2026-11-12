import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';

const root = 'docs/research/question-topic-acceptance-batch6';
const logs = '.local-dev/question-topic-acceptance-batch6-20261112';
const read = path => JSON.parse(fs.readFileSync(path, 'utf8').replace(/^\uFEFF/, ''));
const textFile = path => {
  const bytes = fs.readFileSync(path);
  return bytes[0] === 255 ? bytes.toString('utf16le').replace(/^\uFEFF/, '') : bytes.toString('utf8');
};
const cell = value => String(value ?? '').replaceAll('|', '\\|').replace(/\r?\n/g, ' ');
const table = (headers, rows) => ['| ' + headers.join(' | ') + ' |',
  '| ' + headers.map(() => '---').join(' | ') + ' |',
  ...rows.map(row => '| ' + row.map(cell).join(' | ') + ' |')].join('\n');
const packet = read(root + '-packet-20261112.json');
const migration = read('tools/question-quality/fixtures/question-topic-acceptance-batch6-source-migration-20261112.json');
const before = read('tools/question-quality/fixtures/question-topic-acceptance-batch6-before-20261112.json');

function result(label) {
  const report = read(logs + '/' + label + '.json');
  const log = textFile(logs + '/' + label + '.log');
  return {label, files: report.testResults.length, passed: report.numPassedTests,
    failed: report.numFailedTests, skipped: report.numPendingTests, total: report.numTotalTests,
    jsonPath: logs + '/' + label + '.json', logPath: logs + '/' + label + '.log',
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
const runs = Object.fromEntries(['clinical-final', 'domain-final', 'player-focused', 'focused-final'].map(label => [label, result(label)]));
const earlierRuns = ['focused-initial', 'clinical-before-manifest-assertion'].map(result);
const nativeExitCodes = read(logs + '/native-exits-final.json');
for (const [label, run] of Object.entries(runs)) run.nativeExitCode = nativeExitCodes[label];
const priorClinicalPath = '.local-dev/topic-runtime-bindings-batch5-20261112/clinical-failure-details.json';
const priorDomainPath = '.local-dev/topic-runtime-bindings-batch5-20261112/domain-failure-details.json';
const priorClinical = read(priorClinicalPath);
const priorDomain = read(priorDomainPath);
const priorClinicalTitles = new Set(priorClinical.map(row => row.title));
const additionalClinicalFailures = runs['clinical-final'].failures.filter(row => !priorClinicalTitles.has(row.title));
assert.equal(priorClinical.length, 8);
assert(priorClinical.every(row => runs['clinical-final'].failures.some(current => current.title === row.title)));
assert.deepEqual(additionalClinicalFailures.map(row => row.title).sort(), runs['focused-final'].failures.map(row => row.title).sort());
assert.deepEqual(runs['domain-final'].failures.map(row => row.title).sort(), priorDomain.map(row => row.title).sort());
const inheritedFailures = {
  priorClinical: {path: priorClinicalPath, sha256: createHash('sha256').update(fs.readFileSync(priorClinicalPath)).digest('hex'), count: priorClinical.length},
  priorDomain: {path: priorDomainPath, sha256: createHash('sha256').update(fs.readFileSync(priorDomainPath)).digest('hex'), count: priorDomain.length},
  additionalClinicalAtIntake: additionalClinicalFailures.map(row => row.title),
  retainedDomainEvidenceFailures: runs['domain-final'].failures.filter(row => row.file.endsWith('/level-five-integration.test.ts')).length,
  retainedDomainConceptCensusFailures: runs['domain-final'].failures.filter(row => row.file.endsWith('/approved-clinical-admission.test.ts')).length,
};
const typeLog = textFile(logs + '/typecheck-final.log').replace(/\r\n/g, '\n');
const headers = [...typeLog.matchAll(/^> (@.*) typecheck$/gm)];
assert.equal(headers.length, 7);
const typechecks = {command: 'npm.cmd run typecheck', logPath: logs + '/typecheck-final.log',
  scripts: headers.map((header, index) => ({workspace: header[1],
    passed: !/: error TS\d+/.test(typeLog.slice(header.index, headers[index + 1]?.index ?? typeLog.length))})),
  diagnostics: typeLog.split('\n').filter(line => /: error TS\d+/.test(line))};
const cueLog = textFile(logs + '/lint-tests-final.log');
assert.match(cueLog, /pass 33/);
assert.match(cueLog, /fail 0/);
const playerNativeExit = read(logs + '/player-exit.json');
assert.equal(playerNativeExit.nativeExitCode, 0);
const ownPlayer = runs['player-focused'].perFile.find(row => row.file.endsWith('/questionProgramBatch6SaveCompatibility.test.ts'));
assert.equal(ownPlayer.passed, 8);
assert.equal(ownPlayer.failed, 0);

const oldBefore = read('tools/question-quality/fixtures/question-topic-acceptance-batch5-before-20261111.json');
const oldMigration = read('tools/question-quality/fixtures/question-topic-acceptance-batch5-source-migration-20261111.json');
const childSource = before.topics[0].sourcePath;
const venousTest = 'packages/clinical-content/src/question-topic-vascular-venous-lymphatic-access-20261111.test.ts';
const intakeGuardDrift = [
  {path: childSource, recordedBatch5Sha256: oldBefore.topics.find(topic => topic.sourcePath === childSource).sourceSha256,
    intakeSha256: before.topics[0].sourceSha256},
  {path: venousTest, recordedBatch5Sha256: oldMigration.files.find(row => row.path === venousTest).afterSha256,
    intakeSha256: before.observed[venousTest]},
];
assert(intakeGuardDrift.every(row => row.recordedBatch5Sha256 !== row.intakeSha256));
assert.equal(typechecks.diagnostics.length, 0);
const validation = {checkedOn: '2026-11-12', runs, earlierRuns, typechecks, intakeGuardDrift, inheritedFailures, nativeExitCodes,
  cueTests: {passed: 33, failed: 0, command: 'node --test --test-isolation=none tools/question-quality/lint.test.mjs'},
  newCompatibility: {passed: 8, failed: 0, freshAdmissionsAndFormat3Completion: 4,
    retiredSnapshotCompletion: 2, retiredJournalCompletion: 2},
  playerNativeExitCode: playerNativeExit.nativeExitCode,
  playerPreload: 'tools/question-quality/adversarial-r5-player-preload-20261102.cjs',
  environment: {CI: '1', NODE_NO_WARNINGS: '1', GS028_LEVEL3_EVIDENCE_DIR: null},
  commands: [
    {cwd: 'packages/clinical-content', command: 'npm.cmd test -- --pool=threads --maxWorkers=2 --reporter=default --reporter=json --outputFile=../../.local-dev/question-topic-acceptance-batch6-20261112/clinical-final.json'},
    {cwd: 'packages/game-domain', command: 'npm.cmd test -- --pool=threads --maxWorkers=2 --reporter=default --reporter=json --outputFile=../../.local-dev/question-topic-acceptance-batch6-20261112/domain-final.json'},
    {cwd: 'apps/player', command: 'npm.cmd test -- src/questionProgramBatch6SaveCompatibility.test.ts src/questionShipSaveCompatibility.test.ts src/session/cloud/separateCampaign.test.ts src/session/flagFreeze.test.tsx --pool=threads --maxWorkers=2 --reporter=default --reporter=json --outputFile=../../.local-dev/question-topic-acceptance-batch6-20261112/player-focused.json', nativeExitCode: 0},
    {cwd: 'packages/clinical-content', command: 'npm.cmd test -- src/question-program-batch6-acceptance-20261112.test.ts src/question-program-batch5-acceptance-20261111.test.ts src/question-ship-manifest.test.ts src/answer-choice-timing.test.ts src/patient-library-wording-repair.test.ts src/question-topic-pediatric-neck-thoracic-gu-20261111.test.ts src/question-topic-wound-healing-immunology-20261111.test.ts src/question-new-n4-20261110.test.ts src/question-new-n4-round2-20261110.test.ts --pool=threads --maxWorkers=2 --reporter=default --reporter=json --outputFile=../../.local-dev/question-topic-acceptance-batch6-20261112/focused-final.json'},
    {cwd: '.', command: 'npm.cmd run typecheck'},
    {cwd: '.', command: 'node --test --test-isolation=none tools/question-quality/lint.test.mjs'},
  ]};
fs.writeFileSync(root + '-validation-20261112.json', JSON.stringify(validation, null, 2) + '\n');

const failures = Object.values(runs).flatMap(run => run.failures.map(failure => [run.label,
  failure.file.replace(/^.*\/packages\//, 'packages/').replace(/^.*\/apps\//, 'apps/'), failure.title]));
const report = `# Topic program acceptance batch 6 - 2026-11-12

Accepted **all four requested salvage PASS nodes as four complete cases**.
There are **zero requested-node skips**. Every accepted question and family
record remains **needs_clinician_review**. Manifest \`${packet.manifestId}\`
has **690 authority rows**. The default contains **1340 cases, 1535 nodes,
1039 registered meanings and 844 scored meanings**.

[The acceptance packet](question-topic-acceptance-batch6-packet-20261112.json)
contains exact source/review/claim records, node and question hashes, current
clinical contexts, runtime probes, family bindings and cue findings. Keys are
shown first for review only. Runtime choices shuffle.

## Accepted identities

${table(['Node', 'Accepted standalone case', 'Question variant', 'Concept'], packet.accepted.map(row => [row.nodeId, row.caseId, row.questionVariantId, row.conceptId]))}

Each accepted record has a PASS verdict in
docs/research/question-topic-pediatric-neck-thoracic-gu-review-salvage-20261111.json.
The negative-exploration and pyogenic-drainage identities are excluded under
the manager's decision. Their salvage verdicts remain REVISE and they have
zero acceptance rows. Each accepted case contains exactly one scored node.

## Frozen source and presentation corrections

[The source archive](question-topic-acceptance-batch6-source-freeze-20261112.json)
retains all four original reviewed node/question serializations and original
source-file hashes. Serialized object order matches all four runtime records.
The accepted source-view hash is recorded below.

Six exact patient-name substitutions affect three accepted cases. The
[presentation correction ledger](../../tools/question-quality/fixtures/question-topic-acceptance-batch6-literal-name-corrections-20261112.json)
binds every original/revised string and its source hash. Fixed ages, sex,
pronouns, options, keys and explanation meaning retain their reviewed values.
The family records bind each named child, selected profile, child art and
named parent to the real runtime chart.

## Pediatric admission and family bindings

All four cases pass native admission with their prospective timing and family
metadata installed. They use an operational Pediatric Examination Room, a
single compatible child profile and one parent. The CDH visit uses the reviewed
current six-year-old child profile while its question concerns neonatal ICU
records. The chart-review chronology remains explicit in the source context.

The clinical package's public family registry now composes the original 20
families with four exact manifest-accepted family records. Index exports expose
that registry to the existing pediatric admission functions. The original
20 family objects retain exact serialized values. The topic preview test now
uses the public registry and verifies exact later acceptance membership.

${table(['Case', 'Profile', 'Child', 'Age / sex', 'Child art', 'Parent'], packet.familyContexts.map(row => [row.caseId, row.profileId, row.childName, row.prototypeDemographics.ageYears + ' / ' + row.prototypeDemographics.sexLabel, row.childStillId, row.parentName + ' (' + row.parentRelationship + ')']))}

${table(['Family registry', 'Count', 'SHA-256'], [['Before', packet.familyRegistry.beforeCount, packet.familyRegistry.beforeSha256], ['After', packet.familyRegistry.afterCount, packet.familyRegistry.afterSha256]])}

## Runtime wait bindings

**Current test-order/wait-binding count is zero.** Each accepted source timing
row is no_test. These decisions review outside care. Their options have no
service requests and their nodes have no result gate. Real admission and
completion create zero service operations. All four timing rows are installed.

${table(['Accepted node', 'Current classification', 'Runtime wait bindings needed'], packet.accepted.map(row => [row.nodeId, row.runtime.timing.classification.kind, '0']))}

Eight option labels describe outside investigations or biopsy plans. The
source author's proposed profiles are retained below with their exact node
and choice identities for future planning-preview work. The original proposals
identify the earlier main-case contexts. The packet records both those source
proposals and their matching accepted standalone case IDs.

${table(['Node', 'Accepted case', 'Choice', 'Outside-record label', 'Authored proposed profile'], packet.outsideRecordTestingChoices.map(row => [row.nodeId, row.caseId, row.choiceId, row.choiceLabel, row.proposedProfileId]))}

## Projection and frozen-save compatibility

Two ordinary whole-case replacements retire
case.pediatric-clinic.growing-firm-neck-node and
case.pediatric-clinic.retractile-testis-remains-scrotal from fresh selection.
The original 1035 meaning definitions and 686 authority rows pass exact
preservation checks. Four source-declared meaning versions are added. Every
other prior default case is hash-bound to its original serialization.

All **eight new compatibility tests pass**. Four verify default admission,
canonical child/parent/art, format-3 reopening and complete FSRS scoring. Two
verify retired snapshot reopening/completion and two verify committed original
admission-journal replay/completion. Original question and concept identities,
existing reviews and frozen fields remain checked. Existing budgets remain.

${table(['Retired case', 'Original question', 'Original SHA-256'], packet.retained.map(row => [row.caseId, row.nodes.map(node => node.questionVariantId).join(', '), row.sha256]))}

## Counts and hashes

${table(['Measure', 'Before', 'After'], Object.keys(packet.counts.before).map(key => [key, packet.counts.before[key], packet.counts.after[key]]))}

${table(['Artifact', 'SHA-256'], [['Default release', packet.hashes.defaultAfter], ['Manifest', packet.hashes.manifestAfter], ['Authoring catalog', packet.hashes.catalogAfter]])}

${table(['Accepted source view', 'Cases', 'Nodes', 'SHA-256'], packet.sourceViews.map(row => [row.name, row.cases, row.nodes, row.sha256]))}

The packet reuses ${packet.claims.length} existing atomic claims and
${packet.sources.length} source records from the topic's source ledger,
including full citations, URLs, reuse status and claim links. This integration
adds no clinical facts or external-source records.

## Validation and remaining guards

Vitest runs use npm.cmd with --pool=threads --maxWorkers=2. Player tests use
the existing Windows preload and an explicit native exit capture. Full output,
commands and every failure message are recorded in
[the validation receipt](question-topic-acceptance-batch6-validation-20261112.json)
and ${logs}/.

${table(['Run', 'Files', 'Pass', 'Fail', 'Skip', 'Duration'], Object.values(runs).map(run => [run.label, run.files, run.passed, run.failed, run.skipped, run.durationLine]))}

The final clinical run retains all eight failure titles from the previous
runtime-binding validation plus the two source pins already mismatched at
this task's intake. The domain run retains the same 27 failure titles,
comprising 26 Level5 evidence/input bindings and the legacy 587-meaning census.
The census currently observes 1039 meanings. Manager reconciliation remains
pending for these retained guards. Native exits are recorded for each run.

Workspace typechecks pass ${typechecks.scripts.filter(row => row.passed).length}/7.
Cue tests pass 33/33. The complete naming guard passes in focused and full
clinical runs. The initial focused run includes two earlier batch5 source-pin
mismatches. Their observed hashes already differed at this task's intake.

Two narrow topic-test corrections bind pediatric membership to exact accepted
authority and make the wound-healing manifest-source assertion use the complete
exported current identity. Its earlier date-only assertion expired with v15.
The receipt retains the first full run and the final rerun after this repair.

The eight outside-record wait-profile proposals remain pending domain review.
The accepted source's no_test classification and zero service operations are
covered by all four real pediatric admission/completion tests.

${table(['Input with pre-existing guard mismatch', 'Recorded batch5 SHA-256', 'This task intake SHA-256'], intakeGuardDrift.map(row => [row.path, row.recordedBatch5Sha256, row.intakeSha256]))}

The old batch5 guard chain validates this acceptance's exact projection,
manifest, timing and source deltas before restoring historical contexts. The
four additional family records are separately hash-bound. Existing clinical,
source, ownership and approval assertions remain in place.

${table(['Run', 'File', 'Failing test'], failures)}

Advisory cue lint reports ${packet.lint.accepted.findings} findings across
${packet.lint.accepted.variantsWithFindings} of ${packet.lint.accepted.uniqueVariants} accepted variants. Whole-bank
lint reports ${packet.lint.wholeBank.findings} findings across
${packet.lint.wholeBank.variantsWithFindings} of ${packet.lint.wholeBank.uniqueVariants}
unique variants. [The cue inventory](question-topic-acceptance-batch6-lint-20261112.json)
retains exact phrases and fields.

## Level5 inputs and files

${table(['Changed bound input', 'Intake SHA-256', 'After SHA-256', 'Recorded SHA-256'], packet.levelFiveInputs.map(row => [row.path, row.beforeSha256, row.afterSha256, row.recordedSha256]))}

${table(['New runtime dependency', 'SHA-256'], packet.newUnboundClinicalRuntimeInputs.map(row => [row.path, row.sha256]))}

The manager owns the dependency inventory, evidence rebind and release
integration. Exact existing-source preimages/postimages, new files and the
protected-topic receipt are recorded in
[the scoped file receipt](question-topic-acceptance-batch6-files-20261112.json).
The ExecPlan and append-only shared handoff record this bounded milestone.
This checkpoint is local to the main working tree. The manager owns the
backup gate and can request the checkpoint with "push to GitHub".
`;
fs.writeFileSync(root + '-20261112.md', report);
console.log(JSON.stringify({accepted: packet.accepted.length, skipped: packet.skipped.length,
  runs: Object.values(runs).map(({label, passed, failed, skipped}) => ({label, passed, failed, skipped})),
  typechecks: typechecks.scripts.filter(row => row.passed).length, newCompatibility: 8}));
