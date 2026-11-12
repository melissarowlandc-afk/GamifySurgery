# N4 partial checkpoint — 2026-11-10

N4 is **incomplete**. This checkpoint contains 21 provisional executable
candidates, three drafts parked after manual self-check and ten unwritten
source/clinical-decision tasks. Nothing is registered by default or accepted
into the ship manifest. All new clinical versions remain
`needs_clinician_review`; Melissa Rowland remains clinical sign-off.

The key-first, review-only packet is
[question-new-n4-20261110.json](question-new-n4-20261110.json). Its SHA-256 is
`884d476865e298884e0cf6da246cb30087f4bc68506f777e1514eb78a9a47b2c`.
Do not interpret the author's construction checks as independent PASS verdicts.

## Supply authored and remaining

| Group | Requested | Raw drafts | Provisional candidates | Manual parks | Unwritten tasks |
| --- | ---: | ---: | ---: | ---: | ---: |
| Intra-op | ~12 | 6 | 6 | 0 | 6 |
| Intra-endoscopy | ~8 | 8 | 7 | 1 | 0 |
| Wound/ostomy | ~8 | 8 | 6 | 2 | 0 |
| Pediatric | ~6 if useful gaps | 2 | 2 | 0 | 4 |
| Total | ~34 | 24 | 21 | 3 | 10 |

The 21 candidates represent 19 meanings: 18 existing meanings with unchanged
concept definitions and one new meaning,
`concept.n4.ostomy-obstruction-after-surface-reduction`. They must not be
reported as 21 fresh FSRS concepts. Existing concept IDs and histories remain
attached to their meanings. Eleven candidates are Level 3 and ten are Level 4.

The six intra-op decisions cover unresolved gallbladder-neck anatomy, anterior
versus posterior abdominal-wall closure, mesh material after a controlled
enterotomy, melanoma staging before reconstruction, an unexpected deep mass
during a planned superficial excision, and the axillary consequence of the
actual gland operation for DCIS. They are current-phase decisions, not orders
for the operation already under way. Some intended ambulatory topics, notably
groin repair, lumpectomy specimen confirmation and anorectal technique, remain
unwritten rather than receive an unsupported technical key.

The seven endoscopy candidates cover ulcer hemostasis, recurrent bleeding,
interpreting a colonic wall lesion, two polypectomy contexts, esophageal biopsy
territory and adult celiac sampling. Their finite presentations vary age and
sex instead of reusing the published female/43 profile. The six wound/ostomy
candidates cover pouch contact injury, superficial junction separation,
output-related laboratory assessment, arterial assessment before compression,
persistent obstruction after surface prolapse reduction, and superficial
incisional drainage over retained mesh.

The existing twenty pediatric cases cover ten meanings with two variants each:
groin referral, midline hernia recognition, reassuring and concerning neck
nodes, acquired ascent, true retractile surveillance, symptomatic pectus,
carinatum bracing, limited pilonidal care and developmental assent. N4 adds two
application variants, not two new meanings. Four broader pediatric proposals
remain source holds; adult facts were not silently extrapolated to children.

## Executable draft boundary

Import the standalone
`packages/clinical-content/src/question-new-n4-20261110.ts` module explicitly:

- `QUESTION_NEW_N4_SOURCE_RELEASE`: 21 provisional candidates.
- `QUESTION_NEW_N4_CATALOG_RELEASE`: all 24 drafts, including manual parks.
- `QUESTION_NEW_N4_TIMING_ENTRIES`: 21 exact candidate timing rows.
- `QUESTION_NEW_N4_CANDIDATE_TEST_ORDER_RECORDS`: 20 exact diagnostic-choice
  bindings, marked `not_executed`/future-planned.
- `QUESTION_NEW_N4_FAMILY_BINDINGS`: two exact candidate case/profile/child/
  parent/art rows using the existing child art contracts.

These exports install no global timing, family, catalog or acceptance rows.
There is no import from the default clinical-content barrel back into the
standalone module. Every case is strict-schema validated, routine-eligible,
single-node and shuffled at runtime. Procedure cases have no participant,
pediatric profile, service request or result gate. Current operative phase is
in the actual presentation/exhibit and review metadata; no schema field was
invented. Testing choices use existing placeholder timing profiles; authored
prose contains no fixed waits.

OR cases use `ambulatory_surgery` and the existing OR/nurse/recovery
capabilities. Endoscopy cases use `endoscopy` and endoscopy/recovery
capabilities. Wound/ostomy cases use `clinic`, Level 4 and
`capability.wound_ostomy_clinic`. Pediatric cases use the existing Level 4
clinic, pediatric capability and parent/profile contract, with no enacted tests.
Tier, acuity and facility stage remain separate fields.

## Domain integration findings — manager/domain lane

The founder-consult handoff was read. No runtime module was edited.

The disposable preview exercises thirteen actual existing service-source
flows: six OR, three endoscopy, two wound/ostomy and two pediatric. Each keeps
the source actor's identity and appearance, holds the source phase until answer,
terminal acknowledgement and chart close, then releases it. Each frozen
encounter reopens and scores under the default projection, preserving its
earlier FSRS review and appending the new review. The observed key positions
include 0, 1 and 2. There is no circular order for the current procedure.

The preview temporarily installs the candidate timing and family rows only
inside its disposable Node process and restores them in `finally`. Those
overlays are still present during the frozen-state reopen check. This is a
domain-state preview, **not** a full player format-3 save/journal compatibility
test or proof of reopening without the family overlay.

Eight other candidates are blocked by the current editorial affinity lists.
Room capabilities alone do not add these seven unique meanings to the lists:

| Runtime list | Candidate primary concept IDs |
| --- | --- |
| `endoscopicFindingConcepts` in `founder-consults.ts` | `concept.variety3.small-polyp-cold-snare-selection` (two cases); `concept.n3.dysphagia-biopsy-territory-after-negative-endoscopy`; `concept.n1r2.celiac-confirmation-specimen-provenance` |
| Ostomy affinity in `clinic-consult-topics.ts` | `concept.gs028g.peristomal-skin.restore-seal`; `concept.gs028g.mucocutaneous-separation.superficial-care`; `concept.n4.ostomy-obstruction-after-surface-reduction` |
| Wound affinity in `clinic-consult-topics.ts` | `concept.superficial-incisional-ssi.open-drain` |

Exact case/concept/list mappings are in the packet's `integration` section.
Only independently reviewed and manager-accepted versions should receive those
domain additions and the staged family/timing/order bindings.

**A separate source-selection defect must be resolved before live integration.**
The ordinary fallback can admit the N4 cholecystectomy case with zero initial or
final service operations and `consult: null`. The reproduced encounter is
`encounter.auto.3.0`. Clinical-setting/capability tags do not make the case
source-only. The probe did not reproduce an unsourced endoscopy admission, so
the confirmed observation is limited to OR.

```text
node --disable-warning=ExperimentalWarning tools/question-new-n4/idle-source-probe.mjs
```

The receipt is
`.local-dev/question-new-n4-20261110/idle-source-probe.json`. The domain owner
must resolve ordinary fallback selection for current-procedure cases. Preserve
frozen encounters and saves; this finding does not justify manifest enforcement,
a concept-set corruption check or a fail-closed reopen rule. Inserting nodes
into already-frozen question-triggered procedure charts is also outside N4.

## Evidence and construction checks

The draft pool carries 73 inherited atomic claims and 53 source records
representing 46 distinct publications. Source aliases are not counted as
independent corroboration. Recorded facts, limits, authority assessments,
rights metadata and original access/check dates are retained byte-for-byte in
the provenance mapping. New N4 claim records are unapproved aliases with clear
basis IDs. There were zero source retrievals, zero new atomic facts and zero
advanced verification dates. No proprietary source corpus was used.

The earlier task explicitly said “No Git, installs or network.” The N4 brief
omits network, and an early clarification request remains unanswered. I kept
that restriction while completing the independent offline work. The ten
unwritten tasks need targeted verification of permitted guidance or the one
specific clinical decision below; existing narrow claims do not establish the
missing operative rules. `tools/question-new-n4/pending.mjs` and the packet list
the precise evidence needed for every slot. No placeholder source or unverified
clinical key was emitted for them.

Each provisional candidate records, separately: raw finding interpretation,
consequential decision, closest plausible competitor, deciding observation,
ablation, a counterfactual tied to an offered choice, cue attack, decision-stage
audit and remaining clinical/construction risk. Difficulty is intended and
unmeasured. The automated linter reports **zero findings across 21 variants and
42 finite-profile contexts**. It was not weakened or suppressed.

Manual self-check excluded three drafts from the candidate stage:

- `barrett-pathology-reclassification-before-treatment`: label-to-surveillance
  recall and a weak resection competitor.
- `ileostomy-water-replacement-after-repletion`: oral-rehydration recall; the
  supplied diary did not change the deciding action.
- `hernia-contour-leak-versus-new-skin-product`: the standing leak directly
  matched the only standing-fit choice, with weak competing actions.

They remain only in the explicit draft catalog, with the failed rubric reason.
No independent PASS, manager acceptance or clinical approval is claimed.

## Owner approvals needed

One concrete clinical decision is held, with no executable candidate or proposed
accepted key:

> The proposed case is a woman with an anterior fistula crossing the lowest
> external sphincter, old obstetric sphincter damage, fecal leakage and no
> undrained abscess. Should the initial key be a loose seton with later
> sphincter-preserving repair, or another named operation?

The other remaining slots are writer/source-verification work, not additional
clinical questions for Melissa. Existing N3 holds and accepted versions were
not changed.

## Validation

Commands used the thread pool with two workers. Exact logs and the machine
receipt are under `.local-dev/question-new-n4-20261110/`.

| Check | Exact result |
| --- | --- |
| Pre-edit full clinical-content | 128 files passed, 3 failed (131); 1,618 tests passed, 3 failed (1,621); 204.30 s; exit 1 |
| Final full clinical-content | 129 files passed, 3 failed (132); 1,646 tests passed, 3 failed (1,649); 118.00 s; exit 1 |
| Focused N4 | 1 file passed; 28/28 tests passed; 5.08 s; exit 0 |
| Root typecheck | All seven workspaces passed; exit 0 |
| Question-quality lint tests | 33 passed, 0 failed; 2050.5956 ms; exit 0 |
| N4 candidate lint | 21 variants, 42 contexts, 0 findings |
| Actual-source preview | 13 flows passed; 8 cases blocked by unchanged affinity lists; exit 0 |

```text
npm.cmd run test --workspace @gamify-surgery/clinical-content -- --pool=threads --maxWorkers=2
npm.cmd run test --workspace @gamify-surgery/clinical-content -- src/question-new-n4-20261110.test.ts --pool=threads --maxWorkers=2
npm.cmd run typecheck
npm.cmd run clinical:lint:test
node --disable-warning=ExperimentalWarning tools/question-new-n4/preview.mjs
node --disable-warning=ExperimentalWarning tools/question-new-n4/review.mjs
node tools/question-new-n4/validate.mjs
```

All three final full-suite failures have the same file, assertion and hash
before any N4 authoring:

| Failing test file | Protected input / mismatch, before and after |
| --- | --- |
| `question-flags3-20261107.test.ts` — leaves every existing protected source and decision file byte-exact | `packages/game-domain/src/app-appointments.ts`: expected `9053ef12e1024cdb87865de85d190bb9dc649976d927b345039f278e67dc0f1e`, received `72e1168893dfdcb4f2dc0c0a9a598340f1f59f3a76c8f2098d78218912713dac` |
| `question-stats1-20261108.test.ts` — preserves every protected source/capture through the exact authorized standard/test-hook migration | Same `app-appointments.ts` mismatch |
| `question-stats1-acceptance-20261108.test.ts` — pins each authorized existing-source delta before preserving old capture assertions | `apps/player/src/session/cloud/codecJson.ts`: expected `d490196e1988db2f39fc66df0589b768fd10930803afcbc568265e1910ceaf3d`, received `0994becd5f0022d2489de303987a6bb6a4c590fb45aea958a0856dcac4267c7a` |

The final run adds exactly the 28 passing N4 tests. No old assertion, budget,
timeout, pin or runtime module was edited. A transient intervening run also
reported an unowned player save-test postimage conflict; it is absent from the
final run and is not counted as a final failure. Historical logs are retained.

## Files and preservation

New clinical files: `question-new-n4-types.ts`, `question-new-n4-materialize.ts`,
the four group files (`intra-op`, `endoscopy`, `wound-ostomy`, `pediatric`),
`question-new-n4-evidence-20261110.ts`, `question-new-n4-reference-bindings.ts`,
`question-new-n4-self-check-parks.ts`, `question-new-n4-20261110.ts` and
`question-new-n4-20261110.test.ts`, all under `packages/clinical-content/src/`.

New tools under `tools/question-new-n4/`: `items.mjs`, `build-evidence.mjs`,
`preview.mjs`, `pending.mjs`, `idle-source-probe.mjs`, `review.mjs` and
`validate.mjs`. The plan, this handoff and packet are the three new documents.
CURRENT_THREAD_HANDOFF.md receives an append using `fs.appendFileSync`; its
entire initial text remains intact. Another lane normalized older LF sections
to CRLF before this append; those line endings and later appends are retained,
rather than restoring the intake copy. The local intake, logs, previews and
`validation.json` are audit receipts.

All 560 pre-existing clinical-content source files remain byte-exact. Intake
comparison observed concurrent changes in `pediatric-family.ts`, `reducer.ts`,
`retail-operations.ts`, the founder-consult handoff and
`tools/question-quality/fixtures/question-harden1-n3r4-acceptance-source-migration-20261110.json`;
this lane did not edit them. **Level 5 bound-input changes by N4: none.** In particular, no default
index, synthetic release, timing registry, choice-order registry, manifest or
evidence/pin/checkpoint was edited. No Git command, network retrieval, agent,
installation, commit, push or deploy occurred. This checkpoint exists locally.
There is no change to the owner's playtest opening pathway or saves.

Next action: resolve targeted public-source access for the ten unwritten slots,
then finish authoring and review rather than declaring N4 complete. The manager
can independently review the 21 provisional candidates now; source-only and
affinity integration remain explicit domain-lane follow-ups before shipping.
