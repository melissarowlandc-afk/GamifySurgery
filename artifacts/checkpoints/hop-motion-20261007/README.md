# Owner-approved hop motion recovery checkpoint — 2026-10-07

This archive preserves the character movement the owner approved in the
Walk Lab on October 7, 2026: ideas 1 + 2 + 3 + 6. Those are a contact shadow,
distance-driven hop steps, squash and stretch, and breathing with a
seat/exam-table drop-in, with no sway, applied to every character. It
replaces the October 4 bounce and sway, which remains recoverable from
`artifacts/checkpoints/preferred-bounce-20261004/` and commit `d304797`.

It is a recovery artifact, not a clean runnable snapshot. The live renderer
`apps/player/src/facility/FacilityScene.ts` is a shared file that also holds
other uncommitted work. It is deliberately not staged whole; only Claude's
motion delta is preserved, as a patch. The decisions and the full work log
are in `docs/handoffs/CLAUDE_ANIMATION_COORDINATION.md`.

## Contents

- `files/`: full copies of the motion sources and tests at their original
  paths.
  - `characterHopMotion.ts` is new. It holds all approved constants and the
    pure motion math.
  - `characterPresentation.ts` drops the old bounce and sway exports.
  - The tests `characterHopMotion.test.ts`, `characterPresentation.test.ts`
    and `characterPauseArrival.test.ts` are included.
- `recovery/FacilityScene.hop-motion.patch`: a unified diff from the captured
  pre-edit renderer to the edited renderer. Only motion regions change:
  - imports and motion fields, and the `update()` breathing clock;
  - the hop offset in `getCharacterRoutePresentation`;
  - `characterStepMotion`, `drawCharacterPresentation` and `drawPixelPerson`
    (scale around the feet, angle removed);
  - the contact-shadow child and texture;
  - map pruning.
- `recovery/SOURCE_HASHES.json`: SHA-256 hashes of the renderer before and
  after the edit, and the Git commit and blob it was captured against.
- `walk-lab/`: the owner-review comparison page template and its build
  script. The script embeds existing repository stills locally. Its output
  is not stored.
- `validation/results.json`: the checks run on 2026-10-07.

## Restore

1. Verify every payload against `manifest.json` (SHA-256).
2. Copy `files/` to the original paths.
3. Apply the patch only when the live `FacilityScene.ts` matches the recorded
   `before` hash. Otherwise integrate its small motion hunks by hand.
4. Run the player typecheck, then the focused tests: `characterHopMotion`,
   `characterPauseArrival`, `characterPresentation`, `routeMotion` and
   `characterMotionPresentation`. Then run the full player suite.

## Deliberate exclusions

Not included:
- owner saves, browser profiles and storage;
- screenshots, build output and package stores;
- `.env` files, credentials and generated Walk Lab HTML;
- the clinical content and unrelated shared work in the dirty worktree;
- `.claude/launch.json`, which is local tooling.
