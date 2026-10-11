# Fourth manager-accepted recovery checkpoint - 2026-10-10

Prepared by the assigned Sol worker for the Claude Code **GamifySurgery manager**.
The owner instructed **"Push to GitHub"** on October 10. This archive is local
only. The manager owns audit, staging, commit, push and remote verification.
The worker made no Git mutation, commit, push, install, deployment or publication.

## Baseline and accepted scope

Baseline: **9b4808ae444539062a49068b498d3460d2bc5724**, including
`artifacts/checkpoints/manager-accepted-20261009/`. All three earlier archives
remain byte-unchanged, verified against their manifests and committed Git blobs.
This checkpoint follows the third archive's layout and recovery/staging pattern.

- Complete **MB1-MB10b** mobile shell: all 100 current files under
  `apps/player/src/mobile/`, PrototypeShell, shellContract, shellPresentation,
  and every accepted flag-gated map, build, asset, session and projection seam.
  Includes entry, tutorial, chart/alerts/goals, management/services/money,
  performance policy, both owner feedback rounds, one-tap doors and tests.
- Accepted desktop patient-click chart-row highlight and related bridge,
  identity/projection, PatientLists, styling and tests.
- Owner-selected **R3-04 "Late Light"** app icon: four runtime PNGs, the
  `apps/player/index.html` icon/title changes, and all **296 concept-art files**
  from rounds 1-3, including originals, processing/generation receipts, prompts,
  references, galleries, contact sheets and authoring scripts. Concept art is
  **70,196,451 bytes**; largest concept file **1,707,790 bytes**. Runtime icons
  total **195,396 bytes**. Per-file sizes/hashes: `validation/app-icon-sizes.json`.
- Complete **Variety-3** authoring and exact prototype assembly: 13 batch files,
  registration/manifest/timing, constrained identity retention, non-execution
  classification, availability/admission/frozen-choice/FSRS tests, 20-case sample
  artifact, coverage audit and both authoring/assembly plans. Runtime remains an
  explicitly unapproved prototype, with 370 concepts / 1,110 cases / 1,415 nodes.
- Both accepted `tools/qa/` bootstrap changes, including phone management/GLP-1
  and Variety-3 disposable fixtures.
- Both `docs/design/mobile-*.md` records; full mobile milestone/acceptance plan;
  shared owner-request/current-handoff captures; **Level 5 launch plan including
  binding M0 owner decisions**. M0 supersedes older proposals and pending-choice
  language retained in the same historical plan. This checkpoint adds no Level 5
  gameplay or clinical approval. The active Executive Office revision is excluded.

Acceptance references are the mobile plan's manager acceptance entries, the
post-backup-3 owner-request entries, Level 5 M0, the Variety-3 plans and the current
handoff. The Variety-3 manager acceptance entry is dated October 11 in the source;
the archive preserves that date verbatim. `validation/requirement-coverage.json`
binds those records, required lanes and the exact assembly path receipt to targets.
The broad pre-mobile intake identifies 27 changed existing source modules; every
one is captured. Cumulative older dirty work is not assumed newly accepted.

## Exact recovery layout

`recovery/<repository path>` holds **432 whole current files**.
`recovery/patches/*.patch` holds **38 shared-file patches**; their exact bases are
bundled under `recovery/bases/checkpoint4/`. Bases come from the latest accepted
earlier archive state, or HEAD at the baseline when no archived target exists.
Each patch reconstructs the captured current bytes, reverses to its base and
reapplies exactly. No Git apply or index mutation is used.

Three older shared targets had no HEAD/prior-archive target base and are preserved
as their first recoverable whole state: `facility/characterInspect.ts`,
`packages/game-domain/src/test-choice-orders.ts`, and its inventory test.
`validation/base-coverage.json` records this limitation. The archive does not
claim to reconstruct their unavailable earlier versions. New/owned files and
documents are preserved whole. `recovery/aliases.json` is empty.

`manifest.json` hashes every archive file except itself. `.gitattributes` contains
`* -text`, preventing Git from changing literal payload/base/patch bytes.
New metadata, tools, evidence and owned documents use **UTF-8 without BOM, LF**.
The shared CURRENT_THREAD_HANDOFF result and bundled prior base retain **55
inherited CRLF lines** to preserve exact bytes; no other text exception was found.
No live source or shared document was normalized or edited by this worker.

This is an incremental recovery layer, not a clean aggregate checkout. All three
earlier archives and compatible older runtime/art/dependencies remain necessary.
Review and integrate layers chronologically; never apply these patches directly
to an arbitrary edited live file.

## Verify and restore

From the repository root, with the existing Python and Node installations:

```powershell
python artifacts/checkpoints/manager-accepted-20261010/verify_archive.py --check-live-stage-files --check-live-recovery-files
python artifacts/checkpoints/manager-accepted-20261010/restore_recovery.py --dry-run
node artifacts/checkpoints/manager-accepted-20261010/clinical_review_audit.mjs
```

Restore only into a new empty directory:

```powershell
python artifacts/checkpoints/manager-accepted-20261010/restore_recovery.py --destination <empty-recovery-directory>
```

The restore script reconstructs shared targets from bundled bases and writes only
the selected repository targets. Path/overlap/empty-directory guards protect the
live tree. Disk round-trip and negative verifier/restore checks are recorded in
`validation/`. Live-file checks are strict: later manager/worker changes require
review and capture refresh before calling this the latest state or staging the
eight original documents. Archive integrity alone can still pass after live drift.

## Safety and validation

`validation/safety-audit.json` records secret/key/token and personal-identifier
scans, restricted payload/save-shape checks, text encoding/line-ending evidence,
image privacy review, and check-ignore for logical recovery and physical staging
paths. No credentials, personal identifiers, raw owner saves/browser storage,
proprietary PDFs, full articles or source excerpts are included. Bibliographic
metadata, clinical source-rights limitations and prohibited-source mentions in
policy/audit documents are not source corpora. No web content or model was fetched.

Variety-3 remains **10 concepts / 20 questions / 35 claims / 19 sources / 20 case
reviews**; pediatrics remains **10 / 20 / 45 / 12 / 20**. Every inspected authored
record, context and mapping remains `needs_clinician_review`, with no clinician
sign-off and public release forbidden. GS-028 remains **182 / 728 / 364 / 186 /
620**, also under review. All **239 pre-existing clinical authoring/source modules**
match the pre-mobile intake, including all **37 approved family modules** and
**13 pediatric modules**. Separately reviewed legacy mixed/approved statuses are
unchanged. Technical/editorial acceptance and tests establish no clinical approval.

Small historical worker validation/preservation/path/hash receipts are retained
with original and archived hashes. Raw `.local-dev` logs are omitted; full command
and result text already appears in captured plans. The archive worker did not
rerun gameplay suites or browser QA. Recorded final assembly acceptance: clinical
**628 passed**; domain **3,818 passed + two existing skips**; player **1,781 passed
with the known thyroid pending-label failure**; all seven workspace typechecks PASS.
Earlier intermediate results and manager Chrome touch QA remain historical evidence.

Archive hashes, all 38 patch proofs, strict live capture/stage identity, disk restore,
path/empty-directory/tamper guards, prior committed archives and safety/clinical
audits are independently checked. Launcher verification passes. Boundary checking
is environment-blocked at `spawnSync git EPERM`; the manager must rerun
`node scripts/verify-app-boundaries.mjs` in its environment before staging.

## Exclusions, sizes and staging

Exact archive file count, bytes, largest file and limits:
`validation/archive-size.json`. The archive is below **400 MB**, with no file over
**50 MB**. `exclusions.json` and `validation/exclusion-summary.json` list omitted
dirty-tree/build candidates, per-file sizes and totals. Previously excluded
regenerable/superseded image histories total **260 files / 43,022,937 bytes**.
All app-icon concepts fit, so none is omitted for size.

Explicit exclusions: active `tools/room-design/level-5/executive-office/**`
(metadata-only size inventory, contents not read), owner saves/browser storage,
secrets/tokens, `.claude/settings.local.json`, raw local logs, dependency caches,
`apps/player/dist`, unrelated earlier dirty work and regenerable large histories.
Active Executive Office metadata can change while its worker runs; those counts
are an inventory-time observation, not an accepted source capture.

`STAGE_PATHS.txt` enumerates the archive plus **eight wholly owned accepted
docs/records**. `validation/stage-sources.json` binds their exact hashes and
ownership. Live implementation and shared coordination files remain recovery-only.
`PROPOSED_COMMIT_MESSAGE.txt` supplies the proposed checkpoint message. The manager
must audit actual scoped/staged bytes, rerun strict verification and check-ignore,
commit/push the current branch, confirm the remote contains the commit, and update
the shared handoff with branch/commit. The owner already authorized this backup.
No merge, release, Pages publication or clinical promotion is authorized.

No server, browser, origin, launcher or profile was changed. Existing pathways:
**START_GAME.cmd -> http://127.0.0.1:4173** in the usual persistent profile;
phone layout on that PC origin via `?layout=phone`; private phone
**START_PRIVATE_GAME.cmd -> https://melissadesktop.taile197db.ts.net/**;
disposable QA at `http://127.0.0.1:5184`; remote playtest at
`https://melissarowlandc-afk.github.io/GamifySurgery/`. Different origins, profiles
and devices retain separate saves. This archive transfers no campaign storage.
