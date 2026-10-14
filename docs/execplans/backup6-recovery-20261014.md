# Sixth GitHub-backup recovery archive - ExecPlan (2026-10-14)

Assigned worker: GPT-6.1 Sol for the Claude Code GamifySurgery manager. This is
one bounded packaging and verification task. The owner's October 14 "Push to
GitHub" direction is recorded; the manager owns audit, staging, commit, push
and remote verification. The worker may use only read-only Git commands and
does not spawn agents, install dependencies, publish or access owner storage.

## Goal and requirements

Prepare `artifacts/checkpoints/manager-accepted-20261014/` using the fifth
archive's whole-file, shared-patch, manifest, exclusions, validation, stage-list,
verification and isolated restore pattern. Baseline is commit `10e3c228` and
all five prior recovery layers. Preserve prior archive bytes. Capture all
manager-accepted changes since the baseline, especially Beta 1 accounts,
playtime, flags, notice/account UI in both shells, Supabase migrations/tests,
empty player env example, setup/release documents and the thyroid test fix.
Check the Level 5 E2E fix and earlier mobile/icon/Variety-3/Level 5 records;
reference already preserved unchanged targets explicitly.

Keep physical text UTF-8 without BOM and LF. Prove exact current recovery,
including any inherited base line endings, without changing live source bytes.
Keep the archive below 400,000,000 bytes and each file below 50,000,000 bytes.
Exclude secrets, real env files, owner saves/storage, proprietary sources,
machine settings, logs/build/test output and regenerable image histories.
List excluded image sizes. All clinical review status remains unchanged.

## Repository state, ownership and decisions

- Shared tree with extensive older dirty/untracked work; preserve it.
- HEAD at intake: `10e3c228`, fifth recovery checkpoint. No Git writes.
- Owned: new archive, this task record, and an append-only worker handoff.
- Implementation and shared documents are recovery-only. Wholly owned new
  accepted setup/release docs and this task record may appear in STAGE_PATHS.
- Previous gameplay validation is historical evidence. Archive validation
  checks hashes, patch exactness, safety, scope and restore guards; it does
  not operate Supabase or assert a new browser/gameplay acceptance run.

## Milestones and acceptance

1. Inspect prior manifests/recovery contracts, manager records and live deltas.
2. Capture whole owned files and exact shared patches against prior/HEAD bases;
   account for unchanged prior targets and unrelated/regenerable exclusions.
3. Audit secrets/privacy/proprietary sources, unchanged clinical statuses,
   check-ignore and encoding. Verify all five prior archives remain unchanged.
4. Verify every manifest hash and forward/reverse/reapply patch; restore to
   an empty isolated directory; test corruption/path/overwrite guards.
5. Hand back counts, sizes, exclusions, evidence and manager decisions. No push.

Validation: `python artifacts/checkpoints/manager-accepted-20261014/verify_archive.py
--check-live-stage-files --check-live-recovery-files`; archive safety and
clinical audit scripts; restore dry-run and disk round-trip; read-only
`git check-ignore --no-index`. Exact results will be stored in `validation/`.

## Progress and next action

- Intake inspected the instructions, dirty tree, fifth archive and manager
  records. Fifth checkpoint already captures mobile/icon/Variety-3/Level 5.
- Beta 1 steps 1-3 and thyroid CI readiness have explicit manager acceptance
  entries; live Supabase/SMTP checks remain pending owner setup.
- Scope reconciled: all 20 changed earlier accepted targets and all 24
  pre-Beta intake changes are in the assigned lane. No earlier target missing.
  Mobile plan, Level 5 plan and the Level 5 E2E manager fix already preserved.
- Captured 43 whole files and 26 shared patches, 69 current targets total,
  plus three required unchanged references. Three inherited CRLF base/patch
  pairs use lossless base64 with readable LF review projections; current
  targets and all physical archive files remain UTF-8/no BOM/LF.
- Safety PASS: no real env/credentials, patient/owner save data or proprietary
  payloads; empty env example only; physical/logical/stage check-ignore PASS.
  The only credential-literal review was an HTML autocomplete attribute.
  Synthetic test identities/URLs/tokens are explicitly classified.
- Clinical review audit PASS; Variety-3/pediatric/GS-028 draft records remain
  needs_clinician_review. 330 fifth-checkpoint authoring/source hashes and
  352 distinct clinical source files remain unchanged; current src/tests
  inventory has no paths absent from pre-Beta intake.
- All five prior manifests and 8,383 committed physical Git blobs match.
  Strict verification checks 8,271 live targets and all 26 historical bases.
  Exact 69-file disk recovery and 22 corruption/path/overwrite guards PASS.
- Excluded inherited regenerable images: 1,584 room renders / 623,769,818
  bytes and 360 inspector history images / 38,992,911 bytes. Raw scratch
  inventory is summarized by directory so no oversized file is introduced.
- Archive approximately 19.2 MB; largest file approximately 10.8 MB. Final
  exact size/counts are in the archive's validation/archive-size.json.
- Next action belongs to the manager: inspect actual archive/scoped docs,
  rerun strict verification and safety checks after any edits, stage only
  STAGE_PATHS, commit/push the current branch and verify the remote commit.
  Owner backup authority is already present. No GitHub backup or release
  publication was performed by this worker; no archive-scope decision remains.
