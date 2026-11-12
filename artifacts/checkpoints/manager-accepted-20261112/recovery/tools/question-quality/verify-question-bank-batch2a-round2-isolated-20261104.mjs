// Validate this owned projection independently of any later worker's assembly.
// A pass here never means the current combined default release imports or passes.
import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import '../economy-audit/source-loader.mjs';
import {entry,specs} from './question-bank-batch2a-round2-specs-20261104.mjs';
const c=await import('../../packages/clinical-content/src/question-bank-batch2a-round2-20261104.ts');
const {validateSyntheticClinicalRelease}=await import('../../packages/clinical-content/src/schema.ts');
const {QUESTION_BANK_BATCH2A_ROUND2_CLAIMS:claims}=await import('../../packages/clinical-content/src/question-bank-batch2a-round2-evidence-20261104.ts');
const before=structuredClone(entry.release),after=validateSyntheticClinicalRelease({...before,concepts:[...before.concepts,...c.QUESTION_BANK_BATCH2A_ROUND2_TESTED_CONCEPTS],cases:c.applyQuestionBankBatch2aRound2Revisions(before.cases)});
const packet=JSON.parse(fs.readFileSync('docs/research/question-bank-batch2a-round2-20261104.json','utf8'));
const name=s=>typeof s==='string'?s.replaceAll('{patientName}','Jamie Taylor'):s,ordered=n=>[n.answerChoices.find(a=>a.isCorrect),...n.answerChoices.filter(a=>!a.isCorrect)];
const display=(cs,n)=>({variantId:n.questionVariantId,Presentation:name(cs.presentation),'Current update':name(n.currentUpdate??null),Exhibit:n.exhibit??null,Task:name(n.stem),Options:ordered(n).map(a=>(a.isCorrect?'**KEY:** ':'')+a.label)});
let cases=0,nodes=0,notes=0;
for(const old of before.cases){const now=after.cases.find(c=>c.id===old.id),rr=c.QUESTION_BANK_BATCH2A_ROUND2_REVISIONS.filter(r=>r.caseId===old.id);
 if(!rr.length){assert.deepEqual(now,old,old.id);cases++;}
 for(const n of old.decisionNodes)if(!rr.some(r=>r.nodeId===n.id)){assert.deepEqual(now.decisionNodes.find(x=>x.id===n.id),n,n.id);nodes++;}
}
for(const s of specs){const p=packet.find(p=>p.id===s.id),r=c.QUESTION_BANK_BATCH2A_ROUND2_REVISIONS.find(r=>r.auditId===s.id),cs=after.cases.find(c=>c.id===r.caseId),n=cs.decisionNodes.find(n=>n.id===r.nodeId);
 assert(!Object.hasOwn(entry.questions,r.questionVariantId),'Version collision');assert.deepEqual(p.before,s.prior.after);assert.deepEqual(p.after,display(cs,n));assert.deepEqual(p.encounterContinuity.afterGate,n.resultGateAfter);
 assert.equal(p.reviewStatus,'needs_clinician_review');assert.equal(p.pipelinePassed,false);assert.equal(p.releaseReady,false);
 for(const k of ['cues','fairness','suggestions']){assert.equal(p.reviewResponse.noteResponses[k].length,s.review[k].length);notes+=s.review[k].length;}
 for(const k of ['cueAttack','stageCategory','twoSteps','difficulty','oneBest'])assert(p.reviewResponse.selfCheck[k].length>30);
}
const pass=packet.find(p=>p.id==='B2A01'),oldPass=entry.packet.find(p=>p.id==='B2A01');for(const k of ['before','after','rationalePairs','visibleHistory'])assert.deepEqual(pass[k],oldPass[k]);assert(pass.pipelinePassed&&pass.basicAccepted);
assert.equal(cases,1181);assert.equal(nodes,1492);assert.equal(notes,121);assert.equal(after.concepts.length,507);
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const protectedPaths=[
 'packages/clinical-content/src/question-bank-batch2a-20261104.ts','packages/clinical-content/src/question-bank-batch2a-20261104-data.ts','packages/clinical-content/src/question-bank-batch2a-evidence-20261104.ts',
 'packages/clinical-content/src/question-flags-round3-20261104.ts','packages/clinical-content/src/question-flags-round3-20261104-data.ts','packages/clinical-content/src/question-flags-round3-evidence-20261104.ts',
 'packages/clinical-content/src/question-flags-round2-20261104.ts','packages/clinical-content/src/question-flags-round2-20261104-data.ts',
 'apps/player/public/clinical-exhibits/batch2a-b01-pressure.png','apps/player/public/clinical-exhibits/batch2a-b03-pressure.png',
];
for(const p of protectedPaths)assert.equal(hash(p),entry.files[p],p);
for(const claim of claims){assert.equal(claim.reviewStatus,'needs_clinician_review');assert.equal(claim.lastClinicianReview,null);for(const id of claim.sourceIds)assert(entry.sources[id]);}
const report={checkedAt:new Date().toISOString(),scope:'Owned projection applied to the captured valid pre-round-two synthetic release and parsed by the actual release schema. No later N1 stage is executed, edited, bypassed in production or claimed validated.',passed:true,variants:10,concepts:6,claims:claims.length,noteResponses:notes,unchangedCases:cases,unchangedNodes:nodes,oldConcepts:501,projectedConcepts:507,protectedPaths:protectedPaths.map(path=>({path,sha256:hash(path)})),versionCollisions:0,defaultCombinedAssemblyStatus:'Check the separate current-bank import log; a later worker stage may block it.'};
fs.writeFileSync('tools/question-quality/question-bank-batch2a-round2-isolated-verification-20261104.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
