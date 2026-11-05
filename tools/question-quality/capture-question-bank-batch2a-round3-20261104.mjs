import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import '../economy-audit/source-loader.mjs';
import {collectAuthoredMetadata} from './bank.mjs';
const path='tools/question-quality/fixtures/question-bank-batch2a-round3-before-20261104.json';
assert(!fs.existsSync(path),'Never overwrite an entry capture');
const c=await import('../../packages/clinical-content/src/index.ts');
const orders=await import('../../packages/game-domain/src/test-choice-orders.ts');
const meta=collectAuthoredMetadata(c),read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const packet=read('docs/research/question-bank-batch2a-round2-20261104.json'),review=read('docs/research/question-bank-batch2a-review2-20261104.json');
assert.equal(packet.length,11);assert.equal(review.filter(r=>r.verdict==='REVISE').length,7);
const files={};
function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=dir+'/'+e.name;if(e.isDirectory()&&!['node_modules','dist','.git'].includes(e.name))walk(p);else if(e.isFile()&&/\.(ts|tsx|mjs|cjs|json|md|png|svg|sql)$/.test(p))files[p]=crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');}}
for(const dir of ['packages/clinical-content/src','packages/game-domain/src','packages/game-domain/tests','packages/balance-config/src','tests/fixtures','tools/qa','apps/player/src','apps/player/public','supabase'])walk(dir);
for(const p of ['docs/clinical/question-authoring-standard.md','docs/research/question-bank-batch2a-round2-20261104.json','docs/research/question-bank-batch2b-20261104.json','docs/research/question-bank-program-queue-20261104.json'])files[p]=crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const data={capturedAt:new Date().toISOString(),scope:'Seven returned batch-2a items only. Four PASS and all batch-2b/new-content versions frozen. Offline authored data and metadata; no private feedback or source text.',release:c.SYNTHETIC_CLINICAL_RELEASE,timings:c.ANSWER_CHOICE_TIMING_REGISTRY,orders:orders.EXACT_TEST_CHOICE_ORDER_RECORDS,questions:Object.fromEntries(meta.questions),claims:Object.fromEntries(meta.claims),sources:Object.fromEntries(meta.sources),conceptMetadata:Object.fromEntries(meta.concepts),packet,review,approvals:c.QUESTION_QUALITY_CLINICAL_APPROVALS,files};
fs.writeFileSync(path,JSON.stringify(data,null,2)+'\n');
console.log(JSON.stringify({path,concepts:data.release.concepts.length,cases:data.release.cases.length,files:Object.keys(files).length,revise:review.filter(r=>r.verdict==='REVISE').map(r=>r.id),pass:review.filter(r=>r.verdict==='PASS').map(r=>r.id)}));
