# Stats1 revisions and manager acceptance - 2026-11-08

## Goal and authority

Implement the manager's stats1 decision: revise the 22 independently REVISE
items, preserve all 42 exact PASS items, and accept all 64 as unapproved drafts
through the existing projection-only ship manifest. Melissa Rowland remains
the named clinical sign-off; editorial acceptance grants no clinical approval.

## Constraints and ownership

Shared tree. No Git, agents, installs, network, deploy, release worktree or
Level 5 evidence/pin/rebind operations. Preserve unrelated work. Own new stats1
accepted source/data/evidence/packet/receipt/tests and minimal clinical-content
manifest/index/projection-call/timing integration. Domain/save semantics stay
unchanged. Player edits are tests only. No source holds, invented medical
cutoffs, extra question concepts or N2 rewrites. All versions stay
`needs_clinician_review`; all 18 existing concept IDs remain stable.

Read root AGENTS.md, the authoring standard, stats1 plan/handoff, both
independent reviews and the ship integration/flags3 acceptance contracts. No
nested lane AGENTS.md found. Stats1 single-skill style supersedes the general
two-step/difficulty rule. Count all visible pre-task exhibit data; target <=35
words, retain the owner hard cap. No gameplay analytics.

## Requirements and decisions

- Keep round-one source/packet/claims immutable. A new accepted view reuses
  exact PASS cases/questions and has new exact variants only for the 22
  directed revisions. Independent REVISE verdicts are not relabelled PASS.
- Explicitly bind `stats1-accepted`, exact per-item hashes and every case
  header. Replace existing G06/F3-01 acceptances, never duplicate case/node
  rows. Preserve all legacy bindings, historical views, timing and meanings.
- Ordinary one-node/header overrides suffice; no new whole-case relation or
  domain-side acceptance gate. Statistics choices are analyses, not test orders.
- Preserve historical test epochs using exact hash-pinned deltas, not refreshed
  captures or weakened assertions. Add current-default acceptance and real
  format-3/journal frozen-save witnesses.
- Record each review note and response, accepted list, residual notes, new
  counts/hashes, changed bound inputs and exact validation including known
  unrelated failures. No full-green claim unless actually green.

## Milestones

1. [x] Capture the immutable current epoch, all reviewed hashes, current source
   bytes and protected paths; establish pre-change domain/player failures.
2. [x] Author the 22 repairs, claims and self-checks; lint the complete 64-case
   accepted view; prove the other 42 are byte-exact.
3. [x] Bind 64 directed rows, headers, source and timing; add current acceptance
   and frozen-save tests; preserve historical epochs exactly.
4. [x] Run clinical-content, domain, seven typechecks, linter and focused player
   tests with threads; classify every failure and record exact outputs.
5. [x] Manager decision, accepted packet, scope/validation/file receipts and
   acceptance handoff; append the shared current handoff and stop.

## Intake, discoveries and validation

Initial live epoch: 1141 cases / 1452 nodes / 606 registered meanings, 71
accepted rows. Draft stats1 source has 64 one-node cases and 18 stable meanings.
Captured 1396 protected paths before implementation. All42 PASS case/question
objects and the reviewed source/packet are exact; all22 repairs use new exact
question versions and23 new atomic claims (22 applications, expected-cell rule).

Replacing G06 also removes its old conditional concept/timing registration;
replacing F3-01 removes one conditional timing row. The stats integration keeps
the original G06 meaning at the same registry position and archives both old
wait rows at their original positions. All606 meanings/ordering stay exact.
Only64 cases change;1077 other cases,69 other acceptance rows,1423 legacy
bindings and3 whole-case relations stay exact. Default71 ->133 accepted rows;
timing2219 ->2283. No selector or domain-side gate change.

Historical acceptance tests now restore an exact pinned pre-stats epoch.
Three general presentation checks required precise integration exceptions:
presentation-only staff profiles with no demographics/vitals, frozen S47's
rounding instruction after its question, and10 exact literal-character-length
residuals. Every exception is enumerated and full-case pinned; old captures,
other assertions and all budgets/timeouts remain. Immutable receipt parsing is
cached to avoid repeated parsing in source guards.

Closing clinical125files/1566tests pass (30.96s); all7root typechecks;33linter
tests pass. Accepted-view cue lint0,64variants/128contexts, no suppression;
mean visible pre-task24.359375words, max34. Focused player334pass/1pre-existing
codec-limit failure (335total), including256/256 new stats saves and31/31 old
ship saves. Domain5220pass/28pre-existingfail/1skip (5249total);62 additional
data-driven acceptance rows execute, with no new failure title. The baseline
patient-supply10000ms timeout also appears in the final full run and its
unchanged focused diagnostic (3pass/1timeout). No budget/timeout was changed.

Only3 existing Level5bound inputs changed: clinical index.ts,
synthetic-content.ts and answer-choice-timing.ts. Evidence/pins unchanged; no
rebind. Four N2 items and all unrelated protected files are exact.

## Next action

Complete. See `docs/research/question-stats1-acceptance-handoff-20261108.md`
and its packet, scope, validation and file receipts. The shared current handoff
has an append-only acceptance block. Stop here. Manager owns release
integration, known stale evidence/registry, the pre-existing patient-supply
timeout and cloud failure, clinical sign-off and any separately authorized
GitHub backup.
