import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import '../economy-audit/source-loader.mjs';
import {TOPIC_BATCH1_CONFIG as configs} from './topic-acceptance-batch1-config-20261111.mjs';
import {collectAuthoredMetadata} from './bank.mjs';
const c=await import('../../packages/clinical-content/src/index.ts');
const d=await import('../../packages/game-domain/src/index.ts');
const {createLevelFourRoomsQaContext,createLevelFourRoomsQaState}=await import('../../tests/fixtures/level-four-rooms.ts');
const sha=v=>createHash('sha256').update(JSON.stringify(v)).digest('hex');
const raw=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const wanted=(id,cfg)=>cfg.suffixes.some(s=>id.endsWith('.'+s));
const packetPath=slug=>`docs/research/question-topic-${slug}-20261111.json`;
const modulePath=slug=>`packages/clinical-content/src/question-topic-${slug}-20261111.ts`;
const modules={},topics=[];
for(const cfg of configs){
 const module=await import('../../'+modulePath(cfg.slug));modules[cfg.slug]=module;
 const packet=JSON.parse(fs.readFileSync(packetPath(cfg.slug),'utf8'));
 const reviewFiles=fs.readdirSync('docs/research').filter(p=>p.startsWith('question-topic-'+cfg.slug+'-review')&&p.endsWith('-20261111.json'))
  .sort((a,b)=>{const rank=s=>s.includes('preserved')?1.5:Number(s.match(/review(\d+)/)?.[1]??1);return rank(a)-rank(b);});
 const reviews=reviewFiles.map(name=>{const path='docs/research/'+name;return {path,sha256:raw(path),items:JSON.parse(fs.readFileSync(path,'utf8'))};});
 const cases=module[cfg.cases],concepts=module[cfg.concepts],questions=module[cfg.questions];
 const getEvidence=qid=>reviews.flatMap(r=>r.items.filter(i=>i.id===qid||i.questionVariantId===qid).map(item=>({path:r.path,item}))).at(-1);
 const requested=cfg.suffixes.map(suffix=>{
  const q=questions.find(q=>q.id.endsWith('.'+suffix)),fallbackId=q?.id??(cfg.slug==='critical-shock-resuscitation'?'question.':'question.topic.')+cfg.slug+'.'+suffix;
  const evidence=getEvidence(fallbackId);assert(evidence,suffix+' missing review');assert.equal(evidence.item.verdict,'PASS',suffix+' not latest PASS');
  const cs=cases.find(cs=>cs.decisionNodes.some(n=>n.questionVariantId===fallbackId));
  const siblings=cs?.decisionNodes.filter(n=>!wanted(n.questionVariantId,cfg)).map(n=>n.questionVariantId)??[];
  let reason=!cs?'Not in active source; exact PASS survives only in a retained reviewed context containing unaccepted companions.':siblings.length?'Case contains scored nodes outside the manager PASS list.':null;
  return {suffix,questionVariantId:fallbackId,caseId:cs?.id??null,nodeId:cs?.decisionNodes.find(n=>n.questionVariantId===fallbackId)?.id??evidence.item.nodeId,
   evidence,everyScoredNodeListed:!!cs&&!siblings.length,unlistedSiblingIds:siblings,initialSkipReason:reason};
 });
 const candidates=cases.filter(cs=>cs.decisionNodes.length&&cs.decisionNodes.every(n=>wanted(n.questionVariantId,cfg)));
 const proposalRows=[...(packet.proposals??[]),...(packet.proposedNodes??[]),...(packet.nodes??[]),...(packet.reviewItems??[])];
 const audit=Array.isArray(packet.audit)?packet.audit:packet.audit?.rows??packet.auditRows??[];
 const candidateRecords=[];
 for(const cs of candidates){
  const nodeRecords=cs.decisionNodes.map(node=>{
   const q=questions.find(q=>q.id===node.questionVariantId);assert(q,node.questionVariantId);assert.equal(q.reviewStatus,'needs_clinician_review');
   const proposals=proposalRows.filter(r=>[r.questionVariantId,r.id,r.reviewedQuestionVariantId,r.after?.variantId].includes(q.id));
   const replaceIds=[...new Set(proposals.flatMap(p=>p.replacesInventoryIds??p.replacesInventoryRecordIds??p.beforeRecordIds??[]))];
   const inventoryRows=audit.filter(r=>replaceIds.includes(r.recordId??r.inventoryRecordId??r.id));
   const declared=inventoryRows.flatMap(r=>{const beforeCase=c.SYNTHETIC_CLINICAL_RELEASE.cases.find(old=>old.id===r.caseId);
    if(!beforeCase)return [];const variants=r.variantIds??r.questionVariantIds??(r.questionVariantId?[r.questionVariantId]:[]);
    const matches=beforeCase.decisionNodes.filter(n=>variants.includes(n.questionVariantId));
    return matches.map(n=>({inventoryRecordId:r.recordId??r.inventoryRecordId,legacyCaseId:beforeCase.id,legacyQuestionVariantId:n.questionVariantId,
     legacyNodeId:n.id,legacyConceptId:n.primaryConceptId,legacyNodeCount:beforeCase.decisionNodes.length,with:q.id}));});
   return {node,question:q,concept:concepts.find(co=>co.id===q.conceptId),evidence:getEvidence(q.id),declaredReplacements:declared,
    replacingInventoryIds:replaceIds,proposalIdentity:proposals.map(p=>({previousConceptId:p.previousConceptId??null,meaning:p.clinicalMeaningDecision??p.conceptRelation??null}))};
  });
  const conceptRows=[...new Map([...c.SYNTHETIC_CLINICAL_RELEASE.concepts,...concepts].map(co=>[co.id,co])).values()];
  const context={...createLevelFourRoomsQaContext(),clinicalRelease:{...c.SYNTHETIC_CLINICAL_RELEASE,concepts:conceptRows,cases:[cs]}};
  const state=createLevelFourRoomsQaState(createLevelFourRoomsQaContext());Object.assign(state,{facilityLevel:4,paused:false,nextRoutineArrivalTick:Number.MAX_SAFE_INTEGER});
  const eligibility=d.getClinicalCaseEligibilityIssue(state,cs,context);
  const cmd={type:'ADMIT_PATIENT',operationId:'topic.capture.admit',encounterId:'encounter.topic.capture',caseId:cs.id,patientDisplayName:cs.patientDisplayName,arrivalClass:'routine'};
  const admitted=d.gameReducer(state,cmd,context),receipt=admitted.operationReceipts[cmd.operationId];
  const clinicEligible=cs.requiredClinicalSetting==='clinic'&&cs.routineEligible&&eligibility===null&&receipt?.status==='applied';
  const replacements=[...new Map(nodeRecords.flatMap(r=>r.declaredReplacements).map(r=>[r.legacyCaseId,r])).values()];
  candidateRecords.push({case:cs,nodeRecords,timing:module[cfg.timing].filter(t=>cs.decisionNodes.some(n=>n.questionVariantId===t.questionVariantId)),
   rawOrders:module[cfg.orders]??[],declaredReplacements:replacements,unsupportedConsolidation:replacements.length>1,
   currentRuntimeProbe:{setting:cs.requiredClinicalSetting,routineEligible:cs.routineEligible,earliestFacilityStage:cs.earliestFacilityStage,
    requiredCapabilityIds:cs.requiredCapabilityIds,fixture:'Existing Level4 rooms QA state; current runtime and exact candidate definitions, no predicate overlay.',eligibility,receipt,clinicEligible,
    frozenQuestionVariantIds:admitted.encounters['encounter.topic.capture']?.frozenCase.decisionNodes.map(n=>n.questionVariantId)??[]}});
 }
 topics.push({config:cfg,sourceModulePath:modulePath(cfg.slug),sourceModuleSha256:raw(modulePath(cfg.slug)),packetPath:packetPath(cfg.slug),packetSha256:raw(packetPath(cfg.slug)),
  ledgerPath:`docs/research/sources-question-topic-${cfg.slug}-20261111.json`,ledgerSha256:raw(`docs/research/sources-question-topic-${cfg.slug}-20261111.json`),
  reviews:reviews.map(({items,...r})=>r),sourceCases:cases.map(cs=>({id:cs.id,sha256:sha(cs),questionVariantIds:cs.decisionNodes.map(n=>n.questionVariantId)})),requested,candidates:candidateRecords});
}
const meta=collectAuthoredMetadata({...c,...Object.fromEntries(Object.entries(modules).map(([slug,m])=>[slug,m]))});
const selectedQuestions=topics.flatMap(t=>t.candidates.flatMap(c=>c.nodeRecords.map(r=>r.question)));
const claimIds=[...new Set(selectedQuestions.flatMap(q=>q.supportingEvidenceClaimIds))];
const claims=claimIds.map(id=>{const row=meta.claims.get(id);assert(row,'Missing atomic claim '+id);return row;});
const sourceIds=[...new Set(claims.flatMap(c=>c.sourceIds))],sources=sourceIds.map(id=>{const row=meta.sources.get(id);assert(row,'Missing source '+id);return row;});
const paths=['question-ship-manifest.ts','synthetic-content.ts','index.ts','answer-choice-timing.ts','answer-choice-timing.test.ts','question-n4-acceptance-test-support.ts',
 'question-n4-acceptance-20261110.test.ts','question-ship-manifest.test.ts','pilot-content.test.ts','question-ship-case-replacements.ts','question-ship-projection.ts'].map(p=>'packages/clinical-content/src/'+p);
const otherFiles=Object.fromEntries(fs.readdirSync('packages/clinical-content/src').filter(p=>p.endsWith('.ts')).map(name=>{const path='packages/clinical-content/src/'+name;return [path,raw(path)];}));
const runtimeFiles=Object.fromEntries(['packages/game-domain/src','packages/balance-config/src','apps/player/src/session'].flatMap(dir=>{const out=[];const walk=d=>{for(const ent of fs.readdirSync(d,{withFileTypes:true})){const path=d+'/'+ent.name;if(ent.isDirectory())walk(path);else if(/\.tsx?$/.test(path))out.push([path,raw(path)]);}};walk(dir);return out;}));
const handoff='docs/handoffs/CURRENT_THREAD_HANDOFF.md',bytes=fs.readFileSync(handoff);
const before={capturedOn:'2026-11-11',scope:'Immutable actual source snapshots and read-only runtime probes; no topic-worker or runtime edits. Final acceptance policy is separate from these captured facts.',topics,claims,sources,
 default:{sha256:sha(c.SYNTHETIC_CLINICAL_RELEASE),caseIds:c.SYNTHETIC_CLINICAL_RELEASE.cases.map(cs=>cs.id),conceptIds:c.SYNTHETIC_CLINICAL_RELEASE.concepts.map(co=>co.id),
  caseHashes:Object.fromEntries(c.SYNTHETIC_CLINICAL_RELEASE.cases.map(cs=>[cs.id,sha(cs)])),conceptHashes:Object.fromEntries(c.SYNTHETIC_CLINICAL_RELEASE.concepts.map(co=>[co.id,sha(co)])),
  concepts:c.SYNTHETIC_CLINICAL_RELEASE.concepts,cases:c.SYNTHETIC_CLINICAL_RELEASE.cases.length,nodes:c.SYNTHETIC_CLINICAL_RELEASE.cases.flatMap(cs=>cs.decisionNodes).length,
  scoredMeanings:new Set(c.SYNTHETIC_CLINICAL_RELEASE.cases.flatMap(cs=>cs.decisionNodes.map(n=>n.primaryConceptId))).size,
  replacementBeforeCases:c.SYNTHETIC_CLINICAL_RELEASE.cases.filter(cs=>topics.some(t=>t.candidates.some(r=>r.declaredReplacements.some(rep=>rep.legacyCaseId===cs.id))))},
 manifest:c.QUESTION_SHIP_MANIFEST,manifestSha256:sha(c.QUESTION_SHIP_MANIFEST),catalogSha256:sha(c.QUESTION_CATALOG_RELEASE),timing:c.ANSWER_CHOICE_TIMING_REGISTRY,
 sourcePreimages:paths.map(path=>({path,beforeSha256:raw(path),beforeText:fs.readFileSync(path,'utf8')})),otherFiles,runtimeFiles,
 sharedHandoffPrefix:{path:handoff,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')}};
const out='tools/question-quality/fixtures/question-topic-acceptance-batch1-before-20261111.json';assert(!fs.existsSync(out),'Never refresh intake');fs.writeFileSync(out,JSON.stringify(before,null,2)+'\n');
fs.mkdirSync('.local-dev/question-topic-acceptance-batch1-20261111',{recursive:true});
console.log(JSON.stringify({requested:topics.reduce((n,t)=>n+t.requested.length,0),completeCandidateCases:topics.reduce((n,t)=>n+t.candidates.length,0),
 completeCandidateNodes:topics.reduce((n,t)=>n+t.candidates.reduce((n,c)=>n+c.case.decisionNodes.length,0),0),
 inadmissible:topics.flatMap(t=>t.candidates.filter(c=>!c.currentRuntimeProbe.clinicEligible).map(c=>({case:c.case.id,probe:c.currentRuntimeProbe}))),
 replacements:topics.flatMap(t=>t.candidates.filter(c=>c.declaredReplacements.length).map(c=>({case:c.case.id,unsupportedConsolidation:c.unsupportedConsolidation,relations:c.declaredReplacements}))),
 claims:claims.length,sources:sources.length}));
