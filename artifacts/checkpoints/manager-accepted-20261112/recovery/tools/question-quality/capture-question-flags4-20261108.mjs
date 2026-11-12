import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import '../economy-audit/source-loader.mjs';
import {collectAuthoredMetadata} from './bank.mjs';

const c=await import('../../packages/clinical-content/src/index.ts');
const meta=collectAuthoredMetadata(c),live=c.SYNTHETIC_CLINICAL_RELEASE;
const digest=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
const hash=path=>createHash('sha256').update(fs.readFileSync(path)).digest('hex');
const path='tools/question-quality/fixtures/question-flags4-before-20261108.json';
assert(!fs.existsSync(path),'Never refresh the original flags4 intake capture');
const qid='question.gs028f.nutrition.refeeding-insulin-phosphate-shift.v3';
const matches=live.cases.filter(cs=>cs.decisionNodes.some(n=>n.questionVariantId===qid));
assert.equal(matches.length,1);
const clinicalCase=matches[0],node=clinicalCase.decisionNodes.find(n=>n.questionVariantId===qid);
const authored=meta.questions.get(qid);assert.equal(authored.length,1);
const basisIds=['claim.gs028f.refeeding.insulin-phosphate-shift','claim.gs028f.refeeding.anabolic-transition','claim.gs028f.refeeding.phosphate-not-specific'];
const claims=basisIds.map(id=>{const value=meta.claims.get(id);assert(value,id);return value;});
const sources=[...new Set(claims.flatMap(c=>c.sourceIds))].map(id=>{const value=meta.sources.get(id);assert(value,id);return value;});
const files={};
function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=dir+'/'+e.name;if(e.isDirectory())walk(p);else if(/\.(ts|tsx|mjs|json)$/.test(e.name))files[p]=hash(p);}}
for(const dir of ['packages/clinical-content/src','packages/game-domain/src','packages/balance-config/src','tools/question-quality'])walk(dir);
for(const p of ['AGENTS.md','package.json','docs/clinical/question-authoring-standard.md','docs/research/question-flags3-handoff-20261107.md','docs/research/question-flags3-20261107.json'])files[p]=hash(p);
const sharedHandoff='docs/handoffs/CURRENT_THREAD_HANDOFF.md';
const record={capturedOn:'2026-11-08',scope:'Own synthetic question and recorded atomic facts/metadata only. No feedback email, external source text or gameplay statistics.',
 target:{id:'F4-01',ownerNote:"Answer choices don't make sense",clinicalCase,node,authored,concept:meta.concepts.get(node.primaryConceptId),
  timing:c.ANSWER_CHOICE_TIMING_REGISTRY.filter(t=>t.caseId===clinicalCase.id&&t.nodeId===node.id&&t.questionVariantId===qid)},
 releaseHeader:{id:live.id,contentVersion:live.contentVersion,reviewStatus:live.reviewStatus,publicationStatus:live.publicationStatus},claims,sources,
 live:{cases:live.cases.length,nodes:live.cases.reduce((sum,cs)=>sum+cs.decisionNodes.length,0),concepts:live.concepts.length,sha256:digest(live)},
 catalogSha256:digest(c.QUESTION_CATALOG_RELEASE),manifestSha256:digest(c.QUESTION_SHIP_MANIFEST),timingSha256:digest(c.ANSWER_CHOICE_TIMING_REGISTRY),files,
 sharedHandoffPrefix:{path:sharedHandoff,bytes:fs.statSync(sharedHandoff).size,sha256:hash(sharedHandoff)}};
fs.writeFileSync(path,JSON.stringify(record,null,2)+'\n');
console.log(JSON.stringify({path,live:record.live,manifestSha256:record.manifestSha256,protectedFiles:Object.keys(files).length,basisClaims:claims.map(c=>c.id)},null,2));
