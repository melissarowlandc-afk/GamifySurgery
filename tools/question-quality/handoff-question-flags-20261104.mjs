import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const root='tools/question-quality/';
const readJson=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const readText=p=>{const b=fs.readFileSync(p);return b[0]===255&&b[1]===254?b.subarray(2).toString('utf16le'):b.toString('utf8');};
const readLog=p=>readText(root+p).replace(/\x1b\[[0-9;]*m/g,'');
function failureDetails(text){
 const results=[];
 for(const block of text.split(/\r?\n[^\r\n]*\[\d+\/\d+\][^\r\n]*\r?\n/)){
  const lines=block.split(/\r?\n/),errorIndex=lines.findIndex(l=>/^(?:AssertionError|\w*Error):/.test(l));
  const error=errorIndex<0?null:lines.slice(errorIndex).slice(0,3).filter(l=>l.trim()).join(' ').trim();
  const location=lines.find(l=>/tests\/[^\s]+:\d+:\d+/.test(l))?.trim()??null;
  for(let i=0;i<lines.length;i++)if(/^\s*FAIL\s/.test(lines[i])){
   let title=lines[i].trim();
   for(let k=i+1;k<lines.length&&lines[k].trim()&&!/^\s*FAIL\s|^(?:AssertionError|\w*Error):/.test(lines[k]);k++)title+=' '+lines[k].trim();
   const kind=/level-five-integration/.test(title)&&/binds the actual run/.test(title)?'level5_input_binding':
    /pre-M9 load.*level [\d+]+\/schema \d+/.test(title)?'legacy_loaded_state_hash':
    /Test timed out/.test(error??'')?'timeout':'requires_review';
   results.push({title,kind,error,location});
  }
 }
 return results;
}
const tests=p=>{const t=readLog(p);return {log:root+p,files:t.match(/^\s*Test Files\s+([^\r\n]+)/m)?.[1]?.trim()??null,
  tests:t.match(/^\s*Tests\s+([^\r\n]+)/m)?.[1]?.trim()??null,duration:t.match(/^\s*Duration\s+([^\r\n]+)/m)?.[1]?.trim()??null,
  failureHeaders:failureDetails(t).map(f=>f.title),failures:failureDetails(t)};};
const review=readJson('docs/research/question-flags-review-20261104.json'),lint=readJson(root+'question-flags-lint-20261104.json'),verification=readJson(root+'question-flags-verification-20261104.json');
const source=readJson('docs/research/sources-question-flags-20261104.json');
const supplyControl=readJson(root+'question-flags-supply-control-20261104.json');
const snapshotReview=readJson(root+'question-flags-snapshot-change-review-20261104.json');
const results={clinical:tests('question-flags-clinical-bindings-20261104.log'),presentation:tests('question-flags-player-bindings-20261104.log'),
  bindings:tests('question-flags-domain-bindings-20261104.log'),
  domainFocused:tests('question-flags-domain-focused-final-20261104.log'),
  playerRepairs:tests('question-flags-player-repairs-focused-20261104.log'),
  playerEntryControl:tests('question-flags-player-timeout-entry-config-control-20261104.log'),
  playerInitial:tests('question-flags-player-final-bindings-20261104.log'),
  domainInitial:tests('question-flags-domain-final-bindings-20261104.log'),
  player:tests('question-flags-player-final-repaired-20261104.log'),
  domain:tests('question-flags-domain-final-integrated-20261104.log')};
results.supplyControl={path:root+'question-flags-supply-control-20261104.json',status:supplyControl.status,scenarios:supplyControl.results.length};
results.snapshotReview={path:root+'question-flags-snapshot-change-review-20261104.json',status:snapshotReview.status,files:snapshotReview.results.length,snapshots:snapshotReview.results.reduce((n,r)=>n+r.snapshotCount,0)};
const lintLog=readLog('question-flags-lint-tests-final-20261104.log');
results.lint={log:root+'question-flags-lint-tests-final-20261104.log',tests:lintLog.match(/ℹ tests (\d+)/)?.[1],pass:lintLog.match(/ℹ pass (\d+)/)?.[1],fail:lintLog.match(/ℹ fail (\d+)/)?.[1]};
const typeLog=readLog('question-flags-typecheck-final-20261104.log');
results.typecheck={log:root+'question-flags-typecheck-final-20261104.log',workspaces:[...typeLog.matchAll(/^> (@gamify-surgery\/\S+)@\S+ typecheck/gm)].map(m=>m[1]),errors:/error TS\d+|Lifecycle script.*failed/.test(typeLog)};
const complete=!!results.player.tests&&!!results.domain.tests;
const failurePath=root+'question-flags-domain-final-failures-20261104.json';
if(results.domain.tests)fs.writeFileSync(failurePath,JSON.stringify({checkedOn:'2026-11-04',log:results.domain.log,tests:results.domain.tests,failures:results.domain.failures,
 note:'Input-guard and loaded-state hashes are distinct failures. The standalone legacy control diagnoses only the initial loaded-state difference, not continuation coverage. Original test deadlines and all Level 4/5 sources/evidence remain unchanged.'},null,2)+'\n');
if(process.argv.includes('--final'))assert(complete,'Full player/domain summaries are still pending');
if(process.argv.includes('--final')){
 assert.equal(results.typecheck.workspaces.length,7);assert.equal(results.typecheck.errors,false);
 assert.equal(results.lint.fail,'0');assert.equal(results.lint.pass,results.lint.tests);
 assert.equal(results.player.tests,'3371 passed (3371)');
 assert.equal(results.supplyControl.status,'passed');assert.equal(results.supplyControl.scenarios,3);
 assert.equal(results.snapshotReview.snapshots,3);
}
const lockPath=root+'question-flags-final-integrated-lock-20261104.json';
const lock=readJson(lockPath);
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const windowChanges=Object.entries(lock.files).filter(([p,h])=>sha(p)!==h).map(([path,entry])=>({path,entry,current:sha(path)}));
const handoffPath='docs/research/question-flags-handoff-20261104.md',manifestPath=root+'question-flags-owned-files-20261104.json';
const modified=[
 'docs/clinical/question-authoring-standard.md',
 'packages/clinical-content/src/answer-choice-timing.ts','packages/clinical-content/src/index.ts','packages/clinical-content/src/synthetic-content.ts',
 'packages/clinical-content/src/answer-choice-timing.test.ts','packages/clinical-content/src/question-quality-adversarial-r7.test.ts',
 'packages/clinical-content/src/development-batch/2026-09-29-statistics-ethics/ethics-clinical-pairings.test.ts',
 'packages/game-domain/src/test-choice-orders.ts','packages/game-domain/tests/test-choice-order-inventory.test.ts',
 'tools/question-quality/lint.mjs','tools/question-quality/lint.test.mjs','tools/question-quality/report.mjs',
 'apps/player/src/session/flagFreeze.test.tsx',
 'packages/game-domain/tests/approved-clinical-admission.test.ts',
 'packages/game-domain/tests/gs028-20261002-batch.test.ts',
 'packages/game-domain/tests/gs028-20261003-batch.test.ts',
 'packages/game-domain/tests/gs028-20261007-batch.test.ts',
 'packages/game-domain/tests/gs028-20261007-variety2-batch.test.ts',
 'packages/game-domain/tests/patient-supply.test.ts',
 'packages/game-domain/tests/diagnostics/patient-supply.test.ts',
];
const added=new Set([
 'docs/execplans/question-flags-20261104.md',handoffPath,manifestPath,
 'packages/clinical-content/src/question-flags-20261104.ts','packages/clinical-content/src/question-flags-20261104-data.ts','packages/clinical-content/src/question-flags-20261104.test.ts',
 'packages/game-domain/tests/question-flags-bindings.test.ts','tools/question-quality/owner-flag-rules-20261104.mjs',
]);
for(const dir of ['tools/question-quality','tools/question-quality/fixtures','docs/research'])for(const e of fs.readdirSync(dir,{withFileTypes:true}))
 if(e.isFile()&&/question-flags.*20261104/.test(e.name))added.add(dir+'/'+e.name);
const cell=x=>String(x??'pending').replaceAll('|','\\|').replaceAll('\n',' ');
const lines=['# Owner/tester question flags — handoff, 2026-11-04','',
 `Status: ${complete?'final validation recorded; author drafts await pipeline/clinical review':'full-domain validation in progress; full player and focused checks have passed'}. Nothing committed, installed, shipped, rebound or sent over the network. This worker made no cloud, Supabase, save, routing, Level 4/5 test or evidence edits. The manager owns acceptance, release, evidence refresh and the later backup checkpoint; this state remains in the shared local working tree.`,'',
 '## Outcome and review artifacts','',
 'Eighteen Question flag sections cover seventeen distinct variants; two Dustin flags concern the same thyroid-ultrasound question. Every exact flagged ID was still live at entry. **None was already superseded by batch 1** (manager-reported live draft build `7b8cff7a`). HIDA A02 / v2.r6 is a sibling repair, not a replacement for the flagged HIDA v4. Only the Question flag sections were extracted; no emails or unrelated feedback were retained.','',
 '**Sixteen new `.r2` drafts are assembled, all `needs_clinician_review`; F14 is not rewritten.** Its existing source explicitly excludes the eligibility cutoffs needed for a fair raw ultrasound profile, and network access is prohibited. The packet deliberately shows the held item unchanged. Propose withholding/retiring it until the manager supplies a permitted verified profile/atomic mapping. The existing live variant is not silently disabled. F05 wording is repaired, but public ABSITE-scope verification remains a separate hold for an ABSITE-labelled release. These are unresolved decisions, not approvals.','',
 '- Review packet: `docs/research/question-flags-review-20261104.json` (17 items, 18 note responses; key shown first for review only, runtime randomized).',
 '- Standard: `docs/clinical/question-authoring-standard.md`, v11; linter v6, advisory only.',
 '- Whole-bank scan/backlog: `docs/research/question-flags-cue-audit-20261104.md` and `tools/question-quality/question-flags-lint-20261104.json`; full current spans in `question-flags-whole-bank-20261104.json`.',
 '- Source records/claim mappings: `docs/research/sources-question-flags-20261104.json`.',
 '- Exact scope, hashes and timing deltas: `tools/question-quality/question-flags-verification-20261104.json`.',
 '- Ownership/hashes, including logs and immutable before fixtures: `tools/question-quality/question-flags-owned-files-20261104.json`.','',
 '## Per-flag responses','',
 '| Item / flagged variant | Response and remaining review |','|---|---|',
 ...review.map(i=>'| '+[i.id+' / '+i.before.variantId,i.whatChanged+(i.scopeDecision?' Scope: public ABSITE coverage unverified; propose retirement from that track pending verification.':'')+(i.sourceVerificationHold?' UNRESOLVED SOURCE HOLD; unchanged, not release-ready.':'')].map(cell).join(' | ')+' |'),'',
 'F09/F15 now use the actual monitored variables and explicit chronology/co-variables, without numeric pressure or timing thresholds. F15 may remain a narrow/easy application; retaining the combined F09 and retiring the redundant early-phase item is proposed. F04, F11 and F16 may also remain easier than the resident target; they are not newly labelled accepted-basic or independently passed. All new versions still require adversarial and clinician review. Remaining lint candidates have per-finding author justifications in the packet, not automated clearance.','',
 '## Provenance and clinical holds','',
 `${source.sources.length} existing source records and ${source.claims.length} existing atomic claims were reused offline. Actual original access/check dates, citations, license/reuse and authority limitations remain. Aliases of the same publication are not independent corroboration; the ledger reverse-indexes actual uses without pretending to freshly verify the source. No article text, excerpts, proprietary material, recalled board questions, SCORE or paywalled snippets were ingested.`, '',
 'The recorded 2026 ASBrS axillary source supports the standard DCIS/mastectomy setting and a conditional threatened-mapping exception. It does not establish that every oncoplastic resection compromises future mapping. F10 replaces that exception with the explicitly supported mastectomy setting; a single-source limitation and exact-version sign-off remain. No fresh current-guideline check was possible. F05 has a suitable clinical head/neck guideline, but that is not a verified public ABSITE outline. F14’s general ATA patient-page claim cannot be promoted into an ultrasound/size selection rule.','',
 '## Frozen compatibility and exact bindings','',
 `- ${verification.frozenCases} other cases and ${verification.frozenNodes} other nodes are exact; only ${verification.changedNodes} target nodes changed. The held F14 case and both later thyroid/DNR tasks are exact. All eleven pilot approvals and all 396 earlier concept definitions remain.`,
 '- Two new scored-construct versions: `concept.varicose-veins.axial-trunk-referral-target.v1` (anatomical target replaces candidacy/preference judgment) and `concept.dcis.sentinel-node-mastectomy.v1` (standard mastectomy replaces the disputed oncoplastic exception). Each records its prior concept and reason. Current catalog 398; no silent FSRS-history transfer.',
 `- Timing rows ${verification.timingsBefore} → ${verification.timingsAfter}; every prior row is exact. Exact order records ${verification.exactOrdersBefore} → ${verification.exactOrdersAfter}; every old record and all registry bytes outside the appended block/list entry are exact. All twelve new records explicitly do not execute local tests.`,
 '- Four new timed keys are planned/outside tests. F05’s three prospective biopsies now receive previews; F10’s deferred SLNB is a preview and ALND retains no-test classification. Static live previews 1,467 → 1,468 (+3 neck, -1 HIDA CT, -1 breast mammography); terminal timed keys 138 → 139. The inventory expectation update is justified by these explicit changes, not a loosened assertion.',
 '- No node IDs, result gates, keyed service IDs, durations, routes, selector logic, save formats, frozen encounters or clinical approvals are rewritten. No wait duration was baked into prose.','',
 '## Linter result and batch 2','',
 `Same v6 linter before/after: ${lint.before.uniqueVariants} variants, ${lint.before.profileContexts} canonical/finite contexts. Whole findings ${lint.before.findings} → ${lint.after.findings}; flagged variants ${lint.before.variantsWithFindings} → ${lint.after.variantsWithFindings}. Selected 17: ${lint.selected.beforeFindings} → ${lint.selected.afterFindings} findings; new owner-rule findings ${lint.selected.beforeOwnerFindings} → ${lint.selected.afterOwnerFindings} (the unchanged F14). All sixteen rewritten variants have zero new owner-rule findings.`, '',
 '| Owner rule | Remaining variants / findings |','|---|---:|',
 ...Object.entries(lint.newRulesAfter).map(([k,v])=>`| ${k} | ${v.variants} / ${v.findings} |`),'',
 `${lint.batch2Candidates.length} unedited variants with new-rule findings are listed for batch 2. Priority uses entry stage and case references, never player exposure/correctness. Tutorial/basic intent and clinical review status are retained separately. Heuristics do not validate clinical plausibility or difficulty; the anatomy check is a bounded shoulder vocabulary, and expanded imaging names can cause lexical category false positives. No correctness collector, attempt-statistics input or analytics was added.`, '',
 '## Validation','',
 '| Check | Exact result | Log |','|---|---|---|',
 ...[['Clinical-content',results.clinical],['Touched presentation suites',results.presentation],['Focused binding/inventory',results.bindings],['Final domain fixture/binding suites',results.domainFocused],['Player fixture and timeout follow-up',results.playerRepairs],['Entry-release player timeout control',results.playerEntryControl],['Full player (preload, threads, two workers)',results.player],['Full game-domain (sandbox threads, one worker)',results.domain]].map(([k,v])=>`| ${k} | ${cell(v.tests??'RUNNING; no final summary')} tests; ${cell(v.files)} files; ${cell(v.duration)} | ${v.log} |`),
 `| Cue-lint tests | ${results.lint.pass}/${results.lint.tests} pass; ${results.lint.fail} fail | ${results.lint.log} |`,
 `| Typecheck | ${results.typecheck.workspaces.length} workspaces; ${results.typecheck.errors?'ERRORS':'no TS errors'} | ${results.typecheck.log} |`,'',
 'Player tests use the existing command-local `adversarial-r5-player-preload-20261102.cjs`; it intercepts only Vite’s optional Windows `net use` probe with EPERM. The file is unchanged and other child-process calls remain real. Earlier failed/incomplete logs are retained: option parity was repaired without changing its assertions; old timing tests now use full question-version identities; the historical round-seven test uses its retained release view. Partial full runs stopped for authoring/type/binding corrections are not counted as full passes. No timeout, exception list, Level 4/5 assertion or evidence file was weakened.','',
 `The initial complete player run had ${results.playerInitial.tests}; the initial complete domain run had ${results.domainInitial.tests}. These diagnostic runs are retained separately and are not merged into the final counts. All three original player simulation timeouts pass both the focused current-bank run and an entry-release control at the original deadlines; the final full player run also passes. The only player edit is the historical flagged-v4 fixture in flagFreeze.test.tsx. No gift, nurse, spatial, routing, timeout or cloud implementation changed.`, '',
 '### Content-driven fixture repairs', '',
 '- `apps/player/src/session/flagFreeze.test.tsx`: obtain the exact reported v4 from the retained pre-flag release. The frozen ID and campaign/cloud/flag/recovery assertions are unchanged.',
 '- `packages/game-domain/tests/approved-clinical-admission.test.ts`: include the two explicitly added construct versions in the permitted selection catalog.',
 '- `packages/game-domain/tests/gs028-20261002-batch.test.ts`: use live stable-case primary concepts for selection/learned-history setup and reflect five new exact external preview rows (27 → 32; external-only 12 → 14).',
 '- `packages/game-domain/tests/gs028-20261003-batch.test.ts`: use live case and full-version timing identities; enumerate actual three/four-option branches rather than nonexistent third distractors; execute each non-execution record’s actual choice. Exact rows 19 → 20. All service/XP/idempotence assertions remain.',
 '- `packages/game-domain/tests/gs028-20261007-batch.test.ts`: retain all 80 nodes and test every current choice (319 → 316 following three four-to-three-option rewrites); update source-derived static cumulative pool/concept counts.',
 '- `packages/game-domain/tests/gs028-20261007-variety2-batch.test.ts`: use current case/full-version timing identities, cover every actual choice (320 → 319), account for three prospective neck-biopsy previews (26 → 29 exact rows; non-execution 21 → 24), and update static pool/concept counts.',
 '- `packages/game-domain/tests/patient-supply.test.ts` and `tests/diagnostics/patient-supply.test.ts`: catalog 396 → 398 and three deterministic inline snapshots for the new bank’s seeded cohort mix. `question-flags-supply-candidate-20261104.json` records the exact current results; an unchanged-code entry-release control reproduces all old snapshots. `question-flags-snapshot-change-review-20261104.json` verifies no outside changes except the documented catalog count/comment. The normal final focused run and standalone control pass without snapshot updating. Commands, deadlines, routing and behavioral assertions remain.', '',
 `Final-run input lock: ${Object.keys(lock.files).length} source/test/evidence hashes; changes since start: ${windowChanges.length}. ${windowChanges.length?windowChanges.map(x=>x.path).join(', '):'All monitored inputs remain stable.'}`,'',
 ...(complete?[`Final domain failure categories: ${results.domain.failures.filter(f=>f.kind==='level5_input_binding').length} input-binding guard; ${results.domain.failures.filter(f=>f.kind==='legacy_loaded_state_hash').length} legacy initial loaded-state hashes; ${results.domain.failures.filter(f=>f.kind==='timeout').length} timeouts; ${results.domain.failures.filter(f=>f.kind==='requires_review').length} other failures. Every test outside Level 5 passes. The earlier checkpoint, normal-operations and Level 4 timeouts did not recur. Exact names, errors and locations: \`${failurePath}\`.`, '']:[]),
 'Full-domain failure headers (if any):','',
 ...(results.domain.failureHeaders.length?results.domain.failureHeaders.map(x=>'- '+x):['- '+(complete?'None.':'Pending full-domain completion; no result inferred.')]),'',
 'The separate synthetic-load control in `question-flags-legacy-diagnosis-20261104.json` checks all 25 level/schema combinations against the entry/current clinical releases under unchanged current domain code. It isolates the two newly added empty histories in a disposable comparison copy and checks frozen encounters. It is diagnostic evidence, not a passing Vitest run, production normalization, fixture refresh or evidence rebind. It covers the initial loaded-state hash; assertions after a failing initial hash do not run, so it does not establish continued-play equivalence. The final failure JSON separates the input guard, legacy loaded-state hashes, timeouts and any other failures.','',
 '## Exact Level 5 bound inputs changed by this milestone','',
 ...verification.boundInputs.changedThisMilestone.map(x=>'- Edited: `'+x.path+'`.'),
 ...verification.boundInputs.addedThisMilestone.map(x=>'- Added: `'+x.path+'`.'),'',
 'Tests, linter tooling and documentation are outside this content-input collection. Existing manifest drift also includes `packages/game-domain/src/reducer.ts` and `packages/game-domain/src/waiting-destinations.ts`; both already differed at entry and were not edited here. The exact recorded/entry/current hashes are in the verification JSON. The manager must run the actual rebind and any required legacy behavioral refresh after acceptance; copying hashes or suppressing guards is not a rebind.','',
 '## Exact implementation/test files','',
 ...modified.map(x=>'- Modified: `'+x+'`.'),
 ...[...added].filter(x=>/\.(?:ts|mjs)$/.test(x)).sort().map(x=>'- Added: `'+x+'`.'),'',
 'Generated review/source/audit/verification artifacts, immutable before snapshots and all logs are enumerated with hashes in the ownership manifest. No unrelated work was reverted. The scope audit records concurrent changes to `apps/player/src/session/cloud/coordinator.ts` and `apps/player/src/session/cloud/gameSession.ts`; this worker did not edit either file. All other protected inputs are exact unless a separate shared-tree change is explicitly listed in verification.','',
 '## Manager next actions','',
 '1. Review the seventeen-item packet and the six owner lessons; send the sixteen drafts through independent adversarial review. They have no author-granted PASS or clinical approval.',
 '2. Supply a permitted, verified thyroid ultrasound/size profile and atomic mapping for F14, or retire/withhold that variant. Resolve F05 public ABSITE scope or retire it from that track. Decide whether to retain the simpler F15 mechanism item.',
 '3. Inspect the two construct-version decisions and the static preview/inventory changes; accept exact versions, then perform the Level 5 rebind/behavioral refresh and release checks in the manager lane.',
 '4. Preserve the owner’s no-correctness-analytics rule. Batch 2 is a candidate backlog only; no further questions were rewritten. Manager owns publication and the later explicit GitHub-backup authorization.',''];
fs.writeFileSync(handoffPath,lines.join('\n'));
const paths=[...modified,...added].sort();
const files=paths.map(path=>({path,kind:modified.includes(path)?'modified':'added',sha256:path===manifestPath?null:sha(path),bytes:path===manifestPath?null:fs.statSync(path).size}));
for(const f of files.filter(f=>f.path!==manifestPath)){
 const text=readText(f.path);assert(!/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(text),'Email-like content must be reviewed/redacted before handoff: '+f.path);
}
const manifest={checkedOn:'2026-11-04',status:complete?'validation_recorded_drafts_pending_review':'full_validation_running',results,
  sourceStateLock:lockPath,windowChanges,files,
  note:'Self hash omitted to avoid recursion. Earlier failed/incomplete runs remain diagnostic evidence. The full final-repaired player and final-integrated domain logs are the final acceptance results; do not merge counts across attempts. No Git was used.'};
fs.writeFileSync(manifestPath,JSON.stringify(manifest,null,2)+'\n');
console.log(JSON.stringify({complete,files:files.length,results:Object.fromEntries(Object.entries(results).map(([name,r])=>[name,
 Object.fromEntries(Object.entries(r).filter(([key])=>!['failureHeaders','failures','workspaces'].includes(key)))])),
 domainFailureCategories:Object.fromEntries([...new Set(results.domain.failures.map(f=>f.kind))].map(kind=>[kind,results.domain.failures.filter(f=>f.kind===kind).length])),
 windowChanges:windowChanges.map(x=>x.path)},null,2));
