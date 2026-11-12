import fs from 'node:fs';
import assert from 'node:assert/strict';
const root='.local-dev/question-n4-acceptance-20261110/';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const log=name=>{const b=fs.readFileSync(root+name+'.log');return b[0]===255&&b[1]===254?b.subarray(2).toString('utf16le'):b.toString('utf8');};
const test='npm.cmd test -- --pool=threads --maxWorkers=2';
const spec=[
 ['clinical-baseline-guards','packages/clinical-content',test+' src/question-flags3-20261107.test.ts src/question-stats1-20261108.test.ts src/question-stats1-acceptance-20261108.test.ts','Before integration: immutable baseline for three foreign source guards.'],
 ['clinical-full','packages/clinical-content',test,'All clinical tests including eight new exact acceptance tests.'],
 ['domain-full','packages/game-domain',test,'No domain runtime/test file edited. Order inventory remains red pending the explicitly deferred runtime bindings.'],
 ['player-focused','apps/player',test+' src/questionN4SaveCompatibility.test.ts src/questionHarden1N3r4SaveCompatibility.test.ts src/questionFlags4SaveCompatibility.test.ts src/questionShipSaveCompatibility.test.ts src/session/cloud/separateCampaign.test.ts src/session/flagFreeze.test.tsx','Six-file run: new sourced format3/journal tests and earlier frozen/save/flag witnesses.'],
 ['player-n4-final','apps/player',test+' src/questionN4SaveCompatibility.test.ts','Final9 source/save tests after strengthening seeded histories to use actual older question versions for all six reused meanings.'],
];
const runs=spec.map(([name,cwd,command,note])=>{const j=read(root+name+'.json');return {name,cwd,command:command+' --reporter=default --reporter=json --outputFile=<local report>',report:root+name+'.json',log:root+name+'.log',
 exitCode:j.numFailedTests?1:0,passed:j.numPassedTests,failed:j.numFailedTests,skipped:j.numPendingTests,total:j.numTotalTests,files:j.testResults.length,
 passedFiles:j.testResults.filter(f=>f.status==='passed').length,failedFiles:j.testResults.filter(f=>f.status==='failed').length,note,
 exactSummary:log(name).split(/\r?\n/).filter(l=>/^\s*(Test Files|Tests |Start at|Duration )/.test(l)).map(l=>l.trim()),
 failures:j.testResults.flatMap(f=>f.assertionResults.filter(t=>t.status==='failed').map(t=>({file:f.name.replaceAll('\\','/').split('/GamifySurgery/')[1],title:t.fullName,durationMs:t.duration,message:t.failureMessages[0].split('\n')[0]})))};});
const baseline=runs[0].failures,clinical=runs[1].failures;
assert.equal(baseline.length,3);assert.deepEqual(clinical.map(({durationMs,...r})=>r),baseline.map(({durationMs,...r})=>r));
assert.equal(runs[1].passed,1668);assert.equal(runs[1].failed,3);assert.equal(runs[3].passed,100);assert.equal(runs[3].failed,1);assert.equal(runs[4].passed,9);assert.equal(runs[4].failed,0);
const types=log('typecheck');assert(!/error TS\d/.test(types));const workspaces=[...types.matchAll(/> (@gamify-surgery\/[\w-]+)@[^\s]+ typecheck/g)].map(m=>m[1]);assert.equal(workspaces.length,7);
const lint=log('linter-tests');assert(/pass 33/.test(lint)&&/fail 0/.test(lint));
const domain=runs[2],orderFailure=domain.failures.find(f=>f.file.endsWith('test-choice-order-inventory.test.ts'));
assert(orderFailure,'Runtime diagnostic installation is deferred by lane authority, not bypassed in tests');
const output={checkedOn:'2026-11-10',clinicalApproval:false,domainRuntimeEdited:false,network:false,git:false,agents:false,installs:false,deploy:false,rebind:false,
 runs,clinicalFailuresMatchPreEditBaseline:true,
 typecheck:{command:'npm.cmd run typecheck',cwd:'.',exitCode:0,passed:7,failed:0,workspaces,log:root+'typecheck.log'},
 linter:{command:'npm.cmd run clinical:lint:test',environment:{NODE_NO_WARNINGS:'1'},exitCode:0,passed:33,failed:0,rawAcceptedVariantFindings:0,suppressedFindings:0,log:root+'linter-tests.log'},
 playerEnvironment:{NODE_OPTIONS:'--require=C:/Users/rowla/Projects/GamifySurgery/tools/question-quality/adversarial-r5-player-preload-20261102.cjs',scope:'Existing optional Windows Vite drive-mapping probe workaround; no gameplay, assertion, timeout or codec-budget changes.'},
 domainFailureGroups:{levelFiveBindingAndLegacyLoadHashes:domain.failures.filter(f=>f.file.endsWith('level-five-integration.test.ts')).length,
  staleRegistryExpectation:{tests:domain.failures.filter(f=>f.file.endsWith('approved-clinical-admission.test.ts')).length,detail:'The expectation still lists587 while the actual registry has610. Twenty-one omissions existed before this milestone; two newly added N4r2 meanings must also be added by the domain fixture owner.'},
  historicalPatientSupply:{tests:domain.failures.filter(f=>f.file.endsWith('patient-supply.test.ts')).length,detail:'Existing10000ms budget, unchanged explicit N2 historical author-stage pool; no selector or timeout edit. Exact elapsed time is in failures.'},
  pendingN4RuntimeOrderInventory:{tests:1,firstFailure:orderFailure,requiredExport:'QUESTION_N4_ACCEPTED_TEST_ORDER_RECORDS',requiredRows:8,
   target:'packages/game-domain/src/test-choice-orders.ts:EXACT_TEST_CHOICE_ORDER_RECORDS',cause:'Eight correct metadata tuples are exported but intentionally not installed because runtime is the domain worker lane. Do not weaken the inventory assertion or add circular result gates.'}},
 currentLimit:'Manifest/content integration and all new admission/frozen-save tests pass. Full domain remains red; hand the one wound affinity and eight diagnostic bindings to the runtime owner before considering release integration complete.'};
fs.writeFileSync('docs/research/question-n4-validation-20261110.json',JSON.stringify(output,null,2)+'\n');
console.log(JSON.stringify({runs:runs.map(({name,passed,failed,skipped})=>({name,passed,failed,skipped})),typechecks:7,lintTests:33,baselineFailuresExact:true}));
