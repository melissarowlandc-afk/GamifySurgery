# Desktop splitter: map shade (2026-11-08)

## Goal and scope

Desktop height-only resizing reveals/covers the map without changing its actual
tile scale or top-left world point. Growing the pane drags the map down only
when its bottom would otherwise be exposed. Shrinking never reverses that
translation. Pointer mapping/backing dimensions, chosen zoom and reload remain
correct. Phone camera/render behavior is unchanged.

Owned: facility camera presentation and its origin-local UI preference, tests,
one new desktop e2e spec and the requested research handoff. No domain, clinical,
question, auth/cloud, game save or art changes. Shared tree. No Git, agents,
installs, network, browser, commit/push/deploy. Capture scoped baselines under
`.local-dev/splitter-map-shade-20261108/`; preserve concurrent edits.

## Findings and design

- `WorkspaceSplitter` changes CSS grid shares; in this layout down increases the
  map height (reveals) and up decreases it (covers). ArrowDown/ArrowUp do the same.
- `FacilityScene.calculateLayout` recomputes full/working tile size from viewport
  height and computes default Y as height minus world height on every resize.
  `FacilityCanvas` additionally re-clamps the camera to the new viewport on each
  changed post-step signature. The numerical zoom may remain unchanged even
  while the displayed tile scale changes.
- Keep the desktop's initial sizing reference in its existing, small camera UI
  preference. Freeze base tile sizing and origin against that reference;
  normalize pan only to prevent bottom exposure during growth. Retain a maximum
  revealed height for small worlds so shrinking cannot clamp them back up.
  Legacy preferences without the optional reference use their first real pane.
  Camera preferences stay separate from campaign/FSRS state and the phone store.
- Coalesce resize-related preference publication after the drag settles; no extra
  parent render per pointermove. Retain existing ResizeObserver/rAF bitmap resize.

## Milestones / acceptance

- [x] Deterministic failing scene reproduction and camera helper tests.
- [x] Desktop-only projection/persistence and coalesced reconciliation.
- [x] Unit tests for grow/shrink/bottom/no reverse/zoom/picking/reload/phone.
- [x] Manager e2e spec (zoom and known world-feature position; no fixed sleeps).
- [x] Full player threads, seven workspace typechecks, player build; exact logs.
- [x] Requested `docs/research/splitter-map-shade-20261108.md` and additive handoff.

## Progress / evidence

- Old scene reproduction: 4 failed / 2 passed tests. At the same numerical zoom
  1.1 and width 900, increasing height 350 to 450 changed tiles from 44 to 57 px
  (29.5% apparent zoom). The bottom-origin and reverse-clamp tests also failed.
- Desktop projection retains the first real sizing reference plus the maximum
  revealed height in the existing small per-campaign camera preference (schema 1,
  optional metadata). Existing preferences remain readable. Game/FSRS saves and
  the phone camera key/math are unchanged.
- ResizeObserver/rAF still owns bitmap sizing. During a held splitter pointer,
  the scene draws at resize cadence without publishing a parent camera update.
  One publication follows release and 250 ms settlement. Capture-phase lifecycle
  flush preserves the latest drawn camera on an immediate reload. A late timer
  cannot overwrite a new campaign or an explicit camera change.
- Final focused: 8 files / 105 tests passed, 10.30 s. Seven root workspace
  typechecks passed. Player bundle passed (1039 modules, 4.55 s). E2e spec tsc
  passed; no browser was run. Final full player: 384 files / 3642 tests passed,
  3 files / 3 tests failed (387 files / 3645 tests), 403.54 s, exit 1. The three
  failures match the documented entry baseline: breadButterPresentation choice
  count, levelFiveRoomsViewModels benefit-note regex, separateCampaign codec
  string bound. No assertion or fixture outside this task was changed.

## Next action

Implementation/headless validation complete. Manager runs the new shade spec
and existing management-mode spec on all desktop projects, checks screenshots
and actual picking/crispness, plus phone smoke testing. Exact commands, evidence,
file list and remaining limits are in the research handoff. No release or backup
was created; manager owns integration and any later checkpoint.
