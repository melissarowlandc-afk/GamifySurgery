# Changelog

All notable implementation and project-record changes are listed here.

## 2026-07-28

### July 28 tutorial, clinic loop, and balance pass

- Rebuilt the first protected tutorial encounter as one immediate scored
  decision worth 20 Learning XP, followed by manually acknowledged guidance
  for settlement, disease information, and chart resolution; the second
  protected encounter now teaches a visible ten-minute result delay and
  follow-up decision
- Made tutorial guidance remain anchored after responsive reflow, kept its
  controls above the phone-width full-screen chart, and added explicit
  Alerts-and-Events, waiting-time, GLP-1, Build Mode, and progression coaching
  without letting the coach perform the highlighted action
- Delayed patient-chart creation until physical Front Desk check-in, routed
  checked-in patients to the Waiting Room, Front Desk, or sidewalk as capacity
  permits, and reused the same chart only after a returning patient physically
  checks in with results
- Kept the current chart decision immediately readable while a selected patient
  walks to the one available Examination Room; prior decisions collapse into
  reviewable summaries and the full chart scrolls vertically
- Replaced render-time tile jumps with persisted waypoint routes and
  frame-interpolated founder, patient, employee, and onsite-service movement;
  logical routes still own completion so pause, reload, and 1x/2x/4x remain
  deterministic
- Centralized laboratory, outsourced X-ray, and staffed onsite X-ray service
  times at 60, 120, and 60 facility minutes and limited concurrent onsite
  X-rays to the number of both functioning rooms and available technicians
- Completed the Build/Renovate toolbar, centered room-upgrade controls,
  exact upgrade confirmation, zero-cost door placement/removal, session Undo,
  and a blocking invalid-layout dialog that lists every correction beside
  Done/Save and Return
- Added persistent advertising tiers, contextual receptionist/imaging/amenity
  guidance, visible water-cooler and litter interactions, cleanliness scuffs,
  mock walkout reviews, and cooldown-aware compact alert behavior
- Added confirmed employee firing, percentage-only morale, unpaid-expense morale
  decline and quitting, cash clamping at zero, and a $25 low-cash GLP-1 action
  whose only usage limit is its persisted one-facility-hour cooldown
- Retuned Level 0 starting cash to $120 and shifted the room economy toward
  higher construction prices with lower upkeep while retaining the accepted
  Level 0/1 payment formulas and 150-XP Level 1 gate
- Added focused domain, UI, launcher-boundary, responsive tutorial, chart,
  Build Mode, movement, service-capacity, save/reload, and browser-walkthrough
  regression coverage plus current desktop and phone handoff captures

### Level 1 visual golden slice

- Corrected the cutaway projection so each saved room footprint remains the
  exact immutable floor area while exposed rear-wall faces project as a
  north-side visual bonus outside that footprint
- Replaced decorative ajar door leaves with grounded wall openings, jambs, and
  thresholds appropriate to shared interior boundaries and exposed rear walls
- Added baseline-Y room occlusion so people render in front of furniture when
  south of it and behind furniture when north of it, without changing routing
  or interaction state
- Repositioned room furnishings around plausible real-world walls, work areas,
  and clearances rather than mechanically centering every object
- Lightened the surrounding land, irregularized landscaping placement to avoid
  visible planting columns, and extended the illustrated ground and sidewalk
  through the available map zone without blank space beneath the sidewalk
- Adopted **Stitchin' Time** as the player-facing title while preserving
  `GamifySurgery` technical identifiers for launcher, Pages, and save
  compatibility
- Made rear dollhouse walls building-envelope aware: north/south room contacts
  now preserve each room's independent floor footprint and grounded interior
  thresholds, while partial contacts retain only the exposed northern wall
  segments
- Enlarged map characters by roughly 50% at the normal camera scale, added a
  restrained contrast keyline, and made presentation size follow camera zoom
  without changing canonical identities, logical routes, or foot anchors
- Reworked HUD resource symbols into boxless outline pictograms for the
  scalpel, money bag, satisfaction face, and facility clock
- Added higher-detail secondary furniture and equipment plus deterministic
  room-upgrade finish and equipment layers so upgraded rooms look more modern
  without changing footprints or gameplay
- Corrected the over-blue refinement toward the visual reference's
  low-chroma ivory/stone/gray-olive range, coordinated and landscaped the
  clinic grounds, and retained restrained skin warmth and minimal HUD symbols
- Rebuilt the room projection as a grounded dollhouse cutaway: rear wall
  faces now have caps and floor-contact lines, side walls step down to low
  returns, front walls form a cutaway lip, and rear-wall doors are upright
  openings that begin at the floor rather than floating from the top edge
- Reduced and contained map-character proportions below the rear-wall line,
  added more visibly distinct head/body treatment, and expanded signature
  room furniture into higher-native-detail pixel assets
- Increased Level 1 room density with wall fixtures, clinical controls,
  cabinetry, supplies, rugs, contact shadows, trees, shrubs, and flower beds
  while keeping every room, fixture, door, and character independently
  interactive
- Replaced the facility's geometric room and furniture placeholders with a
  reusable repo-native pixel-cell art system, coordinated low-chroma
  ivory/stone/gray-olive/moss/charcoal palette, room-specific floors,
  thick walls, detailed
  doors, shadows, equipment, furnishings, exterior, and landscaping
- Refined the golden slice with shallow rear-wall cutaways and side returns,
  distinct low-contrast floor materials, a completely hidden live-play grid,
  and a translucent construction-only grid over the same persisted clinic
- Increased the canonical map renderer from 20x30 to 24x36 native cells,
  introduced a separate 38x42 identity-linked portrait renderer, and enlarged
  the underlying fixture drawings with controls, seams, handles, cushions,
  supplies, highlights, and contact detail rather than smoothing or scaling
- Kept the Learning XP, Money, Patient Satisfaction, Facility Time, pause,
  play, and speed symbols deliberately simple one- or two-tone pictograms
- Added illustrated Level 1 interiors for the Front Desk, Waiting Room,
  Examination Room, Bathroom, X-ray Room, Imaging Control Room, and
  Minor-Procedure Room without changing footprints, routing, build rules, or
  gameplay
- Replaced separate CSS portrait shapes and Phaser character blocks with one
  persisted layered character renderer shared by creator previews, map
  sprites, front/side/back and walking poses, portraits, staff and patient
  cards, and the founder star jump
- Deterministically enriched older saved appearances with skin, head/body
  variant, and role-clothing fields while preserving legacy campaign identity
- Added original pixel icon assets for the HUD and build cards, refined
  paper-like panels and tactile controls, and hid Prototype Tools during
  ordinary gameplay
- Added a developer-only canonical character QA gallery and actual-app
  desktop, phone, and identity-comparison screenshot coverage
- Fixed stable desktop map sizing, the collapsed one-pixel phone facility
  canvas, and dialog stacking so phone tutorial copy cannot trap restart or
  campaign controls
- Replaced older simple-grayscale wording with the controlling visual
  source-of-truth and an explicit owner-approval gate before later-level art

## 2026-07-27

### July 27 Level 0/1 integration

- Added the staged login shell, named multiple-clinic campaign screen,
  normalized-name protection, rich-and-happy no-save branch, and recoverable
  archive-and-restart flow with fresh campaign-specific FSRS histories
- Expanded the founder creator to ten interchangeable heads and bodies and
  reused the same persisted appearance definition for creator, map, portrait,
  walking, and happy-ending animation
- Replaced hourly ticks with persisted simulated minutes, 1x/2x/4x controls,
  irregular arrivals, quarter-hour fixed-point operating-cost postings, and
  reload-safe GLP-1 cooldown progress
- Completed the unpublished save-schema-v5 normalizer for movement,
  satisfaction, timing, environment, explicit doors, and current-level XP while
  retaining deterministic migrations from schemas 1-4
- Replaced Patient Confidence and the daily modifier with individual patient
  satisfaction, configured care/environment/staff effects, save-stable walkout
  thresholds, physical departures, and rolling completed-encounter clinic
  satisfaction
- Added persisted patient routes for arrival, check-in, care, off-site testing,
  return, room-bounded idle behavior, normal exit, and walkout; gameplay state,
  not Phaser animation callbacks, owns task completion
- Added sequential reviewable single-select decisions, prominent answer
  feedback, 10/2 current-level XP, Level 0/1 payment formulas, and required
  authored consequence text for every wrong final choice
- Raised the rare absolute encounter maximum to four only from Level 3 onward
  and changed the Level 1 XP gate to 150 current-level XP
- Added explicit zero-cost doors, fixed-fixture room upgrades, build-session
  Undo, room movement/rotation/sale, exact access-blocking explanations, a
  fixed bounded site, and a functioning-X-ray goal whose control-room
  prerequisite is validated without a redundant checklist item
- Added event-driven compact alerts, live litter/water/praise interactions,
  consistent patient locators, a 10%-250% bounded facility camera, and the
  current detailed monochrome pixel-art chart/HUD/facility treatment
- Rebuilt the browser test suite around the current opening and routing flow;
  the final matrix passes 39 scenarios with 13 intentional profile skips

### Desktop launcher reliability

- Replaced the mutable page-description fingerprint with a dedicated
  machine-readable launcher health contract
- Added an explicit loopback TCP preflight so HTTP-error, unresponsive, and
  non-HTTP occupants of port 4173 are reported as port conflicts before npm
  installation or Vite startup
- Added launcher-contract and Pages-build verification to prevent the health
  endpoint from silently drifting again

## 2026-07-26

### Level 0/1 opening

- Added the minimal founder creator, sparse inheritance decision, genuine
  rich-and-happy non-game ending, and guarded one-time clinic initialization
- Persisted founder identity and appearance in save schema v4 with a
  deterministic migration for earlier local campaigns
- Changed a fresh browser profile to contain no placeholder campaign or FSRS
  state before the player selects the clinic path

### Level 0/1 playthrough and visual refinement

- Rebuilt the gameplay composition around a stable upper facility and a
  dedicated lower desk that holds either the paper patient chart or Build Mode
  tools without moving the clinic whenever a chart opens
- Applied the current monochrome pixel-art direction with a segmented HUD,
  tactile controls, consistent founder/patient portraits, recognizable room
  interiors, a full-width sidewalk and entrance, landscaping, staff/patient
  occupancy, and a full-screen phone chart
- Expanded the buildable site to 24 columns: the ordinary camera stays centered
  on the tiny founder clinic, while zooming out in Build Mode reveals additional
  construction space without changing the facility viewport
- Added candidate-door validation, direct room-to-room attachment, functional
  hallway branching, deterministic route validation, visible door rotation,
  safe selling checks, and south-entrance employee arrival
- Reconciled Level 0 and Level 1 progression with the latest owner checklist:
  Level 0 requires XP, satisfaction above 90%, and one Examination Room; the
  Level 1 completion preview requires XP, satisfaction, the Minor-Procedure,
  Imaging Control, and X-ray rooms, plus an Imaging Technician
- Separated immediate per-decision Learning XP from encounter-completion money;
  answer correctness now changes patient confidence and a small daily
  satisfaction modifier that resets at day rollover rather than permanently
  ratcheting satisfaction
- Slowed the prototype to a five-minute ten-hour clinic day and approximately
  one routine arrival per real minute, while keeping the first tutorial result
  and the quiet beat between tutorial patients short enough for onboarding;
  those onboarding timers now respect explicit pause state
- Added bounded delay pressure at the late and final waiting warnings, plus a
  one-point satisfaction benefit when an enabled in-house X-ray result returns
- Protected Level 0 recovery arrivals from waiting abandonment so repeated
  tutorial mistakes or neglect cannot permanently lock the strict
  satisfaction gate
- Simplified the first and third tutorial prompts, added the PHI/examination-room
  alert, preserved tutorial-off controls, and made callouts wait for chart
  animations before positioning beside the actual control
- Raised the temporary emergency GLP-1 availability threshold to less than $200,
  kept its hourly cooldown and no-XP behavior, and increased early construction,
  salary, and staffing pressure through centralized balance values
- Added desktop, compact-desktop, and laptop browser coverage for the opening
  branches, one-time initialization, save/reload, campaign-scoped FSRS, the
  full Level 0-to-Level 1 path, tutorial geometry, Build Mode, and chart
  usability, with retained Pixel 7 chart/workspace regression coverage
- Added a Windows-safe E2E runner that owns the Vite test server lifecycle,
  closes it deterministically after Playwright completes, and still permits an
  already-running local server to be reused

### Clinical evidence infrastructure

- Added a player-isolated `clinical-research` contract for append-only evidence
  gaps and revisions, exact literature-search runs, metadata candidates,
  screening, source relationships, operation-specific rights, reviewed
  evidence contributions, expert opinions, synthesis review, and
  content-change proposals
- Added conservative derived **Known / Needed / Blocked / Next actions** briefs;
  unreviewed candidates and unaccepted synthesis text cannot appear as known
  clinical information
- Added metadata-only PubMed and Crossref scouts with literal strategy
  provenance, bounded serial requests, contact identification, caching,
  backoff, sanitized failures, and no abstract or full-text retrieval
- Added canonical publication deduplication for DOI, PMID, provider-record,
  and exact manual-metadata identities while preserving immutable per-run
  Candidate Observations and independent screening decisions for every
  Evidence Gap
- Added a resumable private intake pipeline with ignored-root confinement,
  byte-level type checks, streaming fingerprints, explicit rights/no-PHI
  acknowledgment, locks, atomic checkpoints, immutable extraction artifacts,
  deterministic PDF/DOCX/text chunks and locators, and OCR-required detection
- Isolated default PDF/DOCX parsing behind a bounded worker with timeout,
  memory/stack, page/block, and extracted-character limits
- Added a sanitized bridge that reads a fixed validated authoring workspace and
  exposes only IDs, labels, and human-verified citation metadata to the
  evidence queue
- Added the loopback-only Clinical Context Workbench with immutable
  content-addressed revisions, optimistic concurrency, queue-oriented review
  commands, local evidence briefs, server-resolved reviewer identities, and
  development launch support
- Added deterministic suggestions for synced authoring targets that lack an
  Evidence Gap, with one-click prefill of a reviewable authoritative-metadata
  PubMed strategy; suggestions never create or approve a record automatically
- Completed human rights-review forms for written permission and narrow
  fair-use assessment, and restricted acceptance of Expert Opinion into Known
  to owner or clinical-reviewer profiles
- Added build-time dependency and generated-bundle guards preventing the
  player, GitHub Pages build, and runtime packages from importing private
  Workbench, authoring, research, source, or credential material
- Recorded the official ABSITE/SCORE coverage-source provenance and the
  copyrighted-source boundary; no textbook, commercial question-bank,
  clinical approval, paid API, or runtime publication was introduced

## 2026-07-25

### Implementation

- Began the local `beta` clinical-authoring workstream with a standalone,
  runtime-isolated Zod contract for Sources and immutable Source Snapshots,
  coverage frameworks, Clinical Topics and exact sections, structured facts,
  Tested Concepts, practice-question capture, citations, and resumable
  extraction batches
- Replaced the short-lived local beta-v1 authoring shape with schema v2:
  immutable coverage-framework nodes are separate from many-to-many Draft
  topic mappings, controlled values use stable IDs, related-topic links are
  typed, revisions record authors, and validated active leaves drive current
  reporting without losing historical extraction evidence
- Added explicit source-rights decisions, artifact SHA-256 identity,
  citation-use and human-verification audit fields, exact snapshot/locator
  provenance, current-versus-historical conflict handling, and stronger
  public-fixture safety checks
- Added a strict 17-table local manual-authoring CSV interchange initializer
  and compiler with
  staged no-clobber initialization, exact file/line diagnostics, validated
  base-workspace merging, canonical JSON output, and an offline source
  fingerprint command; extraction jobs, AI suggestions, patient/question
  records, and releases remain outside this initial CSV subset
- Clarified that the CSV layout is technical interchange rather than the final
  owner-friendly Google Sheet, and that private copyrighted source artifacts
  require a separate encrypted backup rather than this public repository
- Expanded clinical-authoring validation coverage; textbook ingestion, real
  clinical drafting, patient/question authoring, publishing, database
  migrations, owner authentication, and paid AI remain deferred
- Replaced the single first-chart prompt with a deterministic Level 0 tutorial
  coach that explains the chart, scored decisions, off-site results, returned
  charts, feedback, resolution, goals, Build Mode, room placement, and the
  explicit Level 1 advancement action
- Added contextual target outlines and animated tutorial arrows, plus concise
  sarcastic tutorial flavor; the Prototype tools tutorial toggle still disables
  the full guided sequence
- Replaced tutorial proxy actions with state-driven guidance attached to the
  real game controls: the player now opens, answers, resolves, builds, and
  advances through the actual interface instead of operating the game from the
  coach bubble
- Added runtime target measurement, collision-aware bubble placement, direct
  target beacons, viewport updates, and chart-wide avoidance so tutorial
  guidance remains visibly connected to its control without covering the chart
  at large, compact, or laptop desktop widths
- Reduced the artificial first result from three facility hours to one and
  made the first tutorial result return automatically after about four real
  seconds; the second tutorial patient now arrives immediately after the first
  chart is filed
- Added state-driven Level 1 introductions for the facility clock, the first
  routine arrival, synthetic service-drill decisions, off-site testing waits,
  result return, and the next real decision, including plain-language
  in-game-hour and approximate real-time estimates
- Replaced the temporary Level-goals popover with an always-visible,
  internally bounded Goals panel whose complete checklist and advancement
  button remain available without covering the clinic
- Made the Build Mode control remain in one location while changing between
  Enter and Exit, disabled the misleading Resume action during construction,
  and added an unmistakable paused/build-state banner over the facility
- Reworked the compact-desktop chart into a deliberate portrait/presentation
  row plus full-width decision row, with visible scroll guidance and no silently
  clipped answer column
- Fixed room preview double-rotation, added a full high-contrast footprint,
  explicit rotated door/approach markers, and domain-exact connectivity status
  so a placement checkmark means the click can actually build
- Fixed a React StrictMode/Phaser lifecycle race that could leave an inactive
  canvas above the live facility and make apparently valid room clicks do
  nothing
- Increased key pause, zoom, chart, placement, and tutorial text sizes and
  updated the in-game Help guide to match the permanent goals and placement
  interfaces
- Added an owner-authorized GitHub Pages deployment workflow for pushes to
  `main`, a repository-base-path build, and generated-asset verification for
  the public browser-local playtest
- Expanded deterministic tests to 62 unit tests: 41 game-domain and 21 player
  tests, plus full, compact, and laptop desktop tutorial-position checks and
  the complete Level 0-to-Level 1 walkthrough

## 2026-07-24

### Accepted

- Single-select multiple-choice assessment for every scored clinical concept,
  with exactly one correct answer per Question Variant
- One to three sequential scored questions per patient encounter, each testing
  a different primary concept, with dependency-aware feedback timing
- Basic patient revenue with modest capped correctness benefits, small bounded
  mistake consequences, anti-farming rules, and guaranteed tutorial funding
- Waiting, Active, and Resolved patient-chart lifecycle with pending-result
  status, action-required exclamation points, a required approved final
  learning summary with optional viewing, and read-only reopening
- Transparent, capability-based facility-time result delays with visible
  pending status and ETA, slower outsourcing, faster functioning in-house
  services, and deterministic prototype timing
- Fair Waiting-patient patience with visible warnings, first-open Active-case
  protection, capped delay consequences, and non-abandoning tutorial patients
- Total clinic-workload capacity with pre-Waiting routine-arrival backpressure,
  protected critical reserve, and no capacity-based patient eviction
- Correction-forward nonfinal errors plus deterministic, clinically approved
  terminal outcomes for appropriate wrong final answers

### Documentation

- Added ADR 0023 and resolved G-001 for multiple-choice clinical assessment
- Added ADR 0024 and resolved G-001A for variable-length patient question
  sequences
- Added ADR 0025 and resolved G-001B for bounded clinical-answer consequences
- Added ADR 0026 and resolved G-001C for the patient-chart lifecycle
- Added ADR 0027 and resolved G-001D for transparent result timing
- Added ADR 0028 and resolved G-001E for patient patience and abandonment
- Added ADR 0029 and resolved G-001F for clinic workload and arrival backpressure
- Added ADR 0030 and resolved G-001G for incorrect-answer case continuation and
  terminal clinical outcomes
- Reconfirmed campaign-scoped FSRS with fresh learning state for every new
  campaign and every newly adopted concept; no learning state carries between
  campaigns
- Clarified that the accepted Supabase mechanism is conventional verified
  email and password with email verification and recovery; “passphrase” refers
  only to using a long password
- Marked the historical responsive-browser and staged-deployment proposals
  complete through their later accepted ADRs without authorizing deployment

### Implementation

- Added a one-click Windows launcher that refreshes dependencies, starts and
  verifies the local server, opens the browser, and stops only its owned server
- Added automatic first-run chart coaching, an animated chart callout,
  persistent tutorial controls, and a responsive in-game beginner Help guide
- Consolidated repeated visible clinical-status warnings into the existing
  striped chart notice while preserving review and source metadata
- Created a private npm-workspace monorepo with a responsive React player,
  Phaser facility renderer, renderer-independent TypeScript domain package,
  validated clinical-content package, and validated balance package
- Expanded the local-only grayscale candidate through facility Levels 0 and 1:
  two guaranteed introductory patients, the examination-room and Level Up gate,
  seeded routine arrivals, Level 1 rooms, staff hiring, operating expenses,
  dependencies, queue pressure, and full and compact desktop layouts
- Changed facility pacing to a continuous 8 AM-6 PM operating day lasting five
  real minutes, with one facility hour every 30 seconds and Level 1 routine
  arrivals no faster than about one patient per real minute
- Added reproducible, independently seeded patient identities and pixel
  appearances plus frozen answer-order shuffling that survives save/reload and
  can be disabled for an authored question when order is meaningful
- Rebuilt the chart as a large multi-column workspace showing the patient,
  presentation, prior decisions, results, and next question together; completed
  charts flip to the learning summary before explicit resolution
- Expanded result routing so multi-step patients visibly leave for off-site
  testing and return action-ready, while a staffed and connected Level 1 X-ray
  capability provides route-aware in-house service whose displayed duration
  includes the patient's frozen round-trip hallway travel
- Added an explicitly entered, automatically paused Build Mode with a build-only
  grid, camera zoom/pan, repeatable rotatable rooms, explicit doors, functional
  hallways, upgrades, and safe sale for a 25% refund
- Added generated employee names and appearances, role caps, salary adjustment,
  morale response, room assignment, reachability checks, and visible staff
  movement; new hires remain unavailable until their persisted entrance route
  reaches the assigned room
- Added a data-driven four-priority alert system with clickable actionable
  alerts, a lower-priority ticker/recent-event log, escalation consolidation,
  cooldowns, deterministic flavor selection, accessibility distinctions that
  do not rely on color, and humor suppression during active critical alerts;
  visible system notices now cover saves, campaign creation/restoration/reset,
  hidden-tab pause, and accelerated testing
- Preserved the complete future alert and flavor bank in
  `docs/features/alert-notification-flavor-system.md` while activating only
  definitions connected to current Level 0/1 mechanics
- Added a bounded manual emergency GLP-1 cash action that appears below $100,
  enforces a facility-hour cooldown and configurable daily cap/diminishing
  payment, rotates the approved sarcasm after repeated daily use, and grants no
  XP, FSRS update, concept mastery, or ordinary patient-care reward
- Added a pinned `ts-fsrs` 5.4.1 FSRS-6 adapter with campaign-owned card state,
  immutable scheduler pins, Good/Again mapping, real review timestamps, and no
  inherited learning history between campaigns
- Added conspicuously synthetic or clinically unapproved original fixture
  content for the interface tutorial, draft laceration, uncomplicated abscess,
  postoperative escalation, and symptomatic cholelithiasis gameplay paths
- Added Zod validation for prototype clinical content and balance configuration,
  including one-correct-answer rules, one-to-three-node limits, unique concept
  use, complete wrong-final-answer dispositions, result-route references,
  facility-stage eligibility, room/staff dependencies, patience warnings,
  satisfaction bounds, and worst-case tutorial funding
- Added a pure deterministic reducer for Waiting, Active, pending-result,
  summary-available, and Resolved states; scheduled FSRS reviews; frozen result
  timing; idempotent commands; bounded patient settlement; routine arrivals,
  patience and capacity; room placement; hiring; expenses; and level gates
- Added a versioned browser-local profile with multiple switchable campaigns,
  save/reopen, a deterministic unpublished-save migration, automatic hidden-tab
  pause, explicit Resume, and a two-step recoverable same-seed Start over
  action; opening its confirmation pauses facility time, cancellation restores
  the prior pause state, and the separate Create fresh campaign action uses a
  new seed
- Added development fast-forward and campaign, review-count, and per-concept
  FSRS card/due-time inspection controls for repeated balance testing
- Added a reducer-owned, centrally configured **Add $100** development command,
  an open-by-default left-side Prototype tools panel, and a two-step
  **Restart game** control inside that panel
- Reworked the desktop shell into a bounded full-window workspace with
  internally scrolling sidebar and construction panels, width-aware room and
  staff cards, sticky panel headings, and compact-desktop coverage
- Kept the live clinic visible above an open chart and synchronized Phaser's
  backing bitmap with responsive host resizing so build clicks remain mapped
  to the correct logical tile
- Added an explicit Level 1-complete, Level 2-locked prototype state
- Ordered Resolved charts by most recent resolution while preserving the
  existing Waiting and Active ordering
- Removed repeated caveat language from player-visible case presentations,
  questions, explanations, and summaries while retaining one striped chart
  warning plus all source and clinical-review metadata
- Deferred further phone-specific interface refinement until after the current
  desktop walkthrough
- Bounded transient operation receipts and event notices to the latest 500
  records so long local sessions do not grow those presentation logs without
  limit
- Focused the active Playwright walkthroughs on full and compact desktop
  widths; phone-specific regression and polish remain deferred
- Expanded the deterministic Vitest inventory to 49 unit tests: 41
  game-domain tests covering rules, timing, saves, FSRS, randomness,
  construction, staffing, and the emergency action, plus 8 player tests for
  alert data, routing, consolidation, cooldowns, and flavor selection

### Prototype boundaries

- The implementation contains synthetic placeholder content only; it is not
  clinically approved, medical advice, or suitable for real patient data
- No PHI, player accounts, backend, cloud save, administrator website,
  telemetry, research collection, public deployment, or external pilot access
  was added
- The accepted Supabase verified-email/password identity and cloud-save model is
  intentionally staged after the local slice under ADR 0022; browser-local
  campaigns do not replace it
- Real clinically approved content, broad content authoring, the Clinical
  Content Workbench, Supabase, cross-device saves, and deployment remain
  deferred
- Full due-prioritized, interleaved, repetition-aware encounter selection is
  deferred; card updates and due inspection are present
- Level 2 and later management systems are not implemented
- The automated Level 2 GLP-1 suite and GLP-1 NP staffing are not implemented;
  only the bounded founder-run emergency action is present
- Alert definitions tied to maintenance, inspections, later rooms, or other
  unimplemented mechanics remain documentation-only
- Phone-specific usability polish remains deferred; current implementation
  work targets full and compact desktop browser windows

### Verification

- `npm test` passed all 49 unit tests: 41 game-domain and 8 player
  alert/view-model tests
- `npm run typecheck` passed for the player, balance, clinical-content, and
  game-domain workspaces
- `npm run build` produced the local Vite build successfully
- `npm run test:e2e` passed the desktop Level 0/1/save/campaign walkthrough and
  storage-failure safety check plus large- and compact-desktop layout checks:
  5 passed, 3 intentionally skipped
- Vite reported a non-blocking large-chunk warning for the Phaser-containing
  JavaScript bundle; code splitting remains a pre-deployment optimization

## 2026-07-23

### Accepted

- TypeScript as the primary client and shared-domain language
- React for text-heavy, responsive, and accessible interface elements
- Phaser for the top-down 2D facility renderer and direct map interaction
- Pure TypeScript game rules kept independent of React and Phaser
- One private monorepo with separately built applications and strongly bounded
  shared packages
- Integer logical tile grid with footprint-based rooms, explicit doors and
  fixtures, and deterministic A* pathfinding
- Automatic facility pause when the browser page is hidden, with no hidden-time
  catch-up and explicit Resume on return
- Supabase-managed PostgreSQL with protected logical domains, row-level
  security, trusted server functions, migrations, and owner-controlled exports
- Invite-only Supabase Auth using verified email and a conventional permanent
  password, with long passphrases encouraged, email-based recovery, and hidden
  internal ownership identifiers
- Local-only administration during the vertical slice, followed by a separate
  private deployment with an outer gate, TOTP MFA, roles, server enforcement,
  audit records, and Melissa-only clinical approval
- Versioned hybrid saves with an operational snapshot, immutable educational
  and finance evidence, transactional migrations, revision checks, one active
  writer, explicit takeover, and bounded local recovery
- A Start Over option available at any time through at least two deliberate
  actions and a clear consequence warning
- Recoverable Start Over behavior that archives the prior campaign and creates
  a fresh campaign ID with the same seed and pinned releases
- FSRS-6 through a pinned `ts-fsrs` dependency behind a project-owned adapter,
  with campaign-pinned settings, reproducible scheduling, default model
  parameters initially, no optimizer, and validated upgrades only
- A fixed 90% FSRS desired-retention target for the pilot, stored in the
  immutable balance release and pinned by each campaign
- One alternate-variant remediation encounter after an Again response, eligible
  after 30 real-world minutes and limited to once per concept and learning date
- One confirmed IANA learning timezone per account, with immutable historical
  learning dates and prospective-only preference changes
- Exactly one primary FSRS concept per scored clinical decision, with
  independently scored nodes or encounters for additional concepts
- Independent complete immutable clinical, core-concept, and balance releases,
  with permanent nonclinical campaign pins and controlled forward adoption of
  compatible complete clinical releases
- Immutable clinical-adoption history, supplemental new concepts, and exact
  clinical-item freezing for generated episodes and scored reviews
- Append-only emergency clinical withdrawals and new-version correction
  packages, with non-destructive evidence classification and FSRS repair
- No publisher-error clawbacks and audited availability waivers that prevent
  content withdrawal from softlocking a campaign without fabricating mastery
- Browser-authoritative deterministic facility simulation using pure TypeScript
  fixed logical steps and scheduled events, with cloud validation and
  synchronization but no continuously running pilot simulation server
- A private-pilot integrity boundary that does not claim tamper-resistant
  facility results for competition, assessment, or research
- A versioned project-owned `xoshiro128**` randomness contract with a strong
  campaign root seed, SHA-256-derived independent named streams, persisted
  state and counters, stable unbiased selection, and golden fixtures
- Randomness kept outside clinical truth, security functions, and
  progression-critical guarantees
- Hybrid PostgreSQL storage with normalized identity, authoring, publishing,
  audit, learning, finance, and frozen clinical records plus one validated
  versioned JSONB operational campaign snapshot
- Foundational requirement for a dual-purpose Clinical Topic knowledge base and
  clinically approved runtime teaching library
- Facility-stage availability for concepts, constrained seeded scenario
  instantiation, AI drafts confined to administration, and no live AI clinical
  generation
- Long external or AI-generated design prompts are advisory inputs that must be
  reconstructed chronologically and reconciled with accepted decisions before
  use
- Delegated technical decision-making and prototype-first delivery, with owner
  gates retained for game and clinical intent, privacy/research, external
  access, spending, legal, public, and destructive actions
- Local playable prototype followed by a coherent local vertical slice,
  staging, and an invite-only private browser pilot
- Private Google Sheets as the temporary clinical authoring source, with
  protected identifiers, validated GitHub export backups, a small trial, and a
  one-way handoff to the future admin database

### Proposed, not approved

- First real clinical concept or small concept set
- Opening story and later pilot participation details

### Documentation

- Added ADR 0004 for the approved client stack
- Added ADR 0005 for the approved repository organization
- Added ADR 0006 for the approved facility spatial model
- Added ADR 0007 for the approved hidden-page facility-time rule
- Added ADR 0008 for the approved backend and database foundation
- Added ADR 0009 for the approved player authentication mechanism
- Added ADR 0010 for the approved staged administrator security architecture
- Added ADR 0011 for the approved save and cross-device conflict architecture
- Added ADR 0012 for the approved recoverable Start Over lifecycle
- Added ADR 0013 for the approved FSRS implementation and upgrade boundary
- Marked R-001 resolved and narrowed the unapproved portions of the architecture proposal
- Marked R-004 resolved
- Marked R-002 resolved
- Marked R-003 resolved
- Marked R-005 resolved
- Marked R-011 resolved
- Marked R-012 resolved
- Marked R-006 and R-007 resolved
- Resolved Y-008 and completed the Start Over design direction
- Marked R-009 resolved
- Resolved Y-009 and added the first accepted numerical balance value
- Resolved Y-010 and documented bounded same-date remediation
- Resolved Y-001 and documented consistent cross-device mastery dates
- Added ADR 0014 and resolved R-010 for primary-concept mapping
- Added ADR 0015 and resolved R-008 for publishing and controlled forward
  clinical adoption
- Added ADR 0016 and resolved R-015 for emergency withdrawal and correction
- Added ADR 0017 and resolved R-016 for facility simulation authority and timing
- Added ADR 0018 and resolved R-017 for seeded-randomness implementation
- Added ADR 0019 and resolved R-018 for the physical data boundary
- Added ADR 0020 and resolved R-020 for the dual-purpose clinical knowledge-base
  and runtime-teaching architecture
- Accepted stable Tested Concepts, meaningful many-to-many Patient Presentation
  Variants, typed constrained templates, facility-stage and capability
  eligibility, frozen clinical instances, protected Draft-only AI assistance,
  and no live AI generation
- Added the persistent external and AI-generated design-input review workflow
- Added ADR 0021 for delegated technical authority and prototype-first delivery
- Added ADR 0022 for staged local-to-private-pilot delivery
- Reconstructed the imported design history, distinguishing stable intent from
  superseded or exploratory mechanics
- Refactored the roadmap and open-decision queue so only owner-level design and
  external-action gates require owner review
- Expanded the unresolved first-phase queue after a full-document audit to
  include simulation authority, seeded randomness, physical data boundaries,
  hosted-pilot topology, session/log retention, content scope, pilot scope,
  backup objectives, and simulation-speed settings
- Marked Y-005 resolved from the accepted first-submission and unscored
  correction rules

### Implementation

- None

## 2026-07-22

### Added

- Initial project brief and source hierarchy
- Canonical design summary
- Architecture and data-model proposals
- Clinical-content and balance-model proposals
- Security/privacy and deployment proposals
- Roadmap, playtest plan, and risk register
- Decision and open-decision logs
- ADR for campaign-scoped FSRS
- ADR for verified-email pilot identity
- Proposed ADR for browser-first responsive delivery

### Accepted requirements recorded

- Melissa and other invited adult surgery residents; count and duration remain open
- No minors and no research study
- Campaign-specific FSRS schedules
- Verified-email pilot identity for verification and duplicate controls, separated from gameplay records
- No telemetry, advertising, marketing, PHI, or research collection
- Full desktop and phone browser gameplay direction
- Complete usability with sound disabled

### Implementation

- None
