import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import '../economy-audit/source-loader.mjs';
const c=await import('../../packages/clinical-content/src/index.ts');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const base='question-topic-acceptance-batch8';
const before=read(`tools/question-quality/fixtures/${base}-before-20261112.json`);
const hash=b=>createHash('sha256').update(b).digest('hex'),digest=v=>hash(JSON.stringify(v));
const live=c.SYNTHETIC_CLINICAL_RELEASE;
assert.equal(digest(c.QUESTION_CATALOG_RELEASE),before.catalogSha256);
assert.deepEqual(c.ANSWER_CHOICE_TIMING_REGISTRY.slice(0,before.timing.length),before.timing,'Every prior timing tuple, order and classification');
for(const r of before.sourceInputs)assert.equal(hash(fs.readFileSync(r.path)),r.sha256,'Immutable source/review '+r.path);
const after={checkedOn:'2026-11-12',defaultSha256:digest(live),manifestSha256:digest(c.QUESTION_SHIP_MANIFEST),
  catalogSha256:digest(c.QUESTION_CATALOG_RELEASE),timingSha256:digest(c.ANSWER_CHOICE_TIMING_REGISTRY),
  counts:{cases:live.cases.length,nodes:live.cases.flatMap(c=>c.decisionNodes).length,meanings:live.concepts.length,
    scoredMeanings:new Set(live.cases.flatMap(c=>c.decisionNodes.map(n=>n.primaryConceptId))).size,
    acceptedRows:c.QUESTION_SHIP_MANIFEST.accepted.length,timingRows:c.ANSWER_CHOICE_TIMING_REGISTRY.length},
  caseHashes:Object.fromEntries(live.cases.map(cs=>[cs.id,digest(cs)])),
  bindings:live.cases.flatMap(cs=>cs.decisionNodes.map(n=>[cs.id,n.id,n.questionVariantId,n.primaryConceptId]))};
const extraPath=`tools/question-quality/fixtures/${base}-additional-before-20261112.json`;
const preimages=[...before.sourcePreimages,...(fs.existsSync(extraPath)?read(extraPath).files:[])];
const files=preimages.map(r=>{assert.equal(hash(r.beforeText),r.beforeSha256);return {...r,afterSha256:hash(fs.readFileSync(r.path))};})
  .filter(r=>r.beforeSha256!==r.afterSha256);
for(const [path,value]of [[`tools/question-quality/fixtures/${base}-after-20261112.json`,after],
  [`tools/question-quality/fixtures/${base}-source-migration-20261112.json`,{checkedOn:'2026-11-12',
    reason:'Exact batch8 integration and strictly reversible historical assertions; original captures retained.',files}]]){
  const text=JSON.stringify(value,null,2)+'\n';if(process.argv.includes('--check'))assert.equal(fs.readFileSync(path,'utf8'),text,path+' drift');else fs.writeFileSync(path,text);
}
console.log(JSON.stringify({counts:after.counts,manifestSha256:after.manifestSha256,defaultSha256:after.defaultSha256,migrated:files.length}));
