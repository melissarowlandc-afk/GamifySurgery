import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const directory = '.local-dev/question-topic-acceptance-batch2-20261111/';
const read = path => JSON.parse(fs.readFileSync(path, 'utf8'));
const hash = value => createHash('sha256').update(value).digest('hex');
const packet = read('docs/research/question-topic-acceptance-batch2-packet-20261111.json');
function logText(path) {
  const bytes = fs.readFileSync(path);
  return bytes[0] === 255 ? bytes.toString('utf16le').replace(/^\uFEFF/, '') : bytes.toString('utf8');
}
function testResult(name) {
  const path = directory + name + '.json';
  assert(fs.existsSync(path), 'Finish validation ' + name);
  const result = read(path);
  const log = logText(directory + name + '.log');
  return {
    name, total:result.numTotalTests, passed:result.numPassedTests, failed:result.numFailedTests,
    skipped:result.numPendingTests, files:result.testResults.length,
    failedFiles:result.testResults.filter(file => file.status === 'failed').length,
    duration:log.match(/Duration\s+([^\r\n]+)/)?.[1] ?? null,
    command:log.split('\n').find(line => line.startsWith('> vitest run'))?.trim(),
    reportSha256:hash(fs.readFileSync(path)),
    failures:result.testResults.flatMap(file => file.assertionResults.filter(test => test.status === 'failed').map(test => ({
      file:file.name.replaceAll('\\', '/').replace(/^.*\/GamifySurgery\//, ''), title:test.fullName, messages:test.failureMessages,
    }))),
    failedSuites:result.testResults.filter(file => file.status === 'failed' && !file.assertionResults.some(test => test.status === 'failed'))
      .map(file => ({file:file.name, message:file.message})),
  };
}
const runs = ['clinical-focused', 'clinical-full', 'clinical-focused-final', 'clinical-final',
  'domain-full', 'domain-retired-focused', 'domain-final', 'player-focused', 'player-final'].map(testResult);
const types = logText(directory + 'typecheck-final.log');
const typeErrors = types.split('\n').filter(line => /error TS\d+/.test(line));
const lint = logText(directory + 'lint-tests.log');
const validation = {
  checkedOn:'2026-11-11', runs,
  typechecks:{command:'npm.cmd run typecheck at repository root', workspaces:7, success:typeErrors.length === 0,
    errors:typeErrors, logSha256:hash(fs.readFileSync(directory + 'typecheck-final.log'))},
  lintTests:{command:'npm.cmd run clinical:lint:test with NODE_NO_WARNINGS=1',
    passed:Number(lint.match(/pass\s+(\d+)/)?.[1]), failed:Number(lint.match(/fail\s+(\d+)/)?.[1]),
    durationMs:Number(lint.match(/duration_ms\s+([^\r\n]+)/)?.[1]), logSha256:hash(fs.readFileSync(directory + 'lint-tests.log'))},
  playerPreload:'tools/question-quality/adversarial-r5-player-preload-20261102.cjs supplies the optional Vite Windows drive probe. Codec, journal, scoring and duration limits use real implementations.',
};
fs.writeFileSync('docs/research/question-topic-acceptance-batch2-validation-20261111.json', JSON.stringify(validation, null, 2) + '\n');
const code = value => String.fromCharCode(96) + value + String.fromCharCode(96);
const cell = value => String(value ?? 'none').replaceAll('|', '\\|').replaceAll('\n', ' ');
const table = (headers, records) => [
  '| ' + headers.join(' | ') + ' |', '| ' + headers.map(() => '---').join(' | ') + ' |',
  ...records.map(record => '| ' + record.map(cell).join(' | ') + ' |'),
].join('\n');
const acceptedTable = table(['Exact accepted node', 'Variant', 'Case', 'Meaning', 'Pending runtime records'], packet.accepted.map(item => [
  code(item.nodeId), code(item.questionVariantId), code(item.caseId), code(item.conceptId),
  item.runtime.testChoiceOrdersNeeded.length + ' diagnostic tuples, timing installed, APP affinity available',
]));
const skippedTable = table(['Requested node', 'Retained reviewed case', 'Unlisted scored siblings'], packet.skipped.map(item => [
  code(item.nodeId), item.contexts.map(context => code(context.caseId)).join('<br>'), item.unlistedSiblingIds.map(code).join('<br>'),
]));
const retiredTable = table(['Retired fresh case', 'Original variants and meanings'], packet.retained.map(item => [
  code(item.caseId), item.nodes.map(node => code(node.questionVariantId) + '<br>' + code(node.conceptId)).join('<br>'),
]));
const orderTable = table(['Case, node and variant', 'Choice ID and exact label', 'Timing profile'], packet.pendingRuntimeOrders.map(order => [
  [order.caseId, order.nodeId, order.questionVariantId].map(code).join('<br>'), code(order.choiceId) + '<br>' + order.choiceLabel, code(order.timingProfileId),
]));
const finalNames = ['clinical-focused-final', 'clinical-final', 'domain-retired-focused', 'domain-final', 'player-final'];
const finalRuns = runs.filter(run => finalNames.includes(run.name));
const validationTable = table(['Run', 'Files passed / failed', 'Tests passed / failed / skipped', 'Duration'], [
  ...finalRuns.map(run => [run.name, `${run.files-run.failedFiles} / ${run.failedFiles}`, `${run.passed} / ${run.failed} / ${run.skipped}`, run.duration]),
  ['Root typechecks', '7 workspaces', validation.typechecks.success ? '7 pass / 0 fail' : 'See exact errors', 'see log'],
  ['Cue linter tests', '1 tool', `${validation.lintTests.passed} / ${validation.lintTests.failed} / 0`, validation.lintTests.durationMs + ' ms'],
]);
const failures = finalRuns.flatMap(run => run.failures.map(failure =>
  '- ' + code(run.name) + ' ' + code(failure.file) + ' — ' + failure.title + '. ' + (failure.messages[0]?.split('\n')[0] ?? '')
)).join('\n');
const boundTable = table(['Changed Level5 bound input', 'Intake SHA-256', 'After SHA-256'], packet.levelFiveInputs.map(input => [
  code(input.path), code(input.beforeSha256), code(input.afterSha256),
]));
const counts = table(['Measure', 'Before', 'After'], Object.keys(packet.counts.before).map(key => [key, packet.counts.before[key], packet.counts.after[key]]));
const sections = [
  '# Topic program acceptance batch 2 — 2026-11-11',
  'Accepted **26 exact PASS nodes in 20 complete cases** from the manager’s 43-node list. The remaining **17 nodes are skipped** because their reviewed cases include unlisted scored siblings. Every new question remains **needs_clinician_review**.',
  'The acceptance binds four static source views. The packet records each latest independent review, full source hashes, clinical claims, source records, exact source nodes and current clinic admission. Keys appear first only in the review packet. Runtime choices shuffle. [Packet](question-topic-acceptance-batch2-packet-20261111.json)',
  '## Accepted nodes',
  acceptedTable,
  'The topic totals are thoracic trauma 7 of 8 requested nodes, vascular aorta 10 of 19, liver malignancy 4 of 4 and pancreas 5 of 12. All 20 accepted cases admit through the current default release in an existing Level4 QA clinic with a real Examination Room placed through ordinary commands.',
  '## Skipped nodes and exact siblings',
  skippedTable,
  'The skipped vascular and pancreatic PASS versions retain their full original presentations and earlier feedback. Several occur only in retained earlier contexts. A revised neighbor’s similar objective or later PASS does not place that new version into an earlier reviewed case. Each candidate above stays available to its topic worker for salvage under a later decision.',
  '## Whole-case replacement and consolidation',
  'Six ordinary replacement relations and one explicit topic-program consolidation retire 13 fresh cases containing 17 original scored nodes. The BCI consolidation names all seven retired cases and one exact accepted two-node target in ' + code('topicConsolidations') + '. The manifest stores its program, stable group ID and manager decision. Each scored target node has its own exact acceptance row.',
  'The resolver validates the complete group before adding any replacement. Missing references, repeated aliases, unaccepted nodes, wrong headers, missing views, missing decision metadata, duplicate group IDs and conflicts preserve every affected legacy case. The projector admits each validated replacement case once. Ordinary duplicate replacement rows still fail validation. Twelve new projection tests cover the accepted group and ten malformed/conflicting configurations.',
  'This mechanism supports the later appendix four-to-one integration. Its exact acceptance belongs to that later manager decision. The current authority rows contain the four requested topics.',
  retiredTable,
  'All 631 earlier registered meanings and their definitions are retained. The source declares 23 new meaning identities. The ECG/troponin-screening meaning ' + code('concept.blunt-cardiac-injury.ecg-troponin-evaluation') + ' has its last fresh variants replaced by the new interpretation/assessment objectives. Its stored history and all original frozen questions remain available. The three shared existing meanings keep their current registry definitions and FSRS histories.',
  '## Projection adaptations and provenance',
  'Every scored stem, update, exhibit, option, explanation, question ID and meaning ID matches the captured independently reviewed version. The runtime learning summary uses the projector’s existing joined-explanation rule.',
  'One facility-stage adaptation was necessary. ' + code('case.vascular-aorta.screening-review.v2') + ' changes from entry stage 0 to stage 1 because its stable existing AAA-screening meaning is already registered at stage 1. The original case-local preview used a stage-0 concept proposal. The final probe uses the full current registry and confirms admission at the inherited floor. Clinical wording and educational-tier metadata retain their source values.',
  'The archive retains 72 existing independently authored atomic claims and 24 source records with their bibliographic, access, licence/reuse and authority metadata. Each accepted question’s claim mappings are preserved. Current source-view and question hashes are in the packet. Clinical sign-off remains Melissa Rowland. No new medical claim was authored in this integration.',
  table(['Source view', 'Cases / nodes', 'SHA-256'], packet.sourceViews.map(view => [code(view.name), view.cases + ' / ' + view.nodes, code(view.sha256)])),
  '## Default counts and hashes',
  counts,
  'The default gains 7 cases and 9 scored nodes. It registers 654 meanings, of which 497 currently have fresh scored coverage. The manifest is ' + code(packet.manifestId) + ' with 193 accepted rows, 12 ordinary replacement relations, one seven-case consolidation and 1423 archived legacy bindings.',
  '- Manifest SHA-256 ' + code(packet.hashes.manifestAfter) + '\n- Default SHA-256 ' + code(packet.hashes.defaultAfter) + '\n- Prior default SHA-256 ' + code(packet.hashes.defaultBefore) + '\n- Catalog SHA-256 ' + code(packet.hashes.catalogAfter),
  'The strict acceptance inverse verifies all 20 exact additions, 13 retirements, 23 new registry identities, authority rows, timing entries and owned source postimages before reconstructing the previous 1167-case epoch. Negative tests reject unrelated content, timing and authority drift. The earlier batch1 and HCC package tests use that verified historical epoch.',
  '## Runtime bindings for the domain owner',
  'Every accepted case uses the existing clinic setting and matches ' + code('clinicCaseMatchesLine(case, "income.app_consult")') + '. Each has a null procedure-consult kind. The per-item packet records its capability requirements, entry stage and admission receipt. These cases require no extra topic-affinity entry for APP, OR, endoscopy or wound/ostomy selection.',
  'All 26 timing classifications are installed, bringing the timing archive to 2343 rows. The domain owner still needs **33 exact diagnostic-choice records** from ' + code('QUESTION_PROGRAM_BATCH2_ACCEPTED_TEST_ORDER_RECORDS') + ' in ' + code('packages/game-domain/src/test-choice-orders.ts') + ' / ' + code('EXACT_TEST_CHOICE_ORDER_RECORDS') + '. Each carries ' + code('{kind:"not_executed", reason:"future_planned"}') + '. Existing profiles supply the runtime previews for these record-review and planned-investigation choices. The earlier batch1 contributes a separate 15 pending records.',
  orderTable,
  '## Validation and compatibility',
  validationTable,
  'Commands run from clinical-content and game-domain use ' + code('npm.cmd test -- --pool=threads --maxWorkers=2') + '. Root ' + code('npm.cmd run typecheck') + ' covers seven workspace scripts. Focused player includes the new batch2 suite, batch1, N4, harden1/N3R4, flags4, questionShipSaveCompatibility, separateCampaign and flagFreeze. Its preload supplies Vite’s optional Windows drive probe. Exact commands, durations, report hashes and every failure message are preserved in the validation receipt. [Validation](question-topic-acceptance-batch2-validation-20261111.json)',
  'All 46 new player cases pass. They cover admission and exact format-3 completion of all 20 current cases, plus snapshot and committed-journal replay for each of the 13 retired cases. Every original choice order, question version and FSRS identity survives. Previously reviewed cards retain their history, new cards start without reviews and repeated answer commands score once. Legacy MRCP and ultrasound result gates complete through the original contracts and existing wait bounds.',
  'Five initial domain failures came from historical tests selecting retired cases through fresh supply. ' + code('board-expansion-batch.test.ts') + ' and ' + code('brief-early-levels-20260917-batch.test.ts') + ' now use the verified pre-batch source through the existing author-stage fixture. Their reducer, gate, wait and FSRS assertions remain intact. ' + code('diagnostic-result-dispositions.test.ts') + ' resolves annotations against active cases or explicitly retained retired cases and verifies the retirement’s manifest relation. That focused run passes 95 tests. Their changes are test fixtures only.',
  'The full clinical result includes source-guard and concurrent topic-test failures. The source workers own those files. The domain’s remaining evidence hashes, concept-list fixture and deferred-order inventory are listed below. Earlier colon/appendix compilation errors occurred during active edits, and the final seven-workspace typecheck succeeds. The separateCampaign codec-limit failure also remains in the player result.',
  failures,
  '## Advisory cue lint',
  'Accepted subset ' + packet.lint.accepted.findings + ' raw findings across ' + packet.lint.accepted.variantsWithFindings + ' of 26 variants. Whole bank ' + packet.lint.wholeBank.findings + ' findings across ' + packet.lint.wholeBank.variantsWithFindings + ' of ' + packet.lint.wholeBank.uniqueVariants + ' distinct variants. The receipt preserves exact fields and phrases. [Lint report](question-topic-acceptance-batch2-lint-20261111.json)',
  'Six accepted keys are uniquely longest by raw character count. Each residual is explicitly pinned to its measured lengths, accepted decision and whole-case hash in the existing length test. The independent PASS wording is preserved. The 33 linter tests pass.',
  '## Changed Level5 bound inputs',
  boundTable,
  'Each of these three files already differed from the evidence’s recorded hash at intake. The packet retains those recorded values separately. The manifest, resolver, projector and new accepted modules are additional runtime inputs absent from that older bound-input map. Their exact raw hashes appear in the file receipt. The manager owns the later rebind.',
  '## Files and handoff',
  table(['Existing clinical file', 'After SHA-256'], packet.integrationFiles.map(file => [code(file.path), code(file.afterSha256)])),
  table(['Historical domain test', 'After SHA-256'], packet.domainFixtureFiles.map(file => [code(file.path), code(file.afterSha256)])),
  'New archive/wrapper, strict historical support, clinical and consolidation tests, player compatibility tests, intake/build/probe receipts and the active plan are listed with raw hashes in the file receipt. The accepted topic sources, packets and reviews retain their captured hashes. Concurrent worker changes are recorded separately. [Files](question-topic-acceptance-batch2-files-20261111.json)',
  'The manager can now hand the 33 exact tuples to the domain owner and return the 17 skipped contexts to the topic workers. Consolidation support is ready for the later appendix acceptance. The bounded acceptance work ends with this handoff.',
  'This checkpoint is local to the working tree. A later explicit “push to GitHub” request creates the backup through the manager’s workflow.',
];
fs.writeFileSync('docs/research/question-topic-acceptance-batch2-20261111.md', sections.join('\n\n') + '\n');
console.log(JSON.stringify({runs:runs.map(({failures, failedSuites,...run}) => run), typechecks:validation.typechecks, lint:validation.lintTests}));
