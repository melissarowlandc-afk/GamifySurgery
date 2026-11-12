import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import '../economy-audit/source-loader.mjs';
const c=await import('../../packages/clinical-content/src/index.ts');
const orders=await import('../../packages/game-domain/src/test-choice-orders.ts');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const before=read('tools/question-quality/fixtures/question-new-n3-acceptance-before-20261105.json');
const supplemental=read('tools/question-quality/fixtures/question-new-n3-acceptance-supplemental-before-20261105.json');
const domainBefore=read('tools/question-quality/fixtures/question-new-n3-acceptance-domain-before-20261105.json');
const packet=read('docs/research/question-new-n3-round3-20261105.json');
const review=read('docs/research/question-new-n3-review2-20261105.json');
const hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const digest=v=>createHash('sha256').update(JSON.stringify(v)).digest('hex');
const ids=[
 'review.n3.bilateral-carotid-symptom-attribution.v2',
 'review.n3.postsplenectomy-nodule-function-before-targeting.v2',
 'review.n3.dysphagia-biopsy-territory-after-negative-endoscopy.v2',
 'review.n3.tumor-screen-versus-family-test-sequence.v2',
 'review.n3.gastric-lymphoma-new-large-cell-process.v2',
];
const live=c.SYNTHETIC_CLINICAL_RELEASE,manifest=c.QUESTION_SHIP_MANIFEST,source=c.QUESTION_NEW_N3_ROUND3_SOURCE_RELEASE;
const rows=manifest.accepted.filter(a=>a.acceptanceId.startsWith('review.n3.'));
assert.deepEqual(rows.map(a=>a.acceptanceId),ids);
const exact=rows.map(row=>{
 const pin=packet.frozenPreservation.find(p=>p.id===row.acceptanceId),variant=packet.variants.find(v=>v.id===row.acceptanceId);
 assert.equal(review.find(r=>r.id===row.acceptanceId).verdict,'PASS');
 assert.equal(digest(variant),pin.variantSha256);assert.equal(digest(variant.authoredTemplate),pin.authoredCaseSha256);
 const cs=live.cases.find(cs=>cs.id===row.caseId),n=cs.decisionNodes[0];
 assert.equal(digest(cs),pin.authoredCaseSha256);assert.deepEqual(cs,source.cases.find(c=>c.id===cs.id));
 assert.equal(row.sourceView,'n3-round3');assert.equal(row.decision,'docs/research/question-new-n3-manager-decision-20261105.md');
 assert.equal(manifest.headerSources[cs.id],'n3-round3');
 assert.equal(row.nodeId,n.id);assert.equal(row.questionVariantId,n.questionVariantId);assert.equal(row.conceptId,n.primaryConceptId);
 assert.deepEqual(live.concepts.find(c=>c.id===row.conceptId),source.concepts.find(c=>c.id===row.conceptId));
 const q=c.QUESTION_NEW_N3_ROUND3_QUESTIONS.find(q=>q.id===row.questionVariantId);
 assert.equal(q.reviewStatus,'needs_clinician_review');assert.equal(q.lastClinicianReview,null);assert.deepEqual(variant.directKeySupport.heldKeyClaims,[]);
 const timing=c.ANSWER_CHOICE_TIMING_REGISTRY.filter(t=>t.caseId===row.caseId&&t.nodeId===row.nodeId&&t.questionVariantId===row.questionVariantId);
 assert.equal(timing.length,1);
 const requests=timing[0].classification.kind==='test_choices'?timing[0].classification.choices.filter(c=>c.timing.kind==='test'):[];
 const exactOrders=requests.map(choice=>{
  const record=orders.EXACT_TEST_CHOICE_ORDER_RECORDS.find(r=>r.caseId===row.caseId&&r.nodeId===row.nodeId&&r.questionVariantId===row.questionVariantId&&r.choiceId===choice.choiceId);
  assert(record);assert.equal(record.choiceLabel,choice.choiceLabel);assert.deepEqual(record.disposition,{kind:'not_executed',reason:'external_only'});return record;
 });
 return {...row,variantSha256:pin.variantSha256,authoredCaseSha256:pin.authoredCaseSha256,conceptSha256:digest(live.concepts.find(c=>c.id===row.conceptId)),
  reviewStatus:q.reviewStatus,heldKeyClaims:[],clinicalApproval:false,existingExactOrders:exactOrders};
});
const caseIds=new Set(rows.map(r=>r.caseId)),oldConceptIds=new Set(before.default.conceptIds);
assert.deepEqual(live.cases.filter(cs=>cs.id.startsWith('case.n3.')).map(cs=>cs.id).sort(),[...caseIds].sort());
for(const[id,sha]of Object.entries(before.default.caseHashes))assert.equal(digest(live.cases.find(cs=>cs.id===id)),sha,id+' earlier case changed');
for(const[id,sha]of Object.entries(before.default.conceptHashes))assert.equal(digest(live.concepts.find(c=>c.id===id)),sha,id+' earlier meaning changed');
const restored={...live,cases:live.cases.filter(cs=>!caseIds.has(cs.id)),concepts:live.concepts.filter(c=>oldConceptIds.has(c.id))};
assert.equal(digest(restored),before.default.sha256);
assert.deepEqual(live.concepts.filter(c=>!oldConceptIds.has(c.id)).map(c=>c.id).sort(),rows.map(r=>r.conceptId).sort());
const headers={...manifest.headerSources};rows.forEach(r=>delete headers[r.caseId]);
assert.deepEqual({...manifest,id:before.manifest.id,accepted:manifest.accepted.filter(a=>a.sourceView!=='n3-round3'),headerSources:headers},before.manifest);
assert.equal(digest(c.QUESTION_CATALOG_RELEASE),before.catalogSha256);assert.equal(digest(source),before.round3SourceSha256);
assert.equal(digest(c.ANSWER_CHOICE_TIMING_REGISTRY),before.timingSha256);
const authorized=new Set([...Object.keys(before.files),...Object.keys(supplemental.files),...Object.keys(domainBefore.files)]);
const protectedUnchanged=[],authorizedProtectedChanges=[];
for(const[path,sha]of Object.entries(before.protectedFiles)){
 if(authorized.has(path)&&hash(path)!==sha)authorizedProtectedChanges.push({path,beforeSha256:sha,afterSha256:hash(path)});
 else{assert.equal(hash(path),sha,'Protected authored/review/capture/cloud file changed: '+path);protectedUnchanged.push(path);}
}
const existingChanges=Object.entries({...before.files,...supplemental.files,...domainBefore.files}).filter(([path,sha])=>hash(path)!==sha)
 .map(([path,beforeSha256])=>({path,beforeSha256,afterSha256:hash(path)}));
const runtimePaths=['packages/clinical-content/src/question-ship-manifest.ts','packages/clinical-content/src/synthetic-content.ts','packages/clinical-content/src/question-new-n3-round3-source-20261105.ts'];
const levelFiveEvidencePath='tools/qa/level-five-integration-results-20261012.json',evidence=read(levelFiveEvidencePath);
const summary=r=>({cases:r.cases.length,nodes:r.cases.reduce((n,c)=>n+c.decisionNodes.length,0),uniqueQuestions:new Set(r.cases.flatMap(c=>c.decisionNodes.map(n=>n.questionVariantId))).size,
 activeConcepts:new Set(r.cases.flatMap(c=>c.decisionNodes.map(n=>n.primaryConceptId))).size,registeredConcepts:r.concepts.length,sha256:digest(r)});
const report={checkedOn:'2026-11-05',decision:'docs/research/question-new-n3-manager-decision-20261105.md',scope:'Five exact frozen N3 review-two PASS acceptances only. No question edits, clinical approval, source-hold-dependent keys, domain runtime edits or rebind.',
 defaultBefore:summary(restored),defaultAfter:summary(live),unchangedDefaultCases:restored.cases.length,unchangedHistoricalConcepts:restored.concepts.length,accepted:exact,
 manifest:{beforeId:before.manifest.id,afterId:manifest.id,beforeAccepted:before.manifest.accepted.length,afterAccepted:manifest.accepted.length,
  legacyBindings:manifest.legacyBindings.length,replacements:manifest.replacements,unchangedPriorRows:before.manifest.accepted.length},
 sourceView:{name:'n3-round3',exportName:'QUESTION_NEW_N3_ROUND3_SOURCE_RELEASE',cases:source.cases.length,beforeSha256:before.round3SourceSha256,afterSha256:digest(source)},
 catalog:{unchanged:true,sha256:before.catalogSha256},timing:{unchanged:true,records:c.ANSWER_CHOICE_TIMING_REGISTRY.length,sha256:before.timingSha256},
 excluded:{roundThreeRepairs:source.cases.filter(cs=>!caseIds.has(cs.id)).map(cs=>cs.decisionNodes[0].questionVariantId),parkedCaseIds:c.QUESTION_NEW_N3_ROUND3_PARKED_CASE_IDS},
 protectedUnchangedCount:protectedUnchanged.length,protectedUnchanged,authorizedProtectedChanges,existingChanges,
 changedRuntimeInputs:runtimePaths.map(path=>existingChanges.find(row=>row.path===path)),newRuntimeFiles:[],
 levelFive:{evidencePath:levelFiveEvidencePath,evidenceSha256:hash(levelFiveEvidencePath),rebound:false,
  changedExistingBoundInputs:runtimePaths.filter(path=>Object.hasOwn(evidence.inputs,path)).map(path=>({...existingChanges.find(row=>row.path===path),recordedEvidenceSha256:evidence.inputs[path]})),
  modifiedRuntimeInputsNotCurrentlyListed:runtimePaths.filter(path=>!Object.hasOwn(evidence.inputs,path))},
 knownAcceptedLengthException:{questionVariantId:'question.n3.gastric-lymphoma-new-large-cell-process.v2',keyCharacters:63,longestDistractorCharacters:62,
  exactCaseSha256:'c0a73c140565409277e2dbc382c3eee17ad8e0699c71db73fabe13a1401f09fc',reason:'Keep the explicitly frozen manager-accepted independent PASS version; all prior twelve exceptions and all other strict length checks remain.'},
 noDomainAdmissionCheckAdded:true,noSaveOrJournalFormatChanged:true,noClinicalAuthoring:true};
const path='docs/research/question-new-n3-acceptance-scope-20261105.json';
if(process.argv.includes('--check'))assert.deepEqual(read(path),report);else fs.writeFileSync(path,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({before:report.defaultBefore,after:report.defaultAfter,manifest:report.manifest,exactPreserved:exact.length,
 protectedUnchanged:protectedUnchanged.length,existingChangedFiles:existingChanges.length,boundInputs:report.levelFive.changedExistingBoundInputs.map(r=>r.path)},null,2));
