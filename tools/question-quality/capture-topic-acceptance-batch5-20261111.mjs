import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {isDeepStrictEqual} from 'node:util';
import '../economy-audit/source-loader.mjs';
import {TOPIC_BATCH5_CONFIG} from './topic-acceptance-batch5-config-20261111.mjs';
import {collectAuthoredMetadata} from './bank.mjs';
import {syntheticClinicalCaseSchema,answerChoiceTimingRegistryEntrySchema} from '../../packages/clinical-content/src/schema.ts';
const content = await import('../../packages/clinical-content/src/index.ts');
const domain = await import('../../packages/game-domain/src/index.ts');
const {createLevelFourRoomsQaState} = await import('../../tests/fixtures/level-four-rooms.ts');
const hash = value => createHash('sha256').update(value).digest('hex');
const digest = value => hash(JSON.stringify(value));
const raw = path => hash(fs.readFileSync(path));
const read = path => JSON.parse(fs.readFileSync(path,'utf8').replace(/^\uFEFF/,''));
const output = 'tools/question-quality/fixtures/question-topic-acceptance-batch5-before-20261111.json';
assert(!fs.existsSync(output), 'Immutable intake already exists.');
const unique = rows => [...new Map(rows.map(row => [digest(row),row])).values()];
function objects(root) {
  const result=[], seen=new WeakSet();
  function visit(value) {
    if (!value || typeof value !== 'object' || seen.has(value)) return;
    seen.add(value);
    if (Array.isArray(value)) value.forEach(visit);
    else {result.push(value); Object.values(value).forEach(visit);}
  }
  visit(root); return result;
}
function priority(file) {
  if (file.includes('-review-salvage-')) return 10000;
  if (file.includes('-review-preserved-')) return 0;
  return Number(file.match(/review(\d+)/)?.[1] ?? 1);
}
let prepared=createLevelFourRoomsQaState(domain.PROTOTYPE_DOMAIN_CONTEXT);
for (const command of [
  {type:'PLACE_ROOM',operationId:'topic5.exam',roomDefinitionId:'room.examination',roomId:'room.topic5.exam',x:35,y:24,orientation:0},
  {type:'PLACE_DOOR',operationId:'topic5.door',roomId:'room.topic5.exam',doorId:'door.topic5.exam',side:'south',offset:1},
]) {prepared=domain.gameReducer(prepared,command,domain.PROTOTYPE_DOMAIN_CONTEXT); assert.equal(prepared.operationReceipts[command.operationId]?.status,'applied');}
Object.assign(prepared,{paused:false,serviceAppointmentsEnabled:false,nextRoutineArrivalTick:Number.MAX_SAFE_INTEGER,nextEmployeeDiscussionTick:Number.MAX_SAFE_INTEGER});
const modules={}, topics=[];
for (const config of TOPIC_BATCH5_CONFIG) {
  const sourcePath=`packages/clinical-content/src/question-topic-${config.slug}-20261111.ts`;
  const packetPath=`docs/research/question-topic-${config.slug}-20261111.json`;
  const ledgerPath=`docs/research/sources-question-topic-${config.slug}-20261111.json`;
  const sourceSha256=raw(sourcePath),packetSha256=raw(packetPath),ledgerSha256=raw(ledgerPath);
  const module=await import('../../'+sourcePath); modules[config.slug]=module;
  const packet=read(packetPath), exported=objects(module), all=objects(packet);
  const caseExports=Object.entries(module).filter(([key,values]) => Array.isArray(values) && values.some(row => row?.decisionNodes && row?.presentation) &&
    (config.salvage ? /(?<!PRE_)SALVAGE(?:_REVISION|_REVIEW)?_CASES$/.test(key) : !/SALVAGE/.test(key)))
    .sort(([a],[b]) => {
      const rank = key => /SALVAGE_(?:REVISION|REVIEW)_CASES$/.test(key) ? -1 :
        /(?:REVIEWED|ROUND1|_V1_|CATALOG|PRE_SALVAGE|DEFERRED|CANDIDATE)/.test(key) ? 10 : /(?:PASS|FROZEN)/.test(key) ? 5 : 0;
      return rank(a)-rank(b) || a.length-b.length;
    });
  assert(caseExports.length,config.slug+' exported cases');
  const primaryCases=caseExports[0][1];
  const rawCases=config.salvage ? caseExports.flatMap(([,value])=>value) : [
    ...primaryCases,...caseExports.slice(1).flatMap(([,value])=>value),
    ...all.filter(row=>row.decisionNodes && typeof row.presentation==='string' && typeof row.id==='string'),
  ];
  const cases=unique(rawCases).map(row=>syntheticClinicalCaseSchema.parse(row));
  const questions=unique(exported.filter(row=>typeof row.id==='string' && row.id.startsWith('question.') && typeof row.conceptId==='string' && Array.isArray(row.supportingEvidenceClaimIds) && row.answerChoices && !row.caseId && !row.nodeId));
  const concepts=unique(exported.filter(row=>typeof row.id==='string' && row.id.startsWith('concept.') && row.learningObjective && row.conceptType));
  const timing=unique(exported.filter(row=>row.caseId && row.nodeId && row.questionVariantId && row.classification && answerChoiceTimingRegistryEntrySchema.safeParse(row).success));
  const reviews=fs.readdirSync('docs/research').filter(file=>file.startsWith(`question-topic-${config.slug}-review`) && file.endsWith('-20261111.json') &&
    (config.salvage ? file.includes('-review-salvage-') : !file.includes('-review-salvage-')))
    .sort((a,b)=>priority(a)-priority(b)).map(file=>({path:'docs/research/'+file,sha256:raw('docs/research/'+file),records:read('docs/research/'+file)}));
  assert(reviews.length,config.slug+' review records');
  const evidence=node=>reviews.flatMap(review=>review.records.filter(record=>record.id===node.questionVariantId || record.nodeId===node.id).map(record=>({path:review.path,record}))).at(-1);
  const wanted=node=>config.nodeIds.includes(node.id);
  const requested=config.nodeIds.map(nodeId=>{
    const contexts=cases.filter(cs=>cs.decisionNodes.some(node=>node.id===nodeId));
    assert(contexts.length,config.slug+' missing context '+nodeId);
    const node=contexts[0].decisionNodes.find(node=>node.id===nodeId);
    const review=evidence(node);
    return {nodeId:node.id,questionVariantId:node.questionVariantId,evidence:review,
      contexts:contexts.map(cs=>({caseId:cs.id,sha256:digest(cs),unlistedSiblingIds:cs.decisionNodes.filter(n=>!wanted(n)).map(n=>n.id)}))};
  });
  const complete=cases.filter(cs=>cs.decisionNodes.every(node=>wanted(node) && evidence(node)?.record.verdict==='PASS'));
  const chosen=[];
  for(const cs of complete) {
    if(chosen.some(old=>old.id===cs.id)) continue;
    // Prefer the current source context over retained earlier contexts of the same identity.
    chosen.push(primaryCases.find(primary=>primary.id===cs.id && digest(syntheticClinicalCaseSchema.parse(primary))===digest(cs)) ?? cs);
  }
  const audit=unique(all.filter(row=>(row.inventoryRecordId || row.recordId) && row.caseId));
  const candidates=chosen.map(rawCase=>{
    const cs=syntheticClinicalCaseSchema.parse(rawCase);
    const records=cs.decisionNodes.map(node=>{
      const optionIdentity=choices=>JSON.stringify(choices.map(c=>[c.id,c.label,c.isCorrect]).sort((a,b)=>a[0].localeCompare(b[0])));
      const matching=questions.filter(q=>q.id===node.questionVariantId && node.stem.endsWith(q.stem) && q.explanation===node.explanation &&
        optionIdentity(q.answerChoices)===optionIdentity(node.answerChoices));
      const matches=matching.filter((question,index)=>matching.findIndex(other=>isDeepStrictEqual(other,question))===index);
      assert.equal(matches.length,1,'One exact source question '+node.questionVariantId+' ('+matches.length+')');
      const question=matches[0]; assert.equal(question.reviewStatus,'needs_clinician_review');
      const proposalRows=all.filter(row=>row.questionVariantId===question.id || row.id===question.id);
      const inventoryIds=[...new Set(proposalRows.flatMap(row=>Object.entries(row).flatMap(([key,value])=>
        /(?:before|replac|inventory).*Inventory|(?:replac|before).*inventory/i.test(key) ? (Array.isArray(value)?value:typeof value==='string'?[value]:[]) : [])))];
      const relevant=audit.filter(row=>inventoryIds.includes(row.inventoryRecordId??row.recordId) || Object.entries(row).some(([key,value])=>
        /(?:proposed|replacement|replac).*question|proposed.*variant/i.test(key) && (Array.isArray(value)?value.includes(question.id):value===question.id)));
      const legacy=unique(relevant.flatMap(row=>{
        const source=content.SYNTHETIC_CLINICAL_RELEASE.cases.find(old=>old.id===row.caseId); if(!source) return [];
        const ids=row.variantIds??row.questionVariantIds??[row.beforeVariantId??row.questionVariantId];
        return source.decisionNodes.filter(old=>ids.includes(old.questionVariantId)).map(old=>({caseId:source.id,nodeId:old.id,questionVariantId:old.questionVariantId,conceptId:old.primaryConceptId,inventoryRecordId:row.inventoryRecordId??row.recordId}));
      }));
      const matched=concepts.filter(co=>co.id===node.primaryConceptId);
      assert(matched.length,'Missing concept '+node.primaryConceptId);
      const concept=matched.find(co=>co.reviewStatus==='needs_clinician_review')??matched[0];
      return {node,question,concept,evidence:evidence(node),legacyRewrites:legacy,inventoryIds,sourceNodeJson:JSON.stringify(rawCase.decisionNodes.find(original=>original.id===node.id)),sourceQuestionJson:JSON.stringify(question)};
    });
    const estimates=cs.decisionNodes.map(node=>{
      const matches=timing.filter(t=>t.caseId===cs.id && t.nodeId===node.id && t.questionVariantId===node.questionVariantId);
      assert.equal(matches.length,1,'Exact timing '+cs.id+' '+node.id+' ('+matches.length+')');return matches[0];
    });
    const registry=new Map(content.SYNTHETIC_CLINICAL_RELEASE.concepts.map(co=>[co.id,co]));
    for(const co of concepts)if(!registry.has(co.id))registry.set(co.id,co);
    const floor=Math.max(cs.earliestFacilityStage,...records.map(r=>registry.get(r.node.primaryConceptId).earliestFacilityStage));
    const normalized={...cs,earliestFacilityStage:floor};
    const context={...domain.PROTOTYPE_DOMAIN_CONTEXT,clinicalRelease:{...content.SYNTHETIC_CLINICAL_RELEASE,concepts:[...registry.values()],cases:[normalized]}};
    const state=structuredClone(prepared),issue=domain.getClinicalCaseEligibilityIssue(state,normalized,context);
    const command={type:'ADMIT_PATIENT',operationId:'topic5.admit',encounterId:'encounter.topic5.capture',caseId:cs.id,patientDisplayName:cs.patientDisplayName,arrivalClass:'routine'};
    const admitted=domain.gameReducer(state,command,context),receipt=admitted.operationReceipts[command.operationId];
    return {case:cs,records,timing:estimates,legacyCaseIds:[...new Set(records.flatMap(r=>r.legacyRewrites.map(old=>old.caseId)))],
      runtime:{setting:cs.requiredClinicalSetting,issue,receipt,clinicAdmissible:cs.requiredClinicalSetting==='clinic' && issue===null && receipt?.status==='applied'}};
  });
  assert.equal(raw(sourcePath),sourceSha256,'Source changed during capture');assert.equal(raw(packetPath),packetSha256,'Packet changed during capture');
  topics.push({config,sourcePath,sourceSha256,packetPath,packetSha256,ledgerPath,ledgerSha256,caseExports:caseExports.map(([key])=>key),
    reviews:reviews.map(({records,...review})=>review),requested,candidates});
}
const metadata=collectAuthoredMetadata({...content,modules});
const claimIds=[...new Set(topics.flatMap(t=>t.candidates.flatMap(c=>c.records.flatMap(r=>r.question.supportingEvidenceClaimIds))))];
const claims=claimIds.map(id=>{assert(metadata.claims.has(id),'Missing claim '+id);return metadata.claims.get(id);});
const sources=[...new Set(claims.flatMap(claim=>claim.sourceIds))].map(id=>{assert(metadata.sources.has(id),'Missing source '+id);return metadata.sources.get(id);});
const sourcePaths=['question-ship-manifest.ts','synthetic-content.ts','index.ts','answer-choice-timing.ts','answer-choice-timing.test.ts','question-ship-manifest.test.ts','pilot-content.test.ts',
  'question-program-batch4-acceptance-test-support.ts','question-program-batch4-acceptance-20261111.test.ts'].map(name=>'packages/clinical-content/src/'+name);
const observed={};for(const root of ['packages/clinical-content/src','packages/game-domain/src','packages/game-domain/tests','packages/balance-config/src','apps/player/src/session']) {
  const walk=path=>{for(const entry of fs.readdirSync(path,{withFileTypes:true})){const child=path+'/'+entry.name;if(entry.isDirectory())walk(child);else if(/\.tsx?$/.test(entry.name))observed[child]=raw(child);}};walk(root);
}
const release=content.SYNTHETIC_CLINICAL_RELEASE,legacyIds=new Set(topics.flatMap(t=>t.candidates.flatMap(c=>c.legacyCaseIds)));
const shared='docs/handoffs/CURRENT_THREAD_HANDOFF.md',sharedBytes=fs.readFileSync(shared);
const intake={capturedOn:'2026-11-11',topics,claims,sources,observed,default:{sha256:digest(release),cases:release.cases.length,nodes:release.cases.flatMap(cs=>cs.decisionNodes).length,
  scoredMeanings:new Set(release.cases.flatMap(cs=>cs.decisionNodes.map(n=>n.primaryConceptId))).size,caseIds:release.cases.map(cs=>cs.id),conceptIds:release.concepts.map(co=>co.id),concepts:release.concepts,
  caseHashes:Object.fromEntries(release.cases.map(cs=>[cs.id,digest(cs)])),conceptHashes:Object.fromEntries(release.concepts.map(co=>[co.id,digest(co)])),retainedCases:release.cases.filter(cs=>legacyIds.has(cs.id))},
  manifest:content.QUESTION_SHIP_MANIFEST,manifestSha256:digest(content.QUESTION_SHIP_MANIFEST),catalogSha256:digest(content.QUESTION_CATALOG_RELEASE),timing:content.ANSWER_CHOICE_TIMING_REGISTRY,
  sourcePreimages:sourcePaths.map(path=>({path,beforeSha256:raw(path),beforeText:fs.readFileSync(path,'utf8')})),sharedHandoff:{path:shared,bytes:sharedBytes.length,sha256:hash(sharedBytes)}};
fs.writeFileSync(output,JSON.stringify(intake,null,2)+'\n');
fs.mkdirSync('.local-dev/question-topic-acceptance-batch5-20261111',{recursive:true});
console.log(JSON.stringify({requested:topics.reduce((n,t)=>n+t.requested.length,0),candidates:topics.map(t=>({topic:t.config.slug,salvage:t.config.salvage,
  requested:t.requested.length,nodes:t.candidates.flatMap(c=>c.records).length,cases:t.candidates.length,nonpass:t.requested.filter(r=>r.evidence?.record.verdict!=='PASS').map(r=>r.nodeId),
  replacements:t.candidates.filter(c=>c.legacyCaseIds.length).map(c=>({caseId:c.case.id,replaces:c.legacyCaseIds})),inadmissible:t.candidates.filter(c=>!c.runtime.clinicAdmissible).map(c=>({caseId:c.case.id,...c.runtime}))}))}));
