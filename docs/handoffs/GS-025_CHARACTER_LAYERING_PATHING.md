> GS-025 COMPLETE / VERIFIED GITHUB BACKUP — September 29, 2026.
> Branch: codex/gs025-complete-2026-09-29.
> Runtime checkpoint: c7ec8052d8962069609bd02283f2b0fc49b0889c.
> Pushed to origin and exact SHA independently verified with git ls-remote.
> Validation: domain99, player65, balance8, browser10; all package types,
> build, boundary and launcher checks PASS. Sol assembled; Terra validated;
> parent reviewed actual diffs and safety scope. Private4198 server cleaned.
> This is a runnable scoped checkpoint inheriting published02ab585, excluding
> unrelated concurrent work. No merge or deployment. START_GAME.cmd ->
> http://127.0.0.1:4173 remains the owner playtest origin with existing saves.
> Task records complete. Desktop sidebar archival tool unavailable in session.
## GitHub closeout — September 29, 2026

The owner authorized a scoped GitHub backup and task completion. Runnable branch
`codex/gs025-complete-2026-09-29` starts from published `02ab585`, which already
contains the earlier GS-025 seating/layering work. This checkpoint adds the later
service detour correction, preparation queue, individual Periop beds, recovery,
waiting-patient bathrooms and optional departure stops. Unrelated shared changes
are excluded. Sol assembled the scoped source; root reviewed actual diffs and
source/privacy/credential scope; Terra independently validated the checkout.

Final isolated domain tests99, focused player65 and balance8 pass. Domain,
player and balance type checks pass; build, boundary and launcher checks pass.
The historical shared-tree type blocker documented below does not affect this
isolated checkpoint. Browser result and verified commit follow in the completion
record. No merge, deployment, owner save access or playtest-origin change.
Historical "local only" entries below describe their original milestone dates.
# GS-025 character layering and pathing

September29 GS-025 closeout approval: owner reports pushing to GitHub and
authorizes completion and closure after the push is verified. Record the exact
scoped remote branch/commit and final validation/handoff before archival.
GS Manager has not independently verified push completion or archival. This
approval does not authorize website deployment. Native task-management tools
are unavailable in this session.

## Individual beds, recovery and amenities — complete locally September29,2026

Owner requests eight individual Periop bed seats facing nursing station,
single-patient Endoscopy entry,60-minute recovery, optional departure stops,
and bathroom trips for waiting patients. Owner clarified pending results/later
questions stay onsite in Waiting Room after recovery.

Implemented eight exact bed supports (door-hidden beds excluded), shared nursing
coverage, retained prep/procedure/recovery bed, FIFO suite entry with physical
outgoing-room clearance, at least30 prep and60 recovery game minutes. Finished
visits may choose one persisted reachable bathroom/retail stop then complete the
sidewalk exit. Pending-result/later-decision encounters report in and wait onsite.
Waiting patients use exclusive bathrooms, retain their place and return on real
paths; prep pauses while away. Companions wait in public spaces. No new clinical
content or playable OR expansion. Legacy in-flight operations retain behavior.

Plan: `docs/execplans/periop-beds-recovery-amenities.md`. Parent reviewed actual
diffs, final actor images and tests: domain99, focused player27, browser10 PASS;
worker broader player56 PASS. Isolated build/boundary/launcher PASS. Player and
balance types PASS; latest domain types blocked by concurrent unrelated
character-still-persistence.test.ts Set<string|undefined> mismatch, untouched here.
Sol service_queue implemented domain; Terra flow_investigation seating/projection
and companion correction; Sol browser_flow_proof private browser validation.
Root made only one test narrowing integration correction after review.
Current images/logs are `.local-dev/gs025-periop-beds/final/`; old browser/ capacity
images and earlier sidewalk crops are superseded. Private4197 process metadata
and cleanup evidence are in the evidence root. Owner4173/profile/saves untouched.
Save & Close -> START_GAME.cmd -> http://127.0.0.1:4173 usual profile for playtest.
Local checkpoint only; say "push to GitHub" for audited backup. No push/deploy.
Concurrent occupied-room-sales task has unfinished lifecycle work and is paused;
preserve its changes and distinguish its limitations from this follow-up.

## Periop preparation queue — complete locally September 29, 2026

New endoscopy patients now go to Periop for at least30 on-site game minutes,
then keep that station until suite/provider availability permits transfer.
Founder/endoscopist are free during prep. Owner confirms OR surgery only in
addition to endoscopy; minor office procedures excluded. Future OR catalog
phase rule included, but playable OR content is not present in this build.
Separate existing prep/recovery anchors prevent circular room blocking.
Question-ordered colonoscopy, generic EGD/biopsies, terminal/staged Endoscopy
and service visitors use the shared flow. Existing in-flight saves retain their
old phase indices/timing. External processing starts after local recovery;
one fee, physical Front Desk return and later result readiness are preserved.
UI shows Preparing/Ready in Peri-op and projects real operation routes.

Sol service_queue implemented M1/M2; Terra flow_investigation implemented UI and
reviewed; Sol browser_flow_proof proved actual UI colonoscopy with real visitor
contention. Parent reviewed actual diffs/tests and centered three-phase images.
Final core domain633/51, affected75, player529/84, both types, isolated build,
boundary/launcher PASS. Browser1 PASS (30-minute arrival timer,+12 reload,+29,
+30 blocked, provider release, recovery, one fee, live renderer route).
Full content-heavy domain run NOT claimed green: concurrent GS028 failures were
being repaired; a later broad run timed out one GS028 case and was stopped after
five-plus minutes. See plan for exact limitations and read-only attribution.
Plan: docs/execplans/periop-preparation-queue.md. Evidence:
.local-dev/gs025-periop-preparation/. Private4197 PID49104 stopped; owner save
and profile untouched. Save & Close then START_GAME.cmd ->
http://127.0.0.1:4173 usual profile to test NEW orders. Local only; say
"push to GitHub" for audited backup. No commit/push/deployment.

## Intermittent service detour — complete locally September 29, 2026

Owner reports characters near US/minor procedures/blood draws sometimes cross
walls toward the southeast, then return normally. Confirmed local START_GAME.cmd.
Renderer route replacement was joining at historical path[0], synthesizing an
X-then-Y bridge ignoring walls and replaying already-completed route prefixes.
Sol service_queue corrected authoritative/shared-waypoint joining, preserved
valid old-tail catch-up and fractional edge continuity, and removed invented
bridges. Narrow delivered-result selector guards stop obsolete markerless saved
travel projections. Terra flow_investigation investigated/reviewed read-only;
root reviewed source and old/new reproduction. Browser Sol completed the live
transition proof. Plan: docs/execplans/service-transition-detour.md.
Parent player521/domain813, types/build and boundary/launcher PASS. Worker
route17/procedure43 PASS, with old-code regressions failing before the fix.
No genuine pre-fix browser transition was captured; do not imply otherwise.
Final browser4/4 PASS: US/minor/phlebotomy completion-to-return replacements and
US pause/reload. Parent reviewed assertions, images and actual traces: two
projected routes each, zero extra rendered edges, authorized sampled positions.
Evidence: .local-dev/gs025-service-detour/. Final source hashes recorded. Owner
origin/profile/save untouched; no push/deployment. Save & Close then reopen
START_GAME.cmd -> http://127.0.0.1:4173 usual profile. Say "push to GitHub" for
an audited backup. Owner visual acceptance is pending.

## East/west armrest layering — complete locally September 28, 2026

Owner rejected the prior whole-chair E/W overlap. Required ordering is chair
back/seat/north arm/legs, then character, then southern armrest only. Current
plan: docs/execplans/side-chair-layering.md. Includes Waiting side chairs and
rotated bench, rotated phlebotomy chair and normal-view GLP-1 chairs. Earlier
GLP-1 direction/contact work remains; its E/W layering acceptance is superseded.
Implemented with six exact source-crop masks for seven supports. Runtime uses
complementary original RGBA pixels; only occupied chairs split, and vacancy
restores the full source frame. Bound by room instance/support/owning draw.
E/W sitter painter depth uses the actual fixture baseline; seat positions and
directions are preserved. Armless stools and N/S seats are unchanged.

Terra flow_investigation inventoried and reviewed lifecycle risks; Sol
service_queue implemented; Sol browser_flow_proof supplied independent browser
evidence. Root reviewed scoped source diffs, tightened arm-only cutouts, final
occupied images and GLP/phlebotomy closeups. Parent player517/84, types, isolated
build and boundary/launcher checks PASS; worker focused45 PASS. Five exact-ID
browser matrix cases PASS, plus same-scene bench0-1-2-1-0 and duplicate-room
isolation evidence reviewed. Final browser6/6 plus legacy GLP2/2 PASS; owned
private4197 stopped and verified closed. Final production hashes match reviewed source.
Evidence: .local-dev/gs025-side-chair-layering/. Existing large-chunk build
warning remains. Concurrent Ultrasound wall-print changes are preserved and
excluded from this milestone's ownership. No gameplay/domain/art-file changes.
Local only: owner START_GAME.cmd -> http://127.0.0.1:4173 and saves untouched.
Say "push to GitHub" for an audited backup. Owner visual acceptance is pending.

## GLP-1 NP workstation seating — September 28, 2026

Each GLP-1 NP now uses their existing deterministic workstation assignment to
sit in a distinct chair facing its computer: E/W in normal view, N/S rotated.
Actual arrival gates seating; walking, other tasks and shopping clear support.
The existing station helper is exported for presentation reuse; staffing,
automation income, paths and source art are unchanged. Chair seat contacts come
directly from the approved proof. The rotated south NP sorts above the actual
chair bitmap baseline; the north NP keeps the chair back in the foreground.
Telehealth uses its explicit cushion contacts without the generic south inset.

Terra flow_investigation implemented; Sol browser_flow_proof validated real
two-hire arrival/seat behavior at0/270 and100/160. Parent reviewed actual scoped
diffs and final images, independently passed focused30, staffing9, full player
512/83 and types/build. Browser2/2 PASS. Earlier walking-test failures belonged
to concurrent GS026 changes and were resolved before final validation.
Evidence: .local-dev/gs025-glp1-seating/. Plan: character-seating-layering.md.
No substantial implementation was left undelegated. Local only; owner profile
and saves untouched. Save & Close, then START_GAME.cmd ->127.0.0.1:4173 usual
profile to review. Say "push to GitHub" for an audited backup.

## Further bench contact and phlebotomy — September 28, 2026

Owner confirmed the latest screenshot used START_GAME.cmd. South-facing Waiting
bench occupants now sit an additional .25 tile toward the cushion back (total
.50 from the original proof). Individual Waiting chairs and Front Desk keep the
prior .25 adjustment. Parent reviewed exact-identity real-source100/160 images;
an ineffective foreground-arm crop experiment was removed completely.

New phlebotomy draws assign an actual phlebotomist, route the patient to the
chair and worker to the stool, and use reciprocal seated directions at0/270.
Collection begins after arrival; existing work-phase durations stay unchanged.
Staff release after collection while external processing continues. Busy queues,
concrete staff collisions, save/reload and legacy markerless timing are covered.
Both regular PendingResult labs and GS023 collection operations are supported.

Sol service_queue implemented source/tests; Sol browser_flow_proof supplied real
reducer-generated persisted-state proofs; Terra flow_investigation independently
reviewed lifecycle correctness. Parent reviewed actual scoped diffs and active/
release images in both orientations. No implementation milestone was undelegated.
Evidence: .local-dev/gs025-waiting-phlebotomy/. Final validation is recorded in
docs/execplans/character-seating-layering.md and CURRENT_THREAD_HANDOFF.md.
Final parent domain618/51, player511/82, types/build/boundaries/launcher PASS;
Waiting browser1 and blood-draw browser2 PASS. Private4197 stopped/no listener.
The initial concurrent diagnostic failures were resolved before final checks.
Browser fixtures are synthetic campaigns, not a replay of the owner's save.
The270 proof uses START_SERVICE_OPERATION collection with a service visitor;
an initially ineligible terminal-order fixture is not claimed as passing proof.

Local only. Use Save & Close, then START_GAME.cmd and http://127.0.0.1:4173 in the
usual profile to review new draws. No owner save/profile was modified. Say
"push to GitHub" for an audited backup. Earlier south-seat completion below was
reopened by the owner's further feedback; it is historical.

September28 owner follow-up corrected south-facing chair contact: Waiting bench,
rotated Waiting south chair and Front Desk staff seat surfaces move .25 tile
north toward cushion backs. Art, anatomical anchors, ground/depth, other facings
and bed supports stay unchanged. Sol service_queue implemented two presentation
files; Sol browser_flow_proof produced evidence; root reviewed exact diffs and
images, independently passed focused46 and types. Final browser3 PASS at100/160.
Images .local-dev/gs025-south-seat/after/. Same-identity before/after verified for
bench and secretary; rotated chair baseline differs in identity and only its
final contact is accepted, as documented in plan. Private4197 stopped. Local only.

## Seating and layering batch — September 28, 2026

Implemented locally after GS-026 still integration. Active record:
docs/execplans/character-seating-layering.md. Owner requested this batch from
their live screenshot; broad chair-click/onboarding work remains separate.

- Waiting Room uses all four authored seat positions and directions at0/270.
  Per-seat contacts stay distinct; an occupied seat sorts above its own furniture
  without raising walking characters globally.
- Front Desk secretary uses the actual domain assignment rather than the stale
  legacy renderer anchor. Chair stays visible behind the seated actor, with desk
  in front. Public chair keeps its authored North facing.
- Exam0/270, Ultrasound and Minor Procedure patients sit at the bed foot/end,
  facing the assigned stool occupant. Clinician/technician faces the patient.
- CT patient sits facing away from gantry; assigned imaging technician stands
  facing console. Mobile tech derives room from active work, not home assignment.
  EVS/passers retain ordinary work and sort correctly before/behind the computer.
- Encounter patients and external service visitors use the same supports after
  arrival and release them on departure. Artwork, scale/loading fixes, navigation,
  service timing, clinical content, saves and economics are preserved.

Sol service_queue implemented source and regressions; Sol browser_flow_proof
implemented real persisted-state-to-Phaser proof. Astra reviewed actual
task-relative diffs and screenshots, including the rotated bench/stool defects
found during live review and the subsequent corrections. No implementation
milestone was left undelegated. Before copies/hashes and correction baseline:
.local-dev/gs025-seating/. Source freeze focused45 and types PASS. Parent final
player506/82, types and isolated production build PASS; boundaries/launcher PASS.
The shared final suite includes unrelated concurrent tests, not506 newly added
GS-025 tests. Existing large-chunk build warning remains.

Final seating browser9/9 PASS with explicit http://127.0.0.1:4197 assertions,
fresh test profiles and synthetic bounded fixture campaigns. Root visually
reviewed Waiting0/270, Exam0/270, US/Minor, external visitor, secretary, CT
operator and EVS on both sides. Representative pause/resume/zoom check passes.
Evidence: .local-dev/gs025-seating-browser/screenshots/. These are fixture proofs,
not a replay of the owner's campaign. GS-026 compatibility4/4 PASS (loading and
scale1, glide/reload2, resolution/zoom1), with new evidence only in the sibling
compatibility directory. Existing screenshots were preserved. Both4173/4197
are free after teardown. An initial wrong-env test invocation spawned its own4173 server
in a fresh test profile; that process stopped and its captures were superseded.
No owner profile/save was used. Owner opening pathway remains START_GAME.cmd ->
http://127.0.0.1:4173 in the usual persistent profile.

Local only; no commit, push, merge or deployment. Say "push to GitHub" for an
audited backup checkpoint. Remaining notes: arbitrary chair-click seating,
Front Desk onboarding hover/click and broad exposed-floor reachability.

## First pathing batch (historical completed milestone)

September 24, 2026. First five-item batch complete locally and validated.
Completed plan:
docs/execplans/character-layering-pathing.md.

## Owner-selected scope and behavior

1. New onsite orders wait for busy rooms/equipment/staff using the existing
   waiting hierarchy. They start their work clock and concrete reservations only
   when dispatch succeeds. Missing/inaccessible capability retains existing
   fallback behavior; previously frozen orders keep their journeys.
2. Radiology-room procedures use the imaging technician and patient. Founder is
   released to see others. Mobile imaging techs can accept terminal US work from
   elsewhere in the clinic after their current work finishes; arrival and full
   work duration remain required.
3. New onsite tests/procedures with further decisions return physically to Front
   Desk after onsite work, then use normal waiting destinations. The existing
   chart becomes actionable only after both desk arrival and result availability.
   External pathology/processing delays remain. This is report-in, not another
   staffed check-in or fee. Blocked return paths retry without teleporting.
4. Departure investigation found terminal procedures used a shorter exit route
   than ordinary resolved patients. Live Minor Procedure trace shows the loaded
   patient sprite walking inside, then removal at the first exterior tile. A
   correction now reuses the full sidewalk/offscreen policy. A blocked path
   retains the visible patient and retries across reload, releasing service
   resources without teleporting. In-flight movements, external visitors and
   remote work remain compatible. Final live Minor Procedure/Ultrasound tests
   both pass, including loaded sprites at interior and exterior intermediate
   points and removal only after the final endpoint.
5. New litter cannot spawn beyond founder reach. Existing unreachable litter
   relocates to nearest valid reachable same-room floor, or another reachable
   room if required, on a tick or collection click. Identity/count/spawn time
   survive. Active cleanup targets stay put; no safe destination leaves the item
   intact. Furniture, room geometry and cleanup work/rewards are unchanged.

The specific normal Waiting Room NW pocket was reproduced at local(0,0): bench
and chair separate it from reachable floor. This batch fixes litter placement,
not all room geometry or arbitrary floor-click reachability.

## Ownership and review

- Sol service_queue: queues, radiology staffing, report-in, full terminal
  departure correction and regressions.
- Terra flow_investigation: initial diagnosis and litter implementation/tests.
- Sol browser_flow_proof: corrected live-frame departure/postservice browser
  proof and narrow FNA compatibility expectations.
- Astra: product decisions, planning, actual task-relative diff review,
  independent checks, integration and durable handoff.

Shared dirty beta worktree at initial c26c96a preserved. Baselines live under
.local-dev/gs025-baseline, gs025-m2-accepted, gs025-m3-accepted and
gs025-m4-accepted. Player preview
test baseline omission is recorded in the plan; no historical baseline invented.
GS-026 stills and GS-015 room integration remain intact. No clinical prose, IDs,
prices, service work durations or source artwork were changed by GS-025.

## Validation

- Parent: final domain580/49, player490/81, affected balance28/2; affected package types,
  dependency boundaries, launcher contract and isolated production build pass.
- Worker: M3 focused137, final service/US44, full pre-litter domain575; M4
  litter/timing25 including80 spawn seeds and real click-to-clean completion;
  final departure service/timing78 and focused26.
- Queue/reload, busy room versus busy tech, terminal tech working in CT, blocked
  return/reload, both result/arrival orderings, legacy frozen results and later
  care movement are covered. Generic phlebotomy retains role-based reservation;
  this batch does not add a new generic staff travel/animation system.
- Browser7 PASS: postservice1, final departures2, procedure compatibility4.
  Parent reviewed US tech-only, Front Desk, Waiting Room, existing-chart alert
  and both exterior departure screenshots. Tests use private4197/fresh synthetic
  campaigns; their bounded fixture setup is not an owner campaign playthrough.
- Evidence: .local-dev/gs025-browser/departures/ and compatibility/; accepted
  logs playwright-4197-postservice2.log, playwright-4197-departures-final.log,
  playwright-4197-compatibility-final.log under that directory's logs/.
  Earlier failing runs were diagnosed and superseded; see plan for the distinct
  harness failures and the actual short-terminal-exit defect they exposed.
- Build output .local-dev/gs025-build; standard large-chunk warning remains.

## Playtest and remaining notes

Use START_GAME.cmd and http://127.0.0.1:4173 in the usual persistent browser
profile. Save/reload to load current local code. Test4197 has separate storage;
no owner save was used or migrated by the test harness. No durable origin change.
Private test PID37692 stopped and port4197 verified free. Owner4173 was not
listening at closeout and was untouched; START_GAME.cmd remains its launcher.

Seated directions, pose contacts/proportions, visual layering, click-any-chair
seating and Front Desk hover/click improvements remain recorded in the GS-025
brief for a separately selected batch after stills integration.

Local changes only: no commit, push, merge or deployment. Owner can say
"push to GitHub" for a separately audited backup checkpoint. Broad staging is
unsafe until unrelated shared changes are reviewed.

## Final checkpoint acceptance

September 29, 2026: GS-025 implementation complete. Independent isolated validation:
domain99/99, player65/65, balance8/8, browser10/10 PASS; domain/player/balance
types, production build, dependency boundaries and launcher contract PASS.
Parent reviewed final diffs and credential/privacy/source scope (39 explicit
files; no new assets or clinical content). Standard build chunk-size warning only.
Sol reconstructed source and restored omitted accepted reload/projection hunks;
Terra ran independent checks. Root made one tiny E2E origin configuration fix.
Browser used private4198/fresh test storage; owner4173 and saves untouched.
No merge or website deployment. The remote commit is recorded after push.
