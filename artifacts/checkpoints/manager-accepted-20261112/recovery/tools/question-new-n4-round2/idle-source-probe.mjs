// Read-only disposable reproducer. After a domain fix, unsourcedAdmissions
// should become empty; no old behavior is installed as an assertion to retain.
import '../economy-audit/source-loader.mjs';
import fs from 'node:fs';
const b=await import('../../packages/clinical-content/src/question-new-n4-round2-20261110.ts');
const d=await import('../../packages/game-domain/src/index.ts');
const {routineOrFixture}=await import('../../packages/game-domain/tests/routine-or-demand.fixture.ts');
const {endoscopyReadyClinic}=await import('../../packages/game-domain/tests/routine-endoscopy-ready.fixture.ts');
const rows=[];
for(const group of ['intra_op','intra_endoscopy']){
 const index=b.QUESTION_NEW_N4_ROUND2_ITEMS.findIndex(i=>i.group===group),cs=b.QUESTION_NEW_N4_ROUND2_CASES[index];
 let state=structuredClone(group==='intra_op'?routineOrFixture().state:endoscopyReadyClinic({provider:true}).state);
 Object.assign(state,{facilityLevel:Math.max(3,cs.earliestFacilityStage),paused:false,serviceAppointmentsEnabled:false,
  nextRoutineArrivalTick:state.facilityTick+1,nextEmployeeDiscussionTick:Number.MAX_SAFE_INTEGER});
 const ctx={...d.PROTOTYPE_DOMAIN_CONTEXT,clinicalRelease:{...b.QUESTION_NEW_N4_ROUND2_SOURCE_RELEASE,cases:[cs]}};
 const before=new Set(Object.keys(state.encounters)),initialServiceCount=state.serviceOperations.length;
 for(let i=0;i<4;i++)state=d.gameReducer(state,{type:'ADVANCE_TICK',operationId:'n4r2.idle.'+group+'.'+i,
  advancedAtRealMs:state.createdAtRealMs+(i+1)*1000},ctx);
 rows.push({group,caseId:cs.id,initialServiceOperations:initialServiceCount,finalServiceOperations:state.serviceOperations.length,
  unsourcedAdmissions:Object.values(state.encounters).filter(e=>!before.has(e.id)).map(e=>({encounterId:e.id,
   questionVariantId:e.frozenCase.decisionNodes[0].questionVariantId,consult:e.consult??null,presentation:e.frozenCase.presentation})),
  expected:'No current-procedure case should be admitted through ordinary fallback without an actual compatible procedure source.',
  followUp:'Domain-lane selection integration only. Do not add manifest enforcement, save-integrity throws or a concept-set reopen gate.'});
}
const receipt={scope:'Explicit unapproved N4 round-2 cases; ordinary arrival probe with appointments disabled. No product edits.',
 detected:rows.some(r=>r.unsourcedAdmissions.some(e=>e.consult===null)),rows};
fs.writeFileSync('.local-dev/question-new-n4-round2-20261110/idle-source-probe.json',JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify(receipt));
