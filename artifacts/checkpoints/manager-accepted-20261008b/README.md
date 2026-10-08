# Second manager-accepted recovery checkpoint — 2026-10-08

Prepared by the assigned Sol worker for the Claude Code **GamifySurgery manager**.
The owner instructed the manager to **"Push to GitHub."** This package is local
only. The worker used read-only Git commands and did not stage, commit, push,
install, publish or deploy. The manager owns the final audit and backup.

## Baseline and scope

The baseline is commit **76f0fdb8451f05465a04b5422deec3f5961478ee**, including
`artifacts/checkpoints/manager-accepted-20261008/`. The first archive is unchanged
and independently verifies. This second archive preserves the current accepted
work requested in the manager's brief and recorded in
`docs/execplans/owner-requests-20261008.md`, its worker handoffs, and the room and
exterior plans. Stable earlier payloads are not duplicated.

- Accepted runtime work: seated layering; chart placement and structured
  exhibits/teaching points/rationales; quality-review goal chip; tutorial
  redesign; training reachability; procedure companions and peri-op chairs;
  peri-op nurse attention and all subsequent feedback/legacy fixes; additive
  radiologist income and the second-radiologist correction; Severance hiring
  preference; map camera persistence; compact Goals/Alerts; backless stools;
  specialist-first staffing and opposite-side nurse placement; dispatch
  fairness; stuck-flow watchdog; performance fixes; domain Vitest configuration.
- First-archive recovery gaps are resolved at the **now-current accepted state**:
  FacilityCanvas contains accepted Alerts map-pin integration plus camera
  persistence, and Pediatric Waiting contains approved revision 2. This does
  not invent or claim to reconstruct the unavailable earlier revision 1.
- Level 4 mockups/source kits: approved Pediatric Waiting, Pediatric Examination,
  Wound/Ostomy and MRI, plus the existing approved Reading Room's changed records.
  All 40 file hashes stated in the five approval records match the live source.
  Approval shorthand paths are resolved explicitly in the verification receipt.
- Level 5 **Founder's Office candidate: DESIGN PENDING**. Its layout, original
  generated art, prompts, proof and evidence remain a candidate for owner review.
  Borrowed approved furniture retains its own earlier approval; that does not
  approve the new room. Runtime integration is disabled.
- Exterior Option B, fuller planted beds and frozen site-wide landscape v2:
  source kits, generation originals/prompts/provenance, runtime PNGs, frozen JSON,
  renderer/tests and proposal/QA records.
- New or changed scoped design proposals and execplans are recoverable. Unchanged
  Alerts/font plans and other first-archive records remain in the earlier backup.

Design approval, runtime promotion and clinical approval are separate. No room
mockup or clinical release is promoted by this archive.

## Exact recovery structure

- `recovery/<repository path>` contains **786 whole files** new to the recoverable
  HEAD/first-archive state and within the explicit brief or named ownership lanes.
  Some shared modules existed locally before this checkpoint but had never been
  backed up in HEAD or the first archive. Their complete accepted current bytes
  are retained as their first recoverable state, with that limitation recorded.
- `recovery/patches/*.patch` contains **74 shared-file patches**. Each uses an exact
  bundled compatible base in `recovery/bases/checkpoint2/`. Prefer the first
  archive's latest accepted recovery result; use HEAD at 76f0fdb8 when the first
  archive did not preserve the target. Base provenance and hashes are explicit.
- `recovery/patches/patch-verification.json` proves every patch reproduces the
  selected accepted bytes forward, reverses to its exact base, and reapplies
  exactly. CRLF and missing final newlines are preserved. Verification uses
  Python in memory and does not run Git apply or modify the index.
- `recovery/aliases.json` is empty; every selected whole file is retained directly.
- `manifest.json` hashes every archive file except itself and records source
  status, provenance and scope. `.gitattributes` disables text conversion for
  archive payloads and literal patches.
- `validation/selection.json` binds all **860 recovered targets** to their current
  source hashes. `validation/source-invariance.json` binds the unchanged Git
  index, tracked diff and first archive, and records the source-drift check.

This is an incremental recovery archive, not a clean runnable aggregate checkout.
The first archive, earlier compatible runtime/art packages, and installed
dependencies remain necessary. Restored targets replace their earlier versions;
do not apply these shared patches to an arbitrary already-edited live file.

## Verify and restore

From the repository root, using the existing Python installation:

```powershell
python artifacts/checkpoints/manager-accepted-20261008b/verify_archive.py --check-live-stage-files --check-live-recovery-files
python artifacts/checkpoints/manager-accepted-20261008b/restore_recovery.py --dry-run
node artifacts/checkpoints/manager-accepted-20261008b/clinical_review_audit.mjs
```

Actual recovery must materialize into a **new empty directory**:

```powershell
python artifacts/checkpoints/manager-accepted-20261008b/restore_recovery.py --destination <empty-recovery-directory>
```

The restore script writes only the selected repository targets, reconstructing
shared files from bundled bases. It performs no Git writes. Review the output,
recover compatible earlier dependencies, and integrate through a scoped merge.
The worker also performs a disk restore round trip in ignored worker-owned scratch;
`validation/restore-roundtrip.json` records byte-for-byte comparisons.

The live-source checks are intentionally strict. If a manager record or runtime
target changes after capture, the immutable archive remains valid, but the
manager must review the drift before staging any original record or asserting
that the archive represents the latest tree.

## Safety and validation

`validation/safety-audit.json` records credential/private-key/token scanning,
UTF-8/BOM checks, JSON save-shape checks, personal identifier checks, source
boundaries and `git check-ignore` for physical staging and logical recovery paths.
No owner browser/storage/save was read or included. Owner-report regression tests
are source code that reconstructs synthetic game scenarios using normal factories
and reducers; they are not exported owner campaigns.

No clinical content payload is added by this checkpoint. First-archive clinical
source hashes remain exact. The live GS-028 inspection checks **182 authoring
concepts, 728 questions, 364 claims, 186 sources and 620 case reviews**; every
inspected record remains `needs_clinician_review` with no clinician approval.
All eight inspected batch manifests forbid public release. The unchanged
statistics/ethics subgroup remains 28 concepts / 112 questions / 63 claims /
30 sources / 108 case reviews. Existing separately approved clinical records
are not relabeled. No clinical source corpus, PDF, full article or source excerpt
is copied, and no external clinical source/model is called.

Named source-hash receipts and small historical suite-output transcripts are
included as evidence. UTF-16 logs are decoded to UTF-8 without BOM while retaining
their text exactly, with original and archived hashes recorded. They are historical
worker validation, not gameplay tests rerun by the archive worker. The latest
recorded domain suite passed **3508/3508**, and all seven workspace typechecks
passed. The latest player suite records **1114 passed / 1 pre-existing failure**:
`surgeryCenterServicePreviews.test.ts:85:52` expects an older external-thyroid
pending label. Archive validation does not conceal or fix that unrelated failure.

## Size and exclusions

Exact final bytes, file count and largest files are in
`validation/archive-size.json`. The archive stays below 400 MB, and each file
stays below 50 MB. `exclusions.json` lists omitted candidates with sizes/reasons;
`validation/exclusion-summary.json` separates scoped regenerable histories from
earlier unrelated dirty work, caches and first-archive duplicates.

The active economy audit is explicitly excluded:

- `docs/design/room-economy-audit-20261008.md`
- `tools/economy-audit/**`

Superseded proof histories and comparison screenshots are omitted while current
proofs, original generated art, prompts, provenance, validators, JSON receipts
and representative views are retained. Exact generated originals are not claimed
to be regenerable. Raw scratch trees, saves/activity exports, large performance
profiles, installed caches, credentials, proprietary sources and unrelated work
are outside staging authorization.

## Manager audit and staging

`STAGE_PATHS.txt` enumerates the archive plus **49 wholly new owned docs/records**.
Original mixed live implementation, AGENTS.md, .gitignore, CURRENT_THREAD_HANDOFF.md,
the shared owner-requests plan and the economy worker lane are withheld. Shared
coordination documents are preserved through archive patches. The original
staging-record hashes are in `validation/stage-sources.json`.

The manager should inspect the scoped diff and records, rerun the verifier
immediately before staging, audit staged bytes and only then create the checkpoint
using `PROPOSED_COMMIT_MESSAGE.txt`. A manager staging command after audit is:

```powershell
git add --pathspec-from-file=artifacts/checkpoints/manager-accepted-20261008b/STAGE_PATHS.txt
```

The manager then commits, pushes the current branch, verifies the remote commit,
and records its branch/commit in `docs/handoffs/CURRENT_THREAD_HANDOFF.md`.
The pending Founder Office design and known player assertion remain explicit.
No backup authorizes a merge, release, Pages publication or clinical approval.

The owner pathway remains **START_GAME.cmd → http://127.0.0.1:4173**, in the usual
persistent browser profile. This task opened no browser, server or owner campaign
storage. Local and remote playtest saves remain separate.
