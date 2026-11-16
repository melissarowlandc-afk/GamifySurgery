# Release port 39 / rebind 39 - 2026-11-15

## Goal, scope and constraints

GS-release only, manager base 2f0b5e4d (release 38 live). Main is read-only. Ship only the manager-accepted opening performance and ready/receipt worker-delivery changes listed in the 36-path manifest. Exclude Main's CURRENT_THREAD_HANDOFF.md, leaving 35 accepted paths. Never port private inputs, identifiers, archives or unrelated Main work. No clinical, domain, balance, renderer, save-format, cadence, DB or RPC changes. Compression writes stay true. Shared tree: check preimages before writing and preserve unrelated edits. No agents, installs, network/live DB, Git writes, commits, pushes or deploys.

## Decisions and ownership

The release worker owns those 35 public paths, exact release-generated protected-source pin reconciliation, native rebind metadata and release handoff records. Thirteen raw baseline mismatches are CRLF versus LF only; their normalized content is identical. Apply the recorded normalized perf-worker hunks to these release files and verify the result against accepted Main LF hashes. All other paths copy the accepted source with UTF-8/no-BOM/LF normalization. Do not copy Main reconciliation records or its handoff.

The accepted Main plan is a historical worker report, not a claim of release-tree validation. Release-specific results and remaining physical-WebKit acceptance will be recorded independently. No Supabase API/schema/RPC implementation changes are being designed, and no live database query or external documentation/network access is needed for this local accepted-source port.

## Acceptance and validation

Freeze the release's sources and current evidence before changes. Run the actual native Level 5 journey and lower helper into guarded staging. Require 35,342 commands / 6,966,492 closing cents / 551 completed / zero walkouts, all nine checkpoints, three reports and final native save byte-identical to rebind 38. Keep the integration guard and every assertion unchanged. Pacing must pass the unchanged 26,281 +/-10% reference. Preserve all inputHistory entries and append the previous hashes; apply only the established liveCap metadata correction. If gameplay changes, stop and report before canonical publication.

Use the release's exact authorized-pin mechanism with reason `manager-approved release 39 cloud-opening fix`; preserve all immutable captures, previous authorizations and required absences. Run all seven CI=true workspace suites with threads, seven typechecks, boundaries/launcher and the player build. Include focused opening/delivery regressions before full validation. No assertion, timeout or safety guard may be weakened.

## Progress

- [x] Read AGENTS.md, the accepted Main plan and manifest; inspect path-level content differences.
- [x] Capture release entry sources/evidence, hashes and public preimages.
- [x] Port the 35 accepted paths, record the 13 hunk ports and audit exact source/pin deltas.
- [x] Run fresh guarded native journey/lower and pacing; verify and publish only unchanged gameplay evidence.
- [x] Complete full validation and final path/hash handoff in docs/research/release-port39-20261115.md.

Private release-generated staging and receipts: `.local-dev/release-port39-20261115/`. Main private inputs/manifest/patch files are read in place and are not copied into this tree.

## Verified integration

Fresh native journey/lower reproduces 35,342 commands / 6,966,492 closing cents / 551 completed / zero walkouts. All nine checkpoints, three reports, every native result and the complete final native save are byte-identical to rebind 38. Pacing passes at 26,377 versus the unchanged 26,281 reference (+0.365282904%). Results history34->35 preserves every prior entry and appends previous629inputs; only established liveCap correction. Checkpoints, guard and QA drivers remain untouched. Compression remains true; all629bound inputs/476clinical hashes unchanged.

The exact pin closure changes17pin fixtures and17verifying tests. Three older source guards add eight exact captured-path pins each and increase their strict counts (116->124,118->126,157->165); every prior path remains pinned. No assertion is deleted or weakened. All new authorizations use release preimages, not Main reconciliation. Focused opening/delivery passes32files/294tests; initial seven typechecks, boundaries and player build pass. Final full-suite and typecheck results are recorded below.


## Complete

All seven fresh CI=true thread suites pass:873files/13875passed/0failed/1existing skip, +7files/+51tests over release38. Domain6140/0/1, player5592/0, clinical1768/0; Level5 integration36/36, focused opening/delivery32files/294passed. Final seven typechecks, boundaries/launcher and player build exit0. All native numbers/9checkpoints/3reports/final save byte-identical;629inputs/476clinical hashes unchanged, compression true. History35; strict source-pin provenance verified. Full75path inventory,13hunk list/hashes/exact outputs recorded in docs/research/release-port39-20261115.md and validationJSON, with independent final hashes in the local release dispositions. No further worker milestone remains after final seal; manager owns review/device acceptance/release. Uncommitted; no commit, push or deploy.
