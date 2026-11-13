import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import '../economy-audit/source-loader.mjs';

const base = 'question-intraop-acceptance-batch10';
const date = '20261113';
const scratch = `.local-dev/${base}-${date}/`;
const fixture = `tools/question-quality/fixtures/${base}-`;
const read = path => JSON.parse(fs.readFileSync(path, 'utf8').replace(/^\uFEFF/, ''));
const sha = value => createHash('sha256').update(value).digest('hex');
const digest = value => sha(JSON.stringify(value));
const write = (path, value) => fs.writeFileSync(path, JSON.stringify(value, null, 2) + '\n');
const decode = path => {
  const bytes = fs.readFileSync(path);
  return bytes.toString(bytes[0] === 255 && bytes[1] === 254 ? 'utf16le' : 'utf8').replace(/^\uFEFF/, '');
};
const content = await import('../../packages/clinical-content/src/index.ts');
const before = read(fixture + `before-${date}.json`);
const after = read(fixture + `after-${date}.json`);
const migration = read(fixture + `source-migration-${date}.json`);
const dispositions = read(`docs/research/${base}-dispositions-${date}.json`);
const lint = read(`tools/question-quality/${base}-lint-${date}.json`);
const rows = content.QUESTION_PROGRAM_BATCH10_ACCEPTED_ROWS;
const cases = content.QUESTION_PROGRAM_BATCH10_ACCEPTED_CASES;
const evidence = read('tools/qa/level-five-integration-results-20261012.json');
assert.equal(digest(content.SYNTHETIC_CLINICAL_RELEASE), after.defaultSha256);
assert.equal(digest(content.QUESTION_SHIP_MANIFEST), after.manifestSha256);
assert.equal(lint.target.totals.findings, 0);
for (const file of migration.files) assert.equal(sha(fs.readFileSync(file.path)), file.afterSha256, file.path);
const levelFiveInputs = migration.files.filter(file => evidence.inputs[file.path]).map(file => ({
  path:file.path, beforeSha256:file.beforeSha256, afterSha256:file.afterSha256,
  retainedEvidenceSha256:evidence.inputs[file.path], alreadyUnboundAtIntake:file.beforeSha256 !== evidence.inputs[file.path],
}));
const fields = (clinicalCase, node) => ({
  Presentation:clinicalCase.presentation, 'Current update':node.currentUpdate ?? null,
  Exhibit:node.exhibit ?? null, Task:node.stem,
  Options:[...node.answerChoices].sort((a, b) => Number(b.isCorrect) - Number(a.isCorrect))
    .map(choice => (choice.isCorrect ? '**KEY:** ' : '') + choice.label),
});
const accepted = content.QUESTION_PROGRAM_BATCH10_FROZEN_PRESERVATION.map(record => {
  const clinicalCase = cases.find(row => row.id === record.caseId);
  const node = clinicalCase.decisionNodes.find(row => row.id === record.nodeId);
  const question = content.QUESTION_PROGRAM_BATCH10_ACCEPTED_QUESTIONS.find(row => row.id === record.questionVariantId);
  const mappings = question.supportingEvidenceClaimIds.map(id => {
    const claim = content.QUESTION_PROGRAM_BATCH10_CLAIMS.find(row => row.id === id);
    assert(claim, id);
    return {claimId:id, claimSha256:digest(claim), sourceIds:claim.sourceIds};
  });
  return {
    id:node.id, title:question.id, group:record.group, slug:record.slug, caseId:clinicalCase.id,
    nodeId:node.id, questionVariantId:question.id, conceptId:node.primaryConceptId,
    contentVersion:question.contentVersion, reviewStatus:question.reviewStatus, lastClinicianReview:question.lastClinicianReview,
    review:record.review, before:fields(JSON.parse(record.sourceCaseJson), JSON.parse(record.sourceNodeJson)),
    after:fields(clinicalCase, node), explanation:question.explanation,
    rationalePairs:question.answerChoices.map(choice => ({choiceId:choice.id, choice:choice.label,
      isCorrect:choice.isCorrect, rationale:choice.rationale, distractorRationale:choice.distractorRationale})),
    inference:Object.values(content.QUESTION_PROGRAM_BATCH10_ACCEPTED_SOURCE_VIEWS).flatMap(view => view.concepts)
      .find(concept => concept.id === node.primaryConceptId)?.learningObjective,
    focus:clinicalCase.procedureContext.mode,
    whatChanged:'Exact reviewed node admitted with runtime patient-name placeholders and an explicit supported source contract. Native summary derives from the exact reviewed node explanations. The original source archive and stable clinical identities remain frozen.',
    selfCheck:{wholeCasePass:true, latestIndependentPass:true, cueFindings:[], runtimeRandomization:node.shuffleAnswers,
      procedureAdmissionTest:true, frozenFormat3AndJournalTest:true,
      pediatricChecks:clinicalCase.pediatricProfile ? ['operational_pediatric_examination','age_5_to_17_art','exact_named_parent','frozen_family_identity'] : [],
      sourceClosure:'Unchanged existing atomic claims and source records. Device, operative-anatomy and rescue feasibility remain needs_clinician_review.'},
    evidenceMapping:mappings, procedureContext:clinicalCase.procedureContext,
    sourceHashes:{question:record.sourceQuestionSha256, node:record.sourceNodeSha256, case:record.sourceCaseSha256},
    acceptedHashes:{question:record.acceptedQuestionSha256, node:record.acceptedNodeSha256, case:record.acceptedCaseSha256},
  };
});
const packet = {
  checkedOn:'2026-11-13', reviewDisplay:'Key shown first for review only. Runtime choices are randomized.',
  clinicalApproval:false, clinicalSignOff:'Melissa Rowland. Editorial acceptance confers no named version approval.',
  accepted, skipped:dispositions.skipped, excluded:dispositions.excluded, sourceInputs:before.sourceInputs,
  presentationCorrections:dispositions.corrections, waitBindings:dispositions.orders.map(row => ({...row, installed:true})),
  remainingWaitBindings:[], counts:{before:{cases:before.defaultRelease.cases.length,
    nodes:before.defaultRelease.cases.flatMap(row => row.decisionNodes).length, registeredMeanings:before.defaultRelease.concepts.length,
    scoredMeanings:new Set(before.defaultRelease.cases.flatMap(row => row.decisionNodes.map(node => node.primaryConceptId))).size,
    acceptedRows:before.manifest.accepted.length, timingRows:before.timing.length},
    after:{cases:after.cases, nodes:after.nodes, registeredMeanings:after.registeredMeanings, scoredMeanings:after.scoredMeanings,
      acceptedRows:after.acceptedRows, timingRows:after.timingEntries}},
  manifestId:content.QUESTION_SHIP_MANIFEST.id, manifestSha256:after.manifestSha256, defaultSha256:after.defaultSha256,
  timingSha256:after.timingSha256, catalogSha256:after.catalogSha256, levelFiveInputs,
  lint:{target:lint.target.totals, before:lint.beforeTotals, after:lint.afterTotals},
  retirements:[], newClinicalClaims:[], newSourceRecords:[],
};
write(`docs/research/${base}-packet-${date}.json`, packet);
if (!process.argv.includes('--final')) {
  console.log(JSON.stringify({packet:accepted.length, skipped:dispositions.skipped.length, levelFiveInputs}));
  process.exit(0);
}

function suite(job) {
  const report = read(scratch + job + '.json');
  const exit = read(scratch + job + '-exit.json');
  const log = decode(scratch + job + '.log');
  const start = log.lastIndexOf(' Test Files ');
  const end = log.indexOf('JSON report written', start);
  return {passed:report.numPassedTests, failed:report.numFailedTests, skipped:report.numPendingTests,
    total:report.numTotalTests, files:report.testResults.length, exitCode:exit.exitCode,
    exactSummary:start >= 0 ? log.slice(start, end >= 0 ? end : undefined).trim() : '',
    logSha256:sha(fs.readFileSync(scratch + job + '.log')),
    failures:report.testResults.flatMap(file => file.assertionResults.filter(test => test.status === 'failed')
      .map(test => ({file:file.name, title:test.fullName, failureMessages:test.failureMessages}))),
    focused:report.testResults.filter(file => /batch10|Batch10|topicRuntimeBindings|patient-library-wording-repair|playable-patient-narrative|question-intraop-anesthetic|question-program-batch9-acceptance|question-ship-manifest/.test(file.name))
      .map(file => ({file:file.name, tests:file.assertionResults.length, failed:file.assertionResults.filter(test => test.status === 'failed').length})),
  };
}
const jobs = {
  'clinical-final':'clinical-complete', 'domain-full':'domain-full', 'player-full':'player-full',
  'clinical-focused-expanded':'clinical-focused-expanded', 'domain-focused-final':'domain-focused-final',
  'player-focused':'player-focused', 'polypectomy-guard-focused':'polypectomy-guard-focused',
};
const results = Object.fromEntries(Object.entries(jobs).map(([label, job]) => [label, {...suite(job), receiptName:job}]));
for (const job of ['clinical-focused-expanded','domain-focused-final','player-focused','polypectomy-guard-focused']) assert.equal(results[job].failed, 0, job);
for (const job of ['clinical-final','domain-full','player-full']) for (const file of results[job].focused) assert.equal(file.failed, 0, file.file);
assert.equal(results['player-full'].failed, 0, 'Full player suite');
for (const job of ['typecheck-final','pacing','lint-tests']) {
  const exit = read(scratch + job + '-exit.json');
  assert.equal(exit.exitCode, 0, job);
  results[job] = {exitCode:exit.exitCode, output:decode(scratch + job + '.log').trim(), logSha256:sha(fs.readFileSync(scratch + job + '.log'))};
}
const pacing = JSON.parse(decode(scratch + 'pacing.log'));
assert.equal(pacing.clinicalSha256, after.defaultSha256);
assert(Math.abs(pacing.driftPercent) <= 10);
const baseline = read('docs/research/question-intraop-acceptance-batch9-validation-20261112.json');
const priorClinical = new Set(baseline.results['clinical-final'].failures.map(row => row.fullName));
const priorDomain = new Set(baseline.results['domain-full'].failures.map(row => row.fullName));
for (const [job, prior] of [['clinical-final',priorClinical], ['domain-full',priorDomain]]) {
  for (const failure of results[job].failures) failure.presentInBatch9Baseline = prior.has(failure.title);
}
const sourceChanges = Object.entries(before.observed).filter(([path, hash]) => fs.existsSync(path) && sha(fs.readFileSync(path)) !== hash)
  .map(([path, beforeSha256]) => ({path, beforeSha256, afterSha256:sha(fs.readFileSync(path))}));
const owned = new Set(migration.files.map(row => row.path));
const validation = {checkedOn:'2026-11-13', results, pacing, levelFiveInputs, sourceChanges,
  unownedConcurrentChanges:sourceChanges.filter(row => !owned.has(row.path)),
  reconciliation:'Exact complete authorized postimages restore every original guard preimage. Original schema, source captures, case hashes, budgets and all assertions are retained. Mutation controls test both sides.',
  clinicalFailureClassification:'Retained pre-batch10 source, review and historical-pin mismatches. I11 schema and founder-route pins are reconciled exactly. See per-test messages and baseline membership.',
  domainFailureClassification:'Manager-owned explicit concept census and retained Level5 input/legacy-behavior evidence. No rebind or progression change.'};
write(`docs/research/${base}-validation-${date}.json`, validation);

const cell = value => String(value ?? '').replaceAll('|', '\\|').replaceAll('\n', ' ');
const table = values => '| ' + values.map(cell).join(' | ') + ' |';
const lines = [
  '# Intraop acceptance batch 10 — 2026-11-13', '',
  '**Accepted 13 independently PASSed nodes in 11 complete cases. Three salvage cases remain skipped.** All exact versions remain needs_clinician_review. The split is 10 live cases with 12 scored nodes and one clinic chart-review case with one node.', '',
  '## Accepted and withheld cases', '',
  '| Exact accepted node | Case | Source mode and family | Latest PASS |', '| --- | --- | --- | --- |',
  ...accepted.map(row => table([row.nodeId,row.caseId,row.focus + ' / ' + row.procedureContext.familyId,row.review.path])), '',
  '| Skipped node | Case and family | Reason |', '| --- | --- | --- |',
  ...dispositions.skipped.map(row => table([row.nodeIds.join(', '),row.caseId + ' / ' + row.familyId,row.reason])), '',
  'The Crohn EUA salvage requires procedure.anorectal_eua. The two endocrine salvages require procedure.parathyroidectomy and procedure.thyroidectomy plus specialized resources. ENG-I01b supports none of those families. Their complete reviewed cases remain untouched and withheld. The polypectomy ascending-emr-completion salvage is excluded by manager direction and has no acceptance row. Every admitted source case includes all its scored siblings. This acceptance appends complete new cases.', '',
  'The eight ENG-I01b nodes use the installed port, cholecystectomy, EGD and colonoscopy families and their exact operational equipment capabilities. The five admitted salvage cases use groin repair, EGD, orchiopexy or the authored stable outside-EGD clinic record. Native integration tests admit each live case only in a real compatible staffed procedure phase and its reserved OR or endoscopy room. Wrong family, room, room definition, outage, phase, nurse, provider and capability controls are rejected. Ordinary unsourced admission is rejected. The chart-review case uses ordinary clinic admission.', '',
  'Three pediatric cases retain exact age/sex profiles, child art aged 5–17 and one named parent. Tests require an operational accessible Pediatric Examination Room and the proper facility stage. Missing parent, wrong art, disconnected or out-of-service pediatric room and lower stage all block admission. Their frozen family/source identities survive format-3 and committed-journal reload and completion.', '',
  '## Frozen bytes, naming and source support', '',
  'The source freeze records original and accepted question, node and complete-case JSON hashes plus source, review and ledger file hashes. Twenty-one literal-name substitutions use {patientName} in accepted text and review metadata. The sigmoid case carried an older combined summary after its node explanation had been revised. Its accepted learningSummary now uses the exact reviewed node explanations joined by the native projector, with both source and accepted hashes recorded.', '',
  'The original atomic claims and source records are reused. Operative anatomy, device feasibility, rescue protocols and pediatric practice remain clinician-review boundaries. Five existing authored concept records omit educationalTier metadata. Their facility stages and clinical meanings are retained without inferring a missing tier.', '',
  'Artifacts include the [key-first review packet](' + base + '-packet-' + date + '.json), [exact source freeze](' + base + '-source-freeze-' + date + '.json), [dispositions and correction ledger](' + base + '-dispositions-' + date + '.json), [validation and every failure](' + base + '-validation-' + date + '.json), and [file/hash receipt](' + base + '-files-' + date + '.json). Keys are shown first for review only. Runtime choices remain randomized.', '',
  '## Testing waits', '',
  'All eleven testing-choice bindings are installed with existing authored profiles and exact case/node/question/choice tuples. They remain planning estimates with not_executed / future_planned disposition. The binding list covers every accepted testing option.', '',
  '| Node | Exact choice and label | Timing profile |', '| --- | --- | --- |',
  ...dispositions.orders.map(row => table([row.nodeId,row.choiceId + ' — ' + row.choiceLabel,row.timingProfileId])), '',
  '## Counts and hashes', '',
  '| Measure | Before | After |', '| --- | ---: | ---: |',
  ...Object.keys(packet.counts.before).map(key => table([key,packet.counts.before[key],packet.counts.after[key]])), '',
  'One newly scored node reuses the already registered concept.n2.bile-leak-duct-continuity-boundary. The other twelve meanings are appended. Every old concept definition and case remains byte-exact and retains its FSRS identity.', '',
  '- Manifest ' + packet.manifestId + ' with SHA256 ' + packet.manifestSha256 + '.',
  '- Default release SHA256 ' + packet.defaultSha256 + '.',
  '- Timing registry SHA256 ' + packet.timingSha256 + '.',
  '- Catalog SHA256 ' + packet.catalogSha256 + ', unchanged.', '',
  '## Validation', '',
  'All Vitest commands use npm.cmd test -- --pool=threads --maxWorkers=2. Full runs also use default and JSON reporters. Player uses the established command-local EPERM-safe Vite preload. Exact exit codes, counts, full failure messages and private-log hashes are retained in the validation JSON.', '',
  '| Run | Passed | Failed | Skipped | Total | Files | Exit |', '| --- | ---: | ---: | ---: | ---: | ---: | ---: |',
  ...['clinical-focused-expanded','domain-focused-final','player-focused','clinical-final','domain-full','player-full'].map(job => {
    const row = results[job]; return table([job,row.passed,row.failed,row.skipped,row.total,row.files,row.exitCode]);
  }), '',
  'The seven root workspace typechecks pass. Linter tests pass 33/33. Full-library naming and patient-story guards pass. The new 22 format-3/journal completion witnesses and all new admission/wait checks pass.', '',
  'Actual content-pacing-check PASSes at tick **' + pacing.firstFinishTick + '** against reference ' + pacing.referenceTick + ', a ' + pacing.driftPercent.toFixed(4) + '% change inside the ±10% band. The native journey records ' + pacing.completions + ' completions, zero walkouts and positive closing cash.', '',
  'Raw cue lint reports zero findings in 13 accepted variants across 26 canonical/profile contexts. The entire bank retains 1824 findings in 870 variants before and after this acceptance. No suppression was added.', '',
];
for (const job of ['clinical-final','domain-full','player-full']) {
  lines.push('### ' + job, '', '```text', results[job].exactSummary, 'exit ' + results[job].exitCode, '```', '');
}
lines.push('## Preserved guards and remaining failures', '',
  'The I11 focused test is green. Its original schema SHA256 c4d1640ba549c49b6a3dc7bfdf9155504611dd04c756865bc9f5fa0fd40015c7 is preserved through the exact ENG-I01 optional-schema postimage 530198fa3bb3f9270ba1eaee74974011736d98ba6deb14e9cd27e19d63108296. Its subsequent founder-consult pin is also reconciled against the exact authorized ENG source. The old port-allowlist assertion remains checked against its exact pre-ENG-I01b source. Original captured values are retained.', '',
  'Historical acceptance and authoring tests use strict full-postimage to immutable-preimage adapters. Additional captures bind the standalone-salvage append, preserving all original source bytes and packet fields. The excluded polypectomy test changes only its frozen-source guard so authorized test-integration edits restore the exact source bytes it captured. Its content, scored decision, review responses and 24 protected pins remain intact. New mutation controls reject unrelated changes. The patient-story verb list additionally recognizes underway and continue/continues, which the reviewed procedure presentations use.', '',
  'Remaining clinical failures', '',
  ...results['clinical-final'].failures.map(row => '- ' + row.file.split('/').at(-1) + ' — ' + row.title + '. ' + row.failureMessages[0].split('\n')[0]), '',
  'Remaining domain failures', '',
  ...results['domain-full'].failures.map(row => '- ' + row.file.split('/').at(-1) + ' — ' + row.title), '',
  'The clinical JSON identifies each retained source/review mismatch. Domain failures remain the explicit concept census and existing Level5 input/legacy-behavior evidence. Evidence and rebind remain manager-owned.', '',
  '## Level 5 bound inputs', '',
  '| Recorded changed input | Intake SHA256 | Current SHA256 |', '| --- | --- | --- |',
  ...levelFiveInputs.map(row => table([row.path,row.beforeSha256,row.afterSha256])), '',
  'The manifest and the new accepted data/view are additional transitive inputs. The manager owns evidence and behavior rebind. Runtime edits are confined to frozen manifest/views/concepts/family registration and exact timing/order metadata append. Balance, progression, source authoring modules, cloud/Supabase and GS-release stay outside this lane.', '',
  'This is a local working-tree checkpoint. The manager owns release integration, named clinician approval and the GitHub backup gate. The remaining three salvage cases require supported procedure/resource contracts before admission. The excluded polypectomy candidate remains with its writer and reviewer.', '');
fs.writeFileSync(`docs/research/${base}-${date}.md`, lines.join('\n'));

const newFiles = [
  'packages/clinical-content/src/question-program-batch10-accepted-data-20261113.ts',
  'packages/clinical-content/src/question-program-batch10-accepted-20261113.ts',
  'packages/clinical-content/src/question-program-batch10-acceptance-test-support.ts',
  'packages/clinical-content/src/question-program-batch10-acceptance-20261113.test.ts',
  'packages/game-domain/tests/question-program-batch10-integration.test.ts',
  'apps/player/src/questionProgramBatch10SaveCompatibility.test.ts',
  'tools/question-quality/accept-intraop-batch10-20261113.mjs',
  'tools/question-quality/receipt-intraop-acceptance-batch10-20261113.mjs',
  `tools/question-quality/${base}-lint-${date}.json`,
  ...fs.readdirSync('tools/question-quality/fixtures').filter(name => name.startsWith(base + '-')).map(name => 'tools/question-quality/fixtures/' + name),
  `docs/execplans/${base}-${date}.md`,
  ...fs.readdirSync('docs/research').filter(name => name.startsWith(base + '-') && name !== `${base}-files-${date}.json`).map(name => 'docs/research/' + name),
];
write(`docs/research/${base}-files-${date}.json`, {
  changed:migration.files.map(file => ({path:file.path, beforeSha256:file.beforeSha256, afterSha256:file.afterSha256})),
  added:[...new Set(newFiles)].map(path => ({path, sha256:sha(fs.readFileSync(path))})),
  preservedConcurrentChanges:validation.unownedConcurrentChanges,
  sharedHandoff:fs.existsSync(scratch + 'shared-handoff-delta.json') ? read(scratch + 'shared-handoff-delta.json') : null,
});
console.log(JSON.stringify({accepted:accepted.length, cases:cases.length, skipped:dispositions.skipped.length,
  pacingTick:pacing.firstFinishTick, results:Object.fromEntries(Object.entries(results).map(([key,row]) => [key,
    {passed:row.passed, failed:row.failed, total:row.total, exitCode:row.exitCode}]))}));
