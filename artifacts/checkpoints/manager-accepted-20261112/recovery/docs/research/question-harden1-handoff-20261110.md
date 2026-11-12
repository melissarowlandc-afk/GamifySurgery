# Harden1 authoring handoff — 2026-11-10

Two executable applications cover the three requested live targets. **The hernia
pair is proposed as one joint type/intervention question**, following the
independent flags3 review's explicit paired-redesign suggestion. Three packet
rows preserve traceability; H1-01 and H1-02 deliberately show the same after
candidate. Count/accept it once. Nothing is parked for missing support. All new
questions, concepts and claims remain `needs_clinician_review`; author review is
not independent PASS or Melissa Rowland clinical sign-off.

The manifest, index, projection, default release, global timing and every
existing clinical source file are untouched. Statistics retain the owner's
minimal, single-skill style. No N3, save/cloud, Supabase, domain, perf/port,
GS-release or Level 5 evidence file was edited. No Git, installs, agents,
network writes, commit, push or deploy. Read-only permitted source checks were
used; no source prose, illustrations, tables or algorithms were saved/adapted.

## Review packet and exact candidates

[Packet](question-harden1-20261110.json) uses the flags before/after shape,
`**KEY:** ` and **key shown first for review only**. Runtime choices shuffle.
[Source ledger](sources-question-harden1-20261110.json) records nine sources,
11 atomic claims, field mappings, rights/authority assessments and limitations.
[Raw lint](../../tools/question-quality/question-harden1-lint-20261110.json),
[scope receipt](../../tools/question-quality/question-harden1-scope-20261110.json),
[validation receipt](question-harden1-validation-20261110.json) and
[file receipt](question-harden1-files-20261110.json) contain the machine checks.

Direct import: `packages/clinical-content/src/question-harden1-20261110.ts`.
View: `QUESTION_HARDEN1_SOURCE_RELEASE` / `harden1-round1`.
There is no barrel export or ship-manifest registration.

| Target | Proposed exact question | Change and deciding observation | Closest competitor / counterfactual |
| --- | --- | --- | --- |
| H1-01, flags3 F3-03-type | `question.groin-hernia.ultrasound-type-and-intervention.v2` (shared with H1-02) | Interpret the sac **neck**, then assess the trapped partial bowel wall. The report states ligament/vein relationships, wall configuration, response to compression and mural Doppler comparison; it never names the type or ischemia before answering. | Correct type with manual reduction. Moving the neck above the ligament/lateral to inferior epigastric vessels changes the anatomical component while exploration remains correct. |
| H1-02, management r12 | Same shared candidate, scored once | Replace immediate classification feedback followed by another simple priority rule with a joint decision. Absent mural signal in the trapped wall, while adjacent bowel has signal at the same settings, raises strangulation concern despite continued intestinal passage. | Manual reduction is credible for selected acute nonreducing hernias without suspected strangulation. A counterfactual **whole assessment without that concern**, rather than detectable Doppler alone, permits the reduction choice. |
| H1-03, flags4 F4-01 | `question.gs028f.nutrition.refeeding-insulin-phosphate-shift.v3.r3` | Interpret paired phosphate/creatinine results before attributing a decline to feeding. The original constructed values yield 50% fractional phosphate excretion during low serum phosphate: a renal-loss component. Three parallel, six-word interpretations retain coherent options. | Expected conservation from anchoring on the feeding history; alternatively assuming a timed collection is required. Changing urine phosphate to 0.2 mg/dL gives 1% and changes the answer to conservation. Neither result proves an exclusive cause. |

Self-checks per row include the cover-key attack, same category/decision stage,
two necessary inferences, nearest credible error, deciding observations,
answer-changing counterfactuals, deletion test, one-best-answer argument and
limits. Predicted difficulty is **moderate for PGY-2/3**, an author judgment,
not measured performance or an independent review result. The owner/tester notes
remain resolved: the learner explicitly identifies the hernia type from the
ultrasound and the phosphate alternatives all answer the same precise task.

The self-check rejected an initial elective-repair hernia competitor as too easy
for an acute nonreducing presentation. The final exploration/reduction choice
uses a current, source-supported competing intervention; no availability,
permission, preference, explanatory option or lead-in safety shortcut is added.
Case titles are neutral. The nutrition visit reviews recorded samples rather
than implying that interpretation replaces treatment of an active electrolyte
problem. There are no diagnostic testing choices or authored wait durations;
the candidate timing entries are `no_test` and remain outside the global registry.

## Meaning, merge proposal and live fallbacks

Both applications materially expand their original scored objectives. New
concept versions:

- `concept.groin-hernia.femoral-defect-repair-priority.v2`: integrated anatomy
  plus intervention for partial-wall bowel threat. It relates to the old
  repair-priority v1 and separately scored classification v1; no history is
  transferred from either.
- `concept.gs028f.nutrition.refeeding-insulin-phosphate-shift.v2`: renal-handling
  interpretation, rather than recalling the insulin/cellular-uptake link. The
  original mechanism remains supported in feedback, but is not silently
  redefined under its existing card.

New preview cases are `case.harden1.groin-wall-threat.20261110` and
`case.harden1.phosphate-handling.20261110`, each one node. The old two-node
hernia case and its feedback remain byte-exact. **Manager decision after
independent review:** whether to accept the proposed two-to-one composition and
new objective versions. No retirement/merge of existing FSRS records, selector
change or fresh-selection withholding has occurred. Future acceptance must bind
the exact source view and preserve old frozen encounters; acceptance/save tests
belong to that later integration step.

Until then, keep these exact live fallbacks:

| Target | Variant | Concept | Case / node |
| --- | --- | --- | --- |
| H1-01 | `question.groin-hernia.ultrasound-type.v1` | `concept.groin-hernia.ultrasound-compartment-classification.v1` | `case.inguinal-hernia.caregiving-strain` / `node.flags3.groin-ultrasound-classification.20261107` |
| H1-02 | `question.inguinal-hernia.symptomatic-elective-repair.v3.r12` | `concept.groin-hernia.femoral-defect-repair-priority.v1` | Same case / `node.inguinal-hernia.caregiving-strain.2` |
| H1-03 | `question.gs028f.nutrition.refeeding-insulin-phosphate-shift.v3.r2` | `concept.gs028f.nutrition.refeeding-insulin-phosphate-shift` | `case.gs028f.nutrition.c1-metabolic-transition` / `node.gs028f.nutrition.c1-metabolic-transition.1` |

## Sources and holds

Seven records received narrow factual/article-specific rights rechecks on
2026-11-10; two feeding records reuse their recorded 2026-10-07 access dates.
Full citations, authors, stable IDs, dates, URLs/DOIs, classes, reuse status,
medical authority and supported claims are in the ledger.

- Hernia anatomy: [Picasso et al., 2021](https://pmc.ncbi.nlm.nih.gov/articles/PMC8008201/).
  Perfusion/deep-ring cross-check: [Wu et al., 2022](https://pmc.ncbi.nlm.nih.gov/articles/PMC9262670/).
- Emergency exploration: [WSES, 2017](https://pmc.ncbi.nlm.nih.gov/articles/PMC5545868/),
  with current [Costantini et al., 2025 EGS workgroup guidance](https://pmc.ncbi.nlm.nih.gov/articles/PMC12188801/)
  for the exploration/reduction boundary. The latter is expert guidance, not a
  universal standard of care. No ND-protected algorithm or figure was adapted.
- Partial-wall threat despite passage: [Smith and Chatzikonstantinou, 2024](https://doi.org/10.1093/jscr/rjae642).
  Its case-based limitation is explicit; no risk estimate is generalized.
- Phosphate fraction: explicit methods in [Bech et al., 2018](https://link.springer.com/article/10.1186/s12882-018-1017-z).
  Pretreatment assessment, conservation and multiple contributors:
  [Megapanou et al., 2025](https://pmc.ncbi.nlm.nih.gov/articles/PMC12226681/).
  The 50%/1% values are independently derived from original constructed data,
  not copied patient measurements or newly invented clinical thresholds.
- Feeding physiology and diagnostic caution: the previously recorded
  Zhang 2023 / AuSPEN 2025 atomic claims and source metadata, reused offline.

**Hold status: none for either candidate.** No key depends on a held fact.
The phosphate source distinguishes general and hypophosphatemia-specific
excretion references; the candidate and counterfactual are remote from both,
so no boundary disagreement decides a key. No exclusive cause, refeeding
diagnostic criterion, dose or management protocol is asserted. Preserved Doppler
signal does not exclude early strangulation; that limitation appears in the
claims and counterfactual. Articles with unverified reuse rights or inaccessible
full facts were not used for a key, including the considered Day 2018 record.

## Lint and validation

Raw assembled lint: **3 before findings across 3 variants / 1 after finding
across 2 unique candidates**; six before and four after canonical/finite profile
contexts. Visible prior feedback is included. No warning is suppressed and no
linter code, threshold or test was changed. The remaining `convergence`
advisory is the explicit complete hernia 2x2: femoral/indirect and
exploration/reduction each occur twice, and all four combinations occur once.
The key has no unique intersection/frequency advantage. Enumeration tests check
that symmetry; independent review still receives the raw warning. Phosphate
has zero findings. A warning-free item alone would not establish difficulty.

Final commands and output:

```text
# From packages/clinical-content
npm.cmd test -- --pool=threads --maxWorkers=2 --reporter=default --reporter=json --outputFile=../../.local-dev/harden1-clinical-final-20261110.json
Test Files  3 failed | 126 passed (129)
Tests       3 failed | 1605 passed (1608)
Duration    205.40s
Exit        1
Harden1 file: 13 passed / 0 failed (included above)

# Repo root
npm.cmd run typecheck
7 workspace typecheck commands passed; exit 0

npm.cmd run clinical:lint:test
tests 33; pass 33; fail 0; cancelled 0; skipped 0; todo 0
exit 0

node tools/question-quality/author-question-harden1-20261110.mjs --check
node tools/question-quality/review-question-harden1-20261110.mjs --check
Both exit 0; 44 protected files unchanged; zero keyed holds
```

The three full-suite failures match the existing failure titles documented in
the flags4 acceptance handoff; they do not come from harden1:

1. `question-flags3-20261107.test.ts` — “leaves every existing protected source
   and decision file byte-exact”: domain `diagnostic-timing.ts` capture mismatch.
2. `question-stats1-20261108.test.ts` — “preserves every protected source/capture
   through the exact authorized standard/test-hook migration”: same mismatch.
3. `question-stats1-acceptance-20261108.test.ts` — “pins each authorized
   existing-source delta before preserving old capture assertions”: cloud
   `codecJson.ts` capture mismatch.

No capture, adapter, assertion, budget or external-lane source was changed to
hide those failures. The earlier full run had 1594 passes / the same three
failures in 128 files. Concurrent N3 work added
`question-new-n3-round4-20261110.test.ts` (11 passes), accounting for the final
129-file/1608-test total; that file was preserved. During authoring, local
type-only errors and a raw-versus-schema-normalized case-hash mismatch were
corrected; the final packet binds the validated source-view cases exactly.

## Preserved release and Level 5 inputs

Default remains **1141 cases / 1452 nodes / 606 registered concepts**.
Default JSON SHA-256:
`db795ec578f8b5bfa77d1260b2e53c5a59f779f51edcba538fd8753bdb3de139`.
Manifest JSON SHA-256 remains:
`0e70c49460b6f93ec6766f6f59ad10eb9e4b0e38d8745283d9fa35818d68c06c`.
The catalog, global timing, captured statistics cases, original three target
nodes and 44 explicit protected files are unchanged. All previously present
top-level clinical TS sources are unchanged; concurrently added N3 files are
outside this lane.

Candidate source-view SHA-256:
`d7b5a4751ac104d5ed6fa26307295bd86faf0a0a37d6cf2de2758d28a3a6c36b`.
Per-case, question, node, retained-source and timing hashes are in each packet
row and the scope receipt. These are review bindings, not ship acceptance.

**Changed Level 5 bound inputs: none.** In particular, `index.ts`,
`synthetic-content.ts` and `answer-choice-timing.ts` remain byte-exact. No new
harden1 module is in the default import graph or the existing explicit Level 5
input map. There is no rebind, pin, evidence or save-format change.

## Files and next action

New clinical files, all in `packages/clinical-content/src/`:

- `question-harden1-20261110.ts`
- `question-harden1-20261110-data.ts`
- `question-harden1-evidence-20261110.ts`
- `question-harden1-retained-input-20261110.ts`
- `question-harden1-20261110.test.ts`

New authoring tools/receipts:

- `tools/question-quality/capture-question-harden1-20261110.mjs`
- `tools/question-quality/fixtures/question-harden1-before-20261110.json`
- `tools/question-quality/question-harden1-spec-20261110.mjs`
- `tools/question-quality/author-question-harden1-20261110.mjs`
- `tools/question-quality/review-question-harden1-20261110.mjs`
- `tools/question-quality/question-harden1-lint-20261110.json`
- `tools/question-quality/question-harden1-scope-20261110.json`

New documents are this handoff, packet, source ledger, validation/file receipts
and `docs/execplans/question-harden1-20261110.md`. The only pre-existing file
edited is an append to `docs/handoffs/CURRENT_THREAD_HANDOFF.md`; preceding bytes
are retained. Local validation logs are under `.local-dev/harden1-*`.

Stop at independent review. Manager decisions remain: review the proposed
joint-node composition/material objective changes, assess actual difficulty and
the unsuppressed balanced-set advisory, then accept exact versions or keep the
listed live fallbacks. The unrelated preservation-guard failures need their
own authorized reconciliation. Nothing ships from this lane; this checkpoint
remains in the local working tree without a GitHub backup by this worker.
