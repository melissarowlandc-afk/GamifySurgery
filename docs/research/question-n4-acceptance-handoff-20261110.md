# N4 eight-item acceptance handoff — 2026-11-10

Eight exact independent PASS versions are accepted as new default-release
draft cases. **All remain `needs_clinician_review`.** The seven round2 returned
items and all other parked/held drafts remain unaccepted. No clinical wording,
option, explanation, evidence claim or authoring file was changed.

The [manager decision](question-n4-manager-decision-20261110.md) lists all eight
exact review/concept/view tuples. The [accepted packet](question-n4-accepted-20261110.json)
shows unchanged before/after fields, explicitly **key shown first for review
only**, and question/case/source hashes. Runtime choices remain randomized.

**Content acceptance is complete; runtime follow-up is still required.** The
one wound-affinity addition and eight exact diagnostic-order bindings below
were not installed because domain runtime belongs to the active worker. The
domain order-inventory assertion correctly remains red; it was not weakened.
No deployment or release integration is claimed.

## Authority, identities and counts

Accepted round1: cholecystectomy neck-plane bailout; colonic wall pattern after
mucosal biopsy; venous ulcer contralateral-pressure trap; incisional pocket
above retained mesh. Accepted round2: ventral mesh material/contact compartment;
unexpected deep mass during lipoma excision; recurrent ulcer bleeding after
clips; cholangiogram lucencies/proximal coverage. Exact IDs are in the decision
and machine-readable packet.

All 137 earlier authority rows,1,423 legacy bindings and four whole-case
relations are unchanged. Eight new header bindings are explicit. Six existing
concept definitions are reused exactly. Two reviewed new meanings are added:

- `concept.n4r2.mesh-material-and-contact-compartment`
- `concept.n4r2.cholangiogram-quality-before-duct-treatment`

No FSRS history is migrated, reset, merged or relabeled. All 1,143 earlier
default cases and 608 registered definitions are exact; the existing catalog
is unchanged. This includes every statistics case, the live hernia r12 pair
and the earlier harden1/N3 acceptances.

| Measure | Before | After |
| --- | ---: | ---: |
| Cases | 1,143 | 1,151 |
| Decision nodes | 1,454 | 1,462 |
| Registered concepts | 608 | 610 |
| Distinct scored meanings | 452 | 454 |
| Accepted manifest rows | 137 | 145 |
| Legacy tuple bindings | 1,423 | 1,423 |
| Whole-case relations | 4 | 4 |
| Timing classifications | 2,287 | 2,295 |

Manifest ID: `question-ship.2026-11-10.v9`.

- Manifest SHA-256: `08614aeff7c4b733c96b9aff7ac3b9774343e6bd2bfd46c520ae96c221056b42`.
- Default SHA-256: `b0e2675e53fb9132f8f8c5b630c34d324d2d97645f40de40f3191a06806fdf48`.
- Previous manifest: `164db3d76d2f380d8ef3035e981dc703f05e2e6cf820a483cdd4dc7660946eaa`.
- Previous default: `01d239ea464a3cbdffd345b107a4035576922a4b143ea57f5c49f0752123ebf4`.

## Exact retained source bindings

| Manifest view | Source release | SHA-256 |
| --- | --- | --- |
| `n4-round1` | `QUESTION_NEW_N4_SOURCE_RELEASE`,21 cases | `6e52115019ab011b59722b68c6cb2ddca7c8f43943a56652327cc87bb2f69782` |
| `n4-round2` | `QUESTION_NEW_N4_ROUND2_SOURCE_RELEASE`,15 cases | `5ee26ba76c9deaa161e423f1419a9030e2886dd4a7c678626b9156a22b5f0c51` |

The modules are self-contained and import no default catalog, so the projector
can bind them directly. The full 35-case authoring catalog stays available for
review/frozen definitions; exactly eight versions are admitted,27 are withheld.
No unaccepted pediatric family binding is registered.

`QUESTION_N4_FROZEN_PRESERVATION` records both raw materialized-case hashes and
the schema-normalized source-case hashes. The objects are deeply equal; JSON
property ordering differs. The immutable intake retains both source and raw
identities; no capture was refreshed to hide the difference. Each accepted
question is byte-equal as serialized to the captured reviewed question, with
the original claim IDs and review status.

No new source lookup or clinical claim was needed. Existing N4 evidence and
source ledgers remain unchanged, including authority, licenses, access dates,
limitations and held dispositions. No accepted key has a source hold. Source
records are in the original `question-new-n4-evidence-20261110.ts` and
`question-new-n4-round2-evidence.ts` modules; no source text was copied.

## Exact domain-worker integration list

The [machine-readable runtime handoff](question-n4-runtime-integration-20261110.json)
contains every accepted case/concept, setting/capability requirement, current
predicate result and all eight diagnostic-choice tuples. None of these runtime
files was edited by this milestone.

### Founder endoscopy affinity — already present

`packages/game-domain/src/founder-consults.ts:endoscopicFindingConcepts` must
retain these two accepted meanings; both are already in the current set:

- `concept.colonic-lipoma.endoscopic-recognition.v3`
- `concept.peptic-ulcer-bleeding.endoscopic-hemostasis-modality.v2`

Do not add the returned polyp-stalk or post-impaction meanings from the authoring
handoff; neither is accepted here.

### Wound affinity — one required addition

`packages/game-domain/src/clinic-consult-topics.ts:woundConcepts`:

- Retain `concept.venous-leg-ulcer.arterial-assessment-before-compression`,
  already recognized for the accepted venous case.
- **Add `concept.superficial-incisional-ssi.open-drain`** for
  `case.n4.incisional-pocket-above-retained-mesh.v1`.

The incision case has an actual APP-source save witness, which is already a
valid route. This does not substitute for the pending dedicated wound route.
Zero ostomy or pediatric topics/family bindings are accepted in this milestone.

### OR intra-op eligibility — no concept allowlist to extend

Current `founder-consults.ts:procedureConsultKind` returns `operation` for a
case with `requiredClinicalSetting: ambulatory_surgery` and no participant,
pediatric profile, result gate or service-request choice. All four accepted OR
cases meet that predicate. `procedureConsultPresentations` uses this setting
classification; there is no hardcoded OR concept-ID set to append to.

The exact accepted meanings that this route must continue to recognize are:

- `concept.gs028g.subtotal-cholecystectomy.safe-bailout`
- `concept.n4r2.mesh-material-and-contact-compartment`
- `concept.soft-tissue-mass.extremity-mri.v2`
- `concept.n4r2.cholangiogram-quality-before-duct-treatment`

Each retains `capability.ambulatory_or`, `capability.staff.or_nurse` and
`capability.periop_recovery`. The existing N4 idle-source reproducer reported an
ordinary unsourced OR fallback. This task proves actual sourced admission, not
a global source-only selection guarantee. Keep source eligibility and the
save/charts-list regression with the domain worker; no manifest/reopen gate or
runtime bypass was added.

### Eight exact diagnostic-order bindings — required

The clinical timing registry already has the eight accepted node classifications
and every testing choice's existing placeholder estimate. Install the eight
exported records in `packages/game-domain/src/test-choice-orders.ts`:

```ts
import {QUESTION_N4_ACCEPTED_TEST_ORDER_RECORDS} from "@gamify-surgery/clinical-content";
// Inside EXACT_TEST_CHOICE_ORDER_RECORDS, preserving all existing entries:
...QUESTION_N4_ACCEPTED_TEST_ORDER_RECORDS,
```

These eight tuples are fully enumerated in the runtime handoff JSON:

| Accepted question suffix | Diagnostic choice suffix(es) | Existing timing profile |
| --- | --- | --- |
| colonic-wall-pattern-after-mucosal-biopsy.v1 | `biopsy` | `timing.test.biopsy` |
| venous-ulcer-contralateral-pressure-trap.v1 | `toe`, `exercise` | `timing.test.vascular_physiology` |
| venous-ulcer-contralateral-pressure-trap.v1 | `cta` | `timing.test.ct_angiography` |
| unexpected-deep-mass-during-lipoma-excision.v2 | `close`, `incise` | `timing.test.biopsy_staging` |
| unexpected-deep-mass-during-lipoma-excision.v2 | `excise` | `timing.test.biopsy` |
| cholangiogram-lucencies-and-proximal-coverage.v1 | `repeat` | `timing.test.radiography` |

Each exact record is `not_executed /future_planned`. Do not order the operation
already in progress, add circular result gates, or relax the inventory test.
The current domain failure first names the venous `toe` key; the full eight-row
binding is required rather than fixing only that first assertion.

## Validation and remaining failures

All Vitest runs use `npm.cmd test -- --pool=threads --maxWorkers=2`. The
[validation receipt](question-n4-validation-20261110.json) stores commands,
local raw-log/JSON paths, exact stdout summaries and every failed test title.

| Run | Exact output | Duration |
| --- | --- | ---: |
| Full clinical-content | 131 files passed /3 failed;1,668 tests passed /3 failed, total 1,671 | 130.36s |
| Full domain | 209 files passed /4 failed;5,259 passed /29 failed /1 skipped, total 5,289 | 573.99s |
| Six focused player files | 5 files passed /1 failed;100 passed /1 failed, total 101 | 45.16s |
| Final N4 source/format3/journal tests | 1 file /9 tests passed | 10.75s |
| Root typecheck | All 7 workspace scripts passed, exit0 | — |
| Cue-linter tests | 33 passed /0 failed, exit0 | — |

All eight accepted variants have **zero raw cue findings**, with zero
suppression. Two exact PASS keys have tiny raw-character length residuals:
venous45 versus 42 and deep-mass67 versus 65. The strict legacy character-count
test pins these two exact reviewed versions, measured lengths and whole-case
hashes. No wording is changed, broad allowance introduced or linter threshold
relaxed.

The nine new player tests use real care sources, actual default definitions
with a finite selection pool, the full 610-concept registry, actual codec and
journal replay. They check format3 reopen/completion, exact frozen choices,
source-actor identity and linkage, all diagnostic previews and idempotent
scoring. For six reused meanings, the seeded earlier review uses an actual
older default question ID. The two new meanings use explicit fictional prior
same-meaning reviews. No timing/family/topic overlay or unsourced procedure
admission is used. Earlier H1/flags4/ship frozen-save and flagFreeze tests pass
in the combined player run.

Player tests use the existing `adversarial-r5-player-preload-20261102.cjs` only
for Vite's optional Windows drive-mapping probe. No assertion, timeout, codec
budget or gameplay behavior is replaced. Seven workspace typechecks cover
workbench client/server, player, balance-config, authoring, clinical-content,
research and domain. Linter execution disables only the Node warning banner.

Full suites remain red:

- **Clinical 3:** flags3 and stats1 source guards identify the existing
  `app-appointments.ts` mismatch; stats1 acceptance identifies the existing
  cloud `codecJson.ts` mismatch. A pre-edit targeted run had216 pass /3 fail;
  failed file/title/first-line expected and received hashes match the final
  three failures exactly. Neither runtime file nor old capture was changed.
- **Domain 26:** one Level 5 input-binding failure and 25 historical-load hashes
  (levels0–4 ×schemas5–9). Current binding first identifies balance
  `employee-training.ts`; this task adds the three input changes listed below.
  No evidence/pin/test/rebind output was changed.
- **Domain 1:** the old approved-concept assertion expects 587 versus actual 610.
  Twenty-one omissions predate this milestone; the two newly admitted N4r2
  meanings must also be included by its fixture owner. New clinical acceptance
  tests independently pin all 608 old meanings plus the exact two additions.
- **Domain 1:** the unchanged historical N2 author-stage patient-supply test
  times out at its existing10,000ms budget. No selector, historical pool or
  time budget was edited here; timing cause is not declared resolved.
- **Domain 1, N4 integration:** `test-choice-order-inventory.test.ts` correctly
  fails until the eight runtime bindings above are installed. This is a known
  deferred dependency, not a pre-existing failure attributed to another lane.
- **Player 1:** separateCampaign's retired-encounter fixture exceeds the existing
  JSON codec string limit. Cloud implementation and budgets remain untouched.

## Level 5 bound inputs changed

Exact intersection with `tools/qa/level-five-integration-results-20261012.json`:

| Bound input | Before SHA-256 | After SHA-256 |
| --- | --- | --- |
| `packages/clinical-content/src/synthetic-content.ts` | `d1db6c1d311f08b0030cd2e9694860f70663add57317b73b82a369f87f1a85ff` | `5fffcaa36446800168f2c3362cff2c357f7726a9f4cc44afdb065f804ec630dd` |
| `packages/clinical-content/src/index.ts` | `000dfad4b8f836b66c7e81cdcf409d5fb7f46e2bc1751f44e67313dce3281043` | `9b9217631c612cf22b5237808d4eedf0b065472d165190bfbcec2b691921ae5b` |
| `packages/clinical-content/src/answer-choice-timing.ts` | `d8d58233291b8b31ad52f950ed31e924f914284b6d89565cdb23f394054ad565` | `2c6af289ba8b2d47d79390d40eaae53fe412fcb1dff638c8019aeee2661eae36` |

All three were already different from the evidence's recorded hashes before
intake. Those older recorded hashes are separately retained in the scope
receipt; the entire prior mismatch is not attributed to N4.

New runtime dependency: `question-n4-accepted-20261110.ts`. The unchanged N4
source/materializer/reference/evidence modules now referenced by the barrel are
enumerated with exact hashes in
`tools/question-quality/question-n4-acceptance-scope-20261110.json`. The manifest
also changes but is absent from that older bound-input map. **No game-domain
runtime file, session view model, Level 5 evidence or release-tree file was
edited.** The domain worker will add its own input delta when installing the
required bindings/affinity.

## Files and handoff

The [file receipt](question-n4-files-20261110.json) lists every owned path and
raw hash. Ten existing files changed, all in clinical-content: manifest,
synthetic source integration, index, timing, timing test, prior H1 epoch helper,
prior H1 acceptance/draft tests, manifest test and strict length test. The new
accepted module, exact N4 epoch/test, player save witness, immutable intake /
migration/checking tools and research/plan receipts are separately listed.

Historical-test adapters validate the entire eight-case/two-concept/authority/
timing delta before restoring the old epoch. Every original capture remains
unchanged; unknown content/source drift still fails. Original N4 authoring and
review files are exact. The shared handoff only appends.

The capture and integration tools were one-shot operations: **do not rerun or
refresh their preimages**. The acceptance review tool supports `--check`; other
recorders reread completed outputs and do not rerun tests.

Next action: manager hands the exact runtime list to the domain worker, resolves
the order-inventory dependency and remaining source/evidence/fixture issues,
and coordinates any release. No further question acceptance is made here.
This checkpoint remains working-tree only. No Git, install, network, agent,
commit, push, deploy or rebind occurred. A later explicit **"push to GitHub"**
request is required for a manager-owned backup.
