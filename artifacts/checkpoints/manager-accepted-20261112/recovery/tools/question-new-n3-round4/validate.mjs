import '../economy-audit/source-loader.mjs';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const dir='.local-dev/question-new-n3-round4-20261110';
const hash=x=>createHash('sha256').update(typeof x==='string'||Buffer.isBuffer(x)?x:JSON.stringify(x)).digest('hex');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const logText=path=>{const bytes=fs.readFileSync(path);return (bytes[0]===0xff&&bytes[1]===0xfe?bytes.subarray(2).toString('utf16le'):bytes.toString('utf8')).replace(/^\uFEFF/,'');};
const intake=read(dir+'/intake.json'),old=new Map(intake.files.map(f=>[f.path,f.sha256]));
const paths=[
 'packages/clinical-content/src/question-new-n3-round4-types.ts',
 'packages/clinical-content/src/question-new-n3-round4-candidates.ts',
 'packages/clinical-content/src/question-new-n3-round4-evidence-20261110.ts',
 'packages/clinical-content/src/question-new-n3-round4-20261110.ts',
 'packages/clinical-content/src/question-new-n3-round4-20261110.test.ts',
 'tools/question-new-n3-round4/triage.mjs','tools/question-new-n3-round4/build-evidence.mjs',
 'tools/question-new-n3-round4/review.mjs','tools/question-new-n3-round4/preview.mjs','tools/question-new-n3-round4/validate.mjs',
 'docs/execplans/question-new-n3-round4-20261110.md',
 'docs/research/question-new-n3-round4-triage-20261110.md',
 'docs/research/question-new-n3-round4-20261110.json',
 'docs/research/question-new-n3-round4-handoff-20261110.md',
];
const manifest=paths.map(path=>{assert.ok(fs.existsSync(path),path);assert.ok(!old.has(path),path+' must be a new lane file');return {path,sha256:hash(fs.readFileSync(path)),kind:'new'};});
const delta=[],missing=[];
for(const f of intake.files){if(!fs.existsSync(f.path)){missing.push(f.path);continue;}const current=hash(fs.readFileSync(f.path));if(current!==f.sha256)delta.push({path:f.path,before:f.sha256,current});}
const protectedGroups={clinical:intake.files.filter(f=>f.path.startsWith('packages/clinical-content/src/')),
 oldN3:intake.files.filter(f=>f.path.startsWith('packages/clinical-content/src/question-new-n3')),
 domainRuntime:intake.files.filter(f=>f.path.startsWith('packages/game-domain/src/'))};
for(const group of Object.values(protectedGroups))for(const f of group)assert.equal(hash(fs.readFileSync(f.path)),f.sha256,'Preserve existing '+f.path);
assert.equal(missing.length,0);
const currentPath='docs/handoffs/CURRENT_THREAD_HANDOFF.md',prefixPath=dir+'/current-handoff-before.bin';
const prefix=fs.readFileSync(prefixPath),currentHandoff=fs.readFileSync(currentPath);
assert.ok(currentHandoff.subarray(0,prefix.length).equals(prefix),'Preserve the entire shared handoff prefix');
manifest.push({path:currentPath,kind:'append_only',priorPrefixBytes:prefix.length,priorPrefixSha256:hash(prefix),sha256:hash(currentHandoff)});
const {SYNTHETIC_CLINICAL_RELEASE:live,QUESTION_CATALOG_RELEASE:catalog}=await import('../../packages/clinical-content/src/synthetic-content.ts');
const {QUESTION_SHIP_MANIFEST:ship}=await import('../../packages/clinical-content/src/question-ship-manifest.ts');
const {ANSWER_CHOICE_TIMING_REGISTRY:timings}=await import('../../packages/clinical-content/src/answer-choice-timing.ts');
const runtime=read(dir+'/runtime-intake.json');assert.equal(hash(live),runtime.defaultSha);assert.equal(hash(catalog),runtime.catalogSha);
assert.equal(hash(ship),runtime.manifestSha);assert.deepEqual(timings,runtime.timings);
const summary=(name)=>{
 const log=logText(dir+'/'+name+'.log').replace(/\x1b\[[0-9;]*m/g,'').replace(/\r/g,'');
 const files=log.match(/Test Files\s+(?:(\d+) failed \| )?(\d+) passed \((\d+)\)/);
 const tests=log.match(/Tests\s+(?:(\d+) failed \| )?(\d+) passed(?: \| (\d+) skipped)? \((\d+)\)/);
 assert.ok(files&&tests,name);const failed=[...log.matchAll(/FAIL\s+(src\/[\w.-]+\.test\.ts)\s+> ([\s\S]*?)\nAssertionError: ([\s\S]*?)(?=\n\s*❯)/g)].map(m=>({
  file:m[1],test:m[2].replace(/\s+/g,' ').trim(),assertion:m[3].replace(/\s+/g,' ').trim()}));
 return {command:name==='clinical-focused'?'npm.cmd run test --workspace @gamify-surgery/clinical-content -- src/question-new-n3-round4-20261110.test.ts --pool=threads --maxWorkers=2':'npm.cmd run test --workspace @gamify-surgery/clinical-content -- --pool=threads --maxWorkers=2',
  log:dir+'/'+name+'.log',exit:Number(logText(dir+'/'+name+'.exit.txt')),
  files:{passed:Number(files[2]),failed:Number(files[1]??0),total:Number(files[3])},
  tests:{passed:Number(tests[2]),failed:Number(tests[1]??0),skipped:Number(tests[3]??0),total:Number(tests[4])},
  duration:log.match(/Duration\s+([^\n]+)/)?.[1].trim(),failures:failed};
};
const before=summary('clinical-before'),initial=summary('clinical-full'),final=summary('clinical-final'),focused=summary('clinical-focused');
assert.equal(before.failures.length,3);assert.equal(final.failures.length,3);assert.deepEqual(final.failures,before.failures,'All remaining failures must be exact pre-edit failures');
assert.equal(focused.tests.passed,11);assert.equal(focused.tests.failed,0);assert.equal(final.tests.failed,3);
const typeLog=logText(dir+'/typecheck-close.log'),typeExit=Number(logText(dir+'/typecheck-close.exit.txt'));
const workspaces=[...typeLog.matchAll(/> (@gamify-surgery\/[\w-]+)@[^\r\n]* typecheck/g)].map(m=>m[1]);
assert.equal(typeExit,0);assert.equal(workspaces.length,7);assert.ok(!typeLog.includes('error TS'));
const lintLog=logText(dir+'/lint-tests.log'),lintExit=Number(logText(dir+'/lint-tests.exit.txt'));
assert.equal(lintExit,0);assert.ok(/pass 33/.test(lintLog)&&/fail 0/.test(lintLog));
const packet=read(dir+'/packet-receipt.json'),preview=read(dir+'/preview.json');
assert.equal(hash(fs.readFileSync(packet.path)),packet.sha256);assert.equal(packet.lint.findings,0);assert.equal(preview.cases,5);assert.equal(preview.testingEstimates,6);
const validation={generatedOn:'2026-11-10',clinicalBefore:before,clinicalFirstAfter:initial,clinicalFinal:final,clinicalFocused:focused,
 introducedFinalFailures:0,typecheck:{command:'npm.cmd run typecheck',exit:typeExit,workspaces,log:dir+'/typecheck-close.log'},
 lintTests:{command:'npm.cmd run clinical:lint:test',exit:lintExit,passed:33,failed:0,log:dir+'/lint-tests.log'},
 lintPacket:packet.lint,packetSha256:packet.sha256,preview,
 concurrentClinicalTestDelta:{additionalTests:final.tests.total-before.tests.total-focused.tests.total,
  additionalFiles:final.files.total-before.files.total-focused.files.total,file:'packages/clinical-content/src/question-harden1-20261110.test.ts',
  attribution:'Concurrent rewrite lane; new at final scan and absent from intake. Not edited by N3 worker.'},
 historicalOwnCorrection:'Initial typecheck failed one test-only union-narrowing access. Local const retains the same assertion; closing seven workspace checks pass.',
 sourceScope:{existingClinicalFilesUnchanged:protectedGroups.clinical.length,oldN3FilesUnchanged:protectedGroups.oldN3.length,existingDomainRuntimeFilesUnchanged:protectedGroups.domainRuntime.length,
  level5ExistingBoundInputsChanged:[],manifestChanged:false,liveSha256:hash(live),catalogSha256:hash(catalog),globalTimingUnchanged:true},
};
const scope={newLaneFiles:14,existingLaneFiles:1,files:manifest,protectedCounts:Object.fromEntries(Object.entries(protectedGroups).map(([k,v])=>[k,v.length])),
 observedOtherLaneDeltas:delta,missingCapturedFiles:missing,defaultExact:true,manifestExact:true,timingExact:true,level5ExistingBoundInputsChanged:[]};
fs.writeFileSync(dir+'/validation.json',JSON.stringify(validation,null,2)+'\n');
fs.writeFileSync(dir+'/scope-proof.json',JSON.stringify(scope,null,2)+'\n');
console.log(JSON.stringify({clinicalBefore:before.tests,clinicalFinal:final.tests,clinicalFiles:final.files,introducedFinalFailures:0,
 types:workspaces.length,lintTests:33,packetLintFindings:packet.lint.findings,candidatePreviews:preview.cases,newLaneFiles:14,appendOnlyExistingFiles:1,protected:scope.protectedCounts,otherLaneChanges:delta.map(d=>d.path)}));
