import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import '../economy-audit/source-loader.mjs';

const c=await import('../../packages/clinical-content/src/index.ts');
const f=await import('../../packages/clinical-content/src/question-flags4-20261108.ts');
const path='tools/question-quality/fixtures/question-flags4-acceptance-before-20261108.json';
assert(!fs.existsSync(path),'Never refresh an immutable acceptance intake');
const sha=value=>createHash('sha256').update(value).digest('hex'),digest=value=>sha(JSON.stringify(value));
const review=JSON.parse(fs.readFileSync('docs/research/question-flags4-review-20261108.json','utf8'));
assert.equal(review.length,1);assert.equal(review[0].id,'F4-01');assert.equal(review[0].verdict,'REVISE');assert.equal(review[0].ownerNoteResolved,true);
const files={},texts={};
function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=dir+'/'+e.name;if(e.isDirectory())walk(p);else if(/\.(ts|tsx|mjs|json)$/.test(e.name)){files[p]=sha(fs.readFileSync(p));if(/\.(ts|mjs)$/.test(e.name)&&dir==='packages/clinical-content/src')texts[p]=fs.readFileSync(p,'utf8');}}}
for(const dir of ['packages/clinical-content/src','packages/game-domain/src','packages/balance-config/src','tools/question-quality'])walk(dir);
for(const p of ['AGENTS.md','package.json','docs/clinical/question-authoring-standard.md','docs/research/question-flags4-20261108.json','docs/research/question-flags4-handoff-20261108.md','docs/research/question-flags4-review-20261108.json'])files[p]=sha(fs.readFileSync(p));
const live=c.SYNTHETIC_CLINICAL_RELEASE,shared='docs/handoffs/CURRENT_THREAD_HANDOFF.md';
const record={capturedOn:'2026-11-08',purpose:'Immutable pre-flags4-acceptance epoch; no external source text, private feedback or email.',
 default:{sha256:digest(live),caseHashes:Object.fromEntries(live.cases.map(cs=>[cs.id,digest(cs)])),conceptHashes:Object.fromEntries(live.concepts.map(co=>[co.id,digest(co)])),
  caseIds:live.cases.map(cs=>cs.id),conceptIds:live.concepts.map(co=>co.id),caseCount:live.cases.length,nodeCount:live.cases.flatMap(cs=>cs.decisionNodes).length,meaningCount:live.concepts.length},
 catalogSha256:digest(c.QUESTION_CATALOG_RELEASE),manifest:c.QUESTION_SHIP_MANIFEST,manifestSha256:digest(c.QUESTION_SHIP_MANIFEST),
 timing:c.ANSWER_CHOICE_TIMING_REGISTRY,timingSha256:digest(c.ANSWER_CHOICE_TIMING_REGISTRY),review,
 reviewedSource:f.QUESTION_FLAGS4_SOURCE_RELEASE,reviewedSourceSha256:digest(f.QUESTION_FLAGS4_SOURCE_RELEASE),reviewedQuestions:f.QUESTION_FLAGS4_QUESTIONS,
 retainedInput:f.QUESTION_FLAGS4_RETAINED_INPUT,files,
 sharedHandoffPrefix:{path:shared,bytes:fs.statSync(shared).size,sha256:sha(fs.readFileSync(shared))}};
const local='.local-dev/question-flags4-acceptance-20261108';fs.mkdirSync(local,{recursive:true});
fs.writeFileSync(local+'/before-source-texts.json',JSON.stringify(texts));
fs.writeFileSync(path,JSON.stringify(record,null,2)+'\n');
console.log(JSON.stringify({path,protectedFiles:Object.keys(files).length,default:record.default.sha256,manifestRows:record.manifest.accepted.length,reviewedSource:record.reviewedSourceSha256},null,2));
