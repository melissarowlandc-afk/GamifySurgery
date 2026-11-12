import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import '../economy-audit/source-loader.mjs';
import {collectAuthoredMetadata} from './bank.mjs';
const target='tools/question-quality/fixtures/question-flags2-round3-before-20261105.json';
assert(!fs.existsSync(target),'Intake capture already exists; do not refresh it');
const c=await import('../../packages/clinical-content/src/index.ts');
const r=await import('../../packages/clinical-content/src/question-flags2-round2-20261105.ts');
const sha=v=>createHash('sha256').update(typeof v==='string'?v:JSON.stringify(v)).digest('hex');
const fileHash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const files={};
for(const dir of ['packages/clinical-content/src','tools/question-quality','docs/research','docs/execplans']){
 for(const name of fs.readdirSync(dir)){
  const p=dir+'/'+name;
  if(fs.statSync(p).isFile()&&!name.includes('round3')&&(/question-flags2/.test(name)||['index.ts','synthetic-content.ts','answer-choice-timing.ts','question-ship-manifest.ts','question-ship-projection.ts'].includes(name)))files[p]=fileHash(p);
 }
}
const meta=collectAuthoredMetadata(c),review=JSON.parse(fs.readFileSync('docs/research/question-flags2-review2-20261105.json','utf8'));
const packet=JSON.parse(fs.readFileSync('docs/research/question-flags2-round2-20261105.json','utf8'));
const fallback=packet.map(p=>{const cs=c.SYNTHETIC_CLINICAL_RELEASE.cases.find(x=>x.id===p.caseId);return {id:p.id,clinicalCase:cs,node:cs.decisionNodes.find(n=>n.id===p.nodeId)};});
const data={capturedOn:'2026-11-05',scope:'Immutable round-three intake. No external source retrieval or private feedback ingestion.',
 review,packet,source:r.QUESTION_FLAGS2_ROUND2_SOURCE_RELEASE,definitions:r.QUESTION_FLAGS2_ROUND2_REVISIONS,
 concepts:r.QUESTION_FLAGS2_ROUND2_AUTHORING_CONCEPTS,timings:r.QUESTION_FLAGS2_ROUND2_TIMING_ENTRIES,
 questions:Object.fromEntries(meta.questions),fallback,
 live:{id:c.SYNTHETIC_CLINICAL_RELEASE.id,cases:c.SYNTHETIC_CLINICAL_RELEASE.cases.length,nodes:c.SYNTHETIC_CLINICAL_RELEASE.cases.reduce((n,x)=>n+x.decisionNodes.length,0),
  sha256:sha(c.SYNTHETIC_CLINICAL_RELEASE),conceptsSha256:sha(c.SYNTHETIC_CLINICAL_RELEASE.concepts)},
 manifest:c.QUESTION_SHIP_MANIFEST,manifestSha256:sha(c.QUESTION_SHIP_MANIFEST),timingSha256:sha(c.ANSWER_CHOICE_TIMING_REGISTRY),files};
fs.writeFileSync(target,JSON.stringify(data,null,2)+'\n');
console.log(JSON.stringify({target,reviewItems:review.length,files:Object.keys(files).length,live:data.live},null,2));
