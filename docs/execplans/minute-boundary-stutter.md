# Minute-boundary movement and simulation stutter

Status: scoped performance fixes complete locally September29 2026;
whole-project validation limited by concurrent alert/room-capacity edits.

## Goal and constraints
Owner reports brief movement pauses each in-game minute, worsening as a campaign
progresses. Reproduce and distinguish render-route discontinuity from systemic
main-thread work; fix the demonstrated cause and validate before/after.
Keep approved3px/2Hz standing bounce, route/seating fixes and saved progress.
No clinical content changes, new art, dependency installs, commits or publication.

## Repository state and ownership
Very large dirty shared tree inspected; current handoff includes concurrent
answered-chart recovery and periop work in reducer/persistence. Preserve others.
Sol seated_correction_pilot owns read-only route/render-boundary diagnosis.
Terra tick_profile owns reproducible synthetic systemic tick/view benchmarks
and ignored evidence scripts. Parent owns architecture and acceptance decisions.
Implementation milestone will be delegated after evidence identifies scope.
Capture dirty-file baselines before any production edit.

## Milestones and acceptance
1. Measure/reproduce minute-boundary delay with an isolated synthetic campaign;
   compare small and accumulated history; separate simulation, projection,
   serialization/storage and rendering costs from route timing.
2. Delegate narrow correction with regression/performance evidence. Preserve
   simulation correctness, save durability, pause/resume and movement speed.
3. Review actual scoped diff; run applicable checks and isolated browser proof;
   document measured limits and next action in handoff.

## Validation and pathway
Use existing repository Node/Vitest/Playwright tools, no owner campaign edits.
Private test server uses an unused port and isolated test storage; stop it after.
Owner pathway stays START_GAME.cmd -> http://127.0.0.1:4173 usual profile.
Current request continues this conversation; no new user-owned thread requested.

## Progress
Read AGENTS/current handoff and inspected dirty tree. Sol route investigation
delegated; parent checking synchronous tick, projection and persistence paths.
Owner confirms noticeable at all simulation speeds, including1x. Existing saves
already defer full persistence to15tick checkpoints; do not assume every-minute
autosave as the cause. Each tick still clones simulation state and rebuilds
the player view. Measure accumulated encounter and review-history effects.

### Measured findings and first correction
Sol route/world signature20/20 PASS: no remount, track reset or bounce reset on
ordinary minute boundaries. Two-tick lookahead can amplify substantial stalls;
do not extrapolate movement or change speed without evidence.
Terra live-tick synthetic benchmarks: fresh reducer~0.4ms/projection~1ms;
180 historical encounters increase reducer to~14ms (clone~2.7ms).223 reviewed
concepts trigger223 Intl.DateTimeFormat constructions per view. Reusing an
identical formatter cuts accumulated projection~9.9ms to~2ms.500 events small.
Benchmarks are synthetic, not an owner-save reproduction. Evidence scratch:
`.local-dev/minute-boundary-stutter/profile.test.ts`.
Sol now owns narrow formatLearningCardStatus formatter reuse and regression
test; parent reviews actual baseline diff. Terra continues read-only CPU profiling
to name the remaining per-encounter tick cost before deciding further edits.

### Second cause and correction ownership
Terra CPU sample: SHA256 priority sorting in scheduleOptionalShopping accounts
for~55% of reducer samples on the grown fixture. It ranks all retained actors
every minute, calculating the same actor hash many times inside the comparator.
Parent reviewed source and chose behavior-preserving due-first/decorate-once
sorting rather than deleting/filtering historical records. Initialization and
future-due checks occur before sorting; each due priority computed once; stable
ties/candidate evaluation order preserved. New map key insertion order may differ,
but no gameplay reader depends on it. No save-schema change.

Sol formatter milestone complete: baseline-scoped diff reviewed,7 tests/player
TypeScript PASS. Terra now owns narrow retail-operations scheduler correction
and regression/differential/performance checks; no reducer/persistence edits.
Sol independently owns ignored-only browser instrumentation/validation on private
4201, preparing actual1x/2x/4x minute frames; final measurements after Terra fix.
Production writers are sequential; independent browser evidence does not edit
production or use owner's campaign/profile.

### Implementation/review evidence
Terra scheduler source complete; parent inspected exact diff against retained
`.local-dev/gs029-release/packages/game-domain/src/retail-operations.ts`, whose
SHA matches recorded pre-change E74CAE3A...59DB0D. Only scheduler edited.
New durable test covers due/future/new hash counts, explicit priority tie order
and retail-specific60tick outcomes. Full-state canonical old/new60tick equality
is ignored differential evidence, avoiding brittle clinical-catalog hashes in
the durable test. Initial3scheduler +19retail/service tests PASS; final revised
tests/typechecks pending after temporary worker node_modules EPERM.
Same synthetic accumulated reducer14.03->5.54ms; historical-encounter-only
13.99->3.95ms. Date projection~9.9->2ms; preserve raw records/behavior.

Sol browser1/1 PASS with loader-confirmed180 resolved encounters/223 reviewed
concepts and10ticks at each1x/2x/4x; stable scene/no JSerrors/no static redraws.
1x/2x no route starvation;4x12 samples (9 at speed switch,3 isolated).
Do not claim all-speed stutter eliminated. Parent requested fresh4x clock probe
with accumulated actual Phaser delta vs wall time and logical tick intervals;
increasing lookahead alone could only postpone cumulative drift. No renderer
change authorized until this bounded diagnosis. Browser remains isolated4201;
first server stopped and future owned probe server must also be stopped.

### Final clock probe and shared-tree validation
Fresh paused->4x probe with accumulated fixture:30tick transitions/endtick31,
397updates,0starvations/0JSerrors. Wall7972.6ms vs supplied Phaser delta7720.23ms;
no overadvance. Sequential speed-switch fixture had a depleted lead; do not
increase lookahead or alter renderer on this evidence. Both browser scripts PASS;
all owned4201/4202 listeners stopped. Raw reports under
`.local-dev/minute-boundary-stutter/browser/evidence/`.

Root final review reran formatter/build-view7/7 and direct scheduler hash/tie
checks3/3 PASS. Final full tick/retail/type validation encountered concurrent
`alerts-usefulness-and-humor.md` M2 edits: reduceAdvanceTick still calls missing
maybeEmitDelayedPatientAttention, plus transient encounter/alert-view type errors.
These files were not changed here. Do not undo other task edits. Prior worker
retail/service19 + pre-review scheduler3 PASS and full60tick differential PASS
precede that unrelated break. New durable60tick semantic test remains to rerun.
Broader service-procedure checks also include concurrent recovery-duration
expectation changes (45->60); not a retail scheduling regression.
Next: recheck shared reducer when alert edits settle, then final scoped types,
retail/formatter tests and handoff. No whole-shared-tree green claim yet.

### Scoped acceptance and handoff
The missing alert helper was subsequently removed by its owning task. Parent
reran retail15 + service-income4 PASS. Parent reviewed the final scheduler test
correction: it had incorrectly assumed a coffee purchase would complete by tick60;
the baseline fixture preserves operations but does not guarantee that receipt.
Terra final scheduler4/4 PASS after removing only that unsupported assertion.
Formatter/build-view7/7 independently PASS:30 focused checks total. Stable-tie
ordering explicitly exercised. Source diff remains only due-first scheduler and
lazy date formatter; no rendering, bounce, save schema or historical-data deletion.

Player/domain typechecks passed earlier in the milestone but final shared-tree
runs are blocked by active unrelated alert and room-capacity changes (feed export/
return/test fields, room-sale callback/build-count fields and offsite travel
version). These are tracked by their own plans and were not repaired here.
Do not claim whole-project types/build green. No new production build claimed.

Two isolated browser proofs PASS before the later unrelated integration errors:
180 resolved encounters/223 reviewed concepts;1x/2x steady tracks, fresh4x30tick
transitions with zero starvation. Sequential speed changes produced transient
waits, so no universal all-save/no-hitch guarantee. No owner-save reproduction.
Measured combined synthetic CPU work decreased from~24ms to~7.5ms per minute
update (~two-thirds); larger states still pay cloning cost. No extra route-buffer
or clock changes justified. Baseline/evidence in ignored local folder above.

All workers finished: Sol renderer diagnosis/formatter/browser proof; Terra
CPU profiling/retail correction/tests. Root reviewed actual baseline diffs,
reports and tests. Private4201/4202 stopped, listener absence independently
confirmed. Owner4173/profile/saves untouched. Local only; no commit/push/deploy.
Next: after other in-progress tasks stabilize, owner Save & Close then
START_GAME.cmd -> http://127.0.0.1:4173 usual profile and assess actual campaign.
Say "push to GitHub" for audited checkpoint backup after integration checks.
