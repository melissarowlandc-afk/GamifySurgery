import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import '../economy-audit/source-loader.mjs';
const path='tools/question-quality/fixtures/batch2b-acceptance-before-20261105.json';
assert(!fs.existsSync(path),'Never replace the acceptance intake');
const c=await import('../../packages/clinical-content/src/index.ts');
const review=JSON.parse(fs.readFileSync('docs/research/question-bank-batch2b-review2-20261104.json','utf8'));
const packet=JSON.parse(fs.readFileSync('docs/research/question-bank-batch2b-round2-20261104.json','utf8'));
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const files={};
for(const directory of ['packages/clinical-content/src','packages/game-domain/src','packages/game-domain/tests','apps/player/src/session','tools/question-quality/fixtures','docs/research']){
 function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=dir+'/'+e.name;if(e.isDirectory())walk(p);else if(/\.(?:ts|tsx|json|md|png|mjs)$/.test(p))files[p]=hash(p);}}walk(directory);
}
const flags2Paths=Object.keys(files).filter(p=>/question-flags2/.test(p));
const data={capturedAt:new Date().toISOString(),scope:'Accept exact reviewed 2b PASS except decisive unresolved holds; preserve flags2, unaccepted live nodes and concurrent N2 rows. Only three specified frozen test digests may change.',
 release:c.SYNTHETIC_CLINICAL_RELEASE,manifest:c.QUESTION_SHIP_MANIFEST,packet,review,flags2Paths,files,
 requiredDigestReconciliation:JSON.parse(fs.readFileSync('.local-dev/question-ship-gate-narrowing-20261105/rewrite-test-digest-followup.json','utf8')),
};
fs.writeFileSync(path,JSON.stringify(data,null,2)+'\n');
const unconditional=review.filter(r=>r.verdict==='PASS'&&!['B2B32','F13'].includes(r.id)).map(r=>packet.find(p=>p.id===r.id));
console.log(JSON.stringify({path,pass:review.filter(r=>r.verdict==='PASS').length,revise:review.filter(r=>r.verdict==='REVISE').length,baselineAcceptances:data.manifest.accepted.length,
 acceptedCandidates:unconditional.map(p=>{const cs=c.SYNTHETIC_CLINICAL_RELEASE.cases.find(cs=>cs.id===p.caseId),source=c.QUESTION_BANK_BATCH2B_ROUND2_SOURCE_RELEASE.cases.find(cs=>cs.id===p.caseId);return {id:p.id,caseId:p.caseId,nodeId:p.nodeId,variant:p.after.variantId,alreadyAccepted:data.manifest.accepted.filter(row=>row.caseId===p.caseId),nodes:cs.decisionNodes.map(n=>({id:n.id,variant:n.questionVariantId,key:n.answerChoices.find(a=>a.isCorrect).label})),headerChanged:JSON.stringify([cs.presentation,cs.chiefComplaint,cs.patientPresentationRevision])!==JSON.stringify([source.presentation,source.chiefComplaint,source.patientPresentationRevision])};}),frozenFlags2Files:flags2Paths.length},null,2));
