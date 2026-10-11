# Fourth recovery archive work plan - 2026-10-10

Assigned Sol worker for the sole Claude Code GamifySurgery manager. Ownership is
the new `artifacts/checkpoints/manager-accepted-20261010/` archive and disposable
archive-preparation scratch. Existing implementation, accepted plans, prior
archives and the shared manager handoff are read-only. No agents, installs,
Git mutations, commits, pushes, release or publication.

## Goal and acceptance

Preserve all manager-accepted work since
`9b4808ae444539062a49068b498d3460d2bc5724`, following the third recovery archive.
Use exact whole files for new/owned targets and forward/reverse/reapply-verified
patches with bundled HEAD or prior-archive bases for shared targets. Include the
complete mobile shell and all flagged integration changes, icon/runtime HTML,
Variety-3 authoring/assembly/tests, tools/qa additions, mobile design records and
the Level 5 plan with binding M0 owner decisions. Retain app-icon concept art if
within the 400 MB archive / 50 MB per-file limits, with per-file size evidence.

Acceptance authorities: `docs/execplans/mobile-version-20261009.md` MB1-MB10b,
its manager acceptance entries and icon selection; post-backup-3 entries in
`docs/execplans/owner-requests-20261008.md`; the Level 5 and Variety-3 plans;
`docs/handoffs/CURRENT_THREAD_HANDOFF.md`. Technical/editorial acceptance never
constitutes named clinician approval.

## Requirements and exclusions

Exclude active `tools/room-design/level-5/executive-office/**`, owner browser
storage and saves, credentials, `.claude/settings.local.json`, dependency caches,
build output and regenerable large histories. Do not inspect private payloads
or proprietary PDFs. Audit selected text and metadata for secrets, personal
identifiers, save-shaped data, source restrictions, clinical status and ignore
rules. Record exclusions and sizes. Stage proposal is archive plus wholly owned
accepted docs/records only; shared implementation/coordination is recovery-only.

New archive metadata and scripts use UTF-8 without BOM, LF. Byte-exact recovery
proofs preserve inherited source/base bytes; record any inherited exceptions.
No source normalization is allowed to manufacture an exact-byte proof.

## Milestones and validation

1. Inspect instructions, worktree metadata, acceptance records and all three
   prior recovery indexes. Verify prior archive integrity and committed baseline.
2. Reconcile every accepted lane with current bytes and latest prior/HEAD bases;
   capture whole targets or shared-file patches and requirement coverage.
3. Produce manifest, exclusions, safety and clinical audits, stage proposal,
   proposed message, verifier and guarded empty-directory restore script.
4. Verify every archive hash, patch forward/reverse/reapply, live-source identity,
   disk restore round trip, negative verifier/restore guards, staging and sizes.
   Run read-only boundary/launcher checks where this environment supports them.
5. Return exact counts, size, exclusions, safety results and manager decisions.
   Manager retains shared-handoff update, staged-byte audit and GitHub backup.

## Repository state and progress

- HEAD is backup 3: `9b4808ae444539062a49068b498d3460d2bc5724`.
- Shared tree contains extensive older uncommitted work; dirty status alone is
  not evidence of new accepted scope. An Executive Office worker is active.
- Prior archive pattern inspected. Mobile has 100 current files; concept art
  has 296 files / 70,196,451 bytes, largest 1,707,790 bytes, so fits comfortably.
- [x] Reconciled explicit directories, all 34 assembly receipt paths and all 27
  changed existing code paths from the pre-mobile intake. Captured 470 targets.
- [x] Preserved 432 whole files and 38 exact forward/reverse/reapply patches.
  Three older shared untracked targets have no allowed earlier base and are
  explicitly retained as their first recoverable whole state.
- [x] All three prior archives pass integrity and committed-blob invariance.
- [x] Safety, clinical-review and check-ignore audits pass. All 239 existing
  clinical authoring modules are unchanged. Variety-3 and pediatric records
  remain needs_clinician_review; no clinician approval is claimed.
- [x] Actual disk restore: 470 files / 74,704,487 bytes, all exact. Fifteen guard
  checks pass, including payload tamper, duplicate/unmanifested files, invalid
  paths/hunks, nonempty/live-tree destinations and archive overlap.
- [x] Launcher verification passes. Boundaries is sandbox-blocked at spawnSync
  git EPERM and requires the manager's environment rerun. No gameplay suites
  or browser checks were rerun by this archive worker.
- [x] Final inclusive safety/metadata and strict live-source verification is
  recorded in independent-verification.json. SHA-256 manifest, exact size and
  stage list are finalized together; no pending validation remains.
- Next action: manager audit/staging/commit/push/remote verification. Shared
  plans and CURRENT_THREAD_HANDOFF remain manager-owned and untouched by this
  worker. No remote backup exists for this fourth archive yet.
