import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import '../economy-audit/source-loader.mjs';
import {collectAuthoredMetadata} from './bank.mjs';
const output='tools/question-quality/fixtures/question-flags2-before-20261105.json';
assert(!fs.existsSync(output),'Do not overwrite the immutable flag intake');
const c=await import('../../packages/clinical-content/src/index.ts');
const meta=collectAuthoredMetadata(c);
const flags=[
 ['G01','question.persistent-itp.defer-elective-splenectomy.v3'],
 ['G02','question.malignant-hyperthermia-susceptibility.trigger-free-anesthesia-plan.v2'],
 ['G03','question.palpable-breast.negative-mammogram-targeted-us.v1'],
 ['G04','question.gs028f.gynecology.pregnancy-testing-pelvic-pain.v1'],
 ['G05','question.asymptomatic-phpt.age-based-surgery.v1'],
 ['G06','question.statistics-ethics.predictive-value-prevalence.v2'],
 ['G07','question.ptld.tissue-diagnosis-coordination.v4'],
];
const locate=(release,id)=>release.cases.flatMap(cs=>cs.decisionNodes.filter(n=>n.questionVariantId===id).map(n=>({clinicalCase:cs,node:n})));
const items=flags.map(([id,variantId])=>{
 const live=locate(c.SYNTHETIC_CLINICAL_RELEASE,variantId);
 assert.equal(live.length,1,variantId+' needs an unambiguous live source');
 const questions=meta.questions.get(variantId)??[];
 const claims=questions.flatMap(q=>q.supportingEvidenceClaimIds).map(id=>meta.claims.get(id)).filter(Boolean);
 return {id,variantId,...live[0],questions,claims};
});
const siblings=[...meta.questions].filter(([id])=>/itp|splenectomy/i.test(id)&&/persistent-itp|immune-thrombocytopen/i.test(id)).map(([id,questions])=>({id,questions,live:locate(c.SYNTHETIC_CLINICAL_RELEASE,id)}));
const allClaims=new Map([...items.flatMap(i=>i.claims),...siblings.flatMap(s=>s.questions.flatMap(q=>q.supportingEvidenceClaimIds).map(id=>meta.claims.get(id)).filter(Boolean))].map(x=>[x.id,x]));
const sources=[...new Set([...allClaims.values()].flatMap(x=>x.sourceIds))].map(id=>meta.sources.get(id)).filter(Boolean);
const files={};
function walk(dir){if(!fs.existsSync(dir))return;for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=dir+'/'+e.name;if(e.isDirectory())walk(p);else if(e.isFile()&&/\.(?:ts|tsx|mjs|json|md|sql|png)$/.test(p))files[p]=crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');}}
for(const dir of ['packages/clinical-content/src','packages/clinical-content/tests','packages/game-domain/src','packages/game-domain/tests','apps/player/src/session','supabase'])walk(dir);
for(const file of ['docs/research/question-bank-batch2b-20261104.json','docs/research/question-bank-batch2b-round2-20261104.json','docs/clinical/question-authoring-standard.md'])files[file]=crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const data={capturedAt:new Date().toISOString(),scope:'G01/G02/G04/G05/G06/G07 only; G03 belongs to frozen batch2b round2. No private feedback, email addresses or source excerpts.',items,siblings,claims:[...allClaims.values()],sources,timings:c.ANSWER_CHOICE_TIMING_REGISTRY,files};
fs.writeFileSync(output,JSON.stringify(data,null,2)+'\n');
console.log(JSON.stringify({path:output,items:items.map(i=>({id:i.id,caseId:i.clinicalCase.id,nodeId:i.node.id,conceptId:i.node.primaryConceptId})),siblings:siblings.map(s=>s.id),claims:allClaims.size,sources:sources.length,protectedFiles:Object.keys(files).length},null,2));
