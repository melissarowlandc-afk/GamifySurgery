import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';

const root='docs/research/question-topic-acceptance-batch7';
const logs='.local-dev/question-topic-acceptance-batch7-20261112/';
const text=p=>{const b=fs.readFileSync(p);return (b[0]===255&&b[1]===254?b.toString('utf16le'):b.toString('utf8')).replace(/^\uFEFF/,'');};
const read=p=>JSON.parse(text(p));
const hash=b=>createHash('sha256').update(b).digest('hex');
const digest=v=>hash(JSON.stringify(v));
const write=(p,v)=>fs.writeFileSync(p,typeof v==='string'?v:JSON.stringify(v,null,2)+'\n');
const table=(headers,rows)=>['| '+headers.join(' | ')+' |','| '+headers.map(()=>'---').join(' | ')+' |',...rows.map(r=>'| '+r.map(x=>String(x??'').replaceAll('|','\\|').replace(/\r?\n/g,' ')).join(' | ')+' |')].join('\n');
const packet=read(root+'-packet-20261112.json');
const before=read('tools/question-quality/fixtures/question-topic-acceptance-batch7-before-20261112.json');
const disposition=read(root+'-dispositions-20261112.json');
const migration=read('tools/question-quality/fixtures/question-topic-acceptance-batch7-source-migration-20261112.json');
function result(name){
  const r=read(logs+name+'.json'),log=text(logs+name+'.log');
  return {name,command:log.split(/\r?\n/).find(l=>/^> vitest run/.test(l))?.slice(2),
    cwd:name.startsWith('domain')?'packages/game-domain':name.startsWith('player')?'apps/player':'packages/clinical-content',
    nativeExitCode:read(logs+name+'-exit.json').exitCode,passed:r.numPassedTests,failed:r.numFailedTests,skipped:r.numPendingTests,total:r.numTotalTests,files:r.testResults.length,
    duration:log.split(/\r?\n/).find(l=>/^\s*Duration\s/.test(l))?.trim(),reportPath:logs+name+'.json',logPath:logs+name+'.log',
    failures:r.testResults.flatMap(f=>f.assertionResults.filter(a=>a.status==='failed').map(a=>({file:f.name,title:a.fullName,messages:a.failureMessages}))),
    collectionFailures:r.testResults.filter(f=>f.status==='failed'&&!f.assertionResults.length).map(f=>({file:f.name,message:f.message})),
    perFile:r.testResults.map(f=>({file:f.name,passed:f.assertionResults.filter(a=>a.status==='passed').length,failed:f.assertionResults.filter(a=>a.status==='failed').length,
      assertions:f.assertionResults.map(a=>({title:a.fullName,status:a.status}))})),
    logSha256:hash(fs.readFileSync(logs+name+'.log'))};
}
const runs=Object.fromEntries(['clinical-final','domain-final','player-second','player-batch5','domain-focused'].map(n=>[n,result(n)]));
const earlierRuns=['focused-initial','focused-second','focused-final','clinical-initial','domain-initial','player-initial'].map(result);
const oldClinical=read('.local-dev/question-flag-d97aa716-round2-20261112/clinical-full.json').testResults.flatMap(f=>f.assertionResults.filter(a=>a.status==='failed').map(a=>a.fullName));
const domainBaselinePath='.local-dev/question-topic-acceptance-batch6-20261112/domain-final.json';
const oldDomain=read(domainBaselinePath).testResults.flatMap(f=>f.assertionResults.filter(a=>a.status==='failed').map(a=>a.fullName));
assert(runs['clinical-final'].failures.every(f=>oldClinical.includes(f.title)),'No new clinical failure title');
assert(runs['domain-final'].failures.every(f=>oldDomain.includes(f.title)),'No new domain failure title');
assert.equal(runs['player-second'].failed+runs['player-batch5'].failed,0);
const typeLog=text(logs+'typecheck-final.log').replace(/\r\n/g,'\n');
const headers=[...typeLog.matchAll(/^> (@.*) typecheck$/gm)];assert.equal(headers.length,7);
const typecheck={command:'npm.cmd run typecheck',nativeExitCode:read(logs+'typecheck-final-exit.json').exitCode,logPath:logs+'typecheck-final.log',
  workspaces:headers.map((h,i)=>({workspace:h[1],passed:!/: error TS\d+/.test(typeLog.slice(h.index,headers[i+1]?.index??typeLog.length))})),diagnostics:typeLog.split('\n').filter(l=>/: error TS\d+/.test(l)),logSha256:hash(fs.readFileSync(logs+'typecheck-final.log'))};
assert(typecheck.workspaces.every(w=>w.passed));
const lintLog=text(logs+'lint-tests.log');assert.match(lintLog,/pass 33/);assert.match(lintLog,/fail 0/);
const focusedNames=['question-program-batch7-acceptance-20261112.test.ts','question-ship-retirements.test.ts','question-ship-manifest.test.ts','question-program-batch6-acceptance-20261112.test.ts','question-flag-d97aa716-20261112.test.ts','question-flag-d97aa716-round2-20261112.test.ts','patient-library-wording-repair.test.ts','answer-choice-timing.test.ts','pilot-content.test.ts','playable-patient-narrative.test.ts'];
const focused=runs['clinical-final'].perFile.filter(f=>focusedNames.some(n=>f.file.endsWith('/'+n)));
assert.equal(focused.length,10);assert(focused.every(f=>f.failed===0));
const validation={checkedOn:'2026-11-12',runs,earlierRuns,typecheck,
  focusedClinical:{extractedFromFullRun:runs['clinical-final'].reportPath,files:10,passed:focused.reduce((n,f)=>n+f.passed,0),failed:0,perFile:focused},
  focusedPlayer:{disjointRuns:['player-second','player-batch5'],passed:runs['player-second'].passed+runs['player-batch5'].passed,failed:0,files:9},
  cueTests:{command:'npm.cmd run clinical:lint:test',passed:33,failed:0,nativeExitCode:read(logs+'lint-tests-exit.json').exitCode,logPath:logs+'lint-tests.log'},
  baseline:{clinicalAllRemainingTitlesPreviouslyFailed:true,clinicalSource:'.local-dev/question-flag-d97aa716-round2-20261112/clinical-full.json',domainAllRemainingTitlesPreviouslyFailed:true,domainSource:domainBaselinePath},
  counts:packet.counts,manifestSha256:packet.manifestSha256,defaultSha256:packet.defaultSha256,levelFiveInputs:packet.levelFiveInputs,
  environment:{CI:'1',NODE_NO_WARNINGS:'1',pool:'threads',maxWorkers:2,playerPreload:'tools/question-quality/adversarial-r5-player-preload-20261102.cjs'},
};
write(root+'-validation-20261112.json',validation);
const groups=['statistics','ethics-professionalism','ostomy-enterocutaneous-fistula','quality-safety-systems','d97aa716'];
const acceptedRows=packet.accepted.map(r=>[r.sourceView.replace('topic-batch7-',''),r.nodeId,r.questionVariantId,r.reviewStatus]);
const confirmations=read(root+'-clinical-confirmations-20261112.json').records;
const approvalRows=confirmations.map(r=>[r.ownerId,r.questionVariantId,r.contentVersion,r.scope==='full'?'clinically_approved':'key only; needs_clinician_review',r.correctChoiceId]);
const totals=groups.map(g=>[g,packet.accepted.filter(r=>r.sourceView==='topic-batch7-'+g).length,packet.skipped.filter(r=>r.topic===g).length]);
const prior=packet.counts.before,after=packet.counts.after;
const countRows=[['Cases',prior.cases,after.cases],['Scored nodes',prior.nodes,after.nodes],['Registered meanings',prior.registeredMeanings,after.meanings],['Scored meanings',prior.scoredMeanings,after.scoredMeanings],['Authority rows',prior.acceptedRows,after.acceptedRows],['Timing tuples',prior.timingRows,after.timingRows]];
const fileList=migration.files.map(r=>[r.path,r.beforeSha256,r.afterSha256]);
const residuals=read(root+'-source-freeze-20261112.json').records
  .map(r=>{const q=JSON.parse(r.sourceQuestionJson),key=q.answerChoices.find(c=>c.isCorrect),other=Math.max(...q.answerChoices.filter(c=>!c.isCorrect).map(c=>c.label.length));return {id:q.id,key:key.label.length,other};}).filter(r=>r.key>r.other);
const doc=[
  '# Topic program acceptance batch 7 - 2026-11-12','',
  '**Accepted 82 scored nodes in 73 source cases; skipped five requested PASS nodes.** Thirty-seven patient cases and 36 staff-discussion cases pass native runtime probes. The 73 include 71 new default case identities plus the two D97 legacy-node overrides. All 82 accepted variants remain needs_clinician_review. No editorial PASS is represented as clinical approval.','',
  table(['Topic','Accepted nodes','Skipped PASS nodes'],totals),'',
  'The manager decision is implemented at the projection boundary. The [packet](question-topic-acceptance-batch7-packet-20261112.json) records each node, source/review/hash, runtime probe, timing tuple and key-first review-only projection. Runtime options shuffle. The [source archive](question-topic-acceptance-batch7-source-freeze-20261112.json) retains the reviewed serializations and source/review file hashes. No question-topic-* or question-owner-decisions-20261112.* file was edited.','',
  '## Accepted exact versions','',table(['Topic','Node','Question variant','Review status'],acceptedRows),'',
  '## Skipped and excluded','',
  table(['PASS question','Reason'],packet.skipped.map(r=>[r.questionVariantId,r.questionVariantId.includes('return-to-duties')?'The frozen PASS node is in the original two-node colleague case, but the fixed current case omits it and updates its preceding node under the same draft ID. No new composed or standalone context was manufactured.':r.questionVariantId.includes('minor-nonurgent')||r.questionVariantId.includes('child-protective')?'Current native admission rejects the case: compatible explicit pediatric demographics and child art are missing. The source file was not altered.':'Its retained-review case also scores the returned RCA node. Whole-case acceptance forbids accepting those two PASS companions separately.'])),'',
  'Excluded final non-PASS identities (review3fix takes precedence for exact IDs):','',
  table(['Topic','Question','Final verdict'],packet.nonpass.map(r=>[r.topic,r.record.id,r.record.verdict])),'',
  'D97-3 is dropped. The currently live calf v1 fallback remains unchanged; its discarded v3 is not accepted. The calf compartment-evidence/curricular-scope issue remains open. D97-1 and D97-2 replace fresh v1.r4 and v2.r4 with exact reviewed v1.r6/v2.r6. Their preceding MRI nodes, key/choice identities and shared concept remain exact.','',
  'D97-2 has exactly three non-player metadata corrections: packet selfCheck.sourceClosure, evidenceMapping[0].type and its matching ledger field now identify the arm/biceps/triceps evidence. The [correction ledger](../../tools/question-quality/fixtures/question-topic-acceptance-batch7-d97-metadata-correction-20261112.json) binds old/new values. No reviewed stem, option, key, explanation or clinical node changed.','',
  '## Owner clinical review and holds','',
  'All confirmations are by **Melissa Rowland (clinical sign-off), 2026-11-12**, recorded against the exact question ID, authored contentVersion, original-question hash, reviewed runtime-node hash and key. Seventeen exact versions receive clinically_approved and lastClinicianReview using the existing AuthoredClinicalRecord fields. Five key-only versions receive the named review but remain needs_clinician_review. The public questionProgramBatch7ClinicalReview lookup and reviewed-question exports provide this overlay; immutable source archives retain their historical status.','',
  'These versions were already in default supply; the holds were review/source questions, not separate runtime admission rows. Full-scope clinical confirmation resolves the review hold for that exact version. Key-only confirmation does not approve its stem or the later owner-decisions successor. Claims, concepts, profiles, unlisted siblings and all newly accepted batch-7 versions are not promoted. No source or clinical prose was added.','',
  table(['Owner reference','Exact question','Content version','Recorded scope/status','Confirmed choice'],approvalRows),'',
  'The [clinical-confirmation ledger](question-topic-acceptance-batch7-clinical-confirmations-20261112.json) records scope and hold resolution. TOPIC-034/069/120/313 and N3-ASPIRATION-ROUTE remain key-only. Neither easy G04 nor an owner-decisions successor was accepted or retired here.','',
  '## Retirements and history','',
  table(['Owner reference','Case withheld from fresh supply','Exact retired question'],disposition.ownerRetirements.map(r=>[r.ownerId,r.caseId,r.questionVariantId])),'',
  'The manifest now supports explicit standalone retirement with a complete exact question-binding list, manager decision and reason. An optional successor must be present as a complete accepted case before a conditional retirement applies. Duplicate, changed, missing or unaccepted bindings warn and preserve the prior case. Retirement is projection-only: no domain acceptance gate, save-format change or FSRS mutation. Existing replacement/consolidation relations and all prior authority rows remain.','',
  'No round-3 proposal naming a currently fresh predecessor has an accepted successor in this batch. Their predecessor drafts are already outside fresh supply or their successor was not accepted. The [disposition ledger](question-topic-acceptance-batch7-dispositions-20261112.json) records every proposal and why no additional retirement applies. No arbitrary deletion or history migration occurred.','',
  'Three retired and two overridden prior live cases reopen and complete from real format-3 saves and committed journals under the new default, retaining their original frozen questions and FSRS identities. The batch-5 and batch-6 save suites retain their original assertions against the strict pre-batch7 epoch; the batch-7 witnesses test the later current retirement behavior.','',
  '## Runtime waits, naming and lint','',
  '**All 13 required wait/order bindings are installed; remaining bindings: zero.** They use existing timing profiles and future_planned dispositions, with no physical service execution or fixed durations added to clinical prose. The registry change is a single import/spread in test-choice-orders.ts, preserving every old tuple.','',
  table(['Node','Testing choice ID','Choice','Existing profile','State'],packet.waitBindings.map(r=>[r.nodeId,r.choiceId,r.choiceLabel,r.timingProfileId,'installed; future_planned'])),'',
  'All new accepted patient-facing fields already use runtime name placeholders, so no name/pronoun substitution was needed. Explicit child profiles/art/parent admission are verified for accepted pediatric cases; the two inadmissible QI child cases are withheld. The complete naming guard passes.','',
  'Raw cue lint: **0 findings across 82 target versions / 170 patient-profile contexts**, with zero suppression. Four inherited advisories remain in the two untouched preceding D97 MRI questions. Whole-bank raw findings change from '+packet.lint.beforeWholeBank.findings+' to '+packet.lint.wholeBank.findings+'. [Detailed lint](../../tools/question-quality/question-topic-acceptance-batch7-lint-20261112.json) retains exact fields and phrases.','',
  residuals.length+' independently PASSed new versions have a raw-character longest-key residual. The existing narrow guard now binds each exact residual, actual lengths, authority and complete frozen case hash. No option was padded or reworded, and no general disparity threshold was relaxed. Staff-profile and source-view membership assertions use exact accepted definitions. The narrative verb guard adds the reviewed verb “tracks”; all other story/name checks remain.','',
  '## Counts and hashes','',table(['Measure','Before','After'],countRows),'',
  'Manifest: question-ship.2026-11-12.v16. SHA256: '+packet.manifestSha256+'. Default SHA256: '+packet.defaultSha256+'. Catalog SHA256 (unchanged): '+packet.catalogSha256+'. Timing archive SHA256: '+packet.timingSha256+'.','',
  table(['Source view','Cases','Scored nodes (including preserved context)','SHA256'],packet.sourceViews.map(r=>[r.name,r.cases,r.nodes,r.sha256])),'',
  'Every unrelated default case and all 1,039 previously registered meanings retain exact serialized values. The new registry adds 66 meanings; the three removed fresh meanings remain registered for historical saves. No stable concept ID or frozen choice order is reset.','',
  '## Validation','',
  table(['Check','Exact output / native exit'],[
    ['Full clinical-content',runs['clinical-final'].passed+' passed / '+runs['clinical-final'].failed+' failed / '+runs['clinical-final'].skipped+' skipped ('+runs['clinical-final'].total+' total); '+runs['clinical-final'].files+' files; exit '+runs['clinical-final'].nativeExitCode],
    ['Full game-domain',runs['domain-final'].passed+' passed / '+runs['domain-final'].failed+' failed / '+runs['domain-final'].skipped+' skipped ('+runs['domain-final'].total+' total); '+runs['domain-final'].files+' files; exit '+runs['domain-final'].nativeExitCode],
    ['Focused membership/source/naming checks (extracted from full clinical)',validation.focusedClinical.passed+' passed / 0 failed; 10 files'],
    ['Domain ship-gate focused',runs['domain-focused'].passed+' passed / 0 failed; exit 0'],
    ['Focused player',validation.focusedPlayer.passed+' passed / 0 failed; 9 files (178 + 47 disjoint tests); exit 0 for both runs'],
    ['Root typecheck','7/7 workspaces passed; exit 0'],['Cue linter tests','33 passed / 0 failed; exit 0'],
  ]),'',
  'All Vitest commands use npm.cmd with --pool=threads --maxWorkers=2. Player commands use the existing preload. The [validation receipt](question-topic-acceptance-batch7-validation-20261112.json) records actual commands, native exits, complete failure messages, log hashes and the earlier failing runs. Final full clinical verifies all 92 focused checks, including naming; the earlier focused report predates the final verb correction.','',
  'Concurrent cloud/performance source hashes are recorded as an observational snapshot. One such hash changed during final report checking. That snapshot is kept separate from authority checks: all reviewed bytes, source inputs, manifest/default hashes, runtime probes, scoped postimages and lint results remain exact. No concurrent file was edited or restored.','',
  'All remaining clinical and domain failure titles were present in the prior recorded baselines. Clinical has ten existing source/review-pin failures. Domain has 26 Level 5 evidence/input/behavioral guards and the pre-existing explicit concept-census assertion. No evidence, pin, behavioral artifact, timeout, progression code or balance expectation was changed to hide them.','',
  table(['Remaining clinical file','Test'],runs['clinical-final'].failures.map(r=>[r.file.replace(/^.*\/src\//,''),r.title])),'',
  table(['Remaining domain file','Test'],runs['domain-final'].failures.map(r=>[r.file.replace(/^.*\/tests\//,''),r.title])),'',
  '## Changed files and Level 5 inputs','',
  'Existing source edits (all captured preimages and exact authorized postimages are in the [migration ledger](../../tools/question-quality/fixtures/question-topic-acceptance-batch7-source-migration-20261112.json)):','',
  table(['Existing path','Before SHA256','After SHA256'],fileList),'',
  'New files and hashes are listed in the [file receipt](question-topic-acceptance-batch7-files-20261112.json). The shared handoff is append-only. Topic files, concurrent owner-decisions files, balance/progression, session/cloud, Supabase, evidence and GS-release were not edited.','',
  table(['Changed recorded Level 5 input','Before SHA256','After SHA256'],packet.levelFiveInputs.map(r=>[r.path,r.beforeSha256,r.afterSha256])),'',
  'Those four are the paths present in the existing Level 5 input map. The manifest/projector changes and new accepted-view/retirement modules are additional transitive inputs for the manager’s later binding. No Level 5 rebind or behavioral-evidence refresh was performed.','',
  '## Handoff and open work','',
  'Manager next: inspect the five skipped PASS contexts and the dropped calf boundary; coordinate any salvage as new reviewed source contexts. Retain the named approvals only for their exact versions. Resolve the pre-existing source/census failures and run the Level 5 rebind in the release lane. No new question batch or owner-decisions acceptance was started.','',
  'No Git, install, network, agent, external message, deployment or release-tree write. This is a local working-tree checkpoint; the manager owns integration and the “push to GitHub” backup gate. Owner launch/origin is unchanged.','',
].join('\n');
write(root+'-20261112.md',doc);
console.log(JSON.stringify({handoff:root+'-20261112.md',clinical:[runs['clinical-final'].passed,runs['clinical-final'].failed],domain:[runs['domain-final'].passed,runs['domain-final'].failed],player:validation.focusedPlayer,focused:validation.focusedClinical.passed,accepted:packet.accepted.length,residuals:residuals.length}));
