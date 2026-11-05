import fs from 'node:fs';
import crypto from 'node:crypto';
import {specs} from './question-flags-round3-specs-20261104.mjs';
const root='tools/question-quality/';
const packet=JSON.parse(fs.readFileSync('docs/research/question-flags-round3-review-20261104.json','utf8'));
const lint=JSON.parse(fs.readFileSync(root+'question-flags-round3-lint-20261104.json','utf8'));
const verify=JSON.parse(fs.readFileSync(root+'question-flags-round3-verification-20261104.json','utf8'));
function log(name){const path=root+name;if(!fs.existsSync(path))return {path,status:'not_run'};
 const b=fs.readFileSync(path),t=b.toString(b[0]===255?'utf16le':'utf8').replace(/\x1b\[[0-9;]*m/g,'');
 const lines=t.split(/\r?\n/),failures=[];
 for(let i=0;i<lines.length;i++)if(/^\s*FAIL\s+/.test(lines[i])){
  let label=lines[i].replace(/^\s*FAIL\s+/,'').trim();
  for(let k=i+1;k<lines.length&&k<i+5&&lines[k].trim()&&!/^\s*(?:FAIL|AssertionError|Error:|TypeError|ReferenceError|Expected:|Received:)/.test(lines[k]);k++)label+=' '+lines[k].trim();
  failures.push(label);
 }
 return {path,files:t.match(/^\s*Test Files\s+([^\r\n]+)/m)?.[1]??null,tests:t.match(/^\s*Tests\s+([^\r\n]+)/m)?.[1]??null,
  duration:t.match(/^\s*Duration\s+([^\r\n]+)/m)?.[1]??null,failures,
  typecheckWorkspaces:[...t.matchAll(/^> (@gamify-surgery\/[^\s]+) typecheck/gm)].map(x=>x[1]),typeErrors:t.split('\n').filter(x=>/error TS\d+/.test(x)),
  nodePass:t.match(/\bpass\s+(\d+)/)?.[1]??null,nodeFail:t.match(/\bfail\s+(\d+)/)?.[1]??null};
}
const results=Object.fromEntries(Object.entries({
 clinical:'question-flags-round3-clinical-handoff-20261104.log',clinicalEarlier:'question-flags-round3-clinical-final-20261104.log',
 clinicalFocused:'question-flags-round3-clinical-focused-final-20261104.log',
 domain:'question-flags-round3-domain-complete-20261104.log',domainEarlier:'question-flags-round3-domain-final-20261104.log',
 domainFocused:'question-flags-round3-domain-focused-final-20261104.log',
 domainOwnedHandoff:'question-flags-round3-domain-owned-handoff-20261104.log',
 domainCohortRepair:'question-flags-round3-cohort-repaired-final-20261104.log',
 domainDiagnosticRepair:'question-flags-round3-supply-repaired-20261104.log',
 domainRemainingFixtures:'question-flags-round3-remaining-fixtures-repaired-20261104.log',
 player:'question-flags-round3-player-complete-20261104.log',playerEarlier:'question-flags-round3-player-final-20261104.log',
 playerFocused:'question-flags-round3-player-focused-final-20261104.log',
 playerTimeoutCheck:'question-flags-round3-player-timeout-check-20261104.log',
 typecheck:'question-flags-round3-typecheck-after-n2-20261104.log',typecheckN2Window:'question-flags-round3-typecheck-handoff-20261104.log',typecheckEarlier:'question-flags-round3-typecheck-locked-20261104.log',
 lint:'question-flags-round3-lint-tests-handoff-20261104.log',
}).map(([k,v])=>[k,log(v)]));
const knownExisting=[
 'docs/execplans/question-bank-program-20261104.md','docs/research/question-flags-review-20261104.json',
 'docs/research/question-bank-program-queue-20261104.json',
 'docs/research/question-bank-retire-merge-proposals-20261104.md',
 'tools/question-quality/report.mjs',
 'packages/clinical-content/src/answer-choice-timing.ts','packages/clinical-content/src/index.ts','packages/clinical-content/src/synthetic-content.ts',
 'packages/clinical-content/src/answer-choice-timing.test.ts','packages/clinical-content/src/question-bank-batch2a-20261104.test.ts',
 'packages/game-domain/src/test-choice-orders.ts','packages/game-domain/tests/approved-clinical-admission.test.ts',
 'packages/game-domain/tests/test-choice-order-inventory.test.ts','packages/game-domain/tests/question-bank-batch2a-bindings.test.ts',
 'packages/game-domain/tests/gs028-20261007-batch.test.ts','packages/game-domain/tests/gs028-20261007-variety2-batch.test.ts','packages/game-domain/tests/diagnostics/patient-supply.test.ts',
 'packages/game-domain/tests/gs028-20261002-batch.test.ts','packages/game-domain/tests/gs028-20261003-batch.test.ts','packages/game-domain/tests/gs028-statistics-ethics-batch.test.ts','packages/game-domain/tests/patient-supply.test.ts',
];
const paths=new Set(knownExisting);
for(const dir of ['tools/question-quality','tools/question-quality/fixtures','docs/research','packages/clinical-content/src','packages/game-domain/tests']){
 for(const e of fs.readdirSync(dir,{withFileTypes:true}))if(e.isFile()&&e.name.includes('question-flags-round3')&&!e.name.includes('owned-files'))paths.add(dir+'/'+e.name);
}
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const files=[...paths].filter(p=>fs.existsSync(p)).sort().map(path=>({path,kind:knownExisting.includes(path)?'modified_existing':'added_this_round',sha256:hash(path),bytes:fs.statSync(path).size}));
const source=JSON.parse(fs.readFileSync('docs/research/sources-question-flags-round3-20261104.json','utf8'));
const cell=s=>String(s??'').replaceAll('|','\\|').replaceAll('\n',' ');
const validationRows=Object.entries(results).filter(([k])=>!k.endsWith('Earlier')).map(([k,r])=>
 '| '+[k,r.files??(r.typecheckWorkspaces?.length?r.typecheckWorkspaces.length+' workspace typechecks':r.nodePass?'node:test':r.status??'pending'),r.tests??(r.nodePass?r.nodePass+' passed / '+r.nodeFail+' failed':r.typeErrors?.length?r.typeErrors.length+' type errors':'see log'),r.duration??'',r.path].map(cell).join(' | ')+' |');
const windows=fs.readdirSync(root).filter(p=>/^question-flags-round3-validation-.*-window-20261104\.json$/.test(p)).map(p=>JSON.parse(fs.readFileSync(root+p,'utf8')));
const summary={checkedOn:new Date().toISOString(),status:'author_round_complete_nothing_shipped_independent_review_and_source_alignment_pending',
 revisions:14,frozen:['F01','F12','F14','all eleven batch-2a versions','all existing exact approvals'],noteResponses:verify.noteResponses,
 results,lint,verification:verify,validationWindows:windows,files,
 sourceHold:'F04 requires direct UKKA section alignment of its new comparative drug ranking before release acceptance. All clinical versions/claims remain needs_clinician_review.',
 fallbackPolicy:'Final independent rejection retains the currently live item; known live and pending round-two IDs are separate in the packet. Manager reconciles any intervening release; worker does not revert or ship.'};
fs.writeFileSync(root+'question-flags-round3-owned-files-20261104.json',JSON.stringify(summary,null,2)+'\n');
const lines=[
 '# Flag rewrites: final author-round handoff, 2026-11-04','',
 '**Fourteen additive r4 drafts; nothing shipped.** Read the [fourteen-item packet](question-flags-round3-review-20261104.json) and [source/claim ledger](sources-question-flags-round3-20261104.json). Key shown first for review only; runtime answers remain randomized. All new versions, eight new constructs and thirteen application claims remain `needs_clinician_review`. Melissa Rowland is clinical sign-off. Independent review 3 and manager acceptance remain required.','',
 'F01/F12 PASS versions are exact. The eleven batch-2a versions and two exhibit PNGs are exact. F14 remains core general-surgery content on its existing source hold, unchanged and outside this packet. Neck-node evaluation remains in scope by the explicit owner/manager KEEP decision; no SCORE or exam-bank evidence is claimed.','',
 `Preservation: ${verify.frozenCases} untouched old cases / ${verify.frozenNodes} untouched old nodes, all ${verify.retainedTimings} old timing rows and all ${verify.retainedOrders} old order tuples exact. Eighteen new study previews are explicitly nonexecuted; no new gate, route, save format or selector change. The catalog at entry was ${verify.entryConcepts}; this round adds eight (${verify.ownConcepts}), and the concurrent N1/N2 appends make ${verify.currentConcepts} at this check.`, '',
 '## Per-item response and fallback','',
 'All 140 second-review cue/fairness/suggestion notes have indexed responses in `reviewResponse.noteResponses`. The table summarizes the edits; the packet contains the exact before/after fields, reasons for each choice, source limits and lint spans.','',
 '| Item | Specific repair | Known live fallback | Pending round-two draft retained |','|---|---|---|---|',
 ...packet.map(p=>'| '+[p.id,p.whatChanged,p.fallback.lastKnownLiveVariantId,p.fallback.entryRound2VariantId].map(cell).join(' | ')+' |'),'',
 'Fallback identities come from the recorded live-build flag check, not fresh remote verification. Neither the round-two nor final draft is claimed shipped. If review 3 rejects a draft, retain its currently released version; the manager must reconcile any intervening release before applying the known fallback. No content is retired or deleted.','',
 'All fourteen known fallbacks were matched to `QUESTION_FLAGS_PRE_REVISION_RELEASE` in `packages/clinical-content/src/synthetic-content.ts`. Each packet entry records the source export, exact case/node and retained-case SHA-256. Reconstruct a fresh-case fallback from that retained source; never rewrite an existing saved encounter or reset its FSRS history.','',
 '## Clinical meaning and source limits','',
 '| Item | Versioning decision |','|---|---|',...packet.map(p=>'| '+[p.id,p.clinicalMeaning].map(cell).join(' | ')+' |'),'',
 `The ledger contains ${source.claims.length} current/prior/basis claims and ${source.sources.length} existing source records. No article text, source excerpt, private email, proprietary corpus, new network retrieval or changed access date is stored. New application claims explicitly identify their basis and offline alignment limits.`, '',
 '**F04 release hold:** the new comparative insulin-glucose / beta-agonist / bicarbonate ranking requires direct UKKA section alignment. The existing locally recorded claims directly support the severe-potassium and calcium/insulin mechanisms; they do not independently verify every new comparison. Retain the live fallback if the manager cannot complete permitted verification. Other applications also require clinical/source-alignment review; test passage is not approval.','',
 'F15 no longer asserts acidemia from relative gas directions. Initial high-pH/low-CO2 and later within-interval observations establish the limited conclusion without invented numbers. The physiology items are described as integrated interpretations, not falsely counted as two sequential management decisions. No basic acceptance or independent PASS is self-granted.','',
 '## Linter','',
 `Same ${lint.linterVersion}: ${lint.before.uniqueVariants} variants before / ${lint.after.uniqueVariants} after; ${lint.before.profileContexts} / ${lint.after.profileContexts} finite contexts. Whole-bank findings ${lint.before.findings} to ${lint.after.findings}; selected fourteen ${lint.selected.beforeFindings} to ${lint.selected.afterFindings}. New-owner-rule findings among the fourteen: ${lint.selected.beforeOwnerFindings} to ${lint.selected.afterOwnerFindings}.`, '',
 'Concurrent N1/N2 cases are included on both sides of this comparison, so the difference isolates these fourteen replacements. Author dispositions do not suppress warnings or grant clinical clearance. The five additional advisory findings are retained; balanced component combinations can trigger convergence and near-duplicate heuristics. This is not a lint-clearance claim. Full exact phrases/fields remain in the packet and `question-flags-round3-whole-bank-20261104.json`; other candidates are not rewritten. No correctness statistics, timing analytics, thresholds or per-player data are collected or expected.','',
 '## Validation','',
 'Commands: `npm.cmd run test --workspace @gamify-surgery/clinical-content -- --pool=threads --maxWorkers=1 --reporter=dot`; `npm.cmd run clinical:lint:test`; `node --disable-warning=ExperimentalWarning tools/question-quality/review-question-flags-round3-20261104.mjs` (same-v8 whole-bank inventory, exact before/after spans and packet); `npm.cmd run typecheck` (seven workspaces). Full domain: `npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=1 --reporter=verbose`. Full player: `npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads --maxWorkers=1 --reporter=dot`, with the existing `adversarial-r5-player-preload-20261102.cjs` required through temporary NODE_OPTIONS and the original environment restored afterwards. Focused logs include their exact filename arguments. No timeout/configuration change.','',
 '| Check | Files | Tests / result | Duration | Log |','|---|---|---|---|---|',...validationRows,'',
 'The full shared-tree logs and scoped reruns are retained separately. Interrupted preliminary full launches are not counted as validation. Source/window hashes identify concurrent changes; a passing earlier window is not evidence that every later shared-tree input passed.','',
 'Full domain result: **4,470 passed / 47 failed / one skipped**, 176 files. The 47 comprise 26 expected Level 5 input/legacy-initial-hash mismatches, seven timeouts, eleven stale content/inventory expectations, and three functional routing/restroom assertions outside this lane. The 26 hash-only failures are the recorded-input guard plus the 25 seeded Level 0–4 initial-state comparisons in `level-five-integration.test.ts`; exact labels/seeds remain in the full log. No Level 5 test/evidence was changed. The five Level 5 save/reload/continuation timeouts, Executive training timeout, garden-return timeout, pediatric relocation assertion and two restroom-path assertions are left for their owners. Do not call them hash-only failures or attribute them to these rewrites without a controlled diagnosis.','',
 'Exact hash-only test identities in `packages/game-domain/tests/level-five-integration.test.ts`: `M9 connected Level 5 reducer journey > binds the actual run to its current game, balance, clinical and driver inputs and reconciles cash`; and `M9 Level 0-4 intake behavior after the ordinary cap-5 switch > matches the actual pre-M9 load and next 120 minutes for level {0,1,2,3,4}/schema {5,6,7,8,9}` (all 25 combinations). Those comparisons fail at the initial state hash; no claim is made that later behavior has been revalidated. The five other failures in that file are timeouts at integration-preparing, integration-running, integration-final, integration-finish and the lower-retry continuation.','',
 'The eleven stale expectations were addressed with retained exact labels and counterfactual proofs. The cohort/order rerun passes 708/708 and the sustained-supply diagnostic passes 1/1. A subsequent 563-test rerun passes 560 and fails three literal inventory assertions because N2 was appended during this window: October 3 and statistics/ethics expect 1,048 cases but now see 1,087; patient-supply expects 462 definitions but sees 501. Both original patient-supply snapshots reproduce under the entry bank; the same-N1 control isolates this round’s seeded-case change. Do not chase the moving N2 catalog or describe these three current count failures as solved.','',
 'Full player result: **3,415 passed / two timeouts**, 343 files. Both timed-out tests pass their unchanged limits in isolation (six tests, two files). Final affected presentation/flag/image checks pass 59/59. No player source or test was edited. The full runs preceded the final record-scope/acquisition prose refinements; the latest clinical and focused checks cover those strings. These windows do not establish an all-green current shared tree.','',
 `The earlier seven-workspace typecheck passes. The N2 construction window has six passing workspaces and two TS2353 errors for termsUrl in the concurrent question-new-n2-evidence-20261104.ts (lines 6431 and 6461 in that window). The other author subsequently changed that file; it remains untouched here. The final rerun checks ${results.typecheck.typecheckWorkspaces.length} workspaces and reports ${results.typecheck.typeErrors.length} type errors; see its separate log. Final clinical-content is 835/835, 102 files.`, '',
 ...Object.entries(results).filter(([k,r])=>!k.endsWith('Earlier')&&(r.failures?.length||r.typeErrors?.length)).flatMap(([k,r])=>['### '+k+' failures','',...r.failures.map(x=>'- '+x),...r.typeErrors.map(x=>'- '+x.trim()),'']),
 '## Fixture and integration changes','',
 '- The historical batch-2a clinical test now reads its retained pre-round-three bank/timing view. All its original content, counts, assertion bodies and deadlines remain; it no longer incorrectly treats every later additive batch as a change to batch 2a.',
 '- Its domain binding test counts the fourteen tuples owned by that historical batch. The new suite separately proves all 371 entry tuples exact, eighteen new previews, exact label/timing matching, rejection of label drift and old frozen lookup. No execution policy changes.',
 '- The timing-count formula includes fourteen retained replacement rows. The active order inventory retains the round-entry cases for frozen r3 identities; all exact label, route, timing, orphan and no-extra-order checks remain.',
 '- Shared inventory totals: entry 1,475 studies / 143 terminal testing keys; this round 1,474 / 142; current concurrent N1 1,511 / 155 (+37 / +13). The explicit full-bank expectations include both additive batches. Admission expectations append the eight named versioned constructs and the separate N1 declared catalog in actual release order. No assertion or timeout is weakened to hide a behavioral change.',
 '- Two GS-028 cohort fixtures retain all 222 assertion call sites, commands and deadlines. Exact entry/current controls reproduce the original counts, then show one additional active F06 objective with no case-count change. F02 now has ten current study bindings (two executable gates, one planned ERCP, seven distractors); F06 adds one offered answer, making 318 covered choices. The second cohort keeps its exact 78-case / 21-concept delta.',
 '- The day-eight diagnostic changes one inline snapshot. A disposable control with the entry bank and identical current domain/N1 code reproduces the old snapshot exactly; the new versioned objectives change the deterministic unseen-concept mix. Arrivals remain 96 and walkouts zero; completions at the cutoff change 95 to 94, with the last arrival 24 ticks later. All twelve assertion call sites and the existing deadline remain. The actual focused Vitest rerun, not the diagnostic capture, determines passage.',
 '- Four further fixture files change only documented literal lengths, two patient-supply snapshots and comments: October 2, October 3, statistics/ethics and routine patient-supply. All 264 assertion call sites, commands and deadlines remain. October 2 has 33 current study records, still two executable gates, two terminal services and fourteen external-only previews. N1 adds forty single-node cases; this round adds no cases. The seeded day-six case now contains two nodes instead of one and still completes; days seven/eight are unchanged. The control distinguishes the N1 contribution from these eight retained constructs; N2 arrived afterwards and leaves the three explicit current integration-count failures above.',
 '- No player source or player test was edited. Focused flag-freeze, chart and image tests exercise the affected presentation/old-variant behavior. Do not touch cloud/save, Supabase, N1 authored files, Level 4/5 tests/evidence or other UI/art/routing lanes.',
 '',
 '## Exact Level 5 bound inputs changed by this round','',
 'Four modified and three added collected inputs (the shared assembly/registry also contain preserved independent N1/N2 appends):','',
 ...verify.exactLevel5BoundInputsThisRound.map(x=>'- `'+x.path+'` — '+x.change+'.'),'',
 'No Level 5 evidence, legacy evidence, hash or rebind file was edited. The manager owns rebind and behavioral-evidence refresh in the release worktree. Concurrent source changes are listed separately in the verification/window artifacts; they are not attributed to this batch.','',
 'The retire/merge proposal ledger also records F02 overlap with the existing minor-leak ERCP learning objective. Review possible canonical-card consolidation after acceptance; no migration or retirement is applied, and the F05/F14 KEEP decisions stand.','',
 '## Exact files and next action','',
 'The machine-readable `tools/question-quality/question-flags-round3-owned-files-20261104.json` records every scoped file, kind, byte count and SHA-256, plus validation and unrelated shared-tree changes. Files in shared assembly paths retain the other worker’s appended code. The scoped handoff supplements the manager-owned CURRENT_THREAD_HANDOFF rather than overwriting it.','',
 ...files.map(x=>'- `'+x.path+'` ('+x.kind+').'),'',
 'STOP: manager runs final independent review, resolves the F04 direct-source hold, retains live versions for rejected replacements, accepts integration and schedules release/rebind. Batch 2a remains independently frozen. No next linter batch is authored. This valuable checkpoint remains local only; no Git backup, release, installation or network action was performed. GitHub backup coordination belongs to the manager.','',
];
fs.writeFileSync('docs/research/question-flags-round3-handoff-20261104.md',lines.join('\n'));
console.log(JSON.stringify({files:files.length,results:Object.fromEntries(Object.entries(results).map(([k,r])=>[k,r.tests??r.typeErrors?.length??r.status])),noteResponses:verify.noteResponses}));
