# Still movement comparison

## Actual 1x calibration v3
Owner agrees to preview preferred7px at actual game1x speed and character scale.
Build two lanes: current3px2Hz without sway, preferred7px2Hz with1.5deg1Hz
North/South-only sway and120ms settle. Shared game2tiles/second travel. Express
geometry in tiles and show the tile grid. Derive sprite size with current
getCharacterStillPresentationMetrics(tileSize,246/258), source floor anchor287/320;
use verified Blue Glasses cardinal source registration and ordinary floor scale.
Choose a legible tile size that fits the preview and state2tiles/s clearly;
pixel size varies with layout, not a claim to reproduce owner's unknown window.
No change to actual runtime or owner campaign.

Sol owns additive artifacts/character-movement/still-comparison-v3/ plus final
delivery copy in the restored writable thread visualization directory named
game-speed-movement-comparison.html. Parent owns calibration decision/review.
Preserve v1/v2 and all art bytes. Validate source formula parity, grid pitch,
rendered speed/tile=2 in all directions and view sizes, sprite dimensions/anchor,
3/7px2Hz amplitude, directional sway, controls, pause/state, mobile headroom.
Reuse bounded native Playwright fixture, no server or installs. Parent repeats
targeted checks and reviews screenshots before delivery.

Calibration refinement: characterStillScaleForAppearance uses the South visible
height cap246/(floor287-visibleTop29)=246/258 for Blue Glasses. FacilityScene
multiplies ordinary floor scale1 by this identity factor. At52px tile size the
actual sprite is53x106, with bounce independent of the identity size factor.

v3 complete for owner review. Sol implemented the two-lane calibrated preview;
parent inspected actual geometry/render/control code, source calibration, desktop
and320px screenshots, embedded PNG and previous-preview hashes, then independently
reran node artifacts/character-movement/still-comparison-v3/validate.mjs: PASS.
All four directions measured2.000tiles/s at52px and45px tile pitches. Sprite sizes
53x106/46x92, grid pitch/floor registration,3/7px peaks, N/S1.5deg and E/W0deg,
pause/state/reduced motion/headroom/no requests or errors all passed.
Delivery219988bytes SHA25632cae22aae7313fae9e5d8546536a8658008bcc8e8cabf817545b9e04396ff43.
Preview only; no runtime/art/save changes, commit, push or deployment. Next action:
owner evaluates preferred bounce at actual game speed. No game integration authorized.

Owner feedback:7px option looks good; asks whether preview equals game1x speed.
Verified preview32screenpx/s normal; game standard2tiles/facility minute and
1000realms/facility minute at1x =2tiles/real second. Actual screenpx/s depends on
layout tile size/camera. Preview was illustrative, not calibrated to game1x.
7px is preferred preview height; no runtime integration authorized. Any next
game-speed preview must match actual tile and character presentation scale.

## Owner revision v2 — October 3
Owner prefers5px2Hz with1.5deg sway, requests no forward/back wiggle during
sideways travel, equal perceived East/West and North/South speed, and exploring
more dramatic bounce. Prior preview actually uses equal leg times for unequal
distances. Fix with distance-based traversal at one base-world pixel speed.
Compare5/7/9px at2Hz, all with +/-1.5deg sine sway only North/South, zero rotation
East/West. Shared120ms settle and.7s rests. Preserve v1 exactly.

Sol owns additive artifacts/character-movement/still-comparison-v2/ including
delivery still-movement-comparison.html, adapted validation and compact evidence.
Current write permission is repository-only; do not modify previous external
visualization path. No runtime integration or new art. Astra reviews actual diff
and repeats targeted browser validation (equal cardinal speed, side sway0,
5/7/9px amplitude, controls, all directions and no clipping at highest bounce).

v2 complete for owner review: Sol implemented and validated; parent inspected
actual movement math/lifecycle, screenshots and runner, confirmed unchanged v1
SHA and4 original PNG payloads, then independently reran browser acceptance PASS.
Measured normal ground speed32px/s every direction; close64-64.02px/s. Peaks5/7/9,
sideways tilt exactly0, N/S sway1.5deg, all stops/controls/state/reduced motion/
320px close headroom/no external requests/no errors passed. Fixture about:blank.
Final220080bytes SHA2567cdeb87e36df7e83b80f1faf960fa99baf9f8af1645038d3340a7a2f7504b43d.
No runtime integration, source art edits, save changes, push or deployment.

## Goal
Owner requests side-by-side movement preview of current bounce, stronger bounce,
and stronger bounce plus subtle tilt. Use existing full-body Blue Glasses stills.
Pawn idea is shelved. Preview only; no game integration or asset replacement.

## Repository and constraints
Shared beta tree has extensive unrelated changes; retain all prior work/art.
Current runtime characterPresentation.ts uses cosine lift 3px at2Hz. Do not edit
runtime, launchers, saves, clinical content, or prior review packages. No push.
Existing local playtest START_GAME.cmd -> http://127.0.0.1:4173 remains unchanged.

## Decisions and ownership
Astra owns design, review and acceptance. Terra owns one bounded implementation
at artifacts/character-movement/still-comparison-v1/ and delivery fragment
C:/Users/rowla/.codex/visualizations/2026/10/03/01a102e3-f05c-72c2-95b0-05bdb75c171c/still-movement-comparison.html.
Read full visualize skill. Embed original PNG bytes, no new art or image edits.
Show3 synchronized lanes:3px2Hz;5px2Hz;5px2Hz plus +/-1.5degree alternating tilt.
Use shared route, time, scale and ground shadow. Cardinal-facing stand art.
Include common stop/rest periods. Keep baseline stop behavior; gently settle the
experimental versions, clearly reflected in labels. Normal/close view and pause
are useful only if simple. Avoid unnecessary controls. Reduced-motion starts paused.

## Acceptance and validation
Inline fragment under1MB with no external requests, theme-aware surroundings,
responsive layout, original character at consistent scale and readable labels.
Preview motion repeats as explicitly requested; offer pause. Validate all image
decodes, synchronized x/y positions, differing lift/tilt, pause/restart persistence,
stops grounded, no errors and narrow layout via existing browser tooling; inspect
screenshots and representative phase state. Do not claim static screenshot proves
motion. Parent reviews actual code/diff and evidence. Record origin if serving;
no campaign connection, use isolated preview only. No dependency installations.

## Progress
- Runtime bounce and accepted original references checked.
- Next: Terra implementation and isolated preview validation, then parent review.
- Parent first source/image review found route resets inconsistent with facing,
  square-wave tilt, incorrect transparent-canvas foot anchoring, incomplete settle,
  and missing host state restoration. Returned correction milestone to Terra.
  Test wrapper must provide theme tokens to expose grounding/shadow for visual QA.
- Terra attempted corrections but reported an unresolved animation-loop exception;
  no acceptance claimed. Sol owns bounded repair and final browser validation of
  the same fragment/artifact directory. Parent also identified close-up shadow
  alignment, narrow clipping and host-state animation lifecycle concerns.
- Sol repaired phase normalization, single-loop lifecycle, sine sway, captured
  stop settling, close-up grounding and narrow layout. Parent inspected revised
  JS and themed desktop/narrow screenshots; original4 PNG hashes, script syntax,
  no external requests and219024-byte delivery independently checked.
  Final browser receipt and parent independent rerun PASS (exit0): complete18.1s
  circuit/four directions/continuous boundaries,3px and5px lift,1.5deg sway,
  post-settle grounding, pause/resume, host state restoration, close grounding,
  narrow320px containment, reduced-motion default and zero browser errors.
- Parent inspected final light travel/dark stop/narrow screenshots. Final delivery
  and repository review.fragment.html SHA256 match:
  b69da7ac03d01270f52f777da1162bf430b556ecca5244150f468386359c5a44.
- Preview complete and ready for owner choice. Terra built initial version; Sol
  repaired and validated; Astra reviewed actual source/images and reran acceptance.
  No substantive undelegated implementation. Browser used setContent/about:blank
  fixture, no server or game origin. Runtime/art bytes/saves unchanged. Local only.
