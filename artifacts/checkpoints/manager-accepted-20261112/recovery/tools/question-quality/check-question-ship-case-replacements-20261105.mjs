import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import '../economy-audit/source-loader.mjs';
const c=await import('../../packages/clinical-content/src/index.ts');
const orders=await import('../../packages/game-domain/src/test-choice-orders.ts');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const before=read('tools/question-quality/fixtures/question-ship-case-replacements-before-20261105.json');
const supplemental=read('.local-dev/question-ship-case-replacements-20261105/supplemental-files.json');
const digest=v=>createHash('sha256').update(JSON.stringify(v)).digest('hex');
const hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const release=c.SYNTHETIC_CLINICAL_RELEASE,revisions=c.QUESTION_FLAGS2_ROUND3_REVISIONS;
const replacementIds=new Set(revisions.map(r=>r.caseId)),newConceptIds=new Set(revisions.map(r=>r.question.conceptId));
const restored={...release,concepts:release.concepts.filter(c=>!newConceptIds.has(c.id)),cases:release.cases.map(cs=>before.oldCases.find(c=>c.id===cs.id)??cs)};
assert.equal(digest(restored),before.default.sha256,'Only the two authorized complete cases/cards may change');
for(const cs of release.cases)if(!replacementIds.has(cs.id))assert.equal(digest(cs),before.default.caseHashes[cs.id],cs.id+' unrelated change');
for(const[id,sha]of Object.entries(before.default.conceptHashes))assert.equal(digest(release.concepts.find(c=>c.id===id)),sha,'Historical meaning changed');
assert.deepEqual(c.QUESTION_SHIP_MANIFEST.accepted.filter(a=>a.sourceView!=='flags2-round3'),before.manifest.accepted);
assert.deepEqual(c.QUESTION_SHIP_MANIFEST.legacyBindings,before.manifest.legacyBindings);
assert.equal(c.QUESTION_SHIP_MANIFEST.accepted.filter(a=>a.caseId.startsWith('case.n3.')).length,0);
assert.equal(digest(c.ANSWER_CHOICE_TIMING_REGISTRY.slice(0,-2)),before.timing.sha256);
assert.deepEqual(c.ANSWER_CHOICE_TIMING_REGISTRY.slice(-2),c.QUESTION_FLAGS2_WHOLE_CASE_TIMING_ENTRIES);
const authorizedN3Tests=new Set(['packages/clinical-content/src/question-new-n3-round2-20261105.test.ts','packages/clinical-content/src/question-new-n3-round3-20261105.test.ts']);
const protectedUnchanged=[],relatedN3TestChanges=[];
for(const[path,sha]of Object.entries(before.protectedFiles)){
 const current=hash(path);
 if(authorizedN3Tests.has(path)){assert.equal(supplemental[path],sha);relatedN3TestChanges.push({path,beforeSha256:sha,afterSha256:current});}
 else{assert.equal(current,sha,'Unrelated protected file changed: '+path);protectedUnchanged.push(path);}
}
const round3Files=read('tools/question-quality/question-flags2-round3-files-20261105.json');
const frozenRound3=round3Files.files.filter(row=>row.path.startsWith('packages/clinical-content/src/question-flags2-round3-')&&!row.path.endsWith('.test.ts')||
 row.path==='docs/research/question-flags2-round3-20261105.json'||row.path==='docs/research/sources-question-flags2-round3-20261105.json'||
 row.path==='tools/question-quality/fixtures/question-flags2-round3-before-20261105.json');
for(const row of frozenRound3)assert.equal(hash(row.path),row.sha256,'Exact accepted draft/capture changed');
const existingChanges=Object.entries({...before.files,...supplemental}).filter(([path,sha])=>hash(path)!==sha).map(([path,beforeSha256])=>({path,beforeSha256,afterSha256:hash(path)}));
const runtimePaths=['packages/clinical-content/src/question-ship-manifest.ts','packages/clinical-content/src/question-ship-projection.ts',
 'packages/clinical-content/src/index.ts','packages/clinical-content/src/synthetic-content.ts','packages/clinical-content/src/answer-choice-timing.ts','packages/game-domain/src/test-choice-orders.ts'];
const newRuntime=['packages/clinical-content/src/question-ship-case-replacements.ts','packages/clinical-content/src/question-flags2-whole-case-accepted-20261105.ts'];
const levelFiveEvidencePath='tools/qa/level-five-integration-results-20261012.json';
const levelFiveEvidence=read(levelFiveEvidencePath);
const summary=r=>({cases:r.cases.length,nodes:r.cases.reduce((n,c)=>n+c.decisionNodes.length,0),uniqueQuestions:new Set(r.cases.flatMap(c=>c.decisionNodes.map(n=>n.questionVariantId))).size,
 activeConcepts:new Set(r.cases.flatMap(c=>c.decisionNodes.map(n=>n.primaryConceptId))).size,registeredConcepts:r.concepts.length,sha256:digest(r)});
const report={checkedOn:'2026-11-05',scope:'Exact fresh whole-case delta, unchanged historical identities, immutable captures and unrelated-lane protection. No evidence rebind or release-tree edits.',
 defaultBefore:summary(restored),defaultAfter:summary(release),unchangedDefaultCases:release.cases.length-replacementIds.size,
 changedCases:revisions.map(r=>{const old=before.oldCases.find(c=>c.id===r.caseId),cs=release.cases.find(c=>c.id===r.caseId);return {id:r.auditId,caseId:r.caseId,beforeSha256:digest(old),afterSha256:digest(cs),
  retiredFreshQuestionIds:old.decisionNodes.map(n=>n.questionVariantId),admittedQuestionId:r.questionVariantId,retainedOldConceptIds:old.decisionNodes.map(n=>n.primaryConceptId),newConceptId:r.question.conceptId,
  reviewStatus:r.question.reviewStatus,clinicalApproval:false};}),
 manifest:{beforeId:before.manifest.id,afterId:c.QUESTION_SHIP_MANIFEST.id,beforeAccepted:before.manifest.accepted.length,afterAccepted:c.QUESTION_SHIP_MANIFEST.accepted.length,
  legacyBindings:c.QUESTION_SHIP_MANIFEST.legacyBindings.length,replacements:c.QUESTION_SHIP_MANIFEST.replacements,newN3Acceptances:0},
 timing:{before:before.timing.count,after:c.ANSWER_CHOICE_TIMING_REGISTRY.length,oldPrefixSha256:before.timing.sha256,newRecords:2},
 exactPlannedOrders:c.QUESTION_FLAGS2_WHOLE_CASE_TEST_ORDER_RECORDS.map(row=>{assert(orders.EXACT_TEST_CHOICE_ORDER_RECORDS.some(r=>JSON.stringify(r)===JSON.stringify(row)));return row;}),
 protectedUnchangedCount:protectedUnchanged.length,protectedUnchanged,relatedN3TestChanges,frozenRound3Files:frozenRound3.map(row=>({path:row.path,sha256:row.sha256})),existingChanges,
 changedRuntimeInputs:runtimePaths.map(path=>existingChanges.find(row=>row.path===path)),newRuntimeInputs:newRuntime.map(path=>({path,sha256:hash(path)})),
 levelFive:{evidencePath:levelFiveEvidencePath,evidenceSha256:hash(levelFiveEvidencePath),rebound:false,
  changedExistingBoundInputs:runtimePaths.filter(path=>Object.hasOwn(levelFiveEvidence.inputs,path)).map(path=>({
   ...existingChanges.find(row=>row.path===path),recordedEvidenceSha256:levelFiveEvidence.inputs[path]})),
  changedRuntimeFilesNotCurrentlyListed:runtimePaths.filter(path=>!Object.hasOwn(levelFiveEvidence.inputs,path)),
  newRuntimeDependenciesNotCurrentlyListed:newRuntime.filter(path=>!Object.hasOwn(levelFiveEvidence.inputs,path))},
 testOnlyNewFiles:['packages/clinical-content/src/question-ship-case-replacements-test-support.ts','packages/clinical-content/src/question-ship-case-replacements.test.ts'],
 noDomainAdmissionCheckAdded:true,noSaveOrJournalFormatChanged:true,noNewClinicalAuthoring:true};
const path='docs/research/question-ship-case-replacements-scope-20261105.json';
if(process.argv.includes('--check'))assert.deepEqual(read(path),report);else fs.writeFileSync(path,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({before:report.defaultBefore,after:report.defaultAfter,unchangedCases:report.unchangedDefaultCases,protectedUnchanged:protectedUnchanged.length,
 relatedN3Tests:relatedN3TestChanges.map(r=>r.path),existingChangedFiles:existingChanges.length,runtimeInputs:runtimePaths,newRuntimeInputs:newRuntime},null,2));
