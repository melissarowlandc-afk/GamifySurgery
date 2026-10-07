# Build Mode revamp: recovery archive (2026-10-07)

The owner approved the plan and mockup
(https://claude.ai/artifact/Lpk2UQV7N9Go7q3ZoiX5XR), answered the design
questions (ink stars, one-click upgrade, no stars for rooms that cannot be
upgraded, Codex designs the upgrade rules while Claude designs how Build Mode
shows them) and said "Implement!". Claude Code did the work. Full log:
`docs/handoffs/CLAUDE_ANIMATION_COORDINATION.md` (Build Mode revamp entries).

## What it changes

1. **Map labels.** Ink pixel stars under each Build Mode room name: filled up
   to the room's level, empty up to its maximum. Single-level rooms (Front
   Desk, Hallway, Reading Room today) show no stars. A green up arrow marks an
   affordable upgrade, and a red "! NO ACCESS" tag marks an unreachable room.
   Same-type rooms are lettered A, B… only while two or more exist (oldest is
   A; letters close up after a sale; nothing new is saved).
2. **Room menu on the map** (`ui/RoomActionMenu.tsx`). Opens beside the
   clicked room and follows the camera. One-click "Upgrade to ★N · $X"
   (Undo refunds it), the upgrade benefit, Move (the existing move tool, which
   had no button), Doors, and Sell with the existing confirmation dialog.
   It replaces the desk inspector and the upgrade confirmation dialog.
3. **Build tab** (`ui/BuildPanel.tsx`). New Rooms and My Rooms tabs, both
   grouped Patient areas / Diagnostics / Procedures / Staff & support /
   Services (`session/buildModePresentation.ts`). One-line room purposes,
   next-level rooms shown locked, My Rooms with stars, one-click upgrades,
   group totals and an "Only affordable upgrades" filter. One Doors tool
   (click a wall to add, a door to remove) that turns on after placing a
   room; Rotate (R) and Cancel (Esc) appear only while placing; Undo names
   the action and the money it returns; a live problem count.
4. **Benefit text.** `describeRoomUpgradeBenefit` states the effect the game
   applies today (shared +1 completed-visit satisfaction per level, clinic cap
   +3, plus per-level upkeep). GS-038 room-specific effects belong to Codex
   and should be described through that one function when they land.

No domain, balance, save or clinical changes.

## Contents

- `files/`: complete copies of files that are wholly Claude's at this
  checkpoint (`buildModePresentation.ts` and its test, `RoomActionMenu.tsx`,
  and the rewritten `BuildPanel.tsx` and `BuildPanel.test.tsx`).
- `recovery/patches/`: unified diffs of only Claude's edits in shared dirty
  files. Baselines were rebuilt by reversing exactly Claude's edits on the
  live files (or HEAD, for four tracked e2e specs whose only live change was
  Claude's). `recovery/patch-verification.json` records that `git apply` of
  each patch to its baseline rebuilds the live file byte for byte, with
  SHA-256 hashes.
- `evidence/`: screenshots from a synthetic Level 1 test clinic on a separate
  QA server (no owner data).
- `validation/results.json`: typecheck, unit and e2e record.
- `manifest.json`: SHA-256 of every archived file.

## Restore

Copy `files/` over the repository root. Then apply each patch from the
repository root:

```
git -c core.autocrlf=false apply artifacts/checkpoints/build-mode-revamp-20261007/recovery/patches/<file>.patch
```

Patches need surrounding code compatible with the shared tree at this
checkpoint. If a hunk no longer applies, re-apply it by hand from the patch
text. `BuildPanel.tsx` and `RoomActionMenu.tsx` depend on the `ui/types.ts`,
`viewModels.ts`, `usePrototypeSession.ts`, `AppShell.tsx` and
`FacilityScene.ts` patches.

Not included: other sessions' concurrent uncommitted work in the same files,
and the owner's save.
