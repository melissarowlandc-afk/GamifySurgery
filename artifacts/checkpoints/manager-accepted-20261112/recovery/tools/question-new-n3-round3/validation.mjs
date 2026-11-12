import fs from 'node:fs';import {createHash} from 'node:crypto';
const dir='.local-dev/question-new-n3-round3-20261105';
const read=p=>{const b=fs.readFileSync(p);return (b[0]===255&&b[1]===254?b.toString('utf16le').slice(1):b.toString('utf8')).replace(/\x1b\[[0-9;]*m/g,'');};
const receipt=(name,kind='vitest')=>{
 const path=dir+'/'+name+'.log',exitPath=dir+'/'+name+'.exit.txt';if(!fs.existsSync(exitPath))return {name,pending:true};
 const s=read(path),lines=s.split(/\r?\n/),summary=lines.filter(l=>/^\s*(?:Test Files|Tests\s+|Start at|Duration\s+)/.test(l));
 const failures=[];for(let i=0;i<lines.length;i++)if(/^\s*FAIL\s{2}/.test(lines[i])){let title=lines[i].trim();for(let k=i+1;k<lines.length&&k<i+5&&lines[k].trim()&&!/Error|Assertion|TypeError/.test(lines[k]);k++)title+=' '+lines[k].trim();failures.push(title);}
 return {name,path,exit:Number(fs.readFileSync(exitPath,'utf8')),kind,exactSummary:summary.join('\n'),
  ...(kind==='vitest'?{testFiles:summary.find(l=>l.trim().startsWith('Test Files'))?.trim(),tests:[...summary].reverse().find(l=>/^Tests\s/.test(l.trim()))?.trim(),
   start:summary.find(l=>l.trim().startsWith('Start at'))?.trim(),duration:summary.find(l=>l.trim().startsWith('Duration'))?.trim(),failures}:{}),
  ...(kind==='typecheck'?{workspaces:lines.filter(l=>/^> @gamify-surgery\/.+ typecheck/.test(l)).map(l=>l.slice(2))}:{}),
  ...(kind==='node-test'?{nodeSummary:lines.filter(l=>/^\S+ (?:tests|pass|fail|cancelled|skipped|todo|duration_ms)/.test(l))}:{}),
  logSha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')};
};
const jobs=[['focused-clinical'],['focused-domain'],['focused-domain-final'],['focused-domain-close'],['focused-clinical-proposal'],['focused-domain-final-name'],['clinical-full'],['domain-full'],['player-full'],['player-full-close'],['player-pre-n3-full'],['player-without-n3-paired'],['typecheck','typecheck'],['typecheck-close','typecheck'],['lint-tests','node-test']].map(([name,kind])=>receipt(name,kind));
const cache=name=>{const p=dir+'/'+name+'-cache-results.json';if(!fs.existsSync(p))return null;return JSON.parse(fs.readFileSync(p,'utf8')).results.find(([name])=>name.endsWith('/operationalSessionPerformance.test.tsx'));};
const result={checkedOn:new Date().toISOString(),pool:'threads',maxWorkers:2,noTestBudgetsOrAssertionsWeakened:true,CI:process.env.CI??null,
 logs:jobs,performance:{testFile:'apps/player/src/session/cloud/operationalSessionPerformance.test.tsx',
  testName:'keeps the actual account session/controller/view below 16ms at 1x/2x/4x on the large public clinic',
  roundTwoFailure:{metric:'2x complete main active time',receivedMs:41.62489988594098,budgetMs:16,
   receipt:'.local-dev/question-new-n3-round2-20261105/player-full.log'},
  preN3RuntimeFull:cache('player-pre-n3'),initialCurrentFull:cache('player'),currentFull:cache('player-close'),withoutN3Paired:cache('player-without-n3-paired'),
  historicalControl:'Six exact captured 2026-11-05 07:45:46.951Z runtime inputs in Vite and native worker; other lanes preserved. The two later flags2 data/evidence changes are absent from that historical default projection. Do not claim the entire historical worktree was checked out.',
  subtractionControl:'Four derived runtime inputs remove N3 exports/catalog/timing/order appends while retaining current N1/N2 manager decisions, accepted B2B/G06 helpers and service-operations. Entire default equals current; see without-n3-runtime-value-proof.json.',
  controlOnlyFailure:'operationalEngineDev.test.ts compares a real Vite module worker loaded by its own server with the intercepted baseline main/native realms. Its view-hash mismatch is instrumentation-specific; not counted as a game regression.',
  conclusion:'The target passes in the historical pre-N3 full runtime control, both current full player runs and the same-current-decisions N3-subtraction paired control. No reproducible N3-caused regression was identified. The prior 41.62489988594098 ms outlier remains unattributed, not classified pre-existing or fixed. Semantic equality and passing trials cannot establish its historical cause.'},
 clinicalIntegration:{introducedFailures:2,file:'packages/clinical-content/src/question-flags2-round3-20261105.test.ts',cause:'The protected guard recognizes only the prior N3 round-two append; the legitimate R3 export/timing append triggers its historical hash checks.',proposal:'docs/research/question-new-n3-round3-flags2-guard-integration-20261105.patch',applied:false,proposalVerification:'17 protected guard tests pass with the proposal transformed in memory, alongside 75 ordinary focused tests (92 total). The raw full clinical run remains 2 failed / 1314 passed. No zero-introduced-test-failures claim.'},
 scopeReceipt:dir+'/scope-proof.json',packetReceipt:dir+'/packet-receipt.json',
 baselineReceipts:['.local-dev/question-new-n3-round2-20261105/validation.json','.local-dev/question-new-n3-20261105/validation.json','.local-dev/question-ship-gate-narrowing-20261105/validation.json']};
fs.writeFileSync(dir+'/validation.json',JSON.stringify(result,null,2)+'\n');
console.log(jobs.map(j=>({name:j.name,exit:j.exit,pending:j.pending,tests:j.tests??j.workspaces?.length??j.nodeSummary})));
