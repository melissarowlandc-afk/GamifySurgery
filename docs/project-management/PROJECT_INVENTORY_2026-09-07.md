# Gamify Surgery Project Inventory — 2026-09-07

**Status:** Ready for owner review. This is a read-only reconciliation of the shared worktree, handoffs, plans, and current Git refs. It is not a release, acceptance of local work, or authorization to push.

## Product position

**Stitchin' Time** (repository/deployment identity: **GamifySurgery**) is a browser-based surgical-clinic management and learning prototype. The active local slice is a deterministic React + Phaser game with named browser-local campaigns, campaign-scoped FSRS learning state, synthetic/unapproved prototype content, Level 0-2 play, and a locked Level 3 preview. It combines chart decisions, facility construction, staffing, timed results, patient routing, satisfaction, alerts, and tutorials.

The intended near-term outcome is a coherent, owner-playtested local prototype. It is not yet an authenticated or cloud-synchronized application, a public learner clinical release, or an outside-user pilot. The later accepted direction remains private Supabase-backed saves, invite-only authentication, an owner-controlled authoring/review flow, and a private pilot after technical and clinical gates.

## Authority map and documentation cautions

| Source | Use it for | Current interpretation |
| --- | --- | --- |
| `AGENTS.md` | Safety, clinical provenance, local playtest origin, checkpoint lifecycle | Binding except where superseded by the current user instruction. Do not ingest proprietary sources; the canonical local playtest origin is `http://127.0.0.1:4173` launched through `START_GAME.cmd`. The older exact **“push to GitHub”** phrase is superseded: the current instruction authorizes a scoped backup once the user agrees the bounded task is complete. |
| `PROJECT_BRIEF.md`, accepted ADRs, `CANONICAL_DESIGN.md`, `ARCHITECTURE.md` | Product and architecture decisions | Durable product intent. `ROADMAP.md` is a useful delivery view but was last updated 2026-08-25 and predates current local work. |
| `docs/handoffs/DURABLE_BROWSER_PERSISTENCE_RESUME.md` and `docs/execplans/durable-browser-persistence.md` | Active persistence work | Authoritative over the older persistence material in `CURRENT_THREAD_HANDOFF.md`. M1 is accepted; M2 is rejected/incomplete and is not live. |
| `docs/handoffs/GRAPHICS_THREAD_HANDOFF_2026-09-07.md` and its referenced graphics plans | Current graphics work | Authoritative concise graphics state. Current repairs are local/uncommitted; the final combined browser run is not green. |
| `docs/handoffs/CURRENT_THREAD_HANDOFF.md` | Broad historical checkpoints, content queue, and completed local work | Useful but expansive and partially stale. Its initial persistence section agrees with the dedicated resume; its older “historical local-save diagnosis” does not govern next action. |
| `docs/clinical-workbench/CONCEPT_RELEASE_POINT_REVIEW_QUEUE.md` | Owner clinical-review queue and runtime-admission boundaries | Active review queue, explicitly not a playable clinical release. Exact content approval is separate from source/claim prose review. |

### Reconciliation notes

- `ROADMAP.md` says the local `beta` branch had not been deployed to Pages, but the handoff establishes a later Pages deployment from `main` at `7d8dab4`. Treat the handoff's dated commit/run evidence as the deployment record.
- The handoff records multiple accepted local checkpoints. “Accepted” means prior Sol review described in its record; it does **not** replace current owner review or authorize a new backup/release.
- The handoff calls `3bb92ff` the 2026-09-02 backup, while current `beta` and `origin/beta` are `fd5ccdc` because a subsequent documentation commit recorded that backup. The source checkpoint remains in history; current branch alignment is verified below.

## Verified repository state (checked 2026-09-07)

| Item | Observed state |
| --- | --- |
| Current branch / tracking | `beta...origin/beta` |
| `HEAD` and `origin/beta` | Both `fd5ccdcefdfeb4e2a8c3c5a16511ce90b81f8853` (`docs: record verified beta backup`) |
| Latest valuable source backup in ancestry | `3bb92ffaee22e4c1636b6db7ef1ee720670ba00d` (`chore: back up integrated beta checkpoint`) |
| `main` / `origin/main` | Both `7d8dab437838250b7315a71870ec6ea2d720f3ca` (`feat: publish canonical rooms and Level 1 interiors`) |
| GitHub access / remote state | PM independently verified today: active account `melissarowlandc-afk` has `ADMIN` access to the public repository; remote refs are `beta` = `fd5ccdc` and `main` = `7d8dab4`; no open issues or pull requests. |
| Working tree | **Pre-inventory snapshot:** 137 porcelain entries: 86 modified, 51 untracked, no deletions. `git diff --stat` reports only the 86 tracked changed files: 3,936 insertions, 503 deletions. |
| Change distribution | `apps/` 44 paths; `artifacts/` 44; `packages/` 25; `docs/` 9; `tests/` 7; `tools/` 7; `package-lock.json` 1. Categories overlap by path count only, not ownership. |

The tree is deliberately shared and heavily dirty. The top-level distribution is a porcelain-path grouping, so renamed-path representation and directories are not a complete ownership ledger. Nothing was staged, reset, cleaned, committed, pushed, deployed, or tested by this inventory task.

## Backup and release ledger

| State | Evidence and scope | Project implication |
| --- | --- | --- |
| **Backed up to `beta`** | `3bb92ff`, recorded as a 197-path audited source backup on 2026-09-02; current `beta` and `origin/beta` align at its documentation successor `fd5ccdc`. | Valuable integrated checkpoint is recoverable on GitHub, but it is not a Pages release. |
| **Deployed to Pages from `main`** | `7d8dab4`; PM verified today that latest GitHub workflow is successful Pages run `33495561102`, created 2026-09-01T10:04:57Z. Canonical remote URL is `https://melissarowlandc-afk.github.io/GamifySurgery/`. | Remote and local browser origins have separate saves. |
| **Accepted local, not backed up after the beta checkpoint** | Staffed check-in/routing/chart timing; non-editable cursor; floor-pattern camera anchoring; several room/front-desk/wall/HUD/layout and graphics refinements described in the handoff. | These need scoped diff reconciliation and owner review before a combined backup candidate can be defined. |
| **Accepted M1, incomplete M2** | Persistence diagnostics and guarded legacy reset are accepted. IndexedDB repository first pass in `localCampaignRepository.*` is explicitly rejected and not wired to live saving. | Preserve M1; correct M2 in isolation before any live integration. |
| **Local graphics requiring final confirmation** | Founder identity-10 foot repair and seated Front Desk separation, plus related renderer/tests/proofs. Individual anatomy spec previously passed, but the later combined run timed out/hung. | Do not label final graphics validation green or include it in a checkpoint until the individual rerun and scoped follow-up validation succeed. |
| **Owner-review-needed** | Local walkthrough of graphics/UI/playability, especially current founder/Front Desk repairs; no current owner acceptance record was found for those local changes. | User feedback may reprioritize work before any backup. |
| **Deferred by product phase** | Clinical runtime breadth beyond the approved active subset; Level 3-5; full selection policy; cloud/auth; private pilot; telemetry/research; public release. | Keep out of immediate implementation queue unless the owner changes phase. |

## Clinical-content state

The deployed showcase has six active Level 0 concepts and 24 exact clinically approved patient-linked variants (rows 62, 66, 87, and 109). Rows 53 (phyllodes) and 54 (trauma/VKA) are implemented and tested deferred packages, outside active runtime. Row 61 (Graves/RAI) has six approved seed scopes but requires 18 exact variants and exact approval before any implementation.

The queue file calls row 111 the next direction and reports 81 pending-not-authored, but that is a snapshot requiring reconciliation: the row-111 ExecPlan and approval file exist, and `CURRENT_THREAD_HANDOFF.md` classifies its plan as an active review queue rather than unreviewed. The handoff also classifies row 115 and row 119 plans as historical because their proposed follow-ups are already complete. Therefore do not use row 111 or the count as a current implementation order without a bounded clinical-queue reconciliation; GS-006 begins with the owner selecting the next exact review package.

This distinction must be retained: exact named-clinician approval of a concept/version can exist while independently authored source metadata and atomic evidence-claim prose remain `needs_clinician_review`. The current public/browser prototype is still `synthetic_unapproved_prototype`; no queue status is authority to publish content to learners.

## Actionable backlog

Task IDs are stable project-management identifiers; they do not change the existing plan filenames or clinical IDs.

| ID / priority | Bounded task and dependencies | Parallelism / file-overlap constraint | Acceptance criteria |
| --- | --- | --- | --- |
| **GS-001 — P0** | Correct Durable Browser Persistence **M2** repository pass. Depends on accepted M1; follow the dedicated resume and plan. | Sequential before GS-002. Own only `apps/player/src/session/localCampaignRepository.ts` and its test, plus narrowly necessary repository contract typing. Do not touch live hook/storage integration. | Repository returns structured results for all failures; distinguishes open/upgrade/blocked/transaction cases; preserves prior valid revision on failure; verifies committed save by read-back/checksum/deserialization; supports profile assembly/list; tests are maintainable and pass scoped checks. Sol reviews actual diff before acceptance. |
| **GS-002 — P0** | Persistence **M3** live async integration, reset, export/import. Depends on accepted GS-001. | Sequential after GS-001; overlaps session storage, hooks, Save & Close, and UI. Do not combine with graphics or unrelated UI checkpoint. | Live game uses accepted repository safely; Save & Close awaits pending/final verified transaction; reset/export/import preserve stated campaign and FSRS boundaries; no silent legacy-data loss. |
| **GS-003 — P0** | Persistence **M4** stress/recovery and canonical-browser acceptance. Depends on GS-002. | Sequential. Requires real launcher/origin evidence after code acceptance. | Stress/recovery, migration, invalid checksum/schema, export/import coverage and a successful `START_GAME.cmd` / `http://127.0.0.1:4173` owner-pathway verification. |
| **GS-004 — P1** | Finish current founder/Front Desk graphics validation and owner visual review. | May run in parallel with GS-001 only if it does not touch session, shared `App*`, global CSS, or package files. Graphics ownership must be hunk-scoped around `FacilityScene`, art assets/manifests, front-desk presentation, graphics tests/proofs. | Individual `front-desk-founder-anatomy` desktop-Chrome exit 0; relevant unit/typecheck/atlas/build checks per active plan; fresh normal/Build screenshot inspection; owner records accept/correction. No combined-run claim until rerun evidence exists. |
| **GS-005 — P1** | Optional integrated-checkpoint audit after compatible accepted local tasks, such as GS-003 and/or GS-004. | Integration/audit only; no broad staging. Reconcile only the proposed checkpoint paths by provenance and exclude unaccepted M2 artifacts until corrected. | Scoped path ledger, diff review, safety/provenance scans, validation record, and a concrete integrated-backup candidate. Each accepted bounded task may instead receive its own scoped backup after user completion agreement; it need not wait for GS-005. |
| **GS-006 — P2, owner-led** | Prepare the next exact clinical review set, beginning with Graves/RAI's 18 expansion variants or the next selected row-111 package. | Can run independently of GS-001–005, but it must not publish or wire runtime content. Use the clinical queue and provenance rules. | Original complete answer sets, intended release points, versioned approval receipt, and explicit named-clinician decision. Only a separately authorized follow-up may implement approved revisions. |
| **GS-007 — Deferred** | Real-content runtime integration beyond currently active approved subset. | Depends on GS-006, coherent usability loop, and clinical release validation. | Exact approved revision/version and release-point admission; no draft/claim/source-status promotion by implication. |
| **GS-008 — Deferred** | Cloud/auth foundation. | Depends on stable local persistence and owner authorization for external infrastructure. | Owner-controlled Supabase, invite-only auth, revision/writer protocol, staging/pilot separation, recovery/rollback checks. |
| **GS-009 — Deferred** | Private-pilot readiness. | Depends on GS-007, GS-008, clinical review, and explicit owner permission for outside testers. | Privacy/educational notices, approved feedback route, trusted staging, invitations/recovery/monitoring/rollback. |

### Proposed next bounded task

**GS-001: Durable Browser Persistence M2 correction** is the next task because it resolves an explicit reliability defect without broadening scope. Assign one Terra implementation thread to the repository-only boundary specified in `DURABLE_BROWSER_PERSISTENCE_RESUME.md`; it must preserve M1 and every unrelated dirty path. The primary should inspect the resulting diff and validation before assigning M3.

GS-004 can be scheduled in parallel only when a distinct graphics thread owns its hunks and the persistence worker remains isolated. If the owner prefers immediate visual feedback, GS-004 may be taken first, but GS-001 remains the highest technical priority.

## Access and operating dependencies

- The canonical local owner pathway is `START_GAME.cmd` then `http://127.0.0.1:4173` in the same persistent browser profile. `localhost`, other ports/hosts, incognito/guest profiles, and Pages have separate storage.
- Persistence M4 needs access to that real local browser pathway. The owner already authorized loss of prior campaigns on this device through the guarded in-app reset; that authorization does not authorize deletion outside the described control.
- The standing instruction authorizes each task's scoped GitHub backup after the user agrees that bounded task is complete. An optional integrated checkpoint remains a separate audit. A backup does not authorize merge, Pages deployment, release, or deletion.
- Graphics tasks that alter existing art depend on the owner-directed Cortan/ComfyUI process and current resource availability; no fallback image-generation route is permitted for modifying existing art.
- Cloud, billing, domains, public deployment, telemetry/research, and outside invitations require separate owner authorization.

## Local/ignored workspaces observed by path only

The following relevant private/local locations exist and were not opened beyond directory existence: `.clinical-workbench/`, `clinical-data/imports/`, `generated_images/`, and `Photos for Codex 2/`. The repository handoff also identifies ignored/private categories including `.env*`, `.local-dev/`, `.private-clinical-data/`, `clinical-data/private/`, `clinical-data/exports/`, browser/test/build artifacts, and `artifacts/logs/`. None may be broad-staged or inferred safe for backup.

## Validation evidence

### Checks actually run for this inventory on 2026-09-07

- Read `AGENTS.md`, the active persistence resume/ExecPlan, graphics handoff, roadmap/open-decision/project-brief material, queue excerpts, current handoff excerpts, and relevant file existence.
- Ran read-only `git status --short --branch`, `git diff --stat`, `git rev-parse HEAD`, `git log --oneline --decorate -8`, `git branch -vv`, and `git remote -v`.
- Counted porcelain status entries: 86 modified, 51 untracked, 0 deleted; reviewed changed-path top-level categories.
- PM independently verified GitHub authentication, admin access, public repository state, remote refs, empty issue/PR queues, and the latest successful Pages workflow today.
- Directly validated this untracked document with `git diff --no-index --check -- NUL <inventory>` and direct scans: 0 trailing-whitespace matches, 0 conflict markers, and all seven referenced governing/clinical-plan paths checked here exist. This is the applicable direct-file check; ordinary `git diff --check` omits untracked files.

### Historical reports, not rerun today

- The handoffs report full-suite, typecheck, build, asset-validator, and focused browser evidence for individual accepted checkpoints, with dates and exact counts recorded in those handoffs.
- This audit itself did not contact GitHub, Pages, Cortan, the browser, or any external service.
- No application tests, builds, browser tests, migrations, or mutation-prone workflows were run because this was a documentation audit of a shared dirty tree.

## Completion state

This inventory is ready for the owner/PM to review. It has not been backed up or archived. Per the bounded-thread lifecycle, only after the user agrees this audit is complete should its scoped documentation change be considered for a GitHub-backup task; no push or archival is authorized yet.
