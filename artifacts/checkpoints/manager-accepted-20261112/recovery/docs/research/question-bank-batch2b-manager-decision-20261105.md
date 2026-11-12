# Batch 2b manager decision — November 5, 2026

Authority: manager direction in this thread following
question-bank-batch2b-review2-20261104.json: eighteen PASS, twenty-two REVISE,
zero FAIL. **Accept sixteen exact variants. Keep B2B32/F13 live because their
unresolved source holds affect the keys. Keep all twenty-two REVISE items at
their current live versions; no 2b round three.** The rejected/held drafts stay
in their retained source view as backlog. Editorial acceptance changes no
clinical review status. Melissa Rowland remains clinical sign-off; all accepted
AI drafts remain needs_clinician_review under the existing unapproved label.

## Accepted exact rows

Each row has sourceView batch2b-round2 and this document as its decision path.
Sixteen separate case/header bindings are in the marked BATCH2B REVIEW2 blocks
of question-ship-manifest.ts. Existing N2 rows and all other bytes were preserved
at insertion. B2B06/B2B10 are the exact earlier PASS versions retained by the
round-two view, not newly rewritten versions.

| Acceptance | Question variant | Concept |
|---|---|---|
| B2B01 | `question.postlaparoscopy.benign-referred-shoulder-pain.v2.r6` | `concept.postlaparoscopy.shoulder-pain-biliary-localization.v2` |
| B2B02 | `question.immunology.preformed-antibody-hyperacute-rejection.v1.r6` | `concept.transplant.class-ii-crossmatch-target-and-window.v1` |
| B2B06 | `question.differentiated-thyroid-cancer.preoperative-nodal-ultrasound.v4.r5` | `concept.dtc.representative-node-target-and-assay.v1` |
| B2B08 | `question.breast-cancer-after-neoadjuvant-therapy.breast-conservation-selection.v2.r2` | `concept.breast.inflammatory-phenotype-after-neoadjuvant-response.v1` |
| B2B09 | `question.acute-mesenteric-ischemia.peritonitis-exploration.v3.r2` | `concept.mesenteric-ischaemia.post-revascularization-bowel-staging.v1` |
| B2B10 | `question.breast-cancer-after-neoadjuvant-therapy.response-mapping.v2.r1` | `concept.breast-cancer-after-neoadjuvant-therapy.response-mapping` |
| B2B17 | `question.dialysis-access.clinical-dysfunction-referral.v4.r2` | `concept.dialysis-access.symptomatic-central-outflow-assessment.v1` |
| B2B21 | `question.postoperative-delirium.multicomponent-prevention-plan.v4.r2` | `concept.postoperative-delirium.benzodiazepine-withdrawal-exception.v1` |
| B2B23 | `question.acute-pancreatitis.mild-biliary-chole-before-discharge.v3.r2` | `concept.biliary-pancreatitis.local-complication-before-cholecystectomy.v1` |
| B2B24 | `question.breast-cancer-after-neoadjuvant-therapy.response-mapping.v1.r2` | `concept.breast-cancer-after-neoadjuvant-therapy.response-mapping` |
| B2B25 | `question.cholecystitis.fit-patient-index-admission-cholecystectomy.v2.r2` | `concept.cholecystectomy.subtotal-type-from-remnant-tissue.v1` |
| B2B30 | `question.hyperkalaemia.severe-community-result-transfer.v4.r2` | `concept.diabetic-ketoacidosis.ongoing-insulin-substrate.v1` |
| B2B33 | `question.metabolic-acidosis.albumin-corrected-anion-gap.v2.r2` | `concept.acid-base.euglycaemic-risk-with-mixed-gas.v1` |
| B2B39 | `question.perianal-abscess.prompt-drainage.v2.r2` | `concept.anorectal-fistula.tract-and-transplant-host-plan.v1` |
| B2B40 | `question.perianal-abscess.prompt-drainage.v3.r2` | `concept.anorectal-fistula.function-before-low-tract-division.v1` |
| B2B42 | `question.preoperative-nutrition.oral-enteral-first-line.v2.r2` | `concept.nutrition.gastric-versus-postpyloric-delivery.v1` |

## Conditional source-hold dispositions

- **B2B32: hold on key; not accepted.** The numeric albumin-correction aid,
  unit relation and reference comparison are the discriminator leading to the
  keyed etiologic tests. The prior recorded claim explicitly excludes verified
  arithmetic. No recorded adequate direct check resolves that extension, and
  this lane has no network authorization. Removing the aid would withhold the
  reviewed decision criterion rather than repair provenance. Keep
  'question.metabolic-acidosis.albumin-corrected-anion-gap.v1'. Claim:
  claim.qbp2b.r2.gap-calculation-aid; original limitation:
  claim.gs028d.acidosis.corrected-gap. No item, threshold, formula or source
  record is edited or claimed freshly verified.
- **F13: hold on key; not accepted.** The awake gas-exchange exception and
  ranked arterial-gas request are the answer, not a non-deciding medicine-list
  detail. Existing sleep-screening claims and the reduced-bicarbonate acidosis
  claim do not establish that raised-total-CO2 investigation comparison.
  Keep 'question.preoperative-osa.validated-risk-screening.v4'. Claims:
  claim.qbp2b.r2.osa-awake-gas-exchange and
  claim.gs028d.acidosis.blood-gas. No detail is removed to simulate resolution,
  and no new source verification or clinical approval is inferred from PASS.

These classifications follow the existing source ledger
sources-question-bank-batch2b-round2-20261104.json and its atomic limitations.
No source page, excerpt, proprietary material or clinical value was retrieved.

## Backlog and exact live fallbacks

| Item | Disposition | Retained live variant | Parked draft |
|---|---|---|---|
| B2B03 | revise_backlog_keep_live | `question.cirrhosis-perioperative-risk.multifactor-assessment.v3` | `question.cirrhosis-perioperative-risk.multifactor-assessment.v3.r6` |
| B2B04 | revise_backlog_keep_live | `question.lymphangitis.heel-inguinal.v1` | `question.lymphangitis.heel-inguinal.v1.r6` |
| B2B07 | revise_backlog_keep_live | `question.statistics-ethics.capacity-refusal.v3` | `question.statistics-ethics.capacity-refusal.v3.r2` |
| B2B11 | revise_backlog_keep_live | `question.cholecystitis.fit-patient-index-admission-cholecystectomy.v4` | `question.cholecystitis.fit-patient-index-admission-cholecystectomy.v4.r2` |
| B2B12 | revise_backlog_keep_live | `question.mondor-disease.management.supportive-care.v1.p2e.confidentiality.v4` | `question.mondor-disease.management.supportive-care.v1.p2e.confidentiality.v4.r2` |
| B2B13 | revise_backlog_keep_live | `question.pathologic-nipple-discharge.diagnostic-imaging.v4` | `question.pathologic-nipple-discharge.diagnostic-imaging.v4.r2` |
| B2B14 | revise_backlog_keep_live | `question.appendicitis.stable-adult-ct.v4` | `question.appendicitis.stable-adult-ct.v4.r2` |
| B2B15 | revise_backlog_keep_live | `question.cirrhosis-perioperative-risk.decompensation-optimization-boundary.v1` | `question.cirrhosis-perioperative-risk.decompensation-optimization-boundary.v1.r2` |
| B2B16 | revise_backlog_keep_live | `question.cirrhosis-perioperative-risk.decompensation-optimization-boundary.v2` | `question.cirrhosis-perioperative-risk.decompensation-optimization-boundary.v2.r2` |
| B2B18 | revise_backlog_keep_live | `question.hyperkalaemia.severe-community-result-transfer.v3` | `question.hyperkalaemia.severe-community-result-transfer.v3.r2` |
| B2B19 | revise_backlog_keep_live | `question.palpable-breast.negative-mammogram-targeted-us.v4` | `question.palpable-breast.negative-mammogram-targeted-us.v4.r2` |
| B2B20 | revise_backlog_keep_live | `question.perianal-abscess.prompt-drainage.v4` | `question.perianal-abscess.prompt-drainage.v4.r2` |
| B2B22 | revise_backlog_keep_live | `question.acute-mesenteric-ischemia.peritonitis-exploration.v2` | `question.acute-mesenteric-ischemia.peritonitis-exploration.v2.r2` |
| B2B26 | revise_backlog_keep_live | `question.cholecystitis.hida-after-equivocal-ultrasound.v3` | `question.cholecystitis.hida-after-equivocal-ultrasound.v3.r2` |
| B2B29 | revise_backlog_keep_live | `question.hyperkalaemia.severe-community-result-transfer.v2` | `question.hyperkalaemia.severe-community-result-transfer.v2.r2` |
| B2B31 | revise_backlog_keep_live | `question.immunology.preformed-antibody-hyperacute-rejection.v4` | `question.immunology.preformed-antibody-hyperacute-rejection.v4.r2` |
| B2B34 | revise_backlog_keep_live | `question.metabolic-acidosis.albumin-corrected-anion-gap.v3` | `question.metabolic-acidosis.albumin-corrected-anion-gap.v3.r2` |
| B2B35 | revise_backlog_keep_live | `question.metabolic-acidosis.confirm-with-blood-gas.v3` | `question.metabolic-acidosis.confirm-with-blood-gas.v3.r2` |
| B2B36 | revise_backlog_keep_live | `question.palpable-breast.negative-mammogram-targeted-us.v1` | `question.palpable-breast.negative-mammogram-targeted-us.v1.r2` |
| B2B37 | revise_backlog_keep_live | `question.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging.v1` | `question.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging.v1.r2` |
| B2B38 | revise_backlog_keep_live | `question.perianal-abscess.prompt-drainage.v1` | `question.perianal-abscess.prompt-drainage.v1.r2` |
| B2B41 | revise_backlog_keep_live | `question.preoperative-nutrition.nutritional-risk-screening.v2` | `question.preoperative-nutrition.nutritional-risk-screening.v2.r2` |
| B2B32 | source_held_pass_keep_live | `question.metabolic-acidosis.albumin-corrected-anion-gap.v1` | `question.metabolic-acidosis.albumin-corrected-anion-gap.v1.r2` |
| F13 | source_held_pass_keep_live | `question.preoperative-osa.validated-risk-screening.v4` | `question.preoperative-osa.validated-risk-screening.v4.r5` |

**G03 correction:** B2B36 is REVISE, so the palpable-breast owner flag is not
resolved by an accepted rewrite. Re-queue G03 for the flags2 revision round after
that independent review. The frozen flags2 packet's authorship skip is not a
clinical or pipeline PASS. No flags2 source, packet, tool or prior handoff is
edited in this milestone. B2B36's live v1 remains unchanged.

## Composed preview and history compatibility

[question-bank-batch2b-composed-preview-20261105.json](question-bank-batch2b-composed-preview-20261105.json)
shows all sixteen affected cases and seventeen composed nodes, including
canonical/profile headers, accepted/fallback identities, exhibits, tasks, keys,
feedback and returned gates. Key first is review-only; runtime randomization
is unchanged. The existing accepted-concept helper appends only the accepted
new meanings; all historical concepts remain available for saved FSRS histories.
No source version, old question/choice order, service/timing archive, encounter
object or save format is overwritten.

The one mixed case is B2B24's paired breast encounter. Its accepted first node
and header come from the reviewed view; the second node and imaging gate remain
exactly the pre-acceptance live definitions. The localization map, same quadrant,
noninflammatory presentation and returned localized disease remain coherent.
**Sequence limitation:** the accepted first update already establishes breast
conservation, and the old follow-up repeats that plan. It is coherent but
rehearsed/easy; this acceptance does not claim the legacy follow-up passed the
resident-difficulty rubric. Queue a separately versioned improvement, while
preserving the current fallback as directed. No unaccepted neighboring draft is
imported through the new header.

## Authorized digest reconciliation

Exactly **three scalar entries in two capture files** were changed, matching
.local-dev/question-ship-gate-narrowing-20261105/rewrite-test-digest-followup.json:

1. Original 2b capture: game-domain/tests/question-bank-batch2a-round2-bindings.test.ts.
2. Round-two 2b capture: clinical-content/src/question-bank-batch2a-round3-20261104.test.ts.
3. Round-two 2b capture: game-domain/tests/question-bank-batch2a-round2-bindings.test.ts.

The current test-file hashes were checked against the manager-authorized receipt
before replacement. Every other capture byte/key, protected clinical/source/
packet/image digest and test assertion remains unchanged. Full old/new paths,
hashes and capture hashes are in batch2b-acceptance-changes-20261105.json under
tools/question-quality. No assertion was removed or broadened to hide a failure.

## Validation and handoff status

Acceptance/source/fallback controls pass. Final native results, scoped files and
remaining shared-tree integration are recorded below. No domain/player full
run is requested. No Git, install, network, agents, external message, deployment,
save/session/cloud/Supabase or Level 5 evidence/pin/rebind change is performed.

## Final validation and scoped handoff

The full shared-tree suite is **not green**. Every scoped acceptance/digest/composed control passes. Exact native
results (all Vitest commands use --pool=threads --maxWorkers=2):

| Check | Test files | Tests | Native exit |
|---|---|---|---|
| Final focused manifest, original 2b, round-two 2b, acceptance and narrative | 5/5 passed | 91/91 passed | 0 |
| Both exact 2b domain binding files | 2/2 passed | 6/6 passed | 0 |
| Clinical-content typecheck | n/a | passed | 0 |
| Final full clinical-content | 113 passed / 1 failed (114) | 1170 passed / 1 failed (1171) | 1 |

Initial full run: 1169 passed / 2 failed (1171) in
114 files. One failure was introduced by newly exposing the
accepted B2B01 header's grammatical phrase "is reviewed" to the old finite verb
checker. The repair adds exactly that phrase to STORY_CUE; the reviewed content
and every patient/task/multi-patient assertion remain unchanged. The final
focused narrative test and the final full narrative test pass.

The shared timing test still expects 2130 archived rows after 40 question.n3.* rows were appended by the concurrent content lane (2170 actual). No live 2b timing tuple is missing or mismatched. Leave N3 timing/count integration to its owner; no count assertion changed here.
The exact original and round-two digest guards now pass. Only three scalar
entries in two captures changed; the reversal test proves every other byte is
retained. There was no assertion removal, timeout extension or fallback-content
rewrite. Focused timing checks pass for each accepted exact question tuple.

Logs and machine receipts are in tools/question-quality under the
batch2b-acceptance-*20261105 names. The validation JSON records exact commands,
file/test counts, durations, native exits and logs; the scope JSON records
concurrent hash changes separately from this worker's file list. The manifest
still has 61 acceptances, including the existing 14 N2 rows, and
1136 live cases / 1449 live nodes. Its other bytes were retained at
insertion and remain byte-exact after stripping this lane's two marked blocks.
All nine captured flags2 source/test/packet/handoff/ledger/fixture files retain
their hashes. No frozen flags2 review artifact is regenerated or amended.

### Files written in this milestone

- packages/clinical-content/src/question-ship-manifest.ts
- packages/clinical-content/src/question-ship-manifest.test.ts
- packages/clinical-content/src/playable-patient-narrative.test.ts
- tools/question-quality/fixtures/question-bank-batch2b-before-20261104.json
- tools/question-quality/fixtures/question-bank-batch2b-round2-before-20261104.json
- packages/clinical-content/src/question-bank-batch2b-acceptance-20261105.test.ts
- docs/execplans/question-bank-batch2b-acceptance-20261105.md
- docs/research/question-bank-batch2b-manager-decision-20261105.md
- docs/research/question-bank-batch2b-composed-preview-20261105.json
- tools/question-quality/capture-batch2b-acceptance-20261105.mjs
- tools/question-quality/integrate-batch2b-acceptance-20261105.mjs
- tools/question-quality/review-batch2b-acceptance-20261105.mjs
- tools/question-quality/finalize-batch2b-acceptance-20261105.mjs
- tools/question-quality/fixtures/batch2b-acceptance-before-20261105.json
- tools/question-quality/batch2b-acceptance-changes-20261105.json
- tools/question-quality/batch2b-acceptance-controls-20261105.json
- tools/question-quality/batch2b-acceptance-scope-20261105.json
- tools/question-quality/batch2b-acceptance-validation-20261105.json
- tools/question-quality/batch2b-acceptance-focused-20261105.log
- tools/question-quality/batch2b-acceptance-typecheck-20261105.log
- tools/question-quality/batch2b-acceptance-clinical-full-20261105.log
- tools/question-quality/batch2b-acceptance-focused-final-20261105.log
- tools/question-quality/batch2b-acceptance-typecheck-final-20261105.log
- tools/question-quality/batch2b-acceptance-bindings-20261105.log
- tools/question-quality/batch2b-acceptance-clinical-full-final-20261105.log
- docs/handoffs/CURRENT_THREAD_HANDOFF.md

### Level 5 and remaining decisions

The only runtime/Level-5-bound input changed by this lane is
packages/clinical-content/src/question-ship-manifest.ts. Intake SHA-256:
e5b6fd29e3ba38f1f0ba99fb75e522d052a0e31410b1527984e2620d02a3d6f8; current SHA-256:
f5cfb705808dc9c83e9ae3b708d3bac17eb19371bff134daca7bbd36d8dd1e0b.
The other edits are tests, capture metadata, offline tools and documents.
No Level 5 evidence, pin, checkpoint, save format, frozen encounter, selector,
route, service, timing/order definition, cloud/session, Supabase or deployment
was changed by this worker. Shared-tree changes from other lanes have separate
ownership and are not included in this lane's Level 5 list. The manager owns any
release-tree evidence/input rebind.

Open: source verification for B2B32/F13 before any later acceptance; G03 rewrite
after flags2 review; a separately versioned B2B24 follow-up to remove rehearsal;
the parked 22 REVISE drafts remain backlog with no 2b round three. Melissa
Rowland remains the clinical sign-off and all accepted rewrites remain
needs_clinician_review. Nothing is deployed, published, committed or pushed.
This checkpoint is local only; the manager owns acceptance and the separately
authorized "push to GitHub" backup checkpoint.
