# Clinic economy, patient names and diagnostic room expansion

## Goal / owner decisions — 2026-09-28

Implement owner follow-up to the economy review: GLP-1 rooms support up to two
NPs, each earning $50/game hour; scheduled endoscopy nominal income becomes
$150/game hour; complex-question payments remain unchanged. Increase patient
name variety (screenshot shows three simultaneous Vale surnames). Audit every
test choice for reasonable local completion in available surgery-center rooms,
including final/single-question orders. Owner examples: barium swallow in X-ray,
anal ultrasound/biopsy in ultrasound. Preserve specific test distinctions and
do not reintroduce broad generic procedure-room routing.

## State / constraints

Read AGENTS and current handoff. Shared beta has 423 dirty/untracked entries at
intake, including completed GS-023 and concurrent seating work. Preserve all.
No commit/push/deploy/install, owner save/server/profile changes. Canonical owner
launch remains START_GAME.cmd -> http://127.0.0.1:4173. New clinical mappings are
development-only needs_clinician_review unless the owner has approved the exact
mapping; maintain source provenance for new substantive clinical facts.

## Decisions / acceptance

- Routine/advanced endoscopy fees $450/$600 at existing 5h/10h cadence:
  $90+$60=$150/h nominal, not guaranteed receipts. Preserve existing quotes.
- GLP-1 manual $50 unchanged; no proposed $75 automated increase. Two NPs per
  operational suite, independent persisted payout clocks, no duplicate receipts,
  safe hire capacity/assignment/UI and save migration; salary unchanged.
- Name variety must preserve saved identities, sex constraints, deterministic
  generation and clinical profiles. Avoid repetitions among active patients.
- Test routing uses explicit reviewed test/choice mappings, normal room/staff
  requirements and completion fees; terminal patients stay until work completes.
  Missing equipment or specialty work must not be silently relabeled as routine.

## Milestones / ownership

1. Terra ct_staffing_audit: bounded economy implementation and focused tests.
2. Terra test_choice_inventory: independent read-only broader test/name audit.
3. Terra test_choice_inventory: name generation, admission/visitor name calls and
   new name tests. Explicit disjoint-file exception while economy finishes:
   economy owns balance/selectors/persistence/UI; names owns appearance and name
   callsites in reducer/retail/service modules. No overlapping edits authorized.
4. Sol test_order_architecture: sequential test-route and staged-result lifecycle
   implementation after both writers finish. Architecture investigation complete.
5. Astra: inspect task-relative diffs, focused/full relevant tests and isolated
   browser evidence as needed; update handoff with exact scope/limitations.
6. Terra test_choice_inventory owns only a new independent browser spec
   and ignored evidence/private4198 server. This test-only parallel exception
   does not overlap core implementation files or the owner profile.

## Progress / next action

Economy and names underway. Owner clarified both endoanal ultrasound and guided
biopsy where appropriate. Sources/claims recorded in
docs/reviews/diagnostic-room-expansion-evidence-2026-09-28.md.

Audit correction: authored result-gate routes alone understated existing onsite
coverage; exact runtime overrides already cover CTA/duplex/genetic/serology/
aldosterone/colonoscopy/duodenal/esophageal biopsies. Do not rebuild them.

Selected new scope: exact Zenker contrast swallow in X-ray with bundled
fluoroscopy; exact endoanal ultrasound with probe in US; nipple-areolar skin
sampling in Minor Procedure (15 game min/$150 using approved diagnostic sampling
policy); GIST EUS-guided sampling in Endoscopy/Recovery with external molecular
processing. Retain specific room/equipment contracts and external fallback.

Compound gate architecture accepted: persist an exact frozen staged order for
local components, execute sequentially with Front Desk returns and exact-once
fees, then start the original external remainder/result gate. Initially anal-SCC
uses local CT only (no invented US-guided anal biopsy); breast imaging uses local
US with mammography explicitly external. Existing authored results remain frozen.
Missing local capability falls back externally; busy capability queues. Do not
rewrite active old orders. Test reload/duplicate ACK/missing-room/return/remainder
and terminal lifecycle in unit tests plus isolated browser proof.

Correct test-looking no_test candidates were reviewed: completed tests,
stool-consistency/no-surveillance management and therapeutic endoscopic hemostasis
are not new diagnostic orders. Future protocols and specialist procedures retain
their explicit distinctions. Complex-question payouts remain unchanged.

Additional existing-room scope from parent review: exact resting ABI gates use
US with a bundled cuff/Doppler capability (existing US45min/$120 editorial
template); current diagnostic urea-breath gates use specimen collection with a
breath kit (collection15min/$50 template, explicit external assay), not blood
draw or immediate delayed test-of-cure. Rectal response bundle performs its
authored endoscopy component locally, with MRI/remaining assessment external.
Source claims recorded in the evidence review, needs_clinician_review. These are
operational prototype routes, not new medical recommendations.

Name milestone implemented: 24 neutral/48 feminine/48 masculine first names and
96 surnames, deterministic exclusion of present actors, frozen saved names.
Parent reviewed runtime diff and passed10 focused tests, then requested stronger
pool-exhaustion and actual-admission tests (worker passed5 name tests).

Economy initial milestone implemented and focused tests passed. Parent review
requested two corrections before acceptance: reserve all valid existing GLP
homes before redistributing overflow on reload, and disable hire UI when all
two-per-suite slots are occupied. First/second NP use existing staff/primary
positions; hires fill the next reachable suite. No room art changes.

Economy/name corrections accepted: parent independently passed domain25 focused,
balance33 and player6. Staff source was already dirty before the late home/station
extension and lacks a pre-edit worker snapshot; reviewed actual source against
earlier inspection, not claimed as a clean HEAD-only diff. One tiny parent
integration fix changed two concurrent phlebotomy care-anchor arguments from
invalid `staff` to the API's `clinician`; underlying work preserved.

Initial browser worker procedure_browser_validation reported execution-time
exhaustion before making any files or starting a server. Reassigned the bounded
browser milestone to Terra test_choice_inventory; no browser evidence claimed yet.

Terra browser attempt reused the known obsolete Level-2 visual helper and failed
before acceptance (disabled hire due unreachable fixture; unconditional reload
seed). It stopped private processes and made no runtime changes. Escalated the
same bounded browser milestone to fresh Sol clinic_expansion_browser_proof,
exclusive new spec ownership. Its operational, one-time fixture passed GLP actual
two-hires/distinct stations/two50 receipts/third-hire disabled/reload exact-once
and generated active names/reload stability. Parent reviewed both screenshots
in `.local-dev/clinic-expansion-browser/screenshots/`. Diagnostic browser pending.

Sol implemented diagnostics against a post-name/economy snapshot. Concurrent
unrelated phlebotomy-selector work was observed and preserved; do not attribute
that work to this milestone.

Parent accepted the diagnostic source diff and reviewed all five browser
screenshots: separate GLP NP stations, varied visible names, actual patient/staff
in ultrasound and X-ray. The final review correction makes persisted operation
phases govern reserved rooms, staff, providers and duration after reload, not just
the timer. Sol added a regression with a deliberately different frozen resource
contract; focused domain66, player preview7 and all three package typechecks pass.

Parent independently passed full player511/82 files, balance39/3 files, domain
617/51 files, all three package typechecks, boundaries and launcher checks, and
an isolated production build. Initial fully parallel domain execution had one
15-second timeout in the long surgery-center batch; isolated4 passed, then the
full domain suite passed with maxWorkers=2. Final domain rerun includes the added
frozen-resource regression. Build retains the existing large-bundle warning.
Final parent domain rerun PASS **618 tests / 51 files**, including the frozen
resource regression; final production build PASS. Sol browser combined suite
PASS5/5 in3.0m. After the final core correction, all three diagnostic browser
scenarios were rerun and PASS3/3 in2.4m. This covers two actual NP hires with
independent clocks and reload, generated names/reload, terminal endoanal US,
contrast swallow and staged breast US before external mammography. Parent
reviewed the spec and all five screenshots. Owned private Vite PID31460 stopped;
parent independently verified no4198 listener and no remaining owned process.

## Completion / next action

Complete locally, 2026-09-28. Reviewable mapping/fee table:
`docs/reviews/clinic-room-test-routing-2026-09-28.md`. Owner playtest with
START_GAME.cmd -> http://127.0.0.1:4173 in the usual persistent profile. Saved
names and already frozen order quotes/contracts are preserved. Existing dirty
work and concurrent seating/phlebotomy changes preserved. No commit, push or
deployment; request "push to GitHub" for an audited checkpoint backup. No further
implementation is queued in this bounded milestone; next work follows owner
playtest findings.
