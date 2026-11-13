import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const base='question-topic-acceptance-batch8',root='docs/research/'+base,logs='.local-dev/'+base+'-20261112/';
const text=p=>{const b=fs.readFileSync(p);return (b[0]===255&&b[1]===254?b.toString('utf16le'):b.toString('utf8')).replace(/^\uFEFF/,'');};
const read=p=>JSON.parse(text(p)),sha=b=>createHash('sha256').update(b).digest('hex');
const write=(p,v)=>fs.writeFileSync(p,typeof v==='string'?v:JSON.stringify(v,null,2)+'\n');
const table=(h,rows)=>['| '+h.join(' | ')+' |','| '+h.map(()=>'---').join(' | ')+' |',...rows.map(r=>'| '+r.map(v=>String(v??'').replaceAll('|','\\|').replace(/\r?\n/g,' ')).join(' | ')+' |')].join('\n');
const packet=read(root+'-packet-20261112.json'),before=read('tools/question-quality/fixtures/'+base+'-before-20261112.json');
const migration=read('tools/question-quality/fixtures/'+base+'-source-migration-20261112.json');
const disposition=read(root+'-dispositions-20261112.json');
const oldClinical=read('.local-dev/question-topic-acceptance-batch7-20261112/clinical-final.json');
const oldDomain=read('.local-dev/question-topic-acceptance-batch7-20261112/domain-final.json');
const titles=r=>r.testResults.flatMap(f=>f.assertionResults.filter(a=>a.status==='failed').map(a=>a.fullName));
function result(name){
 const r=read(logs+name+'.json'),log=text(logs+name+'.log');
 return {name,command:log.split(/\r?\n/).find(l=>/^> vitest run/.test(l))?.slice(2),
  nativeExitCode:read(logs+name+'-exit.json').exitCode,total:r.numTotalTests,passed:r.numPassedTests,
  failed:r.numFailedTests,skipped:r.numPendingTests,files:r.testResults.length,
  duration:log.split(/\r?\n/).find(l=>/^\s*Duration\s/.test(l))?.trim(),
  reportPath:logs+name+'.json',logPath:logs+name+'.log',logSha256:sha(fs.readFileSync(logs+name+'.log')),
  failures:r.testResults.flatMap(f=>f.assertionResults.filter(a=>a.status==='failed').map(a=>({file:f.name,title:a.fullName,
   messages:a.failureMessages,classification:(name.startsWith('clinical')?titles(oldClinical):titles(oldDomain)).includes(a.fullName)?'recorded_batch7_baseline':
    /question-intraop-/.test(f.name)?'concurrent_intraop_lane':name.startsWith('domain')&&/(?:game-domain|level-five-launch|level-five-rooms)\.test\.ts$/.test(f.name)?'balance_progression_lane':'requires_scoped_review'}))),
  collectionFailures:r.testResults.filter(f=>f.status==='failed'&&!f.assertionResults.length).map(f=>({file:f.name,message:f.message})),
  perFile:r.testResults.map(f=>({file:f.name,passed:f.assertionResults.filter(a=>a.status==='passed').length,
   failed:f.assertionResults.filter(a=>a.status==='failed').length})),
 };
}
const runs=Object.fromEntries(['clinical-final','domain-final','domain-focused','player-final'].map(n=>[n,result(n)]));
assert(runs['clinical-final'].failures.every(r=>r.classification==='recorded_batch7_baseline'));
assert(runs['domain-final'].failures.every(r=>r.classification==='recorded_batch7_baseline'));
const typeLog=text(logs+'typecheck-current.log').replace(/\r\n/g,'\n');
const headers=[...typeLog.matchAll(/^> (@.*) typecheck$/gm)];assert.equal(headers.length,7);
const diagnostics=typeLog.split('\n').filter(l=>l.includes('error TS'));
const typecheck={command:'npm.cmd run typecheck',nativeExitCode:read(logs+'typecheck-final-exit.json').exitCode,
 logPath:logs+'typecheck-final.log',diagnostics,logSha256:sha(fs.readFileSync(logs+'typecheck-final.log')),
 workspaces:headers.map((h,i)=>({workspace:h[1],passed:!typeLog.slice(h.index,headers[i+1]?.index??typeLog.length).includes('error TS')}))};
const focusedNames=['question-program-batch8-acceptance-20261112.test.ts','question-program-batch7-acceptance-20261112.test.ts',
 'question-ship-manifest.test.ts','answer-choice-timing.test.ts','pilot-content.test.ts','patient-library-wording-repair.test.ts','playable-patient-narrative.test.ts'];
const focused=runs['clinical-final'].perFile.filter(f=>focusedNames.some(n=>f.file.endsWith('/'+n)));
assert.equal(focused.length,7);assert(focused.every(f=>f.failed===0));assert.equal(runs['player-final'].failed,0);
const lintLog=text(logs+'lint-tests.log');assert.match(lintLog,/pass 33/);assert.match(lintLog,/fail 0/);
const validation={checkedOn:'2026-11-12',runs,typecheck,
 focusedClinical:{extractedFrom:runs['clinical-final'].reportPath,files:7,passed:focused.reduce((n,f)=>n+f.passed,0),failed:0,perFile:focused},
 cueTests:{command:'npm.cmd run clinical:lint:test',passed:33,failed:0,nativeExitCode:read(logs+'lint-tests-exit.json').exitCode,
  logPath:logs+'lint-tests.log',logSha256:sha(fs.readFileSync(logs+'lint-tests.log'))},
 earlierRuns:['clinical-focused-initial','clinical-focused-second','clinical-full','domain-full','player-initial'].map(result),
 baseline:{clinical:{passed:oldClinical.numPassedTests,failed:oldClinical.numFailedTests,skipped:oldClinical.numPendingTests},
  domain:{passed:oldDomain.numPassedTests,failed:oldDomain.numFailedTests,skipped:oldDomain.numPendingTests}},
 counts:packet.counts,manifestSha256:packet.manifestSha256,defaultSha256:packet.defaultSha256,levelFiveInputs:packet.levelFiveInputs,
 environment:{CI:'1',NODE_NO_WARNINGS:'1',pool:'threads',maxWorkers:2,
  playerPreload:'tools/question-quality/adversarial-r5-player-preload-20261102.cjs'}};
write(root+'-validation-20261112.json',validation);
const summaries={
 B2B32:'Plain anion-gap calculation and qualitative albumin effect; no correction arithmetic.',
 B2B34:'Plain-gap trend and qualitative albumin interpretation; retire the additional correction-dependent topic predecessor.',
 G02:'MH preparation moves into the answer choices rather than being supplied before the task.',
 'G02-NEW':'New medication-readiness item explicitly requested by Melissa: dantrolene.',
 'TOPIC-060':'Spells out total mesorectal excision and explains LAR/APR as TME operations.',
 'TOPIC-034':'Smooth postoperative surveillance wording; ileocolonoscopy key retained.',
 'TOPIC-069':'Explicit paraesophageal hernia and reflux-control decision; exact reviewed one-node replacement.',
 'G04-R':'Consequential pregnancy localization/disposition despite falling hCG; easy serum-hCG predecessor withheld.',
 F13:'Explicit suspected awake hypoventilation context; ABG key with sleep-test competitors. Easy screening item remains.',
 G07:'Excisional lymph-node sampling with fresh/fixed specimen allocation; stable harder-draft concept version as declared.',
};
const beforeCounts=packet.counts.before,after=packet.counts.after;
const checks=[['Full clinical-content',runs['clinical-final']],['Full game-domain',runs['domain-final']],['Focused player',runs['player-final']]]
 .map(([label,r])=>[label,`${r.passed} passed / ${r.failed} failed / ${r.skipped} skipped (${r.total}); ${r.files} files; exit ${r.nativeExitCode}`]);
checks.push(['Focused domain question-gate/order inventory',runs['domain-focused'].passed+' passed / '+runs['domain-focused'].failed+' failed; three files'],['Focused clinical/naming (from full run)',validation.focusedClinical.passed+' passed / 0 failed; seven files'],
 ['Seven typechecks',typecheck.workspaces.filter(w=>w.passed).length+'/7 passed; exit '+typecheck.nativeExitCode],['Cue linter tests','33 passed / 0 failed; exit 0']);
const doc=[
 '# Topic program acceptance batch 8 - 2026-11-12','',
 '**Accepted all ten requested exact PASS versions; skipped none.** All remain needs_clinician_review with lastClinicianReview null. Melissa Rowland\'s direction on 2026-11-12 is bound to each exact question version/hash, not represented as named approval of its successor wording. No source-authoring file was edited.','',
 '## Accepted versions and owner direction','',
 table(['Owner reference','Exact accepted question','Final review','Direction applied'],packet.accepted.map(r=>[r.id,r.questionVariantId,r.review.path,summaries[r.id]])),'',
 'The [packet](question-topic-acceptance-batch8-packet-20261112.json) contains before/after fields, key-first review-only options, explanations, claim mappings, original author rubric, final review, native admission and raw lint. Runtime options remain randomized. The [source freeze](question-topic-acceptance-batch8-source-freeze-20261112.json) preserves exact reviewed question/node/case serializations and all source/review hashes. Current clinical fields already use the runtime patient-name placeholders; zero naming/pronoun corrections were needed.','',
 '## Fresh projection and preserved history','',
 'Ten exact authority rows replace five superseded authority rows, giving a net addition of five. Legacy bindings and every unrelated row remain exact. The prior rows and complete pre-batch8 manifest remain archived. The reflux successor is the reviewed complete one-node case; its prior two-node encounter, including the earlier symptomatic-hernia decision, is retained for saves rather than merged into a new unreviewed context.','',
 'Two existing four-to-one topic consolidations now target the accepted MH and rectal successors. Their eight original legacy cases remain withheld from fresh play; the case lists and manager decisions are unchanged. This avoids invalidating the consolidation when its earlier target authority row is superseded.','',
 table(['Consolidation','Previous target','Accepted target'],packet.retargetedConsolidations.map(r=>[r.before.id,r.before.with,r.after.with])),'',
 table(['Additional retired case','Exact old question(s)','Condition'],packet.retirements.map(r=>[r.caseId,r.questionVariantIds.join(', '),r.replacementQuestionVariantId?'Accepted successor '+r.replacementQuestionVariantId:'Owner 2026-11-12: no neonatal clinical framing'])),'',
 'G04-R replaces the easy serum-hCG question through its exact same-case/node override; the easy question is absent from fresh supply. The additional corrected-gap topic case retires only when its complete accepted successor exists. F13\'s harder draft predecessors were not fresh at intake; its new awake-ventilation case is added, while the distinct easy validated-screening question remains.','',
 'Nineteen exact prior cases are retained: nine current predecessor cases (including the gap duplicate and paired reflux case), two neonatal cases, and eight already-consolidated legacy cases. Real format-3 save and committed-journal witnesses reopen and complete all 19 under the new default, using their original question and concept IDs, randomized frozen choice order and existing FSRS histories. No save schema, selector, routing or learning-history mutation was added.','',
 'The reviewed packet explicitly declares concept-version/meaning changes for the gap items, G04-R and G07, and introduces the new dantrolene concept. Its exact harder-draft IDs are used. All 1,105 prior runtime concept records and their order remain exact, including historical meanings no longer used in fresh supply. Four missing IDs are added: dantrolene readiness, pregnancy localization, awake-ventilation assessment and PTLD specimen handling. The existing corrected-gap ID is retained, with the owner-directed authored concept version preserved in the frozen source export. No new concept ID was invented here.','',
 '## Runtime waits and cue checks','',
 '**Twelve new exact testing-choice bindings are installed; remaining bindings: zero.** All use existing profiles and source-proposed future_planned dispositions; no fixed duration is added to authored prose or new balance profile created.','',
 table(['Node','Choice ID','Testing choice','Existing wait profile'],packet.waitBindings.map(r=>[r.nodeId,r.choiceId,r.choiceLabel,r.timingProfileId])),'',
 'Withdrawing a fresh authority row must not withdraw its frozen waits. Five historical timing tuples are restored at their original offsets, and nine original order records are retained with exact deduplication/conflict checks. Every previous timing tuple remains byte-for-byte equal in the original prefix; ten new classifications append. Domain integration is metadata only in test-choice-orders.ts, with no domain acceptance gate.','',
 'Raw target lint: **0 findings / 10 variants / 20 profile contexts**, no suppressions and no uniquely longest-key character residuals. Whole-bank raw findings: '+packet.lint.beforeWholeBank.findings+' -> '+packet.lint.wholeBank.findings+'. All ten candidates pass native existing-clinic admission and have complete source question metadata. Source reports and the full-library naming guard remain in validation.','',
 '## Counts and hashes','',
 table(['Measure','Before','After'],[['Default cases',beforeCounts.cases,after.cases],['Scored nodes',beforeCounts.nodes,after.nodes],
 ['Registered meanings',beforeCounts.meanings,after.meanings],['Scored meanings',beforeCounts.scoredMeanings,after.scoredMeanings],
 ['Manifest authority rows',beforeCounts.acceptedRows,after.acceptedRows],['Timing archive rows',beforeCounts.timingRows,after.timingRows]]),'',
 'Manifest: question-ship.2026-11-12.v17. SHA256: '+packet.manifestSha256+'. Default SHA256: '+packet.defaultSha256+'. Catalog SHA256 (unchanged): '+packet.catalogSha256+'. Timing SHA256: '+packet.timingSha256+'.','',
 '## Validation and remaining failures','',table(['Check','Exact result'],checks),'',
 'Vitest uses npm.cmd with --pool=threads --maxWorkers=2; player uses the existing preload. The [validation receipt](question-topic-acceptance-batch8-validation-20261112.json) includes native exits, commands, log hashes, all messages and the earlier failing runs. Raw logs are under .local-dev/question-topic-acceptance-batch8-20261112. No timeout, source capture or assertion budget was relaxed.','',
 'Every remaining clinical and domain failure title occurs in the recorded batch7 baseline. Clinical retains ten source/review-pin failures. Domain retains 26 Level 5 input/evidence/behavioral guards and the existing concept-census assertion. The initial balance/progression and concurrent intraop failures are absent from the final runs; those lanes were not edited here.','',
 table(['Clinical failure classification','File','Test'],runs['clinical-final'].failures.map(r=>[r.classification,r.file.split('/').pop(),r.title])),'',
 table(['Domain failure classification','File','Test'],runs['domain-final'].failures.map(r=>[r.classification,r.file.split('/').pop(),r.title])),'',
 'Typecheck diagnostics:','',...(diagnostics.length?diagnostics.map(s=>'- '+s):['No diagnostics.']),'',
 'Stale integration assertions were updated for the current source view/counts and exact archived timing tuples. Earlier acceptance and length-exception guards pass through a strict batch8 inverse that first verifies the complete current release/manifest/timing or exact source postimage, then restores its original captured epoch. Unrelated mutations still fail. The new batch8 tests independently verify the current authority, all source bytes, zero new cues, fresh retirements and unchanged unrelated cases/concepts. No question-topic-*, question-intraop-* or question-owner-decisions-* source/test was edited.','',
 '## Files, Level 5 and handoff','',
 'The [file receipt](question-topic-acceptance-batch8-files-20261112.json) lists every changed/new file and digest, strict before/after source migrations, and preserved out-of-lane observations. The shared thread handoff is append-only. Source claims and bibliography are reused exactly; no new clinical fact, citation or online verification was introduced.','',
 table(['Changed recorded Level 5 input','Before SHA256','After SHA256'],packet.levelFiveInputs.map(r=>[r.path,r.beforeSha256,r.afterSha256])),'',
 'The authority and new accepted-data/view modules are additional transitive inputs for the manager\'s rebind. No Level 5 evidence/pin/behavioral artifact was changed. No balance/progression, cloud/Supabase or GS-release edit.','',
 'Manager next: integrate this exact local checkpoint and coordinate any remaining baseline or concurrent-lane validation failures. New versions still require named clinical version approval; direction is not that approval. No next authoring batch was started. No Git, installs, network, agents, external messages, deployment or rebind. This work is local only; the manager owns the "push to GitHub" backup gate. Launch/origin unchanged.','',
].join('\n');
write(root+'-20261112.md',doc);
console.log(JSON.stringify({accepted:10,clinical:[runs['clinical-final'].passed,runs['clinical-final'].failed],
 domain:[runs['domain-final'].passed,runs['domain-final'].failed,runs['domain-final'].skipped],player:runs['player-final'].passed,
 typechecks:typecheck.workspaces.filter(w=>w.passed).length,ownedDiagnostics:diagnostics.filter(l=>!/question-intraop-/.test(l)).length}));
