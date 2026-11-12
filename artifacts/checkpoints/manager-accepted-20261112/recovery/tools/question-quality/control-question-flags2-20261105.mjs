import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import '../economy-audit/source-loader.mjs';
import {intake} from './question-flags2-specs-20261105.mjs';
const c=await import('../../packages/clinical-content/src/index.ts');
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const digest=s=>crypto.createHash('sha256').update(s).digest('hex');
const ownRuntime=[
 'packages/clinical-content/src/index.ts',
 'packages/clinical-content/src/question-flags2-20261105.ts',
 'packages/clinical-content/src/question-flags2-20261105-data.ts',
 'packages/clinical-content/src/question-flags2-evidence-20261105.ts',
 'packages/clinical-content/src/question-flags2-retained-input-20261105.ts',
];
const views={legacy:c.QUESTION_FLAGS_PRE_REVISION_RELEASE,'flags-round3':c.QUESTION_NEW_N1_PRE_RELEASE,'batch2a-round3':c.QUESTION_BANK_BATCH2A_ROUND3_RELEASE,'n1-round2':c.QUESTION_BANK_PRE_BATCH2B_RELEASE,'n1-round3':c.QUESTION_NEW_N2_ROUND3_PRE_RELEASE,'n2-round2':c.QUESTION_NEW_N1_ROUND3_PRE_RELEASE,'batch2b-round2':c.QUESTION_BANK_BATCH2B_ROUND2_SOURCE_RELEASE};
const withoutOwnCandidates=c.validateSyntheticClinicalRelease(c.projectManagerAcceptedQuestions(c.withAcceptedQuestionBankBatch2bRound2Concepts(c.QUESTION_CATALOG_RELEASE),c.QUESTION_FLAGS_PRE_REVISION_RELEASE,views));
assert.equal(JSON.stringify(c.SYNTHETIC_CLINICAL_RELEASE),JSON.stringify(withoutOwnCandidates),'Own retained view changed live projection');
const ownIds=new Set(c.QUESTION_FLAGS2_REVISIONS.map(r=>r.questionVariantId));
assert.equal(c.SYNTHETIC_CLINICAL_RELEASE.cases.flatMap(cs=>cs.decisionNodes).filter(n=>ownIds.has(n.questionVariantId)).length,0);
assert.equal(c.QUESTION_SHIP_MANIFEST.accepted.filter(row=>ownIds.has(row.questionVariantId)).length,0);
assert.equal(c.ANSWER_CHOICE_TIMING_REGISTRY.filter(t=>ownIds.has(t.questionVariantId)).length,0,'Candidate timing must not silently register in another lane');
const expanded=c.createQuestionFlags2SourceView(c.QUESTION_FLAGS_PRE_REVISION_RELEASE);
for(const cs of c.QUESTION_FLAGS2_ROUND1_SOURCE_RELEASE.cases)assert.deepEqual(cs,expanded.cases.find(x=>x.id===cs.id));
const protectedBatch2b=Object.entries(intake.files).filter(([p])=>/question-bank-batch2b/.test(p)).map(([path,before])=>({path,before,current:hash(path),unchanged:before===hash(path)}));
assert(protectedBatch2b.every(p=>p.unchanged),'A frozen batch2b input changed; do not overwrite it');
const runtimeHashes=Object.fromEntries(ownRuntime.map(p=>[p,hash(p)]));
const lockPath=process.argv.includes('--final')?'tools/question-quality/question-flags2-runtime-lock-final-20261105.json':'tools/question-quality/question-flags2-runtime-lock-20261105.json';
if(process.argv.includes('--lock')){
 assert(!fs.existsSync(lockPath),'Do not replace the validation lock');
 fs.writeFileSync(lockPath,JSON.stringify({checkedOn:'2026-11-05',runtimeHashes},null,2)+'\n');
}else if(fs.existsSync(lockPath))assert.deepEqual(runtimeHashes,JSON.parse(fs.readFileSync(lockPath,'utf8')).runtimeHashes,'Runtime changed after the validation lock');
const unownedDeltas=Object.entries(intake.files).filter(([p,before])=>!ownRuntime.includes(p)&&fs.existsSync(p)&&hash(p)!==before).map(([path,before])=>({path,before,current:hash(path),attribution:'Concurrent shared-tree change; no write by this milestone.'}));
const index=fs.readFileSync(ownRuntime[0],'utf8');
const withoutExport=index.replace(/\r?\n\/\/ BEGIN FLAGS2 retained candidates - no ship-manifest or gate changes\.\r?\nexport \* from "\.\/question-flags2-20261105";\r?\n\/\/ END FLAGS2 retained candidates\.\r?\n/,'');
assert.notEqual(index,withoutExport,'Missing minimal standalone export hunk');
const evidencePath='tools/qa/level-five-integration-results-20261012.json';
const evidence=JSON.parse(fs.readFileSync(evidencePath,'utf8'));
const result={checkedOn:'2026-11-05',scope:'Read-only controls; no Git, acceptance, evidence/pin writes or rebind.',
 live:{exactlyEqualWithoutOwnCandidateExports:true,newLiveVariants:0,newLiveConceptCards:c.SYNTHETIC_CLINICAL_RELEASE.concepts.filter(x=>c.QUESTION_FLAGS2_TESTED_CONCEPTS.some(n=>n.id===x.id)).length,workerAddedAcceptances:0,globalCandidateTimingRegistrations:0,cases:c.SYNTHETIC_CLINICAL_RELEASE.cases.length,nodes:c.SYNTHETIC_CLINICAL_RELEASE.cases.flatMap(cs=>cs.decisionNodes).length},
 retained:{sourceView:'flags2-round1',cases:c.QUESTION_FLAGS2_ROUND1_SOURCE_RELEASE.cases.length,nodes:c.QUESTION_FLAGS2_ROUND1_SOURCE_RELEASE.cases.flatMap(cs=>cs.decisionNodes).length,newVariants:ownIds.size,newConcepts:c.QUESTION_FLAGS2_TESTED_CONCEPTS.length,exactCandidateTimingRows:c.QUESTION_FLAGS2_TIMING_ENTRIES.length,exactCandidateOrders:c.QUESTION_FLAGS2_CANDIDATE_TEST_ORDER_RECORDS.length},
 protectedBatch2b,
 index:{ownHunkOnly:'Four-line standalone FLAGS2 export block; no projection/manifest code.',entryHash:intake.files[ownRuntime[0]],currentHash:runtimeHashes[ownRuntime[0]],afterRemovingOwnHunk:digest(withoutExport),matchesEntryAfterRemovingOwnHunk:digest(withoutExport)===intake.files[ownRuntime[0]],note:'If false, the shared index also moved in the concurrent gate lane. This writer applied only its marked export block.'},
 changedLevel5BoundInputs:ownRuntime.map(path=>({path,before:intake.files[path]??null,current:runtimeHashes[path],kind:intake.files[path]?'existing_bound_input_modified':'new_non_test_runtime_input',alreadyRecordedInCurrentEvidence:Object.hasOwn(evidence.inputs,path)})),
 unownedDeltas,
 evidence:{path:evidencePath,currentReadOnlyHash:hash(evidencePath),write:false,rebindOwner:'manager in the release worktree; no hash is copied into evidence'},
 validationLock:lockPath,
 managerIntegration:'After independent review/source holds/acceptance: register flags2-round1 -> QUESTION_FLAGS2_ROUND1_SOURCE_RELEASE; add only accepted exact tuples and exact headers; add accepted new concept definitions; append six timing rows and eight candidate order rows to the appropriate archives in the manager lane. Accept both G05 nodes/header together if resolving the paired-logic flag. No shipping authority is duplicated here.'};
assert.equal(result.live.newLiveConceptCards,0);
fs.writeFileSync('tools/question-quality/question-flags2-controls-20261105.json',JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({live:result.live,retained:result.retained,protectedBatch2b:protectedBatch2b.length,protectedBatch2bUnchanged:protectedBatch2b.every(p=>p.unchanged),changedLevel5BoundInputs:result.changedLevel5BoundInputs.map(p=>p.path),unownedDeltas:unownedDeltas.map(d=>d.path),indexOnlyOwnHunk:result.index.matchesEntryAfterRemovingOwnHunk},null,2));
