import fs from 'node:fs';
import assert from 'node:assert/strict';
import {hash} from './preservation.mjs';
const dir='.local-dev/question-new-n2-round2-20261104';
const validation=JSON.parse(fs.readFileSync(dir+'/validation.json','utf8'));
assert.equal(validation.complete,true);
const audit=JSON.parse(fs.readFileSync(dir+'/scope-audit.json','utf8'));
const result=name=>validation.results.find(r=>r.name===name);
const player=result('player-full-native');
const counts=r=>r.tests??`${r.typecheckWorkspaces.length} workspaces`;
const publicPath='docs/research/question-new-n2-round2-20261104.md';
const rows=[
 ['Final clinical projection/provenance','clinical-handoff'],['Final native N2 and timing inventory','domain-handoff'],
 ['Full clinical-content','clinical-latest'],['Full domain','domain-full'],['Full player, native config loader','player-full-native'],
 ['Seven typechecks','typecheck-exact'],
].map(([label,name])=>{const r=result(name);return `| ${label} | ${counts(r)} | ${r.nativeExit} | \`${name}.log\` |`;}).join('\n');
const text=`# N2 round-two handoff - 2026-11-04

Revised all **37 REVISE** items; retained the **two exact PASS** versions. [Review packet](question-new-n2-round2-20261104.json), [manual self-checks](question-new-n2-round2-self-check-20261104.json), [source ledger](sources-question-new-n2-round2-20261104.json), [ExecPlan](../execplans/question-new-n2-round2-20261104.md).

Packet SHA-256: \`${validation.packet.sha256}\`. It says **key shown first for review only**. Runtime choices shuffle and their seeded order freezes on admission. Every new version remains \`needs_clinician_review\`; \`pipelinePassed:false\`. New independent review, manager acceptance and Melissa Rowland's clinical sign-off remain pending.

## Construction and scope

Studied all 68 exact independently passed batch-one projections, especially B02/B25/B34/B35/B35-context. [Calibration notes](question-new-n2-round2-calibration-20261104.md) record the construction lessons. Each returned item now has a manual cover-key attack, same-stage/category check, raw interpretation followed by a consequential decision, predicted difficulty, single-best reasoning, deletion test and a counterfactual for every distractor. Original reviewer notes and the authored response remain in the packet. Predictions are **36 moderate / one hard**, uncalibrated author judgments rather than independent results.

Rejected the first phosphate chronology-only pair and directive oxygen-withdrawal foil before packaging. Rebuilt them around separate exposure/surveillance and support-dependent recovery decisions. Removed the naloxone lead-in that preselected continued support, checked constructed study arithmetic, repaired the safety interval/p-value consistency, and corrected the SGLT2 scenario to the source-qualified elective prolonged-fasting population. The unchanged cue linter reports **zero findings across 39 variants / 78 contexts**, with no rule changes, suppressions or exceptions. No revised key is uniquely longest.

Three locally drawn original schematics require interpretation: duct representation, wound-surface/feeding-path selection and arterial/venous continuity. PNGs were rendered and visually inspected; drawing sources are retained. No patient photographs or copied source figures.

The packet has **15 Level-3 / 24 Level-4 cases**; 15/22 respectively were revised, with both PASS at Level 4. Sixteen scored meanings retain their IDs. Twenty-one changed meanings have explicit new IDs without history transfer or reset; old definitions, exact choice/timing records and saved charts remain available. These revisions add **no cases or active patient concepts**: the observed prior/final assembly has ${audit.beforeCounts.cases} cases and ${audit.beforeCounts.activePatientConcepts} active patient concepts in both. Registered concepts change ${audit.beforeCounts.registeredConcepts} to ${audit.afterCounts.registeredConcepts} because old versions remain. **New version IDs are not evidence of additional independent fresh supply**; HRM, DNR, postoperative DVT, ulcer and other overlap needs manager consolidation review. Do not count this revision round as another 21 fresh concepts toward the 75-100-per-level target.

## Preservation and shared work

All **51 captured N1 files** are byte unchanged; no N1 clinical content, tests, packets, tools or assets were edited or re-self-reviewed. Both N2 PASS item/question/case hashes match intake: irreversible ischemia and case-mix standardization.

Twenty original N2 artifacts, including definitions, evidence, original review packet and independent review, remain unchanged. One owned original N2 native test now binds explicitly to its preserved v1 assembly after two observed v1/v2 scope failures; no assertion or clinical definition was removed. Its before/after hashes and exact two changes are retained locally.

N2 registration was a marked append plus stable prior-release/timing export names. Concurrent batch2a round3 subsequently renamed two export bindings inside the N1 blocks; their projection bodies remain exact and the N1 files/cases remain intact. This lane preserved those peer edits and recorded the two names rather than reverting them. Shared file edits are narrow hunks; port hunks, not whole files.

## Sources and review holds

**${audit.claims} evidence-claim records / ${audit.sources} source records / ${audit.sourcePublicationKeys} DOI-or-URL keys**; ${audit.onePublicationClaims} claims have one publication key. Repeated records are not independent corroboration. Original check/access dates and license/authority assessments remain; 15 new local syntheses disclose their derivations and basis dates. No external source was retrieved or freshly verified. Constructed observations, study counts, confidence intervals and protocol criteria are not empirical rates or clinical thresholds.

Six exact clinical extensions need targeted source verification: acquired-bleeding panel priority, exposed-cortex coverage application, progressive extravasation escalation, gastrojejunal dilation/revision ranking, LMWH indication/purpose and temporary abdominal closure/reassessment. Their exact claim IDs and limitations are in the source ledger. The transplant workup ranking and other exact case applications also retain clinical-review limits. Clinical review is not supplied by tests or author predictions.

## Validation

All commands used \`npm.cmd\`; Vitest used \`--pool=threads\`. Native exit files and full logs are in \`.local-dev/question-new-n2-round2-20261104/\`.

| Check | Actual result | Native exit | Local log |
| --- | --- | --- | --- |
${rows}
| Linter tests | 33 passed / 0 failed | 0 | \`lint-tests.log\` |

The final **42 clinical checks** and **176 native checks** cover v2 projection, both frozen PASS versions, source/date bindings, ordinary Level-3/4 admission/completion, shuffled keys, exact previews, due/unseen/in-progress supply and legacy-save/history preservation. Separate final inventory checks pass 8/8. No additional local diagnostic execution was added: all 38 revised testing previews are explicit external-only non-execution records. Fourteen offered previews/four keyed previews became 38/12 (+24/+8); all old exact tuples remain.

The full tree is **not green**. Full clinical has seven failures: three batch2b assertions use the final stage instead of their historical assembly/timing, one frozen N1 test's stage alias now includes the peer round3, one longest-key guard and two employee-demographic guards identify peer content. The final selected clinical rerun repeats those seven failures (105 pass / seven fail), including all 42 N2 checks passing. Full domain has 34 failures: 26 Level5 raw-binding/loaded-state digest checks, seven other shared count/pool/route/simulation assertions, and one owned inventory expectation. The inventory delta was repaired afterward and its final eight-check rerun passes; the original full-run failure is retained. The final shared domain rerun has 185 pass / two patient-supply failures: five peer registered concept IDs and a simulation snapshot. The prototype list now passes after its peer update. No unowned snapshot or frozen N1 test was rewritten.

Full player: **${player.tests}**, exit **${player.nativeExit}**. The two failures are the existing cloud diagnostic-workload and retained-snapshot tick performance budgets (observed 95.82 and 17.04 against a limit of 16). Exact assertions are indexed locally in \`player-failure-index.json\`; cloud/performance implementation remains outside this lane. The default loader failed at startup with EPERM and the runner loader failed on CJS require. A temporary native-loader copy changes only the existing private-module plugin import's .ts extension; the same plugins, test assertions and timeouts run, with two workers. Application config was not edited. Its source/copy hashes and one-change receipt are retained. Manager should rerun the ordinary config in its integration environment.

The broad snapshot is preserved. One final source-scope clarification explicitly added elective prolonged fasting to the SGLT2 context after that snapshot; choices, IDs, timing, demographics and runtime behavior did not change. Final clinical/native checks and cue generation were rerun afterward. Shared inventory/supply expected-count hunks also moved after the broad run. The packet and local receipts do not claim a single final immutable whole-tree validation window.

## Files and integration

New runtime modules: \`packages/clinical-content/src/question-new-n2-round2-{types,perioperative,abdominal,specialty,research,evidence-20261104,20261104}.ts\`; domain \`question-new-n2-round2-test-orders.ts\`. New clinical/domain tests; \`tools/question-new-n2-round2/\` contains offline evidence/review/audit tools and original SVG sources. Regenerate with \`build-evidence.mjs\` and \`review.mjs\`; authoring/registration/test-copy helpers are one-shot intake operations, not a blind replay recipe. Public PNGs: \`question-new-n2-r2-{ducts,coverage,vessels}.png\`. Packet, self-check, calibration, source ledger and this report are new research artifacts.

Shared hunks: marked registration appends in the four files below; N2 original native-test historical context; timing-registry count; draft-concept expected list; +24/+8 timing inventory; +21 registered-version/early-stage supply expectations. Original N2 sources/concepts/questions and all N1 files are untouched.

Changed existing Level5-bound inputs (no rebind):

- \`packages/clinical-content/src/index.ts\`
- \`packages/clinical-content/src/synthetic-content.ts\`
- \`packages/clinical-content/src/answer-choice-timing.ts\`
- \`packages/game-domain/src/test-choice-orders.ts\`

Eight new runtime modules and three display PNGs are additional dependencies to include when the manager binds the release tree. No Level5 evidence, pin or checkpoint was written. Full exact file/hash inventory, failure headers/assertions, broad/final source windows and preserved-version receipts are in the local handoff/validation files.

No Git, install, network retrieval, agents, browser, reducer/player runtime-code/cloud/Supabase edit, release/deployment, external message or opening-pathway change. This lane has no verified GitHub checkpoint. After acceptance, the owner can say **"push to GitHub"** for the manager's separately authorized backup.
`;
fs.writeFileSync(publicPath,text);
const localText=text.replace(/\]\(((?:question-new-n2|sources-question-new-n2)[^)]+)\)/g,'](../../docs/research/$1)')
 .replace('](../execplans/question-new-n2-round2-20261104.md)','](../../docs/execplans/question-new-n2-round2-20261104.md)');
fs.writeFileSync(dir+'/HANDOFF.md',localText+`\n\nLocal receipts: validation.json, scope-audit.json, scoped-files.json, baseline.json, owned-runtime-inputs.json, post-snapshot-clarifications.json, owned-test-scope-adjustments.json, player-config-loader-receipt.json and the three failure indexes.\n`);
const current='docs/handoffs/CURRENT_THREAD_HANDOFF.md',before=fs.readFileSync(current);
const marker='<!-- BEGIN N2 ROUND2 HANDOFF 20261104 -->';
assert.ok(!before.includes(Buffer.from(marker)),'Do not append this handoff twice.');
const append=`\n\n${marker}\nN2 round two: all 37 REVISE rewritten; two exact PASS and all 51 captured N1 files retained. Packet: docs/research/question-new-n2-round2-20261104.json (SHA ${validation.packet.sha256}). Detailed handoff: ${publicPath}; local receipts: ${dir}/HANDOFF.md and validation.json. Author self-checks 37, calibration 68 exact PASS exemplars, 36 moderate/one hard predicted; no independent acceptance or clinical approval. Lint zero across 39 variants/78 contexts; 33 lint tests and seven typechecks pass. Final clinical42/native176 pass. Full clinical977pass/7fail; full domain4770pass/34fail/1skip, with the one inventory failure subsequently repaired and 8/8 passing. Full player ${player.tests}, exit${player.nativeExit}; failure index retained. Whole-tree integration is not green.\n\nSix new clinical extensions require targeted source verification; all versions needs_clinician_review, pipelinePassed false. Source ledger126 claims/100 records/85 DOI-or-URL keys, original dates retained, no retrieval. Sixteen meanings retain IDs;21 changed-meaning versions retain prior cards, not 21 proven fresh concepts. Original N2 native test scopes v1; original clinical definitions/packet remain exact. Peer batch2a round3 export aliases were preserved and recorded; no N1 file edit. One final elective prolonged-fasting context clarification after broad snapshot is disclosed and final focused checks rerun.\n\nChanged Level5-bound existing inputs: clinical-content/src/{index,synthetic-content,answer-choice-timing}.ts and game-domain/src/test-choice-orders.ts; eight new runtime modules plus three PNGs. Manager handles independent review, source/clinical sign-off, shared-stage/count/snapshot/performance integration and release-tree binding. No evidence/pin/checkpoint rebind, reducer/player runtime-code/cloud/Supabase changes, Git, installs, network, agents, browser, external messages or release. No opening-pathway change. Local/unbacked by this lane; after acceptance remind owner to say "push to GitHub" for a verified checkpoint.\n<!-- END N2 ROUND2 HANDOFF 20261104 -->\n`;
fs.appendFileSync(current,append);
const after=fs.readFileSync(current);assert.ok(after.subarray(0,before.length).equals(before),'Preserve the entire pre-existing handoff prefix.');
fs.writeFileSync(dir+'/handoff-append-receipt.json',JSON.stringify({path:current,beforeBytes:before.length,beforeSha256:hash(before),appendSha256:hash(append),afterBytes:after.length,afterSha256:hash(after),prefixPreserved:true,marker},null,2)+'\n');
console.log(JSON.stringify({publicHandoff:publicPath,localHandoff:dir+'/HANDOFF.md',currentHandoffAppend:true,prefixBytesPreserved:before.length},null,2));
