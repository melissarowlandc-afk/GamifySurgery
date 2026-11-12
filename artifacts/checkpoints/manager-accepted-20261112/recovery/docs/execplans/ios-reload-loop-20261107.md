# iOS cloud-open memory and unclean-restart safeguard

## Goal, constraints and ownership

Measure cloud-open/first-save/first-minute memory with public large L4 fixtures,
then reduce simultaneous copies and provide automatic lower-memory presentation
after repeated unclean phone restarts. WebKit process termination is a hypothesis,
not confirmed by the screenshot. No domain/clinical changes or rebind; preserve
save bytes, learning, ordering, recovery and checkpoint policy. No Git, agents,
installs, network, browser run, commit, push or deployment. Shared tree; preserve
all unrelated edits. Owned: mobile/performance, operationalEngine*, codecWorker*,
FacilityCanvas and new mobile/diagnostics helpers/tests. Other cloud code only
when measurement requires it, minimally with tests.

## Baseline and method

Read AGENTS and current handoff. Public source captures/hashes live under
.local-dev/ios-reload-loop-20261107/entry.json and entry/. Package source hashes
record the shared domain/content epoch without editing it. Do not access owner
private saves. Largest retained L4 checkpoint currently about0.87MB compact JSON;
derive a deterministic L4 Day20 workload from it, plus stress with largest public
encounter/history data when valid. Report compiled-module baseline separately
from fixture/state copies and do not confuse Node/Vitest overhead with iOS heap.

## Milestones and acceptance

- [x] Read instructions/handoff and capture source baseline without Git.
- [x] Measure main/engine/codec heap and transient serialization/open/checkpoint
  copies; record largest contributors before editing runtime.
- [x] Reduce measured redundant copies/allocation with exact state/protocol and
  recovery tests. Retain diff-based per-tick transport.
- [x] Add dialog-free phone crash-loop detection before heavy opening, clean
  hide/pagehide marker clearing, conservative presentation and diagnostics.
- [x] Matched after measurements and L4/L5 differential correctness; full player
  threads, all workspace typechecks and root build, exact outputs/baselines.
- [x] Write docs/research/ios-reload-loop-20261107.md and additive handoff with
  browser/iPhone acceptance and unresolved limits.

## Findings / next action

Captured157 public files and705 domain/balance/clinical hashes before runtime
edits. The largest retained public L4 state is integration-l4 (870,709 compact
JSON bytes before current learning completion). A synthetic absolute-tick shift
to Day20 yields933,953 bytes,42rooms/13types/14encounters. It is not an actual
20-day playthrough or the owner's private campaign. No private inputs accessed.

Production-bundled Node24 main + native engine/codec worker profiling now covers
verified open, playable open, first checkpoint and240admitted ticks at250ms. The
fake server is isolated and excluded from client totals; fake-IDB is codec-owned.
Before/after final-state hashes match. Final retained playable client heap186.12
->165.19MB; minute-end230.75 ->220.41MB. Prepared-save uncollected opening peaks
vary and were WORSE in both pairs: initially315.84 ->363.73MB, final304.54 ->
341.82MB. Do not claim a general ordinary-mode peak win. Reduced-mode open
releases the idle codec realm before engine startup; final sampled opening heap
252.10MB, playable retained107.62MB. This mode's native profiling
stops at open because the fake-IDB adapter does not persist across termination.
Separate module-cache reset tests keep IDB intact and prove exact recovery.

Opening no longer copies the8.45MB bundled catalogue into the engine, duplicates
the app's private frozen seed, warms main-thread evidence/path indexes that only
the worker uses, or executes a discarded opening tick. Strict parsing/fidelity
validation remain. Compression avoids redundant byte/Blob copies; parsed-JSON
comparison avoids canonical text trees. Per-tick diff protocol is unchanged.

Phone art selection now loads built and explicitly previewed room dependencies;
151 ->101sources /274.60 ->150.64MB nominal RGBA. Initial chart-covered canvas
creation is deferred until first reveal. Two unclean restarts within10min choose
DPR1,8MiB/32retired texture budget and narrower pose pinning for24h; clean hidden
and pagehide clear only the auxiliary marker. Save/checkpoint policy unchanged.

Additional raw older-save probe omits concept/deserializer preparation,396saved
concepts ->605 at playable open. Opening peak405.08 ->330.79 ordinary /263.89MB
reduced; retained playable188.09 ->168.11 /108.47MB. All3raw-state hashes match.
Final harness streams worker samples so idle termination does not discard them;
combined peaks remain sampled estimates, not hard maxima or iPhone predictions.

Initial full player:7failures;4were intentional-contract assertion updates (lazy
art and the marker),3 reproduce against captured entry runtime/tests. Updated
assertions still reject every save-key localStorage write and require complete
room dependencies when built/previewed. Cold codec cache recovery test passes.
Final source validation:386files /3615tests;383files /3612tests pass,3baseline
failures,387.86s. Entry control reproduces all3(6files:3pass/3fail;53pass/3fail
tests,21.04s), versus the manager's older4-failure expectation. All7workspace
typechecks pass. Root build's unchanged Git inventory is blocked before spawn;
separate player bundle passes1033modules /3.88s. No test/build source bypass.

Final seed review also preserves generic Date/undefined JSON compatibility without
allocating canonical trees for plain seeds. No705captured package hashes changed.
L5historical pins untouched:409bound paths /31pre-existing differences, no rebind;
this task does not claim a fresh full26,362-command journey replay. Exact long
L3/L4/L5engine differentials pass in the full player suite.

Complete: docs/research/ios-reload-loop-20261107.md,29owned source/test paths
(15runtime/14tests;6new/23hunk-only), normalized owned.patch and SHA256 manifest.
Next action belongs to manager: inspect scoped hunks, rerun authorized root build,
browser cloud/save/recovery and physical iPhone memory/reload/texture acceptance.
WebKit jetsam remains unconfirmed; reduced-mode first-save/minute native profile
is unavailable with per-worker fake-IDB, and built-room/full-catalogue memory
remains a material risk. No browser, Git, network, private-save, agent or release
action was taken.
