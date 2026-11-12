import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const decode=p=>{const b=fs.readFileSync(p);return (b[0]===255&&b[1]===254?b.toString('utf16le'):b.toString('utf8')).replace(/\u001b\[[0-9;]*m/g,'');};
const packet=read('docs/research/question-flags2-20261105.json'),lint=read('tools/question-quality/question-flags2-lint-20261105.json'),controls=read('tools/question-quality/question-flags2-controls-20261105.json'),sources=read('docs/research/sources-question-flags2-20261105.json');
assert.equal(lint.totals.afterFindings,0);assert(controls.protectedBatch2b.every(p=>p.unchanged));
assert(controls.validationLock.endsWith('runtime-lock-final-20261105.json'));
const commands=[
 {name:'Focused clinical source-view tests',command:'npm.cmd run test --workspace @gamify-surgery/clinical-content -- --pool=threads --maxWorkers=2 src/question-flags2-20261105.test.ts',log:'tools/question-quality/question-flags2-clinical-complete-20261105.log',passed:21,failed:0,filesPassed:1},
 {name:'Cue-linter tests (existing Node runner)',command:'npm.cmd run clinical:lint:test',log:'tools/question-quality/question-flags2-linter-tests-complete-20261105.log',passed:33,failed:0},
 {name:'Clinical-content typecheck',command:'npm.cmd run typecheck --workspace @gamify-surgery/clinical-content',log:'tools/question-quality/question-flags2-typecheck-complete-20261105.log',workspacesPassed:1,workspacesFailed:0},
];
assert.match(decode(commands[0].log),/Tests\s+21 passed \(21\)/);
assert.match(decode(commands[1].log),/pass 33/);assert.match(decode(commands[1].log),/fail 0/);
assert(!/error TS\d+/.test(decode(commands[2].log)));
const validation={checkedOn:'2026-11-05',scope:'Focused results only, as requested; no full clinical/domain/player suite run or full-suite-green claim.',commands:commands.map(r=>({...r,observedExitCode:0,logSha256:hash(r.log)})),lint:lint.totals,finalRuntimeLock:controls.validationLock,
 reproductionCommands:['node tools/question-quality/build-question-flags2-20261105.mjs --check','node tools/question-quality/review-question-flags2-20261105.mjs --check --require-zero','node tools/question-quality/control-question-flags2-20261105.mjs --final'],
 initialOwnFailure:'The first typecheck found TS18048 in the new test optional-demographics access. Fixed the assertion to require demographics and age <50; final focused tests/typecheck pass. Earlier logs retained.',
 finalLockReason:'The initial lock predates an explicit mapping of the inherited pre-splenectomy vaccination distractor role to its existing CDC-supported atomic claim. No clinical wording changed for that mapping. The final lock and complete logs cover the added mapping, packet-shape checks and latest source view.'};
fs.writeFileSync('tools/question-quality/question-flags2-validation-20261105.json',JSON.stringify(validation,null,2)+'\n');

const bulletRows=packet.map(p=>{
 const source=p.id==='G01'?'Recorded ITP consensus / ASH summary; existing CDC vaccine claim.':p.id==='G02'?'Recorded JSA / EMHG guidance; expanded facts held.':p.id==='G03'?'Frozen B2B36 packet and exact source version.':p.id==='G04'?'Recorded NLM/Queensland pregnancy assessment facts; proposal only.':p.id==='G05'?'Recorded Fifth Workshop guideline; sole adequate guideline noted.':p.id==='G06'?'Recorded CDC/FDA statistical definitions; original constructed audit.':'Recorded AST/PTLD review plus selected neck-core guidance; combined application held.';
 return '| '+p.id+' | '+p.ownerNote.replaceAll('|','/')+' | '+p.whatChanged.replaceAll('|','/')+' | '+source+' |';
}).join('\n');
const bound=controls.changedLevel5BoundInputs.map(x=>'- `'+x.path+'` — '+(x.before?'existing input, minimal standalone export hunk':'new non-test runtime input')+'.').join('\n');
const codeFiles=['packages/clinical-content/src/index.ts','packages/clinical-content/src/question-flags2-20261105.ts','packages/clinical-content/src/question-flags2-20261105-data.ts','packages/clinical-content/src/question-flags2-evidence-20261105.ts','packages/clinical-content/src/question-flags2-retained-input-20261105.ts','packages/clinical-content/src/question-flags2-20261105.test.ts'];
const docs=['docs/execplans/question-flags2-20261105.md','docs/execplans/question-bank-program-20261104.md','docs/research/question-flags2-20261105.json','docs/research/sources-question-flags2-20261105.json','docs/research/question-flags2-handoff-20261105.md','docs/research/question-bank-batch2c-proposal-20261104.md','docs/research/question-bank-retire-merge-proposals-20261104.md','docs/handoffs/CURRENT_THREAD_HANDOFF.md'];
const tools=['tools/question-quality/capture-question-flags2-20261105.mjs','tools/question-quality/question-flags2-specs-20261105.mjs','tools/question-quality/build-question-flags2-20261105.mjs','tools/question-quality/review-question-flags2-20261105.mjs','tools/question-quality/control-question-flags2-20261105.mjs','tools/question-quality/handoff-question-flags2-20261105.mjs'];
const body=`# Owner flags round two — handoff, November 5, 2026

Six exact draft variants in five retained cases are ready for independent review:
G01, G02, G05, G06, G07 and the necessary G05 baseline-staging companion.
G03 is already covered by frozen B2B36 round two; G04 is a retirement/merge
proposal with its current live version unchanged. All six new variants, three
new concept versions and nineteen new atomic claims remain
**needs_clinician_review**. Melissa Rowland is clinical sign-off. No new exact
version is owner-approved, manager-accepted or shipped.

Packet: [question-flags2-20261105.json](question-flags2-20261105.json).
It has seven owner dispositions, with G05-staging nested in G05's
companionRevisions and referenced by companionVariants. Before/after sections
use Presentation, Current update, Exhibit, Task and Options; rationalePairs
contains before/after pairs. The **KEY:** marker is key-first for review only;
runtime answers are randomized. Jamie Taylor is a review placeholder.

## Owner note to response

| Flag | Owner note | Response | Evidence / coverage |
|---|---|---|---|
${bulletRows}

G01's eight retained ITP variants consist of four HIV/HCV diagnostic tasks and
four later surgical-deferral tasks. None keys routine marrow testing after viral
serology. The broader recorded ITP search also finds a vaccine-review question,
which does not key marrow testing. This audit does not establish what another
unidentified encounter may have shown. Negative viral tests are not a diagnosis
or an instruction to follow a universal marrow ladder. The marrow/surgery foil
is wrong here because it commits to early elective surgery after another test,
not because marrow evaluation is categorically forbidden. The pre-existing
platelet range above 30 × 10^9/L is retained, not a newly invented cutoff.

G05's skeletal study now accompanies the operative consultation. Its normal
result does not remove the independent age-under-50 indication. The key names
parathyroidectomy. The first-node repair retains the DXA service and result gate
and is honestly labelled a foundational baseline-assessment task; it is not
claimed as a newly hard resident item or an accepted-basic version. Review and
accept both G05 nodes and their header together if resolving this paired-logic
flag. The clinical need for baseline assessment is distinct from permission to
discuss or recommend surgery; the game's sequential result display is not a
clinical rule to delay referral.

G02/G06 pull the exact flagged v2 versions into this milestone. The 2c proposal
actually lists MH v4 and predictive-value v3. Those different sibling rows are
paused for reconciliation after this decision, not silently marked repaired.
No sibling or other 2c item is rewritten here.

## Source records, holds and review limits

[sources-question-flags2-20261105.json](sources-question-flags2-20261105.json)
contains fifteen reused bibliographic records and nineteen new atomic mappings:
full citation, authors, organization/journal, year, DOI/official URL, original
access date, source class, rights/reuse status, medical authority, intended use
and supported new claim IDs. No page, source excerpt or article text was
retrieved or stored. November 5 is an offline consistency-check date, not a new
source access date. Reuse of a record is not independent corroboration.

- **G01 hold:** directly verify the ITP consensus marrow boundary and the ASH
  bibliographic identity. The old record's 2026 title/DOI and URL ending 0824 need
  reconciliation. It is explicitly marked under bibliographic verification and
  is not counted as newly verified adequate support. No adequate-source conflict
  was established offline; do not claim that sources agree on a fixed marrow
  sequence. Preserve any actual disagreement and withhold that teaching point.
- **G02 hold:** align prior uneventful exposure, family-testing interpretation
  and named agents with the recorded permitted MH guidance. No dose, crisis
  protocol, workstation preparation time or complete anaesthetic prescription is
  authored.
- **G07 hold:** the old PTLD claim excluded technique. A recorded neck-core
  claim supports selected tissue/ancillary needs, but does not independently
  establish every PTLD-specific target/method preference. Confirm the combined
  application and the scoped image-guided request; do not generalize core over
  excision in all PTLD workups.
- **G05 limitation:** one recorded Fifth Workshop guideline supports the age and
  skeletal facts. The competing cinacalcet role has a separate narrow mapping
  requiring focused confirmation and clinician review; no dosing or initiation
  threshold is taught.
- **G06 limitation:** all counts are original constructed observations, explicitly
  labelled. The resulting 70%/92% predictive values, 90% sensitivity and 98%
  specificity are mathematical properties of that table, not measured assay
  performance, MRSA prevalence, a screening policy or a treatment recommendation.

G04 proposes retiring/merging a redundant hCG-assay-recognition item from
resident-facing selection. Pregnancy assessment remains important general
surgery content. The proposed sibling
question.gs028f.gynecology.suspected-ectopic-urgent-evaluation.v3 tests a
new-symptom disposition in an unlocated pregnancy, but also needs stronger
options and independent review; it is not represented as an accepted harder
replacement. Manager acceptance is required before retirement/merge or any
selection/FSRS change. None is applied here.

## Manual rubric and cue lint

Every new variant records the full visible history, cue attack, same-stage/category
check, reasoning steps, closest error, deciding observation, counterfactual,
single-key rationale, deletion test and limitations. Application difficulty is
predicted moderate, pending independent PGY-2/3 judgment. The G05 staging
companion is the explicitly disclosed foundational exception. These are author
checks, not an independent PASS or clinical sign-off.

The unchanged v8 linter reports **11 before → 0 after findings** over all six
new exact variants and **30 canonical/finite-profile contexts**. Earlier
feedback/results are included; current post-answer feedback is not. G07 uses a
complete, balanced method × target matrix, with each component twice, rather
than a unique assembly of majority components. No lint rule was altered,
suppressed or weakened. G03/G04 are dispositions, not zero-lint rewrite claims.
G01's unchanged preceding diagnostic node is not one of the six new variants;
its returned results and feedback are included when checking the new follow-up.

Detailed spans: tools/question-quality/question-flags2-lint-20261105.json.

## Retained-view integration contract

- Import QUESTION_FLAGS2_ROUND1_SOURCE_RELEASE and register it under the exact
  source-view name flags2-round1 **after manager acceptance**. This is a scoped,
  self-contained five-case/seven-node view, not an alternate whole live catalog.
  Its retained input capsule has no dependency on the moving projection.
- Exported QUESTION_FLAGS2_TIMING_ENTRIES supplies six exact candidate timing
  rows; QUESTION_FLAGS2_CANDIDATE_TEST_ORDER_RECORDS supplies eight exact orders.
  Append these archives in the integration lane when needed. Seven orders remain
  future-planned; the one DXA key retains its existing service/route gate.
- No manifest, projector, gate file or game-domain module was edited here. No
  candidate timing was silently added to the global registry. The unchanged
  preceding ITP node already has its original global timing/order records.
- Acceptance needs exact case/node/question/concept tuples, the accepted new
  concept definitions and exact case header sources. Preserve legacy fallback
  and review any mixed accepted/fallback sequence. Do not expose a candidate
  just because it is exported or needs_clinician_review.
- Current structural control: default live projection is exactly equal with
  this candidate view omitted; zero new live variants/cards/acceptances. The
  moving manager-owned manifest currently yields 1,136 cases/1,449 nodes; these
  totals are not an output increase caused by this lane.

Fourteen captured batch-2b source/packet/test files remain byte-exact. Removing
only this lane's marked four-line index export restores the captured index
hash. The control artifact separately lists nineteen observed shared-tree
changes in other workers' gate/tests, without attributing them to this lane.
No frozen encounter, save format, selector, routing or original concept identity
is rewritten. G02/G06/G07 have new scored meanings and new concept IDs; G01 and
both G05 nodes retain their existing concept IDs and all old definitions.

## Focused validation

| Command | Exact result |
|---|---|
| npm.cmd run test --workspace @gamify-surgery/clinical-content -- --pool=threads --maxWorkers=2 src/question-flags2-20261105.test.ts | 1 file; 21 passed, 0 failed; 3.58 s |
| npm.cmd run clinical:lint:test | Node runner; 33 passed, 0 failed |
| npm.cmd run typecheck --workspace @gamify-surgery/clinical-content | 1 workspace passed; exit 0 |
| build-question-flags2-20261105.mjs --check | Reproducible source/claim/input/ledger generation |
| review-question-flags2-20261105.mjs --check --require-zero | Reproducible packet; six variants; zero findings |
| control-question-flags2-20261105.mjs --final | Live/freeze/source-view/hash controls passed |

Only the requested focused results are reported. No full clinical/domain/player
suite was run in this milestone, and no whole-tree-green claim is made. The
first typecheck found TS18048 in the new optional-demographics assertion; the
assertion now requires demographics and the age bound. The complete focused run
passes. Earlier logs remain; no production change was made to bypass a failure.

Latest logs are question-flags2-{clinical,linter-tests,typecheck}-complete-
20261105.log under tools/question-quality. Their exact hashes and observed exit
codes are in question-flags2-validation-20261105.json. The final runtime lock
postdates the explicit existing-vaccination-claim mapping and the packet-shape
check; the earlier lock is retained, not overwritten. The final control must
match question-flags2-runtime-lock-final-20261105.json.

## Exact Level 5 bound inputs changed by this lane

${bound}

These five paths are the existing collector's non-test runtime TS inputs.
Tests, docs, tooling, logs and JSON research artifacts are outside that collector.
Before/current hashes and current-evidence membership are recorded in
question-flags2-controls-20261105.json. No Level 5 evidence, pin, checkpoint,
recorded hash, driver or test was edited or rebound. The manager owns a real
release-tree rebind after integration. Pure candidate export has no behavioral
live change; acceptance of new concepts later needs its own release validation.

## Files owned by this milestone

Clinical source/test (only the marked export block in the shared index):
${codeFiles.map(p=>'- '+p).join('\n')}

Documents (append-only scoped notes in the shared plan, proposal and handoff):
${docs.map(p=>'- '+p).join('\n')}

Authoring/control tools:
${tools.map(p=>'- '+p).join('\n')}

Generated evidence also includes the immutable flags2 intake, source ledger,
packet, cue report, controls, initial/final runtime locks, validation summary,
complete/native earlier logs and exact file manifest. See
tools/question-quality/question-flags2-files-20261105.json for every owned path.
No batch-2b or question-new-* file, session/cloud/performance implementation,
Supabase, Level 5 evidence/pin, gate, deployment or timer-UI file was edited.

## Manager handback

Run independent review of the six new variants, including the G05 companion and
all visible prior feedback. Resolve the three explicit source holds, the G05
new mapping and the foundational-staging exception; decide G04 retirement/merge.
Then accept only exact versions through the existing manifest/projection and
integrate the exported timing/order archives and new concepts. Reconcile the
different 2c siblings after this decision. This lane stops at that review gate.

Everything is local, unshipped and unbacked by this worker. No Git, install,
network, agents, external message, deployment or opening-pathway change occurred.
The manager owns acceptance, release and the GitHub-backup checkpoint reminder.
`;
fs.writeFileSync('docs/research/question-flags2-handoff-20261105.md',body);

function appendOnce(path,marker,body){const current=fs.readFileSync(path,'utf8');if(!current.includes(marker))fs.appendFileSync(path,'\n\n'+marker+'\n'+body+'\n');}
appendOnce('docs/execplans/question-bank-program-20261104.md','<!-- FLAGS2 milestone 20261105 -->',`Owner flags round two is authored and focused-validated; see docs/execplans/question-flags2-20261105.md and docs/research/question-flags2-handoff-20261105.md. Six new exact variants in five retained cases; G03 is frozen B2B36 coverage, G04 proposes retirement/merge without changing live selection. Three explicit source holds; all new records needs_clinician_review. Cue findings 11 -> 0 across 30 contexts; clinical21/21, lint33/33, clinical typecheck passes. The self-contained flags2-round1 view and candidate timing/order exports await manager integration/acceptance; default live content/cards are unchanged. Batch2b stays untouched. STOP for independent review; no further batch is authored in this milestone.`);
appendOnce('docs/research/question-bank-retire-merge-proposals-20261104.md','<!-- FLAGS2 G04 proposal 20261105 -->',`G04: question.gs028f.gynecology.pregnancy-testing-pelvic-pain.v1 remains live and byte-exact. Propose retirement/merge of its redundant hCG-assay-recognition objective from resident-facing selection, preserving the importance of pregnancy assessment. A harder decision must interpret symptoms/location evidence and change care, not obscure the assay name. Candidate sibling question.gs028f.gynecology.suspected-ectopic-urgent-evaluation.v3 is an unapproved future redesign target, not an accepted replacement; its current options also need work. Manager must accept any retirement/merge and preserve frozen encounters/FSRS. No deletion, routing or history change is applied. Full reasoning and evidence metadata: question-flags2-handoff-20261105.md and sources-question-flags2-20261105.json.`);
appendOnce('docs/handoffs/CURRENT_THREAD_HANDOFF.md','<!-- FLAGS2 handoff 20261105 -->',`Owner flags2 authoring milestone completed at the independent-review gate. Packet: docs/research/question-flags2-20261105.json; full per-flag/source/hold/integration handoff: docs/research/question-flags2-handoff-20261105.md. Six new exact variants in five retained cases, three new concept versions, nineteen atomic claims; everything needs_clinician_review. G03 skipped as covered by frozen B2B36 r2; G04 proposes retirement/merge and remains live. G01/G02/G07 have explicit source-alignment holds. G05's necessary first-node repair separates baseline DXA from operative eligibility and remains foundational, not newly claimed hard.

Final focused results: clinical21/21 (threads/maxWorkers2), cue-linter33/33, clinical-content typecheck exit0; new variants have zero findings across30 profile contexts (11before). No full suites run or whole-tree-green claim. Default live projection/cards exactly unchanged by this lane;14 batch2b captured files byte-exact; only the marked four-line clinical index export changes that existing file. Four new runtime modules hold the data, evidence and independent five-case source view. Six timing/eight exact order rows are exported for future manager integration, not globally registered or accepted.

Level5 impact: clinical-content/src/index.ts plus question-flags2-20261105.ts, question-flags2-20261105-data.ts, question-flags2-evidence-20261105.ts and question-flags2-retained-input-20261105.ts. No evidence/pin/gate/domain/session/Supabase/deploy edit. Hashes and final runtime lock: tools/question-quality/question-flags2-controls-20261105.json. Preserve concurrent gate/performance/new-content work. Manager resolves source/retirement/exception decisions, independently reviews, integrates accepted exact tuples/header/concepts/timing/orders and later binds the actual release tree. No Git/install/network/agents/external messages or backup by this worker. STOP; nothing ships from this lane.`);
appendOnce('docs/execplans/question-flags2-20261105.md','<!-- FLAGS2 completed 20261105 -->',`Authored six exact variants in five scoped cases, retained old input/version identities and supplied a self-contained flags2-round1 view. G03 coverage skipped; G04 retirement/merge proposal keeps live unchanged. Three new meanings use separate concepts; nineteen atomic claims and fifteen recorded source records retain original access dates. G01/G02/G07 source holds are explicit. Linked G05 baseline staging is disclosed as foundational. Packet and manual rubric regenerated; cue lint11before/0after across30contexts. Focused clinical21/21, lint33/33, clinical typecheck passes. Final runtime/hash/live controls pass;14 batch2b files unchanged. Full handoff and exact Level5 paths: docs/research/question-flags2-handoff-20261105.md. All acceptance/clinical approval/release/evidence rebind decisions remain with manager/clinical sign-off. STOP at independent review.`);

const generated=fs.readdirSync('tools/question-quality').filter(n=>n.startsWith('question-flags2-')).map(n=>'tools/question-quality/'+n).filter(p=>fs.statSync(p).isFile());
const files=[...new Set([...codeFiles,...docs,...tools,'tools/question-quality/fixtures/question-flags2-before-20261105.json',...generated,'tools/question-quality/question-flags2-files-20261105.json'])].sort();
fs.writeFileSync('tools/question-quality/question-flags2-files-20261105.json',JSON.stringify({checkedOn:'2026-11-05',ownership:'Only listed new files and marked/append-only shared hunks; no ownership claim over concurrent edits.',files:files.map(path=>({path,sha256:fs.existsSync(path)&&!path.endsWith('question-flags2-files-20261105.json')?hash(path):null}))},null,2)+'\n');
console.log(JSON.stringify({handoff:'docs/research/question-flags2-handoff-20261105.md',packetItems:packet.length,newVariants:6,claims:sources.claims.length,sources:sources.sources.length,clinicalTests:21,lintTests:33,typecheck:1,afterFindings:0,ownedPaths:files.length},null,2));
