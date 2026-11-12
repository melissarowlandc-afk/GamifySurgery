import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const dir='.local-dev/question-stats1-20261108/';
const text=p=>{const b=fs.readFileSync(p);return(b[0]===255&&b[1]===254?b.toString('utf16le'):b.toString('utf8')).replace(/^\ufeff/,'').replace(/\x1b\[[0-9;]*m/g,'');};
const hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const last=(s,re)=>[...s.matchAll(re)].at(-1)?.[1]?.trim()??null;
const jobs=[
 ['clinicalBaseline','clinical-baseline','packages/clinical-content','npm.cmd test -- --pool=threads'],
 ['clinical','clinical-close','packages/clinical-content','npm.cmd test -- --pool=threads'],
 ['typecheck','typecheck-close','.','npm.cmd run typecheck'],
 ['lint','lint-tests','.','npm.cmd run clinical:lint:test'],
];
const results=Object.fromEntries(jobs.map(([id,file,cwd,command])=>{
 const log=dir+file+'.log',s=text(log),exit=Number(text(dir+file+'.exit').trim());assert.equal(exit,0,id+' failed');
 return[id,{cwd,command,logPath:log,logSha256:hash(log),exitCode:exit,fileSummary:last(s,/^\s*Test Files\s+(.+)$/gm),
  testSummary:last(s,/^\s*Tests\s+(.+)$/gm),duration:last(s,/^\s*Duration\s+(.+)$/gm),
  ...(id==='typecheck'?{workspaces:[...s.matchAll(/^> (@gamify-surgery\/\S+)@\S+ typecheck/gm)].map(m=>m[1])}:{}),
  ...(id==='lint'?{tests:Number(last(s,/^.*?tests (\d+)$/gm)),passed:Number(last(s,/^.*?pass (\d+)$/gm)),failed:Number(last(s,/^.*?fail (\d+)$/gm)),durationMs:Number(last(s,/^.*?duration_ms ([\d.]+)$/gm))}:{})}];
}));
assert.equal(results.typecheck.workspaces.length,7);assert.equal(results.lint.tests,33);assert.equal(results.lint.failed,0);
const scope=JSON.parse(fs.readFileSync('docs/research/question-stats1-scope-20261108.json','utf8'));
const report={checkedOn:'2026-11-08',results,
 addedClinicalTests:111,focusedRun:{command:'npm.cmd test -- --pool=threads src/question-stats1-20261108.test.ts src/question-flags3-20261107.test.ts',filesPassed:2,testsPassed:126,failed:0,durationSeconds:6.44},
 mathematicalChecks:'Independently calculated table denominators, sensitivity/specificity/PPV, collection-cohort PPV, prevalence direction, RR/OR, odds-to-risk conversion, ARR/NNT, power/beta, interval null/target inclusion, interval widths, chi-square expected cells, Fisher sparsity and outcome-dependent response denominators.',
 reproductionCommands:['node tools/question-quality/author-question-stats1-20261108.mjs --check',
  'node tools/question-quality/review-question-stats1-20261108.mjs --check','node tools/question-quality/check-question-stats1-20261108.mjs --check'],
 candidateCueLint:{before:55,after:0,variants:64,profileContexts:128,suppressed:0},wordCounts:scope.wordCounts,
 existingRuntimeChanges:[],levelFiveBoundInputChanges:[],shipManifestUnchanged:true,liveReleaseUnchanged:true,
 clinicalApproval:false,reviewGate:'Await independent review and exact manager acceptance. Author checks and green tests are not clinical approval.',
};
const output='docs/research/question-stats1-validation-20261108.json';
if(process.argv.includes('--check'))assert.deepEqual(JSON.parse(fs.readFileSync(output,'utf8')),report);else fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(results,null,2));
