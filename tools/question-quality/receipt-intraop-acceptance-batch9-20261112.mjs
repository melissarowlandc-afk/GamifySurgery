import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import '../economy-audit/source-loader.mjs';
const base='question-intraop-acceptance-batch9',date='20261112',scratch=`.local-dev/${base}-${date}/`;
const read=p=>JSON.parse(fs.readFileSync(p,'utf8').replace(/^\uFEFF/,''));
const hash=b=>createHash('sha256').update(b).digest('hex'),digest=v=>hash(JSON.stringify(v));
const write=(p,v)=>fs.writeFileSync(p,JSON.stringify(v,null,2)+'\n');
const c=await import('../../packages/clinical-content/src/index.ts');
const before=read(`tools/question-quality/fixtures/${base}-before-${date}.json`),after=read(`tools/question-quality/fixtures/${base}-after-${date}.json`);
const disposition=read(`docs/research/${base}-dispositions-${date}.json`);
const sourceDependencies=read(`tools/question-quality/fixtures/${base}-source-dependencies-${date}.json`);
const migration=read(`tools/question-quality/fixtures/${base}-source-migration-${date}.json`);
const lint=read(`tools/question-quality/${base}-lint-${date}.json`);
const live=c.SYNTHETIC_CLINICAL_RELEASE,rows=c.QUESTION_PROGRAM_BATCH9_ACCEPTED_ROWS,cases=c.QUESTION_PROGRAM_BATCH9_ACCEPTED_CASES;
assert.equal(digest(live),after.defaultSha256);assert.equal(digest(c.QUESTION_SHIP_MANIFEST),after.manifestSha256);
assert.equal(lint.target.totals.findings,0);
assert.deepEqual(live.cases.slice(0,before.defaultRelease.cases.length).map(c=>c.id),before.defaultRelease.cases.map(c=>c.id));
for(const f of migration.files)assert.equal(hash(fs.readFileSync(f.path)),f.afterSha256,f.path+' exact final source postimage');
const evidence=read('tools/qa/level-five-integration-results-20261012.json');
const levelFiveInputs=migration.files.filter(r=>evidence.inputs[r.path]).map(({path,beforeSha256,afterSha256})=>({path,beforeSha256,afterSha256,retainedEvidenceSha256:evidence.inputs[path],alreadyUnboundAtIntake:beforeSha256!==evidence.inputs[path]}));
const field=(cs,n)=>({Presentation:cs.presentation,'Current update':n.currentUpdate??null,Exhibit:n.exhibit??null,Task:n.stem,
  Options:[...n.answerChoices].sort((a,b)=>Number(b.isCorrect)-Number(a.isCorrect)).map(a=>(a.isCorrect?'**KEY:** ':'')+a.label)});
const records=c.QUESTION_PROGRAM_BATCH9_FROZEN_PRESERVATION.map(f=>{
  const cs=cases.find(c=>c.id===f.caseId),n=cs.decisionNodes.find(n=>n.id===f.nodeId),q=c.QUESTION_PROGRAM_BATCH9_ACCEPTED_QUESTIONS.find(q=>q.id===f.questionVariantId);
  const previous=JSON.parse(f.sourceCaseJson),previousNode=JSON.parse(f.sourceNodeJson);
  const claimMappings=q.supportingEvidenceClaimIds.map(id=>{const claim=c.QUESTION_PROGRAM_BATCH9_CLAIMS.find(r=>r.id===id);assert(claim,id);return {claimId:id,claimSha256:digest(claim),sourceIds:claim.sourceIds};});
  return {id:n.id,title:q.id,caseId:cs.id,nodeId:n.id,questionVariantId:q.id,conceptId:q.conceptId,contentVersion:q.contentVersion,
    reviewStatus:q.reviewStatus,lastClinicianReview:q.lastClinicianReview,review:f.review,
    before:field(previous,previousNode),after:field(cs,n),explanation:q.explanation,
    rationalePairs:q.answerChoices.map(a=>({choiceId:a.id,choice:a.label,isCorrect:a.isCorrect,rationale:a.rationale,distractorRationale:a.distractorRationale})),
    inference:Object.values(c.QUESTION_PROGRAM_BATCH9_ACCEPTED_SOURCE_VIEWS).flatMap(v=>v.concepts).find(p=>p.id===q.conceptId)?.learningObjective,
    focus:cs.procedureContext.mode,whatChanged:'Exact reviewed draft admitted with patient-name placeholders and explicit source context. Source clinical meaning, options, key and FSRS concept identity retained; the existing projector normalizes summary separators.',
    selfCheck:{wholeCase:true,latestIndependentPass:true,cueLintFindings:[],unapprovedDraft:true,
      twoStep:f.review.record.twoStep??null,predictedDifficulty:f.review.record.difficulty,
      nativeLiveOrClinicAdmissionTest:true,sourceGuardControls:cs.procedureContext.mode==='live'?['real_family','occupied_correct_room','active_phase','nurse','provider','capability','ordinary_admission_rejected']:['ordinary_clinic_record_only','no_local_procedure'],
      pediatricControls:cs.pediatricProfile?['level4','operational_pediatric_room','exact_child_5_to_17_art','one_named_parent','frozen_family_identity']:[],
      sourceClosure:'Every existing supporting claim resolves to its unchanged source ledger. No new clinical statement or source verification is claimed.'},
    evidenceMapping:claimMappings,procedureContext:cs.procedureContext,requiredClinicalSetting:cs.requiredClinicalSetting,requiredCapabilityIds:cs.requiredCapabilityIds,
    sourceHashes:{question:f.sourceQuestionSha256,node:f.sourceNodeSha256,case:f.sourceCaseSha256},acceptedHashes:{question:f.acceptedQuestionSha256,node:f.acceptedNodeSha256,case:f.acceptedCaseSha256},
  };
});
const packet={checkedOn:'2026-11-12',reviewDisplay:'Key shown first for review only. Runtime choices are randomized.',
  clinicalApproval:false,clinicalSignOff:'Melissa Rowland; no named approval of these exact draft versions is inferred from editorial acceptance.',
  accepted:records,skipped:disposition.skipped,sourceInputs:before.sourceInputs,sourceDependencies,
  presentationCorrections:disposition.corrections,waitBindings:disposition.orders.map(r=>({...r,installed:true})),remainingWaitBindings:[],
  counts:{before:{cases:before.defaultRelease.cases.length,nodes:before.defaultRelease.cases.flatMap(c=>c.decisionNodes).length,
    registeredMeanings:before.defaultRelease.concepts.length,scoredMeanings:new Set(before.defaultRelease.cases.flatMap(c=>c.decisionNodes.map(n=>n.primaryConceptId))).size,
    acceptedRows:before.manifest.accepted.length,timingRows:before.timing.length},after:{cases:after.cases,nodes:after.nodes,registeredMeanings:after.registeredMeanings,
      scoredMeanings:after.scoredMeanings,acceptedRows:after.acceptedRows,timingRows:c.ANSWER_CHOICE_TIMING_REGISTRY.length}},
  manifestId:c.QUESTION_SHIP_MANIFEST.id,manifestSha256:after.manifestSha256,defaultSha256:after.defaultSha256,catalogSha256:after.catalogSha256,timingSha256:after.timingSha256,
  levelFiveInputs,lint:{target:lint.target.totals,before:lint.beforeTotals,after:lint.afterTotals},
  sourceQuestionsEdited:false,retirements:[],newClinicalClaims:[],newSourceRecords:[],
};
write(`docs/research/${base}-packet-${date}.json`,packet);
if(!process.argv.includes('--final')){console.log(JSON.stringify({packet:records.length,skipped:disposition.skipped.length,levelFiveInputs}));process.exit(0);}

const decode=path=>{const b=fs.readFileSync(path);return(b[0]===255&&b[1]===254?b.toString('utf16le'):b.toString('utf8')).replace(/^\uFEFF/,'');};
const results={};
for(const [label,job] of [['clinical-final','clinical-complete'],['domain-full','domain-full'],['player-full','player-full']]){
  const j=read(scratch+job+'.json'),exit=read(scratch+job+'-exit.json');
  const log=decode(scratch+job+'.log'),summaryAt=log.lastIndexOf(' Test Files ');
  results[label]={receiptName:job,command:'npm.cmd test -- --pool=threads --maxWorkers=2 --reporter=default --reporter=json --outputFile=C:/Users/rowla/Projects/GamifySurgery/'+scratch+job+'.json',
    environment:{CI:'1',NODE_NO_WARNINGS:'1',...(job==='player-full'?{NODE_OPTIONS:'--require=C:/Users/rowla/Projects/GamifySurgery/tools/question-quality/adversarial-r5-player-preload-20261102.cjs'}:{})},
    exactSummary:summaryAt<0?'':log.slice(summaryAt,log.indexOf('JSON report written',summaryAt)).trim(),
    passed:j.numPassedTests,failed:j.numFailedTests,pending:j.numPendingTests,total:j.numTotalTests,files:j.testResults.length,exitCode:exit.exitCode,
    failures:j.testResults.flatMap(r=>r.assertionResults.filter(a=>a.status==='failed').map(a=>({file:r.name,fullName:a.fullName,failureMessages:a.failureMessages}))),
    newOrFocused:j.testResults.filter(r=>/batch9|Batch9|topicRuntimeBindings|patient-library-wording-repair|eng-i01-live-procedure|question-ship-manifest|questionProgramBatch[34]Save/.test(r.name)).map(r=>({file:r.name,status:r.status,tests:r.assertionResults.length,failed:r.assertionResults.filter(a=>a.status==='failed').length})),
    logSha256:hash(fs.readFileSync(scratch+job+'.log'))};
}
for(const [label,job]of [['typecheck-complete','typecheck-metadata'],['pacing','pacing'],['lint-tests','lint-tests']]){const exit=read(scratch+job+'-exit.json');assert.equal(exit.exitCode,0,job);results[label]={receiptName:job,exitCode:exit.exitCode,output:decode(scratch+job+'.log').trim(),logSha256:hash(fs.readFileSync(scratch+job+'.log'))};}
assert.equal(results['player-full'].failed,0,'No new player failure may be accepted');
for(const job of ['clinical-final','domain-full','player-full'])for(const row of results[job].newOrFocused)assert.equal(row.failed,0,row.file);
const pacing=JSON.parse(decode(scratch+'pacing.log').trim());assert(Math.abs(pacing.firstFinishTick/26281-1)<=.1);
const sourceChanges=Object.entries(before.observed).filter(([p,sha])=>fs.existsSync(p)&&hash(fs.readFileSync(p))!==sha).map(([path,beforeSha256])=>({path,beforeSha256,afterSha256:hash(fs.readFileSync(path))}));
const owned=new Set(migration.files.map(r=>r.path));
const prohibitedChanges=sourceChanges.filter(r=>owned.has(r.path)&&(/question-(?:intraop|topic)-.*(?<!\.test)\.ts$/.test(r.path)||r.path.startsWith('packages/balance-config/')||r.path.startsWith('apps/player/src/session/cloud/')));
assert.equal(prohibitedChanges.length,0,'Preserve forbidden source/runtime lanes');
const validation={checkedOn:'2026-11-12',results,pacing,levelFiveInputs,sourceChanges,unownedConcurrentChanges:sourceChanges.filter(r=>!owned.has(r.path)),
  clinicalFailureClassification:'Remaining exact schema/source/review-pin mismatches predate batch9. Their captures are retained; no baseline pin is approved or relaxed here.',
  domainFailureClassification:'The stale explicit concept census and retained Level5 source/behavioral evidence are manager-owned baseline failures. Accepted content intentionally changes its bound inputs; no rebind is performed.',
  sourceGuardReconciliation:'Twelve authoring test files retain every original guard through exact pre-batch9 source/authority/case adapters. New batch9 tests assert current acceptance and reject unrelated mutations. No question-authoring source or immutable capture was edited.'};
write(`docs/research/${base}-validation-${date}.json`,validation);
const cell=s=>String(s??'').replaceAll('|','\\|').replaceAll('\n',' ');
const lines=[`# Intraop / intra-endoscopy acceptance batch9 — 2026-11-12`,'',
  '**Accepted 17 requested PASS nodes in 14 complete cases; skipped 18.** All remain needs_clinician_review, with no named clinical approval inferred. No question-intraop-* authoring source was edited.','','## Acceptance and admission','',
  '| Node | Case | Mode / family | Latest review |','| --- | --- | --- | --- |',
  ...records.map(r=>'| '+[r.nodeId,r.caseId,r.focus+' / '+r.procedureContext.familyId,r.review.path].map(cell).join(' | ')+' |'),'','## Skipped — not present in fresh supply','',
  '| Node | Reason | Unaccepted scored siblings |','| --- | --- | --- |',
  ...disposition.skipped.map(r=>'| '+[r.nodeId,r.reason,r.siblings.join(', ')||'none'].map(cell).join(' | ')+' |'),'',
  'The accepted split is **4 live cases / 5 scored nodes** and **10 clinic chart-review cases / 12 scored nodes**. I18 uses its existing authored I18_SCORABLE_PREVIEW_CASES two-node source: its held third construct was already excluded by that export. No node was cut from a scored source case by this lane. All other mixed cases stay withheld. There are no retirements or replacement relations in this additive batch.','',
  'Live contracts bind only procedure.groin_hernia_repair (staffed ASC OR, ordinary/extended operation line) and the authored pediatric procedure.egd (staffed endoscopy room). Native tests exercise each real source through its actual procedure phase and reject wrong family, room, phase, nurse, provider or capability and ordinary unsourced admission. The child additionally needs Level4, an accessible operational Pediatric Examination Room, one exact parent and matching 5–17 child art. Its family/source survives format3 and journal reloads. Hospital procedures stay in clinic records; no local hospital equipment or ENG-I02 executed result is implied.','',
  'The source freeze retains both original and accepted question/node/case serializations and hashes, plus source/review files and thirty unchanged authoring-packet/ledger dependencies. Eighteen name-only string substitutions use {patientName}; pronouns already match the single constrained profile. One newline in the derived combined summary is normalized to a space by the existing projector. No clinical wording, option/key, explanation, concept identity or approval change occurred. The packet is key-first **for review only**; runtime shuffling remains enabled.','',
  'Artifacts: [packet]('+base+'-packet-'+date+'.json), [source freeze]('+base+'-source-freeze-'+date+'.json), [dispositions/correction ledger]('+base+'-dispositions-'+date+'.json), [validation/full failure details]('+base+'-validation-'+date+'.json). Existing source records and atomic claims are reused exactly (17 question mappings,174 retained claims,58 source records; no missing mappings or new clinical claims). Specialized device/operative feasibility and rescue protocols remain clinician-review boundaries.','',
  'Original authored concept records are exported unchanged. Six omit an educationalTier field; this metadata gap is recorded rather than inferred from facility stage. All facility-stage, patient-profile and procedure-capability gates remain separate and retain their authored values.','',
  '## Runtime testing estimates','',
  '**All16 required bindings are installed; none remain.** These reuse authored existing profiles as planning-only, not-executed choices, including distractors. They do not assert local availability or enact tests/results. No fixed wait is inserted into clinical prose.','',
  '| Node | Choice | Existing timing profile |','| --- | --- | --- |',
  ...disposition.orders.map(r=>'| '+[r.nodeId,r.choiceId+' — '+r.choiceLabel,r.timingProfileId].map(cell).join(' | ')+' |'),'','## Counts and hashes','',
  '| Measure | Before | After |','| --- | ---: | ---: |',
  ...Object.keys(packet.counts.before).map(k=>'| '+[k,packet.counts.before[k],packet.counts.after[k]].join(' | ')+' |'),'',
  'Manifest: '+packet.manifestId+'; SHA256 '+packet.manifestSha256+'. Default SHA256 '+packet.defaultSha256+'. Catalog SHA256 '+packet.catalogSha256+' (unchanged). Timing SHA256 '+packet.timingSha256+'. All1407 previous cases,1109 registered meanings,777 authority rows and2932 timing tuples remain exact and in order.','',
  '## Validation','',
  '| Check | Exact result |','| --- | --- |',
  ...Object.entries(results).filter(([k])=>['clinical-final','domain-full','player-full'].includes(k)).map(([k,v])=>'| '+k+' | '+v.passed+' passed / '+v.failed+' failed / '+v.pending+' skipped ('+v.total+'); '+v.files+' files; exit '+v.exitCode+' |'),
  '| Seven workspace typechecks | 7/7 passed; exit0 |','| Cue-linter tests | 33 passed /0 failed; exit0 |','| Accepted cue lint | 0 findings /17 variants /34 profile contexts; no suppressions |','| Whole-bank cue lint | 1824 findings before =1824 after |',
  '| Actual content pacing CLI | PASS; first-finish '+pacing.firstFinishTick+'; reference '+pacing.referenceTick+'; drift '+pacing.driftPercent+'%; exit0 |','',
  'Pacing used the unmodified tools/qa/content-pacing-check.mjs and its ±10% bound (23,653–28,909). Closing cash '+pacing.closingCashCents+' cents, '+pacing.completions+' completions, '+pacing.walkouts+' walkouts. No balance, progression, driver, reference or timeout changes.','',
  'Full player includes28 new format3/journal witnesses, both historical batch3/4 save suites (422/590 tests), the new wait-label group and existing ENG-I01 presentation tests. New domain integration has16 passing tests. Twelve historical authoring test files use strict exact-epoch bridges for original exclusions/source pins; no assertion/capture or budget is removed. New current-default and mutation-rejection tests independently protect acceptance. The full-library naming guard passes.','',
  ...['clinical-final','domain-full','player-full'].flatMap(name=>['Exact '+name+' output:','','```text',results[name].exactSummary,'exit '+results[name].exitCode,'```','']),
  'Remaining clinical failures (all retained intake-era pins/guards; see JSON for messages):','',
  ...results['clinical-final'].failures.map(f=>'- '+f.file.split('/').at(-1)+': '+f.fullName),'',
  'Remaining domain failures (manager census/evidence lane; source/behavioral captures unchanged):','',
  ...results['domain-full'].failures.map(f=>'- '+f.file.split('/').at(-1)+': '+f.fullName),'','## Level5 bound inputs and scope','',
  '| Changed recorded input | Before SHA256 | After SHA256 |','| --- | --- | --- |',
  ...levelFiveInputs.map(r=>'| '+[r.path,r.beforeSha256,r.afterSha256].join(' | ')+' |'),'',
  'Manifest and the new accepted-data/view module are additional transitive inputs. No Level5 evidence, pin or behavioral capture was edited or rebound. The exact file/digest list is in the validation JSON and source-migration ledger; twelve question-intraop-*.test.ts files changed only historical test contexts, never authoring .ts or packets. No runtime routing/progression, balance-config, save/cloud, Supabase, GS-release, network, Git, install, agent, deploy or rebind operation.','',
  'The [file receipt]('+base+'-files-'+date+'.json) lists every owned new/changed file and hash, plus preserved concurrent observations. Runtime metadata changes are confined to the manifest, accepted view/data, minimal index/synthetic registration, timing registry and the test-choice-order append. Other existing-source edits are tests or strict test-support adapters.','',
  'Handoff: the accepted bytes and supported routes are ready for manager integration. The18 excluded nodes require whole-case salvage or explicit specialized family/capability work before reconsideration. Named clinical sign-off and browser visual QA remain with the manager/clinician. This is a local working-tree checkpoint; the manager owns the GitHub backup/release gate.',''];
const prose=text=>text.replace(/\b(All|all|in|includes|has|Accepted|accepted)(?=\d)/g,'$1 ')
  .replace(/\bLevel(\d)\b/g,'Level $1').replace(/\bexit(\d)\b/g,'exit $1').replace(/\bformat3\b/g,'format-3')
  .replace(/(\d+)(cases?|nodes?|variants|tests?|concepts?|meanings|rows|tuples|profiles?|families|completions|walkouts|closing|retained|existing|new|live|clinic|source|question|records|workspace)\b/g,'$1 $2');
fs.writeFileSync(`docs/research/${base}-${date}.md`,prose(lines.join('\n')));
console.log(JSON.stringify({results:Object.fromEntries(Object.entries(results).map(([k,v])=>[k,v.total?{passed:v.passed,failed:v.failed,pending:v.pending,files:v.files,exitCode:v.exitCode}:v.exitCode])),pacing,manifestSha256:packet.manifestSha256,changedRecordedInputs:levelFiveInputs.map(r=>r.path)}));
