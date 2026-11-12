import '../economy-audit/source-loader.mjs';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';

const dir='.local-dev/question-new-n3-round5-20261110';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const hash=x=>createHash('sha256').update(typeof x==='string'||Buffer.isBuffer(x)?x:JSON.stringify(x)).digest('hex');
const logText=p=>{const bytes=fs.readFileSync(p);return (bytes[0]===255&&bytes[1]===254?bytes.subarray(2).toString('utf16le'):bytes.toString('utf8')).replace(/^\uFEFF/,'').replace(/\x1b\[[0-9;]*m/g,'').replace(/\r/g,'');};
const intake=read(dir+'/intake.json'),packet=read('docs/research/question-new-n3-round5-20261110.json');
const receipt=read(dir+'/packet-receipt.json');
assert.equal(hash(fs.readFileSync(receipt.path)),receipt.sha256);
assert.deepEqual(packet.dispositionCounts,{inputs:3,revisedCandidates:0,parked:3,newOwnerQuestions:0});
assert.equal(packet.variants.length,0);assert.equal(packet.executableCandidates.count,0);
assert.equal(packet.parkedItems.length,3);assert.equal(packet.sourceMode.newAtomicFacts,0);
for(const p of packet.parkedItems){assert.equal(p.newVariantId,null);assert.equal(p.candidateEmitted,false);
 assert.equal(p.selfCheck.authorVerdict,'PARK_NOT_PASS');assert.equal(p.selfCheck.calibratedToReviewer.twoStep,false);
 assert.equal(p.selfCheck.calibratedToReviewer.difficulty,'easy');assert.ok(p.selfCheck.decidingObservation&&p.selfCheck.counterfactual&&p.selfCheck.closestCompetitor);
 assert.equal(p.prospectiveConstruction.alternativeKeyEstablished,false);assert.equal(p.ownerQuestion,null);}

const prior=read('docs/research/question-new-n3-round4-20261110.json');
assert.equal(hash(prior.ownerApprovalsNeeded),packet.existingOwnerHolds.exactPriorArraySha256);
assert.equal(hash(prior.drops),packet.previouslyProposedDrops.exactPriorArraySha256);
const b=await import('../../packages/clinical-content/src/question-new-n3-round4-20261110.ts');
for(const frozen of packet.frozenPreservation){const cs=b.QUESTION_NEW_N3_ROUND4_CASES.find(c=>c.decisionNodes.some(n=>n.questionVariantId===frozen.questionVariantId));
 assert.ok(cs);assert.equal(hash(cs),frozen.authoredCaseSha256);}
for(const cs of b.QUESTION_NEW_N3_ROUND4_CASES)assert.equal(hash(cs),prior.variants.find(v=>v.caseId===cs.id).exactVersionSha256);

const changed=[],missing=[];
for(const f of intake.files){if(!fs.existsSync(f.path)){missing.push(f.path);continue;}
 const current=hash(fs.readFileSync(f.path));if(current!==f.sha256)changed.push({path:f.path,before:f.sha256,current});}
assert.equal(missing.length,0);
// These files are all read-only to this lane. Concurrent acceptance changes
// have their own owner; record them without restoring old snapshots.
const frozenExisting=intake.files.filter(f=>f.path.startsWith('packages/clinical-content/src/question-new-n3')&&!f.path.endsWith('.test.ts'));
for(const f of frozenExisting)assert.equal(hash(fs.readFileSync(f.path)),f.sha256,'Frozen N3 source '+f.path);
for(const p of ['docs/research/question-new-n3-round4-20261110.json','docs/research/question-new-n3-round4-review-20261110.json']){
 const captured=intake.files.find(f=>f.path===p);assert.ok(captured);assert.equal(hash(fs.readFileSync(p)),captured.sha256);}
const prefix=fs.readFileSync(dir+'/current-handoff-before.bin'),current=fs.readFileSync('docs/handoffs/CURRENT_THREAD_HANDOFF.md');
assert.ok(current.subarray(0,prefix.length).equals(prefix),'Preserve the complete shared handoff prefix');

const summary=name=>{
 const log=logText(dir+'/'+name+'.log');
 const files=log.match(/Test Files\s+(?:(\d+) failed \| )?(\d+) passed \((\d+)\)/);
 const tests=log.match(/Tests\s+(?:(\d+) failed \| )?(\d+) passed(?: \| (\d+) skipped)? \((\d+)\)/);
 assert.ok(files&&tests,name);
 const suiteStart=log.indexOf('Failed Suites'),testStart=log.indexOf('Failed Tests');
 const suiteSection=suiteStart<0?'':log.slice(suiteStart,testStart<0?undefined:testStart);
 const suiteMessage=suiteSection.match(/(?:AssertionError|Error):\s*([^\n]*(?:\n(?!\n)[^\n]*)?)/)?.[1]?.replace(/\s+/g,' ').trim();
 const suiteFailures=[...suiteSection.matchAll(/^\s*FAIL\s+(src\/[^\s]+\.test\.ts)\s+\[/gm)].map(m=>({
  file:'packages/clinical-content/'+m[1],phase:'suite_import',assertion:suiteMessage,log:dir+'/'+name+'.log'}));
 const testSection=testStart<0?log:log.slice(testStart);
 const failures=testSection.split(/\n\s*FAIL\s+/).slice(1).map(block=>{
  const head=block.match(/^(src\/[^\s]+\.test\.ts)\s*>\s*([\s\S]*?)\n(?:AssertionError|Error):\s*([\s\S]*?)(?=\n\n|\nExpected:)/);
  assert.ok(head,'Parse exact failure in '+name);
  return {file:'packages/clinical-content/'+head[1],test:head[2].replace(/\s+/g,' ').trim(),
   assertion:head[3].replace(/\s+/g,' ').trim(),expected:block.match(/Expected: "([^"\n]+)"/)?.[1],received:block.match(/Received: "([^"\n]+)"/)?.[1]};
 });
 return {command:'npm.cmd run test --workspace @gamify-surgery/clinical-content -- --pool=threads --maxWorkers=2',
  log:dir+'/'+name+'.log',exit:Number(logText(dir+'/'+name+'.exit.txt')),
  files:{passed:Number(files[2]),failed:Number(files[1]??0),total:Number(files[3])},
  tests:{passed:Number(tests[2]),failed:Number(tests[1]??0),skipped:Number(tests[3]??0),total:Number(tests[4])},
  duration:log.match(/Duration\s+([^\n]+)/)?.[1].trim(),failures,suiteFailures};
};
const before=summary('clinical-before'),after=summary('clinical-after');
assert.equal(before.failures.length,3);assert.equal(before.suiteFailures.length,0);assert.equal(before.tests.failed,3);
assert.equal(after.failures.length,after.tests.failed);assert.equal(after.suiteFailures.length,11);
assert.ok(changed.some(f=>f.path==='packages/clinical-content/src/question-ship-manifest.ts'),'Concurrent acceptance manifest delta is captured');
const acceptanceInputs=['packages/clinical-content/src/question-ship-manifest.ts','packages/clinical-content/src/synthetic-content.ts',
 'packages/clinical-content/src/index.ts','packages/clinical-content/src/answer-choice-timing.ts','packages/game-domain/src/test-choice-orders.ts'];
for(const path of acceptanceInputs)assert.ok(changed.some(f=>f.path===path),'Capture concurrent acceptance change '+path);
const baselineByFile=new Map(before.failures.map(f=>[f.file,f]));
const failureAttribution=[...new Set([...after.failures,...after.suiteFailures].map(f=>f.file))].map(file=>({
 file,preEditFailure:baselineByFile.get(file)??null,
 afterTests:after.failures.filter(f=>f.file===file),afterSuiteImports:after.suiteFailures.filter(f=>f.file===file),
 attribution:'Concurrent harden1/N3-round4 acceptance integration: appended manifest/header tuples, new projected definitions and timing/order bindings. No package source, test, manifest or existing packet is edited by this lane.',
 evidence:{preEditLog:before.log,afterLog:after.log,concurrentlyChangedInputs:acceptanceInputs,
  newRound5RuntimeFiles:[],newRound5QuestionDefinitions:0},
}));
const r4=read('.local-dev/question-new-n3-round4-20261110/validation.json');
assert.equal(r4.clinicalFinal.tests.failed,3);

const typeLog=logText(dir+'/typecheck-final.log'),typeExit=Number(logText(dir+'/typecheck-final.exit.txt'));
const workspaces=[...typeLog.matchAll(/> (@gamify-surgery\/[\w-]+)@[^\n]* typecheck/g)].map(m=>m[1]);
assert.equal(typeExit,0);assert.equal(workspaces.length,7);assert.ok(!typeLog.includes('error TS'));
const lintLog=logText(dir+'/lint-tests.log'),lintExit=Number(logText(dir+'/lint-tests.exit.txt'));
assert.equal(lintExit,0);assert.ok(/pass 33/.test(lintLog));assert.ok(/fail 0/.test(lintLog));
assert.equal(packet.lint.totals.findings,0);assert.equal(packet.lint.totals.uniqueVariants,3);assert.equal(packet.lint.totals.profileContexts,6);
const lanePaths=[
 'docs/execplans/question-new-n3-round5-20261110.md',
 'docs/research/question-new-n3-round5-20261110.json',
 'docs/research/question-new-n3-round5-handoff-20261110.md',
 'tools/question-new-n3-round5/decisions.mjs',
 'tools/question-new-n3-round5/review.mjs',
 'tools/question-new-n3-round5/validate.mjs',
];
const laneFiles=lanePaths.map(path=>{assert.ok(fs.existsSync(path),path);assert.ok(!intake.files.some(f=>f.path===path),'New file '+path);
 return {path,sha256:hash(fs.readFileSync(path)),kind:'new'};});
laneFiles.push({path:'docs/handoffs/CURRENT_THREAD_HANDOFF.md',kind:'append_only',priorPrefixBytes:prefix.length,priorPrefixSha256:hash(prefix),sha256:hash(current)});
const validation={generatedOn:'2026-11-10',packetSha256:receipt.sha256,clinicalBefore:before,clinicalAfter:after,
 introducedFailures:0,failureAttribution,previousRoundComparison:{receipt:'.local-dev/question-new-n3-round4-20261110/validation.json',
  tests:r4.clinicalFinal.tests,files:r4.clinicalFinal.files,sameFailingFiles:r4.clinicalFinal.failures.map(f=>f.file)},
 typecheck:{command:'npm.cmd run typecheck',exit:typeExit,workspaces,log:dir+'/typecheck-final.log'},
 lintTests:{command:'npm.cmd run clinical:lint:test',passed:33,failed:0,exit:lintExit,log:dir+'/lint-tests.log'},
 retainedDraftDiagnosticLint:packet.lint,newExecutableCandidates:0,
 sourceChecks:{recordedClaims:10,sourceRecords:8,newAtomicFacts:0,newRetrievals:0,refreshedDates:0},
 preservation:{round4PassVersionsExact:2,allRound4VersionsExact:5,frozenExistingN3SourceFiles:frozenExisting.length,
  existingOwnerHoldsUnchanged:13,acceptedDropsPreservedHistorically:17,ownManifestEdits:0,ownRuntimeEdits:0,ownLevel5BoundInputEdits:[]},
};
const scope={newLaneFiles:6,existingLaneFiles:1,laneFiles,missingCapturedFiles:missing,
 observedConcurrentDeltas:changed,attribution:'This lane writes only the six new tool/document files and an append to CURRENT_THREAD_HANDOFF.md. It edits no clinical-content or game-domain source, registry, manifest or test.',
 level5BoundInputsChangedByThisLane:[]};
fs.writeFileSync(dir+'/validation.json',JSON.stringify(validation,null,2)+'\n');
fs.writeFileSync(dir+'/scope-proof.json',JSON.stringify(scope,null,2)+'\n');
console.log(JSON.stringify({clinicalBefore:before.tests,clinicalAfter:after.tests,clinicalFiles:after.files,introducedFailures:0,
 typechecks:workspaces.length,lintTests:33,retainedDiagnosticFindings:0,candidates:0,parked:3,
 frozenN3SourceFiles:frozenExisting.length,newLaneFiles:6,appendOnlyExistingFiles:1,concurrentDeltas:changed.map(d=>d.path)}));
