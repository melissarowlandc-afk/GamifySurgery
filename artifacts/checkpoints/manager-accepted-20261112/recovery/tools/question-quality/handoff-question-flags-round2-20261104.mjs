// Scoped worker handoff; does not modify manager coordination or evidence.
import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const root='tools/question-quality/';
const json=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const text=p=>{const b=fs.readFileSync(p);return (b[0]===255&&b[1]===254?b.subarray(2).toString('utf16le'):b.toString('utf8')).replace(/\x1b\[[0-9;]*m/g,'');};
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
function failures(log){
 const rows=[];
 for(const block of log.split(/\r?\n[^\r\n]*\[\d+\/\d+\][^\r\n]*\r?\n/)){
  const lines=block.split(/\r?\n/),e=lines.findIndex(l=>/^(?:AssertionError|\w*Error):/.test(l));
  const error=e<0?null:lines.slice(e,e+3).filter(l=>l.trim()).join(' ').trim();
  const location=lines.find(l=>/tests\/[^\s]+:\d+:\d+/.test(l))?.trim()??null;
  for(let i=0;i<lines.length;i++)if(/^\s*FAIL\s/.test(lines[i])){
   let title=lines[i].trim();
   for(let k=i+1;k<lines.length&&lines[k].trim()&&!/^\s*FAIL\s|^(?:AssertionError|\w*Error):/.test(lines[k]);k++)title+=' '+lines[k].trim();
   const kind=/level-five-integration/.test(title)&&/binds the actual run/.test(title)?'level5_input_binding':
    /pre-M9 load.*level [\d+]+\/schema \d+/.test(title)?'legacy_loaded_state_hash':/Test timed out/.test(error??'')?'timeout':'requires_review';
   rows.push({title,kind,error,location});
  }
 }
 return rows;
}
function result(name){
 const path=root+name,log=fs.existsSync(path)?text(path):'';
 return {log:path,files:log.match(/^\s*Test Files\s+([^\r\n]+)/m)?.[1]?.trim()??null,
  tests:log.match(/^\s*Tests\s+([^\r\n]+)/m)?.[1]?.trim()??null,
  duration:log.match(/^\s*Duration\s+([^\r\n]+)/m)?.[1]?.trim()??null,failures:failures(log)};
}
const packet=json('docs/research/question-flags-round2-review-20261104.json');
const lint=json(root+'question-flags-round2-lint-20261104.json');
const scope=json(root+'question-flags-round2-verification-20261104.json');
const sources=json('docs/research/sources-question-flags-round2-20261104.json');
const control=json(root+'question-flags-round2-supply-control-20261104.json');
const snapshots=json(root+'question-flags-round2-snapshot-change-review-20261104.json');
const legacy=json(root+'question-flags-round2-legacy-diagnosis-20261104.json');
const results={
 clinical:result('question-flags-round2-clinical-clean-final-20261104.log'),
 domainFocused:result('question-flags-round2-domain-focused-clean-20261104.log'),
 domainIntegrationRepairs:result('question-flags-round2-domain-integration-repairs-20261104.log'),
 playerFocused:result('question-flags-round2-player-focused-clean-20261104.log'),
 domainInitial:result('question-flags-round2-domain-clean-20261104.log'),
 domain:result('question-flags-round2-domain-repaired-20261104.log'),
 player:result('question-flags-round2-player-clean-20261104.log'),
};
const lintLog=text(root+'question-flags-round2-lint-clean-20261104.log');
results.lint={log:root+'question-flags-round2-lint-clean-20261104.log',tests:lintLog.match(/^[^\r\n]*\btests (\d+)\s*$/m)?.[1],pass:lintLog.match(/^[^\r\n]*\bpass (\d+)\s*$/m)?.[1],fail:lintLog.match(/^[^\r\n]*\bfail (\d+)\s*$/m)?.[1]};
const typePath=root+'question-flags-round2-typecheck-integration-20261104.log';
const typeLog=fs.existsSync(typePath)?text(typePath):'';
results.typecheck={log:typePath,workspaces:[...typeLog.matchAll(/^> (@gamify-surgery\/\S+)@\S+ typecheck/gm)].map(m=>m[1]),errors:/error TS\d+|Lifecycle script.*failed/.test(typeLog)};
const complete=!!results.domain.tests&&!!results.player.tests;
const lockPath=root+'question-flags-round2-validation-domain-repaired-lock-20261104.json',lock=fs.existsSync(lockPath)?json(lockPath):{files:{}};
const changes=Object.entries(lock.files).filter(([p,h])=>hash(p)!==h).map(([path,previous])=>({path,previous,current:hash(path)}));
const playerLockPath=root+'question-flags-round2-validation-clean-lock-20261104.json',playerLock=json(playerLockPath);
const playerWindowChanges=Object.entries(playerLock.files).filter(([p,h])=>hash(p)!==h).map(([path,previous])=>({path,previous,current:hash(path)}));
const domainOnlyRepairs=['packages/game-domain/tests/gs028-20260928-batch.test.ts','packages/game-domain/tests/gs028-statistics-ethics-batch.test.ts'];
const categories=Object.fromEntries(['level5_input_binding','legacy_loaded_state_hash','timeout','requires_review'].map(kind=>[kind,results.domain.failures.filter(f=>f.kind===kind).length]));
if(process.argv.includes('--final')){
 assert(complete,'Full validation has not completed');assert.equal(changes.length,0,'Final validation inputs changed');
 assert.equal(results.clinical.tests,'778 passed (778)');assert.equal(results.domainFocused.tests,'1230 passed (1230)');
 assert.match(results.domainIntegrationRepairs.tests??'',/^\d+ passed \(\d+\)$/);
 assert.deepEqual(playerWindowChanges.map(c=>c.path).sort(),domainOnlyRepairs.slice().sort(),'Player run must have no monitored runtime/player input changes');
 assert.equal(results.playerFocused.tests,'79 passed (79)');assert.equal(results.player.tests,'3371 passed (3371)');
 assert.equal(results.lint.tests,'30');assert.equal(results.lint.pass,'30');assert.equal(results.lint.fail,'0');
 assert.equal(results.typecheck.workspaces.length,7);assert.equal(results.typecheck.errors,false);
 assert.equal(categories.level5_input_binding,1);assert.equal(categories.legacy_loaded_state_hash,25);
 assert.equal(categories.timeout,0);assert.equal(categories.requires_review,0);
 assert.equal(control.status,'passed');assert.equal(control.results.length,3);
 assert.equal(snapshots.results.reduce((n,r)=>n+r.snapshotCount,0),3);assert.equal(legacy.rows.length,25);
 assert.equal(scope.protectedChanges.length,0);
}
const failurePath=root+'question-flags-round2-domain-repaired-failures-20261104.json';
if(results.domain.tests)fs.writeFileSync(failurePath,JSON.stringify({checkedOn:'2026-11-04',log:results.domain.log,tests:results.domain.tests,categories,failures:results.domain.failures,
 limitation:'The input guard and legacy loaded-state hashes are distinct. The separate load control covers initial synthetic states only; continuation assertions after a failing initial hash do not run. No Level 4/5 test or evidence was rewritten.'},null,2)+'\n');
const handoffPath='docs/research/question-flags-round2-handoff-20261104.md';
const manifestPath=root+'question-flags-round2-owned-files-20261104.json';
const modified=[...scope.ownedExisting,'docs/execplans/question-flags-20261104.md','docs/research/question-flags-review-20261104.json'];
const added=new Set([handoffPath,manifestPath,
 'packages/clinical-content/src/question-flags-round2-20261104.ts',
 'packages/clinical-content/src/question-flags-round2-20261104-data.ts',
 'packages/clinical-content/src/question-flags-round2-evidence-20261104.ts',
 'packages/clinical-content/src/question-flags-round2-20261104.test.ts',
 'packages/game-domain/tests/question-flags-round2-bindings.test.ts',
]);
for(const dir of ['tools/question-quality','tools/question-quality/fixtures','docs/research'])for(const e of fs.readdirSync(dir,{withFileTypes:true}))
 if(e.isFile()&&e.name.includes('question-flags-round2')&&e.name.includes('20261104'))added.add(dir+'/'+e.name);
const cell=v=>String(v??'pending').replaceAll('|','\\|').replaceAll('\n',' ');
const lines=['# Owner/tester question flags: round-two handoff, 2026-11-04','',
 `Status: ${complete?'validation complete; independent re-review and clinical sign-off pending':'validation in progress; not ready for acceptance'}. Sixteen additive .r3 drafts remain needs_clinician_review. Nothing shipped, committed, installed, rebound or sent over the network. This is a local shared-working-tree checkpoint; the manager owns acceptance, release, rebind, global handoff and any later GitHub backup. No cloud, Supabase, save, selector/routing or Level 4/5 test/evidence edits.`, '',
 '## Review outcome and source decisions','',
 'The independent review had sixteen REVISE and the unchanged F14 FAIL. All **177 indexed notes** now have individual author responses (cues, fairness and suggestions); these are responses, not reviewer PASS decisions. Each replacement has a specific interpretation/decision, nearest competing choice and counterfactual self-check. Predicted moderate/hard difficulty remains a review target, not a measured or independently accepted result. No basic relabelling or author-granted clinical approval.','',
 '- Current packet and immutable round-two copy: `docs/research/question-flags-review-20261104.json`, `docs/research/question-flags-round2-review-20261104.json`. Before is the exact round-one draft; originalBefore preserves the originally flagged item. Key shown first for review only; runtime randomized.',
 '- Source/claim ledger: `docs/research/sources-question-flags-round2-20261104.json`.',
 '- Same-linter audit: `docs/research/question-flags-round2-cue-audit-20261104.md`; full findings and batch-2 candidates in the round-two lint/whole-bank JSON files.',
 '- Frozen/bound-input audit: `tools/question-quality/question-flags-round2-verification-20261104.json`.',
 '- Exact owned files, hashes and logs: `tools/question-quality/question-flags-round2-owned-files-20261104.json`.','',
 '**F14 recommendation: RETIRE the exact unsupported `question.thyroid-nodule.fna-selection.v2` from new selection until a permitted directly verified size/morphology profile and replacement pass review.** The local ATA patient-page claim expressly excludes the needed criteria. The no-network constraint prevents verification in this milestone. Its source is unchanged and its cue remains unresolved; no selector retirement is applied. This is not retirement of all thyroid questions.','',
 '**F05 recommendation: RETIRE from the ABSITE-labelled bank pending permitted public scope verification.** A clinical neck-mass guideline establishes clinical relevance, not exam coverage. A revised representative-sampling candidate is supplied for general clinical reasoning if the owner retains the topic; no claim of verified ABSITE scope or owner acceptance is made.','',
 'The original sanitized eighteen flags/seventeen variants remain attached. None of the exact flagged IDs had been superseded by batch 1 at original entry (manager-reported draft build 7b8cff7a). The sibling A02 HIDA repair was not the flagged v4. The private feedback was not reread this round and no email was retained.','',
 '## Per-item responses','',
 '| Item / original flag | Round-two change and closest inference | Notes answered / lint before-after |','|---|---|---|',
 ...packet.map(p=>`| ${cell(p.id+' / '+p.originalFlaggedVariantId)} | ${cell(p.whatChanged+' '+p.inference)} | ${Object.values(p.reviewResponse.noteResponses).reduce((n,a)=>n+a.length,0)} / ${p.lint.beforeCount}-${p.lint.afterCount} |`),'',
 'Every exact note and response is retained in reviewResponse.noteResponses. All sixteen drafts still need independent difficulty/fairness review and Melissa Rowland (clinical sign-off) approval of the exact version. In particular the potassium, OSA and staging decisions may still be easier for some PGY-2/3 residents; no automated metric establishes difficulty.','',
 '## Provenance, construct versions and compatibility','',
 `${sources.sources.length} existing source records and ${sources.claims.length} atomic claims are mapped in the before/after ledger. Three new qualitative inference claims explicitly name their existing basis claims, offline verification limitation and needs_clinician_review status (peak/plateau physics, CO2/acid-base interpretation, STOP-Bang/Epworth domains). This is original draft synthesis, not new source retrieval or current-guideline verification. Access/check dates were not advanced; aliases of one source are not independent corroboration. No source text, excerpts, proprietary corpus or new exact cutoffs/scores/doses were added.`, '',
 `Fourteen materially changed scored objectives have new concept IDs with parent IDs and reasons. F06 retains the preformed-recipient-antibody mechanism; F10 retains the supported mastectomy-staging objective. Catalog ${scope.conceptsBefore} to ${scope.conceptsAfter}; all ${scope.conceptsBefore} previous definitions, all round-one draft definitions, all eleven exact pilot approvals, ${scope.frozenCases} other cases and ${scope.frozenNodes} other nodes remain exact. The held F14 and later DNR/thyroid tasks are unchanged. No FSRS history is silently reassigned.`, '',
 `Timing rows ${scope.timingRowsBefore} to ${scope.timingRowsAfter}; every old row exact. Exact choice-order records ${scope.exactRowsBefore} to ${scope.exactRowsAfter}; all 335 old rows and original registry bytes outside the append remain exact. The 22 appended records are non-executing previews/plans, including eight keyed planned/external/future/specialist tests. Static live timed previews ${scope.timingBefore.timedChoices} to ${scope.timingAfter.timedChoices}; terminal timed keys ${scope.timingBefore.terminalTimedKeys} to ${scope.timingAfter.terminalTimedKeys}. These counts describe authored branches, not user analytics.`, '',
 'Case/node IDs, keyed service IDs, result gates, required capabilities and facility stages are preserved. Existing wait placeholders remain in timing metadata; no duration is baked into prose. Frozen encounter data and save formats are not edited.','',
 '## Linter and whole-bank scan','',
 `Both banks were scanned with v7: ${lint.before.uniqueVariants} variants, ${lint.before.profileContexts} finite/canonical contexts. Findings ${lint.before.findings} to ${lint.after.findings}; flagged variants ${lint.before.variantsWithFindings} to ${lint.after.variantsWithFindings}. Selected seventeen: ${lint.selected.beforeFindings} to ${lint.selected.afterFindings}; new-owner-rule findings ${lint.selected.beforeOwnerFindings} to ${lint.selected.afterOwnerFindings}, entirely the unchanged held F14. All sixteen replacement drafts have zero new-owner-rule findings.`, '',
 'v7 makes one narrow convergence correction: a complete four-option 2x2 matrix balances both component frequencies. Regression coverage retains warnings for incomplete three-option and arbitrary four-option sets. No broad lexical-overlap suppression or clinical whitelist was added. The other selected warnings have per-finding human dispositions; these do not override independent review. Do not compare the historical v6 total with v7 as though content alone caused the change.','',
 '| Owner rule | Remaining variants / findings |','|---|---:|',
 ...Object.entries(lint.newRulesAfter).map(([k,v])=>`| ${k} | ${v.variants} / ${v.findings} |`),'',
 `${lint.batch2Candidates.length} unchanged variants remain batch-2 candidates. No other question is rewritten. No per-question correctness collector, answer-statistics input, threshold, sample-size gate or analytics was introduced.`, '',
 '## Validation','',
 '| Check | Exact result | Log |','|---|---|---|',
 ...[['Clinical-content',results.clinical],['Affected domain fixtures/bindings',results.domainFocused],['Two full-suite fixture repairs',results.domainIntegrationRepairs],['Five touched presentation/frozen-flag suites',results.playerFocused],['Full game-domain, sandbox threads, one worker',results.domain],['Full player, existing preload, threads, two workers',results.player]].map(([name,r])=>`| ${name} | ${cell(r.tests??'RUNNING')} tests; ${cell(r.files)} files; ${cell(r.duration)} | ${r.log} |`),
 `| Lint tests | ${results.lint.pass??'pending'}/${results.lint.tests??'pending'} pass; ${results.lint.fail??'pending'} fail | ${results.lint.log} |`,
 `| Typecheck | ${results.typecheck.workspaces.length} workspaces; ${results.typecheck.errors?'ERRORS':'no errors'} | ${results.typecheck.log} |`,
 `| Whole-bank lint | ${lint.after.findings} advisory findings / ${lint.after.uniqueVariants} variants | tools/question-quality/question-flags-round2-whole-bank-cli-clean-20261104.log |`,'',
 'The existing unchanged player preload intercepts only Vite’s optional Windows net-use probe with EPERM; all other process calls remain real. Earlier clinical failures exposed unequal options and then editorial source notes in feedback/rationales; content was corrected and the meaningful guard retained. The earlier full-domain run was deliberately interrupted for that feedback cleanup and is not a completed validation run. Logs and its earlier input lock are preserved separately. The final clean runs are not merged with earlier attempts. No deadline, route, Level 4/5 assertion or evidence hash was weakened. No player file changed this round.','',
 `Final domain input lock: ${Object.keys(lock.files).length} monitored source/test/evidence hashes, ${changes.length} changes during that run. The earlier ${Object.keys(playerLock.files).length}-file clean lock covers the first complete domain and full-player run. Only the two named domain-test fixture repairs changed among those monitored inputs during player validation; no monitored runtime, player, clinical or evidence input changed. The lock enumerates its scope; it is not an assertion about every unmonitored file in the shared repository. Protected entry-file changes outside ownership: ${scope.protectedChanges.length}.`, '',
 `The first complete clean domain run recorded ${results.domainInitial.tests}, ${results.domainInitial.files} files, ${results.domainInitial.duration}. Five failures came from the two stale fixtures below; three extra generated lifecycle instances incorrectly treated new external studies as old local services. Filtering the exact retained version restores the original three executable instances; their assertions remain. The other 26 failures are separately recorded Level 5 guards/hashes. The repaired full run is a separate result, not merged with that attempt.`, '',
 ...(complete?[`Final domain failures: ${categories.level5_input_binding} Level 5 input guard, ${categories.legacy_loaded_state_hash} legacy initial loaded-state hashes, ${categories.timeout} timeouts, ${categories.requires_review} other. Exact names/errors/locations: \`${failurePath}\`. All failures must be reviewed as shown; this is not a green Level 5 suite.`, '']:[]),
 '### Content-driven fixture repairs','',
 '- `approved-clinical-admission.test.ts`: explicitly admit the fourteen new scored-construct IDs; the old definitions are retained.',
 '- `answer-choice-timing.test.ts`, `question-flags-20261104.test.ts`, `question-flags-bindings.test.ts`: retain the exact round-one historical release/rows instead of finding that version in the new live bank.',
 '- `test-choice-order-inventory.test.ts`: update explicit authored preview/key counts to 1,478 / 143; cover every new exact tuple.',
 '- `gs028-20261002-batch.test.ts`: current exact cohort rows 32 to 31; F17 interval surveillance is untimed. No historical binding is deleted.',
 '- `gs028-20261003-batch.test.ts`: filter exact current case/node/variant tuples (20 to 19 rows), retain 13 external/four specialist dispositions and all historical twenty concepts. Seed learning/selection fixtures from actual current primary IDs (22 active cohort constructs).',
 '- `gs028-20261007-batch.test.ts`: current exact rows eight to eleven (two executable gates unchanged, one correct outside plan/eight wrong timed choices); 80 nodes/317 actual options. Source-derived cumulative pools/concepts: 558/167, 796/280, 832/297.',
 '- `gs028-20261007-variety2-batch.test.ts`: exact current tuples exclude retained round-one neck rows; retain 29 current rows, five executable keys/24 non-execution and all old twenty definitions. Source-derived pools/concepts: 636/188, 874/301, 910/318.',
 '- `patient-supply.test.ts`, `diagnostics/patient-supply.test.ts`: catalog 398 to 412 and three seeded supply snapshots. The unchanged exact callback controls reproduce all old snapshots with the entry release and all new values with the current release. The separate snapshot audit verifies all other functional assertions/commands/deadlines unchanged (apart from the explicit catalog count/comment).',
 '- `gs028-20260928-batch.test.ts`: the retained historical BATCH_CONTEXT now filters full case/node/variant identities instead of a stable-case prefix. All three original terminal-service lifecycles remain; the three new non-execution study tuples are tested in the dedicated round-two binding suite. The historical assertion of three executable records is unchanged.',
 '- `gs028-statistics-ethics-batch.test.ts`: admission and final FSRS review assertions use actual current stable-case mappings, including the explicitly versioned DNR objective. Historical manifest/concept assertions stay unchanged. The two-file comparison in question-flags-round2-integration-fixture-review-20261104.json verifies all 112 original assertions and every deadline exact.',
 '- New clinical/domain tests check additive drafts, exact freezes, explicit concept parents, clean clinical feedback, timing identities, all twenty-two non-execution tuples and rejection of altered labels.','',
 `Supply controls: ${control.status}, ${control.results.length} scenarios; snapshot review: ${snapshots.results.length} files / ${snapshots.results.reduce((n,r)=>n+r.snapshotCount,0)} snapshots. Artifacts: question-flags-round2-supply-control-20261104.json and question-flags-round2-snapshot-change-review-20261104.json.`, '',
 `The separate synthetic legacy control covers ${legacy.rows.length} level/schema loads under identical current domain code. Removing only the fourteen new empty histories in a disposable comparison copy reproduces round one; removing sixteen cumulative flag histories reproduces the recorded initial hash. Frozen encounters are exact. This diagnoses initial loaded-state differences only: continued-play assertions after a failing initial hash do not run. It is not production normalization, passing Vitest evidence, a save edit, evidence rewrite or rebind.`, '',
 '## Exact Level 5 bound inputs','',
 'This round changes seven collected inputs (four edits, three additions):','',
 ...scope.boundInputs.changedThisRound.map(x=>'- Edited: `'+x.path+'`.'),
 ...scope.boundInputs.addedThisRound.map(x=>'- Added: `'+x.path+'`.'),'',
 `Cumulative flags delta from the recorded ${scope.boundInputs.recordedInputCount}-file manifest: the same four edited inputs plus five additions, current collector ${scope.boundInputs.currentInputCount}. The two earlier additions are \`packages/clinical-content/src/question-flags-20261104.ts\` and \`packages/clinical-content/src/question-flags-20261104-data.ts\`. The verification JSON gives recorded/entry/current hashes. \`packages/game-domain/src/reducer.ts\` and \`waiting-destinations.ts\` already differed at round-two entry and are not this worker’s edits. Tests/linter/docs are outside the bound collection. Manager owns actual rebind and legacy behavioral-evidence refresh; no Level 5 evidence was touched.`, '',
 '## Exact edited and added implementation files','',
 ...modified.map(p=>'- Modified: `'+p+'`.'),
 ...[...added].filter(p=>/\.(?:ts|mjs)$/.test(p)).sort().map(p=>'- Added: `'+p+'`.'),'',
 'The ownership manifest enumerates every generated packet, source ledger, audit, immutable baseline, control, log and tool with its hash. This worker’s scoped handoff supplements the manager-owned global handoff; it does not overwrite it or concurrent work.','',
 '## Manager next actions','',
 '1. Send the sixteen exact drafts and all indexed note responses for independent re-review; moderate/hard and one-best-answer validity remain clinical/editorial judgments.',
 '2. Decide F14 exact-variant retirement and F05 retirement from the ABSITE-labelled bank or provide permitted verification. Neither proposed retirement is silently implemented.',
 '3. Review the fourteen new concept versions, exact non-execution bindings and documented fixture deltas. After acceptance, perform the manager-owned Level 5 rebind/legacy refresh and release checks.',
 '4. Melissa Rowland remains the named clinical sign-off. No automatic approval, publication, network action or correctness analytics is authorized by this handoff.',''];
fs.writeFileSync(handoffPath,lines.join('\n'));
const paths=[...new Set([...modified,...added])].sort();
const files=paths.map(path=>({path,kind:modified.includes(path)?'modified_this_round':'added_this_round',sha256:path===manifestPath?null:hash(path),bytes:path===manifestPath?null:fs.statSync(path).size}));
for(const f of files.filter(f=>f.path!==manifestPath))assert(!/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(text(f.path)),'Email-like content in owned artifact: '+f.path);
fs.writeFileSync(manifestPath,JSON.stringify({checkedOn:'2026-11-04',status:complete?'validation_recorded_pending_independent_and_clinical_review':'validation_pending',results,domainFailureCategories:categories,
 validationInputLock:lockPath,windowChanges:changes,playerValidationInputLock:playerLockPath,playerWindowChanges,playerChangesAreDomainTestsOnly:playerWindowChanges.every(c=>domainOnlyRepairs.includes(c.path)),protectedChanges:scope.protectedChanges,files,
 note:'Self hash omitted to avoid recursion. All logs retained; final clean logs are the acceptance evidence. Original round-one artifacts and concurrent work are not owned by round two. No Git used.'},null,2)+'\n');
console.log(JSON.stringify({complete,files:files.length,tests:Object.fromEntries(Object.entries(results).filter(([,r])=>r.tests).map(([k,r])=>[k,r.tests])),domainFailureCategories:categories,validationWindowChanges:changes.length,protectedChanges:scope.protectedChanges.length}));
