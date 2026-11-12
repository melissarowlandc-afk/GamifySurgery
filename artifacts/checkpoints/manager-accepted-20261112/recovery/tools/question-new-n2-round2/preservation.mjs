import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
export const hash=x=>createHash('sha256').update(x).digest('hex');
export function checkPreservation(baseline){
 const dir='.local-dev/question-new-n2-round2-20261104';
 const adjustments=fs.existsSync(dir+'/owned-test-scope-adjustments.json')?JSON.parse(fs.readFileSync(dir+'/owned-test-scope-adjustments.json','utf8')):[];
 const files=(entries,allowTest=false)=>Object.entries(entries).map(([path,sha256])=>{
  const change=allowTest?adjustments.find(x=>x.path===path):null;
  if(change)assert.equal(change.beforeSha256,sha256);
  const current=hash(fs.readFileSync(path));assert.equal(current,change?.afterSha256??sha256,`Unexpected protected file change: ${path}`);
  return {path,sha256,currentSha256:current,unchanged:current===sha256,...(change?{ownedTestScopeAdjustment:change}:{} )};
 });
 const N1=files(baseline.N1Files),originalN2=files(baseline.originalN2Files,true),blocks=[];
 for(const [path,rows]of Object.entries(baseline.N1RegistryBlocks))for(const row of rows){
  const text=fs.readFileSync(path,'utf8');let accepted=row.text,peerChange=null;
  if(!text.includes(accepted)){
   // Read-only comparison of observed concurrent batch-2a round-three aliasing.
   // No clinical data, import, projection expression or other byte may differ.
   if(path.endsWith('/synthetic-content.ts')&&accepted.includes('export const QUESTION_BANK_PRE_BATCH2B_RELEASE =')){
    accepted=accepted.replace('export const QUESTION_BANK_PRE_BATCH2B_RELEASE =','export const QUESTION_BANK_PRE_BATCH2A_ROUND3_RELEASE =');
    peerChange={from:'QUESTION_BANK_PRE_BATCH2B_RELEASE',to:'QUESTION_BANK_PRE_BATCH2A_ROUND3_RELEASE',scope:'Observed concurrent batch2a round3 stable prior-export rename; no edit by this lane.'};
   }else if(path.endsWith('/answer-choice-timing.ts')&&accepted.includes('export const QUESTION_BANK_PRE_BATCH2B_TIMING_ENTRIES =')){
    accepted=accepted.replace('export const QUESTION_BANK_PRE_BATCH2B_TIMING_ENTRIES =','export const QUESTION_BANK_PRE_BATCH2A_ROUND3_TIMING_ENTRIES =');
    peerChange={from:'QUESTION_BANK_PRE_BATCH2B_TIMING_ENTRIES',to:'QUESTION_BANK_PRE_BATCH2A_ROUND3_TIMING_ENTRIES',scope:'Observed concurrent batch2a round3 stable prior-export rename; no edit by this lane.'};
   }
  }
  assert.ok(text.includes(accepted),`Unexpected protected registry-body change: ${path}`);
  blocks.push({path,baselineSha256:row.sha256,currentBodySha256:hash(accepted),byteExact:accepted===row.text,projectionBodyRetained:true,peerChange});
 }
 return {N1,originalN2,blocks,adjustments};
}
