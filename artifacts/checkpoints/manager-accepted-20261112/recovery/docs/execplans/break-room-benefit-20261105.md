# Break Room and gym benefit — 2026-11-05

## Goal and constraints

Manager-assigned domain lane: measure the productivity cost/benefit of current
breaks on representative Level 3/4/5 clinics, implement the owner-corrected
15-minute/+5 policy with a 480-minute cooldown below 90 effective morale and
960 at 90-99 (no new break at 100), plus a small ongoing room benefit. Repeat
identical measurements, including visits per employee per day. Care preempts a
walking/seated break. Preserve old in-progress tasks and deterministic replay.

Shared live tree `C:/Users/rowla/Projects/GamifySurgery`. Preserve unrelated work;
the rewrite worker owns clinical-content and question save-compat tests. No
clinical/question edits, Git, installs, network, agents, deploy, release-tree
writes, or evidence/pin rebind. Assigned scope: balance break/support entries,
domain support/care interruption and the necessary narrow saved-break reader,
guidance/build descriptions and their tests. Report before/after measurements,
exact validation and risks in `docs/research/break-room-benefit-20261105.md`.

## Entry state and receipts

Current source/test hashes and frozen domain/balance/clinical/fixture source are
in `.local-dev/break-room-benefit-20261105/entry-hashes.json` and `entry-inputs/`.
No production edits before capture. Seven canonical Level 5 route/evidence/
results files are protected by entry hashes. Known full-domain baseline is
27 failures: 26 Level 5 binding/legacy assertions and one static admission list.

Initial trace: `assignBreaks` uses effective morale <100, 30-minute work and
240-minute cooldown. `progressTasks` already interrupts some care demand, but
the role/queue coverage needs measurement and review. The gym save reader
currently validates remaining time against the active duration; shortening it
would reject valid old 30-minute gym tasks without a compatibility correction.

## Milestones and acceptance

1. Trace all break/morale/care eligibility, movement and daily-benefit paths.
   Define reproducible real-reducer Level 3/4/5 clinics and measure with/without
   support rooms before editing runtime. Freeze all other inputs to isolate
   the shared clinical lane. Count break sitting/travel separately and define
   a defensible attribution for break-caused care waits.
2. Implement editorial weights in balance-config: 15-minute break, 480-minute
   cooldown below 90 morale / 960 at 90-99, +5 per completed break plus existing
   upgrade points, and a small ongoing room benefit with upgrades. Preserve
   reservation/movement correctness and interrupt promptly for actual care.
   Keep accepted saved task benefits valid; no save format change if avoidable.
3. Add meaningful tests for thresholds, cooldown, full/aborted credit, all care
   paths found, unique seat claims, gym parity, upgrades, reload and determinism.
   Update affected guidance and presentation descriptions/tests.
4. Repeat measurements on identical frozen inputs. Run full balance/domain
   tests in threads, root seven typechecks and focused player morale/break
   tests. Classify each failure against the stated baseline. CHECK only for
   Level 5; identify changed inputs and affected evidence without rewriting.
5. Inspect owned hunks/hashes, publish the research handoff, append current
   thread handoff without replacing prior/concurrent text, and stop for review.

## Original candidate progress (superseded by owner correction)

- Repository instructions and current handoff read. No agents spawned.
- Entry inputs captured before runtime edits. Six original-policy clinics were
  measured first. Matched source-frozen before/after runs cover Level 3/4/5 at
  three days/seed A and five days/seed B, plus separate Level 5 Break Room/gym
  cohorts. Current released clinical/test-choice bytes are held fixed in every
  measurement pair; no-room controls are numerically identical across policy.
- Implemented shared 15-minute/480-minute/below-happy/+12 policy; care abort
  earns no partial award and stamps the cooldown. Legacy pending clinical
  reservations preempt/rest blocking, and completed receptionist check-in no
  longer looks like ongoing reception demand. All staff receive daily +2,
  plus +1 per upgrade of the best operational staff room, without stacking or a
  new save witness. Only accepted ADVANCE_TICK boundaries award daily morale.
- Saved 30-minute/+5 quoted gym/Break Room tasks load and finish at their
  accepted terms or yield cleanly to care. Unquoted legacy breaks retain +5.
  Strict malformed/duplicate/replay validation remains. No save-format change.
- Main measured break-related absence decreases 87.09-91.06%; observed
  break-origin ready-care waits become zero. Average morale rises 9.93-15.35
  points versus no rooms in the main cohorts. Separate gym-only care waits
  fall from 32 task-minutes/eight tasks to zero. Fixed-window cash is mixed;
  no universal financial ROI is claimed. Morale is not currently a work-speed
  multiplier. Manager acceptance must consider the welfare/cash tradeoff.
- Final focused domain 143/143 plus APP 12/12; balance focused 15/15 and full
  164/164; focused player 48/48. Root seven typechecks pass on the second and
  final runs. The first balance-test typing issue is fixed.
- Initial full domain 5,138 pass/28 fail/1 skip contained one outdated APP
  partial-reward assertion. Corrected to the approved interruption contract;
  focused APP and full rerun pass that test. Final full domain 5,139 pass/
  27 known failures/1 skip in 204 files, 602.27s. Same known baseline: one
  source binding, 25 content-dependent legacy SHA checks and one static
  admission allowlist (605 vs585 final; 600 initially). Level 4 passes all five tests. No evidence
  or clinical/save-question assertion change.
- Retained-content legacy control: both original and patched sources match
  all25 loaded hashes and all25 subsequent120-minute continuations.
- Paired retained-clinical Level 5 CHECK: original26362 commands/6056335cents/
  410completions/0walkouts; patched27258/6293131/423/0. Finish+842 ticks,
  2000-XP goal+295 ticks. All nine generated checkpoints and reports change.
  Same291 clinical/test-choice pins; exactly12 changed runtime inputs (11
  existing bound, one new staff-breaks.ts). No rebind/evidence writes.
- Build/upgrade/guidance text and tests describe actual daily/break rewards.
  Handoff with all fixed-window tables, source lines, exact validation and
  evidence deltas: `docs/research/break-room-benefit-20261105.md`.

## Owner-corrected milestone - complete

Owner correction received after the original handoff: retain +5 per completed
break, allow staff below 90 effective morale on a 480-minute cooldown, allow
90-99 on a 960-minute cooldown, and exclude 100. Keep 15-minute breaks and care
preemption. Reduce the passive base to +1 daily (plus +1 per room upgrade,
best operational room only), then measure visits per employee/day as well as
absence, care waits, cash, completions and morale. Preserve original receipts;
new receipts live in `.local-dev/break-room-benefit-correction-20261105/`.

- Implemented the correction, including effective-morale tier crossing, new
  +5 quotes and accepted legacy/preview quote preservation. Updated room,
  upgrade and guidance text. No save-format change.
- Main three-/five-day Level 3/4/5 comparisons and standalone Level 5 rooms
  are complete. No-room controls match exactly; only 12 runtime inputs differ.
  Break starts average 0.489-1.000 per employee/day, completed visits
  0.378-0.905. Main absence decreases 62.05-79.98%; morale is 7.39-11.22 above
  no-room controls. Cash is mixed, reported without claiming universal ROI.
- Five reported APP/support/upgrade failures traced to the original candidate
  and resolved. Corrected focused domain160/160; full balance164/164; focused
  player48/48; all seven typechecks PASS. Full domain5144pass/27knownfail/1skip,
  204files,561.31s. Failures are 1 source binding,25 live-content legacy hashes
  and static admission605vs585. Level4integration5/5. No assertion/evidence
  weakening in protected content/binding files.
- Original-policy retained-content CHECK reproduces26362commands/6056335cents/
  410completions/0walkouts. Corrected28312/6256310/441/0; finish+1899ticks,
  XPgoal+808ticks. Only12 loaded runtime inputs change, with291/291 retained
  clinical/test-choice pins verified; all9 corrected checkpoints/reports move.
  Both original/corrected sources match25/25 retained legacy loads and25/25
  subsequent120-minute continuations. No canonical evidence/results writes.
- Latest handoff: `docs/research/break-room-benefit-20261105.md`. New correction
  receipts preserve prior results. All scoped code/test hashes stayed stable
  during final validation; final scope/protected audit and append accompany it.

## Next action

Stop at the evidence gate for manager review. Manager owns acceptance of the
measured welfare/cash tradeoff, release integration and rebind. No worker Git,
deploy, agents, installs, network or release-tree writes.
