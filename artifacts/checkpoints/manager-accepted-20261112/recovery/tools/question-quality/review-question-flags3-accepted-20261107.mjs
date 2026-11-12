import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import '../economy-audit/source-loader.mjs';
import {collectAuthoredMetadata, inventoryRelease, preAnswerFields} from './bank.mjs';
const c=await import('../../packages/clinical-content/src/index.ts');
const before=JSON.parse(fs.readFileSync('tools/question-quality/fixtures/question-flags3-acceptance-before-20261107.json','utf8'));
const view=c.QUESTION_FLAGS3_ACCEPTED_SOURCE_RELEASE;
const digest=v=>createHash('sha256').update(JSON.stringify(v)).digest('hex');
assert.equal(digest(c.QUESTION_FLAGS3_SOURCE_RELEASE),before.reviewedSourceSha256,'Retain the exact reviewed source');
const meta=collectAuthoredMetadata(c),oldLint=inventoryRelease(c.QUESTION_FLAGS3_SOURCE_RELEASE,meta),lint=inventoryRelease(view,meta);
const render=(v,name)=>typeof v==='string'?v.replaceAll('{patientName}',name):Array.isArray(v)?v.map(x=>render(x,name)):v&&typeof v==='object'?Object.fromEntries(Object.entries(v).map(([k,x])=>[k,render(x,name)])):v;
const show=(cs,n)=>({variantId:n.questionVariantId,Presentation:render(cs.presentation,cs.patientDisplayName),
 'Current update':render(n.currentUpdate??null,cs.patientDisplayName),Exhibit:render(n.exhibit??null,cs.patientDisplayName),Task:render(n.stem,cs.patientDisplayName),
 Options:[...n.answerChoices].sort((a,b)=>Number(b.isCorrect)-Number(a.isCorrect)).map(a=>(a.isCorrect?'**KEY:** ':'')+a.label)});
const records=before.packet.map(p=>{
 const r=c.QUESTION_FLAGS3_ACCEPTED_REVISIONS.find(r=>r.auditId===p.id),cs=view.cases.find(cs=>cs.id===r.caseId),n=cs.decisionNodes.find(n=>n.id===r.nodeId);
 const reviewed=before.reviewedSource.cases.find(cs=>cs.id===r.caseId),old=reviewed.decisionNodes.find(node=>node.id===n.id);
 if(['F3-01','F3-02'].includes(p.id))assert.deepEqual(cs,reviewed,p.id+' exact reviewed full case');
 assert.deepEqual(n.answerChoices,old.answerChoices,p.id+' unchanged options');
 if(p.id==='F3-03-type')assert.deepEqual(n,old,'Exact type node; shared presentation deletion only');
 const a=lint.variants.find(v=>v.questionVariantId===n.questionVariantId),b=oldLint.variants.find(v=>v.questionVariantId===old.questionVariantId);
 const changed=p.id==='F3-03'?'Established ultrasound classification and functional status now appear in this management node\'s own Current update. Version r12 retains its objective, task, three options, feedback and evidence mappings.':
  p.id==='F3-03-type'?'Remove the unrelated caregiving-lifts sentence from the shared presentation; type question, ultrasound exhibit, options and feedback stay exact.':'No change: exact independently reviewed draft accepted by manager.';
 return {...p,round:'manager-acceptance-fix',status:'manager_accepted_unapproved_draft',releaseReady:true,acceptanceAllowed:true,
  pipelinePassed:p.id==='F3-02',sourceView:'flags3-accepted',questionVariantId:n.questionVariantId,
  before:p.after,beforeRole:'Exact independently reviewed round-one draft; original live fallback remains in the original packet and retained source',after:show(cs,n),
  rationalePairs:{before:p.rationalePairs.after,after:p.rationalePairs.after},whatChanged:changed,
  reviewResponse:{independentReview:'docs/research/question-flags3-review-20261107.json',managerDecision:'docs/research/question-flags3-manager-decision-20261107.md',
   response:changed,residual:p.id==='F3-02'?'Exact moderate PASS retained.':'Reviewer predicts easy; manager explicitly accepts owner-note resolution. Future difficulty work, not a new author PASS.'},
  selfCheck:{...p.selfCheck,
   coverTheKey:{...p.selfCheck.coverTheKey,lintWarnings:p.selfCheck.coverTheKey.lintWarnings.map(d=>({...d,status:'retained_warning_manager_accepted'}))},
   residentDifficulty:p.id==='F3-02'?'Moderate per independent review; exact PASS version retained.':'Easy per independent review; accepted for owner-note resolution, with future difficulty work recorded.',
   displayContext:p.id==='F3-03'?'Self-contained: the known femoral classification, reduction and nonacute examination are visible in this node. The class label is introduced only after the separate type question.':
    p.id==='F3-03-type'?'Own presentation contains no diagnosis, caregiving detail or repair instruction; necessary raw anatomical landmarks remain.':'Exact reviewed after fields retained.',
   deletionTest:p.id==='F3-03-type'?'Deleted the caregiving sentence. Retain the raw compartment and vessel relationship needed for an unambiguous type decision.':p.selfCheck.deletionTest},
  lint:{...p.lint,before:b.findings,after:a.findings,beforeCount:b.findings.length,afterCount:a.findings.length,profileContexts:a.profileContexts,
   dispositions:p.lint.dispositions.map(d=>({...d,status:'retained_warning_manager_accepted'})),suppressedFindings:0},
  visibleHistory:{before:p.visibleHistory.after,after:render(preAnswerFields(cs,cs.decisionNodes.indexOf(n)),cs.patientDisplayName)},
  frozenPreservation:{reviewedQuestionVariantId:old.questionVariantId,reviewedNodeSha256:digest(old),acceptedNodeSha256:digest(n),
   acceptedQuestionSha256:digest(r.question),acceptedCaseSha256:digest(cs),exactReviewedNode:digest(old)===digest(n),
   exactReviewedCase:digest(reviewed)===digest(cs)},
  evidenceUpdate:'No added medical rule, source, threshold or new claim. Established classification uses claim.flags3.20261107.groin-compartment and the existing repair/acuity claims. All remain needs_clinician_review.',
  encounterContinuity:{...p.encounterContinuity,requiresManagerCompositionReview:false,managerCompositionAccepted:true},
  fallback:{...p.fallback,policy:'Frozen encounters retain this exact older live version and FSRS identity; fresh supply uses the manager-accepted source.'},
 };
});
const report={checkedOn:'2026-11-07',scope:'Manager acceptance fix, all three complete cases and all finite profile/prior-feedback contexts; no suppressed rules.',
 reviewedSourceSha256:before.reviewedSourceSha256,acceptedSourceSha256:digest(view),linterVersion:lint.linterVersion,
 totals:lint.totals,variants:lint.variants,items:records.map(r=>({id:r.id,before:r.lint.beforeCount,after:r.lint.afterCount,dispositions:r.lint.dispositions})),
 selfCheck:'No option changes. F3-01 and type are explicitly easy. Management now has decision-critical classification in its own update; type display does not. Advisory anatomical/test-lexicon warnings are retained.'};
for(const[path,value]of [['docs/research/question-flags3-accepted-20261107.json',records],['tools/question-quality/question-flags3-accepted-lint-20261107.json',report]]){
 if(process.argv.includes('--check'))assert.deepEqual(JSON.parse(fs.readFileSync(path,'utf8')),value,path+' stale');
 else fs.writeFileSync(path,JSON.stringify(value,null,2)+'\n');
}
console.log(JSON.stringify({reviewedSourceSha256:before.reviewedSourceSha256,acceptedSourceSha256:digest(view),lint:lint.totals,
 items:records.map(r=>({id:r.id,variantId:r.questionVariantId,lint:r.lint.afterCount,...r.frozenPreservation}))},null,2));
