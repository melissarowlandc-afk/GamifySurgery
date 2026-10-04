# Apply preferred character movement

## Authorized GitHub checkpoint - October 4
Owner explicitly requested "Push to GitHub" after implementation. This supersedes
the earlier no-commit/no-push constraint for a scoped backup only. Current branch
beta at b5c2332 initially matches origin/beta. Index is initially empty. Pages
workflow deploys only main; beta backup will not publish the site.
Large unrelated dirty changes overlap FacilityScene and other runtime files.
Follow existing archival checkpoint convention: reviewed movement sources/tests,
exact recovery patch for shared FacilityScene, accepted preview and evidence,
manifest and recovery limitations. Do not stage entire shared runtime files or
unrelated work. Terra audits drift/scope and packages; root reviews actual staged
files, runs integrity/safety checks, commits and pushes beta, verifies remote SHA,
then records checkpoint SHA in CURRENT_THREAD_HANDOFF.md using scoped index edit.
No merge/deployment/private inputs/proprietary sources/raw captures or credentials.

## Goal and authorization
October 3 owner explicitly requests applying the accepted preview to the game:
7 world-pixel cosine bounce at 2 Hz, north/south-only +/-1.5 degree sine sway
at 1 Hz, zero east/west rotation, and 120 ms settling on actual stops. Preview
0.7-second corner pauses were demonstration only and must not enter gameplay.

## Constraints and repository state
Large shared dirty worktree; preserve unrelated work, source art, prior previews,
identity scale, routing speed, saves, seating, depth, texture-loading safeguards,
and pause/build freezing. No clinical edits, installs, commit, push or publication.
Apply uniformly through shared actor presentation, including founder, staff,
patients and visitors. Turns do not reset ongoing bounce phase or delay routes.
Seated/non-floor poses must be grounded and upright without a leftover settle.
Lift scales with camera zoom; angle does not. Ground/shadow/depth remain stable.

## Ownership and milestones
Terra owns one implementation milestone: characterPresentation.ts and its tests,
FacilityScene.ts, focused character-step-bounce E2E and bounded local validation
evidence. Capture owned-file pre-edit baselines to review this change independently
of existing dirty edits. Root owns decisions, actual diff review, acceptance,
this plan and CURRENT_THREAD_HANDOFF.md. Workers do not spawn agents.

1. Inspect shared bounce lifecycle; implement accepted motion and stop settling.
2. Focused unit/runtime tests, player typecheck and isolated browser validation.
3. Root reviews scoped diff and evidence, reruns focused acceptance, records handoff.

## Validation and acceptance
Meaningful tests cover 7px/2Hz, +/-1.5deg/1Hz only north/south, continuous turns,
actual-stop 120ms settle, seat/reset, pause/build/resume, zoom and stable ground
depth. Use existing route/presentation/art tests and targeted player typecheck.
Adapt existing live Phaser E2E; validate all actor types, no added route pauses,
no rotation on sideways/seated actors, and inspect screenshots. Prefer established
private test4199 and isolated browser storage, never owner's campaign/profile.
Canonical owner path remains START_GAME.cmd -> http://127.0.0.1:4173.
Tests use separate storage and are not the owner save. Shut down owned test servers.

## Progress / next action
Complete locally October3. Terra implemented the shared helper/constants, actor
transform lifecycle and focused tests in the four owned files. Baselines are at
.local-dev/preferred-character-bounce/*.before. Root reviewed actual baseline-relative
diffs, caught and returned a frame-dependent settling calculation, and accepted the
corrected immutable stop sample with smoothstep decay. Tests verify repeated halfway
redraws remain identical and seating from nonzero lift/tilt grounds immediately.

Validation: Terra34 focused unit tests and typecheck PASS. Root independently ran
36 presentation/route/art tests PASS, player typecheck PASS, boundaries/launcher
checks PASS and player Vite production build PASS (existing large-chunk advisory).
Root independently ran bounce plus cold-loading/scale browser tests:2/2 PASS in12.9s.
Receipt: .local-dev/preferred-character-bounce/parent-browser-results/.last-run.json.
Root inspected ground/peak screenshots in artifacts/screenshots/preferred-character-bounce/.
All actor categories retain ground/depth and still art; directional sway, 7px peak,
pause/build/resume,120ms settle and immediate seated reset passed live Phaser checks.

Initial worker auto-server proof hit an unrelated transient ./staff import overlay;
fresh explicit apps/player --force dev server resolved it. Accepted browser proofs
used isolated127.0.0.1:4199 storage. Parent-owned server stopped after testing.
No route timing/speed/corner pauses, source art, save/schema, launcher, clinical,
commit, push or deployment changes. Next action: owner playtest via START_GAME.cmd
at http://127.0.0.1:4173; request audited GitHub backup with "push to GitHub".
