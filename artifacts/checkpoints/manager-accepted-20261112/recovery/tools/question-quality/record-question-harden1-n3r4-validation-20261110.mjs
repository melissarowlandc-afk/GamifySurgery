import fs from 'node:fs';
import assert from 'node:assert/strict';
const root='.local-dev/question-harden1-n3r4-acceptance-20261110/';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const log=name=>{const b=fs.readFileSync(root+name+'.log');return b[0]===255&&b[1]===254?b.subarray(2).toString('utf16le'):b.toString('utf8');};
const command='npm.cmd test -- --pool=threads --maxWorkers=2';
const cases=[
 ['clinical-final','packages/clinical-content',command,'Full clinical suite; three unchanged foreign source-guard failures.'],
 ['clinical-focused-final','packages/clinical-content',command+' src/question-harden1-round2-20261110.test.ts src/question-harden1-n3r4-acceptance-20261110.test.ts','Final13 acceptance/draft tests after the pure deletion-test wording trim.'],
 ['domain-final','packages/game-domain',command,'Full domain suite; retained binding/legacy hash checks, existing registry-expectation omissions, unchanged historical author-stage timeout.'],
 ['domain-admission-final','packages/game-domain',command+' tests/question-new-n3-supply.test.ts tests/question-new-n3-round2-supply.test.ts tests/question-new-n3-round3-supply.test.ts tests/question-ship-gate.test.ts','Final exact historical/current acceptance fixture checks.'],
 ['domain-patient-supply-repeat','packages/game-domain',command+' tests/patient-supply.test.ts','Historical pinned N2 author-stage timeout reproduced; no assertion or timeout edit.'],
 ['player-final','apps/player',command+' src/questionHarden1N3r4SaveCompatibility.test.ts src/questionFlags4SaveCompatibility.test.ts src/questionShipSaveCompatibility.test.ts src/session/cloud/separateCampaign.test.ts src/session/flagFreeze.test.tsx','Final five-file run with existing preload; one unchanged cloud codec limit failure.'],
 ['player-ship-repeat','apps/player',command+' src/questionShipSaveCompatibility.test.ts','33/33 file repeat after earlier five-file contention hit the existing5-second journal budget; final combined run also passes all33.'],
];
const runs=cases.map(([name,cwd,cmd,note])=>{const j=read(root+name+'.json');return {name,cwd,command:cmd+' --reporter=default --reporter=json --outputFile=<local report>',
  report:root+name+'.json',log:root+name+'.log',exitCode:j.numFailedTests?1:0,totalTests:j.numTotalTests,passed:j.numPassedTests,failed:j.numFailedTests,skipped:j.numPendingTests,
  files:j.testResults.length,passedFiles:j.testResults.filter(f=>f.status==='passed').length,failedFiles:j.testResults.filter(f=>f.status==='failed').length,
  exactSummary:log(name).split(/\r?\n/).filter(l=>/^\s*(Test Files|Tests |Start at|Duration )/.test(l)).map(l=>l.trim()),note,
  failures:j.testResults.flatMap(f=>f.assertionResults.filter(t=>t.status==='failed').map(t=>({file:f.name.replaceAll('\\','/').split('/GamifySurgery/')[1],title:t.fullName,
   durationMs:t.duration,message:t.failureMessages[0].split('\n')[0]})))};});
assert.deepEqual(runs.map(r=>[r.name,r.passed,r.failed,r.skipped]),[
 ['clinical-final',1618,3,0],['clinical-focused-final',13,0,0],['domain-final',5226,28,1],['domain-admission-final',319,0,0],['domain-patient-supply-repeat',3,1,0],['player-final',91,1,0],['player-ship-repeat',33,0,0],
]);
const typeText=log('typecheck-final');assert(!/error TS\d/.test(typeText));
const typechecks=[...typeText.matchAll(/> (@gamify-surgery\/[\w-]+)@[^\s]+ typecheck/g)].map(m=>m[1]);assert.equal(typechecks.length,7);
const lintText=log('linter-tests');assert(/pass 33/.test(lintText)&&/fail 0/.test(lintText));
const oldIds=read('tools/question-quality/fixtures/question-harden1-n3r4-acceptance-before-20261110.json').default.conceptIds;
const omitted=[
 'concept.n3.bilateral-carotid-symptom-attribution','concept.n3.postsplenectomy-nodule-function-before-targeting','concept.n3.dysphagia-biopsy-territory-after-negative-endoscopy',
 'concept.n3.tumor-screen-versus-family-test-sequence.v2','concept.n3.gastric-lymphoma-new-large-cell-process.v2','concept.transplant.class-ii-crossmatch-target-and-window.v1',
 'concept.breast.inflammatory-phenotype-after-neoadjuvant-response.v1','concept.mesenteric-ischaemia.post-revascularization-bowel-staging.v1','concept.dialysis-access.symptomatic-central-outflow-assessment.v1',
 'concept.postoperative-delirium.benzodiazepine-withdrawal-exception.v1','concept.biliary-pancreatitis.local-complication-before-cholecystectomy.v1','concept.cholecystectomy.subtotal-type-from-remnant-tissue.v1',
 'concept.diabetic-ketoacidosis.ongoing-insulin-substrate.v1','concept.acid-base.euglycaemic-risk-with-mixed-gas.v1','concept.anorectal-fistula.tract-and-transplant-host-plan.v1',
 'concept.anorectal-fistula.function-before-low-tract-division.v1','concept.nutrition.gastric-versus-postpyloric-delivery.v1','concept.predictive-value.collection-population-denominator.v1',
 'concept.palpable-breast.completed-imaging-clinical-target.v1','concept.phpt.inherited-calcium-before-localization.v2','concept.groin-hernia.ultrasound-compartment-classification.v1'];
assert(omitted.every(id=>oldIds.includes(id)));
const receipt={checkedOn:'2026-11-10',clinicalApproval:false,network:false,git:false,installs:false,deploy:false,rebind:false,runs,
 typecheck:{command:'npm.cmd run typecheck',cwd:'.',exitCode:0,workspaces:typechecks,passed:7,failed:0,log:root+'typecheck-final.log'},
 linter:{command:'npm.cmd run clinical:lint:test',environment:{NODE_NO_WARNINGS:'1'},exitCode:0,passed:33,failed:0,log:root+'linter-tests.log',
  rawAcceptedFindings:0,rawHerniaDraftFindings:1,suppressedFindings:0,advisory:'Complete balanced2x2 convergence; preserved for independent review.'},
 playerEnvironment:{NODE_OPTIONS:'--require=C:/Users/rowla/Projects/GamifySurgery/tools/question-quality/adversarial-r5-player-preload-20261102.cjs',
  scope:'Existing optional Vite Windows drive-mapping probe workaround only; no gameplay, test assertions, timeout or codec-budget substitutions.'},
 preExistingRegistryExpectationOmissions:omitted,
 timeoutEvidence:{file:'packages/game-domain/tests/patient-supply.test.ts',test:'records the current clinical inventory and exact unseen-patient boundary by stage',
  firstFullRun:{status:'passed',durationMs:9970.661800000002,report:root+'domain.json'},finalFullRun:{status:'failed',durationMs:11844.991500000004},
  isolatedRepeat:{status:'failed',durationMs:13069.915800000002},unchangedBudgetMs:10000,
  fixture:'Explicit QUESTION_NEW_N2_ROUND3_PRE_RELEASE through unchanged tests/fixtures/clinical-author-stage.ts, not the new default cases. No selector/routing/timeout edit. The failure remains open; timing origin is not proven by the pass alone.'},
 finalStatus:'All newly added acceptance/frozen-save/draft tests and seven typechecks pass. Full suites remain red with exact residuals above; no claim of an all-green suite.'};
fs.writeFileSync('docs/research/question-harden1-n3r4-validation-20261110.json',JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify({runs:runs.map(({name,passed,failed,skipped})=>({name,passed,failed,skipped})),typechecks:7,lintTests:33,preExistingRegistryOmissions:omitted.length}));
