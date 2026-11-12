import fs from 'node:fs';
import crypto from 'node:crypto';
import '../economy-audit/source-loader.mjs';
import {collectAuthoredMetadata} from './bank.mjs';
const path='tools/question-quality/fixtures/question-flags-round2-before-20261104.json';
if(fs.existsSync(path))throw new Error('Immutable round-two baseline already exists');
const content=await import('../../packages/clinical-content/src/index.ts');
const orders=await import('../../packages/game-domain/src/test-choice-orders.ts');
const metadata=collectAuthoredMetadata(content),files={};
function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){
 const p=dir+'/'+e.name;if(e.isDirectory()&&!['node_modules','.git','dist'].includes(e.name))walk(p);
 else if(e.isFile()&&/\.(?:ts|tsx|mjs|cjs|json|md|sql)$/.test(p))files[p]=crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
}}
for(const d of ['packages/clinical-content/src','packages/game-domain/src','packages/game-domain/tests','packages/balance-config/src','tests/fixtures','tools/qa','tools/economy-audit','apps/player/src/session','supabase'])walk(d);
for(const p of ['docs/clinical/question-authoring-standard.md','tools/question-quality/lint.mjs','tools/question-quality/lint.test.mjs','tools/question-quality/report.mjs'])files[p]=crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const packet=JSON.parse(fs.readFileSync('docs/research/question-flags-review-20261104.json','utf8'));
const snapshot={capturedOn:'2026-11-04',policy:'Only prior sanitized flags, authored synthetic data and source metadata; no private feedback reread, emails, source text or network.',
 release:content.SYNTHETIC_CLINICAL_RELEASE,questions:Object.fromEntries(metadata.questions),claims:Object.fromEntries(metadata.claims),sources:Object.fromEntries(metadata.sources),conceptMetadata:Object.fromEntries(metadata.concepts),
 approvals:content.QUESTION_QUALITY_CLINICAL_APPROVALS,timings:content.ANSWER_CHOICE_TIMING_REGISTRY,orders:orders.EXACT_TEST_CHOICE_ORDER_RECORDS,
 priorRevisions:content.QUESTION_FLAG_REVISIONS,packet,files,registryText:fs.readFileSync('packages/game-domain/src/test-choice-orders.ts','utf8')};
fs.writeFileSync(path,JSON.stringify(snapshot,null,2)+'\n');
console.log(JSON.stringify({path,variants:packet.length,protectedFiles:Object.keys(files).length,concepts:snapshot.release.concepts.length,orders:snapshot.orders.length,bytes:fs.statSync(path).size}));
