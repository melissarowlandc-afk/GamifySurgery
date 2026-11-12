import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import '../economy-audit/source-loader.mjs';
import {collectAuthoredMetadata} from './bank.mjs';

const c=await import('../../packages/clinical-content/src/index.ts');
const live=c.SYNTHETIC_CLINICAL_RELEASE,meta=collectAuthoredMetadata(c);
const path='tools/question-quality/fixtures/question-harden1-before-20261110.json';assert(!fs.existsSync(path),'Never refresh harden1 intake');
const digest=v=>createHash('sha256').update(JSON.stringify(v)).digest('hex'),hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const ids=[['H1-01','question.groin-hernia.ultrasound-type.v1'],['H1-02','question.inguinal-hernia.symptomatic-elective-repair.v3.r12'],['H1-03','question.gs028f.nutrition.refeeding-insulin-phosphate-shift.v3.r2']];
const targets=ids.map(([id,qid])=>{const cases=live.cases.filter(cs=>cs.decisionNodes.some(n=>n.questionVariantId===qid));assert.equal(cases.length,1,qid);
 const cs=cases[0],node=cs.decisionNodes.find(n=>n.questionVariantId===qid),authored=meta.questions.get(qid);assert(authored?.length,qid+' author metadata');
 return {id,clinicalCase:cs,node,authored,concept:meta.concepts.get(node.primaryConceptId),timing:c.ANSWER_CHOICE_TIMING_REGISTRY.filter(t=>t.caseId===cs.id&&t.nodeId===node.id&&t.questionVariantId===qid)};});
const files={};for(const name of fs.readdirSync('packages/clinical-content/src'))if(/^(question-flags[34]|question-stats1|question-ship|schema|pilot-schema|index|synthetic-content|answer-choice-timing)/.test(name)&&name.endsWith('.ts')){
 const p='packages/clinical-content/src/'+name;files[p]=hash(p);
}
for(const p of ['AGENTS.md','package.json','docs/clinical/question-authoring-standard.md','docs/research/question-flags3-review-20261107.json','docs/research/question-flags4-review-20261108.json'])files[p]=hash(p);
const observedFiles={};for(const name of fs.readdirSync('packages/clinical-content/src'))if(name.endsWith('.ts')){const p='packages/clinical-content/src/'+name;observedFiles[p]=hash(p);}
const stats=live.cases.filter(cs=>cs.decisionNodes.some(n=>/^concept\.statistics-ethics\.(?:arr-nnt|bias-confounding|chi-square|confidence-interval|errors-power|fisher-exact|independent-t|one-way-anova|p-value|paired-t|predictive-value-prevalence|rank-sum|risk-ratio-odds-ratio|sensitivity-specificity|signed-rank|study-design)$/.test(n.primaryConceptId)));
const shared='docs/handoffs/CURRENT_THREAD_HANDOFF.md';
const record={capturedOn:'2026-11-10',scope:'Exact repository-authored live questions, atomic facts and bibliographic metadata. No private flag digest, email, source text or gameplay statistics.',targets,
 live:{cases:live.cases.length,nodes:live.cases.flatMap(cs=>cs.decisionNodes).length,concepts:live.concepts.length,sha256:digest(live)},
 manifestSha256:digest(c.QUESTION_SHIP_MANIFEST),catalogSha256:digest(c.QUESTION_CATALOG_RELEASE),timingSha256:digest(c.ANSWER_CHOICE_TIMING_REGISTRY),
 statisticsCaseHashes:Object.fromEntries(stats.map(cs=>[cs.id,digest(cs)])),concepts:[...meta.concepts.values()],claims:[...meta.claims.values()],sources:[...meta.sources.values()],
 files,observedFiles,sharedHandoffPrefix:{path:shared,bytes:fs.statSync(shared).size,sha256:hash(shared)}};
fs.writeFileSync(path,JSON.stringify(record,null,2)+'\n');
console.log(JSON.stringify({path,targets:targets.map(t=>({id:t.id,variant:t.node.questionVariantId,concept:t.node.primaryConceptId})),live:record.live,protectedFiles:Object.keys(files).length,statisticsCases:stats.length},null,2));
