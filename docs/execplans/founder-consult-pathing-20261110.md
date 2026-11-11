# Founder consult pathing — 2026-11-10

## Goal, scope and ownership

Implement the owner's 2026-11-10 founder/consult direction in four sequential
milestones after a measured current-behavior audit. Assigned domain worker; no
agents, commits, pushes, deploys or installs. Shared main tree; preserve all
unrelated edits. The phone performance worker owns FacilityScene/FacilityCanvas,
renderer/performance code, session/cloud and mobile/performance: read only in
this lane. Record precise later presentation work instead of editing those
files. Existing clinical concepts/questions are read only. No invented clinical
content or relationship. Simulation frequencies/weights belong in balance-config
and must be explicitly editorial. No Level 5 evidence/pin rebind.

Entry hashes: `.local-dev/founder-consult-pathing-20261110/entry-hashes.json`.
Read repository AGENTS.md and CURRENT_THREAD_HANDOFF before work. Current
handoff reports domain 5,226 passes / 28 failures / one skip on 2026-11-10;
classify actual validation failures rather than assuming the Nov 5 baseline.
No owner-campaign data is needed. Fixtures/drivers use public synthetic states.

## Testable behavior contract

| Case/trigger | Patient and staff | Founder destination/posture | Blocks while waiting/open | Release on chart close |
|---|---|---|---|---|
| Ordinary patient chart opens before any usable exam room exists | Patient remains at their current valid waiting/check-in destination; stop a conflicting discretionary trip safely | Walk to a reachable adjacent standing anchor beside that patient, not onto the patient's tile | Founder stays for this open encounter; no artificial exam-room requirement | Release attendance/standing claim; patient follows the selected next step or normal departure; unanswered chart remains available |
| Ordinary chart opens with an available operational exam room | Reserve one exam room; patient walks to its bed anchor and waits there | Walk to the same room's clinician chair/stool anchor; seated once arrived | Room/seat ownership prevents another patient/provider taking it; if all rooms busy, use waiting-room queue and dispatch when one frees | Release encounter attendance and room when clinically safe; next step/departure resumes; founder returns to normal behavior |
| Staff question opens | Discussing employee stays available at their reachable standing location; suspend conflicting work using existing ownership rules | Walk to a distinct reachable adjacent standing anchor and stay until closed | Neither actor silently abandons active discussion | Release founder/discussion attendance and restore employee work/idle behavior without duplicate task ownership |
| Intra-endoscopy/intra-op question becomes due during an actual procedure | Existing patient remains in its suite; existing procedure staff/resources remain reserved; question uses an existing compatible procedure-context concept | No founder diversion before opening; on open walk to an approved distinct provider/consult standing spot in that suite; if already operating, remain in place | Procedure cannot complete/credit/depart until required answer is accepted **and** the resolved chart is closed; timing delay is real and deterministic | Clear consult hold after answer+close, resume remaining phase/completion once; founder is free unless still needed as operating provider |
| APP independent visit, no player question due | APP continuously sees its current patient in the correct exam room; others use waiting-room seats/standing fallback | Normal founder behavior | Normal room/provider reservations; no scored chart for every automatic visit | Normal independent completion, income and next-patient dispatch |
| APP visit reaches a due player consult | Current seated exam-room patient becomes the scored `!` chart; APP and patient wait in that room | On open, walk to the same clinician stool; APP vacates before founder takes it | Patient/room remain reserved; no double occupation or duplicate patient/question creation; founder stays while chart open | APP returns to home room for next work after close; patient follows chosen next step/departure; founder resumes normal behavior |
| Pediatric / wound-ostomy APP consult | Same handoff contract using the specialty's existing patient and clinician anchors/rooms; pediatric companion keeps its existing safe reservation | Same founder handoff, with care-room authorization | Existing clinical/capability/age eligibility remains authoritative | Same deterministic release; retain companion safety and specialty identity |

Closing an unanswered chart releases founder attendance but cannot satisfy an
unanswered procedure hold or silently finish scored care. Reopening reacquires
attendance; answer plus terminal close releases the hold. Chart switching must
perform the same cleanup as close. No teleporting, crossing unrelated protected
treatment rooms, changing frozen question identities, or charging twice.

Queue target: measurable steady demand rather than unbounded backlog. Basic
untrained APP service is slower than its arrivals; upgraded/trained service is
faster. Admission/backlog limits keep overload finite and prevent new walkout
spikes. The precise editorial rates will be selected from baseline measurement,
not from a clinical probability claim. Overall question cadence remains bounded;
specialty/procedure consults share it rather than add an uncontrolled flood.

## Milestones and acceptance

1. **M0 audit/measurement (first):** fill current-behavior file:line evidence and
   gap table below; baseline Level 4/5 public fixtures/drivers for consult counts
   per 600-minute game day, APP arrivals/completions, occupancy, waiting-room
   queue, trained/untrained rates. Trace actual existing procedure concepts and
   report missing suitable content. Record baseline Level 5 driver totals.
2. **M1:** founder targets and release for ordinary/no-exam/exam/staff chart
   cases. Tests for anchors, physical travel, busy-room queue, closure/switching,
   deterministic reopen, existing in-flight saves. Domain rules before safe
   view-model hooks. No perf-owned file edits.
3. **M2:** procedure-context consult generation and answer+close completion
   hold; chart `!` hook; founder presence/operating-provider behavior. Test early
   close, answer without close, delayed answer, all relevant phases, reload,
   cancellation/removed-room repair, no double billing or clinical invention.
4. **M3:** current-patient APP handoff and deterministic staff/stool transfer,
   continuous automatic visits, measured bounded queue tuning. Cover ordinary
   exam visits, busy founder, multiple APPs, upgrades/training, reload and close.
5. **M4:** same specialty handoff, measured noticeable peds/wound consult supply
   without overall flooding; preserve existing eligibility/identities/companions.
6. Final integration: full affected and full player tests, source-scope audit,
   final measurements, exact remaining renderer hooks/content gaps, final
   handoff and additive CURRENT_THREAD_HANDOFF update. Stop for manager review.

For each implementation milestone: game-domain tests, balance-config tests,
affected player Vitest with `--pool=threads`, root seven-workspace typecheck;
record exact native exits, counts and all failures. Run Level 5 journey in CHECK
mode after each milestone; report totals/deltas and changed bound inputs only.
Do not rewrite canonical evidence. Full player at the end. Use PowerShell
`npm.cmd`, CI and threads; use the existing sandbox preload where necessary.

## Current behavior audit and measurements

M0 complete before runtime edits. Source evidence below refers to entry files;
later hunks may move line numbers. Private frozen-source receipts are in
`.local-dev/founder-consult-pathing-20261110/M0/`.

| Rule | Current evidence | Gap / implementation direction |
|---|---|---|
| No-exam chart attendance | `reducer.ts:3541–3558` exempts only two protected tutorials from the exam requirement; `:3595–3609` otherwise calls chooseCareRoom, with no adjacent fallback | Tutorials can open without founder travel; ordinary no-exam visits also get no travel. Add a public adjacent standing destination only when no exam room exists. |
| Exam room patient/founder anchors | `reducer.ts:968–1030,3619–3636,3646–3688`; `spatial.ts:117–128` uses authored patient/clinician anchors | Basic escort already exists, including the earlier service-seat repair. Add explicit regression coverage and correct standing/seated projection; keep full-room queue/retry at `reducer.ts:8846–8860`. |
| Staff questions | `reducer.ts:2804–2833,3065–3106` already chooses a distinct adjacent anchor, freezes employee work and routes founder; `:3285` releases immediately on answer; `:3170–3186,3351–3394` closes/files | Keep existing physical approach; defer answer-time release until actual close/file and test reopen/temporary busyness. |
| Intra-procedure generation | `reducer.ts:6073–6113` samples one general scored pool; `service-operations.ts:1999–2026` starts only timed work, no scored consult | Independent routine service patients never become charts. No operation-to-chart binding exists. Add a versioned optional binding for actual in-service work and use the shared scored cadence. |
| Procedure founder destination | `reducer.ts:3500–3535,3582–3593` only recognizes a delivered pending result from a completed Endoscopy/OR route | This is a post-result revisit, not an intra-procedure consult. Add explicit live-operation source; preserve already-operating founder. |
| Procedure completion | `service-operations.ts:2956–2972` waits for physical beds/nurse attention and elapsed phase time only | Add answer + terminal-chart-close gate, resource retention and safe reload/cancellation repair. |
| APP continuous visits | `app-appointments.ts:39–45`; `service-operations.ts:2531–2562` creates separate unscored service visitors, at most two active per home and one waiting/arriving | Continuous care exists but never escalates its actual patient. Keep admission backpressure; convert one current visit into a scored chart when a question is due. |
| APP founder handoff | `app-appointments.ts:57–78` and `reducer.ts:1027` give independent scored charts priority/yield an APP room | Currently competes with and redirects automatic work, rather than handoff. Add same-patient/same-room stool transfer and explicit APP return after close. |
| APP speed / queue | `employee-training-effects.ts:43–52,55–74` has no APP duration reduction; current room upgrades do not speed APP consultation work | Upgraded/trained and basic duration/throughput are identical. Introduce documented editorial appointment work/arrival policy and measure admission backpressure separately from offered demand. |
| Pediatric/wound questions | `clinical-case-eligibility.ts:12–46,62–68` retains exact pediatric profile/art/family and Level 4 gates; general selection `clinical-selection.ts:102–143` is concept-uniform, not specialty-weighted | Small specialty pools compete with hundreds of clinic concepts. Add bounded specialty turns inside the existing question cadence and exact compatible current-patient binding, not an additional arrival flood. |
| Left chart ! | `selectors.ts:1762–1767` marks only active_action_required, not waiting_unopened; `viewModels.ts:820` forwards that flag | New consults need actionRequired before first open. Existing UI consumes the flag; no new renderer file is necessary for chart notification. |
| Founder pose | `viewModels.ts:2107–2111` makes every arrived attend_encounter seated; `:692–697` derives support role from assigned room without endpoint validation | A bedside/no-exam or procedure consult would look seated. Fix safe view-model pose/support hooks; FacilityScene remains read only (`:6786` already consumes founder.seated). |

Baseline public Level 4 economy fixture, repeated at Level 5 with the same
operational layout, seed `founder-consult.measure`, three 600-minute days per
arm. Honest isolated training comparison sets APP training/clinic room upgrades
to five in the trained arm; all ordinary commands, movement, finance, selection
and cadence run. It does not claim those levels were purchased for free in play.

| Level / staff-room arm | Independent adult visits arriving/completing over 3 days | Peds | Wound / ostomy | Scored arrivals by day | Intra-endo / intra-op / APP / peds / wound / staff consults per day |
|---|---|---|---|---|---|
| 4 basic | 14 / 14 | 19 / 19 | 9 / 9 each | 9,11,10 | 0 / 0 / 0 / 0 / 0 / 0 |
| 4 trained/upgraded | 14 / 14 | 19 / 19 | 9 / 9 each | 9,11,10 | 0 / 0 / 0 / 0 / 0 / 0 |
| 5 basic | 14 / 14 | 19 / 19 | 9 / 9 each | 9,11,10 | 0 / 0 / 0 / 0 / 0 / 0 |
| 5 trained/upgraded | 14 / 14 | 19 / 19 | 9 / 9 each | 9,11,10 | 0 / 0 / 0 / 0 / 0 / 0 |

Per-day rates: adult 4.67, pediatric 6.33, wound 3.0 and ostomy 3.0 arrivals and
completions on average. Maximum arrival/resource queue is one per line, with
end-of-day queues only one ostomy arrival on day 1 then empty. Actual seated
waiting totals across all APP streams are 0,35,36 actor-minutes/day, identical
in all four arms. There were no scored pediatric/wound cases in these 30 scored
arrivals and zero walkouts. These are independent visits, not player consults.
Hourly queue samples and daily per-type counts are retained in
`daily-measurements.json`. The stock economy fixture has no Endoscopy/OR suite
and no staff-discussion-compatible hire, so those zeros alone cannot diagnose
procedure/staff supply.

Separate operational procedure-fixture controls at both Levels 4 and 5 run
three days with actual Endoscopy or OR staff/rooms. Endoscopy starts 4,5,6 cases
and completes 3,5,6; OR starts 4,5,5 and completes 2,5,5. They generate 29/30
ordinary clinic charts respectively, but zero linked intra-procedure charts.
`procedural-measurements.json` establishes that the zero is not absence of busy
operating suites.

An additional compatible-staff control uses the routine OR fixture at Levels
4/5, restores the ordinary staff-question deadline suppressed by that mechanical
fixture, and answers/files real discussions through commands. Actual staff
generation is **4,3,3 per day** at both levels (`staff-measurements.json`), in
line with first delay30 / interval180. All60 staff cases support the same eight
eligible clinical roles; the stock economy fixture's APP/reception/EVS roles
are not among them. This existing stream is independent of scored patient
arrivals and must be included when assessing total question load.

Content inventory: 1,143 runtime cases; required settings clinic 1,126,
outpatient_endoscopy 3, endoscopy 10, periop_recovery 4, **ambulatory_surgery 0**.
There are 60 employee-discussion cases and 20 explicitly pediatric cases before
concept deduplication; zero current cases require a wound/ostomy capability.
Wound-topic clinic cases need a separate exact-ID/content-context audit, because
the existing clinical capability metadata cannot identify their consult stream.
Procedure-related post-pathology teaching must
not be falsely relabeled as intra-operative. M2 must bind only existing suitable
authored procedure context; absent intra-op content is a question-writer gap,
not permission to invent a clinical setting or relationship. Exact eligible IDs
and exclusions will be recorded with M2.

Actual frozen-current-content M0 Level 5 CHECK: **29,663 commands; 6,601,005
cents; 459 scored completions; zero walkouts; final tick 27,653; XP goal tick
15,550**. It completed in 246.398s, native exit 0; no evidence written. All
milestones compare to this same content snapshot, not older release numbers
or the November 5 question pool. `journey.json` holds checkpoint/report totals.

## Progress, decisions, discoveries and next action

- 2026-11-10: read instructions/current handoff, captured 1,820 source/test/fixture
  entry hashes. No runtime edits. No nested AGENTS.md in owned packages.
- M0 complete: actual public-fixture/driver measurements and source audit above.
  No runtime inputs changed during measurement. First private seat-minute
  probe used a nonexistent export; fixed it to import the existing waiting-path
  helper and reran all four arms successfully. No assertions or input data
  changed to obtain the baseline.
- Next: M1 adjacent/no-exam routing, keep staff attendance through close, correct
  safe founder pose projection and add domain/player regression tests.

### M1 implementation and verification note (in progress)

- Implemented adjacent stands without an exam room. The stand excludes other
  actors' reserved endpoints and the front-desk staff chair. Opening freezes a
  discretionary waiting leg at the visible patient tile; an amenity trip safely
  returns first and attendance retries. Existing exam escort, full-room queue,
  bed/chair anchors and close cleanup are reused.
- Staff approach is shared with adjacent patient attendance. Answering no
  longer releases the staff discussion; close/file does. Reopening feedback or
  summary also reacquires attendance. No save fields/format change in M1.
- Safe viewModels.ts now projects an exam-chair seat only at the real chair
  endpoint, and standing attendance outside care chairs has no seat support
  role. No perf-owned source changed.
- Focused domain final:50/50 in5files. Affected player:26/26 in8files. Full
  balance passes; seven workspace types pass after a nullable-location guard.
  New domain regression3 and player2; employee-discussion expectations now
  assert holding through answer and releasing on actual close.
- First full domain run:5226pass/31fail/1skip.26known Level5 binding/history
  failures + static admission608vs587, plus4 old no-exam/startup assertions.
  Updated only those four assertions for the new owner rule; focused rerun50/50.
  The all-incorrect startup path now completes at tick194/cash177 instead of
  tick198/cash176.75: freezing the waiting leg saves4minutes/upkeep. Tutorial
  rewards and ability to afford the160-dollar exam are still asserted.
- Initial M1 Level5 CHECK equals M0 exactly:29663commands/6601005cents/459completed/
  0walkouts,tick27653,XPgoaltick15550. Final full-suite and exact final-source
  CHECK reruns are running (`M1-domain-final`, `M1-final/journey.json`). The first
  CHECK froze before the final null guard; final-source rerun prevents treating
  a slightly older source hash as final evidence.
- Exact final-source M1 CHECK completed successfully with the same totals above.
  Final full-domain run is finishing. No Level5 evidence/rebind. M1's only
  changed bound runtime source is reducer.ts; viewModels.ts and tests are not
  Level5 inputs. Question content is unchanged throughout these runs.
- M1 complete: final full domain5230pass/27knownfail/1skip. Four stale behavior
  assertions are fixed and pass; the previously reported historical supply
  timeout did not recur. Balance164/164, affected player26/26, focused domain
  50/50, all7workspace types pass. Proceed to M2; retain all M1 receipts.

### Next implementation design (not yet applied)

M2 should bind a scored encounter to an already in-service routine visitor,
convert that operation's actorKind to encounter, and retain the same operation,
location, resources and fee. Optional versioned consult metadata plus an
operation-to-encounter pointer need strict normalization, no schema bump or
rewriting old frozen cases. Extend clinic-visit normalization only for a valid
consult-owned encounter when M3 uses the same path. Use actual suite staff spots,
retain an already-operating founder, and block the relevant service phase until
answer+terminal close. Close-unanswered frees founder but holds the patient/work.
Missing/removed source resources must use existing service interruption repair.

Preserve current patient art/name where compatible with an existing approved
clinical profile. Do not replace clinical demographics/stories to fit an actor.
Exact pediatric family/art contexts require compatible scheduled visitors before
conversion; retain the existing physical pair reservation instead of duplicating
the parent. Never change an already frozen scored case to create a consult.
Procedure cases with post-pathology/referral context must be excluded from intra-
procedure sampling unless writers supply an explicit appropriate instantiation.
No currently published ambulatory_surgery cases exist; implement/test the domain
mechanism with a clearly synthetic mechanical fixture, and report the live
intra-op supply gap instead of admitting an invented question.

### M2 implementation and verification note

Implemented same-actor routine procedure consults at the existing scored arrival
clock. Only existing finding/treatment questions in the actual procedure setting
are candidates; post-pathology, referral and recovery teaching are excluded.
The original operation, resources, fee, person and location survive conversion.
Unopened consults have an action marker, founder attendance uses a distinct suite
provider stand, and an already-operating founder stays. The procedure phase
cannot advance until terminal feedback is acknowledged and its chart closed.
Closing unanswered releases the founder but retains the procedure hold.

Optional, strictly normalized `founder-consult.v1` metadata and the operation's
encounter pointer preserve old saves without a schema bump. Missing source
links repair on a tick. Existing in-flight people are never re-profiled. New
procedure visitors use presentation demographics from existing published,
compatible procedure profiles; this is editorial presentation coverage, not a
clinical prevalence distribution or a pending case/concept reservation.

The first real-fixture measurement exposed incompatible generic visitor art;
mechanical tests alone had not exposed that supply gap. After the presentation
correction, actual endoscopy controls at both Levels4/5 generate **2,0,2 linked
consult charts over three days**. Day2 has no due compatible unused concept;
FSRS is not bypassed to force repeats. All six eligible published endoscopy
cases currently share a Female43 prototype, a presentation-diversity gap for
question writers. Live intra-op consult count remains zero because there is no
published ambulatory_surgery case. A synthetic mechanical OR fixture proves the
gate and attendance without adding a runtime clinical case.

Final focused domain35/35, affected player26/26, balance164/164, seven workspace
types pass. Final full domain5235pass/27knownfail/1skip. Exact-source Level5
CHECK `M2-verified` equals M0/M1:29663commands/6601005cents/459completed/0walkouts,
tick27653,XPgoaltick15550; elapsed412.590s. Actual procedural control rerun also
passes. Earlier pre-presentation receipts are
retained as diagnostic history, not claimed as final verification. No evidence
or pins rewritten; no perf-owned files changed.

### M3 implementation design

At the existing scored clock, an eligible current adult APP patient becomes the
consult actor instead of spawning a duplicate. Preserve published clinical
profiles, fixed authored identities, actual provider/room and one service fee.
APP/patient hold the room; founder opening vacates the APP to the suite exit,
then takes the clinician stool. Closing unanswered returns the APP and retains
the consult. Answer-and-close releases the APP visit and permits the patient's
existing diagnostic/follow-up flow; implicit feedback close must also release.
The APP returns to its room, with seat exchange respecting physical occupancy.
Do not let another scored chart yield a held consult's room.

Provisional editorial work policy: new routine APP-family visits95minutes,
adult offered cadence90minutes (pediatric90 and combined wound/ostomy90).
Actual provider training reduces work10% per level above1 and actual clinic
upgrade5% per level above1: level5/5 work46minutes plus travel, faster than
offered demand; basic work95 plus travel is slower. Retain existing per-home
two-patient backpressure. Freeze accepted work at first reservation with optional
versioned metadata; older frozen visits keep their accepted duration. Measure
offered versus admitted demand, real queues and throughput before accepting.

M4 extends the same handoff to existing exact pediatric family contexts and a
curated exact-concept wound/ostomy affinity. Scheduled pediatric presentations
must be compatible from birth; retain the physical parent/pair during scored
conversion. Specialty preference shares the ordinary scored budget, respects
FSRS and active concept reservations, and cannot create a question flood.

### M3 implementation, measurement and integration discoveries

Same-person adult APP consults, stool exchange, close-unanswered return and
answer-and-close release are implemented. Diagnostic feedback's implicit chart
close also releases the APP while preserving the patient's ordered next step.
Actual age/sex, appearance and name survive conversion; authored fixed identities
are never renamed. New optional `clinic-work.v1` quotes bind the actual provider
and actual room once, preserving legacy frozen durations and revenue contracts.
Training/upgrade descriptions include their additional routine-work reduction.

Focused domain20/20 (including3 new APP tests), affected player4/4, balance165/165
and all7workspace typechecks pass. A frozen M3 runtime overlay lets full-suite
validation continue without reading subsequent M4 edits. Its first full run:
5228pass/37fail/1skip.27 are baseline;10 are this milestone's integration effects:
old timing/count pins in pediatric/wound tests4; old colleague-name presentation
assumption1; two old blanket on/off case comparisons2; mixed-clinic stranded
pediatric queue1; ordinary-services starvation1; expected income despite an
unanswered now-blocking consult1. These are being fixed/retested, not accepted
as additional baseline failures.

Public fixture initial M3 measurement at both Levels4/5:9,11,10 scored charts/day,
basic adult consults5,6,7; trained4,7,6. Basic total seated waiting835–863actor-
minutes over3days versus5trained/upgraded; zero walkouts. Actual basic specialty
queues remain capped per home; trained work46minutes is faster than90-minute
offered demand. Founder assistance can shorten a consulted basic visit.

First M3 CHECK (before integration repairs):27861commands/3240485cents/434completed/
0walkouts,tick25967,XPgoaltick14985. This is diagnostic history, not final M3
acceptance. The denser queues exposed a real cross-stream bug: APP queues were
counted against the separate general-service two-waiter cap, starving MRI (one
paid MRI over48measured hours; -$21/hour). APP demand already has its own per-home
cap, so exclude it from that unrelated cap. A private M3-only repaired overlay
also permits displaced patients whose original home room was sold to use the
next free compatible APP instead of waiting behind perpetual home queues.
`M3-repaired` CHECK is running without M4 specialty policy/content affinity.

The old invariant tests need an explicit new flow witness: an actual in-service
patient narrows selection to that person's existing published profile/context.
Every candidate in such a pool must be independently accounted for by that
source; RNG purpose, release definitions, learning, scored count/times remain
equal. Identical inputs must still select identical cases, and unrelated service/
retail counters are perturbed in replay checks. The historical released-control
24/24 blanket identity assertion predates same-person consults; retain24arrivals
and24 identical-input replay proofs, and report actual cross-arm flow differences.
Do not silently claim the former unqualified identity invariant still applies.

### M4 implementation and initial measurements

New pediatric visitors use existing exact published child/art/parent contexts
before any question is selected. Conversion retains the physical family and pair
reservation, removing the factory's temporary duplicate parent. Wound/ostomy
affinity uses ten explicit existing concept IDs, not keyword matching or invented
clinical teaching. Both use M3's actual APP/stool handoff and saved work quote.
Namespaced entries in the existing validated `lastServiceAppointmentTicks`
record space each specialty by300game minutes within the ordinary scored budget.
No new GameState root key or cloud-ownership change is required; old saves omit
these clock entries safely. An initial separate-root-map design failed the
cloud ownership type contract; removed that unshipped map instead of editing
the perf worker's cloud files. Strict optional visit/consult leaf metadata remains.

Initial actual M4 public measurements at Levels4/5: basic pediatric2,2,1charts/day,
wound/ostomy1,2,1; trained pediatric2,1,2,wound/ostomy1,1,1. Total scored chart
counts remain9,11,10; zero walkouts. These are current-content source consults,
not synthetic questions. Final metrics rerun follows the generic-service queue
repair and adds first-consult delays and answered-node counts.

### M3 closing verification

The repaired, isolated M3 source passes5239domain tests with the same27baseline
failures and1skip (210files). M4 specialty tests were absent/excluded from this
milestone control. Balance165/165, affected player4/4, seven workspace types pass.
Its final CHECK is30862commands/6483886cents/477completed/0walkouts,tick28737,
XPgoaltick15574. The private frozen M3 overlay contains only M3 plus the two
service-queue integration repairs; it does not enable M4 specialty selection.

### M4 late integration repairs and closing verification

Real-command room-sale/reload regression exposed a consult blocking its own
replacement clinic reservation. Exclude only that operation's own encounter
from scored-room claims; other scored patients still block correctly. Founder
handoff waits until the re-reserved APP/patient are actually in service, so it
cannot divert an approaching APP before care begins. While paused, the chart
reports waiting for clinic capacity and its question is unavailable. A visit
already staffed and answered finishes on close even if its room was interrupted;
it does not restart95minutes of care. Both regressions fail before the repair
and pass after it, including reload and once-only payment/departure. Busy firing
and occupied-door removal were investigated first; their existing command
guards correctly reject those actions and were not relaxed.

Final new domain regressions15/15 (5adult APP,4specialty,5procedure,1MRI queue).
Final full domain5245pass/27baselinefail/1skip in211files. Balance165/165;
all7workspace typechecks pass. Safe player hooks6/6;82/82 affected text/tutorial/
inspector tests pass after five stale expectations were updated. The tutorial
guided physical wait is150 rather than151minutes after M1 adjacent attendance;
its frozen service duration, review records and4x ratio remain asserted.

Unmodified official Level5 generator passes CHECK and its low/high/lower report
assertions:31656commands/6979051cents/491completed/0walkouts,tick29476,
XPgoaltick14580. Its35private progress writes were captured in memory; all
canonical writes were prohibited. Read-only lower-retry assertions also pass.
An independent run of the unchanged public driver has identical totals. Final
source hashes match the frozen verified inputs. M0 and final clinical source
bytes are identical; no clinical/test-choice-order/evidence files changed.

Final public3day controls: scored9,11,10/day in all arms. L4basic pediatric2,1,1
and wound1,2,2; L5basic pediatric2,1,2 and wound1,2,1. Trained/upgraded at either
level: pediatric2,1,2 and wound1,1,1. First pediatric/wound consults at131/263
minutes after the ready fixture. Endoscopy2,0,2; live OR0(content gap); supported
staff control4,3,3/day. Final basic seated waiting894(L4)/955(L5)actor-minutes
over3days, versus26trained/upgraded; per-home caps hold and no measured walkouts.

Initial full player4070pass/10fail:4known baseline failures,5own stale expectations
(three upgrade strings and two tutorial timing pins), plus one transient failure
in the perf-owned phone inspector test. Current focused and entry-domain/entry-VM
inspector controls both pass4/4; no renderer/perf edits were made. Final full player
rerun is finishing; its exact result will be recorded in the research handoff.
Optional native boundary check could not spawn Git in the sandbox. With the perf
lane's existing read-only tracked-path capture adapter, both unmodified boundary
and launcher checks pass(19196paths); no Git process was executed.

Final full player:4078pass/4baselinefail in420files,920.45s,native1. All five
lane-owned stale expectations now pass; the transient perf inspector failure
did not recur. Baseline failures remain breadButterPresentation,
chartStructuredFields,levelFiveRoomsViewModels and cloud/separateCampaign.
No new feature failure remains. Concurrent perf tests explain the change from
the earlier4080-test run to4082tests; no perf source was edited by this lane.

M0–M4 domain milestones are closed for manager review, with M2's clinical OR
supply limitation explicit. Final report: `docs/research/founder-consult-pathing-20261110.md`.
It contains all owned files, exact validation output, per-day frequency/queues,
finance/checkpoint attribution, nineteen changed bound runtime inputs, save
compatibility and the Level4 invariant test scope change. No evidence rebind.
Next action belongs to the manager: review/port/rebind if accepted; assign live
OR/phase-linked content and physical desktop/phone visual QA separately. No
renderer implementation hunk is currently outstanding; existing hooks are
provided and tested. This local worker task stops here after the scope audit.

Closing scope audit passes:46owned code/test paths (16new),19changed bound
runtime inputs,560captured clinical paths unchanged,test-choice-orders unchanged,
23protected evidence/launch JSON paths unchanged. All19runtime hashes still
match M4-verified and M0/final clinical snapshots are byte-identical. No own code
changed after validation. The audit records15preserved foreign existing paths;
it does not claim ownership of the perf worker's new files/assets. Ten existing
test entry byte snapshots were unavailable for a portable patch; their exact
entry/current hashes and current files are identified rather than fabricating
before hunks. `owned-diff-missing-before.json` makes that limitation explicit.

## Round 2 — retained QA chart attendance, manager return

Reopened this lane for the manager's actual M10 launch-unmet browser finding.
No agents/Git/network/renderer-perf/cloud/content/evidence edits. Read current
instructions, prior plan/report/current handoff, manager script/screenshot.
Captured50round-2 before files under `round2/before` before implementation.

Reproduced the manager trace exactly from `createLevelFiveLaunchQaState` with
ordinary close/open/resume/tick commands: tick3704Sophia is offsite and pending;
founder41,26→36,26→46,26→39,26→36,26→50,28→38,26; patient absent, then14,32,
34,32,25,27,then23,28waitingchair. At3824+ the chart is action-required on its
second decision, founderActivity and pendingFounderConsult are null, and patient
assigned room.economy.waiting. Exact raw trace: `R2-pending-entry/qa-trace.json`.
The earlier probe that opened only after results at3805did acquire attendance,
which isolates opening time as causal rather than a renderer discrepancy.

Entry causes: reducer.ts3504–3507returns early during diagnostic work without
pending attendance;8964–8982retries only an existing pending marker/source.
Offsite/onsite return completion7602–7649chooses waiting even for an already-open
chart. Post-procedure3550–3586also chooses a completed suite for the founder
alone, whereas an ordinary completed-result review belongs in an exam room.
Retail actorCanStart220allows attend_encounter as idle and369clears attendance
when buying, another real interruption path to protect. Existing indefinite
attendance at reducer.ts7242–7251does not itself time out or start wandering.

Round-2 contract: an open live chart is durable attendance intent; patient-
present diagnostic work/return owns movement until safely complete, then route
from the actual tile to exam (or adjacent stand without a room) without another
click. Existing exam reservations must also redirect stale waiting journeys.
Only actual live intra-source metadata authorizes suite attendance; completed
result reviews use exam care. APP/specialty stool exchange, staff adjacency,
and already-operating founder behavior remain unchanged. Automatic idle/retail
cannot preempt attendance; a queued/unavailable room retries deterministically.
No teleporting offsite actors or interrupting real diagnostic/service resources.

Next: failing exact-fixture headless regressions (pending, returning, result-
ready, every available source type), common attendance recovery and retail
priority repairs, affected poses/anchors tests, full required validation and
fresh Level5 CHECK. Append round2evidence/results to the research handoff.

### Round-2 implementation and closing evidence

Reproduced all reported coordinates exactly. The script fell back to Sophia's
pending/offsite chart at3704; result2appears only after3805. Idle walks continued,
then coffee at3745–3764cleared the idle activity and returned the founder to38,26.
There was never an attendance marker. An open live chart is now durable intent;
after real diagnostic return, the founder is at the exam by3814and patient by3824,
without another click. Headless tests assert semantic bed/chair roles too: this
retained exam uses the same coarse50,25tile for its separate native contacts.

Also repaired completed-procedure reviews going to the old suite alone; retained
patient routing when reusing an exam claim; premature answer-time founder
release; retail/idle preemption; and pediatric routing from doorless hallway
tiles. Native pediatric furniture routes remain exact. Staff/intra-source and
already-operating-founder rules pass existing and expanded tests. Only three
runtime bound inputs change this round:reducer,pediatric-family,retail-operations.
No save fields/schema, balance, driver, clinical, cloud or perf production edits.

New exact-M10 player matrix7/7 +staff physical hold1/1. Focused domain112/112 in
6files. Final full domain5250pass/27knownfail/1skip in212files,565.87s. First full
run's three own stale answer-time expectations were corrected and the full suite
rerun. Balance165/165 in25files,3.35s. Full player4074pass/17fail in422files,
911.64s:4baseline +13new stale readiness predicates in the protected question
save-compat test file. Those tests demand front-desk placement after a result;
the owner now requires the exam. A private single-predicate overlay passes33/33
with every clinical/save/journal/FSRS assertion intact. Exact review hunk in
`round2/question-save-readiness.diff`; asynchronous manager approval requested
because an earlier brief reserves that file to the question lane. Source file
is unchanged while approval is pending. Do not label those13as baseline failures.

Closing root types:6workspacespass;clinical-content has9foreign TS2353 errors in
the concurrently added N4 evidence draft (basisClaimIds/accessMethod/licenseUrl/
termsUrl). The earlier root run before that file appeared passed7/7. Current
domain/player types pass; no foreign source was edited or ignored.

Official and independent Level5 CHECKs bothpass34420commands/7310006cents/
533completed/0walkouts,tick32073,XPgoaltick14938. Versusround1:+2764commands,
+330955cents,+42completed,0walkoutdelta. Actual runtime clinical data hash is
identical to round1 (1143cases/1454nodes/608concepts); new N4 source drafts are
not admitted into it. No evidence/rebind; official40progress writes captured in
memory. Report includes finance and every checkpoint delta. Cumulative20changed/
new bound runtime inputs (round1nineteen plusretail-operations).

Runtime repair is complete for manager review and original5184browser recheck.
Remaining gates:protected test-owner readiness hunk and foreign N4 typing; no
renderer hunk is required by the headless pose contracts. Private round2scope
receipt lists12owned code/test paths(4new),54cumulative code/test paths,exact
hashes and preserved foreign additions. No Git/install/network/agent/deploy.

## Round-2 release follow-up - manager approval

Manager browser recheck passes Sophia: both actors reach the same exam room and the patient pose is `exam-table`. Manager explicitly authorizes the prepared readiness-only correction in `apps/player/src/questionShipSaveCompatibility.test.ts`, overriding the earlier question-lane restriction for that hunk only. Applied the common `ready()` predicate to require the examination room for returned results as well as ordinary decisions. All frozen content/save/journal/FSRS assertions remain unchanged. N4 drafts remain outside ownership.

Next: native focused protected tests, full domain and balance, full player with threads, root typecheck, fresh Level 5 CHECK, and measured economic attribution versus the current release pin 29,663 / 6,601,005 / 459 / 0. No runtime or evidence changes are intended in this follow-up.

### Release follow-up completion

Manager browser recheck passes Sophia (both actors in exam; patient exam-table).
The authorized question-lane readiness predicate is applied and native 33/33
passes; full player now4087pass/4knownbaselinefail (422files,882.09s), resolving
all13new stale failures. Updated only its exact postimage hash in the existing
18-row source migration; all preimages/other pins/guard assertions unchanged.
That source guard passes7/7. A broader optional audit remains282pass/2older
source-capture mismatches, identical in a read-only pre-edit control; no unrelated
perf codec capture or other clinical guard was relaxed.

Full domain5250pass/27knownfail/1skip (212files,589.45s); balance165/165
(25files,2.23s); all7workspace typechecks pass, including closing rerun. N4 draft
files untouched; the prior9type errors are absent in the writer's current state.
Fresh official and independent Level5 CHECK both34420/7310006/533/0 with identical
checkpoints/finance/activity to acceptedR2. No canonical writes/rebind. Versus
manager's current29663/6601005/459/0 pin: +4757commands/+709001cents/+74completions,
0walkouts. Driver runs4420minutes (+15.9838%) longer; completions+16.1220% therefore
mostly reflect a longer playthrough. Adult APP visits229 -> 350 at unchangedfees
are the largest direct service gain; queues/handoffs change room/source pools and
goal timing. Exact ledger reconciliation and equal-time3day controls are in the
report's release-follow-up section; scored arrival budget remains30/3days.

This follow-up edits one approved player test, one exact guard-hash field and
three coordination documents, zero runtime/Level5 inputs. All20cumulative lane
runtime hashes match freshCHECK; 23evidence/launchJSONs and test-choice-orders
unchanged. Approval/patch/validation/scope receipts: `.local-dev/founder-consult-pathing-20261110/release-followup/`.
Task closed for manager release integration/rebind; no Git/install/network/agents/
deploy or owner-pathway change. Preserve other workers' drafts/perf work.

## Round 3 - checkpoint chart visibility and departing-chart review

Manager port-30 browser finding: integration-l4 phone density has no waiting/active card after the helper closes the open chart; launch-unmet sometimes releases founder attention while the patient exits. Audit exact live/release checkpoint bytes and ordinary bootstrap load/close/ticks before changing runtime. Prove every in-flight encounter remains in its correct chart list across load and ticks, including APP/specialty source actors and diagnostic returns. Verify completed/discharged summary review separately from active chart attendance. Preserve clinical/N4, evidence, cloud and renderer/perf files; no agents/Git/network/install/rebind. Add real-checkpoint domain/player headless regressions, repair only demonstrated defects, repeat full validation and CHECK, append round-3 report.

Entry finding: live canonical checkpoint tick3704 has two pending-result encounters and one completed summary; GS-release rebound checkpoint tick3850 has ten filed completed encounters and one completed acknowledged summary. Their serialized inputs are different before any loader runs. Need trace CLOSE_CHART and chart archival/openability, then make the QA density setup independent of a transient active-arrival assumption without changing clinical simulation demand.

### Round-3 diagnosis and implementation

No in-flight load loss: old saved Sophia Young and Leah Lane survive with frozen
cases/answers unchanged in pre-lane M0, actual port-30 release code, and current
code. Both remain in Existing Patients through120ticks; Sophia becomes actionable
when her result returns, Leah remains pending. Ethan Kingston is already fully
answered/acknowledged; helper CLOSE files him, after which his actor exits.
Rebound source checkpoint tick3850 has10resolved records and only Lily Clay's
completed, acknowledged summary. The helper files her, producing exactly
Waiting0/Existing0/Resolved11 before any tick. Different saved journey inputs
explain the density regression; migration/selectors did not remove live cases.

Found one narrower review gap: OPEN_CHART rejected even already-resolved charts
while their actors were leaving. Allow the ordinary read-only resolved branch
in that case; keep arrival/nonterminal departure guards and all actor movement.
Open historical reviews remain pinned by existing retirement rules; founder is
free because the encounter is already filed. Open unfiled summary still holds
exam attendance until CLOSE. Added Resolved-folder fallback only to phone density
card selection, preserving its real phone click/dialog/overflow/target assertions.
No fake new arrivals or canonical checkpoint rewrite.

Retain original public Sophia snapshot as the release manager already does, and
retain exact port-30 rebound integration-l4 snapshot as test data. Current QA
constructors plus both retained snapshots are tested for both entrypoints.
New pre-fix focused tests: domain9pass/2fail, player6pass/2fail, all four failures
are outgoing resolved-chart opens. After fix: focused domain36/36 in3files,
17.35s; player15/15 in2files,19.50s. Balance165/165,2.70s. One own implicit-any
in the new test was corrected; root typecheck then all7pass. Playwright --list
resolves all4phone density tests; no browser executed in worker sandbox.

Full domain/player and read-only official CHECK are running. CHECK source
snapshot R3-official freezes released clinical1143cases; concurrent clinical
index/manifest/synthetic/timing edits began afterward, so preserve/classify those
foreign changes. Stable actual-release-code and current-domain/released-clinical
probes are in round3/probe-{release,fixed}.json. Next: collect complete native
suite outputs, classify every failure, check official totals vs34420/7310006/
533/0, close scope, append round3research/current handoff. No rebind.

### Round-3 completion

Exact release-code reproduction proves the empty phone list comes from the
rebound saved input: ten filed charts plus Lily Clay's completed acknowledged
summary. Closing the summary produces Waiting0/Existing0/Resolved11 before a
tick. The same old saved Sophia/Leah encounters remain in Existing under
pre-lane, released and current code through120ticks, including first-load/raw
identity and frozen-answer checks. Ethan's old summary files normally. No
migration or list-filter repair was necessary.

Fixed historical chart review during discharge: resolved records can open
read-only without recalling the actor/founder/provider, and stay open after
the body exits. Unfiled summaries still hold attendance until actual close.
Density test uses its real Resolved card when no active/waiting card exists,
with all dialog/control/overflow assertions intact. Eight owned code/test/data
paths, five new. The release already has the original Sophia retained JSON
and helper adjustment; preserve them while porting the new hunks/test data.
No renderer/perf/cloud/clinical implementation or persistence/schema change.

Focused final released-content regressions36/36domain (3files,19.93s),15/15player
(2files,26.20s). Full native domain5261pass/27knownfail/1skip (213files,570.91s);
balance165/165 (25files,2.70s); full native player4094pass/5fail (423files,891.24s).
Four are known baselines. The fifth is a measured concurrent clinical epoch
mismatch in the real module-worker view comparison: only learningCards.length
608 vs610 differs; gameplay state and all other view fields match. Unchanged
isolated worker repeat1/1pass (12.53s); no guard or deadline relaxed. All seven
closing typechecks pass. Phone density Playwright listing resolves4tests;
actual browser recheck belongs to manager.

Read-only official Level5CHECK matches current release34420/7310006/533/0 with
zero deltas. All eight printed checkpoint tick/XP/phase triples and report scores
match. Only reducer.ts is a newly changed Level5bound input this round; no rebind
or canonical writes. Captured clinical runtime1143cases/608concepts hash01d239...
is stable; later foreign clinical acceptance edits are preserved and classified.
All23protected evidence/launchJSONs unchanged. Full report appended round3;
receipts under `.local-dev/founder-consult-pathing-20261110/round3/`. Stop this
bounded milestone for manager re-port/browser recheck/source binding. No Git,
install/network/agents/deploy or release-tree writes.

## Accepted N4 runtime integration - 2026-11-10

Manager accepts round3 and authorizes the exact eight accepted N4 definitions'
domain integration. Add the incision meaning to wound affinity while retaining
venous ulcer; spread the eight approved future-planned diagnostic tuples into
the exact order registry. Prove all four accepted OR and both endoscopy cases
bind to real procedures. Exclude intra-procedure cases from ordinary automatic
clinic arrivals, without imposing a manifest gate or rewriting frozen saves.
Measure the same Level4/5 operational controls with accepted 1151/1462/610
content; compare to the earlier zero-OR-consult baseline and run official CHECK.
Clinical content, protected evidence, renderer/perf/cloud and GS-release are
read-only. No agents/Git/network/install/rebind. Capture scoped entry bytes and
hashes in `.local-dev/n4-runtime-integration-20261110/`, add domain regressions,
run focused then full domain/balance/player threaded suites and seven root
typechecks. Confirm stable 610-card parent/worker agreement. Record exact bound
inputs, consult rates, totals, failure classifications and any limits in the
research/current handoff; manager owns release integration/rebinding.

### Accepted N4 integration complete

Installed one wound meaning (retaining venous ulcer) and the exact eight
approved future-planned order tuples. Ordinary automatic arrivals now exclude
the same classified intra-procedure cases that require actual care sources.
No save/reopen gate or clinical edit. Nineteen new regressions: pre-edit source
overlay12fail/7pass, final all19pass; focused4files36/36. Every accepted OR and
endoscopy case binds to a real ongoing procedure, holds through reload/answer
until close, then completes once. Both wound cases use actual wound visits;
legacy unsourced frozen charts still reopen. No renderer/perf/cloud edits.

Three-session operational controls with a normally hired receptionist, at
both Levels4/5: intra-op4,1,2 per600-minute operating day (previously0,0,0);
endoscopy2,0,2. Raw no-receptionist endoscopy control also retained: founder
away from counter produces eight awaiting-staff charts and capacity backlog;
real hire restores throughput. No question/demand/fee/duration tuning.

Full domain5280pass/27knownfail/1skip (214files,562.39s); balance165/165
(25files,3.36s); player4104pass/4knownfail (424files,863.76s); closing seven
typechecks pass. Nine accepted-N4 frozen/source/journal player witnesses pass.
Unchanged operational-worker exact state/view/hash test passes with610 cards
in both parent and worker; prior608/610 source-epoch mismatch resolved by the
stable accepted registry, with no guard/projection edit.

Official CHECK28601/6227467/445/0, versus frozen entry27080/6098464/420/0
and GS-release34420/7310006/533/0. Exactly three runtime source deltas between
entry/final: clinic-consult-topics, test-choice-orders, reducer. First different
arrival at3125 is an actual wound-source versus APP-source question; added
incision affinity expands existing wound cases14->19/profiles20->23. Later
care/goal timing extends this isolated journey1478ticks; ledger+729400 gross,
-16275 consumables,-584122 operating =+129003 closing cents. No rebind or
canonical writes; all23 protected JSONs unchanged. Research handoff:
`docs/research/question-n4-domain-runtime-integration-20261110.md`. Scoped diff,
commands, failures, stable hashes and source controls are in
`.local-dev/n4-runtime-integration-20261110/`. Stop for manager port/review/rebind;
preserve all foreign source changes. No Git/network/install/agents/deploy.
