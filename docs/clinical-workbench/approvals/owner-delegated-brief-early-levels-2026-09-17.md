# September 17 brief early-level concept batch

## Authority and status

Owner delegated creation, editorial approval and implementation of twenty more
concept groups for the first three facility levels, emphasizing brief questions.
Roster, factual source contracts, authored wording and runtime implementation are
editorially accepted. All required validation passed. No named clinician approval is asserted.
All new clinical records retain needs_clinician_review and null clinician sign-off
inside the explicitly unapproved prototype.

## Scope

Ten families, two scored objectives each, four variants per objective: adrenal
mass, mammary Paget disease, inflammatory breast cancer, AAA, fecal incontinence,
nonbleeding H. pylori ulcer, mild uncomplicated diverticulitis, thyroglossal duct
cyst, external full-thickness rectal prolapse and eosinophilic esophagitis.
Use concise complaints, actual named patients with coherent age/sex, short complete
prompts, parallel choices and central estimates for every testing option.

No existing concepts were selected again under new patient names. Exact objective
comparison used the actual143-concept release. Closely related existing objectives
and exclusions are documented in the
[source contract](../../execplans/brief-early-levels-source-contract-2026-09-17.md).

## Curriculum and source boundaries

Public SCORE *General Surgery Curriculum Outline2025–2026*, verified September17:
[official PDF](https://absprodeus2scorestor.blob.core.windows.net/score/curriculumoutline_gs.pdf).
27physical pages, SHA256
`2b98112b218e0b612fe6ea2f8ad5cf7c6f4555d79289c2f569234aa6b5748c09`.

| Family | Public curriculum mapping | Physical page |
| --- | --- | --- |
| Adrenal mass | Incidental adrenal mass | 11 |
| Mammary Paget | Paget disease | 10 |
| Inflammatory breast cancer | Invasive breast carcinoma; subtype application | 10 |
| AAA | Aortic aneurysms and aneurysm repair | 15–16 |
| Fecal incontinence | Fecal incontinence | 9 |
| H. pylori ulcer | Peptic ulcer disease | 7 |
| Mild diverticulitis | Diverticulitis | 8 |
| Thyroglossal cyst | Thyroglossal duct cyst excision | 19 |
| Rectal prolapse | Rectal prolapse | 9 |
| EoE | Inferred esophageal evaluation/stricture-care application; not separately named | 6 |

The outline does not establish individual exam frequency. Clinical decisions have
separate primary/society source support, including ACG's July2026 diverticulitis
guidance. No proprietary exam material or SCORE modules were used. No source text,
tables or downloaded PDFs enter the committed content; only original factual
synthesis and metadata with source-specific reuse limits.

## Final acceptance evidence

Root independently verified 20 added concepts, 48 cases, 80 decision nodes,
32 diagnostic-result gates and 192 approved patient profiles. The full prototype
now contains 163 concepts, 398 cases and 623 nodes. The pre-existing 143 concepts,
350 cases and 543 nodes remain deeply equal to the pre-edit runtime snapshot.

The new cases enter at internal stages 0/1/2 in counts 4/32/12, respectively.
Chief complaints contain 2–3 words; authored presentations contain 27–44 words
(median 33), and prompts contain 5–8 words. These counts treat each runtime name
placeholder as one word; actual names may add a word. No correct answer is uniquely
longest among its four choices by word count. All choices remain shuffled at runtime.

Sol performed source research and authored the ten families. After a model-capacity
error, Terra completed the bounded corrections and integration, and Sol returned to
implement complete gameplay-flow tests. Terra also audited provenance for nine
families and added player/clinical regression checks. Root reviewed all ten families,
the remaining source record, actual corrections and additive shared-file changes,
and added a small receipt/provenance assertion correction during final review.

## Validation and limitations

Root independently ran the full affected suites: clinical content 357/357,
game domain 394/394, player 444/444 and balance 13/13: **1,208 passing tests**.
All seven workspace typechecks, runtime dependency boundaries, launcher contract
and isolated production build passed. Build output is under the ignored
`.local-dev/sept17-build`; the canonical game server and owner saves were untouched.
Existing bundle-size and plugin-timing build advisories remain.

The domain tests execute all 48 cases at their earliest authored stage, withhold
all 32 gated results until ready, finish both steps and record one FSRS review per
node. They also cover an incorrect answer followed by the corrected plan, pending
result save/reload, frozen identity/choice-order preservation and completion after
delivery. Player tests inspect all 80 current-node view models, including correct
and incorrect test choices, mixed non-test labels and actual generated patient
age/sex/character compatibility. Clinical checks cover all 192 authored profiles,
four variants per concept, provenance, review status, concise wording and the
exact receipt bindings below. No new visual-browser acceptance is claimed.

Twelve centralized timing profiles and five explicit off-site diagnostic services
support the new content. Existing imaging and other service contracts are preserved.
Durations remain tunable game-time placeholders. Future design remains tracked in
`docs/features/diagnostic-timing-future-design.md`.

Older inventory assertions and deterministic supply snapshots were updated for the
expanded bank. The exhaustive supply test exceeded its former 5-second limit
(observed 6,264 ms), so its bounded allowance is now 10 seconds; behavioral assertions
remain intact. Changed seeded patient choices and existing stranded-concept diagnostics
are not evidence of a scheduler fix; no scheduler code changed.

This checkpoint is local and uncommitted. No push, merge or deployment occurred in
this batch. Ask the owner to say **"push to GitHub"** for a scoped backup. GS-006
remains open, and normal launch remains `START_GAME.cmd` at `http://127.0.0.1:4173`.


## Ordered concept IDs

1. `concept.adrenal-incidentaloma.one-mg-dst`
2. `concept.adrenal-incidentaloma.pheochromocytoma-before-biopsy`
3. `concept.mammary-paget.full-thickness-biopsy`
4. `concept.mammary-paget.underlying-breast-evaluation`
5. `concept.inflammatory-breast-cancer.core-biopsy-confirmation`
6. `concept.inflammatory-breast-cancer.neoadjuvant-sequence`
7. `concept.aaa.one-time-ultrasound-screening`
8. `concept.aaa.six-cm-elective-repair-referral`
9. `concept.fecal-incontinence.first-line-stool-care`
10. `concept.fecal-incontinence.endoanal-ultrasound-repair-planning`
11. `concept.h-pylori-ulcer.active-infection-testing`
12. `concept.h-pylori-ulcer.test-of-cure-plan`
13. `concept.diverticulitis.first-presentation-ct`
14. `concept.diverticulitis.selected-supportive-care`
15. `concept.thyroglossal-duct-cyst.ultrasound`
16. `concept.thyroglossal-duct-cyst.sistrunk-referral`
17. `concept.rectal-prolapse.dynamic-defecography`
18. `concept.rectal-prolapse.surgical-referral`
19. `concept.eoe.multilevel-esophageal-biopsies`
20. `concept.eoe.dilation-plus-anti-inflammatory-care`

## Authored version binding

SHA-256 hashes below use UTF-8 text with CRLF normalized to LF. They bind the
editorially accepted source version; they do not represent clinician sign-off.

| SHA-256 | Source file |
| --- | --- |
| `f968960ae292444ffa1dfddfab526fb1b7792af01e6d9849b5ae58aa37554b42` | `packages/clinical-content/src/development-batch/2026-09-17/batch-helpers.ts` |
| `8f207980ed447db18f21a3d85cc8c756f0f0e2998bc9481bccf7698a8e98b4f7` | `packages/clinical-content/src/development-batch/2026-09-17/adrenal-incidentaloma.ts` |
| `4c4c27ce5d13ac439682056b4491f101c0952f21f7e0f99d8613cc613904951c` | `packages/clinical-content/src/development-batch/2026-09-17/mammary-paget-disease.ts` |
| `a5cabef53a078d5c4813c9bb3b844fdde15ce9451fd30d5673200f5daa2be2a8` | `packages/clinical-content/src/development-batch/2026-09-17/inflammatory-breast-cancer.ts` |
| `fedeb0000b3debd1f8a9c54145f8a88ed29adf4323a9d087a3cb77f1050efdf9` | `packages/clinical-content/src/development-batch/2026-09-17/abdominal-aortic-aneurysm.ts` |
| `0634e99a756b414771d10313eb67acb6a577b426354d1d42a52d7a4e4e266d77` | `packages/clinical-content/src/development-batch/2026-09-17/fecal-incontinence.ts` |
| `f0da2650915bd648d71e5c4daafc9b12a1955ea8fad2b825d2f1b5d135c16d91` | `packages/clinical-content/src/development-batch/2026-09-17/h-pylori-ulcer.ts` |
| `96ae15680a357b7cfb5b065f42b3156dee95b7f4efe9a1c4d7b471d1d6fd29a7` | `packages/clinical-content/src/development-batch/2026-09-17/uncomplicated-diverticulitis.ts` |
| `2e631e23961bcf0e45d165f4a833f9675fc43ec13b242e19ed04745d17580770` | `packages/clinical-content/src/development-batch/2026-09-17/thyroglossal-duct-cyst.ts` |
| `a30392e19f4e130c66aa8070d8703ac22259b7524f9a11c53fc5d5ba622e26c6` | `packages/clinical-content/src/development-batch/2026-09-17/rectal-prolapse.ts` |
| `a29b441a77852591051d9268f094126e89f1a8ad982f43e0f0da1a9804c2a823` | `packages/clinical-content/src/development-batch/2026-09-17/eosinophilic-esophagitis.ts` |
| `360561d1f1607b99e5f23af95fe56d757408a7afd118cf9e9c1cf6c3cee28846` | `packages/clinical-content/src/development-batch/2026-09-17/brief-early-levels-batch.ts` |
