# Canonical Design

Status: Accepted product rules plus clearly marked design questions. Technical
implementation proceeds under ADR 0021.

Last updated: 2026-07-23

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

Recent mockup descriptions support a central top-down facility with compact
resource information and a patient chart or decision panel that overlays only
part of the facility, leaving activity visible. Patient navigation and urgent
alerts should remain easy to find. These are interaction intentions, not a
pixel-perfect final screen specification.

### Historical ideas that remain candidates

The following appeared in early brainstorming but are not automatically
canonical: the rich-grandfather opening joke and exact starting money;
searchable catalogs for every test, diagnosis, and treatment; cash for every
correct sub-answer; exact real-time-to-facility-time conversion; death,
lawsuit, or other punitive event details; and eventual expansion into a full
emergency department or hospital. The current accepted progression ends at an
optimized ambulatory surgery center. Research use also remains outside the
initial build unless separately authorized. The early idea of feeding
commercial question-bank questions or explanations into AI is not accepted;
clinical authoring must use permitted sources and original synthesis without
copying or close paraphrase.

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
- Every concept has an earliest facility stage at which appropriate patient
  encounters may begin; this is separate from educational difficulty, room
  upgrade level, employee training, and FSRS state.
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
- A patient may contain several sequential questions, but each independently
  scores one primary concept.
- Search and menus may support management or administrative controls, but they
  do not score clinical knowledge.

Concepts still recur through different meaningful patient presentations,
question wording, perspectives, distractors, and explanations rather than
repeating one memorized item. This accepted game-design rule is recorded in
[ADR 0023](docs/adr/0023-multiple-choice-clinical-assessment.md).

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
- The pharmacist manages medication inventory automatically.
- Medication stockouts lose dispensing revenue and may slightly reduce satisfaction; they do not block care.
- Outsourced diagnostic or repair fallbacks may exist.
- Vending machines and coffee kiosks are enclosed buildable rooms.
- The GLP-1 telehealth suite is a limited comedic side business, not the dominant strategy.
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
- Black-and-white or grayscale
- Simple large-pixel graphics
- Text as a deliberate part of the style
- Legibility and clarity before visual detail
- Full desktop and phone functionality through responsive layouts
- Complete usability with sound disabled

No final pixel scale, font, exact layout, or control scheme is fixed. The lead
agent may create and revise prototype layouts while preserving these
interaction intentions and full phone usability.

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

The first minute should show a tiny facility, founder, entrance, one immediate objective, basic resources, and a visible time state. The two tutorial patients should separately teach a clinical decision and the management consequences around arrivals, time, queues, and construction.

Exact real clinical cases and correct answers require Melissa's review.
Prototype costs, rewards, timing, and tutorial wording may use clearly labeled
tunable defaults selected by the lead agent and revised after play.

## Starting over

- The player can choose to start over at any time.
- Starting over can never occur through one tap or click.
- The flow requires at least one initial Start Over action followed by a clear,
  consequence-specific confirmation action.
- The final confirmation must distinguish campaign progress from the player
  account and explain the effect on that campaign's educational schedule.
- Starting over completes the current cloud save before changing campaign
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
