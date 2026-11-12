import fs from 'node:fs';
import assert from 'node:assert/strict';
import '../economy-audit/source-loader.mjs';
const input=JSON.parse(fs.readFileSync('tools/question-quality/fixtures/question-topic-acceptance-batch1-before-20261111.json','utf8'));
const d=await import('../../packages/game-domain/src/index.ts');
const {createLevelFourRoomsQaContext,createLevelFourRoomsQaState}=await import('../../tests/fixtures/level-four-rooms.ts');
const baseline=createLevelFourRoomsQaContext();
let prepared=createLevelFourRoomsQaState(baseline);
for(const command of [
 {type:'PLACE_ROOM',operationId:'topic.probe.exam',roomDefinitionId:'room.examination',roomId:'room.topic.probe.exam',x:35,y:24,orientation:0},
 {type:'PLACE_DOOR',operationId:'topic.probe.door',roomId:'room.topic.probe.exam',doorId:'door.topic.probe.exam',side:'south',offset:1},
]){prepared=d.gameReducer(prepared,command,baseline);assert.equal(prepared.operationReceipts[command.operationId]?.status,'applied',prepared.operationReceipts[command.operationId]?.message);}
Object.assign(prepared,{facilityLevel:4,paused:false,nextRoutineArrivalTick:Number.MAX_SAFE_INTEGER,nextEmployeeDiscussionTick:Number.MAX_SAFE_INTEGER});
const results=[];
for(const topic of input.topics)for(const candidate of topic.candidates){
 const cs=candidate.case,concepts=[...new Map([...baseline.clinicalRelease.concepts,...candidate.nodeRecords.map(r=>r.concept)].map(c=>[c.id,c])).values()];
 const ctx={...baseline,clinicalRelease:{...baseline.clinicalRelease,concepts,cases:[cs]}};
 const state=structuredClone(prepared),issue=d.getClinicalCaseEligibilityIssue(state,cs,ctx);
 const command={type:'ADMIT_PATIENT',operationId:'topic.probe.admit',encounterId:'encounter.topic.probe',caseId:cs.id,patientDisplayName:cs.patientDisplayName,arrivalClass:'routine'};
 const admitted=d.gameReducer(state,command,ctx),receipt=admitted.operationReceipts[command.operationId];
 results.push({topic:topic.config.slug,caseId:cs.id,questionVariantIds:cs.decisionNodes.map(n=>n.questionVariantId),requiredClinicalSetting:cs.requiredClinicalSetting,
  requiredCapabilityIds:cs.requiredCapabilityIds,earliestFacilityStage:cs.earliestFacilityStage,eligibilityIssue:issue,receipt,
  clinicAdmissible:cs.requiredClinicalSetting==='clinic'&&cs.routineEligible&&issue===null&&receipt?.status==='applied',
  frozenQuestionVariantIds:admitted.encounters['encounter.topic.probe']?.frozenCase.decisionNodes.map(n=>n.questionVariantId)??[],
  initialProbe:candidate.currentRuntimeProbe});
}
const result={checkedOn:'2026-11-11',scope:'Current runtime and current balance; existing Examination Room placed with real commands, no capability, eligibility or topic overlay.',
 fixture:'Existing Level4 QA clinic with one operational room.examination; all historical review cases remain in clinic. No ICU/dialysis/trauma service invented.',
 initialFixtureLimitation:'The immutable first probe had no examination room; eight cases correctly failed capability.examination there. This follow-up supplies that existing buildable room rather than editing source requirements or refreshing intake.',
 cases:results,admissibleCases:results.filter(r=>r.clinicAdmissible).length,inadmissibleCases:results.filter(r=>!r.clinicAdmissible).length};
fs.writeFileSync('docs/research/question-topic-acceptance-batch1-admission-probe-20261111.json',JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({admissible:result.admissibleCases,inadmissible:result.inadmissibleCases,rejected:results.filter(r=>!r.clinicAdmissible)}));
