# Seventh manager-accepted recovery checkpoint - 2026-11-12

Prepared by the assigned GPT-6.1 Sol worker for the Claude Code **GamifySurgery
manager**, under the owner's **"Push to GitHub"** direction relayed November 12.
This package is **local only**. The manager retains the independent audit,
staging, commit, push and remote verification. The worker performed no Git
mutation, installation, network access, agent dispatch, deployment or publication.
All worker writes are inside this archive. The shared thread handoff is read-only
under the dispatch's explicit write restriction; the bounded handoff is
[validation/worker-handoff.md](validation/worker-handoff.md).

## Baseline and accepted scope

Baseline branch **beta**, HEAD **3436c8bbd8359c64c49b082f21e88a8985f594f7**,
including `artifacts/checkpoints/manager-accepted-20261014/`. Every physical
manifest hash and committed Git blob in all **six** prior manager-accepted
archives was checked. They remain byte-unchanged. No earlier archive is restaged.

This follows checkpoint six's incremental whole-file and bundled-base/patch
pattern. It captures the main development working tree's accepted changes since
that baseline, as scoped by the manager dispatch:

- Beta 1 through releases 13-35: cloud saves and recovery, snapshot-only saves,
  performance and phone thermal work, and the related test repairs.
- Late-game balance, content-robust pacing, management mode, mobile and UI work.
- Question flags, batches 2a/2b, N1-N4, harden1, stats1, topic-program acceptance
  batches 1-6, bindings, topic authoring files and research/source packets.
- Supabase migrations/tests, including
  `20261110000100_nonretryable_cloud_conflicts.sql` (**PT409**), source tools,
  retained historical test-input fixtures, ExecPlans and handoffs.

Exact targets, counts and requirement mappings are in
[validation/selection.json](validation/selection.json) and
[validation/requirement-coverage.json](validation/requirement-coverage.json).
Unchanged prior accepted targets and baseline Git files are indexed rather than
recopied. Older dirty art/tooling already excluded by checkpoint six is not
reclassified as new work merely because it remains untracked. The reconciliation
records when only historical path/size/modification-time evidence was available;
it does not invent an earlier content hash or claim new manager acceptance.

The existing local release checkout is **C:/Users/rowla/Projects/GS-release**,
HEAD **3bc237a19a7ae5d965ce07e20afcc3e3c942f5d2**. The comparison uses local Git
objects and tracking refs only. It is **not remote verification**. Release-identical
selected targets remain bundled because this package must preserve the main
tree's own accepted state. See
[validation/release-comparison.json](validation/release-comparison.json).

## Live-only lanes

The following are **live-only and excluded**, including their source modules,
tests, source ledgers and review sidecars:

- `question-topic-statistics-20261111.*`
- `question-topic-ethics-professionalism-20261111.*`
- `question-topic-ostomy-enterocutaneous-fistula-20261111.*`
- `question-topic-quality-safety-systems-20261111.*`
- `docs/research/question-flag-d97aa716-*` and its active related source/tool lane.
- `docs/research/owner-decision-queue-*`.
- Every safe source path observed added, deleted, hash-changed, or timestamp-changed
  during this run, even if its final hash returns to the intake value.

Exact paths are in [validation/concurrent-edits.json](validation/concurrent-edits.json)
and [exclusions.json](exclusions.json). The phone-memory ExecPlan and newly added
question-flag/save-compatibility work were among observed concurrent paths.
The shared current handoff also changed during the run and is excluded in its
entirety. Intake hashes and compatible immutable release references, where
available, are recorded in `validation/live-only-recovery-references.json`.
Some excluded intake versions differ from the release; this package does not
supply those live paths for a full project restore.
Excluded lanes are not staged. Historical references inside previously accepted
fixtures/coordination records are preserved as historical inputs, not fresh
captures or acceptance of those live files. No recovery artifact is clinical
approval. The topic drafts retain **needs_clinician_review**.

## Recovery and encoding

`recovery/<repository path>` stores whole new/current files. Shared text targets
use exact unified patches under `recovery/patches/`, bundled bases under
`recovery/bases/checkpoint7/`, and forward/reverse/reapply contracts. Bases resolve
to the latest accepted state in the six prior archives, otherwise the baseline
HEAD blob. Runtime binary assets are preserved whole.

Physical text is **UTF-8 without BOM and LF**. Historical bases, patches and any
whole current text with CRLF/BOM are stored losslessly as base64, with explicit
storage encodings in contracts/selection. Recovered bytes retain their original
encoding. No source file or earlier archive is normalized. `.gitattributes`
contains `* -text`. The manifest hashes every physical file except itself;
decoded contract hashes separately bind exact historical and current bytes.

This is an incremental recovery layer. Apply the six previous layers and this
layer chronologically in an isolated project; compatible earlier source/art
and dependencies remain necessary. Restore writes captured targets only and
does not supply omitted build/test output or campaigns.

From the repository root, using existing Python:

```powershell
python artifacts/checkpoints/manager-accepted-20261112/verify_archive.py --check-live-stage-files --check-live-recovery-files
python artifacts/checkpoints/manager-accepted-20261112/restore_recovery.py --dry-run
python artifacts/checkpoints/manager-accepted-20261112/safety_audit.py
```

Restore into a new empty directory:

```powershell
python artifacts/checkpoints/manager-accepted-20261112/restore_recovery.py --destination <empty-recovery-directory>
```

The restore rejects escaping paths, nonempty destinations and archive overlap,
uses exclusive file creation, and performs no Git writes. The isolated disk
round-trip reconstructs shared targets solely from bundled bases/patches and
compares every restored hash. It uses no live source or Git object during restore.
Negative guard tests and exact outputs are recorded under `validation/`.
Later source edits can invalidate live verification; archive-only verification
remains available. The manager must re-review any drift before staging.

## Safety, size and staging

[validation/safety-audit.json](validation/safety-audit.json) covers physical files,
decoded bases/patches and reconstructed current targets. It scans secret/key/token
signatures, credential assignments/URLs, email addresses, tester-institution
identifiers, source-retention declarations, forbidden payload paths, encoding
and Git ignore behavior. Reserved synthetic test identities are explicitly listed.
The final seal in `validation/final-safety-seal.json` proves that every remaining
payload/base/patch is unchanged from the completed full audit. It permits only
audited target omissions, checks the exact surviving contract subset, and rescans
the contract index and final metadata. A new or changed payload requires a new
full audit. This avoids repeating the same gigabyte scan when the closing hash
pass removes a concurrent path.
Exact reviewed fixture literals and documented public project origins are
classified in `validation/reviewed-audit-literals.json`; public origins are not
credentials or real environment-file contents. Environment examples have empty
values. No real env file, key, token, password, tester roster, name/email mapping,
owner/tester save, browser data, proprietary source corpus or copied full article
is captured. `.local-dev/**` and real `beta-admin.env` are never opened or included.
No external source content is fetched. Offline declaration/path/field inspection
does not claim an independent plagiarism comparison or medical revalidation.

Excluded: dependency caches, build output, test/Playwright results, raw local logs,
machine settings, private clinical inputs and regenerable image/analysis histories.
Retained fixtures are inputs used by accepted compatibility/source-pin tests;
research packets retain their original authored clinical content and review
evidence. Gameplay/build/database tests are not rerun by this backup worker.
Their historical records are not represented as a fresh green application suite.

Exact physical count, total bytes and largest file are in
[validation/archive-size.json](validation/archive-size.json). The **1 GB total
limit is flagged if exceeded**; every file over **50 MB** is separately listed.
The proposed split is in [validation/split-plan.json](validation/split-plan.json):
core code/patches/fixtures/common metadata and research packets, transported as
two coordinated volumes and recombined before verification. No split is
silently performed and the volumes are not independently recoverable.

`STAGE_PATHS.txt` lists **only exact files in this new archive**, including itself
and the manifest. No broad globs, shared implementation paths, outside documents
or earlier archives are listed. `PROPOSED_COMMIT_MESSAGE.txt` supplies the message.
The manager should inspect the actual scoped bytes and split flag, rerun strict
integrity/safety checks, stage only the allowlist, commit/push the current branch
and verify the remote contains the commit. The owner already authorized backup;
this worker has not created one on GitHub. The manager then records the verified
branch/commit in the shared handoff. Backup does not authorize a merge, release,
deployment, Pages publication or clinical promotion.

Opening pathways, origins and browser profiles are unchanged. Local owner playtest
remains **START_GAME.cmd -> http://127.0.0.1:4173** in the intended persistent
profile; canonical remote playtest remains
`https://melissarowlandc-afk.github.io/GamifySurgery/`. Their saves remain separate.
