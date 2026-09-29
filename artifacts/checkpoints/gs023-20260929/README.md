# GS023 completed-thread recovery checkpoint — 2026-09-29

This directory is a scoped recovery backup of the completed GS023 tutorial and
daily-clinic-routines thread and the owner-directed follow-ups completed during
the same continuous playtest. It intentionally sits outside the live application
tree so that backing it up does not stage unrelated work from the heavily shared
working tree.

## Dependency base and restore model

The most useful runnable dependency is the verified GS025 branch
`origin/codex/gs025-complete-2026-09-29` at
`0e86c82e0b32ae1f6e51dfb20a4124eaafa5e305` (runtime commit
`c7ec8052d8962069609bd02283f2b0fc49b0889c`). The beta branch was at
`66c63b7324623104c6fa9e650bf1b3baeb929a24` when this archive was assembled.

This is **not a standalone runnable or deployable repository snapshot**. Restore
the dependency branch first, then manually integrate the task files and recovery
patches. The patches have deliberately descriptive names and preserve the exact
milestone-relative changes captured by local before-snapshots. Some later patches
overlap earlier shared files; review and integrate their hunks in milestone order
instead of applying every patch blindly.

## What this archive preserves

- The original tutorial cards, durable progress and pause behavior; Front Desk
  seating/return; secretary water refill; and all-wrong Level-1 graduation work.
- Procedure-room routing, approved procedure durations and fees, CT/shared-imaging
  staffing, broader onsite test execution, delayed departure and exact-once income.
- Street diagnostic/service visitors, clinic income presentation, GLP-1/endoscopy
  economy decisions, patient-name variety and answered-chart action recovery.
- Endoscopy completion guidance, room-derived hiring and room caps, named layoffs,
  occupied-room sales, interrupted-test transfer/offsite fallback and visible exits.
- Boxed founder activity labels, one-click waiting-patient chart redirect and the
  final functional-suite-scaled $600 scheduled endoscopy behavior.
- Task-specific ExecPlans, the GS023 handoff, focused source modules, regression
  tests, browser specifications and selected synthetic browser screenshots.

## Recovery layout

- `files/` contains complete task-specific files at their original repository paths.
- `recovery/patches/` contains scoped shared-file changes. The room-capacity
  Markdown excerpt retains only matching manual-integration hunks and excludes
  known concurrent-feature hunks. The `founder-final-*` patches isolate the last
  founder/chart/endoscopy step against its preserved before-snapshot.
- `evidence/` contains only selected synthetic fixture screenshots. It contains no
  owner save, browser profile, raw clinical input or private source material.
- `manifest.json` records every payload path, original source where applicable,
  byte length, category and SHA-256. `audit/` records assembly and safety checks.

## Deliberate omissions

- The entire dirty worktree and whole shared source files containing unrelated
  GS026 art/runtime, alert, room-art, GS028 clinical-batch or other task changes.
- `.local-dev` logs, builds, browser profiles, owner browser storage and owner saves.
- Raw/generated character art, rejected image experiments, proprietary sources,
  credentials, environment files and unrelated screenshots.
- Unrelated clinical batches or any change that would promote clinical review
  status. This backup is software recovery material and is not clinical approval.
- A deployment, Pages publication, merge, release or update to the owner playtest
  origin. The canonical local path remains `START_GAME.cmd` and
  `http://127.0.0.1:4173` in the usual persistent browser profile.

## Accepted validation represented by this checkpoint

The final integrated owner-playtest milestone passed domain 1075/1075, player
552/552, balance 41/41, four desktop/compact browser checks, all affected package
type checks, isolated production build, application boundaries and launcher checks.
Earlier milestone-specific evidence and limitations are recorded in the archived
plans and handoff. These results validate the live integrated tree at completion;
they do not make this recovery archive independently executable.

## Integrity check

From the repository root:

```powershell
$checkpoint = 'artifacts/checkpoints/gs023-20260929'
$manifest = Get-Content "$checkpoint/manifest.json" -Raw | ConvertFrom-Json
foreach ($entry in $manifest.files) {
  $actual = (Get-FileHash -Algorithm SHA256 -LiteralPath "$checkpoint/$($entry.archivePath)").Hash.ToLowerInvariant()
  if ($actual -ne $entry.sha256) { throw "Hash mismatch: $($entry.archivePath)" }
}
```

Recovery requires a deliberate integration review and rerunning the checks listed
in the relevant archived ExecPlan. Do not treat archive presence as a deployed game.
