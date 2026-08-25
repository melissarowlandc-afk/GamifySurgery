# Canonical Design

Status: Accepted product rules plus clearly marked design questions. Technical
implementation proceeds under ADR 0021.

Last updated: 2026-07-28

Player-facing title: **Stitchin' Time**. Historical repository, deployment,
save, and launcher identifiers retain `GamifySurgery` for compatibility.

## Core experience

The player operates a fictional surgical facility that visibly grows from a founder-run desk clinic into an ambulatory surgery center. Clinical knowledge advances learning; operational judgment advances the facility. Neither loop should trivialize or corrupt the other.

## Reconstructed design intent

The imported design history shows a consistent creative center even as the
mechanics became more disciplined:

1. **Original idea:** make ABSITE and written-board study feel like a game
   rather than a stream of disconnected questions. A fictional patient arrives,
   the player works through clinical decisions, and correct care helps a tiny
   clinic grow.
2. **Management-game expression:** keep the facility visible, show resources
   and their causes, let rooms be placed physically, automate routine staff
   work, and make queues, delays, salaries, cleanliness, capacity, and
   construction matter.
3. **Session intent:** support satisfying sessions of roughly the length of a
   short daily study period. The facility is active only while the player is
   present; "idle-game style" means readable incremental management, not
   background progress while closed.
4. **Educational maturation:** schedule narrow concepts rather than whole
   cases, test one concept per scored decision, return concepts through
   clinically meaningful variants, and preserve sources, approval, exact
   versions, and reproducible constrained generation.
5. **Current delivery intent:** produce a small playable combination of patient
   care and clinic growth early, then make design decisions from play rather
   than completing the entire five-stage game on paper.

The Level 0-1 desktop composition keeps the top-down facility stable in the
upper center and reserves a tactile desk below it. Patient charts and Build
Mode tools occupy that desk rather than resizing or moving the facility.
Phone-width layouts may turn the chart into a readable full-screen sheet.
Patient navigation and urgent alerts remain easy to find.

### Historical ideas that remain candidates

The following appeared in early brainstorming but are not automatically
canonical: final starting money; searchable scored catalogs for every test,
diagnosis, and treatment; cash for every
correct sub-answer; death,
lawsuit, or other punitive event details; and eventual expansion into a full
emergency department or hospital. The current accepted progression ends at an
optimized ambulatory surgery center. Research use also remains outside the
initial build unless separately authorized. The early idea of feeding
commercial question-bank questions or explanations into AI is not accepted;
clinical authoring must use permitted sources and original synthesis without
copying or close paraphrase.

### Founder and inheritance opening

Every new campaign begins with a tiny founder creator followed by the sparse
rich-grandfather decision. **Be Rich and Happy** is a genuine non-game ending
that creates no clinic campaign or learning history. **Build a Surgery Clinic**
initializes the existing Level 0 state exactly once, stores the selected founder
with that campaign, and uses configured starting cash rather than making the
inherited $1,000,000 spendable. Existing campaigns resume past the opening.
Restart Campaign reuses this flow while retaining the accepted same-seed,
recoverable archive-and-restart rules. The exact implementation boundary is recorded in
[Founder and Inheritance Opening](docs/features/founder-inheritance-opening.md).

## Educational loop

- The smallest scheduled educational unit is a clinical concept.
- Each concept is one FSRS card within a campaign.
- The first scored answer to a decision maps incorrect to Again and correct to Good.
- The player does not report confidence.
- Concepts return through different fictional patients and question variants.
- Explanations teach after the answer without creating another scored review.
- APP-handled encounters do not update FSRS and do not count as active recall.
- Clinical truth never depends on randomness, room quality, or staff training.
- Only Melissa may clinically approve material for publication.
- AI-generated content remains draft material.
- Commercial question-bank wording must not be copied or closely paraphrased.
- Sources, approval state, and provenance remain attached to content revisions.
- The content system serves both as a comprehensive Clinical Topic knowledge
  base and as the source of clinically approved runtime teaching material.
- Every approved presentation/question iteration has one semantic clinical
  release point. A Tested Concept may have iterations at several release
  points while retaining one FSRS identity; its earliest facility availability
  is derived from those approved iterations. Release point, required
  capability, clinical setting, educational difficulty, room upgrade level,
  employee training, and FSRS state remain separate.
- Mastery patient variants are clinically meaningful presentations, not
  cosmetic changes to name, exact age, pronouns, or wording.
- Runtime patients use only approved typed slots, values, profiles, and
  constraints instantiated through the campaign seed.
- AI may assist administrative drafting but cannot clinically approve or
  publish. The live game performs no AI clinical generation.

The Clinical Topic, Tested Concept, case, Patient Presentation Variant,
constrained-template, Question Variant, citation, facility-stage eligibility,
and frozen runtime-instance relationships are accepted in
[ADR 0020](docs/adr/0020-dual-purpose-clinical-content-model.md).

### Scored-decision concept mapping

Every scored clinical decision identifies exactly one primary concept.

- Correct maps Good only to that concept's campaign card.
- Incorrect maps Again only to that concept's campaign card.
- Supporting concepts may be attached as non-scoring authoring or explanation
  tags but receive no automatic FSRS or mastery change.
- A case that needs to assess several concepts uses separate scored decision
  nodes or separate encounters, each with its own visible answer opportunity,
  feedback, review record, and primary concept.
- Content validation must prevent feedback from an earlier node from
  unintentionally revealing a later scored answer.

### Multiple-choice clinical interaction

Every scored clinical Decision Node uses single-select multiple choice with a
finite answer set and exactly one clinically correct answer.

- The first submitted choice is final for scoring.
- Choice count may vary when clinically appropriate.
- Distractors, the correct answer, and explanations receive clinical review.
- Safe answer-order shuffling is declared per Question Variant.
- A patient ordinarily contains one to three sequential scored questions,
  each scoring a different primary concept.
- A rare Level 3-or-later patient may contain four scored questions; four is
  the absolute authored maximum.
- Search and menus may support management or administrative controls, but they
  do not score clinical knowledge.

The authored case determines its question count and sequence. Feedback is
deferred only when it would reveal or materially cue a later answer. Unscored
narrative and operational steps do not count toward the scored-question limit.
This accepted game-design rule is recorded in
[ADR 0024](docs/adr/0024-variable-length-patient-question-sequences.md).

Concepts still recur through different meaningful patient presentations,
question wording, perspectives, distractors, and explanations rather than
repeating one memorized item. This accepted game-design rule is recorded in
[ADR 0023](docs/adr/0023-multiple-choice-clinical-assessment.md).

Every playable chart is anchored to exactly one fictional patient. The
presentation gives that person a brief clinical story or question; the active
Decision Node then asks what to do for the same person without restating the
presentation. Comparative and reverse-direction variants use alternative
findings or reports for that one patient, never a lineup of different patients.
Sequential decisions and returned results remain parts of the same encounter.

### Clinical-answer consequences

- Every first scored submission immediately awards current-level Learning XP:
  `10` for correct and `2` for incorrect. The HUD does not display lifetime XP.
- `100%` is the clean, capable-clinic baseline. At Front Desk check-in, a new
  ordinary patient receives configured starting penalties for applicable
  unresolved facility conditions, so a patient entering a dirty clinic with
  missing amenities does not incorrectly begin at `100%`. Correct care may
  restore a configured amount; incorrect care, unnecessary delay, missing
  facilities, poor room condition, and unhappy staff may reduce it further.
- The campaign-wide Patient Confidence and same-day answer modifier no longer
  exist. The HUD preserves a rolling window of ended-encounter final
  satisfaction values as its historical baseline and applies a separate live
  modifier for current facility dissatisfaction conditions until they are
  resolved. Fixing a condition removes only that live modifier and never
  rewrites historical encounter outcomes.
- Level 0 encounter cash is
  `$15 + ($10 * question count) + ($50 * correct count)`.
- Level 1 encounter cash is
  `$20 + ($15 * question count) + ($65 * correct count)`.
- Cash is settled once at encounter completion. Direct service, supply, and
  adverse-outcome expenses remain separate and the summary shows gross,
  expenses, and net change when applicable.
- Same-date remediation cannot award another clinical XP or quality bonus for
  that concept.
- Tutorial resources guarantee the first examination room and operating buffer
  even if every tutorial answer is wrong.
- Deliberately answering incorrectly must never have greater expected value
  than answering correctly.

Exact amounts remain tunable balance values. This accepted relationship is
recorded historically in
[ADR 0025](docs/adr/0025-bounded-clinical-answer-consequences.md) and
[ADR 0033](docs/adr/0033-immediate-xp-and-daily-confidence-modifier.md), then
amended by [ADR 0034](docs/adr/0034-july-27-clinical-encounter-amendments.md)
and [ADR 0035](docs/adr/0035-minute-simulation-and-patient-satisfaction.md).

### Incorrect-answer case continuation

- A wrong nonfinal answer is corrected, with feedback deferred only when needed
  to protect a later scored question, and the patient continues from the
  clinically correct state.
- A wrong final answer is the action that occurs in that encounter. It uses one
  deterministic, clinically authored consequence, then shows the preferred
  answer and explanation before the Patient Learning Summary and chart closure.
- A no-immediate-harm, unnecessary-referral, delay, expense, or unresolved-
  symptom result is still authored consequence data; a bare runtime placeholder
  is not publishable.
- Runtime code never invents a complication, harm, or clinical correction.
- The terminal feedback requires one unscored acknowledgment before filing;
  viewing the full Patient Learning Summary remains optional.
- Every final wrong choice has an explicit approved outcome or an explicit
  `no_terminal_outcome` disposition. Harm is never invented only as punishment.
- Terminal outcomes are choice- and presentation-specific, sourced, immutable,
  frozen with the encounter, and written so a possible complication is not
  falsely presented as inevitable.
- The outcome is unscored and creates no additional concept exposure, FSRS
  review, mastery evidence, or XP.
- Narrative severity never bypasses the accepted patient-level management cap,
  tutorial guarantee, or progression safeguards.

This accepted authoring and runtime rule is recorded in
[ADR 0030](docs/adr/0030-correction-forward-with-terminal-clinical-outcomes.md).

### Patient chart lifecycle

- A newly arrived patient appears as a chart tab in the Waiting list and does
  not forcibly interrupt the player.
- Selecting the chart opens a panel while leaving the facility visible and
  moves the patient logically into Active for safe recovery. When the panel
  closes, its Active tab becomes visible.
- Closing a chart with a ready unanswered question leaves it in Active with an
  exclamation point. The exclamation point always means player action is ready.
- A patient awaiting a result or later authored step remains in Active without
  the exclamation point and shows what is pending.
- When the result or next question becomes ready, the Active tab gains its
  exclamation point without stealing focus from another open chart.
- After the final question, any approved wrong-answer terminal outcome and
  corrective teaching appear before the player may flip or toggle the chart to
  an unscored diagnosis-and-management summary that is required, clinically
  approved content but optional for the player to view.
- Closing the completed chart moves it into Resolved. Resolved charts remain
  reopenable in read-only form without creating another answer, reward, or FSRS
  review.
- Encounter settlement occurs once at clinical completion, not when the player
  chooses to view the summary or closes the chart.
- Facility time continues while a chart is open unless the player manually
  pauses.

This accepted interaction and recovery behavior is recorded in
[ADR 0026](docs/adr/0026-patient-chart-lifecycle.md).

### Result timing

- A patient waits only for a clinically or operationally meaningful authored
  result or step; the game does not insert delay between every question.
- Result progress uses facility time, not real-world learning time.
- The Active chart states what is pending and shows the best current
  facility-time ETA. Approximate estimates are labeled.
- Approved outsourced services are slower. A functional in-house capability
  with eligible staff and capacity is faster, and the current internal queue
  affects the estimate resolved at scheduling.
- A passive result does not show `!`; the action-required indicator appears
  only when the next player action is ready.
- Manual Pause, hidden-page pause, closing the game, and device suspension stop
  result progress with no catch-up.
- Prototype delays are deterministic and versioned balance values. Any later
  bounded seeded variation is pinned, persisted when scheduled, and cannot
  change clinical truth or prevent essential content.
- Clinical content owns result meaning and values. Balance configuration owns
  turnaround, route, capacity, cost, and operational modifiers.

This accepted pacing relationship is recorded in
[ADR 0027](docs/adr/0027-transparent-capability-based-result-timing.md).

### Patient patience and leaving

- Only a patient whose chart remains unopened in Waiting may leave because of
  patience.
- Waiting patience uses facility time and has a generous visible status and
  warning before departure.
- First chart opening commits the patient to Active and cancels abandonment.
- An Active patient cannot disappear during a required result wait or while an
  unanswered clinical decision remains available.
- Reading an open chart creates no response-delay consequence for that patient.
  Other facility operations and other patients continue unless the player
  selects Pause.
- Long operational delays or ignored action-ready Active charts may cause
  small, capped satisfaction effects after visible grace thresholds, but never
  erase the question or change clinical truth, FSRS, XP, or mastery.
- Tutorial patients cannot abandon the queue or create an opening softlock.
- A patient who leaves before being seen produces no clinical review, mastery
  evidence, clinical XP, or completion revenue. Their read-only history entry
  does not reveal unanswered content or the learning summary.

This accepted fairness rule is recorded in
[ADR 0028](docs/adr/0028-fair-waiting-patient-patience.md).

### Clinic workload capacity

- One visible clinic-workload capacity counts Waiting patients plus unresolved
  Active patients.
- Opening a chart does not change occupancy. Terminal completion or leaving
  before first opening releases one slot.
- A completed patient whose optional learning summary remains available no
  longer consumes workload capacity.
- When the routine limit is full, routine arrivals pause before entering
  Waiting; the game does not create an unreachable patient or accumulate a
  hidden arrival burst.
- Tutorial and progression-critical cases use protected reserved capacity and
  remain deterministically guaranteed.
- Rooms, functioning staff, and upgrades may raise capacity. If capacity later
  falls below current occupancy, existing cases remain and new routine
  admissions pause.
- The workload display and At capacity or Over capacity status remain usable
  without sound or color.

This accepted backpressure rule is recorded in
[ADR 0029](docs/adr/0029-total-clinic-workload-capacity.md).

### Campaign-scoped scheduling

Each campaign owns its own concept cards, review log, mastery evidence, and next-due times.

- A new campaign initializes a new learning schedule.
- Starting a new campaign does not alter an older campaign.
- Reopening an older campaign resumes that campaign's schedule.
- Account identity may own several campaigns, but there is no account-wide scheduler that advances all campaigns together.
- Prior campaign mastery must not automatically complete new-campaign XP, encounters, objectives, or operational requirements.

This is an accepted foundational decision. Changing to account-wide scheduling later would require a learning-history migration and new rules for merging conflicting campaign card states.

### Mastery

Current mastery requires all of the following within the campaign:

- At least three correct responses
- Correct responses on three different real-world dates
- At least two patient variants
- Current FSRS interval of at least 21 days

Each account has one confirmed learning timezone using a location-based IANA
identifier such as `America/New_York`.

- Device detection may suggest the initial value, but the player confirms it.
- Traveling or changing devices does not automatically change it.
- Every scored review preserves its trusted UTC instant, timezone identifier,
  applied UTC offset, and immutable derived learning date.
- Mastery-date counting and same-date remediation limits use that derived date.
- A later timezone change affects future reviews only and never reclassifies
  historical learning dates.
- Timezone changes are recorded and rate-limited; the exact limit is a later
  GREEN implementation setting.

### Review selection

Review selection should:

- Prioritize overdue concepts
- Avoid excessive clustering
- Interleave categories
- Prefer variants not seen recently
- Occasionally contrast easily confused diagnoses
- Guarantee progression-critical educational content once eligible

FSRS determines when a concept is due. A separate selection layer determines which due concept and eligible variant appears in the facility.

### Scheduler implementation

The accepted scheduler foundation uses the official `ts-fsrs` package for
FSRS-6 behind a project-owned adapter.

- Campaigns pin the scheduler integration, package, algorithm, and resolved
  parameter-set versions.
- Existing campaigns do not silently change schedules when a dependency is
  upgraded.
- Library interval fuzz is disabled; reproducible campaign randomness belongs
  to the game's seeded-randomness system.
- The pilot begins with validated default model parameters and no individualized
  optimizer.
- The pilot uses a fixed 90% desired-retention target, stored in the immutable
  balance release and pinned by each campaign.
- Project-owned review evidence preserves the state needed to audit and test
  every scheduling transition.

### Same-date remediation

After the first scored response in an encounter maps to Again:

- Feedback and explanation appear immediately, but correction is not another
  scored review.
- The concept becomes eligible for one additional scored encounter after 30
  real-world minutes.
- The learning timer continues while the game is closed or facility operations
  are paused.
- The encounter must use a different approved patient or question variant.
- The selector prefers an unrelated encounter in between when available.
- The remediation never forces an extra patient arrival or interrupts facility
  play.
- No concept receives more than one additional scored remediation encounter on
  the same learning date.
- If a suitable encounter does not occur, the concept remains due for a later
  session.
- A correct initial response does not produce an unnecessary same-date repeat.
- A remediation response updates FSRS normally but cannot create another
  mastery date.
- Reward rules must prevent deliberate incorrect-answer farming without making
  honest mistakes punitive.

## Management loop

- Staff automatically handle routine work.
- Staff have home rooms, permitted work areas, salaries, morale, training, and task queues.
- Staff and room quality affect operations, capacity, speed, reliability, morale, waste, and finances.
- The player is not required to dispatch every minor task.
- The Level 3 Pharmacy hires a Pharmacist, who manages medication inventory
  automatically.
- Medication stockouts lose dispensing revenue and may slightly reduce satisfaction; they do not block care.
- Outsourced diagnostic or repair fallbacks may exist.
- Vending machines and coffee kiosks are enclosed buildable rooms.
- The Cash-Only GLP-1 Telehealth Suite is a limited comedic side business, not
  the dominant strategy. Before its future Level 2 automation, a founder may
  use a manual consultation at any clinic cash balance. The floating action
  remains available until the dedicated room is built, may be used once per
  facility hour, pays a fixed $25 in the Level 0-1 pilot, has no daily cap or
  diminishing return, and awards no XP or learning evidence. Repeated uses
  only change the sarcasm. See
  `docs/features/cash-only-glp1-telehealth.md`.
- Alerts use Critical, Action required, Informational, and Flavor priorities.
  Useful information always appears plainly, humor never obscures a critical
  alert, and every visible row shares one chronological stream. Attention rows
  receive `!` while active but are never pinned; resolution clears the marker
  without deleting or retimestamping the row. The complete message bank and
  activation boundary are in
  `docs/features/alert-notification-flavor-system.md`.
- Bankruptcy recovery does not require loans.

## Time

- Facility time and learning time are separate clocks.
- Facility operations occur only while the game is open and unpaused.
- FSRS uses real-world time and continues while the game is closed.
- A clinical decision does not silently pause facility time.
- The player must have an obvious Pause control.
- The active browser holding the writer lease computes facility progress through
  renderer-independent deterministic rules.
- Fixed logical steps and scheduled events determine operational truth;
  animation frames do not.

For facility-time purposes, "open" means that the browser page is visible:

- Facility operations automatically pause when the page becomes hidden,
  including a tab switch, browser minimization, phone lock, or mobile
  application switch.
- Merely losing keyboard focus while the page remains visible does not
  automatically pause the facility.
- The game does not simulate or catch up hidden elapsed facility time.
- On return, the facility remains paused until the player explicitly selects
  Resume.
- A large unobserved time gap, such as laptop sleep, is treated as paused time.
- An unanswered clinical decision remains available across automatic pause.
- The real-world FSRS clock continues while facility operations are paused.

This accepted rule is recorded in
[ADR 0007](docs/adr/0007-pause-when-hidden.md).

The cloud validates and stores accepted save revisions for synchronization but
does not continuously execute the pilot facility. This accepted private-pilot
authority and integrity boundary is recorded in
[ADR 0017](docs/adr/0017-browser-authoritative-facility-simulation.md).

## Progression

- Money and educational XP are distinct.
- Level advancement uses defined accomplishments, XP, and satisfaction above 90% at the moment the player selects Level Up.
- No separate cash-balance condition is required for level advancement.
- Construction costs create the financial constraint.
- Level 0 begins with only the founder-operated Front Desk and exterior door.
  Its formal Level 1 gate is the configured XP target, satisfaction above 90%,
  and one Examination Room; the two protected tutorial patients teach the loop
  but are not a separate encounter-count requirement.
- Level 1 unlocks the Bathroom, Waiting Room, Imaging Control Room, X-ray Room,
  Minor-Procedure Room, Receptionist, and Imaging Technician. Its prototype
  completion gate is the configured XP target, satisfaction above 90%, the
  functioning X-ray Room, Minor-Procedure Room, and an Imaging Technician.
  X-ray functionality implicitly validates its adjacent Imaging Control Room
  and required doors, so the control room is not a redundant separate goal.
  Bathroom, Waiting Room, and Receptionist remain useful optional purchases
  rather than formal gate items.
- A hired Receptionist automatically walks to and refills a water cooler after
  it has remained empty for the configured 60 facility minutes while that
  Receptionist is employed. The task and its route persist through reload.
- The laboratory and APP are later-level systems and are not Level 0-1 unlocks.
- The complete current prototype checklist is maintained in
  [Level 0-1 Prototype Progression](docs/features/level-0-1-progression.md).
- The accepted complete progression is Level 0 Starter Clinic, Level 1 Basic
  Clinic, Level 2 Expanded Outpatient / Endoscopy, Level 3 Ambulatory Surgery
  Center, Level 4 Specialty Expansion, and Level 5 Optimized ASC / Prestige.
  Exact room/staff unlocks and the semantic clinical release points are
  maintained in
  [Facility Levels and Clinical Release Points](docs/features/facility-levels-and-clinical-release-points.md).
  Hospital OR, Hospital Floor, ED/Trauma, and ICU content remains deferred with
  no invented numeric level.
- Facility stage, educational difficulty, clinical complexity, room upgrade level, and employee training level are separate concepts.
- Room and employee upgrade/training tracks each use Levels 1-5.
- The end-game challenge is an elective inspection week with a score and recognition tier.
- Continued play and later inspection reattempts remain possible.

## Randomness

- Every campaign stores a seed.
- Randomness may affect identities, appearance, eligible variants, arrivals, events, breakdowns, call-offs, and unavoidable complications.
- Randomness must not change clinical truth.
- Randomness must not prevent essential educational content.
- Progression-critical events are guaranteed once eligible.
- Probabilities are evaluated per eligible task or unit of facility time, never per animation frame.

The accepted implementation uses a permanently pinned, project-owned
`xoshiro128**` randomness contract. One strong campaign root seed derives
independent named streams for unrelated purposes; stream states and counters
are saved. Candidate ordering and number mapping are stable and unbiased.
`Math.random()` is prohibited in domain rules, and the game generator is never
used for security.

The same seed reproduces a sequence only when the pinned versions, adopted
clinical content, prior state, eligibility, and player actions also match.
This accepted design is recorded in
[ADR 0018](docs/adr/0018-versioned-named-random-streams.md).

## Visual and interaction direction

- Top-down management view
- Central visible facility
- Compact contextual panels
- A low-chroma limited palette of neutral ivory, weathered stone, gray-olive,
  muted moss, and charcoal that does not drift into a dominant blue cast, with
  restrained accents
- Crisp, detailed Game Boy-inspired pixel art with recognizable people,
  rooms, furniture, and medical equipment
- Shallow cutaway room depth, material-specific flooring, and no construction
  grid during live play; the translucent logical grid appears only in
  Build/Renovate Mode
- Minimal one- or two-tone HUD pictograms and time controls provide visual
  rest while environmental and character art carries the detail
- Text as a deliberate, readable part of the illustrated style
- Legibility, cohesion, and visual depth without smoothing pixel edges
- Full desktop and phone functionality through responsive layouts
- Complete usability with sound disabled

The controlling quality bar and Level 1 golden-slice gate are recorded in
[`docs/features/visual-art-direction.md`](docs/features/visual-art-direction.md).
The lead agent may refine implementation details while preserving that art
direction, these interaction intentions, and full phone usability.

## Published clinical-content adoption

- Clinical, core-concept, and balance releases are independently published as
  complete, immutable, validated, recoverable versions.
- A campaign permanently retains its core-concept mastery denominator, balance
  release, scheduler integration and parameters, save-schema version, and
  random-generator version.
- A campaign records both its initial and current clinical release.
- A later complete clinical release may enter an existing campaign through a
  validated backward-compatible additive adoption.
- Compatibility must preserve every existing item revision and concept meaning,
  work with the campaign's pinned rules, leave its mastery denominator and
  eligibility unchanged, and avoid starving core content.
- Melissa controls whether a compatible release is distributed automatically,
  offered for player approval, or applied by an administrator.
- Every adoption preserves prior and new releases, trusted time, mode, actor,
  campaign revision, and validator/migration version.
- Newly added concepts begin with no FSRS history and remain supplemental for
  that campaign. They may support ordinary learning and rewards but cannot
  become new requirements for mastery, progression, inspection, or victory.
- Existing generated episodes remain frozen to their original clinical release
  and exact item revisions. New content affects newly generated material only
  unless a separately validated migration exists.
- Reviews retain the exact scored-decision revision the learner saw.
- Incompatible corrections, withdrawals, replacements, deletions,
  redefinitions, and schema changes require a separate controlled mechanism.

### Clinical withdrawal and correction

- Published items and historical reviews are never edited in place.
- Melissa may issue an append-only withdrawal targeting exact item revisions.
- The game stops newly selecting withdrawn material and fails closed for new
  scored clinical generation when its withdrawal manifest is too stale.
- Already-generated material remains version-frozen but may be bypassed or
  disabled without scoring; already-submitted responses remain immutable.
- Publisher-caused cancellation creates no penalty, reward, or exploitable
  patient revenue.
- Corrections require new approved item revisions, a new complete clinical
  release, and a validated replacement or migration package.
- A changed concept meaning requires a new concept identifier.
- Historical scored evidence is classified as valid, invalid, or affected by a
  redefinition. Invalid evidence is annotated, never deleted or silently
  rescored.
- A versioned repair may rebuild current FSRS state from remaining valid
  reviews using the campaign's pinned scheduler. Current mastery then uses valid
  evidence and may display Review Required After Content Correction.
- Money, XP, facility progress, levels, inspection outcomes, recognition, and
  victory already earned are never clawed back because of publisher error.
- A required concept with no valid presentation receives an audited temporary
  availability waiver for gates, without being marked mastered or enabling APP
  automation.
- Affected players receive a Melissa-approved correction notice. Clinical
  safety records are operational data, not research telemetry.

## First playable experience

The first minute should show a tiny facility, founder, entrance, one immediate
objective, basic resources, and a visible time state. The first protected
tutorial patient has exactly one immediately completing scored decision and no
timed service; its acknowledgement-only coach then points to the settlement,
disease-information flip, and explicit chart-resolution controls. The second
protected patient teaches a ten-facility-minute service, physical departure and
return, and a later sequential decision. Tutorial patients cannot walk out.

The tutorial must visibly teach that new charts begin in Waiting, opened charts
move to Active, the exclamation point and text label mean action is ready, and
completed charts file into the reopenable Resolved folder.

A chart does not enter Waiting merely because a patient sprite appeared. It
becomes clickable only when that patient physically reaches the Front Desk and
checks in. A returning patient reuses the same chart, and the next decision
becomes available only after the patient has physically returned and checked in
again. Opening the one active chart may send the patient toward an available
Examination Room, but ordinary walking does not hide or delay the readable
current decision. Timed care, results, and disposition still wait for the
persisted physical route and service state.

When a returned result or other current update unlocks a new decision, that
update appears in the main decision flow immediately above the new decision.
It is not relegated to the presentation column, where it could be overlooked.

Every moving character uses the same centrally configured walking speed and the
same persisted, cardinal-waypoint movement contract. Patients enter from a
campaign-stable left or right off-screen sidewalk origin, pass through the
public entrance, and reach the Front Desk before their chart appears. After
check-in they use an available authored, visibly rendered Waiting Room chair;
when every real chair is occupied, they use the available Front Desk waiting
position and then a non-overlapping sidewalk queue position. The simulation
must not invent an invisible chair or arbitrary standing location inside the
Waiting Room. Stationary chair occupants use a seated representation derived
from the same persisted appearance identity. Opening a chart reserves an
available Examination Room; when none exists, the patient remains at the
current waiting position rather than being teleported to a substitute room.

Outside Build Mode, clicking a reachable room, hallway, or sidewalk location
gives the founder a persisted walk-to-point task. A click on occupied fixture
art resolves to the nearest reachable legal floor tile. Dragging the map remains
a camera gesture and must not redirect the founder. Cleaning, cooler, employee,
patient, and other explicit interactions keep priority over ordinary walking;
an ordinary walk may be retargeted, but it does not interrupt facility work.

The exterior also admits occasional non-patient pedestrians from either
off-screen sidewalk boundary. They cross to the opposite boundary without
entering the clinic, checking in, creating a chart, or affecting workload,
finances, alerts, or satisfaction. Their timing, appearance, direction, and
route are campaign-stable and persisted; they use the same walking speed,
pause, fast-forward, interpolation, and off-screen lifecycle as other actors.

An off-site service is one continuous itinerary: the patient walks through the
public entrance to an off-screen sidewalk boundary, remains away, then walks
back through the entrance to the Front Desk. The displayed service duration
ends at that Front Desk return, and the next decision cannot become actionable
earlier. After check-in, a returning patient repeats the ordinary waiting
hierarchy and proceeds to the reserved Examination Room when the chart is
opened before visibly leaving after resolution. Normal departures and walkouts
likewise remain visible until the character has reached an off-screen departure
boundary. Save/reload, pause, and facility-speed changes preserve the same
route and destination; presentation interpolates that saved route and never
invents a fallback location.

Basic laboratory send-outs take one facility hour. Outsourced X-ray takes two
facility hours; a functioning onsite X-ray room with an available Imaging
Technician takes one facility hour and each room-technician pair has one-patient
capacity. Character rendering interpolates the persisted waypoint route rather
than owning movement completion, so walls, pause, speed changes, and reloads
cannot be bypassed by animation. Render interpolation retains a short predictive
buffer so ordinary timer and projection jitter cannot produce a repeated
sprint-stop cadence. High-frequency clock ticks stage the current state in
memory and serialize the complete local profile on deterministic quarter-hour
autosave boundaries; all meaningful player actions, pausing, and Save and Close
remain immediate write-through saves.

Every test-implying answer in a multistep decision displays a facility-time
return estimate before submission, not only the correct answer. Each choice
references an operational service whose route and tunable duration live in the
balance release rather than the clinical record. Wrong intermediate selections
remain wrong and proceed through the authored corrected-forward action; their
preview does not execute the selected wrong service.

Exact real clinical cases and correct answers require Melissa's review.
Prototype costs, rewards, timing, and tutorial wording may use clearly labeled
tunable defaults selected by the lead agent and revised after play.

## Restarting a campaign

- The player can choose Restart Campaign at any time.
- Restarting can never occur through one tap or click.
- The flow requires the initial Restart Campaign action followed by a clear,
  consequence-specific confirmation action.
- The final confirmation must distinguish campaign progress from the player
  account and explain the effect on that campaign's educational schedule.
- Restarting completes the current cloud save before changing campaign
  lifecycle state.
- The prior campaign becomes a recoverable, read-only archived campaign.
- The retry receives a new campaign ID, fresh facility progress, and a fresh
  campaign-specific FSRS schedule.
- The retry keeps the same campaign seed, core-concept set, balance release,
  FSRS integration version, and randomness version. Its initial clinical
  release is the prior campaign's current adopted clinical release at the
  restart transaction.
- Starting a separate New Campaign is the route for a new seed and current
  published releases.
- Restoring an archived campaign resumes its original facility and learning
  schedule; it never merges with the retry.
- Permanent deletion is a separate, more strongly warned operation governed by
  the later retention and deletion policy.

The archive and new-campaign creation succeed atomically or leave the original
campaign unchanged. This accepted rule is recorded in
[ADR 0012](docs/adr/0012-recoverable-campaign-restart.md).
