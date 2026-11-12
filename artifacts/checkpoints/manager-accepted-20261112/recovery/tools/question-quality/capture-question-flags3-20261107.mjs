import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import '../economy-audit/source-loader.mjs';
import {collectAuthoredMetadata} from './bank.mjs';
const c=await import('../../packages/clinical-content/src/index.ts');
const meta=collectAuthoredMetadata(c),live=c.SYNTHETIC_CLINICAL_RELEASE;
const digest=v=>createHash('sha256').update(JSON.stringify(v)).digest('hex');
const hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const path='tools/question-quality/fixtures/question-flags3-before-20261107.json';
assert(!fs.existsSync(path),'Never refresh the intake capture');
const targets=[
 {id:'F3-01',qid:'question.statistics-ethics.predictive-value-prevalence.v4',ownerNote:'This question also is confusing'},
 {id:'F3-02',qid:'question.achalasia.manometric-recognition.v2.r6',ownerNote:'The imaging findings written out is confusing'},
 {id:'F3-03',qid:'question.inguinal-hernia.symptomatic-elective-repair.v3.r10',ownerNote:'The target US findings should prompt the player to choose which kind of hernia the patient has too'},
];
const targetsWithInput=targets.map(t=>{
 const cases=live.cases.filter(cs=>cs.decisionNodes.some(n=>n.questionVariantId===t.qid));assert.equal(cases.length,1,t.qid);
 const cs=cases[0],node=cs.decisionNodes.find(n=>n.questionVariantId===t.qid),authored=meta.questions.get(t.qid)??[];
 const concept=meta.concepts.get(node.primaryConceptId);assert(concept);
 return {...t,clinicalCase:cs,node,authored,concept,timing:c.ANSWER_CHOICE_TIMING_REGISTRY.filter(r=>r.caseId===cs.id&&r.nodeId===node.id&&r.questionVariantId===t.qid)};
});
const files={};function walk(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const p=dir+'/'+entry.name;if(entry.isDirectory())walk(p);else if(/\.(ts|tsx|json)$/.test(entry.name))files[p]=hash(p);}}
for(const dir of ['packages/clinical-content/src','packages/game-domain/src','packages/balance-config/src','apps/player/src/session/cloud'])walk(dir);
const priorDocs=['docs/research/question-flags2-round3-handoff-20261105.md','docs/research/question-flags2-round3-20261105.json',
 'docs/research/question-flags2-manager-decision-20261105.md','docs/research/question-flags2-20261105.json',
 'docs/research/question-flags2-round2-20261105.json','docs/clinical/question-authoring-standard.md'];
priorDocs.forEach(p=>files[p]=hash(p));
const record={capturedOn:'2026-11-07',scope:'Exact live synthetic question/metadata snapshot and original evidence records. No private feedback/email, external source excerpts or gameplay statistics.',
 targets:targetsWithInput,releaseHeader:{id:live.id,contentVersion:live.contentVersion,reviewStatus:live.reviewStatus,publicationStatus:live.publicationStatus},
 live:{cases:live.cases.length,nodes:live.cases.reduce((n,cs)=>n+cs.decisionNodes.length,0),concepts:live.concepts.length,sha256:digest(live),
  caseHashes:Object.fromEntries(live.cases.map(cs=>[cs.id,digest(cs)])),conceptHashes:Object.fromEntries(live.concepts.map(co=>[co.id,digest(co)]))},
 catalogSha256:digest(c.QUESTION_CATALOG_RELEASE),manifestSha256:digest(c.QUESTION_SHIP_MANIFEST),timingSha256:digest(c.ANSWER_CHOICE_TIMING_REGISTRY),
 concepts:[...meta.concepts.values()],claims:[...meta.claims.values()],sources:[...meta.sources.values()],files};
fs.writeFileSync(path,JSON.stringify(record,null,2)+'\n');
console.log(JSON.stringify({path,live:record.live.sha256,targets:targetsWithInput.map(t=>({id:t.id,caseId:t.clinicalCase.id,nodeId:t.node.id,
 authoredVersions:t.authored.map(q=>q.contentVersion),claimIds:t.authored.flatMap(q=>q.supportingEvidenceClaimIds),concept:t.node.primaryConceptId})),protectedFiles:Object.keys(files).length},null,2));
