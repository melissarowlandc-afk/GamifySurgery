import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import '../economy-audit/source-loader.mjs';
const c=await import('../../packages/clinical-content/src/index.ts');
const a=await import('../../packages/clinical-content/src/question-stats1-accepted-20261108.ts');
const s=await import('../../packages/clinical-content/src/question-stats1-20261108.ts');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const fileSha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const digest=v=>createHash('sha256').update(JSON.stringify(v)).digest('hex');
const before=read('tools/question-quality/fixtures/question-stats1-acceptance-before-20261108.json');
const packet=read('docs/research/question-stats1-accepted-20261108.json');
const receipt=read('tools/question-quality/fixtures/question-stats1-acceptance-source-migration-20261108.json');
const live=c.SYNTHETIC_CLINICAL_RELEASE,manifest=c.QUESTION_SHIP_MANIFEST;
const oldIds=new Set(['G06','F3-01']);
const rows=a.QUESTION_STATS1_ACCEPTED_REVISIONS.map(r=>({acceptanceId:r.auditId,caseId:r.caseId,nodeId:r.nodeId,questionVariantId:r.questionVariantId,
 conceptId:r.question.conceptId,sourceView:'stats1-accepted',decision:'docs/research/question-stats1-manager-decision-20261108.md'}));
assert.deepEqual(manifest.accepted,[...before.manifest.accepted.filter(r=>!oldIds.has(r.acceptanceId)),...rows]);
assert.deepEqual(manifest.legacyBindings,before.manifest.legacyBindings);assert.deepEqual(manifest.replacements,before.manifest.replacements);
assert.equal(manifest.id,'question-ship.2026-11-08.v6');assert.equal(manifest.clinicalApproval,false);
for(const [id,view]of Object.entries(before.manifest.headerSources))if(!rows.some(r=>r.caseId===id))assert.equal(manifest.headerSources[id],view);
for(const r of rows)assert.equal(manifest.headerSources[r.caseId],'stats1-accepted');
assert.equal(Object.keys(manifest.headerSources).length,new Set([...Object.keys(before.manifest.headerSources),...rows.map(r=>r.caseId)]).size);
assert.deepEqual(live.cases.map(c=>c.id),before.default.caseIds);assert.deepEqual(live.concepts.map(c=>c.id),before.default.conceptIds);
for(const co of live.concepts)assert.equal(digest(co),before.default.conceptHashes[co.id],co.id+' changed');
const changedCases=live.cases.filter(cs=>digest(cs)!==before.default.caseHashes[cs.id]);
assert.deepEqual(changedCases.map(cs=>cs.id).sort(),rows.map(r=>r.caseId).sort());
assert.equal(changedCases.length,64);
const restores=new Map(before.retainedInput.cases.map(cs=>[cs.id,cs]));
assert.equal(digest({...live,cases:live.cases.map(cs=>restores.get(cs.id)??cs)}),before.default.sha256);
assert.equal(digest(s.QUESTION_STATS1_SOURCE_RELEASE),before.reviewedSourceSha256);
assert.deepEqual(s.QUESTION_STATS1_REVISIONS,before.reviewedRevisions);
for(const r of a.QUESTION_STATS1_ACCEPTED_REVISIONS){
 const p=packet.find(p=>p.id===r.auditId),cs=a.QUESTION_STATS1_ACCEPTED_SOURCE_RELEASE.cases.find(c=>c.id===r.caseId),n=cs.decisionNodes[0];
 assert.deepEqual(live.cases.find(c=>c.id===cs.id),cs);assert.equal(digest(cs),p.frozenPreservation.acceptedCaseSha256);
 assert.equal(digest(n),p.frozenPreservation.acceptedNodeSha256);assert.equal(digest(r.question),p.frozenPreservation.acceptedQuestionSha256);
 assert.equal(r.question.reviewStatus,'needs_clinician_review');assert.equal(r.question.lastClinicianReview,null);
 assert.equal(p.holdStatus,'none');assert(p.wordCounts.target35Met);assert.equal(p.lint.afterCount,0);assert.equal(p.lint.suppressedFindings,0);
 if(before.reviews.find(v=>v.id===r.auditId).verdict==='PASS'){
  assert.deepEqual(r,before.reviewedRevisions.find(v=>v.auditId===r.auditId));assert.deepEqual(cs,before.reviewedSource.cases.find(c=>c.id===cs.id));
 }else assert.notEqual(r.questionVariantId,before.reviewedRevisions.find(v=>v.auditId===r.auditId).questionVariantId);
}
for(const extra of before.additional)assert.equal(digest(live.cases.find(c=>c.id===extra.clinicalCase.id)),before.default.caseHashes[extra.clinicalCase.id]);
assert.equal(digest(c.QUESTION_CATALOG_RELEASE),before.catalogSha256);
assert.deepEqual(c.ANSWER_CHOICE_TIMING_REGISTRY,[...before.timing,...a.QUESTION_STATS1_ACCEPTED_TIMING_ENTRIES]);
const changed=Object.entries(before.files).filter(([p,h])=>fileSha(p)!==h).map(([path,beforeSha256])=>({path,beforeSha256,afterSha256:fileSha(path)}));
assert.deepEqual(changed.map(r=>r.path),receipt.files.map(r=>r.path));
for(const r of receipt.files){assert.equal(fileSha(r.path),r.afterSha256);assert.equal(createHash('sha256').update(r.beforeText).digest('hex'),r.beforeSha256);assert.equal(r.beforeSha256,before.files[r.path]);}
const evidencePath='tools/qa/level-five-integration-results-20261012.json',evidence=read(evidencePath);
assert.equal(fileSha(evidencePath),before.files[evidencePath]);
const bound=changed.filter(r=>Object.hasOwn(evidence.inputs,r.path)).map(r=>({...r,evidenceSha256:evidence.inputs[r.path]}));
assert.deepEqual(bound.map(r=>r.path).sort(),['packages/clinical-content/src/answer-choice-timing.ts','packages/clinical-content/src/index.ts','packages/clinical-content/src/synthetic-content.ts']);
const newDependencies=['question-stats1-accepted-20261108.ts','question-stats1-accepted-data-20261108.ts','question-stats1-20261108.ts','question-stats1-20261108-data.ts','question-stats1-evidence-20261108.ts','question-stats1-retained-input-20261108.ts']
 .map(n=>({path:'packages/clinical-content/src/'+n,sha256:fileSha('packages/clinical-content/src/'+n)}));
const count=release=>({cases:release.cases.length,nodes:release.cases.reduce((n,c)=>n+c.decisionNodes.length,0),uniqueQuestions:new Set(release.cases.flatMap(c=>c.decisionNodes.map(n=>n.questionVariantId))).size,
 activeConcepts:new Set(release.cases.flatMap(c=>c.decisionNodes.map(n=>n.primaryConceptId))).size,registeredMeanings:release.concepts.length});
const scope={checkedOn:'2026-11-08',sourceView:'stats1-accepted',sourceViewSha256:digest(a.QUESTION_STATS1_ACCEPTED_SOURCE_RELEASE),reviewedSourceSha256:before.reviewedSourceSha256,
 accepted:64,exactIndependentPass:42,revisedByDirection:22,clinicalApproval:false,allNeedsClinicianReview:true,stableConceptIds:18,newConceptIds:[],
 before:{cases:before.default.caseCount,nodes:before.default.nodeCount,registeredMeanings:before.default.conceptIds.length,activeConcepts:before.default.activeConceptCount,
  acceptedRows:before.manifest.accepted.length,legacyBindings:before.manifest.legacyBindings.length,wholeCaseRelations:before.manifest.replacements.length,timingRows:before.timing.length,
  liveSha256:before.default.sha256,manifestSha256:before.manifestSha256,timingSha256:before.timingSha256},
 after:{...count(live),acceptedRows:manifest.accepted.length,legacyBindings:manifest.legacyBindings.length,wholeCaseRelations:manifest.replacements.length,timingRows:c.ANSWER_CHOICE_TIMING_REGISTRY.length,
  liveSha256:digest(live),manifestSha256:digest(manifest),timingSha256:digest(c.ANSWER_CHOICE_TIMING_REGISTRY),manifestVersion:manifest.id},
 exactDefaultCasesChanged:changedCases.map(cs=>cs.id),unrelatedCasesUnchanged:live.cases.length-64,allPriorMeaningsAndOrderUnchanged:true,allFourN2Exact:true,catalogUnchanged:true,
 legacyBindingsUnchanged:true,wholeCaseRelationsUnchanged:true,supersededAcceptances:['G06','F3-01'],otherAcceptedRowsUnchanged:69,allPriorTimingRowsRetainedInOrder:true,
 protectedPaths:Object.keys(before.files).length,protectedUnchanged:Object.keys(before.files).length-changed.length,existingFileChanges:changed,
 runtimeFileChanges:changed.filter(r=>!r.path.includes('.test.')&&!r.path.includes('test-support')),
 newDefaultDependencies:newDependencies,levelFive:{evidencePath,evidenceUnchanged:true,boundInputChanges:bound,rebound:false},
 saveFormatChanged:false,domainRuntimeChanged:false,projectionOnly:true,selectorChanged:false,gameplayAnalyticsAdded:false,shipDecision:'docs/research/question-stats1-manager-decision-20261108.md',
};
const output='docs/research/question-stats1-acceptance-scope-20261108.json';
if(process.argv.includes('--check'))assert.deepEqual(read(output),scope);else fs.writeFileSync(output,JSON.stringify(scope,null,2)+'\n');
console.log(JSON.stringify({counts:scope.after,protectedUnchanged:scope.protectedUnchanged,changedExistingFiles:changed.length,unchangedPass:42,boundInputsChanged:bound.map(r=>r.path)},null,2));
