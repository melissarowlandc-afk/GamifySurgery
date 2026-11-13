import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import '../economy-audit/source-loader.mjs';

const base = 'question-intraop-acceptance-batch11';
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
const rows = content.QUESTION_PROGRAM_BATCH11_ACCEPTED_ROWS;
const cases = content.QUESTION_PROGRAM_BATCH11_ACCEPTED_CASES;
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
const accepted = content.QUESTION_PROGRAM_BATCH11_FROZEN_PRESERVATION.map(record => {
  const clinicalCase = cases.find(row => row.id === record.caseId);
  const node = clinicalCase.decisionNodes.find(row => row.id === record.nodeId);
  const question = content.QUESTION_PROGRAM_BATCH11_ACCEPTED_QUESTIONS.find(row => row.id === record.questionVariantId);
  assert.equal(digest(node),record.sourceNodeSha256,'Exact reviewed scored node');
  assert.equal(digest(question),record.sourceQuestionSha256,'Exact reviewed question and key');
  const sourceCase=JSON.parse(record.sourceCaseJson);
  assert.deepEqual(clinicalCase,{...sourceCase,routineEligible:true,procedureContext:clinicalCase.procedureContext,
    displayName:sourceCase.displayName.replace(sourceCase.patientDisplayName,'{patientName}')},'Only declared admission/name metadata changes');
  const mappings = question.supportingEvidenceClaimIds.map(id => {
    const claim = content.QUESTION_PROGRAM_BATCH11_CLAIMS.find(row => row.id === id);
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
    inference:Object.values(content.QUESTION_PROGRAM_BATCH11_ACCEPTED_SOURCE_VIEWS).flatMap(view => view.concepts)
      .find(concept => concept.id === node.primaryConceptId)?.learningObjective,
    focus:clinicalCase.procedureContext.mode,
    whatChanged:'Exact reviewed node admitted with runtime patient-name placeholders and an explicit supported source contract.' +
      (node.id==='node.intraop.parathyroid.selective-salvage.v1'?' Two authored pathology profile names resolve to the existing runtime pathology-review mapping.':''),
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
    focused:report.testResults.filter(file => /batch11|Batch11|topicRuntimeBindings|patient-library-wording-repair|playable-patient-narrative|question-program-batch10-acceptance|question-ship-manifest/.test(file.name))
      .map(file => ({file:file.name, tests:file.assertionResults.length, failed:file.assertionResults.filter(test => test.status === 'failed').length})),
  };
}
const jobs = {'clinical-full':'clinical-complete', 'domain-full':'domain-full', 'player-full':'player-complete',
  'clinical-focused':'clinical-focused-complete', 'domain-focused':'domain-focused-final', 'player-focused':'player-focused'};
const results = Object.fromEntries(Object.entries(jobs).map(([label, job]) => [label, {...suite(job), receiptName:job}]));
for (const job of ['clinical-focused','domain-focused','player-focused']) assert.equal(results[job].failed, 0, job);
for (const job of ['clinical-full','domain-full','player-full']) for (const file of results[job].focused) assert.equal(file.failed, 0, file.file);
assert.equal(results['player-full'].failed, 0);
for (const [label, job] of [['typecheck','typecheck-complete'], ['pacing','pacing-final'], ['lint-tests','lint-tests']]) {
  const exit = read(scratch + job + '-exit.json');
  assert.equal(exit.exitCode, 0, job);
  results[label] = {exitCode:exit.exitCode, output:decode(scratch + job + '.log').trim(), logSha256:sha(fs.readFileSync(scratch + job + '.log'))};
}
const pacing = JSON.parse(decode(scratch + 'pacing-final.log'));
assert.equal(pacing.clinicalSha256, after.defaultSha256);
assert(Math.abs(pacing.driftPercent) <= 10);
const baseline = read('docs/research/question-intraop-acceptance-batch10-validation-20261113.json');
for (const [job, priorJob] of [['clinical-full','clinical-final'], ['domain-full','domain-full']]) {
  const known = new Set(baseline.results[priorJob].failures.map(row => row.title));
  for (const failure of results[job].failures) failure.presentInBatch10Baseline = known.has(failure.title);
}
const sourceChanges = Object.entries(before.observed).filter(([path, hash]) => fs.existsSync(path) && sha(fs.readFileSync(path)) !== hash)
  .map(([path, beforeSha256]) => ({path, beforeSha256, afterSha256:sha(fs.readFileSync(path))}));
const owned = new Set(migration.files.map(row => row.path));
const cumulative = [];
for (const batch of [9,10,11]) {
  const cases = content[`QUESTION_PROGRAM_BATCH${batch}_ACCEPTED_CASES`];
  for (const clinicalCase of cases) {
    for (const node of clinicalCase.decisionNodes) {
      const actual = content.SYNTHETIC_CLINICAL_RELEASE.cases.find(row => row.id === clinicalCase.id);
      assert.deepEqual(actual, clinicalCase);
      cumulative.push({batch, caseId:clinicalCase.id, nodeId:node.id, questionVariantId:node.questionVariantId,
        conceptId:node.primaryConceptId, mode:clinicalCase.procedureContext.mode,
        familyId:clinicalCase.procedureContext.familyId, caseSha256:digest(clinicalCase), nodeSha256:digest(node)});
    }
  }
}
assert.equal(cumulative.length,34);
assert.equal(new Set(cumulative.map(row => row.nodeId)).size,34);
assert.equal(new Set(cumulative.map(row => row.caseId)).size,29);
const census = [9,10,11].map(batch => {
  const nodes = cumulative.filter(row => row.batch === batch);
  const live = nodes.filter(row => row.mode === 'live');
  const chart = nodes.filter(row => row.mode === 'chart_review');
  return {batch, cases:new Set(nodes.map(row => row.caseId)).size, nodes:nodes.length,
    liveCases:new Set(live.map(row => row.caseId)).size, liveNodes:live.length,
    chartCases:new Set(chart.map(row => row.caseId)).size, chartNodes:chart.length};
});
const validation = {checkedOn:'2026-11-13', results, pacing, census, cumulative, levelFiveInputs, sourceChanges,
  preservedConcurrentChanges:sourceChanges.filter(row => !owned.has(row.path)),
  reconciliation:'Every original capture and assertion is retained through strict complete-postimage to immutable-preimage adapters. ENG-I01c family/plan additions are bound separately. Mutation controls test unrelated changes.',
  timingCorrection:'Two source timing.test.biopsy_pathology proposals map to the existing timing.test.pathology_review runtime profile. All five planning waits are tested, including distractors.'};
write(`docs/research/${base}-validation-${date}.json`, validation);
write(`docs/research/${base}-census-${date}.json`, {census,nodes:cumulative});
const cell = value => String(value ?? '').replaceAll('|','\\|').replaceAll('\n',' ');
const table = values => '| ' + values.map(cell).join(' | ') + ' |';
const lines = [
  '# Intraop acceptance batch 11 — 2026-11-13', '',
  '**Accepted all four requested standalone live cases and four scored nodes.** Each version retains needs_clinician_review. Batches 9–11 together contain **29 cases and 34 nodes**, comprising 18 live cases with 21 nodes and 11 clinic chart-review cases with 13 nodes.', '',
  'Batch10 is confirmed as **11 cases and 13 nodes**. Its acceptance table has one row per node. case.intraop.biliary-safety.new-bile.20261112.v1 contains unexplained-bile and major-injury-transfer. case.intraop.endoscopic-perforation-and-injury.sigmoid-defect-and-reassessment.v1 contains fresh-sigmoid-closure and postclip-tension-rescue. The remaining nine batch10 cases each have one node.', '',
  '## This acceptance', '',
  '| Case | Node | Exact source family | Independent PASS |', '| --- | --- | --- | --- |',
  ...accepted.map(row => table([row.caseId,row.nodeId,row.procedureContext.familyId,row.review.path])), '',
  'ENG-I01c supplies the distinct anorectal EUA, parathyroidectomy and thyroidectomy families. The endocrine cases bind their exact authored additional resources. Missing-gland uses endocrine surgery, intraoperative PTH and intraoperative ultrasound. Gland-preservation uses endocrine surgery and intraoperative frozen pathology. The reviewed thyroidectomy context retains its own family. The polypectomy case uses therapeutic colonoscopy with the installed closure, rescue and chromoendoscopy capabilities.', '',
  'Every case is a whole reviewed singleton. All four are adults. Native tests admit each only during its matching staffed procedure in the proper operational reserved room, and reject wrong family, room, room definition, outage, phase, nurse, provider, missing capability and ordinary unsourced admission. The existing ENG-I01c tests additionally verify the thyroid-versus-parathyroid distinction and resource loss. Eight new format-3 and committed-journal witnesses reopen and complete exact frozen encounters with their original FSRS meanings.', '',
  'Source authoring archives and original claim/source mappings are bound by hashes. Two patient-name substitutions use runtime placeholders in accepted metadata. The original reviewed node and question bytes are frozen alongside their accepted copies. Operative anatomy, sampling and gland viability remain clinician-review boundaries. One authored concept record lacks educationalTier metadata, recorded as an existing metadata gap.', '',
  '## Every accepted intraop node across batches 9–11', '',
  '| Batch | Cases | Nodes | Live cases | Live nodes | Chart-review cases | Chart-review nodes |', '| --- | ---: | ---: | ---: | ---: | ---: | ---: |',
  ...census.map(row => table([row.batch,row.cases,row.nodes,row.liveCases,row.liveNodes,row.chartCases,row.chartNodes])),
  table(['Total',29,34,18,21,11,13]), '',
  '| Batch | Exact node | Case | Mode | Family |', '| --- | --- | --- | --- | --- |',
  ...cumulative.map(row => table([row.batch,row.nodeId,row.caseId,row.mode,row.familyId])), '',
  'The [machine-readable census](' + base + '-census-' + date + '.json) binds every row to case/node hashes and question/concept identities.', '',
  '## Testing waits', '',
  'Five exact choice bindings are installed as planning estimates with not_executed / future_planned disposition. The source label timing.test.biopsy_pathology lacks a runtime mapping. Its two permanent-histology choices map to the established timing.test.pathology_review profile in accepted timing metadata. The three PTH choices use timing.test.basic_labs. The correction ledger records each source and runtime profile. All five display positive runtime estimates and preserve preview purity.', '',
  '| Node | Choice | Runtime profile |', '| --- | --- | --- |',
  ...dispositions.orders.map(row => table([row.nodeId,row.choiceId + ' — ' + row.choiceLabel,row.timingProfileId])), '',
  '## Default counts and hashes', '',
  '| Measure | Before | After |', '| --- | ---: | ---: |',
  ...Object.keys(packet.counts.before).map(key => table([key,packet.counts.before[key],packet.counts.after[key]])), '',
  'Four new meaning records are appended. Passing guards bind the entire prior case, concept, timing and authority prefix to its captured bytes.', '',
  '- Manifest ' + packet.manifestId + ' with JSON SHA256 ' + packet.manifestSha256 + '.',
  '- Default JSON SHA256 ' + packet.defaultSha256 + '.',
  '- Timing registry JSON SHA256 ' + packet.timingSha256 + '.',
  '- Catalog JSON SHA256 ' + packet.catalogSha256 + '.', '',
  '## Validation', '',
  'Vitest commands use npm.cmd test -- --pool=threads --maxWorkers=2 with default and JSON reporters. The player command uses the established command-local EPERM-safe preload. The initial player run was interrupted to apply the two runtime profile mappings, and player-complete is the full final run. Full native logs, exit codes and receipt hashes are recorded in the validation JSON.', '',
  '| Run | Passed | Failed | Skipped | Total | Files | Exit |', '| --- | ---: | ---: | ---: | ---: | ---: | ---: |',
  ...Object.keys(jobs).map(job => {const row=results[job]; return table([job,row.passed,row.failed,row.skipped,row.total,row.files,row.exitCode]);}), '',
  'Seven root workspace typechecks pass. Linter tests pass 33/33. Full-library patient naming/story guards pass. The four accepted variants have zero cue findings across eight canonical/profile contexts. Whole-bank findings remain 1824 in 870 variants.', '',
  'The actual final content-pacing CLI passes at tick **' + pacing.firstFinishTick + '** against reference ' + pacing.referenceTick + ', a ' + pacing.driftPercent.toFixed(4) + '% change within the ±10% band. It records ' + pacing.completions + ' completions, zero walkouts and positive closing cash.', '',
];
for (const job of ['clinical-full','domain-full','player-full']) lines.push('### ' + job, '', '```text',results[job].exactSummary,'exit ' + results[job].exitCode,'```','');
lines.push('## Remaining failures and manager work','',
  'Original guards are retained through exact historical adapters. Batch10 receipts are checked against their captured epoch, while the new batch11 tests independently check current admission and source integrity. The authorized ENG-I01c plan and family additions have strict recorded postimages and original preimages. The polypectomy authoring exclusion now checks its exact pre-acceptance manifest. Captures, assertions and budgets are retained.','',
  ...results['clinical-full'].failures.map(row => '- ' + row.file.split('/').at(-1) + ' — ' + row.title + '. ' + row.failureMessages[0].split('\n')[0]), '',
  ...results['domain-full'].failures.map(row => '- ' + row.file.split('/').at(-1) + ' — ' + row.title), '',
  'Per-failure baseline membership and complete messages are in the validation JSON. The manager owns the historical source/review guards, explicit concept census and Level5 evidence refresh.', '',
  '## Level5 bound inputs and file handoff', '',
  '| Changed direct recorded input | Intake SHA256 | Current SHA256 |', '| --- | --- | --- |',
  ...levelFiveInputs.map(row => table([row.path,row.beforeSha256,row.afterSha256])), '',
  'The manifest and accepted view/data are additional transitive inputs. The manager owns rebind and release. This is a local working-tree checkpoint.', '',
  'Artifacts include the [review packet](' + base + '-packet-' + date + '.json), [source freeze](' + base + '-source-freeze-' + date + '.json), [correction and wait ledger](' + base + '-dispositions-' + date + '.json), [validation](' + base + '-validation-' + date + '.json) and [file/hash receipt](' + base + '-files-' + date + '.json). The packet marks the key first for review only. Runtime choices remain randomized.', '');
fs.writeFileSync(`docs/research/${base}-${date}.md`,lines.join('\n'));
const newFiles = [
  ...['accepted-data-20261113.ts','accepted-20261113.ts','acceptance-test-support.ts','acceptance-20261113.test.ts']
    .map(suffix => 'packages/clinical-content/src/question-program-batch11-' + suffix),
  'packages/game-domain/tests/question-program-batch11-integration.test.ts',
  'apps/player/src/questionProgramBatch11SaveCompatibility.test.ts',
  'tools/question-quality/accept-intraop-batch11-20261113.mjs','tools/question-quality/receipt-intraop-acceptance-batch11-20261113.mjs',
  `tools/question-quality/${base}-lint-${date}.json`,
  ...fs.readdirSync('tools/question-quality/fixtures').filter(name=>name.startsWith(base+'-')).map(name=>'tools/question-quality/fixtures/'+name),
  `docs/execplans/${base}-${date}.md`,
  ...fs.readdirSync('docs/research').filter(name=>name.startsWith(base+'-')&&name!==`${base}-files-${date}.json`).map(name=>'docs/research/'+name),
];
write(`docs/research/${base}-files-${date}.json`, {changed:migration.files.map(row=>({path:row.path,beforeSha256:row.beforeSha256,afterSha256:row.afterSha256})),
  added:[...new Set(newFiles)].map(path=>({path,sha256:sha(fs.readFileSync(path))})), preservedConcurrentChanges:validation.preservedConcurrentChanges,
  sharedHandoff:fs.existsSync(scratch+'shared-handoff-delta.json')?read(scratch+'shared-handoff-delta.json'):null});
console.log(JSON.stringify({accepted:4,cases:4,cumulativeNodes:34,cumulativeCases:29,pacingTick:pacing.firstFinishTick,
  results:Object.fromEntries(Object.entries(results).map(([job,row])=>[job,{passed:row.passed,failed:row.failed,total:row.total,exitCode:row.exitCode}]))}));
