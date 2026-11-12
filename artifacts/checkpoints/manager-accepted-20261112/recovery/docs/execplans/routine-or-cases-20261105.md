# Routine ambulatory OR demand (2026-11-05)

## Goal and scope

Implement the owner's approved direction: non-question operative demand follows
the endoscopy arrival/queue/Periop/procedure/recovery/income pipeline, respects
staff and rooms, and can satisfy the Level 3 first-operation goal. Diagnose the
question-triggered path separately. Preserve existing clinical questions and
existing operations/saves; use balance-defined editorial timings and fees.

Assigned worker owns game-domain operation/service-demand modules, balance OR
entries and tests. Minimal player presentation work only if required. Shared
question manifest/N2/N3 and flags2 writers own clinical/question files. Do not
touch their files, the separate GS-release tree, save/cloud implementation or
canonical evidence. No Git, installs, network, rebind or agents.

## Repository state and receipts

Live root: `C:/Users/rowla/Projects/GamifySurgery`. Read-only release root:
`C:/Users/rowla/Projects/GS-release`. Entry source hashes and copies are in
`.local-dev/routine-or-cases-20261105/`. Earlier restroom/refill and owner-save
diagnosis work is separate and retained.

Confirmed: the release already has a scheduled ambulatory-operation line
with 600-minute cadence, 1,300 fee and existing phase/Periop definitions, plus
an OR capacity helper. Its redundant position-sensitive OR-nurse capability
check deletes the appointment clock during ordinary staff movement. Reuse the
existing engine and stable installed capacity, as Endoscopy does.

## Milestones and acceptance

1. Trace endoscopy and question-triggered operative demand, goal counting,
   provider/room/bed/nurse reservation, satisfaction and revenue. Reproduce the
   demand failure and separately inspect the approved owner save in memory,
   using existing offline adapters with allowlisted output only.
2. Implement the smallest shared-pipeline demand change. Add tests for ordinary
   generation without questions, missing/busy capacity, waiting-room queues,
   surgeon/OR-nurse participation, completion/goal/income/satisfaction, reload,
   deterministic timers and coexistence with question-triggered operations.
3. Run focused and full domain/player tests (`npm.cmd`, `--pool=threads`) and
   seven workspace typechecks. Classify every failure; preserve other lanes.
4. Freeze CHECK inputs and overlay released clinical/test-choice content.
   Run Level 5 without writes, compare commands/closing cents/completions/
   walkouts/checkpoints/reports, and list changed bound inputs. Never rebind.
5. Review owned hunks and provenance, write
   `docs/research/routine-or-cases-20261105.md`, append current thread handoff
   preserving prior bytes, and stop for manager review/integration.

## Progress

- Applicable repository instructions, previous handoff and service source read.
- Entry hashes/before-source receipts captured before implementation.
- Supabase skill applies to the offline backup-adapter diagnosis. The owner's
  no-network instruction takes precedence over that skill's web-documentation
  step; no Supabase feature, schema or remote operation is being implemented.
- Reproduced: installed OR capacity stays one with the OR nurse in a hallway,
  but the position-sensitive staff capability is absent, so the original
  scheduler deletes the OR timer and creates no visitor. New domain/balance
  tests fail against original source; the busy-capacity test's arrival-to-seat
  predicate was tightened before final verification.
- Runtime change: the OR capacity helper already proves installed OR-nurse
  coverage; omit that redundant transient capability check for scheduled OR
  demand. Reuse the existing 120-minute routine-Endoscopy editorial arrival
  interval, keeping 1,300 fee, 30-minute preparation/120-minute operation/
  60-minute recovery and all existing provider/bed/room/nurse arbitration.
  Existing Founder fallback is retained; the integration test proves the hired
  Surgeon operates when available. No new service engine, question binding or
  save fields. Future legacy first-appointment timers clamp through the
  existing capacity-scaled procedure timer logic.
- Focused checks pass: 128 domain (five files), 17 balance (two files). They
  cover automatic arrival without questions, absent/disabled capacity,
  preserved timers, waiting-room seating before Periop admission, physical
  care/fees/goal, reload, determinism and shared encounter reservations.
- Owner-save control: appointments enabled, one functioning OR/office/
  Periop, hired Surgeon/OR nurse/two Periop nurses. No active/completed base OR
  or receipt. First OR remains scheduled for 9,601 at saved tick 9,014. Actual
  state alone does not prove when/why that historical timer was initialized.
  The question path has no base-OR clinical route bindings; final resolver
  handles specific office procedures. The released-source 900-tick continuation
  creates no OR visitor; overlaying only the two OR production files creates
  the first visitor at 9,135, starts OR work at 9,193, and credits the goal at
  9,380. Same released content; backup unchanged; no raw state copy or live
  mutation. Historical timer reset events are not inferred from a snapshot.
- Final original-source control: 8/14 new domain tests pass and six fail;
  patched source passes all 14. Existing waiting-seat presentation needs no
  player production edit. Focused player 4/4; full balance 160/160.
- Full domain: 5,011 pass / 27 fail / 1 skip in 200 files. Level 4 passes 5/5.
  Failures are one expected source-binding gate, 25 legacy hashes due solely
  to 201 new live learning histories (released overlay restores 25/25), and one
  admission count mismatch that also fails with original OR source.
- Full player: 3,549 pass / 3 fail in 375 files. Two content/codec assertions
  reproduce with original OR source and pass with released content. One
  full-suite performance assertion fails under load; both original and patched
  isolated controls pass below 16 ms. No assertion, budget or codec edits.
- Seven workspace typechecks pass twice, including the final rerun.
- Paired released-content CHECK: 26,362 commands / 6,056,335 cents / 410 scored
  completions / 0 walkouts in both runs, equal to retained numbers. Exact two
  source differences and 291 matching released clinical/test-choice bindings.
  All nine paired checkpoints are byte-identical; six match retained entirely,
  and three have the same pre-existing retail-root differences in both runs.
  Reports match retained. This fixture has no OR rooms/nurses, hence no OR
  demand. Owner-save and new staffed-OR tests supply positive coverage.
- All seven protected Level 5 route/evidence/results files retain entry hashes.
  No rebind. Full validation/failure details and the exact bound-input list are
  in `docs/research/routine-or-cases-20261105.md` and private receipts.

## Validation

Completed within worker scope. Focused, full domain/player/balance, counterfactual
and released-content controls, seven typechecks and paired CHECK receipts are
retained. Full suites remain non-green for the classified failures above.
Released-content Level 5 file: 35 pass / 1 expected source-binding failure.

## Next action

Manager review of the two production hunks, new tests and evidence gate.
Worker implementation/validation is complete; no release-worktree writes,
rebind, Git or publication. Work remains local until the manager's authorized
backup/integration workflow.
