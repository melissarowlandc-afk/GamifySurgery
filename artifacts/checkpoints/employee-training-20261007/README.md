# GS-037 employee training: recovery archive (2026-10-07)

The owner approved the training prices, percentage benefits and operating rules,
confirmed that queued staff keep working, requested brief Management copy, and
then said **"Push to GitHub"**. This archive backs up the completed training
milestone on `beta` while other sessions continue editing the same live files.
It does not modify the live runtime or publish the game.

## Included behavior

- Individual paid requests advance hired employees from Level 1 through Level 5.
- Two reserved Training Room stools; 60 seated game-minutes per session.
- Queued staff keep working and finish their active duty/consultation before
  leaving. Outbound travel, training and return make staff unavailable.
- Saves retain payment, queue, remaining work, level gain and return; wages
  continue. Access loss pauses paid work; dismissal refunds unstarted work once.
- All 14 role benefits and increasing prices use the approved balance table.
  Runtime benefits use the unrounded average achieved percentage of hired staff
  in the same category; personal cards describe individual progression.
- Staff-controlled work and new monetary quotes freeze their accepted contract.
  Recovery, travel, outside work and older frozen contracts remain independent.
- Compatible spares can cover an absence; installed onsite work otherwise waits
  locally. Unknown availability produces no nominal player ETA, result or fee.
  Replacement nurses retain the accepted recovery bed through care completion.
- Brief Management copy, session action and seated presentation integrate with
  Claude's separately backed-up button/layout.

## Contents

- `files/`: new GS-037 source, tests, fixture, browser scenarios and scoped docs.
  The training lifecycle module is curated to exclude later independent GS-038
  Training Room upgrade hooks; its source observation and exclusions are recorded.
- `recovery/patches/`: only owned training changes to shared files. Compatible
  baselines are either preserved pretraining snapshots or current source with
  only the owned changes reversed. No complete shared file is bundled.
- `recovery/*verification*.json`: baseline/restored hashes and actual patch
  application evidence. LF-normalized comparisons are explicitly identified.
- `recovery/fragments/`: the exact corrected local-training-wait regression for
  the existing GS-034 diagnostic test file, with its insertion/import directions.
- `recovery/dependencies.json`: compatible-module requirements and the already
  verified Management backup containing the unrounded category-average fix.
- `validation/results.json`: the completed feature's test/type/build/browser
  evidence. `validation/audit.json` records the checkpoint safety checks.
- `manifest.json`: hashes and classification for every included file.

## Recovery

Use a compatible integrated working tree containing GS-034 diagnostic timing,
the approved Training Room/actor support system, and Claude's Management work.
Some exact integration patches require GS-038's prospective NP/room-support
contracts; consult the verification inventory before applying them. This is a
feature recovery archive, not a claim that the existing committed runtime alone
contains all concurrent dependencies.

Copy `files/` over the corresponding repository paths, then apply the listed
patches in the order recorded by the domain verification inventory. For a patch
whose surrounding source still matches its compatible baseline:

```text
git -c core.autocrlf=false apply --check recovery/patches/<file>.patch
git -c core.autocrlf=false apply recovery/patches/<file>.patch
```

If surrounding code has changed, use the patch text to reapply only its training
changes and reconcile the named contracts. Insert the documented test fragment
inside its existing test suite; it replaces the earlier invalid expectation
that a temporary training absence automatically outsources installed work.
Run the recorded checks after recovery. Avoid copying an archived file over
newer room-upgrade work without reconciling the recorded exclusions.

Excluded: independent GS-034/038/039 implementation, Claude Management/Build/
idle-chair/name/motion changes, all artwork and screenshots, proprietary or
private clinical inputs, owner saves/browser storage, credentials, dependency
caches, generated build output and ignored local runtime files. Required
unchanged surrounding code may appear as ordinary patch context.

Owner playtest remains `START_GAME.cmd` -> `http://127.0.0.1:4173` in the same
persistent browser profile. `beta` backup pushes do not trigger the `main`-only
GitHub Pages deployment workflow.
