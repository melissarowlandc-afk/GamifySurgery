import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import '../economy-audit/source-loader.mjs';
const c=await import('../../packages/clinical-content/src/index.ts');
const a=await import('../../packages/clinical-content/src/question-new-n4-20261110.ts');
const b=await import('../../packages/clinical-content/src/question-new-n4-round2-20261110.ts');
const sha=x=>createHash('sha256').update(JSON.stringify(x)).digest('hex');
const raw=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const suffixes=['cholecystectomy-neck-plane-bailout.v1','colonic-wall-pattern-after-mucosal-biopsy.v1','venous-ulcer-contralateral-pressure-trap.v1','incisional-pocket-above-retained-mesh.v1',
 'ventral-controlled-enterotomy-mesh-material.v2','unexpected-deep-mass-during-lipoma-excision.v2','ulcer-recurrent-bleeding-after-clips.v2','cholangiogram-lucencies-and-proximal-coverage.v1'];
const reviewPaths=['docs/research/question-new-n4-review-20261110.json','docs/research/question-new-n4-review2-20261110.json'];
const reviews=reviewPaths.map(p=>JSON.parse(fs.readFileSync(p,'utf8')));
const accepted=suffixes.map((s,i)=>{const m=i<4?a:b,p=i<4?'QUESTION_NEW_N4_':'QUESTION_NEW_N4_ROUND2_';
 const q=m[p+'QUESTIONS'].find(q=>q.id==='question.n4.'+s),cs=m[p+'CASES'].find(cs=>cs.decisionNodes.some(n=>n.questionVariantId===q.id));
 const record=reviews[i<4?0:1].find(r=>r.id==='review.n4.'+s);assert.equal(record.verdict,'PASS');
 assert.equal(q.reviewStatus,'needs_clinician_review');assert.equal(q.lastClinicianReview,null);
 return {acceptanceId:record.id,sourceView:i<4?'n4-round1':'n4-round2',sourceReview:reviewPaths[i<4?0:1],case:cs,question:q,
  concept:m[p+'CONCEPTS'].find(co=>co.id===q.conceptId),authoringConcept:m[p+'AUTHORING_CONCEPTS'].find(co=>co.id===q.conceptId),
  timing:m[p+'TIMING_ENTRIES'].find(t=>t.questionVariantId===q.id),orders:m[p+'CANDIDATE_TEST_ORDER_RECORDS'].filter(t=>t.questionVariantId===q.id),
  review:m[p+'CASE_REVIEWS'].find(r=>r.caseId===cs.id),selfCheck:m[p+'SELF_CHECKS'].find(r=>r.reviewId===record.id),
  caseSha256:sha(cs),questionSha256:sha(q)};});
const paths=['packages/clinical-content/src/question-ship-manifest.ts','packages/clinical-content/src/synthetic-content.ts','packages/clinical-content/src/index.ts',
 'packages/clinical-content/src/answer-choice-timing.ts','packages/clinical-content/src/answer-choice-timing.test.ts',
 'packages/clinical-content/src/question-harden1-n3r4-acceptance-test-support.ts','packages/clinical-content/src/question-harden1-n3r4-acceptance-20261110.test.ts',
 'packages/clinical-content/src/question-harden1-round2-20261110.test.ts','packages/clinical-content/src/question-ship-manifest.test.ts','packages/clinical-content/src/pilot-content.test.ts'];
const protectedFiles=Object.fromEntries(fs.readdirSync('packages/clinical-content/src').filter(p=>p.endsWith('.ts')).map(p=>['packages/clinical-content/src/'+p,raw('packages/clinical-content/src/'+p)]));
const runtimeFiles=Object.fromEntries(['packages/game-domain/src','apps/player/src/session'].flatMap(dir=>{
 const result=[];const walk=d=>{for(const ent of fs.readdirSync(d,{withFileTypes:true})){const p=d+'/'+ent.name;if(ent.isDirectory())walk(p);else if(/\.tsx?$/.test(p))result.push([p,raw(p)]);}};walk(dir);return result;}));
const handoff='docs/handoffs/CURRENT_THREAD_HANDOFF.md',text=fs.readFileSync(handoff);
const capture={capturedOn:'2026-11-10',scope:'Immutable pre-acceptance exact eight N4 PASS versions. No source text or clinical rewriting. Runtime hashes are read-only observations; concurrent worker changes are not owned.',
 accepted,sourceViews:{'n4-round1':{sha256:sha(a.QUESTION_NEW_N4_SOURCE_RELEASE),cases:a.QUESTION_NEW_N4_SOURCE_RELEASE.cases.map(cs=>({id:cs.id,sha256:sha(cs)}))},
 'n4-round2':{sha256:sha(b.QUESTION_NEW_N4_ROUND2_SOURCE_RELEASE),cases:b.QUESTION_NEW_N4_ROUND2_SOURCE_RELEASE.cases.map(cs=>({id:cs.id,sha256:sha(cs)}))}},
 reviews:reviewPaths.map(path=>({path,sha256:raw(path)})),
 default:{sha256:sha(c.SYNTHETIC_CLINICAL_RELEASE),caseIds:c.SYNTHETIC_CLINICAL_RELEASE.cases.map(cs=>cs.id),conceptIds:c.SYNTHETIC_CLINICAL_RELEASE.concepts.map(co=>co.id),
 caseHashes:Object.fromEntries(c.SYNTHETIC_CLINICAL_RELEASE.cases.map(cs=>[cs.id,sha(cs)])),conceptHashes:Object.fromEntries(c.SYNTHETIC_CLINICAL_RELEASE.concepts.map(co=>[co.id,sha(co)])),
 counts:{cases:c.SYNTHETIC_CLINICAL_RELEASE.cases.length,nodes:c.SYNTHETIC_CLINICAL_RELEASE.cases.flatMap(cs=>cs.decisionNodes).length,registeredMeanings:c.SYNTHETIC_CLINICAL_RELEASE.concepts.length,
 scoredMeanings:new Set(c.SYNTHETIC_CLINICAL_RELEASE.cases.flatMap(cs=>cs.decisionNodes.map(n=>n.primaryConceptId))).size}},
 catalogSha256:sha(c.QUESTION_CATALOG_RELEASE),manifest:c.QUESTION_SHIP_MANIFEST,manifestSha256:sha(c.QUESTION_SHIP_MANIFEST),timing:c.ANSWER_CHOICE_TIMING_REGISTRY,
 sourcePreimages:paths.map(path=>({path,beforeSha256:raw(path),beforeText:fs.readFileSync(path,'utf8')})),protectedFiles,runtimeFiles,
 sharedHandoffPrefix:{path:handoff,bytes:text.length,sha256:createHash('sha256').update(text).digest('hex')}};
const out='tools/question-quality/fixtures/question-n4-acceptance-before-20261110.json';assert(!fs.existsSync(out),'Never refresh N4 intake');
fs.writeFileSync(out,JSON.stringify(capture,null,2)+'\n');
fs.mkdirSync('.local-dev/question-n4-acceptance-20261110',{recursive:true});
console.log(JSON.stringify({accepted:accepted.length,before:capture.default.counts,newMeanings:accepted.filter(r=>!capture.default.conceptIds.includes(r.concept.id)).map(r=>r.concept.id),
 sourceViews:capture.sourceViews,orders:accepted.flatMap(r=>r.orders).length,lengthResiduals:accepted.filter(r=>r.question.answerChoices.find(c=>c.isCorrect).label.length>Math.max(...r.question.answerChoices.filter(c=>!c.isCorrect).map(c=>c.label.length))).map(r=>({id:r.question.id,lengths:r.question.answerChoices.map(c=>c.label.length)}))}));
