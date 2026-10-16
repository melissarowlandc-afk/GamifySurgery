# Directional standing stills with a little step bounce

Status: complete locally September29 2026.

## Authorized outcome
Owner selected height3/tempo2 and explicitly requested applying it to ALL game
characters. No walking animation: each moving character uses its direction's
standing still and a small shared bounce. This supersedes earlier walk-cycle
runtime selection and the pending corrected64-frame integration. Preserve all
art/source/approval history; do not delete completed or unfinished walking work.

## Ownership and state
Sol seated_correction_pilot owns bounded runtime implementation and focused
tests; parent owns architecture acceptance, actual diff/image review and docs.
Large dirty shared tree inspected. Preserve GS025 latest service-transition
detour/side-chair-layering changes, GS028 content and GS029 publication history.
Worker captures current owned-file baselines before editing. No install, commit,
push, deployment, saves changes or browser-profile mutation.

## Behavior contract
- Global standing-still movement for every identity and actor category: founder,
  employees, patients and visitors. Existing five animated identities also stop
  using walk frames. No new per-character art or animation configurations.
- Full cosine arcs, maximum3 world pixels of visual lift,2Hz at normal speed.
  Camera zoom magnifies the whole scene normally. Preserve standing body scale.
- Actual path/ground contact/shadow/occlusion depth stays at ground coordinates;
  lift affects character presentation, not movement or routing.
- Stationary and seated states are grounded; smooth motion onset/settle where
  practical. Pause/build freezes; resume maintains animation continuity.
- Retain cold-direction same-identity texture handling and prefetch to avoid
  gray placeholders. Keep seating anchors, queue/route state and save schema.

## Validation
Inspect actual scoped changes against captured dirty-tree baselines. Focused
tests verify3px/2Hz, global no-walk selection, stop/seat/pause/build behavior,
ground-depth invariance and cold-turn retention. Player typecheck and applicable
existing movement/seating tests. Browser runtime evidence via existing repo test
tools on private4199 if available, using isolated test storage; no workaround to
open the previously policy-blocked local reviewHTML. Stop owned server afterward.
No broad repeated tests unless new changes or failures require them.

## Owner pathway
START_GAME.cmd -> http://127.0.0.1:4173 in the usual persistent profile. Private
test4199 storage is separate and never represents the owner's campaign. Runtime
change is local; no remote website update or backup push implied.

## Progress / next action
Sol implemented the shared standing-only selector and per-actor cosine lift.
Root reviewed scoped diffs against captured dirty-tree baselines: actor-local
offset preserves ground snapshots/depth and cold-texture retention, uses zoom
without identity scaling, and keeps labels/locators with the body. Archived walk
registry, PNGs and approval history are unchanged.

Root independently reran six focused files:52 tests PASS; player TypeScript PASS.
Sol production Vite build PASS. Sol controlled live Phaser browser assertions
PASS for founder/staff/patient/service visitor, ground/depth/atlas invariance,
no walk requests, pause/build/resume and stop/seat grounding. First failures are
preserved separately; accepted receipt is
`.local-dev/gs026-step-bounce-runtime/playwright-results-accepted/.last-run.json`.
An earlier concurrent persistence type error was resolved externally; final
root typecheck passes with no edits to that unrelated file.

Final review correction completed by Sol: obsolete walk-contract E2E explicitly
archived with its successor named (5 tests skipped); phase screenshots await
two animation frames. Bounce plus loading/scale browser tests:2/2 PASS. Receipt:
`.local-dev/gs026-step-bounce-runtime/final-regression-results/.last-run.json`.
Root inspected final ground/peak images under
`artifacts/screenshots/gs026-step-bounce-runtime/final-regression/bounce/`:
matching actors, subtle body lift, stable scene. Loading/scale evidence is in the
adjacent `loading-scale/` directory. Browser proof uses controlled live Phaser
states; registry unit coverage spans128 identities, not128 browser playthroughs.
Private4199 server stopped; root independently confirmed no listener.

No new art, source PNG changes, save changes, commit, push or deployment in this
milestone. Owner can Save & Close then launch START_GAME.cmd at the canonical
origin. Next action: owner playtest; ask for "push to GitHub" for audited backup.
