# Backup Current Beta Checkpoint - 2026-09-01

## Goal

Create a public-safe GitHub backup of the current validated product, graphics,
UI, workflow, clinical development-preview, and documentation milestones on
branch `beta`, while preserving unrelated local-only material. Verify that the
pushed remote branch contains the exact checkpoint commit. Do not merge,
deploy, or publish GitHub Pages.

## Requirements

- Audit every tracked modification and untracked path before staging.
- Exclude credentials, private or proprietary clinical inputs, owner reference
  photos, generated-image source workspaces, local logs, browser traces, and
  other ignored/transient state.
- Exclude incomplete or clinically unsafe work even when it is technically
  trackable.
- Preserve the patient-presentation overlay's exact unapproved boundary:
  `aiAssistedDrafting: true`, `needs_clinician_review`, null last review, and
  `synthetic_unapproved_prototype`. A source backup must not be described as
  clinical approval or a learner/public release.
- Preserve all excluded work in the local working tree without reverting,
  deleting, moving, or rewriting it.
- Stage only explicitly audited paths; do not use broad staging until the
  complete candidate set has been reviewed.
- Review the staged diff, run proportional source/secret/privacy/clinical and
  repository validation, commit on `beta`, push `beta`, and verify the remote
  branch resolves to the created commit.
- Record the pushed branch and commit in the current handoff.

## Constraints and non-goals

- The instruction "Backup to GitHub" authorizes a checkpoint commit and push of
  the current `beta` branch only. It does not authorize merging to `main`, a
  Pages deployment, release publication, history rewrite, deletion, or cleanup.
- The GitHub repository is public. No ignored/private clinical workbooks,
  source inputs, credentials, user browser data, or proprietary reference
  material may enter the commit.
- The completed presentation overlay may be backed up only as explicitly
  unapproved owner/development-preview source. Do not promote its AI-assisted
  chief complaints or presentations to `clinically_approved`, deploy them to
  Pages, or present them to learners as approved content.
- Do not add ignored `Photos for Codex/`, `generated_images/`,
  `.clinical-workbench/`, `.local-dev/`, `test-results/`, `artifacts/logs/`,
  `.env*`, build outputs, or dependency directories.
- Preserve the three long-standing local diagnostic screenshots outside the
  checkpoint:
  `examination-room-v3-horizontal-north-door-diagnostic.png`,
  `examination-room-v3-vertical-north-door-diagnostic.png`, and
  `five-room-waiting-bathroom-100-vertical-north-door.png`.
- Preserve the concurrently created, not-yet-implemented
  `docs/execplans/polish-front-desk-occlusion-and-actors.md` outside this
  checkpoint. It appeared after the audit began and still has three pending
  implementation milestones; its future worker changes belong to a later
  checkpoint.
- The large tracked/untracked screenshot and raster-asset set may be included
  only when its paired source, manifest, test, plan, and completed handoff
  evidence establish that it is a deliberate repository artifact.

## Relevant repository state

- Current branch is `beta`, tracking `origin/beta`; the locally cached
  divergence count at task start is 0 ahead / 0 behind.
- The starting worktree spans completed draggable-splitter, density, Management
  Mode, compact-chart, edge-anchored layout, room-wall/door, character-resolution,
  Cortan workflow, save-diagnosis, and canonical-opening-path checkpoints.
- The first presentation-deduplication worker stopped with an incomplete draft,
  but a later `finish_explicit_presentation_overlay` milestone replaced it with
  literal source-to-final mappings, completed schema invariants, and passing
  tests. Current file timestamps, contents, plan, and handoff supersede the
  earlier worker summary.
- Existing ignored paths protect owner clinical inputs, owner reference photos,
  generated-image sources, logs, test traces, environment files, dependencies,
  and build output. Ignore rules are not themselves sufficient evidence, so the
  staged set still requires direct review and secret/privacy scanning.
- `docs/handoffs/CURRENT_THREAD_HANDOFF.md` contains the completed milestone
  validation and ownership record plus the local save diagnosis/design.

## Decisions already made

- Use a single checkpoint commit on `beta` for the integrated, public-safe
  candidate because the completed UI/graphics milestones overlap extensively
  in shared files such as `AppShell.tsx`, `FacilityScene.ts`, and `global.css`.
- Include the completed v2 presentation overlay, canonical-design paragraph,
  compact-chart plan/E2E/proofs, and handoff record because each accurately
  keeps the revisions `needs_clinician_review` inside the explicitly unapproved
  prototype. This is a source backup, not clinical approval or deployment.
- Include repository-native runtime PNG atlases and intentional visual proof
  screenshots only after binary-size and provenance/plan review; exclude ignored
  source/reference workspaces.
- Include the durable browser-persistence ExecPlan and canonical-origin
  instruction as design/workflow records; no persistence implementation is
  claimed.
- Fetch/recheck the remote immediately before committing or pushing. If remote
  `beta` has advanced, stop and reconcile without force-pushing.

## Milestones and ownership

1. **Public-safety and scope audit - Terra.** Read-only review of every dirty
   group, ignored/private boundaries, secrets, clinical status, generated
   assets, branch/upstream state, and exact staging exclusions. No writes or Git
   mutations.
2. **Checkpoint plan and candidate reconciliation - Sol.** Review Terra's
   evidence and actual diffs; finalize the explicit path set and exclusions.
   Sol may edit only this plan and the final handoff record.
3. **Staged checkpoint verification - Sol.** Stage the audited paths without
   disturbing exclusions; inspect staged names/stat/diff, scan staged blobs for
   secrets/privacy/clinical hazards, run applicable tests/checks, and verify the
   remaining visible unstaged work is exactly the three protected diagnostics
   plus the concurrent Front Desk polish plan or later work from that thread.
4. **Commit, push, and remote verification - Sol.** Create the checkpoint
   commit, push `beta`, verify `origin/beta` and GitHub contain the commit, then
   update/push the handoff record if a follow-up documentation commit is needed.

## Acceptance criteria

- No ignored/private/proprietary/credential/transient path is staged.
- Every staged patient-presentation revision retains explicit AI-assisted,
  `needs_clinician_review`, null-review, and unapproved-prototype metadata; no
  clinical question, answer, claim, source, or prior approval is changed.
- All staged source and documentation paths belong to completed or explicitly
  design-only milestones documented in their ExecPlans/handoff records.
- Runtime art and screenshots are deliberate repository artifacts with no
  embedded personal, patient, credential, or proprietary-source content.
- Staged secret/privacy/clinical scans report no unsafe candidate.
- `git diff --cached --check` passes, along with proportional source tests,
  typecheck, build, and workflow/asset validators selected after final scope is
  known.
- The checkpoint commit is created on `beta`; `git push origin beta` succeeds
  without force; remote verification resolves `origin/beta` to the commit.
- The final visible local worktree contains only the three deliberately
  excluded diagnostic screenshots and concurrent Front Desk polish work, and
  the handoff names the verified branch/commit and local-only exclusions.

## Validation

- `git status --short --branch`
- `git diff --name-status` and `git diff --cached --name-status`
- `git diff --check` and `git diff --cached --check`
- Targeted staged-content secret/privacy/source scan, including common token,
  private-key, credential, proprietary-source, and patient-identifier patterns.
- Clinical-review status check for any staged clinical path.
- Runtime PNG/manifest/workflow structural validators and focused/full tests as
  dictated by the final staged scope.
- Player and applicable workspace typechecks/build.
- `git fetch origin beta`, divergence check, ordinary `git push origin beta`,
  and post-push `git ls-remote`/local remote-ref verification.

## Progress

- [x] Read repository instructions and current handoff.
- [x] Confirm the current branch/upstream and inventory the initial dirty tree.
- [x] Identify ignored private/transient directories and the protected local
  diagnostic exclusions.
- [x] Complete Terra's public-safety and file-scope audit, including its revised
  assessment of the later completed clinical overlay.
- [x] Finalize and review the explicit staged candidate.
- [x] Run staged validation and source/privacy/clinical checks.
- [ ] Commit the public-safe checkpoint on `beta`.
- [ ] Push and verify the remote branch.
- [ ] Record the verified backup in the handoff.

## Discoveries

- The dirty tree combines numerous completed milestones because many responsive
  and graphics tasks intentionally shared core layout/rendering files.
- A stale worker summary described the first presentation overlay as incomplete.
  The actual current files postdate it, use literal mappings rather than
  runtime derivation, and pass focused and full clinical validation. The later
  completion handoff is authoritative for checkpoint scope.
- Current clinical validation passed 40 files / 269 tests plus clinical-content
  typecheck. Terra independently reran the two overlay/narrative files (14/14),
  chart component tests (14/14), player build (298 modules), and full workspace
  typecheck. The overlay remains explicitly unapproved.
- The ignored owner/reference/generated workspaces remain local and are not
  ordinary backup candidates for this public repository.
- A GitHub backup and a Pages deployment are distinct actions. This task stops
  after verifying `beta` unless the owner later gives a separate deployment
  instruction.
- A new Front Desk actor/occlusion plan appeared after the audit began with all
  implementation milestones still pending. Freezing the audited index now
  prevents that concurrent task from entering this checkpoint accidentally.
- The frozen candidate contains 197 paths (11,130 insertions and 1,094
  deletions). `git diff --cached --check`, staged secret/privacy scans, the
  ComfyUI and character validators, full workspace typecheck, player build,
  focused chart tests, and the 40-file/269-test clinical suite passed. The
  player build retained only its existing large-chunk advisory.
- Four Front Desk/art paths gained later working-tree edits after the candidate
  was staged. Their audited pre-polish versions remain frozen in the index; the
  later edits and unfinished plan remain unstaged for the other thread.

## Exact next action

Recheck the staged snapshot and remote divergence, create the checkpoint commit
on `beta`, push it without force, and verify the remote branch resolves to the
created commit.
