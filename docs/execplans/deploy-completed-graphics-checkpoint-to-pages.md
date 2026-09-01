# Deploy completed graphics checkpoint to GitHub Pages

## Goal

Wait for the independently running graphics thread to finish its current
five-room redesign, preserve its completed canonical-room prerequisite, create
a public-safe checkpoint on `beta`, fast-forward `main`, and verify the updated
game at `https://melissarowlandc-afk.github.io/GamifySurgery/`.

## Requirements

- Do not overlap or preempt the independent graphics thread.
- Treat the graphics task as complete only after its plan, handoff, validation,
  empty index, and post-completion stability checks agree.
- Review and release only the finished canonical-room and five-room graphics
  checkpoint; preserve unrelated, diagnostic, ignored, and private work.
- Perform a fresh scoped source, secret, privacy, generated-asset, file-size,
  symlink, and clinical-boundary audit before staging.
- Run the full deterministic test suite, root typecheck, and Pages-specific
  build before committing.
- Scoped-stage the approved manifest only; never use broad staging.
- Push and read back `beta`, non-force fast-forward `main`, monitor the Pages
  workflow, and verify the cache-busted live application and asset references.
- Keep the final handoff current and record worker/test/deployment evidence.

## Constraints and non-goals

- No graphics, gameplay, clinical, balance, save, progression, routing, or
  domain changes are authorized in this release thread.
- Do not modify or inspect the ignored local owner-review asset workspace.
- Do not inspect, stage, commit, or upload the two Examination north-door
  diagnostics or the unreferenced vertical Waiting conflict diagnostic.
- Do not reset, clean, checkout, force-push, rewrite history, or delete files.
- Generated `dist` output remains ignored and is deployed only as the workflow
  artifact.

## Relevant repository state

- The application/content checkpoint is
  `7d8dab437838250b7315a71870ec6ea2d720f3ca`
  (`feat: publish canonical rooms and Level 1 interiors`). It contains the 29
  audited public paths.
- `origin/beta`, local `beta`, `origin/main`, and local `main` contain that
  application checkpoint after the beta push/readback and non-force main
  fast-forward/readback.
- The application checkpoint committed all 29 public release candidates. This
  beta-only closure follow-up changes only this plan and the shared handoff;
  after it is committed, the three excluded diagnostics remain the sole visible
  untracked paths in the local worktree.
- `deploy-pages.yml` triggers from `main`, runs locked installation and the
  deterministic test/Pages build gates, and deploys `apps/player/dist`.

## Decisions already made

- The monitored active task was
  `docs/execplans/redesign-five-level-one-room-interiors.md`.
- Completion was established at 2026-09-01T09:51:23Z: its final milestone was
  checked, Exact next action moved to owner review/playtest, the shared handoff
  recorded validation, the index remained empty, and the public inventory was
  stable across polls at 09:50:45Z and 09:51:23Z.
- The canonical-room prerequisite is part of the same unreleased graphics
  checkpoint and must be released atomically with the five-room redesign.
- The accepted five-room proof set excludes
  `five-room-waiting-bathroom-100-vertical-north-door.png`; it is an older
  unreferenced diagnostic.
- Scoped privacy sanitation in the two public graphics plans is complete;
  release audit continues to enforce those exclusions.
- The user's request explicitly authorizes the beta checkpoint, main
  fast-forward, GitHub Pages deployment, monitoring, and live verification
  after the graphics completion gate.

## Milestones and ownership

1. **Completion monitoring — Terra, read-only.** Identify the active graphics
   plan and wait for the objective completion gate without mutating the tree.
2. **Release-readiness audit — Terra, read-only unless a concrete release
   blocker requires a separately reviewed correction.** Validate the exact
   candidate manifest, full tests, typecheck, Pages build, and public-safety
   scans. Do not stage, commit, push, or deploy.
3. **Release review and checkpoint — Sol.** Review actual source/docs diffs and
   native-resolution accepted proofs, resolve the exact scoped manifest, stage
   only it, re-audit the cached state, and create the `beta` checkpoint.
4. **Remote deployment — Sol.** Push/read back `beta`, fast-forward/read back
   `main`, monitor the Pages workflow, and verify the live URL and asset
   fingerprint.
5. **Closure record — Terra documentation milestone, then Sol review.** Update
   this plan and the shared handoff with immutable evidence; commit/push the
   record without changing application code.

## Acceptance criteria

- The independent graphics task is objectively complete before release work.
- The checkpoint contains exactly the audited public graphics/docs/tests/proofs
  plus this release plan and no diagnostic/private/unrelated paths.
- Full tests, root typecheck, Pages build, and cached diff checks pass.
- No secret, local absolute path, unsafe PNG metadata, prohibited source,
  symlink, ignored/private path, or file over 50 MiB is committed.
- `origin/beta` contains the reviewed checkpoint.
- `origin/main` contains the same application checkpoint through a non-force
  fast-forward.
- The GitHub Pages workflow succeeds for the deployed commit.
- The cache-busted live URL returns HTTP 200 and serves the same hashed
  JavaScript/CSS references as the audited Pages build.
- The three excluded diagnostics and ignored/private work remain local.

## Validation

- Exact status/candidate-manifest reconciliation.
- `git diff --check` and later `git diff --cached --check`.
- `npm.cmd test`
- `npm.cmd run typecheck`
- `npm.cmd run build:pages`
- Explicit-path secret/privacy/prohibited-source/symlink/file-size scans.
- Explicit candidate-PNG metadata scan.
- Sol source-diff and native-resolution proof review.
- Remote branch hash read-back, GitHub Actions conclusion, Pages status, live
  HTTP response, and deployed asset-reference comparison.

## Exact public release manifest

1. `apps/player/src/facility/FacilityScene.ts`
2. `apps/player/src/facility/canonicalRoomShell.test.ts`
3. `apps/player/src/facility/canonicalRoomShell.ts`
4. `artifacts/screenshots/examination-room-v3-build-door-zones.png`
5. `artifacts/screenshots/examination-room-v3-closed-wall-adjacency.png`
6. `artifacts/screenshots/examination-room-v3-explicit-south-door.png`
7. `artifacts/screenshots/front-desk-exterior-panned.png`
8. `artifacts/screenshots/front-desk-grounded-occupied.png`
9. `artifacts/screenshots/front-desk-redesign-entrance-close.png`
10. `artifacts/screenshots/front-desk-v4-shell-detail.png`
11. `artifacts/screenshots/front-desk-v4-shell-normal.png`
12. `docs/execplans/unify-canonical-room-shell-and-examination-grid.md`
13. `docs/handoffs/CURRENT_THREAD_HANDOFF.md`
14. `apps/player/src/facility/fiveRoomPresentation.test.ts`
15. `apps/player/src/facility/fiveRoomPresentation.ts`
16. `artifacts/screenshots/canonical-enclosed-room-100-left-desktop.png`
17. `artifacts/screenshots/canonical-enclosed-room-100-right-desktop.png`
18. `artifacts/screenshots/canonical-hallway-100-edges-desktop.png`
19. `artifacts/screenshots/five-room-clinical-100-door-zones.png`
20. `artifacts/screenshots/five-room-clinical-100-normal.png`
21. `artifacts/screenshots/five-room-clinical-100-north-door-conflicts.png`
22. `artifacts/screenshots/five-room-waiting-bathroom-100-horizontal-normal.png`
23. `artifacts/screenshots/five-room-waiting-bathroom-100-horizontal-north-door.png`
24. `artifacts/screenshots/five-room-waiting-bathroom-100-vertical-normal.png`
25. `docs/execplans/redesign-five-level-one-room-interiors.md`
26. `tests/e2e/canonical-enclosed-room-matrix.spec.ts`
27. `tests/e2e/canonical-hallway-edges.spec.ts`
28. `tests/e2e/five-room-waiting-bathroom-visual.spec.ts`
29. `docs/execplans/deploy-completed-graphics-checkpoint-to-pages.md`

Excluded local diagnostics: `artifacts/screenshots/examination-room-v3-horizontal-north-door-diagnostic.png`, `artifacts/screenshots/examination-room-v3-vertical-north-door-diagnostic.png`, and `artifacts/screenshots/five-room-waiting-bathroom-100-vertical-north-door.png`. All ignored/private/local-workspace paths are also excluded.

## Progress

- [x] Owner explicitly authorized waiting for the active graphics task and then
  publishing the finished game to GitHub Pages.
- [x] Terra identified the active five-room graphics task and completion gate.
- [x] Terra observed the complete plan/handoff/validation and two stable polls.
- [x] Complete fresh release-readiness audit.
- [x] Review and commit the scoped `beta` checkpoint.
- [x] Push/read back `beta` and fast-forward/read back `main`.
- [x] Verify the Pages workflow and live application.
- [x] Finalize the beta-only release record follow-up.

## Discoveries

- The earlier canonical-room task is complete but was never released; it is a
  prerequisite baseline for the five-room interiors and belongs in this
  checkpoint.
- The finished five-room task reports focused Vitest **4 files / 32 tests**,
  player typecheck/build, desktop Playwright **2/2**, and `git diff --check`.
  Fresh release-wide gates remain required here.
- The independent thread used existing registered art only; it reports no
  raster generation, private upload, or clinical/gameplay changes.
- Scoped privacy sanitation was completed in the two source plans before this
  final audit. The exact 29
  public candidates now reconcile with the 32 visible paths and three explicit
  diagnostics.
- Final release-readiness validation passed: the seven workspace suites total
  145 files and 913 tests; root typecheck passed; Pages build transformed 293
  modules and verified two asset references and 100 public build files. The
  candidate-only scan found no credential, private-path, prohibited-source,
  encoding, symlink, ignored-policy, oversized-file, or PNG metadata blocker.
- Sol reviewed the actual source/docs diffs, cached state, and all accepted
  proof images at native resolution before release. GitHub Pages run
  `33495561102` (job `99816808633`) succeeded in 1m17s. A cache-busted live
  request returned HTTP 200 with the same JavaScript and CSS references as the
  audited build: `/GamifySurgery/assets/index-8DTr9UQX.js` and
  `/GamifySurgery/assets/index-FbGXVgJP.css`.

## Exact next action

The owner remotely playtests the deployed game. At a future substantial
checkpoint, remind the owner to explicitly say `push to GitHub` before backup
or deployment. This closure documentation is a beta-only follow-up; `main`
remains exactly the verified application checkpoint and no redundant Pages run
is triggered.
