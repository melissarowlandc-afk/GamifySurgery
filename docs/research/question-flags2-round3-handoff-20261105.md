# Flags2 final round handoff — 2026-11-05

Authoring is complete: **two supported proposed replacements (G03, G05), five
parked items, and G06's exact accepted PASS preserved**. No manifest acceptance,
live question, source hold or clinical approval is inferred from a self-check.
All new questions, concepts, presentation revisions and seven atomic claims
remain **needs_clinician_review**. Melissa Rowland remains clinical sign-off.

The [round-three packet](question-flags2-round3-20261105.json) contains before/
after fields, key-first review-only options, rationale pairs, two-step self-checks,
source dispositions, exact live fallbacks and **93 indexed responses** to review
two: **83 returned-item notes plus 10 unchanged G06 PASS notes**. Parked records
have after=null and no new keyed answer, concept or executable candidate; they
are excluded from the zero-lint count. There is no placeholder replacement.

## Per-item owner-note response and source disposition

| Item | Hold status | Round-three candidate | Owner-note resolution |
| --- | --- | --- | --- |
| G01 | parked | No new version emitted | Open: the bank's eight isolated-ITP siblings contain viral evaluation followed by elective-surgery deferral, not a universal viral-negative-then-marrow rule. No identified earlier encounter has been recovered and no marrow ranking is verified. Preserve the live version and park this reassessment draft; do not claim the sequencing concern is closed. |
| G02 | parked | No new version emitted | The earlier draft resolved specificity and difficulty editorially, but its key remains unsupported. Park it and keep the exact current live version. A specific, close replacement needs permitted agent/testing/preparation evidence; no general trigger-free claim is stretched into that protocol. |
| G03 | none | question.palpable-breast.negative-mammogram-targeted-us.v1.r4 | Resolved in this proposed version: ultrasound is no longer the key or an announced missing study; actual findings define the negative studies. The player interprets clinical/imaging discordance instead. This changes the objective and is not an accepted replacement yet. |
| G04-R | parked | No new version emitted | Open. Keep the original pregnancy-testing live item until a consequential harder replacement is supported, independently passed and manager-accepted. Retirement/merge remains agreed in principle only; no replacement or deletion is performed. |
| G05 | none | question.asymptomatic-phpt.age-based-surgery.v1.r3 | Resolved in this proposed version: referral is already placed and DXA is baseline information, not a prerequisite for an age-based operation. The reason surgery is not keyed is the subsequently established inherited disorder, not normal bone density. This new objective requires independent review and manager composition acceptance. |
| G05-staging | parked | No new version emitted | Referral/DXA logic is resolved in proposed G05, while this technical scored replacement is parked. It is not a mandatory study for confirmed FHH and is not a permission step before surgery. Original paired encounters and frozen saves remain untouched. |
| G06 | none | Exact accepted PASS preserved | Previously resolved and accepted exact G06; no action in this round. |
| G07 | parked | No new version emitted | Specificity was improved editorially but the exact method/processing key is not supportable from the ledger. Parked; keep current live PTLD version until a directly sourced specific comparison is accepted. No claim that EBV establishes PTLD or that a generic core is wrong is added. |

**G01:** the frozen original audit identifies four paired cases/eight variants:
four-month, six-month, hematology-followup and stable-count. Each original first
node asks for HIV/HCV evaluation; each second node defers elective splenectomy.
None keys marrow. The exact IDs/keys are in the controls receipt. That does not
identify the owner's recollected encounter or prove a universal testing ladder.
The recorded isolated-ITP claim does not support the newer multilineage marrow
ranking. Reverting to initial viral testing would duplicate the siblings without
settling that concern. The historical ASH timing source has an unresolved
bibliographic identity; the live fallback is recorded, **not cleared for new
acceptance**. Manager source/release review must address that existing issue.

**G02:** the existing claim supports trigger-free planning in an MH-prepared
facility. It does not establish the named agents, negative-panel interpretation,
contracture-test timing, exact readiness or prophylaxis ranking. Returning to
routine-versus-trigger-free labels would repeat the owner's easy/generic-choice
problem. The specific round-two comparison stays historical and parked.

**G03:** replaced absent-site bookkeeping with completed imaging of the current
clinical target. Mammographic and sonographic observations explicitly define
the negative studies. The learner must distinguish a separate concordant
fibroadenoma from the current hard, irregular, poorly mobile focus, then choose
tissue assessment despite imaging. MRI and interval examination/ultrasonography
are actual competing pathways, not completed-test or missing-export foils.
Sampling method is left to the breast team, as the recorded claim requires;
there is no new image-guided-device rule. The exact original v1 lineage is
identified; B2B36 is not treated as a repair or an acceptance.

**G04-R:** considered a source-supported urgent specialist-assessment decision,
but that would remain the easy safety recognition already rejected. The ledger
does not verify a trajectory or modality-priority discriminator for a harder
replacement. No hCG threshold, repeat interval, aspiration indication or unsafe
delay competitor is invented. Original G04 stays live; the agreed retirement/
merge requires a harder supported, independently passed and accepted replacement.

**G05:** a pathogenic CASR result now exists; no option is a gene test, so family
history cannot match a sole genetic answer. The player interprets confirmation
in the stable low-clearance phenotype, then decides whether a PHPT-specific age
criterion or a focal localization image supplies an operative indication.
Surveillance, parathyroidectomy and cinacalcet are named management choices.
The key is the directly recorded observation policy for confirmed uncomplicated
FHH; the drug is an unendorsed distractor, with no new indication, efficacy,
dose or threshold taught. A VUS, negative panel, progressive change or separately
established coexisting PHPT would invalidate this confirmation-dependent key.
Normal baseline DXA is not the reason for observation. Referral already happened.

**G05-staging:** the hardware/radial matrix remains parked; the general three-
site claim does not verify that technical comparison. In proposed G05 the
completed baseline study is unscored context after a referral, not a permission
step or mandatory study for confirmed FHH. No basic-purpose approval is invented.

**G07:** a tissue-required claim cannot rank excision over an adequate core or
prescribe fresh/fixed allocation. Explicit whole-formalin wording would not
verify that protocol. No cause of failed flow viability is inferred. A return
to tissue-versus-EBV matching would remain the easy evidence-gap item; the
specific method/handling comparison is parked rather than retained with a held key.

## Source and meaning boundaries

[Source ledger](sources-question-flags2-round3-20261105.json): **6 reused source
records / 5 publication identities, 10 original basis claims and 7 new atomic
applications**. ACR palpable-mass guidance and ASBrS/SBI benign fibroepithelial
guidance support G03. PARAT, the Fifth Workshop and NIDDK support G05's disease
distinction, observation boundary and limits of localization. The two Fifth
Workshop IDs are one publication, not independent corroboration. Original access
dates, complete citations, URLs/DOIs, rights/reuse assessments and medical
authority are retained. No source was re-accessed, no text/snippet was copied,
and no unverified protocol was promoted to a new fact. Historical holds remain
documented in the unchanged round-two ledger; they are not resolved by parking.

G03 changes acquisition selection to clinical-target management, so it uses
concept.palpable-breast.completed-imaging-clinical-target.v1. G05 changes genetic
test selection to management after confirmation, so it uses
concept.phpt.inherited-calcium-before-localization.v2. Previous concept IDs,
exact question definitions and source/timing/order archives remain intact.
Neither new card is registered in the live concept list; no FSRS transfer,
selection, save format or frozen encounter is changed.

## Important integration limitation — no simple node substitution

The retained **flags2-round3** view deliberately has **two one-node cases**.
G03 provides already-completed imaging and omits the old ultrasound gate and
repeated downstream biopsy question. G05 provides completed unscored baseline
assessment and omits the held round-two acquisition task. This is an explicit
proposed merge of case decisions, not an invisible edit to a preserved neighbor.

The current projector uses the legacy case's node list. Adding these two rows
and a header pin by themselves would reintroduce the old neighbors; a header
with one node does not remove legacy nodes. **Do not accept these as simple
partial substitutions.** Manager must review/authorize the proposed case
composition or park them if that is outside the accepted integration scope.
No projector, manifest, legacy binding or routing code was changed here.
The new meaning also overlaps existing biopsy/FHH teaching: manager should
consider the merge/coverage implication instead of adding duplicate learning
cards automatically. This is a proposal, not a retirement or coverage change.

## Validation and shared-tree evidence

| Check | Exact result | Native exit |
| --- | --- | ---: |
| Focused clinical: round 1, round 2, round 3, manifest, timing, accepted 2b | **97/97 tests; 6/6 files** | 0 |
| Cue-linter tests | **33/33** | 0 |
| Clinical-content typecheck | **2 N3 TS2339 diagnostics; 0 flags2 diagnostics** | 1 |
| Candidate lint, every canonical/finite profile | **0 before → 0 after; 2 variants / 8 contexts** | 0 |
| Builder, packet and preservation reproducibility checks | Passed | 0 |

Vitest used --pool=threads --maxWorkers=2. Full commands, native results and logs:
tools/question-quality/question-flags2-round3-validation-20261105.json.
The typecheck errors are both in question-new-n3-round2-20261105.ts at 93:123
and 101:116: N3Choice has no plausibleMisreading property. That lane remains
untouched. No full clinical, game-domain or player suite was newly run; there is
no whole-tree-green claim and no failure from flags2 clinical content.

The initial new snapshot tests saw concurrent N3 changes (95 passed / 2 failed).
The intake was **not refreshed** and no old assertion was edited. The final
checks reconstruct the exact intake bytes after removing only the marked N3
export, exact timing import/spread and exact catalog/helper substitutions.
They also compare every earlier timing row byte-for-byte and permit exactly
the N3 worker's exported new rows. Final controls prove **62 prior files byte-
frozen**, all earlier timing identities retained, and an unchanged live release,
manifest and G06. N3's three shared paths are separately identified in the
controls receipt; they are not attributed to this worker.

Read-only whole-live-bank lint: **1,136 cases / 1,449 nodes / 1,444 unique
variants / 6,091 contexts; 1,988 findings on 939 variants**. These existing
warnings are not a zero-lint result or an authorization to change other items.
No lint rule, severity or suppression changed. The new candidate timing export
has two exact tuples and **four** planned testing-choice order records, all
not_executed/future_planned. Nothing is appended to global execution or waits.

## Exact files

Only one pre-existing file was edited by this worker: the separately marked
three-line export in packages/clinical-content/src/index.ts. Every other file
below is a new flags2-round3 artifact. Machine paths/hashes are in
tools/question-quality/question-flags2-round3-files-20261105.json.

- docs/execplans/question-flags2-round3-20261105.md
- docs/research/question-flags2-round3-20261105.json
- docs/research/question-flags2-round3-handoff-20261105.md
- docs/research/sources-question-flags2-round3-20261105.json
- packages/clinical-content/src/index.ts
- packages/clinical-content/src/question-flags2-round3-20261105-data.ts
- packages/clinical-content/src/question-flags2-round3-20261105.test.ts
- packages/clinical-content/src/question-flags2-round3-20261105.ts
- packages/clinical-content/src/question-flags2-round3-evidence-20261105.ts
- packages/clinical-content/src/question-flags2-round3-retained-input-20261105.ts
- tools/question-quality/build-question-flags2-round3-20261105.mjs
- tools/question-quality/capture-question-flags2-round3-20261105.mjs
- tools/question-quality/control-question-flags2-round3-20261105.mjs
- tools/question-quality/finalize-question-flags2-round3-20261105.mjs
- tools/question-quality/fixtures/question-flags2-round3-before-20261105.json
- tools/question-quality/question-flags2-round3-clinical-20261105.log
- tools/question-quality/question-flags2-round3-clinical-final-20261105.log
- tools/question-quality/question-flags2-round3-controls-20261105.json
- tools/question-quality/question-flags2-round3-files-20261105.json
- tools/question-quality/question-flags2-round3-lint-20261105.json
- tools/question-quality/question-flags2-round3-linter-tests-20261105.log
- tools/question-quality/question-flags2-round3-linter-tests-final-20261105.log
- tools/question-quality/question-flags2-round3-specs-20261105.mjs
- tools/question-quality/question-flags2-round3-typecheck-20261105.log
- tools/question-quality/question-flags2-round3-typecheck-final-20261105.log
- tools/question-quality/question-flags2-round3-validation-20261105.json
- tools/question-quality/review-question-flags2-round3-20261105.mjs

## Level 5 bound-input impact

One existing bound runtime input changed **by this lane**:

- packages/clinical-content/src/index.ts
  - Intake: 41472b04a8d9e863a4e185b07b9224c1e5bc1235f587e94eddc55ef6c6daaeb3
  - This lane's export only: c9698658b8a074969fca4931acd6a2fc176095de85322592069cba8ed26e6c24
  - Current combined file (also contains N3 export): 1c2a9b330320800dea6ce35317c1fc3ac60d86735b6d22734f5a46f8304fb484
  - Removing both identified append hunks recovers the intake hash exactly.

New transitive runtime inputs from this lane:

- packages/clinical-content/src/question-flags2-round3-20261105.ts — 091c23056f38aab98a78b193a6d47f1cf4faf6e449844be6bf68374c1e370110
- packages/clinical-content/src/question-flags2-round3-20261105-data.ts — e4e4a94d23ffdf04f37e9130edc1e27b6698c481232eba56aac31e10a2119af3
- packages/clinical-content/src/question-flags2-round3-evidence-20261105.ts — d0494466d8dcfd701c614ea7142ca2f1bed0e62c07da349af32624738f3e2b3a
- packages/clinical-content/src/question-flags2-round3-retained-input-20261105.ts — 4521f3ceb55e980322b935e219b2daec42dddcf2ad83009c6f7ddd03f53177d8

Tests, tools, docs and captures are not runtime inputs. N3 independently changed
synthetic-content.ts and answer-choice-timing.ts and appended its own index
block. Their before/after and isolated-original hashes are recorded separately
in question-flags2-round3-controls-20261105.json; this worker edited neither.
No Level 5 evidence, pin, checkpoint, hash expectation or rebind was touched.
The manager owns the actual combined release-tree binding.

## Stop and handoff

Stop for independent review of the two supported candidates; five items remain
parked with the exact live fallbacks in the packet. Resolve the merge/composition
decision before any acceptance, and let N3's owner resolve its type diagnostics.
No manifest row, public release, source/clinical approval, Git operation,
installation, network request, agent, external message, deploy, Supabase,
player/save/cloud or other lane edit occurred. The active write boundary
excludes the shared CURRENT_THREAD_HANDOFF.md; this file is the scoped handoff.
This checkpoint remains local only; the manager owns any later backup/release.
