# Phone heap growth release bisect — 2026-11-09

## Goal and constraints

Attribute retained and peak client-realm heap growth between 46e19b2f and
9439b199, reduce phone runtime memory without changing content or simulation,
and strengthen the automatic restart safeguard when localStorage is lost.
The manager's browser observations are 492–515 MB at the old release and
573 MB at the reverted live release; these are not Node heap measurements.
The iPhone loading loop remains unconfirmed, including whether it is a new
document or a same-document auth/cloud failure.

Shared working tree: player performance/runtime lane only. Preserve the save
worker, clinical rewrite, domain and all unrelated changes. Read-only historical
Git object inspection is explicitly authorized for this task; no history edits,
GS-release writes, agents, browsers, network, installs, commits or deployment.
Do not rebind Level 5 or modify clinical content. Read no private save inputs.

## Evidence and ownership

`.local-dev/phone-heap-growth-bisect-20261109/entry.json` captures 1,811 current
source/config/document files before implementation. Historical source trees
and per-file blob/SHA256 inventories are under `trees/<commit>` and
`<commit>-source.json`. Read with ls-tree/cat-file only; original tree untouched.
There were 300 already modified tracked files at entry.

Own new profiling/guard tests and narrow player runtime/build changes required
by evidence. Re-read each existing file immediately before editing. Never port
a historical file wholesale into the shared tree.

## Milestones and acceptance

1. Adapt the installed-Vite production Node cloud/engine/codec harness to five
   historical releases, L4 and L5 public fixtures, cloud open, first checkpoint
   and 240 ticks over 60 real seconds. Separate native worker realms. Record
   module/open/settled heap, sampled peak and bundle/module attribution. Explain
   limitations (no browser DOM/decoded images/GPU, fake-IDB backing in JS heap).
2. Remove the demonstrated avoidable runtime retention. Compare byte-exact
   released runtime data and final states against the captured current path;
   reproduce old fixtures/commands and leave all Level 5 bound inputs intact.
3. Strengthen the auxiliary restart guard with bounded independent persistence
   and conservative defaults, no dialogs/reloads/save writes. Test storage loss,
   unavailable storage, lifecycle, asynchronous races and cleanup.
4. Run focused tests, full player `npm.cmd test -- --pool=threads`, root
   `npm.cmd run typecheck`, root `npm.cmd run build`. Record exact outputs and
   compare failures with the four known baseline failures. Write research report
   and append handoff. Manager runs browser/iPhone acceptance.

## Progress

- Planning/source capture complete. Historical releases are available locally.
- Release commit messages describe later release-worktree rebinds to
  26,531 / 6,019,042 / 412 / 0. This main tree's bound artifact still says
  26,362 / 6,056,335 / 410 / 0. Do not import a release rebind or rewrite either
  artifact. The 409 existing bound inputs have 102 pre-existing mismatches;
  this lane has changed no package inputs and performs no rebind.
- First production matrix and full-export attribution completed. Largest
  retained growth is stats1, about 0.8 MB/realm in the runtime bundle or
  1.2 MB in the full-export probe. Neither reproduces the reported 60–80 MB
  browser gap. Density/repair have much smaller measured deltas.
- Production-only Vite projection now evaluates unchanged validated/manifest-
  gated public data in an ephemeral build worker. The page, engine and codec
  receive only consumed data plus the original schema. A graph encoding keeps
  shared identities, key order, undefined, sparse arrays and signed zero.
  No clinical/domain sources or save/checkpoint policy changed. Development
  still runs the original authoring graph; measure the fix in production.
- Restart guard now mirrors a bounded row in an independent auxiliary IDB;
  interrupted opening triggers early, a fresh standalone phone starts reduced,
  and a missing primary marker stays conservative during the asynchronous read.
  Origin-wide eviction remains possible; no save/auth data is touched.
- Focused tests: 3 files/18 tests pass after the timeout follow-up. First full suite: 400 passed/4 baseline
  failed files, 4,014 passed/4 failed tests. Captured-entry controls reproduce
  those same 4 failures (23 pass). Final frozen-code full suite running.
- Seven typechecks and root build pass using a fresh read-only Git inventory
  adapter: native Node child-process Git launch is blocked by sandbox EPERM.
  The unchanged verifier checks the exact captured ls-files result; the initial
  unadapted failure is retained. No check was removed.
- Corrected inherited fixture age: clinic days have 600 operating minutes.
  Original matched probes were Day 47, not Day 20. Final matrix reruns all
  releases/current/fixed at actual Day 20, tick 11,760, through Day 21/end-of-day
  saving. Wait for warm/flush/compaction/upload work and 500 ms quiet before the
  settled sample. Earlier incomplete idle/teardown scaffolding runs are excluded.
- Final Day 20 matrix complete: all 14 runs exit 0; 240/240 commands advance in
  each. Current/fixed final state hashes match for both fixtures. Every fixed
  realm's open/checkpoint/settled heap is below the Nov 7 control. Settled current
  to fixed (main/codec/engine MB): L4 58.30/120.17/63.41 to51.24/115.09/56.65;
  L5 57.90/133.15/67.09 to51.35/126.50/60.43. No browser absolute-heap claim.
- Full suite before the auxiliary timeout follow-up: 400 passed/4 baseline failed files (404), 4,015 passed/
  4 failed tests (4,019),426.37s. Focused3files/18tests, seven workspace types and
  adapted root build pass. Before/fixed browser main payload23.61→16.22MB;
  codec14.56→7.15MB; engine15.02→7.63MB. Research report includes exact logs,
  limitations, source/Level5 receipts and manager browser checklist.
- Work complete locally; handoff/receipts prepared. Manager owns browser/iPhone
  acceptance, review and any release/checkpoint. No next task started.

Final review follow-up: auxiliary IDB transaction callbacks now ignore timeout/
abort completion and catch inactive writes. Added one regression; 3files/18tests
PASS(4.15s), seven root types PASS, adapted root build668modules/6.67s PASS.
Full suite/matrix above precede only that auxiliary branch; no further runtime
edits. It is not exercised by the Node memory harness.
