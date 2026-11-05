# Whole-bank question program: 2026-11-04

## Goal and standing authority

Rewrite the entire live bank from accumulated owner feedback and voluntary
in-game flags. Melissa Rowland remains clinical sign-off; Dustin is a tester.
The owner no longer reviews pages. Each bounded batch ends after authoring,
advisory lint, a technical review packet, appropriate validation and a handoff.
The manager conducts independent review, acceptance and release. This worker
does not ship, dispatch agents, commit, install or use the network.

The owner authorizes the program autonomously; this is not permission to skip
the per-batch stop. Normal batches contain about forty variants. Batch 2a is
the explicitly requested owner-feedback exception, initially ten variants.

## Inputs read and current state

- Root AGENTS.md and the existing authoring standard/cue linter.
- All 32 decision/note entries in the private owner-review JSON, reduced to
  item ID, decision and note. Never copy emails or unrelated private metadata.
- Only the 19 Question flag sections in the latest feedback digest,
  feedback-2026-11-04T12-47-37.887Z.md. Eighteen overlap the prior flag work;
  the adrenal DST v4 is newly flagged for an unclear multi-screen task.
- The whole-bank cue audit: 179 new-owner-rule candidates, 1,418 live variants.
  Structural case references are a priority proxy; no player analytics.
- Round-two flag handoff: sixteen draft r3 variants await independent review;
  all remain frozen until the manager supplies that result. Existing catalog
  412 concepts, 1,110 cases / 1,423 node occurrences, 1,799 timing rows and
  357 exact test-choice records.

The immutable baseline is
`tools/question-quality/fixtures/question-bank-batch2a-before-20261104.json`:
assembled content, sanitized decisions/flags, claim/source metadata and hashes
of 1,503 protected files, including player source/public assets, domain,
clinical source, Supabase and Level 5 evidence. No Git was used to inspect it.
The shared tree already contains prior authorized work; preserve it.

## Superseding decisions

- Keep F14 thyroid-nodule FNA selection unchanged. It is core general-surgery
  content; defer a replacement until a permitted source supports exact criteria.
  Do not retire it. No network access is authorized in this milestone.
- Keep neck-node initial evaluation in scope and retain the round-two clarity
  fixes. The earlier retirement recommendation is declined. Do not change that
  frozen round-two draft while independent review is pending.
- Preserve exact owner-approved versions unless the owner's own note asks for
  changes. B01's picture note authorizes a new draft exhibit version; its old
  approved/reviewed definition and passed companion remain retained.
- New clinical versions/claims remain needs_clinician_review. No correct-answer
  collection, thresholds, sample-size rules, gameplay analytics or approval
  inferred from tests. Manager acceptance is separate from clinical sign-off.

## Queue and ownership

Priority 1: owner changes/notes and voluntary flags. Priority 2: the 179 advisory
cue candidates. Priority 3: remaining variants by facility entry level, then
structural case-reference frequency and related-concept grouping. Review tiers,
acuity, facility capability/progression and intentional basic roles separately.
Do not infer measured exposure or difficulty. Maintain an explicit whole-bank
queue and retire-or-merge proposal list; proposals do not alter selection/FSRS.

Batch 2a targets (stable case/node mapping comes from the baseline packet):

| Item | Owner direction |
|---|---|
| b1-B01 | Confirm and supply the promised usable tracing/picture exhibit |
| b1-B02 | Specific named treatments/actions rather than assessment labels |
| b1-B02-context | Replace low-value acquisition trivia with a useful decision |
| b1-B03-context | Interpret the exhibit; remove confusing report-edit wording |
| b1-B05-context | Delete framing; respect the demonstrated symptomatic hernia |
| b1-B06 | Clinically realistic hernia workup, not routine MRI by stipulation |
| b1-B07-context | Reconcile the hernia findings with the plan |
| b1-B12-context | Test an important diagnostic/treatment decision |
| b1-B36 | Concrete, understandable practical QI task |
| new adrenal flag | Specify the hormonal decision; avoid several indicated screens competing |

One necessary companion revision is included: B06-context must refer to the
new targeted-ultrasound result rather than MRI. Only that chronology phrase
changes; retain its functional observations, options, feedback and concept.
Thus the authored batch contains eleven versions, ten substantive targets plus
one compatibility/continuity companion. It is not an owner-approved version.

Own clinical authoring sidecars and minimal assembly/index/timing changes under
packages/clinical-content; question tooling; scoped docs/research; this plan;
the standard; exact domain bindings and test fixtures strictly required by
these rewrites. If a real image requires additive exhibit rendering, first
inspect the existing renderer/schema and record the minimal path-specific
implementation before editing; do not touch App.tsx or entry/loading UI.
Forbidden: cloud/save implementation, Supabase, Level 4/5 tests/evidence,
selector/routing, unrelated art and other workers' lanes. No deletion/retirement,
rebind, installation, network or publication.

Minimal image lane: additive `image` alternative in
`packages/clinical-content/src/schema.ts`; new shared
`apps/player/src/ui/ClinicalImageExhibit.tsx`; small branches in
`apps/player/src/ui/ChartPanel.tsx` and
`apps/player/src/mobile/MobileChart.tsx`; focused rendering tests; two original
PNG schematics in `apps/player/public/clinical-exhibits/`. Restrict assets to
local relative PNG paths and use the existing deployment base URL. Original
tables/keyValue/abstract remain accepted unchanged; no save-envelope or cloud
code is changed. Generate schematics offline with built-in System.Drawing,
because matplotlib is absent; no install. They represent qualitative pressure
relationships, not measured patient values or copied guideline figures.

## Batch contract and acceptance

1. Freeze the exact before bank, owner-approved versions, sixteen pending flag
   drafts and all non-target nodes. Map every owner note to an explicit response.
2. Choose important clinical objectives; document the credible resident error,
   deciding raw finding, closest alternative and one-best-answer boundary.
   Default to application; never add ambiguity to make an item difficult.
3. Use concrete actions, three/four parallel options, named patient/age/sex,
   short complaint, complete task, randomized runtime answers and accurate wait
   metadata. Apply sentence deletion, cue attack and sequence-continuity checks.
4. Reuse adequate locally recorded sources with their real dates/rights and
   atomic claim mappings. No invented exact value or unsupported new cutoff.
   Flag an unsupported task for deferral/proposal instead of fabricating evidence.
5. Preserve stable concept IDs for unchanged clinical meaning; explicitly version
   changed constructs and retain old definitions, timings and exact orders.
   Preserve frozen encounters/saves and document any changed bound inputs.
6. Run linter before/after, regenerate the review-only key-first packet and
   source ledger, and keep a human disposition for every retained warning.
7. Validate clinical-content, lint tests/whole-bank totals, touched player tests,
   full player (existing preload, threads), full game-domain (sandbox threads),
   and seven typechecks. Report exact counts, fixture deltas and actual failures.
   No timeout/assertion weakening. Level 5 rebind/legacy refresh is manager-owned.
8. Write the scoped handoff/file manifest, update this plan and queue, then STOP.
   Do not start the next forty while this batch is awaiting the manager's pipeline.

## Progress and next action

### Batch 2b round two — handoff completed, 2026-11-05

- Revised the 37 returned items and included omitted F13: 38 candidates in
  37 cases. B2B06/B2B10 remain exact PASS versions. The new packet contains
  40 records and 292 indexed responses, full visible-history context, rationale
  pairs, five-part author checks, exact cue spans and local fallback identities.
- Registered the `batch2b-round2` source view with the separate worker's ship
  manifest. Added no acceptance rows; unaccepted candidates add neither live
  variants nor new live concept cards. Same-code and serialized-release controls
  confirm no live-content delta from this round. Old timing/order identities
  remain exact; 52 candidate records use existing profiles and unchanged gates.
- New scored meanings use 31 separate concept versions; 69 new atomic claims
  and all new versions remain needs_clinician_review. B2B32/B2B34 exact numeric
  aids and F13's awake gas-exchange prioritization have explicit source holds.
  No network/source retrieval, access-date advance, approval or retirement.
- Same-v8 candidate lint: 13 → 7 findings; owner-rule findings 2 → 0. The
  controlled catalog and the manifest-selected live bank are reported separately.
  Only 40 queue rows change; 1,457 unrelated rows remain exact. Batch 2c stays
  a proposal. No batch-2a or question-new-* source/packet edit.
- Latest full clinical: 1,073 pass / 50 fail / 1,123 total. Full domain:
  4,556 pass / 452 fail / 1 skip / 5,009 total. Full player: 3,518 pass /
  14 fail / 3,532 total. Seven typechecks pass. Focused clinical 62, domain 14,
  player presentation 41, lint 33 and author/math checks 8 pass. Broad domain/
  player runs precede two final wording clarifications; fresh full clinical,
  exact-binding and serialized-default controls cover those changes. The shared
  tree is not green; exact native logs and input-window limits are retained.
- STOP for independent review. The handoff lists every candidate response,
  three holds, existing/live fallback IDs, exact files and eight changed Level5
  bound inputs. Manager owns acceptance, mixed-case/header review, failure
  integration, genuine evidence rebind and legacy behavioral refresh.

Handoff: `docs/research/question-bank-batch2b-round2-handoff-20261104.md`.
Packet: `docs/research/question-bank-batch2b-round2-20261104.json`.

### Batch 2b round two — bounded correction milestone

Manager supplied question-bank-batch2b-review-20261104.json: preserve exact
B2B06 and B2B10 PASS versions; revise the other 37 returned records, including
the three FAIL items B2B21/B2B26/B2B39. Include the omitted F13 in the new packet,
with a supported practical application or an explicit unresolved source hold;
do not invent a monitoring, treatment or surgical-delay protocol to fill it.
The intended packet is forty records: two frozen PASS plus 38 review responses.
Batch 2a round three and every question-new-* file are frozen outside this lane.

Before content edits, capture the current assembled release, every target,
source/claim metadata, approvals, timings/orders and protected hashes. Read
each independent note and the independently passed batch-one calibration
items. Address the specific resident error, raw deciding finding, plausible
closest alternative, supported one-best-answer boundary and counterfactual.
Preserve old variants/concepts/frozen encounters; add concept versions only
when the scored meaning changes. New clinical data remain needs_clinician_review.
No agents, Git, installs, network, release or Level 5 evidence edits.

Own additive question-bank-batch2b-round2-* modules, minimal registry/timing/
binding hunks and necessary tests, scoped tools, the requested review/source/
handoff/queue documents and this plan. Do not edit cloud/save/Supabase, entry
UI, routing/selector or other lanes. The new-content worker owns the emerging
question-ship-manifest.ts. When its established mechanism exists, integrate
rewrite candidates with that gate so only manager-accepted exact versions can
replace their live fallback; an author self-check never marks an item accepted.
Do not create a competing manifest format or ship a draft automatically.

Per-item manual five-part checks precede handoff. Run clinical, advisory lint
and the whole-bank scan, affected player tests, game-domain threads and seven
workspace typechecks, preserving exact counts and moving-source windows. Stop
at docs/research/question-bank-batch2b-round2-20261104.json and the scoped
handoff for independent review/manager release; no next batch is authored.

### Batch 2a final author round three

Manager supplied review two: preserve exact B2A01/B2A02/B2A08/B2A09 PASS
versions and revise only B2A03/B2A04/B2A05/B2A06/B2A07/B2A10/B2A11.
Batch 2b is frozen under independent review; do not change its modules,
packet, tests or marked assembly blocks. Preserve question-new-* and all
other lanes, prior exact approvals, old variants/claims/timing/order records.
Use additive source modules and a new round-three packet, with per-note
responses and concrete author rubric attacks. Reuse permitted locally recorded
claims offline; do not invent thresholds, protocols or causal conclusions.

Capture the current combined bank, metadata, four PASS displays, batch-2b
hashes and registry inputs before clinical edits. Keep historical round-two
views exact and place the new projection before the frozen batch-2b stage.
Use new concept versions only for changed scored meaning; preserve histories
and frozen encounters. New definitions remain needs_clinician_review. The
manager's last-round disposition is explicit: a returned item may ship only
if the original owner note is fully resolved and final review has no FAIL;
otherwise retain the recorded live fallback. This worker does not release.

Own new question-bank-batch2a-round3-* source/tools/tests, minimal shared
registry/binding hunks, the requested packet/source/handoff/queue documents,
this plan and the proposal-only batch-2c list. Run the inherited clinical,
lint/whole-bank, touched/full player, full domain threads and seven typechecks
without weakening assertions or budgets. Record actual failures and shared
input windows; do not rebind evidence or repair other workers' lanes. Stop
after the round-three handoff and refreshed next-forty proposal.

Authoring and validation commands are complete. The eleven-record final packet
contains four exact PASS records and seven unapproved drafts with 77 indexed
note responses, five new scored concept versions and nine atomic mappings.
Fourteen protected file hashes, 1,183 other cases and 1,495 other nodes verify
unchanged; all thirty-nine pending batch-2b targets and queue rows are retained.
Same-v8 whole bank: 1,497 variants, 1,900 findings before/after; selected seven
three before/after, with written dispositions and zero owner-rule findings.
The final deletion check removes repeated hip data from B2A05 without changing
its scored repair-plane decision or any order/gate/timing identity.

Five exact domain fixture repairs are isolated by a same-current-code control.
All 296 assertion call sites and every deadline remain; the frozen-order test
also retains the actual round-two stage. Final touched player: 62/62; domain
binding/inventory: 23/23; related/historical clinical controls: 76/76; linter:
33/33. Final full clinical: 981 pass / four fail (985), 108 files; failures
belong to the N2 narrative and three frozen batch-2b global-stage assumptions.
Full domain threads: 4,777 pass / 27 fail / one skipped (4,805), 196 files,
916.95 seconds: 26 Level 5 input/legacy guards and the separately owned N2
inventory mismatch. Full player preload/threads: 3,498 pass / one fail (3,499),
363 files, 701.26 seconds; the protected cloud timing assertion remains.

Earlier seven-workspace typechecks pass; later reruns pass six and report
first TS2339 context errors, then TS2322 return-type errors in the concurrent
session/UI lane. Both diagnostic logs are retained. Input windows retain all
owned changes, new unimported N1 round-three files and external App/cloud/local
journal changes. No protected source is repaired by this worker. Full domain/
player counts precede the final B05 deletion-only cleanup; the final clinical
and focused presentation/binding checks cover it. Do not claim a wholly green
integrated tree or continuation checks hidden by the Level 5 hash guard.

STOP for manager review/integration. The scoped handoff and eight changed own
Level 5 inputs are in question-bank-batch2a-round3-handoff-20261104.md. The
source ledger records 37 current/retained/basis claims and 27 existing sources,
with explicit recurrent-repair/endocrine source-alignment limitations. Batch 2c
is a refreshed forty-item proposal only. No Git, network, installs, evidence
rebind, release, retirement/merge or next-batch authoring is performed.

### Batch 2b: active authoring milestone

Manager authorizes the next bounded batch while batch 2a round two is frozen
under independent review. Select forty: re-queued kept-live F02/F06/F07/F08/
F13/F16 first, then proposal ranks 1–34. Importance review defers generic
cirrhosis proposal ranks 21/22 unchanged for a manager merge decision; nutrition
ranks 35/36 substitute. A final author difficulty attack then defers F13
unchanged: thirty-nine drafts are submitted, not a padded fortieth. F13 stays
priority-one queued_supported_application_needed. Ranks 37–40 stay queued.
F04 and F14 retain source holds and are not rewritten. Do not change any
batch-2a source/packet, other flag version, exact approval or question-new-* file.

Calibration read: independently passed B02, B25, B34, B35 and B35-context,
including their actual findings/options and review-seven ratings. Reuse their
construction, not wording: interpret evidence quality/anatomy/trajectory, then
make a consequential choice; each close alternative is correct under a
plausible misreading. Capture deciding finding, counterfactual, closest error,
same-stage options, source limits and five-part self-check on all thirty-nine
submitted drafts; the failed F13 self-check is a deferral.

Entry capture: tools/question-quality/fixtures/question-bank-batch2b-before-
20261104.json, 4,898 protected hashes and the actual frozen 2a projection over
the valid captured bank (507 concepts / 1,189 cases). The separate N1 round-two
assembly still throws its prior-binding error. Continue authoring against this
explicit isolated baseline as instructed; do not change or bypass that stage
in production. Report standalone and combined validation separately.

Own additive question-bank-batch2b-* clinical modules, minimal marked registry/
timing/order appends, focused tests, queue/proposal/retire ledger, scoped packet/
source/lint/handoff artifacts and this plan. New concepts only for materially
changed objectives; all old versions remain. No cloud/save/Supabase, routing,
Level 4/5 tests/evidence, other workers' code, network, installs, Git or release.
Run the existing clinical/lint/affected and full player/domain-thread/seven-
typecheck gates, record exact results, then STOP for independent review.

Thirty-nine drafts are authored in additive question-bank-batch2b source modules,
with seven new concept versions and thirty-nine mapped application claims. All old
concepts/definitions stay retained. Six manager-kept-live flag identities are
recorded separately from rejected author drafts in the new packet. The packet
has every requested field, key-first review notice, deciding finding, closest
error, counterfactual and five-part author self-check. No clinical or independent
PASS is self-granted. Bibliography/application ledger: 89 claims / 36 source IDs,
with original access dates/rights and offline-source limitations preserved.

The other lane repaired its N1 import guard during authoring. The final packet
and whole-bank comparison now use the real combined default assembly and its
retained pre-2b stage (513 → 520 registered concepts, same 1,189 cases / 1,502
nodes). Same-v8 lint: 2,029 → 1,900 findings; selected thirty-nine 134 → 10,
owner-rule findings 59 → zero. No linter rule/suppression changed. All protected
content/packets/assets, including batch 2a, match entry exactly. Of the 49
tracked files, 48 are byte exact; one historical flag binding test changes only
its import to the retained round-three stage, preserving every assertion.
The verifier reconstructs and hashes its exact original. There are 1,151 whole
cases and 1,463 non-target nodes unchanged across this projection.

Sixty exact study records are additive: two retained existing-service gates,
one retained terminal ultrasound route, four existing terminal procedures and
fifty-three nonexecuted previews. Active studies change 1,541 → 1,567 and
terminal testing keys 163 → 172.
The three focused binding/admission/inventory files pass 18/18 after only the
explicit seven-concept and count expectations changed. First full clinical:
933 pass / one longest-key failure; balanced labels then pass the existing
parity suite. A full 934/934 run passes, followed by a final full rerun after
the bracketing self-check revision. Linter tests 33/33 and seven typechecks
passed in that source window. Final domain/player and source-window checks
are in progress. The first full domain run reports 4,671 pass / 41 fail / one
skip (4,713): 26 expected Level 5 input/legacy hashes, fourteen stale
current-versus-retained fixture expectations and one inventory timeout.
Explicit fixture/binding repairs preserve assertions, commands and deadlines;
the focused eight-file run reports 970 pass / one case-specific label failure,
then that label assertion is corrected for only the rewritten case. A full
repaired domain run follows. Later typecheck found four narrowed fixture-type
errors here (fixed with an explicit unchanged-facility-stage guard), plus two
concurrent incremental-evidence test errors outside this lane; preserve that
file and report the final source window separately. No evidence is rebound.

Batch 2b handback (39 drafts; independent review pending):

- Final clinical-content: 934/934, 106 files. Advisory linter: 33/33; whole bank
  1,497 variants / 6,197 finite contexts, 2,029 → 1,900 findings; selected drafts
  134 → 10, owner-rule findings 59 → zero. All warnings are retained/disposed.
- Final eight touched domain suites: 971/971, eight files. Three affected
  player presentation/flag/image suites: 59/59, three files. No player source
  or test was changed here. Seven-workspace post-worker typecheck passes after
  the other lanes repair their own cloud/evidence test errors.
- Repaired full domain: 4,688 pass / 27 fail / one skip (4,716), 193 files,
  1,037.65 seconds. Twenty-six are the unchanged Level 5 input-binding/legacy
  initial-hash checks. The remaining inventory test reaches its original
  10-second limit during the broad run, then passes alone (one pass / three
  filtered skips, 8.57 seconds test time). No deadline or assertion is weakened.
- Full player with the existing absolute preload and threads: 3,462 pass /
  eight fail (3,470), 355 files, 835.34 seconds. Isolated account/cloud suites:
  60 pass / five fail (65), five files. The five rank/playtime/account-mode
  failures reproduce; request-load and transport pass in that later window.
  The performance guard also fails alone: 60.0753 ms versus its unchanged
  16-ms tick-plus-overview budget. Do not claim a green whole tree or assume
  this is pre-existing without a controlled comparison. Those lanes are
  untouched; manager integration/performance follow-up remains necessary.
- Concurrent source/test additions and hash changes are recorded per input
  window, including new-content, request-budget and operational-engine work.
  No further broad rerun is presented as a stable integrated-tree gate.
- Final packet, full rubric responses, source/claim ledger, exact eight bound
  inputs, file manifest, commands/log summaries and open decisions are in
  `docs/research/question-bank-batch2b-handoff-20261104.md`. F13 remains live and
  queued; no fortieth draft, source protocol, retirement or basic label is
  invented. Batch 2c is proposal-only.

STOP at the manager's independent-review gate. Nothing shipped; no Git,
installs, network, evidence rebind or other-lane fixes were performed.

### Batch 2a round two: active bounded milestone

Manager returned `question-bank-batch2a-review-20261104.json`: freeze B2A01
PASS (accepted foundational image interpretation); revise only B2A02–B2A11.
All fourteen flag-round-three items, F01/F12/F14, earlier exact approvals and
the separate worker's `question-new-*` definitions/appends are protected.
Use additive versions, retain historical definitions/gates/choice records and
new concept versions only for changed scored meaning. No routing/save/cloud,
Level 4/5 test/evidence, Git, install, network or release work.

Capture the current synthetic bank and hashes before edits. Read every review
note and original owner direction. Make each returned task a consequential,
specific application with adequate context and credible same-stage choices.
Keep uncertainty/source holds explicit rather than inventing a protocol rule.
Record a separate five-part self-check on every item: cover-key cue attack,
parallel stage/category, two substantive steps, predicted PGY-2/3 difficulty,
and one defensible key. Self-check is not independent or clinical approval.
Run advisory lint before/after, regenerate the packet, validate clinical,
linter, affected/full player, domain threads and seven typechecks, then hand off.
Only after this bounded batch is complete may batch 2b be attempted in this
turn; it must also complete its own review packet and stop at review gate.

Round-two authoring is complete: ten additive variants, six new scored
construct versions and eight mapped application claims. B2A01 is frozen;
both eleven-item packets have been regenerated. All 121 review notes have
indexed responses and each draft has the requested five-part author rubric.
All new clinical versions remain needs_clinician_review. The isolated actual
projection/schema check preserves 1,181 cases and 1,492 non-target nodes,
protected flag sources and old image assets; it finds no version collisions.

Last complete same-v8 lint: 1,497 variants / 6,197 finite contexts, whole-bank
findings 2,043 to 2,035; selected ten 13 to 4, owner-rule findings zero.
Last complete clinical run: 885/885, 104 files. Repaired full domain:
4,590 pass / 26 fail / one skipped, 184 files; the remaining failures are
the expected input guard and 25 legacy Level 0–4 initial-state hashes.
Full player: 3,451 pass / two fail, 352 files. Projection timeout passes at
its original isolated deadline; the protected cloud performance guard still
fails (49.1916 ms against 16 ms). Seven typechecks passed in the recorded
handoff window. No deadlines, performance budgets or assertions were weakened.

The shared N1 round-two stage subsequently blocks fresh combined-bank imports
at case.n1.breast-mass-morphology.v1. Current bank lint, one clinical suite and
three affected presentation suites stop at that error; fresh linter tests
are 32/33 with the bank-import test blocked. Leave the separate new-content
lane untouched. Input locks/window comparisons distinguish earlier complete
runs from current-head failures. The current owned projection and packet
still verify independently; that is not a claim that the combined app is green.

STOP for independent review/integration. Batch 2b is proposal-only: do not
author against a combined bank that cannot import. Exact per-item responses,
files, source limitations, fixture controls, validation and seven changed
Level 5 inputs are in docs/research/question-bank-batch2a-round2-handoff-20261104.md.
No release, Git, installs, network or evidence refresh was performed.

### Flag replacements: final author round (superseding pending-review state)

The manager supplied `question-flags-adversarial-review2-20261104.json`:
F01/F12 PASS and frozen; F14 remains on its source hold. The next bounded batch
is only F02/F03/F04/F05/F06/F07/F08/F09/F10/F11/F13/F15/F16/F17. All eleven
batch-2a versions remain frozen during their separate independent review.
The separate worker owns `question-new-n1-*` and its appended registry entries;
preserve those files and the shared assembly appends.

Fourteen additive r4 versions address all 140 indexed second-review notes.
Eight materially changed scored objectives have new concept versions; retain
all prior concepts, variants, timing rows and exact choice records. F15 now
distinguishes an acidifying change from demonstrated acidemia using laboratory
reference-interval relationships, without invented numerical cutoffs. Thirteen
draft application claims preserve their basis/source records and offline
limitations. F04's new comparative drug ranking requires direct UKKA section
alignment before release acceptance. No network is authorized.

Final-review policy: this is the last author round for these flags. Independent
rejection means retain the current live version, not another rewrite. The new
fourteen-item packet records the known live flagged identity separately from
the pending round-two identity; the manager must reconcile any intervening
release before reverting. F01/F12 are editorial passes, not clinical approval.

Acceptance: exact freezes; clinical-content, linter/whole-bank, focused player
and full player with the existing preload, full domain with threads, seven
typechecks; state actual counts and shared-tree changes. Do not modify Level 5
evidence, cloud/save, routing or new-content sources. Regenerate the packet,
write a scoped final-round handoff, then STOP for final independent review.

Final flag-round validation (not acceptance): clinical-content 835/835,
102 files; 33 linter tests; final focused player 59/59; own/historical binding
checks 6/6. Full player: 3,415 pass / two timeouts, 343 files, 2,061.44 seconds.
Both timeout cases pass isolated at unchanged deadlines (six tests, 44.14s).
Full domain: 4,470 pass / 47 fail / one skipped, 176 files, 3,312.02 seconds:
26 expected recorded-input/legacy-initial-hash mismatches, seven timeouts,
eleven stale content/inventory expectations and three outside-lane functional
routing/restroom assertions. No Level 4/5 tests, evidence or runtime routing edits.

Retained counterfactuals justify literal fixture updates without weakening
commands, assertions or deadlines. Cohort/order checks pass 708/708 and the
sustained-supply diagnostic 1/1. The remaining fixture rerun is 560 pass / three
fail of 563: an independent N2 append arrived during this window and now exceeds
the recorded N1-plus-this-round catalog counts. Preserve that lane; manager/new
content author owns reconciliation. The earlier seven typechecks pass; the
N2 construction-window rerun has six pass and two TS2353 errors in the concurrent
N2 evidence file (`termsUrl`, lines 6431/6461 in that window), untouched here.
That author then changed the file; the final post-change seven-workspace rerun
passes all seven. Both logs and the external hash change are retained.

Same-v8 whole-bank lint now covers 1,497 variants (including the same N1/N2
cases on both sides): 2,039 before / 2,044 after findings. Selected fourteen:
seven before / twelve after; forbidden owner-rule findings remain zero. Exact
warnings and author dispositions are retained, not suppressed. Queue preserves
all eleven batch-2a rows and separates forty N1 / thirty-nine N2 additions.

Packet, source ledger, freeze proof and final scoped handoff are regenerated.
All 140 notes have indexed responses. F04 direct UKKA comparative-ranking
alignment remains a release hold; all drafts remain needs_clinician_review.
STOP for final independent review and manager integration. Nothing shipped;
no Git, installs, network, evidence rebind or next authoring batch. Final
details/files/source-window hashes: `docs/research/question-flags-round3-handoff-20261104.md`.

- Baseline captured; all 32 owner entries and 19 sanitized flags inspected.
- Standard updated first to v13 with practical importance, concrete actions,
  interpretable exhibits, deletion, clinical realism and clear-task lessons,
  plus the two superseding keep/defer decisions.
- Eleven draft versions authored, with two explicit new scored constructs
  (physiology-directed achalasia treatment and completion of residual-lesion
  diagnostic sampling). All 412 prior concepts, 1,101 other cases, 1,412 other
  nodes, eleven exact pilot approvals and sixteen pending flag drafts retained.
- Two original local pressure-study PNG schematics plus accessible descriptions
  and small desktop/phone render branches replace promised prose-only pictures.
  The additive schema accepts all legacy exhibit forms. No cloud/save envelope
  or entry UI code changes.
- B06 intentionally changes its fresh ultrasound workup from an MRI gate to a
  targeted-ultrasound gate. A new exact binding and wording-only follow-up
  preserve chronology. Old MRI definitions, timing and ordinary gate retained.
- Same-v8 lint: 2,039 before to 2,031 after findings; selected eleven 18 to 14.
  Thirty-three linter tests pass. The heuristic now asks for named treatment
  actions, reads image alt/caption observations and recognizes additional actual
  investigation modality names. It does not judge clinical importance or truth.
- Complete 1,418-variant queue and next forty-candidate proposal generated.
  The original 179 candidates remain traceable: twelve are approved/protected,
  167 are queued. In total 163 currently reviewed/approved live variants are
  protected; 1,227 variants queued, eleven batch-2a drafts await review, sixteen
  flag drafts await manager feedback, one F14 held. No next batch is authored.
- A retire/merge proposal ledger records low-value provenance/protocol concerns;
  the F14/neck-node KEEP decisions explicitly supersede old recommendations.
- Source ledger: 38 atomic claims / 39 existing source records. Three new
  qualitative achalasia treatment mappings carry an explicit direct-source
  alignment/foregut-review hold. No network was used and no access date advanced.
- Same-domain entry/current control computed three supply snapshots. Only
  exact expected values and catalog 412 to 414 are updated; all other functional
  assertions and deadlines remain. Day six selects a one-node adrenal case
  instead of the old two-node interpreter case; it completes normally.
- Full clinical: 785/785 tests, 100 files. Full player with the existing preload:
  3,375/3,375 tests, 336 files (includes a concurrently added attendance test).
  Seven workspace typechecks pass. Original validation lock: 1,514 inputs.
- Initial full domain: 34 failed / 4,349 passed / one skipped (4,384), 170 files,
  1,694.53 seconds. Twenty-six are the known Level 5 input/legacy initial-hash
  mismatches. Five additional failures are Level 5 timeouts; do not modify those
  tests, evidence, spatial code or deadlines. Three are stale cohort expectations.
- Corrected exactly those three fixtures: gs028-20261007-batch.test.ts,
  gs028-20261007-variety2-batch.test.ts, surgery-center-batch.test.ts. Eligible
  construct counts gain one at the specified capability pools; the forty-case
  surgery cohort now witnesses both new concept IDs. Case counts, cohort deltas,
  gate counts, all 262 assertion call sites, commands and deadlines are retained.
  Focused result: 700/700 tests, three files, 48.81 seconds. No runtime/UI/content
  changed after the first full validation; these are domain-only fixture repairs.
- Repaired full domain completed with one thread worker:
  tools/question-quality/question-bank-batch2a-domain-repaired-20261104.log.
  New immutable lock: question-bank-batch2a-validation-domain-repaired-lock-
  20261104.json, 1,517 inputs, including three untouched concurrent attendance
  test/fixture additions. Preserve the original full log and its failure report.
- Disposable legacy-load control: all 25 recorded initial hashes reproduced;
  only two new empty histories differ from entry (eighteen cumulative from the
  recorded catalog), frozen encounters exact. No saved state/evidence written.

- Repaired full result: 29 failed / 4,360 passed / one skipped (4,390), 170 files,
  1,295.44 seconds. No timeouts. Remaining: one recorded-input guard, 25 legacy
  initial hashes and three companion/reception failures outside this lane.
- The shared tree moved during validation: eight external files differed at the
  end of the rerun; eleven by the later audit, plus new external restroom/art
  files. The three remaining functional failures are in concurrently edited
  companions.test.ts and receptionist-water-refill.test.ts. Do not touch them.
  No causal timing claim is made: the five timeouts did not recur, but the run
  was not a controlled comparison of one stable tree.
- Latest seven-workspace typecheck was run after fixture repair: six pass;
  player reports TS2322 at the concurrent phlebotomyPresentation.ts:39 file.
  Earlier seven all passed before those outside-lane edits. Preserve both logs.
- That external file changed after the check; one final seven-workspace rerun
  now reports TS18048 at the newly added restroomRecoveryPresentation.test.ts:25
  (actor.location possibly undefined), with the other six workspaces passing.
  Preserve all three logs; do not chase the active art/attendance lanes.
- The final handoff records both windows and every external hash change. Zero
  owned changes occur in the repaired-domain window; the only owned differences
  from the successful clinical/player window are the three explicit domain-test
  fixture repairs. All source/claim/version/freeze assertions still pass.

Batch 2a authoring/validation commands complete; STOP for manager handback.
Whole-tree integration validation is blocked by concurrent changes, the three
outside-lane functional failures, the latest external restroom-test type error and the expected
Level 5 rebind/legacy refresh. Do not chase other workers' files or claim a
green final tree. The manager owns stabilizing/integrating those lanes,
independent review, source-hold resolution and release. Do not author batch 2b
or alter the sixteen pending flag drafts without the manager's review result.


<!-- FLAGS2 milestone 20261105 -->
Owner flags round two is authored and focused-validated; see docs/execplans/question-flags2-20261105.md and docs/research/question-flags2-handoff-20261105.md. Six new exact variants in five retained cases; G03 is frozen B2B36 coverage, G04 proposes retirement/merge without changing live selection. Three explicit source holds; all new records needs_clinician_review. Cue findings 11 -> 0 across 30 contexts; clinical21/21, lint33/33, clinical typecheck passes. The self-contained flags2-round1 view and candidate timing/order exports await manager integration/acceptance; default live content/cards are unchanged. Batch2b stays untouched. STOP for independent review; no further batch is authored in this milestone.
