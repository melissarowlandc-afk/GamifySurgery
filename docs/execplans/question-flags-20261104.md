# Owner/tester question flags — 2026-11-04

## Goal and lane

Resolve the 18 voluntary question flags (17 distinct variants) supplied by the
manager, without editing other questions. Add the six owner lessons to the
authoring standard and the offline advisory linter, with regression tests.
Melissa Rowland is clinical sign-off; Dustin is a tester. Batch 1 is live as
drafts at manager-reported `7b8cff7a`; this worker ships nothing.

Owned lane: question-quality authoring overlays and necessary assembly/timing
hooks under `packages/clinical-content`, `tools/question-quality`, the standard,
and this milestone's review/source/audit/handoff artifacts. No Git, installs,
network, cloud/Supabase/save, routing, Level 4/5 tests or evidence edits.
The tree is shared. Preserve released snapshot-save and Level 5 rebind inputs.
Read only Question flag sections of the private feedback file; never retain
emails or unrelated feedback. The original feedback remains read-only.

## Decisions and acceptance

- Match exact flagged identities against the current assembled bank and batch-1
  revisions; a sibling variant does not resolve a flag.
- Only flagged variants not already fixed may change. Retain prior question,
  timing and choice-order identities and all frozen encounters. New wording
  gets a new variant version; changed scored meaning requires an explicit
  concept version with its old definition preserved.
- New content and claims remain `needs_clinician_review`. Reuse permitted,
  locally recorded source/atomic-claim evidence; no new source retrieval is
  authorized. Identify verification limitations rather than inventing facts,
  current-guideline confirmation or ABSITE scope confirmation.
- Provide key-first review-only before/after JSON, per-flag responses, whole-bank
  before/after lint, batch-2 offenders, exact changed bound inputs and validation.
- Quality uses authoring rules, advisory lint, clinical/owner review and voluntary
  flags; no answer-statistics collection or correctness analytics.

## Milestones and validation

1. Inspect instructions/live assembly; sanitize only question flags; capture
   immutable clinical starting state and protected-file hashes.
2. Verify local claim/source support and scope; write flagged drafts or an
   explicit retirement proposal if evidence/objective is inadequate.
3. Extend and test advisory linter; document owner lessons and scan whole bank.
4. Regenerate the review packet, verify frozen/unrelated records and timing,
   and run clinical-content, lint tests, touched player presentation tests
   (existing preload, threads), game-domain (sandbox threads), seven typechecks.
5. Write a scoped handoff. No publication or evidence rebind.

## Progress

- Instructions, current global handoff and bank pipeline reread. No nested
  AGENTS.md exists in the owned clinical/tooling directories.
- Feedback extraction finds 18 Question flag sections and 17 variant IDs; two
  flags concern the same differentiated-thyroid ultrasound variant. No email or
  unrelated feedback was printed or stored.
- All 17 exact flagged IDs remain live in the current assembly. HIDA v2 was
  rewritten in batch 1, but the flagged HIDA v4 remains unchanged. Full matching
  and local evidence review follow before authoring.

## Implementation and integration progress

- Immutable starting assembly/metadata and 1,020 protected-file hashes captured
  before authoring. All 17 flagged IDs are live; none has an exact batch-1
  replacement. Eighteen flags include two notes on the same thyroid-US variant.
- v11 standard and v6 advisory linter implement the owner lessons. The expanded
  lint suite passes 29 tests, including the actual original flagged wording and
  every finite rewritten presentation. No correctness analytics were added.
- Sixteen additive variants have new `.r2` identities and remain
  `needs_clinician_review`. F14 is **not rewritten**: its recorded source excludes
  the biopsy thresholds needed for an adequately supported raw profile. A hold /
  retirement proposal and the unchanged before/after are explicit in the packet.
  An optional clarification was sent; absence of an answer grants no new source
  access. F05's clinical wording is repaired but ABSITE scope is unverified; its
  ABSITE-labelled release needs a public-outline decision or retirement.
- F03's new anatomical referral-target objective and F10's replacement of the
  disputed oncoplastic exception with the standard mastectomy setting require
  two new concept versions. All 396 previous definitions remain unchanged.
- Every old case/node outside the sixteen targets, including the eleven exact
  pilot approvals and the held F14 case, is unchanged. Old timing rows remain;
  sixteen new rows are appended. No result gate or keyed service is changed.
- Prospective F05 biopsies now have testing previews rather than inheriting the
  old completed-record no-test classification. F10 deferral is a biopsy preview;
  ALND retains its original no-test classification. Live timed choices change
  1,467 → 1,468: neck +3, HIDA -1, breast imaging -1. Terminal timed keys change
  138 → 139. These are static authoring counts, not gameplay statistics.
- `packages/game-domain/src/test-choice-orders.ts` appends twelve exact
  non-execution records (four correct planned/external tests); all 323 old
  records remain exact. No route/selector/save semantics change. The necessary
  `tests/test-choice-order-inventory.test.ts` expectation is 1,468 / 139 with the
  delta above; a new `tests/question-flags-bindings.test.ts` checks exact old/new
  identities and rejection of altered labels. No Level 4/5 test/evidence edit.
- Focused domain binding/inventory: **11 passed / 2 files**. Clinical-content:
  **772 passed / 98 files**. Seven workspaces typecheck. Earlier incomplete long
  runs were stopped for authoring/integration corrections and are not validation
  passes; their partial logs remain. Final full suites follow the focused checks.

Next: regenerate the final packet/source ledger, complete full player and
game-domain validation with the final bindings, audit unchanged protected inputs,
and write the scoped handoff with exact counts and manager-owned rebind needs.

## Full-player follow-up

The first complete final-bindings player run records **3,366 passed / 5 failed**,
334 files, 1,357.26 s. Two failures are a stale `reportedVariant` fixture in
`apps/player/src/session/flagFreeze.test.tsx`: the test intends to exercise the
exact hosted frozen v4, but searched only the revised live bank. Its fixture now
reads the retained pre-flag release. The reported v4 ID and all cloud/campaign,
flagging and recovery assertions stay intact. This is a test fixture repair,
not a save/cloud implementation edit. It is the sole expected player-test hash
change after the first full-player run; domain runtime/evidence inputs stay fixed.

The other three failures are unchanged five-second simulation timeouts: the two
1x/4x gift-route samples and the Level-3 three-nurse presentation. A focused run
of those files plus the repaired flag fixture passes **43 tests / 3 files** at
the original deadlines. Entry-release control is being checked separately;
timeouts are not yet asserted to be content-caused or proven pre-existing.
No spatial, gift, nurse, routing, deadline or cloud source was edited. The first
diagnostic `--setupFiles` invocation was rejected by this Vitest CLI and ran no
tests; the separate diagnostic config inherits the normal five-second deadline.

## Final integration checks

- The entry-release timeout control passes **4 / 4 selected tests** (3 other
  tests intentionally skipped by the name filter), at the original deadlines.
  The repaired full player suite passes **3,371 / 3,371 tests, 334 files,
  479.36 s**, with the existing preload, threads and two workers.
- The initial complete domain run recorded **4,316 passed / 58 failed / 1
  skipped**, 167 files. It exposed stale live-case/concept/timing fixtures and
  three seeded supply snapshots after the sixteen variant/two construct changes.
  Seven non-Level-4/5 test files now use exact current identities, actual option
  branches and reviewed source-derived expectations. No simulation deadline,
  selector, route, service behavior or Level 4/5 assertion changed.
- The exact same callback control under the entry clinical release reproduces
  all three old supply snapshots. Current release callbacks produce the three
  updated values. A separate review verifies unchanged non-snapshot assertions
  (apart from the explicit 396-to-398 catalog expectation/comment). Normal
  validation without snapshot updates passes **1,227 tests / 9 files,
  94.99 s**, including every affected domain fixture and the exact-order checks.
- The final seven-workspace typecheck passes. Authoring/order generators pass
  `--check`; the regenerated packet, source ledger and bank scan agree with
  current content. Protected clinical freezes and all earlier order rows hold.
  Two cloud files changed concurrently outside this worker's lane; they are
  recorded as external shared-tree changes, not overwritten.
- The final full game-domain rerun uses sandbox threads and one worker with a
  fresh 1,025-file input lock. Its exact results and manager-owned Level 5 rebind
  needs will be recorded in the scoped handoff after completion.

## Completed validation and handoff

The final full game-domain run completes in **1,190.47 s**: **4,345 passed /
26 failed / 1 skipped**, 167 files (166 passed, one failed). All failures are
in the unchanged `tests/level-five-integration.test.ts`: one content-input hash
guard and the 25 level-0–4/schema-5–9 recorded initial loaded-state hash checks.
The separate legacy control isolates two new empty concept histories in those
initial states; it does not validate the continued-play assertions that follow
the failing hash. No Level 5 evidence or test was rewritten. The earlier four
checkpoint, normal-operations and Level 4 timeouts do not recur. Every test
outside Level 5 passes; final nine-file focus is 1,227 / 1,227.

Final full player: **3,371 / 3,371**, 334 files. Clinical-content: **772 / 772**,
98 files. Linter: **29 / 29**; whole-bank CLI **2,034 findings / 950 flagged
variants / 1,418 variants**. All seven workspaces typecheck. All 1,025 monitored
source/test/evidence files remain exact throughout the final domain run.

The scoped handoff is `docs/research/question-flags-handoff-20261104.md`;
`question-flags-owned-files-20261104.json` enumerates exact owned files/hashes
and logs. The packet has sixteen draft rewrites and the explicit unchanged F14
source hold/retirement proposal. F05 ABSITE scope and optional F15 retirement
remain manager decisions. Six exact Level 5 inputs (four edited, two added) are
listed for the manager's rebind and behavioral-evidence refresh. This worker
ships nothing and does not update the manager's global handoff or other lanes.

## Round 2: independent review follow-up

Active milestone: address all notes in
`docs/research/question-flags-adversarial-review-20261104.json`. All sixteen
round-one drafts require revision; F14 remains an explicit retirement/source
decision. Preserve the exact round-one question/timing/order identities and all
unflagged and owner-approved content. Capture the current assembly and files
before editing; append `.r3` drafts and new scored-construct versions where
the decision materially changes. No network, Git, installs, publication, cloud,
Supabase, selector/routing or Level 4/5 evidence/test edits.

The revisions will test an actual patient-specific decision or interpretation,
with credible near misses, rather than rename the existing association. Reuse
locally recorded atomic claims and their actual check dates. Do not fabricate
thyroid selection thresholds, medication doses or questionnaire cutoffs. F14's
exact variant is recommended for retirement until supported selection data can
be provided; the bank is not silently disabled. Provide an explicit owner
recommendation about the neck-node topic and distinguish clinical relevance
from unverified ABSITE coverage.

Acceptance: sixteen revised drafts, complete per-note responses and two-step
self-checks, regenerated key-first review-only packet/source ledger and lint
before/after, frozen compatibility/precise bound-input audit, clinical-content,
lint, touched player, full player and full domain suites with sandbox threads,
and seven typechecks. Keep original deadlines and behavioral assertions;
source-derived fixture changes need a documented causal check. End with a new
scoped round-two handoff; the manager owns sign-off, rebind and release.

### Round-two implementation and validation progress

- All sixteen `.r3` replacements are assembled as `needs_clinician_review`;
  all 177 independent-review notes have indexed responses in both current and
  round-two review packets. No author-granted PASS or accepted-basic label.
  Fourteen changed scored constructs have explicit new IDs/parent mappings;
  all 398 old concept definitions, the retained round-one release, eleven
  pilot approvals and every unflagged node remain exact.
- F14 recommendation: retire the exact unsupported FNA-selection variant until
  directly verified permitted criteria support a replacement. It is unchanged;
  no selector retirement is applied. F05 recommendation: retire from the
  ABSITE-labelled bank pending permitted public scope verification; a clinical
  guideline is not exam-scope verification. A revised clinical candidate is
  supplied for the owner's decision. No network access was used.
- The source ledger maps 37 existing source records / 53 claims. Three new
  qualitative draft-inference claims explicitly record their basis, offline
  verification limitation and review status. No access date is advanced, exact
  questionnaire cutoff/medication dose invented, or clinical approval inferred.
- V7 lint before/after: 2,030 to 2,034 findings over 1,418 variants / 6,039
  contexts. Selected seventeen: six to ten advisory findings, with indexed
  dispositions; the sole owner-rule finding is held F14. The complete 2x2
  option-matrix convergence correction has a regression test; no broad overlap
  suppression. There are 179 unchanged batch-2 candidates.
- Final clean clinical-content: **778/778, 99 files, 42.91 s**. Focused domain:
  **1,230/1,230, ten files, 49.73 s**. Five player presentation/flag suites:
  **79/79, five files, 22.43 s**. Lint **30/30**; seven typechecks pass.
- The earlier full-domain attempt was deliberately stopped to remove editorial
  source-check notes from clinical feedback/rationales. The clinical guard was
  retained and passes after cleanup. Its partial log and earlier input lock
  remain diagnostic artifacts, not a completed full validation.
- A new immutable final-clean lock covers **1,032** source/test/evidence inputs.
  Full domain is running alone with sandbox threads / one worker; full player
  follows with the existing preload / threads / two workers. No timeout,
  simulation behavior, route, Level 4/5 test or evidence edit is authorized.

Next: finish both full suites, verify the input lock and protected lane hashes,
then generate the scoped round-two handoff/ownership manifest with exact
failures and seven changed Level 5 inputs. The manager owns acceptance/rebind.

### Full-suite fixture follow-up

The first complete clean domain run records **4,346 passed / 31 failed / one
skipped**, 168 files, **1,088.77 s**. Twenty-six are the unchanged Level 5 input
guard / legacy initial-state hashes. The other five failures expose two stale
fixtures, now repaired without a production change:

- `packages/game-domain/tests/gs028-20260928-batch.test.ts`: its historical
  BATCH_CONTEXT previously selected order records by a stable-case prefix.
  The new F03 external study adds three non-executing tuples under that prefix;
  treating them as old local-service lifecycles is incorrect. Filter the full
  authored case/node/variant identity. The three original executable lifecycle
  instances and the assertion of exactly three records remain. The new tuples
  are covered separately by the exact round-two binding suite.
- `packages/game-domain/tests/gs028-statistics-ethics-batch.test.ts`: default
  admission uses the current DNR construct but final FSRS assertions read the
  retired authored primary ID. Resolve the cohort's stable case IDs to current
  cases before admission/scoring checks. Preserve all old manifest assertions.

An independent text comparison verifies **112 original assertions and every
deadline unchanged** in those two files. Exact before texts/hashes are retained
in a separate immutable fixture; the comparison is
`question-flags-round2-integration-fixture-review-20261104.json`.

Full player was already running. Only those two domain-test files changed
during its window; runtime, player, clinical and evidence inputs remain exact.
After it finishes, run both repaired domain files, repeat seven typechecks,
capture a separate immutable domain lock and rerun the full domain suite. Keep
the first complete failure log and distinguish both results in the handoff.

### Round two completed: scoped handoff

The repaired full domain run completes in **1,345.38 s**: **4,348 passed /
26 failed / one skipped**, 168 files (167 passed, one failed). All failures are
in the unchanged Level 5 integration file: **one input-binding guard and 25
legacy initial loaded-state hashes**. No timeouts or other failures. The two
repaired suites pass **239/239, two files, 8.62 s**. Their three removed generated
instances were incorrectly applying a historical local-service test to the new
external-study variants; all original lifecycle assertions remain.

Full player passes **3,371/3,371, 334 files, 488.24 s** with the existing preload,
threads and two workers. Final clinical-content: **778/778, 99 files**; ten-file
domain focus **1,230/1,230**; five player presentation/flag suites **79/79**;
lint **30/30**; all seven workspaces typecheck, repeated after the two fixture
repairs. Same-v7 whole-bank lint remains **2,034 findings / 948 flagged variants /
1,418 variants / 6,039 contexts**. No correctness analytics were introduced.

The final domain's **1,032 monitored inputs remain exact** throughout the run.
The full-player window has only the two explicitly recorded domain-test repairs;
all other monitored inputs remain exact. Protected entry-file changes outside
this worker's ownership: **zero**. Original approval definitions, all 398 old
concepts, 1,094 other cases, 1,407 other nodes and every old timing/order record
remain exact. Authoring/order generators pass `--check`.

Final scoped handoff:
`docs/research/question-flags-round2-handoff-20261104.md`. Exact ownership,
hashes and logs: `tools/question-quality/question-flags-round2-owned-files-20261104.json`
(23 modified / 74 added files, including audit tools, immutable fixtures and
diagnostic/final logs). Both review packets contain the sixteen `.r3` drafts,
the unchanged F14 retirement proposal, and all 177 indexed note responses. F05
retirement from the ABSITE-labelled bank remains an author recommendation pending
permitted scope verification. Neither retirement is silently applied.

Seven Level 5 inputs changed this round (four edited / three added); cumulative
flag delta is four edits / five additions against the recorded 409-file manifest,
current collector 414. Exact paths and hashes are in the handoff/verification.
The manager owns actual rebind and legacy behavioral refresh; the load control
does not establish continuation equivalence. Independent re-review and Melissa
Rowland clinical sign-off remain pending. This worker made no Git, install,
network, publication, cloud, Supabase, save, selector/routing or Level 4/5
test/evidence edit and does not overwrite the manager's global handoff.

Next action: manager inspects the source/artifacts and final validation, runs
independent re-review, resolves the two retirement/scope recommendations, then
performs acceptance/rebind/release work in the manager lane. No implementation
or validation work remains assigned to this round-two worker milestone.
