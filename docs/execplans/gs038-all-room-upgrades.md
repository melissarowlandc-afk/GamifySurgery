# GS-038 - All-room upgrade implementation

## Active implementation contract - October 7

The owner explicitly requested: "Let's implement all of these upgrades to the
game." This accepts the complete simple table below, including the revised
Examination and Reading values/prices, and authorizes implementation. Earlier
planning-only/pending-approval statements below are historical and superseded.

- Implement the 22 purchase ladders for currently playable room types. Front
  Desk, Hallway and retired Imaging Control have no purchases. Store the nine
  approved future ladders as inert catalog metadata; their base rooms, services,
  progression and Founder's Office artwork remain separate future work.
- Four purchases increase a room from Level 1 to Level 5. Percent bonuses add
  against the base: revenue +6/12/18/24%; time/decay reductions 10/20/30/40%.
  Point bonuses add directly and respect existing satisfaction/morale bounds.
- Replace generic clinic-wide upgrade satisfaction and arbitrary per-upgrade
  workload/speed claims with the accepted room-specific benefits. Preserve base
  workload, existing training-room passive capacity, staff/seat/bed limits, base
  upkeep and existing per-upgrade upkeep. Examination purchases add no capacity;
  admitted patients are never evicted by a capacity recalculation.
- Attribute revenue and patient experience to an actual room used. Do not stack
  all copies of a room. Preserve once-only payment and satisfaction witnesses.
  Paid manual laboratory processing is separate from nonbillable diagnostic
  processing. Pharmacy procurement training remains separate from gross sales.
- Freeze room revenue and timed-work modifiers when new work is accepted/bound
  to its room, preserving old quotes and already queued/active/scheduled work.
  New optional save fields must load old campaigns without changing investment,
  history, completed phases, staff identities or duplicate receipts.
- Combine independent employee and room percentage modifiers multiplicatively.
  Retain fractional durations where the existing clock contract supports them;
  use a positive minimum and test execution/preview agreement. Do not shorten
  offsite interpretation or unrelated diagnostic phases.
- Preserve concurrent GS-034 timing, GS-037 training and Claude presentation.
  Re-read shared files before narrow edits; inspect current diffs. No messages
  to other chats, owner-save access, dependency installs, art generation, commit,
  push, merge, publication or launcher/origin changes are authorized.

### Implementation milestones and ownership

1. Sol upgrade_runtime_map: bounded read-only payment/room-use mapping.
2. Sol worker: approved balance catalog, reusable room-upgrade helpers and
   focused numerical/compatibility tests; explicit file ownership at dispatch.
3. Sequential Sol worker: actual payment, experience, environment/support and
   timing/training integrations with frozen-save and gameplay regressions.
4. Sequential Sol worker: truthful player upgrade descriptions/cost/total/next
   benefits and focused player tests, preserving concurrent UI work.
5. Parent: inspect actual task-relative diffs, independently validate focused
   domain/balance/player tests, types, boundaries/build and isolated browser
   evidence; update handoff and report the local-only checkpoint.

Workers share the tree and preserve unrelated changes. No recursive delegation,
durable-plan edits, installs, external messages or publication by workers.

Acceptance: all current purchased upgrades affect their agreed execution point;
no exam capacity increase, diagnostic fee duplication or bonuses from unused
rooms; old and new saves and purchase-during-work preserve frozen contracts;
ordinary appearance/layout and canonical owner pathway remain unchanged.

Status: COMPLETE. All current-room implementation milestones are accepted;
future ladders remain inert. Final evidence and inherited validation limits are
recorded below. M2 accepted after actual baseline-relative patch review and independent
parent rerun: 7 balance files / 66 tests and balance typecheck PASS. M3A revenue
is accepted after actual frozen task-relative patch review and parent rerun:
9 focused files / 201 tests and domain typecheck PASS; worker final expanded
cohort: 13 files / 259 tests, including32 revenue cases. Revenue snapshots bind
once to actual earning work; legacy quotes and nonbillable processing survive.
Evidence: .local-dev/gs038-room-upgrades/revenue/baseline-relative.patch and
review.json. Parent also independently reran the final32 revenue cases: PASS.
Sol upgrade_runtime_map stopped writes. M3B support is accepted after parent
review of support-owned.patch and attribution.json plus an independent rerun:
8 files / 180 tests and domain typecheck PASS. All six support effects preserve
frozen and legacy work; the task clock and physical-arrival regressions pass.
Concurrent seating/wander/profiling changes are preserved and excluded from the
owned patch. Sol upgrade_catalog stopped writes. M3C patient experience and
Bathroom decay is accepted after parent review of the exact eight-file owned
patch, review.json, original-acceptance and actual-room witnesses, and an
independent rerun: 16 files / 364 tests and domain typecheck PASS, including
44 experience cases. Existing procedure/diagnostic fixtures are unchanged.
Sol upgrade_runtime_map stopped writes. M3D Reading is accepted after the final
forecast correction review and independent full-domain/private validation below.
M4A UI is accepted. M4B and its bounded test-only corrections are frozen,
reviewed and accepted after the complete desktop/phone rerun and visual review.
All worker writes are stopped. The canonical GS-037 test and protected product
source remain unchanged by those corrections. Baseline payment/support
checks: 4 files / 37 tests PASS. Bounded Astra
reading_upgrade_review completed its read-only clock/save review; the resulting
decision below is accepted for implementation, not yet runtime-complete.

### Reading clock decision from bounded review

New local interpretation uses exact base5 × room multiplier × saved radiologist
category multiplier before rounding, minimum1 minute for a new complete job.
Resumed remaining work can be below1 and must not be reclamped. Existing orders
retain saved durations. Keep facilityTick and ordinary travel integer. Widen
only diagnostic work/forecast/marked-service time validators to bounded finite
numbers, retaining strict integer grid/index/source-baseline validation. Project
legacy pending-result and continuation carrier clocks with ceil.

Add a narrow deterministic Reading completion/start drain: a prior actual read's
exact end can start already accepted, dependency-ready work with the same reader
and station continuously available. No carry across walking, interruption,
training absence, room sale, other duty, idle gaps or different stations. This
permits a backlog of4.5-minute reads to finish logically at4.5/9/13.5, observed
at whole game minutes5/9/14. Do not complete work merely from a forecast. Prove
shuffle-independent scheduling, reload and no-carry exclusions. Isolated results
still become visible at the following whole game minute; no global clock rewrite.

Read-only execution probes confirm the old loop quantizes fractional backlog
to5/10/15 and changes completion/training order when operations are reversed.
At the finished-current-task boundary, an otherwise eligible queued training
request with a reachable free global place takes priority over another read;
requests without a place keep working. A narrow shared eligibility helper must
reuse existing FIFO/capacity/reachability/current-duty rules in training and
Reading reservation/forecast. Never advance countdowns or travel twice.
The separate paid manual income.image_read service is minimum facility Level4
metadata with a30-minute baseline. Preserve it unchanged and exclude it from
this current playable diagnostic5-minute Reading integration and carry drain.
Bounded Astra approved Sol's concrete design with seven required corrections,
accepted by the parent and saved in
.local-dev/gs038-room-upgrades/reading-prep/astra-design-review.md: observing-tick
training priority for the whole due-reader cohort; stable private departure
earmarks; inherited continuity through drain bookkeeping; matching projected
forecast boundaries; cross-carrier readiness/witness validation and exact v1
base5; integral reconstructed walking; coherent unbound alternate-room quotes.
Sol must implement and prove these before the actual Reading patch review.

M3D source frozen at 2026-10-08T01:01Z:70 new Reading cases pass; the expanded
17-file domain cohort is407/409. The two failures are unchanged roster-identity
assertions in reading-stations.test.ts that expect the former four-appearance
pool; they do not test the physical four-reader hiring cap. The separate actual
hire/unique-station/fifth-rejected proof passes1/1. Do not call that whole cohort
PASS. Parent inspected the exact reading-owned.patch and attribution, and
independently reran four room-effect suites217/217 plus domain types PASS at
21:15EDT. Execution/save formula, binding, subminute continuity, training claims,
integer walking and legacy/manual exclusions have reviewed evidence.

Bounded Astra actual frozen-patch review found two confirmed P2 forecast
defects: queued calendar insertion uses factory-created order instead of the
executor's readiness/original-acceptance order; subsequent predicted Reading
completions omit later training departure opportunities. Reading acceptance
remains pending both corrections and actual review/independent regressions.
Sol upgrade_catalog completed its read-only concrete design and stopped reads.
Parent and bounded Astra approved a shared comparator, separate Reading lane
and coherent chronological completion-cohort projection under
reading/review-corrections/design.md. The projection
must retain hypothetical FIFO seat claims, keep other forecast-busy readers
busy until their own boundary, release the whole cohort and avoid real training
state/countdown mutation. Late factory/shuffled order and departure/return
regressions must compare exact forecasts with execution. Astra additionally
requires deep clone isolation of operationCompletions (nested maps/forecast/
quote), registry and projection; replay drops prior derived Reading/training
reservations from a fixed baseline. Prospective readiness stays private and the
selector receives the boundary's projected clock/locations/committed duties.
Actual non-Reading duties remain distinct from speculative calendar bookings.
The tiny service-operations.ts shared-comparator delegation hunk is approved;
actual execution and save semantics remain unchanged. Correction source writes
were dispatched to Sol upgrade_catalog after M4A explicitly stopped all source/
test writes at approximately01:40UTC. It is the sole active source writer;
Initial correction froze at22:21EDT:five files585add/67delete; Reading90/90,
17files429/429 and domain types PASS; types/persistence unchanged. Parent
reviewed the actual projection/comparator/helper/test hunks and attribution,
and independently ran the actual private clone/replay probes3/3 PASS. Bounded
Astra found two remaining P2s: a carry token overrides a valid preferred
reader/station, and raw marked endpoints leak fractions into ordinary manual
Reading forecasts. Parent full domain completed96files3153/3155; the two
failures are unchanged GS028 CT busy-Reading queue assertions. Read-only
pre-correction transforms pass both, proving new presentation loss: private
dependency-ready90/91 becomes future-boundary220/221, erasing130min queue.
At22:31EDT Sol upgrade_catalog was authorized one final tiny forecast-only
correction in diagnostic-timing.ts and Reading tests:match effective preferred
choice for carry, round/recheck ordinary acquisition boundaries, and retain
original private readiness/queue for returned forecasts. No generic controller,
clinical/data/test batch, save or UI edit is authorized. Fresh evidence belongs
under reading/review-corrections/final-review/implementation. Source writing is
again single-worker; M4B has stopped. Parent full-domain rerun and tiny actual
Astra review follow this stop.
Final two-file correction froze at22:42EDT:62add/9delete, six before failures
and Reading96/96 after PASS; expanded435/435 and unchanged CT2/2 PASS. Parent
read the actual complete delta and protected-source attribution. Bounded Astra
approved with no additional finding and verified current/after/protected hashes.
Parent independent final private probes5/5, all-workspace types and isolated
production build PASS at22:44EDT. The ordinary manual controller's existing
reserve5/start6 lag remains explicitly outside scope. Parent final full-player
run111files844/845 retains only the same independently proven inherited label
assertion; no other player failure. Parent final full-domain rerun completed
96files3157/3157 PASS, exit0, in221.29s. This completes M3D acceptance with the
actual two-file review, bounded Astra approval, private5/5, types and build.
Final QA preview PID32436 owns4193; owner's4173 PID29880 is preserved. Both
desktop upgrade cases timed out at the same test-harness bridge-readiness wait
(room-upgrades.spec.ts:67); the DOM already rendered the intended paused fixture.
Parent stopped verified task-only Playwright runner55212 instead of spending
the remaining phone timeouts. Sol upgrade_runtime_map owns a test-only diagnosis/
correction, then parent reruns four upgrade cases and existing diagnostic/
training/build browser regressions plus visual inspection. Build output is
task-private, not a deployment or backup.

### Experience and support integration decisions

Sol's bounded experience read-only map is accepted. Waiting freezes the first
actual used room after physical arrival and observed waiting; award once after
the first physical care action, or immediately before final completion/walkout.
This allows waiting losses to occur before the bonus instead of wasting it at
an initial score100. Examination binds/awards at the first accepted decision
with the patient and attending Founder physically present in that actual exam
room. Arrival/reservation/chart opening alone does not prove examination. Record
zero and capped attempts too; reopening, room copies, excursions and reload do
not reset a category witness. No historical-use reconstruction for old saves.

New Recovery work carries an optional original-acceptance room quote through
all factory carriers, binds at actual Recovery phase start, and awards once at
completion before resource release. Preparation has no Recovery bonus. Legacy
unmarked work retains its old contract. Update current/final satisfaction only;
never repeat cash, XP or learning settlement. Bathroom multiplies only its
existing per-encounter completion soil loss and retains fractional cleanliness.

M3B also owns a necessary narrow clock correction: ordinary employee task
advancement must skip level-three break/repair/QI tasks, whose existing support
controller already advances them. Real ADVANCE_TICK regressions must prove one
countdown per minute and the once-only completion effect. No global clock,
diagnostic timing, support-capacity or travel changes belong in that correction.

### Presentation integration audit

The remaining generic runtime tier references are base-plus-zero workload and
service-speed fields, upkeep/investment, persistence and alert guidance. The
purchase reducer already rejects non-buildable legacy rooms; the next-cost
selector needs the same gate. Replace Build Mode's shared satisfaction copy
with catalog per-room current/next benefits. Existing room-upgrade complaint
guidance in domain facility-alert-conditions.ts and player alertViewModels.ts
must target current satisfaction-benefit rooms only, so revenue-only rooms do
not promise patient comfort. Keep old recorded alert history. Ordinary rendered
room finishes and tier furnishings must respect catalog appearanceChanges;
current rooms retain their base art and upgrade stars. Preserve Claude's menu,
groups, lettering, Doors and Undo behavior. Adapt the obsolete generic benefit
assertion in build-mode-usability.spec.ts and add isolated purchase/reload proof.
Fractional diagnostic durations need concise player formatting rather than raw
floating-point interpolation. Active training should describe its frozen room
duration; queued/unassigned training must not promise an invariant60 minutes.

Sol upgrade_runtime_map completed read-only M4 preparation and stopped reads.
The parent reviewed .local-dev/gs038-room-upgrades/ui-prep/findings.md and
accepted its narrow ownership, catalog-driven labels/totals, current-only cost
and comfort-alert gates, frozen training labels, integer-compatible fractional
formatting, real Phaser renderer probes and one-shot synthetic browser fixture
strategy. Refresh implementation baselines after M3D stops; preparation hashes
are not a write baseline. M4 source writes remain sequential after the Reading
writer stops. Once the parent inspects the frozen patch and independently checks
the core domain cohort, M4 may overlap the bounded read-only Astra review of
Reading: their source ownership is disjoint. There is still only one writer.
M4A source/unit/real-renderer implementation was dispatched to Sol
upgrade_runtime_map after the217-case parent core check. It owns only the
prepared presentation, current-cost/comfort filters and appearance gates plus
the existing browser assertion/screenshot-directory option. No new browser
fixture belongs in M4A. After its bounded write stop, authorize the Reading
forecast corrections as sole writer; parent UI review can proceed read-only.
M4A worker final evidence:12 player files248 tests,6 domain files200 tests,
player/domain types and boundaries PASS. Parent reviewed the exact source gates,
catalog totals/prices, frozen training/duration copy, actual renderer tests,
comfort/history tests, retired resale and browser screenshot-routing hunks.
Independent parent rerun at21:39EDT:248 player and200 domain tests plus player
types PASS. M4A accepted after parent review of the preserved-concurrent.patch:
six satisfaction-display rounding lines remain intact outside the608-add/
133-delete owned patch. The21:36 after-owned boundary is explicitly reconstructed
by reversing those exact six strings in the private01:39 observation; no claim
that a standalone raw historical after-image survived. Eleven protected hashes
refer to that pre-Reading observation. All source/test/private evidence writes
stopped. Existing Claude whitespace outside the owned hunks is preserved.
The chart precision test uses a deliberately fractional legacy/custom wait;
M4B will add an actual marked Reading chart assertion as well as purchases.
M4B scratch-only preparation stopped at21:54EDT with five native cases PASS.
Parent reviewed findings.md, the actual pure fixture and all five preflight
assertions. Real admission, valid connected geometry, four reader posts,
original paid fee/Reading/training contracts and strict reload are covered. The
actual marked maximum Reading product1.7999999999999998 displays1.8 min for
Interpretation while the whole ETA remains10 min because of patient return.
The17-file observation attributes the sole changed hash to the authorized
Reading writer; the other16 were unchanged. Preparation is accepted, with no
shared source/test edits or browser/server runs. Later M4B write ownership is
the new room-upgrades browser test/pure fixture and exactly one actual marked
Reading chart assertion in diagnosticTimingViewModels.test.ts. Its two browser
cases use ordinary My Rooms/menu/Undo/patient-chart controls, exact cash,
capacity/admission/copy preservation and a one-shot synthetic save installer.
At22:14EDT parent narrowed M4B to these three test-only targets, disjoint from
the Reading helper/forecast/domain-test lane, and authorized its shared writes
alongside the remaining Reading regressions. Reading retains sole production
runtime ownership; both briefs explicitly forbid cross-lane edits. Browser
launch and final acceptance wait until both writers stop. This supersedes the
earlier fully serialized M4B coordination rule. Reading acceptance still
requires actual correction review and all final evidence; overlap does not
waive it. Final QA uses a fresh4193 preview/context and never the owner's4173
storage; build output stays within the repo via ../../.local-dev/gs038-room-upgrades/dist.

Parent final stable balance-package suite at21:42EDT:7files/66tests PASS; do not
repeat absent catalog changes. Final domain/player/types/build/browser work
follows the remaining corrected source milestones.
M4B froze at22:21EDT:three test-only targets584add/0delete, focused67/67,
player types and four Playwright listed executions PASS. Parent inspected the
full pure fixture, ordinary purchase/menu/Undo/MAX/reload controls, one-shot
guard, exact cash/contracts/admitted patient/copy/capacity checks and actual
marked chart hunk. Browser acceptance remains pending the isolated4193 run.
Parent full player111files844/845:sole failure is the existing outside-thyroid
pendingLabel assertion. The exact pre-M4A viewModels.ts read-only transform
reproduces the identical failure; preserve it as unrelated, with no test/UI
change. Parent all-workspace types PASS. Standard boundary command hits Git
ENOBUFS with10553 tracked paths; an ignored preload raises ONLY git ls-files -z
buffer to64MiB. The unchanged original boundary rules and launcher checks PASS;
both standard failure logs and buffered success are preserved. No checker
source change or filtered path inventory is involved.

Actual browser acceptance: production intentionally removes FacilityCanvas's
DEV-only facility-gait-proof host hook. The initial long readiness timeouts
were a QA server-mode mismatch, not an invalid fixture or bridge shape. Sol's
helper-only correction8add/1delete reports that missing hook within10s and
retains separate bounded room readiness; all real canvas clicks and gameplay
assertions remain. Parent read the complete patch, hashes and diagnosis;
worker67 focused tests/types/four listed executions PASS. No product source
changed. The production diagnostic browser cohort completed10/10 PASS (desktop
and phone quotes, collection/payment-once, legacy reload, endoscopy milestones).
Production Build Mode completed its upgrade/Undo/menu checks, then failed an
unchanged stale assertion atline210 requiring retired Imaging Control access;
the identical assertion is in the exact pre-M4A test baseline. Preserve it.
Parent replaced only verified task preview32436 with hidden Vite DEV34484 on
the same4193 test origin (HTTP200); owner4173/29880 remains unchanged. DEV
upgrade run passes satisfaction purchases/Undo/MAX/reload on desktop and phone
2/2. Reading2/2 fails before any upgrade because the helper expects all four
idle-post support markers. The real fixture/actual support-resolver probe proves
all four distinct station assignments; active reader.2 is correctly seated at
northeast, while idle reader.3 has completed a route away from southeast and
correctly lacks that current-seat marker. Parent reviewed the complete probe.
Sol is authorized to assert exact preserved four-reader assignments, live IDs
and the actual frozen active reader's anchor/support/seat, without forcing idle
seating or changing fixture/runtime. Fresh test-only patch/protected hashes and
types/focused checks precede parent rerun. Existing four-reader/queue/reload
browser cases pass2/2. Existing
Management training passes; the furniture test fails only array iteration order
while both exact employee/stool/pose/direction/visibility records match. Shared
GS-037 test remains unchanged. An authorized task-private copy normalizes only
the two actor records' array order, changes the helper import and redirects
the output path to GS038 private evidence; all exact gameplay assertions and
later milestones remain. Parent runs its original full case to validate reload/
completion without overwriting GS-037 evidence. Phone training cases intentionally
skip. Desktop/phone satisfaction captures were viewed: benefit/MAX copy is
readable and Waiting furnishings match before/after.

Final M4B acceptance: parent read the exact65add/15delete active-reader patch,
the private original-training replay's four path/order substitutions, and the
final31add/0delete visual-only patch. The replay completes all three employees
atLevel2/tick144 with exactly$250 paid once and no failures,1/1 PASS; canonical
training test stays unchanged. Reading work is3minutes atLevel5, while its
pending55minute estimate includes earlier acquisition dependencies and is not
misrepresented as a3minute ETA. The final spec waits on existing actual
room/character texture readiness and a later Phaser frame, then reopens the
actual pending chart through its ordinary patient tab. No fixed sleep, product
hook, fixture teleport, clock advance or weakened gameplay assertion was added.
Parent final complete upgrade rerun4/4 PASS (desktop/phone both cases), exit0,
2.9minutes, recorded in browser/parent-upgrades-visual-final-browser.log. Parent
viewed the final fully loaded phone Reading before/after and desktop/phone
pending-order screens; furnishings match and timing/benefit text is readable.
Earlier fully loaded desktop Reading and satisfaction/MAX views also passed
visual review. Parent independently rehashed all13 protected observed files:
zero drift. All implementation/source/test/private worker writes are stopped.
Task-owned DEV34484 was verified and stopped after acceptance; prior production
preview32436 was already stopped. Owner4173 remains PID29880, same origin/profile.

Integrated result: balance66/66, domain3157/3157, all-workspace types, private
clone/replay/rounding probes5/5, production build, original buffered boundary
rules and launcher checks PASS. Upgrade browsers4/4, production diagnostic
browsers10/10, existing Reading-cap/reload browsers2/2, existing Management
training1/1 and private full training replay1/1 PASS. Full player844/845 retains
the independently reproduced old thyroid-label assertion; original Build Mode
retired-Control assertion and original training array-order assertion also
remain recorded. They are not hidden or claimed as whole-suite passes. This
task is complete with those explicit unrelated assertion-maintenance limits.
No commit/push/deployment/publication/new clinical content or owner-save access.
The valuable live checkpoint is LOCAL ONLY. Say "push to GitHub" for an audited
scoped backup; unrelated archived checkpoints do not back up these live edits.

### M3C review corrections

Parent's initial source review found and returned two corrections to Sol:
Waiting awards at service start must exclude remote diagnostic processing and
require a physical room phase; staged Recovery phase remapping must occur after
the accepted frozen phases replace factory phases. Sol incorporated both.
The custom accepted Recovery-ID reload test additionally proves an existing
staged factory trainingTiming mismatch. The parent authorized clearing the new
automatic training marker when original carrier phases replace factory phases,
preserving their accepted work. Optional station semantics may be preserved
where needed for a nondefault valid Recovery ID. No current staff-bonus replay
or historical acceptance reconstruction is permitted.

### Final QA preparation

After Reading and presentation stop writing, parent will run integrated balance,
domain and player tests, types, boundaries and an isolated production build.
Vite root is apps/player: the build output argument must be
../../.local-dev/gs038-room-upgrades/dist (two parent directories). Three would
escape the repository. Port4193 was checked free during preparation; verify it
again before launching a hidden task-owned preview. Planned QA origin is
http://127.0.0.1:4193 with fresh synthetic browser contexts and separate storage.
Do not use the existing owner4173 server or stop other servers. Canonical owner
playtest remains START_GAME.cmd -> http://127.0.0.1:4173 in the same profile.
Existing diagnostic/training browser cases plus the new upgrade cases should
exercise purchase, Undo, reload, frozen work, four Reading positions, capacity,
and ordinary room appearance on desktop and phone. Inspect resulting captures.
Task-relative patches/hashes and validation logs stay under this task's
.local-dev evidence directory. The integrated checkpoint remains local only
until the owner explicitly requests an audited GitHub backup.

## Simple owner-review table - October 7

The owner found the original tables/document too complicated and requested
exactly three columns: room, a brief numerical benefit, and the four upgrade
prices. Use this table as the discussion entry point. Detailed inventory below
is supporting reference; its earlier proposed directions are superseded by this
simpler table. The owner subsequently accepted all unchanged rows and requested
two corrections: Examination upgrades improve satisfaction rather than patient
capacity, and Reading Room upgrades reduce scan-reading time. Gameplay
implementation was subsequently authorized by the explicit request recorded above.

Each listed benefit is per purchased upgrade. Prices are Levels 2 / 3 / 4 / 5.
Current-room prices are retained from the existing catalog as a starting point.
The owner accepted the benefits/prices of the 32 unchanged rows, including all
nine clearly marked future-room rows. Examination's existing prices remain.
The revised +2 Examination satisfaction points, 10% reading-time reduction and
new Reading Room price sequence below are now accepted for implementation.

| Room | Benefit per upgrade | Cost: Levels 2 / 3 / 4 / 5 |
| --- | --- | --- |
| Front Desk | No upgrades recommended | — |
| Hallway | No upgrades recommended | — |
| Examination Room | +2 satisfaction points after examination | $90 / $140 / $210 / $300 |
| Waiting Room | +2 satisfaction points for waiting patients | $110 / $170 / $250 / $360 |
| Bathroom | 10% slower cleanliness loss | $70 / $110 / $170 / $250 |
| Minor-Procedure Room | +6% procedure revenue | $220 / $330 / $480 / $680 |
| Ultrasound Room | +6% ultrasound service revenue | $240 / $360 / $525 / $715 |
| X-ray Room | +6% X-ray service revenue | $190 / $280 / $400 / $560 |
| CT Suite | +6% CT/CTA revenue | $400 / $600 / $880 / $1,200 |
| Phlebotomy Station | +6% specimen-collection revenue | $140 / $210 / $305 / $415 |
| Environmental-Services Closet | Cleaning takes 10% less time | $120 / $180 / $260 / $360 |
| Endoscopy Room | +6% endoscopy revenue | $365 / $545 / $800 / $1,090 |
| Peri-op/Recovery Room | +2 satisfaction points after recovery | $225 / $340 / $495 / $675 |
| Training Room | Training sessions take 10% less time | $165 / $245 / $360 / $490 |
| Coffee Kiosk | +1 staff morale point from daily coffee | $125 / $190 / $275 / $375 |
| GLP-1 Telehealth Suite | +6% telehealth revenue | $300 / $450 / $660 / $900 |
| Ambulatory OR | +6% operation revenue | $600 / $900 / $1,320 / $1,800 |
| In-house Laboratory | +6% paid laboratory-processing revenue | $450 / $675 / $990 / $1,350 |
| Pharmacy | +6% pharmacy sales revenue | $300 / $450 / $660 / $900 |
| Maintenance Workshop | Repairs take 10% less time | $200 / $300 / $440 / $600 |
| Staff Break Room | +2 staff morale points per break | $225 / $340 / $495 / $675 |
| Surgeon's Office | Quality reviews take 10% less time | $175 / $265 / $385 / $525 |
| Vending Machine | +6% vending revenue | $115 / $170 / $250 / $340 |
| Radiology Reading Room | Scan reading takes 10% less time | $450 / $675 / $990 / $1,350 |
| Imaging Control Room (retired) | No upgrades | — |
| MRI Room (future) | +6% MRI service revenue | $600 / $900 / $1,300 / $1,800 |
| Pediatric Waiting Room (future) | +2 satisfaction points for waiting families | $150 / $225 / $325 / $450 |
| Pediatric Examination Room (future) | +2 satisfaction points after visits | $150 / $225 / $325 / $450 |
| Wound/Ostomy Clinic (future) | +6% clinic service revenue | $250 / $375 / $550 / $750 |
| Founder's Office (future) | +2 staff morale points; improved office appearance | $300 / $500 / $750 / $1,000 |
| Executive Office (future) | Administrative work takes 5% less time | $500 / $750 / $1,100 / $1,500 |
| Gift Shop (future) | +6% gift sales revenue | $200 / $300 / $450 / $600 |
| Indoor Garden (future) | +2 satisfaction points for visitors | $200 / $300 / $450 / $600 |
| Staff Gym (future) | +2 staff morale points after gym use | $250 / $375 / $550 / $750 |

Call Room remains removed. Ordinary room appearance/layout stays fixed; only
the future Founder's Office includes an appearance change. Revenue means income
from work completed in that room or its supported outlet, not unrelated clinic
income. In-house Laboratory bonuses apply only to its paid processing work;
GS-034 diagnostic/pathology processing remains nonbillable. The owner requested
a new Reading Room upgrade modifier for its onsite interpretation phase; the
agreed 5-minute base remains the Level 1 baseline. Acquisition, offsite reading,
collection, processing, pathology, procedure and recovery phases are unchanged
by this correction. Preserve the four approved reader positions and their queues.

Accepted revised-row details: +2 satisfaction points per Examination purchase,
up to +8 at Level 5, attributed to a patient who actually receives examination.
Examination upgrades must not add patient capacity. The existing base room
workload contribution is a separate mechanic, not modified by this planning
correction. For Reading, use an additive reduction of 10% of the base phase per
purchase: 10/20/30/40% at Levels 2/3/4/5. From the current 5-minute baseline,
the raw proposed times are 4.5/4/3.5/3 game minutes before employee effects or
rounding. The $450/675/990/1350 purchase sequence is a new proposal using the
existing Laboratory ladder as a comparable starting point, now an approved
Reading Room price. Do not add a new upkeep charge by inference.

Read-time rounding/minimums and interaction with GS-037 radiologist training
must be resolved in a bounded implementation plan so each purchase provides
an actual benefit. Already frozen/active/scheduled work retains its contract;
new upgrades must not restart or retroactively shorten a study. Do not edit
GS-034's ongoing timing implementation or message it without owner authorization.

GS-037 has now received owner approval to implement active employee training and
short role-specific benefit labels. The proposed room modifier affects training
session duration, not the employee's learned bonus. Its integration must follow
that task's accepted session rules and preserve already-started training.

These are accepted primary upgrade benefits. The active contract above resolves
replacement/stacking and preserves upkeep, saved investment, frozen work and
admitted patients. Future-room ladders are catalog metadata until those rooms
have base operating behavior; they introduce no new runtime capability.

## Goal and status

Implement the accepted simple upgrade table for every currently playable room,
with truthful player descriptions and compatible saves. Record approved future
ladders without enabling unbuilt rooms. Initial inventory and discussion draft:
October 7, 2026; implementation explicitly authorized the same day.

## Requirements and constraints

- GS-011-030: ordinary upgrades change function while retaining approved
  appearance and layout. The future Founder's Office is the recorded visual
  exception. It is distinct from the currently playable Surgeon's Office.
  Confirm the desired office function and visual progression with the owner.
- A room may need no upgrades. Select an effect first, then decide how many
  worthwhile purchases it supports. Existing five-level configuration is a
  baseline, not a requirement for every future design.
- Keep upgrades separate from additional room copies, employee training,
  facility progression, routine cleaning and repairs, and artwork redesign.
- Respect GS-034's accepted diagnostic timings and resource rules. Do not edit
  its implementation or silently apply previously advertised speed percentages.
- Respect GS-037's ownership of employee training behavior. Room upgrade
  questions belong here; underlying sessions, qualifications and employee
  benefits remain with that task until its design is accepted.
- Preserve concurrent GS-036 goals, GS-035 patient-flow guidance, GS-028 clinical
  content, GS-029 alerts, and GS-033/Claude artwork and motion. No messaging of
  other chats is authorized. Their status may be read.
- Preserve frozen encounters, queued/scheduled work, employee identities,
  clinical review status, concept IDs and FSRS, and existing upgraded saves.
- Numerical game settings are editorial balance values, not clinical facts.
  No clinical teaching or medical evidence is authored by this planning task.
- Base fees, salaries, ordinary upkeep, arrivals and broad economy tuning stay
  outside scope unless the owner explicitly chooses them.
- Code/balance/save-schema changes for the approved upgrades are authorized.
  Art, owner saves, launcher, origin, commit, push, merge, deployment and release
  changes are outside this request. Canonical owner pathway remains
  START_GAME.cmd -> http://127.0.0.1:4173 in the same persistent browser profile.

## Repository state and investigation

- Shared branch: beta. Hundreds of dirty/untracked paths include balance,
  reducer, selectors, staffing, persistence, player UI, clinical content and art.
  Existing edits were inspected read-only and are concurrent user/task work.
  Never reset, stash, revert, clean up, or broadly stage this tree.
- Read the root AGENTS.md, current handoff, project board, GS-011 owner-feedback
  record, room and staffing catalogs, upgrade selectors/reducer/UI, Level 3/4
  design plans, approved layouts, income catalog, support operations and
  GS-034's facility-diagnostic-timing.md.
- No descendant AGENTS.md was found under docs, packages, or apps/player/src.
- Normal shell and node_repl startup failed with sandbox helper_unknown_error.
  Narrow read-only shell escalation succeeded. No UI automation was needed.
- GS-034 is active: central balance definitions and four reading-staff positions
  are present, while diagnostic execution/UI integration remains in progress.
  A catalog entry is not evidence of completed gameplay acceptance.
- GS-037 is active and discussion-first. It confirmed a passive +1 routine
  workload slot from an operational Training Room and no existing active
  training sessions. Employee trainingLevel is stored; the two-person practice
  bench is an approved visual design, not an approved session-capacity rule.

## Existing upgrade system

New rooms start at Upgrade Level 1. Twenty-one currently buildable room types
offer four sequential purchases, to Levels 2-5. Front Desk, Hallway and the new
Reading Room have no purchases. Legacy Imaging Control Room metadata retains
old tiers, but new construction and upgrades are rejected.

Purchasing an upgrade charges its configured price and increments the saved
room level immediately. Hourly upkeep increases with each purchased level.
There is no implemented construction delay or tier-specific service unlock.

The following shorthand is used in the table:

- **G**: every purchased level of any non-hallway room contributes +1 to the
  completed-encounter satisfaction bonus, capped at **+3 across the clinic**.
  The cap is shared, not +3 per room. After it is filled, another purchase
  does not increase this bonus. The calculation includes all non-hallway room
  instances, rather than only rooms used by that encounter.
- **W**: +1 routine workload-limit slot per purchased level where configured.
  This raises the clinic's active-patient ceiling; it does not add a chair,
  examination station, bed, staff position, or simultaneous procedure.
  Current room workload contribution is not gated on operational status.
- **S5 / S8**: configured and advertised 5% / 8% service-time reduction per
  purchased level. The selector computes these values, but no runtime consumer
  was found. They must not be presented as an executed benefit or applied to
  GS-034's fixed phases without a separate owner decision.

Room upkeep is accrued per game minute from hourly rates and posted periodically,
despite the legacy field name upkeepPerExpenseInterval. Upgrade investment is
included in the existing 25% resale calculation. This does not make an upgrade
profitable or authorize changing the refund policy.

Staffing limits are separate from upgrade level. Current room-capacity code uses
fixed staff positions: one receptionist; one mobile imaging-tech position per
built imaging room; one phlebotomist per station; one EVS worker per closet;
two peri-op nurses per recovery room; one endoscopy nurse and one endoscopist
per endoscopy room; two NPs per telehealth suite; two surgeons per Surgeon's
Office; one OR nurse, lab technician, pharmacist, or repair person in their
respective room; four radiologists per Reading Room. An upgrade does not add
positions. Additional copies retain their separately configured build caps.

The current upgrade dialog still promises improved finishes/fixtures and generic
speed. Those descriptions conflict with the owner's stable-appearance decision
and the missing speed consumer. Correcting that copy is a future concrete
implementation item, not a change made during this review.

## Settled earlier owner decisions

| Decision | Accepted requirement | Evidence and boundary |
| --- | --- | --- |
| Ordinary appearance | Upgrades retain approved room appearance/layout. | GS-011-030 in the owner-playthrough record; no new artwork or footprint changes here. |
| Founder's Office | Sole recorded room with upgrade-dependent visual changes. | Future Level 5 room; tier count, appearances and functional benefits remain open. Do not apply the exception to Surgeon's Office. |
| Imaging access | Retire the control-room prerequisite; imaging techs share reachable modalities through ordinary doors. | GS-020 handoff and current catalog; older facility-design prose is superseded. |
| Reading Room | Level 3, approved 4x4 design, all four workstations; one active read and queue per radiologist. | GS-034 plan and October 7 design receipt. Build $1,800; upkeep $24/hour; radiologist hire $300 and salary $26/hour. Runtime integration is ongoing. |
| Diagnostic phases | Bladder scan 30 external / 5 local, with no radiologist. Other covered imaging interpretation 30 external / 5 staffed local. | GS-034; preserve existing acquisition/procedure durations unless owner explicitly changes them. |
| Laboratory phases | Covered labs 120 wholly external; 15 collection +60 external processing or +15 staffed local processing. Pathology 60 external /30 staffed local. | GS-034; one job at a time per collector/processor, with queues. These are game minutes. |
| Endoscopy | Visual result at the procedure milestone; sampling requires pathology. Preserve prep30 / procedure45 / recovery60 for current new physical operations. | GS-034 and completed peri-op work; old frozen contracts stay intact. |
| Estimates and fallback | Answer choices include queues and walking. Missing/nonfunctional required resources use a valid external route; busy installed resources queue. | GS-034 owns calculation/execution/UI. Upgrades do not imply a shortcut around missing staff. |
| Staff capacity | Real positions determine staff and concurrent work. Two peri-op nurses per recovery room and four readers per Reading Room are settled. | Room-capacity plan and GS-034. Do not gate approved existing reading positions behind upgrades. |
| Training artwork | 3x3 skills lab with a two-person practice bench. | GS-037 current readback. Active training behavior remains under discussion there. |
| Call Room | Removed from Level 4; does not fit the ASC. | Owner decision October 7 in Level 4 design/facility notes. Do not restore it. |
| Patient flow | Manageable flow with useful quiet periods; no arrival/reward/FSRS tuning requested. | GS-035 owner resolution. Workload upgrades must not silently change arrival cadence. |

## Complete current-room review table

**C** = existing code/configuration; **A** = earlier accepted decision;
**P** = a proposal for discussion, not a selected effect. Dollar sequences are
the current costs of the four purchases **U2 / U3 / U4 / U5**, not proposed new
prices. Added upkeep is per purchased level. Building and operational
requirements are distinguished where they differ. Every P row still needs an
owner choice of effect, extent, prerequisites, tiers and cost, or no upgrades.

### Public areas and core clinic

| Room and scope | C: build / hourly base upkeep; prerequisites and base function | C: current upgrades and effects | A: applicable decision | P: proposed direction | Open item |
| --- | --- | --- | --- | --- | --- |
| Front Desk, L0 (`room.front_desk`) | Free starting room /$6; protected entrance; one receptionist position. Founder runs desk until staffed. | No upgrades. | Approved room stays fixed; existing check-in/water automation is separate. | Keep complete when built; no paid tiers. | Confirm no room upgrades. Receptionist training belongs to GS-037. |
| Hallway, L0 (`room.hallway`) | $35/tile /$0; requires Front Desk; access infrastructure. | No upgrades. | Preserve circulation and appearance. | No tiers. Building more hallway is expansion. | Confirm no upgrades. |
| Examination Room, L0 (`room.examination`) | $160 /$6; requires Front Desk; examination capability, Founder work. | $90/140/210/300; +$1/hr; G,W,S5. | Stable art/layout; clinical meaning/eligibility stays reviewed separately. | Retain workload as the starting candidate. Alternatively choose consultation efficiency or a specifically reviewed service expansion. No extra stations implied. | Which primary benefit? Extra workload may increase pressure without adding provider capacity. |
| Waiting Room, L1 (`room.waiting`) | $350 /$7; requires Front Desk; real fixed waiting seats and base workload contribution. | $110/170/250/360; +$1/hr; G,W. | Existing seating/occupancy preserved; desired manageable flow. | Workload capacity or reduced waiting-related satisfaction loss, using unchanged seats. | Capacity, comfort, or no upgrades? Define whether comfort replaces or supplements G. |
| Bathroom, L1 (`room.bathroom`) | $225 /$4; requires Front Desk; patient bathroom trips and amenity benefit. | $70/110/170/250; +$1/hr; G only. | Fixed layout; routine cleaning remains a separate activity. | Slower cleanliness decline, or no upgrades. This would need a new room-specific modifier. | Is reduced cleaning burden worthwhile? No additional toilets or exact decline rate selected. |

### Diagnostics and the retired control room

| Room and scope | C: build / hourly base upkeep; prerequisites and base function | C: current upgrades and effects | A: applicable decision | P: proposed direction | Open item |
| --- | --- | --- | --- | --- | --- |
| Ultrasound Room, L1 (`room.ultrasound`) | $950 /$16; reachable equipment and mobile imaging tech for supported scans; exact procedure/provider rules remain authoritative. | $240/360/525/715; +$2/hr; G,S8. | GS-034 acquisition/interpretation separation and fixed bladder/procedure times. | Equipment reliability or no tiers; retain agreed times. Reliability would extend maintenance beyond its current Level 3 rooms. | Does imaging need a maintenance mechanic, a separately agreed acquisition benefit, or no upgrade? |
| X-ray Room, L2 (`room.xray`) | $750 /$14; reachable equipment + imaging tech; supported X-ray/contrast studies. | $190/280/400/560; +$2/hr; G,S8. | GS-034 interpretation30 external /5 local; ordinary door access. | Same diagnostic policy as Ultrasound; do not apply S8 automatically. | Choose together with the other imaging rooms. |
| CT Suite, L2 (`room.ct`) | $1,600 /$26; reachable scanner + imaging tech; supported CT/CTA acquisition. | $400/600/880/1200; +$3/hr; G,S8. | GS-034; separate acquisition and reading resources. | Same diagnostic policy; no extra scanner or tech position from tiers. | Would this room justify a different benefit/cost from X-ray and Ultrasound? |
| Phlebotomy Station, L2 (`room.phlebotomy`) | $550 /$9; build requires Front Desk; one phlebotomist position; collection/send-out capability. | $140/210/305/415; +$1/hr; G,W,S5. | GS-034 collection15; one draw per phlebotomist. It is not a processing lab. | Retain workload candidate while preserving collection time; otherwise defer upgrades until a distinct benefit is selected. | Should workload remain? Capacity means additional real positions/copies, not faster external processing. |
| In-house Laboratory, L3 (`room.laboratory`) | $1,800 /$24; Front Desk + operational lab technician; existing separate paid processing queue and maintained equipment. | $450/675/990/1350; +$3/hr; G,W,S5. | GS-034 diagnostic processing15 /pathology30; diagnostic work is nonbillable. Existing manual paid60-minute processing stays separate. | Longer intervals between equipment maintenance, possibly retain W; do not change agreed diagnostic processing times. | Reliability benefit and shared technician-queue interaction; exact values and costs undecided. |
| Radiology Reading Room, L3 integration in progress (`room.reading`) | $1,800 /$24; Front Desk; up to four staffed approved reading positions. | No upgrades. | All four stations and reading5 already approved in GS-034. | No tiers initially; hiring readers supplies real concurrency. | Confirm no upgrades. Final runtime acceptance belongs to GS-034. |
| Imaging Control Room, legacy only (`room.imaging_control`) | Old saves only; non-buildable, no capabilities or upkeep. | Legacy metadata $90/140/210/300 and S5; purchases rejected. Retain saved level. | GS-020 retirement; no required access relationship. | Keep retired and compatible. No upgrade plan. | Existing paid levels must not be deleted or repurposed. Any compensation policy would require a separate owner choice. |

### Procedures and patient recovery

| Room and scope | C: build / hourly base upkeep; prerequisites and base function | C: current upgrades and effects | A: applicable decision | P: proposed direction | Open item |
| --- | --- | --- | --- | --- | --- |
| Minor-Procedure Room, L1 (`room.minor_procedure`) | $800 /$15; build requires Examination; Founder/provider and exact service rules; no peri-op-nurse room requirement. | $220/330/480/680; +$2/hr; G,W,S5. | Preserve approved exact work contracts, fees and clinical room gates. | Workload candidate or improved between-case readiness, without shortening approved clinical work. A turnover phase would be new behavior. | Does workload suffice? New services require separate exact clinical/operational approval. |
| Endoscopy Room, L2 (`room.endoscopy`) | $1,450 /$24; build requires Examination; operation needs Recovery, endoscopy nurse, and Endoscopist or Founder. | $365/545/800/1090; +$3/hr; G,W,S5. | Prep30 /procedure45 /recovery60 and specimen/visual distinctions preserved. | Workload or between-case turnover benefit; no altered procedure/pathology/recovery times. | Is a distinct turnover mechanic desired? No hidden second procedure station. |
| Peri-op/Recovery Room, L2 (`room.periop_recovery`) | $900 /$16; build requires Examination; approved individual beds, nurses and queues support Endoscopy/OR. Two peri-op nurses per room. | $225/340/495/675; +$2/hr; G,W,S5. | Preserve bed identities, active reservations, prep/recovery and physical-care clearance. | Workload or a room-specific comfort benefit within current physical capacity. | Comfort vs workload vs no tiers; no extra beds or shorter clinical-care phases assumed. |
| Ambulatory OR, L3 (`room.ambulatory_or`) | $2,400 /$36; requires Recovery; OR nurse + Surgeon or Founder, and peri-op support. Maintained equipment. | $600/900/1320/1800; +$4/hr; G,W,S5. | ASC scope and GS-036 goals remain separate. Founder is a valid physician, not a nurse substitute. | Equipment reliability, possibly retain W; fewer maintenance interruptions without changing approved operation work. | Reliability vs workload; effect values, freeze rules and repair interaction to settle. |

### Staff, support and offices

| Room and scope | C: build / hourly base upkeep; prerequisites and base function | C: current upgrades and effects | A: applicable decision | P: proposed direction | Open item |
| --- | --- | --- | --- | --- | --- |
| Training Room, L2 (`room.training`) | $650 /$8; Front Desk; operational training capability passively adds one clinic workload slot. No active sessions yet. | $165/245/360/490; +$1/hr; G only; passive base slot does not scale with tier. | Approved 3x3 two-person practice bench; GS-037 owns employee-training design. | Decide upgrades after GS-037 settles training: session efficiency/access within real positions, or no room tiers. Employee learning stays separate. | GS-037 dependency; no active session capacity, speed or qualifications approved here. |
| Environmental-Services Closet, L2 (`room.evs_closet`) | $475 /$6; Front Desk + one EVS worker position; existing cleaning/litter support. | $120/180/260/360; +$1/hr; G only. | Existing manual routines and room appearance preserved. | Better cleaning equipment reduces time per cleaning job or improves cleanliness restoration. | Pick one primary effect; interaction with employee training; exact values/costs pending. |
| Maintenance Workshop, L3 (`room.maintenance_workshop`) | $800 /$10; Front Desk + one repair-person position; existing repair tasks. | $200/300/440/600; +$1/hr; G only. | Repairs are routine work, distinct from purchasing upgrades. Current maintained rooms are OR, Laboratory and Pharmacy. | Reduce actual repair-task time through room tools. | How does this stack with equipment reliability and trained repair staff? No retroactive change to active repairs. |
| Staff Break Room, L3 (`room.staff_break`) | $900 /$10; Front Desk; real break seats and existing morale recovery. | $225/340/495/675; +$1/hr; G only. | Preserve approved seats, layout, break ownership and cooldown behavior. | Improve morale gained from a completed break, or no tiers. | Choose morale gain vs break duration; prevent stacking with Coffee/Garden/Gym into guaranteed maximum morale. |
| Surgeon's Office, L3 (`room.surgeon_office`) | $700 /$8; Front Desk; two surgeon positions and existing administration/QI support. | $175/265/385/525; +$1/hr; G only. | Ordinary-room appearance stays fixed. This is not the future Founder's Office. | No tiers initially, or a specifically desired administrative/QI efficiency effect. | Is administration a useful player-facing upgrade? Do not add surgeon slots or clinical outcomes by assumption. |

### Retail and telehealth

| Room/buildable and scope | C: build / hourly base upkeep; prerequisites and base function | C: current upgrades and effects | A: applicable decision | P: proposed direction | Open item |
| --- | --- | --- | --- | --- | --- |
| Coffee Kiosk, L2 (`room.coffee_kiosk`) | $500 /$5; Front Desk; stock-cost retail and an existing once-per-day clinic coffee morale effect. No assigned staff role. | $125/190/275/375; +$1/hr; G only. | Existing retail travel/transactions and base fees preserved. | Stronger capped coffee morale effect, or no tiers; ordinary appearance stays fixed. | Morale vs transaction efficiency; multiple kiosks must not multiply a clinic-wide daily bonus unintentionally. |
| GLP-1 Telehealth Suite, L2 (`room.glp1_telehealth_suite`) | $1,200 /$12; Front Desk; two NP positions; existing staffed remote automation. | $300/450/660/900; +$2/hr; G only. | Real staff eligibility remains required; no XP/FSRS/clinical encounter from the automated income task. | Consider more completed-consult throughput within actual NP positions, or no tiers. | Owner must choose any cadence change; fees, staffing caps and broad payouts stay unchanged by this draft. |
| Pharmacy, L3 (`room.pharmacy`) | $1,200 /$16; Front Desk + one Pharmacist; supported retail/authorized supply transactions and maintained equipment. | $300/450/660/900; +$2/hr; G,S5. | Pharmacist required; no medication-selection or clinical-rule changes. | Faster transactions or equipment reliability; do not invent new medication services. | Choose the useful bottleneck; stock costs/base fees and clinical authorization stay separate. |
| Vending Machine, L3 (`room.vending`) | $450 /$4; Front Desk; stock-cost food/drink transactions; no assigned staff role. Catalog models this buildable as a room. | $115/170/250/340; +$1/hr; G only. | Approved appearance and current transactions preserved. | No tiers initially; consider a specific reliability/service benefit only if wanted. | Does a meaningful upgrade exist beyond the shared G bonus? No restocking or stock-capacity mechanic assumed. |

## Future/preview/design-only inventory

These nine room types are absent from the current playable roomDefinitions.
Level 4 is preview and Level 5 is future planning; catalog fee/operation metadata
does not establish a buildable room, accepted room cost, or executable service.
All new construction costs, upkeep, upgrade prices, tier counts, numerical
effects and staffing capacity are **unsettled**. Known future semantic IDs below
are references only; no new runtime ID is invented for an unnamed design.

| Room / current scope | Existing or accepted design/metadata | Operational prerequisite boundary | Proposed upgrade effect | Costs / open items |
| --- | --- | --- | --- | --- |
| MRI Room, L4 preview (`room.mri` reference) | Future income/operation row; next art-design target in Level 4 plan. No playable room definition. | Imaging tech + acquisition equipment; readings separate. Future timings are not settled by applying current S8. | Follow the selected imaging policy, or no tiers. | All room/upgrade costs and effects pending; coordinate future design ownership. |
| Pediatric Waiting Room, L4 design | Accepted room category; no current runtime definition. | Real seats and reachable access; do not infer new staff role. | Child/family comfort within fixed approved layout, or no tiers. | Base design, benefits and costs pending; avoid duplicating general Waiting bonus. |
| Pediatric Examination Room, L4 preview (`room.pediatric_examination` reference) | Future APP consultation metadata; pediatric release point needs an operational room. | Reviewed clinical content and authorized provider rules; metadata is not approval. | Selected Examination policy with pediatric-specific workflow/comfort if useful. | Service/provider scope, benefits, capacity and costs pending. No new clinical content here. |
| Wound/Ostomy Clinic, L4 preview (`room.wound_ostomy` reference) | Future service/supply metadata and accepted release-point category. | Exact reviewed provider/action rules; peri-op nurses do not staff this clinic. | Supply/workflow efficiency or comfort, without inventing clinical capabilities. | Base design and actual service bottlenecks first; all numerical upgrades pending. |
| Founder's Office, L5 design | Owner-approved category and sole upgrade-dependent visual exception. No current room definition or mapped founder-office seat. | Separate founder use/benefit and future room design; not Surgeon staffing. | Appearance-only progression, or function plus appearance, according to owner's choice. | Confirm desired function and visual progression; then tiers and costs. No art generation here. |
| Executive Office, L5 design | Accepted category and future Executive role; no implemented office behavior. | Executive's duties and permissions must be designed first. | A concrete administrative benefit if useful; otherwise no tiers. | Base function, staff requirements and all costs pending. No automatic revenue multiplier assumed. |
| Gift Shop, L5 preview (`room.gift_shop` reference) | Future normal/premium gift retail metadata; no playable room definition. | Real outlet, stock costs and staffing rule if selected; no shop employee inferred. | Transaction efficiency or approved product access, or no tiers. | Room costs, staffing, retail benefit and tier count pending; preserve fee metadata until explicitly revised. |
| Indoor Garden, L5 design | Accepted room category; no runtime benefits. | Define actual patient/staff access and purpose. | Capped comfort/morale effect, or complete when built. | Costs and benefit pending; stacking with Waiting/Break/Coffee/Gym must be explicit. |
| Staff Gym, L5 design | Accepted room category; no runtime exercise mechanic. | Staff use, work priority and scheduling first. | Morale/rest efficiency if desired, or no tiers. | Costs and benefits pending; no invented health statistics, clinical effects or staff-performance bonuses. |

The Reading Room is counted once, in the current L3 integration table. Its old
L4 category is superseded by GS-034's explicit owner choice. Older facility prose
also lists retired imaging access and outdated Ultrasound/X-ray unlocks,
GLP-1 values and recovery durations; the current catalog, scoped handoffs and
latest exact decisions govern this review.

Removed/deferred boundaries:

| Item | Treatment |
| --- | --- |
| Call Room | Removed by owner October 7. No room or upgrades proposed. |
| Exterior Entrance / room doors | Infrastructure, not an omitted room. Preserve access; no upgrade system assumed. |
| Founder desk instance | The starting Front Desk instance, not an additional office type. |
| Small/large room variants | Historical capacity-variant idea, not additional current definitions. Latest stable-appearance/layout requirement precludes resizing ordinary rooms through this plan without a new explicit owner decision. |
| Sterile processing / inpatient beds | Accepted ASC plan does not require separate rooms. Do not silently add them. |
| Hospital OR / Hospital Floor / ED-Trauma / ICU | Deferred clinical settings without current ASC room catalogs or numeric unlocks. They are recorded scope boundaries, not invented room lists. A future hospital expansion needs its own inventory/design. |

Inventory totals: **25 current definitions** = 22 existing playable room/buildable
types + Hallway + Reading Room being integrated + legacy Imaging Control Room;
**9 additional future room types**. Call Room is recorded as removed, not counted
as planned. The 21 existing upgradeable types are not an approval of 21 future
upgrade ladders.

## Cross-room decisions to resolve

These are discussion items, not defaults already accepted by the owner.

1. **Room-specific value:** keep G as a capped background benefit or replace it
   with attributable room comfort effects? Do not stack both automatically.
2. **Workload:** retain each current W contribution, revise selected rooms, or
   avoid extra admissions pressure? W does not replace real staff/equipment.
   Arrival cadence and the owner's manageable-flow preference remain separate.
3. **Diagnostics:** agreed collection/processing/reading/procedure phases stay
   fixed unless changed explicitly. If speed is selected later, name the exact
   local phase, rounding/minimum rule and affected services. Never shorten an
   external wait by upgrading an onsite room.
4. **Reliability:** current maintenance exists only for OR/Laboratory/Pharmacy.
   A reliability modifier can be designed there; adding imaging breakdowns is
   an additional mechanic requiring owner selection, not an existing benefit.
   Workshop repair speed and equipment reliability address different costs.
5. **Training:** room tools affect work performed in that room; employee training
   follows an employee. Choose stacking/caps after GS-037 defines training.
6. **Capacity:** simultaneous work requires existing usable stations, equipment
   and staff. Do not create invisible beds/chairs or double-book a resource.
   Extra rooms and extra hires remain separate purchases. The four approved
   reading stations must stay available without upgrade purchases.
7. **Costs:** choose existing prices as a baseline only after useful benefits
   and tier count are selected. Compare purchase cost plus added hourly upkeep
   against practical benefit and alternatives. Do not increase base payouts or
   silently alter old investments/refunds.
8. **Tiers:** each purchase needs an explainable incremental benefit. Stop the
   ladder when the benefit stops; allow zero upgrades. Distinguish current
   Upgrade Level 1 from facility Level 1 in player-facing language.
9. **Timing of a purchase:** current upgrades are immediate. Any future downtime,
   installation wait or equipment purchase is a separate owner choice. Repairs
   must not be relabeled as upgrades.
10. **Legacy investment:** retain saved room IDs, levels, doors, employees and
    investment records. If a ladder is shortened or removed, settle a mapping,
    retained benefit or compensation policy before implementing it. Do not clamp
    saved levels or delete paid upgrades by default.

## Proposed owner review sequence

Discuss one small group, or one room within that group, at a time. Confirm the
functional direction first; then propose concrete tiers, purchase/upkeep costs,
staff/equipment requirements, stacking rules and player-facing descriptions.
The table can be amended directly if the owner prefers a different order.

| Group | Rooms | First decision / dependency |
| --- | --- | --- |
| 1. Public/core | Examination, Waiting, Bathroom; confirm Front Desk/Hallway have no tiers | Workload capacity, comfort, cleaning burden, or no upgrades. Start with Examination. |
| 2. Diagnostic | Ultrasound, X-ray, CT, Phlebotomy, Laboratory, Reading; record retired Control | Preserve GS-034 timings; select any distinct upgrade benefit. GS-034 implementation stays separate. |
| 3. Procedures | Minor Procedure, Endoscopy, Recovery, OR | Workload, turnover, comfort or reliability; preserve clinical phases and actual stations. |
| 4. Staff/support | Training, EVS, Workshop, Break, Surgeon's Office | Employee-vs-room effects, morale, cleaning and repairs. Training decision depends on GS-037. |
| 5. Retail/telehealth | Coffee, GLP-1 Suite, Pharmacy, Vending | A useful service/comfort benefit or no tiers; preserve base payouts/stock costs. |
| 6. Future specialty/prestige | MRI, pediatric rooms, Wound/Ostomy, Founder/Executive Offices, Gift Shop, Garden, Gym | Confirm future scope/base functions first. Founder appearance exception needs focused direction. |

## Ownership and milestones

GS-038 owns this planning file and the all-room decision ledger. Primary Sol
performs the bounded read-only investigation and discussion documentation
directly; no subagent was spawned. Existing chats retain their stated ownership.
Shared files are not part of the draft-document milestone.

- [x] M1: inspect dirty tree and instructions; inventory all current/future,
  legacy/removed and infrastructure items; explain actual upgrade consumers.
- [x] M1: prepare room tables, settled-decision provenance, review order and
  cross-room/save constraints. This is a draft, not finalized owner approval.
- [x] M2: public/core directions accepted, with Examination changed to satisfaction
  and no capacity increase. Its revised numerical recommendation remains in M6.
- [x] M3: diagnostic/procedure table directions accepted; Reading changed to
  faster onsite interpretation. Its new numerical recommendation/prices remain
  in M6. GS-034 implementation stays separately owned.
- [x] M4: support/training/retail primary table benefits/prices accepted. Record
  GS-037 session/training integration as an implementation dependency.
- [x] M5: future room upgrade table and Founder's Office function+appearance
  direction accepted as design. Base future-room behavior is still unimplemented.
- [ ] M6: confirm the two revised numerical rows and Reading Room prices; retain
  deferred implementation contracts and request no duplicate approval of the
  other 32 rows. Implementation requires a separate concrete owner request.

Implementation, if requested, requires a bounded plan with actual file/hunk
ownership, fresh dirty-baseline inspection and meaningful behavior/save tests.
No worker or code milestone is preauthorized merely by this review plan.

## Acceptance and validation

For this planning phase:

- Every current catalog definition appears exactly once in the room inventory;
  no support, staff, retail, office or procedure type is silently omitted.
- All nine remaining future room types are explicit; Reading is not duplicated
  at L4; removed/deferred/infrastructure items are separately accounted for.
- Existing configured costs/effects are distinguished from executed effects,
  earlier accepted decisions and new proposals. New values remain unsettled.
- Every reviewed room has a selected functional benefit or no upgrades,
  prerequisites, proposed/accepted cost status and remaining questions.
- No room design, gameplay code/balance, clinical content or live save is changed.
- Check actual document content, catalog coverage/costs and Markdown links.
  Gameplay tests are unnecessary for a documentation-only milestone; no new
  gameplay validation or owner playtest is claimed.

For any later authorized implementation, validate the selected effect at the
actual execution point, resource queues/stacking, unchanged ordinary appearance
and geometry, and old/new save roundtrips. Test purchase while work is active:
already frozen encounters, queued/scheduled service contracts, reservations and
active repair/training sessions retain agreed terms. Verify no duplicate
fees/FSRS/progression, no unsupported clinical capability and unchanged canonical
origin. Use synthetic isolated campaigns; do not manipulate the owner's save.

## Sources and precedence

- [Repository instructions](../../AGENTS.md)
- [Current handoff](../handoffs/CURRENT_THREAD_HANDOFF.md)
- [Project board](../project-management/PROJECT_BOARD.md)
- [Owner GS-011-030 and related feedback](../playtests/2026-09-10-owner-playthrough.md)
- [Current room catalog](../../packages/balance-config/src/prototype-balance.ts)
- [Upgrade/workload/upkeep selectors](../../packages/game-domain/src/selectors.ts)
- [Upgrade purchase and completion satisfaction](../../packages/game-domain/src/reducer.ts)
- [Staff capacity](../../packages/game-domain/src/room-capacity.ts)
- [Upgrade dialog data](../../apps/player/src/session/viewModels.ts)
- [Service/retail operation metadata](../../packages/balance-config/src/service-income-catalog.ts)
- [Existing maintenance/break behavior](../../packages/game-domain/src/level-three-support.ts)
- [Approved layouts](../../packages/balance-config/src/approved-room-layouts.ts)
- [Accepted room-capacity design](room-capacity-and-occupied-sales.md)
- [Diagnostic timing and reading-room agreement](facility-diagnostic-timing.md)
- [Facility/future room categories](../features/facility-levels-and-clinical-release-points.md)
- [Level 3 room design history](level-three-room-design.md)
- [Level 4 room design and Call Room removal](level-four-room-design.md)
- [Reading-room design approval](../../tools/room-design/level-4/radiology-reading/approval-2026-10-07.md)

GS-034 status and GS-037 discussion were inspected through native read_thread /
wait_threads calls on October 7. No cross-chat messages were sent. Dated explicit
owner choices and current scoped handoffs supersede old provisional/history
sections; disagreement is recorded rather than silently editing another plan.

## Progress, decisions and next action

- October 7: owner accepted the 32 unchanged rows: "Otherwise these all look
  good." They rejected Examination's capacity benefit and suggested satisfaction;
  they requested shorter Reading Room interpretation. Recorded +2 satisfaction
  points and 10% less reading time per purchase as proposed revised values, and
  proposed the Laboratory's $450/675/990/1350 ladder for Reading. These new values
  are not yet owner-confirmed. Other accepted rows and prices are unchanged.
- October 7: the accepted future Founder's Office row includes both staff morale
  and appearance progression. The earlier optional office-direction question is
  superseded by this table acceptance; do not ask it again.
- October 7: owner requested a simpler three-column numerical upgrade table.
  Added the 34-row proposal at the beginning of this plan: 25 current entries,
  9 clearly marked future rooms, current prices for the 21 existing upgrade
  ladders, and proposed future prices. Readback/catalog coverage and price
  checks pass with no issues. No benefit or price is newly owner-approved.
- October 7: read GS-037's latest owner authorization and implementation status.
  Employee training is now approved there; a Training Room upgrade remains a
  separate session-duration proposal here. Only this planning file was edited.
- October 7: initial read-only inventory complete. Actual code confirms G cap,
  W contribution, increased hourly upkeep, preserved upgrade investment and
  unchanged staffing positions. S5/S8 have no executed runtime consumer.
- October 7: complete initial discussion draft prepared. No new room-upgrade
  benefit, cost, tier or visual change selected yet.
- October 7: document readback verified all 25 current definitions exactly once,
  all 9 future room rows, all 21 active upgrade price/upkeep sequences, all 18
  local source links and zero trailing-whitespace lines. No gameplay tests were
  needed or run for this planning milestone.
- October 7: optional owner questions opened for the Examination Room's primary
  benefit and future Founder's Office appearance-only vs function+appearance.
  An unanswered question is not approval. Other investigation continued.

Next action: this bounded implementation is complete. Use START_GAME.cmd and
http://127.0.0.1:4173 in the usual persistent profile for owner playtesting.
CURRENT_THREAD_HANDOFF.md records the accepted result and validation limits.
A next distinct task must inspect the shared dirty tree and that fresh handoff.
The work remains local; say "push to GitHub" for an audited scoped backup.
