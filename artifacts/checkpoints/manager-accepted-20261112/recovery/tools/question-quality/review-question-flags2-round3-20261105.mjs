import fs from 'node:fs';
import assert from 'node:assert/strict';
import '../economy-audit/source-loader.mjs';
import {collectAuthoredMetadata,inventoryRelease,preAnswerFields} from './bank.mjs';
import {intake,specs,parked,sourceFor,reviewPath} from './question-flags2-round3-specs-20261105.mjs';
const c=await import('../../packages/clinical-content/src/index.ts');
const f=await import('../../packages/clinical-content/src/question-flags2-round3-20261105.ts');
const meta=collectAuthoredMetadata(c),view=f.QUESTION_FLAGS2_ROUND3_SOURCE_RELEASE;
const oldLint=inventoryRelease(f.QUESTION_FLAGS2_ROUND3_RETAINED_INPUT,meta),newLint=inventoryRelease(view,meta);
const show=s=>typeof s==='string'?s.replaceAll('{patientName}','Jamie Taylor'):s;
const display=(cs,n)=>({variantId:n.questionVariantId,Presentation:show(cs.presentation),'Current update':show(n.currentUpdate??null),Exhibit:n.exhibit??null,
 Task:show(n.stem),Options:[...n.answerChoices].sort((a,b)=>Number(b.isCorrect)-Number(a.isCorrect)).map(a=>(a.isCorrect?'**KEY:** ':'')+a.label)});
const pairs=(n,q)=>[...n.answerChoices].sort((a,b)=>Number(b.isCorrect)-Number(a.isCorrect)).map(a=>{
 const authored=q.answerChoices.find(x=>x.id===a.id);assert(authored);
 return [(a.isCorrect?'**KEY:** ':'')+a.label,authored.rationale??authored.distractorRationale];
});
const responses=(id,items,disposition)=>{
 const review=intake.review.find(r=>r.id===id);assert(review);
 return {reviewPath,reviewId:id,priorVerdict:review.verdict,notes:['cues','fairness','suggestions'].flatMap(category=>review[category].map((note,index)=>{
  const response=items[category][index];assert(response?.length>20,id+' note missing');
  return {category,index:index+1,note,disposition,response};
 }))};
};
const fallback=id=>{
 const original=intake.fallback.find(p=>p.id===id);assert(original);
 return {variantId:original.node.questionVariantId,conceptId:original.node.primaryConceptId,caseId:original.clinicalCase.id,nodeId:original.node.id,
  policy:'Record the currently manifest-selected live version without editing it. No round-three item is accepted by this worker; original and frozen source encounters remain exact.',
  sourceCaution:id==='G01'?'This is not clearance to re-accept the old splenectomy timing key: its ASH bibliographic identity remains unresolved. Manager must assess that existing live-source issue; this narrow authoring lane cannot change the manifest.':null};
};
const keyOrderNotice='key shown first for review only; runtime answer choices are randomized';
const drafts=specs.map(s=>{
 const before=sourceFor(s.id),r=f.QUESTION_FLAGS2_ROUND3_REVISIONS.find(r=>r.auditId===s.id),cs=view.cases.find(c=>c.id===r.caseId),n=cs.decisionNodes.find(n=>n.id===r.nodeId);
 const a=newLint.variants.find(v=>v.questionVariantId===n.questionVariantId),b=oldLint.variants.find(v=>v.questionVariantId===before.node.questionVariantId);
 assert(a&&b);
 return {id:s.id,title:s.title,round:3,status:'draft_awaiting_independent_review',reviewStatus:'needs_clinician_review',pipelinePassed:false,releaseReady:false,acceptanceAllowed:false,
  holdStatus:'none',sourceVerificationHold:null,sourceHoldScope:null,keyOrderNotice,
  reviewDisplayNote:'Jamie Taylor is a review placeholder. Before is the exact independently reviewed round-two draft. After is a standalone retained candidate, not the default live projection. Old paired sources, frozen encounters and G06 remain unchanged.',
  sourceView:'flags2-round3',caseId:cs.id,nodeId:n.id,conceptId:n.primaryConceptId,previousConceptId:before.node.primaryConceptId,
  originalFlaggedVariantId:s.id==='G03'?'question.palpable-breast.negative-mammogram-targeted-us.v1':'question.asymptomatic-phpt.age-based-surgery.v1',
  ownerNote:intake.packet.find(p=>p.id===s.id).ownerNote,ownerNoteResolution:s.ownerResolution,
  before:display(before.clinicalCase,before.node),after:display(cs,n),rationalePairs:{before:pairs(before.node,before.revision.question),after:pairs(n,r.question)},
  inference:s.steps.join(' Then: '),focus:s.deciding,whatChanged:s.whatChanged,
  reviewResponse:responses(s.id,s.responses,'addressed_in_candidate'),
  selfCheck:{reviewer:'author; not independent review or clinical sign-off',manualReviewCompleted:true,
   cueAttack:s.attack,stageCategory:s.category,reasoningSteps:s.steps,closestCredibleError:s.closest,decidingFinding:s.deciding,counterfactual:s.counterfactual,
   difficulty:'Predicted moderate application for PGY-2/3; independent review must assess the actual construction. This is not a difficulty gate or claim of clinical approval.',
   oneBestAnswer:s.options[0][1],deletionTest:s.deletion,clinicalAndSourceLimit:s.limitation,sourceUncertaintyIsNotDifficulty:true},
  supportingEvidenceClaimIds:r.question.supportingEvidenceClaimIds,conceptVersion:{...s.construct,previousConceptId:before.node.primaryConceptId},
  lint:{version:newLint.linterVersion,before:b.findings,after:a.findings,beforeCount:b.findings.length,afterCount:a.findings.length,profileContexts:a.profileContexts},
  visibleHistory:{before:preAnswerFields(before.clinicalCase,before.clinicalCase.decisionNodes.indexOf(before.node)),after:preAnswerFields(cs,0)},
  encounterContinuity:{...r.sourceStructure,beforeKeyService:r.clinicalBinding.previousKeyServiceId,afterKeyService:null,
   beforeGate:r.clinicalBinding.previousResultGate,afterGate:null,
   integrationWarning:'Do not accept one row into the old pair without reviewing the composed case. This source view intentionally contains one scored node. No live case structure, global timing/order registry or ship projection was changed.'},
  fallback:fallback(s.id),
 };
});
const parkedPacket=parked.map(p=>{
 const before=sourceFor(p.id),oldPacket=intake.packet.find(r=>r.id===p.id);
 const b=oldLint.variants.find(v=>v.questionVariantId===before.node.questionVariantId);
 return {id:p.id,title:p.title,round:3,status:'parked_no_supported_candidate',reviewStatus:'needs_clinician_review',pipelinePassed:false,releaseReady:false,acceptanceAllowed:false,
  holdStatus:'parked',sourceVerificationHold:p.reason,sourceHoldScope:'historical_key_not_emitted',keyOrderNotice,
  reviewDisplayNote:'Before is the unchanged reviewed round-two draft for historical comparison. After is null: no new question, keyed answer, concept version or executable candidate exists for this item.',
  sourceView:null,caseId:before.clinicalCase.id,nodeId:before.node.id,conceptId:null,previousConceptId:before.node.primaryConceptId,
  ownerNote:oldPacket.ownerNote,ownerNoteResolution:p.ownerResolution,
  before:display(before.clinicalCase,before.node),after:null,rationalePairs:{before:pairs(before.node,before.revision.question),after:[]},
  inference:null,focus:'No supported replacement decision established in the offline evidence lane.',
  whatChanged:'Disposition only: parked the historical keyed comparison. No prior source file or live version was edited. '+p.alternative,
  supportedAlternativeConsidered:p.alternative,reviewResponse:responses(p.id,p.responseThemes,'not_implemented_parked'),
  selfCheck:{reviewer:'author; not independent review or clinical sign-off',manualReviewCompleted:true,sourceUncertaintyIsNotDifficulty:true,
   candidateEmitted:false,reason:p.reason,difficulty:'Not rated: no round-three candidate.',rubricOutcome:'Parked instead of retaining a held key or inventing clinical evidence.'},
  supportingEvidenceClaimIds:[],historicalEvidenceClaimIds:before.revision.question.supportingEvidenceClaimIds,
  lint:{version:newLint.linterVersion,before:b?.findings??oldPacket.lint.before,after:null,beforeCount:b?.findings.length??oldPacket.lint.afterCount,afterCount:null,profileContexts:0,
   scope:'No after variant: not included in zero-lint candidate totals. Historical source versions are unchanged.'},
  fallback:fallback(p.id),
 };
});
const accepted=intake.packet.find(p=>p.id==='G06');
const g06={...accepted,round:3,status:'unchanged_already_accepted_pass',holdStatus:'none',pipelinePassed:true,
 sourceVerificationHold:null,sourceHoldScope:null,releaseReady:false,acceptanceAllowed:false,
 before:accepted.after,after:accepted.after,rationalePairs:{before:accepted.rationalePairs.after,after:accepted.rationalePairs.after},
 whatChanged:'None. Exact accepted G06 content, source view, review state and manifest row remain unchanged. No new acceptance or optional polish.',
 reviewResponse:responses('G06',{cues:[],fairness:intake.review.find(r=>r.id==='G06').fairness.map(()=>
  'Preserved exact independently passed and already accepted G06. No change to collection chronology, constructed arithmetic, patient scope, options, feedback, sources or clinical-review state.'),
  suggestions:intake.review.find(r=>r.id==='G06').suggestions.map(()=>
  'No change: the existing exact G06 manifest acceptance is frozen. No optional shortening, interpretation wording, actual infection-risk inference or treatment policy was added.')},'preserved_exact_pass'),
 ownerNoteResolution:'Previously resolved and accepted exact G06; no action in this round.'};
const packet=['G01','G02','G03','G04-R','G05','G05-staging','G06','G07'].map(id=>id==='G06'?g06:[...drafts,...parkedPacket].find(p=>p.id===id));
assert.equal(packet.length,8);assert(packet.every(Boolean));
const liveInventory=inventoryRelease(c.SYNTHETIC_CLINICAL_RELEASE,meta);
const report={checkedOn:'2026-11-05',linterVersion:newLint.linterVersion,
 scope:'Two supported new variants only, every canonical/finite profile, including the entire visible prior history. Five parked items have no after and are excluded from zero-lint totals. G06 is frozen.',
 totals:{newVariants:drafts.length,parked:parked.length,profileContexts:newLint.totals.profileContexts,
  beforeFindings:drafts.reduce((n,d)=>n+d.lint.beforeCount,0),afterFindings:newLint.totals.findings,variantsWithFindings:newLint.totals.variantsWithFindings},
 variants:drafts.map(d=>({id:d.id,variantId:d.after.variantId,...d.lint})),
 wholeLiveBank:{scope:'Read-only inventory, not a zero-lint gate and no changes authorized outside these drafts.',totals:liveInventory.totals},
 noteResponses:packet.reduce((n,p)=>n+p.reviewResponse.notes.length,0),
};
for(const[path,data]of [['docs/research/question-flags2-round3-20261105.json',packet],['tools/question-quality/question-flags2-round3-lint-20261105.json',report]]){
 if(process.argv.includes('--check'))assert.deepEqual(JSON.parse(fs.readFileSync(path,'utf8')),data,path+' stale');else fs.writeFileSync(path,JSON.stringify(data,null,2)+'\n');
}
console.log(JSON.stringify({totals:report.totals,noteResponses:report.noteResponses,wholeLiveBank:liveInventory.totals,
 findings:drafts.filter(d=>d.lint.afterCount).map(d=>({id:d.id,findings:d.lint.after}))},null,2));
if(process.argv.includes('--require-zero'))assert.equal(report.totals.afterFindings,0,'Revise prose; never suppress advisory lint');
