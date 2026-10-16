# GS-026 simple four-direction walking pilot

Status: complete locally; owner accepted all four directions, September 28, 2026.

Owner follow-up: "That's certainly good enough. Can you apply to more characters?"
This accepts the displayed Blue Glasses pilot, including North/South. Historical
pending statuses below describe the earlier handback; immutable source manifests
remain unchanged. Expansion continues in uniform-walk-expansion.md.

## Goal and authority
Owner accepted the proposed one-human pilot before roster expansion: simple,
reusable East/West/North/South steps instead of gliding. Implement and demonstrate
the pilot locally, retaining existing art approvals separately from new review.

## Scope and constraints
Use Blue Glasses (patient.adult.039) if exact current still crosswalk verifies.
Reuse existing whole-body phases: lateral v7, North draftv1, corrected Southv2.
Eight frames per cardinal share canvas160x320, axis80 and floor287. No new art
generation or deformation, no changes to originals, seated stills or scale policy.
Accepted East/West status is preserved; North/South remain owner-review drafts.
Other identities retain directional stills until their own walking art is ready.
One data-driven playback contract should let a character opt in via a registry.
No route, speed, save, clinical, room, dependency, Git or publication changes.
All test data synthetic. Owner pathway START_GAME.cmd / http://127.0.0.1:4173.

## Shared repository and ownership
Extensively dirty beta; reread root AGENTS, current handoff, GS026 and GS019.
GS025 seating work is active and owns shared FacilityScene/room/session files.
Keep core additions isolated in new walk registry/tool/test paths. Any final
Scene adapter must be a narrow patch against latest file, preserving that work.
Thread messaging tools unavailable. No whole-file restore or broad staging.
Sol seated_correction_pilot owns bounded read-only diagnosis, then delegated
implementation after parent decision. No worker spawn/install/commit/push or
durable plan edits. Astra owns decisions, plan, actual diff/visual/test review.
Capture exact before-edit copies and hashes for touched existing files.

## Milestones and acceptance
1. Verify asset identity, frame pins/registration and current render integration.
2. Package immutable32 frames with provenance/approval status and reusable lookup;
   implement pilot movement-only playback with standing fallback for other IDs.
3. Real Phaser proof: all four directions step, pause/build freeze, stop returns
   standing, cardinal changes keep identity/color, dimensions/anchors stable,
   original movement routes and seated presentation preserved.
4. Show animated review, run focused tests/types/build, inspect actual output,
   update handoff and report local-only completion. Roster expansion follows
   owner review of pilot; no blanket approval inferred.

## Findings
Current P039 West standing file SHA matches original Blue standing reference:
ea7c8af64fb7a6348c204f53401ca96dfc4d3579f2d7b7dd684f64d181736872.
Parent viewed lateral8, original N/S16 and corrected South8 proof sheets.
Reuse whole-body frames avoids earlier rejected segmented-limb seams.
Next: Sol findings and bounded packaging/playback implementation assignment.

Sol confirmed all4 current standing source pins match Blue P039. Parent reran
lateral, North draft and corrected South validators: all PASS. Sol is assigned
byte-exact32 packaging, registry/resolver, focused tests and standalone animated
review first. Scene hookup is temporarily held to avoid active GS025 edits.
Dedicated walk clock uses180ms/frame at1x and simulation speed, frozen by
pause/build and dropped resume delta. No pose-union expansion. Only live pilot
walk assets prefetch; other identities remain still-only. Final game proof must
also show actual canonical2tiles/sec rather than only slowed synthetic movement.
Parent private4199 Vite is running (session29770), fresh profiles only; disclosed
separate test pathway. Owner4173 storage is untouched.

Integration scope clarified: Scene has been unchanged since13:21 while GS025
reviews support/pose/depth corrections. Sol may apply only additive walk-clock,
resolver-argument and bounded pilot preload hooks against a fresh captured file.
Do not edit characterPose, care/seat/room/depth selection or full-file rewrite.
Review immediate-before diff to prove GS025 changes survive; no need to hold
these disjoint hooks behind completion of unrelated seating acceptance.

## Implementation and review progress
Sol packaged32 byte-exact frames and provenance, added opt-in registry/resolver,
walk clock and rendering hooks. Prefetch was simplified during parent review to
run only for an actual drawn walking actor; no duplicated roster scan. Parent
reviewed immediate-before Scene diff: no pose/support/depth/navigation changes.
Asset validator PASS32; player full503/82 and types PASS; isolated build PASS.
Standalone review visually inspected at desktop; browser observed8 unique phases,
four cards, no overflow; mobile390 Pause/Next controls freeze/step correctly.
Review is self-contained and local-only; N/S approval remains pending.
Parent regression browser: founderchoice and zoom PASS; two older seating
fixtures fail because GS025 replaced the support helper's pose argument with a
semantic support role. Sol will capture/update those fixtures only; no production
workaround. New live pilot proof is in progress using actual2tiles/sec movement.

## Final acceptance
Sol seated_correction_pilot completed investigation, implementation, packaging,
proof and fixture compatibility. Astra reviewed actual task-relative diffs,
source pins, standalone animation and in-game screenshot (all4 directions visible).
Parent independent combined browser run:5/5 PASS (pilot, still glide/seat,
delayed loading/scale, founder persistence and zoom). Pilot verifies ordered8
unique hashes for each direction while positions advance at canonical2tiles/sec,
unmirrored rendering, same-person fallback during held fetches, pause/build
freeze, dropped resume delta, stopped still, cold seated upgrade and nonpilot
still fallback. Parent final focused25 and types PASS; earlier full503/82 and
production build PASS. Walk32 and original still1054 integrity validators PASS.
Scoped diff-check PASS. Before snapshots are in .local-dev/gs026-simple-walk/before.

Review: artifacts/character-movement/gs026-simple-walk-pilot/review.html.
Game proof: artifacts/screenshots/gs026-simple-walk-pilot/four-cardinal-visible-steps.png.
Registry opt-in is only patient.adult.039; other127 identities still glide.
Adding another identity reuses playback but requires its own four8-frame sets;
no automatic art synthesis or blanket roster/owner approval is claimed.
Original E/W approval preserved; N/S remains draft awaiting owner review.
Private4199 stopped and free verified. Owner4173/profile not used. Continue
START_GAME.cmd -> http://127.0.0.1:4173 in usual profile. No commit/push/deploy.
Checkpoint remains local; explicit "push to GitHub" prompts a scoped audit,
including inherited private-source/unapproved-art restrictions before any backup.
