# Manager-accepted recovery checkpoint — 2026-10-08

Prepared by the assigned Sol worker for the Claude Code **GamifySurgery manager**.
The owner already instructed the manager to "push to GitHub". This package is
local only: the worker did not stage, commit, push, install, publish or deploy.
The manager retains the audit, staging, commit, push and remote verification.

## Restored scope

- GS-033 future-roster20-v5 and patient gap-fill v6a/v6b/v6c plus staff v6d:
  93 identities / 744 new approved runtime PNGs; 225 → 318 identities and
  1,830 → 2,574 assets. Catalog, registry, provenance and tests have exact
  aggregate recovery patches. GS-033's manager reading-stations correction is
  a separate narrow patch.
- GS-028 statistics/ethics M1–M5: batch sources, optional schema/materialization
  fields, assigned test updates, and final review samples. All 28 authoring
  concepts, 112 questions, 63 claims, 30 sources and 108 case reviews remain
  **needs_clinician_review**. Public clinical release is unauthorized.
- Shared UI fonts, six satisfaction rounding wrappers, recoverable Alerts &
  Events M1–M3/fixes, the tests-only character-variety revision, and named
  manager setup/coordination records.

## Exact recovery gaps

1. **apps/player/src/facility/FacilityCanvas.tsx, final Alerts M2 integration.**
   The file acquired additional camera changes during preparation. Available
   baseline copies precede M2, and no exact accepted M2 final bytes/hash were
   found. The file is withheld. Locate the manager's exact accepted snapshot
   and add a verified patch; do not stage the mixed live source. The accepted
   map-pin components, FacilityScene patch and other integration files are
   included, so this gap must be resolved for a complete Alerts recovery.
2. **Level 4 pediatric-waiting mockup and its shared live plan.** Revision 1's
   97-file inventory initially matched, but the active revision subsequently
   changed 32 recorded files before a complete frozen copy was available.
   Only the historical reviewed inventory and manager browser receipt are
   retained as evidence. The whole mockup is excluded from recovery. A complete
   revision-1 snapshot or a separately accepted revision-2 checkpoint is needed.

These gaps are listed with exact recovery actions in `exclusions.json` and
`validation/source-summary.json`. This is a partial recovery checkpoint, not a
claim that every accepted milestone can be restored completely.

## Layout and evidence

- `recovery/<repository path>` contains exact whole files owned by the accepted
  scope. Existing shared files are represented by `recovery/patches/*.patch`
  and exact compatible bases under `recovery/bases/`.
- `recovery/patches/patch-verification.json` records 60 forward/reverse/reapply
  byte contracts, base/accepted/patch SHA-256 values, source evidence and whether
  current live bytes still match. No Git write was used for patch verification.
- `recovery/aliases.json` restores byte-identical packaged poses and duplicate
  metadata from their retained exact copies. All 744 runtime PNGs are retained
  directly, regardless of duplicate content.
- `manifest.json` hashes every archive file except itself and gives its size
  and source status. `.gitattributes` disables text conversion throughout this
  archive so literal patch and payload bytes survive Git staging.
- Immutable character receipts, the font edit ledger, Alerts hash receipts and
  scoped diffs, and pre-edit intake snapshots from active workers distinguish
  accepted bytes from concurrent edits. Large historical baselines/controls
  are not themselves a claim of acceptance of their surrounding dependencies.
- Explicitly inferred compatible bases are labeled. They reverse only the
  documented six rounding wrappers, the manager AGENTS block, or the removed
  refill-delay schema property; the GS-028 schema base preserves the unrelated
  prior Level-3 seam. They are not described as actual pre-edit captures.

## Verify and restore

Run from the repository root, using the existing Python installation:

```powershell
python artifacts/checkpoints/manager-accepted-20261008/verify_archive.py --check-live-stage-files
python artifacts/checkpoints/manager-accepted-20261008/restore_recovery.py --dry-run
```

For actual recovery, materialize into a **new empty directory**:

```powershell
python artifacts/checkpoints/manager-accepted-20261008/restore_recovery.py --destination <empty-recovery-directory>
```

The restore script writes whole files, reconstructs the latest accepted
contract for each shared target, then materializes aliases. It does not run
Git. Review the output and supply compatible earlier dependencies before any
integration into a working checkout. A manual scoped merge can instead apply
the listed patches to their exact compatible bases; font/rounding contracts
precede Alerts contracts for repeated targets.

This package does not contain a clean runnable aggregate checkout, every older
native-art dependency, the installed Atkinson dependency, or full historical
generation/review closure. Earlier checkpoint archives and compatible shared
runtime/content dependencies remain necessary. The missing Canvas and mockup
states are never synthesized from current in-flight source.

## Size and exclusions

`validation/archive-size.json` records exact final bytes. The required accepted
generation originals, first-stage originals, prompts and 744 runtime PNGs
account for approximately 297 MB before tools, provenance, contract bases and
metadata. A modest overrun of the approximate 300 MB target is retained to keep
those essential inputs exact; the manager must accept this size or choose a
different packaging format without discarding required originals.

About 801 MB of comparison renders, duplicate previews/poses, intermediate
review histories, redundant historical baselines/diffs and the in-flight
pediatric tree were excluded. Every candidate exclusion has its size and
reason in `exclusions.json`; duplicate files with recovery aliases are identified.
Superseded generation-history image bytes are not claimed to be regenerable
exactly. Their metadata/prompts are retained where relevant; the accepted final
and first-stage originals needed for current packaging provenance are present.
No retained file exceeds 50 MB.

## Manager staging and backup

`STAGE_PATHS.txt` is the exact one-path-per-line list: archive files plus only
unchanged, wholly owned named manager records. Mixed live implementation files,
AGENTS.md, .gitignore, CURRENT_THREAD_HANDOFF.md and the pediatric live plan are
not on that list. Archive-only scoped patches preserve the manager AGENTS and
ignore-line changes. `validation/stage-sources.json` binds live record hashes;
rerun the verifier immediately before staging and re-audit any drift.

`PROPOSED_COMMIT_MESSAGE.txt` supplies the checkpoint description. Stage exact
paths only after the manager's audit, verify staged bytes, commit/push the
current branch and verify the remote commit. Then the manager records the
verified branch/commit in CURRENT_THREAD_HANDOFF.md. The recovery gaps and size
decision must remain explicit in that receipt. No backup push authorizes a
merge, release, Pages publication or clinical approval.

The owner pathway remains **START_GAME.cmd → http://127.0.0.1:4173**, in the
usual persistent browser profile. The archive work opened no browser, server or
owner campaign storage. Local and remote playtest saves remain separate.
