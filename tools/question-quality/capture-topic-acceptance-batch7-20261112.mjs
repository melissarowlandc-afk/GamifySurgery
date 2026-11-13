import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import '../economy-audit/source-loader.mjs';
import {collectAuthoredMetadata} from './bank.mjs';
import {syntheticClinicalCaseSchema} from '../../packages/clinical-content/src/schema.ts';

const output='tools/question-quality/fixtures/question-topic-acceptance-batch7-before-20261112.json';
assert(!fs.existsSync(output),'Immutable intake already exists');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8').replace(/^\uFEFF/,''));
const hash=b=>createHash('sha256').update(b).digest('hex');
const digest=v=>hash(JSON.stringify(v));
const record=p=>({path:p,sha256:hash(fs.readFileSync(p))});
const objects=root=>{const out=[],seen=new WeakSet();function walk(v){if(!v||typeof v!=='object'||seen.has(v))return;seen.add(v);if(!Array.isArray(v))out.push(v);Object.values(v).forEach(walk);}walk(root);return out;};
const content=await import('../../packages/clinical-content/src/index.ts');
const domain=await import('../../packages/game-domain/src/index.ts');
const {createLevelFourRoomsQaState}=await import('../../tests/fixtures/level-four-rooms.ts');
const {createPediatricAppointmentsQaState}=await import('../../tests/fixtures/pediatric-appointments.ts');
const live=content.SYNTHETIC_CLINICAL_RELEASE;
const configs=[
  {slug:'statistics',prefix:'STATISTICS_TOPIC_ROUND3',caseKeys:['STATISTICS_TOPIC_ROUND3_CASES'],conceptKey:'STATISTICS_TOPIC_ROUND3_CONCEPTS',expectedPass:31},
  {slug:'ethics-professionalism',prefix:'ETHICS_PROFESSIONALISM_ROUND3_FIX',caseKeys:['ETHICS_PROFESSIONALISM_ROUND3_FIX_CASES'],conceptKey:'ETHICS_PROFESSIONALISM_ROUND3_FIX_TESTED_CONCEPTS',expectedPass:15},
  {slug:'ostomy-enterocutaneous-fistula',prefix:'OSTOMY_TOPIC',caseKeys:['OSTOMY_TOPIC_CASES'],conceptKey:'OSTOMY_TOPIC_TESTED_CONCEPTS',expectedPass:9},
  {slug:'quality-safety-systems',prefix:'QUALITY_SAFETY_SYSTEMS_TOPIC_ROUND3_FIX',caseKeys:['QUALITY_SAFETY_SYSTEMS_TOPIC_ROUND3_FIX_CASES'],conceptKey:'QUALITY_SAFETY_SYSTEMS_TOPIC_ROUND3_FIX_TESTED_CONCEPTS',expectedPass:30},
];
let prepared=createLevelFourRoomsQaState(domain.PROTOTYPE_DOMAIN_CONTEXT);
for(const command of [
  {type:'PLACE_ROOM',operationId:'topic7.exam',roomDefinitionId:'room.examination',roomId:'room.topic7.exam',x:35,y:24,orientation:0},
  {type:'PLACE_DOOR',operationId:'topic7.door',roomId:'room.topic7.exam',doorId:'door.topic7.door',side:'south',offset:1},
]){prepared=domain.gameReducer(prepared,command,domain.PROTOTYPE_DOMAIN_CONTEXT);assert.equal(prepared.operationReceipts[command.operationId]?.status,'applied');}
Object.assign(prepared,{paused:false,serviceAppointmentsEnabled:false,nextRoutineArrivalTick:Number.MAX_SAFE_INTEGER,nextEmployeeDiscussionTick:Number.MAX_SAFE_INTEGER});
function probe(cs,concepts,timing){
  const registry=new Map(live.concepts.map(c=>[c.id,c]));for(const c of concepts)if(!registry.has(c.id))registry.set(c.id,c);
  const floor=Math.max(cs.earliestFacilityStage,...cs.decisionNodes.map(n=>registry.get(n.primaryConceptId)?.earliestFacilityStage??0));
  const normalized={...cs,routineEligible:true,earliestFacilityStage:floor};
  const context={...domain.PROTOTYPE_DOMAIN_CONTEXT,clinicalRelease:{...live,concepts:[...registry.values()],cases:[normalized]}};
  if(cs.participant?.kind==='employee_discussion')return {clinicAdmissible:cs.requiredClinicalSetting==='clinic'&&domain.employeeDiscussionCaseIsRuntimeSafe(normalized),route:'employee_discussion',safe:domain.employeeDiscussionCaseIsRuntimeSafe(normalized),floor};
  const state=cs.pediatricProfile?createPediatricAppointmentsQaState(domain.PROTOTYPE_DOMAIN_CONTEXT,1):structuredClone(prepared);
  Object.assign(state,{paused:false,serviceAppointmentsEnabled:false,nextRoutineArrivalTick:Number.MAX_SAFE_INTEGER});
  const length=content.ANSWER_CHOICE_TIMING_REGISTRY.length;
  try{
    content.ANSWER_CHOICE_TIMING_REGISTRY.push(...timing);
    const issue=domain.getClinicalCaseEligibilityIssue(state,normalized,context);
    const command={type:'ADMIT_PATIENT',operationId:'topic7.capture',encounterId:'encounter.topic7.capture',caseId:cs.id,patientDisplayName:cs.patientDisplayName,arrivalClass:'routine'};
    const admitted=domain.gameReducer(state,command,context);const receipt=admitted.operationReceipts[command.operationId];
    return {clinicAdmissible:cs.requiredClinicalSetting==='clinic'&&issue===null&&receipt?.status==='applied',route:cs.pediatricProfile?'pediatric_clinic':'clinic',issue,receipt,floor,
      demographics:admitted.encounters[command.encounterId]?.frozenCase.prototypeDemographics,childStillId:admitted.encounters[command.encounterId]?.patientAppearance.stillId};
  }finally{content.ANSWER_CHOICE_TIMING_REGISTRY.splice(length);}
}
const modules={},topics=[];
for(const config of configs){
  const sourcePath=`packages/clinical-content/src/question-topic-${config.slug}-20261111.ts`;
  const packetPath=`docs/research/question-topic-${config.slug}-20261111.json`;
  const ledgerPath=`docs/research/sources-question-topic-${config.slug}-20261111.json`;
  const m=await import('../../'+sourcePath);modules[config.slug]=m;const packet=read(packetPath);
  const latest=new Map();const reviews=['review3','review3fix'].map(stage=>{const path=`docs/research/question-topic-${config.slug}-${stage}-20261112.json`;const rows=read(path);for(const row of rows)latest.set(row.id,{path,record:row});return {...record(path),records:rows};});
  const requested=[...latest.values()].filter(r=>r.record.verdict==='PASS');assert.equal(requested.length,config.expectedPass,config.slug+' PASS count');
  const cases=config.caseKeys.flatMap(key=>m[key]).map(cs=>syntheticClinicalCaseSchema.parse(cs));
  const questions=m[config.prefix+'_QUESTIONS'],concepts=m[config.conceptKey],timings=m[config.prefix+'_TIMING_ENTRIES'];
  assert(Array.isArray(questions)&&Array.isArray(concepts)&&Array.isArray(timings),config.slug+' explicit source exports');
  const candidates=cases.filter(cs=>cs.decisionNodes.every(n=>latest.get(n.questionVariantId)?.record.verdict==='PASS')).map(cs=>{
    const records=cs.decisionNodes.map(node=>{
      const question=questions.find(q=>q.id===node.questionVariantId);assert(question,'Exact source question '+node.questionVariantId);
      assert.equal(question.explanation,node.explanation);assert.equal(question.reviewStatus,'needs_clinician_review');
      assert.deepEqual(question.answerChoices.map(c=>[c.id,c.label,c.isCorrect]),node.answerChoices.map(c=>[c.id,c.label,c.isCorrect]));
      const concept=concepts.find(c=>c.id===node.primaryConceptId);assert(concept,node.primaryConceptId);
      return {node,question,concept,evidence:latest.get(node.questionVariantId),sourceNodeJson:JSON.stringify(node),sourceQuestionJson:JSON.stringify(question)};
    });
    const timing=cs.decisionNodes.map(n=>{const row=timings.find(t=>t.caseId===cs.id&&t.nodeId===n.id&&t.questionVariantId===n.questionVariantId);assert(row,'Timing '+n.id);return row;});
    return {case:cs,records,timing,runtime:probe(cs,concepts,timing)};
  });
  const dispositions=requested.map(e=>{
    const accepted=candidates.find(c=>c.records.some(r=>r.question.id===e.record.id)&&c.runtime.clinicAdmissible);
    const sourceContexts=objects(m).filter(c=>c.decisionNodes?.some(n=>n.questionVariantId===e.record.id)&&c.id?.startsWith('case.'));
    const unique=[...new Map(sourceContexts.map(c=>[digest(c),c])).values()];
    return {questionVariantId:e.record.id,nodeId:e.record.nodeId,evidence:e,status:accepted?'accepted':'skipped',caseId:accepted?.case.id??null,
      contexts:unique.map(c=>({caseId:c.id,sha256:digest(c),scoredSiblings:c.decisionNodes.map(n=>({nodeId:n.id,questionVariantId:n.questionVariantId,latestVerdict:latest.get(n.questionVariantId)?.record.verdict??'outside review3'}))})),
      reason:accepted?'Complete final-PASS case is admissible in its existing clinic participant route.':candidates.some(c=>c.records.some(r=>r.question.id===e.record.id))?'Existing clinic admission failed.':'No complete current reviewed source case; a non-PASS/superseded scored sibling or source-context omission prevents whole-case acceptance.'};
  });
  const proposals=config.slug==='statistics'?[]:config.slug==='ethics-professionalism'?(packet.dedicatedRewriteRound3.round3Fix?.dispositions??packet.dedicatedRewriteRound3.dispositions):config.slug==='ostomy-enterocutaneous-fistula'?packet.round3DedicatedRewrite.priorItemDispositions:packet.round3.priorCandidateAudit;
  topics.push({config,source:record(sourcePath),packet:record(packetPath),ledger:record(ledgerPath),reviews,candidates,dispositions,
    nonpass:[...latest.values()].filter(r=>r.record.verdict!=='PASS'),retirementProposals:proposals});
}
const flag=await import('../../packages/clinical-content/src/question-flag-d97aa716-round2-20261112.ts');modules.flag=flag;
const flagPacketPath='docs/research/question-flag-d97aa716-20261112.json';
const flagReviewPath='docs/research/question-flag-d97aa716-review2-20261112.json';
const flagReview=read(flagReviewPath);
const flags=flag.QUESTION_FLAG_D97AA716_ROUND2_REVISIONS.filter(r=>['D97-1','D97-2'].includes(r.id)).map(r=>{
  const cs=flag.QUESTION_FLAG_D97AA716_ROUND2_CASES.find(c=>c.id===r.caseId);const node=cs.decisionNodes.find(n=>n.id===r.nodeId);
  const evidence={path:flagReviewPath,record:flagReview.find(v=>v.id===r.id)};assert.equal(evidence.record.verdict,'PASS');
  return {id:r.id,case:cs,records:[{node,question:r.question,concept:live.concepts.find(c=>c.id===node.primaryConceptId),evidence,sourceNodeJson:JSON.stringify(node),sourceQuestionJson:JSON.stringify(r.question)}],
    timing:flag.QUESTION_FLAG_D97AA716_ROUND2_TIMING_ENTRIES.filter(t=>t.caseId===cs.id),runtime:probe(cs,live.concepts,flag.QUESTION_FLAG_D97AA716_ROUND2_TIMING_ENTRIES.filter(t=>t.caseId===cs.id))};
});
const ownerConfig=[
 ['TOPIC-232','pediatric-clinic.pilonidal-first-clinic-visit.v1','full'],['TOPIC-232','pediatric-clinic.pilonidal-mild-cleft-symptoms.v2','full'],
 ['TOPIC-044','topic.burns-inhalation.mixed-smoke-antidote.v1','full'],['TOPIC-075','topic.esophagus-motility-achalasia.botulinum-rescue-risk.v1','full'],
 ['TOPIC-104','topic.head-neck-salivary.n05.v2','full'],['G01','topic.hematology-transfusion-coagulation.marrow-reassessment.v2','full'],
 ['TOPIC-138','topic.liver-benign-portal-infection.preemptive-tips.v1','full'],['TOPIC-139','topic.liver-benign-portal-infection.rebleeding-tips.v1','full'],
 ['N3-ASPIRATION-ROUTE','topic.nutrition-support-metabolism.gastric-aspiration-route.v1','key_only'],
 ['TOPIC-172','topic.oncology-genetics-principles.checkpoint-colitis.v1','full'],['TOPIC-173','topic.oncology-genetics-principles.refractory-colitis-infection.v2','full'],
 ['TOPIC-187','topic.ostomy-enterocutaneous-fistula.new-output-infection-survey.v1','full'],['TOPIC-229','topic.perioperative-risk-recovery.extravasation-progressive-injury.v1','full'],
 ['TOPIC-340','topic.stomach-ulcer-bleeding-motility.failed-endoscopy-embolization.v2','full'],['TOPIC-288','topic.thyroid-nodules-cancer.n18.v2','full'],
 ['TOPIC-291','topic.transplant-immunosuppression.aza-allopurinol.v1','full'],['TOPIC-295','topic.transplant-immunosuppression.dgf-biopsy.v2','full'],
 ['TOPIC-192','pseudocyst.symptomatic-endoscopic-drainage.v4.r4','full'],
 ['TOPIC-034','topic.bowel-ibd-malabsorption-short-bowel.crohn-surveillance.v2','key_only'],['TOPIC-069','topic.esophagus-gerd-barrett-hiatal.repair-with-reflux-control.v1','key_only'],
 ['TOPIC-120','topic.hematology-transfusion-coagulation.hit-functional-confirmation.v2','key_only'],['TOPIC-313','vascular-carotid.near-occlusion.20261111.v1','key_only'],
];
const metadata=collectAuthoredMetadata({...content,modules});
const ownerConfirmations=ownerConfig.map(([ownerId,suffix,scope])=>{
  const id='question.'+suffix;const contexts=live.cases.filter(c=>c.decisionNodes.some(n=>n.questionVariantId===id));assert.equal(contexts.length,1,'One current confirmed version '+id);
  const node=contexts[0].decisionNodes.find(n=>n.questionVariantId===id);
  const matches=(metadata.questions.get(id)??[]).filter(q=>q.contentVersion&&JSON.stringify(q.answerChoices?.map(c=>[c.id,c.label,c.isCorrect]))===JSON.stringify(node.answerChoices.map(c=>[c.id,c.label,c.isCorrect])));
  const question=matches.find(q=>q.stem===node.stem&&q.explanation===node.explanation)??matches.find(q=>q.explanation===node.explanation)??matches[0];
  assert(question?.contentVersion,'Authored question metadata '+id);
  assert.deepEqual(question.answerChoices.map(c=>[c.id,c.label,c.isCorrect]),node.answerChoices.map(c=>[c.id,c.label,c.isCorrect]));
  return {ownerId,scope,caseId:contexts[0].id,nodeId:node.id,question,questionSha256:digest(question),nodeSha256:digest(node),correctChoiceId:node.answerChoices.find(c=>c.isCorrect).id};
});
const retirementIds=[['TOPIC-202','question.pediatric-gi-abdominal-wall.preterm-hernia-timing.v1'],['TOPIC-218','question.pediatric-neck-thoracic-gu.20261111.cdh-physiologic-readiness.v2'],['TOPIC-287','question.differentiated-thyroid-cancer.preoperative-nodal-ultrasound.v4.r5']];
const ownerRetirements=retirementIds.map(([ownerId,questionVariantId])=>{
  const cs=live.cases.filter(c=>c.decisionNodes.some(n=>n.questionVariantId===questionVariantId));assert.equal(cs.length,1,'One directed retirement '+questionVariantId);return {ownerId,questionVariantId,case:cs[0]};
});
const claimIds=[...new Set([...topics.flatMap(t=>t.candidates.filter(c=>c.runtime.clinicAdmissible).flatMap(c=>c.records)),...flags.flatMap(f=>f.records)].flatMap(r=>r.question.supportingEvidenceClaimIds))];
const claims=claimIds.map(id=>{assert(metadata.claims.has(id),'Claim '+id);return metadata.claims.get(id);});
const sources=[...new Set(claims.flatMap(c=>c.sourceIds))].map(id=>{assert(metadata.sources.has(id),'Source '+id);return metadata.sources.get(id);});
const observed={};for(const directory of ['packages/clinical-content/src','packages/game-domain/src','packages/game-domain/tests','packages/balance-config/src','apps/player/src']){
  function walk(p){for(const e of fs.readdirSync(p,{withFileTypes:true})){const child=p+'/'+e.name;if(e.isDirectory())walk(child);else if(/\.(?:ts|tsx)$/.test(e.name))observed[child]=hash(fs.readFileSync(child));}}walk(directory);
}
const sourcePreimages=['question-ship-manifest.ts','question-ship-projection.ts','question-ship-manifest-validation.ts','synthetic-content.ts','index.ts','answer-choice-timing.ts','answer-choice-timing.test.ts','pilot-content.test.ts','question-ship-manifest.test.ts','question-program-batch6-acceptance-test-support.ts','question-program-batch6-acceptance-20261112.test.ts','question-flag-d97aa716-20261112.test.ts','question-flag-d97aa716-round2-20261112.test.ts'].map(name=>{
  const path='packages/clinical-content/src/'+name;return {path,beforeSha256:hash(fs.readFileSync(path)),beforeText:fs.readFileSync(path,'utf8')};
});
for(const path of ['apps/player/src/questionFlagD97aa716SaveCompatibility.test.ts','apps/player/src/questionFlagD97aa716Round2SaveCompatibility.test.ts'])sourcePreimages.push({path,beforeSha256:hash(fs.readFileSync(path)),beforeText:fs.readFileSync(path,'utf8')});
for(const p of ['tools/question-quality/review-question-flag-d97aa716-round2-20261112.mjs',flagPacketPath,'docs/research/sources-question-flag-d97aa716-20261112.json','tools/question-quality/question-flag-d97aa716-lint-20261112.json'])sourcePreimages.push({path:p,beforeSha256:hash(fs.readFileSync(p)),beforeText:fs.readFileSync(p,'utf8')});
const shared=fs.readFileSync('docs/handoffs/CURRENT_THREAD_HANDOFF.md');
const intake={capturedOn:'2026-11-12',topics,flags,flagPacket:record(flagPacketPath),flagReview:record(flagReviewPath),ownerDecision:record('docs/research/owner-decision-answers-20261112.md'),ownerConfirmations,ownerRetirements,claims,sources,
  defaultRelease:live,defaultSha256:digest(live),manifest:content.QUESTION_SHIP_MANIFEST,manifestSha256:digest(content.QUESTION_SHIP_MANIFEST),catalogSha256:digest(content.QUESTION_CATALOG_RELEASE),timing:content.ANSWER_CHOICE_TIMING_REGISTRY,
  familyRegistry:content.PEDIATRIC_CLINIC_FAMILY_CONTEXTS,observed,sourcePreimages,sharedHandoff:{bytes:shared.length,sha256:hash(shared)}};
fs.writeFileSync(output,JSON.stringify(intake,null,2)+'\n');fs.mkdirSync('.local-dev/question-topic-acceptance-batch7-20261112',{recursive:true});
console.log(JSON.stringify({topics:topics.map(t=>({slug:t.config.slug,pass:t.dispositions.length,accepted:t.dispositions.filter(r=>r.status==='accepted').length,skipped:t.dispositions.filter(r=>r.status==='skipped').map(r=>r.questionVariantId),cases:t.candidates.filter(c=>c.runtime.clinicAdmissible).length,inadmissible:t.candidates.filter(c=>!c.runtime.clinicAdmissible).map(c=>({id:c.case.id,runtime:c.runtime}))})),flags:flags.map(f=>({id:f.id,runtime:f.runtime})),ownerConfirmations:ownerConfirmations.length,ownerRetirements:ownerRetirements.length,claims:claims.length,sources:sources.length,sourcePreimages:sourcePreimages.length}));
