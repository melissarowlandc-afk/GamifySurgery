# Owner flags round two — handoff, November 5, 2026

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
| G01 | I thought another version of this question was HIV/HCV first then bone marrow testing second | Audited all eight ITP siblings. Removed the implied universal marrow-after-viral-screening ladder and the repeated-serology foil. The two wrong sequences both prematurely convert completed preparation into a surgical indication. | Recorded ITP consensus / ASH summary; existing CDC vaccine claim. |
| G02 | Too easy, answer choices should be more specific and not clearly wrong | Pulled the exact v2 owner flag into this batch; the v4 queue sibling remains queued separately. Replaced ignore-the-record/crisis-in-clinic foils with actual drug regimens and an exposure-history misconception. | Recorded JSA / EMHG guidance; expanded facts held. |
| G03 | Too obvious to say in the question that something wasn't assessed with US when the US is the right answer | No source content changed: Exact original v1 is already addressed by B2B36 round two, which tests actual acquisition adequacy. Its source and packet remain untouched under independent review. This is coverage, not acceptance or a claim that the candidate is live. | Frozen B2B36 packet and exact source version. |
| G04 | This is too easy for a surgery resident | No source content changed: The scored objective is identifying hCG as a pregnancy assay. The existing v1 plainly supplies pregnancy possibility and asks which test measures it. Hiding that purpose would create obscurity; making a meaningful ectopic-management decision would change the scored concept. Propose removing this redundant resident-facing assay-recognition variant from fresh selection or merging its foundational reminder into a stronger, separately reviewed early-pregnancy decision. Do not delete, retire, reroute or alter FSRS here. | Recorded NLM/Queensland pregnancy assessment facts; proposal only. |
| G05 | If she already meets criteria for parathyroidectomy why does she need DXA? Why not operate? | Separated baseline skeletal characterization from surgical eligibility, with a linked first-node revision that requests DXA alongside the operative opinion. Removed the because-no-complication and bone-clinic foils; named both competing management pathways. | Recorded Fifth Workshop guideline; sole adequate guideline noted. |
| G06 | Dont have this be so hypothetical | Pulled the exact v2 flag into this batch; the v3 queue sibling stays separately queued. Replaced a hypothetical cancer-test direction question and brochure slogan with a concrete preoperative PCR result, a coherent two-cohort audit and plausible denominator/cohort errors. | Recorded CDC/FDA statistical definitions; original constructed audit. |
| G07 | Needs to be more specific answer choices | Replaced generic care structures with four explicit sampling requests. The learner must interpret specimen adequacy and actual node observations; no PTLD diagnosis is supplied and no treatment regimen is invented. | Recorded AST/PTLD review plus selected neck-core guidance; combined application held. |

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

- `packages/clinical-content/src/index.ts` — existing input, minimal standalone export hunk.
- `packages/clinical-content/src/question-flags2-20261105.ts` — new non-test runtime input.
- `packages/clinical-content/src/question-flags2-20261105-data.ts` — new non-test runtime input.
- `packages/clinical-content/src/question-flags2-evidence-20261105.ts` — new non-test runtime input.
- `packages/clinical-content/src/question-flags2-retained-input-20261105.ts` — new non-test runtime input.

These five paths are the existing collector's non-test runtime TS inputs.
Tests, docs, tooling, logs and JSON research artifacts are outside that collector.
Before/current hashes and current-evidence membership are recorded in
question-flags2-controls-20261105.json. No Level 5 evidence, pin, checkpoint,
recorded hash, driver or test was edited or rebound. The manager owns a real
release-tree rebind after integration. Pure candidate export has no behavioral
live change; acceptance of new concepts later needs its own release validation.

## Files owned by this milestone

Clinical source/test (only the marked export block in the shared index):
- packages/clinical-content/src/index.ts
- packages/clinical-content/src/question-flags2-20261105.ts
- packages/clinical-content/src/question-flags2-20261105-data.ts
- packages/clinical-content/src/question-flags2-evidence-20261105.ts
- packages/clinical-content/src/question-flags2-retained-input-20261105.ts
- packages/clinical-content/src/question-flags2-20261105.test.ts

Documents (append-only scoped notes in the shared plan, proposal and handoff):
- docs/execplans/question-flags2-20261105.md
- docs/execplans/question-bank-program-20261104.md
- docs/research/question-flags2-20261105.json
- docs/research/sources-question-flags2-20261105.json
- docs/research/question-flags2-handoff-20261105.md
- docs/research/question-bank-batch2c-proposal-20261104.md
- docs/research/question-bank-retire-merge-proposals-20261104.md
- docs/handoffs/CURRENT_THREAD_HANDOFF.md

Authoring/control tools:
- tools/question-quality/capture-question-flags2-20261105.mjs
- tools/question-quality/question-flags2-specs-20261105.mjs
- tools/question-quality/build-question-flags2-20261105.mjs
- tools/question-quality/review-question-flags2-20261105.mjs
- tools/question-quality/control-question-flags2-20261105.mjs
- tools/question-quality/handoff-question-flags2-20261105.mjs

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
