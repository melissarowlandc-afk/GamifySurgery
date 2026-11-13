import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
import '../economy-audit/source-loader.mjs';
import {collectAuthoredMetadata,inventoryRelease} from './bank.mjs';
const c=await import('../../packages/clinical-content/src/index.ts');
const d=await import('../../packages/game-domain/src/index.ts');
const {getExactTestChoiceOrderRecordForCase}=await import('../../packages/game-domain/src/test-choice-orders.ts');
const {createLevelFourRoomsQaState}=await import('../../tests/fixtures/level-four-rooms.ts');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const base='question-topic-acceptance-batch8',b=read(`tools/question-quality/fixtures/${base}-before-20261112.json`);
const after=read(`tools/question-quality/fixtures/${base}-after-20261112.json`);
const disposition=read(`docs/research/${base}-dispositions-20261112.json`);
const migration=read(`tools/question-quality/fixtures/${base}-source-migration-20261112.json`);
const hash=b=>createHash('sha256').update(b).digest('hex'),digest=v=>hash(JSON.stringify(v));
const live=c.SYNTHETIC_CLINICAL_RELEASE,manifest=c.QUESTION_SHIP_MANIFEST;
assert.equal(digest(live),after.defaultSha256);assert.equal(digest(manifest),after.manifestSha256);
assert.equal(digest(c.QUESTION_CATALOG_RELEASE),b.catalogSha256);
assert.deepEqual(c.ANSWER_CHOICE_TIMING_REGISTRY.slice(0,b.timing.length),b.timing);
assert.deepEqual(live.concepts.filter(x=>b.defaultRelease.concepts.some(old=>old.id===x.id)),b.defaultRelease.concepts);
const changed=new Set(c.QUESTION_PROGRAM_BATCH8_RETAINED_CASES.map(cs=>cs.id));
for(const cs of b.defaultRelease.cases.filter(cs=>!changed.has(cs.id)))assert.equal(digest(live.cases.find(n=>n.id===cs.id)),digest(cs));
for(const r of b.sourceInputs)assert.equal(hash(fs.readFileSync(r.path)),r.sha256,r.path+' immutable source');
for(const r of migration.files)assert.equal(hash(fs.readFileSync(r.path)),r.afterSha256,r.path+' authorized postimage');
const execute=(state,command,context=d.PROTOTYPE_DOMAIN_CONTEXT)=>{
 const next=d.gameReducer(state,command,context);assert.equal(next.operationReceipts[command.operationId]?.status,'applied',command.operationId);return next;
};
let prepared=createLevelFourRoomsQaState(d.PROTOTYPE_DOMAIN_CONTEXT);
for(const command of [
 {type:'PLACE_ROOM',operationId:'batch8.exam',roomDefinitionId:'room.examination',roomId:'room.batch8.exam',x:35,y:24,orientation:0},
 {type:'PLACE_DOOR',operationId:'batch8.door',roomId:'room.batch8.exam',doorId:'door.batch8.exam',side:'south',offset:1},
])prepared=execute(prepared,command);
Object.assign(prepared,{paused:false,serviceAppointmentsEnabled:false,nextRoutineArrivalTick:Number.MAX_SAFE_INTEGER,nextEmployeeDiscussionTick:Number.MAX_SAFE_INTEGER});
const probes=c.QUESTION_PROGRAM_BATCH8_ACCEPTED_CASES.map(cs=>{
 assert.equal(digest(live.cases.find(n=>n.id===cs.id)),digest(cs),'Exact accepted whole case');
 const state=structuredClone(prepared);const issue=d.getClinicalCaseEligibilityIssue(state,cs,d.PROTOTYPE_DOMAIN_CONTEXT);assert.equal(issue,null,cs.id);
 const command={type:'ADMIT_PATIENT',operationId:'batch8.probe',encounterId:'encounter.batch8.probe',caseId:cs.id,patientDisplayName:cs.patientDisplayName,arrivalClass:'routine'};
 const next=execute(state,command);const e=next.encounters[command.encounterId];
 assert(e.frozenCase.presentation.includes(e.patientDisplayName));
 return {caseId:cs.id,clinicAdmissible:true,nativeAdmission:true,actualPatientName:e.patientDisplayName,demographics:e.frozenCase.prototypeDemographics};
});
const orders=c.QUESTION_PROGRAM_BATCH8_ACCEPTED_TEST_ORDER_RECORDS;
for(const o of [...orders,...c.QUESTION_PROGRAM_BATCH8_RETAINED_TEST_ORDER_RECORDS]){
 const cs=[...c.QUESTION_PROGRAM_BATCH8_ACCEPTED_CASES,...c.QUESTION_PROGRAM_BATCH8_RETAINED_CASES]
  .find(cs=>cs.id===o.caseId&&cs.decisionNodes.some(n=>n.id===o.nodeId&&n.questionVariantId===o.questionVariantId));
 assert(cs,o.questionVariantId);const n=cs.decisionNodes.find(n=>n.questionVariantId===o.questionVariantId);
 assert.deepEqual(getExactTestChoiceOrderRecordForCase(cs.id,n,o.choiceId),o,'Exact installed current/historical wait');
}
const metadata=collectAuthoredMetadata(c);
const acceptedLint=inventoryRelease({...live,cases:c.QUESTION_PROGRAM_BATCH8_ACCEPTED_CASES},metadata);
const beforeLint=inventoryRelease(b.defaultRelease,metadata),wholeLint=inventoryRelease(live,metadata);
assert.equal(acceptedLint.totals.findings,0,'Reviewed targets need zero raw cue findings');
const evidence=read('tools/qa/level-five-integration-results-20261012.json');
const levelFiveInputs=migration.files.filter(r=>evidence.inputs[r.path]).map(r=>({path:r.path,beforeSha256:r.beforeSha256,
 afterSha256:r.afterSha256,recordedSha256:evidence.inputs[r.path],alreadyUnboundAtIntake:r.beforeSha256!==evidence.inputs[r.path]}));
const packet={checkedOn:'2026-11-12',reviewDisplay:'Key shown first for review only. Runtime options shuffle.',
 accepted:b.candidates.map(item=>({id:item.id,questionVariantId:item.question.id,conceptId:item.question.conceptId,
  contentVersion:item.question.contentVersion,caseId:item.case.id,nodeId:item.case.decisionNodes[0].id,
  review:item.evidence,sourceQuestionSha256:item.questionSha256,sourceNodeSha256:item.nodeSha256,sourceCaseSha256:item.caseSha256,
  reviewStatus:'needs_clinician_review',clinicalApprovalGranted:false,ownerDirection:disposition.directions.find(r=>r.ownerId===item.id),
  before:item.predecessors.map(cs=>({caseId:cs.id,Presentation:cs.presentation,questions:cs.decisionNodes.map(n=>({questionVariantId:n.questionVariantId,
   'Current update':n.currentUpdate??null,Exhibit:n.exhibit??null,Task:n.stem,Options:[...n.answerChoices].sort((a,b)=>Number(b.isCorrect)-Number(a.isCorrect)).map(x=>(x.isCorrect?'**KEY:** ':'')+x.label)}))})),
  after:{Presentation:item.case.presentation,'Current update':item.case.decisionNodes[0].currentUpdate??null,
   Exhibit:item.case.decisionNodes[0].exhibit??null,Task:item.question.stem,
   Options:[...item.question.answerChoices].sort((a,b)=>Number(b.isCorrect)-Number(a.isCorrect)).map(x=>(x.isCorrect?'**KEY:** ':'')+x.label)},
  explanation:item.question.explanation,evidenceMapping:item.revision.evidenceMapping,rubric:item.revision.authorReview,
  runtime:probes.find(p=>p.caseId===item.case.id),lint:acceptedLint.variants.find(v=>v.questionVariantId===item.question.id)?.findings??[]})),
 skipped:[],counts:{before:{cases:b.defaultRelease.cases.length,nodes:b.defaultRelease.cases.flatMap(c=>c.decisionNodes).length,
  meanings:b.defaultRelease.concepts.length,scoredMeanings:new Set(b.defaultRelease.cases.flatMap(c=>c.decisionNodes.map(n=>n.primaryConceptId))).size,
  acceptedRows:b.manifest.accepted.length,timingRows:b.timing.length},after:after.counts},
 manifestSha256:after.manifestSha256,defaultSha256:after.defaultSha256,catalogSha256:after.catalogSha256,timingSha256:after.timingSha256,
 withdrawnAuthorityRows:disposition.withdrawnAuthorityRows,retargetedConsolidations:disposition.retargetedConsolidations,
 retirements:disposition.retirements,wholeCaseReplacement:disposition.wholeCaseReplacement,easyPregnancy:disposition.easyPregnancy,
 waitBindings:orders.map(r=>({...r,installed:true})),retainedHistoricalWaitBindings:c.QUESTION_PROGRAM_BATCH8_RETAINED_TEST_ORDER_RECORDS,
 remainingWaitBindings:[],runtimeProbes:probes,sourceInputs:b.sourceInputs,levelFiveInputs,
 lint:{target:acceptedLint.totals,beforeWholeBank:beforeLint.totals,wholeBank:wholeLint.totals},
 constraints:{sourceFilesEdited:false,balanceOrProgressionEdited:false,clinicalProseEdited:false,git:false,network:false,agents:false,rebind:false}};
for(const [path,value]of [[`docs/research/${base}-packet-20261112.json`,packet],
 [`tools/question-quality/${base}-lint-20261112.json`,{accepted:acceptedLint,beforeWholeBank:beforeLint,wholeBank:wholeLint}]]){
 const text=JSON.stringify(value,null,2)+'\n';if(process.argv.includes('--check'))assert.equal(fs.readFileSync(path,'utf8'),text,path+' drift');else fs.writeFileSync(path,text);
}
console.log(JSON.stringify({accepted:packet.accepted.length,skipped:0,probes:probes.length,waits:orders.length,
 retainedWaits:packet.retainedHistoricalWaitBindings.length,lint:packet.lint,counts:after.counts,manifestSha256:after.manifestSha256}));
