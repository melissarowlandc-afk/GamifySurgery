// Exact native-command receipts. Does not run tests or alter release evidence.
import fs from 'node:fs';
import {createHash} from 'node:crypto';
const dir='.local-dev/question-new-n3-round2-20261105';
const hash=b=>createHash('sha256').update(b).digest('hex');
const read=p=>{const b=fs.readFileSync(p);return (b[0]===255&&b[1]===254?b.toString('utf16le').slice(1):b.toString('utf8')).replace(/\x1b\[[0-9;]*m/g,'');};
function receipt(name){
  const path=dir+'/'+name+'.log',exit=dir+'/'+name+'.exit.txt';
  if(!fs.existsSync(path))return {name,pending:true};
  const text=read(path),failures=[...text.matchAll(/^\s*FAIL\s+(\S+\.test\.[cm]?[jt]sx?)\s*>\s*([^\r\n]*)$/gm)]
    .map(m=>({file:m[1],name:m[2].replace(/\s+/g,' ').trim()}));
  const counts={};for(const f of failures)counts[f.file]=(counts[f.file]??0)+1;
  return {name,path,sha256:hash(fs.readFileSync(path)),finished:fs.existsSync(exit),exit:fs.existsSync(exit)?Number(read(exit).trim()):null,
    summary:text.split(/\r?\n/).filter(l=>/^\s*(Test Files|Tests\s|Duration\s|\u2139 (tests|pass|fail|skipped|duration_ms))/.test(l)),
    workspaceTypechecks:[...text.matchAll(/^> (@gamify-surgery\/\S+) typecheck$/gm)].map(m=>m[1]),
    typeErrors:[...text.matchAll(/^([^\r\n(]+)\((\d+),(\d+)\): error ([A-Z0-9]+): (.*)$/gm)].map(m=>({file:m[1],line:Number(m[2]),column:Number(m[3]),code:m[4],message:m[5]})),
    failuresByFile:counts,failures};
}
const names=['focused-clinical','focused-clinical-final','focused-domain','focused-domain-final','focused-domain-close','inventory-retry','clinical-full','domain-full','domain-full-final','player-full','player-intake-control','player-performance-isolated','player-intake-control-shared','typecheck','typecheck-final','typecheck-fix-final','typecheck-close','lint-tests'];
const runs=names.map(receipt),baseline=JSON.parse(fs.readFileSync('.local-dev/question-new-n3-20261105/validation.json','utf8'));
const finalSelection={clinical:'clinical-full',domain:'domain-full-final',player:'player-full',typecheck:'typecheck-close',lint:'lint-tests',focusedClinical:'focused-clinical-final',focusedDomain:'focused-domain-close'};
const attribution=[];
for(const run of runs.filter(r=>Object.values(finalSelection).includes(r.name)))for(const [file,count]of Object.entries(run.failuresByFile??{})){
  const finalPrevious=baseline.current.filter(r=>Object.values(baseline.finalSelection).includes(r.name)&&r.failuresByFile?.[file]);
  const previous=finalPrevious.length?finalPrevious:baseline.current.filter(r=>r.failuresByFile?.[file]);
  let status='UNRESOLVED',reason=null;
  if(previous.length){status='already failing in pre-round-two full validation';reason='Same failing file/test family is present in the accepted prior milestone; see native earlier logs and its gate/narrowing comparisons.';}
  if(file==='tests/level-five-integration.test.ts')reason='Pre-existing 26 Level 5 evidence/binding failures. No pin/evidence/checkpoint change or rebind in this lane.';
  if(file==='tests/approved-clinical-admission.test.ts')reason='Static 585-meaning fixture predates accepted B2B/G06 additions (current default 598). Complete pre-round-two default reconstruction equals the new default; no N3 meaning enters live.';
  if(file==='src/session/breadButterPresentation.test.ts')reason='The unchanged player-session fixture requires four options; accepted B2B40 has three. Default release is exact before/after this lane.';
  if(file==='tests/patient-supply.test.ts'){status='pre-existing intermittent unchanged-budget inventory timeout';reason='Same 10000ms failure in the pre-N3 accepted narrowing full log and initial N3 full run. This fixture is byte-unchanged and uses the retained pre-N3 release. Supplemental unchanged-budget retry is reported separately, without replacing full-suite counts.';}
  if(file==='src/session/cloud/operationalSessionPerformance.test.tsx'){
    status='UNRESOLVED newly observed full-suite performance-lane failure';
    reason='Full run: 2x main active time 41.62489988594098ms against 16ms. The file is unchanged since the gate/N3 intakes. Earlier full runs passed it. Both current isolated and exact pre-round-two source controls (isolated and paired with the engine differential tests) pass unchanged budgets. Therefore this is not labelled pre-existing, resolved, or proven independent of content growth. apps/player/src/session/** belongs to the concurrent performance lane; no implementation/budget edit here. Manager/performance lane must adjudicate the full-suite margin.';
  }
  attribution.push({run:run.name,file,count,status,reason,priorRuns:previous.map(p=>({path:p.path,sha256:p.sha256,summary:p.summary,count:p.failuresByFile[file],tests:p.failures.filter(f=>f.file===file)})),
    priorAttribution:baseline.attribution.filter(a=>a.file===file&&(finalPrevious.length?Object.values(baseline.finalSelection).includes(a.run):true))});
}
const scopePath=dir+'/scope-proof.json';
const report={capturedAtUtc:new Date().toISOString(),commands:{
  clinical:'npm.cmd run test --workspace @gamify-surgery/clinical-content -- --pool=threads --maxWorkers=2',
  domain:'npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=2',
  player:'npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads --maxWorkers=2 --configLoader native --config ../../.local-dev/question-new-n3-round2-20261105/player-native.config.ts',
  typecheck:'npm.cmd run typecheck',lint:'npm.cmd run clinical:lint:test',packet:'node tools/question-new-n3-round2/review.mjs'},
  finalSelection,runs,attribution,
  priorValidation:'.local-dev/question-new-n3-20261105/validation.json',priorGateComparisons:'.local-dev/question-ship-gate-narrowing-20261105/failure-attribution.json',
  scopeProof:fs.existsSync(scopePath)?{path:scopePath,sha256:hash(fs.readFileSync(scopePath))}:null,
  performanceControl:{test:'src/session/cloud/operationalSessionPerformance.test.tsx',
    config:dir+'/intake-control.vitest.config.mts',nativeWorker:dir+'/intake-control-worker.mjs',
    mainLoadReceipt:dir+'/intake-control-main.json',nativeLoadReceipts:fs.readdirSync(dir).filter(n=>/^intake-control-worker-\d+\.json$/.test(n)).map(n=>dir+'/'+n),
    method:'Four exact intake runtime files are substituted in memory in Vite and the native worker. The main test-support worker URL is redirected in memory; no managed file is restored or edited. Same test, fixture, assertions, 16ms budget and threads/maxWorkers2. All trial outcomes retained; no retry replaces the failed full result.',
    control:'player-intake-control',currentIsolated:'player-performance-isolated',sharedControl:'player-intake-control-shared',
    limitation:'Passing isolated controls do not clear or establish the cause of the full-suite performance failure.'},
  ownInitialFailures:{'focused-clinical':'33 demographic metadata mismatches corrected in the new revision inputs; original draft/PASS untouched.',
    'domain-full':'One retained N3 v1 test-order inventory source was missing from the fixture union. Added the forty real retained v1 cases, with every orphan/label/timing/route assertion intact. Final focused 97/97 and final full run reported separately.',
    typecheck:'New choice tuple typing and a test tuple inference corrected. Final typecheck shown separately; original failed receipts retained.'},
  limitations:'No focused pass silently replaces a full-run result; no budgets, timeouts or clinical assertions weakened. Source/author checks are not independent editorial or clinician approval.'};
fs.writeFileSync(dir+'/validation.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({runs:runs.map(r=>({name:r.name,pending:r.pending,finished:r.finished,exit:r.exit,summary:r.summary})),attribution:attribution.map(a=>({run:a.run,file:a.file,count:a.count,status:a.status}))},null,2));
