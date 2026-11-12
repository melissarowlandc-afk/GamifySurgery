import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import '../economy-audit/source-loader.mjs';
const c=await import('../../packages/clinical-content/src/index.ts');
const domain=await import('../../packages/game-domain/src/test-choice-orders.ts');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const sha=v=>createHash('sha256').update(v).digest('hex');
const hash=p=>sha(fs.readFileSync(p));
const digest=v=>sha(JSON.stringify(v));
const before=read('tools/question-quality/fixtures/question-flags3-acceptance-before-20261107.json');
const packet=read('docs/research/question-flags3-accepted-20261107.json');
const receipt=read('tools/question-quality/fixtures/question-flags3-acceptance-source-migration-20261107.json');
const live=c.SYNTHETIC_CLINICAL_RELEASE,manifest=c.QUESTION_SHIP_MANIFEST,source=c.QUESTION_FLAGS3_ACCEPTED_SOURCE_RELEASE;
const rows=manifest.accepted.filter(r=>r.sourceView==='flags3-accepted');
assert.deepEqual(rows.map(r=>r.acceptanceId),['F3-01','F3-02','F3-03-type','F3-03']);
assert.equal(digest(c.QUESTION_FLAGS3_SOURCE_RELEASE),before.reviewedSourceSha256);
const exact=rows.map(row=>{
 const r=c.QUESTION_FLAGS3_ACCEPTED_REVISIONS.find(r=>r.auditId===row.acceptanceId),p=packet.find(p=>p.id===row.acceptanceId);
 const cs=live.cases.find(cs=>cs.id===row.caseId),node=cs.decisionNodes.find(n=>n.id===row.nodeId);
 // JSON is the frozen/persisted representation; Zod can retain an optional
 // property with value undefined on a legacy node without changing its bytes.
 assert.equal(JSON.stringify(cs),JSON.stringify(source.cases.find(cs=>cs.id===row.caseId)));
 assert.equal(node.questionVariantId,row.questionVariantId);assert.equal(node.primaryConceptId,row.conceptId);
 assert.equal(r.question.reviewStatus,'needs_clinician_review');assert.equal(r.question.lastClinicianReview,null);
 assert.equal(digest(node),p.frozenPreservation.acceptedNodeSha256);assert.equal(digest(cs),p.frozenPreservation.acceptedCaseSha256);
 assert.equal(digest(r.question),p.frozenPreservation.acceptedQuestionSha256);
 assert.equal(manifest.headerSources[cs.id],'flags3-accepted');
 assert.equal(p.holdStatus,'none');assert.equal(p.sourceVerificationHold,null);
 const timings=c.ANSWER_CHOICE_TIMING_REGISTRY.filter(t=>t.caseId===cs.id&&t.nodeId===node.id&&t.questionVariantId===node.questionVariantId);
 assert.equal(timings.length,1);
 const testChoices=timings[0].classification.kind==='test_choices'?timings[0].classification.choices.filter(c=>c.timing.kind==='test'):[];
 const orders=testChoices.map(choice=>{
  const order=domain.EXACT_TEST_CHOICE_ORDER_RECORDS.find(r=>r.caseId===cs.id&&r.nodeId===node.id&&r.questionVariantId===node.questionVariantId&&r.choiceId===choice.choiceId);
  assert(order);assert.equal(order.choiceLabel,choice.choiceLabel);assert.equal(order.timingProfileId,choice.timing.timingProfileId);
  assert.deepEqual(order.disposition,{kind:'not_executed',reason:'future_planned'});return order;
 });
 return {...row,...p.frozenPreservation,holdStatus:'none',reviewStatus:r.question.reviewStatus,exactOrders:orders};
});
const oldCases=new Map(before.retainedInput.cases.map(cs=>[cs.id,cs])),oldConcepts=new Set(before.default.conceptIds);
const restored={...live,cases:live.cases.map(cs=>oldCases.get(cs.id)??cs),concepts:live.concepts.filter(c=>oldConcepts.has(c.id))};
assert.equal(digest(restored),before.default.sha256,'Entire previous default restored byte-exact');
assert.deepEqual(live.concepts.filter(c=>!oldConcepts.has(c.id)).map(c=>c.id),['concept.groin-hernia.ultrasound-compartment-classification.v1']);
const expectedManifest={...before.manifest,id:'question-ship.2026-11-07.v5',
 accepted:[...before.manifest.accepted.filter(r=>!['B2A02','B2A08'].includes(r.acceptanceId)),...rows],
 replacements:[...before.manifest.replacements,{replaces:'case.inguinal-hernia.caregiving-strain',with:'question.inguinal-hernia.symptomatic-elective-repair.v3.r12'}],
 headerSources:{...before.manifest.headerSources,...Object.fromEntries(source.cases.map(cs=>[cs.id,'flags3-accepted']))}};
assert.deepEqual(manifest,expectedManifest);assert.equal(digest(c.QUESTION_CATALOG_RELEASE),before.catalogSha256);
assert.deepEqual(c.ANSWER_CHOICE_TIMING_REGISTRY,[...before.timing,...c.QUESTION_FLAGS3_ACCEPTED_TIMING_ENTRIES]);
// Every authorized current source byte is pinned before replaying the immutable
// earlier source to legacy guards. This cannot permit an unrelated edit.
for(const row of receipt.files){assert.equal(hash(row.path),row.afterSha256,row.path);assert.equal(sha(row.beforeText),row.beforeSha256);assert.equal(before.files[row.path],row.beforeSha256);}
const changed=Object.entries(before.files).filter(([p,h])=>hash(p)!==h).map(([path,beforeSha256])=>({path,beforeSha256,afterSha256:hash(path)}));
assert.deepEqual(changed.map(r=>r.path).sort(),receipt.files.map(r=>r.path).sort());
for(const path of ['docs/research/question-flags3-20261107.json','docs/research/question-flags3-review-20261107.json',
 'packages/clinical-content/src/question-flags3-20261107.ts','packages/clinical-content/src/question-flags3-20261107-data.ts',
 'packages/clinical-content/src/question-flags3-evidence-20261107.ts','packages/clinical-content/src/question-flags3-retained-input-20261107.ts'])assert.equal(hash(path),before.files[path],path+' reviewed source remains exact');
const summary=r=>({cases:r.cases.length,nodes:r.cases.reduce((n,c)=>n+c.decisionNodes.length,0),
 uniqueQuestions:new Set(r.cases.flatMap(c=>c.decisionNodes.map(n=>n.questionVariantId))).size,
 activeConcepts:new Set(r.cases.flatMap(c=>c.decisionNodes.map(n=>n.primaryConceptId))).size,registeredMeanings:r.concepts.length,sha256:digest(r)});
const runtimePaths=['packages/clinical-content/src/index.ts','packages/clinical-content/src/synthetic-content.ts','packages/clinical-content/src/answer-choice-timing.ts',
 'packages/clinical-content/src/question-ship-manifest.ts','packages/game-domain/src/test-choice-orders.ts'];
const evidencePath='tools/qa/level-five-integration-results-20261012.json',evidence=read(evidencePath);
const report={checkedOn:'2026-11-07',decision:'docs/research/question-flags3-manager-decision-20261107.md',
 defaultBefore:summary(restored),defaultAfter:summary(live),accepted:exact,
 manifest:{beforeId:before.manifest.id,afterId:manifest.id,beforeAccepted:before.manifest.accepted.length,afterAccepted:manifest.accepted.length,
  beforeSha256:digest(before.manifest),afterSha256:digest(manifest),legacyBindings:manifest.legacyBindings.length,replacements:manifest.replacements,
  supersededRows:before.manifest.accepted.filter(r=>['B2A02','B2A08'].includes(r.acceptanceId)),unchangedPriorRows:before.manifest.accepted.length-2},
 source:{name:'flags3-accepted',exportName:'QUESTION_FLAGS3_ACCEPTED_SOURCE_RELEASE',sha256:digest(source),reviewedRoundOneSha256:before.reviewedSourceSha256,reviewedSourceUnchanged:true},
 catalog:{unchanged:true,sha256:before.catalogSha256},timing:{before:before.timing.length,after:c.ANSWER_CHOICE_TIMING_REGISTRY.length,
  beforeSha256:before.timingSha256,afterSha256:digest(c.ANSWER_CHOICE_TIMING_REGISTRY),priorRowsExact:true,appended:c.QUESTION_FLAGS3_ACCEPTED_TIMING_ENTRIES},
 unchangedDefaultCases:live.cases.length-3,unchangedHistoricalMeaningObjects:before.default.conceptIds.length,
 protectedUnchangedCount:Object.keys(before.files).length-changed.length,changedExistingFiles:changed,
 changedRuntimeFiles:runtimePaths.map(path=>changed.find(r=>r.path===path)),
 newlyLoadedRuntimeFiles:['packages/clinical-content/src/question-flags3-accepted-20261107.ts','packages/clinical-content/src/question-flags3-20261107.ts',
  'packages/clinical-content/src/question-flags3-20261107-data.ts','packages/clinical-content/src/question-flags3-evidence-20261107.ts','packages/clinical-content/src/question-flags3-retained-input-20261107.ts'].map(path=>({path,sha256:hash(path)})),
 levelFive:{evidencePath,evidenceSha256:hash(evidencePath),rebound:false,
  changedExistingBoundInputs:runtimePaths.filter(path=>Object.hasOwn(evidence.inputs,path)).map(path=>({...changed.find(r=>r.path===path),recordedEvidenceSha256:evidence.inputs[path]})),
  modifiedRuntimeFilesNotIndividuallyListed:runtimePaths.filter(path=>!Object.hasOwn(evidence.inputs,path))},
 noDomainAcceptanceGateAdded:true,noSaveJournalOrFsrsFormatChange:true,clinicalApproval:false,
 lint:read('tools/question-quality/question-flags3-accepted-lint-20261107.json').totals};
const output='docs/research/question-flags3-acceptance-scope-20261107.json';
if(process.argv.includes('--check'))assert.deepEqual(read(output),report);else fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({before:report.defaultBefore,after:report.defaultAfter,rows:manifest.accepted.length,manifestSha256:digest(manifest),
 unchangedDefaultCases:report.unchangedDefaultCases,protectedUnchanged:report.protectedUnchangedCount,source:report.source,
 changedBoundInputs:report.levelFive.changedExistingBoundInputs.map(r=>r.path)},null,2));
