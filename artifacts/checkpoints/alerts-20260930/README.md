# Alerts & Events recovery checkpoint — 2026-09-30

This is a scoped, recovery-only checkpoint for the completed Alerts & Events
usefulness, cadence, guidance, humor and message-board work. It is not a
runnable checkout, deployment artifact, release, or proof that the entire dirty
working tree belongs to this task.

Source: branch `beta`, repository HEAD
`57de88061a17b0e59eeba34d7ea6f1b66c9e7fe2`; exact payloads come from the
task-scoped dirty working-tree implementation above that HEAD. A useful
dependency-base candidate is remote branch
`codex/gs025-complete-2026-09-29` at
`0e86c82e0b32ae1f6e51dfb20a4124eaafa5e305`, whose scoped runtime commit is
`c7ec8052d8962069609bd02283f2b0fc49b0889c`. Compatibility with that branch is
not independently proven; recovery must account for other feature dependencies
present in the shared checkout.

## What is preserved

The `files/` tree contains 20 exact task-focused sources, tests and documents:
the central feed policy/catalog, alert cadence and departure-risk helpers,
facility alert conditions, player projection, message-board component, focused
unit/browser regressions, ExecPlan, feature contract and task brief.

`recovery/current-shared-code-slices.md` preserves exact current TypeScript plus
insertion context, `recovery/global-css-alerts.patch` preserves the complete
M5 baseline-relative CSS delta, and `recovery/shared-integration.md` identifies the
alert-owned changes in the six shared files where a whole-file snapshot would
include unrelated work: domain index/types/persistence/reducer, player session
hook, and global CSS. Those integrations require manual review against the
chosen recovery base.

## Restore procedure

1. Create a disposable recovery branch/worktree from the chosen compatible
   runtime base. Do not restore directly over an active dirty checkout.
2. Copy each `files/<path>` payload to its `originalPath` from `manifest.json`.
3. Apply the exact slices from `recovery/current-shared-code-slices.md` and the
   CSS patch with `git apply --ignore-space-change` as described in
   `recovery/shared-integration.md`.
   according to the anchors and deletion notes in
   `recovery/shared-integration.md`.
4. Run the scoped player and domain tests, all three affected TypeScript checks,
   dependency boundaries, and a production build. Run the two Playwright specs
   when a compatible browser harness is available.
5. Inspect the feed in a fresh disposable campaign before merging. This archive
   neither migrates nor contains owner saves.

## Validation captured before backup

Fresh parent validation on 2026-09-30 passed 58 player alert/component tests,
44 domain alert/risk/cadence tests, player/domain/balance TypeScript checks,
the app-boundary check, and an isolated production build (451 modules). The
build produced only the existing bundle-size warning and did not touch normal
`dist`. Historical 2026-09-29 evidence additionally records four focused Chrome
scenarios passing; no browser run was repeated for this archive-only milestone.

These results validate the current integrated checkout. They do not make this
partial recovery archive independently runnable.

## Scope and safety audit

- Exact payloads are limited to the listed alert modules, regressions and docs.
- Shared files are represented by reviewed integration instructions, avoiding
  unrelated room, retail, Periop, amenity, employee-discussion, founder,
  private-network and clinical-authoring work.
- No owner save, browser profile/storage, `.env`, credential, dependency,
  package-store, log, build-output, screenshot, generated-art or raw-input file
  is included.
- The content contains ordinary simulated clinic/player copy. It adds no
  diagnosis, phenotype, management claim, authored question, clinical evidence
  claim, source excerpt, or clinical review-status change.
- The audit scans are pattern checks, not a claim that arbitrary text can prove
  the absence of all secrets. Manual path and content review found no private or
  proprietary source material.

`manifest.json` records SHA-256, byte size, category and original path for every
payload except the manifest itself. The assembly script is a documented refresh
operation: running it again intentionally replaces exact payloads and the
manifest from the then-current checkout. Verify hashes without rerunning
assembly when restoring this immutable archive.

The current `facility-experience.test.ts` was deliberately omitted: its broad
diff contains later unrelated facility work, and the alert task used it as a
regression check without an independently established alert-owned assertion
delta to preserve.

