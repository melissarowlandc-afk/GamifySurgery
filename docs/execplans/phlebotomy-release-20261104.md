# Accepted phlebotomy presentation port — 2026-11-04

## Goal, acceptance and constraints

Manager accepted the live 192/192 browser capture and review sheet. Port only
the chair -15%, cushion/patient anchor and adjacent clinician/stool placement
into GS-release. Preserve the release's original character sizing/art, other
room records, gameplay/queue/routing, clinical, cloud and UI work. Pending 244
seated corrections and 19 redraws must not enter this worktree. No QA page/tools
unless required by tests. No Git, installs, network, worker browser or agents.

Read live C:/Users/rowla/Projects/GamifySurgery only; write solely inside
C:/Users/rowla/Projects/GS-release. Shared tree: retain all concurrent work.

## Repository state and ownership

Manager already copied facility/phlebotomyPresentation.ts and
approvedRoomPresentation.ts. Their hashes exactly match the accepted two-file
production patch (6e99e881… and 418e0286…). Relative to the task's pre-fix
approvedRoomPresentation.ts, only the four approved phlebotomy import/adapter/
return hunks differ. No actor scale, seated-correction or redraw hunk is present.

Live FacilityScene changes since the pre-fix baseline are exclusively read-only
debug telemetry and protected QA seams/support extraction. Release already uses
the support resolver directly, so none is needed. Live/release viewModels diffs
belong to learning-development/room-access lanes, not phlebotomy. The bitmap
manifest is identical. Leave all three production files untouched.

Owned changes: the four named existing facility test files and a release-only
phlebotomyPresentation.test.ts, this plan and additive current handoff entry.
No copying whole release production files. Baselines, source/art hashes, scoped
patch and logs: .local-dev/phlebotomy-release-20261104/. Initial snapshot covers
4,431 source/art files. The new test must use release APIs and require no
character proportion helper/data or QA page/model.

## Milestones

- [x] Read instructions/handoff and inspect release/live changes without Git;
  verify manager-copied production scope and preserve starting hashes/copies.
- [x] Reproduce only the six named old-expectation failures; update their
  phlebotomy expectations deliberately, retaining all other-room assertions.
- [x] Add release-native regressions for chair/stool crops/scale, cushion
  anchors, live support path, floor/depth/mask ordering and unchanged actor size.
- [x] Run focused tests, full player CI=true/threads, and seven typechecks.
- [x] Inspect scoped diff and protected source/art hashes; list every changed
  release file and leave handoff with exact validation and any open risk.

## Validation

Use the existing release process-local Vite net-use preload, which also blocks
Git execution before spawn. No application source or timeout modification:

```powershell
$env:NODE_OPTIONS='--require=C:/Users/rowla/Projects/GS-release/.local-dev/service-queue-waiting-release-20261102/validation-preload.cjs'
$env:CI='true'
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads <focused files>
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads
npm.cmd run typecheck
```

Browser acceptance is the manager's completed live 192/192 run. This release
port does not change an origin, launcher, profile or playtest pathway.

## Discoveries during test adaptation

The initial four-file control reproduced exactly the six named old phlebotomy
expectation failures (54 other assertions passed). The release registration
uses a fixed horizontal origin .5 and one downward-only identity scale; the live
test's pending floorAnchorX/proportion APIs are absent. The release test uses
that original path, and separately proves idle/seated calls retain the same
identity scale. No helper/data was imported to make live-only APIs compile.

An attempted universal silhouette-rectangle assertion was too strong for the
release's pre-normalization art: patient.adult.037 / gs022-new-employee-015 at
tile 71 has a -1.15px rectangle gap, but a native nearest-sampled diagnostic
finds zero opaque-pixel overlap (extreme-native-box-audit.json). The new public
regression instead covers the manager-accepted normal/wide QA patients against
all five phlebotomists, both views and tiles 22–130. Existing test assertions
were changed only for the requested phlebotomy placements; no production offset
or actor scale was altered to satisfy that attempted broader criterion.

## Final validation and handoff

- Focused: **5 files / 71 tests PASS**, 27.35s (focused-after.log).
- Full player: **332 files / 3,370 tests PASS**, 533.09s, CI=true,
  --pool=threads, existing four-worker configuration (player-full.log).
- **All seven workspace typechecks PASS** on the final code (typecheck.log).
- Initial six named assertion failures are resolved. No timeout or unrelated
  assertion/configuration was changed. Early new-test adaptation failures and
  the exploratory rectangle audit remain in separate logs for provenance.
- Source audit: exactly the four requested existing test files differ from the
  initial 4,431-file source/art inventory; **4,427 other files unchanged**.
  New source is only phlebotomyPresentation.test.ts. Production manager copies
  still match accepted hashes. FacilityScene, viewModels and bitmapAssetManifest
  are unchanged. No proportion helper/data, new character image or QA import.

Worker-modified/added paths: the five tests listed in ownership, this plan, and
the additive docs/handoffs/CURRENT_THREAD_HANDOFF.md entry. The two manager-copied
production files were verified and not rewritten. All generated baselines,
logs, diagnostic JSON, source patch and complete path/hash manifest are confined
to .local-dev/phlebotomy-release-20261104/. release-scope.json enumerates every
source/documentation path and every local review artifact.

Port complete. Manager can inspect source-changes.patch / release-scope.json and
continue its release/checkpoint process. The live worktree was read only; no
Git, installs, network, browser or other-lane writes. No backup, deployment or
publication is claimed. Canonical playtest pathway is unchanged.
