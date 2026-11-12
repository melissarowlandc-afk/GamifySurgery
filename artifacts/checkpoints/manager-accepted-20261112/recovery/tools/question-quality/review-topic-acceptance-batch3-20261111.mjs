import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import '../economy-audit/source-loader.mjs';
import {collectAuthoredMetadata, inventoryRelease} from './bank.mjs';
const content = await import('../../packages/clinical-content/src/index.ts');
const domain = await import('../../packages/game-domain/src/index.ts');
const {createLevelFourRoomsQaState} = await import('../../tests/fixtures/level-four-rooms.ts');
const {clinicCaseMatchesLine} = await import('../../packages/game-domain/src/clinic-consult-topics.ts');
const {procedureConsultKind} = await import('../../packages/game-domain/src/founder-consults.ts');
const read = path => JSON.parse(fs.readFileSync(path, 'utf8'));
const hash = value => createHash('sha256').update(value).digest('hex');
const digest = value => hash(JSON.stringify(value));
const raw = path => hash(fs.readFileSync(path));
const before = read('tools/question-quality/fixtures/question-topic-acceptance-batch3-before-20261111.json');
const disposition = read('docs/research/question-topic-acceptance-batch3-dispositions-20261111.json');
const migration = read('tools/question-quality/fixtures/question-topic-acceptance-batch3-source-migration-20261111.json');
const sourceFreezePath='docs/research/question-topic-acceptance-batch3-source-freeze-20261111.json';
const sourceFreeze=read(sourceFreezePath);
const cases = content.QUESTION_PROGRAM_BATCH3_ACCEPTED_CASES;
const rows = content.QUESTION_PROGRAM_BATCH3_ACCEPTED_ROWS;
const retired = content.QUESTION_PROGRAM_BATCH3_RETAINED_CASES;
const questions = content.QUESTION_PROGRAM_BATCH3_ACCEPTED_QUESTIONS;
const orders = content.QUESTION_PROGRAM_BATCH3_ACCEPTED_TEST_ORDER_RECORDS;
const timings = content.QUESTION_PROGRAM_BATCH3_ACCEPTED_TIMING_ENTRIES;
const live = content.SYNTHETIC_CLINICAL_RELEASE;
const manifest = content.QUESTION_SHIP_MANIFEST;
for (const cs of cases) assert.deepEqual(live.cases.find(current => current.id === cs.id), cs);
for (const cs of retired) assert(!live.cases.some(current => current.id === cs.id));
const old = new Map(live.cases.map(cs => [cs.id, cs]));
for (const cs of retired) old.set(cs.id, cs);
const previousIds = new Set(before.default.conceptIds);
const restored = {...live, cases:before.default.caseIds.map(id => old.get(id)), concepts:live.concepts.filter(co => previousIds.has(co.id))};
assert.equal(digest(restored), before.default.sha256, 'Exact prior default recovery');
for (const row of migration.files) assert.equal(raw(row.path), row.afterSha256, row.path + ' owned source drift');
for (const row of migration.files.filter(row => row.path.startsWith("packages/game-domain/"))) assert.equal(raw(row.path), row.afterSha256, row.path + ' owned fixture drift');
assert.deepEqual(manifest.accepted.slice(0,before.manifest.accepted.length), before.manifest.accepted);
assert.deepEqual(content.ANSWER_CHOICE_TIMING_REGISTRY.slice(0,before.timing.length), before.timing);

let prepared = createLevelFourRoomsQaState(domain.PROTOTYPE_DOMAIN_CONTEXT);
for (const command of [
  {type:'PLACE_ROOM', operationId:'topic3.final.exam', roomDefinitionId:'room.examination', roomId:'room.topic3.final.exam', x:35, y:24, orientation:0},
  {type:'PLACE_DOOR', operationId:'topic3.final.door', roomId:'room.topic3.final.exam', doorId:'door.topic3.final.exam', side:'south', offset:1},
]) {
  prepared = domain.gameReducer(prepared, command, domain.PROTOTYPE_DOMAIN_CONTEXT);
  assert.equal(prepared.operationReceipts[command.operationId]?.status, 'applied');
}
Object.assign(prepared, {paused:false, serviceAppointmentsEnabled:false, nextRoutineArrivalTick:Number.MAX_SAFE_INTEGER});
const selection = read('tools/question-quality/fixtures/question-topic-acceptance-batch3-selection-20261111.json');
const probes = cases.filter(cs => cs.participant?.kind !== 'employee_discussion').map(cs => {
  const state = structuredClone(prepared);
  const issue = domain.getClinicalCaseEligibilityIssue(state, cs, domain.PROTOTYPE_DOMAIN_CONTEXT);
  const command = {type:'ADMIT_PATIENT', operationId:'topic3.final.admit', encounterId:'encounter.topic3.final',
    caseId:cs.id, patientDisplayName:cs.patientDisplayName, arrivalClass:'routine'};
  const admitted = domain.gameReducer(state, command, domain.PROTOTYPE_DOMAIN_CONTEXT);
  const receipt = admitted.operationReceipts[command.operationId];
  assert.equal(issue, null, cs.id);
  assert.equal(receipt?.status, 'applied', cs.id);
  assert(clinicCaseMatchesLine(cs, 'income.app_consult'));
  assert.equal(procedureConsultKind(cs), null);
  return {caseId:cs.id, issue, receipt, requiredSetting:cs.requiredClinicalSetting,
    requiredCapabilityIds:cs.requiredCapabilityIds, earliestFacilityStage:cs.earliestFacilityStage,
    clinicAdmissible:true, appAffinity:true, procedureConsultKind:null};
});
for (const cs of cases.filter(cs => cs.participant?.kind === 'employee_discussion')) {
  const captured = selection.selected.find(row => row.caseId === cs.id);
  assert(domain.employeeDiscussionCaseIsRuntimeSafe(cs));
  probes.push({caseId:cs.id, ...captured.runtime, clinicAdmissible:true, appAffinity:false, procedureConsultKind:null,
    requiredSetting:cs.requiredClinicalSetting, requiredCapabilityIds:cs.requiredCapabilityIds, earliestFacilityStage:cs.earliestFacilityStage});
}
const metadata = collectAuthoredMetadata(content);
const acceptedLint = inventoryRelease({...live, cases}, metadata);
const wholeLint = inventoryRelease(live, metadata);
const items = rows.map(row => {
  const cs = cases.find(cs => cs.id === row.caseId);
  const node = cs.decisionNodes.find(node => node.id === row.nodeId);
  const question = questions.find(question => question.id === row.questionVariantId);
  const source = before.topics.flatMap(topic => topic.candidates).find(record => record.case.id === cs.id)
    .records.find(record => record.node.id === node.id);
  const latest = source.evidence;
  assert.equal(latest.record.verdict, "PASS");
  assert.deepEqual(question, source.question);
  assert.deepEqual(node, source.node);
  assert.equal(question.reviewStatus, 'needs_clinician_review');
  const pending = orders.filter(order => order.questionVariantId === node.questionVariantId);
  return {...row, title:latest.record.title, reviewStatus:question.reviewStatus, holdStatus:'none', review:latest,
    nodeSha256:digest(node), questionSha256:digest(question),
    reviewedSourceNodeSha256:sourceFreeze.records.find(record=>record.nodeId===node.id).sourceNodeSha256,
    sourceFileSha256:sourceFreeze.records.find(record=>record.nodeId===node.id).sourceFileSha256,
    supportingEvidenceClaimIds:question.supportingEvidenceClaimIds,
    runtime:{...probes.find(probe => probe.caseId === cs.id), topicAffinityBindingsNeeded:[], timingInstalled:true,
      timing:timings.find(entry => entry.questionVariantId === node.questionVariantId), testChoiceOrdersNeeded:pending},
    after:{Presentation:cs.presentation, 'Current update':node.currentUpdate, Exhibit:node.exhibit ?? null, Task:node.stem,
      Options:[...node.answerChoices].sort((a,b) => Number(b.isCorrect)-Number(a.isCorrect)).map(choice => (choice.isCorrect ? '**KEY:** ' : '') + choice.label)},
    explanation:node.explanation, lint:acceptedLint.variants.find(variant => variant.questionVariantId === node.questionVariantId)?.findings ?? []};
});
const protectedInputs = before.topics.flatMap(topic => [
  {path:topic.sourcePath, beforeSha256:topic.sourceSha256}, {path:topic.packetPath, beforeSha256:topic.packetSha256},
  {path:topic.ledgerPath, beforeSha256:topic.ledgerSha256}, ...topic.reviews.map(row => ({path:row.path, beforeSha256:row.sha256})),
]).map(row => ({...row, currentSha256:raw(row.path), unchanged:raw(row.path) === row.beforeSha256}));
const observedConcurrentChanges = Object.entries(before.observed)
  .filter(([path, sha]) => raw(path) !== sha && !migration.files.some(row => row.path === path))
  .map(([path, beforeSha256]) => ({path, beforeSha256, currentSha256:raw(path)}));
const levelFive = read('tools/qa/level-five-integration-results-20261012.json');
const levelFiveInputs = migration.files.filter(row => levelFive.inputs[row.path]).map(row => ({path:row.path,
  beforeSha256:row.beforeSha256, afterSha256:row.afterSha256, recordedSha256:levelFive.inputs[row.path],
  alreadyUnboundAtIntake:row.beforeSha256 !== levelFive.inputs[row.path]}));
const packet = {checkedOn:'2026-11-11', reviewDisplay:'Key shown first for review only. Runtime answer choices shuffle.', clinicalApproval:false,
  accepted:items, skipped:disposition.items.filter(item => item.status === 'skipped'), probes,
  counts:{before:{cases:before.default.cases, nodes:before.default.nodes, registeredMeanings:before.default.conceptIds.length,
    scoredMeanings:before.default.scoredMeanings, acceptedRows:before.manifest.accepted.length, timingRows:before.timing.length},
    after:{cases:live.cases.length, nodes:live.cases.flatMap(cs => cs.decisionNodes).length, registeredMeanings:live.concepts.length,
      scoredMeanings:new Set(live.cases.flatMap(cs => cs.decisionNodes.map(node => node.primaryConceptId))).size,
      acceptedRows:manifest.accepted.length, timingRows:content.ANSWER_CHOICE_TIMING_REGISTRY.length},
    requested:225, acceptedNodes:rows.length, acceptedCases:cases.length, skippedNodes:14, retiredCases:retired.length,
    retiredNodes:retired.flatMap(cs => cs.decisionNodes).length, newMeanings:live.concepts.filter(co => !previousIds.has(co.id)).length,
    pendingOrderRecords:orders.length},
  manifestId:manifest.id, hashes:{defaultBefore:before.default.sha256, defaultAfter:digest(live), manifestBefore:before.manifestSha256,
    manifestAfter:digest(manifest), catalogBefore:before.catalogSha256, catalogAfter:digest(content.QUESTION_CATALOG_RELEASE)},
  replacements:disposition.replacements, consolidations:disposition.consolidations, stageAdjustments:disposition.stageAdjustments,
  eligibilityAdjustments:disposition.eligibilityAdjustments,retirementCoverage:disposition.retirementCoverage, duplicateContexts:disposition.duplicateContexts,
  retained:retired.map(cs => ({caseId:cs.id, sha256:digest(cs), nodes:cs.decisionNodes.map(node => ({id:node.id, questionVariantId:node.questionVariantId, conceptId:node.primaryConceptId}))})),
  removedFromFreshScoredMeanings:before.default.conceptIds.filter(id => retired.some(cs => cs.decisionNodes.some(node => node.primaryConceptId === id)) &&
    !live.cases.some(cs => cs.decisionNodes.some(node => node.primaryConceptId === id))),
  sourceViews:disposition.sourceViews, frozenPreservation:disposition.frozen,
  sourceByteFreeze:{path:sourceFreezePath,sha256:raw(sourceFreezePath),exactFields:sourceFreeze.exactFields,total:sourceFreeze.total,objectKeyOrderNormalizations:sourceFreeze.objectKeyOrderNormalizations},
  claims:content.QUESTION_PROGRAM_BATCH3_CLAIMS,
  sources:content.QUESTION_PROGRAM_BATCH3_SOURCES, pendingRuntimeOrders:orders, rawLengthResiduals:content.QUESTION_PROGRAM_BATCH3_LENGTH_RESIDUALS,
  lint:{accepted:acceptedLint.totals, wholeBank:wholeLint.totals}, levelFiveInputs,
  newUnboundClinicalRuntimeInputs:['packages/clinical-content/src/question-program-batch3-accepted-data-20261111.ts',
    'packages/clinical-content/src/question-program-batch3-accepted-20261111.ts'].map(path=>({path,sha256:raw(path),presentInOldBinding:!!levelFive.inputs[path]})),
  integrationFiles:migration.files.map(({beforeText,...row}) => row),
  domainFixtureFiles:migration.files.filter(row => row.path.startsWith("packages/game-domain/")).map(({beforeText,...row}) => row), protectedInputs, observedConcurrentChanges};
for (const [path, value] of [
  ['docs/research/question-topic-acceptance-batch3-packet-20261111.json', packet],
  ['docs/research/question-topic-acceptance-batch3-lint-20261111.json', {checkedOn:'2026-11-11', advisory:true, accepted:acceptedLint, wholeBank:wholeLint}],
]) {
  const text = JSON.stringify(value, null, 2) + '\n';
  if (process.argv.includes('--check')) assert.equal(hash(fs.readFileSync(path)), hash(text), path + ' stale');
  else fs.writeFileSync(path, text);
}
console.log(JSON.stringify({counts:packet.counts, hashes:packet.hashes, protectedInputDrift:protectedInputs.filter(row => !row.unchanged),
  acceptedLint:packet.lint.accepted, wholeBankLint:packet.lint.wholeBank, levelFiveInputs}));
