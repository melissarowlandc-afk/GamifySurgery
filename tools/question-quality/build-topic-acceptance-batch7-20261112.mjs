import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import '../economy-audit/source-loader.mjs';
import {validateSyntheticClinicalRelease} from '../../packages/clinical-content/src/schema.ts';

const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const hash=b=>createHash('sha256').update(b).digest('hex');
const digest=v=>hash(JSON.stringify(v));
const before=read('tools/question-quality/fixtures/question-topic-acceptance-batch7-before-20261112.json');
const decision='docs/research/question-topic-acceptance-batch7-20261112.md';
const write=(p,v)=>{const text=typeof v==='string'?v:JSON.stringify(v,null,2)+'\n';if(process.argv.includes('--check'))assert.equal(fs.readFileSync(p,'utf8'),text,p+' drift');else fs.writeFileSync(p,text);};
const selected=[...before.topics.flatMap(t=>t.candidates.filter(c=>c.runtime.clinicAdmissible).map(c=>({...c,topic:t.config.slug,sourceFiles:[t.source],kind:'topic'}))),
  ...before.flags.map(f=>({...f,topic:'d97aa716',kind:'node_override',sourceFiles:['packages/clinical-content/src/question-flag-d97aa716-round2-20261112.ts','packages/clinical-content/src/question-flag-d97aa716-round2-20261112-data.ts'].map(path=>({path,sha256:before.observed[path]}))}))];
const existingConcepts=new Map(before.defaultRelease.concepts.map(c=>[c.id,c]));
const stageAdjustments=[],corrections=[],frozen=[];
const questions=[],cases=[];
function normalizeNames(target,caseId,name,targetId){
  const fields=[];const first=name?.split(' ')[0];
  function visit(value,path=[]){
    if(!value||typeof value!=='object')return;
    for(const [key,entry]of Object.entries(value)){
      if(/(?:^id$|Id$|Ids$|^source|^patientDisplayName$|^displayName$|^contentVersion$|^reviewStatus$|^clinicalScope$)/.test(key))continue;
      const next=[...path,Array.isArray(value)?Number(key):key];
      if(typeof entry==='string'){
        let after=entry;
        if(name)after=after.replaceAll(name,'{patientName}');
        if(first&&first.length>2)after=after.replace(new RegExp('\\b'+first.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'\\b','g'),'{patientName}');
        if(after!==entry){fields.push({target:targetId,path:next,before:entry,after});value[key]=after;}
      }else visit(entry,next);
    }
  }
  visit(target);
  if(fields.length)corrections.push({caseId,target:targetId,literalName:name,correctionType:'presentation_only',clinicalMeaningChanged:false,questionIdentityChanged:false,reviewStatus:'needs_clinician_review',fields});
}
for(const row of selected){
  const cs=structuredClone(row.case);
  const floor=Math.max(cs.earliestFacilityStage,...cs.decisionNodes.map(n=>existingConcepts.get(n.primaryConceptId)?.earliestFacilityStage??row.records.find(r=>r.concept.id===n.primaryConceptId)?.concept.earliestFacilityStage??0));
  if(floor!==cs.earliestFacilityStage)stageAdjustments.push({caseId:cs.id,before:cs.earliestFacilityStage,after:floor});
  cs.routineEligible=true;cs.earliestFacilityStage=floor;
  normalizeNames(cs,cs.id,cs.patientDisplayName,'case');
  cs.learningSummary=cs.decisionNodes.map(n=>n.explanation).join(' ');
  cases.push(cs);
  for(const r of row.records){
    assert.equal(r.evidence.record.verdict,'PASS');
    const q=structuredClone(r.question);assert.equal(q.reviewStatus,'needs_clinician_review');
    normalizeNames(q,cs.id,cs.patientDisplayName,q.id);questions.push(q);
    const acceptedNode=cs.decisionNodes.find(n=>n.id===r.node.id);
    frozen.push({topic:row.topic,kind:row.kind,caseId:cs.id,nodeId:r.node.id,questionVariantId:q.id,conceptId:r.node.primaryConceptId,
      sourceFiles:row.sourceFiles,reviewPath:r.evidence.path,reviewRecord:r.evidence.record,
      sourceNodeJson:r.sourceNodeJson,sourceQuestionJson:r.sourceQuestionJson,
      sourceNodeSha256:hash(r.sourceNodeJson),sourceQuestionSha256:hash(r.sourceQuestionJson),
      acceptedNodeSha256:digest(acceptedNode),acceptedQuestionSha256:digest(q),acceptedCaseSha256:digest(cs)});
  }
}
const concepts=[...new Map(selected.flatMap(c=>c.records.map(r=>r.concept)).map(c=>[c.id,c])).values()];
const views=Object.fromEntries([...new Set(selected.map(c=>c.topic))].map(topic=>{
  const viewCases=cases.filter(c=>selected.some(row=>row.topic===topic&&row.case.id===c.id));
  const used=new Set(viewCases.flatMap(c=>c.decisionNodes.map(n=>n.primaryConceptId)));
  const registry=new Map([...before.defaultRelease.concepts,...concepts].map(c=>[c.id,c]));
  const viewConcepts=[...used].map(id=>{const c=registry.get(id);assert(c,id);return {id:c.id,displayName:c.displayName,learningObjective:c.learningObjective,earliestFacilityStage:c.earliestFacilityStage,conceptType:c.conceptType};});
  return ['topic-batch7-'+topic,validateSyntheticClinicalRelease({id:'clinical.synthetic.prototype.v1',schemaVersion:1,publicationStatus:'synthetic_unapproved_prototype',
    disclaimer:'Manager-accepted synthetic draft archive. Not clinically approved. Melissa Rowland is clinical sign-off.',concepts:viewConcepts,cases:viewCases})];
}));
const rows=selected.flatMap(c=>c.records.map(r=>({acceptanceId:r.question.id,caseId:c.case.id,nodeId:r.node.id,questionVariantId:r.question.id,conceptId:r.node.primaryConceptId,sourceView:'topic-batch7-'+c.topic,decision})));
assert.equal(new Set(rows.map(r=>r.caseId+'|'+r.nodeId)).size,rows.length);
const acceptedIds=new Set(rows.map(r=>r.questionVariantId));
const retirementCoverage=[],retirementByCase=new Map();
for(const topic of before.topics)for(const proposal of topic.retirementProposals){
  const previous=proposal.previousQuestionVariantId??proposal.questionVariantId;
  const targets=(proposal.replacementQuestionVariantIds??[]).filter(id=>acceptedIds.has(id));
  const current=before.defaultRelease.cases.filter(c=>c.decisionNodes.some(n=>n.questionVariantId===previous));
  const action=targets.length?'accepted_successor':(proposal.replacementQuestionVariantIds?.length?'successor_not_accepted':'no_replacement_proposed');
  retirementCoverage.push({topic:topic.config.slug,previousQuestionVariantId:previous,proposedSuccessors:proposal.replacementQuestionVariantIds??[],acceptedSuccessors:targets,liveCaseIds:current.map(c=>c.id),status:!current.length?'already_not_fresh':action});
  if(!targets.length)continue;
  for(const cs of current){
    const replacement=targets.find(id=>rows.find(r=>r.questionVariantId===id)?.caseId!==cs.id);if(!replacement)continue;
    const record=retirementByCase.get(cs.id);
    if(record){record.additionalAcceptedSuccessors.push(...targets.filter(id=>!record.additionalAcceptedSuccessors.includes(id)));continue;}
    retirementByCase.set(cs.id,{caseId:cs.id,questionVariantIds:cs.decisionNodes.map(n=>n.questionVariantId),decision,
      reason:'Apply the round-3 '+topic.config.slug+' retirement proposal only after its successor passes whole-case acceptance.',replacementQuestionVariantId:replacement,additionalAcceptedSuccessors:[...targets]});
  }
}
for(const r of before.ownerRetirements)retirementByCase.set(r.case.id,{caseId:r.case.id,questionVariantIds:r.case.decisionNodes.map(n=>n.questionVariantId),decision,
  reason:'Owner-directed retirement '+r.ownerId+' (2026-11-12): framing or teaching-item retirement; preserve frozen encounters and FSRS.',ownerId:r.ownerId});
const retired=[...retirementByCase.keys()].map(id=>before.defaultRelease.cases.find(c=>c.id===id));
const retirements=[...retirementByCase.values()].map(({additionalAcceptedSuccessors,ownerId,...r})=>r);
const timing=structuredClone(selected.flatMap(c=>c.timing)).map(t=>{
  if(t.classification.kind!=='test_choices')return t;
  const node=cases.find(c=>c.id===t.caseId).decisionNodes.find(n=>n.id===t.nodeId);
  const choices=t.classification.choices;
  t.classification.choices=node.answerChoices.map(c=>{const old=choices.find(r=>r.choiceId===c.id);assert(old,'Timing choice '+c.id);return {...old,choiceLabel:c.label};});
  if(t.classification.choices.every(c=>c.timing.kind==='no_test'))t.classification={kind:'no_test'};
  return t;
});
const orders=timing.flatMap(t=>t.classification.kind==='test_choices'?t.classification.choices.filter(c=>c.timing.kind==='test').map(c=>({caseId:t.caseId,nodeId:t.nodeId,questionVariantId:t.questionVariantId,
  choiceId:c.choiceId,choiceLabel:c.choiceLabel,timingProfileId:c.timing.timingProfileId,disposition:{kind:'not_executed',reason:'future_planned'}})):[]);
const lengthResiduals=cases.flatMap(cs=>cs.decisionNodes.filter(n=>acceptedIds.has(n.questionVariantId)).flatMap(node=>{
  const key=node.answerChoices.find(c=>c.isCorrect),longestDistractor=Math.max(...node.answerChoices.filter(c=>!c.isCorrect).map(c=>c.label.length));
  return key.label.length>longestDistractor?[{caseId:cs.id,questionVariantId:node.questionVariantId,correctLength:key.label.length,longestDistractor}]:[];
}));
const approvals=before.ownerConfirmations.map(r=>({ownerId:r.ownerId,scope:r.scope,questionVariantId:r.question.id,contentVersion:r.question.contentVersion,
  reviewer:'Melissa Rowland (clinical sign-off)',reviewedOn:'2026-11-12',decision:'docs/research/owner-decision-answers-20261112.md',
  originalQuestionSha256:r.questionSha256,reviewedRuntimeNodeSha256:r.nodeSha256,correctChoiceId:r.correctChoiceId,
  holdResolution:r.scope==='full'?'resolved_for_this_exact_question_version':'key_confirmed_only_full_version_still_needs_review'}));
const reviewedQuestions=before.ownerConfirmations.map((r,i)=>({...r.question,reviewStatus:r.scope==='full'?'clinically_approved':'needs_clinician_review',
  lastClinicianReview:{reviewer:approvals[i].reviewer,reviewedOn:approvals[i].reviewedOn,contentVersion:r.question.contentVersion}}));
const acceptedClaimIds=new Set(questions.flatMap(q=>q.supportingEvidenceClaimIds));
const claims=before.claims.filter(c=>acceptedClaimIds.has(c.id));const sourceIds=new Set(claims.flatMap(c=>c.sourceIds));const sources=before.sources.filter(s=>sourceIds.has(s.id));
const json=v=>JSON.stringify(v,null,2);
const declarations=[['ROWS','QuestionShipAcceptance[]',rows],['RETIREMENTS','QuestionShipCaseRetirement[]',retirements],['VIEWS','Record<string,SyntheticClinicalRelease>',views],
 ['QUESTIONS','(QuestionVariant & Record<string,unknown>)[]',questions],['TIMINGS','AnswerChoiceTimingRegistryEntry[]',timing],['RETIRED_CASES','SyntheticClinicalCase[]',retired],
 ['REVIEWED_QUESTIONS','(QuestionVariant & Record<string,unknown>)[]',reviewedQuestions]]
 .map(([name,type,value])=>'export const PROGRAM_BATCH7_'+name+': '+type+' = '+json(value)+';').join('\n');
write('packages/clinical-content/src/question-program-batch7-accepted-data-20261112.ts',
 'import type {QuestionShipAcceptance,QuestionShipCaseRetirement} from "./question-ship-manifest";\nimport type {SyntheticClinicalRelease,SyntheticClinicalCase,AnswerChoiceTimingRegistryEntry} from "./schema";\nimport type {QuestionVariant} from "./pilot-schema";\n'+declarations+'\n'+
 [['ORDERS',orders],['LENGTH_RESIDUALS',lengthResiduals],['FROZEN',frozen.map(({sourceNodeJson,sourceQuestionJson,...r})=>r)],['AUTHORED_CONCEPTS',concepts],['CLAIMS',claims],['SOURCES',sources],['CLINICAL_CONFIRMATIONS',approvals]]
 .map(([name,value])=>'export const PROGRAM_BATCH7_'+name+' = '+json(value)+' as const;').join('\n')+'\n');
write('packages/clinical-content/src/question-program-batch7-accepted-20261112.ts',`import type {SyntheticClinicalRelease} from "./schema";
import {QUESTION_SHIP_MANIFEST} from "./question-ship-manifest";
import {PROGRAM_BATCH7_ROWS,PROGRAM_BATCH7_VIEWS,PROGRAM_BATCH7_TIMINGS,PROGRAM_BATCH7_ORDERS,PROGRAM_BATCH7_REVIEWED_QUESTIONS,PROGRAM_BATCH7_CLINICAL_CONFIRMATIONS} from "./question-program-batch7-accepted-data-20261112";
export const QUESTION_PROGRAM_BATCH7_ACCEPTED_ROWS = PROGRAM_BATCH7_ROWS;
export const QUESTION_PROGRAM_BATCH7_ACCEPTED_SOURCE_VIEWS = PROGRAM_BATCH7_VIEWS;
export const QUESTION_PROGRAM_BATCH7_ACCEPTED_CASES = Object.values(PROGRAM_BATCH7_VIEWS).flatMap(view=>view.cases);
function accepted(id:string) {const r=PROGRAM_BATCH7_ROWS.find(r=>r.questionVariantId===id);return !!r && QUESTION_SHIP_MANIFEST.accepted.some(a=>a.acceptanceId===r.acceptanceId&&a.caseId===r.caseId&&a.nodeId===r.nodeId&&a.questionVariantId===r.questionVariantId&&a.conceptId===r.conceptId&&a.sourceView===r.sourceView);}
export function withAcceptedQuestionProgramBatch7Concepts(release:SyntheticClinicalRelease):SyntheticClinicalRelease {
  const known=new Set(release.concepts.map(c=>c.id));const additions=Object.values(PROGRAM_BATCH7_VIEWS).flatMap(v=>v.concepts).filter(c=>{
    if(known.has(c.id)||!PROGRAM_BATCH7_ROWS.some(r=>r.conceptId===c.id&&accepted(r.questionVariantId)))return false;known.add(c.id);return true;
  });return {...release,concepts:[...release.concepts,...additions]};
}
export const QUESTION_PROGRAM_BATCH7_ACCEPTED_TIMING_ENTRIES = PROGRAM_BATCH7_TIMINGS.filter(r=>accepted(r.questionVariantId));
export const QUESTION_PROGRAM_BATCH7_ACCEPTED_TEST_ORDER_RECORDS = PROGRAM_BATCH7_ORDERS.filter(r=>accepted(r.questionVariantId));
/** Existing AuthoredClinicalRecord fields record version-specific clinical review.
 * Key-only records remain needs_clinician_review; no concept/claim/profile is approved. */
export const QUESTION_PROGRAM_BATCH7_CLINICALLY_APPROVED_QUESTIONS = PROGRAM_BATCH7_REVIEWED_QUESTIONS.filter(q=>q.reviewStatus==="clinically_approved");
export const QUESTION_PROGRAM_BATCH7_KEY_CONFIRMED_QUESTIONS = PROGRAM_BATCH7_REVIEWED_QUESTIONS.filter(q=>q.reviewStatus==="needs_clinician_review");
export const QUESTION_PROGRAM_BATCH7_CLINICAL_CONFIRMATIONS = PROGRAM_BATCH7_CLINICAL_CONFIRMATIONS;
export function questionProgramBatch7ClinicalReview(questionVariantId:string) {
  return PROGRAM_BATCH7_REVIEWED_QUESTIONS.find(q=>q.id===questionVariantId) ?? null;
}
export {PROGRAM_BATCH7_QUESTIONS as QUESTION_PROGRAM_BATCH7_ACCEPTED_QUESTIONS,
  PROGRAM_BATCH7_AUTHORED_CONCEPTS as QUESTION_PROGRAM_BATCH7_AUTHORED_CONCEPTS,
  PROGRAM_BATCH7_RETIRED_CASES as QUESTION_PROGRAM_BATCH7_RETAINED_CASES,
  PROGRAM_BATCH7_RETIREMENTS as QUESTION_PROGRAM_BATCH7_RETIREMENTS,
  PROGRAM_BATCH7_CLAIMS as QUESTION_PROGRAM_BATCH7_CLAIMS,PROGRAM_BATCH7_SOURCES as QUESTION_PROGRAM_BATCH7_SOURCES,
  PROGRAM_BATCH7_FROZEN as QUESTION_PROGRAM_BATCH7_FROZEN_PRESERVATION} from "./question-program-batch7-accepted-data-20261112";
export {PROGRAM_BATCH7_LENGTH_RESIDUALS as QUESTION_PROGRAM_BATCH7_LENGTH_RESIDUALS} from "./question-program-batch7-accepted-data-20261112";
`);
write('docs/research/question-topic-acceptance-batch7-source-freeze-20261112.json',{checkedOn:'2026-11-12',records:frozen,policy:'Exact reviewed serializations precede separately logged name-only corrections. No clinical approval of accepted drafts.'});
write('tools/question-quality/fixtures/question-topic-acceptance-batch7-literal-name-corrections-20261112.json',{checkedOn:'2026-11-12',records:corrections});
write('docs/research/question-topic-acceptance-batch7-clinical-confirmations-20261112.json',{checkedOn:'2026-11-12',records:approvals,policy:'Full scope uses clinically_approved plus existing lastClinicianReview fields for the exact question version. Key-only scope records named review but remains needs_clinician_review. Claims, concepts, profiles and successor wording are not approved.'});
write('docs/research/question-topic-acceptance-batch7-dispositions-20261112.json',{checkedOn:'2026-11-12',requested:87,accepted:rows.length,cases:cases.length,
  items:[...before.topics.flatMap(t=>t.dispositions.map(r=>({...r,topic:t.config.slug}))),...before.flags.map(f=>({id:f.id,questionVariantId:f.records[0].question.id,nodeId:f.records[0].node.id,caseId:f.case.id,topic:'d97aa716',status:'accepted',reason:'Exact final PASS legacy-node override; all preceding live nodes remain exact.'}))],
  nonpass:before.topics.flatMap(t=>t.nonpass.map(r=>({...r,topic:t.config.slug}))),droppedFlag:'D97-3',stageAdjustments,presentationCorrections:corrections.length,
  retirementCoverage,retirements:[...retirementByCase.values()],ownerRetirements:before.ownerRetirements.map(r=>({ownerId:r.ownerId,questionVariantId:r.questionVariantId,caseId:r.case.id})),
  ownerConfirmedVersions:approvals.length,fullVersionApprovals:approvals.filter(r=>r.scope==='full').length,keyOnlyConfirmations:approvals.filter(r=>r.scope==='key_only').length,
  waitBindingsNeeded:orders});
console.log(json({accepted:rows.length,cases:cases.length,retirements:retirements.length,orders:orders.length,correctionFields:corrections.reduce((n,r)=>n+r.fields.length,0),ownerConfirmations:approvals.length}));
