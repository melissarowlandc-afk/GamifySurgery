# Compact laptop and phone UI — 2026-11-08

## Goal / ownership

Implement the owner's density request within player UI/CSS and layout tests.
Read all manager screenshots and write the audit before source edits. Preserve
the shared tree and prior splitter change; no domain, clinical, question, engine,
cloud/save, art or gameplay edits. No agents/Git/install/network/browser actions.
The requested audit/handoff is `docs/research/ui-density-20261108.md`; do not edit
other research or question-worker documents. Scoped entry copies/hashes are in
`.local-dev/ui-density-20261108/worker/`.

## Decisions / acceptance

- Recover blank shell space, compact the phone HUD and retain visible disclaimer,
  real safe areas, save errors and all controls.
- Give laptop Build/Management useful side-column space; compact readable room,
  employee, service and finance rows. Fewer clicks only using existing safe
  actions/Undo. Keep irreversible-action confirmations.
- Laptop body ≥13 px, phone body ≥14 px; phone touch targets ≥40 px (primary ≥44).
- Add measurement e2e for 1366×768 and 390×844; repair stale touched layout steps
  without weakening gameplay/safety assertions. Manager runs browsers.

## Milestones

- [x] Inspect every screenshot and write audit with expected pixel gains.
- [x] Inspect current DOM/CSS and implement scoped shell/header density.
- [x] Compact Build and Management lists/actions, preserving accessibility.
- [x] Component/layout tests and manager-run e2e measurements/stale-step updates.
- [x] Full player threads, root seven typechecks and player build; exact output.
- [x] Complete audit handoff and additive current-thread summary.

## Next action

Round 3 complete for manager review: all 17 supplied error contexts classified
and fixed in product CSS or equivalent native/current test flows. Focused/full
player, seven typechecks, e2e tsc, offline Playwright import-boundary check and
build completed; the audit's round-3 table maps every original failure. Manager
reruns all six layout specs plus measurements on the four projects. Browser
success is not claimed. The four player baseline failures remain unchanged.

Round 2 implemented and headless validation complete. Manager reruns the density
measurements (phone four-control/time/status bounds and desktop thumbnail/text
separation) plus the splitter spec across desktop projects. The manager's
border-excluded host rects remain verbatim. See the audit's round-2 section for
exact output, unchanged catalogue proof, the deterministic chart fixture failure
and screenshot pixel/CSS-pixel distinction. No browser geometry claimed here.

Implementation/headless validation complete. Manager runs browser/visual
acceptance and a settled-catalog full suite. No actual after pixel/row numbers
are claimed from headless structure checks. The requested audit has all file
paths, estimates, exact logs, baseline failures and residual risks.

## Discoveries / progress

- All 28 screenshots reviewed before source edits; written audit created first.
- Desktop blank band is a 30 px always-reserved empty ClinicHeadline; phone band
  is a minimum 32 px session strip whose links are hidden under sheets.
- Compact desktop workspace modes can use the full center width while retaining
  both mounted clinic rails behind one explicit Show/Hide clinic panels toggle.
  This changes presentation only; split/camera and game state are untouched.
- Phone catalog is now a direct 52 px room row plus inline labeled Details;
  Hallway/Doors and New/My share a strip. Existing Undo and guarded exits remain.
- Employee rows and available workspace width save more space while meeting the
  13/14 px body-text floors. Full/capacity guidance is optional; actionable access
  and other hire errors stay visible. Confirmations remain.
- Native phone Close replaces duplicate Done. Real-session tests retain exact
  pause/clock/speed restoration for both initial paused states and all exits.
- Initial broad run: 384 files/3647 tests passed, 4 files/4 tests failed,
  431.08 s. Three are the documented entry baseline; the new failure is the old
  phone CSS guard rejecting the exact `.mobile-shell` root. Its matcher now also
  allows that exact root, while still rejecting unscoped/similarly-prefixed
  selectors. Focused guard check: 2 files/15 tests passed, 6.49 s.
- Final focused: 15 files/150 tests pass, 16.93 s. All seven typechecks and e2e tsc
  pass; player bundle 1040 modules, 6.35 s, passed. Full rerun: 384 files/3647
  tests pass, 4 files/4 tests fail (388/3651), 398.14 s. The guard is fixed; three
  failures are the entry baseline. The fourth is native-worker view comparison:
  main catalogue 606 IDs vs worker 605 during concurrent question edits; exact
  gameplay state matched. Fresh isolated worker test passes 1/1, 8.08 s. No
  out-of-lane assertion/source was edited. Full suite is not claimed green.
- Final runtime/test hashes reviewed; previous splitter source/tests unchanged.
  Browser/visual acceptance and full rerun after catalogue work settles belong
  to the manager. No Git, installs, network, agents or browser was used.

### Round 2 (manager screenshot fixes)

- [x] Dedicated 36 px desktop thumbnail track and separate text track; override
  the actual more-specific legacy catalog/font rules. Name/price body ≥13 px.
- [x] Four equal phone control tracks, one-line facility time/day, shared short
  lock-status band, visible one-line disclaimer. Browser acceptance ≤170 CSS px
  in Build/Manage at 360/375/390/430 px; no error clipping or lost controls.
- [x] Splitter test pans to and reads the actual world-bottom clamp; retains
  zoom, shade directions, picking, reload and manager's fractional host rect fix.
- [x] Catalogue investigation: shuffled single-worker seeds 7/41/93 each pass
  3 files/16 tests; full run also passes native worker/main comparison. All 535
  clinical source hashes stable throughout. No UI order dependency reproduced.
- [x] Focused 7 files/81 tests pass (10.88 s); root seven typechecks and affected
  e2e/splitter tsc pass; player build 1046 modules/6.61 s passes. Full player:
  385 files/3903 tests pass, 4 files/4 tests fail (389/3907), 423.08 s. Three are
  prior baselines. The fourth, chartStructuredFields:129, also fails isolated:
  raw `->` explanation searched inside React-escaped `-&gt;` HTML. No session or
  clinical file edited; full suite not green. Details/logs in the audit.
- [x] Scoped review and additive current-thread handoff; manager browser check
  remains pending. No domain, session, clinical, camera, save or art edits.

### Round 3 (browser acceptance failures)

- [x] Read/index all 17 manager error contexts. Confirm round-2 visuals accepted
  by manager (phone header ~122 CSS px). Per-failure product/stale classification
  and exact retained assertions are in the audit's round-3 table.
- [x] Product CSS: full mode text uses integer nonshrinking line boxes and a
  flexible chip; locked/unaffordable phone rows keep reasons at 14 px with less
  vertical padding/gap; desktop canvas uses intrinsic dimensions instead of
  fractional-pane stretching. No engine/camera/controller/source changes.
- [x] Tests use real Resume/reveal/native-phone actions and condition polling.
  Observe durable snapshot+journal, not the legacy localStorage base. Keep every
  exact price/refund, frozen-work, capacity/station, lineage, upgraded-order,
  pause/exit, chart-priority and canvas/picking assertion. No timeout increases;
  room upgrades gain compact/laptop coverage rather than skipping phone.
- [x] Focused 15 files/151 tests PASS, 20.99 s. Seven workspace typechecks,
  affected e2e/QA tsc and offline installed Playwright CommonJS transform PASS
  (no worker-reaching Node import). Player build 1046 modules/8.50 s PASS.
- [x] Full player: 385 files/3904 tests PASS; same 4 files/4 tests FAIL
  (389/3908), 465.59 s. Choice count, escaped-HTML fixture, gym-note regex,
  legacy codec bound remain. All 535 clinical source hashes stable. Full suite
  not green; no source/assertion edits outside the UI/test lane.
- [x] Scoped diff/hashes and additive current-thread handoff. Manager browser
  rerun pending; no browser, agents, Git, install, network or deployment used.

### Round 4 (four residual browser failures)

- [x] Read the manager's four error contexts from layout-e2e2.log. All are stale
  fixture/flow assertions: the retired X-ray adjacency rule, inherited unchecked
  arrival status in the visual fixture (two projects), and closing an already
  auto-dismissed phone chart after Enact Plan. No runtime/domain changes needed.
- [x] Assert both current invalid-layout issues and repair hints, mark the two
  already-inside visual patients checked in, select the named admitted patient,
  and assert the native post-Enact Patients transition before reopening.
- [x] Real session + desktop shell regression proves the unchecked-in rejection
  is visible and the checked-in chart replaces Management, then closes normally.
- [x] Focused: 16 files/153 tests PASS, 16.65 s. Seven workspace typechecks,
  affected e2e/QA typecheck and 5 installed Playwright CommonJS transformations
  PASS. Player build: 1046 modules, 4.78 s, exit 0 (existing warnings).
- [x] Full player threads: 386 files/3906 tests PASS; same 4 files/4 tests FAIL
  (390/3910), 440.48 s. No new failure; full suite remains not green.
- [x] Scoped review and additive handoff. Browser rerun belongs to manager;
  no runtime/domain/session/clinical/art changes in this round.
