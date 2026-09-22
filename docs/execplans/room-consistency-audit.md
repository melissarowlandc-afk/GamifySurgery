# GS-015 — Cross-room consistency and character fit

## Goal

Owner approved Telehealth except the west plant layering over its chair in
3x2. Fix that, audit all approved rooms for coherent furniture/decor scale,
walking paths and occupied poses, then prepare replacement of runtime rooms
once the evidence supports consistency. Preserve approved visual designs.

## Constraints / state

Shared beta tree contains substantial unrelated work. Preserve all originals,
saves, room IDs, clinical and gameplay systems. No broad cleanup or staging.
Previous room proofs establish intent; isolated path checks do not establish
occupied-character fit or runtime integration. Do not call inferred attachment
points verified. Runtime replacement is conditional on completing this audit.
Maintain per-room variation while standardizing like-for-like physical scale.

## Milestones and ownership

1. Sol phlebotomy_finish: Telehealth depth fix and refreshed delivery; inventory
   16 approved proofs in tools/room-design/consistency-audit/**. Other room
   sources read-only. Capture sources, scale anchors, physical sizes, poses,
   collision/depth rules, rotations, hide ownership and known evidence gaps.
2. Terra character_fit_audit: read-only approved character asset/runtime scale
   and attachment investigation. Exact asset paths and authoritative contracts.
3. Parent: reconcile inventory with actual art and user-approved rules; define
   shared measurement standard and assign necessary corrections in batches.
4. Worker milestone to be assigned: same-scale occupied-room comparison with
   approved character art, independently test paths/attachments and review.
5. After consistency gates pass, define scoped runtime replacement plan with
   save/room-size compatibility and tests. Do not erase recoverable originals.

## Acceptance / validation

### Owner-confirmed interaction constraints to preserve

- Front Desk: desk and both chairs permanent; ED exception allows walking
  through visitor chair at D5. Water cooler permanent and passable; full/empty
  and trash service visuals must be represented in readiness inventory.
- Examination: 3x2/2x3; table solid, stool permanent/passable. Rotated patient
  sits South and employee North. Sink optional and rotated S1 ownership.
- Waiting: bench South, left chair East, right chair West; seating permanent
  with pass-behind routing/depth, table solid. Rotate furniture with room.
- Bathroom: toilet and sink permanent/passable at A1/A2; transit behind them,
  use in front. Sit South at toilet then stand North at sink, 2 game minutes
  each, per owner's explicit gameplay direction (not new medical guidance).
- Minor Procedure: B2 table blocks walking, other spaces passable. Patient
  South at bed foot, employee North on stool. Sink/cabinet pushed north.
- Ultrasound: horizontal bed, machine south of head pushed north in its tile
  for walking in front; patient South at foot, tech North on stool.
- X-ray: upright detector, standing patient; preserve approved position.
- CT: patient South at scanner bed foot, tech behind divider. Four CAT-scan
  prints latest approved revision; avoid older two-print delivery fallback.
- Phlebotomy: South-facing patient/North-facing stool; rotated art; sheer
  windows no outdoor scenery; no window behind sink in 3x2.
- EVS: north shelves and optional corner clutter hide with owned doors/backing.
- Endoscopy: dark occupied bed replaces patient with covered generic figure,
  hairnet/head visible facing away from endoscopist. Latest enlarged dark head
  edit approved. Verify it is actually used instead of stale prior bed art.
- Recovery: 6x6 eight removable door-owned bays, exam-size beds, inward-facing
  monitors and short partitions, central desk/two stools. Eight visual beds
  are not evidence of multi-patient runtime reservation support.
- Training: permanent dual bench/two north-facing stools, optional wall decor.
- Coffee: 2x2 central permanent island, continuous perimeter walking loop.
- Telehealth: 3x2 E/W employee seating, 2x3 N/S; permanent desk/chairs,
  plants rotate and hide by owned walls; transit depth follows floor position.
- Hallways/shared walls: single EW shared wall; NS shared face belongs to
  southern room's North. Short-backed N open-air frames, EW cap breaks and
  half-floor seams, South floor to wall base. North paint only varies by room.

Every designed room and orientation accounted for. Comparable desks, chairs,
beds, sinks and functional objects use coherent ground and occupied scale.
Document purposeful type differences. Actual character visual fitting in all
interaction types; readable cardinal poses and depth behavior. Trace doors,
clearance, service points, hide groups and permanent/pass-through fixtures.
Explicitly list untested/unavailable evidence and unresolved owner decisions.
Focused tests plus actual rendered screenshot inspection; no redundant giant
mask sweeps when permanent geometry is unchanged.

## Progress / next action

Started September21. Sol fixing Telehealth and extracting cross-room inventory;
Terra locating actual approved character evidence. Parent reviews findings and
sets correction/occupied-preview scope before runtime edits.

Character read-only audit complete: approved GS018 P01 stand/sit cardinal PNGs
live under artifacts/character-statics/gs-018-v1/patients-001-010/patient.adult.001/.
160x320, axis80/floor287; seated support S213.32/EW220.64/N223.57. Art ready for
integration, not deployed. Current runtime uses128x192 atlases withfloor181,
not these PNGs. Use existing Endoscopy comparison scale.754083 as provisional
single display scale (about216px standing visible at120tile), subject to
occupied visual review; never scale individual characters to fit furniture.
No room has full occupied-character verification; Endoscopy has a limited
side-by-side comparison. Latest endoscopy-occupied-beds-dark-01.png remains
unpacked. No approved OR room proof exists, despite future OR behavior notes.
Parent viewed actual P01 sitEast and standSouth source images.
Telehealth plant depth fix parent-reviewed and focused/widget checks rerun PASS.
New Telehealth artifact635148bytes SHA256
583BFC3E8813177F1492C0D211EA517BE82EC00ABC5FC269C673D0375EDE3496.

Inventory complete: parent read inventory.json/README.md and independently ran
consistency-audit/validate.cjs PASS (16 canonical hashes/evidence,15 deliveries
match, CT stale). Comparable references support near scale alignment but not
universal occupied fit; Phlebotomy55–57px is review outlier, older room seat
contacts unknown. Do not assert image width equals physical footprint width.
Next bounded corrections assigned Sol: approved CT delivery sync and approved
dark Endoscopy occupied-frame integration only, preserve geometry and empty
beds; update inventory/handoff. Terra separately owns character-fit-review/**
same-scale room review instrument (all16 captures, allapprovedP01poses,
clickable anchors). Ownership is disjoint; coordinate Endoscopy recapture.
The instrument explicitly does not certify actual depth/occupied fits; it
exposes comparison evidence and unknowns before per-fixture registration.
Parent visually inspected captures of FrontDesk, Waiting, Bathroom, Phleb,
US, Recovery, Exam, Minor, Xray, CT, EVS and Endoscopy. Xray/CT console desk
facades appear markedly lower than FrontDesk/workstations; flag actual source
measurement and likely art-height correction, not intentional variation.
Capture review found CSS-scaled screenshots not normalized to120tile and a
legacy actor in Waiting. Terra instructed to record actual capturedtile scale,
normalize room+P01 together, disable legacy actor in capture only, verify
orientation controls and fresh alternate dimensions before declaring viewer
usable. Raw screenshots alone cannot prove universal scale.
Source check confirms FrontDesk s=88 (drawArt), not120 native. Xray console
uses502x491 crop at120px width, floor sourceY478, standing-tech approach;
visual desk edge roughly50px abovefloor. CT similarly renders console at120px
width with floor contact(284,514). These console desktop-height findings need
explicit per-source worktop measurement/redraw before a universal-scale pass.

Approved-version fixes complete and reviewed: CT delivery source-match893885
bytes5625BF5B988E4B4DEB795BB1CAE11570DE63926F87DDA7566B46274A1550CDC1.
Endoscopy dark occupiedframes bothdirections355490bytes
12EEFD3E19BFB8A2E38EAE22DC1A8F65ED4F0586CC704009980811A1AB2F3551.
Parent inspected both occupiedhostscreens and independently reran Endoscopy
and inventory validators PASS, plus verified delivery hashes. Empty beds and
geometry unchanged. Current inventory now has16matchingdeliveries.

Terra built tools/room-design/character-fit-review/** with16rooms+5rotations,
P01fixedworldscale, actualnative/capturedtile metadata, click/keyboard foot or
seat-anchor placement and foreground-only limits. Parent readsource/capture
metadata, revieweddesktop320 and reraninitialvalidator PASS. FrontDesk actual
capturedtile105.6, Exam144; viewer corrects P01 scale by capturedtile/120.
Follow-up finalreadiness/image/error/hash checks requested. This is an audit
instrument, NOT occupied fit approval. No character scaled per furniture.

Outstanding before universal consistency approval/runtime replacement:
measure/correct low Xray/CT computerdesks, compare Phleb rotations and older
FrontDesk/Waiting/Bathroom contacts; register every actual occupied fixture
and state-dependent depth/path interaction with GS018 atfixedscale. Owner
question about missing OperatingRoom proof remains unanswered. Runtime
replacement condition is not yet met; do not remove current game rooms.
Final instrument QA parent independentlyreran PASS: all16roompixels/image
readiness, no pageerrors, alternate/pose/click, explicitFrontDesk/Exam scale.
Source/delivery325627bytes SHA256
7FAA98E0A9E9CF08FBC64DEB24688EC4801ADBA743DB8D01918345BD6A5F3F9F.
Review instrument and inventory complete; universal occupiedfit remains open.
