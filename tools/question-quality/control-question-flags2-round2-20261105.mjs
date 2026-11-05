import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import '../economy-audit/source-loader.mjs';
const c=await import('../../packages/clinical-content/src/index.ts');
const f=await import('../../packages/clinical-content/src/question-flags2-round2-20261105.ts');
const first=await import('../../packages/clinical-content/src/question-flags2-20261105.ts');
const {questionShipManifestIssues}=await import('../../packages/clinical-content/src/question-ship-manifest-validation.ts');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const digest=t=>crypto.createHash('sha256').update(t).digest('hex');
const before=read('tools/question-quality/fixtures/question-flags2-round2-before-20261105.json');
const integration=read('tools/question-quality/question-flags2-g06-integration-20261105.json');
const packet=read('docs/research/question-flags2-round2-20261105.json');
const ledger=read('docs/research/sources-question-flags2-round2-20261105.json');
const lint=read('tools/question-quality/question-flags2-round2-lint-20261105.json');
assert.equal(lint.totals.afterFindings,0);assert.equal(lint.totals.newVariants,7);
assert.equal(packet.filter(p=>p.pipelinePassed).length,1);
const g06=first.QUESTION_FLAGS2_REVISIONS.find(r=>r.auditId==='G06');
assert.deepEqual(c.QUESTION_SHIP_MANIFEST.accepted.filter(r=>r.acceptanceId==='G06'),[integration.acceptance]);
assert.deepEqual(c.QUESTION_SHIP_MANIFEST.accepted.filter(r=>r.acceptanceId!=='G06'),before.manifest.accepted);
assert.deepEqual(c.QUESTION_SHIP_MANIFEST.legacyBindings,before.manifest.legacyBindings);
const otherHeaders={...c.QUESTION_SHIP_MANIFEST.headerSources};delete otherHeaders[g06.caseId];
assert.deepEqual(otherHeaders,before.manifest.headerSources);
assert.equal(c.QUESTION_SHIP_MANIFEST.headerSources[g06.caseId],'flags2-round1');
const live=c.SYNTHETIC_CLINICAL_RELEASE;
const changedCases=live.cases.filter(cs=>JSON.stringify(cs)!==JSON.stringify(before.release.cases.find(old=>old.id===cs.id))).map(cs=>cs.id);
assert.deepEqual(changedCases,[g06.caseId]);assert.equal(live.cases.length,before.release.cases.length);
assert.deepEqual(live.cases.find(cs=>cs.id===g06.caseId),first.QUESTION_FLAGS2_ROUND1_SOURCE_RELEASE.cases.find(cs=>cs.id===g06.caseId));
assert(before.release.concepts.every(old=>live.concepts.some(current=>JSON.stringify(current)===JSON.stringify(old))));
const newLiveConcepts=live.concepts.filter(current=>!before.release.concepts.some(old=>old.id===current.id));
assert.deepEqual(newLiveConcepts.map(c=>c.id),[g06.question.conceptId]);
for(const r of f.QUESTION_FLAGS2_ROUND2_REVISIONS){
 assert(!c.QUESTION_SHIP_MANIFEST.accepted.some(row=>row.questionVariantId===r.questionVariantId));
 assert(!live.concepts.some(concept=>concept.id===r.question.conceptId));
}
assert.equal(c.QUESTION_FLAGS2_ACCEPTED_TIMING_ENTRIES.length,1);
assert.deepEqual(c.QUESTION_FLAGS2_ACCEPTED_TIMING_ENTRIES[0].classification,{kind:'no_test'});
const views={legacy:c.QUESTION_FLAGS_PRE_REVISION_RELEASE,'flags-round3':c.QUESTION_NEW_N1_PRE_RELEASE,'batch2a-round3':c.QUESTION_BANK_BATCH2A_ROUND3_RELEASE,
 'n1-round2':c.QUESTION_BANK_PRE_BATCH2B_RELEASE,'n1-round3':c.QUESTION_NEW_N2_ROUND3_PRE_RELEASE,'n2-round2':c.QUESTION_NEW_N1_ROUND3_PRE_RELEASE,
 'batch2b-round2':c.QUESTION_BANK_BATCH2B_ROUND2_SOURCE_RELEASE,'flags2-round1':first.QUESTION_FLAGS2_ROUND1_SOURCE_RELEASE};
assert.deepEqual(questionShipManifestIssues(live,c.QUESTION_FLAGS_PRE_REVISION_RELEASE,views),[]);
const shareEdits=integration.edits.map(edit=>{
 let text=fs.readFileSync(edit.path,'utf8');
 for(const op of [...edit.operations].reverse()){
  assert.equal(text.split(op.to).length-1,1,edit.path+' own integration fragment changed');text=text.replace(op.to,op.from);
 }
 return {path:edit.path,before:edit.before,current:hash(edit.path),otherBytesPreservedAtInsertion:edit.otherBytesPreservedAtInsertion,
  currentWithoutOwnEditsMatchesInsertionBefore:digest(text)===edit.before};
});
const frozenPaths=[
 'packages/clinical-content/src/question-flags2-20261105.ts','packages/clinical-content/src/question-flags2-20261105-data.ts',
 'packages/clinical-content/src/question-flags2-evidence-20261105.ts','packages/clinical-content/src/question-flags2-retained-input-20261105.ts',
 'docs/research/question-flags2-20261105.json','docs/research/sources-question-flags2-20261105.json',
];
const frozen=frozenPaths.map(path=>({path,before:before.files[path],current:hash(path)}));
assert(frozen.every(p=>p.before===p.current),'A round-one definition/PASS artifact changed');
const ownRuntimePaths=integration.edits.map(e=>e.path);
const ownTestPaths=['packages/clinical-content/src/question-flags2-20261105.test.ts','packages/clinical-content/src/question-flags2-round2-20261105.test.ts',
 'packages/clinical-content/src/question-ship-manifest.test.ts','packages/clinical-content/src/answer-choice-timing.test.ts'];
const ownNewRuntimePaths=['packages/clinical-content/src/question-flags2-accepted-20261105.ts','packages/clinical-content/src/question-flags2-round2-20261105.ts',
 'packages/clinical-content/src/question-flags2-round2-20261105-data.ts','packages/clinical-content/src/question-flags2-round2-evidence-20261105.ts',
 'packages/clinical-content/src/question-flags2-round2-retained-input-20261105.ts'];
const own=new Set([...ownRuntimePaths,...ownTestPaths]),concurrent=[];
for(const[path,initial]of Object.entries(before.files))if(!own.has(path)&&fs.existsSync(path)&&initial!==hash(path))concurrent.push({path,before:initial,current:hash(path)});
const controls={checkedAt:new Date().toISOString(),acceptedCount:1,acceptedRow:integration.acceptance,manifestRows:c.QUESTION_SHIP_MANIFEST.accepted.length,
 liveCases:live.cases.length,liveNodes:live.cases.flatMap(cs=>cs.decisionNodes).length,changedLiveCases:changedCases,newLiveConcepts:newLiveConcepts.map(c=>c.id),historicalConceptsRetained:true,
 returnedDrafts:f.QUESTION_FLAGS2_ROUND2_REVISIONS.map(r=>({id:r.auditId,variantId:r.questionVariantId,previousVariantId:r.previousQuestionVariantId,conceptId:r.question.conceptId,
  liveFallbackVariantId:live.cases.find(cs=>cs.id===r.caseId).decisionNodes.find(n=>n.id===r.nodeId).questionVariantId,
  sourceHoldOnKey:!!packet.find(p=>p.id===r.auditId).sourceVerificationHold,accepted:false})),
 sourceHoldIds:ledger.holds.map(h=>h.id),sourceRecords:ledger.sources.length,atomicClaims:f.QUESTION_FLAGS2_ROUND2_CLAIMS.length,
 sourceAccessDatesRefreshed:false,clinicalApproval:false,originalG04StillLive:true,retirementApplied:false,newVersionOrdersGloballyRegistered:false,
 g06ExactTiming:c.QUESTION_FLAGS2_ACCEPTED_TIMING_ENTRIES,manifestDiagnostics:[],frozenRound1:frozen,sharedIntegration:shareEdits,
 ownExistingRuntimePaths:ownRuntimePaths,ownNewRuntimePaths,ownTestPaths,observedConcurrentChanges:concurrent,
 changedExistingLevel5BoundInputs:ownRuntimePaths.map(path=>({path,before:before.files[path],current:hash(path)})),
 newRuntimeDependencies:ownNewRuntimePaths.map(path=>({path,sha256:hash(path)})),
 noEvidencePinOrCheckpointWrite:true,noN3FileWrite:true,noGitInstallNetworkAgentMessageOrDeploy:true,
};
fs.writeFileSync('tools/question-quality/question-flags2-round2-controls-20261105.json',JSON.stringify(controls,null,2)+'\n');
console.log(JSON.stringify({accepted:1,newDrafts:7,holds:controls.sourceHoldIds,newConceptVersions:7,newLiveConcepts:controls.newLiveConcepts,changedLiveCases:changedCases,
 lint:lint.totals,frozenRound1Files:frozen.length,manifestRows:controls.manifestRows,concurrentChangedFiles:concurrent.length,sharedEditsStillExact:shareEdits.every(e=>e.currentWithoutOwnEditsMatchesInsertionBefore)},null,2));
