# Patient wording and complete answer-choice test times

## Goal and user requirements

The owner reported that recurrent-drainage questions use the term "natal cleft"
instead of describing the anatomy for the learner. The owner also requires test
times on all applicable answer choices, including distractors, because selective
time labels reveal which choices have implemented testing paths.

Replace pre-answer pilonidal location wording with a natural description of the
groove between the buttocks near the tailbone. Retain clinically meaningful
findings and coherent generated patient identity. Technical terminology may
remain in post-answer explanations and evidence records.

Show complete, consistently formatted timing information for test-choice
questions. Test timing must not depend on the answer key, correctness, or which
choice advances the authored case. Use simulation durations from the game's
service configuration; any needed additional preview-only duration must be
explicit editorial simulation configuration, never a claimed clinical standard.
Distinguish no-test actions honestly. Do not add unnecessary testing to cases.

## Repository state and constraints

- Repository: `C:/Users/Kyle Kent/Projects/GamifySurgery`; branch `beta`.
- Starting HEAD: `40638f677b674bc59f74f6742d55c8dda027bae1`.
- Extensive shared dirty work includes completed September 9 and 10 clinical
  batches, graphics, movement, persistence, and UI changes. Preserve all of it.
- Read root `AGENTS.md` and scoped GS-006 handoff. This continuing concept-review
  task stays open; no new task, archival, commit, push, deployment, or install.
- Preserve concept IDs, FSRS history, clinical meaning, review status, and frozen
  pending service timing. No named clinician approval is implied by these edits.
- Existing `showServicePreviews: false` was introduced to hide selective hints;
  the current owner request supersedes hiding all test-time information.
- Canonical owner launch remains `START_GAME.cmd` at `http://127.0.0.1:4173` in
  the usual browser profile. Browser checks must use isolated test storage and
  preserve the owner's campaign.

## Milestones and ownership

1. [x] Terra (`surgery_center_inventory`): read-only diagnosis of timing data,
   rendering, missing distractor services, admitted content, save compatibility,
   and targeted validation. Astra independently inspects pilonidal wording and
   retains product decisions.
2. [x] Delegate one bounded implementation milestone after diagnosis: complete
   timing metadata/presentation, descriptive pilonidal pre-answer wording, and
   meaningful regressions. Explicit file ownership is assigned in the worker
   contract; only one write-capable worker runs at a time.
3. [x] Astra reviews actual changes and evidence; return substantial corrections
   to a worker. Refresh affected delegated-review hashes truthfully after review.
4. [x] Validate representative UI states, all admitted test-choice coverage, old
   frozen pending services, relevant package tests, typechecking, and build.
   Update scoped handoffs and report outcome plus any save-related limitation.

## Acceptance criteria

- All four pilonidal variants describe location in pre-answer patient-facing
  text; no `natal cleft` / `natal-cleft` phrase remains there.
- Every test-bearing choice in admitted playable content has an honest expected
  simulation time, including wrong answers and tests without an authored result
  gate. No correctness-derived timing fallback is used.
- Questions with mixed test/no-test actions format timing consistently while
  accurately distinguishing no-test actions. Pure diagnosis questions do not
  receive fake procedure durations.
- Timing display is independent of correctness and answer order. Real gated
  tests agree with configured completion timing; existing pending snapshots keep
  captured due ticks and continue to deliver exactly once after reload.
- New patients retain natural presentation, shuffled choices and stable concept
  IDs. Existing release and clinician-review boundaries remain unchanged.
- Targeted regression tests cover missing distractor times, mixed options,
  real service agreement, hidden-preview legacy cases, and relevant save behavior.
- Required checks pass; inspection includes untracked-file whitespace and exact
  scoped differences against the starting dirty worktree, not only against HEAD.

## Progress and discoveries

- 2026-09-10: Astra inspected current instructions, dirty tree, completed prior
  plan and pilonidal family. The term appears in four story presentations, the
  diagnosis stem and the pre-answer case display name. Evidence/rationale terms
  can remain. Terra is tracing timing logic and auditing missing test choices.

- Terra confirmed `serviceRequest` affects previews; wrong nonfinal answers
  still schedule the node's authored result gate. Selectors currently omit
  timing for unbound choices and unavailable routes. Two chart paths and a
  tutorial path need consistent treatment. The tutorial also derives a timing
  example from the correct choice, which must be removed.
- Active-case classification remains part of implementation acceptance; the
  initial read-only audit identified gaps but did not enumerate the whole bank.
- Sol's baseline inventory identifies 218 admitted cases, 303 nodes and 83
  concept groups. Astra independently reviewed one complete choice set per group
  plus variant-specific test-related labels. Testing is not limited to gated
  nodes: surveillance, genetic testing, repeat EGD, and biopsy distractors also
  need review. Conversely, some later variants ask to interpret existing test
  findings instead of ordering tests. Classification must be per question/node,
  not blindly per concept or a runtime keyword match. The ignored baseline
  inventory is `.local-dev/patient-wording-test-times-2026-09-10/admitted-node-inventory.raw.json`.

## Accepted implementation decisions

- Sol (`surgery_center_sources`) owns this bounded implementation and regression
  milestone because preview coverage, schema compatibility and frozen service
  timing require coordinated changes. Only Sol is write-capable for implementation.
- Keep existing executable service/gate behavior. Add minimal optional,
  preview-only timing references for test alternatives that lack a service;
  balance configuration owns the editorial duration profiles. Reuse eligible
  service timing for implemented tests and explicit configured estimates when a
  route is unavailable. Do not label unimplemented distractors unavailable.
- A preview-only option naming an existing test must resolve the same service
  timing in the current facility state. Static numbers that merely match today
  could diverge after room/staff upgrades and create a new clue. Profiles may
  carry a preview service reference; it must not schedule care or change gates.
- Explicitly classify all active test-bearing nodes, including distractors;
  every choice in a mixed node gets either test timing or a no-test indication.
  Pure diagnosis/management choices receive no fabricated test duration.
- Use one shared presentation policy in chart and tutorial paths. No answer-key
  lookup may select a displayed test time or tutorial example.
- Pre-answer test detail text is neutral and identical whether the estimate
  comes from an executable route or preview-only profile. Showing route names
  only for implemented options would recreate the same clue. Actual pending
  route/status details remain after answering. Existing breast-imaging numeric
  times stay unchanged; its route-detail expectations may change deliberately.
- For legacy frozen nodes, prefer a read-only match to current timing metadata
  only when stable case/node/choice identity and choice labels match. Do not
  rewrite snapshots, due ticks, FSRS history or results. Unknown retired content
  must not receive guessed times or selectively reveal the one implemented gate.
- Known already-admitted pilonidal cases also need descriptive pre-answer text.
  Apply a narrowly scoped display normalization for their legacy anatomical
  phrase; do not rewrite stored case prose, explanations, identities or reviews.
- Preserve stable IDs and clinical evidence. Refresh changed delegated-review
  receipt hashes after actual review; document the wording/timing-only revision.

## Next action

Sol completed implementation and focused validation (13 files, 77 tests), with
workspace typechecking passing. Astra reviewed actual scoped differences against
pre-edit copies, the complete 303-node classification and test coverage, and
returned specific profile and saved-presentation corrections that Sol resolved.
The audit covers 106 test-bearing nodes, 197 no-test nodes and 357 timed choices.
Astra corrected two paraphrases in review receipts to verbatim owner quotations.

Acceptance is complete. Sol passed 916 full affected-package tests (clinical 304,
domain 176, balance 10, player 426), three isolated Chrome browser tests at
http://127.0.0.1:4173, and full build including dependency/launcher boundaries
and all seven workspace typechecks. Astra reviewed actual final logs and all four
browser screenshots. The initial full clinical run caught one chief complaint
missing first-person phrasing; Sol corrected it and refreshed the receipt. An
initial concurrent domain run hit the existing 15-second long-flow timeout; the
unchanged full suite passed isolated. The final cross-package invariant needed
a TypeScript narrowing correction; all eight focused domain timing tests and
the complete build passed afterward. Existing Vite bundle-size warning remains.

Known retired snapshots without a complete exact registry match or a complete
live service declaration suppress the whole preview group rather than showing
selective hints. Current admitted content is fully classified. No scheduling,
persistence or clinical-approval change was made. Handoffs are updated; no further
work remains for this request. Keep the continuing owner task open. The worktree
remains local/unpushed; remind the owner to say "push to GitHub" for a checkpoint.
