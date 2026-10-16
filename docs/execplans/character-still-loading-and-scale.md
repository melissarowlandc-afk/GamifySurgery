# GS-026 follow-up: corner loading flashes and character scale

Status: complete locally, September 24, 2026.

## Goal and owner authority
Owner reports characters turn gray during movement, especially corners, and
some characters (notably founder) look significantly larger. Diagnose and fix
these presentation regressions in the completed local still integration.

## Constraints and repository state
Read AGENTS, prior integration plan, current handoff and scoped dirty status.
Shared workspace has extensive unrelated work, including completed GS-025 paths
and GS-023 CT staffing. Preserve routes, speed, saves, clinical content, source
art pixels, approvals and unfinished animation. No commit/push/publication.
Owner pathway remains START_GAME.cmd / http://127.0.0.1:4173, usual profile.
Do not open owner storage. Disclose isolated browser test origin before use.

## Milestones / ownership
1. Sol seated_correction_pilot: read-only runtime loader/fallback/scale diagnosis.
   Astra: registry geometry audit, visual comparison and scale policy decision.
2. Delegate bounded renderer/helper/test implementation to Sol after diagnosis,
   with exact before-edit copies/hashes and one writer. No art regeneration.
3. Delayed-image corner browser proof and representative size/seat comparison;
   parent actual-diff, test and visual review, then handoff update.

## Acceptance
Known live identities do not flash gray at turns or posture transitions during
normal/slow image loading. Load only active identity assets; no global1054 preload.
Missing/unknown identity remains explicit neutral instead of borrowing another
person. Preserve static cardinal travel, no mirroring/cycling, pause behavior,
chair contacts and existing movement. Scale changes use one stable identity
factor for every direction/posture so seated corrections are not undone; base
policy on measured art rather than a founder-only arbitrary shrink.
Test delayed fetch corner transitions, appropriate missing-art behavior,
consistent per-identity proportions, paused seat anchors, types and build.

## Findings / next action
All assets use160x320 canvas but visible standing heights differ: human founders
238–287 pixels, older patients241–287, new staff237–284, public248–278. Nonhuman
founders have intentional broader/shorter silhouettes. Equal canvas dimensions
alone do not guarantee equal apparent person size. Await runtime diagnosis and
owner founder description while inspecting source references.

Diagnosis confirmed: requesting a cold facing hides the loaded bitmap, draws a
gray placeholder and can prune the prior inactive container. No role-specific
founder multiplier exists. Decision: prefetch four standing views only for live
identities in batches; retain the same identity's last loaded bitmap through a
cold transition. Never borrow another person's image or revive legacy art.

Scale decision: use the accepted default founder01 standing-South floor-to-top
span (246 native pixels) as a downward-only cap. Each identity's factor is
min(1,246/its standing-South floor-to-top span), stable across every posture,
direction and clipboard. Smaller/nonhuman silhouettes retain their proportions;
oversized human designs shrink by up to about14%. This supersedes global canvas
scale alone. Apply the factor consistently in seat/locator/popup rendering.
No source image edit and no enlargement of small designs.

Sol owns bounded loader/scale implementation plus focused regression tests and
isolated browser proof. Capture all touched existing files before editing under
.local-dev/gs026-loading-scale/before/. Parent reviews exact diffs and visuals.

## Validation progress
Sol implemented the loader retention/batched live-standing prefetch and shared
identity factor. Astra reviewed task-relative production/test diffs and the
three initial browser screenshots. Parent passed player81 files/494 tests,
player TypeScript, isolated production build and source integrity (all1054 PNGs
unchanged). Existing core glide/seat browser tests2 passed. Initial zoom test
incorrectly expected constant pixel dimensions across zoom; returned to Sol to
check stable identity ratios while dimensions grow. Live prefetch was narrowed
to present/location-bearing or frozen actors; no campaign-wide asset preload.
Parent reran focused26 and types successfully after that source adjustment.
Remaining: final delayed moving-turn browser proof and corrected zoom check,
then handoff and stop parent-owned private4199 server. Owner4173/profile untouched.

Final acceptance: Astra independently passed delayed moving-facing/paused-seat
and zoom browser tests2/2 after reviewing the revised assertions, actual diffs
and screenshots. Together with core glide/seat2/2, four browser regressions pass.
Delayed proof advances along adjacent route nodes with nonzero time while East
is held, retains South art honestly, then upgrades to East; unknown identity
remains neutral. Representative visible-height cap and paused seated contact
pass. Scoped diff check passed. Screenshots: artifacts/screenshots/gs026-loading-scale/.
Sol was the implementation worker for this follow-up; no additional worker ran.
Private4199 server stopped and listener absence verified. No owner save used,
no source PNG modified, no commit/push/deployment. Ready for owner playtest via
START_GAME.cmd / http://127.0.0.1:4173 in the usual profile and audited GitHub backup
only upon explicit "push to GitHub" direction.
