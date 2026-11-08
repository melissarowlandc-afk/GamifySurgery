# Flags4 handoff — 2026-11-08

**F4-01 is resolved in a draft candidate; nothing is parked or accepted.**
The exact live v3 remains selected. The candidate, clinical applications and
case review remain `needs_clinician_review`, with no clinician review recorded.
Melissa Rowland remains the named clinical sign-off. Stop for independent
review and manager acceptance; no ship-manifest row was added.

## Owner note and revision

| Flag / exact live fallback | Owner note | Candidate and response |
| --- | --- | --- |
| F4-01 / `question.gs028f.nutrition.refeeding-insulin-phosphate-shift.v3` | “Answer choices don't make sense” | `question.gs028f.nutrition.refeeding-insulin-phosphate-shift.v3.r1`: asks which physiological process links carbohydrate reintroduction to the observed phosphate decline. Three options compare cellular uptake, urinary excretion and intestinal absorption. All are five-word, parallel phosphate-handling processes. |

The old question's repeated catabolic/anabolic permutations and pre-answer
“cellular building processes” interpretation are removed from the candidate.
The short presentation identifies Maya Chen, a 31-year-old woman, after poor
intake and a nutrition restart; the update reports the phosphate fall once.
Insulin and the anabolic transition appear in post-answer feedback. There is
no supplied diagnosis, alternative-cause exclusion list, numeric threshold,
feeding rate, waiting-time prose or availability cue. The intestinal distractor
does not equate poor intake with malabsorption.

[Review packet](question-flags4-20261108.json): exact captured before/after
fields, **key shown first for review only**, rationale pairs, explanation,
inference, focus, owner-note response, manual rubric, raw lint, complete visible
history, fallback, source status and exact frozen-content hashes. Executable
choices have `shuffleAnswers: true`; three options and one key. Every wrong
choice has its matching terminal feedback, with `no_terminal_outcome` preserved.

## Evidence and holds

[Source ledger](sources-question-flags4-20261108.json) contains **two existing
source records, three unchanged basis claims and three new atomic applications**,
with field mappings and complete bibliography, source authority, rights/reuse
status, intended use and claim IDs. Hold status: **none**; no held key.

- `source.gs028f.zhang_refeeding2023` — [Zhang et al., Frontiers in Nutrition,
  2023](https://doi.org/10.3389/fnut.2023.1083483): recorded carbohydrate/insulin/
  intracellular-phosphate and catabolic-to-anabolic background physiology.
  This is the **single direct mechanism source**, an observational neurocritical
  cohort's background discussion, not an independent guideline cross-check.
  Its risk model, thresholds, incidence and management are not imported.
- `source.gs028f.auspen_refeeding2025` — [Matthews-Rensch et al., Nutrition &
  Dietetics, 2025](https://doi.org/10.1111/1747-0080.70003): recorded caution that
  low phosphate does not establish refeeding syndrome by itself. Used for that
  boundary only, without importing diagnostic criteria or a feeding protocol.

This milestone reused recorded atomic synthesis **offline**. Actual source
access and basis last-check dates remain **2026-10-07**. New November 8 dates
identify application review, not external source verification or refreshed
currentness. No source text, excerpt, figure, table or algorithm was fetched or
stored. The patient course is a finite fictional qualitative observation, not
an empirical rate, diagnostic definition or assertion of the exclusive cause.
Distractors are alternative process hypotheses; the item asserts no renal or
intestinal disease and introduces no criteria for those diagnoses.

## Lint and author rubric

`question-cue-lint.2026-11-04.v8`: **1 finding before → 0 after**, with zero
suppression. The original finding is near-duplicate options. Before: one node,
five canonical/finite-profile contexts. After: one node, two contexts (canonical
plus the one named preview profile). See the [raw report](../../tools/question-quality/question-flags4-lint-20261108.json).

The manual check covers hiding the key, same stage/category, interpretation of
the feeding chronology, redistribution versus loss/reduced entry, a closest
credible error, counterfactual, deletion test and one supported answer. The task
asks for the feeding-linked mechanism, **not** a diagnosis from an isolated
phosphate result. Explicit source uncertainty remains a limitation, not a
device for increasing difficulty.

Residual: this narrow physiology objective is likely foundational/easy to
moderate for a prepared PGY-2/3 resident. It is not labelled accepted basic,
independently passed, clinically approved or measured hard. Independent review
should assess distractor plausibility and actual difficulty. Unsupported
excretion/absorption criteria were not invented to make it harder.

## Candidate integration and preservation

Direct import:
`packages/clinical-content/src/question-flags4-20261108.ts`,
`QUESTION_FLAGS4_SOURCE_RELEASE` / **`flags4-round1`**.
No barrel or default import. The retained source contains the exact original
single-node case and timing. The candidate keeps its case/node/stable concept
identity with a new question version and presentation identity. Its preview
uses the original canonical 31-year-old female demographics/vitals and one
consistent named profile. The four original live profiles remain untouched.

`concept.gs028f.nutrition.refeeding-insulin-phosphate-shift` already includes
carbohydrate-associated insulin and cellular phosphate uptake, so meaning is
unchanged: **no new concept, FSRS migration or archive rewrite**. The separate
owner-approved v2.r2 and all unrelated versions remain byte-exact. There is
one `no_test` timing tuple and no candidate testing orders. No save format,
frozen encounter, selector, runtime gate or domain behavior changed.

The [scope receipt](../../tools/question-quality/question-flags4-scope-20261108.json)
verifies **1,327 captured existing source/decision paths unchanged**, including
the ship manifest, clinical default assembly, existing source tools, domain and
balance source. It deliberately excludes the concurrently active cloud lane.
The existing shared handoff prefix is preserved and only an entry is appended.

Default remains **1,141 cases / 1,452 nodes / 606 registered meanings**, with
**133 accepted manifest rows**. SHA-256 values are of `JSON.stringify`:

| Bound object | Unchanged/current SHA-256 |
| --- | --- |
| Live default | `1ab9a80611a3f4e09629b4f49f6e7b49fedb93a8102475620450417dfdca4813` |
| Ship manifest | `8b3ec2e429e0c4b170c1a0170456b5b6e4e54f3be5582e80576d45aadc193c77` |
| Global timing registry | `937dd59c71ca96e38e5b41002b6dda9fb5846d915302ab2e774a17ed48bc80ac` |
| Catalog | `3e0d1bb346abc1579e5c24400565c36c158d90304b60171b24b6a88f64b2ed40` |
| New candidate source view | `c74ad1bafc355076c4483c60e919b740aaed9ebaa17c02f909a053519ac4b4d9` |

**Changed existing Level 5 bound inputs: none.** The four new runtime-source
files are direct-import candidates only. Acceptance may later require explicit
integration/binding, owned by the manager. No evidence, pin or rebind edited.

## Validation

All final required native exit codes are **0**. Exact output and log hashes:
[validation receipt](question-flags4-validation-20261108.json). Logs:
`.local-dev/question-flags4-20261108/`.

| Directory / command | Final output |
| --- | --- |
| `packages/clinical-content`: `npm.cmd test -- --pool=threads` | **126 files passed; 1,576 tests passed; 0 failed; 41.03 s** |
| Repository root: `npm.cmd run typecheck` | **All seven workspace typechecks passed** |
| Repository root: `npm.cmd run clinical:lint:test` | **33 passed, 0 failed; 3,287.6033 ms** |

The full clinical result includes all **10 new flags4 tests**: candidate-only
admission, exact retained case, unchanged other-case object identities, drift
rejection, stable concept/scoring/branch/timing coherence, packet-to-runtime
hashes, source/claim resolution and raw lint accounting. Author regeneration
and packet regeneration `--check` pass. No assertion, timeout or budget was
weakened. The initial focused command did not start because a relative log path
was wrong; it was corrected before validation. No domain/player-suite result is
claimed or required for this candidate-only milestone.

## Files and next action

Full new-file hashes: [file receipt](question-flags4-files-20261108.json).

New clinical files:

- `packages/clinical-content/src/question-flags4-20261108.ts`
- `packages/clinical-content/src/question-flags4-20261108-data.ts`
- `packages/clinical-content/src/question-flags4-evidence-20261108.ts`
- `packages/clinical-content/src/question-flags4-retained-input-20261108.ts`
- `packages/clinical-content/src/question-flags4-20261108.test.ts`

New tools and generated artifacts:

- `tools/question-quality/capture-question-flags4-20261108.mjs`
- `tools/question-quality/question-flags4-spec-20261108.mjs`
- `tools/question-quality/author-question-flags4-20261108.mjs`
- `tools/question-quality/review-question-flags4-20261108.mjs`
- `tools/question-quality/record-question-flags4-validation-20261108.mjs`
- `tools/question-quality/fixtures/question-flags4-before-20261108.json`
- `tools/question-quality/question-flags4-lint-20261108.json`
- `tools/question-quality/question-flags4-scope-20261108.json`

New documents: this handoff, review packet, source ledger, validation receipt,
file receipt and `docs/execplans/question-flags4-20261108.md`. The only existing
document edit is an additive `docs/handoffs/CURRENT_THREAD_HANDOFF.md` entry.
No authoring-standard change was needed for this already-covered owner rule.

Open risks: independent clinical/difficulty review and the single-source
mechanism limitation. Manager owns acceptance and later integration. No Git,
commit/push, install, network, agent, external message, deploy, cloud/Supabase
or release-tree operation occurred. Work is local only; manager owns any
separately authorized GitHub backup (owner phrase: **“push to GitHub”**).
No playtest origin, profile or save-opening pathway changed. Stop here.
