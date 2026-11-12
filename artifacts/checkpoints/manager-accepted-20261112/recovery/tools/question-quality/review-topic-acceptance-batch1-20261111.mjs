import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import '../economy-audit/source-loader.mjs';
import {collectAuthoredMetadata,inventoryRelease} from './bank.mjs';
const c=await import('../../packages/clinical-content/src/index.ts');
const {clinicCaseMatchesLine}=await import('../../packages/game-domain/src/clinic-consult-topics.ts');
const {procedureConsultKind}=await import('../../packages/game-domain/src/founder-consults.ts');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const hash=s=>createHash('sha256').update(s).digest('hex');
const digest=o=>hash(JSON.stringify(o));
const raw=p=>hash(fs.readFileSync(p));
const before=read('tools/question-quality/fixtures/question-topic-acceptance-batch1-before-20261111.json');
const disposition=read('docs/research/question-topic-acceptance-batch1-dispositions-20261111.json');
const migration=read('tools/question-quality/fixtures/question-topic-acceptance-batch1-source-migration-20261111.json');
const cases=c.QUESTION_PROGRAM_BATCH1_ACCEPTED_CASES,rows=c.QUESTION_PROGRAM_BATCH1_ACCEPTED_ROWS;
const questions=c.QUESTION_PROGRAM_BATCH1_ACCEPTED_QUESTIONS,retired=c.QUESTION_PROGRAM_BATCH1_RETAINED_CASES;
const timing=c.QUESTION_PROGRAM_BATCH1_ACCEPTED_TIMING_ENTRIES,orders=c.QUESTION_PROGRAM_BATCH1_ACCEPTED_TEST_ORDER_RECORDS;
const live=c.SYNTHETIC_CLINICAL_RELEASE;
assert.equal(rows.length,22);assert.equal(cases.length,18);
const retainedIds=new Set(cases.map(cs=>cs.id));
for(const cs of cases)assert.deepEqual(live.cases.find(r=>r.id===cs.id),cs);
for(const cs of retired)assert(!live.cases.some(r=>r.id===cs.id));
const oldCases=new Map(live.cases.map(cs=>[cs.id,cs]));
for(const cs of retired)oldCases.set(cs.id,cs);
const oldIds=new Set(before.default.conceptIds);
const restored={...live,cases:before.default.caseIds.map(id=>oldCases.get(id)),concepts:live.concepts.filter(co=>oldIds.has(co.id))};
assert.equal(digest(restored),before.default.sha256,'exact old default recovered');
assert.deepEqual(c.QUESTION_SHIP_MANIFEST.accepted.slice(0,before.manifest.accepted.length),before.manifest.accepted);
assert.deepEqual(c.ANSWER_CHOICE_TIMING_REGISTRY.slice(0,before.timing.length),before.timing);
for(const row of migration.files){assert.equal(raw(row.path),row.afterSha256);assert.equal(hash(row.beforeText),row.beforeSha256);}
const protectedInputStatus=before.topics.flatMap(t=>[
 {path:t.sourceModulePath,sha256:t.sourceModuleSha256},
 {path:t.packetPath,sha256:t.packetSha256},
 {path:t.ledgerPath,sha256:t.ledgerSha256},...t.reviews,
]).map(r=>({...r,currentSha256:raw(r.path),unchanged:raw(r.path)===r.sha256}));
// Original accepted data are archived separately; never refresh a worker's
// capture to follow a concurrent draft. Report observed external drift.
const otherClinicalChanges=Object.entries(before.otherFiles).filter(([p,h])=>raw(p)!==h&&!migration.files.some(r=>r.path===p)).map(([path,beforeSha256])=>({path,beforeSha256,currentSha256:raw(path)}));
const concurrentRuntimeChanges=Object.entries(before.runtimeFiles).filter(([p,h])=>raw(p)!==h).map(([path,beforeSha256])=>({path,beforeSha256,currentSha256:raw(path)}));
const l5=read('tools/qa/level-five-integration-results-20261012.json');
const levelFiveInputs=migration.files.filter(r=>l5.inputs[r.path]).map(r=>({path:r.path,beforeSha256:r.beforeSha256,afterSha256:r.afterSha256,recordedSha256:l5.inputs[r.path],alreadyUnboundAtIntake:r.beforeSha256!==l5.inputs[r.path]}));
const metadata=collectAuthoredMetadata(c);
const acceptedLint=inventoryRelease({...live,cases},metadata);
const wholeLint=inventoryRelease(live,metadata);
const itemRows=rows.map(row=>{
 const cs=cases.find(cs=>cs.id===row.caseId),n=cs.decisionNodes.find(n=>n.id===row.nodeId),q=questions.find(q=>q.id===row.questionVariantId);
 const original=before.topics.flatMap(t=>t.candidates).find(r=>r.case.id===cs.id).nodeRecords.find(r=>r.question.id===q.id);
 assert.equal(original.evidence.item.verdict,'PASS');assert.equal(q.reviewStatus,'needs_clinician_review');
 const matchingOrders=orders.filter(o=>o.questionVariantId===q.id),tp=timing.find(t=>t.questionVariantId===q.id);
 assert(clinicCaseMatchesLine(cs,'income.app_consult'));assert.equal(procedureConsultKind(cs),null);
 return {...row,title:q.learningObjective??original.evidence.item.title,review:original.evidence,reviewStatus:q.reviewStatus,holdStatus:'none',
  questionSha256:digest(q),rawReviewedNodeSha256:digest(original.node),retainedRuntimeNodeSha256:digest(n),
  runtime:{setting:cs.requiredClinicalSetting,earliestFacilityStage:cs.earliestFacilityStage,requiredCapabilityIds:cs.requiredCapabilityIds,
   existingClinicAdmissible:true,appClinicAffinity:true,procedureConsultKind:null,topicAffinityEditsNeeded:[],
   timingRegistryEntryId:tp.id??null,timingInstalled:true,testChoiceOrdersPending:matchingOrders,
   orderBindingTarget:matchingOrders.length?'packages/game-domain/src/test-choice-orders.ts: EXACT_TEST_CHOICE_ORDER_RECORDS':null,
   note:'Retrospective existing clinic encounter, not an acute ICU/trauma/dialysis service. No endoscopy/OR/wound topic additions needed.'},
  supportingEvidenceClaimIds:q.supportingEvidenceClaimIds,
  after:{Presentation:cs.presentation,'Current update':n.currentUpdate,Exhibit:n.exhibit??null,Task:n.stem,
   Options:[...n.answerChoices].sort((a,b)=>Number(b.isCorrect)-Number(a.isCorrect)).map(a=>(a.isCorrect?'**KEY:** ':'')+a.label)},
  explanation:n.explanation,lint:acceptedLint.variants.find(v=>v.questionVariantId===q.id)?.findings??[]};
});
const result={checkedOn:'2026-11-11',status:'Manager-listed PASS subset integrated; incomplete cases and unsupported consolidation remain parked.',
 keyDisplay:'Key shown first for review only; runtime choices are randomized.',clinicalApproval:false,
 accepted:itemRows,skipped:disposition.items.filter(r=>r.status==='skipped'),
 counts:{before:{cases:before.default.cases,nodes:before.default.nodes,registeredMeanings:before.default.conceptIds.length,scoredMeanings:before.default.scoredMeanings,
  acceptedRows:before.manifest.accepted.length,timingRows:before.timing.length},
  after:{cases:live.cases.length,nodes:live.cases.flatMap(cs=>cs.decisionNodes).length,registeredMeanings:live.concepts.length,
   scoredMeanings:new Set(live.cases.flatMap(cs=>cs.decisionNodes.map(n=>n.primaryConceptId))).size,
   acceptedRows:c.QUESTION_SHIP_MANIFEST.accepted.length,timingRows:c.ANSWER_CHOICE_TIMING_REGISTRY.length},
  acceptedNodes:rows.length,acceptedCases:cases.length,retiredFreshCases:retired.length,newMeanings:live.concepts.filter(co=>!oldIds.has(co.id)).length,requested:41,skipped:19,
  pendingTestChoiceOrders:orders.length},
 hashes:{defaultBefore:before.default.sha256,defaultAfter:digest(live),manifestBefore:before.manifestSha256,manifestAfter:digest(c.QUESTION_SHIP_MANIFEST),
  catalogBefore:before.catalogSha256,catalogAfter:digest(c.QUESTION_CATALOG_RELEASE)},
 manifestId:c.QUESTION_SHIP_MANIFEST.id,sourceViews:disposition.sourceViews,frozenPreservation:c.QUESTION_PROGRAM_BATCH1_FROZEN_PRESERVATION,
 technicalNameTemplates:disposition.nameTemplates,summaryTransformation:disposition.learningSummaryNote,
 clinicalSourceRecords:c.QUESTION_PROGRAM_BATCH1_SOURCES,evidenceClaims:c.QUESTION_PROGRAM_BATCH1_CLAIMS,
 pendingRuntimeOrders:orders,levelFiveInputs,rawLengthResiduals:c.QUESTION_PROGRAM_BATCH1_LENGTH_RESIDUALS,
 lint:{accepted:acceptedLint.totals,wholeBank:wholeLint.totals},protectedInputStatus,otherClinicalChanges,concurrentRuntimeChanges,
 fixtureNote:'The initial immutable probe lacked examination. Follow-up places the existing operational Examination Room with real commands at35,24, south door offset1. All19 complete PASS cases admit;18 are integrated. Actual default admission and frozen-format3 completion are tested separately.',
 integrationFiles:migration.files.map(({beforeText,...r})=>r)};
const outputs={
 'docs/research/question-topic-acceptance-batch1-packet-20261111.json':result,
 'docs/research/question-topic-acceptance-batch1-lint-20261111.json':{checkedOn:'2026-11-11',advisoryOnly:true,accepted:acceptedLint,wholeBank:wholeLint},
};
for(const [p,value]of Object.entries(outputs)){
 const text=JSON.stringify(value,null,2)+'\n';if(process.argv.includes('--check'))assert.equal(fs.readFileSync(p,'utf8'),text,p+' stale');else fs.writeFileSync(p,text);
}
console.log(JSON.stringify({counts:result.counts,hashes:result.hashes,acceptedLint:acceptedLint.totals,
 protectedDrift:protectedInputStatus.filter(r=>!r.unchanged),otherClinicalChanges,concurrentRuntimeChanges:concurrentRuntimeChanges.length,levelFiveInputs}));
