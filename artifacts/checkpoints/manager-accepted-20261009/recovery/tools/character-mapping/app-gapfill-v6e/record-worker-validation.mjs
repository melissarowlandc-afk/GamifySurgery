// Collect CLI checks launched directly by the worker shell. No child spawning.
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {repo,root,tool,rel,hash,verifyRuntimeBaseline} from './build-roster.mjs';
verifyRuntimeBaseline();
const directory=resolve(root,'validation');
const commands=JSON.parse(readFileSync(resolve(tool,'validation-commands.json'),'utf8'));
const results=[],lines=[];
for(const {name,executable,args}of commands){
  const stdoutFile=resolve(directory,name+'.stdout.txt'),stderrFile=resolve(directory,name+'.stderr.txt');
  const stdout=readFileSync(stdoutFile,'utf8'),stderr=readFileSync(stderrFile,'utf8');
  const exitCode=Number(readFileSync(resolve(directory,name+'.exit.txt'),'utf8').trim());
  const command=executable+' '+args.join(' '),records=stdout.split('\n').filter(Boolean).map(line=>JSON.parse(line));
  const timing=JSON.parse(readFileSync(resolve(directory,name+'.timing.json'),'utf8'));
  results.push({name,command,exitCode,...timing,stdout,stderr,records,logs:[stdoutFile,stderrFile].map(f=>({path:rel(f),sha256:hash(f)}))});
  lines.push('$ '+command,'exit='+exitCode,stdout.trimEnd(),stderr.trimEnd(),'');
}
const passed=results.every(r=>r.exitCode===0&&r.records.length===1&&r.records[0].status==='PASS');
const artifacts=['staging-registry.json','worker-review/visual-review.json','comparison/manifest.json','comparison/all-catalog-manifest.json','placement-qa/placement-manifest.json','contact-review/contact-review-manifest.json','alpha-normalization-report.json','review/manager/style-review-manifest.json','review/manager/qa-atlases-manifest.json'];
const tools=['roster.json','runtime-baseline.json','authored-contacts.json','review-acceptance.json','worker-review-notes.json','validation-commands.json'];
const files=[...artifacts.map(f=>resolve(root,f)),...tools.map(f=>resolve(tool,f))];
const result={schemaVersion:'app-gapfill-v6e-worker-validation/v1',status:passed?'PASS':'FAIL',runAt:new Date().toISOString(),browserValidation:'not-run-left-to-manager',managerAcceptance:'pending',runtimeReady:false,results,receipts:files.map(f=>({path:rel(f),sha256:hash(f)}))};
writeFileSync(resolve(directory,'worker-validation.json'),JSON.stringify(result,null,2)+'\n');
writeFileSync(resolve(directory,'worker-validation.txt'),lines.join('\n')+'\n');
verifyRuntimeBaseline();
console.log(JSON.stringify({status:result.status,commands:results.length,exitCodes:results.map(r=>r.exitCode),browserValidation:result.browserValidation,managerAcceptance:result.managerAcceptance,runtimeReady:false}));
assert(passed,'worker CLI checks failed; exact output saved');
