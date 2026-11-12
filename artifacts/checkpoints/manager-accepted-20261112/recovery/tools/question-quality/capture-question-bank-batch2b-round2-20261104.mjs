import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import '../economy-audit/source-loader.mjs';
import {collectAuthoredMetadata} from './bank.mjs';
const output='tools/question-quality/fixtures/question-bank-batch2b-round2-before-20261104.json';assert(!fs.existsSync(output),'Never overwrite intake');
const c=await import('../../packages/clinical-content/src/index.ts'),orders=await import('../../packages/game-domain/src/test-choice-orders.ts');
const meta=collectAuthoredMetadata(c),read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const packet=read('docs/research/question-bank-batch2b-20261104.json'),review=read('docs/research/question-bank-batch2b-review-20261104.json');
assert.equal(packet.length,39);assert.equal(review.length,39);assert.deepEqual(review.filter(r=>r.verdict==='PASS').map(r=>r.id),['B2B06','B2B10']);
const flags=read('docs/research/question-flags-round3-review-20261104.json'),f13=flags.find(r=>r.id==='F13');assert(f13);
const files={};const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=dir+'/'+e.name;if(e.isDirectory()&&!['node_modules','dist','.git'].includes(e.name))walk(p);else if(e.isFile()&&/\.(ts|tsx|mjs|cjs|json|md|png|svg|sql)$/.test(p))files[p]=sha(p);}}
for(const dir of ['packages/clinical-content/src','packages/game-domain/src','packages/game-domain/tests','packages/balance-config/src','tests/fixtures','tools/qa','apps/player/src','apps/player/public','supabase'])walk(dir);
for(const p of ['docs/clinical/question-authoring-standard.md','docs/research/question-bank-batch2a-round3-20261104.json','docs/research/question-bank-batch2b-20261104.json','docs/research/question-bank-batch2b-review-20261104.json','docs/research/question-bank-program-queue-20261104.json'])files[p]=sha(p);
const data={capturedAt:new Date().toISOString(),scope:'37 non-PASS batch-2b items plus F13 only. Exact two PASS, all batch-2a and question-new-* versions retained. No private feedback or source prose.',release:c.SYNTHETIC_CLINICAL_RELEASE,timings:c.ANSWER_CHOICE_TIMING_REGISTRY,orders:orders.EXACT_TEST_CHOICE_ORDER_RECORDS,questions:Object.fromEntries(meta.questions),claims:Object.fromEntries(meta.claims),sources:Object.fromEntries(meta.sources),conceptMetadata:Object.fromEntries(meta.concepts),packet,review,f13,approvals:c.QUESTION_QUALITY_CLINICAL_APPROVALS,files};
fs.writeFileSync(output,JSON.stringify(data,null,2)+'\n');
console.log(JSON.stringify({path:output,concepts:data.release.concepts.length,cases:data.release.cases.length,files:Object.keys(files).length,pass:review.filter(r=>r.verdict==='PASS').map(r=>r.id),returned:review.filter(r=>r.verdict!=='PASS').map(r=>r.id),f13:{variant:f13.after.variantId,liveCandidate:f13.fallback.lastKnownLiveVariantId}}));
