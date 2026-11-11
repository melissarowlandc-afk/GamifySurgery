# Founder consult pathing — domain handoff, 2026-11-10

The founder attendance, same-patient APP/specialty handoff, bounded clinic queues,
and usable intra-endoscopy consult path are implemented. The OR mechanism is
tested, but the live clinical release has **zero ambulatory-surgery-setting
cases**; no live intra-op question can be offered until question writers supply
appropriate content. No clinical content, frozen question definition, renderer,
phone-performance, cloud, or canonical Level 5 evidence file was edited.

This is a local working-tree handoff for manager review. No Git, commit, push,
deploy, install, agents, network, or rebind was used. The perf worker's concurrent
changes are preserved. Full specification, entry audit and sequential milestone
notes: [ExecPlan](../execplans/founder-consult-pathing-20261110.md).

## Behavior and root causes

| Milestone | Entry defect / evidence | Implemented behavior / current evidence |
|---|---|---|
| M1 ordinary attendance | Entry `reducer.ts:3541–3558,3595–3609` lacked a general no-exam approach; `viewModels.ts:2107–2111` seated every arrived attendance task | Opening without an exam room stops a discretionary waiting leg at the actual patient location and routes the founder to a distinct reachable adjacent stand. With a room, reuse room reservation, patient bed and clinician chair; busy rooms retain waiting/retry. Current `reducer.ts:3412,3593`; safe posture/support projection `viewModels.ts:685,2113`. |
| M1 staff attendance | Entry `reducer.ts:3285` released the existing physical discussion on answer | Founder and employee keep discussion ownership through feedback until close/file; reopening reacquires attendance. Close/switch releases normal work. Current `reducer.ts:3797` and employee-discussion regressions. |
| M2 intra-procedure | Entry `service-operations.ts:1999–2026,2956–2972` advanced timed work without a scored source or consult gate; entry founder routing recognized post-result review only | At the existing scored deadline, a compatible actual in-service routine procedure patient becomes the chart, preserving actor, suite, staff, fee and physical location. Opening walks the founder to an approved separate suite stand; an already-operating founder stays. The relevant phase holds until terminal feedback is acknowledged and the chart closes. Current `founder-consults.ts:23,71,99`, `service-operations.ts:2214`, `reducer.ts:6159`. |
| M3 APP handoff | Entry independent visits and scored arrivals were separate actors; scored care yielded an APP room. Training/room levels did not shorten routine APP work | Convert the actual seated APP patient at the ordinary scored deadline. Unopened chart has `!`; APP and patient hold the room. Opening sends the APP into the exit hallway before the founder takes the same stool. Unanswered close returns the APP but keeps the clinical hold; answered close releases the visit/next step. Current `clinic-consults.ts:30,58,69,98,107,121`; `staff.ts:362`. |
| M3 queue integration | Denser APP queues exposed a shared two-waiter cap starving unrelated MRI, and sold-home queues could strand old patients | APP queues retain their own per-home cap and are excluded from the unrelated general-service cap. Displaced patients can cross-cover after their old home is sold. An operation excludes only its own converted encounter when reclaiming a replacement clinic. Current `service-operations.ts:621,907`, `app-appointments.ts:57,73`. |
| M4 specialty visibility | Entry selection was concept-uniform across a large general pool. Generic pediatric visitors did not have the exact authored child/art/parent context; no wound capability tags identified wound questions | Generate specialty visitors from existing compatible published contexts, prefer due specialty source consults with a 300-minute minimum interval per type within the existing scored budget, and preserve the physical pediatric family. Explicit wound/ostomy topic IDs are editorial room affinity. Current `clinic-consult-topics.ts:7,13,37`, `reducer.ts:6159,6203`, `pediatric-family.ts`. |
| Presentation | Entry `selectors.ts:1762–1767` marked only already-open action charts | Typed unopened consults set actionRequired and a source/status label. Existing desktop `PatientLists.tsx:126` and phone `MobilePatients.tsx:54` already render `!`. Native pediatric clinician support anchors are used. Current `selectors.ts:1757,1910`; `viewModels.ts:685,2113`. |

Evidence paths in this table are under `packages/game-domain/src`, except
`viewModels.ts` under `apps/player/src/session`. Entry line numbers are preserved
in the M0 frozen source; current line numbers refer to the delivered tree.

Ordinary scored fallback remains when no actual compatible source patient is
available. There is no pending-case reservation or FSRS bypass. Every question
does not necessarily become an APP consult. Already-frozen question-triggered
operations retain their authored question/result sequence; this lane does not
insert a different case into a frozen chart. Phase-linked intra questions for
those authored sequences need a separate content/design follow-up.

Room-sale/reload tests also cover a source waiting for a replacement clinic. Its
question stays unavailable until the replacement APP/patient are actually in
service; otherwise an open chart could divert the approaching replacement APP.
An already-staffed answered visit finishes once on close after an interruption,
without restarting 95 minutes of care. Existing busy firing/occupied-door guards
were investigated and left intact.

## Editorial balance policy

All new numbers are explicitly simulation weights in
`packages/balance-config/src/founder-consults.ts`, not clinical durations,
probabilities, demographic prevalence or teaching relationships.

| Policy | Before | After |
|---|---:|---:|
| Adult APP offered interval per home | 120 minutes | 90 minutes |
| New routine APP-family work at staff/room level 1 | Adult/peds 30 minutes; wound/ostomy support 20 | 95 minutes |
| Work reduction per training level above 1 | none | 10%, levels capped at 5 |
| Work reduction per room level above 1 | none | 5%, levels capped at 5 |
| Resulting level-5 staff/level-5 room work | unchanged by training/room | 46 minutes |
| Pediatric offered interval | 90 minutes | unchanged |
| Wound / ostomy offered interval | 180 minutes each | unchanged |
| Specialty consult minimum spacing | no preference | 300 minutes per specialty type |
| Earliest procedure source offer | no source | after 1 minute of actual work |

The duration quote binds to the actual provider and room at the first successful
reservation, then survives reload and later policy changes. Existing frozen
30/20-minute visits keep their old values. Explicit clinical wound procedures
keep their existing durations. Training revenue effects are unchanged. Paid
training with an available place takes precedence before the APP claims its
next visit; a full training room does not indefinitely idle the APP.

The basic work quote is slightly slower than 90-minute adult/pediatric offered
demand; training/upgrades are substantially faster. Each home admits at most two
active visits (one serving, one waiting/arriving), so missed offered demand is
deferred rather than creating an unbounded backlog. Source consultation can
finish a basic visit sooner when the founder provides the scored care.

## Public-fixture measurements

Private receipts: `.local-dev/founder-consult-pathing-20261110/`. M0 and final
clinical source bytes are identical. Four arms use the actual public Level 4
economy fixture at Levels 4 and 5, seed `founder-consult.measure`, for three
600-minute operating sessions on consecutive calendar days. Real commands,
selection, walking, finance and FSRS clocks run. The trained arm is an isolated
level-5 staff/room state comparison, not a claim of free purchased upgrades.
The normal scored clock is restored in this fixture. The unchanged public
economy probe separately retains its intentionally suppressed scored arrivals.

Counts below are per game day for days 1, 2 and 3, not separate extra question
streams. Every clinic arm has **9, 11, 10 scored charts/day**, before and after.

| Level / arm | Before APP / peds / wound-ostomy source consults | After adult APP | After pediatric | After wound/ostomy |
|---|---|---|---|---|
| 4 basic | 0 / 0 / 0 each day | 4,6,6 | 2,1,1 | 1,2,2 |
| 5 basic | 0 / 0 / 0 each day | 4,6,4 | 2,1,2 | 1,2,1 |
| 4 trained/upgraded | 0 / 0 / 0 each day | 2,6,4 | 2,1,2 | 1,1,1 |
| 5 trained/upgraded | 0 / 0 / 0 each day | 2,6,4 | 2,1,2 | 1,1,1 |

First pediatric and wound/ostomy consults occur at minute **131 / 263** in the
ready fresh fixture. Before: no scored specialty cases among the sampled 30
charts. Existing concept/demographic eligibility and FSRS still apply; these
counts do not promise repeats when compatible concepts are not due.

The stock clinic has no Endoscopy/OR suite and suppresses staff discussions.
Separate operational controls at both Levels 4 and 5 therefore measure those
types honestly:

| Type | Before linked consults/day | After linked consults/day | Context |
|---|---|---|---|
| Intra-endoscopy | 0,0,0 | 2,0,2 | Actual endoscopy starts 4,5,6 and completions 3,5,6; no forced repeat on day 2 |
| Intra-op | 0,0,0 | 0,0,0 | Actual OR starts 4,5,5; live content lacks the required setting |
| Staff | 4,3,3 | 4,3,3 | Compatible staffed OR control, ordinary first delay 30 / interval 180 restored |

There are 60 existing staff discussion cases for eight eligible clinical roles.
The economy fixture's APP/reception/EVS roles are not among them. This existing
staff stream is separate from patient scored arrivals and was not increased.
Procedure receipts are in `M2-final/procedural-measurements.json`; current staff
control is `M4-verified/staff-measurements.json`.

Three-day independent visits, ordered **adult / pediatric / wound / ostomy**:

| Arm | Arrivals | Completions | Seated waiting actor-minutes/day | Day-end waiting |
|---|---|---|---|---|
| Before, all four arms | 14 / 19 / 9 / 9 | 14 / 19 / 9 / 9 | 0,35,36 (71 total) | One ostomy arrival day 1; empty days 2–3 |
| After L4 basic | 19 / 19 / 8 / 8 | 18 / 17 / 8 / 7 | 178,378,338 (894) | Two queued across clinic lines each day |
| After L5 basic | 19 / 19 / 8 / 8 | 18 / 17 / 7 / 7 | 178,397,380 (955) | Two queued across clinic lines each day |
| After trained/upgraded, L4 and L5 | 19 / 19 / 9 / 9 | 19 / 19 / 9 / 9 | 15,11,0 (26) | One ostomy arrival day 1; empty days 2–3 |

Observed queue maximum is one waiting/arriving actor per line; home admission
caps are also regression-tested. No measured walkouts. Offered demand/day is
6.67 adult, 6.67 pediatric, 3.33 wound and 3.33 ostomy; actual admissions defer
under the cap. Hourly queue samples, per-day visits, first-consult ticks and
answered-node counts are retained in `M4-verified/daily-measurements.json`.

Unchanged public 48-hour economy probe, after its 4-hour warmup, questions
suppressed: adult 24 visits, $40 gross/$8 net per hour; pediatric 27, $45/$12;
wound+ostomy 25, $35/$3; MRI 12, $60/$34. Whole clinic $188.5625 gross minus
$3.1041667 stock minus $170 operating = **$15.458333 net/hour**. Basic margins,
especially wound/ostomy, remain narrow. The first M3 diagnostic incorrectly
counted APP queues in the general cap: MRI only 1 visit/48h, negative $21/hour.
That integration bug is fixed, not accepted as the final economy result.

## Clinical supply and writer follow-ups

M0/final inventory: 1,143 cases / 1,454 nodes / 608 registered meanings. Required
settings: clinic 1,126; outpatient_endoscopy 3; endoscopy 10; periop_recovery 4;
**ambulatory_surgery 0**. There are 20 explicitly pediatric cases before concept
deduplication and no cases requiring a wound/ostomy capability.

Only these six existing endoscopic finding/treatment cases qualify for the
initial live intra-procedure source path:

```
case.l2.colonic-lipoma.direct.typical-a
case.l2.colonic-lipoma.direct.typical-b
case.l2.peptic-ulcer-bleeding.visible-vessel-hemostasis.v1
case.l2.peptic-ulcer-bleeding.select-high-risk-stigmata.v1
case.l2.peptic-ulcer-bleeding.clean-base-reverse.v1
case.l2.peptic-ulcer-bleeding.visible-vessel-modality-principle.v1
```

They currently share a published female, age-43 prototype. New routine visitors
use existing published presentation coverage so this path is possible; existing
in-flight people keep their identity. That narrow presentation coverage needs
writer expansion, with clinician review, rather than invented demographic
variants. Post-biopsy pathology, post-endoscopy referral, recovery teaching,
and cases ordering another procedure/result gate are excluded from intra use.

Writers need genuinely intra-operative, routine-eligible ambulatory-surgery
contexts, with existing capability/stage/profile fields, suitable phase-specific
questions and no circular order for the same operation. Appropriate phase-linked
nodes are also needed if question-triggered frozen operation charts should
later ask new intra questions. The test-only OR fixture changes context metadata
around unchanged existing Q/A solely to prove mechanics; it is not live clinical
content or clinical approval. Wound/ostomy topic affinity is an explicit ten-ID
editorial list in `clinic-consult-topics.ts`, not a new clinical relationship.

## Save compatibility and invariants

Save schema stays **9**. Optional strict versioned leaves are
`encounter.consult` (`founder-consult.v1`), operation `consultEncounterId`, and
operation `clinicWork` (`clinic-work.v1`). Old saves omit them. Specialty clocks
use namespaced entries in the existing validated `lastServiceAppointmentTicks`
record, avoiding a new root field or cloud ownership change. Existing frozen
clinical definitions, prices, phases, and old work quotes remain intact.
`persistence.ts:139,1000,1201` validates the new optional leaves and actual
work-quote arithmetic; malformed metadata is rejected, not silently accepted.

Next-tick recovery repairs missing active source links back to visitors,
including pediatric family/parent pointers; cancelled or missing sources release
active holds. Completed historical source pointers remain historical even after
encounter retirement. Replacement room/provider reservations update consult
targets. Regressions cover old and new work quotes, round-trip saves, orphaned
links, actual room sale, replacement-room requeue and once-only payment.

The Level 4 APP invariant tests now observe the true preselection calls. They
still require identical 24-hour scored count/times, replay identical clinical
inputs to identical identities, and perturb unrelated service/retail counters.
Every source-narrowed pool is explained by its actual patient profile, room/topic
and capabilities; remaining active/due differences require witnessed patient-flow
departures/reservations and a counterfactual encounter swap. A genuine live
patient source is now another selection input. The former optional release
control's unconditional 24/24 cross-arm identity assertion is therefore not
claimed unchanged: it proves 24 arrivals and 24 identical-input replays, and
24/24 identities when no genuine flow differences occur. This scope change is
explicit in `level-four-integration.test.ts` and the ExecPlan.

## Level 5 CHECK, attribution and evidence gate

All phases use the same captured clinical bytes and unchanged public driver.
Frozen receipts preserve phase inputs, totals and checkpoints. No `--write`,
rebind, checkpoint/result rewrite, or canonical progress write occurred.

| Phase | Commands | Closing cents | Completions | Walkouts | Final tick | XP-goal tick |
|---|---:|---:|---:|---:|---:|---:|
| M0 entry | 29,663 | 6,601,005 | 459 | 0 | 27,653 | 15,550 |
| M1 | 29,663 | 6,601,005 | 459 | 0 | 27,653 | 15,550 |
| M2 | 29,663 | 6,601,005 | 459 | 0 | 27,653 | 15,550 |
| M3 isolated, integration repairs included | 30,862 | 6,483,886 | 477 | 0 | 28,737 | 15,574 |
| M4 final exact source | **31,656** | **6,979,051** | **491** | **0** | **29,476** | **14,580** |

The retained release pin is 26,362 / 6,056,335 / 410 / 0 and was already stale
at entry. Do not attribute its whole delta to this lane. Final versus frozen M0:
**+1,993 commands, +378,046 cents, +32 completions, no walkout change**;
1,823 more ticks overall, XP goal 970 ticks earlier.

M1 has no journey effect; M2 has no effect because the public journey builds no
Endoscopy/OR suite. M3/M4 change actual patient-flow state, source-compatible
selection, authored node counts and XP/inspection timing, plus adult demand,
work/training/room effects and true consult holds. Question cadence and purpose-
scoped RNG are unchanged. Answered nodes increase 590 → 643 over different run
lengths (46.1 → 49.1 operating days), not through a new question clock.

The finance counters reconcile: opening 1,785,500 and capital 1,048,000 cents
are unchanged. Gross 16,919,200 → 18,226,700 (+1,307,500), stock 311,470 →
430,383 (+118,913), paid operating/payroll 10,744,225 → 11,554,766 (+810,541).
Their difference is exactly +378,046 closing cents. Actual adult APP receipts
229 → 321; pediatric 306 → 290; wound 153 → 128; ostomy 151 → 126; MRI 130 →
138. Existing service fees are preserved and charged once. Final source consult
counts over the whole journey: adult APP 258, pediatric 34, wound/ostomy 26.

| Checkpoint | Final tick | Final cents | Final completed | Delta vs M0: tick / cents / completed |
|---|---:|---:|---:|---|
| integration-l4 | 3,730 | 2,742,200 | 60 | -517 / -53,450 / -8 |
| integration-build | 3,730 | 1,694,200 | 60 | -517 / -53,450 / -8 |
| integration-preparing | 19,702 | 5,247,446 | 330 | +1,820 / +577,008 / +35 |
| integration-running | 19,839 | 5,274,103 | 332 | +1,820 / +504,306 / +31 |
| integration-final | 22,758 | 5,827,568 | 381 | +1,820 / +457,685 / +30 |
| integration-finish | 22,759 | 5,827,568 | 381 | +1,820 / +457,685 / +30 |
| integration-repeat-final | 26,415 | 6,660,116 | 442 | +1,820 / +433,633 / +32 |
| integration-repeat | 26,416 | 6,660,116 | 442 | +1,820 / +433,133 / +32 |

All checkpoint walkouts remain zero. The independent unchanged driver and the
**unmodified official integration generator both pass CHECK** at the final
totals. The official generator's 35 private progress-file writes were captured
in memory, with all canonical writes prohibited. The lower-retry ordering and
first/best/latest report assertions pass read-only (62.60484766529342 /
66.87766488413499 / 45.24299215671414). See `M4-verified/{journey.json,
official-check.json}` and `M4-official-check.log/.exit`.

Exact changed Level 5 runtime inputs: 14 already-bound files plus five new
runtime modules (marked NEW). Binding/result/history digests intentionally fail;
the manager decides and performs rebind in the release worktree.

```
packages/balance-config/src/employee-training.ts
packages/balance-config/src/founder-consults.ts                 NEW
packages/balance-config/src/guidance-tips.ts
packages/balance-config/src/index.ts
packages/balance-config/src/room-upgrades.ts
packages/balance-config/src/service-income-catalog.ts
packages/game-domain/src/app-appointments.ts
packages/game-domain/src/clinic-consult-topics.ts               NEW
packages/game-domain/src/clinic-consults.ts                     NEW
packages/game-domain/src/clinic-work.ts                         NEW
packages/game-domain/src/founder-consults.ts                    NEW
packages/game-domain/src/index.ts
packages/game-domain/src/pediatric-family.ts
packages/game-domain/src/persistence.ts
packages/game-domain/src/reducer.ts
packages/game-domain/src/selectors.ts
packages/game-domain/src/service-operations.ts
packages/game-domain/src/staff.ts
packages/game-domain/src/types.ts
```

## Exact validation output and failure classification

PowerShell, `npm.cmd`, `CI=1`, `--pool=threads --maxWorkers=2`; player runs use
the existing sandbox OS-enumeration preload at
`.local-dev/restroom-reception-refill-20261104/validation-preload.cjs`. It does not
alter domain assertions and blocks Git execution. Commands additionally use
default/JSON reporters with output under the private receipt directory.

| Final command / receipt prefix | Native exit | Exact summary |
|---|---:|---|
| `npm.cmd test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=2` / `M4-domain-verified` | 1 | `Test Files 2 failed \| 209 passed (211)`; `Tests 27 failed \| 5245 passed \| 1 skipped (5273)`; 601.66s |
| `npm.cmd test --workspace @gamify-surgery/balance-config -- --pool=threads --maxWorkers=2` / `M4-balance-final` | 0 | `Test Files 25 passed (25)`; `Tests 165 passed (165)`; 3.43s |
| `npm.cmd test --workspace @gamify-surgery/player -- --pool=threads --maxWorkers=2` / `M4-player-verified` | 1 | `Test Files 4 failed \| 416 passed (420)`; `Tests 4 failed \| 4078 passed (4082)`; 920.45s |
| `npm.cmd run typecheck` / `M4-typecheck-verified` | 0 | All seven workspaces: clinical-context-workbench, player, balance-config, clinical-authoring, clinical-content, clinical-research, game-domain |
| Focused final domain / `M4-final-regressions` | 0 | 15/15, four files: adult APP 5, specialty 4, procedure 5, MRI queue 1 |
| New affected player hooks / `M4-player-focused-final` | 0 | 6/6, four files |
| Affected existing text/tutorial/inspector / `M4-player-repairs` | 0 | 82/82, four files |
| Official Level 5 CHECK / `M4-official-check` | 0 | Official CHECK and read-only lower-retry assertions PASS; zero canonical writes |

Domain failures are exactly the known **27**: `level-five-integration.test.ts`
has the current-input binding failure plus 25 Level 0–4/schema 5–9 historical
state digest mismatches; `approved-clinical-admission.test.ts` has the old static
587-meaning expectation versus 608 actual. No evidence/clinical assertion was
rewritten. The previously reported historical patient-supply timeout did not
recur. All Level 4 behavior tests and all new feature regressions pass.

The four player failures are the existing baseline files, also reproduced by
the perf lane's captured-entry controls:

- `breadButterPresentation.test.ts`: old four-choice assumption, actual three.
- `chartStructuredFields.test.tsx`: legacy discussion explanation-text expectation.
- `levelFiveRoomsViewModels.test.tsx`: old regex rejects the pre-existing break/gym benefit description.
- `cloud/separateCampaign.test.ts`: existing retained-evidence string exceeds the codec limit.

The first full player run additionally had five lane-owned stale expectations:
three examination-upgrade descriptions and two tutorial times. Updated those
tests and reran; all pass. M1 saves one minute of tutorial walking, so guided
4x wait is 37,500 rather than 37,750ms; frozen service timing, review records
and the 4x ratio remain asserted. One transient perf-owned phone-inspector
failure did not recur; focused current and entry-domain/entry-view-model
controls each passed 4/4, and the final full run passes it. No perf test/source
was changed by this lane. Final full-player count includes concurrent perf
tests, hence differs from the earlier 4,080-test run.

Milestone receipts retained: M1 domain 5,230 pass / 27 fail / 1 skip (207 files),
balance 164/164, affected player 26/26, focused domain 50/50, seven types pass.
M2 domain 5,235 / 27 / 1 (208), balance 164/164, affected player 26/26, focused
domain 35/35, seven types pass. Isolated repaired M3 domain 5,239 / 27 / 1 (210),
balance 165/165, affected player 4/4, seven types pass. M3's private read-only
source overlay excludes M4 specialty tests/policy; the current full run contains
and passes the final recovery tests added during M4.

Optional native `test:boundaries` could not spawn Git (`spawnSync git EPERM`);
no Git process executed. Supplemental same command with the perf lane's existing
read-only captured-inventory adapter exits 0:

```
Verified runtime dependency boundaries and 19196 tracked path(s).
Verified launcher health contract gamify-surgery-player protocol 1.
```

Only the verifier's exact inventory lookup uses the captured byte-exact path
list; its source scans/assertions remain unchanged. Fresh native tracked-path
inventory verification remains a manager check. Receipt: `M4-boundaries-adapted`.

## Changed files and scope audit

There are 46 owned code/test paths (16 new), plus this report, the ExecPlan and
the additive current-thread handoff. The 19 runtime files above contain all
changed Level 5 inputs. Additional production file:
`apps/player/src/session/viewModels.ts` (seat/stand/support projection only).

Additional balance tests:

```
packages/balance-config/src/app-role.test.ts
packages/balance-config/src/founder-consults.test.ts             NEW
packages/balance-config/src/room-upgrades.test.ts
```

Domain tests/fixture:

```
packages/game-domain/tests/app-appointments.test.ts
packages/game-domain/tests/colleague-names.test.ts
packages/game-domain/tests/employee-discussions.test.ts
packages/game-domain/tests/founder-app-consults.test.ts           NEW
packages/game-domain/tests/founder-consult-attendance.test.ts      NEW
packages/game-domain/tests/founder-consults.fixture.ts             NEW
packages/game-domain/tests/founder-procedure-consults.test.ts      NEW
packages/game-domain/tests/founder-specialty-consults.test.ts      NEW
packages/game-domain/tests/game-domain.test.ts
packages/game-domain/tests/level-four-economy.test.ts
packages/game-domain/tests/level-four-integration-defects.test.ts
packages/game-domain/tests/level-four-integration.test.ts
packages/game-domain/tests/pediatric-appointments.test.ts
packages/game-domain/tests/routine-clinic-queue.test.ts            NEW
packages/game-domain/tests/timing-encounters.test.ts
packages/game-domain/tests/wound-ostomy-services.test.ts
```

Player tests:

```
apps/player/src/session/buildModePresentation.test.ts
apps/player/src/session/buildViewModels.test.ts
apps/player/src/session/founderAppConsults.test.ts                 NEW
apps/player/src/session/founderConsultAttendance.test.ts           NEW
apps/player/src/session/founderProcedureConsults.test.ts           NEW
apps/player/src/session/founderSpecialtyConsults.test.ts            NEW
apps/player/src/session/tutorialViewModels.test.ts
```

`owned-files.json` records entry/current hashes for all 46 code/test paths.
`owned.diff` contains available entry-before hunks and full new files; some
existing test entry bytes were not archived, so this is not claimed as a complete
portable patch. `scope-audit.json` records changed bound inputs and preserved
foreign paths. All 560 captured clinical paths and `test-choice-orders.ts` are
unchanged; protected Level 5 evidence/results/checkpoint/legacy/launch JSON
hashes are unchanged (23 captured protected paths checked). Final 19 runtime
input hashes match `M4-verified/inputs`. No owned code changed after validation.
Ten missing existing-test before snapshots are listed explicitly in
`owned-diff-missing-before.json`; no before hunk was fabricated.
No owner/tester save or private patient data was accessed for this task.

## Remaining review and risks

- Manager reviews the Level 4 invariant scope change and the 95/90-minute clinic policy alongside the measured bounded queues/margins, then ports/rebinds in the release tree if accepted.
- OR question supply and phase-linked question-triggered operation content remain writer/design gaps. The runtime OR hold and founder-presence mechanics are ready; live OR consult frequency remains zero.
- No renderer code change is currently required: existing `actionRequired`, founder `seated`, and support role/ID hooks are supplied and tested. Perf-owned files were not edited. Later desktop/phone visual QA must inspect no-exam adjacency, exam bed/stool, suite standing, APP exit/return and stool exclusion, pediatric parent layering, and unopened `!`/status text. Any visual mismatch should be assigned as a separate renderer milestone.
- Fresh learner fixtures are deterministic evidence, not a guarantee of specialty frequency for a campaign with all compatible concepts not due. Existing frozen/incompatible people finish normally rather than changing identity to force a consult.
- Intra consults deliberately retain procedure resources and delay completion while unanswered or left open. Basic clinics intentionally develop a small capped waiting line; training/upgrades remove that backlog in the measured arms. Broader owner playtesting should check perceived question load and queue balance.
- This work is local and uncommitted; no GitHub backup or release publication was made. Owner opening origins, browser profiles and save pathways are unchanged.

## Round 2 — retained M10 browser finding

The manager's browser check exposed a transition missed by the first lane and
its small-fixture tests. This round reproduces the exact founder coordinates
from the actual retained `launch-unmet` checkpoint, then tests the physical
domain and shared view model without a browser. No renderer/perf/cloud, clinical
definition, save format or canonical evidence change is needed.

### What happened to Sophia

The M10 bootstrap loads `integration-l4` through the ordinary context
(`tests/fixtures/level-five-launch.ts:14–19`,
`tools/qa/level-five-launch-bootstrap.ts:18–21`). The retained state is at
tick **3704**. `encounter.auto.4.57`, Sophia Young, is then
`active_pending_result`, decision index 0, physically offsite (`patientLocation`
null), with external laryngeal examination care due at tick **3805**. The
decision-2 panel in the later screenshot appears after time advances; it was
not her state when the chart first opened.

The manager script tries a `!` tab and otherwise clicks the first patient tab.
In this exact initial state Sophia's actionRequired flag is false and there
are no waiting rows; the fallback selects her. `PatientLists.tsx:126` displays
`!` only for actionRequired/waiting rows. This explains the apparent discrepancy
between "first !" and opening a pending/offsite chart; the defect is real in
either case and does not depend on the badge.

Entry source evidence (preserved under `R2-pending-entry/inputs`):

- `reducer.ts:3504–3507` opened a diagnostic-work chart and returned before creating pending founder attendance.
- `reducer.ts:8964–8982` retried only a saved pending marker or a new source-consult link. Sophia had neither, so a result arriving while her chart stayed open never acquired attendance.
- `reducer.ts:7602–7649` sent returning onsite/offsite patients through the existing waiting destination hierarchy. Without attendance recovery, that became her final chair.
- `reducer.ts:7168–7174,7242–7251` chains finite idle walks but holds an actual attendance task indefinitely. The initial wandering was an existing idle plan, not an attendance timeout.
- `retail-operations.ts:220,369` also treated attendance as shopping-compatible and cleared the founder activity when starting a purchase. That was a separate genuine way to preempt an otherwise valid attendance task.

Exact entry trace, reproduced with close/open/resume/ordinary tick commands:

| Tick | Founder | Founder task | Sophia |
|---:|---|---|---|
| 3704 | 41,26 | wander_facility | Offsite, pending result |
| 3714 | 36,26 | wander_facility | Offsite |
| 3724 | 46,26 | wander_facility | Offsite |
| 3734 | 39,26 | wander_facility | Offsite |
| 3744 | 36,26 | wander_facility | Offsite |
| 3754 | 50,28 | null; buying coffee | Offsite |
| 3764 | 38,26 | null; coffee return finished | Offsite |
| 3794 | 38,26 | null | 14,32, returning from offsite |
| 3804 | 38,26 | null | 34,32, returning from offsite |
| 3814 | 38,26 | null | 25,27, walking to waiting |
| 3824–3884 | 38,26 | null | 23,28, waiting-room chair; decision 2 ready |

The detailed replay identifies `retail-operation.159`: coffee walk at3745,
queue3751, purchase3755, return3757, completed3764. No idle plan was restarted
after that return, explaining the long stationary tail. Raw receipts:
`R2-pending-entry/{qa-initial,qa-preopen,qa-trace,qa-trace-detail}.json`.

### Repairs and other chart paths

The existing open-chart field is now durable attendance intent. Current
`reducer.ts:8913–8929` retries any open actionable/summary chart when it can be
attended, even if it was opened during diagnostic travel or came from an older
save without the optional pending marker. Actual care/return movement finishes
safely; the next tick redirects from the patient's real tile without a second
click. No offsite actor is teleported into an exam room.

After the fix, the same trace has the founder at the exam clinician anchor by
3814 and Sophia walking to that exam; by3824 both are at their exam anchors and
remain there through3884. The room is `room.economy.founder-exam`, never the
waiting room. Its legacy coarse navigation represents both care contacts at
50,25; the shared view model distinguishes the founder's seated
`examination-clinician` support from Sophia's `examination-patient`/
`exam-table` support. Tests assert those roles/poses as well as coordinates, so
a shared coarse tile cannot make a waiting chair falsely pass as an exam bed.
Fixed trace: `R2-fixed-probe/qa-trace.json`.

Other current repairs/evidence:

- `reducer.ts:3551–3572` removes the old completed-Endoscopy/OR-suite special case. A completed-result review sends **both** actors to an exam; actual live intra-source consults retain their suite behavior at `:3467–3500`.
- The existing-reservation escort now starts the patient's bed route too (`reducer.ts:3662`). Previously that branch could route only the founder when a saved/returning patient already had an exam claim.
- `reducer.ts:4448–4449` retains attendance after answer submission, through feedback and acknowledged summary until close. Existing next-step feedback actions that close the chart still release attendance and start ordered care.
- `reducer.ts:549–551,625` protects attendance from automatic idle planning and cancels an in-flight discretionary founder purchase before clinical attendance takes ownership. `retail-operations.ts:220` rejects new founder shopping while attending. A positive-control regression first starts an available coffee purchase, opens a real chart to cancel it, then proves shopping cannot reclaim the founder.
- The exact QA pediatric handoff exposed another missed path: `pediatric-family.ts:125–131` previously required a door exit from every starting room, including doorless hallway rooms. Ordinary floor starts now use the facility graph; native pediatric furniture still uses its exact approved segments. The founder reaches the existing clinician stool, APP vacates, and child/parent table reservation stays intact.
- Staff adjacency/feedback hold and live intra-procedure standing/answer+close gates remain intact. No special-case patient-name routing was added.

### Headless regression coverage

New domain fixture/test:
`packages/game-domain/tests/founder-qa-attendance.{fixture,test}.ts`. They load
the same M10 factory/context, use collision-free real command IDs against the
checkpoint's already-full receipt cache, resume4x, open Sophia while offsite,
while returning and after result-ready, and assert bed/chair positions and
continued ownership across reload, answer, feedback, acknowledged summary and
close. The correct baseline fails three of these four tests; the result-ready
control passes, isolating the missed transition.

`apps/player/src/session/founderQaAttendance.test.ts` opens every available
chart kind in that same checkpoint over the next600ticks: a new ordinary
arrival, returned ordinary result, APP, pediatric and wound/ostomy. It checks
founder clinician-seat pose, patient bed/table pose and support ID, one physical
patient, APP stool vacancy, and stable positions for another60ticks. Two more
cases cover Sophia opened offsite/mid-return. **All seven pass.**
`founderStaffAttendance.test.ts` uses an existing staffed fixture and actual
supported discussion content to prove adjacent standing through answer/feedback
and release on close; it passes too. The M10 clinic has no Endoscopy/OR suites
or compatible staff-discussion hire. Existing procedure fixtures therefore
cover those unavailable kinds: both endoscopy and mechanical-only OR have a
standing founder, the actual suite's covered-patient occupancy and stable hold.
Existing no-exam and already-operating-founder regressions also pass.

The new matrix found the hallway pediatric failure before its repair. Its
native child pose is seated on support `table:patient`, not the waiting-seat
role; adult/wound patients use exam-table pose. Two temporary test harness
expectations (that native child pose and a required staff context argument)
were corrected; no production pose was changed to accommodate a test.

### Round-2 Level 5 CHECK

The unchanged driver and unmodified official generator both pass. The official
CHECK captured40private progress writes in memory and made zero canonical
writes. First/best/latest reports62.771688127099196 /66.72582929932634 /
45.38546238244465 also pass the read-only lower-retry assertions.

| Metric | Round 1 final | Round 2 | Delta |
|---|---:|---:|---:|
| Commands | 31,656 | **34,420** | +2,764 |
| Closing cents | 6,979,051 | **7,310,006** | +330,955 |
| Scored completions | 491 | **533** | +42 |
| Walkouts | 0 | **0** | 0 |
| Final tick | 29,476 | **32,073** | +2,597 |
| XP-goal tick | 14,580 | **14,938** | +358 |

These are legitimately different patient-flow outcomes: returning charts now
reclaim exams, founder occupancy lasts through feedback/close, optional shopping
cannot interrupt, and hallway-start pediatric handoffs work. Room/provider
availability and compatible source pools change, changing authored case/node
sequence and when the unchanged driver earns its goals. It books the first
inspection2,600minutes later and therefore runs more ordinary paid visits.
This is not an increased question clock or a per-day throughput gain claim.

The runtime clinical release is byte-identical as serialized data in both
frozen runs: SHA256
`01d239ea464a3cbdffd345b107a4035576922a4b143ea57f5c49f0752123ebf4`,
1,143cases/1,454nodes/608concepts. Unrelated new N4 draft source files arrived
concurrently but are not admitted into this runtime release. Fingerprints:
`round2/clinical-hash-{M4-verified,R2-final}.json`.

Financial reconciliation versus round1: gross +1,399,800 cents, stock +25,631,
paid operating/payroll +1,043,214 = **+330,955 closing cents**. Opening/capital
are unchanged. Actual adult/pediatric/wound/ostomy/MRI receipts are now
350/312/142/140/142, versus321/290/128/126/138. Answered nodes643→694 over the
longer run. Current source charts: APP278, pediatric30, wound/ostomy40.

| Checkpoint | Round-2 tick / cents / completed | Delta vs round1: tick / cents / completed |
|---|---|---|
| integration-l4 | 3850 /2709500 /62 | +120 /-32700 /+2 |
| integration-build | 3850 /1661500 /62 | +120 /-32700 /+2 |
| integration-preparing | 22302 /5579379 /374 | +2600 /+331933 /+44 |
| integration-running | 22439 /5610358 /376 | +2600 /+336255 /+44 |
| integration-final | 25358 /6191128 /423 | +2600 /+363560 /+42 |
| integration-finish | 25359 /6191128 /423 | +2600 /+363560 /+42 |
| integration-repeat-final | 29015 /7031472 /484 | +2600 /+371356 /+42 |
| integration-repeat | 29016 /7031472 /484 | +2600 /+371356 /+42 |

Every checkpoint has0walkouts. Versus the already-stale retained release pin
26362/6056335/410/0, final totals differ by+8058commands/+1253671cents/+123
completions/0walkouts; that whole difference is not attributed to round2.

Only three bound runtime inputs change this round:
`packages/game-domain/src/{reducer.ts,pediatric-family.ts,retail-operations.ts}`.
Retail is additional to the first round's19-path list, so this lane has20
cumulative changed/new bound runtime inputs. Balance and drivers are unchanged.
New unrelated N4 files are separately identified in the scope receipt; they are
not claimed as lane-owned changes. No rebind/results/checkpoint rewrite.

### Round-2 validation and handoff gate

Commands use the same PowerShell/CI/threads/player preload as round1. Native
exits, raw logs and JSON reports are under the private receipt directory.

| Command / receipt | Exit | Result |
|---|---:|---|
| Full domain / `R2-domain-verified` | 1 | `Test Files 2 failed \| 210 passed (212)`; `Tests 27 failed \| 5250 passed \| 1 skipped (5278)`;565.87s |
| Focused domain / `R2-domain-focused-final` | 0 | 6files,112/112tests,21.31s |
| Full balance / `R2-balance` | 0 | 25files,165/165tests,3.35s |
| Full player / `R2-player-full` | 1 | `Test Files 5 failed \| 417 passed (422)`; `Tests 17 failed \| 4074 passed (4091)`;911.64s |
| New QA/staff player regressions / `R2-player-regressions-final` | 0 | 2files,8/8tests,27.42s |
| Root seven-workspace types / `R2-typecheck-closing` | 1 | Six pass; clinical-content has9errors in the new unrelated N4 evidence draft |
| Unmodified official Level5 CHECK / `R2-official-check` | 0 | All normal and lower-retry assertions pass;40private progress writes captured,0canonical writes |
| Independent unchanged public driver / `R2-journey` | 0 | Same34420/7310006/533/0totals |
| Read-only question-test predicate review / `R2-question-test-review` | 0 | 1file,33/33tests,26.69s; diagnostic test-source overlay only |

The first full domain run had5247pass/30fail/1skip in212files,583.38s. Of those,
27are the known Level5 binding/history + static608vs587 admission baseline.
The other three were two parameterized ultrasound procedure expectations and
one ordinary-intermediate expectation that still required null founder activity
immediately after an answer. Updated them to require attendance until the chart
actually closes, retaining frozen timing, service release and manual-command
assertions. The112/112focused run includes those repairs.
The final full rerun confirms only the same27baseline failures remain.

Player failures: the same four baseline files listed in round1, plus13cases in
`apps/player/src/questionShipSaveCompatibility.test.ts`. Its `ready` helper at
lines63–68 explicitly requires a patient who has returned from a result to be
at `room.instance.founder_desk`. Those patients now correctly reach
`room.ship-save.exam` with their next question available and unchanged frozen
content, so the helper times out. A representative failure records delivered
result250, currenttick267, lifecycleactive_action_required, nextstepaction_required,
openchartcorrect, room.ship-save.exam. This is a new stale physical-location
test assumption caused by the intended behavior, not a pre-existing baseline
failure or evidence that a frozen question was lost.

An earlier manager brief reserves question save-compatibility tests for the
question lane. This file is therefore unchanged in the working tree. A precise
review hunk is prepared at `round2/question-save-readiness.diff`; only the
physical readiness predicate/comment changes. A read-only Vite test overlay
using that predicate passes **all33tests**, including all frozen identities,
FSRS history, historical admission, format-three save, cloud/journal replay and
durability assertions. No production/cloud/clinical assertion was replaced.
Manager approval for applying that one test hunk was requested asynchronously;
until approved it remains a review artifact for the question lane. The native
full-player output above remains the authoritative unmodified-suite result.
The13affected cases are one fresh accepted flags3 dysphagia save, eight
waiting/in-progress historical breast/calcium/dysphagia/hernia saves, and four
corresponding committed-admission journal replays. All33pass with the single
private readiness correction; no question save-compatibility source was edited.

Closing root types: `packages/clinical-content/src/question-new-n4-evidence-20261110.ts`
has TS2353 at772/2006 (`basisClaimIds` not in EvidenceClaim),4348/4386/4426
(`accessMethod` not in ClinicalSource),4460 (`licenseUrl`),5071/5134/5168
(`termsUrl`). These draft files were added concurrently; the first root run
before the evidence draft appeared passed all seven workspaces. No clinical
file was edited or errors suppressed. Current domain/player and the other four
workspaces pass their typechecks. New N4 modules are preserved and separately
listed in `round2/scope-audit.json`.

Round2-owned code/test files:

```
packages/game-domain/src/reducer.ts
packages/game-domain/src/pediatric-family.ts
packages/game-domain/src/retail-operations.ts
packages/game-domain/tests/founder-qa-attendance.fixture.ts       NEW
packages/game-domain/tests/founder-qa-attendance.test.ts          NEW
packages/game-domain/tests/level-two-endoscopy.test.ts
packages/game-domain/tests/retail-operations.test.ts
packages/game-domain/tests/service-procedure-operations.test.ts
packages/game-domain/tests/timing-encounters.test.ts
apps/player/src/session/founderQaAttendance.test.ts              NEW
apps/player/src/session/founderStaffAttendance.test.ts            NEW
apps/player/src/session/founderProcedureConsults.test.ts
```

Plus additive edits to this report, the ExecPlan and CURRENT_THREAD_HANDOFF.
`round2/{owned-files.json,owned.diff,scope-audit.json}` records12code/test paths
(4new),54cumulative owned code/test paths, and20cumulative changed/new bound
runtime inputs. All20current input hashes match the final frozen driver and
official CHECK. The original clinical paths, test-choice-orders and23protected
evidence/launch JSON paths remain unchanged. Two existing-test before byte
snapshots were not captured; those are explicitly listed as missing portable
patch context, rather than inventing before hunks. Runtime before/after hunks
and new test files are available. No renderer/perf/cloud source was edited.

Manager should rerun the original disposable5184 browser check and inspect
native chair/table rendering at the held exam targets. The headless tests now
exercise its exact data and poses, including hallway-start pediatric care.
Physical browser rendering remains manager acceptance. Existing4173/Pages
owner origins and saves are unchanged; no browser, owner save, GitHub backup,
release-tree write, deployment, installs, agents or network access by this lane.

### Manager-approved release follow-up - 2026-11-10

The manager's desktop browser recheck **passes** Sophia Young: founder and patient
reach the same exam room and the patient projects `exam-table`. This closes the
reported round-2 browser defect. The manager explicitly approved editing the
question-lane readiness helper, overriding that earlier ownership restriction
for this one prepared hunk. This section supersedes the pending-approval and N4
typing status recorded above.

**Follow-up files and guard integrity.**

- `apps/player/src/questionShipSaveCompatibility.test.ts:62`: `ready()` now requires
  `room.ship-save.exam` for both ordinary and post-result questions. The comment
  describes the new owner-approved destination. Removed the obsolete
  `returnedFromResult` branch; all 33 frozen identity, question/answer, FSRS,
  snapshot, journal, replay and durability checks are otherwise byte-identical.
  This shared predicate resolves all 13 stale full-player failures.
- `tools/question-quality/fixtures/question-harden1-n3r4-acceptance-source-migration-20261110.json`:
  updated **only** that test file's exact `afterSha256`, from
  `98c1b26c59000f80d95dc455e127b241876804c6dfc4e6501bfb4d4644136951`
  to `0895aadc381839d9e10324aa00bcdf2de9ca96ac3994bbbd1a0f2ec6ff9cb980`.
  All 18 rows, preimage text/hashes, and every other postimage are unchanged.
  The guard was first observed rejecting the unrecorded edit, then passes 7/7
  after the authorized postimage update. No guard was removed or relaxed.
- This report, the ExecPlan, and `docs/handoffs/CURRENT_THREAD_HANDOFF.md` record
  approval, receipts and the economic explanation. No runtime source changed in
  this follow-up. No N4 draft, clinical definition, renderer/perf, cloud, or
  question/save implementation was edited.

Exact patch and approval receipt:
`.local-dev/founder-consult-pathing-20261110/release-followup/{approved-test-and-guard.diff,authorized-question-test.json}`.

**Final required validation.** All tests use PowerShell `npm.cmd`, `CI=1`,
`--pool=threads --maxWorkers=2`. Player uses the existing sandbox OS-enumeration
preload at `.local-dev/restroom-reception-refill-20261104/validation-preload.cjs`;
there is no test-source overlay in these native focused/full player runs.

| Command | Exact outcome | Exit / duration |
|---|---|---|
| `npm.cmd test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=2` | Test Files **2 failed, 210 passed (212)**; Tests **27 failed, 5250 passed, 1 skipped (5278)** | 1 / 589.45s |
| `npm.cmd test --workspace @gamify-surgery/balance-config -- --pool=threads --maxWorkers=2` | Test Files **25 passed**; Tests **165 passed** | 0 / 2.23s |
| `npm.cmd test --workspace @gamify-surgery/player -- --pool=threads --maxWorkers=2 src/questionShipSaveCompatibility.test.ts` | Test Files **1 passed**; Tests **33 passed** | 0 / 17.93s |
| `npm.cmd test --workspace @gamify-surgery/player -- --pool=threads --maxWorkers=2` | Test Files **4 failed, 418 passed (422)**; Tests **4 failed, 4087 passed (4091)** | 1 / 882.09s |
| `npm.cmd run typecheck` | All **7 workspaces pass**, including clinical-content | 0, initial and closing runs |
| `npm.cmd test --workspace @gamify-surgery/clinical-content -- --pool=threads --maxWorkers=2 src/question-harden1-n3r4-acceptance-20261110.test.ts` | Test Files **1 passed**; Tests **7 passed**, including exact source postimage and immutable preimages | 0 / 3.90s |

The 27 domain failures are unchanged: 26 Level 5 binding/historical-state
assertions and one static clinical admission count (608 vs 587). The four player
baseline failures remain `breadButterPresentation`, `chartStructuredFields`,
`levelFiveRoomsViewModels`, and `cloud/separateCampaign`, with the same stale
choice-count, legacy feedback, break-text regex, and codec string-limit causes.
The new readiness failures fall from 13 to **zero**; passing player tests rise
from 4,074 to **4,087**, with the same 4,091 total tests. No failure was hidden
or added to a blanket exception. N4's previous nine type errors are no longer
present at this check; their writer's files were not edited by this lane.

An extra nine-file question source-guard audit is **282 passed / 2 failed**
(18.45s). The two existing failures are `question-stats1-20261108.test.ts`
(protected `app-appointments.ts` still has its pre-consult capture hash) and
`question-stats1-acceptance-20261108.test.ts` (perf-owned `session/cloud/codecJson.ts`
old source hash). A read-only control restoring exactly this follow-up's two
preimages in memory has the **same 282 passed / same 2 failures** (17.50s).
They therefore predate this correction; the newly approved test's own source
guard passes. Those broader historical source captures still need a separately
reviewed question/perf integration migration; this worker did not overwrite
old captures or authorize the unrelated codec change. This extra audit is
separate from the four full-player baseline failures.

All native logs and exit-code receipts are under `release-followup/`; machine
summary: `validation-summary.json`. The temporary historical-guard control is
explicitly diagnostic and is not used for the required validation results.

**Fresh Level 5 CHECK and owner-facing economic attribution.**

Both the unmodified official generator (CHECK, no `--write`) and independent
instrumented journey pass with identical totals, checkpoints, report scores,
finance and activity to the preceding accepted round-2 run. Official CHECK
suppresses 40 private progress writes in memory and writes zero canonical
files. First/best/latest scores remain 62.771688127099196 /
66.72582929932634 / 45.38546238244465.

| Metric | Current release pin / captured M0 | Accepted round 2, confirmed again | Delta |
|---|---:|---:|---:|
| Commands | 29,663 | **34,420** | +4,757 |
| Closing cash, cents | 6,601,005 | **7,310,006** | **+709,001 (+10.7408%)** |
| Scored completions | 459 | **533** | **+74 (+16.1220%)** |
| Walkouts | 0 | **0** | 0 |
| Final game minute | 27,653 | **32,073** | **+4,420 (+15.9838%)** |
| XP-goal tick | 15,550 | 14,938 | -612 |

This comparison uses the manager's current **29,663 / 6,601,005 / 459 / 0**
release pin. The earlier 26,362 pin above is retained as historical context and
is not the baseline for this release decision.

The larger totals primarily reflect **a longer playthrough**: the unchanged
driver runs until progression witnesses and inspections finish
(`tests/fixtures/level-five-integration.ts:139-166`). Patient-specific consult
selection, the real exam/provider hold and handoff, changed compatible cases
and decision-node sequences, and the bounded clinic workload change when those
goals are witnessed. The first inspection is booked 4,420 game minutes later.
Scored completions per 1,000 total game minutes are **16.5986 -> 16.6183**;
the ledger's gross counter per 1,000 minutes is **611,839.58 -> 611,932.15 cents**.
These averages describe the whole campaign, not a controlled daily productivity
gain. The XP goal alone is reached earlier; it does not itself unlock inspection.
The receipts establish the later booking and changed flow, but do not isolate
one last goal as the sole cause.

The mechanics also change the mix of work:

1. **Continuous adult APP demand and training.** Adult offered demand changes
   from 120 to 90 minutes per home. Basic visits quote 95 minutes; training and
   room upgrades reduce that to 46 at level 5. Existing fees remain unchanged.
   Across this longer journey, paid adult APP visits increase **229 -> 350**,
   adding **968,000 cents** at the same 8,000-cent fee. This is the largest
   direct service-line contribution. Policy is editorial simulation weight in
   `packages/balance-config/src/founder-consults.ts:2-16`; binding and work quote
   math are in `packages/game-domain/src/clinic-work.ts:5-18`.
2. **A bounded waiting queue, with real care holds.** Each home allows one
   serving and one waiting/arriving actor. Demand is deferred at that cap;
   trained/upgraded clinics catch up. Basic visits and consults reserve their
   actual rooms/providers until release. Separate clinic queues no longer
   consume the unrelated general-service cap (including MRI). This changes
   service availability rather than creating extra simultaneous actors or
   bypassing check-in (`app-appointments.ts:57-86`,
   `service-operations.ts:585-621,907-915,2566-2594`).
3. **Same-patient consult handoffs.** The ordinary scored clock converts an
   actual seated clinic visit, rather than spawning a second patient. APP and
   patient hold until attendance; the APP vacates the stool for the founder and
   returns on close. Round 2 ensures offsite/result returns resume that physical
   attendance and retail cannot steal it. These real holds and source-compatible
   pools change selection and progression timing; they are not an extra question
   stream (`clinic-consults.ts:30-53,69-105`, `reducer.ts:8913-8929`). The journey
   offers **278 adult APP, 30 pediatric, 40 wound/ostomy source charts** and answers
   **694 nodes**, versus 590 nodes before.
4. **Other services and costs continue during the longer run.** Pediatric paid
   visits are **306 -> 312**, wound **153 -> 142**, ostomy **151 -> 140**, MRI
   **130 -> 142**. Specialty fees do not uniformly rise: basic clinic holds and
   longer work trade some independent throughput for the desired waiting/handoff
   behavior. No general fee increase was introduced. The public journey has no
   Endoscopy/OR suite, so intra-procedure mechanics contribute zero here.

The lifetime cash reconciliation is exact:

| Driver ledger counter | Before cents | After cents | Delta cents |
|---|---:|---:|---:|
| Opening cash | 1,785,500 | 1,785,500 | 0 |
| Gross booked counter | 16,919,200 | 19,626,500 | **+2,707,300** |
| Stock cost | 311,470 | 456,014 | **+144,544** |
| Paid operating/payroll cost | 10,744,225 | 12,597,980 | **+1,853,755** |
| Capital | 1,048,000 | 1,048,000 | 0 |
| Closing cash | 6,601,005 | 7,310,006 | **+709,001** |

Thus 2,707,300 - 144,544 - 1,853,755 = **709,001 cents**. The driver's gross
counter includes service gross plus encounter settlement net, exactly as
`tests/fixtures/level-five-integration.ts:47-62` defines it. Paid adult/pediatric/
wound/ostomy service fees together add **867,500 cents**; the adult gain is
partly offset by fewer independent wound/ostomy completions. No independent
causal cents are assigned to each interacting routing mechanic.

A fresh equal-time three-day public clinic control uses the same 1,800 operating
minutes, Levels 4 and 5, seed `founder-consult.measure`, before/after. It offers
**9,11,10 scored charts each day (30 total)** in both versions. Adult independent
completions are **14 -> 18** basic, **14 -> 19** trained/upgraded; pediatric
**19 -> 17** basic / **19 -> 19** trained; wound and ostomy each **9 -> 7** basic /
**9 -> 9** trained. Each home has at most **one waiting/arriving patient** in the
samples; basic ends with one pediatric and one ostomy waiter, trained ends
empty, and all arms have **zero walkouts**. Current Level-4 clinic wait actor-
minutes are 2,349 basic versus 500 trained; Level-5 is 2,343 versus 500. Current
source charts over these three days are APP14/peds5/wound4 basic and
APP12/peds5/wound3 trained, within those same 30 scored arrivals. Scored
completions at the common horizon are 29 (Level4 basic/trained), 28 (Level5
basic), 29 (Level5 trained); the before controls are 28 at Level4 and 29 at Level5.
This confirms a modest adult visit increase and the intended training/queue
tradeoff, rather than a 16% daily increase in scored completions.

Fresh receipts: `R2-release-check/official-check.json`,
`R2-release-attribution/journey-details.json`,
`R2-release-daily/daily-measurements.json`, and
`release-followup/economic-attribution.json`. The runtime clinical fingerprint
remains `01d239ea464a3cbdffd345b107a4035576922a4b143ea57f5c49f0752123ebf4`
(1,143 cases / 1,454 nodes / 608 concepts). N4 draft edits are outside this lane
and do not change that admitted runtime release.

**Release scope and remaining gates.** This follow-up changes **zero Level 5
bound inputs**; both edited test/guard paths are absent from the Level 5 binding.
All 20 cumulative lane runtime inputs match the fresh CHECK source hashes.
The cumulative changed/new bound input list is:

```text
packages/balance-config/src/employee-training.ts
packages/balance-config/src/founder-consults.ts
packages/balance-config/src/guidance-tips.ts
packages/balance-config/src/index.ts
packages/balance-config/src/room-upgrades.ts
packages/balance-config/src/service-income-catalog.ts
packages/game-domain/src/app-appointments.ts
packages/game-domain/src/clinic-consult-topics.ts
packages/game-domain/src/clinic-consults.ts
packages/game-domain/src/clinic-work.ts
packages/game-domain/src/founder-consults.ts
packages/game-domain/src/index.ts
packages/game-domain/src/pediatric-family.ts
packages/game-domain/src/persistence.ts
packages/game-domain/src/reducer.ts
packages/game-domain/src/retail-operations.ts
packages/game-domain/src/selectors.ts
packages/game-domain/src/service-operations.ts
packages/game-domain/src/staff.ts
packages/game-domain/src/types.ts
```

All 23 protected Level 5/launch JSON artifacts and `test-choice-orders.ts` remain
unchanged. No rebind, release-tree write, commit, push, install, network, agents
or deploy occurred. Runtime/feature and the manager-approved guard correction
are complete. The manager owns the release port/rebind and the documented
baseline/capture integration gates. The existing live OR-content gap remains
with the question writers; this follow-up adds no clinical material. Browser
Sophia acceptance is recorded above; owner 4173/Pages opening pathways are
unchanged.

## Round 3 - saved checkpoint charts, port-30 phone density

The manager's empty Patients sheet is reproduced headlessly with the exact
port-30 release code and saved checkpoint. The rebound checkpoint has already
completed all its clinical decisions. The density helper closes its one open
completed summary, moving that record into Resolved. The same old serialized
save retains its pending patients under pre-lane, port-30 and current code.

A separate, narrow review defect is fixed: an already-filed chart can now open
read-only while its discharged actor is walking out. The actor keeps leaving;
the founder remains free. Live questions and unfiled summaries retain their
existing attendance and resource holds. No encounter migration or selector
filter was changed.

### Exact input and load comparison

The two worktrees contain different checkpoint payloads, before a loader runs:

| Public input | Raw tick | Raw encounter lifecycles | Open chart |
|---|---:|---|---|
| Live tree retained integration-l4 | 3,704 | 11 resolved, 2 pending results, 1 completed summary | Ethan Kingston, `encounter.auto.4.59` |
| GS-release port-30 integration-l4 | 3,850 | 10 resolved, 1 completed summary; zero unfinished clinical encounters | Lily Clay, `encounter.auto.4.61` |

Live canonical checkpoint SHA256:
`10322f2f3d58be7c211cdd3efd25915f01832f5af0f03a8e32a09397469b0346`;
port-30 release checkpoint SHA256:
`ea2c934b79ddab4fa5cd0481293d834962d967faf46fd4d28947036e09e96a60`.
Both are public reducer-generated fixtures; no owner/tester campaign was read.

`tests/fixtures/level-five-integration-qa.ts:13-18` deserializes the selected
checkpoint. `tests/fixtures/level-five-launch.ts:14-19` selects that same saved
integration-l4 state for launch-unmet, changing only campaign ID and the 749-XP
boundary metadata. `tools/qa/level-five-state-bootstrap.ts:35-49` resumes existing
QA campaigns instead of replacing them. The phone helper's ordinary close
(`tests/e2e/ui-density-helpers.ts:21-26`) files an acknowledged completed summary
through `reducer.ts:3810-3837`.

Every previously unfiled record is accounted for:

| Original record | At load | After helper close and 120 ticks, without answering |
|---|---|---|
| Sophia Young, `encounter.auto.4.57` | Pending external result; physically offsite; Existing Patients | Same frozen case and prior answer; result returns and decision 2 becomes actionable; still Existing Patients and openable |
| Leah Lane, `encounter.auto.4.58` | Pending external result; physically offsite; Existing Patients | Same frozen case and prior answer; still pending and openable in Existing Patients |
| Ethan Kingston, `encounter.auto.4.59` | Both decisions answered, completed feedback acknowledged; open summary | Explicit helper close files him; actor walks out; record appears in Resolved |
| Lily Clay, rebound `encounter.auto.4.61` | One of one decisions answered; completed feedback acknowledged; open summary | Explicit helper close files her; actor walks out; record appears in Resolved |

Old saved-state folder counts at load are **Waiting0 / Existing3 / Resolved11**.
After the helper close they are **0 / 2 / 12**; after120ticks **2 / 2 / 10**.
The new waiting rows are genuine later arrivals; both original pending patients
remain. Finished older records compact normally into the retired summary.
The newest10 unreferenced finished records are retained
(`retired-encounters.ts:24,115-132,155-167`); active and open charts are protected
(`retired-encounters.ts:84`). No unfinished encounter becomes a non-chart visitor.

Rebound saved-state counts at load are **0 / 1 / 10**. Closing Lily produces
**exactly 0 / 0 / 11 before any tick**; this is the reported phone sheet.
Fresh real arrivals subsequently appear (24 minutes to the next arrival clock;
after120ticks there are two waiting charts). No fabricated admission is used.
`getPatientLists` maps the lifecycle to its folder at
`selectors.ts:1864,1888-1906`; the Resolved folder is initially collapsed in
`apps/player/src/mobile/MobilePatients.tsx:30,37-45`. The old density selector
searched only Waiting and Existing, so its assumption depended on the particular
journey checkpoint's unfinished-case mix.

The comparison runs the identical old payload through the archived M0 code,
actual GS-release code via read-only source access, and the current code. New
rebound payloads are loaded with actual release/current code. The old pre-consult
runtime is not claimed to read forward saves containing new consult/work quotes.
Detailed accounting and sampled physical/view-model positions:
`.local-dev/founder-consult-pathing-20261110/round3/{patient-accounting.json,probe-before.json,probe-current.json,probe-release.json,probe-fixed.json}`.
The final current-code probe uses released clinical sources read-only, preserving
the same clinical selection inputs during concurrent question work.

### Departing patient / founder observation and fixes

The port-30 sequence is reproduced with Lily: close her acknowledged summary,
then select the resulting Resolved card while she is walking out. Previously
`OPEN_CHART` rejected with **"The patient is already leaving the clinic."** The
open-chart ID stayed null. At+10minutes the founder is wandering; by+15minutes
he starts `visit_bathroom`. This matches the reported labels without dropping
an unanswered chart. Her single question was answered and filed before that
click. Physical departure clears only the actor location
(`reducer.ts:7667-7669`); `viewModels.ts:2192-2197` removes the departed actor,
while chart rows are built separately and remain available.

The fix at `reducer.ts:3452-3469` lets an already-`resolved` record continue
through the existing read-only open path during departure. Arrival and
nonterminal departure guards remain. It preserves the departure movement and
founder activity exactly. The open historical record stays pinned after its
physical actor exits; the new tests keep it open for120ticks, including reload.
The displayed chart is `readOnly:true`, remains in Resolved, and does not recall
the patient or reserve the founder/room/APP.

An unfiled completed summary remains a live attendance target until actual close:
opening Lily's summary and ticking60minutes holds the founder in the exam room,
keeps the patient there, and preserves the open chart. The existing Sophia
regressions still hold the real later decision through180minutes. Pending
external work can leave the founder free while the actor is offsite; the chart
remains open and resumes physical attendance when the patient returns safely.

`tests/e2e/ui-density.spec.ts:314-321` now uses the real Resolved toggle/card
when Waiting and Existing are empty. It still taps a real patient card and
asserts the same chart dialog, close action, readable targets, overflow and
Build Mode controls. No assertion, guard, or patient identity was removed;
no new patient or answer is injected. This change requires the domain review
fix because the newest filed patient may still be physically exiting.
No renderer/perf/cloud or production player view-model source was edited.

### Changed files and regression coverage

- `packages/game-domain/src/reducer.ts`: only the resolved-during-departure open
  guard and its explanatory comment; no clinical flow, fee, timer or save field.
- `tests/e2e/ui-density.spec.ts`: Resolved fallback for the existing real phone
  card action; remaining assertions unchanged.
- `packages/game-domain/tests/founder-qa-attendance.fixture.ts`: freeze the
  original Sophia regression against its retained public snapshot so future
  canonical rebinds do not replace the patient. **GS-release already has this
  retention change**; preserve that version instead of replacing its file.
- `tests/fixtures/founder-qa-attendance-20261110.json`: exact original public
  snapshot, byte-identical to the release manager's retained copy; also already
  present in GS-release. It is semantically identical to live integration-l4.
- `tests/fixtures/founder-consult-rebound-l4-20261110.json`: exact selected
  port-30 integration-l4 saved state, retained as test data. No state is edited.
- `packages/game-domain/tests/founder-checkpoint-visibility.fixture.ts`: original,
  rebound and actual current QA constructors for both integration-l4 and
  launch-unmet; raw input access for the first-load assertions.
- `packages/game-domain/tests/founder-checkpoint-visibility.test.ts`: **11 tests**;
  raw saved IDs, frozen cases, answers and lifecycles survive first load; each
  unfinished record remains listed/openable across0..120ticks and reloads;
  completed summaries file correctly; history reviews stay open during/after
  departure; unfiled summary attendance stays held.
- `apps/player/src/session/founderCheckpointVisibility.test.ts`: **8 tests**;
  every domain chart projects into the correct folder, live rows open actual
  chart views, physical actors are unique, and departing actors disappear only
  from the facility after discharge while read-only charts remain.
- This report, ExecPlan and current handoff record the result and re-port scope.

Both new departing-review cases failed in domain and player before the fix
(domain9pass/2fail; player6pass/2fail). All new tests pass afterward. The tests
compare initial raw inputs, rather than defining the expected set from an
already-loaded state, so a future load-time deletion cannot pass unnoticed.
The actual-current constructor arm continues to exercise whichever canonical
checkpoint the release manager later retains.

Portable source/test hunks and exact file hashes:
`round3/owned.diff`, `round3/owned-files.json`. JSON payload hashes/provenance:
`round3/retained-public-fixtures.json`. The existing Sophia helper preimage was
recovered from its immutable verified round-2 patch and hash; it was not guessed.
There are **8 owned code/test/data paths (5 new)** plus the three documents.

### Validation, Level 5 and re-port gate

PowerShell `npm.cmd`, `CI=1`, `--pool=threads --maxWorkers=2`; player uses the
existing sandbox preload. Full native suites use ordinary project configs.
The final focused run uses a private read-only released-clinical source overlay
because clinical registry files changed after native suites began; it changes
no domain/player/test source or test assertions/config budgets.

| Check | Exact result | Exit / seconds |
|---|---|---|
| Focused domain: new visibility, retained Sophia, timing-encounters | **36 passed, 3 files**; final first-load assertions included | 0 / 19.93 |
| Focused player: new visibility and retained Sophia | **15 passed, 2 files** | 0 / 26.20 |
| Full domain | **5261 passed, 27 failed, 1 skipped (5289)**; **211 passed, 2 failed files (213)** | 1 / 570.91 |
| Balance | **165 passed, 25 files** | 0 / 2.70 |
| Full player | **4094 passed, 5 failed (4099)**; **418 passed, 5 failed files (423)** | 1 / 891.24 |
| Real module-worker isolated repeat | **1 passed, 1 file**; unchanged source, guard and time budget | 0 / 12.53 |
| Root typecheck | **All seven workspaces pass**, including closing run | 0 |
| `node node_modules/@playwright/test/cli.js test tests/e2e/ui-density.spec.ts --project=phone-chrome --list` | **4 phone-project density tests resolve**, including the corrected case | 0; listing only |
| Official Level 5 CHECK | **34420 commands / 7310006 closing cents / 533 completions / 0 walkouts** | 0 |

Domain failures are unchanged: **26 Level 5 input/historical-state pins plus
one static admission-count assertion** (608 vs587 in this native run). All
Level 4 and new chart-routing tests pass. The four known player baselines remain
`breadButterPresentation`, `chartStructuredFields`, `levelFiveRoomsViewModels`,
`cloud/separateCampaign` with their previously documented causes.

The fifth player failure is precisely classified: in
`session/cloud/operationalEngineDev.test.ts:18`, gameplay state matched, but the
view comparison saw **608 learning cards in the already-compiled test process
and 610 in its freshly loaded Vite worker**. Parsed expected/actual views have
**one difference only**: `.development.learningCards.length`; the first608
cards and every other field are identical. The clinical index/manifest/synthetic
release/timing sources changed concurrently from the captured v8 epoch to v9.
An isolated unchanged rerun passes against one consistent epoch. This is a
cross-process test-input mismatch; no worker deadline, view guard or perf source
was changed. Machine proof: `round3/worker-view-epoch-differences.json` and
`player-worker-repeat.log`. It is not counted among the four known baselines.

Initial typecheck found one implicit-any callback in the new test; that was
corrected, then all seven checks pass. New tests were first run with native
configs too (36/36 domain,15/15 player); final stronger first-load assertions
were verified against the captured released clinical source. The clinical
writer's new content is not claimed validated by this domain handoff. Foreign
changes are preserved and listed in `round3/scope-audit.json`.

CHECK uses the stable released clinical runtime fingerprint
`01d239ea464a3cbdffd345b107a4035576922a4b143ea57f5c49f0752123ebf4`
(1143 cases /1454 nodes /608 concepts). Totals equal the manager's current
port-30 release pin **34420 /7310006 /533 /0**: all four deltas are **zero**.
The eight printed checkpoint tick/XP/inspection-phase triples also equal the
current GS-release checkpoints; first/best/latest scores remain
62.771688127099196 /66.72582929932634 /45.38546238244465. The driver does not
open already-filed departing history charts, so the new review allowance does
not alter its clinical flow or revenue. No demand or balance value changes.

Only **`packages/game-domain/src/reducer.ts`** changes a bound Level 5 runtime
input this round. Its source hash changes even though the replay totals and
printed checkpoint phases do not. The two retained test JSONs and test helpers
are outside the Level 5 binding. No evidence rebind or canonical result/checkpoint
write occurred; official CHECK captures40 private progress writes in memory.
All23 protected Level 5/launch JSON artifacts remain byte-identical in this
worktree. Save schema/persistence are unchanged. Exact commands, exits, phases
and scope: `round3/{validation-summary.json,level5-summary.json,scope-audit.json}`.

Manager next action: re-port the one runtime guard, phone density fallback and
new test files/data, preserving the already-retained Sophia helper/copy. Rerun
the reported phone Chrome case against the release server with a stable clinical
source epoch. Browser execution remains the manager's sandbox responsibility;
this worker ran deterministic headless regressions and Playwright listing.
Then apply the release evidence binding update if accepted. No Git, commit,
push, install, network, agents, deploy or GS-release write occurred. Owner4173
and remote Pages opening pathways are unchanged; all diagnosis used disposable
public QA states and read-only release source access.

## Accepted N4 runtime integration follow-up

Round3 accepted by manager. The subsequent exact N4 integration is complete;
see [domain runtime handoff](question-n4-domain-runtime-integration-20261110.md)
for the three small source hunks,19 new regressions, full validation, stable
610-card resolution, source-only procedural offers, operating-day measurements
and frozen before/after Level5 attribution. Final CHECK28601commands /
6227467cents /445completions /0walkouts; no evidence rewritten. Clinical content
and renderer/perf/cloud files remain unchanged by this follow-up. Manager owns
release integration and evidence rebind.
