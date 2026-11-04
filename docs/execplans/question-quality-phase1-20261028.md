# Question quality phase 1 — 2026-10-28

Active continuation: [question round three and batch one, 2026-11-02](question-round3-batch1-20261102.md). The preceding milestone progress and validation below are historical.

## Active continuation: owner round two, 2026-10-29

Owner editorial approval received for A04/A08/A17/A22/A23/A27/A28/A38;
this is not clinician approval or permission to ship. Revise A02/A06/A11/A25/
A30/A40, preserve the exact round-one drafts and legacy timing/bindings, and
keep stable concept IDs where the learning objective is unchanged. Shared
presentation changes require companion revision identities as well.

Add the case-detail deletion/rationale-paraphrase test to the standard and
advisory lint where lexical evidence permits. Produce the requested six-item
`docs/research/question-pilot-round2-20261029.json`, refresh the full review,
and propose about 40 variants at facility entry levels 1 then 2 using explicitly
labelled structural exposure proxies; do not rewrite that batch or collect plays.

Owned lane remains clinical-content, narrow exact domain bindings/coverage,
question tools and research/clinical docs; only the two previously approved
player tests may be adjusted if an intentional rewrite needs it. Cloud/App/
CloudSaveControls/cloud-e2e and spatial/evidence remain untouched. No agents,
Git, installs, publication or network writes. Current state inspected through
scoped before snapshots instead of Git. New snapshot:
`tools/question-quality/fixtures/owner-round1-before-20261029.json`.

Acceptance: six original/current packets with rationale pairs and concrete
changes; all revisions needs_clinician_review; frozen original/r2/round-one
identities remain valid; sources and atomic claim mappings cover new clinical
distinctions. Clinical-content, lint, touched player files, full domain with
threads and all seven typechecks, exact results and bound-input changes.

- [x] Reread instructions/plan/handoffs, inspect current source, capture round one.
- [x] Resolve clinical task/option designs and rights-aware factual checks.
- [x] Implement six tasks plus three companion identities; preserve all 35
  historical local definitions and 25 superseded exact timing identities.
- [x] Extend case-detail lint with concrete owner-example regressions; 18 pass.
- [x] Generate six-item owner JSON, full Markdown review, current inventory and
  40-variant proposal (20 facility-entry level 1, then 20 level 2; case-reference
  exposure proxy only; no proposed variants rewritten).
- [x] Run required validation, report exact failures and hand back local drafts.

Round-two final validation: clinical-content 712/712, lint 18/18, focused domain
989/989, touched player 22/22 and all seven typechecks pass. Full domain is
4,308 pass / 4 fail: one expected evidence/input-binding mismatch and three
previously reproduced timeouts. Spatial/evidence/tests/deadlines remain
unchanged. Report QA checks all six owner packets, eight unchanged approvals,
40 unmodified proposed variants and 17,604 exact evidence spans. Final files,
sources, exact commands/failures, bound-input hashes and open clinical/owner
decisions are in `docs/research/question-pilot-round2-handoff-20261029.md`.
Next action belongs to manager/owner: review six drafts and changed context,
obtain named clinical review, accept/adjust batch 1 and schedule the rebind and
separate performance follow-up. Nothing ships; no Git or cloud-lane edits.

Round-two design decisions: A11 retains its existing 2 cm observation and uses
the bounded ATA 2025 recommendation rather than a preservation request. A30's
uninterpreted observations justify fit assessment rather than assuming an exact
oversized opening. A40 adds incision location so its incisional competitor
does not depend on an unstated history; all four options are abdominal-wall
hernias. No concept definition changes. Clinicians must confirm semantic
equivalence, keys and source sufficiency. Four new rights-reviewed source
records and seven atomic claims remain needs_clinician_review.

## Goal and authorization

Implement the owner's approved question-writing direction, an offline advisory
cue linter and complete assembled-bank inventory, and a versioned clinical draft
pilot. This continues the owner's requested thread. Research remains read-only
on the network; no Git, installs, telemetry, publishing or deployment.

## Ownership and shared state

One Codex worker; no subagents. Own clinical-content, related clinical-data
authoring inputs, new tools/question-quality, the specifically requested npm
scripts, research/clinical documentation and references in authoring docs.
Preserve concurrent App, CloudSaveControls, session/cloud and cloud-e2e work.
The manager's follow-up extends the lane to the exact domain registry and six
affected coverage test files listed in the handoff. No Level 5 evidence/fixture
edits. This plan is the coordination document
required by AGENTS.md; implementation stays in the assigned lane.

The research audit and 40 selected IDs are in
`docs/research/question-cue-audit-20261028.md`. Root AGENTS.md and the current
shared handoff were reread. No Git status/diff is permitted; inspect current
files and keep scoped before hashes/snapshots instead.

## Requirements and decisions

- Routine resident reviewer-predicted success 40–65%; stretch 25–45%, with
  reasoning expected to distinguish preparation and one defensible key.
  Three or four credible options.
- Superseding owner decision: no per-question correctness collection or
  analytics, answer-statistics report input or performance gates. Quality
  assurance uses the standard, advisory lint, owner/clinician review and
  voluntary tester question flags. No save/feedback mining.
- Lint is advisory and reports exact fields, phrases and choice IDs; it never
  grants clinical approval or blocks the game build.
- Pilot: A02/A06/A08/A17/A23/A25/A27/A28/A30/A38/A40 plus A04/A11/A22.
  New wording gets explicit revision identity; stable concept IDs and existing
  frozen encounters/saves remain valid. All revisions need clinician review.
- Source provenance and claim mappings must survive. No invented medical
  thresholds, medication rules, probabilities or demographic weights.

## Milestones / acceptance

1. Inspect source/version/timing contracts and evidence guards; capture bounded
   before records. Adopt the standard and link authoring documentation.
2. Implement and test cue lint and census metadata. Inventory every current
   assembled question variant, with facility/tier kept separate and structural
   priority identified as a proxy. Remove the superseded statistics tool.
3. Author and integrate 14 exact draft revisions, with per-option rationale,
   provenance, versioning, profiles and matching timing metadata; preserve
   original authored records for frozen/history reference. Generate side-by-side
   review and lint before/after; inventory all resulting live variants.
4. Append the four revised keyed exact-order bindings, preserving old records
   and contracts. Test current identities and actual three/four-option paths.
5. Diagnose journey timing with pre-pilot versus live contexts; preserve
   assertions, timeouts, semantics, save formats and frozen captures. Run lint,
   clinical-content, game-domain, full player tests using threads/preload, and
   all seven typechecks. Report exact counts. List every changed/new bound
   source input; never rebind Level 5 evidence in this lane.

## Validation commands

- `npm.cmd run clinical:lint:test` (Node test runner; no new dependencies)
- `npm.cmd run test --workspace @gamify-surgery/clinical-content -- --pool=threads`
- `npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads`
- Full player test suite with the documented optional Windows network-probe
  preload and `--pool=threads`
- `npm.cmd run typecheck`
- `npm.cmd run clinical:lint` and deterministic inventory/review generation

## Discoveries

- Default release has 1,110 cases; facility entry indices are 0–4. Variant IDs
  and authored versions are distinct from concept identity and patient profiles.
- Answer timing is keyed by exact case/node/variant/choice label. Revisions must
  preserve legacy timing entries while supplying the new labels/identity.
- Level 5's connected-journey guard compares raw source hashes in
  `tools/qa/level-five-integration-results-20261012.json` against clinical,
  balance and domain inputs. These evidence files are outside this lane.

## Progress

- [x] Read instructions, handoff, source/timing/version and Level 5 guard paths.
- [x] Standard and authoring references.
- [x] Linter; superseded answer-statistics module/arguments/tests removed.
- [x] Fourteen draft clinical rewrites, five context companions and provenance.
- [x] Census / pilot review / exact bound-input report.
- [x] Manager authorized narrow domain lane; four exact bindings and six live
  coverage tests updated. Focused six-file run: 989 tests passed; domain
  typecheck passed.
- [x] Full requested validation and pre-pilot/live journey attribution recorded.
- [x] Manager approved the two player expectation fixes and declined spatial
  optimization. `spatial.ts` and all Level 5 assertions/deadlines stay unchanged.
- [x] Reviewed all 14 pilot tasks and five companions for relocated lead-in cues.
  Sixteen changed drafts get `.r3`/v2 identities; three retain `.r2`/v1. All 19
  prior local drafts remain reconstructible, with legacy timing/bindings intact.
- [x] Advisory lead-in principle check and a separate explicit authored-rationale
  comparison added; 15 lint tests. Focused player tests: 2 files / 22 passed;
  focused domain: 6 files / 989 passed; seven typechecks passed.
- [x] Regenerate the full review/inventory, run all requested full validations
  after the lead-in review, and hand back exact results and bound-input hashes.

The earlier full domain run had 25 failures. The authorized integration resolves
the old identity/option assumptions; the fresh full run finished at 4,308 passed / 4 failed (163 files, 4,312 tests).
The remaining failures are the expected hash guard plus the same three journey
timeouts. Complete pre-pilot/live replays produce identical full trajectories
and encounter no pilot case; pre-pilot continuation/retry also exceed deadlines. Six revised timed
distractors had no old exact execution record and retain the no-extra-order
policy. Level 5 evidence remains untouched. Detailed final validation, exact
files, source hashes and open clinical decisions belong in
`docs/research/question-quality-phase1-handoff-20261028.md`.

Full player run: 290 files, 2,942 tests; 2,939 passed / 3 stale pilot expectation
failures in two player tests outside the current lane. All seven workspace typechecks
pass after the concurrent owner fixed the cloud test.
Clinical-content 708 and lint 11 pass. No assertion, timeout, captured state or
Level 5 evidence was changed.

The latest manager review supersedes those pending decisions. The only player
edits are `briefEarlyLevelsPresentation.test.ts` and
`pediatricChartsViewModels.test.ts`; expectations now follow the intentional
current authored choices/prose while all wait, family and lifecycle checks stay.
Spatial optimization is declined for this milestone. The three journey timeouts
are pre-existing and reproduced with pre-pilot content. The candidate remains
unapplied; there is no further permission request in this lane.

OWNER REVIEW HOLD: these pilot drafts must remain in the working tree and must
not ship until the owner reviews them. Named clinician approval is also still
required. No Git or publication. Next action: manager reviews the handoff and
pilot packet, routes cloud/performance follow-up to their owners, and schedules
any later Level 5 rebind after acceptance.

Latest review reruns: clinical 90 files / 710 passed; lint 15 passed; the two
approved player files 2 / 22 passed. Final full player: 290 files / 2,943 tests,
2,942 passed and one cloud `openingDeadline.test.tsx` desktop deadline assertion
failed. Read-only isolated cloud rerun: 1 file / 19 passed. No cloud edit or
deadline change; its owner must assess intermittency. Final full domain: 163
files / 4,312 tests, 4,307 passed / 5 failed. These are the input guard, the
three known timeouts and the paired garden legacy-reload timeout. Both garden
cases pass in isolation (2 passed / 4 unselected skipped). Final seven-workspace
typecheck passed. Earlier validation counts above are historical. Requested
validation is complete; remaining failures are preserved and itemized in the
handoff, with no spatial/evidence/assertion/deadline edits.
