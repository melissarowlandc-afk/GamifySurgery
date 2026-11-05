import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import '../economy-audit/source-loader.mjs';
import {collectAuthoredMetadata} from './bank.mjs';
const path='tools/question-quality/fixtures/question-flags2-round2-before-20261105.json';
assert(!fs.existsSync(path),'Never replace the immutable round-two intake');
const c=await import('../../packages/clinical-content/src/index.ts');
const f=await import('../../packages/clinical-content/src/question-flags2-20261105.ts');
const meta=collectAuthoredMetadata({...c,flags2:f});
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const first=read('tools/question-quality/fixtures/question-flags2-before-20261105.json');
const items=first.items.map(old=>{
 const cs=c.SYNTHETIC_CLINICAL_RELEASE.cases.find(cs=>cs.id===old.clinicalCase.id);
 const n=cs.decisionNodes.find(n=>n.id===old.node.id);
 assert.equal(n.questionVariantId,old.variantId,old.id+' live version moved; inspect before authoring');
 return {...old,clinicalCase:cs,node:n,questions:meta.questions.get(n.questionVariantId)??old.questions};
});
const files={};
function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=dir+'/'+e.name;if(e.isDirectory())walk(p);else if(/\.(?:ts|tsx|mjs|json|md|png)$/.test(p))files[p]=crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');}}
for(const dir of ['packages/clinical-content/src','packages/game-domain/src','packages/game-domain/tests','tools/question-quality/fixtures','docs/research'])walk(dir);
const claims=[...meta.claims.values()].filter(x=>/itp|\bMH\b|malignant.hyperthermia|pregnan|ectopic|asymptomatic.phpt|hypocalciuric|parathyroid|neck.core|neck.fna|ptld|palpable.breast|breast.negative|breast.*ultrasound/i.test(x.id+' '+x.statement));
const sourceIds=new Set(claims.flatMap(x=>x.sourceIds));
const data={capturedAt:new Date().toISOString(),scope:'Flags2 round two; G06 exact PASS acceptance only. G03 directly uses flagged live v1; original G04 stays live. No private feedback/email/source excerpts.',
 release:c.SYNTHETIC_CLINICAL_RELEASE,manifest:c.QUESTION_SHIP_MANIFEST,items,round1:f.QUESTION_FLAGS2_ROUND1_SOURCE_RELEASE,
 round1Definitions:f.QUESTION_FLAGS2_REVISIONS,round1Concepts:f.QUESTION_FLAGS2_AUTHORING_CONCEPTS,
 packet:read('docs/research/question-flags2-20261105.json'),review:read('docs/research/question-flags2-review-20261105.json'),
 claims,sources:[...meta.sources.values()].filter(s=>sourceIds.has(s.id)),questions:Object.fromEntries(meta.questions),
 timings:c.ANSWER_CHOICE_TIMING_REGISTRY,files,
};
fs.writeFileSync(path,JSON.stringify(data,null,2)+'\n');
console.log(JSON.stringify({items:items.map(x=>({id:x.id,caseId:x.clinicalCase.id,variantId:x.variantId})),claims:claims.length,sources:data.sources.length,manifestRows:data.manifest.accepted.length,liveCases:data.release.cases.length},null,2));
