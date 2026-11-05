import fs from 'node:fs';
import crypto from 'node:crypto';
import '../economy-audit/source-loader.mjs';
import {collectAuthoredMetadata} from './bank.mjs';
const path='tools/question-quality/fixtures/question-flags-round3-before-20261104.json';
if(fs.existsSync(path))throw new Error('Immutable round-three baseline already exists');
const c=await import('../../packages/clinical-content/src/index.ts');
const d=await import('../../packages/game-domain/src/test-choice-orders.ts');
const m=collectAuthoredMetadata(c),files={};
function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){
 const p=dir+'/'+e.name;if(e.isDirectory()&&!['node_modules','.git','dist'].includes(e.name))walk(p);
 else if(e.isFile()&&/\.(ts|tsx|mjs|cjs|json|md|sql|svg|png)$/.test(p))files[p]=crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
}}
for(const dir of ['packages/clinical-content/src','packages/game-domain/src','packages/game-domain/tests','packages/balance-config/src','tests/fixtures','tools/qa','apps/player/src','apps/player/public','supabase'])walk(dir);
const snapshot={capturedOn:'2026-11-04',policy:'Authored synthetic data and existing sanitized flag packet only. No private digest, emails, source text, network or Git.',
 release:c.SYNTHETIC_CLINICAL_RELEASE,questions:Object.fromEntries(m.questions),claims:Object.fromEntries(m.claims),sources:Object.fromEntries(m.sources),conceptMetadata:Object.fromEntries(m.concepts),
 packet:JSON.parse(fs.readFileSync('docs/research/question-flags-review-20261104.json','utf8')),
 review:JSON.parse(fs.readFileSync('docs/research/question-flags-adversarial-review2-20261104.json','utf8')),
 approvals:c.QUESTION_QUALITY_CLINICAL_APPROVALS,batch2a:c.QUESTION_BANK_BATCH2A_REVISIONS,
 timings:c.ANSWER_CHOICE_TIMING_REGISTRY,orders:d.EXACT_TEST_CHOICE_ORDER_RECORDS,files};
const body=JSON.stringify(snapshot,null,2)+'\n';
if(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(body))throw new Error('Unexpected email-like value');
fs.writeFileSync(path,body);
console.log(JSON.stringify({path,files:Object.keys(files).length,concepts:snapshot.release.concepts.length,cases:snapshot.release.cases.length,orders:snapshot.orders.length}));
