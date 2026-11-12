import fs from 'node:fs';
import crypto from 'node:crypto';
import '../economy-audit/source-loader.mjs';
import {collectAuthoredMetadata} from './bank.mjs';
const file='tools/question-quality/fixtures/question-bank-batch2a-before-20261104.json';
if(fs.existsSync(file))throw new Error('Immutable batch-2a baseline already exists');
const content=await import('../../packages/clinical-content/src/index.ts');
const domain=await import('../../packages/game-domain/src/test-choice-orders.ts');
const metadata=collectAuthoredMetadata(content),files={};
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){
 const p=dir+'/'+e.name;if(e.isDirectory()&&!['node_modules','.git','dist'].includes(e.name))walk(p);
 else if(e.isFile()&&/\.(?:ts|tsx|mjs|cjs|json|md|sql|svg)$/.test(p))files[p]=hash(p);
}}
for(const dir of ['packages/clinical-content/src','packages/game-domain/src','packages/game-domain/tests','packages/balance-config/src','tests/fixtures','tools/qa','tools/economy-audit','apps/player/src','apps/player/public','supabase'])walk(dir);
for(const p of ['docs/clinical/question-authoring-standard.md','tools/question-quality/lint.mjs','tools/question-quality/lint.test.mjs','tools/question-quality/report.mjs'])files[p]=hash(p);
const owner=JSON.parse(fs.readFileSync('.local-dev/owner-question-reviews-20261104/owner-reviews.json','utf8'));
const ownerReviews=Object.fromEntries(Object.entries(owner).map(([id,v])=>[id,{decision:v.decision,note:v.note}]));
const flagFile='.local-dev/tester-feedback/feedback-2026-11-04T12-47-37.887Z.md';
const sections=fs.readFileSync(flagFile,'utf8').split(/(?=^#{1,6} )/m).filter(s=>/^#{1,6} .*Question flag/i.test(s));
const decode=s=>s?.replace(/\\([.\\_+\-])/g,'$1')??null;
const flags=sections.map(s=>({id:s.match(/^#{1,6} Question flag (.+)/m)?.[1],variantId:decode(s.match(/· Variant: (.+?) · Concept:/)?.[1]),conceptId:decode(s.match(/· Concept: (.+)/)?.[1]),notes:s.split(/\r?\n/).filter(l=>l.startsWith('> ')).map(l=>decode(l.slice(2))).join('\n')}));
const snapshot={capturedOn:'2026-11-04',policy:'Synthetic authored data, sanitized owner decisions and Question flag fields only; no emails, unrelated feedback sections, article text or network.',
 release:content.SYNTHETIC_CLINICAL_RELEASE,questions:Object.fromEntries(metadata.questions),claims:Object.fromEntries(metadata.claims),sources:Object.fromEntries(metadata.sources),conceptMetadata:Object.fromEntries(metadata.concepts),
 approvals:content.QUESTION_QUALITY_CLINICAL_APPROVALS,flagRound2Revisions:content.QUESTION_FLAG_ROUND2_REVISIONS,
 timings:content.ANSWER_CHOICE_TIMING_REGISTRY,orders:domain.EXACT_TEST_CHOICE_ORDER_RECORDS,registryText:fs.readFileSync('packages/game-domain/src/test-choice-orders.ts','utf8'),
 batchPacket:JSON.parse(fs.readFileSync('docs/research/question-batch1-20261102.json','utf8')),
 ownerReviews,flags,files};
const serialized=JSON.stringify(snapshot,null,2)+'\n';
if(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(serialized))throw new Error('Email-like content must not enter the baseline');
fs.writeFileSync(file,serialized);
console.log(JSON.stringify({file,ownerEntries:Object.keys(ownerReviews).length,questionFlags:flags.length,concepts:snapshot.release.concepts.length,protectedFiles:Object.keys(files).length}));
