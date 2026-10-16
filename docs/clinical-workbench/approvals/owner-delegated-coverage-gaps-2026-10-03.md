# GS-028 October 3 coverage-driven batch: editorial receipt

Version `development-batch.2026-10-03.coverage-gaps.1`. The owner requested an
audit of already authored subject ratios followed by twenty new concept groups
from underrepresented or absent subjects. Editorial acceptance is complete for
the local unapproved owner/development prototype. This receipt grants no clinical
approval: all 20 concepts, 80 questions, 78 case reviews, 21 claims and 17 sources
remain `needs_clinician_review`, without named clinician sign-off.

## Coverage and scope

The [coverage audit](../audits/gs028-subject-coverage-2026-10-03.md) explains the
manual exact-ID classification and retains all 44 before/after ratios in JSON.
The principal baseline is 271 active scored concepts. Another 41 exported
nonactive authored identifiers were checked for overlap. Their combined 312
identifiers are not proof of 312 clinically distinct meanings: legacy pilot
records can overlap active objectives. No keyword fallback or default category
was used. Organ-specific workup and cancer remain in organ subjects; secondary
tags and 15 ambiguous assignments preserve crosscutting meanings.

| Primary subject | Active before | Added | Active after |
| --- | ---: | ---: | ---: |
| Surgical Critical Care | 0 | 2 | 2 |
| Trauma | 4 | 4 | 8 |
| Thoracic | 0 | 4 | 4 |
| Fluids/Electrolytes/Acid-Base | 2 | 4 | 6 |
| Vascular Access | 0 | 2 | 2 |
| Anesthesia | 0 | 2 | 2 |
| Geriatric/End-of-Life | 0 | 2 | 2 |

The [source contract](../../execplans/gs028-coverage-gaps-source-contract-2026-10-03.md)
lists all twenty stable IDs and exact clinical/source boundaries. Content spans
ARDS mechanism and predicted-body-weight ventilation; blunt cardiac injury,
anticoagulated head injury and binder anatomy; lung screening, primary
pneumothorax preferences and pleural decisions; acid-base assessment and
hyperkalaemia; access maturation/dysfunction; OSA/MH planning; frailty/delirium.
Four substantive variants per objective yield 80 questions/nodes in 78 encounters:
76 single-node encounters and two paired access-ultrasound pathways. There are
312 unique case profiles and 320 question-profile references, with paired nodes
sharing patient identity. All twenty objectives have independent beginning
access, including at least two standalone cases each.

Generated names, constrained age/sex and matching existing characters are used.
Brief complaints and complete prompts support separated presentation/questions.
Answers shuffle; parallel options and plausible distractors were manually
reviewed. Thirty-one initial key-length cues were repaired without deleting
essential clinical qualifiers. All 68 prospective testing choices, including
distractors and external plans, have neutral centralized placeholder timing.
Historical blood-gas-report interpretation correctly remains `no_test`.

Clinic urgency, education tier and facility progression remain separate.
Hospital topics use stable outside-record discussions or appropriate acute
referral. No outpatient delay, clinic ICU/anesthesia/telemetry/chest drainage,
access surgery, invented drug protocol or new capability was created. Pediatric
gaps retain their real future facility and appearance constraints.

## Evidence and owner input

The live Google sheet was refreshed read-only October 3 through row 168,
including I:M guidance, with an empty checked tail through 1000: 167 candidates.
No sheet write or raw private export occurred. Current linked official ABSITE
and qualifying-exam outlines retain their January 2021 update labels. Categories
are editorial inferences about curriculum scope, not official mappings of
repository IDs or individual-topic frequency. Historical public SCORE 2025–26
verification remains historical; no new 2026–27 claim or blocked-download retry.

Seventeen complete bibliographic records support 21 original atomic claims with
bidirectional mappings. Primary checks include ESICM 2023, EAST 2012 and an
independent 2023 BCI review, CDC adult mTBI guidance, WSES 2017, French 2019
acid-base guidance, UKKA July 2026 hyperkalaemia and 2025 vascular access,
SASM 2016, JSA 2026/EMHG 2018, Lavezzo 2025/PriME 2020, ESAIC 2024 delirium,
USPSTF 2021, ERS/EACTS/ESTS 2024 and BTS 2023. Production metadata records full
authors, titles, DOI/official URLs, rights, authority, access dates and limitations.

Single-guideline, older-evidence, consensus and low-certainty limits are retained.
UK potassium thresholds and USPSTF eligibility are explicitly scoped frameworks.
July 2026 calcium evidence is grade 2C; no mortality benefit or dose was asserted.
Primary pneumothorax recurrence-prevention discussion is conditional and preference
dependent. Pleural-infection cases retain infection, nonpurulent aspirate,
low-pH and safely accessible fluid context. Frailty assessment is scoped to
elective major abdominal surgery and does not mandate ICU admission or cancellation.

Independent review rejected the EAES/SAGES 2024 study-reporting statement as a
clinical assessment mandate. Licensed Lavezzo 2025 and PriME 2020 replaced it.
CPOC/BGS extraction restrictions, SCCM automated-collection restrictions and other
excluded rights limitations are documented in the source contract. No proprietary
textbooks, paid banks, recalled questions, private SCORE modules, copied source
prose, excerpts, tables, algorithms or questionnaires were stored or adapted.
Medical authority and reuse permission remain separate.

## Runtime preservation and measured supply

The active runtime is 291 concepts/856 encounters/1,135 nodes. Subtracting this
batch preserves the prior 271/778/1,055 records by exact deep equality.
Protected baseline raw and normalized SHA-256:
`71fda28a84c9557916d24838395f71c0f1c711a2cc7f1a8e3dcec533c36a90c2`.
Final normalized runtime SHA-256:
`bed6d41e73d29a8fb54eb107dd224e2087fbb412ea53c197566afc15a15e8abf`.
The runtime hash uses `JSON.stringify(value, null, 2) + newline`.
Final dated-package fingerprint:
`d1bd883bfe96bbf518a37b9e8353fe128d7ce921519aa1ad2aa6dde6ebfbb047`,
using sorted relative `path:SHA-256(raw bytes)` lines joined with LF.

| Same ordinary-patient fixture | Eligible cases before → after | Objectives before → after |
| --- | --- | --- |
| Beginning/internal stage 0 | 433 → 511 | 121 → 141 |
| Stage-1 clinic | 668 → 746 | 227 → 247 |
| Stage-1 reachable ultrasound/technician | 668 → 746 | 227 → 247 |

Independent audit exercises each new standalone objective for unseen and due
selection, due priority, all-future exhaustion and unresolved-encounter exclusion.
No existing learning card, frozen encounter, arrival cadence, earning rate or
facility price was reset or changed. Increased content supply does not establish
when a particular campaign can afford Endoscopy.

Nineteen exact testing records cover two real outsourced ultrasound gates,
13 external-only tests and four unsupported specialist plans. Integration testing
identified a legacy onsite-equivalence assumption and route leakage in previews.
The new specialist gate records explicitly prohibit onsite substitution; old
equivalences retain their default behavior. Exact `not_executed` plans show
central neutral timing with no operational route or clinic reservation.

## Validation and ownership

Authoring checks passed 21/21; independent Sol editorial review passed 11/11;
Astra inspected actual content/source files and repeated both checks. Independent
final audit passed 1/1 and was repeated by Astra. Its full 44-subject ratios,
fingerprints, draft statuses, profile identity and actual supply measurements
were inspected and retained in the durable audit.

The new reducer suite passes 343/343, independently repeated by Astra after the
final route-control assertions. It executes every correct and all three wrong
choices at every node, FSRS/XP/replay, strict outsourced routing even when the
same fixture can execute in-house ultrasound, busy/missing resources, pending
reload/return, neutral external previews with available-service controls, old
exact-record compatibility and all old save cards/frozen encounters. The final
focused acceptance set passes 360/360 across four files. The earlier broader
focused set passed 471 tests; overlapping counts are not added together.

All eight TypeScript projects, dependency boundaries (2,508 paths), launcher
contract and isolated production build pass. The build transforms 479 modules;
the existing large-chunk warning is retained. Final asset `index-DzLiqXYs.js`
SHA-256: `6a11101acaa2bc2d7a78f62315fd1eacc9e6cf68941c9a2a98f9601b92ee1bd5`.
The sole incidental shared type repair adds an explicit `entrance` guard to a
branch whose path was already empty when no entrance existed; it preserves the
current care-routing work.

Final Playwright passes 3/3 against the refreshed build. Actual timed-distractor
correction, outsourced ultrasound wait, reload/due-time preservation, returned
Existing Patients action marker and second question/referral complete. Urgent
hyperkalaemia creates no clinic service/queue; frailty, OSA and LDCT render
named age/sex-consistent patients, shuffled choices and appropriate timing.
Astra inspected actual screenshots and logs. Owned preview PID 54148 was stopped;
port 4321 is closed, with canonical 4173/4174 servers untouched.

The 12:40 shared broad snapshot is **not fully green**: 2,706/2,717 tests pass across
222/228 files. Eleven failures in six files concern care-room return completion,
patient-alert movement, endoscopy/service departure, return delivery and frozen
travel-speed expectations. They overlap the active `GS-031 — Facility interaction
and reachability…` task's saved-route/care-access work. No broad pass is claimed
and no test was skipped or weakened. Oct3 authoring/admission/supply and Oct2
paired-ultrasound tests pass in that final run. Current care-routing changes are
preserved for their owning task rather than being rewritten in this content batch.
The exact failure log is `.local-dev/gs028-20261003/broad-vitest.log`; independent
read-only comparison documents the boundary. This local content acceptance does
not grant a whole-game release approval.

Concurrent GS031 repairs continued after that snapshot. At the same 12:49
worktree state, independent Sol ran five legacy route suites both with the
current release and with all twenty Oct3 concepts/78 cases removed. Both runs
produced exactly 279/280 passing tests and the same legacy patient-alert failure.
The static Oct3 policy records cannot match those legacy exact identities.
Most earlier service-return failures had already cleared. A diagnostic showed
the remaining fixture closes its chart before the patient moves from the chosen
waiting chair; a null zero-distance movement is appropriate. The tracked assertion
and a stable whole-suite rerun remain with GS031. These controlled subset results
do not establish a full broad pass. Astra inspected the actual isolation setup,
diagnostic and findings; no production or legacy test was changed by that audit.

Sol workers authored the first six and remaining fourteen objectives, corrected
source/authoring issues, performed independent manual review and investigated
shared test failures read-only. Terra workers audited the exported inventory,
implemented admission and route corrections, measured final supply and completed
browser proof. All qualifying implementation milestones were delegated; Astra
retained architecture, source cross-checks, actual diff/log/image review,
acceptance and documentation. Substantive repairs to concurrently owned GS031
pathing were withheld because overlapping active ownership makes them unsafe to
split into this content batch; they remain with that task.

Actual workers and bounded milestones:

- `oct3_coverage_audit` (Terra): baseline/inventory corrections and browser proof.
- `oct3_reference_roster` (Sol): required references, remaining fourteen objectives
  and final narrative wording repair.
- `oct2_urgent_authoring` (Sol): first six objectives, permitted source escalation
  and read-only legacy-routing isolation.
- `oct3_semantic_coverage` (Sol): exact 271-ID mapping and independent 80-question review.
- `stats_ethics_browser_closeout` (Terra): runtime admission, timing/route policy,
  343-test reducer suite and technical validation.
- `oct2_release_audit` (Terra): independent final fingerprints, preservation,
  supply and all 44 before/after subject ratios.

No commit, push, merge, deployment or public release is authorized by this batch.
The normal owner pathway remains `START_GAME.cmd` → `http://127.0.0.1:4173` in
the usual persistent profile. Disposable browser proof at port 4321 has separate
storage; private Tailscale and GitHub Pages origins also have separate saves.
This is a local checkpoint. Say **"push to GitHub"** for an audited backup.
GS-028 stays open for future batches.
