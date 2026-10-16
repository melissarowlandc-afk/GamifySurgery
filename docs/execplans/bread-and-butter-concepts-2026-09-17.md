# Twenty bread-and-butter early-level concepts

## Goal and authority

The owner requests another twenty new concept groups for the first three facility
levels, emphasizing common general surgery decisions relevant to ABSITE. Continue
GS-006, with autonomous editorial approval and implementation. Clinical records
remain needs_clinician_review in the explicitly unapproved prototype.

## State and constraints

Baseline is 163 concepts / 398 cases / 623 nodes after the completed brief September
17 batch. Preserve that uncommitted work, all historical content and unrelated
graphics, facility and persistence changes. No commit, push, deployment, dependency
installation or owner-save access. Canonical launch stays unchanged.

Use a separate 2026-09-17-bread-and-butter batch directory and unique IDs. Four
variants per concept, brief named-patient presentations with coherent age/sex and
character, 1–5-word chief complaints and short complete prompts. Prefer useful
testing/result pathways, without unnecessary tests or delaying urgent transfer.
Every testing alternative has a central runtime estimate; these remain gameplay
placeholders. Treat facility level, educational complexity and acuity separately.

Prioritize explicit common SCORE topics, public ABSITE scope and current permitted
clinical sources. Do not imply exact exam frequency. Read the owner's current
concept sheet as a candidate source only; independently verify clinical facts.
Store original atomic claims and bibliographic metadata, not source prose/PDFs.

## Milestones and ownership

- [x] Terra: read-only actual-bank inventory and nonduplicate common-topic options.
- [x] Root: live sheet read, curriculum verification and 20-objective roster contract.
- [x] Sol: bounded authoring with provenance in the separate batch directory.
- [x] Terra: additive registry/services/timing integration.
- [x] Workers: meaningful clinical, full case-flow and rendered-view regression tests.
- [x] Root: actual content/diff review, historical preservation, full suites/build,
  exact editorial receipt and handoff.

Normally one production writer. Workers preserve shared edits and do not spawn,
change plans, commit/push/deploy or install dependencies. Independent test-only
ownership may be split explicitly after production is frozen. Root retains final
clinical framing, editorial acceptance and integration review.

## Acceptance and next action

Exactly twenty new scored concepts / eighty question variants with verified
nonduplication, permitted source support and earliest stages 0–2. Verify actual
result gates, save/FSRS identity, all testing-option estimates and generated patient
consistency. Deep-compare previous concepts/cases to an immutable baseline.
Run affected full suites, workspace typechecks, boundaries and isolated build;
preserve canonical owner server. Record all counts and source hashes, then remind
the owner to say "push to GitHub" for this local checkpoint. Keep GS-006 open.

Progress: immutable baseline captured at .local-dev/bread-butter-baseline-20260917.json.
Root reviewed actual nearby objectives and recorded the roster in
bread-and-butter-source-contract-2026-09-17.md. Expected batch 52 cases / 80 nodes,
28 multistep encounters, 16 diagnostic gates. Sol owns initial six-concept authoring;
another Sol worker independently verifies remaining source details. Root replaced
an unsupported Nightingale CC-license assertion with verified BAPEN society guidance.
Terra is mapping additive integration seams. No registry integration yet.

First authoring milestone accepted after root source/content review and direct
module inspection: six concepts, 24 questions, 12 paired cases, 12 gates and 48
profiles. Presentations are 27–35 words. Sol passed clinical typecheck and semantic
checks; root caught and worker fixed diagnostic timing, tissue-test wording and
outside-surgery setting issues. Dedicated bedside bladder scan remains to integrate.
Sol now owns the next eight concepts in four separate family files. Supplemental
source audit replaced unsupported anatomy references and corrected the CHEST DOI;
final source-access notes are being checked before final six-concept authoring.

Second milestone passed worker checks: eight concepts / 32 questions / 28 cases /
four ultrasound gates. Root directly verified cumulative 40 cases / 56 nodes /
16 gates, presentations 23–35 words. Independent Sol audit identified missing
prior-image comparison for fibroadenoma, one ambiguous watery-output story,
overbroad preference-language support and provenance metadata corrections.
Author is addressing these and final six same-visit paired concepts. Root reviewed
their initial drafts and requested parallel duration-only VTE answer choices.

Complete authoring accepted after corrections: 20 concepts / 80 questions /
52 cases / 80 nodes / 16 diagnostic gates / 208 profiles / 23 sources / 22 claims.
Root independently confirmed these counts and stages (28 / 20 / 4 cases at 0/1/2).
Source and wording corrections are applied. Sol released production ownership.
Terra now owns additive aggregate/registry/timing/balance integration. With authored
content frozen, a separate Sol worker owns only the new domain flow test file;
this explicit test-only split does not overlap production writes.

Integration accepted after root rejected and Terra replaced the initial dynamic
export discovery with explicit typed spreads. Root inspected the actual diff
against pre-integration shared-file snapshots: only additive batch assembly plus
one bedside service/profile. Root independently deep-compared all 163 prior
concepts and 398 prior cases, unchanged; integrated counts are 183 / 450 / 703.
New presentation words 23–40 (median 32), complaints 2–3, prompts 5–9.
Root passed dependency/launcher boundaries and isolated Vite production build in
.local-dev/bread-butter-20260917-build. Canonical serving directory untouched.
Terra owns clinical/player tests and historical count/allowlist updates; Sol owns
the separate new full reducer-flow test. Production ownership is released.

Next action: inspect new tests, complete full suites/typechecks, then exact receipt
and handoffs. Do not confuse editorial approval with named clinician sign-off.

## Discovered runtime correction

The new domain flow tests exposed a real bedside routing bug: acknowledging a
scan with no simulated room travel was treated as offsite travel, extending the
five-tick action to roughly 42 ticks. Root inspected configurePendingResultTiming
and ensureLegacyOffsiteTravel. Sol now owns a narrow explicit optional
patientRemainsOnsite route marker, frozen in PendingResult and preserved through
save normalization; both offsite fallbacks must respect it. Old routes retain
their existing behavior. Do not use route-name heuristics or fake room travel.
Sol owns balance schema/config/tests, domain reducer/types/persistence and its
new flow test; Terra remains test-only on clinical/player/count files. Rerun build
after this necessary runtime correction. Canonical server and saves untouched.


Final review progress: root inspected the stationary-route implementation and
all new test files. Full clinical (360), player (445), balance (15) suites pass;
all seven typechecks, boundaries and post-fix isolated production build pass.
Root repeated historical deep equality and confirmed 183/450/703 totals.
Initial concurrent domain run had 464 passes and two failures: an old 15-second
flow-test timeout under load and a stale diagnostic patient-supply snapshot.
Terra updated only that deterministic snapshot; root reviewed the exact metrics
(79 completed arrivals, zero walkouts/unresolved, continued day-six-to-eight
supply). A full two-worker domain rerun is the remaining acceptance step.
Receipt draft exists with final validation explicitly pending. No push/deploy.


Completed: reduced-concurrency domain suite passes all 466 tests (41 files).
Total full affected-suite acceptance: 1,286 tests. All seven typechecks, boundaries,
isolated final build and historical deep equality passed. Versioned receipt pins
20 IDs and 12 LF-normalized SHA256 content fingerprints. Handoffs updated;
GS-006 stays open. All implementation milestones delegated; root performed
planning, source/content/diff review, independent acceptance and documentation.
Next action belongs to owner: local playtest or explicit scoped GitHub backup.
No commit, push, public release, canonical-server rebuild or save changes.
