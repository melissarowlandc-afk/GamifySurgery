import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const fileHash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const scope=read('docs/research/question-stats1-acceptance-scope-20261108.json');
const validation=read('docs/research/question-stats1-acceptance-validation-20261108.json');
const packet=read('docs/research/question-stats1-accepted-20261108.json');
const responses=read('docs/research/question-stats1-review-response-20261108.json');
const lint=read('tools/question-quality/question-stats1-accepted-lint-20261108.json');
const ledger=read('docs/research/sources-question-stats1-accepted-20261108.json');
const handoff='docs/research/question-stats1-acceptance-handoff-20261108.md';
const receiptPath='docs/research/question-stats1-acceptance-files-20261108.json';
const dirs=['docs/execplans','docs/research','packages/clinical-content/src','tools/question-quality','tools/question-quality/fixtures'];
const newPaths=dirs.flatMap(dir=>fs.readdirSync(dir,{withFileTypes:true}).filter(e=>e.isFile()&&
 (e.name.includes('question-stats1-accept')||['question-stats1-manager-decision-20261108.md','question-stats1-review-response-20261108.json'].includes(e.name))&&
 e.name!==path.basename(receiptPath)).map(e=>dir+'/'+e.name));
newPaths.push('apps/player/src/questionStats1SaveCompatibility.test.ts');if(!newPaths.includes(handoff))newPaths.push(handoff);newPaths.sort();
const esc=v=>String(v??'').replaceAll('|','\\|').replaceAll('\n','<br>');
const table=(hs,rs)=>'| '+hs.join(' | ')+' |\n| '+hs.map(()=> '---').join(' | ')+' |\n'+rs.map(r=>'| '+r.map(esc).join(' | ')+' |').join('\n')+'\n';
const link=p=>'['+p+'](../../'+p+')';
const acceptedRows=packet.map(p=>[p.id,'`'+p.questionVariantId+'`',p.independentVerdict,p.wordCounts.after.combinedBeforeTask]);
const means=key=>packet.reduce((sum,p)=>sum+p.wordCounts[key].combinedBeforeTask,0)/64;
const closing=validation.results;
const lines=[
 '# Stats1 acceptance handoff - 2026-11-08','',
 'Implemented the [manager decision](question-stats1-manager-decision-20261108.md) in the shared working tree: **all64 stats1 variants are admitted by the default projection**, comprising42 exact independent PASS versions and22 directed repairs with new question versions. All remain **`needs_clinician_review`**. Editorial acceptance is not clinical approval; Melissa Rowland remains clinical sign-off. No commit, push, deployment, release-worktree operation or rebind was performed.','',
 'The16 named statistics families are covered. The four N2 statistics cases are byte-exact and unchanged by explicit manager direction. All18 existing scored concept IDs remain stable; no new concept version or FSRS history migration. Owner statistics style remains one skill, minimal constructed data and short worked feedback. The authoring standard is unchanged from its owner-statistics v15 update.','',
 'Artifacts: [accepted before/after packet](question-stats1-accepted-20261108.json), [every review note and response](question-stats1-review-response-20261108.json), [source ledger](sources-question-stats1-accepted-20261108.json), [scope and hashes](question-stats1-acceptance-scope-20261108.json), [exact validation and failure titles](question-stats1-acceptance-validation-20261108.json). **Key shown first for review only; runtime choices remain randomized.** The original [stats1 packet](question-stats1-20261108.json), [inventory](question-stats1-inventory-20261108.json), both independent reviews, all original source/data/claims and immutable captures stay exact.','',
 '## Per-item decision and repairs','',
 'The manager accepts the22 repairs after author self-check; they are not relabelled independent PASS. Every key is source-supported with hold status **none**. Accepted exact versions and visible pre-task word counts:','',
 table(['ID','Accepted exact variant','Original independent verdict','Words before task'],acceptedRows),
 'The22 review responses:','',
 table(['Item','What changed'],responses.map(r=>[r.id,r.summary])),
 'S21 now uses mutually exclusive current/former/never smoking-status categories at admission, one category per independent patient, retaining the six counts. S30 explicitly selects consecutive historical charts regardless of infection. S54 uses a single2-day threshold. S55 and S59 no longer introduce an unstated null or point estimate. NNT distractors lie on both sides of the key; ARR distractors are feasible same-scale errors. The word/finding set outside the22 repairs is exact.','',
 '## Source binding and preservation','',
 '`QUESTION_STATS1_ACCEPTED_SOURCE_RELEASE` is the explicit `stats1-accepted` view from '+link('packages/clinical-content/src/question-stats1-accepted-20261108.ts')+'. Every row and header points to that source; each complete case, node and question has a frozen SHA-256 in the accepted packet and tests. The source reuses the42 PASS case/question objects exactly and replaces only22 definitions. All64 cases remain single-node, so ordinary node/header overrides suffice; no new whole-case relation, selector or domain-side acceptance check.','',
 'Superseding G06 and F3-01 removes their old manifest-triggered concept/timing exports. The integration restores the **same G06 collection-population concept at the same registry position** and keeps **both old timing tuples at their original positions**. Thus every prior meaning object, meaning order and2219 old wait rows remain exact. The64 new statistical-analysis tuples are `no_test`, with no clinical service order or new domain order record. All other69 acceptance rows,1423 legacy bindings,3 replacement relations and1077 unrelated cases are unchanged.','',
 '## Counts and hashes','',
 table(['Default metric','Before','After'],[
  ['Cases',scope.before.cases,scope.after.cases],['Decision nodes',scope.before.nodes,scope.after.nodes],
  ['Registered meanings',scope.before.registeredMeanings,scope.after.registeredMeanings],['Active concept IDs',scope.before.activeConcepts,scope.after.activeConcepts],
  ['Accepted manifest rows',scope.before.acceptedRows,scope.after.acceptedRows],['Legacy bindings',scope.before.legacyBindings,scope.after.legacyBindings],
  ['Whole-case relations',scope.before.wholeCaseRelations,scope.after.wholeCaseRelations],['Timing rows',scope.before.timingRows,scope.after.timingRows],
 ]),
 'Manifest version: `'+scope.after.manifestVersion+'`. Default has1447 distinct active question IDs. SHA-256 values hash `JSON.stringify` of the named object:','',
 table(['Object','Before','After'],[
  ['Default release','`'+scope.before.liveSha256+'`','`'+scope.after.liveSha256+'`'],
  ['Ship manifest','`'+scope.before.manifestSha256+'`','`'+scope.after.manifestSha256+'`'],
  ['Timing registry','`'+scope.before.timingSha256+'`','`'+scope.after.timingSha256+'`'],
  ['Reviewed stats1 source','`'+scope.reviewedSourceSha256+'`','Unchanged'],
  ['Accepted stats1 source','New explicit view','`'+scope.sourceViewSha256+'`'],
 ]),
 '## Feedback, evidence and cue checks','',
 'Mean combined pre-task words (including every exhibit caption, header, label and cell) are **'+means('before').toFixed(1)+' before / '+means('reviewedRoundOne').toFixed(1)+' reviewed draft / '+means('after').toFixed(4)+' accepted**. Accepted range12-34; all64 meet the manager <=35-word target. All explanations have3 short lines with the actual rule, worked application and an offered error. Patient framing remains minimal;52 staff discussions retain staff identity without patient demographics, and12 patient cases retain named age/sex lines.','',
 'Re-ran the unchanged advisory linter on all64 accepted variants /128 canonical-and-finite contexts: **55 original findings ->0 reviewed ->0 accepted, zero suppressed**. Full exact fields are in '+link('tools/question-quality/question-stats1-accepted-lint-20261108.json')+'. Each accepted packet record has a cover-the-key, one-skill, category, decisive-finding, length, source and feedback self-check. No claim of harder difficulty or independent PASS is made for the22 repairs; focused practice is the owner intent.','',
 'The ledger reuses22 existing source records /20 official URLs and21 basis claims. It retains the original97 atomic claims and adds23:22 repaired constructed-data applications plus the expected-cell formula, for120 claim records including archived versions. Existing access and basis last-checked dates are preserved; this is offline ledger use and independent arithmetic, not a new retrieval/currentness check. No external source text, invented clinical performance, medical cutoff, placeholder citation or proprietary corpus was added. Each new application and source remains needs_clinician_review. Some method facts have only one adequate handbook/government source; that limitation stays explicit.','',
 '## Exact historical tests and presentation integration','',
 'The intake captured1396 protected paths. **1378 remain byte-identical;18 exact integration/test files change.** The source-migration receipt records their original captured hashes/bytes and exact closing hashes. Historical tests first verify the full64-case/manifest/timing delta, then restore their original epoch. No original capture, expected hash or historical assertion was refreshed. Immutable receipt parsing is cached to eliminate repeated parsing in source guards; no timeout, tick bound or codec budget was increased.','',
 'Three narrow current-presentation adaptations preserve the frozen PASS wording:','',
 '- Exact accepted staff statistics cases may retain their reviewed presentation-only profile. Tests require precisely the three keys id/chiefComplaint/presentation, the same staff presentation, and no demographics/vitals. Other employee cases retain their no-profile assertion. Actual staff save tests also prove these remain NP discussions, not patient encounters.',
 '- S47 is pinned verbatim: its complete question is followed by the requested imperative rounding instruction. Every other original question-mark assertion remains.',
 '- The older literal character-length test still finds10 accepted statistics residuals (S01-S04, S32, S33, S35, S53, S54, S57). These include conventional test names and single-character inside/below/above differences. All10 exact IDs, whole-case hashes and manifest decision are pinned, and every listed exception must remain an actual violation. No general budget or cue-linter rule was relaxed. The reviewer accepted conventional procedure-name outliers for focused practice. This residual is disclosed rather than changing PASS content or padding options.',
 '',
 'The pre-existing flags3 fresh-admission test now expects the explicit stats1 source only for its superseded statistics case; the dysphagia and hernia source expectations stay exact. All old frozen flags3 witnesses remain. A historical N3 reconstruction adds only the stable missing G06 meaning through the same registry stage; no N3 question/source, domain or routing file changes.','',
 '## Save and journal compatibility','',
 '**All256 new stats tests pass:**64 accepted-default format-3 reopen/completions,64 original waiting saves,64 original in-progress saves, and64 committed original admission/scheduling journal replays. This is48 patient tests and208 staff-discussion tests. The actual patient admission and NP discussion scheduler are exercised with one real source case isolated for deterministic selection, while ordinary initialization retains its real tutorial templates.','',
 'These tests assert original frozen full node/question/concept identities, randomized choice order, prior card/history retention, exactly-once scoring, completed reloads and durable journal state under the new default context. No migration or re-selection of a newer question is allowed. Already-open or frozen encounters intentionally retain their original longer wording; newly admitted encounters use stats1. The existing31 ship-save compatibility tests also all pass. Save/cloud implementation, format3, codec limits and240-tick readiness bound are unchanged.','',
 '## Exact closing validation','',
 table(['Directory / command','Exact closing output'],[
  ['packages/clinical-content: `npm.cmd test -- --pool=threads`',closing.clinical.fileSummary+'; '+closing.clinical.testSummary+'; '+closing.clinical.duration+'; exit '+closing.clinical.exitCode],
  ['packages/game-domain: `npm.cmd test -- --pool=threads`',closing.domain.fileSummary+'; '+closing.domain.testSummary+'; '+closing.domain.duration+'; exit '+closing.domain.exitCode],
  ['packages/game-domain: `npm.cmd test -- --pool=threads tests/patient-supply.test.ts`',closing.patientSupplyFocused.fileSummary+'; '+closing.patientSupplyFocused.testSummary+'; '+closing.patientSupplyFocused.duration+'; exit '+closing.patientSupplyFocused.exitCode],
  ['Root: `npm.cmd run typecheck`','All7 workspaces pass; exit0'],
  ['apps/player: focused four-file command below',closing.player.fileSummary+'; '+closing.player.testSummary+'; '+closing.player.duration+'; exit '+closing.player.exitCode],
  ['Root: `npm.cmd run clinical:lint:test`',closing.lint.passed+' pass / '+closing.lint.failed+' fail; '+closing.lint.durationMs+'ms; exit0'],
 ]),
 'Player command (existing command-local sandbox preload, restored afterwards):','',
 '```text',closing.player.command,'```','',
 'The preload is `tools/question-quality/adversarial-r5-player-preload-20261102.cjs`; it handles only the unavailable optional Vite drive-mapping probe. It does not alter save, content, network or codec behavior. Successful typecheck workspaces: clinical-context-workbench, player, balance-config, clinical-authoring, clinical-content, clinical-research and game-domain. Clinical-content adds93 tests to the1473-test baseline.','',
 'The domain total grows5187 ->5249 because question-ship-gate.test.ts parameterizes non-review.n manifest rows:71 -2 +64 adds62 data-driven acceptance tests. No domain file was edited. Before integration the domain run was5158pass/28fail/1skip,309.58s; afterwards'+closing.domain.testSummary+','+closing.domain.duration.split(' ')[0]+'. The final full run reproduces the baseline10000ms patient-supply timeout. The unchanged single-file diagnostic result is recorded below. All'+closing.domain.failureTitles.length+' remaining titles are identical to the baseline:','',
 '- One stale admitted-concept fixture expects585 meanings; the count was already606 before this task and stays606.',
 '- One Level5 source-binding test first fails on the pre-existing balance guidance-tips.ts mismatch. This milestone adds three changed bound clinical inputs listed below; evidence was not rebound.',
 '- Twenty-five legacy loaded-state SHA failures: Level0-4 x schema5-9. These all reproduce before this task; manager owns evidence refresh.',
 '- One patient-supply inventory timeout at10000ms, also present in the pre-change baseline. Its focused diagnostic uses the original assertions and timeout; no runtime performance code was changed.',
 '',
 'The sole player failure is also exact before/after: `separateCampaign.test.ts > explicit separate account campaign for a divergent local branch > retains real retired encounters which no longer exist in the playable state` throws `CloudCodecError: JSON string exceeds the codec limit` at codecJson.ts:63, called from separateCampaign.test.ts:54. No new domain or player failure title. No full-green domain/player claim. The [validation JSON](question-stats1-acceptance-validation-20261108.json) contains every full title, command, raw-log path and log SHA.','',
 '## Files changed','',
 'Existing runtime integration files (4; projector implementation unchanged):','',
 ...scope.runtimeFileChanges.map(r=>'- '+link(r.path)),
 '',
 'Existing tests/support files (14; no save/cloud implementation):','',
 ...scope.existingFileChanges.filter(r=>!scope.runtimeFileChanges.some(q=>q.path===r.path)).map(r=>'- '+link(r.path)),
 '',
 'New milestone files:','',...newPaths.map(p=>'- '+link(p)),'- '+link(receiptPath)+' (self-listed receipt; no self-referential hash)','',
 'Also append-only `docs/handoffs/CURRENT_THREAD_HANDOFF.md`. The local `.local-dev/question-stats1-acceptance-20261108/` directory holds raw command logs, exit receipts and original local code/doc snapshots for delta construction. It contains no external source article text or copied emails. All other owner/worker edits are preserved.','',
 '## Level5 inputs and remaining work','',
 '**Exactly three already-bound inputs changed** (raw file SHA-256; distinct from object hashes):','',
 table(['Bound input','Intake SHA-256','Closing SHA-256','Existing evidence SHA-256'],scope.levelFive.boundInputChanges.map(r=>['`'+r.path+'`','`'+r.beforeSha256+'`','`'+r.afterSha256+'`','`'+r.evidenceSha256+'`'])),
 'The manifest is another changed runtime dependency, not separately named in the older evidence input map. Six stats runtime files become newly default-loaded; the four reviewed ones remain byte-exact:','',
 table(['Newly loaded dependency','Closing raw SHA-256'],scope.newDefaultDependencies.map(r=>['`'+r.path+'`','`'+r.sha256+'`'])),
 'The Level5 evidence file and pins are untouched; **no rebind**. The manager owns release integration, the stale registry/evidence fixtures, the unrelated cloud codec failure, clinical sign-off and any future rebind. Easy/focused practice and the exact character-length residuals are accepted editorial intent, not hidden measurements or analytics.','',
 'Author/source/packet/scope/validation reproduction checks pass; commands are in the validation receipt. No Git, installs, network, agents, external messages, deploy or release-worktree operation. No playtest origin or save-opening pathway changed. This is a local checkpoint with no new remote backup; the manager owns any separately authorized "push to GitHub" checkpoint. Stop at this bounded handoff.','',
];
const text=lines.join('\n');if(process.argv.includes('--check'))assert.equal(fs.readFileSync(handoff,'utf8'),text);else fs.writeFileSync(handoff,text);
const receipt={checkedOn:'2026-11-08',newFiles:newPaths.map(p=>({path:p,sha256:fileHash(p)})),existingEdits:scope.existingFileChanges,
 sharedAppend:{path:'docs/handoffs/CURRENT_THREAD_HANDOFF.md',edit:'append-only stats1 acceptance block'},self:{path:receiptPath,hashExcluded:true},
 changedLevelFiveBoundInputs:scope.levelFive.boundInputChanges.map(r=>r.path),clinicalApproval:false,deployPerformed:false,rebindPerformed:false};
if(process.argv.includes('--check'))assert.deepEqual(read(receiptPath),receipt);else fs.writeFileSync(receiptPath,JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify({handoff,newFiles:newPaths.length+1,existingFiles:scope.existingFileChanges.length,accepted:64,manifestRows:133,clinical:closing.clinical.testSummary,statsSaveTests:256,newDomainOrPlayerFailures:0},null,2));
