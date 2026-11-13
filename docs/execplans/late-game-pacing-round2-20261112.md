# Late-game pacing round 2

## Goal and constraints

Measure the actual current native first finish, then reach roughly 26,100-27,200
ticks (+15-20% versus 22,690) through modest Level 4-5 goals and future prices.
Preserve Levels 0-3, tutorial, level-up rewards, content, throughput and existing
save achievements. Zero walkouts, positive minimum cash, no stall; no single
price increase above 25%. Keep full and short goal labels accurate. Recenter
the content pacing guard on the measured new finish with the same +/-10% budget.

No clinical-content/packet or player performance edits, Git, installs, network,
agents, deploy, evidence rebind or GS-release writes. Shared tree: preserve all
unrelated work. The balance/progression sources, their tests, pacing guard/tests
and goal label mapping/tests are this lane. Compatibility changes stay within
the late progression policy; frozen clinical encounters and owned upgrades stay
unchanged. Handoff: docs/research/late-game-pacing-round2-20261112.md.

## Milestones

1. Run the unmodified actual pacing CLI. Freeze current runtime/content inputs;
   observe every original native command to measure minimum cash, milestones,
   completions and walkouts without changing the driver or answer policy.
2. Measure isolated modest goal/cost arms on the same content. Choose the smallest
   coherent set in the requested finish band, with exact old/new lever values.
3. Implement balance, earned-goal protection and accurate labels. Test old and
   current saves, including already-past thresholds, unlocked/finished campaigns,
   partial progress, repeated reloads and new campaigns using the new goals.
4. Update the guard reference after measuring the chosen finish. Run the actual
   after CLI, full domain with threads, seven typechecks, relevant player goal
   tests and focused balance/progression/guard checks. Classify every failure.
5. Record matched arms, all prices/goals, minimum cash, save semantics, changed
   bound inputs, exact validation and risks. Append current-thread handoff.

## Intake and preliminary diagnosis

Current default reported by the manager: 1,408 cases and first finish 22,690.
The actual baseline CLI has been started without source edits. Current Level 4
XP is 790; Level 5 XP 2,300 and cumulative completion qualification 330. Historical
measurement identifies the volume qualification as the dominant unlock clock.
Avoid raising the marginal satisfaction threshold and reintroducing composition
dependence. Candidate modest goal changes: Level 4 XP about +10%, cumulative
volume about +18%; candidate prices: only rooms unlocked at Level 4-5, about +10%.
Measure before selecting these values. Keep every early room/upgrade/training
and level-up reward unchanged unless measurements require another approved lever.

The existing lateProgression.v1 records only legacy XP credit. Raising cumulative
volume also needs durable earned-threshold credit for old Level 5 saves. Inspect
existing policy/witnesses and use the smallest backwards-compatible policy
extension; do not manufacture an inspection unlock or reset progression.
Receipts/preimages/frozen measurements: .local-dev/late-game-pacing-round2-20261112/.
## Progress and decisions

- Actual baseline CLI passed at 22,690, 5,217,105 closing cents, 380 completions,
  zero walkouts. Intake default hash is
  `5efb22616eaa4af66e4cc185c4dbf5b14b2f7585492ecf51d4cefcdb87ce638f`
  (1,408 cases / 1,105 registered meanings).
- Five isolated arms completed on that exact intake. XP-only and prices-only
  leave first finish at 22,690; volume-only finishes at 26,326. The chosen combined
  arm finishes at 26,281 (+15.83%), minimum 1,481,232 cents, 440 completions and
  zero walkouts. It uses Level 4 XP 790 -> 870, Level 5 cumulative volume 330 ->
  390, and about +10% rounded construction prices for nine Level 4-5 rooms.
  No further training/upgrade price or satisfaction changes are needed.
- Implemented the measured values, truthful 330/390 labels and guidance, and a
  strict backwards-compatible late-progression.v2 subpolicy. Earned prior XP and
  volume goals persist; crossing an old threshold after migration does not grant
  credit. Existing schema, encounters, owned purchases, FSRS and finished/unlocked
  witnesses remain intact. Cloud snapshot bytes remain source-preserving; views
  evaluate credit immediately and the first domain command materializes it.
- Actual after CLI with read-only intake content/registry/fixture overlay passed
  at 26,281 / 5,787,658 cents / 440 / 0. Independently observed current runtime
  matches every selected-arm metric, including the minimum after every original
  driver command. Guard reference is 26,281, inclusive integer band 23,653-28,909.
- Concurrent acceptance edits changed the default during validation. A separate
  unmodified live CLI passed at 26,312 / 5,731,642 cents / 440 / 0 (1,407 cases /
  1,109 meanings, hash recorded in the handoff). These are separate contexts;
  none of the concurrent clinical/registry files was edited by this lane.
- Focused matched domain: 214/214; full balance: 168/168; live player goals,
  including cloud round trips: 54/54; guard: 3/3. Root seven-workspace typecheck
  now passes after concurrent writers fixed their earlier diagnostics.
- Final full live domain run completed: 218 passed / 2 failed files; 5,986 passed /
  27 failed / 1 skipped tests (6,014 total), 852.69s. Only the known 26 Level 5
  binding/capture and one explicit admission-census failures remain. Three owned
  stale expectations were fixed (XP, prestige-room total, synthetic current-goal
  launch boundary); all 246 focused tests pass. Seven concurrent acceptance
  retirement/inventory failures were resolved by their lane and pass in the
  final full run. No question guards were edited here.
- Final live player goals: 54/54, full balance 168/168, guard 3/3, root seven
  typechecks 7/7. Final live-content observation repeats the 26,312 CLI endpoint
  and measures minimum 1,478,000 cents, 440 completions, zero walkouts; all 999
  captured inputs remained unchanged at the end audit.
- Eight owned runtime/balance bound inputs exactly match the production-after
  measurement snapshots. Retained evidence/results bytes are unchanged. Handoff
  is docs/research/late-game-pacing-round2-20261112.md; scoped diff, per-file
  hashes and complete logs are in the private receipt directory. Implementation
  and validation are complete. Next action belongs to the manager: review the
  owned hunks, port and rebind in the release tree. No subsequent task started.
