import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import '../economy-audit/source-loader.mjs';
const c=await import('../../packages/clinical-content/src/index.ts');
const h=await import('../../packages/clinical-content/src/question-harden1-20261110.ts');
const n=await import('../../packages/clinical-content/src/question-new-n3-round4-20261110.ts');
const p='tools/question-quality/fixtures/question-harden1-n3r4-acceptance-before-20261110.json';assert(!fs.existsSync(p),'Never refresh acceptance intake');
const sha=v=>createHash('sha256').update(v).digest('hex'),digest=v=>sha(JSON.stringify(v));
const reviews={harden1:JSON.parse(fs.readFileSync('docs/research/question-harden1-review-20261110.json','utf8')),n3:JSON.parse(fs.readFileSync('docs/research/question-new-n3-round4-review-20261110.json','utf8'))};
const acceptedIds=['H1-03','review.n3.delayed-regurgitation-proximal-anatomic-study.v4','review.n3.venous-ulcer-with-competing-arterial-findings.v4'];
for(const id of acceptedIds)assert.equal([...reviews.harden1,...reviews.n3].find(r=>r.id===id)?.verdict,'PASS',id);
const live=c.SYNTHETIC_CLINICAL_RELEASE,old=live.cases.find(cs=>cs.decisionNodes.some(n=>n.questionVariantId==='question.gs028f.nutrition.refeeding-insulin-phosphate-shift.v3.r2'));assert(old);
const files={},texts={};
for(const dir of ['packages/clinical-content/src','packages/game-domain/src'])for(const name of fs.readdirSync(dir))if(/\.ts$/.test(name)){const path=dir+'/'+name;files[path]=sha(fs.readFileSync(path));if(dir.endsWith('clinical-content/src')||name==='test-choice-orders.ts')texts[path]=fs.readFileSync(path,'utf8');}
for(const path of ['AGENTS.md','package.json','docs/clinical/question-authoring-standard.md','docs/research/question-harden1-20261110.json','docs/research/question-harden1-review-20261110.json','docs/research/question-new-n3-round4-20261110.json','docs/research/question-new-n3-round4-review-20261110.json','apps/player/src/questionFlags4SaveCompatibility.test.ts']){files[path]=sha(fs.readFileSync(path));texts[path]=fs.readFileSync(path,'utf8');}
const shared='docs/handoffs/CURRENT_THREAD_HANDOFF.md';
const record={capturedOn:'2026-11-10',acceptedIds,reviews,files,oldCase:old,
 default:{sha256:digest(live),caseIds:live.cases.map(cs=>cs.id),conceptIds:live.concepts.map(co=>co.id),caseHashes:Object.fromEntries(live.cases.map(cs=>[cs.id,digest(cs)])),conceptHashes:Object.fromEntries(live.concepts.map(co=>[co.id,digest(co)])),cases:live.cases.length,nodes:live.cases.flatMap(cs=>cs.decisionNodes).length,meanings:live.concepts.length},
 manifest:c.QUESTION_SHIP_MANIFEST,manifestSha256:digest(c.QUESTION_SHIP_MANIFEST),catalogSha256:digest(c.QUESTION_CATALOG_RELEASE),timing:c.ANSWER_CHOICE_TIMING_REGISTRY,
 harden1:{source:h.QUESTION_HARDEN1_SOURCE_RELEASE,questions:h.QUESTION_HARDEN1_QUESTIONS,concepts:h.QUESTION_HARDEN1_CONCEPTS,timings:h.QUESTION_HARDEN1_TIMING_ENTRIES,sourceSha256:digest(h.QUESTION_HARDEN1_SOURCE_RELEASE)},
 n3:{source:n.QUESTION_NEW_N3_ROUND4_SOURCE_RELEASE,cases:n.QUESTION_NEW_N3_ROUND4_CASES,questions:n.QUESTION_NEW_N3_ROUND4_QUESTIONS,concepts:n.QUESTION_NEW_N3_ROUND4_AUTHORING_CONCEPTS,reviews:n.QUESTION_NEW_N3_ROUND4_CASE_REVIEWS,timings:n.QUESTION_NEW_N3_ROUND4_TIMING_ENTRIES,orders:n.QUESTION_NEW_N3_ROUND4_CANDIDATE_TEST_ORDER_RECORDS,sourceSha256:digest(n.QUESTION_NEW_N3_ROUND4_SOURCE_RELEASE)},
 sharedHandoffPrefix:{path:shared,bytes:fs.statSync(shared).size,sha256:sha(fs.readFileSync(shared))}};
const local='.local-dev/question-harden1-n3r4-acceptance-20261110';fs.mkdirSync(local,{recursive:true});fs.writeFileSync(local+'/before-source-texts.json',JSON.stringify(texts));
fs.writeFileSync(p,JSON.stringify(record,null,2)+'\n');
console.log(JSON.stringify({default:record.default.sha256,acceptedIds,sourceHashes:[record.harden1.sourceSha256,record.n3.sourceSha256],n3Targets:record.n3.cases.filter(cs=>acceptedIds.some(id=>id===`review.n3.${cs.id.slice(8,-3)}.v4`)).map(cs=>({caseId:cs.id,node:cs.decisionNodes[0].questionVariantId,level:cs.earliestFacilityStage})),files:Object.keys(files).length},null,2));
