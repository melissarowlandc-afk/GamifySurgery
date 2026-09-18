# GS-021 clinic income reconstruction package

This package preserves the accepted GS-021 clinic-income, service-visitor, and
retail checkpoint from September 17, 2026. It is scoped reconstruction evidence
for the public `GamifySurgery` repository. It is **not** a standalone runnable
checkout, a merge-ready release, or a deployment artifact.

The owner accepted GS-021 with: “Okay we can complete this thread.” The intended
backup branch is `backup/gs-021-income-2026-09-17`, based on repository commit
`c26c96a111103d8665e33c9258ef54071d729f14`. This package does not authorize a
merge, release, deployment, Pages publication, history rewrite, or deletion.

## Contents

- `accepted-after/` contains 61 exact accepted source, test, and task-document
  after-images. Copying these paths onto the compatible dirty baseline restores
  the accepted GS-021 files byte for byte.
- `milestones/` preserves the accepted M1, M2, M3, M4a, M4b, and final fixture
  integration images separately so overlapping phases remain auditable.
- `prerequisites/` contains the available milestone before-images. The M1
  baseline is reconstructed rather than an original pre-edit snapshot; its
  provenance is explicit under `provenance/m1-reconstruction/`.
- `evidence/artifacts/screenshots/` contains exactly seven synthetic GS-021
  browser screenshots. They contain no owner save or private clinical input.
- `provenance/` contains accepted milestone hashes, the staff addendum, and a
  package-time comparison between accepted after-images and the shared live
  worktree.
- `manifest.json` records byte counts and SHA-256 hashes for every package file
  except the manifest itself.
- `verify-package.ps1` verifies the complete payload and can reproduce the 61
  accepted after-images into an empty directory.

## Verification and reconstruction

From this directory in PowerShell:

```powershell
./verify-package.ps1
./verify-package.ps1 -ReconstructTo C:/path/to/empty/reconstruction
```

The second command copies only `accepted-after/` into the empty destination and
then verifies every copied SHA-256. It does not create a runnable repository;
unmodified prerequisite files must come from the compatible source baseline.

## Snapshot selection

The aggregate accepted state is layered in milestone order:

1. M1 accepted accounting/catalog images.
2. M2 accepted service-operation and narrow clinical operational-metadata
   images.
3. M3 accepted retail/domain images, including the staff movement addendum.
4. M4a accepted player integration images and GLP-1/popup browser tests.
5. M4b accepted player retail images.
6. The seven accepted live fixture-integration test images. Their prior Terra
   partial versions are preserved as a labeled prerequisite layer.
7. Final GS-021 catalog, execution plan, and task handoff documents.

Later layers intentionally supersede overlapping earlier files. M3 and M4b
mirrors remain byte-identical to their accepted hashes. The five non-overlapping
M4a manifest paths still match the live worktree. The misleadingly named local
`gs-021-fixture-integration-current` directory is a before-snapshot containing
partial Terra fixtures; it is never used as accepted output. The package uses
the final live Sol-integrated versions and records their hashes in
`provenance/live-comparison.json`.

The original M1 snapshot attempt was incomplete. The package therefore labels
its M1 before-image as reconstructed, preserves the exact cumulative patch
(SHA-256 `ce907272580f310e63c708a670b0803370fa53e76de572d3a714254924991191`),
and includes the independently replayed byte-identical M1 result under
`provenance/m1-replay3/`. The embedded historical M1 README retains its original
relative-path wording; the corresponding packaged locations are
`prerequisites/01-m1-reconstructed-before/`, `prerequisites/01-m1-sol-start/`,
and `milestones/01-m1-after/`.

## Clinical, privacy, and scope boundary

The six included clinical source/test paths were already part of the shared
dirty baseline. GS-021 changed only operational capability/route metadata and
the related approval checksums; it did not author or promote clinical wording,
answers, evidence claims, or review status. Clinical material remains under its
existing review state.

Excluded: owner saves and browser storage, private clinical inputs, credentials,
environment files, proprietary sources, character source art, unrelated dirty
source, other task screenshots, build output, logs, dependencies, PM-board
history, and the shared multi-task `CURRENT_THREAD_HANDOFF.md`. The final backup
closeout record is intentionally supplied separately by the parent closeout
task so this source package does not capture unrelated handoff history.

`tools/build-from-local-snapshots.ps1` documents how this archive was assembled
from ignored local review mirrors. It is provenance only and is not required to
verify or reconstruct the package.
