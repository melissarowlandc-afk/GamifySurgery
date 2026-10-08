// Collect independently launched CLI checks. Does not spawn child processes or
// execute PowerShell scripts (both are restricted in this worker environment).
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {repo,root,rel,hash} from './build-roster.mjs';
const directory=resolve(root,'validation'),prefix='tools/character-mapping/staff-gapfill-v6d/';
const commands=[['roster',[prefix+'validate-roster.mjs','--require-complete']],['placement',[prefix+'validate-placement-qa.mjs','--require-complete']],['worker-review',[prefix+'validate-worker-review.mjs']],['comparisons',[prefix+'validate-all-catalog-comparison.mjs']],['palette',[prefix+'validate-navy-correction.mjs']],['preservation',[prefix+'runtime-baseline.mjs']],['syntax',['--experimental-vm-modules',prefix+'check-syntax.mjs']]];
function read(file){const bytes=readFileSync(file);return (bytes[0]===255&&bytes[1]===254?bytes.subarray(2).toString('utf16le'):bytes.toString('utf8')).replace(/^\ufeff/,'');}
const results=[],lines=[];
for(const [name,args]of commands){
  const stdout=read(resolve(directory,name+'.stdout.txt')),stderr=read(resolve(directory,name+'.stderr.txt'));
  const exitCode=Number(read(resolve(directory,name+'.exit.txt')).trim()),command='node '+args.join(' ');
  const records=stdout.split(/\r?\n/).filter(Boolean).map(line=>JSON.parse(line));
  results.push({command,exitCode,stdout,stderr,records});lines.push('$ '+command,'exit='+exitCode,stdout.trimEnd(),stderr.trimEnd(),'');
}
const passed=results.every(r=>r.exitCode===0&&r.records.length===1&&r.records[0].status==='PASS');
const files=['staging-registry.json','worker-review/visual-review.json','comparison/manifest.json','comparison/all-catalog-manifest.json','placement-qa/placement-manifest.json','alpha-normalization-report.json','validation/navy-palette-results.json','corrections/008-navy-palette-v1/proof-manifest.json'];
const result={schemaVersion:'staff-gapfill-v6d-worker-validation/v1',status:passed?'PASS':'FAIL',runAt:new Date().toISOString(),browserValidation:'not-run-left-to-manager',managerAcceptance:'pending',runtimeReady:false,results,receipts:files.map(f=>({path:rel(resolve(root,f)),sha256:hash(resolve(root,f))}))};
writeFileSync(resolve(directory,'worker-validation.json'),JSON.stringify(result,null,2)+'\n');writeFileSync(resolve(directory,'worker-validation.txt'),lines.join('\n')+'\n');
console.log(JSON.stringify({status:result.status,commands:results.length,exitCodes:results.map(r=>r.exitCode),browserValidation:result.browserValidation,managerAcceptance:result.managerAcceptance,runtimeReady:false}));
assert(passed,'independent worker CLI checks failed; exact output saved');
