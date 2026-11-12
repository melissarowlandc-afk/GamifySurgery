import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import '../economy-audit/source-loader.mjs';
import {collectAuthoredMetadata,inventoryRelease,preAnswerFields} from './bank.mjs';
import {intake,specs,sourceFor} from './question-flags3-specs-20261107.mjs';
const c=await import('../../packages/clinical-content/src/index.ts');
const f=await import('../../packages/clinical-content/src/question-flags3-20261107.ts');
const meta=collectAuthoredMetadata({...c,...f}),view=f.QUESTION_FLAGS3_SOURCE_RELEASE;
const oldMetadata=collectAuthoredMetadata(c);
for(const q of f.QUESTION_FLAGS3_QUESTIONS)assert(!oldMetadata.questions.has(q.id),'Question version already exists in the preceding bank: '+q.id);
for(const concept of f.QUESTION_FLAGS3_NEW_TESTED_CONCEPTS)assert(!oldMetadata.concepts.has(concept.id),'New meaning collides with a prior identity: '+concept.id);
const beforeLint=inventoryRelease(f.QUESTION_FLAGS3_RETAINED_INPUT,meta),afterLint=inventoryRelease(view,meta);
const sha=v=>createHash('sha256').update(JSON.stringify(v)).digest('hex');
const show=(v,name)=>typeof v==='string'?v.replaceAll('{patientName}',name):Array.isArray(v)?v.map(x=>show(x,name)):v&&typeof v==='object'?Object.fromEntries(Object.entries(v).map(([k,x])=>[k,show(x,name)])):v;
const display=(cs,n,name)=>({variantId:n.questionVariantId,Presentation:show(cs.presentation,name),'Current update':show(n.currentUpdate??null,name),Exhibit:show(n.exhibit??null,name),
 Task:show(n.stem,name),Options:[...n.answerChoices].sort((a,b)=>Number(b.isCorrect)-Number(a.isCorrect)).map(a=>(a.isCorrect?'**KEY:** ':'')+a.label)});
const pairs=n=>[...n.answerChoices].sort((a,b)=>Number(b.isCorrect)-Number(a.isCorrect)).map(a=>[(a.isCorrect?'**KEY:** ':'')+a.label,a.rationale??n.explanation]);
const dispositions=(id,findings)=>findings.map(finding=>({id:finding.id,rule:finding.rule,status:'author_disposition_pending_independent_review',
 reason:id==='F3-03-type'?
  'Necessary raw anatomical references: both inguinal ligament and common femoral vein are named, with spatial relationships requiring classification. No diagnosis is supplied. Matching those observations in feedback explains the inference; it is not an eligibility conclusion in the case. Keep this transparent residual word-overlap risk for independent/clinician review.':
  'The small named-test lexicon recognizes ultrasound but not the other offered named investigations (functional lumen imaging and timed barium swallow). All choices are specific tests at the same stage. No keyed test is named in the preceding data. This is a vocabulary limitation, not permission to assume clinical validity.'}));
const records=specs.map(s=>{
 const before=sourceFor(s.fromId),r=f.QUESTION_FLAGS3_REVISIONS.find(r=>r.auditId===s.id),cs=view.cases.find(cs=>cs.id===r.caseId),n=cs.decisionNodes.find(n=>n.id===r.nodeId);
 const b=beforeLint.variants.find(v=>v.questionVariantId===before.node.questionVariantId),a=afterLint.variants.find(v=>v.questionVariantId===n.questionVariantId);assert(a&&b);
 return {id:s.id,title:s.title,round:1,status:'draft_awaiting_independent_review',reviewStatus:'needs_clinician_review',pipelinePassed:false,releaseReady:false,acceptanceAllowed:false,
  ownerFlagId:s.ownerFlagId,originalFlaggedVariantId:before.node.questionVariantId,ownerNote:before.ownerNote,ownerNoteResolution:s.ownerResolution,
  holdStatus:'none',sourceVerificationHold:null,sourceHoldScope:null,sourceView:'flags3-round1',caseId:cs.id,nodeId:n.id,conceptId:n.primaryConceptId,previousConceptId:before.node.primaryConceptId,
  keyOrderNotice:'key shown first for review only; runtime answer choices are randomized',
  reviewDisplayNote:'Before is the exact captured current variant, with Jamie Taylor only rendering its name token and canonical age/sex retained. After uses the named draft patient. Neither is a claim that the owner screenshot exactly matches the current first decision.',
  beforeRole:s.id==='F3-03-type'?'Original flagged management question shown for provenance; the source has no separately scored type-identification node.':'Exact current flagged variant',
  before:display(before.clinicalCase,before.node,'Jamie Taylor'),after:display(cs,n,cs.patientDisplayName),
  rationalePairs:{before:pairs(before.node),after:pairs(n)},inference:s.inference.join(' Then: '),focus:s.deciding,whatChanged:s.ownerResolution,
  reviewResponse:{ownerNote:before.ownerNote,response:s.ownerResolution,independentReview:'Not yet performed for flags3. No author PASS or clinical sign-off.'},
  selfCheck:{reviewer:'author; not independent review or clinical sign-off',manualReviewCompleted:true,
   coverTheKey:{attack:s.attack,lintWarnings:dispositions(s.id,a.findings)},sameDecisionStageAndCategory:{category:s.category,assessment:'All labels answer the stated task; exact clinical ranking remains for independent/clinician review.'},
   reasoningSteps:s.inference,closestCredibleError:s.closest,decidingFinding:s.deciding,counterfactual:s.counterfactual,
   residentDifficulty:s.difficulty,singleDefensibleBestAnswer:s.options[0][1],deletionTest:s.deletion,
   options:s.options.map(([label,rationale],i)=>({label,isKey:i===0,rationale,temptation:i===0?'Correct interpretation of the supplied record.':rationale})),
   clinicalAndSourceLimit:s.limitation,sourceUncertaintyIsNotDifficulty:true},
  supportingEvidenceClaimIds:r.question.supportingEvidenceClaimIds,conceptVersion:{meaning:s.meaning,reason:s.versionReason,previousConceptId:before.node.primaryConceptId,newConceptId:s.conceptId,historyMigration:'None'},
  lint:{version:afterLint.linterVersion,before:b.findings,after:a.findings,beforeCount:b.findings.length,afterCount:a.findings.length,profileContexts:a.profileContexts,dispositions:dispositions(s.id,a.findings),suppressedFindings:0},
  visibleHistory:{before:show(preAnswerFields(before.clinicalCase,before.clinicalCase.decisionNodes.findIndex(n=>n.id===before.node.id)),'Jamie Taylor'),after:show(preAnswerFields(cs,cs.decisionNodes.indexOf(n)),cs.patientDisplayName)},
  encounterContinuity:{previousNodeIds:before.clinicalCase.decisionNodes.map(n=>n.id),candidateNodeIds:cs.decisionNodes.map(n=>n.id),
   requiresManagerCompositionReview:true,
   change:s.ownerFlagId==='F3-03'?'Proposed two-node result-review encounter replaces the old investigation/plan pair. Add classification and retain the original management concept; exclude the old interpreted inguinal gate from fresh composition. Full source-case acceptance/replacement is required, not isolated node insertion.':
    s.id==='F3-02'?'Same two-node structure. Preserve the currently live first acquisition node and gate exactly; replace the second wording and pin the new symptom-only header/profile.':
    'Same single-node structure and concept; new exact question/header/profile need explicit acceptance.',
   selectionLimit:s.ownerFlagId==='F3-03'?'Paired-only new classification coverage. Existing FSRS policy can defer the case while the management companion is future-due; no selector, routing or history migration change.':null},
  fallback:{variantId:before.node.questionVariantId,conceptId:before.node.primaryConceptId,caseId:before.clinicalCase.id,nodeId:before.node.id,policy:'Exact live version remains selected until manager acceptance after independent review.'},
 };
});
const newIds=new Set(f.QUESTION_FLAGS3_QUESTIONS.map(q=>q.id)),newLint=afterLint.variants.filter(v=>newIds.has(v.questionVariantId)),preserved=afterLint.variants.filter(v=>!newIds.has(v.questionVariantId));
const report={checkedOn:'2026-11-07',linterVersion:afterLint.linterVersion,scope:'All canonical/finite candidate contexts and prior visible feedback/results. Four new variants and one preserved first decision; no exclusions or suppressed findings.',
 totals:{ownerFlags:3,newVariants:newLint.length,candidateCases:view.cases.length,nodeOccurrences:afterLint.totals.nodeOccurrences,profileContexts:afterLint.totals.profileContexts,
  newVariantContexts:newLint.reduce((n,v)=>n+v.profileContexts,0),beforeFlaggedFindings:records.filter(r=>r.id!=='F3-03-type').reduce((n,r)=>n+r.lint.beforeCount,0),
  newVariantFindings:newLint.reduce((n,v)=>n+v.findings.length,0),preservedContextFindings:preserved.reduce((n,v)=>n+v.findings.length,0),totalFindings:afterLint.totals.findings,suppressedFindings:0},
 variants:afterLint.variants,preservedContext:preserved.map(v=>({variantId:v.questionVariantId,findings:v.findings,disposition:'Unchanged current first acquisition question; the after/after lexical match is recorded, not rewritten in this owner-flag lane.'})),
 warningDisposition:'All warnings remain in raw output. Author explanations do not waive independent/clinical review or establish PASS.'};
const basis=f.QUESTION_FLAGS3_BASIS_CLAIMS,sources=f.QUESTION_FLAGS3_SOURCES;
const ledger={checkedOn:'2026-11-07',verificationScope:'Offline reuse of recorded atomic facts and complete source metadata. Original source access/check dates preserved; no network retrieval, article excerpt, copied figure/table or new empirical performance/threshold. Constructed audit data and arithmetic are explicitly identified.',
 clinicalSignoff:'Melissa Rowland; all new applications remain needs_clinician_review.',sources,basisClaims:basis,claims:f.QUESTION_FLAGS3_CLAIMS,claimProvenance:f.QUESTION_FLAGS3_CLAIM_PROVENANCE,
 items:records.map(r=>({id:r.id,ownerFlagId:r.ownerFlagId,holdStatus:r.holdStatus,keyedHold:false,evidenceClaimIds:r.supportingEvidenceClaimIds,limitation:r.selfCheck.clinicalAndSourceLimit})),
 constructedData:{F3_01:{kind:'original finite teaching audit',screenPositive:{referencePositive:40,referenceNegative:95},screenNegative:{referencePositive:10,referenceNegative:855},
  ppv:'40/(40+95) = 29.6296%, rounded to About 30%',sensitivity:'40/(40+10) = 80%',specificity:'855/(855+95) = 90%',referenceNegativeAmongPositive:'95/(40+95) = 70.3704%',
  boundary:'Not observed test performance, a real MRSA probability, infection diagnosis or a treatment decision.'}},
 mappings:f.QUESTION_FLAGS3_STATEMENT_MAPPINGS,
 priorStatisticsLessons:{acceptedId:'G06',decision:'docs/research/question-flags2-manager-decision-20261105.md',
  exactAcceptedVariant:'question.statistics-ethics.predictive-value-prevalence.v2.r1',
  ownerNote:'Dont have this be so hypothetical',
  lesson:'Concrete single testing context; distinguish specimen/testing population and denominator; all compared reference results must be accounted for. G06 and its two-cohort chronology remain exact. This flag targets the separate live v4 characteristics-fixed sibling, not G06.',
  additionalFinding:'The captured v4 case says primary aldosteronism/urinary assay, while its task says breast-cancer blood test. Its fixed-characteristic clauses also explicitly exclude all three distractors.'}};
const scope={checkedOn:'2026-11-07',liveBeforeSha256:intake.live.sha256,liveAfterSha256:sha(c.SYNTHETIC_CLINICAL_RELEASE),
 catalogUnchanged:sha(c.QUESTION_CATALOG_RELEASE)===intake.catalogSha256,manifestUnchanged:sha(c.QUESTION_SHIP_MANIFEST)===intake.manifestSha256,
 globalTimingUnchanged:sha(c.ANSWER_CHOICE_TIMING_REGISTRY)===intake.timingSha256,
 oldSourceChanges:Object.entries(intake.files).filter(([p,h])=>createHash('sha256').update(fs.readFileSync(p)).digest('hex')!==h).map(([path,beforeSha256])=>({path,beforeSha256})),
 sourceView:'flags3-round1',sourceViewSha256:sha(view),newVariants:4,newConcepts:f.QUESTION_FLAGS3_NEW_TESTED_CONCEPTS.map(c=>c.id),
 existingLevelFiveInputsChanged:[],defaultImportsNewModules:false,shipManifestEdited:false,
 preservedFirstDecision:{caseId:sourceFor('F3-02').clinicalCase.id,variantId:sourceFor('F3-02').clinicalCase.decisionNodes[0].questionVariantId,
  beforeSha256:sha(sourceFor('F3-02').clinicalCase.decisionNodes[0]),afterSha256:sha(view.cases.find(c=>c.id===sourceFor('F3-02').clinicalCase.id).decisionNodes[0])}};
assert.equal(scope.liveAfterSha256,scope.liveBeforeSha256);assert(scope.catalogUnchanged&&scope.manifestUnchanged&&scope.globalTimingUnchanged);assert.deepEqual(scope.oldSourceChanges,[]);
assert.equal(scope.preservedFirstDecision.beforeSha256,scope.preservedFirstDecision.afterSha256);
for(const[path,value]of [
 ['docs/research/question-flags3-20261107.json',records],['docs/research/sources-question-flags3-20261107.json',ledger],
 ['tools/question-quality/question-flags3-lint-20261107.json',report],['tools/question-quality/question-flags3-scope-20261107.json',scope],
]){if(process.argv.includes('--check'))assert.deepEqual(JSON.parse(fs.readFileSync(path,'utf8')),value,path+' stale');else fs.writeFileSync(path,JSON.stringify(value,null,2)+'\n');}
console.log(JSON.stringify({totals:report.totals,holds:records.map(r=>({id:r.id,status:r.holdStatus})),scope:{liveSha256:scope.liveAfterSha256,sourceViewSha256:scope.sourceViewSha256,oldSourceChanges:scope.oldSourceChanges.length}},null,2));
