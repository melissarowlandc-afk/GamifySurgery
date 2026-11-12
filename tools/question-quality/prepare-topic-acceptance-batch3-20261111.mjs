import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import '../economy-audit/source-loader.mjs';
const domain=await import('../../packages/game-domain/src/index.ts');
const {createLevelFourRoomsQaState}=await import('../../tests/fixtures/level-four-rooms.ts');
const before=JSON.parse(fs.readFileSync('tools/question-quality/fixtures/question-topic-acceptance-batch3-before-20261111.json','utf8'));
const digest=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
const path='tools/question-quality/fixtures/question-topic-acceptance-batch3-selection-20261111.json';
assert(!fs.existsSync(path),'Selection capture is immutable.');
const seenNodes=new Set(),duplicates=[],selected=[];
for(const topic of before.topics)for(const candidate of topic.candidates){
  if(candidate.records.some(r=>seenNodes.has(r.node.id))){
    assert(candidate.records.every(r=>seenNodes.has(r.node.id)),'Partially overlapping authored cases require explicit resolution.');
    duplicates.push({caseId:candidate.case.id,nodeIds:candidate.records.map(r=>r.node.id),reason:'Same exact scored identities already retained in the current primary source context.'});continue;
  }
  let runtime=candidate.runtime;
  if(candidate.case.participant?.kind==='employee_discussion'){
    // Statistics use the existing non-patient, single-skill staff-discussion path.
    // Exercise its ordinary scheduler rather than passing it to ADMIT_PATIENT.
    let state=createLevelFourRoomsQaState(domain.PROTOTYPE_DOMAIN_CONTEXT);
    for(const command of [
      {type:'PLACE_ROOM',operationId:'topic3.stats.office',roomDefinitionId:'room.surgeon_office',roomId:'room.topic3.stats.office',x:40,y:24,orientation:0},
      {type:'PLACE_DOOR',operationId:'topic3.stats.door',roomId:'room.topic3.stats.office',doorId:'door.topic3.stats.office',side:'south',offset:1},
    ]){state=domain.gameReducer(state,command,domain.PROTOTYPE_DOMAIN_CONTEXT);assert.equal(state.operationReceipts[command.operationId]?.status,'applied');}
    state.employees.push({id:'employee.topic3.surgeon',staffRoleDefinitionId:'staff.surgeon',displayName:'Dana Rivera',appearance:state.founder.appearance,
      hiredAtFacilityTick:0,salaryPerExpenseInterval:0,morale:100,trainingLevel:1,homeRoomInstanceId:'room.topic3.stats.office',location:{x:40,y:25},path:[],pathIndex:0,
      lastMovedAtFacilityTick:0,lastPraisedAtFacilityTick:null,nextIdleActionAtFacilityTick:Number.MAX_SAFE_INTEGER,facilityTask:null});
    Object.assign(state,{paused:false,nextRoutineArrivalTick:Number.MAX_SAFE_INTEGER,nextFinancialPostingTick:Number.MAX_SAFE_INTEGER,nextEmployeeDiscussionTick:1,serviceAppointmentsEnabled:false});
    const registry=new Map(before.default.concepts.map(co=>[co.id,co]));for(const record of candidate.records)if(!registry.has(record.concept.id))registry.set(record.concept.id,record.concept);
    const context={...domain.PROTOTYPE_DOMAIN_CONTEXT,clinicalRelease:{...domain.PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease,concepts:[...registry.values()],cases:[candidate.case]}};
    const command={type:'ADVANCE_TICK',operationId:'topic3.stats.schedule',advancedAtRealMs:1800000000000};
    const next=domain.gameReducer(state,command,context),discussions=Object.values(next.employeeDiscussions??{});
    assert.equal(discussions.length,1,candidate.case.id+' current staff scheduler');
    assert.equal(discussions[0].frozenCase.id,candidate.case.id);
    runtime={...runtime,route:'employee_discussion',patientAdmissionExpectedToReject:true,
      receipt:next.operationReceipts[command.operationId],scheduledDiscussionId:discussions[0].id,
      clinicAdmissible:domain.employeeDiscussionCaseIsRuntimeSafe(candidate.case),requiredStaffRoleDefinitionIds:candidate.case.participant.requiredStaffRoleDefinitionIds};
  }
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
fs.writeFileSync(path,JSON.stringify({checkedOn:'2026-11-11',selected,duplicates,retirements},null,2)+'\n');
console.log(JSON.stringify({cases:selected.length,nodes:seenNodes.size,duplicates,retirements:retirements.length,splitRetirements:retirements.filter(r=>r.allTargetCaseIds.length>1),staffCases:selected.filter(r=>r.runtime.route==='employee_discussion').length}));
