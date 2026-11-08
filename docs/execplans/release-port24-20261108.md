# Release port 24: map pan/zoom performance

## Goal and ownership

Port only the manager-accepted map pan/zoom performance rounds 1–3 from the
read-only live tree into GS-release. The accepted worker report is
`docs/research/map-pan-zoom-performance-20261108.md`. The manager supplied
production-browser acceptance (four desktop/phone Level 4/5 cases) and functional
browser acceptance; this sandbox will run native tests and typechecks only.

Own the report-listed renderer, renderer tests, e2e coordinate/fixture changes,
production QA configuration/script, their coordination documents, and this
release handoff. Hunk-port FacilityScene against the worker's captured entry:
its live version also contains unaccepted character/art work. Preserve all
release fixes and concurrent work. No clinical, domain, balance, cloud/session,
assets, Level 5 evidence/pins, or .github edits. No agents, installs, network,
commits, push, browser runs, or deployment.

## Repository state and evidence

User-stated release HEAD: 9439b199. Entry captured before implementation in
`.local-dev/release-port24-20261108/entry-state.json`: 7,460 public files,
553 Level 5 inputs, plus .github. Existing evidence: 26,531 commands,
6,019,042 closing cents, 412 completions, zero walkouts. Results SHA-256
`2af0e6a514834a4ab1daa81bdc973123c8e3f8a1cf787b8ef8d2726bca648a97`;
checkpoints `560a4a38c5d8d2cdadf3033666a88a2f5e7e75f64533def7b55d2dfa61469d32`.
The worker report refers to older fixtures; those must not replace this release.

## Milestones and acceptance

1. Inspect all three worker manifests, captured entries and accepted patches;
   content-diff both trees and record each observed path's disposition.
2. Port accepted changes, preserving non-lane release code in shared files.
3. Verify all Level 5 inputs, evidence, checkpoints, reports and launch pins are
   unchanged, and run Level 5 guards. Stop on any failure; do not rebind.
4. Run seven workspace suites with CI=true and threads, seven typechecks,
   boundary checks where runnable, player build, and touched-spec e2e typecheck.
5. Audit the exact changed paths, UTF-8/LF output and exclusions; append the
   release handoff and current-thread handoff with exact validation and risks.

## Progress and next action

- Read root instructions and current handoff. Captured release entry before
  edits and copied immutable worker entries/final sources into private staging.
- Content diff records unrelated character/art, incremental-domain, cloud and
  release-only guard/fixture differences. Only FacilityScene diverges from the
  worker's entry among existing accepted runtime/test paths. Splitter spec is
  text-identical already; retain the manager's released measurement.
- Ported 27 paths: 25 copied, two hunk-ported. The disposition receipt also
  records 97 excluded content-diff paths. All final worker source hashes matched
  their three manifests before porting.
- FacilityScene: 154 accepted context groups applied directly. Excluded the
  absent occupied-character QA hook; applied the two camera-scale/paused-size
  overlap groups to the released registration implementation. Added read-only
  debug groundX needed by the accepted resolution proof. Kept all unaccepted
  character art, pose scales, supports, registration, and texture filtering.
  The character-resolution e2e consequently retains its released linear-filter
  assertion while adopting the fresh-campaign/settlement/integer-size proof.
- Level 5 focused integration/launch: 44 tests pass. All 553 bound inputs,
  canonical evidence, nine checkpoints, reports, history and launch/workload
  pins remain byte-identical. No journey/rebind or pin changes are necessary.
- Focused renderer: six files / 46 tests pass. Seven typechecks pass. Native
  boundary inventory bridge verifies 7,351 tracked paths and launcher protocol.
  Player build passes, 1,052 modules, 10.22s, normal QA proof flag disabled.
- All full suites finished; final source audit and handoffs completed.

## Validation and discoveries

Five smaller workspace suites pass (174 files / 1,955 tests). Full player and
domain also passed. Touched-spec e2e scope has four existing TS2322 errors in
the biopsy spec at lines 57, 58, 59 and 273; a private captured pre-port source
control reproduces exactly the same full diagnostics after path normalization.
The other eight relevant specs and the production config typecheck cleanly.
Do not edit unrelated fixture typing to hide this baseline debt.

Immutable logs and command receipts are stored under
`.local-dev/release-port24-20261108/`; dispositions under
`.local-dev/release-verify/port24-20261108.json`.


## Completion

All five milestones complete. Seven suites: 768 files /11172 passed /0 failed /1 existing skip. Seven typechecks, boundary/launcher and normal player build pass. The four touched-spec biopsy type errors are exactly the pre-port baseline; other eight scoped specs/config pass. All Level5 bindings/pins/artifacts remain unchanged; no rebind. Full handoff appended to GS028 and current-thread handoff. Final exact-file audit: `.local-dev/release-port24-20261108/scope-audit-final.json`. Work remains local for manager review/backup/release.

## Manager follow-up: CI test stability

The manager copied seven accepted test/support files from the live CI-stability
lane and restored diagnosticWorkloadPerformance.test.ts to release HEAD. Their
bytes match the live LF sources; the restored test matches the original release
entry. This follow-up owns only exact source-guard authorization metadata and
its pinned digest/count references, plus this plan and additive handoffs.

Authorize exactly operationalEnginePerformance.test.ts,
operationalSessionPerformance.test.tsx and tickPerformance.test.ts. Preserve
immutable captures and complete prior authorization history. The three original
guards retain every source/absence check. Their cross-pins and the later flags4
guard require mechanical digest propagation; no unrelated source requirement
may change. No product, clinical-content, Level 5, or manager-owned test edits.

1. Capture the current shared tree and inspect the existing port-23 mechanism.
2. Append exact three-file deltas, propagate linked guard digests, and audit
   every other pin and guard statement against the entry capture.
3. Run full clinical-content and the five edited player test files with
   CI=true, threads; retain exact outputs and native exit codes.
4. Add a follow-up to port-24 dispositions, GS028 and the current handoff.

Private receipts: `.local-dev/release-port24-ci-stability-20261108/`.
Progress: entry captured; implementing the strict digest chain.


### CI-stability follow-up complete

All four follow-up steps complete. Three exact source authorizations, four
linked guard-digest requirements, 170 unrelated pins and 74 absences audited.
Full clinical-content:127 files /1,584 tests,128.82s; five edited player files:
71 tests,59.46s. Both CI=true runs pass with exit0. Manager test/support bytes,
553 bound inputs, canonical evidence and .github unchanged. Added GS028/current
handoffs and updated dispositions with complete prior history. Exact final audit:
`.local-dev/release-port24-ci-stability-20261108/scope-audit-final.json`.
