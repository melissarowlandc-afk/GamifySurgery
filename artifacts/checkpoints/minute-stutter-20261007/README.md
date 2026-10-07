# Minute-boundary stutter fix: recovery archive (2026-10-07)

The owner approved this work in chat and confirmed in play that the stutter is
gone. Claude Code did the work outside its usual animation scope, with owner
approval at each step. Full log: `docs/handoffs/CLAUDE_ANIMATION_COORDINATION.md` §4.

## What it fixes

Characters paused at every in-game minute, and the pause grew worse as a
campaign aged. Each facility tick blocked the browser main thread.

1. **Main cause.** Whole-facility door and access validation
   (`validateFacilityAccess`) ran dozens of times per tick. On the owner's
   real Level 3 save (63 rooms, 17 staff) it took about 81% of tick time.
   `packages/game-domain/src/facility-access-cache.ts` now reuses the result
   until room placement or doors change. On that save the cost per tick fell
   from 100–275 ms (reducer) plus 50–120 ms (view) to about 10–15 ms plus
   4–5 ms.
2. **Unbounded history.** Every tick cloned the whole campaign state, and
   the state kept growing. These records now retire once nothing can read
   them again, keeping the newest few:
   - resolved, departed encounters (`retired-encounters.ts`);
   - income receipts, finished service operations, and finished retail trips,
     shoppers and orders (`retired-service-history.ts`).

   Aggregates and milestones keep every rule's result: completed count,
   rolling satisfaction, first-ordinary alert, endoscopy and ambulatory
   gates, still rotation, and economy totals.
3. **Smaller per-tick and per-frame waste.**
   - The duplicate condition synchronize pass is removed.
   - Shopping and amenity schedulers skip departed actors.
   - Patient-list resolution ticks are indexed.
   - Earnings popups no longer scan every receipt on every frame.
4. **Owner-approved bug fix.** A finished in-suite test's stale location no
   longer marks Endoscopy or OR rooms as occupied for procedure consults.

## Contents

- `files/`: complete copies of the new files, which are wholly Claude's.
- `recovery/patches/`: unified diffs of only Claude's hunks in shared dirty
  files. Each baseline was rebuilt by reversing exactly these edits.
  `recovery/patch-verification.json` records that `git apply` of each patch
  to its baseline reproduces the live file byte for byte (SHA-256 included).
- `manifest.json`: SHA-256 of every archived file and live source.
- `validation/results.json`: test, typecheck and measurement record.

## Restore

Copy `files/` over the repository root. Then apply each patch:

```
git -c core.autocrlf=false apply recovery/patches/<file>.patch
```

Patches need surrounding code compatible with the shared tree at this
checkpoint. If a hunk no longer applies, re-apply it by hand from the patch
text.

Not included: Codex's concurrent uncommitted work in the same files, ignored
evidence under `.local-dev/claude-stutter/`, and the owner's save. A copy of
the save was used only for measurement in Claude's session scratchpad.
