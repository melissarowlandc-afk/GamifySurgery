# Continuous opening presentation - 2026-11-16

## Goal, ownership and constraints

One persistent welcome/loading surface from the first web paint, through auth,
admission, campaign selection/recovery and actual first art-ready clinic frame.
Progress reflects completed/active stages, is monotonic within one opening, and
cannot reach 100% until the clinic is ready. Resting sign-in/setup/notice/chooser
and genuine failure remain accessible. Explicit choices and existing safety,
save, automatic-newest-copy and account rules remain authoritative.

Main shared tree only. Own entry/bootstrap/auth/loading/App routing/chooser/save
presentation and tests. A minimal presentation-only first-frame/art observation
is necessary in FacilityCanvas/FacilityScene; it changes no rendering, assets,
simulation or engine commands. No operationalEngine*, gameSession or transport,
domain, clinical/question, SQL, previous flag-tool/wait-label, save-format or
gameplay edits. No Git, agents, network/live DB, installs, deploy or browser
storage access. Manager runs Playwright. Preserve concurrent edits by hunks.

Preimages/hashes: .local-dev/continuous-loading-20261116/intake.json and before/.
Prior flag/wait lane and concurrent-source hashes recorded separately. Root
AGENTS/current handoff read; no nested instruction files. No origin changes.

## Inventory before changes

Durations below distinguish measured public Node controls from browser/network
work that cannot be measured in this sandbox. No physical-phone timing claim.
Round4 public medians are from docs/execplans/phone-memory-20261112.md:534-551.

| Surface / condition | Duration evidence or bound | Flash risk |
| --- | --- | --- |
| OS standalone launch image before web content | iOS/browser controlled; unmeasured | Outside app control; web handoff must use welcome palette. |
| Empty root/body before static module graph | Public module evaluation 337-352 ms; real fetch/device time unknown | Blank/background until delayed React loader. |
| Classic startup-recovery error replaces empty root | Until explicit Reload | Genuine failure, but visually unrelated plain text. |
| AuthGate remembered-session check | Provider session/user requests bounded 30 s each; fake paths can finish <400 ms | Loader delays independently, then unmounts before admission. |
| Sign-in form / password setup / local bypass | Resting user interaction | Legitimate only when auth says signed out/setup required. |
| Submitted sign-in form with Working button | Until password request resolves | Should become loader immediately, not remain visible. |
| CloudAccountProvider admission | Access read deadline 5 s; retained-cache fallback up to1.5 s | Separate loader and 400 ms delay, exposing gaps. |
| Local profile/catalogue/journal recovery | Public L4/L5 native profile28/33 ms; catalogue168/161 ms concurrent journal305 ms | Chooser paints at399/406 ms before actions ready693/711 ms. |
| Local Clinic Campaigns / founder | Resting explicit choice or fresh profile | Should not flash when a clear existing campaign can resume. |
| Cloud entry / enrollment / optional row metadata | Whole enrollment bounded30 s; metadata5 s; browser duration unmeasured | Your campaigns can appear between access and auto-selection. |
| Automatic marker/inventory/list selection | Reads5/30 s, existing selection window30 s | Chooser visible while decision still pending/retrying. |
| Open copies/head/lease/newest verified recovery | Automatic resolution150 s; opening180 s outer budget | New Checking account save loader remounts. |
| Hydrate/journal bind/engine initial projection | Public local playable869/910 ms total; bind94/97 ms, view31/43 ms | Opening stage currently displays100% before map exists. |
| Local preparation / shell Suspense | Asynchronous journal/shell readiness, bounded by existing checks | Empty shell or another delayed loader. |
| Canvas creation / async room and character art | Real browser unmeasured; old art controls often seconds | Clinic can appear before art settles; no current first-frame contract. |
| CloudSaveControls checking/blocked/closed notices | Depends on actual coordinator state | Transient notices can appear above a half-ready clinic. |
| Foreground return with valid lease | Cheap background check; play remains authorized | Must show nothing. |
| Foreground return requiring authority check | Existing bounded check; game stays mounted | Must reuse one opaque surface, then dismiss automatically. |
| Revoked/deleted/read-only/capacity/real opening failure | Resting error until existing recovery action | Must never be hidden indefinitely by the loader. |

## Design

- Persistent root provider/host owns one surface, art, tagline and bar. Existing
  LoadingScreen instances become scoped requests under that provider; standalone
  embedding retains its existing behavior for isolated consumers/tests.
- Preboot HTML uses the same CSS/art/wordmark and a stable external surface;
  React adopts it before retiring bootstrap listeners. No blank-root interval.
- Weighted stages: bootstrap/auth -> admission/selection -> verified copies ->
  hydration/journal/engine -> visible art/actual render. Monotonic high-water
  progress stays below100 until the actual ready frame. No elapsed-time fake
  progress and no infinite healthy check without deadline/recovery.
- A real resting-state marker ends boot holding only after signed-out/setup,
  explicit chooser/founder/notice, or a definitive selection decision. Gaps
  between asynchronous requests do not expose intermediate screens.
- Keep cloud selection/newest-copy verifier unchanged; present pending selection
  under the loader. Single clear account/local campaign can auto-open once
  recovery/enrollment readiness is known; explicit/multiple-choice rules remain.
- Error/report actions retain their requesting auth/usage context via portal,
  so consent/deletion guards and existing beta feedback transport still apply.
- First-frame notification is presentation-only: it observes art readiness and
  Phaser POST_RENDER, not a timeout, DOM canvas insertion, pixel readback or game
  tick. Asset failure reaches one honest recovery action, never a silent hang.

## Milestones

1. [done] Read instructions, capture sources, inventory all opening branches.
2. [done] Persistent weighted loading model/host and seamless bootstrap.
3. [done] Wire auth, local/cloud automatic selection, shell and ready-frame
   presentation, keeping engine/session files read-only.
4. [done] Screen-sequence/identity/progress/error tests; focused validation.
5. [done - execution complete; shared-tree failures below] Full player CI/preload/threads, seven typechecks/boundaries/build,
   pacing alone last; exact logs and scoped port/handoff with browser checks.

## Implementation / additional inventory

The original per-branch loaders independently delayed400 ms and reset three-step
bars. The opening step displayed100% before a canvas existed. Account selection
and enrollment ran while the chooser was visible; local Round4 deliberately
painted a read-only chooser early. The new owner direction supersedes that
visual behavior, keeping recovery readiness and all command/save authority.

- `index.html` paints the welcome surface before the module graph, using the same
  CSS/fonts/art/wordmark/subtitle pool. The classic30 s bootstrap failure handler
  modifies this surface in place. React adopts its section and its actual
  already-decoded picture; the section, React brand and bar persist thereafter.
- The manifest launch background now matches the welcome palette. The OS-owned
  PWA splash/icon can precede HTML; its duration/art cannot be controlled by
  React. No manifest identity, scope, launch URL, origin or icon changes.
- `LoadingFlow` is a stable external store outside AuthGate/session/layout keys.
  Scoped requests can unmount between stages without exposing a zero-request
  gap. A definitive resting marker plus no pending request ends the opening,
  coalesced after the entire React commit. Normal in-play checks keep400 ms
  no-flash debounce; a submitted sign-in/Resume/new-clinic intent is immediate.
- Weighted floors (percent): boot2, auth8, access20, selection28, copies40,
  hydrate64, journal78, engine86, art92, actual frame98. Completed real work
  advances within its range. The high-water mark never rewinds within an
  opening/retry.100 is assigned only when hiding the surface at the definitive
  ready/resting boundary; it is never displayed over an unready clinic.
- `entryTimings` adds an exception-isolated presentation observer. Optional
  worker warming/row metadata neither blocks nor advances opening. Existing
  code supplies access/enrollment/selection/copy/hydration/marker stages.
- Auth restores remain covered across candidate/user verification and admission.
  Real signed-out/setup forms settle after400 ms. Transient auth backoff keeps
  a healthy loader until its actual deadline, instead of flashing a Retry.
- The cloud entry remains mounted for enrollment. The visual gate waits for
  completed enrollment/recovery and an automatic decision; true notice/errors,
  explicit null-marker chooser and multiple unrelated campaigns remain resting
  interactions. A sole remote campaign on a new device uses a fresh server list,
  never an empty/partial context list. Existing cached-family/last-active rules
  take precedence. Local play resumes a clear active/sole resumable campaign
  after catalogue and journal recovery; explicit New/Choose paths stay explicit.
- The small FacilityCanvas/FacilityScene observation hook waits for actual
  `postrender` with art settled (desktop loader, rooms, characters; phone decode
  queue and paint completion). It unregisters after success. A restored phone
  chart must allow this one opening frame behind its sheet; afterwards the
  original covered-map/sleep policy resumes. Retry recreates presentation only,
  clearing failed image-cache entries, with the same game/session/progress.
- The same external section follows restored native dialogs into their top
  layer. Inert/focus/Escape shielding remains active; opening a problem report
  never has its focus stolen. Report buttons are portalled from the requesting
  auth/usage context, retaining existing consent/deletion guards.
- Locally durable/authorized play does **not** wait for aggregate `pending`, an
  account upload, acknowledgement compaction or optional metadata. Genuine
  capacity/storage/authority/closed errors finish loading immediately once they
  are definitive and reveal the existing recovery notice; they cannot stay hidden forever.

Other legitimate resting surfaces: invitation/password setup, founder creation,
its optional happy branch, first-use usage/account consent, explicit archive/
replacement confirmation, and deliberate Save & Close confirmation. These are
user decisions, not speculative loading stages. Shell Suspense/local preparation
feed the same persistent surface. There is no new data/network/save operation
for progress; no engine/domain/transport or clinical changes.

## Deadlines and failure actions

- Pre-React module/boot:30 s or actual module/unhandled failure -> one Reload;
  never automatic reload/storage mutation. The in-game problem-report module
  cannot send before JavaScript loads; React failures retain the existing report.
- Auth/access/selection, local preparation, first art/frame:30 s presentation
  deadline with existing safe callback if supplied; report link on failure.
- Actual verified copies/hydration retain180 s opening and150 s automatic-copy
  work budgets. Their presentation range does not replace safety deadlines.
- Automatic-selection window remains30 s across asynchronous retries/list
  rerenders; it now shows an honest failure with Try again, rather than silently
  falling through to a speculative chooser. Manual/explicit selection cancels
  late decisions; no duplicate opens.
- No healthy action buttons. Failure may expose at most the one requesting
  recovery action plus the existing report link. A deadline never grants play,
  drops bytes, reloads uncommitted state, or bypasses a save/authority gate.

## Validation and manager browser handoff

Final focused:22 files /379 tests pass (`focused-frozen.log`). The authoritative
final full run, build and pacing outputs are recorded below; earlier logs are
retained as superseded review evidence.

The public Node inventory timing medians above are the available measurement;
no invented physical-phone or live-network durations. Manager should capture
cold/warm phone+desktop, remembered sign-in, new submitted sign-in, local-only
reload, cached/offline cloud reopen, pending background upload and minutes-away
expired lease. Record top-level visible screen per animation frame, the same
`#clinic-loading-screen`/bar node identity, monotonic `aria-valuenow` within its
`data-loading-epoch`, and the art-ready POST_RENDER before disappearance.

### Existing Playwright expectations that need updating

No Playwright run is possible in this sandbox. No safety assertion should be
removed. The following old entry-only assumptions need explicit chooser intent
or automatic-open-aware observation (manager owns browser execution):

- `tests/e2e/cloud-qa-helpers.ts`, `expectPlaying`: also await the absence of the
  **visible** Loading clinic region with the existing cold-start budget; account
  authority/save assertions retain their own shorter budgets. The persistent
  hidden node still exists; do not assert raw DOM removal. `openAndContinue`
  already accepts either an automatic active session or a Resume row.
- `tests/e2e/cloud-saves.spec.ts`: automatic enrollment/notice-listing, compact
  0/1/2-row chooser, account-B same-profile/deletion, archive/slot scenarios that
  explicitly expect Resume rows after first-time enrollment now need a deliberate
  campaign-screen/null-marker fixture. Routine desktop-phone-desktop uses
  `openAndContinue` directly after notice; retain exact original bytes/state,
  operation counts, fences, deletion, slots and all double confirmations.
- `tests/e2e/cloud-recovery.spec.ts`: the slow-open test and read-only second
  document flows that click a presumed initial Resume row need an explicit
  chooser fixture before injecting the fault, or hold the opening transport
  before navigation. The bar is0-100 weighted progress, not old step2-of3;
  assert monotonic <100, stable node, no healthy actions, then real ready-frame
  dismissal. Keep corrupt-copy export, exact-state recovery and upload assertions.
- `tests/e2e/helpers.ts` (`startClinic`, `completeClinicOpening`, `resumeLocalCampaign` and local reload
  helpers), `tests/e2e/ui-density-helpers.ts`: await the hidden loading surface/
  first ready frame after creating/restoring a clinic before tapping game controls.
  Existing profile injections must still precede opening; a clear existing local
  clinic now auto-opens. Any test whose purpose is chooser layout must explicitly
  request the chooser rather than depend on an incidental initial screen.
- The specs using those helpers (`ui-density`, `phone-ui-space`, `management-mode`,
  `build-mode-usability`, `room-upgrades`, `splitter-map-shade`) keep their geometry,
  control, authority and gameplay assertions. Update only their entry setup/wait
  if it assumed a transient local chooser or canvas insertion meant art readiness.

The exhaustive line-level review inventories are
`e2e-entry-call-sites.json` (shared-helper users) and
`e2e-direct-campaign-selectors.json` (direct campaign selectors and the old bar
assertion). These are review points, not assertions to delete. Many historical
specs already tolerate automatic local opening and need only the shared
first-frame/loader wait. `resumeLocalCampaign` is already automatic-open-aware;
it still must avoid clicking an incidental covered row that detaches and must
await the real art-ready frame. `completeClinicOpening` currently treats canvas
insertion as readiness; add the same visible-loader/ready-frame wait there.

For chooser-only cloud tests that assert **no writer acquisition or operation**,
do not open a clinic first just to return to the list. Hold the disposable auth
binding, durably set the synthetic entry store's `last-active-campaign` to
`{campaignId:null}`, then release admission. That exercises the existing explicit
chooser rule without weakening the no-acquire, raw-byte, slot or confirmation
assertions. No real account/browser storage was accessed or altered here.

## Review corrections and current source freeze

The integration review retained all save-safety assertions while adapting the
entry-only fixture steps to automatic opening. Real MessageChannel codec work,
IndexedDB ordering, immutable operations, fencing, exact saved states, usage and
Save & Close checks remain intact.

- Server/static rendering does not support portals even when the test realm has
  a document. The persistent surface now adopts in a client layout commit, with
  bootstrap art retained until that same commit. Existing SSR/phone shell and
  one-clock continuity checks pass; renderer substitutes declare their explicit
  first-frame contract rather than relying on incomplete profile/session mocks.
- A deliberate close is a definitive resting state. Delaying it400 ms could let
  the loading debounce fire after Save & Close had already completed. Definitive
  closed/error states now settle immediately, with the existing recovery notice.
- Independent art/frame progress must not erase a real local-preparation error.
  The progress/deadline model keeps the actual failure until its request clears.
- A local load with no canvas and no safe reload callback offers the report
  path instead of a no-op Try again. Asset retries recreate only the renderer.
- Canvas recreation after suspension invalidates the previous ready frame in a
  layout effect, before paint. A completed authority check cannot uncover its
  unfinished replacement. Hiding/discarding a phone canvas does not emit a new
  pending event or wake it. New rendering gets its own actual art-ready frame.
- Submitted personal account setup and account-entry actions/notice acceptance
  feed the same immediate surface. Auth claims, consent checks, privacy and all
  mutation/order semantics remain unchanged; real validation errors return to
  the original form.
- The final code/test set is41 files, frozen in `final-source-freeze.json`.
  Superseded broad runs overlapped implementation/review and are retained as
  intermediate evidence, not final acceptance. No further code edits during the
  final focused/build/full/pacing sequence.

Two current shared-tree failures are outside this UI lane:
`questionProgramBatch8SaveCompatibility.test.ts:196`, format3 frozen-case equality
for the anesthesia/analgesia pharmacology and PTLD pathology-returned cases.
Expected retained option labels differ from the current hydrated labels. This
file does not import App/loading/auth/renderer presentation. It and its clinical/
domain inputs are untouched here. This is **not** being waved away as a fixture
artifact: manager/question/domain review is needed to determine whether a pin or
runtime frozen-content recovery contract needs correction. Do not deploy based
on a claim that the full shared tree is green while those failures remain.

## Scoped file handoff

Exact paths/SHA256 values and before/after review hunks are in the port manifest.
The code set is41 files:24 production/dev-QA presentation files,16 tests and one
shared test-DOM helper. Docs add this plan and an append to CURRENT_THREAD_HANDOFF.

| Responsibility | Files |
| --- | --- |
| First web paint / standalone palette | `apps/player/index.html`, `public/startup-recovery.js`, `public/manifest.webmanifest` |
| One persistent surface / progress / definitive rest | `ui/ContinuousLoading.tsx`, `ui/LoadingFlowContext.tsx`, `ui/loadingFlow.ts`, `ui/LoadingScreen.tsx`, `ui/LoadingScreen.css`, `ui/loadingBootstrap.css` |
| Opening/auth routing and branding | `App.tsx`, `auth/AuthGate.tsx`, `auth/SetupAccountForm.tsx`, `ui/OpeningBrand.tsx`, `ui/OpeningSequence.tsx` |
| Entry readiness, automatic choice and command-gate presentation | `ui/CloudCampaignEntry.tsx`, `ui/CloudSaveControls.tsx`, `session/cloud/reopenSelection.ts`, `session/cloud/entryTimings.ts` |
| Actual art-ready frame / renderer-only retry | `ui/ClinicPresentationGate.tsx`, `ui/clinicPresentation.ts`, `facility/FacilityCanvas.tsx`, `facility/FacilityScene.ts`, `mobile/performance/roomAssets.ts` |
| Same behavior in disposable QA | `qa/cloudSavesQa.tsx`, its integration tests (real MessageChannel/IndexedDB boundary) |
| New regression files | `ui/ContinuousLoading.test.tsx`, `ui/loadingFlow.test.ts`, `ui/clinicPresentation.test.ts`, `ui/loadingBootstrap.test.tsx` |
| Existing regressions / fixture reconciliation | `App.cloudLifecycle`, `App.cloudReopenAsync`, `App.localCatalogueOpening`, `auth/AuthGate`, `auth/AuthGateSetup`, `facility/FacilityCanvas.lifecycle`, `homeScreenInstall`, `mobile/mobileEntryIntegration`, `mobile/shellContinuity`, `session/cloud/reopenSelection`, `ui/WelcomeArtwork` tests; `mobile/testDom.ts` adds standard attribute/parent/id helpers |

The two session/cloud runtime changes are read/observation and presentation
selection only. No operationalEngine*, gameSession, engine transport, domain,
balance, clinical/question files, account/save formats, SQL or authored medical
text changed here. The prior flag-tool/wait-label code/test/README guard remains
12/12 byte-identical. Main.tsx/AppShell and the actual save/command paths remain
unchanged. Existing genuine blocking notices/recovery operations stay available;
unknown nonchecking command gates get their existing connection-check action
after400 ms rather than remaining behind an actionless loader.

## Final validation (frozen source)

All commands use CI=true and the documented sandbox preload. Player tests use
`--pool=threads`. The final sequence is focused -> root build (boundaries plus
seven-workspace typecheck plus player build) -> full player -> pacing alone last.
`final-source-freeze.json` verifies all41 code/test files byte-identical throughout
this complete sequence. No source edits or test/budget/skip relaxations afterward.

| Check | Exact output / outcome | Exit |
| --- | --- | --- |
| Focused entry/auth/loading/QA/first-frame tests | Test Files22 passed(22); Tests379 passed(379); Duration40.99s |0 |
| Full player | Test Files478 passed,1 failed(479); Tests5708 passed,2 failed(5710);0 skipped; Duration846.97s |1 |
| Root seven-workspace typecheck | All7 workspace scripts passed (also standalone run) |0 |
| Boundaries / launcher | Verified runtime dependency boundaries and22539 tracked paths; launcher protocol1 |0 |
| Player build via `npm.cmd run build` | 706 modules transformed; built in9.77s |0 |
| Pacing, alone last | firstFinishTick26281; ref26281; drift0%; cash5958386 cents; completions440; walkouts0 |0 |

Pacing used1436 cases /1144 registered meanings, clinical SHA256
`ca9e18dbb5d60df4faec84e36198f68a7a6316109ae375c00f874efa0577fcee`. The existing Node
stripTypeScriptTypes experimental warning is nonfatal. Build retains the existing
large-chunk/dynamic-import warnings; no budget is changed here. Boundaries use the
checksum-verified read-only index adapter (`boundary-readonly-index.cjs`): the
stock checks still run; no Git process or index mutation occurs. PowerShell's file
script execution policy was left unchanged; these commands ran interactively.

The only final full-player failures are the two frozen-case equality checks at
`apps/player/src/questionProgramBatch8SaveCompatibility.test.ts:196` identified
above. The presentation tests all pass. **The whole shared tree is not green.**
No assertion was weakened to conceal this; question/domain review remains required.
Exact failure names/messages are in `full-result.json` / `player-frozen.json`.

All12 prior flag-tool/wait-label code/test/README hashes remain unchanged.
Observed concurrent changes outside this lane are recorded, not reverted, in
`unowned-observed-changes.json`. No protected engine/session transport, domain,
clinical/question or SQL changes belong to this port; no Level5 binding input
changes from this lane. No Git/agents/network/live DB/install/deploy/browser
storage action occurred. Origins and normal opening paths remain unchanged.

## Manager next action / open acceptance

1. Review/apply only the scoped port hunks and exact hashes; preserve unrelated
   engine/question work. Resolve the two independent frozen-case contract failures
   before treating the whole tree as release-green.
2. Update/review the exact Playwright entry call sites listed above, keeping every
   authority, immutable-operation, raw-byte, recovery, slot and confirmation check.
   Run cloud-saves/cloud-recovery plus the named phone/desktop UI specs.
3. Capture cold/warm phone+desktop (including a Level5 clinic), remembered and
   submitted sign-in/setup, explicit/multiple chooser, pending upload, native
   restored chart and discarded/recreated canvas after background return. Verify
   one visible surface/bar node, monotonic progress, correct focus and real
   post-render dismissal. Exercise failure/report and reduced-motion states.
4. The OS-owned standalone splash remains outside React; its background matches
   the welcome art, but installed-device splash caching needs physical review.
   Browser/physical iPhone acceptance was not run in this sandbox.

This is an uncommitted local checkpoint. Manager owns integration, browser
acceptance and the GitHub-backup checkpoint; no release/deploy is performed here.
