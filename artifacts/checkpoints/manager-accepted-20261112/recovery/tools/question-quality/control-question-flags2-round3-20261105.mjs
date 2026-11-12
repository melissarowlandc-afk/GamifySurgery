import fs from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import '../economy-audit/source-loader.mjs';
import {intake} from './question-flags2-round3-specs-20261105.mjs';
const c=await import('../../packages/clinical-content/src/index.ts');
const f=await import('../../packages/clinical-content/src/question-flags2-round3-20261105.ts');
const hash=v=>createHash('sha256').update(v).digest('hex');
const digest=v=>hash(JSON.stringify(v));
const fileHash=p=>hash(fs.readFileSync(p));
const indexPath='packages/clinical-content/src/index.ts';
const own=/\r?\n\/\/ BEGIN FLAGS2 round3 retained candidates - no manifest acceptance\.\r?\nexport \* from "\.\/question-flags2-round3-20261105";\r?\n\/\/ END FLAGS2 round3 retained candidates\.\r?\n/g;
const n3Index=/\r?\n\/\/ BEGIN N3 ROUND2 exports - review drafts only; no manifest acceptance\.\r?\nexport \* from "\.\/question-new-n3-round2-20261105";\r?\n\/\/ END N3 ROUND2 exports\.\r?\n/g;
const current=fs.readFileSync(indexPath,'utf8'),blocks=[...current.matchAll(own)];
assert.equal(blocks.length,1,'One separate export hunk only');
assert.equal([...current.matchAll(n3Index)].length,1,'Expected separately owned N3 append');
const strippedHash=hash(current.replace(own,'').replace(n3Index,''));
assert.equal(strippedHash,intake.files[indexPath],'Unrelated index bytes changed in source window');
const timingPath='packages/clinical-content/src/answer-choice-timing.ts';
const timingText=fs.readFileSync(timingPath,'utf8');
const n3TimingImport=/^\/\/ BEGIN N3 ROUND2 exact timing append - earlier tuples retained, frozen PASS not duplicated\.\r?\nimport \{ QUESTION_NEW_N3_ROUND2_TIMING_ENTRIES \} from "\.\/question-new-n3-round2-20261105";\r?\n\/\/ END N3 ROUND2 exact timing append\.\r?\n/gm;
const n3TimingSpread=/,\r?\n  \.\.\.QUESTION_NEW_N3_ROUND2_TIMING_ENTRIES\]/g;
assert.equal([...timingText.matchAll(n3TimingImport)].length,1);assert.equal([...timingText.matchAll(n3TimingSpread)].length,1);
const originalTimingHash=hash(timingText.replace(n3TimingImport,'').replace(n3TimingSpread,']'));
assert.equal(originalTimingHash,intake.files[timingPath],'Timing edits exceed separate N3 append');
const syntheticPath='packages/clinical-content/src/synthetic-content.ts';
const syntheticText=fs.readFileSync(syntheticPath,'utf8');
const n3Catalog=/^\/\/ BEGIN N3 ROUND2 catalog projection - retain the complete original stage and frozen PASS\.\r?\n[\s\S]*?^\/\/ END N3 ROUND2 catalog projection\. No N3 manifest acceptance or save rewriting\.\r?\n/gm;
assert.equal([...syntheticText.matchAll(n3Catalog)].length,1);
const newWrapper='withAcceptedQuestionBankBatch2bRound2Concepts(withAcceptedQuestionNewN3Round2Concepts(QUESTION_CATALOG_RELEASE, QUESTION_NEW_N3_PRE_RELEASE.concepts))';
const oldWrapper='withAcceptedQuestionBankBatch2bRound2Concepts(withAcceptedQuestionNewN3Concepts(QUESTION_CATALOG_RELEASE, QUESTION_NEW_N3_PRE_RELEASE.concepts))';
assert.equal(syntheticText.split(newWrapper).length,2);
const originalSyntheticHash=hash(syntheticText.replace(n3Catalog,'')
 .replace('export const QUESTION_NEW_N3_ROUND2_PRE_RELEASE = validateSyntheticClinicalRelease({','export const QUESTION_CATALOG_RELEASE = validateSyntheticClinicalRelease({')
 .replace('import { QUESTION_NEW_N3_CASES, QUESTION_NEW_N3_TESTED_CONCEPTS } from "./question-new-n3-20261105";','import { QUESTION_NEW_N3_CASES, QUESTION_NEW_N3_TESTED_CONCEPTS, withAcceptedQuestionNewN3Concepts } from "./question-new-n3-20261105";')
 .replace(newWrapper,oldWrapper));
assert.equal(originalSyntheticHash,intake.files[syntheticPath],'Catalog edits exceed separate N3 projection');
const priorFiles=Object.entries(intake.files).filter(([p])=>![indexPath,timingPath,syntheticPath].includes(p)).map(([p,beforeSha256])=>({path:p,beforeSha256,afterSha256:fileHash(p)}));
for(const row of priorFiles)assert.equal(row.afterSha256,row.beforeSha256,'Frozen prior file changed: '+row.path);
assert.equal(digest(c.SYNTHETIC_CLINICAL_RELEASE),intake.live.sha256,'Default live release changed');
assert.equal(digest(c.SYNTHETIC_CLINICAL_RELEASE.concepts),intake.live.conceptsSha256,'Live history cards changed');
assert.equal(digest(c.QUESTION_SHIP_MANIFEST),intake.manifestSha256,'No acceptance or header change authorized');
const concurrentTimings=c.QUESTION_NEW_N3_ROUND2_TIMING_ENTRIES;
const tuple=t=>JSON.stringify([t.caseId,t.nodeId,t.questionVariantId]);
const newTupleIds=new Set(concurrentTimings.map(tuple));
const precedingTimings=c.ANSWER_CHOICE_TIMING_REGISTRY.filter(t=>!newTupleIds.has(tuple(t)));
assert.equal(digest(precedingTimings),intake.timingSha256,'Earlier global timing archive changed');
assert.deepEqual(c.ANSWER_CHOICE_TIMING_REGISTRY,[...precedingTimings,...concurrentTimings],'Only exact N3 timing rows may be appended');
for(const r of f.QUESTION_FLAGS2_ROUND3_REVISIONS){
 assert(!c.QUESTION_SHIP_MANIFEST.accepted.some(a=>a.questionVariantId===r.questionVariantId));
 assert(!c.ANSWER_CHOICE_TIMING_REGISTRY.some(t=>t.questionVariantId===r.questionVariantId));
}
const dependencies=['packages/clinical-content/src/question-flags2-round3-20261105.ts','packages/clinical-content/src/question-flags2-round3-20261105-data.ts',
 'packages/clinical-content/src/question-flags2-round3-evidence-20261105.ts','packages/clinical-content/src/question-flags2-round3-retained-input-20261105.ts'];
const originalIntake=JSON.parse(fs.readFileSync('tools/question-quality/fixtures/question-flags2-round2-before-20261105.json','utf8'));
const itpSiblings=originalIntake.release.cases.filter(cs=>cs.decisionNodes.some(n=>n.questionVariantId.startsWith('question.persistent-itp.'))).map(cs=>({
 caseId:cs.id,nodes:cs.decisionNodes.map(n=>({nodeId:n.id,variantId:n.questionVariantId,key:n.answerChoices.find(a=>a.isCorrect).label}))}));
assert.equal(itpSiblings.length,4);
assert.equal(itpSiblings.flatMap(c=>c.nodes).length,8);
assert(itpSiblings.every(c=>c.nodes[0].variantId.startsWith('question.persistent-itp.hiv-hcv-secondary-evaluation.')&&c.nodes[1].variantId.startsWith('question.persistent-itp.defer-elective-splenectomy.')));
const report={checkedOn:'2026-11-05',scope:'Worker-owned source window. Prior flag bytes, live projection, manifest, earlier timing rows and G06 remain frozen. Separate concurrent N3 source/timing appends are isolated, not overwritten. No release-evidence rebind.',
 live:{...intake.live,afterSha256:digest(c.SYNTHETIC_CLINICAL_RELEASE)},manifest:{beforeSha256:intake.manifestSha256,afterSha256:digest(c.QUESTION_SHIP_MANIFEST),acceptedRows:c.QUESTION_SHIP_MANIFEST.accepted.length},
 globalTiming:{beforeSha256:intake.timingSha256,afterSha256:digest(c.ANSWER_CHOICE_TIMING_REGISTRY),precedingRowsSha256:digest(precedingTimings),concurrentN3Rows:concurrentTimings.length},
 priorFilesVerified:priorFiles.length,priorFiles,
 existingBoundInputsChanged:[{path:indexPath,beforeSha256:intake.files[indexPath],afterOurHunkOnlySha256:hash(current.replace(n3Index,'')),combinedCurrentSha256:fileHash(indexPath),bothOwnedHunksRemovedSha256:strippedHash}],
 concurrentOtherLaneChanges:[{path:indexPath,kind:'Separate marked N3 round-two export append',owner:'N3 writer'},
  {path:timingPath,kind:'Exact N3 round-two import/spread append',owner:'N3 writer',beforeSha256:intake.files[timingPath],combinedCurrentSha256:fileHash(timingPath),n3FragmentsRemovedSha256:originalTimingHash},
  {path:syntheticPath,kind:'Exact N3 catalog-stage, marked projection and accepted-concept wrapper',owner:'N3 writer',beforeSha256:intake.files[syntheticPath],combinedCurrentSha256:fileHash(syntheticPath),n3FragmentsRemovedSha256:originalSyntheticHash}],
 newTransitiveRuntimeDependencies:dependencies.map(path=>({path,sha256:fileHash(path)})),
 structuralCandidateChanges:f.QUESTION_FLAGS2_ROUND3_REVISIONS.map(r=>({id:r.auditId,caseId:r.caseId,...r.sourceStructure})),
 itpSiblingAudit:{scope:'Exact original four paired cases/eight variants in the frozen original-live intake, not a claim that every hematology workup has this sequence. The separate old ASH bibliography remains unresolved.',cases:itpSiblings,
  marrowKeyPresent:false,ownerRecollectedEncounterIdentified:false},
 noNewAcceptance:true,noExistingSourceEditsBeyondIndex:true,
};
const path='tools/question-quality/question-flags2-round3-controls-20261105.json';
if(process.argv.includes('--check'))assert.deepEqual(JSON.parse(fs.readFileSync(path,'utf8')),report,path+' stale');else fs.writeFileSync(path,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({frozenPriorFiles:report.priorFilesVerified,liveUnchanged:true,manifestRows:report.manifest.acceptedRows,newAcceptanceRows:0,
 changedExistingBoundInputs:report.existingBoundInputsChanged.map(i=>i.path),newDependencies:dependencies},null,2));
