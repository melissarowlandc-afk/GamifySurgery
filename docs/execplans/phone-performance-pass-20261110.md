# Phone performance pass — 2026-11-10

## Goal and constraints
Reduce peak and steady phone memory and allocation during Level 4/5 play, using production bundles and public fixtures. Preserve simulation, clinical content, save formats/policy, and Level 5 pins. Shared tree: preserve all unrelated changes; no agents, installs, commit, push, or deployment. Browser/device checks belong to the manager.

## Ownership
Player runtime, facility rendering, mobile performance policy, their tests, and measured headless tooling. Cloud files only for a measured, minimal lifecycle change; re-read before patching because the save worker is active there. No domain or clinical edits.

## Acceptance and validation
Budget main/engine/codec heaps separately from nominal decoded/GPU art, plus allocation at 1x/4x, public Level 4/5, normal/reduced phone profiles. Fix the largest measured costs; bound caches and per-gesture growth; add repeatable budgets. Automatic phone defaults remain dialog-free. Run focused tests, full player Vitest with `--pool=threads`, root typecheck, and root build. Compare the four known player failures and report any pin mismatch without rebinding.

## Milestones
1. Capture the source epoch and measure current production memory, texture and allocation costs.
2. Implement the largest safe phone reductions and regression budgets; differential correctness checks.
3. Re-measure, validate, and hand off `docs/research/phone-performance-pass-20261110.md` and the current-thread handoff.

## Progress
- Read repository instructions and existing reload/thermal/memory reports. Current production catalogue projection and durable restart guard are already live.
- Prior reports identify decoded facility art and codec/journal retained state as candidates; new measurements must distinguish actual heap from nominal bitmap accounting and fake IndexedDB overhead.
- Captured 1,872 source paths. Production matrix complete: L4/L5 at 1x/4x; exact final-state hashes match all four pairs. Persistent fake IDB moved outside codec JS accounting and survives realm termination.
- Delivered 142 offline phone art variants, four-slot decode, catalog atlas gating/reclamation, automatic large-clinic reduced mode with live DPR/character-budget changes, idle codec release, and allocation-free empty diff paths. No domain/clinical/save-format/policy changes.
- Regression budgets: source-art bytes/dimensions/provenance; native frame/clip ratios; four concurrent decodes; codec pending-task safety; exact old/new transport; production ten-hour worker/view heap and allocation ceilings.
- Final full player: 409 files / 4,063 tests passed; 5 files / 6 tests failed. Four known baseline failures reproduce in the capture; two tutorial assertions are isolated to the concurrent reducer (captured reducer + current player passes 26/26). All owned failures corrected and included in final suite.
- Seven workspace typechecks and root production build pass using the documented exact-inventory sandbox adapter; native root build is blocked by Node's Git spawn EPERM. Scoped changed e2e typecheck passes.
- Public actual-cloud L5 stress: 1,200/1,200 ticks, twenty game hours, final main/engine 49.28/64.32 MB, idle codec 0. Eighty camera gestures retain fixed object/command counts and zero pan redraws.
- Research/handoff: docs/research/phone-performance-pass-20261110.md. Pin file unchanged, no rebind; seven bound domain/balance files changed concurrently, none by this lane.

## Next action
Manager review and production/browser/physical-iPhone acceptance using the research checklist. This bounded headless pass is handed off. The domain evidence/normalization/geometry allocation remains substantial and needs a separately owned milestone; sustained thermal/FPS and full WebKit native/GPU/DOM peaks are not proven here. No commit/push/deploy/install/agents.

## Round 2 — art readiness follow-up

Manager port29 browser acceptance found phone L4/L5 art readiness exceeding30 seconds and a phone density chart assertion. This follow-up owns only phone art scheduling, the renderer's loading/settling lifecycle, regression tooling/tests, and this report. Domain/content workers remain out of scope; the release worktree is read-only.

- Captured current phone runtime/renderer/tests before editing in `.local-dev/phone-performance-pass-20261110/round2/entry.json`.
- Initial evidence: phone room installation uses an all-assets `Promise.all` barrier; one pending decode has no deadline and holds one of four slots. Reduced-mode character eviction conflicts with unconditional all-cardinal prefetch on every redraw, so inspect repeated requests before choosing a fix.
- Implemented: exact phone poses instead of all-cardinal prefetch; one prioritized four-slot room/character queue with deadlines/fairness; independent source installs, coalesced visible painting and final background paint. Desktop prefetch and all simulation/save behavior stay unchanged.
- Production replay: L4/L5 original readiness0.533/0.567s; first room paint1.050/1.128s; all art settled2.567/4.933s. Old readiness never settles in31s and requests1,523/1,648 sources; new115/226 with no post-settle requests. Actual WebKit timing remains manager validation. Both states and all five settled graphics/image/character display-map records compare byte-exact.
- Density helper now waits for actual recovery completion; its test opens a chart through Patients instead of assuming an old sheet. Original trace was no longer available, so exact historical causality/flakiness remains unproven.
- Focused22 files/143 tests pass. Final full player413 files/4,073 tests pass;7 files/9 tests fail,494.78s; all nine reproduce in the captured source epoch (7 files,105 tests,96pass/9fail). The obsolete inspector prefetch expectation is updated and passes. Seven workspace typechecks, scoped e2e/QA types pass; supplemental root build677 modules/10.68s passes with the existing captured-inventory adapter (native Git spawn is sandbox-blocked).
- Acceptance: actual current readiness predicate reaches true for paused L4/L5; bounded/rejected/hung decodes drain; no repeated pose reloads at rest; visible art is not gated on background art. Run focused/full player threads, seven workspace typechecks, root build, scoped e2e types; manager runs production/browser checks.
- Handoff ready: round2 section in the research report, exact logs/comparison/source hashes under the round2 evidence directory. Manager must confirm actual browser/iPhone download/decode/paint timing, phone frame/memory budgets and density behavior. No domain/clinical/cloud edits, no rebind; pin artifact unchanged.
- Final audit: three foreign test files were updated concurrently after the full run loaded them; their current78/78 tests now pass5.43s. Preserve and exclude these edits from the perf port. Scope manifest has18 owned paths (10existing/8new), including only this handoff's appended round2 section.
