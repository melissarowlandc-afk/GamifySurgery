import '../economy-audit/source-loader.mjs';
import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const dir='.local-dev/question-new-n3-round3-20261105',intake=JSON.parse(fs.readFileSync(dir+'/intake.json','utf8'));
const hash=x=>createHash('sha256').update(typeof x==='string'||Buffer.isBuffer(x)?x:JSON.stringify(x)).digest('hex');
const c=await import('../../packages/clinical-content/src/index.ts');
const {projectManagerAcceptedQuestions}=await import('../../packages/clinical-content/src/question-ship-projection.ts');
const {withAcceptedQuestionBankBatch2bRound2Concepts}=await import('../../packages/clinical-content/src/question-bank-batch2b-round2-20261104.ts');
const {withAcceptedQuestionFlags2Concepts}=await import('../../packages/clinical-content/src/question-flags2-accepted-20261105.ts');
const withoutN3=withAcceptedQuestionFlags2Concepts(withAcceptedQuestionBankBatch2bRound2Concepts(c.QUESTION_NEW_N3_PRE_RELEASE));
const reconstructed=projectManagerAcceptedQuestions(withoutN3,c.QUESTION_FLAGS_PRE_REVISION_RELEASE,{
 legacy:c.QUESTION_FLAGS_PRE_REVISION_RELEASE,'flags2-round1':c.QUESTION_FLAGS2_ROUND1_SOURCE_RELEASE,
 'flags-round3':c.QUESTION_NEW_N1_PRE_RELEASE,'batch2a-round3':c.QUESTION_BANK_BATCH2A_ROUND3_RELEASE,
 'n1-round2':c.QUESTION_BANK_PRE_BATCH2B_RELEASE,'n1-round3':c.QUESTION_NEW_N2_ROUND3_PRE_RELEASE,
 'n2-round2':c.QUESTION_NEW_N1_ROUND3_PRE_RELEASE,'batch2b-round2':c.QUESTION_BANK_BATCH2B_ROUND2_SOURCE_RELEASE,
});
assert.deepEqual(c.SYNTHETIC_CLINICAL_RELEASE,reconstructed);
const shared=['packages/clinical-content/src/index.ts','packages/clinical-content/src/answer-choice-timing.ts','packages/game-domain/src/test-choice-orders.ts'];
// Remove only this round's registered append; verify all earlier/concurrent source bytes survive.
const restore=p=>{let s=fs.readFileSync(p,'utf8');
 if(p.endsWith('/index.ts'))return s.replace(/\n\/\/ BEGIN N3 ROUND3 explicit candidate exports[\s\S]*?\/\/ END N3 ROUND3 explicit candidate exports\.\n/,'');
 if(p.endsWith('/answer-choice-timing.ts'))return s.replace(', ...QUESTION_NEW_N3_ROUND3_TIMING_ENTRIES','').replace(/\n\/\/ BEGIN N3 ROUND3 retained exact estimate append[\s\S]*?\/\/ END N3 ROUND3 retained exact estimate append\.\n/,'');
 return s.replace(/  \/\/ BEGIN N3 ROUND3 explicit candidate exact-order append\.[\s\S]*?  \/\/ END N3 ROUND3 explicit candidate exact-order append\.\n/,'')
 .replace(/\/\/ BEGIN N3 ROUND3 explicit candidate exact-order append\.[\s\S]*?\/\/ END N3 ROUND3 explicit candidate exact-order append\.\n\n/,'');
};
for(const p of shared)assert.equal(hash(restore(p)),intake.files[p],p+' unrelated bytes changed');
let timingTest=fs.readFileSync('packages/clinical-content/src/answer-choice-timing.test.ts','utf8')
 .replace('import { QUESTION_NEW_N3_ROUND3_TIMING_ENTRIES } from "./question-new-n3-round3-20261105";\n','')
 .replace(' + QUESTION_NEW_N3_ROUND3_TIMING_ENTRIES.length','');
assert.equal(hash(timingTest),intake.files['packages/clinical-content/src/answer-choice-timing.test.ts']);
let inventory=fs.readFileSync('packages/game-domain/tests/test-choice-order-inventory.test.ts','utf8')
 .replace('import { QUESTION_NEW_N3_ROUND3_CASES } from "@gamify-surgery/clinical-content";\n','')
 .replace('...QUESTION_NEW_N3_ROUND3_CASES, ','');
assert.equal(hash(inventory),intake.files['packages/game-domain/tests/test-choice-order-inventory.test.ts']);
const protectedDefinitions=Object.keys(intake.files).filter(p=>/^packages\/clinical-content\/src\/question-new-n[123].*\.ts$/.test(p));
for(const p of protectedDefinitions)assert.equal(hash(fs.readFileSync(p)),intake.files[p],p);
for(const p of ['packages/clinical-content/src/synthetic-content.ts','packages/clinical-content/src/question-ship-manifest.ts','docs/research/question-new-n3-round2-20261105.json','docs/research/question-new-n3-review2-20261105.json'])assert.equal(hash(fs.readFileSync(p)),intake.files[p],p);
for(const p of Object.keys(intake.files).filter(p=>p.startsWith('apps/player/src/session/')))assert.equal(hash(fs.readFileSync(p)),intake.files[p],p+' protected player lane changed');
const changed=[],added=[];function walk(p){for(const e of fs.readdirSync(p,{withFileTypes:true})){const q=p+'/'+e.name;if(e.isDirectory()){if(!['node_modules','dist','.git','.vite'].includes(e.name))walk(q);}else if(/\.(?:ts|tsx|mjs|json|md|mts|js|patch)$/.test(q)){const current=hash(fs.readFileSync(q));if(!intake.files[q])added.push({path:q,sha256:current});else if(intake.files[q]!==current)changed.push({path:q,before:intake.files[q],after:current});}}}for(const p of ['packages','apps','tools','docs'])walk(p);
const owned=p=>/question-new-n3-round3|question-new-n3-round3-source/.test(p)||shared.includes(p)||['packages/clinical-content/src/answer-choice-timing.test.ts','packages/game-domain/tests/test-choice-order-inventory.test.ts','docs/handoffs/CURRENT_THREAD_HANDOFF.md'].includes(p);
const receipt={checkedOn:new Date().toISOString(),ownedChanged:changed.filter(x=>owned(x.path)),ownedAdded:added.filter(x=>owned(x.path)),
 protectedExistingDefinitions:protectedDefinitions.length,protectedExistingDefinitionsExact:true,oldPacketAndReviewExact:true,manifestAndSyntheticContentExact:true,
 unchangedPlayerSessionFiles:Object.keys(intake.files).filter(p=>p.startsWith('apps/player/src/session/')).length,
 runtimeAppendRemovalProof:shared.map(p=>({path:p,retainedBytesHash:hash(restore(p)),exactToIntake:true})),
 default:{equalToPreN3ReconstructionWithCurrentManagerDecisions:true,sha256:hash(c.SYNTHETIC_CLINICAL_RELEASE),cases:c.SYNTHETIC_CLINICAL_RELEASE.cases.length,
   concepts:c.SYNTHETIC_CLINICAL_RELEASE.concepts.length,n3Cases:0,n3Concepts:0},
 catalog:{cases:c.QUESTION_CATALOG_RELEASE.cases.length,concepts:c.QUESTION_CATALOG_RELEASE.concepts.length,unchangedThisRound:true},
 candidate:{cases:c.QUESTION_NEW_N3_ROUND3_SOURCE_RELEASE.cases.length,concepts:c.QUESTION_NEW_N3_ROUND3_SOURCE_RELEASE.concepts.length,parked:c.QUESTION_NEW_N3_ROUND3_PARKED_CASE_IDS.length},
 timing:{current:c.ANSWER_CHOICE_TIMING_REGISTRY.length,appended:3},changedExistingLevelFiveInputs:shared,
 newRuntimeDependencies:added.filter(x=>owned(x.path)&&/\/src\/.*\.ts$/.test(x.path)&&!x.path.endsWith('.test.ts')).map(x=>x.path),
 unownedConcurrentChanges:changed.filter(x=>!owned(x.path)),unownedConcurrentAdded:added.filter(x=>!owned(x.path)),
 limitations:'Semantic equality is not a proof of performance neutrality. Historical timing failures are attributed separately; no tests or self-checks confer clinical approval.'};
fs.writeFileSync(dir+'/scope-proof.json',JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify({changed:receipt.ownedChanged.length,added:receipt.ownedAdded.length,protected:receipt.protectedExistingDefinitions,default:receipt.default,candidate:receipt.candidate}));
