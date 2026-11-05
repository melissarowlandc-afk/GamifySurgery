import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import '../economy-audit/source-loader.mjs';
import {entry,specs,deferredItems} from './question-bank-batch2b-specs-20261104.mjs';
import {collectAuthoredMetadata,inventoryRelease,preAnswerFields} from './bank.mjs';
import {LINTER_VERSION} from './lint.mjs';
import {OWNER_FLAG_RULES} from './owner-flag-rules-20261104.mjs';
const c=await import('../../packages/clinical-content/src/question-bank-batch2b-20261104.ts');
const {validateSyntheticClinicalRelease}=await import('../../packages/clinical-content/src/schema.ts');
const r=c.QUESTION_BANK_BATCH2B_REVISIONS;
let before=entry.release,assemblyStatus={kind:'isolated_owned_projection',reason:null},currentNamespace=null;
try{
 const current=await import('../../packages/clinical-content/src/index.ts');
 before=current.QUESTION_BANK_PRE_BATCH2B_RELEASE;currentNamespace=current;assemblyStatus={kind:'combined_default_imported',reason:null};
}catch(error){assemblyStatus.reason=String(error.message);}
const after=validateSyntheticClinicalRelease({...before,concepts:[...before.concepts,...c.QUESTION_BANK_BATCH2B_TESTED_CONCEPTS],cases:c.applyQuestionBankBatch2bRevisions(before.cases)});
const authored=collectAuthoredMetadata(c),metadata={questions:new Map(Object.entries(entry.questions)),concepts:new Map(Object.entries(entry.conceptMetadata)),claims:new Map(Object.entries(entry.claims)),sources:new Map(Object.entries(entry.sources)),caseReviews:new Map()};
for(const kind of ['questions','concepts','claims','sources'])for(const[id,value]of authored[kind])metadata[kind].set(id,value);
if(currentNamespace){const currentMetadata=collectAuthoredMetadata(currentNamespace);for(const kind of ['questions','concepts','claims','sources','caseReviews'])for(const[id,value]of currentMetadata[kind])metadata[kind].set(id,value);}
const config={tutorialCaseIds:['case.ventral-hernia.pulmonary-optimization.a','case.breast-cyst.under-30-asymptomatic-simple'],pilotRevisions:r};
const pre=inventoryRelease(before,metadata,config),post=inventoryRelease(after,metadata,config);
const ordered=n=>[n.answerChoices.find(a=>a.isCorrect),...n.answerChoices.filter(a=>!a.isCorrect)];
const named=s=>typeof s==='string'?s.replaceAll('{patientName}','Jamie Taylor'):s;
const display=(cs,n)=>({variantId:n.questionVariantId,Presentation:named(cs.presentation),'Current update':named(n.currentUpdate??null),Exhibit:n.exhibit??null,Task:named(n.stem),Options:ordered(n).map(a=>(a.isCorrect?'**KEY:** ':'')+a.label)});
const stage={
 B2B01:'Three biliary diversion procedures at the same hepatobiliary treatment-planning stage.',
 B2B02:'Three mechanism-directed record-review plans, each linking interpretation to a named review target; no active transplant treatment is selected.',
 B2B03:'Three receiving-hospital obstruction strategies; all are real management paths, rather than a clinical plan versus doing nothing.',
 B2B04:'Three additional focal-infection treatments after background antibiotics have begun; aspiration is a genuine nearby source-control competitor.',
 B2B05:'Three current anaesthetic referral risk-status requests; none delays communication or orders a prerequisite test.',
 B2B06:'Four repeat node-aspiration requests crossing tissue target and ancillary assay, with each component represented twice.',
 B2B07:'Three consent/disposition actions for the same not-yet-started biopsy.',
 B2B08:'Three named breast operations after completed mapping.',
 B2B10:'Four concrete image-guided localization strategies crossing current-versus-original extent with marker-versus-palpable anchoring; each component occurs twice.',
 B2B12:'Three parallel compress-plus-medicine plans; all contain the same background measure and one medication class.',
 B2B13:'Three named breast-imaging pathways; each is applicable to some stage/pattern.',
 B2B14:'Three current imaging requests covering appendiceal, broader abdominal and pelvic targets.',
 B2B17:'Three named referral targets for the competing volume, access and infection interpretations.',
 B2B21:'Three equally sized non-drug prevention component sets; priority is bounded to the actual documented deficits, not superiority of one universal bundle.',
 B2B24:'All three two-landmark combinations of three landmarks; each landmark appears twice, so every option has the same component frequency/density. The raw map determines which interval covers the current/known bed.',
 B2B26:'Three biliary/abdominal investigations at the same diagnostic stage; imaging review must scrutinize the preferred rather than exclusive HIDA ranking.',
 B2B34:'Four same-stage investigation scopes over two time points: admission, current, both or neither.',
 B2B35:'Three acid-base investigation plans; causal studies compete with characterization at the actual current stage.',
 B2B37:'Three specialist diagnostic plans after the correctly targeted imaging, with tissue sampling, MRI and surveillance as real alternatives in different examination contexts.',
 B2B41:'Three current nutrition-support plans, each with a named action and follow-up/assessment scope.',
 B2B42:'Three feeding-route plans at the same escalation decision.',
};
function selfCheck(s){
 const labels=s.options.map(o=>o[0]);
 assert([3,4].includes(labels.length));assert(labels.every(l=>!/[.;]/.test(l)||l.includes(';')));assert(!labels.some(l=>/\balone\b|\bindividuali[sz]ed\b|\btailored\b|\bshared.decision\b/i.test(l)),s.id);
 return {
  reviewer:'author; not independent or clinical sign-off',status:'author_checked_pending_independent_review',
  cueAttack:'Cover the key, ignore its review marker and remove the decisive observation: '+s.deciding+' The remaining task asks for the same stage as every label. No rationale/availability permission is placed in the task; exact lexical warnings remain separately visible.',
  stageCategory:stage[s.id]??(s.id==='B2B20'||Number(s.id.slice(3))>=38&&Number(s.id.slice(3))<=40?'Four balanced source-control/antibiotic plans; each procedure and antibiotic component occurs twice.':s.id==='B2B32'||s.id==='B2B33'?'Three concrete etiologic acid-base investigation plans, not a calculation name against isolated laboratory values.':s.id==='B2B19'||s.id==='B2B36'?'Three named current breast-imaging requests; the anatomical target is interpretable rather than prelabelled.':s.id==='B2B18'||s.id==='B2B29'||s.id==='B2B30'?'Three named current community/hospital disposition plans after the laboratory callback.':s.id==='B2B09'||s.id==='B2B22'?'Three named mesenteric-ischemia care sequences/destinations after the current examination.':s.id==='B2B11'||s.id==='B2B25'||s.id==='B2B23'?'Three hospital gallbladder treatment/timing plans; all are valid under different clinical courses.':'Three concrete current plans at the same decision point; each is appropriate under a different interpretation or patient state.'),
  twoSteps:s.steps,closestCredibleError:s.error,decidingFinding:s.deciding,counterfactual:s.counterfactual,
  difficulty:'Predicted moderate for PGY-2/3, pending independent calibration: the closest error is '+s.error+' This is author intent, not measured difficulty or a pipeline PASS.',
  oneBest:'The offered key depends on '+s.deciding+' Its boundary is '+s.counterfactual+' The source/application limitation is retained rather than hidden: '+s.limitation,
  deletionTest:'No sentence announces the keyed decision principle. Patient identity, observed course, supported laboratory/report findings and the stated current decision remain; the interpretive work is recorded in twoSteps. The before/after full visible sequence is included for independent cue attack.',
  residualReviewConcern:['B2B01','B2B05','B2B14','B2B21','B2B26','B2B32','B2B33','B2B37'].includes(s.id)?'The author has specifically retained the close-ranking, source-scope or difficulty concern for independent review; absence of forbidden lexical findings does not establish a fair moderate item. '+s.limitation:null,
 };
}
function warningResponse(s,f){
 if(s.id==='B2B24'&&f.rule==='convergence')return 'All three two-endpoint combinations of three landmarks are offered. Each landmark occurs in two options and each option has two landmarks; component frequency cannot uniquely favor the key. The clinical map determines which interval covers the original bed and current extent. No exemption/rule is changed.';
 if(['B2B19','B2B36'].includes(s.id))return 'The earlier modality name must remain visible to test target concordance. The task does not request that modality, and the alternative MRI is also new at the correct site. The original and current site labels, not the word ultrasound, determine whether completion of targeted imaging is still needed. Retain the exact spans for independent review.';
 if(s.id==='B2B34')return 'Admission/current/both/neither are the four legitimate temporal scopes. Both/neither semantically include the admission, although its word appears only in one label. The adjusted gap and gas trend must be interpreted; a timestamp word alone does not rank the scopes.';
 if(f.rule==='heterogeneous-option-category')return s.id==='B2B08'?'All options are breast operations at the same post-mapping planning stage: mastectomy, oncoplastic resection, and localized excisions. The lexical category guess is incomplete; distribution and conservation feasibility still require breast review.':s.id==='B2B26'?'All three labels name diagnostic imaging studies. The lexical modality-category heuristic is not a clinical ontology; the HIDA-versus-CT/MRCP ranking remains an explicit imaging/source review point.':'All three labels are current acid-base investigations. Gas characterization versus etiologic chemistry is the sequencing decision, rather than an unrelated option category.';
 return s.deciding+' '+s.counterfactual;
}
const packet=specs.map(s=>{
 const revision=r.find(v=>v.auditId===s.id),a=before.cases.find(c=>c.id===s.caseId),old=a.decisionNodes.find(n=>n.id===s.nodeId),b=after.cases.find(c=>c.id===s.caseId),n=b.decisionNodes.find(n=>n.id===s.nodeId);
 const preLint=pre.variants.find(v=>v.questionVariantId===old.questionVariantId),postLint=post.variants.find(v=>v.questionVariantId===n.questionVariantId);assert(preLint&&postLint);
 const noteResponses={};if(s.flagReview)for(const type of ['cues','fairness','suggestions'])noteResponses[type]=s.flagReview[type].map((note,i)=>({id:s.flagId+'.review3.'+type+'.'+(i+1),note,response:s.change+' Deciding evidence: '+s.deciding+' Boundary/limitation: '+s.limitation,disposition:'author_response_pending_independent_review'}));
 return {id:s.id,title:s.title,reviewStatus:'needs_clinician_review',pipelinePassed:false,releaseReady:false,basicAccepted:false,keyOrderNotice:'key shown first for review only; runtime options are randomized',reviewDisplayNote:'Before is the exact captured authoring-stage variant, not a claim that a rejected draft shipped. Jamie Taylor substitutes for patientName. The six kept-live identities are recorded separately.',caseId:s.caseId,nodeId:s.nodeId,conceptId:n.primaryConceptId,previousConceptId:old.primaryConceptId,
  before:display(a,old),after:display(b,n),rationalePairs:{before:ordered(old).map(c=>[(c.isCorrect?'**KEY:** ':'')+c.label,c.rationale??null]),after:ordered(n).map(c=>[(c.isCorrect?'**KEY:** ':'')+c.label,c.rationale])},inference:s.steps.join(' Then: '),focus:s.construct?.objective??entry.conceptMetadata[n.primaryConceptId]?.learningObjective??entry.release.concepts.find(c=>c.id===n.primaryConceptId)?.learningObjective,whatChanged:s.change,
  reviewResponse:{selfCheck:selfCheck(s),sourceReview:s.flagId?'docs/research/question-flags-adversarial-review3-20261104.json':null,noteResponses,originalFlagResponse:s.flagId?s.change:null},
  managerKeptLive:s.flagId?{flagId:s.flagId,variantId:s.flagPacket.fallback.lastKnownLiveVariantId,decision:'keep live and re-queue; this is a new draft, not promotion of either rejected draft',record:'docs/research/question-flags-manager-decision-20261104.md',retainedFallback:s.flagPacket.fallback}:null,
  visibleHistory:{before:preAnswerFields(a,a.decisionNodes.indexOf(old)),after:preAnswerFields(b,b.decisionNodes.indexOf(n))},
  sequenceReview:{precedingVariantIds:b.decisionNodes.slice(0,b.decisionNodes.indexOf(n)).map(n=>n.questionVariantId),followingVariantIds:b.decisionNodes.slice(b.decisionNodes.indexOf(n)+1).map(n=>n.questionVariantId),note:s.id==='B2B36'?'The new raw ultrasound return and B2B37 update agree at the lower-inner marker. The first explanation discusses site completion and does not supply the later biopsy rule.':s.id==='B2B24'?'The following older conservation task/update is retained, including its existing eligibility/preference scaffolding. This batch does not claim to fix that unselected question.':s.id==='B2B15'?'The retained preceding multifactor-risk explanation is visible; the new update supplies the actual changed fluid/hernia observations.':'All earlier explanations/results are included in visibleHistory; no unrelated question node is rewritten.'},
  supportingEvidenceClaimIds:revision.question.supportingEvidenceClaimIds,sourceDecision:s.limitation,conceptVersion:s.construct??null,clinicalMeaning:revision.clinicalBinding.reason,
  lint:{version:LINTER_VERSION,before:preLint.findings,after:postLint.findings,beforeCount:preLint.findings.length,afterCount:postLint.findings.length},lintDispositions:postLint.findings.map(f=>({id:f.id,rule:f.rule,status:'advisory_retained_for_independent_review',response:warningResponse(s,f)})),
  encounterContinuity:{beforeGate:old.resultGateAfter,afterGate:n.resultGateAfter,keyServiceBefore:revision.clinicalBinding.previousKeyServiceId,keyServiceAfter:revision.clinicalBinding.nextKeyServiceId},
  fallback:{entryVariantId:old.questionVariantId,entryConceptId:old.primaryConceptId,policy:'Manager reconciles the actual live release. Original and intermediate definitions/orders are retained; no fallback or save migration is applied by this worker.'},
 };
});
const write=(p,value)=>fs.writeFileSync(p,JSON.stringify(value,null,2)+'\n');
write('docs/research/question-bank-batch2b-20261104.json',packet);
write('docs/research/question-bank-batch2b-deferrals-20261104.json',{recordedAt:new Date().toISOString(),items:deferredItems,policy:'No deletion, retirement, FSRS change or new deferred-item version. F13 failed the author difficulty/deletion attack and remains queued; the two generic cirrhosis variants await a manager merge/scope decision.'});
write('tools/question-quality/question-bank-batch2b-whole-bank-20261104.json',post);
const owner=report=>Object.fromEntries(OWNER_FLAG_RULES.map(rule=>[rule,report.variants.reduce((n,v)=>n+v.findings.filter(f=>f.rule===rule).length,0)]));
const lint={checkedAt:new Date().toISOString(),assemblyStatus,linterVersion:LINTER_VERSION,before:pre.totals,after:post.totals,ownerRulesBefore:owner(pre),ownerRulesAfter:owner(post),selected:{variants:packet.length,before:packet.reduce((n,p)=>n+p.lint.beforeCount,0),after:packet.reduce((n,p)=>n+p.lint.afterCount,0),ownerBefore:packet.reduce((n,p)=>n+p.lint.before.filter(f=>OWNER_FLAG_RULES.includes(f.rule)).length,0),ownerAfter:packet.reduce((n,p)=>n+p.lint.after.filter(f=>OWNER_FLAG_RULES.includes(f.rule)).length,0)}};
write('tools/question-quality/question-bank-batch2b-lint-20261104.json',lint);
const ids=new Set(packet.flatMap(p=>p.supportingEvidenceClaimIds));
const osaDeferralClaims=entry.targets.find(t=>t.id==='B2B05').question.supportingEvidenceClaimIds;
for(const id of osaDeferralClaims)ids.add(id);
for(const id of [...ids])for(const basis of metadata.claims.get(id)?.basisClaimIds??[])ids.add(basis);
const claims=[...ids].sort().map(id=>{assert(metadata.claims.has(id),id);return metadata.claims.get(id);}),sourceIds=[...new Set(claims.flatMap(c=>c.sourceIds))].sort();
write('docs/research/sources-question-bank-batch2b-20261104.json',{compiledAt:new Date().toISOString(),policy:'Offline independent synthesis/application. No source text, fresh retrieval or access-date advance. Authority and license/reuse remain separate; a clinical review hold is not cleared by a test.',claims,sources:sourceIds.map(id=>{assert(metadata.sources.has(id),id);return {...metadata.sources.get(id),supportedEvidenceClaimIdsThisBatch:claims.filter(c=>c.sourceIds.includes(id)).map(c=>c.id),useThisBatch:id==='source.sasm.osa-screening.2016'?'F13 scope/difficulty deferral cross-check only; no new OSA version.':'Evidence or application cross-check for the mapped drafts.'};}),mappings:packet.map(p=>({id:p.id,claimIds:p.supportingEvidenceClaimIds,limitation:p.sourceDecision})),deferredSourceUse:{flagId:'F13',claimIds:osaDeferralClaims,decision:'Keep live and queue a supported deeper objective; no new clinical claim or protocol.'},deferredItems});
const cell=s=>String(s).replaceAll('|','\\|').replaceAll('\n',' ');
fs.writeFileSync('docs/research/question-bank-batch2b-cue-audit-20261104.md',[
 '# Batch 2b: advisory cue audit and author rubric','',
 'Thirty-nine additive drafts; key shown first for review only. F13 remains queued after failing the author difficulty attack; no new F13 version is admitted. All drafts remain needs_clinician_review. The batch-2a packet/source and unrelated questions stay frozen. An author check is not independent or clinical approval.','',
 'Assembly: '+JSON.stringify(assemblyStatus)+'. The historical entry capture is explicitly isolated; this comparison uses the actual retained pre-batch stage and combined default assembly.','',
 `Same ${LINTER_VERSION}: ${pre.totals.uniqueVariants} variants, ${pre.totals.profileContexts} / ${post.totals.profileContexts} finite contexts. Whole-bank findings ${pre.totals.findings} → ${post.totals.findings}; selected ${packet.length} ${lint.selected.before} → ${lint.selected.after}; owner-rule findings ${lint.selected.ownerBefore} → ${lint.selected.ownerAfter}.`, '',
 '| Item | Before → after | Retained rules |','|---|---:|---|',...packet.map(p=>'| '+[p.id,p.lint.beforeCount+' → '+p.lint.afterCount,[...new Set(p.lint.after.map(f=>f.rule))].join(', ')||'None'].map(cell).join(' | ')+' |'),'',
 'Exact phrases, fields, finite-profile spans, rationales, author disposition and all five rubric dimensions are in the JSON. No linter warning is suppressed. No per-player answer/correctness/time statistics or collection are added.','',
 'Calibration: review-seven PASS B02, B25, B34, B35 and B35-context. These supplied classification/trajectory/anatomy findings whose interpretation changes a real plan. This authoring round reuses that construction, never source or question wording. Difficulty remains a qualitative intent for independent review.','',
 'Deferred unchanged: '+deferredItems.map(d=>d.id+' ('+d.variantId+'): '+d.reason).join('; ')+'. Nutrition ranks 35–36 replace the two generic cirrhosis cases. F13 stays queued for supported application development. No retirement or FSRS membership change is applied.','',
].join('\n'));
const protection=Object.entries(entry.files).filter(([p])=>/question-bank-batch2a|question-flags-round[23]|question-quality-.*20261102|clinical-exhibits\/batch2a/.test(p)&&fs.existsSync(p)).map(([path,old])=>({path,unchanged:crypto.createHash('sha256').update(fs.readFileSync(path)).digest('hex')===old}));
// A historical binding test must exercise its retained round-three stage,
// rather than later fresh versions. Verify that this single import is the
// entire change; content, packet, images and all other protected files freeze.
const testScopePath='packages/game-domain/tests/question-flags-round3-bindings.test.ts';
const scopedTest=fs.readFileSync(testScopePath,'utf8');
const originalTest=scopedTest.replace('QUESTION_NEW_N1_PRE_RELEASE as live','SYNTHETIC_CLINICAL_RELEASE as live');
assert.notEqual(originalTest,scopedTest);
assert.equal(crypto.createHash('sha256').update(originalTest).digest('hex'),entry.files[testScopePath],'Historical binding test changed beyond the one retained-stage import');
assert(protection.filter(p=>p.path!==testScopePath).every(p=>p.unchanged),'Protected source/packet changed');
const retainedStageTestRepair={path:testScopePath,beforeSha256:entry.files[testScopePath],afterSha256:crypto.createHash('sha256').update(scopedTest).digest('hex'),change:'Only import SYNTHETIC_CLINICAL_RELEASE as live -> QUESTION_NEW_N1_PRE_RELEASE as live; all eighteen round-three exact records and label-drift/frozen-case assertions remain.'};
let cases=0,nodes=0;for(const old of before.cases){const now=after.cases.find(c=>c.id===old.id),rr=r.filter(r=>r.caseId===old.id);if(!rr.length){assert.deepEqual(now,old);cases++;}for(const n of old.decisionNodes)if(!rr.some(r=>r.nodeId===n.id)){assert.deepEqual(now.decisionNodes.find(v=>v.id===n.id),n);nodes++;}}
const covered=(release,id)=>release.cases.filter(cs=>cs.decisionNodes.some(n=>n.primaryConceptId===id));
const newlyWithoutFreshCase=before.concepts.filter(con=>covered(before,con.id).length&&!covered(after,con.id).length).map(c=>c.id);
const newCoverage=c.QUESTION_BANK_BATCH2B_TESTED_CONCEPTS.map(con=>({conceptId:con.id,caseIds:covered(after,con.id).map(c=>c.id),hasStandalone:covered(after,con.id).some(c=>c.decisionNodes.length===1)}));
write('tools/question-quality/question-bank-batch2b-verification-20261104.json',{checkedAt:new Date().toISOString(),assemblyStatus,passed:true,variants:packet.length,newConcepts:c.QUESTION_BANK_BATCH2B_TESTED_CONCEPTS.length,newClaims:c.QUESTION_BANK_BATCH2B_CLAIMS.length,unchangedCases:cases,unchangedNodes:nodes,protectedFiles:protection,retainedStageTestRepair,calibrationIds:entry.calibrationReview.map(r=>({id:r.id,verdict:r.verdict,difficulty:r.difficulty})),newCoverage,newlyWithoutFreshCase,deferredItems});
console.log(JSON.stringify({variants:packet.length,concepts:c.QUESTION_BANK_BATCH2B_TESTED_CONCEPTS.length,claims:claims.length,sources:sourceIds.length,assemblyStatus,lint:lint.selected,whole:[pre.totals.findings,post.totals.findings],protectedFiles:protection.length,unchangedCases:cases,unchangedNodes:nodes,warnings:packet.filter(p=>p.lint.afterCount).map(p=>({id:p.id,rules:p.lint.after.map(f=>f.rule)}))}));
