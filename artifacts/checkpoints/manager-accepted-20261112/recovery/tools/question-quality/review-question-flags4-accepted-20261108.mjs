import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import '../economy-audit/source-loader.mjs';
import {collectAuthoredMetadata,inventoryRelease,preAnswerFields} from './bank.mjs';

const before=JSON.parse(fs.readFileSync('tools/question-quality/fixtures/question-flags4-acceptance-before-20261108.json','utf8'));
const originalPacket=JSON.parse(fs.readFileSync('docs/research/question-flags4-20261108.json','utf8'))[0];
const c=await import('../../packages/clinical-content/src/index.ts');
const f=await import('../../packages/clinical-content/src/question-flags4-accepted-20261108.ts');
const digest=v=>createHash('sha256').update(JSON.stringify(v)).digest('hex');
const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const view=f.QUESTION_FLAGS4_ACCEPTED_SOURCE_RELEASE,r=f.QUESTION_FLAGS4_ACCEPTED_REVISIONS[0],cs=view.cases[0],n=cs.decisionNodes[0],q=r.question;
const reviewed=before.reviewedSource.cases[0],reviewedNode=reviewed.decisionNodes[0],reviewedQ=before.reviewedQuestions[0];
assert.equal(digest(c.QUESTION_FLAGS4_SOURCE_RELEASE),before.reviewedSourceSha256,'Keep the reviewed view exact');
const {currentUpdate:deleted,...rest}=reviewedNode;
assert.equal(deleted,'Serum phosphate fell as carbohydrate feeding resumed.');
assert.deepEqual(n,{...rest,questionVariantId:q.id});
assert.deepEqual(q,{...reviewedQ,id:q.id,contentVersion:'question-authoring.2026-11-08.flags4-r2'});
assert.deepEqual(cs,{...reviewed,decisionNodes:[n]});
const meta=collectAuthoredMetadata(c),lint=inventoryRelease(view,meta),reviewedLint=inventoryRelease(before.reviewedSource,meta);
assert.equal(lint.totals.findings,0,'Record/resolve cue findings; never suppress them');
const show=v=>typeof v==='string'?v.replaceAll('{patientName}',cs.patientDisplayName):Array.isArray(v)?v.map(show):v&&typeof v==='object'?Object.fromEntries(Object.entries(v).map(([k,x])=>[k,show(x)])):v;
const fields=(cc,node)=>({variantId:node.questionVariantId,Presentation:show(cc.presentation),'Current update':show(node.currentUpdate??null),Exhibit:show(node.exhibit??null),Task:show(node.stem),
 Options:[...node.answerChoices].sort((a,b)=>Number(b.isCorrect)-Number(a.isCorrect)).map(a=>(a.isCorrect?'**KEY:** ':'')+a.label)});
const manifest=c.QUESTION_SHIP_MANIFEST;
const row={acceptanceId:'F4-01',caseId:cs.id,nodeId:n.id,questionVariantId:q.id,conceptId:q.conceptId,sourceView:'flags4-accepted',decision:'docs/research/question-flags4-manager-decision-20261108.md'};
assert.deepEqual(manifest,{...before.manifest,id:'question-ship.2026-11-08.v7',accepted:[...before.manifest.accepted,row],headerSources:{[cs.id]:'flags4-accepted',...before.manifest.headerSources}});
const live=c.SYNTHETIC_CLINICAL_RELEASE;
assert.deepEqual(live.cases.map(c=>c.id),before.default.caseIds);assert.deepEqual(live.concepts.map(c=>c.id),before.default.conceptIds);
assert.deepEqual(live.cases.find(c=>c.id===cs.id),cs);
for(const c of live.cases)if(c.id!==cs.id)assert.equal(digest(c),before.default.caseHashes[c.id],c.id);
for(const co of live.concepts)assert.equal(digest(co),before.default.conceptHashes[co.id],co.id);
assert.equal(digest(c.QUESTION_CATALOG_RELEASE),before.catalogSha256);
assert.deepEqual(c.ANSWER_CHOICE_TIMING_REGISTRY,[...before.timing,...f.QUESTION_FLAGS4_ACCEPTED_TIMING_ENTRIES]);
const hashes={reviewedSourceSha256:before.reviewedSourceSha256,reviewedCaseSha256:digest(reviewed),reviewedNodeSha256:digest(reviewedNode),reviewedQuestionSha256:digest(reviewedQ),
 acceptedSourceSha256:digest(view),acceptedCaseSha256:digest(cs),acceptedNodeSha256:digest(n),acceptedQuestionSha256:digest(q),acceptedTimingSha256:digest(f.QUESTION_FLAGS4_ACCEPTED_TIMING_ENTRIES),
 exactReviewedTask:true,exactReviewedOptions:true,exactReviewedExplanation:true,onlyContextDeletion:true};
const packet=[{...originalPacket,round:'acceptance',status:'manager_accepted_draft',accepted:true,acceptanceAllowed:true,releaseReady:false,pipelinePassed:false,clinicalApproval:false,
 questionVariantId:q.id,sourceView:'flags4-accepted',managerDecision:row.decision,independentVerdict:'REVISE',independentDifficulty:'easy',independentTwoStep:false,ownerNoteResolved:true,
 beforeRole:'Exact independently reviewed flags4 r1 candidate; original live v3 remains the frozen fallback.',before:fields(reviewed,reviewedNode),after:fields(cs,n),
 rationalePairs:{before:originalPacket.rationalePairs.after,after:originalPacket.rationalePairs.after},explanation:{before:reviewedNode.explanation,after:n.explanation},
 whatChanged:'Delete only the redundant Current update; preserve the complete task, all options/rationales/feedback and the patient header. Version r2 records the context trim. Manager accepts the owner-note resolution; difficulty remains future work.',
 reviewResponse:{ownerNote:originalPacket.ownerNote,response:originalPacket.ownerNoteResolution,independentReview:'REVISE only for easy recall; no FAIL, fairness or accuracy issue. Manager explicitly accepts as an owner-note resolution.',
  redundancy:'Current update removed: the complete task already names carbohydrate reintroduction and the patient phosphate decline. No clinical information needed for the task is lost.',
  difficulty:'Easy recall remains; not independently PASS, not relabelled hard/two-step, and not a release blocker under this manager decision.'},
 selfCheck:{...originalPacket.selfCheck,reasoningClassification:'Foundational applied physiology / one recall chain, per independent reviewer; author two-step claim superseded.',
  coverTheKey:{attack:originalPacket.selfCheck.coverTheKey.attack,lintWarnings:[]},
  deletionTest:'The redundant seven-word update is absent. The unchanged task still states the exposure, patient and phosphate decline. Header, options and explanation are exact reviewed bytes.',
  residentDifficulty:'Easy per independent review. Explicit manager acceptance of the owner-note resolution; future difficulty work is not a blocker.'},
 supportingEvidenceClaimIds:q.supportingEvidenceClaimIds,conceptVersion:{...originalPacket.conceptVersion,reason:r.conceptVersionReason},
 lint:{version:lint.linterVersion,before:reviewedLint.variants[0].findings,after:lint.variants[0].findings,beforeCount:reviewedLint.totals.findings,afterCount:lint.totals.findings,profileContexts:lint.totals.profileContexts,suppressedFindings:0},
 visibleHistory:{before:show(preAnswerFields(reviewed,0)),after:show(preAnswerFields(cs,0))},frozenPreservation:hashes,
 fallback:{...originalPacket.fallback,policy:'Exact legacy v3 remains archived for open/frozen encounters and stable FSRS history. Fresh default selection uses only the accepted r2 tuple.'},
 encounterContinuity:{...originalPacket.encounterContinuity,requiresManagerCompositionReview:false,change:'Same single-node case, header/profile and concept; only the redundant update and exact variant identity change from the reviewed candidate. One projection row/header replaces the legacy v3 for fresh selection.'},
}];
const changedFiles=Object.entries(before.files).filter(([p,h])=>sha(p)!==h).map(([path,beforeSha256])=>({path,beforeSha256,afterSha256:sha(path)}));
const evidence=JSON.parse(fs.readFileSync('tools/qa/level-five-integration-results-20261012.json','utf8'));
const boundPaths=['packages/clinical-content/src/index.ts','packages/clinical-content/src/synthetic-content.ts','packages/clinical-content/src/answer-choice-timing.ts'];
for(const path of boundPaths)assert(Object.hasOwn(evidence.inputs,path),path+' is not in the current bound-input map');
const scope={checkedOn:'2026-11-08',default:{beforeSha256:before.default.sha256,afterSha256:digest(live),cases:live.cases.length,nodes:live.cases.flatMap(c=>c.decisionNodes).length,
 meanings:live.concepts.length,activeConcepts:new Set(live.cases.flatMap(c=>c.decisionNodes.map(n=>n.primaryConceptId))).size,changedCaseIds:[cs.id],allOtherCasesAndMeaningsExact:true},
 manifest:{id:manifest.id,beforeSha256:before.manifestSha256,afterSha256:digest(manifest),acceptedRows:manifest.accepted.length,priorAcceptedRows:before.manifest.accepted.length,legacyBindings:manifest.legacyBindings.length,wholeCaseRelations:manifest.replacements.length,row},
 catalogUnchanged:true,catalogSha256:before.catalogSha256,timing:{beforeSha256:before.timingSha256,afterSha256:digest(c.ANSWER_CHOICE_TIMING_REGISTRY),priorRows:before.timing.length,currentRows:c.ANSWER_CHOICE_TIMING_REGISTRY.length,allPriorRowsExact:true},
 protectedSourcePaths:Object.keys(before.files).length,unchangedSourcePaths:Object.keys(before.files).length-changedFiles.length,changedFiles,sourceView:'flags4-accepted',frozenPreservation:hashes,
 existingLevelFiveInputsChanged:boundPaths,
 levelFiveInputHashes:boundPaths.map(path=>({path,beforeSha256:before.files[path],afterSha256:sha(path),evidenceRecordedSha256:evidence.inputs[path]})),
 changedTransitiveRuntimeInputs:['packages/clinical-content/src/question-ship-manifest.ts'],
 newDefaultLoadedRuntimeInputs:['packages/clinical-content/src/question-flags4-accepted-20261108.ts','packages/clinical-content/src/question-flags4-20261108.ts','packages/clinical-content/src/question-flags4-20261108-data.ts','packages/clinical-content/src/question-flags4-evidence-20261108.ts','packages/clinical-content/src/question-flags4-retained-input-20261108.ts'],
 evidenceEdited:false,rebindPerformed:false,clinicalApproval:false};
const report={checkedOn:'2026-11-08',linterVersion:lint.linterVersion,totals:{cases:1,variants:1,profileContexts:lint.totals.profileContexts,reviewedFindings:reviewedLint.totals.findings,acceptedFindings:lint.totals.findings,suppressed:0},report:lint};
for(const[path,value]of [['docs/research/question-flags4-accepted-20261108.json',packet],['docs/research/question-flags4-acceptance-scope-20261108.json',scope],['tools/question-quality/question-flags4-accepted-lint-20261108.json',report]]){
 if(process.argv.includes('--check'))assert.deepEqual(JSON.parse(fs.readFileSync(path,'utf8')),value,path+' stale');else fs.writeFileSync(path,JSON.stringify(value,null,2)+'\n');
}
console.log(JSON.stringify({default:scope.default,manifest:scope.manifest,timing:scope.timing,lint:report.totals,changedSourcePaths:changedFiles.length,sourceSha256:hashes.acceptedSourceSha256},null,2));
