# September 13 early-level concept batch

## Authority and current status

The owner delegated creation, editorial approval, and implementation of twenty
additional concept groups for the first three surgery-center levels. Root has
accepted the objective roster, source contracts, authored versions, and runtime
implementation on September 13, 2026. This is final delegated editorial acceptance.
All new clinical records retain needs_clinician_review and null clinician
sign-off in the explicitly unapproved prototype. No public release is authorized.

## Curriculum mapping

SCORE, *General Surgery Curriculum Outline 2025–2026*, public
[official PDF](https://absprodeus2scorestor.blob.core.windows.net/score/curriculumoutline_gs.pdf),
verified September 13, 2026, 27 physical pages; SHA-256
`2b98112b218e0b612fe6ea2f8ad5cf7c6f4555d79289c2f569234aa6b5748c09`.
These are family-level mappings. Specific diagnostic tests and management
decisions are inferred applications, separately supported by clinical sources.
The public outline does not establish individual examination frequency.

| Family (two objectives each) | Named SCORE family/procedure | Printed / physical page |
| --- | --- | --- |
| Duct-stone evaluation and therapeutic referral | Benign Biliary Obstruction | 3 / 4 |
| Bile-leak localization and minor-leak referral | Iatrogenic Bile Duct Injury | 3 / 4 |
| Inflammatory pancreatic collection imaging and symptomatic drainage referral | Acute Pancreatitis | 4 / 5 |
| Objective reflux evaluation and preoperative manometry | Gastroesophageal Reflux and Barrett Esophagus; Antireflux Procedures | 5 / 6 |
| Postbariatric hypoglycemia recognition and initial dietary care | Bariatric Surgery | 6 / 7 |
| Colorectal-tumor MMR screening and genetics evaluation | Colon Cancer | 7 / 8 |
| Chronic fissure medical treatment and selected operative referral | Anal Fissure | 8 / 9 |
| Cutaneous SCC biopsy and risk-directed surgery | Nonmelanoma Skin Cancers | 11 / 12 |
| Venous-ulcer arterial assessment and compression | Venous Stasis and Chronic Venous Insufficiency | 15 / 16 |
| Splenectomy vaccine preparation and fever escalation | Splenectomy and Splenorrhaphy | 5 / 6 |

Postbariatric hypoglycemia is an inferred postoperative complication within the
named bariatric procedure, not a separately listed topic. Likewise, Lynch tumor
triage and pseudocyst management are applications within their named families.
ABSITE alignment with SCORE was rechecked in the
[official ABSITE outline](https://www.absurgery.org/resources/exam-content-outlines/general-surgery-in-training-examination-absite-content-outline/).
See [board scope](../BOARD_CONTENT_SCOPE.md) for distinct ABS exam contexts.

## Source and presentation boundaries

Source contracts: [foregut and biliary](../../execplans/early-levels-source-foregut-2026-09-13.md)
and [clinic](../../execplans/early-levels-source-clinic-2026-09-13.md).
Medical facts are independently synthesized with atomic claim provenance,
access dates, reuse restrictions, and limitations. No proprietary examination
questions or SCORE modules were used. The owner's live concept sheet was read
as a candidate list, without copying it into the repository.

Runtime stages 0–2 represent the requested first three levels. Care beyond
available capabilities uses explicit external diagnostic or referral pathways.
Chief complaints are concise visit reasons, presentations use the runtime
patient name, and age/sex remain coherent with the selected character. Testing
options use centralized runtime estimates, including distractors. Durations
remain gameplay placeholders, not medical turnaround promises.

## Final acceptance evidence

Accepted 20 scored concepts, 80 question variants, and 52 patient encounters:
28 two-step diagnostic pathways and 24 single-step visits. The first three
facility stages contain 32, 12, and 8 new cases respectively. Twenty clinical
sources support 21 atomic claims. Four external diagnostic services were added.

Root reviewed each family, presentation, decision structure, timing assignments,
and actual integration diffs. Sol authored the foregut half and integrated the
batch; Terra authored the clinic half and investigated level capabilities.
Sol resolved final clinical wording and timing corrections under root review.

Root validation passed: 354 clinical-content tests, 432 player tests, and 13
balance tests. The domain run passed 318 of 319 tests initially; the remaining
test was an outdated exact patient allowlist. Its two-line update preserves
withdrawal exclusions, and all four tests in that file pass on rerun. Thus all
1,118 distinct tests covered by these suites pass after the correction. Build,
launcher/dependency boundaries, and all seven workspace typechecks also pass.
The production build reports its existing large-bundle advisory.

Independent runtime comparison confirms 143 concepts, 350 cases, and 543 nodes;
all historical 123 concepts and 298 cases remain unchanged. All 208 new patient
profiles have coherent age/sex and named presentations. Every testing option has
a valid central timing profile. Domain coverage exercises all 52 encounters at
their earliest stage, result withholding and delivery, emergency referral without
test delay, pending save/reload, and one learning review per answered node.
Player coverage checks all 80 nodes, demographics/character matching, and times.

This is a local, unpushed checkpoint. No owner browser storage was changed and
no deployment or public release occurred. Named clinician approval remains
pending; editorial acceptance does not replace it.

### Ordered concept IDs

1. `concept.choledocholithiasis.intermediate-mrcp`
2. `concept.choledocholithiasis.confirmed-stone-therapy`
3. `concept.bile-leak.hepatobiliary-contrast-mrcp`
4. `concept.bile-leak.minor-leak-ercp-stent`
5. `concept.pseudocyst.contrast-ct-characterization`
6. `concept.pseudocyst.symptomatic-endoscopic-drainage`
7. `concept.gerd.off-ppi-reflux-monitoring`
8. `concept.gerd.hrm-before-operative-planning`
9. `concept.pbh.completed-whipple-triad`
10. `concept.pbh.initial-dietary-care`
11. `concept.lynch-tumor.universal-mmr-screening`
12. `concept.lynch-tumor.germline-counseling-after-suggestive-ihc`
13. `concept.chronic-anal-fissure.topical-calcium-channel-blocker`
14. `concept.chronic-anal-fissure.lis-after-medical-treatment`
15. `concept.cutaneous-scc.diagnostic-biopsy`
16. `concept.cutaneous-scc.risk-directed-surgery`
17. `concept.venous-leg-ulcer.arterial-assessment-before-compression`
18. `concept.venous-leg-ulcer.compression-with-adequate-arterial-perfusion`
19. `concept.elective-splenectomy.encapsulated-organism-vaccine-review`
20. `concept.asplenia.fever-emergency-action`

### LF-normalized authored-source hashes

| SHA-256 | Source file |
| --- | --- |
| `e292194141033092c61dc9c66aea71a09c9d7f3af2065b3bffc603c6307df231` | `packages/clinical-content/src/development-batch/2026-09-13/batch-helpers.ts` |
| `2fdb435914dca205b360babe8b314e840a403da29230465aff5e877b51ec2498` | `packages/clinical-content/src/development-batch/2026-09-13/choledocholithiasis.ts` |
| `b9901b2ae16d49c046e5b2a028d24677e7cb11b349e61741c70b23a9b88cf818` | `packages/clinical-content/src/development-batch/2026-09-13/post-cholecystectomy-bile-leak.ts` |
| `7212bd92e8cfe4036c51a4e28743b9029595ce275daa81a1bc3ed6d526f936ac` | `packages/clinical-content/src/development-batch/2026-09-13/pancreatic-pseudocyst.ts` |
| `7c9e3784a58170e34b6714f39548b329d47b1bd0ecd9c9824b53a6200e2e69e5` | `packages/clinical-content/src/development-batch/2026-09-13/preoperative-gerd.ts` |
| `b3115c605fdb472e454dcbc76f65e2728d3bb123f791a7f2265939e27f64bee8` | `packages/clinical-content/src/development-batch/2026-09-13/post-bariatric-hypoglycemia.ts` |
| `10a4184a5097da5aa4a7cabb350b724f451a5352c4ab82fec01bf76ba3849747` | `packages/clinical-content/src/development-batch/2026-09-13/lynch-tumor.ts` |
| `b6b306715df0b3808d77ee6bc300aeda8e878417d831e654f5f5d66f554e986e` | `packages/clinical-content/src/development-batch/2026-09-13/chronic-anal-fissure.ts` |
| `9593272361d9f50cffbb2fda9c45349326fac7428f12053de24ab41b4c9bd5c1` | `packages/clinical-content/src/development-batch/2026-09-13/cutaneous-scc.ts` |
| `93d73f559e02bc0781ded8790e78a29bc436f8a9669b7274d343130f3e864fd6` | `packages/clinical-content/src/development-batch/2026-09-13/venous-leg-ulcer.ts` |
| `96368b847bba7753a538fbb9f9f3e4db7f3708620b6f67c01e2fde5381a672a4` | `packages/clinical-content/src/development-batch/2026-09-13/splenectomy-infection-prevention.ts` |
| `99dbc44d73b6b030a4f6d50bcddf2236cdf797bac3fc1bde754a3bae2925e4d5` | `packages/clinical-content/src/development-batch/2026-09-13/early-levels-batch.ts` |

### GS-021 operational amendment — September 17, 2026

The owner-approved GS-021 service catalog authorized onsite minor-procedure-room acquisition for the already-authored cutaneous-lesion biopsy, while retaining external pathology. The operational amendment adds the facility capability gate and route contract only. It does not change the teaching text, answer key, evidence claims, review status, or represent new clinician approval.

The previously recorded LF-normalized SHA-256 for cutaneous-scc.ts was e1f31f6e13d6ea3f45045ff7c350975bcbd8b84f84712709c3b7b8acbc3b3493. The canonical table now records the replacement operationally amended source hash.
