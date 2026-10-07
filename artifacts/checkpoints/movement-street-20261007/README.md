# Movement jumps and street arrivals recovery checkpoint — 2026-10-07

Owner-approved on October 7, 2026 ("Yes, implement fixes for 1-3. Get rid of
front door appearances…"). This archive preserves two changes:

1. **Render-only movement continuity** (`routeMotion.ts` plus a motion hunk in
   `FacilityScene.ts`):
   - finished and first-seen stationary characters are parked, so a new
     route starts where they stand instead of popping 2 tiles ahead;
   - catch-up up to 2.5x while the render trails the logical position after
     frame stalls;
   - route handoff walks back along the known edge instead of snapping.
2. **Street arrivals and departures** (`retail-operations.ts`,
   `displaced-routing.ts`): walk-in shoppers and patient/peri-op companions
   start off-map and walk the sidewalk in; anyone leaving from the street
   walks straight off-map.

It is a recovery artifact, not a clean runnable snapshot. `FacilityScene.ts`
is tracked but holds much other uncommitted work. `retail-operations.ts` and
`displaced-routing.ts` are untracked files holding other sessions' work. None
is staged whole; only Claude's delta is kept, as patches verified to rebuild
the live files byte-exactly. Decisions and the full log:
`docs/handoffs/CLAUDE_ANIMATION_COORDINATION.md` §4.

## Contents

- `files/`: full copies at original paths of `routeMotion.ts`,
  `routeMotion.test.ts` and `packages/game-domain/tests/street-arrivals.test.ts`.
- `recovery/*.movement-street.patch`: unified diffs from the reconstructed
  pre-edit text to the live file for `FacilityScene.ts`,
  `retail-operations.ts` and `displaced-routing.ts`.
- `recovery/SOURCE_HASHES.json`: before/after SHA-256 for each patched file
  and the commit they were captured against.
- `harness/`: the diagnostic replay harness (`jumps.test.ts`, `harness.ts`).
  It runs the real domain and facility view model and replays route motion at
  60 fps, flagging visible jumps. Place it under `.local-dev/claude-motion-jumps/`
  and run it with `npx vitest run --root . <path>`.
- `validation/results.json`: the checks run on 2026-10-07.

## Restore

1. Verify every payload against `manifest.json` (SHA-256).
2. Copy `files/` to the original paths. `street-arrivals.test.ts` needs the
   `retail-operations.ts` and `displaced-routing.ts` changes.
3. Apply each patch only when the live file matches its recorded `before`
   hash. Otherwise integrate the small hunks by hand.
4. Run both typechecks, the player facility tests, `street-arrivals`,
   `retail-operations`, `service-operations` and `level-two-endoscopy`.

## Deliberate exclusions

Not included: owner saves, browser profiles and storage; screenshots and
build output; `.env` files and credentials; clinical content; unrelated
shared work in the dirty worktree; `.claude/launch.json`.
