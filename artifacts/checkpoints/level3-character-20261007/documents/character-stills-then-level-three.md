# Character stills, then playable Level 3

## Goal and sequence — October 4, 2026

Owner requested additional character stills first, followed by implementation
of the next playable facility level in this same task. On October 4 the owner
specified 20 new characters: four radiologists resembling Severance characters,
then staff needed for the next level and patients to fill roster gaps. Owner
delegates the remaining character designs. Preserve this two-phase sequence.
Parent interprets the quartet as Mark, Helly, Irving, and Dylan. Initial delivery
contained four standing poses per identity. The owner's follow-up below
supersedes that incomplete readiness scope: complete required seated poses,
pediatric coverage, style matching, and repeat avoidance before Level 3.

## Baseline and constraints

- Initial checkout: branch `beta`, 527 dirty/untracked status entries. Shared
  work includes clinical, rooms, interactions, alerts, and movement. Preserve it;
  never reset, stash, broadly stage, or overwrite whole shared files.
- Read repository AGENTS.md and latest current handoff. Current handoff records
  playable Levels 0–2 and all seven approved Level 3 room designs. Verify actual
  runtime models before proposing implementation details.
- GS032 owns movement. Preserve latest accepted 7 world-pixel bounce at 2 Hz,
  north/south-only 1.5-degree sway at 1 Hz, and 120 ms idle settle. Do not restore
  historical 3 px movement or shelved pawn artwork.
- GS028 owns clinical authoring, GS029 alerts, GS031 facility interactions,
  GS015 room design. No other-task messaging is authorized.
- Use accepted GS026 full-body character identities, style, proportions and
  cardinal poses; retain transparent backgrounds and immutable source evidence.
- Art approval and runtime integration are distinct. Level 3 room approval does
  not approve prices, staffing rules, clinical rules, or progression thresholds.
- Preserve old saves, frozen encounters, stable concept IDs/FSRS, and draft
  clinical review status. No web/model calls during gameplay.
- Owner local pathway remains START_GAME.cmd -> http://127.0.0.1:4173 in the
  usual persistent browser profile. Read GS030 private pathway records before
  testing. Validation must use isolated servers/storage; do not disturb owner
  servers or imply saves transfer between origins.

## Milestones and ownership

1. Baseline and small-batch selection. Terra `character_level3_baseline` owns
   bounded read-only inspection of character references, staffing/progression,
   approved room provenance, and private pathway records. Astra reviews evidence
   and asks owner which characters/roles/poses to make first.
2. Phase 1 still production. After direction, delegate one bounded additive
   asset milestone at a time, with exact references and output ownership. Use
   built-in imagegen; inspect output, preserve exact prompts/provenance/alpha,
   and deliver reviewable stills. Record owner approval and integration choice.
3. Phase 2 concrete scope agreement. After Phase 1 is settled, inspect current
   progression/catalog/balance models and present unlocks, approved rooms,
   staffing/capacity, operations/flows, goals/progression, economy, clinical
   access, and old-save behavior. Resolve actual product choices with owner.
4. Delegate sequential implementation milestones under the agreed scope. Astra
   retains architecture, integration review, acceptance, and plan maintenance.
5. Validate complete playable behavior and representative visuals, record a
   scoped handoff and latest current handoff entry, and report local checkpoint.
   Remind owner to say "push to GitHub" for audited backup; no push implied.

## Acceptance and validation

Phase 1: selected characters/poses match exact accepted references, transparent
backgrounds verified, prompts/source hashes and owner decisions recorded;
runtime changes only to selected approved assets when authorized.

Phase 2: unlock/build/staff/action execution/revenue/goals/accessibility and
old-save behavior validated, representative browser scenarios visually reviewed,
with exact commands/results/limitations recorded. Select commands from the
repository after scope agreement. Tests do not constitute clinical approval.

## Progress, discoveries, and next action

- Initial instructions/handoff and dirty tree inspected. No runtime edits made.
- Terra read-only baseline completed; actual balance supports Levels 0–2 and
  future Level 3 staff are Surgeon, OR Nurse, Laboratory Technician, Pharmacist,
  and Repair Person. Parent reviewed referenced staffing document and character
  completion records. Detailed Level 3 operating rules remain deferred.
- Imagegen skill read; built-in image generation will be used after direction.
- Latest current handoff resolves final Level 3 cohesion decisions: retain
  compact OR charting desk; Break Room and Office plants/bookcase intentionally
  allow pass-through. Preserve approved layouts and wall/door hiding.
- Private pathway confirmed in baseline: START_PRIVATE_GAME.cmd ->
  [private playtest hostname omitted] (loopback 4174); separate saves.
- Owner selection received: 20 identities as above. Terra owns an additive
  roster/coverage manifest at artifacts/character-statics/
  level3-and-radiologists-20-v1/, with exact accepted reference paths. Parent
  reviews that manifest before assigning production. No runtime edits.
- Next: inspect style references, finalize grounded 20-design roster, delegate
  built-in imagegen production and local provenance/review packaging. Retain
  full verbatim prompts. Radiologist art does not advance the Level 4 unlock.

### Phase 1 production decisions

- Roster: 4 Severance-inspired radiologists (Mark, Helly, Irving, Dylan), two
  each of Surgeon, OR Nurse, Laboratory Technician, Pharmacist, Repair Person,
  and six patients. Staff pairs provide art variety, not approved capacity.
- Parent reviewed actual patient catalog and corrected draft coverage rationale:
  current Female/Male counts are young_adult 7/6, adult 9/8, middle_aged 11/11,
  older_adult 9/9. Add three young men (19/24/28), two young women (21/26), one
  adult man (38), bringing both younger bands to nine per sex. This is visual
  matching coverage only; no clinical selection weights or new clinical claims.
- Parent inspected GS026 employee001 native reference and new Mark source.
  Mark accepted as a production-style candidate, not owner art approval;
  transparency proof pending. Correct Irving/Dylan likeness descriptions before
  generation. All source prompts must be verbatim, not reconstructed.
- Terra character_level3_baseline owns source identities 001–014 plus roster
  brief. Terra patient_six_artist owns only source identities 015–020. Terra
  batch_review_packaging owns new tools/character-mapping/
  level3-and-radiologists-20-v1/ and artifact review/ outputs. These disjoint
  art/tooling paths permit parallel production without shared runtime writers.
- Each new sheet has four standing cardinals S/E/W/N. Seated art and actual
  runtime registration remain later work when integration requirements are
  established. Review tooling must preserve original pixels and measure alpha,
  margins, separation, crop integrity, source hashes, and prompt provenance.

### Production review and corrections

- All 20 native sheets generated with built-in ImageGen; 80 standing views.
  Parent inspected every selected native sheet. Final source sidecars and
  full light/dark review remain in progress at this entry.
- Final artist ownership: character_level3_baseline 001–008;
  patient_six_artist 009–020. Packaging worker owns only additive tooling/review.
- Rejected 006 v1 for S/E/N/W order and style drift; 007/008 v1 for coarse
  rendering relative to accepted references. Originals preserved under each
  history/v1. Parent visually accepted regenerated 006–008 candidates: correct
  S/E/W/N, rounded style and complete bodies. These use explicit GS026 employee
  001 and patient015 reference images. No owner art approval is asserted.
- Provenance correction: 001–005 used text-only ImageGen calls after visual
  reference inspection; their records now explicitly distinguish this from
  attached reference-image conditioning. Exact prompts/native bytes retained.
- Parent caught a review-tool measurement error: the largest disconnected
  component's maximum alpha is not the maximum across all disconnected
  components. Packaging worker assigned correction. Low-opacity disconnected
  pixels remain measured and preserved, with exact-hash visual acceptance for
  review candidacy only; no alpha cleanup or runtime-ready assertion.
- Gallery checks cover desktop/320px layout, source/prompt/provenance links,
  native PNG hashes, complete four-figure sheets, and truthful review statuses.
  No game tests are needed for this isolated art-only milestone; gameplay and
  saved campaigns have not been changed by this task.

### Phase 1 complete for owner review

- Sol source_provenance_audit repaired 002/003 literal path/hash placeholders
  and control characters using original artist-confirmed tool paths and actual
  native hash equality. All20 selected source/prompt/provenance records now
  resolve, and text-only versus image-conditioned generation is explicit.
- Parent reviewed all20 native sheets and complete light/dark front boards,
  plus native full-sheet transparency composites. Corrected006–008 accepted
  as review candidates. Every source retains genuine RGBA alpha and original
  bytes; faint edge pixels remain measured, not silently cleaned.
- Packaging final build/strict validator/browser QA passed. Parent independently
  repeated strict validation (20/20, zero missing/blockers), native provenance
  (20 exact native copies and prompt pointers, clean sidecars), and isolated
  Chromium 1280px/320px checks (20/20 loaded, no overflow/browser errors).
- Deliverables: artifact review/index.html and contact-board-light.png;
  complete prompts/provenance linked within the gallery. Scoped handoff:
  docs/handoffs/CHARACTER_BATCH_LEVEL3_AND_RADIOLOGISTS.md with final hashes.
- Owner visual review question sent; no answer yet. All20 remain
  candidate_pending_owner_review. No runtime, seated-pose, clinical, save,
  movement, launcher, commit, push or deployment changes. Local checkpoint.
- Next: settle visual feedback, present concrete Level3 gameplay scope and
  remaining product decisions, then delegate agreed implementation milestones.
  The original combined task is still open; do not archive it at art delivery.

### Owner correction — complete character readiness before Level 3

Owner asks for seated stills, pediatric coverage as needed, and enough characters
matching existing game art to avoid repeat patients before the next level.
Standing-only delivery was a review milestone, not completed gameplay readiness.
Do not begin Level 3 while these character requirements remain unfinished.

Requirements:

- Complete all runtime-required sitting/examination views, preserving exact
  character identities, outfits, common standing/seated head scale, true
  cardinals, transparency, and authored seat contacts. Audit actual requirements
  instead of assuming four standing views are sufficient.
- Audit pediatric cases, eligible images, fallback behavior and visual age/sex
  matching. Fill real missing childhood ranges with original, age-appropriate
  art in the established style; do not invent clinical content or selection
  weights. Base a bounded added roster on actual capacity and coverage.
- Audit the selection algorithm, including simultaneous visible patients,
  returning patients, and recent reuse. More files alone are insufficient if
  selection keeps choosing duplicates. Preserve stable saved identities and
  frozen encounters; returning patients should remain recognizably themselves.
- Compare candidate artwork against actual accepted runtime source images and
  correct material style drift before production registration. Preserve all
  prior files/history and generate additive versions using built-in imagegen.
- Keep clinical age/sex constraints, concept IDs and FSRS unchanged; no race or
  ethnicity disease selection, no new medical teaching content. Protect active
  motion/clinical/alerts/interaction work and use isolated test storage only.

Delegated next milestones (read-only first):

1. Sol source_provenance_audit owns runtime coverage/repeat-selection/capacity/
   persistence investigation, with grounded roster and implementation proposal.
2. Terra batch_review_packaging owns actual pose/style/reference/registration
   audit. Root combines findings, records bounded art and code scope, then
   delegates production and implementation sequentially with disjoint ownership.
3. Complete art, registration and necessary selection fixes; validate coverage,
   visible uniqueness, recent reuse, age/sex matching, return identity, old saves,
   seated/exam contacts and representative isolated browser visuals.
4. Only after character readiness is validated, resume Level 3 scope agreement.

Current state: repository instructions, current handoff and plan reread; 529
dirty/untracked status entries. Latest handoff records GS032 movement backup
already pushed separately; no authorization to push this character task inferred.
Workers checked; both audit assignments dispatched. No new implementation edits
or generation yet under this corrected scope.

### Eight-pose production pilot dispatched

- Terra complete_pose_artist owns only v2 sources/001 Mark pilot, generated
  through built-in ImageGen with explicit attached GS026 style/layout and v1
  Mark identity references. Every new identity will use a full eight-pose sheet;
  historical standing-only sources stay unchanged. Root must visually inspect
  pilot before releasing bulk production.
- Terra batch_review_packaging owns additive v2 tooling, baseline hash capture,
  review gallery and provisional staging registry, excluding sources/. No
  runtime promotion or authored seat-contact approval in this milestone.
- Sol coverage/selection audit continues read-only. Pediatric roster size and
  scale will be grounded in its findings; do not normalize children to adult
  height or invent clinical demographics.
- New source contract: source.png, exact-prompt.txt, tool-args.json and
  provenance.json. Native PNG copied byte-for-byte; prompts saved before calls;
  actual attached references and native output path/hash recorded explicitly.

### Coverage findings and bounded pediatric decision

- Sol audit: 70 runtime adult patient stills, zero under-18 eligible stills.
  Existing 856-case playable release has no explicit under-18 demographics;
  missing case demographics currently resolve to adults. No clinical content
  will be added to create artificial pediatric demand.
- Current appearance hashing reserves neither occupied nor recently used art,
  so adult repetition needs a selection correction as well as more art.
- Optional owner preference sent: add12 pediatric identities (four younger,
  four older, four teens), add6, or finish20first. Default proposal is12 as
  future art coverage, separate from clinical age probabilities/case creation.
  Await preference while completing independent original20 production.
- First Mark eight-pose native generated and visually reviewed. Style/cardinals
  fit; bottomright seatednorth changed to short sleeves. Artist correcting that
  single defect via ImageGen, preserving original generation and sidecars.

### Readiness implementation and pilot acceptance

- Corrected Mark pilot visually accepted by root: proper eight cardinals,
  rounded reference proportions, consistent long sleeves including seatednorth.
  Packaging and measured seat-contact review still pending; no owner/runtime
  approval asserted. Terra complete_pose_artist now owns sources002-008.
- Sol source_provenance_audit assigned repeat-aware new-person selection plus
  focused tests, snapshotting dirty baselines first. Preserve frozen/saved and
  returning identities, clinical choice and pediatric ineligibility. Derive
  occupied/recent sets from state where possible to avoid save-schema changes.
- Finite pool guarantee: avoid occupied compatible art when one is available;
  rotate least-recently-used designs; deterministic reuse on pool exhaustion
  instead of blocking admission. No promise of infinite globally unique art.
- Runtime population capacity is configuration-dependent and can exceed the
  compatible art pools; therefore simply increasing art count is insufficient.

### Pediatric art scope default (optional preference unanswered)

Proceed with proposed12 future pediatric identities while keeping them separate
from current clinical eligibility. Presentation-only groups: younger children
(visual ages4-7), older children (8-12), teens (13-17), four designs per group,
two girls and two boys. These ages guide visual design only, not clinical case
selection, demographic weights, disease matching, or teaching content. Infants
and toddlers are not covered by this walking/seated cohort.

Proposed source IDs and briefs (all eight cardinal postures, no props/furniture):
- 021 girl6, deepbrown skin, two short puff ponytails, coral cardigan/cream shirt,
  indigo trousers, cream shoes.
- 022 boy5, fair skin, sandy tousled hair, leafgreen hoodie, navy trousers,
  white-and-gray shoes.
- 023 girl7, lightolive skin, shoulderlength wavy darkbrown hair, lavender
  sweatshirt, charcoal leggings, teal shoes.
- 024 boy6, mediumbrown skin, short black curls, cobalt pullover, tan trousers,
  dark sneakers.
- 025 girl9, mediumbrown skin, single dark braid, mint zip jacket, darkblue jeans,
  cream sneakers.
- 026 boy10, fair freckled skin, ginger short wavy hair, rust overshirt/cream tee,
  slate trousers, navy sneakers.
- 027 girl11, fair skin, straight black bob, mustard cardigan/navy tee, charcoal
  jeans, plum shoes.
- 028 boy12, deepbrown skin, short twists, plum hoodie, gray trousers,
  white sneakers.
- 029 girl14, fair skin, auburn curls to shoulders, navy zip jacket/rose tee,
  darkblue jeans, gray sneakers.
- 030 boy14, lightolive skin, curly black hair, teal overshirt/cream tee,
  dark trousers, tan sneakers.
- 031 girl16, deepbrown skin, long braids, maroon sweatshirt, charcoal jeans,
  cream sneakers.
- 032 boy17, medium skin, sandybrown swept hair, beige hoodie, navy jeans,
  dark sneakers.

Child heights must be explicitly editorial and reviewed against adult runtime
art at common world scale. Start with one younger-child pilot; review before
bulk, do not inherit adult246px height. Per-pose seat contacts remain authored
from actual normalized silhouettes. No clinical sex/age/content changes.

### Pilot technical review evidence

- Root reviewed actual pilot builder/validator, independently ran validate-pilot
  (PASS8 poses), and viewed normalized light/dark eight-pose proofs plus seated
  contact grid. Native corrected Mark hash:
  a01fb77bb962130d75c2b43d2d21eb8e9129c6b115cc2175a9bbc5c1f98b8919.
- Mark provisional authored seat contacts for overlay: south250, east250,
  west250, north250. These locate the underside of the seated pelvis/thigh in
  the normalized images; need furniture-placement/overlay review before promotion.
- Helly002 all8 visually accepted as productioncandidate. Irving003 initial
  bottomright repeated a short-sleeve artifact; artist assigned exact longsleeve
  correction and complete003-008 production, retaining original history.
- Terra additional_pose_artist now owns sources009-020 eight-pose identity
  completion plus younger-child021 pilot. Root reviews each source; no mass
  source approval from successful metadata checks.
- Sol implementation scope extends minimally to ambient/service/retail creation
  callsites for shared appearance reservation, after full dirty baseline copies.
  No renderer/movement, clinical authoring, persistence repair or unlock changes.

### Source review checkpoint (not final readiness)

- Root visually accepted final003 Irving after seatednorth sleeve correction,
  hash6d1ad410e6117a45f84db00496d52f36de568637d170ac15668c23e5ca3480bf.
- Root visually accepted004 Dylan hash501be7f5cf804016b3bad0a7b9b495af2e8af59d442740b9c483ba8a7cbbd39f,
  with consistent glasses/beard/vest/shirt and correct eight views.
- Root visually accepted009 labtech, complete plum scrubs and correct8views.
- Root reviewed baseline-relative selection diffs and external callsites.
  Requested fix for unspecified-profile public still fallback identity metadata:
  select compatible legacy identity from chosen still sex/visual band, not only
  caller profile. Requested external-context and real creation-seam tests.
- Generation can use at most two independent awaited built-in calls per artist,
  each with saved exact input and explicit refs, separate provenance and native
  preservation. No source ownership overlap. Packaging remains deferred until
  next slot frees; no runtime registry modifications by this task yet.

### Repeat-selection code accepted locally

Sol completed appearance selection and five precise creation-seam files plus
focused tests. Root reviewed actual baseline-relative diffs, requested/verified
chosen-still metadata compatibility for unspecified profiles, independently ran
all79 focused tests, game-domain typecheck, dependency-boundary and launcher
checks: PASS. Worker broad package run hit load-sensitive timeout cases; all
three affected files passed individually, no assertion failure reproduced.
No schema change. Recent history covers retained encounters; departed external
actors have no durable recent-use record, but visible external actors reserve
artwork. No existing saves are rerolled. Local-only milestone, no commit/push.

Next: continue all32 full-pose production, complete exact input provenance,
review child pilot/scale, author and inspect contacts, finish strictpackage QA,
then decide scoped runtime promotion and validate before any Level3 work.

### Placement diagnostic rejected; geometry escalation

Root inspected001 chair composition and actual toolcode: proof is invalid because
chairScale .35 uses88px reference tiles while character55x110 was asserted at
52px tiles, and full transparent frame scaling produced a tiny sitter on an
oversized chair. No seat-contact approval from those compositions. Sol
source_provenance_audit now owns ONLY build-placement-qa.mjs,
validate-placement-qa.mjs and placement outputs for exact runtime geometry fix.
Terra packaging retains other v2tooling, currentlyidle; do not overlapfiles.

Root accepted005 native eight-pose style; 010/013 visual candidates accepted.
011/012 sleeve edits changed pixel texture to smoothvector, rejected; artist
now editing from original pixel-textured history/v1 and preservingrejectedv2.
014 also rejected for allfour seated sleeve shortening. All010–014 metadata
bundles now completed perartisthandback, strictpackage mustindependentlyverify.
Future strictacceptance mustbind visualreview toexactselectedsourcehash and not
accept a knownrejected source merelybecause itsmetadata+posesvalidate.

### Pediatric pilot accepted for production style and younger scale

Root inspected021 native full8poses (hash
50ec37c891c3eb259e3976f0839d2bd995ae7a35f3c68033a17f5559c0682573)
and generated/viewed parent-review/child021-scale-comparison.png using existing
GS026 normalization at184px against acceptedexistingadult andMark246px.
Younger-child184px target accepted as an editorial visual decision, not a
clinical height claim. Correct childproportions, allcardinals, fullsleeves,
consistentheadscale. No runtime/pediatricclinicaleligibility approval.
Older-child211 andteen234 remain provisional pending firstrespectiveimages.
Terra complete_pose_artist now owns006/007/008 completion thenpediatricwork;
021 sidecars complete andactualargs savedbeforecall/passunchanged.

### Geometry correction reviewed and ongoing ownership

Sol corrected diagnostic geometry from approved source crop/draw records:
chair45x65 at52px/tile, full characterframe55x110, authored seat support
(1.5,1.82) minus approved0.25southinset=(1.5,1.57). Root reviewed actualscript
and all7 resultingSouthproofs, independently passed validate-placement-qa.
Southcontacts accepted for001250/002245/003248/004250/005245/009246/010243;
othercardinal contactgrids await finalreview. These are art QA, not ownerapproval.

Latest011/012 corrections from originalpixel sources visuallyaccepted after
texture andsleeve review; latest014 longsleeve correction alsoaccepted. Histories
preserve allrejected variants. Currentmetadata should beindependentlyverified.
Terra additional_pose_artist next owns015/016/017 patientproduction.

Earlier complete_pose_artist repeatedly returned before its larger bounded art
milestone finished. Work preserved; remaining006/007/008 ownership transferred
to freshTerra finishing_pose_artist with cleancontext and exactargs-before-call
workflow. No concurrent source ownership. complete_pose_artist isidle.
Terra batch_review_packaging now owns sourcehash-bound visualacceptance,
youngerchild packaging and generalgallery; Solfixedplacement scripts preserved.

### Full-roster review checkpoint

Root inspected and accepted native full-pose sources001–017 and021–029,
including sleeve corrections015/017 and older-child025–028. Source-specific
acceptance remains bound to exact hashes in the packaging ledger; no future
source is implicitly accepted. Older-child211px and teen234px editorial scale
pilots are accepted after comparison against adult246px and younger184px.
These are visual scale decisions, not clinical height claims.

Terra additional_pose_artist owns remaining adult018–020. Terra
finishing_pose_artist owns teen029–032. Terra batch_review_packaging owns
package/gallery metadata and contact review. Disjoint source ownership permits
these bounded art tasks to proceed together; only one worker writes packaging.
Root reviewed all19 existing South chair proofs. Side/rear contact lines need
per-direction refinement before complete acceptance. Final target remains32
identities ×8 poses =256; no Level3 implementation or asset runtime promotion
has occurred. Current runtime still has70 adult patient identities; six new
adult and12 pediatric identities are staged for review, not yet eligible.

### Visual roster complete; final validation hardening

All32 selected native sources, all32 South-facing actual-chair composites,
and all128 directional seat-contact values have been visually reviewed by root.
All32 source bundles pass Sol's independent exact-input/native/reference audit.
Source018 rear sleeve correction accepted at hash
 d0d71d20cb611c15e428bdd17e8ece928da98313375f24e4f9de6d47869325ca.
Sol final_roster_audit repaired stale provenance prompt hashes004/005 and
literal reference records015/017/018; no source pixels or tool arguments changed.

The final audit identified validator gaps in native sidecar rehashing, unique
roster completeness, immutable runtime baseline, and source/coordinate-bound
contact approval. Terra batch_review_packaging owns those bounded fixes.
Derived standard GS026 extraction clips some very faint alpha fringe; native
sources remain byte-exact. Packaging must measure/report faint-only clipping
and reject visible loss, rather than claiming all alpha pixels were retained.
Root will review the measured evidence before final strict acceptance.

The32 candidate identities are now visible in review/owner-overview-stand-south-
sit-east.png. Final gallery/browser checks and validator audit remain in progress.
No runtime asset promotion, Level3 unlocks or pediatric clinical authoring.


### Phase1 complete: full eight-pose roster validated

Root independently passed hardened strict roster validation:32 identities,256
poses,0 issues, original153 identities/1254 assets unchanged. Placement validation
independently passed32 diagnostics. Final rebuild changed0/256 derived pose hashes.
Root accepted exact alpha report1f5e03103be084b763a7cad2223c406ca180a23aa81cf7fadc4b60ca6c47899a:
max trimmed source alpha2/255, border1/255; no alpha>=13 loss. All native bytes
preserved. Sol final_roster_audit completed validator hardening after Terra's
partial handback. Terra browser QA passed1280/320 all64proofs+overview, nooverflow/
errors/brokenlinks; root inspected readable viewport crops. Handoffs updated.

Phase1 art is complete for owner visual review; runtime promotion and Phase2
Level3 scope agreement/implementation remain open. Noownerapproval implied by
root QA. Six adult additions and12 pediatric appearances remain staged.
Current70adulteligible identities unchanged. Repeat-selection code tested79PASS
is local. No commit/push/deploy; remind owner to say "push to GitHub" for backup.

## Active implementation authorization — October 4, 2026

Owner now explicitly requests scrub caps on both surgeons and implementation of
these characters together with Level 3. The owner reiterates that room designs
were approved in GS-015. This supersedes earlier instructions in this plan to
wait for broad art/runtime scope permission. Proceed with implementation using
recorded room approvals and existing progression patterns. Ask only about a
concrete product choice that cannot reasonably be inferred; do not re-request
room approval or redesign approved rooms.

### Current milestone sequence and ownership

1. Terra surgeon_caps edits only source005/006 with built-in imagegen, adding
   coordinating caps to all eight poses while preserving identities and style.
   Preserve pre-cap bundles and exact generation provenance. Root reviews caps.
2. Sol level3_implementation_map performs bounded read-only architecture review:
   documented Level3 values, room proof sources, unlock and staff/operation seams,
   old-save handling, clinical gates, integration modules and useful tests.
   Root retains the final scope and reasonable editable prototype balance choices.
3. Delegate character packaging/registration and catalog integration, preserving
   existing153 identities/1254 assets, all existing stable IDs and saved identities.
   Register future assets safely; radiologists remain Level4 and pediatric art
   must not invent or silently enable new clinical cases.
4. Delegate coherent Level3 domain/balance implementation, followed by approved
   room rendering/UI integration and end-to-end operational validation. Normally
   one runtime writer at a time; disjoint cap-source work may run in parallel.
5. Root reviews actual scoped diffs against pre-edit dirty baselines, runs
   appropriate independent checks, inspects a representative playable Level3
   scenario in isolated browser storage, and records exact results/handoff.

### Non-negotiable preservation and acceptance

Preserve approved GS-015 room art, dimensions, fixture locations, backing/door
hide-and-restore rules, permanent bed states, layering and pass-through decisions.
No new clinical teaching content, no clinical-review promotion, no gameplay AI
calls. Preserve GS028, GS029, GS031, GS032 shared work and existing saves. Keep
Level4 locked. Keep canonical owner launchers/origins/profile/storage unchanged.
Local changes only; no commit/push/deploy without separate authorization.

Completion means a player can advance from Level2 to3 using the established
requirements, build the approved new rooms, hire/use the new staff appearances,
and operate the intended Level3 services with feedback, costs/revenue and goals
consistent with current game conventions. A registry-only or unlock-only patch
is not completion. Existing Level0–2 behavior and old saves must remain valid.
Unspecified economic numbers are editable prototype balance values, never clinical
thresholds. Final scope and validations will be recorded after architecture review.

### Root decisions for Level 3 implementation

Use the existing Level 2 advancement requirements unchanged (300 current-level
Learning XP, satisfaction over90, first completed endoscopy). Level3 becomes
playable and terminal; Level4 remains locked. Reuse existing service definitions
and their timing/revenue/stock rules, including Periop prep -> OR -> Recovery,
in-house laboratory work queue, pharmacy dispensing/retail and public vending.
No new clinical case authoring or automatic review-status promotion.

Initial editable prototype balance defaults selected by root after Sol's map:
- Room build cost/upkeep/cap: OR2400/36/3; Lab1800/24/2; Pharmacy1200/16/2;
  Workshop800/10/1; Break900/10/2; Office700/8/1; Vending450/4/5.
- Staff hire cost/salary/cap: lab tech500/36/2; surgeon1400/90/3;
  OR nurse650/44/3; pharmacist600/42/2; repair person400/30/2.
- Terminal Level3 completion goals:500 current-level Learning XP, satisfaction
  over90, operational OR/lab/pharmacy and their required staff, first completed
  ambulatory operation. These are prototype game-balance choices, not clinical
  thresholds or previously owner-approved numeric values. Retain existing
  currency and salary/upkeep units from the balance configuration.

Core backend milestone: widen levels/types/schema to3; add seven approved room
navigation contracts, five staff roles/capabilities, L2->3 progression and terminal
L3 goals; activate dormant operations; preserve schema8 saves when no new durable
fields are introduced. Follow with functional support rooms and approved visuals.
Workshop/repair, Break Room and Surgeon Office must have actual gameplay purpose
before final delivery; detailed minimal support design follows current state map.

Terra roster_runtime_integration owns character registry/catalog and additive
public art only, with pre-edit dirty baseline snapshots. Sol read-only map keeps
balance/domain unchanged until that bounded write milestone is complete. No
unrelated shared dirty work, approved room proof, launcher or owner save is changed.

### Functional support-room decisions

Break Room: reuse employee morale, with routed seated take_break tasks (30 facility
minutes, +5 morale, 240-minute cooldown; all editable simulation defaults). Reserve
one of seven approved seats. Active and queued care has priority; fixed-station
staff must not abandon needed posts. No fatigue model is added.

Workshop: repair person requires an operational workshop home. Initially apply
maintenance wear only to new Level3 OR/lab/pharmacy rooms. Eight completed uses
mark maintenance due;600 facility-minute grace;30-minute routed repair resets it.
Overdue maintenance must never interrupt an operation already in progress.
Finish active work, then block new reservations until repair; queued work waits
with a clear reason. Keep maintenance separate from EVS cleanliness. Values are
editable simulation balance, not clinical facts.

Office: hired surgeon's home and seated administrative work location. Each unique
completed ambulatory operation may enqueue one30-minute nonclinical QI review;
no revenue, no learning XP and no invented teaching content. Expose first QI review
as a secondary operational objective. Existing educational employee-discussion
case admission/review rules remain intact. Do not promote deferred row050.

Use persistence schema9 only when these durable break/maintenance/QI fields land;
provide safe defaults for v1–8 imports and preserve frozen/saved identities.
Activate scheduled OR capacity using existing providers, OR nurse and Periop
resources. Add a deliberate Lab work-queue action with understandable availability
feedback. Keep Level4/radiologist/pediatric clinical unlocks deferred.

### Character runtime integration accepted locally

Root reviewed both capped native sources and their eight-pose/actual-chair proofs.
005 selected SHA419ca4d2fae0a05f215a37fc79af16eb17888f6ac8b92ff38dfa0b647f9d551b;
006 SHA289fe9c54c8d5bf9f048a1492e3e4efa67324d8415ba6774083c212e0124b995.
Pre-cap source bundles retained. Existing contact coordinates accepted with the
new source hashes; exact alpha report5e2b4fb0ef006f476dcc1f81c0c0f7693db22a2050c591c2685c591168d36947
accepted (new caps max trimmed alpha1/255; other30 unchanged).

Terra roster_runtime_integration appended32identities/256PNGs to registry:
185identities/1510assets. Six adult patients now eligible (76 total), ten Level3
staff mapped, four radiologists and12 pediatric appearances registered future-only.
No appearance.ts mutation. Root reviewed actual catalog/registry/integration code,
found/fixed-through-worker an escaped newline bug before final registry output,
then independently passed append-only validation (old153/1254unchanged) and17
catalog/rotation tests. Worker passed35 focused tests plus domain/player typechecks,
strict32/256package and32placement validation. Pre-edit dirty copies retained in
v2/runtime-integration-baseline. Local-only checkpoint, no commit/push/deploy.

Sol level3_implementation_map is now sole balance/domain writer for CORE Level3.
Terra finished character writes and is read-only mapping approved-room/UI promotion.
Next: core backend handback/review, support-room mechanics, approved visuals/UI,
and isolated end-to-end playable Level3 validation. Current handoff's earlier
'art not registered' entry is historical and superseded by this progress record.

### Disjoint room-presentation milestone underway

Sol remains sole writer of balance/domain core. Terra roster_runtime_integration
now owns approved Level3 room asset promotion and player presentation files only:
bitmap manifest, approvedRoomProofData/Presentation/Renderer, minimal FacilityScene
and canonicalRoomShell integration, plus focused tests and provenance artifacts.
This parallel milestone has fixed approved art interfaces and disjoint files;
UI controls/viewModels remain deferred until core/support interfaces stabilize.
Pre-edit dirty room baseline is retained under artifacts/level3-implementation-20261004.
All seven approved proofs remain untouched; promoted assets require exact source
hash equality. Root reviews both milestones and runs sequential integration checks.

Terra room promotion handback was partial twice: 82 exact assets and all seven
proof hashes pass, but renderer integration was not implemented. Root retained
that validated work and escalated remaining bounded room presentation to named
Sol worker level3_room_integration. Same disjoint player-only ownership and
constraints apply. Terra is idle. Root reviewed promotion script and required
actual proof-file hash verification in addition to stored approval hashes.

### Core Level3 backend accepted

Root inspected scoped baseline-relative balance/domain implementation and tests.
Review corrected shared Endoscopy/Advanced admission grouping and preserved its
visitor-only semantics. Root independently passed66 tests across progression,
old persistence, service operations (full OR prep->procedure->recovery->$900 and
Lab completion-only income), and retail. Worker also passed25 balance tests,
11 clinical admission/withdrawal tests, balance/domain TypeScript. No clinical
content changed. Schema8 remains at this checkpoint. Generic operating-alert
L3 eligibility and default-context advancement proof are queued in support work.

Sol level3_implementation_map now owns support domain milestone under a NEW
post-core support-baseline: routed breaks with seven reserved approved seat IDs,
maintenance grace/non-interrupting active care and routed repairs, nonclinical
surgeon office QI queue, schema9 safe migrations/defaults, focused tests and status
selectors for UI. Exact break seat IDs/contacts supplied by presentation Sol.
Root will review actual support diffs and tests before UI integration acceptance.

Player controls are now a disjoint parallel milestone assigned to Terra
surgeon_caps (its cap work was already complete). Owns session/viewModels + hook,
UI service/management/types, App and AppShell, focused tests, NEW ui-baseline.
It must wire L3 progression/build/hire and deliberate Lab work-queue action using
accepted core API. No facility rendering/domain/art edits. Support-status and
actor projection are deferred until backend interface stable. This third writer
is explicitly scoped to separate files; root will perform sequential integration
checks after each handback. Attempt to reuse roster_runtime_integration failed
with agent thread limit; surgeon_caps followup was successfully dispatched.

### Room presentation and first controls accepted; integration underway

Root independently rehashed7approvedproofs and82 source/runtimeassetpairs. Root
reviewed room tables/Scene/shell; caught hardcoded origin offsets for Office
(actual60,120) and Vending(actual150,150), corrected by Sol. Root independently
compared48 current proof draw destinations/sizes with runtime records (occupied
OR variant aligned) and passed62 room presentation/renderer/shell tests. Worker
player tsc passed. Fullplayer567/571:3motionmock/stale3px issues relateexistingGS032;
1prototype-alert eligibility requires classification against newL3 supportchanges.

Root reviewed first UIcontrols prop chain + view model, required L3-only Labpanel
and mandatory handler, then independentlypassed6UI/viewmodeltests. Terra
surgeon_caps nowowns support UI/actorprojection withNEWsupport-ui-baseline;
roomSol released facility/types.ts for narrowoptional supportreference fields.
BackendSol stabletask/statusinterfaces supplied. OR uses existing occupancy
projectionextended toOR; coverage must distinguishprep/procedure/recovery.

Sol level3_room_integration nowowns integratedE2E tests/screenshots only. Temporary
isolatedVite localhostaddress via127.0.0.1 port0+freshPlaywrightstorage authorized
forQA; noowner4173/4174servers/profiles/savesorlaunchers changed. Actualtestorigin
willberecorded. Rootwillinspectimages+independentlyrunfinalvalidation.

### Final integration corrections and escalation

Rootfoundnewrolehirecaps3 exceededexact2eligible surgeon/ORnurse stills; chose
editableprototypecaps2forboth andORrooms2, preservingpriorlevels/prices. Domain
workerownsadjustment+coverage. Thisavoidsproceduralfallbackforthirdnewrolehire.
Rootreviewedsupportcode andrequestedcarepriority, proactiveunreservedrepair,
repairdedup,healthysparecapacity, actualactiveORdeadline test, orphanQI task
reconciliation/reload,default-contextL2gate and schema8->9 checks.

Terra supportUI repeatedpartialhandbacks withoutrequiredsupporttests. Validwork
retained; rootescalatedto namedSol level3_support_ui_finish (currentUIowner) to
fixunreachableOR rolebranch, home-workstationsnappingfromwronglocation, repair
roleusedinroomwithoutanchor, QIinprogress/secondaryobjective, waitreasons, and
meaningfulstateprojectiontests. CaptureNEWescalationbaseline. Terraidle.
SceneSol E2Eowner separatelyappliedminimalexactemployee supportId+roomIdforwarding,
post-roomScene baselinehashrecordedunder e2e/post-room-baseline.

Clinical runtime scope clarification: existing release and exact admission
allowlists stay unchanged. Facility Level3 operates with the current allowed
clinical case pool plus existing scheduled services. No new case authorship,
no widening of approved blueprint allowlists and no row050/PDSA promotion.
Existing clinical schema bounds/admission code remain their current owners.

### Final support UI accepted; live browser blocker isolated

Root reviewed the support UI baseline-relative diff, dedicated state projections,
minimal Scene support-seat forwarding, narrow CSS and corrected canonical break
room alert ID. Root independently passed21 tests across five Level3/UI/alert files,
all eight workspace TypeScript configurations, dependency/launcher boundaries,
and Vite production build. npm wrapper is absent from this shell; equivalent local
Node CLI build/typecheck commands were used without installation. Worker full
player result576/579: only three existing GS032 motion expectation/mock failures.
No preferred motion code or tests were changed by this milestone.

Sol E2E has proved real UI Level2-to3 advancement and reducer placement/access of
all seven approved rooms. Isolated QA origin is http://127.0.0.1:5173, fresh test
storage; owner4173/4174 pathways untouched. Browser hiring exposed missing five-role
STAFF_SLOTS in room-capacity.ts; domain Sol owns baseline+fix+real reducer hire
coverage. Office supports2 surgeon employees but1 concurrent QI seat; Workshop
supports1 repair-person home slot for its single approved bench. OR nurse/Labtech/
Pharmacist each1 per compatible room. Global hire caps remain prototype limits.
Root also caught queued retail same-tick overdue acquisition; domain correction
and realistic purchase/repair regression passed20 retail tests.

### Domain accepted and final build verified

Domain Sol completed support and late staffing-capacity integration, stopped edits.
Root reviewed maintenance acquisition (including retail same-tick protection),
persistence orphan/seat reconciliation, support task scheduling and actual five
STAFF_SLOTS additions. Root independently passed122 domain tests in12 files,
including all five HIRE_STAFF paths and second-surgeon/single-workshop constraints,
real OR workflow, pharmacy deadline handling, progression, persistence, approved
room migration and unchanged clinical admission/withdrawal. Root also passed all
42 balance tests and re-ran asset checks: original153/1254 unchanged, additive
32/256 exact;7approved roomproofs and82source/runtimepairs exact.

Root independently reproduced full player576/579: three pre-existing GS032 tests
in characterPauseArrival.test.ts expect old3px vs preferred7px or omit setAngle
mocks. No new Level3 failure remains in that suite. Final player TypeScript and
Vite production build after staffing-capacity correction PASS. E2E remains active:
fixing test fixtures/selectors around staged profiles and incidental retail income;
real Level2->3 gate, room placement and hiring now pass. Do not mark task complete
until integrated browser flows and image inspection are accepted.

### Integrated browser exposed support return-path issue

Real approved-layout OR flow stalled after breaks: support completion/preemption
cleared tasks without routing employees back to home rooms, while operational
staff selectors correctly require presence. Root delegated a post-support fix to
Sol domain owner: routed return after break/QI/repair, active-care and employee
retail-trip preservation, actual OR-after-break and workshop-return regressions.
Own retail shoppers must also be excluded from new break assignments.

Root visually inspected all-seven-room, compact management, Lab and seated-support
captures. Approved art matches. Requested screenshot-only hiding of pause banner
for unobscured seated faces and receipt scrolling. Browser fixture now uses
one-shot profile writes and explicit facility-gait-proof query; debug exposure
remains opt-in. Tiny UI follow-up delegated to Sol UI: temporarily away Labtech
must not be mislabeled as a full queue. Final completion still awaits E2E results.

### Completed and accepted locally

Final combined isolated Playwright run:6/6 PASS in1.3m; additive canvas-preview
capture focused rerun1/1 PASS. All production scenarios use default domain rules;
L2 qualification history and presentation/maintenance states are seeded fixtures,
not a claim of playing every prior level manually. Final scope includes real UI
advance/Lab dispatch, reducer-created rooms+hires, schema9 reload, OR prep->covered
procedure->recovery->one$900 receipt, pharmacy/vending settlement, repairs, correct
specific break/office seated stills and compact control access.

Root visually accepted all7 approved rooms, loaded occupied OR table and capped
surgeon/nurse placement, unobscured seated break/office staff, compact UI and exact
$80 Lab receipt. Root reviewed return-home baseline diff and independently passed64
support/service/retail tests; reviewed temporary-Labtech status diff and passed11
UI tests. Final player tsc and Vite production build PASS after these changes.

Browser harness corrections: one-shot persisted fixtures, explicit gait-proof
query, natural idle schedules for workflow tests, scene.applyCamera/refreshLayout
with actual approved-prop polling. Direct camera centering skipped culling refresh;
no runtime renderer change was necessary. Initial4173 fresh-context runs were not
owner-profile sessions; all final6-scenario evidence is from isolated5173. Worker
owns cleanup of that temporaryVite session and records result in E2E validation file.

Current/scoped handoffs updated. All authorized work complete; no further code
milestone remains. Known unrelated GS032 stale motion-test failures recorded.
No commit/push/deployment. Retain shared dirty worktree and all baseline evidence.
Local-only valuable checkpoint: remind owner to say "push to GitHub".

Temporary QA server cleanup confirmed: owned Vite session1496 stopped; no listener
remains on5173. Final validation evidence file reviewed. Root corrected the evidence
wording to distinguish five unique staff appearances from the capped surgeon.
