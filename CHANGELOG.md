# Changelog

## Unreleased

### Playable Level 2 expanded outpatient / endoscopy prototype

- Added local playable Levels 0-2 with a Level 3 locked preview, the nine
  Level 2 rooms, six Level 2 staff roles, centralized completion gate, and
  original room/staff art.
- Added editorial simulation workflows for onsite ultrasound, CT, phlebotomy,
  and endoscopy while preserving external fallbacks; these timings are not
  clinical claims.
- Activated only exact named-clinician-approved Level 2 allowlisted variants;
  Hospital and Level 3 variants remain excluded. The browser release remains
  `synthetic_unapproved_prototype`, not a public learner release.
- Added reachable, staffed GLP-1 suite automation, EVS, Training, Coffee, and
  focused browser evidence while retaining schema-version-6 save compatibility.

### Long-session character movement stability

- Deferred quarter-hour full-profile local autosaves to browser idle work while
  preserving immediate saves for player commands, pause/visibility changes,
  and Save and Close
- Reduced retained minute-tick receipts to a short idempotency window so the
  state cloned each facility minute does not grow for bookkeeping alone
- Cached detailed character artwork on each Phaser actor and now move the
  existing drawing between animation frames instead of rebuilding every pixel
  whenever only its position changes
- Compacted consumed render-route prefixes across continuous walks and route
  handoffs, preventing room-idle movement from retaining an actor's full
  session-long path history

All notable implementation and project-record changes are listed here.

## 2026-08-16

### One-patient clinical narratives across the playable release

- Reworked all 48 currently admitted patient presentations and all 57 scored
  decisions so each chart tells a brief story about one patient and the prompt
  asks what to do for that same person
- Removed duplicated presentation text from decision prompts and moved timed
  follow-up facts into the existing current-update flow where applicable
- Reframed comparative Milan, Mondor, desmoid, and pancreatic variants as
  alternative findings, reports, or future courses for one patient rather than
  a lineup of unrelated patients
- Preserved stable case, presentation, question, and concept IDs together with
  keyed answers, explanations, release points, and FSRS identity
- Added active-release regression checks against multi-patient framing,
  presentation duplication, and answer choices written as separate patients

### Current updates lead into the next chart decision

- Moved returned-result and other current-update text out of the presentation
  column and directly above the newly available decision in the chart workflow
- Added a rendering regression check that verifies the update precedes the
  active decision

### Multistep diagnostic timing on every test choice

- Added facility-time previews to every test/procedure option in the approved
  breast-cyst and Mondor-disease multistep diagnostic decisions instead of
  showing timing only beside the correct answer
- Added centrally configured editorial routes for mammography, breast MRI,
  core-needle biopsy, and excisional biopsy; these are tunable game times and
  not clinical turnaround claims
- Preserved corrected-forward scoring: choosing a wrong intermediate test is
  recorded as wrong, then the authored correct service proceeds rather than
  performing the distractor
- Added content and player-view regression coverage for all affected choices

### Ambient sidewalk pedestrians

- Added occasional campaign-stable civilian passersby who enter from either
  off-screen sidewalk edge, cross the exterior, and leave through the opposite
  edge without entering the clinic or creating a patient chart
- Persisted each passerby's appearance, direction, route, progress, sequence,
  and next spawn time so pause and reload cannot reroll or teleport them
- Reused the canonical character art, two-tile walking speed, and render
  interpolation while keeping their timing randomness isolated from arrivals,
  clinical cases, and alert flavor
- Centralized the `40-90` facility-minute interval and two-person concurrency
  cap in balance configuration and added domain and player projection tests

### Founder click-to-walk and natural shared movement

- Made ordinary non-Build-Mode map clicks assign the founder a persisted legal
  walk-to-point route, including room, hallway, and sidewalk destinations
- Kept camera dragging and explicit litter, water-cooler, employee, and other
  object interactions distinct from ordinary floor movement
- Reduced the single shared patient, founder, and employee walking rate from
  eight to two cardinal tiles per facility minute and slowed the rendered gait
  cycle so movement reads as continuous walking rather than rapid sprinting
- Retained simulation-time scaling at 1x, 2x, and 4x and made physically
  impossible short send-out itineraries extend to the minimum round-trip time
  without changing their authored service-work duration
- Added focused domain coverage for legal destinations, retargeting, facility
  work priority, sidewalk routing, persistence, and the revised speed contract

### Receptionist water-cooler upkeep

- Added a persisted receptionist facility task that begins after the water
  cooler has remained continuously empty for 60 facility minutes while a
  Receptionist is employed
- Routed the Receptionist visibly to the cooler at the shared character speed,
  suspended room-idle wandering during the task, and restored normal idling
  after the refill
- Made the delay balance-configurable and facility-time based, so pause, speed,
  save, and reload preserve the same result
- Kept the founder's manual refill available before the Receptionist starts and
  prevented both characters from performing the refill simultaneously

### Randomized new-concept circulation and cleaner chart prompts

- Replaced case-array rotation with a campaign-seeded selector that prioritizes
  due FSRS reviews, then selects uniformly across all distinct unseen concepts
  eligible at the campaign's current facility level and capabilities
- Selected an authored case variant only after choosing the concept so concepts
  with more variants do not crowd out concepts with fewer variants
- Prevented unresolved concepts and not-yet-due reviewed concepts from being
  admitted again, including as forced prefix decisions in multistep encounters
- Separated vignette and later-step context from the actual question at the UI
  boundary so patient presentation appears in the chart's left column rather
  than being repeated above the answer choices
- Kept frozen authored stems and question-review provenance unchanged

### Chart-consistent generated patient identities

- Generated routine and tutorial patient names only after the frozen clinical
  presentation profile resolves, using feminine, masculine, or neutral name
  pools according to the chart's authored sex label
- Assigned matching human head/body presentation families for `Female` and
  `Male` charts while keeping `Not specified` neutral and never using this
  presentation field for clinical selection or gameplay
- Added reload normalization so an older saved patient's canonical portrait
  and map sprite are corrected together when they conflict with frozen chart
  demographics

## 2026-08-13

### Approved Level 0 familial hypocalciuric hypercalcemia package

- Split owner row 60 into three stable FSRS identities for biochemical
  evaluation, recognition and confirmation, and avoidance of unnecessary
  parathyroid surgery
- Added four encounter variants containing five scored single-select decisions,
  including one two-decision evaluation-to-management pathway with an
  explicitly authored later endocrine follow-up
- Corrected the return finding to relative hypocalciuria and preserved the
  clearance-ratio limitation: a value below 0.01 raises suspicion but does not
  independently diagnose FHH
- Required family and genetic context before stating confirmation and limited
  observation/no-surgery questions to asymptomatic uncomplicated disease
- Removed the proposed confounded-low-ratio and reverse-recognition variants
  and admitted the approved Level 0 package to the active development release

## 2026-08-10

### Approved Level 0 Felty syndrome pathway

- Split owner row 52 into three stable FSRS identities for syndrome
  recognition, first-line methotrexate, and splenectomy consideration after
  medically refractory recurrent infections
- Added six exact single-select variants and four encounter blueprints,
  including one three-decision clinic pathway with an explicitly authored
  later specialist follow-up
- Preserved the no-splenomegaly diagnostic boundary, explicit exclusion of
  clonal LGL and other causes, and the distinction between disease-modifying,
  bridge/supportive, and surgical treatment
- Omitted exact historical response percentages and the unsupported defining
  antibody claim, and explicitly excluded the proposed seventh variant
- Admitted all four Level 0 cases to the active development release

### Approved staged pancreatic-tail adenocarcinoma resection concept

- Normalized owner row 51 into one management FSRS identity for oncologic
  distal pancreatectomy with splenectomy when a fit patient with
  pancreatic-tail adenocarcinoma has been judged resectable and is proceeding
  to surgery
- Added five exact single-select variants: four Level 0 counseling, candidate-
  selection, and referral cases plus one deferred Future Hospital OR
  procedure-by-location variant
- Required biopsy-confirmed disease, explicit multidisciplinary resectability,
  absence of distant metastases, and fitness for major surgery so lack of
  metastases is never used as the sole resectability criterion
- Kept systemic-treatment sequencing and unapproved diagnosis or staging
  steps outside scope while preserving one concept identity across settings
- Admitted only the four clinic variants to the active development release

### Approved Level 3 dry-humor PDSA iteration concept

- Normalized owner row 50 into one applied-science FSRS identity for using the
  Act step after a completed and studied test of change
- Added five exact single-select variants built around dry ASC improvement
  projects involving supplies, color-coded bins, callbacks, carts, and the
  clinic's increasingly theoretical clipboard inventory
- Preserved the result-directed adopt, adapt, or abandon boundary and linked
  PDSA cycles without treating root-cause analysis or another QI model as an
  automatic replacement
- Kept the package single-decision until a distinct measure-selection or data-
  interpretation concept is reviewed, preventing the same FSRS card from being
  scored twice in one encounter
- Staged the package for Level 3 Ambulatory OR / QI and kept it outside the
  current Level 0-1 runtime

### Approved deferred peptic-ulcer bleeding hemostasis package

- Split owner row 49 into two management FSRS identities: high-risk ulcer
  stigmata requiring endoscopic hemostasis and hemostatic-modality selection
- Added nine exact single-select variants with brief variable patient
  presentations and seven encounter blueprints, including two coherent
  two-decision pathways
- Staged stable nonbleeding-visible-vessel variants for Level 2 Endoscopy and
  active-bleeding variants for Future Hospital Floor without admitting either
  scope to the current Level 0-1 runtime
- Preserved the rule that epinephrine alone is inadequate while recognizing
  valid thermal or mechanical monotherapy in appropriate contexts and selected
  advanced-monotherapy boundaries in current guidance
- Added provenance, answer-length safeguards, exact approval records, and
  focused structural tests

### Approved Level 0 desmoid management pathway

- Split owner row 48 into two management FSRS identities: initial active
  surveillance for selected noncritical disease and a location-specific
  surgical option for progressing symptomatic abdominal-wall disease
- Added eight exact single-select variants through seven encounter blueprints,
  including one coherent two-decision encounter whose second decision is an
  explicitly authored later specialist follow-up rather than a facility-time
  simulation of months
- Preserved multidisciplinary review, expected-morbidity, functional
  preservation, nonmetastatic, and location-specific treatment boundaries
- Lengthened three incorrect labels without changing their meaning so the
  correct response is never the uniquely longest choice
- Admitted the reviewed package to the active Level 0 development release

## 2026-08-06

### Approved Level 0 AAA sex-associated perioperative mortality concept

- Normalized owner row 47 into one applied-science FSRS identity with four
  exact single-select variants at Level 0 Clinic Evaluation
- Scoped the teaching point to higher observed perioperative mortality among
  women after elective intact AAA repair at the group level, including both
  EVAR and open repair, without making the association deterministic for an
  individual patient
- Preserved guideline-supported repair-threshold and early-repair facts only
  as boundaries for the approved mixed distractor variant
- Added a standing multi-decision suitability review for every future concept;
  this concept remains intentionally single-decision because a coherent
  sequence would require separately approved AAA concepts
- Admitted the four reviewed variants to the active development release

### Approved Future Hospital OR Meckel resection-extent concept

- Normalized owner row 46 into one management FSRS identity with four exact
  single-select variants testing both segmental ileal resection and simple
  diverticulectomy
- Limited segmental-resection variants to disease involving the base and
  adjacent ileum, while approving simple diverticulectomy for a long, narrow
  diverticulum with tip-only inflammation and a healthy base
- Preserved the 2 cm base-width definition only as a source-specific
  observation from a small adult perforation series, distinct from the
  separate greater-than-2-cm diverticulum-length observation
- Assigned the concept to `release.future.hospital_or` without a numeric
  facility level or capability and kept it outside the current runtime

### Approved Future ED / Trauma right-thoracotomy exposure concept

- Normalized owner row 45 into one operative-anatomy FSRS identity with four
  exact single-select variants
- Added two compatible multiple-injury incision-selection variants, the
  approved reverse-anatomy variant, and a resuscitative-incision boundary
- Kept `right thoracotomy` canonical while limiting `right posterolateral
  thoracotomy` to a stable or stabilized patient undergoing planned repair of
  localized compatible injuries
- Assigned the concept to `release.future.ed_trauma` with Hospital OR as the
  separate required clinical setting, no numeric facility level, and no
  current runtime admission

### Approved Future Hospital OR controlled-enterotomy mesh concept

- Normalized owner row 44 into one management FSRS identity with four exact
  single-select variants
- Limited the concept to selected ventral or incisional hernia repair after a
  recognized small-bowel enterotomy is securely repaired, source control is
  adequate, contamination is minimal and controlled, and gross spillage is
  absent
- Approved permanent macroporous monofilament synthetic mesh without making
  single-stage mesh repair automatic after every enterotomy
- Assigned the package to `release.future.hospital_or` without a numeric
  facility level or capability and kept it outside the current runtime

### Approved Future ICU severe-burn enteral-nutrition concept

- Normalized owner row 43 into one management FSRS identity with four exact
  single-select variants
- Replaced the unsupported universal eight-hour cutoff with the approved rule
  to begin enteral nutrition as soon as feasible within 24 hours after
  adequate resuscitation and in the absence of an enteral contraindication
- Retained the eight-hour patient presentation as clinical context and
  preserved safety boundaries for ongoing shock, incomplete resuscitation,
  suspected intestinal ischemia, and mechanical obstruction
- Assigned the package to `release.future.icu` without a numeric facility
  level or capability and kept it outside the current runtime

### Approved staged gastric-cancer splenectomy concept

- Normalized owner row 42 into one management FSRS identity with four exact
  single-select variants
- Approved two Level 2 Endoscopy counseling variants and two Future Hospital
  OR operative-planning variants without splitting the learning identity
- Limited routine spleen preservation to resectable proximal gastric
  adenocarcinoma without greater-curvature invasion, direct splenic invasion,
  or suspected splenic-hilar disease
- Preserved the boundary that prophylactic splenectomy adds morbidity without
  improving survival in this population but that splenectomy is not
  universally prohibited

### Approved future Hospital Floor postoperative-ileus nutrition concept

- Normalized owner row 41 into one management FSRS identity with four exact
  single-select variants
- Scoped parenteral nutrition to severe ileus persisting beyond seven
  postoperative days when obstruction has been excluded and adequate oral or
  enteral nutrition remains infeasible
- Preserved the boundaries that postoperative day and nasogastric output are
  not standalone indications and that parenteral nutrition supports nutrition
  rather than directly treating the ileus
- Assigned the package to `release.future.hospital_floor` without a numeric
  facility level or capability and kept it outside the current runtime

### Approved Level 2 gastroparesis diagnostic-testing concept

- Normalized owner row 40 into one workup FSRS identity with four exact
  single-select variants
- Approved four-hour solid-meal gastric emptying scintigraphy after mechanical
  obstruction has been excluded, including general, diabetic, postsurgical,
  and objective-result formulations
- Preserved the boundary that upper endoscopy, esophageal manometry, and
  ambulatory pH monitoring do not substitute for objective gastric-emptying
  measurement
- Assigned the package to Level 2 Endoscopy as an outpatient clinic encounter
  using an off-site service, with no Endoscopy Room capability gate, and kept
  it outside the current Level 0-1 runtime

### Player question flags and local developer-review queue

- Added a compact non-scoring review flag to every displayed authored
  question, including reviewable completed decisions
- Persisted the exact frozen release, case, presentation, Question Variant,
  answer order, explanation, and encounter occurrence independently from
  campaign saves
- Added deduplication, reopening of reviewed items, bounded occurrence
  history, and a developer-only `?question-review=1` queue with versioned JSON
  export
- Kept browser-local aggregation explicit; no external service or runtime AI
  call was introduced

### Runtime answer-length cue audit

- Audited every question currently reachable through the Level 0-1 runtime and
  found 22 distinct variants whose keyed answer was uniquely longest
- Copyedited those answer labels and selected distractors without changing
  their answer keys, clinical meaning, stable Question Variant IDs, or FSRS
  Concept IDs
- Added a release-wide regression check so a uniquely longest keyed answer now
  fails the clinical-content test suite

### Approved Level 2 gastric MALT recognition and management package

- Split owner row 39 into independent pathologic-recognition and
  H. pylori-eradication-first FSRS identities
- Added six exact single-select variants and four deferred Level 2 Endoscopy
  blueprints, including two optional two-decision encounters
- Preserved the boundaries that CD20 alone is nondiagnostic, eradication is
  not shorthand for no follow-up, and progressive or transformed disease
  requires reassessment
- Shortened keyed answer labels, lengthened plausible distractors where
  appropriate, and added an automated check that the correct answer is never
  the uniquely longest choice

### Approved Level 2 vitamin C and collagen-hydroxylation concept

- Normalized owner row 38 into one foundational applied-science FSRS identity
  with four exact single-select retrieval variants
- Replaced the over-specific type III collagen wording with the approved
  general role of vitamin C in proline and lysine hydroxylation during collagen
  biosynthesis
- Added the collagen-stability and impaired-healing consequence while
  preserving the boundary against implying universal high-dose postoperative
  supplementation
- Assigned the package to Level 2 Endoscopy in the Peri-op/Recovery setting
  and kept it outside the current Level 0-1 playable release

### Approved future Hospital Floor postoperative chylous-ascites pathway

- Split owner row 37 into independent cross-sectional-evaluation,
  fluid-confirmation, and initial-management FSRS identities
- Added one exact three-decision clinic-to-hospital encounter with complete
  single-select answer sets and shuffled answer order
- Preserved the boundary that CT establishes ascites extent but not chylous
  composition; diagnostic fluid sampling supplies confirmation
- Scoped initial management to the approved large, symptomatic,
  reaccumulating postoperative leak without imposing a rigid escalation
  timeline or universal numeric triglyceride cutoff
- Assigned the package to `release.future.hospital_floor` without a numeric
  level and kept it outside the current playable release

### Approved Level 0 Mondor disease pathway

- Split owner row 36 into separate diagnosis, workup, and management FSRS
  identities at Level 0 Clinic Evaluation
- Added nine exact single-select variants across one three-decision pathway,
  one two-decision imaging-and-management pathway, and six short encounters
- Added a centralized off-site diagnostic breast-imaging service and persisted
  result gate without treating its editorial simulation duration as clinical
  evidence
- Preserved the approved selective-imaging boundary, supportive-care scope,
  corrective-forward intermediate behavior, and renewed-evaluation red flags
- Added complete source metadata, four atomic evidence claims, named clinician
  approval provenance, and bounded final-answer dispositions

### Approved Level 3 breast-imaging recognition package

- Split owner row 35 into separate suspicious mass-morphology and suspicious
  calcification-pattern FSRS identities with four exact variants each
- Added a brief patient presentation before every question and six approved
  results-already-in-hand encounter blueprints
- Added two proposed sequential mass-evaluation blueprints that begin with
  diagnostic imaging and return to the approved morphology decision
- Kept the new age-30-to-39 initial-imaging card and its two exact answer sets
  `needs_clinician_review` rather than silently merging workup mastery into a
  recognition card
- Added current ACR and NCI provenance, atomic claim mappings, and the boundary
  that suspicious imaging is not itself a tissue diagnosis
- Held all row-35 content outside the playable Level 0-1 release until Level 3
  Ambulatory OR / QI content admission exists

### Approved HCC Milan-criteria concept in both retrieval directions

- Recorded owner row 29 as one Level 0 disposition FSRS identity with six
  patient-to-criteria and four criteria-to-patient single-select variants
- Covered solitary and multifocal tumor-burden limits, macrovascular invasion,
  and extrahepatic disease while preserving the boundary that Milan criteria
  guide evaluation rather than guarantee listing or permanent exclusion
- Added finite approved presentation profiles so age and neutral narrative
  framing vary without independently recombining answer-essential clinical
  facts
- Froze the selected presentation profile into each encounter through a
  dedicated deterministic clinical-presentation randomness stream
- Added current AASLD and AASLD/AST source metadata, atomic claims, named
  clinician approval provenance, and exact wrong-answer dispositions

### First exact owner-approved clinical concept

- Recorded Melissa Rowland, MD's exact approval of owner workbook row 23 as
  `concept.ventral-hernia.elective-pulmonary-optimization`
- Added two original Level 0 Clinic Evaluation Question Variants that share one
  FSRS identity; after the older prototype questions were withdrawn, the first
  approved variant became the protected one-decision tutorial encounter
- Preserved atomic evidence claims, complete source metadata, reuse and
  authority distinctions, immutable review provenance, and explicit urgent
  presentation boundaries
- Kept the mixed development fixture labeled
  `synthetic_unapproved_prototype`; this exact approval does not promote other
  draft clinical content

### Approved Level 3 direct-inguinal anatomy backlog

- Merged owner workbook rows 8 and 25 into one stable
  `concept.inguinal-hernia.direct-operative-anatomy` FSRS identity
- Recorded three alternative, clinician-approved classification, mechanism,
  and operative-search variants at `release.l3.ambulatory_or_qi`
- Removed ambiguous standalone `deep` wording and preserved the boundary that
  failure to identify a cord-associated sac does not exclude other occult
  groin lesions
- Kept the approved content out of the current runtime until the Level 3
  Ambulatory OR encounter framework exists

### Approved sequential breast-cyst encounters

- Split owner row 30 into three FSRS identities for initial ultrasound under
  age 30, observation of an asymptomatic simple cyst, and aspiration of a
  painful or bothersome simple cyst
- Added an approved Level 0 two-decision encounter with an off-site ultrasound
  return and an approved Level 1 iteration gated by the Minor Procedure Room
- Added complete ACR, ASBrS, and ACOG source metadata plus four atomic
  source-mapped claims while keeping source reuse review distinct from clinical
  approval
- Deferred bloody aspirate, residual or recurrent mass, discordant/complex
  lesions, post-aspiration decisions, and excision pathways

### Approved EBV-associated malignancy recognition

- Added `applied_science` to the runtime Tested Concept vocabulary after
  explicit owner approval, matching the existing Clinical Content Workbench
  vocabulary
- Recorded owner row 31 as one Level 0 FSRS identity with three exact,
  single-decision Question Variants covering Burkitt lymphoma, an
  EBV-associated gastric-adenocarcinoma subtype, and nasopharyngeal carcinoma
- Preserved the boundary that a recognized association is not universal
  across every tumor and is not an individual cancer-risk prediction
- Added complete CDC and NCI source records, atomic claims, exact clinical
  approval provenance, and explicit wrong-answer consequences
- Deferred a separate Hodgkin-lymphoma Question Variant until its exact wording
  and distractors are reviewed

### Earlier prototype patient questions withdrawn

- Removed all earlier prototype, synthetic-routing, and AI-authored pilot
  questions from new-campaign admission and automatic patient selection
- Reused the approved one-decision pulmonary-optimization case and approved
  two-decision breast-cyst case for the protected Level 0 tutorial
- Preserved already-frozen encounters in existing saves while preventing any
  withdrawn case from creating a new patient
- Retained legacy synthetic cases only as non-runtime regression fixtures for
  service-engine tests

## 2026-08-05

### Clinical release points and complete ambulatory progression

- Accepted semantic clinical release points for Clinic Evaluation, Minor
  Procedure, Endoscopy, Ambulatory OR / QI, Pediatrics, Wound / Ostomy, and
  unnumbered future Hospital OR, Hospital Floor, ED / Trauma, and ICU content
- Recorded the complete Level 0-5 room and hireable-staff unlock table while
  leaving later-level costs, advancement gates, capacity, and implementation
  deferred
- Preserved one FSRS identity when a concept has several approved
  presentation/question iterations at different release points
- Established single-location Founder physician coverage, generalized imaging
  operation by the Imaging Technician, separate acquisition and interpretation
  phases with faster staff-Radiologist reads, and the Level 3 Pharmacist role
- Replaced the discarded AI-proposed 55-row stage mapping with a neutral
  concept-by-concept review queue containing no preassigned release points

## 2026-07-30

### Quieter patient-status alerts and literal waiting-room seats

- Removed encounter-payment settlement receipts from the player-facing Alerts
  and Events feed while preserving them in the domain audit trail and chart
  summary
- Added a save-stable five-facility-minute grace period before unresolved
  check-in, clinical-decision-ready, or result-ready conditions enter the feed
- Limited Waiting Room placement to visibly rendered chair anchors; overflow
  now uses the Front Desk and sidewalk instead of an invisible or arbitrary
  corner position
- Raised visible litter above ordinary map fixtures and characters while
  retaining its direct-click interaction and keeping overlays above it

### Chronological alert history and live facility satisfaction

- Defined Alerts and Events as one chronological stream: response-required
  rows receive an exclamation marker while active but are not pinned, and
  resolving a condition clears the marker without deleting or retimestamping
  its row
- Changed empty-water guidance to occur on the first empty state and then once
  per complete facility day while the cooler remains continuously empty
- Established `100%` as the clean, capable-clinic satisfaction baseline rather
  than an unconditional starting score; applicable unresolved facility
  conditions lower an ordinary patient's satisfaction at Front Desk check-in
- Preserved the rolling ended-encounter satisfaction history while layering a
  separate live HUD modifier for current facility conditions until they are
  resolved

### Continuous movement and complete return visits

- Removed late-session stop-and-sprint animation caused by a one-tick render
  target, while preserving the single configured walking speed at 1x, 2x, and
  4x
- Coalesced high-frequency full-profile local saves onto deterministic
  15-facility-minute boundaries; player actions, pause/visibility changes, and
  Save and Close still save immediately
- Made off-site patients check back in at the Front Desk, reuse the same
  result-ready chart, choose a Waiting Room chair or standing place, proceed to
  a reserved Examination Room when opened, and visibly leave after resolution
- Added a canonical seated patient presentation and kept room-idle excursions
  returning to and reserving the same chair
- Added focused reload, capacity, route-handoff, delayed-render, autosave, and
  return-itinerary regressions

### Development-session memory and process hygiene

- Audited the long-lived player runtime, Phaser lifecycle, React effects,
  browser reload behavior, automated browser teardown, and bounded event
  histories for retained resources
- Made alert-driven deferred focus work latest-request-wins and cancellable on
  unmount or campaign changes instead of leaving stale animation-frame work
- Changed redundant desktop launches to hand off to the already healthy
  prototype and exit immediately, preventing extra launcher consoles from
  accumulating
- Removed generated Playwright trace directories left by earlier visual
  triage runs; no campaign saves or source files were removed

### Compact, complaint-led Alerts and Events feed

- Unified actionable alerts, guidance, success acknowledgements, walkout
  reviews, and ambient humor into one compact scrolling feed with no separate
  minimized history or visible category-label column
- Reserved the exclamation marker for critical and action-required messages
  while retaining click targets for patients, staff, rooms, and facility
  objects
- Kept routine accounting, clinical-decision/XP, encounter-settlement, GLP-1
  receipt, prototype-money, litter-spawn, trash-cleanup, water-refill, and
  construction activity in the domain audit trail without filling the
  player-facing feed
- Mixed scheduled ambient humor into routine clinic messages, using normal
  charcoal text and a bounded recency window instead of a gray flavor block at
  the bottom
- Made the visible-trash lesson a save-stable one-time prompt that is
  acknowledged by the first accepted cleanup click
- Added deduplicated patient complaints for accumulated trash and occupied
  base-level rooms, while preserving wait-time, amenity, and off-site imaging
  guidance
- Preserved the irreversible patient-leaving warning as a critical feed item
  without offering a stale chart action

## 2026-07-29

### Unified character movement and physical patient lifecycle

- Replaced the separate patient, founder, employee, and off-site animation
  cadences with one centrally configured character walking speed
- Made Phaser interpolate one persisted cardinal route contract at the exact
  simulation rate, including predictive tick-to-tick motion, continuous route
  handoffs, pause/Build Mode freezing, and reload-safe logical positions
- Removed renderer-invented waiting, care, staff, founder, and off-site
  locations plus the separate duration-dependent off-site excursion
- Added full left/right off-screen sidewalk arrivals, Front Desk check-in
  gating, distinct Waiting Room/Front Desk/sidewalk waiting positions,
  Examination Room reservations, and complete visible departures
- Changed off-site testing to a single frozen outbound/away/return itinerary
  whose displayed duration ends when the existing chart becomes result-ready
  at the Front Desk
- Added rotated room navigation anchors and blocked fixture tiles so routes use
  explicit doors without crossing counters, exam furniture, or imaging
  equipment
- Stopped actor-only facility ticks from rebuilding the static map, fixtures,
  and room labels, removing a recurring source of animation hitching

### Stable, control-specific tutorial guidance

- Stopped facility ticks and ordinary React rerenders from tearing down and
  reacquiring the active tutorial anchor, eliminating the recurring corner
  flash and bubble jump
- Replaced broad or outdated tutorial selectors with stable semantic anchors
  on the exact patient, answer, feedback, chart, Build Mode, and facility
  controls being explained
- Added placement hysteresis, animation-safe repositioning, viewport and
  element observers, one-time reveal scrolling, and a non-pointing docked
  fallback when no honest adjacent placement is available
- Corrected phone positioning to keep fixed tutorial geometry in the same
  viewport-relative coordinate system after page scrolling
- Added recovery guidance for closed charts and corrected Level 1 and
  multi-step feedback sequencing so acknowledged prompts do not recur or skip
  the next meaningful control
- Added desktop and phone browser regressions that sample tutorial placement
  continuously while facility time runs at 4x
- Made the first Level 1 patient-on-the-way prompt the tutorial endpoint with
  one Complete tutorial action and no subsequent tutorial popups

### Condensed direct-manipulation Build Mode

- Replaced the stacked construction cards with a compact top bar for Build
  Mode, available money, Undo, and Done/Save plus a separate ordered
  Construction Tools row
- Condensed the available-room catalog into responsive columns, preserved
  readable selected-room text with a strong outline, and placed upgrade
  benefits/cost and sale refund in a compact contextual inspector
- Limited Rotate to pending room placement, removed named wall-position
  buttons, and moved zero-cost door placement/removal onto emphasized,
  directly clickable map walls and doors
- Made Build Hallway a persistent toggle: a click places one tile and a drag
  paints a continuous edge-connected corridor until the player toggles the
  tool off; each successful tile remains a separate $35 Undo step
- Portaled invalid-layout explanations above the facility renderer so the
  complete blocking-reason dialog is always visible and clickable
- Kept access validation, invalid-layout explanations, build-session Undo,
  upgrade confirmation, sale values, and the protected exterior entrance
  authoritative in their existing domain systems

### HUD, patient rail, and campaign guidance refinement

- Replaced the four pixel-cell resource symbols with smooth outline scalpel,
  money-bag, satisfaction-face, and clock graphics
- Simplified the resource HUD by removing the redundant goal-panel,
  operating-change explanation, satisfaction-window explanation, and
  clinic-open status lines while retaining their useful values and controls
- Reduced Advertising to its title, level controls, and current hourly
  cost/arrival-frequency line; anchored it below the expanded Patient Charts
  rail
- Removed the obsolete low-cash gate from the GLP-1 consult: it remains visible
  and usable at any cash balance until its future dedicated room is built,
  while retaining its persisted hourly cooldown, fixed payment, and
  no-learning-reward boundary
- Re-enabled the opening tutorial whenever a genuinely new campaign begins

### Founder customization and intro taglines

- Expanded founder creation from 10 to 30 independently interchangeable heads
  and bodies while preserving the original stable options and save identities
- Replaced the original numbered Classic head and body placeholders with
  distinct descriptive names while preserving their persisted IDs and artwork
- Added 10 distinctly female-presenting human heads and outfits plus 10
  original non-human animal, alien, and robot sets, including cat and penguin
- Extended the canonical map, portrait, walking, and star-jump renderer and
  persistence validation for the new cosmetic variants without changing
  generated patients, employees, clinical demographics, or gameplay
- Added the approved 32-line rotating campaign-screen tagline library with
  session-scoped repeat protection and the weighted prior-authorization line

### Data-driven Alerts and Events humor system

- Consolidated Level 0-1 actionable, guidance, success, ambient, and walkout
  review copy into one editable registry with stable definition/variant IDs,
  weighted selection, context eligibility, placeholder fallbacks, cooldown
  metadata, click targets, and explicit attention-marker behavior
- Added a campaign-persisted ambient scheduler that unlocks after the Alerts
  tutorial, guarantees its first line within 10-20 facility minutes, uses
  45-90-minute recurring intervals, freezes with facility time, and preserves
  shuffle/recent-history state through save and reload
- Added the approved 25-line ambient library with room, object, and patient
  context gates; title-screen Saves taglines remain a separate content system
- Added condition-backed clinic guidance, action-required warnings, event-driven
  success messages, and focus/highlight routing for patients, staff roles,
  employees, Advertising, the water cooler, litter, rooms, goals, and Build
  Mode without changing the underlying mechanics
- Added cause-ledger-based one- and two-star walkout reviews with persisted
  recent-variant protection and no additional gameplay penalty
- Made the compact feed prioritize unresolved actions, reserve exclamation
  marks for action-required content, suppress ambient rows during critical
  alerts, retain a scrollable recent log, and wrap cleanly without overlapping
  at desktop or phone widths
- Migrated campaign saves to schema version 6 and added registry, domain,
  selector, component, persistence, and focused browser coverage plus current
  desktop and phone screenshots

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

- Lowered exposed dollhouse rear walls to a shallow, sub-half-tile cutaway;
  added the same treatment to northmost hallways; cropped fixed wall art at
  partial northern contacts without rescaling it; kept panel rhythm anchored
  to the full room; and joined true exterior north corners to side lips with
  short stepped shoulders
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
