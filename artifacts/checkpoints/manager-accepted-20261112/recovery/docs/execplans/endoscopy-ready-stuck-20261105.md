# Level 2 routine endoscopy readiness and progress - 2026-11-05

## Goal and constraints

Find reproducible ways a Level 2 clinic can show every setup requirement Ready
while routine endoscopy never begins. Use synthetic real-command layouts and
five-or-more-day runs; no tester save or other tester data. Fix the smallest
proven causes, make remaining readiness/alerts truthful, preserve deterministic
replay and save format. No Git, installs, network, agents or deployment.

Shared main worktree; preserve all prior/unrelated work. No other worker is
currently active. Owned scope: domain endoscopy demand, access/reservation or
readiness helpers as evidence requires; minimal player checklist/alerts; tests.
Do not change clinical content, questions, cloud/snapshot infrastructure or
Level 5 pins/evidence. Synthetic snapshot tests may use existing adapters.

## Entry and evidence

Read AGENTS.md and current handoff. No scoped AGENTS.md files exist. Entry
hashes and original domain/balance plus checklist source are archived in
`.local-dev/endoscopy-ready-stuck-20261105/`. Only the supplied screenshot was
viewed; no tester save was requested/accessed and no personal data is copied.
Known full-domain baseline: 27 failures (26 Level 5 bindings/legacy hashes and
one static admission count). Prior break policy lane is existing work.

## Milestones and acceptance

1. Trace catalog cadence, installed capacity, timer deletion, physical phase
   reservation/pathfinding, Periop beds/staff, setup checklist and alerts. Build
   a command-driven Level 2 layout/staff/reload/old-transition matrix and record
   each first arrival, preparation, actual procedure, completion and blockage.
2. Implement only demonstrated causes; add stuck-shaped save and deterministic
   regressions. Verify reachable working layouts start after finite staffing
   delays; unreachable/disabled setups must identify the exact missing action.
3. Run the matrix >=5 operating days per case before/after. Run balance-config
   and full domain tests with npm.cmd and --pool=threads, root seven typechecks,
   focused player tests. Classify every failure against the 27 known baseline.
4. Audit scoped hunks and protected hashes. Record exact changed Level 5 bound
   inputs without rebind. Write research handoff and append current handoff.

## Progress and discoveries

- The scheduled endoscopy installed-capacity helper already ignores temporary
  employee positions. Current endoscopy catalog rows require only the two
  shared capability IDs excluded by that scheduler; no OR-style standalone
  nurse capability erases these arrival clocks.
- Checklist verifies operational room and staff-home access, but does not show
  the appointments-enabled gate. Full patient-path and Periop bed reachability
  are being compared with generic room access.
- Reproduced two runtime failures in sources byte-identical to read-only
  GS-release service-operations.ts: staff/founder route acquisition omitted the
  operation's own retained Periop room, and the first reachable pre-op bed could
  have no onward route to Endoscopy while another Recovery room worked.
- Fixed route acquisition using the already-authorized retained bed room.
  New routine pre-op reservations test onward geometry without testing live
  busyness. Existing prepared dead-end beds rebind via the existing bed repair
  on ADVANCE_TICK only; retain the old bed if replacements are full, protect
  occupied contacts, preserve completed preparation and snapshot load fidelity.
- Added read-only access diagnostics, truthful Level 2 room/staff checklist,
  explicit appointments-off requirement and a guarded hallway-access alert.
  Physically unreachable Recovery still needs a player hallway fix; do not
  route patients through unreserved treatment rooms or override demand-off.
- Final synthetic matrix:41 cases x3000 active minutes each. Every Ready case
  starts in75-230 minutes from run start. Six negative controls correctly show
  Missing. All orientations, near/far, staff/founder, training, low salary,
  legacy Break Room, overdue timers, reloads, pure local snapshot codec and real
  Level1->2 old-schema transition covered. Fresh original-source replay runs
  hold other code/content fixed. No tester save/data access.
- Identical prepared saves: founder-route case starts walking next tick,
  procedure+14/completion+122; dead-end bed repairs next tick, walks to the
  connected bed, procedure+40/completion+148. Original sources never start
  either over3000 further minutes. Current snapshot round-trips remain exact.
- Focused domain77/77, including13 new regressions; player84/84; balance164/164;
  seven typechecks pass. Full domain5157pass/27knownfail/1skip,205files,514.13s:
  one Level5source binding,25live-content legacy hashes,admission605vs585.
  One prior Break Room display expectation was stale and corrected in the
  already-owned build-view test; no break behavior changed.
- Retained-content Level5 CHECK completed:28312commands/6256310cents/441completed/
  0walkouts, identical to the prior Break Room candidate. All9checkpoint hashes,
  all3reports and ledger totals match.138previously loaded nonclinical inputs
  match entry hashes;291retained clinical/test-choice pins verified. This lane
  changes3existing bound inputs plus new endoscopy-setup.ts. No numerical delta
  attributable to this lane, no rebind. Retained legacy control25/25loads and
  25/25next120minute continuations match.
- Final audit checks2197entry paths:6existing owned source/test files changed,
  4new owned source/test files;7protected canonical files unchanged. Scoped
  owned.diff and full hashes stored privately. Final player84/84 in11.91s and
  final7typechecks pass after presentation-copy correction. Shared test original
  LF line endings restored without semantic change. Research handoff contains
  all41before/after timings, root-cause file/line evidence, exact validation,
  binding hashes and isolated checkpoint comparison.
- Research handoff written and CURRENT_THREAD_HANDOFF appended. Its prior
  816088bytes are preserved byte-for-byte; private append/hash receipt recorded.
  All required milestones complete. No remaining implementation work in lane.

## Next action

Complete; stop for manager review. Handoff:
docs/research/endoscopy-ready-stuck-20261105.md. No evidence rebind, Git or
release-tree write; no tester save accessed/requested.
