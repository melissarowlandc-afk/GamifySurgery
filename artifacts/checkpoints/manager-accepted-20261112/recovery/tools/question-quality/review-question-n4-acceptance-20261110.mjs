import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import '../economy-audit/source-loader.mjs';
import {collectAuthoredMetadata,inventoryRelease} from './bank.mjs';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const digest=v=>createHash('sha256').update(JSON.stringify(v)).digest('hex');
const raw=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const before=read('tools/question-quality/fixtures/question-n4-acceptance-before-20261110.json');
const migration=read('tools/question-quality/fixtures/question-n4-acceptance-source-migration-20261110.json');
const c=await import('../../packages/clinical-content/src/index.ts');
const {procedureConsultKind}=await import('../../packages/game-domain/src/founder-consults.ts');
const {clinicCaseMatchesLine}=await import('../../packages/game-domain/src/clinic-consult-topics.ts');
const rows=c.QUESTION_N4_ACCEPTED_ROWS,cases=c.QUESTION_N4_ACCEPTED_CASES,questions=c.QUESTION_N4_ACCEPTED_QUESTIONS;
const live=c.SYNTHETIC_CLINICAL_RELEASE,oldIds=new Set(before.default.conceptIds),oldCases=new Set(before.default.caseIds);
assert.equal(digest(live),'b0e2675e53fb9132f8f8c5b630c34d324d2d97645f40de40f3191a06806fdf48');
assert.equal(digest(c.QUESTION_SHIP_MANIFEST),'08614aeff7c4b733c96b9aff7ac3b9774343e6bd2bfd46c520ae96c221056b42');
assert.equal(digest(c.QUESTION_CATALOG_RELEASE),before.catalogSha256);
for(const cs of live.cases.filter(c=>oldCases.has(c.id)))assert.equal(digest(cs),before.default.caseHashes[cs.id],cs.id);
for(const co of live.concepts.filter(c=>oldIds.has(c.id)))assert.equal(digest(co),before.default.conceptHashes[co.id],co.id);
assert.equal(digest({...live,cases:live.cases.filter(c=>oldCases.has(c.id)),concepts:live.concepts.filter(c=>oldIds.has(c.id))}),before.default.sha256);
for(const file of migration.files){assert.equal(raw(file.path),file.afterSha256);assert.equal(createHash('sha256').update(file.beforeText).digest('hex'),file.beforeSha256);}
for(const r of before.reviews)assert.equal(raw(r.path),r.sha256);
for(const [name,view]of Object.entries(c.QUESTION_N4_ACCEPTED_SOURCE_VIEWS))assert.equal(digest(view),before.sourceViews[name].sha256);
const meta=collectAuthoredMetadata(c),lint=inventoryRelease({...live,cases},meta);assert.equal(lint.totals.findings,0);
const display=(cs,n)=>({Presentation:cs.presentation.replaceAll('{patientName}',cs.patientDisplayName),'Current update':n.currentUpdate??null,Exhibit:n.exhibit??null,
 Task:n.stem.replaceAll('{patientName}',cs.patientDisplayName),Options:[...n.answerChoices].sort((a,b)=>Number(b.isCorrect)-Number(a.isCorrect)).map(a=>(a.isCorrect?'**KEY:** ':'')+a.label)});
const packet=rows.map((r,i)=>{
 const old=before.accepted[i],cs=cases[i],q=questions[i];assert.deepEqual(q,old.question);assert.deepEqual(cs,old.case);
 assert.equal(q.reviewStatus,'needs_clinician_review');assert.equal(q.lastClinicianReview,null);
 assert.deepEqual(old.selfCheck.singleBest.heldKeyClaims,[]);
 const actual=read(old.sourceReview).find(item=>item.id===r.acceptanceId);assert.equal(actual.verdict,'PASS');
 return {...r,title:cs.displayName,reviewStatus:'needs_clinician_review',clinicalApproval:false,independentReview:old.sourceReview,
  verdict:'PASS',sourceHoldStatus:'none',heldKeyClaims:[],keyOrderNotice:'key shown first for review only; runtime answer choices are randomized',
  beforeRole:'Exact independently reviewed source fields; no authoring edits in this acceptance.',before:display(old.case,old.case.decisionNodes[0]),after:display(cs,cs.decisionNodes[0]),
  rationalePairs:{before:old.question.answerChoices.map(a=>[(a.isCorrect?'**KEY:** ':'')+a.label,a.rationale]),after:q.answerChoices.map(a=>[(a.isCorrect?'**KEY:** ':'')+a.label,a.rationale])},
  explanation:q.explanation,supportingEvidenceClaimIds:q.supportingEvidenceClaimIds,whatChanged:'Default-release admission only. Clinical wording/options/claims/status and existing concept meanings are unchanged.',
  conceptMeaning:oldIds.has(q.conceptId)?'existing_meaning_retained':'new_meaning_already_versioned_in_reviewed_candidate',
  frozenPreservation:c.QUESTION_N4_FROZEN_PRESERVATION[i],lint:lint.variants.find(v=>v.questionVariantId===q.id).findings};
});
const authorityPath='packages/game-domain/src/founder-consults.ts',topicPath='packages/game-domain/src/clinic-consult-topics.ts';
const affinity=cases.map(cs=>{const conceptId=cs.decisionNodes[0].primaryConceptId,kind=procedureConsultKind(cs),line=cs.requiredClinicalSetting==='ambulatory_surgery'?'income.ambulatory_operation':
 ['endoscopy','outpatient_endoscopy'].includes(cs.requiredClinicalSetting)?'income.endoscopy':'income.wound_care';
 const recognized=line==='income.ambulatory_operation'?kind==='operation':line==='income.endoscopy'?kind==='endoscopy':clinicCaseMatchesLine(cs,line);
 return {caseId:cs.id,questionVariantId:cs.decisionNodes[0].questionVariantId,conceptId,requiredClinicalSetting:cs.requiredClinicalSetting,requiredCapabilityIds:cs.requiredCapabilityIds,
  intendedLine:line,recognized,mechanism:line==='income.wound_care'?'clinic-consult-topics.ts:woundConcepts':line==='income.endoscopy'?'founder-consults.ts:endoscopicFindingConcepts':
  'founder-consults.ts:procedureConsultKind /procedureConsultPresentations; ambulatory_surgery setting, no concept-ID allowlist',
  action:recognized?'Already recognized: preserve.':'Add this accepted concept ID to the identified topic list.',
  format3WitnessLine:cs.id.includes('incisional-pocket')?'income.app_consult':line};});
const requiredRuntimeChanges={checkedOn:'2026-11-10',scope:'Read-only accepted-only integration handoff; no runtime file edited. Authoring-group membership is not an instruction to install unaccepted topics.',
 affinity,topicAdditions:affinity.filter(r=>!r.recognized).map(r=>({conceptId:r.conceptId,list:r.mechanism,caseId:r.caseId})),
 acceptedDiagnosticOrderExport:'QUESTION_N4_ACCEPTED_TEST_ORDER_RECORDS',acceptedDiagnosticOrderInstallTarget:'packages/game-domain/src/test-choice-orders.ts',
 acceptedDiagnosticOrderTargetArray:'EXACT_TEST_CHOICE_ORDER_RECORDS',
 acceptedDiagnosticOrderPatchInstructions:['Import QUESTION_N4_ACCEPTED_TEST_ORDER_RECORDS from @gamify-surgery/clinical-content.','Append ...QUESTION_N4_ACCEPTED_TEST_ORDER_RECORDS to EXACT_TEST_CHOICE_ORDER_RECORDS.','Keep all existing rows, exact labels/profiles and future_planned non-execution dispositions; do not add result gates or execute the operation already in progress.'],
 acceptedDiagnosticOrders:c.QUESTION_N4_ACCEPTED_TEST_ORDER_RECORDS,
 timingStatus:'Eight classifications installed in clinical-content; eight exact future_planned diagnostic orders are exported only. No domain execution/route binding was edited.',
 familyStatus:'No accepted item is pediatric; install zero N4 family bindings.',
 excluded:'Do not add the returned pedunculated-polyp/post-impaction/testis/new groin/other7 REVISE topic meanings or parked/held items.',
 procedureSourceBoundary:'The existing N4 handoff reports unsourced ordinary OR fallback. This milestone proves real-source admission and frozen reopen, not a global source-only admission guarantee. Preserve source eligibility fixes with the domain owner; no manifest/reopen gate is proposed.',
 inspectedRuntimeFiles:[authorityPath,topicPath,'packages/game-domain/src/clinical-case-eligibility.ts','packages/game-domain/src/test-choice-orders.ts'].map(path=>({path,sha256:raw(path),editedByThisMilestone:false}))};
const bound=read('tools/qa/level-five-integration-results-20261012.json').inputs;
const changes=migration.files.filter(r=>Object.hasOwn(bound,r.path)).map(r=>({path:r.path,recordedEvidenceSha256:bound[r.path],beforeMilestoneSha256:r.beforeSha256,afterSha256:r.afterSha256,alreadyDifferentBefore:bound[r.path]!==r.beforeSha256}));
const runtimeChanges=Object.entries(before.runtimeFiles).filter(([path,hash])=>fs.existsSync(path)&&raw(path)!==hash).map(([path,beforeSha256])=>({path,beforeSha256,afterSha256:raw(path),ownership:'Concurrent domain/save/view-model lane; observed read-only, not edited or reconciled.'}));
const clinicalChanges=Object.entries(before.protectedFiles).filter(([path,hash])=>fs.existsSync(path)&&raw(path)!==hash&&!migration.files.some(r=>r.path===path)).map(([path,beforeSha256])=>({path,beforeSha256,afterSha256:raw(path),ownership:'Observed outside explicit N4 source delta; do not overwrite.'}));
const prefix=fs.readFileSync(before.sharedHandoffPrefix.path).subarray(0,before.sharedHandoffPrefix.bytes);assert.equal(createHash('sha256').update(prefix).digest('hex'),before.sharedHandoffPrefix.sha256);
const scope={checkedOn:'2026-11-10',before:{...before.default.counts,defaultSha256:before.default.sha256,manifestSha256:before.manifestSha256,acceptedRows:before.manifest.accepted.length,timingRows:before.timing.length},
 after:{cases:live.cases.length,nodes:live.cases.flatMap(c=>c.decisionNodes).length,registeredMeanings:live.concepts.length,scoredMeanings:new Set(live.cases.flatMap(c=>c.decisionNodes.map(n=>n.primaryConceptId))).size,
  acceptedRows:c.QUESTION_SHIP_MANIFEST.accepted.length,manifestId:c.QUESTION_SHIP_MANIFEST.id,manifestSha256:digest(c.QUESTION_SHIP_MANIFEST),defaultSha256:digest(live),timingRows:c.ANSWER_CHOICE_TIMING_REGISTRY.length},
 oldCasesExact:before.default.caseIds.length,oldMeaningsExact:before.default.conceptIds.length,catalogUnchanged:true,sourceViews:before.sourceViews,
 levelFiveBoundInputsChanged:changes,domainRuntimeEdited:false,concurrentRuntimeChanges:runtimeChanges,unrelatedClinicalChanges:clinicalChanges,sharedHandoffPrefixUnchanged:true,
 rawCueFindings:lint.totals.findings,sourceHoldCount:0,acceptedOrderRowsExported:8,acceptedOrderRowsInstalledByThisMilestone:0,
 newRuntimeFile:'packages/clinical-content/src/question-n4-accepted-20261110.ts',newlyReferencedN4SourceFiles:Object.keys(before.protectedFiles).filter(p=>p.includes('/question-new-n4')&&!p.endsWith('.test.ts')).map(path=>({path,sha256:raw(path),unchanged:raw(path)===before.protectedFiles[path]})),
 sourceHashNote:'Both raw authoring and schema-normalized case hashes are retained. Field values are deeply equal; JSON property ordering differs. No capture refreshed or clinical fields changed.',rebindPerformed:false};
const output=(path,value)=>{const text=JSON.stringify(value,null,2)+'\n';if(process.argv.includes('--check'))assert.equal(fs.readFileSync(path,'utf8'),text,path+' stale');else fs.writeFileSync(path,text);};
output('docs/research/question-n4-accepted-20261110.json',packet);
output('docs/research/question-n4-runtime-integration-20261110.json',requiredRuntimeChanges);
output('tools/question-quality/question-n4-acceptance-lint-20261110.json',lint);
output('tools/question-quality/question-n4-acceptance-scope-20261110.json',scope);
console.log(JSON.stringify({after:scope.after,topicAdditions:requiredRuntimeChanges.topicAdditions,boundInputsChanged:changes.map(r=>r.path),runtimeEdits:0,concurrentRuntimeChanges:runtimeChanges.length,clinicalChanges,rawLint:lint.totals.findings}));
