import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import '../economy-audit/source-loader.mjs';
import {collectAuthoredMetadata,inventoryRelease} from './bank.mjs';
const content=await import('../../packages/clinical-content/src/index.ts');
const domain=await import('../../packages/game-domain/src/index.ts');
const {getExactTestChoiceOrderRecordForCase}=await import('../../packages/game-domain/src/test-choice-orders.ts');
const {createLevelFourRoomsQaState}=await import('../../tests/fixtures/level-four-rooms.ts');
const {createPediatricAppointmentsQaState}=await import('../../tests/fixtures/pediatric-appointments.ts');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const hash=b=>createHash('sha256').update(b).digest('hex');
const digest=v=>hash(JSON.stringify(v));
const before=read('tools/question-quality/fixtures/question-topic-acceptance-batch7-before-20261112.json');
const after=read('tools/question-quality/fixtures/question-topic-acceptance-batch7-after-20261112.json');
const disposition=read('docs/research/question-topic-acceptance-batch7-dispositions-20261112.json');
const freeze=read('docs/research/question-topic-acceptance-batch7-source-freeze-20261112.json');
const migration=read('tools/question-quality/fixtures/question-topic-acceptance-batch7-source-migration-20261112.json');
const live=content.SYNTHETIC_CLINICAL_RELEASE,manifest=content.QUESTION_SHIP_MANIFEST;
const rows=content.QUESTION_PROGRAM_BATCH7_ACCEPTED_ROWS,cases=content.QUESTION_PROGRAM_BATCH7_ACCEPTED_CASES,questions=content.QUESTION_PROGRAM_BATCH7_ACCEPTED_QUESTIONS;
assert.equal(digest(live),after.defaultSha256);assert.equal(digest(manifest),after.manifestSha256);
assert.equal(digest(content.QUESTION_CATALOG_RELEASE),before.catalogSha256);
assert.deepEqual(manifest.accepted.slice(0,before.manifest.accepted.length),before.manifest.accepted);
assert.deepEqual(content.ANSWER_CHOICE_TIMING_REGISTRY.slice(0,before.timing.length),before.timing);
const changed=new Set([...cases.map(c=>c.id),...content.QUESTION_PROGRAM_BATCH7_RETAINED_CASES.map(c=>c.id)]);
for(const cs of before.defaultRelease.cases.filter(c=>!changed.has(c.id)))assert.equal(digest(live.cases.find(c=>c.id===cs.id)),digest(cs));
for(const c of before.defaultRelease.concepts)assert.equal(digest(live.concepts.find(n=>n.id===c.id)),digest(c));
for(const r of migration.files)assert.equal(hash(fs.readFileSync(r.path)),r.afterSha256,r.path+' scoped postimage');
const execute=(state,command,context=domain.PROTOTYPE_DOMAIN_CONTEXT)=>{const next=domain.gameReducer(state,command,context);assert.equal(next.operationReceipts[command.operationId]?.status,'applied',command.operationId);return next;};
let prepared=createLevelFourRoomsQaState(domain.PROTOTYPE_DOMAIN_CONTEXT);
for(const command of [
  {type:'PLACE_ROOM',operationId:'topic7.final.exam',roomDefinitionId:'room.examination',roomId:'room.topic7.final.exam',x:35,y:24,orientation:0},
  {type:'PLACE_DOOR',operationId:'topic7.final.exam.door',roomId:'room.topic7.final.exam',doorId:'door.topic7.final.exam',side:'south',offset:1},
  {type:'PLACE_ROOM',operationId:'topic7.final.office',roomDefinitionId:'room.surgeon_office',roomId:'room.topic7.final.office',x:40,y:24,orientation:0},
  {type:'PLACE_DOOR',operationId:'topic7.final.office.door',roomId:'room.topic7.final.office',doorId:'door.topic7.final.office',side:'south',offset:1},
])prepared=execute(prepared,command);
const probes=cases.map(cs=>{
  assert.equal(digest(live.cases.find(c=>c.id===cs.id)),digest(cs));
  if(cs.participant?.kind==='employee_discussion'){
    assert(domain.employeeDiscussionCaseIsRuntimeSafe(cs));
    let state=structuredClone(prepared);
    state.employees.push({id:'employee.topic7.capture',staffRoleDefinitionId:'staff.surgeon',displayName:'Dana Rivera',appearance:state.founder.appearance,hiredAtFacilityTick:0,salaryPerExpenseInterval:0,morale:100,trainingLevel:1,homeRoomInstanceId:'room.topic7.final.office',location:{x:40,y:25},path:[],pathIndex:0,lastMovedAtFacilityTick:0,lastPraisedAtFacilityTick:null,nextIdleActionAtFacilityTick:Number.MAX_SAFE_INTEGER,facilityTask:null});
    Object.assign(state,{paused:false,nextRoutineArrivalTick:Number.MAX_SAFE_INTEGER,nextFinancialPostingTick:Number.MAX_SAFE_INTEGER,nextEmployeeDiscussionTick:1,serviceAppointmentsEnabled:false});
    const context={...domain.PROTOTYPE_DOMAIN_CONTEXT,clinicalRelease:{...live,cases:[cs]}};
    const command={type:'ADVANCE_TICK',operationId:'topic7.final.employee',advancedAtRealMs:1_800_000_000_000};
    state=execute(state,command,context);const discussions=Object.values(state.employeeDiscussions??{});
    assert.equal(discussions.length,1,cs.id);assert.equal(discussions[0].frozenCase.id,cs.id);
    return {caseId:cs.id,route:'employee_discussion',clinicAdmissible:true,nativeAdmission:true,restrictedToAcceptedCaseForDeterministicProbe:true,questionVariantIds:discussions[0].frozenCase.decisionNodes.map(n=>n.questionVariantId)};
  }
  let state=cs.pediatricProfile?createPediatricAppointmentsQaState(domain.PROTOTYPE_DOMAIN_CONTEXT,1):structuredClone(prepared);
  Object.assign(state,{paused:false,serviceAppointmentsEnabled:false,nextRoutineArrivalTick:Number.MAX_SAFE_INTEGER,nextEmployeeDiscussionTick:Number.MAX_SAFE_INTEGER});
  const issue=domain.getClinicalCaseEligibilityIssue(state,cs,domain.PROTOTYPE_DOMAIN_CONTEXT);assert.equal(issue,null,cs.id);
  const command={type:'ADMIT_PATIENT',operationId:'topic7.final.patient',encounterId:'encounter.topic7.final',caseId:cs.id,patientDisplayName:cs.patientDisplayName,arrivalClass:'routine'};
  state=execute(state,command);const encounter=state.encounters[command.encounterId];
  let child=null;
  if(cs.pediatricProfile){
    const demographics=encounter.frozenCase.prototypeDemographics;
    assert(domain.pediatricStillEligibleEntries(demographics.sexLabel,demographics.ageYears).some(a=>a.stillId===encounter.patientAppearance.stillId));
    const companions=state.retailExternalActors.filter(a=>a.kind==='companion'&&a.linkedEncounterId===encounter.id);assert.equal(companions.length,1);
    assert(encounter.pediatricFamilyId);
    child={demographics,stillId:encounter.patientAppearance.stillId,parent:companions[0].displayName,pediatricFamilyId:encounter.pediatricFamilyId};
  }
  assert(encounter.frozenCase.presentation.includes(encounter.patientDisplayName));
  return {caseId:cs.id,route:cs.pediatricProfile?'pediatric_clinic':'clinic',clinicAdmissible:true,nativeAdmission:true,issue,receipt:state.operationReceipts[command.operationId],actualPatientName:encounter.patientDisplayName,demographics:encounter.frozenCase.prototypeDemographics,child};
});
const metadata=collectAuthoredMetadata(content);
const acceptedLint=inventoryRelease({...live,cases},metadata),wholeLint=inventoryRelease(live,metadata);
const beforeLint=inventoryRelease(before.defaultRelease,metadata);
const targetIds=new Set(rows.map(r=>r.questionVariantId));
const targetLint=acceptedLint.variants.filter(v=>targetIds.has(v.questionVariantId));
const preservedContextLint=acceptedLint.variants.filter(v=>!targetIds.has(v.questionVariantId));
const waitBindings=content.QUESTION_PROGRAM_BATCH7_ACCEPTED_TEST_ORDER_RECORDS.map(order=>{
  const node=cases.find(c=>c.id===order.caseId).decisionNodes.find(n=>n.id===order.nodeId);
  const installed=getExactTestChoiceOrderRecordForCase(order.caseId,node,order.choiceId);
  assert.deepEqual(installed,order,'Exact future-planned runtime wait binding '+order.choiceId);
  return {...order,installed:true,remainingRuntimeBinding:false};
});
const items=rows.map(row=>{
  const cs=cases.find(c=>c.id===row.caseId),node=cs.decisionNodes.find(n=>n.id===row.nodeId),q=questions.find(q=>q.id===row.questionVariantId);
  const f=freeze.records.find(f=>f.questionVariantId===row.questionVariantId);
  assert.equal(q.reviewStatus,'needs_clinician_review');assert.equal(digest(node),f.acceptedNodeSha256);assert.equal(digest(q),f.acceptedQuestionSha256);
  return {...row,reviewStatus:q.reviewStatus,clinicalApproval:false,reviewPath:f.reviewPath,nodeSha256:digest(node),questionSha256:digest(q),caseSha256:digest(cs),sourceNodeSha256:f.sourceNodeSha256,sourceFiles:f.sourceFiles,
    runtime:probes.find(p=>p.caseId===cs.id),waitBindings:waitBindings.filter(b=>b.nodeId===node.id&&b.questionVariantId===node.questionVariantId),
    after:{Presentation:cs.presentation,'Current update':node.currentUpdate??null,Exhibit:node.exhibit??null,Task:node.stem,
      Options:[...node.answerChoices].sort((a,b)=>Number(b.isCorrect)-Number(a.isCorrect)).map(c=>(c.isCorrect?'**KEY:** ':'')+c.label)},
    explanation:node.explanation,lint:acceptedLint.variants.find(v=>v.questionVariantId===node.questionVariantId)?.findings??[]};
});
const evidence=read('tools/qa/level-five-integration-results-20261012.json');
const levelFiveInputs=migration.files.filter(r=>evidence.inputs[r.path]).map(r=>({path:r.path,beforeSha256:r.beforeSha256,afterSha256:r.afterSha256,recordedSha256:evidence.inputs[r.path],alreadyUnboundAtIntake:r.beforeSha256!==evidence.inputs[r.path]}));
const sourceInputs=before.topics.flatMap(t=>[t.source,t.packet,t.ledger,...t.reviews.map(({records,...r})=>r)]).map(r=>({...r,currentSha256:hash(fs.readFileSync(r.path)),unchanged:hash(fs.readFileSync(r.path))===r.sha256}));
const observedConcurrentChanges=Object.entries(before.observed).filter(([p,sha])=>fs.existsSync(p)&&hash(fs.readFileSync(p))!==sha&&!migration.files.some(r=>r.path===p)).map(([path,beforeSha256])=>({path,beforeSha256,currentSha256:hash(fs.readFileSync(path))}));
const packet={checkedOn:'2026-11-12',reviewDisplay:'Key shown first for review only. Runtime choices shuffle.',accepted:items,skipped:disposition.items.filter(r=>r.status==='skipped'),nonpass:disposition.nonpass,droppedFlag:disposition.droppedFlag,
  counts:{before:{cases:before.defaultRelease.cases.length,nodes:before.defaultRelease.cases.flatMap(c=>c.decisionNodes).length,registeredMeanings:before.defaultRelease.concepts.length,scoredMeanings:new Set(before.defaultRelease.cases.flatMap(c=>c.decisionNodes.map(n=>n.primaryConceptId))).size,acceptedRows:before.manifest.accepted.length,timingRows:before.timing.length},after:after.counts},
  manifestSha256:digest(manifest),defaultSha256:digest(live),catalogSha256:digest(content.QUESTION_CATALOG_RELEASE),timingSha256:digest(content.ANSWER_CHOICE_TIMING_REGISTRY),
  sourceViews:Object.entries(content.QUESTION_PROGRAM_BATCH7_ACCEPTED_SOURCE_VIEWS).map(([name,v])=>({name,sha256:digest(v),cases:v.cases.length,nodes:v.cases.flatMap(c=>c.decisionNodes).length})),
  ownerConfirmations:content.QUESTION_PROGRAM_BATCH7_CLINICAL_CONFIRMATIONS,retirements:disposition.retirements,retirementCoverage:disposition.retirementCoverage,
  waitBindings,remainingWaitBindings:[],runtimeProbes:probes,sourceInputs,observedConcurrentChanges,levelFiveInputs,
  lint:{acceptedCaseContext:acceptedLint.totals,target:{variants:targetLint.length,profileContexts:targetLint.reduce((n,v)=>n+v.profileContexts,0),findings:targetLint.reduce((n,v)=>n+v.findings.length,0)},preservedContext:preservedContextLint,beforeWholeBank:beforeLint.totals,wholeBank:wholeLint.totals},constraints:{topicFilesEdited:false,ownerDecisionsFilesEdited:false,clinicalWordingsEdited:false,clinicalApprovalsScope:'Only the 22 exact prior owner-confirmed versions; 17 full and five key-only. Newly accepted 82 variants stay drafts.',balanceOrProgressionEdited:false,rebind:false,git:false,network:false,agents:false},
};
for(const [p,value]of [['docs/research/question-topic-acceptance-batch7-packet-20261112.json',packet],['tools/question-quality/question-topic-acceptance-batch7-lint-20261112.json',{accepted:acceptedLint,beforeWholeBank:beforeLint,wholeBank:wholeLint}]]){
  if(process.argv.includes('--check')){
    const recordedText=fs.readFileSync(p,'utf8'),recorded=JSON.parse(recordedText);
    let comparable=value;
    if(p.endsWith('-packet-20261112.json')){
      // These are observations of concurrent writers, not authority/source pins.
      // Preserve the captured observation while checking every accepted byte,
      // source input, runtime probe, manifest/default hash and lint result.
      assert(Array.isArray(recorded.observedConcurrentChanges));
      assert.equal(new Set(recorded.observedConcurrentChanges.map(r=>r.path)).size,
        recorded.observedConcurrentChanges.length);
      for(const r of recorded.observedConcurrentChanges){
        assert.equal(r.beforeSha256,before.observed[r.path],r.path+' observed intake hash');
        assert.match(r.currentSha256,/^[a-f0-9]{64}$/);
        assert(!migration.files.some(f=>f.path===r.path),r.path+' is outside batch ownership');
      }
      comparable={...value,observedConcurrentChanges:recorded.observedConcurrentChanges};
    }
    assert.equal(recordedText,JSON.stringify(comparable,null,2)+'\n',p+' drift');
  }else fs.writeFileSync(p,JSON.stringify(value,null,2)+'\n');
}
console.log(JSON.stringify({accepted:items.length,skipped:packet.skipped.length,nativeProbes:probes.length,waitBindingsInstalled:waitBindings.length,remaining:0,targetLint:packet.lint.target,preservedContextFindings:preservedContextLint.reduce((n,v)=>n+v.findings.length,0),beforeWholeBankLint:beforeLint.totals.findings,wholeBankLint:wholeLint.totals.findings,changedLevelFiveInputs:levelFiveInputs.map(r=>r.path)}));
