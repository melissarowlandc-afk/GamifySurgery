import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import '../economy-audit/source-loader.mjs';
import {collectAuthoredMetadata,inventoryRelease,preAnswerFields} from './bank.mjs';
import {intake,spec} from './question-flags4-spec-20261108.mjs';

const c=await import('../../packages/clinical-content/src/index.ts');
const f=await import('../../packages/clinical-content/src/question-flags4-20261108.ts');
const meta=collectAuthoredMetadata({...c,...f}),view=f.QUESTION_FLAGS4_SOURCE_RELEASE;
const digest=v=>createHash('sha256').update(JSON.stringify(v)).digest('hex');
const hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const render=(v,name)=>typeof v==='string'?v.replaceAll('{patientName}',name):Array.isArray(v)?v.map(x=>render(x,name)):v&&typeof v==='object'?Object.fromEntries(Object.entries(v).map(([k,x])=>[k,render(x,name)])):v;
const display=(cs,n,name)=>({variantId:n.questionVariantId,Presentation:render(cs.presentation,name),'Current update':render(n.currentUpdate??null,name),Exhibit:render(n.exhibit??null,name),Task:render(n.stem,name),
 Options:[...n.answerChoices].sort((a,b)=>Number(b.isCorrect)-Number(a.isCorrect)).map(a=>(a.isCorrect?'**KEY:** ':'')+a.label)});
const old=intake.target,cs=view.cases[0],node=cs.decisionNodes[0],q=f.QUESTION_FLAGS4_QUESTIONS[0];
assert(!collectAuthoredMetadata(c).questions.has(q.id),'Version already exists in the live/catalog source namespace');
const beforeLint=inventoryRelease(f.QUESTION_FLAGS4_RETAINED_INPUT,meta),afterLint=inventoryRelease(view,meta);
const beforeFinding=beforeLint.variants[0],afterFinding=afterLint.variants[0];
const pairs=(choices,explanation)=>[...choices].sort((a,b)=>Number(b.isCorrect)-Number(a.isCorrect)).map(a=>[(a.isCorrect?'**KEY:** ':'')+a.label,a.rationale??a.distractorRationale??explanation]);
const frozenPreservation={retainedCaseSha256:digest(old.clinicalCase),retainedNodeSha256:digest(old.node),retainedQuestionSha256:digest(old.authored[0]),
 candidateCaseSha256:digest(cs),candidateNodeSha256:digest(node),candidateQuestionSha256:digest(q),sourceReleaseSha256:digest(view),timingSha256:digest(f.QUESTION_FLAGS4_TIMING_ENTRIES)};
const packet=[{
 id:spec.id,title:spec.title,round:1,status:'draft_awaiting_independent_review',reviewStatus:'needs_clinician_review',pipelinePassed:false,releaseReady:false,acceptanceAllowed:false,
 ownerFlagId:spec.id,ownerNote:old.ownerNote,ownerNoteResolution:spec.ownerResolution,originalFlaggedVariantId:old.node.questionVariantId,
 holdStatus:'none',sourceVerificationHold:null,sourceHoldScope:null,sourceView:f.QUESTION_FLAGS4_SOURCE_VIEW_NAME,
 caseId:cs.id,nodeId:node.id,conceptId:q.conceptId,previousConceptId:old.node.primaryConceptId,
 keyOrderNotice:'key shown first for review only; runtime answer choices are randomized',
 reviewDisplayNote:'Before is the exact captured live v3, with Maya Chen rendering its patient-name token and original canonical age/sex retained. After is the new named draft. Options are key-first only in this technical packet.',
 beforeRole:'Exact current flagged variant',before:display(old.clinicalCase,old.node,spec.patientName),after:display(cs,node,spec.patientName),
 rationalePairs:{before:pairs(old.authored[0].answerChoices,old.node.explanation),after:pairs(q.answerChoices,q.explanation)},
 explanation:{before:old.node.explanation,after:q.explanation},inference:spec.inference.join(' Then: '),focus:spec.deciding,whatChanged:spec.ownerResolution,
 reviewResponse:{ownerNote:old.ownerNote,response:spec.ownerResolution,independentReview:'Not yet performed for flags4. Author review is not independent PASS or clinical approval.'},
 selfCheck:{reviewer:'author; not independent review or clinical sign-off',manualReviewCompleted:true,
  coverTheKey:{attack:spec.attack,lintWarnings:afterFinding.findings},
  sameDecisionStageAndCategory:{category:spec.category,assessment:'All three choices are candidate explanations for the same serum change, rather than mixtures of diagnoses, laboratory tests and treatments.'},
  reasoningSteps:spec.inference,closestCredibleError:spec.closest,decidingFinding:spec.deciding,counterfactual:spec.counterfactual,
  residentDifficulty:spec.difficulty,singleDefensibleBestAnswer:spec.options[0][1],deletionTest:spec.deletion,
  options:spec.options.map(([label,rationale],i)=>({label,isKey:i===0,words:label.split(/\s+/).length,rationale,temptation:i===0?'Apply the recorded feeding-related redistribution mechanism.':rationale})),
  clinicalAndSourceLimit:spec.limitation,sourceUncertaintyIsNotDifficulty:true,basicAccepted:false,
 },
 supportingEvidenceClaimIds:q.supportingEvidenceClaimIds,
 conceptVersion:{meaning:spec.meaning,reason:spec.versionReason,previousConceptId:q.conceptId,newConceptId:q.conceptId,historyMigration:'None; preserve previous definitions, frozen encounters and FSRS identity.'},
 lint:{version:afterLint.linterVersion,before:beforeFinding.findings,after:afterFinding.findings,beforeCount:beforeFinding.findings.length,afterCount:afterFinding.findings.length,profileContexts:afterFinding.profileContexts,suppressedFindings:0},
 visibleHistory:{before:render(preAnswerFields(old.clinicalCase,0),spec.patientName),after:render(preAnswerFields(cs,0),spec.patientName)},
 encounterContinuity:{previousNodeIds:old.clinicalCase.decisionNodes.map(n=>n.id),candidateNodeIds:cs.decisionNodes.map(n=>n.id),sameSingleNode:true,
  requiresManagerCompositionReview:true,change:'Single node and stable concept preserved. The new question/header/profile are candidate-only; manager acceptance must pin the exact tuple/header. The live four-profile source remains untouched; the preview fixes its canonical 31-year-old female profile.'},
 fallback:{variantId:old.node.questionVariantId,conceptId:old.node.primaryConceptId,caseId:old.clinicalCase.id,nodeId:old.node.id,policy:'Keep the exact live version until manager acceptance after independent review.'},
 frozenPreservation,
}];
const ledger={checkedOn:'2026-11-08',verificationScope:'Offline reuse of previously recorded facts; no external source retrieved or copied. Original source-access and basis-check dates remain 2026-10-07. New dates describe application review only.',
 clinicalSignoff:'Melissa Rowland; all new clinical applications remain needs_clinician_review.',
 sources:f.QUESTION_FLAGS4_SOURCES,basisClaims:f.QUESTION_FLAGS4_BASIS_CLAIMS,claims:f.QUESTION_FLAGS4_CLAIMS,claimProvenance:f.QUESTION_FLAGS4_CLAIM_PROVENANCE,
 items:[{id:spec.id,holdStatus:'none',keyedHold:false,evidenceClaimIds:q.supportingEvidenceClaimIds,limitation:spec.limitation}],
 mappings:f.QUESTION_FLAGS4_STATEMENT_MAPPINGS,
 constructedData:{kind:'Original finite fictional patient course',qualitativeObservations:'Prolonged poor intake followed by nutrition restart and a serum-phosphate decline. No magnitude, percentage change, feeding rate, duration, diagnosis, incidence or numerical cutoff is inferred.',
  ageSex:'Canonical 31-year-old female demographics and original vitals retained. The fictional name is an editorial presentation choice, not a source-derived risk factor.'},
 alternativeOptionStatus:'The two distractors are process hypotheses contrasting loss/reduced entry with redistribution. They do not assert renal dysfunction, malabsorption or any diagnostic criteria in this patient. No held fact is needed for the keyed feeding-response mechanism.',
};
const lint={checkedOn:'2026-11-08',linterVersion:afterLint.linterVersion,scope:'Exact captured live case and assembled candidate case; canonical plus finite instantiation profiles and all visible pre-answer fields. No excluded/suppressed findings.',
 totals:{ownerFlags:1,newVariants:1,candidateCases:1,beforeProfileContexts:beforeLint.totals.profileContexts,afterProfileContexts:afterLint.totals.profileContexts,beforeFindings:beforeLint.totals.findings,afterFindings:afterLint.totals.findings,suppressedFindings:0},
 before:beforeLint,after:afterLint,warningDisposition:'Advisory lint is not clinical approval or an independent difficulty assessment.'};
const oldSourceChanges=Object.entries(intake.files).filter(([p,h])=>hash(p)!==h).map(([path,beforeSha256])=>({path,beforeSha256,afterSha256:hash(path)}));
const sharedBytes=fs.readFileSync(intake.sharedHandoffPrefix.path).subarray(0,intake.sharedHandoffPrefix.bytes);
const scope={checkedOn:'2026-11-08',liveBeforeSha256:intake.live.sha256,liveAfterSha256:digest(c.SYNTHETIC_CLINICAL_RELEASE),catalogUnchanged:digest(c.QUESTION_CATALOG_RELEASE)===intake.catalogSha256,
 manifestUnchanged:digest(c.QUESTION_SHIP_MANIFEST)===intake.manifestSha256,globalTimingUnchanged:digest(c.ANSWER_CHOICE_TIMING_REGISTRY)===intake.timingSha256,
 protectedFiles:Object.keys(intake.files).length,oldSourceChanges,sharedHandoffPrefixUnchanged:createHash('sha256').update(sharedBytes).digest('hex')===intake.sharedHandoffPrefix.sha256,
 sourceView:f.QUESTION_FLAGS4_SOURCE_VIEW_NAME,frozenPreservation,newVariants:1,newConcepts:[],existingLevelFiveInputsChanged:[],defaultImportsNewModules:false,shipManifestEdited:false};
assert.equal(scope.liveAfterSha256,scope.liveBeforeSha256);assert(scope.catalogUnchanged&&scope.manifestUnchanged&&scope.globalTimingUnchanged&&scope.sharedHandoffPrefixUnchanged);
assert.deepEqual(scope.oldSourceChanges,[],'Existing protected source changed; inspect rather than refresh intake');
assert.equal(afterLint.totals.findings,0,'Record and resolve cue findings; never suppress them');
for(const [path,value]of [
 ['docs/research/question-flags4-20261108.json',packet],['docs/research/sources-question-flags4-20261108.json',ledger],
 ['tools/question-quality/question-flags4-lint-20261108.json',lint],['tools/question-quality/question-flags4-scope-20261108.json',scope],
]){if(process.argv.includes('--check'))assert.deepEqual(JSON.parse(fs.readFileSync(path,'utf8')),value,path+' stale');else fs.writeFileSync(path,JSON.stringify(value,null,2)+'\n');}
console.log(JSON.stringify({totals:lint.totals,holdStatus:'none',protectedFiles:scope.protectedFiles,oldSourceChanges:oldSourceChanges.length,liveUnchanged:scope.liveAfterSha256===scope.liveBeforeSha256,sourceReleaseSha256:frozenPreservation.sourceReleaseSha256},null,2));
