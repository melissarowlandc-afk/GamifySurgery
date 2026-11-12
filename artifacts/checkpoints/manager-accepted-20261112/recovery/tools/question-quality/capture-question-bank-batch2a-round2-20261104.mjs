import fs from 'node:fs';
import crypto from 'node:crypto';
import '../economy-audit/source-loader.mjs';
import {collectAuthoredMetadata} from './bank.mjs';
const path='tools/question-quality/fixtures/question-bank-batch2a-round2-before-20261104.json';
if(fs.existsSync(path))throw new Error('Immutable round-two baseline already exists');
const c=await import('../../packages/clinical-content/src/index.ts'),d=await import('../../packages/game-domain/src/test-choice-orders.ts'),m=collectAuthoredMetadata(c),files={};
function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=dir+'/'+e.name;if(e.isDirectory()&&!['node_modules','.git','dist'].includes(e.name))walk(p);else if(e.isFile()&&/\.(ts|tsx|mjs|cjs|json|md|png|svg|sql)$/.test(p))files[p]=crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');}}
for(const dir of ['packages/clinical-content/src','packages/game-domain/src','packages/game-domain/tests','packages/balance-config/src','tests/fixtures','tools/qa','apps/player/src','apps/player/public','supabase'])walk(dir);
const packet=JSON.parse(fs.readFileSync('docs/research/question-bank-batch2a-20261104.json','utf8'));
const snapshot={capturedAt:new Date().toISOString(),policy:'Synthetic definitions, bibliographic records, independently authored claims and already sanitized review packet. No private feedback/emails, source prose, network or Git.',release:c.SYNTHETIC_CLINICAL_RELEASE,questions:Object.fromEntries(m.questions),claims:Object.fromEntries(m.claims),sources:Object.fromEntries(m.sources),conceptMetadata:Object.fromEntries(m.concepts),packet,review:JSON.parse(fs.readFileSync('docs/research/question-bank-batch2a-review-20261104.json','utf8')),approvals:c.QUESTION_QUALITY_CLINICAL_APPROVALS,timings:c.ANSWER_CHOICE_TIMING_REGISTRY,orders:d.EXACT_TEST_CHOICE_ORDER_RECORDS,files};
const body=JSON.stringify(snapshot,null,2)+'\n';if(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(body))throw new Error('Unexpected email-like value');fs.writeFileSync(path,body);
console.log(JSON.stringify({path,concepts:snapshot.release.concepts.length,cases:snapshot.release.cases.length,files:Object.keys(files).length,review: snapshot.review.map(x=>({id:x.id,verdict:x.verdict}))}));
