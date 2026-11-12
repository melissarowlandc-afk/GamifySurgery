import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import '../economy-audit/source-loader.mjs';
import {validateSyntheticClinicalRelease} from '../../packages/clinical-content/src/schema.ts';
const before=JSON.parse(fs.readFileSync('tools/question-quality/fixtures/question-topic-acceptance-batch1-before-20261111.json','utf8'));
const probe=JSON.parse(fs.readFileSync('docs/research/question-topic-acceptance-batch1-admission-probe-20261111.json','utf8'));
const digest=x=>createHash('sha256').update(JSON.stringify(x)).digest('hex');
const output=(path,text)=>{if(process.argv.includes('--check'))assert.equal(fs.readFileSync(path,'utf8'),text,path+' stale');else fs.writeFileSync(path,text);};
// Existing resolver rejects many-to-one targets. No approval to change that
// safety contract is inferred from elapsed time or the async question default.
const allowConsolidation=false;
const selected=before.topics.flatMap(topic=>topic.candidates.filter(row=>probe.cases.find(p=>p.caseId===row.case.id)?.clinicAdmissible&&(!row.unsupportedConsolidation||allowConsolidation)).map(row=>({...row,topic:topic.config.slug})));
// Mechanical runtime templating only: the reviewed respiratory records use
// literal names. Preserve their raw versions; substitute the existing engine
// token in the accepted view so another generated patient's chart stays named
// consistently. No clinical word, choice, finding, explanation or ID changes.
const nameTemplates=[];
function runtimeCase(row){
 const cs=structuredClone(row.case);
 cs.learningSummary=cs.decisionNodes.map(n=>n.explanation).join(' ');
 if(row.topic==='critical-respiratory-ventilation'){
  const replace=(object,field,name)=>{if(typeof object[field]!=='string'||!object[field].includes(name))return;
   const prior=object[field];object[field]=prior.replaceAll(name,'{patientName}');nameTemplates.push({caseId:cs.id,field,before:prior,after:object[field]});};
  replace(cs,'presentation',cs.patientDisplayName);
  for(const p of cs.approvedInstantiationProfiles??[])replace(p,'presentation',cs.patientDisplayName);
  for(const n of cs.decisionNodes){replace(n,'stem',cs.patientDisplayName);replace(n,'currentUpdate',cs.patientDisplayName);
   if(cs.id==='case.topic.critical-respiratory-ventilation.extubation-rescue.v1')replace(n,'currentUpdate','Elena');}
 }
 return cs;
}
const views=Object.fromEntries(before.topics.filter(t=>selected.some(r=>r.topic===t.config.slug)).map(topic=>{
 const records=selected.filter(r=>r.topic===topic.config.slug);
 const concepts=[...new Map(records.flatMap(r=>r.nodeRecords.map(n=>n.concept)).map(c=>[c.id,c])).values()].map(c=>({id:c.id,displayName:c.displayName,learningObjective:c.learningObjective,earliestFacilityStage:c.earliestFacilityStage,conceptType:c.conceptType}));
 const cases=records.map(runtimeCase);
 const release=validateSyntheticClinicalRelease({id:'clinical.synthetic.prototype.v1',schemaVersion:1,publicationStatus:'synthetic_unapproved_prototype',
  disclaimer:'Synthetic unapproved topic draft archive, not clinically approved. Melissa Rowland is clinical sign-off.',concepts,cases});
 return ['topic-batch1-'+topic.config.slug,release];
}));
const rows=selected.flatMap(r=>r.nodeRecords.map(n=>({acceptanceId:n.question.id,caseId:r.case.id,nodeId:n.node.id,questionVariantId:n.question.id,conceptId:n.node.primaryConceptId,
 sourceView:'topic-batch1-'+r.topic,decision:'docs/research/question-topic-acceptance-batch1-20261111.md'})));
const replacements=selected.flatMap(r=>r.declaredReplacements.map(p=>({replaces:p.legacyCaseId,with:p.with})));
const questions=selected.flatMap(r=>r.nodeRecords.map(n=>n.question));
const timings=selected.flatMap(r=>r.timing);
const orders=timings.flatMap(t=>t.classification.kind==='test_choices'?t.classification.choices.flatMap(c=>c.timing.kind==='test'?[{
 caseId:t.caseId,nodeId:t.nodeId,questionVariantId:t.questionVariantId,choiceId:c.choiceId,choiceLabel:c.choiceLabel,timingProfileId:c.timing.timingProfileId,
 disposition:{kind:'not_executed',reason:'future_planned'},
}]:[]):[]);
const claimIds=new Set(questions.flatMap(q=>q.supportingEvidenceClaimIds));
const claims=before.claims.filter(c=>claimIds.has(c.id)),sourceIds=new Set(claims.flatMap(c=>c.sourceIds));
const sources=before.sources.filter(s=>sourceIds.has(s.id));
const retired=before.default.replacementBeforeCases.filter(c=>replacements.some(r=>r.replaces===c.id));
const frozen=selected.map(r=>({topic:r.topic,caseId:r.case.id,rawSourceCaseSha256:digest(r.case),retainedCaseSha256:digest(views['topic-batch1-'+r.topic].cases.find(c=>c.id===r.case.id)),
 sourceModulePath:before.topics.find(t=>t.config.slug===r.topic).sourceModulePath,sourceModuleSha256:before.topics.find(t=>t.config.slug===r.topic).sourceModuleSha256,
 nodes:r.nodeRecords.map(n=>({nodeId:n.node.id,questionVariantId:n.question.id,conceptId:n.node.primaryConceptId,questionSha256:digest(n.question),nodeSha256:digest(n.node),reviewPath:n.evidence.path}))}));
const disposition=before.topics.flatMap(topic=>topic.requested.map(r=>{
 const selectedCase=selected.find(c=>c.case.id===r.caseId),candidate=topic.candidates.find(c=>c.case.id===r.caseId),runtime=probe.cases.find(p=>p.caseId===r.caseId);
 const accepted=!!selectedCase;
 const reason=accepted?'All scored nodes listed/PASS; clinic admission verified.':r.initialSkipReason??(!runtime?.clinicAdmissible?'Current runtime does not admit this exact case in an existing clinic.':candidate?.unsupportedConsolidation?'Four-to-one live rewrite exceeds the existing duplicate-target guard; parked pending manager scope decision.':'Not selected.');
 return {...r,topic:topic.config.slug,status:accepted?'accepted':'skipped',reason,clinicRuntime:runtime?{clinicAdmissible:runtime.clinicAdmissible,eligibilityIssue:runtime.eligibilityIssue}:null,
  blockedReplacementCases:candidate?.unsupportedConsolidation?candidate.declaredReplacements.map(r=>r.legacyCaseId):[]};
}));
const lengthResiduals=selected.flatMap(r=>r.case.decisionNodes.flatMap(n=>{const key=n.answerChoices.find(a=>a.isCorrect),d=Math.max(...n.answerChoices.filter(a=>!a.isCorrect).map(a=>a.label.length));
 return key.label.length>d?[{questionVariantId:n.questionVariantId,correctLength:key.label.length,longestDistractor:d,caseId:r.case.id}]:[];}));
const data={rows,views,questions,timings,orders,claims,sources,retired,frozen,lengthResiduals};
output('packages/clinical-content/src/question-program-batch1-accepted-data-20261111.ts',`import type {QuestionShipAcceptance,QuestionShipCaseReplacement} from "./question-ship-manifest";\nimport type {SyntheticClinicalRelease,AnswerChoiceTimingRegistryEntry,SyntheticClinicalCase} from "./schema";\nimport type {QuestionVariant,EvidenceClaim,ClinicalSource} from "./pilot-schema";\n/** Immutable accepted-only snapshots. No topic-worker source is imported or edited. */\nexport const PROGRAM_BATCH1_ROWS:QuestionShipAcceptance[]=${JSON.stringify(rows,null,2)};\nexport const PROGRAM_BATCH1_REPLACEMENTS:QuestionShipCaseReplacement[]=${JSON.stringify(replacements,null,2)};\nexport const PROGRAM_BATCH1_VIEWS:Record<string,SyntheticClinicalRelease>=${JSON.stringify(views,null,2)};\nexport const PROGRAM_BATCH1_QUESTIONS:QuestionVariant[]=${JSON.stringify(questions,null,2)};\nexport const PROGRAM_BATCH1_TIMINGS:AnswerChoiceTimingRegistryEntry[]=${JSON.stringify(timings,null,2)};\nexport const PROGRAM_BATCH1_ORDERS=${JSON.stringify(orders,null,2)} as const;\nexport const PROGRAM_BATCH1_CLAIMS:(EvidenceClaim&Record<string,unknown>)[]=${JSON.stringify(claims,null,2)};\nexport const PROGRAM_BATCH1_SOURCES:(ClinicalSource&Record<string,unknown>)[]=${JSON.stringify(sources,null,2)};\nexport const PROGRAM_BATCH1_RETIRED_CASES:SyntheticClinicalCase[]=${JSON.stringify(retired,null,2)};\nexport const PROGRAM_BATCH1_FROZEN=${JSON.stringify(frozen,null,2)} as const;\nexport const PROGRAM_BATCH1_LENGTH_RESIDUALS=${JSON.stringify(lengthResiduals,null,2)} as const;\n`);
output('packages/clinical-content/src/question-program-batch1-accepted-20261111.ts',`import type {SyntheticClinicalRelease} from "./schema";
import {QUESTION_SHIP_MANIFEST} from "./question-ship-manifest";
import {PROGRAM_BATCH1_ROWS,PROGRAM_BATCH1_VIEWS,PROGRAM_BATCH1_QUESTIONS,PROGRAM_BATCH1_TIMINGS,PROGRAM_BATCH1_ORDERS} from "./question-program-batch1-accepted-data-20261111";
export const QUESTION_PROGRAM_BATCH1_ACCEPTED_ROWS=PROGRAM_BATCH1_ROWS;
export const QUESTION_PROGRAM_BATCH1_ACCEPTED_SOURCE_VIEWS=PROGRAM_BATCH1_VIEWS;
export const QUESTION_PROGRAM_BATCH1_ACCEPTED_CASES=Object.values(PROGRAM_BATCH1_VIEWS).flatMap(v=>v.cases);
export const QUESTION_PROGRAM_BATCH1_ACCEPTED_QUESTIONS=PROGRAM_BATCH1_QUESTIONS;
const accepted=(id:string)=>PROGRAM_BATCH1_ROWS.some(r=>r.questionVariantId===id&&QUESTION_SHIP_MANIFEST.accepted.some(a=>a.acceptanceId===r.acceptanceId&&a.caseId===r.caseId&&a.nodeId===r.nodeId&&a.questionVariantId===r.questionVariantId&&a.conceptId===r.conceptId&&a.sourceView===r.sourceView));
export function withAcceptedQuestionProgramBatch1Concepts(release:SyntheticClinicalRelease):SyntheticClinicalRelease{
 const ids=new Set(release.concepts.map(c=>c.id));const add=Object.values(PROGRAM_BATCH1_VIEWS).flatMap(v=>v.concepts).filter(c=>{
  if(ids.has(c.id)||!PROGRAM_BATCH1_ROWS.some(r=>r.conceptId===c.id&&accepted(r.questionVariantId)))return false;ids.add(c.id);return true;
 });return {...release,concepts:[...release.concepts,...add]};
}
export const QUESTION_PROGRAM_BATCH1_ACCEPTED_TIMING_ENTRIES=PROGRAM_BATCH1_TIMINGS.filter(t=>accepted(t.questionVariantId));
/** Accepted-only diagnostic metadata for the runtime owner; not installed here. */
export const QUESTION_PROGRAM_BATCH1_ACCEPTED_TEST_ORDER_RECORDS=PROGRAM_BATCH1_ORDERS.filter(t=>accepted(t.questionVariantId));
export {PROGRAM_BATCH1_REPLACEMENTS as QUESTION_PROGRAM_BATCH1_REPLACEMENTS,PROGRAM_BATCH1_RETIRED_CASES as QUESTION_PROGRAM_BATCH1_RETAINED_CASES,
 PROGRAM_BATCH1_CLAIMS as QUESTION_PROGRAM_BATCH1_CLAIMS,PROGRAM_BATCH1_SOURCES as QUESTION_PROGRAM_BATCH1_SOURCES,
 PROGRAM_BATCH1_FROZEN as QUESTION_PROGRAM_BATCH1_FROZEN_PRESERVATION,PROGRAM_BATCH1_LENGTH_RESIDUALS as QUESTION_PROGRAM_BATCH1_LENGTH_RESIDUALS} from "./question-program-batch1-accepted-data-20261111";
`);
output('docs/research/question-topic-acceptance-batch1-dispositions-20261111.json',JSON.stringify({checkedOn:'2026-11-11',allowConsolidation,requested:disposition.length,accepted:disposition.filter(d=>d.status==='accepted').length,
 skipped:disposition.filter(d=>d.status==='skipped').length,acceptedCases:selected.length,replacements,items:disposition,
 sourceViews:Object.entries(views).map(([name,v])=>({name,cases:v.cases.length,nodes:v.cases.flatMap(c=>c.decisionNodes).length,sha256:digest(v)})),
 nameTemplates,learningSummaryNote:'Retained views use the existing projector summary rule (joined scored explanations). Respiratory literal patient names are mechanically replaced with the existing runtime token; every other clinical word, option, feedback and ID stays exact. Raw authoring case/node/question hashes are retained separately.'},null,2)+'\n');
console.log(JSON.stringify({requested:41,acceptedNodes:rows.length,acceptedCases:selected.length,skipped:disposition.filter(d=>d.status==='skipped').length,replacements:replacements.length,newMeanings:[...new Set(rows.map(r=>r.conceptId))].filter(id=>!before.default.conceptIds.includes(id)).length,diagnosticOrders:orders.length,lengthResiduals}));
