import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const base='question-topic-acceptance-batch8';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const before=read(`tools/question-quality/fixtures/${base}-before-20261112.json`);
const supplemental=read(`tools/question-quality/fixtures/${base}-retained-metadata-20261112.json`);
const olderConsolidations=read(`tools/question-quality/fixtures/${base}-consolidation-before-20261112.json`);
const digest=v=>createHash('sha256').update(JSON.stringify(v)).digest('hex');
const decision=`docs/research/${base}-20261112.md`;
const viewName='owner-decisions-batch8';
const cases=before.candidates.map(c=>c.case),questions=before.candidates.map(c=>c.question);
const rows=before.candidates.map(c=>({acceptanceId:c.question.id,caseId:c.case.id,nodeId:c.case.decisionNodes[0].id,
  questionVariantId:c.question.id,conceptId:c.question.conceptId,sourceView:viewName,decision}));
const replacedRows=before.manifest.accepted.filter(r=>cases.some(c=>c.id===r.caseId));
assert.equal(replacedRows.length,5);
const successor=before.candidates.find(c=>c.id==='B2B34');
const duplicate=successor.predecessors.find(c=>c.id!==successor.case.id);
assert(duplicate&&duplicate.decisionNodes.length===1);
const retained=[...new Map([...before.candidates.flatMap(c=>c.predecessors),...before.neonatal,
  ...olderConsolidations.cases].map(c=>[c.id,c])).values()];
const retargetedConsolidations=before.manifest.topicConsolidations.flatMap(relation=>{
  const prior=replacedRows.find(r=>r.questionVariantId===relation.with);
  const successor=prior&&rows.find(r=>r.caseId===prior.caseId&&r.nodeId===prior.nodeId&&r.conceptId===prior.conceptId);
  return successor?[{before:relation,after:{...relation,with:successor.questionVariantId}}]:[];
});
assert.equal(retargetedConsolidations.length,2);
const retirements=[...before.neonatal.map(c=>({caseId:c.id,questionVariantIds:c.decisionNodes.map(n=>n.questionVariantId),decision,
  reason:'Owner-directed retirement 2026-11-12: neonatal clinical framing is outside the accepted patient/art setting.'})),
  {caseId:duplicate.id,questionVariantIds:duplicate.decisionNodes.map(n=>n.questionVariantId),decision,
    reason:'Owner-directed anion-gap successor replaces this additional live correction-dependent predecessor.',
    replacementQuestionVariantId:successor.question.id}];
const sourceFiles=before.sourceInputs;
const frozen=before.candidates.map(c=>({ownerId:c.id,caseId:c.case.id,nodeId:c.case.decisionNodes[0].id,
  questionVariantId:c.question.id,sourceQuestionJson:JSON.stringify(c.question),sourceNodeJson:JSON.stringify(c.case.decisionNodes[0]),
  sourceCaseJson:JSON.stringify(c.case),questionSha256:c.questionSha256,nodeSha256:c.nodeSha256,caseSha256:c.caseSha256,
  review:c.evidence,sourceFiles}));
const directions=before.candidates.map(c=>({ownerId:c.id,questionVariantId:c.question.id,conceptId:c.question.conceptId,
  contentVersion:c.question.contentVersion,questionSha256:c.questionSha256,nodeSha256:c.nodeSha256,
  directedBy:'Melissa Rowland (clinical sign-off)',directedOn:'2026-11-12',
  authority:before.sourceInputs.find(r=>r.path.endsWith('owner-decision-answers-20261112.md')),
  scope:'Owner-directed clinical/key/editorial direction; exact successor version has not received named clinician approval.',
  reviewStatus:'needs_clinician_review',clinicalApprovalGranted:false,lastClinicianReview:null,
  conceptVersion:c.revision.concept,previousQuestionVariantIds:c.revision.previousQuestionVariantIds}));
const lengthResiduals=questions.flatMap(q=>{
  const key=q.answerChoices.find(c=>c.isCorrect),other=Math.max(...q.answerChoices.filter(c=>!c.isCorrect).map(c=>c.label.length));
  if(key.label.length<=other)return [];
  const cs=cases.find(c=>c.decisionNodes.some(n=>n.questionVariantId===q.id));
  return [{questionVariantId:q.id,caseId:cs.id,correctLength:key.label.length,longestDistractor:other,
    reason:'Exact independently PASSed owner-directed wording; no padding or general threshold change.',caseSha256:digest(cs)}];
});
const concepts=[...new Map(before.candidates.map(c=>[c.revision.concept.id,c.revision.concept])).values()];
const exports={
  PROGRAM_BATCH8_ROWS:['QuestionShipAcceptance[]',rows],
  PROGRAM_BATCH8_VIEWS:['Record<string,SyntheticClinicalRelease>',{[viewName]:before.sourceView}],
  PROGRAM_BATCH8_QUESTIONS:['QuestionVariant[]',questions],
  PROGRAM_BATCH8_AUTHORED_CONCEPTS:[null,concepts],
  PROGRAM_BATCH8_TIMINGS:['AnswerChoiceTimingRegistryEntry[]',before.timings],
  PROGRAM_BATCH8_ORDERS:[null,before.orders],
  PROGRAM_BATCH8_RETAINED_TIMINGS:['Array<{index:number;entry:AnswerChoiceTimingRegistryEntry}>',supplemental.timings],
  PROGRAM_BATCH8_RETAINED_ORDERS:[null,supplemental.orders],
  PROGRAM_BATCH8_RETAINED_CONCEPTS:['Array<{index:number;entry:SyntheticClinicalRelease["concepts"][number]}>',supplemental.concepts],
  PROGRAM_BATCH8_REPLACED_ROWS:['QuestionShipAcceptance[]',replacedRows],
  PROGRAM_BATCH8_RETAINED_CASES:['SyntheticClinicalCase[]',retained],
  PROGRAM_BATCH8_RETIREMENTS:['QuestionShipCaseRetirement[]',retirements],
  PROGRAM_BATCH8_RETARGETED_CONSOLIDATIONS:[null,retargetedConsolidations],
  PROGRAM_BATCH8_DIRECTIONS:[null,directions],
  PROGRAM_BATCH8_FROZEN:[null,frozen],
  PROGRAM_BATCH8_LENGTH_RESIDUALS:[null,lengthResiduals],
  PROGRAM_BATCH8_CLAIMS:['EvidenceClaim[]',before.claims],PROGRAM_BATCH8_SOURCES:['Array<ClinicalSource & {verification?:unknown}>',before.sources],
};
let data='// Exact frozen manager acceptance. Source files remain untouched; all new questions are drafts.\n'+
  'import type {SyntheticClinicalRelease,SyntheticClinicalCase,AnswerChoiceTimingRegistryEntry} from "./schema";\n'+
  'import type {QuestionVariant,EvidenceClaim,ClinicalSource} from "./pilot-schema";\n'+
  'import type {QuestionShipAcceptance,QuestionShipCaseRetirement} from "./question-ship-manifest";\n';
for(const [name,[type,value]]of Object.entries(exports))data+='export const '+name+(type?':'+type:'')+' = '+JSON.stringify(value,null,2)+(name.endsWith('ORDERS')?' as const':'')+';\n';
const disposition={checkedOn:'2026-11-12',requested:10,accepted:rows,skipped:[],withdrawnAuthorityRows:replacedRows,retargetedConsolidations,
  retainedCases:retained.map(c=>({caseId:c.id,sha256:digest(c),questionVariantIds:c.decisionNodes.map(n=>n.questionVariantId)})),
  retirements,wholeCaseReplacement:{caseId:before.candidates.find(c=>c.id==='TOPIC-069').case.id,
    reason:'The exact reviewed successor is a complete one-node case. The prior two-node case remains archived for frozen encounters.',
    priorQuestionVariantIds:before.candidates.find(c=>c.id==='TOPIC-069').predecessors[0].decisionNodes.map(n=>n.questionVariantId)},
  easyPregnancy:{retiredQuestionVariantId:'question.gs028f.gynecology.pregnancy-testing-pelvic-pain.v1',
    successorQuestionVariantId:before.candidates.find(c=>c.id==='G04-R').question.id,kind:'same-case exact accepted node replacement'},
  easyOsaScreening:'Preserved; F13 adds the distinct reviewed awake-ventilation case. None of its harder draft predecessors was fresh.',
  directions,waitBindings:before.orders,presentationCorrections:[],sourceInputs:before.sourceInputs};
const outputs=[['packages/clinical-content/src/question-program-batch8-accepted-data-20261112.ts',data],
  [`docs/research/${base}-dispositions-20261112.json`,JSON.stringify(disposition,null,2)+'\n'],
  [`docs/research/${base}-source-freeze-20261112.json`,JSON.stringify({checkedOn:'2026-11-12',records:frozen,sourceViewSha256:digest(before.sourceView),sourceFiles},null,2)+'\n']];
for(const [path,text]of outputs){if(process.argv.includes('--check'))assert.equal(fs.readFileSync(path,'utf8'),text,path+' drift');else fs.writeFileSync(path,text);}
console.log(JSON.stringify({accepted:rows.length,withdrawnRows:replacedRows.length,retainedCases:retained.length,
  retirements:retirements.length,newWaits:before.orders.length,retainedWaits:supplemental.orders.length,lengthResiduals:lengthResiduals.length}));
