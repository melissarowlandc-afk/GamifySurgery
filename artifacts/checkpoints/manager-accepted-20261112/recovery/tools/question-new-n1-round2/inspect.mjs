import '../economy-audit/source-loader.mjs';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const dir='.local-dev/question-new-n1-round2-20261104';
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
fs.mkdirSync(dir,{recursive:true});
assert.ok(!fs.existsSync(`${dir}/baseline.json`),'Preserve the existing round-two intake baseline.');
const n1=await import('../../packages/clinical-content/src/question-new-n1-20261104.ts');
const content=await import('../../packages/clinical-content/src/index.ts');
const reviewPath='docs/research/question-new-n1-review-20261104.json';
const reviews=JSON.parse(fs.readFileSync(reviewPath,'utf8'));
const passes=reviews.filter(r=>r.verdict==='PASS');assert.equal(passes.length,2);
const paths=root=>fs.readdirSync(root,{withFileTypes:true}).flatMap(e=>e.isDirectory()?paths(`${root}/${e.name}`):[`${root}/${e.name}`]);
const n2Paths=['packages/clinical-content/src','packages/game-domain/src','packages/game-domain/tests','docs/research','tools/question-new-n2']
  .flatMap(paths).filter(p=>p.includes('question-new-n2')||p.includes('sources-question-new-n2'));
const n1Paths=['packages/clinical-content/src','docs/research'].flatMap(paths)
  .filter(p=>(p.includes('question-new-n1-')||p.includes('sources-question-new-n1-'))&&!p.includes('round2'));
const registry=['packages/clinical-content/src/index.ts','packages/clinical-content/src/synthetic-content.ts',
  'packages/clinical-content/src/answer-choice-timing.ts','packages/game-domain/src/test-choice-orders.ts'];
fs.mkdirSync(`${dir}/registry-before`,{recursive:true});
for(const p of registry)fs.copyFileSync(p,`${dir}/registry-before/${p.split('/').at(-1)}`);
const frozenPasses=passes.map(r=>{
  const i=n1.QUESTION_NEW_N1_CASE_REVIEWS.findIndex(row=>row.id===r.id);assert.ok(i>=0);
  return{reviewId:r.id,caseId:n1.QUESTION_NEW_N1_CASES[i].id,conceptId:n1.QUESTION_NEW_N1_ITEMS[i].conceptId,
    item:n1.QUESTION_NEW_N1_ITEMS[i],question:n1.QUESTION_NEW_N1_QUESTIONS[i],clinicalCase:n1.QUESTION_NEW_N1_CASES[i],
    itemSha256:hash(JSON.stringify(n1.QUESTION_NEW_N1_ITEMS[i])),questionSha256:hash(JSON.stringify(n1.QUESTION_NEW_N1_QUESTIONS[i])),
    caseSha256:hash(JSON.stringify(n1.QUESTION_NEW_N1_CASES[i]))};
});
const watched=['packages/clinical-content/src','packages/game-domain/src','packages/game-domain/tests','apps/player/src','tools/question-quality']
  .flatMap(paths).filter(p=>/\.(?:ts|tsx|mjs|json)$/.test(p));
const baseline={capturedAt:new Date().toISOString(),reviewPath,reviewSha256:hash(fs.readFileSync(reviewPath)),
  N1Files:Object.fromEntries(n1Paths.map(p=>[p,hash(fs.readFileSync(p))])),
  N2Files:Object.fromEntries(n2Paths.map(p=>[p,hash(fs.readFileSync(p))])),frozenPasses,
  files:Object.fromEntries(watched.map(p=>[p,hash(fs.readFileSync(p))])),
  releaseSha256:hash(JSON.stringify(content.SYNTHETIC_CLINICAL_RELEASE)),
  counts:{concepts:content.SYNTHETIC_CLINICAL_RELEASE.concepts.length,cases:content.SYNTHETIC_CLINICAL_RELEASE.cases.length},
};
fs.writeFileSync(`${dir}/baseline.json`,JSON.stringify(baseline,null,2)+'\n');
fs.writeFileSync(`${dir}/original-items.json`,JSON.stringify(n1.QUESTION_NEW_N1_ITEMS,null,2)+'\n');
fs.writeFileSync(`${dir}/original-cases.json`,JSON.stringify(n1.QUESTION_NEW_N1_CASES,null,2)+'\n');
const catalog=JSON.parse(fs.readFileSync('.local-dev/question-new-n2-20261104/catalog-before.json','utf8'));
fs.writeFileSync(`${dir}/recorded-catalog.json`,JSON.stringify(catalog,null,2)+'\n');
console.log(JSON.stringify({N1:40,returned:38,frozenPasses:frozenPasses.map(r=>r.reviewId),N2FrozenFiles:n2Paths.length,
  catalogClaims:catalog.claims.length,counts:baseline.counts},null,2));
