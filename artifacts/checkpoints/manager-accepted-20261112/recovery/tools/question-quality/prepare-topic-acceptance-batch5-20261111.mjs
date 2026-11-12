import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import '../economy-audit/source-loader.mjs';
const domain=await import('../../packages/game-domain/src/index.ts');
const content=await import('../../packages/clinical-content/src/index.ts');
const {createPediatricAppointmentsQaState}=await import('../../tests/fixtures/pediatric-appointments.ts');
const before=JSON.parse(fs.readFileSync('tools/question-quality/fixtures/question-topic-acceptance-batch5-before-20261111.json','utf8'));
const digest=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
const path='tools/question-quality/fixtures/question-topic-acceptance-batch5-selection-20261111.json';
assert(!fs.existsSync(path)||process.argv.includes('--timing-recheck'),'Selection capture already exists.');
if(fs.existsSync(path))assert(fs.existsSync('tools/question-quality/fixtures/question-topic-acceptance-batch5-initial-preflight-20261111.json'),'Preserve the initial preflight before correcting it.');
const seenNodes=new Set(),duplicates=[],selected=[],admissionChecks=[];
for(const topic of before.topics)for(const candidate of topic.candidates){
  if(candidate.records.some(r=>seenNodes.has(r.node.id))){
    assert(candidate.records.every(r=>seenNodes.has(r.node.id)),'Partially overlapping authored cases require explicit resolution.');
    duplicates.push({caseId:candidate.case.id,nodeIds:candidate.records.map(r=>r.node.id),reason:'Same exact scored identities already retained in the current primary source context.'});continue;
  }
  let runtime=candidate.runtime;
  if(candidate.case.pediatricProfile){
    // Exercise the existing operational pediatric clinic, including child art
    // and a real examination room. Keep the intake's adult-clinic probe intact.
    let state=createPediatricAppointmentsQaState(domain.PROTOTYPE_DOMAIN_CONTEXT,1);
    Object.assign(state,{paused:false,nextRoutineArrivalTick:Number.MAX_SAFE_INTEGER,nextFinancialPostingTick:Number.MAX_SAFE_INTEGER,
      nextEmployeeDiscussionTick:Number.MAX_SAFE_INTEGER,serviceAppointmentsEnabled:false});
    const registry=new Map(before.default.concepts.map(co=>[co.id,co]));for(const record of candidate.records)if(!registry.has(record.concept.id))registry.set(record.concept.id,record.concept);
    const context={...domain.PROTOTYPE_DOMAIN_CONTEXT,clinicalRelease:{...domain.PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease,concepts:[...registry.values()],cases:[candidate.case]}};
    const originalTimingLength=content.ANSWER_CHOICE_TIMING_REGISTRY.length;
    const missing=candidate.timing.filter(entry=>!content.ANSWER_CHOICE_TIMING_REGISTRY.some(current=>
      current.caseId===entry.caseId&&current.nodeId===entry.nodeId&&current.questionVariantId===entry.questionVariantId));
    content.ANSWER_CHOICE_TIMING_REGISTRY.push(...missing);
    const issue=domain.getClinicalCaseEligibilityIssue(state,candidate.case,context);
    const command={type:'ADMIT_PATIENT',operationId:'topic5.pediatric.admit',encounterId:'encounter.topic5.pediatric',
      caseId:candidate.case.id,patientDisplayName:candidate.case.patientDisplayName,arrivalClass:'routine'};
    const next=domain.gameReducer(state,command,context);
    content.ANSWER_CHOICE_TIMING_REGISTRY.splice(originalTimingLength);
    const encounter=next.encounters[command.encounterId];
    if(issue===null){
      assert.equal(next.operationReceipts[command.operationId]?.status,'applied',candidate.case.id);
      assert.deepEqual(encounter.frozenCase.prototypeDemographics,candidate.case.prototypeDemographics);
      assert(domain.pediatricStillEligibleEntries(candidate.case.prototypeDemographics.sexLabel,candidate.case.prototypeDemographics.ageYears)
        .some(entry=>entry.stillId===encounter.patientAppearance.stillId),candidate.case.id+' compatible child art');
      assert(encounter.pediatricFamilyId,candidate.case.id+' parent accompaniment');
    }
    runtime={...runtime,route:'pediatric_clinic',issue,receipt:next.operationReceipts[command.operationId],
      clinicAdmissible:issue===null&&next.operationReceipts[command.operationId]?.status==='applied',
      proposedTimingsInstalledForProbe:true,
      requiredRoomDefinitionId:'room.pediatric_examination',childStillId:encounter?.patientAppearance.stillId,
      pediatricFamilyId:encounter?.pediatricFamilyId};
  }
  admissionChecks.push({caseId:candidate.case.id,runtime});
  if(!runtime.clinicAdmissible)continue;
  candidate.records.forEach(r=>seenNodes.add(r.node.id));
  selected.push({topic:topic.config.slug,salvage:topic.config.salvage,caseId:candidate.case.id,rawCaseSha256:digest(candidate.case),runtime});
}
// An old paired case may contribute independently reviewed objectives to several
// new complete cases. Retire its identity once, while admitting every target.
// Keep explicit coverage of all targets; do not weaken duplicate-target guards.
const retirementTargets=new Map();
for(const item of selected){const row=before.topics.find(t=>t.config.slug===item.topic).candidates.find(c=>c.case.id===item.caseId);
  for(const id of row.legacyCaseIds){const targets=retirementTargets.get(id)??[];targets.push(item.caseId);retirementTargets.set(id,targets);}}
const retirements=[...retirementTargets].map(([legacyCaseId,targets])=>({legacyCaseId,primaryTargetCaseId:targets[0],allTargetCaseIds:targets,
  reason:targets.length>1?'The old paired case is decomposed into these separately accepted complete cases; retire its fresh identity once at the first declared target. Every target has exact acceptance rows.':'Declared source-audit replacement.'}));
fs.writeFileSync(path,JSON.stringify({checkedOn:'2026-11-12',selected,duplicates,retirements,admissionChecks,
  previousPreflight:'tools/question-quality/fixtures/question-topic-acceptance-batch5-initial-preflight-20261111.json'},null,2)+'\n');
console.log(JSON.stringify({cases:selected.length,nodes:seenNodes.size,duplicates,retirements:retirements.length,splitRetirements:retirements.filter(r=>r.allTargetCaseIds.length>1),staffCases:selected.filter(r=>r.runtime.route==='employee_discussion').length}));
