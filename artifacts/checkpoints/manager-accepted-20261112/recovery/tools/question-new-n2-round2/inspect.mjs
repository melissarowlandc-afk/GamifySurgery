// One-shot, offline intake. Never recapture or overwrite the baseline.
import '../economy-audit/source-loader.mjs';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const dir='.local-dev/question-new-n2-round2-20261104';
const hash=x=>createHash('sha256').update(x).digest('hex');
const paths=root=>fs.readdirSync(root,{withFileTypes:true}).flatMap(e=>e.isDirectory()?paths(`${root}/${e.name}`):[`${root}/${e.name}`]);
fs.mkdirSync(dir,{recursive:true});
assert.ok(!fs.existsSync(`${dir}/baseline.json`),'Preserve the existing round-two baseline.');
const content=await import('../../packages/clinical-content/src/index.ts');
const old=await import('../../packages/clinical-content/src/question-new-n2-20261104.ts');
const {collectAuthoredMetadata}=await import('../question-quality/bank.mjs');
const reviewPath='docs/research/question-new-n2-review-20261104.json';
const review=JSON.parse(fs.readFileSync(reviewPath,'utf8'));
assert.equal(review.length,39);assert.equal(review.filter(r=>r.verdict==='REVISE').length,37);
const passes=review.filter(r=>r.verdict==='PASS');assert.equal(passes.length,2);
const roots=['packages/clinical-content/src','packages/game-domain/src','packages/game-domain/tests','docs/research','tools/question-new-n1','tools/question-new-n1-round2','tools/question-new-n2','apps/player/public/clinical-exhibits'];
const inventory=roots.filter(r=>fs.existsSync(r)).flatMap(paths);
const N1Paths=inventory.filter(p=>p.includes('question-new-n1-')||p.includes('question-new-n1-r2-')||p.startsWith('tools/question-new-n1/'));
const N2Paths=inventory.filter(p=>(p.includes('question-new-n2-')||p.startsWith('tools/question-new-n2/'))&&!p.includes('round2'));
const registry=['packages/clinical-content/src/index.ts','packages/clinical-content/src/synthetic-content.ts',
  'packages/clinical-content/src/answer-choice-timing.ts','packages/game-domain/src/test-choice-orders.ts'];
fs.mkdirSync(`${dir}/registry-before`,{recursive:true});
for(const path of registry)fs.copyFileSync(path,`${dir}/registry-before/${path.split('/').at(-1)}`);
const blocks=Object.fromEntries(registry.map(path=>{
 const s=fs.readFileSync(path,'utf8');return[path,[...s.matchAll(/^[ \t]*\/\/ BEGIN N1(?: ROUND2)? append[^\n]*\n[\s\S]*?^[ \t]*\/\/ END N1(?: ROUND2)? append[^\n]*(?:\n|$)/gm)].map(m=>({sha256:hash(m[0]),text:m[0]}))];
}));
const frozenPasses=passes.map(r=>{
 const i=old.QUESTION_NEW_N2_CASE_REVIEWS.findIndex(x=>x.id===r.id);assert.ok(i>=0);
 return{reviewId:r.id,caseId:old.QUESTION_NEW_N2_CASES[i].id,itemSha256:hash(JSON.stringify(old.QUESTION_NEW_N2_ITEMS[i])),
  questionSha256:hash(JSON.stringify(old.QUESTION_NEW_N2_QUESTIONS[i])),caseSha256:hash(JSON.stringify(old.QUESTION_NEW_N2_CASES[i]))};
});
const watched=['packages/clinical-content/src','packages/game-domain/src','packages/game-domain/tests','apps/player/src','packages/balance-config/src','tests/fixtures','tools/question-quality'].flatMap(paths).filter(p=>/\.(?:ts|tsx|mjs|json)$/.test(p));
const baseline={capturedAt:new Date().toISOString(),reviewPath,reviewSha256:hash(fs.readFileSync(reviewPath)),
 N1Files:Object.fromEntries(N1Paths.map(p=>[p,hash(fs.readFileSync(p))])),N1RegistryBlocks:blocks,
 originalN2Files:Object.fromEntries(N2Paths.map(p=>[p,hash(fs.readFileSync(p))])),frozenPasses,
 files:Object.fromEntries(watched.map(p=>[p,hash(fs.readFileSync(p))])),
 releaseSha256:hash(JSON.stringify(content.SYNTHETIC_CLINICAL_RELEASE)),
 counts:{registered:content.SYNTHETIC_CLINICAL_RELEASE.concepts.length,cases:content.SYNTHETIC_CLINICAL_RELEASE.cases.length}};
fs.writeFileSync(`${dir}/baseline.json`,JSON.stringify(baseline,null,2)+'\n');
fs.writeFileSync(`${dir}/original-items.json`,JSON.stringify(old.QUESTION_NEW_N2_ITEMS,null,2)+'\n');
fs.writeFileSync(`${dir}/original-cases.json`,JSON.stringify(old.QUESTION_NEW_N2_CASES,null,2)+'\n');
const metadata=collectAuthoredMetadata(content);
const catalog={claims:[...metadata.claims.values()],sources:[...metadata.sources.values()],concepts:[...metadata.concepts.values()]};
fs.writeFileSync(`${dir}/recorded-catalog.json`,JSON.stringify(catalog,null,2)+'\n');
fs.writeFileSync(`${dir}/claims-inventory.txt`,catalog.claims.map(c=>`${c.id} | ${c.statement}`).join('\n')+'\n');
const review7Path='docs/research/question-batch1-adversarial-review7-20261102.json';
const batchPath='docs/research/question-batch1-20261102.json';
const br=JSON.parse(fs.readFileSync(review7Path,'utf8')),bp=JSON.parse(fs.readFileSync(batchPath,'utf8'));
const passedIds=new Set(br.filter(r=>r.verdict==='PASS').map(r=>r.id));assert.equal(passedIds.size,68);
const found=new Map();
function walk(x,path,source){
 if(!x||typeof x!=='object')return;
 if(x.id&&passedIds.has(x.id)&&x.after)found.set(x.id,{id:x.id,source,path,after:x.after,inference:x.inference??null});
 for(const[k,v]of Object.entries(x))if(v&&typeof v==='object')Array.isArray(v)?v.forEach((y,i)=>walk(y,`${path}.${k}[${i}]`,source)):walk(v,`${path}.${k}`,source);
}
walk(bp,'$',batchPath);
// Review seven combines the main batch, contexts and five prior-pilot companions.
// Resolve companions from their actual recorded review packet, never infer fields.
for(const file of ['docs/research/question-round3-20261102.json','docs/research/question-review-context-20261102.json'])if(fs.existsSync(file))walk(JSON.parse(fs.readFileSync(file,'utf8')),'$',file);
const missing=[...passedIds].filter(id=>!found.has(id));
const calibration=[...passedIds].map(id=>({id,review:br.find(r=>r.id===id),projection:found.get(id)??null}));
fs.writeFileSync(`${dir}/calibration-exemplars.json`,JSON.stringify({reviewPath:review7Path,reviewSha256:hash(fs.readFileSync(review7Path)),
 sourcePackets:[...new Set([...found.values()].map(v=>v.source))].map(path=>({path,sha256:hash(fs.readFileSync(path))})),matched:68-missing.length,missing,items:calibration},null,2)+'\n');
console.log(JSON.stringify({N2:39,returned:37,frozenPasses,N1Files:N1Paths.length,originalN2Files:N2Paths.length,
 registered:baseline.counts.registered,claims:catalog.claims.length,sources:catalog.sources.length,calibrationMatched:68-missing.length,calibrationMissing:missing},null,2));
