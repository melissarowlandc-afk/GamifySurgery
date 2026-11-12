# Question bank rewrite and authoring pipeline (2026-11-02)

Owner: Melissa Rowland — product owner and the named clinical sign-off for
question versions (stated 2026-11-02). Manager: Claude Code "GamifySurgery
manager". Standard: `docs/clinical/question-authoring-standard.md`.

## Owner decisions

- 2026-10-28: rewrite and review every question; residents should struggle;
  three or four options are fine; no per-question correctness tracking.
- 2026-11-02: the owner is the clinical sign-off. Some questions are still
  too easy — raise difficulty. The process should become autonomous: once the
  rules are learned, rewrite the whole bank and write new questions in the
  approved style; the owner edits granularly only when she wants to.
- 2026-11-02: rewritten questions may ship to the invited beta as **drafts**
  (`needs_clinician_review`, under the existing "Demonstration content — not
  clinically approved" label) once a batch passes the pipeline below, before
  owner review. Owner approval afterwards promotes exact versions.

## Pipeline per batch (about 40-80 variants)

1. **Author** (Codex GPT-6.1 Sol, max): rewrite the batch to the standard,
   preserving stable concept IDs and frozen-encounter compatibility, keeping
   evidence-claim mappings and source rules (AGENTS.md), and recording
   `needs_clinician_review`.
2. **Lint**: the advisory cue linter (`npm run clinical:lint`) before/after;
   every finding resolved or justified.
3. **Adversarial review** (Codex GPT-6 Astra, high; bounded review of the
   hardest questions): for each item, try to answer from cues alone (stem
   wording, case details, option parity, convergence), judge whether a strong
   resident would struggle, and check fairness (exactly one defensible key,
   no missing decision-critical information). Failures go back to step 1.
4. **Manager acceptance**: inspect a sample of diffs plus every Astra failure
   and fix; run clinical-content, lint, game-domain, player tests and
   typecheck; browser smoke check.
5. **Release to beta as drafts**: content-diff into GS-release, Level 5 rebind
   inside GS-release, full release checks, publish; record the release.
6. **Owner review**: publish the batch to the review page
   (https://claude.ai/artifact/UGE8g2VV5oxPWjhxkCY2Uf, db collection
   `reviews`); owner approves whole batches, spot-checks or edits items.
   Approved exact versions are recorded with reviewer name and date; edits
   become standard/linter lessons for later batches.

New-question authoring uses the same pipeline plus full source/claim
records per AGENTS.md (no invented exact values; open/licensed sources only).

## Difficulty direction (2026-11-02)

Default to two-step reasoning (interpret raw findings, then decide), closest
credible distractors drawn from real resident errors, concrete raw findings
instead of summary labels, and no cues in lead-ins, case details, patient
preferences or mechanism descriptions. Keep basic/tutorial items explicitly
labelled.

## Status

- Seventh and last authoring round is tracked in
  [question-batch1-adversarial-round7-20261102.md](question-batch1-adversarial-round7-20261102.md).
  Eleven returned items have v10 drafts; 62 exact PASS versions, three accepted
  basic versions and eleven clinical approvals are frozen. Four new construct
  versions retain all 392 previous definitions. Original fallbacks are recorded
  for all eleven if independent review seven still returns them. B19's earlier
  tract scaffold is removed by changing the returned task and feedback; frozen
  B21/B22 feedback caveats remain explicit. Clinical 764, lint 21, player
  presentation 43, focused domain 723 and seven typechecks pass. Full domain:
  4,347 passed / 26 failed / one skipped in 1,436.75s; the failures are one input
  guard and 25 legacy-load comparisons, all manager-owned Level 5 evidence work.
  No timeout or APP arrival-identity test fails in the final shared-tree run.
  All 711 monitored inputs remained equal across eight samples. No worker
  selector/routing, Level 4/5 test, evidence, shipping or rebind edit is performed.
  See [the final-round handoff](../research/question-batch1-adversarial-round7-handoff-20261102.md)
  for exact files, 107 returned-note responses, eleven original fallbacks, seven
  changed bound inputs and the two frozen-feedback caveats. Next is independent
  review seven, then manager acceptance/fallbacks and actual evidence refresh.

- Sixth author revision after independent review five is tracked in
  [question-batch1-adversarial-round6-20261102.md](question-batch1-adversarial-round6-20261102.md).
  It preserves 57 exact PASS versions, B01/B10/B29 accepted-basic versions and
  eleven clinical approvals; only sixteen returned items have new v9 drafts.
  Three scored-objective versions retain all 389 prior definitions. Fresh
  clinical 755, lint 21, player presentation 43, focused domain 20 and all
  seven typechecks pass. Whole-bank lint: 1,792 findings / 906 flagged variants. Full domain diagnostic:
  4,333 passed / 40 failed / one skipped, overlapping two external evidence writes.
  Three stale test expectations are repaired (703 follow-up tests pass); the
  unchanged ordinary-launch file passes eight fresh tests. A true APP on/off
  arrival-identity invariant passes with the entry release but fails with current
  content under unchanged code. The routing/selector lane must resolve it before
  stable final integration validation. No worker rebind, deadline change or release.
  See [the round-six handoff](../research/question-batch1-adversarial-round6-handoff-20261102.md).

- Fifth author revision after independent review four is tracked in
  [question-batch1-adversarial-round5-20261102.md](question-batch1-adversarial-round5-20261102.md).
  It preserves all 47 exact PASS versions and eleven exact clinical approvals;
  26 returned versions have v8 drafts. The manager resolves B29 in favor of
  the prepared fairness repair; its accepted basic purpose is retained, with
  new wording pending review. The other two active accepted-basic versions are
  exact. One new lipoma evidence-status construct preserves all 388 old IDs.
  Paired-only coverage is accepted for now; no selector/routing change. The
  manager owns the Level 5 input rebind and legacy behavioral-evidence refresh
  in the release worktree. Clinical 747, lint 21, player presentation 43,
  focused domain 19 and seven typechecks pass. Final full domain: 4,343 passed /
  30 failed / one skipped; all failures in two Level 5 files (one input binding,
  25 legacy evidence comparisons, four timeouts), with all other 164 files passing.
  Whole-bank lint is 1,793 findings / 904 flagged variants. Source, per-note
  responses, exact bound inputs, owned files and validation are recorded in the
  [round-five handoff](../research/question-batch1-adversarial-round5-handoff-20261102.md).
  Nothing ships from this worker.

- Fourth author revision after independent review three is tracked in
  [question-batch1-adversarial-round4-20261102.md](question-batch1-adversarial-round4-20261102.md).
  It preserves 27 exact PASS questions and three accepted-basic versions,
  removes all 32 rejected basic labels, and adds 45 v7 application revisions
  with 18 explicit concept versions. B29 is frozen while its overlapping
  REVISE/ACCEPT_BASIC direction is clarified; its recovery key is not passed.
  New versions remain needs_clinician_review. Nothing ships from the worker.
  Final checks: clinical 739, lint 21, player presentation 43 and all seven
  typechecks pass. Whole-bank lint: 1,789 findings / 898 flagged variants.
  Full domain: 4,345 passed / 28 failed / one skipped. One input-binding
  assertion, 25 legacy load comparisons caused by the 18 additive concept
  histories, and two unchanged-deadline Level 5 timeouts remain. A controlled
  comparison proves old frozen encounters remain exact; changed continuations
  are new admissions. The manager must refresh legacy behavioral evidence and
  run the actual input rebind; the worker does not edit either evidence file.
  The previous v6 results below are historical; exact failures, files and
  current evidence are in the round-four handoff.

- Third author revision after independent review two is tracked in
  [question-batch1-adversarial-round3-20261102.md](question-batch1-adversarial-round3-20261102.md).
  The 17 independent PASS versions are unchanged and marked pipelinePassed.
  The 56 returned versions have 21 application revisions and 35 explicitly
  basic instantiations, each with a reason; all remain clinical drafts.
  No basic label substitutes for an independent review or manager acceptance.
  Final v6 checks: clinical 731, lint 21, player presentation 43 and all seven
  typechecks pass. Whole-bank lint: 1,741 findings / 890 flagged variants.
  Full domain: 4,367 passed / five failed / one skipped; one binding mismatch
  and four Level 5 timeouts, with no deadline/spatial/evidence edits. Exact
  failures, files and inputs are in the
  [current handoff](../research/question-batch1-adversarial-round3-handoff-20261102.md).
  The prior correction results below are historical, not acceptance of v6.

- Pilot: 14 items; 11 owner-approved (A04, A08, A11, A17, A22, A23, A27, A28,
  A30, A38, A40); A02, A06, A25 in round 3 (2026-11-02).
- Batch 1 (40 Level 1-2 variants): adversarial corrections complete; awaiting
  independent re-review and manager acceptance (worker
  `01a1846d-3474-76d1-b249-3338e8e19b61`).
- Independent Astra review of round three/batch one returned 6 PASS and
  37 REVISE main items, plus 29 REVISE and 1 FAIL context item. The same bounded
  worker corrected all 73 under
  [question-batch1-adversarial-fixes-20261102.md](question-batch1-adversarial-fixes-20261102.md).
  This author self-check is not independent acceptance; the corrected packet
  returns to pipeline step 3. No release is performed by this worker.
  Final focused checks pass: clinical-content 726, lint 21, player presentation
  43 and all seven typechecks. The 164-file domain follow-up outside Level 5
  passes 4,330 tests with one skipped. The full-run hash mismatch, Level 5
  timeouts and untouched-lane full-player failures remain itemized in the
  [handoff](../research/question-batch1-adversarial-handoff-20261102.md).
- Melissa's exact eleven approvals use the existing AuthoredClinicalRecord
  `clinically_approved` / `lastClinicianReview` mechanism, reviewer
  `Melissa Rowland (clinical sign-off)`: A04/A08/A17/A22/A23/A27/A28/A38 on
  2026-10-29, A11-r2/A30-r2/A40-r2 on 2026-11-02. Clinical text is unchanged for
  those versions; no approval transfers to a rewritten identity, concept,
  evidence claim or finite profile.
