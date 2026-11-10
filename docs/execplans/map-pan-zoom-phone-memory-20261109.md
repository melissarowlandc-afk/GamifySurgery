# Phone memory after retained-camera release

## Goal and constraints

Compare the retained-camera phone renderer with captured pre-pan/zoom sources,
identify steady/gesture memory growth, and keep zero-rebuild pan with no phone
memory regression. Audit Canvas/texture/iOS boot risks. No simulation/save format
or domain/content edits. Shared tree: preserve all concurrent changes. No Git,
agents, browser execution, network, installs, commit/push/deploy or backup actions.

Owner report: iPhone home-screen account Level 4 returned to sign-in then repeated
loading after release89a52452. Manager reverted deployment to9439b199; do not
revert the main tree. Manager Chrome phone/dev L5 heap585–590MB vs492–515MB
earlier;178textures/~164MB nominal RGBA, existing atlas up to7611x749.

## Ownership and baseline

Perf/facility rendering and mobile/performance code/tests; new test/QA helpers
as needed. Avoid active session/cloud and question/domain lanes. Current194
public source/test inputs captured with SHA256 under
.local-dev/map-pan-zoom-phone-memory-20261109/entry. Pre-pan source is the earlier
read-only .local-dev/map-pan-zoom-20261108/entry capture. No private save use.

## Milestones and acceptance

- [x] Matched L4/L5 phone GC/heap/command/object/cache/texture accounting before,
  after opening, and repeated gestures. Distinguish JS/nominal decoded backing
  bytes from unmeasurable browser/WebKit GPU/process memory here.
- [x] Fix evidenced retention/allocation; ordinary phone at or below matched
  pre-pan path, reduced mode lower; no growth per repeated settled gesture and
  no full world rebuild during pan.
- [x] Audit pre-existing oversized atlas provenance, Canvas vs WebGL use,
  context loss/recovery and Safari boot APIs; add narrow guarded fixes/tests.
- [x] Deterministic structural/texture and hosted heap regression harness/tests.
- [x] Full player threads, root seven-workspace typecheck and build; baseline
  comparison for failures; research report and additive current handoff.
- [ ] Manager production Chrome/physical-iPhone acceptance and attribution of
  the reported80MB browser delta. Browser/GPU/process evidence is outside this
  sandbox; a new four-case production CDP proof is ready, not executed here.

## Progress and next action

Worker implementation/validation complete. Matched fresh-process renderer
comparison finds no80MB heap increase or growth in display objects/buffers/
textures. Removed12,896,452/16,590,132bytes of pre-existing CanvasTexture CPU
mirrors, kept native pixels/frame coordinates; completed image promises no
longer own retired sources, old-Safari fallback bounded8/2MiB. Canvas2D context
restoration and scalar memory diagnostics added, without session/reload changes.
Zero world rebuilds in480 pan samples; fixed drawing hashes match entry.
JIT-free80gestures: post-warm heap+1,864/+232bytes including measurement rows;
objects/numeric buffers flat, no readback mirrors. State/fixture and727shared
package hashes unchanged. Oversized7611x749atlas confirmed in Nov7 evidence;
renderer is Canvas, not WebGL. New derivative size/context guards tested.

Focused682tests/86files PASS. Full player4003pass/4baseline failures
(4007tests,402files;435.62s); captured controls reproduce4fail/23pass(15.86s).
Seven workspace types/playerbuild(1059modules,4.78s)/QAproductionbuild(4.52s)
pass. Rootbuild blocked before Git spawn by mandated no-Git guard; unchanged
verifier not bypassed. Scoped e2e types/discovery4newcases pass; full e2e140
diagnostics identical to prior baseline. Research, scoped source patch/SHA
manifest and additive current handoff complete. Next action belongs to manager:
review scoped changes, run production browser proof and obtain document/process
evidence for the owner's actual loading/sign-in loop. Do not claim jetsam or the
80MB cause is established. No next implementation milestone started here.

Final context-hint-only follow-up after full suite: preserve native Phaser
willReadFrequently:true;1file/2native tests PASS(128ms). Seven types and both
builds rerun after correction. Full suite counts above precede that one-line
backing-hint preservation; all other runtime logic was in that full run.
