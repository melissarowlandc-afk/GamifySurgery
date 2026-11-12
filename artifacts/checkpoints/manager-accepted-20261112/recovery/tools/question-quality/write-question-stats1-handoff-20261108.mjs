import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';

const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const fileHash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const packet=read('docs/research/question-stats1-20261108.json');
const inventory=read('docs/research/question-stats1-inventory-20261108.json');
const scope=read('docs/research/question-stats1-scope-20261108.json');
const preservation=read('docs/research/question-stats1-preservation-20261108.json');
const validation=read('docs/research/question-stats1-validation-20261108.json');
const ledger=read('docs/research/sources-question-stats1-20261108.json');
const lint=read('tools/question-quality/question-stats1-lint-20261108.json');
const handoffPath='docs/research/question-stats1-handoff-20261108.md';
const filesPath='docs/research/question-stats1-files-20261108.json';
const dirs=['docs/execplans','docs/research','packages/clinical-content/src','tools/question-quality','tools/question-quality/fixtures'];
const newPaths=dirs.flatMap(dir=>fs.readdirSync(dir,{withFileTypes:true})
 .filter(e=>e.isFile()&&e.name.includes('question-stats1')&&e.name!==path.basename(filesPath))
 .map(e=>dir+'/'+e.name));
if(!newPaths.includes(handoffPath))newPaths.push(handoffPath);
newPaths.sort();
assert.equal(packet.length,64);assert.equal(lint.totals.afterFindings,0);
assert(validation.results.clinical.exitCode===0&&validation.results.typecheck.exitCode===0&&validation.results.lint.exitCode===0);
const esc=v=>String(v??'').replaceAll('|','\\|').replaceAll('\n','<br>');
const code=v=>'`'+esc(v)+'`';
const table=(headers,rows)=>'| '+headers.join(' | ')+' |\n| '+headers.map(()=> '---').join(' | ')+' |\n'+rows.map(r=>'| '+r.map(esc).join(' | ')+' |').join('\n')+'\n';
const link=p=>'['+p+'](../../'+p+')';
const familyRows=[...new Set(inventory.rows.map(r=>r.family))].map(f=>{
 const rows=inventory.rows.filter(r=>r.family===f);
 return [f,rows.map(r=>r.id).join(', '),rows.length,rows.reduce((n,r)=>n+r.currentStemWords,0)/rows.length,rows.reduce((n,r)=>n+r.afterStemWords,0)/rows.length];
});
const b=scope.wordCounts.beforeCombined,a=scope.wordCounts.afterCombined;
const reduction=((b.mean-a.mean)/b.mean*100).toFixed(1);
const lines=[
 '# Stats1 authoring handoff - 2026-11-08',
 '',
 'Draft authoring is complete for all **64 live variants/nodes in the 16 explicitly named families**, in 64 single-node cases. All new versions remain **`needs_clinician_review`**. Independent review and exact manager acceptance are next; nothing is accepted, shipped, committed or deployed by this milestone. Melissa Rowland is the named clinical sign-off.',
 '',
 'The owner asked for focused statistics practice that is short, concrete and learnable. Each draft asks for one statistic, method, design, bias or interpretation. No added clinical action or secondary study decision is used to manufacture difficulty. The new Statistics items section in the [authoring standard](../clinical/question-authoring-standard.md) explicitly supersedes the general two-step/moderate-hard target for statistics.',
 '',
 '## Scope and executable view',
 '',
 'The scope follows the sixteen families explicitly listed in the brief. Four additional live N2 statistics concepts were discovered, inventoried below and left unchanged; the optional scope question received no answer, so the named-family scope assumption was used. Those four are not source-held drafts or silently counted among the 64 rewrites. Ethics, consent and QI are unchanged.',
 '',
 'All 64 cases were inventoried and frozen before authoring. There are **18 stable concept IDs**, because two already-versioned objectives use their own identities. All cases keep their existing case/node IDs and participant eligibility. Every question receives a collision-free new exact variant version; no new concept, selector, route, save format or FSRS migration is introduced. Existing frozen content is retained.',
 '',
 'The direct-import module is '+link('packages/clinical-content/src/question-stats1-20261108.ts')+'. It exports `QUESTION_STATS1_SOURCE_RELEASE` (`stats1-round1`), candidate cases/questions, mappings and 64 exact `no_test` timing rows. Statistical analysis choices are not patient test orders. The module is **not imported by the default release or barrel**, and the global timing registry is unchanged.',
 '',
 'The source view contains 52 existing employee discussions and 12 patient encounters. Staff discussions keep their participant kind without invented demographics. Patient encounters have one minimal named age/sex line and a two-word complaint. All study observations, counts, rates and intervals are explicitly constructed practice data, not empirical clinical performance. Runtime answer shuffling remains enabled.',
 '',
 familyRows.length?'### Family coverage':'',
 '',
 table(['Family','Review IDs','Nodes','Mean before words','Mean after words'],familyRows),
 '## Brevity, feedback and cue checks',
 '',
 'Word counts include rendered names, all Presentation/Current update prose, and **every visible exhibit caption, header, label and cell**. Task and post-answer explanation are counted separately in the packet. A word is a whitespace token containing a letter or digit. Complaint/header chrome is excluded; the neutral two-word title and two-word complaint add only four words, so even including them the largest context is 38 words. Moving prose into an exhibit does not hide it from the count.',
 '',
 table(['Measure','Live before','Candidate after'],[
  ['Mean pre-task words, including exhibit',b.mean,a.mean],
  ['Median pre-task words, including exhibit',b.median,a.median],
  ['Range, including exhibit',b.min+'-'+b.max,a.min+'-'+a.max],
  ['Mean prose-only pre-task words',scope.wordCounts.beforeProse.mean,scope.wordCounts.afterProse.mean],
  ['Contexts above the 60-word hard cap',scope.wordCounts.beforeOver60,scope.wordCounts.afterOver60],
  ['Candidates above the 45-word target','Not the new baseline target',scope.wordCounts.afterOver45],
  ['Raw cue findings',lint.totals.beforeFindings,lint.totals.afterFindings],
 ]),
 'Mean visible pre-task words fall **'+reduction+'%**, from 103.6 to 24.4. Every candidate meets the 45-word target and 60-word hard cap. Each explanation has three short lines: a reusable method, its application, and the closest error. All options are three or four choices in one category, with a single requested quantity/interpretation and credible denominator, pairing, scale or inference errors.',
 '',
 'The unchanged advisory linter was run on every assembled candidate and canonical/finite profile: **64 variants, 128 profile contexts, 55 findings before, 0 after, 0 suppressed**. The [raw lint report](../../tools/question-quality/question-stats1-lint-20261108.json) retains the before findings. Per-item cover-the-key, deletion, category, decisive-finding, source and one-skill self-checks are in the [review packet](question-stats1-20261108.json). These are author checks, not independent PASS decisions or clinical approval. No answer analytics, correctness collection or difficulty gate was introduced.',
 '',
 '## Live inventory at intake',
 '',
 '**Key shown first for review only. Runtime options are randomized.** This table records the exact original live variant/node IDs, unchanged concept ID, complete current task and choices. Words are the combined pre-task count defined above. Exact case IDs, exhibits and before/after fields are also in the [machine-readable inventory](question-stats1-inventory-20261108.json) and packet. The immutable intake is `tools/question-quality/fixtures/question-stats1-before-20261108.json`.',
 '',
 table(['ID','Live variant / node','Concept','Words','Current task','Current choices'],inventory.rows.map(r=>[
  r.id,code(r.currentVariantId)+'<br>'+code(r.nodeId),code(r.conceptId),r.currentStemWords,r.currentTask,r.currentOptions.join('<br>'),
 ])),
 '## Per-item authoring summary',
 '',
 'Each row below is a new draft version. The exact retained live version in the inventory/packet is its fallback until manager acceptance. All rows have **hold status: none**. Redesign is focused practice under the owner exception; there is no author claim that the drafts are moderate/hard or independently passed.',
 '',
 table(['ID','Candidate variant','Single skill / trap','After words','Change'],inventory.rows.map(r=>{
  const p=packet.find(p=>p.id===r.id);
  return [r.id,code(r.proposedVariantId),p.inference+'<br>'+p.focus,r.afterStemWords,p.whatChanged];
 })),
 '### Existing versioned meanings preserved',
 '',
 '- **S42 / collection-population PPV:** keep the collection-before-ICU-transfer fact and choose the collection cohort denominator. Removing the extra clinical narrative does not erase that existing concept discriminator. It is not replaced with generic PPV recall.',
 '- **S54 / p-value.v2 concept:** the existing scored meaning is comparison of an uncertainty interval with a target benefit. The draft asks only how the interval relates to that target; it does not silently reset this versioned concept to the generic p-value definition or add a second clinical recommendation.',
 '',
 '### Additional statistics outside the sixteen named families',
 '',
 'Inventory only; **no edits or retirement**. Their current concepts combine statistical interpretation with protocol/implementation decisions. A later simplification should check meaning/version discipline rather than silently carrying their FSRS history into a different objective.',
 '',
 table(['ID','Live variant / node / concept','Words','Task','Current choices'],inventory.additionalStatistics.map(r=>[
  r.id,code(r.questionVariantId)+'<br>'+code(r.nodeId)+'<br>'+code(r.conceptId),r.currentPreTaskWords,r.task,r.options.map(o=>(o.isKey?'**KEY:** ':'')+o.label).join('<br>'),
 ])),
 '## Evidence and holds',
 '',
 '**No main item is parked; no key has a source hold.** The new ledger contains 33 method rules and 64 constructed-data applications (97 new atomic claims), linked to 21 retained basis claims and 22 existing source records representing 20 official URLs. Each new rule/application and source record remains `needs_clinician_review`. Full citations, authors, dates, rights, authority assessments and claim mappings are in [sources-question-stats1-20261108.json](sources-question-stats1-20261108.json). No source text, excerpts or empirical clinical performance was added.',
 '',
 'Existing NIST, CDC, FDA, DHSC and Cochrane method records supply the formulas and test-selection assumptions. Two historical pancreatic-source records remain only through the original collection-population application provenance; the new PPV draft makes no pancreatic-management assertion. Repeated records of a URL are not independent corroboration. Some method claims have only one adequate government/handbook source; that limitation is explicit. No commercial question bank, recalled board content or newly retrieved source was used.',
 '',
 'Access dates and basis-claim last-checked dates retain their recorded values. This milestone checked the source ledger offline and independently verified arithmetic/assumptions; it does **not** claim new web retrieval or currentness verification. New exact numbers are labelled constructed statistical exercise inputs, not new medical cutoffs or outcome estimates.',
 '',
 table(['Existing source record','Official source','Recorded access','Reuse status'],ledger.sources.map(s=>[
  code(s.id),'['+s.title+']('+s.officialUrl+')',s.accessedOn,s.licenseLabel+'; '+s.reuseStatus,
 ])),
 '## Preservation and future integration',
 '',
 'The [scope](question-stats1-scope-20261108.json) and [preservation receipt](question-stats1-preservation-20261108.json) prove the live release, registered catalog, ship manifest and global timing are unchanged. Default counts remain **1141 cases / 1452 nodes / 606 registered meanings**, with **71 accepted rows**. New candidates are direct-import drafts only. No existing runtime, domain, player, save/cloud, Supabase, evidence or release-worktree file changed.',
 '',
 table(['Object (SHA-256 of JSON.stringify)','Hash'],[
  ['Unchanged default live release',code(preservation.liveSha256)],
  ['Unchanged registered catalog',code(preservation.catalogSha256)],
  ['Unchanged ship manifest',code(preservation.manifestSha256)],
  ['Unchanged global timing registry',code(preservation.globalTimingSha256)],
  ['Draft stats1-round1 source view',code(preservation.sourceViewSha256)],
 ]),
 'The [integration proposal](question-stats1-integration-proposal-20261108.json) supplies exact candidate case/node/question hashes, header source, retained fallback and timing entries. It is **not acceptance** and does not contain a fake decision citation. If independently accepted later, ordinary single-node/header overrides suffice; no whole-case relation is needed. Supersede the existing **G06 row with accepted S42**, and **F3-01 row with accepted S44**, rather than creating duplicate case/node acceptances. Other accepted rows and every historical binding stay intact. Manager acceptance must name a real decision document and exact versions.',
 '',
 '### Exact historical-test migration',
 '',
 'Of 844 captured protected files, 842 are byte-for-byte unchanged. Only the requested standard and one existing test-support file change. Adding the owner Statistics items section legitimately invalidated an older standard-source digest. The test-only helper now calls a two-path, exact-before/after-SHA migration before the earlier guard. Its receipt proves both old bytes against the immutable intake and new bytes against the worktree. The standard is also reversed mechanically to prove that its only changes are the new section and version line. No old capture, assertion, budget or preservation check was removed, refreshed or relaxed.',
 '',
 table(['Existing edited file','Before SHA-256','After SHA-256'],preservation.existingChanges.map(r=>[code(r.path),code(r.beforeSha256),code(r.afterSha256)])),
 '**Changed existing Level 5 bound inputs: none.** The canonical evidence file is byte-identical; no rebind was run. Four new runtime candidate/data/evidence/retained-input modules are preview-only and not loaded by the default release. Future acceptance/integration would need a fresh manager-bound-input audit; this handoff makes no claim that such a future integration has already been rebound.',
 '',
 '## Validation',
 '',
 'All requested commands exited 0. The exact machine-readable results, durations and log SHA-256 values are in [question-stats1-validation-20261108.json](question-stats1-validation-20261108.json). Logs are local under `.local-dev/question-stats1-20261108/`. Closing results:',
 '',
 table(['Directory / command','Exact result'],[
  ['packages/clinical-content: `npm.cmd test -- --pool=threads`','124 files passed (124); 1473 tests passed (1473); 39.37s; exit 0'],
  ['Root: `npm.cmd run typecheck`','All 7 workspaces passed; exit 0'],
  ['Root: `npm.cmd run clinical:lint:test`','33 tests; 33 pass; 0 fail; 2996.6776ms; exit 0'],
  ['Focused clinical: stats1 + flags3 files, `--pool=threads`','2 files passed; 126 tests passed; 0 fail; 6.44s; exit 0'],
  ['Author / packet / scope / validation reproduction checks','All --check commands passed; source view and generated outputs exact'],
 ]),
 'The 111 added clinical tests independently check table denominators, sensitivity/specificity/PPV, collection cohort and prevalence direction, RR/OR and odds-to-risk conversion, ARR/NNT, power/beta, interval null/target inclusion and width, expected contingency cells, and outcome-dependent response denominators. They also check source mappings, single-node topology, visible length, neutral headers, runtime randomization, unchanged identities/defaults and the exact historical test migration. Baseline clinical-content was 123 files / 1362 tests passed (27.85s).',
 '',
 'The seven successful typecheck workspaces are clinical-context-workbench, player, balance-config, clinical-authoring, clinical-content, clinical-research and game-domain. No full game-domain or player test run was requested for this authoring-only milestone, and no such current result is claimed.',
 '',
 'Reproduce the generated candidate/packet checks from the repository root:',
 '',
 '```text',
 'node tools/question-quality/author-question-stats1-20261108.mjs --check',
 'node tools/question-quality/review-question-stats1-20261108.mjs --check',
 'node tools/question-quality/check-question-stats1-20261108.mjs --check',
 'node tools/question-quality/record-question-stats1-validation-20261108.mjs --check',
 'node tools/question-quality/write-question-stats1-handoff-20261108.mjs --check',
 '```',
 '',
 '## Files changed',
 '',
 'Two pre-existing files changed: the standard and the exact test-support hook listed above. `docs/handoffs/CURRENT_THREAD_HANDOFF.md` receives an append-only stats1 handoff block. New milestone files are listed below; [the file receipt](question-stats1-files-20261108.json) records their hashes (excluding its own hash) and distinguishes the shared append.',
 '',
 ...newPaths.map(p=>'- '+link(p)),
 '- '+link(filesPath)+' (self-listed receipt; no self-referential hash)',
 '',
 'The local directory `.local-dev/question-stats1-20261108/` contains command logs, exit receipts and intake probes. No owner feedback digest or email was read or copied for this milestone. All historical captures stay immutable.',
 '',
 '## Remaining risks and manager handoff',
 '',
 '- Independent review and named clinical sign-off remain pending. Zero heuristic findings and correct arithmetic do not prove item validity or readability in every player layout.',
 '- The intended difficulty is focused, learnable rule application. Ease is intentional under the new statistics direction; time-to-answer is an author intent, not a new timer, collection mechanism or measured gate.',
 '- The four N2 items above remain live and unchanged, outside the sixteen named families. If added to a later statistics pass, review their compound scored meanings before simplification.',
 '- No candidate is in the ship manifest/default release. The manager owns exact acceptance, later integration, release and any bound-input recheck/rebind.',
 '',
 'No Git, installs, network, agents, external messages, deploy or release-tree operations were performed. This checkpoint remains local. The manager owns any later explicitly authorized "push to GitHub" backup; this worker has not created one. No playtest origin or save-opening pathway changed. Stop at independent review.',
 '',
];
const text=lines.join('\n');
if(process.argv.includes('--check'))assert.equal(fs.readFileSync(handoffPath,'utf8'),text,'Handoff stale');
else fs.writeFileSync(handoffPath,text);
const receipt={checkedOn:'2026-11-08',newFiles:newPaths.map(p=>({path:p,sha256:fileHash(p)})),
 existingEdits:preservation.existingChanges,sharedAppend:{path:'docs/handoffs/CURRENT_THREAD_HANDOFF.md',edit:'append-only stats1 block; preserve other workers'},
 self:{path:filesPath,hashExcluded:true},localOnly:'.local-dev/question-stats1-20261108/',shipManifestEdited:false,levelFiveBoundInputChanges:[]};
if(process.argv.includes('--check'))assert.deepEqual(read(filesPath),receipt,'File receipt stale');
else fs.writeFileSync(filesPath,JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify({handoff:handoffPath,inventoryRows:inventory.rows.length,additionalInventoryRows:inventory.additionalStatistics.length,newFiles:receipt.newFiles.length+1,existingEdits:receipt.existingEdits.length,clinicalTests:validation.results.clinical.testSummary,lintAfter:lint.totals.afterFindings},null,2));
