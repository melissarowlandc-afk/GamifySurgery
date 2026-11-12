import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import '../economy-audit/source-loader.mjs';
import {collectAuthoredMetadata,inventoryRelease,preAnswerFields} from './bank.mjs';
import {intake,specs,date} from './question-harden1-spec-20261110.mjs';

const c=await import('../../packages/clinical-content/src/index.ts');
const f=await import('../../packages/clinical-content/src/question-harden1-20261110.ts');
const meta=collectAuthoredMetadata({...c,...f});
const digest=x=>createHash('sha256').update(JSON.stringify(x)).digest('hex');
const hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const render=(v,name)=>typeof v==='string'?v.replaceAll('{patientName}',name):Array.isArray(v)?v.map(x=>render(x,name)):v&&typeof v==='object'?Object.fromEntries(Object.entries(v).map(([k,x])=>[k,render(x,name)])):v;
const display=(cs,n)=>({variantId:n.questionVariantId,Presentation:render(cs.presentation,cs.patientDisplayName),'Current update':render(n.currentUpdate??null,cs.patientDisplayName),
 Exhibit:render(n.exhibit??null,cs.patientDisplayName),Task:render(n.stem,cs.patientDisplayName),Options:[...n.answerChoices].sort((a,b)=>Number(b.isCorrect)-Number(a.isCorrect)).map(a=>(a.isCorrect?'**KEY:** ':'')+a.label)});
const pairs=choices=>[...choices].sort((a,b)=>Number(b.isCorrect)-Number(a.isCorrect)).map(a=>[(a.isCorrect?'**KEY:** ':'')+a.label,a.rationale??a.distractorRationale]);
const before=inventoryRelease(f.QUESTION_HARDEN1_RETAINED_INPUT,meta),after=inventoryRelease(f.QUESTION_HARDEN1_SOURCE_RELEASE,meta);
const frozen={sourceReleaseSha256:digest(f.QUESTION_HARDEN1_SOURCE_RELEASE),retainedInputSha256:digest(f.QUESTION_HARDEN1_RETAINED_INPUT),
 candidateTimingSha256:digest(f.QUESTION_HARDEN1_TIMING_ENTRIES),candidateQuestionsSha256:digest(f.QUESTION_HARDEN1_QUESTIONS),candidateConceptsSha256:digest(f.QUESTION_HARDEN1_CONCEPTS)};
const convergenceDisposition='One raw convergence advisory on the joint hernia set. This is an explicit complete 2x2: exploration/reduction and femoral/indirect each occur twice, every combination exists once, and any choice is the intersection of two components. Thus the key has no unique component-frequency or intersection advantage. Retained unsuppressed for independent review; no lint rule or threshold changed.';
const packet=intake.targets.map((old,index)=>{
 const spec=specs.find(s=>s.originalTargetIds.includes(old.id));
 const cs=f.QUESTION_HARDEN1_SOURCE_RELEASE.cases.find(cs=>cs.id===spec.caseId),node=cs.decisionNodes[0],q=f.QUESTION_HARDEN1_QUESTIONS.find(q=>q.id===node.questionVariantId);
 const oldLint=before.variants.find(v=>v.questionVariantId===old.node.questionVariantId),newLint=after.variants.find(v=>v.questionVariantId===q.id);
 const priorIndex=old.clinicalCase.decisionNodes.findIndex(n=>n.id===old.node.id);
 const shared=spec.originalTargetIds.length>1;
 return {id:old.id,title:spec.title,round:1,status:'draft_awaiting_independent_review',reviewStatus:'needs_clinician_review',pipelinePassed:false,releaseReady:false,acceptanceAllowed:false,
  originalTargetId:old.id,originalFlaggedVariantId:old.node.questionVariantId,originalReviewItemId:index<2?(index===0?'F3-03-type':'F3-03'):'F4-01',
  ownerNote:index<2?'The ultrasound findings should prompt the player to identify the hernia type.':'Answer choices do not make sense.',
  ownerNoteResolution:index<2?'The player explicitly chooses a hernia type from raw ultrasound landmarks, together with exploration versus attempted reduction according to the partial-wall findings. All four choices have the same two components.':'All three options interpret the same renal response with parallel grammar and specificity. No mechanism/test/treatment category mixing.',
  sourceView:f.QUESTION_HARDEN1_SOURCE_VIEW_NAME,holdStatus:'none',sourceVerificationHold:null,sourceHoldScope:null,
  candidateId:spec.id,sharedCandidateId:shared?spec.id:null,uniqueScoredCandidateCount:1,afterDuplicateForProvenance:old.id==='H1-02',
  compositionProposal:shared?'Two live scored nodes -> ONE joint scored node, subject to manager acceptance. H1-01 and H1-02 show the same after version for traceability; do not accept or count it twice.':'One live mechanism node -> one new application node under a materially expanded concept version.',
  caseId:cs.id,nodeId:node.id,conceptId:q.conceptId,previousConceptId:old.node.primaryConceptId,
  keyOrderNotice:'key shown first for review only; runtime answer choices are randomized',
  beforeRole:'Exact captured accepted live node at intake; never modified',before:display(old.clinicalCase,old.node),after:display(cs,node),
  rationalePairs:{before:pairs(old.authored[0].answerChoices),after:pairs(q.answerChoices)},explanation:{before:old.node.explanation,after:q.explanation},
  inference:spec.inference.join(' Then: '),focus:spec.deciding,whatChanged:spec.reviewResponses.map(r=>r.response).join(' '),
  reviewResponse:spec.reviewResponses,
  selfCheck:{reviewer:'author; not independent review or Melissa Rowland clinical sign-off',manualReviewCompleted:true,
   coverTheKey:{attack:spec.attack,rawLintWarnings:newLint.findings,advisoryDisposition:shared?convergenceDisposition:'No raw cue-linter finding.'},
   sameDecisionStageAndCategory:spec.category,reasoningSteps:spec.inference,closestCredibleError:spec.closest,
   decidingFinding:spec.deciding,counterfactuals:spec.counterfactual,residentDifficulty:spec.difficulty,
   singleDefensibleBestAnswer:spec.options[0][1],deletionTest:spec.deletion,clinicalAndSourceLimit:spec.limitation,
   options:spec.options.map(([label,rationale],i)=>({label,isKey:i===0,words:label.split(/\s+/).length,rationale})),
   sourceUncertaintyIsNotDifficulty:true,basicAccepted:false,requiresIndependentReview:true,
  },
  supportingEvidenceClaimIds:q.supportingEvidenceClaimIds,
  conceptVersion:{meaning:'new_version',reason:spec.versionReason,previousConceptIds:spec.previousConceptIds,newConceptId:spec.conceptId,historyMigration:'None. No old concept or FSRS record is remapped, mutated, merged or deleted.'},
  lint:{version:after.linterVersion,before:oldLint.findings,after:newLint.findings,beforeCount:oldLint.findings.length,afterCount:newLint.findings.length,afterProfileContexts:newLint.profileContexts,
   suppressedFindings:0,advisoryDisposition:shared?convergenceDisposition:'No raw cue-linter finding.'},
  visibleHistory:{before:render(preAnswerFields(old.clinicalCase,priorIndex),old.clinicalCase.patientDisplayName),after:render(preAnswerFields(cs,0),cs.patientDisplayName)},
  fallback:{variantId:old.node.questionVariantId,conceptId:old.node.primaryConceptId,caseId:old.clinicalCase.id,nodeId:old.node.id,
   retainedCaseSha256:digest(old.clinicalCase),policy:'Keep exact live version unless the manager accepts a reviewed candidate/composition.'},
  frozenPreservation:{...frozen,retainedCaseSha256:digest(old.clinicalCase),retainedNodeSha256:digest(old.node),candidateCaseSha256:digest(cs),candidateNodeSha256:digest(node),candidateQuestionSha256:digest(q)},
 };
});
const ledger={checkedOn:date,clinicalSignoff:'Melissa Rowland; none of these versions is clinically approved.',
 verificationScope:'Targeted read-only factual and article-specific rights checks for new anatomy/perfusion/partial-wall and phosphate-handling applications. Recorded comparator/feeding facts are explicitly offline reuse with unchanged access dates. Bibliographic metadata and original atomic claims only; no external source prose, article text, table, figure or algorithm stored.',
 sources:f.QUESTION_HARDEN1_SOURCES,claims:f.QUESTION_HARDEN1_CLAIMS,basisClaims:f.QUESTION_HARDEN1_BASIS_CLAIMS,
 mappings:f.QUESTION_HARDEN1_STATEMENT_MAPPINGS,
 items:specs.map(s=>({id:s.id,holdStatus:'none',keyedHold:false,evidenceClaimIds:s.claims,limitation:s.limitation})),
 constructedData:{patientProfiles:'Fictional names, retained finite 59 M / 31 F demographics and neutral vitals. No age/sex probability or ethnicity selection.',
  hernia:'Original short ultrasound report, no source image or illustration adapted. Patent lumen and partial wall threat are supported facts synthesized into a new case.',
  phosphate:{units:'All four concentrations mg/dL; matched analytes in serum and urine.',inputs:{serumPhosphate:1,urinePhosphate:10,serumCreatinine:1,urineCreatinine:20},
   calculation:'(10 x 1)/(1 x 20) x 100 = 50%',counterfactual:'(0.2 x 1)/(1 x 20) x 100 = 1%',
   status:'Original synthetic observations and arithmetic, not copied clinical measurements, prescribed exact values, risks, cutoffs or study outcomes.',
   acquisition:'Simultaneous blood/urine before phosphate replacement; stable serum creatinine. No timed-collection claim about daily balance.'}},
 permissionsAndLimits:{licenseDoesNotEqualClinicalAuthority:true,noCopiedProseOrFigures:true,noAlgorithmAdaptation:true,
  excluded:'Sources with unavailable full facts, unverified reuse rights, commercial review material or inaccessible snippets do not support any key. Day et al. 2018 was considered but not used because an article-specific permissive license was not verified. Bellasi 2019 inaccessible source body is not used; the explicit Bech equation supplies the direct formula support.',
  disagreement:'No unresolved keyed factual conflict. The 2025 phosphate paper differentiates general and hypophosphatemia-specific excretion references. Neither boundary ambiguity determines 50% or 1%; no universal threshold is taught.'},
};
const protectedChanges=Object.entries(intake.files).filter(([p,h])=>hash(p)!==h).map(([path,beforeSha256])=>({path,beforeSha256,afterSha256:hash(path)}));
const currentStats=Object.entries(intake.statisticsCaseHashes).map(([id,h])=>({id,unchanged:digest(c.SYNTHETIC_CLINICAL_RELEASE.cases.find(cs=>cs.id===id))===h}));
const observedChanges=Object.entries(intake.observedFiles).filter(([p,h])=>hash(p)!==h).map(([path,beforeSha256])=>({path,beforeSha256,afterSha256:hash(path)}));
const prefix=fs.readFileSync(intake.sharedHandoffPrefix.path).subarray(0,intake.sharedHandoffPrefix.bytes);
const scope={checkedOn:date,liveBefore:intake.live,liveAfter:{cases:c.SYNTHETIC_CLINICAL_RELEASE.cases.length,nodes:c.SYNTHETIC_CLINICAL_RELEASE.cases.flatMap(cs=>cs.decisionNodes).length,
 concepts:c.SYNTHETIC_CLINICAL_RELEASE.concepts.length,sha256:digest(c.SYNTHETIC_CLINICAL_RELEASE)},
 manifestBeforeSha256:intake.manifestSha256,manifestAfterSha256:digest(c.QUESTION_SHIP_MANIFEST),catalogUnchanged:digest(c.QUESTION_CATALOG_RELEASE)===intake.catalogSha256,
 globalTimingUnchanged:digest(c.ANSWER_CHOICE_TIMING_REGISTRY)===intake.timingSha256,protectedFiles:Object.keys(intake.files).length,protectedChanges,observedChanges,
 statisticsCases:currentStats.length,statisticsChanges:currentStats.filter(s=>!s.unchanged),
 retainedTargetsUnchanged:intake.targets.every(t=>digest(c.SYNTHETIC_CLINICAL_RELEASE.cases.find(cs=>cs.id===t.clinicalCase.id))===digest(t.clinicalCase)),
 sharedHandoffPrefixUnchanged:createHash('sha256').update(prefix).digest('hex')===intake.sharedHandoffPrefix.sha256,
 defaultImportsNewModules:false,shipManifestEdited:false,existingLevelFiveInputsChanged:[],sourceView:f.QUESTION_HARDEN1_SOURCE_VIEW_NAME,
 uniqueCandidates:2,reviewRows:3,sharedJointHerniaCandidate:true,newConceptVersions:f.QUESTION_HARDEN1_CONCEPTS.map(c=>c.id),frozenPreservation:frozen};
assert.equal(scope.liveBefore.sha256,scope.liveAfter.sha256,'Default changed; inspect shared work, never refresh intake');
assert.equal(scope.manifestBeforeSha256,scope.manifestAfterSha256,'Manifest is not in this lane');
assert(scope.catalogUnchanged&&scope.globalTimingUnchanged&&scope.retainedTargetsUnchanged&&scope.sharedHandoffPrefixUnchanged);
assert.deepEqual(scope.protectedChanges,[],'Protected file changed; inspect rather than absorb');assert.deepEqual(scope.statisticsChanges,[]);
assert.equal(after.totals.findings,1);assert.equal(after.variants.flatMap(v=>v.findings)[0].rule,'convergence');
for(const q of f.QUESTION_HARDEN1_QUESTIONS)assert(!collectAuthoredMetadata(c).questions.has(q.id),'Candidate leaked to default/catalog namespace');
const lint={checkedOn:date,linterVersion:after.linterVersion,scope:'All unique source/candidate nodes, canonical and finite profiles, exhibits and visible prior feedback. Three packet provenance rows contain only two scored candidates; totals deduplicate the shared after node.',
 totals:{originalTargets:3,uniqueCandidates:2,reviewRows:3,beforeProfileContexts:before.totals.profileContexts,afterProfileContexts:after.totals.profileContexts,
  beforeFindings:before.totals.findings,afterFindings:after.totals.findings,suppressedFindings:0},before,after,advisoryDisposition:convergenceDisposition};
for(const [path,value]of [
 ['docs/research/question-harden1-20261110.json',packet],['docs/research/sources-question-harden1-20261110.json',ledger],
 ['tools/question-quality/question-harden1-lint-20261110.json',lint],['tools/question-quality/question-harden1-scope-20261110.json',scope],
]){if(process.argv.includes('--check'))assert.deepEqual(JSON.parse(fs.readFileSync(path,'utf8')),value,path+' stale');else fs.writeFileSync(path,JSON.stringify(value,null,2)+'\n');}
console.log(JSON.stringify({totals:lint.totals,holds:0,protectedFiles:scope.protectedFiles,protectedChanges:protectedChanges.length,observedConcurrentChanges:observedChanges,
 liveUnchanged:scope.liveBefore.sha256===scope.liveAfter.sha256,sourceReleaseSha256:frozen.sourceReleaseSha256},null,2));
